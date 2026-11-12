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

Thêm trò chơi mới: viết vào `js/games-more.js` theo mẫu 3 trò đang có, đăng ký bằng `SJ.games.add({ id, icon, name, desc, color }, root => ({ destroy }))` và dùng `SJ.games.kit` (setup, result, top, distinctBy, setKey). Giao diện để trong `css/games3.css`, chỉ dùng màu theo chủ đề (`var(--card)`, `var(--pri)`…) để giao diện tối cũng đẹp. Bot kiểm tra tự mở và bấm thử mọi trò có trong `SJ.games.list`.

Thêm một chủ đề từ vựng mới thì phải thêm cả bài học tương ứng trong `js/data-lessons.js` (`type: 'vocab'`, `topic: '…'`). Thêm Kanji mới thì phải xếp nó vào một bài `type: 'kanji'`.

## Danh sách việc dài hạn

Mỗi lần chạy, bot làm theo thứ tự ưu tiên:
1. Sửa LỖI.
2. Bổ sung mục trong "Còn thiếu" của báo cáo.
3. Làm mục chưa đánh dấu đầu tiên trong danh sách dưới đây, rồi đánh dấu `[x]` khi xong.

Có thể thêm việc mới vào cuối danh sách nếu thấy app còn thiếu.

- [ ] Vẽ icon mới cho các từ ví dụ còn trống hình: ウール, はなぢ, ゾンビ, ちょっと, ニョッキ, リャマ, ヴェール, タトゥー (mỗi lần vài icon)
- [ ] Thêm truyện đọc: mỗi cấp 1, 2, 3 có ít nhất 6 truyện (mỗi truyện ≥ 6 câu, ≥ 5 từ mới, 3 câu hỏi)
- [ ] Thêm hội thoại tình huống cho đủ 12 bài (ở nhà ga, đi khám bệnh, hỏi đường, gọi điện, nhà hàng, khách sạn…)
- [ ] Chủ đề từ vựng mới: Cơ thể (からだ)
- [ ] Chủ đề từ vựng mới: Nghề nghiệp (しごと)
- [ ] Chủ đề từ vựng mới: Thời tiết (てんき)
- [ ] Chủ đề từ vựng mới: Phương tiện (のりもの)
- [ ] Chủ đề từ vựng mới: Quần áo (ふく)
- [ ] Chủ đề từ vựng mới: Địa điểm trong thành phố (まち)
- [ ] Kanji N5 bài mới: 東 西 南 北 外 前 後 間
- [ ] Kanji N5 bài mới: 父 母 行 来 出 入 休 見
- [ ] Kanji N5 bài mới: 食 飲 話 語 読 書 聞 買
- [ ] Kanji N5 bài mới: 毎 週 午 白 高 安 新 古 長
- [ ] Nói & Ngữ pháp: mỗi chặng có ít nhất 5 bài, bắt đầu từ chặng ít bài nhất
- [ ] Câu giao tiếp: mỗi nhóm có ít nhất 8 câu
- [ ] Bài lý thuyết ngữ pháp (g1–g6): mỗi bài có ít nhất 5 câu bài tập nhỏ
