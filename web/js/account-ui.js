/* Interface du compte : aucun mot de passe enregistré, état de synchronisation réel. */
((root) => {
  'use strict';
  let service, options = {}, mode = 'login', submitting = false, formVersion = 0, lastStatus;
  let step = 0, fresh = false, required = false, backupAttempted = false;
  const byId = id => document.getElementById(id);
  function button(label, action, disabled = false) {
    const element = document.createElement('button'); element.type = 'button';
    element.className = 'account-button'; element.textContent = label;
    element.disabled = disabled; element.onclick = action; return element;
  }
  function needsAccount(state) {
    const p=options.getProfile?.() || {};
    return !state.username && (AccountSync.meaningful(p) || p.history?.length > 0 || Object.values(p.catStats || {}).some(s=>s.total > 0));
  }
  const steps = () => mode === 'login' ? ['user','password'] : fresh ? ['user','password','confirm','avatar'] : ['user','password','confirm'];
  function renderStep() {
    const list=steps(),current=list[step],last=step===list.length-1;
    const wrappers={user:'amUserWrap',password:'amPassWrap',confirm:'amConfirmWrap',avatar:'amAvatarWrap'};
    for (const [key,id] of Object.entries(wrappers)) {
      byId(id).hidden=key!==current;
      byId(id).querySelectorAll('input').forEach(input=>{input.disabled=key!==current;});
    }
    byId('amTitle').textContent=current==='avatar'?'Choisis ton compagnon.':mode==='register'?'Créer un compte':'Se connecter';
    byId('amDescription').textContent=({user:'Un pseudo pour toutes tes découvertes.',password:'Ton petit secret : six caractères minimum.',confirm:'Confirme ton mot de passe.',avatar:'Tu pourras le changer dans ton profil.'})[current];
    byId('amStep').textContent=`${mode==='register'?'Ton compte':'Connexion'} · ${step+1} / ${list.length}`;
    byId('amNext').hidden=last;byId('amBtn').hidden=!last;
    byId('amBtn').textContent=mode==='register'?'Créer mon compte':'Se connecter';
    byId('amBack').hidden=step===0;byId('amCancel').hidden=required;
    byId('amRequired').hidden=!required;byId('amSwitch').disabled=submitting;
    byId('amSwitch').textContent=mode==='register'?'Déjà un compte ? Se connecter':'Créer un compte';
    const input=byId(wrappers[current]).querySelector('input');if(input)input.focus();
    else root.OnboardingUI?.resetGaze();
  }
  function open(next = 'login') {
    service.cancelAuth();
    mode = next === 'register' ? 'register' : 'login'; formVersion++;
    required=needsAccount(service.view());fresh=!AccountSync.meaningful(options.getProfile?.() || {});
    const app=document.querySelector('.app');if(app)app.inert=required;
    step=0;
    byId('amPass').autocomplete = mode === 'register' ? 'new-password' : 'current-password';
    byId('amErr').textContent = ''; byId('authForm').reset();
    if(required)byId('amUser').value=(options.getProfile?.().name || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,20);
    submitting = false; byId('amBtn').disabled = false;byId('amBack').disabled=false;
    byId('authModal').classList.add('open');
    root.OnboardingUI?.resetAuth();renderStep();
  }
  function close(force = false) {
    if(required&&!force)return false;
    formVersion++; service.cancelAuth(); submitting = false;
    byId('authModal').classList.remove('open'); byId('amPass').value = ''; byId('amPass2').value = '';
    root.OnboardingUI?.resetGaze();return true;
  }
  function validate(current) {
    if(current==='user'&&!/^[a-zA-Z0-9_-]{3,20}$/.test(byId('amUser').value.trim()))return 'Pseudo : 3 à 20 lettres, chiffres, - ou _.';
    if(current==='password'&&byId('amPass').value.length<6)return 'Mot de passe : 6 caractères minimum.';
    if(current==='confirm'&&byId('amPass').value!==byId('amPass2').value)return 'Les mots de passe ne correspondent pas.';
    return '';
  }
  function advance() {
    if(submitting)return;
    const error=validate(steps()[step]);byId('amErr').textContent=error;if(error)return;
    if(step===steps().length-1){submit();return;}
    step++;renderStep();
  }
  async function submit(event) {
    event?.preventDefault(); if (submitting) return;
    if(step!==steps().length-1){advance();return;}
    if (mode === 'register' && byId('amPass').value !== byId('amPass2').value) { byId('amErr').textContent = 'Les mots de passe ne correspondent pas.'; return; }
    const version = formVersion; submitting = true; byId('amBtn').disabled = true;
    byId('amBack').disabled=true;byId('amSwitch').disabled=true;
    byId('amErr').textContent = 'Connexion au serveur…';
    const result = await service.authenticate(mode,byId('amUser').value,byId('amPass').value);
    if (version !== formVersion) return;
    submitting = false; byId('amBtn').disabled = false;
    byId('amBack').disabled=false;byId('amSwitch').disabled=false;
    if (result.ok) { required=needsAccount(service.view());close(true);if(service.view().conflict)options.showProfile?.(); }
    else if (!result.cancelled) byId('amErr').textContent = result.error;
  }
  function render(state) {
    required=needsAccount(state);
    const app=document.querySelector('.app');if(app)app.inert=required;
    if(required){
      if(!backupAttempted){backupAttempted=true;options.backup?.();}
      if(!byId('authModal').classList.contains('open'))open(state.status==='expired'?'login':'register');
      else if(state.status==='expired'&&lastStatus!=='expired')open('login');
    }
    byId('amRequired').hidden=!required;byId('amCancel').hidden=required;
    const host = byId('accountBox'); if (!host) return;
    host.replaceChildren(); const title = document.createElement('p'); title.className = 'account-name';
    title.textContent = state.username ? '☁️ Connecté : ' + state.username : 'Retrouve ta progression sur tes appareils'; host.append(title);
    const status = document.createElement('p'); status.id = 'accountStatus'; status.setAttribute('role','status'); status.textContent = state.message; host.append(status);
    const actions = document.createElement('div'); actions.className = 'account-actions';
    if (!state.username) actions.append(button('Se connecter',()=>open('login')),button('Créer un compte',()=>open('register')));
    else {
      if (state.lastSync) { const time = document.createElement('p'); time.className = 'account-time'; time.textContent = 'Dernier échange réussi : ' + new Date(state.lastSync).toLocaleString('fr-FR'); host.append(time); }
      const busy = ['checking','syncing'].includes(state.status);
      if (state.conflict) {
        const comparison = document.createElement('div'); comparison.className = 'account-comparison';
        for (const [label,profile] of [['Cet appareil',state.conflict.local],['En ligne',state.conflict.remote]]) {
          const card = document.createElement('p'); card.textContent = `${label} : ${profile.name} · niveau ${profile.level} · ${profile.totalQ} réponses · ${profile.gems} gemmes`; comparison.append(card);
        }
        host.append(comparison);
        actions.append(button('Garder cet appareil',()=>service.sync('local'),busy),button('Utiliser la progression en ligne',()=>service.sync('cloud'),busy));
      } else actions.append(button('Synchroniser maintenant',()=>service.sync(),busy));
      actions.append(button('Se déconnecter',()=>service.logout()));
    }
    host.append(actions);
    if (state.status === 'conflict' && lastStatus !== 'conflict') root.showToast?.('☁️ Deux progressions à comparer dans ton profil.');
    lastStatus = state.status;
  }
  function mount(sync, config = {}) {
    service = sync;options=config;byId('authForm').addEventListener('submit',submit);
    byId('amCancel').onclick = ()=>close();
    byId('amNext').onclick=advance;
    byId('amBack').onclick=()=>{if(!submitting&&step>0){step--;byId('amErr').textContent='';renderStep();}};
    byId('amSwitch').onclick=()=>open(mode==='register'?'login':'register');
    byId('amExport').onclick=()=>options.exportProfile?.();
    byId('authModal').addEventListener('click',event=>{if(event.target===byId('authModal'))close();});
    new MutationObserver(()=>{
      if(required&&!byId('authModal').classList.contains('open')){byId('authModal').classList.add('open');return;}
      if (!byId('authModal').classList.contains('open') && (submitting || byId('amPass').value || byId('amPass2').value)) close();
    }).observe(byId('authModal'),{attributes:true,attributeFilter:['class']});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&(submitting||byId('authModal').classList.contains('open'))){if(required){event.preventDefault();event.stopImmediatePropagation();}else close();}},true);
    // Démarrage, perte/rétablissement réseau et retour dans l'application.
    window.addEventListener('online',()=>service.sync());
    window.addEventListener('offline',()=>service.markDirty());
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')service.sync();});
    root.openAuthModal = open; root.closeAuthModal = ()=>close(); root.kqSubmitAuth = submit;
    root.kqLogout = ()=>service.logout(); root.kqSyncNow = ()=>service.sync();
    render(service.view());
  }
  root.AccountUI = {mount,render,registrationAvatar:()=>mode==='register'&&fresh?root.OnboardingUI?.avatar('auth'):null};
})(window);
