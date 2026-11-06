/* SubelJapan — Tiện ích giao diện: mèo Mochi (vẽ tay, có phụ kiện), toast, modal, confetti, thanh tiến độ… */
window.SJ = window.SJ || {};
(function (SJ) {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const sample = (a, n) => shuffle(a).slice(0, n);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const I = (n, s, c) => SJ.icon(n, s, c);

  // =====================================================================
  //  MÈO MOCHI — bánh mochi biết nói, có nhiều "vị" (màu lông) & phụ kiện
  // =====================================================================
  const INK = '#3f2f4c';
  const FURS = {
    fur_white: { name: 'Mochi trắng', fur: '#ffffff', shade: '#fff0f5', ear: '#ffc4d4' },
    fur_sakura: { name: 'Vị hoa anh đào', fur: '#ffdbe6', shade: '#ffc9d8', ear: '#ff9fbb' },
    fur_matcha: { name: 'Vị trà xanh', fur: '#d6efc3', shade: '#c3e4aa', ear: '#ffc4d4' },
    fur_ube: { name: 'Vị khoai môn', fur: '#e4d8ff', shade: '#d4c4fb', ear: '#ffc4d4' },
    fur_kinako: { name: 'Vị bột đậu', fur: '#f6dcae', shade: '#ecca8f', ear: '#ffb8a8' },
    fur_goma: { name: 'Vị mè đen', fur: '#6e6079', shade: '#5c4f67', ear: '#ffaec4', dark: true },
    fur_calico: { name: 'Mèo tam thể', fur: '#ffffff', shade: '#fff0f5', ear: '#ffc4d4', calico: true },
  };
  const L = (d, w, c) => `<path d="${d}" fill="none" stroke="${c || INK}" stroke-width="${w || 3}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const S = (d, fill, w) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w || 2.6}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const flower = (x, y, s, col) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map(a => `<path d="M0 0 C-4 -2.2 -4.8 -7.4 -2.3 -10 L0 -8.3 L2.3 -10 C4.8 -7.4 4 -2.2 0 0Z" transform="rotate(${a})" fill="${col || '#ffc4d4'}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`).join('')}<circle r="2" fill="#ffd85e"/></g>`;

  function eyesFor(mood, dark) {
    const iris = dark ? '#ffd85e' : INK;
    const dot = x => dark
      ? `<ellipse cx="${x}" cy="73" rx="6" ry="7.2" fill="${iris}" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${x}" cy="73.5" rx="2.4" ry="5" fill="${INK}"/><circle cx="${x + 2.2}" cy="70" r="1.9" fill="#fff"/>`
      : `<ellipse cx="${x}" cy="73" rx="5.8" ry="7" fill="${INK}"/><circle cx="${x + 2.1}" cy="69.8" r="2.5" fill="#fff"/><circle cx="${x - 1.9}" cy="76.4" r="1.2" fill="#fff" opacity=".9"/>`;
    const lc = dark ? '#fff' : INK;
    switch (mood) {
      case 'happy': case 'cheer': return L('M37 75 q7 -9 14 0', 3.2, lc) + L('M69 75 q7 -9 14 0', 3.2, lc);
      case 'wow': return `<circle cx="44" cy="72" r="7.6" fill="${INK}"/><circle cx="46.6" cy="69" r="2.8" fill="#fff"/><circle cx="41.8" cy="75.6" r="1.3" fill="#fff"/><circle cx="76" cy="72" r="7.6" fill="${INK}"/><circle cx="78.6" cy="69" r="2.8" fill="#fff"/><circle cx="73.8" cy="75.6" r="1.3" fill="#fff"/>`;
      case 'sad': return `<ellipse cx="44" cy="75" rx="4.8" ry="5.6" fill="${INK}"/><circle cx="45.6" cy="73" r="1.8" fill="#fff"/><ellipse cx="76" cy="75" rx="4.8" ry="5.6" fill="${INK}"/><circle cx="77.6" cy="73" r="1.8" fill="#fff"/>` + L('M36 65 l9 2.6', 2.6, lc) + L('M84 65 l-9 2.6', 2.6, lc) + `<path d="M38 82 q-3.6 6.4 0 8.8 q3.6 -2.4 0 -8.8z" fill="#8fd0ff" stroke="${INK}" stroke-width="1.5"/>`;
      case 'wink': return dot(44) + L('M69 75 q7 -9 14 0', 3.2, lc);
      case 'love': return `<path d="M44 80 l-7.2 -7.2 a4.2 4.2 0 0 1 7.2 -4.8 a4.2 4.2 0 0 1 7.2 4.8z" fill="#ff6b8e" stroke="${INK}" stroke-width="2"/><path d="M76 80 l-7.2 -7.2 a4.2 4.2 0 0 1 7.2 -4.8 a4.2 4.2 0 0 1 7.2 4.8z" fill="#ff6b8e" stroke="${INK}" stroke-width="2"/>`;
      case 'sleep': return L('M37 73 q7 5.5 14 0', 3, lc) + L('M69 73 q7 5.5 14 0', 3, lc);
      case 'think': return dot(44) + dot(76) + L('M36 63 q7 -4 13 0', 2.4, lc);
      default: return `<g class="m-blink">${dot(44) + dot(76)}</g>`;
    }
  }
  function mouthFor(mood, dark) {
    const lc = dark ? '#fff' : INK;
    if (mood === 'wow') return `<ellipse cx="60" cy="88" rx="5" ry="6" fill="${INK}"/><ellipse cx="60" cy="90.6" rx="3" ry="2.4" fill="#ff8fae"/>`;
    if (mood === 'sad') return L('M53 90 q7 -6 14 0', 2.6, lc);
    if (mood === 'happy' || mood === 'love' || mood === 'cheer') return `<path d="M52.5 84 q7.5 10 15 0 z" fill="#ff8fae" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
    if (mood === 'sleep') return `<ellipse cx="60" cy="87" rx="2.6" ry="2" fill="${lc}"/>`;
    return L('M52 84 q4 4.6 8 0 q4 4.6 8 0', 2.6, lc);
  }
  function accFront(acc) {
    switch (acc) {
      case 'acc_bow': return S('M84 34 q-14 -13 -16 -1 q-1 10 16 1 Z', '#ff8fb0') + S('M84 34 q14 -13 16 -1 q1 10 -16 1 Z', '#ff8fb0') + S('M82 36 l-6 12 l5 -1 l2 4 l2 -14', '#ff8fb0', 2) + S('M86 36 l6 12 l-5 -1 l-2 4 l-2 -14', '#ff8fb0', 2) + `<circle cx="84" cy="34.5" r="4.2" fill="#ffc4d4" stroke="${INK}" stroke-width="2.2"/>` + L('M72 30 q2 -3 5 -3', 2, '#fff');
      case 'acc_hachimaki': return S('M14 58 Q60 38 106 58 L105.5 66 Q60 47 14.5 66 Z', '#ffffff', 2.4) + `<circle cx="60" cy="51" r="5.6" fill="#ff5a6e" stroke="${INK}" stroke-width="2"/>` + S('M104 60 L118 52 L116 66 Z', '#ffffff', 2.2) + S('M104 63 L117 70 L109 74 Z', '#ffffff', 2.2);
      case 'acc_glasses': return `<circle cx="44" cy="73" r="11" fill="rgba(255,255,255,.28)" stroke="${INK}" stroke-width="2.8"/><circle cx="76" cy="73" r="11" fill="rgba(255,255,255,.28)" stroke="${INK}" stroke-width="2.8"/>` + L('M55 71 q5 -3.4 10 0', 2.6) + L('M33 70 l-11 -3 M87 70 l11 -3', 2.4) + L('M38 66 q3 -2 6 -1.6', 1.8, '#fff');
      case 'acc_scarf': return S('M17 95 Q60 113 103 95 L101 105 Q60 122 19 105 Z', '#ff6b6b') + S('M30 102 L23 118 L33 116 L38 104', '#ff6b6b', 2.4) + L('M40 104 q2 6 0 10 M80 104 q-2 6 0 10', 2, 'rgba(255,255,255,.7)');
      case 'acc_leaf': return S('M60 6 C78 10 80 28 64 36 C52 28 48 14 60 6 Z', '#7ccf6a') + L('M63 34 C61 24 60 16 60 7', 2.2) + L('M61 18 l-6 -3 M61 25 l6 -3', 1.8) + L('M64 36 l4 5', 2.4);
      case 'acc_beret': return S('M25 42 C21 26 42 16 62 18 C84 20 98 30 92 42 C76 46 42 48 25 42 Z', '#9b7bff') + S('M58 18 q1 -7 6 -6', '#9b7bff', 2.6) + L('M34 34 q10 -9 24 -10', 2.2, 'rgba(255,255,255,.55)');
      case 'acc_kasa': return S('M10 40 L60 10 L110 40 Q60 50 10 40 Z', '#f3d68f') + L('M60 10 L44 43 M60 10 L76 43 M60 10 L28 41 M60 10 L92 41', 1.6, '#c9a45a') + S('M54 12 q6 -6 12 0 z', '#e0b864', 2) + L('M22 46 q4 14 14 20 M98 46 q-4 14 -14 20', 1.6, '#c9a45a');
      case 'acc_frog': return S('M20 48 C17 28 38 17 60 17 C82 17 103 28 100 48 C82 41 38 41 20 48 Z', '#8fdc7a') + `<circle cx="40" cy="20" r="9.5" fill="#8fdc7a" stroke="${INK}" stroke-width="2.6"/><circle cx="80" cy="20" r="9.5" fill="#8fdc7a" stroke="${INK}" stroke-width="2.6"/><circle cx="40" cy="20" r="5.2" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="80" cy="20" r="5.2" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="41" cy="21" r="2.6" fill="${INK}"/><circle cx="81" cy="21" r="2.6" fill="${INK}"/><ellipse cx="30" cy="38" rx="4" ry="2.4" fill="#ff9fbb" opacity=".8"/><ellipse cx="90" cy="38" rx="4" ry="2.4" fill="#ff9fbb" opacity=".8"/>` + L('M50 34 q10 6 20 0', 2.4);
      case 'acc_crown': return S('M38 36 L39 14 L50 25 L60 9 L70 25 L81 14 L82 36 Z', '#ffd24a') + S('M38 33 Q60 39 82 33 L82 38 Q60 44 38 38 Z', '#ffab3c', 2.2) + `<circle cx="60" cy="9" r="3" fill="#ff6b8e" stroke="${INK}" stroke-width="1.8"/><circle cx="39" cy="13" r="2.6" fill="#7cc3ff" stroke="${INK}" stroke-width="1.6"/><circle cx="81" cy="13" r="2.6" fill="#7cc3ff" stroke="${INK}" stroke-width="1.6"/><circle cx="60" cy="27" r="3.2" fill="#ff6b8e" stroke="${INK}" stroke-width="1.8"/>` + L('M45 30 l3 -8', 2, 'rgba(255,255,255,.8)');
      case 'acc_grad': return S('M38 26 V38 Q60 47 82 38 V26', '#4a3d5c') + S('M60 10 L100 24 L60 38 L20 24 Z', '#5b4b6e') + `<circle cx="60" cy="24" r="2.6" fill="#ffd24a" stroke="${INK}" stroke-width="1.6"/>` + L('M60 24 Q84 28 92 40', 2.2, '#ffd24a') + S('M89 39 l3 10 l4 -9 Z', '#ffd24a', 1.8);
      case 'acc_sakura': return flower(87, 33, 1.05);
      default: return '';
    }
  }
  function look() {
    try { const S0 = SJ.store && SJ.store.get(); if (S0) return { fur: S0.fur || 'fur_white', acc: S0.equip || 'acc_sakura' }; } catch (e) { }
    return { fur: 'fur_white', acc: 'acc_sakura' };
  }
  /** mascot(mood, size, extraClass, {fur, acc}) */
  function mascot(mood, size, extra, lk) {
    size = size || 120; mood = mood || 'normal';
    lk = Object.assign(look(), lk || {});
    const F = FURS[lk.fur] || FURS.fur_white;
    const acc = lk.acc === 'acc_none' ? '' : lk.acc;
    const dark = !!F.dark;
    const calico = F.calico ? `<path d="M24 54 C27 40 40 34 52 35 C50 45 38 54 24 54 Z" fill="#ffb066"/><path d="M78 36 C92 38 103 48 104 62 C94 60 82 50 78 36 Z" fill="#6e6079"/><path d="M14 84 C20 94 30 100 38 100 C34 92 24 84 14 84 Z" fill="#ffb066"/>` : '';
    const whisk = dark ? 'rgba(255,255,255,.55)' : 'rgba(63,47,76,.5)';
    const paws = (y, s) => `<g class="m-paws"><g class="m-paw l">${S(`M${38 + s} ${y} q0 -7 8.5 -7 q8.5 0 8.5 7 q0 5 -8.5 5 q-8.5 0 -8.5 -5 Z`, F.fur, 2.4)}${L(`M${46.5 + s} ${y - 1} v4`, 1.6, whisk)}</g><g class="m-paw r">${S(`M${65 - s} ${y} q0 -7 8.5 -7 q8.5 0 8.5 7 q0 5 -8.5 5 q-8.5 0 -8.5 -5 Z`, F.fur, 2.4)}${L(`M${73.5 - s} ${y - 1} v4`, 1.6, whisk)}</g></g>`;
    return `<svg class="mascot mood-${mood} ${extra || ''}" viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true">
      <ellipse cx="60" cy="114" rx="34" ry="4" fill="rgba(63,47,76,.10)"/>
      <g class="m-body">
      <g class="m-tail"><path d="M93 103 C112 106 117 86 107 76" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M93 103 C112 106 117 86 107 76" fill="none" stroke="${F.fur}" stroke-width="4.6" stroke-linecap="round"/></g>
      <g class="m-ear l">${S('M23 54 L25 22 Q26 14 33 18 L53 34 Z', F.fur, 3)}<path d="M30 27 L31 41 L43 35 Z" fill="${F.ear}"/></g>
      <g class="m-ear r">${S('M97 54 L95 22 Q94 14 87 18 L67 34 Z', F.fur, 3)}<path d="M90 27 L89 41 L77 35 Z" fill="${F.ear}"/></g>
      <path d="M60 30 C89 30 108 48 108 76 C108 100 90 110 60 110 C30 110 12 100 12 76 C12 48 31 30 60 30 Z" fill="${F.fur}" stroke="${INK}" stroke-width="3"/>
      ${calico}
      <path d="M26 100 C40 108 80 108 94 100 C86 106 74 109 60 109 C46 109 34 106 26 100 Z" fill="${F.shade}"/>
      <path d="M30 46 q8 -8 20 -10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="${dark ? .25 : .9}"/>
      <g class="m-face">${eyesFor(mood, dark)}
      <ellipse cx="31" cy="86" rx="7.6" ry="4.6" fill="#ffadc2" opacity=".85"/><ellipse cx="89" cy="86" rx="7.6" ry="4.6" fill="#ffadc2" opacity=".85"/>
      <path d="M57.4 80.6 h5.2 l-2.6 2.8z" fill="#ff8fae" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>
      ${mouthFor(mood, dark)}
      ${L('M7 77 L21 80 M8 86 L21 85', 1.8, whisk)}${L('M113 77 L99 80 M112 86 L99 85', 1.8, whisk)}</g>
      ${acc === 'acc_scarf' ? '' : paws(104, 0)}
      ${accFront(acc)}
      ${acc === 'acc_scarf' ? paws(107, 1.5) : ''}
      ${mood === 'sleep' ? `<text x="100" y="40" font-size="16" font-weight="900" fill="${INK}" font-family="Nunito">z</text><text x="110" y="27" font-size="11" font-weight="900" fill="${INK}" font-family="Nunito">z</text>` : ''}
      ${mood === 'cheer' || mood === 'love' ? `<path d="M10 40 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" fill="#ffd85e" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/><path d="M108 46 l1.5 3.6 l3.6 1.5 l-3.6 1.5 l-1.5 3.6 l-1.5 -3.6 l-3.6 -1.5 l3.6 -1.5z" fill="#ffd85e" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>` : ''}
      </g></svg>`;
  }
  function mascotSay(text, mood, size) {
    return `<div class="mochi-say"><button class="mochi-wrap" data-meow aria-label="Mochi">${mascot(mood || 'happy', size || 84, 'bob')}</button><div class="bubble">${text}</div></div>`;
  }

  // ---------- Toast ----------
  function toast(html, ms) {
    let root = $('#toast-root');
    if (!root) { root = document.createElement('div'); root.id = 'toast-root'; document.body.appendChild(root); }
    const t = document.createElement('div');
    t.className = 'toast'; t.innerHTML = html;
    root.appendChild(t);
    while (root.children.length > 3) root.firstChild.remove();
    const show = () => t.classList.add('show'); requestAnimationFrame(show); setTimeout(show, 60);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, ms || 2600);
  }

  // ---------- Confetti: giấy màu + sao + hoa ----------
  function confetti(n) {
    if (SJ.store && SJ.store.get().settings.motion === 'reduce') return;
    n = n || 80;
    const colors = ['#ff8fb0', '#ffd85e', '#7fe0b4', '#7cc3ff', '#b9a1ff', '#ffab5c', '#ff6b8e'];
    const box = document.createElement('div'); box.className = 'confetti';
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      if (i % 7 === 0) { p.innerHTML = I(i % 14 === 0 ? 'star' : 'sakura', 22); p.className = 'shape'; }
      else { p.style.background = pick(colors); const s = 7 + Math.random() * 7; p.style.width = s + 'px'; p.style.height = (s * (Math.random() > .5 ? .6 : 1.5)) + 'px'; p.style.borderRadius = Math.random() > .6 ? '50%' : '3px'; }
      p.style.left = Math.random() * 100 + 'vw';
      p.style.setProperty('--dx', (Math.random() * 220 - 110) + 'px');
      p.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
      p.style.animationDuration = (1.9 + Math.random() * 1.7) + 's';
      p.style.animationDelay = (Math.random() * 0.35) + 's';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4300);
  }

  // ---------- Modal ----------
  function modal(html, opts) {
    opts = opts || {};
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `<div class="modal ${opts.cls || ''}" role="dialog" aria-modal="true">${opts.noClose ? '' : `<button class="modal-x" aria-label="Đóng">${I('batsu', 18)}</button>`}<div class="modal-body">${html}</div></div>`;
    document.body.appendChild(back);
    const show = () => back.classList.add('show'); requestAnimationFrame(show); setTimeout(show, 60);
    const close = (v) => {
      if (!back.parentNode) return;
      back.classList.remove('show');
      setTimeout(() => back.remove(), 250);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onHash);
      opts.onClose && opts.onClose(v);
    };
    const onKey = e => { if (e.key === 'Escape' && !opts.noClose) close(); };
    const onHash = () => close();
    document.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onHash);
    back.addEventListener('click', e => { if ((e.target === back && !opts.noClose) || e.target.closest('.modal-x')) close(); });
    return { el: $('.modal-body', back), close };
  }
  function confirmBox(text, okLabel, cancelLabel) {
    return new Promise(res => {
      let answered = false;
      const m = modal(`<div class="center">${mascot('wow', 96)}<p class="confirm-text">${text}</p>
        <div class="row center-row gap wrap"><button class="btn btn-white" data-v="0">${cancelLabel || 'Ở lại học tiếp'}</button><button class="btn btn-red" data-v="1">${okLabel || 'Đồng ý'}</button></div></div>`,
        { cls: 'modal-sm', onClose: () => { if (!answered) res(false); } });
      m.el.addEventListener('click', e => {
        const b = e.target.closest('[data-v]'); if (!b) return;
        answered = true; res(b.dataset.v === '1'); m.close();
      });
    });
  }

  // ---------- Thành phần nhỏ ----------
  const stars = (n, max, size) => { max = max || 3; let s = ''; for (let i = 0; i < max; i++) s += `<span class="star ${i < n ? 'on' : ''}">${I('star', size || 22)}</span>`; return `<span class="stars">${s}</span>`; };
  const ring = (pct, size, inner, color) => {
    size = size || 64; const r = size / 2 - 6, c = 2 * Math.PI * r, off = c * (1 - clamp(pct, 0, 100) / 100);
    return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" style="stroke:${color || 'var(--pri)'};stroke-dasharray:${c};stroke-dashoffset:${off}"/></svg><div class="ring-in">${inner || ''}</div></div>`;
  };
  const bar = (pct, cls) => `<div class="bar ${cls || ''}"><i style="width:${clamp(pct, 0, 100)}%"></i></div>`;
  const sayBtn = (text, size) => `<button class="say-btn" data-say="${esc(text)}" title="Nghe phát âm" aria-label="Nghe">${I('speaker', size || 22)}</button>`;
  const hanko = (txt, cls) => `<span class="hanko ${cls || ''}"><span class="jp">${txt}</span></span>`;
  const lbl = (icon, text, size) => `<span class="lbl">${I(icon, size || 20)}<span>${text}</span></span>`;
  const fish = (n, size) => `<span class="price">${I('fishcoin', size || 20)}${n}</span>`;

  /** Số chạy từ 0 → giá trị: <b data-count="80" data-suf="%"> */
  function countUp(root) {
    $$('[data-count]', root).forEach((el, k) => {
      const end = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
      const t0 = performance.now() + k * 120, dur = 900;
      const tick = now => {
        const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(end * e) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = pre + '0' + suf;
      requestAnimationFrame(tick);
      setTimeout(() => { el.textContent = pre + end + suf; }, dur + k * 120 + 400);
    });
  }

  // ---------- Furigana: "{漢字|かんじ}" ----------
  const FURI = /\{([^|{}]+)\|([^{}]+)\}/g;
  const ruby = s => esc(s).replace(/\{([^|{}]+)\|([^{}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>');
  const reading = s => String(s || '').replace(FURI, '$2');
  const baseText = s => String(s || '').replace(FURI, '$1');

  // Bấm vào phần tử có data-say để nghe; bấm Mochi để nghe "nya~"
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-say]');
    if (b && !b.disabled) { SJ.audio.speak(b.dataset.say); b.classList.remove('speaking'); void b.offsetWidth; b.classList.add('speaking'); }
    const m = e.target.closest('[data-meow], .mascot');
    if (m && !b && !m.closest('.pet')) { SJ.audio.sfx(Math.random() < .5 ? 'meow' : 'meow2'); const svg = m.matches('svg') ? m : m.querySelector('svg'); if (svg) { svg.classList.remove('squish'); void svg.getBoundingClientRect(); svg.classList.add('squish'); } }
  });

  // ---------- Đổi tên sang Katakana ----------
  let ROMA = null;
  function romaTable() {
    if (ROMA) return ROMA;
    ROMA = {};
    SJ.KANA_ALL.forEach(o => { if (o.script === 'kata' && o.group !== 'small' && o.r !== 'wo' && !(o.k === 'ヂ' || o.k === 'ヅ')) { if (!ROMA[o.r]) ROMA[o.r] = o.k; } });
    Object.assign(ROMA, {
      o: 'オ', si: 'シ', ti: 'ティ', tu: 'トゥ', hu: 'フ', zi: 'ジ', di: 'ディ', du: 'ドゥ', wi: 'ウィ', we: 'ウェ', wo: 'ウォ',
      fa: 'ファ', fi: 'フィ', fe: 'フェ', fo: 'フォ', va: 'ヴァ', vi: 'ヴィ', vu: 'ヴ', ve: 'ヴェ', vo: 'ヴォ', she: 'シェ', je: 'ジェ', che: 'チェ',
      la: 'ラ', li: 'リ', lu: 'ル', le: 'レ', lo: 'ロ', ye: 'イェ', ca: 'カ', co: 'コ', cu: 'ク', qua: 'クア', que: 'クエ', qui: 'クイ', xa: 'サ', xe: 'セ', xi: 'シ', xo: 'ソ', xu: 'ス',
      ce: 'セ', ci: 'シ',
    });
    return ROMA;
  }
  function romajiToKata(word) {
    const T = romaTable();
    const s = word.toLowerCase().replace(/ph/g, 'f').replace(/th/g, 't').replace(/ck/g, 'k').replace(/[^a-z]/g, '');
    let out = '', i = 0;
    const V = 'aeiou';
    while (i < s.length) {
      const c = s[i];
      if (i + 1 < s.length && c === s[i + 1] && !V.includes(c) && c !== 'n') { out += 'ッ'; i++; continue; }
      if (c === 'n' && (i + 1 === s.length || !(V + 'y').includes(s[i + 1]))) { out += 'ン'; i++; continue; }
      if (i > 0 && c === s[i - 1] && V.includes(c)) { out += 'ー'; i++; continue; }
      let hit = false;
      for (let n = 3; n >= 1; n--) {
        const sub = s.substr(i, n);
        if (T[sub] && (n > 1 || V.includes(sub))) { out += T[sub]; i += n; hit = true; break; }
      }
      if (hit) continue;
      if (c === 'y') { out += 'イ'; i++; continue; }
      const fill = (c === 't' || c === 'd') ? 'o' : 'u';
      out += T[c + fill] || ''; i++;
    }
    return out;
  }
  function nameToKata(name) {
    const parts = String(name || '').trim().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').split(/\s+/).filter(Boolean);
    const res = parts.map(p => { const low = p.toLowerCase().replace(/[^a-z]/g, ''); return SJ.VN_NAMES[low] || romajiToKata(low); });
    return res.filter(Boolean).join('・');
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 11) return { jp: 'おはよう', r: 'ohayou', vi: 'Chào buổi sáng', icon: 'sunrise' };
    if (h < 18) return { jp: 'こんにちは', r: 'konnichiwa', vi: 'Xin chào', icon: 'sun' };
    return { jp: 'こんばんは', r: 'konbanwa', vi: 'Chào buổi tối', icon: 'moon' };
  }

  SJ.ui = {
    $, $$, esc, shuffle, pick, sample, clamp, I, mascot, mascotSay, FURS, toast, confetti, modal, confirm: confirmBox,
    petals: () => { }, stars, ring, bar, countUp, sayBtn, hanko, lbl, fish, ruby, reading, baseText, nameToKata, romajiToKata, greeting,
  };
})(window.SJ);
