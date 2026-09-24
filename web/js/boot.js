// KnowQuest — boot : service worker + installation PWA + bannière de mise à jour

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(reg => {
          console.log('Service Worker enregistré !', reg);
          // Nouveau service worker détecté : il attend (skipWaiting sur action
          // utilisateur) → on propose à l'utilisateur de recharger.
          reg.addEventListener('updatefound', () => {
            const nw = reg.installing;
            if (!nw) return;
            nw.addEventListener('statechange', () => {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateBanner();
              }
            });
          });
        })
        .catch(err => console.log('Erreur de Service Worker :', err));

      // ── Bannière « Nouvelle version disponible » ──────────────────────────
      let _updateReady = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Le nouveau SW prend le contrôle après SKIP_WAITING → on recharge
        // (une seule fois, et seulement si l'utilisateur a demandé la màj).
        if (_updateReady) location.reload();
      });

      function showUpdateBanner() {
        if (document.getElementById('kqUpdateBanner')) return;
        _updateReady = true;
        const b = document.createElement('div');
        b.id = 'kqUpdateBanner';
        b.style.cssText = 'position:fixed;bottom:max(16px, env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);background:#1a1a2e;color:#fff;padding:12px 18px;border-radius:16px;font-size:13px;font-weight:800;z-index:99999;display:flex;gap:12px;align-items:center;box-shadow:0 8px 24px rgba(0,0,0,0.35);white-space:nowrap';
        b.innerHTML = '<span>✨ Nouvelle version disponible</span>';
        const btn = document.createElement('button');
        btn.textContent = 'Recharger';
        btn.style.cssText = 'background:var(--purple,#7c5cfc);color:#fff;border:none;border-radius:10px;padding:8px 14px;font-weight:900;font-size:13px;cursor:pointer';
        btn.onclick = () => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
          } else {
            location.reload();
          }
        };
        b.appendChild(btn);
        document.body.appendChild(b);
      }
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
