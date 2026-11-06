/* SubelJapan — Nét viết (dữ liệu KanjiVG) + bảng tập viết có chấm điểm */
window.SJ = window.SJ || {};
(function (SJ) {
  const BASE ='https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';
  const mem = {};
  const code = ch => ch.codePointAt(0).toString(16).padStart(5,'0');

  /** Tải dữ liệu nét của 1 ký tự: {paths:[d...], nums:[[x,y]...]} hoặc null */
  function getStrokes(ch) {
    if (mem[ch]) return mem[ch];
    const ck ='sj_kvg_' + ch;
    try { const c = localStorage.getItem(ck); if (c) return (mem[ch] = Promise.resolve(JSON.parse(c))); } catch (e) { }
    mem[ch] = fetch(BASE + code(ch) +'.svg')
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
  const NS ='http://www.w3.org/2000/svg';
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /** Hoạt hình thứ tự nét. text có thể gồm nhiều ký tự (vd: きゃ) */
  function strokeView(el, text, opts) {
    opts = opts || {};
    const chars = Array.from(text).filter(c => c!=='ー' || true);
    el.innerHTML ='';
    el.classList.add('stroke-view');
    const boxes = chars.map(ch => {
      const wrap = document.createElement('div');
      wrap.className ='sv-box' + (chars.length > 1?' multi':'');
      wrap.innerHTML =`<svg viewBox="0 0 109 109"><g class="sv-grid"><rect x="1" y="1" width="107" height="107" rx="10"/><line x1="54.5" y1="4" x2="54.5" y2="105"/><line x1="4" y1="54.5" x2="105" y2="54.5"/></g><text x="54.5" y="70" text-anchor="middle" class="sv-loading">${ch}</text></svg>`;
      el.appendChild(wrap);
      return { ch, svg: wrap.querySelector('svg'), paths: [], nums: [] };
    });
    let token = 0, total = 0;
    const ready = Promise.all(boxes.map(b => getStrokes(b.ch).then(data => {
      const svg = b.svg;
      const ld = svg.querySelector('.sv-loading');
      if (!data) { ld.classList.add('fallback'); b.fail = true; return; }
      ld.remove();
      const bg = document.createElementNS(NS,'g'); bg.setAttribute('class','sv-bg');
      const fg = document.createElementNS(NS,'g'); fg.setAttribute('class','sv-fg');
      const ng = document.createElementNS(NS,'g'); ng.setAttribute('class','sv-num');
      data.paths.forEach((d, i) => {
        const p1 = document.createElementNS(NS,'path'); p1.setAttribute('d', d); bg.appendChild(p1);
        const p2 = document.createElementNS(NS,'path'); p2.setAttribute('d', d); fg.appendChild(p2); b.paths.push(p2);
        if (data.nums[i]) {
          const t = document.createElementNS(NS,'text'); t.setAttribute('x', data.nums[i][0]); t.setAttribute('y', data.nums[i][1]); t.textContent = i + 1; ng.appendChild(t); b.nums.push(t);
        }
      });
      svg.appendChild(bg); svg.appendChild(fg); svg.appendChild(ng);
      total += data.paths.length;
      b.paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = 0; p.dataset.len = L; });
    })));

    async function play() {
      const my = ++token;
      await ready;
      if (my!== token) return;
      // ẩn hết
      boxes.forEach(b => {
        b.paths.forEach(p => { p.style.transition ='none'; p.style.strokeDashoffset = p.dataset.len; p.classList.remove('cur'); });
        b.nums.forEach(n => n.classList.remove('on'));
      });
      await sleep(120);
      const speed = opts.speed || 1;
      for (const b of boxes) {
        for (let i = 0; i < b.paths.length; i++) {
          if (my!== token) return;
          const p = b.paths[i], L = +p.dataset.len;
          const dur = Math.max(260, L * 9) / speed;
          p.getBoundingClientRect();
          p.classList.add('cur');
          p.style.transition =`stroke-dashoffset ${dur}ms cubic-bezier(.4,.1,.6,.9)`;
          p.style.strokeDashoffset = 0;
          if (b.nums[i]) b.nums[i].classList.add('on');
          await sleep(dur + 140 / speed);
          p.classList.remove('cur');
        }
      }
      opts.onDone && opts.onDone();
    }
    function stop() { token++; }
    if (opts.autoplay!== false) play();
    return { play, stop, ready, count: () => total, failed: () => boxes.some(b => b.fail) };
  }

  /** Bảng tập viết: vẽ chữ mờ để tô theo, chấm điểm tự động */
  function tracePad(el, text, opts) {
    opts = opts || {};
    const chars = Array.from(text);
    el.innerHTML ='';
    el.classList.add('pad-wrap');
    const canvas = document.createElement('canvas');
    canvas.className ='pad-canvas';
    el.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    let size = 300;
    let guide = opts.guide!== false;
    let strokes = []; // [[{x,y}]], toạ độ chuẩn hoá 0..1
    let cur = null;
    let data = chars.map(() => null);

    function layout(i, S) {
      const n = chars.length; const cell = S / n;
      return { ox: i * cell, oy: (S - cell) / 2, s: cell / 109, cell };
    }
    function resize() {
      const w = el.clientWidth || opts.size || 300;
      size = Math.min(opts.size || 340, w);
      canvas.style.width = size +'px'; canvas.style.height = size +'px';
      canvas.width = Math.round(size * dpr); canvas.height = Math.round(size * dpr);
      draw();
    }
    const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    function drawGuide(c, S, lw, color, withNums) {
      chars.forEach((ch, i) => {
        const L = layout(i, S); const d = data[i];
        c.save();
        if (d) {
          c.translate(L.ox, L.oy); c.scale(L.s, L.s);
          c.strokeStyle = color; c.lineWidth = lw; c.lineCap ='round'; c.lineJoin ='round';
          d.paths.forEach(p => c.stroke(new Path2D(p)));
          if (withNums) {
            c.fillStyle = css('--ink2') ||'#9a8fa6'; c.font ='600 7px Nunito, sans-serif';
            d.nums.forEach((n, k) => c.fillText(String(k + 1), n[0], n[1]));
          }
        } else {
          c.fillStyle = color; c.strokeStyle = color; c.lineWidth = lw * L.s;
          c.textAlign ='center'; c.textBaseline ='middle';
          c.font =`${Math.round(L.cell * 0.78)}px "Klee One", "M PLUS Rounded 1c", sans-serif`;
          c.fillText(ch, L.ox + L.cell / 2, L.oy + L.cell * 0.54);
          if (lw > 5) c.strokeText(ch, L.ox + L.cell / 2, L.oy + L.cell * 0.54);
        }
        c.restore();
      });
    }
    function drawInk(c, S, lw, color) {
      c.strokeStyle = color; c.lineWidth = lw; c.lineCap ='round'; c.lineJoin ='round';
      strokes.concat(cur? [cur]: []).forEach(st => {
        if (!st.length) return;
        c.beginPath();
        c.moveTo(st[0].x * S, st[0].y * S);
        if (st.length === 1) c.lineTo(st[0].x * S + 0.1, st[0].y * S + 0.1);
        for (let i = 1; i < st.length - 1; i++) {
          const mx = (st[i].x + st[i + 1].x) / 2 * S, my = (st[i].y + st[i + 1].y) / 2 * S;
          c.quadraticCurveTo(st[i].x * S, st[i].y * S, mx, my);
        }
        if (st.length > 1) { const l = st[st.length - 1]; c.lineTo(l.x * S, l.y * S); }
        c.stroke();
      });
    }
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      // nền giấy ô vuông
      ctx.fillStyle = css('--card') ||'#fff';
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = css('--line') ||'#f3dfe7'; ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      chars.forEach((ch, i) => {
        const L = layout(i, size);
        ctx.beginPath();
        ctx.moveTo(L.ox + L.cell / 2, L.oy + 6); ctx.lineTo(L.ox + L.cell / 2, L.oy + L.cell - 6);
        ctx.moveTo(L.ox + 6, L.oy + L.cell / 2); ctx.lineTo(L.ox + L.cell - 6, L.oy + L.cell / 2);
        ctx.stroke();
        if (i > 0) { ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(L.ox, L.oy + 8); ctx.lineTo(L.ox, L.oy + L.cell - 8); ctx.stroke(); ctx.setLineDash([6, 6]); }
      });
      ctx.setLineDash([]);
      if (guide) drawGuide(ctx, size, 6.5,'rgba(255,122,162,.22)', true);
      drawInk(ctx, size, Math.max(5, size * 0.032), css('--ink') ||'#4a3f55');
    }

    // --- vẽ bằng chuột / ngón tay ---
    const pos = e => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
    function down(e) { e.preventDefault(); canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); cur = [pos(e)]; draw(); }
    function move(e) { if (!cur) return; e.preventDefault(); const p = pos(e); const l = cur[cur.length - 1]; if (Math.hypot(p.x - l.x, p.y - l.y) > 0.004) { cur.push(p); draw(); } }
    function up() { if (!cur) return; strokes.push(cur); cur = null; draw(); opts.onStroke && opts.onStroke(strokes.length); }
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', e => { if (cur && e.buttons === 0) up(); });

    const ro = window.ResizeObserver? new ResizeObserver(() => resize()): null;
    ro && ro.observe(el);
    resize();
    const ready = Promise.all(chars.map((ch, i) => getStrokes(ch).then(d => { data[i] = d; }))).then(() => {
      if (document.fonts && document.fonts.load) return document.fonts.load('40px "Klee One"', text).catch(() => { });
    }).then(draw);

    function expected() { return data.reduce((s, d) => s + (d? d.paths.length: 0), 0); }

    /** Chấm điểm: so khớp nét vẽ với chữ mẫu */
    function score() {
      if (!strokes.length) return { score: 0, strokes: 0, expected: expected() };
      const N = 96;
      const mk = (fn) => { const c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'); fn(x); return x.getImageData(0, 0, N, N).data; };
      const Tthick = mk(x => drawGuide(x, N, 11,'#000', false));
      const Tthin = mk(x => drawGuide(x, N, 3.5,'#000', false));
      const Uthick = mk(x => drawInk(x, N, N * 0.11,'#000'));
      const Uthin = mk(x => drawInk(x, N, N * 0.035,'#000'));
      let u = 0, uIn = 0, t = 0, tIn = 0;
      for (let i = 3; i < Tthick.length; i += 4) {
        if (Uthin[i] > 40) { u++; if (Tthick[i] > 40) uIn++; }
        if (Tthin[i] > 40) { t++; if (Uthick[i] > 40) tIn++; }
      }
      const P = u? uIn / u: 0, R = t? tIn / t: 0;
      const f1 = (P + R)? 2 * P * R / (P + R): 0;
      let sc = Math.round(Math.max(0, Math.min(1, (f1 - 0.3) / 0.58)) * 100);
      const ex = expected();
      if (ex && Math.abs(strokes.length - ex) >= 2) sc = Math.round(sc * 0.88);
      return { score: sc, strokes: strokes.length, expected: ex, precision: P, recall: R };
    }

    return {
      ready, score, expected,
      clear() { strokes = []; cur = null; draw(); },
      undo() { strokes.pop(); draw(); },
      setGuide(v) { guide = v; draw(); },
      toggleGuide() { guide =!guide; draw(); return guide; },
      hasInk: () => strokes.length > 0,
      redraw: draw,
      destroy() { ro && ro.disconnect(); },
    };
  }

  /** Lời nhận xét theo điểm */
  function verdict(sc) {
    if (sc >= 85) return { stars: 3, text:'Tuyệt đỉnh! Chữ đẹp như sensei', mood:'love' };
    if (sc >= 70) return { stars: 2, text:'Đẹp lắm! Thêm chút nữa là hoàn hảo', mood:'happy' };
    if (sc >= 50) return { stars: 1, text:'Khá rồi đó! Viết chậm lại một chút nha', mood:'wink' };
    return { stars: 0, text:'Thử lại nhé, nhìn kỹ thứ tự nét nha', mood:'sad' };
  }

  SJ.writing = { getStrokes, strokeView, tracePad, verdict };
})(window.SJ);
