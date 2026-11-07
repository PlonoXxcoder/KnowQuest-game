/* Compte Oracle : protocole existant, sauvegardes complètes et conflits explicites. */
((root) => {
  'use strict';
  // URL par défaut = production ; la candidate locale (port 8770) passe par le relais.
  const URL = root.KQ_ORACLE_URL || 'https://g3238bf68f96ebf-knowquestdb.adb.eu-paris-1.oraclecloudapps.com/ords/admin/kq_auth';
  const ACCOUNT = 'kq_account', META = 'kq_sync_v1', OWNER = 'kq_profile_owner';
  const EXCLUDED = new Set(['discordWebhook', 'reports', 'remindersEnabled', '_savedAt', 'cloudMistakeIds']);
  const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  function clean(value) {
    if (Array.isArray(value)) return value.map(clean);
    if (plain(value)) return Object.fromEntries(Object.entries(value).filter(([key]) => !['__proto__','constructor','prototype'].includes(key)).map(([key,item]) => [key,clean(item)]));
    return value;
  }
  function pack(profile) {
    const result = {};
    for (const [key,value] of Object.entries(profile)) if (!EXCLUDED.has(key)) result[key] = clean(value);
    result._mistakeIds = [...new Set([...(profile.cloudMistakeIds || []), ...(profile.mistakes || []).map(q => q.id)].filter(id => typeof id === 'string'))];
    result.mistakes = (profile.mistakes || []).filter(q => !q.id).map(clean);
    // Le point de comparaison doit correspondre exactement au JSON envoyé.
    return JSON.parse(JSON.stringify(result));
  }
  function unpack(input, findQuestion = () => null) {
    if (!plain(input)) throw Error('Sauvegarde en ligne invalide.');
    const result = clean(input);
    for (const key of EXCLUDED) delete result[key];
    for (const key of ['xp','gems','hearts','level','xpMax','totalQ','totalCorrect']) {
      if (result[key] !== undefined && (!Number.isFinite(result[key]) || result[key] < 0)) throw Error('Sauvegarde en ligne invalide : ' + key);
    }
    if (result.name !== undefined && typeof result.name !== 'string') throw Error('Pseudo en ligne invalide.');
    for (const key of ['nodeProgress','nodeStars','bossDefeated','storyRules','avatarStyle','powerups','srs','championship','honors','titles','talents','catStats','catStreak']) {
      if (result[key] !== undefined && !plain(result[key])) throw Error('Sauvegarde en ligne invalide : ' + key);
    }
    for (const key of ['ownedHats','atlas','achievements','mistakes','_mistakeIds','ownedRoadThemes','ownedOwlHats','history','recentlySeen','weeklyMissions','dailyMissions']) {
      if (result[key] !== undefined && !Array.isArray(result[key])) throw Error('Sauvegarde en ligne invalide : ' + key);
    }
    result.cloudMistakeIds = Array.isArray(result._mistakeIds) ? result._mistakeIds.filter(id => typeof id === 'string') : [];
    delete result._mistakeIds;
    result.mistakes = [...(Array.isArray(result.mistakes) ? result.mistakes : []), ...result.cloudMistakeIds.map(findQuestion).filter(Boolean)];
    return result;
  }
  function stable(value) {
    if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
    if (plain(value)) return '{' + Object.keys(value).filter(k => k !== '_savedAt').sort().map(k => JSON.stringify(k)+':'+stable(value[k])).join(',') + '}';
    return JSON.stringify(value);
  }
  function meaningful(p) {
    return !!(p.totalQ || p.totalCorrect || p.xp || p.gems || p.level > 1 || Object.keys(p.nodeProgress || {}).length ||
      p.ownedHats?.length || p.atlas?.length || p.ownedRoadThemes?.length || p.ownedOwlHats?.length ||
      Object.keys(p.bossDefeated || {}).some(key=>p.bossDefeated[key]) || Object.keys(p.srs || {}).length ||
      Object.keys(p.storyRules?.giftAttempts || {}).length || p.championship?.active || p.championship?.season > 1);
  }

  function create(options) {
    const {storage, getProfile, applyProfile} = options;
    const fetcher = options.fetch || root.fetch.bind(root);
    const online = options.online || (() => root.navigator?.onLine !== false), playing = options.playing || (() => false);
    const delay = options.delay ?? 30000;
    let account, meta, owner, timer, busy = null, conflict = null, generation = 0, authGeneration = 0, authBusy = false, authController;
    const controllers = new Set();
    let state = {status:'local', message:'Progression conservée sur cet appareil.', lastSync:0};
    function read(key) { try { return JSON.parse(storage.getItem(key) || 'null'); } catch (_) { return null; } }
    account = read(ACCOUNT); meta = read(META); owner = read(OWNER);
    if (!account || typeof account.username !== 'string' || typeof account.token !== 'string' || !account.token) account = null;
    if (account && meta?.username === account.username && Number.isFinite(meta.at)) state.lastSync = meta.at;
    function view() { return {...state, username:account?.username || null, conflict:conflict ? {local:conflict.localSummary, remote:conflict.remoteSummary} : null}; }
    function publish(status,message) { state = {...state,status,message}; options.onChange?.(view()); }
    function later() {
      if (!account || timer) return;
      timer = setTimeout(() => { timer = null; sync(); }, delay);
    }
    function cancelTimer() { clearTimeout(timer); timer = null; }
    function summary(p) { return {name:p?.name || 'Nouvelle progression',level:p?.level || 1,totalQ:p?.totalQ || 0,gems:p?.gems || 0}; }
    async function post(path, payload, auth = false) {
      const controller = new AbortController(); controllers.add(controller);
      if (auth) authController = controller;
      const timeout = setTimeout(() => controller.abort(), options.timeout ?? 12000);
      try {
        // Même encodage que la version Oracle existante (JSON dans body_text).
        const response = await fetcher(URL + path, {method:'POST', body:JSON.stringify(payload), signal:controller.signal});
        if (!response.ok) throw Error('Le serveur de compte est indisponible (' + response.status + ').');
        return await response.json();
      } catch (error) {
        if (error.name === 'TypeError') throw Error('Serveur de compte injoignable. Ta progression reste sur cet appareil.');
        if (error.name === 'SyntaxError') throw Error('Réponse du serveur illisible. Ta progression reste sur cet appareil.');
        throw error;
      } finally {
        clearTimeout(timeout); controllers.delete(controller);
        if (authController === controller) authController = null;
      }
    }
    function acknowledge(remote, local) {
      meta = {username:account.username, remote:remote === null ? null : stable(remote), local:stable(local), at:Date.now()};
      owner = account.username; conflict = null;
      try { storage.setItem(META,JSON.stringify(meta)); storage.setItem(OWNER,JSON.stringify(owner)); } catch (_) { /* Prochain démarrage : comparaison explicite à nouveau. */ }
      state.lastSync = meta.at;
      publish('synced','Progression synchronisée.');
    }
    function expire() { logout(); publish('expired','Session expirée. Reconnecte-toi ; ta progression locale est conservée.'); }
    function ask(local, remote) {
      conflict = {local:stable(local), remote:remote === null ? null : stable(remote), localSummary:summary(local),remoteSummary:summary(remote)};
      publish('conflict','Deux progressions différentes : choisis celle à conserver. Une copie locale sera gardée avant restauration.');
    }
    async function sync(choice) {
      if (choice && !['local','cloud'].includes(choice)) return false;
      if (!account || busy) return false;
      cancelTimer();
      if (options.canSync?.() === false) { publish('error','Vérifie la sauvegarde locale avant de synchroniser. Aucune progression n’a été envoyée.'); return false; }
      if (!online()) { publish('offline','Hors connexion : progression locale conservée.'); return false; }
      if (playing()) { publish('deferred','Synchronisation en attente de la fin de ta partie.'); return false; }
      const token = account.token, version = generation, run = {}; busy = run;
      const current = () => generation === version && account?.token === token;
      const local = pack(getProfile()), localText = stable(local);
      publish('checking','Vérification de la sauvegarde en ligne…');
      try {
        const response = await post('/sync-pull',{token});
        if (!current()) return false;
        if (response.reason === 'bad_token') { expire(); return false; }
        if (response.status !== 'ok') throw Error('Impossible de lire la sauvegarde en ligne.');
        if (!Object.hasOwn(response,'profile') || response.profile !== null && !plain(response.profile)) throw Error('Réponse de sauvegarde invalide. Aucune progression n’a été remplacée.');
        const remote = response.profile;
        if (remote !== null) unpack(remote); // Valider avant toute écriture locale ou distante.
        if (options.canSync?.() === false) { publish('error','La sauvegarde locale doit être vérifiée avant de synchroniser.'); return false; }
        if (playing() || stable(pack(getProfile())) !== localText) { publish('pending','Progression modifiée pendant la synchronisation ; nouvelle vérification prévue.'); later(); return false; }
        const remoteText = remote === null ? null : stable(remote);
        const base = meta?.username === account.username ? meta : null;
        const same = remoteText === localText;
        const localChanged = !base || base.local !== localText;
        const remoteChanged = !base || base.remote !== remoteText;
        const differentOwner = owner && owner !== account.username && meaningful(local);
        if (choice) {
          if (!conflict || conflict.local !== localText || conflict.remote !== remoteText) { ask(local,remote); return false; }
        } else if (!same && (differentOwner || remote && localChanged && remoteChanged && meaningful(local))) {
          ask(local,remote); return false;
        }
        if (same) { acknowledge(remote,local); return true; }
        if (choice === 'cloud' || !choice && remote && remoteChanged && (!localChanged || !meaningful(local))) {
          const restored = remote || {name:account.username};
          if (await applyProfile(restored,account.username) === false) throw Error('Restauration refusée : vérifie la sauvegarde locale.');
          if (!current()) return false;
          acknowledge(remote,pack(getProfile())); return true;
        }
        if (!choice && remote && !localChanged && !remoteChanged) { acknowledge(remote,local); return true; }
        const blob = {...local,_savedAt:Date.now()};
        if (new TextEncoder().encode(JSON.stringify(blob)).length > 28000) throw Error('Progression trop volumineuse pour ce serveur. Exporte-la pour la conserver ; aucune donnée n’a été retirée.');
        publish('syncing','Enregistrement de la progression en ligne…');
        const pushed = await post('/sync-push',{token,profile:blob});
        if (!current()) return false;
        if (pushed.reason === 'bad_token') { expire(); return false; }
        if (pushed.status !== 'ok') throw Error(pushed.reason === 'profile_too_large' ? 'Sauvegarde refusée : progression trop volumineuse. Exporte-la pour la conserver.' : 'Le serveur n’a pas enregistré la progression.');
        acknowledge(blob,local);
        if (stable(pack(getProfile())) !== localText) { publish('pending','De nouveaux progrès restent à synchroniser.'); later(); }
        return true;
      } catch (error) {
        if (current()) publish(online() ? 'error' : 'offline', error.name === 'AbortError' ? 'Le serveur met trop de temps à répondre. Progression locale conservée.' : error.message);
        return false;
      } finally { if (busy === run) busy = null; }
    }
    function markDirty() {
      if (!account) return;
      if (!busy && !conflict) publish(online() ? 'pending' : 'offline', online() ? 'De nouveaux progrès attendent leur synchronisation.' : 'Hors connexion : progression locale conservée.');
      if (!conflict) later();
    }
    function cancelAuth() { authGeneration++; authController?.abort(); authBusy = false; }
    async function authenticate(mode, username, password) {
      if (authBusy) return {ok:false,error:'Connexion déjà en cours.'};
      const user = username.trim().toLowerCase();
      if (!/^[a-z0-9_-]{3,20}$/.test(user)) return {ok:false,error:'Pseudo : 3 à 20 lettres, chiffres, - ou _.'};
      if (password.length < 6) return {ok:false,error:'Mot de passe : 6 caractères minimum.'};
      const version = ++authGeneration; authBusy = true;
      try {
        if (!online()) throw Error('Connexion Internet nécessaire pour se connecter.');
        const response = await post(mode === 'register' ? '/signup' : '/signin',{username:user,password},true);
        if (version !== authGeneration) return {ok:false,cancelled:true};
        const errors = {username_taken:'Ce pseudo est déjà pris.',bad_credentials:'Pseudo ou mot de passe incorrect.',rate_limited:'Trop de tentatives. Réessaie dans une minute.'};
        if (response.status !== 'ok' || typeof response.token !== 'string' || !response.token) throw Error(errors[response.reason] || 'Connexion refusée.');
        const next = {username:user,token:response.token};
        storage.setItem(ACCOUNT,JSON.stringify(next));
        generation++; cancelTimer(); busy = null;
        for (const controller of controllers) controller.abort();
        account = next; conflict = null; state.lastSync = 0;
        options.onLogin?.(user);
        publish('pending','Connecté. Vérification de la progression…');
        await sync();
        return {ok:true};
      } catch (error) { return version === authGeneration ? {ok:false,error:error.name === 'AbortError' ? 'Le serveur met trop de temps à répondre.' : error.message} : {ok:false,cancelled:true}; }
      finally { if (version === authGeneration) authBusy = false; }
    }
    function logout() {
      generation++; cancelAuth(); cancelTimer(); busy = null; conflict = null;
      for (const controller of controllers) controller.abort();
      account = null;
      try { storage.removeItem(ACCOUNT); } catch (_) {}
      publish('local','Déconnecté. Ta progression reste sur cet appareil.');
    }
    function resume() { if (account && !busy && ['deferred','pending','offline','error'].includes(state.status) && !playing()) return sync(); }
    return {view,authenticate,cancelAuth,sync,markDirty,logout,resume,boot:()=>account ? sync() : publish('local',state.message),destroy:()=>{generation++;cancelTimer();cancelAuth();for(const controller of controllers)controller.abort();}};
  }
  const api = {create,pack,unpack,stable,meaningful};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AccountSync = api;
})(typeof window === 'undefined' ? globalThis : window);
