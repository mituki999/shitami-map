// 自動生成: node collector/build.mjs (2026-11-10) — 手で編集しない
const REGION = {"name":"浅草","center":[35.7128,139.7952],"zoom":16};
const CATS = {
  "snack": {
    "label": "食べ歩き",
    "emoji": "🍡"
  },
  "sweets": {
    "label": "スイーツ",
    "emoji": "🍵"
  },
  "meal": {
    "label": "ごはん・飲み",
    "emoji": "🍻"
  },
  "sight": {
    "label": "観光",
    "emoji": "⛩️"
  },
  "play": {
    "label": "遊ぶ・体験",
    "emoji": "🎢"
  }
};
const AREAS = {
  "kaminarimon": {
    "label": "雷門・仲見世",
    "center": [
      35.7112,
      139.7964
    ]
  },
  "denboin": {
    "label": "伝法院通り・新仲見世",
    "center": [
      35.7122,
      139.7953
    ]
  },
  "sensoji": {
    "label": "浅草寺・西参道",
    "center": [
      35.7147,
      139.7962
    ]
  },
  "rokku": {
    "label": "六区・ホッピー通り",
    "center": [
      35.7138,
      139.7936
    ]
  }
};
const WHO = {
  "date": {
    "label": "デート",
    "emoji": "💑"
  },
  "boys": {
    "label": "男友達",
    "emoji": "🤜"
  },
  "girls": {
    "label": "女友達",
    "emoji": "👯"
  },
  "solo": {
    "label": "ひとり",
    "emoji": "🚶"
  },
  "family": {
    "label": "家族",
    "emoji": "👨‍👩‍👧"
  }
};
const PLACES = [
  {
    "id": "kaminarimon",
    "name": "雷門",
    "cat": "sight",
    "area": "kaminarimon",
    "lat": 35.71106,
    "lng": 139.79636,
    "geo": "fixed",
    "approx": false,
    "emoji": "🏮",
    "hue": 5,
    "desc": "浅草の入口に立つ大提灯の門。早朝や夜は人が少なく写真が撮りやすい。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7060650532091825410",
        "t": "早朝の雷門、提灯が消灯する瞬間",
        "by": "ut.hangout.u",
        "who": [
          "solo",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@ut.hangout.u/video/7060650532091825410"
      }
    ]
  },
  {
    "id": "sensoji",
    "name": "浅草寺",
    "cat": "sight",
    "area": "sensoji",
    "lat": 35.71476,
    "lng": 139.79666,
    "geo": "fixed",
    "approx": false,
    "emoji": "⛩️",
    "hue": 12,
    "desc": "都内最古とされる寺。「凶が多い」と話題のおみくじや夜のライトアップも。",
    "photo": "https://i.ytimg.com/vi/Wyb7IN30f4M/hqdefault.jpg",
    "videos": [
      {
        "src": "youtube",
        "vid": "Wyb7IN30f4M",
        "t": "浅草寺のプロジェクションマッピング",
        "by": "CHILLOUT.PLANET",
        "who": [
          "date",
          "family",
          "girls"
        ],
        "thumb": "https://i.ytimg.com/vi/Wyb7IN30f4M/hqdefault.jpg",
        "url": "https://www.youtube.com/shorts/Wyb7IN30f4M"
      },
      {
        "src": "tiktok",
        "vid": "7297240676519922951",
        "t": "浅草寺でおみくじ引いたら凶でした",
        "by": "uki3549",
        "who": [
          "boys",
          "girls",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@uki3549/video/7297240676519922951"
      }
    ]
  },
  {
    "id": "hanayashiki",
    "name": "浅草花やしき",
    "cat": "play",
    "area": "sensoji",
    "lat": 35.715497,
    "lng": 139.794613,
    "geo": "osm-name",
    "approx": false,
    "emoji": "🎢",
    "hue": 300,
    "desc": "日本最古の遊園地。建物すれすれを走るローラーコースターが名物。",
    "photo": "https://i.ytimg.com/vi/wD7bt21SxGg/hqdefault.jpg",
    "videos": [
      {
        "src": "youtube",
        "vid": "wD7bt21SxGg",
        "t": "建物スレスレを走る日本最古のコースター",
        "by": "jetcoasterotoko",
        "who": [
          "boys",
          "date",
          "family"
        ],
        "thumb": "https://i.ytimg.com/vi/wD7bt21SxGg/hqdefault.jpg",
        "url": "https://www.youtube.com/shorts/wD7bt21SxGg"
      },
      {
        "src": "youtube",
        "vid": "Nk9uHxdhjm4",
        "t": "民家に突っ込む?ローラーコースター",
        "by": "jetcoasterotoko",
        "who": [
          "boys",
          "girls",
          "date"
        ],
        "thumb": "https://i.ytimg.com/vi/Nk9uHxdhjm4/hqdefault.jpg",
        "url": "https://www.youtube.com/shorts/Nk9uHxdhjm4"
      },
      {
        "src": "youtube",
        "vid": "zaA6pbE21TA",
        "t": "元祖ビックリハウスに乗ってみた",
        "by": "jetcoasterotoko",
        "who": [
          "family",
          "date"
        ],
        "thumb": "https://i.ytimg.com/vi/zaA6pbE21TA/hqdefault.jpg",
        "url": "https://www.youtube.com/shorts/zaA6pbE21TA"
      },
      {
        "src": "youtube",
        "vid": "paBzrv8Sdio",
        "t": "日本で最初の遊園地がすごかった",
        "by": "kubotabi",
        "who": [
          "date",
          "girls",
          "family"
        ],
        "thumb": "https://i.ytimg.com/vi/paBzrv8Sdio/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=paBzrv8Sdio"
      },
      {
        "src": "tiktok",
        "vid": "7140937805517081857",
        "t": "屋上のブラ坊神社、知ってる?",
        "by": "hanayashiki_1853",
        "who": [
          "date",
          "girls"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@hanayashiki_1853/video/7140937805517081857"
      },
      {
        "src": "tiktok",
        "vid": "7394994810542755088",
        "t": "現存最古のジェットコースター乗車映像",
        "by": "jetcoasterotoko",
        "who": [
          "boys",
          "solo"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@jetcoasterotoko/video/7394994810542755088"
      }
    ]
  },
  {
    "id": "menchi",
    "name": "浅草メンチ",
    "cat": "snack",
    "area": "denboin",
    "lat": 35.71286,
    "lng": 139.796219,
    "geo": "gsi-address",
    "approx": false,
    "emoji": "🥩",
    "hue": 25,
    "desc": "伝法院通りの行列メンチカツ。浅草食べ歩きの定番。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7200297358570179841",
        "t": "浅草で一番おすすめしたいメンチカツ",
        "by": "gourmet_uni_japan_",
        "who": [
          "boys",
          "girls",
          "date",
          "solo"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@gourmet_uni_japan_/video/7200297358570179841"
      }
    ]
  },
  {
    "id": "kuroge",
    "name": "浅草コロッケ くろげ 雷門店",
    "cat": "snack",
    "area": "kaminarimon",
    "lat": 35.71154,
    "lng": 139.79628,
    "geo": "gsi-address",
    "approx": false,
    "emoji": "🧀",
    "hue": 40,
    "desc": "チーズがのびる「雷門チーズメンチ」が人気の揚げ物店。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7325019442428087560",
        "t": "とろーり伸びるチーズメンチ",
        "by": "welcome_to_asakusa",
        "who": [
          "girls",
          "date",
          "boys"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@welcome_to_asakusa/video/7325019442428087560"
      },
      {
        "src": "tiktok",
        "vid": "7169908943307820290",
        "t": "のび〜る雷門チーズメンチ",
        "by": "harapeko_jpn",
        "who": [
          "boys",
          "girls",
          "solo"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@harapeko_jpn/video/7169908943307820290"
      }
    ]
  },
  {
    "id": "kagetsudo",
    "name": "浅草花月堂 本店",
    "cat": "snack",
    "area": "rokku",
    "lat": 35.714573,
    "lng": 139.794113,
    "geo": "gsi-address",
    "approx": false,
    "emoji": "🍈",
    "hue": 75,
    "desc": "ふわふわのジャンボめろんぱん。アイスを挟んだものも。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7370671626309995781",
        "t": "メロンパンが食べ歩きのハイライトだった",
        "by": "atediana28",
        "who": [
          "girls",
          "date",
          "family"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@atediana28/video/7370671626309995781"
      },
      {
        "src": "tiktok",
        "vid": "7238545417108032774",
        "t": "東京で食べた中で最高クラスのデザート",
        "by": "tokyo.explores",
        "who": [
          "girls",
          "solo",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@tokyo.explores/video/7238545417108032774"
      }
    ]
  },
  {
    "id": "unana",
    "name": "浅草うなな",
    "cat": "snack",
    "area": "rokku",
    "lat": 35.715202,
    "lng": 139.794373,
    "geo": "gsi-address",
    "approx": false,
    "emoji": "🍙",
    "hue": 30,
    "desc": "炭火で焼く国産うなぎの焼きおにぎり。行列店。",
    "photo": "https://i.ytimg.com/vi/q0bDDCRP3M4/hqdefault.jpg",
    "videos": [
      {
        "src": "youtube",
        "vid": "q0bDDCRP3M4",
        "t": "ワンコインの国産鰻焼きおにぎり",
        "by": "harapeko_jpn",
        "who": [
          "boys",
          "solo",
          "date"
        ],
        "thumb": "https://i.ytimg.com/vi/q0bDDCRP3M4/hqdefault.jpg",
        "url": "https://www.youtube.com/shorts/q0bDDCRP3M4"
      },
      {
        "src": "youtube",
        "vid": "JHQ6JebBcfA",
        "t": "おにぎりが隠れるほどのうなぎ",
        "by": "wolf.0313",
        "who": [
          "boys",
          "girls",
          "family"
        ],
        "thumb": "https://i.ytimg.com/vi/JHQ6JebBcfA/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=JHQ6JebBcfA"
      },
      {
        "src": "tiktok",
        "vid": "7325006852402580744",
        "t": "浅草で一番行列のできる鰻おにぎり",
        "by": "savor.japan",
        "who": [
          "date",
          "girls",
          "solo"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@savor.japan/video/7325006852402580744"
      }
    ]
  },
  {
    "id": "imopippi",
    "name": "芋ぴっぴ。浅草店",
    "cat": "sweets",
    "area": "rokku",
    "lat": 35.714176,
    "lng": 139.794571,
    "geo": "gsi-address",
    "approx": false,
    "emoji": "🍠",
    "hue": 285,
    "desc": "目の前で絞る紫芋モンブランと焼き芋ブリュレ。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7378465240943512840",
        "t": "目の前で絞る1mm紫芋モンブラン",
        "by": "gourmet_lab_jp",
        "who": [
          "girls",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@gourmet_lab_jp/video/7378465240943512840"
      }
    ]
  },
  {
    "id": "soratsuki",
    "name": "浅草そらつき",
    "cat": "snack",
    "area": "kaminarimon",
    "lat": 35.712406,
    "lng": 139.797028,
    "geo": "gsi-address",
    "approx": true,
    "emoji": "🍡",
    "hue": 345,
    "desc": "大粒の団子やいちごを使った和スイーツの店。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7196277778294115585",
        "t": "大粒のみたらし団子",
        "by": "jukananan727",
        "who": [
          "girls",
          "date",
          "solo"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@jukananan727/video/7196277778294115585"
      }
    ]
  },
  {
    "id": "kokonoe",
    "name": "浅草九重",
    "cat": "snack",
    "area": "denboin",
    "lat": 35.712856,
    "lng": 139.796585,
    "geo": "gsi-address",
    "approx": true,
    "emoji": "🥮",
    "hue": 35,
    "desc": "仲見世通りの揚げまんじゅう。揚げたてを店先で。",
    "photo": "https://i.ytimg.com/vi/aZgb5nMBrbo/hqdefault.jpg",
    "videos": [
      {
        "src": "youtube",
        "vid": "aZgb5nMBrbo",
        "t": "仲見世でサクサクの揚げまんじゅう",
        "by": "CCHANNELTV",
        "who": [
          "girls",
          "date",
          "family"
        ],
        "thumb": "https://i.ytimg.com/vi/aZgb5nMBrbo/hqdefault.jpg",
        "url": "https://www.youtube.com/shorts/aZgb5nMBrbo"
      }
    ]
  },
  {
    "id": "hoppy",
    "name": "ホッピー通り",
    "cat": "meal",
    "area": "rokku",
    "lat": 35.713762,
    "lng": 139.794221,
    "geo": "osm-name",
    "approx": false,
    "emoji": "🍻",
    "hue": 48,
    "desc": "昼から飲める大衆酒場が並ぶ通り。牛すじ煮込みとホッピーが定番。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7065249607332269314",
        "t": "ホッピー通りで旬の魚と酒「ととや」",
        "by": "sakaba_dig",
        "who": [
          "boys",
          "solo",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@sakaba_dig/video/7065249607332269314"
      },
      {
        "src": "tiktok",
        "vid": "6952302165574569218",
        "t": "ホッピー通りで瓶ビール2本",
        "by": "yurumeshi001",
        "who": [
          "boys",
          "solo"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@yurumeshi001/video/6952302165574569218"
      },
      {
        "src": "tiktok",
        "vid": "7142382900523076865",
        "t": "老舗「つくし」でもんじゃと昼飲み",
        "by": "jc_ygyg",
        "who": [
          "boys",
          "girls"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@jc_ygyg/video/7142382900523076865"
      }
    ]
  },
  {
    "id": "takotako",
    "name": "蛸たこ×ころも兄弟",
    "cat": "snack",
    "area": "kaminarimon",
    "lat": 35.712579,
    "lng": 139.797695,
    "geo": "osm-name",
    "approx": false,
    "emoji": "🐙",
    "hue": 350,
    "desc": "せんべいにたこ焼きを挟んだ「たこせん」の専門店。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7209974799831960833",
        "t": "消費期限3分のたこせん",
        "by": "yuuuuto38",
        "who": [
          "boys",
          "girls",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@yuuuuto38/video/7209974799831960833"
      }
    ]
  },
  {
    "id": "mitsuya",
    "name": "甘味みつや",
    "cat": "sweets",
    "area": "kaminarimon",
    "lat": 35.712017,
    "lng": 139.797058,
    "geo": "gsi-address",
    "approx": true,
    "emoji": "🍯",
    "hue": 38,
    "desc": "白玉専門店。みたらし白玉は手土産にも。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7188058359021456641",
        "t": "白玉専門店のみたらし団子",
        "by": "yuuuuto38",
        "who": [
          "girls",
          "date",
          "family"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@yuuuuto38/video/7188058359021456641"
      }
    ]
  },
  {
    "id": "sakurasaku",
    "name": "かき氷専門店 サクラ咲 浅草店",
    "cat": "sweets",
    "area": "denboin",
    "lat": 35.710384,
    "lng": 139.792603,
    "geo": "gsi-address",
    "approx": false,
    "emoji": "🍧",
    "hue": 335,
    "desc": "フルーツソースをかけ放題のかき氷専門店。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7241104578752613633",
        "t": "フルーツソースかけ放題のかき氷",
        "by": "tokyo_foods",
        "who": [
          "girls",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@tokyo_foods/video/7241104578752613633"
      }
    ]
  },
  {
    "id": "koshin",
    "name": "おいもやさん興伸",
    "cat": "snack",
    "area": "denboin",
    "lat": 35.712743,
    "lng": 139.796702,
    "geo": "osm-name",
    "approx": false,
    "emoji": "🍠",
    "hue": 28,
    "desc": "つやつやの大学芋が名物の芋菓子専門店。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7225526744541924609",
        "t": "浅草で一番食べてほしい大学芋",
        "by": "gourmet_uni_japan_",
        "who": [
          "girls",
          "solo",
          "family"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@gourmet_uni_japan_/video/7225526744541924609"
      }
    ]
  },
  {
    "id": "tabanenoshi",
    "name": "浅草茶屋 たばねのし",
    "cat": "sweets",
    "area": "rokku",
    "lat": 35.714319,
    "lng": 139.794622,
    "geo": "osm-name",
    "approx": false,
    "emoji": "🍵",
    "hue": 120,
    "desc": "掛川抹茶を練り込んだ生地の抹茶クレープ。行列店。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7340569976052452626",
        "t": "いま浅草で一番食べるべき抹茶クレープ",
        "by": "joker_gourmet",
        "who": [
          "girls",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@joker_gourmet/video/7340569976052452626"
      }
    ]
  },
  {
    "id": "romankan",
    "name": "浅草大正ロマン館",
    "cat": "play",
    "area": "denboin",
    "lat": 35.712905,
    "lng": 139.796806,
    "geo": "osm-name",
    "approx": false,
    "emoji": "👘",
    "hue": 320,
    "desc": "雷門近くの着物レンタル。着物で浅草を歩くデートプランも。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7338732799769332994",
        "t": "着物デートを100%楽しむ1日プラン",
        "by": "chihana_hitomi",
        "who": [
          "date",
          "girls"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@chihana_hitomi/video/7338732799769332994"
      },
      {
        "src": "tiktok",
        "vid": "7395155641318329618",
        "t": "推し活プランがある着物レンタル",
        "by": "asakusa_romankan",
        "who": [
          "girls"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@asakusa_romankan/video/7395155641318329618"
      }
    ]
  },
  {
    "id": "yokocho",
    "name": "浅草横町",
    "cat": "meal",
    "area": "rokku",
    "lat": 35.714066,
    "lng": 139.793622,
    "geo": "osm-name",
    "approx": false,
    "emoji": "🏮",
    "hue": 355,
    "desc": "東京楽天地浅草ビル4階の食のテーマ横丁。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7220369769084488962",
        "t": "浅草横町までの行き方",
        "by": "asayokostaff",
        "who": [
          "boys",
          "girls",
          "date"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@asayokostaff/video/7220369769084488962"
      }
    ]
  },
  {
    "id": "tokiwado",
    "name": "常盤堂雷おこし本舗",
    "cat": "snack",
    "area": "kaminarimon",
    "lat": 35.711126,
    "lng": 139.796125,
    "geo": "osm-name",
    "approx": false,
    "emoji": "🍘",
    "hue": 45,
    "desc": "雷門のすぐ隣。浅草名物「雷おこし」の老舗。",
    "photo": "https://i.ytimg.com/vi/K_4Q_UTYr2o/hqdefault.jpg",
    "videos": [
      {
        "src": "youtube",
        "vid": "K_4Q_UTYr2o",
        "t": "創業1816年、雷おこしができるまで",
        "by": "mogufood",
        "who": [
          "family",
          "solo",
          "date"
        ],
        "thumb": "https://i.ytimg.com/vi/K_4Q_UTYr2o/hqdefault.jpg",
        "url": "https://www.youtube.com/shorts/K_4Q_UTYr2o"
      }
    ]
  },
  {
    "id": "irokawa",
    "name": "うなぎ色川",
    "cat": "meal",
    "area": "kaminarimon",
    "lat": 35.709289,
    "lng": 139.795172,
    "geo": "osm-name",
    "approx": false,
    "emoji": "🍱",
    "hue": 18,
    "desc": "雷門エリアの老舗うなぎ店。",
    "photo": "https://i.ytimg.com/vi/KkQUA-kjBjE/hqdefault.jpg",
    "videos": [
      {
        "src": "youtube",
        "vid": "KkQUA-kjBjE",
        "t": "うなぎ色川で鰻重パッカーン",
        "by": "eellove",
        "who": [
          "solo",
          "boys",
          "family"
        ],
        "thumb": "https://i.ytimg.com/vi/KkQUA-kjBjE/hqdefault.jpg",
        "url": "https://www.youtube.com/shorts/KkQUA-kjBjE"
      }
    ]
  },
  {
    "id": "nonki",
    "name": "浅草 もつ焼のんき",
    "cat": "meal",
    "area": "kaminarimon",
    "lat": 35.710377,
    "lng": 139.796844,
    "geo": "gsi-address",
    "approx": false,
    "emoji": "🍢",
    "hue": 15,
    "desc": "雷門近くのもつ焼き屋。昼飲みもできる下町やきとん。",
    "photo": "",
    "videos": [
      {
        "src": "tiktok",
        "vid": "7425936539617725714",
        "t": "浅草で昼飲み、下町やきとん",
        "by": "kitchen_taro",
        "who": [
          "boys",
          "solo"
        ],
        "thumb": "",
        "url": "https://www.tiktok.com/@kitchen_taro/video/7425936539617725714"
      }
    ]
  }
];
