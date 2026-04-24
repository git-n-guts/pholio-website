// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  // TODO: đổi sang domain thật
  site: 'https://pholio.co',

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

  adapter: cloudflare()
});