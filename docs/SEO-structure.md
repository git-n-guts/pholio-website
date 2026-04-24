# Pholio SEO Structure

## URL Architecture

### Route map

| Type | EN | VI |
|---|---|---|
| Home | `/` | `/vi/` |
| Question detail | `/questions/{city}/{canonicalSlug}/` | `/vi/questions/{city}/{canonicalSlug}/` |
| City detail | `/cities/{slug}/` | `/vi/cities/{slug}/` |
| Category listing | `/categories/{slug}/` | `/vi/categories/{slug}/` |
| Questions index | `/questions/` | `/vi/questions/` |
| Cities index | `/cities/` | `/vi/cities/` |
| Static pages | `/{page}/` | `/vi/{page}/` |

Static pages: about, app, ask, contact, contributors, editorial, privacy, search, terms.

### Slug rules

- **`canonicalSlug`** — language-neutral kebab-case (`^[a-z0-9-]+$`), shared between EN/VI question pairs. Used as URL segment + hreflang key.
- **`city`** — comes from `entry.data.city`, matches city content filename (e.g. `hoi-an`). Same value in both languages.
- **Category slugs** — hardcoded: food, transport, culture, weather, budget, safety, planning, activities, accommodation.
- **City slug** — comes from `city.id` (content collection filename).

### i18n routing config

```js
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'vi'],
  routing: { prefixDefaultLocale: false }
}
```

EN = no prefix. VI = `/vi/` prefix. Pages are manually mirrored — no middleware.

---

## Sitemap

- Plugin: `@astrojs/sitemap`
- Output: `/sitemap-index.xml` → `/sitemap-0.xml`
- i18n alternates auto-generated for every URL (`hreflang="en"` + `hreflang="vi"`)
- Draft pages excluded via `filter: (page) => !page.includes('/draft/')`
- No `lastmod`, `changefreq`, or `priority` set
- Currently ~46 URLs (23 EN + 23 VI)

```js
sitemap({
  i18n: {
    defaultLocale: 'en',
    locales: { en: 'en', vi: 'vi' },
  },
  filter: (page) => !page.includes('/draft/'),
})
```

---

## Canonical URLs

```
https://pholio.co + Astro.url.pathname
```

- `site: 'https://pholio.co'` set in astro.config
- `build.format: 'directory'` ensures trailing slashes
- No per-page override mechanism — always derived from current pathname
- Output: `<link rel="canonical">` + `<meta property="og:url">`

---

## hreflang

### In HTML `<head>` (SEO.astro)

Only emitted for **question detail pages** — requires both `canonicalSlug` AND `city` props:

```html
<link rel="alternate" hreflang="en" href="https://pholio.co/questions/{city}/{canonicalSlug}/" />
<link rel="alternate" hreflang="vi" href="https://pholio.co/vi/questions/{city}/{canonicalSlug}/" />
<link rel="alternate" hreflang="x-default" href="https://pholio.co/questions/{city}/{canonicalSlug}/" />
```

City pages, category pages, and static pages get **no HTML-level hreflang**.

### In sitemap XML

All pages get `<xhtml:link rel="alternate" hreflang="en">` + `hreflang="vi"` automatically via the sitemap plugin. No `x-default` in sitemap.

### Known gaps

- City/category pages pass `canonicalSlug` but not `city` → `alternates` is null → no HTML hreflang
- No `x-default` in sitemap output
- Static pages have no hreflang in either HTML or sitemap logic (sitemap plugin handles them)

---

## Meta tags (SEO.astro)

| Tag | Source |
|---|---|
| `<title>` | `title` prop |
| `<meta name="description">` | `description` prop |
| `<meta name="keywords">` | `keywords` prop (comma-joined) |
| `<meta name="author">` | `author` prop (default: "Pholio Editorial") |
| `<link rel="canonical">` | `siteUrl + pathname` |
| `og:type` | "website" or "article" |
| `og:url` | canonical URL |
| `og:title` | title |
| `og:description` | description |
| `og:image` | `image` prop (default: `/og-default.png`) |
| `og:locale` | en_US / vi_VN |
| `og:site_name` | "Pholio" |
| `twitter:card` | summary_large_image |
| `twitter:title` / `twitter:description` / `twitter:image` | mirrors OG |
| `article:published_time` | `pubDate` (question pages only) |
| `article:modified_time` | `updatedDate` (if set) |

---

## JSON-LD Structured Data

### Article (question detail pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{description}",
  "image": "{ogImage}",
  "datePublished": "{pubDate}",
  "dateModified": "{updatedDate || pubDate}",
  "author": { "@type": "Organization", "name": "{author}" },
  "publisher": { "@type": "Organization", "name": "Pholio", "logo": { "@type": "ImageObject", "url": "https://pholio.co/logo.png" } },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "{canonical}" },
  "inLanguage": "{lang}"
}
```

### FAQPage (question pages with `faq` array)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "{q}", "acceptedAnswer": { "@type": "Answer", "text": "{a}" } }
  ]
}
```

Emitted alongside Article schema on question pages.

### WebSite (homepages only)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pholio",
  "url": "https://pholio.co",
  "inLanguage": "{lang}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://pholio.co/search?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
}
```

### Not implemented

- `CollectionPage` — `schemaType` prop exists but emits **no** JSON-LD
- `BreadcrumbList` — no breadcrumb structured data despite UI breadcrumbs

---

## SEO props by page type

| Page | lang | city | canonicalSlug | schemaType | pubDate | faq |
|---|---|---|---|---|---|---|
| EN homepage | en | — | — | WebSite | — | — |
| VI homepage | vi | — | — | WebSite | — | — |
| EN question | en | data.city | data.canonicalSlug | Article | data.pubDate | data.faq |
| VI question | vi | data.city | data.canonicalSlug | Article | data.pubDate | data.faq |
| EN city | en | — | cities-{slug} | CollectionPage | — | — |
| VI city | vi | — | cities-{slug} | CollectionPage | — | — |
| EN category | en | — | categories-{slug} | CollectionPage | — | — |
| VI category | vi | — | categories-{slug} | CollectionPage | — | — |
| Static pages | varies | — | — | WebSite | — | — |

---

## robots.txt

- Allows all crawlers
- Explicitly allows AI/LLM bots: GPTBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, CCBot, Applebot-Extended, Bytespider
- Sitemap pointer: `https://pholio.co/sitemap-index.xml`
- AEO strategy: intentionally open to LLM crawlers

---

## Redirects (Cloudflare Pages)

```
# Legacy question URLs (old format → new format with city segment)
/questions/must-try-dishes-hoi-an/    /questions/hoi-an/must-try-dishes-hoi-an/    301
/vi/questions/must-try-dishes-hoi-an/    /vi/questions/hoi-an/must-try-dishes-hoi-an/    301
```

One redirect pair per migrated question. New questions won't need redirects since they're created with the city segment from the start.

---

## Content frontmatter — SEO fields

### Questions (`src/content/questions/{en,vi}/*.md`)

| Field | Constraints | SEO use |
|---|---|---|
| `title` | 10–120 chars | `<title>`, OG title, JSON-LD headline |
| `description` | 120–165 chars | meta description, OG desc, JSON-LD description |
| `canonicalSlug` | kebab-case | URL segment + hreflang key |
| `city` | required | URL segment + hreflang construction |
| `category` | 9 enum values | URL segment, filtering, category pages |
| `pubDate` | required | JSON-LD `datePublished`, `article:published_time` |
| `updatedDate` | optional | JSON-LD `dateModified`, `article:modified_time` |
| `quickAnswer` | 80–400 chars | AEO answer box (display, not in structured data) |
| `faq` | {q, a}[] | FAQPage JSON-LD schema |
| `keywords` | string[] | `<meta name="keywords">` |
| `author` | default "Pholio Editorial" | `<meta name="author">`, JSON-LD |
| `heroImage` | optional | OG image, Twitter image, JSON-LD image |
| `draft` | boolean | excluded from build + sitemap |

### Cities (`src/content/cities/*.md`)

| Field | SEO use |
|---|---|
| `name` | `<title>` on city pages |
| `description` | meta description on city pages |
| `heroImage` | OG image on city pages |