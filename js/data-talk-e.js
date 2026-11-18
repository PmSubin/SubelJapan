/* SubelJapan — Nói & Ngữ pháp: bài bổ sung (bot kiểm tra tìm ra chặng còn thiếu bài)
 *  - g49: Ngày tháng & sinh nhật (chặng 6 · Thời gian)
 *  - g50: Lời chúc mừng (chặng 1 · Chào hỏi)
 *  - g51: Màu gì? (chặng 3 · Đồ vật)
 *  - g52: Đếm đồ vật ひとつ・ふたつ (chặng 4 · Số & mua sắm)
 *  - g53: Ở tầng mấy? なんがい・こちら・あちら (chặng 5 · Nơi chốn)
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
    g52: {
      title: 'Đếm đồ vật', jp: 'ひとつ・ふたつ', icon: 'apple',
      goal: 'Đếm đồ vật từ 1 đến 10 bằng ひとつ, ふたつ…, hỏi "mấy cái" bằng いくつ và mua đúng số lượng',
      pattern: { parts: [['Đồ vật', 'n'], ['を', 'p', 'o'], ['ひとつ / ふたつ…', 't', 'hitotsu / futatsu…'], ['ください', 'e', 'kudasai']], mean: 'Cho tôi … cái (đồ vật)' },
      points: [
        'Đếm đồ vật (quả táo, cái bánh, viên kẹo…) có bộ số riêng: <b class="jp">ひとつ</b> (1), <b class="jp">ふたつ</b> (2), <b class="jp">みっつ</b> (3), <b class="jp">よっつ</b> (4), <b class="jp">いつつ</b> (5), <b class="jp">むっつ</b> (6), <b class="jp">ななつ</b> (7), <b class="jp">やっつ</b> (8), <b class="jp">ここのつ</b> (9), <b class="jp">とお</b> (10). Hầu hết kết thúc bằng <span class="jp">つ</span>, riêng 10 là <span class="jp">とお</span>.',
        'Từ 11 trở lên thì dùng số thường bạn đã học: <span class="jp">じゅういち</span>, <span class="jp">じゅうに</span>…',
        'Hỏi "mấy cái?" → <b class="jp">いくつ</b>ですか. Đừng nhầm với <span class="jp">いくら</span> (bao nhiêu tiền).',
        'Số lượng đứng <b>sau</b> <span class="jp">を</span> và <b>trước</b> động từ: <span class="jp">りんごを <b>みっつ</b> ください</span> (cho tôi 3 quả táo). Đếm người thì khác: <span class="jp">ひとり</span>, <span class="jp">ふたり</span> — không dùng ひとつ cho người.',
      ],
      tip: 'Khi đếm bằng ngón tay, người Nhật xoè bàn tay ra rồi <b>gập</b> từng ngón vào, bắt đầu từ ngón cái. Còn <span class="jp">いくつ</span> thêm <span class="jp">お</span> thành <b class="jp">おいくつですか</b> là cách hỏi tuổi lịch sự đó!',
      ex: [
        { j: 'りんご|を |みっつ |ください。', r: 'ringo|o|mittsu|kudasai', v: 'Cho tôi 3 quả táo.', k: 'りんごを三つください。' },
        { j: 'いくつ|ですか。', r: 'ikutsu|desu ka', v: 'Mấy cái ạ?', k: 'いくつですか。' },
        { j: 'ふたつ|です。', r: 'futatsu|desu', v: 'Hai cái.', k: '二つです。' },
        { j: 'この |ケーキ|を |ひとつ |ください。', r: 'kono|keeki|o|hitotsu|kudasai', v: 'Cho tôi một cái bánh kem này.', k: 'このケーキを一つください。' },
        { j: 'みかん|を |いつつ |ください。', r: 'mikan|o|itsutsu|kudasai', v: 'Cho tôi 5 quả quýt.', k: 'みかんを五つください。' },
        { j: 'おにぎり|を |ふたつ|と、|おちゃ|を |ひとつ |ください。', r: 'onigiri|o|futatsu|to,|ocha|o|hitotsu|kudasai', v: 'Cho tôi 2 nắm cơm và 1 chai trà.', k: 'おにぎりを二つと、お茶を一つください。' },
        { j: 'あめ|を |とお |ください。', r: 'ame|o|too|kudasai', v: 'Cho tôi 10 viên kẹo.', k: 'あめを十ください。' },
        { j: 'ぜんぶで |いくら|ですか。', r: 'zenbu de|ikura|desu ka', v: 'Tổng cộng bao nhiêu tiền ạ?', k: '全部でいくらですか。' },
        { j: 'ひとつ |ひゃく|えん|です。', r: 'hitotsu|hyaku|en|desu', v: '100 yên một cái.', k: '一つ百円です。' },
      ],
      fill: [
        { ex: 0, tok: 2, wrong: ['さん', 'みっか'], why: '3 cái = <b class="jp">みっつ</b>. (<span class="jp">さん</span> là số 3 khi đếm số, <span class="jp">みっか</span> là ngày mùng 3)' },
        { ex: 1, tok: 0, wrong: ['いくら', 'なに'], why: 'Hỏi "mấy cái" → <b class="jp">いくつ</b>. (<span class="jp">いくら</span> = bao nhiêu tiền)' },
        { ex: 3, tok: 3, wrong: ['ひとり', 'いち'], why: 'Đếm đồ vật: <b class="jp">ひとつ</b> (1 cái). <span class="jp">ひとり</span> là 1 người.' },
        { ex: 4, tok: 2, wrong: ['ごつ', 'いつか'], why: '5 cái = <b class="jp">いつつ</b>. (<span class="jp">いつか</span> là ngày mùng 5)' },
      ],
      talk: [
        { q: 'いくつですか。', qr: 'ikutsu desu ka?', qv: 'Bạn mua táo ở chợ. Cô bán hàng hỏi: "Mấy quả ạ?" — bạn cần hai quả.', a: 2, wrong: [['ふたりです。', 'futari desu.'], ['にです。', 'ni desu.']] },
        { sit: 'Ở tiệm bánh, bạn chỉ vào chiếc bánh kem trong tủ kính và muốn mua một cái:', a: 3, wrong: [['この ケーキを ひとり ください。', 'kono keeki o hitori kudasai.'], ['この ケーキは ひとつ ください。', 'kono keeki wa hitotsu kudasai.']] },
        { sit: 'Bạn đã chọn xong mấy món ở quầy và muốn hỏi tổng cộng hết bao nhiêu tiền:', a: 7, wrong: [['ぜんぶで いくつですか。', 'zenbu de ikutsu desu ka?'], ['ぜんぶで なんですか。', 'zenbu de nan desu ka?']] },
        { q: 'みかんは ひとつ ひゃくえんですよ。', qr: 'mikan wa hitotsu hyaku en desu yo.', qv: 'Cô bán hàng nói quýt 100 yên một quả. Bạn muốn mua 5 quả:', a: 4, wrong: [['みかんを ごつ ください。', 'mikan o gotsu kudasai.'], ['みかんを いつか ください。', 'mikan o itsuka kudasai.']] },
      ],
    },
    g53: {
      title: 'Ở tầng mấy?', jp: 'なんがいですか', icon: 'building',
      goal: 'Hỏi và nói tầng mấy bằng なんがい, chỉ chỗ lịch sự bằng こちら・そちら・あちら khi đi trung tâm thương mại',
      pattern: { parts: [['Quầy / phòng…', 'n'], ['は', 'p', 'wa'], ['なんがい', 'q', 'nangai'], ['ですか', 'e', 'desu ka']], mean: '(Quầy / phòng…) ở tầng mấy?' },
      points: [
        'Tầng = số + <b class="jp">かい</b>: <span class="jp">にかい</span> (tầng 2), <span class="jp">よんかい</span> (tầng 4), <span class="jp">ごかい</span> (tầng 5), <span class="jp">ななかい</span> (tầng 7), <span class="jp">きゅうかい</span> (tầng 9). Hỏi tầng mấy: <b class="jp">なんがい</b>.',
        'Mấy tầng bị biến âm, phải nhớ: <b class="jp">いっかい</b> (1), <b class="jp">さんがい</b> (3 — かい thành がい), <b class="jp">ろっかい</b> (6), <b class="jp">はっかい</b> (8), <b class="jp">じゅっかい</b> (10). <span class="jp">なんがい</span> cũng đổi thành がい giống <span class="jp">さんがい</span>.',
        'Tầng hầm: <b class="jp">ちか</b> (dưới mặt đất) + số tầng: <span class="jp">ちか いっかい</span> = tầng hầm 1.',
        'Ở cửa hàng, nhân viên chỉ chỗ bằng từ lịch sự: <b class="jp">こちら</b> (phía này), <b class="jp">そちら</b> (phía đó, gần người nghe), <b class="jp">あちら</b> (phía kia, xa cả hai) — là cách nói lịch sự của <span class="jp">ここ・そこ・あそこ</span>.',
      ],
      tip: 'Ở Nhật, tầng sát mặt đất đã là <b class="jp">いっかい</b> (tầng 1), không có "tầng trệt" như Việt Nam. Tầng hầm của trung tâm thương mại thường bán đồ ăn, gọi vui là <b class="jp">デパちか</b> — đến đó hay được mời ăn thử miễn phí!',
      ex: [
        { j: 'すみません、|くつ うりば|は |なんがい|ですか。', r: 'sumimasen,|kutsu uriba|wa|nangai|desu ka', v: 'Xin lỗi, quầy giày ở tầng mấy ạ?', k: 'すみません、靴売り場は何階ですか。' },
        { j: 'さんがい|です。', r: 'sangai|desu', v: 'Ở tầng 3 ạ.', k: '3階です。' },
        { j: 'レストラン|は |ろっかい|です。', r: 'resutoran|wa|rokkai|desu', v: 'Nhà hàng ở tầng 6.', k: 'レストランは6階です。' },
        { j: 'しょくりょうひん|は |ちか |いっかい|です。', r: 'shokuryouhin|wa|chika|ikkai|desu', v: 'Đồ ăn, thực phẩm ở tầng hầm 1.', k: '食料品は地下1階です。' },
        { j: 'エレベーター|は |あちら|です。', r: 'erebeetaa|wa|achira|desu', v: 'Thang máy ở phía kia ạ.', k: 'エレベーターはあちらです。' },
        { j: 'トイレ|は |こちら|です。', r: 'toire|wa|kochira|desu', v: 'Nhà vệ sinh ở phía này ạ.', k: 'トイレはこちらです。' },
        { j: 'わたし|の |へや|は |はっかい|です。', r: 'watashi|no|heya|wa|hakkai|desu', v: 'Phòng của tôi ở tầng 8.', k: '私の部屋は8階です。' },
        { j: 'ほんや|は |なんがい|に |ありますか。', r: "hon'ya|wa|nangai|ni|arimasu ka", v: 'Hiệu sách ở tầng mấy ạ?', k: '本屋は何階にありますか。' },
        { j: 'いっかい|に |あります。', r: 'ikkai|ni|arimasu', v: 'Ở tầng 1 ạ.', k: '1階にあります。' },
      ],
      fill: [
        { ex: 0, tok: 3, wrong: ['なんじ', 'なんにち'], why: 'Hỏi tầng mấy → <b class="jp">なんがい</b>. (<span class="jp">なんじ</span> = mấy giờ, <span class="jp">なんにち</span> = ngày mấy)' },
        { ex: 1, tok: 0, wrong: ['さんがつ', 'さんにん'], why: 'Tầng 3 = <b class="jp">さんがい</b>. (<span class="jp">さんがつ</span> = tháng 3, <span class="jp">さんにん</span> = 3 người)' },
        { ex: 2, tok: 2, wrong: ['ろくかい', 'むっつ'], why: '6 + かい biến âm thành <b class="jp">ろっかい</b>. (<span class="jp">むっつ</span> = 6 cái)' },
        { ex: 4, tok: 2, wrong: ['あれ', 'あの'], why: 'Chỉ chỗ, chỉ phía một cách lịch sự → <b class="jp">あちら</b>. (<span class="jp">あれ</span> = cái kia, <span class="jp">あの</span> phải đi kèm danh từ)' },
        { ex: 3, tok: 2, wrong: ['した', 'なか'], why: 'Tầng hầm = <b class="jp">ちか</b> (dưới mặt đất) + số tầng: ちか いっかい.' },
      ],
      talk: [
        { q: 'すみません、くつ うりばは なんがいですか。', qr: 'sumimasen, kutsu uriba wa nangai desu ka?', qv: 'Bạn làm thêm ở quầy thông tin của trung tâm thương mại. Khách hỏi quầy giày ở tầng mấy — quầy giày ở tầng 3.', a: 1, wrong: [['さんがつです。', 'sangatsu desu.'], ['みっつです。', 'mittsu desu.']] },
        { sit: 'Bạn đi trung tâm thương mại và muốn hỏi nhân viên xem hiệu sách ở tầng mấy:', a: 7, wrong: [['ほんやは なんじに ありますか。', "hon'ya wa nanji ni arimasu ka?"], ['ほんやは なんがいを ありますか。', "hon'ya wa nangai o arimasu ka?"]] },
        { q: 'エレベーターは どちらですか。', qr: 'erebeetaa wa dochira desu ka?', qv: 'Một bác lớn tuổi hỏi bạn thang máy ở hướng nào — thang máy ở tít đằng kia, xa cả hai người.', a: 4, wrong: [['エレベーターは あれです。', 'erebeetaa wa are desu.'], ['エレベーターは こちらです。', 'erebeetaa wa kochira desu.']] },
        { q: 'リンさんの へやは なんがいですか。', qr: 'Rin-san no heya wa nangai desu ka?', qv: 'Bạn mới chuyển đến chung cư. Bác hàng xóm hỏi phòng bạn ở tầng mấy — phòng bạn ở tầng 8.', a: ['はっかいです。', 'hakkai desu.', 'Ở tầng 8 ạ.'], wrong: [['はちがいです。', 'hachigai desu.'], ['やっつです。', 'yattsu desu.']] },
      ],
    },
  });
})(window.SJ);
