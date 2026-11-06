# SubelJapan — Học tiếng Nhật dễ như ăn mochi

Web học **đọc & viết tiếng Nhật cho người mới bắt đầu từ con số 0**, giao diện tiếng Việt, đồng hành cùng mèo **Mochi** siêu dễ thương.

**Vào học ngay:** https://pmsubin.github.io/SubelJapan/

![Trang chủ — lộ trình học](assets/screens/home.png)

## Có gì bên trong?

| | |
|---|---|
| **Bản đồ hành trình xứ Nhật** | 6 vùng đất có cảnh riêng (vườn anh đào, phố Tokyo, chợ ẩm thực, núi Phú Sĩ, trời sao đêm), con đường uốn lượn tô màu theo tiến độ, 56 bài siêu ngắn + **16 màn thưởng** (trò chơi, truyện, thử thách viết, gõ phím, chuỗi đúng) + rương cuối mỗi phần. |
| **Nhiều mục tiêu** | Mỗi phần: gom sao, phá màn thưởng để nhận vương miện. Mỗi ngày 3 nhiệm vụ, mỗi tuần 3 thử thách lớn, 10 mục tiêu dài hạn nhiều bậc có thưởng. |
| **Đủ mọi chữ theo a・i・u・e・o** | 46 chữ cơ bản, âm đục ゛/゜, âm ghép (きゃ…), chữ nhỏ (っゃゅょ…), âm ngoại lai Katakana (ファ, ティ, ヴ…). Có mẹo nhớ tiếng Việt và cảnh báo **chữ dễ nhầm** (シ/ツ, ソ/ン, ぬ/め…). |
| **Bài tập đa dạng** | Chọn đáp án, nghe chọn chữ, ghép cặp, gõ romaji, xếp chữ thành từ, **viết từng nét** ngay trong bài. |
| **Luyện viết chấm từng nét** | Dữ liệu nét chuẩn KanjiVG: máy kiểm tra **đúng vị trí, đúng chiều, đúng thứ tự** từng nét. 3 mức: Tô theo → Gợi ý → Thuộc lòng. |
| **Phiếu tập viết in ra giấy** | Tạo phiếu ô vuông genkō (原稿) từ hàng chữ / bài Kanji / chữ tự nhập, in A4 để luyện bằng bút. |
| **Đọc hiểu** | 16 truyện ngắn từ dễ đến khó (có furigana, romaji, dịch tiếng Việt, câu hỏi hiểu bài), 8 hội thoại đời thường (có chế độ đóng vai), 48 câu giao tiếp hay dùng. |
| **Gõ phím tiếng Nhật** | Bộ gõ romaji → kana như bàn phím thật, luyện gõ chữ cái / từ / câu, đo tốc độ, hướng dẫn bật bàn phím Nhật trên máy tính và điện thoại. |
| **Luyện tập vô tận & Ôn tập** | Đọc / nghe / viết từ trí nhớ không giới hạn, có **chuỗi đúng liên tiếp**; thẻ nhớ lặp lại ngắt quãng (SRS) tự nhắc đúng lúc. |
| **6 trò chơi** | Thử thách 60 giây, Mưa chữ, Lật thẻ, Nghe chọn chữ, Ghép từ, Đúng hay Sai. |
| **Sổ từ** | Tra nhanh bằng tiếng Việt, romaji, Hán Việt hoặc chữ Nhật; lưu từ yêu thích để ôn. |
| **Giữ lửa mỗi ngày** | Chuỗi ngày học, mục tiêu XP, 3 nhiệm vụ mỗi ngày, 15 cấp độ, 26 huy hiệu, lịch học dạng bản đồ nhiệt. |
| **Mochi đi dạo** | Mèo Mochi đi lững thững trên màn hình, ngồi, ngủ, nhảy, nói chuyện bằng tiếng Nhật; vui khi bạn trả lời đúng. **Nắm kéo, thả rơi, ném bay** được luôn! (Tắt được trong Hồ sơ) |
| **Tiệm của Mochi** | Kiếm **cá vàng** khi học để mua phụ kiện, đổi "vị" mochi (hoa anh đào, trà xanh, khoai môn…) và **bùa giữ chuỗi お守り**. |

![Bài học](assets/screens/lesson.png)
![Luyện viết chấm từng nét](assets/screens/write.png)
![Truyện ngắn có furigana](assets/screens/story.png)
![Tiệm của Mochi](assets/screens/shop.png)
![Phiếu tập viết](assets/screens/print.png)

<img src="assets/screens/mobile.png" width="300" alt="Giao diện điện thoại">

## Tự làm 100%

- **Hình vẽ:** mèo Mochi và toàn bộ ~250 icon (con vật, đồ ăn, người, đồ vật…) đều được vẽ tay bằng SVG — không dùng emoji hay bộ icon có sẵn.
- **Âm thanh:** tự tổng hợp bằng Web Audio — chuông "pin-pon", đàn koto, kalimba theo thang ngũ cung Nhật, tiếng cá vàng leng keng, rương báu, mèo "nya~".
- **Phát âm tiếng Nhật:** dùng giọng đọc có sẵn của trình duyệt (tốt nhất trên Chrome / Edge).

## Chạy trên máy

Không cần cài gì — đây là web tĩnh (HTML + CSS + JavaScript thuần).

```bash
git clone https://github.com/PmSubin/SubelJapan.git
cd SubelJapan
npx serve .
```

Tiến độ học được lưu trong trình duyệt (localStorage); có nút sao lưu / khôi phục trong trang Hồ sơ.

## Cấu trúc

```
index.html            khung trang
css/style.css         giao diện "Mochi Pop"
css/soft.css          nút mềm, hoạt ảnh, Mochi đi dạo
css/map.css           bản đồ hành trình, cảnh vật, màn thưởng
js/icons.js           bộ hình vẽ tay SVG
js/data-*.js          dữ liệu Kana, từ vựng, Kanji, bài học, truyện & hội thoại
js/store.js           XP, chuỗi ngày, cá vàng, nhiệm vụ, tiệm đồ, huy hiệu, SRS
js/audio.js           phát âm + bộ tổng hợp âm thanh
js/ui.js              mèo Mochi, hộp thoại, thông báo
js/ime.js             bộ gõ romaji → kana
js/writing.js         hoạt hình nét viết + chấm từng nét
js/lesson.js          trình phát bài học
js/games.js           6 trò chơi
js/practice.js        luyện tập vô tận
js/pages.js           lộ trình, bảng chữ, luyện viết, ôn tập, hồ sơ, giới thiệu
js/pages-more.js      đọc hiểu, gõ phím, sổ từ, phiếu in, tiệm Mochi
js/app.js             định tuyến & khung ứng dụng
js/pet.js             Mochi đi dạo (kéo thả, ném, rơi có trọng lực)
```

## Ghi công

- Dữ liệu thứ tự nét chữ: [KanjiVG](https://kanjivg.tagaini.net) © Ulrich Apel — giấy phép [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) (tải trực tiếp khi dùng).
- Phông chữ: [Baloo 2](https://fonts.google.com/specimen/Baloo+2), [Nunito](https://fonts.google.com/specimen/Nunito), [Zen Maru Gothic](https://fonts.google.com/specimen/Zen+Maru+Gothic), [Klee One](https://fonts.google.com/specimen/Klee+One) — SIL Open Font License.
