# Pholio

> Real answers from locals about traveling Vietnam.

An editorial, AEO-optimized Q&A website about Vietnam travel. Bilingual (EN/VI). Built with Astro, deployed on Cloudflare Pages.

## Quick start

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:4321
npm run dev

# Build for production (output: dist/)
npm run build

# Preview production build
npm run preview
```

Requires Node.js 20+.

## Project structure

```
src/
├── components/     Reusable Astro components
├── content/        Zod-validated Markdown content
│   └── questions/  Q&A posts in EN and VI
├── layouts/        Page wrappers
├── pages/          Routes (EN at root, VI under /vi/)
└── styles/         Hand-written CSS
public/
├── robots.txt      Explicit LLM bot allowlist (GPTBot, ClaudeBot, etc.)
├── llms.txt        llmstxt.org spec for AEO
├── _headers        Cloudflare security + cache headers
└── _redirects      URL redirects
```

See `CLAUDE.md` for detailed development rules and content guidelines.

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION=20`

## Creating new content

Add a Markdown file to both:
- `src/content/questions/en/{slug}.md`
- `src/content/questions/vi/{slug}.md`

Both files must share the same `canonicalSlug` in frontmatter. Build will fail if Zod schema validation fails — this is intentional.

See existing samples in `src/content/questions/` for reference format.

## AEO validation

After deploying, validate each question page:
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Validator](https://validator.schema.org)
- Test query in Perplexity to confirm Pholio is cited

## License

All content © Pholio. Code: MIT (or your preferred license).
