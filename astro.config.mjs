import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://smartuptech.github.io',
  integrations: [sitemap()],
  build: {
    format: 'file'
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
