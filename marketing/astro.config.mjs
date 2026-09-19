import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://truvasolutions.com',
  output: 'static',
  trailingSlash: 'never',
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'never' },
});
