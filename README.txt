✳ made by tntl — WEBSITE SINH NHẬT SCRAPBOOK
====================================================

Dùng được trên desktop và điện thoại. Website thuần HTML/CSS/JS,
không cần cài phần mềm, tài khoản, database hay API key.

CÁCH DỄ NHẤT — TẠO WEB CỦA BẠN KHÔNG CẦN SỬA CODE
--------------------------------------------------
1. Giải nén bộ "Birthday_Letter_by_tntl.zip".
2. Mở file customize.html bằng Chrome hoặc Edge.
3. Điền tên người nhận, người gửi, lời chúc, chú thích ảnh.
4. Chọn 4 tấm ảnh (có thể để trống), chọn bài nhạc từ máy.
5. Chọn theme:
   original = nền xanh rêu vintage + sáp đỏ, giống clip.
   sky = nền xanh da trời pastel.
6. Nhấn "Xuất ZIP để deploy".
7. Giải nén ZIP vừa tải về, mở index.html để xem thử.
8. Deploy toàn bộ file đã giải nén lên Netlify / GitHub Pages / Vercel.

Trang customize.html đóng gói website ngay TRONG TRÌNH DUYỆT,
KHÔNG gửi hình, bài nhạc hay lời chúc của bạn lên máy chủ.
Bạn có thể mở lại và làm web khác, hoặc chỉnh nội dung rồi xuất lại.

CÁCH THỨ HAI — TỰ CHỈNH SOURCE BẰNG VS CODE
-------------------------------------------
1. Mở config.js bằng VS Code / Notepad.
2. Thay recipient, from, letterTo, letterTitle, letterParagraphs,
   photoCaptions, music, wishText... bằng nội dung mong muốn.
3. Đặt ảnh vào assets/ và sửa photos, ví dụ:
      photos: [
        "assets/anh-1.jpg", "assets/anh-2.jpg",
        "assets/anh-3.jpg", "assets/anh-4.jpg"
      ],
4. Đặt file nhạc vào assets/music.mp3 rồi sửa:
      music: "assets/music.mp3",
5. Sửa theme: "original" hoặc theme: "sky".
6. Deploy toàn bộ index.html + style.css + script.js + config.js + assets/.

DEPLOY
------
A) NETLIFY: Vào https://app.netlify.com/drop, kéo toàn bộ
   THƯ MỤC chứa index.html và assets vào. Nhận URL.
B) GITHUB PAGES: Tạo repository GitHub > upload các file vào
   thư mục gốc > Settings > Pages > chọn main / root.
C) VERCEL: Import repository GitHub; chọn Other (static website).

LƯU Ý
-----
- Website có 6 cảnh: phong thư đóng, thư mở, lá thư, photobooth,
  đĩa nhạc, cỏ bốn lá. Click để tương tác / dùng nút Back–Next.
- Ảnh hỗ trợ JPG, PNG, WEBP. Nên dùng ảnh 3:4 hoặc 4:5.
- Nhạc hỗ trợ MP3, M4A, OGG, WAV tùy trình duyệt.
- Do giới hạn của trình duyệt, nhạc CHỈ bắt đầu khi bấm Play.
- Nếu chọn ảnh/nhạc quá lớn, tải trang trên điện thoại sẽ chậm.
  Nên nén ảnh và dùng nhạc MP3 dưới ~15 MB.
- Lời chúc dài có thể cuộn trong giấy thư ở điện thoại.
- Font trang được tải từ Google Fonts nếu có kết nối Internet;
  nếu không có, trình duyệt sử dụng font dự phòng.
- Chỉ sử dụng những file nhạc/ảnh mà bạn có quyền chia sẻ.

CẤU TRÚC SOURCE
--------------
customize.html   Trang chỉnh sửa riêng để nhập ảnh/nhạc và tạo ZIP, dùng offline
index.html       Trang web 6 cảnh
style.css        Màu và hiệu ứng scrapbook
script.js        Animation, điều hướng, âm nhạc, phóng ảnh, pháo giấy
config.js        Nội dung và đường dẫn hình/nhạc
assets/          Trang trí nghệ thuật + ảnh nhạc của bạn

Các SVG trang trí được tạo mới để gợi lại phong cách trong clip;
không dùng hoặc sao chép hình ảnh tách trực tiếp từ video.

CẬP NHẬT tntl
--------------
- Bỏ tên studio cũ; ghi công "made by tntl" ở góc trên và "made by tntl ♡" ở chân trang.
- Đồng bộ số trang theo 6 cảnh: 01 / 06 đến 06 / 06, kể cả ghi chú của cảnh mở thư.
- Trang customize.html có mã nguồn đã sửa được nhúng sẵn; ZIP xuất ra giữ nguyên các thay đổi này.

CẬP NHẬT: caption + lời bài hát
------------------------------
- Credit hiển thị ở góc và chân web: "made by tntl" (chữ thường).
- Caption 4 ảnh sửa trong customize.html, ô "Caption ảnh 1–4". Caption dài tự xuống dòng và tự thu phông; toàn văn hiển thị khi nhấn mở ảnh lớn.
- Lời bài hát điền vào ô "Lời bài hát" tại customize.html, hoặc config.js: lyrics: "...".
- Nếu có file lời hát LRC, có thể dán dạng: [00:12.50] Dòng lời thứ nhất. Khi phát nhạc, dòng có mốc thời gian sẽ được tô sáng theo vị trí phát.
- Chỉ tự hiển thị / đồng bộ lời hát mà bạn điền vào, không tự nhận dạng lời từ file MP3.
- Nếu lyrics dài, nội dung nằm trong tờ giấy có thể cuộn. Cảnh nhạc trên điện thoại được tăng chiều cao riêng để không chèn chữ.

Music sheet update: moved higher, widened and darkened lyric typography for legibility on phones and desktops. Both this ZIP and customize.html export include the fix.
