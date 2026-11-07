/* SubelJapan — Các trang chính: Lộ trình (trang chủ) + cột phải, Nhiệm vụ, Bảng chữ, Luyện viết, Trò chơi,
 * Ôn tập, Hồ sơ, Màn giới thiệu */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const P = SJ.pages = SJ.pages || {};

  // ===================== CỘT PHẢI (rail) =====================
  /** Một dòng nhiệm vụ: biểu tượng · tên + số tiến độ · thanh · cột thưởng (thẳng hàng giữa các dòng) */
  function qRow(o) {
    const pct = Math.max(0, Math.min(100, o.prog / o.target * 100));
    const st = o.claimed ? 'claimed' : o.done ? 'ready' : 'todo';
    const end = o.claimed ? `<span class="qr-got">${I('check', 18)}Đã nhận</span>`
      : o.done ? `<button class="btn btn-sm btn-yel qr-claim" ${o.attr}>Nhận ${I('fishcoin', 20)}<b>${o.fish}</b></button>`
      : `<span class="qr-rew">${I('fishcoin', 20)}<b>+${o.fish}</b></span>`;
    return `<div class="qrow ${st} t-${o.tone || 'pink'}"><span class="qr-ico">${I(o.icon, 30)}${o.claimed ? `<i class="qr-tick">${I('check', 14)}</i>` : o.done ? `<i class="qr-gift">${I('chest_open', 22)}</i>` : ''}</span>
      <div class="qr-main"><div class="qr-top"><span class="qr-title">${o.title}</span><span class="qr-count">${o.done ? (o.doneLabel || 'Xong!') : `<b>${Math.min(o.prog, o.target)}</b>/${o.target}`}</span></div>
        <div class="qr-bar"><i style="width:${pct}%"></i></div>${o.sub ? `<div class="qr-sub">${o.sub}</div>` : ''}</div>
      <div class="qr-end">${end}</div></div>`;
  }
  const dailyRows = () => SJ.store.quests().map((q, i) => qRow({ icon: q.icon, title: esc(SJ.store.questText(q)), prog: q.prog, target: q.target, fish: q.fish, done: q.done, claimed: q.claimed, attr: `data-claim="${i}"`, tone: 'pink' })).join('');
  function railHTML(compact) {
    const S = SJ.store.get();
    const lv = SJ.store.level();
    const today = SJ.store.todayXP();
    const streak = SJ.store.streakNow();
    const week = SJ.store.lastDays(7);
    const wd = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const qs = SJ.store.quests();
    const dayIdx = Math.floor(Date.now() / 86400000);
    const wotd = SJ.VOCAB_ALL[dayIdx % SJ.VOCAB_ALL.length];
    const stats = `<div class="stat-row">
      <a class="chip c-fire ${SJ.store.doneToday() ? '' : 'off'}" href="#/profile" title="Chuỗi ngày học">${I('fire', 26)}<b>${streak}</b></a>
      <a class="chip c-fish" href="#/shop" title="Cá vàng">${I('fishcoin', 26)}<b>${esc(S.fish)}</b></a>
      <a class="chip c-xp" href="#/profile" title="Cấp độ">${I(lv.icon, 26)}<b>${esc(S.xp)}</b></a>
      ${S.freeze ? `<a class="chip" href="#/shop" title="Bùa giữ chuỗi">${I('omamori', 26)}<b>${esc(S.freeze)}</b></a>` : ''}</div>`;
    const quests = `<div class="card card-pad qcard"><div class="card-title">${I('quest', 30)} Nhiệm vụ hôm nay <a class="more" href="#/quests">Tất cả ${I('arrow_r', 16)}</a></div>
      <div class="qlist">${dailyRows()}</div></div>`;
    if (compact) return stats + quests;
    return `${stats}
      <div class="card card-pad"><div class="goal-card">${U().ring(today / S.goal * 100, 76, `<b>${Math.min(today, 999)}</b><small>/${S.goal} XP</small>`, 'var(--sun)')}
        <div class="gc-txt"><b>Mục tiêu ngày</b><span class="muted small bold">${today >= S.goal ? 'Xong rồi! Giỏi quá đi' : `Còn ${S.goal - today} XP nữa thôi`}</span></div></div>
        <div class="week">${week.map(d => `<span class="wday ${d.xp ? 'on' : ''} ${d.frozen ? 'frz' : ''} ${d.key === SJ.store.dayKey() ? 'today' : ''}" title="${d.key}: ${d.xp} XP"><i>${d.xp ? I('fire', 18) : d.frozen ? I('omamori', 18) : ''}</i>${wd[d.d.getDay()]}</span>`).join('')}</div></div>
      ${quests}
      ${weeklyHTML()}
      <a class="card card-pad hov shop-teaser" href="#/shop">${U().mascot('wink', 76)}<div class="grow"><b class="card-title" style="margin:0 0 4px">Tiệm của Mochi</b><div class="muted small bold">Dùng cá vàng mua phụ kiện, đổi vị cho Mochi và bùa giữ chuỗi</div></div></a>
      <div class="card card-pad"><div class="card-title">${I('sparkle', 26)} Từ của ngày</div>
        <div class="wotd" data-say="${esc(SJ.ui.reading(wotd.jp))}"><span class="chip-pic">${I(wotd.e, 46)}</span><div class="grow"><div class="jp w-jp">${esc(wotd.jp)}</div><div class="muted small bold">${esc(wotd.r)} — ${esc(wotd.vi)}</div></div>${I('speaker', 24)}</div></div>
      <div class="rail-foot">${U().brand('SubelJapan')} · Nét chữ từ <a href="https://kanjivg.tagaini.net" target="_blank" rel="noopener">KanjiVG</a> (CC BY-SA 3.0)<br>Mochi chúc bạn học vui mỗi ngày!</div>`;
  }
  /** Thử thách tuần */
  function weeklyHTML() {
    const ws = SJ.store.weekly();
    const now = new Date(), left = 7 - ((now.getDay() + 6) % 7);
    return `<div class="card card-pad qcard weekly-card"><div class="card-title">${I('calendar', 30)} Thử thách tuần <span class="qc-pill lav">còn ${left} ngày</span></div>
      <div class="qlist">${ws.map((q, i) => qRow({ icon: q.icon, title: esc(SJ.store.weekText(q)), prog: q.prog, target: q.target, fish: q.fish, done: q.done, claimed: q.claimed, attr: `data-wclaim="${i}"`, tone: 'lav' })).join('')}</div></div>`;
  }
  /** Mục tiêu dài hạn — mỗi bậc nhận thưởng */
  function milesHTML() {
    return `<div class="card card-pad qcard"><div class="card-title">${I('medal', 30)} Mục tiêu dài hạn <span class="qc-pill sky">mỗi bậc +15 cá trở lên</span></div>
      <div class="qlist">${SJ.store.milestones().map(m => {
        const tierN = m.tiers.length;
        const dots = `<span class="mile-tier" title="Bậc ${Math.min(m.claimed, tierN)}/${tierN}">${Array.from({ length: tierN }, (_, k) => `<i class="${k < m.claimed ? 'on' : k < m.reached ? 'ready' : ''}"></i>`).join('')}</span>`;
        return qRow({ icon: m.icon, title: esc(m.name), prog: m.complete ? 1 : Math.min(m.v, m.next), target: m.complete ? 1 : m.next, fish: 15 + m.claimed * 5, done: m.canClaim || m.complete, claimed: m.complete, doneLabel: m.complete ? 'Xong hết!' : 'Đạt bậc mới!', attr: `data-mclaim="${m.id}"`, tone: 'sky', sub: dots + `<span>Bậc ${Math.min(m.claimed + (m.complete ? 0 : 1), tierN)}/${tierN}</span>` });
      }).join('')}</div></div>`;
  }
  function questsPageHTML() {
    const S = SJ.store.get(), qs = SJ.store.quests();
    const done = qs.filter(q => q.done).length, ready = qs.filter(q => q.done && !q.claimed).length;
    const fishLeft = qs.filter(q => !q.claimed).reduce((a, q) => a + q.fish, 0);
    const hero = `<div class="card qhero">
      <div class="qh-ring">${U().ring(done / qs.length * 100, 92, `<b>${done}/${qs.length}</b><small>hôm nay</small>`, done === qs.length ? 'var(--mint)' : 'var(--pri)')}</div>
      <div class="qh-txt"><b>${done === qs.length ? (ready ? 'Xong hết rồi — nhận quà thôi!' : 'Hôm nay xong hết rồi, giỏi quá!') : `Còn ${qs.length - done} nhiệm vụ nữa thôi`}</b>
        <span>${ready ? `Có <b>${ready}</b> phần quà đang chờ bạn bấm <b>Nhận</b>` : fishLeft ? `Làm xong để nhận thêm <b>${fishLeft} cá vàng</b>` : 'Nhiệm vụ mới xuất hiện lúc 0 giờ'}</span></div>
      <div class="qh-stats">
        <a class="qh-stat fire" href="#/profile">${I('fire', 28)}<b>${SJ.store.streakNow()}</b><small>ngày liên tiếp</small></a>
        <a class="qh-stat fish" href="#/shop">${I('fishcoin', 28)}<b>${esc(S.fish)}</b><small>cá vàng</small></a>
        <a class="qh-stat xp" href="#/profile">${I('star', 28)}<b>${esc(S.xp)}</b><small>tổng XP</small></a></div></div>`;
    const daily = `<div class="card card-pad qcard"><div class="card-title">${I('quest', 30)} Nhiệm vụ hôm nay <span class="qc-pill pink">làm mới lúc 0 giờ</span></div><div class="qlist">${dailyRows()}</div></div>`;
    return hero + daily + weeklyHTML() + milesHTML();
  }
  function bindRail(el) {
    if (!el) return;
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-claim]');
      const w = e.target.closest('[data-wclaim]');
      const m = e.target.closest('[data-mclaim]');
      let n = 0;
      if (b) n = SJ.store.claimQuest(+b.dataset.claim);
      else if (w) n = SJ.store.claimWeekly(+w.dataset.wclaim);
      else if (m) n = SJ.store.claimMile(m.dataset.mclaim);
      else return;
      if (n) { SJ.audio.sfx('chest'); U().confetti(50); P.refreshRail(); }
    });
  }
  P.refreshRail = () => {
    const r = document.querySelector('.rail'); if (r) r.innerHTML = railHTML();
    const m = document.querySelector('.rail-mobile'); if (m) m.innerHTML = railHTML(true);
    const q = document.querySelector('.quests-page-list'); if (q) q.innerHTML = questsPageHTML();
  };

  // ===================== TRANG CHỦ — LỘ TRÌNH =====================
  const OFFS = [0, 50, 78, 50, 0, -50, -78, -50];
  // Mỗi phần là một vùng đất trên bản đồ Nhật Bản
  const THEMES = {
    start: { name: 'Khu vườn nhỏ', big: ['sprout', 'tulip', 'flower', 'sun'], small: ['leaf', 'sprout', 'tulip'], fx: 'leaf' },
    hira: { name: 'Vườn hoa anh đào', big: ['sakura_tree', 'lantern', 'sakura_tree', 'torii', 'sakura_tree', 'onigiri'], small: ['sakura', 'tulip', 'flower'], fx: 'sakura' },
    kata: { name: 'Phố Tokyo', big: ['building', 'tower', 'rocket', 'building', 'robot', 'plane'], small: ['star_s', 'camera', 'headphones'], fx: 'star_s' },
    vocab: { name: 'Chợ ẩm thực', big: ['ramen', 'lantern', 'sushi', 'tea', 'onigiri', 'cake'], small: ['bowl', 'apple', 'egg'], fx: 'sparkle' },
    kanji: { name: 'Núi Phú Sĩ', big: ['fuji', 'torii', 'mountain', 'maple', 'torii', 'scroll'], small: ['maple', 'leaf', 'brush'], fx: 'maple' },
    grammar: { name: 'Trời sao đêm', big: ['moon', 'night', 'gradcap', 'book', 'star_s'], small: ['star_s', 'sparkle', 'star_s'], fx: 'star_s' },
  };
  // Màn thưởng xen giữa các bài: trò chơi, truyện, thử thách viết, gõ phím, chuỗi đúng
  const BONUS = {};
  const BONUS_KINDS = ['game', 'read', 'write', 'game', 'type', 'practice'];
  const GAME_ORDER = ['rain', 'fish', 'memory', 'whack', 'quiz', 'balloon', 'listen', 'builder', 'tf'];
  function bonusDef(u, ui, i, bi) {
    const id = 'b:' + u.id + ':' + i;
    let kind = BONUS_KINDS[bi % BONUS_KINDS.length];
    if (kind === 'read' && u.id === 'start') kind = 'game';
    if (kind === 'game') {
      const g = SJ.games.list.find(x => x.id === GAME_ORDER[Math.floor(bi / 2) % GAME_ORDER.length]) || SJ.games.list[0];
      return { id, kind, icon: g.icon, title: g.name, short: g.name, desc: g.desc + ' Chơi hết một lượt là phá được màn.', href: '#/game/' + g.id, match: g.id };
    }
    if (kind === 'read') {
      if (u.id === 'grammar') { const d = SJ.DIALOGUES[bi % SJ.DIALOGUES.length]; return { id, kind, icon: 'talk', title: 'Hội thoại: ' + d.title, short: 'Hội thoại', desc: 'Nghe và đọc hết đoạn hội thoại rồi bấm "Mình đã luyện xong".', href: '#/dialog/' + d.id, match: d.id }; }
      const lvl = { hira: 1, kata: 2, vocab: 2, kanji: 3 }[u.id] || 1;
      // chỉ dùng truyện có sẵn — truyện AI thêm/xoá sẽ làm màn thưởng đổi truyện
      const list = SJ.STORIES.filter(s => s.level === lvl && !s.ai); const st = list[bi % list.length];
      return { id, kind, icon: 'scroll', title: 'Truyện: ' + st.vi, short: 'Đọc truyện', desc: 'Đọc truyện ngắn rồi trả lời hết câu hỏi hiểu bài.', href: '#/story/' + st.id, match: st.id };
    }
    if (kind === 'write') return { id, kind, icon: 'pencil', title: 'Thử thách viết', short: 'Thử thách viết', desc: 'Viết xong 5 chữ từ trí nhớ (chế độ Viết trong Luyện tập).', href: '#/practice/write', need: 5 };
    if (kind === 'type') return { id, kind, icon: 'keyboard', title: 'Thử thách gõ phím', short: 'Gõ phím', desc: 'Gõ đúng 5 từ bằng bàn phím tiếng Nhật.', href: '#/type/' + (u.id === 'hira' || u.id === 'start' ? 'kana' : 'word'), need: 5 };
    return { id, kind: 'practice', icon: 'infinity', title: 'Chuỗi 10 câu đúng', short: 'Chuỗi 10 câu', desc: 'Luyện tập vô tận, trả lời đúng liên tiếp 10 câu.', href: '#/practice/' + ({ vocab: 'vocab', kanji: 'kanji' }[u.id] || 'read'), need: 10 };
  }
  // đường chân trời riêng cho từng vùng: đồi, phố Tokyo, núi Phú Sĩ…
  const HORIZON = {
    start: '<path class="h1" d="M0 80 Q90 25 190 70 T390 55 T600 65 V140 H0Z"/><path class="h2" d="M0 110 Q140 60 300 100 T600 95 V140 H0Z"/>',
    hira: '<path class="h1" d="M0 75 Q80 35 170 65 T350 50 T600 60 V140 H0Z"/><path class="h2" d="M0 105 Q160 70 320 100 T600 92 V140 H0Z"/>',
    kata: '<path class="h1" d="M0 140 V88 H34 V62 H70 V92 H96 V44 H134 V78 H168 V66 H200 V30 H214 V14 H222 V30 H236 V82 H272 V52 H316 V92 H350 V62 H384 V38 H420 V84 H452 V58 H492 V90 H520 V70 H560 V94 H600 V140Z"/><path class="h2" d="M0 140 V110 H50 V96 H92 V114 H140 V100 H190 V118 H240 V104 H300 V116 H350 V98 H410 V112 H470 V102 H530 V116 H600 V140Z"/>',
    vocab: '<path class="h1" d="M0 82 Q70 50 150 76 T310 62 T470 72 T600 64 V140 H0Z"/><path class="h2" d="M0 112 Q150 82 300 106 T600 100 V140 H0Z"/>',
    kanji: '<path class="h1" d="M0 140 V96 L110 64 L190 88 L300 18 L338 34 L410 86 L490 58 L600 92 V140Z"/><path class="snow" d="M266 40 L300 18 L338 34 L322 44 L308 38 L296 46 L282 40Z"/><path class="h2" d="M0 116 Q150 88 300 112 T600 104 V140 H0Z"/>',
    grammar: '<path class="h1" d="M0 86 Q100 46 210 78 T420 64 T600 74 V140 H0Z"/><path class="h2" d="M0 114 Q150 84 300 108 T600 102 V140 H0Z"/>',
  };
  const hash = (a, b) => { let x = (a * 374761393 + b * 668265263) >>> 0; x = (x ^ (x >>> 13)) * 1274126177 >>> 0; return (x % 1000) / 1000; };
  const tuft = '<svg class="tuft" viewBox="0 0 34 16" aria-hidden="true"><path d="M3 16 Q6 5 9 16 M12 16 Q16 1 19 16 M22 16 Q26 6 29 16"/></svg>';
  function scenery(u, ui, i, off, isCur, mood) {
    const T = THEMES[u.id] || THEMES.start;
    const side = off > 0 ? -1 : off < 0 ? 1 : (i % 2 ? -1 : 1);
    const r1 = hash(ui + 1, i + 1), r2 = hash(ui + 7, i + 3), r3 = hash(ui + 3, i + 11);
    let out = '';
    if (isCur) out += `<span class="deco here" style="--f:${side * 0.74};--dy:-6px">${U().mascot(mood, 76, 'bob')}<span class="here-tag">Mochi ở đây nè!</span></span>`;
    else {
      const big = T.big[(i + ui) % T.big.length];
      const sz = Math.round(70 + r1 * 26);
      out += `<span class="deco big" style="--f:${(side * (0.68 + r2 * 0.16)).toFixed(2)};--dy:${Math.round(r3 * 24 - 12)}px;--sz:${sz}">${I(big, sz)}${tuft}</span>`;
    }
    if (r2 > 0.35) out += `<span class="deco far" style="--f:${(-side * (0.88 + r1 * 0.07)).toFixed(2)};--dy:${Math.round(r2 * 40 - 20)}px;--sz:30">${I(T.small[(i * 3 + ui) % T.small.length], 30)}</span>`;
    if (r3 > 0.55) out += `<span class="deco tiny" style="--f:${(side * (0.42 + r3 * 0.1)).toFixed(2)};--dy:${Math.round(34 + r1 * 14)}px">${tuft}</span>`;
    return out;
  }
  function zoneFx(u) {
    const T = THEMES[u.id] || THEMES.start;
    let fx = '';
    for (let k = 0; k < 7; k++) fx += `<span class="fx fx-${T.fx}" style="--l:${(8 + k * 13 + hash(k, 5) * 6).toFixed(1)}%;--t:${(6 + hash(k, 7) * 80).toFixed(1)}%;--d:${(9 + hash(k, 9) * 8).toFixed(1)}s;--w:${(-hash(k, 2) * 12).toFixed(1)}s">${I(T.fx, 26)}</span>`;
    return `<span class="cloud c1"></span><span class="cloud c2"></span><span class="cloud c3"></span>${fx}
      <svg class="map-hills" viewBox="0 0 600 140" preserveAspectRatio="none" aria-hidden="true">${HORIZON[u.id] || HORIZON.start}</svg>`;
  }
  function home(root) {
    const S = SJ.store.get();
    const next = SJ.store.nextLesson();
    const g = U().greeting();
    const name = S.name ? esc(S.name) : 'bạn';
    let n = 0, bi = 0;
    const bonusNode = (u, ui, i) => {
      const b = bonusDef(u, ui, i, bi++);
      BONUS[b.id] = b;
      const off = OFFS[(n++) % OFFS.length];
      const done = SJ.store.bonusIsDone(b.id);
      const pend = S.bonusPending && S.bonusPending.id === b.id;
      return `<div class="prow">${scenery(u, ui, 50 + i, off, false)}<div class="pnode bonus ${done ? 'done' : ''} ${pend ? 'pending' : ''}" style="--x:${off}px" data-x="${off}" data-b="${b.id}">
        <button class="pn-btn" aria-label="${esc(b.title)}">${I(b.icon, 40)}${done ? `<span class="pn-check">${I('check', 16)}</span>` : ''}</button>
        <span class="pn-label"><b class="bn-tag">Màn thưởng</b> ${esc(b.short)}</span></div></div>`;
    };
    const units = SJ.UNITS.map((u, ui) => {
      const c = SJ.store.countDone(u.id), tot = u.lessons.length, all = c === tot;
      const nodes = u.lessons.map((l, i) => {
        const st = S.lessons[l.id], done = st && st.done, cur = l === next && !done;
        const off = OFFS[(n++) % OFFS.length];
        const face = l.type === 'test' ? I('crown', 40) : (l.type === 'kana' || l.type === 'kanji') ? `<span>${l.items[0]}</span>` : I(l.icon || 'book', 40);
        return `<div class="prow">${scenery(u, ui, i, off, cur, SJ.store.doneToday() ? 'cheer' : 'happy')}<div class="pnode ${done ? 'done' : ''} ${cur ? 'cur' : ''}" style="--x:${off}px" data-x="${off}" data-l="${l.id}">
          ${cur ? `<span class="pn-start">${Object.keys(S.lessons).length ? 'Học tiếp' : 'Bắt đầu'}</span>` : ''}
          <button class="pn-btn" aria-label="${esc(l.title)}">${face}${done && st.stars >= 3 ? `<span class="pn-check">${I('star', 16)}</span>` : ''}</button>
          ${done ? `<span class="pn-stars">${U().stars(st.stars, 3, 15)}</span>` : ''}
          <span class="pn-label">${esc(l.title)}</span></div></div>` + (i % 3 === 2 && i < u.lessons.length - 1 ? bonusNode(u, ui, i) : '');
      }).join('');
      const bonTot = u.lessons.filter((l, i) => i % 3 === 2 && i < u.lessons.length - 1).length;
      const bonDone = Object.keys(S.bonus).filter(k => k.startsWith('b:' + u.id + ':')).length;
      const starsGot = u.lessons.reduce((a, l) => a + ((S.lessons[l.id] || {}).stars || 0), 0), starsMax = tot * 3;
      const crown = starsGot >= starsMax && bonDone >= bonTot;
      const goals = `<div class="ub-goals"><span class="ub-goal">${I('star', 18)} ${starsGot}/${starsMax} sao</span>${bonTot ? `<span class="ub-goal">${I('chest', 18)} ${bonDone}/${bonTot} màn thưởng</span>` : ''}<span class="ub-goal ${crown ? 'got' : ''}" title="Gom đủ sao và phá hết màn thưởng để nhận vương miện">${I('crown', 18)} ${crown ? 'Đã đội vương miện' : 'Vương miện'}</span></div>`;
      const chestState = S.chests[u.id] ? 'claimed' : all ? 'ready' : 'locked';
      const off = OFFS[(n++) % OFFS.length];
      const chest = `<div class="prow">${scenery(u, ui, 99, off, false)}<div class="pnode chest ${chestState}" style="--x:${off}px" data-x="${off}" data-chest="${u.id}"><button class="pn-btn" aria-label="Rương thưởng">${I(chestState === 'claimed' ? 'chest_open' : 'chest', 48)}</button><span class="pn-label">${chestState === 'claimed' ? 'Đã mở rương' : 'Rương 30 cá'}</span></div></div>`;
      return `<section class="unit" style="--uc:${u.color}" id="unit-${u.id}">
        <div class="unit-banner"><div class="ub-text"><div class="ub-kicker">Phần ${ui + 1} · ${esc((THEMES[u.id] || THEMES.start).name)}</div><div class="ub-title">${esc(u.title)} <span class="jp">${u.jp}</span></div><div class="ub-desc">${esc(u.desc)}</div>
          <div class="ub-prog">${U().bar(c / tot * 100)}<span>${c}/${tot} bài</span></div>${goals}</div>
          <span class="ub-icon">${I(u.icon, 44)}</span>
          <button class="btn btn-sm ub-guide" data-guide="${u.id}" title="Sổ tay">${I('book', 22)}<span>Sổ tay</span></button></div>
        <div class="map-zone t-${u.id}"><div class="zone-bg">${zoneFx(u)}</div><svg class="map-road" aria-hidden="true"></svg>
          <div class="path">${nodes}${chest}</div></div></section>`;
    }).join('');
    const nextUnit = SJ.UNITS.find(u => u.id === next.unit);
    root.innerHTML = `<div class="with-rail">
      <div class="main-col">
        <div class="hello card sky">${SJ.deco ? SJ.deco.skyHTML() : ''}${U().mascot(SJ.store.doneToday() ? 'cheer' : 'happy', 84, 'bob')}<div class="hello-txt"><div class="hello-jp jp" data-say="${g.jp}">${g.jp}！</div><h1>${g.vi}, ${name}!</h1><div class="muted small bold">${I(nextUnit.icon, 16)} ${esc(nextUnit.title)} · ${esc(next.title)}</div></div>
          <a class="btn btn-cat hello-cta" href="#/lesson/${next.id}">${U().ears()}${Object.keys(S.lessons).length ? 'Học tiếp' : 'Bắt đầu học'} ${I('arrow_r', 20)}</a></div>
        ${SJ.deco ? SJ.deco.todayHTML() : ''}
        ${SJ.talk ? SJ.talk.teaser() : ''}
        <div class="rail-mobile">${railHTML(true)}</div>
        ${units}
        <div class="path-end">${U().mascot('love', 90)}Học hết lộ trình rồi thì luyện vô tận, đọc truyện và ôn thẻ nhớ mỗi ngày để nhớ mãi nha!</div>
      </div>
      <aside class="rail">${railHTML()}</aside></div>`;
    bindRail(root.querySelector('.rail')); bindRail(root.querySelector('.rail-mobile'));

    let openNode = null;
    const closePop = () => { if (openNode) { openNode.querySelector('.pn-pop') && openNode.querySelector('.pn-pop').remove(); openNode.closest('.prow').classList.remove('open'); openNode = null; } };
    root.addEventListener('click', e => {
      const gb = e.target.closest('[data-guide]'); if (gb) { guide(gb.dataset.guide); return; }
      const ch = e.target.closest('[data-chest]');
      if (ch && e.target.closest('.pn-btn')) {
        const uid = ch.dataset.chest;
        const got = SJ.store.claimChest(uid);
        if (got) {
          SJ.audio.sfx('chest'); U().confetti(90);
          ch.classList.remove('ready'); ch.classList.add('claimed');
          ch.querySelector('.pn-btn').innerHTML = I('chest_open', 48); ch.querySelector('.pn-label').textContent = 'Đã mở rương';
        } else if (!S.chests[uid]) U().toast(`${I('lock', 24)} Học xong tất cả bài trong phần này để mở rương nha!`);
        else U().toast(`${I('chest_open', 24)} Rương này mở rồi nè`);
        return;
      }
      const bs = e.target.closest('[data-bstart]');
      if (bs) {
        e.preventDefault(); const b = BONUS[bs.dataset.bstart];
        // "Làm tiếp" giữ nguyên tiến độ đang làm, chỉ bắt đầu lại khi là màn khác
        const p = SJ.store.get().bonusPending, same = p && p.id === b.id && p.match === (b.match || null);
        if (!SJ.store.bonusIsDone(b.id) && !same) SJ.store.startBonus(b);
        SJ.audio.sfx('open'); location.hash = b.href; return;
      }
      const bn = e.target.closest('.pnode[data-b]');
      if (bn && e.target.closest('.pn-btn')) {
        if (openNode === bn) { closePop(); return; }
        closePop();
        const b = BONUS[bn.dataset.b], done = SJ.store.bonusIsDone(b.id);
        const pend = S.bonusPending && S.bonusPending.id === b.id;
        bn.insertAdjacentHTML('beforeend', `<div class="pn-pop bonus-pop"><div class="pp-meta">${I('chest', 22)} MÀN THƯỞNG</div><h4>${esc(b.title)}</h4><p>${esc(b.desc)}</p>
          <div class="pp-meta">${done ? `${I('check', 18)} Đã phá màn này — chơi lại cho vui nha` : `${I('fishcoin', 20)} +12 cá · ${I('star', 18)} +8 XP${pend && b.need > 1 ? ` · đang làm ${S.bonusPending.prog || 0}/${b.need}` : ''}`}</div>
          <button class="btn btn-block" data-bstart="${b.id}">${done ? 'Chơi lại' : pend ? 'Làm tiếp' : 'Chơi ngay'}</button></div>`);
        bn.closest('.prow').classList.add('open');
        openNode = bn; SJ.audio.sfx('pop');
        return;
      }
      const nd = e.target.closest('.pnode[data-l]');
      if (nd && e.target.closest('.pn-btn')) {
        if (openNode === nd) { closePop(); return; }
        closePop();
        const l = SJ.LESSON_MAP[nd.dataset.l], st = S.lessons[l.id];
        nd.insertAdjacentHTML('beforeend', `<div class="pn-pop"><h4>${esc(l.title)}</h4><p>${esc(l.sub || '')}${l.type === 'kana' ? ` · ${l.items.length} chữ` : ''}</p>
          ${st && st.done ? `<div class="pp-meta">${U().stars(st.stars, 3, 18)} Đã học ${st.count} lần · đúng ${st.best}%</div>` : ''}
          <a class="btn btn-block" href="#/lesson/${l.id}">${st && st.done ? 'Học lại +6 XP' : 'Bắt đầu +15 XP'}</a></div>`);
        nd.closest('.prow').classList.add('open');
        openNode = nd; SJ.audio.sfx('pop');
        return;
      }
      if (!e.target.closest('.pn-pop')) closePop();
    });
    if ('IntersectionObserver' in window) {
      root.querySelectorAll('.path').forEach(p => p.classList.add('reveal'));
      const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -30px 0px' });
      root.querySelectorAll('.prow').forEach((r, i) => { r.style.transitionDelay = ((i % 4) * 0.07) + 's'; io.observe(r); });
    }
    const cur = root.querySelector('.pnode.cur');
    if (cur && Object.keys(S.lessons).length) setTimeout(() => cur.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    drawRoads(root);
    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => drawRoads(root), 120); };
    window.addEventListener('resize', onResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => drawRoads(root));
    setTimeout(() => drawRoads(root), 600);
    return { destroy() { window.removeEventListener('resize', onResize); clearTimeout(rt); } };
  }
  /** Vẽ con đường uốn lượn nối các bài học; đoạn đã học được tô màu */
  function drawRoads(root) {
    root.querySelectorAll('.map-zone').forEach(z => {
      const svg = z.querySelector('.map-road'), path = z.querySelector('.path');
      if (!path) return;
      const W = z.clientWidth, H = z.clientHeight;
      if (!W || !H) return;
      const pts = Array.from(z.querySelectorAll('.pnode')).map(nd => {
        const btn = nd.querySelector('.pn-btn'), row = nd.parentElement;
        return { x: W / 2 + (+nd.dataset.x || 0), y: path.offsetTop + row.offsetTop + nd.offsetTop + btn.offsetTop + btn.offsetHeight / 2, done: nd.classList.contains('done'), cur: nd.classList.contains('cur') };
      });
      if (!pts.length) return;
      const P = [{ x: W / 2, y: 0 }].concat(pts, [{ x: W / 2, y: H }]);
      const curve = Q => {
        let d = 'M' + Q[0].x.toFixed(1) + ' ' + Q[0].y.toFixed(1);
        for (let i = 0; i < Q.length - 1; i++) {
          const p0 = Q[i - 1] || Q[i], p1 = Q[i], p2 = Q[i + 1], p3 = Q[i + 2] || p2;
          d += ' C' + (p1.x + (p2.x - p0.x) / 6).toFixed(1) + ' ' + (p1.y + (p2.y - p0.y) / 6).toFixed(1) + ' ' + (p2.x - (p3.x - p1.x) / 6).toFixed(1) + ' ' + (p2.y - (p3.y - p1.y) / 6).toFixed(1) + ' ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
        }
        return d;
      };
      let k = 0;
      pts.forEach((p, i) => { if (p.done || p.cur) k = i + 1; });
      const all = curve(P), trail = k ? curve(P.slice(0, k + 1)) : '';
      // vẽ đường vào ảnh nền của vùng (luôn hiển thị ổn định, không bị lớp hoạt ảnh che)
      const uc = getComputedStyle(z.closest('.unit')).getPropertyValue('--uc').trim() || '#ff6b9a';
      const card = getComputedStyle(document.documentElement).getPropertyValue('--card').trim() || '#ffffff';
      const night = z.classList.contains('t-grammar');
      const cEdge = night ? 'rgba(255,255,255,.28)' : mixHex(uc, card, .55), cBase = night ? 'rgba(255,255,255,.95)' : '#fffaf2';
      const cTrail = mixHex(uc, '#ffffff', .78), cDots = mixHex(uc, '#ffffff', .6);
      const sw = W < 500 ? [36, 27] : [44, 34];
      const road = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><g fill="none" stroke-linecap="round" stroke-linejoin="round">`
        + `<path d="${all}" stroke="${cEdge}" stroke-width="${sw[0]}"/><path d="${all}" stroke="${cBase}" stroke-width="${sw[1]}"/>`
        + (trail ? `<path d="${trail}" stroke="${cTrail}" stroke-width="${sw[1]}"/>` : '')
        + `<path d="${all}" stroke="${cDots}" stroke-width="6" stroke-dasharray="0.1 18"/>`
        + (trail ? `<path d="${trail}" stroke="rgba(255,255,255,.85)" stroke-width="6" stroke-dasharray="0.1 18"/>` : '') + '</g></svg>';
      z.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(road)}"), linear-gradient(180deg, var(--t1), var(--t2))`;
      z.style.backgroundSize = `${W}px ${H}px, auto`;
      z.style.backgroundRepeat = 'no-repeat, no-repeat';
      svg && svg.remove();
    });
  }
  /** Trộn 2 màu hex: p = tỉ lệ màu a */
  function mixHex(a, b, p) {
    const h = c => { c = c.replace('#', ''); if (c.length === 3) c = c.replace(/./g, x => x + x); const n = parseInt(c.slice(0, 6), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
    if (!/^#/.test(a) || !/^#/.test(b)) return a;
    const A = h(a), B = h(b);
    return 'rgb(' + A.map((v, i) => Math.round(v * p + B[i] * (1 - p))).join(',') + ')';
  }
  P.home = home;
  P.drawRoads = drawRoads;
  P.learn = home;

  /** Sổ tay của từng phần */
  function guide(uid) {
    const u = SJ.UNITS.find(x => x.id === uid);
    let body = '';
    if (uid === 'start') body = SJ.TEXT.intro.sections.map(s => `<h3>${U().brand(esc(s.h))}</h3><p>${U().brand(esc(s.p))}</p>`).join('');
    else if (uid === 'hira' || uid === 'kata') {
      const sc = uid;
      const conv = c => sc === 'kata' ? SJ.toKata(c) : c;
      body = `<p class="bold">Bảng ${u.title} cơ bản: cột ngang là nguyên âm a・i・u・e・o, hàng dọc là phụ âm.</p>
        <div class="gojuon mini" style="--uc:${u.color}">${SJ.GOJUON.basic.map(r => `<div class="gj-row"><span class="gj-lab">${r[0] || '–'}</span>${Array.from(r[1]).map(c => c === '_' ? '<span class="gj-c empty"></span>' : `<span class="gj-c on" data-say="${conv(c)}">${conv(c)}</span>`).join('')}</div>`).join('')}</div>
        <div class="tip-box">${I('bulb', 26)}<div>Thêm <b>゛</b> → âm đục (か→が), thêm <b>゜</b> → âm p (は→ぱ). Chữ cột i + <b>ゃゅょ</b> nhỏ → âm ghép (き+ゃ=きゃ). <b>っ</b> nhỏ → ngắt hơi gấp đôi phụ âm.</div></div>
        <div class="row center-row mt"><a class="btn" href="#/chart">${I('kana', 22)} Mở bảng chữ đầy đủ</a></div>`;
    } else if (uid === 'vocab') body = u.lessons.map(l => `<h3>${I(l.icon, 24)} ${esc(l.title)} <span class="jp small muted">${esc(l.sub)}</span></h3><div class="chips mb">${SJ.VOCAB[l.topic].slice(0, 8).map(o => `<button class="chip-btn" data-say="${esc(SJ.ui.reading(o.jp))}"><span class="jp">${esc(o.jp)}</span><small>${esc(o.vi)}</small></button>`).join('')}</div>`).join('');
    else if (uid === 'kanji') body = `<p class="bold">Mẹo: hầu hết Kanji có âm Hán Việt — biết nghĩa tiếng Việt là đoán được nghĩa chữ!</p><div class="kana-flow">${SJ.KANJI.map(o => `<button class="kcell" data-say="${o.ex[0].kana}"><span class="kc-k">${o.k}</span><span class="kc-r">${o.hv}</span></button>`).join('')}</div>`;
    else body = u.lessons.map(l => { const t = SJ.TEXT[l.content]; return `<h3>${esc(l.title)} <span class="small muted">${esc(l.sub)}</span></h3><p>${esc(t.sections[0].p)}</p>`; }).join('');
    U().modal(`<div class="row gap mb" style="--uc:${u.color}"><span class="ph-icon" style="width:64px;height:64px;display:grid;place-items:center;border-radius:20px;background:var(--bg2)">${I(u.icon, 44)}</span><div><div class="small muted bold">Sổ tay</div><h2 style="margin:0">${esc(u.title)} <span class="jp small">${u.jp}</span></h2></div></div>${body}`, { cls: 'modal-lg' });
  }

  // ===================== NHIỆM VỤ (trang riêng — tiện cho điện thoại) =====================
  P.quests = function (root) {
    const S = SJ.store.get();
    root.innerHTML = `<div class="page-narrow">
      <div class="page-head"><div class="ph-icon">${I('quest', 52)}</div><div><h1>Nhiệm vụ & Mục tiêu</h1><p>Mỗi ngày 3 nhiệm vụ, mỗi tuần 3 thử thách lớn, cùng các mục tiêu dài hạn có nhiều bậc. Hoàn thành để nhận cá vàng mua đồ cho Mochi nha!</p></div></div>
      <div class="col gap quests-page-list">${questsPageHTML()}</div>
      <div class="card card-pad mt"><div class="card-title">${I('trophy', 28)} Thành tích</div><div class="stat-grid qstats">
        <div class="stat-box card">${I('quest', 36)}<div><b>${S.questsDone}</b><span>nhiệm vụ đã xong</span></div></div>
        <div class="stat-box card">${I('fishcoin', 36)}<div><b>${S.fishTotal || 0}</b><span>cá đã kiếm được</span></div></div>
        <div class="stat-box card">${I('chest', 36)}<div><b>${Object.keys(S.chests).length}</b><span>rương đã mở</span></div></div></div></div>
      </div>`;
    bindRail(root);
  };

  // ===================== BẢNG CHỮ CÁI (a・i・u・e・o) =====================
  function chart(root) {
    let script = 'hira', hide = false, picking = false;
    const picked = new Set();
    const conv = c => script === 'kata' ? SJ.toKata(c) : c;
    function cell(k) {
      if (!k) return '<span class="kcell empty"></span>';
      const o = SJ.KANA_MAP[k]; if (!o) return '<span class="kcell empty"></span>';
      return `<button class="kcell m${SJ.store.mastery(o.k)} ${picked.has(o.k) ? 'sel' : ''}" data-nosfx="1" data-k="${o.k}"><span class="kc-k">${o.k}</span><span class="kc-r">${o.r}</span></button>`;
    }
    const table = (cols, rows, cls) => `<div class="gojuon ${cls || ''}" style="--cols:${cols.length}">
      <div class="gj-row gj-head"><span></span>${cols.map(c => `<span>${c}</span>`).join('')}</div>
      ${rows.map(r => `<div class="gj-row"><button class="gj-lab" data-row="${r[1].filter(Boolean).join('')}" style="border:0;background:none;cursor:pointer"><b>${r[0] || '–'}</b>${r[2] ? `<small class="jp">${r[2]}</small>` : ''}</button>${r[1].map(cell).join('')}</div>`).join('')}</div>`;
    function draw() {
      const K = SJ.KANA[script];
      const basicRows = SJ.GOJUON.basic.map(r => [r[0], Array.from(r[1]).map(c => c === '_' ? null : conv(c)), conv(r[1][0]) + '行']);
      const dakuRows = SJ.GOJUON.daku.map(r => [r[0], Array.from(r[1]).map(c => conv(c)), conv(r[1][0]) + '行']);
      const yoonRows = SJ.GOJUON.yoon.map(r => [r[0], r[1].map(conv)]);
      const learned = K.basic.concat(K.daku, K.yoon).filter(o => SJ.store.mastery(o.k) === 2).length;
      const total = K.basic.length + K.daku.length + K.yoon.length;
      root.innerHTML = `<div class="page-mid">
        <div class="page-head"><div class="ph-icon">${I('kana', 52)}</div><div><h1>Bảng chữ cái</h1><p>Cột ngang là nguyên âm <b>a・i・u・e・o</b>, hàng dọc là phụ âm <b>k・s・t・n…</b> Bấm vào chữ để nghe, xem thứ tự nét và mẹo nhớ.</p></div></div>
        <div class="chart-tools">
          <div class="seg"><button class="${script === 'hira' ? 'active' : ''}" data-s="hira">${I('sakura', 22)} Hiragana</button><button class="${script === 'kata' ? 'active' : ''}" data-s="kata">${I('bolt', 22)} Katakana</button></div>
          <div class="row gap wrap"><label class="switch"><input type="checkbox" data-hide ${hide ? 'checked' : ''}><i></i><span>Ẩn romaji</span></label>
          <button class="btn btn-sm ${picking ? '' : 'btn-white'}" data-pick>${I('check', 18)} ${picking ? 'Đang chọn chữ…' : 'Chọn để luyện'}</button></div>
        </div>
        <div class="card card-sm row gap wrap mb between"><span class="legend"><i></i> Chưa học <i class="m1"></i> Đang học <i class="m2"></i> Đã thuộc</span><span class="bold small">${I('medal', 20)} Đã thuộc ${learned}/${total}</span></div>
        <div class="${hide ? 'hide-romaji' : ''}">
        <section class="card chart-sec"><h3 class="chart-h">Chữ cơ bản <span class="jp">五十音</span><small>${K.basic.length} chữ</small></h3>${table(SJ.GOJUON.cols, basicRows)}</section>
        <section class="card chart-sec"><h3 class="chart-h">Âm đục ゛ & bán đục ゜<small>${K.daku.length} chữ</small></h3>${table(SJ.GOJUON.cols, dakuRows)}</section>
        <section class="card chart-sec"><h3 class="chart-h">Âm ghép<small>${K.yoon.length} âm — chữ cột i + ゃゅょ nhỏ</small></h3>${table(SJ.GOJUON.yoonCols, yoonRows, 'yoon')}</section>
        <section class="card chart-sec"><h3 class="chart-h">Chữ nhỏ<small>${K.small.length} chữ</small></h3><div class="kana-flow">${K.small.map(o => cell(o.k)).join('')}</div></section>
        ${K.ext ? `<section class="card chart-sec"><h3 class="chart-h">Âm ngoại lai<small>${K.ext.length} âm cho từ nước ngoài</small></h3><div class="kana-flow">${K.ext.map(o => cell(o.k)).join('')}</div></section>` : ''}
        </div>
        ${picking ? `<div class="drill-bar slide-up"><b class="grow">${picked.size ? `Đã chọn ${picked.size} chữ` : 'Bấm vào chữ hoặc tên hàng để chọn'}</b>
          <button class="btn btn-sm btn-white" data-drill="read" ${picked.size < 2 ? 'disabled' : ''}>${I('eye', 18)} Luyện đọc</button>
          <button class="btn btn-sm btn-yel" data-drill="write" ${!picked.size ? 'disabled' : ''}>${I('pencil', 18)} Luyện viết</button>
          <button class="btn btn-sm btn-white" data-drill="print" ${!picked.size ? 'disabled' : ''}>${I('printer', 18)} In phiếu</button></div>` : ''}
      </div>`;
    }
    root.onclick = e => {
      const t = e.target.closest('[data-s]'); if (t) { script = t.dataset.s; draw(); return; }
      if (e.target.closest('[data-pick]')) { picking = !picking; if (!picking) picked.clear(); draw(); return; }
      const dr = e.target.closest('[data-drill]');
      if (dr) {
        const keys = Array.from(picked);
        SJ.practice.custom = keys;
        if (dr.dataset.drill === 'read') location.hash = '#/practice/read';
        if (dr.dataset.drill === 'write') { SJ.pages.writeList = keys; location.hash = '#/write/' + encodeURIComponent(keys[0]); }
        if (dr.dataset.drill === 'print') { SJ.pages.printChars = keys.join(''); location.hash = '#/print'; }
        return;
      }
      const row = e.target.closest('[data-row]');
      if (row && picking) { const ks = Array.from(row.dataset.row.match(/[ぁ-ゖァ-ヺー][ゃゅょャュョ]?/g) || []).filter(k => SJ.KANA_MAP[k]); const allIn = ks.every(k => picked.has(k)); ks.forEach(k => allIn ? picked.delete(k) : picked.add(k)); SJ.audio.sfx('tap'); draw(); return; }
      const c = e.target.closest('.kcell[data-k]');
      if (c) {
        if (picking) { const k = c.dataset.k; picked.has(k) ? picked.delete(k) : picked.add(k); SJ.audio.sfx('tap'); draw(); return; }
        const o = SJ.KANA_MAP[c.dataset.k]; SJ.audio.speak(o.k); kanaDetail(o);
      }
    };
    root.onchange = e => { if (e.target.matches('[data-hide]')) { hide = e.target.checked; draw(); } };
    draw();
  }
  P.chart = chart;

  function kanaDetail(o) {
    const list = SJ.KANA[o.script][o.group] || [o];
    let i = list.indexOf(o);
    const m = U().modal('<div data-kd></div>', { cls: 'modal-sm' });
    let sv = null;
    function draw() {
      const k = list[i];
      const c = SJ.confusables(k.k);
      m.el.querySelector('[data-kd]').innerHTML = `<div class="kdetail">
        <div class="kd-top">${SJ.lesson.glyph(k.k)}<div class="stroke-box" data-sv></div></div>
        <div class="lc-romaji">${k.r}</div>
        <div class="info-row center-row mt-s"><span class="tag tag-pink">${I('talk', 16)} Đọc gần giống</span><b>${esc(k.v || k.r)}</b></div>
        <div class="mnemo mt" style="text-align:left">${I('bulb', 26)}<span>${esc(k.m)}</span></div>
        ${c.list.length ? `<div class="mt"><div class="mini-label mb-s">Dễ nhầm với</div><div class="confuse">${c.list.map(x => `<button class="chip-kana" data-go="${x}">${x}</button>`).join('')}</div>${c.tip ? `<p class="small muted bold mt-s">${esc(c.tip)}</p>` : ''}</div>` : ''}
        ${k.w ? `<div class="mt" style="text-align:left">${SJ.lesson.exampleRow(k.w)}</div>` : ''}
        <div class="kd-nav"><button class="btn btn-white btn-round" data-nav="-1" ${i <= 0 ? 'disabled' : ''} aria-label="Chữ trước">${I('arrow_l', 22)}</button>
          <button class="btn btn-white" data-say="${k.k}">${I('speaker', 20)} Nghe</button><a class="btn btn-yel" href="#/write/${encodeURIComponent(k.k)}">${I('pencil', 20)} Luyện viết</a>
          <button class="btn btn-white btn-round" data-nav="1" ${i >= list.length - 1 ? 'disabled' : ''} aria-label="Chữ sau">${I('arrow_r', 22)}</button></div><a class="kd-ask" href="#/sensei/chat:${encodeURIComponent('Cho mình mẹo nhớ chữ ' + k.k + ' (' + k.r + ') và cách phân biệt với chữ dễ nhầm nhé')}">${I('sensei', 26)}<span>Hỏi Sensei Mochi mẹo nhớ chữ này</span></a></div>`;
      sv && sv.stop(); sv = SJ.writing.strokeView(m.el.querySelector('[data-sv]'), k.k);
    }
    m.el.addEventListener('click', e => {
      const n = e.target.closest('[data-nav]'); if (n) { i = Math.max(0, Math.min(list.length - 1, i + +n.dataset.nav)); draw(); SJ.audio.speak(list[i].k); return; }
      const g = e.target.closest('[data-go]'); if (g && SJ.KANA_MAP[g.dataset.go]) { m.close(); setTimeout(() => kanaDetail(SJ.KANA_MAP[g.dataset.go]), 260); SJ.audio.speak(g.dataset.go); }
    });
    draw();
  }
  P.kanaDetail = kanaDetail;

  // ===================== LUYỆN VIẾT =====================
  function write(root, arg) {
    const mk = arr => arr.map(o => ({ k: o.k, r: o.r, sub: o.v ? 'Đọc: ' + o.v : '', o }));
    const LISTS = {
      hira: [['Cơ bản', mk(SJ.KANA.hira.basic)], ['Âm đục', mk(SJ.KANA.hira.daku)], ['Âm ghép', mk(SJ.KANA.hira.yoon)], ['Chữ nhỏ', mk(SJ.KANA.hira.small)]],
      kata: [['Cơ bản', mk(SJ.KANA.kata.basic)], ['Âm đục', mk(SJ.KANA.kata.daku)], ['Âm ghép', mk(SJ.KANA.kata.yoon)], ['Ngoại lai', mk(SJ.KANA.kata.ext)], ['Chữ nhỏ', mk(SJ.KANA.kata.small)]],
      kanji: [['58 Kanji nhập môn', SJ.KANJI.map(o => ({ k: o.k, r: o.hv, sub: o.m, o }))]],
    };
    if (SJ.pages.writeList && SJ.pages.writeList.length) { LISTS.mine = [['Chữ đã chọn', SJ.pages.writeList.map(k => SJ.KANA_MAP[k]).filter(Boolean).map(o => ({ k: o.k, r: o.r, sub: '', o }))]]; }
    const flat = t => LISTS[t].flatMap(g => g[1]);
    let tab = LISTS.mine ? 'mine' : 'hira';
    // chữ đã chọn từ Bảng chữ → giữ tab "Đã chọn"
    if (arg && !(LISTS.mine && flat('mine').some(x => x.k === arg))) { for (const t of Object.keys(LISTS)) if (flat(t).some(x => x.k === arg)) { tab = t; break; } }
    let cur = (arg && flat(tab).find(x => x.k === arg)) || flat(tab)[0];
    let mode = SJ.store.get().settings.writeMode || 'guide', combo = 0, auto = true, wp = null, sv = null, timer = null;
    const S = SJ.store.get();
    const wkey = x => SJ.KANJI_MAP[x.k] && tab === 'kanji' ? 'j:' + x.k : x.k;
    const wclass = x => { const it = S.items[wkey(x)]; if (!it) return ''; const m = SJ.store.mastery(wkey(x)); return m === 2 ? 'w3' : 'w1'; };

    root.innerHTML = `<div class="page"><div class="page-head"><div class="ph-icon">${I('pencil', 52)}</div><div><h1>Luyện viết</h1><p>Viết từng nét theo đúng thứ tự — Mochi chấm <b>từng nét</b>: đúng vị trí, đúng chiều, đúng thứ tự. Chọn mức <b>Tô theo → Gợi ý → Thuộc lòng</b> để lên trình dần nha.</p></div></div>
      <div class="write-layout"><div data-main></div><div class="card write-list" data-list></div></div></div>`;
    const main = root.querySelector('[data-main]'), listEl = root.querySelector('[data-list]');

    function drawList() {
      listEl.innerHTML = `<div class="seg w100" style="display:flex">${Object.keys(LISTS).map(t => `<button class="${t === tab ? 'active' : ''}" data-tab="${t}" style="flex:1;justify-content:center">${{ hira: 'Hiragana', kata: 'Katakana', kanji: 'Kanji', mine: 'Đã chọn' }[t]}</button>`).join('')}</div>
        ${LISTS[tab].map(g => `<div class="wl-head">${g[0]}</div><div class="wl-grid">${g[1].map(x => `<button class="wl-c ${x.k === cur.k ? 'on' : ''} ${x.k.length > 1 ? 'small' : ''} ${wclass(x)}" data-k="${x.k}" data-nosfx="1">${x.k}</button>`).join('')}</div>`).join('')}
        <p class="tiny muted bold mt">Chấm vàng: đang luyện · chấm xanh: đã thuộc</p>`;
    }
    function drawMain() {
      clearTimeout(timer); wp && wp.destroy(); sv && sv.stop();
      const isK = tab === 'kanji';
      const c = !isK && SJ.confusables ? SJ.confusables(cur.k) : { list: [] };
      main.innerHTML = `<div class="card write-main pop-in">
        <div class="write-head"><span class="wh-k kana">${cur.k}</span><div class="grow"><div class="wh-r">${esc(cur.r)}</div><div class="wh-sub">${esc(cur.sub || '')}</div></div>${U().sayBtn(isK ? cur.o.ex[0].kana : cur.k)}</div>
        <div class="row between wrap gap mb"><div class="seg" data-mode>${[['guide', 'Tô theo'], ['hint', 'Gợi ý'], ['free', 'Thuộc lòng']].map(x => `<button data-m="${x[0]}" class="${x[0] === mode ? 'active' : ''}">${x[1]}</button>`).join('')}</div>
          <span class="combo-pill">${I('fire', 18)} Chuỗi viết đẹp: <b data-combo>${combo}</b></span></div>
        <div class="write-grid2">
          <div class="write-side"><div class="mini-label">Thứ tự nét</div><div class="stroke-box sm" data-sv></div><div class="row gap-s wrap center-row"><button class="btn btn-sm btn-white" data-a="demo">${I('play', 16)} Xem</button><button class="btn btn-sm btn-white" data-a="slow">${I('slow', 18)} Chậm</button></div></div>
          <div><div data-pad></div>
            <div class="pad-tools"><button class="btn btn-sm btn-white" data-a="prev" aria-label="Chữ trước">${I('arrow_l', 18)}</button><button class="btn btn-sm btn-white" data-a="hint">${I('bulb', 18)} Gợi ý nét</button><button class="btn btn-sm btn-white" data-a="again">${I('refresh', 18)} Viết lại</button><button class="btn btn-sm btn-white" data-a="next" aria-label="Chữ sau">${I('arrow_r', 18)}</button></div>
            <div class="row center-row mt-s"><label class="switch small"><input type="checkbox" data-auto ${auto ? 'checked' : ''}><i></i><span>Viết đẹp thì tự sang chữ mới</span></label></div>
            <div data-res class="mt"></div></div>
        </div>
        ${isK ? `<div class="mnemo mt">${I('bulb', 26)}<span>${esc(cur.o.tip)}</span></div>` : cur.o.m ? `<div class="mnemo mt">${I('bulb', 26)}<span>${esc(cur.o.m)}</span></div>` : ''}
        ${c.list.length ? `<div class="warn-note mt">${I('eye', 26)}<div><b>Dễ nhầm với:</b> <span class="jp">${c.list.join('、')}</span>${c.tip ? `<div class="small muted mt-s">${esc(c.tip)}</div>` : ''}</div></div>` : ''}
      </div>`;
      sv = SJ.writing.strokeView(main.querySelector('[data-sv]'), cur.k);
      const res = main.querySelector('[data-res]');
      wp = SJ.writing.pad(main.querySelector('[data-pad]'), cur.k, {
        mode, onDone: r => {
          const v = SJ.lesson.onWriteDone(r, cur.k, res);
          combo = r.score >= 70 ? combo + 1 : 0;
          main.querySelector('[data-combo]').textContent = combo;
          if (combo && combo % 5 === 0) { SJ.audio.sfx('combo'); U().toast(`${I('fire', 26)} Chuỗi viết đẹp ${combo} chữ! +5 XP`); SJ.store.addXP(5); }
          res.insertAdjacentHTML('beforeend', `<div class="row center-row gap-s mt-s"><button class="btn btn-sm btn-white" data-a="again">${I('refresh', 16)} Viết lại</button><button class="btn btn-sm" data-a="next">Chữ tiếp theo ${I('arrow_r', 16)}</button></div>`);
          if (auto && r.score >= 70) timer = setTimeout(() => go(1), 1700);
          drawList();
          return v;
        },
      });
      SJ.audio.speak(isK ? cur.o.ex[0].kana : cur.k);
    }
    function go(d) {
      const f = flat(tab); const i = f.findIndex(x => x.k === cur.k);
      cur = f[(i + d + f.length) % f.length];
      history.replaceState(null, '', '#/write/' + encodeURIComponent(cur.k));
      drawList(); drawMain();
    }
    root.addEventListener('click', e => {
      const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; cur = flat(tab)[0]; drawList(); drawMain(); return; }
      const c = e.target.closest('.wl-c'); if (c) { cur = flat(tab).find(x => x.k === c.dataset.k); history.replaceState(null, '', '#/write/' + encodeURIComponent(cur.k)); drawList(); drawMain(); if (window.innerWidth < 1020) main.scrollIntoView({ behavior: 'smooth' }); return; }
      const sm = e.target.closest('[data-m]'); if (sm) { mode = sm.dataset.m; SJ.store.setSetting('writeMode', mode); main.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('active', b === sm)); wp.setMode(mode); main.querySelector('[data-res]').innerHTML = ''; return; }
      const a = e.target.closest('[data-a]'); if (!a) return;
      const act = a.dataset.a;
      if (act === 'demo') sv.play();
      if (act === 'slow') { sv.stop(); sv = SJ.writing.strokeView(main.querySelector('[data-sv]'), cur.k, { speed: 0.45 }); }
      if (act === 'hint') wp.hint();
      if (act === 'again') { clearTimeout(timer); wp.restart(); main.querySelector('[data-res]').innerHTML = ''; }
      if (act === 'next') go(1);
      if (act === 'prev') go(-1);
    });
    root.addEventListener('change', e => { if (e.target.matches('[data-auto]')) { auto = e.target.checked; if (!auto) clearTimeout(timer); } });
    drawList(); drawMain();
    return { destroy() { clearTimeout(timer); wp && wp.destroy(); sv && sv.stop(); SJ.pages.writeList = null; } };
  }
  P.write = write;

  // ===================== TRÒ CHƠI =====================
  P.games = function (root) {
    root.innerHTML = `<div class="page">
      <div class="page-head"><div class="ph-icon">${I('game', 52)}</div><div><h1>Trò chơi</h1><p>Vừa chơi vừa nhớ chữ. Mỗi lượt chơi được cộng XP và cá vàng — phá kỷ lục để nhận con dấu 新記録 nha!</p></div></div>
      <div class="game-grid">${SJ.games.list.map(g => `<a class="card hov tile-card" href="#/game/${g.id}" style="--tc:${g.color}"><span class="tc-ico">${I(g.icon, 52)}</span><b>${g.name}</b><small>${g.desc}</small>
        <span class="tc-foot">${SJ.games.bestLabel(g.id) ? `<span class="gc-best">${I('trophy', 16)} ${SJ.games.bestLabel(g.id)}</span>` : '<span class="tag">Chưa chơi</span>'}</span></a>`).join('')}</div>
      <div class="card card-pad hero-strip mt-l">${U().mascot('cheer', 86)}<div class="grow"><h2>Muốn luyện không ngừng?</h2><p>Chế độ Luyện tập vô tận ưu tiên chữ bạn hay sai, có chuỗi đúng liên tiếp.</p></div><a class="btn" href="#/practice">${I('infinity', 22)} Luyện ngay</a></div></div>`;
  };

  // ===================== ÔN TẬP (SRS) =====================
  function cardData(key) {
    if (key.startsWith('v:')) { const o = SJ.VOCAB_MAP[key]; return o && { front: `<div class="word jp">${esc(o.jp)}</div>`, say: SJ.ui.reading(o.jp), back: `<div>${I(o.e, 76)}</div><div class="bold" style="color:var(--pri-t);font-size:18px">${esc(o.r)}</div><div class="q-mean">${esc(o.vi)}</div>` }; }
    // từ lưu từ truyện đọc (Sổ từ): [chữ Nhật, romaji, nghĩa]
    if (key.startsWith('w:')) { const w = SJ.STORIES.flatMap(s => s.words).find(x => 'w:' + x[0] === key); return w && { front: `<div class="word jp">${SJ.ui.ruby(w[0])}</div>`, say: SJ.ui.reading(w[0]), back: `<div class="bold" style="color:var(--pri-t);font-size:18px">${esc(w[1])}</div><div class="q-mean">${esc(w[2])}</div>` }; }
    if (key.startsWith('j:')) { const o = SJ.KANJI_MAP[key.slice(2)]; return o && { front: `<div class="big">${o.k}</div>`, say: o.ex[0].kana, back: `<div class="hv-badge">${o.hv}</div><div class="q-mean">${esc(o.m)}</div><div class="jp muted">${o.on} · ${o.kun}</div><div class="muted small bold">${esc(o.ex[0].jp)} (${o.ex[0].kana}) = ${esc(o.ex[0].vi)}</div>` }; }
    const o = SJ.KANA_MAP[key]; return o && { front: `<div class="big">${o.k}</div>`, say: o.k, back: `<div class="lc-romaji">${o.r}</div><div class="muted bold">Đọc gần giống: ${esc(o.v || o.r)}</div><div class="mnemo" style="text-align:left">${I('bulb', 22)}<span>${esc(o.m)}</span></div>` };
  }
  P.review = function (root) {
    let queue = [], i = 0, done = 0, keyFn = null, srs = true;
    const onKey = e => { if (keyFn && !document.querySelector('.modal-back')) keyFn(e); };
    document.addEventListener('keydown', onKey);
    function menu() {
      keyFn = null; document.body.classList.remove('focus-mode');
      const S = SJ.store.get();
      const due = SJ.store.dueKeys(), all = SJ.store.srsKeys(), favs = Object.keys(S.fav);
      const boxes = [0, 0, 0, 0];
      all.forEach(k => { const b = S.srs[k].box; boxes[b <= 0 ? 0 : b <= 2 ? 1 : b <= 4 ? 2 : 3]++; });
      root.innerHTML = `<div class="page-narrow">
        <div class="page-head"><div class="ph-icon">${I('brain', 52)}</div><div><h1>Ôn tập thông minh</h1><p>Thẻ nhớ tự lặp lại đúng lúc bạn sắp quên. Ôn mỗi ngày vài phút là nhớ rất lâu!</p></div></div>
        ${all.length ? `<div class="card card-pad row gap wrap">${U().ring(all.length ? (all.length - due.length) / all.length * 100 : 0, 104, `<b>${due.length}</b><small>cần ôn</small>`, 'var(--lav)')}
          <div class="grow stat-grid">${[['seed', 'Mới', boxes[0]], ['sprout', 'Đang nhớ', boxes[1]], ['tulip', 'Khá chắc', boxes[2]], ['sakura', 'Thuộc lòng', boxes[3]]].map(b => `<div class="stat-box">${I(b[0], 34)}<div><b>${b[2]}</b><span>${b[1]}</span></div></div>`).join('')}</div></div>
          <div class="grid grid-2 mt">${due.length ? `<button class="btn btn-lg" data-start="due">${I('refresh', 22)} Ôn ${Math.min(30, due.length)} thẻ đến hạn</button>` : `<div class="card card-sm row gap">${U().mascot('love', 56)}<b>Hôm nay ôn xong hết rồi! Giỏi quá đi!</b></div>`}
            <button class="btn btn-lg btn-white" data-start="free">${I('dice', 22)} Ôn tự do (${Math.min(20, all.length)} thẻ)</button></div>`
          : `<div class="card card-pad center pad-xl">${U().mascot('wink', 110)}<h3>Chưa có thẻ nào cả</h3><p class="muted bold">Học xong một bài, các chữ trong bài sẽ tự động thành thẻ nhớ ở đây nha!</p><a class="btn" href="#/lesson/${SJ.store.nextLesson().id}">${I('book', 22)} Học bài đầu tiên</a></div>`}
        <div class="section-label">${I('heart', 26)} Từ đã lưu <small>${favs.length} từ</small></div>
        ${favs.length ? `<button class="btn btn-white btn-block" data-start="fav">${I('cards', 22)} Lật thẻ các từ đã lưu</button>` : `<div class="card card-sm muted bold">Bấm nút trái tim ở Sổ từ hoặc trong bài học để lưu từ vào đây.</div>`}
        <div class="card card-pad hero-strip mt-l">${U().mascot('cheer', 80)}<div class="grow"><h2>Ôn mãi không chán?</h2><p>Luyện tập vô tận trộn đọc – nghe – viết, có chuỗi đúng liên tiếp.</p></div><a class="btn btn-lav" href="#/practice">${I('infinity', 22)} Luyện vô tận</a></div>
      </div>`;
      root.querySelectorAll('[data-start]').forEach(b => b.onclick = () => {
        const t = b.dataset.start;
        srs = t !== 'fav';
        queue = t === 'due' ? due.slice(0, 30) : t === 'fav' ? U().shuffle(favs).slice(0, 30) : U().sample(all, 20);
        i = 0; done = 0; document.body.classList.add('focus-mode'); show();
      });
    }
    function show() {
      if (i >= queue.length) return finish();
      const key = queue[i], d = cardData(key);
      if (!d) { i++; return show(); }
      let flipped = false;
      root.innerHTML = `<div class="practice">
        <div class="game-top"><button class="icon-btn" data-quit aria-label="Thoát">${I('batsu', 20)}</button>${U().bar(i / queue.length * 100, 'lav grow')}<div class="g-score">${i + 1}/${queue.length}</div></div>
        <div class="flash" data-card><div class="flash-inner"><div class="flash-face card">${d.front}<div class="muted small bold mt">Bấm để lật thẻ</div></div><div class="flash-face flash-back card">${d.front}${d.back}</div></div></div>
        <div class="grade-row hidden" data-grades>
          <button class="btn btn-red" data-g="0">Quên<small>gặp lại ngay</small></button>
          <button class="btn btn-yel" data-g="1">Mang máng<small>sớm thôi</small></button>
          <button class="btn btn-green" data-g="2">Nhớ rồi<small>lâu sau</small></button></div>
        <p class="center muted small bold mt">Phím tắt: Space = lật · 1 2 3 = chấm</p></div>`;
      const card = root.querySelector('[data-card]'), grades = root.querySelector('[data-grades]');
      const flip = () => { if (flipped) return; flipped = true; card.classList.add('flipped'); grades.classList.remove('hidden'); SJ.audio.sfx('flip'); setTimeout(() => SJ.audio.speak(d.say), 250); };
      card.onclick = flip;
      root.querySelector('[data-quit]').onclick = () => finish();
      grades.onclick = e => { const b = e.target.closest('[data-g]'); if (b) grade(+b.dataset.g); };
      function grade(g) {
        if (!flipped) return;
        if (srs) SJ.store.gradeSRS(key, g); else SJ.store.track('review');
        SJ.store.rec(key, g > 0);
        if (g === 0) queue.push(key);
        done++; SJ.store.addXP(1); SJ.audio.sfx(g === 2 ? 'ok' : g === 1 ? 'tap' : 'bad');
        i++; show();
      }
      keyFn = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } else if (/^[123]$/.test(e.key)) grade(+e.key - 1); };
    }
    function finish() {
      keyFn = null; document.body.classList.remove('focus-mode');
      root.innerHTML = `<div class="page-narrow result pop-in"><div class="result-mochi">${U().mascot('love', 140, 'jump')}</div><h1>Ôn tập xong!</h1>
        <div class="result-stats"><div class="rs card">${I('cards', 30)}<b>${done}</b><span>thẻ đã ôn</span></div><div class="rs card">${I('star', 30)}<b>+${done}</b><span>XP</span></div><div class="rs card">${I('fire', 30)}<b>${SJ.store.streakNow()}</b><span>ngày liên tiếp</span></div></div>
        <div class="row gap wrap center-row"><button class="btn btn-white" data-back>${I('brain', 22)} Về Ôn tập</button><a class="btn btn-lg" href="#/practice">${I('infinity', 24)} Luyện tiếp</a></div></div>`;
      root.querySelector('[data-back]').onclick = menu;
      if (done >= 5) { SJ.audio.sfx('win'); U().confetti(50); }
    }
    menu();
    return { destroy() { document.removeEventListener('keydown', onKey); document.body.classList.remove('focus-mode'); } };
  };

  // ===================== HỒ SƠ =====================
  P.profile = function (root) {
    const draw = () => {
      const S = SJ.store.get(), st = S.settings;
      const lv = SJ.store.level();
      const done = Object.values(S.lessons).filter(l => l.done).length;
      const kanaM = SJ.KANA_ALL.filter(o => o.group !== 'small' && SJ.store.mastery(o.k) === 2).length;
      const words = SJ.VOCAB_ALL.filter(o => S.items[o.key]).length;
      const kanji = SJ.KANJI.filter(o => S.items[o.key]).length;
      const days = SJ.store.lastDays(7 * 18);
      const pad0 = days[0].d.getDay();
      const heat = Array(pad0).fill('<i style="visibility:hidden"></i>').concat(days.map(d => `<i class="${d.frozen ? 'fz' : d.xp >= 60 ? 'h4' : d.xp >= 30 ? 'h3' : d.xp >= 15 ? 'h2' : d.xp ? 'h1' : ''}" title="${d.key}: ${d.xp} XP"></i>`)).join('');
      const weak = Object.keys(S.items).filter(k => SJ.KANA_MAP[k] && S.items[k].w > 0).sort((a, b) => SJ.store.weakness(b) - SJ.store.weakness(a)).slice(0, 12);
      root.innerHTML = `<div class="page-mid">
        <div class="card prof-hero"><a class="ph-ava" href="#/shop" title="Thay đồ cho Mochi">${U().mascot('happy', 120, 'bob')}</a>
          <div class="grow"><div class="row gap-s wrap"><h1 data-name>${esc(S.name || 'Bạn nhỏ')}</h1><button class="btn btn-sm btn-ghost" data-edit>${I('pencil', 18)} Đổi tên</button></div>
            <div class="bold muted">${I(lv.icon, 22)} Cấp ${lv.level} · ${lv.title} · tham gia từ ${new Date(S.created).toLocaleDateString('vi-VN')}</div>
            <div class="mt-s">${U().bar(lv.pct, 'sun')}</div><div class="small muted bold mt-s">${S.xp} XP${lv.next ? ` · còn ${lv.toNext} XP để lên cấp ${lv.level + 1}` : ' · cấp tối đa!'}</div></div></div>
        <div class="stat-grid">
          ${[['fire', SJ.store.streakNow(), 'ngày liên tiếp'], ['volcano', S.streak.best, 'chuỗi dài nhất'], ['star', S.xp, 'tổng XP'], ['fishcoin', S.fish, 'cá vàng'], ['book', done, 'bài đã học'], ['kana', kanaM, 'Kana đã thuộc'], ['speech', words, 'từ đã gặp'], ['torii', kanji, 'Kanji đã gặp'], ['pencil', S.written, 'chữ đã viết'], ['scroll', Object.keys(S.reads).length, 'bài đã đọc'], ['keyboard', S.typed, 'từ đã gõ'], ['chain', S.bestChain, 'chuỗi đúng kỷ lục']]
          .map(x => `<div class="card stat-box">${I(x[0], 36)}<div><b>${x[1]}</b><span>${x[2]}</span></div></div>`).join('')}</div>
        <div class="card card-pad mt"><div class="card-title">${I('calendar', 28)} Lịch học 18 tuần</div><div class="heat">${heat}</div><div class="legend mt-s">Ít <i style="background:var(--bg2)"></i><i style="background:color-mix(in srgb,var(--pri) 30%,var(--card))"></i><i style="background:color-mix(in srgb,var(--pri) 55%,var(--card))"></i><i style="background:color-mix(in srgb,var(--pri) 80%,var(--card))"></i><i style="background:var(--pri-d)"></i> Nhiều · <i style="background:var(--sky-l);border-color:var(--sky)"></i> bùa giữ chuỗi</div></div>
        ${weak.length ? `<div class="card card-pad mt"><div class="card-title">${I('target', 28)} Chữ hay nhầm <a class="more" href="#/practice/read">Luyện ngay</a></div><div class="weak-list">${weak.map(k => `<button class="chip-kana" data-k="${k}">${k}<small>sai ${S.items[k].w}</small></button>`).join('')}</div></div>` : ''}
        <div class="card card-pad mt"><div class="card-title">${I('medal', 28)} Huy hiệu <span class="small muted bold">${Object.keys(S.badges).length}/${SJ.store.BADGES.length}</span></div>
          <div class="badge-grid">${SJ.store.BADGES.map(b => { const at = S.badges[b.id], d = at > 1e12 ? new Date(at) : null;
            return `<div class="badge ${at ? 'got' : 'locked'}" title="${esc(b.desc)}"><span class="bd-medal"><span class="bd-tail l"></span><span class="bd-tail r"></span><span class="bd-disc">${I(b.icon, 40)}</span>${at ? '' : `<span class="bd-lock">${I('lock', 26)}</span>`}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small>${d ? `<span class="bd-date">${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}</span>` : ''}</div>`; }).join('')}</div></div>
        <div class="card card-pad mt"><div class="card-title">${I('nametag', 28)} Tên tiếng Nhật của bạn</div>${SJ.lesson.nameWidget()}</div>
        <div class="card card-pad mt"><div class="card-title">${I('gear', 28)} Cài đặt</div>
          <div class="set-row"><div class="sr-l"><b>Âm thanh</b><small>Tiếng chuông, đàn koto, mèo kêu…</small></div><label class="switch"><input type="checkbox" data-set="sound" ${st.sound ? 'checked' : ''}><i></i></label></div>
          <div class="set-row"><div class="sr-l"><b>Sensei Mochi (AI)</b><small>${SJ.ai && SJ.ai.hasKey() ? 'Đang dùng ' + SJ.ai.modelName() + '. Khoá API chỉ lưu trong trình duyệt này' : 'Dán khoá API Anthropic để trò chuyện, sửa câu, luyện nói với Mochi'}</small></div><div class="row gap-s wrap"><a class="btn btn-sm btn-white" href="#/sensei">${I('sensei', 18)} Mở</a><button class="btn btn-sm btn-white" data-ai-settings>${SJ.glyph('key', 18)} Cài đặt</button></div></div>
          <div class="set-row"><div class="sr-l"><b>Hiệu ứng chuyển động</b><small>Màn chào đón, chuyển trang, Mochi nhảy nhót… Tắt nếu máy chạy chậm hoặc bạn thấy chóng mặt</small></div><label class="switch"><input type="checkbox" data-set="motion" ${st.motion !== 'reduce' ? 'checked' : ''}><i></i></label></div>
          <div class="set-row"><div class="sr-l"><b>Trang trí theo mùa</b><small>Lá phong mùa thu, tuyết mùa đông, hoa anh đào mùa xuân rơi nhẹ trên màn hình</small></div><label class="switch"><input type="checkbox" data-set="season" ${st.season !== false ? 'checked' : ''}><i></i></label></div>
          <div class="set-row"><div class="sr-l"><b>Mochi đi dạo trên màn hình</b><small>Mochi đi lững thững, nói chuyện — nắm kéo, thả rơi, ném bay được luôn</small></div><label class="switch"><input type="checkbox" data-set="pet" ${st.pet !== false ? 'checked' : ''}><i></i></label></div>
          <div class="set-row"><div class="sr-l"><b>Âm lượng hiệu ứng</b></div><input class="range" style="max-width:220px" type="range" min="0.1" max="1" step="0.05" value="${esc(st.volume ?? 0.8)}" data-set="volume"><div class="row gap-s">${['ok', 'meow', 'win', 'coin', 'bad'].map(x => `<button class="btn btn-sm btn-white" data-test="${x}">${I({ ok: 'maru', meow: 'cat', win: 'music', coin: 'fishcoin', bad: 'batsu' }[x], 18)}</button>`).join('')}</div></div>
          <div class="set-row"><div class="sr-l"><b>Tốc độ giọng đọc</b><small>Chậm giúp nghe rõ từng âm</small></div><div class="seg">${[[0.6, 'Chậm'], [0.85, 'Vừa'], [1, 'Nhanh']].map(r => `<button data-rate="${r[0]}" class="${Math.abs(st.rate - r[0]) < .01 ? 'active' : ''}">${r[1]}</button>`).join('')}</div><button class="btn btn-sm btn-white" data-say="こんにちは、モチです">${I('speaker', 18)} Thử</button></div>
          <div class="set-row"><div class="sr-l"><b>Mục tiêu mỗi ngày</b></div><div class="seg">${[10, 20, 30, 50].map(g => `<button data-goal="${g}" class="${S.goal === g ? 'active' : ''}">${g} XP</button>`).join('')}</div></div>
          <div class="set-row"><div class="sr-l"><b>Màu giao diện</b></div><div class="theme-dots">${[['sakura', '#ff6b9a', 'Hoa anh đào'], ['matcha', '#4cbf7a', 'Trà xanh'], ['sora', '#4a9dff', 'Bầu trời'], ['yuzu', '#ff9a3c', 'Quả yuzu'], ['yoru', '#2a2339', 'Ban đêm']].map(t => `<button class="theme-dot ${st.theme === t[0] ? 'active' : ''}" style="background:${t[1]}" data-theme="${t[0]}" title="${t[2]}" aria-label="${t[2]}"></button>`).join('')}</div></div>
          <div class="set-row"><div class="sr-l"><b>Kiểu chữ mẫu</b><small>Chữ viết tay giống sách giáo khoa Nhật — dễ tập viết</small></div><div class="seg">${[['klee', 'Viết tay'], ['maru', 'Chữ tròn']].map(f => `<button data-kfont="${f[0]}" class="${st.kfont === f[0] ? 'active' : ''}"><span class="${f[0] === 'klee' ? 'kana' : 'jp'}" style="font-family:${f[0] === 'klee' ? 'var(--f-kana)' : 'var(--f-jp)'}">あア</span> ${f[1]}</button>`).join('')}</div></div>
          <div class="set-row"><div class="sr-l"><b>Sao lưu tiến độ</b><small>Chuyển sang máy khác bằng mã sao lưu</small></div><div class="row gap-s wrap"><button class="btn btn-sm btn-white" data-act="export">${I('download', 18)} Xuất</button><button class="btn btn-sm btn-white" data-act="import">${I('upload', 18)} Nhập</button><button class="btn btn-sm btn-white" data-act="intro">${I('flag_jp', 18)} Xem lại giới thiệu</button><button class="btn btn-sm btn-red" data-act="reset">${I('trash', 18)} Xoá hết</button></div></div>
        </div></div>`;
      SJ.lesson.bindNameWidget(root);
    };
    root.onclick = async e => {
      const S = SJ.store.get();
      const t = e.target;
      const k = t.closest('[data-k]'); if (k) { kanaDetail(SJ.KANA_MAP[k.dataset.k]); return; }
      const ts = t.closest('[data-test]'); if (ts) { SJ.audio.sfx(ts.dataset.test); return; }
      const r = t.closest('[data-rate]'); if (r) { SJ.store.setSetting('rate', +r.dataset.rate); draw(); SJ.audio.speak('はい'); return; }
      const g = t.closest('[data-goal]'); if (g) { SJ.store.set('goal', +g.dataset.goal); const q = SJ.store.quests()[0]; if (q && q.id === 'xp' && !q.done) { q.target = +g.dataset.goal; SJ.store.save(); SJ.store.track('xp', 0); } draw(); return; }
      const th = t.closest('[data-theme]'); if (th) { SJ.store.setSetting('theme', th.dataset.theme); draw(); return; }
      const kf = t.closest('[data-kfont]'); if (kf) { SJ.store.setSetting('kfont', kf.dataset.kfont); draw(); return; }
      if (t.closest('[data-edit]')) { const n = prompt('Tên của bạn:', S.name || ''); if (n != null && n.trim()) { SJ.store.set('name', n.trim().slice(0, 30)); draw(); SJ.app.renderNav(); } return; }
      const a = t.closest('[data-act]'); if (!a) return;
      if (a.dataset.act === 'export') {
        const code = SJ.store.exportData();
        const m = U().modal(`<h3>Mã sao lưu</h3><p class="muted bold">Sao chép đoạn mã này và dán vào "Nhập" trên máy khác.</p><textarea class="input" rows="6" readonly>${code}</textarea><button class="btn btn-block mt" data-copy>${I('check', 20)} Sao chép</button>`, { cls: 'modal-sm' });
        m.el.querySelector('[data-copy]').onclick = () => { const ta = m.el.querySelector('textarea'); ta.select(); try { navigator.clipboard.writeText(code); } catch (er) { document.execCommand('copy'); } U().toast('Đã sao chép mã sao lưu!'); };
      }
      if (a.dataset.act === 'import') {
        const m = U().modal(`<h3>Nhập mã sao lưu</h3><textarea class="input" rows="6" placeholder="Dán mã vào đây…"></textarea><button class="btn btn-block mt" data-go>${I('upload', 20)} Khôi phục</button>`, { cls: 'modal-sm' });
        m.el.querySelector('[data-go]').onclick = () => { try { SJ.store.importData(m.el.querySelector('textarea').value); m.close(); U().toast('Khôi phục tiến độ thành công!'); } catch (er) { U().toast('Mã không hợp lệ, kiểm tra lại nha'); } };
      }
      if (a.dataset.act === 'intro') P.intro(true);
      if (a.dataset.act === 'reset' && await U().confirm('Xoá toàn bộ tiến độ học? Không thể hoàn tác đâu đó!', 'Xoá hết', 'Thôi')) { SJ.store.reset(); U().toast('Đã xoá tiến độ. Bắt đầu lại nào!'); }
    };
    root.onchange = e => {
      const s = e.target.closest('[data-set]'); if (!s) return;
      if (s.dataset.set === 'sound') SJ.store.setSetting('sound', s.checked);
      if (s.dataset.set === 'pet') SJ.store.setSetting('pet', s.checked);
      if (s.dataset.set === 'season') SJ.store.setSetting('season', s.checked);
      if (s.dataset.set === 'motion') SJ.store.setSetting('motion', s.checked ? 'full' : 'reduce');
      if (s.dataset.set === 'volume') { SJ.store.setSetting('volume', +s.value); SJ.audio.sfx('ok'); }
    };
    draw();
  };

  // ===================== GIỚI THIỆU (lần đầu vào web) =====================
  P.intro = function (again) {
    if (document.querySelector('.intro')) return;
    const S = SJ.store.get();
    let step = 0, goal = S.goal || 30;
    const box = document.createElement('div');
    box.className = 'intro';
    document.body.appendChild(box);
    const slides = [
      () => `${U().mascot('cheer', 190, 'bob')}<h1><span class="jp">はじめまして！</span><br>Mình là mèo Mochi</h1><p>Chào mừng đến ${U().brand('SubelJapan')} — nơi bạn học đọc và viết tiếng Nhật từ con số 0. Mỗi ngày chỉ 5–10 phút, nhẹ nhàng mà chắc chắn!</p>`,
      () => `<h1>Tiếng Nhật có 3 bộ chữ</h1><p>Đừng lo, mình sẽ đi từng bước một — bắt đầu từ Hiragana.</p>
        <div class="scripts3">${[['あ', 'Hiragana', 'Chữ mềm mại, dùng nhiều nhất', 'var(--pri)'], ['ア', 'Katakana', 'Chữ góc cạnh cho từ nước ngoài', 'var(--sky)'], ['日', 'Kanji', 'Chữ Hán — có âm Hán Việt!', 'var(--sun)']].map(x => `<button class="card script-card hov" data-say="${x[0] === '日' ? 'にち' : x[0]}" style="border-color:${x[3]}"><div class="sc-k" style="color:${x[3]}">${x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div>
        <p class="small mt">Bấm vào từng chữ để nghe nha!</p>`,
      () => `<h1>Học ở đây có gì vui?</h1>
        <div class="feat-list">${[['book', '56 bài học siêu ngắn'], ['pencil', 'Luyện viết chấm từng nét'], ['scroll', 'Truyện đọc & hội thoại'], ['keyboard', 'Tập gõ phím tiếng Nhật'], ['game', '9 trò chơi luyện chữ'], ['sensei', 'Gia sư AI Sensei Mochi'], ['cards', 'Thẻ ghi nhớ lật 3D'], ['brain', 'Thẻ nhớ ôn đúng lúc'], ['quest', 'Nhiệm vụ mỗi ngày'], ['shop', 'Tiệm đồ cho Mochi']].map(f => `<div>${I(f[0], 34)}<span>${f[1]}</span></div>`).join('')}</div>`,
      () => `${U().mascot('love', 120)}<h1>Bạn tên là gì?</h1>
        <input class="input" id="in-name" maxlength="30" placeholder="Tên của bạn…" value="${esc(S.name || '')}" autocomplete="off" style="max-width:360px;text-align:center">
        <div class="gs-label">Mục tiêu mỗi ngày</div>
        <div class="goal-opts">${[[10, 'turtle', 'Nhẹ nhàng', '~5 phút'], [20, 'rabbit', 'Vừa phải', '~10 phút'], [30, 'fox', 'Chăm chỉ', '~15 phút'], [50, 'dragon', 'Siêu cấp', '~25 phút']].map(g => `<button class="goal-opt ${g[0] === goal ? 'active' : ''}" data-goal="${g[0]}">${I(g[1], 40)}<span><b>${g[2]}</b><small>${g[0]} XP · ${g[3]}</small></span></button>`).join('')}</div>`,
    ];
    function draw() {
      box.innerHTML = `<div class="intro-top">${step ? `<button class="lesson-x" data-back aria-label="Quay lại">${I('arrow_l', 24)}</button>` : ''}<div class="intro-dots">${slides.map((s, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>${again ? `<button class="lesson-x" data-close aria-label="Đóng">${I('batsu', 22)}</button>` : ''}</div>
        <div class="intro-body pop-in">${slides[step]()}</div>
        <div class="intro-foot">${step === slides.length - 1 ? `<button class="btn btn-lg btn-block btn-cat" data-next>${U().ears()}Bắt đầu hành trình!</button>` : '<button class="btn btn-lg btn-block" data-next>Tiếp tục</button>'}</div>`;
      const inp = box.querySelector('#in-name'); if (inp) setTimeout(() => inp.focus(), 200);
    }
    function finish() {
      const inp = box.querySelector('#in-name');
      const n = (inp && inp.value.trim()) || S.name || 'Bạn nhỏ';
      SJ.store.set('goal', goal); SJ.store.set('name', n.slice(0, 30)); SJ.store.set('intro', true);
      const q = SJ.store.quests()[0]; if (q && q.id === 'xp' && !q.done) { q.target = goal; SJ.store.save(); SJ.store.track('xp', 0); }
      box.remove(); SJ.audio.sfx('win'); U().confetti();
      U().toast(`<span class="jp">よろしく</span>, ${esc(n)}! Cùng học bài đầu tiên nào`);
      if (!again) location.hash = '#/'; SJ.app.refresh();
    }
    box.addEventListener('click', e => {
      const g = e.target.closest('[data-goal]'); if (g) { goal = +g.dataset.goal; box.querySelectorAll('[data-goal]').forEach(x => x.classList.toggle('active', x === g)); SJ.audio.sfx('tap'); return; }
      if (e.target.closest('[data-back]')) { step--; draw(); return; }
      if (e.target.closest('[data-close]')) { box.remove(); return; }
      if (e.target.closest('[data-next]')) { if (step < slides.length - 1) { step++; SJ.audio.sfx('flip'); draw(); } else finish(); }
    });
    box.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'in-name') finish(); });
    SJ.audio.sfx('meow2');
    draw();
  };
})(window.SJ);
