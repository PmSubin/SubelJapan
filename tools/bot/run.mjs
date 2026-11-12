// Bot kiểm tra tổng SubelJapan
//   node tools/bot/run.mjs            → kiểm tra hết (file + dữ liệu + mở mọi trang + chơi hết các bài)
//   node tools/bot/run.mjs --nhanh    → bỏ phần chơi từng bài (nhanh hơn)
// Ghi báo cáo vào tools/bot/BAO-CAO.md. Thoát với mã 1 nếu có LỖI (để GitHub báo đỏ).
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const QUICK = process.argv.includes('--nhanh');
const errors = [], warns = [], gaps = [], notes = [];
const t0 = Date.now();
const log = (...a) => console.log('[bot]', ...a);

// ---------- 1. Kiểm tra file ----------
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="([^"#:]+?)(?:\?v=(\d+))?"/g)].filter(m => !m[1].startsWith('http'));
const vers = new Set();
for (const [, f, v] of refs) {
  if (!fs.existsSync(path.join(ROOT, f))) errors.push(`index.html: file "${f}" không tồn tại`);
  if (/\.(js|css)$/.test(f)) { if (!v) warns.push(`index.html: "${f}" chưa gắn ?v= (trình duyệt có thể giữ bản cũ)`); else vers.add(v); }
}
if (vers.size > 1) errors.push('index.html: các file mang số phiên bản khác nhau (' + [...vers].join(', ') + ') → người dùng có thể nhận bản lẫn lộn');
for (const f of fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(ROOT, 'js', f), 'utf8');
  try { new vm.Script(src, { filename: f }); } catch (e) { errors.push(`js/${f}: lỗi cú pháp — ${e.message}`); }
  if (!refs.some(r => r[1] === 'js/' + f) && !src.includes('export ') && f !== 'vendor') warns.push(`js/${f}: không được index.html nạp`);
}
for (const f of fs.readdirSync(path.join(ROOT, 'css'))) if (!refs.some(r => r[1] === 'css/' + f)) warns.push(`css/${f}: không được index.html nạp`);
log('Đã kiểm tra file:', refs.length, 'liên kết, phiên bản', [...vers].join(','));

// ---------- 2. Máy chủ tĩnh ----------
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.ico': 'image/x-icon', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

// ---------- 3. Trình duyệt ----------
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { errors.push('Chưa cài Playwright: chạy "npm install" rồi "npx playwright install chromium"'); await finish(); }
// Chọn trình duyệt: BOT_CHANNEL=chrome (Chrome trên máy) · BOT_EXECUTABLE=/đường/dẫn · mặc định Chromium của Playwright;
// không có thì thử Chrome/Chromium cài sẵn trên máy chủ.
const tries = [];
if (process.env.BOT_EXECUTABLE) tries.push({ executablePath: process.env.BOT_EXECUTABLE });
if (process.env.BOT_CHANNEL) tries.push({ channel: process.env.BOT_CHANNEL });
tries.push({});
for (const p of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/opt/google/chrome/chrome']) if (fs.existsSync(p)) tries.push({ executablePath: p });
let browser = null, lastErr = '';
for (const o of tries) { try { browser = await chromium.launch(o); break; } catch (e) { lastErr = e.message.split('\n')[0]; } }
if (!browser) { errors.push(`Không mở được trình duyệt (${lastErr}). Chạy "npx playwright install --with-deps chromium" hoặc đặt BOT_EXECUTABLE.`); await finish(); }
const NOISE = /fonts\.(googleapis|gstatic)\.com|raw\.githubusercontent\.com|api\.openai|api\.anthropic|favicon/;

async function newPage(width, settings) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.__err = [];
  page.on('pageerror', e => page.__err.push('lỗi JS: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text()) && !/Failed to load resource/.test(m.text())) page.__err.push('console: ' + m.text().slice(0, 200)); });
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(BASE)) page.__err.push('tải hỏng ' + r.status() + ': ' + r.url().replace(BASE, '')); });
  page.on('requestfailed', r => { if (r.url().startsWith(BASE)) page.__err.push('tải hỏng: ' + r.url().replace(BASE, '')); });
  await page.goto(BASE + '?bot=1');
  await page.evaluate(s => { sessionStorage.sj_welcome = '1'; localStorage.clear(); localStorage.setItem('subeljapan_v1', JSON.stringify({ name: 'Bot', intro: true, settings: Object.assign({ sound: false, pet: false }, s) })); }, settings || {});
  await page.goto(BASE + '?bot=1#/');
  await page.waitForFunction(() => window.SJ && SJ.talkPrep && document.querySelector('#view, main'), null, { timeout: 15000 });
  return page;
}
const drain = (page, where) => { const e = [...new Set(page.__err)]; page.__err.length = 0; e.forEach(x => errors.push(where + ' → ' + x)); };

// 3a. Soát dữ liệu trong trang
{
  const page = await newPage(1280);
  await page.addScriptTag({ path: path.join(ROOT, 'tools/bot/audit.js') });
  const A = await page.evaluate(() => window.__audit());
  errors.push(...A.errors); warns.push(...A.warns); gaps.push(...A.gaps);
  notes.push('Nội dung: ' + Object.entries(A.stats).map(([k, v]) => k + ' ' + v).join(' · '));
  drain(page, 'Soát dữ liệu');
  log('Soát dữ liệu:', A.errors.length, 'lỗi,', A.warns.length, 'cảnh báo,', A.gaps.length, 'chỗ còn thiếu');
  await page.context().close();
}

// 3b. Mở mọi trang ở máy tính và điện thoại
const ROUTES = ['', 'talk', 'talk/book', 'talk/daily', 'sensei', 'sensei/role', 'chart', 'write', 'practice', 'read', 'type', 'games', 'cards', 'review', 'dict', 'print', 'quests', 'shop', 'profile', 'how', 'lesson/h1', 'write/さ'];
for (const W of [1280, 390]) {
  const page = await newPage(W);
  const routes = ROUTES.concat(await page.evaluate(() => [...SJ.STORIES.slice(0, 3).map(s => 'story/' + s.id), ...SJ.DIALOGUES.slice(0, 2).map(d => 'dialog/' + d.id), ...SJ.games.list.map(g => 'game/' + g.id)]));
  for (const r of routes) {
    await page.evaluate(h => { location.hash = '#/' + h; }, r);
    await page.waitForTimeout(450);
    const o = await page.evaluate(() => { const w = document.documentElement.scrollWidth; return w > innerWidth + 1 ? w - innerWidth : 0; });
    if (o) errors.push(`Trang #/${r} (${W}px): tràn ngang ${o}px`);
    const blank = await page.evaluate(() => { const v = document.querySelector('#view') || document.querySelector('main'); return v ? v.innerText.trim().length < 20 : false; });
    if (blank) errors.push(`Trang #/${r} (${W}px): trang trắng`);
    if (W === 1280) { // nút / ô nhập không có tên → trình đọc màn hình không biết nút làm gì
      const unnamed = await page.evaluate(() => [...document.querySelectorAll('#view button, #view [role="button"], #view input:not([type="hidden"]), #view select, #view textarea')]
        .filter(e => e.getClientRects().length && !((e.getAttribute('aria-label') || e.title || e.placeholder || e.textContent || '').trim() || (e.id && document.querySelector(`label[for="${e.id}"]`)) || e.closest('label')))
        .map(e => e.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').slice(0, 90)));
      [...new Set(unnamed)].forEach(h => warns.push(`Trang #/${r}: nút / ô nhập chưa có tên (thêm aria-label): ${h}`));
    }
    drain(page, `Trang #/${r} (${W}px)`);
  }
  log('Đã mở', routes.length, 'trang ở', W + 'px');
  await page.context().close();
}

// 3b'. Giao diện tối (Yoru): dò chữ sáng nằm trên nền sáng (màu nền viết cứng #fff…) — tỉ lệ tương phản < 2
{
  const page = await newPage(1280, { theme: 'yoru', motion: 'reduce' });
  let n = 0;
  for (const r of ROUTES.filter(r => r !== 'print')) {
    await page.evaluate(h => { location.hash = '#/' + h; }, r);
    await page.waitForTimeout(900);
    await page.addScriptTag({ path: path.join(ROOT, 'tools/bot/contrast.js') });
    const once = () => page.evaluate(() => window.__contrast().filter(x => parseFloat(x) < 2));
    const a1 = await once(); await page.waitForTimeout(700); const a2 = new Set(await once());
    const low = a1.filter(x => a2.has(x)); // chỉ tính chỗ khó đọc ở cả 2 lần đo (bỏ lúc đang chạy hiệu ứng)
    low.slice(0, 6).forEach(x => warns.push(`Giao diện tối #/${r}: chữ khó đọc (tương phản ${x})`)); n += low.length;
    drain(page, `Giao diện tối #/${r}`);
  }
  log('Giao diện tối:', n, 'chỗ chữ khó đọc');
  await page.context().close();
}

// 3c. "Bấm lung tung": trên mỗi trang và mỗi trò chơi, bấm ngẫu nhiên (có hạt giống cố định) các nút đang hiện
//     để bắt lỗi JS ẩn mà mở trang thôi không thấy. Không bấm nút xoá / đặt lại / sao lưu / in / tải file.
if (!QUICK) {
  const page = await newPage(1280, { motion: 'reduce' });
  await page.evaluate(() => { window.print = () => { }; window.open = () => null; });
  const routes = ROUTES.concat(await page.evaluate(() => [...SJ.STORIES.slice(0, 2).map(s => 'story/' + s.id), 'dialog/' + SJ.DIALOGUES[0].id, ...SJ.games.list.map(g => 'game/' + g.id)]));
  let clicks = 0;
  for (const [ri, r] of routes.entries()) {
    clicks += await page.evaluate(async ([h, seed]) => {
      const wait = ms => new Promise(res => setTimeout(res, ms));
      let s = seed >>> 0; const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
      const BAD = /xo[áà]|xóa|đặt lại|reset|sao lưu|khôi phục|nhập dữ liệu|xuất dữ liệu|tải|in phiếu|in ngay|^in$|đăng xuất|xoá khoá|quên khoá/i;
      const go = async () => { const old = document.querySelector('#view'); location.hash = '#/' + h; for (let i = 0; i < 100 && document.querySelector('#view') === old; i++) await wait(20); await wait(150); };
      await go();
      const want = location.hash;
      let n = 0;
      for (let k = 0; k < 30; k++) {
        if (location.hash !== want) await go();
        const root = document.querySelector('.modal-back:last-of-type .modal') || document;
        const els = [...root.querySelectorAll('button, [role="button"], .opt, .tile, .ttile, a[href^="#/"], input[type="checkbox"], .card[data-k], [data-k]')]
          .filter(e => { const b = e.getBoundingClientRect(); if (!b.width || !b.height || e.disabled || e.closest('[aria-hidden="true"], .pet, nav, .sidebar, .bottom-nav')) return false; const t = (e.innerText || e.getAttribute('aria-label') || e.title || '').trim(); return !BAD.test(t) && !e.matches('a[download], a[target="_blank"], input[type="file"]'); });
        const inp = [...document.querySelectorAll('#view input[type="text"], #view input:not([type]), #view textarea')].find(e => e.offsetParent && !e.disabled && !/key|khoá|api/i.test(e.placeholder + e.id + e.name));
        if (inp && rnd() < 0.15) { inp.focus(); inp.value = ['neko', 'ka', 'さかな', 'xin chào'][Math.floor(rnd() * 4)]; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); n++; await wait(120); continue; }
        if (!els.length) { await wait(150); continue; }
        els[Math.floor(rnd() * els.length)].click(); n++;
        await wait(90 + Math.floor(rnd() * 120));
      }
      document.querySelectorAll('.modal-back').forEach(m => m.remove());
      return n;
    }, [r, 1000 + ri]);
    drain(page, `Bấm thử #/${r}`);
  }
  notes.push(`Bấm thử ngẫu nhiên: ${clicks} cú bấm trên ${routes.length} trang / trò chơi`);
  log('Bấm thử:', clicks, 'cú bấm trên', routes.length, 'trang');
  await page.context().close();
}

// 3d. Chơi hết các bài (bấm tự động tới màn kết quả)
if (!QUICK) {
  const page = await newPage(1280, { motion: 'reduce' }); // bỏ màn chuyển cảnh để bấm nhanh
  const ids = await page.evaluate(() => {
    SJ.talkPrep();
    const out = SJ.LESSONS.map(l => 'lesson/' + l.id);
    SJ.TALK_LESSONS.forEach(l => out.push('talk/' + l.id + '/1', 'talk/' + l.id + '/2', 'talk/' + l.id + '/3'));
    return out;
  });
  // bài ôn & kiểm tra chặng: lấy từ trang lộ trình Nói
  await page.evaluate(() => { location.hash = '#/talk'; }); await page.waitForTimeout(600);
  ids.push(...await page.evaluate(() => [...document.querySelectorAll('.tnode')].map(n => n.dataset.n).filter(n => n && !/^g\d/.test(n)).map(n => 'talk/' + n)), 'talk/daily');
  let ok = 0;
  for (const id of ids) {
    const n = await page.evaluate(async h => {
      const q = s => document.querySelector(s);
      const wait = ms => new Promise(r => setTimeout(r, ms));
      // đổi trang rồi chờ khung trang mới thật sự được vẽ (tránh bấm nhầm vào trang cũ)
      const old = q('#view'); location.hash = '#/' + h;
      for (let i = 0; i < 150 && q('#view') === old; i++) await wait(20);
      await wait(30);
      let idle = 0;
      for (let k = 0; k < 800; k++) {
        if (q('.result')) return k;
        const c = q('.lesson-foot [data-cont]'); if (c) { c.click(); idle = 0; await wait(0); continue; }
        const g = q('.lesson-foot [data-go]'); if (g) { g.click(); idle = 0; await wait(0); continue; }
        // ghép cặp: chọn ô trái rồi ô phải cùng mã
        const L = q('.pairs .opt[data-side="L"]:not([disabled])');
        if (L) { L.click(); const R = [...document.querySelectorAll('.pairs .opt[data-side="R"]:not([disabled])')].find(r => r.dataset.id === L.dataset.id); R && R.click(); idle = 0; await wait(0); continue; }
        const o = [...document.querySelectorAll('.lesson-body .opt')].find(x => !x.disabled); if (o) { o.click(); idle = 0; continue; }
        // xếp chữ (bài Nói) và ghép chữ thành từ (bài học)
        const tiles = [...document.querySelectorAll('[data-tiles] .ttile:not(.used), .tiles .tile:not(.used)')];
        if (tiles.length) { tiles.forEach(t => t.click()); await wait(0); const ck = q('[data-check]:not([disabled])'); if (ck) { ck.click(); idle = 0; continue; } }
        // gõ romaji: bỏ qua (bot không đoán cách đọc)
        if (q('#ta') && !q('#ta').disabled) { const sk = q('[data-skip]'); if (sk) { sk.click(); idle = 0; continue; } }
        const ck = q('[data-check]:not([disabled])'); if (ck) { ck.click(); idle = 0; continue; }
        let hit = false;
        for (const s of ['[data-show]', '[data-no]', '[data-skip]', '[data-next]']) { const b = q('.lesson-foot ' + s) || q(s); if (b) { b.click(); hit = true; break; } }
        await wait(hit ? 0 : 20);
        if (!hit && ++idle > 150) return -k; // 3 giây không có gì để bấm
      }
      return -9999;
    }, id);
    if (n > 0) ok++; else errors.push(`Bài #/${id}: bấm tự động không tới được màn kết quả (kẹt ở "${await page.evaluate(() => ((document.querySelector('.quiz-ask, .lesson-body h1, .lesson-body h2') || {}).textContent || '').trim().slice(0, 60))}")`);
    drain(page, 'Bài #/' + id);
  }
  notes.push(`Chơi thử: ${ok}/${ids.length} bài tới được màn kết quả`);
  log('Chơi thử:', ok + '/' + ids.length, 'bài');
  await page.context().close();
}

await browser.close();
await finish();

async function finish() {
  server.close();
  const u = a => [...new Set(a)];
  const E = u(errors), Wn = u(warns), Gp = u(gaps);
  const sec = (title, list, max = 400) => list.length ? `\n## ${title} (${list.length})\n\n${list.slice(0, max).map(x => '- ' + x).join('\n')}${list.length > max ? `\n- … và ${list.length - max} mục nữa` : ''}\n` : '';
  const when = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const md = `# Báo cáo bot kiểm tra SubelJapan\n\n${when} · ${((Date.now() - t0) / 1000).toFixed(0)} giây · ${E.length ? '❌ ' + E.length + ' lỗi' : '✅ không có lỗi'} · ${Wn.length} cảnh báo · ${Gp.length} chỗ còn thiếu\n\n${notes.map(n => '- ' + n).join('\n')}\n` +
    sec('LỖI — cần sửa ngay', E) + sec('Cảnh báo — nên sửa', Wn) + sec('Còn thiếu / chưa đủ — việc cần bổ sung', Gp) + (E.length + Wn.length + Gp.length ? '' : '\nMọi thứ đều ổn.\n');
  fs.writeFileSync(path.join(ROOT, 'tools/bot/BAO-CAO.md'), md);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  console.log('\n' + md.split('\n').slice(0, 60).join('\n'));
  log('Báo cáo đầy đủ: tools/bot/BAO-CAO.md');
  process.exit(E.length ? 1 : 0);
}
