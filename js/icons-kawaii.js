/* SubelJapan — thêm mặt kawaii (mắt long lanh + miệng cười + má hồng) cho đồ ăn, thiên nhiên, đồ vật.
 * Phong cách "kawaii" của Nhật: đồ vật cũng có mặt → hình thân thiện, dễ nhớ hơn (trẻ con lẫn người lớn đều thích).
 * Mỗi mục: [x, y, cỡ] — tâm khuôn mặt trên khung 48×48 và độ to (1 = mặt rộng khoảng 14 đơn vị).
 * Vị trí chọn tay trên lưới toạ độ, đặt vào phần thân trơn của hình, tránh chi tiết có sẵn.
 * Thêm hình mới thì thêm một dòng vào FACES; bot kiểm tra sẽ báo nếu mặt tràn khỏi khung.
 */
window.SJ = window.SJ || {};
(function (SJ) {
  if (!SJ.addIcons || !SJ.hasIcon) return;
  const INK = 'var(--ink-ic,#3d3142)';
  const FACES = {
    // đồ ăn
    apple: [24, 27.5, 1.1], banana: [17.5, 25.5, .65], bread: [24, 30.5, .8], candy: [24, 24.2, .6], cheese: [21.5, 28.5, .65],
    chocolate: [15.5, 33, .7], hamburger: [24, 34.5, .7], lemon: [25, 26, .85], mandarin: [24.5, 28.5, .95], milk: [24, 28.5, .7],
    mushroom: [24, 35, .65], peach: [29.5, 27.5, .7], sushi: [24, 32, .7], tomato: [24, 29, 1.05],
    // thiên nhiên
    cloudsun: [16, 23, .75], rain: [22, 21, .85], rain_s: [23, 21, .85], mountain: [16, 33, .8], fuji: [24, 34, .8],
    volcano: [24, 34.5, .85], tulip: [24, 18.5, .7],
    // đồ vật
    backpack: [24, 21.5, .7], bag: [24, 33, .8], house: [28, 26.5, .65], home: [28, 26.5, .65], car: [24.5, 28.5, .7],
    boat: [24, 37.5, .55], rocket: [24, 29.5, .65], phone: [24, 22, .85], suitcase: [24, 26, .8], shoes: [17, 26.5, .7], notebook: [25, 30.5, .85],
  };
  const f = v => +v.toFixed(2);
  /** khuôn mặt: 2 mắt có đốm sáng, miệng cười nét mảnh, 2 má hồng */
  function face(x, y, s) {
    const ex = 3 * s, ey = y - s, er = 1.35 * s;
    const eye = cx => `<circle cx="${f(cx)}" cy="${f(ey)}" r="${f(er)}" fill="${INK}"/><circle cx="${f(cx + .45 * s)}" cy="${f(ey - .45 * s)}" r="${f(.42 * s)}" fill="#fff"/>`;
    const mouth = `<path d="M${f(x - 1.3 * s)} ${f(y + 1.1 * s)} q${f(1.3 * s)} ${f(1.3 * s)} ${f(2.6 * s)} 0" fill="none" stroke="${INK}" stroke-width="${f(1.1 * s + .3)}" stroke-linecap="round"/>`;
    const blush = cx => `<ellipse cx="${f(cx)}" cy="${f(y + .9 * s)}" rx="${f(1.6 * s)}" ry="${f(1.05 * s)}" fill="#ff8fae" opacity=".55"/>`;
    return `<g class="kawaii">${blush(x - 5 * s)}${blush(x + 5 * s)}${eye(x - ex)}${eye(x + ex)}${mouth}</g>`;
  }
  const map = {};
  Object.keys(FACES).forEach(n => {
    if (!SJ.hasIcon(n)) return;
    const inner = SJ.icon(n, 48).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    const [x, y, s] = FACES[n];
    const full = inner + face(x, y, s);
    map[n] = () => full;
  });
  SJ.addIcons(map);
  SJ.KAWAII = Object.keys(map);
})(window.SJ);
