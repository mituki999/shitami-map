/* Shitami プロトタイプ — 地図 ⇄ ショート動画 の行き来を確かめる
   データ(data.js)は collector/build.mjs が生成する。動画は TikTok / YouTube の公式埋め込みで再生 */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

// 外部サービス由来の文字列は必ずエスケープして埋める
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// 自己修復: 再生時にプレイヤーが「無効な動画」と返したものを覚えておき、次回から出さない。
// 収集時の検証をすり抜けた動画や、収集後に消えた動画への最後の守り。
// (プロトタイプでは端末内に記録。本番ではサーバーへ報告し、全員のデータから外す)
const dead = (() => {
  try { return new Set(JSON.parse(localStorage.getItem('shitami.dead') || '[]')); } catch { return new Set(); }
})();
function markDead(videoId) {
  dead.add(videoId);
  try { localStorage.setItem('shitami.dead', JSON.stringify([...dead])); } catch { /* 記録できなくても動かす */ }
}
for (let i = PLACES.length - 1; i >= 0; i--) {
  PLACES[i].videos = PLACES[i].videos.filter((v) => !dead.has(`${v.src}-${v.vid}`));
  if (!PLACES[i].videos.length) PLACES.splice(i, 1); // 動画が残っていない場所は地図に出さない
}

// 動画を平坦化(各動画は必ず1つの場所に紐づく = このアプリの中心となるデータ構造)
const VIDEOS = PLACES.flatMap((p, i) =>
  p.videos.map((v, j) => ({ ...v, id: `${v.src}-${v.vid}`, place: p, lock: i * 10 + j + 1, rank: j }))
);
const placeById = Object.fromEntries(PLACES.map((p) => [p.id, p]));
const placeLock = (p) => PLACES.indexOf(p) * 10 + 1;
const SRC = { tiktok: 'TikTok', youtube: 'YouTube' };
// TikTokの埋め込みは、埋め込み元が localhost / IPアドレス / リファラなし だとサーバー側で拒否される(status 40302 "embed request rejected")
const IS_LOCAL = /^(localhost|[\d.]+|\[.*\])$/.test(location.hostname);

// 写真: 色+絵文字のプレースホルダの上に、あれば実画像(サムネイル)を重ねる
const photo = (p, lock = 0, src = p.photo) =>
  `<span class="ph" style="--h:${p.hue + (lock % 10) * 9}"><span class="ph-e">${p.emoji}</span>` +
  (src ? `<img src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : '') +
  `</span>`;

const routeUrl = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
const searchUrl = (p) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + REGION.name)}`;

/* ---------- 保存(行きたいリスト) ---------- */
const store = {
  get(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch { return new Set(); }
  },
  set(key, set) {
    try { localStorage.setItem(key, JSON.stringify([...set])); } catch { /* 保存できなくても動かす */ }
  },
};
const saved = store.get('shitami.saved');
const liked = store.get('shitami.liked');
[...saved].forEach((id) => placeById[id] || saved.delete(id)); // 地域を切り替えた後の古い保存を掃除

function toggleSave(placeId) {
  const on = !saved.has(placeId);
  on ? saved.add(placeId) : saved.delete(placeId);
  store.set('shitami.saved', saved);
  toast(on ? '🔖 行きたいリストに保存しました' : '保存を解除しました');
  refreshSaveUI();
}

function refreshSaveUI() {
  $('#saved-badge').textContent = saved.size || '';
  $$('[data-act="save"]').forEach((el) => el.classList.toggle('on', saved.has(el.dataset.place)));
  renderSaved();
}

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ---------- タブ ---------- */
function showTab(tab) {
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${tab}`));
  $$('#tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  if (tab === 'map') map.invalidateSize();
}
$('#tabbar').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) showTab(b.dataset.tab);
});

/* ---------- 地図 ---------- */
const map = L.map('map', { zoomControl: false }).setView(REGION.center, REGION.zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const markers = {};
PLACES.forEach((p) => {
  const icon = L.divIcon({
    className: '',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
    html: `<div class="pin" data-pin="${p.id}"><div class="pin-img">${photo(p, placeLock(p))}</div><span class="pin-count">▶${p.videos.length}</span></div>`,
  });
  markers[p.id] = L.marker([p.lat, p.lng], { icon, title: p.name }).addTo(map).on('click', () => selectPlace(p.id));
});
map.on('click', closeSheet);

let catFilter = 'all';
let selectedId = null;

function renderCatChips() {
  $('#cat-chips').innerHTML =
    `<button class="chip ${catFilter === 'all' ? 'on' : ''}" data-cat="all">すべて</button>` +
    Object.entries(CATS)
      .map(([k, c]) => `<button class="chip ${catFilter === k ? 'on' : ''}" data-cat="${k}">${c.emoji} ${c.label}</button>`)
      .join('');
}
$('#cat-chips').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  catFilter = b.dataset.cat;
  renderCatChips();
  updatePins();
});

function updatePins() {
  PLACES.forEach((p) => {
    const el = markers[p.id].getElement()?.querySelector('.pin');
    if (!el) return;
    el.classList.toggle('dim', catFilter !== 'all' && p.cat !== catFilter);
    el.classList.toggle('sel', p.id === selectedId);
    markers[p.id].setZIndexOffset(p.id === selectedId ? 1000 : 0);
  });
}

function selectPlace(id) {
  const p = placeById[id];
  selectedId = id;
  renderSheet(p);
  updatePins();
  // シートに隠れないよう、ピンを画面の上寄りに置く
  const zoom = Math.max(map.getZoom(), 17);
  const pt = map.project([p.lat, p.lng], zoom).add([0, map.getSize().y * 0.22]);
  map.setView(map.unproject(pt, zoom), zoom, { animate: true });
}

function closeSheet() {
  selectedId = null;
  $('#sheet').classList.remove('open');
  $('#sheet').setAttribute('aria-hidden', 'true');
  updatePins();
}

function renderSheet(p) {
  const vids = VIDEOS.filter((v) => v.place === p);
  const sheet = $('#sheet');
  sheet.innerHTML = `
    <div class="sheet-grip"></div>
    <div class="sheet-head">
      <div class="sheet-thumb">${photo(p, placeLock(p))}</div>
      <div>
        <h2>${esc(p.name)}</h2>
        <div class="sheet-meta">${CATS[p.cat].emoji} ${CATS[p.cat].label} ・ ${AREAS[p.area].label}</div>
      </div>
      <button class="sheet-close" data-act="close" aria-label="閉じる">✕</button>
    </div>
    <p class="sheet-desc">${esc(p.desc)}</p>
    <div class="sheet-info">
      営業時間・価格は <a href="${searchUrl(p)}" target="_blank" rel="noopener">Googleマップ</a> で確認${p.approx ? '<br>📍 ピンの位置はおおよそです' : ''}
    </div>
    <div class="sheet-actions">
      <button class="btn primary" data-act="watch" data-place="${p.id}">▶ 動画で下見</button>
      <a class="btn" href="${routeUrl(p)}" target="_blank" rel="noopener">🧭 行く</a>
      <button class="btn ${saved.has(p.id) ? 'on' : ''}" data-act="save" data-place="${p.id}">🔖 保存</button>
    </div>
    <h3>この場所のショート動画(${vids.length})</h3>
    <div class="thumbs">
      ${vids
        .map(
          (v, i) => `<button class="thumb" data-act="watch" data-place="${p.id}" data-start="${i}">
            ${photo(p, v.lock, v.thumb)}<span class="thumb-play">▶ ${SRC[v.src]}</span><span class="thumb-t">${esc(v.t)}</span>
          </button>`
        )
        .join('')}
    </div>`;
  sheet.scrollTop = 0;
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
}

$('#sheet').addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const { act, place, start } = el.dataset;
  if (act === 'close') closeSheet();
  if (act === 'save') toggleSave(place);
  if (act === 'watch') watchPlace(place, Number(start) || 0);
});

function watchPlace(placeId, start = 0) {
  const p = placeById[placeId];
  openFeed(VIDEOS.filter((v) => v.place === p), `📍 ${p.name}`, start);
}

/* 動画 → 地図 */
function showOnMap(placeId) {
  closeFeed();
  if (catFilter !== 'all' && placeById[placeId].cat !== catFilter) {
    catFilter = 'all';
    renderCatChips();
  }
  showTab('map');
  selectPlace(placeId);
}

/* ---------- 気分から探す ---------- */
const mood = { area: 'any', who: 'date', cats: new Set() };

function moodMatches() {
  return VIDEOS.filter(
    (v) =>
      (mood.area === 'any' || v.place.area === mood.area) &&
      v.who.includes(mood.who) &&
      (mood.cats.size === 0 || mood.cats.has(v.place.cat))
  ).sort((a, b) => a.rank - b.rank || a.lock - b.lock); // 同じ場所が続かないよう、各場所の1本目→2本目…の順
}

function renderMood() {
  const chip = (on, attrs, label) => `<button class="chip ${on ? 'on' : ''}" ${attrs}>${label}</button>`;
  $('#mood-area').innerHTML =
    chip(mood.area === 'any', 'data-area="any"', `${REGION.name}ぜんぶ`) +
    Object.entries(AREAS).map(([k, a]) => chip(mood.area === k, `data-area="${k}"`, a.label)).join('');
  $('#mood-who').innerHTML = Object.entries(WHO)
    .map(([k, w]) => chip(mood.who === k, `data-who="${k}"`, `${w.emoji} ${w.label}`))
    .join('');
  $('#mood-cat').innerHTML = Object.entries(CATS)
    .map(([k, c]) => chip(mood.cats.has(k), `data-cat="${k}"`, `${c.emoji} ${c.label}`))
    .join('');
  const n = moodMatches().length;
  const go = $('#mood-go');
  go.disabled = n === 0;
  go.textContent = n ? `▶ ${n}本の動画を見る` : '条件に合う動画がありません';
}

$('#view-mood').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  const d = b.dataset;
  if (d.area) mood.area = d.area;
  if (d.who) mood.who = d.who;
  if (d.cat) mood.cats.has(d.cat) ? mood.cats.delete(d.cat) : mood.cats.add(d.cat);
  renderMood();
});

$('#mood-go').addEventListener('click', () => {
  const area = mood.area === 'any' ? REGION.name : AREAS[mood.area].label;
  openFeed(moodMatches(), `${area} × ${WHO[mood.who].emoji} ${WHO[mood.who].label}`);
});

/* ---------- 行きたいリスト ---------- */
function renderSaved() {
  const list = PLACES.filter((p) => saved.has(p.id));
  $('#saved-list').innerHTML = list.length
    ? list
        .map(
          (p) => `<div class="saved-card">
            <div class="saved-thumb">${photo(p, placeLock(p))}</div>
            <div class="saved-body">
              <b>${esc(p.name)}</b>
              <div class="sheet-meta">${CATS[p.cat].emoji} ${CATS[p.cat].label} ・ ${AREAS[p.area].label}</div>
              <div class="saved-actions">
                <button class="btn" data-act="watch" data-place="${p.id}">▶ 動画</button>
                <button class="btn" data-act="map" data-place="${p.id}">🗺️ 地図</button>
                <a class="btn primary" href="${routeUrl(p)}" target="_blank" rel="noopener">🧭 行く</a>
                <button class="btn" data-act="save" data-place="${p.id}">✕</button>
              </div>
            </div>
          </div>`
        )
        .join('')
    : `<div class="empty"><span>🔖</span>まだ保存した場所がありません。<br>動画や地図で「保存」を押すとここに並びます。</div>`;
}

$('#saved-list').addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const { act, place } = el.dataset;
  if (act === 'watch') watchPlace(place);
  if (act === 'map') showOnMap(place);
  if (act === 'save') toggleSave(place);
});

/* ---------- 動画フィード ---------- */
const feedEl = $('#feed');
const feedScroll = $('#feed-scroll');

// いま画面にある1本だけプレイヤーを読み込み、離れたら破棄する(通信量と各社の利用上限を抑える)
let playingClip = null;
function syncPlaying() {
  const idx = Math.round(feedScroll.scrollTop / (feedScroll.clientHeight || 1));
  const cur = $$('.clip', feedScroll)[idx] || null;
  if (cur === playingClip) return;
  if (playingClip) {
    playingClip.classList.remove('playing', 'paused', 'live');
    $('.clip-player', playingClip).replaceChildren();
    $('.clip-progress i', playingClip).style.width = '';
  }
  playingClip = cur;
  if (!cur) return;
  cur.classList.add('playing');
  mountPlayer(cur);
}
feedScroll.addEventListener('scroll', syncPlaying, { passive: true });

/* ---------- 公式埋め込みプレイヤー(TikTok / YouTube) ----------
   iframeは pointer-events:none にして縦スワイプを邪魔させず、再生/停止・消音は postMessage で操作する。
   自動再生を確実にするため消音で始め、🔊ボタンで音を出す。 */
const ORIGIN = { tiktok: 'https://www.tiktok.com', youtube: 'https://www.youtube.com' };
let muted = true;

function mountPlayer(clip) {
  const { src, vid } = clip.dataset;
  const f = document.createElement('iframe');
  f.allow = 'autoplay; encrypted-media; fullscreen';
  f.title = SRC[src];
  if (src === 'tiktok') {
    f.src = `${ORIGIN.tiktok}/player/v1/${vid}?autoplay=1&loop=1&controls=0&rel=0&music_info=0&description=0&native_context_menu=0&closed_caption=0`;
  } else {
    f.src = `${ORIGIN.youtube}/embed/${vid}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${vid}&controls=0&playsinline=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
    // YouTubeは「聞いています」と伝えると再生状態・再生位置を送ってくる
    f.addEventListener('load', () => f.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), ORIGIN.youtube));
  }
  $('.clip-player', clip).replaceChildren(f);
}

function command(name) {
  const clip = playingClip;
  const win = clip && $('iframe', clip)?.contentWindow;
  if (!win) return;
  if (clip.dataset.src === 'tiktok') {
    const type = { play: 'play', pause: 'pause', mute: 'mute', unmute: 'unMute' }[name];
    win.postMessage({ type, 'x-tiktok-player': true }, ORIGIN.tiktok);
  } else {
    const func = { play: 'playVideo', pause: 'pauseVideo', mute: 'mute', unmute: 'unMute' }[name];
    win.postMessage(JSON.stringify({ event: 'command', func, args: [] }), ORIGIN.youtube);
  }
}

function setMuted(m) {
  muted = m;
  command(m ? 'mute' : 'unmute');
  $$('[data-act="mute"]', feedScroll).forEach((b) => {
    b.firstElementChild.textContent = m ? '🔇' : '🔊';
    b.classList.toggle('on', !m);
  });
}

function onState({ playing, paused, time, duration, error, gone }) {
  const clip = playingClip;
  if (gone) {
    // 削除・非公開・埋め込み不可が確定: 記録して、次の動画へ自動で進む
    markDead(clip.dataset.id);
    const next = clip.nextElementSibling;
    toast('公開が終了した動画をスキップしました');
    if (next) setTimeout(() => clip === playingClip && next.scrollIntoView({ behavior: 'smooth' }), 700);
  }
  if (playing) clip.classList.add('live'); // 再生が始まったらサムネイルを隠す
  if (playing || paused) clip.classList.toggle('paused', !!paused);
  if (duration) clip._dur = duration;
  if (time != null && clip._dur) $('.clip-progress i', clip).style.width = Math.min(100, (time / clip._dur) * 100) + '%';
  if (error) clip.classList.add('player-error');
}

window.addEventListener('message', (e) => {
  const frame = playingClip && $('iframe', playingClip);
  if (!frame || e.source !== frame.contentWindow) return;
  let d = e.data;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch { return; } }
  if (!d) return;

  if (e.origin === ORIGIN.tiktok && d['x-tiktok-player']) {
    const v = d.value;
    if (d.type === 'onPlayerReady') command(muted ? 'mute' : 'unmute');
    if (d.type === 'onStateChange') onState({ playing: v === 1, paused: v === 2 });
    if (d.type === 'onCurrentTime') onState({ time: v?.currentTime, duration: v?.duration });
    if (d.type === 'onPlayerError') {
      if (v?.errorCode === 3002) { setMuted(true); command('play'); } // 音あり自動再生をブラウザが止めた
      else onState({ error: true, gone: v?.errorCode === 1001 }); // 1001 = 無効な動画。2001等は一時的なエラーなので記録しない
    }
  }
  if (e.origin === ORIGIN.youtube) {
    const i = d.info;
    if (d.event === 'onError') onState({ error: true, gone: [100, 101, 150].includes(i) }); // 削除・非公開・埋め込み禁止
    if (i && typeof i === 'object') onState({ playing: i.playerState === 1, paused: i.playerState === 2, time: i.currentTime, duration: i.duration });
  }
});

function openFeed(list, title, start = 0) {
  if (!list.length) return;
  $('#feed-title').textContent = title;
  feedScroll.innerHTML = list
    .map((v) => {
      const p = v.place;
      return `<article class="clip" data-id="${esc(v.id)}" data-src="${v.src}" data-vid="${esc(v.vid)}">
        <div class="clip-bg">${photo(p, v.lock, v.thumb)}</div>
        <div class="clip-player"></div>
        <div class="clip-error"><div>ここでは再生できませんでした<br><small>${
          v.src === 'tiktok' && IS_LOCAL
            ? 'TikTokは localhost のページからの埋め込みを拒否します。<br>公開ドメインで開くと再生できます'
            : `削除・非公開の動画か、${SRC[v.src]}側の一時的なエラーです`
        }</small><br>
          <a class="btn" href="${esc(v.url)}" target="_blank" rel="noopener">${SRC[v.src]}で開く ↗</a></div></div>
        <div class="clip-pause">⏸</div>
        <div class="clip-side">
          <button class="side-btn ${muted ? '' : 'on'}" data-act="mute"><span>${muted ? '🔇' : '🔊'}</span>音</button>
          <button class="side-btn ${liked.has(v.id) ? 'on' : ''}" data-act="like" data-video="${esc(v.id)}"><span>❤️</span>いいね</button>
          <button class="side-btn ${saved.has(p.id) ? 'on' : ''}" data-act="save" data-place="${p.id}"><span>🔖</span>行きたい</button>
          <a class="side-btn" href="${routeUrl(p)}" target="_blank" rel="noopener"><span>🧭</span>行く</a>
        </div>
        <div class="clip-info">
          <a class="clip-by" href="${esc(v.url)}" target="_blank" rel="noopener">@${esc(v.by)} ・ ${SRC[v.src]} ↗</a>
          <div class="clip-title">${esc(v.t)}</div>
          <button class="place-chip" data-act="map" data-place="${p.id}">
            <span class="place-chip-img">${photo(p, placeLock(p))}</span>
            <span class="place-chip-txt"><b>${esc(p.name)}</b><small>${CATS[p.cat].label} ・ ${AREAS[p.area].label}</small></span>
            <em>地図で見る ›</em>
          </button>
        </div>
        <div class="clip-progress"><i></i></div>
      </article>`;
    })
    .join('');
  feedEl.hidden = false;
  playingClip = null;
  feedScroll.scrollTop = start * feedScroll.clientHeight;
  syncPlaying();
}

function closeFeed() {
  feedEl.hidden = true;
  playingClip = null;
  feedScroll.innerHTML = '';
}
$('#feed-close').addEventListener('click', closeFeed);

feedScroll.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (el) {
    const { act, place, video } = el.dataset;
    if (act === 'map') showOnMap(place);
    if (act === 'save') toggleSave(place);
    if (act === 'mute') setMuted(!muted);
    if (act === 'like') {
      liked.has(video) ? liked.delete(video) : liked.add(video);
      store.set('shitami.liked', liked);
      el.classList.toggle('on', liked.has(video));
    }
    return;
  }
  if (e.target.closest('a')) return;
  const clip = e.target.closest('.clip'); // タップで一時停止/再開
  if (clip && clip === playingClip) {
    const resume = clip.classList.contains('paused');
    clip.classList.toggle('paused', !resume);
    command(resume ? 'play' : 'pause');
  }
});

// PC確認用: ↑↓ で前後の動画、Esc で閉じる
document.addEventListener('keydown', (e) => {
  if (feedEl.hidden) return;
  if (e.key === 'Escape') closeFeed();
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    feedScroll.scrollBy({ top: (e.key === 'ArrowDown' ? 1 : -1) * feedScroll.clientHeight, behavior: 'smooth' });
  }
});

/* ---------- 起動 ---------- */
renderCatChips();
renderMood();
refreshSaveUI();
