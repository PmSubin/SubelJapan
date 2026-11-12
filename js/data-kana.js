/* SubelJapan — Dữ liệu bảng chữ Hiragana & Katakana
 * Mỗi dòng: [chữ, romaji, đọc gần giống (tiếng Việt), mẹo nhớ, từ ví dụ, romaji ví dụ, nghĩa, emoji]
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const HIRA = [
    ['あ','a','a','Chữ thập ✚ có cái đuôi cuộn tròn — như bạn ngã chổng vó kêu "Á!"','あめ','ame','mưa','rain'],
    ['い','i','i','Hai sợi mì rơi song song, nét trái dài hơn — "i" như hai que tính.','いぬ','inu','con chó','dog'],
    ['う','u','ư','Một người cúi gập bụng kêu "Ư... ư..." vì ăn no quá','うみ','umi','biển','wave'],
    ['え','e','ê','Ninja đội mũ đang lướt đi — "Ê! Đợi tớ với!"','えき','eki','nhà ga','station'],
    ['お','o','ô','Giống あ nhưng có thêm chấm bay ra — "Ô! Có gì kìa!"','おかし','okashi','bánh kẹo','candy'],
    ['か','ka','ca','Lưỡi kiếm chém "Ka!" và tia lửa bắn ra bên cạnh','かさ','kasa','cái ô','umbrella'],
    ['き','ki','ki','Chiếc chìa khoá (key) có hai răng cưa.','きのこ','kinoko','cây nấm','mushroom'],
    ['く','ku','cư','Mỏ chim cu đang há ra kêu "cư cư"','くるま','kuruma','xe ô tô','car'],
    ['け','ke','kê','Cái kệ có thanh dọc bên trái và giá treo bên phải.','けむり','kemuri','khói','wind'],
    ['こ','ko','cô','Hai con cò nằm song song nghỉ ngơi.','こども','kodomo','trẻ em','kid'],
    ['さ','sa','xa','Giống き nhưng chỉ có 1 gạch — như cây non bị gió "sa" làm nghiêng','さかな','sakana','con cá','fish'],
    ['し','shi','si','Cái lưỡi câu — "si" mê câu cá','しお','shio','muối','salt'],
    ['す','su','xư','Sợi dây đu xoay một vòng rồi trượt xuống "xư~"','すし','sushi','sushi','sushi'],
    ['せ','se','xê','Chiếc xe đẩy nhìn nghiêng có tay cầm.','せかい','sekai','thế giới','globe'],
    ['そ','so','xô','Như tia sét zíc-zắc — "sợ" quá!','そら','sora','bầu trời','cloudsun'],
    ['た','ta','ta','Ghép chữ "t" và "a" lại: t + a = ta!','たまご','tamago','quả trứng','egg'],
    ['ち','chi','chi','Giống số 5 — "chi" lạ vậy?','ちず','chizu','bản đồ','map'],
    ['つ','tsu','chư (bật "ts")','Con sóng thần tsunami cuộn tới','つき','tsuki','mặt trăng','moon'],
    ['て','te','tê','Cánh tay duỗi ra — "te" là "tay" trong tiếng Nhật','て','te','bàn tay','hand'],
    ['と','to','tô','Cái dằm "to" đâm vào ngón chân','とり','tori','con chim','bird'],
    ['な','na','na','Cô gái quỳ bên cây thánh giá, tay cầm sợi dây thắt nút.','なつ','natsu','mùa hè','summer'],
    ['に','ni','ni','Một cột đứng cạnh hai gạch — hai gạch là số 2 = "ni"!','にく','niku','thịt','meat'],
    ['ぬ','nu','nư','Bát mì với đôi đũa bắt chéo — "nu-đồ"','ぬいぐるみ','nuigurumi','thú nhồi bông','bear'],
    ['ね','ne','nê','Con mèo (neko) nằm cuộn đuôi tròn','ねこ','neko','con mèo','cat'],
    ['の','no','nô','Biển cấm "NO" — một vòng tròn có gạch.','のり','nori','rong biển','onigiri'],
    ['は','ha','ha','Một người đứng cạnh cái cột, cười "ha ha"','はな','hana','bông hoa','sakura'],
    ['ひ','hi','hi','Cái miệng cười toe toét "hi hi"','ひと','hito','người','person'],
    ['ふ','fu','phư (thổi nhẹ)','Núi Phú Sĩ (Fuji) với mây bay quanh','ふね','fune','con thuyền','boat'],
    ['へ','he','hê','Ngọn đồi nhỏ — leo "hê" một cái là tới đỉnh','へや','heya','căn phòng','house'],
    ['ほ','ho','hô','Giống は nhưng thêm một gạch trên — "hô" to hơn!','ほし','hoshi','ngôi sao','star'],
    ['ま','ma','ma','Mẹ (mama) đang tết tóc thành vòng','まど','mado','cửa sổ','window'],
    ['み','mi','mi','Như số 21 viết tay — "mì" hai mươi mốt sợi','みず','mizu','nước','drop'],
    ['む','mu','mư','Con bò kêu "mư mư" (moo)','むし','mushi','côn trùng','bug'],
    ['め','me','mê','Con mắt có lông mi cong — "me" nghĩa là mắt','め','me','con mắt','eye'],
    ['も','mo','mô','Lưỡi câu móc hai miếng mồi — câu "mồi"','もも','momo','quả đào','peach'],
    ['や','ya','ya (như "gia" giọng Nam)','Cung tên bắn "Ya!" — mũi tên xuyên qua','やま','yama','ngọn núi','mountain'],
    ['ゆ','yu','yư (như "dư" giọng Nam)','Con cá bơi vòng tròn trong hồ','ゆき','yuki','tuyết','snow'],
    ['よ','yo','yô (như "dô" giọng Nam)','Người đang chơi yo-yo','よる','yoru','ban đêm','night'],
    ['ら','ra','ra / la (lưỡi búng nhẹ)','Số 5 lười biếng "la cà" ngồi nghỉ.','らいねん','rainen','năm sau','calendar'],
    ['り','ri','ri / li','Hai sợi dây treo lủng lẳng — giống い nhưng nét phải dài hơn.','りんご','ringo','quả táo','apple'],
    ['る','ru','rư / lư','Đường ray có vòng xoắn ở cuối như tàu lượn','るす','rusu','vắng nhà','house'],
    ['れ','re','rê / lê','Người quỳ gối, chân sau đá ra — "lê" bước.','れいぞうこ','reizouko','tủ lạnh','fridge'],
    ['ろ','ro','rô / lô','Giống る nhưng KHÔNG có vòng — con đường "rộng" thẳng tắp','ろうそく','rousoku','cây nến','fire'],
    ['わ','wa','oa','Giống ね nhưng không có vòng đuôi — "Oa! Mất đuôi rồi!"','わたし','watashi','tôi','wave_hand'],
    ['を','wo','ô (giống お)','Người nhảy "ô" qua hàng rào — chỉ dùng làm trợ từ.','ほんを よむ','hon o yomu','đọc sách','book'],
    ['ん','n','n / ng (âm mũi)','Giống chữ "n" viết tay','みかん','mikan','quả quýt','mandarin'],
  ];

  const KATA = [
    ['ア','a','Cái rìu (axe) — giống chữ "A" nghiêng','アイス','aisu','kem','icecream'],
    ['イ','i','Chú chim đại bàng (eagle) đậu trên cành','インク','inku','mực','pen'],
    ['ウ','u','Giống う nhưng có mũ vuông — ông cụ đội mũ kêu "ư".','ウール','uuru','len','yarn'],
    ['エ','e','Chiếc thang máy (elevator) — giống chữ I in hoa.','エアコン','eakon','máy lạnh','snow'],
    ['オ','o','Người dang tay chạy hớn hở "Ồ!"','オレンジ','orenji','quả cam','mandarin'],
    ['カ','ka','Giống か nhưng không có tia lửa — lưỡi dao sắc lẹm','カメラ','kamera','máy ảnh','camera'],
    ['キ','ki','Chìa khoá (key) gần giống き','キウイ','kiui','quả kiwi','kiwi'],
    ['ク','ku','Mỏ chim cu nhìn nghiêng — na ná く.','クラス','kurasu','lớp học','school'],
    ['ケ','ke','Giống chữ K bị lệch — "kê".','ケーキ','keeki','bánh kem','cake'],
    ['コ','ko','Góc của một chiếc hộp "cổ"','コーヒー','koohii','cà phê','coffee'],
    ['サ','sa','Cái bàn hai chân đang bày đĩa "xa-lát"','サッカー','sakkaa','bóng đá','ball'],
    ['シ','shi','Mặt cười có 2 mắt bên TRÁI, nét cuối hất từ dưới lên (khác ツ).','シーフード','shiifuudo','hải sản','fish'],
    ['ス','su','Người đang sải bước "xư" qua đường','スープ','suupu','món súp','pho'],
    ['セ','se','Giống せ nhưng gọn và vuông hơn.','セーター','seetaa','áo len','shirt'],
    ['ソ','so','Hai nét như mũi kim khâu — nét dài đi từ TRÊN xuống (khác ン).','ソファ','sofa','ghế sofa','chair'],
    ['タ','ta','Giống ク (mỏ chim cu) thêm một nét ở giữa — như chú chim ngậm thêm cành cây. "Ta" có thêm gì nào?','タクシー','takushii','taxi','car'],
    ['チ','chi','Cô cổ động viên (cheerleader) dang tay','チーズ','chiizu','phô mai','cheese'],
    ['ツ','tsu','Mặt cười có 2 mắt ở TRÊN, nét cuối kéo từ trên xuống (khác シ).','ツアー','tsuaa','chuyến du lịch','suitcase'],
    ['テ','te','Ăng-ten của cái tivi (テレビ)','テレビ','terebi','tivi','tv'],
    ['ト','to','Cái cột "totem" có một nhánh chìa ra.','トマト','tomato','cà chua','tomato'],
    ['ナ','na','Con dao (knife) cắt chéo một nhát — "na".','ナイフ','naifu','con dao','knife'],
    ['ニ','ni','Hai gạch = số 2 = "ni" (二)','テニス','tenisu','quần vợt','ball'],
    ['ヌ','nu','Đôi đũa gắp sợi mì "nu-đồ"','カヌー','kanuu','xuồng ca-nô','boat'],
    ['ネ','ne','Chú mèo "neko" đứng, đội mũ.','ネクタイ','nekutai','cà vạt','shirt'],
    ['ノ','no','Chỉ một nét xiên duy nhất — "No!"','ノート','nooto','quyển vở','notebook'],
    ['ハ','ha','Hai nét mở ra như miệng cười "ha"','ハンバーガー','hanbaagaa','hamburger','hamburger'],
    ['ヒ','hi','Người ngồi gác chân cười "hì hì".','ヒーロー','hiiroo','anh hùng','hero'],
    ['フ','fu','Như ふ bị là phẳng — một cái móc "phù".','フランス','furansu','nước Pháp','flag'],
    ['ヘ','he','Giống y hệt へ','ヘリコプター','herikoputaa','trực thăng','plane'],
    ['ホ','ho','Cây thánh giá có hai giọt nước — "hồ" nước bên cây','ホテル','hoteru','khách sạn','building'],
    ['マ','ma','Chiếc mặt nạ tam giác "ma" quái','マスク','masuku','khẩu trang','mask'],
    ['ミ','mi','Ba nét xiên — ba sợi "mì"','ミルク','miruku','sữa','milk'],
    ['ム','mu','Cánh tay gập lại gồng "mư"','ムービー','muubii','bộ phim','tv'],
    ['メ','me','Dấu X đánh dấu kho báu — "mê" cung','メロン','meron','dưa lưới','melon'],
    ['モ','mo','Giống も nhưng nét thẳng hơn.','モデル','moderu','người mẫu','person'],
    ['ヤ','ya','Giống や — cung tên bắn "Ya!"','タイヤ','taiya','lốp xe','car'],
    ['ユ','yu','Hình chữ U quay đầu (U-turn)','ユニフォーム','yunifoomu','đồng phục','shirt'],
    ['ヨ','yo','Chữ E bị quay ngược — "Yo!"','ヨーグルト','yooguruto','sữa chua','bowl'],
    ['ラ','ra','Số 7 có cái nắp đậy phía trên.','ラジオ','rajio','radio','music'],
    ['リ','ri','Giống り nhưng thẳng tắp hơn.','リボン','ribon','ruy băng','ribbon'],
    ['ル','ru','Hai cái chân dài đang đi "rư rư"','ルール','ruuru','luật lệ','note'],
    ['レ','re','Như dấu tích ✓ (hay chữ L nghiêng) — "lê" đúng rồi!','レモン','remon','chanh vàng','lemon'],
    ['ロ','ro','Cái hộp vuông — giống chữ Hán 口 (miệng).','ロボット','robotto','rô-bốt','robot'],
    ['ワ','wa','Ly rượu vang (wine) — "oa".','ワイン','wain','rượu vang','wine'],
    ['ヲ','wo','Giống フ có thêm gạch ngang — rất hiếm khi dùng.','','','',''],
    ['ン','n','Mặt cười nháy mắt — nét dài đi từ DƯỚI lên (khác ソ).','パン','pan','bánh mì','bread'],
  ];

  // Âm đục (dakuten ゛) & bán đục (handakuten ゜)
  const DAKU = [
    ['が','ga','ga'],['ぎ','gi','ghi'],['ぐ','gu','gư'],['げ','ge','ghê'],['ご','go','gô'],
    ['ざ','za','da (giọng Bắc)'],['じ','ji','di (giọng Bắc)'],['ず','zu','dư (giọng Bắc)'],['ぜ','ze','dê (giọng Bắc)'],['ぞ','zo','dô (giọng Bắc)'],
    ['だ','da','đa'],['ぢ','ji','di (hiếm dùng)'],['づ','zu','dư (hiếm dùng)'],['で','de','đê'],['ど','do','đô'],
    ['ば','ba','ba'],['び','bi','bi'],['ぶ','bu','bư'],['べ','be','bê'],['ぼ','bo','bô'],
    ['ぱ','pa','pa'],['ぴ','pi','pi'],['ぷ','pu','pư'],['ぺ','pe','pê'],['ぽ','po','pô'],
  ];
  // Âm ghép (yōon)
  const YOON = [
    ['きゃ','kya','kia'],['きゅ','kyu','kiu'],['きょ','kyo','kiô'],
    ['しゃ','sha','sa (uốn lưỡi)'],['しゅ','shu','sư (uốn lưỡi)'],['しょ','sho','sô (uốn lưỡi)'],
    ['ちゃ','cha','cha'],['ちゅ','chu','chư'],['ちょ','cho','chô'],
    ['にゃ','nya','nha'],['にゅ','nyu','như'],['にょ','nyo','nhô'],
    ['ひゃ','hya','hia'],['ひゅ','hyu','hiu'],['ひょ','hyo','hiô'],
    ['みゃ','mya','mia'],['みゅ','myu','miu'],['みょ','myo','miô'],
    ['りゃ','rya','ria'],['りゅ','ryu','riu'],['りょ','ryo','riô'],
    ['ぎゃ','gya','ghia'],['ぎゅ','gyu','ghiu'],['ぎょ','gyo','ghiô'],
    ['じゃ','ja','gia'],['じゅ','ju','giư'],['じょ','jo','giô'],
    ['びゃ','bya','bia'],['びゅ','byu','biu'],['びょ','byo','biô'],
    ['ぴゃ','pya','pia'],['ぴゅ','pyu','piu'],['ぴょ','pyo','piô'],
  ];
  // Âm mở rộng của Katakana (dùng cho từ nước ngoài)
  const EXT = [
    ['ファ','fa','pha','フ + ァ nhỏ → "fa"','ファン','fan','người hâm mộ','wave_hand'],
    ['フィ','fi','phi','フ + ィ nhỏ → "fi"','フィルム','firumu','cuộn phim','camera'],
    ['フェ','fe','phê','フ + ェ nhỏ → "fe"','カフェ','kafe','quán cà phê','coffee'],
    ['フォ','fo','phô','フ + ォ nhỏ → "fo"','フォー','foo','phở','pho'],
    ['ティ','ti','ti','テ + ィ nhỏ → "ti"','パーティー','paatii','bữa tiệc','party'],
    ['ディ','di','đi','デ + ィ nhỏ → "di"','ディズニー','dizunii','Disney','torii'],
    ['チェ','che','chê','チ + ェ nhỏ → "che"','チェック','chekku','kiểm tra','check'],
    ['シェ','she','sê','シ + ェ nhỏ → "she"','シェフ','shefu','đầu bếp','chef'],
    ['ジェ','je','giê','ジ + ェ nhỏ → "je"','ジェット','jetto','máy bay phản lực','plane'],
    ['ウィ','wi','uy','ウ + ィ nhỏ → "wi"','ウィンク','winku','nháy mắt','wink'],
    ['ウェ','we','uê','ウ + ェ nhỏ → "we"','ウェブ','webu','trang web','globe'],
    ['ウォ','wo','uô','ウ + ォ nhỏ → "wo"','ウォーター','wootaa','nước (water)','drop'],
    ['ヴ','vu','vư','ウ + ゛ → âm "v" (khá hiếm)','ラヴ','ravu','tình yêu (love)','heart'],
    ['ヴァ','va','va','ヴ + ァ nhỏ → "va"','ヴァイオリン','vaiorin','đàn violin','music'],
    ['ヴィ','vi','vi','ヴ + ィ nhỏ → "vi"','ヴィーガン','viigan','người ăn chay thuần','cabbage'],
    ['ヴェ','ve','vê','ヴ + ェ nhỏ → "ve"','ヴェール','veeru','khăn voan',''],
    ['ヴォ','vo','vô','ヴ + ォ nhỏ → "vo"','ヴォーカル','vookaru','ca sĩ hát chính','music'],
    ['イェ','ye','yê','イ + ェ nhỏ → "ye"','イェス','yesu','yes (vâng)','maru'],
    ['トゥ','tu','tư','ト + ゥ nhỏ → "tu"','タトゥー','tatuu','hình xăm',''],
    ['ドゥ','du','đư','ド + ゥ nhỏ → "du"','ドゥーイット','duuitto','làm đi (do it)','cheer'],
    ['ツァ','tsa','tsa','ツ + ァ nhỏ → "tsa"','モーツァルト','mootsaruto','Mozart','music'],
  ];
  // Chữ nhỏ — dùng để ghép âm (ゃゅょ), ngắt âm (っ) hoặc tạo âm mới (ァィゥェォ)
  const SMALL = [
    ['ぁ','a','a (nhỏ)','あ thu nhỏ — ghép sau chữ khác để tạo âm mới'],['ぃ','i','i (nhỏ)','い thu nhỏ — ghép để tạo âm mới'],
    ['ぅ','u','ư (nhỏ)','う thu nhỏ — ghép để tạo âm mới'],['ぇ','e','ê (nhỏ)','え thu nhỏ — ghép để tạo âm mới'],
    ['ぉ','o','ô (nhỏ)','お thu nhỏ — ghép để tạo âm mới'],['っ','(ngắt)','nín 1 nhịp','つ nhỏ — dừng 1 nhịp, gấp đôi phụ âm sau: きって = kitte'],
    ['ゃ','ya','ya (nhỏ)','や nhỏ — ghép sau cột i: き + ゃ = きゃ'],['ゅ','yu','yư (nhỏ)','ゆ nhỏ — ghép sau cột i: し + ゅ = しゅ'],
    ['ょ','yo','yô (nhỏ)','よ nhỏ — ghép sau cột i: ち + ょ = ちょ'],['ゎ','wa','oa (nhỏ)','わ nhỏ — rất hiếm gặp'],
  ];

  // Từ ví dụ cho âm đục & âm ghép
  const EXAMPLES = {
    'が':['がっこう','gakkou','trường học','school'],'ぎ':['うさぎ','usagi','con thỏ','rabbit'],'ぐ':['かぐ','kagu','đồ nội thất','chair'],'げ':['げんき','genki','khoẻ khoắn','cheer'],'ご':['ごはん','gohan','cơm','rice'],
    'ざ':['ざっし','zasshi','tạp chí','note'],'じ':['じかん','jikan','thời gian','alarm'],'ず':['ちず','chizu','bản đồ','map'],'ぜ':['かぜ','kaze','gió','wind'],'ぞ':['ぞう','zou','con voi','elephant'],
    'だ':['だいがく','daigaku','đại học','gradcap'],'ぢ':['はなぢ','hanaji','chảy máu cam','nosebleed'],'づ':['つづく','tsuzuku','tiếp tục','arrow_r'],'で':['でんわ','denwa','điện thoại','phone'],'ど':['どうぶつ','doubutsu','động vật','paw'],
    'ば':['ばら','bara','hoa hồng','flower'],'び':['えび','ebi','con tôm','shrimp'],'ぶ':['ぶた','buta','con lợn','pig'],'べ':['べんとう','bentou','cơm hộp','bowl'],'ぼ':['ぼうし','boushi','cái mũ','kid'],
    'ぱ':['かんぱい','kanpai','cạn ly!','party'],'ぴ':['えんぴつ','enpitsu','bút chì','pencil'],'ぷ':['てんぷら','tenpura','tempura','fish'],'ぺ':['ぺこぺこ','pekopeko','đói meo','yum'],'ぽ':['さんぽ','sanpo','đi dạo','walk'],
    'きゃ':['きゃく','kyaku','khách','suitcase'],'きゅ':['きゅうり','kyuuri','dưa chuột','cucumber'],'きょ':['きょう','kyou','hôm nay','calendar'],
    'しゃ':['しゃしん','shashin','bức ảnh','camera'],'しゅ':['しゅくだい','shukudai','bài tập về nhà','note'],'しょ':['としょかん','toshokan','thư viện','books'],
    'ちゃ':['おちゃ','ocha','trà','tea'],'ちゅ':['ちゅうい','chuui','chú ý','question'],'ちょ':['ちょっと','chotto','một chút',''],
    'にゃ':['にゃあ','nyaa','meo meo','cat'],'にゅ':['にゅうがく','nyuugaku','nhập học','backpack'],'にょ':['にょろにょろ','nyoronyoro','ngoằn ngoèo','snake'],
    'ひゃ':['ひゃく','hyaku','một trăm','n100'],'ひゅ':['ひゅう','hyuu','vù vù (tiếng gió)','wind'],'ひょ':['ひょう','hyou','con báo','cat'],
    'みゃ':['みゃく','myaku','mạch đập','heart'],'みょ':['みょうじ','myouji','họ (tên họ)','nametag'],
    'りゃ':['りゃく','ryaku','viết tắt','pen'],'りゅ':['りゅう','ryuu','con rồng','dragon'],'りょ':['りょこう','ryokou','du lịch','plane'],
    'ぎゃ':['ぎゃく','gyaku','ngược lại','refresh'],'ぎゅ':['ぎゅうにく','gyuuniku','thịt bò','meat'],'ぎょ':['きんぎょ','kingyo','cá vàng','fish'],
    'じゃ':['じゃがいも','jagaimo','khoai tây','potato'],'じゅ':['じゅぎょう','jugyou','giờ học','school'],'じょ':['じょうず','jouzu','giỏi','thumb'],
    'びゃ':['さんびゃく','sanbyaku','ba trăm','n100'],'びょ':['びょういん','byouin','bệnh viện','building'],
    'ぴゃ':['はっぴゃく','happyaku','tám trăm','n100'],'ぴょ':['ぴょんぴょん','pyonpyon','nhảy tưng tưng','rabbit'],
    'びゅ':['びゅんびゅん','byunbyun','vun vút (gió, xe lao nhanh)','wind'],'ぴゅ':['ぴゅうぴゅう','pyuupyuu','vù vù (gió thổi)','wind'],
    'ガ':['ガム','gamu','kẹo cao su','candy'],'ギ':['ギター','gitaa','đàn guitar','music'],'グ':['グラス','gurasu','cái ly','wine'],'ゲ':['ゲーム','geemu','trò chơi','game'],'ゴ':['ゴルフ','gorufu','môn golf','ball'],
    'ザ':['ピザ','piza','pizza','pizza'],'ジ':['ジーンズ','jiinzu','quần jean','jeans'],'ズ':['ズボン','zubon','cái quần','trousers'],'ゼ':['ゼロ','zero','số 0','n0'],'ゾ':['ゾンビ','zonbi','thây ma','zombie'],
    'ダ':['ダンス','dansu','nhảy múa','music'],'デ':['デパート','depaato','trung tâm thương mại','building'],'ド':['ドア','doa','cánh cửa','house'],
    'バ':['バナナ','banana','quả chuối','banana'],'ビ':['ビール','biiru','bia','beer'],'ブ':['ブログ','burogu','blog','tv'],'ベ':['ベトナム','betonamu','Việt Nam','flag_vn'],'ボ':['ボール','booru','quả bóng','ball'],
    'パ':['パンダ','panda','gấu trúc','panda'],'ピュ':['コンピューター','konpyuutaa','máy tính','keyboard'],'ピョ':['ピョンピョン','pyonpyon','nhảy tưng tưng (tiếng tượng hình)','rabbit'],'ピ':['ピアノ','piano','đàn piano','music'],'プ':['プール','puuru','bể bơi','wave'],'ペ':['ペン','pen','cây bút','pen'],'ポ':['ポスト','posuto','hòm thư','postbox'],
    'キャ':['キャンディー','kyandii','kẹo','candy'],'キュ':['バーベキュー','baabekyuu','tiệc nướng BBQ','meat'],'キョ':['キョロキョロ','kyorokyoro','ngó nghiêng khắp nơi','eye'],
    'シャ':['シャワー','shawaa','vòi sen','drop'],'シュ':['シュークリーム','shuukuriimu','bánh su kem','cake'],'ショ':['ショッピング','shoppingu','mua sắm','bag'],
    'チャ':['チャンス','chansu','cơ hội','clover'],'チュ':['チューリップ','chuurippu','hoa tulip','tulip'],'チョ':['チョコレート','chokoreeto','sô-cô-la','chocolate'],
    'ニャ':['ニャー','nyaa','meo (tiếng mèo kêu)','cat'],'ニュ':['メニュー','menyuu','thực đơn','note'],'ニョ':['ニョッキ','nyokki','bánh gnocchi (món Ý)',''],
    'ヒュ':['ヒューズ','hyuuzu','cầu chì (fuse)','bolt'],'ヒョ':['ヒョウ','hyou','con báo (tên loài vật hay viết Katakana)','cat'],'ミョ':['ミョウガ','myouga','gừng myoga (rau gia vị Nhật)','leaf'],
    'リャ':['リャマ','ryama','lạc đà không bướu (llama)','llama'],'ギュ':['フィギュア','figyua','mô hình nhân vật (figure)','robot'],'ミャ':['ミャンマー','myanmaa','Myanmar','flag'],'ミュ':['ミュージック','myuujikku','âm nhạc','music'],
    'リュ':['リュック','ryukku','ba lô','backpack'],'ギャ':['ギャグ','gyagu','trò đùa','laugh'],'ギョ':['ギョーザ','gyooza','bánh gyoza','gyoza'],
    'ジャ':['ジャズ','jazu','nhạc jazz','music'],'ジュ':['ジュース','juusu','nước ép','juice'],'ジョ':['ジョギング','jogingu','chạy bộ','walk'],'ビュ':['ビュッフェ','byuffe','buffet','bowl'],
  };

  const toKata = s => s.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
  const toHira = s => s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  SJ.toKata = toKata; SJ.toHira = toHira;

  const ALL = [];
  const MAP = {};
  const add = (o) => { ALL.push(o); MAP[o.k] = o; return o; };
  const ex = (a) => (a && a[0])? { jp: a[0], r: a[1], vi: a[2], e: a[3] }: null;
  const vByR = {};
  HIRA.forEach(a => { vByR[a[1]] = a[2]; });

  const H_BASIC = HIRA.map(a => add({ k: a[0], r: a[1], v: a[2], m: a[3], w: ex(a.slice(4)), script:'hira', group:'basic' }));
  const K_BASIC = KATA.map(a => add({ k: a[0], r: a[1], v: vByR[a[1]], m: a[2], w: ex(a.slice(3)), script:'kata', group:'basic' }));

  const markName = (m) => m ==='゙'?'゛ (ten-ten)':'゜ (maru)';
  function dakuEntry(a, script) {
    const k = script ==='kata'? toKata(a[0]): a[0];
    const nfd = k.normalize('NFD');
    const base = nfd[0];
    const baseR = (MAP[base] || {}).r ||'';
    const m =`${base} (${baseR}) + dấu ${markName(nfd[1])} → âm "${a[1]}"` + (nfd[1] ==='゚'?' — vòng tròn nhỏ biến "h" thành "p".':' — hai chấm nhỏ làm âm "đục" hơn.');
    return add({ k, r: a[1], v: a[2], m, w: ex(EXAMPLES[k]), script, group:'daku' });
  }
  function yoonEntry(a, script) {
    const k = script ==='kata'? toKata(a[0]): a[0];
    const first = k[0], small = k[1];
    const fr = (MAP[first] || {}).r ||'';
    const m =`${first} (${fr}) + ${small} nhỏ → đọc liền một hơi thành "${a[1]}"`;
    return add({ k, r: a[1], v: a[2], m, w: ex(EXAMPLES[k]), script, group:'yoon' });
  }
  const H_DAKU = DAKU.map(a => dakuEntry(a,'hira'));
  const K_DAKU = DAKU.map(a => dakuEntry(a,'kata'));
  const H_YOON = YOON.map(a => yoonEntry(a,'hira'));
  const K_YOON = YOON.map(a => yoonEntry(a,'kata'));
  const K_EXT = EXT.map(a => add({ k: a[0], r: a[1], v: a[2], m: a[3], w: ex(a.slice(4)), script:'kata', group:'ext' }));
  const H_SMALL = SMALL.map(a => add({ k: a[0], r: a[1], v: a[2], m: a[3], w: null, script:'hira', group:'small' }));
  const K_SMALL = SMALL.map(a => add({ k: toKata(a[0]), r: a[1], v: a[2], m: a[3].replace(/[ぁ-ゖ]/g, c => toKata(c)), w: null, script:'kata', group:'small' }));

  SJ.KANA = {
    hira: { basic: H_BASIC, daku: H_DAKU, yoon: H_YOON, small: H_SMALL },
    kata: { basic: K_BASIC, daku: K_DAKU, yoon: K_YOON, ext: K_EXT, small: K_SMALL },
  };
  /** Bảng 50 âm theo hàng (phụ âm) × cột (a i u e o) */
  SJ.GOJUON = {
    cols: ['a', 'i', 'u', 'e', 'o'],
    basic: [['', 'あいうえお'], ['k', 'かきくけこ'], ['s', 'さしすせそ'], ['t', 'たちつてと'], ['n', 'なにぬねの'], ['h', 'はひふへほ'], ['m', 'まみむめも'], ['y', 'や_ゆ_よ'], ['r', 'らりるれろ'], ['w', 'わ___を'], ['n', 'ん____']],
    daku: [['g', 'がぎぐげご'], ['z', 'ざじずぜぞ'], ['d', 'だぢづでど'], ['b', 'ばびぶべぼ'], ['p', 'ぱぴぷぺぽ']],
    yoonCols: ['ya', 'yu', 'yo'],
    yoon: ['k', 'sh', 'ch', 'n', 'h', 'm', 'r', 'g', 'j', 'b', 'p'].map((c, i) => [c, H_YOON.slice(i * 3, i * 3 + 3).map(o => o.k)]),
  };
  SJ.KANA_ALL = ALL;
  SJ.KANA_MAP = MAP;

  // Các cách gõ romaji khác được chấp nhận trong trò chơi
  SJ.ROMAJI_ALT = {
    shi: ['si'], chi: ['ti'], tsu: ['tu'], fu: ['hu'], ji: ['zi','di'], zu: ['du'], wo: ['o'], n: ['nn'],
    sha: ['sya'], shu: ['syu'], sho: ['syo'], cha: ['tya','cya'], chu: ['tyu','cyu'], cho: ['tyo','cyo'],
    ja: ['zya','jya'], ju: ['zyu','jyu'], jo: ['zyo','jyo'],
  };

  // Bố cục bảng chữ cái (null = ô trống)
  SJ.CHART_LAYOUT = [
    'あいうえお','かきくけこ','さしすせそ','たちつてと','なにぬねの','はひふへほ','まみむめも',
    ['や', null,'ゆ', null,'よ'],'らりるれろ', ['わ', null, null, null,'を'], ['ん', null, null, null, null],
  ];

  /** Lấy danh sách chữ theo bộ để chơi game */
  SJ.pool = function (set) {
    const K = SJ.KANA;
    switch (set) {
      case'hira-basic': return K.hira.basic.slice();
      case'hira-all': return K.hira.basic.concat(K.hira.daku, K.hira.yoon);
      case'kata-basic': return K.kata.basic.slice();
      case'kata-all': return K.kata.basic.concat(K.kata.daku, K.kata.yoon);
      case'mix': return K.hira.basic.concat(K.kata.basic);
      case'learned': {
        const items = (SJ.store && SJ.store.get().items) || {};
        const got = ALL.filter(o => items[o.k]);
        return got.length >= 8? got: K.hira.basic.slice();
      }
      default: return K.hira.basic.slice();
    }
  };
  SJ.POOL_SETS = [
    ['hira-basic','Hiragana cơ bản'], ['hira-all','Hiragana đầy đủ'],
    ['kata-basic','Katakana cơ bản'], ['kata-all','Katakana đầy đủ'],
    ['mix','Trộn cả hai'], ['learned','Chữ mình đã học'],
  ];
})(window.SJ);

/* Các chữ dễ nhầm + mẹo phân biệt */
(function (SJ) {
  SJ.CONFUSE = [
    ['あ', 'お', 'め'], ['い', 'り', 'こ'], ['う', 'ら'], ['き', 'さ', 'ち'], ['し', 'つ'], ['ぬ', 'め'], ['ね', 'れ', 'わ'], ['は', 'ほ', 'ま'],
    ['る', 'ろ'], ['く', 'へ'], ['た', 'な'], ['シ', 'ツ'], ['ソ', 'ン'], ['ク', 'ケ', 'タ'], ['コ', 'ユ', 'ロ'], ['ス', 'ヌ', 'ム'],
    ['チ', 'テ'], ['ウ', 'ワ', 'フ'], ['ア', 'マ'], ['ノ', 'メ'], ['ラ', 'ヲ'], ['カ', 'か'], ['ヘ', 'へ'], ['リ', 'り'], ['キ', 'き'], ['セ', 'せ'], ['モ', 'も'],
  ];
  SJ.CONFUSE_TIPS = {
    'シツ': 'シ (shi): 2 chấm xếp DỌC bên trái, nét dài hất từ DƯỚI lên. ツ (tsu): 2 chấm nằm NGANG ở trên, nét dài kéo từ TRÊN xuống.',
    'ソン': 'ソ (so): chấm ở trên, nét dài kéo từ TRÊN xuống. ン (n): chấm bên trái, nét dài hất từ DƯỚI lên.',
    'ぬめ': 'ぬ (nu) có vòng xoắn nhỏ ở cuối, め (me) thì không.',
    'ねれわ': 'Nhìn đuôi: ね (ne) cuộn vòng, れ (re) hất lên như chân đá, わ (wa) cong tròn.',
    'るろ': 'る (ru) có vòng tròn nhỏ ở cuối, ろ (ro) thì không.',
    'きさち': 'き (ki) có 2 gạch ngang, さ (sa) chỉ 1 gạch. ち (chi) là さ quay ngược.',
    'しつ': 'し (shi) móc lên phía phải như lưỡi câu, つ (tsu) uốn cong như con sóng.',
    'はほま': 'は (ha) 1 gạch, ほ (ho) 2 gạch và nét dọc không nhô lên trên, ま (ma) không có nét dọc bên trái.',
    'あおめ': 'あ (a) có nét dọc cong, お (o) có chấm nhỏ bên phải, め (me) không có gạch ngang.',
    'いりこ': 'い (i) 2 nét gần bằng nhau, り (ri) nét phải dài hơn, こ (ko) 2 nét nằm ngang.',
    'クケタ': 'ク (ku) 2 nét, ケ (ke) có nét ngang chìa ra, タ (ta) có thêm nét chéo ở giữa.',
    'コユロ': 'コ (ko) hở bên trái, ユ (yu) có nét ngang dưới dài, ロ (ro) khép kín.',
    'スヌム': 'ス (su) chân dang ra, ヌ (nu) có nét chéo cắt ngang, ム (mu) có vòng tam giác.',
    'チテ': 'チ (chi) nét dọc cong xuống cắt nét ngang, テ (te) có 2 nét ngang ở trên.',
    'ウワフ': 'ウ (u) có nét chấm trên đầu, ワ (wa) có nét dọc bên trái, フ (fu) chỉ 1 nét.',
    'アマ': 'ア (a) nét thứ 2 dài xuống trái, マ (ma) có chấm nhỏ ở giữa.',
    'ノメ': 'ノ (no) 1 nét xiên, メ (me) có thêm nét chéo cắt qua.',
    'ラヲ': 'ラ (ra) có nét ngang nhỏ trên đầu, ヲ (wo) có 2 nét ngang.',
    'うら': 'う (u): nét trên là gạch ngang ngắn, nét dưới đi ngang rồi uốn cong xuống. ら (ra): nét trên là chấm xiên, nét dưới có thanh dọc bên trái rồi mới uốn cong — như số 5 thiếu gạch đầu.',
    'くへ': 'く (ku) đứng dọc như dấu "<", mở sang phải. へ (he) nằm ngang như mái nhà "^", nét bên phải dài hơn.',
    'たな': 'Cả hai bắt đầu bằng chữ thập ✚ bên trái. た (ta): bên phải là hai gạch như こ. な (na): bên phải là chấm nhỏ và nét có vòng thắt nút ở dưới.',
  };
  /** Các chữ dễ nhầm với ch (không gồm chính nó) + mẹo nếu có */
  SJ.confusables = function (ch) {
    const out = new Set(); let tip = '';
    SJ.CONFUSE.forEach(g => { if (g.includes(ch)) { g.forEach(x => { if (x !== ch) out.add(x); }); const t = SJ.CONFUSE_TIPS[g.join('')]; if (t && !tip) tip = t; } });
    return { list: Array.from(out), tip };
  };
})(window.SJ);

/* Hình gợi nhớ cho mẹo nhớ (mã hoá kép — dual coding: chữ + hình nhớ lâu hơn chữ không).
 * Chỉ ghép khi hình KHỚP đúng câu mẹo nhớ (か = thanh kiếm "Ka!", き = chìa khoá, ね = con mèo…); chữ nào chưa có hình hợp thì để trống. */
(function (SJ) {
  SJ.MNEMO_PIC = {
    // Hiragana
    'あ': 'dizzy', 'い': 'ramen', 'う': 'yum', 'え': 'ninja', 'お': 'wow', 'か': 'sword', 'き': 'key', 'く': 'bird', 'け': 'books', 'こ': 'sleep',
    'さ': 'sprout', 'し': 'fish_rod', 'せ': 'cart', 'そ': 'bolt', 'た': 'pencil', 'ち': 'n5', 'つ': 'wave', 'て': 'hand', 'と': 'footprints',
    'な': 'ribbon', 'に': 'n2', 'ぬ': 'bowl', 'ね': 'cat', 'の': 'batsu', 'は': 'laugh', 'ひ': 'happy', 'ふ': 'fuji', 'へ': 'mountain', 'ほ': 'speaker',
    'ま': 'mom', 'み': 'pho', 'む': 'cow', 'め': 'eye', 'も': 'bug', 'や': 'target', 'ゆ': 'fish', 'よ': 'yoyo', 'ら': 'slow', 'り': 'dangle', 'る': 'coaster', 'れ': 'walk', 'ろ': 'map', 'わ': 'teary', 'を': 'hurdle', 'ん': 'write', 'す': 'swing',
    // Katakana
    'ア': 'axe', 'イ': 'bird', 'オ': 'run_happy', 'ケ': 'block_k', 'ソ': 'needle', 'タ': 'bird_twig', 'ト': 'totem', 'ヒ': 'sit_laugh', 'フ': 'hook', 'ム': 'muscle',
    'ユ': 'uturn', 'ヨ': 'mirror_e', 'ラ': 'seven_lid', 'リ': 'dangle', 'レ': 'tick', 'ロ': 'square_mouth', 'ン': 'face_n', 'ウ': 'grandpa', 'エ': 'building', 'カ': 'sword', 'キ': 'key', 'ク': 'bird', 'コ': 'gift', 'サ': 'cabbage', 'シ': 'face_side', 'ス': 'walk',
    'セ': 'cart', 'チ': 'cheer', 'ツ': 'face_up', 'テ': 'tv', 'ナ': 'knife', 'ニ': 'n2', 'ヌ': 'ramen', 'ネ': 'cat', 'ノ': 'batsu', 'ハ': 'laugh',
    'ヘ': 'mountain', 'ホ': 'drop', 'マ': 'mask', 'ミ': 'pho', 'メ': 'chest', 'モ': 'bug', 'ヤ': 'target', 'ル': 'footprints', 'ワ': 'wine',
  };
  /** khung mẹo nhớ: có hình gợi nhớ (kèm chữ nhỏ ở góc) nếu có, không thì bóng đèn như cũ */
  SJ.mnemoBox = function (k, text, extraCls) {
    const pic = SJ.MNEMO_PIC[k], esc = SJ.ui.esc;
    if (!pic || !SJ.hasIcon(pic)) return `<div class="mnemo ${extraCls || ''}">${SJ.icon('bulb', 28)}<span>${esc(text)}</span></div>`;
    return `<div class="mnemo has-pic ${extraCls || ''}"><span class="mn-pic">${SJ.icon(pic, 58)}<b class="mn-k kana">${k}</b></span><span><small class="mn-lab">Mẹo nhớ bằng hình</small>${esc(text)}</span></div>`;
  };
})(window.SJ);
