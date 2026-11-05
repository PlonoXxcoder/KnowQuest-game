// Démarrage : dernière version publiée en ligne, sauvegarde du joueur conservée.
if ('serviceWorker' in navigator) {
  const controlledAtStart = !!navigator.serviceWorker.controller;
  const startedAt = Date.now();
  let reloading = false;
  const playing = () => !!document.querySelector('#scrQuiz.active');
  function refreshAtStart() {
    if (reloading || playing() || Date.now() - startedAt > 10000) return false;
    try {
      const previous = Number(sessionStorage.getItem('kq-update-reload') || 0);
      if (Date.now() - previous < 30000) return false;
      sessionStorage.setItem('kq-update-reload', String(Date.now()));
    } catch {}
    reloading = true; location.reload(); return true;
  }
  function showUpdateBanner() {
    if (document.getElementById('kqUpdateBanner')) return;
    const banner = document.createElement('div'); banner.id = 'kqUpdateBanner';
    banner.style.cssText = 'position:fixed;bottom:20px;left:12px;right:12px;max-width:550px;margin:auto;padding:14px;border-radius:14px;background:#241c40;color:white;z-index:99999;display:flex;align-items:center;gap:12px;font:700 13px system-ui';
    const text = document.createElement('span'); text.textContent = 'Une nouvelle version est prête. Recharge après ta partie.';
    const button = document.createElement('button'); button.textContent = 'Actualiser';
    button.onclick = () => { if (!playing() || confirm('Quitter la question en cours pour actualiser le jeu ?')) location.reload(); };
    banner.append(text, button); document.body.append(banner);
  }
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!controlledAtStart) return;
    if (!refreshAtStart()) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showUpdateBanner, {once:true});
      else showUpdateBanner();
    }
  });
  navigator.serviceWorker.register('sw.js', {updateViaCache:'none'}).then(registration => {
    if (registration.waiting) registration.waiting.postMessage({type:'SKIP_WAITING'});
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      if (worker) worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && registration.waiting) registration.waiting.postMessage({type:'SKIP_WAITING'});
      });
    });
    if (navigator.onLine) registration.update().catch(() => {});
  }).catch(error => console.info('Mode hors ligne :', error.message));
}

    // ── Install PWA (bouton "Installer l'app") ──────────────────────────────
    let deferredInstallPrompt = null;

    function isRunningStandalone() {
      return window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      const btn = document.getElementById('installBtn');
      if (btn && !isRunningStandalone()) btn.classList.add('show');
    });

    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      const btn = document.getElementById('installBtn');
      if (btn) btn.classList.remove('show');
    });

    async function installApp() {
      const btn = document.getElementById('installBtn');
      if (!deferredInstallPrompt) {
        alert("L'installation n'est pas disponible pour le moment sur ce navigateur.");
        return;
      }
      btn.classList.remove('show');
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
    }

    function formatPlaytime(ms) {
      const totalMin = Math.floor((ms || 0) / 60000);
      const h = Math.floor(totalMin / 60), m = totalMin % 60;
      return h <= 0 ? `${m} min` : `${h} h ${m} min`;
    }
    function getFavoriteCategory() {
      let best = null, bestTotal = 0;
      Object.entries(P.catStats || {}).forEach(([cat, s]) => { if (s.total > bestTotal) { bestTotal = s.total; best = cat; } });
      return best;
    }
    function buildAccuracyCurveSVG() {
      const hist = (P.history || []).slice(-15);
      if (hist.length < 2) return `<div style="text-align:center;color:var(--muted);font-size:12px;font-weight:700;padding:14px">Joue quelques sessions pour voir ta courbe de précision !</div>`;
      const w = 280, h = 90, pad = 8;
      const pts = hist.map((entry, i) => ({
        x: pad + (i / (hist.length - 1)) * (w - pad * 2),
        y: pad + (1 - (entry.acc || 0) / 100) * (h - pad * 2)
      }));
      const pathD = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
      const dots = pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="var(--purple)"></circle>`).join('');
      return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:90px"><path d="${pathD}" fill="none" stroke="var(--purple)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
    }
    function renderPersonalDashboard() {
      const el = document.getElementById('personalDashboard'); if (!el) return;
      P.bestStreakEver = Math.max(P.bestStreakEver || 0, P.streakDays || 0);
      const favCat = getFavoriteCategory();
      const favLabel = favCat ? (CAT_LABELS[favCat] || favCat) : '—';
      el.innerHTML = `
    <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap">
      <div style="flex:1;min-width:100px;background:var(--bg);border:2px solid var(--border);border-radius:14px;padding:10px;text-align:center">
        <div style="font-size:20px;font-weight:900;color:var(--purple)">${formatPlaytime(P.totalPlayMs)}</div>
        <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase">Temps de jeu</div>
      </div>
      <div style="flex:1;min-width:100px;background:var(--bg);border:2px solid var(--border);border-radius:14px;padding:10px;text-align:center">
        <div style="font-size:20px;font-weight:900;color:var(--orange-d)">${favLabel}</div>
        <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase">Catégorie préférée</div>
      </div>
      <div style="flex:1;min-width:100px;background:var(--bg);border:2px solid var(--border);border-radius:14px;padding:10px;text-align:center">
        <div style="font-size:20px;font-weight:900;color:var(--green-d)">${P.bestStreakEver || 0} 🔥</div>
        <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase">Meilleure série</div>
      </div>
      <div style="flex:1;min-width:100px;background:var(--bg);border:2px solid var(--border);border-radius:14px;padding:10px;text-align:center">
  <div style="font-size:20px;font-weight:900;color:var(--purple)">${P.bestInfiniteElo || 1000}</div>
  <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase">Meilleur Elo</div>
</div>
    </div>
    <div style="font-size:12px;font-weight:800;color:var(--muted);margin-bottom:4px">Précision — 15 dernières sessions</div>
    ${buildAccuracyCurveSVG()}`;
    }
