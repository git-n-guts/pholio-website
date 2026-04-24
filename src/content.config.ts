import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Questions collection - mỗi file .md là một câu hỏi & trả lời.
 * Structure: src/content/questions/{en|vi}/{slug}.md
 *
 * canonicalSlug phải giống nhau giữa VI và EN để link hreflang đúng.
 */
const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    // Core identity
    title: z.string().min(10).max(120),
    description: z.string().min(120).max(165), // SEO-optimal length
    canonicalSlug: z.string().regex(/^[a-z0-9-]+$/, 'kebab-case only'),

    // Categorization
    city: z.string(), // e.g. "hoi-an", "hanoi", "nationwide"
    cityDisplay: z.string(), // e.g. "Hoi An", "Hà Nội"
    category: z.enum([
      'food',
      'transport',
      'culture',
      'weather',
      'budget',
      'safety',
      'planning',
      'activities',
      'accommodation',
    ]),

    // Dates
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // Content
    quickAnswer: z.string().min(80).max(400), // The AEO-critical direct answer
    readingTime: z.number().int().positive(),

    // AEO enhancement
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        })
      )
      .optional(),
    keywords: z.array(z.string()).default([]),

    // Metadata
    author: z.string().default('Pholio Editorial'),
    contributors: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Media
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
  }),
});

/**
 * Cities collection - metadata per city.
 * File slug (filename) serves as the city identifier; no need for slug field.
 *
 * Body content is parsed automatically by Astro's glob loader.
 * Keystatic defines `content: fields.document()` for the CMS editing UI,
 * but Zod schema doesn't need it — the body is accessible via render().
 */
const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cities' }),
  schema: z.object({
    name: z.string(),
    region: z.string(), // "North · Capital", "Central · Coast"
    tagline: z.string(),
    description: z.string(),
    bestSeason: z.string().optional(),
    daysRecommended: z.string().optional(), // "3-5 days"
    budgetLevel: z.enum(['budget', 'mid-range', 'premium']).optional(),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  questions,
  cities,
};
