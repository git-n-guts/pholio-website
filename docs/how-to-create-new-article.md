# How to Create a New Article on Pholio

Every article on Pholio is a **bilingual Q&A pair** — one English file + one Vietnamese file, sharing the same `canonicalSlug`. You cannot publish one without the other.

---

## Overview

| Step | Action |
|------|--------|
| 1 | Choose topic + canonicalSlug |
| 2 | Create EN file |
| 3 | Create VI file |
| 4 | Run build to validate |
| 5 | AEO checklist before publishing |

---

## Step 1 — Choose topic and canonicalSlug

The `canonicalSlug` is the shared identifier between EN and VI versions. It must be:
- **kebab-case only** — `a-z`, `0-9`, hyphens (`-`)
- **Unique** — check no file with this slug exists yet:

```bash
ls src/content/questions/en/
ls src/content/questions/vi/
```

**Good slugs:** `best-coffee-hanoi`, `visa-on-arrival-vietnam`, `hoi-an-day-trip-from-da-nang`

**Bad slugs:** `Best Coffee`, `visa_vietnam`, `café-hanoi` (special chars)

---

## Step 2 — Create the English file

**File path:** `src/content/questions/en/{canonicalSlug}.md`

### Full frontmatter template

```yaml
---
title: "Question phrased as a user would actually search it?"
description: "120–165 chars. Includes primary keyword. Reads like a meta description — complete sentence."
canonicalSlug: "your-slug-here"

city: "hoi-an"           # kebab-case city slug (must already exist)
cityDisplay: "Hoi An"    # display name for UI
category: "food"         # see allowed values below

pubDate: 2026-04-23
updatedDate: 2026-04-23  # optional — update on substantive edits, not typo fixes

quickAnswer: "2–4 sentences that directly answer the title. No fluff. This is what LLMs cite. Min 80 chars, max 400 chars."

readingTime: 5           # integer, minutes — must be accurate to ±1 min

faq:
  - q: "Follow-up question a reader would ask?"
    a: "Direct answer. Specific facts preferred."
  - q: "Another question?"
    a: "Another answer."
  - q: "Third question?"
    a: "Third answer."
  # minimum 3 items required

keywords:
  - "primary keyword"
  - "secondary keyword"
  - "how people actually search this"

author: "Pholio Editorial"        # default — change only if named author
contributors: []                   # optional list of contributors
draft: false                       # NEVER commit draft: true to main
featured: false                    # true = appears in featured sections
---
```

### Allowed `category` values

`food` · `transport` · `culture` · `weather` · `budget` · `safety` · `planning` · `activities` · `accommodation`

### Frontmatter validation rules (enforced by Zod)

| Field | Rule |
|-------|------|
| `title` | 10–120 chars |
| `description` | 120–165 chars |
| `canonicalSlug` | kebab-case only, regex `^[a-z0-9-]+$` |
| `quickAnswer` | 80–400 chars |
| `readingTime` | positive integer |
| `faq` | array of `{q, a}` objects |

### Writing rules for the body

1. **First paragraph** must expand on `quickAnswer` — not restate it word for word
2. **H2 headings** phrased as questions or answer statements when possible
3. **At least 3 internal links** to related questions or city pages
4. **One H1 only** — auto-generated from `title`, never add `#` in body
5. **Heading order**: H2 → H3, never skip levels

### English writing style

- Direct, editorial, confident. Think Craig Mod + Paul Graham.
- Use specific facts: exact addresses, current prices in VND, bus schedules.
- **Banned words:** "discover", "explore", "unforgettable", "hidden gem", "must-see"

---

## Step 3 — Create the Vietnamese file

**File path:** `src/content/questions/vi/{canonicalSlug}.md`

The `canonicalSlug` must be **identical** to the EN file. Everything else is independently written — not translated.

### Key differences in the VI frontmatter

```yaml
title: "Câu hỏi viết tự nhiên bằng tiếng Việt?"
description: "120–165 ký tự. Tự nhiên, không dịch từ tiếng Anh."
canonicalSlug: "your-slug-here"   # SAME as EN

cityDisplay: "Hội An"             # dùng địa danh tiếng Việt có dấu

quickAnswer: "Câu trả lời thẳng vào vấn đề. Không vòng vo."

keywords:
  - "từ khóa tiếng Việt"
  - "cách người Việt thực sự tìm kiếm"
```

### Vietnamese writing style

- Viết như người bản ngữ, **không phải dịch từ tiếng Anh**
- Dùng địa danh có dấu: "Hội An", "Hà Nội", "Đà Nẵng" — không phải "Hoi An", "Ha Noi"
- Tránh cảm giác máy dịch — đọc thử to trước khi commit

---

## Step 4 — Build and validate

```bash
npm run build
```

Build sẽ fail nếu:
- Frontmatter không pass Zod schema → fix frontmatter, không loosen schema
- `canonicalSlug` không match giữa EN và VI
- City slug không tồn tại

Build pass = cả hai file hợp lệ và hreflang sẽ được generate đúng.

---

## Step 5 — AEO checklist trước khi publish

Sau khi deploy lên Cloudflare Pages:

- [ ] **Rich Results Test** — Article + FAQPage schema detected
- [ ] **Schema.org validator** — no errors  
- [ ] **View page source** — JSON-LD blocks present
- [ ] **hreflang** — `link rel="alternate"` có cho cả EN và VI
- [ ] **Perplexity test** — hỏi câu hỏi khớp với title, check trong vòng 1 tuần

---

## Quick reference — file naming

| Language | Path |
|----------|------|
| English | `src/content/questions/en/{canonicalSlug}.md` |
| Vietnamese | `src/content/questions/vi/{canonicalSlug}.md` |

Cả hai file phải được tạo cùng lúc — không publish một mình.

---

## Example

Xem file mẫu đầy đủ tại:
- `src/content/questions/en/must-try-dishes-hoi-an.md`
- `src/content/questions/vi/must-try-dishes-hoi-an.md`
