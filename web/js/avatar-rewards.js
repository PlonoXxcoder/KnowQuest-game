/* Collection d'avatar : aperçu sans achat, objets acquis et souvenirs des chapitres. */
((root)=>{
  'use strict';
  const items=[
    {id:'voyage_phare',ico:'⚓',name:'Insigne du navigateur',color:'#167da1'},
    {id:'voyage_cite',ico:'🪶',name:'Plume des chroniques',color:'#a05b24'},
    {id:'voyage_jardin',ico:'🌿',name:'Emblème du jardin',color:'#24814a'},
    {id:'voyage_atelier',ico:'🖌️',name:'Signature de l’artiste',color:'#9556bc'},
    {id:'voyage_marche',ico:'🍴',name:'Insigne des saveurs',color:'#b45a30'},
    {id:'voyage_arene',ico:'🥇',name:'Médaille de l’arène',color:'#207c8d'},
    {id:'voyage_studio',ico:'🎵',name:'Note des échos',color:'#b34283'},
    {id:'voyage_atlas',ico:'💠',name:'Sceau du Grand Atlas',color:'#6951a8'},
  ].map((item,index)=>({...item,chapter:index,slot:'badge',desc:`Vaincre le gardien du chapitre ${index+1}`}));
  const selection=new Map();
  function unlock(profile){
    profile.ownedHats ||= [];profile.avatarStyle ||= {hat:null};
    const earned=items.filter(item=>profile.bossDefeated?.['boss_ch'+item.chapter]&&!profile.ownedHats.includes(item.id));
    earned.forEach(item=>profile.ownedHats.push(item.id));return earned;
  }
  function slot(item){return item?.slot||({cool:'eyes',scarf:'neck',backpack:'side',rainbow:'aura',star:'badge',cupid:'head'}[item?.id])||'head';}
  function style(host,item){host.classList.add('avatar-look');host.dataset.slot=slot(item);host.style.setProperty('--avatar-color',item?.color||'#8061ed');}
  function look(avatar,item){
    const host=document.createElement('div');style(host,item);host.setAttribute('aria-label',`${avatar}${item?' · '+item.name:''}`);
    const base=document.createElement('span');base.className='avatar-base';base.textContent=avatar;
    const accessory=document.createElement('span');accessory.className='avatar-item';accessory.textContent=item?.ico||'';accessory.setAttribute('aria-hidden','true');host.append(base,accessory);return host;
  }
  function profile(host,avatar,item){if(!host)return;style(host,item);host.setAttribute('aria-label',`Avatar${item?' · '+item.name:''}`);}
  function card(item,player,choose){
    const button=document.createElement('button');button.type='button';button.className='avatar-card';button.dataset.avatarSelect=item.id;
    const owned=player.ownedHats.includes(item.id),equipped=player.avatarStyle.hat===item.ico;
    button.dataset.owned=String(owned);button.dataset.equipped=String(equipped);
    const name=document.createElement('strong');name.textContent=item.name;
    const status=document.createElement('span');status.className='avatar-status';status.textContent=equipped?'✓ Porté':owned?'Débloqué':item.chapter!==undefined?`🔒 Chapitre ${item.chapter+1}`:`💎 ${item.cost}`;
    button.append(look(player.avatar,item),name,status);button.onclick=()=>choose(item.id);return button;
  }
  function render(host,player,catalog,equip){
    if(!host)return;host.replaceChildren();
    const available=[...items,...catalog.filter(item=>item.chapter===undefined&&player.ownedHats.includes(item.id))];
    const equipped=catalog.find(item=>item.ico===player.avatarStyle.hat);
    const selected=catalog.find(item=>item.id===selection.get(host.id))||equipped||items.find(item=>!player.ownedHats.includes(item.id))||items[0];
    selection.set(host.id,selected.id);
    const title=document.createElement('h3');title.textContent='Ta collection d’avatar';
    const count=document.createElement('p');count.className='avatar-collection-count';count.textContent=`${items.filter(item=>player.ownedHats.includes(item.id)).length}/8 souvenirs de l’aventure · ${player.ownedHats.length} accessoire${player.ownedHats.length>1?'s':''} possédé${player.ownedHats.length>1?'s':''}`;
    const preview=document.createElement('div');preview.className='avatar-fitting';preview.append(look(player.avatar,selected));
    const info=document.createElement('div');const name=document.createElement('strong');name.textContent=selected.name;
    const description=document.createElement('p');description.textContent=selected.desc;
    const action=document.createElement('button');action.className='avatar-equip';action.dataset.avatarEquip=selected.id;
    const owned=player.ownedHats.includes(selected.id);action.textContent=owned?(player.avatarStyle.hat===selected.ico?'Retirer':'Équiper'):'À gagner · chapitre '+(selected.chapter+1);action.disabled=!owned;action.onclick=()=>equip(selected.id);
    const hint=document.createElement('small');hint.textContent='Aperçu : ton avatar change seulement quand tu équipes un accessoire.';
    const enlarge=document.createElement('button');enlarge.type='button';enlarge.className='cq-btn cq-btn-try avatar-enlarge';enlarge.textContent='Voir en grand';
    enlarge.onclick=()=>root.CompanionRewardsUI?.open({itemId:selected.id,avatar:player.avatar,source:'collection'});
    info.append(name,description,action,hint,enlarge);preview.append(info);
    const grid=document.createElement('div');grid.className='avatar-collection-grid';
    available.forEach(item=>{const button=card(item,player,id=>{selection.set(host.id,id);render(host,player,catalog,equip);host.querySelector(`[data-avatar-select="${id}"]`)?.focus({preventScroll:true});});button.setAttribute('aria-pressed',String(item.id===selected.id));grid.append(button);});
    host.append(title,count,preview,grid);
  }
  function shop(host,player,catalog,activeEvent,buy){
    host.replaceChildren();const grid=document.createElement('div');grid.className='avatar-shop-grid';
    catalog.filter(item=>item.chapter===undefined&&(!item.event||item.event===activeEvent||player.ownedHats.includes(item.id))).forEach(item=>{
      const card=document.createElement('article');card.className='avatar-shop-card';card.append(look(player.avatar,item));
      const title=document.createElement('strong');title.textContent=item.name;const desc=document.createElement('p');desc.textContent=item.desc;
      const button=document.createElement('button');button.className='avatar-equip';button.id='buyHat_'+item.id;button.onclick=()=>buy(item.id);
      card.append(title,desc,button);grid.append(card);
    });host.append(grid);
  }
  const api={items,unlock,slot,look,profile,render,shop};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AvatarRewards=api;
})(typeof window!=='undefined'?window:globalThis);
