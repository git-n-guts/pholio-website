# How to Create a New Article on Pholio

Every article on Pholio is a **bilingual Q&A pair** — one English version + one Vietnamese version, sharing the same `canonicalSlug`. You create both through the CMS admin at [admin.pholio.click](https://admin.pholio.click).

---

## Overview

| Step | Action |
|------|--------|
| 1 | Log in to admin.pholio.click |
| 2 | Choose topic + canonicalSlug |
| 3 | Create the English question |
| 4 | Create the Vietnamese question |
| 5 | Verify deployment + AEO checklist |

---

## Step 1 — Log in to the CMS

1. Go to [admin.pholio.click/keystatic/](https://admin.pholio.click/keystatic/)
2. Authorize with your GitHub account (must have write access to `pholio-website` repo)
3. You'll see two question collections and one cities collection:

| Collection | What it's for |
|------------|---------------|
| **Questions (EN)** | English Q&A articles |
| **Questions (VI)** | Vietnamese Q&A articles |
| **Cities** | City metadata pages |

---

## Step 2 — Choose topic and canonicalSlug

Before creating anything, decide on:

1. **The question** — phrased as a user would actually search it
2. **The `canonicalSlug`** — the shared identifier between EN and VI versions

### canonicalSlug rules

- **kebab-case only** — lowercase `a-z`, digits `0-9`, hyphens `-`
- **No spaces, underscores, or special characters** (no `é`, `à`, etc.)
- **Unique** — must not already exist in either collection

**Good slugs:** `best-coffee-hanoi`, `visa-on-arrival-vietnam`, `hoi-an-day-trip-from-da-nang`

**Bad slugs:** `Best Coffee`, `visa_vietnam`, `café-hanoi`

To check for existing slugs, browse the **Questions (EN)** and **Questions (VI)** dashboards in the CMS — each entry shows its canonicalSlug.

---

## Step 3 — Create the English question

1. In the CMS sidebar, click **Questions (EN)**
2. Click **Create** (top right)
3. Fill in every field (see field guide below)
4. Click **Save** — Keystatic Cloud commits the file to `pholio-website` repo
5. Cloudflare Pages auto-deploys within ~2 minutes

### Field guide — Questions (EN)

| Field | Required | Rules | Tips |
|-------|----------|-------|------|
| **Title** | Yes | 10–120 chars | Phrase as a question people search. "What are the must-try dishes in Hoi An?" not "Hoi An Food Guide" |
| **Description** | Yes | 120–165 chars | Complete sentence with primary keyword. This is the meta description. |
| **Canonical Slug** | Yes | kebab-case, unique | Must be identical in EN and VI versions |
| **City** | Yes | kebab-case city slug | e.g. `hoi-an`, `hanoi`, `nationwide` |
| **City Display** | Yes | Display name | e.g. "Hoi An", "Hanoi" — shown in UI |
| **Category** | Yes | Select from list | `food` · `transport` · `culture` · `weather` · `budget` · `safety` · `planning` · `activities` · `accommodation` |
| **Publication Date** | Yes | YYYY-MM-DD | When the article goes live |
| **Updated Date** | No | YYYY-MM-DD | Update on substantive edits, not typo fixes |
| **Quick Answer** | Yes | 80–400 chars | 2–4 sentences that directly answer the title. **This is what LLMs cite.** No fluff. |
| **Reading Time** | Yes | Integer (minutes) | Must be accurate to within ±1 minute of actual content |
| **FAQ** | Recommended | Min 3 items | Each item has a Question and Answer. Generates FAQPage JSON-LD schema for AEO. |
| **Keywords** | No | Array of strings | How people actually search for this topic |
| **Author** | No | Default: "Pholio Editorial" | Change only for named authors |
| **Contributors** | No | Array of strings | People who helped with research/review |
| **Draft** | No | Default: off | **Never publish with Draft ON** |
| **Featured** | No | Default: off | ON = appears in featured sections on homepage |
| **Hero Image URL** | No | URL string | External image URL for article hero |
| **Hero Image Alt** | No | Text | Alt text for hero image |
| **Content** | Yes | Rich text editor | The main article body (see writing rules below) |

### The Content editor

The **Content** field uses a rich text editor with:
- **Formatting**: bold, italic, strikethrough
- **Headings**: H2, H3 (never use H1 — it's auto-generated from Title)
- **Links**: internal links to other pages, external URLs
- **Images**: inline images
- **Tables**: data tables
- **Dividers**: horizontal rules between sections

### Writing rules for the English body

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

## Step 4 — Create the Vietnamese question

1. In the CMS sidebar, click **Questions (VI)**
2. Click **Create**
3. Fill in every field — **use the same `canonicalSlug`** as the EN version
4. Click **Save**

### Key differences in the Vietnamese fields

| Field | EN version | VI version |
|-------|-----------|------------|
| **Title** | English question | Vietnamese question — written naturally, not translated |
| **Description** | English meta | Vietnamese meta — 120–165 chars, natural Vietnamese |
| **Canonical Slug** | Same | **Must be identical** to EN |
| **City Display** | "Hoi An" | "Hội An" — use Vietnamese diacritics |
| **Quick Answer** | English | Vietnamese — independently written, not translated |
| **Keywords** | English search terms | Vietnamese search terms — how Vietnamese people actually search |
| **Content** | English body | Vietnamese body — independently written |

### Vietnamese writing style

- Viết như người bản ngữ, **không phải dịch từ tiếng Anh**
- Dùng địa danh có dấu: "Hội An", "Hà Nội", "Đà Nẵng" — không phải "Hoi An", "Ha Noi"
- Tránh cảm giác máy dịch — đọc thử to trước khi publish
- Mỗi câu phải tự nhiên — nếu nghe giống Google Translate thì viết lại

---

## Step 5 — Verify deployment and AEO

After saving both EN and VI versions:

1. **Wait ~2 minutes** for Cloudflare Pages to auto-deploy
2. **Check the live pages**: visit `pholio.click/questions/{canonicalSlug}/` and `pholio.click/vi/questions/{canonicalSlug}/`
3. **Run the AEO checklist below**

### AEO validation checklist

- [ ] **Rich Results Test** — paste URL at [search.google.com/test/rich-results](https://search.google.com/test/rich-results) → Article + FAQPage schema detected
- [ ] **Schema.org validator** — paste URL at [validator.schema.org](https://validator.schema.org) → no errors
- [ ] **View page source** — JSON-LD blocks present and valid
- [ ] **hreflang** — `link rel="alternate"` present for both EN and VI
- [ ] **Perplexity test** — ask Perplexity the question that matches the title → check if Pholio appears as cited source within a week

---

## Creating a new City page

1. In the CMS sidebar, click **Cities**
2. Click **Create**
3. Fill in the fields:

| Field | Required | Rules |
|-------|----------|-------|
| **Name** | Yes | City name — this becomes the URL slug (e.g. "Hoi An" → `hoi-an.md`) |
| **Region** | Yes | e.g. "Central · Coast" |
| **Tagline** | Yes | One-sentence summary of the city |
| **Description** | Yes | 2–4 sentences about the city |
| **Best Season** | No | e.g. "Feb — May" |
| **Days Recommended** | No | e.g. "2 — 4 days" |
| **Budget Level** | No | `budget` · `mid-range` · `premium` |
| **Featured** | No | ON = appears in featured sections |
| **Hero Image URL** | No | External image URL |
| **Content** | Yes | Rich text — city overview content |

---

## Common mistakes to avoid

| Mistake | What happens | Fix |
|---------|-------------|-----|
| canonicalSlug differs between EN and VI | hreflang links broken, SEO fragmented | Always use the same slug |
| Quick answer too short (<80 chars) | Build fails (Zod validation) | Write 2–4 substantive sentences |
| Description too short (<120 chars) | Build fails | Must be 120–165 chars |
| Using banned words ("discover", "explore") | Low-quality AEO signal | Replace with specific facts |
| Publishing with Draft = ON | Page not shown to readers | Always turn Draft OFF before saving |
| Skipping FAQ section | No FAQPage schema → weaker AEO | Add at least 3 FAQ items |
| VI content reads like translation | Poor user experience, lower VI SEO | Write originally in Vietnamese |

---

## Example: completed article pair

See the live example:
- EN: `pholio.click/questions/must-try-dishes-hoi-an/`
- VI: `pholio.click/vi/questions/must-try-dishes-hoi-an/`

This article has:
- canonicalSlug: `must-try-dishes-hoi-an` (same in both)
- 4 FAQ items with specific, citeable answers
- Quick answer that directly answers the title
- Internal links to related content
- Category: `food`