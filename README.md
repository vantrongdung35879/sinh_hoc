# BioGalaxy — Sinh học 12

Ứng dụng học tập Sinh học 12 chạy hoàn toàn trên trình duyệt (GitHub Pages), gồm **ứng dụng học sinh** (`sinh.html`), **bảng quản trị** (`admin.html`), **cổng vào** (`index.html`) và công cụ build icon (`_ins_sprite.js`).

Phiên bản tài liệu: **v5.8** · Năm học: **2026–2027**.

---

## 1. Chạy nhanh

Vì ứng dụng dùng `fetch`/Service Worker, nên chạy qua HTTP thay vì mở trực tiếp `file://`:

```bash
cd <thư-mục-dự-án>
python -m http.server 8080
# mở http://localhost:8080/index.html
```

Mở trực tiếp `sinh.html` bằng `file://` vẫn học được, nhưng **PWA, Service Worker và đấu online qua PeerJS có thể bị chặn** tuỳ trình duyệt.

---

## 2. Cấu trúc

```
index.html            Cổng vào (2 thẻ: Học sinh / Quản trị)
sinh.html             Ứng dụng học sinh (lý thuyết, ngân hàng, thi, Lab, Casio, đấu online)
admin.html            Quản trị (key, mã 5 phút, Key Studio, Vault, xuất bản dùng chung)
manifest.webmanifest  PWA manifest
sw.js                 Service Worker (cache lõi, offline)
icon-192.png           Icon PWA
icon-512.png           Icon PWA
_ins_sprite.js        Script build: chèn sprite SVG, dọn CSS rác, font async
*.bak_*               Bản sao lưu trước mỗi phiên bản (không phải trang ứng dụng)
```

> Các tệp `*.bak_*` **không** được liên kết từ `index.html`; khi triển khai GitHub Pages nên để nguyên hoặc chuyển vào thư mục `backups/` để tránh người dùng mở nhầm.

---

## 3. Tính năng chính

### Học sinh (`sinh.html`)
- **Lý thuyết** 20+ chuyên đề, công thức, bẫy thi.
- **Ngân hàng câu hỏi**: 350+ trắc nghiệm, 56 cụm Đúng/Sai, 73 câu trả lời ngắn; lọc theo chuyên đề, tìm kiếm, xem lời giải.
- **Phòng thi**: Solo, đề chuẩn 18 · 4 · 6 (18 trắc nghiệm · 4 cụm Đúng/Sai · 6 trả lời ngắn, theo form áp dụng từ kỳ thi 2025), phân bổ độ khó, đồng hồ, chấm điểm và **xem lại câu sai** kèm cách làm.
- **Lab**: 23 thí nghiệm canvas; kéo để chỉnh tham số, chạm để đọc số, ghim ảnh so sánh, sparkline, HUD LIVE.
- **Casio fx-580VN X BIO-HACKS**: 7 kỹ thuật, mỗi kỹ thuật có **chọn dạng bài** và **chuỗi phím sinh tự động theo số liệu bạn nhập**:
  ① Binomial PD/CD (đúng k alen trội · từ a đến b · ít nhất 1 con bệnh),
  ② TABLE (CLTN s=1 · tự thụ với hai hàm f(x), g(x)),
  ③ SOLVE (hoán vị gen · Michaelis–Menten → Km · độ thanh thải thận C = U·V/P),
  ④ Hệ phương trình (DNA từ N, H · cấu trúc P từ %aa ở F2, F3),
  ⑤ vòng lặp `A=A+1 : X=(X−sX²)÷(1−sX²)` + CALC, ⑥ nCr thể tứ bội, ⑦ thống kê 1 biến.
  Mỗi dạng có dòng "vì sao máy ra kết quả đó" và kết quả JavaScript tính độc lập để đối chiếu.
- **Đấu online**: 1–15 người qua PeerJS/WebRTC (STUN/TURN), fallback bus cục bộ khi offline.
- **Thẻ ghi nhớ (Flashcard SRS)**: 452 thẻ dựng từ ngân hàng + lý thuyết; lật thẻ, tự chấm 4 mức (chưa thuộc / đang nhớ / đã thuộc / thành thạo); lịch ôn giãn theo SM-2 rút gọn, lưu trong IndexedDB, giới hạn 20 thẻ mới/ngày.
- **Gia sư theo năng lực**: đọc đúng dữ liệu đã làm (chuyên đề yếu, độ chính xác, xu hướng 10 bài gần nhất), đề xuất kế hoạch 15–30 phút/ngày và mục tiêu điểm; **cảnh báo "chưa đủ dữ liệu"** khi dưới 20 câu, không bịa nhận xét.
- **Sơ đồ tương tác**: 3 sơ đồ SVG (tế bào nhân thực, chạc ba tái bản DNA, 4 kỳ nguyên phân) — kéo nhãn hoặc chạm nhãn rồi chạm ô, chấm đúng/sai và giải thích từng vị trí.
- **Hồ sơ UUID cố định**, **sao lưu/khôi phục JSON**, **IndexedDB** cho dữ liệu lớn.
- **PWA**: cài như ứng dụng, mở lại nội dung đã cache khi offline.
- Giao diện sáng/tối/theo thiết bị; tự nhận diện **phone / tablet / laptop / desktop**; chế độ Lite.

### Quản trị (`admin.html`)
- Mã mở khoá 5 phút (HMAC-SHA256), Key Studio (nhanh / tuỳ chỉnh / đến giờ), Key Vault (lọc, tìm, copy, QR).
- Ký key dài hạn bằng **ECDSA P-256**; khoá riêng được **niêm phong AES-GCM**, chỉ giải mã trong RAM sau khi đăng nhập.
- Xuất bản `admin.html` dùng chung (mang sẵn mã xác thực) để mọi máy dùng cùng mật khẩu.
- Nhật ký thao tác, xuất CSV/JSON.

---

## 3a. v5.6 — nội dung lớp 11 & sửa luồng đấu online

### Ôn lớp 11 (tab mới trong dock, **nhúng ngay trong `sinh.html`**, không tạo file/thư mục mới)
Nguồn: `bài tập 1 - 11A2.docx` · `BT 2 - lớp 11a2.docx` · `11A2.docx` ·
`ĐỀ CƯƠNG ÔN THI CUỒI KÌ 1- LỚP 11 (HS).docx` · `ĐỀ CƯƠNG ÔN THI HSG - LỚP 11.docx`.
**10 chủ đề / 104 câu**, mỗi chủ đề có 3 khung: *NÓI THẬT CHẬM* (giải thích không dùng từ khó),
*GIỐNG NHƯ THẾ NÀY* (ví dụ đời thường), *CHỈ CẦN NHỚ* (câu chốt). Bấm đáp án là hiện lời giải ngay;
có ô tìm kiếm toàn văn. Các câu phụ thuộc hình ảnh trong bản gốc được bỏ qua để không đoán sai đáp án.

### Sửa lỗi đấu 2–15 người & 1v1
| Vấn đề | Cách sửa |
|---|---|
| Một người nộp sớm → cả phòng bị ép nộp và người chưa xong **0 điểm** | Người nộp sớm vào màn chờ; Host phát `firstDone` + đếm ngược; người khác làm tiếp; hết giờ phát `collect`, ai chưa nộp **tự nộp theo đúng các câu đã trả lời**; `progress` nay mang kèm đáp án để chấm một phần |
| Bật "Dùng mạng" không thấy ô số mạng/tim và kiểu mạng | Thêm bảng cấu hình: số mạng (1–99), kiểu kết nối (tự động / LAN / relay / offline), thời gian chờ sau người nộp đầu (5–120 giây); đồng bộ sang bảng chủ phòng, VS và 1v1 cũ |
| 1v1 online kiểu cũ không chỉnh được thông số | Màn hình cấu hình có thêm ô số tự do cho số câu, thời gian, số mạng + chọn kiểu kết nối (vẫn giữ nút bấm nhanh) |
| Xem lại bài sau 2–15 / 1v1 / VS chỉ hiện chữ cái đáp án | Mỗi câu giờ có đủ: câu hỏi, đáp án bạn chọn (chữ + nội dung), đáp án đúng (chữ + nội dung), **Vì sao**, gợi ý và bẫy |
| Bấm nhầm "Rời phòng / Thoát" mất cả trận | Hiện xác nhận "Bạn có muốn thoát phòng không?" (cả phòng 2–15, 1v1 online, VS cùng máy) |
| Kiểu cũ còn nút Trước/Sau, chọn xong đứng yên | Ẩn nút chuyển, **chọn xong tự sang câu tiếp**, không hiện đúng/sai giữa chừng, chỉ chấm sau khi nộp bài |

### Làm đẹp & giải trí
- Phòng chờ: thẻ người chơi có hiệu ứng vào, mã phòng nổi bật, banner trạng thái nhịp nhàng.
- **Mini-game khủng long** (Canvas 2D thuần, không CDN): bầu trời đêm có sao/trăng/mây, đồi xa, xương rồng, khủng long nhảy bằng Space / ↑ / chạm, **3 mạng**, điểm tăng dần, bụi khi mất mạng, màn hình hết mạng, nút Chơi lại. Tự dừng khi vào trận / ẩn tab / tắt hiệu ứng nặng.
- Lab: thêm lớp phản xạ kính và ánh sáng đỉnh cho khung thí nghiệm (tắt trên điện thoại để đỡ tải GPU).
- Dock 10 tab trên điện thoại cuộn ngang, vẫn hiện nhãn, thanh chỉ thị tự căn theo tab đang chọn.

## 3d. v5.8 — không khí lab, game mới, hiệu ứng 3D

### Thí nghiệm (áp dụng cho **cả 23 lab**, không riêng lab nào)
- **Lớp khí quyển dùng chung**: quầng sáng màu theo từng thí nghiệm, hai luồng sáng chéo, ánh sáng trần,
  16 hạt bụi lơ lửng, sương nền và vignette. Gradient được **cache** theo kích thước/theme/màu nên không tạo lại mỗi khung hình.
- **Màu nhận diện riêng**: 12 màu luân phiên theo thứ tự lab, áp cho viền 4 góc, HUD và **số đo** (đặt biến ở `#view-lab` để readout bên ngoài canvas cũng nhận).
- **Nghiêng 3D theo con trỏ** (desktop, không Lite): `perspective(1200px)` + `rotateX/rotateY` tối đa ~3–4°, kèm vệt phản chiếu chạy theo chuột.
- Thêm `contain: layout paint` cho khung lab.

### Game khủng long (phòng chờ)
- **Parallax 2 dãy đồi**, mây trôi, sao mờ dần, chu kỳ **ngày/đêm** theo điểm.
- **Nhảy đôi** (Space/↑/chạm), nghiêng thân theo vận tốc, bụi khi tiếp đất.
- **Nhặt 🧬 +6 điểm** có quầng sáng, chữ "+6" bay lên, âm thanh riêng.
- **Rung màn hình + chớp đỏ** khi va chạm; khủng long to hơn (32×24), có gai lưng, mắt có điểm sáng, chân chạm đất.
- HUD 3 tim mờ dần theo mạng còn lại, lưu kỷ lục trong phiên.

### Hiệu ứng chung
- **Gợn sóng khi bấm** trên nút/modecard/seg/keycap (rất rẻ, chạy cả ở Lite).
- **Thanh tiến trình cuộn** 2px ở đỉnh trang, gradient cyan → xanh lá → tím.
- Hover card có viền sáng và bóng mềm (chỉ desktop).

### Tối ưu
- Bụi/luồng sáng tự tắt ở Lite và điện thoại; gradient cache; `requestAnimationFrame` gộp cho tilt và thanh cuộn.
- Đo lại trong cùng môi trường headless: lab **29 → 34 fps** (không giảm).

## 3c. v5.7 — Casio BIO-HACKS 2.0 (13 kỹ thuật)

Tab Casio được chia **3 phân hệ**:

1. **Cheat-sheet** — 13 thẻ gập, mỗi thẻ có: bản chất Sinh học, công thức, **chuỗi phím dạng keycap
   kim loại** (chữ vàng cho SHIFT/MENU/OPTN, đỏ cho ALPHA, xanh cho `=`) và ghi chú cạm bẫy.
2. **Máy tính theo dạng bài** — 7 máy tính cũ + **6 máy tính mới**: nhập số liệu đề, bấm tính là ra
   kết quả *và* chuỗi phím đã điền đúng con số của bạn.
3. **Giả lập fx-580VN X** — máy ảo có màn hình LCD, 30 phím, chạy demo từng phím: phím sáng lên,
   màn hình in ra đúng dòng máy thật sẽ hiện, kèm danh sách bước.

### 6 kỹ thuật nâng cao (HSG / phân hoá 9+)

| # | Kỹ thuật | Ví dụ mặc định | Kết quả |
|---|---|---|---|
| ⑧ | **Ma trận Markov** (MENU 4) — tự phối n thế hệ | P: 0,3 AA : 0,6 Aa : 0,1 aa, n = 3 | F3 = **0,5625 / 0,075 / 0,3625** |
| ⑨ | **Hồi quy hàm mũ** (MENU 6 → 5) | 0h:100 · 2h:400 · 4h:1600 · 6h:6400 | a = 100, b = 0,693147, N(10) = **102400** |
| ⑩ | **Kiểm định χ²** (STO M+) | 315 : 108 : 101 : 32 | χ² = **0,47** < 7,815 → nhận H₀ |
| ⑪ | **Nhóm máu ABO** (STO biến) | O = 4%, A = 21% | r = 0,2 · p = 0,3 · q = 0,5 · B dị hợp = **20%** |
| ⑫ | **Tứ bội 4n × 4n** (nCr) | AAaa × Aaaa | aaaa = **1/12**, trội = 11/12 |
| ⑬ | **Bản đồ 3 điểm** (testcross) | 580/592 · 40/45 · 89/94 · 3/5 | A–B = **6,42 cM**, B–C = **13,19 cM**, C = 0,652 |

Mọi kết quả đều được tính lại độc lập bằng JavaScript để đối chiếu với máy; dữ liệu vô lý bị chặn
bằng thông báo rõ ràng (tổng tỉ lệ ≠ 1, số mũ âm, tỉ lệ χ² sai số lượng, O = 0…).

### Sửa lỗi & tối ưu trong v5.7
- **Lỗi thuật toán bản đồ 3 điểm**: chuẩn hoá mặt nạ gen bằng `Math.min` khiến mặt nạ 1 bit ở vị trí C
  bị đổi thành 3 bit và bị bỏ qua → khoảng cách thứ hai tụt về đúng tần số hoán vị kép (0,55 thay vì 13,19 cM).
  Đã đổi sang so sánh **số bit** (popcount).
- **Ô chọn bài của giả lập không khớp** bài đang chạy (hiện "Nhị thức" nhưng dữ liệu Markov) → đồng bộ lại.
- **CSS sai cú pháp**: `@media` lồng trong danh sách selector làm hỏng cả rule → tách ra.
- Cheat-sheet, 6 máy tính và giả lập đều **render khi mở lần đầu**, không dựng sẵn lúc khởi động.
- Lab có **màu nhận diện riêng** cho từng thí nghiệm (viền góc + HUD), thêm `contain: layout paint`.
- Keycap đổi sang **kim loại**, có biến thể sáng/tối; hero có vệt sáng xoay chậm (tắt ở Lite/phone).

## 3b. Những lỗi đã sửa ở v5.5 (soát toàn bộ)

| Lỗi | Hậu quả trước khi sửa | Cách sửa |
|---|---|---|
| `BG4_BACKUP.validate()` thiếu khối `data` | Ném `TypeError` thay vì báo lỗi thân thiện khi nhập JSON hỏng | Guard `if (!d) return []` |
| Chuyên đề `dm` không có trong `TOPICS` | ~29 câu bị dán nhãn "Di truyền phân tử", không lọc được, lộ trình bỏ sót | Thêm `dm` vào `TOPICS` |
| 73 câu trả lời ngắn thiếu trường `t` | Flashcard gán nhầm tất cả vào Di truyền phân tử | Bảng phân loại 73 câu + fallback theo từ khoá |
| Rời tab khi đang thi | Timer tiếp tục chạy, phòng thi vẫn mở → tự nộp ở tab khác | `go()` dừng timer + đóng phòng + báo rõ |
| Đổi mật khẩu admin khi chưa thiết lập | Ném `Cannot read properties of null` | Khởi tạo bản ghi + cho phép xác thực bằng khoá chủ |
| Nút gạt FX/Âm thanh | Không có nhãn, cao 22px | `role="switch"`, `aria-checked`, 44×26px |
| `resetAll()` | Ghi "xóa tiến độ" nhưng không xóa; bỏ sót nhiều khoá | Nói đúng phạm vi + xóa đủ khoá tùy chỉnh |
| Thiếu favicon | 404 mỗi lần tải | Thêm `link rel=icon` |
| `CACHE_VERSION` kẹt ở bản cũ | Client có thể giữ cache cũ | Tăng lên `biogalaxy-v5-5-0` |

## 4. Bảo mật — đọc kỹ

Đây là **ứng dụng tĩnh**. Mọi thứ nằm trong tệp HTML đều có thể bị người dùng đọc.

Đã làm:
- Không còn mã khoá chủ `35879` dạng chuỗi trần. Chỉ lưu **PBKDF2-HMAC-SHA256 (100.000 vòng, salt cố định)** để so sánh.
- Không còn **private key ECDSA** dạng JWK trần. Khoá riêng được mã hoá AES-256-GCM, khoá giải mã dẫn xuất PBKDF2; `unsealPrivJwk()` chỉ chạy khi đã đăng nhập.
- So sánh hằng thời gian; không lưu mật khẩu gốc.

**Giới hạn còn lại (không thể khắc phục nếu không có backend):**
- Ai có tệp vẫn có thể brute-force mã 5 chữ số (100.000 khả năng) hoặc giải mã blob niêm phong, vì khoá suy ra từ hằng số trong tệp.
- Không thể phân quyền thật, không thể chống sửa điểm, không thể xác thực lượt thi ở máy chủ.
- Muốn bảo mật thật: dùng backend (mục 7) và **chuyển ký key + xác thực + chấm điểm thi đấu lên server**.

---

## 5. Sao lưu & khôi phục

Trong **Cài đặt → Sao lưu & khôi phục**:
- **Xuất JSON**: hồ sơ (UUID, tên, avatar), lịch sử thi, lịch sử đấu, tiến độ chuyên đề, hộp ôn tập, thành tích, câu tự soạn, cài đặt.
- **Nhập JSON**: kiểm tra schema/version, kiểm tra từng bản ghi, phát hiện trùng, báo lỗi trước khi ghi.
- Trước khi ghi đè, bản hiện tại được lưu tự động vào IndexedDB (`backup_auto`).
- UUID **không** sinh từ tên/streak, nên đổi tên hay đổi máy không tạo hồ sơ mới.

---

## 6. Triển khai GitHub Pages

1. Đẩy các tệp lên nhánh `main`.
2. **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. Mở `https://<user>.github.io/<repo>/`.
4. Kiểm tra `manifest.webmanifest` và `sw.js` trả về 200; mở DevTools → Application → Service Workers.
5. Mỗi lần phát hành, tăng `CACHE_VERSION` trong `sw.js` để buộc cập nhật cache.

Lưu ý: GitHub Pages phục vụ tĩnh, **không chạy được backend**. Các chức năng lớp học/đồng bộ/giải đấu cần backend riêng.

---

## 7. Backend (không kèm trong bản này)

Bản phát hành này **chỉ gồm các tệp tĩnh** ở trên — không có thư mục backend, không có schema, không có khoá nào.

Nếu sau này cần đồng bộ đa thiết bị / lớp học / chống sửa điểm, phải dựng backend riêng (Supabase hoặc Firebase) và:
- giữ **private key ký key truy cập** trong secret của server, không bao giờ gửi xuống trình duyệt;
- bật **RLS** cho mọi bảng, chỉ đưa `anon key` ra client;
- chấm điểm bằng RPC ở server, không nhận `score` từ client;
- **không** đặt `service_role key` trong HTML/JS.

Khi chưa có backend, các giới hạn ở mục 4 vẫn đúng: không phân quyền thật, không chống sửa điểm, không đồng bộ thật giữa các máy.

---

## 8. Kiểm thử

Đã chạy (Chrome headless + CDP `Runtime.evaluate`):
- Khởi động, điều hướng 9 tab + 4 tab Lộ trình, tìm kiếm ngân hàng, đổi theme/size.
- Chấm điểm: trắc nghiệm, Đúng/Sai, trả lời ngắn; đề 18 · 4 · 6 đúng hết = **10.00**.
- Casio 7/7 kỹ thuật; 4 dạng bài có số liệu kiểm chứng: Binomial PD 15/64, "ít nhất 1 con bệnh" 0.68359, bảng tự thụ F10 (Aa 0.000977), cấu trúc P từ F2/F3 (50% AA · 40% Aa · 10% aa), hệ DNA A=600/G=900; dữ liệu vô lý bị chặn.
- UUID ổn định; export → validate → import giữ nguyên UUID; schema sai bị từ chối.
- IndexedDB: ghi lịch sử, giải phóng localStorage (`0 KB`).
- Đấu offline bus: host nhận `hello` từ guest.
- Admin: PBKDF2 verifier, giải mã khoá ECDSA, ký + verify, đăng nhập.
- Responsive: 390×844 / 820×1180 / 1366×768 / 1920×1080, không tràn ngang.
- Flashcard: 452 thẻ, lật thẻ, khoá nút chấm trước khi lật, ghi SRS vào IndexedDB.
- Gia sư: cảnh báo thiếu dữ liệu < 20 câu; phát hiện đúng chuyên đề yếu, kế hoạch và mục tiêu.
- Sơ đồ: đặt đúng 7/7 → điểm tối đa; đặt sai 1 nhãn → đánh dấu đỏ + báo lỗi; nút Làm lại xoá sạch.
- PWA: Service Worker đăng ký qua HTTP, manifest + icon tải đúng.
- Admin: nút âm thanh và đăng xuất **không còn chồng nhau** ở cả desktop và phone.
- Dữ liệu: 356 MCQ (phân bố đáp án 93/94/82/87), 56 cụm Đ-S (đủ 4 ý, có giải thích), 73 câu ngắn (đủ chuyên đề), 23 khung lý thuyết — **0 bản ghi lỗi**.
- Vòng đời bài thi: rời tab → `timerId = null`, phòng thi đóng.
- Backup: `validate(null)` và JSON thiếu `data` trả lỗi thay vì ném exception.
- Admin: đổi mật khẩu từ khoá chủ (chưa thiết lập) hoạt động; đăng nhập bằng mật khẩu mới OK.
- v5.6: 10 chủ đề / 104 câu lớp 11; cấu hình mạng/tim/grace; mini-game khủng long (nhảy, mất mạng, chơi lại, tự dừng); mô phỏng 2 người — người nộp sớm vào màn chờ, người còn lại làm tiếp và **được 3.33 điểm cho 1 câu làm đúng** thay vì 0; review có "Vì sao"; xác nhận thoát phòng; 4 viewport không tràn.
- v5.7: 13 kỹ thuật Casio (cheat-sheet), 6 máy tính nâng cao đúng số liệu, giả lập 30 phím dựng được
  chuỗi bước và in màn hình; bản đồ 3 điểm 6,42/13,19 cM; không tràn ngang ở 4 kích thước.
- v5.8: 23/23 lab vẽ được sau khi thêm lớp khí quyển (đo pixel: không canvas nào trắng); màu nhận diện
  lan tới readout; tilt 3D trả `--tilt-x/--tilt-y`; game: nhảy đôi, nhặt 🧬 +6, mất mạng → hết mạng → chơi lại;
  gợn sóng tạo và tự xoá sau 0.54s; thanh cuộn `scaleX` đúng; ghi `store` → reload → dữ liệu và UUID còn nguyên.
- Tải sạch 3 tệp (sinh/admin/index): **0 lỗi runtime**.

### Cách tự kiểm tra nhanh sau khi sửa

Bản này **không kèm thư mục test**. Muốn kiểm tra lại, mở `sinh.html` qua HTTP rồi:
1. **Console**: phải trắng, không lỗi đỏ.
2. **Đề 18·4·6**: làm đúng hết → 10.00; làm sai → xem lại có "Vì sao".
3. **Lab**: kéo thanh trượt, chạm canvas, đổi thí nghiệm — không giật, không trắng canvas.
4. **Casio**: bấm "Tính" ở 6 máy tính nâng cao, đối chiếu số với máy thật.
5. **Đấu online**: mở 2 tab, tạo phòng, nộp sớm ở tab A → tab B vẫn làm tiếp.
6. **Sao lưu**: Xuất JSON → Nhập lại → UUID và lịch sử không đổi.

---

## 9. Giới hạn & lộ trình

| Hạng mục | Trạng thái |
|---|---|
| Hồ sơ UUID, sao lưu/khôi phục JSON | ✅ Đã có |
| PWA (manifest, SW, icon) | ✅ Đã có (chỉ http/https) |
| Casio 7 kỹ thuật + chuỗi phím theo số liệu | ✅ Đã có (v5.4) |
| Đồng bộ đa thiết bị thật | ⛔ Cần backend |
| Lớp học, giao bài, bảng xếp hạng lớp | ⛔ Cần backend |
| Giải đấu có vòng loại/bán kết/chung kết | ⛔ Cần backend + xác thực lượt thi |
| Question Studio đầy đủ (mọi dạng câu) | ⚠ Mới có ngân hàng + nhập JSON câu tự soạn |
| Flashcard & gia sư theo năng lực | ✅ Đã có (SRS + phân tích dữ liệu thật) |
| Sơ đồ tương tác kéo–thả | ✅ 3 sơ đồ; mở rộng thêm chủ đề là việc tiếp theo |

---

## 10. Ghi công

Nội dung Sinh học biên soạn theo SGK 12 (Kết nối tri thức, Chân trời sáng tạo, Cánh diều) và đề tham khảo 2024–2025. Khi chỉnh sửa câu hỏi, giữ nguyên đáp án đã kiểm chứng và ghi nguồn nếu thêm mới.
