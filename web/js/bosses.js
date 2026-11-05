/* Gardiens : règles de combat, présentation et effets visuels.
 * Les identifiants boss_ch0…7 restent ceux des sauvegardes existantes. */
((root) => {
  'use strict';
  const chapters = [
    { name:'Gardien de la Brume', ico:'🌫️', hp:4, pool:['easy','medium'], power:'none', timerSec:0, color:'#167da1', rule:'4 bonnes réponses dissipent la brume. Prends ton temps.' },
    { name:'Sentinelle des Archives', ico:'🛡️', hp:5, pool:['easy','medium'], power:'none', timerSec:0, color:'#a05b24', rule:'Retrouve cinq repères de l’histoire pour ouvrir les archives.' },
    { name:'Gardien des Racines', ico:'🌳', hp:5, pool:['easy','medium'], power:'regen', timerSec:0, color:'#24814a', rule:'Il récupère 1 point tous les trois coups reçus, deux fois au maximum.' },
    { name:'Enchanteur des Couleurs', ico:'🎨', hp:5, pool:['medium'], power:'none', timerSec:0, color:'#9556bc', rule:'Cinq bonnes réponses rendent leurs couleurs aux œuvres. Sans chronomètre.' },
    { name:'Gardien du Banquet', ico:'🍲', hp:6, pool:['easy','medium'], power:'none', timerSec:0, color:'#b45a30', rule:'Six bonnes réponses sur les saveurs et les territoires ouvrent le banquet.' },
    { name:'Champion de l’Arène', ico:'🏆', hp:6, pool:['medium'], power:'timer', timerSec:20, color:'#207c8d', rule:'Tu disposes de 20 secondes par question. Un temps écoulé coûte une vie de combat.' },
    { name:'Maître des Échos', ico:'🎭', hp:6, pool:['medium','hard'], power:'feed', timerSec:0, color:'#b34283', rule:'Une erreur lui rend 1 point de vie, sans dépasser son maximum.' },
    { name:'Gardien de l’Oubli', ico:'🐉', hp:8, pool:['medium','hard'], power:'final', timerSec:0, color:'#6951a8', questions:14, rule:'Deux phases : il se régénère d’abord ; à mi-vie, chaque erreur lui rend 1 point.' },
  ].map(boss => ({ questions:10, xp:200, gems:100, ...boss }));
  const legendary = { hp:12, questions:15, timerSec:15, xp:300, gems:150 };
  const forChapter = index => chapters[Math.max(0,Math.min(chapters.length-1,index))];
  const rewardText = (boss,legend=false) => `+${boss.xp} XP · +${boss.gems} 💎 · ${legend?'Titre exclusif':'Accessoire avatar · Page restaurée · Fiche Atlas si disponible'}`;

  // Une seule résolution pour une erreur comme pour un temps écoulé.
  function turn(state,correct) {
    let effect=correct?'hit':'attack', message='';
    const power=state.bossPower;
    if(correct){
      state.duelAiHP=Math.max(0,state.duelAiHP-1);
      state.bossHits=(state.bossHits||0)+1;
      const regen=power==='regen'||(power==='final'&&(state.bossPhase||1)===1);
      if(regen&&state.duelAiHP>0&&state.bossHits%3===0&&(state.bossHeals||0)<2){
        state.duelAiHP=Math.min(state.bossMaxHP,state.duelAiHP+1);
        state.bossHeals=(state.bossHeals||0)+1;
        effect='power';message=power==='final'?'Brume protectrice : +1 point de vie':'Racines protectrices : +1 point de vie';
      }
      if(power==='final'&&(state.bossPhase||1)===1&&state.duelAiHP>0&&state.duelAiHP<=Math.ceil(state.bossMaxHP/2)){
        state.bossPhase=2;effect='phase';message='Phase 2 · Chaque erreur lui rend 1 point de vie';
      }
    }else{
      state.duelPlayerHP=Math.max(0,state.duelPlayerHP-1);
      if(power==='feed'||(power==='final'&&state.bossPhase===2)){
        const before=state.duelAiHP;
        state.duelAiHP=Math.min(state.bossMaxHP,state.duelAiHP+1);
        if(state.duelAiHP>before){effect='power';message='Écho de l’erreur : le gardien récupère 1 point';}
      }
    }
    return {effect,message};
  }

  // Une scène légère : aucun délai imposé avant de répondre.
  function scene(state,enter=false) {
    let host=document.getElementById('bossScene');
    if(state.mode!=='boss'){host?.remove();return;}
    if(!host){host=document.createElement('section');host.id='bossScene';host.className='boss-scene';document.getElementById('duelBar').after(host);}
    host.style.setProperty('--guardian-color',state.bossColor||'#6951a8');
    host.replaceChildren();
    const avatar=document.createElement('div');avatar.className='boss-avatar';avatar.textContent=state.bossIco;avatar.setAttribute('aria-hidden','true');
    const info=document.createElement('div');const name=document.createElement('strong');name.textContent=state.bossName;
    const note=document.createElement('p');note.id='bossSceneNote';note.setAttribute('aria-live','polite');
    note.textContent=state.legend?`Phase ${state.idx<5?1:state.idx<10?2:3}/3 · 12 coups pour gagner`:
      state.bossPower==='final'?`Phase ${state.bossPhase||1}/2 · ${state.bossPhase===2?'Les erreurs le soignent':'Régénération limitée'}`:
      state.bossTimerSec?`${state.bossTimerSec} secondes par question`:'Bonne réponse : −1 point au gardien';
    info.append(name,note);host.append(avatar,info);
    if(enter)animate('enter');
  }
  function animate(effect,message='') {
    const host=document.getElementById('bossScene');if(!host)return;
    host.dataset.effect=effect;
    const avatar=host.querySelector('.boss-avatar');avatar.style.animation='none';void avatar.offsetWidth;avatar.style.animation='';
    if(message)document.getElementById('bossSceneNote').textContent=message;
  }
  function result(state,receipt,conclusion) {
    document.getElementById('bossOutcome')?.remove();
    const host=document.createElement('section');host.id='bossOutcome';host.className='boss-outcome';
    host.dataset.won=String(state.duelAiHP<=0);host.style.setProperty('--guardian-color',state.bossColor||'#6951a8');
    const avatar=document.createElement('div');avatar.className='boss-avatar';avatar.textContent=state.bossIco;
    const title=document.createElement('strong');title.textContent=state.duelAiHP<=0?(state.legend?'Défi mensuel remporté !':'La page retrouve ses couleurs !'):'Le gardien attend ta revanche';
    const text=document.createElement('p');text.textContent=state.duelAiHP<=0?conclusion:'Tes étapes restent acquises. Tes trois vies de combat seront rétablies au prochain essai.';
    const note=document.createElement('small');note.textContent=receipt?.awarded?'Récompense de première victoire reçue.':state.duelAiHP<=0?'Récompense déjà reçue.':'Les cœurs de l’histoire sont conservés.';
    host.append(avatar,title,text,note);
    if(receipt?.awarded&&receipt.avatar){
      const reward=document.createElement('div');reward.className='avatar-unlocked';reward.textContent=`${receipt.avatar.ico} ${receipt.avatar.name} débloqué !`;
      const equip=document.createElement('button');equip.className='avatar-equip';equip.textContent='Équiper sur mon avatar';
      equip.onclick=()=>{root.buyOrEquipHat(receipt.avatar.id);equip.textContent='Équipé ✓';equip.disabled=true;};reward.append(equip);host.append(reward);
    }
    document.getElementById('btnResContinue').before(host);
  }
  const api={chapters,legendary,forChapter,rewardText,turn,scene,animate,result};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Bosses=api;
})(typeof window!=='undefined'?window:globalThis);
