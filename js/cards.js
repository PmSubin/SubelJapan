/* SubelJapan — Thẻ ghi nhớ (flashcards)
 * #/cards          → chọn bộ thẻ (bảng chữ, từ vựng theo chủ đề, Kanji, thẻ đến hạn ôn)
 * #/cards/<id bộ>  → học ngay: lật thẻ 3D, vuốt phải = Đã nhớ, vuốt trái = Chưa nhớ (chấm thẳng vào SRS)
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const G = (n, s, c) => SJ.glyph(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduced = () => document.documentElement.dataset.motion === 'reduce' || SJ.store.get().settings.motion === 'reduce';

  // ===================== ICON RIÊNG CỦA TRANG =====================
  /** Hanamaru (はなまる) — vòng hoa đỏ cô giáo Nhật hay vẽ lên bài làm tốt */
  function hanamaruSVG() {
    const f = n => n.toFixed(2), cx = 24, cy = 24;
    const at = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    // xoáy ốc ở giữa
    let sp = '';
    for (let i = 0; i <= 80; i++) { const p = at(1.2 + i / 80 * Math.PI * 4.6, 0.6 + i / 80 * 7.2); sp += (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1]); }
    // 6 cánh hoa vẽ liền một nét, mỗi chỗ nối có một vòng xoắn nhỏ như nét bút cô giáo
    const N = 6, Rj = 13, Rc = 23.5, w = Math.PI / N;
    let d = '';
    for (let i = 0; i < N; i++) {
      const th = -Math.PI / 2 + i * 2 * w, a1 = th + w;
      const p0 = at(th - w, Rj), p1 = at(a1, Rj), c0 = at(th - w * 0.62, Rc), c1 = at(th + w * 0.62, Rc);
      if (!i) d += `M${f(p0[0])} ${f(p0[1])}`;
      d += ` C${f(c0[0])} ${f(c0[1])} ${f(c1[0])} ${f(c1[1])} ${f(p1[0])} ${f(p1[1])}`;
      const ia = a1 + Math.PI, tg = a1 + Math.PI / 2, lo = 5.4, lt = 4;
      d += ` C${f(p1[0] + Math.cos(ia) * lo + Math.cos(tg) * lt)} ${f(p1[1] + Math.sin(ia) * lo + Math.sin(tg) * lt)} ${f(p1[0] + Math.cos(ia) * lo - Math.cos(tg) * lt)} ${f(p1[1] + Math.sin(ia) * lo - Math.sin(tg) * lt)} ${f(p1[0])} ${f(p1[1])}`;
    }
    const ink = '#f0506b', st = `fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
    return `<path d="${d}" ${st}/><path d="${sp}" ${st}/>`;
  }
  if (SJ.addIcons) {
    SJ.addIcons({
      // chồng thẻ + đồng hồ báo thức nhỏ: "thẻ đến hạn ôn"
      fc_due: K => K.G('rotate(-11 17 27)', K.R(5, 12, 23, 29, 5, K.C.lav) + K.sakura(16.5, 26.5, .38, K.C.wht))
        + K.G('rotate(7 29 23)', K.R(16, 7, 23, 29, 5, K.C.wht) + K.H('M20.5 12 h6') + K.T(27.5, 27, 'あ', 13, null, 1))
        + K.O(30.5, 33.5, 3.2, K.C.yel) + K.O(42.5, 33.5, 3.2, K.C.yel) + K.O(36.5, 37.5, 9, K.C.wht) + K.P('M36.5 37.5 V32.6 M36.5 37.5 l3.4 2') + K.D(36.5, 37.5, 1.3)
        + K.P('M31.2 46 l-1.8 1.8 M41.8 46 l1.8 1.8'),
      hanamaru: () => hanamaruSVG(),
    }, {
      fc_flip: '<rect x="3" y="8.5" width="8" height="12" rx="2"/><rect x="13" y="8.5" width="8" height="12" rx="2" stroke-dasharray="2.3 2.1"/><path d="M6.8 6.1c2.9-2.8 7.5-2.8 10.4 0"/><path d="M14.8 3.9l2.5 2.2-2.9 1.1"/>',
      fc_shuffle: '<path d="M3.5 7.5h2.8c2.1 0 3.4 1 4.5 2.7l2.4 3.6c1.1 1.7 2.4 2.7 4.5 2.7h2.8"/><path d="M17.6 13.7l2.9 2.8-2.9 2.8"/><path d="M3.5 16.5h2.8c1.2 0 2.2-.3 3-1"/><path d="M14.2 8.5c.8-.7 1.8-1 3-1h3.3"/><path d="M17.6 4.7l2.9 2.8-2.9 2.8"/>',
    });
  }

  // ===================== DỮ LIỆU BỘ THẺ =====================
  const PALETTE = ['var(--mint)', 'var(--sky)', 'var(--sun)', 'var(--coral)', 'var(--lav)', 'var(--pri)'];
  const KIND_COLOR = { hira: 'var(--pri)', kata: 'var(--sky)', vocab: 'var(--mint)', kanji: 'var(--sun)' };
  const unit = id => (SJ.UNITS || []).find(u => u.id === id);
  const topicInfo = t => { const u = unit('vocab'); const l = u && u.lessons.find(x => x.topic === t); return l ? { title: l.title, sub: l.sub, icon: l.icon } : { title: 'Từ vựng', sub: '', icon: 'speech' }; };

  function allDecks() {
    const K = SJ.KANA, L = [];
    const ks = arr => (arr || []).map(o => o.k);
    L.push({ id: 'hira', sec: 'kana', title: 'Hiragana cơ bản', sub: 'ひらがな', art: 'あ', sticker: 'sakura', color: 'var(--pri)', keys: ks(K.hira.basic) });
    L.push({ id: 'kata', sec: 'kana', title: 'Katakana cơ bản', sub: 'カタカナ', art: 'ア', sticker: 'bolt', color: 'var(--sky)', keys: ks(K.kata.basic) });
    L.push({ id: 'hira-daku', sec: 'kana', title: 'Hiragana có dấu', sub: 'が ざ だ ば ぱ', art: 'が', sticker: 'sparkle', color: 'var(--lav)', keys: ks(K.hira.daku) });
    L.push({ id: 'kata-daku', sec: 'kana', title: 'Katakana có dấu', sub: 'ガ ザ ダ バ パ', art: 'パ', sticker: 'star_s', color: 'var(--coral)', keys: ks(K.kata.daku) });
    Object.keys(SJ.VOCAB || {}).forEach((t, i) => {
      const ti = topicInfo(t), list = SJ.VOCAB[t];
      L.push({ id: 'v-' + t, sec: 'vocab', title: ti.title, sub: ti.sub, icon: ti.icon || list[0].e, color: PALETTE[i % PALETTE.length], keys: list.map(o => o.key) });
    });
    const ku = unit('kanji');
    const kl = ku ? ku.lessons.filter(l => l.type === 'kanji' && l.items && l.items.length) : [];
    if (kl.length) kl.forEach((l, i) => L.push({ id: 'kanji-' + l.id, sec: 'kanji', title: l.sub, sub: l.title, art: l.items[0], sticker: l.icon, color: ['var(--sun)', 'var(--coral)', 'var(--pri)', 'var(--lav)'][i % 4], keys: l.items.filter(k => SJ.KANJI_MAP[k]).map(k => 'j:' + k) }));
    else if (SJ.KANJI) L.push({ id: 'kanji', sec: 'kanji', title: 'Kanji nhập môn', sub: 'かんじ', art: '日', sticker: 'torii', color: 'var(--sun)', keys: SJ.KANJI.map(o => o.key) });
    return L;
  }
  const dueDeck = () => ({ id: 'due', sec: 'due', title: 'Thẻ đến hạn ôn', sub: 'ふくしゅう', sticker: 'alarm', color: 'var(--lav)', keys: SJ.store.dueKeys().filter(k => !!makeCard(k)) });
  const findDeck = id => (id === 'due' ? dueDeck() : allDecks().find(d => d.id === id));
  /** "đã nhớ" = thẻ đã nằm trong hộp SRS từ ô 1 trở lên (bấm "Chưa nhớ" là về lại ô 0) */
  const isKnown = (S, k) => !!(S.srs[k] && S.srs[k].box >= 1);

  // ===================== NỘI DUNG MỘT THẺ =====================
  const fsFor = s => { const n = Array.from(s).length; return n <= 1 ? 136 : Math.min(108, Math.floor(272 / n)); };
  const mark = (word, ch) => { const i = word.indexOf(ch); return i < 0 ? esc(word) : esc(word.slice(0, i)) + `<em>${esc(ch)}</em>` + esc(word.slice(i + ch.length)); };
  const exBox = (pic, jpHtml, sub, say) => `<div class="fc-ex">${pic && SJ.hasIcon(pic) ? `<span class="fc-ex-pic">${I(pic, 38)}</span>` : `<span class="fc-ex-pic">${I('book', 34)}</span>`}
    <span class="fc-ex-txt"><small class="fc-ex-k">Ví dụ</small><b class="jp">${jpHtml}</b><small>${sub}</small></span>${U().sayBtn(say, 18)}</div>`;

  function makeCard(key) {
    if (!key) return null;
    if (key.startsWith('v:')) {
      const o = SJ.VOCAB_MAP && SJ.VOCAB_MAP[key]; if (!o) return null;
      const ti = topicInfo(o.topic), word = U().baseText(o.jp), say = U().reading(o.jp);
      return {
        key, kind: 'vocab', label: ti.title, mark: ti.icon, color: KIND_COLOR.vocab, say, chip: word, sub: o.vi,
        front: `<div class="fc-big kana" lang="ja" style="font-size:${fsFor(word)}px">${esc(word)}</div>`,
        back: `<div class="fc-pic">${SJ.hasIcon(o.e) ? I(o.e, 82) : `<span class="kana">${esc(word.slice(0, 1))}</span>`}</div>
          <div class="fc-word kana" lang="ja">${esc(word)}</div><div class="fc-romaji sm">${esc(o.r)}</div><div class="fc-mean">${esc(o.vi)}</div>`,
      };
    }
    if (key.startsWith('j:')) {
      const o = SJ.KANJI_MAP && SJ.KANJI_MAP[key.slice(2)]; if (!o) return null;
      const ex = o.ex && o.ex[0];
      return {
        key, kind: 'kanji', label: 'Kanji', mark: 'torii', color: KIND_COLOR.kanji, say: ex ? ex.kana : o.k, chip: o.k, sub: o.hv,
        front: `<div class="fc-big kana" lang="ja" style="font-size:132px">${esc(o.k)}</div>`,
        back: `<div class="fc-pair"><span class="fc-mini kana" lang="ja">${esc(o.k)}</span><span class="hv-badge">${esc(o.hv)}</span></div>
          <div class="fc-mean">${esc(o.m)}</div>
          <div class="fc-onkun"><span><i>On</i><b class="jp">${esc(o.on)}</b></span><span><i>Kun</i><b class="jp">${esc(o.kun)}</b></span></div>
          ${o.tip ? `<div class="fc-tip">${G('bulb', 18)}<span>${esc(o.tip)}</span></div>` : ''}
          ${ex ? exBox('', esc(ex.jp), `${esc(ex.kana)} · ${esc(ex.vi)}`, ex.kana) : ''}`,
      };
    }
    const o = SJ.KANA_MAP && SJ.KANA_MAP[key]; if (!o) return null;
    const kata = o.script === 'kata', w = o.w;
    return {
      key, kind: 'kana', label: kata ? 'Katakana' : 'Hiragana', mark: kata ? 'bolt' : 'sakura', color: kata ? KIND_COLOR.kata : KIND_COLOR.hira, say: o.k, chip: o.k, sub: o.r,
      front: `<div class="fc-big kana" lang="ja" style="font-size:${fsFor(o.k)}px">${esc(o.k)}</div>`,
      back: `<div class="fc-pair"><span class="fc-mini kana" lang="ja">${esc(o.k)}</span><span class="fc-arrow">${G('arrow_r', 22)}</span><span class="fc-romaji">${esc(o.r)}</span></div>
        <div class="fc-read">Đọc gần giống: <b>“${esc(o.v || o.r)}”</b></div>
        ${o.m ? `<div class="fc-tip">${G('bulb', 18)}<span>${esc(o.m)}</span></div>` : ''}
        ${w ? exBox(w.e, mark(w.jp, o.k), `${esc(w.r)} · ${esc(w.vi)}`, w.jp) : ''}`,
    };
  }

  // ===================== TUỲ CHỌN =====================
  const OPT_KEY = { shuffle: 'cardsShuffle', onlyNew: 'cardsOnlyNew', size: 'cardsSize' };
  function getOpts() {
    const st = SJ.store.get().settings;
    return { shuffle: st.cardsShuffle !== false, onlyNew: !!st.cardsOnlyNew, size: st.cardsSize == null ? 20 : +st.cardsSize || 0 };
  }
  const setOpt = (k, v) => SJ.store.setSetting(OPT_KEY[k], v);

  /** x: { keys: danh sách cố định, all: bỏ qua lọc "chưa nhớ", exclude: Set khoá bỏ qua } */
  function buildQueue(deck, o, x) {
    x = x || {};
    const S = SJ.store.get();
    let keys = (x.keys || deck.keys).slice();
    if (x.exclude) keys = keys.filter(k => !x.exclude.has(k));
    if (!x.keys && !x.all && o.onlyNew && deck.id !== 'due') keys = keys.filter(k => !isKnown(S, k));
    let cards = keys.map(makeCard).filter(Boolean);
    if (o.shuffle) cards = U().shuffle(cards);
    if (!x.keys && o.size && cards.length > o.size) cards = cards.slice(0, o.size);
    return cards;
  }

  // ===================== TRANG CHỌN BỘ =====================
  function picker(ctx) {
    ctx.kill(); ctx.keyFn = null;
    document.body.classList.remove('focus-mode');
    const S = SJ.store.get(), o = getOpts();
    const known = k => isKnown(S, k);
    const decks = allDecks(), due = dueDeck(), dueN = due.keys.length, srsAll = SJ.store.srsKeys().length;
    const dueSize = () => { const z = getOpts().size; return z ? Math.min(dueN, z) : dueN; };

    const tile = (d, i) => {
      const n = d.keys.length, k = d.keys.filter(known).length, pct = n ? Math.round(k / n * 100) : 0, all = n > 0 && k === n;
      const art = d.icon ? `<span class="fd-ico">${I(d.icon, 54)}</span>` : `<span class="fd-glyph kana" lang="ja">${esc(d.art)}</span>`;
      return `<a class="fc-deck card${all ? ' done' : ''}" href="#/cards/${d.id}" style="--tc:${d.color};--i:${i}" aria-label="${esc(d.title)}: ${n} thẻ, đã nhớ ${k}">
        <span class="fd-art" aria-hidden="true"><span class="fd-sheet s3"></span><span class="fd-sheet s2"></span><span class="fd-sheet s1">${art}</span>
          ${d.sticker ? `<span class="fd-sticker">${I(d.sticker, 34)}</span>` : ''}${all ? '<span class="fd-hanko jp">済</span>' : ''}</span>
        <span class="fd-body"><b class="fd-title">${esc(d.title)}</b>${d.sub ? `<span class="fd-sub jp">${esc(d.sub)}</span>` : ''}
          <span class="fd-meta"><span>${n} thẻ</span><span class="fd-known${k ? '' : ' none'}">${k ? `${G('check', 14)}${k} đã nhớ` : 'Chưa học'}</span></span>
          <span class="fd-bar"><i style="width:${pct}%"></i></span></span></a>`;
    };
    const sec = (key, icon, title) => {
      const list = decks.filter(d => d.sec === key);
      if (!list.length) return '';
      const cards = list.reduce((a, d) => a + d.keys.length, 0);
      return `<div class="section-label">${I(icon, 30)} ${title} <small>${list.length} bộ · ${cards} thẻ</small></div><div class="fc-grid">${list.map(tile).join('')}</div>`;
    };

    ctx.root.innerHTML = `<div class="page fc-page">
      <div class="page-head"><div class="ph-icon">${I('cards', 52)}</div><div><h1>Thẻ ghi nhớ</h1><p>Lật thẻ để xem cách đọc và nghĩa. Vuốt sang <b>phải</b> nếu đã nhớ, sang <b>trái</b> nếu chưa — Mochi sẽ nhắc bạn ôn lại đúng lúc!</p></div></div>
      <div class="fc-due card${dueN ? '' : ' calm'}">
        <span class="fc-due-art" aria-hidden="true">${I('fc_due', 78)}${dueN ? `<i class="fc-due-dot">${dueN > 99 ? '99+' : dueN}</i>` : ''}</span>
        <span class="fc-due-txt grow"><span class="fc-kicker">${G('sparkle', 15)} Ôn tập thông minh</span><b>Thẻ đến hạn ôn</b>
          <span class="fc-due-p">${dueN ? `Có <b>${dueN}</b> thẻ đang chờ bạn. Ôn đúng lúc sắp quên là nhớ lâu nhất!` : srsAll ? `Hôm nay không còn thẻ nào đến hạn. Giỏi quá đi! Hộp ôn tập đang giữ <b>${srsAll}</b> thẻ cho bạn.` : 'Lật thử một bộ bên dưới — thẻ sẽ tự vào hộp ôn tập và quay lại đúng lúc bạn sắp quên.'}</span></span>
        ${dueN ? `<a class="btn btn-lg fc-due-go" href="#/cards/due">${G('play', 20)} Ôn <span data-due-n>${dueSize()}</span> thẻ</a>` : `<span class="fc-due-mochi">${U().mascot('love', 74, 'bob')}</span>`}
      </div>
      <div class="fc-opts card">
        <label class="switch fc-opt"><input type="checkbox" data-opt="shuffle"${o.shuffle ? ' checked' : ''}><i></i><span>${G('fc_shuffle', 20)} Trộn thẻ</span></label>
        <label class="switch fc-opt"><input type="checkbox" data-opt="onlyNew"${o.onlyNew ? ' checked' : ''}><i></i><span>${G('refresh', 20)} Chỉ thẻ chưa nhớ</span></label>
        <span class="fc-size"><span class="fc-size-l">Mỗi lượt</span><span class="seg" role="group" aria-label="Số thẻ mỗi lượt">${[[10, '10 thẻ'], [20, '20 thẻ'], [0, 'Tất cả']].map(s => `<button type="button" data-size="${s[0]}" class="${o.size === s[0] ? 'active' : ''}" aria-pressed="${o.size === s[0]}">${s[1]}</button>`).join('')}</span></span>
      </div>
      ${sec('kana', 'kana', 'Bảng chữ cái')}
      ${sec('vocab', 'speech', 'Từ vựng theo chủ đề')}
      ${sec('kanji', 'torii', 'Kanji nhập môn')}
    </div>`;

    const root = ctx.root;
    root.querySelectorAll('[data-opt]').forEach(inp => ctx.on(inp, 'change', () => { setOpt(inp.dataset.opt, inp.checked); SJ.audio.sfx('tap'); }));
    const seg = root.querySelector('.fc-size .seg');
    ctx.on(seg, 'click', e => {
      const b = e.target.closest('[data-size]'); if (!b) return;
      seg.querySelectorAll('button').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
      setOpt('size', +b.dataset.size); SJ.audio.sfx('tap');
      const dn = root.querySelector('[data-due-n]'); if (dn) dn.textContent = dueSize();
    });
  }

  // ===================== HỌC THẺ =====================
  function study(ctx, deck, x) {
    x = x || {};
    if (deck.id === 'due' && !x.keys) deck = dueDeck();
    const o = getOpts();
    const cards = buildQueue(deck, o, x);
    if (!cards.length) return empty(ctx, deck);
    ctx.kill();
    ctx.deck = deck;
    document.body.classList.add('focus-mode');
    window.scrollTo(0, 0);

    const total = cards.length, res = { ok: [], no: [] }, root = ctx.root;
    let idx = 0, flipped = false, spoke = false, drag = null, streak = 0, hotDir = '', mood = 'normal', touched = false;
    const tintFor = c => (deck.id === 'due' ? c.color : deck.color);

    root.innerHTML = `<div class="fc-session" style="--tc:${deck.color}">
      <div class="fc-top">
        <button class="icon-btn" data-quit aria-label="Dừng lại" title="Dừng lại (Esc)">${G('batsu', 20)}</button>
        <div class="fc-topmid grow"><div class="fc-deckname">${I(deck.sticker || deck.icon || 'cards', 26)}<span>${esc(deck.title)}</span></div>${U().bar(0, 'fc-prog')}</div>
        <div class="g-score fc-count" aria-live="polite"><b data-n>1</b><span>/${total}</span></div>
      </div>
      <div class="fc-stage">
        <div class="fc-stack" data-stack>
          <div class="fc-buddy" data-buddy>${U().mascot('normal', 74)}</div>
          <div class="fc-bubble" data-bubble></div>
        </div>
      </div>
      <div class="fc-actions">
        <button class="btn btn-lg fc-act fc-no" data-act="no" data-nosfx aria-label="Chưa nhớ (phím mũi tên trái)">${G('batsu', 22)}<span>Chưa nhớ</span><i class="fc-n">0</i></button>
        <button class="btn btn-lg btn-white fc-act fc-flipbtn" data-act="flip" data-nosfx aria-label="Lật thẻ (phím cách)" aria-pressed="false">${G('fc_flip', 24)}<span class="fc-flip-l">Lật thẻ</span></button>
        <button class="btn btn-lg fc-act fc-ok" data-act="ok" data-nosfx aria-label="Đã nhớ (phím mũi tên phải)">${G('check', 22)}<span>Đã nhớ</span><i class="fc-n">0</i></button>
      </div>
      <div class="fc-keys"><span><kbd>Space</kbd> lật thẻ</span><span><kbd>←</kbd> chưa nhớ</span><span><kbd>→</kbd> đã nhớ</span><span><kbd>Enter</kbd> lật / đã nhớ</span></div>
      <div class="fc-touchhint"><span>${G('arrow_l', 16)} Vuốt trái: chưa nhớ</span><i></i><span>Vuốt phải: đã nhớ ${G('arrow_r', 16)}</span></div>
    </div>`;

    const stack = root.querySelector('[data-stack]'), buddy = root.querySelector('[data-buddy]'), bubble = root.querySelector('[data-bubble]');
    const barI = root.querySelector('.fc-prog > i'), nEl = root.querySelector('[data-n]'), flipBtn = root.querySelector('[data-act="flip"]');
    const actBtn = d => root.querySelector(`[data-act="${d}"]`);
    const topEl = () => stack.querySelector('.fc-card[data-pos="0"]');

    function cardEl(i, pos) {
      const c = cards[i], el = document.createElement('div');
      el.className = 'fc-card';
      el.dataset.pos = pos;
      el.setAttribute('role', 'group');
      el.setAttribute('aria-label', `Thẻ ${i + 1} trên ${total}`);
      el.style.setProperty('--tc', tintFor(c));
      el.innerHTML = `<div class="fc-lift"><div class="fc-flip">
          <div class="fc-face fc-front">
            <div class="fc-head"><span class="fc-label">${esc(c.label)}</span><span class="fc-mark">${I(c.mark, 30)}</span></div>
            <div class="fc-main">${c.front}</div>
            <div class="fc-hint">${G('fc_flip', 16)}<span class="t-touch">Chạm để lật thẻ</span><span class="t-mouse">Bấm hoặc nhấn Space để lật</span></div>
          </div>
          <div class="fc-face fc-back">
            <div class="fc-head"><span class="fc-label">${esc(c.label)}</span>${U().sayBtn(c.say, 20)}</div>
            <div class="fc-main">${c.back}</div>
          </div></div></div>
        <span class="fc-glow ok"></span><span class="fc-glow no"></span>
        <div class="fc-stamp ok" aria-hidden="true"><b class="jp">おぼえた</b><span>Đã nhớ</span></div>
        <div class="fc-stamp no" aria-hidden="true"><b class="jp">もういちど</b><span>Chưa nhớ</span></div>`;
      return el;
    }
    /** Mặt sau quá dài so với thẻ (màn hình thấp) → thu gọn dần cho vừa, không bao giờ bị cắt chữ */
    function fit(el) {
      const m = el.querySelector('.fc-back .fc-main');
      if (!m) return;
      el.classList.remove('dense', 'denser');
      const over = () => m.scrollHeight > m.clientHeight + 1;
      if (over()) { el.classList.add('dense'); if (over()) el.classList.add('denser'); }
    }
    for (let i = 0; i < Math.min(3, total); i++) { const el = cardEl(i, i); stack.appendChild(el); fit(el); }
    if (!reduced()) { stack.classList.add('deal'); ctx.later(() => stack.classList.remove('deal'), 1100); }
    let fitT = 0;
    const refit = () => { if (ctx.deck === deck) stack.querySelectorAll('.fc-card:not(.leaving)').forEach(fit); };
    ctx.on(window, 'resize', () => { clearTimeout(fitT); fitT = ctx.later(refit, 160); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);

    // ---------- Mochi nấp sau thẻ ----------
    function setMood(m) {
      if (m === mood) return;
      mood = m; buddy.innerHTML = U().mascot(m, 74);
    }
    function hop() { buddy.classList.remove('hop'); void buddy.offsetWidth; buddy.classList.add('hop'); }
    let bubbleT = 0;
    function say(html) {
      bubble.innerHTML = html; bubble.classList.add('show');
      clearTimeout(bubbleT); bubbleT = ctx.later(() => bubble.classList.remove('show'), 1700);
    }
    let moodT = 0;
    function react(ok) {
      setMood(ok ? (streak >= 3 ? 'cheer' : 'happy') : 'wink'); hop();
      clearTimeout(moodT); moodT = ctx.later(() => setMood('normal'), 1300);
      if (ok && [3, 5, 10, 15, 20, 30, 40, 50].includes(streak)) say(`<b class="jp">すごい！</b> ${streak} thẻ liền!`);
      else if (!ok && res.no.length === 1) say('Không sao, ôn lại là nhớ!');
    }

    // ---------- HUD ----------
    function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    function hud() {
      barI.style.width = (idx / total * 100) + '%';
      nEl.textContent = Math.min(idx + 1, total);
      ['ok', 'no'].forEach(d => {
        const b = actBtn(d).querySelector('.fc-n'), n = String(res[d].length);
        if (b.textContent !== n) { b.textContent = n; b.classList.toggle('on', res[d].length > 0); bump(b); }
      });
    }
    function setHot(d) {
      if (d === hotDir) return;
      hotDir = d;
      actBtn('ok').classList.toggle('hot', d === 'ok');
      actBtn('no').classList.toggle('hot', d === 'no');
      setMood(d === 'ok' ? 'love' : d === 'no' ? 'think' : 'normal');
    }
    function flipState() {
      flipBtn.setAttribute('aria-pressed', flipped);
      flipBtn.classList.toggle('on', flipped);
      root.querySelector('.fc-session').classList.toggle('is-back', flipped);
    }

    // ---------- lật thẻ ----------
    function flip(force) {
      const el = topEl(); if (!el) return;
      nudgeOff();
      const v = force == null ? !flipped : !!force;
      if (v === flipped) return;
      flipped = v;
      el.classList.toggle('flipped', flipped);
      const lift = el.querySelector('.fc-lift');
      lift.classList.remove('lift'); void lift.offsetWidth; lift.classList.add('lift');
      SJ.audio.sfx('flip');
      if (flipped && !spoke) { spoke = true; const c = cards[idx]; ctx.later(() => { if (topEl() === el && flipped) SJ.audio.speak(c.say); }, 340); }
      flipState();
    }

    // ---------- kéo / vuốt ----------
    function paint(el, dx, dy, top) {
      const rot = reduced() ? 0 : clamp(dx * 0.075, -18, 18) * (top ? 1 : -1);
      el.style.transform = `translate3d(${dx.toFixed(1)}px, ${(dy * 0.42).toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      const p = clamp(dx / 120, -1, 1);
      el.style.setProperty('--ok', Math.max(0, p).toFixed(3));
      el.style.setProperty('--no', Math.max(0, -p).toFixed(3));
      const nx = stack.querySelector('.fc-card[data-pos="1"]');
      if (nx) { nx.classList.add('rise'); nx.style.setProperty('--q', Math.min(1, Math.abs(dx) / 170).toFixed(3)); }
      setHot(p > 0.4 ? 'ok' : p < -0.4 ? 'no' : '');
    }
    function settle(el) {
      el.style.transform = ''; el.style.removeProperty('--ok'); el.style.removeProperty('--no');
      const nx = stack.querySelector('.fc-card[data-pos="1"]');
      if (nx) { nx.classList.remove('rise'); nx.style.removeProperty('--q'); }
      setHot('');
    }
    function down(e) {
      const el = e.target.closest('.fc-card');
      if (!el || el.dataset.pos !== '0' || drag) return;
      if (e.target.closest('button, a, input')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      nudgeOff();
      const r = el.getBoundingClientRect(), t = performance.now();
      drag = { el, id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, moved: false, top: e.clientY - r.top < r.height / 2, w: r.width, pts: [[e.clientX, t]] };
      try { el.setPointerCapture(e.pointerId); } catch (er) { /* không sao */ }
    }
    function move(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.moved) { if (Math.hypot(dx, dy) < 7) return; drag.moved = true; drag.el.classList.add('grab'); }
      e.preventDefault();
      drag.dx = dx; drag.dy = dy;
      const t = performance.now();
      drag.pts.push([e.clientX, t]);
      while (drag.pts.length > 2 && t - drag.pts[0][1] > 110) drag.pts.shift();
      paint(drag.el, dx, dy, drag.top);
    }
    function up(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null;
      d.el.classList.remove('grab');
      if (e.type === 'pointercancel') { if (d.moved) settle(d.el); return; }
      if (!d.moved) { flip(); return; }
      const a = d.pts[0], b = d.pts[d.pts.length - 1];
      const vx = (b[0] - a[0]) / Math.max(16, b[1] - a[1]);           // px / ms
      const far = Math.abs(d.dx) > Math.min(130, d.w * 0.34);
      const fling = Math.abs(vx) > 0.5 && Math.abs(d.dx) > 28 && Math.sign(vx) === Math.sign(d.dx);
      if (far || fling) commit(d.dx > 0 ? 'ok' : 'no', d, vx);
      else { settle(d.el); SJ.audio.sfx('pop'); }
    }
    ctx.on(stack, 'pointerdown', down);
    ctx.on(stack, 'pointermove', move);
    ctx.on(stack, 'pointerup', up);
    ctx.on(stack, 'pointercancel', up);
    ctx.on(stack, 'lostpointercapture', e => { if (drag && e.pointerId === drag.id) up({ type: 'pointercancel', pointerId: e.pointerId }); });
    ctx.on(stack, 'dragstart', e => e.preventDefault());

    // ---------- bay đi ----------
    function fly(el, dir, d, vx) {
      if (reduced()) { el.remove(); return; }
      const s = dir === 'ok' ? 1 : -1;
      const ex = s * (Math.max(window.innerWidth, 480) / 2 + el.offsetWidth * 1.05);
      let frames, dur;
      if (d) {
        const v = Math.min(2.5, Math.abs(vx || 0)), ey = d.dy * 0.42;
        const rot = s * (22 + v * 6) * (d.top ? 1 : -1);
        dur = Math.round(470 - v * 80);
        frames = [
          { transform: el.style.transform || 'none', opacity: 1, easing: 'cubic-bezier(.22,.7,.35,1)' },
          { transform: `translate3d(${(ex * 0.72).toFixed(0)}px, ${(ey + 36).toFixed(0)}px, 0) rotate(${(rot * 0.85).toFixed(1)}deg)`, opacity: 1, offset: 0.7 },
          { transform: `translate3d(${ex.toFixed(0)}px, ${(ey + 60).toFixed(0)}px, 0) rotate(${rot.toFixed(1)}deg)`, opacity: 0 },
        ];
      } else {
        // bấm nút / phím: lấy đà lùi nhẹ (như lò xo) rồi bay vèo
        dur = 640;
        frames = [
          { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', offset: 0, easing: 'cubic-bezier(.35,0,.3,1)' },
          { transform: `translate3d(${-s * 20}px, -10px, 0) rotate(${-s * 4.5}deg) scale(1.03)`, offset: 0.24, easing: 'cubic-bezier(.5,0,.7,.4)' },
          { transform: `translate3d(${(ex * 0.75).toFixed(0)}px, 34px, 0) rotate(${s * 20}deg) scale(1)`, opacity: 1, offset: 0.8 },
          { transform: `translate3d(${ex.toFixed(0)}px, 54px, 0) rotate(${s * 27}deg) scale(1)`, opacity: 0 },
        ];
      }
      const an = el.animate(frames, { duration: dur, fill: 'forwards' });
      ctx.anims.add(an);
      const done = () => { ctx.anims.delete(an); el.remove(); };
      an.onfinish = done; an.oncancel = done;
    }
    function promote() {
      stack.querySelectorAll('.fc-card:not(.leaving)').forEach(el => {
        el.classList.remove('rise', 'nudge'); el.style.removeProperty('--q');
        el.dataset.pos = String(+el.dataset.pos - 1);
      });
      const ni = idx + 2;
      if (ni < total) {
        const el = cardEl(ni, 2);
        el.classList.add('enter'); stack.appendChild(el); fit(el);
        void el.offsetWidth; requestAnimationFrame(() => el.classList.remove('enter'));
      }
      flipped = false; spoke = false; flipState();
    }
    function grade(c, dir) {
      const ok = dir === 'ok';
      try { SJ.store.gradeSRS(c.key, ok ? 2 : 0); SJ.store.rec(c.key, ok); } catch (e) { console.error(e); }
      res[dir].push(c); ctx.unpaid++;
      streak = ok ? streak + 1 : 0;
      SJ.audio.sfx('stamp');
      ctx.later(() => SJ.audio.sfx(ok ? 'ok' : 'pop'), 120);
      react(ok);
    }
    function commit(dir, d, vx) {
      const el = topEl(); if (!el) return;
      touched = true; nudgeOff();
      const c = cards[idx];
      el.dataset.pos = 'out';
      el.classList.add('leaving', 'to-' + dir);
      el.style.setProperty('--ok', dir === 'ok' ? 1 : 0);
      el.style.setProperty('--no', dir === 'no' ? 1 : 0);
      fly(el, dir, d, vx);
      grade(c, dir);
      idx++;
      setHot('');
      promote();
      hud();
      if (idx >= total) ctx.later(() => finish(false), reduced() ? 300 : 720);
    }
    const act = d => { if (drag || idx >= total) return; if (d === 'flip') flip(); else commit(d); };
    ctx.on(root.querySelector('.fc-actions'), 'click', e => { const b = e.target.closest('[data-act]'); if (!b) return; b.blur(); act(b.dataset.act); });
    ctx.on(root.querySelector('[data-quit]'), 'click', () => quit());

    function quit() { if (res.ok.length + res.no.length) finish(true); else location.hash = '#/cards'; }
    function finish(partial) {
      if (ctx.deck !== deck) return;
      ctx.deck = null;
      summary(ctx, deck, res, partial, x);
    }

    ctx.keyFn = e => {
      if (document.querySelector('.modal-back')) return;
      if (e.target && e.target.closest && e.target.closest('input, textarea, select')) return;
      const k = e.key;
      if (k === ' ' || k === 'Spacebar') { e.preventDefault(); if (!e.repeat) act('flip'); }
      else if (k === 'ArrowLeft') { e.preventDefault(); if (!e.repeat) act('no'); }
      else if (k === 'ArrowRight') { e.preventDefault(); if (!e.repeat) act('ok'); }
      else if (k === 'Enter') { e.preventDefault(); if (!e.repeat) { if (flipped) act('ok'); else flip(true); } }
      else if (k === 'Escape') { e.preventDefault(); quit(); }
    };

    // ---------- gợi ý vuốt (chỉ lần đầu mỗi phiên) ----------
    function nudgeOff() { touched = true; const el = stack.querySelector('.fc-card.nudge'); if (el) el.classList.remove('nudge'); }
    let seenNudge = false; try { seenNudge = sessionStorage.getItem('sj_cards_nudge') === '1'; } catch (e) { /* bỏ qua */ }
    if (!seenNudge && !reduced()) ctx.later(() => {
      const el = topEl();
      if (touched || !el || idx) return;
      el.classList.add('nudge');
      try { sessionStorage.setItem('sj_cards_nudge', '1'); } catch (e) { /* bỏ qua */ }
      ctx.later(() => el.classList.remove('nudge'), 1700);
    }, 1500);
    hud(); flipState();
  }

  // ---------- không còn thẻ để học ----------
  function empty(ctx, deck) {
    ctx.kill(); ctx.keyFn = null;
    document.body.classList.remove('focus-mode');
    const due = deck.id === 'due';
    ctx.root.innerHTML = `<div class="page-narrow fc-empty pop-in">
      <div class="card card-pad center">${U().mascot('love', 118, 'bob')}
        <h2>${due ? 'Không còn thẻ nào đến hạn!' : deck.keys.length ? 'Bạn đã nhớ hết bộ này rồi!' : 'Bộ thẻ này đang trống'}</h2>
        <p class="muted bold">${due ? 'Mochi sẽ báo khi có thẻ cần ôn lại. Trong lúc chờ, lật thử một bộ mới nha.' : deck.keys.length ? 'Bạn đang bật “Chỉ thẻ chưa nhớ”. Muốn ôn lại tất cả thì bấm nút dưới đây nha.' : 'Chọn một bộ khác để học tiếp nhé.'}</p>
        <div class="fc-res-btns">${!due && deck.keys.length ? `<button class="btn btn-lg" data-again="all">${G('refresh', 22)} Học lại cả bộ</button>` : ''}<a class="btn btn-lg btn-white" href="#/cards">${G('arrow_l', 22)} Chọn bộ khác</a></div>
      </div></div>`;
    const b = ctx.root.querySelector('[data-again]');
    if (b) ctx.on(b, 'click', () => study(ctx, deck, { all: true }));
    ctx.keyFn = e => { if (e.key === 'Enter' && !document.querySelector('.modal-back')) { e.preventDefault(); (b || ctx.root.querySelector('.fc-res-btns .btn')).click(); } };
  }

  // ===================== TỔNG KẾT =====================
  function summary(ctx, deck, res, partial, x) {
    ctx.kill(); ctx.keyFn = null;
    document.body.classList.remove('focus-mode');
    window.scrollTo(0, 0);
    const okN = res.ok.length, noN = res.no.length, done = okN + noN;
    const pct = done ? Math.round(okN / done * 100) : 0;
    const xp = done ? done + (done >= 5 && !noN ? 5 : 0) : 0;
    ctx.unpaid = 0;
    if (xp) SJ.store.addXP(xp);
    const studied = res.ok.concat(res.no).map(c => c.key);
    studied.forEach(k => ctx.seen.add(k));
    const o = getOpts();
    const fresh = deck.id === 'due' ? dueDeck() : (findDeck(deck.id) || deck);
    const nextN = x.keys ? 0 : buildQueue(fresh, o, { exclude: ctx.seen }).length;

    const mood = pct >= 80 ? 'cheer' : pct >= 50 ? 'happy' : 'love';
    const title = pct === 100 ? 'Hoàn hảo! Nhớ hết luôn!' : pct >= 80 ? 'Xuất sắc quá đi!' : pct >= 50 ? 'Làm tốt lắm!' : 'Cố lên, bạn đang tiến bộ!';
    const msg = (partial ? 'Dừng giữa chừng cũng không sao! ' : '') + (noN
      ? `Mochi đã ghi lại <b>${noN}</b> thẻ chưa nhớ — chúng sẽ quay lại sớm để bạn ôn nha.`
      : 'Các thẻ đã nhớ sẽ hẹn gặp lại bạn sau vài ngày để nhớ thật lâu.');
    const btns = [];
    if (noN) btns.push(['no', `Học lại ${noN} thẻ chưa nhớ`, 'refresh']);
    if (nextN) btns.push(['next', `Học tiếp ${nextN} thẻ khác`, 'arrow_r']);
    if (btns.length < 2) btns.push(['same', 'Học lại lượt này', 'fc_shuffle']);

    ctx.root.innerHTML = `<div class="page-narrow result fc-result pop-in">
      <div class="result-mochi">${U().mascot(mood, 140, 'jump')}${pct >= 80 && done >= 3 ? `<span class="fc-hanamaru" title="はなまる — giỏi lắm!">${I('hanamaru', 96)}</span>` : ''}</div>
      <div class="fc-res-deck">${I(deck.sticker || deck.icon || 'cards', 26)}<span>${esc(deck.title)}</span></div>
      <h1>${title}</h1>
      <p class="fc-res-sub">${msg}</p>
      <div class="result-stats">
        <div class="rs card mint">${I('maru', 30)}<b data-count="${okN}">${okN}</b><span>đã nhớ</span></div>
        <div class="rs card pink">${I('refresh', 30)}<b data-count="${noN}">${noN}</b><span>chưa nhớ</span></div>
        <div class="rs card sun">${I('star', 30)}<b data-count="${xp}" data-pre="+">+${xp}</b><span>XP nhận được</span></div>
        <div class="rs card sky">${I('fire', 30)}<b>${SJ.store.streakNow()}</b><span>ngày liên tiếp</span></div>
      </div>
      ${noN ? `<div class="fc-missed card"><div class="card-title">${I('target', 28)} Thẻ cần ôn thêm <small>bấm để nghe</small></div>
        <div class="chips">${res.no.map(c => `<button class="chip-btn fc-mchip" data-say="${esc(c.say)}"><span class="kana" lang="ja">${esc(c.chip)}</span>${c.sub ? `<small>${esc(c.sub)}</small>` : ''}</button>`).join('')}</div></div>` : ''}
      <div class="fc-res-btns">${btns.map((b, i) => `<button class="btn btn-lg${i ? ' btn-white' : ''}" data-again="${b[0]}">${G(b[2], 22)} ${b[1]}</button>`).join('')}
        <a class="btn btn-lg btn-white" href="#/cards">${G('arrow_l', 22)} Chọn bộ khác</a></div>
    </div>`;
    U().countUp(ctx.root);
    ctx.root.querySelectorAll('[data-again]').forEach(b => ctx.on(b, 'click', () => {
      const t = b.dataset.again;
      if (t === 'no') study(ctx, deck, { keys: res.no.map(c => c.key) });
      else if (t === 'next') study(ctx, fresh, { exclude: ctx.seen });
      else study(ctx, deck, { keys: studied });
    }));
    ctx.keyFn = e => {
      if (e.key !== 'Enter' || document.querySelector('.modal-back')) return;
      if (e.target && e.target.closest && e.target.closest('button, a')) return;
      e.preventDefault(); const b = ctx.root.querySelector('[data-again]'); if (b) b.click();
    };
    if (done >= 3 && pct >= 50) { SJ.audio.sfx('win'); ctx.later(() => U().confetti(pct === 100 ? 110 : 64), 250); }
    else if (done) SJ.audio.sfx('sparkle');
  }

  // ===================== MỞ TRANG =====================
  function open(root, arg) {
    const ctx = {
      root, keyFn: null, deck: null, unpaid: 0, seen: new Set(), anims: new Set(), timers: new Set(), offs: [],
      on(el, type, fn, opt) { if (!el) return; el.addEventListener(type, fn, opt); ctx.offs.push(() => el.removeEventListener(type, fn, opt)); },
      later(fn, ms) { const t = setTimeout(() => { ctx.timers.delete(t); fn(); }, ms); ctx.timers.add(t); return t; },
      kill() {
        ctx.timers.forEach(t => clearTimeout(t)); ctx.timers.clear();
        Array.from(ctx.anims).forEach(a => { try { a.cancel(); } catch (e) { /* bỏ qua */ } }); ctx.anims.clear();
        ctx.offs.splice(0).forEach(f => f());
      },
    };
    const onKey = e => ctx.keyFn && ctx.keyFn(e);
    document.addEventListener('keydown', onKey);
    if (arg) {
      const d = findDeck(arg);
      if (d) study(ctx, d);
      else { picker(ctx); U().toast(`${I('question', 28)} Không tìm thấy bộ thẻ này, bạn chọn bộ khác nha.`, 2800); }
    } else picker(ctx);
    return {
      destroy() {
        ctx.kill(); ctx.keyFn = null; ctx.deck = null;
        document.removeEventListener('keydown', onKey);
        document.body.classList.remove('focus-mode');
        // rời trang giữa chừng: các thẻ đã chấm vẫn được 1 XP mỗi thẻ
        if (ctx.unpaid) { const n = ctx.unpaid; ctx.unpaid = 0; try { SJ.store.addXP(n); } catch (e) { console.error(e); } }
      },
    };
  }

  SJ.cards = { open, decks: allDecks, card: makeCard };
})(window.SJ);
