/* SubelJapan — Bộ định tuyến & khởi động ứng dụng */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = SJ.ui, I = (n, s, c) => SJ.icon(n, s, c);
  let current = null;

  const routes = {
    '': (r) => SJ.pages.home(r),
    learn: (r) => SJ.pages.learn(r),
    lesson: (r, a) => SJ.lesson.open(r, a),
    chart: (r) => SJ.pages.chart(r),
    write: (r, a) => SJ.pages.write(r, a),
    games: (r) => SJ.pages.games(r),
    game: (r, a) => SJ.games.run(a, r),
    practice: (r, a) => SJ.practice.open(r, a),
    review: (r) => SJ.pages.review(r),
    profile: (r) => SJ.pages.profile(r),
  };
  const NAV = [
    ['', 'home', 'Trang chủ'], ['learn', 'learn', 'Bài học'], ['write', 'pencil', 'Luyện viết'], ['practice', 'infinity', 'Luyện tập'],
    ['games', 'game', 'Trò chơi'], ['review', 'brain', 'Ôn tập'], ['chart', 'kana', 'Bảng chữ'],
  ];
  const BOTTOM = ['', 'learn', 'write', 'practice', 'games', 'review'];

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
    view.className = 'view view-' + (name || 'home');
    view.innerHTML = '';
    view.onclick = null; view.onchange = null;
    const fn = routes[name] || routes[''];
    document.body.classList.toggle('focus-mode', name === 'lesson' || name === 'game' || (name === 'practice' && !!arg));
    try { current = fn(view, arg) || null; } catch (e) { console.error(e); view.innerHTML = `<div class="container center pad-xl">${U.mascot('sad', 110)}<h2>Ối, có lỗi nhỏ xảy ra</h2><p class="muted">${U.esc(e.message)}</p><a class="btn" href="#/">Về trang chủ</a></div>`; }
    window.scrollTo(0, 0);
    renderNav(name);
  }

  function renderNav(active) {
    const S = SJ.store.get();
    const due = SJ.store.dueKeys().length;
    const lv = SJ.store.level();
    U.$('#nav').innerHTML = NAV.map(n => `<a href="#/${n[0]}" class="${n[0] === active ? 'active' : ''}">${I(n[1], 24)}<span>${n[2]}</span>${n[0] === 'review' && due ? `<i class="dot-num">${due}</i>` : ''}</a>`).join('');
    U.$('#bottombar').innerHTML = BOTTOM.map(k => { const n = NAV.find(x => x[0] === k); return `<a href="#/${k}" class="${k === active ? 'active' : ''}"><span class="bb-ico">${I(n[1], 28)}</span><span class="bb-lbl">${n[2]}</span>${k === 'review' && due ? `<i class="dot-num">${due}</i>` : ''}</a>`; }).join('');
    U.$('#top-stats').innerHTML = `
      <a class="chip chip-streak ${SJ.store.doneToday() ? 'lit' : ''}" href="#/profile" title="Chuỗi ngày học">${I('fire', 22)}<b>${SJ.store.streakNow()}</b></a>
      <a class="chip chip-xp" href="#/profile" title="Tổng XP">${I('star', 22)}<b>${S.xp}</b></a>
      <a class="chip chip-avatar" href="#/profile" title="Hồ sơ">${U.mascot('happy', 30)}<span class="lv">${lv.level}</span></a>`;
  }

  function applyTheme() { document.documentElement.dataset.theme = SJ.store.get().settings.theme || 'sakura'; }

  SJ.on('xp', () => renderNav(parse().name));
  SJ.on('badge', b => { setTimeout(() => { U.toast(`<div class="toast-badge">${I(b.icon, 44)}<div><b>Huy hiệu mới!</b><br>${b.name}</div></div>`, 3400); SJ.audio.sfx('level'); }, 600); });
  SJ.on('level', lv => {
    setTimeout(() => {
      SJ.audio.sfx('level'); U.confetti(110);
      const m = U.modal(`<div class="center levelup">${U.mascot('love', 130, 'jump')}<div class="lu-icon">${I(lv.icon, 72)}</div><h2 class="title-hand">Lên cấp ${lv.level}!</h2><p>Bạn đã trở thành <b>${lv.title}</b>. Mochi tự hào về bạn quá đi!</p><button class="btn btn-lg btn-block" data-ok>Yay! Tiếp tục ${I('rocket', 22)}</button></div>`, { cls: 'modal-sm' });
      m.el.querySelector('[data-ok]').onclick = () => m.close();
    }, 900);
  });
  SJ.on('goal', g => { setTimeout(() => { U.toast(`${I('target', 26)} Hoàn thành mục tiêu hôm nay (${g} XP)! Giỏi quá đi`, 3400); U.confetti(60); SJ.audio.sfx('sparkle'); }, 300); });
  SJ.on('streak', n => { if (n > 1) setTimeout(() => U.toast(`${I('fire', 26)} Chuỗi ${n} ngày liên tiếp! Giữ lửa nhé!`, 3000), 1200); });

  function init() {
    applyTheme();
    U.petals();
    window.addEventListener('hashchange', route);
    route();
    if (SJ.store.get().name && !SJ.store.doneToday() && SJ.store.streakNow() > 0) {
      setTimeout(() => U.toast(`${I('fire', 26)} Bạn đang có chuỗi ${SJ.store.streakNow()} ngày — học một chút hôm nay để không mất chuỗi nha!`, 4400), 1500);
    }
  }

  SJ.app = { refresh: route, applyTheme, renderNav };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window.SJ);
