import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Official Astro 6 + Tailwind 4 configuration
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
