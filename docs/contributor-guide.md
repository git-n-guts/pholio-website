# Contributor Guide — Keystatic CMS

How to create and edit content on Pholio through the CMS admin UI.

---

## Access

1. Go to `https://pholio.co/keystatic/`
2. Log in with your GitHub account (must be added to the Keystatic Cloud team)
3. You'll see 3 collections: **Questions (English)**, **Questions (Vietnamese)**, **Cities**

## Creating a New Question

Every question must exist in **both languages** with the same `canonicalSlug`.

### English

1. Click **Questions (English)** → **Create**
2. Fill required fields:
   - **Title**: phrased as a search question, 10–120 chars
   - **Description**: 120–165 chars, SEO-optimal
   - **Canonical Slug**: kebab-case, shared with VI counterpart (e.g. `must-try-dishes-hoi-an`)
   - **City Slug**: matches city directory (e.g. `hoi-an`)
   - **City Display Name**: human-readable (e.g. `Hoi An`)
   - **Category**: pick from dropdown
   - **Published Date**: set to today
   - **Quick Answer**: 80–400 chars — the AEO-critical field that LLMs cite
   - **Reading Time**: integer, minutes
   - **FAQ**: add at least 3 items (question + answer pairs)
   - **Content**: article body with formatting, links, images
3. Click **Save** — this commits directly to the `main` branch

### Vietnamese

1. Click **Questions (Vietnamese)** → **Create**
2. Use the **same canonicalSlug** as the English version
3. Write in Vietnamese naturally — do not translate from English
4. Use địa danh Vietnamese: "Hội An" not "Hoi An" in VI content
5. Fill all the same fields + Content
6. Click **Save**

## Editing an Existing Question

1. Open the collection → click the entry
2. Edit fields as needed
3. Click **Save** — commits to `main`, triggers Cloudflare Pages rebuild

## Editing a City

1. Click **Cities** → open the city entry
2. Edit fields (name, tagline, description, best season, budget level, etc.)
3. Click **Save**

## Field Reference

| Field | Required | Notes |
|-------|----------|-------|
| Title | Yes | 10–120 chars, question format |
| Description | Yes | 120–165 chars, meta description |
| Canonical Slug | Yes | kebab-case, must match between EN/VI |
| City Slug | Yes | e.g. `hoi-an` |
| City Display Name | Yes | e.g. `Hoi An` (EN) / `Hội An` (VI) |
| Category | Yes | 9 options |
| Published Date | Yes | |
| Updated Date | No | set when making substantive changes |
| Quick Answer | Yes | 80–400 chars, AEO-critical |
| Reading Time | Yes | integer, minutes |
| FAQ | Recommended | min 3 items |
| Keywords | No | SEO keywords |
| Author | No | defaults to "Pholio Editorial" |
| Contributors | No | |
| Draft | No | check to hide from live site |
| Featured | No | check to feature on homepage |
| Hero Image Path | No | |
| Hero Image Alt | No | |
| Content | Yes | article body |

## Writing Guidelines

See [how-to-create-new-article.md](./how-to-create-new-article.md) for detailed writing style rules, AEO checklist, and content structure.

## Important Notes

- **Always create both EN + VI versions** — never publish one without the other
- **Saves commit directly to `main`** — Cloudflare auto-deploys within 1–2 minutes
- **Don't modify `canonicalSlug`** after creation — it's used for URL routing and hreflang
- **Quick Answer is the most important field** — Perplexity and ChatGPT preferentially cite this block