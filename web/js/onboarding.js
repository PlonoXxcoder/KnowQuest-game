/* Présentation du premier lancement : avatars, étapes invité et regard de la mascotte. */
((root)=>{
  'use strict';
  let options={},avatars=[],pointer=null,frame=0;
  const selected={guest:'🦁',auth:'🦁'},timers=new Map();
  const names=['Lion','Renard','Aigle','Dragon','Dauphin','Papillon','Ours','Hibou','Requin','Tigre'];
  const byId=id=>document.getElementById(id);
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='reduced';
  const birds=()=>['mascotOnboard','mascotAuth'].map(byId).filter(Boolean);
  function point(bird,p){
    if(!bird.getClientRects().length)return;
    const r=bird.getBoundingClientRect(),dx=p.x-r.left-r.width/2,dy=p.y-r.top-r.height*.43,d=Math.max(1,Math.hypot(dx,dy));
    bird.querySelectorAll('.m-pupil').forEach(eye=>eye.style.transform=`translate(${(dx/d*3.5).toFixed(2)}px,${(dy/d*2.8).toFixed(2)}px)`);
  }
  function reset(bird){
    clearTimeout(timers.get(bird));timers.delete(bird);bird.getAnimations().forEach(a=>a.cancel());bird.dataset.mood='pointer';
    bird.querySelectorAll('.m-pupil').forEach(eye=>eye.style.transform='translate(0px,0px)');
    if(pointer&&!reduced())point(bird,pointer);
  }
  function privacy(active){
    birds().forEach(bird=>{
      reset(bird);if(!active)return;bird.dataset.mood='privacy';
      bird.querySelectorAll('.m-pupil').forEach(eye=>eye.style.transform='translate(-3.5px,-2.8px)');
    });
  }
  function approve(slot,preview){
    const bird=byId(slot==='auth'?'mascotAuth':'mascotOnboard');if(!bird)return;
    reset(bird);bird.dataset.mood='avatar';const r=preview.getBoundingClientRect();point(bird,{x:r.left+r.width/2,y:r.top+r.height/2});
    if(!reduced())bird.animate([{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(4px) rotate(6deg)'},{transform:'translateY(0) rotate(0deg)'}],{duration:550,easing:'ease-in-out'});
    timers.set(bird,setTimeout(()=>reset(bird),1500));
  }
  function drawAvatars(slot){
    const prefix=slot==='auth'?'am':'ob',grid=byId(prefix+'AvGrid');if(!grid)return;
    grid.replaceChildren();
    avatars.forEach((emoji,index)=>{
      const b=document.createElement('button');b.type='button';b.className='av-opt';b.textContent=emoji;b.setAttribute('aria-label',names[index]||'Avatar '+(index+1));
      b.onclick=()=>select(slot,emoji,true);grid.append(b);
    });
    select(slot,selected[slot],false);
  }
  function select(slot,emoji,animate){
    if(!avatars.includes(emoji))emoji=avatars[0]||'🦁';selected[slot]=emoji;
    const prefix=slot==='auth'?'am':'ob',grid=byId(prefix+'AvGrid'),preview=byId(prefix+'AvatarPreview'),name=names[avatars.indexOf(emoji)]||'Compagnon';
    if(!grid||!preview)return;
    [...grid.children].forEach(b=>{const active=b.textContent===emoji;b.classList.toggle('sel',active);b.setAttribute('aria-pressed',String(active));});
    preview.textContent=emoji;preview.setAttribute('aria-label',name);byId(prefix+'AvatarName').textContent=name;
    if(animate){
      if(!reduced()){
        preview.getAnimations().forEach(a=>a.cancel());preview.animate([{transform:'scale(.88)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:300,easing:'ease-out'});
        const tile=[...grid.children].find(b=>b.textContent===emoji);tile.animate([{transform:'translateY(0)'},{transform:'translateY(-4px)'},{transform:'translateY(0)'}],{duration:260});
      }
      approve(slot,preview);
    }
  }
  function show(screen){
    for(const id of ['obWelcome','obGuestName','obGuestAvatar'])byId(id).hidden=id!==screen;
    birds().forEach(reset);
    if(screen==='obGuestName')byId('obName').focus();
  }
  function mount(config){
    options=config;
    selected.guest=selected.auth=options.getProfile().avatar||avatars[0]||'🦁';
    drawAvatars('guest');drawAvatars('auth');
    root.renderMascot('mascotOnboard','idle');root.renderMascot('mascotAuth','idle');
    birds().forEach(b=>b.classList.add('onboarding-mascot'));
    byId('obName').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();guestAvatar();}});
    byId('obName').addEventListener('input',()=>byId('obError').textContent='');
    document.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch'||reduced())return;
      pointer={x:event.clientX,y:event.clientY};if(frame)return;
      frame=requestAnimationFrame(()=>{frame=0;if(pointer)birds().forEach(b=>{if(!b.dataset.mood||b.dataset.mood==='pointer')point(b,pointer);});});
    },{passive:true});
    document.addEventListener('pointerleave',()=>{pointer=null;cancelAnimationFrame(frame);frame=0;birds().forEach(b=>{if(!b.dataset.mood||b.dataset.mood==='pointer')reset(b);});});
    document.addEventListener('focusin',event=>{if(event.target.matches('#authForm input[type="password"]'))privacy(true);});
    document.addEventListener('focusout',event=>{if(event.target.matches('#authForm input[type="password"]'))queueMicrotask(()=>privacy(document.activeElement.matches('#authForm input[type="password"]')));});
    const stopMotion=()=>{
      if(!reduced())return;
      cancelAnimationFrame(frame);frame=0;
      privacy(document.activeElement.matches('#authForm input[type="password"]'));
      document.querySelectorAll('.onboarding-preview [role="img"],.onboarding-avatars button').forEach(el=>el.getAnimations().forEach(a=>a.cancel()));
    };
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',stopMotion);
    new MutationObserver(stopMotion).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
  }
  function guestAvatar(){
    if(!byId('obName').value.trim()){byId('obError').textContent='Choisis un pseudo pour continuer.';byId('obName').focus();return;}
    show('obGuestAvatar');
  }
  root.OnboardingUI={mount,prepareAvatars:list=>{avatars=[...list];},showGuest:()=>show('obGuestName'),welcome:()=>show('obWelcome'),guestAvatar,
    finishGuest:()=>{if(!byId('obName').value.trim()){show('obGuestName');return;}options.finishGuest(selected.guest);},
    avatar:slot=>selected[slot],resetAuth:()=>{select('auth',options.getProfile().avatar||avatars[0],false);},resetGaze:()=>privacy(false)};
})(window);
