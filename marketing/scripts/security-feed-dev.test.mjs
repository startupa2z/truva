import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createSnapshotLoader} from './security-feed-dev.mjs';
test('local requests reuse a fresh snapshot and refresh expired data',async()=>{
 const p=join(await mkdtemp(join(tmpdir(),'hub-ttl-')),'feed.json');let calls=0;
 const stamp=Date.parse('2026-09-19T12:00:00Z');let time=stamp;
 await writeFile(p,JSON.stringify({fetchedAt:new Date(stamp).toISOString(),items:[]}));
 const load=createSnapshotLoader({outputPath:p,now:()=>time,ttl:1000,refresh:async()=>{calls++;return {items:['fresh']};}});
 assert.deepEqual((await load()).items,[]);assert.equal(calls,0);time+=1001;assert.deepEqual((await load()).items,['fresh']);assert.equal(calls,1);
});
test('simultaneous stale requests share one refresh',async()=>{
 const p=join(await mkdtemp(join(tmpdir(),'hub-lock-')),'feed.json');let calls=0,release;
 const wait=new Promise(r=>{release=r;});
 const load=createSnapshotLoader({outputPath:p,refresh:async()=>{calls++;await wait;return {items:[]};}});
 const a=load(),b=load();await new Promise(r=>setTimeout(r,20));release();await Promise.all([a,b]);assert.equal(calls,1);
});
