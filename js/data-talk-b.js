/* SubelJapan — Nói & Ngữ pháp: đếm số, ở quán ăn, ở コンビニ (g24–g26) · あります, vị trí, います (g27–g29)
 * · mấy giờ, thứ mấy / でした (g30–g31) + câu thêm cho bài gốc g7 (どこ) và g8 (いくら / ください)
 */
window.SJ = window.SJ || {};
(function (SJ) {
  SJ.TALK_L = SJ.TALK_L || {};
  SJ.TALK_X = SJ.TALK_X || {};
  Object.assign(SJ.TALK_L, {
    // ---------------- Chặng 4: Số & mua sắm ----------------
    g24: {
      title: 'Đếm số', jp: 'いち・に・さん', icon: 'numbers',
      goal: 'Đếm từ 1 đến 10, ghép số tới hàng nghìn và đọc số điện thoại',
      pattern: { parts: [['よん', 't', 'yon'], ['じゅう', 't', 'juu'], ['ろく', 't', 'roku']], mean: 'Ghép như tiếng Việt "bốn · mươi · sáu" → よんじゅうろく = 46' },
      points: [
        'Số 1–10: <b class="jp">いち・に・さん・よん・ご・ろく・なな・はち・きゅう・じゅう</b>. Số 0 là <b class="jp">ゼロ</b> (hoặc <span class="jp">れい</span>).',
        'Số 4, 7, 9 còn có cách đọc khác: <span class="jp">し</span>, <span class="jp">しち</span>, <span class="jp">く</span>. Khi đếm hay đọc số điện thoại, cứ dùng <b class="jp">よん, なな, きゅう</b> cho rõ — cách kia sẽ gặp khi học nói giờ.',
        'Số 11–99 ghép y như tiếng Việt: <span class="jp">じゅう</span> + <span class="jp">いち</span> = <b class="jp">じゅういち</b> (11), <span class="jp">に</span> + <span class="jp">じゅう</span> = <b class="jp">にじゅう</b> (20), <span class="jp">にじゅうさん</span> = 23.',
        '<b class="jp">ひゃく</b> = 100, <b class="jp">せん</b> = 1.000. Vài số bị biến âm, nhớ kỹ: <b class="jp">さんびゃく</b> (300), <b class="jp">ろっぴゃく</b> (600), <b class="jp">はっぴゃく</b> (800), <b class="jp">さんぜん</b> (3.000), <b class="jp">はっせん</b> (8.000).',
        'Hỏi số: <b class="jp">なんばんですか</b> (số mấy?), <span class="jp">なんページですか</span> (trang mấy?). Đọc số điện thoại: đọc từng chữ số, dấu gạch "-" đọc là <b class="jp">の</b>.',
      ],
      tip: 'Nhiều bệnh viện, khách sạn ở Nhật bỏ qua phòng số 4 và 9, vì <span class="jp">し</span> (4) đọc giống chữ "chết", <span class="jp">く</span> (9) đọc giống chữ "khổ". Khi đọc số điện thoại, người Nhật hay kéo dài <span class="jp">に</span> thành <span class="jp">にー</span>, <span class="jp">ご</span> thành <span class="jp">ごー</span> cho dễ nghe.',
      ex: [
        { j: 'いち、|に、|さん、|よん、|ご。', r: 'ichi,|ni,|san,|yon,|go', v: 'Một, hai, ba, bốn, năm.', k: '1、2、3、4、5。' },
        { j: 'ろく、|なな、|はち、|きゅう、|じゅう。', r: 'roku,|nana,|hachi,|kyuu,|juu', v: 'Sáu, bảy, tám, chín, mười.', k: '6、7、8、9、10。' },
        { j: 'なん|ページ|ですか。', r: 'nan|peeji|desu ka', v: 'Trang mấy ạ?', k: '何ページですか。' },
        { j: 'にじゅうさん|ページ|です。', r: 'nijuusan|peeji|desu', v: 'Trang 23.', k: '23ページです。' },
        { j: 'ひゃく、|にひゃく、|さんびゃく。', r: 'hyaku,|nihyaku,|sanbyaku', v: '100, 200, 300.', k: '100、200、300。' },
        { j: 'せん、|にせん、|さんぜん。', r: 'sen,|nisen,|sanzen', v: '1.000, 2.000, 3.000.', k: '1000、2000、3000。' },
        { j: 'でんわばんごう|は |なんばん|ですか。', r: 'denwa bangou|wa|nanban|desu ka', v: 'Số điện thoại của bạn là số mấy?', k: '電話番号は何番ですか。' },
        { j: 'ゼロきゅうゼロ|の |いちにさんよん|の |ごろくななはち|です。', r: 'zero kyuu zero|no|ichi ni san yon|no|go roku nana hachi|desu', v: 'Số của tôi là 090-1234-5678.', k: '090の1234の5678です。' },
      ],
      fill: [
        { ex: 3, tok: 0, wrong: ['さんじゅうに', 'にさん'], why: '23 = <b class="jp">に</b> (2) + <b class="jp">じゅう</b> (10) + <b class="jp">さん</b> (3) — ghép y như "hai mươi ba".' },
        { ex: 4, tok: 2, wrong: ['さんひゃく。', 'さんぴゃく。'], why: '300 bị biến âm: さん<b class="jp">びゃく</b> (sanbyaku).' },
        { ex: 5, tok: 2, wrong: ['さんせん。', 'さんびゃく。'], why: '3.000 bị biến âm: さん<b class="jp">ぜん</b> (sanzen). <span class="jp">さんびゃく</span> là 300.' },
        { ex: 7, tok: 1, wrong: ['は', 'も'], why: 'Đọc số điện thoại, dấu gạch "-" đọc là <b class="jp">の</b>.' },
      ],
      talk: [
        { q: 'なんページですか。', qr: 'nan peeji desu ka?', qv: 'Bạn ngồi cạnh hỏi: "Trang mấy vậy?" — sách đang mở ở trang 46.', a: ['よんじゅうろくページです。', 'yonjuuroku peeji desu.', 'Trang 46.'], wrong: [['ろくじゅうよんページです。', 'rokujuuyon peeji desu.'], ['よんろくページです。', 'yonroku peeji desu.']] },
        { q: 'でんわばんごうは なんばんですか。', qr: 'denwa bangou wa nanban desu ka?', qv: 'Nhân viên làm thẻ hỏi: "Số điện thoại của bạn là số mấy?"', a: 7, wrong: [['でんわばんごうです。', 'denwa bangou desu.'], ['はい、そうです。', 'hai, sou desu.']] },
        { sit: 'Cô giáo chỉ vào số 800 trên bảng. Bạn đọc to:', a: ['はっぴゃく。', 'happyaku.', '800.'], wrong: [['はちひゃく。', 'hachihyaku.'], ['はっせん。', 'hassen.']] },
        { sit: 'Bạn đọc số 18 cho bạn người Nhật nghe:', a: ['じゅうはち。', 'juuhachi.', '18.'], wrong: [['はちじゅう。', 'hachijuu.'], ['いちはち。', 'ichihachi.']] },
      ],
    },
    g25: {
      title: 'Ở quán ăn', jp: 'レストラン', icon: 'chef',
      goal: 'Nói số người, gọi món, xin nước và tính tiền ở quán ăn',
      pattern: { parts: [['Món / thứ cần', 'n'], ['を', 'p', 'o'], ['おねがいします', 'e', 'onegaishimasu']], mean: 'Cho tôi … / Làm ơn … (lịch sự, dùng ở quán, cửa hàng)' },
      points: [
        'Vào quán, nhân viên chào <b class="jp">いらっしゃいませ</b> rồi hỏi <b class="jp">なんめいさまですか</b> (quý khách đi mấy người?). Đếm người: <b class="jp">ひとり</b> (1), <b class="jp">ふたり</b> (2), <span class="jp">さんにん</span> (3), <span class="jp">よにん</span> (4).',
        '<b class="jp">〜を おねがいします</b> nghĩa giống <span class="jp">〜を ください</span> (cho tôi …) nhưng nghe mềm và lịch sự hơn: <span class="jp">メニューを おねがいします</span>.',
        'Gọi nhân viên: giơ tay và nói <b class="jp">すみません！</b> Khi nói nhanh, người Nhật hay bỏ <span class="jp">を</span>: <span class="jp">おかいけい おねがいします</span> (cho tôi tính tiền).',
        '<span class="jp">おすすめ</span> = món quán gợi ý. Nước lọc thì người Nhật hầu như luôn nói <b class="jp">おみず</b> (thêm <span class="jp">お</span> cho lịch sự).',
        '<b class="jp">ごちそうさまでした</b>: nói khi ăn xong và lúc ra về. <span class="jp">でした</span> là quá khứ của です — câu cố định, cứ học thuộc.',
      ],
      tip: 'Ở Nhật không có lệ để tiền boa — để lại tiền thừa còn làm nhân viên khó xử. Nhiều quán mang nước lọc và khăn ướt (<span class="jp">おしぼり</span>) ra miễn phí, và thường trả tiền ở quầy (<span class="jp">レジ</span>) gần cửa chứ không trả tại bàn.',
      ex: [
        { j: 'ふたり|です。', r: 'futari|desu', v: 'Hai người ạ.', k: '2人です。' },
        { j: 'ひとり|です。', r: 'hitori|desu', v: 'Một người ạ.', k: '1人です。' },
        { j: 'メニュー|を |おねがい|します。', r: 'menyuu|o|onegai|shimasu', v: 'Cho tôi xem thực đơn với ạ.', k: 'メニューをお願いします。' },
        { j: 'おすすめ|は |なん|ですか。', r: 'osusume|wa|nan|desu ka', v: 'Quán gợi ý món nào ạ?', k: 'おすすめは何ですか。' },
        { j: 'じゃあ、|これ|を |ください。', r: 'jaa,|kore|o|kudasai', v: 'Vậy cho tôi món này.', k: 'じゃあ、これをください。' },
        { j: 'すみません、|おみず|を |ください。', r: 'sumimasen,|omizu|o|kudasai', v: 'Xin lỗi, cho tôi xin nước lọc.', k: 'すみません、お水をください。' },
        { j: 'すみません、|おかいけい |おねがい|します。', r: 'sumimasen,|okaikei|onegai|shimasu', v: 'Xin lỗi, cho tôi tính tiền.', k: 'すみません、お会計お願いします。' },
        { j: 'ごちそうさま|でした。', r: 'gochisousama|deshita', v: 'Cảm ơn vì bữa ăn (nói khi ăn xong, lúc ra về).', k: 'ごちそうさまでした。' },
      ],
      fill: [
        { ex: 0, tok: 0, wrong: ['ふたつ', 'ににん'], why: 'Đếm người: <span class="jp">ひとり</span> (1 người), <b class="jp">ふたり</b> (2 người). <span class="jp">ふたつ</span> là 2 cái (đồ vật).' },
        { ex: 2, tok: 1, wrong: ['は', 'の'], why: 'Thứ mình cần + <b class="jp">を</b> + おねがいします.' },
        { ex: 3, tok: 1, wrong: ['を', 'の'], why: '<b class="jp">は</b> (wa) nêu chủ đề: "món gợi ý thì là món gì?"' },
        { ex: 6, tok: 1, wrong: ['おすすめ', 'メニュー'], why: 'Tính tiền → <b class="jp">おかいけい</b>.' },
      ],
      talk: [
        { q: 'いらっしゃいませ。なんめいさまですか。', qr: 'irasshaimase. nanmei-sama desu ka?', qv: 'Nhân viên: "Xin mời quý khách. Quý khách đi mấy người ạ?" — bạn đi cùng một người bạn.', a: 0, wrong: [['ふたつ ください。', 'futatsu kudasai.'], ['ににんです。', 'ninin desu.']] },
        { q: 'ごちゅうもんは おきまりですか。', qr: 'gochuumon wa okimari desu ka?', qv: 'Nhân viên hỏi: "Quý khách chọn món xong chưa ạ?" — bạn chỉ vào một món trên thực đơn.', a: 4, wrong: [['これは わたしのです。', 'kore wa watashi no desu.'], ['いただきます。', 'itadakimasu.']] },
        { sit: 'Ăn xong, bạn muốn trả tiền. Bạn giơ tay gọi nhân viên:', a: 6, wrong: [['メニューを おねがいします。', 'menyuu o onegaishimasu.'], ['いただきます。', 'itadakimasu.']] },
        { sit: 'Trả tiền xong, lúc ra về bạn nói với nhân viên:', a: 7, wrong: [['いらっしゃいませ。', 'irasshaimase.'], ['おかいけい おねがいします。', 'okaikei onegaishimasu.']] },
      ],
    },
    g26: {
      title: 'Ở cửa hàng tiện lợi', jp: 'コンビニ', icon: 'cart', kind: 'phrase',
      goal: 'Nhận ra câu nhân viên コンビニ hay hỏi và đáp lại tự nhiên',
      points: [
        'Nhân viên コンビニ nói rất nhanh và rất lễ phép. Không cần hiểu hết — chỉ cần bắt từ khoá: <span class="jp">ふくろ</span> (túi), <span class="jp">あたため</span> (hâm nóng), <span class="jp">ポイントカード</span> (thẻ tích điểm), <span class="jp">おはし</span> (đũa).',
        'Muốn: <b class="jp">はい、おねがいします</b>. Không cần: <b class="jp">だいじょうぶです</b> (nhẹ nhàng, dùng nhiều nhất) hoặc <b class="jp">いいえ、けっこうです</b> (lịch sự, hơi trang trọng).',
        'Trả tiền: <b class="jp">カードで おねがいします</b> (bằng thẻ), <span class="jp">げんきんで</span> (bằng tiền mặt). <span class="jp">で</span> = bằng — sẽ học kỹ ở bài sau, giờ cứ học thuộc cả câu.',
        'Nhớ lại <b class="jp">も</b> (cũng, cả): <span class="jp">おはしも おねがいします</span> = cho tôi cả đũa nữa. Mua đồ nóng ở quầy: <span class="jp">〜を ひとつ ください</span>.',
      ],
      tip: 'Từ năm 2020, túi nilon ở Nhật phải trả tiền (vài yên), nên nhân viên luôn hỏi bạn có lấy túi không. Nếu không lấy, họ thường dán một miếng băng dính nhỏ (<span class="jp">シール</span>) lên món hàng để đánh dấu là đã trả tiền.',
      ex: [
        { j: 'はい、|おねがい|します。', r: 'hai,|onegai|shimasu', v: 'Vâng, nhờ bạn ạ.', k: 'はい、お願いします。' },
        { j: 'だいじょうぶ|です。', r: 'daijoubu|desu', v: 'Dạ thôi, không cần đâu ạ.', k: '大丈夫です。' },
        { j: 'いいえ、|けっこう|です。', r: 'iie,|kekkou|desu', v: 'Không, cảm ơn (tôi không cần).', k: 'いいえ、結構です。' },
        { j: 'ふくろ、|おねがい|します。', r: 'fukuro,|onegai|shimasu', v: 'Cho tôi một cái túi nhé.', k: '袋、お願いします。' },
        { j: 'カード|で |おねがい|します。', r: 'kaado|de|onegai|shimasu', v: 'Tôi trả bằng thẻ.', k: 'カードでお願いします。' },
        { j: 'レシート|は |だいじょうぶ|です。', r: 'reshiito|wa|daijoubu|desu', v: 'Hoá đơn thì không cần đâu ạ.', k: 'レシートは大丈夫です。' },
        { j: 'あ、|おはし|も |おねがい|します。', r: 'a,|ohashi|mo|onegai|shimasu', v: 'À, cho tôi xin cả đũa nữa.', k: 'あ、お箸もお願いします。' },
        { j: 'すみません、|にくまん|を |ひとつ |ください。', r: 'sumimasen,|nikuman|o|hitotsu|kudasai', v: 'Xin lỗi, cho tôi một cái bánh bao nhân thịt.', k: 'すみません、肉まんを1つください。' },
      ],
      fill: [
        { ex: 4, tok: 1, wrong: ['を', 'は'], why: 'Trả <b>bằng</b> gì → <b class="jp">で</b>: カード<b class="jp">で</b> (bằng thẻ).' },
        { ex: 5, tok: 1, wrong: ['を', 'の'], why: '<b class="jp">は</b> (wa) nêu ra thứ mình đang nói tới: "hoá đơn thì… không cần".' },
        { ex: 6, tok: 2, wrong: ['の', 'が'], why: '<b class="jp">も</b> = cũng, cả: "cho tôi <b>cả</b> đũa nữa".' },
        { ex: 7, tok: 3, wrong: ['ひとり', 'いち'], why: 'Đếm đồ vật: <b class="jp">ひとつ</b> (1 cái). <span class="jp">ひとり</span> là 1 người.' },
      ],
      talk: [
        { q: 'おべんとう、あたためますか。', qr: 'obentou, atatamemasu ka?', qv: 'Bạn mua cơm hộp. Nhân viên hỏi: "Cơm hộp có cần hâm nóng không ạ?" — bạn muốn ăn nóng.', a: 0, wrong: [['あたためます。', 'atatamemasu.'], 2] },
        { q: 'レジぶくろは ごりようですか。', qr: 'rejibukuro wa goriyou desu ka?', qv: 'Nhân viên hỏi: "Quý khách có lấy túi không ạ?" — bạn mang túi riêng rồi.', a: 1, wrong: [0, ['ふくろです。', 'fukuro desu.']] },
        { q: 'ポイントカードは おもちですか。', qr: 'pointo kaado wa omochi desu ka?', qv: 'Nhân viên hỏi: "Quý khách có thẻ tích điểm không ạ?" — bạn không có.', a: ['いいえ、だいじょうぶです。', 'iie, daijoubu desu.', 'Dạ không, không cần đâu ạ.'], wrong: [4, 0] },
        { q: 'おはしは おつけしますか。', qr: 'ohashi wa otsuke shimasu ka?', qv: 'Nhân viên hỏi: "Quý khách có lấy đũa không ạ?" — bạn mang về nhà ăn, ở nhà có đũa rồi.', a: 2, wrong: [6, ['はい、おはしです。', 'hai, ohashi desu.']] },
      ],
    },

    // ---------------- Chặng 5: Nơi chốn ----------------
    g27: {
      title: 'Có … không?', jp: 'あります', icon: 'compass',
      goal: 'Hỏi có hay không và hỏi đồ vật, nơi chốn ở đâu với あります',
      pattern: { parts: [['Nơi', 'n'], ['に', 'p', 'ni'], ['Đồ vật', 'n'], ['が', 'p', 'ga'], ['あります', 'e', 'arimasu']], mean: 'Ở (nơi) có (đồ vật, cây cối, toà nhà)' },
      points: [
        '<b class="jp">あります</b> = có (đồ vật, cây cối, toà nhà, cửa hàng). Không có: <b class="jp">ありません</b>. Hỏi: <b class="jp">ありますか</b>.',
        'Ở đâu có cái gì: <b>Nơi</b> + <b class="jp">に</b> + <b>Vật</b> + <b class="jp">が</b> + あります. <span class="jp">に</span> = ở (chỉ chỗ), <span class="jp">が</span> đứng sau thứ "có".',
        'Hỏi một thứ nằm ở đâu: <b>Vật</b> + <b class="jp">は どこに ありますか</b>. Đáp: <span class="jp">にかいに あります</span> (ở tầng 2), <span class="jp">えきの まえに あります</span> (ở trước ga — <span class="jp">まえ</span> = trước, học thêm ở bài sau).',
        'Chú ý: <span class="jp">あります</span> chỉ dùng cho thứ <b>không tự cử động</b>. Người và con vật dùng <span class="jp">います</span> — học ở bài sau.',
      ],
      tip: 'Ở Nhật, nhà vệ sinh ở ga tàu, công viên và nhiều cửa hàng tiện lợi cho dùng miễn phí. Muốn mượn nhà vệ sinh ở コンビニ, người Nhật thường hỏi nhân viên một câu <b class="jp">トイレ、ありますか？</b> cho lịch sự.',
      ex: [
        { j: 'トイレ|は |ありますか。', r: 'toire|wa|arimasu ka', v: 'Ở đây có nhà vệ sinh không ạ?', k: 'トイレはありますか。' },
        { j: 'はい、|あります。', r: 'hai,|arimasu', v: 'Vâng, có ạ.', k: 'はい、あります。' },
        { j: 'いいえ、|ありません。', r: 'iie,|arimasen', v: 'Không, không có ạ.', k: 'いいえ、ありません。' },
        { j: 'この |ちかく|に |コンビニ|が |ありますか。', r: 'kono|chikaku|ni|konbini|ga|arimasu ka', v: 'Gần đây có cửa hàng tiện lợi không ạ?', k: 'この近くにコンビニがありますか。' },
        { j: 'えき|の |まえ|に |あります。', r: 'eki|no|mae|ni|arimasu', v: 'Có, ở trước nhà ga ấy.', k: '駅の前にあります。' },
        { j: 'トイレ|は |どこ|に |ありますか。', r: 'toire|wa|doko|ni|arimasu ka', v: 'Nhà vệ sinh ở chỗ nào ạ?', k: 'トイレはどこにありますか。' },
        { j: 'にかい|に |あります。', r: 'nikai|ni|arimasu', v: 'Ở tầng 2 ạ.', k: '2階にあります。' },
        { j: 'うち|の |ちかく|に |こうえんが |あります。', r: 'uchi|no|chikaku|ni|kouen ga|arimasu', v: 'Gần nhà tôi có một công viên.', k: 'うちの近くに公園があります。' },
      ],
      fill: [
        { ex: 3, tok: 2, wrong: ['を', 'が'], why: 'Chỗ có đồ vật → <b class="jp">に</b> (ở): ちかく<b class="jp">に</b> = ở gần đây.' },
        { ex: 3, tok: 4, wrong: ['を', 'に'], why: 'Thứ "có" đi với <b class="jp">が</b>: コンビニ<b class="jp">が</b> あります.' },
        { ex: 2, tok: 1, wrong: ['あります。', 'じゃありません。'], why: 'Không có → <b class="jp">ありません</b>. (<span class="jp">じゃありません</span> = "không phải là", nghĩa khác hẳn.)' },
        { ex: 5, tok: 3, wrong: ['が', 'を'], why: 'Hỏi vị trí: どこ<b class="jp">に</b> ありますか = có ở đâu?' },
      ],
      talk: [
        { q: 'この ちかくに コンビニが ありますか。', qr: 'kono chikaku ni konbini ga arimasu ka?', qv: 'Một du khách hỏi bạn: "Gần đây có cửa hàng tiện lợi không?" — có một cái ở trước nhà ga.', a: 4, wrong: [['はい、コンビニです。', 'hai, konbini desu.'], ['えきの まえに います。', 'eki no mae ni imasu.']] },
        { q: 'すみません、トイレは どこに ありますか。', qr: 'sumimasen, toire wa doko ni arimasu ka?', qv: 'Bạn làm thêm ở siêu thị. Khách hỏi: "Xin lỗi, nhà vệ sinh ở đâu ạ?" — nó ở tầng 2.', a: 6, wrong: [['はい、あります。', 'hai, arimasu.'], ['にかいが あります。', 'nikai ga arimasu.']] },
        { sit: 'Bạn vào một quán cà phê và muốn hỏi quán có nhà vệ sinh không:', a: 0, wrong: [['トイレを ください。', 'toire o kudasai.'], ['トイレは なんですか。', 'toire wa nan desu ka?']] },
        { q: 'しつもんは ありますか。', qr: 'shitsumon wa arimasu ka?', qv: 'Cuối giờ, cô giáo hỏi: "Có câu hỏi nào không?" — bạn hiểu hết rồi.', a: 2, wrong: [['いいえ、じゃありません。', 'iie, ja arimasen.'], ['はい、ありません。', 'hai, arimasen.']] },
      ],
    },
    g28: {
      title: 'Trên, dưới, trong, cạnh', jp: 'うえ・した・なか', icon: 'bag',
      goal: 'Nói vị trí đồ vật: trên, dưới, trong, trước, sau, bên cạnh',
      pattern: { parts: [['Vật mốc', 'n'], ['の', 'p', 'no'], ['うえ / した / なか…', 't', 'ue / shita / naka'], ['に', 'p', 'ni'], ['Vật', 'n'], ['が', 'p', 'ga'], ['あります', 'e', 'arimasu']], mean: 'Trên / dưới / trong … (vật mốc) có (vật) — từ chỉ vị trí đứng SAU の' },
      points: [
        'Từ chỉ vị trí: <b class="jp">うえ</b> (trên), <b class="jp">した</b> (dưới), <b class="jp">なか</b> (trong), <b class="jp">まえ</b> (trước), <b class="jp">うしろ</b> (sau), <b class="jp">となり</b> (bên cạnh).',
        'Thứ tự <b>ngược tiếng Việt</b>: vật mốc + <b class="jp">の</b> + vị trí. "Trên bàn" = <span class="jp">つくえの うえ</span> (bàn の trên).',
        'Nói "có ở đó": vị trí + <b class="jp">に</b> + あります. Trên bàn có sách: <span class="jp">つくえの うえに ほんが あります</span>.',
        'Trả lời ngắn "nó ở đâu?" thì thay <span class="jp">に あります</span> bằng <b class="jp">です</b>: <span class="jp">かばんの なかです</span> (ở trong cặp).',
      ],
      tip: 'Lạc đường hay đánh rơi đồ, người Nhật tìm đến <b class="jp">こうばん</b> — trạm cảnh sát nhỏ, thường có ngay gần ga. Đồ đánh rơi ở Nhật rất hay được người nhặt mang tới nộp ở đó.',
      ex: [
        { j: 'つくえ|の |うえ|です。', r: 'tsukue|no|ue|desu', v: 'Ở trên bàn ấy.', k: '机の上です。' },
        { j: 'かばん|の |なか|です。', r: 'kaban|no|naka|desu', v: 'Ở trong cặp ấy.', k: 'かばんの中です。' },
        { j: 'いす|の |した|に |あります。', r: 'isu|no|shita|ni|arimasu', v: 'Nó ở dưới ghế.', k: '椅子の下にあります。' },
        { j: 'ぎんこう|の |となり|に |あります。', r: 'ginkou|no|tonari|ni|arimasu', v: 'Nó ở ngay cạnh ngân hàng.', k: '銀行の隣にあります。' },
        { j: 'こうばん|は |えき|の |まえ|です。', r: 'kouban|wa|eki|no|mae|desu', v: 'Đồn cảnh sát ở trước nhà ga.', k: '交番は駅の前です。' },
        { j: 'つくえ|の |うえ|に |ほんが |あります。', r: 'tsukue|no|ue|ni|hon ga|arimasu', v: 'Trên bàn có quyển sách.', k: '机の上に本があります。' },
        { j: 'かばん|の |なか|に |さいふが |あります。', r: 'kaban|no|naka|ni|saifu ga|arimasu', v: 'Trong cặp có cái ví.', k: 'かばんの中に財布があります。' },
        { j: 'れいぞうこ|の |なか|に |なにが |ありますか。', r: 'reizouko|no|naka|ni|nani ga|arimasu ka', v: 'Trong tủ lạnh có gì vậy?', k: '冷蔵庫の中に何がありますか。' },
      ],
      fill: [
        { ex: 0, tok: 1, wrong: ['は', 'に'], why: 'Nối vật mốc với vị trí bằng <b class="jp">の</b>: つくえ<b class="jp">の</b> うえ = trên bàn.' },
        { ex: 2, tok: 2, wrong: ['うえ', 'なか'], why: 'Dưới → <b class="jp">した</b>. (<span class="jp">うえ</span> = trên, <span class="jp">なか</span> = trong)' },
        { ex: 3, tok: 3, wrong: ['が', 'を'], why: 'Vị trí + <b class="jp">に</b> あります: となり<b class="jp">に</b> = ở bên cạnh.' },
        { ex: 4, tok: 4, wrong: ['うしろ', 'となり'], why: 'Trước → <b class="jp">まえ</b>. (<span class="jp">うしろ</span> = sau, <span class="jp">となり</span> = bên cạnh)' },
      ],
      talk: [
        { q: 'わたしの スマホは どこですか。', qr: 'watashi no sumaho wa doko desu ka?', qv: 'Bạn cùng phòng hỏi: "Điện thoại của mình đâu nhỉ?" — điện thoại đang nằm trên bàn.', a: 0, wrong: [['うえの つくえです。', 'ue no tsukue desu.'], ['つくえは うえです。', 'tsukue wa ue desu.']] },
        { q: 'すみません、コンビニは どこに ありますか。', qr: 'sumimasen, konbini wa doko ni arimasu ka?', qv: 'Người đi đường hỏi: "Xin lỗi, cửa hàng tiện lợi ở đâu ạ?" — nó ở ngay cạnh ngân hàng.', a: 3, wrong: [['となりの ぎんこうに あります。', 'tonari no ginkou ni arimasu.'], ['ぎんこうの となりに います。', 'ginkou no tonari ni imasu.']] },
        { q: 'かばんの なかに なにが ありますか。', qr: 'kaban no naka ni nani ga arimasu ka?', qv: 'Bạn bè tò mò hỏi: "Trong cặp cậu có gì thế?" — trong cặp có cái ví.', a: 6, wrong: [['さいふの なかに かばんが あります。', 'saifu no naka ni kaban ga arimasu.'], ['はい、あります。', 'hai, arimasu.']] },
        { q: 'こうばんは どこですか。', qr: 'kouban wa doko desu ka?', qv: 'Một du khách hỏi: "Đồn cảnh sát ở đâu ạ?" — nó ở ngay trước nhà ga.', a: 4, wrong: [['こうばんは えきの うしろです。', 'kouban wa eki no ushiro desu.'], ['こうばんは まえの えきです。', 'kouban wa mae no eki desu.']] },
      ],
    },
    g29: {
      title: 'Có ai / con gì?', jp: 'います', icon: 'cat',
      goal: 'Nói có người, con vật ở đâu với います và kể về anh chị em',
      pattern: { parts: [['Nơi', 'n'], ['に', 'p', 'ni'], ['Người / con vật', 'n'], ['が', 'p', 'ga'], ['います', 'e', 'imasu']], mean: 'Ở (nơi) có (người, con vật)' },
      points: [
        '<b class="jp">います</b> = có (người, con vật — những thứ tự cử động được). Đồ vật, cây cối vẫn dùng <span class="jp">あります</span>.',
        'Mẫu câu giống hệt あります: <b>Nơi</b> + <b class="jp">に</b> + <b>Người / con vật</b> + <b class="jp">が</b> + います. Phủ định: <b class="jp">いません</b>.',
        'Hỏi ai ở đâu: <span class="jp">せんせいは どこに いますか</span>. Không có ai cả: <b class="jp">だれも いません</b> (<span class="jp">だれ</span> + <span class="jp">も</span> + phủ định).',
        'Kể về gia đình: <span class="jp">いもうとが ひとり います</span> (tôi có 1 em gái) — số người đứng ngay trước います. Nói về nhà mình: <span class="jp">あに</span> (anh trai), <span class="jp">あね</span> (chị gái), <span class="jp">おとうと</span> (em trai), <span class="jp">いもうと</span> (em gái).',
      ],
      tip: 'Hỏi về gia đình người khác, người Nhật dùng từ lịch sự hơn: <b class="jp">ごきょうだい</b>, <span class="jp">いもうとさん</span>, <span class="jp">おにいさん</span>; còn nói về nhà mình thì dùng từ khiêm tốn <span class="jp">いもうと</span>, <span class="jp">あに</span>. Con một thì nói <b class="jp">ひとりっこです</b>.',
      ex: [
        { j: 'ねこ|が |います。', r: 'neko|ga|imasu', v: 'Có con mèo kìa.', k: '猫がいます。' },
        { j: 'きょうだい|は |いますか。', r: 'kyoudai|wa|imasu ka', v: 'Bạn có anh chị em không?', k: '兄弟はいますか。' },
        { j: 'いいえ、|いません。', r: 'iie,|imasen', v: 'Không, tôi không có.', k: 'いいえ、いません。' },
        { j: 'いもうと|が |ひとり |います。', r: 'imouto|ga|hitori|imasu', v: 'Tôi có một em gái.', k: '妹が1人います。' },
        { j: 'きょうしつ|に |せんせい|が |います。', r: 'kyoushitsu|ni|sensei|ga|imasu', v: 'Trong lớp có thầy cô giáo.', k: '教室に先生がいます。' },
        { j: 'いす|の |した|に |ねこが |います。', r: 'isu|no|shita|ni|neko ga|imasu', v: 'Dưới ghế có con mèo.', k: '椅子の下に猫がいます。' },
        { j: 'せんせい|は |どこ|に |いますか。', r: 'sensei|wa|doko|ni|imasu ka', v: 'Thầy cô đang ở đâu ạ?', k: '先生はどこにいますか。' },
        { j: 'へや|に |だれも |いません。', r: 'heya|ni|daremo|imasen', v: 'Trong phòng không có ai cả.', k: '部屋に誰もいません。' },
      ],
      fill: [
        { ex: 0, tok: 2, wrong: ['あります。', 'です。'], why: 'Con vật, người → <b class="jp">います</b>. (<span class="jp">あります</span> dùng cho đồ vật)' },
        { ex: 4, tok: 1, wrong: ['を', 'が'], why: 'Nơi có người → <b class="jp">に</b>: きょうしつ<b class="jp">に</b> = ở trong lớp.' },
        { ex: 3, tok: 1, wrong: ['を', 'の'], why: 'Người / con vật "có" → <b class="jp">が</b> います.' },
        { ex: 7, tok: 3, wrong: ['います。', 'ありません。'], why: '<span class="jp">だれも</span> + phủ định: だれも <b class="jp">いません</b> = không có ai cả.' },
      ],
      talk: [
        { q: 'ごきょうだいは いますか。', qr: 'gokyoudai wa imasu ka?', qv: 'Người mới quen hỏi: "Bạn có anh chị em không?" — bạn có một em gái.', a: 3, wrong: [['はい、いもうとが ひとり あります。', 'hai, imouto ga hitori arimasu.'], ['はい、いもうとが ひとつ います。', 'hai, imouto ga hitotsu imasu.']] },
        { q: 'せんせいは どこに いますか。', qr: 'sensei wa doko ni imasu ka?', qv: 'Bạn học hỏi: "Cô giáo đang ở đâu thế?" — cô đang ở trong lớp.', a: ['きょうしつに います。', 'kyoushitsu ni imasu.', 'Cô ở trong lớp học.'], wrong: [['きょうしつに あります。', 'kyoushitsu ni arimasu.'], ['きょうしつが います。', 'kyoushitsu ga imasu.']] },
        { q: 'きょうしつに だれが いますか。', qr: 'kyoushitsu ni dare ga imasu ka?', qv: 'Bạn của bạn hỏi: "Trong lớp có ai không?" — bạn nhìn vào, lớp trống trơn.', a: ['だれも いません。', 'daremo imasen.', 'Không có ai cả.'], wrong: [['だれも います。', 'daremo imasu.'], ['だれも ありません。', 'daremo arimasen.']] },
        { sit: 'Bạn thấy một con mèo đang nằm dưới ghế, bạn chỉ cho bạn mình:', a: 5, wrong: [['いすの したに ねこが あります。', 'isu no shita ni neko ga arimasu.'], ['ねこの したに いすが います。', 'neko no shita ni isu ga imasu.']] },
      ],
    },

    // ---------------- Chặng 6: Thời gian ----------------
    g30: {
      title: 'Mấy giờ rồi?', jp: 'なんじ？', icon: 'clock',
      goal: 'Hỏi và nói giờ: giờ rưỡi, đúng giờ, sáng / chiều',
      pattern: { parts: [['ごぜん / ごご', 't', 'gozen / gogo'], ['Số', 'n'], ['じ', 't', 'ji'], ['はん', 't', 'han'], ['です', 'e', 'desu']], mean: '(Sáng / chiều) … giờ (rưỡi)' },
      points: [
        'Giờ = số + <b class="jp">じ</b>: <span class="jp">いちじ</span> (1 giờ), <span class="jp">にじ</span>, <span class="jp">さんじ</span>… Hỏi: <b class="jp">いま なんじですか</b> (bây giờ mấy giờ?).',
        'Ba giờ đọc đặc biệt, nhớ kỹ: <b class="jp">よじ</b> (4 giờ), <b class="jp">しちじ</b> (7 giờ), <b class="jp">くじ</b> (9 giờ). 7 giờ đôi khi cũng nói <span class="jp">ななじ</span> cho khỏi nhầm với <span class="jp">いちじ</span>.',
        'Rưỡi: thêm <b class="jp">はん</b> sau giờ: <span class="jp">しちじはん</span> (7 giờ rưỡi). Đúng giờ: <b class="jp">ちょうど</b> đứng trước: <span class="jp">ちょうど じゅうにじ</span>.',
        'Sáng / chiều đứng <b>trước</b> giờ: <b class="jp">ごぜん</b> (buổi sáng, trước 12 giờ trưa), <b class="jp">ごご</b> (buổi chiều / tối, sau 12 giờ trưa): <span class="jp">ごご さんじ</span> = 3 giờ chiều.',
      ],
      tip: 'Tàu điện ở Nhật chạy đúng tới từng phút, nên người Nhật rất coi trọng giờ hẹn — thường đến sớm khoảng 5 phút. Lịch tàu, giờ mở cửa hay ghi kiểu 24 giờ: <span class="jp">じゅうしちじ</span> (17 giờ) = <span class="jp">ごご ごじ</span>.',
      ex: [
        { j: 'いま、|なんじ|ですか。', r: 'ima,|nanji|desu ka', v: 'Bây giờ là mấy giờ?', k: '今、何時ですか。' },
        { j: 'くじ|です。', r: 'kuji|desu', v: '9 giờ.', k: '9時です。' },
        { j: 'よじ|です。', r: 'yoji|desu', v: '4 giờ.', k: '4時です。' },
        { j: 'しちじ|はん|です。', r: 'shichiji|han|desu', v: '7 giờ rưỡi.', k: '7時半です。' },
        { j: 'ちょうど |じゅうにじ|です。', r: 'choudo|juuniji|desu', v: 'Đúng 12 giờ.', k: 'ちょうど12時です。' },
        { j: 'ごご |さんじ|です。', r: 'gogo|sanji|desu', v: '3 giờ chiều.', k: '午後3時です。' },
        { j: 'ごぜん |じゅうじ|はん|です。', r: 'gozen|juuji|han|desu', v: '10 giờ rưỡi sáng.', k: '午前10時半です。' },
        { j: 'ベトナム|は |いま |なんじ|ですか。', r: 'betonamu|wa|ima|nanji|desu ka', v: 'Ở Việt Nam bây giờ là mấy giờ?', k: 'ベトナムは今何時ですか。' },
      ],
      fill: [
        { ex: 1, tok: 0, wrong: ['きゅうじ', 'ここのじ'], why: '9 giờ đọc đặc biệt: <b class="jp">くじ</b> (không nói きゅうじ).' },
        { ex: 2, tok: 0, wrong: ['よんじ', 'しじ'], why: '4 giờ đọc đặc biệt: <b class="jp">よじ</b> (không nói よんじ, しじ).' },
        { ex: 0, tok: 1, wrong: ['なん', 'いくら'], why: 'Hỏi giờ → <b class="jp">なんじ</b> (なん + じ = mấy giờ).' },
        { ex: 5, tok: 0, wrong: ['ごぜん', 'はん'], why: 'Buổi chiều → <b class="jp">ごご</b> (<span class="jp">ごぜん</span> = buổi sáng), và nói <b>trước</b> giờ: ごご さんじ.' },
      ],
      talk: [
        { q: 'いま なんじですか。', qr: 'ima nanji desu ka?', qv: 'Bạn học hỏi: "Bây giờ mấy giờ rồi?" — đồng hồ chỉ 9:00.', a: 1, wrong: [['きゅうじです。', 'kyuuji desu.'], ['くじですか。', 'kuji desu ka?']] },
        { sit: 'Đồng hồ chỉ 7:30. Bạn nói giờ cho bạn mình biết:', a: 3, wrong: [['しちじです。', 'shichiji desu.'], ['はんしちじです。', 'han shichiji desu.']] },
        { sit: 'Bạn quên đồng hồ, muốn hỏi giờ một người lạ ngoài đường:', a: ['すみません、いま なんじですか。', 'sumimasen, ima nanji desu ka?', 'Xin lỗi, bây giờ là mấy giờ ạ?'], wrong: [['すみません、いま いくらですか。', 'sumimasen, ima ikura desu ka?'], ['すみません、いま なんじです。', 'sumimasen, ima nanji desu.']] },
        { q: 'にほんは いま ごご さんじです。ベトナムは？', qr: 'nihon wa ima gogo sanji desu. betonamu wa?', qv: 'Bạn người Nhật nói: "Ở Nhật bây giờ là 3 giờ chiều. Còn Việt Nam?" — giờ Việt Nam chậm hơn Nhật 2 tiếng.', a: ['ごご いちじです。', 'gogo ichiji desu.', '1 giờ chiều.'], wrong: [['ごご ごじです。', 'gogo goji desu.'], ['ごぜん いちじです。', 'gozen ichiji desu.']] },
      ],
    },
    g31: {
      title: 'Hôm nay thứ mấy?', jp: 'なんようび？', icon: 'today',
      goal: 'Nói thứ trong tuần, hôm qua / hôm nay / ngày mai, và quá khứ でした',
      pattern: { parts: [['きのう / きょう / あした', 't', 'kinou / kyou / ashita'], ['は', 'p', 'wa'], ['Thứ …', 'n'], ['です / でした', 'e', 'desu / deshita']], mean: 'Hôm nay / ngày mai là thứ … (chuyện đã qua dùng でした)' },
      points: [
        'Các thứ: <b class="jp">げつようび</b> (thứ Hai), <span class="jp">かようび</span> (thứ Ba), <span class="jp">すいようび</span> (thứ Tư), <span class="jp">もくようび</span> (thứ Năm), <span class="jp">きんようび</span> (thứ Sáu), <span class="jp">どようび</span> (thứ Bảy), <b class="jp">にちようび</b> (Chủ nhật).',
        'Hỏi thứ: <b class="jp">なんようびですか</b>. <span class="jp">きのう</span> (hôm qua), <span class="jp">きょう</span> (hôm nay), <span class="jp">あした</span> (ngày mai), <span class="jp">しゅうまつ</span> (cuối tuần), <span class="jp">らいしゅう</span> (tuần sau).',
        'Chuyện đã qua thì đổi <span class="jp">です</span> → <b class="jp">でした</b>: <span class="jp">きのうは もくようびでした</span> (hôm qua là thứ Năm). Hỏi: <span class="jp">でしたか</span>.',
        '<b class="jp">やすみ</b> = ngày nghỉ, được nghỉ: <span class="jp">あしたは やすみです</span> (mai tôi được nghỉ).',
      ],
      tip: 'Tên các thứ trong tiếng Nhật đi theo mặt trăng, mặt trời và ngũ hành: <span class="jp">げつ</span> (trăng), <span class="jp">か</span> (hoả), <span class="jp">すい</span> (thuỷ), <span class="jp">もく</span> (mộc), <span class="jp">きん</span> (kim), <span class="jp">ど</span> (thổ), <span class="jp">にち</span> (mặt trời). Trên lịch Nhật, Chủ nhật thường in màu đỏ, thứ Bảy màu xanh.',
      ex: [
        { j: 'きょう|は |なんようび|ですか。', r: 'kyou|wa|nan\'youbi|desu ka', v: 'Hôm nay là thứ mấy?', k: '今日は何曜日ですか。' },
        { j: 'きんようび|です。', r: 'kin\'youbi|desu', v: 'Thứ Sáu.', k: '金曜日です。' },
        { j: 'あした|は |どようび|です。', r: 'ashita|wa|doyoubi|desu', v: 'Ngày mai là thứ Bảy.', k: '明日は土曜日です。' },
        { j: 'あした|は |やすみ|です。', r: 'ashita|wa|yasumi|desu', v: 'Ngày mai tôi được nghỉ.', k: '明日は休みです。' },
        { j: 'にちようび|も |やすみ|です。', r: 'nichiyoubi|mo|yasumi|desu', v: 'Chủ nhật cũng được nghỉ.', k: '日曜日も休みです。' },
        { j: 'きのう|は |もくようび|でした。', r: 'kinou|wa|mokuyoubi|deshita', v: 'Hôm qua là thứ Năm.', k: '昨日は木曜日でした。' },
        { j: 'しゅうまつ|は |やすみ|ですか。', r: 'shuumatsu|wa|yasumi|desu ka', v: 'Cuối tuần bạn có được nghỉ không?', k: '週末は休みですか。' },
        { j: 'テスト|は |らいしゅう|の |げつようび|です。', r: 'tesuto|wa|raishuu|no|getsuyoubi|desu', v: 'Bài kiểm tra vào thứ Hai tuần sau.', k: 'テストは来週の月曜日です。' },
      ],
      fill: [
        { ex: 5, tok: 3, wrong: ['です。', 'じゃありません。'], why: 'Hôm qua là chuyện đã qua → <b class="jp">でした</b> (quá khứ của です).' },
        { ex: 0, tok: 2, wrong: ['なんじ', 'なんばん'], why: 'Hỏi thứ → <b class="jp">なんようび</b>. (<span class="jp">なんじ</span> = mấy giờ)' },
        { ex: 2, tok: 2, wrong: ['にちようび', 'もくようび'], why: 'Thứ Bảy = <b class="jp">どようび</b>. (<span class="jp">にちようび</span> = Chủ nhật, <span class="jp">もくようび</span> = thứ Năm)' },
        { ex: 7, tok: 3, wrong: ['は', 'に'], why: 'Thứ Hai <b>của</b> tuần sau → らいしゅう<b class="jp">の</b> げつようび.' },
      ],
      talk: [
        { q: 'きょうは なんようびですか。', qr: 'kyou wa nan\'youbi desu ka?', qv: 'Bạn học hỏi: "Hôm nay thứ mấy nhỉ?" — hôm nay là thứ Sáu.', a: 1, wrong: [['きんようびでした。', 'kin\'youbi deshita.'], ['きょうです。', 'kyou desu.']] },
        { q: 'あしたは なんようびですか。', qr: 'ashita wa nan\'youbi desu ka?', qv: '"Ngày mai là thứ mấy?" — hôm nay là thứ Ba.', a: ['すいようびです。', 'suiyoubi desu.', 'Thứ Tư.'], wrong: [['もくようびです。', 'mokuyoubi desu.'], ['かようびです。', 'kayoubi desu.']] },
        { q: 'きのうは やすみでしたか。', qr: 'kinou wa yasumi deshita ka?', qv: 'Hôm nay thứ Hai. Đồng nghiệp hỏi: "Hôm qua bạn được nghỉ à?"', a: ['はい、にちようびでした。', 'hai, nichiyoubi deshita.', 'Vâng, hôm qua là Chủ nhật mà.'], wrong: [['はい、やすみです。', 'hai, yasumi desu.'], ['いいえ、にちようびでした。', 'iie, nichiyoubi deshita.']] },
        { sit: 'Bạn muốn hỏi người bạn Nhật xem cuối tuần họ có được nghỉ không:', a: 6, wrong: [['しゅうまつは やすみでした。', 'shuumatsu wa yasumi deshita.'], ['しゅうまつは なんじですか。', 'shuumatsu wa nanji desu ka?']] },
      ],
    },
  });

  // ---------------- câu thêm cho bài gốc (data-talk.js) — chỉ số ex đếm theo danh sách đã nối ----------------
  Object.assign(SJ.TALK_X, {
    // g7 có sẵn ex 0–4 → câu thêm là 5, 6, 7
    g7: {
      ex: [
        { j: 'すみません、|ここ|は |どこ|ですか。', r: 'sumimasen,|koko|wa|doko|desu ka', v: 'Xin lỗi, đây là chỗ nào ạ?', k: 'すみません、ここはどこですか。' },
        { j: 'レジ|は |そこ|です。', r: 'reji|wa|soko|desu', v: 'Quầy thu ngân ở chỗ đó (gần bạn) ạ.', k: 'レジはそこです。' },
        { j: 'にほんご|の |きょうしつ|は |どこ|ですか。', r: 'nihongo|no|kyoushitsu|wa|doko|desu ka', v: 'Lớp học tiếng Nhật ở đâu ạ?', k: '日本語の教室はどこですか。' },
      ],
      fill: [
        { ex: 6, tok: 2, wrong: ['ここ', 'どこ'], why: 'Chỗ ở gần người nghe → <b class="jp">そこ</b> (chỗ đó).' },
        { ex: 7, tok: 1, wrong: ['は', 'を'], why: 'Lớp (dạy) tiếng Nhật: にほんご<b class="jp">の</b> きょうしつ — <span class="jp">の</span> nối hai danh từ.' },
      ],
      talk: [
        { q: 'すみません、レジは どこですか。', qr: 'sumimasen, reji wa doko desu ka?', qv: 'Bạn làm thêm ở cửa hàng. Một vị khách đứng ngay cạnh quầy thu ngân mà không thấy, hỏi bạn: "Xin lỗi, quầy thu ngân ở đâu ạ?"', a: 6, wrong: [['レジは どこですか。', 'reji wa doko desu ka?'], ['はい、レジです。', 'hai, reji desu.']] },
        { sit: 'Bạn bị lạc. Bạn cầm bản đồ, hỏi một người đi đường xem mình đang ở chỗ nào:', a: 5, wrong: [['すみません、どこは ここですか。', 'sumimasen, doko wa koko desu ka?'], ['すみません、これは どこですか。', 'sumimasen, kore wa doko desu ka?']] },
        { q: 'にほんごの きょうしつは どこですか。', qr: 'nihongo no kyoushitsu wa doko desu ka?', qv: 'Một bạn mới vào trường hỏi bạn: "Lớp tiếng Nhật ở đâu thế?" — lớp ở toà nhà đằng kia.', a: 1, wrong: [['にほんごです。', 'nihongo desu.'], ['はい、きょうしつです。', 'hai, kyoushitsu desu.']] },
      ],
    },
    // g8 có sẵn ex 0–4 → câu thêm là 5, 6, 7
    g8: {
      ex: [
        { j: 'この |かさ|は |いくら|ですか。', r: 'kono|kasa|wa|ikura|desu ka', v: 'Cái ô này bao nhiêu tiền?', k: 'この傘はいくらですか。' },
        { j: 'せんはっぴゃく|えん|です。', r: 'sen happyaku|en|desu', v: '1.800 yên.', k: '1800円です。' },
        { j: 'さんびゃくごじゅう|えん|です。', r: 'sanbyaku gojuu|en|desu', v: '350 yên.', k: '350円です。' },
      ],
      fill: [
        { ex: 5, tok: 2, wrong: ['を', 'の'], why: 'Hỏi giá món nào → món đó + <b class="jp">は</b> (wa) + いくらですか.' },
        { ex: 6, tok: 0, wrong: ['せんはちひゃく', 'はっせん'], why: '1.800 = <b class="jp">せん</b> (1.000) + <b class="jp">はっぴゃく</b> (800). Nhớ: 800 bị biến âm thành はっぴゃく.' },
      ],
      talk: [
        { sit: 'Bạn thấy một cái ô ưng ý và muốn hỏi giá cái ô này:', a: 5, wrong: [['この かさを いくらですか。', 'kono kasa o ikura desu ka?'], ['この かさは なんですか。', 'kono kasa wa nan desu ka?']] },
        { q: 'これは いくらですか。', qr: 'kore wa ikura desu ka?', qv: 'Bạn làm thêm ở quầy. Khách cầm món đồ dán giá 350 yên hỏi bạn: "Cái này bao nhiêu tiền?"', a: 7, wrong: [['さんひゃくごじゅうえんです。', 'sanhyaku gojuu en desu.'], ['ごじゅうさんびゃくえんです。', 'gojuu sanbyaku en desu.']] },
      ],
    },
  });
})(window.SJ);
