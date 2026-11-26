# Bot SubelJapan — hướng dẫn & danh sách việc

SubelJapan là web học tiếng Nhật cho người Việt mới bắt đầu. Trang web là JavaScript thuần chạy trên `window.SJ`, không có bước build. Đẩy lên nhánh `main` thì GitHub Actions tự đăng lên https://pmsubin.github.io/SubelJapan/.

## Bot kiểm tra tổng

```bash
npm ci
npx playwright install --with-deps chromium   # lần đầu
npm run bot          # tất cả: file + dữ liệu + vẽ thử mọi icon + mở mọi trang (máy tính & điện thoại) + bấm thử ngẫu nhiên + chơi hết các bài
npm run bot:nhanh    # bỏ phần chơi từng bài
```

Mỗi lần chạy, bot ghi báo cáo vào `tools/bot/BAO-CAO.md` (file này không đưa lên git). Báo cáo có 3 phần:
- **LỖI**: hiện sai hoặc hỏng chức năng. Phải sửa trước mọi việc khác. Có lỗi thì bot thoát với mã 1, GitHub hiện dấu đỏ.
- **Cảnh báo**: nên sửa.
- **Còn thiếu / chưa đủ**: việc cần bổ sung.

Bot cũng tự chạy trên GitHub Actions (`.github/workflows/bot.yml`) mỗi lần đẩy code và mỗi sáng 8 giờ giờ Việt Nam.

Phần soát dữ liệu nằm ở `tools/bot/audit.js` và chạy bên trong trang. Muốn bot kiểm thêm điều gì thì sửa file đó.

## Quy ước khi thêm / sửa nội dung

- **Phải đúng tiếng Nhật thật**:
  - Romaji theo Hepburn, chỉ dùng ký tự ASCII.
  - Trợ từ は đọc `wa`, を đọc `o`, へ đọc `e`.
  - Ngày tháng và số đếm đọc đúng biến âm (ついたち, はつか, さんびゃく, はっぴゃく…).
  - Không chắc thì đừng thêm.
- **Lời giải thích bằng tiếng Việt**: ngắn, thân thiện, dành cho người chưa biết gì. Giọng văn dễ thương giống các bài đang có.
- **Chữ Nhật trong câu mẫu viết cách theo cụm (分かち書き)**:
  - Có dấu cách sau mỗi cụm, ví dụ `わたしは がくせいです。`.
  - Không cách giữa の và です.
- **Phông chữ**:
  - Chữ Nhật hiển thị bằng Kiwi Maru (`--f-jp`) và Klee One (`--f-kana`). Hai phông này giữ nét tách như chữ viết tay: さ き り.
  - Không đổi sang phông gothic nối nét (Zen Maru Gothic, M PLUS, Noto Sans JP…).
- **Hình minh hoạ**:
  - Chỉ dùng tên icon đã có (`SJ.ICON_NAMES`), hoặc vẽ icon mới cùng phong cách bằng `SJ.addIcons({ ten: K => … })`.
  - Icon vẽ trên khung 48×48, nét viền `K.P(...)`, màu lấy từ `K.C.*`. Xem mẫu trong `js/icons.js` (apple, tomato, umbrella) và `js/ai.js`.
  - Không dùng emoji, không dùng ảnh ngoài.
- **Hình phải thật cute (kawaii)**: đồ ăn, đồ vật, thiên nhiên nên có mặt dễ thương (mắt có đốm sáng, miệng cười nhỏ, má hồng). Vẽ icon mới thì vẽ luôn mặt, hoặc thêm một dòng `[x, y, cỡ]` vào `FACES` trong `js/icons-kawaii.js` (đặt mặt vào phần thân trơn, tránh chi tiết).
- **Hình gợi nhớ cho mẹo nhớ** (`SJ.MNEMO_PIC` cuối `js/data-kana.js`): hình phải **khớp đúng câu mẹo nhớ** của chữ đó (mã hoá kép chữ + hình). Không có icon hợp thì vẽ icon mới theo câu mẹo, đừng ghép đại.
- **Phương pháp học**: giữ đúng các nguyên tắc ở trang #/how (`js/plan.js`): ôn ngắt quãng, tự kiểm tra, chữ + hình, học xen kẽ, viết tay, nói thành tiếng, ít mà đều, phản hồi ngay. Tính năng mới phải theo ít nhất một nguyên tắc.
- **Giao diện**: sáng, dễ thương, 2D, không làm menu tối hay 3D.
- **Màu theo giao diện**: có 14 giao diện (`SJ.THEMES` trong `js/app.js`, màu ở đầu `css/style.css`). Chỉ dùng biến màu (`var(--card)`, `var(--ink)`, `var(--pri)`…), không viết cứng màu nền. Quy tắc riêng cho giao diện tối viết bằng `[data-dark]` (không dùng `[data-theme="yoru"]`), vì có 4 giao diện tối. Đừng dùng `closest("[data-theme]")` hay `closest("[data-kfont]")` trong trình xử lý bấm: thẻ `<html>` cũng mang các thuộc tính này.
- **Đổi số phiên bản**: mỗi lần sửa file trong `js/` hoặc `css/`, tăng `?v=N` cho **mọi** file trong `index.html` (cùng một số). Thêm file js mới thì nhớ nạp nó trong `index.html`.
- **Không đổi cấu trúc dữ liệu đã lưu của người dùng** (`localStorage` `subeljapan_v1`) theo cách làm mất tiến độ học.
- **Commit**: lời nhắn bằng tiếng Việt, nói rõ đã thêm hay sửa gì. Không thêm dòng ghi công (Co-Authored-By…).

### Dữ liệu nằm ở đâu

| Nội dung | File | Dạng |
|---|---|---|
| Bảng chữ, từ ví dụ, chữ dễ nhầm | `js/data-kana.js` | `[chữ, romaji, đọc kiểu Việt, mẹo nhớ, từ, romaji từ, nghĩa, icon]`; `EXAMPLES`; `CONFUSE`, `CONFUSE_TIPS` |
| Từ vựng, Kanji, bài lý thuyết | `js/data-content.js` | `V.chủ_đề = [[từ, romaji, nghĩa, icon]]`; `KJ = [chữ, Hán Việt, nghĩa, On, Kun, mẹo, [[từ, đọc, romaji, nghĩa]]]`; `SJ.TEXT` |
| Lộ trình bài học | `js/data-lessons.js` | `SJ.UNITS` (bài kana / vocab / kanji / text / test) |
| Truyện, hội thoại, câu giao tiếp | `js/data-reading.js` | `SJ.STORIES` (cấp 1: chỉ Hiragana; cấp 2: thêm Katakana; cấp 3: Kanji có furigana `{漢字\|かな}`), `SJ.DIALOGUES`, `SJ.PHRASES` |
| Nói & Ngữ pháp (12 chặng) | `js/data-talk.js` (khung + `SJ.TALK_UNITS`), `js/data-talk-a…e.js` (các bài) | Xem chú thích đầu `js/data-talk-e.js`. Mỗi bài cần ≥ 7 câu mẫu, ≥ 3 câu điền, ≥ 3 hội thoại. |

Thêm trò chơi mới: viết vào `js/games-more.js` theo mẫu 4 trò đang có, đăng ký bằng `SJ.games.add({ id, icon, name, desc, color }, root => ({ destroy }))` và dùng `SJ.games.kit` (setup, result, top, distinctBy, setKey). Giao diện để trong `css/games3.css`, chỉ dùng màu theo chủ đề (`var(--card)`, `var(--pri)`…) để giao diện tối cũng đẹp. Bot kiểm tra tự mở và bấm thử mọi trò có trong `SJ.games.list`.

Thêm một chủ đề từ vựng mới thì phải thêm cả bài học tương ứng trong `js/data-lessons.js` (`type: 'vocab'`, `topic: '…'`). Thêm Kanji mới thì phải xếp nó vào một bài `type: 'kanji'`.

## Danh sách việc dài hạn

Mỗi lần chạy, bot làm theo thứ tự ưu tiên:
1. Sửa LỖI.
2. Bổ sung mục trong "Còn thiếu" của báo cáo.
3. Làm mục chưa đánh dấu đầu tiên trong danh sách dưới đây, rồi đánh dấu `[x]` khi xong.

Có thể thêm việc mới vào cuối danh sách nếu thấy app còn thiếu.

- [x] Vẽ icon mới cho các từ ví dụ còn trống hình (đã xong ウール, はなぢ, ゾンビ, リャマ, ちょっと, ニョッキ, ヴェール, タトゥー — vẽ ở cuối `js/icons-mnemo.js`)
- [x] Thêm truyện đọc: mỗi cấp 1, 2, 3 có ít nhất 6 truyện (mỗi truyện ≥ 6 câu, ≥ 5 từ mới, 3 câu hỏi) — hiện: cấp 1 đủ 6, cấp 2 đủ 6 (thêm s17 ゆきだるま), cấp 3 đủ 6 (thêm s18 いっしゅうかん)
- [x] Thêm hội thoại tình huống cho đủ 12 bài (ở nhà ga, đi khám bệnh, hỏi đường, gọi điện, nhà hàng, khách sạn…) — đủ 12 (thêm d12 gửi đồ ở bưu điện, icon mới `letter`)
- [x] Chủ đề từ vựng mới: Cơ thể (からだ) — bài v11, 12 từ, 8 icon mới (body, head, kao, ear, nose, mouth, tummy, finger) ở cuối `js/icons-mnemo.js`
- [x] Chủ đề từ vựng mới: Nghề nghiệp (しごと) — bài v12, 12 từ, 4 icon mới (doctor, nurse, police, worker) ở cuối `js/icons-mnemo.js`
- [x] Chủ đề từ vựng mới: Thời tiết (てんき) — bài v13, 12 từ, 6 icon mới (cloudy, thunder, typhoon, sky, warm, uchiwa) ở cuối `js/icons-mnemo.js`
- [x] Chủ đề từ vựng mới: Phương tiện (のりもの) — bài v14, 12 từ, 8 icon mới (train, subway, shinkansen, bus, taxi, bicycle, motorbike, ticket) ở cuối `js/icons-mnemo.js`
- [x] Chủ đề từ vựng mới: Quần áo (ふく) — bài v15, 12 từ, 9 icon mới (tshirt, sweater, coat, skirt, dress, hat, socks, mitten, kimono) ở cuối `js/icons-mnemo.js`
- [x] Chủ đề từ vựng mới: Địa điểm trong thành phố (まち) — bài v16, 12 từ, 8 icon mới (town, konbini, bank, hospital, postoffice, library, park, cinema) ở cuối `js/icons-mnemo.js`
- [x] Kanji N5 bài mới: 東 西 南 北 外 前 後 間 — bài j8 (Phương hướng & vị trí)
- [x] Kanji N5 bài mới: 父 母 行 来 出 入 休 見 — bài j9
- [x] Kanji N5 bài mới: 食 飲 話 語 読 書 聞 買 — bài j10
- [x] Kanji N5 bài mới: 毎 週 午 白 高 安 新 古 長 — bài j11
- [x] Nói & Ngữ pháp: mỗi chặng có ít nhất 5 bài, bắt đầu từ chặng ít bài nhất — đã đủ 5: tq1 (thêm g50 Lời chúc mừng), tq2, tq3 (thêm g51 Màu gì?), tq4 (thêm g52 Đếm đồ vật ひとつ・ふたつ), tq5 (thêm g53 Ở tầng mấy? なんがい), tq6 (thêm g54 Mất bao lâu? 〜じかん・〜ふん), tq7 (thêm g55 Có hay làm không? よく・ときどき・あまり), tq8 (thêm g56 Đi để làm gì? 〜に いきます), tq9 (thêm g57 Người thế nào? どんな・〜くて・〜で), tq10 (thêm g58 Thích cái nào hơn? どちら・〜の ほうが・より・いちばん), tq11 (thêm g59 Xin đừng… 〜ないで ください), tq12 (thêm g60 Mình nghĩ là… 〜と おもいます). Bài mới để ở `js/data-talk-e.js`, id tiếp theo g61
- [x] Câu giao tiếp: mỗi nhóm có ít nhất 8 câu (đủ 6 nhóm × 8 câu)
- [x] Bài lý thuyết ngữ pháp (g1–g6): mỗi bài có ít nhất 5 câu bài tập nhỏ (mỗi bài đã có 6 câu)
- [x] Vẽ icon hình gợi nhớ cho các chữ còn thiếu (đủ 91 chữ cơ bản, hình vẽ riêng nằm ở `js/icons-mnemo.js`)
- [ ] Hình gợi nhớ cho âm đục / âm ghép nếu có mẹo nhớ riêng (hiện dùng chung mẹo của chữ gốc) — ghi chú 22/11: bảng DAKU/YOON trong `js/data-kana.js` chưa có câu mẹo riêng nào, nên mục này chờ khi có mẹo riêng
- [ ] Thêm mặt kawaii cho các icon đồ ăn / đồ vật còn lại nếu đặt được mặt gọn gàng (đã có: bánh kem, cốc nước, cốc bia, chồng sách, cái ghế, mảnh ghép; kem, pizza, dưa lưới, cốc trà, quà có nhiều chi tiết nên chưa gắn; ghi chú 23/11: đã thử tôm, hòm thư, rương, máy ảnh, cốc cà phê, cốc trà, ô, bắp cải — đều có vân/hoa văn ở giữa, mặt quá nhỏ hoặc đè chi tiết nên chưa gắn)
- [x] Thêm hội thoại tình huống nâng cao: ngân hàng, cắt tóc, mất đồ ở đồn cảnh sát (mỗi bài ≥ 10 câu) — d13 Mở tài khoản ở ngân hàng (12 câu), d14 Cắt tóc ở tiệm (13 câu, icon mới `scissors`), d15 Báo mất đồ ở đồn cảnh sát (13 câu); id tiếp theo d16
- [x] Kanji N5 bài mới: 店 駅 道 社 会 電 車 校 — bài j12 (Nơi chốn & đi lại)
- [x] Kanji N5 bài mới: 朝 昼 夜 夕 春 夏 秋 冬 — bài j13 (Thời gian trong ngày & bốn mùa)
- [ ] Nói & Ngữ pháp: thêm bài thứ 6 cho các chặng (ví dụ: 〜たり〜たり, 〜ことが できます, 〜まえに / 〜てから), bài mới ở `js/data-talk-e.js` — đã có: tq8 (g61 〜たり 〜たり します), tq7 (g62 Trước & sau khi… 〜の まえに・〜の あとで), tq9 (g63 Trở nên… 〜く なります・〜に なります), tq10 (g64 Mình có thể… 〜ことが できます), tq11 (g65 Nhờ lịch sự hơn 〜て くださいませんか), tq12 (g66 Đã từng… chưa? 〜た ことが あります), tq6 (g67 Tuần trước, tháng này, năm sau せんしゅう・こんげつ・らいねん), tq5 (g68 Bạn sống ở đâu? 〜に すんで います・ちかい・とおい), tq4 (g69 Chọn đồ & thử đồ 〜を みせて ください・〜に します), tq3 (g70 Sách gì? Hàng nước nào? なんの・どこの); còn thiếu tq1–tq2; id tiếp theo g71
- [ ] Câu giao tiếp: thêm nhóm mới (ở khách sạn, ở bệnh viện, nói chuyện điện thoại), mỗi nhóm 8 câu
- [ ] Thêm hội thoại tình huống nâng cao khác: ở hiệu thuốc, thuê nhà, phỏng vấn làm thêm (mỗi bài ≥ 10 câu, id tiếp theo d16)
- [x] Kanji N5 bài mới: 魚 肉 米 茶 牛 犬 鳥 町 — bài j14 (Đồ ăn, con vật & nơi ở)
- [ ] Kanji N5 bài mới: 少 多 早 近 遠 強 弱 明 (bài j15, tính chất — đối nghĩa)
