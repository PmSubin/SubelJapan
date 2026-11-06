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
  };
  const NAV = [
    ['', 'home', 'Học'], ['chart', 'kana', 'Bảng chữ'], ['write', 'pencil', 'Luyện viết'], ['practice', 'infinity', 'Luyện tập'],
    ['read', 'scroll', 'Đọc hiểu'], ['type', 'keyboard', 'Gõ phím'], ['games', 'game', 'Trò chơi'], ['review', 'brain', 'Ôn tập'],
    '-', ['dict', 'magnifier', 'Sổ từ'], ['print', 'printer', 'Phiếu tập viết'], ['quests', 'quest', 'Nhiệm vụ'], ['shop', 'shop', 'Tiệm Mochi'],
  ];
  const BOTTOM = ['', 'chart', 'write', 'practice'];
  const FOCUS = { lesson: 1, game: 1, story: 0 };

  function parse() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/');
    return { name: parts[0] || '', arg: parts.length > 1 ? decodeURIComponent(parts.slice(1).join('/')) : undefined };
  }

  function route() {
    const { name, arg } = parse();
    if (current && current.destroy) { try { current.destroy(); } catch (e) { console.error(e); } }
    SJ.audio.stop();
    const view = U.$('#view');
    curName = routes[name] ? name : '';
    view.className = 'view view-in view-' + (curName || 'home');
    view.innerHTML = '';
    view.onclick = null; view.onchange = null; view.oninput = null;
    document.body.classList.toggle('focus-mode', !!FOCUS[name] || (name === 'practice' && !!arg));
    try { current = routes[curName](view, arg) || null; }
    catch (e) { console.error(e); view.innerHTML = `<div class="page-narrow center pad-xl">${U.mascot('sad', 110)}<h2>Ối, có lỗi nhỏ xảy ra</h2><p class="muted">${U.esc(e.message)}</p><a class="btn" href="#/">Về trang chủ</a></div>`; }
    window.scrollTo(0, 0);
    renderNav();
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
    U.$('#bottombar').innerHTML = BOTTOM.map(k => { const n = NAV.find(x => x[0] === k); return `<a href="#/${k}" class="${k === active ? 'active' : ''}"><span class="bb-ico">${I(n[1], 28)}</span><span>${n[2]}</span></a>`; }).join('')
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
  SJ.on('quest', q => { setTimeout(() => { U.toast(`${I(q.icon, 34)}<div><b>Xong nhiệm vụ!</b><br><span class="small">${U.esc(SJ.store.questText(q))} — nhận ${q.fish} cá ở mục Nhiệm vụ</span></div>`, 3400); SJ.audio.sfx('quest'); }, 700); });
  SJ.on('bonus', b => { setTimeout(() => { U.toast(`${I('chest_open', 38)}<div><b>Phá màn thưởng!</b><br><span class="small">${U.esc(b.title)} — +12 cá, +8 XP</span></div>`, 3600); SJ.audio.sfx('chest'); U.confetti(70); }, 900); });
  SJ.on('weekly', q => { setTimeout(() => { U.toast(`${I('calendar', 34)}<div><b>Xong thử thách tuần!</b><br><span class="small">${U.esc(SJ.store.weekText(q))} — nhận ${q.fish} cá ở mục Nhiệm vụ</span></div>`, 3600); SJ.audio.sfx('quest'); }, 1100); });
  SJ.on('badge', b => { setTimeout(() => { U.toast(`<div class="toast-badge">${I(b.icon, 44)}<div><b>Huy hiệu mới!</b><br>${b.name} <span class="small">(+10 cá)</span></div></div>`, 3400); SJ.audio.sfx('level'); }, 1200); });
  SJ.on('level', lv => {
    setTimeout(() => {
      SJ.audio.sfx('level'); U.confetti(110);
      const m = U.modal(`<div class="levelup"><div class="lu-top">${U.mascot('cheer', 150, 'jump')}<span class="lu-badge">${I(lv.icon, 46)}</span></div><div class="lu-kicker">Lên cấp!</div><h2>Cấp ${lv.level} · ${lv.title}</h2><p>Bạn giỏi quá đi! Mochi tặng bạn <b>20 cá vàng</b> làm quà nè.</p><div class="lu-gift">${I('fishcoin', 30)}<b>+20</b></div><button class="btn btn-lg btn-block" data-ok>Yay! Tiếp tục</button></div>`, { cls: 'modal-sm' });
      m.el.querySelector('[data-ok]').onclick = () => m.close();
    }, 1000);
  });
  SJ.on('goal', g => { setTimeout(() => { U.toast(`${I('target', 30)} Xong mục tiêu hôm nay (${g} XP)! +10 cá`, 3400); U.confetti(60); SJ.audio.sfx('sparkle'); }, 400); });
  SJ.on('streak', n => { if (n > 1) setTimeout(() => U.toast(`${I('fire', 28)} Chuỗi ${n} ngày liên tiếp! Giữ lửa nhé!`, 3000), 1400); });
  SJ.on('settings', k => { if (k === 'theme' || k === 'kfont') applyTheme(); });
  SJ.on('change', k => { if (k === 'reset' || k === 'import') { applyTheme(); route(); } });

  function init() {
    applyTheme();
    window.addEventListener('hashchange', route);
    route();
    const S = SJ.store.get();
    if (!S.intro) setTimeout(() => SJ.pages.intro(), 250);
    const fz = SJ.store.freezeUsed();
    if (fz) setTimeout(() => U.toast(`${I('omamori', 34)} Bùa giữ chuỗi đã bảo vệ chuỗi ${SJ.store.streakNow()} ngày của bạn!`, 4400), 1200);
    else if (S.name && !SJ.store.doneToday() && SJ.store.streakNow() > 0) {
      setTimeout(() => U.toast(`${I('fire', 28)} Bạn đang có chuỗi ${SJ.store.streakNow()} ngày — học một chút hôm nay để giữ lửa nha!`, 4400), 1500);
    }
  }

  SJ.app = { refresh: route, applyTheme, renderNav, current: () => curName };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window.SJ);
