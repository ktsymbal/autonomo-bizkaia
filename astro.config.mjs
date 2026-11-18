// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://ktsymbal.github.io',
  base: '/autonomo-bizkaia',
  integrations: [preact()],
  trailingSlash: 'always',
});
