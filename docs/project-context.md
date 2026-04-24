---
project_name: 'pholio-website'
user_name: 'Tiez'
date: '2026-04-23'
sections_completed: ['technology_stack', 'typescript', 'astro_framework', 'content_aeo', 'css_design', 'workflow_deploy', 'antipatterns']
status: 'complete'
rule_count: 42
optimized_for_llm: true
---

# Ngữ cảnh dự án cho AI Agents

_File này chứa các quy tắc và pattern quan trọng mà AI agent phải tuân theo khi triển khai code trong dự án này. Tập trung vào các chi tiết không hiển nhiên mà agent dễ bỏ sót._

---

## Tech Stack & Phiên bản

- **Astro** 5.x — static output, NO SSR
- **@astrojs/mdx** 4.x — MDX support cho content
- **@astrojs/sitemap** 3.x — sitemap tự động với i18n
- **Pagefind** 1.5.x — static search, chạy sau build
- **TypeScript** strict mode — extends `astro/tsconfigs/strict`
- **Node** 20 (Cloudflare Pages target)
- **Keystatic CMS** — nằm ở repo riêng `pholio-cms`, deploy tại `admin.pholio.click`
- **Không có** React, Vue, hay bất kỳ UI framework nào trong repo này
- **Không có** Tailwind hay CSS framework — tất cả CSS viết tay

## Quy tắc triển khai quan trọng

### Quy tắc TypeScript & Import

- TypeScript strict mode bật — không dùng `any`, không bỏ qua type errors
- Path aliases được cấu hình — dùng `@/`, `@components/`, `@layouts/`, `@styles/`
  thay vì relative paths khi import từ `src/`
- Tất cả `.astro` files — component logic viết trong frontmatter (`---`)
- Props interface khai báo trong frontmatter của component, không tách file riêng
- `import type` cho type-only imports (TypeScript strict requirement)
- KHÔNG dùng `// @ts-ignore` hay `// @ts-nocheck` — fix lỗi thực sự

### Quy tắc Astro Framework

**Content Collections:**
- Collection `questions` dùng glob loader — ID có dạng `en/filename` hoặc `vi/filename`
- Lọc theo ngôn ngữ: `id.startsWith('en/')` hoặc `id.startsWith('vi/')`
- Lọc bỏ draft: thêm `&& !data.draft` vào filter
- Schema Zod trong `src/content.config.ts` — KHÔNG nới lỏng schema, fix frontmatter nếu build lỗi

**Routing:**
- EN: `/questions/{city}/{canonicalSlug}/` — không có prefix `/en/`
- VI: `/vi/questions/{city}/{canonicalSlug}/`
- `getStaticPaths` dùng `entry.data.city` và `entry.data.canonicalSlug` làm params
- `build: format: 'directory'` — tất cả URL có trailing slash

**i18n:**
- `prefixDefaultLocale: false` — EN ở root, VI ở `/vi/*`
- Mọi page EN phải có bản VI tương ứng tại cùng path với prefix `/vi/`
- `canonicalSlug` phải giống nhau giữa EN và VI cho hreflang hoạt động đúng

**Components:**
- KHÔNG tạo React/Vue component — chỉ dùng `.astro`
- `set:html` dùng cho `quickAnswer` vì field này chứa HTML (`<strong>`, etc.)
- `<BaseLayout>` wraps mọi page — truyền đủ props cho SEO

**Two-repo architecture:**
- Repo này (`pholio-website`): pure static site, zero Keystatic/React dependencies
- Repo `pholio-cms`: Keystatic admin UI (Astro SSR + React), deploy tại `admin.pholio.click`
- Schema Zod (`src/content.config.ts`) ở repo này, Keystatic schema (`keystatic.config.ts`) ở pholio-cms
- Thay đổi field phải cập nhật cả 2 repo — xem `docs/schema-sync.md`
- Content workflow: edit tại admin.pholio.click → Keystatic Cloud commit vào repo này → Cloudflare Pages auto-deploy

### Quy tắc Content & AEO

**Frontmatter bắt buộc cho question:**
- `title`: 10–120 ký tự, phrased as a question
- `description`: 120–165 ký tự chính xác (Zod enforce)
- `canonicalSlug`: kebab-case, giống nhau giữa EN và VI
- `city`: kebab-case ID (vd: `"hoi-an"`, `"hanoi"`)
- `cityDisplay`: tên hiển thị (vd: `"Hoi An"`, `"Hà Nội"`)
- `quickAnswer`: 80–400 ký tự, hỗ trợ HTML inline (`<strong>`, `<em>`)
- `faq`: tối thiểu 3 items — thiếu thì AEO schema không hiệu quả
- `draft: false` — KHÔNG commit file có `draft: true` lên main

**SEO.astro:**
- hreflang CHỈ render khi truyền cả `canonicalSlug` VÀ `city` — thiếu 1 trong 2 là mất hreflang
- `schemaType="Article"` + `pubDate` → JSON-LD Article schema
- `faq` array → JSON-LD FAQPage schema (critical cho AEO)
- KHÔNG sửa `SEO.astro` nếu chưa hiểu hệ quả JSON-LD

**Pagefind:**
- Content được index từ `<main data-pagefind-body>` — đảm bảo element này tồn tại
- Filter dùng `data-pagefind-filter` attribute — xem pattern trong `[slug].astro`
- Dev mode không có search index — phải `npm run build` để test search

### CSS & Design System

**Quy tắc tuyệt đối:**
- TẤT CẢ CSS viết trong `src/styles/global.css` — KHÔNG tạo file CSS mới
- KHÔNG dùng Tailwind hay bất kỳ CSS framework nào
- KHÔNG thêm CSS custom property (màu) mới nếu không được yêu cầu rõ ràng

**Color palette (dùng đúng tên variable):**
- `--bg: #FAF8F3` — nền trang
- `--ink: #1A1613` — text chính
- `--muted: #6B6259` — text phụ
- `--accent: #C2410C` — màu nhấn (terracotta)
- `--accentbg: #FEF3EC` — nền nhấn nhẹ
- `--border: #E8E2D5` / `--borderS: #D4CDB9`
- `--warmpaper: #F5F1E6`

**Typography:**
- Heading English: `'Instrument Serif', serif`
- Heading Vietnamese: `'Bona Nova SC', serif`
- Body: `'Inter', sans-serif`
- Base: 16px mobile, 18px desktop
- Max prose width: 680px

**Layout:**
- Max page width: 1280px — dùng class `.max-page`
- Spacing scale: 8, 16, 24, 32, 48, 64, 96, 128px — không dùng giá trị lẻ
- Padding section ≥ 96px trên desktop

**Component patterns:**
- Inline style cho one-off styling trong `.astro` pages
- `<style>` scoped block cho page-level responsive overrides

### Workflow & Deploy

**Build:**
- `npm run build` = `astro build` + `npx pagefind --site dist --output-path dist/pagefind`
- Luôn chạy `npm run build` để validate trước khi khai báo hoàn thành
- Build fail → fix frontmatter hoặc code, KHÔNG loosen schema Zod

**Deploy:**
- Cloudflare Pages auto-deploy từ branch `main`
- Build output: `dist/`
- Node version: 20

**Git:**
- KHÔNG commit `draft: true` files lên `main`
- Cập nhật `updatedDate` trong frontmatter khi sửa nội dung thực chất
- KHÔNG cập nhật `updatedDate` cho typo fix

### Anti-patterns & Gotchas

**KHÔNG làm:**
- KHÔNG dùng `entry.slug` — với Astro v6 glob loader, dùng `entry.data.canonicalSlug` và `entry.data.city`
- KHÔNG filter collection bằng `data.lang` — không có field đó; dùng `id.startsWith('en/')` hoặc `id.startsWith('vi/')`
- KHÔNG tạo component `.jsx`/`.tsx` — chỉ `.astro`
- KHÔNG thêm JS library cho interactive UI mà không được approval
- KHÔNG tạo question chỉ 1 ngôn ngữ — luôn tạo cả EN và VI cùng lúc
- KHÔNG bỏ `city` prop khi render `<BaseLayout>` cho question page — hreflang sẽ mất
- KHÔNG dùng tên thành phố tiếng Anh trong content VI (vd: dùng "Hội An" không phải "Hoi An")
- KHÔNG thêm Keystatic hay React dependencies vào repo này — CMS nằm ở pholio-cms
- KHÔNG thêm `keystatic.config.ts` vào repo này — file đó thuộc pholio-cms
- KHÔNG thêm SSR adapter vào Astro config — site phải giữ pure static
- KHÔNG sửa field structure mà không cập nhật keystatic.config.ts ở pholio-cms (xem docs/schema-sync.md)

**Gotchas phổ biến:**
- `description` Zod enforce 120–165 chars — đếm kỹ, quá ngắn hay quá dài đều fail build
- `quickAnswer` hỗ trợ HTML — render bằng `set:html`, KHÔNG dùng markdown syntax bên trong
- URL question có dạng `/questions/{city}/{slug}/` — hai segment params, không phải một
- `hreflang` chỉ xuất hiện trên question pages — city/category pages không có
- Pagefind index không tồn tại trong dev mode — đừng báo search broken khi dev
- `sitemap` filter bỏ `/draft/` paths — page draft sẽ không xuất hiện trong sitemap

---

## Hướng dẫn sử dụng

**Dành cho AI Agents:**
- Đọc file này trước khi implement bất kỳ code nào
- Tuân theo TẤT CẢ quy tắc đúng như được ghi
- Khi nghi ngờ, chọn phương án hạn chế hơn
- Cập nhật file này nếu phát hiện pattern mới

**Dành cho Humans:**
- Giữ file này gọn nhẹ, tập trung vào nhu cầu của agent
- Cập nhật khi tech stack thay đổi
- Review định kỳ để bỏ các quy tắc đã lỗi thời

_Cập nhật lần cuối: 2026-04-24_
