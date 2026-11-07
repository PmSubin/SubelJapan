/* SubelJapan — Nói & Ngữ pháp: chặng 10–12 (giỏi / hiểu / biết làm, muốn có, hỏi đường, xin phép, đang làm,
 * thời tiết & hỏi thăm, vì sao, khi bị ốm, khen & chia tay) + câu mẫu thêm cho g14, g15, g16 */
window.SJ = window.SJ || {};
(function (SJ) {
  SJ.TALK_L = SJ.TALK_L || {};
  SJ.TALK_X = SJ.TALK_X || {};
  Object.assign(SJ.TALK_L, {
    // ===================== Chặng 10: Thích & muốn =====================
    g40: {
      title: 'Giỏi, hiểu, biết làm', jp: 'じょうず・わかります', icon: 'medal',
      goal: 'Nói mình hiểu gì, biết làm gì và khen người khác giỏi với 〜が',
      pattern: { parts: [['Ngôn ngữ / việc', 'n'], ['が', 'p', 'ga'], ['わかります / できます', 'e', 'wakarimasu / dekimasu']], mean: 'Hiểu … / biết làm …' },
      points: [
        '<b class="jp">わかります</b> (hiểu), <b class="jp">できます</b> (biết làm, làm được), <b class="jp">じょうず</b> (giỏi) đều đi với <b class="jp">が</b>, không dùng を: <span class="jp">にほんごが わかります</span>.',
        'Nói ai giỏi gì: <b>người</b> + <span class="jp">は</span> + <b>việc</b> + <span class="jp">が じょうずです</span> — <span class="jp">ともだちは りょうりが じょうずです</span> (bạn tôi nấu ăn giỏi).',
        '<span class="jp">じょうず</span> dùng để <b>khen người khác</b>. Nói về mình mà dùng じょうず nghe như đang khoe — nói <span class="jp">すこし できます</span>, <span class="jp">すこし わかります</span> thì khiêm tốn hơn.',
        'Khi phủ định, người Nhật hay đổi が thành <b class="jp">は</b>: <span class="jp">りょうりは あまり できません</span> (giống <span class="jp">なっとうは あまり すきじゃないです</span>).',
      ],
      tip: 'Mới nói được vài câu, bạn sẽ được người Nhật khen <b class="jp">にほんごが じょうずですね！</b> rất nhiều. Đáp <b class="jp">いいえ、まだまだです</b> (đâu có, còn kém lắm) kèm nụ cười là đúng kiểu Nhật — gật đầu "vâng, tôi giỏi" sẽ nghe như đang khoe.',
      ex: [
        { j: 'にほんご|が |わかりますか。', r: 'nihongo|ga|wakarimasu ka', v: 'Bạn có hiểu tiếng Nhật không?', k: '日本語が分かりますか。' },
        { j: 'はい、|すこし |わかります。', r: 'hai,|sukoshi|wakarimasu', v: 'Vâng, tôi hiểu một chút.', k: 'はい、少し分かります。' },
        { j: 'ピアノ|が |できます。', r: 'piano|ga|dekimasu', v: 'Tôi biết chơi piano.', k: 'ピアノができます。' },
        { j: 'にほんご|が |じょうず|ですね。', r: 'nihongo|ga|jouzu|desu ne', v: 'Bạn giỏi tiếng Nhật quá!', k: '日本語が上手ですね。' },
        { j: 'いいえ、|まだまだ|です。', r: 'iie,|madamada|desu', v: 'Đâu có, tôi còn kém lắm.', k: 'いいえ、まだまだです。' },
        { j: 'うんてん|が |できますか。', r: 'unten|ga|dekimasu ka', v: 'Bạn có biết lái xe không?', k: '運転ができますか。' },
        { j: 'ともだち|は |りょうり|が |じょうず|です。', r: 'tomodachi|wa|ryouri|ga|jouzu|desu', v: 'Bạn tôi nấu ăn giỏi.', k: '友達は料理が上手です。' },
        { j: 'りょうり|は |あまり |できません。', r: 'ryouri|wa|amari|dekimasen', v: 'Tôi không biết nấu ăn mấy.', k: '料理はあまりできません。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['を', 'に'], why: '<span class="jp">わかります</span> đi với <b class="jp">が</b>: <span class="jp">にほんごが わかります</span>.' },
        { ex: 2, tok: 1, wrong: ['を', 'で'], why: '<span class="jp">できます</span> đi với <b class="jp">が</b>: <span class="jp">ピアノが できます</span>.' },
        { ex: 6, tok: 3, wrong: ['を', 'の'], why: 'Giỏi cái gì → việc + <b class="jp">が</b> じょうずです.' },
        { ex: 7, tok: 3, wrong: ['できます。', 'できました。'], why: '<span class="jp">あまり</span> (không … mấy) luôn đi với phủ định → <b class="jp">できません</b>.' },
      ],
      talk: [
        { q: 'にほんごが じょうずですね。', qr: 'nihongo ga jouzu desu ne.', qv: 'Bạn mới nói vài câu, người Nhật đã khen: "Bạn giỏi tiếng Nhật quá!"', a: 4, wrong: [['はい、じょうずです。', 'hai, jouzu desu.'], ['にほんごが わかりますか。', 'nihongo ga wakarimasu ka?']] },
        { q: 'えいごが わかりますか。', qr: 'eigo ga wakarimasu ka?', qv: 'Bạn có hiểu tiếng Anh không?', a: 1, wrong: [['はい、えいごを わかります。', 'hai, eigo o wakarimasu.'], ['いいえ、わかりました。', 'iie, wakarimashita.']] },
        { q: 'ピアノが できますか。', qr: 'piano ga dekimasu ka?', qv: 'Bạn biết chơi piano không?', a: ['すこし できます。', 'sukoshi dekimasu.', 'Mình biết chơi một chút.'], wrong: [['ピアノを できます。', 'piano o dekimasu.'], ['いいえ、できます。', 'iie, dekimasu.']] },
        { sit: 'Bạn muốn hỏi người bạn mới quen có biết lái xe không. Bạn nói:', a: 5, wrong: [['うんてんを できますか。', 'unten o dekimasu ka?'], ['うんてんが じょうずでしたか。', 'unten ga jouzu deshita ka?']] },
      ],
    },
    g41: {
      title: 'Muốn có…', jp: 'ほしいです', icon: 'gift',
      goal: 'Nói mình muốn có thứ gì với 〜が ほしいです',
      pattern: { parts: [['Đồ vật', 'n'], ['が', 'p', 'ga'], ['ほしいです', 'e', 'hoshii desu']], mean: 'Muốn có …' },
      points: [
        '<b class="jp">ほしい</b> = muốn có (một <b>thứ, đồ vật</b>). Mẫu: <span class="jp">〜が ほしいです</span> — đi với <b class="jp">が</b>, giống <span class="jp">すき</span>.',
        'Phân biệt: <b class="jp">ほしい</b> đi với <b>danh từ</b> (muốn có cái gì), <b class="jp">〜たい</b> đi với <b>động từ</b> (muốn làm gì): <span class="jp">スマホが ほしいです</span> ↔ <span class="jp">スマホを かいたいです</span> (muốn mua).',
        '<span class="jp">ほしい</span> là tính từ đuôi い → không muốn: <b class="jp">ほしくないです</b>. <span class="jp">なにも</span> + phủ định = không … gì cả: <span class="jp">なにも ほしくないです</span>.',
        'Chỉ dùng <span class="jp">ほしいです</span> để nói về <b>mình</b> hoặc hỏi người nghe — không dùng để kể "anh ấy muốn có…".',
      ],
      tip: 'Với người trên, người Nhật tránh hỏi thẳng <span class="jp">〜が ほしいですか</span> (giống <span class="jp">〜たいですか</span>). Khi mời đồ ăn, đồ uống, họ nói <b class="jp">〜は いかがですか</b>: <span class="jp">コーヒーは いかがですか</span> (anh / chị dùng cà phê nhé?).',
      ex: [
        { j: 'ねこ|が |ほしい|です。', r: 'neko|ga|hoshii|desu', v: 'Tôi muốn có một con mèo.', k: '猫が欲しいです。' },
        { j: 'なに|が |ほしい|ですか。', r: 'nani|ga|hoshii|desu ka', v: 'Bạn muốn có gì?', k: '何が欲しいですか。' },
        { j: 'くるま|が |ほしい|です。', r: 'kuruma|ga|hoshii|desu', v: 'Tôi muốn có xe hơi.', k: '車が欲しいです。' },
        { j: 'ひろい |へや|が |ほしい|です。', r: 'hiroi|heya|ga|hoshii|desu', v: 'Tôi muốn có một căn phòng rộng.', k: '広い部屋が欲しいです。' },
        { j: 'あたらしい |スマホ|が |ほしい|です。', r: 'atarashii|sumaho|ga|hoshii|desu', v: 'Tôi muốn có một chiếc điện thoại mới.', k: '新しいスマホが欲しいです。' },
        { j: 'あたらしい |スマホ|を |かいたい|です。', r: 'atarashii|sumaho|o|kaitai|desu', v: 'Tôi muốn mua một chiếc điện thoại mới.', k: '新しいスマホを買いたいです。' },
        { j: 'いま|は |なにも |ほしくない|です。', r: 'ima|wa|nanimo|hoshikunai|desu', v: 'Bây giờ tôi chẳng muốn có gì cả.', k: '今は何も欲しくないです。' },
        { j: 'たんじょうび|に |なに|が |ほしい|ですか。', r: 'tanjoubi|ni|nani|ga|hoshii|desu ka', v: 'Sinh nhật bạn muốn được tặng gì?', k: '誕生日に何が欲しいですか。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['を', 'に'], why: '<span class="jp">ほしい</span> đi với <b class="jp">が</b>: <span class="jp">ねこが ほしいです</span>.' },
        { ex: 5, tok: 3, wrong: ['ほしい', 'かいます'], why: 'Có <b class="jp">を</b> + động từ → muốn LÀM: <span class="jp">かいます</span> → <b class="jp">かいたい</b>です. <span class="jp">ほしい</span> thì đi với が.' },
        { ex: 6, tok: 3, wrong: ['ほしい', 'ほしいじゃない'], why: '<span class="jp">なにも</span> đi với phủ định. Tính từ い: <span class="jp">ほしい</span> → <b class="jp">ほしくない</b>.' },
      ],
      talk: [
        { q: 'なにが ほしいですか。', qr: 'nani ga hoshii desu ka?', qv: 'Bạn muốn có gì?', a: 4, wrong: [['あたらしい スマホを ほしいです。', 'atarashii sumaho o hoshii desu.'], ['はい、ほしいです。', 'hai, hoshii desu.']] },
        { q: 'くるまが ほしいですか。', qr: 'kuruma ga hoshii desu ka?', qv: 'Bạn có muốn có xe hơi không?', a: ['いいえ、ほしくないです。', 'iie, hoshikunai desu.', 'Không, mình không muốn.'], wrong: [['いいえ、ほしいです。', 'iie, hoshii desu.'], ['いいえ、くるまじゃないです。', 'iie, kuruma ja nai desu.']] },
        { sit: 'Bạn bè hỏi bạn muốn quà gì, nhưng bạn thấy chẳng cần thêm thứ gì. Bạn nói:', a: 6, wrong: [['いまは なにも ほしいです。', 'ima wa nanimo hoshii desu.'], ['いまは なにも たべたくないです。', 'ima wa nanimo tabetakunai desu.']] },
        { sit: 'Bạn muốn nói "Tôi muốn MUA một chiếc điện thoại mới" (muốn làm một việc):', a: 5, wrong: [['あたらしい スマホを ほしいです。', 'atarashii sumaho o hoshii desu.'], ['あたらしい スマホを かいました。', 'atarashii sumaho o kaimashita.']] },
      ],
    },

    // ===================== Chặng 11: Nhờ vả & xin phép =====================
    g42: {
      title: 'Hỏi đường', jp: 'みちを きく', icon: 'compass',
      goal: 'Hỏi đường lịch sự và hiểu khi được chỉ: đi thẳng, rẽ phải, rẽ trái',
      pattern: { parts: [['Nơi', 'n'], ['は', 'p', 'wa'], ['どちら', 'q', 'dochira'], ['ですか', 'e', 'desu ka']], mean: '… ở hướng nào ạ? (hỏi đường lịch sự)' },
      points: [
        'Hỏi đường lịch sự: <b class="jp">すみません、〜は どちらですか</b>. <span class="jp">どちら</span> là cách nói lịch sự của <span class="jp">どこ</span> (ở đâu / hướng nào).',
        'Người chỉ đường dùng <span class="jp">〜て ください</span> đã học: <b class="jp">まっすぐ いって ください</b> (đi thẳng), <b class="jp">みぎに / ひだりに まがって ください</b> (rẽ phải / rẽ trái). Cứ học thuộc cả câu.',
        'Rẽ về hướng nào → <b class="jp">に</b>: <span class="jp">みぎに</span>. Đi dọc / đi qua chỗ nào (con đường, góc phố) → <b class="jp">を</b>: <span class="jp">この みちを</span>, <span class="jp">かどを</span>.',
        '<span class="jp">あるいて</span> = đi bộ; <span class="jp">〜ぐらい</span> = khoảng: <span class="jp">あるいて ごふんぐらい</span> = đi bộ chừng 5 phút.',
      ],
      tip: 'Phần lớn đường phố ở Nhật không có tên, nên người Nhật chỉ đường bằng mốc: cửa hàng tiện lợi, ngân hàng, đèn giao thông (<span class="jp">しんごう</span>)… Được chỉ đường xong, nhớ cúi đầu nói <b class="jp">ありがとうございました</b>.',
      ex: [
        { j: 'すみません、|えき|は |どちら|ですか。', r: 'sumimasen,|eki|wa|dochira|desu ka', v: 'Xin lỗi, nhà ga ở hướng nào ạ?', k: 'すみません、駅はどちらですか。' },
        { j: 'まっすぐ |いって |ください。', r: 'massugu|itte|kudasai', v: 'Anh / chị cứ đi thẳng.', k: 'まっすぐ行ってください。' },
        { j: 'みぎ|に |まがって |ください。', r: 'migi|ni|magatte|kudasai', v: 'Anh / chị rẽ phải.', k: '右に曲がってください。' },
        { j: 'ちかい|ですか。', r: 'chikai|desu ka', v: 'Có gần không ạ?', k: '近いですか。' },
        { j: 'あるいて |ごふん|ぐらい|です。', r: 'aruite|gofun|gurai|desu', v: 'Đi bộ khoảng 5 phút.', k: '歩いて5分ぐらいです。' },
        { j: 'この |みち|を |まっすぐ |いって |ください。', r: 'kono|michi|o|massugu|itte|kudasai', v: 'Anh / chị đi thẳng con đường này.', k: 'この道をまっすぐ行ってください。' },
        { j: 'かど|を |ひだり|に |まがって |ください。', r: 'kado|o|hidari|ni|magatte|kudasai', v: 'Đến góc đường thì rẽ trái.', k: '角を左に曲がってください。' },
        { j: 'ありがとう|ございました。', r: 'arigatou|gozaimashita', v: 'Cảm ơn anh / chị nhiều ạ (sau khi được giúp).', k: 'ありがとうございました。' },
      ],
      fill: [
        { ex: 0, tok: 3, wrong: ['なん', 'だれ'], why: 'Hỏi hướng, hỏi chỗ lịch sự → <b class="jp">どちら</b> (lịch sự hơn どこ).' },
        { ex: 2, tok: 1, wrong: ['を', 'で'], why: 'Rẽ về hướng nào → hướng + <b class="jp">に</b>: <span class="jp">みぎに まがります</span>.' },
        { ex: 5, tok: 2, wrong: ['に', 'が'], why: 'Đi dọc theo con đường → đường + <b class="jp">を</b>: <span class="jp">この みちを いきます</span>.' },
        { ex: 4, tok: 2, wrong: ['ごろ', 'まで'], why: 'Mất khoảng bao lâu → <b class="jp">ぐらい</b>. (<span class="jp">ごろ</span> dùng cho mốc giờ: <span class="jp">しちじごろ</span>.)' },
      ],
      talk: [
        { sit: 'Bạn bị lạc và muốn hỏi một người đi đường xem nhà ga ở hướng nào. Bạn nói:', a: 0, wrong: [['すみません、えきは なんですか。', 'sumimasen, eki wa nan desu ka?'], ['すみません、えきに いきましたか。', 'sumimasen, eki ni ikimashita ka?']] },
        { q: 'えきですか。この みちを まっすぐ いって ください。', qr: 'eki desu ka. kono michi o massugu itte kudasai.', qv: 'Người đi đường chỉ: "Ga à? Cứ đi thẳng đường này nhé." Bạn muốn hỏi có xa không:', a: 3, wrong: [['ちかいです。', 'chikai desu.'], ['ここは えきです。', 'koko wa eki desu.']] },
        { q: 'ええ、ちかいですよ。あるいて ごふんぐらいです。', qr: 'ee, chikai desu yo. aruite gofun gurai desu.', qv: 'Người đi đường: "Ừ, gần thôi. Đi bộ chừng 5 phút."', a: 7, wrong: [['どういたしまして。', 'dou itashimashite.'], ['おやすみなさい。', 'oyasuminasai.']] },
        { q: 'すみません、えきは どちらですか。', qr: 'sumimasen, eki wa dochira desu ka?', qv: 'Một du khách hỏi bạn đường ra ga. (Đến góc đường tiếp theo thì rẽ trái.)', a: ['つぎの かどを ひだりに まがって ください。', 'tsugi no kado o hidari ni magatte kudasai.', 'Đến góc đường tiếp theo thì rẽ trái ạ.'], wrong: [['つぎの かどを みぎに まがって ください。', 'tsugi no kado o migi ni magatte kudasai.'], ['つぎの かどを ひだりに まがりました。', 'tsugi no kado o hidari ni magarimashita.']] },
      ],
    },
    g43: {
      title: 'Xin phép', jp: 'てもいいですか', icon: 'hand',
      goal: 'Xin phép lịch sự với 〜ても いいですか, đồng ý và từ chối khéo',
      pattern: { parts: [['Động từ dạng て', 'v'], ['も', 'p', 'mo'], ['いいですか', 'e', 'ii desu ka']], mean: 'Tôi … có được không? (xin phép)' },
      points: [
        'Xin phép: <b>động từ dạng て</b> + <b class="jp">も いいですか</b> = "Tôi … có được không?": <span class="jp">すわって</span> → <span class="jp">すわっても いいですか</span>.',
        'Dạng て sẽ học kỹ sau — giờ cứ học thuộc từng cặp: <span class="jp">すわります → すわって</span> (ngồi), <span class="jp">とります → とって</span> (chụp), <span class="jp">あけます → あけて</span> (mở), <span class="jp">かります → かりて</span> (mượn), <span class="jp">かえります → かえって</span> (về).',
        'Đồng ý: <b class="jp">はい、どうぞ</b> (vâng, xin mời) hoặc <b class="jp">ええ、いいですよ</b> (được chứ).',
        'Từ chối khéo: <b class="jp">すみません、それは ちょっと…</b> — bỏ lửng như khi từ chối lời rủ, không cần nói "không".',
      ],
      tip: 'Trước khi chụp ảnh người khác, ngồi cạnh ai hay mượn đồ, người Nhật thường hỏi <span class="jp">〜ても いいですか</span> trước. Nói thân mật với bạn bè, họ rút gọn thành <b class="jp">〜て いい？</b>: <span class="jp">これ、つかって いい？</span> (mình dùng cái này nhé?).',
      ex: [
        { j: 'ここ|に |すわっても |いい|ですか。', r: 'koko|ni|suwatte mo|ii|desu ka', v: 'Tôi ngồi đây có được không?', k: 'ここに座ってもいいですか。' },
        { j: 'はい、|どうぞ。', r: 'hai,|douzo', v: 'Vâng, xin mời.', k: 'はい、どうぞ。' },
        { j: 'ええ、|いい|ですよ。', r: 'ee,|ii|desu yo', v: 'Ừ, được chứ.', k: 'ええ、いいですよ。' },
        { j: 'しゃしん|を |とっても |いい|ですか。', r: 'shashin|o|totte mo|ii|desu ka', v: 'Tôi chụp ảnh có được không?', k: '写真を撮ってもいいですか。' },
        { j: 'すみません、|それ|は |ちょっと…', r: 'sumimasen,|sore|wa|chotto', v: 'Xin lỗi, việc đó thì hơi… (từ chối khéo)', k: 'すみません、それはちょっと…' },
        { j: 'まど|を |あけても |いい|ですか。', r: 'mado|o|akete mo|ii|desu ka', v: 'Tôi mở cửa sổ có được không?', k: '窓を開けてもいいですか。' },
        { j: 'トイレ|を |かりても |いい|ですか。', r: 'toire|o|karite mo|ii|desu ka', v: 'Cho tôi đi nhờ nhà vệ sinh được không?', k: 'トイレを借りてもいいですか。' },
        { j: 'きょう|は |はやく |かえっても |いい|ですか。', r: 'kyou|wa|hayaku|kaette mo|ii|desu ka', v: 'Hôm nay tôi về sớm có được không ạ?', k: '今日は早く帰ってもいいですか。' },
      ],
      fill: [
        { ex: 0, tok: 2, wrong: ['すわります', 'すわりたい'], why: 'Xin phép: dạng て + <b class="jp">も</b> → <b class="jp">すわっても</b> いいですか.' },
        { ex: 5, tok: 3, wrong: ['すき', 'ほしい'], why: 'Mẫu xin phép: 〜ても <b class="jp">いい</b>ですか (… cũng được chứ?).' },
        { ex: 6, tok: 1, wrong: ['が', 'で'], why: 'Mượn <b>cái gì</b> → <b class="jp">を</b>: <span class="jp">トイレを かります</span>.' },
        { ex: 7, tok: 5, wrong: ['です。', 'ですね。'], why: 'Đang hỏi xin phép nên cuối câu là <b class="jp">ですか</b> (lên giọng ↗).' },
      ],
      talk: [
        { sit: 'Trên tàu, bạn thấy một chỗ trống cạnh một bác lớn tuổi. Bạn hỏi:', a: 0, wrong: [['ここに すわりましたか。', 'koko ni suwarimashita ka?'], ['ここに すわって ください。', 'koko ni suwatte kudasai.']] },
        { q: 'この ペン、つかっても いいですか。', qr: 'kono pen, tsukatte mo ii desu ka?', qv: 'Bạn cùng lớp hỏi: "Mình dùng cái bút này được không?"', a: 2, wrong: [['いいえ、いいですよ。', 'iie, ii desu yo.'], ['ペンを ください。', 'pen o kudasai.']] },
        { sit: 'Bạn đang ở nhà người quen và muốn đi vệ sinh. Bạn hỏi:', a: 6, wrong: [['トイレを ください。', 'toire o kudasai.'], ['トイレは いいですか。', 'toire wa ii desu ka?']] },
        { q: 'しゃしんを とっても いいですか。', qr: 'shashin o totte mo ii desu ka?', qv: 'Một người lạ muốn chụp ảnh bạn, nhưng bạn không muốn:', a: 4, wrong: [['いいえ、どうぞ。', 'iie, douzo.'], ['しゃしんを とって ください。', 'shashin o totte kudasai.']] },
      ],
    },
    g44: {
      title: 'Đang làm gì?', jp: 'ています', icon: 'phone',
      goal: 'Nói việc mình đang làm với 〜て います',
      pattern: { parts: [['Việc', 'n'], ['を', 'p', 'o'], ['Động từ dạng て', 'v'], ['います', 'e', 'imasu']], mean: 'Đang làm gì' },
      points: [
        'Đang làm gì: <b>động từ dạng て</b> + <b class="jp">います</b>: <span class="jp">たべます → たべて います</span> (đang ăn).',
        'Dạng て của các động từ quen (cứ học thuộc): <span class="jp">みます → みて</span>, <span class="jp">します → して</span>, <span class="jp">まちます → まって</span>, <span class="jp">ふります → ふって</span> (mưa rơi).',
        'Hỏi: <b class="jp">いま、なにを していますか</b> = bây giờ bạn đang làm gì? Trời đang mưa: <span class="jp">あめが ふっています</span> — mưa là chủ ngữ nên dùng <b class="jp">が</b>.',
        'Không làm gì cả: <b class="jp">なにも していません</b>.',
      ],
      tip: 'Nói nhanh hằng ngày, người Nhật hay nuốt chữ い: <span class="jp">たべて います</span> → <b class="jp">たべてます</b>, <span class="jp">みて います</span> → <b class="jp">みてます</b>. Nghe thấy <span class="jp">〜てます</span> thì hiểu là "đang…" nhé.',
      ex: [
        { j: 'いま、|なに|を |して いますか。', r: 'ima,|nani|o|shite imasu ka', v: 'Bây giờ bạn đang làm gì?', k: '今、何をしていますか。' },
        { j: 'ごはん|を |たべて います。', r: 'gohan|o|tabete imasu', v: 'Tôi đang ăn cơm.', k: 'ご飯を食べています。' },
        { j: 'テレビ|を |みて います。', r: 'terebi|o|mite imasu', v: 'Tôi đang xem tivi.', k: 'テレビを見ています。' },
        { j: 'あめ|が |ふって います。', r: 'ame|ga|futte imasu', v: 'Trời đang mưa.', k: '雨が降っています。' },
        { j: 'ともだち|を |まって います。', r: 'tomodachi|o|matte imasu', v: 'Tôi đang đợi bạn.', k: '友達を待っています。' },
        { j: 'いま、|でんわ|を |して います。', r: 'ima,|denwa|o|shite imasu', v: 'Bây giờ tôi đang gọi điện thoại.', k: '今、電話をしています。' },
        { j: 'リン|さん|は |へや|で |べんきょうして います。', r: 'Rin|-san|wa|heya|de|benkyou shite imasu', v: 'Linh đang học bài trong phòng.', k: 'リンさんは部屋で勉強しています。' },
        { j: 'いま|は |なにも |して いません。', r: 'ima|wa|nanimo|shite imasen', v: 'Bây giờ tôi chẳng làm gì cả.', k: '今は何もしていません。' },
      ],
      fill: [
        { ex: 1, tok: 2, wrong: ['たべます。', 'たべました。'], why: 'Đang làm → dạng て + <b class="jp">います</b>: <span class="jp">たべて います</span>.' },
        { ex: 3, tok: 1, wrong: ['を', 'に'], why: 'Mưa là chủ ngữ → <b class="jp">が</b>: <span class="jp">あめが ふっています</span>.' },
        { ex: 6, tok: 4, wrong: ['に', 'を'], why: 'Nơi làm việc gì đó → <b class="jp">で</b>: <span class="jp">へやで べんきょうします</span>.' },
        { ex: 7, tok: 3, wrong: ['して います。', 'しませんでした。'], why: '<span class="jp">なにも</span> đi với phủ định; đang (không) làm → <b class="jp">していません</b>.' },
      ],
      talk: [
        { q: 'もしもし、いま なにを して いますか。', qr: 'moshimoshi, ima nani o shite imasu ka?', qv: 'Bạn bè gọi điện: "Alo, giờ đang làm gì đấy?" (bạn đang xem tivi)', a: 2, wrong: [['テレビを みました。', 'terebi o mimashita.'], ['テレビが すきです。', 'terebi ga suki desu.']] },
        { q: 'そとは あめですか。', qr: 'soto wa ame desu ka?', qv: 'Bên ngoài có mưa không? (bạn nhìn ra cửa sổ: đang mưa)', a: ['はい、ふって います。', 'hai, futte imasu.', 'Có, đang mưa.'], wrong: [['はい、あめを ふって います。', 'hai, ame o futte imasu.'], ['いいえ、ふって います。', 'iie, futte imasu.']] },
        { q: 'あ、リンさん。ここで なにを して いますか。', qr: 'a, Rin-san. koko de nani o shite imasu ka?', qv: 'Bạn đứng trước ga, người quen đi ngang hỏi: "Ơ, Linh. Đang làm gì ở đây thế?"', a: 4, wrong: [['ともだちに まって います。', 'tomodachi ni matte imasu.'], ['ともだちを まちましょう。', 'tomodachi o machimashou.']] },
        { sit: 'Bạn đang nghe điện thoại thì đồng nghiệp tới hỏi chuyện. Bạn nói nhỏ:', a: 5, wrong: [['いま、でんわを しましょう。', 'ima, denwa o shimashou.'], ['いま、でんわを して ください。', 'ima, denwa o shite kudasai.']] },
      ],
    },

    // ===================== Chặng 12: Trò chuyện tự nhiên =====================
    g45: {
      title: 'Thời tiết & hỏi thăm', jp: 'いい てんきですね', icon: 'cloudsun',
      goal: 'Bắt chuyện bằng thời tiết và hỏi thăm sức khoẻ như người Nhật',
      pattern: { parts: [['Thời tiết', 'a'], ['ですね', 'e', 'desu ne']], mean: 'Trời … nhỉ! (bắt chuyện, mong người nghe đồng tình)' },
      points: [
        'Bắt chuyện: <b>tính từ / danh từ thời tiết</b> + <b class="jp">ですね</b>: <span class="jp">あついですね</span> (nóng nhỉ). <span class="jp">ね</span> = "nhỉ", mời người nghe đồng tình.',
        'Người kia đồng ý: <b class="jp">そうですね</b> (đúng thế nhỉ).',
        '<b class="jp">おげんきですか</b> (bạn có khoẻ không?) dùng khi <b>lâu rồi mới gặp lại</b> — không hỏi người ngày nào cũng gặp như "How are you?".',
        'Trả lời: <span class="jp">はい、げんきです</span>; lịch sự hơn: <b class="jp">はい、おかげさまで</b> (nhờ ơn mọi người, tôi vẫn khoẻ). Nói về mình thì <b>bỏ</b> お: không nói <span class="jp">おげんきです</span>.',
      ],
      tip: 'Người Nhật rất hay mở đầu câu chuyện bằng thời tiết — <span class="jp">いい てんきですね</span>, <span class="jp">あついですね</span> gần như là một câu chào. Không cần trả lời dài: chỉ cần <b class="jp">そうですね</b> là câu chuyện đã bắt đầu rồi.',
      ex: [
        { j: 'いい |てんき|ですね。', r: 'ii|tenki|desu ne', v: 'Trời đẹp quá nhỉ.', k: 'いい天気ですね。' },
        { j: 'あつい|ですね。', r: 'atsui|desu ne', v: 'Nóng nhỉ.', k: '暑いですね。' },
        { j: 'さむい|ですね。', r: 'samui|desu ne', v: 'Lạnh nhỉ.', k: '寒いですね。' },
        { j: 'きょう|は |あめ|ですね。', r: 'kyou|wa|ame|desu ne', v: 'Hôm nay trời mưa nhỉ.', k: '今日は雨ですね。' },
        { j: 'おげんき|ですか。', r: 'ogenki|desu ka', v: 'Bạn có khoẻ không? (lâu ngày gặp lại)', k: 'お元気ですか。' },
        { j: 'はい、|げんき|です。', r: 'hai,|genki|desu', v: 'Vâng, tôi khoẻ.', k: 'はい、元気です。' },
        { j: 'はい、|おかげさまで。', r: 'hai,|okagesama de', v: 'Vâng, tôi vẫn khoẻ ạ (nhờ ơn mọi người).', k: 'はい、おかげさまで。' },
        { j: 'きのう|は |さむかった|ですね。', r: 'kinou|wa|samukatta|desu ne', v: 'Hôm qua lạnh nhỉ.', k: '昨日は寒かったですね。' },
      ],
      fill: [
        { ex: 1, tok: 1, wrong: ['ですか。', 'ました。'], why: 'Bắt chuyện, mong người nghe đồng tình → <b class="jp">ですね</b> (… nhỉ).' },
        { ex: 3, tok: 1, wrong: ['を', 'に'], why: '<b class="jp">は</b> (wa) đứng sau chủ đề: <span class="jp">きょうは</span> (hôm nay thì…).' },
        { ex: 5, tok: 1, wrong: ['おげんき', 'てんき'], why: 'Nói về mình thì bỏ お: <b class="jp">げんき</b>です. <span class="jp">おげんき</span> chỉ dùng khi hỏi người khác.' },
        { ex: 7, tok: 2, wrong: ['さむい', 'さむくない'], why: 'Hôm qua → quá khứ của tính từ い: <span class="jp">さむい</span> → <b class="jp">さむかった</b>です.' },
      ],
      talk: [
        { q: 'いい てんきですね。', qr: 'ii tenki desu ne.', qv: 'Buổi sáng gặp bác hàng xóm, bác nói: "Trời đẹp nhỉ."', a: ['そうですね。', 'sou desu ne.', 'Đúng thế nhỉ.'], wrong: [['はい、てんきです。', 'hai, tenki desu.'], ['いいえ、いい てんきです。', 'iie, ii tenki desu.']] },
        { q: 'おげんきですか。', qr: 'ogenki desu ka?', qv: 'Lâu ngày gặp lại cô giáo, cô hỏi: "Em có khoẻ không?"', a: 6, wrong: [['はい、おげんきです。', 'hai, ogenki desu.'], ['はい、いい てんきです。', 'hai, ii tenki desu.']] },
        { sit: 'Giữa tháng 8 oi bức, gặp đồng nghiệp ở cửa ra vào. Bạn bắt chuyện:', a: 1, wrong: [['さむいですね。', 'samui desu ne.'], ['あついでした。', 'atsui deshita.']] },
        { sit: 'Trời mưa từ sáng tới giờ. Gặp người quen ở hành lang, bạn nói:', a: 3, wrong: [['きょうは いい てんきですね。', 'kyou wa ii tenki desu ne.'], ['きょうは あめを ふります。', 'kyou wa ame o furimasu.']] },
      ],
    },
    g46: {
      title: 'Vì sao?', jp: 'どうして・から', icon: 'question',
      goal: 'Hỏi "tại sao?" và nói lý do với 〜から',
      pattern: { parts: [['Lý do', 'n'], ['です / ます', 'e', 'desu / masu'], ['から', 'p', 'kara']], mean: 'Vì … (nói lý do)' },
      points: [
        '<b class="jp">どうして</b> = tại sao. Hỏi ngắn: <b class="jp">どうしてですか</b> (sao vậy?).',
        'Nói lý do: câu + <b class="jp">から</b> = vì …: <span class="jp">いそがしいですから</span> (vì tôi bận).',
        'Chú ý thứ tự: <span class="jp">から</span> đứng <b>sau</b> lý do (tiếng Việt thì "vì" đứng trước). Có thể nói việc trước, rồi thêm lý do: <span class="jp">きょうは いきません。あめですから</span>.',
        '<span class="jp">から</span> này khác <span class="jp">から</span> "từ" đã học (<span class="jp">くじから</span> = từ 9 giờ): đứng sau <span class="jp">です / ます</span> thì nghĩa là "vì".',
      ],
      tip: 'Khi từ chối, người Nhật thường chỉ nói lý do rồi bỏ lửng: được rủ đi chơi mà đáp <b class="jp">あしたは しごとですから…</b> (vì mai mình đi làm…) là người nghe tự hiểu bạn không đi được — không cần nói thêm "không".',
      ex: [
        { j: 'どうして|ですか。', r: 'doushite|desu ka', v: 'Tại sao vậy?', k: 'どうしてですか。' },
        { j: 'いそがしい|です|から。', r: 'isogashii|desu|kara', v: 'Vì tôi bận.', k: '忙しいですから。' },
        { j: 'じかん|が |ありません|から。', r: 'jikan|ga|arimasen|kara', v: 'Vì tôi không có thời gian.', k: '時間がありませんから。' },
        { j: 'あたま|が |いたい|です|から。', r: 'atama|ga|itai|desu|kara', v: 'Vì tôi bị đau đầu.', k: '頭が痛いですから。' },
        { j: 'きょう|は |いきません。|あめ|です|から。', r: 'kyou|wa|ikimasen.|ame|desu|kara', v: 'Hôm nay tôi không đi. Vì trời mưa.', k: '今日は行きません。雨ですから。' },
        { j: 'どうして |にほんご|を |べんきょうして いますか。', r: 'doushite|nihongo|o|benkyou shite imasu ka', v: 'Tại sao bạn học tiếng Nhật?', k: 'どうして日本語を勉強していますか。' },
        { j: 'アニメ|が |すき|です|から。', r: 'anime|ga|suki|desu|kara', v: 'Vì tôi thích anime.', k: 'アニメが好きですから。' },
        { j: 'にほん|で |はたらきたい|です|から。', r: 'nihon|de|hatarakitai|desu|kara', v: 'Vì tôi muốn làm việc ở Nhật.', k: '日本で働きたいですから。' },
      ],
      fill: [
        { ex: 0, tok: 0, wrong: ['どこ', 'だれ'], why: 'Hỏi "tại sao" → <b class="jp">どうして</b>.' },
        { ex: 1, tok: 2, wrong: ['まで。', 'か。'], why: 'Nói lý do: … です + <b class="jp">から</b> (vì …).' },
        { ex: 4, tok: 5, wrong: ['まで。', 'に。'], why: 'Thêm lý do sau câu: <span class="jp">あめです</span> + <b class="jp">から</b> = vì trời mưa.' },
        { ex: 7, tok: 1, wrong: ['に', 'を'], why: 'Nơi làm việc → <b class="jp">で</b>: <span class="jp">にほんで はたらきます</span>.' },
      ],
      talk: [
        { q: 'どうして にほんごを べんきょうして いますか。', qr: 'doushite nihongo o benkyou shite imasu ka?', qv: 'Bạn người Nhật hỏi: "Sao bạn học tiếng Nhật thế?"', a: 6, wrong: [['アニメを すきですから。', 'anime o suki desu kara.'], ['はい、べんきょうして います。', 'hai, benkyou shite imasu.']] },
        { q: 'あした、いっしょに えいがを みませんか。', qr: 'ashita, issho ni eiga o mimasen ka?', qv: 'Bạn bè rủ: "Mai cùng đi xem phim không?" (nhưng mai bạn phải đi làm)', a: ['すみません、あしたは しごとですから…', 'sumimasen, ashita wa shigoto desu kara…', 'Xin lỗi, vì mai mình phải đi làm…'], wrong: [['いいですね。みましょう。', 'ii desu ne. mimashou.'], ['しごとですから、みましょう。', 'shigoto desu kara, mimashou.']] },
        { sit: 'Bạn bè hỏi vì sao hôm nay bạn không đi học. Bạn đang bị đau đầu, bạn nói:', a: 3, wrong: [['あたまが いたいですか。', 'atama ga itai desu ka?'], ['あたまを いたいですから。', 'atama o itai desu kara.']] },
        { sit: 'Người quen nói "Hôm nay mình không đi đâu" mà không nói lý do. Bạn hỏi:', a: 0, wrong: [['どこですか。', 'doko desu ka?'], ['いそがしいですから。', 'isogashii desu kara.']] },
      ],
    },
    g47: {
      title: 'Khi bị ốm', jp: 'ぐあいが わるいです', icon: 'heart',
      goal: 'Nói mình đau ở đâu, hỏi thăm người ốm, mua thuốc và tìm bệnh viện',
      pattern: { parts: [['Bộ phận cơ thể', 'n'], ['が', 'p', 'ga'], ['いたいです', 'e', 'itai desu']], mean: 'Bị đau ở …' },
      points: [
        'Đau ở đâu: <b>bộ phận</b> + <b class="jp">が いたいです</b> — <span class="jp">あたま</span> (đầu), <span class="jp">おなか</span> (bụng), <span class="jp">のど</span> (họng).',
        'Bị sốt: <b class="jp">ねつが あります</b> (có sốt) — dùng <span class="jp">あります</span> như với đồ vật, không dùng います.',
        'Thấy không khoẻ chung chung: <b class="jp">ぐあいが わるいです</b>. Thêm <span class="jp">ちょっと</span> cho nhẹ nhàng: <span class="jp">ちょっと ぐあいが わるいです</span>.',
        'Hỏi thăm: <b class="jp">だいじょうぶですか</b> (có sao không?). Chào người đang ốm: <b class="jp">おだいじに</b> (mau khoẻ nhé / giữ gìn sức khoẻ nhé).',
      ],
      tip: 'Vào phòng khám, bác sĩ thường hỏi <b class="jp">どう しましたか</b> (bạn bị làm sao?). Khi bạn ra về, nhân viên phòng khám hay hiệu thuốc cũng hay nói <span class="jp">おだいじに</span> — bạn chỉ cần cúi đầu cảm ơn.',
      ex: [
        { j: 'だいじょうぶ|ですか。', r: 'daijoubu|desu ka', v: 'Bạn có sao không?', k: '大丈夫ですか。' },
        { j: 'あたま|が |いたい|です。', r: 'atama|ga|itai|desu', v: 'Tôi bị đau đầu.', k: '頭が痛いです。' },
        { j: 'ねつ|が |あります。', r: 'netsu|ga|arimasu', v: 'Tôi bị sốt.', k: '熱があります。' },
        { j: 'ちょっと |ぐあい|が |わるい|です。', r: 'chotto|guai|ga|warui|desu', v: 'Tôi thấy hơi mệt trong người.', k: 'ちょっと具合が悪いです。' },
        { j: 'きのう|から |おなか|が |いたい|です。', r: 'kinou|kara|onaka|ga|itai|desu', v: 'Tôi bị đau bụng từ hôm qua.', k: '昨日からお腹が痛いです。' },
        { j: 'かぜ|の |くすり|を |ください。', r: 'kaze|no|kusuri|o|kudasai', v: 'Cho tôi thuốc cảm.', k: '風邪の薬をください。' },
        { j: 'ちかく|に |びょういん|は |ありますか。', r: 'chikaku|ni|byouin|wa|arimasu ka', v: 'Gần đây có bệnh viện không ạ?', k: '近くに病院はありますか。' },
        { j: 'おだいじに。', r: 'odaiji ni', v: 'Mau khoẻ nhé! (nói với người ốm)', k: 'お大事に。' },
      ],
      fill: [
        { ex: 1, tok: 1, wrong: ['を', 'に'], why: 'Đau chỗ nào: bộ phận + <b class="jp">が</b> いたいです.' },
        { ex: 2, tok: 2, wrong: ['います。', 'です。'], why: 'Bị sốt = "có sốt" → <span class="jp">ねつが</span> <b class="jp">あります</b>.' },
        { ex: 4, tok: 1, wrong: ['まで', 'に'], why: 'Từ hôm qua (đến giờ) → <b class="jp">から</b>: <span class="jp">きのうから</span>.' },
        { ex: 6, tok: 1, wrong: ['で', 'を'], why: 'Có ở đâu → nơi + <b class="jp">に</b> + あります: <span class="jp">ちかくに</span>.' },
      ],
      talk: [
        { q: 'リンさん、だいじょうぶですか。', qr: 'Rin-san, daijoubu desu ka?', qv: 'Thấy bạn có vẻ mệt, đồng nghiệp hỏi: "Linh, có sao không?"', a: 3, wrong: [['はい、おだいじに。', 'hai, odaiji ni.'], ['ちょっと ぐあいを わるいです。', 'chotto guai o warui desu.']] },
        { q: 'どう しましたか。', qr: 'dou shimashita ka?', qv: 'Ở phòng khám, bác sĩ hỏi: "Bạn bị làm sao?"', a: 4, wrong: [['きのうから おなかを いたいです。', 'kinou kara onaka o itai desu.'], ['おなかが いたいですか。', 'onaka ga itai desu ka?']] },
        { sit: 'Ở hiệu thuốc, bạn bị cảm và muốn mua thuốc. Bạn nói:', a: 5, wrong: [['かぜを ください。', 'kaze o kudasai.'], ['かぜの くすりが あります。', 'kaze no kusuri ga arimasu.']] },
        { sit: 'Đồng nghiệp bị sốt nên xin về sớm. Lúc họ ra về, bạn nói:', a: 7, wrong: [['おかげさまで。', 'okagesama de.'], ['いってきます。', 'itte kimasu.']] },
      ],
    },
    g48: {
      title: 'Khen & chia tay', jp: 'すごいですね！', icon: 'cheer', kind: 'phrase',
      goal: 'Khen người khác, đáp lời khen và chào tạm biệt thật tự nhiên',
      points: [
        'Khen: <b class="jp">すごいですね！</b> (tuyệt quá!), <b class="jp">〜が じょうずですね</b> (… giỏi quá!). <span class="jp">ね</span> làm lời khen nghe ấm áp hơn.',
        'Được khen: khiêm tốn <span class="jp">いいえ、まだまだです</span>, hoặc vui vẻ nhận <b class="jp">ありがとうございます。うれしいです</b> (cảm ơn, mình vui lắm). Đừng đáp <span class="jp">はい、じょうずです</span>.',
        '<b class="jp">おつかれさまでした</b>: nói với đồng nghiệp, bạn học khi xong việc hoặc lúc ra về — kiểu "mọi người vất vả rồi".',
        'Chia tay: <span class="jp">きょうは たのしかったです</span> + <span class="jp">また あいましょう</span>. Với bạn bè, đồng nghiệp thân: <b class="jp">じゃあ、また あした</b> (thân mật, không dùng với người trên).',
      ],
      tip: 'Ở chỗ làm, <span class="jp">おつかれさまです</span> được dùng như câu chào cả ngày mỗi khi gặp đồng nghiệp; lúc ra về thì nói <b class="jp">おつかれさまでした</b>. Tiễn ai về, người Nhật hay dặn <b class="jp">きを つけて</b> (đi cẩn thận nhé).',
      ex: [
        { j: 'すごい|ですね！', r: 'sugoi|desu ne', v: 'Tuyệt quá nhỉ!', k: 'すごいですね！' },
        { j: 'うた|が |じょうず|ですね。', r: 'uta|ga|jouzu|desu ne', v: 'Bạn hát hay quá!', k: '歌が上手ですね。' },
        { j: 'ありがとう|ございます。|うれしい|です。', r: 'arigatou|gozaimasu.|ureshii|desu', v: 'Cảm ơn bạn. Mình vui lắm.', k: 'ありがとうございます。嬉しいです。' },
        { j: 'おつかれさま|でした。', r: 'otsukaresama|deshita', v: 'Anh / chị vất vả rồi (chào khi xong việc).', k: 'お疲れ様でした。' },
        { j: 'きょう|は |たのしかった|です。', r: 'kyou|wa|tanoshikatta|desu', v: 'Hôm nay vui thật đấy.', k: '今日は楽しかったです。' },
        { j: 'また |あいましょう。', r: 'mata|aimashou', v: 'Hẹn gặp lại nhé.', k: 'また会いましょう。' },
        { j: 'じゃあ、|また |あした。', r: 'jaa,|mata|ashita', v: 'Thôi, mai gặp nhé. (thân mật)', k: 'じゃあ、また明日。' },
        { j: 'き|を |つけて |かえって |ください。', r: 'ki|o|tsukete|kaette|kudasai', v: 'Về cẩn thận nhé.', k: '気をつけて帰ってください。' },
      ],
      fill: [
        { ex: 1, tok: 1, wrong: ['を', 'の'], why: '<span class="jp">じょうず</span> đi với <b class="jp">が</b>: <span class="jp">うたが じょうずです</span>.' },
        { ex: 5, tok: 1, wrong: ['あいました。', 'あいません。'], why: 'Hẹn cùng làm → <b class="jp">〜ましょう</b>: <span class="jp">また あいましょう</span>.' },
        { ex: 7, tok: 1, wrong: ['が', 'に'], why: 'Câu cố định: <b class="jp">きを つけて</b> (cẩn thận) — dùng <span class="jp">を</span>.' },
      ],
      talk: [
        { q: 'リンさん、りょうりが じょうずですね！', qr: 'Rin-san, ryouri ga jouzu desu ne!', qv: 'Ăn món bạn nấu, bạn người Nhật khen: "Linh nấu ăn giỏi quá!"', a: 2, wrong: [['はい、じょうずです。', 'hai, jouzu desu.'], ['おつかれさまでした。', 'otsukaresama deshita.']] },
        { sit: 'Hết giờ làm, đồng nghiệp chào để ra về. Bạn nói:', a: 3, wrong: [['ごちそうさまでした。', 'gochisousama deshita.'], ['おはようございます。', 'ohayou gozaimasu.']] },
        { q: 'きょうは ありがとうございました。たのしかったです。', qr: 'kyou wa arigatou gozaimashita. tanoshikatta desu.', qv: 'Cuối buổi đi chơi, bạn người Nhật nói: "Hôm nay cảm ơn nhé. Vui quá."', a: ['わたしも たのしかったです。また あいましょう。', 'watashi mo tanoshikatta desu. mata aimashou.', 'Mình cũng vui lắm. Hẹn gặp lại nhé.'], wrong: [['わたしも たのしいでした。', 'watashi mo tanoshii deshita.'], ['はじめまして。', 'hajimemashite.']] },
        { sit: 'Trời đã tối, bạn tiễn khách ra cửa. Bạn dặn:', a: 7, wrong: [['また あいました。', 'mata aimashita.'], ['いってきます。', 'itte kimasu.']] },
      ],
    },
  });

  // ---------- câu mẫu thêm cho bài có sẵn (fill.ex / talk a là chỉ số trong danh sách ĐÃ NỐI: câu cũ 0–3, câu mới 4–7) ----------
  Object.assign(SJ.TALK_X, {
    g14: {
      ex: [
        { j: 'どこ|に |いきたい|ですか。', r: 'doko|ni|ikitai|desu ka', v: 'Bạn muốn đi đâu?', k: 'どこに行きたいですか。' },
        { j: 'ふじさん|に |のぼりたい|です。', r: 'Fujisan|ni|noboritai|desu', v: 'Tôi muốn leo núi Phú Sĩ.', k: '富士山に登りたいです。' },
        { j: 'つめたい |みず|を |のみたい|です。', r: 'tsumetai|mizu|o|nomitai|desu', v: 'Tôi muốn uống nước lạnh.', k: '冷たい水を飲みたいです。' },
        { j: 'ともだち|と |えいが|を |みたい|です。', r: 'tomodachi|to|eiga|o|mitai|desu', v: 'Tôi muốn xem phim với bạn.', k: '友達と映画を見たいです。' },
      ],
      fill: [
        { ex: 3, tok: 2, wrong: ['いきたい', 'いきたいじゃない'], why: 'Không muốn: たい → <b class="jp">たくない</b> (giống tính từ い): <span class="jp">いきたくない</span>です.' },
        { ex: 6, tok: 3, wrong: ['のみます', 'のみ'], why: '<span class="jp">のみます</span> → bỏ ます, thêm たい → <b class="jp">のみたい</b>です.' },
        { ex: 4, tok: 1, wrong: ['が', 'で'], why: 'Đi đến đâu → <b class="jp">に</b>: <span class="jp">どこに いきたいですか</span>.' },
      ],
      talk: [
        { q: 'にほんで どこに いきたいですか。', qr: 'nihon de doko ni ikitai desu ka?', qv: 'Ở Nhật, bạn muốn đi đâu?', a: ['きょうとに いきたいです。', 'Kyouto ni ikitai desu.', 'Mình muốn đi Kyoto.'], wrong: [['きょうとに いきました。', 'Kyouto ni ikimashita.'], ['きょうとを いきたいです。', 'Kyouto o ikitai desu.']] },
        { sit: 'Trời nóng quá, bạn khát nước. Bạn nói với bạn mình:', a: 6, wrong: [['つめたい みずを のみました。', 'tsumetai mizu o nomimashita.'], ['つめたい みずを のみますか。', 'tsumetai mizu o nomimasu ka?']] },
        { q: 'しゅうまつ、なにを したいですか。', qr: 'shuumatsu, nani o shitai desu ka?', qv: 'Cuối tuần bạn muốn làm gì?', a: 7, wrong: [['ともだちと えいがを みました。', 'tomodachi to eiga o mimashita.'], ['はい、したいです。', 'hai, shitai desu.']] },
      ],
    },
    g15: {
      ex: [
        { j: 'ちょっと |てつだって |ください。', r: 'chotto|tetsudatte|kudasai', v: 'Giúp tôi một chút với.', k: 'ちょっと手伝ってください。' },
        { j: 'ここ|に |かいて |ください。', r: 'koko|ni|kaite|kudasai', v: 'Xin viết vào đây giúp tôi.', k: 'ここに書いてください。' },
        { j: 'すみません、|しゃしん|を |とって |ください。', r: 'sumimasen,|shashin|o|totte|kudasai', v: 'Xin lỗi, chụp giúp tôi tấm ảnh với.', k: 'すみません、写真を撮ってください。' },
        { j: 'やさしい |にほんご|で |はなして |ください。', r: 'yasashii|nihongo|de|hanashite|kudasai', v: 'Xin nói bằng tiếng Nhật dễ hiểu giúp tôi.', k: 'やさしい日本語で話してください。' },
      ],
      fill: [
        { ex: 5, tok: 2, wrong: ['かきます', 'かきたい'], why: 'Nhờ ai làm gì: dạng て + ください → <b class="jp">かいて</b> ください.' },
        { ex: 7, tok: 2, wrong: ['に', 'が'], why: 'Nói bằng thứ tiếng nào → <b class="jp">で</b>: <span class="jp">にほんごで はなします</span>.' },
      ],
      talk: [
        { sit: 'Bạn muốn nhờ một người đi đường chụp ảnh cho mình trước cổng đền. Bạn đưa điện thoại và nói:', a: 6, wrong: [['すみません、しゃしんを とりましょう。', 'sumimasen, shashin o torimashou.'], ['すみません、しゃしんを ください。', 'sumimasen, shashin o kudasai.']] },
        { sit: 'Người Nhật nói một từ khó, bạn nghe mãi không ra. Bạn chìa cuốn sổ ra và nói:', a: 5, wrong: [['ここに かきます。', 'koko ni kakimasu.'], ['ここは どこですか。', 'koko wa doko desu ka?']] },
      ],
    },
    g16: {
      ex: [
        { j: 'あまい |もの|が |すき|です。', r: 'amai|mono|ga|suki|desu', v: 'Tôi thích đồ ngọt.', k: '甘いものが好きです。' },
        { j: 'どんな |おんがく|が |すき|ですか。', r: 'donna|ongaku|ga|suki|desu ka', v: 'Bạn thích thể loại nhạc nào?', k: 'どんな音楽が好きですか。' },
        { j: 'わたし|も |ねこ|が |すき|です。', r: 'watashi|mo|neko|ga|suki|desu', v: 'Tôi cũng thích mèo.', k: '私も猫が好きです。' },
        { j: 'からい |もの|は |ちょっと…', r: 'karai|mono|wa|chotto', v: 'Đồ cay thì mình hơi… (không ăn được lắm).', k: '辛いものはちょっと…' },
      ],
      fill: [
        { ex: 5, tok: 0, wrong: ['どこ', 'だれ'], why: 'Hỏi "loại nào, kiểu gì" → <b class="jp">どんな</b> + danh từ: <span class="jp">どんな おんがく</span>.' },
        { ex: 3, tok: 3, wrong: ['すき', 'すきくない'], why: '<span class="jp">あまり</span> đi với phủ định. <span class="jp">すき</span> là tính từ な → <b class="jp">すきじゃない</b> (không nói すきくない).' },
        { ex: 6, tok: 1, wrong: ['を', 'に'], why: '"Tôi cũng…" → <b class="jp">わたしも</b> (<span class="jp">も</span> = cũng).' },
      ],
      talk: [
        { q: 'どんな たべものが すきですか。', qr: 'donna tabemono ga suki desu ka?', qv: 'Bạn thích món ăn kiểu gì?', a: 4, wrong: [['あまい ものを すきです。', 'amai mono o suki desu.'], ['はい、すきです。', 'hai, suki desu.']] },
        { q: 'わたしは ねこが だいすきです。', qr: 'watashi wa neko ga daisuki desu.', qv: 'Bạn người Nhật kể: "Mình rất thích mèo." (bạn cũng vậy)', a: 6, wrong: [['わたしは ねこです。', 'watashi wa neko desu.'], ['わたしも ねこを すきです。', 'watashi mo neko o suki desu.']] },
        { q: 'からい ものは すきですか。', qr: 'karai mono wa suki desu ka?', qv: 'Bạn người Nhật hỏi: "Bạn thích đồ cay không?" (bạn không ăn cay được)', a: 7, wrong: [['いいえ、すきです。', 'iie, suki desu.'], ['はい、からいです。', 'hai, karai desu.']] },
      ],
    },
  });
})(window.SJ);
