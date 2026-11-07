/* Illustrations vectorielles locales : huit lieux, sans bibliothèque ni réseau. */
((root)=>{
 'use strict';
 const drawings=[
  '<path d="M35 82 43 28h14l8 54M38 61h24M41 43h18M30 83h40M38 25h24v-9H38zM50 8v8M25 18 8 10m17 17L6 32m69-14 17-8M75 27l19 5"/>',
  '<path d="M50 9 80 22v25c0 23-30 41-30 41S20 70 20 47V22z"/><path d="M36 33h28v35H36zM42 41h16M42 49h16M42 57h10"/>',
  '<path d="M45 84V57M55 84V57M50 65 30 48M50 60l20-17M35 83l15-6 16 6"/><path d="M26 54C7 42 23 26 32 29c-2-23 33-26 36-4 25-2 26 31 7 34-6 14-23 11-25 2-12 12-28 5-24-7z"/>',
  '<path d="m25 79 48-53 9 8-48 53zM67 16l2-10m12 16 11-2M58 23l-9-7M19 34c-3-23 36-29 33-12-2 9-18 5-16 17 3 12-17 9-17-5z"/><circle cx="24" cy="26" r="3"/>',
  '<path d="M22 48h56v18c0 28-56 28-56 0zM15 53H8v15h15m54-15h15v15H77M18 43h64M35 33c-12-10 10-12 0-23m15 23c-12-10 10-12 0-23m15 23c-12-10 10-12 0-23"/>',
  '<path d="M31 16h38v24c0 25-38 25-38 0zM31 22H15v16c0 13 12 19 23 19m31-35h16v16c0 13-12 19-23 19M50 59v19M33 86h34M39 77h22"/><path d="m50 25 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/>',
  '<path d="M20 24c23 9 37 9 60 0v29c0 28-60 38-60 0zM31 47l13-4m12 0 13 4M35 64c9-9 21-9 30 0M38 16V7m24 9V7"/><path d="M10 38 3 34m87 4 7-4"/>',
  '<path d="M15 45c16-9 24-7 35 0 11-7 19-9 35 0v38c-16-9-24-7-35 0-11-7-19-9-35 0zM50 45v38M26 56l13 4m-13 8 13 4m22-12 13-4m-13 16 13-4"/><path d="M32 32c-11-22 6-31 18-18 12-13 29-4 18 18l-9-7-9 10-9-10z"/>',
 ];
 function graphic(index){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','4');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.innerHTML=drawings[Math.max(0,Math.min(7,index))];return svg;
 }
 function road(player,chapters){
  const header=document.getElementById('roadHeader');if(!header||!chapters.length)return;
  let index=chapters.findIndex((ch,i)=>!player.bossDefeated?.['boss_ch'+i]);if(index<0)index=7;
  let decor=header.querySelector('.destination-decor');if(!decor){decor=document.createElement('div');decor.className='destination-decor';header.prepend(decor);}
  if(decor.dataset.destination!==String(index)){decor.dataset.destination=String(index);decor.replaceChildren(graphic(index));}
  const complete=chapters[index].nodes.filter(node=>player.nodeProgress?.[node.id]).length;
  decor.style.opacity=String(.10+complete*.025);
  header.dataset.restored=String(!!player.bossDefeated?.['boss_ch'+index]);
 }
 root.Destinations={graphic,road};
})(window);
