/* SubelJapan — Lộ trình bài học */
window.SJ = window.SJ || {};
(function (SJ) {
  const ch = s => Array.from(s);
  const K = s => ch(s).map(SJ.toKata).join('');
  const kyoon = arr => arr.map(SJ.toKata);
  const Y1 = ['きゃ','きゅ','きょ','しゃ','しゅ','しょ','ちゃ','ちゅ','ちょ','にゃ','にゅ','にょ','ひゃ','ひゅ','ひょ'];
  const Y2 = ['みゃ','みゅ','みょ','りゃ','りゅ','りょ','ぎゃ','ぎゅ','ぎょ','じゃ','じゅ','じょ','びゃ','びゅ','びょ','ぴゃ','ぴゅ','ぴょ'];

  const kanaRows = [
    ['あいうえお','5 nguyên âm','Năm nguyên âm là "xương sống" của mọi âm tiếng Nhật. Đọc là a – i – ư – ê – ô nhé!'],
    ['かきくけこ','Hàng K','Ghép "k" với 5 nguyên âm là ra ka – ki – ku – ke – ko. Dễ như ăn bánh!'],
    ['さしすせそ','Hàng S','Chú ý し đọc là "shi" (si) chứ không phải "si" cứng đâu nha~'],
    ['たちつてと','Hàng T','Hàng này có 2 bạn đặc biệt: ち (chi) và つ (tsu). Cố lên!'],
    ['なにぬねの','Hàng N','Hàng N toàn chữ dễ thương: ねこ (con mèo) có ở đây nè'],
    ['はひふへほ','Hàng H','ふ đọc là "fu" — thổi nhẹ như thổi nến'],
    ['まみむめも','Hàng M','Hàng M ngọt ngào như もも (quả đào)'],
    ['やゆよわをん','Hàng Y, W & N','Chỉ có や ゆ よ, わ を và chữ ん đặc biệt — chữ duy nhất không có nguyên âm!'],
    ['らりるれろ','Hàng R','Âm R tiếng Nhật nằm giữa "r" và "l" — búng lưỡi nhẹ thôi nha.'],
  ];
  const kanaLesson = (script, i, row) => ({
    id: (script ==='hira'?'h':'k') + (i + 1),
    title: ch(script ==='hira'? row[0]: K(row[0])).join(' '),
    sub: row[1], type:'kana', items: ch(script ==='hira'? row[0]: K(row[0])), intro: row[2],
  });

  SJ.UNITS = [
    {
      id:'start', title:'Khởi động', jp:'はじめ', icon:'sprout', color:'#ff835f', desc:'Làm quen với tiếng Nhật trong 5 phút',
      lessons: [{ id:'intro', title:'Tiếng Nhật là gì?', sub:'3 bộ chữ & phát âm', type:'text', content:'intro', icon:'flag_jp' }],
    },
    {
      id:'hira', title:'Hiragana', jp:'ひらがな', icon:'sakura', color:'#ff6b9a', desc:'Bộ chữ mềm mại — nền móng của tiếng Nhật',
      lessons: kanaRows.map((r, i) => kanaLesson('hira', i, r)).concat([
        { id:'h10', title:'が ざ', sub:'Âm đục (1)', type:'kana', items: ch('がぎぐげござじずぜぞ'), intro:'Thêm hai chấm ゛ (ten-ten) là âm trở nên "đục": か → が, さ → ざ. Siêu dễ!' },
        { id:'h11', title:'だ ば', sub:'Âm đục (2)', type:'kana', items: ch('だぢづでどばびぶべぼ'), intro:'た → だ, は → ば. ぢ và づ đọc giống じ và ず nhưng rất hiếm gặp.' },
        { id:'h12', title:'ぱ ぴ ぷ ぺ ぽ', sub:'Âm bán đục', type:'kana', items: ch('ぱぴぷぺぽ'), intro:'Vòng tròn nhỏ ゜ (maru) biến は thành ぱ — âm "p" bật hơi vui tai' },
        { id:'h13', title:'きゃ しゃ ちゃ', sub:'Âm ghép (1)', type:'kana', items: Y1, intro:'Chữ cột i + ゃゅょ viết nhỏ → đọc liền một hơi: き + ゃ = きゃ (kya).' },
        { id:'h14', title:'みゃ りゃ じゃ', sub:'Âm ghép (2)', type:'kana', items: Y2, intro:'Phần còn lại của âm ghép. Bạn đã biết quy tắc rồi, giờ chỉ cần luyện thôi!' },
        { id:'h15', title:'っ & trường âm', sub:'Quy tắc đặc biệt', type:'text', content:'special', icon:'music' },
        { id:'h16', title:'Trùm Hiragana', sub:'Bài kiểm tra tổng', type:'test', pool:'hira-all', count: 20, icon:'crown' },
      ]),
    },
    {
      id:'kata', title:'Katakana', jp:'カタカナ', icon:'bolt', color:'#45a3ff', desc:'Bộ chữ góc cạnh cho từ nước ngoài',
      lessons: kanaRows.map((r, i) => kanaLesson('kata', i, r)).concat([
        { id:'k10', title:'ガ ザ', sub:'Âm đục (1)', type:'kana', items: ch(K('がぎぐげござじずぜぞ')), intro:'Quy tắc y hệt Hiragana: カ → ガ, サ → ザ.' },
        { id:'k11', title:'ダ バ', sub:'Âm đục (2)', type:'kana', items: ch(K('だぢづでどばびぶべぼ')), intro:'Có ベトナム (Việt Nam) ở bài này nè' },
        { id:'k12', title:'パ ピ プ ペ ポ', sub:'Âm bán đục', type:'kana', items: ch(K('ぱぴぷぺぽ')), intro:'パンダ (gấu trúc) đang chờ bạn' },
        { id:'k13', title:'キャ シャ チャ', sub:'Âm ghép (1)', type:'kana', items: kyoon(Y1), intro:'Giống Hiragana: キ + ャ = キャ (kya).' },
        { id:'k14', title:'ミャ リャ ジャ', sub:'Âm ghép (2)', type:'kana', items: kyoon(Y2), intro:'Gần xong Katakana rồi! ジュース (nước ép) cho bạn nè' },
        { id:'k15', title:'ファ ティ ー', sub:'Âm ngoại lai', type:'kana', items: SJ.KANA.kata.ext.map(o => o.k), intro:'Âm mới cho từ nước ngoài — có cả フォー (phở) nữa đó! Dấu ー dùng để kéo dài âm.', pre:'kataext' },
        { id:'k16', title:'Trùm Katakana', sub:'Bài kiểm tra tổng', type:'test', pool:'kata-all', count: 20, icon:'crown' },
      ]),
    },
    {
      id:'vocab', title:'Từ vựng & Giao tiếp', jp:'ことば', icon:'speech', color:'#20bf8a', desc:'Những từ đầu tiên để nói chuyện',
      lessons: [
        { id:'v1', title:'Chào hỏi', sub:'あいさつ', type:'vocab', topic:'greet', icon:'wave_hand', intro:'Những câu chào bạn dùng mỗi ngày. Lưu ý: こんにちは đọc là "konnichiwa" nha!' },
        { id:'v2', title:'Số đếm', sub:'かず', type:'vocab', topic:'number', icon:'numbers', intro:'Đếm từ 1 đến 10 rồi tới 10.000. Số 4 và 7 có 2 cách đọc, ở đây dùng cách phổ biến nhất.' },
        { id:'v3', title:'Gia đình', sub:'かぞく', type:'vocab', topic:'family', icon:'family', intro:'Gọi người thân trong nhà người khác (lịch sự).' },
        { id:'v4', title:'Đồ ăn', sub:'たべもの', type:'vocab', topic:'food', icon:'sushi', intro:'Phần ngon nhất! Có cả phở フォー nữa' },
        { id:'v5', title:'Động vật', sub:'どうぶつ', type:'vocab', topic:'animal', icon:'paw', intro:'Sở thú dễ thương của Mochi' },
        { id:'v6', title:'Màu sắc', sub:'いろ', type:'vocab', topic:'color', icon:'palette', intro:'Thế giới đầy màu sắc! いろ nghĩa là màu.' },
        { id:'v7', title:'Thời gian', sub:'じかん', type:'vocab', topic:'time', icon:'alarm', intro:'Hôm nay, ngày mai và 4 mùa ở Nhật.' },
        { id:'v8', title:'Đồ vật', sub:'もの', type:'vocab', topic:'thing', icon:'backpack', intro:'Những thứ quanh bạn mỗi ngày.' },
        { id:'v9', title:'Tính từ', sub:'けいようし', type:'vocab', topic:'adj', icon:'love', intro:'Để khen: かわいい! おいしい!' },
        { id:'v10', title:'Động từ', sub:'どうし', type:'vocab', topic:'verb', icon:'walk', intro:'Động từ dạng lịch sự ます — dùng được ngay!' },
      ],
    },
    {
      id:'kanji', title:'Kanji nhập môn', jp:'かんじ', icon:'torii', color:'#f08c00', desc:'Chữ Hán dễ ợt nhờ âm Hán Việt',
      lessons: [
        { id:'j1', title:'一 二 三', sub:'Số đếm', type:'kanji', items: ch('一二三四五六七八九十'), icon:'numbers', intro:'Kanji số đếm — mấy chữ đầu chỉ là… que tính! Dễ chưa nè' },
        { id:'j2', title:'日 月 火', sub:'Ngày trong tuần', type:'kanji', items: ch('日月火水木金土'), icon:'calendar', intro:'7 chữ này cũng là 7 ngày trong tuần: Nhật – Nguyệt – Hoả – Thuỷ – Mộc – Kim – Thổ!' },
        { id:'j3', title:'人 口 目', sub:'Con người', type:'kanji', items: ch('人口目耳手足力女男子'), icon:'person', intro:'Các bộ phận cơ thể — chữ nào cũng giống hình thật luôn.' },
        { id:'j4', title:'上 下 中', sub:'Vị trí & kích thước', type:'kanji', items: ch('上下中大小左右本'), icon:'compass', intro:'Trên, dưới, trong, to, nhỏ… và chữ 本 trong 日本 (Nhật Bản).' },
        { id:'j5', title:'山 川 花', sub:'Thiên nhiên', type:'kanji', items: ch('山川田天気雨花空'), icon:'mountain', intro:'Núi sông, mưa hoa và bầu trời' },
        { id:'j6', title:'学 生 先', sub:'Trường học', type:'kanji', items: ch('学生先年名何今友'), icon:'school', intro:'先生 (TIÊN SINH) = giáo viên, 学生 (HỌC SINH) = học sinh. Hán Việt quá đỉnh!' },
        { id:'j7', title:'百 千 円', sub:'Tiền & giờ', type:'kanji', items: ch('百千万円時分半'), icon:'n10000', intro:'Đọc giá tiền và xem giờ như người Nhật' },
      ],
    },
    {
      id:'grammar', title:'Ngữ pháp siêu dễ', jp:'ぶんぽう', icon:'puzzle', color:'#9b7bff', desc:'Ghép từ thành câu đầu tiên',
      lessons: [
        { id:'g1', title:'A は B です', sub:'Tôi là…', type:'text', content:'g1', icon:'sparkle' },
        { id:'g2', title:'Câu hỏi か', sub:'Hỏi & trả lời', type:'text', content:'g2', icon:'question' },
        { id:'g3', title:'これ それ あれ', sub:'Cái này, cái kia', type:'text', content:'g3', icon:'arrow_r' },
        { id:'g4', title:'Trợ từ の', sub:'Của ai?', type:'text', content:'g4', icon:'gift' },
        { id:'g5', title:'Tự giới thiệu', sub:'じこしょうかい', type:'text', content:'g5', icon:'wave_hand' },
        { id:'g6', title:'Động từ ます', sub:'Ăn, uống, đi…', type:'text', content:'g6', icon:'walk' },
      ],
    },
  ];

  SJ.LESSONS = [];
  SJ.LESSON_MAP = {};
  SJ.UNITS.forEach(u => u.lessons.forEach(l => { l.unit = u.id; SJ.LESSONS.push(l); SJ.LESSON_MAP[l.id] = l; }));

  /** Danh sách "khoá" (item key) mà bài học dạy */
  SJ.lessonKeys = function (l) {
    if (l.type ==='kana') return l.items.slice();
    if (l.type ==='vocab') return SJ.VOCAB[l.topic].map(o => o.key);
    if (l.type ==='kanji') return l.items.map(k =>'j:' + k);
    return [];
  };
})(window.SJ);
