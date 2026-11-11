// Bot: dò chữ khó đọc — so màu chữ với màu nền thật phía sau (đi ngược lên cha, lấy nền màu hoặc màu đầu của gradient). window.__contrast() → ["tỉ lệ \"chữ\" <thẻ>", …]
window.__contrast = function () {
  // đọc được cả rgb()/rgba() lẫn color(srgb …) (màu trộn bằng color-mix ra dạng này)
  const rgb = s => {
    const cm = String(s).match(/color\(srgb ([^)]+)\)/);
    if (cm) { const p = cm[1].split(/[ \/]+/).filter(Boolean).map(Number); return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p.length > 3 ? p[3] : 1 }; }
    const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const bgOf = el => {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage.startsWith('linear-gradient')) { const cols = cs.backgroundImage.match(/rgba?\([^)]+\)|color\(srgb [^)]+\)/g) || []; const c = cols.map(rgb).find(x => x && x.a > .6); if (c) return c; }
      const c = rgb(cs.backgroundColor); if (c && c.a > .6) return c;
    }
    return rgb(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255 };
  };
  const out = [];
  const walker = document.createTreeWalker(document.querySelector('#view') || document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue;
    const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    const r = el.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight * 3) continue;
    // bỏ qua: hình vẽ, phần trang trí, và khung trời ở trang chủ (nền trời vẽ bằng lớp riêng phía sau, bot không tính được)
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity < .5 || el.closest('svg, [aria-hidden="true"], .hello.sky')) continue;
    const fg = rgb(cs.color); if (!fg || fg.a < .5) continue;
    let faded = false; for (let e = el; e && e.nodeType === 1; e = e.parentElement) if (+getComputedStyle(e).opacity < .6) { faded = true; break; }
    if (faded) continue; // đang hiện dần, hoặc nút bị làm mờ có chủ ý (chưa đủ cá để mua…)
    const bg = bgOf(el); const k = ratio(fg, bg);
    if (k < 2.2) out.push(`${k.toFixed(1)} "${t.textContent.trim().slice(0, 24)}" <${el.tagName.toLowerCase()} class="${el.className}">`);
  }
  return [...new Set(out)];
};
