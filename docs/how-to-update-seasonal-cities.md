# How to Update the Seasonal City Section

Section **§ 02** trên homepage hiển thị các thành phố phù hợp với mùa du lịch hiện tại. Tất cả logic nằm trong một file duy nhất — không cần chỉnh code template.

---

## Tần suất cập nhật

Cập nhật **mỗi quý** (khoảng 4 lần/năm) hoặc khi có sự kiện mùa đáng chú ý:

| Mùa | Tháng | Các thành phố nên highlight |
|-----|-------|-----------------------------|
| Đông Bắc khô | Nov — Jan | Hà Nội, Hội An, Sài Gòn, Mũi Né |
| Tết & Xuân | Feb — Apr | Hội An, Hà Nội, Huế, Đà Lạt |
| Biển miền Trung | May — Aug | Nha Trang, Đà Nẵng, Phú Quốc |
| Mùa thu cao nguyên | Sep — Oct | Đà Lạt, Buôn Ma Thuột, Sapa |

---

## File cần chỉnh

```
src/data/seasonal-cities.ts
```

Chỉ file này. Không chỉnh gì khác.

---

## Cách cập nhật

### Bước 1 — Mở file

```
src/data/seasonal-cities.ts
```

File trông như sau:

```typescript
export const currentSeason: SeasonConfig = {
  label: {
    en: 'May — August',
    vi: 'Tháng 5 — 8',
  },
  cities: [
    // In-season first
    { slug: 'nha-trang',     inSeason: true  },
    { slug: 'hoi-an',        inSeason: true  },
    // Not peak season
    { slug: 'hanoi',         inSeason: false },
    { slug: 'saigon',        inSeason: false },
    { slug: 'buon-me-thuot', inSeason: false },
  ],
};
```

### Bước 2 — Đổi `label`

```typescript
label: {
  en: 'September — November',   // ← đổi thành mùa mới
  vi: 'Tháng 9 — 11',           // ← bản VI tương ứng
},
```

Format chuẩn: `Month — Month` (EN) và `Tháng X — X` (VI).

### Bước 3 — Cập nhật `inSeason` flags

Đổi `true`/`false` theo mùa mới. Dùng field `bestSeason` trong từng city file để tham chiếu:

```
src/content/cities/hanoi.md        → bestSeason: "October to April"
src/content/cities/saigon.md       → bestSeason: "December to April"
src/content/cities/hoi-an.md       → bestSeason: "Feb — May"
src/content/cities/nha-trang.md    → bestSeason: "February to August"
src/content/cities/buon-me-thuot.md → bestSeason: "November to April"
```

### Bước 4 — Sắp xếp lại thứ tự array

**In-season cities phải đứng đầu array** — homepage render theo thứ tự của array, không sort tự động.

```typescript
cities: [
  // In-season đứng trước
  { slug: 'hanoi',         inSeason: true  },
  { slug: 'hoi-an',        inSeason: true  },
  // Còn lại đứng sau
  { slug: 'nha-trang',     inSeason: false },
  { slug: 'saigon',        inSeason: false },
  { slug: 'buon-me-thuot', inSeason: false },
],
```

### Bước 5 — Commit và push

```bash
git add src/data/seasonal-cities.ts
git commit -m "chore(homepage): update seasonal cities to Sep–Nov"
git push
```

Cloudflare Pages tự động deploy sau vài phút.

---

## Thêm city mới vào danh sách

Khi có thêm city file mới trong `src/content/cities/`, thêm vào array:

```typescript
{ slug: 'da-lat', inSeason: true },
```

Slug phải **khớp chính xác** với tên file trong `src/content/cities/` (không có `.md`).

Ví dụ: file `src/content/cities/da-lat.md` → slug `da-lat`.

---

## Kiểm tra trước khi push

```bash
npm run build
```

Build thành công = không có lỗi. Xem kết quả tại `dist/index.html` — tìm class `season-badge` để verify badge hiển thị đúng thành phố.

---

## Ghi chú

- Homepage EN (`/`) và VI (`/vi/`) dùng chung một config — không cần cập nhật hai nơi.
- Badge hiển thị: `Peak season` (EN) / `Đúng mùa` (VI) — không cần chỉnh.
- Nếu chưa chắc city nào in-season, xem field `bestSeason` trong city file và so với tháng hiện tại.
