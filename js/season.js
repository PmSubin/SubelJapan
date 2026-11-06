/* SubelJapan — Trang trí: bầu trời theo giờ, hiệu ứng theo mùa, thẻ "của ngày",
 * gợn sóng khi bấm nút, chữ +XP bay lên, vệt sáng trượt theo mục đang chọn ở thanh bên.
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const G = (n, s, c) => SJ.glyph(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const st = () => SJ.store.get().settings;
  const reduced = () => st().motion === 'reduce';

  // ---------- mùa & giờ ----------
  const SEASONS = {
    spring: { jp: '春', vi: 'Mùa xuân', icon: 'sakura' },
    summer: { jp: '夏', vi: 'Mùa hè', icon: 'summer' },
    autumn: { jp: '秋', vi: 'Mùa thu', icon: 'maple' },
    winter: { jp: '冬', vi: 'Mùa đông', icon: 'snow' },
  };
  function season(d) { const m = (d || new Date()).getMonth() + 1; return m >= 3 && m <= 5 ? 'spring' : m <= 8 && m >= 6 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter'; }
  function phase(d) { const h = (d || new Date()).getHours(); return h < 5 ? 'night' : h < 10 ? 'morning' : h < 16 ? 'day' : h < 19 ? 'evening' : 'night'; }
  const WEEKDAY = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];
  const dayNum = () => { const d = new Date(); return Math.floor((d - d.getTimezoneOffset() * 60000) / 864e5); };

  // ---------- hình vẽ nhỏ cho hiệu ứng mùa ----------
  const LEAF = c => `<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M20 3 l3.6 8.4 7.6-4.2-1.8 8.6 8.2 1.4-6.4 5.6 4.4 6.4-8.4-1-1.4 8.6-5.8-6.2-5.8 6.2-1.4-8.6-8.4 1 4.4-6.4-6.4-5.6 8.2-1.4-1.8-8.6 7.6 4.2z" fill="${c}" stroke="rgba(120,40,20,.35)" stroke-width="1.4" stroke-linejoin="round"/><path d="M20 12 V37 M20 22 l-7 -5 M20 22 l7 -5 M20 28 l-5 2 M20 28 l5 2" stroke="rgba(120,40,20,.35)" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>`;
  const GINKGO = c => `<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M20 36 C 19 30 19 26 20 22 C 10 22 4 14 6 6 C 12 9 16 8 20 4 C 24 8 28 9 34 6 C 36 14 30 22 20 22" fill="${c}" stroke="rgba(130,90,0,.35)" stroke-width="1.4" stroke-linejoin="round"/><path d="M20 22 V8" stroke="rgba(130,90,0,.3)" stroke-width="1.2"/></svg>`;
  const PETAL = c => `<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M20 4 C 30 10 34 22 26 33 C 23 37 17 37 14 33 C 6 22 10 10 18 6 L20 11 Z" fill="${c}" stroke="rgba(200,70,110,.3)" stroke-width="1.4" stroke-linejoin="round"/><path d="M20 14 C 19 20 19 26 20 31" stroke="rgba(255,255,255,.8)" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
  const FLAKE = c => `<svg viewBox="0 0 40 40" width="100%" height="100%"><g stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none"><path d="M20 4 V36 M6 12 L34 28 M6 28 L34 12"/><path d="M15 6 l5 4 5-4 M15 34 l5-4 5 4 M5 18 l6 1.5-2 5 M35 18 l-6 1.5 2 5" stroke-width="2.4"/></g><circle cx="20" cy="20" r="4" fill="#fff" stroke="${c}" stroke-width="2"/></svg>`;
  const SEED = c => `<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M20 22 V38" stroke="rgba(110,130,90,.55)" stroke-width="1.6" stroke-linecap="round"/><g stroke="${c}" stroke-width="1.8" stroke-linecap="round"><path d="M20 21 L20 6 M20 21 L9 10 M20 21 L31 10 M20 21 L6 20 M20 21 L34 20 M20 21 L13 5 M20 21 L27 5"/></g><g fill="${c}"><circle cx="20" cy="6" r="2.2"/><circle cx="9" cy="10" r="2.2"/><circle cx="31" cy="10" r="2.2"/><circle cx="6" cy="20" r="2.2"/><circle cx="34" cy="20" r="2.2"/><circle cx="13" cy="5" r="2"/><circle cx="27" cy="5" r="2"/></g></svg>`;
  const FX = {
    autumn: () => U().pick([LEAF('#ff7a59'), LEAF('#f25c54'), LEAF('#ffa94d'), GINKGO('#ffcf4d'), LEAF('#e8613c'), GINKGO('#ffd970')]),
    spring: () => U().pick([PETAL('#ffc4d6'), PETAL('#ffb0c8'), PETAL('#ffd9e4')]),
    winter: () => U().pick([FLAKE('#a9cff7'), FLAKE('#c3dcfb'), FLAKE('#9bc3f0')]),
    summer: () => U().pick([SEED('#ffffff'), SEED('#fff3c4'), SEED('#d8f1ff')]),
  };

  let layer = null;
  function mountSeason() {
    const on = st().season !== false && !reduced();
    if (!on) { if (layer) { layer.remove(); layer = null; } return; }
    const s = season();
    if (layer && layer.dataset.s === s) return;
    if (layer) layer.remove();
    layer = document.createElement('div');
    layer.className = 'season s-' + s; layer.dataset.s = s; layer.setAttribute('aria-hidden', 'true');
    const n = window.innerWidth < 760 ? 7 : 12;
    let html = '';
    for (let i = 0; i < n; i++) {
      const size = 16 + Math.random() * 16, dur = 13 + Math.random() * 12;
      html += `<i class="sf" style="--x:${(i + Math.random()) / n * 100}vw;--s:${size}px;--d:${dur}s;--w:${-Math.random() * dur}s;--sw:${20 + Math.random() * 50}px;--r:${Math.random() < .5 ? -1 : 1}"><b>${FX[s]()}</b></i>`;
    }
    layer.innerHTML = html;
    document.body.appendChild(layer);
  }

  // ---------- bầu trời ở lời chào trang chủ ----------
  function skyHTML() {
    const p = phase(), s = season(), S = SEASONS[s], d = new Date();
    let stars = '';
    if (p === 'night' || p === 'evening') for (let i = 0; i < (p === 'night' ? 16 : 6); i++) stars += `<i class="sk-star" style="--x:${(Math.random() * 96 + 2).toFixed(1)}%;--y:${(Math.random() * 46 + 4).toFixed(1)}%;--d:${(1.6 + Math.random() * 2.4).toFixed(2)}s;--z:${(.6 + Math.random() * .8).toFixed(2)}"></i>`;
    const tree = s === 'autumn' ? '#ff8a5c' : s === 'spring' ? '#ffb3cb' : s === 'winter' ? '#eaf3ff' : '#8fd18a';
    return `<div class="hello-sky sk-${p} sn-${s}" aria-hidden="true">
      <div class="sk-orb">${p === 'night' ? '<i class="sk-crater a"></i><i class="sk-crater b"></i>' : ''}</div>${stars}
      <span class="sk-cloud c1"></span><span class="sk-cloud c2"></span><span class="sk-cloud c3"></span>
      <svg class="sk-fuji" viewBox="0 0 220 90" preserveAspectRatio="xMidYMax meet"><path class="m" d="M0 90 L82 18 Q110 -4 138 18 L220 90 Z"/><path class="snow" d="M72 27 L82 18 Q110 -4 138 18 L148 27 Q140 34 132 27 Q124 36 116 28 Q108 36 100 28 Q92 35 86 28 Q79 34 72 27 Z"/></svg>
      <svg class="sk-land" viewBox="0 0 800 70" preserveAspectRatio="none"><path class="h2" d="M0 40 Q110 14 230 34 T470 30 T800 22 V70 H0 Z"/><path class="h1" d="M0 56 Q170 34 330 50 T650 46 T800 40 V70 H0 Z"/></svg>
      <svg class="sk-tree" viewBox="0 0 60 70"><path d="M28 70 q2 -14 0 -26 h5 q-2 12 1 26 Z" fill="#a46b45"/><circle cx="20" cy="34" r="13" fill="${tree}"/><circle cx="40" cy="34" r="13" fill="${tree}"/><circle cx="30" cy="22" r="15" fill="${tree}"/><circle cx="24" cy="26" r="3" fill="rgba(255,255,255,.45)"/></svg>
      <svg class="sk-torii" viewBox="0 0 70 60"><path d="M4 12 Q35 4 66 12 L64 18 Q35 11 6 18 Z" fill="#e94d4d"/><rect x="10" y="22" width="50" height="5" rx="1.5" fill="#e94d4d"/><rect x="15" y="16" width="6" height="44" rx="2" fill="#e94d4d"/><rect x="49" y="16" width="6" height="44" rx="2" fill="#e94d4d"/><rect x="31" y="18" width="8" height="6" fill="#c73a3a"/></svg>
      <span class="sk-date"><b>${d.getDate()}/${d.getMonth() + 1}</b> ${WEEKDAY[d.getDay()]} · <span class="jp">${WEEKDAY_JP[d.getDay()]}よう日</span></span>
      <span class="sk-season">${I(S.icon, 22)}<span class="jp">${S.jp}</span>${S.vi}</span>
    </div>`;
  }

  // ---------- thẻ "của ngày" ----------
  function todayHTML() {
    const n = dayNum();
    const V = SJ.VOCAB_ALL || [], K = SJ.KANJI || [];
    const v = V.length ? V[(n * 37) % V.length] : null;
    const k = K.length ? K[(n * 13) % K.length] : null;
    const ex = k && k.ex && k.ex[0];
    const ask = v ? encodeURIComponent(`Dạy mình cách dùng từ ${v.jp} (${v.vi}) với vài câu ví dụ thật dễ nhé`) : '';
    return `<div class="today-row">
      ${v ? `<div class="card td-card td-word"><div class="td-label">${G('sparkle', 16)} Từ của ngày</div>
        <div class="td-main"><span class="td-ico">${I(v.e, 58)}</span><div class="grow"><div class="td-jp jp">${esc(v.jp)}</div><div class="td-r">${esc(v.r)}</div><div class="td-vi">${esc(v.vi)}</div></div></div>
        <div class="td-acts"><button class="btn btn-sm btn-white" data-say="${esc(v.jp)}">${G('speaker', 18)} Nghe</button><a class="btn btn-sm btn-soft" href="#/sensei/chat:${ask}">${I('sensei', 20)} Hỏi Mochi</a></div></div>` : ''}
      ${k ? `<div class="card td-card td-kanji"><div class="td-label">${G('book', 16)} Chữ Hán của ngày</div>
        <div class="td-main"><span class="td-big kanji-glyph jp">${esc(k.k)}</span><div class="grow"><div class="td-hv">${esc(k.hv)}</div><div class="td-vi">${esc(k.m)}</div>${ex ? `<div class="td-ex"><span class="jp">${esc(ex.jp)}</span> <small>${esc(ex.kana)} · ${esc(ex.vi)}</small></div>` : ''}</div></div>
        <div class="td-acts"><button class="btn btn-sm btn-white" data-say="${esc(ex ? ex.kana : k.kun || k.k)}">${G('speaker', 18)} Nghe</button><a class="btn btn-sm btn-soft" href="#/write/${encodeURIComponent(k.k)}">${G('pencil', 18)} Tập viết</a></div></div>` : ''}
      <a class="card td-card td-sensei" href="#/sensei"><div class="td-label">${I('sensei', 18)} Gia sư AI</div>
        <div class="td-main"><span class="tds-mochi">${U().mascot('happy', 70, 'bob', { acc: 'acc_grad' })}</span><div class="grow"><b>Sensei Mochi</b><small>Hỏi gì cũng được, luyện nói nhập vai, sửa câu tiếng Nhật cho bạn.</small></div></div>
        <div class="tds-chips"><span>${I('talk', 20)} Nhập vai</span><span>${G('pencil', 16)} Sửa câu</span><span>${I('speech', 20)} Hỏi đáp</span></div></a>
    </div>`;
  }

  // ---------- gợn sóng khi bấm nút ----------
  document.addEventListener('pointerdown', e => {
    if (reduced() || e.button) return;
    const b = e.target.closest('.btn, .chip-btn, .ss-modes button, .ag-tp, .ag-lv, .ss-scene, .ai-sugg');
    if (!b || b.disabled) return;
    if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
    const r = b.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2;
    const wrap = document.createElement('span'); wrap.className = 'rp-wrap';
    const dot = document.createElement('span'); dot.className = 'rp';
    dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    wrap.appendChild(dot); b.appendChild(wrap);
    setTimeout(() => wrap.remove(), 650);
  }, { passive: true });

  // ---------- +XP bay lên ----------
  let pt = { x: innerWidth / 2, y: innerHeight / 2 };
  document.addEventListener('pointerdown', e => { pt = { x: e.clientX, y: e.clientY }; }, { capture: true, passive: true });
  SJ.on('xp', d => {
    if (!d || !d.n || d.n < 0 || reduced()) return;
    const el = document.createElement('div');
    el.className = 'xp-float';
    el.innerHTML = `${I('star', 22)}<b>+${d.n}</b> XP`;
    el.style.left = Math.min(innerWidth - 90, Math.max(10, pt.x - 30)) + 'px';
    el.style.top = Math.max(60, pt.y - 40) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  });

  // ---------- vệt sáng trượt theo mục đang chọn ở thanh bên ----------
  let blob = null;
  function moveBlob() {
    const side = document.getElementById('side'), nav = document.getElementById('nav');
    if (!side || !nav) return;
    if (!blob) { blob = document.createElement('div'); blob.className = 'nav-blob'; side.insertBefore(blob, side.firstChild); }
    const a = nav.querySelector('a.active');
    if (!a || !a.offsetParent) { blob.classList.remove('on'); return; }
    const first = !blob.classList.contains('on');
    if (first) blob.style.transition = 'none';
    blob.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`;
    blob.style.width = a.offsetWidth + 'px'; blob.style.height = a.offsetHeight + 'px';
    blob.classList.add('on');
    side.classList.add('has-blob');
    if (first) { void blob.offsetWidth; blob.style.transition = ''; }
  }
  function watchNav() {
    const nav = document.getElementById('nav'); if (!nav) return;
    new MutationObserver(() => requestAnimationFrame(moveBlob)).observe(nav, { childList: true });
    addEventListener('resize', () => { moveBlob(); });
    moveBlob();
  }

  // ---------- khởi động ----------
  function boot() {
    mountSeason(); watchNav();
    SJ.on('settings', k => { if (k === 'season' || k === 'motion') mountSeason(); });
    let lastPhase = phase();
    setInterval(() => { const p = phase(); if (p !== lastPhase) { lastPhase = p; const sky = document.querySelector('.hello-sky'); if (sky) { const t = document.createElement('div'); t.innerHTML = skyHTML(); sky.replaceWith(t.firstElementChild); } } mountSeason(); }, 60000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);

  SJ.deco = { skyHTML, todayHTML, season, phase, SEASONS, particle: () => FX[season()]() };
})(window.SJ);
