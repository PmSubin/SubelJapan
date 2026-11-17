/* SubelJapan — Nói & Ngữ pháp: bài bổ sung (bot kiểm tra tìm ra chặng còn thiếu bài)
 *  - g49: Ngày tháng & sinh nhật (chặng 6 · Thời gian)
 *  - g50: Lời chúc mừng (chặng 1 · Chào hỏi)
 *  - g51: Màu gì? (chặng 3 · Đồ vật)
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
    g50: {
      title: 'Lời chúc mừng', jp: 'おめでとう', icon: 'cake', kind: 'phrase',
      goal: 'Chúc mừng sinh nhật, chúc năm mới, cổ vũ bạn bè và đáp lại lời chúc',
      points: [
        '<b class="jp">おめでとう ございます</b> = chúc mừng (lịch sự). Với bạn bè chỉ cần <b class="jp">おめでとう</b>. Muốn nói chúc mừng chuyện gì thì đặt chuyện đó lên trước: <span class="jp">たんじょうび おめでとう</span> (chúc mừng sinh nhật), <span class="jp">ごうかく おめでとう</span> (chúc mừng thi đỗ).',
        'Chúc năm mới có 2 câu, dùng vào 2 lúc khác nhau: <b>trước</b> khi hết năm nói <b class="jp">よい おとしを</b> (chúc đón năm mới tốt lành); <b>từ ngày 1 tháng 1</b> mới nói <b class="jp">あけまして おめでとう ございます</b>, thường kèm <span class="jp">ことしも よろしく おねがいします</span> (năm nay cũng mong được giúp đỡ).',
        'Cổ vũ ai đó: <b class="jp">がんばって</b> (cố lên!). Người được cổ vũ đáp <b class="jp">がんばります</b> (tôi sẽ cố gắng) — đuôi <span class="jp">ます</span> vì đó là việc mình sẽ làm.',
        'Được chúc mừng thì đáp <b class="jp">ありがとう ございます</b> — đơn giản vậy thôi!',
      ],
      tip: 'Dịp năm mới, người Nhật gửi bưu thiếp chúc Tết <span class="jp">ねんがじょう</span> để bưu điện phát đúng sáng ngày 1 tháng 1. Trẻ em được người lớn mừng tuổi bằng phong bao nhỏ gọi là <b class="jp">おとしだま</b> — giống lì xì ở Việt Nam!',
      ex: [
        { j: 'おめでとう|ございます。', r: 'omedetou|gozaimasu', v: 'Chúc mừng ạ! (lịch sự)', k: 'おめでとうございます。' },
        { j: 'たんじょうび |おめでとう！', r: 'tanjoubi|omedetou', v: 'Chúc mừng sinh nhật!', k: '誕生日おめでとう！' },
        { j: 'よい |おとしを。', r: 'yoi|otoshi o', v: 'Chúc năm mới tốt lành! (nói trước khi hết năm)', k: 'よいお年を。' },
        { j: 'あけまして |おめでとう|ございます。', r: 'akemashite|omedetou|gozaimasu', v: 'Chúc mừng năm mới ạ! (nói từ ngày 1 tháng 1)', k: '明けましておめでとうございます。' },
        { j: 'ことしも |よろしく |おねがいします。', r: 'kotoshi mo|yoroshiku|onegaishimasu', v: 'Năm nay cũng mong được giúp đỡ ạ.', k: '今年もよろしくお願いします。' },
        { j: 'がんばって！', r: 'ganbatte', v: 'Cố lên nhé! (cổ vũ bạn bè)', k: '頑張って！' },
        { j: 'がんばります。', r: 'ganbarimasu', v: 'Tôi sẽ cố gắng ạ. (đáp lời cổ vũ)', k: '頑張ります。' },
        { j: 'ごうかく |おめでとう！', r: 'goukaku|omedetou', v: 'Chúc mừng thi đỗ!', k: '合格おめでとう！' },
        { j: 'ありがとう|ございます。', r: 'arigatou|gozaimasu', v: 'Cảm ơn ạ. (đáp lời chúc)', k: 'ありがとうございます。' },
      ],
      fill: [
        { ex: 3, tok: 0, wrong: ['よい', 'おはよう'], why: 'Từ ngày 1 tháng 1 nói <b class="jp">あけまして</b> おめでとう ございます (năm mới đã mở ra). <span class="jp">よい おとしを</span> là câu nói trước khi hết năm.' },
        { ex: 6, tok: 0, wrong: ['がんばって！', 'がんばりました。'], why: 'Được cổ vũ thì đáp <b class="jp">がんばります</b> (tôi sẽ cố gắng). <span class="jp">がんばって</span> là câu mình nói để cổ vũ người khác.' },
        { ex: 1, tok: 1, wrong: ['ございます！', 'ありがとう！'], why: 'Chúc mừng = <b class="jp">おめでとう</b>. Với bạn bè nói ngắn: たんじょうび おめでとう！' },
        { ex: 2, tok: 1, wrong: ['おめでとう。', 'ことしを。'], why: 'Cuối năm chúc: よい <b class="jp">おとしを</b> (= chúc bạn đón một năm mới tốt lành).' },
      ],
      talk: [
        { q: 'あした、テストです…。', qr: 'ashita, tesuto desu...', qv: 'Bạn thân lo lắng: "Mai mình thi rồi…"', a: 5, wrong: [6, 0] },
        { q: 'がんばって くださいね。', qr: 'ganbatte kudasai ne.', qv: 'Trước cuộc thi hùng biện, cô giáo động viên bạn: "Cố lên nhé."', a: 6, wrong: [5, 2] },
        { sit: 'Ngày 28 tháng 12, buổi học cuối năm kết thúc. Bạn chào thầy giáo trước kỳ nghỉ Tết:', a: 2, wrong: [3, 7] },
        { q: 'あけまして おめでとう ございます。', qr: 'akemashite omedetou gozaimasu.', qv: 'Sáng ngày 1 tháng 1, bác hàng xóm chúc bạn năm mới.', a: 3, wrong: [2, 5] },
        { sit: 'Hôm nay là sinh nhật bạn thân. Gặp bạn ấy ở trường, bạn nói:', a: 1, wrong: [7, 2] },
        { q: 'リンさん、たんじょうび おめでとう！', qr: 'Rin-san, tanjoubi omedetou!', qv: 'Các bạn tặng quà sinh nhật cho bạn.', a: 8, wrong: [1, 6] },
      ],
    },
    g51: {
      title: 'Màu gì?', jp: 'なにいろ？', icon: 'palette',
      goal: 'Hỏi đồ vật màu gì bằng なにいろ và tả đồ vật theo màu: あかい かさ, みどりの ペン',
      pattern: { parts: [['この / その / あの', 't', 'kono / sono / ano'], ['Đồ vật', 'n'], ['は', 'p', 'wa'], ['なにいろ', 'q', 'naniiro'], ['ですか', 'e', 'desu ka']], mean: '(Đồ vật) này / đó / kia màu gì?' },
      points: [
        'Hỏi màu: <b class="jp">なにいろ</b>ですか (màu gì?). <span class="jp">なに</span> = gì, <span class="jp">いろ</span> = màu. Hỏi kèm đồ vật: <span class="jp">なにいろの かさ</span> (ô màu gì).',
        'Sáu màu có đuôi <b class="jp">い</b>: <span class="jp">あかい</span> (đỏ), <span class="jp">あおい</span> (xanh dương), <span class="jp">しろい</span> (trắng), <span class="jp">くろい</span> (đen), <span class="jp">きいろい</span> (vàng), <span class="jp">ちゃいろい</span> (nâu). Đặt <b>thẳng</b> trước đồ vật: <b class="jp">あかい かさ</b> (ô đỏ) — màu đứng <b>trước</b>, ngược tiếng Việt.',
        'Các màu còn lại <b>không có い</b>: <span class="jp">みどり</span> (xanh lá), <span class="jp">ピンク</span> (hồng), <span class="jp">むらさき</span> (tím), <span class="jp">オレンジ</span> (cam)… Muốn đặt trước đồ vật thì thêm <b class="jp">の</b>: <b class="jp">みどりの ペン</b>. Không nói みどり ペン hay みどりい.',
        'Màu đứng cuối câu chỉ cần thêm <span class="jp">です</span>: <span class="jp">この かばんは くろいです</span>, <span class="jp">わたしの かさは ピンクです</span>.',
      ],
      tip: 'Đèn giao thông màu xanh lá nhưng người Nhật lại gọi là <b class="jp">あお</b> (xanh dương): <span class="jp">あおしんごう</span> = đèn xanh. Ngày xưa tiếng Nhật dùng chữ <span class="jp">あお</span> cho cả xanh lá lẫn xanh dương, nên rau xanh cũng gọi là <span class="jp">あおやさい</span>!',
      ex: [
        { j: 'この |かさ|は |なにいろ|ですか。', r: 'kono|kasa|wa|naniiro|desu ka', v: 'Cái ô này màu gì?', k: 'この傘は何色ですか。' },
        { j: 'あかい |かさ|です。', r: 'akai|kasa|desu', v: 'Là cái ô màu đỏ.', k: '赤い傘です。' },
        { j: 'わたし|の |かばん|は |くろい|です。', r: 'watashi|no|kaban|wa|kuroi|desu', v: 'Cặp của tôi màu đen.', k: '私のかばんは黒いです。' },
        { j: 'それ|は |みどりの |ペン|です。', r: 'sore|wa|midori no|pen|desu', v: 'Đó là cây bút màu xanh lá.', k: 'それは緑のペンです。' },
        { j: 'あの |しろい |くるま|は |せんせい|の|です。', r: 'ano|shiroi|kuruma|wa|sensei|no|desu', v: 'Chiếc xe màu trắng kia là của thầy / cô giáo.', k: 'あの白い車は先生のです。' },
        { j: 'そら|は |あおい|です。', r: 'sora|wa|aoi|desu', v: 'Bầu trời màu xanh.', k: '空は青いです。' },
        { j: 'すきな |いろ|は |なん|ですか。', r: 'suki na|iro|wa|nan|desu ka', v: 'Màu bạn thích là màu gì?', k: '好きな色は何ですか。' },
        { j: 'ピンク|です。', r: 'pinku|desu', v: 'Màu hồng.', k: 'ピンクです。' },
        { j: 'この |バナナ|は |きいろい|です。', r: 'kono|banana|wa|kiiroi|desu', v: 'Quả chuối này màu vàng.', k: 'このバナナは黄色いです。' },
      ],
      fill: [
        { ex: 0, tok: 3, wrong: ['なに', 'どれ'], why: 'Hỏi "màu gì" → <b class="jp">なにいろ</b> (なに = gì + いろ = màu).' },
        { ex: 1, tok: 0, wrong: ['あかいの', 'なにいろ'], why: 'Màu có đuôi い đứng <b>thẳng</b> trước đồ vật: <b class="jp">あかい</b> かさ — không thêm の.' },
        { ex: 3, tok: 2, wrong: ['みどり', 'みどりい'], why: '<span class="jp">みどり</span> không có đuôi い, nên phải thêm <b class="jp">の</b>: <b class="jp">みどりの</b> ペン.' },
        { ex: 4, tok: 1, wrong: ['しろ', 'しろいの'], why: 'Trắng có đuôi い: <b class="jp">しろい</b> くるま (xe trắng).' },
      ],
      talk: [
        { q: 'その かさは なにいろですか。', qr: 'sono kasa wa naniiro desu ka?', qv: 'Bạn để quên ô ở lớp. Thầy giáo hỏi: "Cái ô đó màu gì?" — ô của bạn màu đỏ.', a: 1, wrong: [['あかいの かさです。', 'akai no kasa desu.'], ['あおい かさです。', 'aoi kasa desu.']] },
        { q: 'すきな いろは なんですか。', qr: 'suki na iro wa nan desu ka?', qv: 'Bạn mới quen hỏi màu bạn thích — bạn thích màu hồng.', a: 7, wrong: [['ピンクいです。', 'pinkui desu.'], ['くろいです。', 'kuroi desu.']] },
        { q: 'これは なにいろの ペンですか。', qr: 'kore wa naniiro no pen desu ka?', qv: 'Cô giáo giơ một cây bút xanh lá lên và hỏi:', a: 3, wrong: [['それは みどり ペンです。', 'sore wa midori pen desu.'], ['それは みどりい ペンです。', 'sore wa midorii pen desu.']] },
        { sit: 'Một chiếc xe màu trắng đỗ ở đằng xa, trước cổng trường. Bạn hỏi bạn Nhật xem xe đó của ai:', a: ['あの しろい くるまは だれのですか。', 'ano shiroi kuruma wa dare no desu ka?', 'Chiếc xe màu trắng kia là của ai?'], wrong: [['あの しろの くるまは だれのですか。', 'ano shiro no kuruma wa dare no desu ka?'], ['あれ しろい くるまは だれのですか。', 'are shiroi kuruma wa dare no desu ka?']] },
      ],
    },
  });
})(window.SJ);
