/* SubelJapan — Trình phát bài học: giới thiệu → thẻ học → bài tập đa dạng → kết quả
 * Dạng bài tập: chọn đáp án, nghe, ghép cặp, gõ romaji, viết từng nét, xếp chữ thành từ */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);

  // ---------- Dựng câu hỏi trắc nghiệm ----------
  function distinct(list, n, keyFn, exclude) {
    const seen = new Set(exclude || []); const out = [];
    for (const x of U().shuffle(list)) { const k = keyFn(x); if (!seen.has(k)) { seen.add(k); out.push(x); if (out.length >= n) break; } }
    return out;
  }
  const pic = (e, s) => (e && SJ.hasIcon(e)) ? I(e, s || 96, 'pic') : '';
  const listenPrompt = say => `<div class="listen-row"><button class="listen-btn" data-say="${esc(say)}" aria-label="Nghe">${I('speaker', 64)}</button><button class="listen-btn listen-slow" data-slow="${esc(say)}" aria-label="Nghe chậm">${I('slow', 40)}</button></div>`;
  // so theo âm: を/ヲ (wo) đọc giống お/オ → không cho làm đáp án nhiễu của nhau
  const snd = o => o.r === 'wo' ? 'o' : o.r;
  function kanaQ(item, type, pool) {
    const pl = pool.filter(o => o.k !== item.k && o.group !== 'small');
    // ưu tiên đáp án nhiễu là chữ dễ nhầm
    const conf = SJ.confusables ? SJ.confusables(item.k).list.map(k => SJ.KANA_MAP[k]).filter(o => o && snd(o) !== snd(item)) : [];
    const others = distinct(conf, 1, snd, [snd(item)]);
    const opts = U().shuffle([item].concat(others, distinct(pl, 3 - others.length, snd, [snd(item)].concat(others.map(snd)))));
    if (type === 'k2r') return { key: item.k, item, type, prompt: `<div class="q-big">${item.k}</div>`, ask: 'Chữ này đọc là gì?', options: opts.map(o => ({ label: o.r, val: o.k })), answer: item.k, hint: `<span class="jp">${item.k}</span> đọc là <b>${item.r}</b> — ${esc(item.m)}` };
    if (type === 'r2k') return { key: item.k, item, type, prompt: `<div class="romaji-big">${item.r}</div>`, ask: 'Chọn chữ đúng nhé!', options: opts.map(o => ({ label: `<span class="opt-jp">${o.k}</span>`, val: o.k })), answer: item.k, hint: `<b>${item.r}</b> = <span class="jp">${item.k}</span> — ${esc(item.m)}` };
    return { key: item.k, item, type: 'listen', say: item.k, prompt: listenPrompt(item.k), ask: 'Nghe và chọn chữ đúng', options: opts.map(o => ({ label: `<span class="opt-jp">${o.k}</span>`, val: o.k })), answer: item.k, hint: `<span class="jp">${item.k}</span> = ${item.r}` };
  }
  function vocabQ(item, type, pool) {
    const opts = U().shuffle([item].concat(distinct(pool.filter(o => o.key !== item.key), 3, o => o.vi, [item.vi])));
    if (type === 'w2m') return { key: item.key, item, type, say: item.jp, prompt: `<div class="q-word jp">${esc(item.jp)}</div><div class="q-sub">${esc(item.r)}</div>`, ask: 'Từ này nghĩa là gì?', options: opts.map(o => ({ label: esc(o.vi), val: o.key })), answer: item.key, hint: `<span class="jp">${esc(item.jp)}</span> = ${esc(item.vi)}` };
    if (type === 'm2w') return { key: item.key, item, type, prompt: `${pic(item.e, 96)}<div class="q-mean">${esc(item.vi)}</div>`, ask: 'Chọn từ tiếng Nhật đúng', options: opts.map(o => ({ label: `<span class="jp">${esc(o.jp)}</span>`, val: o.key })), answer: item.key, hint: `<span class="jp">${esc(item.jp)}</span> (${esc(item.r)})` };
    return { key: item.key, item, type: 'listen', say: item.jp, prompt: listenPrompt(item.jp), ask: 'Nghe và chọn nghĩa đúng', options: opts.map(o => ({ label: `<span class="opt-pic">${I(o.e, 34)}</span>${esc(o.vi)}`, val: o.key })), answer: item.key, hint: `<span class="jp">${esc(item.jp)}</span> (${esc(item.r)}) = ${esc(item.vi)}` };
  }
  function kanjiQ(item, type, pool) {
    const others = pool.filter(o => o.k !== item.k);
    if (type === 'k2m') {
      const opts = U().shuffle([item].concat(distinct(others, 3, o => o.m, [item.m])));
      return { key: item.key, item, type, prompt: `<div class="q-big">${item.k}</div>`, ask: 'Chữ Hán này nghĩa là gì?', options: opts.map(o => ({ label: esc(o.m), val: o.k })), answer: item.k, hint: `<span class="jp">${item.k}</span> — ${item.hv}: ${esc(item.tip)}` };
    }
    if (type === 'm2k') {
      const opts = U().shuffle([item].concat(distinct(others, 3, o => o.k, [item.k])));
      return { key: item.key, item, type, prompt: `<div class="q-mean">${esc(item.m)}</div>`, ask: 'Chữ Hán nào mang nghĩa này?', options: opts.map(o => ({ label: `<span class="opt-jp">${o.k}</span>`, val: o.k })), answer: item.k, hint: `<span class="jp">${item.k}</span> (${item.hv}) = ${esc(item.m)}` };
    }
    if (type === 'k2hv') {
      const opts = U().shuffle([item].concat(distinct(others, 3, o => o.hv, [item.hv])));
      return { key: item.key, item, type, prompt: `<div class="q-big">${item.k}</div>`, ask: 'Âm Hán Việt của chữ này là?', options: opts.map(o => ({ label: o.hv, val: o.k })), answer: item.k, hint: `<span class="jp">${item.k}</span> đọc Hán Việt là <b>${item.hv}</b> (${esc(item.m)})` };
    }
    const ex = item.ex[0];
    const allEx = pool.flatMap(o => o.ex).filter(e => e.kana !== ex.kana);
    const opts = U().shuffle([ex].concat(distinct(allEx, 3, e => e.kana, [ex.kana])));
    return { key: item.key, item, type, say: ex.kana, prompt: `<div class="q-word jp">${ex.jp}</div><div class="q-sub">${esc(ex.vi)}</div>`, ask: 'Từ này đọc là gì?', options: opts.map(o => ({ label: `<span class="jp">${o.kana}</span>`, val: o.kana })), answer: ex.kana, hint: `<span class="jp">${ex.jp}</span> đọc là <span class="jp">${ex.kana}</span> (${ex.r})` };
  }
  // ghép cặp
  function pairsQ(items, kind) {
    const list = U().sample(items, Math.min(5, items.length));
    const L = list.map(o => kind === 'vocab' ? { id: o.key, label: `<span class="jp">${esc(o.jp)}</span>`, say: o.jp } : kind === 'kanji' ? { id: o.key, label: `<span class="opt-jp">${o.k}</span>` } : { id: o.k, label: `<span class="opt-jp">${o.k}</span>`, say: o.k });
    const R = list.map(o => kind === 'vocab' ? { id: o.key, label: esc(o.vi) } : kind === 'kanji' ? { id: o.key, label: o.hv } : { id: o.k, label: o.r });
    return { type: 'pairs', kind, left: U().shuffle(L), right: U().shuffle(R), ask: kind === 'vocab' ? 'Ghép từ với nghĩa đúng' : kind === 'kanji' ? 'Ghép Kanji với âm Hán Việt' : 'Ghép chữ với cách đọc' };
  }
  const typeQ = item => ({ type: 'type', key: item.k, item, ask: 'Gõ cách đọc (romaji) của chữ này', prompt: `<div class="q-big">${item.k}</div>`, hint: `<span class="jp">${item.k}</span> đọc là <b>${item.r}</b>` });
  const writeQ = (item, label) => ({ type: 'write', key: item.key || item.k, item, ch: item.k, label: label || item.r, ask: 'Viết chữ này theo từng nét nhé' });
  function buildQ(item) {
    const chars = Array.from(SJ.ui.reading(item.jp).replace(/[ 　]/g, ''));
    const pool = SJ.KANA_ALL.filter(o => o.group === 'basic' && o.script === (/[ァ-ヴ]/.test(chars[0]) ? 'kata' : 'hira')).map(o => o.k);
    const extra = U().sample(pool.filter(c => !chars.includes(c)), Math.min(3, Math.max(2, 7 - chars.length)));
    return { type: 'build', key: item.key, item, chars, tiles: U().shuffle(chars.concat(extra)), ask: 'Xếp chữ thành từ đúng', hint: `<span class="jp">${esc(item.jp)}</span> (${esc(item.r)}) = ${esc(item.vi)}` };
  }
  const romajiOk = (input, item) => {
    const v = String(input || '').toLowerCase().replace(/[^a-z]/g, '');
    if (!v) return false;
    const r = item.r.toLowerCase().replace(/[^a-z]/g, '');
    if (v === r) return true;
    // "o" chỉ được chấp nhận cho を/ヲ, không cho ウォ
    const alts = (r === 'wo' && !/^[をヲ]$/.test(item.k)) ? [] : SJ.ROMAJI_ALT[r] || [];
    if (alts.includes(v)) return true;
    // so sánh qua bộ gõ: shi = si…
    try { return SJ.ime.toHira(v, true) === SJ.toHira(item.k); } catch (e) { return false; }
  };

  function buildQuiz(lesson, items) {
    const pool0 = lesson.type === 'kana' && items.length < 6 ? items.concat(SJ.KANA[items[0].script].basic) : lesson.type === 'kanji' && items.length < 6 ? items.concat(SJ.KANJI) : items;
    // Bài tập đi từ DỄ → KHÓ, làm quen từng kiểu một:
    // nhận mặt (nhìn → chọn) → ghép cặp → nhớ ngược (nghĩa/âm → chọn chữ) → nghe → viết theo nét → tự gõ / tự xếp
    const qs = [];
    const take = (arr, n) => U().shuffle(arr).slice(0, n);
    if (lesson.type === 'kana') {
      // 2 bài đầu mỗi bộ chữ: chỉ 3 lựa chọn, chưa có câu tự gõ romaji
      const early = /^[hk][12]$/.test(lesson.id);
      const single = items.filter(o => o.k.length === 1);
      take(items, 6).forEach(it => qs.push(easier(kanaQ(it, 'k2r', pool0), early, items)));
      if (items.length >= 3) qs.push(pairsQ(items, 'kana'));
      take(items, 6).forEach(it => qs.push(easier(kanaQ(it, 'r2k', pool0), early, items)));
      take(items, 2).forEach(it => qs.push(kanaQ(it, 'listen', pool0)));
      take(single, 2).forEach(it => qs.push(writeQ(it)));
      if (!early) take(items, 2).forEach(it => qs.push(typeQ(it)));
    } else if (lesson.type === 'vocab') {
      take(items, 6).forEach(it => qs.push(vocabQ(it, 'w2m', items)));
      qs.push(pairsQ(items, 'vocab'));
      take(items, 5).forEach(it => qs.push(vocabQ(it, 'm2w', items)));
      take(items, 2).forEach(it => qs.push(vocabQ(it, 'listen', items)));
      take(items.filter(o => Array.from(SJ.ui.reading(o.jp)).length <= 6 && !/[一-龯]/.test(SJ.ui.reading(o.jp))), 2).forEach(it => qs.push(buildQ(it)));
    } else if (lesson.type === 'kanji') {
      take(items, 5).forEach(it => qs.push(kanjiQ(it, 'k2m', pool0)));
      qs.push(pairsQ(items, 'kanji'));
      take(items, 4).forEach(it => qs.push(kanjiQ(it, 'm2k', pool0)));
      take(items, 3).forEach(it => qs.push(kanjiQ(it, 'k2hv', pool0)));
      take(items, 2).forEach(it => qs.push(kanjiQ(it, 'read', pool0)));
      take(items, 2).forEach(it => qs.push(writeQ(it, `${it.hv} — ${it.m}`)));
    }
    return noListen(qs, pool0);
  }
  /** bài đầu: bớt còn 3 lựa chọn, ưu tiên chữ vừa học trong bài (dễ đoán hơn chữ lạ) */
  function easier(q, early, items) {
    if (!early || !q.options || q.options.length <= 3) return q;
    const right = q.options.find(o => o.val === q.answer);
    const own = new Set(items.map(o => o.k));
    const rest = q.options.filter(o => o !== right).sort((a, b) => (own.has(b.val) ? 1 : 0) - (own.has(a.val) ? 1 : 0)).slice(0, 2);
    q.options = U().shuffle([right].concat(rest));
    return q;
  }
  /** câu nghe → câu đọc tương ứng (khi người học không nghe được) */
  function deListen(q, pool) {
    if (!q || q.type !== 'listen' || !q.item) return q;
    const nq = q.item.jp ? vocabQ(q.item, 'w2m', pool && pool.some(o => o.jp) ? pool : SJ.VOCAB_ALL) : kanaQ(q.item, 'k2r', pool && pool.length >= 4 && !pool[0].jp ? pool : SJ.KANA[q.item.script || 'hira'].basic);
    return Object.assign(nq, { retry: q.retry, deferred: q.deferred });
  }
  const noListen = (qs, pool) => SJ.audio.canListen() ? qs : qs.map(q => deListen(q, pool));
  function buildTextQuiz(content) {
    return (content.quiz || []).map(q => {
      const opts = U().shuffle(q.o.map((o, j) => ({ label: q.big ? `<span class="jp">${esc(o)}</span>` : esc(o), val: String(j) })));
      return { key: null, type: 'text', prompt: `<div class="q-text">${esc(q.q)}</div>`, ask: 'Chọn đáp án đúng', options: opts, answer: '0', hint: 'Đáp án: ' + esc(q.o[0]) };
    });
  }
  function buildTest(lesson) {
    const pool = SJ.pool(lesson.pool);
    const types = ['k2r', 'r2k', 'listen', 'k2r', 'type'];
    return noListen(U().sample(pool, lesson.count || 20).map((it, i) => types[i % 5] === 'type' ? typeQ(it) : kanaQ(it, types[i % 5], pool)), pool);
  }

  // ---------- Bảng a・i・u・e・o mini ----------
  function rowGrid(items) {
    const set = new Set(items.map(o => o.k));
    const script = items[0].script;
    const conv = c => script === 'kata' ? SJ.toKata(c) : c;
    const rows = SJ.GOJUON.basic.concat(SJ.GOJUON.daku).filter(r => Array.from(r[1]).some(c => c !== '_' && set.has(conv(c))));
    if (!rows.length) return '';
    return `<div class="gojuon mini"><div class="gj-row gj-head"><span></span>${SJ.GOJUON.cols.map(c => `<span>${c}</span>`).join('')}</div>
      ${rows.map(r => `<div class="gj-row"><span class="gj-lab">${r[0] || '–'}</span>${Array.from(r[1]).map(c => c === '_' ? '<span class="gj-c empty"></span>' : `<span class="gj-c ${set.has(conv(c)) ? 'on' : ''}">${conv(c)}</span>`).join('')}</div>`).join('')}</div>`;
  }

  // ---------- Thẻ học ----------
  const glyph = (ch, extra) => `<div class="glyph ${extra || (ch.length > 2 ? 'xwide' : ch.length > 1 ? 'wide' : '')}" data-say="${ch}"><span class="kana">${ch}</span></div>`;
  function exampleRow(w) {
    return `<div class="example" data-say="${esc(SJ.ui.reading(w.jp))}">${w.e && SJ.hasIcon(w.e) ? `<span class="ex-pic">${I(w.e, 42)}</span>` : ''}<span class="jp ex-jp">${esc(w.jp)}</span><span class="ex-ro">${esc(w.r)}</span><span class="ex-vi">${esc(w.vi)}</span><span class="ex-say">${I('speaker', 20)}</span></div>`;
  }
  function confuseRow(ch) {
    if (!SJ.confusables) return '';
    const c = SJ.confusables(ch); if (!c.list.length) return '';
    return `<div class="warn-note">${I('eye', 26)}<div><b>Dễ nhầm với:</b> ${c.list.map(k => `<span class="jp">${k}</span>${SJ.KANA_MAP[k] ? ` (${SJ.KANA_MAP[k].r})` : ''}`).join(', ')}${c.tip ? `<div class="small muted mt-s">${esc(c.tip)}</div>` : ''}</div></div>`;
  }
  const strokeCol = (ch) => `<div class="lc-stroke"><div class="mini-label">Thứ tự nét</div><div class="stroke-box" data-stroke="${ch}"></div>
    <div class="row center-row gap-s wrap"><button class="btn btn-sm btn-white" data-act="replay">${I('play', 18)} Xem lại</button><button class="btn btn-sm btn-yel" data-act="trace">${I('pencil', 18)} Tập viết</button></div></div>`;
  function kanaCard(it) {
    return `<div class="learn-card card slide-in-r">
      <div class="lc-main">
        <div class="lc-char">${glyph(it.k)}<div class="lc-romaji">${it.r}</div><button class="btn btn-sm btn-white" data-say="${it.k}">${I('speaker', 20)} Nghe</button></div>
        ${strokeCol(it.k)}
      </div>
      <div class="lc-info">
        <div class="info-row"><span class="tag tag-pink">${I('talk', 16)} Đọc gần giống</span><b>${esc(it.v || it.r)}</b></div>
        <div class="mnemo">${I('bulb', 28)}<span>${esc(it.m)}</span></div>
        ${confuseRow(it.k)}
        ${it.w ? exampleRow(it.w) : ''}
      </div></div>`;
  }
  function vocabCard(it) {
    return `<div class="learn-card card slide-in-r vocab-card">
      <div class="vc-pic bounce-in">${I(it.e, 120, 'pic')}</div>
      <div class="vc-word jp" data-say="${esc(SJ.ui.reading(it.jp))}">${esc(it.jp)}</div>
      <div class="vc-romaji">${esc(it.r)}</div>
      <div class="vc-mean">${esc(it.vi)}</div>
      <div class="row center-row gap-s"><button class="btn btn-sm btn-white" data-say="${esc(SJ.ui.reading(it.jp))}">${I('speaker', 20)} Nghe</button><button class="btn btn-sm btn-white" data-slow="${esc(SJ.ui.reading(it.jp))}">${I('slow', 22)} Nghe chậm</button><button class="btn btn-sm btn-white fav-toggle" data-fav="${esc(it.key)}">${I('heart', 20)} ${SJ.store.isFav(it.key) ? 'Đã lưu' : 'Lưu từ'}</button></div></div>`;
  }
  function kanjiCard(it) {
    return `<div class="learn-card card slide-in-r">
      <div class="lc-main">
        <div class="lc-char">${glyph(it.k)}<div class="hv-badge">${it.hv}</div><div class="lc-mean">${esc(it.m)}</div></div>
        ${strokeCol(it.k)}
      </div>
      <div class="lc-info">
        <div class="info-row"><span class="tag tag-blue">Âm On</span><span class="jp">${it.on}</span><span class="tag tag-green">Âm Kun</span><span class="jp">${it.kun}</span></div>
        <div class="mnemo">${I('bulb', 28)}<span>${esc(it.tip)}</span></div>
        ${it.ex.map(e => `<div class="example" data-say="${e.kana}"><span class="jp ex-jp">${e.jp}</span><span class="jp ex-kana">${e.kana}</span><span class="ex-ro">${e.r}</span><span class="ex-vi">${esc(e.vi)}</span><span class="ex-say">${I('speaker', 20)}</span></div>`).join('')}
      </div></div>`;
  }

  /** Bảng tập viết trong cửa sổ nổi — chấm từng nét */
  function openTrace(ch, info) {
    let mode = SJ.store.get().settings.writeMode || 'guide';
    const m = U().modal(`<div class="trace-modal">
      <div class="write-head"><span class="wh-k kana">${ch}</span><div><div class="wh-r">${esc(info || '')}</div><div class="wh-sub">Viết từng nét theo đúng thứ tự — Mochi chấm từng nét cho bạn</div></div></div>
      <div class="row center-row mb"><div class="seg" data-mode>${[['guide', 'Tô theo'], ['hint', 'Gợi ý'], ['free', 'Thuộc lòng']].map(x => `<button data-m="${x[0]}" class="${x[0] === mode ? 'active' : ''}">${x[1]}</button>`).join('')}</div></div>
      <div id="tm-pad"></div>
      <div class="pad-tools"><button class="btn btn-sm btn-white" data-a="demo">${I('play', 18)} Xem mẫu</button><button class="btn btn-sm btn-white" data-a="hint">${I('bulb', 18)} Gợi ý nét</button><button class="btn btn-sm btn-white" data-a="again">${I('refresh', 18)} Viết lại</button></div>
      <div id="tm-res" class="mt"></div>
      <div id="tm-demo" class="hidden mt"><div class="stroke-box sm" style="margin:0 auto"></div></div></div>`, { cls: 'modal-sm' });
    const res = m.el.querySelector('#tm-res');
    const p = SJ.writing.pad(m.el.querySelector('#tm-pad'), ch, { mode, onDone: r => onWriteDone(r, ch, res) });
    m.el.addEventListener('click', e => {
      const sb = e.target.closest('[data-m]');
      if (sb) { mode = sb.dataset.m; SJ.store.setSetting('writeMode', mode); m.el.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('active', b === sb)); p.setMode(mode); res.innerHTML = ''; return; }
      const a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'hint') p.hint();
      if (a.dataset.a === 'again') { p.restart(); res.innerHTML = ''; }
      if (a.dataset.a === 'demo') { const d = m.el.querySelector('#tm-demo'); d.classList.remove('hidden'); SJ.writing.strokeView(d.querySelector('.stroke-box'), ch); }
    });
    return m;
  }
  function onWriteDone(r, ch, out) {
    const v = SJ.writing.verdict(r.score);
    SJ.store.addWritten(r.perfect); SJ.store.addXP(2);
    SJ.store.rec(SJ.KANJI_MAP[ch] ? 'j:' + ch : ch, r.mistakes <= 1);
    if (out) out.innerHTML = `<div class="score-pop pop-in">${U().mascot(v.mood, 58)}<div class="grow"><div class="score-num">${r.score}<small>/100</small> ${U().stars(r.stars, 3, 20)}</div><div class="bold">${v.text}</div></div>${r.perfect ? U().hanko('優', 'sm') : ''}</div>`;
    return v;
  }
  // tương thích cũ
  function showScore(fp, out, ch) {
    if (!fp.hasInk()) { out.innerHTML = `<span class="muted">Hãy viết thử trước đã nha</span>`; return null; }
    const r = fp.score(); const v = SJ.writing.verdict(r.score);
    out.innerHTML = `<div class="score-pop pop-in">${U().mascot(v.mood, 56)}<div><div class="score-num">${r.score}<small>/100</small> ${U().stars(v.stars, 3, 20)}</div><div>${v.text}</div></div></div>`;
    if (r.score >= 50) { SJ.store.addWritten(); SJ.store.addXP(2); SJ.audio.sfx('ok'); } else SJ.audio.sfx('bad');
    return r;
  }

  // ---------- Bộ phát bài học ----------
  function open(root, id) {
    const lesson = Object.prototype.hasOwnProperty.call(SJ.LESSON_MAP, id) ? SJ.LESSON_MAP[id] : null;
    if (!lesson) { root.innerHTML = `<div class="page-narrow center pad-xl">${U().mascot('sad', 120)}<h2>Không tìm thấy bài học</h2><a class="btn" href="#/">Về lộ trình</a></div>`; return; }
    const unit = SJ.UNITS.find(u => u.id === lesson.unit);
    let items = [];
    if (lesson.type === 'kana') items = lesson.items.map(k => SJ.KANA_MAP[k]).filter(Boolean);
    if (lesson.type === 'vocab') items = SJ.VOCAB[lesson.topic];
    if (lesson.type === 'kanji') items = lesson.items.map(k => SJ.KANJI_MAP[k]);
    const content = lesson.type === 'text' ? SJ.TEXT[lesson.content] : (lesson.pre ? SJ.TEXT[lesson.pre] : null);

    let phase = 'intro', idx = 0, queue = [], qi = 0, firstTotal = 0, firstOk = 0, answered = false, sv = null, wp = null, destroyed = false, streak = 0, t0 = Date.now();
    root.innerHTML = `<div class="lesson" style="--uc:${unit.color}">
      <div class="lesson-top"><button class="lesson-x" aria-label="Thoát">${I('batsu', 24)}</button><div class="bar lesson-prog"><i style="width:0"></i></div><div class="lesson-count"></div></div>
      <div class="lesson-body"></div>
      <div class="lesson-foot"></div></div>`;
    const body = root.querySelector('.lesson-body'), foot = root.querySelector('.lesson-foot');
    const fill = root.querySelector('.lesson-prog > i'), count = root.querySelector('.lesson-count');
    const setFoot = (html, cls) => { foot.className = 'lesson-foot ' + (cls || ''); foot.innerHTML = html ? `<div class="foot-in">${html}</div>` : ''; };

    root.querySelector('.lesson-x').onclick = async () => {
      if (phase === 'result' || phase === 'intro' || await U().confirm('Thoát bài học bây giờ hả? Tiến độ bài này sẽ chưa được lưu đâu nha.', 'Thoát', 'Học tiếp')) location.hash = '#/';
    };
    const setProg = (p, txt) => { fill.style.width = U().clamp(p, 0, 100) + '%'; count.textContent = txt || ''; };
    const cleanup = () => { sv && sv.stop(); sv = null; wp && wp.destroy(); wp = null; };

    function render() {
      if (destroyed) return;
      cleanup();
      body.onclick = null;
      ({ intro: renderIntro, read: renderRead, learn: renderLearn, quiz: renderQuiz, result: renderResult })[phase]();
      window.scrollTo(0, 0);
    }

    function renderIntro() {
      setProg(0);
      const preview = lesson.type === 'kana' ? rowGrid(items) || items.map(o => `<span class="chip-kana">${o.k}</span>`).join('')
        : lesson.type === 'kanji' ? items.map(o => `<span class="chip-kana">${o.k}</span>`).join('')
          : lesson.type === 'vocab' ? items.slice(0, 8).map(o => `<span class="chip-pic">${I(o.e, 46)}</span>`).join('') : `<span class="chip-pic big">${I(lesson.icon || 'book', 96)}</span>`;
      const st = SJ.store.lessonState(lesson.id);
      body.innerHTML = `<div class="intro-card pop-in">
        <div class="unit-pill">${I(unit.icon, 22)} ${unit.title}</div>
        <h1 class="lesson-title">${esc(lesson.title)}</h1>
        <div class="lesson-sub">${esc(lesson.sub || '')}</div>
        <div class="preview">${preview}</div>
        ${U().mascotSay(esc(lesson.intro || (lesson.type === 'test' ? 'Bài kiểm tra tổng hợp! Đừng lo, sai thì làm lại thôi — Mochi luôn cổ vũ bạn.' : 'Cùng đọc thật chậm và hiểu thật kỹ nha!')), 'happy')}
        ${st && st.done ? `<div class="done-note">${U().stars(st.stars, 3, 20)} Bạn đã học bài này — học lại để lấy thêm sao nhé!</div>` : ''}
      </div>`;
      setFoot(`<span class="grow muted bold hide-sm">${I('star', 20)} +${st && st.done ? 6 : 15} XP · ${I('fishcoin', 20)} cá thưởng</span><button class="btn btn-lg" data-go>${lesson.type === 'test' ? 'Bắt đầu kiểm tra' : 'Bắt đầu học'} ${I('arrow_r', 22)}</button>`);
      foot.querySelector('[data-go]').onclick = () => {
        SJ.audio.sfx('open');
        if (lesson.type === 'text' || (content && lesson.pre)) phase = 'read';
        else if (lesson.type === 'test') return startQuiz(buildTest(lesson));
        else { phase = 'learn'; idx = 0; }
        render();
      };
    }

    function renderRead() {
      setProg(8, 'Đọc hiểu');
      body.innerHTML = `<div class="read col gap">${content.sections.map((s, i) => `<section class="card card-pad pop-in" style="animation-delay:${i * .05}s">
        <h2>${U().brand(esc(s.h))}</h2><p>${U().brand(esc(s.p))}</p>
        ${s.list ? `<div class="col gap-s">${s.list.map(l => `<div class="example" data-say="${esc(l[0])}"><span class="jp ex-jp">${l[0]}</span><span class="ex-vi">${esc(l[1])}</span></div>`).join('')}</div>` : ''}
        ${s.ex ? `<div class="col gap-s">${s.ex.map(e => `<div class="example" data-say="${esc(e[0])}"><span class="jp ex-jp">${esc(e[0])}</span><span class="ex-ro">${esc(e[1])}</span><span class="ex-vi">${esc(e[2])}</span><span class="ex-say">${I('speaker', 20)}</span></div>`).join('')}</div>` : ''}
        ${s.widget === 'name' ? nameWidget() : ''}
      </section>`).join('')}</div>`;
      bindNameWidget(body);
      setFoot(`<span class="grow"></span><button class="btn btn-lg" data-go>${lesson.type === 'text' ? 'Làm bài tập nhỏ' : 'Học từng chữ'} ${I('arrow_r', 22)}</button>`);
      foot.querySelector('[data-go]').onclick = () => {
        if (lesson.type === 'text') startQuiz(buildTextQuiz(content)); else { phase = 'learn'; idx = 0; render(); }
      };
    }

    function renderLearn() {
      const it = items[idx];
      setProg(5 + idx / items.length * 35, `Thẻ ${idx + 1}/${items.length}`);
      body.innerHTML = lesson.type === 'kana' ? kanaCard(it) : lesson.type === 'kanji' ? kanjiCard(it) : vocabCard(it);
      const sb = body.querySelector('[data-stroke]');
      if (sb) sv = SJ.writing.strokeView(sb, sb.dataset.stroke);
      SJ.audio.speak(lesson.type === 'vocab' ? SJ.ui.reading(it.jp) : it.k);
      SJ.store.seen(lesson.type === 'kana' ? it.k : it.key);
      body.onclick = e => {
        const sl = e.target.closest('[data-slow]'); if (sl) { SJ.audio.speak(sl.dataset.slow, { rate: 0.5 }); return; }
        const fv = e.target.closest('[data-fav]'); if (fv) { const on = SJ.store.toggleFav(fv.dataset.fav); fv.innerHTML = `${I('heart', 20)} ${on ? 'Đã lưu' : 'Lưu từ'}`; SJ.audio.sfx(on ? 'pop' : 'tap'); return; }
        const a = e.target.closest('[data-act]'); if (!a) return;
        if (a.dataset.act === 'replay') sv && sv.play();
        if (a.dataset.act === 'trace') openTrace(it.k, lesson.type === 'kanji' ? `${it.hv} — ${it.m}` : it.r);
      };
      const last = idx === items.length - 1;
      setFoot(`<button class="btn btn-white" data-prev ${idx === 0 ? 'disabled' : ''} aria-label="Thẻ trước">${I('arrow_l', 22)}</button><span class="grow"></span><button class="btn btn-lg" data-next>${last ? 'Làm bài tập nào!' : 'Tiếp theo'} ${I('arrow_r', 22)}</button>`);
      foot.querySelector('[data-prev]').onclick = () => { if (idx > 0) { idx--; render(); } };
      foot.querySelector('[data-next]').onclick = () => {
        SJ.audio.sfx('flip');
        if (last) startQuiz(buildQuiz(lesson, items)); else { idx++; render(); }
      };
    }

    function startQuiz(qs) { queue = qs; qi = 0; firstTotal = qs.length; firstOk = 0; streak = 0; phase = 'quiz'; render(); }

    function renderQuiz() {
      const q = queue[qi];
      answered = false;
      setProg(40 + qi / queue.length * 60, `${Math.min(qi + 1, queue.length)}/${queue.length}`);
      const tags = `${q.retry ? `<div class="retry-tag">${I('refresh', 16)} Làm lại câu này nha</div>` : ''}${streak >= 3 ? `<div class="streak-tag">${I('fire', 18)} Đúng ${streak} câu liền!</div>` : ''}`;
      setFoot('');
      if (q.type === 'pairs') return renderPairs(q, tags);
      if (q.type === 'type') return renderType(q, tags);
      if (q.type === 'write') return renderWrite(q, tags);
      if (q.type === 'build') return renderBuild(q, tags);
      body.innerHTML = `<div class="quiz slide-in-r">${tags}
        <div class="quiz-ask">${q.ask}</div>
        <div class="quiz-prompt">${q.prompt}</div>
        <div class="quiz-opts ${q.options.length > 3 ? 'four' : ''}">${q.options.map((o, i) => `<button class="opt" data-nosfx="1" data-v="${esc(o.val)}"><kbd>${i + 1}</kbd>${o.label}</button>`).join('')}</div>
      </div>`;
      if (q.say) setTimeout(() => SJ.audio.speak(q.say), 250);
      body.querySelectorAll('.opt').forEach(b => b.onclick = () => choose(b));
      bindSlow();
      if (q.type === 'listen') {
        setFoot(`<div class="nolisten-row"><button class="btn btn-white" data-nolisten>${I('mute', 22)} Không nghe được lúc này</button><span class="small muted bold">Mochi sẽ đổi câu nghe thành câu đọc trong 1 tiếng</span></div>`);
        foot.querySelector('[data-nolisten]').onclick = () => {
          if (answered) return;
          SJ.audio.stop(); SJ.audio.listenOff(60);
          const pool = items && items.length ? items : null;
          for (let k = qi; k < queue.length; k++) queue[k] = deListen(queue[k], pool);
          U().toast(`${I('mute', 24)} Đã tắt câu nghe trong 1 tiếng — câu này đổi thành câu đọc nha`, 3200);
          renderQuiz();
        };
      }
    }
    const bindSlow = () => body.querySelectorAll('[data-slow]').forEach(b => b.onclick = () => SJ.audio.speak(b.dataset.slow, { rate: 0.5 }));
    function choose(btn) {
      if (answered) return;
      const q = queue[qi];
      const ok = btn.dataset.v === q.answer;
      body.querySelectorAll('.opt').forEach(b => { b.disabled = true; if (b.dataset.v === q.answer) b.classList.add('ok'); });
      if (!ok) btn.classList.add('bad', 'shake');
      if (ok && q.type !== 'listen' && !q.say && q.item && q.key === q.item.k) setTimeout(() => SJ.audio.speak(q.item.k), 350);
      grade(ok, q.hint);
    }
    /** chấm 1 câu và hiện thanh phản hồi */
    function grade(ok, hint, opt) {
      answered = true;
      const q = queue[qi];
      if (q.key) SJ.store.rec(q.key, ok);
      if (ok && !q.retry) firstOk++;
      if (!ok && !q.retry && !(opt && opt.noRetry)) queue.push(Object.assign({}, q, { retry: true }));
      streak = ok ? streak + 1 : 0;
      SJ.emit('answer', { ok, streak });
      if (!(opt && opt.silent)) SJ.audio.sfx(ok ? (streak > 0 && streak % 5 === 0 ? 'combo' : 'ok') : 'bad');
      setFoot(`<div class="fb slide-up"><span class="fb-badge">${I(ok ? 'check' : 'batsu', 36)}</span><div><div class="fb-title">${ok ? (opt && opt.title) || U().pick(SJ.CHEERS) : U().pick(SJ.COMFORTS)}</div>${!ok || (opt && opt.showHint) ? `<div class="fb-hint">${hint || ''}</div>` : ''}</div></div>${!ok && SJ.ai && !(opt && opt.noWhy) ? `<button class="btn btn-white fb-why" data-why title="Hỏi Sensei Mochi vì sao">${I('sensei', 26)}<span>Vì sao?</span></button>` : ''}<button class="btn btn-lg ${ok ? 'btn-green' : 'btn-red'}" data-cont>Tiếp tục</button>`, ok ? 'ok' : 'bad');
      const why = foot.querySelector('[data-why]');
      if (why) why.onclick = () => {
        const txt = sel => { const el = body.querySelector(sel); if (!el) return ''; const c = el.cloneNode(true); c.querySelectorAll('kbd, rt, button, svg').forEach(x => x.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); };
        const hintTxt = new DOMParser().parseFromString(hint || '', 'text/html').body.textContent.trim();
        const typed = body.querySelector('#ta');
        // câu xếp chữ: gửi từ người học đã xếp
        const built = Array.from(body.querySelectorAll('.builder-slots .slot')).map(s => s.textContent).join('');
        SJ.ai.explain({ ask: txt('.quiz-ask'), prompt: txt('.quiz-prompt') || txt('.b-mean'), picked: txt('.opt.bad') || (typed ? typed.value : '') || built, right: txt('.opt.ok'), hint: hintTxt });
      };
      foot.querySelector('[data-cont]').onclick = next;
      setTimeout(() => { const b = foot.querySelector('[data-cont]'); b && b.focus({ preventScroll: true }); }, 50);
    }
    function next() { qi++; if (qi >= queue.length) phase = 'result'; render(); }

    // --- ghép cặp ---
    function renderPairs(q, tags) {
      let selL = null, selR = null, left = q.left.length, errs = 0;
      body.innerHTML = `<div class="quiz slide-in-r">${tags}<div class="quiz-ask">${q.ask}</div>
        <div class="pairs">${q.left.map((o, i) => `<button class="opt" data-nosfx="1" data-side="L" data-id="${esc(o.id)}" ${o.say ? `data-sayx="${esc(o.say)}"` : ''}>${o.label}</button><button class="opt" data-nosfx="1" data-side="R" data-id="${esc(q.right[i].id)}">${q.right[i].label}</button>`).join('')}</div></div>`;
      const tryMatch = () => {
        if (!selL || !selR) return;
        if (selL.dataset.id === selR.dataset.id) {
          [selL, selR].forEach(b => { b.classList.remove('sel'); b.classList.add('done'); b.disabled = true; });
          SJ.audio.sfx('note', q.left.length - left); left--;
          if (q.kind === 'kana') SJ.store.rec(selL.dataset.id, true);
          if (!left) setTimeout(() => grade(errs <= 1, '', { title: errs ? 'Ghép xong rồi!' : 'Ghép chuẩn không trượt phát nào!', noRetry: true, silent: true, noWhy: true }), 250);
        } else {
          errs++; SJ.audio.sfx('bad');
          if (q.kind === 'kana') SJ.store.rec(selL.dataset.id, false);
          [selL, selR].forEach(b => { b.classList.remove('sel'); b.classList.add('err'); setTimeout(() => b.classList.remove('err'), 420); });
        }
        selL = selR = null;
      };
      body.querySelector('.pairs').onclick = e => {
        const b = e.target.closest('.opt'); if (!b || b.disabled) return;
        if (b.dataset.sayx) SJ.audio.speak(b.dataset.sayx); else SJ.audio.sfx('tap');
        if (b.dataset.side === 'L') { selL && selL.classList.remove('sel'); selL = b; } else { selR && selR.classList.remove('sel'); selR = b; }
        b.classList.add('sel'); tryMatch();
      };
    }
    // --- gõ romaji ---
    function renderType(q, tags) {
      body.innerHTML = `<div class="quiz slide-in-r">${tags}<div class="quiz-ask">${q.ask}</div><div class="quiz-prompt">${q.prompt}</div>
        <div class="type-answer"><input class="input" id="ta" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ví dụ: ka" aria-label="Cách đọc"></div></div>`;
      setFoot(`<button class="btn btn-white" data-skip>Bỏ qua</button><span class="grow"></span><button class="btn btn-lg" data-check>Kiểm tra</button>`);
      const inp = body.querySelector('#ta');
      setTimeout(() => inp.focus(), 60);
      const check = () => {
        if (answered) return;
        if (!inp.value.trim()) { inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); return; }
        const ok = romajiOk(inp.value, q.item);
        inp.disabled = true;
        SJ.audio.speak(q.item.k);
        grade(ok, q.hint, { showHint: !ok });
      };
      foot.querySelector('[data-check]').onclick = check;
      foot.querySelector('[data-skip]').onclick = () => { if (!answered) grade(false, q.hint); };
      inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); check(); } };
    }
    // --- viết từng nét ---
    function renderWrite(q, tags) {
      body.innerHTML = `<div class="quiz slide-in-r write-step">${tags}<div class="quiz-ask" style="align-self:stretch">${q.ask}</div>
        <div class="ws-head"><span class="ws-target">${esc(q.label)}</span><button class="say-btn" data-say="${q.ch}">${I('speaker', 22)}</button></div>
        <div class="w100" data-pad></div>
        <div class="pad-tools"><button class="btn btn-sm btn-white" data-a="hint">${I('bulb', 18)} Gợi ý nét</button><button class="btn btn-sm btn-white" data-a="guide">${I('eye', 18)} Hiện chữ mờ</button></div></div>`;
      setFoot(`<button class="btn btn-white" data-skip>${q.deferred ? 'Bỏ qua' : 'Để sau'}</button><span class="grow muted bold">Viết từng nét, bắt đầu từ chấm hồng</span>`);
      wp = SJ.writing.pad(body.querySelector('[data-pad]'), q.ch, {
        mode: 'hint',
        onDone: r => {
          SJ.store.addWritten(r.perfect);
          grade(r.mistakes <= 2, `${U().stars(r.stars, 3, 18)} ${r.perfect ? 'Không sai nét nào!' : `Sai ${r.mistakes} nét`}`, { showHint: true, noRetry: true, silent: true, noWhy: true, title: r.perfect ? 'Nét chữ chuẩn quá!' : r.mistakes <= 2 ? 'Viết xong rồi!' : 'Xong rồi, luyện thêm chút nha' });
        },
      });
      wp.ready.then(ok => {
        if (ok || destroyed || queue[qi] !== q) return;
        // không tải được nét (mất mạng) → đổi sang câu trắc nghiệm
        queue[qi] = SJ.KANJI_MAP[q.ch] ? kanjiQ(q.item, 'k2m', SJ.KANJI) : kanaQ(q.item, 'k2r', items.length < 6 ? items.concat(SJ.KANA[q.item.script].basic) : items);
        render();
      });
      body.querySelector('.pad-tools').onclick = e => {
        const a = e.target.closest('[data-a]'); if (!a || !wp) return;
        if (a.dataset.a === 'hint') wp.hint();
        if (a.dataset.a === 'guide') { wp.setMode('guide'); a.disabled = true; }
      };
      // "Để sau": đưa câu xuống cuối một lần; bỏ qua lần nữa mới tính là sai
      foot.querySelector('[data-skip]').onclick = () => { if (!answered) { answered = true; if (!q.deferred) queue.push(Object.assign({}, q, { deferred: true })); next(); } };
    }
    // --- xếp chữ ---
    function renderBuild(q, tags) {
      const slots = q.chars.map(() => null);
      body.innerHTML = `<div class="quiz slide-in-r builder">${tags}<div class="quiz-ask">${q.ask}</div>
        <div class="b-pic">${pic(q.item.e, 96)}</div><div class="b-mean">${esc(q.item.vi)}</div>
        <div class="builder-slots">${q.chars.map((c, i) => `<span class="slot" data-slot="${i}"></span>`).join('')}</div>
        <div class="tiles">${q.tiles.map((c, i) => `<button class="tile" data-nosfx="1" data-t="${i}">${c}</button>`).join('')}</div></div>`;
      setFoot(`<button class="btn btn-white" data-clear>${I('eraser', 18)} Xoá</button><span class="grow"></span><button class="btn btn-lg" data-check disabled>Kiểm tra</button>`);
      const chk = foot.querySelector('[data-check]');
      const draw = () => { body.querySelectorAll('.slot').forEach((s, i) => { s.textContent = slots[i] ? slots[i].c : ''; s.classList.toggle('filled', !!slots[i]); }); chk.disabled = slots.some(x => !x); };
      body.querySelector('.tiles').onclick = e => {
        const t = e.target.closest('.tile'); if (!t || answered) return;
        const k = slots.indexOf(null); if (k < 0) return;
        slots[k] = { c: t.textContent, el: t }; t.classList.add('used'); SJ.audio.sfx('pop'); draw();
      };
      body.querySelector('.builder-slots').onclick = e => {
        const s = e.target.closest('.slot'); if (!s || answered) return;
        const i = +s.dataset.slot; if (slots[i]) { slots[i].el.classList.remove('used'); slots[i] = null; SJ.audio.sfx('tap'); draw(); }
      };
      foot.querySelector('[data-clear]').onclick = () => { slots.forEach((x, i) => { if (x) { x.el.classList.remove('used'); slots[i] = null; } }); draw(); };
      chk.onclick = () => { if (answered) return; const ok = slots.map(x => x.c).join('') === q.chars.join(''); SJ.audio.speak(SJ.ui.reading(q.item.jp)); grade(ok, q.hint, { showHint: true }); };
    }

    function renderResult() {
      setProg(100, 'Xong!');
      const pct = Math.round(firstOk / Math.max(1, firstTotal) * 100);
      const res = SJ.store.completeLesson(lesson.id, pct);
      SJ.store.addSRS(SJ.lessonKeys(lesson));
      const nextL = SJ.LESSONS[SJ.LESSONS.indexOf(lesson) + 1];
      const mood = res.stars >= 3 ? 'love' : res.stars === 2 ? 'cheer' : 'happy';
      const mins = Math.max(1, Math.round((Date.now() - t0) / 60000));
      body.innerHTML = `<div class="result pop-in">
        <div class="result-mochi">${U().mascot(mood, 150, 'jump')}${U().hanko(res.stars >= 3 ? '満点' : '合格', 'stamp-in')}</div>
        <h1>${res.stars >= 3 ? 'Hoàn hảo!' : res.stars === 2 ? 'Giỏi quá đi!' : 'Hoàn thành rồi!'}</h1>
        <div class="result-stars">${U().stars(res.stars, 3, 52)}</div>
        <div class="result-stats">
          <div class="rs card mint">${I('target', 32)}<b data-count="${pct}" data-suf="%">${pct}%</b><span>đúng ngay lần đầu</span></div>
          <div class="rs card sun">${I('star', 32)}<b data-count="${res.xp}" data-pre="+">+${res.xp}</b><span>XP</span></div>
          <div class="rs card sky">${I('fishcoin', 32)}<b data-count="${res.fish}" data-pre="+">+${res.fish}</b><span>cá vàng</span></div>
          <div class="rs card pink">${I('fire', 32)}<b>${SJ.store.streakNow()}</b><span>ngày liên tiếp</span></div>
        </div>
        <p class="muted bold">${mins} phút học · ${res.stars < 3 ? 'Học lại để đạt 3 sao nhé — các chữ trong bài đã vào thẻ Ôn tập rồi đó!' : 'Các chữ vừa học đã được đưa vào thẻ nhớ để ôn mỗi ngày.'}</p>
      </div>`;
      setFoot(`<button class="btn btn-white" data-again>${I('refresh', 20)} Học lại</button>
        ${lesson.type === 'kana' || lesson.type === 'kanji' ? `<a class="btn btn-white hide-sm" href="#/write/${encodeURIComponent(items[0].k)}">${I('pencil', 20)} Luyện viết</a>` : ''}
        <span class="grow"></span>
        ${nextL ? `<a class="btn btn-lg" href="#/lesson/${nextL.id}">Bài tiếp theo ${I('arrow_r', 22)}</a>` : `<a class="btn btn-lg" href="#/">Về lộ trình</a>`}`);
      foot.querySelector('[data-again]').onclick = () => { phase = 'intro'; t0 = Date.now(); render(); };
      U().countUp(body);
      SJ.audio.sfx('win');
      setTimeout(() => SJ.audio.sfx('stamp'), 900);
      for (let i = 0; i < res.stars; i++) setTimeout(() => SJ.audio.sfx('star'), 1200 + i * 220);
      setTimeout(() => SJ.audio.sfx('coin'), 2000);
      if (res.stars >= 2) U().confetti();
    }

    function onKey(e) {
      if (phase !== 'quiz' || document.querySelector('.modal-back')) return;
      const q = queue[qi];
      if (!answered && q && q.options && /^[1-4]$/.test(e.key)) { const b = body.querySelectorAll('.opt')[+e.key - 1]; b && b.click(); }
      else if (answered && e.key === 'Enter') {
        // đang chọn nút khác (vd. "Vì sao?") → để Enter bấm nút đó
        const fb = e.target.closest && e.target.closest('button');
        if (fb && !fb.matches('[data-cont]')) return;
        e.preventDefault(); next();
      }
    }
    document.addEventListener('keydown', onKey);
    render();
    return { destroy() { destroyed = true; cleanup(); document.removeEventListener('keydown', onKey); } };
  }

  // ---------- Công cụ: tên tiếng Nhật ----------
  function nameWidget() {
    const nm = SJ.store.get().name || '';
    return `<div class="name-widget"><label for="nw-in">Tên của bạn (có dấu cũng được):</label>
      <div class="row gap-s"><input class="input" id="nw-in" placeholder="Ví dụ: Nguyễn Minh Anh" value="${esc(nm)}"><button class="btn" id="nw-go">${I('sparkle', 20)} Xem tên Katakana</button></div>
      <div id="nw-out"></div></div>`;
  }
  function bindNameWidget(root) {
    const go = root.querySelector('#nw-go'); if (!go) return;
    const run = () => {
      const v = root.querySelector('#nw-in').value.trim(); if (!v) return;
      const kata = U().nameToKata(v);
      SJ.store.markName();
      const intro = `はじめまして。わたしは ${kata.replace(/・/g, '')} です。ベトナムから きました。よろしく おねがいします。`;
      root.querySelector('#nw-out').innerHTML = `<div class="name-card pop-in">${I('nametag', 44)}<div class="name-kata">${kata}</div>
        <div class="example" data-say="${esc(intro)}"><span class="jp ex-jp">${esc(intro)}</span><span class="ex-say">${I('speaker', 20)}</span></div>
        <div class="muted small">Tên tiếng Việt được phiên âm gần đúng theo cách người Nhật hay viết.</div></div>`;
      SJ.audio.sfx('sparkle'); SJ.audio.speak(kata.replace(/・/g, ' '));
    };
    go.onclick = run;
    root.querySelector('#nw-in').onkeydown = e => { if (e.key === 'Enter') run(); };
  }

  SJ.lesson = { open, openTrace, onWriteDone, showScore, kanaQ, vocabQ, kanjiQ, typeQ, romajiOk, nameWidget, bindNameWidget, rowGrid, glyph, confuseRow, exampleRow };
})(window.SJ);
