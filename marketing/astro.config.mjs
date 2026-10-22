import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import {securityFeedDev} from './scripts/security-feed-dev.mjs';

export default defineConfig({
  site: 'https://truvasolutions.com',
  output: 'static',
  redirects: { '/resources/blogs': { status: 301, destination: '/resources' }, '/resources/white-papers': { status: 301, destination: '/resources' }, '/resources/case-studies': { status: 301, destination: '/resources' } },
  trailingSlash: 'never',
  cacheDir: './.cache/astro',
  vite: { cacheDir: '.cache/vite', plugins: [tailwindcss(), securityFeedDev()] },
  build: { inlineStylesheets: 'never' },
});
