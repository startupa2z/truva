import {readFileSync,existsSync} from 'node:fs';
const site=readFileSync('src/data/site.ts','utf8');
if(!site.includes('satish@truvasolutions.com')||!site.includes('https://calendly.com/satish-truvasolutions/30min'))throw Error('Release contact or booking configuration is incomplete.');
if(!existsSync('src/pages/privacy.astro'))throw Error('Missing privacy notice.');
console.log('Release configuration checked.');
