/* SubelJapan — 9 trò chơi: Thử thách 60s, Mưa chữ, Lật thẻ, Nghe chọn chữ, Ghép từ, Đúng hay Sai,
 * Câu cá chữ, Mochi đập chữ, Bóng bay あいうえお.
 * Mỗi trò: màn chuẩn bị setup() → chơi → màn kết quả result() (XP, cá vàng, kỷ lục trong SJ.store.get().games).
 * 3 trò mới (câu cá, đập chữ, bóng bay) dùng chung bộ HUD .g3 + túi dọn dẹp bag() (hẹn giờ, rAF, sự kiện)
 * và cảnh vẽ tay bằng SVG; giao diện nằm trong css/games2.css.
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const INK = 'var(--ink-ic,#3d3142)';

  // ---------- Icon tự vẽ cho 3 trò mới (cùng nét bút với js/icons.js, khung 48×48) ----------
  if (SJ.addIcons) {
    const tube = (d, col, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 4.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const star = (cx, cy, r) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * q).toFixed(1) + ' ' + (cy + Math.sin(a) * q).toFixed(1); } return d + 'Z'; };
    const bal = (K, cx, cy, col) => K.P(`M${cx} ${cy - 10} C${cx + 6.5} ${cy - 10} ${cx + 8.5} ${cy - 4.5} ${cx + 8.5} ${cy} C${cx + 8.5} ${cy + 6} ${cx + 4} ${cy + 10} ${cx} ${cy + 11} C${cx - 4} ${cy + 10} ${cx - 8.5} ${cy + 6} ${cx - 8.5} ${cy} C${cx - 8.5} ${cy - 4.5} ${cx - 6.5} ${cy - 10} ${cx} ${cy - 10} Z`, col)
      + K.P(`M${cx - 2} ${cy + 13} L${cx} ${cy + 11} L${cx + 2} ${cy + 13} Z`, col) + K.H(`M${cx - 5} ${cy - 2} q.6 -4.5 4.2 -5.6`);
    SJ.addIcons({
      // cần câu kéo lên một chú cá nhỏ
      fish_rod: K => tube('M3 42.5 q4.5 -3.5 9 0 t9 0 t9 0 t9 0 t9 0', K.C.blue, 3)
        + tube('M6.5 41 Q12 14 40 6', K.C.brn, 3) + K.O(10.4, 31.2, 3.3, K.C.yel)
        + `<path d="M40 6 V17.5" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`
        + K.G('translate(34.2 25.9) rotate(-55)', K.P('M-7 0 L-14.5 -6.5 Q-12 0 -14.5 6.5 Z', K.C.rose) + K.P('M-8.5 0 C-8.5 -5.5 -2 -7.2 3 -7.2 C8 -7.2 10.2 -3.6 10.2 0 C10.2 3.6 8 7.2 3 7.2 C-2 7.2 -8.5 5.5 -8.5 0 Z', K.C.pink) + K.P('M1.2 -5.8 q-2.8 5.8 0 11.6') + K.D(5.4, -2.4, 1.4) + K.D(4.8, 3.2, 1.5, K.C.rose, .7))
        + K.D(21.5, 35.5, 1.5, K.C.dblue) + K.D(33, 39, 1.3, K.C.dblue) + K.D(43.5, 33.5, 1.4, K.C.dblue),
      // búa đồ chơi "piko piko" + bánh mochi chóng mặt trồi khỏi hang
      piko_hammer: K => K.E(15, 41.5, 12.5, 4.2, '#8a5a40')
        + K.P('M6 41.5 V33 q0 -10.5 9 -10.5 q9 0 9 10.5 V41.5 Z', K.C.pink) + K.P('M15 22.7 q-2.5 -4 -7 -3.2 q1.6 4.4 7 3.2 Z', K.C.grn)
        + K.P('M10.4 29.6 l3 2 l-3 2 M19.6 29.6 l-3 2 l3 2') + K.D(9.6, 35.4, 1.6, K.C.rose, .8) + K.D(20.4, 35.4, 1.6, K.C.rose, .8)
        + K.P('M2.6 41.5 q12.4 7.4 24.8 0', 'none')
        + tube('M33.5 22 L44 42', K.C.yel, 3.4)
        + K.G('rotate(-28 30 15)', K.R(16, 7.5, 28, 15, 6, K.C.rose) + `<path d="M23 7.6 V22.4 M37 7.6 V22.4" stroke="#fff" stroke-width="3"/>` + K.R(16, 7.5, 28, 15, 6))
        + K.P(star(6, 13, 4.2), K.C.yel) + K.P(star(26.5, 30.5, 2.8), K.C.yel),
      // ba quả bóng bay buộc chung, quả giữa mang chữ あ
      balloon_trio: K => K.P('M13 31.5 Q18.5 38 24 43.5 M24 26.5 V43.5 M35 31.5 Q29.5 38 24 43.5', 'none')
        + bal(K, 13, 19, K.C.pink) + bal(K, 35, 19, K.C.blue) + bal(K, 24, 14, K.C.yel)
        + K.T(24, 17.6, 'あ', 9.5, INK, 1) + K.D(24, 43.6, 1.8, K.C.rose),
    });
  }

  const GAMES = [
    { id: 'quiz', icon: 'bolt', name: 'Thử thách 60 giây', desc: 'Chọn đáp án đúng nhanh nhất có thể. Đúng liên tục để nhân combo!', color: '#f9b8c6' },
    { id: 'rain', icon: 'rain', name: 'Mưa chữ', desc: 'Chữ rơi từ trên mây — gõ hoặc chạm cách đọc để "bắn" trước khi chạm đất!', color: '#a9d0ec' },
    { id: 'memory', icon: 'cards', name: 'Lật thẻ trí nhớ', desc: 'Lật thẻ tìm cặp giống nhau. Ít lượt nhất là giỏi nhất!', color: '#cfbcee' },
    { id: 'listen', icon: 'headphones', name: 'Nghe chọn chữ', desc: 'Mochi đọc, bạn chọn đúng chữ. Luyện tai siêu tốc!', color: '#b3d394' },
    { id: 'builder', icon: 'puzzle', name: 'Ghép từ', desc: 'Nhìn hình vẽ, xếp các chữ cái thành từ đúng.', color: '#f8d77c' },
    { id: 'tf', icon: 'maru', name: 'Đúng hay Sai', desc: '30 giây phán đoán thần tốc: đúng (○) hay sai (×)?', color: '#ffc9a8' },
    { id: 'fish', icon: 'fish_rod', name: 'Câu cá chữ', desc: 'Cá bơi tung tăng, mỗi chú mang một chữ. Chạm đúng chú cá có chữ được gọi để câu lên nhé!', color: '#9fd9e6' },
    { id: 'whack', icon: 'piko_hammer', name: 'Mochi đập chữ', desc: 'Bánh mochi trồi lên khỏi hang — chỉ đập bánh mang đúng chữ, né bánh sai nha!', color: '#c6e6a2' },
    { id: 'balloon', icon: 'balloon_trio', name: 'Bóng bay あいうえお', desc: 'Bóng bay mang chữ của một hàng bay lên. Bấm nổ theo thứ tự a・i・u・e・o để thuộc lòng bảng chữ!', color: '#f6c3dc' },
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
    if (r.score > 0) SJ.store.bonusAct('game', g.id);
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
        const now = Date.now(); if (document.hidden) { last = now; return; } time -= (now - last) / 1000; last = now;
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
    const g = G('memory'); let timer = null, winT = null;
    const key = m => 'memory_' + m;
    function start(cfg) {
      const P = 8; let pairs;
      if (cfg.mode === 'hk') pairs = U().sample(SJ.KANA.hira.basic.filter(o => o.r !== 'wo'), P).map(o => [{ t: o.k, jp: 1 }, { t: SJ.toKata(o.k), jp: 1 }, o.k]);
      else if (cfg.mode === 'we') pairs = distinctBy(SJ.VOCAB_ALL.filter(o => Array.from(o.jp).length <= 5), P, o => o.e).map(o => [{ t: o.jp, jp: 1, sm: 1 }, { pic: o.e }, o.jp]);
      else pairs = distinctBy(cfg.pool, P, o => o.r).map(o => [{ t: o.k, jp: 1 }, { t: o.r, ro: 1 }, o.k]);
      const cards = U().shuffle(pairs.flatMap((p, i) => [{ pid: i, f: p[0], say: p[2] }, { pid: i, f: p[1], say: p[2] }]));
      let open = [], matched = 0, moves = 0, secs = 0, started = false, lock = false;
      root.innerHTML = `<div class="container-sm game">${top(`<div class="g-score">${I('refresh', 20)} <b data-mv>0</b> lượt · ${I('alarm', 20)} <b data-tm>0</b>s</div>`)}
        <div class="mem-grid">${cards.map((c, i) => `<button class="mem-card" data-nosfx="1" data-i="${i}"><span class="mem-inner"><span class="mem-back">${I('sakura', 34)}</span><span class="mem-front ${c.f.jp ? 'jp' : ''} ${c.f.sm ? 'sm' : ''}">${c.f.pic ? I(c.f.pic, 56) : esc(c.f.t)}</span></span></button>`).join('')}</div></div>`;
      const mv = root.querySelector('[data-mv]'), tm = root.querySelector('[data-tm]');
      root.querySelector('[data-quit]').onclick = () => { clearInterval(timer); clearTimeout(winT); location.hash = '#/games'; };
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
            if (matched === pairs.length) winT = setTimeout(win, 700);
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
    return { destroy() { clearInterval(timer); clearTimeout(winT); } };
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
        tmo = setTimeout(() => say(), 250);
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
            setTimeout(() => { if (done) return; slots.forEach((v, i) => { if (v != null) tiles[v].used = false; slots[i] = null; }); paint(); }, 500);
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
      timer = setInterval(() => { const n = Date.now(); if (document.hidden) { last = n; return; } time -= (n - last) / 1000; last = n; fillEl.style.width = U().clamp(time / 30 * 100, 0, 100) + '%'; fillEl.classList.toggle('low', time < 6); if (time <= 0) end(); }, 100);
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

  // ================= DÙNG CHUNG CHO 3 TRÒ MỚI =================
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = () => document.documentElement.dataset.motion === 'reduce';
  const isCoarse = () => !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  const inOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const multOf = c => c >= 8 ? 3 : c >= 4 ? 2 : 1;
  const SPARK = ['#ffd85e', '#ff8fae', '#a3d5ff', '#a6df88', '#cdb9ff'];

  /** Túi dọn dẹp: mọi hẹn giờ, vòng rAF, sự kiện, ResizeObserver đều gom vào đây → clear() một phát là sạch */
  function bag() {
    const ts = new Set(), offs = []; let raf = 0;
    const B = {
      t(fn, ms) { const id = setTimeout(() => { ts.delete(id); fn(); }, ms); ts.add(id); return id; },
      ct(id) { if (id) { clearTimeout(id); ts.delete(id); } },
      on(el, ev, fn, o) { el.addEventListener(ev, fn, o); offs.push(() => el.removeEventListener(ev, fn, o)); },
      loop(fn) {
        let last = performance.now();
        const step = now => { raf = requestAnimationFrame(step); const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now; fn(dt); };
        raf = requestAnimationFrame(step);
      },
      watch(el, fn) {
        if (window.ResizeObserver) { const ro = new ResizeObserver(() => fn()); ro.observe(el); offs.push(() => ro.disconnect()); }
        else B.on(window, 'resize', fn);
      },
      clear() { ts.forEach(clearTimeout); ts.clear(); offs.splice(0).forEach(f => f()); cancelAnimationFrame(raf); raf = 0; },
    };
    return B;
  }
  // thanh trên: thoát · đồng hồ · điểm (+ hệ số combo)
  const hud = secs => `<div class="game-top g3-top"><button class="icon-btn" data-quit aria-label="Thoát">${I('batsu', 20)}</button>
    <div class="g3-timer" aria-label="Thời gian còn lại">${I('alarm', 30)}<div class="timer-bar"><div class="timer-fill"></div></div><b data-tm>${secs}</b></div>
    <div class="g3-score">${I('star', 24)}<b data-sc>0</b><span class="g3-mult" data-mult></span></div></div>`;
  function g3clock(root, total, onEnd) {
    const box = root.querySelector('.g3-timer'), fill = box.querySelector('.timer-fill'), num = box.querySelector('[data-tm]');
    let left = total, shown = total;
    const paint = () => {
      const s = Math.ceil(left), low = left < 10;
      fill.style.width = U().clamp(left / total * 100, 0, 100) + '%';
      fill.classList.toggle('low', low); box.classList.toggle('low', low);
      if (s !== shown) { shown = s; num.textContent = s; if (low && s > 0) SJ.audio.sfx('tick'); }
    };
    return {
      tick(dt) { if (left <= 0) return; left = Math.max(0, left - dt); paint(); if (left <= 0) onEnd(); },
      add(s) {
        left = Math.max(0, left + s); paint();
        box.classList.remove('plus', 'minus'); void box.offsetWidth; box.classList.add(s > 0 ? 'plus' : 'minus');
        // viên "+3 giây / −2 giây" bật ra ngay cạnh đồng hồ (tự gỡ khi hết hoạt ảnh)
        const d = document.createElement('span');
        d.className = 'g3-tdelta ' + (s > 0 ? 'plus' : 'minus'); d.textContent = (s > 0 ? '+' : '−') + Math.abs(s) + ' giây';
        d.addEventListener('animationend', () => d.remove()); box.appendChild(d);
        if (left <= 0) onEnd();
      },
    };
  }
  function g3score(root) {
    const box = root.querySelector('.g3-score'), b = box.querySelector('[data-sc]'), mu = box.querySelector('[data-mult]');
    let lastM = 1;
    return {
      set(v) { b.textContent = v; box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump'); },
      mult(m) { if (m === lastM) return; lastM = m; mu.textContent = m > 1 ? '×' + m : ''; mu.classList.toggle('on', m > 1); },
    };
  }
  // chữ "+2" bay lên, pháo hoa nhỏ, lớp tạm dừng
  function g3float(B, host, x, y, html, cls) {
    const el = document.createElement('div');
    el.className = 'g3-float ' + (cls || ''); el.innerHTML = html;
    el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px';
    host.appendChild(el); B.t(() => el.remove(), /big/.test(cls || '') ? 1700 : 1100);
  }
  function g3burst(B, host, x, y, cols, n) {
    n = n || 9;
    const el = document.createElement('div'), a0 = Math.random() * 40;
    el.className = 'g3-burst'; el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px';
    el.innerHTML = Array.from({ length: n }, (_, i) => `<i style="--a:${(a0 + i * 360 / n).toFixed(1)}deg;--d:${Math.round(rnd(30, 54))}px;--c:${cols[i % cols.length]}"></i>`).join('');
    host.appendChild(el); B.t(() => el.remove(), 800);
  }
  function g3pause(B, scene, onSet) {
    const pz = document.createElement('button');
    pz.type = 'button'; pz.className = 'g3-pause hidden'; pz.dataset.nosfx = '1';
    pz.innerHTML = `${U().mascot('sleep', 86)}<b>Tạm dừng một chút</b><small>Chạm vào đây để chơi tiếp nha</small>`;
    scene.appendChild(pz);
    const set = v => { pz.classList.toggle('hidden', !v); onSet(v); };
    pz.addEventListener('click', () => set(false));
    B.on(document, 'visibilitychange', () => { if (document.hidden) set(true); });
    return set;
  }
  // chữ nhiễu: ưu tiên chữ dễ nhầm với đáp án, không trùng cách đọc, hạn chế trùng chữ đang hiện
  function decoy(pool, target, busy) {
    const ok = o => o.r !== target.r && !busy.has(o.r);
    const conf = SJ.confusables ? SJ.confusables(target.k).list.map(k => SJ.KANA_MAP[k]).filter(o => o && pool.includes(o) && ok(o)) : [];
    if (conf.length && Math.random() < .4) return U().pick(conf);
    const c = pool.filter(ok);
    return U().pick(c.length ? c : pool.filter(o => o.r !== target.r));
  }
  const CLOUD = cls => `<svg class="${cls}" viewBox="0 0 120 56" aria-hidden="true"><path class="k" d="M24 50 C12 50 6 43 8 35 C10 28 17 24 25 26 C27 14 39 8 51 11 C58 3 75 3 82 13 C94 11 106 19 104 30 C114 32 116 46 106 50 Z" fill="#fff"/><path d="M28 41 C38 45 52 45 62 41" fill="none" stroke="#e3eefb" stroke-width="3.2" stroke-linecap="round"/></svg>`;

  // ================= 7. CÂU CÁ CHỮ =================
  const FCOL = [['#ffc4d4', '#ff9fbb'], ['#ffcbad', '#ff9f73'], ['#ffe08a', '#ffc23e'], ['#c7f1dd', '#86d9b2'], ['#ddd0ff', '#b9a3ff'], ['#ffb4a2', '#ff8a70']];
  const FISH_SVG = `<svg class="fp-svg" viewBox="0 0 120 72" aria-hidden="true">
    <g class="fp-tail"><path class="k" d="M37 36 C27 27 17 18 7 16 C11 28 11 44 7 56 C17 54 27 45 37 36 Z" fill="var(--fd)"/></g>
    <path class="k" d="M54 16 C58 6 72 2 86 11 C76 12 64 14 54 16 Z" fill="var(--fd)"/>
    <path class="k" d="M30 37 C30 21 52 10 78 10 C102 10 116 23 116 37 C116 51 102 62 78 62 C52 62 30 53 30 37 Z" fill="var(--fc)"/>
    <path d="M42 22 C50 16 59 13.5 68 13" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".8"/>
    <path class="k" d="M76 52 C79 60 89 63 96 57 C90 53.5 83 52 76 52 Z" fill="var(--fd)"/>
    <circle cx="99" cy="31" r="4.6" fill="${INK}"/><circle cx="100.8" cy="29.3" r="1.7" fill="#fff"/>
    <ellipse cx="99" cy="43" rx="5" ry="3" fill="#ff8fae" opacity=".6"/>
    <path class="k" d="M108.5 41.5 q3.2 2.6 6.4 0" fill="none" style="stroke-width:2.2"/></svg>`;
  function fpDecor() {
    let wave = 'M0 12'; for (let i = 0; i < 32; i++) wave += i ? ' t50 0' : ' q25 -9 50 0';
    const bub = [[7, 9, 7.5, 0], [21, 6, 9, -3], [46, 11, 8, -5.2], [61, 7, 10, -1.4], [79, 10, 7.2, -4], [93, 6, 9.5, -6.5]]
      .map(([l, s, d, dl]) => `<i class="fp-bub" style="--l:${l}%;--s:${s}px;--d:${d}s;--dl:${dl}s"></i>`).join('');
    const peb = [[3, 18, '#e4dcef', 5], [10, 12, '#ffd9c7', 3], [36, 15, '#d9ecf6', 4], [50, 10, '#f3e3c3', 9], [69, 20, '#e8e1d6', 4], [78, 11, '#ffd0dc', 10], [91, 16, '#dcefd4', 5]]
      .map(([l, w, c, b]) => `<i class="fp-peb" style="--l:${l}%;--w:${w}px;--c:${c};--b:${b}px"></i>`).join('');
    const weed = (l, dl) => `<svg class="fp-weed" style="--l:${l}%;animation-delay:${dl}s" viewBox="0 0 40 80" aria-hidden="true"><path class="k" d="M13 80 C7 62 17 46 9 26 C17 34 23 52 21 80 Z" fill="#86d593"/><path class="k" d="M19 80 C21 56 31 42 29 12 C36 32 35 58 28 80 Z" fill="#62bf68"/><path class="k" d="M24 80 C28 68 35 62 37 50 C40 62 36 72 31 80 Z" fill="#a6df88"/></svg>`;
    const pad = (l, w, dl, flower) => `<svg class="ic fp-lily" style="--l:${l}%;--w:${w}px;animation-delay:${dl}s" viewBox="0 0 64 30" aria-hidden="true"><path class="k" d="M32 8 C50 8 62 12.5 62 18 C62 24 50 28 32 28 C14 28 2 24 2 18 C2 12.5 12 9 25 8 L31 18 Z" fill="#9ad983"/><path d="M31 18 L12 14 M31 18 L14 24 M31 18 L50 24.5 M31 18 L53 13" stroke="#76c264" stroke-width="1.6" stroke-linecap="round" fill="none"/>${flower ? `<g transform="translate(26 -8) scale(.5)">${SJ.drawSakura(1.1, '#ffc4d4')}</g>` : ''}</svg>`;
    return `<div class="fp-sky">${CLOUD('fp-cloud c1')}${CLOUD('fp-cloud c2')}
        <svg class="fp-hills" viewBox="0 0 400 30" preserveAspectRatio="none" aria-hidden="true"><path class="k ns" d="M0 30 V17 C30 8 60 6 96 13 C130 20 160 9 200 7 C240 5 270 15 310 13 C350 11 380 6 400 9 V30 Z" fill="#e6def8"/><path class="k ns" d="M0 30 V23 C50 16 110 15 170 21 C230 27 300 16 400 20 V30 Z" fill="#d2efc6"/></svg></div>
      <div class="fp-water"><span class="fp-rays"></span>
        <svg class="fp-wave" viewBox="0 0 1600 24" aria-hidden="true"><path class="wf" d="${wave} V24 H0 Z"/><path class="ws" d="${wave}"/></svg>
        ${bub}${weed(4, 0)}${weed(56, -1.6)}${weed(88, -.8)}
        <svg class="fp-sand" viewBox="0 0 400 42" preserveAspectRatio="none" aria-hidden="true"><path class="k ns" d="M0 16 C40 8 80 8 120 13 C170 20 220 6 280 11 C330 16 370 9 400 13 V42 H0 Z" fill="#f7e3b6"/></svg>${peb}</div>
      <i class="fp-rip" style="--l:60%;--dl:0s"></i><i class="fp-rip" style="--l:86%;--dl:-2.1s"></i>
      ${pad(64, 62, 0, 1)}${pad(82, 42, -2.2, 0)}
      <svg class="ic fp-bank" viewBox="0 0 156 46" aria-hidden="true"><path class="k" d="M-4 12 C20 3 62 0 98 7 C122 12 140 22 152 38 L156 46 H-4 Z" fill="#a6df88"/>
        <path d="M6 24 C34 17 76 16 118 23" fill="none" stroke="#8fd17a" stroke-width="6" stroke-linecap="round" opacity=".85"/>
        <path class="k" d="M118 15 l2.5 -7.5 l2.5 7 M128 20 l4 -6.5 l.6 7.5" fill="none"/><g transform="translate(90 -3) scale(.36)">${SJ.drawSakura(1.2)}</g></svg>`;
  }
  function fish(root) {
    const g = G('fish'), B = bag();
    function start(cfg) {
      B.clear(); keyFn = null;
      const flip = cfg.mode === 'r2k', pool = cfg.pool, TOTAL = 60, RM = reduced(), LANES = 4;
      let score = 0, combo = 0, maxCombo = 0, caught = 0, over = false, paused = false, elapsed = 0, spawnCd = 1.2;
      let target = null, W = 0, H = 0, SURF = 108, FW = 124, FH = 74, base = 58, hooks = 0, moodT = 0;
      const tip = { x: 160, y: 18 }, laneDir = [], laneV = [], fishes = [];
      const d0 = Math.random() < .5 ? 1 : -1;
      for (let l = 0; l < LANES; l++) { laneDir.push(l % 2 ? -d0 : d0); laneV.push(rnd(.85, 1.15)); }
      root.innerHTML = `<div class="container-sm game g3 g3-fish">${hud(TOTAL)}
        <div class="g3-scene fp-scene" data-scene>${fpDecor()}
          <div class="fp-mochi" data-mochi>${U().mascot('happy', 66)}</div>
          <button class="fp-ask" type="button" data-ask data-nosfx="1"></button>
          <div class="fp-fishes" data-fishes></div>
          <svg class="fp-lines" aria-hidden="true"><path class="fp-rod o1"/><path class="fp-rod o2"/><circle class="k fp-reel" r="4.2" fill="#ffd85e"/><path class="fp-idle"/>
            <g class="fp-bobber"><g class="fpb-in"><path class="k" d="M0 -6 V-11" fill="none"/><circle class="k" r="6" fill="#fff"/><path class="k" d="M-6 0 A6 6 0 0 1 6 0 Z" fill="#ff6b6b"/></g></g><g data-hooks></g></svg>
        </div>
        <p class="g3-tip">${I('bulb', 20)} Chạm vào chú cá mang đúng chữ. Chọn nhầm bị trừ 2 giây đó!</p></div>`;
      const scene = root.querySelector('[data-scene]'), host = root.querySelector('[data-fishes]'), ask = root.querySelector('[data-ask]'), mochi = root.querySelector('[data-mochi]');
      const lines = root.querySelector('.fp-lines'), rods = lines.querySelectorAll('.fp-rod'), reelC = lines.querySelector('.fp-reel'), idle = lines.querySelector('.fp-idle'), bob = lines.querySelector('.fp-bobber'), hooksG = lines.querySelector('[data-hooks]');
      const clk = g3clock(root, TOTAL, end), S = g3score(root);
      g3pause(B, scene, v => { paused = v; });
      root.querySelector('[data-quit]').onclick = () => end();

      const laneY = l => { const a = SURF + 30 + FH / 2, b = H - 46 - FH / 2; return a + (b - a) * l / (LANES - 1); };
      function measure() {
        W = scene.clientWidth; H = scene.clientHeight; if (!W) return;
        const small = W < 520;
        FW = small ? 100 : 124; FH = Math.round(FW * .6); SURF = small ? 100 : 108; base = small ? 44 : 58;
        scene.style.setProperty('--surf', SURF + 'px'); scene.style.setProperty('--fw', FW + 'px'); scene.style.setProperty('--rise', (H - SURF - 70) + 'px');
        tip.x = Math.round(U().clamp(W * .42, 132, 250)); tip.y = 18;
        lines.setAttribute('viewBox', `0 0 ${W} ${H}`);
        const gx = 54, gy = SURF - 30, cx = Math.round(gx + (tip.x - gx) * .4), cy = tip.y + 4;
        rods.forEach(p => p.setAttribute('d', `M${gx} ${gy} Q${cx} ${cy} ${tip.x} ${tip.y}`));
        const t = .17, rx = (1 - t) * (1 - t) * gx + 2 * t * (1 - t) * cx + t * t * tip.x, ry = (1 - t) * (1 - t) * gy + 2 * t * (1 - t) * cy + t * t * tip.y;
        reelC.setAttribute('cx', rx.toFixed(1)); reelC.setAttribute('cy', ry.toFixed(1));
        idle.setAttribute('d', `M${tip.x} ${tip.y} L${tip.x} ${SURF - 13}`);
        bob.setAttribute('transform', `translate(${tip.x} ${SURF - 3})`);
        ask.style.maxWidth = Math.max(120, W - tip.x - 28) + 'px';
      }
      const place = f => { f.el.style.transform = `translate3d(${f.x.toFixed(1)}px,${(f.y - FH / 2).toFixed(1)}px,0) rotate(${f.rot.toFixed(2)}deg) scale(${f.s.toFixed(3)})`; };
      const onScreen = () => new Set(fishes.filter(f => f.st === 'swim').map(f => f.it.r));
      // tối đa 2 chú cá cùng mang chữ đáp án, còn lại là chữ nhiễu
      const chooseItem = () => Math.random() < .25 && fishes.filter(f => f.st === 'swim' && f.it.r === target.r).length < 2 ? target : decoy(pool, target, onScreen());
      function addFish(it, lane, x, fresh) {
        const c = U().pick(FCOL), dir = laneDir[lane], el = document.createElement('button');
        el.type = 'button'; el.className = 'fp-fish ' + (dir > 0 ? 'r' : 'l') + (fresh ? ' new' : ''); el.dataset.nosfx = '1';
        el.setAttribute('aria-label', 'Cá mang chữ ' + (flip ? it.r : it.k));
        el.style.setProperty('--fc', c[0]); el.style.setProperty('--fd', c[1]);
        if (fresh) el.style.setProperty('--dl', (lane * .07 + Math.random() * .1).toFixed(2) + 's');
        el.innerHTML = `<span class="fp-in"><span class="fp-flip">${FISH_SVG}</span><span class="fp-tag ${flip ? 'ro' : 'jp'}">${esc(flip ? it.r : it.k)}</span></span>`;
        host.appendChild(el);
        const f = { el, it, lane, dir, x, y: laneY(lane), ph: Math.random() * 6.28, st: 'swim', t: 0, rot: 0, s: 1 };
        fishes.push(f); place(f); return f;
      }
      // làn trống: con cá gần mép vào nhất đã bơi đủ xa
      const laneFree = l => fishes.every(f => f.lane !== l || f.st === 'hook' || f.st === 'gone' || (laneDir[l] > 0 ? f.x + FW : W - f.x) > FW * 1.7);
      function spawn(forceT) {
        const free = []; for (let l = 0; l < LANES; l++) if (laneFree(l)) free.push(l);
        if (!free.length) return false;
        const cnt = l => fishes.filter(f => f.lane === l && f.st === 'swim').length;
        const l = free.sort((a, b) => cnt(a) - cnt(b) || Math.random() - .5)[0];
        addFish(forceT ? target : chooseItem(), l, laneDir[l] > 0 ? -FW : W, false);
        return true;
      }
      function populate() {
        const per = W >= 560 ? 2 : 1, slotW = W / per, tl = Math.floor(Math.random() * LANES), tk = Math.floor(Math.random() * per);
        for (let l = 0; l < LANES; l++) for (let k = 0; k < per; k++)
          addFish(l === tl && k === tk ? target : decoy(pool, target, onScreen()), l, slotW * k + rnd(.05, .95) * Math.max(0, slotW - FW), true);
      }
      function setTarget(it) {
        target = it;
        if (flip) delete ask.dataset.say; else ask.dataset.say = it.k;
        ask.innerHTML = `<small>${flip ? 'Chữ này đọc là gì?' : `Câu chú cá có chữ ${SJ.glyph('speaker', 14)}`}</small><b class="${flip ? 'jp' : ''}">${esc(flip ? it.k : it.r)}</b>`;
        ask.setAttribute('aria-label', flip ? 'Tìm cách đọc của chữ ' + it.k : 'Câu cá có chữ đọc là ' + it.r + ', bấm để nghe');
        ask.classList.remove('new'); void ask.offsetWidth; ask.classList.add('new');
      }
      function cheer(m) {
        mochi.innerHTML = U().mascot(m, 66);
        mochi.classList.remove('hop'); void mochi.offsetWidth; mochi.classList.add('hop');
        B.ct(moodT); moodT = B.t(() => { mochi.innerHTML = U().mascot('happy', 66); }, 1000);
      }
      function splash(x, y) {
        const el = document.createElement('div');
        el.className = 'fp-splash'; el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px';
        el.innerHTML = [0, 55, 115, 180, 245, 305].map(a => `<i style="--a:${Math.round(a - 15 + Math.random() * 30)}deg"></i>`).join('');
        scene.appendChild(el); B.t(() => el.remove(), 700);
      }
      // vị trí miệng cá (để buộc dây câu), tính cả góc xoay và độ thu nhỏ
      const mouth = f => {
        const ox = f.dir * FW * .45, oy = FH * .076, a = f.rot * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
        return { x: f.x + FW / 2 + (ox * c - oy * s) * f.s, y: f.y + (ox * s + oy * c) * f.s };
      };
      function hook(f) {
        f.st = 'hook'; f.t = 0; f.x0 = f.x; f.y0 = f.y; f.r0 = f.rot;
        f.el.classList.add('hooked'); f.el.disabled = true;
        f.line = document.createElementNS(NS, 'path'); f.line.setAttribute('class', 'fp-line'); hooksG.appendChild(f.line);
        hooks++; lines.classList.add('busy'); SJ.audio.sfx('flip');
      }
      function reel(f, dt) {
        f.t += dt;
        const T1 = .15, T2 = .62; let end;
        if (f.t < T1) { const m = mouth(f), p = smooth(f.t / T1); end = { x: lerp(tip.x, m.x, p), y: lerp(tip.y, m.y, p) }; }
        else {
          const p = Math.min(1, (f.t - T1) / T2), e = inOut(p);
          f.s = lerp(1, .62, e);
          f.rot = lerp(f.r0, -90 * f.dir, e) + (RM ? 0 : Math.sin(f.t * 34) * 11 * (1 - e * .6));
          f.x = lerp(f.x0, tip.x - f.dir * FH * .076 * f.s - FW / 2, e);
          f.y = lerp(f.y0, tip.y + FW * .45 * f.s, e);
          end = mouth(f);
          if (p >= 1) return land(f);
        }
        place(f);
        const mx = (tip.x + end.x) / 2, my = (tip.y + end.y) / 2 + 12;
        f.line.setAttribute('d', `M${tip.x} ${tip.y} Q${mx.toFixed(1)} ${my.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`);
      }
      function land(f) {
        f.st = 'gone'; f.line.remove(); f.el.classList.add('got');
        g3burst(B, scene, tip.x, tip.y + 34, SPARK, 10);
        SJ.audio.sfx('pop'); B.t(() => SJ.audio.speak(f.it.k), 120);
        B.t(() => { f.el.remove(); const i = fishes.indexOf(f); if (i >= 0) fishes.splice(i, 1); }, 340);
        hooks = Math.max(0, hooks - 1); if (!hooks) lines.classList.remove('busy');
      }
      function nextTarget() {
        const old = target;
        const vis = fishes.filter(x => x.st === 'swim' && x.it.r !== old.r && x.x > 0 && x.x < W - FW * 1.4);
        setTarget(vis.length && Math.random() < .6 ? U().pick(vis).it : U().pick(pool.filter(o => o.r !== old.r)));
        // các bạn cá cùng chữ cũ giật mình bơi đi, để không bị tính nhầm
        fishes.forEach(x => { if (x.st === 'swim' && x.it.r === old.r) { x.st = 'flee'; x.el.classList.add('flee', 'calm'); x.el.disabled = true; } });
      }
      function choose(f) {
        const cx = f.x + FW / 2;
        if (f.it.r === target.r) {
          combo++; maxCombo = Math.max(maxCombo, combo); caught++;
          const m = multOf(combo); score += m; S.set(score); S.mult(m);
          SJ.store.rec(flip ? target.k : f.it.k, true);
          SJ.audio.sfx(combo % 5 === 0 ? 'combo' : 'ok');
          g3float(B, scene, cx, f.y - FH * .75, `+${m}${combo >= 2 ? `<small>Combo ${combo}</small>` : ''}`);
          hook(f); cheer('love'); nextTarget();
        } else {
          combo = 0; S.mult(1);
          SJ.store.rec(target.k, false); SJ.audio.sfx('bad');
          splash(cx, f.y);
          f.st = 'flee'; f.el.classList.add('flee'); f.el.disabled = true;
          f.el.insertAdjacentHTML('beforeend', `<span class="g3-say"><span class="jp">${esc(f.it.k)}</span> = ${esc(f.it.r)}</span>`);
          fishes.forEach(x => { if (x.st === 'swim' && x.it.r === target.r) { x.el.classList.add('hint'); B.t(() => x.el.classList.remove('hint'), 1600); } });
          cheer('wow'); clk.add(-2);
        }
      }
      const tapFish = e => {
        if (over || paused) return;
        const b = e.target.closest('.fp-fish'); if (!b) return;
        const f = fishes.find(x => x.el === b); if (f && f.st === 'swim') choose(f);
      };
      host.addEventListener('pointerdown', e => { if (e.button > 0) return; tapFish(e); });
      host.addEventListener('click', e => { if (e.detail === 0) tapFish(e); }); // Enter / Space trên bàn phím

      function frame(dt) {
        if (paused || over) return;
        elapsed += dt; clk.tick(dt); if (over) return;
        const sp = base * (1 + elapsed / TOTAL * .6) * (RM ? .75 : 1);
        const swim = fishes.filter(f => f.st === 'swim');
        const hasT = swim.some(f => f.it.r === target.r && (f.dir > 0 ? f.x < W - FW * .7 : f.x > -FW * .3));
        spawnCd -= dt;
        if (!hasT) { if (spawn(true)) spawnCd = rnd(.5, 1); }
        else if (spawnCd <= 0 && swim.length < (W >= 560 ? 7 : 4) && spawn(false)) spawnCd = rnd(.6, 1.4);
        for (let i = fishes.length - 1; i >= 0; i--) {
          const f = fishes[i];
          if (f.st === 'gone') continue;
          if (f.st === 'hook') { reel(f, dt); continue; }
          f.x += f.dir * sp * laneV[f.lane] * (f.st === 'flee' ? 3.2 : 1) * dt;
          f.ph += dt * 2.4;
          f.y = laneY(f.lane) + (RM ? 0 : Math.sin(f.ph) * 4);
          f.rot = RM ? 0 : Math.cos(f.ph) * 3 * f.dir;
          place(f);
          if ((f.dir > 0 && f.x > W + 6) || (f.dir < 0 && f.x < -FW - 6)) { f.el.remove(); fishes.splice(i, 1); }
        }
      }
      function end() {
        if (over) return; over = true; B.clear();
        const isNew = SJ.store.setBest('fish', score);
        result(root, g, { title: score >= 30 ? 'Cần thủ nhí siêu đẳng!' : 'Hết giờ câu rồi!', score, best: SJ.store.get().games.fish, isNew, xp: Math.min(50, score + Math.floor(maxCombo / 2)), mood: score >= 30 ? 'love' : score >= 14 ? 'happy' : 'wink', stats: [[caught, 'chú cá câu được'], [maxCombo, 'combo cao nhất']], again: () => start(cfg) });
      }
      measure(); B.watch(scene, measure);
      setTarget(U().pick(pool)); populate();
      B.loop(frame);
    }
    setup(root, g, { modes: [['k2r', 'Nhìn romaji, câu chữ'], ['r2k', 'Nhìn chữ, câu romaji']], bestText: () => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games.fish || 0}</b> điểm` }, start);
    return { destroy() { B.clear(); keyFn = null; } };
  }

  // ================= 8. MOCHI ĐẬP CHỮ =================
  const MCOL = [['#ffd3df', '#ffb3c7'], ['#d7f0c2', '#b6e29c'], ['#fff3dc', '#f2d9ab'], ['#e5dbff', '#cbb9ff'], ['#ffe0c2', '#ffc48e']];
  const MOLE_SVG = `<svg class="wk-svg" viewBox="0 0 100 100" aria-hidden="true">
    <path class="k" d="M10 112 V60 C10 30 28 13 50 13 C72 13 90 30 90 60 V112 Z" fill="var(--mc)"/>
    <path d="M10.6 86 C30 95 70 95 89.4 86 V112 H10.6 Z" fill="var(--md)" opacity=".75"/>
    <path d="M22 56 C22 39 31 27.5 43 23.5" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <path class="k" d="M50 15 C47 5 36 1 27 5 C30 13 41 17 50 15 Z" fill="#9ad67f"/><path d="M48 13.6 C42 9 35.5 6.5 29.5 6.2" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
    <ellipse cx="26" cy="40" rx="6" ry="3.6" fill="#ff8fae" opacity=".55"/><ellipse cx="74" cy="40" rx="6" ry="3.6" fill="#ff8fae" opacity=".55"/>
    <g class="e-n"><circle cx="37" cy="32" r="4.6" fill="${INK}"/><circle cx="38.8" cy="30.2" r="1.7" fill="#fff"/><circle cx="63" cy="32" r="4.6" fill="${INK}"/><circle cx="64.8" cy="30.2" r="1.7" fill="#fff"/><path class="k" d="M45 38.5 q5 4.5 10 0" fill="none"/></g>
    <g class="e-x"><path class="k" d="M32 27 l9 5 l-9 5 M68 27 l-9 5 l9 5" fill="none"/><ellipse class="k" cx="50" cy="41" rx="4" ry="4.2" fill="#ff8fae"/></g>
    <g class="e-w"><path class="k" d="M32 33 q5 -5.5 10 0" fill="none"/><circle cx="63" cy="32" r="4.6" fill="${INK}"/><circle cx="64.8" cy="30.2" r="1.7" fill="#fff"/><path class="k" d="M43 38.5 q7 4 14 0" fill="none"/><path class="k" d="M47.5 40 q2.5 6.5 5 0" fill="#ff8fae"/></g></svg>`;
  const MALLET_SVG = `<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M30 44 L73 49" stroke="${INK}" stroke-width="11.5" stroke-linecap="round"/><path d="M30 44 L73 49" stroke="#ffd36b" stroke-width="6.5" stroke-linecap="round"/><path d="M61 47.6 L73 49" stroke="#ff8fae" stroke-width="6.5" stroke-linecap="round"/>
    <rect class="k" x="5" y="18" width="27" height="50" rx="10" fill="#ff8fae"/><rect x="6.3" y="29" width="24.4" height="6" fill="#fff"/><rect x="6.3" y="51" width="24.4" height="6" fill="#fff"/><rect class="k" x="5" y="18" width="27" height="50" rx="10" fill="none"/>
    <path d="M11 22.5 V26 M11 38 V47" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".75"/></svg>`;
  function wkDecor() {
    const fl = (l, t, s, c, r) => `<svg class="ic wk-fl" style="left:${l}%;top:${t}%;width:${s}px;height:${s}px;transform:rotate(${r}deg)" viewBox="0 0 48 48">${SJ.drawSakura(1.25, c)}</svg>`;
    const tuft = (l, t, s) => `<svg class="wk-tuft" style="left:${l}%;top:${t}%;width:${s}px" viewBox="0 0 30 16"><path class="k" d="M3 16 C4 10 6 6 9 3 C9 8 10 12 11 16 M11 16 C12 9 15 4 19 1 C18 7 18 12 18 16 M18 16 C20 11 23 8 28 6 C25 10 24 13 24 16" fill="none"/></svg>`;
    const petal = (l, d, dl) => `<i class="wk-petal" style="--l:${l}%;--d:${d}s;--dl:${dl}s"></i>`;
    return `<div class="wk-deco" aria-hidden="true">${fl(1.5, 2, 22, '#ffc4d4', 10)}${fl(94, 31, 17, '#fff', -8)}${fl(2.5, 66, 16, '#ffe08a', 20)}${fl(93, 90, 20, '#ffc4d4', 0)}${tuft(30, .5, 26)}${tuft(63, 96.5, 24)}${tuft(.5, 42, 20)}${tuft(95.5, 60, 20)}${petal(14, 11, 0)}${petal(52, 13, -5)}${petal(80, 10, -8)}</div>`;
  }
  const wkCell = (i, fine) => `<button class="wk-cell" type="button" data-i="${i}" data-nosfx="1" aria-label="Hang số ${i + 1}">
    <svg class="wk-hole" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><ellipse class="k ns" cx="50" cy="15" rx="48" ry="13" fill="#e2b48a"/><ellipse cx="50" cy="16" rx="40" ry="9.5" fill="#6a4a3c"/><ellipse cx="50" cy="13.6" rx="31" ry="5" fill="#553a30"/></svg>
    <span class="wk-clip"><span class="wk-mole"><span class="wk-bod">${MOLE_SVG}<span class="wk-tag"></span></span></span></span><span class="wk-stars"><i></i><i></i><i></i></span>
    <svg class="wk-lip" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path class="k ns" d="M2 15 A48 13 0 0 0 98 15 L90 16 A40 9.5 0 0 1 10 16 Z" fill="#eec39a"/><path d="M14 22.5 Q50 31 86 22.5" fill="none" stroke="#f7dcc0" stroke-width="1.6" class="ns" stroke-linecap="round"/></svg>
    ${fine ? `<kbd>${i + 1}</kbd>` : ''}</button>`;
  function whack(root) {
    const g = G('whack'), B = bag();
    function start(cfg) {
      B.clear(); keyFn = null;
      const flip = cfg.mode === 'r2k', pool = cfg.pool, TOTAL = 45, RM = reduced(), fine = !isCoarse();
      let score = 0, combo = 0, maxCombo = 0, hits = 0, over = false, paused = false, elapsed = 0, spawnT = .8, sinceT = 0, tHits = 0, target = null, lvl = 0, MS = 92, moodT = 0, hideT = 0;
      const holes = Array.from({ length: 9 }, (_, i) => ({ i, st: 'down', it: null, t: 0, life: 1, cool: 0 }));
      root.innerHTML = `<div class="container-sm game g3 g3-whack">${hud(TOTAL)}
        <div class="wk-head"><div class="wk-mochi" data-mochi>${U().mascot('cheer', 80)}</div><button class="wk-ask" type="button" data-ask data-nosfx="1"></button></div>
        <div class="g3-scene wk-field ${fine ? 'fine' : ''}" data-scene>${wkDecor()}
          <div class="wk-grid" data-grid>${holes.map(h => wkCell(h.i, fine)).join('')}</div>
          <div class="wk-mallet" data-mallet><div class="wm-in">${MALLET_SVG}</div></div></div>
        <p class="g3-tip">${I('bulb', 20)} ${fine ? 'Bấm chuột hoặc phím 1–9 để đập.' : 'Chạm vào bánh mochi mang đúng chữ.'} Đập nhầm bị trừ 2 giây nha!</p></div>`;
      const field = root.querySelector('[data-scene]'), grid = root.querySelector('[data-grid]'), cells = Array.from(grid.children), ask = root.querySelector('[data-ask]'), mallet = root.querySelector('[data-mallet]'), mochi = root.querySelector('[data-mochi]');
      const clk = g3clock(root, TOTAL, end), S = g3score(root);
      g3pause(B, field, v => { paused = v; });
      root.querySelector('[data-quit]').onclick = () => end();

      const measure = () => { MS = field.clientWidth < 420 ? 76 : 108; mallet.style.width = mallet.style.height = MS + 'px'; };
      const aim = (x, y) => { const k = MS / 80; mallet.style.transform = `translate(${(x - 18.5 * k).toFixed(1)}px,${(y - 68 * k).toFixed(1)}px)`; };
      const cellPt = i => { const r = field.getBoundingClientRect(), c = cells[i].getBoundingClientRect(); return { x: c.left - r.left + c.width / 2, y: c.top - r.top + c.height * .52 }; };
      const swing = () => { mallet.classList.remove('swing'); void mallet.offsetWidth; mallet.classList.add('swing'); };
      const flashMallet = () => { mallet.classList.add('show'); B.ct(hideT); hideT = B.t(() => mallet.classList.remove('show'), 460); };
      if (fine) {
        B.on(field, 'pointermove', e => { if (e.pointerType !== 'mouse') return; const r = field.getBoundingClientRect(); aim(e.clientX - r.left, e.clientY - r.top); B.ct(hideT); mallet.classList.add('show'); });
        B.on(field, 'pointerleave', () => mallet.classList.remove('show'));
      }
      const pips = () => ask.querySelectorAll('.wk-pips i').forEach((p, i) => p.classList.toggle('on', i < tHits));
      function setTarget(it, first) {
        target = it; tHits = 0;
        if (flip) delete ask.dataset.say; else ask.dataset.say = it.k;
        ask.setAttribute('aria-label', flip ? 'Tìm cách đọc của chữ ' + it.k : 'Đập bánh có chữ đọc là ' + it.r + ', bấm để nghe');
        ask.innerHTML = `<span class="wa-t"><small>${flip ? 'Chữ này đọc là gì?' : 'Đập bánh có chữ'}</small><b class="${flip ? 'jp' : ''}">${esc(flip ? it.k : it.r)}</b></span>
          <span class="wa-side">${flip ? '' : SJ.glyph('speaker', 18)}<span class="wk-pips" aria-hidden="true"><i></i><i></i><i></i></span></span>`;
        ask.classList.remove('new'); void ask.offsetWidth; ask.classList.add('new');
        if (!first) { holes.forEach(h => { if (h.st === 'up') down(h); }); spawnT = .6; }
        if (!flip) B.t(() => SJ.audio.speak(it.k), first ? 650 : 260);
      }
      function cheer(m) {
        mochi.innerHTML = U().mascot(m, 80);
        mochi.classList.remove('hop'); void mochi.offsetWidth; mochi.classList.add('hop');
        B.ct(moodT); moodT = B.t(() => { mochi.innerHTML = U().mascot('cheer', 80); }, 1000);
      }
      function down(h) {
        if (h.st === 'down') return;
        h.st = 'down'; h.cool = .35;
        const c = cells[h.i]; c.classList.remove('up');
        B.t(() => { if (h.st !== 'down') return; c.classList.remove('hit', 'oops'); const s = c.querySelector('.g3-say'); if (s) s.remove(); }, 280);
      }
      function pop() {
        const free = holes.filter(h => h.st === 'down' && h.cool <= 0);
        if (!free.length) return;
        const h = U().pick(free), c = cells[h.i];
        const isT = sinceT >= 2 || Math.random() < .42;
        sinceT = isT ? 0 : sinceT + 1;
        h.it = isT ? target : decoy(pool, target, new Set(holes.filter(x => x.st === 'up').map(x => x.it.r)));
        const col = U().pick(MCOL), mole = c.querySelector('.wk-mole'), tag = c.querySelector('.wk-tag');
        mole.style.setProperty('--mc', col[0]); mole.style.setProperty('--md', col[1]);
        tag.textContent = flip ? h.it.r : h.it.k; tag.className = 'wk-tag ' + (flip ? 'ro' : 'jp');
        h.st = 'up'; h.t = 0; h.life = Math.max(.9, 1.8 - elapsed * .02) * (RM ? 1.2 : 1);
        c.classList.remove('hit', 'oops'); c.classList.add('up');
      }
      function bonk(i) {
        if (over || paused) return;
        const h = holes[i], c = cells[i];
        if (h.st !== 'up') { SJ.audio.sfx('tap'); c.classList.remove('dust'); void c.offsetWidth; c.classList.add('dust'); return; }
        const pt = cellPt(i);
        if (h.it.r === target.r) {
          h.st = 'hit'; c.classList.add('hit');
          combo++; maxCombo = Math.max(maxCombo, combo); hits++; tHits++;
          const m = multOf(combo); score += m; S.set(score); S.mult(m);
          SJ.store.rec(flip ? target.k : h.it.k, true);
          SJ.audio.sfx('pop'); SJ.audio.sfx(combo % 5 === 0 ? 'combo' : 'note', combo + 1);
          g3burst(B, field, pt.x, pt.y - 6, SPARK, 9);
          g3float(B, field, pt.x, pt.y - 34, `+${m}${combo >= 2 ? `<small>Combo ${combo}</small>` : ''}`);
          pips(); cheer('love');
          B.t(() => down(h), 430);
          if (tHits === 3) B.t(() => { if (!over) { setTarget(decoy(pool, target, new Set()), false); g3float(B, field, field.clientWidth / 2, 26, 'Đổi chữ mới nè!', 'gold'); } }, 560);
        } else {
          h.st = 'oops'; c.classList.add('oops');
          combo = 0; S.mult(1);
          SJ.store.rec(target.k, false); SJ.audio.sfx('bad');
          c.insertAdjacentHTML('beforeend', `<span class="g3-say"><span class="jp">${esc(h.it.k)}</span> = ${esc(h.it.r)}</span>`);
          cheer('wow'); clk.add(-2);
          B.t(() => down(h), 760);
        }
      }
      grid.addEventListener('pointerdown', e => {
        if (e.button > 0) return;
        const c = e.target.closest('.wk-cell'); if (!c) return;
        const r = field.getBoundingClientRect(); aim(e.clientX - r.left, e.clientY - r.top);
        if (e.pointerType !== 'mouse') flashMallet();
        swing(); bonk(+c.dataset.i);
      });
      const hitKey = i => { const p = cellPt(i); aim(p.x, p.y); flashMallet(); swing(); bonk(i); };
      grid.addEventListener('click', e => { if (e.detail !== 0) return; const c = e.target.closest('.wk-cell'); if (c) hitKey(+c.dataset.i); });
      keyFn = e => {
        if (over || paused || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
        const k = (e.key || '').toLowerCase(); let i = '123456789'.indexOf(k); if (i < 0) i = 'qweasdzxc'.indexOf(k);
        if (i < 0 || !k) return; e.preventDefault(); hitKey(i);
      };
      function frame(dt) {
        if (paused || over) return;
        elapsed += dt; clk.tick(dt); if (over) return;
        const L = Math.min(2, Math.floor(elapsed / 15));
        if (L > lvl) { lvl = L; SJ.audio.sfx('star'); g3float(B, field, field.clientWidth / 2, field.clientHeight / 2, `${I('rocket', 30)} Nhanh hơn rồi nè!`, 'gold big'); }
        spawnT -= dt;
        if (spawnT <= 0) {
          if (holes.filter(h => h.st === 'up').length < Math.min(4, 2 + lvl)) pop();
          spawnT = Math.max(.42, 1.05 - elapsed * .013) * rnd(.8, 1.2) * (RM ? 1.15 : 1);
        }
        holes.forEach(h => {
          if (h.st === 'up') { h.t += dt; if (h.t >= h.life) { if (h.it.r === target.r && combo) { combo = 0; S.mult(1); } down(h); } }
          else if (h.st === 'down' && h.cool > 0) h.cool -= dt;
        });
      }
      function end() {
        if (over) return; over = true; B.clear(); keyFn = null;
        const isNew = SJ.store.setBest('whack', score);
        result(root, g, { title: score >= 30 ? 'Tay búa thần sầu!' : 'Hết giờ rồi!', score, best: SJ.store.get().games.whack, isNew, xp: Math.min(45, score + Math.floor(maxCombo / 2)), mood: score >= 30 ? 'love' : score >= 14 ? 'happy' : 'wink', stats: [[hits, 'bánh đập trúng'], [maxCombo, 'combo cao nhất']], again: () => start(cfg) });
      }
      measure(); B.watch(field, measure);
      setTarget(U().pick(pool), true);
      B.loop(frame);
    }
    setup(root, g, { modes: [['k2r', 'Nhìn romaji, đập chữ'], ['r2k', 'Nhìn chữ, đập romaji']], note: isCoarse() ? '' : `${I('bulb', 20)} Có thể dùng phím 1–9 (hoặc Q W E / A S D / Z X C) cho 9 cái hang.`, bestText: () => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games.whack || 0}</b> điểm` }, start);
    return { destroy() { B.clear(); keyFn = null; } };
  }

  // ================= 9. BÓNG BAY あいうえお =================
  const BCOL = [['#ffc4d4', '#ff9fbb'], ['#ffe08a', '#ffc23e'], ['#c7f1dd', '#86d9b2'], ['#bfe0ff', '#8ec5f5'], ['#ddd0ff', '#b9a3ff'], ['#ffcbad', '#ff9f73']];
  const BALLOON_SVG = `<svg class="bl-svg" viewBox="0 0 80 140" aria-hidden="true"><g class="bl-body">
    <path class="k" d="M40 5 C61 5 74 22 74 43 C74 66 57 86 40 90 C23 86 6 66 6 43 C6 22 19 5 40 5 Z" fill="var(--bc)"/>
    <path d="M18 36 C19 25 26 16 36 13" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/><circle cx="17" cy="46" r="2.8" fill="#fff" opacity=".8"/>
    <path class="k" d="M34 96 L40 89 L46 96 Z" fill="var(--bd)"/></g>
    <path class="bl-str" d="M40 96 C32 106 48 114 40 124 C34 131 42 136 40 140" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const HILLS = `<svg class="bl-hills" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true"><path class="k ns" d="M0 44 C50 20 120 18 180 38 C240 16 320 10 400 34 V80 H0 Z" fill="#cdeebb"/><path class="k ns" d="M0 60 C70 38 160 42 230 58 C290 44 350 44 400 52 V80 H0 Z" fill="#a6df88"/></svg>`;
  /** Các hàng của bảng 50 âm (theo SJ.GOJUON) → [{ k, r, col }] theo thứ tự a i u e o */
  function balloonRows(mode) {
    const G0 = SJ.GOJUON, VOW = G0.cols;
    const src = mode === 'daku' ? G0.daku : G0.basic;
    const rows = src.map(([c, s]) => ({ c, ks: Array.from(s).map((k, j) => k === '_' ? null : { k, col: VOW[j] }).filter(Boolean) }));
    if (mode !== 'daku') { const n = rows.pop(); rows[rows.length - 1].ks.push({ k: n.ks[0].k, col: 'n' }); } // ん đi cùng hàng わ
    rows.forEach(r => r.ks.forEach(o => { if (mode === 'kata') o.k = SJ.toKata(o.k); o.r = (SJ.KANA_MAP[o.k] || {}).r || ''; }));
    return rows.filter(r => r.ks.length && r.ks.every(o => o.r));
  }
  function balloon(root) {
    const g = G('balloon'), B = bag();
    const key = m => 'balloon_' + (m || 'hira');
    function start(cfg) {
      B.clear(); keyFn = null;
      const rows = balloonRows(cfg.mode), queue = rows.slice(), TOTAL = 60, RM = reduced();
      let score = 0, rowsDone = 0, perfect = 0, over = false, paused = false, hold = true, row = null, next = 0, rowMiss = 0, slotMiss = 0, W = 0, H = 0, BW = 76, small = false, moodT = 0;
      const bls = [];
      root.innerHTML = `<div class="container-sm game g3 g3-balloon">${hud(TOTAL)}
        <div class="bl-row" data-row></div>
        <div class="g3-scene bl-sky" data-scene><span class="bl-sun">${I('sun', 66)}</span>${CLOUD('bl-cloud c1')}${CLOUD('bl-cloud c2')}${CLOUD('bl-cloud c3')}
          <div class="bl-layer" data-bls></div>${HILLS}
          ${[[6, 'tulip', 30], [23, 'sakura', 20], [44, 'tulip', 26], [62, 'sakura', 17]].map(([l, n, s]) => `<span class="bl-flw" style="left:${l}%">${I(n, s)}</span>`).join('')}
          <div class="bl-mochi" data-mochi>${U().mascot('cheer', 70)}</div></div>
        <p class="g3-tip">${I('bulb', 20)} Bấm nổ bóng theo thứ tự a → i → u → e → o. Xong một hàng được thưởng thêm giây!</p></div>`;
      const scene = root.querySelector('[data-scene]'), layer = root.querySelector('[data-bls]'), rowEl = root.querySelector('[data-row]'), wrap = root.querySelector('.g3-balloon'), mochi = root.querySelector('[data-mochi]');
      const clk = g3clock(root, TOTAL, end), S = g3score(root);
      g3pause(B, scene, v => { paused = v; });
      root.querySelector('[data-quit]').onclick = () => end();

      const BH = () => BW * 1.75;
      const measure = () => { W = scene.clientWidth; H = scene.clientHeight; small = W < 520; BW = small ? 58 : 76; scene.style.setProperty('--bw', BW + 'px'); };
      const hi = r => r.length > 1 ? `${esc(r.slice(0, -1))}<b>${esc(r.slice(-1))}</b>` : `<b>${esc(r)}</b>`;
      const slotEl = i => rowEl.querySelector(`[data-s="${i}"]`);
      function renderRow() {
        rowEl.style.setProperty('--n', row.ks.length);
        rowEl.innerHTML = `<div class="bl-rowname"><small>Hàng</small><b class="jp">${esc(row.ks[0].k)}</b><span>${rows.indexOf(row) + 1}/${rows.length}</span></div>
          <div class="bl-slots">${row.ks.map((o, i) => `<div class="bl-slot${i === 0 ? ' next' : ''}" data-s="${i}" style="--i:${i}"><span class="bl-sk jp"></span><small>${hi(o.r)}</small></div>`).join('')}</div>`;
        rowEl.classList.remove('done', 'new'); void rowEl.offsetWidth; rowEl.classList.add('new');
      }
      const laneX = b => (W / b.n) * (b.lane + .5) - BW / 2;
      const placeB = b => {
        const sway = RM ? 0 : Math.sin(b.ph) * Math.min(7, W / b.n * .09);
        b.x = laneX(b) + sway;
        b.el.style.transform = `translate3d(${b.x.toFixed(1)}px,${b.y.toFixed(1)}px,0) rotate(${RM ? 0 : (Math.cos(b.ph) * 3).toFixed(2)}deg)`;
      };
      function startRow() {
        row = queue.shift(); if (!queue.length) queue.push(...U().shuffle(rows)); // hết một vòng → trộn thứ tự hàng
        next = 0; rowMiss = 0; slotMiss = 0;
        renderRow();
        const n = row.ks.length, lanes = U().shuffle(Array.from({ length: n }, (_, i) => i)), cols = U().shuffle(BCOL), order = U().shuffle(Array.from({ length: n }, (_, i) => i));
        row.ks.forEach((o, idx) => {
          const el = document.createElement('button');
          el.type = 'button'; el.className = 'bl-b in'; el.dataset.nosfx = '1'; el.style.setProperty('--dl', (order[idx] * .09).toFixed(2) + 's');
          el.setAttribute('aria-label', 'Bóng bay chữ ' + o.k);
          el.style.setProperty('--bc', cols[idx][0]); el.style.setProperty('--bd', cols[idx][1]);
          el.innerHTML = `<span class="bl-in">${BALLOON_SVG}<span class="bl-k jp">${esc(o.k)}</span></span>`;
          layer.appendChild(el);
          // bóng phồng lên ngay trên trời ở các độ cao so le, rồi mới bay dần lên
          const y = n > 1 ? lerp(H * .36, H - BH() * .82, order[idx] / (n - 1)) : H * .5;
          const b = { el, o, idx, lane: lanes[idx], n, col: cols[idx][0], y: y + rnd(-10, 10), ph: rnd(0, 6.28), v: rnd(.9, 1.12), st: 'up', x: 0 };
          bls.push(b); placeB(b);
          B.t(() => el.classList.remove('in'), 1100);
        });
        hold = false;
      }
      function cheer(m) {
        mochi.innerHTML = U().mascot(m, 70);
        mochi.classList.remove('hop'); void mochi.offsetWidth; mochi.classList.add('hop');
        B.ct(moodT); moodT = B.t(() => { mochi.innerHTML = U().mascot('cheer', 70); }, 1100);
      }
      function markNext() {
        rowEl.querySelectorAll('.bl-slot').forEach((s, i) => s.classList.toggle('next', i === next));
        bls.forEach(b => b.el.classList.remove('hint'));
      }
      function fly(b, idx) {
        const slot = slotEl(idx); if (!slot) return;
        const wr = wrap.getBoundingClientRect(), br = b.el.querySelector('.bl-k').getBoundingClientRect(), sr = slot.querySelector('.bl-sk').getBoundingClientRect();
        const x0 = br.left + br.width / 2 - wr.left, y0 = br.top + br.height / 2 - wr.top, dx = sr.left + sr.width / 2 - wr.left - x0, dy = sr.top + sr.height / 2 - wr.top - y0;
        const el = document.createElement('div');
        el.className = 'bl-fly jp'; el.textContent = b.o.k; el.style.left = x0 + 'px'; el.style.top = y0 + 'px';
        wrap.appendChild(el); void el.offsetWidth;
        el.style.transform = `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px)) scale(.86)`;
        B.t(() => { el.remove(); slot.classList.add('on'); slot.querySelector('.bl-sk').textContent = b.o.k; }, 520);
      }
      function good(b) {
        b.st = 'pop'; score++; S.set(score); slotMiss = 0;
        SJ.store.rec(b.o.k, true);
        SJ.audio.sfx('pop'); SJ.audio.sfx('note', next + 2);
        g3burst(B, scene, b.x + BW / 2, b.y + BH() * .27, [b.col, '#ffffff', '#ffd85e', b.col], 12);
        b.el.classList.add('popped'); b.el.disabled = true;
        fly(b, next);
        B.t(() => { b.el.remove(); const i = bls.indexOf(b); if (i >= 0) bls.splice(i, 1); }, 760);
        next++; markNext();
        if (next >= row.ks.length) rowClear(); else SJ.audio.speak(b.o.k);
      }
      function bad(b) {
        rowMiss++; slotMiss++;
        SJ.store.rec(row.ks[next].k, false); SJ.audio.sfx('bad');
        b.el.classList.remove('no'); void b.el.offsetWidth; b.el.classList.add('no');
        let t = b.el.querySelector('.bl-say');
        if (!t) { t = document.createElement('span'); t.className = 'bl-say'; b.el.querySelector('.bl-in').appendChild(t); }
        t.textContent = b.o.r; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
        const s = slotEl(next); if (s) { s.classList.remove('shake'); void s.offsetWidth; s.classList.add('shake'); B.t(() => s.classList.remove('shake'), 450); }
        if (slotMiss >= 2) { const r = bls.find(x => x.st === 'up' && x.idx === next); if (r) r.el.classList.add('hint'); }
        cheer('wow'); clk.add(-2);
      }
      function rowClear() {
        hold = true; rowsDone++;
        const isPerfect = rowMiss === 0, bonus = rowsDone <= 5 ? 3 : 2; // thưởng giây giảm dần để ván nào cũng có hồi kết
        if (isPerfect) { perfect++; score += 3; }
        B.t(() => {
          if (isPerfect) S.set(score);
          rowEl.classList.add('done'); SJ.audio.sfx('level'); cheer('love');
          SJ.audio.speak(row.ks.map(o => o.k).join(''));
          clk.add(bonus);
          const bn = document.createElement('div');
          bn.className = 'bl-banner';
          bn.innerHTML = `<div><small>${isPerfect ? `${I('sparkle', 20)} Hoàn hảo! +3 điểm` : 'Giỏi quá!'}</small><b class="jp">${row.ks.map(o => esc(o.k)).join('')}</b><span>+${bonus} giây</span></div>`;
          scene.appendChild(bn); B.t(() => bn.remove(), 1400);
        }, 560);
        B.t(() => { if (!over) startRow(); }, 2100);
      }
      const tapB = e => {
        if (over || paused || hold) return;
        const el = e.target.closest('.bl-b'); if (!el) return;
        const b = bls.find(x => x.el === el); if (!b || b.st !== 'up') return;
        if (b.idx === next) good(b); else bad(b);
      };
      layer.addEventListener('pointerdown', e => { if (e.button > 0) return; tapB(e); });
      layer.addEventListener('click', e => { if (e.detail === 0) tapB(e); });
      function frame(dt) {
        if (paused || over) return;
        if (!hold) { clk.tick(dt); if (over) return; }
        const sp = (small ? 30 : 38) * Math.min(1.7, 1 + rowsDone * .08) * (RM ? .7 : 1);
        bls.forEach(b => {
          if (b.st !== 'up') return;
          b.y -= sp * b.v * dt; b.ph += dt * 1.6;
          if (b.y < -BH()) b.y = H + rnd(4, 40); // bay khuất lên trời → quay lại từ sau đồi
          placeB(b);
        });
      }
      function end() {
        if (over) return; over = true; B.clear();
        const id = key(cfg.mode), isNew = SJ.store.setBest(id, score);
        result(root, g, { title: rowsDone >= 6 ? 'Thuộc bảng chữ vèo vèo!' : 'Hết giờ rồi!', score, best: SJ.store.get().games[id], isNew, xp: Math.min(50, score + rowsDone * 2), mood: rowsDone >= 6 ? 'love' : rowsDone >= 3 ? 'happy' : 'wink', stats: [[rowsDone, 'hàng hoàn thành'], [perfect, 'hàng hoàn hảo']], again: () => start(cfg) });
      }
      measure(); B.watch(scene, measure);
      startRow();
      B.loop(frame);
    }
    setup(root, g, { sets: false, modes: [['hira', 'Hiragana'], ['kata', 'Katakana'], ['daku', 'Âm đục が・ぱ']], note: 'Mỗi hàng đi theo thứ tự a → i → u → e → o (ví dụ か き く け こ). Bấm nổ bóng đúng thứ tự để điền vào ô nhé!', bestText: m => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games[key(m)] || 0}</b> điểm` }, start);
    return { destroy() { B.clear(); keyFn = null; } };
  }

  const RUN = { quiz, rain, memory, listen, builder, tf, fish, whack, balloon };
  SJ.games = {
    list: GAMES,
    run(id, root) { const f = RUN[id]; if (!f) { location.hash = '#/games'; return null; } return f(root); },
    bestLabel(id) {
      const gs = SJ.store.get().games;
      if (id === 'memory') { const v = ['kr', 'hk', 'we'].map(m => gs['memory_' + m]).filter(x => x != null); return v.length ? `Ít nhất ${Math.min(...v)} lượt` : ''; }
      if (id === 'listen') { const v = Math.max(gs.listen_kana || 0, gs.listen_word || 0); return v ? `Kỷ lục ${v}/10` : ''; }
      if (id === 'balloon') { const v = Math.max(0, ...['hira', 'kata', 'daku'].map(m => gs['balloon_' + m] || 0)); return v ? `Kỷ lục ${v}` : ''; }
      return gs[id] ? `Kỷ lục ${gs[id]}` : '';
    },
  };
})(window.SJ);
