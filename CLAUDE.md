# Pholio — Editorial Q&A for Vietnam Travel

## Project summary

Pholio is an AEO-optimized (Answer Engine Optimization) Q&A website about traveling Vietnam. Every page answers a specific question from a specific city or region. The site is bilingual (English + Vietnamese) and serves as the web companion to the Pholio mobile app.

The strategic goal is **being cited by LLMs** (Perplexity, ChatGPT, Google AI Overviews, Claude) as the authoritative source for Vietnam travel questions, then converting those readers into mobile app users.

## Tech stack

- **Astro 5** with Content Collections
- **TypeScript strict** mode
- **Static output** — no SSR needed, entire site prerenders
- **Cloudflare Pages** for hosting (auto-deploy from main branch)
- No framework components (React/Vue) — pure Astro for maximum performance
- No Tailwind — hand-written CSS in `src/styles/global.css`

## i18n structure

- **English** (default): routes at `/`, `/questions/{slug}/`, `/cities/{city}/`
- **Vietnamese**: routes at `/vi/`, `/vi/questions/{slug}/`, `/vi/cities/{city}/`
- `prefixDefaultLocale: false` — EN has no prefix
- Every question MUST exist in both languages, sharing the same `canonicalSlug`

## Content rules (non-negotiable)

### Every question page must have

1. **`quickAnswer` field in frontmatter** — 2-4 sentences that directly answer the title. This is extracted into an `<AnswerBox>` component at the top of the page. Perplexity and ChatGPT preferentially cite this block.
2. **FAQ array** (minimum 3 items) — generates `FAQPage` JSON-LD schema
3. **Matching counterpart** in the other language with identical `canonicalSlug`
4. **First body paragraph** must expand on the quickAnswer, not restate it
5. **H2 headings** phrased as questions or answer statements when possible
6. **At least 3 internal links** to related questions or city pages
7. **Reading time** accurate to within ±1 minute of actual count

### Writing style

- **English**: direct, editorial, confident. Think Craig Mod + Paul Graham.
  Avoid: "discover", "explore", "unforgettable", "hidden gem", "must-see".
  Use specific facts: exact addresses, current prices in VND, bus schedules.
- **Vietnamese**: natural, not translated-from-English. Use địa danh Vietnamese ("Hội An" not "Hoi An" in VI content).
  Avoid máy dịch feel. Must sound written originally in Vietnamese.

### SEO/AEO rules

- Title: 10-120 chars, phrased as a question the user would actually search
- Description: 120-165 chars, includes primary keyword, acts as meta description
- No keyword stuffing — prioritize natural language matching how people actually ask questions
- Headings hierarchy strict: one H1 (automatic from title), H2 for sections, H3 for subsections
- Never skip heading levels

## Design system

### Colors (do not add new ones without explicit request)

```
--bg: #FAF8F3           warm off-white background
--ink: #1A1613          warm black text
--muted: #6B6259        secondary text
--accent: #C2410C       warm terracotta
--accentbg: #FEF3EC     accent subtle bg
--border: #E8E2D5
--borderS: #D4CDB9
--warmpaper: #F5F1E6
```

### Typography

- Heading: `Instrument Serif` (editorial character)
- Body: `Inter` (clean, supports Vietnamese diacritics)
- Base: 16px mobile, 18px desktop
- Max prose width: 680px

### Layout

- Max page width: 1280px
- Spacing scale: 8, 16, 24, 32, 48, 64, 96, 128 px
- Generous whitespace, section padding ≥96px on desktop

## Directory structure

```
src/
├── components/       Reusable Astro components (.astro only)
├── content/
│   ├── config.ts     Zod schemas (don't edit without testing build)
│   └── questions/
│       ├── en/       English Q&A markdown files
│       └── vi/       Vietnamese Q&A markdown files
├── layouts/          BaseLayout wraps every page
├── pages/            File-based routing (EN at root, VI under /vi/)
├── styles/
│   └── global.css    All site CSS — DO NOT add new CSS files
```

## Workflow: creating a new question

When the user asks to create a new question:

1. **Confirm language scope**: always create BOTH EN and VI versions unless explicitly told otherwise
2. **Verify canonicalSlug** doesn't collide with existing files in `src/content/questions/{en,vi}/`
3. **Generate frontmatter** that validates against Zod schema in `src/content/config.ts` — if build fails, fix the frontmatter, don't loosen the schema
4. **Write quickAnswer first**, then body — the quickAnswer drives everything else
5. **Run `npm run build`** to validate before declaring complete
6. **Never commit** `draft: true` files to main

## Workflow: editing existing content

- Always view the current file before editing — don't assume content from memory
- When fixing a translation, update both languages if the factual content differs
- Update `updatedDate` in frontmatter when making substantive content changes (not for typo fixes)

## Do NOT

- Add JavaScript dependencies for interactive components without explicit approval — this site is intentionally low-JS
- Introduce new CSS frameworks or libraries
- Add tracking/analytics scripts without discussion
- Modify `SEO.astro` without understanding JSON-LD implications — breaking structured data kills AEO
- Create pages that don't exist in both languages
- Use stock travel photography clichés (tourists on beaches, etc.) — placeholder blocks or commissioned photos only
- Add AI-generated images to published content without review

## Build & deploy

```bash
npm install          # first time only
npm run dev          # local dev on http://localhost:4321
npm run build        # validates schemas + generates static site to dist/
npm run preview      # preview production build locally
```

Cloudflare Pages auto-deploys from `main` branch. Build output: `dist/`. Node version: 20.

## AEO validation checklist

Before considering a question page "done":

- [ ] Paste URL into https://search.google.com/test/rich-results — Article + FAQPage schema detected
- [ ] Paste URL into https://validator.schema.org — no errors
- [ ] View page source — JSON-LD blocks present and valid
- [ ] hreflang link rel="alternate" present for both EN and VI
- [ ] Ask Perplexity the question that matches the title → check if Pholio appears as cited source within a week
