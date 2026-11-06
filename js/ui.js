/* SubelJapan — Tiện ích giao diện: mèo Mochi, toast, confetti giấy, modal, hoa anh đào, con dấu hanko */
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

  // ---------- Mèo Mochi (vẽ tay) ----------
  const INK = 'var(--ink-ic,#3d3142)';
  const L = (d, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w || 3}" stroke-linecap="round" stroke-linejoin="round"/>`;
  function eyes(mood) {
    const dot = (x) => `<ellipse cx="${x}" cy="72" rx="4.6" ry="5.4" fill="${INK}"/><circle cx="${x + 1.6}" cy="70" r="1.7" fill="#fff"/>`;
    switch (mood) {
      case 'happy': return L('M35 73 q7 -9 14 0') + L('M71 73 q7 -9 14 0');
      case 'wow': return `<circle cx="42" cy="71" r="6.8" fill="${INK}"/><circle cx="44.5" cy="68.5" r="2.4" fill="#fff"/><circle cx="78" cy="71" r="6.8" fill="${INK}"/><circle cx="80.5" cy="68.5" r="2.4" fill="#fff"/>`;
      case 'sad': return L('M35 70 q7 6 14 3') + L('M71 73 q7 3 14 -3') + `<path d="M40 79 q-3.5 6 0 8.5 q3.5 -2.5 0 -8.5z" fill="#9fd0f0" stroke="${INK}" stroke-width="1.6"/>`;
      case 'wink': return dot(42) + L('M71 73 q7 -8 14 0');
      case 'love': return `<path d="M42 78 l-6.5 -6.5 a3.8 3.8 0 0 1 6.5 -4.3 a3.8 3.8 0 0 1 6.5 4.3z" fill="#f06a8a" stroke="${INK}" stroke-width="2"/><path d="M78 78 l-6.5 -6.5 a3.8 3.8 0 0 1 6.5 -4.3 a3.8 3.8 0 0 1 6.5 4.3z" fill="#f06a8a" stroke="${INK}" stroke-width="2"/>`;
      case 'sleep': return L('M35 72 q7 5 14 0') + L('M71 72 q7 5 14 0');
      default: return dot(42) + dot(78);
    }
  }
  function mouth(mood) {
    if (mood === 'wow') return `<ellipse cx="60" cy="88" rx="4.6" ry="5.6" fill="${INK}"/><ellipse cx="60" cy="90.5" rx="2.6" ry="2.2" fill="#f58ea7"/>`;
    if (mood === 'sad') return L('M53 90 q7 -6 14 0', 2.6);
    if (mood === 'happy' || mood === 'love') return `<path d="M54 85 q6 9 12 0 z" fill="#f58ea7" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>` + L('M51 84 q4.5 4 9 0 q4.5 4 9 0', 2.6);
    return L('M51 84 q4.5 4.5 9 0 q4.5 4.5 9 0', 2.6);
  }
  function mascot(mood, size, extra) {
    size = size || 120; mood = mood || 'normal';
    return `<svg class="mascot mood-${mood} ${extra || ''}" viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true"><g class="rough">
      <g class="m-tail"><path d="M96 101 q22 -4 15 -27 q-1 -4 -5 -2" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M96 101 q22 -4 15 -27 q-1 -4 -5 -2" fill="none" stroke="#fffaf2" stroke-width="5" stroke-linecap="round"/></g>
      <ellipse cx="60" cy="112" rx="36" ry="4.5" fill="rgba(61,49,66,.12)"/>
      <path d="M21 53 L25 15 Q27 12 30 15 L50 33 Z" fill="#fffaf2" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M28 25 L30 39 L41 34 Z" fill="#f9b8c6"/>
      <path d="M99 53 L95 15 Q93 12 90 15 L70 33 Z" fill="#fffaf2" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M92 25 L90 39 L79 34 Z" fill="#f9b8c6"/>
      <path d="M60 30 C88 30 107 46 107 72 C107 96 88 108 60 108 C32 108 13 96 13 72 C13 46 32 30 60 30 Z" fill="#fffaf2" stroke="${INK}" stroke-width="3"/>
      <path d="M15 58 Q60 38 105 58 L104 67 Q60 49 16 67 Z" fill="var(--hachi,#ef6f86)" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="60" cy="51.5" r="5.2" fill="#fffaf2" stroke="${INK}" stroke-width="2"/><circle cx="60" cy="51.5" r="2.6" fill="#e9675d"/>
      <path d="M104 60 L117 53 L114 66 Z" fill="var(--hachi,#ef6f86)" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
      <g class="m-flower" transform="translate(88 22)">${[0, 72, 144, 216, 288].map(a => `<path d="M0 0 C-3.5 -2 -4.2 -6.5 -2 -8.8 L0 -7.3 L2 -8.8 C4.2 -6.5 3.5 -2 0 0Z" transform="rotate(${a})" fill="#fbc3d0" stroke="${INK}" stroke-width="1.4"/>`).join('')}<circle r="1.8" fill="#f8d77c"/></g>
      <g class="m-eyes">${eyes(mood)}</g>
      <ellipse cx="30" cy="84" rx="8" ry="5" fill="#f9b8c6" opacity=".9"/><ellipse cx="90" cy="84" rx="8" ry="5" fill="#f9b8c6" opacity=".9"/>
      <path d="M57 79.5 h6 l-3 3.2z" fill="#f58ea7" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>
      ${mouth(mood)}
      ${L('M6 77 L22 80 M7 87 L22 86 M114 77 L98 80 M113 87 L98 86', 2.2)}
      ${mood === 'sleep' ? `<text x="98" y="38" font-size="15" font-weight="700" fill="${INK}" font-family="Mali">z</text><text x="108" y="26" font-size="11" font-weight="700" fill="${INK}" font-family="Mali">z</text>` : ''}
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
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, ms || 2600);
  }

  // ---------- Confetti: mảnh giấy + hoa anh đào + sao vẽ tay ----------
  function confetti(n) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    n = n || 80;
    const colors = ['#f9b8c6', '#f8d77c', '#b3d394', '#a9d0ec', '#cfbcee', '#ffc9a8', '#ef8ba1'];
    const box = document.createElement('div'); box.className = 'confetti';
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      if (i % 6 === 0) { p.innerHTML = I(i % 12 === 0 ? 'star' : 'sakura', 22); p.className = 'shape'; }
      else { p.style.background = pick(colors); const s = 7 + Math.random() * 7; p.style.width = s + 'px'; p.style.height = (s * (Math.random() > .5 ? .7 : 1.6)) + 'px'; }
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
    back.innerHTML = `<div class="modal paper ${opts.cls || ''}" role="dialog" aria-modal="true"><span class="tape tape-l"></span><span class="tape tape-r"></span>${opts.noClose ? '' : `<button class="modal-x" aria-label="Đóng">${I('batsu', 20)}</button>`}<div class="modal-body">${html}</div></div>`;
    document.body.appendChild(back);
    requestAnimationFrame(() => back.classList.add('show'));
    const close = (v) => {
      if (!back.parentNode) return;
      back.classList.remove('show');
      setTimeout(() => back.remove(), 250);
      document.removeEventListener('keydown', onKey);
      opts.onClose && opts.onClose(v);
    };
    const onKey = e => { if (e.key === 'Escape' && !opts.noClose) close(); };
    document.addEventListener('keydown', onKey);
    back.addEventListener('click', e => { if ((e.target === back && !opts.noClose) || e.target.closest('.modal-x')) close(); });
    return { el: $('.modal-body', back), close };
  }
  function confirmBox(text, okLabel, cancelLabel) {
    return new Promise(res => {
      let answered = false;
      const m = modal(`<div class="center">${mascot('wow', 90)}<p class="confirm-text">${text}</p>
        <div class="row center-row gap wrap"><button class="btn btn-paper" data-v="0">${cancelLabel || 'Ở lại học tiếp'}</button><button class="btn" data-v="1">${okLabel || 'Đồng ý'}</button></div></div>`,
        { cls: 'modal-sm', onClose: () => { if (!answered) res(false); } });
      m.el.addEventListener('click', e => {
        const b = e.target.closest('[data-v]'); if (!b) return;
        answered = true; res(b.dataset.v === '1'); m.close();
      });
    });
  }

  // ---------- Hoa anh đào rơi (vẽ tay) ----------
  function petals() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = $('#petals'); if (!box || box.childElementCount) return;
    const n = window.innerWidth < 600 ? 7 : 12;
    const petal = `<svg viewBox="-8 -15 16 17"><path d="M0 0 C-5.5 -3 -6.5 -10 -3.2 -13.5 L0 -11.2 L3.2 -13.5 C6.5 -10 5.5 -3 0 0Z" fill="var(--petal,#f9c3cf)" stroke="var(--ink,#3d3142)" stroke-width=".9" stroke-opacity=".35"/></svg>`;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'petal'; p.innerHTML = petal;
      const s = 11 + Math.random() * 10;
      p.style.width = s + 'px'; p.style.height = s + 'px';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (11 + Math.random() * 10) + 's, ' + (2.6 + Math.random() * 2.4) + 's';
      p.style.animationDelay = (-Math.random() * 18) + 's, 0s';
      p.style.opacity = 0.45 + Math.random() * 0.4;
      box.appendChild(p);
    }
  }

  // ---------- Thành phần nhỏ ----------
  const stars = (n, max, size) => { max = max || 3; let s = ''; for (let i = 0; i < max; i++) s += `<span class="star ${i < n ? 'on' : ''}">${I('star', size || 22)}</span>`; return `<span class="stars">${s}</span>`; };
  const ring = (pct, size, inner, color) => {
    size = size || 64; const r = size / 2 - 6, c = 2 * Math.PI * r, off = c * (1 - clamp(pct, 0, 100) / 100);
    return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" style="stroke:${color || 'var(--pri)'};stroke-dasharray:${c};stroke-dashoffset:${off}"/></svg><div class="ring-in">${inner || ''}</div></div>`;
  };
  const sayBtn = (text, size) => `<button class="say-btn" data-say="${esc(text)}" title="Nghe phát âm" aria-label="Nghe">${I('speaker', size || 22)}</button>`;
  /** Con dấu hanko đỏ */
  const hanko = (txt, cls) => `<span class="hanko ${cls || ''}"><span class="jp">${txt}</span></span>`;
  /** Nhãn có icon */
  const lbl = (icon, text, size) => `<span class="lbl">${I(icon, size || 20)}<span>${text}</span></span>`;

  // Bấm vào phần tử có data-say để nghe; bấm Mochi để nghe "nya~"
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-say]');
    if (b && !b.disabled) { SJ.audio.speak(b.dataset.say); b.classList.remove('speaking'); void b.offsetWidth; b.classList.add('speaking'); }
    const m = e.target.closest('[data-meow], .mascot');
    if (m && !b) { SJ.audio.sfx(Math.random() < .5 ? 'meow' : 'meow2'); const svg = m.matches('svg') ? m : m.querySelector('svg'); if (svg) { svg.classList.remove('squish'); void svg.getBoundingClientRect(); svg.classList.add('squish'); } }
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

  SJ.ui = { $, $$, esc, shuffle, pick, sample, clamp, I, mascot, mascotSay, toast, confetti, modal, confirm: confirmBox, petals, stars, ring, sayBtn, hanko, lbl, nameToKata, romajiToKata, greeting };
})(window.SJ);
