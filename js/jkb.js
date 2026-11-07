/* SubelJapan — Bàn phím tiếng Nhật trên màn hình (không cần cài bộ gõ)
 * Ba kiểu như người Nhật dùng thật:
 *   フリック入力 — bàn phím 12 phím trên điện thoại (nhắn tin): chạm = chữ giữa, vuốt ← ↑ → ↓ = 4 chữ còn lại
 *   ローマ字入力 — bàn phím máy tính JIS, gõ romaji (ka → か)
 *   かな入力   — bàn phím máy tính JIS, mỗi phím một chữ kana (T → か, @ → ゛)
 * Chỉ phím cần bấm tiếp theo (+ hướng vuốt / ngón tay), sáng phím khi gõ bằng bàn phím thật,
 * bấm thẳng lên phím được (điện thoại: không bật bàn phím của máy).
 * SJ.jkb.mount(chỗ đặt, ô nhập, { target: () => chuỗi đích, enter: true, placeholder }) → { update, destroy }
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const DAK = '゙', HAN = '゚';
  // ======================= BÀN PHÍM MÁY TÍNH (JIS) =======================
  // [mã phím (KeyboardEvent.code), chữ in trên phím, kana, kana khi giữ Shift, ngón tay, kiểu phím, độ rộng]
  const ROWS = [
    [['Backquote', '半角/全角', '', '', 'lp', 'mod', 1], ['Digit1', '1', 'ぬ', '', 'lp'], ['Digit2', '2', 'ふ', '', 'lr'], ['Digit3', '3', 'あ', 'ぁ', 'lm'], ['Digit4', '4', 'う', 'ぅ', 'li'], ['Digit5', '5', 'え', 'ぇ', 'li'], ['Digit6', '6', 'お', 'ぉ', 'ri'], ['Digit7', '7', 'や', 'ゃ', 'ri'], ['Digit8', '8', 'ゆ', 'ゅ', 'rm'], ['Digit9', '9', 'よ', 'ょ', 'rr'], ['Digit0', '0', 'わ', 'を', 'rp'], ['Minus', '-', 'ほ', '', 'rp'], ['Equal', '^', 'へ', '', 'rp'], ['IntlYen', '¥', 'ー', '', 'rp'], ['Backspace', '⌫', '', '', 'rp', 'mod bs', 1]],
    [['Tab', 'Tab', '', '', 'lp', 'mod', 1.5], ['KeyQ', 'Q', 'た', '', 'lp'], ['KeyW', 'W', 'て', '', 'lr'], ['KeyE', 'E', 'い', 'ぃ', 'lm'], ['KeyR', 'R', 'す', '', 'li'], ['KeyT', 'T', 'か', '', 'li'], ['KeyY', 'Y', 'ん', '', 'ri'], ['KeyU', 'U', 'な', '', 'ri'], ['KeyI', 'I', 'に', '', 'rm'], ['KeyO', 'O', 'ら', '', 'rr'], ['KeyP', 'P', 'せ', '', 'rp'], ['BracketLeft', '@', '゛', '', 'rp'], ['BracketRight', '[', '゜', '「', 'rp'], ['Enter', 'Enter', '', '', 'rp', 'mod enter', 1.5]],
    [['CapsLock', '英数', '', '', 'lp', 'mod', 1.75], ['KeyA', 'A', 'ち', '', 'lp'], ['KeyS', 'S', 'と', '', 'lr'], ['KeyD', 'D', 'し', '', 'lm'], ['KeyF', 'F', 'は', '', 'li', 'home'], ['KeyG', 'G', 'き', '', 'li'], ['KeyH', 'H', 'く', '', 'ri'], ['KeyJ', 'J', 'ま', '', 'ri', 'home'], ['KeyK', 'K', 'の', '', 'rm'], ['KeyL', 'L', 'り', '', 'rr'], ['Semicolon', ';', 'れ', '', 'rp'], ['Quote', ':', 'け', '', 'rp'], ['Backslash', ']', 'む', '」', 'rp'], ['Enter2', '', '', '', 'rp', 'mod enter2', 1.25]],
    [['ShiftLeft', 'Shift', '', '', 'lp', 'mod shift', 2.25], ['KeyZ', 'Z', 'つ', 'っ', 'lp'], ['KeyX', 'X', 'さ', '', 'lr'], ['KeyC', 'C', 'そ', '', 'lm'], ['KeyV', 'V', 'ひ', '', 'li'], ['KeyB', 'B', 'こ', '', 'li'], ['KeyN', 'N', 'み', '', 'ri'], ['KeyM', 'M', 'も', '', 'ri'], ['Comma', ',', 'ね', '、', 'rm'], ['Period', '.', 'る', '。', 'rr'], ['Slash', '/', 'め', '・', 'rp'], ['IntlRo', '\\', 'ろ', '', 'rp'], ['ShiftRight', 'Shift', '', '', 'rp', 'mod shift', 1.75]],
    [['ControlLeft', 'Ctrl', '', '', 'lp', 'mod', 1.5], ['MetaLeft', 'Win', '', '', 'lp', 'mod', 1.25], ['AltLeft', 'Alt', '', '', 'th', 'mod', 1.25], ['NonConvert', '無変換', '', '', 'th', 'mod', 1.5], ['Space', '', '', '', 'th', 'space', 4], ['Convert', '変換', '', '', 'th', 'mod', 1.5], ['KanaMode', 'かな', '', '', 'th', 'mod', 1.5], ['AltRight', 'Alt', '', '', 'th', 'mod', 1.25], ['ControlRight', 'Ctrl', '', '', 'rp', 'mod', 1.25]],
  ];
  const KEYS = {}; ROWS.flat().forEach(k => { KEYS[k[0]] = { code: k[0], lab: k[1], kana: k[2], skana: k[3], f: k[4], cls: k[5] || '', w: k[6] || 1 }; });
  const KANA_KEY = {};
  Object.values(KEYS).forEach(k => { if (k.kana) KANA_KEY[k.kana] = [k.code, false]; if (k.skana) KANA_KEY[k.skana] = [k.code, true]; });
  const FINGER = { lp: 'ngón út trái', lr: 'ngón áp út trái', lm: 'ngón giữa trái', li: 'ngón trỏ trái', ri: 'ngón trỏ phải', rm: 'ngón giữa phải', rr: 'ngón áp út phải', rp: 'ngón út phải', th: 'ngón cái' };
  const HELP = {
    Backquote: '<b>半角/全角</b> (hankaku/zenkaku): bật / tắt gõ tiếng Nhật — chuyển qua lại giữa chữ Latin và chữ Nhật.',
    CapsLock: '<b>英数</b> (eisū): chuyển về gõ chữ Latin và số.',
    NonConvert: '<b>無変換</b> (muhenkan): không đổi sang Kanji, giữ nguyên chữ kana vừa gõ.',
    Convert: '<b>変換</b> (henkan): gõ xong một từ thì bấm phím này (hoặc phím cách) để đổi sang chữ Kanji.',
    KanaMode: '<b>カタカナ/ひらがな</b>: đổi kiểu chữ Hiragana ↔ Katakana. Bấm <b>Alt</b> + phím này để bật / tắt kiểu gõ Kana.',
    Space: '<b>Phím cách</b>: trong bộ gõ Nhật còn dùng để đổi chữ vừa gõ sang Kanji.',
    Enter: '<b>Enter</b>: chốt chữ đã gõ (khi đang đổi Kanji).', Enter2: '<b>Enter</b>: chốt chữ đã gõ (khi đang đổi Kanji).',
    ShiftLeft: '<b>Shift</b>: ở kiểu Kana, giữ Shift để gõ chữ nhỏ ぁ ぃ っ ゃ ゅ ょ và を.', ShiftRight: '<b>Shift</b>: ở kiểu Kana, giữ Shift để gõ chữ nhỏ ぁ ぃ っ ゃ ゅ ょ và を.',
    Tab: '<b>Tab</b>: nhảy sang ô tiếp theo.', ControlLeft: '<b>Ctrl</b>: phím tắt.', ControlRight: '<b>Ctrl</b>: phím tắt.', MetaLeft: '<b>Win</b>: phím Windows.', AltLeft: '<b>Alt</b>: phím tắt (Alt + ~ chuyển bộ gõ trên Windows).', AltRight: '<b>Alt</b>: phím tắt.',
  };

  // ======================= BÀN PHÍM ĐIỆN THOẠI (フリック 12 phím) =======================
  // mỗi phím: [chạm, vuốt trái, vuốt lên, vuốt phải, vuốt xuống] + vòng chạm nhiều lần (kiểu điện thoại cũ)
  const FK = [
    { id: 'a', f: ['あ', 'い', 'う', 'え', 'お'], cyc: 'あいうえおぁぃぅぇぉ' },
    { id: 'ka', f: ['か', 'き', 'く', 'け', 'こ'], cyc: 'かきくけこ' },
    { id: 'sa', f: ['さ', 'し', 'す', 'せ', 'そ'], cyc: 'さしすせそ' },
    { id: 'ta', f: ['た', 'ち', 'つ', 'て', 'と'], cyc: 'たちつてとっ' },
    { id: 'na', f: ['な', 'に', 'ぬ', 'ね', 'の'], cyc: 'なにぬねの' },
    { id: 'ha', f: ['は', 'ひ', 'ふ', 'へ', 'ほ'], cyc: 'はひふへほ' },
    { id: 'ma', f: ['ま', 'み', 'む', 'め', 'も'], cyc: 'まみむめも' },
    { id: 'ya', f: ['や', '（', 'ゆ', '）', 'よ'], cyc: 'やゆよゃゅょ' },
    { id: 'ra', f: ['ら', 'り', 'る', 'れ', 'ろ'], cyc: 'らりるれろ' },
    { id: 'dk', f: ['小゛゜', '小', '゛', '゜', ''], cyc: '', mod: true },
    { id: 'wa', f: ['わ', 'を', 'ん', 'ー', ''], cyc: 'わをんゎー' },
    { id: 'pu', f: ['、', '。', '？', '！', '…'], cyc: '、。？！…' },
  ];
  const FMAP = {}; // chữ → [phím, hướng]
  FK.forEach((k, ki) => { if (!k.mod) k.f.forEach((c, d) => { if (c && FMAP[c] == null) FMAP[c] = [ki, d]; }); });
  const DIRS = ['chạm', 'vuốt sang trái ←', 'vuốt lên ↑', 'vuốt sang phải →', 'vuốt xuống ↓'];
  const ARROW = ['', '←', '↑', '→', '↓'];
  // phím 小゛゜: đổi chữ vừa gõ theo vòng (か→が, は→ば→ぱ, つ→っ→づ, や→ゃ…)
  const DKG = ['かが', 'きぎ', 'くぐ', 'けげ', 'こご', 'さざ', 'しじ', 'すず', 'せぜ', 'そぞ', 'ただ', 'ちぢ', 'つっづ', 'てで', 'とど', 'はばぱ', 'ひびぴ', 'ふぶぷ', 'へべぺ', 'ほぼぽ', 'あぁ', 'いぃ', 'うぅゔ', 'えぇ', 'おぉ', 'やゃ', 'ゆゅ', 'よょ', 'わゎ'];
  const dkGroup = c => DKG.find(g => g.includes(c));
  const dkNext = c => { const g = dkGroup(c); if (!g) return null; const a = Array.from(g); return a[(a.indexOf(c) + 1) % a.length]; };
  const SMALL = { あ: 'ぁ', い: 'ぃ', う: 'ぅ', え: 'ぇ', お: 'ぉ', や: 'ゃ', ゆ: 'ゅ', よ: 'ょ', つ: 'っ', わ: 'ゎ' };
  const BIG = {}; Object.keys(SMALL).forEach(k => { BIG[SMALL[k]] = k; });
  /** cách gõ một chữ bằng bàn phím vuốt: [{ key, dir }] rồi bao nhiêu lần bấm 小゛゜ */
  function flickPlan(c) {
    if (FMAP[c]) return { key: FMAP[c][0], dir: FMAP[c][1], dk: 0 };
    let base = BIG[c] || c.normalize('NFD')[0];
    if (!FMAP[base]) return null;
    const g = dkGroup(base); const n = g ? Array.from(g).indexOf(c) : -1;
    return { key: FMAP[base][0], dir: FMAP[base][1], dk: n > 0 ? n : 1, base };
  }

  // ======================= DÙNG CHUNG =======================
  const PUNCT = /[\s、。！？!?,.「」・〜~（）…]/;
  const VOW = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };
  const vowelOf = c => { const o = SJ.KANA_MAP && SJ.KANA_MAP[c]; return o ? VOW[o.r.slice(-1)] || '' : ''; };
  const hira = s => Array.from(String(s || '')).map(c => (SJ.toHira ? SJ.toHira(c) : c)).join('');
  /** chuỗi đích để chỉ phím: Hiragana, giữ ー, bỏ dấu câu & khoảng trắng */
  const guide = s => Array.from(hira(s)).filter(c => !PUNCT.test(c)).join('');
  const PREF = { し: 'shi', ち: 'chi', つ: 'tsu', ふ: 'fu', じ: 'ji', を: 'wo', しゃ: 'sha', しゅ: 'shu', しょ: 'sho', ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', じゃ: 'ja', じゅ: 'ju', じょ: 'jo', ぢ: 'di', づ: 'du', ゔ: 'vu' };
  let REV = null;
  function rev() {
    if (REV) return REV;
    REV = Object.assign({}, PREF);
    const T = SJ.ime.table, score = k => k.length + (/^[cql]/.test(k) ? 10 : 0) + (/^x/.test(k) ? 4 : 0);
    Object.keys(T).forEach(k => { const v = T[k]; if (!/^[a-z]+$/.test(k) || PREF[v] || !/^[぀-ゟ]+$/.test(v)) return; if (!REV[v] || score(k) < score(REV[v])) REV[v] = k; });
    return REV;
  }
  function units(s) {
    const R = rev(), a = Array.from(s), out = [];
    for (let i = 0; i < a.length;) {
      const two = a[i] + (a[i + 1] || '');
      if (a[i + 1] && R[two] && /[ゃゅょぁぃぅぇぉ]/.test(a[i + 1])) { out.push(two); i += 2; } else { out.push(a[i]); i++; }
    }
    return out;
  }
  function romOf(u, next) {
    if (u === 'っ') { const nr = next ? romOf(next) : ''; return /^[bcdfghjkmpqrstvwxyz]/.test(nr) ? nr[0] : 'xtsu'; }
    if (u === 'ー') return '-';
    if (u === 'ん') return 'nn';
    return rev()[u] || '';
  }
  const eq = (t, g, prevT, prevG) => t === g || (g === 'ー' && t === vowelOf(prevG)) || (t === 'ー' && g === vowelOf(prevT)) || (g === 'ー' && t === vowelOf(prevT));

  let prefs = { mode: 'flick', fingers: false, show: true, v: 2 };
  try { const p = JSON.parse(localStorage.getItem('sj_jkb') || '{}'); Object.assign(prefs, p); if (p.v !== 2) { prefs.mode = 'flick'; prefs.v = 2; } } catch (e) { }
  if (!['flick', 'romaji', 'kana'].includes(prefs.mode)) prefs.mode = 'flick';
  const savePrefs = () => { try { localStorage.setItem('sj_jkb', JSON.stringify(prefs)); } catch (e) { } };
  const esc = s => SJ.ui.esc(s);
  const touch = () => window.matchMedia && matchMedia('(pointer: coarse)').matches;

  function keyHTML(k) {
    const isMod = /mod|space/.test(k.cls);
    return `<button type="button" class="k ${k.cls} f-${k.f}" data-code="${k.code}" style="--w:${k.w}" tabindex="-1" aria-label="${esc(k.lab || (k.code === 'Space' ? 'Phím cách' : k.code))}${k.kana ? ' ' + k.kana : ''}">
      ${isMod ? `<span class="k-mod">${k.code === 'Backquote' ? '半角<br>全角' : k.code === 'Space' ? '<i>space</i>' : esc(k.lab)}</span>` : `<span class="k-lat">${esc(k.lab)}</span><span class="k-kana jp">${k.kana}</span>${k.skana ? `<span class="k-skana jp">${k.skana}</span>` : ''}`}</button>`;
  }
  const jisHTML = () => ROWS.map(r => `<div class="jkb-row">${r.map(c => keyHTML(KEYS[c[0]])).join('')}</div>`).join('');
  function flickHTML() {
    const fk = (k, i) => k.mod
      ? `<button type="button" class="fk fk-dk" data-fk="${i}" tabindex="-1" aria-label="Đổi chữ nhỏ, thêm dấu ゛ ゜"><span class="fk-main jp"><small>小</small>゛゜</span></button>`
      : `<button type="button" class="fk" data-fk="${i}" tabindex="-1" aria-label="${k.f[0]}"><span class="fk-main jp">${k.f[0]}</span>${[1, 2, 3, 4].map(d => k.f[d] ? `<i class="fk-h d${d} jp">${k.f[d]}</i>` : '').join('')}</button>`;
    const side = (cls, act, html, lab) => `<button type="button" class="fk fk-side ${cls}" data-act="${act}" tabindex="-1" aria-label="${lab}">${html}</button>`;
    return `<div class="fk-grid">
      ${side('s-next', 'next', '<b>➜</b>', 'Sang chữ tiếp theo')}${fk(FK[0], 0)}${fk(FK[1], 1)}${fk(FK[2], 2)}${side('s-bs', 'bs', '<b>⌫</b>', 'Xoá')}
      ${side('s-undo', 'undo', '<b>↶</b>', 'Đổi ngược lại')}${fk(FK[3], 3)}${fk(FK[4], 4)}${fk(FK[5], 5)}${side('s-space', 'space', '<span class="jp">空白</span>', 'Dấu cách')}
      ${side('s-abc', 'abc', '<b>ABC</b><small>máy tính</small>', 'Chuyển sang bàn phím máy tính')}${fk(FK[6], 6)}${fk(FK[7], 7)}${fk(FK[8], 8)}${side('s-enter', 'enter', '<span class="jp">改行</span>', 'Xuống dòng / xác nhận')}
      ${fk(FK[9], 9)}${fk(FK[10], 10)}${fk(FK[11], 11)}
      <div class="fk-pop" data-pop hidden></div></div>`;
  }

  /** chú thích ngắn cho từng kiểu bàn phím */
  const legendHTML = () => prefs.mode === 'flick'
    ? `<span class="lg-fl jp"><i class="d2">く</i><i class="d1">き</i><b>か</b><i class="d3">け</i><i class="d4">こ</i></span><span class="lg-txt">Người Nhật nhắn tin trên điện thoại bằng bàn phím <b>vuốt 12 phím</b> (<span class="jp">フリック入力</span>). Mỗi phím là một hàng chữ: <b>chạm</b> ra chữ giữa (<b class="jp">か</b>), chạm giữ rồi <b>vuốt ← ↑ → ↓</b> ra <b class="jp">き く け こ</b>. Thêm dấu <b class="jp">゛゜</b> hoặc chữ nhỏ: gõ chữ xong bấm <b class="jp">小゛゜</b>.</span>`
    : prefs.mode === 'kana'
      ? `<span class="lg-key kana"><b>A</b><i class="jp">ち</i></span><span class="lg-txt">Bàn phím máy tính Nhật in 2 chữ trên mỗi phím. Ở kiểu <b>Kana</b> bạn nhìn <b>chữ to</b>: bấm phím A ra <b class="jp">ち</b>, phím 3 ra <b class="jp">あ</b> — chữ xếp theo vị trí riêng của chuẩn JIS. Ít người dùng kiểu này.</span>`
      : `<span class="lg-key"><b>A</b><i class="jp">ち</i></span><span class="lg-txt">Trên <b>máy tính</b>, người Nhật gõ <b>romaji</b>: chỉ cần nhìn <b>chữ Latin to</b> — gõ <b>a</b> ra <b class="jp">あ</b>, gõ <b>chi</b> ra <b class="jp">ち</b>. Chữ kana nhỏ ở góc chỉ dùng cho kiểu <b>Kana</b>, bỏ qua cũng được.</span>`;

  function mount(host, input, opts) {
    opts = opts || {};
    let shiftOnce = false, helpT = null, alive = true, lastTap = null;
    const MODES = [['flick', 'フリック', 'Điện thoại'], ['romaji', 'ローマ字', 'Máy tính'], ['kana', 'かな', 'Máy tính']];
    host.innerHTML = `<div class="jkb card ${prefs.show ? '' : 'off'}" data-mode="${prefs.mode}">
      <div class="jkb-top">
        <div class="jkb-title">${SJ.icon('keyboard', 30)}<div><b>Bàn phím tiếng Nhật</b><small>giống máy thật · không cần cài bộ gõ</small></div></div>
        <div class="seg jkb-seg" role="tablist">${MODES.map(m => `<button data-m="${m[0]}" class="${prefs.mode === m[0] ? 'active' : ''}"><span class="jp">${m[1]}</span><small>${m[2]}</small></button>`).join('')}</div>
        <label class="switch small jkb-fing"><input type="checkbox" data-fing ${prefs.fingers ? 'checked' : ''}><i></i><span>Màu ngón tay</span></label>
        <button type="button" class="icon-btn jkb-tog" data-tog title="${prefs.show ? 'Ẩn bàn phím' : 'Hiện bàn phím'}" aria-label="${prefs.show ? 'Ẩn bàn phím' : 'Hiện bàn phím'}">${SJ.icon(prefs.show ? 'eye_off' : 'eye', 20)}</button>
      </div>
      <div class="jkb-body ${prefs.fingers ? 'fing' : ''}">
        <div class="jkb-legend" data-legend>${legendHTML()}</div>
        <div class="jkb-keys" data-keys>${prefs.mode === 'flick' ? flickHTML() : jisHTML()}</div>
        <div class="jkb-info" data-info aria-live="polite"></div>
      </div></div>`;
    const box = host.querySelector('.jkb'), info = host.querySelector('[data-info]'), keysEl = host.querySelector('[data-keys]');
    const el = code => host.querySelector(`.k[data-code="${code}"]`);
    const setInputMode = () => { if (touch() && prefs.show) input.setAttribute('inputmode', 'none'); else input.removeAttribute('inputmode'); };
    const placeholder = () => { if (opts.placeholder) input.placeholder = prefs.mode === 'kana' ? opts.placeholder.kana : prefs.mode === 'flick' ? (opts.placeholder.flick || 'Chạm / vuốt phím bên dưới…') : opts.placeholder.romaji; };
    setInputMode(); placeholder();

    function commit() {
      try { input.setSelectionRange(input.value.length, input.value.length); } catch (e) { }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function insert(s) {
      if (input.disabled || input.readOnly) return false;
      const a = Array.from(input.value);
      if (s === '\b') a.pop();
      else if (s === DAK || s === HAN) { const last = a.pop(); const c = last ? (last + s).normalize('NFC') : ''; if (c.length !== 1) { flash('Dấu ゛ ゜ phải bấm <b>sau</b> chữ cần thêm dấu, ví dụ か + ゛ = が.'); return false; } a.push(c); }
      else a.push(s);
      input.value = a.join(''); commit(); return true;
    }
    function replaceLast(c) { const a = Array.from(input.value); a.pop(); a.push(c); input.value = a.join(''); commit(); }
    const lastChar = () => { const a = Array.from(input.value); return a[a.length - 1] || ''; };
    function kanaFor(code, shift) {
      const k = KEYS[code]; if (!k) return null;
      if (k.kana === '゛') return DAK;
      if (k.kana === '゜') return shift && k.skana ? k.skana : HAN;
      return shift && k.skana ? k.skana : k.kana || null;
    }
    function charFor(code) {
      if (code === 'Backspace') return '\b';
      if (code === 'Space') return ' ';
      if (code === 'Enter' || code === 'Enter2') return opts.enter ? '\n' : null;
      if (prefs.mode === 'kana') return kanaFor(code, shiftOnce);
      const k = KEYS[code]; if (!k || /mod/.test(k.cls)) return null;
      if (/^Key/.test(code)) return k.lab.toLowerCase();
      return { Minus: '-', Comma: ',', Period: '.', Slash: '/', BracketLeft: '@', BracketRight: '[', Semicolon: ';', Quote: ':', Backslash: ']', IntlYen: '¥', IntlRo: '\\', Equal: '^' }[code] || k.lab;
    }
    function flash(html) { info.innerHTML = `<span class="jkb-note">${html}</span>`; clearTimeout(helpT); helpT = setTimeout(update, 3200); }
    function press(elx) { if (!elx) return; elx.classList.add('down'); setTimeout(() => elx.classList.remove('down'), 140); }
    const refocus = () => { if (document.activeElement !== input && !touch()) input.focus(); };

    // ---------- phím 小゛゜ ----------
    function dkAction(kind) {
      const c = lastChar();
      if (!c) return flash('Gõ một chữ trước, rồi bấm <b class="jp">小゛゜</b> để thêm dấu hoặc đổi sang chữ nhỏ (か → が, つ → っ).');
      let nc = null;
      if (kind === 'small') nc = SMALL[c] || (BIG[c] ? null : null);
      else if (kind === 'dak') { const d = (c.normalize('NFD')[0] + DAK).normalize('NFC'); nc = d.length === 1 ? d : null; }
      else if (kind === 'han') { const d = (c.normalize('NFD')[0] + HAN).normalize('NFC'); nc = d.length === 1 ? d : null; }
      else nc = dkNext(c);
      if (!nc) return flash(`Chữ <b class="jp">${esc(c)}</b> không thêm dấu hay đổi chữ nhỏ được.`);
      replaceLast(nc);
    }
    // ---------- vuốt / chạm trên bàn phím điện thoại ----------
    let fl = null;
    const pop = () => keysEl.querySelector('[data-pop]');
    function showPop(b, k, dir) {
      const p = pop(); if (!p) return;
      const r = b.getBoundingClientRect(), g = keysEl.querySelector('.fk-grid').getBoundingClientRect();
      p.style.setProperty('--x', (r.left - g.left) + 'px'); p.style.setProperty('--y', (r.top - g.top) + 'px');
      p.style.setProperty('--w', r.width + 'px'); p.style.setProperty('--h', r.height + 'px');
      const lab = d => k.mod ? ['小゛゜', '小', '゛', '゜', ''][d] : k.f[d];
      p.innerHTML = [0, 1, 2, 3, 4].map(d => lab(d) ? `<span class="pc d${d} ${d === dir ? 'on' : ''} jp">${lab(d)}</span>` : '').join('');
      p.hidden = false;
    }
    function hidePop() { const p = pop(); if (p) p.hidden = true; }
    function dirOf(dx, dy) {
      if (Math.hypot(dx, dy) < 18) return 0;
      return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 3) : (dy < 0 ? 2 : 4);
    }
    function flickDone(ki, dir) {
      const k = FK[ki];
      if (k.mod) { dkAction(['cycle', 'small', 'dak', 'han', 'cycle'][dir]); lastTap = null; return; }
      const now = Date.now();
      if (dir === 0 && lastTap && lastTap.ki === ki && now - lastTap.t < 1000 && lastChar() === lastTap.c) {
        // chạm lại cùng phím: đổi sang chữ kế tiếp trong hàng (あ → い → う…)
        const cyc = Array.from(k.cyc), i = (cyc.indexOf(lastTap.c) + 1) % cyc.length;
        lastTap = { ki, t: now, c: cyc[i] }; replaceLast(cyc[i]); return;
      }
      const c = k.f[dir] || k.f[0];
      // ghi nhớ lần chạm trước khi chèn chữ, để gợi ý phím tiếp theo biết bạn đang chạm nhiều lần
      const prev = lastTap; lastTap = dir === 0 ? { ki, t: now, c } : null;
      if (!insert(c)) lastTap = prev;
    }
    function sideAct(act) {
      if (act === 'bs') { insert('\b'); lastTap = null; }
      else if (act === 'space') { insert(' '); lastTap = null; }
      else if (act === 'enter') { if (opts.enter) insert('\n'); else flash('<b class="jp">改行</b> (kaigyō): xuống dòng / chốt chữ đang gõ.'); lastTap = null; }
      else if (act === 'next') { lastTap = null; flash('<b>➜</b>: chốt chữ vừa chạm để gõ tiếp chữ giống vậy, ví dụ <b class="jp">ああ</b> = chạm あ, bấm ➜, chạm あ.'); }
      else if (act === 'undo') {
        if (lastTap) { const k = FK[lastTap.ki], cyc = Array.from(k.cyc), i = (cyc.indexOf(lastTap.c) - 1 + cyc.length) % cyc.length; lastTap = { ki: lastTap.ki, t: Date.now(), c: cyc[i] }; replaceLast(cyc[i]); }
        else flash('<b>↶</b>: khi chạm một phím nhiều lần (あ → い → う…), bấm ↶ để lùi lại chữ trước.');
      }
      else if (act === 'abc') setMode('romaji');
    }

    keysEl.addEventListener('pointerdown', e => {
      const fb = e.target.closest('.fk');
      if (fb) {
        e.preventDefault();
        if (fb.dataset.act) { press(fb); sideAct(fb.dataset.act); refocus(); return; }
        const ki = +fb.dataset.fk;
        fl = { ki, x: e.clientX, y: e.clientY, dir: 0, b: fb, id: e.pointerId };
        try { fb.setPointerCapture(e.pointerId); } catch (er) { }
        fb.classList.add('down'); showPop(fb, FK[ki], 0);
        return;
      }
      const b = e.target.closest('.k'); if (!b) return;
      e.preventDefault();
      const code = b.dataset.code;
      press(b);
      if (/^Shift/.test(code)) { if (prefs.mode === 'kana') { shiftOnce = !shiftOnce; box.classList.toggle('shift-on', shiftOnce); } flash(HELP[code]); return; }
      const ch = charFor(code);
      if (ch == null) { if (HELP[code]) flash(HELP[code]); return; }
      if (code === 'Space' && !opts.enter && prefs.mode === 'romaji' && !input.value) flash(HELP.Space);
      insert(ch);
      if (shiftOnce && prefs.mode === 'kana' && code !== 'Backspace') { shiftOnce = false; box.classList.remove('shift-on'); }
      refocus();
    });
    keysEl.addEventListener('pointermove', e => {
      if (!fl || e.pointerId !== fl.id) return;
      const d = dirOf(e.clientX - fl.x, e.clientY - fl.y);
      const k = FK[fl.ki];
      const ok = d === 0 || (k.mod ? !!['小゛゜', '小', '゛', '゜', ''][d] : !!k.f[d]);
      const nd = ok ? d : 0;
      if (nd !== fl.dir) { fl.dir = nd; showPop(fl.b, k, nd); }
    });
    const endFlick = (e, cancel) => {
      if (!fl || (e && e.pointerId !== fl.id)) return;
      const f = fl; fl = null;
      f.b.classList.remove('down'); hidePop();
      if (!cancel) { flickDone(f.ki, f.dir); refocus(); }
    };
    keysEl.addEventListener('pointerup', e => endFlick(e, false));
    keysEl.addEventListener('pointercancel', e => endFlick(e, true));

    // bàn phím thật: sáng phím; ở kiểu Kana thì đổi phím thành chữ kana theo vị trí JIS
    const onDown = e => {
      if (!alive) return;
      const k = el(e.code === 'NumpadEnter' ? 'Enter' : e.code);
      // phím đã nhấn tự tắt sáng nếu không nhận được lúc nhả phím (vd. Win + Shift + S để chụp màn hình)
      if (k) { k.classList.add('down'); clearTimeout(k._t); k._t = setTimeout(() => k.classList.remove('down'), e.repeat ? 400 : 1200); }
      if (e.target === input) lastTap = null;
      if (e.target !== input || prefs.mode !== 'kana' || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      const ch = kanaFor(e.code, e.shiftKey);
      if (ch) { e.preventDefault(); insert(ch); }
    };
    const onUp = e => { const k = el(e.code); if (k) k.classList.remove('down'); if (e.key === 'Shift') host.querySelectorAll('.k.shift').forEach(x => x.classList.remove('down')); };
    const onBlur = () => { host.querySelectorAll('.down').forEach(x => x.classList.remove('down')); endFlick(null, true); };
    document.addEventListener('keydown', onDown, true);
    document.addEventListener('keyup', onUp, true);
    window.addEventListener('blur', onBlur);

    function setMode(m) {
      prefs.mode = m; savePrefs(); box.dataset.mode = m;
      host.querySelectorAll('.jkb-seg [data-m]').forEach(x => x.classList.toggle('active', x.dataset.m === m));
      keysEl.innerHTML = m === 'flick' ? flickHTML() : jisHTML();
      host.querySelector('[data-legend]').innerHTML = legendHTML();
      shiftOnce = false; lastTap = null; box.classList.remove('shift-on'); placeholder(); update();
      SJ.audio && SJ.audio.sfx && SJ.audio.sfx('tap');
      refocus();
    }
    host.querySelector('.jkb-seg').onclick = e => { const b = e.target.closest('[data-m]'); if (b && b.dataset.m !== prefs.mode) setMode(b.dataset.m); };
    host.querySelector('[data-fing]').onchange = e => { prefs.fingers = e.target.checked; savePrefs(); host.querySelector('.jkb-body').classList.toggle('fing', prefs.fingers); };
    host.querySelector('[data-tog]').onclick = e => {
      prefs.show = !prefs.show; savePrefs(); box.classList.toggle('off', !prefs.show);
      const tb = e.currentTarget; tb.innerHTML = SJ.icon(prefs.show ? 'eye_off' : 'eye', 20); tb.title = tb.ariaLabel = prefs.show ? 'Ẩn bàn phím' : 'Hiện bàn phím';
      setInputMode(); input.blur(); setTimeout(() => input.focus(), 30);
    };

    /** so chữ đã gõ với đích: số chữ đúng, chữ đang thiếu dấu (kiểu Kana / vuốt) */
    function progress() {
      const tg = opts.target && opts.target();
      if (!tg || input.disabled) return null;
      const g = Array.from(guide(tg)), conv = SJ.ime.convert(input.value), t = Array.from(guide(conv.kana));
      for (let n = 0; n < t.length; n++) {
        if (n < g.length && eq(t[n], g[n], t[n - 1], g[n - 1])) continue;
        if (n === t.length - 1 && n < g.length && !conv.rest) return { g, n, conv, partial: t[n] };
        return { g, n, conv, bad: true };
      }
      return { g, n: t.length, conv };
    }
    /** phím cần bấm tiếp theo */
    function next() {
      const p = progress(); if (!p) return null;
      const { g, n, conv } = p;
      if (prefs.mode === 'flick') {
        if (conv.rest) return { bad: true, latin: true };
        const c = g[n];
        if (p.partial != null) {
          const part = p.partial, want = c;
          // đang chạm nhiều lần trên cùng phím: chạm thêm để tới chữ cần gõ
          // thiếu dấu / chữ nhỏ: bấm 小゛゜ (nhanh nhất)
          const grp = dkGroup(part);
          if (grp && grp.includes(want)) { const a = Array.from(grp); const times = (a.indexOf(want) - a.indexOf(part) + a.length) % a.length; return { fk: 9, dir: 0, unit: want, times, dk: true }; }
          const pk = FMAP[part] || (lastTap && [lastTap.ki]), wk = flickPlan(want);
          if (lastTap && pk && wk && pk[0] === wk.key && FK[wk.key].cyc.includes(want) && FK[wk.key].cyc.includes(part)) { const cyc = Array.from(FK[wk.key].cyc); const times = (cyc.indexOf(want) - cyc.indexOf(part) + cyc.length) % cyc.length; return { fk: wk.key, dir: 0, unit: want, times, cycle: true }; }
          return { bad: true };
        }
        if (p.bad) return { bad: true };
        if (!c) return null;
        const pl = flickPlan(c); if (!pl) return null;
        return { fk: pl.key, dir: pl.dir, unit: c, then: pl.dk ? pl.dk : 0, base: pl.base };
      }
      if (prefs.mode === 'kana') {
        if (conv.rest) return { code: 'Backspace', bad: true, latin: true };
        if (p.partial != null) {
          if ((p.partial + DAK).normalize('NFC') === g[n]) return { code: 'BracketLeft', unit: g[n], mark: true };
          if ((p.partial + HAN).normalize('NFC') === g[n]) return { code: 'BracketRight', unit: g[n], mark: true };
          return { code: 'Backspace', bad: true };
        }
        if (p.bad) return { code: 'Backspace', bad: true };
        const c = g[n]; if (!c) return null;
        const d = c.normalize('NFD'), base = d[0], mark = d[1];
        const kk = KANA_KEY[c] || KANA_KEY[base];
        if (!kk) return null;
        return { code: kk[0], shift: KANA_KEY[c] ? kk[1] : false, unit: c, then: mark && !KANA_KEY[c] ? (mark === DAK ? '゛' : '゜') : '' };
      }
      // kiểu Romaji
      if (p.bad || (p.partial != null && !conv.rest)) return { code: 'Backspace', bad: true };
      const us = units(g.slice(n).join(''));
      let rest = conv.rest, guard = 0;
      if (rest === 'nn' && us[0] === 'ん') { us.shift(); rest = us[0] && romOf(us[0], us[1])[0] === 'n' ? 'n' : ''; }
      while (us.length && guard++ < 8) {
        const rom = romOf(us[0], us[1]);
        if (rest && rest.length >= rom.length && rest.startsWith(rom)) { rest = rest.slice(rom.length); us.shift(); continue; }
        break;
      }
      const u = us[0]; if (!u) return null;
      const rom = romOf(u, us[1]);
      let ch = null, shown = rom, doneN = 0;
      if (!rest) ch = rom[0];
      else if (rom.startsWith(rest)) { ch = rom[rest.length]; doneN = rest.length; }
      else { const alt = Object.keys(SJ.ime.table).find(k => SJ.ime.table[k] === u && k.startsWith(rest) && k.length > rest.length); if (alt) { ch = alt[rest.length]; shown = alt; doneN = rest.length; } }
      if (!ch) return { code: 'Backspace', bad: true };
      const code = ch === '-' ? 'Minus' : /[a-z]/.test(ch) ? 'Key' + ch.toUpperCase() : null;
      return code ? { code, unit: u, rom: shown, doneN } : null;
    }
    function update() {
      if (!alive) return;
      host.querySelectorAll('.next').forEach(x => { x.classList.remove('next'); x.removeAttribute('data-arrow'); });
      const nx = next();
      const idle = prefs.mode === 'flick' ? 'Chạm một phím để gõ chữ giữa, chạm giữ rồi <b>vuốt ← ↑ → ↓</b> để ra các chữ còn lại. Thêm dấu / chữ nhỏ: bấm <b class="jp">小゛゜</b> ngay sau chữ.'
        : prefs.mode === 'kana' ? 'Bấm phím có chữ kana bạn muốn gõ. Thêm dấu: bấm <b>゛</b> hoặc <b>゜</b> ngay sau chữ.'
          : 'Gõ romaji bằng bàn phím thật hoặc bấm lên phím: <b>ka</b> → か, <b>nn</b> → ん, <b>-</b> → ー.';
      if (!nx) { info.innerHTML = opts.target && opts.target() ? '' : `<span class="jkb-note">${idle}</span>`; return; }
      const unit = nx.unit ? `<span class="jkb-unit jp">${esc(nx.unit)}</span>` : '';
      if (prefs.mode === 'flick') {
        if (nx.bad) {
          const bs = host.querySelector('.fk[data-act="bs"]'); if (bs) bs.classList.add('next');
          info.innerHTML = `<span class="jkb-bad">${nx.latin ? 'Đang gõ dở chữ Latin — ' : 'Gõ nhầm rồi — '}bấm <kbd class="bad">⌫</kbd> để xoá chữ sai nha</span>`; return;
        }
        const b = host.querySelector(`.fk[data-fk="${nx.fk}"]`);
        if (b) { b.classList.add('next'); if (nx.dir) b.setAttribute('data-arrow', ARROW[nx.dir]); }
        const keyName = `<kbd class="jp">${nx.fk === 9 ? '小゛゜' : FK[nx.fk].f[0]}</kbd>`;
        if (nx.dk) { info.innerHTML = `${unit}<span>bấm</span>${keyName}<span>${nx.times > 1 ? nx.times + ' lần' : ''} để ${/[ぁぃぅぇぉゃゅょっゎ]/.test(nx.unit) ? 'đổi sang chữ nhỏ' : 'thêm dấu'}</span>`; return; }
        if (nx.cycle) { info.innerHTML = `${unit}<span>chạm tiếp</span>${keyName}<span>${nx.times > 1 ? nx.times + ' lần nữa' : 'thêm 1 lần'}</span><span class="muted">(hoặc xoá rồi vuốt cho nhanh)</span>`; return; }
        const how = nx.dir ? `<span>chạm giữ</span>${keyName}<span class="jkb-dir">${DIRS[nx.dir]}</span>` : `<span>chạm</span>${keyName}`;
        info.innerHTML = `${unit}${how}${nx.then ? `<span class="muted">rồi bấm <b class="jp">小゛゜</b>${nx.then > 1 ? ' ' + nx.then + ' lần' : ''}</span>` : ''}<span class="jkb-finger f-th"><i></i>ngón cái</span>`;
        return;
      }
      const k = KEYS[nx.code], e = el(nx.code);
      if (e) e.classList.add('next');
      if (nx.shift) host.querySelectorAll('.k.shift').forEach(x => x.classList.add('next'));
      const kb = `<kbd class="${nx.bad ? 'bad' : ''}">${esc(k.code === 'Backspace' ? '⌫ Xoá' : k.lab)}</kbd>`;
      const fg = `<span class="jkb-finger f-${k.f}"><i></i>${FINGER[k.f]}</span>`;
      if (nx.bad) { info.innerHTML = `<span class="jkb-bad">${nx.latin ? 'Kiểu Kana không gõ chữ Latin — ' : 'Gõ nhầm rồi — '}bấm ${kb} để xoá chữ sai nha</span>`; return; }
      if (prefs.mode === 'kana') {
        info.innerHTML = nx.mark ? `${unit}<span>thêm dấu: bấm</span>${kb}${fg}` : `${unit}<span>bấm</span>${nx.shift ? '<kbd>Shift</kbd>+' : ''}${kb}${fg}${nx.then ? `<span class="muted">rồi bấm <b class="jp">${nx.then}</b> để thêm dấu</span>` : ''}`;
      } else {
        const seq = Array.from(nx.rom).map((c, i) => `<b class="${i < nx.doneN ? 'dn' : i === nx.doneN ? 'cur' : ''}">${esc(c)}</b>`).join('');
        info.innerHTML = `${unit}<span class="jkb-seq">${seq}</span><span>bấm</span>${kb}${fg}`;
      }
    }
    update();
    return {
      update,
      destroy() { alive = false; clearTimeout(helpT); document.removeEventListener('keydown', onDown, true); document.removeEventListener('keyup', onUp, true); window.removeEventListener('blur', onBlur); input.removeAttribute('inputmode'); },
    };
  }

  SJ.jkb = { mount, guide, KEYS, FK };
})(window.SJ);
