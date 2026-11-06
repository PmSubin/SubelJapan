/* SubelJapan — Luyện tập vô tận: đọc / nghe / viết liên tục không ngừng, có chuỗi đúng liên tiếp */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const MODES = [
    { id: 'mix', icon: 'rainbow', name: 'Trộn tất cả', desc: 'Đọc, nghe, viết, từ vựng xen kẽ — đa dạng nhất!' },
    { id: 'read', icon: 'eye', name: 'Đọc chữ', desc: 'Nhìn chữ, chọn cách đọc. Siêu nhanh.' },
    { id: 'listen', icon: 'headphones', name: 'Nghe', desc: 'Nghe Mochi đọc, chọn chữ đúng.' },
    { id: 'write', icon: 'pencil', name: 'Viết từ trí nhớ', desc: 'Nhìn romaji, tự viết chữ ra — máy chấm điểm liền.' },
    { id: 'vocab', icon: 'speech', name: 'Từ vựng', desc: 'Ôn nghĩa từ vựng liên tục.' },
    { id: 'kanji', icon: 'torii', name: 'Kanji', desc: 'Ôn nghĩa & âm Hán Việt.' },
  ];
  const SOURCES = [['auto', 'Ưu tiên chữ mình hay sai'], ['hira-basic', 'Hiragana cơ bản'], ['hira-all', 'Hiragana đầy đủ'], ['kata-basic', 'Katakana cơ bản'], ['kata-all', 'Katakana đầy đủ'], ['mix', 'Trộn Hira + Kata']];

  function kanaPool(src) {
    if (src && src !== 'auto') return SJ.pool(src);
    const items = SJ.store.get().items;
    const got = SJ.KANA_ALL.filter(o => items[o.k] && o.group !== 'small');
    return got.length >= 8 ? got : SJ.KANA.hira.basic.slice();
  }
  function weighted(list, keyOf, avoid) {
    const S = SJ.store, srs = S.get().srs, now = Date.now();
    const w = list.map(o => { const k = keyOf(o); let x = S.weakness(k); if (srs[k] && srs[k].due <= now) x += 1; if (o === avoid) x = 0.0001; return x; });
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < list.length; i++) { r -= w[i]; if (r <= 0) return list[i]; }
    return list[list.length - 1];
  }
  function learnedVocab() { const it = SJ.store.get().items; const l = SJ.VOCAB_ALL.filter(o => it[o.key]); return l.length >= 6 ? l : SJ.VOCAB.greet.concat(SJ.VOCAB.number); }
  function learnedKanji() { const it = SJ.store.get().items; const l = SJ.KANJI.filter(o => it[o.key]); return l.length >= 6 ? l : SJ.KANJI.slice(0, 17); }

  function open(root, modeArg) {
    let mode = MODES.some(m => m.id === modeArg) ? modeArg : null;
    let src = 'auto';
    let pad = null, sv = null, tmo = null, destroyed = false, keyFn = null;
    const onKey = e => keyFn && keyFn(e);
    document.addEventListener('keydown', onKey);

    function menu() {
      keyFn = null;
      const S = SJ.store.get();
      root.innerHTML = `<div class="container-sm pop-in">
        <div class="page-head center"><div class="ph-icon float">${I('infinity', 84)}</div><h1 class="title-hand">Luyện tập vô tận</h1><p class="muted">Luyện liên tục không ngừng nghỉ. Mỗi câu đúng nối dài <b>chuỗi</b> — sai là đứt chuỗi đó nha! Mochi sẽ ưu tiên những chữ bạn hay quên.</p></div>
        <div class="chain-best paper"><span class="tape"></span><span>${I('chain', 30)} Chuỗi dài nhất</span><b>${S.bestChain}</b><span>${I('fire', 26)} ${SJ.store.streakNow()} ngày liên tiếp</span></div>
        <div class="gs-label">Nguồn chữ (Kana)</div>
        <div class="chips" data-src>${SOURCES.map(s => `<button class="chip-btn ${s[0] === src ? 'active' : ''}" data-val="${s[0]}">${s[1]}</button>`).join('')}</div>
        <div class="gs-label">Chọn kiểu luyện</div>
        <div class="mode-grid">${MODES.map(m => `<button class="mode-card paper" data-mode="${m.id}"><span class="mc-icon">${I(m.icon, 58)}</span><b>${m.name}</b><small>${m.desc}</small></button>`).join('')}</div>
      </div>`;
      root.querySelector('[data-src]').onclick = e => { const b = e.target.closest('.chip-btn'); if (!b) return; src = b.dataset.val; root.querySelectorAll('[data-src] .chip-btn').forEach(x => x.classList.toggle('active', x === b)); SJ.audio.sfx('tap'); };
      root.querySelector('.mode-grid').onclick = e => { const b = e.target.closest('[data-mode]'); if (!b) return; mode = b.dataset.mode; SJ.audio.sfx('open'); history.replaceState(null, '', '#/practice/' + mode); document.body.classList.add('focus-mode'); run(); };
    }

    function run() {
      let chain = 0, total = 0, okCount = 0, xpGain = 0, last = null;
      const S = SJ.store.get();
      const M = MODES.find(m => m.id === mode);
      root.innerHTML = `<div class="container-sm practice">
        <div class="game-top"><button class="icon-btn" data-quit aria-label="Thoát">${I('batsu', 20)}</button>
          <div class="chain-box"><span class="chain-ico">${I('chain', 30)}</span><b data-chain>0</b><small>chuỗi</small></div>
          <div class="g-score"><span title="Kỷ lục chuỗi">${I('trophy', 20)} <b data-best>${S.bestChain}</b></span> · ${I('check', 18)} <b data-ok>0</b>/<b data-total>0</b></div></div>
        <div class="chain-meter"><div class="chain-fill" data-fill></div></div>
        <div class="pr-mode muted center">${I(M.icon, 20)} ${M.name} · <button class="link-btn" data-switch>đổi kiểu</button></div>
        <div data-stage class="pr-stage"></div>
        <div data-foot class="pr-foot"></div></div>`;
      const stage = root.querySelector('[data-stage]'), foot = root.querySelector('[data-foot]');
      const elChain = root.querySelector('[data-chain]'), elBest = root.querySelector('[data-best]'), elOk = root.querySelector('[data-ok]'), elTotal = root.querySelector('[data-total]'), fill = root.querySelector('[data-fill]');
      root.querySelector('[data-quit]').onclick = () => finish();
      root.querySelector('[data-switch]').onclick = () => { cleanup(); document.body.classList.remove('focus-mode'); menu(); };

      function setChain(n) {
        chain = n; elChain.textContent = n;
        const box = root.querySelector('.chain-box');
        box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump');
        box.classList.toggle('hot', n >= 10); box.classList.toggle('fire', n >= 25);
        fill.style.width = ((n % 10) * 10) + '%';
        SJ.store.setChain(n); elBest.textContent = Math.max(SJ.store.get().bestChain, n);
      }
      function award(ok, key) {
        total++; elTotal.textContent = total;
        if (key) SJ.store.rec(key, ok);
        if (ok) {
          okCount++; elOk.textContent = okCount; setChain(chain + 1);
          let gain = 1;
          if (chain % 10 === 0) { gain += 5; SJ.audio.sfx('combo'); U().toast(`${I('chain', 22)} Chuỗi ${chain}! +5 XP thưởng`); if (chain % 50 === 0) U().confetti(60); }
          xpGain += gain; SJ.store.addXP(gain);
        } else {
          if (chain >= 5) U().toast(`${U().mascot('sad', 30)} Chuỗi ${chain} bị đứt rồi… làm lại nào, Mochi tin bạn!`, 2400);
          setChain(0);
        }
      }
      function cleanup() { clearTimeout(tmo); sv && sv.stop(); pad && pad.destroy(); pad = null; sv = null; keyFn = null; }
      function finish() {
        cleanup();
        document.body.classList.remove('focus-mode');
        root.innerHTML = `<div class="container-sm result pop-in"><div class="result-mochi">${U().mascot(okCount >= 20 ? 'love' : 'happy', 130, 'jump')}</div>
          <h1 class="title-hand">Nghỉ tay xíu nha!</h1>
          <div class="result-stats"><div class="rs paper">${I('check', 28)}<b>${okCount}/${total}</b><span>câu đúng</span></div><div class="rs paper">${I('chain', 28)}<b>${SJ.store.get().bestChain}</b><span>chuỗi kỷ lục</span></div><div class="rs paper">${I('star', 28)}<b>+${xpGain}</b><span>XP</span></div></div>
          <p class="muted">Luyện đều đặn mỗi ngày để giữ chuỗi ${SJ.store.streakNow()} ngày nhé!</p>
          <div class="row gap wrap"><a class="btn btn-paper grow" href="#/">${I('home', 20)} Trang chủ</a><button class="btn btn-lg grow" data-again>${I('infinity', 22)} Luyện tiếp</button></div></div>`;
        root.querySelector('[data-again]').onclick = () => { document.body.classList.add('focus-mode'); run(); };
        if (okCount >= 10) SJ.audio.sfx('win');
      }

      function nextQ() {
        if (destroyed) return;
        cleanup();
        let m = mode;
        if (m === 'mix') m = U().pick(['read', 'read', 'listen', 'write', 'vocab', 'kanji', 'r2k']);
        if (m === 'read') return choiceQ(kanaQ(U().pick(['k2r', 'k2r', 'r2k'])));
        if (m === 'r2k') return choiceQ(kanaQ('r2k'));
        if (m === 'listen') return choiceQ(kanaQ('listen'));
        if (m === 'vocab') { const pool = learnedVocab(); const it = weighted(pool, o => o.key, last); last = it; return choiceQ(SJ.lesson.vocabQ(it, U().pick(['w2m', 'm2w', 'listen']), pool)); }
        if (m === 'kanji') { const pool = learnedKanji(); const it = weighted(pool, o => o.key, last); last = it; return choiceQ(SJ.lesson.kanjiQ(it, U().pick(['k2m', 'm2k', 'k2hv', 'read']), pool.length < 6 ? SJ.KANJI : pool)); }
        if (m === 'write') return writeQ();
      }
      function kanaQ(type) {
        const pool = kanaPool(src); const it = weighted(pool, o => o.k, last); last = it;
        return SJ.lesson.kanaQ(it, type, pool.length < 6 ? pool.concat(SJ.KANA.hira.basic) : pool);
      }

      function choiceQ(q) {
        let answered = false;
        stage.innerHTML = `<div class="quiz pop-in"><div class="quiz-ask">${q.ask}</div><div class="quiz-prompt">${q.prompt}</div>
          <div class="quiz-opts ${q.options.length > 3 ? 'four' : ''}">${q.options.map((o, i) => `<button class="opt" data-nosfx="1" data-v="${esc(o.val)}"><kbd>${i + 1}</kbd>${o.label}</button>`).join('')}</div></div>`;
        foot.innerHTML = '';
        if (q.say) setTimeout(() => SJ.audio.speak(q.say), 200);
        const pick = b => {
          if (answered) return; answered = true;
          const ok = b.dataset.v === q.answer;
          stage.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.dataset.v === q.answer) x.classList.add('ok'); });
          if (!ok) b.classList.add('bad', 'shake');
          SJ.audio.sfx(ok ? 'ok' : 'bad');
          award(ok, q.key);
          if (ok) tmo = setTimeout(nextQ, 650);
          else {
            foot.innerHTML = `<div class="feedback bad slide-up"><div class="fb-left">${U().mascot('sad', 52)}<div><div class="fb-title">${U().pick(SJ.COMFORTS)}</div><div class="fb-hint">${q.hint || ''}</div></div></div><button class="btn btn-red" data-cont>Tiếp ${I('arrow_r', 20)}</button></div>`;
            foot.querySelector('[data-cont]').onclick = nextQ;
            keyFn = e => { if (e.key === 'Enter') nextQ(); };
          }
        };
        stage.querySelectorAll('.opt').forEach(b => b.onclick = () => pick(b));
        keyFn = e => { if (/^[1-4]$/.test(e.key) && !answered) { const b = stage.querySelectorAll('.opt')[+e.key - 1]; b && pick(b); } };
      }

      function writeQ() {
        const useKanji = Math.random() < 0.2 && Object.keys(SJ.store.get().items).some(k => k.startsWith('j:'));
        let it, ch, label, sub, key;
        if (useKanji) { const pool = learnedKanji(); it = weighted(pool, o => o.key, last); ch = it.k; label = it.m; sub = `Hán Việt: ${it.hv}`; key = it.key; }
        else { const pool = kanaPool(src).filter(o => o.k.length === 1); it = weighted(pool.length ? pool : SJ.KANA.hira.basic, o => o.k, last); ch = it.k; label = it.r; sub = it.script === 'kata' ? 'Viết bằng Katakana' : 'Viết bằng Hiragana'; key = it.k; }
        last = it;
        let hinted = false, checked = false;
        stage.innerHTML = `<div class="write-q pop-in">
          <div class="quiz-ask">Viết chữ này từ trí nhớ nhé!</div>
          <div class="wq-target"><span class="wq-label ${useKanji ? '' : 'romaji-big'}">${esc(label)}</span><span class="wq-sub">${I(it.script === 'kata' ? 'bolt' : useKanji ? 'torii' : 'sakura', 20)} ${sub}</span></div>
          <div class="wq-pad" data-pad></div>
          <div class="pad-tools"><button class="btn btn-sm btn-paper" data-a="undo" aria-label="Hoàn tác">${I('undo', 18)}</button><button class="btn btn-sm btn-paper" data-a="clear">${I('eraser', 18)} Xoá</button><button class="btn btn-sm btn-ghost" data-a="hint">${I('bulb', 18)} Gợi ý</button><button class="btn btn-sm btn-ghost" data-a="skip">${I('question', 18)} Chịu</button><button class="btn btn-green" data-a="check">${I('check', 18)} Chấm</button></div>
          <div data-res></div></div>`;
        foot.innerHTML = '';
        pad = SJ.writing.tracePad(stage.querySelector('[data-pad]'), ch, { size: 280, guide: false });
        const res = stage.querySelector('[data-res]');
        const reveal = (ok, sc) => {
          checked = true;
          res.innerHTML = `<div class="wq-reveal paper pop-in"><div class="stroke-box sm" data-sv></div><div><div class="fb-title">${ok ? (hinted ? 'Đúng rồi (có gợi ý)' : U().pick(SJ.CHEERS)) : 'Chữ đúng là:'} <span class="jp big-inline">${ch}</span></div>${sc != null ? `<div>Điểm: <b>${sc}</b>/100 ${U().stars(SJ.writing.verdict(sc).stars, 3, 18)}</div>` : ''}<div class="muted small">Xem lại thứ tự nét bên cạnh nha</div></div></div>`;
          sv = SJ.writing.strokeView(res.querySelector('[data-sv]'), ch);
          foot.innerHTML = `<button class="btn btn-lg btn-block ${ok ? 'btn-green' : ''}" data-cont>Chữ tiếp theo ${I('arrow_r', 22)}</button>`;
          foot.querySelector('[data-cont]').onclick = nextQ;
          keyFn = e => { if (e.key === 'Enter') nextQ(); };
          setTimeout(() => SJ.audio.speak(ch), 300);
        };
        stage.querySelector('.pad-tools').onclick = e => {
          const a = e.target.closest('[data-a]'); if (!a || checked) return;
          const act = a.dataset.a;
          if (act === 'undo') pad.undo();
          if (act === 'clear') pad.clear();
          if (act === 'hint') { hinted = true; pad.setGuide(true); }
          if (act === 'skip') { award(false, key); SJ.audio.sfx('bad'); reveal(false); }
          if (act === 'check') {
            if (!pad.hasInk()) { U().toast(`${I('pencil', 20)} Viết thử trước đã nha`); return; }
            const r = pad.score();
            const ok = r.score >= 55;
            SJ.audio.sfx(ok ? (r.score >= 85 ? 'stamp' : 'ok') : 'bad');
            if (ok) { SJ.store.addWritten(); if (hinted) { total++; elTotal.textContent = total; okCount++; elOk.textContent = okCount; SJ.store.rec(key, true); } else award(true, key); }
            else award(false, key);
            reveal(ok, r.score);
          }
        };
        keyFn = e => { if (e.key === 'Enter' && !checked) stage.querySelector('[data-a="check"]').click(); };
      }

      nextQ();
    }

    if (mode) run(); else menu();
    return { destroy() { destroyed = true; clearTimeout(tmo); sv && sv.stop(); pad && pad.destroy(); document.removeEventListener('keydown', onKey); } };
  }

  SJ.practice = { open, MODES };
})(window.SJ);
