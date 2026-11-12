/* SubelJapan — Bộ định tuyến, khung ứng dụng (thanh bên / thanh dưới) & sự kiện toàn cục */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = SJ.ui, I = (n, s, c) => SJ.icon(n, s, c);
  let current = null, curName = '';

  const P = () => SJ.pages;
  const routes = {
    '': r => P().home(r),
    learn: r => P().home(r),
    lesson: (r, a) => SJ.lesson.open(r, a),
    chart: r => P().chart(r),
    write: (r, a) => P().write(r, a),
    practice: (r, a) => SJ.practice.open(r, a),
    read: (r, a) => P().read(r, a),
    story: (r, a) => P().story(r, a),
    dialog: (r, a) => P().dialog(r, a),
    type: (r, a) => P().typing(r, a),
    games: r => P().games(r),
    game: (r, a) => SJ.games.run(a, r),
    review: r => P().review(r),
    dict: r => P().dict(r),
    print: r => P().print(r),
    shop: r => P().shop(r),
    quests: r => P().quests(r),
    profile: r => P().profile(r),
    cards: (r, a) => SJ.cards.open(r, a),
    sensei: (r, a) => SJ.ai.page(r, a),
    talk: (r, a) => SJ.talk.page(r, a),
    how: r => SJ.plan.howPage(r),
  };
  const NAV = [
    ['', 'home', 'Học'], ['talk', 'talk', 'Nói & Ngữ pháp'], ['sensei', 'sensei', 'Sensei Mochi'], ['chart', 'kana', 'Bảng chữ'], ['write', 'pencil', 'Luyện viết'], ['practice', 'infinity', 'Luyện tập'],
    ['read', 'scroll', 'Đọc hiểu'], ['type', 'keyboard', 'Gõ phím'], ['games', 'game', 'Trò chơi'], ['cards', 'cards', 'Thẻ ghi nhớ'], ['review', 'brain', 'Ôn tập'],
    '-', ['dict', 'magnifier', 'Sổ từ'], ['print', 'printer', 'Phiếu tập viết'], ['quests', 'quest', 'Nhiệm vụ'], ['shop', 'shop', 'Tiệm Mochi'],
  ];
  const BOTTOM = ['', 'talk', 'sensei', 'write', 'practice'];
  const SHORT = { sensei: 'Sensei', practice: 'Luyện tập', write: 'Luyện viết', talk: 'Nói' };
  const FOCUS = { lesson: 1, game: 1, story: 0 };

  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k); // tránh #/constructor, #/toString… khớp nhầm Object.prototype
  function parse() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/');
    let arg = parts.length > 1 ? parts.slice(1).join('/') : undefined;
    if (arg !== undefined) try { arg = decodeURIComponent(arg); } catch (e) { /* địa chỉ có % lỗi → giữ nguyên */ }
    return { name: parts[0] || '', arg };
  }

  // ---------- chuyển trang có hoạt ảnh ----------
  let lastPt = { x: window.innerWidth / 2, y: window.innerHeight / 2 }, firstRoute = true, busy = false;
  document.addEventListener('pointerdown', e => { lastPt = { x: e.clientX, y: e.clientY }; }, true);
  const reduced = () => SJ.store.get().settings.motion === 'reduce';
  const isFocus = (name, arg) => (own(FOCUS, name) && !!FOCUS[name]) || ((name === 'practice' || name === 'cards' || name === 'talk') && !!arg && !(name === 'talk' && arg === 'book'));
  function route() {
    // tấm màn đang kéo: lúc kéo xong sẽ tự vẽ trang theo địa chỉ mới nhất (không vẽ 2 lần)
    if (busy) return;
    const { name, arg } = parse();
    const goFocus = isFocus(name, arg), wasFocus = document.body.classList.contains('focus-mode');
    if (firstRoute || reduced()) { firstRoute = false; return doRoute(); }
    // vào bài học / trò chơi: tấm màn mochi lan ra từ chỗ bấm
    if (goFocus && !wasFocus) return curtain(doRoute);
    // chuyển trang thường: trượt mượt (View Transitions), lùi thì trượt ngược
    document.documentElement.dataset.vt = wasFocus && !goFocus ? 'back' : 'fwd';
    if (document.startViewTransition) {
      try { const t = document.startViewTransition(() => doRoute()); t.ready.catch(() => { }); t.updateCallbackDone.catch(() => { }); t.finished.catch(() => { }).finally(() => { delete document.documentElement.dataset.vt; }); return; } catch (e) { }
    }
    doRoute();
  }
  function curtain(cb) {
    busy = true;
    const c = document.createElement('div');
    c.className = 'curtain';
    c.style.setProperty('--cx', lastPt.x + 'px'); c.style.setProperty('--cy', lastPt.y + 'px');
    c.innerHTML = `<div class="curtain-in"><div class="curtain-mochi">${U.mascot('cheer', 130)}</div><div class="curtain-txt">${U.pick(['Bắt đầu nào!', 'Cố lên nha!', 'がんばって！', 'Học vui nha!', 'Mochi đi cùng bạn!'])}</div></div>`;
    document.body.appendChild(c);
    SJ.audio.sfx('open');
    setTimeout(() => { try { cb(); } finally { c.classList.add('out'); busy = false; } }, 620);
    setTimeout(() => c.remove(), 1300);
  }
  function doRoute() {
    const { name, arg } = parse();
    if (current && current.destroy) { try { current.destroy(); } catch (e) { console.error(e); } }
    SJ.audio.stop();
    // thay khung trang mới mỗi lần → không bị dồn trình xử lý sự kiện cũ
    const old = U.$('#view');
    const view = document.createElement('main');
    view.id = 'view';
    old.replaceWith(view);
    curName = own(routes, name) ? name : '';
    view.className = 'view view-in view-' + (curName || 'home');
    document.body.dataset.route = curName || 'home';
    document.body.classList.toggle('focus-mode', isFocus(name, arg));
    try { current = routes[curName](view, arg) || null; }
    catch (e) { console.error(e); view.innerHTML = `<div class="page-narrow center pad-xl">${U.mascot('sad', 110)}<h2>Ối, có lỗi nhỏ xảy ra</h2><p class="muted">${U.esc(e.message)}</p><a class="btn" href="#/">Về trang chủ</a></div>`; }
    window.scrollTo(0, 0);
    renderNav();
    pauseOffscreen(view);
  }
  // hiệu ứng chạy mãi (mây, cánh hoa, icon nhún nhảy…) ở phần trang đã cuộn khuất: tạm dừng cho máy đỡ nóng, đỡ tốn pin
  let animIO = null;
  function pauseOffscreen(view) {
    if (!('IntersectionObserver' in window)) return;
    if (animIO) animIO.disconnect();
    const io = animIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('anim-off', !e.isIntersecting)), { rootMargin: '160px 0px' });
    const watch = () => { if (animIO === io) view.querySelectorAll('.map-zone, .hello, .unit-banner, .ub-icon').forEach(el => io.observe(el)); };
    watch(); setTimeout(watch, 400);
  }

  const badgeFor = k => {
    if (k === 'review') { const d = SJ.store.dueKeys().length; return d ? `<i class="dot-num">${d > 99 ? '99+' : d}</i>` : ''; }
    if (k === 'quests') { const n = SJ.store.quests().filter(q => q.done && !q.claimed).length + SJ.store.weekly().filter(q => q.done && !q.claimed).length + SJ.store.milestones().filter(m => m.canClaim).length; return n ? `<i class="dot-num">${n}</i>` : ''; }
    return '';
  };
  function renderNav() {
    const S = SJ.store.get();
    const lv = SJ.store.level();
    const active = curName === 'learn' ? '' : curName === 'story' || curName === 'dialog' ? 'read' : curName === 'game' ? 'games' : curName;
    U.$('#nav').innerHTML = NAV.map(n => n === '-' ? '<div class="nav-sep"></div>' : `<a href="#/${n[0]}" class="${n[0] === active ? 'active' : ''}" title="${n[2]}">${I(n[1], 32)}<span>${n[2]}</span>${badgeFor(n[0])}</a>`).join('');
    U.$('#side-foot').innerHTML = `<a class="side-me" href="#/profile" title="Hồ sơ">${U.mascot('happy', 44)}<span class="sm-txt"><b>${U.esc(S.name || 'Bạn nhỏ')}</b><span class="lv">Cấp ${lv.level} · ${lv.title}</span></span></a>`;
    const streak = SJ.store.streakNow();
    const chips = `<a class="chip c-fire ${SJ.store.doneToday() ? '' : 'off'}" href="#/profile" title="Chuỗi ngày học">${I('fire', 24)}<b>${streak}</b></a><a class="chip c-fish" href="#/shop" title="Cá vàng">${I('fishcoin', 24)}<b>${S.fish}</b></a>`;
    U.$('#mtop-stats').innerHTML = chips + `<a class="chip" href="#/profile" title="Hồ sơ" style="padding:2px 6px">${U.mascot('happy', 30)}</a>`;
    const more = !BOTTOM.includes(active);
    const dueAll = SJ.store.dueKeys().length + SJ.store.quests().filter(q => q.done && !q.claimed).length;
    U.$('#bottombar').innerHTML = BOTTOM.map(k => { const n = NAV.find(x => x[0] === k); return `<a href="#/${k}" class="${k === active ? 'active' : ''}"><span class="bb-ico">${I(n[1], 28)}</span><span>${SHORT[k] || n[2]}</span></a>`; }).join('')
      + `<button class="${more ? 'active' : ''}" data-more><span class="bb-ico">${I('more', 28)}</span><span>Thêm</span>${dueAll ? `<i class="dot-num">${dueAll}</i>` : ''}</button>`;
    U.$('#bottombar [data-more]').onclick = moreSheet;
    const logo = U.mascot('happy', 42);
    U.$('#brand-logo').innerHTML = logo; U.$('#brand-logo-m').innerHTML = logo;
  }
  function moreSheet() {
    const items = NAV.filter(n => n !== '-' && !BOTTOM.includes(n[0])).concat([['profile', 'medal', 'Hồ sơ']]);
    const m = U.modal(`<h3 class="center">Tất cả chức năng</h3><div class="sheet-grid">${items.map(n => `<a class="sheet-item" href="#/${n[0]}">${I(n[1], 40)}<span>${n[2]}</span>${badgeFor(n[0])}</a>`).join('')}</div>`, { cls: 'modal-sm' });
    m.el.addEventListener('click', e => { if (e.target.closest('a')) m.close(); });
  }

  function applyTheme() {
    const st = SJ.store.get().settings;
    document.documentElement.dataset.theme = st.theme || 'sakura';
    document.documentElement.dataset.kfont = st.kfont || 'klee';
    document.documentElement.dataset.motion = st.motion || 'full';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#fff5f7';
  }

  // ---------- sự kiện toàn cục ----------
  SJ.on('xp', () => renderNav());
  SJ.on('fish', d => {
    renderNav();
    if (d && d.n > 0 && !d.silent) { U.toast(`${I('fishcoin', 28)} +${d.n} cá vàng!`, 2000); SJ.audio.sfx('coin'); }
    if (curName === '' && SJ.pages.refreshRail) SJ.pages.refreshRail();
  });
  SJ.on('look', () => renderNav());
  SJ.on('quests', () => { renderNav(); if (curName === '' && SJ.pages.refreshRail) SJ.pages.refreshRail(); });
  SJ.on('quest', q => { setTimeout(() => { U.celebrate({ tone: 'mint', icon: q.icon, kicker: 'Xong nhiệm vụ', title: U.esc(SJ.store.questText(q)), sub: 'Bấm để nhận cá ở mục Nhiệm vụ', fish: q.fish, href: '#/quests' }); SJ.audio.sfx('quest'); }, 700); });
  SJ.on('bonus', b => { setTimeout(() => { U.celebrate({ tone: 'coral', icon: 'chest_open', kicker: 'Phá màn thưởng', title: U.esc(b.title), sub: 'Mochi mở rương thưởng cho bạn nè!', fish: 12, xp: 8 }); SJ.audio.sfx('chest'); U.confetti(70); }, 900); });
  SJ.on('weekly', q => { setTimeout(() => { U.celebrate({ tone: 'lav', icon: 'calendar', kicker: 'Xong thử thách tuần', title: U.esc(SJ.store.weekText(q)), sub: 'Bấm để nhận cá ở mục Nhiệm vụ', fish: q.fish, href: '#/quests', ms: 4600 }); SJ.audio.sfx('quest'); }, 1100); });
  SJ.on('badge', b => { setTimeout(() => { U.celebrate({ tone: 'gold', icon: b.icon, kicker: 'Huy hiệu mới', title: U.esc(b.name), sub: U.esc(b.desc), fish: 10, href: '#/profile', ms: 4800 }); SJ.audio.sfx('level'); U.confetti(50); }, 1200); });
  SJ.on('level', lv => {
    setTimeout(() => {
      SJ.audio.sfx('level'); U.confetti(110);
      const m = U.modal(`<div class="levelup"><div class="lu-top">${U.mascot('cheer', 150, 'jump')}<span class="lu-badge">${I(lv.icon, 46)}</span></div><div class="lu-kicker">Lên cấp!</div><h2>Cấp ${lv.level} · ${lv.title}</h2><p>Bạn giỏi quá đi! Mochi tặng bạn <b>20 cá vàng</b> làm quà nè.</p><div class="lu-gift">${I('fishcoin', 30)}<b>+20</b></div><button class="btn btn-lg btn-block btn-cat" data-ok>${U.ears()}Yay! Tiếp tục</button></div>`, { cls: 'modal-sm' });
      m.el.querySelector('[data-ok]').onclick = () => m.close();
    }, 1000);
  });
  SJ.on('goal', g => { setTimeout(() => { U.celebrate({ tone: 'pink', icon: 'target', kicker: 'Xong mục tiêu hôm nay', title: `Đủ ${g} XP rồi nè!`, sub: 'Giỏi quá đi — mai mình học tiếp nha', fish: 10 }); U.confetti(60); SJ.audio.sfx('sparkle'); }, 400); });
  SJ.on('streak', n => { if (n > 1) setTimeout(() => U.celebrate({ tone: 'coral', icon: 'fire', kicker: 'Chuỗi ngày học', title: `${n} ngày liên tiếp!`, sub: 'Lửa đang cháy đều, giữ lửa nhé!', ms: 3600 }), 1400); });
  SJ.on('settings', k => { if (k === 'theme' || k === 'kfont' || k === 'motion') applyTheme(); });
  SJ.on('change', k => { if (k === 'reset' || k === 'import') { applyTheme(); route(); } });
  // store.js không ghi được localStorage (bộ nhớ đầy / trình duyệt chặn): báo một lần mỗi phiên
  let saveWarned = false;
  SJ.on('save-fail', () => { if (saveWarned) return; saveWarned = true; setTimeout(() => U.toast(`${I('lock', 30)}<div><b>Chưa lưu được tiến độ</b><br><span class="small">Bộ nhớ của trình duyệt đã đầy. Hãy xoá bớt dữ liệu trang web hoặc sao lưu tiến độ ở trang Hồ sơ nha.</span></div>`, 6000), 300); });

  /** Màn chào đón: Mochi rơi xuống nhún nhảy, logo bật từng chữ, bấm để vào học */
  function welcome(done) {
    const S = SJ.store.get();
    const g = U.greeting();
    const back = !!S.name;
    const petals = Array.from({ length: 14 }, (_, i) => `<span class="wl-petal" style="--l:${(i * 7.3 + (i % 3) * 4) % 100}%;--d:${6 + (i % 5) * 1.4}s;--w:${-(i * 0.9)}s;--s:${0.7 + (i % 4) * 0.18}">${SJ.deco ? '<b class="wl-fx">' + SJ.deco.particle() + '</b>' : SJ.icon('sakura', 28)}</span>`).join('');
    const logo = Array.from('SubelJapan').map((c, i) => `<span style="--i:${i}" class="${i >= 5 ? 'b' : ''}">${c}</span>`).join('');
    const w = document.createElement('div');
    w.className = 'welcome';
    w.innerHTML = `<div class="wl-bg">${petals}<span class="cloud c1"></span><span class="cloud c2"></span><span class="cloud c3"></span>
      <svg class="wl-hills" viewBox="0 0 600 140" preserveAspectRatio="none" aria-hidden="true"><path class="h1" d="M0 80 Q90 25 190 70 T390 55 T600 65 V140 H0Z"/><path class="h2" d="M0 110 Q140 60 300 100 T600 95 V140 H0Z"/></svg></div>
      <div class="wl-center">
        <div class="wl-mochi"><span class="wl-bubble jp">ようこそ！</span>${U.mascot('happy', 168)}<span class="wl-shadow"></span></div>
        <h1 class="wl-logo" aria-label="SubelJapan">${logo}</h1>
        <div class="wl-sub jp">にほんご、いっしょに がんばろう！</div>
        <div class="wl-hello">${back ? `${g.vi}, <b>${U.esc(S.name)}</b>! Mochi nhớ bạn lắm đó` : 'Học tiếng Nhật dễ như ăn mochi'}</div>
        ${back ? `<div class="wl-stats"><span class="chip c-fire">${SJ.icon('fire', 24)}<b>${SJ.store.streakNow()}</b> ngày</span><span class="chip c-fish">${SJ.icon('fishcoin', 24)}<b>${S.fish}</b> cá</span><span class="chip c-xp">${SJ.icon(SJ.store.level().icon, 24)}<b>Cấp ${SJ.store.level().level}</b></span></div>` : ''}
        <button class="btn btn-lg btn-cat wl-go">${U.ears()}${back ? 'Học tiếp thôi!' : 'Bắt đầu hành trình!'} ${SJ.icon('arrow_r', 22)}</button>
        <div class="wl-tip">bấm vào đâu cũng được nha</div>
      </div>`;
    document.body.appendChild(w);
    try { sessionStorage.setItem('sj_welcome', '1'); } catch (e) { }
    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      SJ.audio.sfx('meow2'); setTimeout(() => SJ.audio.sfx('open'), 180);
      w.classList.add('bye');
      setTimeout(() => { w.remove(); SJ.emit('welcome-done'); done && done(); }, 750);
    };
    setTimeout(() => w.addEventListener('click', close), 400);
    const onKey = e => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { document.removeEventListener('keydown', onKey); close(); } };
    document.addEventListener('keydown', onKey);
  }

  function init() {
    applyTheme();
    window.addEventListener('hashchange', route);
    route();
    const S = SJ.store.get();
    let seen = false; try { seen = sessionStorage.getItem('sj_welcome') === '1'; } catch (e) { }
    if (!seen) welcome(() => { if (!SJ.store.get().intro) SJ.pages.intro(); });
    else { SJ.emit('welcome-done'); if (!S.intro) setTimeout(() => SJ.pages.intro(), 250); }
    const fz = SJ.store.freezeUsed();
    if (fz) setTimeout(() => U.toast(`${I('omamori', 34)} Bùa giữ chuỗi đã bảo vệ chuỗi ${SJ.store.streakNow()} ngày của bạn!`, 4400), 1200);
    else if (S.name && !SJ.store.doneToday() && SJ.store.streakNow() > 0) {
      setTimeout(() => U.toast(`${I('fire', 28)} Bạn đang có chuỗi ${SJ.store.streakNow()} ngày — học một chút hôm nay để giữ lửa nha!`, 4400), 1500);
    }
  }

  SJ.app = { refresh: route, applyTheme, renderNav, current: () => curName };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window.SJ);
