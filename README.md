# BioGalaxy — Sinh học 12

Ứng dụng học tập Sinh học 12 chạy hoàn toàn trên trình duyệt (GitHub Pages), gồm **ứng dụng học sinh** (`sinh.html`), **bảng quản trị** (`admin.html`), **cổng vào** (`index.html`) và công cụ build icon (`_ins_sprite.js`).

Phiên bản tài liệu: **v5.14** · Năm học: **2026–2027**.

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

## 3i. v5.14 — Nến học tập + mini nến toàn trang + 3D lung linh hơn

### 1. Nến học tập
- Tab **Nến** trên dock: chọn 15/25/45/60/90 phút hoặc kéo 5–120 phút, bấm **Bắt đầu đốt nến**.
- Nến cháy từ từ: sáp thấp dần, lửa rung, sáp chảy, tàn lửa + khói khi hết.
- **Không hiện đồng hồ** trong lúc cháy — chỉ có trạng thái “Nến đang cháy”; người học không bị ám ảnh thời gian.
- Tạm dừng / tiếp tục / tắt nến; khi nến tàn có tóm tắt phiên và nút đốt cây mới.
- Mỗi phút cháy được ghi vào chuỗi ngày; hết nến thưởng XP.

### 2. Mini nến trên mọi trang
- Sau khi bắt đầu, một **mini nến** xuất hiện ở góc trái trên mọi tab (Lý thuyết, Lab, Ngân hàng, Lộ trình…), chỉ có lửa + mức sáp, **không có số thời gian**.
- Bấm mini nến để quay lại tab Nến.
- Trạng thái: đang cháy / tạm dừng / đã tàn; reload vẫn tiếp tục đúng thời điểm (lưu `endAt`).

### 3. 3D lung linh hơn
- **Scanline hologram** chạy chậm trên khung 3D.
- **Bokeh** lớn mờ + bụi sáng tạo chiều sâu.
- **Quầng sáng cộng thêm** (additive glow) cho helicase, locus gen, chiasma, mặt trời.
- Vẫn giữ 23/23 cảnh động, tour 3D, nhãn bộ phận.

### 4. Sửa lỗi
- **Dock 11 tab bị tràn 264px trên phone** → icon-only trên phone, có tooltip; desktop vẫn đủ nhãn.
- Nến không hiện số thời gian; mini nến dời sang trái để không bị toast che.
- Dừng vòng RAF khi nến tắt và mini đã ẩn (không tốn CPU).

### 5. Kiểm chứng
- 11 view + 23 lab + đề + 5 modal: 0 exception.
- Nến: start → mini trên tab khác → pause → stop → finish; reload vẫn chạy tiếp; không có `\d+:\d+` trong trạng thái.
- 4 viewport: dock 11 tab không tràn; nến vừa màn hình.
- `sinh.html` 1655 KB (gzip **460 KB**).

## 3h. v5.13 — Sửa hoạt ảnh, 3D sống động, hiểu sâu, hiệu ứng giao diện

### 1. Sửa lỗi hoạt ảnh thật
- **Vẽ trùng 2D + 3D**: mỗi khung hình trước đây vừa vẽ canvas 2D (đang ẩn) vừa vẽ WebGL → tốn gấp đôi, 3D giật. Giờ khi 3D bật, chỉ vẽ WebGL.
- **Nghiêng khung tranh chồng lên kéo xoay 3D**: `bg4Tilt` vẫn xoay cả `.labstage` khi đang orbit → mô hình và nhãn bị lắc. Giờ tắt tilt khi `gl-on`.
- **Vòng accent bị dựng đứng** thành “vòm xanh” sau bàn Punnett → sửa nằm phẳng trên sàn.
- **Bản đồ khái niệm bị cắt** trong modal Hiểu sâu → bước 2 cột + viewBox gọn.
- **Mini heatmap quá to** ở Lộ trình → giới hạn 320px.
- **Ánh xạ chuyên đề** của “Kiểm tra nhanh” sai với “Dịch mã” → ưu tiên nhóm ADN→protein trước.

### 2. 3D sống động hơn
- **Chuyển cảnh có zoom-in** + **tiêu đề cảnh** hiện rồi tan.
- **Bụi sáng** bay lơ lửng + **vòng accent** trên sàn cho mọi cảnh.
- **23/23 cảnh có chuyển động**: thêm `bob` (nhấp nhô), `pulse` (phồng nhẹ), `spin` (xoay chậm) cho vật thể; 7 cảnh trước đây đứng yên nay có nhịp: C3/C4 có CO₂ bay, nguyên phân tách NST nhanh hơn, giảm phân có bụi và chiasma phát sáng, Punnett có ô nhấp nhô + hạt gen nhún, X/Y có locus phát sáng, Biston có bướm lượn + phấn hoa, cây phát sinh có loài nhún + phấn hoa.
- **Tour 3D**: nút tự chuyển 23 cảnh mỗi 4,2 giây, dừng khi bấm lại hoặc rời tab Lab.

### 3. Hiểu sâu 7 chuyên đề
- Modal mới: **câu chuyện đời thường → cơ chế 4 bước → 3 chỗ hay nhầm → 3 câu tự kiểm tra → sơ đồ khái niệm SVG**.
- 7 chuyên đề: ADN→protein, NST & phân bào, di truyền & xác suất, thực vật, động vật & nội môi, tiến hoá & quần thể, tế bào.
- Nút **“Luyện 5 câu chủ đề này”** phát đề đúng chuyên đề.
- Mỗi thẻ lý thuyết có **“Kiểm tra nhanh 3 câu”** (đề 3 MCQ đúng chuyên đề) và **“Hiểu sâu”**.
- Lộ trình có thêm **thẻ chuỗi ngày** + mini heatmap 14 ngày.

### 4. Hiệu ứng giao diện
- **Chuyển cảnh mượt** khi đổi tab.
- **Gợn sóng (ripple)** khi bấm nút/chip.
- **Confetti** khi điểm ≥ 9 hoặc đạt mốc chuỗi 3/7/14/30 ngày.
- **Modal mở bằng scale/fade**, **card nhấc nhẹ khi hover**.
- Tôn trọng `prefers-reduced-motion` và công tắc hiệu ứng `data-fx="off"`.

### 5. Kiểm chứng
- 23/23 cảnh có vật thể chuyển động (kể cả 7 cảnh từng đứng yên); tour đổi cảnh sau 4,2s; tiêu đề cảnh hiện đúng.
- 10 view + 23 lab + mọi control + đề 18·4·6 + ngân hàng + 5 modal: **0 exception**.
- 4 viewport 390/820/1366/1920: **0 tràn ngang**, modal Hiểu sâu vừa màn hình.
- `sinh.html` 1633 KB (gzip **454 KB**) — tăng do thêm nội dung Hiểu sâu + hiệu ứng.

## 3g. v5.11–v5.12 — Chấm đúng hơn, giải thích toàn bộ, 3D mới, tài khoản + chuỗi + nhắn tin

### 1. Hết "hiểu lầm giả" khi giảng lại (v5.11)
- Bộ chấm tại máy chuyển từ khớp từ khoá thô sang **chấm theo câu**: cắt câu, bỏ dấu tiếng Việt, nhận diện phủ định ("không lấy CO₂ bằng rễ", "không phải…"), chỉ gắn hiểu lầm khi câu **khẳng định sai**.
- Mỗi hiểu lầm có **bằng chứng**: trích đúng câu đã nói; bấm "Không phải lỗi của tôi" để đưa vào danh sách miễn trừ (`tutor_allow`) và không bị trừ điểm lần sau.
- Có hiểu lầm → điểm bị chặn (1 lỗi ≤60%, 2 lỗi ≤45%) dù đủ từ khoá.

### 2. Giải thích cho người chưa biết gì (v5.11)
- **"Giải thích siêu dễ"** gắn vào **mọi dạng câu**: MCQ, Đúng/Sai, trả lời ngắn, câu lớp 11, flashcard, "Câu sai".
- Mỗi câu có 6 lớp: *Đề hỏi gì → Nói thật chậm → Giống như thế này → Vì sao đáp án đúng → Vì sao 3 phương án kia sai → Mẹo làm nhanh*, kèm "Chỉ cần nhớ".
- Không chèn trùng, không lộ giải thích khi đang thi.

### 3. Học thông minh hơn (v5.11)
- **Bản đồ thành thạo** theo 7 chuyên đề, **điểm mục tiêu** (thang 10), **kế hoạch 7 ngày**, **luyện trộn nhiều chuyên đề**.
- Gia sư AI giữ nguyên: giảng lại, phát hiện chỗ vấp ≥2 lần, kế hoạch 4 bước.

### 4. 3D mới — nhìn ra được (v5.12)
- **Engine viết lại**: 2 nguồn sáng + ambient trời + specular + fresnel + sương mờ; **bóng đổ mềm** dưới vật; nền gradient + vignette.
- **Kéo để xoay, lăn chuột để zoom**, tự xoay khi rảnh, nhấp đúp để về góc mặc định.
- **Nhãn tên bộ phận** dán theo vật thể 3D (Lá, Khí khổng, Phổi, Phế nang, Helicase, Tâm động…), có màu theo nhóm.
- **23 cảnh dựng lại** đúng hình dạng: phòng ngủ có giường–người–cây–cửa sổ–trăng; kinesin bước trên vi ống; nơron có bao myelin; lá C3/C4; catalase + bọt O₂; tế bào thẩm thấu; tụy–gan–mạch máu; khí khổng hai tế bào hạt đậu; nấm men + bóng CO₂; cây + mặt trời + O₂/CO₂; nguyên phân có thoi; giảm phân có chiasma; chạc tái bản chữ Y; phiên mã/dịch mã có ribosome + chuỗi axit amin; 3 dạng đột biến; phổi + khí quản + cơ hoành + phế nang; thận + nephron; bảng Punnett 3D; X/Y; NST + histone; bướm Biston; Hardy–Weinberg; cây phát sinh chủng loại.
- Lite vẫn 2D như cũ; máy không WebGL tự lui 2D.

### 5. Tài khoản trên máy (v5.12)
- Nhiều người dùng chung một máy, mỗi người một hồ sơ: tên, avatar, PIN tuỳ chọn.
- **Dữ liệu tách riêng thật**: khi tạo/chuyển, ứng dụng lưu **snapshot toàn bộ khoá** (cả localStorage lẫn IndexedDB) rồi nạp lại hồ sơ đích; không lẫn lịch sử/tiến độ giữa các tài khoản.
- **PIN chỉ là khoá mềm**, không mã hoá dữ liệu; ai dùng chung máy vẫn mở được file lưu. Muốn bảo mật thật cần máy chủ.

### 6. Chuỗi ngày học (v5.12)
- Chip 🔥 trên thanh trên; bấm mở **heatmap 35 ngày**, chuỗi hiện tại, kỷ lục, số câu/phút/XP hôm nay.
- Ghi nhận khi làm bài, luyện tập, dùng lab/lý thuyết hoặc giảng lại; không có dữ liệu thì không bịa.

### 7. Nhắn tin + chuỗi tin nhắn (v5.12)
- Tab **💬 Nhắn tin** trong Trung tâm kết nối, dùng đúng kênh đã ghép đôi (WebRTC hoặc 2 tab cùng máy).
- Mỗi cặp có **chuỗi ngày nhắn tin**: chỉ tăng khi **cả hai bên** gửi ít nhất 1 tin trong ngày; lưu trên máy, không có máy chủ.
- Chỉ gửi được khi cả hai đang mở app; đóng app là không gửi.

## 3f. v5.10 — Gia sư AI · Giảng lại với máy

Vào **Lý thuyết / Phòng thi / Lộ trình → Gia sư AI**, hoặc trong phần **Câu sai** sau khi thi.

| Tab | Việc gì xảy ra |
|---|---|
| 🗣️ **Mình giảng lại** | Chọn 1 trong **9 chuyên đề** rồi viết (hoặc bấm micro để nói) lời giải thích của riêng bạn. Máy đối chiếu với **rubric các ý cốt lõi**, tìm **ý còn thiếu** và **hiểu lầm cụ thể**, chấm 0–100% kèm lời khen / lời khuyên. Có hiểu lầm thì điểm bị **chặn dưới 60%** dù có đủ từ khoá — không cho điểm ảo. |
| 📖 **Máy giảng lại** | Giảng lại từ số 0: *nói thật chậm → ví dụ đời thường → ví dụ cụ thể → câu nhớ*, kèm danh sách ý bắt buộc và hiểu lầm hay gặp. |
| 🎯 **Kế hoạch tự học** | Gộp **bài giảng lại + tỉ lệ đúng theo chuyên đề + lịch sử làm bài**. Chỗ nào **lặp ≥ 2 lần** được đẩy lên đầu; mỗi chỗ yếu có 4 bước 15–30 phút: đọc 3 khung → luyện 8 câu đúng chuyên đề → flashcard ôn ngắt quãng → giảng lại kiểm tra. **Không có dữ liệu thì nói "chưa đủ", không bịa nhận xét.** |
| ⚙️ **Kết nối AI** | Tuỳ chọn endpoint tương thích OpenAI + model + **key của riêng bạn** (lưu trên thiết bị, không có trong mã nguồn). Có nút thử kết nối và xoá key. |

**Trung thực về AI:** bản tĩnh **không có LLM nhúng sẵn**. Mặc định chạy **bộ chấm tại máy** (offline, không gửi gì ra ngoài): khớp từ khoá đã bỏ dấu, đo độ rõ của câu, trừ điểm theo hiểu lầm. Chỉ khi bạn tự điền key và endpoint thì mới gọi AI thật; nếu lỗi/CORS/hết giờ (14s) → **tự lui về chấm tại máy và báo rõ lý do**. Không dùng `service_role key` hay khoá máy chủ, không gửi dữ liệu tới server nào mặc định.

**Lưu ý an toàn:** không dán key thật vào file public / GitHub Pages dùng chung; nhiều provider chặn gọi từ trình duyệt.

## 3e. v5.9 — 3 tính năng "cần backend" làm không cần server, lab WebGL, giải thích siêu dễ

### 1. Trung tâm kết nối (`HUB`) — **không tạo thư mục, không dùng backend**

Vào **Phòng thi → Trung tâm kết nối**. Ba tab:

| Tab | Cách làm | Dữ liệu nằm ở đâu |
|---|---|---|
| 🔄 **Đồng bộ** | Máy A tạo **mã mời** → máy B dán → máy B gửi lại **mã đáp** → A dán. Hai máy bắt tay **WebRTC DataChannel** trực tiếp (STUN công khai), không đi qua server của ai. Có kênh **2 tab cùng máy** qua `BroadcastChannel` để thử offline. | localStorage + IndexedDB trên **từng máy**; xung đột giải theo **thời gian mới hơn** cho từng mục |
| 🏫 **Lớp học** | GV tạo lớp (tên + mã), giao đề theo 3 mẫu, đặt hạn. HS vào bằng mã, làm bài, gửi kết quả. GV xem **điểm TB, điểm cao nhất, tỉ lệ hoàn thành, chuyên đề lớp yếu** và bảng xếp hạng. HS chỉ thấy điểm của mình. | Bản ghi lớp lưu trên **máy chủ phòng** |
| 🏆 **Giải đấu** | 4–16 thí sinh → **Vòng loại → Bán kết → Chung kết**. Mỗi vòng có **seed** (tái tạo đúng đề), đồng hồ đếm ngược, điểm trực tiếp, xếp hạng, xử lý mất kết nối, ghi điểm tay (✎), **tái đấu**. | Bảng đấu lưu trên máy chủ phòng |

**Giới hạn trung thực (đọc kỹ):** không có máy chủ nên (1) chỉ đồng bộ khi **cả hai máy đang mở app và còn nối**; (2) không có tài khoản đám mây, không tự đồng bộ khi tắt máy; (3) **điểm do máy thí sinh gửi về chủ phòng** nên không chống được gian lận có chủ đích — muốn chống thật vẫn phải có backend xác thực lượt thi. Ứng dụng ghi rõ điều này ngay trong giao diện, không giả vờ là server.

### 2. Phân tầng đồ họa cho 23 thí nghiệm

| Mức | Cách vẽ |
|---|---|
| **Lite** | Giữ **nguyên canvas 2D như cũ**, nhưng làm đẹp nút/seg/slider/thẻ số đo bằng gradient + viền (không dùng blur/shadow). Thêm **huy hiệu minh hoạ nhận diện**: cây cam có quả cam, người có đầu/mình/tay/chân, ADN, tế bào, khí khổng, enzyme, phổi, bướm… |
| **Cân bằng / Đầy đủ** | **Vẽ lại từng thí nghiệm bằng WebGL thuần** (không CDN, không file mới): 23 cảnh 3D riêng — cây quang hợp, nơron, chạc tái bản, khí khổng, phổi, thận, bảng Punnett 3D, bướm Biston, cây phát sinh chủng loại… Có đổ bóng Lambert + specular + rim light, sàn, biểu đồ cột 3D **ăn theo thanh trượt**, camera trôi chậm. |

- Nút **Xem 2D / Xem 3D** cho phép đổi tay bất kỳ lúc nào; Lite luôn 2D.
- Máy không có WebGL → **tự lui về 2D**, có thông báo rõ ràng (không mất thí nghiệm).
- Engine: shader tự viết, mesh cầu/trụ/nón/hộp tự sinh, ma trận `perspective / lookAt / TRS`, gradient cache, DPR cap 1.5 (phone) / 2 (desktop).

### 3. Kiến thức & lời giải cho người chưa biết gì

- **Giải thích siêu dễ** (bật mặc định, tắt được ở Cài đặt): mỗi lời giải có 6 lớp — *Đề đang hỏi gì → Nói thật chậm → Giống như thế này → Vì sao đáp án này đúng → Vì sao 3 phương án kia sai → Mẹo làm nhanh*, kèm **Chỉ cần nhớ** và **50 thuật ngữ** có chú giải khi đưa chuột vào. Áp dụng cho ngân hàng, xem lại bài và "Câu sai".
- **Học từ số 0**: 6 bài nền (ADN→protein, NST & chia tế bào, di truyền, thực vật, động vật, tiến hóa) theo đúng cấu trúc *NÓI THẬT CHẬM / GIỐNG NHƯ / CHỈ CẦN NHỚ* + câu tự kiểm tra có đáp án ngay.
- **Soát dữ liệu**: 356 MCQ (đáp án 93/94/82/87), 56 cụm Đ-S, 73 câu ngắn — **0 câu thiếu lời giải, 0 trùng phương án, 0 đáp án sai chỉ số, 0 câu ngắn thiếu chuyên đề**.

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
- v5.14: 11 view + 23 lab + đề + 5 modal: 0 exception; nến chạy tiếp sau reload; mini nến hiện trên tab khác; dock 11 tab không tràn ở 390/820/1366/1920; 0 tràn ngang.
- v5.13: 23/23 cảnh có chuyển động (bob/pulse/spin + hạt); tour 3D; 7 chuyên đề Hiểu sâu có sơ đồ; quick quiz 3 câu đúng chuyên đề; 0 exception; 4 viewport 0 tràn.
- v5.12: 23/23 cảnh 3D dựng được (≥8 vật, ≥2 nhãn, 0 lỗi WebGL); xoay/zoom đổi góc; tài khoản A→B→A tách sạch cả khoá lớn trong IndexedDB (A='x', B='y'); sai PIN không vào được; chuỗi 35 ô; chat 2 tab gửi/nhận và chuỗi 1 ngày; 4 viewport 0 tràn; 0 exception.
- v5.10: 9/9 chuyên đề giảng lại; bài tốt 98%, bài có 2 hiểu lầm bị chặn 45% và phát hiện "hay vấp"; kế hoạch 4 bước; AI mock trả đúng `mode=ai` + 72%; luyện 8 câu **đúng chuyên đề**; flashcard/điểm/lịch sử/UUID giữ nguyên sau reload.
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
| Đồng bộ đa thiết bị thật | ✅ v5.9 — WebRTC DataChannel ghép đôi bằng mã (không server) |
| Tài khoản nhiều người trên cùng máy | ✅ v5.12 — hồ sơ cục bộ, dữ liệu tách riêng (kể cả IndexedDB); PIN là khoá mềm |
| Chuỗi ngày học | ✅ v5.12 — heatmap 35 ngày + kỷ lục |
| Nhắn tin + chuỗi tin nhắn | ✅ v5.12 — qua kênh ghép đôi; chỉ khi cả hai đang mở app, không server lưu tin |
| Hiểu sâu 7 chuyên đề + sơ đồ khái niệm | ✅ v5.13 — câu chuyện, cơ chế, bẫy, tự kiểm tra, luyện 5 câu |
| Hoạt ảnh 3D + tour 3D | ✅ v5.13 — 23/23 cảnh động, tiêu đề cảnh, bụi sáng, tour 4,2s |
| Nến học tập + mini nến toàn trang | ✅ v5.14 — cháy theo thời gian, không hiện đồng hồ, lưu qua reload |
| Hiệu ứng 3D nâng cao | ✅ v5.14 — scanline, bokeh, additive glow |
| Lớp học, giao bài, bảng xếp hạng lớp | ✅ v5.9 — chủ phòng quản lý, dữ liệu lưu trên máy GV |
| Giải đấu có vòng loại/bán kết/chung kết | ✅ v5.9 — 3 vòng, seed, đếm ngược, tái đấu (⚠ điểm không được server xác thực) |
| Question Studio đầy đủ (mọi dạng câu) | ⚠ Mới có ngân hàng + nhập JSON câu tự soạn |
| Flashcard & gia sư theo năng lực | ✅ Đã có (SRS + phân tích dữ liệu thật) |
| Sơ đồ tương tác kéo–thả | ✅ 3 sơ đồ; mở rộng thêm chủ đề là việc tiếp theo |

---

## 10. Ghi công

Nội dung Sinh học biên soạn theo SGK 12 (Kết nối tri thức, Chân trời sáng tạo, Cánh diều) và đề tham khảo 2024–2025. Khi chỉnh sửa câu hỏi, giữ nguyên đáp án đã kiểm chứng và ghi nguồn nếu thêm mới.
