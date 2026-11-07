/* SubelJapan — Nói & Ngữ pháp: g17–g23 (cảm ơn & xin lỗi, câu cửa miệng trong nhà, đáp lời khi nghe あいづち,
 * も "cũng", quê quán & nghề nghiệp, この・その・あの + danh từ, 〜は にほんごで なんですか)
 * + câu mẫu thêm cho bài gốc g1–g6 (SJ.TALK_X: nối sau câu cũ, fill.ex / talk a đếm theo danh sách đã nối)
 */
window.SJ = window.SJ || {};
(function (SJ) {
  SJ.TALK_L = SJ.TALK_L || {};
  SJ.TALK_X = SJ.TALK_X || {};
  Object.assign(SJ.TALK_L, {
    // ---------------- Chặng 1: Chào hỏi ----------------
    g17: {
      title: 'Cảm ơn & xin lỗi', jp: 'ありがとう', icon: 'thanks', kind: 'phrase',
      goal: 'Cảm ơn, xin lỗi và đáp lại cho đúng lúc, đúng người',
      points: [
        '<b class="jp">ありがとうございます</b>: cảm ơn lịch sự — với người lạ, người lớn, thầy cô. Với bạn bè, người nhà chỉ cần <b class="jp">ありがとう</b>.',
        'Được cảm ơn, đáp <b class="jp">どう いたしまして</b> (không có gì). Người Nhật còn hay đáp nhẹ nhàng <b class="jp">いいえ</b> (= "không đâu", ý là chuyện nhỏ thôi), kèm xua tay.',
        '<b class="jp">すみません</b> dùng cho 3 việc: xin lỗi nhẹ, gọi người ("cho tôi hỏi"), và cảm ơn khi đã làm phiền ai. <b class="jp">ごめんなさい</b>: xin lỗi bạn bè, người nhà — không dùng với khách hàng hay cấp trên.',
        '<b class="jp">だいじょうぶです</b> = không sao đâu. <b class="jp">しつれいします</b> = xin phép (khi vào / ra phòng thầy cô, khi cúp máy điện thoại).',
      ],
      tip: 'Người Nhật nói <span class="jp">すみません</span> nhiều không kém <span class="jp">ありがとう</span>: được ai nhặt đồ giúp hay nhường đường, họ nói <b class="jp">あ、すみません</b> — vừa cảm ơn vừa "xin lỗi đã làm phiền", kèm cúi đầu nhẹ.',
      ex: [
        { j: 'ありがとう|ございます。', r: 'arigatou|gozaimasu', v: 'Cảm ơn ạ (lịch sự).', k: 'ありがとうございます。' },
        { j: 'ありがとう。', r: 'arigatou', v: 'Cảm ơn nha (với bạn bè, người nhà).', k: 'ありがとう。' },
        { j: 'どう |いたしまして。', r: 'dou|itashimashite', v: 'Không có gì (câu đáp lời cảm ơn đầy đủ).', k: 'どういたしまして。' },
        { j: 'いいえ。', r: 'iie', v: 'Dạ không đâu ạ (đáp lời cảm ơn, nhẹ nhàng).', k: 'いいえ。' },
        { j: 'すみません。', r: 'sumimasen', v: 'Xin lỗi ạ / Làm phiền ạ (dùng cả khi gọi người, khi cảm ơn).', k: 'すみません。' },
        { j: 'ごめんなさい。', r: 'gomennasai', v: 'Xin lỗi nha (với bạn bè, người nhà).', k: 'ごめんなさい。' },
        { j: 'だいじょうぶ|です。', r: 'daijoubu|desu', v: 'Không sao đâu ạ.', k: '大丈夫です。' },
        { j: 'しつれい|します。', r: 'shitsurei|shimasu', v: 'Xin phép ạ (khi vào / ra phòng, khi cúp máy).', k: '失礼します。' },
        { j: 'どうも |ありがとう|ございます。', r: 'doumo|arigatou|gozaimasu', v: 'Cảm ơn rất nhiều ạ.', k: 'どうもありがとうございます。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['なさい。', 'します。'], why: 'Cảm ơn lịch sự: <span class="jp">ありがとう</span> + <b class="jp">ございます</b>.' },
        { ex: 2, tok: 0, wrong: ['どうも', 'そう'], why: 'Đáp lời cảm ơn: <b class="jp">どう</b>いたしまして. (<span class="jp">どうも</span> là "cảm ơn nhiều" — dùng khi chính mình cảm ơn.)' },
        { ex: 7, tok: 1, wrong: ['ございます。', 'なさい。'], why: '<span class="jp">しつれい</span> (thất lễ) + <b class="jp">します</b> (làm) → "xin phép làm phiền".' },
      ],
      talk: [
        { q: 'あの、おとしましたよ。', qr: 'ano, otoshimashita yo.', qv: 'Bạn đánh rơi khăn tay, một người lạ nhặt lên đưa bạn: "Bạn đánh rơi này."', a: 0, wrong: [5, 2] },
        { q: 'ありがとうございます。', qr: 'arigatou gozaimasu.', qv: 'Bạn vừa chỉ đường cho một người, họ cảm ơn bạn.', a: ['いいえ、どう いたしまして。', 'iie, dou itashimashite.', 'Dạ, không có gì ạ.'], wrong: [['ありがとう。', 'arigatou.'], 7] },
        { q: 'あっ、すみません！', qr: 'a, sumimasen!', qv: 'Trên tàu đông, một người vô ý giẫm nhẹ lên chân bạn: "Ôi, xin lỗi!"', a: 6, wrong: [0, 5] },
        { sit: 'Ở nhà, bạn lỡ tay làm đổ trà lên áo em gái. Bạn nói:', a: 5, wrong: [7, 2] },
      ],
    },
    g18: {
      title: 'Câu cửa miệng trong nhà', jp: 'ただいま', icon: 'house', kind: 'phrase',
      goal: 'Nói những câu cả nhà dùng mỗi ngày: đi, về, ăn cơm, đi ngủ',
      points: [
        'Đây là những câu cố định cả nhà nói với nhau mỗi ngày — cứ học thuộc cả câu.',
        'Ra khỏi nhà: người <b>đi</b> nói <b class="jp">いってきます</b> (tôi đi rồi sẽ về), người ở nhà đáp <b class="jp">いってらっしゃい</b> (đi rồi về nhé).',
        'Về đến nhà: người về nói <b class="jp">ただいま</b> (tôi về rồi đây), người ở nhà đáp <b class="jp">おかえりなさい</b> — thân mật hơn chỉ cần <span class="jp">おかえり</span>.',
        'Trước khi ăn: <b class="jp">いただきます</b> (xin nhận bữa ăn). Ăn xong: <b class="jp">ごちそうさまでした</b> — có <span class="jp">でした</span> vì bữa ăn đã xong.',
        'Mẹ gọi cả nhà vào ăn: <b class="jp">ごはんですよ</b>. Trước khi đi ngủ: <b class="jp">おやすみなさい</b>.',
      ],
      tip: 'Người Nhật nói các câu này cả ở ký túc xá và ở công ty: ra ngoài làm việc cũng nói <span class="jp">いってきます</span>, đồng nghiệp đáp <span class="jp">いってらっしゃい</span>. Ở homestay, nhớ nói <b class="jp">ただいま</b> mỗi lần về — gia đình chủ nhà sẽ thấy bạn rất lễ phép.',
      ex: [
        { j: 'いって|きます。', r: 'itte|kimasu', v: 'Con đi đây! (người ra khỏi nhà nói)', k: '行ってきます。' },
        { j: 'いってらっしゃい。', r: 'itterasshai', v: 'Đi nhé! (người ở nhà đáp)', k: '行ってらっしゃい。' },
        { j: 'ただいま。', r: 'tadaima', v: 'Con về rồi đây! (người vừa về nhà nói)', k: 'ただいま。' },
        { j: 'おかえり|なさい。', r: 'okaeri|nasai', v: '(Con) về rồi à! (người ở nhà đáp)', k: 'お帰りなさい。' },
        { j: 'いただきます。', r: 'itadakimasu', v: 'Xin phép ăn ạ (nói trước khi ăn).', k: 'いただきます。' },
        { j: 'ごちそうさま|でした。', r: 'gochisousama|deshita', v: 'Cảm ơn vì bữa ăn (nói khi ăn xong).', k: 'ごちそうさまでした。' },
        { j: 'ごはん|ですよ。', r: 'gohan|desu yo', v: 'Cơm xong rồi, vào ăn thôi! (gọi cả nhà)', k: 'ご飯ですよ。' },
        { j: 'おやすみ|なさい。', r: 'oyasumi|nasai', v: 'Chúc cả nhà ngủ ngon (trước khi đi ngủ).', k: 'おやすみなさい。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['らっしゃい。', 'ください。'], why: 'Người <b>đi</b> nói <b class="jp">いってきます</b>; <span class="jp">いってらっしゃい</span> là câu người ở nhà đáp lại.' },
        { ex: 3, tok: 0, wrong: ['ただいま', 'おやすみ'], why: 'Người ở nhà đón người về: <b class="jp">おかえり</b>なさい. <span class="jp">ただいま</span> là câu của người vừa về.' },
        { ex: 5, tok: 1, wrong: ['ます。', 'ください。'], why: 'Ăn xong mới nói, nên đuôi là <b class="jp">でした</b> (đã xong): ごちそうさまでした.' },
      ],
      talk: [
        { sit: 'Sáng ra, bạn xỏ giày ở cửa, chuẩn bị đi học. Bạn nói với cả nhà:', a: 0, wrong: [1, 2] },
        { q: 'いってきます！', qr: 'itte kimasu!', qv: 'Em gái khoác cặp ra cửa: "Em đi học đây!"', a: 1, wrong: [0, 3] },
        { sit: 'Đi học về, bạn mở cửa bước vào nhà và nói:', a: 2, wrong: [3, ['こんばんは。', 'konbanwa.']] },
        { sit: 'Ăn xong bữa tối mẹ nấu, bạn đặt đũa xuống, chắp tay nói:', a: 5, wrong: [4, 7] },
      ],
    },
    g19: {
      title: 'Đáp lời khi nghe', jp: 'あいづち', icon: 'headphones', kind: 'phrase',
      goal: 'Đáp lời khi nghe để người Nhật biết bạn đang nghe và hiểu',
      points: [
        'Người Nhật vừa nghe vừa đáp lời liên tục (<span class="jp">あいづち</span>) để báo "mình đang nghe đây". Im lặng lâu quá, người nói sẽ lo là bạn không hiểu.',
        '<b class="jp">はい</b> / <b class="jp">ええ</b> = vâng, dạ, ừ (<span class="jp">ええ</span> mềm hơn). <b class="jp">そうですか</b> = ồ, vậy à — nói <b>xuống giọng</b> ↘, không phải câu hỏi. <b class="jp">そうですね</b> = đúng vậy nhỉ (đồng tình với điều cả hai cùng biết, cùng thấy).',
        '<b class="jp">なるほど</b> = à, ra vậy (vừa hiểu ra). <b class="jp">ほんとうですか</b> = thật vậy sao? — <b>lên giọng</b> ↗ khi ngạc nhiên.',
        '<b class="jp">わかりました</b> = tôi hiểu rồi / vâng ạ (nhận lời) — câu cố định, cứ học thuộc. <b class="jp">わかりません</b> = tôi không hiểu. <b class="jp">ええと…</b> = ừm… (đang nghĩ, chờ chút).',
      ],
      tip: '<span class="jp">なるほど</span> nghe hơi "bề trên" nếu nói với thầy cô, cấp trên — khi đó <b class="jp">そうですか</b> an toàn hơn. Còn <span class="jp">はい</span> lúc nghe chỉ có nghĩa "tôi đang nghe", chưa chắc là "tôi đồng ý" đâu.',
      ex: [
        { j: 'はい。', r: 'hai', v: 'Vâng / Dạ (tôi đang nghe).', k: 'はい。' },
        { j: 'ええ。', r: 'ee', v: 'Ừ / Vâng (mềm hơn はい).', k: 'ええ。' },
        { j: 'そう|ですか。', r: 'sou|desu ka.', v: 'Ồ, vậy à. (vừa biết thêm điều mới)', k: 'そうですか。' },
        { j: 'そう|ですね。', r: 'sou|desu ne', v: 'Đúng vậy nhỉ (đồng tình).', k: 'そうですね。' },
        { j: 'なるほど。', r: 'naruhodo', v: 'À, ra vậy! (vừa hiểu ra)', k: 'なるほど。' },
        { j: 'ほんとう|ですか。', r: 'hontou|desu ka', v: 'Thật vậy sao? (ngạc nhiên)', k: '本当ですか。' },
        { j: 'わかりました。', r: 'wakarimashita', v: 'Tôi hiểu rồi / Vâng, được ạ.', k: '分かりました。' },
        { j: 'ええと…', r: 'eeto', v: 'Ừm… (đang nghĩ)', k: 'ええと…' },
        { j: 'すみません、|わかりません。', r: 'sumimasen,|wakarimasen', v: 'Xin lỗi, tôi không hiểu.', k: 'すみません、分かりません。' },
      ],
      fill: [
        { ex: 3, tok: 1, wrong: ['ですか。', 'ます。'], why: 'Đồng tình → <b class="jp">そうですね</b>. (<span class="jp">そうですか</span> chỉ là "ồ, vậy à" — vừa nghe điều mới.)' },
        { ex: 5, tok: 1, wrong: ['です。', 'ですね。'], why: 'Ngạc nhiên, hỏi lại "thật sao?" → thêm か: <b class="jp">ほんとうですか</b> ↗.' },
        { ex: 8, tok: 1, wrong: ['わかります。', 'わかりました。'], why: '<b class="jp">ません</b> = không: わかります (hiểu) → <b class="jp">わかりません</b> (không hiểu).' },
      ],
      talk: [
        { q: 'あした、やすみですよ。', qr: 'ashita, yasumi desu yo.', qv: 'Bạn cùng lớp báo: "Mai được nghỉ học đấy!" — bạn hoàn toàn chưa biết tin này.', a: 5, wrong: [3, 7] },
        { q: 'あしたは くじに きて ください。', qr: 'ashita wa kuji ni kite kudasai.', qv: 'Thầy giáo dặn: "Ngày mai 9 giờ đến nhé."', a: 6, wrong: [5, 3] },
        { q: 'きょうは さむいですね。', qr: 'kyou wa samui desu ne.', qv: 'Sáng sớm gặp bác hàng xóm, bác nói: "Hôm nay lạnh nhỉ."', a: 3, wrong: [2, 6] },
        { q: 'えきまで あるいて じゅっぷんぐらいですけど、バスも ありますよ。', qr: 'eki made aruite juppun gurai desu kedo, basu mo arimasu yo.', qv: 'Bạn hỏi đường, người Nhật nói một tràng thật nhanh ("Đi bộ ra ga chừng 10 phút, nhưng cũng có xe buýt đấy") — bạn không hiểu gì cả.', a: 8, wrong: [6, 4] },
      ],
    },

    // ---------------- Chặng 2: Giới thiệu ----------------
    g20: {
      title: 'Cũng vậy', jp: 'わたしも', icon: 'happy',
      goal: 'Nói "tôi cũng vậy" với も, phân biệt も và は',
      pattern: { parts: [['A', 'n'], ['も', 'p', 'mo'], ['B', 'n'], ['です', 'e', 'desu']], mean: 'A cũng là B' },
      points: [
        '<b class="jp">も</b> (mo) = cũng. Đặt <span class="jp">も</span> vào <b>đúng chỗ của <span class="jp">は</span></b>: <span class="jp">わたしは がくせいです</span> → <span class="jp">わたしも がくせいです</span> (tôi cũng là học sinh).',
        'Không dùng <span class="jp">は</span> và <span class="jp">も</span> cùng lúc: nói <b class="jp">わたしも</b>, không nói <span class="jp">わたしはも</span>.',
        'Hỏi "… cũng là … à?": <b class="jp">〜さんも ベトナムじんですか</b>. Nếu mình <b>không giống</b> thì trả lời bằng <b class="jp">は</b>: <span class="jp">いいえ、わたしは にほんじんです</span>.',
        '<span class="jp">も</span> dùng được cả với câu phủ định: <span class="jp">わたしも せんせいじゃありません</span> (tôi cũng không phải giáo viên).',
      ],
      tip: 'Nghe ai nói điều giống mình, người Nhật hay reo lên <b class="jp">あ、わたしも！</b> (A, mình cũng vậy!). Nói với người lớn hơn thì thêm です: <span class="jp">わたしもです</span>.',
      ex: [
        { j: 'わたし|も |がくせい|です。', r: 'watashi|mo|gakusei|desu', v: 'Tôi cũng là học sinh.', k: '私も学生です。' },
        { j: 'わたし|も|です。', r: 'watashi|mo|desu', v: 'Tôi cũng vậy.', k: '私もです。' },
        { j: 'たなか|さん|も |せんせい|です。', r: 'Tanaka|-san|mo|sensei|desu', v: 'Anh / chị Tanaka cũng là giáo viên.', k: '田中さんも先生です。' },
        { j: 'ミン|さん|も |ベトナムじん|ですか。', r: 'Min|-san|mo|betonamujin|desu ka', v: 'Anh Minh cũng là người Việt Nam à?', k: 'ミンさんもベトナム人ですか。' },
        { j: 'はい、|わたし|も |ベトナムじん|です。', r: 'hai,|watashi|mo|betonamujin|desu', v: 'Vâng, tôi cũng là người Việt Nam.', k: 'はい、私もベトナム人です。' },
        { j: 'いいえ、|わたし|は |にほんじん|です。', r: 'iie,|watashi|wa|nihonjin|desu', v: 'Không, tôi là người Nhật.', k: 'いいえ、私は日本人です。' },
        { j: 'やまだ|さん|も |かいしゃいん|ですか。', r: 'Yamada|-san|mo|kaishain|desu ka', v: 'Anh / chị Yamada cũng là nhân viên công ty à?', k: '山田さんも会社員ですか。' },
        { j: 'わたし|も |せんせい|じゃありません。', r: 'watashi|mo|sensei|ja arimasen', v: 'Tôi cũng không phải là giáo viên.', k: '私も先生じゃありません。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['は', 'を'], why: 'Tôi <b>cũng</b> là học sinh → <b class="jp">も</b> (mo), đặt vào chỗ của は.' },
        { ex: 1, tok: 1, wrong: ['は', 'を'], why: '"Tôi cũng vậy" → <b class="jp">わたしもです</b>.' },
        { ex: 3, tok: 2, wrong: ['は', 'を'], why: 'Hỏi "anh Minh <b>cũng</b> là… à?" → <b class="jp">も</b>.' },
        { ex: 5, tok: 2, wrong: ['も', 'を'], why: 'Mình <b>không giống</b> người kia (mình là người Nhật) → không dùng も mà dùng <b class="jp">は</b>.' },
      ],
      talk: [
        { q: 'わたしは がくせいです。', qr: 'watashi wa gakusei desu.', qv: 'Bạn mới quen nói: "Mình là sinh viên." — bạn cũng là sinh viên.', a: 0, wrong: [['わたしは がくせいですか。', 'watashi wa gakusei desu ka?'], ['わたしも がくせいじゃありません。', 'watashi mo gakusei ja arimasen.']] },
        { q: 'リンさんも ベトナムじんですか。', qr: 'Rin-san mo betonamujin desu ka?', qv: 'Bạn Nhật vừa biết Minh là người Việt, quay sang hỏi bạn: "Linh cũng là người Việt Nam à?"', a: 4, wrong: [['はい、リンさんも ベトナムじんです。', 'hai, Rin-san mo betonamujin desu.'], ['はい、わたしも にほんじんです。', 'hai, watashi mo nihonjin desu.']] },
        { q: 'リンさんも にほんじんですか。', qr: 'Rin-san mo nihonjin desu ka?', qv: 'Một người Nhật hỏi: "Linh cũng là người Nhật à?" — bạn là người Việt Nam.', a: ['いいえ、わたしは ベトナムじんです。', 'iie, watashi wa betonamujin desu.', 'Không, mình là người Việt Nam.'], wrong: [['いいえ、わたしも ベトナムじんです。', 'iie, watashi mo betonamujin desu.'], ['はい、わたしも にほんじんです。', 'hai, watashi mo nihonjin desu.']] },
        { sit: 'Minh nói: "Mình không phải giáo viên." Bạn cũng không phải giáo viên, bạn nói:', a: 7, wrong: [['わたしは せんせいです。', 'watashi wa sensei desu.'], ['わたしも せんせいです。', 'watashi mo sensei desu.']] },
      ],
    },
    g21: {
      title: 'Quê ở đâu, làm nghề gì', jp: 'どこから？', icon: 'globe',
      goal: 'Hỏi và nói mình từ đâu đến, làm nghề gì, học ngành gì',
      pattern: { parts: [['Nơi', 'n'], ['から', 'p', 'kara'], ['きました', 'e', 'kimashita']], mean: 'Tôi đến từ … (câu cố định)' },
      points: [
        '<b class="jp">どこから きましたか</b> = bạn từ đâu đến? Đáp: <b class="jp">ベトナムから きました</b> (tôi đến từ Việt Nam). <span class="jp">どこ</span> = đâu, <span class="jp">から</span> = từ.',
        '<span class="jp">きました</span> là dạng "đã đến" — bài sau mới học kỹ, giờ cứ học thuộc cả câu như câu cố định.',
        'Hỏi nghề: <b class="jp">おしごとは なんですか</b> (<span class="jp">なん</span> = gì). Đáp gọn: <span class="jp">かいしゃいんです</span>, <span class="jp">だいがくせいです</span>… Với sinh viên, người ta hay hỏi tiếp <b class="jp">せんこうは なんですか</b> (học ngành gì?).',
        'Lịch sự hơn: <b class="jp">おくには どちらですか</b> (bạn đến từ nước nào ạ?) — <span class="jp">どちら</span> là cách nói lịch sự của <span class="jp">どこ</span>.',
      ],
      tip: 'Người Nhật ít khi hỏi tuổi người mới gặp — hỏi vậy dễ bị coi là tò mò, nhất là với phụ nữ. Họ thường hỏi quê và công việc trước: <span class="jp">どこから きましたか</span>, <span class="jp">おしごとは？</span>',
      ex: [
        { j: 'どこ|から |きましたか。', r: 'doko|kara|kimashita ka', v: 'Bạn từ đâu đến?', k: 'どこから来ましたか。' },
        { j: 'ベトナム|から |きました。', r: 'betonamu|kara|kimashita', v: 'Tôi đến từ Việt Nam.', k: 'ベトナムから来ました。' },
        { j: 'ハノイ|から |きました。', r: 'Hanoi|kara|kimashita', v: 'Tôi đến từ Hà Nội.', k: 'ハノイから来ました。' },
        { j: 'おくに|は |どちら|ですか。', r: 'okuni|wa|dochira|desu ka', v: 'Bạn đến từ nước nào ạ? (lịch sự)', k: 'お国はどちらですか。' },
        { j: 'おしごと|は |なん|ですか。', r: 'oshigoto|wa|nan|desu ka', v: 'Bạn làm nghề gì?', k: 'お仕事は何ですか。' },
        { j: 'かいしゃいん|です。', r: 'kaishain|desu', v: '(Tôi) là nhân viên công ty.', k: '会社員です。' },
        { j: 'だいがくせい|です。', r: 'daigakusei|desu', v: '(Tôi) là sinh viên đại học.', k: '大学生です。' },
        { j: 'せんこう|は |なん|ですか。', r: 'senkou|wa|nan|desu ka', v: 'Bạn học chuyên ngành gì?', k: '専攻は何ですか。' },
        { j: 'せんこう|は |にほんご|です。', r: 'senkou|wa|nihongo|desu', v: 'Chuyên ngành của tôi là tiếng Nhật.', k: '専攻は日本語です。' },
      ],
      fill: [
        { ex: 0, tok: 0, wrong: ['なん', 'だれ'], why: 'Hỏi nơi chốn → <b class="jp">どこ</b> (đâu).' },
        { ex: 1, tok: 1, wrong: ['に', 'は'], why: 'Đến <b>từ</b> đâu → <b class="jp">から</b> (kara). Nói <span class="jp">ベトナムに きました</span> lại thành "đã đến Việt Nam".' },
        { ex: 4, tok: 2, wrong: ['どこ', 'だれ'], why: 'Hỏi "nghề <b>gì</b>" → <b class="jp">なん</b>.' },
      ],
      talk: [
        { q: 'どこから きましたか。', qr: 'doko kara kimashita ka?', qv: 'Ở buổi giao lưu, một người Nhật hỏi: "Bạn từ đâu đến?"', a: 1, wrong: [['ベトナムに きました。', 'betonamu ni kimashita.'], ['ベトナムじんから きました。', 'betonamujin kara kimashita.']] },
        { q: 'おしごとは なんですか。', qr: 'oshigoto wa nan desu ka?', qv: 'Hàng xóm mới hỏi: "Bạn làm nghề gì?" — bạn là nhân viên công ty.', a: 5, wrong: [['かいしゃです。', 'kaisha desu.'], ['はい、かいしゃいんです。', 'hai, kaishain desu.']] },
        { q: 'せんこうは なんですか。', qr: 'senkou wa nan desu ka?', qv: 'Bạn Nhật cùng trường hỏi: "Bạn học ngành gì?" — bạn học tiếng Nhật.', a: 8, wrong: [['せんこうは だいがくせいです。', 'senkou wa daigakusei desu.'], ['せんこうは にほんじんです。', 'senkou wa nihonjin desu.']] },
        { q: 'おくには どちらですか。', qr: 'okuni wa dochira desu ka?', qv: 'Một bác lớn tuổi hỏi lịch sự: "Cháu từ nước nào đến vậy?"', a: ['ベトナムです。', 'betonamu desu.', 'Dạ, Việt Nam ạ.'], wrong: [['はい、ベトナムです。', 'hai, betonamu desu.'], ['ベトナムに きました。', 'betonamu ni kimashita.']] },
      ],
    },

    // ---------------- Chặng 3: Đồ vật ----------------
    g22: {
      title: 'Cái … này', jp: 'この・その・あの', icon: 'bag',
      goal: 'Chỉ đồ vật, người cụ thể với この / その / あの + danh từ',
      pattern: { parts: [['この / その / あの', 't', 'kono / sono / ano'], ['Danh từ', 'n'], ['は', 'p', 'wa'], ['B', 'n'], ['です', 'e', 'desu']], mean: '(Danh từ) này / đó / kia là B' },
      points: [
        '<b class="jp">この</b> + danh từ = … này · <b class="jp">その</b> + danh từ = … đó · <b class="jp">あの</b> + danh từ = … kia. Gần ai thì chọn giống như <span class="jp">これ / それ / あれ</span>.',
        '<span class="jp">これ / それ / あれ</span> <b>đứng một mình</b>: <span class="jp">これは かさです</span>. Còn <span class="jp">この / その / あの</span> <b>luôn có danh từ đi sau</b>: <span class="jp">この かさは わたしのです</span>. Không nói <span class="jp">このは…</span> hay <span class="jp">これ かさ</span>.',
        'Hỏi về người: <b class="jp">あの ひとは だれですか</b> (người kia là ai?). Lịch sự hơn: <b class="jp">あの かたは どなたですか</b> — <span class="jp">かた</span> = vị, <span class="jp">どなた</span> = ai (kính trọng). Đừng gọi người là <span class="jp">あれ</span> — nghe như nói về đồ vật.',
        'Ghép với <span class="jp">の</span> đã học: <span class="jp">その ほんは だれのですか</span> = quyển sách đó của ai?',
      ],
      tip: 'Người Nhật thấy chỉ ngón tay thẳng vào người khác là bất lịch sự. Muốn hỏi về ai, họ nói nhỏ <b class="jp">あの かたは どなたですか</b> và chỉ khẽ bằng cả bàn tay.',
      ex: [
        { j: 'この |かさ|は |わたし|の|です。', r: 'kono|kasa|wa|watashi|no|desu', v: 'Cái ô này là của tôi.', k: 'この傘は私のです。' },
        { j: 'その |ほん|は |だれ|の|ですか。', r: 'sono|hon|wa|dare|no|desu ka', v: 'Quyển sách đó là của ai?', k: 'その本は誰のですか。' },
        { j: 'あの |ひと|は |だれ|ですか。', r: 'ano|hito|wa|dare|desu ka', v: 'Người kia là ai?', k: 'あの人は誰ですか。' },
        { j: 'あの |ひと|は |せんせい|です。', r: 'ano|hito|wa|sensei|desu', v: 'Người kia là giáo viên.', k: 'あの人は先生です。' },
        { j: 'この |ひと|は |たなか|さん|です。', r: 'kono|hito|wa|Tanaka|-san|desu', v: 'Người này là anh / chị Tanaka (chỉ vào ảnh).', k: 'この人は田中さんです。' },
        { j: 'あの |かた|は |どなた|ですか。', r: 'ano|kata|wa|donata|desu ka', v: 'Vị kia là ai vậy ạ? (lịch sự)', k: 'あの方はどなたですか。' },
        { j: 'あの |かた|は |やまだ|せんせい|です。', r: 'ano|kata|wa|Yamada|sensei|desu', v: 'Vị kia là thầy / cô Yamada.', k: 'あの方は山田先生です。' },
        { j: 'この |おちゃ|は |にほん|の|です。', r: 'kono|ocha|wa|nihon|no|desu', v: 'Trà này là trà Nhật.', k: 'このお茶は日本のです。' },
      ],
      fill: [
        { ex: 0, tok: 0, wrong: ['これ', 'それ'], why: 'Sau có danh từ <span class="jp">かさ</span> → <b class="jp">この</b>. (<span class="jp">これ / それ</span> không đứng trước danh từ.)' },
        { ex: 1, tok: 4, wrong: ['は', 'を'], why: '"Của ai" → だれ + <b class="jp">の</b>.' },
        { ex: 2, tok: 0, wrong: ['あれ', 'この'], why: 'Người ở xa, có danh từ <span class="jp">ひと</span> đi sau → <b class="jp">あの</b> ひと.' },
        { ex: 5, tok: 3, wrong: ['なん', 'どこ'], why: 'Hỏi "ai" một cách lịch sự → <b class="jp">どなた</b> (kính trọng hơn だれ).' },
      ],
      talk: [
        { q: 'その かさは だれのですか。', qr: 'sono kasa wa dare no desu ka?', qv: 'Bạn đang cầm một cái ô, thầy giáo hỏi: "Cái ô đó của ai?"', a: 0, wrong: [['その かさは わたしのです。', 'sono kasa wa watashi no desu.'], ['これ かさは わたしのです。', 'kore kasa wa watashi no desu.']] },
        { q: 'あの ひとは だれですか。', qr: 'ano hito wa dare desu ka?', qv: 'Bạn Nhật nhìn về phía một người đứng xa: "Người kia là ai thế?" — đó là thầy giáo của bạn.', a: 3, wrong: [['あれは せんせいです。', 'are wa sensei desu.'], ['この ひとは せんせいです。', 'kono hito wa sensei desu.']] },
        { sit: 'Ở buổi tiệc, bạn muốn hỏi lịch sự về một vị khách lớn tuổi đứng ở đằng xa:', a: 5, wrong: [['あれは だれですか。', 'are wa dare desu ka?'], ['あの かたは なんですか。', 'ano kata wa nan desu ka?']] },
        { sit: 'Bạn cùng lớp đang cầm một quyển sách lạ. Bạn hỏi quyển sách đó của ai:', a: 1, wrong: [['それ ほんは だれのですか。', 'sore hon wa dare no desu ka?'], ['その ほんは だれですか。', 'sono hon wa dare desu ka?']] },
      ],
    },
    g23: {
      title: 'Tiếng Nhật gọi là gì?', jp: 'にほんごで？', icon: 'question',
      goal: 'Hỏi tiếng Nhật gọi là gì — câu cứu cánh của người mới học',
      pattern: { parts: [['Vật / 「từ」', 'n'], ['は', 'p', 'wa'], ['にほんごで', 't', 'nihongo de'], ['なん', 'q', 'nan'], ['ですか', 'e', 'desu ka']], mean: '… tiếng Nhật gọi là gì?' },
      points: [
        '<b class="jp">で</b> ở đây = "bằng (tiếng…)": <span class="jp">にほんごで</span> = bằng tiếng Nhật, <span class="jp">ベトナムごで</span> = bằng tiếng Việt, <span class="jp">えいごで</span> = bằng tiếng Anh.',
        'Chỉ vào đồ vật: <b class="jp">これは にほんごで なんですか</b>. Hỏi một từ: <b class="jp">「…」は にほんごで なんですか</b>. Đáp: <span class="jp">「かさ」です</span>.',
        'Người Nhật hỏi ngược lại: <span class="jp">「こんにちは」は ベトナムごで なんですか</span> → bạn đáp <b class="jp">ベトナムごで「シンチャオ」です</b>.',
        'Bí quá thì hỏi: <b class="jp">えいごで いいですか</b> (nói tiếng Anh được không?) — <span class="jp">いいですか</span> = được không, cứ học thuộc.',
      ],
      tip: 'Người Nhật thường rất vui khi người nước ngoài hỏi <span class="jp">にほんごで なんですか</span>, và sẽ nói chậm, rõ để bạn nhắc theo. Nghe xong, nhắc lại một lần (<span class="jp">「かさ」ですね</span>) để chắc mình nghe đúng.',
      ex: [
        { j: 'にほんご|で |なん|ですか。', r: 'nihongo|de|nan|desu ka', v: 'Tiếng Nhật gọi là gì?', k: '日本語で何ですか。' },
        { j: 'これ|は |にほんご|で |なん|ですか。', r: 'kore|wa|nihongo|de|nan|desu ka', v: 'Cái này tiếng Nhật gọi là gì?', k: 'これは日本語で何ですか。' },
        { j: '「かさ」|です。', r: 'kasa|desu', v: 'Gọi là "kasa" (cái ô).', k: '「傘」です。' },
        { j: 'それ|は |「おはし」|です。', r: 'sore|wa|ohashi|desu', v: 'Cái đó gọi là "ohashi" (đôi đũa).', k: 'それは「お箸」です。' },
        { j: 'えいご|で |いい|ですか。', r: 'eigo|de|ii|desu ka', v: 'Nói bằng tiếng Anh được không ạ?', k: '英語でいいですか。' },
        { j: '「アンブレラ」|は |にほんご|で |なん|ですか。', r: 'anburera|wa|nihongo|de|nan|desu ka', v: '"Umbrella" tiếng Nhật là gì?', k: '「アンブレラ」は日本語で何ですか。' },
        { j: '「こんにちは」|は |ベトナムご|で |なん|ですか。', r: 'konnichiwa|wa|betonamugo|de|nan|desu ka', v: '"Konnichiwa" tiếng Việt nói thế nào?', k: '「こんにちは」はベトナム語で何ですか。' },
        { j: 'ベトナムご|で |「シンチャオ」|です。', r: 'betonamugo|de|shinchao|desu', v: 'Tiếng Việt là "Xin chào".', k: 'ベトナム語で「シンチャオ」です。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['の', 'は'], why: '"Bằng" tiếng Nhật → にほんご<b class="jp">で</b>.' },
        { ex: 1, tok: 4, wrong: ['どこ', 'だれ'], why: 'Hỏi "là <b>gì</b>" → <b class="jp">なん</b>.' },
        { ex: 5, tok: 1, wrong: ['で', 'を'], why: 'Từ cần hỏi đứng đầu, sau nó là <b class="jp">は</b>: 「アンブレラ」<b class="jp">は</b> にほんごで….' },
        { ex: 6, tok: 2, wrong: ['えいご', 'にほんご'], why: 'Hỏi tiếng <b>Việt</b> → <b class="jp">ベトナムご</b>で.' },
      ],
      talk: [
        { sit: 'Ở siêu thị, bạn cầm lên một loại rau lạ và hỏi nhân viên tên tiếng Nhật của nó:', a: 1, wrong: [['これは にほんごですか。', 'kore wa nihongo desu ka?'], ['これは にほんの なんですか。', 'kore wa nihon no nan desu ka?']] },
        { q: 'これは にほんごで なんですか。', qr: 'kore wa nihongo de nan desu ka?', qv: 'Cô giáo giơ đôi đũa lên hỏi cả lớp: "Cái này tiếng Nhật gọi là gì?"', a: 3, wrong: [['これは 「おはし」です。', 'kore wa ohashi desu.'], ['にほんごです。', 'nihongo desu.']] },
        { q: '「ありがとう」は ベトナムごで なんですか。', qr: 'arigatou wa betonamugo de nan desu ka?', qv: 'Bạn Nhật tò mò hỏi: "Arigatou" tiếng Việt nói thế nào?', a: ['ベトナムごで 「カムオン」です。', 'betonamugo de kamuon desu.', 'Tiếng Việt là "Cảm ơn".'], wrong: [['にほんごで 「ありがとう」です。', 'nihongo de arigatou desu.'], ['ベトナムごの 「カムオン」です。', 'betonamugo no kamuon desu.']] },
        { sit: 'Đang hỏi đường mà quên sạch từ tiếng Nhật, bạn muốn xin nói bằng tiếng Anh:', a: 4, wrong: [['えいごは いいですか。', 'eigo wa ii desu ka?'], ['えいごの いいですか。', 'eigo no ii desu ka?']] },
      ],
    },
  });

  // ---------- câu thêm cho bài gốc trong data-talk.js (nối sau câu cũ) ----------
  Object.assign(SJ.TALK_X, {
    // g1 có 6 câu (0–5) → câu mới 6–8
    g1: {
      ex: [
        { j: 'おはよう。', r: 'ohayou', v: 'Chào buổi sáng (thân mật, với bạn bè, người nhà).', k: 'おはよう。' },
        { j: 'せんせい、|さようなら。', r: 'sensei,|sayounara', v: 'Tạm biệt thầy / cô ạ (lúc tan học).', k: '先生、さようなら。' },
        { j: 'じゃあ、|また |あした。', r: 'jaa,|mata|ashita', v: 'Thôi, mai gặp lại nhé! (thân mật)', k: 'じゃあ、また明日。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['なさい。', 'ください。'], why: 'Lịch sự thì thêm <b class="jp">ございます</b>: おはようございます. (<span class="jp">なさい</span> là đuôi của おやすみなさい.)' },
        { ex: 8, tok: 1, wrong: ['まだ', 'もう'], why: '<b class="jp">また</b> (mata) = lại, lần nữa → "mai gặp lại". Đừng nhầm với <span class="jp">まだ</span> (mada = chưa).' },
      ],
      talk: [
        { q: 'おはよう！', qr: 'ohayou!', qv: 'Sáng ra gặp bạn thân ở cổng trường, bạn ấy chào: "Chào buổi sáng!"', a: 6, wrong: [2, 5] },
        { sit: 'Hết giờ học, bạn cúi chào cô giáo rồi ra về:', a: 7, wrong: [1, 5] },
        { q: 'じゃあね！', qr: 'jaa ne!', qv: 'Tan học, bạn thân vẫy tay: "Về nhé!" — mai hai bạn lại gặp nhau.', a: 8, wrong: [7, 1] },
      ],
    },
    // g2 có 6 câu (0–5) → câu mới 6–8
    g2: {
      ex: [
        { j: 'わたし|は |かいしゃいん|です。', r: 'watashi|wa|kaishain|desu', v: 'Tôi là nhân viên công ty.', k: '私は会社員です。' },
        { j: 'やまだ|さん|は |にほんじん|です。', r: 'Yamada|-san|wa|nihonjin|desu', v: 'Anh / chị Yamada là người Nhật.', k: '山田さんは日本人です。' },
        { j: 'こちら|は |たなか|さん|です。', r: 'kochira|wa|Tanaka|-san|desu', v: 'Đây là anh / chị Tanaka (giới thiệu người khác).', k: 'こちらは田中さんです。' },
      ],
      fill: [
        { ex: 8, tok: 1, wrong: ['を', 'に'], why: 'Giới thiệu người khác: <span class="jp">こちら</span> (vị này) + <b class="jp">は</b> + tên + さん + です.' },
      ],
      talk: [
        { sit: 'Bạn giới thiệu chị Tanaka — đồng nghiệp người Nhật — với bạn mình. Bạn đưa tay về phía chị ấy và nói:', a: 8, wrong: [['わたしは たなかさんです。', 'watashi wa Tanaka-san desu.'], ['たなかです。', 'Tanaka desu.']] },
        { q: 'わたしは やまだです。にほんじんです。', qr: 'watashi wa Yamada desu. nihonjin desu.', qv: 'Bạn mới quen: "Tôi là Yamada, người Nhật."', a: ['わたしは リンです。ベトナムじんです。', 'watashi wa Rin desu. betonamujin desu.', 'Mình là Linh, người Việt Nam.'], wrong: [['わたしは リンさんです。', 'watashi wa Rin-san desu.'], ['リンは ベトナムです。', 'Rin wa betonamu desu.']] },
      ],
    },
    // g3 có 5 câu (0–4) → câu mới 5–8
    g3: {
      ex: [
        { j: 'たなか|さん|ですか。', r: 'Tanaka|-san|desu ka', v: 'Có phải anh / chị Tanaka không ạ?', k: '田中さんですか。' },
        { j: 'ベトナムじん|ですか。', r: 'betonamujin|desu ka', v: 'Bạn là người Việt Nam à?', k: 'ベトナム人ですか。' },
        { j: 'はい、|ベトナムじん|です。', r: 'hai,|betonamujin|desu', v: 'Vâng, tôi là người Việt Nam.', k: 'はい、ベトナム人です。' },
        { j: 'やまだ|さん|は |かいしゃいん|ですか。', r: 'Yamada|-san|wa|kaishain|desu ka', v: 'Anh / chị Yamada là nhân viên công ty phải không?', k: '山田さんは会社員ですか。' },
      ],
      fill: [
        { ex: 6, tok: 1, wrong: ['です。', 'ますか。'], why: 'Câu hỏi có / không kết thúc bằng <b class="jp">ですか</b> — không cần đảo chữ.' },
        { ex: 8, tok: 2, wrong: ['を', 'に'], why: '<b class="jp">は</b> (wa) đứng sau người được hỏi tới: やまださん<b class="jp">は</b>….' },
      ],
      talk: [
        { q: 'リンさんですか。', qr: 'Rin-san desu ka?', qv: 'Ở cổng nhà ga, một người Nhật đến đón bạn hỏi: "Có phải chị Linh không ạ?"', a: 2, wrong: [['はい、リンさんです。', 'hai, Rin-san desu.'], ['リンさんですか。', 'Rin-san desu ka?']] },
        { q: 'ベトナムじんですか。', qr: 'betonamujin desu ka?', qv: 'Bạn Nhật mới quen hỏi: "Bạn là người Việt Nam à?"', a: 7, wrong: [['はい、ベトナムですか。', 'hai, betonamu desu ka?'], ['はい、にほんじんです。', 'hai, nihonjin desu.']] },
      ],
    },
    // g4 có 5 câu (0–4) → câu mới 5–7
    g4: {
      ex: [
        { j: 'いいえ、|かいしゃいん|じゃないです。', r: 'iie,|kaishain|ja nai desu', v: 'Không, (tôi) không phải nhân viên công ty.', k: 'いいえ、会社員じゃないです。' },
        { j: 'がくせい|です。', r: 'gakusei|desu', v: '(Tôi) là học sinh / sinh viên.', k: '学生です。' },
        { j: 'ミン|さん|は |にほんじん|じゃないです。', r: 'Min|-san|wa|nihonjin|ja nai desu', v: 'Anh Minh không phải là người Nhật.', k: 'ミンさんは日本人じゃないです。' },
      ],
      fill: [
        { ex: 5, tok: 2, wrong: ['です。', 'ですか。'], why: 'Câu "không phải là" → <b class="jp">じゃないです</b> (= じゃありません).' },
        { ex: 1, tok: 1, wrong: ['そうです。', 'ありません。'], why: '"Không, không phải ạ" → <b class="jp">いいえ、ちがいます</b> (ちがいます = khác, không đúng).' },
      ],
      talk: [
        { q: 'かいしゃいんですか。', qr: 'kaishain desu ka?', qv: 'Bạn mới quen hỏi: "Bạn là nhân viên công ty à?" — bạn là sinh viên.', a: ['いいえ、がくせいです。', 'iie, gakusei desu.', 'Không, mình là sinh viên.'], wrong: [['はい、がくせいです。', 'hai, gakusei desu.'], ['いいえ、かいしゃいんです。', 'iie, kaishain desu.']] },
        { q: 'たなかさんですか。', qr: 'Tanaka-san desu ka?', qv: 'Ở nhà ga, một người lạ nhận nhầm bạn: "Có phải anh Tanaka không ạ?"', a: 1, wrong: [['はい、そうです。', 'hai, sou desu.'], ['いいえ、たなかさんです。', 'iie, Tanaka-san desu.']] },
      ],
    },
    // g5 có 5 câu (0–4) → câu mới 5–7
    g5: {
      ex: [
        { j: 'それ|は |なん|ですか。', r: 'sore|wa|nan|desu ka', v: 'Cái đó là gì?', k: 'それは何ですか。' },
        { j: 'これ|は |ペン|です。', r: 'kore|wa|pen|desu', v: 'Đây là cây bút.', k: 'これはペンです。' },
        { j: 'これ|は |すし|ですか。', r: 'kore|wa|sushi|desu ka', v: 'Đây là sushi à?', k: 'これは寿司ですか。' },
      ],
      fill: [
        { ex: 6, tok: 0, wrong: ['それ', 'あれ'], why: 'Cây bút trong tay mình → <b class="jp">これ</b> (cái này).' },
      ],
      talk: [
        { q: 'それは なんですか。', qr: 'sore wa nan desu ka?', qv: 'Bạn đang cầm một cây bút, bạn Nhật chỉ vào hỏi: "Cái đó là gì?"', a: 6, wrong: [['それは ペンです。', 'sore wa pen desu.'], ['これは なんですか。', 'kore wa nan desu ka?']] },
        { sit: 'Ngồi trên tàu, bạn thấy một ngọn núi rất lớn ở đằng xa và hỏi bạn Nhật ngồi cạnh:', a: 2, wrong: [0, 5] },
      ],
    },
    // g6 có 5 câu (0–4) → câu mới 5–7
    g6: {
      ex: [
        { j: 'それ|は |わたし|の|です。', r: 'sore|wa|watashi|no|desu', v: 'Cái đó là của tôi.', k: 'それは私のです。' },
        { j: 'これ|は |だれ|の|ですか。', r: 'kore|wa|dare|no|desu ka', v: 'Cái này là của ai?', k: 'これは誰のですか。' },
        { j: 'これ|は |にほんご|の |ほん|です。', r: 'kore|wa|nihongo|no|hon|desu', v: 'Đây là sách tiếng Nhật.', k: 'これは日本語の本です。' },
      ],
      fill: [
        { ex: 7, tok: 3, wrong: ['は', 'を'], why: '<b class="jp">の</b> nối "tiếng Nhật" với "sách" → sách tiếng Nhật.' },
      ],
      talk: [
        { q: 'これ、リンさんのですか。', qr: 'kore, Rin-san no desu ka?', qv: 'Bạn cùng lớp nhặt được một cây bút, hỏi: "Cái này của Linh à?" — đúng là bút của bạn.', a: ['はい、わたしのです。', 'hai, watashi no desu.', 'Ừ, của mình.'], wrong: [['はい、リンさんのです。', 'hai, Rin-san no desu.'], ['はい、わたしです。', 'hai, watashi desu.']] },
        { sit: 'Bạn nhặt được một chiếc ví trong lớp, giơ lên hỏi mọi người:', a: 6, wrong: [['これは だれですか。', 'kore wa dare desu ka?'], ['これは わたしのですか。', 'kore wa watashi no desu ka?']] },
      ],
    },
  });
})(window.SJ);
