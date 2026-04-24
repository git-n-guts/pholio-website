# Schema Sync Convention — pholio-website & pholio-cms

Pholio uses a **two-repo architecture** for content management:

| | pholio-website | pholio-cms |
|---|---|---|
| **Purpose** | Static site (pholio.click) | CMS admin (admin.pholio.click) |
| **Schema file** | `src/content.config.ts` (Zod) | `keystatic.config.ts` (Keystatic) |
| **Runtime** | Build-time validation | CMS editing UI |
| **Hosting** | Cloudflare Pages (static) | Cloudflare Pages (SSR) |

## When to update schemas

Any time you add, rename, or modify a content field, you **must update both repos**:

1. Add the field to `keystatic.config.ts` in **pholio-cms** (for CMS editing UI)
2. Add the matching field to `src/content.config.ts` in **pholio-website** (for build-time validation)

If you only update one repo, content created via the CMS may fail build validation, or build validation may not catch CMS errors.

## Known acceptable gaps

These gaps are by design and do not need fixing:

| Field | pholio-website (Zod) | pholio-cms (Keystatic) | Reason |
|-------|----------------------|----------------------|--------|
| `content` (body) | Not defined | `fields.document()` | Astro's glob loader parses the body automatically — no Zod field needed |
| `canonicalSlug` regex | `z.string().regex(/^[a-z0-9-]+$/)` | `fields.text({validation:{pattern:{regex:...}}})` | Both now validate kebab-case |
| Collections | 1 `questions` collection | 2 collections: `questionsEn`, `questionsVi` | Zod uses glob loader with `**/*.md`, Keystatic separates for bilingual editing UX |
| `slug` in cities | Not in Zod schema | Not in Keystatic schema | Filename serves as city identifier; `slug` in frontmatter is redundant |

### Optional field gaps

Zod marks some fields as `.optional()` while Keystatic declares them as required. This works because:

- Keystatic `fields.text()` allows empty strings (`""`), which pass Zod `z.string()`
- Keystatic `fields.date()` returns `null` when empty, which Astro coerces gracefully
- When a field is omitted from frontmatter, Zod `.optional()` allows `undefined`

| Field | Zod | Keystatic | Notes |
|-------|-----|-----------|-------|
| `updatedDate` | `z.coerce.date().optional()` | `fields.date()` (required) | Keystatic sends null/empty if not set |
| `bestSeason` | `z.string().optional()` | `fields.text()` (required) | Empty string passes Zod |
| `daysRecommended` | `z.string().optional()` | `fields.text()` (required) | Empty string passes Zod |
| `budgetLevel` | `z.enum(...).optional()` | `fields.select(..., defaultValue:'budget')` | Has default, so always present |
| `heroImage` | `z.string().optional()` | `fields.text()` (required) | Empty string passes Zod |
| `heroImageAlt` | `z.string().optional()` | `fields.text()` (required) | Empty string passes Zod |

## Field-by-field audit (as of 2026-04-24)

### Cities collection

| Field | Zod type | Keystatic type | Match? |
|-------|----------|----------------|--------|
| `name` | `z.string()` | `fields.text()` | ✅ |
| `region` | `z.string()` | `fields.text()` | ✅ |
| `tagline` | `z.string()` | `fields.text()` | ✅ |
| `description` | `z.string()` | `fields.text({multiline:true})` | ✅ |
| `bestSeason` | `z.string().optional()` | `fields.text()` | ⚠️ See optional gaps |
| `daysRecommended` | `z.string().optional()` | `fields.text()` | ⚠️ See optional gaps |
| `budgetLevel` | `z.enum(['budget','mid-range','premium']).optional()` | `fields.select({options:[budget,mid-range,premium], defaultValue:'budget'})` | ✅ |
| `featured` | `z.boolean().default(false)` | `fields.checkbox({defaultValue:false})` | ✅ |
| `heroImage` | `z.string().optional()` | `fields.text()` | ⚠️ See optional gaps |

### Questions collection

| Field | Zod type | Keystatic type | Match? |
|-------|----------|----------------|--------|
| `title` | `z.string().min(10).max(120)` | `fields.text({validation:{length:{min:10,max:120}}})` | ✅ |
| `description` | `z.string().min(120).max(165)` | `fields.text({validation:{length:{min:120,max:165}}})` | ✅ |
| `canonicalSlug` | `z.string().regex(/^[a-z0-9-]+$/)` | `fields.text({validation:{pattern:{regex:/^[a-z0-9-]+$/, message:'kebab-case only'}}})` | ✅ |
| `city` | `z.string()` | `fields.text()` | ✅ |
| `cityDisplay` | `z.string()` | `fields.text()` | ✅ |
| `category` | `z.enum([9 values])` | `fields.select({9 values})` | ✅ |
| `pubDate` | `z.coerce.date()` | `fields.date()` | ✅ |
| `updatedDate` | `z.coerce.date().optional()` | `fields.date()` | ⚠️ See optional gaps |
| `quickAnswer` | `z.string().min(80).max(400)` | `fields.text({multiline:true, validation:{length:{min:80,max:400}}})` | ✅ |
| `readingTime` | `z.number().int().positive()` | `fields.integer()` | ✅ |
| `faq` | `z.array(z.object({q:z.string(),a:z.string()})).optional()` | `fields.array(fields.object({q:text, a:text(multiline)}))` | ✅ |
| `keywords` | `z.array(z.string()).default([])` | `fields.array(fields.text())` | ✅ |
| `author` | `z.string().default('Pholio Editorial')` | `fields.text({defaultValue:'Pholio Editorial'})` | ✅ |
| `contributors` | `z.array(z.string()).default([])` | `fields.array(fields.text())` | ✅ |
| `draft` | `z.boolean().default(false)` | `fields.checkbox({defaultValue:false})` | ✅ |
| `featured` | `z.boolean().default(false)` | `fields.checkbox({defaultValue:false})` | ✅ |
| `heroImage` | `z.string().optional()` | `fields.text()` | ⚠️ See optional gaps |
| `heroImageAlt` | `z.string().optional()` | `fields.text()` | ⚠️ See optional gaps |

## Checklist for schema changes

When adding a new field to a content collection:

- [ ] Add field to `keystatic.config.ts` in pholio-cms repo
- [ ] Add matching field to `src/content.config.ts` in pholio-website repo
- [ ] Verify field name, type, and validation match between both schemas
- [ ] Test: create content via CMS → verify build passes in pholio-website
- [ ] Update `docs/schema-sync.md` if the gap table needs updating

## Content creation flow

```
admin.pholio.click (pholio-cms)
  → Editor creates/edits content
  → Keystatic Cloud commits to pholio-website repo
  → Cloudflare Pages auto-deploys pholio.click
```

Content files (`.md`) live in the **pholio-website** repo. The CMS reads and writes them via Keystatic Cloud's GitHub integration.