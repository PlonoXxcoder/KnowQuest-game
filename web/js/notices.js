/* Annonces temporaires : une seule à la fois, après la bulle du compagnon.
 * Ne conserve aucune donnée de profil et n'accorde aucune récompense. */
((root)=>{
 'use strict';
 function create({render,remove,companionVisible,delay=setTimeout,cancel=clearTimeout}){
  const queue=[];let timer=null,visible=false,current=null;
  function advance(){
   timer=null;if(visible||!queue.length)return;
   if(companionVisible()){timer=delay(advance,200);return;}
   const item=queue.shift();current=item;visible=true;render(item.text);
   timer=delay(()=>{remove();visible=false;current=null;timer=null;advance();},item.duration);
  }
  return {show(text,duration=2500){queue.push({text:String(text),duration:Number.isFinite(duration)?Math.max(500,duration):2500});if(!visible&&timer===null)advance();},
   active:()=>visible,yieldToCompanion(){if(!visible)return;if(timer!==null)cancel(timer);queue.unshift(current);current=null;remove();visible=false;timer=delay(advance,200);},dispose(){if(timer!==null)cancel(timer);timer=null;queue.length=0;visible=false;remove();}};
 }
 function browser(){
  let element;
  return create({companionVisible:()=>!!document.querySelector('#companionBubble.show'),
   render(text){element=document.createElement('div');element.id='kqNotice';element.setAttribute('role','status');element.setAttribute('aria-atomic','true');
    element.style.cssText='position:fixed;top:max(12px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);width:max-content;max-width:calc(100vw - 24px);box-sizing:border-box;background:#1a1a2e;color:#fff;padding:10px 16px;border-radius:16px;font-size:14px;font-weight:900;line-height:1.4;text-align:center;z-index:9999;white-space:normal;overflow-wrap:anywhere;pointer-events:none;box-shadow:0 4px 20px #0004';element.textContent=text;document.body.appendChild(element);},
   remove(){element?.remove();element=null;}});
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={create};else root.GameNotices=browser();
})(typeof window!=='undefined'?window:globalThis);
