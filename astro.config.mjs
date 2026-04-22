// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://pholio.co', // TODO: đổi sang domain thật
  output: 'static',
  integrations: [
    mdx(),
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
      prefixDefaultLocale: false, // EN không có prefix, VI ở /vi/*
    },
  },
  build: {
    format: 'directory',
  },
});
