import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createCommunityServer} from './community.mjs';

test('persistent counts, moderation, origin and authorization boundaries',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'truva-test-'));const root=join(dir,'dist');
 mkdirSync(join(root,'blog','test'),{recursive:true});
 writeFileSync(join(root,'index.html'),'home');writeFileSync(join(root,'blog','test','index.html'),'article');
 const options={root,dbPath:join(dir,'test.sqlite'),adminToken:'test-only-long-admin-token',origin:'http://127.0.0.1:4321'};
 let server=createCommunityServer(options);
 const start=async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));return 'http://127.0.0.1:'+server.address().port;};
 let base=await start();
 const call=(path,data,extra={})=>fetch(base+path,{method:data?'POST':'GET',headers:{Origin:options.origin,'Content-Type':'application/json',...extra.headers},...(data?{body:JSON.stringify(data)}:{}),...extra});
 try{
  assert.equal((await (await call('/health')).json()).status,'ok');
  const event={path:'/blog/test',eventId:'test-event-123456789',visitorId:'test-visitor-123456789'};
  assert.equal((await (await call('/api/views',event)).json()).views,1);
  assert.equal((await (await call('/api/views',event)).json()).views,1);
  assert.equal((await call('/api/views',{...event,path:'/missing'})).status,400);
  assert.equal((await call('/api/views',{...event,visitorId:'bad'})).status,400);
  assert.equal((await call('/api/views',event,{headers:{Origin:'https://evil.example','Content-Type':'application/json'}})).status,403);
  assert.equal((await call('/api/admin/overview')).status,401);
  assert.equal((await call('/api/admin/session',{token:'wrong'})).status,401);
  const comment={slug:'/blog/test',name:'Test reader',body:'A practical test comment <script>alert(1)</script>',website:''};
  assert.equal((await call('/api/comments',comment)).status,202);
  assert.equal((await (await call('/api/comments?slug=/blog/test')).json()).comments.length,0);
  const login=await call('/api/admin/session',{token:options.adminToken});
  const cookie=login.headers.get('set-cookie').split(';')[0];
  assert.match(login.headers.get('set-cookie'),/HttpOnly/);
  const headers={Cookie:cookie,Origin:options.origin,'Content-Type':'application/json'};
  const overview=await (await call('/api/admin/overview',null,{headers})).json();
  assert.equal(overview.visitorsToday,1);assert.equal(overview.visitors30Days,1);assert.equal(overview.days[0].visitors,1);assert.equal(overview.totalViews,1);assert.equal(overview.comments[0].status,'pending');
  const id=overview.comments[0].id;
  assert.equal((await call('/api/admin/comments',{id,status:'approved'},{method:'PATCH',headers})).status,200);
  assert.equal((await (await call('/api/comments?slug=/blog/test')).json()).comments[0].body,comment.body);
  await call('/api/admin/comments',{id,status:'rejected'},{method:'PATCH',headers});
  assert.equal((await (await call('/api/comments?slug=/blog/test')).json()).comments.length,0);
  assert.equal((await call('/api/comments',{...comment,website:'bot'})).status,400);
  assert.equal((await call('/api/comments',{...comment,body:'short'})).status,400);
  await new Promise(r=>server.close(r));server=createCommunityServer(options);base=await start();
  assert.equal((await (await call('/api/views',event)).json()).views,1);
  assert.equal((await call('/api/admin/overview',null,{headers})).status,401);
  for(let i=0;i<5;i++)await call('/api/comments',comment);
  assert.equal((await call('/api/comments',comment)).status,429);
 }finally{await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});}
});

test('distinct browser counts, retention and daily backup survive reopening',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'truva-visitors-')),root=join(dir,'dist');mkdirSync(root);writeFileSync(join(root,'index.html'),'home');writeFileSync(join(root,'legacy.html'),'legacy');
 let clock=Date.UTC(2026,8,19);const options={root,dbPath:join(dir,'data.sqlite'),backupDir:join(dir,'backups'),adminToken:'isolated-test-key',origin:'http://localhost',now:()=>clock};
 let server;let base;
 const open=async()=>{server=createCommunityServer(options);await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;};
 const post=(path,data)=>fetch(base+path,{method:'POST',headers:{Origin:options.origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
 const stats=async()=>{const r=await post('/api/admin/session',{token:options.adminToken});return (await fetch(base+'/api/admin/overview',{headers:{Cookie:r.headers.get('set-cookie').split(';')[0]}})).json();};
 await open();
 try{
  await post('/api/views',{path:'/',eventId:'event-one-123456789',visitorId:'browser-one-123456789'});
  await post('/api/views',{path:'/legacy.html',eventId:'event-two-123456789',visitorId:'browser-one-123456789'});
  assert.equal((await stats()).visitorsToday,1);assert.equal((await stats()).totalViews,2);
  await post('/api/views',{path:'/',eventId:'event-three-123456789',visitorId:'browser-two-123456789'});
  assert.equal((await stats()).visitors30Days,2);
  await new Promise(r=>server.close(r));await open();assert.equal((await stats()).visitors30Days,2);
  clock+=31*86400000;
  await post('/api/views',{path:'/',eventId:'event-four-123456789',visitorId:'browser-new-123456789'});
  assert.equal((await stats()).visitors30Days,1);assert.equal((await stats()).totalViews,4);
  await new Promise(r=>server.close(r));await open();
  const {DatabaseSync}=await import('node:sqlite');const {readdirSync}=await import('node:fs');const files=readdirSync(options.backupDir);assert.equal(files.length,1);
  const backup=new DatabaseSync(join(options.backupDir,files[0]),{readOnly:true});assert.equal(backup.prepare('SELECT SUM(count) AS n FROM views').get().n,4);backup.close();
 }finally{await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});}
});
