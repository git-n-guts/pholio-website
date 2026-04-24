// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Keystatic admin UI needs SSR (React + its own routes).
// Only load in dev — production builds are pure static HTML.
const devIntegrations =
  process.argv[2] === 'dev' ? [react(), keystatic()] : [];

export default defineConfig({
  site: 'https://pholio.click',
  // No adapter — pure static output (default in Astro 5)
  integrations: [
    mdx(),
    ...devIntegrations,
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          vi: 'vi',
        },
      },
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    format: 'directory',
  },
});