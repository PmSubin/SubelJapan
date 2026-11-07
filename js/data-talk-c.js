/* SubelJapan — Nói & Ngữ pháp: g32–g39 (từ… đến…, một ngày của tôi, で・と, làm ở đâu, hẹn gặp,
 * tính từ な, どうですか / とても / あまり, quá khứ tính từ) + câu mẫu thêm cho bài gốc g9–g13 (SJ.TALK_X) */
window.SJ = window.SJ || {};
(function (SJ) {
  SJ.TALK_L = SJ.TALK_L || {};
  SJ.TALK_X = SJ.TALK_X || {};
  Object.assign(SJ.TALK_L, {
    // ---------- Chặng 6: Thời gian ----------
    g32: {
      title: 'Từ… đến…', jp: 'から・まで', icon: 'watch',
      goal: 'Hỏi và nói giờ mở cửa, giờ làm việc với 〜から 〜まで',
      pattern: { parts: [['Giờ / ngày', 'n'], ['から', 'p', 'kara'], ['Giờ / ngày', 'n'], ['まで', 'p', 'made'], ['です', 'e', 'desu']], mean: 'Từ … đến …' },
      points: [
        '<b class="jp">から</b> (kara) = từ, <b class="jp">まで</b> (made) = đến. Cả hai đứng <b>sau</b> giờ hoặc ngày: <span class="jp">くじから</span> = từ 9 giờ, <span class="jp">ごじまで</span> = đến 5 giờ.',
        'Hỏi giờ mở cửa: <b class="jp">〜は なんじから なんじまでですか</b>. Đáp: <span class="jp">くじから さんじまでです</span>.',
        'Dùng riêng từng cái cũng được: <span class="jp">ぎんこうは くじからです</span> (mở từ 9 giờ), <span class="jp">しごとは ごじまでです</span> (làm đến 5 giờ).',
        'Với ngày trong tuần cũng y như vậy: <span class="jp">げつようびから きんようびまで</span> = từ thứ Hai đến thứ Sáu.',
      ],
      tip: 'Ở Nhật, quầy giao dịch ngân hàng thường chỉ mở <b>từ 9 giờ đến 3 giờ chiều</b> ngày thường, còn <span class="jp">コンビニ</span> thì mở cả ngày lẫn đêm. Trên cửa tiệm hay ghi giờ kiểu <span class="jp">10:00〜20:00</span> — dấu <b class="jp">〜</b> nghĩa là "từ… đến…".',
      ex: [
        { j: 'ぎんこう|は |くじ|からです。', r: 'ginkou|wa|kuji|kara desu', v: 'Ngân hàng mở cửa từ 9 giờ.', k: '銀行は9時からです。' },
        { j: 'しごと|は |ごじ|までです。', r: 'shigoto|wa|goji|made desu', v: 'Tôi làm việc đến 5 giờ.', k: '仕事は5時までです。' },
        { j: 'しごと|は |なんじ|までですか。', r: 'shigoto|wa|nanji|made desu ka', v: 'Bạn làm việc đến mấy giờ?', k: '仕事は何時までですか。' },
        { j: 'ぎんこう|は |なんじ|から |なんじ|までですか。', r: 'ginkou|wa|nanji|kara|nanji|made desu ka', v: 'Ngân hàng mở cửa từ mấy giờ đến mấy giờ?', k: '銀行は何時から何時までですか。' },
        { j: 'くじ|から |さんじ|までです。', r: 'kuji|kara|sanji|made desu', v: 'Từ 9 giờ đến 3 giờ.', k: '9時から3時までです。' },
        { j: 'ひるやすみ|は |じゅうにじ|から |いちじ|までです。', r: 'hiruyasumi|wa|juuniji|kara|ichiji|made desu', v: 'Giờ nghỉ trưa từ 12 giờ đến 1 giờ.', k: '昼休みは12時から1時までです。' },
        { j: 'がっこう|は |げつようび|から |きんようび|までです。', r: "gakkou|wa|getsuyoubi|kara|kin'youbi|made desu", v: 'Tôi đi học từ thứ Hai đến thứ Sáu.', k: '学校は月曜日から金曜日までです。' },
        { j: 'すみません、|この |みせ|は |なんじ|までですか。', r: 'sumimasen,|kono|mise|wa|nanji|made desu ka', v: 'Xin lỗi, cửa hàng này mở đến mấy giờ ạ?', k: 'すみません、この店は何時までですか。' },
      ],
      fill: [
        { ex: 0, tok: 3, wrong: ['までです。', 'にです。'], why: '"<b>Từ</b> 9 giờ" → <b class="jp">から</b>: <span class="jp">くじからです</span>.' },
        { ex: 1, tok: 3, wrong: ['からです。', 'のです。'], why: '"<b>Đến</b> 5 giờ" → <b class="jp">まで</b>: <span class="jp">ごじまでです</span>.' },
        { ex: 4, tok: 1, wrong: ['まで', 'に'], why: '<b class="jp">から</b> = từ (lúc bắt đầu), <b class="jp">まで</b> = đến (lúc kết thúc).' },
        { ex: 3, tok: 2, wrong: ['いくら', 'どこ'], why: 'Hỏi giờ → <b class="jp">なんじ</b> (mấy giờ).' },
      ],
      talk: [
        { q: 'ぎんこうは なんじから なんじまでですか。', qr: 'ginkou wa nanji kara nanji made desu ka?', qv: 'Ngân hàng mở cửa từ mấy giờ đến mấy giờ?', a: 4, wrong: [['くじまで さんじからです。', 'kuji made sanji kara desu.'], ['はい、ぎんこうです。', 'hai, ginkou desu.']] },
        { q: 'きょう、しごとは なんじまでですか。', qr: 'kyou, shigoto wa nanji made desu ka?', qv: 'Hôm nay bạn làm việc đến mấy giờ?', a: ['ろくじまでです。', 'rokuji made desu.', 'Đến 6 giờ.'], wrong: [['ろくじからです。', 'rokuji kara desu.'], ['げつようびです。', 'getsuyoubi desu.']] },
        { sit: 'Trời sắp tối, bạn muốn hỏi nhân viên cửa hàng này mở đến mấy giờ:', a: 7, wrong: [['すみません、この みせは いくらですか。', 'sumimasen, kono mise wa ikura desu ka?'], ['すみません、この みせは どこですか。', 'sumimasen, kono mise wa doko desu ka?']] },
        { q: 'がっこうは なんようびから なんようびまでですか。', qr: "gakkou wa nan'youbi kara nan'youbi made desu ka?", qv: 'Bạn đi học từ thứ mấy đến thứ mấy?', a: 6, wrong: [['くじから さんじまでです。', 'kuji kara sanji made desu.'], ['きょうは きんようびです。', "kyou wa kin'youbi desu."]] },
      ],
    },

    // ---------- Chặng 7: Một ngày của tôi ----------
    g33: {
      title: 'Một ngày của tôi', jp: 'いちにち', icon: 'alarm',
      goal: 'Kể một ngày của mình: mấy giờ dậy, mấy giờ ngủ, mỗi ngày làm gì',
      pattern: { parts: [['Giờ', 'n'], ['に', 'p', 'ni'], ['Động từ', 'v'], ['ます', 'e', 'masu']], mean: 'Làm gì vào lúc mấy giờ' },
      points: [
        'Giờ cụ thể + <b class="jp">に</b> (ni) = vào lúc: <span class="jp">しちじに おきます</span> = tôi dậy lúc 7 giờ.',
        'Hỏi: <b class="jp">なんじに 〜ますか</b>: <span class="jp">なんじに ねますか</span> = mấy giờ bạn đi ngủ?',
        '<span class="jp">まいにち</span> (mỗi ngày), <span class="jp">まいあさ</span> (mỗi sáng), <span class="jp">まいばん</span> (mỗi tối), <span class="jp">きょう</span>, <span class="jp">あした</span> <b>không</b> thêm に: <span class="jp">まいにち べんきょうします</span>.',
        'Động từ mới: <span class="jp">おきます</span> (thức dậy), <span class="jp">ねます</span> (đi ngủ), <span class="jp">べんきょうします</span> (học), <span class="jp">はたらきます</span> (làm việc).',
        'Ghép với bài trước: <span class="jp">くじから ごじまで はたらきます</span> = làm việc từ 9 giờ đến 5 giờ (có から・まで thì không cần に).',
      ],
      tip: 'Không cần nói giờ thật chính xác, người Nhật hay dùng <b class="jp">〜ごろ</b> (khoảng): <span class="jp">じゅうにじごろ ねます</span> = tầm 12 giờ thì đi ngủ.',
      ex: [
        { j: 'しちじ|に |おきます。', r: 'shichiji|ni|okimasu', v: 'Tôi thức dậy lúc 7 giờ.', k: '7時に起きます。' },
        { j: 'なんじ|に |ねますか。', r: 'nanji|ni|nemasu ka', v: 'Bạn đi ngủ lúc mấy giờ?', k: '何時に寝ますか。' },
        { j: 'じゅういちじ|に |ねます。', r: 'juuichiji|ni|nemasu', v: 'Tôi đi ngủ lúc 11 giờ.', k: '11時に寝ます。' },
        { j: 'まいにち、|にほんご|を |べんきょうします。', r: 'mainichi,|nihongo|o|benkyou shimasu', v: 'Ngày nào tôi cũng học tiếng Nhật.', k: '毎日、日本語を勉強します。' },
        { j: 'まいあさ、|パン|を |たべます。', r: 'maiasa,|pan|o|tabemasu', v: 'Sáng nào tôi cũng ăn bánh mì.', k: '毎朝、パンを食べます。' },
        { j: 'あした、|ろくじ|に |おきます。', r: 'ashita,|rokuji|ni|okimasu', v: 'Ngày mai tôi dậy lúc 6 giờ.', k: '明日、6時に起きます。' },
        { j: 'くじ|から |ごじ|まで |はたらきます。', r: 'kuji|kara|goji|made|hatarakimasu', v: 'Tôi làm việc từ 9 giờ đến 5 giờ.', k: '9時から5時まで働きます。' },
        { j: 'にちようび|は |じゅうじ|に |おきます。', r: 'nichiyoubi|wa|juuji|ni|okimasu', v: 'Chủ nhật thì tôi dậy lúc 10 giờ.', k: '日曜日は10時に起きます。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['で', 'を'], why: 'Giờ cụ thể + <b class="jp">に</b>: <span class="jp">しちじに</span> = vào lúc 7 giờ.' },
        { ex: 3, tok: 0, wrong: ['まいにちに', 'なんじに'], why: '<span class="jp">まいにち</span> (mỗi ngày) <b>không</b> đi với に — chỉ giờ cụ thể mới cần に.' },
        { ex: 6, tok: 3, wrong: ['に', 'から'], why: '"<b>Đến</b> 5 giờ" → <b class="jp">まで</b>: <span class="jp">くじから ごじまで</span>.' },
        { ex: 2, tok: 2, wrong: ['おきます。', 'はたらきます。'], why: '11 giờ đêm thì đi ngủ: <b class="jp">ねます</b>. (<span class="jp">おきます</span> = thức dậy.)' },
      ],
      talk: [
        { q: 'なんじに おきますか。', qr: 'nanji ni okimasu ka?', qv: 'Bạn thức dậy lúc mấy giờ?', a: 0, wrong: [['しちじを おきます。', 'shichiji o okimasu.'], ['しちじに ねます。', 'shichiji ni nemasu.']] },
        { q: 'まいにち にほんごを べんきょうしますか。', qr: 'mainichi nihongo o benkyou shimasu ka?', qv: 'Ngày nào bạn cũng học tiếng Nhật à?', a: ['はい、まいにち べんきょうします。', 'hai, mainichi benkyou shimasu.', 'Vâng, ngày nào mình cũng học.'], wrong: [['はい、まいにちに べんきょうします。', 'hai, mainichi ni benkyou shimasu.'], ['いいえ、べんきょうします。', 'iie, benkyou shimasu.']] },
        { q: 'しごとは なんじから なんじまでですか。', qr: 'shigoto wa nanji kara nanji made desu ka?', qv: 'Bạn làm việc từ mấy giờ đến mấy giờ?', a: 6, wrong: [['くじに ごじに はたらきます。', 'kuji ni goji ni hatarakimasu.'], ['まいにち はたらきます。', 'mainichi hatarakimasu.']] },
        { sit: 'Bạn bè hỏi cuối tuần bạn có ngủ nướng không. Bạn kể Chủ nhật bạn dậy lúc 10 giờ:', a: 7, wrong: [['にちようびは じゅうじに ねます。', 'nichiyoubi wa juuji ni nemasu.'], ['にちようびは じゅうじを おきます。', 'nichiyoubi wa juuji o okimasu.']] },
      ],
    },
    g34: {
      title: 'Đi bằng gì, đi với ai', jp: 'で・と', icon: 'car',
      goal: 'Nói đi bằng phương tiện gì và đi cùng ai với で và と',
      pattern: { parts: [['Người', 'n'], ['と', 'p', 'to'], ['Phương tiện', 'n'], ['で', 'p', 'de'], ['いきます', 'v', 'ikimasu']], mean: 'Đi cùng ai, bằng phương tiện gì' },
      points: [
        '<b class="jp">で</b> (de) sau phương tiện = đi <b>bằng</b>: <span class="jp">でんしゃで</span> (bằng tàu điện), <span class="jp">バスで</span> (bằng xe buýt), <span class="jp">じてんしゃで</span> (bằng xe đạp).',
        'Hỏi: <b class="jp">なにで いきますか</b> = đi bằng gì? Nói <span class="jp">なにで</span> (nani de) cho rõ — <span class="jp">なんで</span> dễ bị hiểu thành "tại sao".',
        '<b class="jp">と</b> (to) sau người = <b>cùng với</b>: <span class="jp">ともだちと いきます</span>. Hỏi: <span class="jp">だれと</span> = với ai?',
        'Đi một mình: <b class="jp">ひとりで</b> (dùng で, không dùng と). Đi bộ: <b class="jp">あるいて いきます</b> — câu cố định, không cần で.',
        '<span class="jp">きました</span> = đã đến (đuôi <span class="jp">ました</span> = đã…, học kỹ ở chặng sau). <span class="jp">なにで きましたか</span> là câu người Nhật hay hỏi khi bạn vừa tới — cứ học thuộc cả câu.',
      ],
      tip: 'Ở Nhật, nhất là Tokyo, rất nhiều người đi làm, đi học bằng <span class="jp">でんしゃ</span> (tàu điện). Trên tàu mọi người giữ yên lặng và hầu như không nghe điện thoại.',
      ex: [
        { j: 'でんしゃ|で |いきます。', r: 'densha|de|ikimasu', v: 'Tôi đi bằng tàu điện.', k: '電車で行きます。' },
        { j: 'ともだち|と |いきます。', r: 'tomodachi|to|ikimasu', v: 'Tôi đi cùng bạn.', k: '友達と行きます。' },
        { j: 'だれ|と |いきますか。', r: 'dare|to|ikimasu ka', v: 'Bạn đi với ai?', k: '誰と行きますか。' },
        { j: 'ひとり|で |いきます。', r: 'hitori|de|ikimasu', v: 'Tôi đi một mình.', k: '一人で行きます。' },
        { j: 'あるいて |いきます。', r: 'aruite|ikimasu', v: 'Tôi đi bộ.', k: '歩いて行きます。' },
        { j: 'なに|で |きましたか。', r: 'nani|de|kimashita ka', v: 'Bạn đến đây bằng gì?', k: '何で来ましたか。' },
        { j: 'バス|で |きました。', r: 'basu|de|kimashita', v: 'Tôi đến bằng xe buýt.', k: 'バスで来ました。' },
        { j: 'まいにち、|じてんしゃ|で |がっこう|に |いきます。', r: 'mainichi,|jitensha|de|gakkou|ni|ikimasu', v: 'Ngày nào tôi cũng đi học bằng xe đạp.', k: '毎日、自転車で学校に行きます。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['に', 'を'], why: 'Đi <b>bằng</b> phương tiện gì → <b class="jp">で</b>.' },
        { ex: 1, tok: 1, wrong: ['で', 'に'], why: 'Đi <b>cùng</b> ai → <b class="jp">と</b>.' },
        { ex: 3, tok: 1, wrong: ['と', 'に'], why: 'Một mình = <b class="jp">ひとりで</b> (không nói ひとりと).' },
        { ex: 7, tok: 4, wrong: ['で', 'を'], why: 'Nơi đến (trường) → <b class="jp">に</b>; phương tiện mới dùng で: <span class="jp">じてんしゃで</span>.' },
      ],
      talk: [
        { q: 'なにで いきますか。', qr: 'nani de ikimasu ka?', qv: 'Bạn đi bằng gì?', a: 0, wrong: [['でんしゃに いきます。', 'densha ni ikimasu.'], 1] },
        { q: 'だれと いきますか。', qr: 'dare to ikimasu ka?', qv: 'Bạn đi với ai?', a: 1, wrong: [['ともだちで いきます。', 'tomodachi de ikimasu.'], 0] },
        { q: 'きょうは なにで きましたか。', qr: 'kyou wa nani de kimashita ka?', qv: 'Hôm nay bạn đến đây bằng gì?', a: 6, wrong: [['バスと きました。', 'basu to kimashita.'], ['バスに きました。', 'basu ni kimashita.']] },
        { sit: 'Nhà bạn ở ngay gần trường. Bạn bè hỏi bạn đi học bằng gì, bạn nói "Mình đi bộ":', a: 4, wrong: [['あるいてで いきます。', 'aruite de ikimasu.'], 3] },
      ],
    },

    // ---------- Chặng 8: Đã làm gì & rủ nhau ----------
    g35: {
      title: 'Làm ở đâu?', jp: 'どこで', icon: 'books',
      goal: 'Nói mình làm gì ở đâu với 〜で, phân biệt に và で',
      pattern: { parts: [['Nơi', 'n'], ['で', 'p', 'de'], ['Việc', 'n'], ['を', 'p', 'o'], ['Động từ', 'v'], ['ます', 'e', 'masu']], mean: 'Làm gì ở đâu' },
      points: [
        '<b class="jp">で</b> (de) sau nơi chốn = <b>ở / tại</b> nơi hành động diễn ra: <span class="jp">としょかんで べんきょうします</span> = học ở thư viện.',
        'Phân biệt: <b class="jp">に</b> = nơi <b>đến</b> — <span class="jp">としょかんに いきます</span> (đi đến thư viện); <b class="jp">で</b> = nơi <b>làm việc gì đó</b> — <span class="jp">としょかんで べんきょうします</span> (học ở thư viện).',
        'Hỏi: <b class="jp">どこで 〜ますか</b> = làm … ở đâu? <span class="jp">どこで たべますか</span> = ăn ở đâu?',
        'Thứ tự quen thuộc: nơi + で → đồ vật + を → động từ: <span class="jp">うちで テレビを みます</span>. Từ mới: <span class="jp">かいます</span> (mua).',
        'Nhớ lại: で còn nghĩa là "bằng" (<span class="jp">バスで</span>). Nhìn từ đứng trước là biết: nơi chốn hay phương tiện.',
      ],
      tip: 'Người Nhật rất hay mang <b class="jp">おべんとう</b> (cơm hộp) từ nhà đi làm, đi học. Sinh viên Nhật cũng thích ngồi học ở <span class="jp">としょかん</span> hoặc <span class="jp">カフェ</span>.',
      ex: [
        { j: 'としょかん|で |べんきょうします。', r: 'toshokan|de|benkyou shimasu', v: 'Tôi học ở thư viện.', k: '図書館で勉強します。' },
        { j: 'うち|で |テレビ|を |みます。', r: 'uchi|de|terebi|o|mimasu', v: 'Tôi xem TV ở nhà.', k: 'うちでテレビを見ます。' },
        { j: 'どこ|で |ひるごはん|を |たべますか。', r: 'doko|de|hirugohan|o|tabemasu ka', v: 'Bạn ăn trưa ở đâu?', k: 'どこで昼ご飯を食べますか。' },
        { j: 'がっこう|で |ひるごはん|を |たべます。', r: 'gakkou|de|hirugohan|o|tabemasu', v: 'Tôi ăn trưa ở trường.', k: '学校で昼ご飯を食べます。' },
        { j: 'カフェ|で |コーヒー|を |のみます。', r: 'kafe|de|koohii|o|nomimasu', v: 'Tôi uống cà phê ở quán cà phê.', k: 'カフェでコーヒーを飲みます。' },
        { j: 'スーパー|で |パン|を |かいます。', r: 'suupaa|de|pan|o|kaimasu', v: 'Tôi mua bánh mì ở siêu thị.', k: 'スーパーでパンを買います。' },
        { j: 'あした、|としょかん|に |いきます。', r: 'ashita,|toshokan|ni|ikimasu', v: 'Ngày mai tôi đi thư viện.', k: '明日、図書館に行きます。' },
        { j: 'まいにち、|うち|で |にほんご|を |べんきょうします。', r: 'mainichi,|uchi|de|nihongo|o|benkyou shimasu', v: 'Ngày nào tôi cũng học tiếng Nhật ở nhà.', k: '毎日、うちで日本語を勉強します。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['に', 'を'], why: 'Nơi <b>diễn ra</b> việc học → <b class="jp">で</b>.' },
        { ex: 6, tok: 2, wrong: ['で', 'を'], why: 'Nơi <b>đến</b> → <b class="jp">に</b>: <span class="jp">としょかんに いきます</span>.' },
        { ex: 2, tok: 1, wrong: ['に', 'と'], why: 'Ăn ở đâu → <b class="jp">どこで</b>. (<span class="jp">どこに</span> dùng khi hỏi đi đâu: <span class="jp">どこに いきますか</span>.)' },
        { ex: 5, tok: 1, wrong: ['に', 'を'], why: 'Mua đồ <b>tại</b> siêu thị → <b class="jp">スーパーで</b>. (Còn <span class="jp">スーパーに いきます</span> = đi siêu thị.)' },
      ],
      talk: [
        { q: 'どこで ひるごはんを たべますか。', qr: 'doko de hirugohan o tabemasu ka?', qv: 'Bạn ăn trưa ở đâu?', a: 3, wrong: [['がっこうに たべます。', 'gakkou ni tabemasu.'], ['ひるごはんを ください。', 'hirugohan o kudasai.']] },
        { q: 'どこで べんきょうしますか。', qr: 'doko de benkyou shimasu ka?', qv: 'Bạn thường học ở đâu?', a: 0, wrong: [['としょかんに べんきょうします。', 'toshokan ni benkyou shimasu.'], ['にほんごを べんきょうします。', 'nihongo o benkyou shimasu.']] },
        { sit: 'Bạn bè hỏi buổi tối bạn hay làm gì. Bạn nói bạn xem TV ở nhà:', a: 1, wrong: [['うちに テレビを みます。', 'uchi ni terebi o mimasu.'], ['うちで テレビです。', 'uchi de terebi desu.']] },
        { q: 'あしたは どこに いきますか。', qr: 'ashita wa doko ni ikimasu ka?', qv: 'Ngày mai bạn đi đâu?', a: ['としょかんに いきます。', 'toshokan ni ikimasu.', 'Mình đi thư viện.'], wrong: [['としょかんで いきます。', 'toshokan de ikimasu.'], ['としょかんを いきます。', 'toshokan o ikimasu.']] },
      ],
    },
    g36: {
      title: 'Hẹn gặp', jp: 'あいましょう', icon: 'phone',
      goal: 'Hẹn giờ, hẹn chỗ gặp nhau và báo khi đến trễ',
      pattern: { parts: [['なんじ / どこ', 'q', 'nanji / doko'], ['に / で', 'p', 'ni / de'], ['Động từ (bỏ ます)', 'v'], ['ましょうか', 'e', 'mashou ka']], mean: 'Mấy giờ / ở đâu mình … nhỉ? (cùng bàn với nhau)' },
      points: [
        '<b class="jp">〜ましょうか</b> = mình … nhỉ? — dùng khi <b>cùng bàn</b> với người kia: <span class="jp">なんじに あいましょうか</span> = mấy giờ mình gặp nhau nhỉ?',
        'Gợi ý một giờ / một chỗ: <b class="jp">〜は どうですか</b> (… thì sao?): <span class="jp">ろくじは どうですか</span>. Cứ học thuộc mẫu này, chặng sau sẽ học kỹ <span class="jp">どうですか</span>.',
        'Đồng ý: <b class="jp">いいですよ</b> (được chứ) hoặc <span class="jp">いいですね</span> (hay đấy). Chốt lại bằng <span class="jp">〜ましょう</span>: <span class="jp">えきの まえで あいましょう</span>.',
        'Giờ hẹn dùng <b class="jp">に</b> (<span class="jp">ろくじに</span>); chỗ gặp dùng <b class="jp">で</b> vì là nơi diễn ra việc gặp (<span class="jp">えきの まえで</span>).',
        'Từ mới: <span class="jp">あいます</span> (gặp), <span class="jp">おくれます</span> (đến trễ): <span class="jp">ちょっと おくれます</span> = mình sẽ đến trễ một chút.',
      ],
      tip: 'Người Nhật rất đúng giờ: sắp trễ dù chỉ vài phút, họ cũng nhắn trước <b class="jp">すみません、ちょっと おくれます</b>. Chỗ hẹn quen thuộc là trước nhà ga — nổi tiếng nhất là tượng chó Hachiko ở ga Shibuya.',
      ex: [
        { j: 'なんじ|に |あいましょうか。', r: 'nanji|ni|aimashou ka', v: 'Mấy giờ mình gặp nhau nhỉ?', k: '何時に会いましょうか。' },
        { j: 'ろくじ|は |どうですか。', r: 'rokuji|wa|dou desu ka', v: '6 giờ thì sao?', k: '6時はどうですか。' },
        { j: 'いい|ですよ。', r: 'ii|desu yo', v: 'Được chứ.', k: 'いいですよ。' },
        { j: 'どこ|で |あいましょうか。', r: 'doko|de|aimashou ka', v: 'Mình gặp nhau ở đâu nhỉ?', k: 'どこで会いましょうか。' },
        { j: 'えき|の |まえ|で |あいましょう。', r: 'eki|no|mae|de|aimashou', v: 'Gặp nhau trước nhà ga nhé.', k: '駅の前で会いましょう。' },
        { j: 'じゃあ、|また |あした。', r: 'jaa,|mata|ashita', v: 'Vậy mai gặp lại nhé.', k: 'じゃあ、また明日。' },
        { j: 'すみません、|ちょっと |おくれます。', r: 'sumimasen,|chotto|okuremasu', v: 'Xin lỗi, mình sẽ đến trễ một chút.', k: 'すみません、ちょっと遅れます。' },
        { j: 'あした、|しちじ|に |えき|で |あいましょう。', r: 'ashita,|shichiji|ni|eki|de|aimashou', v: 'Mai 7 giờ gặp nhau ở nhà ga nhé.', k: '明日、7時に駅で会いましょう。' },
      ],
      fill: [
        { ex: 0, tok: 2, wrong: ['あいましょう。', 'あいます。'], why: 'Có từ để hỏi (<span class="jp">なんじ</span>) và muốn cùng bàn → <b class="jp">ましょうか</b>.' },
        { ex: 1, tok: 2, wrong: ['なんですか。', 'いくらですか。'], why: 'Gợi ý "… thì sao?" → <b class="jp">どうですか</b>.' },
        { ex: 4, tok: 3, wrong: ['に', 'を'], why: 'Chỗ gặp nhau là nơi diễn ra việc gặp → <b class="jp">で</b>.' },
        { ex: 7, tok: 2, wrong: ['で', 'を'], why: 'Giờ hẹn → <b class="jp">に</b> (<span class="jp">しちじに</span>); chỗ hẹn mới dùng で (<span class="jp">えきで</span>).' },
      ],
      talk: [
        { q: 'なんじに あいましょうか。', qr: 'nanji ni aimashou ka?', qv: 'Mấy giờ mình gặp nhau nhỉ?', a: 1, wrong: [['ろくじに あいましたか。', 'rokuji ni aimashita ka?'], ['えきの まえです。', 'eki no mae desu.']] },
        { q: 'ろくじは どうですか。', qr: 'rokuji wa dou desu ka?', qv: '6 giờ thì sao?', a: 2, wrong: [['はい、ろくじでした。', 'hai, rokuji deshita.'], ['ろくじは どこですか。', 'rokuji wa doko desu ka?']] },
        { q: 'どこで あいましょうか。', qr: 'doko de aimashou ka?', qv: 'Mình gặp nhau ở đâu nhỉ?', a: 4, wrong: [['えきの まえを あいましょう。', 'eki no mae o aimashou.'], ['しちじに あいましょう。', 'shichiji ni aimashou.']] },
        { sit: 'Bạn hẹn bạn bè lúc 7 giờ nhưng tàu bị chậm. Bạn nhắn tin:', a: 6, wrong: [5, 2] },
      ],
    },

    // ---------- Chặng 9: Miêu tả ----------
    g37: {
      title: 'Đẹp, yên tĩnh…', jp: 'きれい・しずか', icon: 'sakura',
      goal: 'Miêu tả nơi chốn, đồ vật với tính từ đuôi な',
      pattern: { parts: [['Vật / nơi', 'n'], ['は', 'p', 'wa'], ['Tính từ な', 'a'], ['です', 'e', 'desu']], mean: 'Vật / nơi như thế nào' },
      points: [
        'Tính từ đuôi <span class="jp">な</span>: <span class="jp">しずか</span> (yên tĩnh), <span class="jp">きれい</span> (đẹp / sạch), <span class="jp">ゆうめい</span> (nổi tiếng), <span class="jp">にぎやか</span> (náo nhiệt, đông vui).',
        'Cuối câu chỉ cần thêm <b class="jp">です</b>: <span class="jp">しずかです</span>. Phủ định giống danh từ: <b class="jp">じゃないです</b> / <b class="jp">じゃありません</b> — <span class="jp">しずかじゃないです</span>.',
        'Đứng trước danh từ thì thêm <b class="jp">な</b>: <span class="jp">しずかな こうえん</span> (công viên yên tĩnh), <span class="jp">きれいな まち</span> (thành phố đẹp).',
        'Chú ý: <b class="jp">きれい</b> tận cùng bằng い nhưng là tính từ <b>な</b> → phủ định là <span class="jp">きれいじゃないです</span>, không phải <span class="jp">きれくないです</span>.',
      ],
      tip: 'Người Nhật hay khen <b class="jp">きれいですね！</b> — dùng được cho cảnh đẹp, căn phòng sạch sẽ, cả chữ viết đẹp. Đường phố Nhật nổi tiếng sạch dù rất ít thùng rác công cộng: người ta thường mang rác về nhà.',
      ex: [
        { j: 'この |まち|は |しずか|です。', r: 'kono|machi|wa|shizuka|desu', v: 'Thành phố này yên tĩnh.', k: 'この町は静かです。' },
        { j: 'にほん|は |きれい|です。', r: 'nihon|wa|kirei|desu', v: 'Nước Nhật sạch đẹp.', k: '日本はきれいです。' },
        { j: 'ふじさん|は |ゆうめい|です。', r: 'Fujisan|wa|yuumei|desu', v: 'Núi Phú Sĩ nổi tiếng.', k: '富士山は有名です。' },
        { j: 'ここ|は |にぎやか|ですね。', r: 'koko|wa|nigiyaka|desu ne', v: 'Chỗ này náo nhiệt nhỉ.', k: 'ここはにぎやかですね。' },
        { j: 'しずか|な |こうえん|です。', r: 'shizuka|na|kouen|desu', v: 'Đây là một công viên yên tĩnh.', k: '静かな公園です。' },
        { j: 'ハノイ|は |しずかじゃない|です。', r: 'Hanoi|wa|shizuka ja nai|desu', v: 'Hà Nội không yên tĩnh.', k: 'ハノイは静かじゃないです。' },
        { j: 'わたし|の |へや|は |きれいじゃありません。', r: 'watashi|no|heya|wa|kirei ja arimasen', v: 'Phòng của tôi không sạch.', k: '私の部屋はきれいじゃありません。' },
        { j: 'きょうと|は |きれい|な |まち|です。', r: 'Kyouto|wa|kirei|na|machi|desu', v: 'Kyoto là một thành phố đẹp.', k: '京都はきれいな町です。' },
      ],
      fill: [
        { ex: 0, tok: 4, wrong: ['なです。', 'いです。'], why: 'Cuối câu không cần な: <b class="jp">しずかです</b>.' },
        { ex: 4, tok: 1, wrong: ['の', 'い'], why: 'Tính từ な đứng trước danh từ thì thêm <b class="jp">な</b>: <span class="jp">しずかな こうえん</span>.' },
        { ex: 5, tok: 2, wrong: ['しずかくない', 'しずかな'], why: 'Tính từ な phủ định giống danh từ: <b class="jp">しずかじゃない</b>です.' },
        { ex: 6, tok: 4, wrong: ['きれくないです。', 'きれいくありません。'], why: '<span class="jp">きれい</span> là tính từ な → phủ định <b class="jp">きれいじゃありません</b>.' },
      ],
      talk: [
        { q: 'ハノイは しずかですか。', qr: 'Hanoi wa shizuka desu ka?', qv: 'Hà Nội có yên tĩnh không?', a: ['いいえ、しずかじゃないです。にぎやかです。', 'iie, shizuka ja nai desu. nigiyaka desu.', 'Không, không yên tĩnh đâu. Náo nhiệt lắm.'], wrong: [['いいえ、しずかくないです。', 'iie, shizukakunai desu.'], ['はい、しずかじゃないです。', 'hai, shizuka ja nai desu.']] },
        { q: 'ここは ゆうめいな みせですか。', qr: 'koko wa yuumei na mise desu ka?', qv: 'Đây là quán nổi tiếng à?', a: ['はい、ゆうめいな みせです。', 'hai, yuumei na mise desu.', 'Vâng, quán nổi tiếng đấy.'], wrong: [['はい、ゆうめい みせです。', 'hai, yuumei mise desu.'], ['はい、ゆうめいの みせです。', 'hai, yuumei no mise desu.']] },
        { sit: 'Bạn đến chơi nhà người quen, căn phòng gọn gàng sạch sẽ. Bạn khen:', a: ['きれいな へやですね。', 'kirei na heya desu ne.', 'Căn phòng đẹp quá nhỉ.'], wrong: [['きれいい へやですね。', 'kireii heya desu ne.'], ['へやは きれいじゃないです。', 'heya wa kirei ja nai desu.']] },
        { sit: 'Bạn bước vào một khu chợ đông người, rộn ràng. Bạn nói với bạn đi cùng:', a: 3, wrong: [['ここは しずかですね。', 'koko wa shizuka desu ne.'], ['ここは にぎやかなです。', 'koko wa nigiyaka na desu.']] },
      ],
    },
    g38: {
      title: 'Thế nào?', jp: 'どうですか', icon: 'question',
      goal: 'Hỏi cảm nhận với どうですか, đáp bằng とても / ちょっと / あまり',
      pattern: { parts: [['Vật / việc', 'n'], ['は', 'p', 'wa'], ['どう', 'q', 'dou'], ['ですか', 'e', 'desu ka']], mean: '… thế nào? (hỏi cảm nhận)' },
      points: [
        '<b class="jp">どうですか</b> = thế nào? — hỏi cảm nhận về món ăn, nơi chốn, việc học…: <span class="jp">にほんごは どうですか</span>.',
        '<b class="jp">とても</b> = rất: <span class="jp">とても おもしろいです</span> (rất thú vị). <b class="jp">ちょっと</b> = hơi, một chút — hay dùng cho điều không vui: <span class="jp">ちょっと むずかしいです</span>.',
        '<b class="jp">あまり</b> = không … lắm, <b>luôn đi với phủ định</b>: <span class="jp">あまり むずかしくないです</span> (không khó lắm). Không nói <span class="jp">あまり むずかしいです</span>.',
        'Nhắc lại phủ định: tính từ い → <span class="jp">〜くないです</span> (<span class="jp">おいしくないです</span>); tính từ な → <span class="jp">〜じゃないです</span> (<span class="jp">しずかじゃないです</span>).',
      ],
      tip: 'Người Nhật hay nói giảm nói tránh: thay vì "khó quá", họ nói <b class="jp">ちょっと むずかしいです</b>. Được khen tiếng Nhật giỏi, câu đáp khiêm tốn quen thuộc là <span class="jp">いえいえ、まだまだです</span> (đâu có, mình còn kém lắm).',
      ex: [
        { j: 'にほんご|は |どうですか。', r: 'nihongo|wa|dou desu ka', v: 'Tiếng Nhật thế nào?', k: '日本語はどうですか。' },
        { j: 'とても |おもしろい|です。', r: 'totemo|omoshiroi|desu', v: 'Rất thú vị.', k: 'とても面白いです。' },
        { j: 'ちょっと |むずかしい|です。', r: 'chotto|muzukashii|desu', v: 'Hơi khó.', k: 'ちょっと難しいです。' },
        { j: 'あまり |むずかしくない|です。', r: 'amari|muzukashikunai|desu', v: 'Không khó lắm.', k: 'あまり難しくないです。' },
        { j: 'この |みせ|は |どうですか。', r: 'kono|mise|wa|dou desu ka', v: 'Quán này thế nào?', k: 'この店はどうですか。' },
        { j: 'とても |いい |みせ|です。', r: 'totemo|ii|mise|desu', v: 'Là một quán rất tốt.', k: 'とてもいい店です。' },
        { j: 'この |ラーメン|は |あまり |おいしくない|です。', r: 'kono|raamen|wa|amari|oishikunai|desu', v: 'Món ramen này không ngon lắm.', k: 'このラーメンはあまりおいしくないです。' },
        { j: 'この |まち|は |あまり |しずかじゃない|です。', r: 'kono|machi|wa|amari|shizuka ja nai|desu', v: 'Thành phố này không yên tĩnh lắm.', k: 'この町はあまり静かじゃないです。' },
      ],
      fill: [
        { ex: 0, tok: 2, wrong: ['なんですか。', 'どこですか。'], why: 'Hỏi cảm nhận "thế nào?" → <b class="jp">どうですか</b>.' },
        { ex: 3, tok: 0, wrong: ['とても', 'ちょっと'], why: 'Đi với phủ định (<span class="jp">〜くないです</span>) → <b class="jp">あまり</b> (không … lắm).' },
        { ex: 6, tok: 4, wrong: ['おいしい', 'おいしいじゃない'], why: '<span class="jp">あまり</span> luôn đi với phủ định: <b class="jp">おいしくない</b>.' },
        { ex: 7, tok: 4, wrong: ['しずかくない', 'しずか'], why: '<span class="jp">あまり</span> + phủ định của tính từ な: <b class="jp">しずかじゃない</b>です.' },
      ],
      talk: [
        { q: 'にほんごは どうですか。', qr: 'nihongo wa dou desu ka?', qv: 'Tiếng Nhật thế nào?', a: 2, wrong: [['あまり むずかしいです。', 'amari muzukashii desu.'], ['にほんごです。', 'nihongo desu.']] },
        { q: 'この みせは どうですか。', qr: 'kono mise wa dou desu ka?', qv: 'Quán này thế nào?', a: 5, wrong: [['とても いいな みせです。', 'totemo ii na mise desu.'], ['この みせは あそこです。', 'kono mise wa asoko desu.']] },
        { q: 'ラーメン、おいしいですか。', qr: 'raamen, oishii desu ka?', qv: 'Ramen có ngon không?', a: ['うーん、あまり おいしくないです。', 'uun, amari oishikunai desu.', 'Ừm, không ngon lắm.'], wrong: [['うーん、あまり おいしいです。', 'uun, amari oishii desu.'], ['はい、おいしくないです。', 'hai, oishikunai desu.']] },
        { sit: 'Bạn và bạn của bạn đi dạo ở một khu phố khá ồn ào, xe cộ đông đúc. Bạn nói:', a: 7, wrong: [['この まちは あまり しずかです。', 'kono machi wa amari shizuka desu.'], ['この まちは とても しずかです。', 'kono machi wa totemo shizuka desu.']] },
      ],
    },
    g39: {
      title: 'Hôm qua thế nào?', jp: 'たのしかったです', icon: 'yesterday',
      goal: 'Kể lại cảm nhận về chuyện đã qua với かったです / でした',
      pattern: { parts: [['Việc đã qua', 'n'], ['は', 'p', 'wa'], ['Tính từ い (bỏ い)', 'a'], ['かったです', 'e', 'katta desu']], mean: 'Đã … (quá khứ của tính từ い); tính từ な thì thêm でした' },
      points: [
        'Tính từ い ở quá khứ: bỏ <span class="jp">い</span>, thêm <b class="jp">かったです</b>: <span class="jp">たのしい → たのしかったです</span> (đã vui).',
        'Tính từ な (và danh từ): thêm <b class="jp">でした</b>: <span class="jp">きれい → きれいでした</span>, <span class="jp">しずか → しずかでした</span>.',
        'Hỏi chuyện đã qua: <b class="jp">〜は どうでしたか</b> = … thế nào? — <span class="jp">りょこうは どうでしたか</span> (chuyến du lịch thế nào?).',
        'Phủ định quá khứ: <span class="jp">たかくないです → たかくなかったです</span>; <span class="jp">しずかじゃないです → しずかじゃなかったです</span>.',
        'Đặc biệt: <b class="jp">いい</b> → <b class="jp">よかったです</b> (không nói いかったです).',
      ],
      tip: 'Nghe ai kể chuyện vui, người Nhật hay đáp <b class="jp">よかったですね！</b> (tốt quá nhỉ / mừng cho bạn). Đi du lịch về, họ thường mua <span class="jp">おみやげ</span> (quà đặc sản) tặng đồng nghiệp, bạn bè.',
      ex: [
        { j: 'りょこう|は |どうでしたか。', r: 'ryokou|wa|dou deshita ka', v: 'Chuyến du lịch thế nào?', k: '旅行はどうでしたか。' },
        { j: 'たのしかった|です。', r: 'tanoshikatta|desu', v: 'Vui lắm.', k: '楽しかったです。' },
        { j: 'すし|は |おいしかった|です。', r: 'sushi|wa|oishikatta|desu', v: 'Sushi ngon lắm.', k: '寿司はおいしかったです。' },
        { j: 'きのう|は |さむかった|です。', r: 'kinou|wa|samukatta|desu', v: 'Hôm qua trời lạnh.', k: '昨日は寒かったです。' },
        { j: 'まち|は |きれい|でした。', r: 'machi|wa|kirei|deshita', v: 'Phố xá ở đó đẹp.', k: '町はきれいでした。' },
        { j: 'てんき|は |よかった|です。', r: 'tenki|wa|yokatta|desu', v: 'Thời tiết đẹp.', k: '天気はよかったです。' },
        { j: 'ホテル|は |あまり |たかくなかった|です。', r: 'hoteru|wa|amari|takakunakatta|desu', v: 'Khách sạn không đắt lắm.', k: 'ホテルはあまり高くなかったです。' },
        { j: 'ホテル|の |へや|は |しずかじゃなかった|です。', r: 'hoteru|no|heya|wa|shizuka ja nakatta|desu', v: 'Phòng khách sạn không yên tĩnh.', k: 'ホテルの部屋は静かじゃなかったです。' },
      ],
      fill: [
        { ex: 1, tok: 0, wrong: ['たのしいでした', 'たのしでした'], why: 'Tính từ い ở quá khứ: bỏ い + <b class="jp">かった</b>です (không nói たのしいでした).' },
        { ex: 4, tok: 3, wrong: ['かったです。', 'なでした。'], why: '<span class="jp">きれい</span> là tính từ な → quá khứ thêm <b class="jp">でした</b> (không nói きれいかったです).' },
        { ex: 5, tok: 2, wrong: ['いかった', 'いいでした'], why: 'Đặc biệt: <span class="jp">いい</span> → <b class="jp">よかった</b>です.' },
        { ex: 6, tok: 3, wrong: ['たかいじゃなかった', 'たかかった'], why: '<span class="jp">あまり</span> + phủ định quá khứ: <span class="jp">たかくない</span> → <b class="jp">たかくなかった</b>です.' },
      ],
      talk: [
        { q: 'りょこうは どうでしたか。', qr: 'ryokou wa dou deshita ka?', qv: 'Chuyến du lịch thế nào?', a: 1, wrong: [['たのしいでした。', 'tanoshii deshita.'], ['りょこうに いきます。', 'ryokou ni ikimasu.']] },
        { q: 'きのうは さむかったですか。', qr: 'kinou wa samukatta desu ka?', qv: 'Hôm qua có lạnh không?', a: ['はい、とても さむかったです。', 'hai, totemo samukatta desu.', 'Có, lạnh lắm.'], wrong: [['はい、さむいでした。', 'hai, samui deshita.'], ['はい、さむかったでした。', 'hai, samukatta deshita.']] },
        { q: 'ホテルは たかかったですか。', qr: 'hoteru wa takakatta desu ka?', qv: 'Khách sạn có đắt không?', a: 6, wrong: [['いいえ、あまり たかかったです。', 'iie, amari takakatta desu.'], ['いいえ、たかいじゃなかったです。', 'iie, takai ja nakatta desu.']] },
        { sit: 'Bạn của bạn khoe hôm qua thi đỗ rồi. Bạn mừng cho bạn ấy:', a: ['よかったですね！', 'yokatta desu ne!', 'Tốt quá! Mừng cho bạn nhé!'], wrong: [['いかったですね！', 'ikatta desu ne!'], ['ざんねんでしたね。', 'zannen deshita ne.']] },
      ],
    },
  });

  // ---------- câu mẫu thêm cho bài gốc trong data-talk.js (nối vào sau câu cũ; chỉ số đếm theo danh sách đã nối) ----------
  Object.assign(SJ.TALK_X, {
    // g9 có sẵn ex 0–4 → câu mới là 5–8
    g9: {
      ex: [
        { j: 'なに|を |たべますか。', r: 'nani|o|tabemasu ka', v: 'Bạn ăn gì?', k: '何を食べますか。' },
        { j: 'テレビ|を |みます。', r: 'terebi|o|mimasu', v: 'Tôi xem TV.', k: 'テレビを見ます。' },
        { j: 'わたし|は |にく|を |たべません。', r: 'watashi|wa|niku|o|tabemasen', v: 'Tôi không ăn thịt.', k: '私は肉を食べません。' },
        { j: 'ごちそうさま|でした。', r: 'gochisousama|deshita', v: 'Cảm ơn vì bữa ăn (khi ăn xong).', k: 'ごちそうさまでした。' },
      ],
      fill: [
        { ex: 5, tok: 0, wrong: ['どこ', 'いくら'], why: 'Hỏi ăn <b>cái gì</b> → <b class="jp">なに</b>を.' },
        { ex: 7, tok: 4, wrong: ['たべます。', 'たべますか。'], why: 'Không ăn → <b class="jp">たべません</b>.' },
      ],
      talk: [
        { q: 'なにを たべますか。', qr: 'nani o tabemasu ka?', qv: 'Bạn ăn gì?', a: ['ラーメンを たべます。', 'raamen o tabemasu.', 'Mình ăn ramen.'], wrong: [['ラーメンに たべます。', 'raamen ni tabemasu.'], ['はい、たべます。', 'hai, tabemasu.']] },
        { sit: 'Ăn xong bữa cơm ở nhà bạn người Nhật, bạn nói:', a: 8, wrong: [4, ['いらっしゃいませ。', 'irasshaimase.']] },
      ],
    },
    // g10 có sẵn ex 0–4 → câu mới là 5–8
    g10: {
      ex: [
        { j: 'なんじ|に |かえりますか。', r: 'nanji|ni|kaerimasu ka', v: 'Mấy giờ bạn về?', k: '何時に帰りますか。' },
        { j: 'ろくじ|に |うち|に |かえります。', r: 'rokuji|ni|uchi|ni|kaerimasu', v: 'Tôi về nhà lúc 6 giờ.', k: '6時にうちに帰ります。' },
        { j: 'あした、|がっこう|に |きますか。', r: 'ashita,|gakkou|ni|kimasu ka', v: 'Ngày mai bạn có đến trường không?', k: '明日、学校に来ますか。' },
        { j: 'きょう|は |がっこう|に |いきません。', r: 'kyou|wa|gakkou|ni|ikimasen', v: 'Hôm nay tôi không đi học.', k: '今日は学校に行きません。' },
      ],
      fill: [
        { ex: 6, tok: 3, wrong: ['を', 'で'], why: 'Nơi về → <b class="jp">に</b>: <span class="jp">うちに かえります</span>. (<span class="jp">ろくじに</span> là giờ.)' },
        { ex: 8, tok: 4, wrong: ['いきます。', 'かえります。'], why: 'Không đi → <b class="jp">いきません</b>.' },
      ],
      talk: [
        { q: 'なんじに うちに かえりますか。', qr: 'nanji ni uchi ni kaerimasu ka?', qv: 'Mấy giờ bạn về nhà?', a: 6, wrong: [['ろくじに うちを かえります。', 'rokuji ni uchi o kaerimasu.'], ['ろくじに うちに いきます。', 'rokuji ni uchi ni ikimasu.']] },
        { q: 'きょう、がっこうに いきますか。', qr: 'kyou, gakkou ni ikimasu ka?', qv: 'Hôm nay bạn có đi học không?', a: ['いいえ、いきません。', 'iie, ikimasen.', 'Không, hôm nay mình không đi.'], wrong: [['いいえ、いきます。', 'iie, ikimasu.'], ['いいえ、がっこうです。', 'iie, gakkou desu.']] },
        { sit: 'Tan học, bạn chào cô giáo và nói mình về nhà:', a: 3, wrong: [['うちに きます。', 'uchi ni kimasu.'], ['うちを かえります。', 'uchi o kaerimasu.']] },
      ],
    },
    // g11 có sẵn ex 0–4 → câu mới là 5–8
    g11: {
      ex: [
        { j: 'きのう、|なに|を |しましたか。', r: 'kinou,|nani|o|shimashita ka', v: 'Hôm qua bạn đã làm gì?', k: '昨日、何をしましたか。' },
        { j: 'ともだち|と |きょうと|に |いきました。', r: 'tomodachi|to|Kyouto|ni|ikimashita', v: 'Tôi đã đi Kyoto với bạn.', k: '友達と京都に行きました。' },
        { j: 'きのう|は |べんきょうしませんでした。', r: 'kinou|wa|benkyou shimasen deshita', v: 'Hôm qua tôi đã không học bài.', k: '昨日は勉強しませんでした。' },
        { j: 'デパート|で |かばん|を |かいました。', r: 'depaato|de|kaban|o|kaimashita', v: 'Tôi đã mua túi xách ở trung tâm thương mại.', k: 'デパートでかばんを買いました。' },
      ],
      fill: [
        { ex: 5, tok: 3, wrong: ['しますか。', 'しました。'], why: 'Hỏi việc <b>hôm qua</b> → quá khứ + か: <b class="jp">しましたか</b>.' },
        { ex: 7, tok: 2, wrong: ['べんきょうしました。', 'べんきょうしません。'], why: 'Hôm qua + <b>không</b> làm → <b class="jp">ませんでした</b>.' },
      ],
      talk: [
        { q: 'きのう、なにを しましたか。', qr: 'kinou, nani o shimashita ka?', qv: 'Hôm qua bạn đã làm gì?', a: 6, wrong: [['ともだちと きょうとに いきます。', 'tomodachi to Kyouto ni ikimasu.'], ['はい、しました。', 'hai, shimashita.']] },
        { q: 'しゅくだい、しましたか。', qr: 'shukudai, shimashita ka?', qv: 'Cô giáo hỏi: "Em làm bài tập về nhà chưa?"', a: ['すみません、まだです。', 'sumimasen, mada desu.', 'Em xin lỗi, em chưa làm ạ.'], wrong: [['はい、まだです。', 'hai, mada desu.'], ['いいえ、しました。', 'iie, shimashita.']] },
        { sit: 'Bạn kể hôm qua bạn đã mua một cái túi ở trung tâm thương mại:', a: 8, wrong: [['デパートに かばんを かいました。', 'depaato ni kaban o kaimashita.'], ['デパートで かばんを かいます。', 'depaato de kaban o kaimasu.']] },
      ],
    },
    // g12 có sẵn ex 0–4 → câu mới là 5–8
    g12: {
      ex: [
        { j: 'いっしょに |かえりませんか。', r: 'issho ni|kaerimasen ka', v: 'Cùng về không?', k: '一緒に帰りませんか。' },
        { j: 'ええ、|いきましょう。', r: 'ee,|ikimashou', v: 'Ừ, đi thôi!', k: 'ええ、行きましょう。' },
        { j: 'ちょっと |やすみましょう。', r: 'chotto|yasumimashou', v: 'Nghỉ một chút nhé.', k: 'ちょっと休みましょう。' },
        { j: 'にちようび、|いっしょに |こうえん|に |いきませんか。', r: 'nichiyoubi,|issho ni|kouen|ni|ikimasen ka', v: 'Chủ nhật cùng đi công viên không?', k: '日曜日、一緒に公園に行きませんか。' },
      ],
      fill: [
        { ex: 5, tok: 1, wrong: ['かえります。', 'かえりました。'], why: 'Rủ cùng về → <b class="jp">かえりませんか</b>.' },
        { ex: 6, tok: 1, wrong: ['いきませんか。', 'いきました。'], why: 'Đồng ý, "cùng … thôi" → <b class="jp">ましょう</b>: <span class="jp">いきましょう</span>.' },
        { ex: 8, tok: 3, wrong: ['で', 'を'], why: 'Đi <b>đến</b> công viên → <b class="jp">に</b>.' },
      ],
      talk: [
        { q: 'いっしょに かえりませんか。', qr: 'issho ni kaerimasen ka?', qv: 'Cùng về không?', a: ['いいですね。かえりましょう。', 'ii desu ne. kaerimashou.', 'Được đấy. Cùng về thôi!'], wrong: [['はい、かえりませんか。', 'hai, kaerimasen ka?'], ['いいえ、かえりました。', 'iie, kaerimashita.']] },
        { sit: 'Học lâu quá, bạn thấy mệt và rủ bạn học cùng nghỉ một lát:', a: 7, wrong: [['ちょっと やすみました。', 'chotto yasumimashita.'], 4] },
      ],
    },
    // g13 có sẵn ex 0–4 → câu mới là 5–8
    g13: {
      ex: [
        { j: 'この |かばん|は |やすい|です。', r: 'kono|kaban|wa|yasui|desu', v: 'Cái túi này rẻ.', k: 'このかばんは安いです。' },
        { j: 'あたらしい |くるま|ですね。', r: 'atarashii|kuruma|desu ne', v: 'Xe mới nhỉ!', k: '新しい車ですね。' },
        { j: 'にほんご|は |むずかしくない|です。', r: 'nihongo|wa|muzukashikunai|desu', v: 'Tiếng Nhật không khó.', k: '日本語は難しくないです。' },
        { j: 'この |カメラ|は |よくない|です。', r: 'kono|kamera|wa|yokunai|desu', v: 'Cái máy ảnh này không tốt.', k: 'このカメラはよくないです。' },
      ],
      fill: [
        { ex: 7, tok: 2, wrong: ['むずかしいじゃない', 'むずかしいくない'], why: 'Phủ định tính từ い: bỏ い + <b class="jp">くない</b> → <span class="jp">むずかしくない</span>.' },
        { ex: 8, tok: 3, wrong: ['いくない', 'いいじゃない'], why: 'Đặc biệt: <span class="jp">いい</span> → <b class="jp">よくない</b>.' },
      ],
      talk: [
        { q: 'この かばんは たかいですか。', qr: 'kono kaban wa takai desu ka?', qv: 'Cái túi này có đắt không?', a: ['いいえ、たかくないです。やすいです。', 'iie, takakunai desu. yasui desu.', 'Không, không đắt đâu. Rẻ mà.'], wrong: [['いいえ、たかいじゃないです。', 'iie, takai ja nai desu.'], ['はい、やすいです。', 'hai, yasui desu.']] },
        { q: 'にほんごは むずかしいですか。', qr: 'nihongo wa muzukashii desu ka?', qv: 'Tiếng Nhật có khó không?', a: 7, wrong: [['いいえ、むずかしいです。', 'iie, muzukashii desu.'], ['いいえ、むずかしいくないです。', 'iie, muzukashiikunai desu.']] },
        { sit: 'Bạn của bạn vừa mua xe mới và khoe với bạn. Bạn nói:', a: 6, wrong: [['ふるい くるまですね。', 'furui kuruma desu ne.'], ['くるまは あたらしくないです。', 'kuruma wa atarashikunai desu.']] },
      ],
    },
  });
})(window.SJ);
