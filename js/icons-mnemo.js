/* SubelJapan — hình gợi nhớ vẽ riêng cho mẹo nhớ bảng chữ (khớp đúng câu mẹo trong js/data-kana.js).
 * Cùng nét bút với js/icons.js (khung 48×48, viền đậm, màu pastel, mặt kawaii).
 * Với các chữ dễ nhầm シ・ツ・ソ・ン, nét trên hình trùng với nét chữ: nhìn hình là thấy dáng chữ.
 */
window.SJ = window.SJ || {};
(function (SJ) {
  if (!SJ.addIcons) return;
  const INK = 'var(--ink-ic,#3d3142)';
  const n = v => +(+v).toFixed(2);
  // nét ống: viền mực + lõi màu (giống đường ray, dây, kim)
  const tube = (d, col, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${n(w + 4.6)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${n(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const line = (d, col, w, dash) => `<path d="${d}" fill="none" stroke="${col || INK}" stroke-width="${n(w || 2.3)}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const eye = (x, y, r) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${INK}"/><circle cx="${n(x + r * .33)}" cy="${n(y - r * .33)}" r="${n(r * .31)}" fill="#fff"/>`;
  const blush = (x, y, s) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(1.6 * s)}" ry="${n(1.05 * s)}" fill="#ff8fae" opacity=".55"/>`;
  /** mặt kawaii chuẩn: 2 mắt long lanh, miệng cười, má hồng */
  const face = (x, y, s, mouth) => blush(x - 5 * s, y + .9 * s, s) + blush(x + 5 * s, y + .9 * s, s) + eye(x - 3 * s, y - s, 1.35 * s) + eye(x + 3 * s, y - s, 1.35 * s)
    + (mouth === 'o' ? `<ellipse cx="${n(x)}" cy="${n(y + 1.6 * s)}" rx="${n(1.1 * s)}" ry="${n(1.3 * s)}" fill="${INK}"/>`
      : line(`M${n(x - 1.3 * s)} ${n(y + 1.1 * s)} q${n(1.3 * s)} ${n(1.3 * s)} ${n(2.6 * s)} 0`, INK, 1.1 * s + .3));
  const spark = (x, y, r, col) => `<path d="M${n(x)} ${n(y - r)} L${n(x + r * .3)} ${n(y - r * .3)} L${n(x + r)} ${n(y)} L${n(x + r * .3)} ${n(y + r * .3)} L${n(x)} ${n(y + r)} L${n(x - r * .3)} ${n(y + r * .3)} L${n(x - r)} ${n(y)} L${n(x - r * .3)} ${n(y - r * .3)} Z" fill="${col || '#ffd85e'}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`;
  const hairCap = (K, x, y, r, col) => K.P(`M${x - r} ${y} q0 ${-r * 1.15} ${r} ${-r * 1.15} q${r} 0 ${r} ${r * 1.15} q${-r * .5} ${-r * .45} ${-r} ${-r * .35} q${-r * .5} ${r * .1} ${-r} ${r * .35} Z`, col);

  SJ.addIcons({
    // す — chiếc xích đu: dây đu xoắn một vòng rồi thả xuống, Mochi ngồi đu
    swing: K => K.R(5, 4, 38, 5, 2.5, K.C.brn)
      + line('M14 9 V17 q-4.5 3.5 0 6.5 q4.5 -3 0 -6.5 M14 23.5 V31') + line('M34 9 V31')
      + K.O(24, 24.5, 6.4, K.C.wht) + face(24, 24.8, .62) + K.P('M19.6 20 q1.4 -3 4.4 -3.4', 'none')
      + K.R(9.5, 30.5, 29, 5.5, 2.75, K.C.rose)
      + line('M41 13 q6 9 -1.5 18', '#ff8fae', 2, '2.4 3') + line('M38.5 29.5 l1.2 2.4 l2.4 -.9', '#ff8fae', 2),
    // よ — yo-yo mặt cười trên sợi dây
    yoyo: K => K.O(24, 6.5, 3, K.C.wht) + line('M24 9.5 V17') + K.O(24, 29.5, 12.5, K.C.rose) + K.O(24, 29.5, 7.4, K.C.pink)
      + face(24, 29.6, .78) + K.H('M14.4 24 q2 -5 6.6 -6.6')
      + line('M8 23 q-3 6.5 0 13', INK, 1.6) + line('M40 23 q3 6.5 0 13', INK, 1.6),
    // り / リ — hai sợi dây treo lủng lẳng, sợi phải dài hơn
    dangle: K => K.R(6, 4, 36, 5, 2.5, K.C.brn)
      + line('M16 9 V20') + K.O(16, 24, 4.2, K.C.yel) + K.D(16, 25.4, 1, K.C.dbrn)
      + line('M32 9 V30 q0 6 -5 9') + K.P('M27 33.5 c-2.6 -3.4 -7.6 -.8 -5.2 3.2 l5.2 5 l5.2 -5 c2.4 -4 -2.6 -6.6 -5.2 -3.2 Z', K.C.rose)
      + line('M8 13 v4 M40 13 v4', INK, 1.4),
    // る — đường ray tàu lượn có vòng xoắn ở cuối
    // ray đi ngang → chéo xuống trái → cuộn một vòng ở cuối (đúng dáng chữ る)
    coaster: K => line('M10 16 V44 M22 16 V44', INK, 1.6)
      + tube('M5 16 H31 Q37 16 32.5 21 L16 35 Q10.5 40.5 17 42.5 Q29 45.5 33.5 38.5 Q36.5 32 30 30.5 Q23.5 30 25 36.5', K.C.dblue, 2.8)
      + K.R(7, 6, 13, 8, 3.2, K.C.red) + K.O(10, 14.4, 2, K.C.gry) + K.O(17, 14.4, 2, K.C.gry) + face(13.5, 9.6, .52)
      + spark(41, 8, 3.6) + line('M3 44 H45', INK, 2),
    // を — bạn nhỏ nhảy "ô" qua hàng rào
    // hàng rào thấp ở dưới, bạn nhỏ bay qua phía trên theo đường nét đứt
    hurdle: K => K.R(9, 31, 4.6, 13, 2, K.C.brn) + K.R(34.4, 31, 4.6, 13, 2, K.C.brn) + K.R(5, 33.5, 38, 4, 2, K.C.wht) + K.R(5, 39.5, 38, 3.6, 1.8, K.C.wht)
      + line('M3 30 q21 -22 42 0', '#ff8fae', 2, '2.4 3')
      + line('M19.5 17 l-6 -5 M28.5 17 l6 -5') + line('M21 23.5 q-3 3.5 -7 2.5 M27 23.5 q3 3.5 7 2.5')
      + K.R(19, 15, 10, 9, 4.5, K.C.blue)
      + K.O(24, 8.5, 6.2, K.C.skin) + hairCap(K, 24, 7.5, 6.2, K.C.dbrn) + face(24, 9.6, .55, 'o'),
    // ア — cái rìu: cán gỗ và lưỡi rìu (giống chữ A nghiêng)
    axe: K => K.G('rotate(-38 24 24)', K.R(21, 9, 6, 37, 3, K.C.brn) + K.P('M27 8 h9 q6 0 6 6 v6 q0 6 -6 6 h-9 Z', K.C.gry) + K.P('M27 10 v14', 'none') + K.H('M30 11 h5')) + spark(9, 9, 4),
    // オ — bạn nhỏ dang tay chạy hớn hở "Ồ!"
    run_happy: K => line('M17.5 25 L7 18.5') + line('M30.5 25 L41 18.5') + K.D(6.5, 18, 2.6, K.C.skin) + K.D(41.5, 18, 2.6, K.C.skin)
      + line('M21 33 L15.5 41.5') + line('M27 33 L33.5 39.5')
      + K.R(17.5, 21, 13, 13, 6.5, K.C.yel)
      + K.O(24, 13, 7.4, K.C.skin) + hairCap(K, 24, 12, 7.4, K.C.dbrn) + face(24, 14.4, .62, 'o')
      + line('M4 30 h5 M3 35 h5', INK, 1.4) + K.T(42, 9, '!', 9, undefined, 0),
    // ケ — khối đồ chơi chữ K bị lệch
    block_k: K => K.G('rotate(-14 24 25)', K.R(9, 10, 30, 30, 7, K.C.lav) + K.P('M10 33 q14 6 28 0', 'none') + line('M19 17 V33 M31 17 L20 25.5 L31 33', '#fff', 4.4) + line('M19 17 V33 M31 17 L20 25.5 L31 33', INK, 1.6))
      + spark(40, 8, 4) + spark(7, 41, 3, '#ffc4d4'),
    // ソ — cây kim khâu: chỉ (nét ngắn) ở trên, thân kim (nét dài) đi từ trên xuống
    needle: K => tube('M37 6 L13 42', K.C.gry, 2.8) + `<ellipse cx="35.6" cy="8.2" rx="1.4" ry="2.8" transform="rotate(34 35.6 8.2)" fill="#fff"/>`
      + tube('M35.6 8.2 q-9 -6 -17 -.5 q-5 3.5 -9.5 1.5', K.C.rose, 2) + K.D(9, 9.2, 2.2, K.C.rose)
      + K.P('M10 40.5 q-3 3 -5.5 1', 'none'),
    // タ — chú chim cu (ク) ngậm thêm một cành cây ở giữa
    // chim ngậm cành: cành vẽ trước, thân chim, rồi mỏ đè lên cành
    bird_twig: K => tube('M30 29 L46 17', K.C.dbrn, 1.8) + K.P('M41 20.5 q4.5 -1.5 5.5 3 q-4.5 1.5 -5.5 -3 Z', K.C.grn)
      + K.P('M17 43 v-4 M24 43 v-4', 'none')
      + K.E(21, 28, 15, 12.5, K.C.yel) + K.P('M11 29 q6 8 14 3 q-5 -6 -14 -3 Z', K.C.org)
      + K.P('M16 16 q1 -6 6 -7.5 q-.5 4 -2.5 6.5', K.C.yel)
      + face(22, 25, .78) + K.P('M34.5 22.5 L42.5 25.5 L34.5 29 Z', K.C.org),
    // ト — cột totem có một nhánh chìa ra
    totem: K => K.R(16, 4, 16, 40, 5, K.C.brn) + K.P('M16 23.5 H32', 'none') + face(24, 13.2, .8) + face(24, 33, .8, 'o')
      + K.R(31, 19, 11, 5, 2.5, K.C.dbrn) + K.P('M41 16 q5 1 4 6 q-5 -.5 -4 -6 Z', K.C.grn)
      + K.P('M12 44 H36', 'none'),
    // ヒ — bạn nhỏ ngồi gác chân, cười "hì hì"
    sit_laugh: K => K.P('M14 39 Q14 31 21 30 L28 30 Q32 30 32 34 L32 39 Z', K.C.pink)
      + line('M28 36 Q36 38 43 32') + K.D(43, 31.5, 2.6, K.C.skin) + line('M8 41 H44', INK, 2)
      + K.O(20, 18, 8.4, K.C.skin) + hairCap(K, 20, 17, 8.4, '#5b4a3f')
      + line('M15.6 18 q1.5 -1.6 3 0 M21.2 18 q1.5 -1.6 3 0', INK, 1.5) + `<path d="M17.6 21.4 q2.4 3.6 4.8 0 Z" fill="${INK}"/>` + blush(14.6, 21.4, .8) + blush(25.4, 21.4, .8)
      + K.T(37, 15, 'hì', 7.5, undefined, 0) + K.T(41, 23.5, 'hì', 6, undefined, 0),
    // フ — cái móc treo đồ (như ふ bị là phẳng)
    hook: K => K.R(5, 5, 11, 12, 3.5, K.C.brn) + K.D(10.5, 11, 1.4, K.C.dbrn)
      + tube('M13 11 H33 Q37 11 35.5 15.5 Q31 29 21 38', K.C.dgry, 3) + K.D(21, 38, 2.4, K.C.dgry)
      + K.P('M17 38.5 q4 -4 8 0 l-1 6 h-6 Z', K.C.rose) + spark(41, 33, 3.6),
    // ム — cánh tay gập lại gồng cơ
    muscle: K => K.P('M4 38 Q4 27 15 25 Q21 17 29 21 L32 12 Q33.5 6.5 39 7.5 Q44 9 42.5 15 L39.5 25 Q37 33 27 35 Q18 38 4 38 Z', K.C.skin)
      + K.P('M17.5 26.5 q5.5 -4.5 10.5 -.5', 'none') + K.P('M35 12.5 q2.6 -1 4.6 1', 'none')
      + spark(12, 12, 4.4) + spark(23, 9, 2.8, '#ffc4d4') + line('M6 31.5 h3', INK, 1.4),
    // ユ — biển báo quay đầu chữ U (U-turn)
    uturn: K => K.R(6, 6, 36, 36, 9, K.C.dblue) + K.P('M6 33 H42', 'none')
      + line('M30.5 33 V20 Q30.5 12.5 23 12.5 Q15.5 12.5 15.5 20 V25', '#fff', 4.4) + `<path d="M10.5 24 L15.5 31.5 L20.5 24 Z" fill="#fff"/>`
      + line('M24 42 V46', INK, 3),
    // ヨ — cái gương soi: chữ E quay ngược thành ヨ
    mirror_e: K => K.R(20.5, 32, 7, 13, 3.5, K.C.rose) + K.E(24, 19, 15, 16, K.C.pink) + K.E(24, 19, 11.4, 12.4, K.C.sky)
      + line('M29 11 V27 M18.5 11 H29 M19.5 19 H29 M18.5 27 H29', INK, 2.6) + K.H('M15.5 14 q1.2 -3.4 4 -4.6') + spark(42, 8, 3.6),
    // ラ — số 7 có cái nắp đậy phía trên
    seven_lid: K => K.R(12, 7.5, 24, 6, 3, K.C.pink) + K.O(24, 6, 2.4, K.C.rose)
      + tube('M12 21 H35 Q29 31 23 42', K.C.org, 4.2) + line('M8 6 l2 2 M40 6 l-2 2', INK, 1.4) + K.D(14.5, 31, 1.6, K.C.rose, .6),
    // レ — dấu tích ✓ (hay chữ L nghiêng): "lê" đúng rồi!
    tick: K => K.R(6, 7, 36, 34, 8, K.C.cream) + tube('M14 23 L21 31 L35 13', K.C.dgrn, 3.6) + spark(38, 34, 3.6) + K.H('M10.5 13 q1 -2.4 3.6 -2.6'),
    // ロ — cái hộp vuông có cái miệng vuông 口
    // hộp vuông đang cười to, cái miệng cũng vuông như chữ 口
    square_mouth: K => K.R(6, 6, 36, 36, 8, K.C.peach) + line('M13.5 17.5 q3 -3.4 6 0 M28.5 17.5 q3 -3.4 6 0', INK, 2.3)
      + blush(11.5, 23, 1.25) + blush(36.5, 23, 1.25)
      + K.P('M16.5 23 H31.5 V31 Q31.5 35.5 27 35.5 H21 Q16.5 35.5 16.5 31 Z', K.C.red) + K.P('M19.5 33 q4.5 -4 9 0', K.C.rose)
      + K.H('M10.5 12 q1.2 -2.4 3.8 -2.6') + spark(42, 6, 3.4),
    // シ — mặt cười: 2 mắt xếp dọc bên TRÁI, miệng hất từ dưới lên (đúng dáng chữ シ)
    face_side: K => K.O(24, 24, 18, K.C.yel) + line('M11.5 15 l4 2 M10 23.5 l4 1.6', INK, 3.2) + line('M12.5 34 Q28 34 37.5 17', INK, 3.2)
      + blush(30, 32, 1.1) + K.H('M13 10 q3 -3.6 7.5 -4'),
    // ツ — mặt cười: 2 mắt nằm NGANG ở trên, miệng kéo từ trên xuống (đúng dáng chữ ツ)
    face_up: K => K.O(24, 24, 18, K.C.mint) + line('M13.5 13.5 l2 4 M21.5 11.5 l2 4', INK, 3.2) + line('M36 12.5 Q35 31 17.5 37', INK, 3.2)
      + blush(11.5, 27, 1.1) + K.H('M10 19 q.4 -5 4 -8'),
    // ン — mặt cười nháy mắt: nháy (nét ngắn) bên trái, miệng hất từ DƯỚI lên (đúng dáng chữ ン)
    face_n: K => K.O(24, 24, 18, K.C.pink) + line('M11 15.5 l5 2.6', INK, 3.2) + line('M13 35 Q30 32 37.5 15', INK, 3.2)
      + eye(29, 14, 1.9) + blush(32, 30, 1.1) + K.H('M13 9.5 q3 -3.2 7 -3.6'),
  });
  // ---- Hình cho từ ví dụ còn trống (js/data-kana.js) ----
  SJ.addIcons({
    // ウール — cuộn len hồng cắm hai que đan, sợi len thả ra
    yarn: K => tube('M9 5 L29 29', K.C.brn, 2.2) + tube('M39 5 L19 29', K.C.brn, 2.2) + K.D(9, 5, 2.6, K.C.yel) + K.D(39, 5, 2.6, K.C.yel)
      + tube('M33 37 q7 1 8.5 5 q1 3 -3 3.5', K.C.rose, 2)
      + K.O(22, 29, 14, K.C.rose) + K.P('M10.5 22 q9 -2.5 18 -6.5 M11 37 q11 5 22 -2 M31 17.5 q5.5 9 1.5 21', 'none')
      + face(21.5, 29, .85) + K.H('M12.5 22 q1.4 -3.6 5 -5.4'),
    // ゾンビ — thây ma dễ thương: da xanh, băng dán trên đầu, hai tay giơ ra trước
    zombie: K => tube('M17 34 L6 31', K.C.grn, 3.6) + tube('M31 34 L42 31', K.C.grn, 3.6)
      + K.P('M15 30 H33 V44 l-3 -2.4 l-3 2.4 l-3 -2.4 l-3 2.4 l-3 -2.4 l-3 2.4 Z', K.C.lav)
      + K.O(24, 18.5, 13, K.C.grn) + K.P('M19 6.5 q2 -3 4 0 q2 -3.4 4.5 .2', 'none')
      + K.G('rotate(-24 16 11.5)', K.R(10.5, 9, 11, 5, 1.8, K.C.wht) + line('M14 10.4 v2.2 M17.5 10.4 v2.2', INK, 1))
      + line('M31.5 9.5 l3.5 6 M31 13.2 l3.6 -1.4 M32.6 16 l3.2 -1.5', INK, 1.3)
      + face(24, 21, .82, 'o'),
    // リャマ — lạc đà không bướu (llama) lông xù, cổ dài, khoác khăn hồng
    llama: K => K.R(11, 32, 4.4, 12, 2.2, K.C.cream) + K.R(18, 33, 4.4, 11, 2.2, K.C.cream) + K.R(26, 33, 4.4, 11, 2.2, K.C.cream) + K.R(32.5, 32, 4.4, 12, 2.2, K.C.cream)
      + K.P('M8 26 q-3 -6 4 -7.5 q2 -3 6 -1.5 q3 -2.5 6.5 0 q3.5 -2.5 6.5 0 L39 21 V33 q-2 4 -7 3 q-3 2.5 -6.5 0 q-3.5 2.5 -6.5 0 q-3.5 2.5 -6.5 0 q-6.5 1 -6.5 -4.5 q-3 -3 -1 -6.5 Z', K.C.cream)
      + K.P('M19 20.5 h12 v10 q-6 3.4 -12 0 Z', K.C.pink) + K.P('M19 25 h12', 'none')
      + K.R(30.5, 12, 9, 22, 4.5, K.C.cream)
      + K.P('M30.6 9 l.6 -6.5 l4 5.4 Z', K.C.cream) + K.P('M39.5 9 l1.6 -6.4 l3 5.8 Z', K.C.cream)
      + K.E(37, 12.5, 8.2, 6.4, K.C.cream) + K.P('M31.5 7.5 q2.5 -2.6 5 -.4 q2.5 -2.4 5 .2', 'none')
      + eye(34.6, 11.6, 1.2) + eye(40.2, 11.6, 1.2) + blush(32.2, 14.4, .7) + blush(42.6, 14.4, .7)
      + line('M36.6 14.6 q.8 .9 1.6 0', INK, 1),
    // はなぢ — bạn nhỏ bị chảy máu cam: giọt máu nhỏ ở mũi, tay cầm khăn giấy
    nosebleed: K => K.O(22, 24, 16, K.C.skin) + hairCap(K, 22, 22, 16, K.C.dbrn)
      + line('M13.5 21 l3.4 1.6 l-3.4 1.6 M30.5 21 l-3.4 1.6 l3.4 1.6', INK, 1.9) + blush(11.5, 28, 1.2) + blush(32.5, 28, 1.2)
      + K.P('M22 25 q1.4 1 0 2', 'none') + line('M19.5 33.5 q2.5 -1.6 5 0', INK, 1.5)
      + K.P('M23.5 27.8 q-2.4 3 -2.4 4.4 a2.4 2.4 0 0 0 4.8 0 q0 -1.4 -2.4 -4.4 Z', K.C.red)
      + K.G('rotate(14 39 33)', K.P('M33 27 h12 l-1 4 l1 4 l-1 4 h-12 l1 -4 l-1 -4 l1 -4 Z', K.C.wht)) + line('M5 9 l2.6 2.6 M3.5 15 h3.4', INK, 1.4),
    // ちょっと — bàn tay làm dấu "một chút xíu": ngón cái và ngón trỏ gần chạm nhau, kẹp một hạt đỏ bé tí
    pinch: K => K.G('rotate(2 14 26)', K.R(11, 13, 26, 9, 4.5, K.C.skin) + K.P('M32.5 14 q2.4 1 2.6 3.6', 'none'))
      + K.G('rotate(-2 14 26)', K.R(11, 30, 24, 9, 4.5, K.C.skin))
      + K.O(14, 26, 11, K.C.skin) + K.R(15, 15.6, 8, 21, 3, K.C.skin).replace('class="o"', '')
      + face(13, 26.5, .7)
      + K.D(36, 26, 1.7, K.C.red)
      + line('M43.5 17 v5.2 l-1.8 -1.8 M43.5 22.2 l1.8 -1.8 M43.5 34 v-5.2 l-1.8 1.8 M43.5 28.8 l1.8 1.8', INK, 1.4)
      + spark(40, 6, 3.2) + spark(5, 9, 2.4, '#ffc4d4'),
    // ニョッキ — đĩa bánh gnocchi Ý: những viên bánh khoai tây có vân, lá húng xanh, sốt cà chua
    gnocchi: K => K.E(24, 33, 22, 11, K.C.wht) + K.E(24, 32.5, 16.5, 7.4, K.C.sky)
      + K.P('M11 32 q3 -4 8 -2 q4 -3.4 9 -.6 q4.6 -2.4 9 1 q-1 4.6 -8 4 q-4 2.6 -9 .6 q-7 1.4 -9 -3 Z', K.C.red)
      + K.E(14.5, 31, 6.4, 4.8, K.C.cream, -12) + K.P('M11.5 28.6 l.8 4.2 M14.5 27.6 l.8 4.4 M17.5 27.4 l.6 4.2', 'none')
      + K.E(33.5, 31, 6.4, 4.8, K.C.cream, 12) + K.P('M30.6 27.6 l-.6 4.2 M33.6 27.6 l-.8 4.4 M36.6 28.6 l-.8 4.2', 'none')
      + K.E(24, 27, 8.4, 6.4, K.C.cream) + face(24, 27.4, .72)
      + K.P('M29 17 q5 -6 10.5 -3.4 q-2.4 6 -10.5 3.4 Z', K.C.dgrn) + K.P('M30.6 16.4 q3.8 -1.9 7.4 -2.6', 'none')
      + spark(8, 13, 3.2) + spark(42, 6, 2.4, '#ffc4d4'),
    // ヴェール — cô dâu nhỏ đội khăn voan trắng trong suốt, cài vòng hoa
    veil: K => K.P('M10 21 Q8 33 4.5 44 H43.5 Q40 33 38 21 Q37 9 24 8.5 Q11 9 10 21 Z', '#f6f2ff')
      + K.O(24, 24, 10.5, K.C.skin) + K.P('M13.6 22 q2 -8.6 10.4 -8.6 q8.4 0 10.4 8.6 q-4.4 -4.4 -10.4 -4.4 q-6 0 -10.4 4.4 Z', K.C.dbrn)
      + face(24, 25.6, .72)
      + K.P('M15 38 Q24 42.5 33 38 L35 44 H13 Z', K.C.wht)
      + K.O(16, 13, 2.8, K.C.pink) + K.O(24, 10.6, 3, K.C.rose) + K.O(32, 13, 2.8, K.C.pink) + K.D(24, 10.6, 1, K.C.yel)
      + line('M9 28 q-1.6 7 -3.4 13 M39 28 q1.6 7 3.4 13', '#c9bde0', 1.2) + spark(42, 8, 3.2),
    // タトゥー — cánh tay gồng nhẹ có hình xăm trái tim và dải ruy băng
    tattoo: K => K.P('M3 38 Q4 27 16 26 L26 25 Q31 18 34 9 Q36 4.5 40.5 6 Q44.5 7.5 43.5 12 L40 26 Q38 35 28 37 L18 39 Q8 41 3 38 Z', K.C.skin)
      + K.P('M33 13.5 q3 -1.4 5.2 .6', 'none') + K.P('M28 30 q3.4 -1.6 5.4 .2', 'none')
      + K.P('M17 37 l-6.4 -6.2 a4 4 0 0 1 6.4 -5 a4 4 0 0 1 6.4 5 Z', K.C.red) + K.H('M12 29 q.6 -1.6 2.2 -1.8')
      + K.P('M7.5 35 L9.4 33 H24.6 L26.5 35 L24.6 37 H9.4 Z', K.C.dblue)
      + K.H('M35.6 9.4 q1 -1.8 3 -2') + spark(10, 14, 3.6) + spark(20, 8, 2.4, '#ffc4d4'),
    // てがみ — phong thư nhỏ dễ thương có tim dán ở nắp thư (dùng cho hội thoại ở bưu điện)
    letter: K => K.R(5, 12, 38, 26, 3.5, '#fff7e8')
      + K.P('M6.5 14 L24 26 L41.5 14', 'none')
      + line('M6.5 36.5 L17 28.5 M41.5 36.5 L31 28.5', INK, 1.4)
      + K.P('M24 29.4 l-3.6 -3.4 a2.2 2.2 0 0 1 3.6 -2.8 a2.2 2.2 0 0 1 3.6 2.8 Z', K.C.red)
      + face(24, 33.6, .55)
      + spark(42, 6, 3.2) + spark(6, 6, 2.4, '#ffc4d4'),
  });
})(window.SJ);
