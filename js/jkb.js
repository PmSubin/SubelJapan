/* SubelJapan — Bàn phím tiếng Nhật chuẩn JIS hiện trên màn hình (không cần cài bộ gõ)
 * Hai kiểu gõ như máy thật của người Nhật:
 *   ローマ字入力 — gõ romaji (ka → か), cách phổ biến nhất
 *   かな入力   — mỗi phím là một chữ kana in trên phím (T → か, @ → ゛ thêm dấu)
 * Chỉ phím cần bấm tiếp theo + ngón tay nên dùng, sáng phím khi gõ bằng bàn phím thật,
 * bấm thẳng lên phím được (điện thoại: không bật bàn phím của máy).
 * SJ.jkb.mount(chỗ đặt, ô nhập, { target: () => chuỗi đích, enter: true }) → { update, destroy }
 */
window.SJ = window.SJ || {};
(function (SJ) {
  // [mã phím (KeyboardEvent.code), chữ in trên phím, kana, kana khi giữ Shift, ngón tay, kiểu phím, độ rộng]
  const ROWS = [
    [['Backquote', '半角/全角', '', '', 'lp', 'mod', 1], ['Digit1', '1', 'ぬ', '', 'lp'], ['Digit2', '2', 'ふ', '', 'lr'], ['Digit3', '3', 'あ', 'ぁ', 'lm'], ['Digit4', '4', 'う', 'ぅ', 'li'], ['Digit5', '5', 'え', 'ぇ', 'li'], ['Digit6', '6', 'お', 'ぉ', 'ri'], ['Digit7', '7', 'や', 'ゃ', 'ri'], ['Digit8', '8', 'ゆ', 'ゅ', 'rm'], ['Digit9', '9', 'よ', 'ょ', 'rr'], ['Digit0', '0', 'わ', 'を', 'rp'], ['Minus', '-', 'ほ', '', 'rp'], ['Equal', '^', 'へ', '', 'rp'], ['IntlYen', '¥', 'ー', '', 'rp'], ['Backspace', '⌫', '', '', 'rp', 'mod bs', 1]],
    [['Tab', 'Tab', '', '', 'lp', 'mod', 1.5], ['KeyQ', 'Q', 'た', '', 'lp'], ['KeyW', 'W', 'て', '', 'lr'], ['KeyE', 'E', 'い', 'ぃ', 'lm'], ['KeyR', 'R', 'す', '', 'li'], ['KeyT', 'T', 'か', '', 'li'], ['KeyY', 'Y', 'ん', '', 'ri'], ['KeyU', 'U', 'な', '', 'ri'], ['KeyI', 'I', 'に', '', 'rm'], ['KeyO', 'O', 'ら', '', 'rr'], ['KeyP', 'P', 'せ', '', 'rp'], ['BracketLeft', '@', '゛', '', 'rp'], ['BracketRight', '[', '゜', '「', 'rp'], ['Enter', 'Enter', '', '', 'rp', 'mod enter', 1.5]],
    [['CapsLock', '英数', '', '', 'lp', 'mod', 1.75], ['KeyA', 'A', 'ち', '', 'lp'], ['KeyS', 'S', 'と', '', 'lr'], ['KeyD', 'D', 'し', '', 'lm'], ['KeyF', 'F', 'は', '', 'li', 'home'], ['KeyG', 'G', 'き', '', 'li'], ['KeyH', 'H', 'く', '', 'ri'], ['KeyJ', 'J', 'ま', '', 'ri', 'home'], ['KeyK', 'K', 'の', '', 'rm'], ['KeyL', 'L', 'り', '', 'rr'], ['Semicolon', ';', 'れ', '', 'rp'], ['Quote', ':', 'け', '', 'rp'], ['Backslash', ']', 'む', '」', 'rp'], ['Enter2', '', '', '', 'rp', 'mod enter2', 1.25]],
    [['ShiftLeft', 'Shift', '', '', 'lp', 'mod shift', 2.25], ['KeyZ', 'Z', 'つ', 'っ', 'lp'], ['KeyX', 'X', 'さ', '', 'lr'], ['KeyC', 'C', 'そ', '', 'lm'], ['KeyV', 'V', 'ひ', '', 'li'], ['KeyB', 'B', 'こ', '', 'li'], ['KeyN', 'N', 'み', '', 'ri'], ['KeyM', 'M', 'も', '', 'ri'], ['Comma', ',', 'ね', '、', 'rm'], ['Period', '.', 'る', '。', 'rr'], ['Slash', '/', 'め', '・', 'rp'], ['IntlRo', '\\', 'ろ', '', 'rp'], ['ShiftRight', 'Shift', '', '', 'rp', 'mod shift', 1.75]],
    [['ControlLeft', 'Ctrl', '', '', 'lp', 'mod', 1.5], ['MetaLeft', 'Win', '', '', 'lp', 'mod', 1.25], ['AltLeft', 'Alt', '', '', 'th', 'mod', 1.25], ['NonConvert', '無変換', '', '', 'th', 'mod', 1.5], ['Space', '', '', '', 'th', 'space', 4], ['Convert', '変換', '', '', 'th', 'mod', 1.5], ['KanaMode', 'かな', '', '', 'th', 'mod', 1.5], ['AltRight', 'Alt', '', '', 'th', 'mod', 1.25], ['ControlRight', 'Ctrl', '', '', 'rp', 'mod', 1.25]],
  ];
  const KEYS = {}; ROWS.flat().forEach(k => { KEYS[k[0]] = { code: k[0], lab: k[1], kana: k[2], skana: k[3], f: k[4], cls: k[5] || '', w: k[6] || 1 }; });
  // kana → [mã phím, cần Shift?]
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
  const PUNCT = /[\s、。！？!?,.「」・〜~]/;
  const VOW = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };
  const vowelOf = c => { const o = SJ.KANA_MAP && SJ.KANA_MAP[c]; return o ? VOW[o.r.slice(-1)] || '' : ''; };
  const hira = s => Array.from(String(s || '')).map(c => (SJ.toHira ? SJ.toHira(c) : c)).join('');
  /** chuỗi đích để chỉ phím: Hiragana, giữ ー, bỏ dấu câu & khoảng trắng */
  const guide = s => Array.from(hira(s)).filter(c => !PUNCT.test(c)).join('');

  // romaji chuẩn Hepburn cho từng cụm kana (lấy từ bảng của bộ gõ)
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

  let prefs = { mode: 'romaji', fingers: false, show: true };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem('sj_jkb') || '{}')); } catch (e) { }
  const savePrefs = () => { try { localStorage.setItem('sj_jkb', JSON.stringify(prefs)); } catch (e) { } };
  const esc = s => SJ.ui.esc(s);
  const touch = () => window.matchMedia && matchMedia('(pointer: coarse)').matches;

  function keyHTML(k) {
    const isMod = /mod|space/.test(k.cls);
    return `<button type="button" class="k ${k.cls} f-${k.f}" data-code="${k.code}" style="--w:${k.w}" tabindex="-1" aria-label="${esc(k.lab || (k.code === 'Space' ? 'Phím cách' : k.code))}${k.kana ? ' ' + k.kana : ''}">
      ${isMod ? `<span class="k-mod">${k.code === 'Backquote' ? '半角<br>全角' : k.code === 'Space' ? '<i>space</i>' : esc(k.lab)}</span>` : `<span class="k-lat">${esc(k.lab)}</span><span class="k-kana jp">${k.kana}</span>${k.skana ? `<span class="k-skana jp">${k.skana}</span>` : ''}`}</button>`;
  }

  function mount(host, input, opts) {
    opts = opts || {};
    let shiftOnce = false, helpT = null, alive = true;
    host.innerHTML = `<div class="jkb card ${prefs.show ? '' : 'off'}" data-mode="${prefs.mode}">
      <div class="jkb-top">
        <div class="jkb-title">${SJ.icon('keyboard', 30)}<div><b>Bàn phím tiếng Nhật</b><small>chuẩn JIS · không cần cài bộ gõ</small></div></div>
        <div class="seg jkb-seg" role="tablist"><button data-m="romaji" class="${prefs.mode === 'romaji' ? 'active' : ''}"><span class="jp">ローマ字</span> Romaji</button><button data-m="kana" class="${prefs.mode === 'kana' ? 'active' : ''}"><span class="jp">かな</span> Kana</button></div>
        <label class="switch small jkb-fing"><input type="checkbox" data-fing ${prefs.fingers ? 'checked' : ''}><i></i><span>Màu ngón tay</span></label>
        <button type="button" class="icon-btn jkb-tog" data-tog title="${prefs.show ? 'Ẩn bàn phím' : 'Hiện bàn phím'}" aria-label="${prefs.show ? 'Ẩn bàn phím' : 'Hiện bàn phím'}">${SJ.icon(prefs.show ? 'eye_off' : 'eye', 20)}</button>
      </div>
      <div class="jkb-body ${prefs.fingers ? 'fing' : ''}">
        <div class="jkb-keys">${ROWS.map(r => `<div class="jkb-row">${r.map(c => keyHTML(KEYS[c[0]])).join('')}</div>`).join('')}</div>
        <div class="jkb-info" data-info aria-live="polite"></div>
      </div></div>`;
    const box = host.querySelector('.jkb'), info = host.querySelector('[data-info]');
    const el = code => host.querySelector(`.k[data-code="${code}"]`);
    const setInputMode = () => { if (touch() && prefs.show) input.setAttribute('inputmode', 'none'); else input.removeAttribute('inputmode'); };
    const placeholder = () => { if (opts.placeholder) input.placeholder = prefs.mode === 'kana' ? opts.placeholder.kana : opts.placeholder.romaji; };
    setInputMode(); placeholder();

    function insert(s) {
      if (input.disabled || input.readOnly) return;
      const a = Array.from(input.value);
      if (s === '\b') a.pop();
      else if (s === '゙' || s === '゚') { const last = a.pop(); const c = last ? (last + s).normalize('NFC') : ''; if (c.length !== 1) return flash('Dấu ゛ ゜ phải bấm <b>sau</b> chữ cần thêm dấu, ví dụ か + ゛ = が.'); a.push(c); }
      else a.push(s);
      input.value = a.join('');
      try { input.setSelectionRange(input.value.length, input.value.length); } catch (e) { }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function kanaFor(code, shift) {
      const k = KEYS[code]; if (!k) return null;
      if (k.kana === '゛') return '゙';
      if (k.kana === '゜') return shift && k.skana ? k.skana : '゚';
      return shift && k.skana ? k.skana : k.kana || null;
    }
    function charFor(code) {
      if (code === 'Backspace') return '\b';
      if (code === 'Space') return ' ';
      if (code === 'Enter' || code === 'Enter2') return opts.enter ? '\n' : null;
      if (prefs.mode === 'kana') { const c = kanaFor(code, shiftOnce); return c; }
      const k = KEYS[code]; if (!k || /mod/.test(k.cls)) return null;
      if (/^Key/.test(code)) return k.lab.toLowerCase();
      return { Minus: '-', Comma: ',', Period: '.', Slash: '/', BracketLeft: '@', BracketRight: '[', Semicolon: ';', Quote: ':', Backslash: ']', IntlYen: '¥', IntlRo: '\\', Equal: '^' }[code] || k.lab;
    }
    function flash(html) { info.innerHTML = `<span class="jkb-note">${html}</span>`; clearTimeout(helpT); helpT = setTimeout(update, 3200); }
    function press(code) { const e = el(code); if (!e) return; e.classList.add('down'); setTimeout(() => e.classList.remove('down'), 140); }

    // bấm trên màn hình
    host.querySelector('.jkb-keys').addEventListener('pointerdown', e => {
      const b = e.target.closest('.k'); if (!b) return;
      e.preventDefault();
      const code = b.dataset.code;
      press(code);
      if (/^Shift/.test(code)) { if (prefs.mode === 'kana') { shiftOnce = !shiftOnce; box.classList.toggle('shift-on', shiftOnce); } flash(HELP[code]); return; }
      const ch = charFor(code);
      if (ch == null) { if (HELP[code]) flash(HELP[code]); return; }
      if (code === 'Space' && !opts.enter && prefs.mode === 'romaji' && !input.value) { flash(HELP.Space); }
      insert(ch);
      if (shiftOnce && prefs.mode === 'kana' && code !== 'Backspace') { shiftOnce = false; box.classList.remove('shift-on'); }
      if (document.activeElement !== input && !touch()) input.focus();
    });
    // bàn phím thật: sáng phím; ở kiểu Kana thì đổi phím thành chữ kana theo vị trí JIS
    const onDown = e => {
      if (!alive) return;
      const k = el(e.code === 'NumpadEnter' ? 'Enter' : e.code);
      if (k) k.classList.add('down');
      if (e.target !== input || prefs.mode !== 'kana' || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      const ch = kanaFor(e.code, e.shiftKey);
      if (ch) { e.preventDefault(); insert(ch); }
    };
    const onUp = e => { const k = el(e.code); if (k) k.classList.remove('down'); if (e.key === 'Shift') host.querySelectorAll('.k.shift').forEach(x => x.classList.remove('down')); };
    const onBlur = () => host.querySelectorAll('.k.down').forEach(x => x.classList.remove('down'));
    document.addEventListener('keydown', onDown, true);
    document.addEventListener('keyup', onUp, true);
    window.addEventListener('blur', onBlur);

    host.querySelector('.jkb-seg').onclick = e => {
      const b = e.target.closest('[data-m]'); if (!b) return;
      prefs.mode = b.dataset.m; savePrefs(); box.dataset.mode = prefs.mode;
      host.querySelectorAll('.jkb-seg [data-m]').forEach(x => x.classList.toggle('active', x === b));
      shiftOnce = false; box.classList.remove('shift-on'); placeholder(); update();
      flash(prefs.mode === 'kana' ? '<b>Kiểu Kana</b>: mỗi phím là một chữ in trên phím. Thêm dấu: bấm chữ rồi bấm <b>゛</b> (phím @) hoặc <b>゜</b> (phím [). Chữ nhỏ: giữ <b>Shift</b>.' : '<b>Kiểu Romaji</b>: gõ cách đọc bằng chữ Latin, ví dụ <b>ka</b> → か, <b>sushi</b> → すし. Người Nhật dùng kiểu này nhiều nhất.');
      if (!touch()) input.focus();
    };
    host.querySelector('[data-fing]').onchange = e => { prefs.fingers = e.target.checked; savePrefs(); host.querySelector('.jkb-body').classList.toggle('fing', prefs.fingers); };
    host.querySelector('[data-tog]').onclick = e => {
      prefs.show = !prefs.show; savePrefs(); box.classList.toggle('off', !prefs.show);
      const tb = e.currentTarget; tb.innerHTML = SJ.icon(prefs.show ? 'eye_off' : 'eye', 20); tb.title = tb.ariaLabel = prefs.show ? 'Ẩn bàn phím' : 'Hiện bàn phím';
      setInputMode(); input.blur(); setTimeout(() => input.focus(), 30);
    };

    /** phím cần bấm tiếp theo cho chuỗi đích */
    function next() {
      const tg = opts.target && opts.target();
      if (!tg || input.disabled) return null;
      const g = Array.from(guide(tg));
      const conv = SJ.ime.convert(input.value);
      const t = Array.from(guide(conv.kana));
      let n = 0, partial = '';
      for (; n < t.length; n++) {
        if (n < g.length && eq(t[n], g[n], t[n - 1], g[n - 1])) continue;
        // kiểu Kana: đã bấm chữ gốc, còn thiếu dấu ゛ ゜
        if (n === t.length - 1 && n < g.length && !conv.rest) { if ((t[n] + '゙').normalize('NFC') === g[n]) { partial = '゙'; break; } if ((t[n] + '゚').normalize('NFC') === g[n]) { partial = '゚'; break; } }
        return { code: 'Backspace', bad: true };
      }
      if (prefs.mode === 'kana') {
        if (conv.rest) return { code: 'Backspace', bad: true, latin: true };
        if (partial) return { code: partial === '゙' ? 'BracketLeft' : 'BracketRight', unit: g[n], mark: true };
        const c = g[n]; if (!c) return null;
        const d = c.normalize('NFD'), base = d[0], mark = d[1];
        const kk = KANA_KEY[c] || KANA_KEY[base];
        if (!kk) return null;
        return { code: kk[0], shift: KANA_KEY[c] ? kk[1] : false, unit: c, then: mark && !KANA_KEY[c] ? (mark === '゙' ? '゛' : '゜') : '' };
      }
      // kiểu Romaji
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
      host.querySelectorAll('.k.next').forEach(x => x.classList.remove('next'));
      const nx = next();
      if (!nx) { info.innerHTML = opts.target && opts.target() ? '' : `<span class="jkb-note">${prefs.mode === 'kana' ? 'Bấm phím có chữ kana bạn muốn gõ. Thêm dấu: bấm <b>゛</b> hoặc <b>゜</b> ngay sau chữ.' : 'Gõ romaji bằng bàn phím thật hoặc bấm lên phím: <b>ka</b> → か, <b>nn</b> → ん, <b>-</b> → ー.'}</span>`; return; }
      const k = KEYS[nx.code], e = el(nx.code);
      if (e) e.classList.add('next');
      if (nx.shift) host.querySelectorAll('.k.shift').forEach(x => x.classList.add('next'));
      const kb = `<kbd class="${nx.bad ? 'bad' : ''}">${esc(k.code === 'Backspace' ? '⌫ Xoá' : k.lab)}</kbd>`;
      const fg = `<span class="jkb-finger f-${k.f}"><i></i>${FINGER[k.f]}</span>`;
      if (nx.bad) { info.innerHTML = `<span class="jkb-bad">${nx.latin ? 'Kiểu Kana không gõ chữ Latin — ' : 'Gõ nhầm rồi — '}bấm ${kb} để xoá chữ sai nha</span>`; return; }
      const unit = `<span class="jkb-unit jp">${esc(nx.unit)}</span>`;
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

  SJ.jkb = { mount, guide, KEYS };
})(window.SJ);
