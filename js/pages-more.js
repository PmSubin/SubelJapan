/* SubelJapan — Trang mở rộng: Đọc hiểu (truyện, hội thoại, câu giao tiếp), Gõ phím tiếng Nhật, Sổ từ,
 * Phiếu tập viết (in ra giấy), Tiệm của Mochi */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const P = SJ.pages = SJ.pages || {};
  const LV = { 1: 'Hiragana', 2: 'Hira + Kata', 3: 'Có Kanji' };
  const lvPill = l => `<span class="lv-pill lv-${l}">${LV[l] || 'Cấp ' + l}</span>`;

  /** Đọc lần lượt nhiều câu, gọi onLine(i) khi bắt đầu từng câu */
  function speakSeq(texts, onLine, opts) {
    let i = 0, stopped = false;
    const step = () => {
      if (stopped || i >= texts.length) { onLine(-1); return; }
      onLine(i);
      const t = texts[i];
      SJ.audio.speak(t.text || t, { pitch: t.pitch, onend: () => { i++; setTimeout(step, 350); } });
    };
    step();
    return { stop() { stopped = true; SJ.audio.stop(); onLine(-1); } };
  }

  // ===================== ĐỌC HIỂU =====================
  P.read = function (root, tabArg) {
    let tab = ['story', 'dialog', 'phrase'].includes(tabArg) ? tabArg : 'story';
    const S = SJ.store.get();
    function draw() {
      const read = Object.keys(S.reads).length;
      let body = '';
      if (tab === 'story') {
        body = (SJ.ai ? SJ.ai.storySection() : '') + [1, 2, 3].map(l => `<div class="section-label">${lvPill(l)} ${l === 1 ? 'Chỉ Hiragana — đọc được ngay khi học xong bảng chữ' : l === 2 ? 'Có thêm Katakana cho từ mượn' : 'Có Kanji đơn giản (kèm cách đọc nhỏ phía trên)'}</div>
          <div class="story-list">${SJ.STORIES.filter(s => s.level === l && !s.ai).map(s => `<a class="card hov story-card" href="#/story/${s.id}"><span class="sc-ico">${I(s.icon, 44)}</span><div class="grow"><b>${esc(s.title)}</b><small>${esc(s.vi)} · ${s.lines.length} câu</small></div>${S.reads[s.id] ? `<span class="sc-done">${I('check', 26)}</span>` : ''}</a>`).join('')}</div>`).join('');
      } else if (tab === 'dialog') {
        body = `<div class="story-list mt">${SJ.DIALOGUES.map(d => `<a class="card hov story-card" href="#/dialog/${d.id}"><span class="sc-ico">${I(d.icon, 44)}</span><div class="grow"><b>${esc(d.title)}</b><small><span class="jp">${esc(SJ.ui.baseText(d.jp))}</span> · ${d.lines.length} câu</small></div>${S.reads[d.id] ? `<span class="sc-done">${I('check', 26)}</span>` : ''}</a>`).join('')}</div>`;
      } else {
        body = SJ.PHRASES.map(c => `<div class="section-label">${I(c.icon, 30)} ${esc(c.cat)}</div><div class="card">${c.list.map(p => `<div class="phrase" data-say="${esc(SJ.ui.reading(p[0]))}"><div class="grow"><div class="p-jp">${SJ.ui.ruby(p[0])}</div><div class="p-r">${esc(p[1])}</div><div class="p-vi">${esc(p[2])}</div></div>${I('speaker', 24)}</div>`).join('')}</div>`).join('');
      }
      root.innerHTML = `<div class="page-mid">
        <div class="page-head"><div class="ph-icon">${I('scroll', 52)}</div><div><h1>Đọc hiểu</h1><p>Truyện ngắn từ dễ đến khó, hội thoại đời thường và câu giao tiếp hay dùng. Bấm vào câu nào cũng nghe được giọng đọc. Đã đọc <b>${read}</b> bài.</p></div></div>
        <div class="seg mb">${[['story', 'book', 'Truyện ngắn'], ['dialog', 'talk', 'Hội thoại'], ['phrase', 'speech', 'Câu giao tiếp']].map(t => `<button data-tab="${t[0]}" class="${tab === t[0] ? 'active' : ''}">${I(t[1], 22)} ${t[2]}</button>`).join('')}</div>
        ${body}</div>`;
    }
    root.onclick = e => { const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; history.replaceState(null, '', '#/read/' + tab); draw(); } };
    draw();
  };

  function readerTools(st) {
    return `<div class="reader-tools">
      <label class="switch"><input type="checkbox" data-opt="furi" ${st.furi ? 'checked' : ''}><i></i><span>Cách đọc Kanji</span></label>
      <label class="switch"><input type="checkbox" data-opt="romaji" ${st.romaji ? 'checked' : ''}><i></i><span>Romaji</span></label>
      <label class="switch"><input type="checkbox" data-opt="vi" ${st.vi ? 'checked' : ''}><i></i><span>Dịch tiếng Việt</span></label>
      <span class="grow"></span><button class="btn btn-sm btn-sky" data-play>${I('play', 18)} Nghe cả bài</button></div>`;
  }
  const optClass = st => `${st.furi ? '' : 'no-furi'} ${st.romaji ? '' : 'no-romaji'} ${st.vi ? '' : 'no-vi'}`;
  function quizBlock(quiz) {
    return `<div class="card card-pad mt" data-quiz><div class="card-title">${I('question', 28)} Kiểm tra hiểu bài</div>
      ${quiz.map((q, qi) => `<div class="mb" data-q="${qi}"><div class="bold mb-s">${qi + 1}. ${esc(q.q)}</div><div class="quiz-opts">${U().shuffle(q.o.map((o, j) => ({ o, j }))).map(x => `<button class="opt" style="min-height:52px;font-size:16px" data-nosfx="1" data-j="${x.j}">${esc(x.o)}</button>`).join('')}</div></div>`).join('')}
      <div data-qres></div></div>`;
  }
  function bindQuiz(root, quiz, id, onAll) {
    let answered = 0, right = 0;
    root.querySelector('[data-quiz]').addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || b.disabled) return;
      const box = b.closest('[data-q]');
      const ok = b.dataset.j === '0';
      box.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.dataset.j === '0') x.classList.add('ok'); });
      if (!ok) b.classList.add('bad', 'shake');
      SJ.audio.sfx(ok ? 'ok' : 'bad');
      answered++; if (ok) right++;
      if (answered === quiz.length) {
        const first = SJ.store.markRead(id);
        const xp = first ? 8 + right * 2 : 3;
        SJ.store.addXP(xp);
        root.querySelector('[data-qres]').innerHTML = `<div class="score-pop pop-in">${U().mascot(right === quiz.length ? 'love' : 'happy', 60)}<div class="grow"><div class="score-num">${right}/${quiz.length}<small> câu đúng</small></div><div class="bold">+${xp} XP${first ? ' · +5 cá vàng' : ''} — ${right === quiz.length ? 'Hiểu bài hoàn toàn luôn!' : 'Đọc lại một lần nữa là nắm chắc nha!'}</div></div>${right === quiz.length ? U().hanko('読', 'sm') : ''}</div>`;
        if (right === quiz.length) { SJ.audio.sfx('win'); U().confetti(50); }
        onAll && onAll();
      }
    });
  }
  function bindOpts(root, wrap) {
    root.addEventListener('change', e => {
      const o = e.target.closest('[data-opt]'); if (!o) return;
      SJ.store.setSetting(o.dataset.opt, o.checked);
      wrap.className = wrap.className.replace(/\bno-\w+/g, '').trim() + ' ' + optClass(SJ.store.get().settings);
    });
  }

  P.story = function (root, id) {
    const s = SJ.STORIES.find(x => x.id === id) || SJ.STORIES[0];
    const st = SJ.store.get().settings;
    const idx = SJ.STORIES.indexOf(s), nx = SJ.STORIES[idx + 1];
    let seq = null;
    root.innerHTML = `<div class="page-narrow">
      <a class="back-link" href="#/read/story">${I('arrow_l', 20)} Đọc hiểu</a>
      <div class="card reader">
        <div class="row gap mb"><span class="chip-pic">${I(s.icon, 46)}</span><div class="grow"><h1 class="jp" style="margin:0">${SJ.ui.ruby(s.title)}</h1><div class="muted bold">${esc(s.vi)} ${lvPill(s.level)}</div></div></div>
        ${s.desc ? `<p class="muted bold">${esc(s.desc)}</p>` : ''}
        ${readerTools(st)}
        <div class="lines ${optClass(st)}" data-lines>${s.lines.map((l, i) => `<div class="rline" data-i="${i}"><span class="rl-num">${i + 1}</span><div class="grow"><div class="rl-jp">${SJ.ui.ruby(l.jp)}</div><div class="rl-r">${esc(l.r)}</div><div class="rl-vi">${esc(l.vi)}</div></div></div>`).join('')}</div>
      </div>
      <div class="card card-pad mt"><div class="card-title">${I('book', 28)} Từ vựng trong bài</div><div class="word-list">${s.words.map(w => `<div class="word-chip" data-say="${esc(w[0])}"><span class="jp">${esc(w[0])}</span><small>${esc(w[1])} · ${esc(w[2])}</small></div>`).join('')}</div></div>
      ${quizBlock(s.quiz)}
      <div class="row gap mt between wrap"><a class="btn btn-white" href="#/read/story">${I('book', 20)} Danh sách truyện</a>${nx ? `<a class="btn" href="#/story/${nx.id}">Truyện tiếp: <span class="jp">${esc(nx.title)}</span> ${I('arrow_r', 20)}</a>` : ''}</div></div>`;
    const lines = root.querySelector('[data-lines]');
    const hl = i => lines.querySelectorAll('.rline').forEach((r, k) => r.classList.toggle('playing', k === i));
    lines.addEventListener('click', e => { const r = e.target.closest('.rline'); if (!r) return; seq && seq.stop(); const i = +r.dataset.i; hl(i); SJ.audio.speak(SJ.ui.reading(s.lines[i].jp), { onend: () => hl(-1) }); });
    root.querySelector('[data-play]').onclick = e => {
      const b = e.currentTarget;
      if (seq) { seq.stop(); seq = null; b.innerHTML = `${I('play', 18)} Nghe cả bài`; return; }
      b.innerHTML = `${I('mute', 18)} Dừng`;
      seq = speakSeq(s.lines.map(l => SJ.ui.reading(l.jp)), i => { hl(i); if (i < 0) { seq = null; b.innerHTML = `${I('play', 18)} Nghe cả bài`; } });
    };
    bindOpts(root, lines);
    bindQuiz(root, s.quiz, s.id);
    return { destroy() { seq && seq.stop(); } };
  };

  P.dialog = function (root, id) {
    const d = SJ.DIALOGUES.find(x => x.id === id) || SJ.DIALOGUES[0];
    const st = SJ.store.get().settings;
    let seq = null, hideB = false;
    const idx = SJ.DIALOGUES.indexOf(d), nx = SJ.DIALOGUES[idx + 1];
    const pitch = { A: 1.25, B: 0.95 };
    root.innerHTML = `<div class="page-narrow">
      <a class="back-link" href="#/read/dialog">${I('arrow_l', 20)} Hội thoại</a>
      <div class="card reader">
        <div class="row gap mb"><span class="chip-pic">${I(d.icon, 46)}</span><div class="grow"><h1 style="margin:0">${esc(d.title)}</h1><div class="muted bold jp">${SJ.ui.ruby(d.jp)}</div></div></div>
        <div class="row gap wrap mb">${Object.keys(d.people).map(k => `<span class="tag ${k === 'A' ? 'tag-blue' : 'tag-pink'}">${I(d.people[k][1], 20)} ${k}: ${esc(d.people[k][0])}</span>`).join('')}
          <label class="switch small"><input type="checkbox" data-hideb><i></i><span>Đóng vai B (che lời B)</span></label></div>
        ${readerTools(st)}
        <div class="dlg ${optClass(st)}" data-lines>${d.lines.map((l, i) => `<div class="dline ${l[0]}" data-i="${i}"><span class="d-av">${I(d.people[l[0]][1], 38)}</span><div class="d-bub"><div class="d-who">${esc(d.people[l[0]][0])}</div><div class="d-jp">${SJ.ui.ruby(l[1])}</div><div class="rl-r d-r">${esc(l[2])}</div><div class="rl-vi d-vi">${esc(l[3])}</div></div></div>`).join('')}</div>
        ${d.note ? `<div class="tip-box mt">${I('bulb', 26)}<div>${esc(d.note)}</div></div>` : ''}
        <button class="btn btn-block btn-green mt" data-done>${I('check', 20)} Mình đã luyện xong hội thoại này</button>
      </div>
      <div class="row gap mt between wrap"><a class="btn btn-white" href="#/read/dialog">${I('talk', 20)} Danh sách hội thoại</a>${nx ? `<a class="btn" href="#/dialog/${nx.id}">Tiếp: ${esc(nx.title)} ${I('arrow_r', 20)}</a>` : ''}</div></div>`;
    const lines = root.querySelector('[data-lines]');
    const hl = i => lines.querySelectorAll('.dline').forEach((r, k) => r.classList.toggle('playing', k === i));
    const applyHide = () => lines.querySelectorAll('.dline.B .d-jp, .dline.B .d-r').forEach(x => { x.style.filter = hideB ? 'blur(7px)' : ''; });
    lines.addEventListener('click', e => {
      const r = e.target.closest('.dline'); if (!r) return; seq && seq.stop();
      const l = d.lines[+r.dataset.i];
      if (hideB && l[0] === 'B') r.querySelectorAll('.d-jp, .d-r').forEach(x => { x.style.filter = ''; });
      hl(+r.dataset.i); SJ.audio.speak(SJ.ui.reading(l[1]), { pitch: pitch[l[0]], onend: () => hl(-1) });
    });
    root.querySelector('[data-hideb]').onchange = e => { hideB = e.target.checked; applyHide(); };
    root.querySelector('[data-play]').onclick = e => {
      const b = e.currentTarget;
      if (seq) { seq.stop(); seq = null; b.innerHTML = `${I('play', 18)} Nghe cả bài`; return; }
      b.innerHTML = `${I('mute', 18)} Dừng`;
      seq = speakSeq(d.lines.map(l => ({ text: SJ.ui.reading(l[1]), pitch: pitch[l[0]] })), i => { hl(i); if (i < 0) { seq = null; b.innerHTML = `${I('play', 18)} Nghe cả bài`; } });
    };
    root.querySelector('[data-done]').onclick = e => {
      const first = SJ.store.markRead(d.id); SJ.store.addXP(first ? 10 : 3);
      e.currentTarget.disabled = true; e.currentTarget.innerHTML = `${I('check', 20)} Đã xong! +${first ? 10 : 3} XP`;
      SJ.audio.sfx('win'); if (first) U().confetti(50);
    };
    bindOpts(root, lines);
    return { destroy() { seq && seq.stop(); } };
  };

  // ===================== GÕ PHÍM TIẾNG NHẬT =====================
  const VOW = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };
  /** Chuẩn hoá để so sánh: về Hiragana, ー → nguyên âm trước đó, bỏ dấu câu & khoảng trắng */
  function norm(s) {
    const h = Array.from(SJ.toHira ? Array.from(s).map(c => SJ.toHira(c)).join('') : s);
    let out = '';
    h.forEach(c => {
      if (c === 'ー' && out) { const last = out[out.length - 1]; const o = SJ.KANA_MAP[last]; out += o ? (VOW[o.r.slice(-1)] || '') : ''; }
      else if (!/[\s、。！？!?,.「」・〜~]/.test(c)) out += c;
    });
    return out;
  }
  const kanaOnly = s => /^[぀-ヿ\s、。！？・ー]+$/.test(s);
  P.typing = function (root, modeArg) {
    let keyFn = null, timer = null;
    const MODES = [
      { id: 'kana', icon: 'kana', name: 'Gõ chữ cái', desc: 'Từng chữ Kana — làm quen bàn phím.' },
      { id: 'word', icon: 'speech', name: 'Gõ từ vựng', desc: 'Nhìn từ và hình, gõ romaji cho đúng.' },
      { id: 'sent', icon: 'scroll', name: 'Gõ cả câu', desc: 'Câu giao tiếp & câu trong truyện.' },
      { id: 'free', icon: 'keyboard', name: 'Bàn phím tự do', desc: 'Gõ romaji, ra chữ Nhật ngay lập tức.' },
    ];
    function menu() {
      keyFn = null;
      const S = SJ.store.get();
      root.innerHTML = `<div class="page-mid">
        <div class="page-head"><div class="ph-icon">${I('keyboard', 52)}</div><div><h1>Gõ phím tiếng Nhật</h1><p>Người Nhật gõ chữ bằng <b>romaji</b>: gõ <code>ka</code> ra か, <code>sushi</code> ra すし. Tập gõ vừa nhớ mặt chữ, vừa sẵn sàng nhắn tin tiếng Nhật! Đã gõ đúng <b>${S.typed}</b> từ.</p></div></div>
        <div class="mode-grid">${MODES.map(m => `<button class="mode-card" data-mode="${m.id}"><span class="mc-icon">${I(m.icon, 48)}</span><b>${m.name}</b><small>${m.desc}</small></button>`).join('')}</div>
        <div class="section-label">${I('bulb', 28)} Bảng gõ nhanh</div>
        <div class="card card-pad"><div class="key-table">${SJ.ime.CHEATS.map(c => `<div><span class="jp">${c[0]}</span><code>${esc(c[1])}</code></div>`).join('')}</div></div>
        <div class="section-label">${I('gear', 28)} Bật bàn phím tiếng Nhật trên máy của bạn</div>
        <div class="grid grid-3">
          <div class="card card-pad"><b>Máy tính Windows</b><p class="small muted bold mt-s">Cài đặt → Thời gian & ngôn ngữ → Ngôn ngữ → Thêm ngôn ngữ → 日本語. Nhấn <kbd>Alt</kbd> + <kbd>~</kbd> để chuyển gõ Nhật.</p></div>
          <div class="card card-pad"><b>Điện thoại Android</b><p class="small muted bold mt-s">Mở Gboard → Cài đặt → Ngôn ngữ → Thêm bàn phím → Tiếng Nhật → chọn kiểu "Romaji" (QWERTY).</p></div>
          <div class="card card-pad"><b>iPhone / iPad</b><p class="small muted bold mt-s">Cài đặt → Cài đặt chung → Bàn phím → Thêm bàn phím mới → Tiếng Nhật → "Romaji".</p></div></div>
      </div>`;
      root.querySelector('.mode-grid').onclick = e => { const b = e.target.closest('[data-mode]'); if (!b) return; SJ.audio.sfx('open'); if (b.dataset.mode === 'free') free(); else run(b.dataset.mode); };
    }
    function pool(mode) {
      const S = SJ.store.get();
      if (mode === 'kana') { const got = SJ.KANA_ALL.filter(o => S.items[o.k] && o.group !== 'small'); return (got.length >= 10 ? got : SJ.KANA.hira.basic).map(o => ({ jp: o.k, r: o.r, vi: o.script === 'kata' ? 'Katakana' : 'Hiragana' })); }
      if (mode === 'word') return SJ.VOCAB_ALL.map(o => ({ jp: SJ.ui.reading(o.jp), r: o.r, vi: o.vi, e: o.e })).filter(o => kanaOnly(o.jp) && o.jp.length <= 9);
      const ph = SJ.PHRASES.flatMap(c => c.list.map(p => ({ jp: SJ.ui.reading(p[0]), r: p[1], vi: p[2] })));
      const st = SJ.STORIES.filter(s => s.level <= 2).flatMap(s => s.lines.map(l => ({ jp: SJ.ui.reading(l.jp), r: l.r, vi: l.vi })));
      return ph.concat(st).filter(o => kanaOnly(o.jp) && o.jp.length <= 22);
    }
    function run(mode) {
      const list = U().shuffle(pool(mode));
      let i = 0, ok = 0, skip = 0, chars = 0, showHint = mode === 'kana', t0 = Date.now(), lastAt = 0;
      document.body.classList.add('focus-mode');
      root.innerHTML = `<div class="practice">
        <div class="game-top"><button class="icon-btn" data-quit aria-label="Thoát">${I('batsu', 20)}</button><div class="grow"></div>
          <div class="g-score">${I('check', 20)} <b data-ok>0</b> · ${I('bolt', 20)} <b data-spd>0</b><small class="muted">&nbsp;chữ/phút</small></div></div>
        <div class="card type-stage"><div class="type-target" data-tgt></div>
          <div class="type-live" data-live></div>
          <div class="type-input"><input class="input" data-in autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Gõ romaji ở đây…" aria-label="Gõ romaji"></div>
          <div class="row center-row gap-s mt"><button class="btn btn-sm btn-white" data-hint>${I('eye', 18)} <span>${showHint ? 'Ẩn' : 'Hiện'} gợi ý</span></button><button class="btn btn-sm btn-white" data-say-t>${I('speaker', 18)} Nghe</button><button class="btn btn-sm btn-white" data-skip>Bỏ qua ${I('arrow_r', 16)}</button></div></div>
        <p class="center muted small bold mt">Mẹo: ん gõ <b>nn</b>, っ gõ phụ âm đôi (kitte), ー gõ dấu <b>-</b> hoặc lặp nguyên âm.</p></div>`;
      const inp = root.querySelector('[data-in]'), live = root.querySelector('[data-live]'), tgt = root.querySelector('[data-tgt]');
      const elOk = root.querySelector('[data-ok]'), elSpd = root.querySelector('[data-spd]');
      let cur = null, target = '';
      function show() {
        cur = list[i % list.length]; i++;
        target = norm(cur.jp);
        tgt.innerHTML = `${cur.e ? `<div class="tt-pic">${I(cur.e, 70)}</div>` : ''}<div class="tt-jp">${esc(cur.jp)}</div><div class="tt-vi">${esc(cur.vi)}</div><div class="tt-hint">${showHint ? esc(cur.r) : ''}</div>`;
        inp.value = ''; inp.disabled = false; inp.focus(); render();
        if (mode !== 'kana') SJ.audio.speak(cur.jp);
      }
      function render() {
        const r = SJ.ime.convert(inp.value);
        const typed = norm(r.kana);
        let html = '';
        const isKata = /[ァ-ヺ]/.test(cur.jp);
        const disp = Array.from(isKata ? Array.from(r.kana).map(c => SJ.toKata(c)).join('') : r.kana);
        // tô màu theo so khớp với đích
        let k = 0;
        disp.forEach(c => {
          const nc = norm(c);
          if (!nc) { html += esc(c); return; }
          const ok2 = target.substr(k, nc.length) === nc;
          html += `<span class="${ok2 ? 'tl-ok' : 'tl-bad'}">${esc(c)}</span>`; k += nc.length;
        });
        live.innerHTML = html + `<span class="tl-pend">${esc(r.rest)}</span><span class="caret"></span>`;
        const fin = norm(SJ.ime.convert(inp.value, { final: true }).kana);
        if (fin === target || typed === target) done();
      }
      function done() {
        if (inp.disabled) return;
        inp.disabled = true; ok++; chars += target.length; elOk.textContent = ok;
        const mins = (Date.now() - t0) / 60000; elSpd.textContent = Math.round(chars / Math.max(mins, 0.05));
        SJ.audio.sfx('ok'); SJ.store.addTyped(1); SJ.store.addXP(1);
        if (ok % 10 === 0) { SJ.audio.sfx('combo'); U().toast(`${I('keyboard', 26)} Gõ đúng ${ok} lần! +3 XP`); SJ.store.addXP(3); }
        live.classList.add('pop-in'); setTimeout(() => live.classList.remove('pop-in'), 400);
        timer = setTimeout(show, 450);
      }
      inp.addEventListener('input', () => { const now = Date.now(); if (now - lastAt > 60) SJ.audio.sfx('tick'); lastAt = now; render(); });
      root.querySelector('[data-hint]').onclick = e => { showHint = !showHint; e.currentTarget.querySelector('span').textContent = showHint ? 'Ẩn gợi ý' : 'Hiện gợi ý'; tgt.querySelector('.tt-hint').textContent = showHint ? cur.r : ''; inp.focus(); };
      root.querySelector('[data-say-t]').onclick = () => { SJ.audio.speak(cur.jp); inp.focus(); };
      root.querySelector('[data-skip]').onclick = () => { if (inp.disabled) return; clearTimeout(timer); skip++; tgt.querySelector('.tt-hint').textContent = cur.r; SJ.audio.sfx('bad'); inp.disabled = true; timer = setTimeout(show, 1100); };
      root.querySelector('[data-quit]').onclick = finish;
      function finish() {
        clearTimeout(timer); document.body.classList.remove('focus-mode');
        const mins = (Date.now() - t0) / 60000;
        if (ok) SJ.store.addFish(Math.min(10, Math.ceil(ok / 3)));
        root.innerHTML = `<div class="page-narrow result pop-in"><div class="result-mochi">${U().mascot(ok >= 10 ? 'love' : 'happy', 140, 'jump')}</div><h1>Gõ phím xong!</h1>
          <div class="result-stats"><div class="rs card mint">${I('check', 30)}<b>${ok}</b><span>câu gõ đúng</span></div><div class="rs card sky">${I('bolt', 30)}<b>${Math.round(chars / Math.max(mins, 0.05))}</b><span>chữ / phút</span></div><div class="rs card sun">${I('fishcoin', 30)}<b>+${ok ? Math.min(10, Math.ceil(ok / 3)) : 0}</b><span>cá vàng</span></div></div>
          <div class="row gap center-row wrap"><button class="btn btn-white" data-menu>${I('keyboard', 20)} Chọn kiểu khác</button><button class="btn btn-lg" data-again>${I('refresh', 20)} Gõ tiếp</button></div></div>`;
        root.querySelector('[data-menu]').onclick = menu;
        root.querySelector('[data-again]').onclick = () => run(mode);
        if (ok >= 5) SJ.audio.sfx('win');
      }
      show();
    }
    function free() {
      let kata = false;
      root.innerHTML = `<div class="page-narrow">
        <button class="back-link link-btn" style="text-decoration:none" data-menu>${I('arrow_l', 20)} Gõ phím</button>
        <div class="card card-pad"><div class="card-title">${I('keyboard', 30)} Bàn phím tự do</div>
          <div class="row gap wrap mb"><div class="seg"><button class="active" data-sc="h">あ Hiragana</button><button data-sc="k">ア Katakana</button></div><span class="grow"></span><button class="btn btn-sm btn-white" data-copy>${I('check', 18)} Sao chép</button><button class="btn btn-sm btn-white" data-read>${I('speaker', 18)} Đọc</button></div>
          <div class="ime-out" data-out></div>
          <textarea class="input mt" data-in rows="3" placeholder="Gõ romaji: watashi wa mochi desu" spellcheck="false" autocapitalize="off"></textarea>
          <p class="small muted bold mt-s">Thử gõ: <code>arigatou</code>, <code>konnichiha</code>, <code>ko-hi-</code>, <code>kitte</code>, <code>kyou</code>…</p></div></div>`;
      const inp = root.querySelector('[data-in]'), out = root.querySelector('[data-out]');
      const conv = final => kata ? SJ.ime.toKata(inp.value, final) : SJ.ime.toHira(inp.value, final);
      const render = () => { const r = SJ.ime.convert(inp.value); const k = kata ? SJ.ime.toKata(inp.value, true) : r.kana; out.innerHTML = esc(kata ? k : r.kana) + (r.rest && !kata ? `<span class="pend">${esc(r.rest)}</span>` : ''); };
      inp.oninput = render;
      root.querySelector('[data-menu]').onclick = menu;
      root.querySelectorAll('[data-sc]').forEach(b => b.onclick = () => { kata = b.dataset.sc === 'k'; root.querySelectorAll('[data-sc]').forEach(x => x.classList.toggle('active', x === b)); render(); });
      root.querySelector('[data-copy]').onclick = () => { const t = conv(true); try { navigator.clipboard.writeText(t); U().toast('Đã sao chép: ' + esc(t)); } catch (e) { } };
      root.querySelector('[data-read]').onclick = () => SJ.audio.speak(conv(true));
      inp.focus(); render();
    }
    if (modeArg && MODES.some(m => m.id === modeArg)) { modeArg === 'free' ? free() : run(modeArg); } else menu();
    return { destroy() { clearTimeout(timer); document.body.classList.remove('focus-mode'); } };
  };

  // ===================== SỔ TỪ (từ điển mini) =====================
  // Katakana → Hiragana để gõ ネコ hay ねこ đều ra
  const fold = s => SJ.toHira(String(s || '')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  let DICT = null;
  function dictData() {
    if (DICT) return DICT;
    DICT = [];
    SJ.VOCAB_ALL.forEach(o => DICT.push({ key: o.key, kind: 'vocab', jp: o.jp, read: SJ.ui.reading(o.jp), r: o.r, vi: o.vi, e: o.e }));
    SJ.KANJI.forEach(o => DICT.push({ key: o.key, kind: 'kanji', jp: o.k, read: o.kun + ' ' + o.on, r: o.ex.map(x => x.r).join(' '), vi: o.m + ' — ' + o.hv, hv: o.hv, o }));
    SJ.KANA_ALL.filter(o => o.group !== 'small').forEach(o => DICT.push({ key: o.k, kind: 'kana', jp: o.k, read: o.k, r: o.r, vi: (o.script === 'kata' ? 'Katakana' : 'Hiragana') + ' — đọc ' + (o.v || o.r) }));
    const seen = new Set(DICT.map(d => d.read));
    SJ.STORIES.forEach(s => s.words.forEach(w => { const rd = w[0]; if (seen.has(rd)) return; seen.add(rd); DICT.push({ key: 'w:' + w[0], kind: 'vocab', jp: w[0], read: w[0], r: w[1], vi: w[2] }); }));
    DICT.forEach(d => { d.hay = fold([d.jp, d.read, d.r, d.vi, d.hv].join(' ')); });
    return DICT;
  }
  P.dict = function (root) {
    let q = '', kind = 'all';
    root.innerHTML = `<div class="page-mid">
      <div class="page-head"><div class="ph-icon">${I('magnifier', 52)}</div><div><h1>Sổ từ</h1><p>Tra nhanh bằng tiếng Việt, romaji, Hán Việt hoặc chữ Nhật. Bấm trái tim để lưu từ, ôn lại ở mục Ôn tập.</p></div></div>
      <div class="dict-search">${I('magnifier', 26)}<input class="input" data-q placeholder="Thử gõ: mèo, neko, ねこ, HỌC, 日…" autocomplete="off"></div>
      <div class="seg mb" data-kinds>${[['all', 'Tất cả'], ['vocab', 'Từ vựng'], ['kanji', 'Kanji'], ['kana', 'Kana'], ['fav', 'Đã lưu']].map(k => `<button data-k="${k[0]}" class="${k[0] === kind ? 'active' : ''}">${k[1]}</button>`).join('')}</div>
      <div class="card" data-res></div></div>`;
    const res = root.querySelector('[data-res]');
    function draw() {
      const S = SJ.store.get();
      const f = fold(q.trim());
      let list = dictData().filter(d => (kind === 'all' || (kind === 'fav' ? S.fav[d.key] : d.kind === kind)) && (!f || d.hay.includes(f)));
      if (f) list.sort((a, b) => (fold(a.vi).startsWith(f) || a.read.startsWith(q) || fold(a.r).startsWith(f) ? 0 : 1) - (fold(b.vi).startsWith(f) || b.read.startsWith(q) || fold(b.r).startsWith(f) ? 0 : 1));
      const total = list.length; list = list.slice(0, 80);
      res.innerHTML = list.length ? list.map(d => `<div class="dict-item"><span class="di-pic">${d.e ? I(d.e, 40) : `<span class="kana">${esc(d.jp.slice(0, 2))}</span>`}</span>
        <div class="di-main"><div class="di-jp">${esc(d.jp)}${d.kind === 'kanji' ? ` <span class="hv-badge sm">${d.hv}</span>` : ''}</div><div class="di-sub">${esc(d.r)} · ${esc(d.vi)}</div></div>
        <div class="di-acts">${U().sayBtn(d.kind === 'kanji' ? d.o.ex[0].kana : d.read)}<a class="say-btn di-ask" href="#/sensei/chat:${encodeURIComponent('Giải thích giúp mình ' + (d.kind === 'kanji' ? 'chữ Hán ' : d.kind === 'kana' ? 'chữ ' : 'từ ') + d.jp + ' (' + d.vi + '): cách dùng và vài câu ví dụ dễ nhé')}" title="Hỏi Sensei Mochi" aria-label="Hỏi Sensei Mochi">${I('sensei', 26)}</a>${d.kind !== 'vocab' ? `<a class="say-btn" href="#/write/${encodeURIComponent(d.jp)}" title="Luyện viết">${I('pencil', 20)}</a>` : ''}<button class="fav-btn ${S.fav[d.key] ? 'on' : ''}" data-fav="${esc(d.key)}" aria-label="Lưu từ">${I('heart', 22)}</button></div></div>`).join('')
        + (total > 80 ? `<p class="center muted small bold pad">Còn ${total - 80} kết quả nữa — gõ cụ thể hơn nha</p>` : '')
        : `<div class="empty-state">${U().mascot('think', 90)}${kind === 'fav' ? 'Chưa lưu từ nào. Bấm trái tim để lưu nha!' : 'Không tìm thấy từ này. Thử cách viết khác xem!'}</div>`;
    }
    root.querySelector('[data-q]').oninput = e => { q = e.target.value; draw(); };
    root.querySelector('[data-kinds]').onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; kind = b.dataset.k; root.querySelectorAll('[data-k]').forEach(x => x.classList.toggle('active', x === b)); draw(); };
    res.onclick = e => { const f = e.target.closest('[data-fav]'); if (!f) return; const on = SJ.store.toggleFav(f.dataset.fav); f.classList.toggle('on', on); SJ.audio.sfx(on ? 'pop' : 'tap'); if (kind === 'fav' && !on) draw(); };
    draw();
    setTimeout(() => root.querySelector('[data-q]').focus(), 100);
  };

  // ===================== PHIẾU TẬP VIẾT (in ra giấy) =====================
  P.print = function (root) {
    const ROWS = SJ.GOJUON.basic.map(r => Array.from(r[1]).filter(c => c !== '_').join(''));
    let script = 'hira', sel = new Set([0, 1]), custom = SJ.pages.printChars || '', kanjiL = null, boxes = 10, name = SJ.store.get().name || '';
    SJ.pages.printChars = null;
    function chars() {
      // giữ nguyên âm ghép / âm ngoại lai (きゃ, ファ…) thành một ô
      if (custom.trim()) return (custom.replace(/\s/g, '').match(/.[ゃゅょャュョァィゥェォ]?/gu) || []).flatMap(t => t.length > 1 && !SJ.KANA_MAP[t] ? Array.from(t) : [t]).filter((c, i, a) => a.indexOf(c) === i).slice(0, 40);
      if (script === 'kanji') { const L = SJ.LESSONS.find(l => l.id === (kanjiL || 'j1')); return L.items.slice(); }
      const out = [];
      ROWS.forEach((r, i) => { if (sel.has(i)) Array.from(r).forEach(c => out.push(script === 'kata' ? SJ.toKata(c) : c)); });
      return out;
    }
    function sheet() {
      const cs = chars();
      const info = c => { const o = SJ.KANA_MAP[c]; if (o) return o.r; const k = SJ.KANJI_MAP[c]; return k ? k.hv : ''; };
      return `<div class="ws-sheet"><div class="ws-title"><h2>Phiếu tập viết ${script === 'kanji' && !custom ? 'Kanji' : script === 'kata' && !custom ? 'Katakana' : custom ? '' : 'Hiragana'}</h2><span>Tên: ${esc(name) || '................'} · Ngày: ......../......../........ · ${U().brand('SubelJapan')}</span></div>
        ${cs.map(c => `<div class="ws-row"><span class="ws-lab">${esc(info(c))}</span><span class="ws-box model"><span>${c}</span></span><span class="ws-box trace"><span>${c}</span></span><span class="ws-box trace2"><span>${c}</span></span>${'<span class="ws-box"></span>'.repeat(Math.max(0, boxes - 3))}</div>`).join('')}
        <div class="ws-foot">Viết theo đúng thứ tự nét · Ô đầu: chữ mẫu · 2 ô tiếp: tô theo · Các ô còn lại: tự viết</div></div>`;
    }
    function draw() {
      root.innerHTML = `<div class="page-mid">
        <div class="page-head no-print"><div class="ph-icon">${I('printer', 52)}</div><div><h1>Phiếu tập viết</h1><p>Tạo phiếu ô vuông chuẩn kiểu genkō (原稿) để in ra giấy và luyện bằng bút — cách học truyền thống của học sinh Nhật.</p></div></div>
        <div class="card card-pad no-print mb">
          <div class="seg mb">${[['hira', 'Hiragana'], ['kata', 'Katakana'], ['kanji', 'Kanji']].map(s => `<button data-sc="${s[0]}" class="${script === s[0] && !custom ? 'active' : ''}">${s[1]}</button>`).join('')}</div>
          ${script !== 'kanji' ? `<div class="mini-label mb-s">Chọn hàng</div><div class="chips mb">${ROWS.map((r, i) => `<button class="chip-btn ${sel.has(i) ? 'active' : ''}" data-row="${i}"><span class="kana">${script === 'kata' ? Array.from(r).map(SJ.toKata).join('') : r}</span></button>`).join('')}</div>`
          : `<div class="mini-label mb-s">Chọn bài Kanji</div><div class="chips mb">${SJ.UNITS.find(u => u.id === 'kanji').lessons.map(l => `<button class="chip-btn ${(kanjiL || 'j1') === l.id ? 'active' : ''}" data-kl="${l.id}"><span class="jp">${esc(l.title)}</span></button>`).join('')}</div>`}
          <div class="grid grid-2"><div><div class="mini-label mb-s">Hoặc tự nhập chữ muốn luyện</div><input class="input" data-custom value="${esc(custom)}" placeholder="ví dụ: ねこ すし 日本"></div>
            <div><div class="mini-label mb-s">Tên trên phiếu</div><input class="input" data-name value="${esc(name)}" placeholder="Tên của bạn"></div></div>
          <div class="row gap wrap mt between"><div class="row gap-s"><span class="bold small">Số ô mỗi dòng</span><div class="seg">${[8, 10, 12].map(n => `<button data-bx="${n}" class="${boxes === n ? 'active' : ''}">${n}</button>`).join('')}</div></div>
            <button class="btn btn-lg" data-print>${I('printer', 22)} In phiếu</button></div></div>
        <div class="ws-preview print-only-wrap" data-prev>${sheet()}</div></div>`;
    }
    root.addEventListener('click', e => {
      const t = e.target;
      const sc = t.closest('[data-sc]'); if (sc) { script = sc.dataset.sc; custom = ''; draw(); return; }
      const rw = t.closest('[data-row]'); if (rw) { const i = +rw.dataset.row; sel.has(i) ? sel.delete(i) : sel.add(i); if (!sel.size) sel.add(0); custom = ''; draw(); return; }
      const kl = t.closest('[data-kl]'); if (kl) { kanjiL = kl.dataset.kl; custom = ''; draw(); return; }
      const bx = t.closest('[data-bx]'); if (bx) { boxes = +bx.dataset.bx; draw(); return; }
      if (t.closest('[data-print]')) { SJ.audio.sfx('pop'); setTimeout(() => window.print(), 150); }
    });
    root.addEventListener('input', e => {
      if (e.target.matches('[data-custom]')) { custom = e.target.value; root.querySelector('[data-prev]').innerHTML = sheet(); }
      if (e.target.matches('[data-name]')) { name = e.target.value; root.querySelector('[data-prev]').innerHTML = sheet(); }
    });
    if (custom) script = SJ.KANA_MAP[custom[0]] && SJ.KANA_MAP[custom[0]].script === 'kata' ? 'kata' : 'hira';
    draw();
  };

  // ===================== TIỆM CỦA MOCHI =====================
  P.shop = function (root) {
    let tryLook = null;
    function draw() {
      const S = SJ.store.get();
      const look = Object.assign({ fur: S.fur, acc: S.equip }, tryLook || {});
      const item = it => {
        const owned = it.type === 'power' ? false : SJ.store.owns(it.id);
        const worn = (it.type === 'acc' && S.equip === it.id) || (it.type === 'fur' && S.fur === it.id);
        const preview = it.type === 'power' ? I(it.icon, 76) : U().mascot('happy', 96, '', it.type === 'acc' ? { acc: it.id, fur: S.fur } : { fur: it.id, acc: S.equip });
        let btn;
        if (it.type === 'power') btn = S.freeze >= it.max ? `<button class="btn btn-sm" disabled>Đã đầy (${S.freeze}/${it.max})</button>` : `<button class="btn btn-sm ${S.fish >= it.price ? 'btn-yel' : ''}" data-buy="${it.id}" ${S.fish < it.price ? 'disabled' : ''}>${U().fish(it.price, 18)} Mua (${S.freeze}/${it.max})</button>`;
        else if (worn) btn = `<button class="btn btn-sm btn-white" disabled>${I('check', 16)} Đang dùng</button>`;
        else if (owned) btn = `<button class="btn btn-sm btn-green" data-wear="${it.id}">Dùng ngay</button>`;
        else btn = `<button class="btn btn-sm ${S.fish >= it.price ? 'btn-yel' : ''}" data-buy="${it.id}" ${S.fish < it.price ? 'disabled' : ''}>${U().fish(it.price, 18)} Mua</button>`;
        return `<div class="card shop-item ${owned ? 'owned' : ''} ${worn ? 'worn' : ''}"><button class="si-pic" data-try="${it.id}" title="Thử đồ" style="cursor:pointer">${preview}</button><b>${esc(it.name)}</b><small>${esc(it.desc)}</small>${btn}</div>`;
      };
      const sec = (t, arr) => `<div class="section-label">${t}</div><div class="shop-grid">${arr.map(item).join('')}</div>`;
      const base = [{ id: 'acc_sakura', type: 'acc', name: 'Kẹp hoa anh đào', desc: 'Món quà đầu tiên của Mochi', price: 0 }, { id: 'acc_none', type: 'acc', name: 'Không đeo gì', desc: 'Mochi nguyên bản', price: 0 }];
      root.innerHTML = `<div class="page-mid">
        <div class="card shop-hero"><div class="sh-stage">${U().mascot('cheer', 170, 'bob', look)}</div>
          <div class="grow"><h1>Tiệm của Mochi</h1><p class="muted bold">Học bài, làm nhiệm vụ, mở rương để kiếm cá vàng. Dùng cá mua phụ kiện, đổi "vị" cho Mochi và bùa giữ chuỗi. Bấm vào hình để thử đồ!</p>
            <div class="row gap wrap"><span class="sh-fish">${I('fishcoin', 30)} ${S.fish}</span><span class="tag tag-blue">${I('omamori', 20)} ${S.freeze}/2 bùa giữ chuỗi</span>${tryLook ? `<button class="btn btn-sm btn-white" data-untry>Bỏ thử đồ</button>` : ''}</div></div></div>
        ${sec(`${I('omamori', 28)} Bùa & vật phẩm`, SJ.store.SHOP.filter(x => x.type === 'power'))}
        ${sec(`${I('ribbon', 28)} Phụ kiện`, base.concat(SJ.store.SHOP.filter(x => x.type === 'acc')))}
        ${sec(`${I('palette', 28)} Vị của Mochi`, [{ id: 'fur_white', type: 'fur', name: 'Mochi trắng', desc: 'Vị nguyên bản mềm mịn', price: 0 }].concat(SJ.store.SHOP.filter(x => x.type === 'fur')))}
        <p class="center muted small bold mt-l">Mẹo: hoàn thành 3 nhiệm vụ mỗi ngày ≈ 35 cá · mở rương cuối mỗi phần = 30 cá · lên cấp = 20 cá</p></div>`;
    }
    root.onclick = e => {
      const tr = e.target.closest('[data-try]');
      if (tr) { const id = tr.dataset.try; tryLook = id.startsWith('fur_') ? { fur: id } : id === 'freeze' ? null : { acc: id }; SJ.audio.sfx('pop'); draw(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (e.target.closest('[data-untry]')) { tryLook = null; draw(); return; }
      const w = e.target.closest('[data-wear]'); if (w) { SJ.store.wear(w.dataset.wear); tryLook = null; SJ.audio.sfx('sparkle'); draw(); return; }
      const b = e.target.closest('[data-buy]');
      if (b) {
        const r = SJ.store.buy(b.dataset.buy);
        if (r.ok) { SJ.audio.sfx('buy'); setTimeout(() => SJ.audio.sfx('meow2'), 400); U().confetti(45); tryLook = null; U().toast(`${I('shop', 26)} Mua thành công! Mochi thích lắm nè`); }
        else if (r.why === 'money') U().toast(`${I('fishcoin', 24)} Chưa đủ cá — học thêm chút nữa nha!`);
        draw();
      }
    };
    draw();
  };
})(window.SJ);
