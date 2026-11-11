/* SubelJapan — Nói & Ngữ pháp: mẫu câu người Nhật nói hằng ngày (tách riêng với phần viết chữ)
 * File này: 16 bài gốc + thứ tự các chặng (SJ.TALK_UNITS). Bài mới nằm ở js/data-talk-a.js … -d.js
 * (SJ.TALK_L[id] = bài), câu mẫu thêm cho bài gốc nằm ở SJ.TALK_X[id] = { ex, fill, talk }.
 * Câu mẫu: j = chữ Nhật chia theo cụm bằng "|" (dấu cách để hiển thị như sách thiếu nhi),
 *          r = romaji cùng số cụm (đọc như người Nhật nói: は → wa, を → o; "-san" dính vào tên),
 *          v = nghĩa tiếng Việt, k = cách người Nhật viết thật (có Kanji, dùng để chấm phần nói).
 * fill = câu điền chỗ trống: { ex: số câu mẫu, tok: số cụm cần điền, wrong: đáp án sai, why: giải thích }
 * talk = hội thoại: q (người Nhật hỏi) hoặc sit (tình huống) → a (câu đáp đúng) + wrong (câu sai)
 *        a / wrong là số thứ tự câu mẫu hoặc [chữ Nhật, romaji, nghĩa]
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const BASE = [
    {
      id: 'g1', title: 'Chào hỏi mỗi ngày', jp: 'あいさつ', icon: 'sun', kind: 'phrase',
      goal: 'Chào buổi sáng, buổi trưa, buổi tối, cảm ơn và xin lỗi đúng lúc',
      points: [
        'Đây là những câu chào cố định: cứ học thuộc cả câu, chưa cần hiểu ngữ pháp.',
        '<b class="jp">ございます</b> làm câu lịch sự hơn — nói với thầy cô, người lớn, người lạ. Với bạn thân chỉ cần <b class="jp">おはよう</b>.',
        'Chữ <b class="jp">は</b> trong <b class="jp">こんにちは</b>, <b class="jp">こんばんは</b> đọc là "wa".',
      ],
      tip: 'Người Nhật vừa chào vừa cúi người nhẹ (<span class="jp">おじぎ</span>). Khi chia tay bạn bè, họ hay nói <b class="jp">じゃあね</b> (jaa ne) hơn là <span class="jp">さようなら</span> — <span class="jp">さようなら</span> nghe như tạm biệt lâu ngày.',
      ex: [
        { j: 'おはよう|ございます。', r: 'ohayou|gozaimasu', v: 'Chào buổi sáng (lịch sự).', k: 'おはようございます。' },
        { j: 'こんにちは。', r: 'konnichiwa', v: 'Xin chào (ban ngày).', k: 'こんにちは。' },
        { j: 'こんばんは。', r: 'konbanwa', v: 'Chào buổi tối.', k: 'こんばんは。' },
        { j: 'ありがとう|ございます。', r: 'arigatou|gozaimasu', v: 'Cảm ơn (lịch sự).', k: 'ありがとうございます。' },
        { j: 'すみません。', r: 'sumimasen', v: 'Xin lỗi / Cho tôi hỏi.', k: 'すみません。' },
        { j: 'おやすみ|なさい。', r: 'oyasumi|nasai', v: 'Chúc ngủ ngon.', k: 'おやすみなさい。' },
      ],
      talk: [
        { sit: 'Buổi sáng gặp cô giáo ở trường, bạn nói:', a: 0, wrong: [2, 5] },
        { sit: 'Người bán hàng đưa đồ cho bạn, bạn nói:', a: 3, wrong: [1, 5] },
        { sit: 'Bạn muốn gọi nhân viên quán ăn để hỏi, bạn nói:', a: 4, wrong: [0, 2] },
        { sit: 'Gặp hàng xóm lúc 8 giờ tối, bạn nói:', a: 2, wrong: [0, 5] },
      ],
    },
    {
      id: 'g2', title: 'Giới thiệu bản thân', jp: 'じこしょうかい', icon: 'friends',
      goal: 'Nói tên, nghề, quốc tịch với mẫu わたしは 〜です',
      pattern: { parts: [['Tôi / Tên', 'n'], ['は', 'p', 'wa'], ['danh từ', 'n'], ['です', 'e', 'desu']], mean: 'A は B です = A là B' },
      points: [
        '<b class="jp">は</b> ở đây là trợ từ, đọc là <b>"wa"</b> (không đọc "ha"). Nó đánh dấu chủ đề: "nói về A thì…".',
        '<b class="jp">です</b> đặt cuối câu cho lịch sự, đọc nhẹ gần như "đét" (chữ u gần như câm).',
        'Tiếng Nhật không đổi theo "tôi / bạn / anh ấy" — <span class="jp">です</span> dùng cho mọi người.',
        'Thêm <b class="jp">さん</b> sau tên người khác (Tanaka-san), <b>không</b> thêm vào tên mình.',
      ],
      tip: 'Khi đã rõ đang nói về mình, người Nhật thường bỏ <span class="jp">わたしは</span>: chỉ cần <b class="jp">リンです</b>. Mở đầu bằng <b class="jp">はじめまして</b>, kết thúc bằng <b class="jp">よろしく おねがいします</b> kèm một cái cúi chào.',
      ex: [
        { j: 'はじめまして。', r: 'hajimemashite', v: 'Rất vui được gặp bạn (lần đầu).', k: 'はじめまして。' },
        { j: 'わたし|は |リン|です。', r: 'watashi|wa|Rin|desu', v: 'Tôi là Linh.', k: '私はリンです。' },
        { j: 'わたし|は |がくせい|です。', r: 'watashi|wa|gakusei|desu', v: 'Tôi là học sinh / sinh viên.', k: '私は学生です。' },
        { j: 'ベトナムじん|です。', r: 'betonamujin|desu', v: '(Tôi) là người Việt Nam.', k: 'ベトナム人です。' },
        { j: 'たなか|さん|は |せんせい|です。', r: 'Tanaka|-san|wa|sensei|desu', v: 'Anh / chị Tanaka là giáo viên.', k: '田中さんは先生です。' },
        { j: 'よろしく |おねがい|します。', r: 'yoroshiku|onegai|shimasu', v: 'Rất mong được giúp đỡ.', k: 'よろしくお願いします。' },
      ],
      fill: [
        { ex: 2, tok: 1, wrong: ['を', 'に'], why: '<b class="jp">は</b> (wa) đứng sau chủ đề <span class="jp">わたし</span>.' },
        { ex: 2, tok: 3, wrong: ['ます', 'の'], why: 'Câu "A là B" kết thúc bằng <b class="jp">です</b>.' },
        { ex: 4, tok: 1, wrong: ['です', 'の'], why: 'Gọi người khác lịch sự: tên + <b class="jp">さん</b>.' },
      ],
      talk: [
        { q: 'はじめまして。たなかです。', qr: 'hajimemashite. Tanaka desu.', qv: 'Rất vui được gặp. Tôi là Tanaka.', a: ['はじめまして。リンです。', 'hajimemashite. Rin desu.', 'Rất vui được gặp. Mình là Linh.'], wrong: [['おやすみなさい。', 'oyasuminasai.'], ['リンさんです。', 'Rin-san desu.']] },
        { sit: 'Giới thiệu xong, bạn cúi chào và nói:', a: 5, wrong: [['いただきます。', 'itadakimasu.'], ['こんばんは。', 'konbanwa.']] },
      ],
    },
    {
      id: 'g3', title: 'Hỏi "phải không?"', jp: 'ですか', icon: 'speech',
      goal: 'Đặt câu hỏi có / không và trả lời はい',
      pattern: { parts: [['A', 'n'], ['は', 'p', 'wa'], ['B', 'n'], ['ですか', 'e', 'desu ka']], mean: 'A có phải là B không?' },
      points: [
        'Thêm <b class="jp">か</b> vào cuối câu là thành câu hỏi. Không cần đảo chữ như tiếng Anh.',
        'Khi nói, lên giọng nhẹ ở <span class="jp">か</span> ↗.',
        'Trả lời: <b class="jp">はい、そうです</b> (vâng, đúng vậy) hoặc nhắc lại: <span class="jp">はい、がくせいです</span>.',
      ],
      tip: 'Người Nhật nói <span class="jp">はい</span> rất nhiều, kể cả khi chỉ muốn nói "mình đang nghe đây". <b class="jp">おなまえは？</b> là cách hỏi tên ngắn gọn mà vẫn lịch sự.',
      ex: [
        { j: 'リン|さん|は |がくせい|ですか。', r: 'Rin|-san|wa|gakusei|desu ka', v: 'Linh là học sinh phải không?', k: 'リンさんは学生ですか。' },
        { j: 'はい、|がくせい|です。', r: 'hai,|gakusei|desu', v: 'Vâng, mình là học sinh.', k: 'はい、学生です。' },
        { j: 'はい、|そう|です。', r: 'hai,|sou|desu', v: 'Vâng, đúng vậy.', k: 'はい、そうです。' },
        { j: 'たなか|さん|は |にほんじん|ですか。', r: 'Tanaka|-san|wa|nihonjin|desu ka', v: 'Anh Tanaka là người Nhật phải không?', k: '田中さんは日本人ですか。' },
        { j: 'おなまえ|は？', r: 'onamae|wa', v: 'Tên bạn là gì?', k: 'お名前は？' },
      ],
      fill: [
        { ex: 0, tok: 4, wrong: ['です', 'ます'], why: 'Muốn hỏi thì thêm <b class="jp">か</b>: です → <b class="jp">ですか</b>.' },
        { ex: 3, tok: 2, wrong: ['を', 'に'], why: '<b class="jp">は</b> (wa) đánh dấu người đang được nói tới.' },
      ],
      talk: [
        { q: 'リンさんは がくせいですか。', qr: 'Rin-san wa gakusei desu ka?', qv: 'Linh là học sinh phải không?', a: 2, wrong: [['こんばんは。', 'konbanwa.'], ['ありがとうございます。', 'arigatou gozaimasu.']] },
        { q: 'おなまえは？', qr: 'onamae wa?', qv: 'Tên bạn là gì?', a: ['リンです。', 'Rin desu.', 'Mình là Linh.'], wrong: [['はい、そうです。', 'hai, sou desu.'], ['せんせいですか。', 'sensei desu ka?']] },
      ],
    },
    {
      id: 'g4', title: 'Nói "không phải"', jp: 'じゃありません', icon: 'bulb',
      goal: 'Phủ định lịch sự và trả lời "không" khéo léo',
      pattern: { parts: [['A', 'n'], ['は', 'p', 'wa'], ['B', 'n'], ['じゃありません', 'e', 'ja arimasen']], mean: 'A không phải là B' },
      points: [
        'Đổi <span class="jp">です</span> thành <b class="jp">じゃありません</b> để nói "không phải là".',
        'Nói chuyện hằng ngày, người Nhật cũng hay dùng <b class="jp">じゃないです</b> — nghĩa giống hệt, vẫn lịch sự.',
        'Cách nói "không" tự nhiên: <b class="jp">いいえ、ちがいます</b> (không, không phải ạ).',
      ],
      tip: 'Người Nhật ít khi nói <span class="jp">いいえ</span> cộc lốc. Họ thường nói nhẹ: <span class="jp">いいえ、ちがいます</span> hoặc <span class="jp">ええと…</span> rồi mới giải thích.',
      ex: [
        { j: 'わたし|は |せんせい|じゃありません。', r: 'watashi|wa|sensei|ja arimasen', v: 'Tôi không phải là giáo viên.', k: '私は先生じゃありません。' },
        { j: 'いいえ、|ちがいます。', r: 'iie,|chigaimasu', v: 'Không, không phải ạ.', k: 'いいえ、違います。' },
        { j: 'にほんじん|じゃないです。', r: 'nihonjin|ja nai desu', v: '(Tôi) không phải người Nhật.', k: '日本人じゃないです。' },
        { j: 'ベトナムじん|です。', r: 'betonamujin|desu', v: '(Tôi) là người Việt Nam.', k: 'ベトナム人です。' },
        { j: 'たなか|さん|は |がくせい|じゃありません。', r: 'Tanaka|-san|wa|gakusei|ja arimasen', v: 'Anh Tanaka không phải là học sinh.', k: '田中さんは学生じゃありません。' },
      ],
      fill: [
        { ex: 0, tok: 3, wrong: ['です', 'ですか'], why: 'Phủ định của です là <b class="jp">じゃありません</b>.' },
        { ex: 4, tok: 2, wrong: ['を', 'の'], why: '<b class="jp">は</b> (wa) đứng sau người được nói tới.' },
      ],
      talk: [
        { q: 'リンさんは にほんじんですか。', qr: 'Rin-san wa nihonjin desu ka?', qv: 'Linh là người Nhật phải không?', a: ['いいえ、ベトナムじんです。', 'iie, betonamujin desu.', 'Không, mình là người Việt Nam.'], wrong: [['はい、ベトナムじんです。', 'hai, betonamujin desu.'], ['おはようございます。', 'ohayou gozaimasu.']] },
        { q: 'せんせいですか。', qr: 'sensei desu ka?', qv: 'Bạn là giáo viên à?', a: ['いいえ、ちがいます。がくせいです。', 'iie, chigaimasu. gakusei desu.', 'Không ạ, mình là học sinh.'], wrong: [['はい、ちがいます。', 'hai, chigaimasu.'], ['よろしく おねがいします。', 'yoroshiku onegaishimasu.']] },
      ],
    },
    {
      id: 'g5', title: 'Cái này là gì?', jp: 'これ・それ・あれ', icon: 'gift',
      goal: 'Hỏi tên đồ vật và trả lời bằng これ / それ / あれ',
      pattern: { parts: [['これ / それ / あれ', 'n'], ['は', 'p', 'wa'], ['なん', 'q', 'nan'], ['ですか', 'e', 'desu ka']], mean: 'Cái này / đó / kia là gì?' },
      points: [
        '<b class="jp">これ</b>: vật gần mình. <b class="jp">それ</b>: vật gần người nghe. <b class="jp">あれ</b>: vật ở xa cả hai.',
        '<b class="jp">なん</b> = cái gì. Trả lời bằng cách thay <span class="jp">なん</span> bằng tên đồ vật: <span class="jp">それは ほんです</span>.',
        'Người hỏi cầm vật và nói <span class="jp">これ</span> → mình đáp bằng <span class="jp">それ</span>, vì vật đó gần người hỏi.',
      ],
      tip: 'Đi chợ hay ăn quán ở Nhật, bạn sẽ nghe và nói <b class="jp">これ、なんですか？</b> rất nhiều — hỏi vậy hoàn toàn lịch sự.',
      ex: [
        { j: 'これ|は |なん|ですか。', r: 'kore|wa|nan|desu ka', v: 'Cái này là gì?', k: 'これは何ですか。' },
        { j: 'それ|は |ほん|です。', r: 'sore|wa|hon|desu', v: 'Đó là quyển sách.', k: 'それは本です。' },
        { j: 'あれ|は |なん|ですか。', r: 'are|wa|nan|desu ka', v: 'Cái kia là gì?', k: 'あれは何ですか。' },
        { j: 'あれ|は |ふじさん|です。', r: 'are|wa|Fujisan|desu', v: 'Kia là núi Phú Sĩ.', k: 'あれは富士山です。' },
        { j: 'これ|は |おちゃ|です。', r: 'kore|wa|ocha|desu', v: 'Đây là trà.', k: 'これはお茶です。' },
      ],
      fill: [
        { ex: 1, tok: 0, wrong: ['これ', 'あれ'], why: 'Vật gần người nghe → <b class="jp">それ</b> (đó).' },
        { ex: 3, tok: 0, wrong: ['これ', 'それ'], why: 'Núi ở xa cả hai người → <b class="jp">あれ</b> (kia).' },
        { ex: 0, tok: 2, wrong: ['ほん', 'わたし'], why: 'Hỏi "cái gì" → <b class="jp">なん</b>.' },
      ],
      talk: [
        { q: 'これは なんですか。', qr: 'kore wa nan desu ka?', qv: 'Bạn của bạn cầm một quyển sách lên hỏi: "Cái này là gì?"', a: 1, wrong: [['はい、そうです。', 'hai, sou desu.'], ['わたしは ほんです。', 'watashi wa hon desu.']] },
      ],
    },
    {
      id: 'g6', title: 'Của ai?', jp: 'わたしの', icon: 'umbrella',
      goal: 'Nói đồ vật của ai với の',
      pattern: { parts: [['Người', 'n'], ['の', 'p', 'no'], ['Đồ vật', 'n']], mean: 'Đồ vật của người đó (thứ tự ngược tiếng Việt)' },
      points: [
        '<b class="jp">の</b> nối hai danh từ: <span class="jp">わたしの ほん</span> = sách <b>của tôi</b>. Chú ý: người đứng trước, vật đứng sau — ngược với tiếng Việt.',
        '<b class="jp">だれ</b> = ai. <span class="jp">だれのですか</span> = của ai?',
        'Trả lời ngắn, bỏ tên đồ vật: <b class="jp">わたしのです</b> (của tôi).',
      ],
      tip: '<span class="jp">の</span> còn có nghĩa "của / thuộc": <span class="jp">にほんの くるま</span> = xe của Nhật (xe Nhật).',
      ex: [
        { j: 'これ|は |わたし|の |ほん|です。', r: 'kore|wa|watashi|no|hon|desu', v: 'Đây là sách của tôi.', k: 'これは私の本です。' },
        { j: 'それ|は |だれ|の |かさ|ですか。', r: 'sore|wa|dare|no|kasa|desu ka', v: 'Đó là cái ô (dù) của ai?', k: 'それは誰の傘ですか。' },
        { j: 'たなか|さん|の|です。', r: 'Tanaka|-san|no|desu', v: 'Của anh Tanaka.', k: '田中さんのです。' },
        { j: 'わたし|の |ねこ|です。', r: 'watashi|no|neko|desu', v: 'Mèo của tôi đấy.', k: '私の猫です。' },
        { j: 'にほん|の |おちゃ|です。', r: 'nihon|no|ocha|desu', v: 'Trà của Nhật.', k: '日本のお茶です。' },
      ],
      fill: [
        { ex: 0, tok: 3, wrong: ['は', 'を'], why: '<b class="jp">の</b> nối "tôi" với "sách" → sách của tôi.' },
        { ex: 1, tok: 2, wrong: ['わたし', 'これ'], why: 'Hỏi "của ai" → <b class="jp">だれ</b>の.' },
      ],
      talk: [
        { q: 'これは だれの かさですか。', qr: 'kore wa dare no kasa desu ka?', qv: 'Đây là ô của ai?', a: ['わたしのです。', 'watashi no desu.', 'Của mình.'], wrong: [['わたしは かさです。', 'watashi wa kasa desu.'], ['いいえ、かさです。', 'iie, kasa desu.']] },
      ],
    },
    {
      id: 'g7', title: 'Ở đâu?', jp: 'どこですか', icon: 'map',
      goal: 'Hỏi đường, hỏi chỗ với どこ và ここ / そこ / あそこ',
      pattern: { parts: [['Nơi / vật', 'n'], ['は', 'p', 'wa'], ['どこ', 'q', 'doko'], ['ですか', 'e', 'desu ka']], mean: '… ở đâu?' },
      points: [
        '<b class="jp">ここ</b>: chỗ này (gần mình). <b class="jp">そこ</b>: chỗ đó (gần người nghe). <b class="jp">あそこ</b>: chỗ kia (xa cả hai).',
        'Hỏi người lạ: mở đầu bằng <b class="jp">すみません</b> (xin lỗi, cho hỏi).',
        'Trả lời: <span class="jp">〜は あそこです</span> hoặc ngắn gọn <span class="jp">あそこです</span>.',
      ],
      tip: 'Câu cứu cánh khi ở Nhật: <b class="jp">すみません、トイレは どこですか。</b> Người Nhật rất sẵn lòng chỉ đường, nhiều khi còn dẫn bạn đi tận nơi.',
      ex: [
        { j: 'すみません、|トイレ|は |どこ|ですか。', r: 'sumimasen,|toire|wa|doko|desu ka', v: 'Xin lỗi, nhà vệ sinh ở đâu ạ?', k: 'すみません、トイレはどこですか。' },
        { j: 'あそこ|です。', r: 'asoko|desu', v: 'Ở đằng kia.', k: 'あそこです。' },
        { j: 'えき|は |どこ|ですか。', r: 'eki|wa|doko|desu ka', v: 'Nhà ga ở đâu?', k: '駅はどこですか。' },
        { j: 'えき|は |あそこ|です。', r: 'eki|wa|asoko|desu', v: 'Nhà ga ở đằng kia.', k: '駅はあそこです。' },
        { j: 'ここ|は |がっこう|です。', r: 'koko|wa|gakkou|desu', v: 'Chỗ này là trường học.', k: 'ここは学校です。' },
      ],
      fill: [
        { ex: 2, tok: 2, wrong: ['なん', 'だれ'], why: 'Hỏi nơi chốn → <b class="jp">どこ</b> (ở đâu).' },
        { ex: 4, tok: 0, wrong: ['これ', 'わたし'], why: 'Nói về chỗ mình đang đứng → <b class="jp">ここ</b> (chỗ này).' },
      ],
      talk: [
        { q: 'すみません、えきは どこですか。', qr: 'sumimasen, eki wa doko desu ka?', qv: 'Xin lỗi, nhà ga ở đâu ạ?', a: 1, wrong: [['えきです。', 'eki desu.'], ['わたしのです。', 'watashi no desu.']] },
      ],
    },
    {
      id: 'g8', title: 'Mua sắm', jp: 'いくらですか', icon: 'shop',
      goal: 'Hỏi giá, gọi món, mua đồ với いくら và 〜を ください',
      pattern: { parts: [['Đồ vật', 'n'], ['を', 'p', 'o'], ['ください', 'e', 'kudasai']], mean: 'Cho tôi … (khi mua, gọi món)' },
      points: [
        '<b class="jp">いくら</b> = bao nhiêu tiền. <span class="jp">これは いくらですか</span> = cái này bao nhiêu tiền?',
        '<b class="jp">を</b> (đọc "o") đứng sau thứ bạn muốn lấy: <span class="jp">〜を ください</span> = cho tôi ….',
        'Đếm đồ: <span class="jp">ひとつ</span> (1 cái), <span class="jp">ふたつ</span> (2 cái), <span class="jp">みっつ</span> (3 cái).',
        'Tiền Nhật là <span class="jp">えん</span> (yên): <span class="jp">ひゃくえん</span> = 100 yên.',
      ],
      tip: 'Vào cửa hàng, nhân viên sẽ nói <b class="jp">いらっしゃいませ</b> (irasshaimase — xin mời quý khách). Bạn không cần đáp lại câu đó, chỉ cần mỉm cười hoặc gật đầu nhẹ.',
      ex: [
        { j: 'これ|は |いくら|ですか。', r: 'kore|wa|ikura|desu ka', v: 'Cái này bao nhiêu tiền?', k: 'これはいくらですか。' },
        { j: 'ひゃく|えん|です。', r: 'hyaku|en|desu', v: '100 yên.', k: '100円です。' },
        { j: 'これ|を |ください。', r: 'kore|o|kudasai', v: 'Cho tôi cái này.', k: 'これをください。' },
        { j: 'コーヒー|を |ふたつ |ください。', r: 'koohii|o|futatsu|kudasai', v: 'Cho tôi 2 cà phê.', k: 'コーヒーを二つください。' },
        { j: 'おちゃ|を |ひとつ |ください。', r: 'ocha|o|hitotsu|kudasai', v: 'Cho tôi 1 trà.', k: 'お茶を一つください。' },
      ],
      fill: [
        { ex: 2, tok: 1, wrong: ['は', 'の'], why: '<b class="jp">を</b> (o) đứng sau thứ bạn muốn: <span class="jp">これを ください</span>.' },
        { ex: 0, tok: 2, wrong: ['なん', 'どこ'], why: 'Hỏi giá → <b class="jp">いくら</b>.' },
      ],
      talk: [
        { sit: 'Ở quán cà phê, bạn muốn gọi 1 ly cà phê:', a: ['コーヒーを ひとつ ください。', 'koohii o hitotsu kudasai.', 'Cho tôi 1 cà phê.'], wrong: [['コーヒーは どこですか。', 'koohii wa doko desu ka?'], ['コーヒーの ひとつです。', 'koohii no hitotsu desu.']] },
        { q: 'いらっしゃいませ！', qr: 'irasshaimase!', qv: 'Nhân viên cửa hàng chào bạn: "Xin mời quý khách!"', a: ['（にっこり）', '(mỉm cười)', 'Không cần nói gì — mỉm cười hoặc gật đầu là đủ.'], wrong: [['いらっしゃいませ！', 'irasshaimase!'], ['おやすみなさい。', 'oyasuminasai.']] },
      ],
    },
    {
      id: 'g9', title: 'Ăn, uống', jp: 'たべます・のみます', icon: 'rice',
      goal: 'Nói mình làm gì với động từ ます / ません',
      pattern: { parts: [['Món', 'n'], ['を', 'p', 'o'], ['Động từ', 'v'], ['ます', 'e', 'masu']], mean: 'Làm gì với cái gì (lịch sự)' },
      points: [
        'Động từ luôn đứng <b>cuối câu</b>: <span class="jp">すしを たべます</span> = (tôi) ăn sushi.',
        '<b class="jp">を</b> (o) đánh dấu thứ bị tác động: ăn <b>cái gì</b>, uống <b>cái gì</b>.',
        '<b class="jp">ます</b>: có làm. <b class="jp">ません</b>: không làm. Thêm <b class="jp">か</b> để hỏi.',
      ],
      tip: 'Trước khi ăn, người Nhật chắp tay nói <b class="jp">いただきます</b> (itadakimasu); ăn xong nói <b class="jp">ごちそうさまでした</b> (gochisousama deshita).',
      ex: [
        { j: 'すし|を |たべます。', r: 'sushi|o|tabemasu', v: 'Tôi ăn sushi.', k: '寿司を食べます。' },
        { j: 'おちゃ|を |のみます。', r: 'ocha|o|nomimasu', v: 'Tôi uống trà.', k: 'お茶を飲みます。' },
        { j: 'コーヒー|を |のみますか。', r: 'koohii|o|nomimasu ka', v: 'Bạn có uống cà phê không?', k: 'コーヒーを飲みますか。' },
        { j: 'いいえ、|のみません。', r: 'iie,|nomimasen', v: 'Không, tôi không uống.', k: 'いいえ、飲みません。' },
        { j: 'いただきます。', r: 'itadakimasu', v: 'Mời cả nhà / Cảm ơn bữa ăn (trước khi ăn).', k: 'いただきます。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['に', 'の'], why: 'Ăn <b>cái gì</b> → <b class="jp">を</b> (o).' },
        { ex: 3, tok: 1, wrong: ['のみます。', 'のみますか。'], why: 'Không làm: ます → <b class="jp">ません</b>.' },
      ],
      talk: [
        { q: 'コーヒーを のみますか。', qr: 'koohii o nomimasu ka?', qv: 'Bạn uống cà phê không?', a: ['はい、のみます。', 'hai, nomimasu.', 'Có, mình uống.'], wrong: [['はい、のみません。', 'hai, nomimasen.'], ['コーヒーを ください。', 'koohii o kudasai.']] },
        { sit: 'Cơm vừa dọn ra, trước khi ăn bạn nói:', a: 4, wrong: [['ごちそうさまでした。', 'gochisousama deshita.'], ['おやすみなさい。', 'oyasuminasai.']] },
      ],
    },
    {
      id: 'g10', title: 'Đi đâu?', jp: 'に いきます', icon: 'walk',
      goal: 'Nói nơi mình đi đến với に いきます / かえります',
      pattern: { parts: [['Nơi', 'n'], ['に', 'p', 'ni'], ['いきます', 'v', 'ikimasu']], mean: 'Đi đến nơi nào đó' },
      points: [
        '<b class="jp">に</b> chỉ nơi đến: <span class="jp">がっこうに いきます</span> = đi đến trường.',
        '<span class="jp">いきます</span> (đi), <span class="jp">きます</span> (đến), <span class="jp">かえります</span> (về).',
        'Hỏi: <b class="jp">どこに いきますか</b> = (bạn) đi đâu?',
      ],
      tip: 'Có thể dùng <b class="jp">へ</b> (đọc "e") thay cho <span class="jp">に</span>: <span class="jp">がっこうへ いきます</span> — nghĩa như nhau. Gặp người quen ngoài đường, người Nhật hay hỏi <span class="jp">おでかけですか</span> (đi đâu đấy?) như một câu chào, không cần kể chi tiết.',
      ex: [
        { j: 'がっこう|に |いきます。', r: 'gakkou|ni|ikimasu', v: 'Tôi đi đến trường.', k: '学校に行きます。' },
        { j: 'どこ|に |いきますか。', r: 'doko|ni|ikimasu ka', v: 'Bạn đi đâu?', k: 'どこに行きますか。' },
        { j: 'スーパー|に |いきます。', r: 'suupaa|ni|ikimasu', v: 'Tôi đi siêu thị.', k: 'スーパーに行きます。' },
        { j: 'うち|に |かえります。', r: 'uchi|ni|kaerimasu', v: 'Tôi về nhà.', k: 'うちに帰ります。' },
        { j: 'あした、|にほん|に |いきます。', r: 'ashita,|nihon|ni|ikimasu', v: 'Ngày mai tôi đi Nhật.', k: '明日、日本に行きます。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['で', 'の'], why: 'Nơi đến → <b class="jp">に</b> (hoặc へ).' },
        { ex: 3, tok: 2, wrong: ['たべます。', 'のみます。'], why: 'Về nhà → <b class="jp">かえります</b>.' },
      ],
      talk: [
        { q: 'どこに いきますか。', qr: 'doko ni ikimasu ka?', qv: 'Bạn đi đâu đấy?', a: 2, wrong: [['スーパーを たべます。', 'suupaa o tabemasu.'], ['スーパーは どこですか。', 'suupaa wa doko desu ka?']] },
      ],
    },
    {
      id: 'g11', title: 'Đã làm gì?', jp: 'ました', icon: 'calendar',
      goal: 'Kể việc đã làm với ました / ませんでした',
      pattern: { parts: [['Thời gian', 'n'], ['Việc', 'n'], ['を', 'p', 'o'], ['Động từ', 'v'], ['ました', 'e', 'mashita']], mean: 'Đã làm gì (quá khứ)' },
      points: [
        '<span class="jp">ます</span> → <b class="jp">ました</b>: đã làm. <span class="jp">ません</span> → <b class="jp">ませんでした</b>: đã không làm.',
        'Từ chỉ thời gian thường đứng đầu câu: <span class="jp">きのう</span> (hôm qua), <span class="jp">けさ</span> (sáng nay).',
        '<span class="jp">みます</span> (xem) → <span class="jp">みました</span> (đã xem).',
      ],
      tip: 'Hỏi "ăn cơm chưa?": <span class="jp">ごはん、たべましたか</span>. Trả lời "chưa" tự nhiên là <b class="jp">まだです</b> (mada desu) — người Nhật dùng câu này nhiều hơn <span class="jp">たべませんでした</span>.',
      ex: [
        { j: 'きのう、|えいが|を |みました。', r: 'kinou,|eiga|o|mimashita', v: 'Hôm qua tôi đã xem phim.', k: '昨日、映画を見ました。' },
        { j: 'ごはん、|たべましたか。', r: 'gohan,|tabemashita ka', v: 'Bạn ăn cơm chưa?', k: 'ご飯、食べましたか。' },
        { j: 'はい、|たべました。', r: 'hai,|tabemashita', v: 'Rồi, mình ăn rồi.', k: 'はい、食べました。' },
        { j: 'いいえ、|まだ|です。', r: 'iie,|mada|desu', v: 'Chưa, mình chưa ăn.', k: 'いいえ、まだです。' },
        { j: 'けさ、|コーヒー|を |のみませんでした。', r: 'kesa,|koohii|o|nomimasen deshita', v: 'Sáng nay tôi đã không uống cà phê.', k: '今朝、コーヒーを飲みませんでした。' },
      ],
      fill: [
        { ex: 0, tok: 3, wrong: ['みます。', 'みません。'], why: 'Hôm qua → quá khứ: <b class="jp">みました</b>.' },
        { ex: 4, tok: 3, wrong: ['のみません。', 'のみました。'], why: 'Đã <b>không</b> làm → <b class="jp">ませんでした</b>.' },
      ],
      talk: [
        { q: 'ごはん、たべましたか。', qr: 'gohan, tabemashita ka?', qv: 'Ăn cơm chưa?', a: 3, wrong: [['いいえ、たべます。', 'iie, tabemasu.'], ['はい、まだです。', 'hai, mada desu.']] },
      ],
    },
    {
      id: 'g12', title: 'Rủ nhau', jp: 'ませんか', icon: 'party',
      goal: 'Rủ ai đó cùng làm, đồng ý và từ chối khéo',
      pattern: { parts: [['いっしょに', 't', 'issho ni'], ['Động từ', 'v'], ['ませんか', 'e', 'masen ka']], mean: 'Cùng … nhé? (rủ lịch sự)' },
      points: [
        'Đổi <span class="jp">ます</span> → <b class="jp">ませんか</b> để rủ: <span class="jp">たべませんか</span> = (cùng) ăn không?',
        'Đồng ý: <b class="jp">いいですね</b> (hay quá) rồi <b class="jp">〜ましょう</b> (cùng … thôi).',
        '<span class="jp">いっしょに</span> = cùng nhau.',
      ],
      tip: 'Muốn từ chối, người Nhật không nói "không" thẳng mà nói <b class="jp">すみません、ちょっと…</b> (xin lỗi, hơi…) rồi bỏ lửng — người nghe sẽ tự hiểu là bạn bận.',
      ex: [
        { j: 'いっしょに |たべませんか。', r: 'issho ni|tabemasen ka', v: 'Cùng ăn nhé?', k: '一緒に食べませんか。' },
        { j: 'いい|ですね。', r: 'ii|desu ne', v: 'Hay quá / Được đấy.', k: 'いいですね。' },
        { j: 'たべましょう。', r: 'tabemashou', v: 'Cùng ăn thôi!', k: '食べましょう。' },
        { j: 'こんど、|えいが|を |みませんか。', r: 'kondo,|eiga|o|mimasen ka', v: 'Lần tới cùng xem phim không?', k: '今度、映画を見ませんか。' },
        { j: 'すみません、|ちょっと…', r: 'sumimasen,|chotto', v: 'Xin lỗi, mình hơi… (từ chối khéo)', k: 'すみません、ちょっと…' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['たべます。', 'たべました。'], why: 'Rủ rê: ます → <b class="jp">ませんか</b>.' },
      ],
      talk: [
        { q: 'いっしょに コーヒーを のみませんか。', qr: 'issho ni koohii o nomimasen ka?', qv: 'Cùng uống cà phê không?', a: ['いいですね。のみましょう。', 'ii desu ne. nomimashou.', 'Hay quá. Uống thôi!'], wrong: [['いいえ、コーヒーです。', 'iie, koohii desu.'], ['はい、のみませんでした。', 'hai, nomimasen deshita.']] },
        { sit: 'Bạn bận nhưng muốn từ chối khéo lời rủ:', a: 4, wrong: [1, 2] },
      ],
    },
    {
      id: 'g13', title: 'Ngon, đắt, lạnh…', jp: 'おいしいです', icon: 'cake',
      goal: 'Miêu tả với tính từ đuôi い và phủ định くないです',
      pattern: { parts: [['Vật', 'n'], ['は', 'p', 'wa'], ['Tính từ', 'a'], ['です', 'e', 'desu']], mean: 'Vật như thế nào' },
      points: [
        'Tính từ đuôi <span class="jp">い</span>: <span class="jp">おいしい</span> (ngon), <span class="jp">たかい</span> (đắt / cao), <span class="jp">さむい</span> (lạnh), <span class="jp">おおきい</span> (to).',
        'Phủ định: bỏ <span class="jp">い</span>, thêm <b class="jp">くないです</b>: <span class="jp">たかい → たかくないです</span>.',
        'Đứng trước danh từ thì giữ nguyên: <span class="jp">おおきい ねこ</span> (con mèo to).',
      ],
      tip: 'Được mời ăn, khen <b class="jp">おいしい！</b> là cách cảm ơn người nấu dễ thương nhất. Đặc biệt: <span class="jp">いい</span> (tốt) → phủ định là <span class="jp">よくないです</span>.',
      ex: [
        { j: 'この |ラーメン|は |おいしい|です。', r: 'kono|raamen|wa|oishii|desu', v: 'Món ramen này ngon.', k: 'このラーメンはおいしいです。' },
        { j: 'これ|は |たかい|です。', r: 'kore|wa|takai|desu', v: 'Cái này đắt.', k: 'これは高いです。' },
        { j: 'それ|は |たかくない|です。', r: 'sore|wa|takakunai|desu', v: 'Cái đó không đắt.', k: 'それは高くないです。' },
        { j: 'おおきい |ねこ|ですね。', r: 'ookii|neko|desu ne', v: 'Con mèo to nhỉ!', k: '大きい猫ですね。' },
        { j: 'きょう|は |さむい|です。', r: 'kyou|wa|samui|desu', v: 'Hôm nay lạnh.', k: '今日は寒いです。' },
      ],
      fill: [
        { ex: 2, tok: 2, wrong: ['たかい', 'たかいじゃない'], why: 'Tính từ い phủ định: <span class="jp">たかい</span> → <b class="jp">たかくない</b>.' },
      ],
      talk: [
        { q: 'ラーメン、どうですか。', qr: 'raamen, dou desu ka?', qv: 'Ramen thế nào?', a: ['おいしいです！', 'oishii desu!', 'Ngon ạ!'], wrong: [['ラーメンを ください。', 'raamen o kudasai.'], ['ラーメンは どこですか。', 'raamen wa doko desu ka?']] },
      ],
    },
    {
      id: 'g14', title: 'Mình muốn…', jp: 'たいです', icon: 'plane',
      goal: 'Nói điều mình muốn làm với 〜たいです',
      pattern: { parts: [['Việc', 'n'], ['を / に', 'p', 'o / ni'], ['Động từ (bỏ ます)', 'v'], ['たいです', 'e', 'tai desu']], mean: 'Muốn làm gì' },
      points: [
        'Bỏ <span class="jp">ます</span>, thêm <b class="jp">たいです</b>: <span class="jp">いきます → いきたいです</span> (muốn đi).',
        'Hỏi: <span class="jp">なにを たべたいですか</span> = muốn ăn gì? (<span class="jp">なに</span> = cái gì)',
        'Không muốn: <b class="jp">〜たくないです</b>: <span class="jp">いきたくないです</span>.',
      ],
      tip: 'Với thầy cô hay người lớn tuổi, người Nhật tránh hỏi thẳng <span class="jp">〜たいですか</span>; với bạn bè, người ngang hàng thì dùng thoải mái.',
      ex: [
        { j: 'にほん|に |いきたい|です。', r: 'nihon|ni|ikitai|desu', v: 'Tôi muốn đi Nhật.', k: '日本に行きたいです。' },
        { j: 'なに|を |たべたい|ですか。', r: 'nani|o|tabetai|desu ka', v: 'Bạn muốn ăn gì?', k: '何を食べたいですか。' },
        { j: 'ラーメン|を |たべたい|です。', r: 'raamen|o|tabetai|desu', v: 'Tôi muốn ăn ramen.', k: 'ラーメンを食べたいです。' },
        { j: 'きょう|は |いきたくない|です。', r: 'kyou|wa|ikitakunai|desu', v: 'Hôm nay tôi không muốn đi.', k: '今日は行きたくないです。' },
      ],
      fill: [
        { ex: 0, tok: 2, wrong: ['いきます', 'いきました'], why: 'Muốn làm: bỏ ます, thêm たい → <b class="jp">いきたい</b>です.' },
      ],
      talk: [
        { q: 'なにを たべたいですか。', qr: 'nani o tabetai desu ka?', qv: 'Bạn muốn ăn gì?', a: 2, wrong: [['ラーメンは どこですか。', 'raamen wa doko desu ka?'], ['はい、たべたいです。', 'hai, tabetai desu.']] },
      ],
    },
    {
      id: 'g15', title: 'Nhờ giúp', jp: 'てください', icon: 'bulb',
      goal: 'Những câu nhờ vả cần nhất khi mới nói tiếng Nhật',
      pattern: { parts: [['Động từ dạng て', 'v'], ['ください', 'e', 'kudasai']], mean: 'Xin hãy … (nhờ lịch sự)' },
      points: [
        'Học thuộc mấy câu dưới đây trước — rất cần khi mới nói chuyện với người Nhật.',
        '<span class="jp">まって</span> (chờ), <span class="jp">いって</span> (nói), <span class="jp">はなして</span> (nói chuyện) là dạng て của động từ — sẽ học kỹ sau.',
        '<span class="jp">ゆっくり</span> = chậm rãi. <span class="jp">もう いちど</span> = thêm một lần nữa.',
      ],
      tip: 'Nghe không kịp? Cứ nói <b class="jp">もう いちど おねがいします</b> hoặc <b class="jp">ゆっくり はなして ください</b> — người Nhật sẽ nói chậm lại ngay, chẳng ai phiền đâu.',
      ex: [
        { j: 'ちょっと |まって |ください。', r: 'chotto|matte|kudasai', v: 'Xin chờ một chút.', k: 'ちょっと待ってください。' },
        { j: 'もう |いちど |いって |ください。', r: 'mou|ichido|itte|kudasai', v: 'Xin nói lại lần nữa.', k: 'もう一度言ってください。' },
        { j: 'ゆっくり |はなして |ください。', r: 'yukkuri|hanashite|kudasai', v: 'Xin nói chậm thôi.', k: 'ゆっくり話してください。' },
        { j: 'もう |いちど |おねがい|します。', r: 'mou|ichido|onegai|shimasu', v: 'Làm ơn nói lại lần nữa.', k: 'もう一度お願いします。' },
      ],
      fill: [
        { ex: 0, tok: 2, wrong: ['です。', 'たべます。'], why: 'Nhờ ai làm gì: <span class="jp">〜て</span> + <b class="jp">ください</b>.' },
      ],
      talk: [
        { sit: 'Người Nhật nói nhanh quá, bạn không nghe kịp. Bạn nói:', a: 2, wrong: [['ゆっくり たべて ください。', 'yukkuri tabete kudasai.'], ['いただきます。', 'itadakimasu.']] },
        { sit: 'Bạn cần vài giây để tìm ví tiền. Bạn nói:', a: 0, wrong: [['いいですね。', 'ii desu ne.'], ['あそこです。', 'asoko desu.']] },
      ],
    },
    {
      id: 'g16', title: 'Mình thích…', jp: 'すきです', icon: 'music',
      goal: 'Nói điều mình thích / không thích lắm với が すきです',
      pattern: { parts: [['Thứ', 'n'], ['が', 'p', 'ga'], ['すきです', 'e', 'suki desu']], mean: 'Thích cái gì' },
      points: [
        'Với <span class="jp">すき</span> (thích), dùng <b class="jp">が</b> chứ không dùng を: <span class="jp">ねこが すきです</span>.',
        'Hỏi: <b class="jp">なにが すきですか</b> = (bạn) thích gì?',
        'Rất thích: <span class="jp">だいすきです</span>. Không thích lắm: <span class="jp">あまり すきじゃないです</span>.',
      ],
      tip: 'Người Nhật hiếm khi nói <span class="jp">きらいです</span> (ghét) — nói <b class="jp">あまり すきじゃないです</b> (không thích lắm) nghe lịch sự hơn nhiều.',
      ex: [
        { j: 'ねこ|が |すき|です。', r: 'neko|ga|suki|desu', v: 'Tôi thích mèo.', k: '猫が好きです。' },
        { j: 'なに|が |すき|ですか。', r: 'nani|ga|suki|desu ka', v: 'Bạn thích gì?', k: '何が好きですか。' },
        { j: 'アニメ|が |だいすき|です。', r: 'anime|ga|daisuki|desu', v: 'Tôi rất thích anime.', k: 'アニメが大好きです。' },
        { j: 'なっとう|は |あまり |すきじゃない|です。', r: 'nattou|wa|amari|suki ja nai|desu', v: 'Tôi không thích natto lắm.', k: '納豆はあまり好きじゃないです。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['を', 'に'], why: '<span class="jp">すき</span> đi với <b class="jp">が</b>: <span class="jp">ねこが すきです</span>.' },
      ],
      talk: [
        { q: 'なにが すきですか。', qr: 'nani ga suki desu ka?', qv: 'Bạn thích gì?', a: 0, wrong: [['ねこを すきです。', 'neko o suki desu.'], ['はい、すきです。', 'hai, suki desu.']] },
      ],
    },
  ];

  // ---------- các chặng: thứ tự học (nội dung bài nằm ở file này và các file data-talk-*.js) ----------
  SJ.TALK_L = SJ.TALK_L || {};
  SJ.TALK_X = SJ.TALK_X || {};
  BASE.forEach(l => { SJ.TALK_L[l.id] = l; });
  SJ.TALK_UNITS = [
    { id: 'tq1', title: 'Chào hỏi', jp: 'あいさつ', icon: 'wave_hand', color: '#ff6b9a', desc: 'Chào trong ngày, cảm ơn, xin lỗi, câu cửa miệng, đáp lời khi nghe', lessons: ['g1', 'g17', 'g18', 'g19'] },
    { id: 'tq2', title: 'Giới thiệu bản thân', jp: 'じこしょうかい', icon: 'nametag', color: '#ff8a3d', desc: 'Tên, nghề, quê quán; hỏi "phải không?", nói "không phải", "cũng vậy"', lessons: ['g2', 'g3', 'g4', 'g20', 'g21'] },
    { id: 'tq3', title: 'Đồ vật', jp: 'これは なんですか', icon: 'gift', color: '#4aa8ff', desc: 'Cái này, cái đó, của ai, tiếng Nhật gọi là gì', lessons: ['g5', 'g6', 'g22', 'g23'] },
    { id: 'tq4', title: 'Số & mua sắm', jp: 'かいもの', icon: 'shop', color: '#f2a516', desc: 'Đếm số, hỏi giá, gọi món, mua ở cửa hàng tiện lợi', lessons: ['g24', 'g8', 'g25', 'g26'] },
    { id: 'tq5', title: 'Nơi chốn', jp: 'どこですか', icon: 'map', color: '#1fb5a8', desc: 'Ở đâu, có không, trên dưới trong ngoài, có ai ở đó', lessons: ['g7', 'g27', 'g28', 'g29'] },
    { id: 'tq6', title: 'Thời gian', jp: 'いま なんじ？', icon: 'clock', color: '#6f7dff', desc: 'Mấy giờ, thứ mấy, hôm nay / ngày mai, từ… đến…, ngày tháng & sinh nhật', lessons: ['g30', 'g31', 'g32', 'g49'] },
    { id: 'tq7', title: 'Một ngày của tôi', jp: 'まいにち', icon: 'calendar', color: '#29c993', desc: 'Động từ ます: ăn uống, thức dậy, đi đâu, đi bằng gì', lessons: ['g9', 'g33', 'g10', 'g34'] },
    { id: 'tq8', title: 'Đã làm gì & rủ nhau', jp: 'きのう・こんど', icon: 'party', color: '#ff7a59', desc: 'Làm ở đâu, đã làm gì, rủ nhau, hẹn gặp', lessons: ['g35', 'g11', 'g12', 'g36'] },
    { id: 'tq9', title: 'Miêu tả', jp: 'どうですか', icon: 'sparkle', color: '#d65ee8', desc: 'Ngon, đẹp, yên tĩnh; rất / không lắm; hôm qua thế nào', lessons: ['g13', 'g37', 'g38', 'g39'] },
    { id: 'tq10', title: 'Thích & muốn', jp: 'すき・ほしい', icon: 'heart', color: '#ff5e8a', desc: 'Thích gì, giỏi gì, hiểu không, muốn làm gì, muốn có gì', lessons: ['g16', 'g40', 'g14', 'g41'] },
    { id: 'tq11', title: 'Nhờ vả & xin phép', jp: 'おねがいします', icon: 'hand', color: '#3fa0ff', desc: 'Xin hãy…, hỏi đường, xin phép, đang làm gì', lessons: ['g15', 'g42', 'g43', 'g44'] },
    { id: 'tq12', title: 'Trò chuyện tự nhiên', jp: 'かいわ', icon: 'friends', color: '#9b7bff', desc: 'Thời tiết, hỏi thăm, vì sao, khi bị ốm, khen và chia tay', lessons: ['g45', 'g46', 'g47', 'g48'] },
  ];

  const PUNCT = /[\s、。！？!?,.…「」（）()]/g;
  /** gộp bài từ mọi file dữ liệu theo thứ tự chặng — gọi khi mở phần Nói (các file data-talk-*.js đã tải xong) */
  SJ.talkPrep = function () {
    if (SJ.TALK) return SJ.TALK;
    const units = [], lessons = [], map = {};
    SJ.TALK_UNITS.forEach(u0 => {
      const u = Object.assign({}, u0, { lessons: [] });
      u0.lessons.forEach(id => {
        const l = SJ.TALK_L[id];
        if (!l || !l.ex) return;
        const x = SJ.TALK_X[id];
        // câu mẫu thêm cho bài có sẵn: nối vào sau (fill.ex của phần thêm đếm theo danh sách đã nối)
        if (x && !l._x) { l._x = 1; l.ex = l.ex.concat(x.ex || []); l.fill = (l.fill || []).concat(x.fill || []); l.talk = (l.talk || []).concat(x.talk || []); }
        l.id = id; l.unit = u.id;
        l.ex.forEach((e, i) => {
          e.toks = e.j.split('|');
          e.rtoks = e.r.split('|');
          e.jp = e.toks.join('');
          // romaji cả câu: tách từ bằng dấu cách, "-san" dính vào tên, tự thêm dấu câu cuối
          // (muốn khác thì ghi sẵn ở cuối r, vd. そうですか xuống giọng khi đáp lời → 'sou|desu ka.')
          const rr = e.rtoks.map(t => t.trim()).join(' ').replace(/ -/g, '-').replace(/\s+,/g, ',');
          e.rom = /[.?!…]$/.test(rr) ? rr : rr + (/[？?]$|か。$/.test(e.jp) ? '?' : /…$/.test(e.jp) ? '…' : /！$/.test(e.jp) ? '!' : '.');
          if (/[.?!…]$/.test(e.rtoks[e.rtoks.length - 1])) e.rtoks[e.rtoks.length - 1] = e.rtoks[e.rtoks.length - 1].replace(/[.?!…]+$/, '');
          e.say = e.jp.replace(/[|]/g, '');
          e.plain = e.jp.replace(PUNCT, '');
          e.key = id + '.' + i; e.lid = id;
        });
        u.lessons.push(l); lessons.push(l); map[id] = l;
      });
      if (u.lessons.length) units.push(u);
    });
    SJ.TALK = units; SJ.TALK_LESSONS = lessons; SJ.TALK_MAP = map;
    return units;
  };
})(window.SJ);
