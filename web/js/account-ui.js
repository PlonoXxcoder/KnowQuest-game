/* Interface du compte : aucun mot de passe enregistré, état de synchronisation réel. */
((root) => {
  'use strict';
  let service, mode = 'login', submitting = false, formVersion = 0, lastStatus;
  const byId = id => document.getElementById(id);
  function button(label, action, disabled = false) {
    const element = document.createElement('button'); element.type = 'button';
    element.className = 'account-button'; element.textContent = label;
    element.disabled = disabled; element.onclick = action; return element;
  }
  function open(next = 'login') {
    service.cancelAuth();
    mode = next === 'register' ? 'register' : 'login'; formVersion++;
    byId('amTitle').textContent = mode === 'register' ? 'Créer un compte' : 'Se connecter';
    byId('amConfirmWrap').hidden = mode !== 'register';
    byId('amPass').autocomplete = mode === 'register' ? 'new-password' : 'current-password';
    byId('amErr').textContent = ''; byId('authForm').reset();
    byId('amBtn').textContent = mode === 'register' ? 'Créer mon compte' : 'Se connecter';
    submitting = false; byId('amBtn').disabled = false;
    byId('authModal').classList.add('open');
    byId('amUser').focus();
  }
  function close() {
    formVersion++; service.cancelAuth(); submitting = false;
    byId('authModal').classList.remove('open'); byId('amPass').value = ''; byId('amPass2').value = '';
  }
  async function submit(event) {
    event?.preventDefault(); if (submitting) return;
    if (mode === 'register' && byId('amPass').value !== byId('amPass2').value) { byId('amErr').textContent = 'Les mots de passe ne correspondent pas.'; return; }
    const version = formVersion; submitting = true; byId('amBtn').disabled = true;
    byId('amErr').textContent = 'Connexion au serveur…';
    const result = await service.authenticate(mode,byId('amUser').value,byId('amPass').value);
    if (version !== formVersion) return;
    submitting = false; byId('amBtn').disabled = false;
    if (result.ok) close();
    else if (!result.cancelled) byId('amErr').textContent = result.error;
  }
  function render(state) {
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
  function mount(sync) {
    service = sync; byId('authForm').addEventListener('submit',submit);
    byId('amCancel').onclick = close;
    byId('authModal').addEventListener('click',event=>{if(event.target===byId('authModal'))close();});
    new MutationObserver(()=>{
      if (!byId('authModal').classList.contains('open') && (submitting || byId('amPass').value || byId('amPass2').value)) close();
    }).observe(byId('authModal'),{attributes:true,attributeFilter:['class']});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&(submitting||byId('authModal').classList.contains('open')))close();});
    // Démarrage, perte/rétablissement réseau et retour dans l'application.
    window.addEventListener('online',()=>service.sync());
    window.addEventListener('offline',()=>service.markDirty());
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')service.sync();});
    root.openAuthModal = open; root.closeAuthModal = close; root.kqSubmitAuth = submit;
    root.kqLogout = ()=>service.logout(); root.kqSyncNow = ()=>service.sync();
    render(service.view());
  }
  root.AccountUI = {mount,render};
})(window);
