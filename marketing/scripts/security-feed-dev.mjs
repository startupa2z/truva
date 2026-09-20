import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {refreshSecurityFeed} from './security-feed.mjs';

export function createSnapshotLoader({outputPath,refresh=refreshSecurityFeed,now=()=>Date.now(),ttl=30*60*1000}) {
  let inFlight;
  async function read(){try{return JSON.parse(await readFile(outputPath,'utf8'));}catch{return null;}}
  return async function load(){
    const cached=await read();
    const last=Date.parse(cached?.fetchedAt || '');
    if(Number.isFinite(last)&&last<=now()&&now()-last<ttl)return cached;
    if(!inFlight)inFlight=refresh({outputPath}).finally(()=>{inFlight=null;});
    return inFlight;
  };
}

export function securityFeedDev(){
  return {name:'truva-local-security-feed',configureServer(server){
    const load=createSnapshotLoader({outputPath:resolve(server.config.root,'public/security-feed.json')});
    server.middlewares.use(async(req,res,next)=>{
      if(req.url?.split('?')[0]!=='/security-feed.json'||req.method!=='GET')return next();
      try{const data=await load();res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
      catch{res.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({error:'Feed refresh unavailable; retain the last displayed snapshot.'}));}
    });
  }};
}
