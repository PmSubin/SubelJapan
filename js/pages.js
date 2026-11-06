/* SubelJapan — Các trang: Trang chủ, Lộ trình, Bảng chữ, Luyện viết, Trò chơi, Ôn tập, Hồ sơ */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);

  // ===================== TRANG CHỦ =====================
  function home(root) {
    const S = SJ.store.get();
    const lv = SJ.store.level();
    const g = U().greeting();
    const next = SJ.store.nextLesson();
    const nextUnit = SJ.UNITS.find(u => u.id === next.unit);
    const due = SJ.store.dueKeys().length;
    const todayXP = SJ.store.todayXP();
    const streak = SJ.store.streakNow();
    const mastered = SJ.KANA_ALL.filter(o => o.group !== 'small' && SJ.store.mastery(o.k) === 2).length;
    const totalKana = SJ.KANA_ALL.filter(o => o.group !== 'small').length;
    const done = Object.values(S.lessons).filter(l => l.done).length;
    const dayIdx = Math.floor(Date.now() / 86400000);
    const wotd = SJ.VOCAB_ALL[dayIdx % SJ.VOCAB_ALL.length];
    const kotd = SJ.KANJI[(dayIdx * 7) % SJ.KANJI.length];
    let fact = dayIdx % SJ.FACTS.length;
    const name = S.name ? esc(S.name) : 'bạn';
    const week = SJ.store.lastDays(7);
    const wd = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    root.innerHTML = `<div class="container home">
      <section class="hero paper pop-in"><span class="tape tape-l"></span><span class="tape tape-r"></span>
        <div class="hero-text">
          <div class="hero-hello">${I(g.icon, 28)} <span class="jp" data-say="${g.jp}">${g.jp}</span>, ${name}!</div>
          <h1 class="hero-title title-hand">Học tiếng Nhật <span class="hl">dễ như ăn mochi</span></h1>
          <div class="hero-jp jp">にほんご、いっしょに はじめよう！</div>
          <p class="hero-sub">${done ? `Bạn đã hoàn thành <b>${done}</b> bài học. Tiếp tục giữ lửa nào!` : 'Từ con số 0 đến đọc – viết được tiếng Nhật, từng bước nhỏ xinh mỗi ngày. Không áp lực, không nản lòng!'}</p>
          <div class="hero-cta">
            <a class="btn btn-lg" href="#/lesson/${next.id}">${I(done ? 'play' : 'rocket', 24)} ${done ? 'Học tiếp' : 'Bắt đầu học'}: ${esc(next.title)}</a>
            <a class="btn btn-lg btn-paper" href="#/practice">${I('infinity', 26)} Luyện vô tận</a>
          </div>
          <div class="hero-next muted small">${I(nextUnit.icon, 18)} ${nextUnit.title} · ${esc(next.sub || '')}</div>
        </div>
        <div class="hero-mochi">${U().mascot(streak ? 'happy' : 'wink', 190, 'bob')}<div class="hero-kana jp k1">あ</div><div class="hero-kana jp k2">ア</div><div class="hero-kana jp k3">日</div></div>
      </section>

      <section class="stats-row">
        <a class="stat note n-yel" href="#/profile"><div class="stat-ico">${I(lv.icon, 52)}</div><div><div class="stat-val">Cấp ${lv.level}</div><div class="stat-lbl">${lv.title}</div><div class="xpbar"><div class="xpbar-fill" style="width:${lv.pct}%"></div></div><div class="stat-lbl small">${S.xp} XP${lv.next ? ` · còn ${lv.toNext} XP` : ''}</div></div></a>
        <div class="stat note n-pink streak-card ${SJ.store.doneToday() ? 'lit' : ''}"><div class="stat-ico flame">${I('fire', 52)}</div><div><div class="stat-val">${streak} ngày</div><div class="stat-lbl">${SJ.store.doneToday() ? 'Hôm nay đã giữ chuỗi!' : streak ? 'Học ngay để giữ chuỗi!' : 'Bắt đầu chuỗi hôm nay!'}</div>
          <div class="week">${week.map(d => `<span class="wday ${d.xp ? 'on' : ''} ${d.key === SJ.store.dayKey() ? 'today' : ''}" title="${d.key}: ${d.xp} XP"><i>${d.xp ? '<span class="jp">済</span>' : ''}</i>${wd[d.d.getDay()]}</span>`).join('')}</div></div></div>
        <div class="stat note n-blue">${U().ring(todayXP / S.goal * 100, 68, `<b>${Math.min(todayXP, 999)}</b><small>/${S.goal}</small>`)}<div><div class="stat-val">Mục tiêu ngày</div><div class="stat-lbl">${todayXP >= S.goal ? 'Hoàn thành rồi!' : `Còn ${S.goal - todayXP} XP nữa thôi`}</div></div></div>
        <div class="stat note n-green"><div class="stat-ico">${I('kana', 52)}</div><div><div class="stat-val">${mastered}/${totalKana}</div><div class="stat-lbl">chữ Kana đã thuộc</div><a class="small link" href="#/chart">Xem bảng chữ ${I('arrow_r', 14)}</a></div></div>
      </section>

      <section class="quick-grid">
        ${[['#/learn', 'learn', 'Bài học', `${SJ.LESSONS.length} bài từ dễ đến khó`, 'q-pink'], ['#/write', 'pencil', 'Luyện viết', 'Tô chữ, máy tự chấm điểm', 'q-yel'], ['#/review', 'brain', 'Ôn tập', due ? `<span class="badge-num">${due}</span> thẻ cần ôn` : 'Thẻ nhớ thông minh', 'q-blue'],
          ['#/games', 'game', 'Trò chơi', '6 game siêu vui', 'q-green'], ['#/practice', 'infinity', 'Luyện vô tận', `Chuỗi kỷ lục: ${S.bestChain}`, 'q-lav'], ['#/chart', 'kana', 'Bảng chữ cái', 'a・i・u・e・o', 'q-peach']]
          .map((q, i) => `<a class="quick sticker ${q[4]}" href="${q[0]}" style="--tilt:${[-1.5, 1, -.5, 1.4, -1, .8][i]}deg"><span class="q-ico">${I(q[1], 56)}</span><b>${q[2]}</b><small>${q[3]}</small></a>`).join('')}
      </section>

      <section class="grid-2">
        <div class="paper card-pad wotd"><span class="tape"></span>
          <div class="card-label">${I('star', 20)} Từ của ngày</div>
          <div class="wotd-body" data-say="${esc(wotd.jp)}"><span class="wotd-pic">${I(wotd.e, 64)}</span><div><div class="jp wotd-jp">${esc(wotd.jp)}</div><div class="muted">${esc(wotd.r)} — <b>${esc(wotd.vi)}</b></div></div><span class="say-btn">${I('speaker', 22)}</span></div>
          <div class="card-label mt">${I('torii', 20)} Kanji của ngày</div>
          <div class="wotd-body"><span class="jp kotd">${kotd.k}</span><div><div class="hv-badge sm">${kotd.hv}</div><div class="muted">${esc(kotd.m)} · ${esc(kotd.tip)}</div></div><a class="say-btn" href="#/write/${encodeURIComponent(kotd.k)}" title="Luyện viết">${I('pencil', 22)}</a></div>
        </div>
        <div class="paper card-pad fact">
          <div class="card-label">${I('bulb', 22)} Bạn có biết?</div>
          <div class="fact-row">${U().mascot('wow', 74)}<p data-fact>${esc(SJ.FACTS[fact])}</p></div>
          <button class="btn btn-sm btn-ghost" data-more>${I('refresh', 18)} Mẹo khác</button>
        </div>
      </section>

      <section class="paper card-pad roadmap"><span class="tape tape-l"></span>
        <h2 class="section-title title-hand">${I('map', 30)} Lộ trình cho người mới bắt đầu</h2>
        <div class="road">${SJ.UNITS.map((u, i) => {
          const c = u.lessons.filter(l => S.lessons[l.id] && S.lessons[l.id].done).length;
          const full = c === u.lessons.length;
          return `<a class="road-step ${full ? 'done' : ''}" href="#/learn" style="--uc:${u.color}"><span class="rs-num">${i + 1}</span>${I(u.icon, 44)}<b>${u.title}</b><small>${c}/${u.lessons.length} bài</small>${full ? U().hanko('済', 'xs') : ''}</a>`;
        }).join(`<span class="road-arrow">${I('arrow_r', 22)}</span>`)}</div>
        <p class="muted small center">Mẹo: mỗi ngày 1 bài + 1 game + ôn thẻ nhớ ≈ 15 phút. Chỉ khoảng 2 tuần là bạn đọc được Hiragana rồi!</p>
      </section>
    </div>`;
    root.querySelector('[data-more]').onclick = () => { fact = (fact + 1) % SJ.FACTS.length; const p = root.querySelector('[data-fact]'); p.textContent = SJ.FACTS[fact]; p.classList.remove('pop-in'); void p.offsetWidth; p.classList.add('pop-in'); SJ.audio.sfx('sparkle'); };
    if (!S.name) setTimeout(onboarding, 400);
  }

  function onboarding() {
    if (SJ.store.get().name || document.querySelector('.onboard')) return;
    let goal = 30;
    const m = U().modal(`<div class="onboard center">
      ${U().mascot('love', 120, 'bob')}
      <h2 class="title-hand"><span class="jp">ようこそ！</span> Chào mừng đến <span class="hl">SubelJapan</span></h2>
      <p>Mình là <b>mèo Mochi</b> — bạn đồng hành học tiếng Nhật của bạn! Cho Mochi biết tên bạn nha?</p>
      <input class="input" id="ob-name" maxlength="30" placeholder="Tên của bạn…" autocomplete="off">
      <div class="gs-label">Mục tiêu mỗi ngày</div>
      <div class="chips center-row" data-goal>${[[10, 'turtle', 'Nhẹ nhàng'], [20, 'rabbit', 'Vừa phải'], [30, 'fox', 'Chăm chỉ'], [50, 'dragon', 'Siêu cấp']].map(g => `<button class="chip-btn goal-chip ${g[0] === 30 ? 'active' : ''}" data-val="${g[0]}">${I(g[1], 30)}<span>${g[2]}<small> ${g[0]} XP</small></span></button>`).join('')}</div>
      <button class="btn btn-lg btn-block mt" id="ob-go">Bắt đầu hành trình! ${I('rocket', 24)}</button>
    </div>`, { cls: 'modal-sm', noClose: true });
    SJ.audio.sfx('meow2');
    m.el.querySelector('[data-goal]').onclick = e => { const b = e.target.closest('.chip-btn'); if (!b) return; goal = +b.dataset.val; m.el.querySelectorAll('[data-goal] .chip-btn').forEach(x => x.classList.toggle('active', x === b)); SJ.audio.sfx('tap'); };
    const go = () => {
      const n = m.el.querySelector('#ob-name').value.trim() || 'Bạn nhỏ';
      SJ.store.set('goal', goal); SJ.store.set('name', n.slice(0, 30));
      m.close(); SJ.audio.sfx('win'); U().confetti();
      U().toast(`<span class="jp">はじめまして</span>, ${esc(n)}! Cùng học nào`);
      SJ.app.refresh();
    };
    m.el.querySelector('#ob-go').onclick = go;
    m.el.querySelector('#ob-name').onkeydown = e => { if (e.key === 'Enter') go(); };
    setTimeout(() => m.el.querySelector('#ob-name').focus(), 300);
  }

  // ===================== LỘ TRÌNH =====================
  function learn(root) {
    const S = SJ.store.get();
    const next = SJ.store.nextLesson();
    root.innerHTML = `<div class="container-sm learn">
      <div class="page-head center"><div class="ph-icon float">${I('learn', 80)}</div><h1 class="title-hand">Lộ trình học</h1><p class="muted">Học từ trên xuống: bắt đầu với hàng <b>a・i・u・e・o</b>, rồi <b>ka・ki・ku・ke・ko</b>… cứ thế đi tiếp. Mỗi bài chỉ 3–5 phút! Bài nào cũng mở sẵn để học lại.</p></div>
      ${SJ.UNITS.map(u => {
        const c = u.lessons.filter(l => S.lessons[l.id] && S.lessons[l.id].done).length;
        return `<section class="unit" style="--uc:${u.color}">
        <div class="unit-head"><div class="uh-icon">${I(u.icon, 54)}</div><div class="grow"><h2 class="title-hand">${u.title} <span class="jp uh-jp">${u.jp}</span></h2><p>${u.desc}</p>
          <div class="unit-prog"><div style="width:${c / u.lessons.length * 100}%"></div></div></div><div class="uh-count">${c}/${u.lessons.length}</div></div>
        <div class="path">${u.lessons.map((l, i) => {
          const st = S.lessons[l.id]; const isNext = l === next;
          const off = Math.round(Math.sin(i * 1.15) * 70);
          const inner = l.type === 'kana' ? `<span class="jp">${l.items[0]}</span>` : l.type === 'kanji' ? `<span class="jp">${l.items[0]}</span>` : I(l.icon || 'book', 40);
          return `<a class="node-wrap" href="#/lesson/${l.id}" style="--off:${off}px">
            ${isNext ? '<span class="node-start">BẮT ĐẦU</span>' : ''}
            <span class="node ${st && st.done ? 'done' : ''} ${isNext ? 'next' : ''} ${l.type === 'test' ? 'boss' : ''}">${l.type === 'test' ? I('crown', 40) : inner}${st && st.done ? U().hanko(st.stars >= 3 ? '満' : '済', 'node-hanko') : ''}</span>
            <span class="node-label"><b>${esc(l.title)}</b><small>${esc(l.sub || '')}</small>${st && st.done ? U().stars(st.stars, 3, 16) : ''}</span></a>`;
        }).join('')}</div></section>`;
      }).join('')}
      <div class="center muted pad">Học xong hết? Hãy luyện vô tận và ôn thẻ nhớ mỗi ngày để không quên nha!</div>
    </div>`;
    const nx = root.querySelector('.node.next');
    if (nx && Object.keys(S.lessons).length) setTimeout(() => nx.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
  }

  // ===================== BẢNG CHỮ CÁI (a・i・u・e・o) =====================
  function chart(root) {
    let script = 'hira', hide = false;
    const conv = c => script === 'kata' ? SJ.toKata(c) : c;
    function cell(k) {
      if (!k) return '<span class="kcell empty"></span>';
      const o = SJ.KANA_MAP[k]; if (!o) return '<span class="kcell empty"></span>';
      const m = SJ.store.mastery(o.k);
      return `<button class="kcell m${m}" data-nosfx="1" data-k="${o.k}"><span class="kc-k jp">${o.k}</span><span class="kc-r">${o.r}</span></button>`;
    }
    const table = (cols, rows, cls) => `<div class="gojuon ${cls || ''}" style="--cols:${cols.length}">
      <div class="gj-row gj-head"><span></span>${cols.map(c => `<span>${c}</span>`).join('')}</div>
      ${rows.map(r => `<div class="gj-row"><span class="gj-lab"><b>${r[0] || '–'}</b>${r[2] ? `<small class="jp">${r[2]}</small>` : ''}</span>${r[1].map(cell).join('')}</div>`).join('')}</div>`;
    function draw() {
      const K = SJ.KANA[script];
      const gyo = c => (c && c !== '_') ? conv(c) + (script === 'kata' ? '' : '') : '';
      const basicRows = SJ.GOJUON.basic.map(r => [r[0], Array.from(r[1]).map(c => c === '_' ? null : conv(c)), gyo(r[1][0]) + '行']);
      const dakuRows = SJ.GOJUON.daku.map(r => [r[0], Array.from(r[1]).map(c => conv(c)), conv(r[1][0]) + '行']);
      const yoonRows = SJ.GOJUON.yoon.map(r => [r[0], r[1].map(conv)]);
      root.innerHTML = `<div class="container-sm chart">
        <div class="page-head center"><div class="ph-icon float">${I('kana', 80)}</div><h1 class="title-hand">Bảng chữ cái</h1><p class="muted">Cột ngang là nguyên âm <b>a・i・u・e・o</b>, hàng dọc là phụ âm <b>k・s・t・n…</b> Bấm vào chữ để nghe & xem mẹo nhớ. Màu càng đậm là bạn càng thuộc!</p></div>
        <div class="tabs center-row"><button class="tab ${script === 'hira' ? 'active' : ''}" data-s="hira">${I('sakura', 22)} Hiragana</button><button class="tab ${script === 'kata' ? 'active' : ''}" data-s="kata">${I('bolt', 22)} Katakana</button></div>
        <div class="row center-row gap-s wrap chart-tools"><label class="switch-label"><input type="checkbox" data-hide ${hide ? 'checked' : ''}> <span>Ẩn romaji (tự kiểm tra)</span></label>
          <span class="legend"><i class="m0"></i>Chưa học <i class="m1"></i>Đang học <i class="m2"></i>Đã thuộc</span></div>
        <div class="${hide ? 'hide-romaji' : ''}">
        <section class="paper chart-sec"><span class="tape"></span><h3 class="chart-h title-hand">Chữ cơ bản — 五十音 <small>(${K.basic.length} chữ)</small></h3>${table(SJ.GOJUON.cols, basicRows)}</section>
        <section class="paper chart-sec"><h3 class="chart-h title-hand">Âm đục ゛ & bán đục ゜ <small>(${K.daku.length} chữ)</small></h3>${table(SJ.GOJUON.cols, dakuRows)}</section>
        <section class="paper chart-sec"><span class="tape tape-r"></span><h3 class="chart-h title-hand">Âm ghép <small>(${K.yoon.length} âm)</small></h3>${table(SJ.GOJUON.yoonCols, yoonRows, 'yoon')}</section>
        <section class="paper chart-sec"><h3 class="chart-h title-hand">Chữ nhỏ <small>(${K.small.length} chữ)</small></h3><div class="kana-flow">${K.small.map(o => cell(o.k)).join('')}</div></section>
        ${K.ext ? `<section class="paper chart-sec"><h3 class="chart-h title-hand">Âm ngoại lai <small>(${K.ext.length} âm)</small></h3><div class="kana-flow">${K.ext.map(o => cell(o.k)).join('')}</div></section>` : ''}
        </div></div>`;
    }
    root.onclick = e => {
      const t = e.target.closest('[data-s]'); if (t) { script = t.dataset.s; draw(); return; }
      const c = e.target.closest('.kcell[data-k]'); if (c) { const o = SJ.KANA_MAP[c.dataset.k]; SJ.audio.speak(o.k); detail(o); }
    };
    root.onchange = e => { if (e.target.matches('[data-hide]')) { hide = e.target.checked; draw(); } };
    draw();
  }
  function detail(o) {
    const w = o.w;
    const m = U().modal(`<div class="kdetail center">
      <div class="kd-top"><div class="genko" data-say="${o.k}"><span class="jp">${o.k}</span></div><div class="stroke-box sm" data-sv></div></div>
      <div class="lc-romaji">${o.r}</div>
      <div class="info-row center-row"><span class="tag tag-pink">${I('talk', 16)} Đọc gần giống</span><b>${esc(o.v || o.r)}</b></div>
      <div class="mnemo">${I('bulb', 26)}<span>${esc(o.m)}</span></div>
      ${w ? `<div class="example" data-say="${esc(w.jp)}">${w.e && SJ.hasIcon(w.e) ? `<span class="ex-pic">${I(w.e, 40)}</span>` : ''}<span class="jp ex-jp">${esc(w.jp)}</span><span class="ex-ro">${esc(w.r)}</span><span class="ex-vi">${esc(w.vi)}</span><span class="ex-say">${I('speaker', 20)}</span></div>` : ''}
      <div class="row center-row gap-s mt"><button class="btn btn-paper" data-say="${o.k}">${I('speaker', 20)} Nghe</button><a class="btn btn-yel" href="#/write/${encodeURIComponent(o.k)}">${I('pencil', 20)} Luyện viết</a></div>
    </div>`, { cls: 'modal-sm' });
    SJ.writing.strokeView(m.el.querySelector('[data-sv]'), o.k);
    m.el.querySelector('a').addEventListener('click', () => m.close());
  }

  // ===================== LUYỆN VIẾT =====================
  function write(root, arg) {
    const lists = {
      hira: SJ.KANA.hira.basic.concat(SJ.KANA.hira.daku, SJ.KANA.hira.small).map(o => ({ k: o.k, r: o.r, sub: o.v })),
      kata: SJ.KANA.kata.basic.concat(SJ.KANA.kata.daku, SJ.KANA.kata.small).map(o => ({ k: o.k, r: o.r, sub: o.v })),
      kanji: SJ.KANJI.map(o => ({ k: o.k, r: o.hv, sub: o.m })),
    };
    let tab = 'hira', idx = 0;
    if (arg) for (const t of Object.keys(lists)) { const i = lists[t].findIndex(x => x.k === arg); if (i >= 0) { tab = t; idx = i; break; } }
    let sv = null, pad = null, autoNext = false, combo = 0;
    function draw() {
      const L = lists[tab], it = L[idx];
      sv && sv.stop(); pad && pad.destroy();
      root.innerHTML = `<div class="container write">
        <div class="page-head center"><div class="ph-icon float">${I('write', 80)}</div><h1 class="title-hand">Luyện viết</h1><p class="muted">Xem thứ tự nét → tô theo chữ mờ → bấm <b>Chấm điểm</b>. Viết tay là cách nhớ chữ lâu nhất đó!</p></div>
        <div class="tabs center-row">${[['hira', 'sakura', 'Hiragana'], ['kata', 'bolt', 'Katakana'], ['kanji', 'torii', 'Kanji']].map(t => `<button class="tab ${tab === t[0] ? 'active' : ''}" data-tab="${t[0]}">${I(t[1], 22)} ${t[2]}</button>`).join('')}</div>
        <div class="char-picker">${L.map((x, i) => `<button class="cp-item jp m${SJ.store.mastery(tab === 'kanji' ? 'j:' + x.k : x.k)} ${i === idx ? 'active' : ''}" data-nosfx="1" data-i="${i}">${x.k}</button>`).join('')}</div>
        <div class="write-main paper"><span class="tape tape-l"></span><span class="tape tape-r"></span>
          <div class="wm-head"><button class="icon-btn" data-nav="-1" aria-label="Chữ trước">${I('arrow_l', 24)}</button>
            <div class="wm-title"><span class="jp wm-k">${it.k}</span><span class="wm-r">${esc(it.r)}</span><span class="muted">${esc(it.sub || '')}</span>${U().sayBtn(it.k)}</div>
            <button class="icon-btn" data-nav="1" aria-label="Chữ sau">${I('arrow_r', 24)}</button></div>
          <div class="write-panels">
            <div class="panel"><div class="mini-label">① Thứ tự nét <span data-count></span></div><div class="stroke-box" data-sv></div>
              <div class="row center-row gap-s"><button class="btn btn-sm btn-ghost" data-a="replay">${I('play', 18)} Xem lại</button><button class="btn btn-sm btn-ghost" data-a="slow">${I('slow', 22)} Chậm</button></div></div>
            <div class="panel"><div class="mini-label">② Tô theo chữ mờ</div><div data-pad></div>
              <div class="pad-tools"><button class="btn btn-sm btn-paper" data-a="undo">${I('undo', 18)} Hoàn tác</button><button class="btn btn-sm btn-paper" data-a="clear">${I('eraser', 18)} Xoá</button><button class="btn btn-sm btn-paper" data-a="guide">${I('eye', 18)} Chữ mờ</button><button class="btn btn-green" data-a="check">${I('check', 20)} Chấm điểm</button></div>
              <div class="score-line" data-score></div></div>
          </div>
          <div class="write-foot"><label class="switch-label"><input type="checkbox" data-auto ${autoNext ? 'checked' : ''}> <span>Tự sang chữ tiếp khi đạt ≥ 70 điểm (viết liên tục)</span></label>
            ${combo ? `<span class="combo-pill">${I('chain', 18)} Chuỗi viết đẹp: ${combo}</span>` : ''}
            <a class="btn btn-sm btn-lav" href="#/practice/write">${I('infinity', 20)} Viết từ trí nhớ</a></div>
        </div></div>`;
      sv = SJ.writing.strokeView(root.querySelector('[data-sv]'), it.k);
      sv.ready.then(() => { const c = root.querySelector('[data-count]'); if (c && sv.count()) c.textContent = `· ${sv.count()} nét`; });
      pad = SJ.writing.tracePad(root.querySelector('[data-pad]'), it.k, { size: 320 });
      const act = root.querySelector('.cp-item.active'); act && act.scrollIntoView({ block: 'nearest', inline: 'center' });
      history.replaceState(null, '', '#/write/' + encodeURIComponent(it.k));
    }
    root.onclick = e => {
      const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; idx = 0; draw(); return; }
      const c = e.target.closest('.cp-item'); if (c) { idx = +c.dataset.i; SJ.audio.sfx('tap'); draw(); SJ.audio.speak(lists[tab][idx].k); return; }
      const n = e.target.closest('[data-nav]'); if (n) { const L = lists[tab]; idx = (idx + (+n.dataset.nav) + L.length) % L.length; draw(); return; }
      const a = e.target.closest('[data-a]'); if (!a) return;
      const it = lists[tab][idx];
      switch (a.dataset.a) {
        case 'replay': sv.play(); break;
        case 'slow': sv.stop(); sv = SJ.writing.strokeView(root.querySelector('[data-sv]'), it.k, { speed: 0.45 }); break;
        case 'undo': pad.undo(); break;
        case 'clear': pad.clear(); root.querySelector('[data-score]').innerHTML = ''; break;
        case 'guide': pad.toggleGuide(); break;
        case 'check': {
          const r = SJ.lesson.showScore(pad, root.querySelector('[data-score]'), it.k);
          if (!r) break;
          combo = r.score >= 70 ? combo + 1 : 0;
          const foot = root.querySelector('.write-foot'); let pill = foot.querySelector('.combo-pill');
          if (combo) {
            if (!pill) { pill = document.createElement('span'); pill.className = 'combo-pill'; foot.insertBefore(pill, foot.lastElementChild); }
            pill.innerHTML = `${I('chain', 18)} Chuỗi viết đẹp: ${combo}`;
            if (combo % 5 === 0) { SJ.audio.sfx('combo'); U().toast(`${I('chain', 22)} ${combo} chữ đẹp liên tiếp! Quá đỉnh`); }
          } else if (pill) pill.remove();
          if (autoNext && r.score >= 70) setTimeout(() => { if (lists[tab][idx] === it) { idx = (idx + 1) % lists[tab].length; draw(); SJ.audio.speak(lists[tab][idx].k); } }, 1300);
          break;
        }
      }
    };
    root.onchange = e => { if (e.target.matches('[data-auto]')) autoNext = e.target.checked; };
    draw();
    return { destroy() { sv && sv.stop(); pad && pad.destroy(); } };
  }

  // ===================== TRÒ CHƠI =====================
  function games(root) {
    root.innerHTML = `<div class="container-sm">
      <div class="page-head center"><div class="ph-icon float">${I('game', 80)}</div><h1 class="title-hand">Trò chơi</h1><p class="muted">Vừa chơi vừa học — chơi càng nhiều nhớ càng lâu! Mỗi lượt chơi đều được cộng XP.</p></div>
      <div class="game-grid">${SJ.games.list.map((g, i) => `<a class="game-card sticker" href="#/game/${g.id}" style="--gc:${g.color};--tilt:${[-1, 1.2, -.6, .8, -1.3, .5][i]}deg">
        <span class="gc-icon">${I(g.icon, 64)}</span><b>${g.name}</b><small>${g.desc}</small>${SJ.games.bestLabel(g.id) ? `<span class="gc-best">${I('trophy', 16)} ${SJ.games.bestLabel(g.id)}</span>` : ''}</a>`).join('')}
        <a class="game-card sticker wide" href="#/practice" style="--gc:#cfbcee;--tilt:-.4deg"><span class="gc-icon">${I('infinity', 64)}</span><b>Luyện tập vô tận</b><small>Không giới hạn câu hỏi, nối chuỗi đúng liên tiếp thật dài!</small><span class="gc-best">${I('chain', 16)} Chuỗi ${SJ.store.get().bestChain}</span></a>
      </div></div>`;
  }

  // ===================== ÔN TẬP (THẺ NHỚ) =====================
  function cardData(key) {
    if (key.startsWith('v:')) { const o = SJ.VOCAB_MAP[key]; return o && { front: `<div class="fc-word jp">${esc(o.jp)}</div>`, say: o.jp, back: `<div class="fc-pic">${I(o.e, 76)}</div><div class="fc-r">${esc(o.r)}</div><div class="fc-m">${esc(o.vi)}</div>` }; }
    if (key.startsWith('j:')) { const o = SJ.KANJI_MAP[key.slice(2)]; return o && { front: `<div class="fc-big jp">${o.k}</div>`, say: o.ex[0].kana, back: `<div class="hv-badge">${o.hv}</div><div class="fc-m">${esc(o.m)}</div><div class="fc-r jp">${o.on} · ${o.kun}</div><div class="muted small">${esc(o.ex[0].jp)} (${o.ex[0].kana}) = ${esc(o.ex[0].vi)}</div>` }; }
    const o = SJ.KANA_MAP[key]; return o && { front: `<div class="fc-big jp">${o.k}</div>`, say: o.k, back: `<div class="fc-r big">${o.r}</div><div class="muted">Đọc: ${esc(o.v || o.r)}</div><div class="mnemo">${I('bulb', 22)}<span>${esc(o.m)}</span></div>` };
  }
  function review(root) {
    let queue = [], i = 0, done = 0, keyFn = null;
    const onKey = e => keyFn && keyFn(e);
    document.addEventListener('keydown', onKey);
    function menu() {
      keyFn = null;
      const due = SJ.store.dueKeys(), all = SJ.store.srsKeys();
      const boxes = [0, 0, 0, 0];
      all.forEach(k => { const b = SJ.store.get().srs[k].box; boxes[b <= 0 ? 0 : b <= 2 ? 1 : b <= 4 ? 2 : 3]++; });
      root.innerHTML = `<div class="container-sm review">
        <div class="page-head center"><div class="ph-icon float">${I('brain', 80)}</div><h1 class="title-hand">Ôn tập thông minh</h1><p class="muted">Thẻ nhớ tự lặp lại đúng lúc bạn sắp quên (lặp lại ngắt quãng). Ôn mỗi ngày là không bao giờ quên!</p></div>
        ${all.length ? `<div class="paper card-pad review-summary"><span class="tape"></span>
          ${U().ring(all.length ? (all.length - due.length) / all.length * 100 : 0, 96, `<b>${due.length}</b><small>cần ôn</small>`)}
          <div class="boxes">${[['seed', 'Mới', boxes[0]], ['sprout', 'Đang nhớ', boxes[1]], ['tulip', 'Khá chắc', boxes[2]], ['sakura', 'Thuộc lòng', boxes[3]]].map(b => `<div class="box-stat">${I(b[0], 34)}<b>${b[2]}</b><span>${b[1]}</span></div>`).join('')}</div></div>
          <div class="row gap wrap mt">${due.length ? `<button class="btn btn-lg grow" data-start="due">${I('refresh', 22)} Ôn ${due.length} thẻ đến hạn</button>` : `<div class="paper card-pad center grow">${U().mascot('love', 80)}<p><b>Hôm nay ôn xong hết rồi!</b> Giỏi quá đi!</p></div>`}
          <button class="btn btn-lg btn-paper grow" data-start="free">${I('dice', 22)} Ôn tự do (${Math.min(20, all.length)} thẻ)</button>
          <a class="btn btn-lg btn-lav grow" href="#/practice">${I('infinity', 24)} Luyện vô tận</a></div>`
          : `<div class="paper card-pad center pad-xl">${U().mascot('wink', 110)}<h3 class="title-hand">Chưa có thẻ nào cả</h3><p class="muted">Học xong một bài, các chữ trong bài sẽ tự động thành thẻ nhớ ở đây nha!</p><a class="btn" href="#/lesson/${SJ.store.nextLesson().id}">${I('learn', 22)} Học bài đầu tiên</a></div>`}
      </div>`;
      root.querySelectorAll('[data-start]').forEach(b => b.onclick = () => {
        queue = b.dataset.start === 'due' ? due.slice(0, 30) : U().sample(all, 20);
        i = 0; done = 0; show();
      });
    }
    function show() {
      if (i >= queue.length) return finish();
      const key = queue[i], d = cardData(key);
      if (!d) { i++; return show(); }
      let flipped = false;
      root.innerHTML = `<div class="container-sm review">
        <div class="game-top"><button class="icon-btn" data-quit>${I('batsu', 20)}</button><div class="lesson-prog"><div class="lesson-prog-fill" style="width:${i / queue.length * 100}%"></div></div><div class="g-score">${i + 1}/${queue.length}</div></div>
        <div class="flash" data-card><div class="flash-inner"><div class="flash-front paper">${d.front}<div class="muted small">Bấm để lật thẻ</div></div><div class="flash-back paper">${d.front}${d.back}</div></div></div>
        <div class="grade-btns hidden" data-grades>
          <button class="btn btn-red" data-g="0">${I('dizzy', 30)} Quên<small>gặp lại ngay</small></button>
          <button class="btn btn-yel" data-g="1">${I('sorry', 30)} Mang máng<small>sớm thôi</small></button>
          <button class="btn btn-green" data-g="2">${I('cool', 30)} Nhớ rồi<small>lâu sau</small></button></div>
        <div class="center muted small">Phím tắt: Space = lật · 1 2 3 = chấm</div></div>`;
      const card = root.querySelector('[data-card]'), grades = root.querySelector('[data-grades]');
      const flip = () => { if (flipped) return; flipped = true; card.classList.add('flipped'); grades.classList.remove('hidden'); SJ.audio.sfx('flip'); setTimeout(() => SJ.audio.speak(d.say), 250); };
      card.onclick = flip;
      root.querySelector('[data-quit]').onclick = () => finish();
      grades.onclick = e => { const b = e.target.closest('[data-g]'); if (b) grade(+b.dataset.g); };
      function grade(g) {
        if (!flipped) return;
        SJ.store.gradeSRS(key, g); SJ.store.rec(key, g > 0);
        if (g === 0) queue.push(key);
        done++; SJ.store.addXP(1); SJ.audio.sfx(g === 2 ? 'ok' : g === 1 ? 'tap' : 'bad');
        i++; show();
      }
      keyFn = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } else if (/^[123]$/.test(e.key)) grade(+e.key - 1); };
    }
    function finish() {
      keyFn = null;
      root.innerHTML = `<div class="container-sm result pop-in"><div class="result-mochi">${U().mascot('love', 130, 'jump')}</div><h1 class="title-hand">Ôn tập xong!</h1>
        <div class="result-stats"><div class="rs paper">${I('cards', 28)}<b>${done}</b><span>thẻ đã ôn</span></div><div class="rs paper">${I('star', 28)}<b>+${done}</b><span>XP</span></div><div class="rs paper">${I('fire', 28)}<b>${SJ.store.streakNow()}</b><span>ngày liên tiếp</span></div></div>
        <div class="row gap wrap"><button class="btn btn-paper grow" data-back>${I('brain', 22)} Về Ôn tập</button><a class="btn btn-lg grow" href="#/practice">${I('infinity', 24)} Luyện tiếp không nghỉ</a></div></div>`;
      root.querySelector('[data-back]').onclick = menu;
      if (done >= 5) { SJ.audio.sfx('win'); U().confetti(50); }
    }
    menu();
    return { destroy() { document.removeEventListener('keydown', onKey); } };
  }

  // ===================== HỒ SƠ =====================
  function profile(root) {
    const S = SJ.store.get(), lv = SJ.store.level();
    const days = SJ.store.lastDays(28);
    const done = Object.values(S.lessons).filter(l => l.done).length;
    const starsTotal = Object.values(S.lessons).reduce((a, l) => a + (l.stars || 0), 0);
    const themes = [['sakura', 'sakura', 'Anh đào'], ['matcha', 'tea', 'Matcha'], ['sora', 'cloudsun', 'Bầu trời'], ['yoru', 'moon', 'Ban đêm']];
    root.innerHTML = `<div class="container-sm profile">
      <div class="paper card-pad profile-head"><span class="tape tape-l"></span>
        <div class="ph-avatar">${U().mascot('happy', 110, 'bob')}<span class="ph-lv">${I(lv.icon, 40)}</span></div>
        <div class="grow"><h1 class="title-hand">${esc(S.name || 'Bạn nhỏ')} <button class="link-btn" data-edit aria-label="Đổi tên">${I('pencil', 22)}</button></h1>
          <div class="muted">Cấp ${lv.level} · ${lv.title}</div>
          <div class="xpbar big"><div class="xpbar-fill" style="width:${lv.pct}%"></div></div>
          <div class="small muted">${S.xp} XP ${lv.next ? `· còn ${lv.toNext} XP để lên cấp ${lv.level + 1}` : '· Cấp tối đa!'}</div>
          <div class="jp name-kata-sm" title="Tên của bạn bằng Katakana">${esc(U().nameToKata(S.name || ''))}</div></div>
      </div>
      <div class="stats-grid">
        ${[['fire', SJ.store.streakNow(), 'ngày liên tiếp'], ['trophy', S.streak.best, 'chuỗi ngày dài nhất'], ['learn', done, 'bài đã học'], ['star', starsTotal, 'ngôi sao'], ['pencil', S.written, 'chữ đã viết'], ['brain', S.reviewed, 'thẻ đã ôn'], ['chain', S.bestChain, 'chuỗi đúng kỷ lục'], ['game', S.plays, 'lượt chơi game']].map((s, i) => `<div class="mini-stat note n-${['pink', 'yel', 'blue', 'green'][i % 4]}">${I(s[0], 40)}<b>${s[1]}</b><small>${s[2]}</small></div>`).join('')}
      </div>
      <div class="paper card-pad"><h2 class="section-title title-hand">${I('calendar', 30)} Lịch chuỗi 4 tuần</h2>
        <div class="cal">${days.map(d => `<span class="cal-d ${d.xp ? 'on' : ''} ${d.xp >= S.goal ? 'goal' : ''} ${d.key === SJ.store.dayKey() ? 'today' : ''}" title="${d.key}: ${d.xp} XP"><small>${d.d.getDate()}</small>${d.xp ? U().hanko(d.xp >= S.goal ? '満' : '済', 'cal-hanko') : ''}</span>`).join('')}</div>
        <div class="muted small">Con dấu <span class="jp">済</span> = có học · <span class="jp">満</span> = đạt mục tiêu ${S.goal} XP</div></div>
      <div class="paper card-pad"><h2 class="section-title title-hand">${I('crown', 30)} Huy hiệu (${Object.keys(S.badges).length}/${SJ.store.BADGES.length})</h2>
        <div class="badge-grid">${SJ.store.BADGES.map(b => `<div class="badge ${S.badges[b.id] ? '' : 'locked'}" title="${esc(b.desc)}"><span class="b-ico">${I(S.badges[b.id] ? b.icon : 'lock', 48)}</span><b>${b.name}</b><small>${b.desc}</small></div>`).join('')}</div></div>
      <div class="paper card-pad"><h2 class="section-title title-hand">${I('nametag', 30)} Tên tiếng Nhật của bạn</h2>${SJ.lesson.nameWidget()}</div>
      <div class="paper card-pad settings"><h2 class="section-title title-hand">${I('gear', 30)} Cài đặt</h2>
        <div class="setting-row"><span>${I('speaker', 22)} Âm thanh hiệu ứng</span><label class="switch"><input type="checkbox" data-set="sound" ${S.settings.sound ? 'checked' : ''}><i></i></label></div>
        <div class="setting-row"><span>${I('talk', 22)} Tốc độ đọc</span><div class="row gap-s"><input type="range" min="0.5" max="1.2" step="0.05" value="${S.settings.rate}" data-rate><button class="btn btn-sm btn-paper" data-say="こんにちは">Thử ${I('speaker', 18)}</button></div></div>
        <div class="setting-row"><span>${I('target', 22)} Mục tiêu mỗi ngày</span><div class="chips" data-goal>${[10, 20, 30, 50, 80].map(g => `<button class="chip-btn ${S.goal === g ? 'active' : ''}" data-val="${g}">${g} XP</button>`).join('')}</div></div>
        <div class="setting-row"><span>${I('palette', 22)} Giao diện</span><div class="chips" data-theme>${themes.map(t => `<button class="chip-btn ${S.settings.theme === t[0] ? 'active' : ''}" data-val="${t[0]}">${I(t[1], 22)} ${t[2]}</button>`).join('')}</div></div>
        <div class="setting-row"><span>${I('music', 22)} Thử âm thanh</span><div class="row gap-s wrap">${[['ok', 'Đúng'], ['bad', 'Sai'], ['win', 'Thắng'], ['meow', 'Mochi'], ['stamp', 'Con dấu']].map(s => `<button class="btn btn-sm btn-paper" data-sfx="${s[0]}" data-nosfx="1">${s[1]}</button>`).join('')}</div></div>
        <div class="setting-row col"><span>${I('download', 22)} Sao lưu tiến độ <small class="muted">(chuyển sang máy khác)</small></span>
          <div class="row gap-s wrap"><button class="btn btn-sm btn-paper" data-export>${I('upload', 18)} Xuất mã</button><button class="btn btn-sm btn-paper" data-import>${I('download', 18)} Nhập mã</button><button class="btn btn-sm btn-red" data-reset>${I('trash', 18)} Xoá toàn bộ tiến độ</button></div></div>
      </div>
      <p class="center muted small">SubelJapan — dữ liệu được lưu ngay trên trình duyệt của bạn.<br>Hình vẽ & âm thanh: tự làm 100%. Nét chữ: <a class="link" href="https://kanjivg.tagaini.net" target="_blank" rel="noopener">KanjiVG</a> (CC BY-SA 3.0)</p>
    </div>`;
    SJ.lesson.bindNameWidget(root);
    root.querySelector('[data-edit]').onclick = () => {
      const m = U().modal(`<div class="center"><h3 class="title-hand">Đổi tên</h3><input class="input" id="nn" maxlength="30" value="${esc(S.name)}"><button class="btn btn-block mt" id="nn-ok">${I('check', 20)} Lưu</button></div>`, { cls: 'modal-sm' });
      m.el.querySelector('#nn-ok').onclick = () => { const v = m.el.querySelector('#nn').value.trim(); if (v) SJ.store.set('name', v); m.close(); SJ.app.refresh(); };
    };
    root.querySelector('[data-set="sound"]').onchange = e => SJ.store.setSetting('sound', e.target.checked);
    root.querySelector('[data-rate]').onchange = e => SJ.store.setSetting('rate', +e.target.value);
    root.querySelector('[data-goal]').onclick = e => { const b = e.target.closest('.chip-btn'); if (!b) return; SJ.store.set('goal', +b.dataset.val); SJ.app.refresh(); };
    root.querySelector('[data-theme]').onclick = e => { const b = e.target.closest('.chip-btn'); if (!b) return; SJ.store.setSetting('theme', b.dataset.val); SJ.app.applyTheme(); SJ.app.refresh(); };
    root.querySelectorAll('[data-sfx]').forEach(b => b.onclick = () => SJ.audio.sfx(b.dataset.sfx));
    root.querySelector('[data-export]').onclick = () => {
      const code = SJ.store.exportData();
      const m = U().modal(`<h3 class="title-hand">${I('upload', 26)} Mã sao lưu của bạn</h3><p class="muted small">Sao chép mã này và dán vào "Nhập mã" trên máy khác.</p><textarea class="input code-area" readonly>${code}</textarea><button class="btn btn-block mt" data-copy>${I('note', 20)} Sao chép</button>`, { cls: 'modal-sm' });
      const ta = m.el.querySelector('textarea'); ta.select();
      m.el.querySelector('[data-copy]').onclick = () => { ta.select(); (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).catch(() => document.execCommand('copy')).finally(() => U().toast(`${I('check', 20)} Đã sao chép!`)); };
    };
    root.querySelector('[data-import]').onclick = () => {
      const m = U().modal(`<h3 class="title-hand">${I('download', 26)} Nhập mã sao lưu</h3><textarea class="input code-area" placeholder="Dán mã vào đây…"></textarea><button class="btn btn-block mt" data-ok>Khôi phục tiến độ</button>`, { cls: 'modal-sm' });
      m.el.querySelector('[data-ok]').onclick = () => { try { SJ.store.importData(m.el.querySelector('textarea').value); m.close(); U().toast(`${I('check', 20)} Đã khôi phục tiến độ!`); SJ.app.applyTheme(); SJ.app.refresh(); } catch (e) { U().toast(`${I('batsu', 20)} Mã không hợp lệ, kiểm tra lại nha`); } };
    };
    root.querySelector('[data-reset]').onclick = async () => {
      if (await U().confirm('Xoá TOÀN BỘ tiến độ, XP, chuỗi và huy hiệu? Không thể hoàn tác đâu nha.', 'Xoá hết', 'Thôi, giữ lại')) { SJ.store.reset(); SJ.app.applyTheme(); location.hash = '#/'; SJ.app.refresh(); }
    };
  }

  SJ.pages = { home, learn, chart, write, games, review, profile, onboarding };
})(window.SJ);
