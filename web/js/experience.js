/* Navigation secondaire, accessibilité et repères de progression. Aucune monnaie ici. */
((root)=>{
  'use strict';
  function details(title,id){const host=document.createElement('details');host.id=id;host.className='experience-group';const label=document.createElement('summary');label.textContent=title;host.append(label);return host;}
  // Les cartes et titres de Jeux conservent leur présentation d'origine.
  function organizeModes() {}
  function profilePicker(avatars){
    const wardrobe=document.getElementById('avatarWardrobe');if(!wardrobe||document.getElementById('avatarCharacters'))return;
    const host=details('Changer de personnage','avatarCharacters'),grid=document.createElement('div');grid.className='experience-avatars';
    avatars.forEach(avatar=>{const button=document.createElement('button');button.type='button';button.textContent=avatar;button.setAttribute('aria-label','Choisir '+avatar);button.onclick=()=>root.setPlayerAvatar(avatar);grid.append(button);});host.append(grid);wardrobe.before(host);
  }
  function progress(player,road){
    const host=document.getElementById('roadWrap');if(!host)return;
    let link=document.getElementById('returnToCurrent');
    if(!link){link=document.createElement('button');link.id='returnToCurrent';link.className='experience-return';link.textContent='Revenir à mon étape';link.onclick=()=>document.querySelector('#nodesContainer .current')?.scrollIntoView({block:'center',behavior:document.documentElement.dataset.motion==='reduced'?'instant':'smooth'});host.before(link);}
    const label=document.getElementById('adventureRules');if(!label){const rules=details('Comment avance mon aventure ?','adventureRules');const p=document.createElement('p');p.textContent='Trois mauvaises réponses retirent un cœur dans les étapes. Un gardien a ses trois vies de combat, indépendantes. Termine les étapes puis bats le gardien pour restaurer une page. Les étoiles permettent de suivre tes meilleurs résultats.';rules.append(p);const choices=document.createElement('div');choices.className='experience-avatars';for(const [id,label]of [['easy','Facile'],['medium','Intermédiaire'],['hard','Difficile']]){const button=document.createElement('button');button.textContent=label;button.style.fontSize='13px';button.dataset.adventureDifficulty=id;button.onclick=()=>root.setAdventureDifficulty(id);choices.append(button);}rules.append(choices);document.getElementById('adventurePanel')?.after(rules);}
    document.querySelectorAll('[data-adventure-difficulty]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.adventureDifficulty===(player.adventureDifficulty||'easy'))));
    const unlocked=road.filter((c,index)=>!player.bossDefeated?.['boss_ch'+index]).length;
    const scroller=host.closest('.scr');
    const visibility=()=>{link.hidden=!road.length||!unlocked||scroller.scrollTop<300;};
    visibility();
    if(!scroller.dataset.returnBound){scroller.dataset.returnBound='true';scroller.addEventListener('scroll',visibility,{passive:true});}
    document.querySelectorAll('#avatarCharacters button').forEach(button=>button.setAttribute('aria-pressed',String(button.textContent===player.avatar)));
  }
  function accessible(){
    document.querySelectorAll('.mode-card[onclick],.srs-card[onclick],.ans-btn,.tf-btn').forEach(element=>{
      if(element.dataset.keyboardReady)return;element.dataset.keyboardReady='true';element.tabIndex=0;element.setAttribute('role','button');
      element.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();element.click();}});
    });
    for(const [id,label]of [['vStatus','Résultat de la réponse'],['storyGiftNotice','Cadeau surprise']]){const el=document.getElementById(id);if(el){el.setAttribute('aria-live','polite');el.setAttribute('aria-label',label);}}
  }
  function feedback(player,question){
    document.getElementById('revisionSchedule')?.remove();const entry=player.srs?.[question?.id];if(!entry)return;
    const note=document.createElement('p');note.id='revisionSchedule';note.className='experience-review-note';
    const date=new Date(entry.due+'T12:00:00');note.textContent=`Prochaine révision : ${date.toLocaleDateString('fr-FR')} · mémorisation ${entry.box}/5`;
    document.getElementById('vFact')?.after(note);
  }
  function boot(){organizeModes();accessible();document.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||document.querySelector('dialog[open]'))return;
    const modal=[...document.querySelectorAll('.modal-bg.open')].at(-1);modal?.classList.remove('open');
  });}
  document.addEventListener('DOMContentLoaded',boot,{once:true});
  root.Experience={organizeModes,profilePicker,progress,accessible,feedback};
})(window);
