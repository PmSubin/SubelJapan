/* SubelJapan — Bộ gõ romaji → kana (giống bộ gõ tiếng Nhật thật trên máy tính/điện thoại)
 * SJ.ime.convert('konnichiha') → { kana: 'こんにちは', rest: '' }
 * Quy tắc: gõ 2 phụ âm giống nhau → っ (kitte → きって); n trước phụ âm → ん; nn / n' → ん;
 * x/l + nguyên âm → chữ nhỏ (xa → ぁ, ltsu → っ); dấu - → ー (trường âm Katakana).
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const T = {};
  const add = (r, k) => { T[r] = k; };
  // nguyên âm & hàng cơ bản
  const rows = {
    '': 'あいうえお', k: 'かきくけこ', s: 'さしすせそ', t: 'たちつてと', n: 'なにぬねの', h: 'はひふへほ', m: 'まみむめも',
    y: 'や_ゆ_よ', r: 'らりるれろ', w: 'わうぃ_うぇを', g: 'がぎぐげご', z: 'ざじずぜぞ', d: 'だぢづでど', b: 'ばびぶべぼ', p: 'ぱぴぷぺぽ',
  };
  const V = ['a', 'i', 'u', 'e', 'o'];
  Object.keys(rows).forEach(c => {
    if (c === 'w') { add('wa', 'わ'); add('wi', 'うぃ'); add('wu', 'う'); add('we', 'うぇ'); add('wo', 'を'); return; }
    const ks = Array.from(rows[c]);
    V.forEach((v, i) => { if (ks[i] && ks[i] !== '_') add(c + v, ks[i]); });
  });
  add('ye', 'いぇ'); add('yi', 'い');
  // cách gõ Hepburn & các biến thể
  Object.assign(T, {
    shi: 'し', chi: 'ち', tsu: 'つ', fu: 'ふ', ji: 'じ', si: 'し', ti: 'ち', tu: 'つ', hu: 'ふ', zi: 'じ', di: 'ぢ', du: 'づ', dzu: 'づ',
    ca: 'か', ci: 'し', cu: 'く', ce: 'せ', co: 'こ', qa: 'くぁ', qi: 'くぃ', qe: 'くぇ', qo: 'くぉ',
    fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', fyu: 'ふゅ',
    va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ',
    she: 'しぇ', je: 'じぇ', che: 'ちぇ', tsa: 'つぁ', tsi: 'つぃ', tse: 'つぇ', tso: 'つぉ',
    thi: 'てぃ', dhi: 'でぃ', thu: 'てゅ', dhu: 'でゅ', twu: 'とぅ', dwu: 'どぅ',
    'n\'': 'ん', nn: 'ん', '-': 'ー', '~': '〜', ',': '、', '.': '。', '?': '？', '!': '！', '[': '「', ']': '」', ' ': ' ',
  });
  // âm ghép (yōon)
  const yo = { k: 'き', s: 'し', t: 'ち', c: 'ち', n: 'に', h: 'ひ', m: 'み', r: 'り', g: 'ぎ', z: 'じ', j: 'じ', d: 'ぢ', b: 'び', p: 'ぴ' };
  const small = { a: 'ゃ', u: 'ゅ', o: 'ょ' };
  Object.keys(yo).forEach(c => Object.keys(small).forEach(v => { T[c + 'y' + v] = yo[c] + small[v]; }));
  Object.assign(T, { sha: 'しゃ', shu: 'しゅ', sho: 'しょ', cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ' });
  // chữ nhỏ
  const sm = { a: 'ぁ', i: 'ぃ', u: 'ぅ', e: 'ぇ', o: 'ぉ', ya: 'ゃ', yu: 'ゅ', yo: 'ょ', tsu: 'っ', tu: 'っ', wa: 'ゎ' };
  Object.keys(sm).forEach(k => { T['x' + k] = sm[k]; T['l' + k] = sm[k]; });

  const MAXLEN = 4;
  const isCons = c => /[bcdfghjklmpqrstvwxyz]/.test(c);

  /** Chuyển chuỗi romaji → kana. final=true: coi như gõ xong (n cuối → ん) */
  function convert(input, opts) {
    opts = opts || {};
    const s = String(input || '').toLowerCase();
    let out = '', i = 0;
    while (i < s.length) {
      const c = s[i];
      // ký tự đã là kana hoặc ký tự lạ → giữ nguyên
      if (!/[a-z'\-~,.?!\[\] ]/.test(c)) { out += c; i++; continue; }
      // っ: phụ âm đôi (trừ n)
      if (isCons(c) && c !== 'n' && s[i + 1] === c) { out += 'っ'; i++; continue; }
      // n + phụ âm (không phải y) → ん
      if (c === 'n' && i + 1 < s.length && isCons(s[i + 1]) && s[i + 1] !== 'y' && s[i + 1] !== 'n') { out += 'ん'; i++; continue; }
      // "nn" + nguyên âm: konnichiha → こんにちは
      if (c === 'n' && s[i + 1] === 'n' && /[aiueoy]/.test(s[i + 2] || '')) { out += 'ん'; i++; continue; }
      let hit = false;
      for (let n = MAXLEN; n >= 1; n--) {
        const sub = s.substr(i, n);
        if (sub.length === n && T[sub] != null) {
          // "n" đơn lẻ chưa quyết định được (có thể là な, にゃ…)
          out += T[sub]; i += n; hit = true; break;
        }
      }
      if (hit) continue;
      // chưa đủ ký tự để ghép → phần chờ
      const rest = s.slice(i);
      if (/^[a-z']+$/.test(rest) && Object.keys(T).some(k => k.startsWith(rest)) || rest === 'n') {
        if (opts.final && rest === 'n') { out += 'ん'; i = s.length; break; }
        return { kana: out, rest };
      }
      // không khớp gì → bỏ qua ký tự
      out += c; i++;
    }
    return { kana: out, rest: '' };
  }
  const toHira = (s, final) => { const r = convert(s, { final }); return r.kana + (final ? '' : r.rest); };
  const toKata = (s, final) => { const r = convert(s, { final }); return Array.from(r.kana).map(ch => SJ.toKata ? SJ.toKata(ch) : ch).join('') + (final ? '' : r.rest); };

  /** Bảng gõ nhanh hiển thị cho người mới */
  const CHEATS = [
    ['し', 'shi / si'], ['ち', 'chi / ti'], ['つ', 'tsu / tu'], ['ふ', 'fu / hu'], ['じ', 'ji / zi'], ['を', 'wo'], ['ん', 'nn'],
    ['っ', 'kitte → きって'], ['ゃ', 'xya / lya'], ['きゃ', 'kya'], ['しゃ', 'sha'], ['ちゃ', 'cha'], ['ー', '- (dấu gạch)'], ['ぢ', 'di'], ['づ', 'du'],
  ];

  SJ.ime = { convert, toHira, toKata, CHEATS, table: T };
})(window.SJ);
