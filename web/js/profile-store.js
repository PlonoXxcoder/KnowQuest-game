/* Sauvegarde locale : validation, copie avant migration/import et conflits d'onglets. */
((root)=>{
  'use strict';
  const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  function clean(value){
    if(Array.isArray(value))return value.map(clean);
    if(plain(value)){const out={};for(const [key,item]of Object.entries(value))if(!['__proto__','constructor','prototype'].includes(key))out[key]=clean(item);return out;}
    return value;
  }
  function normalize(input,defaults){
    if(!plain(input))throw Error('Un profil JSON est attendu.');
    if(input.name!==undefined&&typeof input.name!=='string')throw Error('Le pseudo doit être un texte.');
    const data=clean(input),base=clean(defaults);
    function merge(fallback,saved){
      const out={...saved};
      for(const [key,value]of Object.entries(fallback)){
        if(Array.isArray(value))out[key]=Array.isArray(saved[key])?saved[key]:value;
        else if(plain(value))out[key]=merge(value,plain(saved[key])?saved[key]:{});
        else if(saved[key]===undefined||saved[key]===null&&value!==null)out[key]=value;
      }return out;
    }
    const profile=merge(base,data);
    for(const key of ['xp','gems','totalQ','totalCorrect','hearts','streak','streakDays','perfectCount'])if(!Number.isFinite(profile[key])||profile[key]<0)profile[key]=base[key]||0;
    for(const key of ['level','xpMax'])if(!Number.isFinite(profile[key])||profile[key]<1)profile[key]=base[key]||1;
    for(const [key,value]of Object.entries(profile.powerups||{}))if(!Number.isFinite(value)||value<0)profile.powerups[key]=0;
    profile.totalCorrect=Math.min(profile.totalCorrect,profile.totalQ);
    profile.name=profile.name.trim().slice(0,40);
    for(const key of ['ownedHats','atlas','achievements','ownedRoadThemes','ownedOwlHats'])profile[key]=[...new Set((profile[key]||[]).filter(value=>typeof value==='string'))];
    return profile;
  }
  function create(storage,key){
    let observed,blocked=false,lastSaved=null,error=null;
    const get=()=>storage.getItem(key);
    function read(){observed=get();return observed;}
    function backup(reason){
      const current=get();if(current===null)return;
      try { JSON.parse(current); } catch { storage.setItem(key+':damaged',current); return; } // Conserver la copie saine.
      storage.setItem(key+':backup',JSON.stringify({reason,at:new Date().toISOString(),profile:JSON.parse(current)}));
    }
    function write(profile,{replace=false}={}){
      try{
        const current=get();
        if(!replace&&(blocked||observed!==undefined&&current!==observed)){blocked=true;return {ok:false,conflict:true};}
        const raw=JSON.stringify(profile);storage.setItem(key,raw);observed=raw;blocked=false;lastSaved=new Date().toISOString();error=null;
        return {ok:true,at:lastSaved};
      }catch(e){error=e.message;return {ok:false,error};}
    }
    function load(defaults,migrate){
      try{
        const raw=read();if(!raw)return {profile:null};
        const parsed=JSON.parse(raw);const profile=migrate(normalize(parsed,defaults));
        if(JSON.stringify(profile)!==raw){backup('migration');const saved=write(profile);if(!saved.ok)return {profile,error:saved.error};}
        return {profile};
      }catch(e){
        blocked=true;error=e.message;
        try{if(observed)storage.setItem(key+':damaged',observed);}catch{}
        return {profile:null,error,damaged:true};
      }
    }
    function restore(){
      const saved=JSON.parse(storage.getItem(key+':backup')||'null');if(!saved?.profile)throw Error('Aucune copie précédente disponible.');
      const raw=JSON.stringify(saved.profile);storage.setItem(key,raw);observed=raw;blocked=false;return saved.profile;
    }
    return {read,write,load,backup,restore,status:()=>({blocked,lastSaved,error})};
  }
  const api={normalize,create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProfileStore=api;
})(typeof window!=='undefined'?window:globalThis);
