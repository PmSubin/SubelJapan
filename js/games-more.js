/* SubelJapan — 3 trò chơi mới, cắm vào khung trò chơi có sẵn qua SJ.games.add():
 *  - しりとり Nối đuôi chữ: đấu với Mochi, từ sau bắt đầu bằng chữ cuối của từ trước, chọn từ tận cùng ん là thua
 *  - ビンゴ Bingo chữ cái: Mochi gọi âm, tìm chữ trên bảng 4×4, đủ một hàng là BINGO
 *  - Xếp câu thần tốc: nhìn nghĩa tiếng Việt, xếp các cụm chữ thành câu (lấy từ phần Nói & Ngữ pháp)
 * Giao diện nằm trong css/games3.css.
 */
window.SJ = window.SJ || {};
(function (SJ) {
  if (!SJ.games || !SJ.games.add) return;
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const K = SJ.games.kit;

  // ---------- icon cho trò mới (khung 48×48, cùng nét bút với js/icons.js) ----------
  SJ.addIcons && SJ.addIcons({
    bingo: k => k.R(7, 5, 34, 38, 6, k.C.wht) + k.F('M7 11 q0 -6 6 -6 h22 q6 0 6 6 v3.5 H7 Z', k.C.rose) + k.P('M7 14.5 H41')
      + k.T(24, 12.6, 'ビンゴ', 6.4, '#fff', 1)
      + [0, 1, 2].map(r => [0, 1, 2].map(c => k.O(15 + c * 9, 22.5 + r * 8.5, 3.1, r === c ? k.C.pink : k.C.cream)).join('')).join('')
      + k.P('M12.6 20.3 L35.4 41.6', 'none'),
    word_blocks: k => k.R(4, 14, 13, 13, 3.5, k.C.yel) + k.T(10.5, 23.6, 'は', 8, undefined, 1)
      + k.R(18.5, 14, 13, 13, 3.5, k.C.pink) + k.T(25, 23.6, 'を', 8, undefined, 1)
      + k.R(33, 14, 11, 13, 3.5, k.C.blue) + k.T(38.5, 23.6, 'に', 8, undefined, 1)
      + k.P('M8 35 H40') + k.P('M34 31 L40 35 L34 39', 'none') + k.D(6, 35, 1.6),
  });

  // ===================== しりとり — NỐI ĐUÔI CHỮ =====================
  const SMALL = { 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お', 'っ': 'つ', 'ゎ': 'わ' };
  const hira = w => SJ.toHira(w.jp);
  /** chữ cuối dùng để nối: bỏ dấu kéo dài ー, chữ nhỏ ゃ → や */
  function lastKana(w) { const s = Array.from(hira(w)).filter(c => c !== 'ー'); const c = s[s.length - 1]; return SMALL[c] || c; }
  const firstKana = w => Array.from(hira(w))[0];
  const endsN = w => lastKana(w) === 'ん';
  let WORDS = null;
  function words() {
    if (WORDS) return WORDS;
    const seen = new Set(), out = [];
    // しりとり chỉ dùng từ vựng thật: bỏ tên riêng, câu chào/cảm thán và từ tượng thanh lặp đôi (ぺこぺこ, ピョンピョン…)
    const SKIP = new Set(['ドゥーイット', 'モーツァルト', 'ディズニー', 'ミャンマー', 'イェス', 'ベトナム', 'フランス', 'ニャー', 'にゃあ', 'ひゅう']);
    const add = (o, key) => {
      if (!o || !o.jp || seen.has(o.jp) || SKIP.has(o.jp) || /^(.{2,})\1$/.test(o.jp) || !/^[ぁ-ゖァ-ヺー]{2,7}$/.test(o.jp) || !o.e || !I(o.e, 48)) return;
      seen.add(o.jp); out.push({ jp: o.jp, r: o.r, vi: o.vi, e: o.e, key });
    };
    SJ.VOCAB_ALL.forEach(o => add(o, o.key));
    SJ.KANA_ALL.forEach(o => add(o.w));
    return (WORDS = out);
  }

  function shiritori(root) {
    const g = K.G('shiritori'); let timer = null, tmo = null;
    function start(cfg) {
      const timed = cfg.mode === 'timed', LIMIT = 12;
      const all = words(), used = new Set();
      let cur = null, lives = 3, score = 0, links = 0, mochiStuck = 0, lock = false, over = false, left = LIMIT, chain = [];
      root.innerHTML = `<div class="container-sm game shiri">${K.top(`<div class="lives" data-lv></div>${timed ? '<div class="timer-bar"><div class="timer-fill"></div></div>' : '<span class="grow"></span>'}<div class="g-score">${I('chain', 22)} <b data-sc>0</b></div>`)}
        <div class="sh-trail" data-trail></div>
        <div class="sh-stage" data-stage></div></div>`;
      const lv = root.querySelector('[data-lv]'), sc = root.querySelector('[data-sc]'), trail = root.querySelector('[data-trail]'), stage = root.querySelector('[data-stage]'), tf = root.querySelector('.timer-fill');
      const drawLives = () => { lv.innerHTML = [0, 1, 2].map(i => `<span class="${i < lives ? '' : 'used'}">${I('heart', 26)}</span>`).join(''); };
      const drawTrail = () => { trail.innerHTML = chain.slice(-6).map((w, i, a) => `<span class="sh-chip ${w.by}">${esc(w.jp)}</span>${i < a.length - 1 ? `<i>${I('arrow_r', 14)}</i>` : ''}`).join(''); };
      // tô chữ dùng để nối: bỏ qua dấu kéo dài ー ở cuối (サッカー → tô カ)
      const tail = w => { const s = Array.from(w.jp); let i = s.length - 1; while (i > 0 && s[i] === 'ー') i--; return esc(s.slice(0, i).join('')) + `<b class="sh-last">${esc(s[i])}</b>` + esc(s.slice(i + 1).join('')); };
      drawLives();
      root.querySelector('[data-quit]').onclick = () => end();
      const fresh = () => U().shuffle(all.filter(w => !used.has(w.jp) && !endsN(w)));
      const nextFor = (k, n) => fresh().filter(w => firstKana(w) === k).slice(0, n || 1);
      function setCur(w, by) { cur = w; used.add(w.jp); chain.push(Object.assign({ by }, w)); drawTrail(); }
      // Mochi mở màn bằng một từ còn nối tiếp được → trả về lời Mochi nói
      function opening() { const w = fresh().find(x => nextFor(lastKana(x)).length); if (!w) return null; setCur(w, 'mochi'); return `Mochi bắt đầu nè: <b class="jp">${esc(w.jp)}</b>`; }
      function say(html) { const m = stage.querySelector('.sh-say'); if (m) m.innerHTML = html; }
      let good = null;
      function turn(msg) {
        if (over) return;
        const k = lastKana(cur);
        good = nextFor(k, 1)[0];
        if (!good) { // hết từ bắt đầu bằng chữ này → Mochi đổi từ mới, không trừ tim
          const m = opening(); if (!m) return end();
          return turn(`Hết từ bắt đầu bằng <b class="jp">${k}</b> rồi, Mochi đổi từ mới: <b class="jp">${esc(cur.jp)}</b>`);
        }
        const trap = links >= 2 && Math.random() < .45 ? U().shuffle(all.filter(w => !used.has(w.jp) && endsN(w) && firstKana(w) === k))[0] : null;
        const wrong = K.distinctBy(all.filter(w => !used.has(w.jp) && firstKana(w) !== k && w.jp !== good.jp), trap ? 2 : 3, w => firstKana(w));
        const opts = U().shuffle([good].concat(trap ? [trap] : [], wrong));
        stage.innerHTML = `<div class="sh-cur paper pop-in">
            <div class="sh-who">${U().mascot('happy', 46)}<span>Mochi</span></div>
            <div class="sh-pic">${I(cur.e, 84, 'pic')}</div>
            <div class="sh-word jp">${tail(cur)}</div><div class="sh-mean">${esc(cur.r)} · ${esc(cur.vi)}</div>
            <div class="sh-say">${msg ? msg + '<br>' : ''}Tìm từ bắt đầu bằng <b class="jp sh-need">${k}${/[゠-ヿ]/.test(cur.jp) ? '・' + SJ.toKata(k) : ''}</b></div></div>
          <div class="sh-opts">${opts.map((w, i) => `<button class="sh-opt opt" data-nosfx="1" data-i="${i}"><kbd>${i + 1}</kbd><span class="sh-opic">${I(w.e, 44)}</span><span class="sh-ojp jp">${esc(w.jp)}</span><small>${esc(w.vi)}</small></button>`).join('')}</div>`;
        stage.querySelector('.sh-opts').onclick = e => { const b = e.target.closest('.sh-opt'); if (b) pick(opts[+b.dataset.i], b); };
        K.setKey(ev => { if (/^[1-4]$/.test(ev.key)) { const b = stage.querySelectorAll('.sh-opt')[+ev.key - 1]; b && pick(opts[+ev.key - 1], b); } });
        lock = false; left = LIMIT;
        SJ.audio.speak(cur.jp);
        function pick(w, b) {
          if (lock || over) return; lock = true;
          const btns = stage.querySelectorAll('.sh-opt');
          btns.forEach((x, i) => { if (opts[i] === good || (firstKana(opts[i]) === k && !endsN(opts[i]))) x.classList.add('ok'); });
          if (firstKana(w) === k && !endsN(w)) {
            b.classList.add('ok'); links++; score += timed ? 2 : 1; sc.textContent = score; SJ.audio.sfx(links % 5 ? 'ok' : 'combo');
            w.key && SJ.store.rec(w.key, true);
            setCur(w, 'me'); say(`Đúng rồi! <b class="jp">${esc(w.jp)}</b> (${esc(w.r)}) — tới lượt Mochi…`);
            tmo = setTimeout(mochiTurn, 900);
          } else {
            b.classList.add('bad'); lives--; drawLives(); SJ.audio.sfx('bad'); w.key && SJ.store.rec(w.key, false);
            say(endsN(w) ? `Ối! <b class="jp">${esc(w.jp)}</b> tận cùng bằng <b class="jp">ん</b> — trong しりとり không có từ nào bắt đầu bằng ん nên chọn từ này là <b>thua</b>!`
              : `<b class="jp">${esc(w.jp)}</b> bắt đầu bằng <b class="jp">${firstKana(w)}</b>, cần chữ <b class="jp">${k}</b> cơ.`);
            tmo = setTimeout(() => { if (lives <= 0) return end(); used.add(w.jp); turn(); }, 2300);
          }
        }
      }
      function mochiTurn() {
        if (over) return;
        const w = nextFor(lastKana(cur), 1)[0];
        if (!w) { // Mochi bí → người chơi được thưởng, Mochi mở ván mới
          mochiStuck++; score += 5; sc.textContent = score; SJ.audio.sfx('win');
          say(`Mochi bí rồi, không nghĩ ra từ bắt đầu bằng <b class="jp">${lastKana(cur)}</b>! Bạn thắng ván này <b>+5</b>`);
          tmo = setTimeout(() => { if (over) return; const m = opening(); if (!m) return end(); turn('Ván mới! ' + m); }, 1800);
          return;
        }
        setCur(w, 'mochi'); turn(`Mochi nối: <b class="jp">${esc(w.jp)}</b>`);
      }
      function end() {
        if (over) return; over = true; clearInterval(timer); clearTimeout(tmo); K.setKey(null);
        const id = timed ? 'shiritori_t' : 'shiritori', isNew = SJ.store.setBest(id, score);
        K.result(root, g, { title: links >= 10 ? 'Chuỗi しりとり siêu dài!' : 'Hết lượt rồi!', score, best: SJ.store.get().games[id], isNew, xp: Math.min(50, score * 2), mood: links >= 10 ? 'love' : links >= 4 ? 'happy' : 'wink', stats: [[links, 'từ nối được'], [mochiStuck, 'lần Mochi bí']], again: () => start(cfg) });
      }
      turn(opening());
      if (timed) {
        let last = Date.now();
        timer = setInterval(() => {
          const now = Date.now(); if (document.hidden || lock) { last = now; return; } left -= (now - last) / 1000; last = now;
          tf.style.width = U().clamp(left / LIMIT * 100, 0, 100) + '%'; tf.classList.toggle('low', left < 4);
          if (left <= 0 && !lock) {
            lock = true; lives--; drawLives(); SJ.audio.sfx('bad');
            say(`Hết giờ! Có thể nối bằng <b class="jp">${esc(good.jp)}</b> (${esc(good.r)}).`);
            stage.querySelectorAll('.sh-opt').forEach(x => { x.disabled = true; if (x.querySelector('.sh-ojp').textContent === good.jp) x.classList.add('ok'); });
            tmo = setTimeout(() => { if (lives <= 0) return end(); turn(); }, 1800);
          }
        }, 100);
      }
    }
    K.setup(root, g, {
      sets: false, modes: [['easy', 'Thong thả'], ['timed', 'Tính giờ 12 giây']],
      note: 'Luật しりとり: từ sau phải <b>bắt đầu bằng chữ cuối</b> của từ trước (りんご → <b>ご</b>はん). Chữ nhỏ ゃ ゅ ょ tính là や ゆ よ, dấu kéo dài ー thì lấy chữ ngay trước. Chọn từ <b>tận cùng bằng ん</b> là thua!',
      bestText: m => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games[m === 'timed' ? 'shiritori_t' : 'shiritori'] || 0}</b> điểm`,
    }, start);
    return { destroy() { clearInterval(timer); clearTimeout(tmo); K.setKey(null); } };
  }

  // ===================== ビンゴ — BINGO CHỮ CÁI =====================
  function bingo(root) {
    const g = K.G('bingo'); let timer = null, tmo = null;
    const LINES = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [0, 5, 10, 15], [3, 6, 9, 12]];
    function start(cfg) {
      const listen = cfg.mode === 'listen' && SJ.audio.canListen && SJ.audio.canListen();
      const TIME = 90;
      let time = TIME, score = 0, marks = 0, bingos = 0, boards = 0, miss = 0, over = false, call = null, cells = [], done = new Set(), lines = new Set();
      root.innerHTML = `<div class="container-sm game bingo">${K.top(`<div class="timer-bar"><div class="timer-fill"></div></div><div class="g-score">${I('star', 22)} <b data-sc>0</b></div>`)}
        <div class="bg-call paper" data-call></div>
        <div class="bg-board" data-board></div>
        <div class="bg-foot"><span data-bn></span>${listen ? `<button class="btn btn-sm btn-white" data-again>${I('speaker', 18)} Nghe lại</button>` : ''}</div></div>`;
      const tf = root.querySelector('.timer-fill'), sc = root.querySelector('[data-sc]'), callEl = root.querySelector('[data-call]'), board = root.querySelector('[data-board]'), bn = root.querySelector('[data-bn]');
      root.querySelector('[data-quit]').onclick = () => end();
      const againBtn = root.querySelector('[data-again]'); if (againBtn) againBtn.onclick = () => call && SJ.audio.speak(call.k);
      const paintBn = () => { bn.innerHTML = `${I('trophy', 18)} BINGO: <b>${bingos}</b> · Bảng ${boards}`; };
      function newBoard() {
        boards++; done = new Set(); lines = new Set();
        // 16 chữ khác âm nhau (bộ "Trộn cả hai" có あ và ア cùng âm → chỉ lấy một); bộ quá ít chữ thì dùng Hiragana cơ bản
        let src = K.distinctBy(cfg.pool, 60, o => o.r); if (src.length < 16) src = K.distinctBy(SJ.pool('hira-basic'), 60, o => o.r);
        cells = U().sample(src, 16);
        board.innerHTML = cells.map((o, i) => `<button class="bg-cell jp" data-nosfx="1" data-i="${i}" style="animation-delay:${i * .025}s">${o.k}</button>`).join('');
        paintBn(); next();
      }
      function next() {
        if (over) return;
        const left = cells.map((o, i) => i).filter(i => !done.has(i));
        if (!left.length) return newBoard();
        call = cells[U().pick(left)];
        callEl.innerHTML = listen ? `<div class="bg-ask">${I('headphones', 30)} Mochi đọc chữ nào?</div><div class="bg-big muted">?</div>`
          : `<div class="bg-ask">Tìm chữ đọc là</div><div class="bg-big">${esc(call.r)}</div>`;
        callEl.classList.remove('pop'); void callEl.offsetWidth; callEl.classList.add('pop');
        SJ.audio.speak(call.k);
      }
      board.onclick = e => {
        const b = e.target.closest('.bg-cell'); if (!b || over) return;
        const i = +b.dataset.i; if (done.has(i)) return;
        if (cells[i] === call) {
          done.add(i); b.classList.add('on'); marks++; score++; SJ.store.rec(call.k, true); SJ.audio.sfx('stamp');
          if (listen) callEl.querySelector('.bg-big').textContent = call.r;
          const fresh = LINES.map((l, n) => n).filter(n => !lines.has(n) && LINES[n].every(x => done.has(x)));
          fresh.forEach(n => { lines.add(n); LINES[n].forEach(x => board.children[x].classList.add('line')); });
          if (fresh.length) {
            bingos += fresh.length; score += 5 * fresh.length; time = Math.min(TIME, time + 4 * fresh.length);
            board.insertAdjacentHTML('beforeend', `<div class="bg-banner">BINGO!${fresh.length > 1 ? ' ×' + fresh.length : ''} <small>+${5 * fresh.length}</small></div>`);
            SJ.audio.sfx('win'); paintBn();
            tmo = setTimeout(() => { const bb = board.querySelector('.bg-banner'); bb && bb.remove(); lines.size >= 3 ? newBoard() : next(); }, 1100);
          } else tmo = setTimeout(next, 260);
          sc.textContent = score;
        } else {
          miss++; time = Math.max(0, time - 2); SJ.store.rec(call.k, false); SJ.audio.sfx('bad');
          b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
          const r = board.children[cells.indexOf(call)]; r && r.classList.add('hint'); setTimeout(() => r && r.classList.remove('hint'), 900);
        }
      };
      let last = Date.now(), lastSec = TIME;
      timer = setInterval(() => {
        const now = Date.now(); if (document.hidden) { last = now; return; } time -= (now - last) / 1000; last = now;
        tf.style.width = U().clamp(time / TIME * 100, 0, 100) + '%'; tf.classList.toggle('low', time < 10);
        if (time < 10 && Math.ceil(time) !== lastSec) { lastSec = Math.ceil(time); SJ.audio.sfx('tick'); }
        if (time <= 0) end();
      }, 100);
      function end() {
        if (over) return; over = true; clearInterval(timer); clearTimeout(tmo);
        const id = 'bingo_' + (listen ? 'listen' : 'see'), isNew = SJ.store.setBest(id, score);
        K.result(root, g, { title: bingos >= 4 ? 'BINGO liên hoàn!' : 'Hết giờ rồi!', score, best: SJ.store.get().games[id], isNew, xp: Math.min(50, score + bingos * 2), mood: bingos >= 4 ? 'love' : bingos >= 2 ? 'happy' : 'wink', stats: [[bingos, 'lần BINGO'], [marks, 'chữ tìm đúng'], [miss, 'lần nhầm']], again: () => start(cfg) });
      }
      newBoard();
    }
    K.setup(root, g, {
      modes: [['see', 'Nhìn romaji'], ['listen', 'Chỉ nghe']],
      note: 'Bảng có 16 chữ. Mochi gọi một âm, bạn chạm đúng chữ để đóng dấu. Đủ 4 ô thẳng hàng (ngang, dọc, chéo) là <b>BINGO!</b> +5 điểm và thêm giờ. Chế độ <b>Chỉ nghe</b> cần máy có giọng đọc tiếng Nhật.',
      bestText: m => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games['bingo_' + (m || 'see')] || 0}</b> điểm`,
    }, start);
    return { destroy() { clearInterval(timer); clearTimeout(tmo); } };
  }

  // ===================== XẾP CÂU THẦN TỐC =====================
  function sentence(root) {
    const g = K.G('sentence'); let timer = null, tmo = null;
    function pool(mode) {
      SJ.talkPrep();
      const S = SJ.store.get();
      const ok = l => mode === 'all' || (S.talk[l.id] && (S.talk[l.id].rounds || S.talk[l.id].done));
      let ls = SJ.TALK_LESSONS.filter(ok);
      if (ls.length < 2) ls = SJ.TALK_LESSONS.slice(0, 8); // chưa học bài nào → lấy các bài đầu
      const out = [];
      ls.forEach(l => l.ex.forEach(e => { const t = e.toks.map(x => x.trim()).filter(Boolean); if (t.length >= 3 && t.length <= 7) out.push({ e, t }); }));
      return out;
    }
    function start(cfg) {
      const list = U().shuffle(pool(cfg.mode)), TIME = 90;
      let time = TIME, score = 0, solved = 0, combo = 0, best = 0, idx = 0, over = false, lock = false, slips = 0;
      root.innerHTML = `<div class="container-sm game sent">${K.top(`<div class="timer-bar"><div class="timer-fill"></div></div><div class="g-score">${I('star', 22)} <b data-sc>0</b></div>`)}
        <div class="combo" data-combo></div><div data-stage></div></div>`;
      const tf = root.querySelector('.timer-fill'), sc = root.querySelector('[data-sc]'), stage = root.querySelector('[data-stage]'), cb = root.querySelector('[data-combo]');
      root.querySelector('[data-quit]').onclick = () => end();
      function play() {
        if (over) return;
        if (idx >= list.length) { list.push(...U().shuffle(list.slice())); }
        const { e, t } = list[idx++];
        const tiles = U().shuffle(t.map((c, i) => ({ c, i })));
        let pos = 0, hinted = false; lock = false;
        stage.innerHTML = `<div class="st-card paper pop-in"><div class="st-vi">${esc(e.v)}</div><div class="st-line jp" data-line>${t.map(() => '<span class="st-slot"></span>').join('')}</div>
            <div class="st-r" data-r>&nbsp;</div></div>
          <div class="st-tiles">${tiles.map((x, i) => `<button class="tile st-tile jp" data-nosfx="1" data-t="${i}">${esc(x.c)}</button>`).join('')}</div>
          <div class="row center-row gap-s mt-s"><button class="btn btn-sm btn-paper" data-hint>${I('bulb', 18)} Gợi ý romaji</button><button class="btn btn-sm btn-ghost" data-skip>Bỏ qua ${I('arrow_r', 16)}</button></div>`;
        const slots = stage.querySelectorAll('.st-slot');
        stage.querySelector('[data-hint]').onclick = () => { hinted = true; stage.querySelector('[data-r]').textContent = e.rom || e.r.replace(/\|/g, ' '); };
        stage.querySelector('[data-skip]').onclick = () => { if (lock) return; lock = true; combo = 0; cb.innerHTML = ''; t.forEach((c, i) => { slots[i].textContent = c; slots[i].classList.add('reveal'); }); SJ.audio.speak(e.jp); tmo = setTimeout(play, 1400); };
        stage.querySelector('.st-tiles').onclick = ev => {
          const b = ev.target.closest('.st-tile'); if (!b || lock || b.classList.contains('used')) return;
          const x = tiles[+b.dataset.t];
          if (x.c === t[pos]) {
            b.classList.add('used'); slots[pos].textContent = x.c; slots[pos].classList.add('filled'); SJ.audio.sfx('note', pos); pos++;
            if (pos >= t.length) done();
          } else {
            slips++; combo = 0; cb.innerHTML = ''; time = Math.max(0, time - 1.5); SJ.audio.sfx('bad');
            b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
          }
        };
        function done() {
          lock = true; solved++; combo++; best = Math.max(best, combo);
          const pts = 2 + Math.min(3, Math.floor(combo / 3)) - (hinted ? 1 : 0); score += pts; sc.textContent = score;
          stage.querySelector('[data-line]').classList.add('ok'); stage.querySelector('[data-r]').innerHTML = `<b>${esc(e.rom || '')}</b> · +${pts}`;
          cb.innerHTML = combo >= 2 ? `<span class="combo-pill pop-in">${I('fire', 18)} Combo x${combo}</span>` : '';
          SJ.audio.sfx(combo % 3 ? 'ok' : 'combo'); SJ.audio.speak(e.jp); e.key && SJ.store.talkRec && SJ.store.talkRec(e.key, !hinted);
          tmo = setTimeout(play, 1100);
        }
      }
      let last = Date.now(), lastSec = TIME;
      timer = setInterval(() => {
        const now = Date.now(); if (document.hidden) { last = now; return; } time -= (now - last) / 1000; last = now;
        tf.style.width = U().clamp(time / TIME * 100, 0, 100) + '%'; tf.classList.toggle('low', time < 10);
        if (time < 10 && Math.ceil(time) !== lastSec) { lastSec = Math.ceil(time); SJ.audio.sfx('tick'); }
        if (time <= 0) end();
      }, 100);
      function end() {
        if (over) return; over = true; clearInterval(timer); clearTimeout(tmo);
        const id = 'sentence_' + cfg.mode, isNew = SJ.store.setBest(id, score);
        K.result(root, g, { title: solved >= 12 ? 'Xếp câu nhanh như người Nhật!' : 'Hết giờ rồi!', score, best: SJ.store.get().games[id], isNew, xp: Math.min(50, score + best), mood: solved >= 12 ? 'love' : solved >= 5 ? 'happy' : 'wink', stats: [[solved, 'câu xếp đúng'], [best, 'combo cao nhất'], [slips, 'lần chọn nhầm']], again: () => start(cfg) });
      }
      play();
    }
    K.setup(root, g, {
      sets: false, modes: [['learned', 'Câu mình đã học'], ['all', 'Tất cả câu']],
      note: 'Đọc nghĩa tiếng Việt rồi chạm các cụm chữ <b>theo đúng thứ tự</b> để thành câu tiếng Nhật. Câu lấy từ phần <b>Nói & Ngữ pháp</b> — chưa học bài nào thì Mochi lấy các câu đầu tiên. Chọn nhầm bị trừ 1,5 giây.',
      bestText: m => `${I('trophy', 24)} Kỷ lục: <b>${SJ.store.get().games['sentence_' + (m || 'learned')] || 0}</b> điểm`,
    }, start);
    return { destroy() { clearInterval(timer); clearTimeout(tmo); } };
  }

  SJ.games.add({ id: 'shiritori', icon: 'chain', name: 'Nối đuôi しりとり', desc: 'Trò chơi chữ quốc dân của Nhật: đấu với Mochi, từ sau bắt đầu bằng chữ cuối của từ trước. Chọn từ tận cùng ん là thua!', color: '#ffd1a8' }, shiritori);
  SJ.games.add({ id: 'bingo', icon: 'bingo', name: 'Bingo chữ cái', desc: 'Mochi gọi âm, bạn tìm chữ trên bảng 4×4. Đủ 4 ô thẳng hàng là BINGO!', color: '#ffc2d6' }, bingo);
  SJ.games.add({ id: 'sentence', icon: 'word_blocks', name: 'Xếp câu thần tốc', desc: 'Nhìn nghĩa tiếng Việt, xếp các cụm chữ thành câu tiếng Nhật đúng thứ tự trước khi hết giờ.', color: '#bfe3c8' }, sentence);
})(window.SJ);
