import {cpSync,readdirSync,writeFileSync,rmSync,readFileSync,statSync} from 'node:fs';
import {join,relative,sep} from 'node:path';
import {robotsTxt} from './crawler-policy.mjs';
const tracker=readFileSync('dist/index.html','utf8').match(/<script[^>]*>[^<]*truva-visitor[^<]*<\/script>/)?.[0];
if(!tracker)throw Error('Analytics tracker missing from release.');
// Preserve existing published article URLs and their assets, without replacing rebuilt guides.
cpSync('../frontend/assets','dist/assets',{recursive:true});
for(const file of readdirSync('../frontend/blog')) {
 const target=join('dist/blog',file);
 try {if(statSync(target).isDirectory())continue;}catch{}
 cpSync(join('../frontend/blog',file),target,{recursive:true});
 if(file.endsWith('.html')){let html=readFileSync(target,'utf8');html=html.replace('</body>',tracker+'</body>').replaceAll('/#services','/services').replaceAll('/#markets','/#who-we-serve').replaceAll('/#contact','/#consult').replaceAll('https://truvasolutions.com/og-image.png','https://truvasolutions.com/images/og-home.png');
  const canonical=`https://truvasolutions.com/blog/${file}`;
  if(!/<link\s+rel="canonical"/i.test(html))html=html.replace('</head>',`<link rel="canonical" href="${canonical}">\n<meta property="og:url" content="${canonical}">\n</head>`);
  writeFileSync(target,html);}
}
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name.endsWith('.html'))writeFileSync(p,readFileSync(p,'utf8').replaceAll('service@truvasolutions.com','satish@truvasolutions.com'));}}
walk('dist');
rmSync('dist/design-system',{recursive:true,force:true});
rmSync('dist/_headers',{force:true});
writeFileSync('dist/robots.txt',robotsTxt);
const pages=[];
function collect(folder){for(const entry of readdirSync(folder,{withFileTypes:true})){const file=join(folder,entry.name);if(entry.isDirectory())collect(file);else if(entry.name.endsWith('.html')){
  const path='/'+relative('dist',file).split(sep).join('/').replace(/(?:^|\/)index\.html$/,'').replace(/\/$/,'');
  const route=path||'/';
  const html=readFileSync(file,'utf8');
  const canonical=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if(!canonical||/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html))continue;
  const url=new URL(canonical);
  if(url.origin!=='https://truvasolutions.com'||url.pathname.replace(/\/$/,'')!==route.replace(/\/$/,''))continue;
  pages.push(canonical);
}}}
collect('dist');
const xmlEscape=(value)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...new Set(pages)].sort().map(url=>`  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n')+'\n</urlset>\n');
console.log('Preserved legacy articles; production robots and sitemap prepared.');
