# How to Create a New City on Pholio

City là **một file markdown duy nhất** — khác với questions (phải có cả EN + VI). Cả trang EN `/cities/{slug}/` và VI `/vi/cities/{slug}/` đều kéo dữ liệu từ cùng một file.

---

## Overview

| Step | Action |
|------|--------|
| 1 | Chọn city slug |
| 2 | Tạo file city |
| 3 | Tạo ít nhất 1 question gắn với city đó |
| 4 | Run build để validate |

---

## Step 1 — Chọn city slug

Slug = tên file = city identifier dùng trong **tất cả** questions thuộc city này.

**Quy tắc:**
- Kebab-case, chỉ `a-z`, `0-9`, dấu gạch ngang
- Dùng tên tiếng Anh không dấu (vì slug dùng trong URL)
- Phải nhất quán — sau khi có questions gắn vào, **không đổi slug được** mà không update toàn bộ questions đó

**Ví dụ đúng:** `hanoi`, `da-nang`, `ho-chi-minh-city`, `nha-trang`, `phu-quoc`

---

## Step 2 — Tạo file city

**File path:** `src/content/cities/{slug}.md`

### Full template

```yaml
---
name: "Hà Nội"
region: "North · Capital"
tagline: "Câu mô tả ngắn 1 dòng — bản chất của thành phố."
description: "2–4 câu mô tả đầy đủ hơn. Dùng trên city listing page và SEO."
bestSeason: "Oct — Dec"
daysRecommended: "3 — 5 days"
budgetLevel: "mid-range"
featured: false
---

Đoạn body tùy chọn — mô tả thêm về city. Hiển thị trên trang city detail.
```

### Field reference

| Field | Type | Required | Ghi chú |
|-------|------|----------|---------|
| `name` | string | ✅ | Tên hiển thị — dùng dấu tiếng Việt đầy đủ |
| `region` | string | ✅ | Format: `"North · Capital"`, `"Central · Coast"`, `"South · Mekong"` |
| `tagline` | string | ✅ | 1 câu ngắn — bản chất của city |
| `description` | string | ✅ | 2–4 câu — dùng cho SEO và listing |
| `bestSeason` | string | — | Format: `"Feb — May"` |
| `daysRecommended` | string | — | Format: `"2 — 4 days"` |
| `budgetLevel` | enum | — | `budget` · `mid-range` · `premium` |
| `featured` | boolean | — | Default `false` — `true` = xuất hiện ở featured sections |
| `heroImage` | string | — | Path đến hero image (nếu có) |

> **Lưu ý:** Field `slug` **không** cần khai báo trong frontmatter — Astro tự lấy từ tên file.

---

## Step 3 — Tạo ít nhất 1 question gắn với city

City page sẽ trống nếu không có question nào. Khi tạo question, set:

```yaml
city: "your-city-slug"   # phải khớp chính xác với tên file city
cityDisplay: "Tên City"  # tên hiển thị
```

Tham khảo `docs/how-to-create-new-article.md` để tạo question đầy đủ.

---

## Step 4 — Build và validate

```bash
npm run build
```

Sau khi build pass, kiểm tra:
- `http://localhost:4321/cities/{slug}/` → EN page render đúng
- `http://localhost:4321/vi/cities/{slug}/` → VI page render đúng, labels dịch sang tiếng Việt
- Questions của city xuất hiện đúng trong listing

---

## Cách EN và VI city page hoạt động

City **không có file VI riêng**. Cả hai trang dùng chung `src/content/cities/{slug}.md`:

| | EN page | VI page |
|-|---------|---------|
| URL | `/cities/hoi-an/` | `/vi/cities/hoi-an/` |
| City metadata | `hoi-an.md` | `hoi-an.md` (same file) |
| Category labels | Food, Transport... | Ẩm thực, Di chuyển... |
| Questions hiển thị | `en/` questions | `vi/` questions |

Nếu muốn city name tiếng Việt (ví dụ "Hội An" thay vì "Hoi An") — dùng field `name` trong file city. Hiện tại chỉ có 1 `name` field nên nên để tên có dấu tiếng Việt là hợp lý nhất.

---

## Example

Xem file mẫu tại: `src/content/cities/hoi-an.md`
