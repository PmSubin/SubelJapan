/* SubelJapan — Nói & Ngữ pháp: lộ trình nhiều chặng kiểu Duolingo (tách riêng với phần viết chữ)
 * - Mỗi bài học 3 lượt: Làm quen (gặp từng câu mới) → Luyện tập (thêm câu mới, điền, xếp câu, hội thoại)
 *   → Nhớ lâu (nghe không nhìn chữ, xếp câu khó, tự nói). Xong đủ 3 lượt mới mở bài sau.
 * - Sau mỗi 2 bài có bài Ôn tập, cuối chặng có bài Kiểm tra cả chặng.
 * - Bài nào cũng trộn vài câu của bài cũ vào để nhắc lại; từng câu được ghi độ nhớ (ôn cách quãng)
 *   → "Ôn tập hôm nay" gom những câu đến hạn ôn.
 * - Phần nói chấm bằng nhận dạng giọng nói tiếng Nhật của trình duyệt nếu có; không có thì tự kiểm tra.
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui, I = (n, s, c) => SJ.icon(n, s, c), esc = s => SJ.ui.esc(s);
  const ico = (n, s) => I(SJ.hasIcon && SJ.hasIcon(n) ? n : 'speech', s);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const NS = 'sj_nospeak', RK = 'sj_talk_romaji';
  const speakOffUntil = () => { try { return +localStorage.getItem(NS) || 0; } catch (e) { return 0; } };
  const canSpeak = () => !!SR && speakOffUntil() <= Date.now();
  const speakOff = min => { try { localStorage.setItem(NS, String(Date.now() + (min || 60) * 60000)); } catch (e) { } };
  const canEar = () => !SJ.audio.canListen || SJ.audio.canListen();
  let showRomaji = true; try { showRomaji = localStorage.getItem(RK) !== '0'; } catch (e) { }
  const ROUNDS = 3;
  const RN = ['Làm quen', 'Luyện tập', 'Nhớ lâu'];
  const RD = ['Gặp từng câu mới, nghe và nói theo, chọn nghĩa', 'Học thêm câu mới, điền trợ từ, xếp câu, hội thoại', 'Nghe không nhìn chữ, xếp câu khó, tự nói từ nghĩa'];

  // ---------- chấm phần nói ----------
  const norm = s => Array.from(String(s || '')).map(c => (SJ.toHira ? SJ.toHira(c) : c)).join('').replace(/[\s、。！？!?,.…「」（）()・〜~]/g, '');
  function lev(a, b) {
    a = Array.from(a); b = Array.from(b);
    const d = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; } }
    return d[b.length];
  }
  const sim = (a, b) => { const n = Math.max(Array.from(a).length, Array.from(b).length, 1); return 1 - lev(a, b) / n; };
  const scoreSpeech = (heard, ex) => Math.max(sim(norm(heard), norm(ex.jp)), ex.k ? sim(norm(heard), norm(ex.k)) : 0);

  // ---------- tiện ích hiển thị ----------
  const optOf = (l, x) => typeof x === 'number' ? { jp: l.ex[x].jp, r: l.ex[x].rom, v: l.ex[x].v } : { jp: x[0], r: x[1] || '', v: x[2] || '' };
  const clean = t => String(t).replace(/[。、？！…]/g, '').trim();
  const jpLine = (jp, r) => `<div class="tj jp">${esc(jp)}</div>${r ? `<div class="tr">${esc(r)}</div>` : ''}`;
  const sayBtn = (text, big) => `<button class="say-btn ${big ? 'big' : ''}" data-say="${esc(text)}" title="Nghe" aria-label="Nghe">${I('speaker', big ? 30 : 22)}</button>`;
  function patternHTML(p) {
    if (!p) return '';
    const parts = p.parts.map(([lab, kind, rom]) => /^[pqet]$/.test(kind)
      ? `<span class="tp tp-${kind}"><b class="jp">${esc(lab)}</b>${rom ? `<small>${esc(rom)}</small>` : ''}</span>`
      : `<span class="tp tp-slot">${esc(lab)}</span>`).join('<i class="tp-plus">+</i>');
    return `<div class="tpat"><div class="tpat-row">${parts}</div><div class="tpat-mean">${esc(p.mean)}</div></div>`;
  }
  const memOf = e => (SJ.store.talkMem ? SJ.store.talkMem(e.key) : null);
  const memBar = e => { const m = memOf(e), s = m ? m.s : 0; return `<span class="tmem" title="Độ nhớ ${s}/6"><i style="width:${Math.round(s / 6 * 100)}%"></i></span>`; };
  const exRow = (e, o) => `<div class="tex" data-say="${esc(e.say)}">${sayBtn(e.say)}<div class="tex-txt"><div class="tex-jp jp">${esc(e.jp)}${o && o.isNew ? ' <b class="tnew-tag">MỚI</b>' : ''}</div><div class="tex-r tr">${esc(e.rom)}</div><div class="tex-v">${esc(e.v)}</div></div>${o && o.mem ? memBar(e) : ''}</div>`;
  /** câu chia cụm: chữ Nhật + romaji bên dưới từng cụm */
  const chips = e => `<div class="tchips">${e.toks.map((t, i) => `<span class="tchip"><b class="jp">${esc(t.trim())}</b><small class="tr">${esc((e.rtoks[i] || '').replace(/,$/, '').trim())}</small></span>`).join('')}</div>`;

  // ===================== DỮ LIỆU & TIẾN ĐỘ =====================
  const ready = () => { if (SJ.talkPrep) SJ.talkPrep(); };
  let NODES = null;
  /** lộ trình phẳng: bài học, bài ôn (sau mỗi 2 bài), bài kiểm tra cuối chặng */
  function nodes() {
    if (NODES) return NODES;
    ready(); NODES = [];
    SJ.TALK.forEach((u, ui) => {
      const ls = u.lessons;
      ls.forEach((l, i) => {
        NODES.push({ t: 'lesson', id: l.id, u, ui, L: l });
        if (i % 2 === 1 && i < ls.length - 1) NODES.push({ t: 'review', id: `rv-${u.id}-${(i + 1) / 2}`, u, ui, ls: [ls[i - 1], ls[i]] });
      });
      NODES.push({ t: 'check', id: `ck-${u.id}`, u, ui, ls: ls.slice() });
    });
    NODES.forEach((n, i) => { n.i = i; });
    return NODES;
  }
  const node = id => nodes().find(n => n.id === id) || null;
  const st = id => (SJ.store.talkState ? SJ.store.talkState(id) : null);
  const rounds = id => { const s = st(id); return s ? Math.min(ROUNDS, s.rounds || (s.done ? 1 : 0)) : 0; };
  const complete = n => n.t === 'lesson' ? rounds(n.id) >= ROUNDS : !!(st(n.id) && st(n.id).done);
  const curNode = () => nodes().find(n => !complete(n)) || null;
  const unlocked = n => { const c = curNode(); return !c || n.i <= c.i; };
  const learned = () => { ready(); return SJ.TALK_LESSONS.filter(l => rounds(l.id) >= 1); };
  const lessonNo = id => SJ.TALK_LESSONS.findIndex(l => l.id === id) + 1;
  const nodeTitle = n => n.t === 'lesson' ? n.L.title : n.t === 'review' ? `Ôn: ${n.ls.map(l => l.title).join(' + ')}` : `Kiểm tra chặng ${n.ui + 1}`;
  /** câu đã học cần ôn: đến hạn trước, nhớ kém trước */
  function dueList() {
    const now = Date.now(), out = [];
    learned().forEach(l => l.ex.forEach(e => { const m = memOf(e); if (m && m.d <= now) out.push(e); }));
    return out.sort((a, b) => (memOf(a).s - memOf(b).s) || (memOf(a).d - memOf(b).d));
  }
  function weakList() {
    const all = [];
    learned().forEach(l => l.ex.forEach(e => all.push(e)));
    const sc = e => { const m = memOf(e); return m ? m.s * 2 - m.w * 0.5 : -1; };
    return all.map(e => [sc(e) + Math.random(), e]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  }

  // ===================== DỰNG BÀI TẬP =====================
  const shuf = a => U().shuffle(a.slice());
  const take = (a, k) => shuf(a).slice(0, Math.max(0, k));
  const mk = (t, L, o) => Object.assign({ t, L }, o || {});
  const exLesson = e => SJ.TALK_MAP[e.lid];
  /** câu của các bài trước (đã học ít nhất 1 lượt) — ưu tiên câu đến hạn ôn và câu nhớ kém */
  function oldPick(beforeIdx, n, skip) {
    if (n <= 0) return [];
    const now = Date.now(), pool = [];
    SJ.TALK_LESSONS.forEach((l, i) => { if (i < beforeIdx && rounds(l.id) >= 1) l.ex.forEach(e => { if (!skip || !skip.includes(e)) pool.push(e); }); });
    const sc = e => { const m = memOf(e); return (m ? (m.d <= now ? 0 : 2) + m.s * 0.5 : 1) + Math.random() * 1.5; };
    return pool.map(e => [sc(e), e]).sort((a, b) => a[0] - b[0]).slice(0, n).map(x => x[1]);
  }
  /** dạng bài cho một câu cũ, theo độ nhớ: nhớ kém → nhận diện, nhớ tốt → tự xếp / tự nói */
  function oldStep(e) {
    const m = memOf(e), s = m ? m.s : 0, L = exLesson(e);
    let t = U().pick(s <= 1 ? ['mean', 'pick'] : s <= 3 ? ['ear', 'pick', 'build'] : ['recall', 'earbuild', 'build']);
    if ((t === 'build' || t === 'earbuild') && e.toks.length < 3) t = 'pick';
    return mk(t, L, { ex: e, g: 1, old: 1 });
  }
  /** chèn các câu ôn cũ rải đều vào giữa danh sách */
  function sprinkle(list, extra, from) {
    const out = list.slice(), start = from || 1;
    extra.forEach((x, k) => { const pos = Math.min(out.length, start + Math.round((out.length - start) * (k + 1) / (extra.length + 1)) + k); out.splice(pos, 0, x); });
    return out;
  }
  /** một lượt của bài học (round 1–3; lớn hơn 3 = ôn lại bài đã thuộc) */
  function lessonSteps(L, round) {
    const ex = L.ex, NI = Math.min(5, ex.length), first = ex.slice(0, NI), rest = ex.slice(NI);
    const idx = SJ.TALK_LESSONS.indexOf(L), r = Math.min(round, 3);
    const known = r === 1 ? first : ex;
    const fills = (L.fill || []).filter(f => known.includes(ex[f.ex]));
    const talks = (L.talk || []).filter(d => typeof d.a !== 'number' || known.includes(ex[d.a]));
    const multi = known.filter(e => e.toks.length >= 3);
    const out = [], add = (t, o) => out.push(mk(t, L, o));
    let core = [];
    const c = (t, o) => core.push(mk(t, L, o));
    if (r === 1) {
      add('learn', { list: first, more: rest.length, round: 1 });
      // gặp từng cặp câu mới → kiểm tra ngay 2 câu vừa gặp
      for (let i = 0; i < first.length; i += 2) {
        const g = first.slice(i, i + 2);
        g.forEach(e => add('new', { ex: e }));
        add('mean', { ex: g[0], g: 1 });
        if (g[1]) add('pick', { ex: g[1], g: 1 });
      }
      take(first, 1).forEach(e => c('ear', { ex: e, g: 1 }));
      take(fills, 2).forEach(f => c('fill', { f, g: 1 }));
      take(multi, 1).forEach(e => c('build', { ex: e, g: 1 }));
      take(talks, 2).forEach(d => c('talk', { d, g: 1 }));
      core = sprinkle(core, oldPick(idx, 2).map(oldStep), 1);
    } else if (r === 2) {
      add('recap', { round: 2, fresh: rest });
      rest.forEach(e => { add('new', { ex: e }); add('mean', { ex: e, g: 1 }); });
      take(ex, 2).forEach(e => c('ear', { ex: e, g: 1 }));
      take(first, 2).forEach(e => c('pick', { ex: e, g: 1 }));
      take(fills, 3).forEach(f => c('fill', { f, g: 1 }));
      take(multi, 2).forEach(e => c('build', { ex: e, g: 1 }));
      take(talks, 3).forEach(d => c('talk', { d, g: 1 }));
      take(ex, 1).forEach(e => c('say', { ex: e }));
      core = sprinkle(core, oldPick(idx, 3).map(oldStep), 1);
    } else {
      add('recap', { round: Math.min(round, 4) });
      take(ex, 3).forEach(e => c('ear', { ex: e, g: 1, n4: 1 }));
      take(fills, 4).forEach(f => c('fill', { f, g: 1 }));
      const m2 = take(multi, 4);
      m2.slice(0, 2).forEach(e => c('build', { ex: e, g: 1, hard: 1 }));
      m2.slice(2, 4).forEach(e => c('earbuild', { ex: e, g: 1 }));
      take(talks, 4).forEach(d => c('talk', { d, g: 1 }));
      take(L.kind === 'phrase' || multi.length < 3 ? ex : multi, 3).forEach(e => c('recall', { ex: e, g: 1 }));
      core = sprinkle(core, oldPick(idx, 4).map(oldStep), 2);
    }
    return out.concat(core);
  }
  /** bài ôn trộn nhiều bài: plan = số câu mỗi dạng */
  function mixSteps(ls, plan, poolEx) {
    const exAll = poolEx || [].concat(...ls.map(l => l.ex));
    const now = Date.now();
    const order = arr => arr.map(e => { const m = memOf(e); return [(m ? m.s + (m.d <= now ? -2 : 0) : 0) + Math.random() * 3, e]; }).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    let q = order(exAll), qm = order(exAll.filter(e => e.toks.length >= 3));
    let qi = 0, mi = 0;
    const nextEx = () => q[(qi++) % q.length], nextMulti = () => qm.length ? qm[(mi++) % qm.length] : nextEx();
    const inPool = (l, i) => exAll.includes(l.ex[i]);
    const fills = shuf([].concat(...ls.map(l => (l.fill || []).filter(f => inPool(l, f.ex)).map(f => ({ f, L: l })))));
    const talks = shuf([].concat(...ls.map(l => (l.talk || []).filter(d => typeof d.a !== 'number' ? !poolEx : inPool(l, d.a)).map(d => ({ d, L: l })))));
    const A = [], B = [], C = [];
    const one = (arr, t, n, f) => { for (let k = 0; k < (n || 0); k++) { const e = f(); if (e) arr.push(mk(t, exLesson(e), { ex: e, g: 1, n4: plan.n4 })); } };
    one(A, 'ear', plan.ear, nextEx); one(A, 'mean', plan.mean, nextEx); one(A, 'pick', plan.pick, nextEx);
    fills.slice(0, plan.fill || 0).forEach(x => B.push(mk('fill', x.L, { f: x.f, g: 1 })));
    one(B, 'build', plan.build, nextMulti);
    for (let k = 0; k < (plan.hard || 0); k++) { const e = nextMulti(); if (e) B.push(mk('build', exLesson(e), { ex: e, g: 1, hard: 1 })); }
    one(B, 'earbuild', plan.earbuild, nextMulti);
    talks.slice(0, plan.talk || 0).forEach(x => C.push(mk('talk', x.L, { d: x.d, g: 1 })));
    one(C, 'recall', plan.recall, nextEx);
    let out = shuf(A).concat(shuf(B), shuf(C));
    if (plan.old) out = sprinkle(out, oldPick(SJ.TALK_LESSONS.indexOf(ls[0]), plan.old).map(oldStep), 2);
    return out;
  }

  // ===================== TRANG LỘ TRÌNH =====================
  const OFFS = [0, 52, 80, 52, 0, -52, -80, -52];
  function page(root, arg) {
    ready();
    if (arg === 'book') return book(root);
    if (arg) return start(root, arg);
    const N = nodes(), cur = curNode();
    const lessonsDone = SJ.TALK_LESSONS.filter(l => rounds(l.id) >= ROUNDS).length, total = SJ.TALK_LESSONS.length;
    const exLearned = learned().reduce((a, l) => a + l.ex.length, 0), due = dueList().length;
    let n = 0;
    const units = SJ.TALK.map((u, ui) => {
      const un = N.filter(x => x.u === u), ud = un.filter(complete).length;
      const rows = un.map(nd => {
        const off = OFFS[(n++) % OFFS.length], isCur = cur && nd.id === cur.id, lock = !unlocked(nd), done = complete(nd);
        const rr = nd.t === 'lesson' ? rounds(nd.id) : done ? 1 : 0;
        const face = nd.t === 'lesson' ? ico(nd.L.icon, 40) : nd.t === 'review' ? I('books', 40) : I('trophy', 44);
        const cls = ['pnode', 'tnode', 'k-' + nd.t, 'r' + rr, done ? 'done' : '', isCur ? 'cur' : '', lock ? 'lock' : ''].join(' ');
        const tag = isCur ? `<span class="pn-start">${nd.t === 'lesson' ? (rr ? `Lượt ${rr + 1}/${ROUNDS}` : (n === 1 ? 'Bắt đầu' : 'Bài mới')) : nd.t === 'review' ? 'Ôn tập' : 'Kiểm tra'}</span>` : '';
        const side = off > 0 ? -1 : off < 0 ? 1 : (n % 2 ? -1 : 1);
        const here = isCur ? `<span class="deco here" style="--f:${side * 0.72};--dy:-4px">${U().mascot(due ? 'cheer' : 'happy', 70, 'bob')}</span>` : '';
        const label = nd.t === 'lesson' ? esc(nd.L.title) : nd.t === 'review' ? 'Ôn tập' : `Kiểm tra chặng ${ui + 1}`;
        return `<div class="prow">${here}<div class="${cls}" style="--x:${off}px" data-x="${off}" data-n="${nd.id}">${tag}
          <button class="pn-btn" aria-label="${esc(nodeTitle(nd))}">${nd.t === 'lesson' ? '<i class="tn-ring"></i>' : ''}${face}${lock ? `<span class="tn-lock">${I('lock', 16)}</span>` : done && nd.t !== 'lesson' ? `<span class="pn-check">${I('check', 16)}</span>` : done ? `<span class="pn-check">${I('crown', 16)}</span>` : ''}</button>
          <span class="pn-label">${label}</span></div></div>`;
      }).join('');
      return `<section class="unit tunit2" style="--uc:${u.color}" id="tunit-${u.id}">
        <div class="unit-banner"><div class="ub-text"><div class="ub-kicker">Chặng ${ui + 1} / ${SJ.TALK.length}</div><div class="ub-title">${esc(u.title)} <span class="jp">${esc(u.jp)}</span></div><div class="ub-desc">${esc(u.desc)}</div>
          <div class="ub-prog">${U().bar(ud / un.length * 100)}<span>${ud}/${un.length} chặng nhỏ</span></div></div>
          <span class="ub-icon">${ico(u.icon, 44)}</span>
          <button class="btn btn-sm ub-guide" data-tguide="${u.id}" title="Sổ tay ngữ pháp">${I('book', 22)}<span>Sổ tay</span></button></div>
        <div class="map-zone t-talk"><div class="path">${rows}</div></div></section>`;
    }).join('');
    root.innerHTML = `<div class="page-mid talk-page">
      <div class="page-head"><div class="ph-icon">${ico('talk', 52)}</div><div><h1>Nói & Ngữ pháp</h1>
        <p>${SJ.TALK.length} chặng, ${total} bài mẫu câu người Nhật nói hằng ngày. Câu nào cũng có <b>romaji</b> và nghĩa tiếng Việt — không cần biết viết chữ. Đã thuộc <b>${lessonsDone}/${total}</b> bài.</p></div></div>
      <div class="talk-top">
        <a class="card ttop due ${due ? 'has' : ''}" href="#/talk/daily">${I('refresh', 40)}<div class="grow"><b>Ôn tập hôm nay</b><small>${due ? `<b class="tt-num">${due}</b> câu đến lúc ôn lại` : exLearned ? 'Chưa có câu đến hạn — luyện thêm câu còn yếu' : 'Học bài đầu tiên rồi quay lại ôn nha'}</small></div><span class="btn btn-sm ${due ? '' : 'btn-white'}">${due ? 'Ôn ngay' : 'Luyện'}</span></a>
        <a class="card ttop" href="#/talk/book">${I('book', 40)}<div class="grow"><b>Sổ tay mẫu câu</b><small>${exLearned ? `${exLearned} câu đã học · nghe lại bất cứ lúc nào` : 'Câu đã học sẽ được lưu ở đây'}</small></div>${I('arrow_r', 20)}</a>
      </div>
      <div class="talk-how card">${RN.map((s, i) => `<div class="th-step"><i class="th-num">${i + 1}</i>${I(['eye', 'pencil', 'brain'][i], 34)}<div><b>Lượt ${i + 1}: ${s}</b><small>${RD[i]}</small></div></div>`).join('')}
        <p class="th-note">${I('books', 20)}<span>Mỗi bài học 3 lượt. Sau mỗi 2 bài có bài <b>Ôn tập</b>, cuối chặng có bài <b>Kiểm tra</b> — bài nào cũng nhắc lại câu cũ để nhớ lâu.</span></p></div>
      ${units}
      <div class="talk-more card">${U().mascot('happy', 70)}<div class="grow"><b>Muốn nói chuyện thật?</b><p class="muted small bold">Học xong vài chặng, vào Sensei Mochi chọn <b>Luyện hội thoại</b> để nói chuyện nhập vai với Mochi.</p></div><a class="btn btn-white" href="#/sensei/role">${ico('sensei', 22)} Luyện với Mochi</a></div>
    </div>`;

    let open = null;
    const close = () => { if (open) { const p = open.querySelector('.pn-pop'); p && p.remove(); open.classList.remove('open'); open.closest('.prow').classList.remove('open'); open = null; } };
    const onClick = e => {
      const g = e.target.closest('[data-tguide]'); if (g) { guide(g.dataset.tguide); return; }
      const nd = e.target.closest('.tnode');
      if (nd && e.target.closest('.pn-btn')) {
        if (open === nd) { close(); return; }
        close();
        const x = node(nd.dataset.n);
        nd.insertAdjacentHTML('beforeend', popHTML(x));
        nd.classList.add('open'); nd.closest('.prow').classList.add('open'); open = nd; SJ.audio.sfx('pop');
        const pop = nd.querySelector('.pn-pop'); if (pop && pop.getBoundingClientRect().bottom > innerHeight) pop.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      if (!e.target.closest('.pn-pop')) close();
    };
    root.addEventListener('click', onClick);
    const curEl = root.querySelector('.tnode.cur');
    if (curEl && SJ.TALK_LESSONS.some(l => rounds(l.id))) setTimeout(() => curEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    const draw = () => SJ.pages && SJ.pages.drawRoads && SJ.pages.drawRoads(root);
    draw(); setTimeout(draw, 500);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    let rt = 0; const onResize = () => { clearTimeout(rt); rt = setTimeout(draw, 120); };
    window.addEventListener('resize', onResize);
    return { destroy() { window.removeEventListener('resize', onResize); clearTimeout(rt); } };
  }
  function popHTML(x) {
    const lock = !unlocked(x), done = complete(x), c = curNode();
    if (x.t === 'lesson') {
      const rr = rounds(x.id), s = st(x.id), nx = Math.min(rr + 1, ROUNDS);
      const dots = RN.map((nm, i) => `<span class="tp-r ${i < rr ? 'on' : i === rr && !lock ? 'now' : ''}"><i>${i < rr ? I('check', 12) : i + 1}</i>${nm}</span>`).join('');
      const btn = lock ? `<div class="pp-lock">${I('lock', 18)} Học xong "${esc(c ? nodeTitle(c) : '')}" để mở bài này</div>`
        : done ? `<a class="btn btn-block" href="#/talk/${x.id}/4">${I('refresh', 18)} Ôn lại bài này</a>`
        : `<a class="btn btn-block" href="#/talk/${x.id}/${nx}">${rr ? `Học lượt ${nx}: ${RN[nx - 1]}` : 'Bắt đầu học'}</a>`;
      return `<div class="pn-pop tpop"><div class="pp-meta">Bài ${lessonNo(x.id)} · ${x.L.ex.length} câu mẫu</div><h4>${esc(x.L.title)} <span class="jp">${esc(x.L.jp)}</span></h4><p>${esc(x.L.goal)}</p>
        <div class="tp-rounds">${dots}</div>${s && s.done ? `<div class="pp-meta">${U().stars(s.stars, 3, 16)} đúng ${s.best}% · đã học ${s.count} lần</div>` : ''}${btn}</div>`;
    }
    const what = x.t === 'review' ? `Trộn câu của 2 bài: <b>${x.ls.map(l => esc(l.title)).join('</b> và <b>')}</b>, thêm vài câu cũ.` : `Kiểm tra cả ${x.ls.length} bài của chặng "${esc(x.u.title)}": nghe, điền, xếp câu, hội thoại, tự nói.`;
    const btn = lock ? `<div class="pp-lock">${I('lock', 18)} Học xong "${esc(c ? nodeTitle(c) : '')}" để mở</div>` : `<a class="btn btn-block" href="#/talk/${x.id}">${done ? 'Làm lại' : x.t === 'review' ? 'Bắt đầu ôn' : 'Bắt đầu kiểm tra'}</a>`;
    return `<div class="pn-pop tpop"><div class="pp-meta">${I(x.t === 'review' ? 'books' : 'trophy', 20)} ${x.t === 'review' ? 'BÀI ÔN TẬP' : 'KIỂM TRA CHẶNG'}</div><h4>${x.t === 'review' ? 'Ôn tập' : esc(x.u.title)}</h4><p>${what}</p>${done ? `<div class="pp-meta">${I('check', 16)} Đã qua · đúng ${st(x.id).best}%</div>` : ''}${btn}</div>`;
  }
  /** sổ tay ngữ pháp của một chặng: mẫu câu + giải thích của từng bài */
  function guide(uid) {
    const u = SJ.TALK.find(x => x.id === uid); if (!u) return;
    const m = U().modal(`<div class="tguide" style="--uc:${u.color}"><div class="tg-head">${ico(u.icon, 44)}<div><div class="tu-kicker">Sổ tay ngữ pháp</div><h2>${esc(u.title)} <span class="jp">${esc(u.jp)}</span></h2></div></div>
      ${u.lessons.map(l => `<section class="tg-l"><h3>${ico(l.icon, 26)} ${esc(l.title)} <span class="jp">${esc(l.jp)}</span></h3>${patternHTML(l.pattern)}<ul class="tpoints">${l.points.map(p => `<li>${p}</li>`).join('')}</ul>
        <div class="tex-list">${l.ex.slice(0, 3).map(e => exRow(e)).join('')}</div></section>`).join('')}</div>`, { cls: 'modal-wide' });
    m.el.addEventListener('click', e => { const s = e.target.closest('[data-say]'); if (s) SJ.audio.speak(s.dataset.say); });
  }

  // ===================== SỔ TAY MẪU CÂU =====================
  function book(root) {
    const ls = learned();
    let mode = 'all';
    const draw = () => {
      const body = ls.length ? SJ.TALK.map(u => {
        const mine = u.lessons.filter(l => ls.includes(l));
        if (!mine.length) return '';
        return `<section class="tb-unit" style="--uc:${u.color}"><h2>${ico(u.icon, 30)} ${esc(u.title)} <span class="jp">${esc(u.jp)}</span></h2>${mine.map(l => {
          const ex = mode === 'weak' ? l.ex.filter(e => { const m = memOf(e); return !m || m.s <= 2; }) : l.ex;
          if (!ex.length) return '';
          return `<div class="tb-lesson card"><div class="tb-lh"><b>${esc(l.title)}</b> <span class="jp">${esc(l.jp)}</span><a class="btn btn-sm btn-white" href="#/talk/${l.id}/${Math.min(rounds(l.id) + 1, 4)}">${rounds(l.id) >= ROUNDS ? 'Ôn lại' : 'Học tiếp'}</a></div>${patternHTML(l.pattern)}<div class="tex-list">${ex.map(e => exRow(e, { mem: 1 })).join('')}</div></div>`;
        }).join('')}</section>`;
      }).join('') : `<div class="card center tb-empty">${U().mascot('happy', 90)}<p class="bold">Chưa có câu nào — học bài đầu tiên ở lộ trình Nói rồi quay lại đây nha.</p><a class="btn" href="#/talk">Về lộ trình Nói</a></div>`;
      root.innerHTML = `<div class="page-mid talk-page talk-book">
        <div class="page-head"><div class="ph-icon">${I('book', 52)}</div><div><h1>Sổ tay mẫu câu</h1><p>Mọi câu bạn đã học. Bấm vào câu để nghe lại; thanh màu bên phải là độ nhớ — càng dài càng nhớ lâu.</p></div></div>
        <div class="tb-bar"><a class="btn btn-white btn-sm" href="#/talk">${I('arrow_l', 18)} Lộ trình Nói</a><span class="grow"></span>
          <div class="seg"><button class="${mode === 'all' ? 'active' : ''}" data-m="all">Tất cả</button><button class="${mode === 'weak' ? 'active' : ''}" data-m="weak">Câu còn yếu</button></div>
          ${ls.length ? `<a class="btn btn-sm" href="#/talk/daily">${I('refresh', 18)} Ôn ngay</a>` : ''}</div>
        ${body}</div>`;
    };
    draw();
    root.addEventListener('click', e => {
      const m = e.target.closest('[data-m]'); if (m) { mode = m.dataset.m; draw(); return; }
      const s = e.target.closest('[data-say]'); if (s) SJ.audio.speak(s.dataset.say);
    });
    return {};
  }

  // ===================== MỞ MỘT BÀI =====================
  function start(root, arg) {
    const [id, rs] = String(arg).split('/');
    const back = `<div class="page-narrow center"><h2>Không tìm thấy bài này</h2><a class="btn" href="#/talk">Về lộ trình Nói</a></div>`;
    if (id === 'daily') {
      const ls = learned();
      if (!ls.length) { root.innerHTML = `<div class="page-narrow center">${U().mascot('happy', 100)}<h2>Chưa có câu nào để ôn</h2><p class="muted bold">Học lượt đầu của bài "Chào trong ngày" trước nha.</p><a class="btn" href="#/talk">Về lộ trình Nói</a></div>`; return {}; }
      const due = dueList(), pool = (due.length >= 6 ? due : due.concat(weakList().filter(e => !due.includes(e)))).slice(0, 12);
      const lsPool = ls.filter(l => pool.some(e => e.lid === l.id));
      const steps = [mk('intro', null, { head: { icon: 'refresh', kicker: 'Ôn tập hôm nay', title: due.length ? `${due.length} câu đến lúc ôn lại` : 'Luyện những câu còn yếu', sub: 'Ôn đúng lúc sắp quên là cách nhớ lâu nhất. Câu nào trả lời đúng sẽ được hẹn ôn lại xa hơn.', ls: lsPool } })]
        .concat(mixSteps(lsPool, { ear: 2, mean: 2, pick: 2, fill: 3, build: 2, earbuild: 1, talk: 2, recall: 2 }, pool));
      return play(root, { kind: 'daily', id: 'daily', color: '#ff6b9a', steps });
    }
    const nd = node(id);
    if (!nd) { root.innerHTML = back; return {}; }
    if (nd.t === 'lesson') {
      const rr = rounds(id), want = +rs || rr + 1, round = Math.max(1, Math.min(want, rr + 1, 4));
      return play(root, { kind: 'lesson', id, L: nd.L, nd, round, color: nd.u.color, steps: lessonSteps(nd.L, round) });
    }
    const isCk = nd.t === 'check';
    const head = { icon: isCk ? 'trophy' : 'books', kicker: isCk ? `Kiểm tra chặng ${nd.ui + 1}` : 'Bài ôn tập', title: isCk ? nd.u.title : nd.ls.map(l => l.title).join(' + '), sub: isCk ? 'Trộn câu của cả chặng, có cả câu nghe không nhìn chữ và tự nói. Cố lên nha!' : 'Nhắc lại câu của 2 bài vừa học, thêm vài câu của bài cũ.', ls: nd.ls };
    const plan = isCk ? { ear: 3, pick: 3, fill: 4, build: 2, hard: 2, earbuild: 2, talk: 4, recall: 3, old: 2, n4: 1 } : { ear: 3, mean: 2, pick: 3, fill: 4, build: 3, talk: 3, recall: 2, old: 2 };
    return play(root, { kind: nd.t, id, nd, color: nd.u.color, steps: [mk('intro', null, { head })].concat(mixSteps(nd.ls, plan)) });
  }

  // ===================== CHƠI MỘT LƯỢT =====================
  function play(root, P) {
    let steps = P.steps, si = 0, graded = 0, firstOk = 0, answered = false, rec = null, destroyed = false, tmo = null, streak = 0;
    const wrongs = [], seenEx = [];
    root.innerHTML = `<div class="lesson talk-lesson ${showRomaji ? '' : 'no-romaji'}" style="--uc:${P.color}">
      <div class="lesson-top"><button class="lesson-x" aria-label="Thoát">${I('batsu', 24)}</button><div class="bar lesson-prog"><i style="width:0"></i></div>
        <button class="tr-tog ${showRomaji ? 'on' : ''}" data-rtog title="Hiện / ẩn romaji">Romaji</button></div>
      <div class="lesson-body"></div>
      <div class="lesson-foot"></div></div>`;
    const wrap = root.querySelector('.talk-lesson'), body = root.querySelector('.lesson-body'), foot = root.querySelector('.lesson-foot'), fill = root.querySelector('.lesson-prog > i');
    const setFoot = (html, cls) => { foot.className = 'lesson-foot ' + (cls || ''); foot.innerHTML = html ? `<div class="foot-in">${html}</div>` : ''; };
    const setProg = () => { fill.style.width = (si / Math.max(steps.length, 1) * 100) + '%'; };
    const stopRec = () => { if (rec) { try { rec.abort(); } catch (e) { } rec = null; } };
    const say = (t, o) => SJ.audio.speak(t, o);
    root.querySelector('.lesson-x').onclick = async () => {
      if (si === 0 || si >= steps.length || await U().confirm('Thoát bây giờ hả? Tiến độ lượt này sẽ chưa được lưu đâu nha.', 'Thoát', 'Học tiếp')) location.hash = '#/talk';
    };
    root.querySelector('[data-rtog]').onclick = e => { showRomaji = !showRomaji; try { localStorage.setItem(RK, showRomaji ? '1' : '0'); } catch (er) { } wrap.classList.toggle('no-romaji', !showRomaji); e.currentTarget.classList.toggle('on', showRomaji); };
    body.addEventListener('click', e => { const s = e.target.closest('[data-say]'); if (s && !e.target.closest('.opt, .ttile')) say(s.dataset.say); const sl = e.target.closest('[data-slow]'); if (sl) say(sl.dataset.slow, { rate: 0.55 }); });

    const stepEx = s => s.ex || (s.f && s.L.ex[s.f.ex]) || (s.d && typeof s.d.a === 'number' && s.L.ex[s.d.a]) || null;
    function next() { stopRec(); clearTimeout(tmo); si++; render(); }
    function render() {
      if (destroyed) return;
      stopRec(); answered = false; setProg(); setFoot('');
      if (si >= steps.length) return result();
      const s = steps[si];
      const e = stepEx(s); if (e && !seenEx.includes(e)) seenEx.push(e);
      let t = s.t;
      if ((t === 'ear' || t === 'earbuild') && !canEar()) t = t === 'ear' ? 'mean' : 'build';
      ({ intro: rIntro, learn: rLearn, recap: rRecap, new: rNew, say: rSay, ear: rEar, mean: rMean, pick: rPick, fill: rFill, build: rBuild, earbuild: rBuild, talk: rTalk, recall: rRecall })[t](s, t);
      window.scrollTo(0, 0);
    }
    /** chấm một bước; sai thì làm lại ở cuối (một lần), ghi độ nhớ của câu */
    function grade(ok, hint, opt) {
      answered = true;
      const s = steps[si], e = stepEx(s);
      if (s.g && !s.retry) { graded++; if (ok) firstOk++; }
      if (!ok && s.g && !s.retry) { steps.push(Object.assign({}, s, { retry: true })); if (e && !wrongs.includes(e)) wrongs.push(e); }
      if (e && s.g && SJ.store.talkRec) SJ.store.talkRec(e.key, ok);
      streak = ok ? streak + 1 : 0;
      SJ.emit('answer', { ok, streak });
      if (!(opt && opt.silent)) SJ.audio.sfx(ok ? 'ok' : 'bad');
      setFoot(`<div class="fb slide-up"><span class="fb-badge">${I(ok ? 'check' : 'batsu', 36)}</span><div><div class="fb-title">${ok ? (opt && opt.title) || U().pick(SJ.CHEERS) : U().pick(SJ.COMFORTS)}</div>${hint ? `<div class="fb-hint">${hint}</div>` : ''}</div></div><button class="btn btn-lg ${ok ? 'btn-green' : 'btn-red'}" data-cont>Tiếp tục</button>`, ok ? 'ok' : 'bad');
      foot.querySelector('[data-cont]').onclick = next;
      setTimeout(() => { const b = foot.querySelector('[data-cont]'); b && b.focus({ preventScroll: true }); }, 50);
      if (opt && opt.say) setTimeout(() => say(opt.say), 300);
    }
    const tag = s => s.retry ? `<div class="retry-tag">${I('refresh', 16)} Làm lại câu này nha</div>` : s.old ? `<div class="retry-tag old-tag">${I('books', 16)} Ôn câu cũ · ${esc(s.L.title)}</div>` : '';
    function choice(s, ask, prompt, opts, answer, hint, sayAfter, footHTML) {
      body.innerHTML = `<div class="quiz slide-in-r">${tag(s)}<div class="quiz-ask">${ask}</div><div class="quiz-prompt">${prompt}</div>
        <div class="quiz-opts tq-opts">${opts.map((o, i) => `<button class="opt" data-nosfx="1" data-v="${i}"><kbd>${i + 1}</kbd><span class="opt-in">${o.html}</span></button>`).join('')}</div></div>`;
      body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (answered) return;
        const ok = +b.dataset.v === answer;
        body.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.v === answer) x.classList.add('ok'); });
        if (!ok) b.classList.add('bad', 'shake');
        grade(ok, hint, { say: sayAfter });
      });
      if (footHTML) setFoot(footHTML);
    }
    const optJP = o => `<span class="jp tq-j">${esc(o.jp)}</span>${o.r ? `<small class="tq-r tr">${esc(o.r)}</small>` : ''}`;
    /** câu nhiễu: cùng bài trước, thiếu thì lấy thêm từ bài đã học khác */
    const others = (e, k, L) => {
      let pool = shuf(L.ex.filter(x => x !== e && x.v !== e.v && x.jp !== e.jp));
      if (pool.length < k) pool = pool.concat(shuf([].concat(...learned().filter(l => l !== L).map(l => l.ex)).filter(x => x.v !== e.v && x.jp !== e.jp)).slice(0, k - pool.length));
      return pool.slice(0, k);
    };
    const nOpt = s => s.n4 ? 3 : 2;
    const noEarBtn = `<button class="btn btn-white" data-noear>${I('mute', 20)} Không nghe được lúc này</button>`;
    const bindNoEar = () => { const b = foot.querySelector('[data-noear]'); if (b) b.onclick = () => { SJ.audio.listenOff && SJ.audio.listenOff(60); SJ.audio.stop(); U().toast(`${I('mute', 24)} Đã tạm ẩn câu nghe trong 1 tiếng — câu nghe đổi thành câu đọc nha`, 3000); render(); }; };

    // --- mở đầu bài ôn / kiểm tra / ôn hằng ngày ---
    function rIntro(s) {
      const h = s.head, gN = steps.filter(x => x.g).length;
      body.innerHTML = `<div class="tl-learn tl-intro pop-in"><div class="tli-ico">${I(h.icon, 64)}</div><div class="unit-pill">${esc(h.kicker)}</div><h1>${esc(h.title)}</h1><p class="tl-goal">${esc(h.sub)}</p>
        ${h.ls && h.ls.length ? `<div class="tli-ls">${h.ls.map(l => `<span class="tli-chip">${ico(l.icon, 22)} ${esc(l.title)}</span>`).join('')}</div>` : ''}
        <div class="tli-stats"><span>${I('target', 22)} ${gN} câu hỏi</span><span>${I('speaker', 22)} nghe · ${I('pencil', 20)} điền · ${I('puzzle', 20)} xếp câu · ${I('speech', 20)} nói</span></div></div>`;
      setFoot(`<a class="btn btn-white" href="#/talk">${I('arrow_l', 18)} Lộ trình</a><span class="grow"></span><button class="btn btn-lg btn-cat" data-go>${U().ears ? U().ears() : ''}Bắt đầu ${I('arrow_r', 22)}</button>`);
      foot.querySelector('[data-go]').onclick = next;
    }
    const roundPill = r => P.kind === 'lesson' ? `<div class="t-rounds">${RN.map((nm, i) => `<span class="${i + 1 < r ? 'on' : i + 1 === r ? 'now' : ''}"><i>${i + 1 < r ? I('check', 12) : i + 1}</i>${nm}</span>`).join('')}</div>` : '';
    // --- lượt 1: xem mẫu câu ---
    function rLearn(s) {
      const L = s.L, unit = SJ.TALK.find(u => u.id === L.unit);
      body.innerHTML = `<div class="tl-learn pop-in">
        <div class="unit-pill">${ico(unit.icon, 22)} ${esc(unit.title)} · Bài ${lessonNo(L.id)}</div>
        ${roundPill(1)}
        <h1>${esc(L.title)} <span class="jp">${esc(L.jp)}</span></h1><p class="tl-goal">${esc(L.goal)}</p>
        ${patternHTML(L.pattern)}
        <ul class="tpoints">${L.points.map(p => `<li>${p}</li>`).join('')}</ul>
        <div class="tl-sub">${I('speaker', 22)} Câu mẫu lượt này — bấm để nghe</div>
        <div class="tex-list">${s.list.map(e => exRow(e)).join('')}</div>
        ${s.more ? `<p class="tl-more">${I('sparkle', 20)} Lượt 2 sẽ học thêm <b>${s.more} câu</b> nữa.</p>` : ''}
        <div class="ttip">${I('bulb', 30)}<div><b>Người Nhật thường…</b><p>${L.tip}</p></div></div></div>`;
      setFoot(`<span class="grow muted small bold">${steps.filter(x => x.g).length} câu hỏi · gặp từng câu mới một</span><button class="btn btn-lg btn-cat" data-go>${U().ears ? U().ears() : ''}Bắt đầu lượt 1 ${I('arrow_r', 22)}</button>`);
      foot.querySelector('[data-go]').onclick = next;
    }
    // --- lượt 2, 3, ôn lại: nhắc lại mẫu câu ---
    function rRecap(s) {
      const L = s.L, r = s.round, fresh = s.fresh || [];
      body.innerHTML = `<div class="tl-learn pop-in">
        <div class="unit-pill">${ico(L.icon, 22)} Bài ${lessonNo(L.id)} · ${r > 3 ? 'Ôn lại' : `Lượt ${r}/${ROUNDS}: ${RN[r - 1]}`}</div>
        ${r <= 3 ? roundPill(r) : ''}
        <h1>${esc(L.title)} <span class="jp">${esc(L.jp)}</span></h1>
        <p class="tl-goal">${r === 2 ? `Lượt này: thêm ${fresh.length} câu mới, rồi điền chỗ trống, xếp câu và hội thoại.` : 'Lượt khó nhất: nghe không nhìn chữ, xếp câu có chữ thừa, tự nói từ nghĩa tiếng Việt.'}</p>
        ${patternHTML(L.pattern)}
        <details class="tl-det"><summary>${I('bulb', 20)} Xem lại giải thích</summary><ul class="tpoints">${L.points.map(p => `<li>${p}</li>`).join('')}</ul><div class="ttip">${I('bulb', 30)}<div><b>Người Nhật thường…</b><p>${L.tip}</p></div></div></details>
        <div class="tl-sub">${I('speaker', 22)} Các câu mẫu — nghe lại một lượt trước khi luyện</div>
        <div class="tex-list">${L.ex.map(e => exRow(e, { isNew: fresh.includes(e), mem: 1 })).join('')}</div></div>`;
      setFoot(`<span class="grow muted small bold">${steps.filter(x => x.g).length} câu hỏi</span><button class="btn btn-lg btn-cat" data-go>${U().ears ? U().ears() : ''}Bắt đầu ${I('arrow_r', 22)}</button>`);
      foot.querySelector('[data-go]').onclick = next;
    }
    // --- gặp câu mới: nghe, xem từng cụm, nói theo (không chấm điểm) ---
    function rNew(s) {
      const e = s.ex, mic = canSpeak();
      if (SJ.store.talkSeen) SJ.store.talkSeen(e.key);
      body.innerHTML = `<div class="quiz slide-in-r"><div class="tnew-badge">${I('sparkle', 18)} Câu mới</div>
        <div class="tsay card tnew"><div class="tsay-play"><button class="listen-btn" data-say="${esc(e.say)}" aria-label="Nghe">${I('speaker', 56)}</button><button class="listen-btn listen-slow" data-slow="${esc(e.say)}" aria-label="Nghe chậm">${I('slow', 34)}</button></div>
          ${chips(e)}<div class="tj jp tnew-full">${esc(e.jp)}</div><div class="tv">${esc(e.v)}</div></div>
        ${mic ? `<div class="tmic-wrap"><button class="tmic small" data-mic aria-label="Bấm rồi nói">${I('speech', 30)}<span>Nói thử</span></button><div class="theard" data-heard>Nghe 2–3 lần, rồi bấm nút và nói theo nhé.</div></div>`
          : `<p class="tself muted bold">Nghe 2–3 lần rồi nói to theo, nhái cả giọng lên xuống nha.</p>`}</div>`;
      setTimeout(() => say(e.say), 300);
      setFoot(`${mic ? `<button class="btn btn-white" data-nospeak>${I('mute', 20)} Không nói được lúc này</button>` : ''}<span class="grow"></span><button class="btn btn-lg" data-cont>Đã hiểu ${I('arrow_r', 20)}</button>`);
      foot.querySelector('[data-cont]').onclick = next;
      if (mic) {
        foot.querySelector('[data-nospeak]').onclick = noSpeak;
        body.querySelector('[data-mic]').onclick = () => listen(body.querySelector('[data-mic]'), body.querySelector('[data-heard]'), e, sc => {
          const h = body.querySelector('[data-heard]');
          if (sc >= 0.75) { h.className = 'theard ok'; h.insertAdjacentHTML('beforeend', `<b>${I('check', 18)} Chuẩn lắm!</b>`); SJ.audio.sfx('ok'); }
          else if (sc >= 0.5) { h.className = 'theard mid'; h.insertAdjacentHTML('beforeend', '<b>Gần đúng rồi — nghe lại rồi nói chậm, rõ hơn chút nha</b>'); SJ.audio.sfx('note', 2); }
          else { h.className = 'theard bad'; h.insertAdjacentHTML('beforeend', '<b>Mochi chưa nghe rõ — nghe mẫu rồi thử lại nha</b>'); }
        });
      }
    }
    // --- nghe & nói theo ---
    function rSay(s) {
      const e = s.ex, mic = canSpeak();
      body.innerHTML = `<div class="quiz slide-in-r">${tag(s)}<div class="quiz-ask">Nghe rồi nói theo Mochi</div>
        <div class="tsay card"><div class="tsay-play"><button class="listen-btn" data-say="${esc(e.say)}" aria-label="Nghe">${I('speaker', 56)}</button><button class="listen-btn listen-slow" data-slow="${esc(e.say)}" aria-label="Nghe chậm">${I('slow', 34)}</button></div>
          ${jpLine(e.jp, e.rom)}<div class="tv">${esc(e.v)}</div></div>
        ${mic ? `<div class="tmic-wrap"><button class="tmic" data-mic aria-label="Bấm rồi nói">${I('speech', 34)}<span>Bấm rồi nói</span></button><div class="theard" data-heard>Nghe vài lần, rồi bấm nút và nói to câu trên nhé.</div></div>`
          : `<p class="tself muted bold">${SR ? 'Đang tắt phần nói. ' : ''}Nghe 2–3 lần rồi nói to theo, nhái cả giọng lên xuống nha.</p>`}</div>`;
      setTimeout(() => say(e.say), 300);
      if (mic) {
        setFoot(`<button class="btn btn-white" data-nospeak>${I('mute', 20)} Không nói được lúc này</button><span class="grow"></span><button class="btn btn-white" data-skip>Bỏ qua ${I('arrow_r', 18)}</button>`);
        foot.querySelector('[data-nospeak]').onclick = noSpeak;
        foot.querySelector('[data-skip]').onclick = next;
        let tries = 0;
        body.querySelector('[data-mic]').onclick = () => listen(body.querySelector('[data-mic]'), body.querySelector('[data-heard]'), e, sc => {
          tries++;
          const h = body.querySelector('[data-heard]');
          if (sc >= 0.75) { h.className = 'theard ok'; h.insertAdjacentHTML('beforeend', `<b>${I('check', 18)} Chuẩn lắm!</b>`); SJ.audio.sfx('ok'); setFoot(`<span class="grow"></span><button class="btn btn-lg btn-green" data-cont>Tiếp tục</button>`, 'ok'); foot.querySelector('[data-cont]').onclick = next; tmo = setTimeout(next, 1600); }
          else if (sc >= 0.5) { h.className = 'theard mid'; h.insertAdjacentHTML('beforeend', `<b>Gần đúng rồi — nghe lại rồi nói chậm, rõ hơn chút nha</b>`); SJ.audio.sfx('note', 2); setFoot(`<button class="btn btn-white" data-again>${I('refresh', 18)} Nói lại</button><span class="grow"></span><button class="btn btn-lg btn-green" data-cont>Tiếp tục</button>`, 'ok'); foot.querySelector('[data-cont]').onclick = next; foot.querySelector('[data-again]').onclick = () => body.querySelector('[data-mic]').click(); }
          else { h.className = 'theard bad'; h.insertAdjacentHTML('beforeend', `<b>Mochi chưa nghe rõ — bấm nghe mẫu rồi thử lại nha</b>`); SJ.audio.sfx('bad'); if (tries >= 2) { setFoot(`<button class="btn btn-white" data-nospeak>${I('mute', 20)} Không nói được lúc này</button><span class="grow"></span><button class="btn btn-lg" data-cont>Tiếp tục</button>`); foot.querySelector('[data-cont]').onclick = next; foot.querySelector('[data-nospeak]').onclick = noSpeak; } }
        });
      } else {
        setFoot(`<span class="grow"></span><button class="btn btn-lg btn-green" data-cont>${I('check', 20)} Mình đã nói theo</button>`);
        foot.querySelector('[data-cont]').onclick = next;
      }
    }
    /** tắt phần nói 1 tiếng: bỏ các bước nói còn lại (câu tự nói đổi thành câu chọn) */
    function noSpeak() {
      speakOff(60); stopRec();
      U().toast(`${I('mute', 24)} Đã tắt phần nói trong 1 tiếng — lúc tiện thì luyện nói lại nha`, 3000);
      steps = steps.slice(0, si).concat(steps.slice(si).filter(x => x.t !== 'say').map(x => x.t === 'recall' ? Object.assign({}, x, { t: 'pick' }) : x));
      render();
    }
    /** bật micro, nhận câu tiếng Nhật, trả về điểm giống câu mẫu */
    function listen(btn, out, ex, done) {
      if (rec) { try { rec.stop(); } catch (e) { } return; }
      SJ.audio.stop();
      const r = new SR(); rec = r;
      r.lang = 'ja-JP'; r.interimResults = true; r.maxAlternatives = 3;
      let best = 0, heard = '', fin = false;
      const lab = btn.querySelector('span'), lab0 = lab ? lab.textContent : '';
      btn.classList.add('rec'); if (lab) lab.textContent = 'Đang nghe…';
      out.className = 'theard'; out.innerHTML = '<span class="muted">Mochi đang nghe…</span>';
      r.onresult = ev => {
        let t = '';
        for (let i = 0; i < ev.results.length; i++) {
          const res = ev.results[i];
          t += res[0].transcript;
          if (res.isFinal) for (let a = 0; a < res.length; a++) best = Math.max(best, scoreSpeech(res[a].transcript, ex));
        }
        heard = t; best = Math.max(best, scoreSpeech(t, ex));
        out.innerHTML = `<span class="th-lab">Mochi nghe được:</span> <span class="jp th-txt">${esc(t)}</span>`;
      };
      r.onerror = ev => {
        if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { U().toast(`${I('mute', 26)} Bạn chưa cho phép dùng micro — bấm biểu tượng ổ khoá trên thanh địa chỉ để bật nha`, 4200); }
        else if (ev.error === 'no-speech') out.innerHTML = '<span class="muted">Chưa nghe thấy gì — bấm nút rồi nói to hơn chút nha.</span>';
        else if (ev.error === 'network') out.innerHTML = '<span class="muted">Nhận giọng nói cần có mạng. Kiểm tra mạng rồi thử lại nha.</span>';
      };
      r.onend = () => {
        if (rec === r) rec = null;
        btn.classList.remove('rec'); if (lab) lab.textContent = lab0;
        if (!fin && heard) { fin = true; done(best, heard); }
      };
      try { r.start(); SJ.audio.sfx('tap'); } catch (e) { rec = null; btn.classList.remove('rec'); }
    }
    // --- nghe (không nhìn chữ) → chọn nghĩa ---
    function rEar(s) {
      const e = s.ex, L = s.L, opts = shuf([e].concat(others(e, nOpt(s), L)));
      choice(s, 'Nghe và chọn nghĩa đúng', `<div class="tear"><button class="listen-btn" data-say="${esc(e.say)}" aria-label="Nghe">${I('speaker', 56)}</button><button class="listen-btn listen-slow" data-slow="${esc(e.say)}" aria-label="Nghe chậm">${I('slow', 34)}</button></div>`,
        opts.map(o => ({ html: esc(o.v) })), opts.indexOf(e), `<span class="jp">${esc(e.jp)}</span> (${esc(e.rom)}) = ${esc(e.v)}`, '', `<span class="grow"></span>${noEarBtn}`);
      bindNoEar();
      setTimeout(() => say(e.say), 300);
    }
    // --- câu Nhật → nghĩa ---
    function rMean(s) {
      const e = s.ex, opts = shuf([e].concat(others(e, nOpt(s), s.L)));
      choice(s, 'Câu này nghĩa là gì?', `<div class="tq-prompt">${sayBtn(e.say, true)}<div>${jpLine(e.jp, e.rom)}</div></div>`,
        opts.map(o => ({ html: esc(o.v) })), opts.indexOf(e), `<span class="jp">${esc(e.jp)}</span> = ${esc(e.v)}`);
      setTimeout(() => say(e.say), 250);
    }
    // --- nghĩa → câu Nhật ---
    function rPick(s) {
      const e = s.ex, opts = shuf([e].concat(others(e, nOpt(s), s.L)));
      choice(s, 'Nói câu này bằng tiếng Nhật thế nào?', `<div class="tq-vi">${esc(e.v)}</div>`,
        opts.map(o => ({ html: optJP({ jp: o.jp, r: o.rom }) })), opts.indexOf(e), `${esc(e.v)} = <span class="jp">${esc(e.jp)}</span> (${esc(e.rom)})`, e.say);
    }
    // --- điền chỗ trống ---
    function rFill(s) {
      const f = s.f, e = s.L.ex[f.ex], right = clean(e.toks[f.tok]);
      const shown = e.toks.map((t, i) => i === f.tok ? `<span class="tblank">？</span>${/\s$/.test(t) ? ' ' : ''}${/[。？！…]$/.test(t) ? t.slice(-1) : ''}` : esc(t)).join('');
      const opts = shuf([right].concat(f.wrong.map(clean)));
      choice(s, 'Chọn chữ còn thiếu', `<div class="tq-fill jp">${shown}</div><div class="tq-vi sm">${esc(e.v)}</div>`,
        opts.map(o => ({ html: `<span class="jp tq-j">${esc(o)}</span>` })), opts.indexOf(right), `${f.why}<br><span class="jp">${esc(e.jp)}</span> (${esc(e.rom)})`, e.say);
      if (opts.every(o => Array.from(o).length <= 5)) body.querySelector('.tq-opts').classList.add('short');
    }
    // --- xếp câu (có thể nghe rồi xếp, hoặc có chữ thừa) ---
    function rBuild(s, t) {
      const e = s.ex, byEar = t === 'earbuild';
      const tiles = e.toks.map((x, i) => ({ t: clean(x), r: (e.rtoks[i] || '').replace(/,$/, '').trim(), i }));
      let pool = tiles.slice();
      if (s.hard || byEar) {
        // thêm 2 cụm thừa lấy từ câu khác cùng bài
        const have = new Set(tiles.map(x => x.t)), extra = [];
        shuf([].concat(...s.L.ex.filter(x => x !== e).map(x => x.toks.map((tk, i) => ({ t: clean(tk), r: (x.rtoks[i] || '').replace(/,$/, '').trim(), i: -1 }))))).forEach(x => { if (x.t && !have.has(x.t) && extra.length < 2) { have.add(x.t); extra.push(x); } });
        pool = pool.concat(extra);
      }
      const order = shuf(pool);
      if (order.length > 1 && order.every((x, k) => x.i === k)) order.push(order.shift());
      const placed = [];
      const prompt = byEar
        ? `<div class="tear">${`<button class="listen-btn" data-say="${esc(e.say)}" aria-label="Nghe">${I('speaker', 56)}</button><button class="listen-btn listen-slow" data-slow="${esc(e.say)}" aria-label="Nghe chậm">${I('slow', 34)}</button>`}</div>`
        : `<div class="tq-vi">${esc(e.v)}</div>`;
      body.innerHTML = `<div class="quiz slide-in-r">${tag(s)}<div class="quiz-ask">${byEar ? 'Nghe rồi xếp lại câu bạn nghe được' : 'Xếp thành câu tiếng Nhật'}${pool.length > tiles.length ? ' <small class="tb-extra">(có 2 cụm thừa)</small>' : ''}</div><div class="quiz-prompt">${prompt}</div>
        <div class="tb-slots" data-slots></div><div class="tb-tiles" data-tiles>${order.map((x, k) => `<button class="ttile" data-k="${k}"><span class="jp">${esc(x.t)}</span>${x.r ? `<small class="tr">${esc(x.r)}</small>` : ''}</button>`).join('')}</div></div>`;
      const slots = body.querySelector('[data-slots]');
      const need = pool.length > tiles.length ? 2 : order.length;
      const draw = () => {
        slots.innerHTML = placed.length ? placed.map((k, j) => `<button class="ttile in" data-j="${j}"><span class="jp">${esc(order[k].t)}</span>${order[k].r ? `<small class="tr">${esc(order[k].r)}</small>` : ''}</button>`).join('') : '<span class="tb-hint">Bấm các cụm chữ bên dưới theo đúng thứ tự</span>';
        body.querySelectorAll('[data-tiles] .ttile').forEach(b => b.classList.toggle('used', placed.includes(+b.dataset.k)));
        const left = byEar ? noEarBtn : '';
        setFoot(placed.length >= need ? `<button class="btn btn-white" data-reset>${I('refresh', 18)} Xếp lại</button><span class="grow"></span><button class="btn btn-lg" data-check>Kiểm tra</button>` : placed.length ? `<button class="btn btn-white" data-reset>${I('refresh', 18)} Xếp lại</button>${left}` : left);
        const c = foot.querySelector('[data-check]'); if (c) c.onclick = check;
        const rs = foot.querySelector('[data-reset]'); if (rs) rs.onclick = () => { placed.length = 0; draw(); };
        bindNoEar();
      };
      const check = () => {
        if (answered) return;
        const ok = placed.map(k => order[k].t).join('') === tiles.map(x => x.t).join('');
        slots.classList.add(ok ? 'ok' : 'bad');
        grade(ok, `<span class="jp">${esc(e.jp)}</span> (${esc(e.rom)})${byEar ? ` = ${esc(e.v)}` : ''}`, { say: e.say });
      };
      body.querySelector('[data-tiles]').onclick = ev => { const b = ev.target.closest('.ttile'); if (!b || answered || placed.includes(+b.dataset.k)) return; placed.push(+b.dataset.k); SJ.audio.sfx('tap'); draw(); };
      slots.onclick = ev => { const b = ev.target.closest('.ttile'); if (!b || answered) return; placed.splice(+b.dataset.j, 1); draw(); };
      draw();
      if (byEar) setTimeout(() => say(e.say), 300);
    }
    // --- hội thoại: chọn câu đáp tự nhiên ---
    function rTalk(s) {
      const d = s.d, L = s.L, right = optOf(L, d.a), opts = shuf([right].concat(d.wrong.map(w => optOf(L, w))));
      const prompt = d.q
        ? `<div class="tdlg"><div class="tdlg-ava">${U().mascot('happy', 64)}</div><div class="tdlg-bub" data-say="${esc(d.q)}">${I('speaker', 20)}<div>${jpLine(d.q, d.qr)}<div class="tv">${esc(d.qv)}</div></div></div></div>`
        : `<div class="tsit">${I('bulb', 30)}<b>${esc(d.sit)}</b></div>`;
      choice(s, d.q ? 'Bạn đáp lại thế nào cho tự nhiên?' : 'Tình huống', prompt, opts.map(o => ({ html: optJP(o) })), opts.indexOf(right),
        `${right.v ? esc(right.v) + ' — ' : ''}<span class="jp">${esc(right.jp)}</span>${right.r ? ` (${esc(right.r)})` : ''}`, /[ぁ-んァ-ヶ]/.test(right.jp) && !/（/.test(right.jp) ? right.jp : '');
      if (d.q) setTimeout(() => say(d.q), 300);
    }
    // --- tự nói câu tiếng Nhật từ nghĩa tiếng Việt (khó nhất) ---
    function rRecall(s) {
      const e = s.ex, mic = canSpeak();
      body.innerHTML = `<div class="quiz slide-in-r">${tag(s)}<div class="quiz-ask">Tự nói bằng tiếng Nhật</div>
        <div class="quiz-prompt"><div class="tq-vi">${esc(e.v)}</div><button class="link-btn tr-peek" data-peek>${I('eye', 18)} Gợi ý romaji</button><div class="tr-peeked" data-peeked hidden>${esc(e.rom)}</div></div>
        ${mic ? `<div class="tmic-wrap"><button class="tmic" data-mic>${I('speech', 34)}<span>Bấm rồi nói</span></button><div class="theard" data-heard>Nghĩ một chút rồi bấm nút và nói nhé.</div></div>` : `<p class="tself muted bold">Nói to câu tiếng Nhật, rồi bấm <b>Xem đáp án</b> để tự kiểm tra.</p>`}</div>`;
      body.querySelector('[data-peek]').onclick = ev => { ev.currentTarget.hidden = true; body.querySelector('[data-peeked]').hidden = false; };
      const reveal = ok => grade(ok, `<span class="jp">${esc(e.jp)}</span> (${esc(e.rom)})`, { say: e.say, title: ok ? 'Nói giỏi quá!' : null });
      if (mic) {
        setFoot(`<button class="btn btn-white" data-nospeak>${I('mute', 20)} Không nói được lúc này</button><span class="grow"></span><button class="btn btn-white" data-show>Xem đáp án</button>`);
        foot.querySelector('[data-nospeak]').onclick = noSpeak;
        foot.querySelector('[data-show]').onclick = () => !answered && reveal(false);
        let tries = 0;
        body.querySelector('[data-mic]').onclick = () => listen(body.querySelector('[data-mic]'), body.querySelector('[data-heard]'), e, sc => {
          tries++;
          if (sc >= 0.6 || tries >= 2) reveal(sc >= 0.6);
          else { const h = body.querySelector('[data-heard]'); h.className = 'theard mid'; h.insertAdjacentHTML('beforeend', '<b>Chưa giống lắm — thử nói lại một lần nữa nha</b>'); SJ.audio.sfx('note', 2); }
        });
      } else {
        setFoot(`<span class="grow"></span><button class="btn btn-lg" data-show>Xem đáp án</button>`);
        foot.querySelector('[data-show]').onclick = () => {
          say(e.say);
          body.querySelector('.quiz-prompt').insertAdjacentHTML('beforeend', `<div class="tans">${jpLine(e.jp, e.rom)}</div>`);
          setFoot(`<span class="grow muted bold">Bạn nói đúng không?</span><button class="btn btn-red" data-no>Chưa đúng</button><button class="btn btn-green" data-yes>Mình nói đúng</button>`);
          foot.querySelector('[data-yes]').onclick = () => reveal(true);
          foot.querySelector('[data-no]').onclick = () => reveal(false);
        };
      }
    }

    // ----- kết quả -----
    function result() {
      fill.style.width = '100%';
      const pct = graded ? Math.round(firstOk / graded * 100) : 100;
      let r, title, sub = '', primary = '';
      if (P.kind === 'daily') {
        const xp = 6 + Math.round(pct / 20) * 2; SJ.store.addXP(xp);
        r = { stars: pct >= 100 ? 3 : pct >= 75 ? 2 : 1, xp, fish: 0 };
        title = 'Ôn xong hôm nay!'; sub = 'Câu nào đúng sẽ được hẹn ôn lại xa hơn — mai quay lại ôn tiếp nha.';
      } else {
        r = SJ.store.completeTalk(P.id, pct, { rounds: P.kind === 'lesson' ? ROUNDS : 1, bonus: P.kind === 'check' ? 10 : 0 });
        if (P.kind === 'lesson') {
          const rr = r.rounds;
          title = P.round > 3 || !r.fresh ? `Ôn xong bài "${P.L.title}"!` : rr >= ROUNDS ? `Thuộc bài "${P.L.title}" rồi!` : `Xong lượt ${rr}/${ROUNDS}: ${RN[rr - 1]}`;
          sub = r.fresh && rr < ROUNDS ? `Còn ${ROUNDS - rr} lượt nữa là thuộc bài — lượt sau khó hơn một chút.` : r.fresh ? 'Đủ 3 lượt — bài sau đã mở. Câu của bài này sẽ được nhắc lại trong các bài ôn.' : '';
        } else title = P.kind === 'check' ? `Qua chặng "${P.nd.u.title}"!` : 'Ôn tập xong!';
      }
      SJ.audio.sfx('win'); if (r.stars >= 2) U().confetti(P.kind === 'check' || (P.kind === 'lesson' && r.rounds >= ROUNDS && r.fresh) ? 140 : 80);
      const nx = curNode();
      if (P.kind === 'lesson' && rounds(P.id) < ROUNDS) primary = `<a class="btn btn-lg btn-cat" href="#/talk/${P.id}/${rounds(P.id) + 1}">${U().ears ? U().ears() : ''}Học lượt ${rounds(P.id) + 1}: ${RN[rounds(P.id)]} ${I('arrow_r', 20)}</a>`;
      else if (nx) primary = `<a class="btn btn-lg btn-cat" href="#/talk/${nx.id}${nx.t === 'lesson' ? '/' + (rounds(nx.id) + 1) : ''}">${U().ears ? U().ears() : ''}Tiếp: ${esc(nx.t === 'lesson' ? nx.L.title : nx.t === 'review' ? 'Ôn tập' : 'Kiểm tra chặng')} ${I('arrow_r', 20)}</a>`;
      else primary = `<a class="btn btn-lg" href="#/sensei/role">${ico('sensei', 22)} Nói chuyện với Mochi</a>`;
      const learnedHere = P.kind === 'lesson' ? (P.round === 1 ? P.L.ex.slice(0, 5) : P.L.ex) : seenEx;
      body.innerHTML = `<div class="result pop-in"><div class="result-mochi">${U().mascot(r.stars >= 3 ? 'love' : 'cheer', 140, 'jump')}${U().hanko ? U().hanko(r.stars >= 3 ? '満点' : '合格', 'stamp-in') : ''}</div>
        <h1>${esc(title)}</h1>${sub ? `<p class="muted bold">${esc(sub)}</p>` : ''}
        ${P.kind === 'lesson' ? `<div class="t-rounds big">${RN.map((nm, i) => `<span class="${i < rounds(P.id) ? 'on' : ''}"><i>${i < rounds(P.id) ? I('check', 14) : i + 1}</i>${nm}</span>`).join('')}</div>` : ''}
        <div class="result-stars">${U().stars(r.stars, 3, 52)}</div>
        <div class="result-stats"><div class="rs card mint">${I('check', 30)}<b>${pct}%</b><span>đúng ngay lần đầu</span></div><div class="rs card sun">${I('star', 30)}<b>+${r.xp}</b><span>XP</span></div>${r.fish ? `<div class="rs card sky">${I('fishcoin', 30)}<b>+${r.fish}</b><span>cá vàng</span></div>` : ''}</div>
        ${wrongs.length ? `<div class="tl-recap card"><div class="tl-sub">${I('refresh', 22)} Câu cần ôn thêm (${wrongs.length})</div><div class="tex-list">${wrongs.map(e => exRow(e)).join('')}</div></div>` : ''}
        <div class="tl-recap card"><div class="tl-sub">${I('speech', 22)} ${P.kind === 'lesson' ? 'Câu của bài này' : 'Câu vừa ôn'} — bấm để nghe lại</div><div class="tex-list">${learnedHere.slice(0, 9).map(e => exRow(e, { mem: 1 })).join('')}</div></div></div>`;
      setFoot(`<a class="btn btn-white" href="#/talk">${I('arrow_l', 20)} Lộ trình Nói</a><span class="grow"></span>${primary}`);
    }
    const onKey = e => {
      if (document.querySelector('.modal-back')) return;
      if (/^[1-4]$/.test(e.key) && !answered) { const b = body.querySelectorAll('.opt')[+e.key - 1]; if (b) b.click(); }
      if (e.key === 'Enter' && answered) { const c = foot.querySelector('[data-cont]'); if (c && document.activeElement !== c) { e.preventDefault(); c.click(); } }
    };
    document.addEventListener('keydown', onKey);
    render();
    return { destroy() { destroyed = true; stopRec(); clearTimeout(tmo); SJ.audio.stop(); document.removeEventListener('keydown', onKey); } };
  }

  // thẻ nhỏ cho trang chủ: bài Nói tiếp theo + số câu cần ôn
  function teaser() {
    ready();
    const c = curNode(), d = SJ.TALK_LESSONS.filter(x => rounds(x.id) >= ROUNDS).length, due = dueList().length;
    const href = c ? `#/talk/${c.id}${c.t === 'lesson' ? '/' + (rounds(c.id) + 1) : ''}` : '#/talk';
    const what = c ? (c.t === 'lesson' ? `${esc(c.L.title)} <span class="jp">${esc(c.L.jp)}</span>` : esc(nodeTitle(c))) : 'Đã học hết lộ trình Nói!';
    const sub = c && c.t === 'lesson' ? (rounds(c.id) ? `Lượt ${rounds(c.id) + 1}/${ROUNDS}: ${RN[rounds(c.id)]} · ${esc(c.L.goal)}` : esc(c.L.goal)) : c ? (c.t === 'review' ? 'Bài ôn trộn câu cũ để nhớ lâu' : 'Kiểm tra cả chặng — qua là mở chặng sau') : 'Ôn lại hoặc nói chuyện với Sensei Mochi nha';
    return `<a class="card talk-teaser hov" href="${href}"><span class="tt-ico">${ico('talk', 44)}</span><div class="grow"><div class="tt-kicker">Nói & Ngữ pháp · thuộc ${d}/${SJ.TALK_LESSONS.length} bài${due ? ` · <span class="tt-due">${due} câu cần ôn</span>` : ''}</div><b>${what}</b><small>${sub}</small></div><span class="btn btn-sm">${d || SJ.TALK_LESSONS.some(l => rounds(l.id)) ? 'Học tiếp' : 'Bắt đầu'} ${I('arrow_r', 16)}</span></a>`;
  }

  SJ.talk = { page, teaser, canSpeak };
})(window.SJ);
