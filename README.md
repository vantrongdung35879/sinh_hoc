# BioGalaxy — Sinh học 12

Ứng dụng học tập Sinh học 12 chạy hoàn toàn trên trình duyệt (GitHub Pages), gồm **ứng dụng học sinh** (`sinh.html`), **bảng quản trị** (`admin.html`), **cổng vào** (`index.html`) và công cụ build icon (`_ins_sprite.js`).

Phiên bản tài liệu: **v5.5** · Năm học: **2026–2027**.

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
tests/smoke.py        Kiểm thử khói bằng Chrome DevTools Protocol
backend/              Kiến trúc backend đề xuất (CHƯA cấu hình — xem backend/README.md)
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

## 7. Backend (chưa cấu hình)

Thư mục `backend/` chứa:
- `README.md`: kiến trúc đề xuất (Supabase), mô hình dữ liệu, RLS, Edge Function ký key.
- `supabase-schema.sql`: bảng + chính sách RLS mẫu.
- `config.example.js`: mẫu cấu hình **chỉ chứa placeholder**.

**Không có khoá thật nào trong repo.** Ứng dụng hiện **không** gọi backend; mọi thứ vẫn chạy cục bộ. Khi cấu hình Supabase, chỉ đưa `SUPABASE_URL` + `anon key` vào client; **tuyệt đối không** đưa `service_role` hoặc private key vào HTML/JS.

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
- Tải sạch 3 tệp (sinh/admin/index): **0 lỗi runtime**.

### Chạy lại bộ kiểm thử

```bash
python -m pip install websocket-client
python tests/smoke.py
# hoặc chỉ định Chrome/Edge khác:
python tests/smoke.py --chrome "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
```

`tests/smoke.py` tự mở HTTP server, chạy 6 nhóm kiểm tra (khởi động + PWA, đề 18·4·6, xem lại câu sai, flashcard/gia sư/sơ đồ, admin, 4 kích thước màn hình) và trả mã thoát `0` khi tất cả đạt. Mỗi probe dùng profile Chrome mới và chờ app khởi tạo xong nên kết quả xác định, không phụ thuộc `sleep`.

Chưa có CI sẵn; có thể gắn `python tests/smoke.py` vào GitHub Actions (runner có Chrome) nếu cần.

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
