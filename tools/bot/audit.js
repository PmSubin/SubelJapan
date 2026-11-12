/* Bot soát dữ liệu — chạy BÊN TRONG trang (đã tải đủ mọi file js của SubelJapan).
 * window.__audit() → { errors: [], warns: [], gaps: [], stats: {} }
 *   errors: sai thật (hiện sai / hỏng chức năng) → bot báo đỏ
 *   warns:  nên sửa (chính tả, quy ước)
 *   gaps:   phần còn THIẾU / CHƯA ĐỦ → danh sách việc cần bổ sung
 */
window.__audit = function () {
  const SJ = window.SJ;
  const errors = [], warns = [], gaps = [];
  const E = (w, m) => errors.push(w + ': ' + m), W = (w, m) => warns.push(w + ': ' + m), G = (w, m) => gaps.push(w + ': ' + m);
  const KANJI = /[一-鿿]/;
  const KANA = /^[぀-ヿー\s、。？！…ー「」・～〜]+$/;
  const ascii = s => /^[\x20-\x7e]*$/.test(s);
  const hasIcon = n => !!n && (SJ.hasIcon(n) || /<svg/.test(SJ.glyph(n, 20)));
  const icon = (w, n, need) => { if (!n) { if (need) G(w, 'chưa có hình minh hoạ (icon)'); return; } if (!hasIcon(n)) E(w, 'icon "' + n + '" không tồn tại → hiện ô trống'); };
  const furi = (w, s) => { // {漢字|かな} phải đóng mở đủ, phần đọc chỉ có kana
    const open = (s.match(/\{/g) || []).length, close = (s.match(/\}/g) || []).length;
    if (open !== close) return E(w, 'ngoặc furigana {…} không khớp: ' + s);
    (s.match(/\{[^}]*\}/g) || []).forEach(m => { const p = m.slice(1, -1).split('|'); if (p.length !== 2 || !p[0] || !p[1] || !KANA.test(p[1])) E(w, 'furigana sai dạng {漢字|かな}: ' + m); });
    const bare = s.replace(/\{[^}]*\}/g, '');
    if (KANJI.test(bare)) W(w, 'có Kanji nhưng thiếu furigana: ' + s);
  };
  const quiz = (w, qs, min) => {
    if (!Array.isArray(qs) || qs.length < min) G(w, `bài tập nhỏ mới có ${(qs || []).length} câu (nên ≥ ${min})`);
    (qs || []).forEach((q, i) => {
      if (!q.q) E(w + ' quiz' + i, 'thiếu câu hỏi');
      if (!Array.isArray(q.o) || q.o.length < 2) E(w + ' quiz' + i, 'cần ≥ 2 lựa chọn');
      else if (new Set(q.o.map(String)).size !== q.o.length) E(w + ' quiz' + i, 'lựa chọn bị trùng: ' + q.o.join(' / '));
    });
  };
  const stats = {};

  // ===== 1. BẢNG CHỮ =====
  // chữ / âm ghép gần như không có từ thông dụng → không bắt buộc từ ví dụ
  const RARE = ['ヲ', 'ヂ', 'ヅ', 'みゅ', 'ヒャ', 'リョ', 'ビャ', 'ビョ', 'ピャ'];
  const seenK = {};
  SJ.KANA_ALL.forEach(o => {
    const w = 'Chữ ' + o.k;
    if (seenK[o.k + o.group]) E(w, 'bị trùng trong cùng nhóm'); seenK[o.k + o.group] = 1;
    if (!o.r) E(w, 'thiếu romaji');
    if (!o.m) G(w, 'chưa có mẹo nhớ');
    if (o.group !== 'small') {
      if (!o.w) { if (!RARE.includes(o.k)) G(w, 'chưa có từ ví dụ'); }
      else {
        if (!o.w.jp || !o.w.r || !o.w.vi) E(w, 'từ ví dụ thiếu chữ / romaji / nghĩa');
        if (o.w.jp && o.k.length === 1 && !o.w.jp.includes(o.k)) E(w, 'từ ví dụ "' + o.w.jp + '" không chứa chữ ' + o.k);
        if (o.w.jp && o.k.length > 1 && !o.w.jp.includes(o.k)) E(w, 'từ ví dụ "' + o.w.jp + '" không chứa ' + o.k);
        if (o.w.r && !ascii(o.w.r)) E(w, 'romaji ví dụ có ký tự lạ: ' + o.w.r);
        icon(w + ' (từ ' + o.w.jp + ')', o.w.e, true);
      }
    }
  });
  stats.kana = SJ.KANA_ALL.length;

  // ===== 2. TỪ VỰNG =====
  const seenV = {};
  Object.keys(SJ.VOCAB).forEach(t => {
    const list = SJ.VOCAB[t];
    if (list.length < 12) G('Từ vựng chủ đề "' + t + '"', `mới có ${list.length} từ (nên ≥ 12)`);
    list.forEach(o => {
      const w = 'Từ ' + o.jp;
      if (seenV[o.jp]) W(w, 'trùng ở chủ đề ' + seenV[o.jp] + ' và ' + t); seenV[o.jp] = t;
      if (!o.r || !ascii(o.r)) E(w, 'romaji trống hoặc có ký tự lạ: ' + o.r);
      if (!o.vi) E(w, 'thiếu nghĩa');
      if (KANJI.test(o.jp)) W(w, 'từ vựng nên viết bằng kana');
      icon(w, o.e, true);
    });
  });
  stats.vocab = SJ.VOCAB_ALL.length;

  // ===== 3. KANJI =====
  const inLesson = new Set();
  SJ.LESSONS.filter(l => l.type === 'kanji').forEach(l => l.items.forEach(k => inLesson.add(k)));
  SJ.KANJI.forEach(o => {
    const w = 'Kanji ' + o.k;
    ['hv', 'm', 'on', 'tip'].forEach(f => { if (!o[f]) E(w, 'thiếu ' + f); });
    if (!o.ex.length) E(w, 'chưa có từ ví dụ');
    else if (o.ex.length < 2) G(w, 'mới có 1 từ ví dụ (nên ≥ 2)');
    o.ex.forEach(e => {
      if (!e.jp.includes(o.k)) E(w, 'từ ví dụ "' + e.jp + '" không chứa ' + o.k);
      if (!KANA.test(e.kana)) E(w, 'cách đọc ví dụ không phải kana: ' + e.kana);
      if (!ascii(e.r)) E(w, 'romaji ví dụ có ký tự lạ: ' + e.r);
    });
    if (!inLesson.has(o.k)) G(w, 'chưa nằm trong bài học Kanji nào');
  });
  stats.kanji = SJ.KANJI.length;

  // ===== 4. LỘ TRÌNH BÀI HỌC =====
  SJ.UNITS.forEach(u => {
    icon('Chặng ' + u.title, u.icon, true);
    u.lessons.forEach(l => {
      const w = 'Bài ' + l.id + ' (' + l.title + ')';
      if (l.icon) icon(w, l.icon);
      if (l.type === 'kana') l.items.forEach(k => { if (!SJ.KANA_MAP[k]) E(w, 'chữ ' + k + ' không có trong bảng chữ'); });
      if (l.type === 'kanji') l.items.forEach(k => { if (!SJ.KANJI_MAP[k]) E(w, 'Kanji ' + k + ' chưa có dữ liệu'); });
      if (l.type === 'vocab' && !SJ.VOCAB[l.topic]) E(w, 'chủ đề từ vựng ' + l.topic + ' không có');
      if (l.type === 'text') {
        const T = SJ.TEXT[l.content];
        if (!T) E(w, 'chưa có nội dung bài lý thuyết "' + l.content + '"');
        else {
          if (!T.sections || !T.sections.length) E(w, 'bài lý thuyết trống');
          (T.sections || []).forEach((s, i) => (s.ex || []).forEach(x => { if (x[1] && !ascii(x[1])) E(w + ' mục ' + (i + 1), 'romaji có ký tự lạ: ' + x[1]); }));
          quiz(w, T.quiz, 4);
        }
      }
      if (l.type === 'test' && !SJ.pool(l.pool).length) E(w, 'bộ đề kiểm tra rỗng');
    });
  });
  stats.lessons = SJ.LESSONS.length;

  // ===== 5. BÀI ĐỌC =====
  const lv = {};
  SJ.STORIES.forEach(s => {
    const w = 'Truyện ' + s.id + ' (' + s.title + ')';
    lv[s.level] = (lv[s.level] || 0) + 1;
    icon(w, s.icon, true);
    if (!s.lines || s.lines.length < 5) G(w, `truyện mới có ${(s.lines || []).length} câu (nên ≥ 5)`);
    (s.lines || []).forEach((x, i) => {
      if (!x.jp || !x.r || !x.vi) E(w + ' câu ' + (i + 1), 'thiếu chữ / romaji / nghĩa');
      if (x.r && !ascii(x.r)) E(w + ' câu ' + (i + 1), 'romaji có ký tự lạ: ' + x.r);
      if (x.jp) { furi(w + ' câu ' + (i + 1), x.jp); if (s.level === 1 && /[゠-ヿ]/.test(x.jp.replace(/ー/g, ''))) W(w, 'truyện cấp 1 (chỉ Hiragana) lại có Katakana: ' + x.jp); }
    });
    if (!s.words || s.words.length < 5) G(w, `mới có ${(s.words || []).length} từ mới (nên ≥ 5)`);
    quiz(w, s.quiz, 3);
  });
  [1, 2, 3].forEach(l => { if ((lv[l] || 0) < 4) G('Bài đọc cấp ' + l, `mới có ${lv[l] || 0} truyện (nên ≥ 4)`); });
  SJ.DIALOGUES.forEach(d => {
    const w = 'Hội thoại ' + d.id + ' (' + d.title + ')';
    icon(w, d.icon, true);
    Object.keys(d.people || {}).forEach(p => icon(w + ' vai ' + p, d.people[p][1], true));
    if (d.lines.length < 6) G(w, `mới có ${d.lines.length} câu (nên ≥ 6)`);
    d.lines.forEach((x, i) => {
      if (!d.people[x[0]]) E(w + ' câu ' + (i + 1), 'người nói "' + x[0] + '" không có trong danh sách vai');
      if (!x[1] || !x[2] || !x[3]) E(w + ' câu ' + (i + 1), 'thiếu chữ / romaji / nghĩa');
      if (x[2] && !ascii(x[2])) E(w + ' câu ' + (i + 1), 'romaji có ký tự lạ: ' + x[2]);
      if (x[1]) furi(w + ' câu ' + (i + 1), x[1]);
    });
  });
  SJ.PHRASES.forEach(c => {
    const w = 'Câu giao tiếp "' + c.cat + '"';
    icon(w, c.icon, true);
    if (c.list.length < 6) G(w, `mới có ${c.list.length} câu (nên ≥ 6)`);
    c.list.forEach(x => { if (!x[1] || !ascii(x[1])) E(w, 'romaji trống hoặc có ký tự lạ: ' + x[0]); if (!x[2]) E(w, 'thiếu nghĩa: ' + x[0]); furi(w, x[0]); });
  });
  stats.stories = SJ.STORIES.length; stats.dialogues = SJ.DIALOGUES.length; stats.phrases = SJ.PHRASES.reduce((s, c) => s + c.list.length, 0);

  // ===== 6. NÓI & NGỮ PHÁP =====
  SJ.talkPrep();
  const clean = t => String(t).replace(/[。、？！…]/g, '').trim();
  const PART = { 'は': 'wa', 'を': 'o', 'へ': 'e' };
  SJ.TALK_UNITS.forEach(u => {
    icon('Chặng Nói ' + u.title, u.icon, true);
    u.lessons.forEach(id => { if (!SJ.TALK_L[id] || !SJ.TALK_L[id].ex) E('Chặng Nói ' + u.title, 'bài ' + id + ' chưa có nội dung'); });
    if (u.lessons.length < 4) G('Chặng Nói ' + u.title, `mới có ${u.lessons.length} bài (nên ≥ 4)`);
  });
  Object.keys(SJ.TALK_X).forEach(id => { if (!SJ.TALK_L[id]) E('Nói ' + id, 'TALK_X cho bài không tồn tại'); });
  SJ.TALK_LESSONS.forEach(l => {
    const id = 'Nói ' + l.id;
    ['title', 'jp', 'goal', 'tip'].forEach(k => { if (!l[k]) E(id, 'thiếu ' + k); });
    icon(id, l.icon, true);
    if (!Array.isArray(l.points) || l.points.length < 3) G(id, 'phần giải thích mới có ' + (l.points || []).length + ' ý (nên ≥ 3)');
    if (l.ex.length < 7) G(id, `mới có ${l.ex.length} câu mẫu (nên ≥ 7)`);
    const jps = {};
    l.ex.forEach((e, i) => {
      const t = id + ' câu ' + (i + 1);
      if (!e.j || !e.r || !e.v) return E(t, 'thiếu chữ / romaji / nghĩa');
      if (e.toks.length !== e.rtoks.length) E(t, `số cụm chữ (${e.toks.length}) ≠ số cụm romaji (${e.rtoks.length}): ${e.j} / ${e.r}`);
      if (KANJI.test(e.j)) E(t, 'câu chính có Kanji (Kanji để ở k): ' + e.j);
      if (!ascii(e.r)) E(t, 'romaji có ký tự lạ: ' + e.r);
      e.toks.forEach((tk, k) => { const tt = tk.trim(), rr = (e.rtoks[k] || '').trim(); if (PART[tt] && rr !== PART[tt]) E(t, `trợ từ ${tt} phải đọc "${PART[tt]}" (đang là "${rr}")`); });
      if (jps[e.jp]) E(t, 'trùng câu: ' + e.jp); jps[e.jp] = 1;
    });
    const fills = l.fill || [], talks = l.talk || [];
    const minFill = l.kind === 'phrase' ? 2 : 3; // bài câu cố định (chào hỏi) ít chỗ để điền
    if (fills.length < minFill) G(id, `mới có ${fills.length} câu điền chỗ trống (nên ≥ ${minFill})`);
    if (talks.length < 3) G(id, `mới có ${talks.length} câu hội thoại (nên ≥ 3)`);
    fills.forEach((f, i) => {
      const e = l.ex[f.ex], t = id + ' điền ' + (i + 1);
      if (!e) return E(t, 'trỏ tới câu mẫu không có: ' + f.ex);
      if (!(f.tok >= 0 && f.tok < e.toks.length)) return E(t, 'vị trí cụm cần điền sai: ' + f.tok);
      const right = clean(e.toks[f.tok]);
      (f.wrong || []).forEach(x => { if (clean(x) === right) E(t, 'đáp án sai trùng đáp án đúng: ' + x); });
      if (!f.why) G(t, 'chưa có lời giải thích (why)');
    });
    const opt = x => typeof x === 'number' ? (l.ex[x] ? l.ex[x].jp : null) : (Array.isArray(x) ? x[0] : null);
    talks.forEach((d, i) => {
      const t = id + ' hội thoại ' + (i + 1), a = opt(d.a);
      if (!a) E(t, 'đáp án đúng sai dạng');
      (d.wrong || []).forEach(x => { const o = opt(x); if (!o) E(t, 'câu sai sai dạng'); else if (o === a) E(t, 'câu sai trùng câu đúng'); });
      if (d.q && (!d.qr || !d.qv)) E(t, 'câu hỏi thiếu romaji hoặc nghĩa');
    });
  });
  stats.talkUnits = SJ.TALK_UNITS.length; stats.talkLessons = SJ.TALK_LESSONS.length;
  stats.talkSentences = SJ.TALK_LESSONS.reduce((s, l) => s + l.ex.length, 0);

  // ===== 7. CHỮ DỄ NHẦM =====
  SJ.CONFUSE.forEach(g => {
    g.forEach(k => { if (!SJ.KANA_MAP[k]) E('Nhóm dễ nhầm ' + g.join(''), 'chữ ' + k + ' không có trong bảng chữ'); });
    // nhóm cùng một bộ chữ (toàn Hiragana hoặc toàn Katakana) thì cần mẹo phân biệt; nhóm カ/か là cùng âm nên không cần
    const hira = g.filter(k => /^[぀-ゟ]+$/.test(k)).length;
    if ((hira === g.length || hira === 0) && !SJ.CONFUSE_TIPS[g.join('')]) G('Nhóm dễ nhầm ' + g.join(' '), 'chưa có mẹo phân biệt');
  });

  // ===== 7b. HÌNH GỢI NHỚ (mẹo nhớ bằng hình) =====
  Object.keys(SJ.MNEMO_PIC || {}).forEach(k => {
    if (!SJ.KANA_MAP[k]) E('Hình gợi nhớ ' + k, 'chữ này không có trong bảng chữ');
    if (!SJ.hasIcon(SJ.MNEMO_PIC[k])) E('Hình gợi nhớ ' + k, 'icon "' + SJ.MNEMO_PIC[k] + '" không tồn tại');
  });
  SJ.KANA.hira.basic.concat(SJ.KANA.kata.basic).forEach(o => { if (o.m && !(SJ.MNEMO_PIC || {})[o.k] && o.k !== 'ヲ') G('Chữ ' + o.k, 'chưa có hình gợi nhớ cho mẹo nhớ (SJ.MNEMO_PIC trong js/data-kana.js) — vẽ icon khớp với câu mẹo'); });
  stats.mnemoPics = Object.keys(SJ.MNEMO_PIC || {}).length;

  // ===== 8. HÌNH VẼ: vẽ thử mọi icon, chữ / nét không được tràn khỏi khung 48×48 =====
  {
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;left:-9999px;top:0;width:2000px';
    document.body.appendChild(box);
    SJ.ICON_NAMES.forEach(n => {
      box.innerHTML = SJ.icon(n, 96);
      const svg = box.querySelector('svg'); if (!svg) return E('Hình ' + n, 'không vẽ ra được');
      svg.querySelectorAll('text').forEach(t => { const b = t.getBBox(); if (b.x < -2 || b.y < -2 || b.x + b.width > 50 || b.y + b.height > 50) E('Hình ' + n, `chữ "${t.textContent}" tràn ra ngoài khung (cỡ chữ thật ${getComputedStyle(t).fontSize}) — có CSS nào đang đè cỡ chữ?`); });
      const g = svg.getBBox();
      if (g.x < -4 || g.y < -4 || g.x + g.width > 52 || g.y + g.height > 52) W('Hình ' + n, `nét vẽ ra ngoài khung 48×48 (${g.x.toFixed(0)},${g.y.toFixed(0)} → ${(g.x + g.width).toFixed(0)},${(g.y + g.height).toFixed(0)})`);
    });
    box.remove();
    stats.icons = SJ.ICON_NAMES.length;
  }

  return { errors, warns, gaps, stats };
};
