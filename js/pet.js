/* SubelJapan — Mochi đi dạo trên màn hình
 * Đi lững thững, chạy, ngồi, ngủ, nhảy, nói chuyện; bấm vào để nghe "nya~";
 * NẮM KÉO được (kéo lên cao rồi thả → rơi bịch xuống, ném mạnh → bay nảy vào tường). */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const LINES = [
    ['にゃー！', 'Nyaa~'], ['がんばって！', 'Cố lên nha!'], ['いっしょに べんきょう しよう', 'Cùng học nào!'], ['おなか すいた…', 'Đói bụng quá…'],
    ['ねむい…', 'Buồn ngủ ghê…'], ['すごい！', 'Bạn giỏi quá!'], ['おさかな たべたい', 'Muốn ăn cá~'], ['だいじょうぶ！', 'Sai cũng không sao!'],
    ['', 'Nắm kéo mình đi chơi được đó!'], ['', 'Bấm vào mình đi~'], ['よろしくね', 'Mong được giúp đỡ nha'], ['きょうも いい ひ', 'Hôm nay đẹp trời ghê'],
    ['ひらがな たのしい', 'Hiragana vui ghê'], ['まいにち すこしずつ', 'Mỗi ngày một chút nha'], ['', 'Ném mình lên cao thử xem!'],
  ];
  const G = 2300;
  let el, flip, tilt, bub, shadow, on = false, raf = 0, last = 0;
  let x = 0, y = -120, vx = 0, vy = 0, dir = 1, state = 'air', mood = 'wow', baseMood = 'normal', timer = 1, rot = 0, size = 76;
  let held = null, moodT = 0, talkT = 0, bubT = 0, sinceTalk = 0, flyT = 0;
  const isReduced = () => SJ.store.get().settings.motion === 'reduce';
  // để máy yên lâu (không chạm, gõ, cuộn): Mochi ngủ say, dừng hẳn vòng lặp và cử động cho máy đỡ tốn pin; chạm / gõ là dậy
  const NAP_AFTER = 45000;
  let lastAct = performance.now(), napping = false;
  // Mochi ngồi / ngủ / đứng yên: tắt vòng vẽ 60 hình/giây (trình duyệt khỏi phải vẽ lại cả trang), hẹn giờ cử động tiếp
  let restT = 0, restAt = 0, slowT = 0;
  function sched(slow) { if (slow) { raf = -1; slowT = setTimeout(() => { slowT = 0; if (raf === -1) raf = requestAnimationFrame(step); }, 22); } else raf = requestAnimationFrame(step); }
  function unsched() { if (raf > 0) cancelAnimationFrame(raf); clearTimeout(slowT); slowT = 0; raf = 0; }
  function rest(sec) { unsched(); clearTimeout(restT); restAt = performance.now(); restT = setTimeout(resume, Math.max(60, sec * 1000)); }
  function resume() {
    if (restT) { clearTimeout(restT); restT = 0; const e = (performance.now() - restAt) / 1000; timer -= e; if (moodT > 0) moodT = Math.max(0.001, moodT - e); if (bubT > 0) bubT = Math.max(0.001, bubT - e); sinceTalk += e; }
    if (!el || napping || raf || document.hidden) return;
    last = 0; sched();
  }
  function nap() { if (napping || !el || held) return; clearTimeout(restT); restT = 0; napping = true; state = 'sleep'; timer = 1e9; baseMood = 'sleep'; moodT = 0; setMood('sleep'); bub && bub.classList.remove('show'); cls(); unsched(); }
  function wake() { lastAct = performance.now(); if (!napping) return; napping = false; if (!el) return; setState('idle', 1.2); if (!document.hidden) { unsched(); last = 0; sched(); } }
  ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(ev => window.addEventListener(ev, () => { if (on) wake(); else lastAct = performance.now(); }, { passive: true, capture: true }));

  // đo khung cho Mochi đi: đọc vị trí phần tử bắt trình duyệt tính lại bố cục, nên chỉ đo lại mỗi ~0,4 giây
  // hoặc khi đổi trang / đổi cỡ cửa sổ — không đo ở mọi khung hình
  let bCache = null, bAt = 0;
  const bnds = now => { if (!bCache || now - bAt > 400) { bCache = bounds(); bAt = now; } return bCache; };
  const bReset = () => { bCache = null; };
  function bounds() {
    const fm = document.body.classList.contains('focus-mode');
    const v = document.querySelector('.view');
    const left = !fm && v ? Math.max(0, v.getBoundingClientRect().left) : 0;
    let floor = window.innerHeight;
    const foot = document.querySelector('.lesson-foot');
    if (foot && foot.childElementCount) floor = Math.min(floor, foot.getBoundingClientRect().top);
    const bb = document.querySelector('.bottombar');
    if (bb && !fm && getComputedStyle(bb).display !== 'none') floor = Math.min(floor, bb.getBoundingClientRect().top);
    return { left: left + 2, right: window.innerWidth - size - 2, floor: floor - size + 2, top: 0 };
  }
  function render() { flip.innerHTML = U().mascot(mood, size, 'pet-svg'); }
  function setMood(m) { if (m !== mood) { mood = m; render(); } }
  function tempMood(m, t) { moodT = t; setMood(m); resume(); }
  function cls() {
    el.className = 'pet ' + state + (dir < 0 ? ' left' : '') + (held && state !== 'held' ? ' held' : '') + (napping ? ' nap' : '');
  }
  const STATE_MOOD = { walk: 'normal', run: 'happy', idle: 'normal', sit: 'wink', sleep: 'sleep', air: 'wow', held: 'wow' };
  function setState(s, t) {
    state = s; timer = t || 2;
    baseMood = STATE_MOOD[s] || 'normal';
    if (s === 'sit') baseMood = Math.random() < .5 ? 'wink' : 'happy';
    if (moodT <= 0) setMood(baseMood);
    cls();
  }
  function pickNext() {
    if (isReduced()) return setState('sit', 9);
    const r = Math.random();
    if (r < 0.42) { dir = Math.random() < .5 ? -1 : 1; setState('walk', rnd(3, 7)); }
    else if (r < 0.55) { dir = Math.random() < .5 ? -1 : 1; setState('run', rnd(1.2, 2.4)); }
    else if (r < 0.75) setState('sit', rnd(3, 6));
    else if (r < 0.85) setState('sleep', rnd(7, 13));
    else if (r < 0.93) hop(rnd(520, 760), rnd(-160, 160));
    else setState('idle', rnd(1.5, 3));
  }
  function hop(power, svx) {
    if (held) return;
    vy = -(power || 560); vx = svx || 0; state = 'air'; flyT = 0; cls();
    if (moodT <= 0) setMood('happy');
    resume();
  }
  function say(jp, vi, t) {
    if (!on || napping) return;
    bub.innerHTML = (jp ? `<span class="jp">${U().esc(jp)}</span>` : '') + (vi ? `<span>${U().esc(vi)}</span>` : '');
    bub.classList.add('show');
    bubT = t || 3.6; sinceTalk = 0;
    resume();
  }
  function hearts(n) {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < (n || 4); i++) {
      const h = document.createElement('span');
      h.className = 'pet-heart';
      h.innerHTML = SJ.icon(i % 3 === 2 ? 'star' : 'heart', 22);
      h.style.left = (r.left + r.width / 2 - 11 + rnd(-18, 18)) + 'px';
      h.style.top = (r.top + 6) + 'px';
      h.style.setProperty('--hx', rnd(-36, 36) + 'px');
      h.style.animationDelay = (i * 0.08) + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1400);
    }
  }
  function land(v, B) {
    y = B.floor;
    const speed = v;
    vy = 0; vx *= 0.25;
    if (speed > 420) { el.classList.remove('landing'); void el.offsetWidth; el.classList.add('landing'); setTimeout(() => el && el.classList.remove('landing'), 520); }
    if (speed > 1500) { SJ.audio.sfx('bad'); tempMood('wow', 1.6); say('にゃっ！？', 'Chóng mặt quá~', 2.6); setState('sit', 2.6); return; }
    if (speed > 420) SJ.audio.sfx('pop');
    setState('idle', rnd(0.8, 1.6));
  }

  function step(now) {
    if (!el) return; // Mochi đã bị tắt: dừng hẳn vòng lặp
    sched(!held && (state === 'walk' || state === 'run'));
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
    const B = bnds(now);
    if (held) {
      x = held.tx; y = held.ty;
      rot += (clamp(-held.vx * 0.018, -30, 30) - rot) * 0.2;
    } else if (state === 'air') {
      flyT += dt;
      vy += G * dt; x += vx * dt; y += vy * dt;
      if (x < B.left) { x = B.left; vx = Math.abs(vx) * 0.55; dir = 1; cls(); if (Math.abs(vx) > 300) SJ.audio.sfx('tap'); }
      if (x > B.right) { x = B.right; vx = -Math.abs(vx) * 0.55; dir = -1; cls(); if (Math.abs(vx) > 300) SJ.audio.sfx('tap'); }
      if (y < B.top) { y = B.top; vy = Math.abs(vy) * 0.35; }
      rot += (clamp(vx * 0.03, -45, 45) - rot) * 0.15;
      if (y >= B.floor && vy >= 0) land(vy, B);
    } else {
      rot += (0 - rot) * 0.25;
      if (y < B.floor - 3) { state = 'air'; vy = 0; cls(); }
      else y = B.floor;
      if (state === 'walk' || state === 'run') {
        x += dir * (state === 'run' ? 125 : 42) * dt;
        if (x <= B.left) { x = B.left; dir = 1; cls(); }
        if (x >= B.right) { x = B.right; dir = -1; cls(); }
      } else x = clamp(x, B.left, B.right);
      timer -= dt;
      if (timer <= 0) pickNext();
    }
    if (!held && state !== 'air' && now - lastAct > NAP_AFTER && !isReduced()) { nap(); return; }
    if (moodT > 0) { moodT -= dt; if (moodT <= 0) setMood(baseMood); }
    if (bubT > 0) { bubT -= dt; if (bubT <= 0) bub.classList.remove('show'); }
    sinceTalk += dt;
    if (sinceTalk > 35 && state !== 'sleep' && !held && !isReduced()) { const l = U().pick(LINES); say(l[0], l[1]); }
    // chỉ ghi lại kiểu dáng khi có thay đổi (Mochi ngồi / ngủ yên thì không đụng tới trang)
    const h = clamp((B.floor - y) / 420, 0, 1);
    const pos = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`, tl = `rotate(${rot.toFixed(1)}deg)`;
    const sh = `translate(${(x + size / 2 - 26).toFixed(1)}px, ${(B.floor + size - 9).toFixed(1)}px) scale(${(1 - h * 0.7).toFixed(2)})`, so = (1 - h * 0.8).toFixed(2);
    if (pos !== W.pos) { el.style.transform = W.pos = pos; const L = x > window.innerWidth - 200, R = x < 120; if (L !== W.L) bub.classList.toggle('to-left', W.L = L); if (R !== W.R) bub.classList.toggle('to-right', W.R = R); }
    if (tl !== W.tl) tilt.style.transform = W.tl = tl;
    if (sh !== W.sh) shadow.style.transform = W.sh = sh;
    if (so !== W.so) shadow.style.opacity = W.so = so;
    if (!held && (state === 'sit' || state === 'sleep' || state === 'idle') && Math.abs(rot) < 0.05 && y >= B.floor - 0.5) {
      const nx = Math.min(timer, moodT > 0 ? moodT : 99, bubT > 0 ? bubT : 99, Math.max(0.2, 35.05 - sinceTalk), Math.max(0.2, (NAP_AFTER - (now - lastAct)) / 1000 + 0.05));
      if (nx > 0.25) rest(nx);
    }
  }
  let W = {};

  // ---------- nắm kéo ----------
  function down(e) {
    if (e.button && e.button !== 0) return;
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (er) { }
    const now = performance.now();
    held = { ox: e.clientX - x, oy: e.clientY - y, tx: x, ty: y, vx: 0, vy: 0, lx: e.clientX, ly: e.clientY, lt: now, sx: e.clientX, sy: e.clientY, st: now, moved: false };
    state = 'held'; cls(); resume();
    tempMood('wow', 0.7);
    setTimeout(() => { if (held && !held.moved) { tempMood('love', 30); } else if (held) tempMood('happy', 30); }, 650);
  }
  function move(e) {
    if (!held) return;
    const now = performance.now(), dt = Math.max(8, now - held.lt) / 1000;
    const B = bounds();
    held.vx = held.vx * 0.5 + ((e.clientX - held.lx) / dt) * 0.5;
    held.vy = held.vy * 0.5 + ((e.clientY - held.ly) / dt) * 0.5;
    held.lx = e.clientX; held.ly = e.clientY; held.lt = now;
    held.tx = clamp(e.clientX - held.ox, B.left, B.right);
    held.ty = clamp(e.clientY - held.oy, B.top, B.floor);
    if (!held.moved && Math.hypot(e.clientX - held.sx, e.clientY - held.sy) > 6) { held.moved = true; SJ.audio.sfx('meow2'); }
  }
  function up() {
    if (!held) return;
    const h = held; held = null;
    moodT = 0;
    const now = performance.now();
    if (!h.moved && now - h.st < 350) { // bấm nhẹ
      SJ.audio.sfx(Math.random() < .5 ? 'meow' : 'meow2');
      hearts(5); tempMood('love', 1.8); hop(480, 0);
      if (Math.random() < .5) { const l = U().pick(LINES); say(l[0], l[1]); }
      return;
    }
    const still = now - h.lt > 90;
    vx = still ? 0 : clamp(h.vx, -2400, 2400);
    vy = still ? 0 : clamp(h.vy, -2400, 2400);
    state = 'air'; flyT = 0; cls();
    setMood(Math.hypot(vx, vy) > 900 ? 'wow' : 'happy');
    if (Math.hypot(vx, vy) > 1400) say('わーい！', 'Bay nè~', 2);
  }

  function create() {
    size = window.innerWidth < 760 ? 62 : 76;
    el = document.createElement('div');
    el.className = 'pet air';
    el.style.setProperty('--pw', size + 'px');
    el.innerHTML = '<div class="pet-bubble"></div><div class="pet-tilt"><div class="pet-flip"></div></div>';
    shadow = document.createElement('div'); shadow.className = 'pet-shadow';
    document.body.appendChild(shadow); document.body.appendChild(el);
    flip = el.querySelector('.pet-flip'); tilt = el.querySelector('.pet-tilt'); bub = el.querySelector('.pet-bubble');
    const B = bounds();
    x = rnd(B.left + 40, Math.max(B.left + 41, B.right - 40)); y = -size - 20; vy = 200; vx = 0; dir = 1;
    mood = ''; setMood('wow');
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('contextmenu', e => e.preventDefault());
    last = 0; W = {}; bReset(); sched();
    setTimeout(() => say('やっほー！', 'Mochi đi dạo cùng bạn nè~'), 1400);
  }
  function destroy() { unsched(); clearTimeout(restT); restT = 0; napping = false; el && el.remove(); shadow && shadow.remove(); el = null; }
  function setOn(v) {
    if (v && !on) { on = true; create(); }
    else if (!v && on) { on = false; destroy(); }
  }

  // ---------- phản ứng với việc học ----------
  SJ.on('answer', a => {
    if (!on || held) return;
    wake();
    if (a.ok) { if (state !== 'air') hop(a.streak >= 3 ? 700 : 480, 0); tempMood(a.streak >= 5 ? 'cheer' : 'happy', 1.6); if (a.streak && a.streak % 5 === 0) { hearts(6); say('すごい！', `Đúng ${a.streak} câu liền!`); } }
    else { tempMood('sad', 1.8); if (Math.random() < .5) say('だいじょうぶ', 'Không sao, thử lại nha!', 2.4); }
  });
  SJ.on('level', () => { if (!on) return; hop(820, 0); hearts(8); tempMood('cheer', 3); say('レベルアップ！', 'Lên cấp rồi nè!'); });
  SJ.on('quest', () => { if (!on) return; hop(600, 0); say('やったね！', 'Xong nhiệm vụ!'); });
  SJ.on('look', () => { if (on) render(); });
  SJ.on('settings', k => { if (k === 'pet') setOn(SJ.store.get().settings.pet !== false); });
  document.addEventListener('visibilitychange', () => {
    if (!on) return;
    // huỷ vòng cũ trước khi chạy vòng mới (tạo Mochi lúc tab đang ẩn → không bị 2 vòng lặp chạy song song)
    unsched();
    raf = 0;
    if (!document.hidden && !napping && !restT) { last = 0; sched(); }
  });
  window.addEventListener('hashchange', () => { bReset(); setTimeout(() => { bReset(); if (on) resume(); }, 700); });
  window.addEventListener('resize', () => { bReset(); if (!on) return; resume(); const ns = window.innerWidth < 760 ? 62 : 76; if (ns !== size) { size = ns; el.style.setProperty('--pw', size + 'px'); render(); } });

  function init() {
    const go = () => setOn(SJ.store.get().settings.pet !== false);
    // đợi màn chào đón xong rồi Mochi mới nhảy vào
    if (document.querySelector('.welcome')) { let once = false; SJ.on('welcome-done', () => { if (!once) { once = true; setTimeout(go, 300); } }); }
    else go();
  }
  SJ.pet = { setOn, say, hop, nap, wake, isOn: () => on, state: () => ({ x, y, vx, vy, state, mood, napping }) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 0);
})(window.SJ);
