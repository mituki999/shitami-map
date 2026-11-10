// 収集パイプラインの後半: 「候補」を検証して、アプリが読む public/data.js を作る。
//
//   places.json      … 対象スポット(名前・検索語・住所・カテゴリ)
//   candidates.json  … AIがWeb検索で見つけた動画URLと、説明文から付けた「ひとこと」「誰と」
//        ↓ node collector/build.mjs
//   public/data.js   … 生存確認済みの動画だけが載った地図データ
//
// やること: ①場所を緯度経度に変換 ②動画が今も公開・埋め込み可能か公式oEmbedで確認
//           ③YouTubeはタイトル・投稿者・サムネイルも取得 ④死んでいる動画は落として報告
// 定期的に回せば、削除された動画が自動で消える(=「元動画が消えると再生できない」への対処)。

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = async (f, fallback) => {
  try { return JSON.parse(await readFile(path.join(dir, f), 'utf8')); } catch (e) { if (fallback !== undefined) return fallback; throw e; }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { 'User-Agent': 'shitami-map-prototype/0.1 (local build script)' };
const getJson = async (url) => {
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
};

// 対象区画: 浅草(雷門〜浅草寺〜六区)。この枠の外に出た位置情報は誤りとして捨てる
const BOX = { s: 35.7085, n: 35.7175, w: 139.7895, e: 139.8005 };
const inBox = (lat, lng) => lat > BOX.s && lat < BOX.n && lng > BOX.w && lng < BOX.e;
const ZONES = {
  kaminarimon: { label: '雷門・仲見世', center: [35.7112, 139.7964] },
  denboin: { label: "伝法院通り・新仲見世", center: [35.7122, 139.7953] },
  sensoji: { label: '浅草寺・西参道', center: [35.7147, 139.7962] },
  rokku: { label: "六区・ホッピー通り", center: [35.7138, 139.7936] },
};
const nearestZone = (lat, lng) =>
  Object.entries(ZONES).sort(
    ([, a], [, b]) => Math.hypot(a.center[0] - lat, a.center[1] - lng) - Math.hypot(b.center[0] - lat, b.center[1] - lng)
  )[0][0];

/* ---------- ① 位置: 店名(OpenStreetMap) → だめなら住所(国土地理院) ---------- */
const cache = await read('cache.json', { geo: {} });

// 信頼順: 手で確定した座標(at) > 動画の説明文に書かれていた住所(addrSrc:"caption") > 店名でOSM検索 > 未確認の住所(approx)
async function byName(p) {
  try {
    const u = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=jp&bounded=1&viewbox=${BOX.w},${BOX.n},${BOX.e},${BOX.s}&q=${encodeURIComponent(p.q)}`;
    const res = await getJson(u);
    await sleep(1100); // Nominatimの利用規約: 1秒に1回まで
    const r = res.find((x) => inBox(+x.lat, +x.lon));
    return r ? { lat: +r.lat, lng: +r.lon, by: 'osm-name' } : null;
  } catch { return null; }
}
async function byAddress(p, approx) {
  if (!p.addr) return null;
  try {
    const res = await getJson('https://msearch.gsi.go.jp/address-search/AddressSearch?q=' + encodeURIComponent(p.addr));
    const c = res[0]?.geometry?.coordinates;
    return c && inBox(c[1], c[0]) ? { lat: c[1], lng: c[0], by: 'gsi-address', ...(approx && { approx: true }) } : null;
  } catch { return null; }
}
async function geocode(p) {
  if (p.at) return { lat: p.at[0], lng: p.at[1], by: 'fixed' };
  if (cache.geo[p.id]) return cache.geo[p.id];
  const hit = p.addrSrc === 'caption'
    ? (await byAddress(p, false)) || (await byName(p))
    : (await byName(p)) || (await byAddress(p, true));
  if (hit) cache.geo[p.id] = hit;
  return hit;
}

/* ---------- ②③ 動画: URL → {src, vid} → oEmbedで生存確認 ---------- */
function parseVideo(url) {
  const u = new URL(url);
  if (u.hostname.endsWith('tiktok.com')) {
    const m = u.pathname.match(/^\/@([\w.-]+)\/video\/(\d+)/);
    return m && { src: 'tiktok', vid: m[2], by: m[1] };
  }
  if (u.hostname.endsWith('youtube.com') || u.hostname === 'youtu.be') {
    const vid = u.pathname.match(/^\/shorts\/([\w-]{11})/)?.[1] || u.searchParams.get('v') || (u.hostname === 'youtu.be' && u.pathname.slice(1));
    return vid && { src: 'youtube', vid };
  }
  return null;
}

async function verify(c) {
  const v = parseVideo(c.url);
  if (!v) return { ok: false, why: '対応していないURL' };
  try {
    if (v.src === 'youtube') {
      const d = await getJson('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + v.vid));
      return { ok: true, ...v, by: (d.author_url || '').split('@')[1] || d.author_name, title: d.title, thumb: `https://i.ytimg.com/vi/${v.vid}/hqdefault.jpg` };
    }
    const d = await getJson('https://www.tiktok.com/oembed?url=' + encodeURIComponent(c.url));
    if (!d.embed_product_id) return { ok: false, why: 'oEmbedにIDなし' };
    // 【反省】TikTokのoEmbedは、削除済み・非公開アカウントの動画にも「有効」と返す(2026-11、24本中10本が該当)。
    // そこで動画ページ本体の状態コードまで確認する。0 = 公開中 / 10204 = 削除 / 10222 = 非公開アカウント など
    const st = await tiktokStatus(c.url);
    if (st.code !== 0) return { ok: false, why: TT_STATUS[st.code] || `公開されていない (状態 ${st.code} ${st.msg})` };
    return { ok: true, ...v, title: d.title || '', thumb: d.thumbnail_url || '' };
  } catch (e) {
    // YouTubeのoEmbedは削除・非公開で404、埋め込み禁止で401を返すので、これだけで判定できる
    return { ok: false, why: '非公開・削除・埋め込み不可 (' + e.message + ')' };
  }
}

const TT_STATUS = { 10204: '削除済み', 10222: '非公開アカウント', 10216: '非公開の動画' };
async function tiktokStatus(url) {
  await sleep(400); // 連続アクセスを避ける
  const r = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(25000) });
  const html = await r.text();
  const code = html.match(/"statusCode":(\d+)/)?.[1];
  const msg = html.match(/"statusMsg":"([^"]*)"/)?.[1] || '';
  // 状態が読めないときは「確認できない = 載せない」。確認できた動画だけを地図に出す
  if (code == null) return { code: -1, msg: '状態を読み取れない (HTTP ' + r.status + ')' };
  if (/"privateItem":true|"secret":true/.test(html)) return { code: 10216, msg: 'private' };
  return { code: +code, msg };
}

/* ---------- 実行 ---------- */
const places = await read('places.json');
const candidates = await read('candidates.json');
const TARGET = 2; // 1か所あたりの最低本数。消えても場所が空にならないよう、足りない場所は再収集の対象にする
const today = new Date().toISOString().slice(0, 10);
const embedCheck = await read('embed-check.json', { results: {} });
const report = { checkedAt: today, placesOk: 0, placesNoGeo: [], videosOk: 0, bySource: {}, videosDropped: [], notPlayerTested: [], placesEmpty: [], needMore: [] };
const out = [];

for (const p of places) {
  const geo = await geocode(p);
  if (!geo) { report.placesNoGeo.push(p.name); continue; }
  const videos = [];
  for (const c of candidates.filter((c) => c.place === p.id)) {
    let r = await verify(c);
    // 最終関門: 実際のプレイヤーで再生できなかった記録(public/check.html の結果)があれば載せない。
    // ページ上は公開中でも埋め込みだけ拒否される動画があり、これはプレイヤーで試すまで分からない
    const played = r.ok && embedCheck.results?.[`${r.src}-${r.vid}`];
    if (played && played.ok === false) r = { ok: false, why: `プレイヤーが再生を拒否 (エラー ${played.err})` };
    if (r.ok && !played) report.notPlayerTested.push(c.url);
    if (!r.ok) { report.videosDropped.push({ place: p.name, url: c.url, why: r.why }); continue; }
    videos.push({ src: r.src, vid: r.vid, t: c.t, by: r.by, who: c.who, thumb: r.thumb, url: c.url });
    report.bySource[r.src] = (report.bySource[r.src] || 0) + 1;
  }
  if (videos.length < TARGET) report.needMore.push(`${p.name}(${videos.length}本)`);
  if (!videos.length) { report.placesEmpty.push(p.name); continue; } // 動画のない場所は地図に出さない
  videos.sort((a, b) => !!b.thumb - !!a.thumb); // サムネイルのある動画を先頭に
  out.push({
    id: p.id, name: p.name, cat: p.cat, area: nearestZone(geo.lat, geo.lng),
    lat: +geo.lat.toFixed(6), lng: +geo.lng.toFixed(6), geo: geo.by, approx: !!geo.approx,
    emoji: p.emoji, hue: p.hue, desc: p.desc, photo: videos.find((v) => v.thumb)?.thumb || '',
    videos,
  });
  report.placesOk++;
  report.videosOk += videos.length;
}

await writeFile(path.join(dir, 'cache.json'), JSON.stringify(cache, null, 2));

const js = `// 自動生成: node collector/build.mjs (${new Date().toISOString().slice(0, 10)}) — 手で編集しない
const REGION = ${JSON.stringify({ name: '浅草', center: [35.7128, 139.7952], zoom: 16 })};
const CATS = ${JSON.stringify({
  snack: { label: '食べ歩き', emoji: '🍡' },
  sweets: { label: 'スイーツ', emoji: '🍵' },
  meal: { label: 'ごはん・飲み', emoji: '🍻' },
  sight: { label: '観光', emoji: '⛩️' },
  play: { label: '遊ぶ・体験', emoji: '🎢' },
}, null, 2)};
const AREAS = ${JSON.stringify(ZONES, null, 2)};
const WHO = ${JSON.stringify({
  date: { label: 'デート', emoji: '💑' },
  boys: { label: '男友達', emoji: '🤜' },
  girls: { label: '女友達', emoji: '👯' },
  solo: { label: 'ひとり', emoji: '🚶' },
  family: { label: '家族', emoji: '👨‍👩‍👧' },
}, null, 2)};
const PLACES = ${JSON.stringify(out, null, 2)};
`;
await writeFile(path.join(dir, '..', 'public', 'data.js'), js);
// 落とした動画と「もっと集めるべき場所」を残す。次の収集はこのファイルを見て、不足分だけ探しに行く
await writeFile(path.join(dir, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log(out.map((p) => `${p.name}\t${p.lat},${p.lng}\t${p.geo}\t${p.area}\t${p.videos.length}本`).join('\n'));
