/* SubelJapan — Từ vựng, Kanji, bài lý thuyết, mẹo vặt */
window.SJ = window.SJ || {};
(function (SJ) {
  // ===== TỪ VỰNG: [tiếng Nhật, romaji, nghĩa, emoji] =====
  const V = {
    greet: [
      ['おはよう','ohayou','Chào buổi sáng','sun'],
      ['こんにちは','konnichiwa','Xin chào (ban ngày)','wave_hand'],
      ['こんばんは','konbanwa','Chào buổi tối','moon'],
      ['おやすみなさい','oyasuminasai','Chúc ngủ ngon','sleep'],
      ['ありがとう','arigatou','Cảm ơn','thanks'],
      ['すみません','sumimasen','Xin lỗi / Làm ơn cho hỏi','sorry'],
      ['ごめんなさい','gomennasai','Xin lỗi (thân mật)','teary'],
      ['さようなら','sayounara','Tạm biệt','wave_hand'],
      ['はじめまして','hajimemashite','Rất vui được gặp (lần đầu)','friends'],
      ['いただきます','itadakimasu','Mời cả nhà ăn cơm (trước bữa)','rice'],
      ['ごちそうさま','gochisousama','Cảm ơn vì bữa ăn (sau bữa)','yum'],
      ['はい','hai','Vâng / Có','maru'],
      ['いいえ','iie','Không','batsu'],
      ['がんばって','ganbatte','Cố lên nhé!','cheer'],
    ],
    number: [
      ['いち','ichi','số 1','n1'],['に','ni','số 2','n2'],['さん','san','số 3','n3'],['よん','yon','số 4','n4'],
      ['ご','go','số 5','n5'],['ろく','roku','số 6','n6'],['なな','nana','số 7','n7'],['はち','hachi','số 8','n8'],
      ['きゅう','kyuu','số 9','n9'],['じゅう','juu','số 10','n10'],['ひゃく','hyaku','một trăm','n100'],['せん','sen','một nghìn','n1000'],
      ['まん','man','mười nghìn','n10000'],['ゼロ','zero','số 0','n0'],
    ],
    family: [
      ['おかあさん','okaasan','mẹ','mom'],['おとうさん','otousan','bố','dad'],['おにいさん','oniisan','anh trai','bro'],
      ['おねえさん','oneesan','chị gái','sis'],['おとうと','otouto','em trai','kid'],['いもうと','imouto','em gái','imouto'],
      ['おじいさん','ojiisan','ông','grandpa'],['おばあさん','obaasan','bà','grandma'],['かぞく','kazoku','gia đình','family'],
      ['ともだち','tomodachi','bạn bè','friends'],['あかちゃん','akachan','em bé','baby'],['おじさん','ojisan','chú, bác','person'],
    ],
    food: [
      ['ごはん','gohan','cơm','rice'],['みず','mizu','nước','drop'],['おちゃ','ocha','trà','tea'],['パン','pan','bánh mì','bread'],
      ['にく','niku','thịt','meat'],['さかな','sakana','cá','fish'],['たまご','tamago','trứng','egg'],['やさい','yasai','rau','cabbage'],
      ['くだもの','kudamono','trái cây','grapes'],['すし','sushi','sushi','sushi'],['ラーメン','raamen','mì ramen','ramen'],
      ['コーヒー','koohii','cà phê','coffee'],['フォー','foo','phở','pho'],['りんご','ringo','quả táo','apple'],['みかん','mikan','quả quýt','mandarin'],
      ['ケーキ','keeki','bánh kem','cake'],
    ],
    animal: [
      ['いぬ','inu','con chó','dog'],['ねこ','neko','con mèo','cat'],['とり','tori','con chim','bird'],['うさぎ','usagi','con thỏ','rabbit'],
      ['うま','uma','con ngựa','horse'],['うし','ushi','con bò','cow'],['ぶた','buta','con lợn','pig'],['さる','saru','con khỉ','monkey'],
      ['くま','kuma','con gấu','bear'],['ぞう','zou','con voi','elephant'],['きつね','kitsune','con cáo','fox'],['かめ','kame','con rùa','turtle'],
      ['パンダ','panda','gấu trúc','panda'],['ペンギン','pengin','chim cánh cụt','penguin'],
    ],
    color: [
      ['あか','aka','màu đỏ','c_red'],['あお','ao','màu xanh dương','c_blue'],['きいろ','kiiro','màu vàng','c_yellow'],['みどり','midori','màu xanh lá','c_green'],
      ['しろ','shiro','màu trắng','c_white'],['くろ','kuro','màu đen','c_black'],['ピンク','pinku','màu hồng','c_pink'],['ちゃいろ','chairo','màu nâu','c_brown'],
      ['むらさき','murasaki','màu tím','c_purple'],['オレンジ','orenji','màu cam','c_orange'],['みずいろ','mizuiro','xanh da trời nhạt','c_blue'],['きんいろ','kin\'iro','màu vàng kim','c_yellow'],
    ],
    time: [
      ['きょう','kyou','hôm nay','calendar'],['あした','ashita','ngày mai','tomorrow'],['きのう','kinou','hôm qua','yesterday'],['あさ','asa','buổi sáng','sunrise'],
      ['ひる','hiru','buổi trưa','sun'],['よる','yoru','buổi tối','night'],['いま','ima','bây giờ','alarm'],['まいにち','mainichi','mỗi ngày','everyday'],
      ['しゅうまつ','shuumatsu','cuối tuần','party'],['はる','haru','mùa xuân','sakura'],['なつ','natsu','mùa hè','summer'],['あき','aki','mùa thu','maple'],['ふゆ','fuyu','mùa đông','snowman'],
    ],
    thing: [
      ['ほん','hon','quyển sách','book'],['ペン','pen','cây bút','pen'],['かばん','kaban','cái cặp','bag'],['いす','isu','cái ghế','chair'],
      ['とけい','tokei','đồng hồ','watch'],['でんわ','denwa','điện thoại','phone'],['かさ','kasa','cái ô','umbrella'],['くつ','kutsu','đôi giày','shoes'],
      ['めがね','megane','kính mắt','glasses'],['かぎ','kagi','chìa khoá','key'],['がっこう','gakkou','trường học','school'],
      ['せんせい','sensei','giáo viên','teacher'],['がくせい','gakusei','học sinh','student'],['くるま','kuruma','xe ô tô','car'],
    ],
    adj: [
      ['おおきい','ookii','to, lớn','elephant'],['ちいさい','chiisai','nhỏ, bé','mouse'],['あつい','atsui','nóng','fire'],['さむい','samui','lạnh','cold'],
      ['おいしい','oishii','ngon','yum'],['かわいい','kawaii','dễ thương','love'],['たかい','takai','cao / đắt','tower'],['やすい','yasui','rẻ','tag'],
      ['たのしい','tanoshii','vui','party'],['むずかしい','muzukashii','khó','dizzy'],['やさしい','yasashii','dễ / hiền','halo'],['はやい','hayai','nhanh','rocket'],
    ],
    verb: [
      ['たべます','tabemasu','ăn','onigiri'],['のみます','nomimasu','uống','juice'],['いきます','ikimasu','đi','walk'],['きます','kimasu','đến','walk'],
      ['みます','mimasu','xem, nhìn','eye'],['ききます','kikimasu','nghe','headphones'],['よみます','yomimasu','đọc','book'],['かきます','kakimasu','viết','write'],
      ['ねます','nemasu','ngủ','sleep'],['おきます','okimasu','thức dậy','alarm'],['はなします','hanashimasu','nói chuyện','talk'],['かいます','kaimasu','mua','cart'],
      ['べんきょうします','benkyoushimasu','học','books'],['あそびます','asobimasu','chơi','game'],
    ],
  };
  SJ.VOCAB = {};
  SJ.VOCAB_ALL = [];
  Object.keys(V).forEach(t => {
    SJ.VOCAB[t] = V[t].map(a => {
      const o = { key:'v:' + a[0], jp: a[0], r: a[1], vi: a[2], e: a[3], topic: t };
      SJ.VOCAB_ALL.push(o);
      return o;
    });
  });
  SJ.VOCAB_MAP = {};
  SJ.VOCAB_ALL.forEach(o => { SJ.VOCAB_MAP[o.key] = o; });

  // ===== KANJI: [chữ, Hán Việt, nghĩa, On, Kun, mẹo, ví dụ[[từ, đọc, romaji, nghĩa]]] =====
  const KJ = [
    ['一','NHẤT','một','イチ','ひと(つ)','1 nét ngang = 1 que tính nằm',[['一つ','ひとつ','hitotsu','một cái'],['一月','いちがつ','ichigatsu','tháng Một']]],
    ['二','NHỊ','hai','ニ','ふた(つ)','2 nét ngang = 2 que tính, nét dưới dài hơn',[['二つ','ふたつ','futatsu','hai cái'],['二月','にがつ','nigatsu','tháng Hai']]],
    ['三','TAM','ba','サン','みっ(つ)','3 nét ngang = 3 que tính, nét giữa ngắn nhất',[['三つ','みっつ','mittsu','ba cái'],['三月','さんがつ','sangatsu','tháng Ba']]],
    ['四','TỨ','bốn','シ','よん・よっ(つ)','Ô cửa sổ 4 góc có rèm buông bên trong',[['四つ','よっつ','yottsu','bốn cái'],['四月','しがつ','shigatsu','tháng Tư']]],
    ['五','NGŨ','năm','ゴ','いつ(つ)','Chiếc ghế hai tầng — xoè 5 ngón tay ra đếm',[['五つ','いつつ','itsutsu','năm cái'],['五月','ごがつ','gogatsu','tháng Năm']]],
    ['六','LỤC','sáu','ロク','むっ(つ)','Người đội nón dang 2 chân đi "lục" lọi đồ',[['六つ','むっつ','muttsu','sáu cái'],['六月','ろくがつ','rokugatsu','tháng Sáu']]],
    ['七','THẤT','bảy','シチ','なな(つ)','Giống số 7 bị lộn ngược',[['七つ','ななつ','nanatsu','bảy cái'],['七月','しちがつ','shichigatsu','tháng Bảy']]],
    ['八','BÁT','tám','ハチ','やっ(つ)','Hai nét tách ra như mái nhà — "bát" giác 8 cạnh',[['八つ','やっつ','yattsu','tám cái'],['八月','はちがつ','hachigatsu','tháng Tám']]],
    ['九','CỬU','chín','キュウ・ク','ここの(つ)','Cánh tay cong vươn ra — 9 rồi, sắp tới 10!',[['九つ','ここのつ','kokonotsu','chín cái'],['九月','くがつ','kugatsu','tháng Chín']]],
    ['十','THẬP','mười','ジュウ','とお','Dấu cộng ✚ — đúng là "chữ thập"!',[['十','とお','too','mười cái'],['十月','じゅうがつ','juugatsu','tháng Mười']]],
    ['日','NHẬT','mặt trời, ngày','ニチ・ジツ','ひ・か','Mặt trời vuông có vạch ở giữa',[['日本','にほん','nihon','Nhật Bản'],['日曜日','にちようび','nichiyoubi','Chủ nhật']]],
    ['月','NGUYỆT','mặt trăng, tháng','ゲツ・ガツ','つき','Vầng trăng khuyết có 2 vệt ở giữa',[['月','つき','tsuki','mặt trăng'],['月曜日','げつようび','getsuyoubi','thứ Hai']]],
    ['火','HOẢ','lửa','カ','ひ','Ngọn lửa bùng lên, tàn lửa bay hai bên',[['火','ひ','hi','lửa'],['火曜日','かようび','kayoubi','thứ Ba']]],
    ['水','THUỶ','nước','スイ','みず','Dòng nước chảy tách thành nhiều nhánh',[['水','みず','mizu','nước'],['水曜日','すいようび','suiyoubi','thứ Tư']]],
    ['木','MỘC','cây','モク・ボク','き','Cái cây dang cành, cắm rễ xuống đất',[['木','き','ki','cái cây'],['木曜日','もくようび','mokuyoubi','thứ Năm']]],
    ['金','KIM','vàng, tiền','キン','かね','Mái nhà che đống vàng lấp lánh',[['お金','おかね','okane','tiền'],['金曜日','きんようび',"kin'youbi",'thứ Sáu']]],
    ['土','THỔ','đất','ド','つち','Mầm cây nhú lên khỏi mặt đất',[['土','つち','tsuchi','đất'],['土曜日','どようび','doyoubi','thứ Bảy']]],
    ['人','NHÂN','người','ジン・ニン','ひと','Một người đang bước đi bằng 2 chân',[['人','ひと','hito','người'],['日本人','にほんじん','nihonjin','người Nhật']]],
    ['口','KHẨU','miệng','コウ','くち','Cái miệng há to hình vuông',[['口','くち','kuchi','cái miệng'],['入口','いりぐち','iriguchi','lối vào']]],
    ['目','MỤC','mắt','モク','め','Con mắt dựng đứng — 2 vạch như lông mi',[['目','め','me','con mắt'],['目玉焼き','めだまやき','medamayaki','trứng ốp la']]],
    ['耳','NHĨ','tai','ジ','みみ','Hình cái tai với các nếp gấp',[['耳','みみ','mimi','cái tai'],['耳たぶ','みみたぶ','mimitabu','dái tai']]],
    ['手','THỦ','tay','シュ','て','Bàn tay xoè các ngón',[['手','て','te','bàn tay'],['上手','じょうず','jouzu','giỏi']]],
    ['足','TÚC','chân','ソク','あし','Đầu gối (口) ở trên, bàn chân bước ở dưới',[['足','あし','ashi','bàn chân'],['遠足','えんそく','ensoku','chuyến dã ngoại']]],
    ['力','LỰC','sức mạnh','リョク・リキ','ちから','Cánh tay gồng lên đầy sức mạnh',[['力','ちから','chikara','sức mạnh'],['協力','きょうりょく','kyouryoku','hợp tác, giúp sức']]],
    ['女','NỮ','phụ nữ','ジョ','おんな','Người phụ nữ ngồi khép chân duyên dáng',[['女の子','おんなのこ','onnanoko','bé gái'],['女性','じょせい','josei','phụ nữ, nữ giới']]],
    ['男','NAM','đàn ông','ダン','おとこ','Ruộng (田) + Sức (力) = người làm ruộng khoẻ mạnh',[['男の子','おとこのこ','otokonoko','bé trai'],['男性','だんせい','dansei','đàn ông, nam giới']]],
    ['子','TỬ','con, trẻ con','シ','こ','Em bé quấn tã đang dang hai tay',[['子ども','こども','kodomo','trẻ em'],['帽子','ぼうし','boushi','cái mũ']]],
    ['上','THƯỢNG','trên','ジョウ','うえ','Vạch chỉ hướng lên trên mặt đất',[['上','うえ','ue','bên trên'],['上手','じょうず','jouzu','giỏi']]],
    ['下','HẠ','dưới','カ・ゲ','した','Vạch chỉ hướng xuống dưới',[['下','した','shita','bên dưới'],['地下鉄','ちかてつ','chikatetsu','tàu điện ngầm']]],
    ['中','TRUNG','giữa, trong','チュウ','なか','Mũi tên cắm xuyên chính giữa cái hộp',[['中','なか','naka','bên trong'],['中国','ちゅうごく','chuugoku','Trung Quốc']]],
    ['大','ĐẠI','to, lớn','ダイ・タイ','おお(きい)','Người dang rộng tay chân — to quá!',[['大きい','おおきい','ookii','to lớn'],['大学','だいがく','daigaku','đại học']]],
    ['小','TIỂU','nhỏ','ショウ','ちい(さい)','Ba hạt nhỏ xíu: một ở giữa, hai bên cạnh',[['小さい','ちいさい','chiisai','nhỏ bé'],['小学校','しょうがっこう','shougakkou','trường tiểu học']]],
    ['左','TẢ','trái','サ','ひだり','Tay trái cầm cây thước (工)',[['左','ひだり','hidari','bên trái'],['左手','ひだりて','hidarite','tay trái']]],
    ['右','HỮU','phải','ウ・ユウ','みぎ','Tay phải đưa cơm vào miệng (口)',[['右','みぎ','migi','bên phải'],['右手','みぎて','migite','tay phải']]],
    ['本','BẢN','gốc, sách','ホン','もと','Cái cây (木) có vạch đánh dấu ở gốc',[['本','ほん','hon','quyển sách'],['日本','にほん','nihon','Nhật Bản']]],
    ['山','SƠN','núi','サン','やま','Ba đỉnh núi, đỉnh giữa cao nhất',[['山','やま','yama','ngọn núi'],['富士山','ふじさん','fujisan','núi Phú Sĩ']]],
    ['川','XUYÊN','sông','セン','かわ','Ba dòng nước chảy song song',[['川','かわ','kawa','con sông'],['小川','おがわ','ogawa','con suối nhỏ']]],
    ['田','ĐIỀN','ruộng','デン','た','Thửa ruộng chia thành 4 ô vuông',[['田んぼ','たんぼ','tanbo','ruộng lúa'],['田中さん','たなかさん','tanaka-san','anh/chị Tanaka (họ phổ biến)']]],
    ['天','THIÊN','trời','テン','あま','Người (大) đội bầu trời (一) trên đầu',[['天気','てんき','tenki','thời tiết'],['天才','てんさい','tensai','thiên tài']]],
    ['気','KHÍ','khí, tinh thần','キ','—','Hơi nước bốc lên cuồn cuộn',[['元気','げんき','genki','khoẻ khoắn'],['天気','てんき','tenki','thời tiết']]],
    ['雨','VŨ','mưa','ウ','あめ','Những giọt mưa rơi dưới mái trời',[['雨','あめ','ame','mưa'],['大雨','おおあめ','ooame','mưa to']]],
    ['花','HOA','hoa','カ','はな','Cỏ (艹) trên đầu + biến hoá (化) = bông hoa nở',[['花','はな','hana','bông hoa'],['花火','はなび','hanabi','pháo hoa']]],
    ['空','KHÔNG','bầu trời, trống','クウ','そら','Mái nhà có lỗ hổng — nhìn thấy bầu trời',[['空','そら','sora','bầu trời'],['空港','くうこう','kuukou','sân bay']]],
    ['学','HỌC','học','ガク','まな(ぶ)','Đứa trẻ (子) dưới mái trường toả ánh sáng tri thức',[['学生','がくせい','gakusei','học sinh'],['大学','だいがく','daigaku','đại học']]],
    ['生','SINH','sống, sinh ra','セイ・ショウ','い(きる)','Mầm cây vươn lên khỏi mặt đất — sự sống',[['先生','せんせい','sensei','giáo viên'],['学生','がくせい','gakusei','học sinh']]],
    ['先','TIÊN','trước','セン','さき','Người đi trước dẫn đường',[['先生','せんせい','sensei','giáo viên'],['先月','せんげつ','sengetsu','tháng trước']]],
    ['年','NIÊN','năm','ネン','とし','Người gánh lúa sau một năm mùa màng',[['今年','ことし','kotoshi','năm nay'],['来年','らいねん','rainen','năm sau']]],
    ['名','DANH','tên','メイ','な','Buổi tối (夕) tối quá phải gọi tên bằng miệng (口)',[['名前','なまえ','namae','tên'],['有名','ゆうめい','yuumei','nổi tiếng']]],
    ['何','HÀ','cái gì','カ','なに・なん','Người (亻) đứng hỏi: "Cái gì đây?"',[['何','なに','nani','cái gì'],['何人','なんにん','nannin','mấy người']]],
    ['今','KIM','bây giờ','コン','いま','Mái nhà che khoảnh khắc hiện tại',[['今','いま','ima','bây giờ'],['今日','きょう','kyou','hôm nay']]],
    ['友','HỮU','bạn','ユウ','とも','Hai bàn tay đan vào nhau — bạn bè',[['友だち','ともだち','tomodachi','bạn bè'],['友人','ゆうじん','yuujin','bạn (cách nói trang trọng)']]],
    ['百','BÁCH','một trăm','ヒャク','—','Một (一) + trắng (白) = một trăm',[['百','ひゃく','hyaku','một trăm'],['三百','さんびゃく','sanbyaku','ba trăm']]],
    ['千','THIÊN','một nghìn','セン','ち','Một nét phẩy đứng trên chữ thập (十)',[['千','せん','sen','một nghìn'],['三千','さんぜん','sanzen','ba nghìn']]],
    ['万','VẠN','mười nghìn','マン・バン','—','Đông "vạn" người — số 10.000',[['一万','いちまん','ichiman','mười nghìn'],['万歳','ばんざい','banzai','vạn tuế, hoan hô!']]],
    ['円','VIÊN','tròn, đồng Yên','エン','まる(い)','Đồng xu tròn — tiền Yên ¥',[['百円','ひゃくえん','hyakuen','100 yên'],['千円','せんえん',"sen'en",'1000 yên']]],
    ['時','THỜI','giờ, thời gian','ジ','とき','Mặt trời (日) + chùa (寺): chùa gõ chuông báo giờ',[['一時','いちじ','ichiji','1 giờ'],['時間','じかん','jikan','thời gian']]],
    ['分','PHÂN','phút, chia','フン・ブン','わ(ける)','Con dao (刀) chia đôi (八) — phân chia',[['五分','ごふん','gofun','5 phút'],['自分','じぶん','jibun','bản thân, chính mình']]],
    ['半','BÁN','một nửa','ハン','なか(ば)','Một vật bị chia đôi chính giữa — một nửa ½',[['三時半','さんじはん','sanjihan','3 giờ rưỡi'],['半分','はんぶん','hanbun','một nửa']]],
  ];
  SJ.KANJI = KJ.map(a => ({ key:'j:' + a[0], k: a[0], hv: a[1], m: a[2], on: a[3], kun: a[4], tip: a[5], ex: a[6].map(e => ({ jp: e[0], kana: e[1], r: e[2], vi: e[3] })) }));
  SJ.KANJI_MAP = {};
  SJ.KANJI.forEach(o => { SJ.KANJI_MAP[o.k] = o; });

  // ===== BÀI LÝ THUYẾT =====
  // ex: [tiếng Nhật, romaji, nghĩa]; quiz.o[0] luôn là đáp án đúng (sẽ được xáo trộn)
  SJ.TEXT = {
    intro: {
      sections: [
        { h:'Tiếng Nhật có 3 bộ chữ', p:'Đừng sợ nha! Mỗi bộ chữ có một "nhiệm vụ" riêng, và mình sẽ học từng bộ một thật chậm rãi.',
          list: [
            ['ひらがな','Hiragana — nét mềm mại, dùng cho từ thuần Nhật & ngữ pháp. 46 chữ cơ bản. Học đầu tiên!'],
            ['カタカナ','Katakana — nét thẳng góc cạnh, dùng cho từ nước ngoài như ベトナム (Việt Nam), コーヒー (cà phê).'],
            ['漢字','Kanji — chữ Hán mang nghĩa. Người Việt có lợi thế cực lớn nhờ âm Hán Việt: 学生 = HỌC SINH!'],
          ] },
        { h:'Một câu dùng cả 3 bộ chữ', p:'Trong câu dưới đây: わたしは (Hiragana) + ベトナム (Katakana) + 人 (Kanji) + です (Hiragana).',
          ex: [['わたしは ベトナム人です。','watashi wa betonamujin desu','Tôi là người Việt Nam.']] },
        { h:'Phát âm dễ không? Dễ lắm!', p:'Tiếng Nhật chỉ có 5 nguyên âm: a – i – u – e – o (đọc như "a – i – ư – ê – ô"). Mỗi chữ kana là một nhịp đều nhau. Và đặc biệt: KHÔNG có thanh điệu sắc huyền hỏi ngã như tiếng Việt!',
          ex: [['あ い う え お','a i u e o','5 nguyên âm'], ['すし','su-shi','sushi (2 nhịp)'], ['さくら','sa-ku-ra','hoa anh đào (3 nhịp)']] },
        { h:'Cách học với SubelJapan', p:'Mỗi ngày chỉ cần 10–15 phút: học 1 bài → chơi 1 game → ôn thẻ nhớ → luyện viết vài chữ. Giữ chuỗi ngày học thật dài là bí kíp! Đừng cố nhớ hết một lúc — các mẹo hình ảnh sẽ giúp bạn nhớ nhanh, và viết tay giúp nhớ lâu hơn rất nhiều.' },
      ],
      quiz: [
        { q:'Bộ chữ nào dùng cho từ mượn nước ngoài?', o: ['Katakana','Hiragana','Kanji'] },
        { q:'Tiếng Nhật có mấy nguyên âm?', o: ['5','3','7','12'] },
        { q:'学生 đọc theo Hán Việt là gì?', o: ['HỌC SINH','TIÊN SINH','ĐẠI HỌC','NHẬT BẢN'] },
        { q:'Chữ nào là Hiragana?', o: ['あ','ア','亜','A'], big: true },
        { q:'Tiếng Nhật có thanh điệu (sắc, huyền…) như tiếng Việt không?', o: ['Không','Có, 6 thanh','Có, 4 thanh'] },
      ],
    },
    special: {
      sections: [
        { h:'Chữ っ nhỏ — "nín thở" một nhịp', p:'Khi thấy つ viết nhỏ (っ), bạn dừng lại một nhịp rồi bật mạnh phụ âm phía sau. Romaji sẽ gấp đôi phụ âm.',
          ex: [['きって','kitte','con tem'], ['がっこう','gakkou','trường học'], ['ざっし','zasshi','tạp chí'], ['ちょっと','chotto','một chút']] },
        { h:'Trường âm — kéo dài 2 nhịp', p:'Hai nguyên âm đứng cạnh nhau thì kéo dài ra. Đặc biệt: えい đọc là "ê-ê", おう đọc là "ô-ô". Kéo dài hay không có thể đổi nghĩa đó!',
          ex: [['おかあさん','okaasan','mẹ'], ['おにいさん','oniisan','anh trai'], ['せんせい','sensei','giáo viên (えい đọc kéo dài thành "sen-sê")'], ['おとうさん','otousan','bố'], ['おばさん','obasan','cô, dì'], ['おばあさん','obaasan','bà (dài hơn!)']] },
        { h:'Ba chữ "đổi giọng" khi làm trợ từ', p:'Khi đứng làm trợ từ: は đọc là "wa", へ đọc là "e", を đọc là "o".',
          ex: [['わたしは','watashi wa','tôi thì…'], ['がっこうへ','gakkou e','đến trường'], ['みずを のむ','mizu o nomu','uống nước']] },
      ],
      quiz: [
        { q:'きって đọc là gì?', o: ['kitte','kite','kitsute','kiite'] },
        { q:'Từ nào nghĩa là "bà"?', o: ['おばあさん','おばさん','おかあさん'] },
        { q:'Trợ từ は trong "わたしは" đọc là?', o: ['wa','ha','ba','a'] },
        { q:'がっこう nghĩa là gì?', o: ['trường học','tạp chí','con tem','cửa hàng'] },
        { q:'せんせい đọc chuẩn là?', o: ['sen-sê-ê','sen-sây','sen-xi'] },
      ],
    },
    kataext: {
      sections: [
        { h:'Dấu gạch dài ー', p:'Katakana dùng dấu ー để kéo dài nguyên âm phía trước thêm 1 nhịp. Viết dọc thì dấu này cũng dựng đứng!',
          ex: [['コーヒー','koohii','cà phê'], ['ケーキ','keeki','bánh kem'], ['ラーメン','raamen','mì ramen'], ['スーパー','suupaa','siêu thị']] },
        { h:'Âm mới cho từ nước ngoài', p:'Ghép thêm nguyên âm nhỏ (ァィゥェォ) để tạo các âm mà tiếng Nhật vốn không có, như "fa", "ti", "che"… Thử đọc tên món Việt bằng Katakana nhé!',
          ex: [['フォー','foo','phở'], ['バインミー','bainmii','bánh mì Việt Nam'], ['ベトナム','betonamu','Việt Nam'], ['ハノイ','hanoi','Hà Nội']] },
      ],
    },
    g1: {
      sections: [
        { h:'Công thức thần thánh', p:'"A は B です。" nghĩa là "A là B." Nhớ nha: は ở đây đọc là "wa". です đọc gần như "đét" — chữ u cuối gần như câm.',
          ex: [['わたしは がくせいです。','watashi wa gakusei desu','Tôi là học sinh.'], ['わたしは ベトナムじんです。','watashi wa betonamujin desu','Tôi là người Việt Nam.'], ['ミンさんは せんせいです。','Min-san wa sensei desu','Anh Minh là giáo viên.']] },
        { h:'Phủ định: じゃ ありません', p:'"A は B じゃ ありません。" = A không phải là B.',
          ex: [['わたしは せんせいじゃ ありません。','watashi wa sensei ja arimasen','Tôi không phải là giáo viên.']] },
        { h:'さん — gọi người khác thật lịch sự', p:'Thêm さん sau tên người khác, giống "anh/chị/bạn". Nhưng KHÔNG dùng さん cho chính mình nhé!',
          ex: [['リンさん','Rin-san','bạn Linh'], ['たなかさん','Tanaka-san','anh/chị Tanaka']] },
      ],
      quiz: [
        { q:'Điền trợ từ: わたし ___ がくせいです。', o: ['は','を','か','に'], big: true },
        { q:'"Tôi là người Việt Nam" là câu nào?', o: ['わたしは ベトナムじんです。','わたしは にほんじんです。','わたしは せんせいです。'] },
        { q:'Trợ từ は trong câu đọc là?', o: ['wa','ha','ba'] },
        { q:'"Tôi không phải giáo viên" là?', o: ['わたしは せんせいじゃ ありません。','わたしは せんせいです。','せんせいは わたしです。'] },
        { q:'Có nên tự gọi mình là "___さん" không?', o: ['Không nên','Nên, cho lịch sự'] },
      ],
    },
    g2: {
      sections: [
        { h:'Chỉ cần thêm か!', p:'Câu khẳng định + か = câu hỏi. Không cần đảo từ như tiếng Anh, dễ ợt!',
          ex: [['がくせいですか。','gakusei desu ka','Bạn là học sinh à?'], ['にほんじんですか。','nihonjin desu ka','Bạn là người Nhật à?']] },
        { h:'Trả lời: はい / いいえ', p:'Đồng ý thì はい、そうです. Không đúng thì いいえ、ちがいます.',
          ex: [['はい、そうです。','hai, sou desu','Vâng, đúng vậy.'], ['いいえ、ちがいます。','iie, chigaimasu','Không, không phải.']] },
        { h:'Hỏi "cái gì?" với なん', p:'なん (nan) = cái gì. Ghép vào là có ngay câu hỏi.',
          ex: [['これは なんですか。','kore wa nan desu ka','Đây là cái gì?'], ['おなまえは？','onamae wa?','Tên bạn là gì?']] },
      ],
      quiz: [
        { q:'Biến "がくせいです" thành câu hỏi:', o: ['がくせいですか。','かがくせいです。','がくせいかです。'] },
        { q:'"Vâng, đúng vậy" là:', o: ['はい、そうです。','いいえ、ちがいます。','そうですか。'] },
        { q:'なん nghĩa là gì?', o: ['cái gì','ai','ở đâu','khi nào'] },
        { q:'いいえ nghĩa là gì?', o: ['Không','Vâng','Cảm ơn'] },
      ],
    },
    g3: {
      sections: [
        { h:'Ba từ chỉ đồ vật', p:'これ = cái này (gần mình) · それ = cái đó (gần người nghe) · あれ = cái kia (xa cả hai).',
          ex: [['これは ほんです。','kore wa hon desu','Đây là quyển sách.'], ['それは ペンです。','sore wa pen desu','Đó là cây bút.'], ['あれは やまです。','are wa yama desu','Kia là ngọn núi.']] },
        { h:'Đi kèm danh từ: この・その・あの', p:'Muốn nói "con mèo NÀY" thì dùng この + danh từ.',
          ex: [['この ねこは かわいいです。','kono neko wa kawaii desu','Con mèo này dễ thương.'], ['あの ひとは だれですか。','ano hito wa dare desu ka','Người kia là ai vậy?']] },
        { h:'Chỉ chỗ: ここ・そこ・あそこ', p:'ここ = ở đây · そこ = ở đó · あそこ = ở kia · どこ = ở đâu?',
          ex: [['トイレは どこですか。','toire wa doko desu ka','Nhà vệ sinh ở đâu ạ?'], ['ここです。','koko desu','Ở đây ạ.']] },
      ],
      quiz: [
        { q:'Đồ vật ở xa cả hai người gọi là?', o: ['あれ','これ','それ'], big: true },
        { q:'"Quyển sách này" là:', o: ['この ほん','これ ほん','ここ ほん'] },
        { q:'どこ nghĩa là gì?', o: ['ở đâu','cái gì','ai'] },
        { q:'これは ねこです nghĩa là:', o: ['Đây là con mèo.','Kia là con mèo.','Con mèo ở đây.'] },
      ],
    },
    g4: {
      sections: [
        { h:'A の B = B của A', p:'Ngược với tiếng Việt nhé! わたしの ほん = sách CỦA TÔI (tôi đứng trước).',
          ex: [['わたしの なまえ','watashi no namae','tên của tôi'], ['ともだちの いぬ','tomodachi no inu','con chó của bạn tôi'], ['にほんの くるま','nihon no kuruma','xe ô tô của Nhật']] },
        { h:'の còn nghĩa là "thuộc về / về"', p:'Dùng の để nối hai danh từ: sách tiếng Nhật, giáo viên tiếng Nhật…',
          ex: [['にほんごの せんせい','nihongo no sensei','giáo viên tiếng Nhật'], ['ベトナムの フォー','betonamu no foo','phở Việt Nam']] },
      ],
      quiz: [
        { q:'"Con mèo của tôi" là:', o: ['わたしの ねこ','ねこの わたし','わたし ねこの'] },
        { q:'にほんごの ほん nghĩa là:', o: ['sách tiếng Nhật','tiếng Nhật của sách','người Nhật'] },
        { q:'Điền: せんせい ___ かばん (cặp của thầy)', o: ['の','は','か'], big: true },
        { q:'これは だれの ほんですか。→ "Sách của Mai." là:', o: ['マイさんの ほんです。','ほんの マイさんです。','マイさんは ほんです。'] },
      ],
    },
    g5: {
      sections: [
        { h:'Mẫu tự giới thiệu chuẩn', p:'Học thuộc 5 câu này là bạn tự tin chào hỏi người Nhật rồi đó!',
          ex: [['はじめまして。','hajimemashite','Rất vui được gặp bạn.'], ['わたしは ___ です。','watashi wa ___ desu','Tôi là ___.'], ['ベトナムから きました。','betonamu kara kimashita','Tôi đến từ Việt Nam.'], ['がくせいです。','gakusei desu','Tôi là học sinh.'], ['よろしく おねがいします。','yoroshiku onegaishimasu','Rất mong được giúp đỡ.']] },
        { h:'Thử với tên của bạn!', p:'Gõ tên bạn vào, SubelJapan sẽ đổi sang Katakana và tạo đoạn tự giới thiệu cho bạn luyện đọc.', widget:'name' },
        { h:'Mẹo nhỏ', p:'Khi giới thiệu, người Nhật thường cúi chào nhẹ (おじぎ — ojigi). Cúi càng sâu càng lịch sự!' },
      ],
      quiz: [
        { q:'Câu mở đầu khi gặp ai đó lần đầu?', o: ['はじめまして','さようなら','おやすみなさい'] },
        { q:'ベトナムから きました nghĩa là:', o: ['Tôi đến từ Việt Nam.','Tôi sẽ đi Việt Nam.','Tôi là người Việt.'] },
        { q:'Câu kết thúc phần tự giới thiệu?', o: ['よろしく おねがいします','いただきます','ごちそうさま'] },
        { q:'"Tôi là sinh viên." nói thế nào?', o: ['わたしは がくせいです。','わたしの がくせいです。','がくせいは わたしです。'] },
      ],
    },
    g6: {
      sections: [
        { h:'Đuôi ます — lịch sự & dễ dùng', p:'Động từ dạng ます dùng được với mọi người. Chỉ cần đổi đuôi là đổi thì!',
          list: [['〜ます','làm (hiện tại / tương lai): たべます = ăn'], ['〜ません','không làm: たべません = không ăn'], ['〜ました','đã làm: たべました = đã ăn'], ['〜ませんでした','đã không làm: たべませんでした']] },
        { h:'Trợ từ を (đọc "o")', p:'を đứng sau thứ bị tác động: ăn CÁI GÌ, uống CÁI GÌ.',
          ex: [['すしを たべます。','sushi o tabemasu','Tôi ăn sushi.'], ['コーヒーを のみません。','koohii o nomimasen','Tôi không uống cà phê.'], ['きのう えいがを みました。','kinou eiga o mimashita','Hôm qua tôi đã xem phim.'], ['まいにち にほんごを べんきょうします。','mainichi nihongo o benkyou shimasu','Mỗi ngày tôi học tiếng Nhật.']] },
      ],
      quiz: [
        { q:'"Không ăn" là:', o: ['たべません','たべます','たべました'] },
        { q:'"Đã uống" là:', o: ['のみました','のみます','のみません'] },
        { q:'Điền trợ từ: すし ___ たべます。', o: ['を','に','の'], big: true },
        { q:'べんきょうします nghĩa là:', o: ['học','ăn','ngủ','chơi'] },
      ],
    },
  };

  // ===== BẠN CÓ BIẾT? =====
  SJ.FACTS = [
    'Tiếng Nhật dùng cùng lúc 3 bộ chữ: Hiragana, Katakana và Kanji. Siêu ngầu!',
    'Rất nhiều từ tiếng Nhật có gốc Hán — người Việt có lợi thế nhờ âm Hán Việt. 注意 (chuui) = CHÚ Ý!',
    'Hiragana được tạo ra từ cách viết thảo của chữ Hán, từ khoảng hơn 1000 năm trước.',
    'Người Nhật nói いただきます trước khi ăn để cảm ơn thức ăn và người nấu',
    'Núi Phú Sĩ (富士山) cao 3.776 m — là ngọn núi cao nhất Nhật Bản',
    '"Karaoke" là tiếng Nhật đó: カラ (kara = trống) + オケ (oke = dàn nhạc)',
    'Tiếng Nhật không có dấu cách giữa các từ — chính 3 bộ chữ giúp mắt bạn tách từ.',
    'Số 4 (し) đọc giống chữ "chết" (死) nên người Nhật hay đọc là よん',
    '日本 (Nhật Bản) nghĩa là "gốc của mặt trời" — đất nước mặt trời mọc',
    'かわいい (kawaii) nghĩa là dễ thương — y như bạn vậy đó!',
    'Manga được đọc từ phải sang trái, và từ trên xuống dưới',
    'Tàu siêu tốc Shinkansen có thể chạy hơn 300 km/h',
    'Hoa anh đào (桜 — sakura) thường nở rộ vào cuối tháng 3 đến đầu tháng 4',
    'Trong Katakana, dấu ー dùng để kéo dài âm: ケーキ = keeki (bánh kem)',
    'Phở trong tiếng Nhật là フォー (foo), bánh mì Việt Nam là バインミー (bainmii)',
    'Mèo vẫy tay 招き猫 (maneki-neko) được tin là mang lại may mắn và tài lộc',
    'Người Nhật cúi chào (おじぎ) thay vì bắt tay. Cúi càng sâu càng lịch sự',
    'Chỉ cần thuộc khoảng 100 Kanji, bạn đã đọc được rất nhiều biển hiệu ở Nhật rồi!',
  ];

  // Câu cổ vũ của mèo Mochi
  SJ.CHEERS = ['Giỏi quá!','Chuẩn luôn!','すごい! Đỉnh thật!','Tuyệt vời ông mặt trời!','Đúng rồi nè!','Thông minh ghê!','Mochi tự hào về bạn!','Quá dữ!','いいね! (Tốt lắm!)','Bạn là thiên tài!'];
  SJ.COMFORTS = ['Không sao, lần sau sẽ đúng!','Sai một chút thôi mà~','Cố lên! がんばって!','Nhớ mẹo này nha','Mochi tin bạn làm được!'];

  // ===== TÊN TIẾNG VIỆT → KATAKANA =====
  SJ.VN_NAMES = {
    nguyen:'グエン', tran:'チャン', le:'レー', pham:'ファム', hoang:'ホアン', huynh:'フイン', phan:'ファン', vu:'ヴー', vo:'ヴォー',
    dang:'ダン', bui:'ブイ', do:'ドー', ho:'ホー', ngo:'ゴー', duong:'ズオン', ly:'リー', dinh:'ディン', trinh:'チン', mai:'マイ', truong:'チュオン', lam:'ラム', luu:'ルウ', ha:'ハー', cao:'カオ', ta:'ター', thai:'タイ', to:'トー', doan:'ドアン', luong:'ルオン', van:'ヴァン', thi:'ティ', duc:'ドゥック', huu:'フウ', cong:'コン', quoc:'クオック', xuan:'スアン', ngoc:'ゴック', minh:'ミン', thanh:'タイン',
    anh:'アイン', linh:'リン', huong:'フオン', trang:'チャン', lan:'ラン', hung:'フン', dung:'ズン', tuan:'トゥアン', nam:'ナム', hai:'ハイ',
    long:'ロン', phuong:'フオン', thao:'タオ', thu:'トゥー', hang:'ハン', quan:'クアン', huy:'フイ', khoa:'コア', bao:'バオ', vy:'ヴィー',
    nhi:'ニー', trung:'チュン', son:'ソン', tam:'タム', hieu:'ヒエウ', hoa:'ホア', yen:'イエン', duy:'ズイ', kien:'キエン', tu:'トゥー',
    an:'アン', quynh:'クイン', giang:'ザン', khanh:'カイン', phuc:'フック', thuy:'トゥイ', ngan:'ガン', chi:'チー', hoai:'ホアイ', thien:'ティエン',
    dat:'ダット', viet:'ヴィエット', binh:'ビン', cuong:'クオン', hanh:'ハイン', loan:'ロアン', my:'ミー', nga:'ガー', oanh:'オアイン', tien:'ティエン',
    uyen:'ウエン', kim:'キム', gia:'ザー', khang:'カン', phat:'ファット', tai:'タイ', loc:'ロック', nhung:'ニュン', diep:'ジエップ', thang:'タン',
    vinh:'ヴィン', hien:'ヒエン', hau:'ハウ', nhung2:'ニュン', tuyet:'トゥエット', nhat:'ニャット', truc:'チュック', ha2:'ハー', dao:'ダオ', sang:'サン', tri:'チー', toan:'トアン', tuyen:'トゥエン', trieu:'チエウ', phong:'フォン', quang:'クアン', thuan:'トゥアン', khai:'カイ', man:'マン', nhu:'ニュー', hoang2:'ホアン',
  };
})(window.SJ);
