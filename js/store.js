/* SubelJapan — Lưu tiến độ (localStorage), XP, cấp độ, chuỗi ngày, huy hiệu, thẻ nhớ SRS */
window.SJ = window.SJ || {};
(function (SJ) {
  // --- Event bus nho nhỏ ---
  const handlers = {};
  SJ.on = (e, fn) => { (handlers[e] = handlers[e] || []).push(fn); };
  SJ.emit = (e, d) => { (handlers[e] || []).forEach(fn => { try { fn(d); } catch (err) { console.error(err); } }); };

  const KEY ='subeljapan_v1';
  const DAY = 86400000;
  const DEF = () => ({
    name:'', created: Date.now(), xp: 0, goal: 30,
    daily: { date:'', xp: 0 },
    streak: { count: 0, best: 0, last:'' },
    history: {}, lessons: {}, items: {}, srs: {}, games: {}, badges: {},
    written: 0, reviewed: 0, plays: 0, practiced: 0, bestChain: 0, nameUsed: false,
    settings: { sound: true, rate: 0.85, theme:'sakura', poolSet:'hira-basic' },
  });
  let S;

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) ||'{}');
      S = Object.assign(DEF(), raw);
      S.settings = Object.assign(DEF().settings, raw.settings || {});
      S.streak = Object.assign(DEF().streak, raw.streak || {});
      S.daily = Object.assign(DEF().daily, raw.daily || {});
    } catch (e) { S = DEF(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* đầy bộ nhớ */ } }

  const pad = n => String(n).padStart(2,'0');
  const dayKey = (d = new Date()) => d.getFullYear() +'-' + pad(d.getMonth() + 1) +'-' + pad(d.getDate());
  const diffDays = (a, b) => Math.round((Date.parse(b +'T00:00:00') - Date.parse(a +'T00:00:00')) / DAY);

  // --- Cấp độ ---
  const LEVELS = [
    [0,'Hạt giống','seed'], [50,'Mầm non','sprout'], [150,'Chồi xanh','leaf'], [300,'Nụ hoa','tulip'], [500,'Hoa anh đào','sakura'],
    [800,'Học trò chăm chỉ','backpack'], [1200,'Ninja chữ','ninja'], [1700,'Samurai nhí','sword'], [2300,'Thám tử Kanji','magnifier'],
    [3000,'Senpai','cool'], [4000,'Sensei','gradcap'], [5200,'Thần đồng','brain'], [6600,'Rồng vàng','dragon'], [8200,'Phú Sĩ','fuji'], [10000,'Huyền thoại','crown'],
  ];
  function levelInfo(xp) {
    let i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
    const cur = LEVELS[i][0], next = LEVELS[i + 1]? LEVELS[i + 1][0]: null;
    return { level: i + 1, title: LEVELS[i][1], icon: LEVELS[i][2], cur, next, pct: next? Math.round((xp - cur) / (next - cur) * 100): 100, toNext: next? next - xp: 0 };
  }

  // --- Huy hiệu ---
  const lessonDone = id => S.lessons[id] && S.lessons[id].done;
  const unitDone = uid => { const u = SJ.UNITS.find(x => x.id === uid); return u && u.lessons.every(l => lessonDone(l.id)); };
  const countDone = uid => { const u = SJ.UNITS.find(x => x.id === uid); return u? u.lessons.filter(l => lessonDone(l.id)).length: 0; };
  const BADGES = [
    { id:'first', icon:'footprints', name:'Bước đầu tiên', desc:'Hoàn thành bài học đầu tiên', test: () => Object.keys(S.lessons).length >= 1 },
    { id:'five', icon:'backpack', name:'Chăm ngoan', desc:'Hoàn thành 5 bài học', test: () => Object.values(S.lessons).filter(l => l.done).length >= 5 },
    { id:'hira', icon:'sakura', name:'Bậc thầy Hiragana', desc:'Hoàn thành toàn bộ chương Hiragana', test: () => unitDone('hira') },
    { id:'kata', icon:'bolt', name:'Bậc thầy Katakana', desc:'Hoàn thành toàn bộ chương Katakana', test: () => unitDone('kata') },
    { id:'kanji3', icon:'torii', name:'Nhà sưu tầm Kanji', desc:'Hoàn thành 3 bài Kanji', test: () => countDone('kanji') >= 3 },
    { id:'talk', icon:'speech', name:'Nói như người Nhật', desc:'Hoàn thành 5 bài từ vựng', test: () => countDone('vocab') >= 5 },
    { id:'grammar', icon:'puzzle', name:'Thợ ghép câu', desc:'Hoàn thành chương Ngữ pháp', test: () => unitDone('grammar') },
    { id:'perfect', icon:'star', name:'Hoàn hảo', desc:'Đạt 3 sao trong một bài học', test: () => Object.values(S.lessons).some(l => l.stars >= 3) },
    { id:'streak3', icon:'fire', name:'Lửa nhỏ', desc:'Học 3 ngày liên tiếp', test: () => S.streak.best >= 3 },
    { id:'streak7', icon:'volcano', name:'Lửa bùng cháy', desc:'Học 7 ngày liên tiếp', test: () => S.streak.best >= 7 },
    { id:'streak30', icon:'comet', name:'Bất khả chiến bại', desc:'Học 30 ngày liên tiếp', test: () => S.streak.best >= 30 },
    { id:'xp100', icon:'n100', name:'100 XP', desc:'Tích luỹ 100 XP', test: () => S.xp >= 100 },
    { id:'xp1000', icon:'trophy', name:'1000 XP', desc:'Tích luỹ 1000 XP', test: () => S.xp >= 1000 },
    { id:'write10', icon:'write', name:'Cây bút chăm chỉ', desc:'Luyện viết đạt 10 chữ', test: () => S.written >= 10 },
    { id:'write100', icon:'brush', name:'Thư pháp gia', desc:'Luyện viết đạt 100 chữ', test: () => S.written >= 100 },
    { id:'gamer', icon:'game', name:'Game thủ', desc:'Chơi 5 lượt trò chơi', test: () => S.plays >= 5 },
    { id:'review50', icon:'elephant', name:'Trí nhớ voi', desc:'Ôn 50 thẻ nhớ', test: () => S.reviewed >= 50 },
    { id:'chain20', icon:'chain', name:'Chuỗi 20', desc:'Đúng liên tiếp 20 câu trong Luyện tập vô tận', test: () => S.bestChain >= 20 },
    { id:'chain50', icon:'dragon', name:'Rồng chuỗi', desc:'Đúng liên tiếp 50 câu trong Luyện tập vô tận', test: () => S.bestChain >= 50 },
    { id:'name', icon:'nametag', name:'Tên tiếng Nhật', desc:'Xem tên mình bằng Katakana', test: () => S.nameUsed },
    { id:'goal', icon:'target', name:'Đúng hẹn', desc:'Hoàn thành mục tiêu ngày', test: () => Object.values(S.history).some(x => x >= S.goal) },
  ];
  function checkBadges() {
    BADGES.forEach(b => {
      if (!S.badges[b.id] && b.test()) { S.badges[b.id] = Date.now(); save(); SJ.emit('badge', b); }
    });
  }

  // --- Thẻ nhớ SRS (Leitner) ---
  const INTERVALS = [0, 1, 2, 4, 7, 14, 30, 60]; // ngày

  const store = {
    load, save, dayKey, LEVELS, BADGES, levelInfo,
    get: () => S,
    level: () => levelInfo(S.xp),
    streakNow() {
      const t = dayKey();
      if (!S.streak.last) return 0;
      const d = diffDays(S.streak.last, t);
      return d <= 1? S.streak.count: 0;
    },
    doneToday: () => S.streak.last === dayKey(),
    todayXP: () => (S.daily.date === dayKey()? S.daily.xp: 0),
    addXP(n) {
      if (!n) return;
      const t = dayKey();
      const before = levelInfo(S.xp).level;
      const beforeToday = this.todayXP();
      if (S.daily.date!== t) S.daily = { date: t, xp: 0 };
      if (S.streak.last!== t) {
        S.streak.count = (S.streak.last && diffDays(S.streak.last, t) === 1)? S.streak.count + 1: 1;
        S.streak.last = t;
        S.streak.best = Math.max(S.streak.best, S.streak.count);
        SJ.emit('streak', S.streak.count);
      }
      S.xp += n; S.daily.xp += n;
      S.history[t] = (S.history[t] || 0) + n;
      save();
      SJ.emit('xp', { n, total: S.xp });
      const after = levelInfo(S.xp);
      if (after.level > before) SJ.emit('level', after);
      if (beforeToday < S.goal && S.daily.xp >= S.goal) SJ.emit('goal', S.goal);
      checkBadges();
    },
    rec(key, ok) {
      const it = S.items[key] || (S.items[key] = { c: 0, w: 0 });
      ok? it.c++: it.w++;
      it.t = Date.now();
      save();
    },
    seen(key) { if (!S.items[key]) { S.items[key] = { c: 0, w: 0, t: Date.now() }; save(); } },
    /** 0 = chưa học, 1 = đang học, 2 = đã thuộc */
    mastery(key) {
      const it = S.items[key];
      if (!it) return 0;
      return (it.c >= 4 && it.c / (it.c + it.w) >= 0.75)? 2: 1;
    },
    weakness(key) { const it = S.items[key]; return it? (it.w * 2 + 1) / (it.c + 1): 1.5; },
    completeLesson(id, pct) {
      const L = S.lessons[id] || (S.lessons[id] = { done: false, stars: 0, best: 0, count: 0 });
      const first =!L.done;
      const stars = pct >= 100? 3: pct >= 80? 2: 1;
      L.done = true; L.count++; L.stars = Math.max(L.stars, stars); L.best = Math.max(L.best, pct); L.at = Date.now();
      save();
      const xp = first? 10 + stars * 5: 4 + stars * 2;
      this.addXP(xp);
      checkBadges();
      return { stars, xp, first };
    },
    lessonState: id => S.lessons[id] || null,
    nextLesson() { return SJ.LESSONS.find(l =>!lessonDone(l.id)) || SJ.LESSONS[SJ.LESSONS.length - 1]; },
    addSRS(keys) {
      const now = Date.now();
      keys.forEach(k => { if (!S.srs[k]) S.srs[k] = { box: 0, due: now }; });
      save();
    },
    gradeSRS(key, g) {
      const it = S.srs[key] || (S.srs[key] = { box: 0, due: Date.now() });
      const now = Date.now();
      if (g === 0) { it.box = 0; it.due = now + 5 * 60000; }
      else if (g === 1) { it.box = Math.max(1, it.box); it.due = now + Math.max(0.4, INTERVALS[it.box] / 2) * DAY; }
      else { it.box = Math.min(INTERVALS.length - 1, it.box + 1); it.due = now + INTERVALS[it.box] * DAY; }
      S.reviewed++;
      save();
      checkBadges();
    },
    dueKeys() {
      const now = Date.now();
      return Object.keys(S.srs).filter(k => S.srs[k].due <= now).sort((a, b) => S.srs[a].due - S.srs[b].due);
    },
    srsKeys: () => Object.keys(S.srs),
    setBest(id, score, lowerIsBetter) {
      const old = S.games[id];
      const better = old == null || (lowerIsBetter? score < old: score > old);
      if (better) S.games[id] = score;
      S.plays++;
      save(); checkBadges();
      return better;
    },
    addWritten() { S.written++; save(); checkBadges(); },
    setChain(n) { if (n > S.bestChain) { S.bestChain = n; save(); checkBadges(); } },
    addPracticed() { S.practiced++; },
    markName() { if (!S.nameUsed) { S.nameUsed = true; save(); checkBadges(); } },
    set(k, v) { S[k] = v; save(); SJ.emit('change', k); },
    setSetting(k, v) { S.settings[k] = v; save(); SJ.emit('settings', k); },
    reset() { S = DEF(); save(); SJ.emit('change','reset'); },
    exportData: () => btoa(unescape(encodeURIComponent(JSON.stringify(S)))),
    importData(str) {
      const obj = JSON.parse(decodeURIComponent(escape(atob(str.trim()))));
      if (typeof obj!=='object' || obj.xp == null) throw new Error('bad');
      localStorage.setItem(KEY, JSON.stringify(obj)); load(); SJ.emit('change','import');
    },
    checkBadges,
    /** Số ngày đã học trong N ngày gần nhất (cho lịch chuỗi) */
    lastDays(n) {
      const out = [];
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * DAY); const k = dayKey(d);
        out.push({ key: k, d, xp: S.history[k] || 0 });
      }
      return out;
    },
  };
  load();
  SJ.store = store;
})(window.SJ);
