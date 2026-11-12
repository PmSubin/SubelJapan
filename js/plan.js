/* SubelJapan — "Kế hoạch hôm nay" (trang chủ) và trang "Học sao cho nhớ lâu" (#/how).
 * Kế hoạch sắp việc theo nghiên cứu về trí nhớ:
 *   1. ôn thẻ đến hạn (ôn ngắt quãng) → 2. ôn câu nói đến hạn (tự nhớ lại + nói thành tiếng)
 *   → 3. học một bài mới → 4. luyện trộn vài phút (học xen kẽ).
 * Không thêm dữ liệu vào bản lưu học tập: mốc đầu ngày (số câu luyện, lượt chơi) để riêng ở localStorage "sj_plan".
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const day = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  const startOfDay = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

  // mốc đầu ngày để biết hôm nay đã luyện trộn / chơi chưa
  function base(S) {
    let b = null;
    try { b = JSON.parse(localStorage.getItem('sj_plan') || 'null'); } catch (e) { }
    if (!b || b.date !== day()) {
      b = { date: day(), p0: S.practiced || 0, g0: S.plays || 0 };
      try { localStorage.setItem('sj_plan', JSON.stringify(b)); } catch (e) { }
    }
    return b;
  }

  function steps() {
    const S = SJ.store.get(), now = Date.now(), t0 = startOfDay(), b = base(S);
    const due = SJ.store.dueKeys().length, hasSrs = SJ.store.srsKeys().length > 0;
    const mem = Object.values(S.talkMem || {}), talkDue = mem.filter(m => m.d <= now).length;
    const learnedToday = Object.values(S.lessons).some(l => l.at >= t0) || Object.values(S.talk).some(l => l.at >= t0);
    const mixedToday = (S.practiced || 0) > b.p0 || (S.plays || 0) > b.g0;
    const next = SJ.store.nextLesson();
    return [
      { id: 'srs', icon: 'brain', tag: 'Ôn ngắt quãng', href: '#/review', done: hasSrs && !due, skip: !hasSrs,
        title: !hasSrs ? 'Ôn thẻ nhớ' : due ? `Ôn ${due} thẻ đến hạn` : 'Đã ôn hết thẻ đến hạn',
        sub: !hasSrs ? 'Học xong một bài là có thẻ để ôn' : due ? 'Ôn đúng lúc sắp quên — nhớ lâu nhất' : 'Mochi sẽ nhắc khi tới hạn ôn tiếp' },
      { id: 'talk', icon: 'talk', tag: 'Tự nhớ lại + nói to', href: '#/talk/daily', done: mem.length > 0 && !talkDue, skip: !mem.length,
        title: !mem.length ? 'Ôn câu nói' : talkDue ? `Ôn ${talkDue} câu nói đến hạn` : 'Đã ôn hết câu nói',
        sub: !mem.length ? 'Học một bài Nói là có câu để ôn' : talkDue ? 'Nghe, nhớ lại rồi nói thành tiếng' : 'Câu nào sắp quên Mochi sẽ gọi lại' },
      { id: 'new', icon: 'sprout', tag: 'Học cái mới', href: '#/lesson/' + next.id, done: learnedToday,
        title: learnedToday ? 'Đã học bài mới hôm nay' : 'Học 1 bài: ' + next.title, sub: learnedToday ? 'Giỏi lắm! Học ít mà đều mới nhớ lâu' : 'Một bài chỉ 3–5 phút' },
      { id: 'mix', icon: 'infinity', tag: 'Học xen kẽ', href: '#/practice', done: mixedToday,
        title: mixedToday ? 'Đã luyện trộn hôm nay' : 'Luyện trộn 3 phút', sub: mixedToday ? 'Trộn nhiều dạng bài giúp phân biệt chữ tốt hơn' : 'Luyện tập hoặc chơi một trò bất kỳ' },
    ];
  }

  function homeHTML() {
    const st = steps(), live = st.filter(s => !s.skip), n = live.filter(s => s.done).length, all = live.length && n === live.length;
    const nextStep = st.find(s => !s.done && !s.skip);
    return `<section class="card plan-card ${all ? 'all' : ''}">
      <div class="plan-head"><div class="plan-ring" style="--p:${live.length ? n / live.length : 0}"><b>${n}</b><small>/${live.length}</small></div>
        <div class="grow"><h2>${all ? 'Xong kế hoạch hôm nay!' : 'Kế hoạch hôm nay'}</h2><p>${all ? 'Hôm nay bạn đã ôn, học và luyện đủ cả. Mai gặp lại nha!' : 'Làm theo thứ tự này là cách nhớ lâu nhất — chỉ khoảng 10–15 phút.'}</p></div>
        <a class="plan-how" href="#/how">${I('bulb', 18)} Vì sao?</a></div>
      <ol class="plan-steps">${st.map((s, i) => `<li class="${s.done ? 'done' : ''} ${s.skip ? 'skip' : ''} ${s === nextStep ? 'next' : ''}">
        <a href="${s.href}"><span class="ps-ico">${s.done ? I('check', 22) : I(s.icon, 34)}</span><span class="ps-txt"><small>${i + 1} · ${esc(s.tag)}</small><b>${esc(s.title)}</b><span>${esc(s.sub)}</span></span>${s === nextStep ? `<span class="ps-go">${I('arrow_r', 18)}</span>` : ''}</a></li>`).join('')}</ol>
    </section>`;
  }

  // ===================== TRANG "HỌC SAO CHO NHỚ LÂU" =====================
  const METHODS = [
    { icon: 'brain', name: 'Ôn ngắt quãng', en: 'Spaced repetition',
      why: 'Ebbinghaus (1885) vẽ ra "đường cong quên": học xong không ôn thì sau một ngày đã quên quá nửa. Tổng hợp 317 thí nghiệm của Cepeda và cộng sự (2006) cho thấy ôn giãn cách nhớ lâu hơn hẳn học dồn một lúc.',
      app: 'Thẻ nhớ tự hẹn ngày ôn: nhớ thì giãn ra 1 → 2 → 4 → 7 → 14 → 30 → 60 ngày, quên thì gọi lại sớm. Câu nói cũng được ôn như vậy.', go: ['#/review', 'Ôn tập thông minh'] },
    { icon: 'question', name: 'Tự kiểm tra', en: 'Retrieval practice',
      why: 'Roediger và Karpicke (2006): sau một tuần, nhóm tự kiểm tra nhớ được 61% bài, nhóm chỉ đọc lại nhớ 40%. Dunlosky và cộng sự (2013) xếp tự kiểm tra và ôn ngắt quãng là hai cách học hiệu quả nhất trong 10 cách phổ biến.',
      app: 'Mọi bài học đều bắt bạn tự nhớ ra đáp án (chọn, gõ, viết, xếp câu) trước khi xem lời giải — đó chính là lúc não "khắc" vào trí nhớ.', go: ['#/practice', 'Luyện tập vô tận'] },
    { icon: 'sparkle', name: 'Chữ đi cùng hình', en: 'Dual coding & mnemonics',
      why: 'Theo Paivio (1971), não lưu chữ và hình ở hai kênh khác nhau — có cả hai thì dễ nhớ ra hơn. Atkinson và Raugh (1975) cho người học từ mới kèm một hình gợi nhớ: nhớ được nhiều hơn hẳn nhóm học thuộc lòng.',
      app: 'Bảng chữ có "mẹo nhớ bằng hình" cho từng chữ (か = thanh kiếm "Ka!", ね = con mèo cuộn đuôi), từ vựng nào cũng có hình vẽ.', go: ['#/chart', 'Bảng chữ cái'] },
    { icon: 'infinity', name: 'Học xen kẽ', en: 'Interleaving',
      why: 'Rohrer và Taylor (2007): trộn nhiều dạng bài vào một buổi lúc đầu thấy khó hơn, nhưng một tuần sau làm đúng 63% so với 20% của nhóm học từng dạng một — vì não phải tự phân biệt.',
      app: 'Chế độ "Trộn tất cả", nhóm chữ dễ nhầm (シ・ツ, ソ・ン, ぬ・め) và 12 trò chơi trộn chữ, từ, câu.', go: ['#/games', 'Trò chơi'] },
    { icon: 'pencil', name: 'Viết tay', en: 'Handwriting',
      why: 'Longcamp và cộng sự (2005): trẻ tập viết tay nhận ra chữ cái tốt hơn trẻ chỉ tập gõ phím. Cử động tay đúng thứ tự nét giúp nhớ hình chữ.',
      app: 'Luyện viết chấm từng nét (đúng vị trí, đúng chiều, đúng thứ tự) và phiếu tập viết ô vuông để in ra giấy.', go: ['#/write', 'Luyện viết'] },
    { icon: 'speaker', name: 'Nói thành tiếng', en: 'Production effect',
      why: 'MacLeod và cộng sự (2010): đọc to một từ giúp nhớ nó tốt hơn đọc thầm. Nghe người bản xứ rồi nói theo còn luyện được cả phát âm.',
      app: 'Phần Nói & Ngữ pháp: nghe câu mẫu, bấm "Nói thử" để nói theo; Sensei Mochi luyện hội thoại nhập vai.', go: ['#/talk', 'Nói & Ngữ pháp'] },
    { icon: 'calendar', name: 'Ít mà đều mỗi ngày', en: 'Distributed practice',
      why: 'Học 15 phút mỗi ngày nhớ lâu hơn học dồn 2 tiếng một lần (cũng theo nhóm nghiên cứu ôn ngắt quãng ở trên). Giấc ngủ sau buổi học giúp não sắp xếp lại điều vừa học.',
      app: 'Mục tiêu ngày, chuỗi ngày học, nhiệm vụ mỗi ngày và "Kế hoạch hôm nay" ở trang chủ.', go: ['#/quests', 'Nhiệm vụ'] },
    { icon: 'sensei', name: 'Biết ngay mình sai ở đâu', en: 'Immediate feedback',
      why: 'Hattie và Timperley (2007) tổng hợp hàng trăm nghiên cứu: phản hồi rõ ràng, đúng lúc là một trong những yếu tố giúp học tiến bộ nhanh nhất.',
      app: 'Mỗi câu sai đều có giải thích; bấm "Vì sao?" để Sensei Mochi giảng thêm.', go: ['#/sensei', 'Sensei Mochi'] },
  ];
  function howPage(root) {
    root.innerHTML = `<div class="page how-page"><div class="page-head"><div class="ph-icon">${I('bulb', 52)}</div><div><h1>Học sao cho nhớ lâu?</h1><p>SubelJapan được làm theo những cách học đã được <b>nghiên cứu khoa học</b> chứng minh. Hiểu vì sao thì học càng hiệu quả!</p></div></div>
      ${homeHTML()}
      <div class="how-grid">${METHODS.map((m, i) => `<article class="card how-card" style="animation-delay:${i * .05}s">
        <div class="hc-head"><span class="hc-ico">${I(m.icon, 44)}</span><div><h2>${esc(m.name)}</h2><small>${esc(m.en)}</small></div></div>
        <p class="hc-why">${esc(m.why)}</p>
        <div class="hc-app"><b>Trong SubelJapan:</b> ${esc(m.app)}</div>
        <a class="btn btn-sm btn-white" href="${m.go[0]}">${esc(m.go[1])} ${I('arrow_r', 16)}</a></article>`).join('')}</div>
      <p class="small muted bold mt">Nguồn: Ebbinghaus (1885); Paivio (1971); Atkinson & Raugh (1975); Longcamp và cộng sự (2005); Cepeda và cộng sự (2006, Psychological Bulletin); Roediger & Karpicke (2006, Psychological Science); Rohrer & Taylor (2007); Hattie & Timperley (2007); MacLeod và cộng sự (2010); Dunlosky và cộng sự (2013, Psychological Science in the Public Interest).</p></div>`;
  }

  SJ.plan = { homeHTML, howPage, steps };
})(window.SJ);
