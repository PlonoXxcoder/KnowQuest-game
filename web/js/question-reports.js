/* Signalements centralisés : file durable locale -> Oracle -> notification
 * Discord côté serveur. Aucun secret Discord ni réglage joueur ici. */
((root)=>{
 'use strict';
 const KEY='kq_reports_outbox_v1',INSTALL='kq_reports_installation_v1';
 const ENDPOINT='https://g3238bf68f96ebf-knowquestdb.adb.eu-paris-1.oraclecloudapps.com/ords/kq_reports/v2/submit';
 const REASONS=new Set(['erreur','ambiguite','faute','doublon']);
 const cut=(value,n)=>String(value??'').trim().slice(0,n);
 function create(options){
  const storage=options.storage,fetcher=options.fetch||root.fetch.bind(root);
  const now=options.now||(()=>Date.now()),uuid=options.uuid||(()=>root.crypto.randomUUID());
  const online=options.online||(()=>root.navigator?.onLine!==false);
  const delay=options.setTimeout||setTimeout,cancel=options.clearTimeout||clearTimeout;
  const lock=options.lock||(fn=>root.navigator?.locks?root.navigator.locks.request(KEY,async()=>fn()):Promise.resolve().then(fn));
  let busy=null,timer=null,disposed=false,blockedToken=null;
  function read(){
   const raw=storage.getItem(KEY);if(!raw)return [];
   const data=JSON.parse(raw);if(!Array.isArray(data))throw Error('reports_storage_invalid');
   return data;
  }
  function write(data){storage.setItem(KEY,JSON.stringify(data));}
  function account(){try{const a=JSON.parse(storage.getItem('kq_account')||'null');return typeof a?.token==='string'&&a.token&&typeof a.username==='string'&&a.username?a:null;}catch{return null;}}
  function schedule(ms=30000){if(disposed||timer!==null)return;timer=delay(()=>{timer=null;flush().catch(()=>{});},ms);}
  async function request(entry,token){
   const controller=new AbortController(),timeout=delay(()=>controller.abort(),options.timeout||12000);
   // Le serveur retrouve le contenu canonique. Rien dans le transport ne peut
   // remplacer l'énoncé, la réponse, la source ou la catégorie.
   const report={clientId:entry.report.clientId,id:entry.report.id,raison:entry.report.raison,comment:entry.report.comment};
   if(entry.report.bank)report.bank=entry.report.bank;
   try{return await fetcher(options.endpoint||ENDPOINT,{method:'POST',body:JSON.stringify({token,report}),signal:controller.signal});}
   finally{cancel(timeout);}
  }
  async function drain(){
   if(!online())return;
   for(;;){
    const currentAccount=account();
    if(!currentAccount||currentAccount.token===blockedToken)return;
    // Une file en attente ne passe jamais au compte qui vient de se connecter.
    // Les anciennes entrées sans propriétaire sont conservées, sans envoi automatique.
    const owns=e=>e.owner===currentAccount.username;
    const item=await lock(()=>read().find(e=>owns(e)&&e.state==='pending'&&(!e.retryAt||e.retryAt<=now())));
    if(!item){if(await lock(()=>read().some(e=>owns(e)&&e.state==='pending')))schedule();return;}
    try{
     const response=await request(item,currentAccount.token);
     if(response.status===401){
      blockedToken=currentAccount.token;
      await lock(()=>{const queue=read(),entry=queue.find(e=>e.report.clientId===item.report.clientId);if(entry){entry.error='authentication_required';write(queue);}});
      options.onAuthRequired?.();return;
     }
     let data;try{data=await response.json();}catch{throw Error('invalid_response');}
     if(response.ok&&['accepted','duplicate'].includes(data?.status)&&Number.isInteger(data.reportId)&&data.reportId>0){
      await lock(()=>{const queue=read();write(queue.filter(e=>e.report.clientId!==item.report.clientId));});
      options.onDelivered?.({clientId:item.report.clientId,reportId:data.reportId});continue;
     }
     const permanent=[400,403,404,409,410,413,422].includes(response.status);
     await lock(()=>{const queue=read(),current=queue.find(e=>e.report.clientId===item.report.clientId);if(current){current.attempts=(current.attempts||0)+1;current.state=permanent?'rejected':'pending';current.error=permanent?'invalid_payload':'unavailable';current.retryAt=now()+(response.status===429?60000:30000);write(queue);}});
     if(permanent){options.onRejected?.(item.report.clientId);continue;}
     schedule(response.status===429?60000:30000);return;
    }catch{
     // Un accusé perdu ne provoque pas de doublon : le même clientId est repris.
     await lock(()=>{const queue=read(),current=queue.find(e=>e.report.clientId===item.report.clientId);if(current){current.attempts=(current.attempts||0)+1;current.error='unavailable';current.retryAt=now()+30000;write(queue);}});
     schedule();return;
    }
   }
  }
  function flush(){if(disposed)return Promise.resolve();if(busy)return busy;busy=drain().finally(()=>{busy=null;});return busy;}
  async function submit(input){
   const currentAccount=account();if(!currentAccount)throw Error('reports_auth_required');
   if(!REASONS.has(input?.raison)||!input.id)throw Error('invalid_report');
   const report={clientId:uuid(),id:cut(input.id,160),raison:input.raison,comment:cut(input.comment,1024)};
   if(['qcm','tf','scramble'].includes(input.bank))report.bank=input.bank;
   const clientId=await lock(()=>{
    const queue=read();
    const existing=queue.find(e=>e.owner===currentAccount.username&&e.state==='pending'&&['id','bank','raison','comment'].every(k=>e.report[k]===report[k]));
    if(existing)return existing.report.clientId;
    if(queue.length>=100)throw Error('reports_queue_full');
    queue.push({owner:currentAccount.username,report,state:'pending',attempts:0,retryAt:0});write(queue);return report.clientId;
   });
   await flush();
   return lock(()=>{const entry=read().find(e=>e.report.clientId===clientId);return {clientId,status:entry?.state==='rejected'?'rejected':entry?.error==='authentication_required'?'auth_required':entry?'queued':'sent'};});
  }
  return {submit,flush,canSubmit:()=>!!account(),pending:()=>read().map(e=>({...e,report:{...e.report}})),dispose(){disposed=true;if(timer!==null)cancel(timer);timer=null;}};
 }
 const api={create,KEY,INSTALL,ENDPOINT};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else{
  root.QuestionReports=api;root.questionReports=create({storage:root.localStorage,
   onDelivered:detail=>root.dispatchEvent(new CustomEvent('kq:report-delivered',{detail})),
   onRejected:clientId=>root.dispatchEvent(new CustomEvent('kq:report-rejected',{detail:{clientId}}))});
  const retry=()=>root.questionReports.flush().catch(()=>{});
  root.addEventListener('online',retry);root.addEventListener('storage',event=>{if(event.key===KEY||event.key==='kq_account')retry();});
  root.setTimeout(retry,1000);
 }
})(typeof window!=='undefined'?window:globalThis);
