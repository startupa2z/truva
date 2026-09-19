import {cpSync,readdirSync,writeFileSync,rmSync,readFileSync,statSync} from 'node:fs';
import {join} from 'node:path';
const tracker=readFileSync('dist/index.html','utf8').match(/<script[^>]*>[^<]*truva-visitor[^<]*<\/script>/)?.[0];
if(!tracker)throw Error('Analytics tracker missing from release.');
// Preserve existing published article URLs and their assets, without replacing rebuilt guides.
cpSync('../frontend/assets','dist/assets',{recursive:true});
for(const file of readdirSync('../frontend/blog')) {
 const target=join('dist/blog',file);
 try {if(statSync(target).isDirectory())continue;}catch{}
 cpSync(join('../frontend/blog',file),target,{recursive:true});
 if(file.endsWith('.html')){let html=readFileSync(target,'utf8');html=html.replace('</body>',tracker+'</body>').replaceAll('/#services','/services').replaceAll('/#markets','/#who-we-serve').replaceAll('/#contact','/#consult').replaceAll('https://truvasolutions.com/og-image.png','https://truvasolutions.com/images/og-home.png');writeFileSync(target,html);}
}
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name.endsWith('.html'))writeFileSync(p,readFileSync(p,'utf8').replaceAll('service@truvasolutions.com','satish@truvasolutions.com'));}}
walk('dist');
rmSync('dist/design-system',{recursive:true,force:true});
rmSync('dist/_headers',{force:true});rmSync('dist/_redirects',{force:true});
writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://truvasolutions.com/sitemap.xml\n');
const urls=['/','/services','/security-hub','/resources/blogs','/resources/white-papers','/resources/case-studies','/privacy'];
for(const f of readdirSync('dist/blog'))urls.push('/blog/'+f);
writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(p=>'<url><loc>https://truvasolutions.com'+p+'</loc></url>').join('')+'</urlset>');
console.log('Preserved legacy articles; production robots and sitemap prepared.');
