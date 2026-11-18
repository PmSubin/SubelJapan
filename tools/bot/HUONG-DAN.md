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
- [ ] Nói & Ngữ pháp: mỗi chặng có ít nhất 5 bài, bắt đầu từ chặng ít bài nhất — đã đủ 5: tq1 (thêm g50 Lời chúc mừng), tq2, tq3 (thêm g51 Màu gì?), tq4 (thêm g52 Đếm đồ vật ひとつ・ふたつ), tq5 (thêm g53 Ở tầng mấy? なんがい); còn 4 bài: tq6–tq12. Bài mới để ở `js/data-talk-e.js`, id tiếp theo g54
- [ ] Câu giao tiếp: mỗi nhóm có ít nhất 8 câu
- [ ] Bài lý thuyết ngữ pháp (g1–g6): mỗi bài có ít nhất 5 câu bài tập nhỏ
- [x] Vẽ icon hình gợi nhớ cho các chữ còn thiếu (đủ 91 chữ cơ bản, hình vẽ riêng nằm ở `js/icons-mnemo.js`)
- [ ] Hình gợi nhớ cho âm đục / âm ghép nếu có mẹo nhớ riêng (hiện dùng chung mẹo của chữ gốc)
- [ ] Thêm mặt kawaii cho các icon đồ ăn / đồ vật còn lại nếu đặt được mặt gọn gàng (đã có: bánh kem, cốc nước, cốc bia, chồng sách, cái ghế, mảnh ghép; kem, pizza, dưa lưới, cốc trà, quà có nhiều chi tiết nên chưa gắn)
- [ ] Thêm hội thoại tình huống nâng cao: ngân hàng, cắt tóc, mất đồ ở đồn cảnh sát (mỗi bài ≥ 10 câu)
- [ ] Kanji N5 bài mới: 店 駅 道 社 会 電 車 校 (bài j12, nơi chốn & đi lại)
- [ ] Kanji N5 bài mới: 朝 昼 夜 夕 春 夏 秋 冬 (bài j13, thời gian trong ngày & bốn mùa)
