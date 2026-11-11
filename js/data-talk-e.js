/* SubelJapan — Nói & Ngữ pháp: bài bổ sung (bot kiểm tra tìm ra chặng còn thiếu bài)
 *  - g49: Ngày tháng & sinh nhật (chặng 6 · Thời gian)
 * Quy ước như các file data-talk-*.js: j tách cụm bằng "|", cách sau mỗi cụm (分かち書き), r cùng số cụm với j,
 * k là câu có Kanji; fill.tok là cụm cần điền; talk.a là số thứ tự câu mẫu hoặc [chữ, romaji, nghĩa].
 */
window.SJ = window.SJ || {};
(function (SJ) {
  SJ.TALK_L = SJ.TALK_L || {};
  Object.assign(SJ.TALK_L, {
    g49: {
      title: 'Ngày tháng & sinh nhật', jp: 'なんがつ なんにち？', icon: 'calendar',
      goal: 'Nói tháng, ngày, hỏi "khi nào" bằng いつ và nói sinh nhật của mình',
      pattern: { parts: [['Sinh nhật / bài kiểm tra…', 'n'], ['は', 'p', 'wa'], ['Tháng … ngày …', 't'], ['です', 'e', 'desu']], mean: 'Sinh nhật / bài kiểm tra… là ngày … tháng …' },
      points: [
        'Tháng = số + <b class="jp">がつ</b>: <span class="jp">いちがつ</span> (tháng 1), <span class="jp">にがつ</span> (tháng 2)… Ba tháng đọc riêng: <b class="jp">しがつ</b> (tháng 4), <b class="jp">しちがつ</b> (tháng 7), <b class="jp">くがつ</b> (tháng 9). Hỏi tháng mấy: <span class="jp">なんがつ</span>.',
        'Ngày = số + <b class="jp">にち</b>: <span class="jp">じゅういちにち</span> (ngày 11), <span class="jp">にじゅうごにち</span> (ngày 25). Hỏi ngày mấy: <span class="jp">なんにち</span>.',
        'Ngày 1–10, 14, 20, 24 đọc riêng, phải học thuộc: <span class="jp">ついたち</span> (1), <span class="jp">ふつか</span> (2), <span class="jp">みっか</span> (3), <span class="jp">よっか</span> (4), <span class="jp">いつか</span> (5), <span class="jp">むいか</span> (6), <span class="jp">なのか</span> (7), <span class="jp">ようか</span> (8), <span class="jp">ここのか</span> (9), <span class="jp">とおか</span> (10), <span class="jp">じゅうよっか</span> (14), <b class="jp">はつか</b> (20), <span class="jp">にじゅうよっか</span> (24).',
        'Tiếng Nhật nói <b>tháng trước, ngày sau</b> (ngược tiếng Việt): <span class="jp">ごがつ いつか</span> = ngày 5 tháng 5. Hỏi "khi nào": <b class="jp">いつ</b>ですか.',
      ],
      tip: 'Ở Nhật, ngày 5/5 là <span class="jp">こどもの ひ</span> (ngày Thiếu nhi): nhà có bé trai treo cờ cá chép bay trước gió. Ngày 7/7 là <span class="jp">たなばた</span> (lễ Thất tịch): mọi người viết điều ước lên giấy màu rồi treo lên cành tre.',
      ex: [
        { j: 'きょう|は |なんがつ |なんにち|ですか。', r: 'kyou|wa|nangatsu|nannichi|desu ka', v: 'Hôm nay là ngày mấy tháng mấy?', k: '今日は何月何日ですか。' },
        { j: 'ごがつ |いつか|です。', r: 'gogatsu|itsuka|desu', v: 'Ngày 5 tháng 5.', k: '五月五日です。' },
        { j: 'たんじょうび|は |いつ|ですか。', r: 'tanjoubi|wa|itsu|desu ka', v: 'Sinh nhật bạn là khi nào?', k: '誕生日はいつですか。' },
        { j: 'しがつ |ついたち|です。', r: 'shigatsu|tsuitachi|desu', v: 'Ngày 1 tháng 4.', k: '四月一日です。' },
        { j: 'わたし|の |たんじょうび|は |くがつ |はつか|です。', r: 'watashi|no|tanjoubi|wa|kugatsu|hatsuka|desu', v: 'Sinh nhật tôi là ngày 20 tháng 9.', k: '私の誕生日は九月二十日です。' },
        { j: 'テスト|は |なんにち|ですか。', r: 'tesuto|wa|nannichi|desu ka', v: 'Bài kiểm tra vào ngày mấy?', k: 'テストは何日ですか。' },
        { j: 'みっか|です。', r: 'mikka|desu', v: 'Ngày mùng 3.', k: '三日です。' },
        { j: 'こどもの ひ|は |ごがつ |いつか|です。', r: 'kodomo no hi|wa|gogatsu|itsuka|desu', v: 'Ngày Thiếu nhi là ngày 5 tháng 5.', k: 'こどもの日は五月五日です。' },
        { j: 'クリスマス|は |じゅうにがつ |にじゅうごにち|です。', r: 'kurisumasu|wa|juunigatsu|nijuugonichi|desu', v: 'Giáng sinh là ngày 25 tháng 12.', k: 'クリスマスは十二月二十五日です。' },
      ],
      fill: [
        { ex: 3, tok: 1, wrong: ['いちにち', 'ひとつ'], why: 'Ngày mùng 1 đọc riêng là <b class="jp">ついたち</b>. (<span class="jp">いちにち</span> = một ngày (khoảng thời gian), <span class="jp">ひとつ</span> = một cái)' },
        { ex: 4, tok: 4, wrong: ['きゅうがつ', 'くにち'], why: 'Tháng 9 đọc là <b class="jp">くがつ</b>, không đọc きゅうがつ.' },
        { ex: 2, tok: 2, wrong: ['なに', 'どこ'], why: 'Hỏi "khi nào" → <b class="jp">いつ</b>. (<span class="jp">なに</span> = cái gì, <span class="jp">どこ</span> = ở đâu)' },
        { ex: 6, tok: 0, wrong: ['さんにち', 'みっつ'], why: 'Ngày mùng 3 = <b class="jp">みっか</b>. (<span class="jp">みっつ</span> = ba cái)' },
      ],
      talk: [
        { q: 'たんじょうびは いつですか。', qr: 'tanjoubi wa itsu desu ka?', qv: 'Bạn mới quen hỏi: "Sinh nhật bạn khi nào?" — sinh nhật bạn là ngày 20 tháng 9.', a: 4, wrong: [['くがつ はつかでした。', 'kugatsu hatsuka deshita.'], ['きゅうがつ にじゅうにちです。', 'kyuugatsu nijuunichi desu.']] },
        { q: 'テストは なんにちですか。', qr: 'tesuto wa nannichi desu ka?', qv: 'Bạn cùng lớp hỏi bài kiểm tra vào ngày mấy — bài kiểm tra vào ngày mùng 3.', a: 6, wrong: [['さんにちです。', 'sannichi desu.'], ['みっつです。', 'mittsu desu.']] },
        { sit: 'Bạn muốn hỏi người bạn Nhật xem hôm nay là ngày mấy tháng mấy:', a: 0, wrong: [['きょうは なんようびですか。', 'kyou wa nan\'youbi desu ka?'], ['きょうは いつでしたか。', 'kyou wa itsu deshita ka?']] },
        { q: 'こどもの ひは いつですか。', qr: 'kodomo no hi wa itsu desu ka?', qv: 'Bạn Nhật đố bạn: "Ngày Thiếu nhi ở Nhật là khi nào?"', a: ['ごがつ いつかです。', 'gogatsu itsuka desu.', 'Ngày 5 tháng 5.'], wrong: [['ごがつ ごにちです。', 'gogatsu gonichi desu.'], ['ごがつ ようかです。', 'gogatsu youka desu.']] },
      ],
    },
  });
})(window.SJ);
