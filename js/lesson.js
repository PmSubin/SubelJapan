/* SubelJapan — Trình phát bài học: giới thiệu → thẻ học → kiểm tra nhỏ → kết quả (con dấu 合格) */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);

  // ---------- Dựng câu hỏi trắc nghiệm ----------
  function distinct(list, n, keyFn, exclude) {
    const seen = new Set(exclude || []); const out = [];
    for (const x of U().shuffle(list)) { const k = keyFn(x); if (!seen.has(k)) { seen.add(k); out.push(x); if (out.length >= n) break; } }
    return out;
  }
  const pic = (e, s) => (e && SJ.hasIcon(e)) ? I(e, s || 96, 'pic') : '';
  function kanaQ(item, type, pool) {
    const pl = pool.filter(o => o.k !== item.k && o.group !== 'small');
    const opts = U().shuffle([item].concat(distinct(pl, 3, o => o.r, [item.r])));
    if (type === 'k2r') return { key: item.k, item, type, prompt: `<div class="q-big jp">${item.k}</div>`, ask: 'Chữ này đọc là gì?', options: opts.map(o => ({ label: o.r, val: o.k })), answer: item.k, hint: item.m };
    if (type === 'r2k') return { key: item.k, item, type, prompt: `<div class="q-big romaji-big">${item.r}</div>`, ask: 'Chọn chữ đúng nhé!', options: opts.map(o => ({ label: `<span class="jp opt-jp">${o.k}</span>`, val: o.k })), answer: item.k, hint: item.m };
    return { key: item.k, item, type: 'listen', say: item.k, prompt: `<button class="listen-btn" data-say="${item.k}">${I('speaker', 64)}</button>`, ask: 'Nghe và chọn chữ đúng', options: opts.map(o => ({ label: `<span class="jp opt-jp">${o.k}</span>`, val: o.k })), answer: item.k, hint: `${item.k} = ${item.r}` };
  }
  function vocabQ(item, type, pool) {
    const opts = U().shuffle([item].concat(distinct(pool.filter(o => o.key !== item.key), 3, o => o.vi, [item.vi])));
    if (type === 'w2m') return { key: item.key, item, type, say: item.jp, prompt: `<div class="q-word jp">${esc(item.jp)}</div><div class="q-sub">${esc(item.r)}</div>`, ask: 'Từ này nghĩa là gì?', options: opts.map(o => ({ label: esc(o.vi), val: o.key })), answer: item.key, hint: `${esc(item.jp)} = ${esc(item.vi)}` };
    if (type === 'm2w') return { key: item.key, item, type, prompt: `${pic(item.e, 92)}<div class="q-mean">${esc(item.vi)}</div>`, ask: 'Chọn từ tiếng Nhật đúng', options: opts.map(o => ({ label: `<span class="jp">${esc(o.jp)}</span>`, val: o.key })), answer: item.key, hint: `${esc(item.jp)} (${esc(item.r)})` };
    return { key: item.key, item, type: 'listen', say: item.jp, prompt: `<button class="listen-btn" data-say="${esc(item.jp)}">${I('speaker', 64)}</button>`, ask: 'Nghe và chọn nghĩa đúng', options: opts.map(o => ({ label: `<span class="opt-pic">${I(o.e, 34)}</span>${esc(o.vi)}`, val: o.key })), answer: item.key, hint: `${esc(item.jp)} (${esc(item.r)}) = ${esc(item.vi)}` };
  }
  function kanjiQ(item, type, pool) {
    const others = pool.filter(o => o.k !== item.k);
    if (type === 'k2m') {
      const opts = U().shuffle([item].concat(distinct(others, 3, o => o.m, [item.m])));
      return { key: item.key, item, type, prompt: `<div class="q-big jp">${item.k}</div>`, ask: 'Chữ Hán này nghĩa là gì?', options: opts.map(o => ({ label: esc(o.m), val: o.k })), answer: item.k, hint: `${item.k} — ${item.hv}: ${esc(item.tip)}` };
    }
    if (type === 'm2k') {
      const opts = U().shuffle([item].concat(distinct(others, 3, o => o.k, [item.k])));
      return { key: item.key, item, type, prompt: `<div class="q-mean">${esc(item.m)}</div>`, ask: 'Chữ Hán nào mang nghĩa này?', options: opts.map(o => ({ label: `<span class="jp opt-jp">${o.k}</span>`, val: o.k })), answer: item.k, hint: `${item.k} (${item.hv}) = ${esc(item.m)}` };
    }
    if (type === 'k2hv') {
      const opts = U().shuffle([item].concat(distinct(others, 3, o => o.hv, [item.hv])));
      return { key: item.key, item, type, prompt: `<div class="q-big jp">${item.k}</div>`, ask: 'Âm Hán Việt của chữ này là?', options: opts.map(o => ({ label: o.hv, val: o.k })), answer: item.k, hint: `${item.k} đọc Hán Việt là ${item.hv} (${esc(item.m)})` };
    }
    const ex = item.ex[0];
    const allEx = pool.flatMap(o => o.ex).filter(e => e.kana !== ex.kana);
    const opts = U().shuffle([ex].concat(distinct(allEx, 3, e => e.kana, [ex.kana])));
    return { key: item.key, item, type, say: ex.kana, prompt: `<div class="q-word jp">${ex.jp}</div><div class="q-sub">${esc(ex.vi)}</div>`, ask: 'Từ này đọc là gì?', options: opts.map(o => ({ label: `<span class="jp">${o.kana}</span>`, val: o.kana })), answer: ex.kana, hint: `${ex.jp} đọc là ${ex.kana} (${ex.r})` };
  }

  function buildQuiz(lesson, items) {
    const types = { kana: ['k2r', 'r2k', 'listen', 'k2r'], vocab: ['w2m', 'm2w', 'listen'], kanji: ['k2m', 'm2k', 'k2hv', 'read'] }[lesson.type];
    let pool = items;
    if (lesson.type === 'kana' && items.length < 6) pool = items.concat(SJ.KANA[items[0].script].basic);
    if (lesson.type === 'kanji' && items.length < 6) pool = items.concat(SJ.KANJI);
    const target = U().clamp(Math.round(items.length * 1.6), 6, 14);
    const order = [];
    while (order.length < target) order.push(...U().shuffle(items));
    order.length = target;
    const builder = { kana: kanaQ, vocab: vocabQ, kanji: kanjiQ }[lesson.type];
    return order.map((it, i) => builder(it, types[i % types.length], pool));
  }
  function buildTextQuiz(content) {
    return (content.quiz || []).map(q => {
      const opts = U().shuffle(q.o.map((o, j) => ({ label: q.big ? `<span class="jp">${esc(o)}</span>` : esc(o), val: String(j) })));
      return { key: null, type: 'text', prompt: `<div class="q-text">${esc(q.q)}</div>`, ask: '', options: opts, answer: '0', hint: 'Đáp án: ' + esc(q.o[0]) };
    });
  }
  function buildTest(lesson) {
    const pool = SJ.pool(lesson.pool);
    const types = ['k2r', 'r2k', 'listen'];
    return U().sample(pool, lesson.count || 20).map((it, i) => kanaQ(it, types[i % 3], pool));
  }

  // ---------- Bảng a・i・u・e・o mini (đầu mỗi bài Kana) ----------
  function rowGrid(items) {
    const set = new Set(items.map(o => o.k));
    const script = items[0].script;
    const conv = c => script === 'kata' ? SJ.toKata(c) : c;
    const rows = SJ.GOJUON.basic.concat(SJ.GOJUON.daku).filter(r => Array.from(r[1]).some(c => c !== '_' && set.has(conv(c))));
    if (!rows.length) return '';
    return `<div class="gojuon mini"><div class="gj-row gj-head"><span></span>${SJ.GOJUON.cols.map(c => `<span>${c}</span>`).join('')}</div>
      ${rows.map(r => `<div class="gj-row"><span class="gj-lab">${r[0] || '–'}</span>${Array.from(r[1]).map(c => c === '_' ? '<span class="gj-c empty"></span>' : `<span class="gj-c ${set.has(conv(c)) ? 'on' : ''} jp">${conv(c)}</span>`).join('')}</div>`).join('')}</div>`;
  }

  // ---------- Thẻ học ----------
  function genko(ch, extra) { return `<div class="genko ${extra || ''}" data-say="${ch}"><span class="jp">${ch}</span></div>`; }
  function exampleRow(w) {
    return `<div class="example" data-say="${esc(w.jp)}">${w.e && SJ.hasIcon(w.e) ? `<span class="ex-pic">${I(w.e, 40)}</span>` : ''}<span class="jp ex-jp">${esc(w.jp)}</span><span class="ex-ro">${esc(w.r)}</span><span class="ex-vi">${esc(w.vi)}</span><span class="ex-say">${I('speaker', 20)}</span></div>`;
  }
  function kanaCard(it) {
    return `<div class="learn-card paper pop-in"><span class="tape"></span>
      <div class="lc-main">
        <div class="lc-char">${genko(it.k, it.k.length > 1 ? 'wide' : '')}
          <div class="lc-romaji">${it.r}</div>
          <button class="btn btn-sm btn-paper" data-say="${it.k}">${I('speaker', 20)} Nghe</button></div>
        <div class="lc-stroke"><div class="mini-label">Thứ tự nét</div><div class="stroke-box" data-stroke="${it.k}"></div>
          <div class="row center-row gap-s"><button class="btn btn-sm btn-ghost" data-act="replay">${I('play', 18)} Xem nét</button><button class="btn btn-sm btn-yel" data-act="trace">${I('pencil', 18)} Tập viết</button></div></div>
      </div>
      <div class="lc-info">
        <div class="info-row"><span class="tag tag-pink">${I('talk', 16)} Đọc gần giống</span><b>${esc(it.v || it.r)}</b></div>
        <div class="mnemo">${I('bulb', 26)}<span>${esc(it.m)}</span></div>
        ${it.w ? exampleRow(it.w) : ''}
      </div></div>`;
  }
  function vocabCard(it) {
    return `<div class="learn-card paper pop-in vocab-card"><span class="tape"></span>
      <div class="vc-pic bounce-in">${I(it.e, 128, 'pic')}</div>
      <div class="vc-word jp" data-say="${esc(it.jp)}">${esc(it.jp)}</div>
      <div class="vc-romaji">${esc(it.r)}</div>
      <div class="vc-mean">${esc(it.vi)}</div>
      <div class="row center-row gap-s"><button class="btn btn-sm btn-paper" data-say="${esc(it.jp)}">${I('speaker', 20)} Nghe</button><button class="btn btn-sm btn-ghost" data-slow="1">${I('slow', 22)} Nghe chậm</button></div></div>`;
  }
  function kanjiCard(it) {
    return `<div class="learn-card paper pop-in"><span class="tape"></span>
      <div class="lc-main">
        <div class="lc-char">${genko(it.k, 'kanji')}<div class="hv-badge">${it.hv}</div><div class="lc-mean">${esc(it.m)}</div></div>
        <div class="lc-stroke"><div class="mini-label">Thứ tự nét</div><div class="stroke-box" data-stroke="${it.k}"></div>
          <div class="row center-row gap-s"><button class="btn btn-sm btn-ghost" data-act="replay">${I('play', 18)} Xem nét</button><button class="btn btn-sm btn-yel" data-act="trace">${I('pencil', 18)} Tập viết</button></div></div>
      </div>
      <div class="lc-info">
        <div class="info-row"><span class="tag tag-blue">Âm On</span><span class="jp">${it.on}</span><span class="tag tag-green">Âm Kun</span><span class="jp">${it.kun}</span></div>
        <div class="mnemo">${I('bulb', 26)}<span>${esc(it.tip)}</span></div>
        ${it.ex.map(e => `<div class="example" data-say="${e.kana}"><span class="jp ex-jp">${e.jp}</span><span class="jp ex-kana">${e.kana}</span><span class="ex-ro">${e.r}</span><span class="ex-vi">${esc(e.vi)}</span><span class="ex-say">${I('speaker', 20)}</span></div>`).join('')}
      </div></div>`;
  }

  /** Bảng tập viết trong cửa sổ nổi */
  function openTrace(ch, info) {
    const m = U().modal(`<div class="trace-modal">
      <h3 class="center title-hand">${I('pencil', 26)} Tập viết <span class="jp">${ch}</span> ${info ? `<small class="muted">${esc(info)}</small>` : ''}</h3>
      <div class="trace-grid">
        <div><div class="mini-label">Thứ tự nét</div><div class="stroke-box sm" id="tm-sv"></div><button class="btn btn-sm btn-ghost btn-block" data-a="replay">${I('play', 18)} Xem lại</button></div>
        <div class="trace-right"><div id="tm-pad"></div>
          <div class="pad-tools"><button class="btn btn-sm btn-paper" data-a="undo">${I('undo', 18)} Hoàn tác</button><button class="btn btn-sm btn-paper" data-a="clear">${I('eraser', 18)} Xoá</button><button class="btn btn-sm btn-paper" data-a="guide">${I('eye', 18)} Chữ mờ</button><button class="btn btn-sm btn-green" data-a="check">${I('check', 18)} Chấm điểm</button></div>
          <div class="score-line" id="tm-score"></div></div>
      </div></div>`, { cls: 'modal-lg' });
    const sv = SJ.writing.strokeView(m.el.querySelector('#tm-sv'), ch);
    const pad = SJ.writing.tracePad(m.el.querySelector('#tm-pad'), ch, { size: 300 });
    m.el.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const act = a.dataset.a;
      if (act === 'replay') sv.play();
      if (act === 'undo') pad.undo();
      if (act === 'clear') { pad.clear(); m.el.querySelector('#tm-score').innerHTML = ''; }
      if (act === 'guide') pad.toggleGuide();
      if (act === 'check') showScore(pad, m.el.querySelector('#tm-score'), ch);
    });
    return m;
  }
  function showScore(pad, out, ch) {
    if (!pad.hasInk()) { out.innerHTML = `<span class="muted">${I('pencil', 18)} Hãy viết thử trước đã nha</span>`; return null; }
    const r = pad.score(); const v = SJ.writing.verdict(r.score);
    out.innerHTML = `<div class="score-pop pop-in">${U().mascot(v.mood, 56)}<div><div class="score-num">${r.score}<small>/100</small> ${U().stars(v.stars, 3, 20)}</div><div>${v.text}</div>${r.expected && r.strokes !== r.expected ? `<div class="muted small">Chữ này có ${r.expected} nét, bạn viết ${r.strokes} nét.</div>` : ''}</div>${r.score >= 85 ? U().hanko('優', 'sm') : ''}</div>`;
    if (r.score >= 50) { SJ.store.addWritten(); SJ.store.addXP(2); SJ.audio.sfx(r.score >= 85 ? 'stamp' : 'ok'); if (ch) SJ.store.rec(ch.length === 1 && SJ.KANJI_MAP[ch] ? 'j:' + ch : ch, true); }
    else SJ.audio.sfx('bad');
    return r;
  }

  // ---------- Bộ phát bài học ----------
  function open(root, id) {
    const lesson = SJ.LESSON_MAP[id];
    if (!lesson) { root.innerHTML = `<div class="container center pad-xl">${U().mascot('sad', 120)}<h2>Không tìm thấy bài học</h2><a class="btn" href="#/learn">Về lộ trình</a></div>`; return; }
    const unit = SJ.UNITS.find(u => u.id === lesson.unit);
    let items = [];
    if (lesson.type === 'kana') items = lesson.items.map(k => SJ.KANA_MAP[k]).filter(Boolean);
    if (lesson.type === 'vocab') items = SJ.VOCAB[lesson.topic];
    if (lesson.type === 'kanji') items = lesson.items.map(k => SJ.KANJI_MAP[k]);
    const content = lesson.type === 'text' ? SJ.TEXT[lesson.content] : (lesson.pre ? SJ.TEXT[lesson.pre] : null);

    let phase = 'intro', idx = 0, queue = [], qi = 0, firstTotal = 0, firstOk = 0, answered = false, sv = null, destroyed = false, streak = 0;
    root.innerHTML = `<div class="lesson" style="--unit:${unit.color}">
      <div class="lesson-top"><button class="lesson-x" aria-label="Thoát">${I('batsu', 22)}</button><div class="lesson-prog"><div class="lesson-prog-fill"></div></div><div class="lesson-count"></div></div>
      <div class="lesson-body container-sm"></div>
      <div class="lesson-foot"></div></div>`;
    const body = root.querySelector('.lesson-body'), foot = root.querySelector('.lesson-foot');
    const fill = root.querySelector('.lesson-prog-fill'), count = root.querySelector('.lesson-count');

    root.querySelector('.lesson-x').onclick = async () => {
      if (phase === 'result' || phase === 'intro' || await U().confirm('Thoát bài học bây giờ hả? Tiến độ bài này sẽ chưa được lưu đâu nha.', 'Thoát', 'Học tiếp')) location.hash = '#/learn';
    };
    const setProg = (p, txt) => { fill.style.width = U().clamp(p, 0, 100) + '%'; count.textContent = txt || ''; };

    function render() {
      if (destroyed) return;
      sv && sv.stop(); sv = null;
      ({ intro: renderIntro, read: renderRead, learn: renderLearn, quiz: renderQuiz, result: renderResult })[phase]();
    }

    function renderIntro() {
      setProg(0);
      const preview = lesson.type === 'kana' ? rowGrid(items) || items.map(o => `<span class="jp chip-kana">${o.k}</span>`).join('')
        : lesson.type === 'kanji' ? items.map(o => `<span class="jp chip-kana">${o.k}</span>`).join('')
          : lesson.type === 'vocab' ? items.slice(0, 8).map(o => `<span class="chip-pic">${I(o.e, 46)}</span>`).join('') : `<span class="chip-pic big">${I(lesson.icon || 'book', 96)}</span>`;
      const st = SJ.store.lessonState(lesson.id);
      body.innerHTML = `<div class="intro-card pop-in">
        <div class="unit-pill" style="--uc:${unit.color}">${I(unit.icon, 20)} ${unit.title}</div>
        <h1 class="lesson-title">${esc(lesson.title)}</h1>
        <div class="lesson-sub">${esc(lesson.sub || '')}</div>
        <div class="preview">${preview}</div>
        ${U().mascotSay(esc(lesson.intro || (lesson.type === 'test' ? 'Bài kiểm tra tổng hợp! Đừng lo, sai thì làm lại thôi — Mochi luôn ở đây cổ vũ bạn.' : 'Cùng đọc thật chậm và hiểu thật kỹ nha!')), 'happy')}
        ${st && st.done ? `<div class="done-note">${U().hanko('済', 'sm')} Bạn đã hoàn thành bài này ${U().stars(st.stars, 3, 18)} — học lại để lấy thêm sao nhé!</div>` : ''}
      </div>`;
      foot.innerHTML = `<button class="btn btn-lg btn-block" data-go>${lesson.type === 'test' ? I('target', 24) + ' Bắt đầu kiểm tra' : 'Bắt đầu học thôi! ' + I('rocket', 24)}</button>`;
      foot.querySelector('[data-go]').onclick = () => {
        SJ.audio.sfx('open');
        if (lesson.type === 'text' || (content && lesson.pre)) phase = 'read';
        else if (lesson.type === 'test') return startQuiz(buildTest(lesson));
        else { phase = 'learn'; idx = 0; }
        render();
      };
    }

    function renderRead() {
      setProg(8, 'Đọc hiểu');
      body.innerHTML = `<div class="read">${content.sections.map((s, i) => `<section class="tl-section paper pop-in" style="animation-delay:${i * .06}s">${i % 2 ? '' : '<span class="tape"></span>'}
        <h2 class="title-hand">${esc(s.h)}</h2><p>${esc(s.p)}</p>
        ${s.list ? `<div class="tl-list">${s.list.map(l => `<div class="tl-li"><span class="jp tl-jp">${l[0]}</span><span>${esc(l[1])}</span></div>`).join('')}</div>` : ''}
        ${s.ex ? `<div class="ex-list">${s.ex.map(e => `<div class="ex-row" data-say="${esc(e[0])}"><span class="jp ex-jp">${esc(e[0])}</span><span class="ex-ro">${esc(e[1])}</span><span class="ex-vi">${esc(e[2])}</span><span class="ex-say">${I('speaker', 20)}</span></div>`).join('')}</div>` : ''}
        ${s.widget === 'name' ? nameWidget() : ''}
      </section>`).join('')}</div>`;
      bindNameWidget(body);
      foot.innerHTML = `<button class="btn btn-lg btn-block" data-go>${lesson.type === 'text' ? I('pencil', 22) + ' Làm bài tập nhỏ' : 'Học từng chữ ' + I('arrow_r', 22)}</button>`;
      foot.querySelector('[data-go]').onclick = () => {
        if (lesson.type === 'text') startQuiz(buildTextQuiz(content)); else { phase = 'learn'; idx = 0; render(); }
      };
    }

    function renderLearn() {
      const it = items[idx];
      setProg(10 + idx / items.length * 40, `Thẻ ${idx + 1}/${items.length}`);
      body.innerHTML = lesson.type === 'kana' ? kanaCard(it) : lesson.type === 'kanji' ? kanjiCard(it) : vocabCard(it);
      const sb = body.querySelector('[data-stroke]');
      if (sb) sv = SJ.writing.strokeView(sb, sb.dataset.stroke);
      SJ.audio.speak(lesson.type === 'vocab' ? it.jp : it.k);
      SJ.store.seen(lesson.type === 'kana' ? it.k : it.key);
      body.onclick = e => {
        if (e.target.closest('[data-slow]')) { SJ.audio.speak(it.jp, { rate: 0.55 }); return; }
        const a = e.target.closest('[data-act]'); if (!a) return;
        if (a.dataset.act === 'replay') sv && sv.play();
        if (a.dataset.act === 'trace') openTrace(it.k, lesson.type === 'kanji' ? it.hv : it.r);
      };
      const last = idx === items.length - 1;
      foot.innerHTML = `<div class="row gap"><button class="btn btn-paper" data-prev ${idx === 0 ? 'disabled' : ''} aria-label="Thẻ trước">${I('arrow_l', 24)}</button><button class="btn btn-lg grow" data-next>${last ? I('target', 24) + ' Kiểm tra nhỏ nào!' : 'Tiếp theo ' + I('arrow_r', 22)}</button></div>`;
      foot.querySelector('[data-prev]').onclick = () => { if (idx > 0) { idx--; render(); } };
      foot.querySelector('[data-next]').onclick = () => {
        SJ.audio.sfx('flip');
        if (last) startQuiz(buildQuiz(lesson, items)); else { idx++; render(); }
      };
    }

    function startQuiz(qs) { queue = qs; qi = 0; firstTotal = qs.length; firstOk = 0; streak = 0; phase = 'quiz'; render(); }

    function renderQuiz() {
      const q = queue[qi];
      answered = false;
      setProg(50 + qi / queue.length * 50, `Câu ${Math.min(qi + 1, queue.length)}/${queue.length}`);
      body.innerHTML = `<div class="quiz pop-in">
        ${q.retry ? `<div class="retry-tag">${I('refresh', 16)} Làm lại câu này nha</div>` : ''}
        ${streak >= 3 ? `<div class="streak-tag">${I('fire', 18)} Đúng ${streak} câu liền!</div>` : ''}
        <div class="quiz-ask">${q.ask}</div>
        <div class="quiz-prompt">${q.prompt}</div>
        <div class="quiz-opts ${q.options.length > 3 ? 'four' : ''}">${q.options.map((o, i) => `<button class="opt" data-nosfx="1" data-v="${esc(o.val)}"><kbd>${i + 1}</kbd>${o.label}</button>`).join('')}</div>
      </div>`;
      foot.innerHTML = '';
      if (q.say) setTimeout(() => SJ.audio.speak(q.say), 220);
      body.querySelectorAll('.opt').forEach(b => b.onclick = () => choose(b));
    }
    function choose(btn) {
      if (answered) return; answered = true;
      const q = queue[qi];
      const ok = btn.dataset.v === q.answer;
      body.querySelectorAll('.opt').forEach(b => { b.disabled = true; if (b.dataset.v === q.answer) b.classList.add('ok'); });
      if (!ok) btn.classList.add('bad', 'shake');
      if (q.key) SJ.store.rec(q.key, ok);
      if (ok && !q.retry) firstOk++;
      if (!ok && !q.retry) queue.push(Object.assign({}, q, { retry: true }));
      streak = ok ? streak + 1 : 0;
      SJ.audio.sfx(ok ? (streak > 0 && streak % 5 === 0 ? 'combo' : 'ok') : 'bad');
      if (ok && q.type !== 'listen' && !q.say && q.item && q.key === q.item.k) setTimeout(() => SJ.audio.speak(q.item.k), 350);
      foot.innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'} slide-up">
        <div class="fb-left">${U().mascot(ok ? 'happy' : 'sad', 58)}<div><div class="fb-title">${ok ? U().pick(SJ.CHEERS) : U().pick(SJ.COMFORTS)}</div>${ok ? '' : `<div class="fb-hint">${q.hint || ''}</div>`}</div></div>
        <button class="btn ${ok ? 'btn-green' : 'btn-red'}" data-cont>Tiếp tục ${I('arrow_r', 20)}</button></div>`;
      foot.querySelector('[data-cont]').onclick = next;
    }
    function next() { qi++; if (qi >= queue.length) phase = 'result'; render(); }

    function renderResult() {
      setProg(100, 'Xong!');
      const pct = Math.round(firstOk / Math.max(1, firstTotal) * 100);
      const res = SJ.store.completeLesson(lesson.id, pct);
      SJ.store.addSRS(SJ.lessonKeys(lesson));
      const nextL = SJ.LESSONS[SJ.LESSONS.indexOf(lesson) + 1];
      const mood = res.stars >= 3 ? 'love' : res.stars === 2 ? 'happy' : 'wink';
      body.innerHTML = `<div class="result pop-in">
        <div class="result-mochi">${U().mascot(mood, 140, 'jump')}${U().hanko(res.stars >= 3 ? '満点' : '合格', 'stamp-in')}</div>
        <h1 class="title-hand">${res.stars >= 3 ? 'Hoàn hảo!' : res.stars === 2 ? 'Giỏi quá đi!' : 'Hoàn thành rồi!'}</h1>
        <div class="result-stars">${U().stars(res.stars, 3, 52)}</div>
        <div class="result-stats">
          <div class="rs paper">${I('target', 30)}<b>${pct}%</b><span>đúng ngay lần đầu</span></div>
          <div class="rs paper">${I('star', 30)}<b>+${res.xp}</b><span>XP</span></div>
          <div class="rs paper">${I('fire', 30)}<b>${SJ.store.streakNow()}</b><span>ngày liên tiếp</span></div>
        </div>
        <p class="muted">${res.stars < 3 ? 'Học lại để đạt 3 sao nhé — các chữ trong bài đã được thêm vào Ôn tập rồi đó!' : 'Các chữ vừa học đã được đưa vào thẻ nhớ để ôn mỗi ngày.'}</p>
      </div>`;
      foot.innerHTML = `<div class="row gap wrap"><button class="btn btn-paper grow" data-again>${I('refresh', 20)} Học lại</button>
        ${lesson.type === 'kana' || lesson.type === 'kanji' ? `<a class="btn btn-yel grow" href="#/practice/write">${I('pencil', 20)} Luyện viết</a>` : ''}
        ${nextL ? `<a class="btn btn-lg grow" href="#/lesson/${nextL.id}">Bài tiếp theo ${I('arrow_r', 22)}</a>` : `<a class="btn btn-lg grow" href="#/learn">Về lộ trình</a>`}</div>`;
      foot.querySelector('[data-again]').onclick = () => { phase = 'intro'; render(); };
      SJ.audio.sfx('win');
      setTimeout(() => SJ.audio.sfx('stamp'), 650);
      for (let i = 0; i < res.stars; i++) setTimeout(() => SJ.audio.sfx('star'), 1000 + i * 220);
      if (res.stars >= 2) U().confetti();
    }

    function onKey(e) {
      if (phase !== 'quiz') return;
      if (!answered && /^[1-4]$/.test(e.key)) { const b = body.querySelectorAll('.opt')[+e.key - 1]; b && b.click(); }
      else if (answered && e.key === 'Enter') { e.preventDefault(); next(); }
    }
    document.addEventListener('keydown', onKey);
    render();
    return { destroy() { destroyed = true; sv && sv.stop(); document.removeEventListener('keydown', onKey); } };
  }

  // ---------- Công cụ: tên tiếng Nhật ----------
  function nameWidget() {
    const nm = SJ.store.get().name || '';
    return `<div class="name-widget"><label>Tên của bạn (có dấu cũng được):</label>
      <div class="row gap-s"><input class="input" id="nw-in" placeholder="Ví dụ: Nguyễn Minh Anh" value="${esc(nm)}"><button class="btn" id="nw-go">${I('sparkle', 20)} Đổi tên</button></div>
      <div id="nw-out"></div></div>`;
  }
  function bindNameWidget(root) {
    const go = root.querySelector('#nw-go'); if (!go) return;
    const run = () => {
      const v = root.querySelector('#nw-in').value.trim(); if (!v) return;
      const kata = U().nameToKata(v);
      SJ.store.markName();
      const intro = `はじめまして。わたしは ${kata.replace(/・/g, '')} です。ベトナムから きました。よろしく おねがいします。`;
      root.querySelector('#nw-out').innerHTML = `<div class="name-card pop-in">${I('nametag', 40)}<div class="name-kata jp">${kata}</div>
        <div class="ex-row" data-say="${esc(intro)}"><span class="jp ex-jp">${esc(intro)}</span><span class="ex-say">${I('speaker', 20)}</span></div>
        <div class="muted small">Tên tiếng Việt được phiên âm gần đúng theo cách người Nhật hay viết.</div></div>`;
      SJ.audio.sfx('sparkle'); SJ.audio.speak(kata.replace(/・/g, ' '));
    };
    go.onclick = run;
    root.querySelector('#nw-in').onkeydown = e => { if (e.key === 'Enter') run(); };
  }

  SJ.lesson = { open, openTrace, showScore, kanaQ, vocabQ, kanjiQ, nameWidget, bindNameWidget, rowGrid };
})(window.SJ);
