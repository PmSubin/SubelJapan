/* SubelJapan — Nét viết (dữ liệu KanjiVG)
 *  - strokeView: hoạt hình thứ tự nét
 *  - pad: bảng tập viết CHẤM TỪNG NÉT — đúng vị trí, đúng chiều, đúng thứ tự (như sensei chấm)
 *  - freePad: bảng vẽ tự do + chấm điểm theo hình (dự phòng khi không tải được dữ liệu nét)
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const BASE = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';
  const mem = {};
  const code = ch => ch.codePointAt(0).toString(16).padStart(5, '0');
  const NS = 'http://www.w3.org/2000/svg';
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };

  /** Tải dữ liệu nét của 1 ký tự: {paths:[d...], nums:[[x,y]...]} hoặc null */
  function getStrokes(ch) {
    if (mem[ch]) return mem[ch];
    const ck = 'sj_kvg_' + ch;
    try { const c = localStorage.getItem(ck); if (c) return (mem[ch] = Promise.resolve(JSON.parse(c))); } catch (e) { }
    mem[ch] = fetch(BASE + code(ch) + '.svg')
      .then(r => { if (!r.ok) throw new Error('404'); return r.text(); })
      .then(t => {
        const paths = Array.from(t.matchAll(/<path[^>]*?\sd="([^"]+)"/g)).map(m => m[1]);
        const nums = Array.from(t.matchAll(/<text transform="matrix\(1 0 0 1 ([-\d.]+) ([-\d.]+)\)">\d+<\/text>/g)).map(m => [+m[1], +m[2]]);
        if (!paths.length) throw new Error('empty');
        const data = { paths, nums };
        try { localStorage.setItem(ck, JSON.stringify(data)); } catch (e) { }
        return data;
      })
      .catch(() => { delete mem[ch]; return null; });
    return mem[ch];
  }

  // =================== HOẠT HÌNH THỨ TỰ NÉT ===================
  function strokeView(box, text, opts) {
    opts = opts || {};
    const chars = Array.from(text);
    box.innerHTML = '';
    box.classList.add('stroke-view');
    const boxes = chars.map(ch => {
      const wrap = document.createElement('div');
      wrap.className = 'sv-box' + (chars.length > 1 ? ' multi' : '');
      wrap.innerHTML = `<svg viewBox="0 0 109 109"><g class="sv-grid"><line x1="54.5" y1="4" x2="54.5" y2="105"/><line x1="4" y1="54.5" x2="105" y2="54.5"/></g><text x="54.5" y="76" text-anchor="middle" class="sv-loading">${ch}</text></svg>`;
      box.appendChild(wrap);
      return { ch, svg: wrap.querySelector('svg'), paths: [], nums: [] };
    });
    let token = 0, total = 0;
    const ready = Promise.all(boxes.map(b => getStrokes(b.ch).then(data => {
      const svg = b.svg;
      const ld = svg.querySelector('.sv-loading');
      if (!data) { ld.classList.add('fallback'); b.fail = true; return; }
      ld.remove();
      const bg = el('g', { class: 'sv-bg' }, svg), fg = el('g', { class: 'sv-fg' }, svg), ng = el('g', { class: 'sv-num' }, svg);
      data.paths.forEach((d, i) => {
        el('path', { d }, bg);
        b.paths.push(el('path', { d }, fg));
        if (data.nums[i]) { const t = el('text', { x: data.nums[i][0], y: data.nums[i][1] }, ng); t.textContent = i + 1; b.nums.push(t); }
      });
      total += data.paths.length;
      b.paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = 0; p.dataset.len = L; });
    })));

    async function play() {
      const my = ++token;
      await ready;
      if (my !== token) return;
      boxes.forEach(b => {
        b.paths.forEach(p => { p.style.transition = 'none'; p.style.strokeDashoffset = p.dataset.len; p.classList.remove('cur'); });
        b.nums.forEach(n => n.classList.remove('on'));
      });
      await sleep(150);
      const speed = opts.speed || 1;
      for (const b of boxes) {
        for (let i = 0; i < b.paths.length; i++) {
          if (my !== token) return;
          const p = b.paths[i], L = +p.dataset.len;
          const dur = Math.max(280, L * 9) / speed;
          p.getBoundingClientRect();
          p.classList.add('cur');
          p.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.4,.1,.6,.9)`;
          p.style.strokeDashoffset = 0;
          if (b.nums[i]) b.nums[i].classList.add('on');
          await sleep(dur + 150 / speed);
          p.classList.remove('cur');
        }
      }
      opts.onDone && opts.onDone();
    }
    function stop() { token++; }
    if (opts.autoplay !== false) play();
    return { play, stop, ready, count: () => total, failed: () => boxes.some(b => b.fail) };
  }

  // =================== HÌNH HỌC NÉT ===================
  const N = 32;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const polyLen = pts => { let s = 0; for (let i = 1; i < pts.length; i++) s += dist(pts[i - 1], pts[i]); return s; };
  function resample(pts, n) {
    if (pts.length === 1) return Array.from({ length: n }, () => ({ x: pts[0].x, y: pts[0].y }));
    const L = polyLen(pts), step = L / (n - 1);
    const out = [{ x: pts[0].x, y: pts[0].y }];
    let acc = 0, i = 1, prev = pts[0];
    while (i < pts.length && out.length < n) {
      const cur = pts[i], d = dist(prev, cur);
      if (acc + d >= step && d > 0) {
        const t = (step - acc) / d;
        const q = { x: prev.x + t * (cur.x - prev.x), y: prev.y + t * (cur.y - prev.y) };
        out.push(q); prev = q; acc = 0;
      } else { acc += d; prev = cur; i++; }
    }
    while (out.length < n) out.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });
    return out;
  }
  const centroid = P => { let x = 0, y = 0; P.forEach(p => { x += p.x; y += p.y; }); return { x: x / P.length, y: y / P.length }; };
  /** So khớp nét người dùng với nét mẫu → {ok, wrongDir, d} */
  function compare(user, tpl, mode) {
    const U = resample(user, N), T = tpl.pts;
    const uLen = polyLen(user), tLen = tpl.len;
    const tol = mode === 'free' ? 20 : mode === 'hint' ? 18 : 16.5;
    const cu = centroid(U), ct = centroid(T), cd = dist(cu, ct);
    if (tLen < 17) { // chấm, nét ngắn (゛ ゜ 、…)
      return { ok: cd < tol * 1.1 && uLen < Math.max(42, tLen * 3.6), wrongDir: false, d: cd };
    }
    let d = 0, dr = 0, dc = 0;
    for (let i = 0; i < N; i++) {
      d += dist(U[i], T[i]); dr += dist(U[N - 1 - i], T[i]);
      dc += Math.hypot((U[i].x - cu.x) - (T[i].x - ct.x), (U[i].y - cu.y) - (T[i].y - ct.y));
    }
    d /= N; dr /= N; dc /= N;
    const lenOk = uLen > tLen * 0.45 && uLen < tLen * 2.1 + 14;
    // chế độ thuộc lòng: cho phép lệch vị trí một chút nếu hình dạng giống
    const shapeOk = mode === 'free' && dc < 12 && cd < 26;
    const ok = lenOk && (d < tol || shapeOk) && d <= dr + 3;
    const wrongDir = !ok && lenOk && dr < tol + 2 && dr < d;
    return { ok, wrongDir, d };
  }

  // =================== BẢNG VIẾT CHẤM TỪNG NÉT ===================
  /**
   * pad(container, text, { mode:'guide'|'hint'|'free', onDone(res), onStroke(info) })
   * guide: hiện chữ mờ + chấm bắt đầu + mũi tên; hint: chỉ chấm bắt đầu; free: viết thuộc lòng (sai 2 lần mới gợi ý)
   */
  function pad(box, text, opts) {
    opts = opts || {};
    let mode = opts.mode || 'guide';
    const chars = Array.from(text);
    const W = 109 * chars.length;
    box.innerHTML = `<div class="spad"><svg class="spad-svg" viewBox="0 0 ${W} 109" aria-label="Bảng tập viết">
      <g class="g-grid"></g><g class="g-guide"></g><g class="g-hint"></g><g class="g-done"></g><g class="g-ink"></g><g class="g-mark"></g></svg>
      <div class="spad-steps"></div><div class="spad-msg" aria-live="polite"></div></div>`;
    const root = box.querySelector('.spad'), svg = root.querySelector('svg');
    const G = n => svg.querySelector('.g-' + n);
    const steps = root.querySelector('.spad-steps'), msg = root.querySelector('.spad-msg');
    // lưới ô genkō
    chars.forEach((c, i) => {
      const x = i * 109;
      el('line', { x1: x + 54.5, y1: 5, x2: x + 54.5, y2: 104 }, G('grid'));
      el('line', { x1: x + 5, y1: 54.5, x2: x + 104, y2: 54.5 }, G('grid'));
      if (i) el('line', { x1: x, y1: 6, x2: x, y2: 103, class: 'sep' }, G('grid'));
    });
    let T = [], idx = 0, mistakes = 0, hints = 0, strokeMiss = 0, done = false, dead = false, fallback = false, fp = null;
    let cur = null, curPath = null, msgTimer = null;

    const say = (t, cls) => { clearTimeout(msgTimer); msg.className = 'spad-msg ' + (cls || ''); msg.innerHTML = t; };
    const drawSteps = () => { steps.innerHTML = T.map((t, i) => `<i class="${i < idx ? (t.miss ? 'miss' : 'done') : i === idx && !done ? 'cur' : ''}"></i>`).join(''); };

    function markers() {
      const g = G('mark'); g.innerHTML = '';
      G('guide').querySelectorAll('path').forEach((p, i) => p.classList.toggle('next', i === idx && mode === 'guide'));
      if (done || !T[idx]) return;
      const show = mode === 'guide' || mode === 'hint' || strokeMiss >= 2;
      if (!show) return;
      const P = T[idx].pts, a = P[0], b = P[Math.min(5, P.length - 1)];
      el('circle', { cx: a.x, cy: a.y, r: 4.6, class: 'ping' }, g);
      if (mode === 'guide' || strokeMiss >= 2) {
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const ox = Math.cos(ang), oy = Math.sin(ang), px = -oy, py = ox;
        const sx = a.x + ox * 8 + px * 7, sy = a.y + oy * 8 + py * 7, ex = sx + ox * 11, ey = sy + oy * 11;
        el('path', { class: 'arrow', d: `M${sx} ${sy} L${ex} ${ey} M${ex - ox * 4 + px * 3} ${ey - oy * 4 + py * 3} L${ex} ${ey} L${ex - ox * 4 - px * 3} ${ey - oy * 4 - py * 3}` }, g);
      }
      el('circle', { cx: a.x, cy: a.y, r: 4.6, class: 'start' }, g);
      const t = el('text', { x: a.x, y: a.y + .3 }, g); t.textContent = idx + 1;
    }
    function animPath(d, cls, layer, dur, tr) {
      const p = el('path', { d, class: cls || '' }, layer);
      if (tr) p.setAttribute('transform', tr);
      const L = p.getTotalLength ? p.getTotalLength() : 100;
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      p.getBoundingClientRect();
      p.style.transition = `stroke-dashoffset ${dur}ms ease-out`;
      p.style.strokeDashoffset = 0;
      return p;
    }
    function showHint(count) {
      if (done || !T[idx]) return;
      if (count) hints++;
      G('hint').innerHTML = '';
      const t = T[idx];
      const p = animPath(t.d, '', G('hint'), Math.max(420, t.len * 9), t.tr);
      setTimeout(() => { p.style.transition = 'opacity .5s'; p.style.opacity = 0; setTimeout(() => p.remove(), 520); }, Math.max(420, t.len * 9) + 500);
      markers();
    }
    function accept() {
      const t = T[idx];
      const p = animPath(t.d, 'fresh', G('done'), 170, t.tr);
      setTimeout(() => p.classList.remove('fresh'), 450);
      t.miss = strokeMiss > 0;
      SJ.audio.sfx('note', idx);
      idx++; strokeMiss = 0;
      G('hint').innerHTML = '';
      opts.onStroke && opts.onStroke({ idx, total: T.length, ok: true });
      if (idx >= T.length) finish();
      else { say(`Nét ${idx + 1}/${T.length}`); markers(); drawSteps(); }
    }
    function finish() {
      done = true; drawSteps(); markers();
      G('mark').innerHTML = '';
      const score = Math.max(0, Math.round(100 - mistakes * 12 - hints * 10));
      const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;
      root.classList.add('complete');
      say(mistakes || hints ? `Hoàn thành! Sai ${mistakes} nét${hints ? `, dùng ${hints} gợi ý` : ''}.` : 'Hoàn hảo! Không sai nét nào', 'ok');
      setTimeout(() => SJ.audio.sfx(score >= 90 ? 'stamp' : 'ok'), 180);
      opts.onDone && opts.onDone({ score, stars, mistakes, hints, perfect: !mistakes && !hints, strokes: T.length });
    }
    function reject(user) {
      mistakes++; strokeMiss++;
      if (curPath) { curPath.classList.add('miss'); const cp = curPath; setTimeout(() => cp.remove(), 720); }
      // thử xem có phải viết nhầm thứ tự không
      let order = -1;
      for (let j = idx + 1; j < Math.min(T.length, idx + 5); j++) if (compare(user, T[j], mode).ok) { order = j; break; }
      const r = compare(user, T[idx], mode);
      if (order >= 0) say(`Sai thứ tự rồi! Đó là nét số ${order + 1} — hãy viết nét số ${idx + 1} trước nha`, 'bad');
      else if (r.wrongDir) say('Ngược chiều rồi! Bắt đầu từ chấm hồng nhé', 'bad');
      else say(U().pick(['Chưa khớp nét, thử lại nào', 'Gần đúng rồi, viết sát nét mẫu hơn nha', 'Hụt một xíu thôi, thử lại nha']), 'bad');
      SJ.audio.sfx('bad');
      opts.onStroke && opts.onStroke({ idx, total: T.length, ok: false });
      if (strokeMiss >= 2) showHint(false); else markers();
      drawSteps();
    }
    const U = () => SJ.ui;

    // --- vẽ ---
    const toSvg = e => { const m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()); return { x: p.x, y: p.y }; };
    const pathD = pts => 'M' + pts.map(p => p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' L');
    let curId = null;
    function down(e) {
      if (done || fallback || !T.length) return;
      e.preventDefault();
      if (cur) return;
      curId = e.pointerId;
      try { svg.setPointerCapture(e.pointerId); } catch (_) { }
      cur = [toSvg(e)];
      curPath = el('path', { d: pathD(cur) + ' l.1 .1' }, G('ink'));
    }
    function move(e) {
      if (!cur || e.pointerId !== curId) return; e.preventDefault();
      const p = toSvg(e), l = cur[cur.length - 1];
      if (dist(p, l) > 0.7) { cur.push(p); curPath.setAttribute('d', pathD(cur)); }
    }
    function up(e) {
      if (!cur || e.pointerId !== curId) return;
      const user = cur; cur = null;
      if (polyLen(user) < 2.5 && T[idx] && T[idx].len >= 17) { curPath && curPath.remove(); curPath = null; return; }
      const r = compare(user, T[idx], mode);
      if (r.ok) { curPath && curPath.remove(); curPath = null; accept(); }
      else reject(user);
    }
    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', up);
    // bị huỷ giữa chừng (cuộn trang, cuộc gọi đến…): xoá nét dở, không chấm điểm
    svg.addEventListener('pointercancel', e => { if (!cur || e.pointerId !== curId) return; cur = null; curPath && curPath.remove(); curPath = null; });

    function buildTemplates(datas) {
      G('guide').innerHTML = ''; T = [];
      datas.forEach((d, ci) => {
        d.paths.forEach(pd => {
          const tr = ci ? `translate(${ci * 109} 0)` : '';
          const p = el('path', { d: pd }, G('guide'));
          if (tr) p.setAttribute('transform', tr);
          const L = p.getTotalLength();
          const pts = [];
          for (let i = 0; i < N; i++) { const q = p.getPointAtLength(L * i / (N - 1)); pts.push({ x: q.x + ci * 109, y: q.y }); }
          T.push({ d: pd, tr, pts, len: L });
        });
      });
    }
    function applyMode() {
      G('guide').classList.toggle('off', mode !== 'guide');
      markers();
    }
    function restart() {
      idx = 0; mistakes = 0; hints = 0; strokeMiss = 0; done = false;
      T.forEach(t => { t.miss = false; });
      G('done').innerHTML = ''; G('ink').innerHTML = ''; G('hint').innerHTML = '';
      root.classList.remove('complete');
      applyMode(); drawSteps();
      say(T.length ? `Nét 1/${T.length} — ${mode === 'free' ? 'tự viết theo trí nhớ nhé' : 'bắt đầu từ chấm hồng'}` : '');
    }

    say('Đang tải nét chữ…');
    const ready = Promise.all(chars.map(c => getStrokes(c))).then(datas => {
      if (dead) return false;
      if (datas.some(d => !d)) {
        fallback = true;
        root.innerHTML = '<div class="fp-box"></div>';
        fp = freePad(root.querySelector('.fp-box'), text, { size: opts.size || 320, guide: mode !== 'free' });
        return false;
      }
      buildTemplates(datas);
      restart();
      return true;
    });

    return {
      ready,
      restart,
      hint: () => showHint(true),
      setMode(m) { mode = m; if (fp) fp.setGuide(m !== 'free'); else restart(); },
      isDone: () => done,
      isFallback: () => fallback,
      free: () => fp,
      state: () => ({ idx, total: T.length, mistakes, hints, done }),
      destroy() { dead = true; fp && fp.destroy(); },
    };
  }

  // =================== BẢNG VẼ TỰ DO (dự phòng) ===================
  function freePad(box, text, opts) {
    opts = opts || {};
    const chars = Array.from(text);
    box.innerHTML = '';
    box.classList.add('pad-wrap');
    const canvas = document.createElement('canvas');
    canvas.className = 'pad-canvas';
    box.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    let size = 300, guide = opts.guide !== false, strokes = [], cur = null;
    const data = chars.map(() => null);
    const layout = (i, Sz) => { const n = chars.length, cell = Sz / n; return { ox: i * cell, oy: (Sz - cell) / 2, s: cell / 109, cell }; };
    const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    function resize() {
      const w = box.clientWidth || opts.size || 300;
      size = Math.min(opts.size || 340, w);
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
      canvas.width = Math.round(size * dpr); canvas.height = Math.round(size * dpr);
      draw();
    }
    function drawGuide(c, Sz, lw, color) {
      chars.forEach((ch, i) => {
        const L = layout(i, Sz), d = data[i];
        c.save();
        if (d) { c.translate(L.ox, L.oy); c.scale(L.s, L.s); c.strokeStyle = color; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; d.paths.forEach(p => c.stroke(new Path2D(p))); }
        else { c.fillStyle = color; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `${Math.round(L.cell * 0.78)}px "Klee One", sans-serif`; c.fillText(ch, L.ox + L.cell / 2, L.oy + L.cell * 0.54); }
        c.restore();
      });
    }
    function drawInk(c, Sz, lw, color) {
      c.strokeStyle = color; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
      strokes.concat(cur ? [cur] : []).forEach(st => {
        if (!st.length) return;
        c.beginPath(); c.moveTo(st[0].x * Sz, st[0].y * Sz);
        if (st.length === 1) c.lineTo(st[0].x * Sz + .1, st[0].y * Sz + .1);
        for (let i = 1; i < st.length; i++) c.lineTo(st[i].x * Sz, st[i].y * Sz);
        c.stroke();
      });
    }
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = css('--card') || '#fff'; ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = css('--line') || '#f1e2e9'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]);
      chars.forEach((ch, i) => { const L = layout(i, size); ctx.beginPath(); ctx.moveTo(L.ox + L.cell / 2, L.oy + 6); ctx.lineTo(L.ox + L.cell / 2, L.oy + L.cell - 6); ctx.moveTo(L.ox + 6, L.oy + L.cell / 2); ctx.lineTo(L.ox + L.cell - 6, L.oy + L.cell / 2); ctx.stroke(); });
      ctx.setLineDash([]);
      if (guide) drawGuide(ctx, size, 6.5, 'rgba(160,140,180,.2)');
      drawInk(ctx, size, Math.max(5, size * 0.032), css('--ink') || '#3a2e4d');
    }
    const pos = e => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
    let fid = null;
    canvas.addEventListener('pointerdown', e => { e.preventDefault(); if (cur) return; fid = e.pointerId; try { canvas.setPointerCapture(e.pointerId); } catch (_) { } cur = [pos(e)]; draw(); });
    canvas.addEventListener('pointermove', e => { if (!cur || e.pointerId !== fid) return; e.preventDefault(); const p = pos(e), l = cur[cur.length - 1]; if (Math.hypot(p.x - l.x, p.y - l.y) > .004) { cur.push(p); draw(); } });
    const up = e => { if (!cur || e.pointerId !== fid) return; strokes.push(cur); cur = null; draw(); };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', e => { if (!cur || e.pointerId !== fid) return; cur = null; draw(); });
    const ro = window.ResizeObserver ? new ResizeObserver(resize) : null; ro && ro.observe(box);
    resize();
    const ready = Promise.all(chars.map((ch, i) => getStrokes(ch).then(d => { data[i] = d; }))).then(draw);
    const expected = () => data.reduce((s, d) => s + (d ? d.paths.length : 0), 0);
    function score() {
      if (!strokes.length) return { score: 0, strokes: 0, expected: expected() };
      const M = 96;
      const mk = fn => { const c = document.createElement('canvas'); c.width = c.height = M; const x = c.getContext('2d'); fn(x); return x.getImageData(0, 0, M, M).data; };
      const Tthick = mk(x => drawGuide(x, M, 11, '#000')), Tthin = mk(x => drawGuide(x, M, 3.5, '#000'));
      const Uthick = mk(x => drawInk(x, M, M * 0.11, '#000')), Uthin = mk(x => drawInk(x, M, M * 0.035, '#000'));
      let u = 0, uIn = 0, t = 0, tIn = 0;
      for (let i = 3; i < Tthick.length; i += 4) { if (Uthin[i] > 40) { u++; if (Tthick[i] > 40) uIn++; } if (Tthin[i] > 40) { t++; if (Uthick[i] > 40) tIn++; } }
      const P = u ? uIn / u : 0, R = t ? tIn / t : 0, f1 = (P + R) ? 2 * P * R / (P + R) : 0;
      let sc = Math.round(Math.max(0, Math.min(1, (f1 - 0.3) / 0.58)) * 100);
      const ex = expected(); if (ex && Math.abs(strokes.length - ex) >= 2) sc = Math.round(sc * 0.88);
      return { score: sc, strokes: strokes.length, expected: ex };
    }
    return {
      ready, score, expected,
      clear() { strokes = []; cur = null; draw(); }, undo() { strokes.pop(); draw(); },
      setGuide(v) { guide = v; draw(); }, toggleGuide() { guide = !guide; draw(); return guide; },
      hasInk: () => strokes.length > 0, redraw: draw, destroy() { ro && ro.disconnect(); },
    };
  }

  function verdict(sc) {
    if (sc >= 90) return { stars: 3, text: 'Tuyệt đỉnh! Chữ chuẩn như sensei', mood: 'love' };
    if (sc >= 70) return { stars: 2, text: 'Đẹp lắm! Thêm chút nữa là hoàn hảo', mood: 'happy' };
    if (sc >= 40) return { stars: 1, text: 'Khá rồi đó! Viết chậm và nhìn kỹ thứ tự nét nha', mood: 'wink' };
    return { stars: 0, text: 'Thử lại nhé, nhìn kỹ thứ tự nét nha', mood: 'sad' };
  }

  SJ.writing = { getStrokes, strokeView, pad, freePad, tracePad: freePad, verdict, _compare: compare, _resample: resample };
})(window.SJ);
