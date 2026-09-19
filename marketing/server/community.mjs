import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import {existsSync,mkdirSync,readFileSync,writeFileSync,statSync,readdirSync,unlinkSync} from 'node:fs';
import {resolve,dirname,extname,join,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

export function createCommunityServer({root,dbPath,adminToken,origin='http://127.0.0.1:4321',trustProxy=false,backupDir,now=()=>Date.now()}) {
  const db=new DatabaseSync(dbPath);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS views(day TEXT,path TEXT,count INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(day,path));
    CREATE TABLE IF NOT EXISTS view_events(id TEXT PRIMARY KEY,expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS visitors(day TEXT,id TEXT,PRIMARY KEY(day,id));
    CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY,slug TEXT NOT NULL,name TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS comments_slug_status ON comments(slug,status,id);`);
  function snapshot(){
    if(!backupDir)return;
    mkdirSync(backupDir,{recursive:true,mode:0o700});
    const day=new Date(now()).toISOString().slice(0,10);
    const file=join(backupDir,day+'.sqlite');
    if(!existsSync(file))db.exec("VACUUM INTO '"+file.replaceAll("'","''")+"'");
    const cutoff=new Date(now()-6*86400000).toISOString().slice(0,10);
    for(const name of readdirSync(backupDir))if(/^\d{4}-\d{2}-\d{2}\.sqlite$/.test(name)&&name.slice(0,10)<cutoff)unlinkSync(join(backupDir,name));
  }
  snapshot();
  const backupTimer=backupDir?setInterval(()=>{try{snapshot();}catch{console.error('Community backup failed. Check persistent storage.');}},3600000):null;
  backupTimer?.unref();
  const sessions=new Map(),limits=new Map();const salt=randomBytes(32);
  const pages=new Set();
  function walk(folder){for(const entry of readdirSync(folder,{withFileTypes:true})){const file=join(folder,entry.name);if(entry.isDirectory())walk(file);else if(entry.name.endsWith('.html')){const rel=file.slice(root.length).replaceAll(sep,'/').replace(/\/index\.html$/,'');pages.add(rel||'/');}}}
  walk(root);
  const blogPaths=new Set([...pages].filter(p=>p.startsWith('/blog/')));
  const hash=(s)=>createHash('sha256').update(salt).update(s).digest('hex');
  const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  function limit(req,kind,max,ms){const key=hash((trustProxy ? String(req.headers['x-forwarded-for']||'').split(',').at(-1).trim() || req.socket.remoteAddress : req.socket.remoteAddress || '')+kind);const time=now();let record=limits.get(key);if(!record||record.until<time){record={n:0,until:time+ms};limits.set(key,record);}if(limits.size>10000)for(const [k,v] of limits)if(v.until<time)limits.delete(k);if(++record.n>max)throw Object.assign(new Error('Too many requests. Please try again later.'),{status:429});}
  async function body(req){let bytes=0;const chunks=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>8192)throw Object.assign(new Error('Request too large.'),{status:413});chunks.push(chunk);}try{const data=JSON.parse(Buffer.concat(chunks).toString());if(!data||typeof data!=='object'||Array.isArray(data))throw Error();return data;}catch{throw Object.assign(new Error('Invalid request.'),{status:400});}}
  const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
  function authorized(req){const cookie=req.headers.cookie?.match(/(?:^|; )truva_admin=([a-f0-9]+)/)?.[1];const expiry=sessions.get(cookie);if(!expiry||expiry<now()){sessions.delete(cookie);fail('Sign in required.',401);}return cookie;}
  const server=createServer(async(req,res)=>{
   try {
    const url=new URL(req.url,origin);const path=url.pathname;
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');
    if(path==='/health'&&req.method==='GET'){db.prepare('SELECT 1').get();return json(res,200,{status:'ok',commit:process.env.RELEASE_COMMIT||'local'});}
    if(['/resources','/resources/','/blog.html'].includes(path)){res.writeHead(301,{Location:path==='/blog.html'?'/resources/blogs':'/security-hub'});return res.end();}
    if(process.env.NODE_ENV==='production'&&path.startsWith('/design-system'))fail('Not found.',404);
    if(path.startsWith('/api/')) {
      if(req.method==='POST'||req.method==='PATCH'){
        if(req.headers.origin!==origin)fail('Origin not allowed.',403);
        if(!req.headers['content-type']?.startsWith('application/json'))fail('JSON required.',415);
      }
      if(path==='/api/views'&&req.method==='POST'){
        limit(req,'views',100,60000);const data=await body(req);
        if(typeof data.path!=='string'||!pages.has(data.path)||data.path.startsWith('/admin')||data.path==='/design-system')fail('Unknown page.');
        if(typeof data.eventId!=='string'||!/^[-a-zA-Z0-9]{16,80}$/.test(data.eventId))fail('Invalid event.');
        if(data.visitorId!==undefined&&(typeof data.visitorId!=='string'||!/^[-a-zA-Z0-9]{16,80}$/.test(data.visitorId)))fail('Invalid visitor.');
        const id=createHash('sha256').update(adminToken).update(data.path+data.eventId).digest('hex'),time=now(),day=new Date(time).toISOString().slice(0,10);
        db.exec('BEGIN IMMEDIATE');try{db.prepare('DELETE FROM view_events WHERE expires < ?').run(time);const event=db.prepare('INSERT OR IGNORE INTO view_events(id,expires) VALUES (?,?)').run(id,time+1800000);if(event.changes)db.prepare('INSERT INTO views(day,path,count) VALUES (?,?,1) ON CONFLICT(day,path) DO UPDATE SET count=count+1').run(day,data.path);if(data.visitorId){const visitorHash=createHash('sha256').update(adminToken).update('visitor:'+data.visitorId).digest('hex');db.prepare('INSERT OR IGNORE INTO visitors(day,id) VALUES (?,?)').run(day,visitorHash);}
        db.prepare('DELETE FROM visitors WHERE day < ?').run(new Date(time-2592000000).toISOString().slice(0,10));
        db.prepare("DELETE FROM comments WHERE status!='approved' AND created < ?").run(new Date(time-7776000000).toISOString());
        db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
        return json(res,200,{views:db.prepare('SELECT COALESCE(SUM(count),0) AS total FROM views WHERE path=?').get(data.path).total});
      }
      if(path==='/api/views'&&req.method==='GET'){
        const page=url.searchParams.get('path');if(!blogPaths.has(page))fail('Unknown article.',404);
        return json(res,200,{views:db.prepare('SELECT COALESCE(SUM(count),0) AS total FROM views WHERE path=?').get(page).total});
      }
      if(path==='/api/comments'&&req.method==='GET'){
        const slug=url.searchParams.get('slug');if(!blogPaths.has(slug))fail('Unknown article.',404);
        return json(res,200,{comments:db.prepare("SELECT id,name,body,created FROM comments WHERE slug=? AND status='approved' ORDER BY id DESC LIMIT 50").all(slug)});
      }
      if(path==='/api/comments'&&req.method==='POST'){
        limit(req,'comments',5,600000);const data=await body(req);
        if(!blogPaths.has(data.slug))fail('Unknown article.');
        if(data.website)fail('Submission could not be accepted.');
        if(typeof data.name!=='string'||typeof data.body!=='string')fail('Name and comment are required.');
        const name=data.name.trim(),comment=data.body.trim();
        if(name.length<2||name.length>60||comment.length<10||comment.length>2000)fail('Use a name of 2–60 characters and a comment of 10–2,000 characters.');
        if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(name+comment))fail('Unsupported characters.');
        db.prepare('INSERT INTO comments(slug,name,body,created) VALUES(?,?,?,?)').run(data.slug,name,comment,new Date(now()).toISOString());
        return json(res,202,{message:'Thank you. Your comment is awaiting review.'});
      }
      if(path==='/api/admin/session'&&req.method==='POST'){
        limit(req,'login',10,900000);const data=await body(req);const input=typeof data.token==='string'?Buffer.from(data.token):Buffer.alloc(0);const expected=Buffer.from(adminToken);
        if(input.length!==expected.length||!timingSafeEqual(input,expected))fail('Invalid admin key.',401);
        const id=randomBytes(32).toString('hex');sessions.set(id,now()+3600000);
        res.setHeader('Set-Cookie',`truva_admin=${id}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=3600${origin.startsWith('https:')?'; Secure':''}`);
        return json(res,200,{ok:true});
      }
      if(path.startsWith('/api/admin/')){
        const session=authorized(req);
        if(path==='/api/admin/logout'&&req.method==='POST'){sessions.delete(session);res.setHeader('Set-Cookie','truva_admin=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0');return json(res,200,{ok:true});}
        if(path==='/api/admin/overview'&&req.method==='GET')return json(res,200,{
          visitorsToday:db.prepare('SELECT COUNT(*) AS total FROM visitors WHERE day=?').get(new Date(now()).toISOString().slice(0,10)).total,
          visitors30Days:db.prepare('SELECT COUNT(DISTINCT id) AS total FROM visitors WHERE day>=?').get(new Date(now()-29*86400000).toISOString().slice(0,10)).total,
          totalViews:db.prepare('SELECT COALESCE(SUM(count),0) AS total FROM views').get().total,
          pages:db.prepare('SELECT path,SUM(count) AS views FROM views GROUP BY path ORDER BY views DESC').all(),
          days:db.prepare('SELECT day,SUM(count) AS views,(SELECT COUNT(*) FROM visitors v WHERE v.day=views.day) AS visitors FROM views GROUP BY day ORDER BY day DESC LIMIT 30').all(),
          comments:db.prepare('SELECT * FROM comments ORDER BY id DESC LIMIT 200').all()
        });
        if(path==='/api/admin/comments'&&req.method==='PATCH'){
          const data=await body(req);if(!Number.isSafeInteger(data.id)||!['approved','rejected','pending'].includes(data.status))fail('Invalid moderation action.');
          const result=db.prepare('UPDATE comments SET status=? WHERE id=?').run(data.status,data.id);if(!result.changes)fail('Comment not found.',404);return json(res,200,{ok:true});
        }
      }
      return json(res,404,{error:'Not found.'});
    }
    if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed.'});
    let file=resolve(root,'.'+decodeURIComponent(path));if(file!==root&&!file.startsWith(root+sep))fail('Not found.',404);
    if(existsSync(file)&&statSync(file).isDirectory())file=join(file,'index.html');
    if(!existsSync(file)||!statSync(file).isFile())fail('Not found.',404);
    const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.xml':'application/xml; charset=utf-8','.woff2':'font/woff2','.jpg':'image/jpeg','.jpeg':'image/jpeg','.json':'application/json','.txt':'text/plain; charset=utf-8'};
    res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');
    res.setHeader('Cache-Control',extname(file)==='.html'?'no-cache':'public, max-age=3600');
    if(path.startsWith('/admin')){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');}
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    res.end(req.method==='HEAD'?undefined:readFileSync(file));
   }catch(error){json(res,error.status||500,{error:error.status?error.message:'Server error. Please try again.'});}
  });
  server.on('close',()=>{if(backupTimer)clearInterval(backupTimer);db.close();});return server;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const project=resolve(dirname(fileURLToPath(import.meta.url)),'..');const state=resolve(process.env.COMMUNITY_STATE_DIR||join(project,'.local'));mkdirSync(state,{recursive:true,mode:0o700});
 const tokenPath=join(state,'admin-key.txt');if(!existsSync(tokenPath))writeFileSync(tokenPath,randomBytes(32).toString('hex'),{mode:0o600});
 const port=Number(process.env.PORT||4321);const origin=process.env.COMMUNITY_ORIGIN||`http://127.0.0.1:${port}`;
 const server=createCommunityServer({root:join(project,'dist'),dbPath:process.env.COMMUNITY_DB_PATH||join(state,'community.sqlite'),adminToken:process.env.COMMUNITY_ADMIN_KEY||readFileSync(tokenPath,'utf8').trim(),origin,backupDir:join(state,'backups'),trustProxy:process.env.TRUST_PROXY==='1'});
 server.listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Truva local preview: ${origin}\nAdmin: ${origin}/admin/community\nLocal admin key file: ${tokenPath}`));
}
