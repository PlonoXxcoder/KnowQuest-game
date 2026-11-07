/* Calculs de course indépendants du rendu et de la sauvegarde. */
((root)=>{
 'use strict';
 const tires={soft:{speed:1,wear:15},medium:{speed:.92,wear:10},hard:{speed:.85,wear:6},rain:{speed:.8,wear:9}};
 function order(drivers){return drivers.filter(driver=>!driver.out).slice().sort((a,b)=>b.progress-a.progress);}
 function drs(drivers,uses=1){const ranked=order(drivers),index=ranked.findIndex(driver=>driver.isPlayer);if(index<=0||uses<=0)return false;const gap=(ranked[index-1].progress-ranked[index].progress)*1.5;return gap>=0&&gap<1;}
 function gain({tire='medium',combo=0,remaining=0,duration=15,wear=0,safetyCar=false,development=0}){
   const speed=tires[tire]?.speed||tires.medium.speed;
   const time=Math.max(0,Math.min(1,remaining/Math.max(1,duration)));
   return (.07+(combo>=3?.02:0)+time*.02)*speed*(wear>=100?.5:1)*(safetyCar?1.6:1)*(1+.04*Math.max(0,Math.min(5,development)));
 }
 const api={tires,order,drs,gain};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RaceRules=api;
})(typeof window!=='undefined'?window:globalThis);
