/* SubelJapan — 6 trò chơi: Thử thách 60s, Mưa chữ, Lật thẻ, Nghe chọn chữ, Ghép từ, Đúng hay Sai */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const GAMES = [
    { id: 'quiz', icon: 'bolt', name: 'Thử thách 60 giây', desc: 'Chọn đáp án đúng nhanh nhất có thể. Đúng liên tục để nhân combo!', color: '#f9b8c6' },
    { id: 'rain', icon: 'rain', name: 'Mưa chữ', desc: 'Chữ rơi từ trên mây — gõ hoặc chạm cách đọc để "bắn" trước khi chạm đất!', color: '#a9d0ec' },
    { id: 'memory', icon: 'cards', name: 'Lật thẻ trí nhớ', desc: 'Lật thẻ tìm cặp giống nhau. Ít lượt nhất là giỏi nhất!', color: '#cfbcee' },
    { id: 'listen', icon: 'headphones', name: 'Nghe chọn chữ', desc: 'Mochi đọc, bạn chọn đúng chữ. Luyện tai siêu tốc!', color: '#b3d394' },
    { id: 'builder', icon: 'puzzle', name: 'Ghép từ', desc: 'Nhìn hình vẽ, xếp các chữ cái thành từ đúng.', color: '#f8d77c' },
    { id: 'tf', icon: 'maru', name: 'Đúng hay Sai', desc: '30 giây phán đoán thần tốc: đúng (○) hay sai (×)?', color: '#ffc9a8' },
  ];
  const G = id => GAMES.find(g => g.id === id);
  let keyFn = null;
  document.addEventListener('keydown', e => { keyFn && keyFn(e); });

  function distinctBy(list, n, f, ex) {
    const seen = new Set(ex || []), out = [];
    for (const x of U().shuffle(list)) { const k = f(x); if (!seen.has(k)) { seen.add(k); out.push(x); if (out.length >= n) break; } }
    return out;
  }

  // ---------- Màn chuẩn bị & kết quả dùng chung ----------
  function setup(root, g, opts, onStart) {
    keyFn = null;
    const S = SJ.store.get();
    let set = S.settings.poolSet || 'hira-basic';
    let mode = opts.modes ? opts.modes[0][0] : null;
    root.innerHTML = `<div class="container-sm game-setup pop-in">
      <a href="#/games" class="back-link">${I('arrow_l', 20)} Trò chơi</a>
      <div class="gs-head paper" style="--gc:${g.color}"><span class="tape"></span><div class="gs-icon float">${I(g.icon, 92)}</div><h1 class="title-hand">${g.name}</h1><p>${g.desc}</p></div>
      ${opts.modes ? `<div class="gs-label">Chế độ</div><div class="chips" data-group="mode">${opts.modes.map(m => `<button class="chip-btn ${m[0] === mode ? 'active' : ''}" data-val="${m[0]}">${m[1]}</button>`).join('')}</div>` : ''}
      ${opts.sets !== false ? `<div class="gs-label">Bộ chữ</div><div class="chips" data-group="set">${SJ.POOL_SETS.map(s => `<button class="chip-btn ${s[0] === set ? 'active' : ''}" data-val="${s[0]}">${s[1]}</button>`).join('')}</div>` : ''}
      ${opts.note ? `<div class="gs-note">${opts.note}</div>` : ''}
      <div class="gs-best">${opts.bestText ? opts.bestText(mode) : ''}</div>
      <button class="btn btn-lg btn-block" data-start>Bắt đầu chơi! ${I('play', 22)}</button>
    </div>`;
    root.querySelectorAll('.chips').forEach(c => c.onclick = e => {
      const b = e.target.closest('.chip-btn'); if (!b) return;
      c.querySelectorAll('.chip-btn').forEach(x => x.classList.toggle('active', x === b));
      if (c.dataset.group === 'set') set = b.dataset.val; else mode = b.dataset.val;
      SJ.audio.sfx('tap');
      if (opts.bestText) root.querySelector('.gs-best').innerHTML = opts.bestText(mode);
    });
    root.querySelector('[data-start]').onclick = () => { SJ.audio.sfx('open'); SJ.store.setSetting('poolSet', set); onStart({ set, mode, pool: SJ.pool(set) }); };
  }
  function result(root, g, r) {
    keyFn = null;
    root.innerHTML = `<div class="container-sm result pop-in game-result">
      <div class="result-mochi">${U().mascot(r.mood || 'happy', 130, 'jump')}${r.isNew ? U().hanko('新記録', 'stamp-in') : ''}</div>
      <h1 class="title-hand">${r.title || 'Hết giờ rồi!'}</h1>
      <div class="big-score">${r.score}<small>${r.unit || ' điểm'}</small></div>
      ${r.isNew ? `<div class="new-best">${I('trophy', 22)} Kỷ lục mới!</div>` : (r.best != null ? `<div class="muted">Kỷ lục của bạn: ${r.best}${r.unit || ''}</div>` : '')}
      <div class="result-stats">${(r.stats || []).map(s => `<div class="rs paper"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}<div class="rs paper">${I('star', 28)}<b>+${r.xp}</b><span>XP</span></div><div class="rs paper">${I('fishcoin', 28)}<b>+${r.xp ? Math.min(6, 1 + Math.floor(r.xp / 4)) : 0}</b><span>cá vàng</span></div></div>
      <div class="row gap wrap"><a class="btn btn-paper grow" href="#/games">${I('game', 20)} Trò khác</a><button class="btn btn-lg grow" data-again>${I('refresh', 20)} Chơi lại</button></div>
    </div>`;
    if (r.xp) SJ.store.addXP(r.xp);
    const fishGot = r.xp ? Math.min(6, 1 + Math.floor(r.xp / 4)) : 0; if (fishGot) SJ.store.addFish(fishGot, true);
    root.querySelector('[data-again]').onclick = r.again;
    SJ.audio.sfx('win');
    if (r.isNew) setTimeout(() => SJ.audio.sfx('stamp'), 600);
    if (r.isNew || r.mood === 'love') U().confetti();
  }
  const top = (extra) => `<div class="game-top"><button class="icon-btn" data-quit aria-label="Thoát">${I('batsu', 20)}</button>${extra}</div>`;

  // ================= 1. THỬ THÁCH 60 GIÂY =================
  function quiz(root) {
    const g = G('quiz'); let timer = null;
    function start(cfg) {
      let time = 60, score = 0, combo = 0, maxCombo = 0, correct = 0, cur = null, lock = false, over = false, lastSec = 60;
      const pool = cfg.pool;
      root.innerHTML = `<div class="container-sm game">${top(`<div class="timer-bar"><div class="timer-fill"></div></div><div class="g-score">${I('star', 22)} <b data-sc>0</b></div>`)}
        <div class="combo" data-combo></div><div class="gq-prompt paper" data-pr></div><div class="quiz-opts four" data-op></div></div>`;
      const tf = root.querySelector('.timer-fill'), sc = root.querySelector('[data-sc]'), pr = root.querySelector('[data-pr]'), op = root.querySelector('[data-op]'), cb = root.querySelector('[data-combo]');
      root.querySelector('[data-quit]').onclick = () => end();
      function q() {
        if (over) return;
        const it = U().pick(pool.filter(o => !cur || o.k !== cur.k)); cur = it;
        const rev = Math.random() < 0.35;
        const opts = U().shuffle([it].concat(distinctBy(pool.filter(o => o.k !== it.k), 3, o => o.r, [it.r])));
        pr.innerHTML = rev ? `<div class="q-big romaji-big pop-in">${it.r}</div>` : `<div class="q-big jp pop-in">${it.k}</div>`;
        op.innerHTML = opts.map((o, i) => `<button class="opt" data-nosfx="1" data-k="${o.k}"><kbd>${i + 1}</kbd>${rev ? `<span class="jp opt-jp">${o.k}</span>` : o.r}</button>`).join('');
        lock = false;
      }
      op.onclick = e => { const b = e.target.closest('.opt'); if (b && !lock) answer(b); };
      function answer(b) {
        lock = true; const ok = b.dataset.k === cur.k; SJ.store.rec(cur.k, ok);
        if (ok) { combo++; maxCombo = Math.max(maxCombo, combo); score += combo >= 10 ? 3 : combo >= 5 ? 2 : 1; correct++; b.classList.add('ok'); SJ.audio.sfx(combo % 5 === 0 ? 'combo' : 'ok'); }
        else { combo = 0; time = Math.max(0, time - 3); b.classList.add('bad'); const r = op.querySelector(`[data-k="${cur.k}"]`); r && r.classList.add('ok'); SJ.audio.sfx('bad'); }
        sc.textContent = score;
        cb.innerHTML = combo >= 2 ? `<span class="combo-pill pop-in">${I('fire', 18)} Combo x${combo}${combo >= 5 ? ` · ${combo >= 10 ? 3 : 2}× điểm` : ''}</span>` : '';
        setTimeout(q, ok ? 260 : 750);
      }
      let last = Date.now();
      timer = setInterval(() => {
        const now = Date.now(); time -= (now - last) / 1000; last = now;
        tf.style.width = U().clamp(time / 60 * 100, 0, 100) + '%'; tf.classList.toggle('low', time < 10);
        if (time < 10 && Math.ceil(time) !== lastSec) { lastSec = Math.ceil(time); SJ.audio.sfx('tick'); }
        if (time <= 0) end();
      }, 100);
      function end() {
        if (over) return; over = true; clearInterval(timer); timer = null;
        const isNew = SJ.store.setBest('quiz', score);
        result(root, g, { score, best: SJ.store.get().games.quiz, isNew, xp: Math.min(50, score + Math.floor(maxCombo / 2)), mood: score >= 25 ? 'love' : score >= 12 ? 'happy' : 'wink', stats: [[correct, 'câu đúng'], [maxCombo, 'combo cao nhất']], again: () => start(cfg) });
      }
      keyFn = e => { if (/^[1-4]$/.test(e.key) && !lock) { const b = op.querySelectorAll('.opt')[+e.key - 1]; b && answer(b); } };
      q();
    }
    setup(root, g, { bestText: () => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games.quiz || 0}</b> điểm` }, start);
    return { destroy() { clearInterval(timer); keyFn = null; } };
  }

  // ================= 2. MƯA CHỮ =================
  function rain(root) {
    const g = G('rain'); let raf = null, alive = false, onVis = null;
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    function start(cfg) {
      const tap = cfg.mode === 'tap';
      alive = true;
      root.innerHTML = `<div class="container game">${top(`<div class="lives" data-lv></div><div class="g-score">${I('star', 22)} <b data-sc>0</b> · Cấp <b data-lvl>1</b></div>`)}
        <div class="rain-area" data-area><div class="rain-cloud c1">${I('rain', 70)}</div><div class="rain-cloud c2">${I('cloudsun', 56)}</div><div class="rain-ground"></div><div class="rain-paused hidden">Tạm dừng<br><small>Bấm để chơi tiếp</small></div></div>
        ${tap ? '<div class="quiz-opts four rain-opts" data-op></div>' : '<input class="input rain-input" data-inp placeholder="Gõ cách đọc (romaji) vào đây, vd: ka" autocomplete="off" autocapitalize="off" spellcheck="false">'}</div>`;
      const area = root.querySelector('[data-area]'), sc = root.querySelector('[data-sc]'), lvl = root.querySelector('[data-lvl]'), lv = root.querySelector('[data-lv]');
      const op = root.querySelector('[data-op]'), inp = root.querySelector('[data-inp]'), pz = root.querySelector('.rain-paused');
      const items = []; let lives = 3, score = 0, level = 1, spawnT = 1500, spawnEvery = 2100, last = performance.now(), target = null, paused = false;
      const drawLives = () => { lv.innerHTML = [0, 1, 2].map(i => `<span class="${i < lives ? '' : 'lost'}">${I('heart', 26)}</span>`).join(''); };
      drawLives();
      root.querySelector('[data-quit]').onclick = () => end();
      function spawn() {
        const it = U().pick(cfg.pool);
        const el = document.createElement('div'); el.className = 'rain-item jp'; el.textContent = it.k;
        const w = area.clientWidth; el.style.left = (12 + Math.random() * Math.max(10, w - 90)) + 'px';
        area.appendChild(el);
        items.push({ it, el, y: -60, v: 26 + level * 7 + Math.random() * 14 });
      }
      const removeItem = o => { const i = items.indexOf(o); if (i >= 0) items.splice(i, 1); if (target === o) target = null; };
      function miss(o) {
        removeItem(o); o.el.classList.add('splat'); o.el.insertAdjacentHTML('beforeend', `<span class="boom-r">${o.it.r}</span>`); setTimeout(() => o.el.remove(), 600);
        lives--; SJ.store.rec(o.it.k, false); SJ.audio.sfx('bad');
        area.classList.remove('shake'); void area.offsetWidth; area.classList.add('shake');
        drawLives(); if (lives <= 0) end();
      }
      function hit(o) {
        removeItem(o); o.el.classList.add('boom'); o.el.insertAdjacentHTML('beforeend', `<span class="boom-r">${o.it.r}</span>`); setTimeout(() => o.el.remove(), 500);
        score++; sc.textContent = score; SJ.store.rec(o.it.k, true); SJ.audio.sfx('pop');
        if (score % 10 === 0) { level++; lvl.textContent = level; U().toast(`${I('rocket', 22)} Lên cấp ${level}! Chữ rơi nhanh hơn rồi nè`); SJ.audio.sfx('combo'); }
      }
      function loop(t) {
        if (!alive) return;
        const dt = Math.min(60, t - last) / 1000; last = t;
        if (!paused) {
          spawnT += dt * 1000;
          if (spawnT >= spawnEvery) { spawnT = 0; spawn(); spawnEvery = Math.max(750, spawnEvery - 28); }
          const H = area.clientHeight - 70;
          for (let i = items.length - 1; i >= 0; i--) {
            const o = items[i]; o.y += o.v * dt; o.el.style.transform = `translateY(${o.y}px)`;
            if (o.y > H) miss(o);
          }
          if (tap) updateTarget();
        }
        if (alive) raf = requestAnimationFrame(loop);
      }
      const alts = r => [r].concat(SJ.ROMAJI_ALT[r] || []);
      function updateTarget() {
        const low = items.slice().sort((a, b) => b.y - a.y)[0] || null;
        if (low === target) return;
        root.querySelectorAll('.rain-item.target').forEach(x => x.classList.remove('target'));
        target = low;
        if (!target) { op.innerHTML = '<div class="muted center grow">Chờ chữ rơi nhé…</div>'; return; }
        target.el.classList.add('target');
        const opts = U().shuffle([target.it].concat(distinctBy(cfg.pool.filter(o => o.k !== target.it.k), 3, o => o.r, [target.it.r])));
        op.innerHTML = opts.map(o => `<button class="opt" data-nosfx="1" data-r="${o.r}">${o.r}</button>`).join('');
      }
      if (tap) op.onclick = e => {
        const b = e.target.closest('.opt'); if (!b || !target) return;
        if (b.dataset.r === target.it.r) hit(target);
        else { b.classList.add('bad', 'shake'); SJ.audio.sfx('bad'); target.v += 12; }
      };
      if (inp) {
        const tryHit = (force) => {
          const v = inp.value.trim().toLowerCase(); if (!v) return;
          const exact = items.filter(o => alts(o.it.r).includes(v)).sort((a, b) => b.y - a.y);
          const longer = items.some(o => alts(o.it.r).some(a => a.length > v.length && a.startsWith(v)));
          if (exact.length && (!longer || force)) { hit(exact[0]); inp.value = ''; return; }
          const prefix = items.some(o => alts(o.it.r).some(a => a.startsWith(v)));
          if (!prefix && v.length >= 2) { inp.classList.add('err'); SJ.audio.sfx('bad'); setTimeout(() => { inp.classList.remove('err'); inp.value = ''; }, 260); }
          else SJ.audio.sfx('tick');
        };
        inp.oninput = () => tryHit(false);
        inp.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tryHit(true); } };
        setTimeout(() => inp.focus(), 50);
      }
      const setPause = v => { paused = v; pz.classList.toggle('hidden', !v); last = performance.now(); };
      pz.onclick = () => setPause(false);
      onVis = () => { if (document.hidden && alive) setPause(true); };
      document.addEventListener('visibilitychange', onVis);
      function end() {
        if (!alive) return; alive = false; cancelAnimationFrame(raf);
        document.removeEventListener('visibilitychange', onVis);
        const isNew = SJ.store.setBest('rain', score);
        result(root, g, { title: lives <= 0 ? 'Ối, hết tim rồi!' : 'Dừng cuộc chơi', score, best: SJ.store.get().games.rain, isNew, xp: Math.min(40, score * 2), mood: score >= 30 ? 'love' : score >= 12 ? 'happy' : 'wink', stats: [[level, 'cấp đạt được']], again: () => start(cfg) });
      }
      raf = requestAnimationFrame(loop);
    }
    setup(root, g, { modes: coarse ? [['tap', 'Chạm chọn'], ['type', 'Gõ phím']] : [['type', 'Gõ phím'], ['tap', 'Bấm chọn']], bestText: () => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games.rain || 0}</b> chữ` }, start);
    return { destroy() { alive = false; cancelAnimationFrame(raf); onVis && document.removeEventListener('visibilitychange', onVis); } };
  }

  // ================= 3. LẬT THẺ =================
  function memory(root) {
    const g = G('memory'); let timer = null;
    const key = m => 'memory_' + m;
    function start(cfg) {
      const P = 8; let pairs;
      if (cfg.mode === 'hk') pairs = U().sample(SJ.KANA.hira.basic.filter(o => o.r !== 'wo'), P).map(o => [{ t: o.k, jp: 1 }, { t: SJ.toKata(o.k), jp: 1 }, o.k]);
      else if (cfg.mode === 'we') pairs = U().sample(SJ.VOCAB_ALL.filter(o => Array.from(o.jp).length <= 5), P).map(o => [{ t: o.jp, jp: 1, sm: 1 }, { pic: o.e }, o.jp]);
      else pairs = distinctBy(cfg.pool, P, o => o.r).map(o => [{ t: o.k, jp: 1 }, { t: o.r, ro: 1 }, o.k]);
      const cards = U().shuffle(pairs.flatMap((p, i) => [{ pid: i, f: p[0], say: p[2] }, { pid: i, f: p[1], say: p[2] }]));
      let open = [], matched = 0, moves = 0, secs = 0, started = false, lock = false;
      root.innerHTML = `<div class="container-sm game">${top(`<div class="g-score">${I('refresh', 20)} <b data-mv>0</b> lượt · ${I('alarm', 20)} <b data-tm>0</b>s</div>`)}
        <div class="mem-grid">${cards.map((c, i) => `<button class="mem-card" data-nosfx="1" data-i="${i}"><span class="mem-inner"><span class="mem-back">${I('sakura', 34)}</span><span class="mem-front ${c.f.jp ? 'jp' : ''} ${c.f.sm ? 'sm' : ''}">${c.f.pic ? I(c.f.pic, 56) : esc(c.f.t)}</span></span></button>`).join('')}</div></div>`;
      const mv = root.querySelector('[data-mv]'), tm = root.querySelector('[data-tm]');
      root.querySelector('[data-quit]').onclick = () => { clearInterval(timer); location.hash = '#/games'; };
      root.querySelector('.mem-grid').onclick = e => {
        const b = e.target.closest('.mem-card'); if (!b || lock || b.classList.contains('flip')) return;
        if (!started) { started = true; timer = setInterval(() => { secs++; tm.textContent = secs; }, 1000); }
        b.classList.add('flip'); SJ.audio.sfx('flip'); open.push(b);
        if (open.length === 2) {
          moves++; mv.textContent = moves;
          const [a, c] = open.map(x => cards[+x.dataset.i]);
          if (a.pid === c.pid) {
            open.forEach(x => x.classList.add('matched')); open = []; matched++;
            SJ.audio.sfx('note', matched + 2); setTimeout(() => SJ.audio.speak(a.say), 250);
            if (matched === P) setTimeout(win, 700);
          } else {
            lock = true;
            setTimeout(() => { open.forEach(x => x.classList.remove('flip')); open = []; lock = false; }, 850);
          }
        }
      };
      function win() {
        clearInterval(timer);
        const stars = moves <= 12 ? 3 : moves <= 17 ? 2 : 1;
        const isNew = SJ.store.setBest(key(cfg.mode), moves, true);
        result(root, g, { title: 'Tìm đủ cặp rồi!', score: moves, unit: ' lượt', best: SJ.store.get().games[key(cfg.mode)], isNew, xp: 8 + stars * 4, mood: stars === 3 ? 'love' : 'happy', stats: [[U().stars(stars, 3, 20), 'đánh giá'], [secs + 's', 'thời gian']], again: () => start(cfg) });
      }
    }
    setup(root, g, { modes: [['kr', 'Chữ ↔ Cách đọc'], ['hk', 'Hiragana ↔ Katakana'], ['we', 'Từ vựng ↔ Hình vẽ']], note: 'Bộ chữ chỉ áp dụng cho chế độ "Chữ ↔ Cách đọc".', bestText: m => { const b = SJ.store.get().games[key(m || 'kr')]; return b ? `${I('trophy', 24)} Ít lượt nhất: <b>${b}</b>` : `${I('trophy', 24)} Chưa có kỷ lục — chơi thử nào!`; } }, start);
    return { destroy() { clearInterval(timer); } };
  }

  // ================= 4. NGHE CHỌN CHỮ =================
  function listen(root) {
    const g = G('listen'); let tmo = null;
    function start(cfg) {
      const word = cfg.mode === 'word';
      const pool = word ? SJ.VOCAB_ALL : cfg.pool;
      const N = 10; let round = 0, score = 0, streak = 0, best = 0, cur = null, lock = false;
      root.innerHTML = `<div class="container-sm game">${top(`<div class="dots" data-dots>${'<i></i>'.repeat(N)}</div><div class="g-score">${I('star', 22)} <b data-sc>0</b></div>`)}
        <div class="listen-stage"><button class="listen-btn huge" data-play data-nosfx="1">${I('speaker', 76)}</button><div class="muted">Bấm loa để nghe lại · <button class="link-btn" data-slow>${I('slow', 22)} nghe chậm</button></div></div>
        <div class="quiz-opts four" data-op></div></div>`;
      const op = root.querySelector('[data-op]'), sc = root.querySelector('[data-sc]'), dots = root.querySelectorAll('[data-dots] i');
      const say = (rate) => { const t = word ? cur.jp : cur.k; SJ.audio.speak(t, rate ? { rate } : null); const b = root.querySelector('[data-play]'); b.classList.remove('speaking'); void b.offsetWidth; b.classList.add('speaking'); };
      root.querySelector('[data-play]').onclick = () => say();
      root.querySelector('[data-slow]').onclick = () => say(0.5);
      root.querySelector('[data-quit]').onclick = () => location.hash = '#/games';
      function q() {
        if (round >= N) return end();
        cur = U().pick(pool.filter(o => o !== cur)); lock = false;
        const f = word ? (o => o.vi) : (o => o.r);
        const opts = U().shuffle([cur].concat(distinctBy(pool.filter(o => o !== cur), 3, f, [f(cur)])));
        op.innerHTML = opts.map((o, i) => `<button class="opt" data-nosfx="1" data-i="${pool.indexOf(o)}"><kbd>${i + 1}</kbd>${word ? `<span class="opt-pic">${I(o.e, 34)}</span>${esc(o.vi)}` : `<span class="jp opt-jp">${o.k}</span>`}</button>`).join('');
        setTimeout(() => say(), 250);
      }
      op.onclick = e => { const b = e.target.closest('.opt'); if (b && !lock) answer(b); };
      function answer(b) {
        lock = true;
        const ok = pool[+b.dataset.i] === cur;
        op.querySelectorAll('.opt').forEach(x => { if (pool[+x.dataset.i] === cur) x.classList.add('ok'); });
        if (!ok) b.classList.add('bad', 'shake');
        dots[round].className = ok ? 'ok' : 'bad';
        SJ.store.rec(word ? cur.key : cur.k, ok);
        if (ok) { score++; streak++; best = Math.max(best, streak); SJ.audio.sfx(streak % 3 === 0 ? 'combo' : 'ok'); } else { streak = 0; SJ.audio.sfx('bad'); }
        sc.textContent = score; round++;
        tmo = setTimeout(q, ok ? 850 : 1500);
      }
      function end() {
        const id = 'listen_' + (word ? 'word' : 'kana');
        const isNew = SJ.store.setBest(id, score);
        result(root, g, { title: score >= 9 ? 'Tai thính quá trời!' : 'Xong rồi!', score, unit: '/10', best: SJ.store.get().games[id], isNew, xp: score * 2, mood: score >= 9 ? 'love' : score >= 6 ? 'happy' : 'wink', stats: [[best, 'đúng liên tiếp']], again: () => start(cfg) });
      }
      keyFn = e => { if (/^[1-4]$/.test(e.key) && !lock) { const b = op.querySelectorAll('.opt')[+e.key - 1]; b && answer(b); } if (e.key === ' ') { e.preventDefault(); say(); } };
      q();
    }
    setup(root, g, { modes: [['kana', 'Nghe chữ cái'], ['word', 'Nghe từ vựng']], note: `${I('speaker', 20)} Nhớ bật loa nha! Nếu không nghe thấy gì, hãy mở bằng Chrome hoặc Edge.`, bestText: m => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games['listen_' + (m || 'kana')] || 0}</b>/10` }, start);
    return { destroy() { clearTimeout(tmo); keyFn = null; } };
  }

  // ================= 5. GHÉP TỪ =================
  function builder(root) {
    const g = G('builder'); let tmo = null;
    const okWord = w => !/\s/.test(w.jp) && Array.from(w.jp).length >= 2 && Array.from(w.jp).length <= 6 && Array.from(w.jp).every(c => SJ.KANA_MAP[c] || /[ゃゅょっャュョッーァィゥェォ]/.test(c));
    function start(cfg) {
      const pool = SJ.VOCAB_ALL.filter(okWord);
      const words = cfg.mode === 'kata' ? pool.filter(w => /[ァ-ン]/.test(w.jp)) : cfg.mode === 'hira' ? pool.filter(w => !/[ァ-ン]/.test(w.jp)) : pool;
      const list = U().sample(words, 8);
      let round = 0, score = 0, perfect = 0;
      root.innerHTML = `<div class="container-sm game">${top(`<div class="dots" data-dots>${'<i></i>'.repeat(list.length)}</div><div class="g-score">${I('star', 22)} <b data-sc>0</b></div>`)}<div data-stage></div></div>`;
      const stage = root.querySelector('[data-stage]'), sc = root.querySelector('[data-sc]'), dots = root.querySelectorAll('[data-dots] i');
      root.querySelector('[data-quit]').onclick = () => location.hash = '#/games';
      function play() {
        if (round >= list.length) return end();
        const w = list[round]; const chars = Array.from(w.jp);
        const script = /[ァ-ン]/.test(w.jp) ? 'kata' : 'hira';
        const extra = distinctBy(SJ.KANA[script].basic.filter(o => !chars.includes(o.k)), 3, o => o.k).map(o => o.k);
        const tiles = U().shuffle(chars.concat(extra)).map(c => ({ c, used: false }));
        const slots = chars.map(() => null);
        let hints = 0, mistakes = 0, done = false;
        stage.innerHTML = `<div class="builder pop-in"><div class="b-pic paper bounce-in">${I(w.e, 110, 'pic')}</div><div class="b-mean">${esc(w.vi)}</div>
          <div class="b-hint" data-hint>&nbsp;</div>
          <div class="builder-slots">${slots.map((_, i) => `<button class="slot jp" data-nosfx="1" data-s="${i}"></button>`).join('')}</div>
          <div class="tiles">${tiles.map((t, i) => `<button class="tile jp" data-nosfx="1" data-t="${i}">${t.c}</button>`).join('')}</div>
          <div class="row center-row gap-s"><button class="btn btn-sm btn-paper" data-a="hint">${I('bulb', 20)} Gợi ý</button><button class="btn btn-sm btn-ghost" data-a="skip">Bỏ qua ${I('arrow_r', 18)}</button></div></div>`;
        const sEls = stage.querySelectorAll('.slot'), tEls = stage.querySelectorAll('.tile');
        const paint = () => {
          sEls.forEach((s, i) => { s.textContent = slots[i] == null ? '' : tiles[slots[i]].c; s.classList.toggle('filled', slots[i] != null); });
          tEls.forEach((t, i) => t.classList.toggle('used', tiles[i].used));
        };
        stage.onclick = e => {
          if (done) return;
          const t = e.target.closest('.tile'), s = e.target.closest('.slot'), a = e.target.closest('[data-a]');
          if (t) { const i = +t.dataset.t; if (tiles[i].used) return; const free = slots.indexOf(null); if (free < 0) return; slots[free] = i; tiles[i].used = true; SJ.audio.sfx('note', free); paint(); if (slots.indexOf(null) < 0) check(); }
          if (s) { const i = +s.dataset.s; if (slots[i] == null) return; tiles[slots[i]].used = false; slots[i] = null; SJ.audio.sfx('pop'); paint(); }
          if (a && a.dataset.a === 'hint') { hints++; stage.querySelector('[data-hint]').textContent = w.r; SJ.audio.speak(w.jp); }
          if (a && a.dataset.a === 'skip') { done = true; sEls.forEach((s2, i) => { s2.textContent = chars[i]; s2.classList.add('reveal'); }); dots[round].className = 'bad'; SJ.audio.speak(w.jp); SJ.store.rec(w.key, false); round++; tmo = setTimeout(play, 1600); }
        };
        function check() {
          const got = slots.map(i => tiles[i].c).join('');
          if (got === w.jp) {
            done = true; const pts = Math.max(3, 10 - hints * 3 - mistakes * 2); score += pts; sc.textContent = score;
            if (!hints && !mistakes) perfect++;
            sEls.forEach(x => x.classList.add('ok')); dots[round].className = 'ok'; SJ.audio.sfx('ok'); setTimeout(() => SJ.audio.speak(w.jp), 300); SJ.store.rec(w.key, true);
            stage.querySelector('[data-hint]').innerHTML = `<b>${esc(w.r)}</b> · +${pts}`;
            round++; tmo = setTimeout(play, 1500);
          } else {
            mistakes++; SJ.audio.sfx('bad');
            const box = stage.querySelector('.builder-slots'); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
            setTimeout(() => { slots.forEach((v, i) => { if (v != null) tiles[v].used = false; slots[i] = null; }); paint(); }, 500);
          }
        }
      }
      function end() {
        const isNew = SJ.store.setBest('builder', score);
        result(root, g, { title: 'Ghép xong hết rồi!', score, best: SJ.store.get().games.builder, isNew, xp: Math.round(score / 3), mood: perfect >= 6 ? 'love' : 'happy', stats: [[perfect, 'từ hoàn hảo']], again: () => start(cfg) });
      }
      play();
    }
    setup(root, g, { sets: false, modes: [['all', 'Trộn tất cả'], ['hira', 'Chỉ Hiragana'], ['kata', 'Chỉ Katakana']], bestText: () => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games.builder || 0}</b> điểm` }, start);
    return { destroy() { clearTimeout(tmo); } };
  }

  // ================= 6. ĐÚNG HAY SAI =================
  function tf(root) {
    const g = G('tf'); let timer = null;
    function start(cfg) {
      const pool = cfg.pool; let time = 30, score = 0, correct = 0, wrong = 0, cur = null, truth = true, lock = false, over = false;
      root.innerHTML = `<div class="container-sm game">${top(`<div class="timer-bar"><div class="timer-fill"></div></div><div class="g-score">${I('star', 22)} <b data-sc>0</b></div>`)}
        <div class="tf-card paper" data-card></div>
        <div class="tf-btns"><button class="btn btn-lg btn-green" data-nosfx="1" data-v="1">${I('maru', 30)} Đúng</button><button class="btn btn-lg btn-red" data-nosfx="1" data-v="0">${I('batsu', 30)} Sai</button></div>
        <div class="muted center small">Phím tắt: ← Đúng · → Sai</div></div>`;
      const card = root.querySelector('[data-card]'), sc = root.querySelector('[data-sc]'), fillEl = root.querySelector('.timer-fill');
      root.querySelector('[data-quit]').onclick = () => end();
      function q() {
        if (over) return;
        cur = U().pick(pool.filter(o => o !== cur)); truth = Math.random() < 0.5;
        const shown = truth ? cur.r : (distinctBy(pool, 1, o => o.r, [cur.r])[0] || cur).r;
        if (shown === cur.r) truth = true;
        card.className = 'tf-card paper pop-in'; card.innerHTML = `<span class="jp tf-k">${cur.k}</span><span class="tf-eq">=</span><span class="tf-r">${shown}</span><span class="tf-q">?</span>`;
        lock = false;
      }
      function answer(v) {
        if (lock || over) return; lock = true;
        const ok = v === truth; SJ.store.rec(cur.k, ok);
        if (ok) { score++; correct++; SJ.audio.sfx('ok'); card.classList.add('flash-ok'); }
        else { wrong++; time = Math.max(0, time - 2); SJ.audio.sfx('bad'); card.classList.add('flash-bad', 'shake'); card.querySelector('.tf-q').textContent = `→ ${cur.r}`; }
        sc.textContent = score; setTimeout(q, ok ? 220 : 800);
      }
      root.querySelector('.tf-btns').onclick = e => { const b = e.target.closest('[data-v]'); if (b) answer(b.dataset.v === '1'); };
      keyFn = e => { if (e.key === 'ArrowLeft' || e.key === 'o') answer(true); if (e.key === 'ArrowRight' || e.key === 'x') answer(false); };
      let last = Date.now();
      timer = setInterval(() => { const n = Date.now(); time -= (n - last) / 1000; last = n; fillEl.style.width = U().clamp(time / 30 * 100, 0, 100) + '%'; fillEl.classList.toggle('low', time < 6); if (time <= 0) end(); }, 100);
      function end() {
        if (over) return; over = true; clearInterval(timer);
        const isNew = SJ.store.setBest('tf', score);
        result(root, g, { score, best: SJ.store.get().games.tf, isNew, xp: Math.min(40, score), mood: score >= 25 ? 'love' : score >= 12 ? 'happy' : 'wink', stats: [[correct, 'đúng'], [wrong, 'sai']], again: () => start(cfg) });
      }
      q();
    }
    setup(root, g, { bestText: () => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games.tf || 0}</b> điểm` }, start);
    return { destroy() { clearInterval(timer); keyFn = null; } };
  }

  const RUN = { quiz, rain, memory, listen, builder, tf };
  SJ.games = {
    list: GAMES,
    run(id, root) { const f = RUN[id]; if (!f) { location.hash = '#/games'; return null; } return f(root); },
    bestLabel(id) {
      const gs = SJ.store.get().games;
      if (id === 'memory') { const v = ['kr', 'hk', 'we'].map(m => gs['memory_' + m]).filter(x => x != null); return v.length ? `Ít nhất ${Math.min(...v)} lượt` : ''; }
      if (id === 'listen') { const v = Math.max(gs.listen_kana || 0, gs.listen_word || 0); return v ? `Kỷ lục ${v}/10` : ''; }
      return gs[id] ? `Kỷ lục ${gs[id]}` : '';
    },
  };
})(window.SJ);
