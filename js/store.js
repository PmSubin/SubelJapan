/* SubelJapan — Lưu tiến độ (localStorage): XP, cấp độ, chuỗi ngày (+ bùa giữ chuỗi), cá vàng, nhiệm vụ ngày,
 * tiệm đồ của Mochi, huy hiệu, sổ từ yêu thích, thẻ nhớ SRS */
window.SJ = window.SJ || {};
(function (SJ) {
  // --- Event bus nho nhỏ ---
  const handlers = {};
  SJ.on = (e, fn) => { (handlers[e] = handlers[e] || []).push(fn); };
  SJ.off = (e, fn) => { handlers[e] = (handlers[e] || []).filter(f => f !== fn); };
  SJ.emit = (e, d) => { (handlers[e] || []).forEach(fn => { try { fn(d); } catch (err) { console.error(err); } }); };

  const KEY = 'subeljapan_v1';
  const DAY = 86400000;
  // phần Nói: khoảng cách ôn lại (ngày) theo độ nhớ 0–6
  const TALK_INT = [0.01, 1, 2, 4, 8, 16, 32];
  const DEF = () => ({
    name: '', created: Date.now(), xp: 0, goal: 30, intro: false,
    daily: { date: '', xp: 0 },
    streak: { count: 0, best: 0, last: '' }, frozen: {}, freeze: 0,
    history: {}, lessons: {}, talk: {}, talkMem: {}, items: {}, srs: {}, games: {}, badges: {},
    written: 0, perfectWrites: 0, reviewed: 0, plays: 0, practiced: 0, bestChain: 0, nameUsed: false, typed: 0,
    fish: 20, fishTotal: 20, inv: { fur_white: 1, acc_sakura: 1, acc_none: 1 }, equip: 'acc_sakura', fur: 'fur_white',
    quests: { date: '', list: [] }, questsDone: 0, chests: {}, fav: {}, reads: {}, goalDays: {},
    bonus: {}, bonusPending: null, weekly: { week: '', list: [], c: {} }, miles: {},
    settings: { sound: true, volume: 0.8, rate: 0.85, theme: 'sakura', poolSet: 'hira-basic', kfont: 'klee', romaji: true, furi: true, vi: true, writeMode: 'guide', pet: true, motion: 'full', season: true },
  });
  let S;

  const pad = n => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const diffDays = (a, b) => Math.round((Date.parse(b + 'T00:00:00') - Date.parse(a + 'T00:00:00')) / DAY);
  const addDays = (k, n) => { const d = new Date(Date.parse(k + 'T12:00:00') + n * DAY); return dayKey(d); };

  // --- Làm sạch dữ liệu (localStorage hỏng / file sao lưu lạ): giá trị nào sai kiểu so với mặc định thì dùng mặc định ---
  const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const okVal = v => (typeof v === 'number' && isFinite(v)) || typeof v === 'boolean';
  // bảng tra (history, lessons, items, srs, inv…): chỉ giữ mục là số/true-false, hoặc object chỉ chứa số/true-false
  const cleanMap = o => { const r = {}; Object.keys(o).forEach(k => { const v = o[k]; if (k !== '__proto__' && (okVal(v) || (isObj(v) && Object.values(v).every(okVal)))) r[k] = v; }); return r; };
  // phần tử danh sách nhiệm vụ ngày / tuần
  const okItem = q => isObj(q) && typeof q.id === 'string' && typeof q.icon === 'string' && Object.keys(q).every(x => x === 'id' || x === 'icon' || okVal(q[x]));
  const okPending = p => isObj(p) && typeof p.id === 'string' && typeof p.kind === 'string' && typeof p.title === 'string' && (p.match == null || typeof p.match === 'string') && okVal(p.need) && (p.prog == null || okVal(p.prog));
  function clean(def, raw, extra) {
    const out = {};
    Object.keys(def).forEach(k => {
      const d = def[k], v = raw[k];
      if (isObj(d)) out[k] = !isObj(v) ? d : (!Object.keys(d).length || k === 'inv') ? Object.assign({}, d, cleanMap(v)) : clean(d, v, k === 'settings');
      else if (Array.isArray(d)) out[k] = Array.isArray(v) && v.every(okItem) ? v : d;
      else if (d === null) out[k] = okPending(v) ? v : null;
      else if (typeof d === 'number') out[k] = typeof v === 'number' && isFinite(v) ? v : d;
      else out[k] = typeof v === typeof d ? v : d;
    });
    // cài đặt thêm của các phần khác (vd. cardsSize ở thẻ ghi nhớ): chỉ giữ giá trị đơn giản
    if (extra) Object.keys(raw).forEach(k => { const v = raw[k]; if (!(k in def) && (okVal(v) || typeof v === 'string')) out[k] = v; });
    return out;
  }
  const sanitize = raw => {
    const o = clean(DEF(), isObj(raw) ? raw : {});
    // người dùng cũ đã có tên → coi như đã xem phần giới thiệu
    if (isObj(raw) && raw.name && raw.intro == null) o.intro = true;
    return o;
  };

  function load() {
    try { S = sanitize(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = DEF(); }
    applyFreeze();
  }
  function save() {
    const data = JSON.stringify(S);
    try { localStorage.setItem(KEY, data); return; } catch (e) { }
    // đầy bộ nhớ: nhờ phần AI bỏ bớt lịch sử trò chuyện cũ rồi thử lại; vẫn không được thì báo cho người học (app.js)
    SJ.emit('storage-full');
    try { localStorage.setItem(KEY, data); } catch (e) { SJ.emit('save-fail'); }
  }

  /** Bùa giữ chuỗi (お守り): lỡ quên ngày nào thì bùa tự đỡ giúp */
  let freezeUsed = 0;
  function applyFreeze() {
    if (!S.streak.last || !S.streak.count) return;
    const gap = diffDays(S.streak.last, dayKey());
    if (gap < 2) return;
    const missed = gap - 1;
    if (S.freeze >= missed) {
      for (let i = 1; i <= missed; i++) S.frozen[addDays(S.streak.last, i)] = 1;
      S.freeze -= missed; freezeUsed = missed;
      S.streak.last = addDays(dayKey(), -1);
      save();
    }
  }

  // --- Cấp độ ---
  const LEVELS = [
    [0, 'Hạt giống', 'seed'], [50, 'Mầm non', 'sprout'], [150, 'Chồi xanh', 'leaf'], [300, 'Nụ hoa', 'tulip'], [500, 'Hoa anh đào', 'sakura'],
    [800, 'Học trò chăm chỉ', 'backpack'], [1200, 'Ninja chữ', 'ninja'], [1700, 'Samurai nhí', 'sword'], [2300, 'Thám tử Kanji', 'magnifier'],
    [3000, 'Senpai', 'cool'], [4000, 'Sensei', 'gradcap'], [5200, 'Thần đồng', 'brain'], [6600, 'Rồng vàng', 'dragon'], [8200, 'Phú Sĩ', 'fuji'], [10000, 'Huyền thoại', 'crown'],
  ];
  function levelInfo(xp) {
    let i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
    const cur = LEVELS[i][0], next = LEVELS[i + 1] ? LEVELS[i + 1][0] : null;
    return { level: i + 1, title: LEVELS[i][1], icon: LEVELS[i][2], cur, next, pct: next ? Math.round((xp - cur) / (next - cur) * 100) : 100, toNext: next ? next - xp : 0 };
  }

  // --- Huy hiệu ---
  const lessonDone = id => S.lessons[id] && S.lessons[id].done;
  const unitDone = uid => { const u = SJ.UNITS.find(x => x.id === uid); return u && u.lessons.every(l => lessonDone(l.id)); };
  const countDone = uid => { const u = SJ.UNITS.find(x => x.id === uid); return u ? u.lessons.filter(l => lessonDone(l.id)).length : 0; };
  const BADGES = [
    { id: 'first', icon: 'footprints', name: 'Bước đầu tiên', desc: 'Hoàn thành bài học đầu tiên', test: () => Object.keys(S.lessons).length >= 1 },
    { id: 'five', icon: 'backpack', name: 'Chăm ngoan', desc: 'Hoàn thành 5 bài học', test: () => Object.values(S.lessons).filter(l => l.done).length >= 5 },
    { id: 'hira', icon: 'sakura', name: 'Bậc thầy Hiragana', desc: 'Hoàn thành phần Hiragana', test: () => unitDone('hira') },
    { id: 'kata', icon: 'bolt', name: 'Bậc thầy Katakana', desc: 'Hoàn thành phần Katakana', test: () => unitDone('kata') },
    { id: 'kanji3', icon: 'torii', name: 'Nhà sưu tầm Kanji', desc: 'Hoàn thành 3 bài Kanji', test: () => countDone('kanji') >= 3 },
    { id: 'talk', icon: 'speech', name: 'Nói như người Nhật', desc: 'Hoàn thành 5 bài từ vựng', test: () => countDone('vocab') >= 5 },
    { id: 'grammar', icon: 'puzzle', name: 'Thợ ghép câu', desc: 'Hoàn thành phần Ngữ pháp', test: () => unitDone('grammar') },
    { id: 'perfect', icon: 'star', name: 'Hoàn hảo', desc: 'Đạt 3 sao trong một bài học', test: () => Object.values(S.lessons).some(l => l.stars >= 3) },
    { id: 'streak3', icon: 'fire', name: 'Lửa nhỏ', desc: 'Học 3 ngày liên tiếp', test: () => S.streak.best >= 3 },
    { id: 'streak7', icon: 'volcano', name: 'Lửa bùng cháy', desc: 'Học 7 ngày liên tiếp', test: () => S.streak.best >= 7 },
    { id: 'streak30', icon: 'comet', name: 'Bất khả chiến bại', desc: 'Học 30 ngày liên tiếp', test: () => S.streak.best >= 30 },
    { id: 'xp100', icon: 'n100', name: '100 XP', desc: 'Tích luỹ 100 XP', test: () => S.xp >= 100 },
    { id: 'xp1000', icon: 'trophy', name: '1000 XP', desc: 'Tích luỹ 1000 XP', test: () => S.xp >= 1000 },
    { id: 'write10', icon: 'write', name: 'Cây bút chăm chỉ', desc: 'Luyện viết xong 10 chữ', test: () => S.written >= 10 },
    { id: 'write100', icon: 'brush', name: 'Thư pháp gia', desc: 'Luyện viết xong 100 chữ', test: () => S.written >= 100 },
    { id: 'clean10', icon: 'medal', name: 'Nét chữ chuẩn', desc: 'Viết 10 chữ không sai nét nào', test: () => S.perfectWrites >= 10 },
    { id: 'gamer', icon: 'game', name: 'Game thủ', desc: 'Chơi 5 lượt trò chơi', test: () => S.plays >= 5 },
    { id: 'review50', icon: 'elephant', name: 'Trí nhớ voi', desc: 'Ôn 50 thẻ nhớ', test: () => S.reviewed >= 50 },
    { id: 'chain20', icon: 'chain', name: 'Chuỗi 20', desc: 'Đúng liên tiếp 20 câu khi luyện tập', test: () => S.bestChain >= 20 },
    { id: 'chain50', icon: 'dragon', name: 'Rồng chuỗi', desc: 'Đúng liên tiếp 50 câu khi luyện tập', test: () => S.bestChain >= 50 },
    { id: 'reader', icon: 'scroll', name: 'Mọt sách nhí', desc: 'Đọc xong 5 bài đọc', test: () => Object.keys(S.reads).length >= 5 },
    { id: 'typist', icon: 'keyboard', name: 'Ngón tay thần tốc', desc: 'Gõ đúng 50 từ tiếng Nhật', test: () => S.typed >= 50 },
    { id: 'quest10', icon: 'quest', name: 'Hiệp sĩ nhiệm vụ', desc: 'Hoàn thành 10 nhiệm vụ ngày', test: () => S.questsDone >= 10 },
    { id: 'shopper', icon: 'shop', name: 'Khách quen', desc: 'Mua món đồ đầu tiên ở tiệm Mochi', test: () => Object.keys(S.inv).length > 3 },
    { id: 'name', icon: 'nametag', name: 'Tên tiếng Nhật', desc: 'Xem tên mình bằng Katakana', test: () => S.nameUsed },
    { id: 'goal', icon: 'target', name: 'Đúng hẹn', desc: 'Hoàn thành mục tiêu ngày', test: () => Object.values(S.history).some(x => x >= S.goal) },
  ];
  function checkBadges() {
    BADGES.forEach(b => {
      if (!S.badges[b.id] && b.test()) { S.badges[b.id] = Date.now(); addFish(10, true); save(); SJ.emit('badge', b); }
    });
  }

  // --- Cá vàng (tiền của Mochi) ---
  function addFish(n, silent) {
    if (!n) return;
    S.fish = Math.max(0, S.fish + n); if (n > 0) S.fishTotal = (S.fishTotal || 0) + n;
    save(); SJ.emit('fish', { n, total: S.fish, silent });
  }

  // --- Nhiệm vụ hằng ngày ---
  const QUEST_POOL = [
    { id: 'lesson', icon: 'book', text: n => `Hoàn thành ${n} bài học`, t: [1, 2], fish: [10, 18] },
    { id: 'write', icon: 'pencil', text: n => `Luyện viết xong ${n} chữ`, t: [3, 5, 8], fish: [10, 14, 18] },
    { id: 'chain', icon: 'chain', text: n => `Đạt chuỗi ${n} câu đúng liên tiếp`, t: [8, 12, 15], fish: [10, 14, 18], max: true },
    { id: 'game', icon: 'game', text: n => `Chơi ${n} lượt trò chơi`, t: [1, 2, 3], fish: [8, 12, 15] },
    { id: 'review', icon: 'brain', text: n => `Ôn ${n} thẻ nhớ`, t: [5, 10], fish: [10, 14] },
    { id: 'read', icon: 'scroll', text: n => `Đọc xong ${n} bài đọc`, t: [1], fish: [12] },
    { id: 'type', icon: 'keyboard', text: n => `Gõ đúng ${n} từ tiếng Nhật`, t: [5, 10], fish: [10, 14] },
    { id: 'perfect', icon: 'star', text: () => 'Đạt 3 sao trong một bài học', t: [1], fish: [15] },
  ];
  function seeded(seed) { let x = seed % 2147483647; if (x <= 0) x += 2147483646; return () => (x = x * 16807 % 2147483647) / 2147483647; }
  function ensureQuests() {
    const t = dayKey();
    if (S.quests.date === t && S.quests.list.length) return S.quests.list;
    const rnd = seeded(Number(t.replace(/-/g, '')) + 7);
    const pool = QUEST_POOL.slice();
    const pickQ = () => pool.splice(Math.floor(rnd() * pool.length), 1)[0];
    const tx = S.daily.date === t ? S.daily.xp : 0;
    const list = [{ id: 'xp', icon: 'star', target: S.goal, prog: Math.min(S.goal, tx), fish: 10, done: tx >= S.goal, claimed: false }];
    if (tx >= S.goal) S.questsDone++;
    for (let i = 0; i < 2; i++) {
      const q = pickQ(); const k = Math.floor(rnd() * q.t.length);
      list.push({ id: q.id, icon: q.icon, target: q.t[k], prog: 0, fish: q.fish[k], done: false, claimed: false, max: !!q.max });
    }
    S.quests = { date: t, list };
    save();
    return list;
  }
  function questText(q) {
    if (q.id === 'xp') return `Kiếm ${q.target} XP hôm nay`;
    const def = QUEST_POOL.find(x => x.id === q.id);
    return def ? def.text(q.target) : q.id;
  }
  // thưởng mục tiêu ngày: xét lại cả khi người học hạ mục tiêu xuống dưới số XP đã có hôm nay
  function checkGoal() {
    const t = dayKey();
    if (S.daily.date === t && S.daily.xp >= S.goal && !S.goalDays[t]) { S.goalDays[t] = 1; addFish(10, true); SJ.emit('goal', S.goal); }
  }
  function track(type, n) {
    const list = ensureQuests();
    if (type === 'xp') checkGoal();
    let changed = false;
    list.forEach(q => {
      if (q.id !== type || q.done) return;
      // nhiệm vụ XP: tính thẳng từ XP hôm nay (không cộng dồn → không đếm trùng lúc qua nửa đêm; track('xp', 0) chỉ xét lại)
      q.prog = q.id === 'xp' ? (S.daily.date === dayKey() ? S.daily.xp : 0) : q.max ? Math.max(q.prog, n || 0) : q.prog + (n == null ? 1 : n);
      if (q.prog >= q.target) { q.prog = q.target; q.done = true; S.questsDone++; SJ.emit('quest', q); }
      changed = true;
    });
    if (changed) { save(); SJ.emit('quests'); checkBadges(); }
  }

  // --- Thẻ nhớ SRS (Leitner) ---
  const INTERVALS = [0, 1, 2, 4, 7, 14, 30, 60]; // ngày

  // --- Tiệm đồ của Mochi ---
  const SHOP = [
    { id: 'freeze', type: 'power', icon: 'omamori', name: 'Bùa giữ chuỗi', desc: 'Lỡ quên học 1 ngày? Bùa お守り sẽ giữ chuỗi giúp bạn.', price: 40, max: 2 },
    { id: 'acc_bow', type: 'acc', name: 'Nơ hồng xinh', desc: 'Điệu đà đáng yêu', price: 25 },
    { id: 'acc_hachimaki', type: 'acc', name: 'Băng đô cố lên', desc: 'Hachimaki — tinh thần がんばる!', price: 30 },
    { id: 'acc_glasses', type: 'acc', name: 'Kính tròn thông thái', desc: 'Đọc Kanji vèo vèo', price: 45 },
    { id: 'acc_scarf', type: 'acc', name: 'Khăn quàng đỏ', desc: 'Ấm áp mùa đông Hokkaido', price: 50 },
    { id: 'acc_leaf', type: 'acc', name: 'Lá tanuki thần kỳ', desc: 'Chiếc lá biến hình trong truyện cổ Nhật', price: 60 },
    { id: 'acc_beret', type: 'acc', name: 'Mũ nồi hoạ sĩ', desc: 'Dành cho cây bút thư pháp', price: 70 },
    { id: 'acc_kasa', type: 'acc', name: 'Nón lá Nhật', desc: 'Nón kasa của lữ khách', price: 80 },
    { id: 'acc_frog', type: 'acc', name: 'Mũ ếch con', desc: 'かえる — ếch con kêu "kero kero"', price: 100 },
    { id: 'acc_crown', type: 'acc', name: 'Vương miện vàng', desc: 'Vua của bảng chữ cái', price: 150 },
    { id: 'acc_grad', type: 'acc', name: 'Mũ tốt nghiệp', desc: 'Sẵn sàng thi JLPT N5!', price: 200 },
    { id: 'fur_sakura', type: 'fur', name: 'Mochi vị hoa anh đào', desc: 'Hồng phấn như sakura mochi', price: 60 },
    { id: 'fur_matcha', type: 'fur', name: 'Mochi vị trà xanh', desc: 'Xanh mát vị matcha', price: 60 },
    { id: 'fur_ube', type: 'fur', name: 'Mochi vị khoai môn', desc: 'Tím mộng mơ', price: 70 },
    { id: 'fur_kinako', type: 'fur', name: 'Mochi vị bột đậu', desc: 'Vàng ươm thơm phức', price: 70 },
    { id: 'fur_calico', type: 'fur', name: 'Mèo tam thể', desc: 'Mèo may mắn của Nhật', price: 90 },
    { id: 'fur_goma', type: 'fur', name: 'Mochi vị mè đen', desc: 'Ngầu lòi, mắt vàng óng', price: 90 },
  ];

  // --- Màn thưởng trên bản đồ ---
  function bonusDone(p) {
    S.bonus[p.id] = Date.now(); S.bonusPending = null; save();
    addFish(12, true);
    store.addXP(8);
    weekTrack('bonus');
    SJ.emit('bonus', p);
  }
  function bonusAct(type, v) {
    const p = S.bonusPending;
    if (!p || S.bonus[p.id]) return;
    if (p.kind === 'game' && type === 'game' && v === p.match) return bonusDone(p);
    if (p.kind === 'read' && type === 'read' && v === p.match) return bonusDone(p);
    if (p.kind === 'write' && type === 'write') { p.prog = (p.prog || 0) + 1; save(); if (p.prog >= p.need) bonusDone(p); return; }
    if (p.kind === 'type' && type === 'type') { p.prog = (p.prog || 0) + (v || 1); save(); if (p.prog >= p.need) bonusDone(p); return; }
    if (p.kind === 'practice' && type === 'chain' && v >= p.need) return bonusDone(p);
  }

  // --- Thử thách tuần ---
  const weekKey = () => { const d = new Date(); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return dayKey(d); };
  const WEEK_POOL = [
    { id: 'xpw', icon: 'star', text: n => `Kiếm ${n} XP trong tuần`, t: [200, 300], fish: [40, 55] },
    { id: 'lesson', icon: 'book', text: n => `Hoàn thành ${n} bài học`, t: [5, 8], fish: [45, 60] },
    { id: 'write', icon: 'pencil', text: n => `Luyện viết ${n} chữ`, t: [25, 40], fish: [40, 55] },
    { id: 'bonus', icon: 'chest', text: n => `Phá ${n} màn thưởng trên bản đồ`, t: [2, 4], fish: [45, 60] },
    { id: 'read', icon: 'scroll', text: n => `Đọc ${n} bài đọc`, t: [2, 3], fish: [40, 50] },
    { id: 'stars', icon: 'star_s', text: n => `Gom thêm ${n} sao trong bài học`, t: [10, 15], fish: [45, 60] },
    { id: 'type', icon: 'keyboard', text: n => `Gõ đúng ${n} từ tiếng Nhật`, t: [20, 40], fish: [40, 55] },
  ];
  function ensureWeekly() {
    const wk = weekKey();
    if (!S.weekly || S.weekly.week !== wk || !S.weekly.list.length) {
      const rnd = seeded(Number(wk.replace(/-/g, '')) + 99);
      const pool = WEEK_POOL.slice();
      const list = [{ id: 'days', icon: 'calendar', target: 5, fish: 50, done: false, claimed: false }];
      for (let i = 0; i < 2; i++) { const q = pool.splice(Math.floor(rnd() * pool.length), 1)[0]; const k = Math.floor(rnd() * q.t.length); list.push({ id: q.id, icon: q.icon, target: q.t[k], fish: q.fish[k], done: false, claimed: false }); }
      S.weekly = { week: wk, list, c: {} };
      save();
    }
    // tiến độ tính từ lịch sử (ngày học, XP) hoặc bộ đếm
    const days = []; for (let i = 0; i < 7; i++) { const d = new Date(Date.parse(wk + 'T12:00:00') + i * DAY); days.push(dayKey(d)); }
    S.weekly.list.forEach(q => {
      if (q.id === 'days') q.prog = days.filter(k => S.history[k] > 0).length;
      else if (q.id === 'xpw') q.prog = days.reduce((a, k) => a + (S.history[k] || 0), 0);
      else q.prog = S.weekly.c[q.id] || 0;
      q.prog = Math.min(q.prog, q.target);
      if (!q.done && q.prog >= q.target) { q.done = true; save(); SJ.emit('weekly', q); }
    });
    return S.weekly.list;
  }
  function weekTrack(id, n) {
    ensureWeekly();
    S.weekly.c[id] = (S.weekly.c[id] || 0) + (n == null ? 1 : n);
    save(); ensureWeekly();
  }
  function weekText(q) {
    if (q.id === 'days') return `Học ${q.target} ngày trong tuần này`;
    const d = WEEK_POOL.find(x => x.id === q.id); return d ? d.text(q.target) : q.id;
  }

  // --- Mục tiêu dài hạn (cột mốc, mỗi bậc thưởng cá) ---
  // số màn thưởng có trên bản đồ: giống cách pages.js đặt màn (sau mỗi bài thứ 3, trừ bài cuối của phần)
  const bonusTotal = () => SJ.UNITS.reduce((a, u) => a + u.lessons.filter((l, i) => i % 3 === 2 && i < u.lessons.length - 1).length, 0);
  function milestones() {
    const kanaM = sc => SJ.KANA[sc].basic.filter(o => store.mastery(o.k) === 2).length;
    const totalStars = Object.values(S.lessons).reduce((a, l) => a + (l.stars || 0), 0);
    const lessonsDone = Object.values(S.lessons).filter(l => l.done).length;
    const M = [
      { id: 'hira', icon: 'sakura', name: 'Thuộc lòng Hiragana', v: kanaM('hira'), tiers: [5, 15, 30, 46] },
      { id: 'kata', icon: 'bolt', name: 'Thuộc lòng Katakana', v: kanaM('kata'), tiers: [5, 15, 30, 46] },
      { id: 'words', icon: 'speech', name: 'Từ vựng đã gặp', v: SJ.VOCAB_ALL.filter(o => S.items[o.key]).length, tiers: [10, 30, 60, 100, SJ.VOCAB_ALL.length] },
      { id: 'kanji', icon: 'torii', name: 'Kanji đã gặp', v: SJ.KANJI.filter(o => S.items[o.key]).length, tiers: [5, 15, 30, SJ.KANJI.length] },
      { id: 'lessons', icon: 'book', name: 'Bài học đã xong', v: lessonsDone, tiers: [5, 15, 30, 45, SJ.LESSONS.length] },
      { id: 'stars', icon: 'star', name: 'Sao đã gom', v: totalStars, tiers: [10, 40, 80, 120, SJ.LESSONS.length * 3] },
      { id: 'bonus', icon: 'chest', name: 'Màn thưởng đã phá', v: Object.keys(S.bonus).length, tiers: [1, 5, 10, bonusTotal()] },
      { id: 'streak', icon: 'fire', name: 'Chuỗi ngày dài nhất', v: S.streak.best, tiers: [3, 7, 14, 30, 60, 100] },
      { id: 'write', icon: 'pencil', name: 'Chữ đã luyện viết', v: S.written, tiers: [10, 50, 150, 400, 1000] },
      { id: 'xp', icon: 'trophy', name: 'Tổng XP', v: S.xp, tiers: [100, 500, 1500, 4000, 10000] },
    ];
    M.forEach(m => {
      m.claimed = S.miles[m.id] || 0;           // số bậc đã nhận thưởng
      m.reached = m.tiers.filter(t => m.v >= t).length;
      m.next = m.tiers[Math.min(m.claimed, m.tiers.length - 1)];
      m.canClaim = m.reached > m.claimed;
      m.complete = m.claimed >= m.tiers.length;
    });
    return M;
  }
  function claimMile(id) {
    const m = milestones().find(x => x.id === id);
    if (!m || !m.canClaim) return 0;
    S.miles[id] = (S.miles[id] || 0) + 1; save();
    const f = 15 + m.claimed * 5; addFish(f);
    return f;
  }

  const store = {
    load, save, dayKey, diffDays, LEVELS, BADGES, SHOP, levelInfo, questText,
    get: () => S,
    level: () => levelInfo(S.xp),
    freezeUsed: () => { const n = freezeUsed; freezeUsed = 0; return n; },
    streakNow() {
      applyFreeze(); // tab mở nhiều ngày không tải lại → vẫn dùng bùa giữ chuỗi
      const t = dayKey();
      if (!S.streak.last) return 0;
      const d = diffDays(S.streak.last, t);
      return d <= 1 ? S.streak.count : 0;
    },
    doneToday: () => S.streak.last === dayKey(),
    todayXP: () => (S.daily.date === dayKey() ? S.daily.xp : 0),
    addXP(n) {
      if (!n) return;
      applyFreeze();
      const t = dayKey();
      const before = levelInfo(S.xp).level;
      if (S.daily.date !== t) S.daily = { date: t, xp: 0 };
      if (S.streak.last !== t) {
        S.streak.count = (S.streak.last && diffDays(S.streak.last, t) === 1) ? S.streak.count + 1 : 1;
        S.streak.last = t;
        S.streak.best = Math.max(S.streak.best, S.streak.count);
        SJ.emit('streak', S.streak.count);
      }
      S.xp += n; S.daily.xp += n;
      S.history[t] = (S.history[t] || 0) + n;
      save();
      SJ.emit('xp', { n, total: S.xp });
      const after = levelInfo(S.xp);
      if (after.level > before) { addFish(20, true); SJ.emit('level', after); }
      checkGoal();
      track('xp', n);
      checkBadges();
    },
    addFish, track, bonusAct, weekly: ensureWeekly, weekTrack, weekText, milestones, claimMile,
    startBonus(b) { S.bonusPending = { id: b.id, kind: b.kind, match: b.match || null, need: b.need || 1, prog: 0, title: b.title }; save(); },
    bonusIsDone: id => !!S.bonus[id],
    claimWeekly(i) { const q = ensureWeekly()[i]; if (!q || !q.done || q.claimed) return 0; q.claimed = true; save(); addFish(q.fish); return q.fish; },
    quests: ensureQuests,
    claimQuest(i) {
      const q = ensureQuests()[i];
      if (!q || !q.done || q.claimed) return 0;
      q.claimed = true; save(); addFish(q.fish);
      return q.fish;
    },
    rec(key, ok) {
      const it = S.items[key] || (S.items[key] = { c: 0, w: 0 });
      ok ? it.c++ : it.w++;
      it.t = Date.now();
      save();
    },
    seen(key) { if (!S.items[key]) { S.items[key] = { c: 0, w: 0, t: Date.now() }; save(); } },
    /** 0 = chưa học, 1 = đang học, 2 = đã thuộc */
    mastery(key) {
      const it = S.items[key];
      if (!it) return 0;
      return (it.c >= 4 && it.c / (it.c + it.w) >= 0.75) ? 2 : 1;
    },
    weakness(key) { const it = S.items[key]; return it ? (it.w * 2 + 1) / (it.c + 1) : 1.5; },
    completeLesson(id, pct) {
      const L = S.lessons[id] || (S.lessons[id] = { done: false, stars: 0, best: 0, count: 0 });
      const first = !L.done;
      const stars = pct >= 100 ? 3 : pct >= 80 ? 2 : 1;
      const gained = Math.max(0, stars - (L.stars || 0));
      L.done = true; L.count++; L.stars = Math.max(L.stars, stars); L.best = Math.max(L.best, pct); L.at = Date.now();
      save();
      const xp = first ? 10 + stars * 5 : 4 + stars * 2;
      const fish = first ? 8 + stars * 2 : 2 + stars;
      this.addXP(xp);
      addFish(fish, true);
      track('lesson'); weekTrack('lesson'); if (gained) weekTrack('stars', gained);
      if (stars >= 3) track('perfect');
      checkBadges();
      return { stars, xp, fish, first };
    },
    lessonState: id => S.lessons[id] || null,
    /** bài Nói & Ngữ pháp: mỗi bài học 3 lượt (o.rounds), bài ôn / kiểm tra chặng 1 lượt */
    completeTalk(id, pct, o) {
      o = o || {};
      const L = S.talk[id] || (S.talk[id] = { done: 0, stars: 0, best: 0, count: 0, rounds: 0 });
      if (L.done && !L.rounds) L.rounds = 1; // tiến độ cũ (trước khi có lượt)
      const max = o.rounds || 1, fresh = (L.rounds || 0) < max;
      const stars = pct >= 100 ? 3 : pct >= 75 ? 2 : 1;
      if (fresh) L.rounds = (L.rounds || 0) + 1;
      L.done = 1; L.count = (L.count || 0) + 1; L.stars = Math.max(L.stars || 0, stars); L.best = Math.max(L.best || 0, pct); L.at = Date.now();
      save();
      const xp = fresh ? 10 + stars * 4 + (o.bonus || 0) : 4 + stars * 2, fish = fresh ? 6 + stars * 2 + (o.bonus ? 4 : 0) : 2 + stars;
      this.addXP(xp); addFish(fish, true);
      track('lesson'); weekTrack('lesson'); if (stars >= 3) track('perfect');
      checkBadges();
      return { stars, xp, fish, fresh, rounds: L.rounds };
    },
    /** ghi nhớ từng câu mẫu phần Nói (ôn cách quãng): s = độ nhớ 0–6, d = lúc cần ôn lại */
    talkRec(key, ok) {
      const m = S.talkMem[key] || (S.talkMem[key] = { s: 0, c: 0, w: 0, t: 0, d: 0 });
      const now = Date.now();
      if (ok) { m.c++; m.s = Math.min(TALK_INT.length - 1, m.s + 1); } else { m.w++; m.s = Math.max(0, m.s - 2); }
      m.t = now; m.d = now + TALK_INT[m.s] * DAY;
      save();
    },
    talkSeen(key) { if (!S.talkMem[key]) { const now = Date.now(); S.talkMem[key] = { s: 0, c: 0, w: 0, t: now, d: now + DAY / 2 }; save(); } },
    talkMem: key => S.talkMem[key] || null,
    talkState: id => S.talk[id] || null,
    nextLesson() { return SJ.LESSONS.find(l => !lessonDone(l.id)) || SJ.LESSONS[SJ.LESSONS.length - 1]; },
    unitDone, countDone,
    claimChest(uid) { if (S.chests[uid] || !unitDone(uid)) return 0; S.chests[uid] = Date.now(); save(); addFish(30); return 30; },
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
      track('review');
      checkBadges();
    },
    dueKeys() {
      const now = Date.now();
      return Object.keys(S.srs).filter(k => S.srs[k].due <= now).sort((a, b) => S.srs[a].due - S.srs[b].due);
    },
    srsKeys: () => Object.keys(S.srs),
    setBest(id, score, lowerIsBetter) {
      // bấm thoát khi chưa ghi được điểm nào: không tính kỷ lục, không tính lượt chơi
      if (!lowerIsBetter && !(score > 0)) return false;
      const old = S.games[id];
      const better = old == null || (lowerIsBetter ? score < old : score > old);
      if (better) S.games[id] = score;
      S.plays++;
      save(); track('game'); checkBadges();
      return better;
    },
    addWritten(perfect) { S.written++; if (perfect) S.perfectWrites++; save(); track('write'); weekTrack('write'); bonusAct('write'); checkBadges(); },
    setChain(n) { track('chain', n); bonusAct('chain', n); if (n > S.bestChain) { S.bestChain = n; save(); checkBadges(); } },
    addPracticed() { S.practiced++; },
    addTyped(n) { S.typed += n || 1; save(); track('type', n || 1); weekTrack('type', n || 1); bonusAct('type', n || 1); checkBadges(); },
    markRead(id) { const first = !S.reads[id]; S.reads[id] = Date.now(); save(); if (first) addFish(5, true); track('read'); weekTrack('read'); bonusAct('read', id); checkBadges(); return first; },
    markName() { if (!S.nameUsed) { S.nameUsed = true; save(); checkBadges(); } },
    toggleFav(key) { if (S.fav[key]) delete S.fav[key]; else S.fav[key] = Date.now(); save(); return !!S.fav[key]; },
    isFav: key => !!S.fav[key],
    owns: id => !!S.inv[id],
    buy(id) {
      const it = SHOP.find(x => x.id === id); if (!it) return { ok: false };
      if (it.type === 'power') {
        if (S.freeze >= it.max) return { ok: false, why: 'max' };
        if (S.fish < it.price) return { ok: false, why: 'money' };
        S.freeze++; S.fish -= it.price; save(); SJ.emit('fish', { n: -it.price, total: S.fish }); checkBadges(); return { ok: true };
      }
      if (S.inv[id]) return { ok: false, why: 'owned' };
      if (S.fish < it.price) return { ok: false, why: 'money' };
      S.fish -= it.price; S.inv[id] = Date.now();
      if (it.type === 'acc') S.equip = id; else S.fur = id;
      save(); SJ.emit('fish', { n: -it.price, total: S.fish }); SJ.emit('look'); checkBadges();
      return { ok: true };
    },
    wear(id) {
      if (!S.inv[id]) return;
      if (id.startsWith('fur_')) S.fur = id; else S.equip = id;
      save(); SJ.emit('look');
    },
    set(k, v) { S[k] = v; save(); SJ.emit('change', k); },
    setSetting(k, v) { S.settings[k] = v; save(); SJ.emit('settings', k); },
    reset() { S = DEF(); save(); SJ.emit('change', 'reset'); },
    exportData: () => btoa(unescape(encodeURIComponent(JSON.stringify(S)))),
    importData(str) {
      const obj = JSON.parse(decodeURIComponent(escape(atob(str.trim()))));
      if (!isObj(obj) || typeof obj.xp !== 'number' || !isFinite(obj.xp)) throw new Error('bad');
      // làm sạch TRƯỚC khi ghi: trường sai kiểu (vd. fish là chuỗi HTML, lessons = null) → dùng mặc định
      localStorage.setItem(KEY, JSON.stringify(sanitize(obj))); load(); SJ.emit('change', 'import');
    },
    checkBadges,
    /** Các ngày gần nhất (cho lịch chuỗi / bản đồ nhiệt) */
    lastDays(n) {
      const out = [];
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * DAY); const k = dayKey(d);
        out.push({ key: k, d, xp: S.history[k] || 0, frozen: !!S.frozen[k] });
      }
      return out;
    },
  };
  load();
  SJ.store = store;
})(window.SJ);
