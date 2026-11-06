/* SubelJapan — Bộ icon & hình minh hoạ TỰ VẼ (SVG nét bút tay, không dùng emoji)
 * SJ.icon(tên, cỡ, class) → chuỗi <svg>. Tất cả vẽ trên khung 48×48.
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const K = 'var(--ink-ic,#3d3142)';
  const C = {
    pink: '#ffc4d4', rose: '#ff8fae', red: '#ff6b6b', yel: '#ffd85e', org: '#ffab5c', grn: '#a6df88', dgrn: '#62bf68',
    blue: '#a3d5ff', dblue: '#5ea8f0', lav: '#cdb9ff', brn: '#dba476', dbrn: '#a46b45', gry: '#e5dfe8', dgry: '#a79cb2',
    wht: '#ffffff', skin: '#ffe2cf', cream: '#fff0c9', ink: '#4a3756', sky: '#dcf0ff', mint: '#c7f1dd', peach: '#ffcbad',
  };
  // --- nét vẽ cơ bản ---
  const P = (d, f) => `<path d="${d}" fill="${f || 'none'}" class="o"/>`;
  const F = (d, f, op) => `<path d="${d}" fill="${f}"${op ? ` opacity="${op}"` : ''}/>`;
  const O = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f || 'none'}" class="o"/>`;
  const D = (x, y, r, f, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f || K}"${op ? ` opacity="${op}"` : ''}/>`;
  const E = (x, y, rx, ry, f, rot) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f || 'none'}" class="o"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}/>`;
  const EF = (x, y, rx, ry, f, rot, op) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}${op ? ` opacity="${op}"` : ''}/>`;
  const R = (x, y, w, h, rx, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f || 'none'}" class="o"/>`;
  const H = d => `<path d="${d}" class="hl"/>`;
  const T = (x, y, t, s, f, jp) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" class="${jp ? 'tj' : 't'}" fill="${f || K}">${t}</text>`;
  const TUBE = (d, col, w) => `<path d="${d}" fill="none" stroke="${K}" stroke-width="${(w || 4) + 4.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w || 4}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const G = (t, s) => `<g transform="${t}">${s}</g>`;
  const blush = (x1, x2, y, r) => D(x1, y, r || 2.4, C.pink, .9) + D(x2, y, r || 2.4, C.pink, .9);
  const eyes = (x1, x2, y, r) => D(x1, y, r || 1.7) + D(x2, y, r || 1.7);
  const smile = (x, y, w) => P(`M${x - w} ${y} q${w} ${w * .8} ${w * 2} 0`);
  const polar = (n, r1, r2, cx, cy, rot) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) { const a = (Math.PI * i / n) + (rot || -Math.PI / 2); const r = i % 2 ? r2 : r1; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(1) + ' ' + (cy + Math.sin(a) * r).toFixed(1); }
    return d + 'Z';
  };
  const petal = 'M0 0 C-5.5 -3 -6.5 -10 -3.2 -13.5 L0 -11.2 L3.2 -13.5 C6.5 -10 5.5 -3 0 0Z';
  const sakura = (cx, cy, s, col) => G(`translate(${cx} ${cy}) scale(${s})`, [0, 72, 144, 216, 288].map(a => `<path d="${petal}" transform="rotate(${a})" fill="${col || C.pink}" class="o"/>`).join('') + D(0, 0, 2.4, C.rose) + D(0, -4.5, .9, C.rose) + D(4.3, -1.4, .9, C.rose) + D(-4.3, -1.4, .9, C.rose));
  const gear = (() => { let d = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; const r = (i % 2) ? 12.5 : 16.5; const a1 = a - .2, a2 = a + .2; d += (i ? 'L' : 'M') + (24 + Math.cos(a1) * r).toFixed(1) + ' ' + (24 + Math.sin(a1) * r).toFixed(1) + 'L' + (24 + Math.cos(a2) * r).toFixed(1) + ' ' + (24 + Math.sin(a2) * r).toFixed(1); } return d + 'Z'; })();
  const bowl = (col) => P('M7 24 H41 q0 15 -17 15 q-17 0 -17 -15 Z', col) + P('M17 39 h14');
  const cloud = (f) => P('M13 30 q-7 0 -7 -6 q0 -6 7 -6 q1 -8 10 -8 q8 0 10 7 q8 0 8 7 q0 6 -7 6 Z', f || C.wht);
  const drop = (x, y, s, f) => G(`translate(${x} ${y}) scale(${s})`, P('M0 -6 q-4 5 -4 8 a4 4 0 0 0 8 0 q0 -3 -4 -8 Z', f || C.blue));

  // ---------- Mặt biểu cảm ----------
  function face(ex, col) {
    let s = O(24, 25, 16, col || C.yel);
    const hEyes = P('M15 24 q3 -3.5 6 0 M27 24 q3 -3.5 6 0');
    switch (ex) {
      case 'sleep': s += P('M15 24 q3 3 6 0 M27 24 q3 3 6 0') + O(24, 32, 1.8) + T(39, 12, 'z', 10) + T(44, 6, 'z', 7); break;
      case 'sweat': s += eyes(19, 29, 24) + P('M20 32 q2 -2 4 0 q2 2 4 0') + drop(38, 13, 1.1); break;
      case 'teary': s += D(18.5, 24, 3.4) + D(29.5, 24, 3.4) + D(19.6, 22.8, 1.2, '#fff') + D(30.6, 22.8, 1.2, '#fff') + P('M20 33 q4 -3 8 0') + drop(15, 31, .8); break;
      case 'yum': s += hEyes + P('M18 30 q6 7 12 0 Z', C.wht) + F('M22 32.5 q2 3 4 0 Z', C.rose); break;
      case 'love': s += P('M18 27 l-4.2 -4.2 a2.5 2.5 0 0 1 4.2 -2.8 a2.5 2.5 0 0 1 4.2 2.8 Z', C.red) + P('M30 27 l-4.2 -4.2 a2.5 2.5 0 0 1 4.2 -2.8 a2.5 2.5 0 0 1 4.2 2.8 Z', C.red) + smile(24, 31, 4); break;
      case 'dizzy': s += P('M15 21 l6 6 M21 21 l-6 6 M27 21 l6 6 M33 21 l-6 6') + P('M19 33 q2.5 -3 5 0 q2.5 3 5 0'); break;
      case 'halo': s += hEyes + smile(24, 30, 4) + TUBE('M14 6 q10 -4 20 0', C.yel, 3); break;
      case 'cold': s += eyes(19, 29, 23) + P('M17 31 l2.5 -2 l2.5 2 l2.5 -2 l2.5 2 l2.5 -2 l2.5 2') + P('M5 18 l3 2 M4 26 h4 M43 18 l-3 2 M44 26 h-4'); break;
      case 'cool': s += P('M12 20 H36 l-1 4 q-1 5 -6 5 q-4 0 -5 -4 q-1 4 -5 4 q-5 0 -6 -5 Z', C.ink) + smile(24, 32, 4) + H('M16 22 l3 0'); break;
      case 'laugh': s += P('M15 23 l3 -3 l3 3 M27 23 l3 -3 l3 3') + P('M17 29 H31 q0 8 -7 8 q-7 0 -7 -8 Z', C.wht) + drop(11, 26, .7) + drop(37, 26, .7); break;
      case 'wink': s += D(19, 24, 1.9) + P('M27 24 q3 -3 6 0') + smile(24, 30, 4); break;
      case 'wow': s += eyes(19, 29, 23, 2.2) + O(24, 32, 3, C.ink); break;
      default: s += hEyes + smile(24, 30, 4);
    }
    return s + blush(14, 34, 29);
  }

  // ---------- Đầu động vật ----------
  function animal(t) {
    const e = eyes(19, 29, 26) + blush(14.5, 33.5, 31, 2.2);
    switch (t) {
      case 'cat': return P('M10 21 L12 7 L21 14 Z', '#f9d197') + P('M38 21 L36 7 L27 14 Z', '#f9d197') + F('M13 18 L14 11 L18 14 Z', C.rose) + F('M35 18 L34 11 L30 14 Z', C.rose) + O(24, 27, 14, '#f9d197') + P('M21 15 l1 3.5 M24 14 v4 M27 15 l-1 3.5') + e + F('M22.6 30 h2.8 l-1.4 1.6 Z', C.rose) + P('M21 33 q1.5 1.6 3 0 q1.5 1.6 3 0') + P('M6 28 h7 M7 33 l6 -1.5 M42 28 h-7 M41 33 l-6 -1.5');
      case 'dog': return O(24, 26, 13, C.cream) + EF(29, 23, 4.5, 4, C.brn) + E(11, 25, 5, 9.5, C.brn, 18) + E(37, 25, 5, 9.5, C.brn, -18) + e + EF(24, 30, 3.2, 2.3, K) + P('M24 32 v2 M21 34 q3 2 6 0') + F('M23 35 q1 4 2.5 0 Z', C.rose);
      case 'rabbit': return E(18, 12, 4.2, 10.5, C.wht, -8) + E(30, 12, 4.2, 10.5, C.wht, 8) + EF(18, 13, 1.8, 7, C.pink, -8) + EF(30, 13, 1.8, 7, C.pink, 8) + O(24, 31, 12.5, C.wht) + eyes(19.5, 28.5, 30) + blush(15.5, 32.5, 34, 2) + F('M22.8 33 h2.4 l-1.2 1.4 Z', C.rose) + R(22.5, 35.5, 3, 3.2, .8, C.wht);
      case 'bear': return O(12, 15, 5, C.brn) + O(36, 15, 5, C.brn) + D(12, 15, 2.2, C.dbrn) + D(36, 15, 2.2, C.dbrn) + O(24, 27, 14.5, C.brn) + E(24, 32, 6.5, 5, C.cream) + EF(24, 30.2, 2.6, 1.8, K) + P('M24 32 v1.5 q-2 2 -3.5 0.5 M24 33.5 q2 2 3.5 0.5') + eyes(18.5, 29.5, 24) + blush(13.5, 34.5, 29, 2);
      case 'panda': return O(12, 15, 5, C.ink) + O(36, 15, 5, C.ink) + O(24, 27, 14.5, C.wht) + EF(18.5, 26, 4, 5.2, C.ink, 28) + EF(29.5, 26, 4, 5.2, C.ink, -28) + D(19, 25.5, 1.4, '#fff') + D(29, 25.5, 1.4, '#fff') + EF(24, 31, 2.4, 1.7, K) + P('M24 32.5 v1.5 M21.5 35 q2.5 1.6 5 0') + blush(13, 35, 32, 2);
      case 'pig': return P('M11 17 L12 7 L20 13 Z', C.pink) + P('M37 17 L36 7 L28 13 Z', C.pink) + O(24, 26, 14, C.pink) + E(24, 30, 6.5, 4.6, C.rose) + D(22, 30, 1.2) + D(26, 30, 1.2) + eyes(18.5, 29.5, 23.5) + D(13.5, 28, 2.2, C.rose, .7) + D(34.5, 28, 2.2, C.rose, .7);
      case 'monkey': return O(9.5, 26, 4.6, C.skin) + O(38.5, 26, 4.6, C.skin) + O(24, 25, 14, C.brn) + P('M24 20 q4 -5 8 -1 q4 4 0 10 q-2 7 -8 7 q-6 0 -8 -7 q-4 -6 0 -10 q4 -4 8 1 Z', C.skin) + eyes(19.5, 28.5, 23) + D(22.5, 29, .9) + D(25.5, 29, .9) + P('M20.5 32 q3.5 2.6 7 0');
      case 'fox': return P('M10 22 L10 5 L21 13 Z', C.org) + P('M38 22 L38 5 L27 13 Z', C.org) + F('M12.5 17 L12.5 10 L17 13.5 Z', C.cream) + F('M35.5 17 L35.5 10 L31 13.5 Z', C.cream) + P('M8 22 q0 -11 16 -11 q16 0 16 11 q0 8 -16 17 q-16 -9 -16 -17 Z', C.org) + F('M10 24 q6 -1 12 6 q-4 5 -2 6 q-8 -5 -10 -12 Z', C.cream) + F('M38 24 q-6 -1 -12 6 q4 5 2 6 q8 -5 10 -12 Z', C.cream) + eyes(18.5, 29.5, 23) + D(24, 35.5, 2.1);
      case 'cow': return P('M14 15 q-5 -2 -5 -8 q5 1 8 6', C.cream) + P('M34 15 q5 -2 5 -8 q-5 1 -8 6', C.cream) + E(8.5, 22, 5, 2.8, C.wht, -20) + E(39.5, 22, 5, 2.8, C.wht, 20) + O(24, 25, 13.5, C.wht) + F('M29 13 q7 1 7 7 q-5 2 -8 -2 Z', C.ink) + E(24, 32, 9, 5.6, C.pink) + D(20.5, 32, 1.3) + D(27.5, 32, 1.3) + eyes(18.5, 29.5, 23);
      case 'horse': return P('M16 13 l-2 -8 l6 5 Z', C.brn) + P('M32 13 l2 -8 l-6 5 Z', C.brn) + E(24, 25, 10.5, 15, C.brn) + P('M17 13 q5 -8 12 -5 q-1 5 -8 9 Z', C.dbrn) + E(24, 34, 7.5, 5.5, C.cream) + D(21.5, 34, 1.1) + D(26.5, 34, 1.1) + eyes(19.5, 28.5, 21) + blush(16.5, 31.5, 26, 1.9);
      case 'elephant': return E(9.5, 23, 8, 10.5, C.gry) + E(38.5, 23, 8, 10.5, C.gry) + EF(10, 23, 4.5, 7, C.pink, 0, .8) + EF(38, 23, 4.5, 7, C.pink, 0, .8) + O(24, 22, 12.5, C.gry) + P('M20 28 q-1 9 3 13 q4 3 6 -1 q-3 0 -3.5 -4 q0 -4 1.5 -8', C.gry) + eyes(19, 29, 20) + blush(15.5, 32.5, 25, 2);
      case 'mouse': return O(12, 14, 7.5, C.gry) + O(36, 14, 7.5, C.gry) + D(12, 14, 4, C.pink) + D(36, 14, 4, C.pink) + O(24, 29, 12, C.gry) + eyes(19.5, 28.5, 27) + D(24, 31.5, 1.9, C.rose) + P('M10 30 h7 M11 34 l6 -1.5 M38 30 h-7 M37 34 l-6 -1.5') + blush(16, 32, 33, 1.8);
      case 'bird': return P('M22 12 q0 -5 3 -6 M25 12 q2 -4 5 -4') + O(24, 26, 14, C.yel) + P('M12 27 q-6 2 -3 9 q5 -1 6 -5', C.yel) + eyes(19, 29, 24) + P('M21 28 L27 28 L24 32 Z', C.org) + blush(14.5, 33.5, 30, 2) + P('M20 40 v3 M28 40 v3');
      case 'penguin': return E(24, 25, 14, 16.5, C.ink) + P('M10 26 q-5 6 -2 10 q3 -2 4 -6 M38 26 q5 6 2 10 q-3 -2 -4 -6') + EF(24, 29, 9.5, 11.5, C.wht) + EF(19, 21, 4.5, 5, C.wht) + EF(29, 21, 4.5, 5, C.wht) + eyes(19.5, 28.5, 21.5) + P('M21 25 L27 25 L24 29 Z', C.org) + EF(18.5, 41.5, 3.6, 1.8, C.org) + EF(29.5, 41.5, 3.6, 1.8, C.org) + blush(16, 32, 27, 1.9);
      case 'turtle': return P('M38 30 q7 -1 7 -6 q0 -4 -4 -4 q-4 0 -4 5', C.grn) + D(41.5, 23, 1.2) + P('M13 31 v5 h4 v-4 M29 31 v5 h4 v-5', C.grn) + P('M8 31 q0 -15 16 -15 q16 0 16 15 Z', '#9ccb80') + P('M15 31 q0 -8 9 -8 q9 0 9 8 M24 16 V23 M16 21 l3 3 M32 21 l-3 3') + P('M6 31 H42');
      case 'fish': return P('M31 24 L42 15 V33 Z', C.blue) + P('M6 24 q11 -13 26 0 q-15 13 -26 0 Z', C.blue) + P('M18 16 q3 -4 7 -3 l-1 4') + D(13, 22, 1.7) + P('M20 20 q3 4 0 8 M25 19 q3 5 0 10') + D(11, 26.5, 1.8, C.pink, .9);
    }
    return '';
  }

  // ---------- Đầu người ----------
  function person(t) {
    const hc = '#7a5a48', face = O(24, 27, 12, C.skin) + eyes(20, 28, 27, 1.5) + blush(17.2, 30.8, 30.5, 2) + P('M22.2 31.5 q1.8 1.5 3.6 0');
    const glasses = O(20, 27, 3.6) + O(28, 27, 3.6) + P('M23.6 26.6 h0.8');
    switch (t) {
      case 'mom': return P('M11 27 q0 -16 13 -16 q13 0 13 16 V40 q-3 1 -5 0 V30 H16 V40 q-2 1 -5 0 Z', hc) + face + P('M12 25 q1 -11 12 -11 q11 0 12 11 q-7 -1 -10 -6 q-4 6 -14 6 Z', hc);
      case 'dad': return face + P('M12 25 q-1 -13 12 -13 q13 0 12 13 q-2 -6 -7 -6 q-5 3 -17 6 Z', '#5d4a40') + P('M20 32.5 q2 -2.2 4 0 q2 -2.2 4 0', '#5d4a40');
      case 'bro': return face + P('M12 25 l-2 -8 l5 2 l0 -7 l5 4 l4 -7 l4 6 l5 -4 l0 6 l5 -1 l-2 9 q-8 -4 -24 0 Z', hc);
      case 'sis': return P('M33 16 q10 0 9 14 q-6 -2 -8 -8', hc) + face + P('M12 25 q1 -12 12 -12 q11 0 12 12 q-4 -2 -6 -6 q-6 5 -18 6 Z', hc) + D(34, 15, 2.2, C.rose);
      case 'kid': return face + P('M12 23 q0 -11 12 -11 q12 0 12 11 Z', C.blue) + P('M30 22 H43 q-1 3.5 -6 3.5 H30 Z', C.blue) + D(24, 12, 1.6, C.wht);
      case 'imouto': return E(10.5, 24, 4.2, 6.5, hc) + E(37.5, 24, 4.2, 6.5, hc) + face + P('M12 25 q1 -12 12 -12 q11 0 12 12 q-12 -5 -24 0 Z', hc) + D(12.5, 18, 2.4, C.rose) + D(35.5, 18, 2.4, C.rose);
      case 'grandpa': return face + P('M12.5 25 q-1 -6 3 -9 M35.5 25 q1 -6 -3 -9', C.gry) + glasses + P('M19.5 32.5 q2.5 -2.5 4.5 0 q2 -2.5 4.5 0', C.wht);
      case 'grandma': return O(24, 11, 5.2, C.gry) + face + P('M12 25 q0 -13 12 -13 q12 0 12 13 q-12 -7 -24 0 Z', C.gry) + glasses;
      case 'baby': return O(24, 26, 13.5, C.skin) + eyes(19.5, 28.5, 26, 1.6) + blush(15.5, 32.5, 30, 2.3) + P('M24 13 q4 -4 1 -7') + E(24, 33, 3.2, 2.6, C.rose) + D(24, 33, 1, C.wht);
      case 'teacher': return P('M12 28 q-1 -16 12 -16 q13 0 12 16 q-3 0 -4 -4', '#4f4058') + face + glasses + P('M12 24 q2 -11 12 -11 q10 0 12 11 q-9 -1 -12 -6 q-3 5 -12 6 Z', '#4f4058');
      case 'student': return face + P('M12 24 q0 -9 12 -9 q12 0 12 9', hc) + P('M6 15 L24 8 L42 15 L24 22 Z', C.ink) + P('M38 16 V25') + D(38, 26, 2, C.yel);
      case 'chef': return face + P('M14 19 q-6 -1 -5 -7 q1 -5 7 -4 q1 -5 8 -5 q7 0 8 5 q6 -1 7 4 q1 6 -5 7 Z', C.wht) + P('M14 17 H34 V22 H14 Z', C.wht);
      case 'ninja': return O(24, 26, 15, C.ink) + P('M10 21 H38 V30 H10 Z', C.skin) + eyes(19, 29, 25.5, 1.9) + P('M16 22.5 l5 1.5 M32 22.5 l-5 1.5') + P('M38 19 l7 -3 M38 23 l7 1', C.red);
    }
    return face;
  }
  const mini = (t, x, y, s) => G(`translate(${x} ${y}) scale(${s}) translate(-24 -26)`, person(t));

  // ---------- Hình đồ vật & minh hoạ ----------
  const I = {
    // ===== giao diện =====
    home: () => P('M31 15 V8 H36 V19', C.red) + P('M13 20 L24 10 L35 20 V39 H13 Z', C.cream) + P('M8 22 L24 8 L40 22') + P('M20 39 V30 q4 -4 8 0 V39', C.pink) + sakura(17, 25, .28),
    learn: () => R(9, 29, 31, 9, 3, C.blue) + R(12, 20, 27, 9, 3, C.pink) + R(10, 11, 25, 9, 3, C.yel) + P('M15 11 V20 M17 20 V29 M14 29 V38') + H('M28 14 h4'),
    book: () => P('M24 14 q-8 -5 -17 -2 V37 q9 -3 17 2 Z', C.wht) + P('M24 14 q8 -5 17 -2 V37 q-9 -3 -17 2 Z', C.wht) + P('M11 18 q5 -2 9 0 M11 23 q5 -2 9 0 M11 28 q5 -2 9 0 M28 18 q5 -2 9 0 M28 23 q5 -2 9 0') + P('M30 9 V18 l2.5 -2 l2.5 2 V9', C.rose),
    books: () => I.learn(),
    notebook: () => R(11, 7, 26, 34, 4, C.lav) + P('M11 13 h-3 M11 20 h-3 M11 27 h-3 M11 34 h-3') + R(17, 13, 15, 8, 2, C.wht),
    pencil: () => P('M12 36 L14 28 L31 11 l6 6 L20 34 Z', C.yel) + P('M31 11 q2.5 -2.5 5 0 l1 1 q2.5 2.5 0 5 l-1 1 l-6 -6 Z', C.pink) + P('M29 13 l6 6') + P('M12 36 l2 -8 l6 6 Z', C.cream) + F('M12 36 l1 -4 l3 3 Z', K),
    write: () => R(7, 9, 24, 31, 3, C.wht) + P('M12 17 H26 M12 23 H26 M12 29 H20') + G('translate(8 2)', I.pencil()),
    infinity: () => TUBE('M24 24 C20 16 9 16 9 24 C9 32 20 32 24 24 C28 16 39 16 39 24 C39 32 28 32 24 24 Z', C.lav, 4.4) + D(14, 21.5, 1, '#fff') + D(34, 21.5, 1, '#fff'),
    game: () => P('M13 17 q-7 0 -8 10 q-1 10 6 10 q4 0 6 -5 H31 q2 5 6 5 q7 0 6 -10 q-1 -10 -8 -10 Z', C.lav) + P('M11 25 h7 M14.5 21.5 v7') + O(31, 23, 2, C.red) + O(36, 27, 2, C.blue) + H('M14 20 q3 -1 6 0'),
    brain: () => P('M24 12 q-5 -5 -10 -1 q-7 1 -6 8 q-5 5 0 10 q0 7 8 7 q4 3 8 -1 Z', C.pink) + P('M24 12 q5 -5 10 -1 q7 1 6 8 q5 5 0 10 q0 7 -8 7 q-4 3 -8 -1 Z', C.pink) + P('M24 12 V35 M15 19 q4 1 4 5 M33 19 q-4 1 -4 5 M14 29 q3 -2 6 0 M34 29 q-3 -2 -6 0'),
    kana: () => R(8, 8, 32, 32, 9, C.wht) + T(24, 33, 'あ', 22, K, 1) + D(36, 12, 3, C.red),
    fire: () => P('M24 42 q-13 0 -13 -12 q0 -8 7 -14 q0 6 4 7 q-1 -9 7 -15 q1 8 6 12 q3 4 3 10 q0 12 -14 12 Z', C.org) + P('M24 42 q-6 0 -6 -6 q0 -4 4 -7 q1 3 3 3 q0 -3 2 -5 q3 4 3 8 q0 7 -6 7 Z', C.yel),
    star: () => P('M24 6 l4.8 10 l10.8 1.4 l-8 7.5 l2 10.8 l-9.6 -5.3 l-9.6 5.3 l2 -10.8 l-8 -7.5 l10.8 -1.4 Z', C.yel) + eyes(20.5, 27.5, 24, 1.3) + P('M22.5 27.5 q1.5 1.4 3 0') + D(18, 27, 1.6, C.rose, .7) + D(30, 27, 1.6, C.rose, .7),
    target: () => O(22, 26, 15, C.wht) + O(22, 26, 10, C.pink) + O(22, 26, 4.5, C.red) + TUBE('M22 26 L38 10', C.brn, 2) + P('M35 8 L38 10 L40 13 L43 7 Z', C.yel),
    speaker: () => P('M8 19 H15 L24 11 V37 L15 29 H8 Z', C.yel) + P('M29 18 q4 6 0 12 M33.5 14 q8 10 0 20'),
    mute: () => P('M8 19 H15 L24 11 V37 L15 29 H8 Z', C.gry) + P('M30 19 l9 10 M39 19 l-9 10'),
    play: () => P('M15 10 q-2 -1 -2 2 V36 q0 3 2 2 L37 26 q2 -2 0 -4 Z', C.pink),
    undo: () => TUBE('M15 20 H29 q9 0 9 9 q0 9 -9 9 H21', C.blue) + P('M20 11 L10 20 L20 29 Z', C.blue),
    eraser: () => P('M8 30 L25 13 q2 -2 4 0 l8 8 q2 2 0 4 L24 38 H16 Z', C.pink) + P('M8 30 l8 -8 l10 10 l-6 6 H16 Z', C.wht) + P('M13 38 H40'),
    eye: () => P('M5 24 q19 -19 38 0 q-19 19 -38 0 Z', C.wht) + O(24, 24, 7.5, C.blue) + D(24, 24, 3.4) + D(26, 22, 1.3, '#fff') + P('M13 13 l-2 -3.5 M24 10 V6 M35 13 l2 -3.5'),
    check: () => TUBE('M10 25 l9 9 l19 -20', C.grn, 4.6),
    maru: () => TUBE('M24 10 a14 14 0 1 0 0.01 0', C.rose, 4.6),
    batsu: () => TUBE('M13 13 L35 35 M35 13 L13 35', C.red, 4.6),
    arrow_r: () => TUBE('M9 24 H36 M27 15 L37 24 L27 33', C.yel),
    arrow_l: () => TUBE('M39 24 H12 M21 15 L11 24 L21 33', C.yel),
    bulb: () => P('M4 18 H8 M40 18 h4 M9 6 l3 3 M39 6 l-3 3 M24 2 v3') + P('M24 7 q11 0 11 11 q0 6 -5 10 v4 H18 v-4 q-5 -4 -5 -10 q0 -11 11 -11 Z', C.yel) + P('M18 32 H30 V37 q0 3 -3 3 H21 q-3 0 -3 -3 Z', C.gry) + P('M19 36 H29 M21 26 l3 -5 l3 5') + H('M18 15 q2 -4 6 -4'),
    chain: () => TUBE('M15 31 l-4 -4 q-4 -4 0 -8 l4 -4 q4 -4 8 0 l2 2', C.gry, 3.6) + TUBE('M33 17 l4 4 q4 4 0 8 l-4 4 q-4 4 -8 0 l-2 -2', C.gry, 3.6) + TUBE('M19 29 L29 19', C.yel, 3.6),
    trophy: () => P('M15 12 H9 q0 9 7 10 M33 12 h6 q0 9 -7 10') + P('M15 8 H33 V18 q0 10 -9 10 q-9 0 -9 -10 Z', C.yel) + P('M21 28 h6 v5 h-6 Z', C.yel) + R(14, 33, 20, 7, 2, C.org) + P('M24 12 l1.6 3.3 l3.5 .5 l-2.5 2.4 l.6 3.5 l-3.2 -1.7 l-3.2 1.7 l.6 -3.5 l-2.5 -2.4 l3.5 -.5 Z', '#fff') + H('M18 11 v6'),
    crown: () => P('M8 33 L10 14 L18 23 L24 10 L30 23 L38 14 L40 33 Z', C.yel) + R(8, 32, 32, 7, 2, C.org) + O(24, 35.5, 2.2, C.red) + O(15, 35.5, 1.8, C.blue) + O(33, 35.5, 1.8, C.grn) + O(10, 13, 2, C.pink) + O(24, 9, 2, C.pink) + O(38, 13, 2, C.pink),
    heart: () => P('M24 40 C9 31 5 22 8.5 15.5 C12 9 20 9.5 24 16.5 C28 9.5 36 9 39.5 15.5 C43 22 39 31 24 40 Z', C.rose) + H('M13 17 q2 -4 6 -3'),
    lock: () => P('M16 22 V16 q0 -8 8 -8 q8 0 8 8 V22') + R(11, 21, 26, 19, 6, C.yel) + D(24, 29, 2.6) + F('M22.8 30 h2.4 l1 5 h-4.4 Z', K),
    gear: () => P(gear, C.gry) + O(24, 24, 5.5, C.wht),
    palette: () => P('M24 8 q16 0 16 14 q0 7 -6 7 h-4 q-4 0 -3 4 q1 3 -1 5 q-2 3 -6 2 q-14 -3 -14 -16 q0 -16 18 -16 Z', C.cream) + O(16, 18, 2.8, C.red) + O(24, 14, 2.8, C.yel) + O(32, 17, 2.8, C.blue) + O(15, 27, 2.8, C.grn),
    download: () => P('M9 30 V39 H39 V30') + TUBE('M24 8 V27 M16 19 L24 27 L32 19', C.blue),
    upload: () => P('M9 30 V39 H39 V30') + TUBE('M24 28 V9 M16 17 L24 9 L32 17', C.grn),
    trash: () => P('M13 14 L15 40 H33 L35 14 Z', C.gry) + P('M9 14 H39 M19 14 V9 H29 V14 M20 20 V34 M28 20 V34'),
    refresh: () => TUBE('M36 19 q-3 -9 -12 -9 q-9 0 -12 7', C.grn, 3.6) + P('M37 11 L37 20 L28 19 Z', C.grn) + TUBE('M12 29 q3 9 12 9 q9 0 12 -7', C.grn, 3.6) + P('M11 37 L11 28 L20 29 Z', C.grn),
    dice: () => R(9, 9, 30, 30, 8, C.wht) + D(17, 17, 2.7) + D(24, 24, 2.7, C.red) + D(31, 31, 2.7) + D(31, 17, 2.7) + D(17, 31, 2.7),
    cards: () => G('rotate(-12 20 26)', R(7, 12, 20, 27, 4, C.lav) + sakura(17, 25.5, .36, C.wht)) + G('rotate(10 30 24)', R(20, 10, 20, 27, 4, C.wht) + T(30, 29, 'あ', 13, K, 1)),
    puzzle: () => P('M9 15 H18 q-2 -7 5 -7 q7 0 5 7 H38 V24 q-7 -2 -7 5 q0 7 7 5 V41 H9 V32 q7 2 7 -4 q0 -7 -7 -5 Z', C.yel) + H('M13 19 h3'),
    bolt: () => P('M28 5 L12 27 H22 L19 43 L37 19 H26 Z', C.yel) + H('M25 11 l-6 9'),
    rain: () => cloud() + drop(15, 37, .9) + drop(24, 40, .9) + drop(33, 37, .9),
    torii: () => P('M14 16 L13 42 H18.5 L18.5 16 Z', C.red) + P('M34 16 L35 42 H29.5 L29.5 16 Z', C.red) + P('M9 20 H39 V25 H9 Z', C.red) + P('M5 10 q19 5 38 0 l-1.5 6 q-17.5 3 -35 0 Z', C.red) + P('M22 20 V25 M26 20 V25'),
    sprout: () => P('M11 39 q13 -7 26 0 Z', C.brn) + P('M24 37 V22') + P('M24 27 q-13 2 -14 -10 q12 -1 14 10 Z', C.grn) + P('M24 22 q11 0 13 -11 q-12 -1 -13 11 Z', C.grn),
    seed: () => P('M24 8 q14 8 13 20 q-1 10 -13 11 q-12 -1 -13 -11 q-1 -12 13 -20 Z', C.brn) + P('M11 30 q13 6 26 0 q-2 9 -13 9 q-11 0 -13 -9 Z', C.cream) + eyes(20, 28, 25, 1.4) + P('M22.5 28 q1.5 1.3 3 0') + blush(17, 31, 28, 1.6) + H('M20 14 q2 -2 4 -2'),
    leaf: () => P('M9 39 q-2 -25 29 -29 q2 27 -29 29 Z', C.grn) + P('M9 39 Q22 27 33 15 M17 31 h6 M22 25 v-6'),
    tulip: () => P('M24 41 V24') + P('M24 35 q-9 0 -11 -9 q8 0 11 9 Z', C.grn) + P('M14 11 l5 4 l5 -7 l5 7 l5 -4 v10 q0 7 -10 7 q-10 0 -10 -7 Z', C.rose),
    sakura: () => sakura(24, 24, 1.42),
    flower: () => I.tulip(),
    backpack: () => P('M19 10 q0 -5 5 -5 q5 0 5 5') + P('M12 17 q0 -7 12 -7 q12 0 12 7 V37 q0 4 -4 4 H16 q-4 0 -4 -4 Z', C.blue) + R(17, 26, 14, 10, 3, C.sky) + P('M12 19 q12 7 24 0 M21 26 v3 M27 26 v3'),
    sword: () => TUBE('M15 33 L39 9', C.gry, 3.2) + P('M10 29 l9 9') + TUBE('M7 41 L13 35', C.red, 3.4),
    magnifier: () => TUBE('M28 28 L40 40', C.brn, 4) + O(20, 20, 12, C.sky) + H('M13 17 q2 -5 7 -5'),
    gradcap: () => P('M14 22 V31 q10 7 20 0 V22', '#6b5d7a') + P('M3 18 L24 9 L45 18 L24 27 Z', C.ink) + P('M41 20 V31') + O(41, 33, 2.2, C.yel),
    dragon: () => P('M17 17 l-4 -9 l8 5 Z', C.yel) + P('M31 17 l4 -9 l-8 5 Z', C.yel) + P('M20 14 l2 -5 l2 4 l2 -4 l2 5', C.org) + P('M9 30 q0 -16 15 -16 q15 0 15 16 q0 10 -15 10 q-15 0 -15 -10 Z', C.grn) + E(24, 33, 8.5, 5.5, C.cream) + D(21, 32, 1.1) + D(27, 32, 1.1) + D(18, 25, 2.2) + D(30, 25, 2.2) + D(18.8, 24.2, .8, '#fff') + D(30.8, 24.2, .8, '#fff') + blush(13, 35, 30, 2),
    fuji: () => O(38, 11, 4.5, C.red) + P('M3 41 L18 15 q6 -5 12 0 L45 41 Z', C.blue) + P('M13 24 L18 15 q6 -5 12 0 L35 24 l-4 3 l-3 -3 l-4 3 l-4 -3 l-3 3 Z', C.wht),
    mountain: () => P('M2 41 L16 17 L26 30 L32 21 L46 41 Z', C.grn) + P('M12 24 l4 -7 l4 5 l-2 2 l-2 -2 Z', C.wht) + O(36, 11, 4, C.yel),
    footprints: () => E(16, 31, 5.5, 8, C.pink, -10) + O(11, 21, 1.9, C.pink) + O(14.5, 19.5, 1.9, C.pink) + O(18.5, 19.5, 1.9, C.pink) + E(32, 19, 5.5, 8, C.pink, 10) + O(27.5, 9, 1.9, C.pink) + O(31.5, 7.5, 1.9, C.pink) + O(35.5, 8.5, 1.9, C.pink),
    walk: () => I.footprints(),
    volcano: () => O(21, 9, 4, C.gry) + O(28, 7, 5, C.gry) + P('M5 41 L17 18 H31 L43 41 Z', C.brn) + P('M17 18 q7 6 14 0 l-2 8 q-2 -3 -4 0 q-2 -4 -4 0 q-2 -3 -3 0 Z', C.org),
    comet: () => P('M6 32 L24 21 M9 40 L26 25 M18 43 L28 29') + O(31, 18, 9, C.yel) + eyes(28, 34, 17, 1.2) + P('M29.5 21 q1.5 1.3 3 0'),
    brush: () => TUBE('M38 7 L24 25', C.brn, 3.4) + P('M21 24 l6 4.5 l-3 3 l-6 -4.5 Z', C.gry) + P('M18 27 q-5 4 -8 13 q9 -1 13 -8 Z', C.ink),
    nametag: () => P('M37 24 q6 -10 2 -17') + P('M8 14 H33 L41 24 L33 34 H8 Z', C.yel) + O(34, 24, 2.3, C.wht) + P('M13 21 H26 M13 27 H23'),
    speech: () => P('M7 12 q0 -4 4 -4 H37 q4 0 4 4 V28 q0 4 -4 4 H20 L12 40 V32 q-5 0 -5 -4 Z', C.wht) + D(16.5, 20, 2.1) + D(24, 20, 2.1) + D(31.5, 20, 2.1),
    talk: () => P('M5 10 q0 -4 4 -4 H27 q4 0 4 4 V20 q0 4 -4 4 H15 L9 29 V24 q-4 0 -4 -4 Z', C.pink) + P('M43 22 q0 -4 -4 -4 H22 q-4 0 -4 4 V32 q0 4 4 4 H32 L38 41 V36 q5 0 5 -4 Z', C.sky) + D(25, 27, 1.6) + D(30.5, 27, 1.6) + D(36, 27, 1.6),
    rainbow: () => TUBE('M7 36 a17 17 0 0 1 34 0', C.rose, 3.6) + TUBE('M14 36 a10 10 0 0 1 20 0', C.yel, 3.6) + E(9, 37, 6, 4, C.wht) + E(39, 37, 6, 4, C.wht),
    sparkle: () => P('M20 6 q2 11 11 13 q-9 2 -11 13 q-2 -11 -11 -13 q9 -2 11 -13 Z', C.yel) + P('M36 26 q1 6 6 7 q-5 1 -6 7 q-1 -6 -6 -7 q5 -1 6 -7 Z', C.pink),
    question: () => TUBE('M16 17 q0 -9 8 -9 q8 0 8 8 q0 5 -5 7 q-3 1 -3 5 V30', C.lav) + O(24, 38, 2.6, C.lav),
    gift: () => R(9, 21, 30, 19, 3, C.pink) + R(7, 15, 34, 7, 3, C.rose) + P('M24 15 V40') + P('M24 15 q-9 -10 -12 -3 q0 4 12 3 q9 -10 12 -3 q0 4 -12 3', C.yel),
    compass: () => O(24, 24, 16, C.wht) + P('M24 11 L28 24 L24 37 L20 24 Z', C.wht) + P('M24 11 L28 24 H20 Z', C.red) + D(24, 24, 2),
    music: () => P('M20 33 V12 L38 8 V29') + P('M20 12 L38 8 V13 L20 17 Z', K) + E(15.5, 33.5, 5, 4, C.lav, -20) + E(33.5, 29.5, 5, 4, C.lav, -20),
    flag_jp: () => P('M9 7 V43') + R(10, 9, 30, 20, 2, C.wht) + O(25, 19, 5.5, C.red),
    flag_vn: () => P('M9 7 V43') + R(10, 9, 30, 20, 2, C.red) + P(polar(5, 6, 2.5, 25, 19.5), C.yel),
    flag: () => P('M9 7 V43') + P('M10 9 q8 -3 15 1 q8 4 15 0 V28 q-7 4 -15 0 q-7 -4 -15 -1 Z', C.blue),
    cheer: () => P('M11 7 V43') + P('M12 9 L41 18 L12 27 Z', C.rose) + P(polar(5, 4.2, 1.8, 22, 18), C.yel),
    numbers: () => R(6, 10, 36, 28, 8, C.yel) + T(24, 30, '123', 15),
    stamp: () => O(24, 24, 16, 'none') + T(24, 30, '合', 17, C.red, 1),
    point: () => I.arrow_r(),
    slow: () => animal('turtle'),
    cat: () => animal('cat'), dog: () => animal('dog'), rabbit: () => animal('rabbit'), bear: () => animal('bear'), panda: () => animal('panda'), pig: () => animal('pig'),
    monkey: () => animal('monkey'), fox: () => animal('fox'), cow: () => animal('cow'), horse: () => animal('horse'), elephant: () => animal('elephant'), mouse: () => animal('mouse'),
    bird: () => animal('bird'), penguin: () => animal('penguin'), turtle: () => animal('turtle'), fish: () => animal('fish'),
    paw: () => O(24, 30, 9, C.pink) + O(13, 19, 3.8, C.pink) + O(20, 12, 3.8, C.pink) + O(28, 12, 3.8, C.pink) + O(35, 19, 3.8, C.pink),
    bug: () => O(12, 30, 6, C.grn) + O(22, 28, 6.5, C.grn) + O(33, 24, 7.5, C.grn) + eyes(31, 36, 23, 1.3) + P('M31 17 l-2 -6 M36 17 l2 -6') + D(29, 10.5, 1.6) + D(38, 10.5, 1.6) + blush(30, 39, 27, 1.5),
    snake: () => TUBE('M8 36 q6 -10 12 0 q6 10 12 0 q4 -8 0 -14', C.grn, 6) + O(32, 18, 6, C.grn) + eyes(30, 34.5, 17, 1.2) + P('M38 20 l4 1 M41 21 l2 -1.5 M41 21 l2 1.5'),
    // ===== mặt =====
    happy: () => face('happy'), sleep: () => face('sleep', C.lav), sorry: () => face('sweat', C.peach), teary: () => face('teary', C.sky), yum: () => face('yum'),
    love: () => face('love', C.pink), dizzy: () => face('dizzy', C.mint), halo: () => face('halo', C.cream), cold: () => face('cold', C.blue), cool: () => face('cool', C.yel),
    laugh: () => face('laugh'), wink: () => face('wink'), wow: () => face('wow'),
    thanks: () => I.heart() + eyes(19, 29, 23, 1.6) + smile(24, 27, 3.5) + blush(16, 32, 27, 1.8),
    // ===== người =====
    mom: () => person('mom'), dad: () => person('dad'), bro: () => person('bro'), sis: () => person('sis'), kid: () => person('kid'), imouto: () => person('imouto'),
    grandpa: () => person('grandpa'), grandma: () => person('grandma'), baby: () => person('baby'), teacher: () => person('teacher'), student: () => person('student'),
    chef: () => person('chef'), ninja: () => person('ninja'), person: () => person('bro'), hero: () => person('kid'),
    family: () => mini('dad', 13, 19, .62) + mini('mom', 35, 19, .62) + mini('kid', 24, 33, .58),
    friends: () => mini('bro', 14, 26, .7) + mini('sis', 34, 26, .7),
    wave_hand: () => R(13, 9, 5.4, 16, 2.7, C.skin) + R(19, 6, 5.4, 18, 2.7, C.skin) + R(25, 7, 5.4, 17, 2.7, C.skin) + R(31, 10, 5.4, 15, 2.7, C.skin) + E(11, 28, 3.2, 6.5, C.skin, -35) + P('M12 21 H37 V30 q0 11 -12 11 q-13 0 -13 -11 Z', C.skin) + P('M41 7 q3 3 3 8 M5 9 q-2 4 0 9') + blush(18, 31, 32, 2),
    hand: () => I.wave_hand(),
    // ===== thời tiết & thời gian =====
    sun: () => P('M24 4 v5 M24 39 v5 M4 24 h5 M39 24 h5 M10 10 l3.5 3.5 M34.5 34.5 l3.5 3.5 M38 10 l-3.5 3.5 M13.5 34.5 l-3.5 3.5') + O(24, 24, 10, C.yel) + P('M19.5 24 q1.8 -2 3.6 0 M24.9 24 q1.8 -2 3.6 0') + P('M22 27.5 q2 1.6 4 0') + blush(18, 30, 27, 1.6),
    sunrise: () => P('M24 12 v4 M10 18 l3 3 M38 18 l-3 3 M5 27 h4 M39 27 h4') + P('M11 33 a13 13 0 0 1 26 0 Z', C.org) + P('M3 33 H45') + P('M8 39 q4 -2.5 8 0 q4 2.5 8 0 q4 -2.5 8 0 q4 2.5 8 0', 'none'),
    moon: () => P('M30 7 A16 16 0 1 0 41 33 A13 13 0 1 1 30 7 Z', C.yel) + P('M15 25 q2 2 4 0') + D(13, 29, 1.8, C.rose, .8) + P(polar(4, 4, 1.4, 37, 12), C.wht),
    night: () => P('M22 7 A14 14 0 1 0 33 31 A11 11 0 1 1 22 7 Z', C.yel) + P(polar(5, 4.5, 1.9, 36, 12), C.wht) + P(polar(5, 3, 1.3, 39, 28), C.wht) + P(polar(4, 2.6, 1, 10, 40), C.wht),
    star_s: () => I.star(),
    rain_s: () => I.rain(),
    cloudsun: () => P('M28 12 v-4 M37 15 l3 -3 M40 24 h4') + O(30, 21, 7, C.yel) + G('translate(-3 4) scale(.85)', cloud()),
    snow: () => TUBE('M24 7 V41 M9 15.5 L39 32.5 M39 15.5 L9 32.5', C.sky, 2.6) + P('M19 9 l5 4 l5 -4 M19 39 l5 -4 l5 4'),
    snowman: () => O(24, 32, 10.5, C.wht) + O(24, 16, 7.5, C.wht) + P('M16 11 H32') + R(18.5, 3, 11, 8, 1.5, C.ink) + eyes(21, 27, 15, 1.2) + F('M24 17 l5 1.2 l-5 1.2 Z', C.org) + TUBE('M17.5 22 q6.5 3 13 0', C.red, 2.4) + D(24, 30, 1.3) + D(24, 35, 1.3),
    maple: () => P('M24 40 V30') + P(polar(7, 17, 8, 24, 23), C.org) + P('M24 31 V14 M24 25 l-6 -5 M24 25 l6 -5'),
    summer: () => P('M5 22 H43 q0 17 -19 17 q-19 0 -19 -17 Z', C.grn) + P('M9 22 H39 q0 13 -15 13 q-15 0 -15 -13 Z', C.rose) + D(18, 27, 1.2) + D(24, 30, 1.2) + D(30, 27, 1.2) + D(24, 25, 1.2),
    wind: () => TUBE('M6 18 H28 q6 0 6 -5 q0 -5 -5 -5', C.sky, 3) + TUBE('M6 27 H36 q6 0 6 6 q0 5 -5 5', C.sky, 3) + TUBE('M10 36 H20', C.sky, 3),
    wave: () => TUBE('M4 32 q6 -6 12 0 q6 6 12 0 q6 -6 12 0', C.blue, 4) + TUBE('M8 20 q5 -10 14 -8 q-5 2 -4 7 q2 4 6 2', C.sky, 3.4),
    globe: () => O(24, 24, 16, C.blue) + F('M14 14 q6 -2 8 3 q-2 4 -6 4 q-2 4 -6 2 q0 -6 4 -9 Z', C.grn) + F('M28 26 q6 -2 8 2 q-1 6 -6 8 q-4 -2 -2 -10 Z', C.grn) + O(24, 24, 16) + H('M14 31 q-2 -3 -2 -6'),
    calendar: () => cal(D(24, 30, 4.4, C.rose)),
    today: () => cal(D(24, 30, 4.4, C.rose)),
    tomorrow: () => cal(TUBE('M17 30 H30 M26 26 L31 30 L26 34', C.grn, 2.4)),
    yesterday: () => cal(TUBE('M31 30 H18 M22 26 L17 30 L22 34', C.lav, 2.4)),
    everyday: () => cal(D(17, 26, 1.6) + D(24, 26, 1.6) + D(31, 26, 1.6) + D(17, 33, 1.6) + D(24, 33, 1.6) + D(31, 33, 1.6, C.red)),
    alarm: () => O(13, 11, 4.5, C.yel) + O(35, 11, 4.5, C.yel) + P('M15 38 l-3 4 M33 38 l3 4') + O(24, 26, 13.5, C.wht) + P('M24 26 V18 M24 26 l6 3') + D(24, 26, 1.8),
    watch: () => R(18, 5, 12, 38, 5, C.lav) + O(24, 24, 9.5, C.wht) + P('M24 24 V18.5 M24 24 l4 2'),
    clock: () => I.alarm(),
    party: () => P('M7 41 L15 19 L29 33 Z', C.yel) + P('M11 30 l6 6 M13 24 l10 10') + P('M22 17 q1 -7 8 -7 M29 24 q6 -3 9 2 M19 12 l-2 -6') + D(36, 9, 2, C.rose) + D(41, 17, 1.8, C.blue) + D(27, 5, 1.8, C.grn) + P('M35 30 l3 2 M40 26 l2 3', 'none'),
    // ===== đồ ăn =====
    rice: () => P('M9 24 q2 -11 15 -11 q13 0 15 11 Z', C.wht) + TUBE('M30 4 L21 21 M37 6 L25 22', C.brn, 1.6) + bowl(C.blue) + P('M15 30 h4 M22 31.5 h4 M29 30 h4'),
    bowl: () => I.rice(),
    drop: () => P('M24 6 q-13 16 -13 24 a13 13 0 0 0 26 0 q0 -8 -13 -24 Z', C.blue) + eyes(20, 28, 30, 1.4) + P('M22.5 33 q1.5 1.3 3 0') + blush(17, 31, 33, 1.7) + H('M16 27 q0 -4 3 -7'),
    tea: () => P('M19 13 q-2 -3 0 -6 M24 13 q-2 -3 0 -6 M29 13 q-2 -3 0 -6') + P('M11 17 H37 V31 q0 9 -9 9 H20 q-9 0 -9 -9 Z', C.grn) + P('M11 17 H37') + sakura(24, 28, .3, C.wht),
    coffee: () => P('M17 12 q-2 -3 0 -6 M24 12 q-2 -3 0 -6') + P('M32 20 h4 q5 0 5 5 q0 5 -5 5 h-4') + P('M9 15 H33 V33 q0 7 -7 7 H16 q-7 0 -7 -7 Z', C.wht) + E(21, 15, 12, 3, C.brn) + P('M21 31 l-3.5 -3.5 a2 2 0 0 1 3.5 -2.4 a2 2 0 0 1 3.5 2.4 Z', C.rose),
    bread: () => P('M8 26 q0 -12 16 -12 q16 0 16 12 q0 4 -4 4 V38 H12 V30 q-4 0 -4 -4 Z', C.org) + P('M12 30 V38 H36 V30', C.cream) + P('M17 18 l3 4 M24 16 l2 4 M31 18 l1 4'),
    meat: () => P('M8 20 q4 -9 17 -7 q15 3 14 15 q-1 12 -17 12 q-15 0 -14 -11 Z', C.rose) + O(30, 24, 3.6, C.wht) + P('M13 26 q5 -3 9 1 q4 4 9 1') + H('M14 18 q4 -3 8 -2'),
    egg: () => P('M24 7 q12 0 13 19 q0 14 -13 14 q-13 0 -13 -14 q1 -19 13 -19 Z', C.cream) + eyes(20, 28, 27, 1.5) + P('M22.5 30.5 q1.5 1.3 3 0') + blush(16.5, 31.5, 30, 1.9) + H('M16 21 q1 -6 4 -8'),
    cabbage: () => O(24, 25, 15, C.grn) + P('M24 10 V40 M24 19 l-7 -5 M24 26 l-9 -4 M24 19 l7 -5 M24 26 l9 -4') + P('M9 28 q4 6 10 4 M39 28 q-4 6 -10 4'),
    grapes: () => P('M24 11 q0 -5 3 -6') + P('M26 9 q6 -5 11 -2 q-5 5 -11 2 Z', C.grn) + [[17, 15], [24, 15], [31, 15], [20.5, 22], [27.5, 22], [24, 29], [17, 22], [31, 22], [20.5, 29], [27.5, 29], [24, 36]].map(p => O(p[0], p[1], 4, C.lav)).join(''),
    sushi: () => P('M7 30 q0 -6 8 -7 H33 q8 1 8 7 q0 7 -8 7 H15 q-8 0 -8 -7 Z', C.wht) + P('M6 24 q2 -9 18 -9 q16 0 18 9 q-2 4 -18 4 q-16 0 -18 -4 Z', C.org) + `<path d="M14 18 l3 6 M21 16 l2 7 M29 16 l1 7 M36 18 l-1 6" class="hl" style="stroke-width:2.2"/>`,
    ramen: () => P('M9 23 q3 -3 6 0 q3 3 6 0 q3 -3 6 0 q3 3 6 0 q3 -3 6 0') + E(17, 20, 4.5, 3.2, C.wht) + D(17, 20, 1.8, C.yel) + O(31, 19, 4, C.wht) + P('M31 17.5 q2 0 1.5 1.8 q-.8 1.5 -2.5 .5', 'none') + TUBE('M34 3 L28 18 M40 5 L32 19', C.brn, 1.6) + bowl(C.red) + P('M14 30 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3'),
    pho: () => P('M9 23 q3 -3 6 0 q3 3 6 0 q3 -3 6 0 q3 3 6 0 q3 -3 6 0') + P('M14 20 q3 -6 7 -3 q-3 5 -7 3 Z', C.grn) + P('M27 19 q4 -5 8 -1 q-4 4 -8 1 Z', C.grn) + D(22, 19, 1.5, C.red) + D(33, 21, 1.5, C.red) + TUBE('M36 4 L30 18', C.brn, 1.6) + bowl(C.wht) + P('M13 29 q3 3 6 0 q3 -3 6 0 q3 3 6 0 q3 -3 6 0', 'none'),
    apple: () => P('M24 15 q0 -5 2 -8') + P('M25 11 q5 -6 11 -3 q-4 5 -11 3 Z', C.grn) + P('M24 15 q-4 -3 -9 -2 q-7 2 -7 11 q0 13 9 15 q4 1 7 -1 q3 2 7 1 q9 -2 9 -15 q0 -9 -7 -11 q-5 -1 -9 2 Z', C.red) + H('M13 21 q1 -4 4 -5'),
    mandarin: () => P('M24 12 q0 -4 3 -5') + P('M26 10 q5 -5 10 -2 q-4 5 -10 2 Z', C.grn) + O(24, 26, 14, C.org) + D(18, 23, .9, C.dbrn) + D(29, 29, .9, C.dbrn) + D(23, 33, .9, C.dbrn) + H('M14 22 q1 -4 5 -6'),
    peach: () => P('M24 13 q-12 -2 -13 12 q-1 14 13 15 q14 -1 13 -15 q-1 -14 -13 -12 Z', C.pink) + P('M24 13 q-4 12 0 27') + P('M24 13 q6 -7 12 -4 q-5 5 -12 4 Z', C.grn),
    cake: () => P('M24 6 q5 0 5 5 q0 4 -5 6 q-5 -2 -5 -6 q0 -5 5 -5 Z', C.red) + P('M21 6 l3 2 l3 -2') + P('M8 22 H40 V36 q0 3 -3 3 H11 q-3 0 -3 -3 Z', C.cream) + P('M8 22 q2 -6 16 -6 q14 0 16 6 q-3 3 -5 0 q-3 3 -6 0 q-3 3 -5 0 q-3 3 -6 0 q-3 3 -5 0 q-3 3 -5 0 Z', C.wht) + P('M8 30 H40') + D(14, 30, 1.6, C.red) + D(22, 30, 1.6, C.red) + D(30, 30, 1.6, C.red) + D(37, 30, 1.6, C.red),
    onigiri: () => P('M24 8 q4 0 7 5 l9 16 q3 8 -6 10 H14 q-9 -2 -6 -10 l9 -16 q3 -5 7 -5 Z', C.wht) + R(17, 29, 14, 10, 2, C.ink) + eyes(20, 28, 23, 1.5) + P('M22.5 26 q1.5 1.3 3 0') + blush(16, 32, 26, 1.8),
    juice: () => TUBE('M27 12 L31 3 H37', C.rose, 2.2) + P('M13 16 H35 L32 41 H16 Z', C.org) + P('M10 12 H38 V16 H10 Z', C.wht) + P('M14.5 23 H33.5') + O(24, 31, 3.2, C.yel),
    candy: () => P('M16 24 L7 17 V31 Z', C.pink) + P('M32 24 L41 17 V31 Z', C.pink) + O(24, 24, 9, C.pink) + P('M18 22 q6 -6 12 0 M18 26 q6 6 12 0'),
    icecream: () => P('M15 23 L24 43 L33 23 Z', C.org) + P('M17 27 l13 0 M20 33 h8') + O(24, 17, 10, C.pink) + D(20, 14, 1.3, C.red) + D(28, 16, 1.3, C.yel) + D(23, 20, 1.3, C.blue),
    cheese: () => P('M6 32 L36 12 L42 20 V36 H6 Z', C.yel) + P('M6 32 H42') + O(15, 26, 2.5, C.org) + O(30, 30, 3, C.org) + O(35, 20, 2, C.org),
    tomato: () => O(24, 27, 14, C.red) + P(polar(5, 7, 2.5, 24, 14), C.grn) + H('M14 25 q1 -4 4 -6'),
    lemon: () => E(24, 25, 15, 11, C.yel, -20) + P('M37 17 l4 -3 M10 33 l-3 3') + H('M15 22 q3 -5 9 -6'),
    banana: () => P('M9 14 q0 22 22 24 q8 0 10 -4 q-18 2 -26 -22 Z', C.yel) + P('M9 14 l-1 -4 l3 1'),
    pizza: () => P('M6 12 q18 -6 36 0 L24 42 Z', C.yel) + P('M6 12 q18 -6 36 0 l-2 4 q-16 -5 -32 0 Z', C.org) + O(20, 22, 2.8, C.red) + O(28, 24, 2.8, C.red) + O(24, 32, 2.4, C.red),
    chocolate: () => R(11, 6, 26, 36, 3, C.dbrn) + P('M11 18 H37 M11 30 H37 M24 6 V42') + P('M11 22 L37 40 V42 H11 Z', C.rose),
    milk: () => P('M14 16 L18 9 H30 L34 16 V40 H14 Z', C.wht) + P('M14 16 H34') + R(18, 21, 12, 12, 3, C.sky) + P('M18 9 V5 H30 V9'),
    mushroom: () => P('M18 26 H30 L31 40 H17 Z', C.cream) + P('M6 26 q0 -16 18 -16 q18 0 18 16 Z', C.red) + O(17, 18, 2.6, C.wht) + O(29, 16, 3, C.wht) + O(35, 22, 1.8, C.wht),
    gyoza: () => P('M6 30 q0 -16 18 -16 q18 0 18 16 Z', C.cream) + P('M10 22 l3 3 M16 17 l2 4 M24 15 v4 M32 17 l-2 4 M38 22 l-3 3') + eyes(20, 28, 25, 1.3) + blush(16, 32, 27, 1.5),
    wine: () => P('M14 7 H34 q0 14 -10 14 q-10 0 -10 -14 Z', C.rose) + P('M24 21 V36 M16 38 H32'),
    // ===== đồ vật =====
    pen: () => P('M33 8 l7 7 L18 37 l-9 2 l2 -9 Z', C.blue) + P('M30 11 l7 7 M11 30 l7 7') + H('M28 15 l-12 12'),
    bag: () => P('M17 20 q0 -10 7 -10 q7 0 7 10') + P('M8 20 H40 L37 41 H11 Z', C.rose) + O(24, 26, 2.2, C.yel),
    chair: () => P('M14 24 V8 M34 24 V8') + R(13, 8, 22, 9, 3, C.org) + P('M10 24 H38 V29 H10 Z', C.brn) + P('M13 29 V42 M35 29 V42'),
    phone: () => R(14, 5, 20, 38, 6, C.ink) + R(17, 10, 14, 24, 2, C.sky) + D(24, 38.5, 1.8, C.wht) + H('M20 14 v6'),
    umbrella: () => P('M24 24 V37 q0 4 -4 4 q-3 0 -3 -3') + P('M24 9 V5') + P('M5 25 q0 -17 19 -17 q19 0 19 17 q-3 -3 -6.3 0 q-3 -3 -6.3 0 q-3.2 -3 -6.4 0 q-3.2 -3 -6.4 0 q-3.2 -3 -6.3 0 q-3.2 -3 -6.3 0 Z', C.rose) + P('M24 8 q-6 6 -6.3 17 M24 8 q6 6 6.3 17'),
    shoes: () => P('M6 34 V23 q0 -4 4 -4 h6 q2 6 8 6 h6 q12 2 12 10 V35 Z', C.blue) + P('M6 34 H42 V37 q0 3 -3 3 H9 q-3 0 -3 -3 Z', C.wht) + P('M18 24 l3 -2 M22 26 l3 -2 M26 27 l2 -2'),
    shirt: () => P('M17 8 L7 14 L11 22 L15 20 V40 H33 V20 L37 22 L41 14 L31 8 q-7 5 -14 0 Z', C.blue) + sakura(24, 27, .3, C.wht),
    glasses: () => P('M8 24 L5 19 M40 24 l3 -5') + O(15, 26, 7.5, C.sky) + O(33, 26, 7.5, C.sky) + P('M22.5 25 q1.5 -2 3 0') + H('M11 23 q2 -3 5 -3') + H('M29 23 q2 -3 5 -3'),
    key: () => TUBE('M20 25 L39 39 M31 33 l-3 4 M35 36 l-3 4', C.yel, 3) + O(15, 19, 9, C.yel) + O(15, 19, 3.2, C.wht),
    school: () => P('M8 20 H40 V41 H8 Z', C.cream) + P('M4 21 L24 8 L44 21 Z', C.rose) + O(24, 16, 3.6, C.wht) + R(20, 31, 8, 10, 1.5, C.brn) + R(11, 25, 6, 6, 1.5, C.sky) + R(31, 25, 6, 6, 1.5, C.sky) + P('M24 8 V3 l5 1.5 l-5 1.5'),
    car: () => P('M5 32 V26 q0 -3 3 -4 l7 -1 l5 -7 q1 -2 4 -2 h8 q3 0 4 2 l4 7 h2 q5 0 5 5 V32 Z', C.red) + P('M18 21 l4 -6 h4 V21 Z', C.sky) + P('M30 21 V15 h2 l3 6 Z', C.sky) + O(14, 33, 4.8, C.ink) + O(34, 33, 4.8, C.ink) + D(14, 33, 1.6, '#fff') + D(34, 33, 1.6, '#fff'),
    tower: () => P('M24 2 V7') + P('M24 7 L34 42 H28 L24 31 L20 42 H14 Z', C.red) + R(17.5, 18, 13, 3.5, 1, C.wht) + R(15.5, 28, 17, 3.5, 1, C.wht) + P('M21.5 13 H26.5'),
    tag: () => P('M7 22 V9 q0 -2 2 -2 H22 L41 26 L26 41 Z', C.yel) + O(14, 14, 2.6, C.wht) + T(27, 30, '¥', 11),
    rocket: () => P('M19 34 q5 13 10 0 Z', C.org) + P('M15 26 L9 34 V39 L15 34 Z', C.rose) + P('M33 26 L39 34 V39 L33 34 Z', C.rose) + P('M24 5 q9 7 9 20 V34 H15 V25 q0 -13 9 -20 Z', C.wht) + P('M24 5 q4 3 6.4 7 H17.6 q2.4 -4 6.4 -7 Z', C.rose) + O(24, 21, 4.2, C.sky),
    headphones: () => P('M10 29 V24 q0 -14 14 -14 q14 0 14 14 V29') + R(6, 25, 9, 13, 4, C.rose) + R(33, 25, 9, 13, 4, C.rose),
    cart: () => P('M3 9 H10 L16 32 H37') + P('M11 14 H42 L38 28 H14.5 Z', C.yel) + P('M20 14 l2 14 M28 14 l1 14 M36 14 l-1 14') + O(18, 38, 3, C.wht) + O(34, 38, 3, C.wht),
    house: () => I.home(),
    map: () => P('M6 12 L17 8 L31 12 L42 8 V36 L31 40 L17 36 L6 40 Z', C.cream) + P('M17 8 V36 M31 12 V40') + P('M10 30 q6 -6 10 0 q4 6 10 -4 q4 -6 8 -2', 'none') + P(polar(5, 3.5, 1.4, 36, 20), C.red),
    boat: () => P('M24 6 V30') + P('M25 8 L39 28 H25 Z', C.wht) + P('M23 12 L12 28 H23 Z', C.pink) + P('M6 31 H42 L36 39 H12 Z', C.dblue),
    camera: () => R(6, 14, 36, 25, 6, C.gry) + P('M16 14 l3 -5 h10 l3 5') + O(24, 26, 8, C.sky) + O(24, 26, 4, C.ink) + D(35, 19, 1.6, C.red),
    tv: () => R(6, 12, 36, 25, 5, C.lav) + R(10, 16, 28, 17, 3, C.sky) + P('M18 6 l6 6 l6 -6 M15 41 h18') + eyes(20, 28, 23, 1.3) + P('M22.5 26 q1.5 1.3 3 0'),
    ball: () => O(24, 24, 15, C.wht) + P(polar(5, 5.5, 4.5, 24, 24, -Math.PI / 2), C.ink) + P('M24 18.5 V9.5 M29.2 22.3 L37.5 19 M27.2 28.4 L32 36 M20.8 28.4 L16 36 M18.8 22.3 L10.5 19'),
    suitcase: () => P('M18 13 V8 H30 V13') + R(7, 13, 34, 26, 5, C.org) + P('M15 13 V39 M33 13 V39'),
    note: () => R(9, 6, 30, 36, 4, C.wht) + P('M15 15 H33 M15 22 H33 M15 29 H27') + P('M33 35 l4 -4', 'none') + D(14, 36, 1.5, C.rose),
    ribbon: () => P('M24 24 q-12 -12 -16 -4 q-2 8 16 4 q12 -12 16 -4 q2 8 -16 4 Z', C.rose) + P('M22 26 L16 40 L20 38 L22 41 L24 27 M26 26 L32 40 L28 38 L26 41 L24 27', C.rose) + O(24, 24, 3.2, C.pink),
    robot: () => P('M24 9 V5') + D(24, 4, 2, C.red) + R(9, 10, 30, 26, 7, C.gry) + O(18, 22, 4, C.sky) + O(30, 22, 4, C.sky) + R(18, 29, 12, 3.5, 1.5, C.wht) + P('M9 21 H5 V27 H9 M39 21 h4 v6 h-4'),
    plane: () => P('M24 4 q3 0 3 6 V20 L42 29 V33 L27 28 V37 L32 41 V43 L24 41 L16 43 V41 L21 37 V28 L6 33 V29 L21 20 V10 q0 -6 3 -6 Z', C.wht) + H('M24 8 v6'),
    clover: () => [0, 90, 180, 270].map(a => `<path d="M24 24 C16 18 16 9 21 9 C24 9 24 12 24 13 C24 12 24 9 27 9 C32 9 32 18 24 24 Z" fill="${C.grn}" class="o" transform="rotate(${a} 24 24)"/>`).join('') + P('M24 24 q5 10 10 14'),
    thumb: () => P('M16 22 L22 10 q3 -4 5 0 q1 3 -1 9 H37 q4 0 4 4 q0 2 -2 3 q2 1 1 4 q-1 2 -2 2 q1 2 -1 4 q-1 2 -4 2 H16 Z', C.skin) + R(7, 21, 9, 20, 3, C.blue),
    check_s: () => I.check(),
    building: () => R(10, 8, 28, 34, 3, C.cream) + [14, 21, 28].map(y => R(14, y, 6, 5, 1, C.sky) + R(28, y, 6, 5, 1, C.sky)).join('') + R(20, 34, 8, 8, 1, C.brn),
    // ===== chức năng mới =====
    fishcoin: () => O(24, 24, 17, C.yel) + O(24, 24, 12.5, '#ffeaa3') + P('M13.5 24 q5.5 -7.5 12.5 0 q-7 7.5 -12.5 0 Z', C.org) + P('M26 24 l7 -5.5 v11 Z', C.org) + D(17.6, 23, 1.3) + H('M12.5 15.5 q3 -3.4 7.5 -4.4'),
    omamori: () => P('M24 3 q-5 0 -5 4 q0 3 5 3 q5 0 5 -3 q0 -4 -5 -4 Z', C.yel) + P('M13 15 q0 -5 5 -5 h12 q5 0 5 5 V40 q0 3 -3 3 H16 q-3 0 -3 -3 Z', C.rose) + P('M13 17 H35') + R(18, 21, 12, 17, 2.5, C.wht) + T(24, 33.5, '守', 9.5, K, 1),
    shop: () => P('M9 18 V41 H39 V18', C.cream) + P('M6 18 L10 7 H38 L42 18 Z', C.rose) + P('M17 7 l-2 11 M24 7 v11 M31 7 l2 11') + P('M6 18 q4.5 5 9 0 q4.5 5 9 0 q4.5 5 9 0 q4.5 5 9 0', C.wht) + R(13, 26, 10, 15, 2, C.sky) + R(27, 26, 8, 8, 2, C.sky) + D(21, 34, 1),
    keyboard: () => R(4, 13, 40, 24, 6, C.lav) + [9.5, 16.5, 23.5, 30.5, 37.5].map(x => R(x - 2.6, 17.5, 5.2, 4.6, 1.3, C.wht)).join('') + [13, 20, 27, 34].map(x => R(x - 2.6, 24, 5.2, 4.6, 1.3, C.wht)).join('') + R(15, 30.5, 18, 3.6, 1.6, C.wht),
    scroll: () => R(10, 9, 28, 30, 2, C.cream) + R(7, 5, 34, 6, 3, C.brn) + R(7, 37, 34, 6, 3, C.brn) + P('M16 16 v16 M22 16 v10 M28 16 v16 M34 16 v7'),
    printer: () => R(13, 5, 22, 13, 2, C.wht) + R(5, 15, 38, 18, 5, C.gry) + R(12, 26, 24, 16, 2, C.wht) + P('M16 31 h16 M16 36.5 h10') + D(37.5, 21, 2, C.grn) + O(37.5, 21, 2),
    chest: () => P('M7 21 q0 -11 17 -11 q17 0 17 11 Z', C.org) + R(7, 21, 34, 18, 3, C.brn) + P('M15 11 V39 M33 11 V39') + R(19.5, 17, 9, 10, 2.5, C.yel) + D(24, 22, 1.5) + H('M11 17 q2 -4 6 -5'),
    chest_open: () => D(24, 17, 12, C.yel, .45) + P('M8 18 L12 5 H36 L40 18 Z', C.org) + O(18, 17, 3.2, C.yel) + O(26, 14.5, 3.2, C.yel) + O(31, 18.5, 2.8, C.yel) + R(7, 20, 34, 19, 3, C.brn) + P('M15 20 V39 M33 20 V39') + R(19.5, 20, 9, 8, 2.5, C.yel) + P(polar(4, 4.5, 1.6, 9, 9), '#fff') + P(polar(4, 3.5, 1.2, 40, 11), '#fff'),
    quest: () => R(9, 9, 30, 33, 5, C.wht) + R(17, 5, 14, 8, 3, C.lav) + P('M15 21 l2.5 2.5 l4.5 -5 M15 31 l2.5 2.5 l4.5 -5') + P('M26 21 H33 M26 31 H33'),
    more: () => R(8, 8, 13, 13, 4.5, C.pink) + R(27, 8, 13, 13, 4.5, C.yel) + R(8, 27, 13, 13, 4.5, C.blue) + R(27, 27, 13, 13, 4.5, C.grn),
    lantern: () => P('M24 3 V8') + E(24, 24, 12.5, 15, C.red) + P('M12.5 18 q11.5 3 23 0 M11.6 24 q12.4 3 24.8 0 M12.5 30 q11.5 3 23 0') + R(16.5, 6, 15, 5, 2, C.ink) + R(16.5, 37, 15, 5, 2, C.ink) + P('M24 42 v3') + H('M17 15 q2 -3 5 -4'),
    sakura_tree: () => P('M21.5 43 q1.5 -9 -1 -17 h5 q-1.5 8 1 17 Z', C.brn) + O(14, 21, 8.5, C.pink) + O(34, 21, 8.5, C.pink) + O(24, 13, 9.5, C.pink) + O(24, 24, 8.5, C.pink) + D(17, 15, 1.5, C.rose) + D(30, 16, 1.5, C.rose) + D(21, 23, 1.5, C.rose) + D(33, 25, 1.4, C.rose),
    medal: () => P('M15 4 L21 18 M33 4 L27 18', 'none') + P('M13 4 h8 l4 9 h-8 Z', C.blue) + P('M35 4 h-8 l-4 9 h8 Z', C.rose) + O(24, 29, 12, C.yel) + O(24, 29, 7.5, '#ffeaa3') + P('M24 24.5 l1.4 2.9 l3.1 .4 l-2.3 2.1 l.6 3.1 l-2.8 -1.6 l-2.8 1.6 l.6 -3.1 l-2.3 -2.1 l3.1 -.4 Z', C.org),
    // màu
  };
  function cal(inner) { return R(8, 10, 32, 30, 6, C.wht) + P('M8 19 q0 -9 6 -9 H34 q6 0 6 9 Z', C.red) + P('M17 6 V14 M31 6 V14') + inner; }
  const splat = 'M24 7 q6 0 7 5 q6 -2 8 3 q2 5 -2 8 q5 3 2 8 q-3 5 -8 2 q-1 7 -7 7 q-6 0 -7 -6 q-5 3 -8 -1 q-3 -5 2 -8 q-6 -3 -3 -8 q3 -5 8 -3 q1 -6 8 -7 Z';
  const COLORS = { c_red: '#ef5b5b', c_blue: '#5b9ee8', c_yellow: '#f8d24a', c_green: '#6cc070', c_white: '#ffffff', c_black: '#3f3744', c_pink: '#f7a1c4', c_brown: '#a8714a', c_purple: '#a87fe0', c_orange: '#f59a3e' };
  Object.keys(COLORS).forEach(k => { I[k] = () => P(splat, COLORS[k]) + H('M17 15 q3 -3 6 -2') + D(40, 38, 2.4, COLORS[k]) + O(40, 38, 2.4); });
  const NUMS = { n0: '0', n1: '1', n2: '2', n3: '3', n4: '4', n5: '5', n6: '6', n7: '7', n8: '8', n9: '9', n10: '10', n100: '100', n1000: '1000', n10000: '1万' };
  const NCOL = [C.pink, C.yel, C.blue, C.grn, C.lav, C.peach];
  Object.keys(NUMS).forEach((k, i) => { const t = NUMS[k]; const s = t.length >= 4 ? 13 : t.length === 3 ? 16 : t.length === 2 ? 20 : 24; I[k] = () => R(7, 7, 34, 34, 10, NCOL[i % NCOL.length]) + T(24, 24 + s * .36, t, s); });

  const cache = {};
  // ---------- Icon nét mảnh (dùng trong nút bấm, theo màu chữ của nút) ----------
  const GL = {
    arrow_r: '<path d="M5 12h13.5M13 6.5 18.5 12 13 17.5"/>',
    arrow_l: '<path d="M19 12H5.5M11 6.5 5.5 12l5.5 5.5"/>',
    play: '<path class="f" d="M8 5.8v12.4a.8.8 0 0 0 1.2.7l9.6-6.2a.8.8 0 0 0 0-1.4L9.2 5.1A.8.8 0 0 0 8 5.8z"/>',
    check: '<path d="M5 12.5 9.6 17 19 7.5"/>',
    batsu: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4.2h-4.2"/>',
    speaker: '<path class="f" d="M4 9.6h3.4L12 6v12l-4.6-3.6H4z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6M18.2 6.6a7.6 7.6 0 0 1 0 10.8"/>',
    mute: '<path class="f" d="M4 9.6h3.4L12 6v12l-4.6-3.6H4z"/><path d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>',
    pencil: '<path d="M4.5 19.5l1-4.4L15.6 5a2.1 2.1 0 0 1 3 0l.4.4a2.1 2.1 0 0 1 0 3L8.9 18.5zM13.6 7l3.4 3.4"/>',
    eraser: '<path d="M8.5 19.5H20M5.6 15.4l8.8-8.8a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L12 19.1H8.6zM9.6 11.4l5 5"/>',
    bulb: '<path d="M9.2 17.5h5.6M10.2 20.5h3.6M12 3.5a5.8 5.8 0 0 0-3.4 10.5c.6.5.9 1.1.9 1.9v.1h5v-.1c0-.8.3-1.4.9-1.9A5.8 5.8 0 0 0 12 3.5z"/>',
    eye: '<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.8"/>',
    undo: '<path d="M9 5.5 4.5 10 9 14.5M4.5 10H15a4.8 4.8 0 0 1 0 9.6h-3"/>',
    slow: '<path d="M4 16.5h13.5a3 3 0 0 0 3-3v-1"/><path d="M5.5 16.5a6.5 5.5 0 0 1 12 0"/><path d="M8 16.5v2.5M14.5 16.5v2.5M20.5 12.5h.1"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 15.5V4.5M7 9.5l5-5 5 5M5 20h14"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l1 12.5h9l1-12.5M10 10.5v6M14 10.5v6"/>',
    question: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2 1-1.2 1.8v.3"/><path d="M12 16.8h.01" stroke-width="3"/>',
    printer: '<path d="M7 9V4h10v5M7 17H5.2A1.7 1.7 0 0 1 3.5 15.3v-4.6A1.7 1.7 0 0 1 5.2 9h13.6a1.7 1.7 0 0 1 1.7 1.7v4.6a1.7 1.7 0 0 1-1.7 1.7H17M7 13.5h10V20H7z"/>',
    book: '<path d="M12 6.8C10 5.3 7.2 4.8 3.8 5.2v12.6c3.4-.4 6.2.1 8.2 1.6 2-1.5 4.8-2 8.2-1.6V5.2c-3.4-.4-6.2.1-8.2 1.6zM12 6.8v12.6"/>',
    sparkle: '<path d="M12 3.8l1.7 4.8 4.8 1.7-4.8 1.7L12 16.8l-1.7-4.8-4.8-1.7 4.8-1.7zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  };
  const glyph = (name, size, cls) => `<svg class="gl ${cls || ''}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${GL[name]}</svg>`;

  function icon(name, size, cls) {
    size = size || 24;
    // cỡ nhỏ (trong nút, nhãn) → icon nét mảnh cùng màu chữ cho gọn gàng
    if (size <= 24 && GL[name]) return glyph(name, size, cls);
    const fn = I[name];
    if (!fn) return '';
    const inner = cache[name] || (cache[name] = fn());
    return `<svg class="ic ${cls || ''}" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
  }
  SJ.glyph = (n, s, c) => GL[n] ? glyph(n, s || 20, c) : icon(n, s, c);
  SJ.icon = icon;
  // cho các file khác vẽ thêm icon cùng phong cách: SJ.addIcons({ten: K => K.O(24,24,10,K.C.pink)}, {ten_net: '<path d=...>'})
  SJ.addIcons = (map, glyphs) => {
    const K = { P, F, O, D, R, E, H, T, G, C, sakura };
    Object.keys(map || {}).forEach(k => { const f = map[k]; I[k] = () => f(K); delete cache[k]; });
    Object.assign(GL, glyphs || {});
    SJ.ICON_NAMES = Object.keys(I);
  };
  SJ.hasIcon = n => !!I[n];
  SJ.ICON_NAMES = Object.keys(I);
  SJ.drawSakura = (s, col) => sakura(24, 24, s || 1.4, col);
})(window.SJ);
