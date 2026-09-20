import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import {securityFeedDev} from './scripts/security-feed-dev.mjs';

export default defineConfig({
  site: 'https://truvasolutions.com',
  output: 'static',
  redirects: { '/resources': { status: 301, destination: '/security-hub' }, '/resources/blogs': { status: 301, destination: '/security-hub/guides' }, '/resources/white-papers': { status: 301, destination: '/security-hub' }, '/resources/case-studies': { status: 301, destination: '/security-hub' } },
  trailingSlash: 'never',
  cacheDir: './.cache/astro',
  vite: { cacheDir: '.cache/vite', plugins: [tailwindcss(), securityFeedDev()] },
  build: { inlineStylesheets: 'never' },
});
