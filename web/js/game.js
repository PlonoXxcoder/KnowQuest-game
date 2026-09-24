// KnowQuest — moteur de jeu (extrait de index.html, ne pas éditer en inline)

    // =====================================================
    // ===   KNOWQUEST V2.1 — ULTIMATE EDITION ENGINE   ===
    // =====================================================

    // ===== VARIABLES GLOBALES (DATA-DRIVEN) =====
    window.GEO_QB = [];
    window.HIST_QB = [];
    window.SCI_QB = [];
    window.ART_QB = [];
    window.CINEMA_QB = [];
    window.SPORT_QB = [];
    window.GASTRO_QB = [];
    window.MYTHO_QB = [];
    window.CHATEAUX_QB = [];
    window.LITT_QB = [];
    window.MIXED_QB = [];
    window.EXTENDED_QB = [];
    window.IMG_QB = [];
    window.TF_QB = [];
    window.SCRAMBLE_QB = [];
    window.FLASH_QB = [];
    window.ROAD = [];
    window.KQ_ROADMAP = null;
    window.ATLAS_CARDS = { geo: [], hist: [], sci: [], art: [], cinema: [], sport: [], gastro: [], mytho: [] };
    window.CHAINS = [];
    // ===== SUCCÈS =====
    // Chaque succès est évalué sans argument sur P ; débloqué une fois pour toutes.
    window.ACHIEVEMENTS = [
      { id: 'premier_pas',   ico: '🎬', name: 'Premier pas',          desc: 'Terminer une première session',
        check: () => (P.history || []).length >= 1 },
      { id: 'maraton_10',    ico: '🎮', name: 'Marathonien',          desc: '10 sessions jouées',
        check: () => (P.history || []).length >= 10 },
      { id: 'cent_q',        ico: '💯', name: 'Cent questions',       desc: '100 questions répondues',
        check: () => (P.totalQ || 0) >= 100 },
      { id: 'mille_q',       ico: '🧠', name: 'Encyclopédie',         desc: '1000 questions répondues',
        check: () => (P.totalQ || 0) >= 1000 },
      { id: 'snipers',       ico: '🎯', name: 'Sniper du savoir',     desc: '80% de précision sur 100+ questions',
        check: () => (P.totalQ || 0) >= 100 && (P.totalCorrect || 0) / P.totalQ >= 0.8 },
      { id: 'perfect_1',     ico: '✨', name: 'Sans faute',           desc: 'Réussir un Perfect Run',
        check: () => (P.perfectCount || 0) >= 1 },
      { id: 'perfect_10',    ico: '🌟', name: 'Perfectionniste',      desc: '10 Perfect Runs',
        check: () => (P.perfectCount || 0) >= 10 },
      { id: 'boss_1',        ico: '⚔️', name: 'Tueur de gardien',     desc: 'Vaincre un premier boss',
        check: () => Object.keys(P.bossDefeated || {}).length >= 1 },
      { id: 'boss_tous',     ico: '🐉', name: 'Tueur de dragons',     desc: 'Vaincre tous les boss de la route',
        check: () => { const n = (window.ROAD || window.KQ_ROADMAP || []).length; return n > 0 && Object.keys(P.bossDefeated || {}).length >= n; } },
      { id: 'atlas_10',      ico: '🗺️', name: 'Explorateur',          desc: '10 fiches atlas débloquées',
        check: () => (P.atlas || []).length >= 10 },
      { id: 'atlas_50',      ico: '🌍', name: 'Globe-trotter',        desc: '50 fiches atlas débloquées',
        check: () => (P.atlas || []).length >= 50 },
      { id: 'atlas_100',     ico: '📜', name: 'Archiviste du monde',  desc: '100 fiches atlas débloquées',
        check: () => (P.atlas || []).length >= 100 },
      { id: 'streak_7',      ico: '🔥', name: 'Semaine de feu',       desc: 'Série de 7 jours',
        check: () => (P.streakDays || 0) >= 7 },
      { id: 'streak_30',     ico: '⚡', name: 'Habitué du quotidien', desc: 'Série de 30 jours',
        check: () => (P.streakDays || 0) >= 30 },
      { id: 'maitrise_5',    ico: '⭐', name: 'Spécialiste',          desc: 'Maîtrise niveau 5 dans une catégorie',
        check: () => Object.values(P.specialties || {}).some(l => l >= 5) },
      { id: 'maitrise_max',  ico: '👑', name: 'Sommet du savoir',     desc: 'Maîtrise niveau 10 dans une catégorie',
        check: () => Object.values(P.specialties || {}).some(l => l >= 10) },
      { id: 'chrono_10',     ico: '⏱️', name: 'Contre la montre',     desc: '10 réponses en mode Chrono',
        check: () => (P.chronoBest || 0) >= 10 },
      { id: 'survie_20',     ico: '💀', name: 'Survivant',            desc: '20 réponses en mode Survie',
        check: () => (P.survieRecord || 0) >= 20 },
      { id: 'elo_1200',      ico: '🏅', name: 'Cerveau classé',       desc: 'Elo infini ≥ 1200',
        check: () => (P.bestInfiniteElo || 0) >= 1200 },
      { id: 'collectionneur',ico: '🎩', name: 'Collectionneur',       desc: 'Posséder 5 cosmétiques',
        check: () => (P.ownedHats || []).length >= 5 },
      { id: 'stars_30',      ico: '🌟', name: 'Chasseur d\'étoiles',  desc: '30 étoiles cumulées sur la route',
        check: () => Object.values(P.nodeStars || {}).reduce((a, b) => a + b, 0) >= 30 },
      { id: 'riche',         ico: '💎', name: 'Trésorier',            desc: 'Détenir 500 gemmes',
        check: () => (P.gems || 0) >= 500 },
    ];

    // Seasonal event logic
    // ── Banque de questions événementielles : tirée de l'événement du jour ──
    // (SEASONAL_EVENTS / getActiveEvent sont définis en fin de fichier)
    const getSeasonalQB = () => {
      const ev = typeof getActiveEvent === 'function' ? getActiveEvent() : null;
      if (ev && ev.qs && ev.qs.length) return [...ev.qs];
      return [
        { id: 'ev_gen1', cat: 'hist', question: 'Quel événement se commémore le 11 novembre ?', choices: ['D-Day', 'Armistice 1918', 'Chute du Mur', 'Révolution FR'], correctAnswer: 1, difficulty: 'easy', xp: 15, explanation: "Le 11 novembre 1918, l'Armistice met fin à la WW1.", isEvent: true },
      ];
    };

    const STORAGE_KEY = 'knowquest_v2_0';
    const AVATARS = ['🦁', '🦊', '🦅', '🐉', '🐬', '🦋', '🐻', '🦉', '🦈', '🐯'];

    const POWERUP_SHOP = [
      { id: 'fiftyfifty', name: '50/50', ico: '✂️', desc: 'Élimine 2 mauvaises réponses', cost: 30 },
      { id: 'shield', name: 'Bouclier', ico: '🛡️', desc: 'Protège ton prochain cœur', cost: 50 },
      { id: 'doubleXP', name: 'Double XP', ico: '⚡', desc: '×2 XP pour la prochaine session', cost: 40 },
      { id: 'streakFreeze', name: 'Gel de série', ico: '🧊', desc: 'Protège ta série si tu rates un jour', cost: 45 },
    ];

    // ===== STATE =====
    // ===== ADAPTATEUR IA -> JEU =====
    window.updateTrophyRoad = function (roadmapData) {
      if (!roadmapData || !roadmapData.milestones) return;

      const chapters = [];
      let currentChapter = { name: "Chapitre 1 : Découverte", nodes: [] };
      let chapterIndex = 1;

      // Transforme les paliers de l'IA en "noeuds" jouables pour la carte
      roadmapData.milestones.forEach((m, index) => {
        currentChapter.nodes.push({
          id: "ai_node_" + m.id,
          type: m.reward && m.reward.type === "chest" ? "chest" : "lesson",
          ico: m.icon || "⭐",
          label: m.title || "Étape " + m.id,
          qCount: 5, // Nombre de questions par case
          bank: "mixedAll" // Pioche dans toutes les catégories générées par l'IA
        });

        // Tous les 5 paliers, on crée un nouveau chapitre
        if (currentChapter.nodes.length >= 5 || index === roadmapData.milestones.length - 1) {
          chapters.push(currentChapter);
          chapterIndex++;
          let nextName = "Chapitre " + chapterIndex;
          if (m.tier === "silver") nextName += " : Confirmé";
          if (m.tier === "gold") nextName += " : Expert";
          if (m.tier === "platinum") nextName += " : Maître";
          currentChapter = { name: nextName, nodes: [] };
        }
      });

      // Remplace l'ancienne route par la nouvelle générée par l'IA
      window.ROAD = chapters;

      // Force le rafraîchissement de la carte
      buildRoad();
    };
    let P = {
      name: '', avatar: '🦁', level: 1, xp: 0, xpMax: 500,
      streak: 0, gems: 0, totalQ: 0, totalCorrect: 0,
      nodeProgress: {}, nodeStars: {}, seenChapterIntro: {}, hearts: 5, lastHeartTime: Date.now(), lastPlayDate: '',
      achievements: [], mistakes: [], atlas: [],
      avatarStyle: { hat: null },
      ownedHats: [],           // cosmétiques achetés une fois pour toutes — s'équiper est gratuit
      honors: {},              // trophées : boss vaincus, perfect runs, chapitres 3 étoiles
      perfectCount: 0,         // nombre total de Perfect Runs
      talents: {},             // talents achetés (arbre de progression)
      specialties: { geo: 1, hist: 1, sci: 1, art: 1, cinema: 1, sport: 1, gastro: 1, mytho: 1, mixed: 1, extended: 1, chateaux: 1 },
      lastQuestDate: '',
      powerups: { fiftyfifty: 0, shield: 0, doubleXP: 0, streakFreeze: 0 },
      doubleXPActive: false, shieldActive: false,
      gpWins: 0,
      catStats: {},    // {geo:{correct:5,total:10}, ...}
      catStreak: {},   // {geo:{current:3,best:5}, ...} — streak par catégorie
      objectives: [],  // [{cat,label,startDate,endDate,dailyGoal,progress:[],done}]
      history: [],     // [{mode,acc,xp,date,correct,total}] last 10
      survieRecord: 0,
      chronoBest: 0,
      difficultyOverride: {}, // cat => 'easy'|'medium'|'hard' based on performance
      dailyChallengeDate: '', // ISO date of last daily challenge completion
      dailyChallengeScore: 0, // best accuracy on daily challenge
      dailyChallengeDone: false,
      streakDays: 0,          // consecutive days played (for streak bonus)
      streakHistory: [],      // ISO date strings ('YYYY-MM-DD') of days played, for the calendar view
      streakMilestones: {},   // {7:true, 30:true, 100:true} — milestone badges already claimed
      weeklyMissions: [],     // [{id,desc,target,progress,reward,done}]
      weeklyMissionReset: '', // ISO week string
      weeklyBonusWeek: '',    // ISO week string of last claimed weekly bonus question
      titles: {},             // {id: true} — unlocked profile titles
      equippedTitle: null,
      darkMode: false,
      remindersEnabled: false,
      playHours: [],          // hours-of-day (0-23) recorded at each session start, to guess a reminder time
      bossDefeated: {},
      recentlySeen: [],      // {chapterId: true}
      // Compagnon vivant : 'always' | 'quiz' | 'off'
      companion: { mode: 'always' },
      // Répétition espacée : { [qid]: { box: 1..5, due: 'YYYY-MM-DD' } }
      srs: {},
      // Tutoriel complet vu ?
      tutorial: { done: false },
      // P3 — Progression visible : journal quotidien, certificats, missions du jour
      dayLog: {},            // { 'YYYY-MM-DD': { xp, q, c } } — activité (heatmap, courbe XP)
      certificates: {},      // { [cat]: 'YYYY-MM-DD' } — certificats de catégorie perfectionnée
      dailyMissions: [],     // 3 missions du jour, orientées points faibles
      dailyMissionDate: '',
      // P4 — Monde vivant : boss légendaire, cosmétiques
      legendBoss: { month: '', defeated: false }, // boss légendaire mensuel
      roadTheme: null,       // thème de décor de route équipé
      ownedRoadThemes: [],   // thèmes de route achetés
      owlHat: null,          // tenue de Chouette équipée
      ownedOwlHats: [],      // tenues de Chouette achetées
      // Championship
      championship: {
        active: false,
        season: 1,
        currentRace: 0,
        races: [],
        standings: [],
        constructorId: null,
        titles: 0,
      },
    };

    let Q = {
      mode: '', type: '', qs: [], idx: 0, correct: 0, totalXP: 0, state: 'selecting',
      selectedIdx: null, combo: 0, userSel: [],
      retryQueue: [], newAtlasCards: 0,
      survieErrors: 0, survieScore: 0,
      duelPlayerHP: 5, duelAiHP: 5, duelAiDiff: 0.7,
      chainIdx: 0, chainBroken: false, chain: null,
    };

    let GP = {
      phase: 'select_team', // select_team -> select_circuit -> select_tire -> qual_intro -> qual_play -> race_intro -> race_play -> results
      qualScore: 0, position: 8,
      selectedConstructor: null,
      selectedCircuit: null,
      drivers: [], // Liste dynamique des participants de la course
      animFrameId: null,
      // === STRATÉGIE & IMMERSION ===
      weather: 'sunny',        // 'sunny' | 'rain' (peut changer en course)
      selectedTire: 'medium',  // 'soft' | 'medium' | 'hard' | 'rain'
      tireWear: 0,             // 0 (neuf) -> 100 (mort)
      drsActive: false,
      drsAvailable: false,
      pitstopDone: [],         // tours où le pitstop a eu lieu
      boxRequested: false,     // le joueur a demandé son arrêt
      pitstopBoost: 0,         // bonus de vitesse après un pitstop réussi
      rpmLevel: 0.5,           // 0.0 → 1.0 pour l'indicateur moteur
      // === IMPRÉVUS ===
      scLapsLeft: 0,           // tours restants sous Safety Car
      fastestLap: false,       // meilleur tour de la course décroché
      weatherChangeLap: -1,    // tour où la météo bascule (-1 = jamais)
      incidentLap: -1,         // tour de l'incident mécanique (-1 = jamais)
      diffMult: 1,             // multiplicateur de précision des IA
    };

    // === CHAMPIONSHIP STATE ===
    let CHAMP = {
      active: false,
      season: 1,
      currentRace: 0,         // index 0..4
      races: [],              // historique {circuit, pos, pts}
      standings: [],          // [{id, name, car, pts}]
      selectedConstructor: null,
    };

    // Circuits de F1 depuis les années 2000 (Tracés Canvas normalisés [0.0 - 1.0])
    const GP_CIRCUITS = [
      {
        id: 'australia',
        name: "🇦🇺 Melbourne (Albert Park)",
        desc: "Circuit rapide tracé autour d'un lac artificiel, exigeant de la précision.",
        length: "5,278 km",
        pathD: "M294.629 449.112c-17.004-16.153-135.384-136.209-146.616-147.395-1.524-1.517-1.706-3.53.325-6.806 3.149-5.077 4.704-10.311 4.992-19.451.338-10.696-5.247-17.614-9.32-20.938a543.275 540.954 0 0 1-3.051-2.51c-7.815-6.483-24.853-22.693-36.79-37.604-7.19-8.982-18.233-21.829-21.922-27.231-3.69-5.402-20.837-34.579-23.657-41.495-.14-.345-.313-.741-.486-1.193-2.526-6.507 1.79-7.721 4.882-8.288 3.321-.61 15.573-2.62 24.47-4.568 6.013-1.313 7.515-6.538 7.381-10.805-.272-8.617-1.166-38.604-1.248-43.628-.044-2.674-1.14-6.564 2.014-9.31.177-.155.36-.297.536-.442 7.596-6.268 24.309-19.02 31.472-22.26 7.163-3.241 19.75-8.645 25.394-10.59.27-.093 8.895-3.4 9.197-3.512 6.839-2.512 16.371-9.01 25.802-14.913 2.85-1.783 5.222-1.533 7.408.73 4.11 4.254 8.482 8.26 13.591 10.778 5.11 2.519 10.96 3.55 16.713 4.107l.869.086c6.576.667 18.943 2.276 24.961 6.615 6.599 4.758 18.448 15.344 22.356 27.446 2.667 8.264 8.547 39.081 9.113 44.954.043.417.075.832.111 1.243.316 3.362.451 7.204-.38 12.615-.785 5.117-3.03 9.761-4.865 12.36-2.135 3.025-2.99 4.04-5.601 7.349-2.022 2.563-3.632 5.219-5.412 8.814-1.298 2.622-2.098 5.678-3.25 9.515-.6 1.996-.984 4.224-1.438 6.672-2.298 12.381-6.64 33.93-6.511 48.195.217 24.638 9.137 41.707 17.797 53.812 10.2 14.265 18.231 19.882 28.868 28.745 2.75 2.292 5.48 4.553 8.392 6.78 3.169 2.426 7.437 5.332 12.714 6.133 7.49 1.135 15.377.162 23.93.162 6.755 0 8.091.737 11.068 3.078 11.64 9.16 39.977 33.269 40.484 33.778 8.615 8.626 17.154 17.81 21.049 30.465 4.124 13.4 9.334 31.769 11.72 40.414 2.386 8.646 9.142 31.943 9.55 34.796.65 4.539 2.668 10.58-1.123 10.859-5.127.378-11.708 1.435-20.695 5.01-11.669 4.64-25.258 9.853-29.403 11.147-11.07 3.458-18.45 3.889-24.962-7.997-4.378-7.99-14.84-26.34-22.345-39.148-3.658-6.242-7.146-4.698-8.583-3.104-4.776 5.294-9.984 10.914-17.255 18.587-4.469 4.71-15.194 4.643-22.246-2.057z"
      },
      {
        id: 'monaco',
        name: "🇲🇨 Monaco (Monte-Carlo)",
        desc: "Tracé urbain sinueux, très étroit, exigeant une concentration absolue.",
        length: "3,337 km",
        pathD: "M 100 380 C 70 300, 100 240, 150 200 C 190 170, 220 120, 280 140 C 350 170, 390 100, 430 180 C 470 260, 410 340, 350 370 C 300 400, 240 320, 180 350 Z"
      },
      {
        id: 'spa',
        name: "🇧🇪 Spa-Francorchamps",
        desc: "Le toboggan des Ardennes avec le mythique Raidillon de l'Eau Rouge.",
        length: "7,004 km",
        pathD: "M 120 400 C 100 320, 130 220, 150 180 C 180 120, 220 100, 300 100 C 350 100, 420 150, 450 220 C 470 280, 430 350, 380 380 C 320 410, 260 330, 200 360 C 160 380, 140 420, 120 400 Z"
      },
      {
        id: 'monza',
        name: "🇮🇹 Monza (Temple of Speed)",
        desc: "Temple de la vitesse composé de longues lignes droites et de chicanes serrées.",
        length: "5,793 km",
        pathD: "M 100 350 L 100 150 C 100 100, 200 100, 250 150 L 250 200 C 250 220, 300 220, 300 200 L 300 150 C 300 100, 400 100, 400 150 L 400 350 C 400 400, 300 400, 250 350 L 150 350 C 120 350, 100 400, 100 350 Z"
      },
      {
        id: 'silverstone',
        name: "🇬🇧 Silverstone",
        desc: "Tracé historique rapide réputé pour son enchaînement légendaire Maggots-Becketts.",
        length: "5,891 km",
        pathD: "M 100 250 C 90 150, 150 100, 250 110 C 350 120, 420 180, 400 280 C 380 350, 280 420, 200 380 C 150 350, 110 300, 100 250 Z"
      },
      {
        id: 'suzuka',
        name: "🇯🇵 Suzuka",
        desc: "Seul circuit du calendrier dessiné en forme de '8' avec un croisement de pont.",
        length: "5,807 km",
        pathD: "M 100 250 C 100 150, 200 150, 250 250 C 300 350, 400 350, 400 250 C 400 150, 300 150, 250 250 C 200 350, 100 350, 100 250 Z"
      }
    ];

    // Constructeurs (Écuries) F1 — avec pilote titulaire ET coéquipier
    const GP_CONSTRUCTORS = [
      { id: 'redbull', name: "Oracle Red Bull Racing", color: "#0c162c", accent: "#fff000", tag: "RBR", pilot: "M. Verstappen", pilot2: "S. Pérez", aiAccuracy: 0.86, car: "🔵" },
      { id: 'ferrari', name: "Scuderia Ferrari HP", color: "#ef1a2d", accent: "#ffffff", tag: "FER", pilot: "C. Leclerc", pilot2: "C. Sainz", aiAccuracy: 0.82, car: "🔴" },
      { id: 'mclaren', name: "McLaren Formula 1 Team", color: "#ff8700", accent: "#47c0ff", tag: "MCL", pilot: "L. Norris", pilot2: "O. Piastri", aiAccuracy: 0.83, car: "🟠" },
      { id: 'mercedes', name: "Mercedes-AMG Petronas", color: "#00a19c", accent: "#ffffff", tag: "MER", pilot: "L. Hamilton", pilot2: "G. Russell", aiAccuracy: 0.81, car: "⚫" },
      { id: 'aston', name: "Aston Martin Aramco", color: "#00665e", accent: "#c5ff32", tag: "AST", pilot: "F. Alonso", pilot2: "L. Stroll", aiAccuracy: 0.79, car: "🟢" },
      { id: 'alpine', name: "BWT Alpine F1 Team", color: "#0078c1", accent: "#ff85b8", tag: "ALP", pilot: "P. Gasly", pilot2: "E. Ocon", aiAccuracy: 0.72, car: "💗" },
      { id: 'williams', name: "Williams Racing", color: "#002f6c", accent: "#00a1de", tag: "WIL", pilot: "A. Albon", pilot2: "F. Colapinto", aiAccuracy: 0.71, car: "🔷" },
      { id: 'haas', name: "MoneyGram Haas F1 Team", color: "#e60028", accent: "#000000", tag: "HAA", pilot: "N. Hülkenberg", pilot2: "K. Magnussen", aiAccuracy: 0.70, car: "⚪" }
    ];

    const GP_RIVALS = [
      { name: 'Verstappen', car: '🔵', ai: 0.85 },
      { name: 'Hamilton', car: '⚫', ai: 0.80 },
      { name: 'Leclerc', car: '🔴', ai: 0.75 },
      { name: 'Norris', car: '🟠', ai: 0.70 },
      { name: 'Alonso', car: '🟢', ai: 0.65 },
      { name: 'Russell', car: '⚪', ai: 0.60 },
      { name: 'Sainz', car: '🟡', ai: 0.55 },
    ];

    function startGrandPrix() {
      GP = { phase: 'select_team', qualScore: 0, position: 8, selectedConstructor: null, selectedCircuit: null, drivers: [], animFrameId: null };
      document.getElementById('gpPhaseBadge').textContent = 'Écurie';
      document.getElementById('gpTitle').textContent = '🏎️ Grand Prix — Sélection';
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
      document.getElementById('scrGP').classList.add('active');
      renderGPTeamSelector();
    }

    function renderGPTeamSelector() {
      let html = `
    <div style="text-align:center; margin-bottom:20px;">
      <h3 style="font-size:18px; font-weight:900;">Choisis ton Écurie</h3>
      <p style="font-size:12px; color:var(--muted); font-weight:700;">Chaque constructeur possède son propre pilote d'usine et son niveau de performance.</p>
    </div>
    <div class="gp-selection-grid">`;

      GP_CONSTRUCTORS.forEach(team => {
        html += `
      <div class="gp-select-card" id="cardTeam_${team.id}" onclick="selectGPTeam('${team.id}')">
        <div class="gp-select-color-indicator" style="background:${team.color}; border:1px solid ${team.accent}"></div>
        <div class="gp-select-details">
          <div class="gp-select-title">${team.name}</div>
          <div class="gp-select-desc">Pilote : <strong>${team.pilot}</strong> — Efficacité IA : ${Math.round(team.aiAccuracy * 100)}%</div>
        </div>
        <div style="font-size:24px;">${team.car}</div>
      </div>`;
      });

      html += `</div>
    <button class="ob-btn" id="btnNextGPSelect" style="background:var(--gold); color:#1a1a2e; box-shadow:0 5px 0 var(--gold-d);" disabled onclick="goToGPCircuitSelector()">Sélectionner le Circuit 🏁</button>
  `;
      document.getElementById('gpBody').innerHTML = html;
    }

    function selectGPTeam(teamId) {
      GP.selectedConstructor = GP_CONSTRUCTORS.find(t => t.id === teamId);
      document.querySelectorAll('.gp-select-card').forEach(c => c.classList.remove('selected'));
      document.getElementById(`cardTeam_${teamId}`).classList.add('selected');
      const btn = document.getElementById('btnNextGPSelect');
      btn.disabled = false;
      btn.style.background = 'var(--green)';
      btn.style.boxShadow = '0 5px 0 var(--green-d)';
      btn.style.color = '#fff';
    }

    function goToGPCircuitSelector() {
      GP.phase = 'select_circuit';
      document.getElementById('gpPhaseBadge').textContent = 'Circuit';
      document.getElementById('gpTitle').textContent = '🏎️ Grand Prix — Tracé';

      let html = `
    <div style="text-align:center; margin-bottom:20px;">
      <h3 style="font-size:18px; font-weight:900;">Choisis ton Circuit</h3>
      <p style="font-size:12px; color:var(--muted); font-weight:700;">Chaque tracé propose un profil unique d'obstacles et de courbes.</p>
    </div>
    <div class="gp-selection-grid">`;

      // Melbourne (Australie) est bien inclus au début de GP_CIRCUITS
      const records = P.gpRecords || {};
      GP_CIRCUITS.forEach(track => {
        const rec = records[track.id];
        const recHTML = rec ? `<div style="font-size:11px;font-weight:900;color:var(--gold);margin-top:4px">⭐ Ton record : P${rec.bestPos}</div>` : '';
        html += `
      <div class="gp-select-card" id="cardTrack_${track.id}" onclick="selectGPCircuit('${track.id}')">
        <div style="font-size:28px;">🏁</div>
        <div class="gp-select-details">
          <div class="gp-select-title">${track.name}</div>
          <div class="gp-select-desc">${track.desc} <br>Longueur : <strong>${track.length}</strong></div>
          ${recHTML}
        </div>
      </div>`;
      });

      html += `</div>
    <div style="display:flex; gap:10px;">
      <button class="ob-btn" style="flex:1; background:#222; border:2px solid var(--border); box-shadow:none;" onclick="renderGPTeamSelector()">Retour</button>
      <button class="ob-btn" id="btnNextGPCircuit" style="flex:2; background:var(--gold); color:#1a1a2e; box-shadow:0 5px 0 var(--gold-d);" disabled onclick="goToGPQualIntro()">Confirmer la grille 🚦</button>
    </div>
  `;
      document.getElementById('gpBody').innerHTML = html;
    }

    function selectGPCircuit(trackId) {
      GP.selectedCircuit = GP_CIRCUITS.find(t => t.id === trackId);
      document.querySelectorAll('.gp-select-card').forEach(c => c.classList.remove('selected'));
      document.getElementById(`cardTrack_${trackId}`).classList.add('selected');
      const btn = document.getElementById('btnNextGPCircuit');
      btn.disabled = false;
      btn.style.background = 'var(--green)';
      btn.style.boxShadow = '0 5px 0 var(--green-d)';
      btn.style.color = '#fff';
    }

    function goToGPQualIntro() {
      rollWeather();
      GP.selectedTire = GP.weather === 'rain' ? 'rain' : 'medium';
      GP.pitstopDone = [];
      GP.pitstopBoost = 0;
      GP.drsActive = false;
      GP.tireWear = 0;
      GP._wearWarnRadioed = false;
      GP._wearFlatRadioed = false;
      // Insère le sélecteur de pneus avant la quali
      GP.phase = 'select_tire';
      document.getElementById('gpPhaseBadge').textContent = 'Stratégie';
      document.getElementById('gpTitle').textContent = '🏎️ Grand Prix — Stratégie Pneus';
      document.getElementById('gpBody').innerHTML = `
    <div style="background:#1e1e2f;border-radius:20px;padding:20px;margin-bottom:16px;border:2px solid var(--gold);">
      ${renderTireSelector()}
      <button class="modal-btn" style="background:var(--gold);color:#1a1a2e;box-shadow:0 5px 0 var(--gold-d);margin-top:16px" onclick="confirmTireAndStartQual()">
        Confirmer la stratégie 🚦
      </button>
    </div>`;
    }

    function renderGPQualIntro() {
      const team = GP.selectedConstructor;
      const circuit = GP.selectedCircuit;
      document.getElementById('gpBody').innerHTML = `
    <div class="gp-qual-intro" style="background:#1e1e2f; border-color:var(--gold);">
      <div style="margin-bottom:12px;">${renderWeatherBar()}</div>
      <div style="font-size:60px;margin-bottom:12px">🏁</div>
      <div style="font-size:20px;font-weight:900;color:#fff;margin-bottom:8px">Qualifications — ${circuit.name}</div>
      <div style="font-size:14px;color:var(--muted);font-weight:700;line-height:1.5;margin-bottom:24px">
        Tu pilotes pour l'écurie <span style="color:${team.accent}">${team.name}</span>.<br>
        Réponds à <strong>5 questions de qualification</strong> pour obtenir ta place sur la grille de départ.<br>
        <strong>Un sans-faute rapide te garantira la Pole Position !</strong>
      </div>
      <button class="modal-btn" style="background:var(--gold);color:#1a1a2e;box-shadow:0 5px 0 var(--gold-d)" onclick="startGPQual()">Lancer la Séance Chronométrée ⏱️</button>
    </div>
    ${renderGPGrid(8, true)}`;
    }

    function renderGPGrid(playerPos, preview = false) {
      if (!GP.selectedConstructor) return '';
      const myTeam = GP.selectedConstructor;

      // Génère la liste ordonnée des pilotes
      const gridDrivers = [];

      // Ajoute le joueur
      gridDrivers.push({
        name: `${P.name} (YOU)`,
        car: myTeam.car,
        tag: myTeam.tag,
        isPlayer: true,
        pos: playerPos
      });

      // Ajoute les autres constructeurs
      let competitorPosition = 1;
      GP_CONSTRUCTORS.forEach(team => {
        if (team.id === myTeam.id) return;

        // Ajuste la position du rival pour sauter celle du joueur
        if (competitorPosition === playerPos) competitorPosition++;

        gridDrivers.push({
          name: team.pilot,
          car: team.car,
          tag: team.tag,
          isPlayer: false,
          pos: competitorPosition
        });
        competitorPosition++;
      });

      // Tri par position réelle
      gridDrivers.sort((a, b) => a.pos - b.pos);

      let html = `<div class="gp-track"><div class="gp-grid-title">${preview ? 'Grille Prévisionnelle' : '🏎️ Grille de Départ'}</div>`;
      gridDrivers.forEach(d => {
        const pc = d.pos === 1 ? 'p1' : d.pos === 2 ? 'p2' : d.pos === 3 ? 'p3' : '';
        html += `<div class="gp-driver-row" style="background:${d.isPlayer ? 'rgba(28,176,246,0.1)' : ''};"><div class="gp-pos ${pc}">${d.pos}</div><div class="gp-car">${d.car}</div><div class="gp-name ${d.isPlayer ? 'you' : ''}">${d.name}</div><div class="gp-gap ${d.isPlayer ? 'you' : ''}">${d.isPlayer ? 'VOUS' : `+${((d.pos - 1) * 0.25).toFixed(3)}s`}</div></div>`;
      });
      return html + '</div>';
    }

    function startGPQual() {
      const rawPool = [...window.GEO_QB, ...window.HIST_QB, ...window.SCI_QB, ...window.CINEMA_QB, ...window.SPORT_QB, ...window.MIXED_QB, ...window.EXTENDED_QB, ...window.CHATEAUX_QB, ...window.LITT_QB];
      const pool = shuffle(filterSeenQuestions(rawPool)).slice(0, 15);
      Q = { mode: 'gp_qual', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, chain: null, chainIdx: 0, chainBroken: false };
      document.getElementById('scrGP').classList.remove('active');
      document.getElementById('scrQuiz').classList.add('active');
      renderQ();
    }

    function startGPRace(qualPos) {
      GP.position = qualPos;
      GP._qualPos = qualPos;
      GP.phase = 'race_intro';

      // Initialisation des données des pilotes en course (avec écarts physiques sur la piste)
      GP.drivers = [];

      // Position initiale sur la grille : Pole position commence à 0.0, chaque place de grille recule de 0.02 tour
      GP.drivers.push({
        id: 'player',
        constructorId: GP.selectedConstructor.id,
        name: P.name,
        tag: 'YOU',
        car: GP.selectedConstructor.car,
        color: GP.selectedConstructor.accent,
        progress: -((qualPos - 1) * 0.02),
        targetProgress: -((qualPos - 1) * 0.02),
        isPlayer: true,
        accuracy: 1.0,
        reliability: 1.0,
        baseSpeed: 0.0003
      });

      // 15 adversaires : le coéquipier + les 14 autres pilotes du plateau
      const myTeam = GP.selectedConstructor;
      const mult = GP.diffMult || 1;
      const clamp = v => Math.max(0.45, Math.min(0.95, v));
      const rivals = [];
      GP_CONSTRUCTORS.forEach(team => {
        const pilots = team.id === myTeam.id
          ? [{ pilot: team.pilot2, ai: team.aiAccuracy * 0.96 }]   // ton coéquipier garde le siège restant
          : [{ pilot: team.pilot, ai: team.aiAccuracy }, { pilot: team.pilot2, ai: team.aiAccuracy * 0.95 }];
        pilots.forEach((p, pi) => {
          rivals.push({
            id: team.id === myTeam.id ? team.id + '_2' : team.id + '_' + (pi + 1),
            constructorId: team.id,
            name: p.pilot,
            tag: team.tag,
            car: team.car,
            color: team.color,
            accuracy: clamp(p.ai * mult),
            reliability: clamp(1 - (p.ai - 0.55) * 0.9),   // les petites écuries cassent plus
            baseSpeed: 0.00025 + (p.ai * mult) * 0.00008
          });
        });
      });
      // La grille respecte la qualification : le joueur à sa place, les IA se partagent le reste
      let gridSlot = 1;
      rivals.forEach(r => {
        if (gridSlot === qualPos) gridSlot++;
        r.progress = -((gridSlot - 1) * 0.02);
        r.targetProgress = r.progress;
        gridSlot++;
      });
      GP.drivers.push(...rivals);

      const pool = shuffle([...window.GEO_QB, ...window.HIST_QB, ...window.SCI_QB, ...window.CINEMA_QB, ...window.SPORT_QB, ...window.MIXED_QB, ...window.EXTENDED_QB, ...window.CHATEAUX_QB, ...window.LITT_QB]).slice(0, 15);
      Q = { mode: 'gp_race', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, chain: null, chainIdx: 0, chainBroken: false };

      // Imprevus de course programmés (météo, safety car, incidents)
      GP.tireWear = 0;
      GP.fastestLap = false;
      GP.scLapsLeft = 0;
      GP.boxRequested = false;
      GP.weatherChangeLap = (GP.weather === 'sunny' && Math.random() < 0.4) ? 3 + Math.floor(Math.random() * 5) : -1;
      if (GP.weather === 'rain' && Math.random() < 0.4) GP.weatherChangeLap = 3 + Math.floor(Math.random() * 5); // la pluie peut s'arrêter
      GP.incidentLap = Math.random() < 0.5 ? 2 + Math.floor(Math.random() * 7) : -1;

      document.getElementById('scrResult').style.display = 'none';
      document.getElementById('scrGP').classList.add('active');
      renderGPRaceStart(qualPos);
    }

    function renderGPRaceStart(pos) {
      document.getElementById('gpTitle').textContent = '🏎️ Grand Prix — Course';
      document.getElementById('gpPhaseBadge').textContent = 'Course';
      document.getElementById('gpBody').innerHTML = `
    <div class="gp-qual-intro" style="border-color:var(--green); background:#1e1e2f;">
      <div style="font-size:50px;margin-bottom:10px">🚦</div>
      <div style="font-size:20px;font-weight:900;color:#fff;margin-bottom:6px">Fermez la visière !</div>
      <div style="font-size:13px;color:var(--muted);font-weight:700;line-height:1.5;margin-bottom:20px">
        Tu t'élances depuis la place de grille : <strong>P${pos}</strong> sur le circuit de <strong>${GP.selectedCircuit.name}</strong>.<br>
        ✅ Réponse correcte : Boost instantané et dépassement de tes adversaires directes.<br>
        ❌ Réponse incorrecte ou temps écoulé : Calage moteur, tes concurrents prennent le large.<br>
        🔧 Surveille l'usure des pneus et ton arrêt aux stands.<br>
        <strong>Amène l'écurie sur la plus haute marche du podium !</strong>
      </div>
      <button class="modal-btn" style="background:var(--green); color:#fff; box-shadow:0 5px 0 var(--green-d)" onclick="startGPLights()">Éteindre les feux ! 🟢</button>
    </div>
    ${renderGPGrid(pos)}`;
    }

    // Séquence des 5 feux rouges avant le lancement de la course
    function startGPLights() {
      const modal = document.querySelector('.gp-qual-intro .modal-btn');
      if (modal) {
        modal.disabled = true;
        modal.textContent = '⏳ Prêt...';
        const lightsHTML = `<div id="gpLightsRow" style="display:flex;gap:8px;justify-content:center;margin:16px 0">
        ${[0, 1, 2, 3, 4].map(i => `<div id="gpLight${i}" style="width:28px;height:28px;border-radius:50%;background:#333;border:2px solid #555;transition:0.2s"></div>`).join('')}
      </div>`;
        const intro = document.querySelector('.gp-qual-intro');
        if (intro) intro.insertAdjacentHTML('beforeend', lightsHTML);
        [0, 1, 2, 3, 4].forEach((i, idx) => {
          setTimeout(() => {
            const l = document.getElementById('gpLight' + i);
            if (l) { l.style.background = '#cc0000'; l.style.boxShadow = '0 0 12px rgba(200,0,0,0.8)'; }
            audio._beep(180, 0.3, 'sine', 0.4);
          }, idx * 600);
        });
        audioF1.playLightsSequence(() => launchGPRace());
      } else {
        launchGPRace();
      }
    }

    function launchGPRace() {
      GP.phase = 'race_play';
      document.getElementById('gpPhaseBadge').textContent = 'En Course';

      // Construit le tableau de bord actif de la course avec rendu SVG vectoriel natif
      document.getElementById('gpBody').innerHTML = `
    <div class="gp-live-hud">
      <!-- 1. Tracé SVG Vectoriel Réaliste et Animé -->
      <!-- Inspiré par l'effet de tracé lumineux de : https://codepen.io/dembsky/pen/ZYpQzzP -->
      <div class="gp-canvas-wrap">
        <div class="radial-bg-gp"></div>
        <svg class="track-gp" id="gpSvg" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet" style="width:100%; height:240px; display:block;">
          <!-- Tracé d'asphalte sombre en arrière-plan -->
          <path id="gpTrackBg" fill="none" stroke="#252538" stroke-width="12" stroke-linejoin="round" d="" />
          <!-- Ligne pointillée blanche centrale -->
          <path id="gpTrackCenter" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round" stroke-dasharray="4,6" d="" />
          <!-- Traînée de lumière active animée -->
          <path id="gpTrackGlow" fill="none" stroke="rgba(239, 68, 68, 0.4)" stroke-width="16" stroke-linecap="round" d="" />
          <!-- Groupe conteneur des pilotes -->
          <g id="gpDriversGroup"></g>
        </svg>
      </div>
      
      <!-- 2. Leaderboard en direct horizontal -->
      <div class="gp-live-leaderboard" id="gpLiveLeaderboard"></div>
      
      <!-- 3. Module d'affichage du quiz en direct -->
      <div id="gpQuizHUD"></div>
    </div>
  `;

      // Lance la boucle d'animation physique
      startGPAnimation();

      // Effets météo sur le SVG + moteur + compteurs de course
      addRainToSVG();
      audioF1.startEngine(0.3);
      GP.drsUsesLeft = hasTalent('t_drs_plus') ? 2 : 1;

      // Affiche la première question dans le HUD
      renderGPActiveQuestion();
    }

    // Moteur d'interpolation géométrique du circuit
    function getInterpolatedPoint(path, t) {
      t = t % 1.0;
      if (t < 0) t += 1.0;
      const n = path.length;
      const segment = 1 / n;
      const idx = Math.floor(t / segment);
      const nextIdx = (idx + 1) % n;
      const factor = (t - (idx * segment)) / segment;

      const p1 = path[idx];
      const p2 = path[nextIdx];

      return {
        x: p1.x + (p2.x - p1.x) * factor,
        y: p1.y + (p2.y - p1.y) * factor
      };
    }

    // Boucle d'animation à 60 FPS avec lissage et de déplacement de traînée (Glow Trail)
    function startGPAnimation() {
      if (GP.animFrameId) cancelAnimationFrame(GP.animFrameId);

      const pathBg = document.getElementById('gpTrackBg');
      const pathGlow = document.getElementById('gpTrackGlow');
      const pathCenter = document.getElementById('gpTrackCenter');

      // Initialise les tracés SVG réels du circuit sélectionné
      if (pathBg && GP.selectedCircuit) {
        pathBg.setAttribute('d', GP.selectedCircuit.pathD);
        if (pathGlow) {
          pathGlow.setAttribute('d', GP.selectedCircuit.pathD);
          const totalLen = pathGlow.getTotalLength() || 1000;
          const trailLen = 120;
          pathGlow.style.strokeDasharray = `${trailLen} ${totalLen - trailLen}`;
        }
        if (pathCenter) {
          pathCenter.setAttribute('d', GP.selectedCircuit.pathD);
        }
      }

      let glowOffset = 0;

      function update() {
        if (GP.phase !== 'race_play') return;

        const pathBg = document.getElementById('gpTrackBg');
        const pathGlow = document.getElementById('gpTrackGlow');
        const driversGroup = document.getElementById('gpDriversGroup');

        if (!pathBg || !driversGroup) {
          GP.animFrameId = requestAnimationFrame(update);
          return;
        }

        const pathLength = pathBg.getTotalLength();

        // Physique : Progression et lissage
        GP.drivers.forEach(d => {
          if (d.out) return; // les voitures abandonnées restent figées sur le bas-côté
          // Les voitures avancent continuellement à leur vitesse de croisière de base
          d.targetProgress += d.baseSpeed;
          // Interpolation linéaire pour adoucir les dépassements/sauts
          d.progress += (d.targetProgress - d.progress) * 0.08;
        });

        // Safety Car : le peloton se regroupe derrière le leader
        if (GP.scLapsLeft > 0) {
          const leader = GP.drivers.reduce((a, b) => (b.progress > a.progress ? b : a), GP.drivers[0]);
          GP.drivers.forEach(d => {
            if (d.isPlayer || d.out) return;
            d.targetProgress += ((leader.progress - 0.006 - Math.random() * 0.012) - d.targetProgress) * 0.12;
          });
        }

        // Tri dynamique en direct selon la progression cumulée réelle
        GP.drivers.sort((a, b) => (b.progress - a.progress) || (a.out ? -1 : 0));

        // Recalcule la position du joueur dans le classement
        const playerIdx = GP.drivers.findIndex(d => d.isPlayer);
        GP.position = playerIdx + 1;

        // Animation du Glow Trail (Codepen dembsky)
        if (pathGlow) {
          glowOffset -= 2.5;
          pathGlow.style.strokeDashoffset = glowOffset;
        }

        // Mise à jour physique des positions des points pilotes sur le tracé réel
        driversGroup.innerHTML = '';
        GP.drivers.forEach(d => {
          const progressMod = (d.progress % 1.0);
          const targetLen = (progressMod >= 0 ? progressMod : (1.0 + progressMod)) * pathLength;
          const pt = pathBg.getPointAtLength(targetLen);

          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

          // Cercle voiture
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', pt.x);
          circle.setAttribute('cy', pt.y);
          circle.setAttribute('r', d.isPlayer ? '8' : '6');
          circle.setAttribute('fill', d.color);
          circle.setAttribute('stroke', '#ffffff');
          circle.setAttribute('stroke-width', d.isPlayer ? '2' : '1');

          // Label tag pilote
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', pt.x + 10);
          text.setAttribute('y', pt.y + 4);
          text.setAttribute('fill', '#ffffff');
          text.setAttribute('font-size', d.isPlayer ? '10' : '8');
          text.setAttribute('font-weight', 'bold');
          text.style.fontFamily = 'Nunito, sans-serif';
          text.textContent = d.tag;

          g.appendChild(circle);
          g.appendChild(text);
          driversGroup.appendChild(g);
        });

        // Actualisation du leaderboard HUD horizontal
        const lb = document.getElementById('gpLiveLeaderboard');
        if (lb) {
          lb.innerHTML = GP.drivers.map((d, idx) => {
            const isMe = d.isPlayer;
            const rivalId = P.championship && P.championship.rivalId;
            const isRival = rivalId && d.id === rivalId;
            const gap = idx === 0 ? "Leader" : `+${((GP.drivers[0].progress - d.progress) * 1.5).toFixed(2)}s`;
            return `
          <div class="gp-live-pos ${isMe ? 'player' : ''} ${isRival ? 'rival' : ''}">
            <span class="gp-live-pos-num">${idx + 1}</span>
            <span>${d.car}</span>
            <span style="font-weight:900;">${d.tag}</span>
            <span style="font-size:9px; color:var(--muted);">${d.out ? '🛑 Abandon' : gap}</span>
          </div>`;
          }).join('');
        }

        // DRS évalué en continu : disponibilité selon la proximité de la voiture devant
        checkDRS();

        GP.animFrameId = requestAnimationFrame(update);
      }

      GP.animFrameId = requestAnimationFrame(update);
    }

    // Rendu des questions actives directement dans l'interface F1
    function renderGPActiveQuestion() {
      if (Q.idx >= Q.qs.length) {
        if (GP.animFrameId) cancelAnimationFrame(GP.animFrameId);
        showGPResult();
        return;
      }

      // Pitstop : demandé via le bouton Box, ou forcé au tour 7 si jamais effectué
      if (GP.boxRequested || (Q.idx >= 6 && GP.pitstopDone.length === 0)) {
        GP.boxRequested = false;
        triggerPitstop(Q.idx).then(() => renderGPActiveQuestion());
        return;
      }

      Q.state = 'selecting'; Q.selectedIdx = null; Q.userSel = [];
      const q = Q.qs[Q.idx];

      const container = document.getElementById('gpQuizHUD');
      if (!container) return;

      // Chrono et barre de temps spécifique GP
      stopTimer();
      let timerSecs = q.difficulty === 'hard' ? 10 : q.difficulty === 'medium' ? 12 : 15;
      if (GP.drsActive) timerSecs = Math.max(4, Math.floor(timerSecs / 2)); // DRS réduit le temps de moitié
      startTimer(timerSecs, () => handleGPTimeExpired());

      let choicesHTML = '';
      if (q.choices) {
        choicesHTML = `<div class="q-answers">` + q.choices.map((c, i) => `
      <div class="ans-btn" style="background:#1e1e2f; color:#fff; border-color:#2d2d44; box-shadow:0 3px 0 #2d2d44;" id="gpAns_${i}" onclick="selectGPAnswer(${i})">
        <div class="ans-letter" style="background:#2a2a3f; color:var(--gold);">${String.fromCharCode(65 + i)}</div>
        <div style="font-weight:700;">${c}</div>
      </div>
    `).join('') + `</div>`;
      }

      const wearPct = Math.round(GP.tireWear);
      const wearColor = wearPct >= 90 ? 'var(--red)' : wearPct >= 60 ? 'var(--orange)' : 'var(--green)';
      const boxUrgent = GP.pitstopDone.length === 0 && Q.idx >= 4;

      container.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; gap:8px;">
      ${renderWeatherBar()}
      <div style="display:flex; align-items:center; gap:6px;">
        <button class="gp-box-btn" id="gpBoxBtn" onclick="requestBox()" title="Rentrer aux stands">${boxUrgent ? '🔧 BOX BOX !' : '🔧 Box'}</button>
        <button class="gp-drs-btn" id="gpDrsBtn" onclick="activateDRS()">⚡ DRS</button>
      </div>
    </div>
    <div class="gp-rpm-wrap" style="margin-bottom:8px;"><div class="gp-rpm-bar" id="gpRpmBar" style="width:${GP.rpmLevel * 100}%"></div></div>
    <div style="background:#1e1e2f; border-radius:16px; padding:16px; border:1px solid #2d2d44; text-align:left;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:11px; font-weight:900; color:var(--gold); text-transform:uppercase;">⚡ TOURS ${Q.idx + 1} / ${Q.qs.length}</span>
        <span class="diff-badge ${q.difficulty}">${q.difficulty === 'easy' ? 'Facile' : q.difficulty === 'medium' ? 'Moyen' : 'Difficile'}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:10px; font-weight:800; color:var(--muted);">🛞 USURE</span>
        <div style="flex:1; height:8px; background:#2d2d44; border-radius:6px; overflow:hidden;">
          <div style="width:${wearPct}%; height:100%; background:${wearColor}; transition:width .4s;"></div>
        </div>
        <span style="font-size:10px; font-weight:900; color:${wearColor};">${wearPct}%</span>
      </div>
      <div style="font-size:16px; font-weight:800; line-height:1.4; color:#fff; margin-bottom:16px;">${q.question}</div>
      ${choicesHTML}
      <button class="btn-action" id="gpBtnCheck" style="margin-top:16px;" disabled onclick="checkGPAnswer()">Valider la trajectoire</button>
    </div>

    <div class="vbanner" id="gpVBanner" style="position:absolute; bottom:0; left:0; right:0; z-index:999;">
      <div class="v-status" id="gpVStatus">-</div>
      <div class="v-fact" id="gpVFact">-</div>
      <button class="btn-action active-next" style="width:100%;" onclick="nextGPQuestion()">Poursuivre la course →</button>
    </div>
  `;
      checkDRS();
    }

    function requestBox() {
      if (Q.state !== 'selecting') return;
      GP.boxRequested = true;
      radio('Box box ce tour ! Prépare l\'arrêt 🔧');
      renderGPActiveQuestion();
    }

    function selectGPAnswer(idx) {
      if (Q.state !== 'selecting') return;
      Q.selectedIdx = idx;
      document.querySelectorAll('#gpQuizHUD .ans-btn').forEach(b => {
        b.style.borderColor = '#2d2d44';
        b.style.background = '#1e1e2f';
      });
      const selBtn = document.getElementById(`gpAns_${idx}`);
      selBtn.style.borderColor = 'var(--gold)';
      selBtn.style.background = '#28283f';

      const actionBtn = document.getElementById('gpBtnCheck');
      actionBtn.disabled = false;
      actionBtn.classList.add('active-check');
    }

    // ===== MÉCANIQUE DE COURSE (pneus, météo, SC, incidents, radio) =====
    function radio(msg) { showToast('📻 ' + msg, 3400); }

    // Vitesse et usure par tour selon le composé de pneu
    const TIRE_STATS = {
      soft:   { speed: 1.00, wear: 15 },
      medium: { speed: 0.92, wear: 10 },
      hard:   { speed: 0.85, wear: 6 },
      rain:   { speed: 0.80, wear: 9 },
    };

    function tirePenalty() {
      let pen = 0;
      const wet = GP.weather === 'rain';
      if (wet && GP.selectedTire !== 'rain') pen -= 0.02;      // slicks sous la pluie
      if (!wet && GP.selectedTire === 'rain') pen -= 0.015;    // pneus pluie sur piste sèche
      if (GP.tireWear >= 100) pen -= 0.02;                     // pneus à plat
      else if (GP.tireWear >= 70) pen -= 0.008;
      return pen;
    }

    // Événements de course entre deux tours : météo dynamique, safety car, incidents
    function applyLapEvents() {
      const lap = Q.idx;

      if (lap === GP.weatherChangeLap) {
        GP.weatherChangeLap = -1;
        GP.weather = GP.weather === 'rain' ? 'sunny' : 'rain';
        if (GP.weather === 'rain') { addRainToSVG(); radio('La pluie arrive au secteur 2 ! Pense aux pneus pluie 🔵'); }
        else { removeRainFromSVG(); radio('La piste sèche ! Les slicks redeviennent possibles ☀️'); }
      }

      if (GP.scLapsLeft > 0) {
        GP.scLapsLeft--;
        if (GP.scLapsLeft === 0) radio('🟢 Safety Car rentre — relancez, relancez !');
      } else if (lap >= 3 && lap <= 7 && Math.random() < 0.18) {
        GP.scLapsLeft = 2;
        radio('🟡 SAFETY CAR ! Le peloton se regroupe — occasion idéale de refaire son retard.');
      }

      if (lap === GP.incidentLap) {
        GP.incidentLap = -1;
        // R&D : la fiabilité achetée peut éviter la panne
        const relSave = (GP._champMode && P.championship.rd) ? 0.12 * (P.championship.rd.rel || 0) : 0;
        if (Math.random() < 0.25) {
          const player = GP.drivers.find(d => d.isPlayer);
          if (player && Math.random() < relSave) {
            radio('🔧 La R&D a payé : ta monoplace tient le coup, problème évité !');
          } else {
            if (player) player.targetProgress -= 0.05;
            radio('🔧 Problème mécanique sur ta monoplace ! Tu perds du terrain !');
          }
        } else {
          const candidates = GP.drivers.filter(d => !d.isPlayer && !d.out && d.accuracy < 0.9);
          if (candidates.length) {
            const victim = candidates[Math.floor(Math.random() * candidates.length)];
            victim.out = true;
            radio(`🛑 Abandon de ${victim.name} — panne moteur. La grille se dégage !`);
          }
        }
      }

      // Radio d'information régulière sur la position
      if (Q.idx === 4 || Q.idx === 8) {
        const order = [...GP.drivers].filter(d => !d.out).sort((a, b) => b.progress - a.progress);
        const pi = order.findIndex(d => d.isPlayer);
        const rivalDriver = getRivalDriver();
        let msg = `Position P${pi + 1}, continue de pousser !`;
        if (rivalDriver) {
          const ri = order.findIndex(d => d.id === rivalDriver.id);
          msg += ` ${ri >= 0 ? 'Rival ' + rivalDriver.name + ' : P' + (ri + 1) : 'Rival abandonné'}.`;
        }
        radio(msg);
      }
    }

    function getRivalDriver() {
      const rivalId = P.championship && P.championship.rivalId;
      if (!rivalId) return null;
      return GP.drivers.find(d => d.id === rivalId) || null;
    }

    function checkGPAnswer() {
      stopTimer();
      Q.state = 'checked';
      const q = Q.qs[Q.idx];
      const isCorrect = (Q.selectedIdx === q.correctAnswer);
      const isDRS = GP.drsActive;

      // Comptabilise la réponse GP dans les stats globales et par catégorie
      recordCatStat(q.cat, isCorrect);
      if (isCorrect) P.totalCorrect++;

      // Écurie du joueur
      const player = GP.drivers.find(d => d.isPlayer);

      // Gestion visuelle des boutons
      const btns = document.querySelectorAll('#gpQuizHUD .ans-btn');
      if (btns[Q.selectedIdx]) {
        btns[Q.selectedIdx].style.background = isCorrect ? 'var(--green-bg)' : 'var(--red-bg)';
        btns[Q.selectedIdx].style.color = '#000';
        btns[Q.selectedIdx].style.borderColor = isCorrect ? 'var(--green)' : 'var(--red)';
      }
      if (!isCorrect && btns[q.correctAnswer]) {
        btns[q.correctAnswer].style.background = 'var(--green-bg)';
        btns[q.correctAnswer].style.color = '#000';
        btns[q.correctAnswer].style.borderColor = 'var(--green)';
      }

      // Simulation de l'IA (sous safety car, tout le monde lève le pied)
      GP.drivers.forEach(d => {
        if (d.isPlayer || d.out) return;
        const acc = GP.scLapsLeft > 0 ? d.accuracy * 0.75 : d.accuracy;
        const aiSuccess = Math.random() < acc;
        d.targetProgress += aiSuccess ? (0.045 + (Math.random() * 0.015)) : 0.005;
      });

      if (isCorrect) {
        audio.playCorrect();
        Q.correct++; Q.combo++;
        // R&D : chaque bonne réponse en championnat nourrit le développement
        if (GP._champMode) { ensureChampExtras(); P.championship.rd.pts++; GP._rdEarned = (GP._rdEarned || 0) + 1; }
        const comboBonus = Q.combo >= 3 ? 0.02 : 0.0;
        const timeBonus = (_timerSec / 15) * 0.02; // Bonus de rapidité de trajectoire

        let gain = (0.07 + comboBonus + timeBonus) * TIRE_STATS[GP.selectedTire].speed;
        if (GP.tireWear >= 100) gain *= 0.5;          // pneus à plat
        if (GP.scLapsLeft > 0) gain *= 1.6;           // relance : occasion de dépasser
        if (GP._champMode && P.championship.rd) gain *= (1 + 0.04 * (P.championship.rd.speed || 0)); // moteur R&D
        player.targetProgress += gain;
        if (isDRS) { player.targetProgress += 0.07; radio('⚡ DRS + bonne réponse : dépassement réussi !'); }
        if (GP.pitstopBoost > 0) { player.targetProgress += GP.pitstopBoost; GP.pitstopBoost = 0; }
        audioF1.boostRPM();
        audioF1.vibrateGForce(0.6);
        showToast('🚀 Accélération ! Tu gagnes du terrain !');

        // Meilleur tour : 4 bonnes réponses consécutives
        if (!GP.fastestLap && Q.combo >= 4) {
          GP.fastestLap = true;
          radio('🟣 Meilleur tour en course ! Superbe rythme.');
        }
      } else {
        audio.playWrong();
        Q.combo = 0;
        let loss = Math.min(0.02, 0.005 + tirePenalty()); // pénalités pneus/météo
        if (GP.pitstopBoost < 0) { loss += GP.pitstopBoost; GP.pitstopBoost = 0; }
        player.targetProgress += loss;
        showToast('💨 Tête à queue ! Tes adversaires s\'éloignent !');
        audioF1.brakeRPM();
        audioF1.vibrateGForce(0.3);
      }
      GP.drsActive = false;

      // Usure des pneus à chaque tour
      GP.tireWear = Math.min(100, GP.tireWear + TIRE_STATS[GP.selectedTire].wear + Math.random() * 3);
      if (GP.tireWear >= 100 && !GP._wearFlatRadioed) {
        GP._wearFlatRadioed = true;
        radio('🛞 Pneus à plat ! Rentre aux stands immédiatement !');
      } else if (GP.tireWear >= 70 && !GP._wearWarnRadioed) {
        GP._wearWarnRadioed = true;
        radio(`🛞 Usure élevée (${Math.round(GP.tireWear)}%) — prépare ton arrêt.`);
      }

      // Événements de course après ce tour
      applyLapEvents();

      // Affiche le bandeau F1 de résultats
      document.getElementById('gpBtnCheck').style.display = 'none';
      const banner = document.getElementById('gpVBanner');
      banner.className = 'vbanner show ' + (isCorrect ? 'c' : 'w');

      const status = document.getElementById('gpVStatus');
      status.textContent = isCorrect ? '🏎️ Trajectoire Parfaite !' : '❌ Hors-piste';
      status.className = 'v-status ' + (isCorrect ? 'c' : 'w');

      document.getElementById('gpVFact').textContent = q.explanation || '';
      save();
    }

    function handleGPTimeExpired() {
      if (Q.state !== 'selecting') return;
      Q.state = 'checked';
      audio.playWrong();
      Q.combo = 0;

      const q = Q.qs[Q.idx];
      const player = GP.drivers.find(d => d.isPlayer);
      player.targetProgress += 0.002 + tirePenalty(); // Presque aucun mouvement (pénalités pneus incluses)
      GP.tireWear = Math.min(100, GP.tireWear + TIRE_STATS[GP.selectedTire].wear);

      // Les IA avancent
      GP.drivers.forEach(d => {
        if (d.isPlayer || d.out) return;
        const acc = GP.scLapsLeft > 0 ? d.accuracy * 0.75 : d.accuracy;
        const aiSuccess = Math.random() < acc;
        d.targetProgress += aiSuccess ? (0.045 + Math.random() * 0.01) : 0.005;
      });
      applyLapEvents();

      document.getElementById('gpBtnCheck').style.display = 'none';
      const banner = document.getElementById('gpVBanner');
      banner.className = 'vbanner show w';

      const status = document.getElementById('gpVStatus');
      status.textContent = '⏰ Retard au freinage (Temps écoulé)';
      status.className = 'v-status w';

      document.getElementById('gpVFact').textContent = q.explanation || '';
      save();
    }

    function nextGPQuestion() {
      document.getElementById('gpVBanner').classList.remove('show');
      Q.idx++;
      renderGPActiveQuestion();
    }

    function showGPResult() {
      const pos = GP.position;
      const podium = pos <= 3;
      if (podium) P.gpWins++;
      audio.playRaceGo();
      if (pos === 1) { setTimeout(() => spawnConfetti(), 200); setTimeout(() => spawnConfetti(), 800); }

      // Récompense meilleur tour
      if (GP.fastestLap) { P.gems += 10; }

      // Trophées F1 connectés à la vitrine : pole, première victoire
      if (GP._qualPos === 1) addHonor('gp_pole', { ico: '🏁', name: 'Pole Position', cls: 'boss' });
      if (pos === 1) addHonor('gp_first_win', { ico: '🏆', name: 'Première Victoire F1', cls: 'chapter-gold' });

      // Record personnel du circuit
      if (!P.gpRecords) P.gpRecords = {};
      const rec = P.gpRecords[GP.selectedCircuit.id] || {};
      const isNewRecord = pos < (rec.bestPos || 99);
      rec.bestPos = Math.min(rec.bestPos || 99, pos);
      P.gpRecords[GP.selectedCircuit.id] = rec;

      document.getElementById('scrQuiz').style.display = 'none';
      document.getElementById('scrGP').style.display = 'flex';
      document.getElementById('gpTitle').textContent = pos === 1 ? '🏆 VICTOIRE HISTORIQUE !' : pos <= 3 ? '🥇 Podium !' : 'Résultat final';
      document.getElementById('gpPhaseBadge').textContent = pos === 1 ? 'P1 🏆' : pos === 2 ? 'P2 🥈' : pos === 3 ? 'P3 🥉' : 'P' + pos;

      const podiumHTML = `
    <div class="gp-podium">
      <div class="gp-podium-slot"><div class="gp-podium-car">⚫</div><div class="gp-podium-block gp-p2-block">2</div></div>
      <div class="gp-podium-slot"><div class="gp-podium-car">${pos === 1 ? GP.selectedConstructor.car : '🏆'}</div><div class="gp-podium-block gp-p1-block" style="background:${GP.selectedConstructor.accent}; color:#000;">1</div></div>
      <div class="gp-podium-slot"><div class="gp-podium-car">🔴</div><div class="gp-podium-block gp-p3-block">3</div></div>
    </div>`;

      document.getElementById('gpBody').innerHTML = `
    <div style="text-align:center;padding:24px 16px; background:#12121c; color:#fff;">
      <div style="font-size:64px;margin-bottom:8px">${pos === 1 ? '🏆' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : '🏎️'}</div>
      <div style="font-size:28px;font-weight:900;color:${pos <= 3 ? 'var(--gold)' : '#fff'};margin-bottom:4px">P${pos}</div>
      <div style="font-size:14px;color:var(--muted);font-weight:700;margin-bottom:20px">${pos === 1 ? 'Victoire d\'élite ! Tu as dominé l\'asphalte !' : pos <= 3 ? 'Magnifique course, tu montes sur le podium !' : 'Belle combativité, la saison est encore longue !'}</div>
      ${pos <= 3 ? podiumHTML : ''}
      <div style="display:flex;gap:12px;justify-content:center;margin-bottom:24px;flex-wrap:wrap">
        <div style="background:#1e1e2f;border:2px solid var(--orange);border-radius:16px;padding:16px 20px;text-align:center"><div style="font-size:22px;font-weight:900;color:var(--orange-d)">+${Q.totalXP}</div><div style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase">XP</div></div>
        <div style="background:#1e1e2f;border:2px solid var(--blue);border-radius:16px;padding:16px 20px;text-align:center"><div style="font-size:22px;font-weight:900;color:var(--blue-d)">${Math.round((Q.correct / Q.qs.length) * 100)}%</div><div style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase">Préc.</div></div>
        ${GP.fastestLap ? `<div style="background:#1e1e2f;border:2px solid #b25ce0;border-radius:16px;padding:16px 20px;text-align:center"><div style="font-size:22px;font-weight:900;color:#b25ce0">🟣 Oui</div><div style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase">Meilleur tour (+10💎)</div></div>` : ''}
        ${isNewRecord ? `<div style="background:#1e1e2f;border:2px solid var(--green);border-radius:16px;padding:16px 20px;text-align:center"><div style="font-size:22px;font-weight:900;color:var(--green)">⭐ P${rec.bestPos}</div><div style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase">Record circuit</div></div>` : ''}
        ${podium ? `<div style="background:var(--gold);border:2px solid var(--gold-d);border-radius:16px;padding:16px 20px;text-align:center"><div style="font-size:22px;font-weight:900;color:#1a1a2e">+${(4 - pos) * 20}</div><div style="font-size:10px;font-weight:800;color:#1a1a2e;text-transform:uppercase">💎 Bonus</div></div>` : ''}
      </div>
      <button class="modal-btn" style="background:var(--purple);box-shadow:0 5px 0 var(--purple-d)" onclick="finishGP()">Retour à l'accueil</button>
      <button class="modal-btn-ghost" onclick="restartGP()">🔄 Rejouer</button>
    </div>`;

      // (totalQ est maintenant compté question par question dans recordCatStat)
      addXP(Q.totalXP);
      if (podium) P.gems += (4 - pos) * 20;
      checkAchievements(); save();
    }

    function finishGP() {
      audioF1.stopEngine();
      if (GP.animFrameId) cancelAnimationFrame(GP.animFrameId);
      GP.phase = 'select_team';
      GP.pitstopDone = [];
      GP.pitstopBoost = 0;
      GP.drsActive = false;
      GP.drsAvailable = false;
      GP.scLapsLeft = 0;
      GP.fastestLap = false;
      document.getElementById('scrGP').classList.remove('active');
      document.getElementById('confettiWrap').innerHTML = '';
      startApp();
    }

    function restartGP() {
      if (GP.animFrameId) cancelAnimationFrame(GP.animFrameId);
      document.getElementById('confettiWrap').innerHTML = '';
      startGrandPrix();
    }

    function exitGP() { finishGP(); }

    // =====================================================
    // === GRAND PRIX — AMÉLIORATIONS AVANCÉES ===
    // =====================================================

    // ===== AUDIO F1 MOTEUR (Web Audio API) =====
    const audioF1 = {
      _ctx: null,
      _getCtx() {
        if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        return this._ctx;
      },
      // Moteur désactivé — pas de son continu
      startEngine(rpm = 0.5) { GP.rpmLevel = rpm; },
      setRPM(rpm) { GP.rpmLevel = Math.max(0.1, Math.min(1.0, rpm)); },
      boostRPM() { GP.rpmLevel = Math.min(1.0, GP.rpmLevel + 0.3); setTimeout(() => { GP.rpmLevel = Math.max(0.1, GP.rpmLevel - 0.1); }, 400); },
      brakeRPM() { GP.rpmLevel = Math.max(0.1, GP.rpmLevel - 0.2); },
      stopEngine() { /* rien à arrêter */ },
      // Séquence des feux de départ F1 (5 bips graves puis bip aigu)
      playLightsSequence(onGo) {
        try {
          const ctx = this._getCtx();
          const beep = (freq, start, dur, vol = 0.3) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = freq;
            g.gain.setValueAtTime(vol, ctx.currentTime + start);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
            o.connect(g); g.connect(ctx.destination);
            o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur);
          };
          // 5 feux rouges — bips graves
          [0, 0.6, 1.2, 1.8, 2.4].forEach((t) => beep(180, t, 0.4, 0.4));
          // Extinction des feux — bip aigu départ
          setTimeout(() => { beep(880, 0, 0.15, 0.5); beep(1100, 0.12, 0.2, 0.5); if (onGo) onGo(); }, 3200);
        } catch (e) { if (onGo) onGo(); }
      },
      // G-Force vibration
      vibrateGForce(intensity = 1) {
        if (!navigator.vibrate) return;
        navigator.vibrate(intensity > 0.8 ? [20, 10, 20] : intensity > 0.5 ? [10, 5] : 5);
      }
    };

    // ===== MÉTÉO DYNAMIQUE =====
    function rollWeather() {
      GP.weather = Math.random() < 0.35 ? 'rain' : 'sunny';
    }

    function selectTire(id) {
      GP.selectedTire = id;
      document.querySelectorAll('.tire-card').forEach(c => c.classList.remove('selected'));
      const el = document.getElementById('tireOpt_' + id);
      if (el) el.classList.add('selected');
    }

    // ===== PITSTOP MINI-JEU (avec choix du nouveau composé) =====
    let _pitstopState = { nuts: 0, target: 3, timeLimit: 2500, startTime: 0, timer: null, resolve: null, newTire: 'medium' };

    function triggerPitstop(questionIndex) {
      return new Promise(resolve => {
        _pitstopState.nuts = 0;
        _pitstopState.target = hasTalent('t_pitstop') ? 2 : 3;
        _pitstopState.startTime = Date.now();
        _pitstopState.resolve = resolve;
        _pitstopState.newTire = GP.weather === 'rain' ? 'rain' : 'medium';
        // Stop la course momentanément
        if (GP.animFrameId) cancelAnimationFrame(GP.animFrameId);
        const overlay = document.getElementById('pitstopOverlay');
        const sub = document.getElementById('pitstopSub');
        const countdown = document.getElementById('pitstopCountdown');
        const result = document.getElementById('pitstopResult');
        const fill = document.getElementById('pitstopTimerFill');
        const nut = document.getElementById('pitstopNut');
        sub.innerHTML = `Clique les boulons aussi vite que possible ! (${_pitstopState.target} boulons)
      <div style="display:flex; gap:6px; justify-content:center; margin-top:10px;">
        ${['soft', 'medium', 'hard', 'rain'].map(t => `
          <button class="pitstop-tire-btn ${_pitstopState.newTire === t ? 'sel' : ''}" data-tire="${t}"
            onclick="pickPitstopTire('${t}')">${{ soft: '🔴', medium: '🟡', hard: '⚪', rain: '🔵' }[t]} ${{ soft: 'Tendre', medium: 'Medium', hard: 'Dur', rain: 'Pluie' }[t]}</button>`).join('')}
      </div>`;
        countdown.textContent = '3';
        result.textContent = '';
        nut.style.display = 'inline-block';
        nut.className = 'pitstop-nut';
        fill.style.width = '100%';
        overlay.classList.add('show');
        // Compte à rebours visuel
        let c = 3;
        const ci = setInterval(() => {
          c--;
          if (c > 0) countdown.textContent = c;
          else { clearInterval(ci); countdown.textContent = '🔧 GO !'; startPitstopTimer(); }
        }, 600);
      });
    }

    function pickPitstopTire(id) {
      _pitstopState.newTire = id;
      document.querySelectorAll('.pitstop-tire-btn').forEach(b => b.classList.toggle('sel', b.dataset.tire === id));
    }

    function startPitstopTimer() {
      const fill = document.getElementById('pitstopTimerFill');
      _pitstopState.startTime = Date.now();
      _pitstopState.timer = setInterval(() => {
        const elapsed = Date.now() - _pitstopState.startTime;
        const pct = Math.max(0, 100 - (elapsed / _pitstopState.timeLimit) * 100);
        if (fill) fill.style.width = pct + '%';
        if (pct <= 0) finishPitstop(false);
      }, 50);
    }

    function clickPitstopNut() {
      if (!_pitstopState.timer) return;
      _pitstopState.nuts++;
      const nut = document.getElementById('pitstopNut');
      if (nut) { nut.className = 'pitstop-nut clicked'; setTimeout(() => { nut.className = 'pitstop-nut'; }, 200); }
      audio._beep(440 + _pitstopState.nuts * 80, 0.08, 'square', 0.2);
      if (_pitstopState.nuts >= _pitstopState.target) finishPitstop(true);
    }

    function finishPitstop(success) {
      clearInterval(_pitstopState.timer);
      _pitstopState.timer = null;
      const elapsed = Date.now() - _pitstopState.startTime;
      const result = document.getElementById('pitstopResult');
      const nut = document.getElementById('pitstopNut');
      if (nut) nut.style.display = 'none';
      GP.pitstopDone.push(Q.idx);
      // Nouveau train de pneus : l'usure repart de zéro (arrêt raté = montage bâclé)
      GP.selectedTire = _pitstopState.newTire;
      GP.tireWear = success ? 3 : 35;
      GP._wearWarnRadioed = false;
      GP._wearFlatRadioed = false;
      if (success && elapsed < 2500) {
        result.textContent = `⚡ Arrêt parfait ! (${(elapsed / 1000).toFixed(2)}s) ${_pitstopState.newTire} monté + Boost !`;
        result.style.color = 'var(--green)';
        GP.pitstopBoost = 0.015;
        showToast('🔧 Arrêt express ! Boost de vitesse activé !');
      } else {
        result.textContent = '💨 Arrêt lent ! Perte de terrain !';
        result.style.color = 'var(--red)';
        GP.pitstopBoost = -0.03;
        // Perd du terrain
        const player = GP.drivers.find(d => d.isPlayer);
        if (player) player.targetProgress -= 0.04;
        showToast('🔧 Arrêt aux stands raté ! Tu perds du terrain !');
      }
      setTimeout(() => {
        document.getElementById('pitstopOverlay').classList.remove('show');
        startGPAnimation(); // Relance l'animation
        if (_pitstopState.resolve) _pitstopState.resolve(success);
      }, 1500);
    }

    // ===== DRS SYSTEM (règle F1 : à moins d'1 seconde de la voiture devant) =====
    function checkDRS() {
      const player = GP.drivers.find(d => d.isPlayer);
      if (!player) return;
      const playerIdx = GP.drivers.findIndex(d => d.isPlayer);
      if (playerIdx <= 0) { GP.drsAvailable = false; updateDRSButton(); return; }
      const carAhead = GP.drivers[playerIdx - 1];
      if (carAhead && carAhead.out) { GP.drsAvailable = false; updateDRSButton(); return; }
      const gapTime = (carAhead.progress - player.progress) * 1.5;
      GP.drsAvailable = gapTime < 1.0 && gapTime >= 0 && (GP.drsUsesLeft === undefined || GP.drsUsesLeft > 0);
      updateDRSButton();
    }

    function updateDRSButton() {
      const btn = document.getElementById('gpDrsBtn');
      if (!btn) return;
      if (GP.drsAvailable && !GP.drsActive) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }

    function activateDRS() {
      if (!GP.drsAvailable || GP.drsActive) return;
      GP.drsActive = true;
      GP.drsAvailable = false;
      if (GP.drsUsesLeft !== undefined) GP.drsUsesLeft--;
      const btn = document.getElementById('gpDrsBtn');
      if (btn) btn.classList.remove('show');
      showToast('🏎️ DRS activé ! Double progression — mais temps réduit de moitié !');
      audioF1.boostRPM();
    }

    // ===== RAIN EFFECTS ON SVG =====
    function addRainToSVG() {
      const svg = document.getElementById('gpSvg');
      if (!svg || GP.weather !== 'rain') return;
      // Teinte asphalte mouillé
      const trackBg = document.getElementById('gpTrackBg');
      if (trackBg) trackBg.setAttribute('stroke', '#3a4a6a');
      // Gouttes de pluie
      for (let i = 0; i < 12; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', Math.random() * 500);
        line.setAttribute('y1', Math.random() * 500);
        line.setAttribute('x2', parseFloat(line.getAttribute('x1')) + 4);
        line.setAttribute('y2', parseFloat(line.getAttribute('y1')) + 12);
        line.setAttribute('stroke', 'rgba(150,200,255,0.5)');
        line.setAttribute('stroke-width', '1.5');
        line.classList.add('rain-drop');
        line.style.animationDuration = (0.3 + Math.random() * 0.4) + 's';
        line.style.animationDelay = (Math.random() * 0.5) + 's';
        svg.appendChild(line);
      }
    }

    function removeRainFromSVG() {
      const svg = document.getElementById('gpSvg');
      if (!svg) return;
      svg.querySelectorAll('.rain-drop').forEach(l => l.remove());
      const trackBg = document.getElementById('gpTrackBg');
      if (trackBg) trackBg.removeAttribute('stroke');
    }

    function renderWeatherBar() {
      const isRain = GP.weather === 'rain';
      const tireType = GP.selectedTire || 'medium';
      const tireLabel = { soft: 'Tendres 🔴', medium: 'Médiums 🟡', hard: 'Durs ⚪', rain: 'Pluie 🔵' }[tireType];
      const tireClass = { soft: 'tire-soft', medium: '', hard: 'tire-hard', rain: 'tire-rain' }[tireType];
      const mismatch = (isRain && tireType !== 'rain') || (!isRain && tireType === 'rain');
      const wearPct = Math.round(GP.tireWear || 0);
      const wearColor = wearPct >= 90 ? 'var(--red)' : wearPct >= 60 ? 'var(--orange)' : 'var(--green)';
      return `
    <div class="gp-weather-bar">
      <div class="gp-weather-ico">${isRain ? '🌧️' : '☀️'}</div>
      <div class="gp-weather-label">${isRain ? 'Pluie' : 'Sec'} ${mismatch ? '⚠️' : ''}</div>
      <div class="gp-tire-status ${tireClass}" style="${tireType === 'hard' ? 'background:#e8e8e8;color:#000;' : (!tireClass ? 'background:#e5b400;color:#fff;' : '')}">
        ${tireLabel} · ${wearPct}%
      </div>
    </div>`;
    }

    function renderTireSelector(onSelect, onConfirm) {
      const isRain = GP.weather === 'rain';
      const tires = [
        { id: 'soft', ico: '🔴', name: 'Tendres', desc: 'Rapides mais s\'usent vite (15%/tour)' },
        { id: 'medium', ico: '🟡', name: 'Médiums', desc: 'Équilibrés (10%/tour)' },
        { id: 'hard', ico: '⚪', name: 'Durs', desc: 'Lents mais endurants (6%/tour)' },
        { id: 'rain', ico: '🔵', name: 'Pluie (Wet)', desc: isRain ? 'Optimal sous la pluie' : 'Risque fort : météo changeante !' },
      ];
      return `
    <div style="text-align:center;margin-bottom:12px;">
      <div style="font-size:18px;font-weight:900;color:#fff">${isRain ? '🌧️ Conditions pluvieuses !' : '☀️ Circuit sec'}</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:700;margin-top:4px">
        ${isRain ? 'Choisir les bons pneus ou risquer une sous-performance !' : 'Optimise ta stratégie de gommes — surveille l\'usure.'}
      </div>
    </div>
    <div class="tire-grid">
      ${tires.map(t => `
        <div class="tire-card ${GP.selectedTire === t.id ? 'selected' : ''}" id="tireOpt_${t.id}" onclick="selectTire('${t.id}')">
          <span class="tire-ico">${t.ico}</span>
          <div class="tire-name">${t.name}</div>
          <div class="tire-desc">${t.desc}</div>
        </div>`).join('')}
    </div>`;
    }

    // ===== PITSTOP À LA DEMANDE : le moteur appelle renderGPActiveQuestion
    // directement (pitstop sur demande via le bouton Box, ou forcé au tour 7).
    function confirmTireAndStartQual() {
      GP.phase = 'qual_intro';
      document.getElementById('gpPhaseBadge').textContent = 'Qualif';
      document.getElementById('gpTitle').textContent = '🏎️ Grand Prix — Qualifications';
      renderGPQualIntro();
    }

    // =====================================================
    // === CHAMPIONNAT DU MONDE ===
    // =====================================================

    const CHAMP_CIRCUITS = ['australia', 'monaco', 'spa', 'monza', 'silverstone', 'suzuka'];
    const CHAMP_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    const CHAMP_DIFFS = {
      easy:   { label: '🟢 Facile',    mult: 0.88 },
      normal: { label: '🟠 Normal',    mult: 1.00 },
      hard:   { label: '🔴 Difficile', mult: 1.10 },
    };

    // Répliques du rival au dernier GP quand le titre se joue
    const RIVAL_QUOTES = [
      'Ce titre est à moi. Tu as fait le voyage pour rien.',
      'La pluie ? Elle lave aussi les rêves, mon ami.',
      'Tu as bien couru cette saison. Mais aujourd\'hui, je ne perds pas.',
      'Regarde bien mon aileron arrière : c\'est la dernière chose que tu verras.',
    ];

    // Plateau complet : 2 pilotes par écurie (16 pilotes), le joueur prend le
    // siège titulaire de l'écurie choisie.
    function buildChampDrivers() {
      const drivers = [];
      const playerTeam = P.championship.constructorId;
      GP_CONSTRUCTORS.forEach(t => {
        if (t.id === playerTeam) {
          drivers.push({ id: 'player', constructorId: t.id, pilot: P.name, car: t.car, tag: t.tag, ai: t.aiAccuracy, isPlayer: true });
          drivers.push({ id: t.id + '_2', constructorId: t.id, pilot: t.pilot2, car: t.car, tag: t.tag, ai: t.aiAccuracy * 0.96, isPlayer: false });
        } else {
          drivers.push({ id: t.id + '_1', constructorId: t.id, pilot: t.pilot, car: t.car, tag: t.tag, ai: t.aiAccuracy, isPlayer: false });
          drivers.push({ id: t.id + '_2', constructorId: t.id, pilot: t.pilot2, car: t.car, tag: t.tag, ai: t.aiAccuracy * 0.95, isPlayer: false });
        }
      });
      return drivers;
    }

    function initChampStandings() {
      P.championship.standings = buildChampDrivers().map(d => ({
        id: d.id, constructorId: d.constructorId, pilot: d.pilot, car: d.car, tag: d.tag, pts: 0,
      }));
    }

    function champDriverSorted() {
      return [...(P.championship.standings || [])].sort((a, b) => b.pts - a.pts);
    }

    function champConstructorStandings() {
      const agg = {};
      (P.championship.standings || []).forEach(s => {
        agg[s.constructorId] = (agg[s.constructorId] || 0) + s.pts;
      });
      return Object.entries(agg).map(([cid, pts]) => {
        const t = GP_CONSTRUCTORS.find(x => x.id === cid) || { name: cid, car: '🏎️', tag: '---' };
        return { id: cid, name: t.name, car: t.car, tag: t.tag, pts };
      }).sort((a, b) => b.pts - a.pts);
    }

    function champRivalInfo() {
      const ch = P.championship;
      if (!ch.rivalId) return null;
      const rival = (ch.standings || []).find(s => s.id === ch.rivalId);
      const me = (ch.standings || []).find(s => s.id === 'player');
      if (!rival || !me) return null;
      return { rival, gap: me.pts - rival.pts };
    }

    // R&D de l'écurie + duel de coéquipier : champs créés à la volée
    function ensureChampExtras() {
      if (!P.championship.rd) P.championship.rd = { pts: 0, speed: 0, rel: 0 };
    }

    function champTeammateInfo() {
      const ch = P.championship;
      if (!ch.constructorId) return null;
      const me = (ch.standings || []).find(s => s.id === 'player');
      const tm = (ch.standings || []).find(s => s.id === ch.constructorId + '_2');
      if (!me || !tm) return null;
      return { me, tm, gap: me.pts - tm.pts };
    }

    function champUpgradeRD(key) {
      ensureChampExtras();
      const rd = P.championship.rd;
      if (rd[key] >= 5) { showToast('Niveau maximum atteint !'); return; }
      if (rd.pts < 3) { showToast('🔬 Il faut 3 points de développement — réponds juste en course !'); return; }
      rd.pts -= 3; rd[key]++;
      save();
      audio.playTreasure();
      renderChampionshipScreen();
      showToast(key === 'speed' ? '⚡ Moteur amélioré : +4 % de progression par bonne réponse !' : '🛡️ Fiabilité améliorée : les pannes te tomberont moins dessus !');
    }

    function setChampDifficulty(diff) {
      P.championship.difficulty = diff;
      save();
      renderChampionshipScreen();
    }

    function startChampionship() {
      if (!P.championship) P.championship = {};
      P.championship.difficulty = P.championship.difficulty || 'normal';
      P.championship.season = P.championship.season || 1;
      if (P.championship.active && P.championship.currentRace < CHAMP_CIRCUITS.length) {
        // Garde-fou : sauvegarde d'une ancienne version (8 entrées) → réinitialise
        if (!P.championship.standings || P.championship.standings.length !== GP_CONSTRUCTORS.length * 2) {
          initChampStandings();
        }
        showChampionshipScreen();
        return;
      }
      // Nouvelle saison
      P.championship.active = true;
      P.championship.currentRace = 0;
      P.championship.races = [];
      P.championship._seasonNotes = [];
      ensureChampExtras();
      if (P.championship.nextTeamId) {
        P.championship.constructorId = P.championship.nextTeamId;
        P.championship.nextTeamId = null;
      } else {
        P.championship.constructorId = null;
      }
      initChampStandings();
      // Rival désigné : le pilote le plus fort du plateau (hors joueur)
      const better = buildChampDrivers().filter(d => !d.isPlayer).sort((a, b) => b.ai - a.ai);
      P.championship.rivalId = better.length ? better[0].id : null;
      save();
      showChampionshipScreen();
    }

    function showChampionshipScreen() {
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
      document.getElementById('scrChampionship').classList.add('active');
      renderChampionshipScreen();
      updateChampStatusLabel();
    }

    function updateChampStatusLabel() {
      const lbl = document.getElementById('champStatusLabel');
      if (!lbl) return;
      if (P.championship && P.championship.active && P.championship.currentRace < CHAMP_CIRCUITS.length) {
        lbl.textContent = `Saison ${P.championship.season} — GP ${P.championship.currentRace + 1}/${CHAMP_CIRCUITS.length} en cours`;
      } else {
        lbl.textContent = `${CHAMP_CIRCUITS.length} Grands Prix — Gloire éternelle !`;
      }
    }

    function renderChampionshipScreen() {
      const ch = P.championship;
      document.getElementById('champSeasonBadge').textContent = `Saison ${ch.season}`;
      const champCircuits = CHAMP_CIRCUITS.map(id => GP_CIRCUITS.find(c => c.id === id));
      const driversSorted = champDriverSorted();
      const consSorted = champConstructorStandings();
      const rivalInfo = champRivalInfo();
      const diff = CHAMP_DIFFS[ch.difficulty] || CHAMP_DIFFS.normal;

      // ── Bandeau rival + difficulté ──
      let topHTML = `<div style="background:#1e1e2f;border:2px solid var(--border);border-radius:16px;padding:12px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
      <div style="font-size:13px;font-weight:800;color:#fff">
        ${rivalInfo ? `⚔️ Rival : <b style="color:var(--gold)">${rivalInfo.rival.pilot}</b> — ${rivalInfo.gap >= 0 ? `tu mènes de <b style="color:var(--green)">${rivalInfo.gap} pts</b>` : `tu es mené de <b style="color:var(--red)">${-rivalInfo.gap} pts</b>`}` : '⚔️ Choisis ton écurie pour désigner ton rival'}
      </div>
      <div style="display:flex; gap:6px;">
        ${Object.entries(CHAMP_DIFFS).map(([k, d]) =>
          `<button class="champ-diff-btn" data-on="${ch.difficulty === k ? 1 : 0}" onclick="setChampDifficulty('${k}')">${d.label}</button>`).join('')}
      </div>
    </div>`;

      // ── Duel interne : ton coéquipier ──
      let mateHTML = '';
      const mate = champTeammateInfo();
      if (mate && ch.currentRace < CHAMP_CIRCUITS.length) {
        const lead = mate.gap === 0 ? 'à égalité parfaite'
          : mate.gap > 0 ? `tu mènes de <b style="color:var(--green)">${mate.gap} pts</b>`
          : `tu es mené de <b style="color:var(--red)">${-mate.gap} pts</b>`;
        mateHTML = `<div style="background:#1e1e2f;border:2px solid var(--border);border-radius:16px;padding:10px 12px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div style="font-size:12px;font-weight:800;color:#fff">🤝 Duel interne — <b style="color:var(--gold)">${mate.tm.pilot}</b> (coéquipier)<br>
            <span style="color:rgba(255,255,255,.6)">Toi ${mate.me.pts} pts — lui ${mate.tm.pts} pts : ${lead}</span></div>
          <div style="font-size:10px;color:rgba(255,255,255,.45);font-weight:700;text-align:right;line-height:1.4">Le dominer en fin<br>de saison = +30 💎</div>
        </div>`;
      }

      // ── R&D de l'écurie : développe ta monoplace entre les GP ──
      let rdHTML = '';
      if (ch.constructorId && ch.currentRace < CHAMP_CIRCUITS.length) {
        ensureChampExtras();
        const rd = P.championship.rd;
        const rdBtn = (key, ico, label) => {
          const maxed = rd[key] >= 5, poor = rd.pts < 3;
          return `<button class="champ-diff-btn" ${maxed || poor ? 'style="opacity:.45"' : ''} onclick="champUpgradeRD('${key}')">${ico} ${label} ${rd[key]}/5 ${maxed ? 'MAX' : '(3 pts)'}</button>`;
        };
        rdHTML = `<div style="background:#1e1e2f;border:2px solid var(--purple);border-radius:16px;padding:10px 12px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
          <div style="font-size:12px;font-weight:800;color:#fff">🔬 R&amp;D de l'écurie — <b style="color:var(--purple)">${rd.pts} pt${rd.pts > 1 ? 's' : ''}</b> de développement
            <br><span style="color:rgba(255,255,255,.5);font-size:10px;font-weight:700">1 pt par bonne réponse en course — améliore ta monoplace</span></div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">${rdBtn('speed', '⚡', 'Moteur')}${rdBtn('rel', '🛡️', 'Fiabilité')}</div>
        </div>`;
      }

      // ── Sélection de l'écurie si pas encore faite ──
      let teamSelectHTML = '';
      if (!ch.constructorId) {
        teamSelectHTML = `
      <div style="font-size:13px;font-weight:900;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin:8px 0 8px">🏎️ Choisir ton Écurie</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
        ${GP_CONSTRUCTORS.map(t => `
          <div class="gp-select-card" id="champTeam_${t.id}" onclick="selectChampTeam('${t.id}')" style="padding:10px;gap:8px;">
            <div style="font-size:22px;">${t.car}</div>
            <div style="flex:1;">
              <div style="font-weight:900;font-size:12px;color:#fff">${t.tag}</div>
              <div style="font-size:10px;color:rgba(255,255,255,0.5)">${t.pilot} / ${t.pilot2}</div>
            </div>
          </div>`).join('')}
      </div>`;
      }

      // ── Classement Pilotes ──
      let standingsHTML = `<div style="font-size:13px;font-weight:900;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin:8px 0 8px">🥇 Classement Pilotes</div>
    <div class="champ-table">`;
      driversSorted.forEach((d, i) => {
        const isMe = d.id === 'player';
        const isRival = ch.rivalId === d.id;
        const pc = i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : '';
        const dotsHTML = champCircuits.map((_, ri) => {
          if (ri < ch.races.length) {
            const r = ch.races[ri];
            const idx = r.positions && r.positions[d.id] !== undefined ? r.positions[d.id] : 99;
            const pts = CHAMP_POINTS[idx] || 0;
            const cls = pts >= 25 ? 'win' : pts >= 10 ? 'pod' : 'pts';
            return `<div class="champ-gp-dot ${cls}">${pts || '-'}</div>`;
          }
          if (ri === ch.currentRace) return `<div class="champ-gp-dot next">▶</div>`;
          return `<div class="champ-gp-dot next">—</div>`;
        }).join('');
        standingsHTML += `<div class="champ-row ${isMe ? 'player' : ''} ${isRival ? 'rival' : ''}">
      <div class="champ-pos ${pc}">${i + 1}</div>
      <div class="champ-car">${d.car}</div>
      <div class="champ-name ${isMe ? 'you' : ''}">${isMe ? `${d.pilot} (VOUS)` : d.pilot}${isRival ? ' ⚔️' : ''}</div>
      <div class="champ-gp-dots">${dotsHTML}</div>
      <div class="champ-pts">${d.pts}</div>
    </div>`;
      });
      standingsHTML += '</div>';

      // ── Classement Constructeurs ──
      let consHTML = `<div style="font-size:13px;font-weight:900;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px">🏭 Classement Constructeurs</div>
    <div class="champ-table">`;
      consSorted.forEach((t, i) => {
        const isMine = t.id === ch.constructorId;
        const pc = i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : '';
        consHTML += `<div class="champ-row ${isMine ? 'player' : ''}">
      <div class="champ-pos ${pc}">${i + 1}</div>
      <div class="champ-car">${t.car}</div>
      <div class="champ-name">${t.name}</div>
      <div class="champ-pts">${t.pts}</div>
    </div>`;
      });
      consHTML += '</div>';

      // ── Calendrier ──
      let calendarHTML = `<div style="font-size:13px;font-weight:900;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px">📅 Calendrier de la Saison</div>
    <div class="gp-calendar-grid">`;
      champCircuits.forEach((circuit, i) => {
        const isDone = i < ch.currentRace;
        const isCurrent = i === ch.currentRace;
        const raceResult = ch.races[i];
        calendarHTML += `<div class="gp-race-card ${isDone ? 'done' : isCurrent ? 'current' : ''} ${!isCurrent ? 'locked' : ''}" onclick="${isCurrent ? 'launchChampRace(' + i + ')' : ''}">
      <div class="gp-race-card-pos ${isDone ? 'done' : ''}">${isDone && raceResult ? 'P' + raceResult.pos : i + 1}</div>
      <div style="font-size:22px;">${isDone ? '✅' : isCurrent ? '▶️' : '🔒'}</div>
      <div style="flex:1;">
        <div style="font-weight:900;font-size:13px;color:#fff">${circuit.name}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.5);font-weight:700">${circuit.length}</div>
        ${isDone && raceResult ? `<div class="gp-race-pts">P${raceResult.pos} — +${raceResult.pts} pts${raceResult.fastestLap ? ' 🟣' : ''}</div>` : ''}
      </div>
      ${isCurrent ? `<div style="background:var(--green);color:#fff;padding:6px 12px;border-radius:10px;font-size:12px;font-weight:900;">COURIR !</div>` : ''}
    </div>`;
      });
      calendarHTML += '</div>';

      // ── Fin de saison : champion, palmarès, offres de carrière ──
      let actionHTML = '';
      if (ch.currentRace >= CHAMP_CIRCUITS.length) {
        const champDriver = driversSorted[0];
        const isChamp = champDriver.id === 'player';
        const champCons = consSorted[0];
        const meFinal = driversSorted.findIndex(d => d.id === 'player') + 1;
        const mePts = (driversSorted.find(d => d.id === 'player') || {}).pts || 0;

        actionHTML = `
      <div style="background:#1e1e2f;border:2px solid var(--gold);border-radius:16px;padding:24px;text-align:center;margin-top:16px;">
        <div style="font-size:48px">${isChamp ? '🏆' : '🎖️'}</div>
        <div style="font-size:20px;font-weight:900;color:var(--gold);margin:8px 0">${isChamp ? '🎊 CHAMPION DU MONDE !' : 'Saison Terminée'}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.6);font-weight:700;margin-bottom:8px">
          ${isChamp ? `Bravo ${P.name} ! Titre de la Saison ${ch.season} décroché !` : `Champion : ${champDriver.pilot} (${champDriver.pts} pts) — Toi : P${meFinal} avec ${mePts} pts`}
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:14px">
          🏭 Constructeur champion : ${champCons.car} ${champCons.name} (${champCons.pts} pts)
        </div>
        ${(ch._seasonNotes || []).length ? `<div style="text-align:left;font-size:12px;font-weight:700;color:#fff;background:rgba(255,255,255,.05);border-radius:12px;padding:10px 12px;margin-bottom:12px">${ch._seasonNotes.map(n => `<div style="margin:4px 0">${n}</div>`).join('')}</div>` : ''}
        ${renderCareerBlock()}
      </div>`;
      }

      document.getElementById('champBody').innerHTML = topHTML + mateHTML + rdHTML + teamSelectHTML + standingsHTML + consHTML + calendarHTML + actionHTML;
    }

    // ===== CARRIÈRE : palmarès + offres d'écuries en fin de saison =====
    function buildCareerOffers() {
      const ch = P.championship;
      const myTeam = GP_CONSTRUCTORS.find(t => t.id === ch.constructorId);
      if (!myTeam) return [];
      const betterTeams = GP_CONSTRUCTORS
        .filter(t => t.aiAccuracy > myTeam.aiAccuracy)
        .sort((a, b) => a.aiAccuracy - b.aiAccuracy);
      const driversSorted = champDriverSorted();
      const mePos = driversSorted.findIndex(d => d.id === 'player') + 1;
      // Une bonne saison attire les grandes écuries : top 5 => offre du meilleur
      // constructeur disponible ; sinon offre de l'étage juste au-dessus.
      if (mePos <= 5 && betterTeams.length > 0) {
        return [betterTeams[betterTeams.length - 1]];
      }
      if (mePos <= 10 && betterTeams.length > 0) {
        return [betterTeams[0]];
      }
      return [];
    }

    function renderCareerBlock() {
      const ch = P.championship;
      const offers = buildCareerOffers();
      const myTeam = GP_CONSTRUCTORS.find(t => t.id === ch.constructorId);
      const topTier = myTeam && myTeam.aiAccuracy >= 0.81;
      let html = '';
      if (offers.length > 0) {
        const t = offers[0];
        html += `
      <div class="gp-offer-card">
        <div style="font-size:12px;font-weight:900;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">📄 Offre de contrat</div>
        <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:4px">${t.car} ${t.name}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.6);font-weight:700;margin-bottom:12px">
          "Ta saison nous a convaincus. Rejoins ${t.pilot} dans la ${t.name} !"
        </div>
        <button class="modal-btn" style="background:var(--green);color:#fff;box-shadow:0 4px 0 var(--green-d);padding:10px" onclick="acceptCareerOffer('${t.id}')">✍️ Signer chez ${t.tag}</button>
      </div>`;
      } else if (topTier) {
        html += `<div style="font-size:12px;color:rgba(255,255,255,0.6);font-weight:700;margin-bottom:12px">⭐ Les grandes écuries te réclament : tu reconduis ici pour la saison suivante.</div>`;
      }
      // Palmarès
      const career = ch.career || [];
      if (career.length > 0) {
        html += `<div style="font-size:12px;font-weight:900;color:var(--gold);text-transform:uppercase;margin:14px 0 6px">📜 Palmarès</div>`;
        html += career.slice(-5).reverse().map(c => {
          const t = GP_CONSTRUCTORS.find(x => x.id === c.teamId) || { car: '🏎️', tag: '---' };
          return `<div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#fff;background:rgba(255,255,255,0.05);border-radius:10px;padding:8px 12px;margin-bottom:4px">
          <span>Saison ${c.season} · ${t.car} ${t.tag}</span>
          <span>${c.title ? '🏆 Champion' : 'P' + c.pos} — ${c.pts} pts</span>
        </div>`;
        }).join('');
      }
      return html;
    }

    function acceptCareerOffer(teamId) {
      P.championship.nextTeamId = teamId;
      const t = GP_CONSTRUCTORS.find(x => x.id === teamId);
      save();
      showToast(`✍️ Contrat signé chez ${t.name} ! Rendez-vous la saison prochaine.`, 4000);
      renderChampionshipScreen();
    }

    function selectChampTeam(id) {
      P.championship.constructorId = id;
      initChampStandings();
      // Rival après le choix d'écurie
      const better = buildChampDrivers().filter(d => !d.isPlayer).sort((a, b) => b.ai - a.ai);
      P.championship.rivalId = better.length ? better[0].id : null;
      save();
      renderChampionshipScreen();
    }

    function launchChampRace(raceIdx) {
      if (!P.championship.constructorId) { showToast('Choisis d\'abord ton écurie !'); return; }
      const circuitId = CHAMP_CIRCUITS[raceIdx];
      const circuit = GP_CIRCUITS.find(c => c.id === circuitId);
      const team = GP_CONSTRUCTORS.find(t => t.id === P.championship.constructorId) || GP_CONSTRUCTORS[0];
      GP = { phase: 'select_team', qualScore: 0, position: 8, selectedConstructor: team, selectedCircuit: circuit, drivers: [], animFrameId: null, weather: 'sunny', selectedTire: 'medium', drsActive: false, drsAvailable: false, pitstopDone: [], pitstopBoost: 0, rpmLevel: 0.5, tireWear: 0, fastestLap: false, scLapsLeft: 0, boxRequested: false };
      GP._champMode = true;
      GP._champRaceIdx = raceIdx;
      GP.diffMult = (CHAMP_DIFFS[P.championship.difficulty] || CHAMP_DIFFS.normal).mult;
      // Ferme toutes les fenêtres ouvertes (l'écran GP est opaque, on ne doit
      // rien voir transparaître derrière — ex. si on vient de la Route)
      document.querySelectorAll('.screen.active').forEach(s => s.classList.remove('active'));
      document.getElementById('gpTitle').textContent = '🏆 Championnat — ' + circuit.name;
      document.getElementById('gpPhaseBadge').textContent = 'Champ. GP ' + (raceIdx + 1);
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
      document.getElementById('scrGP').classList.add('active');
      rollWeather();
      GP.selectedTire = GP.weather === 'rain' ? 'rain' : 'medium';
      // ── Drame de fin de saison : duel pour le titre ou promenade de champion ──
      GP._titleDuel = false; GP._champWalk = false; GP._duelGap = 0;
      ensureChampExtras();
      if (raceIdx === CHAMP_CIRCUITS.length - 1 && (P.championship.standings || []).length) {
        const sorted = champDriverSorted();
        const me = sorted.find(d => d.id === 'player');
        const bestOther = sorted.find(d => d.id !== 'player');
        GP._duelGap = (me.pts || 0) - (bestOther ? bestOther.pts : 0);
        if (Math.abs(GP._duelGap) <= 10) {
          // Le titre se joue sur ce GP : pluie garantie, pas de changement météo
          GP._titleDuel = true;
          GP.weather = 'rain';
          GP.weatherChangeLap = -1;
          GP.selectedTire = 'rain';
        } else if (GP._duelGap > 26) {
          // Mathématiquement champion avant le dernier virage : XP ×2
          GP._champWalk = true;
        }
      }
      GP.phase = 'select_tire';
      const duelBanner = GP._titleDuel
        ? `<div style="background:linear-gradient(135deg,#3d1a05,#1a0a2e);border:2px solid var(--gold);border-radius:14px;padding:12px;margin-bottom:12px;text-align:center">
            <div style="font-size:15px;font-weight:900;color:var(--gold)">⚔️ DUEL POUR LE TITRE ⚔️</div>
            <div style="font-size:11px;font-weight:800;color:#fff;margin-top:4px">${GP._duelGap >= 0 ? `Tu mènes de ${GP._duelGap} pts` : `Tu es mené de ${-GP._duelGap} pts`} — pluie garantie ⛈️, pneus pluie obligatoires !</div>
            <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.65);margin-top:6px;font-style:italic">« ${pickOne(RIVAL_QUOTES)} » — ${champRivalInfo() ? champRivalInfo().rival.pilot : 'Ton rival'}</div>
          </div>`
        : GP._champWalk
          ? `<div style="background:#1e1e2f;border:2px solid var(--gold);border-radius:14px;padding:12px;margin-bottom:12px;text-align:center">
              <div style="font-size:15px;font-weight:900;color:var(--gold)">👑 Promenade de Champion</div>
              <div style="font-size:11px;font-weight:800;color:#fff;margin-top:4px">Titre déjà acquis — ce GP rapporte le double d'XP !</div>
            </div>`
          : '';
      document.getElementById('gpBody').innerHTML = `
    <div style="background:#1e1e2f;border-radius:20px;padding:20px;margin-bottom:16px;border:2px solid var(--gold);">
      <div style="text-align:center;margin-bottom:12px;"><div style="font-size:16px;font-weight:900;color:#fff">🏆 Grand Prix ${raceIdx + 1}/${CHAMP_CIRCUITS.length} — ${circuit.name}</div></div>
      ${duelBanner}
      ${renderTireSelector()}
      <button class="modal-btn" style="background:var(--gold);color:#1a1a2e;box-shadow:0 5px 0 var(--gold-d);margin-top:16px" onclick="confirmTireAndStartQual()">
        Aller aux Qualifications 🚦
      </button>
    </div>`;
    }

    // Résultat de course : enregistrement championnat (points pilotes +
    // constructeurs, point du meilleur tour) et trophées de fin de saison.
    const _origShowGPResult = showGPResult;
    showGPResult = function () {
      _origShowGPResult();
      if (GP._champMode && P.championship.active) {
        const ch = P.championship;
        const raceIdx = GP._champRaceIdx;
        // Classement de la course : les classés par progression, les abandonnés derrière
        const finishers = [...GP.drivers].filter(d => !d.out).sort((a, b) => b.progress - a.progress);
        const posRecord = {};
        finishers.forEach((d, i) => { posRecord[d.id] = i; });
        GP.drivers.filter(d => d.out).forEach((d, i) => { posRecord[d.id] = 10 + i; });

        const myPos = posRecord['player'] + 1;
        let myPts = CHAMP_POINTS[myPos - 1] || 0;
        const inPoints = myPts > 0;
        if (GP.fastestLap && inPoints) myPts += 1;

        // ── Primes de course : podium, victoire, rival battu, promenade ──
        let raceGems = 0; GP._raceGemLines = [];
        if (myPos === 1) { raceGems += 30; GP._raceGemLines.push('🏁 Victoire de course : +30 💎'); }
        else if (myPos === 2) { raceGems += 10; GP._raceGemLines.push('🥈 Podium : +10 💎'); }
        else if (myPos === 3) { raceGems += 5; GP._raceGemLines.push('🥉 Podium : +5 💎'); }
        const rivalPos0 = ch.rivalId !== undefined ? posRecord[ch.rivalId] : undefined;
        if (rivalPos0 !== undefined && rivalPos0 > myPos - 1 && inPoints) { raceGems += 15; GP._raceGemLines.push('⚔️ Rival battu en course : +15 💎'); }
        if (GP._champWalk && Q.totalXP > 0) { addXP(Q.totalXP); GP._raceGemLines.push('👑 Promenade de champion : XP ×2 !'); }
        if (GP._rdEarned) GP._raceGemLines.push(`🔬 +${GP._rdEarned} pt${GP._rdEarned > 1 ? 's' : ''} de R&D à dépenser entre les GP`);
        if (raceGems) P.gems += raceGems;

        ch.races.push({ pos: myPos, pts: myPts, circuit: CHAMP_CIRCUITS[raceIdx], positions: posRecord, fastestLap: GP.fastestLap });

        // Points pilotes d'après la course réellement simulée
        (ch.standings || []).forEach(s => {
          const idx = posRecord[s.id];
          if (idx !== undefined) {
            let p = CHAMP_POINTS[idx] || 0;
            if (GP.fastestLap && p > 0 && s.id === 'player') p += 1;
            s.pts += p;
          } else {
            s.pts += CHAMP_POINTS[Math.floor(Math.random() * 12)] || 0; // sécurité (pilote non en grille)
          }
        });

        ch.currentRace = raceIdx + 1;
        if (ch.currentRace >= CHAMP_CIRCUITS.length) {
          // Fin de saison
          ch.active = false;
          const champDriver = champDriverSorted()[0];
          const isChamp = champDriver.id === 'player';
          if (!ch.career) ch.career = [];
          const meEntry = champDriverSorted().find(d => d.id === 'player') || {};
          const meFinal = champDriverSorted().findIndex(d => d.id === 'player') + 1;
          ch.career.push({ season: ch.season, teamId: ch.constructorId, pos: meFinal, pts: meEntry.pts || 0, title: isChamp });
          if (isChamp) {
            ch.titles = (ch.titles || 0) + 1;
            addHonor('f1_champion', { ico: '👑', name: 'Champion du Monde F1', cls: 'chapter-gold' });
            showToast('🏆 CHAMPION DU MONDE ! Titre décroché !', 4000);
          }
          // ── Notes de fin de saison : duel de titre + duel de coéquipier ──
          ch._seasonNotes = [];
          if (GP._titleDuel) {
            if (isChamp) {
              P.gems += 30;
              ch._seasonNotes.push('⚔️ Duel pour le titre : <b style="color:var(--green)">GAGNÉ</b> dans la pluie — +30 💎');
              setTimeout(() => {
                spawnConfetti(90);
                showBonusPopup('👑', 'DUEL POUR LE TITRE : GAGNÉ !', `Tu as résisté à la pression et à la pluie — Champion du Monde !`,
                  ['👑 Titre de la Saison ' + ch.season, '💎 +30 Gemmes']);
                Companion.say('CHAMPION DANS LA PLUIE !! Quel final, je crie encore ! 🏆🌧️', { mood: 'celebrate', force: true, dur: 4500 });
              }, 1200);
            } else {
              ch._seasonNotes.push('⚔️ Duel pour le titre : perdu au dernier virage…');
              setTimeout(() => Companion.say('Il t\'a eu au finish… mais tu seras plus fort la saison prochaine ! 🦉', { mood: 'sad', force: true, dur: 3800 }), 1200);
            }
          }
          const tmInfo = champTeammateInfo();
          if (tmInfo) {
            if (tmInfo.gap > 0) {
              P.gems += 30;
              addHonor('f1_teammate', { ico: '🤝', name: 'N°1 de son écurie', cls: 'chapter-gold' });
              ch._seasonNotes.push(`🤝 Coéquipier dominé (${tmInfo.me.pts} vs ${tmInfo.tm.pts} pts) : +30 💎`);
            } else if (tmInfo.gap < 0) {
              ch._seasonNotes.push(`🤝 Battu par ton coéquipier ${tmInfo.tm.pilot} (${tmInfo.tm.pts} vs ${tmInfo.me.pts} pts) — revanche la saison prochaine ?`);
            } else {
              ch._seasonNotes.push('🤝 Égalité parfaite avec ton coéquipier — quelle saison !');
            }
          }
          checkTitleUnlocks();
          ch.season++;
        }
        save();
        GP._champMode = false;
        // Bouton retour au championnat
        setTimeout(() => {
          const gpBody = document.getElementById('gpBody');
          if (gpBody) {
            const champBtn = document.createElement('button');
            champBtn.className = 'modal-btn';
            champBtn.style.cssText = 'background:linear-gradient(135deg,#1a1a2e,#2d2d4e);border:2px solid var(--gold);color:var(--gold);margin-top:8px;';
            champBtn.textContent = '🏆 Retour au Championnat';
            champBtn.onclick = () => {
              if (GP.animFrameId) cancelAnimationFrame(GP.animFrameId);
              document.getElementById('scrGP').classList.remove('active');
              showChampionshipScreen();
            };
            const target = gpBody.querySelector('[style*="text-align:center"]');
            if (GP._raceGemLines && GP._raceGemLines.length) {
              const gemsDiv = document.createElement('div');
              gemsDiv.style.cssText = 'background:#1e1e2f;border:2px solid var(--gold);border-radius:12px;padding:10px 12px;margin-top:8px;font-size:12px;font-weight:800;color:var(--gold);text-align:center';
              gemsDiv.innerHTML = GP._raceGemLines.map(l => `<div style="margin:2px 0">${l}</div>`).join('');
              target.appendChild(gemsDiv);
            }
            target.appendChild(champBtn);
          }
        }, 200);
      }
    };

    function newChampSeason() {
      const ch = P.championship;
      ch.active = true;
      ch.currentRace = 0;
      ch.races = [];
      if (ch.nextTeamId) {
        ch.constructorId = ch.nextTeamId;
        ch.nextTeamId = null;
      } else {
        ch.constructorId = null;
      }
      initChampStandings();
      const better = buildChampDrivers().filter(d => !d.isPlayer).sort((a, b) => b.ai - a.ai);
      ch.rivalId = better.length ? better[0].id : null;
      save();
      showChampionshipScreen();
    }

    function exitChampionship() {
      document.getElementById('scrChampionship').classList.remove('active');
      document.getElementById('topbar').style.display = 'flex';
      document.getElementById('bnav').style.display = 'flex';
      startApp();
    }

    // Override standard nextQuestion for the Qualy phase
    const _origNext = nextQuestion;
    nextQuestion = function () {
      if (Q.mode === 'gp_race') { nextGPQuestion(); return; }
      _origNext();
    };

    // Override showResult for GP
    const _origShowResult = showResult;
    showResult = function () {
      stopTimer();
      if (Q.mode === 'gp_qual') {
        const score = Q.correct;
        const qualPos = Math.max(1, 8 - score); // Score de 5 = P3, score de 5 super rapide = P1
        document.getElementById('scrQuiz').classList.remove('active');
        document.getElementById('scrGP').classList.add('active');
        document.getElementById('gpTitle').textContent = '🏁 Grille de départ validée';
        document.getElementById('gpPhaseBadge').textContent = 'Grille';
        document.getElementById('gpBody').innerHTML = `
      <div style="text-align:center;padding:30px 20px; background:#12121c; color:#fff;">
        <div style="font-size:60px;margin-bottom:12px">🏁</div>
        <div style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px">Qualifications terminées !</div>
        <div style="font-size:18px;font-weight:900;color:var(--gold);margin-bottom:20px">Position obtenue : P${qualPos}</div>
        ${renderGPGrid(qualPos)}
        <button class="modal-btn" style="margin-top:16px;background:var(--green);color:#fff;box-shadow:0 5px 0 var(--green-d)" onclick="startGPRace(${qualPos})">Prendre place sur la Grille 🏎️</button>
      </div>`;
        return;
      }
      if (Q.mode === 'gp_race') {
        if (GP.animFrameId) cancelAnimationFrame(GP.animFrameId);
        document.getElementById('scrQuiz').classList.remove('active');
        showGPResult();
        return;
      }
      _origShowResult();
    };

    let _timerInterval = null;
    let _timerSec = 15;
    let _heartRegenInterval = null;

    // ===== AUDIO =====
    const audio = {
      _ctx: null,
      _getCtx() { if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)(); return this._ctx; },
      _beep(freq, dur, type = 'sine', vol = 0.3) {
        try { const c = this._getCtx(); const o = c.createOscillator(); const g = c.createGain(); o.type = type; o.connect(g); g.connect(c.destination); o.frequency.value = freq; g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur); o.start(); o.stop(c.currentTime + dur); } catch (e) { }
      },
      playCorrect() { this._beep(880, 0.15); setTimeout(() => this._beep(1320, 0.2), 100); },
      playWrong() { this._beep(220, 0.4, 'sawtooth', 0.2); },
      playTreasure() { this._beep(660, 0.1); setTimeout(() => this._beep(880, 0.1), 120); setTimeout(() => this._beep(1100, 0.15), 240); setTimeout(() => this._beep(1320, 0.25), 380); },
      playRaceGo() { [440, 550, 660, 880].forEach((f, i) => setTimeout(() => this._beep(f, 0.12), i * 120)); },
      playTimer() { this._beep(440, 0.05, 'square', 0.1); },
      playGameOver() { this._beep(330, 0.2); setTimeout(() => this._beep(220, 0.3), 200); setTimeout(() => this._beep(110, 0.5, 'sawtooth'), 500); },
      playStarPop() { this._beep(1046, 0.12, 'sine', 0.25); },
      playChapterUnlock() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this._beep(f, 0.18, 'sine', 0.22), i * 90)); },
      // Sons d'ambiance ajoutés (coffre, roue, récompenses)
      playDrumroll() { [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(i => setTimeout(() => this._beep(170 + i * 26, 0.05, 'square', 0.15), i * 95)); },
      playFanfare() { [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => this._beep(f, 0.22, 'triangle', 0.26), i * 110)); },
      playPop() { this._beep(660, 0.07, 'triangle', 0.22); setTimeout(() => this._beep(990, 0.09, 'triangle', 0.18), 60); },
      playSpin() { [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => setTimeout(() => this._beep(300 + i * 16, 0.04, 'square', 0.07), i * 130)); },
    };

    // ===== CORE =====
    // Filtre pour éviter la répétition immédiate des questions
    function filterSeenQuestions(pool) {
      if (!P.recentlySeen) P.recentlySeen = [];
      const filtered = pool.filter(q => q.id && !P.recentlySeen.includes(q.id));
      if (filtered.length < 5 && pool.length >= 5) {
        // En cas de pool presque épuisé, on libère la moitié des questions stockées pour ne pas bloquer
        const toRemove = Math.floor(P.recentlySeen.length / 2);
        P.recentlySeen.splice(0, toRemove);
        save();
        return pool.filter(q => q.id && !P.recentlySeen.includes(q.id));
      }
      return filtered.length > 0 ? filtered : pool;
    }

    // Déduction de cœur unifiée avec animations visuelles et physiques
    function deductHeart() {
      if (P.shieldActive) {
        P.shieldActive = false;
        const sb = document.getElementById('shieldBadge');
        if (sb) sb.className = 'shield-active-badge';
        showToast('🛡️ Bouclier activé !');
        return;
      }

      // Déclenche le flash rouge
      const flash = document.getElementById('screenFlashEl');
      if (flash) {
        flash.classList.add('active');
        setTimeout(() => flash.classList.remove('active'), 500);
      }

      const lastHeartIdx = P.hearts;
      P.hearts = Math.max(0, P.hearts - 1);
      P.lastHeartTime = Date.now();

      // Secoue l'indicateur supérieur
      const tbHearts = document.getElementById('valHearts');
      if (tbHearts) {
        tbHearts.parentElement.classList.add('shake');
        setTimeout(() => tbHearts.parentElement.classList.remove('shake'), 400);
      }

      // Met à jour et anime le cœur brisé (💔)
      const heartEl = document.getElementById('qHeart_' + lastHeartIdx);
      if (heartEl) {
        heartEl.textContent = '💔';
        heartEl.classList.add('heart-lost-anim');
        setTimeout(() => {
          heartEl.textContent = '🖤';
          heartEl.style.opacity = '0.3';
          heartEl.style.transform = 'scale(0.8)';
        }, 500);
      }

      // Gestion de la fin de partie si 0 cœur
      if (P.hearts <= 0 && !['infinite', 'Revision', 'chrono', 'survie', 'duel', 'flash', 'chaine'].includes(Q.mode)) {
        setTimeout(() => {
          document.getElementById('scrQuiz').classList.remove('active');
          document.getElementById('scrNoHearts').style.display = 'flex';
          updateUI();
          Companion.react('hearts_out');
        }, 700);
      }
    }

    // Rendu dynamique des cœurs actifs et vides du quiz
    function renderQuizHearts() {
      const qh = document.getElementById('qHearts');
      if (!qh) return;
      qh.innerHTML = '';
      const maxHearts = Math.max(5, P.hearts);  // les cœurs achetés au-delà de 5 s'affichent aussi
      for (let i = 1; i <= maxHearts; i++) {
        const span = document.createElement('span');
        span.textContent = '❤️';
        span.style.transition = 'all 0.5s ease';
        span.style.display = 'inline-block';
        if (i > P.hearts) {
          span.textContent = '🖤';
          span.style.opacity = '0.3';
          span.style.transform = 'scale(0.8)';
        }
        span.id = 'qHeart_' + i;
        qh.appendChild(span);
      }
    }

    // Ouvre/ferme l'espace réservé à la bannière de correction (mobile : évite
    // que les réponses du bas soient masquées) et défile vers la bonne réponse.
    function setBannerOpen(open) {
      const scr = document.getElementById('scrQuiz');
      if (scr) scr.classList.toggle('banner-open', open);
      if (open) {
        setTimeout(() => {
          const target = document.querySelector('#qAnswers .correct') ||
                         document.querySelector('#qAnswers .tf-btn.correct') ||
                         document.getElementById('qAnswers')?.lastElementChild;
          if (target) target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, 350);
      }
    }
    // Version du schéma du profil : incrémenter à chaque changement de
    // structure de P et ajouter la migration correspondante dans migrateProfile().
    const SCHEMA_VERSION = 3;

    function migrateProfile(p) {
      const v = p._schema || 0;
      if (v < 1) {
        // Object.assign comble les clés de premier niveau absentes, pas les
        // objets imbriqués partiellement écrits par d'anciennes versions.
        p.championship = Object.assign({ active: false, season: 1, currentRace: 0, races: [], standings: [], constructorId: null, titles: 0 }, p.championship || {});
        p.powerups = Object.assign({ fiftyfifty: 0, shield: 0, doubleXP: 0, streakFreeze: 0 }, p.powerups || {});
        p.specialties = Object.assign({ geo: 1, hist: 1, sci: 1, art: 1, cinema: 1, sport: 1, gastro: 1, mytho: 1, mixed: 1, extended: 1, chateaux: 1 }, p.specialties || {});
      }
      if (v < 2) {
        if (!p.companion) p.companion = { mode: 'always' };
        if (!p.srs) p.srs = {};
        // Les profils existants (déjà lancés) ne repassent pas le tuto ;
        // les nouveaux joueurs le découvrent au premier démarrage.
        if (!p.tutorial) p.tutorial = { done: (p.totalQ || 0) > 0 };
      }
      if (v < 3) {
        // P3/P4 — progression visible & monde vivant
        if (!p.dayLog) p.dayLog = {};
        if (!p.certificates) p.certificates = {};
        if (!p.dailyMissions) p.dailyMissions = [];
        if (!p.dailyMissionDate) p.dailyMissionDate = '';
        if (!p.legendBoss) p.legendBoss = { month: '', defeated: false };
        if (!p.ownedRoadThemes) p.ownedRoadThemes = [];
        if (!p.ownedOwlHats) p.ownedOwlHats = [];
      }
      p._schema = SCHEMA_VERSION;
      return p;
    }

    function save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(P)); }
      catch (e) {
        console.warn('[KnowQuest] Sauvegarde impossible (quota localStorage ?) :', e);
        showToast('⚠️ Sauvegarde impossible — la progression de cette session risque d\'être perdue');
      }
    }
    function loadData() {
      try {
        const d = localStorage.getItem(STORAGE_KEY);
        if (d) { P = migrateProfile(Object.assign(P, JSON.parse(d))); return true; }
      } catch (e) { console.warn('[KnowQuest] Profil illisible, reprise à zéro :', e); }
      return false;
    }
    function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; }

    // Clone la question et mélange l'ordre des réponses, sans jamais muter la question originale
    // (partagée avec les autres modes de jeu et les banques de questions).
    function shuffleAnswerOrder(q) {
      if (!q || !q.choices || q.correctAnswer === undefined) return q;
      const idx = q.choices.map((_, i) => i);
      const shuffledIdx = shuffle(idx);
      const newChoices = shuffledIdx.map(i => q.choices[i]);
      const newCorrect = shuffledIdx.indexOf(q.correctAnswer);
      return { ...q, choices: newChoices, correctAnswer: newCorrect };
    }

    function addXP(amount) {
      // Talent Polymathe : +5% XP sur tout (arrondi au supérieur pour ne rien perdre)
      if (typeof hasTalent === 'function' && hasTalent('t_polyglotte')) amount = Math.ceil(amount * 1.05);
      P.xp += amount;
      logDay('xp', amount);
      while (P.xp >= P.xpMax) { P.xp -= P.xpMax; P.level++; P.xpMax = Math.floor(P.xpMax * 1.25); P.gems += 25; playLevelUpFX(); }
      save(); updateUI();
    }

    // ===== P3 — JOURNAL QUOTIDIEN (socle de la heatmap et de la courbe d'XP) =====
    function dayKey(d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    function logDay(field, amt = 1) {
      if (!P.dayLog) P.dayLog = {};
      const t = dayKey(new Date());
      const e = P.dayLog[t] || (P.dayLog[t] = { xp: 0, q: 0, c: 0 });
      e[field] = (e[field] || 0) + amt;
      // Purge : 120 jours suffisent (heatmap 12 semaines + courbe 30 jours)
      const keys = Object.keys(P.dayLog).sort();
      while (keys.length > 120) delete P.dayLog[keys.shift()];
    }

    function checkAchievements() {
      window.ACHIEVEMENTS.forEach(a => { if (!P.achievements.includes(a.id) && a.check()) { P.achievements.push(a.id); showToast(`🏆 Succès : ${a.ico} ${a.name}`); } });
    }

    function showToast(msg, dur = 2500) {
      let t = document.createElement('div');
      t.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#1a1a2e;color:#fff;padding:10px 20px;border-radius:20px;font-size:14px;font-weight:900;z-index:9999;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), dur);
    }

    // Échappe les données dynamiques injectées via innerHTML (fiches atlas,
    // explications…) : une donnée générée contenant du HTML ne doit jamais
    // casser la mise en page.
    function escapeHtml(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ================================================================
    // RARETÉ — coffres, fiches et récompenses
    // ================================================================
    const RARITIES = {
      common:    { key: 'common',    label: 'Commune',    weight: 55, color: '#9aa0b5' },
      rare:      { key: 'rare',      label: 'Rare',       weight: 27, color: '#1cb0f6' },
      epic:      { key: 'epic',      label: 'Épique',     weight: 14, color: '#b25ce0' },
      legendary: { key: 'legendary', label: 'Légendaire', weight: 4,  color: '#FFD700' },
    };

    function pickOne(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function rollRarity(minKey) {
      const keys = Object.keys(RARITIES);
      const pool = keys.slice(minKey ? Math.max(0, keys.indexOf(minKey)) : 0);
      const total = pool.reduce((s, k) => s + RARITIES[k].weight, 0);
      let r = Math.random() * total;
      for (const k of pool) { r -= RARITIES[k].weight; if (r <= 0) return k; }
      return pool[0];
    }

    // Rareté déterministe d'une fiche atlas (hash stable de l'id — deux
    // consultations donnent toujours la même rareté, sans toucher aux données)
    function ficheRarity(id) {
      if (!id) return 'common';
      let h = 0;
      for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) % 997;
      return h < 550 ? 'common' : h < 820 ? 'rare' : h < 950 ? 'epic' : 'legendary';
    }

    // ================================================================
    // COMPAGNON VIVANT — Chouette
    // Un personnage qui observe le jeu par ses événements (réponses,
    // combos, coffres, séries…) et choisit quoi dire, quand, et avec
    // quelle humeur — avec des garde-fous anti-spam. Pas des messages
    // pré-enregistrés en boucle : un fil réactif.
    // ================================================================
    const Companion = {
      _queue: [], _busy: false, _lastSay: 0, _lastCorrectSay: 0, _eyesBound: false,
      mode() { return (P.companion && P.companion.mode) || 'always'; },
      enabled(inQuiz) {
        const m = this.mode();
        if (m === 'off') return false;
        return inQuiz ? true : m === 'always';
      },
      _anchor() {
        const scr = document.getElementById('scrQuiz');
        if (scr && scr.classList.contains('active')) return document.getElementById('mascotQuiz');
        const res = document.getElementById('scrResult');
        if (res && res.style.display === 'flex') return document.getElementById('mascotResult');
        const nh = document.getElementById('scrNoHearts');
        if (nh && nh.style.display === 'flex') return document.getElementById('mascotNoHearts');
        return document.getElementById('companionFloat');
      },
      // ── Sur téléphone, Chouette se cache dans le coin (yeux qui dépassent)
      // et ne sort complètement que quand on la touche ──
      _isMobile() { return window.matchMedia('(max-width: 768px)').matches; },
      setPeek(on) {
        this._peeking = !!on;
        const f = document.getElementById('companionFloat');
        if (f) f.classList.toggle('peeking', this._peeking && this._isMobile());
      },
      _scheduleRepeek(ms = 15000) {
        clearTimeout(this._repeekTimer);
        this._repeekTimer = setTimeout(() => {
          if (this._peeking) return;
          if (this._inQuiz() || !this.enabled(false) || !_appStarted) return;
          this.setPeek(true);
        }, ms);
      },
      onFloatClick() {
        if (this._peeking) {
          // Elle sort de sa cachette, puis se recache toute seule
          this.setPeek(false);
          this._scheduleRepeek();
          this.say(pickOne(["Tu m'as trouvée ! 👀", 'Hé hé, je me cachais bien, non ?', 'Je surveillais depuis mon coin 🦉']), { mood: 'wave', force: true, dur: 3000 });
        } else {
          companionPoke();
          if (this._isMobile()) this._scheduleRepeek();
        }
      },
      _inQuiz() { const s = document.getElementById('scrQuiz'); return !!(s && s.classList.contains('active')); },
      say(text, opts = {}) {
        if (!text) return;
        const inQuiz = this._inQuiz();
        if (!this.enabled(inQuiz)) return;
        if (!opts.force && this._queue.length >= 2) return; // anti-spam : file courte
        this._queue.push({ text, mood: opts.mood || 'idle', dur: opts.dur || 3400 });
        if (this._queue.length > 3) this._queue.shift();
        this._drain();
      },
      _drain() {
        if (this._busy || this._queue.length === 0) return;
        const item = this._queue.shift();
        this._busy = true; this._lastSay = Date.now();
        const inQuiz = this._inQuiz();
        const anchor = this._anchor();
        const bubble = document.getElementById('companionBubble');
        // NB : offsetParent vaut null pour les éléments en position:fixed
        // (companionFloat l'est) → on teste la présence de rects rendus.
        if (!anchor || !bubble || !anchor.getClientRects().length) { this._busy = false; setTimeout(() => this._drain(), 400); return; }
        // Elle ne parle pas depuis sa cachette : elle sort d'abord
        if (this._peeking && !inQuiz) { this.setPeek(false); this._scheduleRepeek(); }
        setMascotState(inQuiz ? 'mascotQuiz' : 'companionMascot', item.mood, item.mood !== 'idle' ? 2400 : 0, 'idle');
        bubble.textContent = item.text;
        bubble.classList.toggle('b-quiz', inQuiz);
        bubble.classList.add('show');
        this._placeBubble(anchor, inQuiz);
        clearTimeout(this._hideTimer);
        this._hideTimer = setTimeout(() => {
          bubble.classList.remove('show');
          setTimeout(() => { this._busy = false; this._drain(); }, 220);
        }, item.dur);
      },
      _placeBubble(anchor, inQuiz) {
        const bubble = document.getElementById('companionBubble');
        const r = anchor.getBoundingClientRect();
        const bw = Math.min(240, Math.max(140, bubble.offsetWidth || 200));
        let left, top;
        if (inQuiz) {
          // En quiz, la bulle ne doit JAMAIS recouvrir la question : elle se
          // cale dans la bande libre au-dessus de la carte question (sous la
          // barre de progression), alignée sous le hibou.
          left = r.right - bw;
          const qCard = document.getElementById('qCard');
          if (qCard && qCard.getClientRects().length) {
            const bh = bubble.offsetHeight || 60;
            top = qCard.getBoundingClientRect().top - bh - 8;
          } else {
            top = r.bottom + 8;
          }
        } else {
          left = r.left;
          top = r.top - 10 - (bubble.offsetHeight || 60);
        }
        left = Math.max(8, Math.min(window.innerWidth - bw - 8, left));
        top = Math.max(8, Math.min(window.innerHeight - 120, top));
        bubble.style.left = left + 'px';
        bubble.style.top = top + 'px';
      },
      react(ev, data = {}) {
        switch (ev) {
          case 'correct': {
            const now = Date.now();
            if (now - this._lastCorrectSay < 9000) return; // on célèbre ~1 fois / 9 s max
            this._lastCorrectSay = now;
            if (data.combo >= 5) {
              this.say(pickOne([`${data.combo} d'affilée ! Tu es en feu ! 🔥`, `Incroyable série — ×${data.combo} ! 🔥🔥`, `Ce cerveau ne s'arrête plus ! ×${data.combo} 🔥`]), { mood: 'celebrate', force: true });
              return;
            }
            if (Math.random() > 0.45) return; // sinon ~1 fois sur 2, pour ne pas lasser
            this.say(pickOne(['Bravo ! 👏', 'Exact ! Bien joué.', 'Je le savais — tu le connaissais !', 'Réponse éclair ! ⚡', 'Parfait, continue comme ça !']), { mood: 'happy' });
            break;
          }
          case 'wrong':
            this.say(pickOne(['Pas grave — on retient ensemble ! 💪', 'Presque ! Tu y seras.', 'Une erreur de plus, une de moins à faire.', 'Je note ça pour ta révision 😉', 'Courage, le prochain est pour toi !']), { mood: 'sad', dur: 2800 });
            break;
          case 'level_up':
            this.say(pickOne([`Niveau ${data.level} ! Quelle progression ! 🎓`, `Niveau ${data.level} atteint — je suis fier de toi !`, `Le niveau ${data.level}, déjà ! Tu montes vite.`]), { mood: 'celebrate', force: true, dur: 4200 });
            break;
          case 'chest':
            this.say(pickOne(["Un coffre ! J'adore cette partie 😍", 'Il était bien caché, celui-là !', 'Regarde ce qu’il y a dedans…']), { mood: 'happy', force: true, dur: 2600 });
            break;
          case 'discovery':
            this.say(data.rarity === 'legendary' ? 'Une LÉGENDAIRE !! Peu de joueurs en verront une un jour 🤩' : pickOne(['Nouvelle fiche dans ton atlas ! 📚', 'Ta collection s\'agrandit, magnifique !']), { mood: 'celebrate', force: true });
            break;
          case 'streak':
            this.say(pickOne([`${data.days} jours de suite ! Je monte la garde chaque soir pour ça 🔥`, `Série de ${data.days} ! Ne la casse pas, je serais triste.`]), { mood: 'celebrate', force: true });
            break;
          case 'session_end': {
            if (data.acc >= 80) this.say(pickOne([`${data.acc} % ! Formidable ! 🌟`, `Je n'ai rien eu à corriger — bravo pour ce ${data.acc} % !`]), { mood: 'celebrate', force: true });
            else if (data.acc >= 50) this.say(pickOne([`Solide, ${data.acc} % — on progresse !`, 'Bien joué ! Quelques erreurs à revoir, c\'est tout.']), { mood: 'happy' });
            else this.say(pickOne(['On apprend plus de ses erreurs — je te prépare une révision 😉', 'Ce n\'est rien ! La révision intelligente va tout ancrer.']), { mood: 'idle' });
            break;
          }
          case 'hearts_out':
            this.say('Plus de cœurs… repose-toi, je garde tes fiches au chaud 🛏️', { mood: 'sleepy', force: true });
            break;
          case 'heart_back':
            this.say('Un cœur rechargé ! ❤️', { mood: 'happy', dur: 2200 });
            break;
          case 'timeline':
            this.say(data.msg, { mood: data.mood || 'happy', force: true });
            break;
        }
      },
      // Message d'accueil + messages spontanés (1 fois/jour max chacun)
      onAppStart() {
        renderMascot('companionMascot', 'idle');
        applyOwlHat();
        if (!P.companion) P.companion = {};
        const hour = new Date().getHours();
        const today = todayStr();
        const away = P.lastPlayDate && P.lastPlayDate !== today;
        let msg;
        if (away && (P.streakDays || 0) >= 3) msg = pickOne(["Tu m'as manqué ! Ta série t'attend 🔥", 'Te revoilà ! On reprend la série ?']);
        else if (hour < 12) msg = pickOne(['Bonjour ! Prêt pour quelques questions ? ☀️', 'Une petite session matinale ? J\'adore ça.']);
        else if (hour >= 21) msg = pickOne(['Session nocturne ? Chouette choix 🦉', 'Encore debout ? Un dernier quiz puis dodo !']);
        else msg = pickOne(['Content de te revoir ! 🦉', 'On est en forme aujourd\'hui ?', 'Ta route t\'attend — je te suis !']);
        setTimeout(() => this.say(msg, { mood: 'wave', dur: 3800, force: true }), 900);
        // Sur téléphone : après son accueil, elle va se cacher dans son coin
        // (yeux qui dépassent) et ne sort que si on la touche
        if (this._isMobile()) this._scheduleRepeek(6500);
        const due = getDueSRSCount();
        if (due > 0 && P.companion._srsRemindOn !== today) {
          P.companion._srsRemindOn = today; save();
          setTimeout(() => this.say(`${due} fiche${due > 1 ? 's' : ''} t'attendent dans Révision intelligente 🔄`, { mood: 'idle', dur: 4200 }), 7000);
        } else if (hour >= 19 && P.lastPlayDate !== today && (P.streakDays || 0) >= 2 && P.companion._streakRemindOn !== today) {
          P.companion._streakRemindOn = today; save();
          setTimeout(() => this.say(`Ta série de ${P.streakDays} jours 🔥 est en danger ce soir…`, { mood: 'sad', dur: 4200 }), 7000);
        }
        this._setupEyes();
        this._setupIdle();
      },
      // Les yeux suivent le doigt / la souris — "il te regarde vraiment"
      _setupEyes() {
        if (this._eyesBound) return;
        this._eyesBound = true;
        // Throttle horodaté (et non requestAnimationFrame) : un rAF programmé
        // dans un onglet non rendu ne s'exécute jamais et bloquerait le suivi.
        let last = 0;
        document.addEventListener('pointermove', (e) => {
          const now = performance.now();
          if (now - last < 40) return;
          last = now;
          ['companionMascot', 'mascotQuiz'].forEach(id => {
            const wrap = document.getElementById(id);
            if (!wrap || !wrap.getClientRects().length) return; // caché
            const r = wrap.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
            const d = Math.max(1, Math.hypot(dx, dy));
            const px = Math.max(-2.6, Math.min(2.6, dx / d * 2.6));
            const py = Math.max(-2.2, Math.min(2.2, dy / d * 2.2));
            wrap.querySelectorAll('.m-pupil').forEach(p => { p.style.transform = `translate(${px}px, ${py}px)`; });
          });
        }, { passive: true });
      },
      // Après un long moment d'inactivité sur les menus : "Le savais-tu ?"
      _setupIdle() {
        const arm = (ms) => { clearTimeout(this._idleTimer); this._idleTimer = setTimeout(() => this._idleFact(), ms); };
        if (!this._idleBound) {
          this._idleBound = true;
          document.addEventListener('pointerdown', () => arm(45000), { passive: true });
          document.addEventListener('keydown', () => arm(45000), { passive: true });
        }
        arm(45000);
      },
      _idleFact() {
        if (this._inQuiz() || !this.enabled(false)) { this._setupIdle(); return; }
        const unlocked = (P.atlas || []).map(findFiche).filter(Boolean);
        if (unlocked.length > 0) {
          const withFacts = unlocked.filter(c => c.facts && c.facts.length);
          const card = withFacts.length ? pickOne(withFacts) : pickOne(unlocked);
          this.say(`Le savais-tu ? ${card.facts && card.facts.length ? card.facts[0] : card.desc}`, { mood: 'idle', dur: 5200 });
        }
        this._setupIdle();
      },
    };

    function companionPoke() {
      Companion.say(pickOne(['Coucou ! 🦉', 'Je surveille tes progrès, ne t\'inquiète pas !', 'Psst : la roue de la chance t\'attend en boutique… 🎡', 'Tu vas y arriver, je le sens !', 'Bof bof ? Essaie la révision intelligente 🔄']), { mood: 'happy', force: true });
    }

    function setCompanionMode(m) {
      if (!P.companion) P.companion = {};
      P.companion.mode = m;
      save(); updateCompanionVisibility(); renderCompanionModeBtns();
      if (m !== 'off') Companion.say(m === 'always' ? 'Je reste avec toi, alors ! 🦉' : 'Je surgirai pendant les quiz ! ⚡', { mood: 'happy', force: true });
    }

    function renderCompanionModeBtns() {
      document.querySelectorAll('#companionModeBtns .nm-diff-btn').forEach(b => {
        if (b.dataset.mode === Companion.mode()) b.setAttribute('data-on', '1');
        else b.removeAttribute('data-on');
      });
    }

    function updateCompanionVisibility() {
      const f = document.getElementById('companionFloat');
      if (!f) return;
      const quiz = document.getElementById('scrQuiz')?.classList.contains('active');
      const result = document.getElementById('scrResult')?.style.display === 'flex';
      const noHearts = document.getElementById('scrNoHearts')?.style.display === 'flex';
      const show = Companion.mode() === 'always' && _appStarted && !quiz && !result && !noHearts;
      f.classList.toggle('show', show);
      // La cachette ne s'applique que quand elle est visible (téléphone)
      if (show && Companion._isMobile) f.classList.toggle('peeking', Companion._peeking && Companion._isMobile());
      else f.classList.remove('peeking');
      Tutorial.resume();
    }

    // ================================================================
    // TUTORIEL — spotlight interactif, guidé par Chouette
    // ================================================================
    const Tutorial = {
      active: false, _pendingShow: false,
      steps: [
        { title: 'Bienvenue, je suis Chouette !', text: 'Je vivrai ici, en bas à gauche. Je te regarde apprendre, je célèbre tes réussites et je te console quand ça coince 🦉', target: '#companionFloat' },
        { title: 'Ta barre de vie de joueur', text: 'Série de jours 🔥, cœurs ❤️ et barre d\'XP : tout ce qui compte est là — et je le surveille avec toi.', target: '#topbar' },
        { title: 'Ta route d\'apprentissage', text: 'Chaque nœud est une leçon, chaque coffre 🎁 cache une récompense. Avance étape par étape, à ton rythme !', target: '#roadHeader' },
        { title: 'Essaie tout de suite !', text: 'Une vraie question, comme dans le jeu. Touche ta réponse :', demo: true },
        { title: 'À toi de jouer !', text: 'Va dans l\'onglet Jeux (en bas) et lance ton premier Quiz Infini. Je t\'attends là-bas !', target: '#tabLearn', action: 'mode_started' },
        { title: 'Découvre avant de tester', text: 'Dans chaque leçon, « Apprendre d\'abord » te montre les fiches clés en 1 minute avant de répondre. Et quand des fiches s\'accumulent, la Révision intelligente 🔄 les refait passer au bon moment.', target: '#scrLearn .grid-2 .mode-card' },
        { title: 'Ta boutique', text: 'Les gemmes servent ici : power-ups, cœurs… et la roue de la chance 🎡 pour tenter ta chance !', target: '#tabShop' },
        { title: 'Tu sais tout !', text: 'Réponds chaque jour pour garder ta série 🔥, ouvre des coffres, remplis ton atlas… et reviens vers moi. Je serai toujours là.', target: '#companionFloat' },
      ],
      // La question d'exemple du tuto — un classique piégeux, avec explication
      DEMO_Q: {
        q: 'Quelle est la capitale de l\'Australie ?',
        choices: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
        correct: 2,
        fact: 'Piège classique : ce n\'est pas Sydney ! Canberra a été choisie en 1908 comme compromis entre les deux rivales.',
      },
      maybeStart() {
        if (P.tutorial && !P.tutorial.done && !this.active) setTimeout(() => startTutorial(), 3200);
      },
      start() {
        this.active = true;
        this._bind();
        if (!P.tutorial) P.tutorial = {};
        P.tutorial.step = 0;
        this._show(0);
      },
      // Les boutons du tuto ne sont pas câblés dans le HTML — on les branche une fois
      _bind() {
        if (this._bound) return;
        this._bound = true;
        document.getElementById('tutNext').addEventListener('click', () => this.next());
        document.getElementById('tutSkip').addEventListener('click', () => this.skip());
      },
      _show(i) {
        const step = this.steps[i];
        if (!step) return this.finish();
        if (!P.tutorial) P.tutorial = {};
        P.tutorial.step = i;
        const target = step.target ? document.querySelector(step.target) : null;
        const ov = document.getElementById('tutorialOverlay');
        const hole = document.getElementById('tutHole');
        const card = document.getElementById('tutCard');
        ov.classList.add('show');
        if (target && target.offsetParent) {
          const r = target.getBoundingClientRect();
          Object.assign(hole.style, { left: (r.left - 8) + 'px', top: (r.top - 8) + 'px', width: (r.width + 16) + 'px', height: (r.height + 16) + 'px' });
          const cardH = 230;
          const top = (r.bottom + cardH + 20 < window.innerHeight) ? (r.bottom + 14) : Math.max(10, r.top - cardH - 14);
          const left = Math.max(10, Math.min(window.innerWidth - 292, r.left + r.width / 2 - 140));
          Object.assign(card.style, { top: top + 'px', left: left + 'px' });
        } else {
          Object.assign(hole.style, { left: '50%', top: '55%', width: '0px', height: '0px' });
          // La question d'exemple est plus haute : on remonte la carte
          Object.assign(card.style, { top: step.demo ? '18%' : '42%', left: 'calc(50% - 140px)' });
        }
        document.getElementById('tutTitle').textContent = step.title;
        document.getElementById('tutText').textContent = step.text;
        document.getElementById('tutDots').innerHTML = this.steps.map((_, j) => `<span class="${j === i ? 'on' : ''}"></span>`).join('');
        document.getElementById('tutNext').textContent = i === this.steps.length - 1 ? "C'est parti ! 🚀" : 'Suivant →';
        document.getElementById('tutSkip').textContent = (step.action || step.demo) ? 'Passer cette étape' : 'Passer le tuto';
        // Étape démo : la question remplace le bouton Suivant jusqu'à la réponse
        if (step.demo) {
          document.getElementById('tutNext').style.display = 'none';
          this._renderDemo();
        } else {
          document.getElementById('tutNext').style.display = '';
          const dw = document.getElementById('tutDemo');
          if (dw) dw.innerHTML = '';
        }
      },
      // Question d'exemple jouable directement dans la carte du tuto
      _renderDemo() {
        let wrap = document.getElementById('tutDemo');
        if (!wrap) {
          wrap = document.createElement('div');
          wrap.id = 'tutDemo';
          document.getElementById('tutText').after(wrap);
        }
        const dq = this.DEMO_Q;
        wrap.innerHTML = `
          <div class="tut-demo-q">${dq.q}</div>
          <div class="tut-demo-answers">${dq.choices.map((c, i) => `<button class="tut-demo-btn" data-i="${i}">${c}</button>`).join('')}</div>
          <div id="tutDemoFb" class="tut-demo-fb"></div>`;
        wrap.querySelectorAll('.tut-demo-btn').forEach(b => b.addEventListener('click', () => this._answerDemo(Number(b.dataset.i))));
        this._demoDone = false;
      },
      _answerDemo(i) {
        if (this._demoDone) return;
        this._demoDone = true;
        const dq = this.DEMO_Q;
        const ok = i === dq.correct;
        const wrap = document.getElementById('tutDemo');
        wrap.querySelectorAll('.tut-demo-btn').forEach((b, j) => {
          if (j === dq.correct) b.classList.add('is-correct');
          else if (j === i) b.classList.add('is-wrong');
          b.disabled = true;
        });
        const fb = document.getElementById('tutDemoFb');
        fb.textContent = (ok ? '✅ Bravo ! ' : '❌ Presque — la bonne réponse était « ' + dq.choices[dq.correct] + ' ». ') + dq.fact;
        fb.classList.add('show', ok ? 'ok' : 'ko');
        if (ok) {
          audio.playCorrect();
          if (window.navigator.vibrate) window.navigator.vibrate(22);
          spawnConfetti(14);
        } else audio.playWrong();
        Companion.say(ok ? pickOne(['Bravo ! Tu es prêt(e) ! 🎉', 'Première bonne réponse — la première d\'une longue série !']) : 'Presque ! Ce sera pour la prochaine 😉', { mood: ok ? 'celebrate' : 'sad', force: true, dur: 3200 });
        const next = document.getElementById('tutNext');
        next.style.display = '';
        next.textContent = 'Continuer →';
      },
      next() {
        const i = (P.tutorial.step || 0) + 1;
        if (i >= this.steps.length) return this.finish();
        this._show(i);
      },
      skip() {
        const step = this.steps[P.tutorial.step || 0];
        if (step && (step.action || step.demo)) return this.next(); // "passer" une étape interactive → étape suivante
        this.finish();
      },
      notify(evt) {
        if (!this.active) return;
        const step = this.steps[P.tutorial.step || 0];
        if (step && step.action === evt) {
          this._pendingShow = true;
          document.getElementById('tutorialOverlay').classList.remove('show');
          this.next();
        }
      },
      resume() { // rappelé quand on revient sur les menus (ex. après le quiz de l'étape 4)
        if (this.active && this._pendingShow) {
          this._pendingShow = false;
          setTimeout(() => this._show(P.tutorial.step || 0), 350);
        }
      },
      finish() {
        this.active = false;
        this._pendingShow = false;
        document.getElementById('tutorialOverlay').classList.remove('show');
        if (!P.tutorial) P.tutorial = {};
        P.tutorial.done = true;
        save();
        spawnConfetti(30);
        audio.playChapterUnlock();
        Companion.say('Tu connais tout mes secrets maintenant. À toi de jouer ! 🚀', { mood: 'celebrate', force: true, dur: 4200 });
      },
    };

    function startTutorial(replay) {
      if (replay) P.tutorial = { done: false };
      switchTab('Home');
      Tutorial.start();
    }

    // ================================================================
    // COFFRE — séquence d'ouverture complète (tambour → ouverture →
    // révélation carte par carte) avec système de rareté
    // ================================================================
    let _chestOnDone = null;

    function buildChestRewards(rarity) {
      const gemBase = { common: [25, 40], rare: [50, 80], epic: [90, 140], legendary: [180, 260] }[rarity];
      const gems = Math.round((gemBase[0] + Math.random() * (gemBase[1] - gemBase[0])) * (hasTalent('t_coffre') ? 1.5 : 1));
      const rewards = [{ ico: '💎', val: '+' + gems, lbl: 'gemmes', type: 'gems', value: gems }];
      if (Math.random() < 0.45) rewards.push({ ico: '⚡', val: '+30', lbl: 'XP', type: 'xp', value: 30 });
      if (Math.random() < 0.35) {
        const p = pickOne(['fiftyfifty', 'shield', 'doubleXP']);
        rewards.push({ ico: p === 'fiftyfifty' ? '✂️' : p === 'shield' ? '🛡️' : '⚡', val: '+1', lbl: 'power-up', type: 'pu', value: p });
      }
      if (rarity === 'epic' || rarity === 'legendary') rewards.push({ ico: '❤️', val: '+1', lbl: 'cœur', type: 'heart', value: 1 });
      return rewards;
    }

    function applyChestReward(rw) {
      if (rw.type === 'gems') P.gems += rw.value;
      else if (rw.type === 'xp') addXP(rw.value);
      else if (rw.type === 'heart') P.hearts = Math.min(5, P.hearts + 1);
      else if (rw.type === 'pu') P.powerups[rw.value]++;
    }

    function showChestSequence(rewards, rarity, onDone) {
      const ov = document.getElementById('chestOverlay');
      const emoji = document.getElementById('chestEmoji');
      const rEl = document.getElementById('chestRarity');
      const row = document.getElementById('chestRewards');
      const meta = RARITIES[rarity];
      emoji.textContent = '🎁';
      emoji.className = 'chest-emoji shaking';
      rEl.textContent = '';
      row.innerHTML = '';
      ov.classList.remove('opened', 'done');
      ov.classList.add('show');
      Companion.react('chest');
      audio.playDrumroll();
      // Tambour ~1,4 s puis ouverture
      setTimeout(() => {
        emoji.textContent = rarity === 'legendary' ? '🎉' : '✨';
        emoji.className = 'chest-emoji';
        ov.classList.add('opened');
        rEl.textContent = meta.label + ' !';
        rEl.style.color = meta.color;
        audio.playTreasure();
        if (rarity !== 'common') audio.playFanfare();
        if (window.navigator.vibrate) window.navigator.vibrate([12, 40, 18]);
        if (rarity === 'epic' || rarity === 'legendary') spawnConfetti(rarity === 'legendary' ? 40 : 24);
        rewards.forEach((rw, i) => {
          setTimeout(() => {
            applyChestReward(rw);
            const div = document.createElement('div');
            div.className = 'reward-card in';
            div.style.setProperty('--reward-c', meta.color);
            if (rarity !== 'common') div.style.setProperty('--reward-glow', rarity === 'legendary' ? 'rgba(255,215,0,.55)' : 'rgba(178,92,224,.4)');
            div.innerHTML = `<div class="reward-inner"><div class="reward-ico">${rw.ico}</div><div class="reward-val">${rw.val}</div><div class="reward-lbl">${rw.lbl}</div></div>`;
            row.appendChild(div);
            audio.playPop();
          }, 350 + i * 550);
        });
        setTimeout(() => ov.classList.add('done'), 650 + rewards.length * 550);
      }, 1400);
      _chestOnDone = onDone || null;
    }

    function closeChest() {
      document.getElementById('chestOverlay').classList.remove('show', 'opened', 'done');
      save(); updateUI();
      if (typeof _chestOnDone === 'function') { const f = _chestOnDone; _chestOnDone = null; f(); }
    }

    // ================================================================
    // LEVEL UP plein écran
    // ================================================================
    function playLevelUpFX() {
      audio.playFanfare();
      if (window.navigator.vibrate) window.navigator.vibrate([15, 30, 15, 30, 25]);
      spawnConfetti(26);
      document.getElementById('levelUpText').textContent = 'NIVEAU ' + P.level;
      document.getElementById('levelUpSub').textContent = '+25 💎 · Continue comme ça !';
      const ov = document.getElementById('levelUpOverlay');
      ov.classList.add('show');
      Companion.react('level_up', { level: P.level });
      setTimeout(() => ov.classList.remove('show'), 2400);
    }

    // ================================================================
    // RÉPÉTITION ESPACÉE (SRS) — tes erreurs reviennent au bon moment
    // ================================================================
    const SRS_INTERVALS = [1, 3, 7, 14, 30]; // jours avant la prochaine révision, par boîte

    function todayStr(offsetDays = 0) {
      const d = new Date();
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    }

    function srsOnResult(q, ok) {
      if (!q || !q.id) return;
      if (!P.srs) P.srs = {};
      if (ok) {
        const e = P.srs[q.id];
        if (!e) return; // seulement les questions déjà marquées
        e.box = Math.min(5, (e.box || 1) + 1);
        e.due = todayStr(SRS_INTERVALS[e.box - 1]);
      } else {
        P.srs[q.id] = { box: 1, due: todayStr(1) }; // toute erreur devient une fiche à revoir
      }
    }

    function getDueSRSCount() {
      const t = todayStr();
      return Object.values(P.srs || {}).filter(e => e.due <= t).length;
    }

    function findQuestionById(id) {
      const banks = ['GEO_QB', 'HIST_QB', 'SCI_QB', 'ART_QB', 'CINEMA_QB', 'SPORT_QB', 'GASTRO_QB', 'MYTHO_QB', 'CHATEAUX_QB', 'LITT_QB', 'MIXED_QB', 'EXTENDED_QB', 'TF_QB', 'FLASH_QB'];
      for (const b of banks) {
        const arr = window[b];
        if (!arr) continue;
        const q = arr.find(x => x.id === id);
        if (q) return q;
      }
      return null;
    }

    let _srsPool = null;

    function renderSrsCard() {
      const el = document.getElementById('srsCard');
      if (!el) return;
      const due = getDueSRSCount();
      if (due === 0) { el.innerHTML = ''; return; }
      el.innerHTML = `<div class="srs-card" onclick="startRevision()"><div style="font-size:30px">🔄</div><div style="flex:1"><div style="font-size:14px;font-weight:900;color:#4ade80">Révision intelligente</div><div style="font-size:11px;color:rgba(255,255,255,.65);font-weight:700;margin-top:2px">Le meilleur moment pour ancrer tes acquis</div></div><div class="srs-count">${due}</div></div>`;
    }

    // ================================================================
    // LEÇON EXPRESS — découvrir les fiches avant de tester
    // ================================================================
    let _lesson = { cards: [], idx: 0, after: null };

    function findFiche(id) {
      ensureAtlasCatalog();
      for (const arr of Object.values(window.ATLAS_CARDS || {})) {
        const c = arr.find(c => c.id === id);
        if (c) return c;
      }
      return null;
    }

    function startFlashLesson(bank, onDone) {
      ensureAtlasCatalog();
      const cat = String(bank || '').toLowerCase();
      const key = Object.keys(window.ATLAS_CARDS).find(k => cat.includes(k)) || 'mixed';
      const pool = shuffle(window.ATLAS_CARDS[key] || []).slice(0, 3);
      if (pool.length === 0) { showToast('Pas encore de fiches pour cette catégorie !'); return; }
      _lesson = { cards: pool, idx: 0, after: onDone || null };
      document.getElementById('lessonModal').classList.add('open');
      _renderLessonCard();
    }

    function lessonFromNode() {
      const node = window._tutNode;
      if (!node) return;
      startFlashLesson(node.bank, () => document.getElementById('nmBtn').click());
    }

    function _renderLessonCard() {
      const c = _lesson.cards[_lesson.idx];
      const facts = (c.facts || []).slice(0, 2).map(f => `<div class="atlas-fact"><span class="atlas-fact-ico">📌</span><span>${escapeHtml(f)}</span></div>`).join('');
      document.getElementById('lessonBody').innerHTML = `
        <div style="text-align:center;margin-bottom:6px"><span style="font-size:56px">${escapeHtml(c.ico)}</span></div>
        <div style="font-size:19px;font-weight:900;text-align:center">${escapeHtml(c.name)}</div>
        <div style="font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:1px;text-align:center;margin:2px 0 10px">Fiche ${_lesson.idx + 1} / ${_lesson.cards.length}</div>
        <p style="font-size:14px;font-weight:700;color:var(--text);line-height:1.45;margin-bottom:10px">${escapeHtml(c.desc)}</p>
        ${facts ? `<div class="atlas-detail">${facts}</div>` : ''}`;
      document.getElementById('lessonNextBtn').textContent = _lesson.idx < _lesson.cards.length - 1 ? 'Suivant →' : "C'est parti ! ⚡";
      audio.playPop();
    }

    function lessonNext() {
      if (_lesson.idx < _lesson.cards.length - 1) { _lesson.idx++; _renderLessonCard(); }
      else { const after = _lesson.after; closeLesson(); if (after) after(); }
    }

    function closeLesson() { document.getElementById('lessonModal').classList.remove('open'); }

    // ================================================================
    // FRISE DU TEMPS — classer les événements historiques
    // ================================================================
    const TIMELINE_EVENTS = [
      { y: -52, ico: '🛡️', t: "Vercingétorix résiste à Alésia face à César" },
      { y: -44, ico: '🗡️', t: "Assassinat de Jules César" },
      { y: 800, ico: '👑', t: "Charlemagne est couronné empereur" },
      { y: 1066, ico: '🏹', t: "Bataille de Hastings" },
      { y: 1096, ico: '✝️', t: "Départ de la première croisade" },
      { y: 1215, ico: '📜', t: "Signature de la Magna Carta en Angleterre" },
      { y: 1348, ico: '🐀', t: "La Peste noire décime l'Europe" },
      { y: 1429, ico: '⚔️', t: "Jeanne d'Arc délivre Orléans" },
      { y: 1453, ico: '🏰', t: "Chute de Constantinople" },
      { y: 1492, ico: '⛵', t: "Christophe Colomb atteint l'Amérique" },
      { y: 1517, ico: '⛪', t: "Luther affiche ses 95 thèses" },
      { y: 1789, ico: '🇫🇷', t: "Prise de la Bastille" },
      { y: 1793, ico: '⚖️', t: "Exécution de Louis XVI" },
      { y: 1804, ico: '🎖️', t: "Napoléon est couronné empereur" },
      { y: 1815, ico: '🐎', t: "Défaite de Waterloo" },
      { y: 1859, ico: '🐢', t: "Darwin publie L'Origine des espèces" },
      { y: 1869, ico: '🚢', t: "Inauguration du canal de Suez" },
      { y: 1889, ico: '🗼', t: "Inauguration de la Tour Eiffel" },
      { y: 1903, ico: '✈️', t: "Premier vol des frères Wright" },
      { y: 1912, ico: '🧊', t: "Naufrage du Titanic" },
      { y: 1914, ico: '💥', t: "Début de la Première Guerre mondiale" },
      { y: 1918, ico: '🕊️', t: "Armistice de la Première Guerre mondiale" },
      { y: 1929, ico: '📉', t: "Crise économique de 1929" },
      { y: 1939, ico: '🌍', t: "Début de la Seconde Guerre mondiale" },
      { y: 1945, ico: '☢️', t: "Hiroshima et fin de la Seconde Guerre mondiale" },
      { y: 1957, ico: '🛰️', t: "Spoutnik, premier satellite artificiel" },
      { y: 1961, ico: '👨‍🚀', t: "Youri Gagarine, premier homme dans l'espace" },
      { y: 1969, ico: '🌕', t: "Apollo 11 : l'homme marche sur la Lune" },
      { y: 1989, ico: '🧱', t: "Chute du Mur de Berlin" },
      { y: 1991, ico: '🌐', t: "Le World Wide Web devient public" },
      { y: 2002, ico: '💶', t: "L'euro entre en circulation" },
      { y: 2020, ico: '😷', t: "Pandémie mondiale de Covid-19" },
    ];
    let _tl = { events: [], picked: [], done: false };

    function openTimeline() {
      _tl = {
        events: shuffle([...TIMELINE_EVENTS]).slice(0, 5).sort((a, b) => a.y - b.y),
        picked: [], done: false,
      };
      renderTimeline();
      document.getElementById('timelineModal').classList.add('show');
    }

    function closeTimeline() { document.getElementById('timelineModal').classList.remove('show'); }

    function renderTimeline() {
      document.getElementById('tlInstruction').textContent = "Classe ces événements du plus ancien 🏛️ au plus récent 🚀 — clique dans l'ordre !";
      const list = document.getElementById('tlList');
      list.innerHTML = '';
      shuffle([..._tl.events]).forEach(ev => {
        const d = document.createElement('div');
        d.className = 'tl-item';
        d.dataset.y = ev.y;
        d.innerHTML = `<div class="tl-num"></div><div class="tl-ico">${ev.ico}</div><div style="flex:1"><div>${escapeHtml(ev.t)}</div><div class="tl-year">${ev.y < 0 ? Math.abs(ev.y) + ' av. J.-C.' : ev.y}</div></div>`;
        d.onclick = () => pickTimeline(ev, d);
        list.appendChild(d);
      });
      document.getElementById('tlScoreBadge').textContent = `0 / ${_tl.events.length}`;
      document.getElementById('tlFooter').innerHTML = '';
    }

    function pickTimeline(ev, el) {
      if (_tl.done || _tl.picked.includes(ev)) return;
      _tl.picked.push(ev);
      el.classList.add('picked');
      el.querySelector('.tl-num').textContent = _tl.picked.length;
      audio.playPop();
      document.getElementById('tlScoreBadge').textContent = `${_tl.picked.length} / ${_tl.events.length}`;
      if (_tl.picked.length === _tl.events.length) validateTimeline();
    }

    function validateTimeline() {
      _tl.done = true;
      let score = 0;
      document.querySelectorAll('#tlList .tl-item').forEach(item => {
        const y = +item.dataset.y;
        const pos = _tl.picked.findIndex(e => e.y === y);   // position choisie
        const want = _tl.events.findIndex(e => e.y === y);  // position chronologique réelle
        item.classList.add('tl-revealed');
        if (pos === want) { score++; item.classList.add('ok'); }
        else item.classList.add('ko');
      });
      const xp = score * 8;
      if (xp > 0) addXP(xp);
      document.getElementById('tlInstruction').textContent = score === _tl.events.length ? '🏆 Chronologie parfaite !' : `${score}/${_tl.events.length} dans le bon ordre — +${xp} XP`;
      if (score === _tl.events.length) { spawnConfetti(24); audio.playFanfare(); }
      else if (score >= 3) audio.playCorrect();
      else audio.playWrong();
      Companion.react('timeline', {
        msg: score === 5 ? 'Chronologie parfaite ! Une machine à temps ⏳' : score >= 3 ? 'Bien joué ! Les dates viennent avec la pratique.' : "Les siècles, c'est piégeux — on réessaie ?",
        mood: score >= 3 ? 'celebrate' : 'sad',
      });
      document.getElementById('tlFooter').innerHTML = '<button class="modal-btn" onclick="openTimeline()">Rejouer 🔄</button>';
    }

    // ================================================================
    // ROUE DE LA FORTUNE — dépenser des gemmes contre un tirage animé
    // ================================================================
    const WHEEL_COST = 40;
    const WHEEL_PRIZES = [
      { ico: '💎', label: '+15 💎', color: '#1cb0f6', w: 20, apply: () => { P.gems += 15; } },
      { ico: '⚡', label: '+40 XP', color: '#58cc02', w: 18, apply: () => addXP(40) },
      { ico: '✂️', label: '50/50', color: '#7c5cfc', w: 15, apply: () => { P.powerups.fiftyfifty++; } },
      { ico: '💎', label: '+30 💎', color: '#1899d6', w: 14, apply: () => { P.gems += 30; } },
      { ico: '❤️', label: 'Cœur', color: '#ff4b4b', w: 12, apply: () => { P.hearts = Math.min(5, P.hearts + 1); } },
      { ico: '💎', label: '+60 💎', color: '#0d84c2', w: 9, apply: () => { P.gems += 60; } },
      { ico: '2×', label: 'XP ×2', color: '#e5b400', w: 8, apply: () => { P.doubleXPActive = true; } },
      { ico: '🎁', label: 'Coffre', color: '#b25ce0', w: 4, apply: () => { const rr = rollRarity('rare'); showChestSequence(buildChestRewards(rr), rr, null); } },
    ];
    let _wheelSpinning = false;

    function openWheel() {
      buildWheel();
      document.getElementById('wheelEl').style.transform = 'rotate(0deg)';
      document.getElementById('wheelResult').textContent = '';
      const b = document.getElementById('wheelSpinBtn');
      b.disabled = false;
      b.textContent = `Tourner (💎 ${WHEEL_COST})`;
      document.getElementById('wheelModal').classList.add('open');
    }

    function closeWheel() { if (!_wheelSpinning) document.getElementById('wheelModal').classList.remove('open'); }

    // ===== CARTES À GRATTER — le lot est tiré AVANT le grattage,
    // le canvas argenté ne fait que le révéler =====
    const SCRATCH_COST = 25;
    const SCRATCH_PRIZES = [
      { ico: '💎', label: '+15 💎', w: 20, apply: () => { P.gems += 15; } },
      { ico: '⚡', label: '+25 XP', w: 18, apply: () => addXP(25) },
      { ico: '✂️', label: '50/50', w: 12, apply: () => { P.powerups.fiftyfifty++; } },
      { ico: '💎', label: '+40 💎', w: 14, apply: () => { P.gems += 40; } },
      { ico: '❤️', label: '+1 cœur', w: 12, apply: () => { P.hearts = Math.min(5, P.hearts + 1); } },
      { ico: '🛡️', label: 'Bouclier', w: 8, apply: () => { P.powerups.shield++; } },
      { ico: '⚡', label: '+60 XP', w: 8, apply: () => addXP(60) },
      { ico: '💎', label: '+120 💎', w: 5, apply: () => { P.gems += 120; } },
      { ico: '🎁', label: 'Coffre !', w: 3, apply: () => { const rr = rollRarity('rare'); showChestSequence(buildChestRewards(rr), rr, null); } },
    ];
    let _scratch = null;

    function openScratch() {
      document.getElementById('scratchModal').classList.add('open');
      _resetScratch();
      Companion.say('Gratte, gratte ! Qui sait ce qui se cache dessous… 🎟️', { mood: 'happy', force: true, dur: 2600 });
    }

    function closeScratch() { document.getElementById('scratchModal').classList.remove('open'); }

    function _resetScratch() {
      const wrap = document.getElementById('scratchWrap');
      const prize = document.getElementById('scratchPrize');
      const btn = document.getElementById('scratchBuyBtn');
      const res = document.getElementById('scratchResult');
      wrap.classList.remove('revealed');
      wrap.style.display = 'none';
      prize.innerHTML = '<div style="font-size:12px;color:rgba(255,255,255,.55);font-weight:800;text-transform:uppercase;letter-spacing:1px">Achète une carte pour révéler le lot</div>';
      res.textContent = '';
      btn.disabled = false;
      btn.textContent = `Acheter une carte (💎 ${SCRATCH_COST})`;
      _scratch = null;
    }

    function buyScratch() {
      if (_scratch && !_scratch.revealed) return;
      if (P.gems < SCRATCH_COST) { showToast('Pas assez de gemmes ! 💎'); return; }
      P.gems -= SCRATCH_COST;
      save(); updateUI();
      const total = SCRATCH_PRIZES.reduce((s, p) => s + p.w, 0);
      let r = Math.random() * total, prize = SCRATCH_PRIZES[0];
      for (const p of SCRATCH_PRIZES) { r -= p.w; if (r <= 0) { prize = p; break; } }
      _scratch = { prize, revealed: false, _moves: 0 };
      const wrap = document.getElementById('scratchWrap');
      const canvas = document.getElementById('scratchCanvas');
      document.getElementById('scratchPrize').innerHTML =
        `<div style="font-size:52px;line-height:1">${prize.ico}</div><div style="font-size:17px;margin-top:6px;color:#fff">${prize.label}</div>`;
      wrap.style.display = 'block';
      _paintScratchCover(canvas);
      const btn = document.getElementById('scratchBuyBtn');
      btn.disabled = true;
      btn.textContent = 'Gratte la zone argentée ! 🪙';
      audio.playPop();
    }

    function _paintScratchCover(canvas) {
      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, '#c8ccd8'); g.addColorStop(.5, '#9aa0b2'); g.addColorStop(1, '#d5d9e4');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(30,30,50,.55)';
      ctx.font = '900 16px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🪙 GRATTE ICI 🪙', canvas.width / 2, canvas.height / 2);
      ctx.globalCompositeOperation = 'destination-out';
      _bindScratchPointer(canvas);
    }

    function _bindScratchPointer(canvas) {
      if (canvas.dataset.bound) return;
      canvas.dataset.bound = '1';
      let scratching = false;
      const erase = (e) => {
        if (!_scratch || _scratch.revealed) return;
        const r = canvas.getBoundingClientRect();
        const x = (e.clientX - r.left) * canvas.width / r.width;
        const y = (e.clientY - r.top) * canvas.height / r.height;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(x, y, 17, 0, Math.PI * 2);
        ctx.fill();
        if ((++_scratch._moves % 8) === 0 && _scratchPct(canvas) > 0.55) _revealScratch();
      };
      canvas.addEventListener('pointerdown', (e) => { scratching = true; erase(e); });
      canvas.addEventListener('pointermove', (e) => { if (scratching) erase(e); });
      window.addEventListener('pointerup', () => { scratching = false; });
      window.addEventListener('pointercancel', () => { scratching = false; });
    }

    function _scratchPct(canvas) {
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, total = 0;
      for (let y = 0; y < canvas.height; y += 10) {
        for (let x = 0; x < canvas.width; x += 10) {
          total++;
          if (data[(y * canvas.width + x) * 4 + 3] < 120) clear++;
        }
      }
      return clear / total;
    }

    function _revealScratch() {
      if (!_scratch || _scratch.revealed) return;
      _scratch.revealed = true;
      const p = _scratch.prize;
      document.getElementById('scratchWrap').classList.add('revealed');
      p.apply();
      save(); updateUI();
      const res = document.getElementById('scratchResult');
      res.textContent = `Gagné : ${p.ico} ${p.label} !`;
      res.style.color = 'var(--gold)';
      audio.playTreasure();
      spawnConfetti(20);
      if (window.navigator.vibrate) window.navigator.vibrate([15, 30, 20]);
      Companion.say(pickOne(['Gagné ! La chance te sourit ! 🍀', 'Bien caché, bien trouvé !', 'Une pépite, celle-là ! ✨']), { mood: 'celebrate', force: true, dur: 2600 });
      const btn = document.getElementById('scratchBuyBtn');
      btn.disabled = false;
      btn.textContent = `Nouvelle carte (💎 ${SCRATCH_COST})`;
    }

    function buildWheel() {
      const el = document.getElementById('wheelEl');
      if (el.dataset.built) return;
      el.dataset.built = '1';
      const n = WHEEL_PRIZES.length, seg = 360 / n;
      el.style.background = `conic-gradient(${WHEEL_PRIZES.map((p, i) => `${p.color} ${i * seg}deg ${(i + 1) * seg}deg`).join(',')})`;
      WHEEL_PRIZES.forEach((p, i) => {
        const lbl = document.createElement('div');
        lbl.className = 'wheel-label';
        lbl.textContent = `${p.ico} ${p.label}`;
        lbl.style.transform = `rotate(${i * seg + seg / 2}deg) translate(58px) rotate(90deg)`;
        el.appendChild(lbl);
      });
    }

    function spinWheel() {
      if (_wheelSpinning) return;
      if (P.gems < WHEEL_COST) { showToast('Pas assez de gemmes ! 💎'); return; }
      P.gems -= WHEEL_COST;
      save(); updateUI();
      _wheelSpinning = true;
      const btn = document.getElementById('wheelSpinBtn');
      btn.disabled = true;
      btn.textContent = 'Ça tourne…';
      document.getElementById('wheelResult').textContent = '';
      // Tirage pondéré AVANT l'animation — la roue ne fait que le révéler
      const total = WHEEL_PRIZES.reduce((s, p) => s + p.w, 0);
      let r = Math.random() * total, idx = 0;
      for (let i = 0; i < WHEEL_PRIZES.length; i++) { r -= WHEEL_PRIZES[i].w; if (r <= 0) { idx = i; break; } }
      const seg = 360 / WHEEL_PRIZES.length;
      const target = 360 * 5 + (360 - (idx * seg + seg / 2)) + (Math.random() * (seg - 26) - (seg / 2 - 13));
      audio.playSpin();
      document.getElementById('wheelEl').style.transform = `rotate(${target}deg)`;
      setTimeout(() => {
        const p = WHEEL_PRIZES[idx];
        p.apply();
        save(); updateUI();
        audio.playTreasure();
        if (window.navigator.vibrate) window.navigator.vibrate(30);
        document.getElementById('wheelResult').textContent = `${p.ico} ${p.label} !`;
        Companion.say(pickOne(['Bien joué !', 'La chance te sourit !', 'Gagné ! 🎉']), { mood: 'celebrate', force: true });
        btn.disabled = false;
        btn.textContent = `Rejouer (💎 ${WHEEL_COST})`;
        _wheelSpinning = false;
      }, 4450);
    }

    // ================================================================
    // P3 — PROGRESSION VISIBLE : heatmap d'activité, courbe d'XP,
    // barres de précision par catégorie, missions quotidiennes
    // personnalisées et certificats de catégorie.
    // Tout est calculé depuis le profil sauvegardé — aucun backend.
    // ================================================================
    const CAT_BAR_COLORS = { geo: '#1cb0f6', hist: '#e5b400', sci: '#4ade80', art: '#f472b6', cinema: '#ff4b4b', sport: '#22d3ee', gastro: '#fb923c', mytho: '#a78bfa', mixed: '#94a3b8', extended: '#38bdf8', chateaux: '#f59e0b', litt: '#34d399' };

    function renderProfileStats() { renderActivityHeatmap(); renderXpCurve(); renderCatAccuracyBars(); }

    // ── Heatmap : 12 semaines × 7 jours, densité = questions répondues ──
    function renderActivityHeatmap() {
      const el = document.getElementById('statsHeatmap');
      if (!el) return;
      const today = new Date();
      const dow = (today.getDay() + 6) % 7; // lundi = 0
      const gridEnd = new Date(today); gridEnd.setDate(gridEnd.getDate() + (6 - dow)); // dimanche de la semaine courante
      const lvl = (q) => q === 0 ? 0 : q < 10 ? 1 : q < 25 ? 2 : q < 50 ? 3 : 4;
      let html = '';
      for (let w = 11; w >= 0; w--) {
        let col = '';
        for (let r = 0; r < 7; r++) {
          const d = new Date(gridEnd); d.setDate(d.getDate() - w * 7 - (6 - r));
          const key = dayKey(d);
          const q = ((P.dayLog || {})[key] || {}).q || 0;
          const future = d > today;
          col += `<div class="heat-cell ${future ? 'lf' : 'l' + lvl(q)}" title="${key} — ${q} question${q > 1 ? 's' : ''}"></div>`;
        }
        html += `<div class="heat-col">${col}</div>`;
      }
      el.innerHTML = html;
    }

    // ── Courbe d'XP : 30 derniers jours, en SVG inline ──
    function renderXpCurve() {
      const el = document.getElementById('statsXpChart');
      if (!el) return;
      const vals = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        vals.push(((P.dayLog || {})[dayKey(d)] || {}).xp || 0);
      }
      const max = Math.max(50, ...vals);
      const W = 300, H = 74;
      const pts = vals.map((v, i) => `${(i / 29 * (W - 4) + 2).toFixed(1)},${(H - 6 - (v / max) * (H - 16)).toFixed(1)}`);
      el.innerHTML = `<div class="stats-chart-head"><span>XP gagné — 30 derniers jours</span><b>${vals.reduce((a, b) => a + b, 0)} XP</b></div>
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
          <defs><linearGradient id="xpf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7c5cfc" stop-opacity=".45"/><stop offset="100%" stop-color="#7c5cfc" stop-opacity="0"/></linearGradient></defs>
          <polygon points="0,${H} ${pts.join(' ')} ${W},${H}" fill="url(#xpf)"/>
          <polyline points="${pts.join(' ')}" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>`;
    }

    // ── Barres de précision par catégorie + 2 points faibles mis en avant ──
    function renderCatAccuracyBars() {
      const el = document.getElementById('statsCatBars');
      const weakEl = document.getElementById('statsWeak');
      if (!el) return;
      const entries = Object.entries(P.catStats || {})
        .filter(([, s]) => s.total >= 5)
        .map(([cat, s]) => ({ cat, acc: s.correct / s.total, total: s.total }))
        .sort((a, b) => b.acc - a.acc);
      el.innerHTML = entries.map(e => {
        const col = CAT_BAR_COLORS[e.cat] || '#7c5cfc';
        const weak = e.total >= 10 && e.acc < 0.6;
        return `<div class="cat-bar-row${weak ? ' weak' : ''}">
          <div class="cat-bar-label">${CAT_LABELS[e.cat] || e.cat}${weak ? ' <span class="cat-weak-flag">⚠️</span>' : ''}</div>
          <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${Math.round(e.acc * 100)}%;background:${col}"></div></div>
          <div class="cat-bar-val">${Math.round(e.acc * 100)} %<span> · ${e.total} q.</span></div>
        </div>`;
      }).join('') || '<div class="showcase-empty">📊 Réponds à des questions pour voir tes forces apparaître !</div>';
      const weaks = entries.filter(e => e.total >= 10).slice(-2).filter(e => e.acc < 0.7);
      if (weakEl) weakEl.innerHTML = weaks.length
        ? `<div class="stats-weak-note">🎯 Points faibles : ${weaks.map(w => `${CAT_LABELS[w.cat] || w.cat} (${Math.round(w.acc * 100)} %)`).join(' · ')} — Chouette recommande la Révision intelligente 🔄</div>`
        : '';
    }

    // ── Missions quotidiennes personnalisées : orientées points faibles ──
    function initDailyMissions() {
      const today = todayStr();
      if (P.dailyMissionDate === today && (P.dailyMissions || []).length) return;
      const ranked = Object.entries(P.catStats || {})
        .filter(([, s]) => s.total >= 5)
        .map(([cat, s]) => ({ cat, acc: s.correct / s.total }))
        .sort((a, b) => a.acc - b.acc);
      const weak = ranked.slice(0, 2).map(a => a.cat);
      const list = [];
      if (weak[0]) list.push({ id: 'd_cat_' + weak[0], ico: '🎯', desc: `8 bonnes réponses en ${CAT_LABELS[weak[0]] || weak[0]}`, target: 8, stat: 'cat_' + weak[0], reward: { xp: 60, gems: 20 } });
      if (weak[1]) list.push({ id: 'd_cat2_' + weak[1], ico: '🎯', desc: `5 bonnes réponses en ${CAT_LABELS[weak[1]] || weak[1]}`, target: 5, stat: 'cat_' + weak[1], reward: { xp: 50, gems: 15 } });
      const variety = [
        { id: 'd_correct', ico: '✅', desc: '15 bonnes réponses aujourd\'hui', target: 15, stat: 'correct', reward: { xp: 70, gems: 25 } },
        { id: 'd_sessions', ico: '🎮', desc: 'Terminer 2 sessions de quiz', target: 2, stat: 'sessions', reward: { xp: 50, gems: 15 } },
        { id: 'd_combo', ico: '💥', desc: 'Atteindre un combo ×5', target: 1, stat: 'combo5', reward: { xp: 60, gems: 20 } },
      ];
      list.push(variety[new Date().getDate() % variety.length]);
      P.dailyMissions = list.slice(0, 3).map(m => ({ ...m, progress: 0, done: false }));
      P.dailyMissionDate = today;
      save();
    }

    function renderDailyMissionsCard() {
      const el = document.getElementById('dailyMissionsCard');
      if (!el) return;
      initDailyMissions();
      const list = P.dailyMissions || [];
      const done = list.filter(m => m.done).length;
      el.innerHTML = `<div class="dm-card">
        <div class="dm-head"><span>🎯 Missions du Jour <span class="dm-made-for">choisies pour toi</span></span><span class="dm-count">${done}/${list.length}</span></div>
        ${list.map(m => `<div class="dm-row${m.done ? ' done' : ''}">
          <span class="dm-ico">${m.ico}</span>
          <div class="dm-info">
            <div class="dm-desc">${m.desc}</div>
            <div class="dm-track"><div class="dm-fill" style="width:${Math.min(100, Math.round((m.progress / m.target) * 100))}%"></div></div>
          </div>
          <span class="dm-reward">${m.done ? '✅' : `${m.progress}/${m.target}`}</span>
        </div>`).join('')}
      </div>`;
    }

    // ── Certificats de catégorie : la "fin de série" de chaque matière ──
    function checkCatCertificate(cat) {
      if (!cat || !isCatPerfected(cat)) return;
      if (!P.certificates) P.certificates = {};
      if (P.certificates[cat]) return;
      P.certificates[cat] = todayStr();
      const label = CAT_LABELS[cat] || cat;
      addHonor('cert_' + cat, { ico: '📜', name: `Certificat : ${label}`, cls: 'chapter-gold' });
      save();
      audio.playChapterUnlock();
      spawnConfetti(50);
      Companion.say(`Un CERTIFICAT pour ${label} !! Je suis tellement fier 🤩`, { mood: 'celebrate', force: true, dur: 4200 });
      setTimeout(() => showCertificateModal(cat), 1100);
    }

    function showCertificateModal(cat) {
      const label = (CAT_LABELS[cat] || cat).replace(/^[^ ]+ /, '');
      const modal = document.getElementById('certModal');
      if (!modal) return;
      document.getElementById('certTitle').textContent = `📜 Certificat de Maîtrise — ${label}`;
      document.getElementById('certBody').innerHTML = `
        <div style="text-align:center;font-size:56px;margin-bottom:6px">🏅</div>
        <div style="font-size:20px;font-weight:900;text-align:center;color:var(--gold)">${label}</div>
        <div style="font-size:13px;font-weight:800;color:var(--muted);text-align:center;margin:8px 0 4px">Décerné à <b style="color:var(--text)">${escapeHtml(P.name || 'Explorateur')} ${P.avatar || ''}</b></div>
        <div style="font-size:12px;font-weight:700;color:var(--muted);text-align:center">Précision ≥ 80 % sur 50 questions ou plus — niveau parfait atteint.</div>
        <div style="font-size:11px;font-weight:800;color:var(--purple);text-align:center;margin-top:8px">Obtenu le ${P.certificates[cat]}</div>`;
      modal.classList.add('open');
      modal.dataset.cat = cat;
    }

    function downloadCertificate() {
      const modal = document.getElementById('certModal');
      const cat = modal.dataset.cat;
      if (!cat) return;
      const label = (CAT_LABELS[cat] || cat).replace(/^[^ ]+ /, '');
      const c = document.createElement('canvas');
      c.width = 640; c.height = 440;
      const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 640, 440);
      g.addColorStop(0, '#1a0a2e'); g.addColorStop(1, '#2d1050');
      x.fillStyle = g; x.fillRect(0, 0, 640, 440);
      x.strokeStyle = '#ffd700'; x.lineWidth = 6; x.strokeRect(14, 14, 612, 412);
      x.strokeStyle = 'rgba(255,215,0,.45)'; x.lineWidth = 2; x.strokeRect(26, 26, 588, 388);
      x.textAlign = 'center';
      x.fillStyle = '#ffd700'; x.font = '900 64px sans-serif'; x.fillText('🏅', 320, 110);
      x.font = '900 30px sans-serif'; x.fillText('CERTIFICAT DE MAÎTRISE', 320, 165);
      x.fillStyle = '#fff'; x.font = '900 38px sans-serif'; x.fillText(label, 320, 225);
      x.font = '700 20px sans-serif'; x.fillStyle = 'rgba(255,255,255,.85)';
      x.fillText(`Décerné à ${P.name || 'Explorateur'} ${P.avatar || ''}`, 320, 275);
      x.font = '700 15px sans-serif'; x.fillStyle = 'rgba(255,255,255,.6)';
      x.fillText('Précision ≥ 80 % sur 50 questions ou plus — niveau parfait atteint', 320, 310);
      x.fillText(`KnowQuest — ${P.certificates[cat]}`, 320, 345);
      x.font = '700 22px sans-serif'; x.fillText('🦉 Chouette, témoin de ta progression', 320, 395);
      const a = document.createElement('a');
      a.download = `certificat-${cat}.png`;
      a.href = c.toDataURL('image/png');
      a.click();
    }

    // ===== CHARGEMENT PROGRESSIF DES QUESTIONS =====
    // Les banques sont déjà dans window.X_QB (injectées par data_loader.js).
    // Ce système ajoute un chargement à la demande : on ne résout la banque
    // que quand elle est réellement nécessaire, et on trace les banques déjà prêtes.
    const _loadedBanks = new Set();

    async function ensureBankLoaded(bankKey) {
      if (_loadedBanks.has(bankKey)) return; // déjà prête
      const winKey = {
        geo: 'GEO_QB', hist: 'HIST_QB', sci: 'SCI_QB', art: 'ART_QB',
        cinema: 'CINEMA_QB', sport: 'SPORT_QB', gastro: 'GASTRO_QB',
        mytho: 'MYTHO_QB', chateaux: 'CHATEAUX_QB', litt: 'LITT_QB', mixed: null,
        tf: 'TF_QB', scramble: 'SCRAMBLE_QB', extended: 'EXTENDED_QB'
      }[bankKey];
      if (winKey && window[winKey] && window[winKey].length > 0) {
        _loadedBanks.add(bankKey);
        return; // data_loader.js l'a déjà injectée
      }
      // Banque pas encore prête : on attend l'injection. Attention, les banques
      // "secondaires" (TF, Scramble) arrivent en arrière-plan APRÈS le signal
      // kq:data-loaded — d'où l'écoute dédiée de kq:bank-loaded.
      await new Promise(resolve => {
        const finish = () => { window.removeEventListener('kq:bank-loaded', onBank); _loadedBanks.add(bankKey); resolve(); };
        const onBank = (e) => { if (!winKey || (e.detail && e.detail.name === winKey)) check(); };
        const check = () => {
          if (!winKey || (window[winKey] && window[winKey].length > 0)) finish();
        };
        check();
        window.addEventListener('kq:data-loaded', check, { once: true });
        window.addEventListener('kq:bank-loaded', onBank);
        setTimeout(finish, 10000); // filet de sécurité : fichier définitivement absent
      });
    }

    function getPool(bankKey) {
      // Résolution synchrone (la banque doit être prête — appelée après ensureBankLoaded)
      if (bankKey === 'geo') return window.GEO_QB || [];
      if (bankKey === 'hist') return window.HIST_QB || [];
      if (bankKey === 'sci') return window.SCI_QB || [];
      if (bankKey === 'art') return window.ART_QB || [];
      if (bankKey === 'cinema') return window.CINEMA_QB || [];
      if (bankKey === 'sport') return window.SPORT_QB || [];
      if (bankKey === 'gastro') return window.GASTRO_QB || [];
      if (bankKey === 'mytho') return window.MYTHO_QB || [];
      if (bankKey === 'chateaux') return window.CHATEAUX_QB || [];
      if (bankKey === 'litt') return window.LITT_QB || [];
      if (bankKey === 'extended') return window.EXTENDED_QB || [];
      if (bankKey === 'mixed' || bankKey === 'mixedAll') {
        const all = [
          ...(window.GEO_QB || []), ...(window.HIST_QB || []), ...(window.SCI_QB || []),
          ...(window.ART_QB || []), ...(window.CINEMA_QB || []), ...(window.SPORT_QB || []),
          ...(window.GASTRO_QB || []), ...(window.MYTHO_QB || []),
          ...(window.EXTENDED_QB || []), ...(window.CHATEAUX_QB || [])
        ];
        return shuffle(all);
      }
      if (bankKey === 'tf') return window.TF_QB || [];
      if (bankKey === 'scramble') return window.SCRAMBLE_QB || [];
      return window.GEO_QB || [];
    }

    // Adaptive difficulty
    function getDifficultyPool(bankKey) {
      const pool = getPool(bankKey);
      return filterSeenQuestions(pool);
    }

    // ===== MASTERY TREE PAR CATÉGORIE =====
    const MASTERY_THRESHOLDS = [0, 10, 25, 50, 90, 150, 230, 330, 460, 620, 820];
    const MASTERY_BADGES = ['🌱', '🔰', '⭐', '🌟', '💫', '🏅', '🎖️', '🏆', '👑', '💎', '🔱'];

    function getMasteryLevelForCorrect(correct) {
      let lvl = 1;
      for (let i = 0; i < MASTERY_THRESHOLDS.length; i++) if (correct >= MASTERY_THRESHOLDS[i]) lvl = i + 1;
      return Math.min(lvl, MASTERY_THRESHOLDS.length);
    }
    function getCatMasteryProgress(cat) {
      const stat = P.catStats[cat] || { correct: 0, total: 0 };
      const level = getMasteryLevelForCorrect(stat.correct);
      const idx = level - 1;
      const curThreshold = MASTERY_THRESHOLDS[idx] !== undefined ? MASTERY_THRESHOLDS[idx] : MASTERY_THRESHOLDS[MASTERY_THRESHOLDS.length - 1];
      const nextThreshold = MASTERY_THRESHOLDS[idx + 1];
      const isMax = nextThreshold === undefined;
      const pct = isMax ? 100 : Math.round(((stat.correct - curThreshold) / (nextThreshold - curThreshold)) * 100);
      return { level, correct: stat.correct, pct: Math.max(0, Math.min(100, pct)), isMax, nextThreshold };
    }
    function checkCatMasteryLevelUp(cat) {
      if (!cat) return;
      const stat = P.catStats[cat]; if (!stat) return;
      const newLevel = getMasteryLevelForCorrect(stat.correct);
      const prevLevel = P.specialties[cat] || 1;
      if (newLevel > prevLevel) {
        P.specialties[cat] = newLevel;
        const rewardXP = newLevel * 20, rewardGems = newLevel * 8;
        addXP(rewardXP); P.gems += rewardGems; save();
        const label = CAT_LABELS[cat] || cat;
        const badge = MASTERY_BADGES[Math.min(newLevel - 1, MASTERY_BADGES.length - 1)];
        setTimeout(() => {
          spawnConfetti(30);
          showBonusPopup(badge, `Maîtrise Niveau ${newLevel} !`, `${label} — tu progresses !`,
            [`⭐ +${rewardXP} XP`, `💎 +${rewardGems} Gemmes`]);
        }, 500);
      }
    }
    function renderMasteryTree() {
      const sl = document.getElementById('specialtiesList'); if (!sl) return;
      const cats = ['geo', 'hist', 'sci', 'art', 'cinema', 'sport', 'gastro', 'mytho', 'chateaux', 'litt', 'extended', 'mixed'];
      sl.innerHTML = cats.map(cat => {
        const label = CAT_LABELS[cat] || cat;
        const mp = getCatMasteryProgress(cat);
        const badge = MASTERY_BADGES[Math.min(mp.level - 1, MASTERY_BADGES.length - 1)];
        // Catégorie quasi parfaitement réussie → libellé en arc-en-ciel
        const rb = isCatPerfected(cat) ? ' rainbow-text' : '';
        return `<div class="specialty-item" style="flex-direction:column;align-items:stretch;gap:6px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="spec-label${rb}" style="font-weight:800">${badge} ${label}</span>
            <span class="spec-badge">Maîtrise ${mp.level}</span>
          </div>
          <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${mp.pct}%;background:var(--purple)"></div></div>
          <div style="font-size:11px;color:var(--muted);font-weight:700;text-align:right">${mp.isMax ? 'Niveau max !' : `${mp.correct}/${mp.nextThreshold} bonnes réponses`}</div>
        </div>`;
      }).join('');
    }

    function recordCatStat(cat, correct) {
      if (!cat) return;
      if (!P.catStats[cat]) P.catStats[cat] = { correct: 0, total: 0 };
      P.catStats[cat].total++;
      if (correct) P.catStats[cat].correct++;
      logDay('q');
      if (correct) logDay('c');
      // Le total global progresse question par question (cohérent avec catStats,
      // qui auparavant divergeait car P.totalQ n'était ajouté qu'en fin de session)
      P.totalQ = (P.totalQ || 0) + 1;
      // Streak par catégorie
      updateCatStreak(cat, correct);
      // Objectifs personnalisés : chaque question répondue compte
      updateObjectiveProgress(cat);
      if (correct) { checkCatMasteryLevelUp(cat); checkCatCertificate(cat); }
    }

    // Heart regen system
    function startHeartRegen() {
      if (_heartRegenInterval) clearInterval(_heartRegenInterval);
      _heartRegenInterval = setInterval(() => {
        if (P.hearts < 5) {
          const elapsed = Date.now() - P.lastHeartTime;
          if (elapsed >= (hasTalent('t_heart_fast') ? 1800000 : 3600000)) {
            P.hearts = Math.min(5, P.hearts + 1);
            P.lastHeartTime = Date.now();
            save(); updateUI();
            showHeartNotif();
          }
        }
      }, 60000);
    }

    function showHeartNotif() {
      const n = document.getElementById('heartNotif');
      n.classList.add('show');
      setTimeout(() => n.classList.remove('show'), 3000);
      Companion.react('heart_back');
    }

    function toggleHeartTip() {
      const tip = document.getElementById('heartRegenTip');
      if (P.hearts >= 5) { tip.textContent = '❤️ Cœurs au max !'; }
      else {
        const mins = Math.max(0, 60 - Math.floor((Date.now() - P.lastHeartTime) / 60000));
        tip.textContent = `⏱️ Prochain cœur : ${mins}min`;
      }
      tip.classList.toggle('show');
      setTimeout(() => tip.classList.remove('show'), 2000);
    }

    // ===== UI UPDATE =====
    function updateUI() {
      const at = document.getElementById('autoTtsToggle'); if (at) at.checked = !!P.autoTTS;
      document.getElementById('valStreak').textContent = P.streak;
      const xf = document.getElementById('valXpFill');
      if (xf) xf.style.width = Math.min(100, Math.round((P.xp / P.xpMax) * 100)) + '%';
      document.getElementById('valGems').textContent = P.gems;
      document.getElementById('valHearts').textContent = P.hearts;
      document.getElementById('profName').textContent = P.name;
      document.getElementById('profAv').textContent = P.avatar;
      document.getElementById('profLvl').textContent = P.level;
      document.getElementById('profQ').textContent = P.totalQ;
      document.getElementById('profAcc').textContent = P.totalQ > 0 ? Math.round((P.totalCorrect / P.totalQ) * 100) + '%' : '0%';
      const atlasCount = P.atlas.length;
      document.getElementById('profAtlas').textContent = atlasCount;
      document.getElementById('atlasCountBtn').textContent = atlasCount;
      const rbHome = document.getElementById('rallyeBestHome');
      if (rbHome) rbHome.textContent = P.rallyeBest || 0;


      const acc = document.getElementById('profAccessory');
      if (acc) { acc.textContent = P.avatarStyle.hat || ''; acc.style.display = P.avatarStyle.hat ? 'block' : 'none'; }

      const al = document.getElementById('achList');
      if (al) { al.innerHTML = ''; window.ACHIEVEMENTS.forEach(a => { const u = P.achievements.includes(a.id); al.innerHTML += `<div class="ach-card ${u ? 'unlocked' : ''}" title="${a.desc || ''}"><span class="ach-ico">${a.ico}</span><span class="ach-name">${a.name}</span></div>`; }); }

      renderStreakCalendar();
      renderPersonalDashboard();
      renderShowcase();
      checkAchievements();   // les succès se débloquent aussi à la simple visite du profil
      checkTitleUnlocks();
      renderTitles();
      renderHonors();
      renderWeeklyBonusCard();

      renderMasteryTree();

      buildCategoryStats();
      buildHistoryLog();

      const dq = document.getElementById('dailyQuestContainer');
      if (dq) { const today = new Date().toISOString().split('T')[0]; dq.innerHTML = P.lastQuestDate === today ? `<div class="daily-quest-card"><div class="dq-info"><div class="dq-title">Quête Quotidienne</div><div class="dq-status">✅ Terminé !</div></div><div style="font-size:20px">🎁</div></div>` : `<div class="daily-quest-card"><div class="dq-info"><div class="dq-title">Quête Quotidienne</div><div class="dq-status">Réponds à 15 questions → 10 💎</div></div><div style="font-size:20px">🎯</div></div>`; }

      buildEventBanner();
      renderDailyMissionsCard();
      renderLegendBossCard();
      renderProfileStats();
      applyRoadTheme();
      buildCatButtons();

      const ev = document.getElementById('eventLabel');
      if (ev) { const d = new Date().getDay(); if (d === 0 || d === 6) { ev.textContent = '🌟 Week-end Découverte — 2× XP!'; ev.style.color = 'var(--orange)'; } else { ev.textContent = 'Parcours Principal'; ev.style.color = 'var(--muted)'; } }

      buildShop();
      document.getElementById('puCount5050').textContent = P.powerups.fiftyfifty;
      document.getElementById('puCountShield').textContent = P.powerups.shield;
      document.getElementById('puCountDoubleXP').textContent = P.powerups.doubleXP;
      document.getElementById('puFiftyFifty').disabled = P.powerups.fiftyfifty <= 0;
      document.getElementById('puShield').disabled = P.powerups.shield <= 0;
      document.getElementById('puDoubleXP').disabled = P.powerups.doubleXP <= 0;
      const sb = document.getElementById('shieldBadge');
      if (sb) sb.className = 'shield-active-badge' + (P.shieldActive ? ' on' : '');
      const dxb = document.getElementById('doubleXPBadge');
      if (dxb) dxb.style.display = P.doubleXPActive ? 'inline-block' : 'none';

      const nht = document.getElementById('nextHeartTime');
      if (nht && P.hearts < 5) {
        const mins = Math.max(0, 60 - Math.floor((Date.now() - P.lastHeartTime) / 60000));
        nht.textContent = `Prochain cœur dans environ ${mins} minute(s)`;
      }
    }

    function buildCategoryStats() {
      const div = document.getElementById('categoryStats');
      if (!div) return;
      const cats = [
        { k: 'geo', label: '🗺️ Géo', color: 'var(--blue)' },
        { k: 'hist', label: '🏛️ Hist', color: 'var(--orange)' },
        { k: 'sci', label: '🧪 Sci', color: 'var(--green)' },
        { k: 'art', label: '🎨 Art', color: 'var(--purple)' },
        { k: 'cinema', label: '🎬 Ciné', color: 'var(--cinema)' },
        { k: 'sport', label: '⚽ Sport', color: 'var(--sport)' },
        { k: 'gastro', label: '🍽️ Gastro', color: 'var(--gastro)' },
        { k: 'mytho', label: '⚡ Mytho', color: 'var(--mytho)' },
        { k: 'chateaux', label: '🏰 Châteaux', color: 'var(--litt)' },
        { k: 'litt', label: '📖 Littérature', color: 'var(--litt)' },
        { k: 'extended', label: '🌟 Extra', color: 'var(--gold-d)' },
        { k: 'mixed', label: '🧠 Culture G', color: 'var(--purple-d)' },
      ];
      // Toute catégorie jouée mais absente de la liste ci-dessus est ajoutée
      // afin que la somme des barres corresponde aux stats globales du profil.
      Object.keys(P.catStats || {}).forEach(k => {
        if (!cats.some(c => c.k === k) && P.catStats[k].total > 0) {
          cats.push({ k, label: (CAT_LABELS[k] || k), color: 'var(--muted)' });
        }
      });
      div.innerHTML = cats.map(c => {
        const stat = P.catStats[c.k];
        if (!stat || stat.total === 0) return '';  // catégories jamais jouées : pas de barre vide
        const pct = Math.round(stat.correct / stat.total * 100);
        const n = stat.total;
        return `<div class="stat-bar-row">
      <div class="stat-bar-label">${c.label} <span style="font-size:10px;color:var(--muted)">(${n})</span></div>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%;background:${c.color}"></div></div>
      <div class="stat-bar-pct">${pct}%</div>
    </div>`;
      }).join('');
    }

    function buildHistoryLog() {
      const div = document.getElementById('historyLog');
      if (!div) return;
      if (!P.history || P.history.length === 0) { div.innerHTML = '<p style="font-size:13px;color:var(--muted);font-weight:700;text-align:center;padding:10px">Aucune partie jouée</p>'; return; }
      div.innerHTML = P.history.slice(-10).reverse().map(h => `
    <div class="history-item">
      <div><div class="history-mode">${h.mode || 'Quiz'}</div><div class="history-meta">${h.correct || 0}/${h.total || 0} — ${h.date || ''}</div></div>
      <div class="history-xp">+${h.xp || 0} XP</div>
    </div>`).join('');
    }

    // buildEventBanner est définie en fin de fichier (calendrier SEASONAL_EVENTS)

    function buildCatButtons() {
      const div = document.getElementById('catButtons');
      if (!div) return;
      const cats = [
        { k: 'geo', label: '🗺️ Géo', color: 'var(--blue)' },
        { k: 'hist', label: '🏛️ Histoire', color: 'var(--orange)' },
        { k: 'sci', label: '🧪 Sciences', color: 'var(--green)' },
        { k: 'art', label: '🎨 Arts', color: 'var(--purple)' },
        { k: 'cinema', label: '🎬 Cinéma', color: 'var(--cinema)' },
        { k: 'sport', label: '⚽ Sport', color: 'var(--sport)' },
        { k: 'gastro', label: '🍽️ Gastronomie', color: 'var(--gastro)' },
        { k: 'mytho', label: '⚡ Mythologie', color: 'var(--mytho)' },
        { k: 'chateaux', label: '🏰 Châteaux', color: 'var(--litt)' },
        { k: 'litt', label: '📖 Littérature', color: 'var(--litt)' },
        { k: 'extended', label: '🌟 Extra', color: 'var(--gold-d)' },
        { k: 'seasonal', label: '🎪 Événement', color: 'var(--red)' },
      ];
      div.innerHTML = cats.map(c => `<span class="cat-chip" style="background:${c.color}20;color:${c.color};border:2px solid ${c.color}" onclick="startMode('cat_${c.k}')">${c.label}</span>`).join('');
    }

    let _shopBuilt = false;
    function buildShop() {
      if (_shopBuilt) { updateShopCounts(); return; }
      _shopBuilt = true;
      const pDiv = document.getElementById('shopPowerups');
      if (pDiv) { pDiv.innerHTML = ''; POWERUP_SHOP.forEach(it => { pDiv.innerHTML += `<div class="shop-item"><div class="shop-info"><div class="shop-ico">${it.ico}</div><div class="shop-details"><div class="shop-name">${it.name}</div><div class="shop-desc">${it.desc}</div></div></div><button class="btn-buy" id="buyPu_${it.id}" onclick="buyPowerup('${it.id}',${it.cost})">💎 ${it.cost}</button></div>`; }); }
      const aDiv = document.getElementById('shopAccessories');
      if (aDiv) renderHatShop(aDiv);
      const cDiv = document.getElementById('shopConsumables');
      if (cDiv) { cDiv.innerHTML = `<div class="shop-item"><div class="shop-info"><div class="shop-ico">❤️</div><div class="shop-details"><div class="shop-name">Cœur de vie</div><div class="shop-desc">Récupère 1 cœur</div></div></div><button class="btn-buy" onclick="buyItem('heart',10)">💎 10</button></div><div class="shop-item"><div class="shop-info"><div class="shop-ico">💰</div><div class="shop-details"><div class="shop-name">Boost XP</div><div class="shop-desc">+50 XP instantané</div></div></div><button class="btn-buy" onclick="buyItem('xp',15)">💎 15</button></div><div class="shop-item"><div class="shop-info"><div class="shop-ico">💰</div><div class="shop-details"><div class="shop-name">Pack Questions</div><div class="shop-desc">Débloque 30 questions événementielles</div></div></div><button class="btn-buy" onclick="buyItem('eventpack',50)">💎 50</button></div>`; }
      const chDiv = document.getElementById('shopChance');
      if (chDiv) { chDiv.innerHTML = `<div class="shop-item"><div class="shop-info"><div class="shop-ico">🎡</div><div class="shop-details"><div class="shop-name">Roue de la Chance</div><div class="shop-desc">Un tour = 40 💎 — un prix garanti à chaque tour !</div></div></div><button class="btn-buy" onclick="openWheel()">Jouer</button></div><div class="shop-item"><div class="shop-info"><div class="shop-ico">🎟️</div><div class="shop-details"><div class="shop-name">Carte à Gratter</div><div class="shop-desc">25 💎 la carte — gratte la zone argentée pour découvrir ton lot !</div></div></div><button class="btn-buy" onclick="openScratch()">Jouer</button></div>`; }
      renderCosmeticsShop();
      updateShopCounts();
    }

    // ===== COSMÉTIQUES (accessoires avatar) =====
    // Achetés UNE SEULE FOIS (P.ownedHats), puis on s'équipe / se déséquipe gratuitement.
    const HAT_CATALOG = [
      { id: 'cap',     ico: '🧢', name: 'Casquette décontractée', desc: 'Style détente',     cost: 10 },
      { id: 'scarf',   ico: '🧣', name: 'Écharpe chaleureuse',    desc: 'Pour les révisions d\'hiver', cost: 12 },
      { id: 'cool',    ico: '🕶️', name: 'Lunettes cool',          desc: 'Impossible de te distraire', cost: 15 },
      { id: 'chic',    ico: '👒', name: 'Chapeau chic',           desc: 'Élégance absolue',   cost: 18 },
      { id: 'tophat',  ico: '🎩', name: 'Chapeau haut-de-forme',  desc: 'Style classique',    cost: 25 },
      { id: 'cowboy',  ico: '🤠', name: 'Chapeau de cowboy',      desc: 'Sherif du quiz',     cost: 25 },
      { id: 'grad',    ico: '🎓', name: 'Diplôme de savoir',      desc: 'La science en plus', cost: 30 },
      { id: 'hat',     ico: '👑', name: 'Couronne royale',        desc: 'Accessoire avatar',  cost: 30 },
      { id: 'pumpkin', ico: '🎃', name: 'Citrouille festive',     desc: 'Spécial Halloween',  cost: 30, event: 'halloween' },
      { id: 'star',    ico: '✨', name: 'Étoile filante',         desc: 'Brille sous les confettis', cost: 45 },
      { id: 'wizard',  ico: '🧙', name: 'Chapeau de sorcier',     desc: 'Magie des connaissances', cost: 50 },
      { id: 'rainbow', ico: '🌈', name: 'Arc-en-ciel',            desc: 'L\'accessoire ultime', cost: 80 },
      // Chapeaux événementiels : visibles uniquement pendant leur événement (P4)
      { id: 'backpack', ico: '🎒', name: 'Cartable de Rentrée',   desc: 'Spécial Rentrée des Classes', cost: 35, event: 'rentree' },
      { id: 'santahat', ico: '🎅', name: 'Bonnet de Noël',        desc: 'Spécial Noël Culturel', cost: 40, event: 'noel' },
      { id: 'cupid',   ico: '💘', name: 'Diadème Cupidon',        desc: 'Spécial Saint-Valentin', cost: 35, event: 'saintval' },
    ];
    function ensureHatInventory() {
      // Migration : un accessoire déjà porté devient la possession d'origine
      if (!P.ownedHats) P.ownedHats = [];
      if (P.avatarStyle && P.avatarStyle.hat) {
        const equipped = HAT_CATALOG.find(h => h.ico === P.avatarStyle.hat);
        if (equipped && !P.ownedHats.includes(equipped.id)) P.ownedHats.push(equipped.id);
      }
    }
    function renderHatShop(aDiv) {
      ensureHatInventory();
      const activeEv = (getActiveEvent() || {}).id;
      // Les chapeaux événementiels n'apparaissent que pendant leur événement
      aDiv.innerHTML = HAT_CATALOG.filter(h => !h.event || h.event === activeEv).map(h => `
        <div class="shop-item"><div class="shop-info"><div class="shop-ico">${h.ico}</div>
        <div class="shop-details"><div class="shop-name">${h.name}</div><div class="shop-desc">${h.desc}</div></div></div>
        <button class="btn-buy" id="buyHat_${h.id}" onclick="buyOrEquipHat('${h.id}')"></button></div>`).join('');
      updateShopCounts();
    }
    function buyOrEquipHat(id) {
      const hat = HAT_CATALOG.find(h => h.id === id);
      if (!hat) return;
      ensureHatInventory();
      if (!P.ownedHats.includes(id)) {
        if (P.gems < hat.cost) { showToast('💎 Pas assez de gemmes !'); return; }
        P.gems -= hat.cost;
        P.ownedHats.push(id);
        P.avatarStyle.hat = hat.ico;
        showToast(`${hat.ico} ${hat.name} débloqué !`);
      } else {
        // Déjà possédé : équiper / retirer gratuitement, à volonté
        P.avatarStyle.hat = (P.avatarStyle.hat === hat.ico) ? null : hat.ico;
      }
      save(); updateUI(); updateShopCounts();
    }

    function updateShopCounts() {
      POWERUP_SHOP.forEach(it => { const btn = document.getElementById('buyPu_' + it.id); if (btn) btn.textContent = `💎 ${it.cost} (x${P.powerups[it.id]})`; });
      HAT_CATALOG.forEach(h => {
        const btn = document.getElementById('buyHat_' + h.id);
        if (!btn) return;
        const owned = (P.ownedHats || []).includes(h.id);
        if (owned && P.avatarStyle.hat === h.ico) { btn.textContent = 'Équipé ✓'; btn.disabled = true; }
        else if (owned) { btn.textContent = 'Équiper'; btn.disabled = false; }
        else { btn.textContent = `💎 ${h.cost}`; btn.disabled = false; }
      });
    }

    function buyPowerup(id, cost) {
      if (P.gems < cost) { showToast('💎 Pas assez de gemmes !'); return; }
      P.gems -= cost; P.powerups[id]++;
      save(); updateUI(); showToast(`${id === 'fiftyfifty' ? '✂️' : id === 'shield' ? '🛡️' : id === 'streakFreeze' ? '🧊' : '⚡'} Power-up acheté !`);
    }

    function buyItem(type, cost) {
      if (P.gems < cost) { showToast('💎 Pas assez de gemmes !'); return; }
      P.gems -= cost;
      if (type === 'heart') { P.hearts = P.hearts + 1; showToast('❤️ +1 cœur !'); }  // achat sans plafond
      if (type === 'xp') addXP(50);
      if (type === 'eventpack') showToast('🌟 Pack événementiel débloqué !');
      save(); updateUI();
    }

    function buyHeartAndContinue() {
      if (P.gems < 10) { showToast('💎 Pas assez de gemmes !'); return; }
      P.gems -= 10; P.hearts = P.hearts + 1;  // achat sans plafond
      save(); updateUI();
      document.getElementById('scrNoHearts').style.display = 'none';
      startApp();
    }

    // ===== POWER-UP USAGE =====
    function usePowerup(type) {
      if (Q.state !== 'selecting') return;
      if (P.powerups[type] <= 0) return;
      if (type === 'fiftyfifty') {
        const q = Q.qs[Q.idx];
        if (!q.choices) return;
        const btns = document.querySelectorAll('.ans-btn');
        // Talent 50/50 amélioré : élimine 3 mauvaises réponses au lieu de 2
        const toKill = hasTalent('t_fifty3') ? 3 : 2;
        let eliminated = 0;
        for (let i = 0; i < btns.length && eliminated < toKill; i++) {
          if (i !== q.correctAnswer && !btns[i].classList.contains('selected')) {
            btns[i].classList.add('eliminated'); eliminated++;
          }
        }
        P.powerups.fiftyfifty--;
      } else if (type === 'shield') {
        P.shieldActive = true; P.powerups.shield--;
        document.getElementById('shieldBadge').className = 'shield-active-badge on';
      } else if (type === 'doubleXP') {
        P.doubleXPActive = true; P.powerups.doubleXP--;
        document.getElementById('doubleXPBadge').style.display = 'inline-block';
      }
      save(); updateUI();
    }

    // ===== NAVIGATION =====
    function switchTab(t) {
      ['Home', 'Learn', 'Shop', 'Profile'].forEach(s => {
        const el = document.getElementById('scr' + s); if (el) el.classList.remove('active');
        const btn = document.getElementById('tab' + s); if (btn) btn.classList.remove('on');
      });
      document.getElementById('scr' + t).classList.add('active');
      document.getElementById('tab' + t).classList.add('on');
      if (t === 'Home') buildRoad();
      if (t === 'Learn') { updateDailyChallengeUI(); updateMissionsSummary(); renderSrsCard(); }
      if (t === 'Profile' || t === 'Shop') { _shopBuilt = false; updateUI(); }
      updateCompanionVisibility();
    }

    // ===== ROADMAP — CHAPTER THEMES =====
    // Purely visual: maps a node's question bank / chapter name to a color & icon identity.
    // Never affects question selection, XP, rewards or progression logic.
    const CHAPTER_THEMES = {
      geo: { key: 'geo', label: 'Géographie', ico: '🌍', c1: '#58cc02', c2: '#3d9a01', accent: 'var(--green)', accentD: 'var(--green-d)', bg: 'var(--green-bg)', particle: '🌿' },
      hist: { key: 'hist', label: 'Histoire', ico: '🏛️', c1: '#e8a33d', c2: '#b9791f', accent: 'var(--orange)', accentD: 'var(--orange-d)', bg: 'var(--orange-bg)', particle: '🏺' },
      sci: { key: 'sci', label: 'Sciences', ico: '🔬', c1: '#1cb0f6', c2: '#0d84c2', accent: 'var(--blue)', accentD: 'var(--blue-d)', bg: 'var(--blue-bg)', particle: '⚗️' },
      art: { key: 'art', label: 'Arts', ico: '🎨', c1: '#cc66e0', c2: '#9c27b0', accent: 'var(--mytho)', accentD: '#7b1fa2', bg: 'var(--mytho-bg)', particle: '🖌️' },
      cinema: { key: 'cinema', label: 'Cinéma', ico: '🎬', c1: '#f0479e', c2: '#c21c74', accent: 'var(--cinema)', accentD: '#b3156a', bg: 'var(--cinema-bg)', particle: '🎞️' },
      sport: { key: 'sport', label: 'Sport', ico: '⚽', c1: '#00d9a3', c2: '#00a17a', accent: 'var(--sport)', accentD: '#00a17a', bg: 'var(--sport-bg)', particle: '🏅' },
      gastro: { key: 'gastro', label: 'Gastronomie', ico: '🍽️', c1: '#ff8a5c', c2: '#e5652c', accent: 'var(--gastro)', accentD: '#e5652c', bg: 'var(--gastro-bg)', particle: '🍓' },
      mytho: { key: 'mytho', label: 'Mythologie', ico: '⚡', c1: '#b25ce0', c2: '#7b1fa2', accent: 'var(--mytho)', accentD: '#7b1fa2', bg: 'var(--mytho-bg)', particle: '✨' },
      chateaux: { key: 'chateaux', label: 'Châteaux', ico: '🏰', c1: '#8199d6', c2: '#4a5f96', accent: 'var(--litt)', accentD: '#3949ab', bg: 'var(--litt-bg)', particle: '🕊️' },
      litt: { key: 'litt', label: 'Littérature', ico: '📖', c1: '#7986cb', c2: '#3949ab', accent: 'var(--litt)', accentD: '#3949ab', bg: 'var(--litt-bg)', particle: '🖋️' },
      extended: { key: 'extended', label: 'Extra', ico: '🌟', c1: '#ffd23d', c2: '#e5b400', accent: 'var(--orange)', accentD: 'var(--orange-d)', bg: 'var(--orange-bg)', particle: '⭐' },
      mixed: { key: 'mixed', label: 'Culture Générale', ico: '🧠', c1: '#9c7bfd', c2: '#5345c7', accent: 'var(--purple)', accentD: 'var(--purple-d)', bg: 'var(--purple-bg)', particle: '💡' },
    };
    // Minimalist single-color SVG line-art per world, echoing each chapter's identity
    // (nature for geography, ruins for history, molecules for science, etc.)
    const CHAPTER_MOTIFS = {
      geo: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="76" cy="24" r="9" fill="currentColor" stroke="none"/><path d="M8 78 L34 40 L50 62 L64 44 L92 78 Z"/></svg>',
      hist: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 34 L50 12 L88 34"/><path d="M10 34 H90"/><path d="M22 34 V80 M40 34 V80 M60 34 V80 M78 34 V80"/><path d="M10 88 H90"/></svg>',
      sci: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><circle cx="50" cy="50" r="7" fill="currentColor" stroke="none"/><circle cx="20" cy="28" r="6" fill="currentColor" stroke="none"/><circle cx="82" cy="30" r="6" fill="currentColor" stroke="none"/><circle cx="30" cy="82" r="6" fill="currentColor" stroke="none"/><path d="M50 50 L20 28 M50 50 L82 30 M50 50 L30 82"/></svg>',
      art: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><path d="M50 12 C24 12 8 30 8 50 C8 66 20 70 30 62 C38 56 48 62 48 72 C48 84 60 90 72 82 C88 72 92 54 88 40 C82 20 68 12 50 12 Z"/><circle cx="30" cy="34" r="4" fill="currentColor" stroke="none"/><circle cx="56" cy="26" r="4" fill="currentColor" stroke="none"/><circle cx="74" cy="48" r="4" fill="currentColor" stroke="none"/></svg>',
      cinema: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"><rect x="12" y="18" width="76" height="64" rx="6"/><path d="M12 32 H88 M12 68 H88 M30 18 V32 M30 68 V82 M70 18 V32 M70 68 V82"/></svg>',
      sport: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="58" width="24" height="30"/><rect x="38" y="42" width="24" height="46"/><rect x="64" y="54" width="24" height="34"/><circle cx="50" cy="20" r="10"/></svg>',
      gastro: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><path d="M28 10 V46 M22 10 V32 C22 40 34 40 34 32 V10"/><path d="M70 10 C58 10 58 30 70 34 V90 M70 10 V90"/></svg>',
      mytho: '<svg viewBox="0 0 100 100" fill="currentColor" stroke="none"><path d="M58 6 L26 54 H46 L38 94 L78 40 H54 Z"/></svg>',
      chateaux: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 90 V50 L14 38 V26 M14 38 H26 M14 26 H24 M24 26 V16 M76 90 V50 L76 38 V26 M76 38 H88 M76 26 H86 M86 26 V16 M14 50 H86 M40 50 V26 H60 V50 M46 26 V16 M54 26 V16"/></svg>',
      litt: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M50 20 C40 12 20 12 12 18 V80 C20 74 40 74 50 82 C60 74 80 74 88 80 V18 C80 12 60 12 50 20 Z"/><path d="M50 20 V82"/></svg>',
      extended: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M50 8 L58 34 L86 34 L62 50 L70 78 L50 60 L30 78 L38 50 L14 34 L42 34 Z"/></svg>',
      mixed: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M50 14 C32 14 20 28 20 44 C20 56 28 62 34 70 H66 C72 62 80 56 80 44 C80 28 68 14 50 14 Z"/><path d="M38 82 H62 M42 92 H58"/></svg>',
    };
    function getThemeMotifSVG(theme) {
      const key = (theme && theme.key) || 'mixed';
      return CHAPTER_MOTIFS[key] || CHAPTER_MOTIFS.mixed;
    }

    // ===== MASCOT CHARACTER =====
    // One reusable little owl, drawn entirely in inline SVG. All expression
    // variants (eyebrows/mouths) are pre-drawn in the markup; only CSS classes
    // on the wrapper decide which ones show, so this renders identically
    // everywhere and needs zero image assets.
    const MASCOT_SVG = `<svg class="mascot-svg" viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="m-shadow" cx="60" cy="122" rx="28" ry="6"/>
      <g class="m-body-group">
        <path class="m-wing m-wing-l" d="M22,58 Q10,78 24,96 Q30,80 34,62 Z"/>
        <path class="m-wing m-wing-r" d="M98,58 Q110,78 96,96 Q90,80 86,62 Z"/>
        <ellipse class="m-foot m-foot-l" cx="44" cy="114" rx="9" ry="5"/>
        <ellipse class="m-foot m-foot-r" cx="76" cy="114" rx="9" ry="5"/>
        <ellipse class="m-body" cx="60" cy="66" rx="40" ry="44"/>
        <ellipse class="m-belly" cx="60" cy="78" rx="24" ry="28"/>
        <path class="m-beak" d="M60,72 L52,84 L68,84 Z"/>
        <ellipse class="m-cheek m-cheek-l" cx="26" cy="70" rx="7" ry="5"/>
        <ellipse class="m-cheek m-cheek-r" cx="94" cy="70" rx="7" ry="5"/>
        <circle class="m-eye-white m-eye-l" cx="42" cy="54" r="15"/>
        <circle class="m-eye-white m-eye-r" cx="78" cy="54" r="15"/>
        <circle class="m-pupil m-pupil-l" cx="42" cy="54" r="6"/>
        <circle class="m-pupil m-pupil-r" cx="78" cy="54" r="6"/>
        <path class="m-brow m-brow-happy-l" d="M27,36 Q42,26 57,36"/>
        <path class="m-brow m-brow-happy-r" d="M63,36 Q78,26 93,36"/>
        <path class="m-brow m-brow-sad-l" d="M29,38 Q42,46 55,42"/>
        <path class="m-brow m-brow-sad-r" d="M65,42 Q78,46 91,38"/>
        <path class="m-mouth m-mouth-smile" d="M46,86 Q60,96 74,86"/>
        <path class="m-mouth m-mouth-big-smile" d="M42,84 Q60,104 78,84"/>
        <path class="m-mouth m-mouth-frown" d="M46,92 Q60,82 74,92"/>
      </g>
      <text class="m-zzz" x="86" y="26">Z z z</text>
      <polygon class="m-sparkle" points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" transform="translate(18,24)" fill="#FFD700"/>
      <polygon class="m-sparkle" points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" transform="translate(102,18)" fill="#FF6B6B"/>
      <polygon class="m-sparkle" points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" transform="translate(8,62)" fill="#4ECDC4"/>
      <polygon class="m-sparkle" points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" transform="translate(112,66)" fill="#7c5cfc"/>
    </svg>`;
    function renderMascot(containerId, state) {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.className = 'mascot-wrap mascot-' + (state || 'idle');
      if (!el.dataset.built) { el.innerHTML = MASCOT_SVG; el.dataset.built = '1'; }
    }
    function setMascotState(containerId, state, revertMs, revertState) {
      const el = document.getElementById(containerId);
      if (!el) return;
      if (!el.dataset.built) { el.innerHTML = MASCOT_SVG; el.dataset.built = '1'; }
      el.className = 'mascot-wrap mascot-' + state;
      if (revertMs) {
        clearTimeout(el._mascotRevertTimer);
        el._mascotRevertTimer = setTimeout(() => { el.className = 'mascot-wrap mascot-' + (revertState || 'idle'); }, revertMs);
      }
    }

    function getNodeTheme(bank) {
      if (!bank) return CHAPTER_THEMES.mixed;
      const b = String(bank).toLowerCase();
      const key = Object.keys(CHAPTER_THEMES).find(k => b.includes(k));
      return CHAPTER_THEMES[key] || CHAPTER_THEMES.mixed;
    }
    function getChapterTheme(ch) {
      const nodes = (ch && ch.nodes) || [];
      const counts = {};
      nodes.forEach(n => { const k = Object.keys(CHAPTER_THEMES).find(k2 => String(n.bank || '').toLowerCase().includes(k2)) || 'mixed'; counts[k] = (counts[k] || 0) + 1; });
      let bestKey = 'mixed', bestCount = -1;
      Object.keys(counts).forEach(k => { if (counts[k] > bestCount) { bestCount = counts[k]; bestKey = k; } });
      return CHAPTER_THEMES[bestKey] || CHAPTER_THEMES.mixed;
    }

    let _roadRenderedOnce = false;
    let _prevCurrentNodeId = null;
    let _roadResizeBound = false;

    // ===== MAP =====
    let _prevDoneNodeIds = new Set();

    function buildRoad() {
      const c = document.getElementById('nodesContainer'); if (!c) return;
      c.innerHTML = '';
      const offsets = ['calc(25%)', 'calc(50%)', 'calc(75%)', 'calc(50%)'];
      let gi = 0;
      const roadData = window.ROAD || window.KQ_ROADMAP || [];
      let newlyCurrentNodeId = null;
      let newlyCurrentIsFirstOfChapter = -1;
      let activeTheme = null;
      let totalNodes = 0, doneNodes = 0;

      roadData.forEach((ch, chIdx) => {
        const theme = getChapterTheme(ch);
        const chDone = ch.nodes.filter(n => P.nodeProgress[n.id]).length;
        totalNodes += ch.nodes.length; doneNodes += chDone;

        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.style.setProperty('--ch-accent', theme.accent);
        card.style.setProperty('--ch-bg', theme.bg);
        card.innerHTML = `<div class="chapter-card-motif">${getThemeMotifSVG(theme)}</div>
          <div class="chapter-card-ico">${theme.ico}</div>
          <div>
            <div class="chapter-card-title">${ch.name}</div>
            <div class="chapter-card-sub">${theme.label}</div>
          </div>
          <div class="chapter-card-pct">${chDone}/${ch.nodes.length}</div>`;
        c.appendChild(card);

        ch.nodes.forEach((node, i) => {
          const done = P.nodeProgress[node.id];
          const prev = getPrevNodeId(gi);
          // Nouveau : le boss du chapitre précédent doit être vaincu pour que
          // ce chapitre s'ouvre (avant, la suite s'ouvrait sans faire le boss).
          const bossGate = chIdx === 0 || !!(P.bossDefeated && P.bossDefeated['boss_ch' + (chIdx - 1)]);
          const curr = !done && bossGate && (gi === 0 || P.nodeProgress[prev]);
          if (curr) { newlyCurrentNodeId = node.id; activeTheme = theme; if (i === 0) newlyCurrentIsFirstOfChapter = chIdx; }
          const nodeTheme = getNodeTheme(node.bank) || theme;
          const stars = (P.nodeStars && P.nodeStars[node.id]) || 0;

          const row = document.createElement('div'); row.className = 'node-row';
          const n = document.createElement('div');
          n.className = `road-node ${done ? 'done' : curr ? 'current' : 'locked'}`;
          n.style.left = offsets[i % offsets.length]; n.style.transform = 'translateX(-50%)';
          n.style.setProperty('--node-accent', nodeTheme.accent);
          n.style.setProperty('--node-accent-d', nodeTheme.accentD);
          n.style.setProperty('--node-accent-bg', nodeTheme.bg);
          if (_roadRenderedOnce && curr && _prevCurrentNodeId !== node.id) n.classList.add('node-just-unlocked');
          if (_roadRenderedOnce && done && !_prevDoneNodeIds.has(node.id)) n.classList.add('node-complete-zoom');
          if (done) _prevDoneNodeIds.add(node.id);
          n.dataset.nodeId = node.id;

          if (node.type === 'chest') { n.textContent = done ? '✅' : '🎁'; if (!(!done && !curr)) n.onclick = () => openChest(node); }
          else { n.textContent = done ? '✅' : node.ico; if (curr || done) n.onclick = () => openLessonPopup(node, ch); }

          const lbl = document.createElement('div'); lbl.className = 'node-label';
          lbl.style.left = offsets[i % offsets.length]; lbl.style.transform = 'translateX(-50%)'; lbl.textContent = node.label;

          row.appendChild(n); row.appendChild(lbl);
          if (node.type !== 'chest') {
            // Always show the 3-star goal, even before the level is attempted (0/3 filled).
            const starsWrap = document.createElement('div'); starsWrap.className = 'node-stars';
            starsWrap.style.left = offsets[i % offsets.length]; starsWrap.style.transform = 'translateX(-50%)';
            starsWrap.innerHTML = [1, 2, 3].map(s => `<span class="node-star ${s <= stars ? 'filled' : ''}">★</span>`).join('');
            row.appendChild(starsWrap);
          }
          c.appendChild(row); gi++;
        });

        // Boss node at end of each chapter (except first if no nodes done)
        const bossId = `boss_ch${chIdx}`;
        const allDone = ch.nodes.every(n => P.nodeProgress[n.id]);
        const bossDefeated = P.bossDefeated && P.bossDefeated[bossId];
        const bossAvail = allDone && !bossDefeated;
        if (ch.nodes.length > 0) {
          const bossRow = document.createElement('div'); bossRow.className = 'node-row';
          const bn = document.createElement('div');
          bn.className = `road-node boss ${bossDefeated ? 'done' : ''}  ${(!allDone && !bossDefeated) ? 'locked' : ''}`;
          bn.style.left = 'calc(50%)'; bn.style.transform = 'translateX(-50%)';
          bn.textContent = bossDefeated ? '💀' : '👾';
          if (bossAvail || bossDefeated) bn.onclick = () => openBossModal(bossId, chIdx, ch);
          const bossLbl = document.createElement('div'); bossLbl.className = 'node-label';
          bossLbl.style.left = 'calc(50%)'; bossLbl.style.transform = 'translateX(-50%)';
          bossLbl.textContent = bossDefeated ? 'Boss vaincu !' : '⚔️ Boss Final';
          bossRow.appendChild(bn); bossRow.appendChild(bossLbl); c.appendChild(bossRow);
        }
      });

      // Header: reflect the active chapter's identity + overall progress
      updateRoadHeader(activeTheme, roadData, newlyCurrentNodeId, totalNodes, doneNodes);

      // Connective path drawn beneath the nodes
      requestAnimationFrame(() => drawRoadPath(c));
      // Re-draw once more shortly after: catches any late layout shift from the
      // chapter-card entrance animation, emoji/webfont metrics, or scrollbar changes.
      setTimeout(() => drawRoadPath(c), 350);
      if (!_roadResizeBound) {
        _roadResizeBound = true;
        let resizeT;
        window.addEventListener('resize', () => {
          clearTimeout(resizeT);
          resizeT = setTimeout(() => { const cc = document.getElementById('nodesContainer'); if (cc) drawRoadPath(cc); }, 120);
        });
      }

      // Chapter-unlock celebration (only the very first time a chapter's first node opens up)
      if (newlyCurrentIsFirstOfChapter > 0 && _roadRenderedOnce && _prevCurrentNodeId !== newlyCurrentNodeId
        && !(P.seenChapterIntro && P.seenChapterIntro[newlyCurrentIsFirstOfChapter])) {
        const ch = roadData[newlyCurrentIsFirstOfChapter];
        if (!P.seenChapterIntro) P.seenChapterIntro = {};
        P.seenChapterIntro[newlyCurrentIsFirstOfChapter] = true;
        save();
        setTimeout(() => showChapterUnlock(ch, activeTheme), 350);
      }

      _prevCurrentNodeId = newlyCurrentNodeId;
      _roadRenderedOnce = true;
    }

    function updateRoadHeader(theme, roadData, currentNodeId, totalNodes, doneNodes) {
      const header = document.getElementById('roadHeader');
      const t = theme || CHAPTER_THEMES.mixed;
      if (header) { header.style.setProperty('--rh-c1', t.c1); header.style.setProperty('--rh-c2', t.c2); }
      const ico = document.getElementById('roadTitleIco'); if (ico) ico.textContent = t.ico;
      const txt = document.getElementById('roadTitleTxt');
      if (txt) {
        let chName = '';
        (roadData || []).forEach(ch => { if (ch.nodes.some(n => n.id === currentNodeId)) chName = ch.name; });
        txt.textContent = chName || (roadData && roadData.length ? roadData[roadData.length - 1].name : 'Parcours Principal');
      }
      const fill = document.getElementById('roadProgressFill');
      const label = document.getElementById('roadProgressLabel');
      const pct = totalNodes > 0 ? Math.round((doneNodes / totalNodes) * 100) : 0;
      if (fill) fill.style.width = pct + '%';
      if (label) label.textContent = `${doneNodes} / ${totalNodes} étapes complétées`;
    }

    function drawRoadPath(container) {
      const old = container.querySelector('svg.road-path'); if (old) old.remove();
      const nodes = Array.from(container.querySelectorAll('.road-node'));
      if (nodes.length < 2) return;
      const cRect = container.getBoundingClientRect();
      const pts = nodes.map(n => {
        const r = n.getBoundingClientRect();
        return { x: r.left + r.width / 2 - cRect.left, y: r.top + r.height / 2 - cRect.top, done: n.classList.contains('done') };
      });
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'road-path');
      svg.setAttribute('width', container.clientWidth);
      svg.setAttribute('height', container.scrollHeight);
      svg.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:1';

      const pathD = (arr) => arr.map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = arr[i - 1]; const midY = (prev.y + p.y) / 2;
        return `C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
      }).join(' ');

      const defs = document.createElementNS(svgNS, 'defs');
      defs.innerHTML = `<linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--road-c1, var(--green))"/><stop offset="100%" stop-color="var(--road-c2, var(--purple))"/></linearGradient>`;
      svg.appendChild(defs);

      const base = document.createElementNS(svgNS, 'path');
      base.setAttribute('d', pathD(pts)); base.setAttribute('fill', 'none');
      base.setAttribute('stroke', 'var(--road-base, #e5e7eb)'); base.setAttribute('stroke-width', '10'); base.setAttribute('stroke-linecap', 'round');
      svg.appendChild(base);

      let lastDoneIdx = -1; pts.forEach((p, i) => { if (p.done) lastDoneIdx = i; });
      if (lastDoneIdx >= 0) {
        const prog = document.createElementNS(svgNS, 'path');
        prog.setAttribute('d', pathD(pts.slice(0, lastDoneIdx + 1))); prog.setAttribute('fill', 'none');
        prog.setAttribute('stroke', 'url(#roadGrad)'); prog.setAttribute('stroke-width', '10'); prog.setAttribute('stroke-linecap', 'round');
        prog.setAttribute('class', 'road-path-progress');
        svg.appendChild(prog);
      }
      container.insertBefore(svg, container.firstChild);
    }

    function showChapterUnlock(ch, theme) {
      if (!ch) return;
      const t = theme || getChapterTheme(ch);
      const overlay = document.getElementById('chapterUnlockOverlay');
      if (!overlay) return;
      overlay.style.setProperty('--cu-c1', t.c1); overlay.style.setProperty('--cu-c2', t.c2);
      document.getElementById('cuIco').textContent = t.ico;
      document.getElementById('cuTitle').textContent = ch.name;
      document.getElementById('cuSub').textContent = `Un nouveau monde de questions ${t.label.toLowerCase()} t'attend !`;
      overlay.classList.add('show');
      audio.playChapterUnlock();
      spawnConfetti();
      setTimeout(() => { if (overlay.classList.contains('show')) closeChapterUnlock(); }, 3000);
    }
    function closeChapterUnlock() {
      const overlay = document.getElementById('chapterUnlockOverlay');
      if (overlay) overlay.classList.remove('show');
    }

    function getPrevNodeId(gi) {
      let i = 0;
      const roadData = window.ROAD || window.KQ_ROADMAP || [];
      for (let ch of roadData) for (let n of ch.nodes) { if (i === gi - 1) return n.id; i++; }
      return null;
    }

    let _nmRenderDiff = null; // re-render du sélecteur de difficulté de la popup ouverte
    // Variante de nœud de route : déterministe par id — environ 15% Vrai/Faux,
    // 15% Méli-Mélo, 15% Mini Tour du Monde, 55% quiz classique.
    // Répartition équilibrée des éditions spéciales : chaque chapitre de 5
    // nœuds reçoit exactement 3 classiques + 2 éditions spéciales DISTINCTES,
    // positions et types tirés au hasard (seedé par le chapitre : stable
    // d'une session à l'autre, équilibré à chaque nouvelle partie).
    let ROAD_VARIANTS = null;

    function hashStr(s) {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
      return Math.abs(h);
    }

    function mulberry32(seed) {
      return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function ensureRoadVariants() {
      const road = window.ROAD;
      if (!Array.isArray(road) || road.length === 0) return;
      if (ROAD_VARIANTS) return;
      ROAD_VARIANTS = {};
      const types = ['tf', 'scramble', 'tour'].filter(t =>
        t === 'tour' ? (window.GEO_QB || []).length >= 5 :
        t === 'tf' ? (window.TF_QB || []).length >= 5 :
        (window.SCRAMBLE_QB || []).length >= 5);
      if (types.length === 0) return;
      road.forEach((ch, ci) => {
        const rng = mulberry32(hashStr(ch.name || 'ch' + ci) + ci * 7919);
        const nodes = ch.nodes.filter(n => n.type !== 'chest');
        if (nodes.length < 3) return;
        // 2 positions distinctes au hasard parmi les nœuds du chapitre
        const positions = nodes.map((_, i) => i);
        for (let i = positions.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        // 2 types distincts au hasard
        const pool = [...types];
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        positions.slice(0, 2).forEach((nodeIdx, k) => {
          ROAD_VARIANTS[nodes[nodeIdx].id] = pool[k % pool.length];
        });
      });
    }

    function roadNodeVariant(node) {
      ensureRoadVariants();
      return (ROAD_VARIANTS && ROAD_VARIANTS[node.id]) || 'classic';
    }

    function openLessonPopup(node, ch) {
      window._tutNode = node;
      const variant = roadNodeVariant(node);
      const variantMeta = {
        tf:       { ico: '✅', sub: `${Math.min(node.qCount, 5)} affirmations — vrai ou faux ?` },
        scramble: { ico: '🧩', sub: `${Math.min(node.qCount, 5)} expressions à remettre en ordre` },
        tour:     { ico: '🌍', sub: `${Math.min(node.qCount, 5)} pays à conquérir sur le globe` },
        classic:  { ico: node.ico, sub: `${node.qCount} questions` },
      }[variant];
      document.getElementById('nmIco').textContent = variantMeta.ico;
      document.getElementById('nmTitle').textContent = node.label;
      document.getElementById('nmSub').textContent = variantMeta.sub;
      if (!P.difficultyOverride) P.difficultyOverride = {};
      const diffEl = document.getElementById('nmDiff');
      if (variant === 'classic') {
        const renderDiff = () => {
          const diff = P.difficultyOverride[node.bank] || 'easy';
          diffEl.innerHTML = `<span style="display:block;margin-bottom:6px;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.5px">Difficulté des questions</span>` +
            ['easy', 'medium', 'hard'].map(d => {
              const lbl = d === 'hard' ? '🔴 Difficile' : d === 'medium' ? '🟠 Intermédiaire' : '🟢 Facile';
              const on = d === diff;
              return `<button class="nm-diff-btn" ${on ? 'data-on="1"' : ''} onclick="setNodeDifficulty('${node.bank}','${d}')">${lbl}</button>`;
            }).join(' ');
        };
        _nmRenderDiff = renderDiff;
        renderDiff();
      } else {
        diffEl.innerHTML = `<span style="font-size:11px;color:var(--gold);font-weight:900">✨ ÉDITION SPÉCIALE</span>`;
        _nmRenderDiff = null;
      }
      document.getElementById('nodeModal').classList.add('open');
      document.getElementById('nmBtn').textContent = variant === 'classic' ? "Commencer" : "Commencer l’édition spéciale ✨";
      document.getElementById('nmBtn').onclick = () => {
        document.getElementById('nodeModal').classList.remove('open');
        if (variant === 'tf') startQuizFlow(Math.min(node.qCount, 8), node.id, 'tf');
        else if (variant === 'scramble') startQuizFlow(Math.min(node.qCount, 5), node.id, 'scramble');
        else if (variant === 'tour') startRoadTour(node);
        else startQuizFlow(node.qCount, node.id, 'qcm', node.bank);
      };
    }
    function setNodeDifficulty(bank, diff) {
      if (!P.difficultyOverride) P.difficultyOverride = {};
      P.difficultyOverride[bank] = diff;
      save(); buildRoad();
      if (_nmRenderDiff) _nmRenderDiff();
    }

    function openChest(node) {
      if (P.nodeProgress[node.id]) return;
      Tutorial.notify('chest_opened');
      const nodeEl = document.querySelector(`.road-node[data-node-id="${node.id}"]`);
      if (nodeEl) nodeEl.classList.add('chest-shake');
      const rarity = rollRarity();
      const rewards = buildChestRewards(rarity);
      audio.playDrumroll();
      setTimeout(() => {
        if (nodeEl) nodeEl.classList.remove('chest-shake');
        showChestSequence(rewards, rarity, () => {
          P.nodeProgress[node.id] = true;
          if (nodeEl) { nodeEl.textContent = '✅'; nodeEl.classList.add('chest-burst'); }
          save(); updateUI();
          setTimeout(() => buildRoad(), 400);
        });
      }, 750);
    }

    // ===== ATLAS =====
    // ===== CATALOGUE ATLAS =====
    // L'atlas était vide : window.ATLAS_CARDS était initialisé à des tableaux
    // vides et rien ne le remplissait. On construit désormais les fiches à partir
    // des banques de questions : chaque atlasId référencé devient une fiche
    // (icône, nom, description, lien Wikipédia, faits tirés des explications).
    const ATLAS_META = {
      geo_monde:    { ico: '🌍', name: 'Le Monde', lat: 20, lng: 0, desc: 'Vue d\'ensemble de la planète — continents, océans et grands ensembles.' },
      geo_europe:   { ico: '🏰', name: 'L\'Europe', lat: 50, lng: 15 },
      geo_asie:     { ico: '🏯', name: 'L\'Asie', lat: 34, lng: 100 },
      geo_afrique:  { ico: '🦁', name: 'L\'Afrique', lat: 2, lng: 20 },
      geo_amerique: { ico: '🗽', name: 'L\'Amérique', lat: 10, lng: -70 },
      geo_oceanie:  { ico: '🏝️', name: 'L\'Océanie', lat: -25, lng: 140 },
      geo_antarctique: { ico: '🐧', name: 'L\'Antarctique', lat: -80, lng: 0 },
      hist_fr:      { ico: '🇫🇷', name: 'Histoire de France', lat: 47, lng: 2 },
      sci_univers:  { ico: '🌌', name: 'L\'Univers' },
      spt_sport:    { ico: '🏅', name: 'Grands Moments du Sport' },
      chateaux_france: { ico: '🏰', name: 'Châteaux de France', lat: 47.3, lng: 0.5 },
      ext_philo:    { ico: '🤔', name: 'Philosophie', lat: 37.98, lng: 23.73 },
      cin_oscar:    { ico: '🏆', name: 'Les Oscars', lat: 34.1, lng: -118.34 },
      litt_hugo:    { ico: '✍️', name: 'Victor Hugo', lat: 48.85, lng: 2.35 },
      mytho_zeus:   { ico: '⚡', name: 'Zeus', lat: 37.64, lng: 21.63 },
      art_joconde:  { ico: '🖼️', name: 'La Joconde', lat: 48.86, lng: 2.34 },
    };
    const ATLAS_PREFIX_ICO = [
      ['geo', '🗺️'], ['hist', '🏛️'], ['sci', '🧪'], ['art', '🎨'], ['cin', '🎬'],
      ['cinema', '🎬'], ['spt', '⚽'], ['sport', '⚽'], ['gst', '🍽️'], ['gastro', '🍽️'],
      ['mytho', '⚡'], ['chateaux', '🏰'], ['litt', '📖'], ['lit', '📖'], ['ext', '🌟'],
      ['musique', '🎵'], ['theatre', '🎭'], ['photographie', '📷'], ['france', '🇫🇷'],
    ];
    function atlasIcoFor(id, cat) {
      const lower = id.toLowerCase();
      for (const [p, ico] of ATLAS_PREFIX_ICO) if (lower.startsWith(p + '_')) return ico;
      return '📜';
    }
    function humanizeAtlasName(id) {
      return id.split('_').slice(id.includes('_') ? 1 : 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || id;
    }
    function ensureAtlasCatalog() {
      if (window._atlasBuilt) return;
      window._atlasBuilt = true;
      const banks = {
        geo: window.GEO_QB, hist: window.HIST_QB, sci: window.SCI_QB, art: window.ART_QB,
        cinema: window.CINEMA_QB, sport: window.SPORT_QB, gastro: window.GASTRO_QB,
        mytho: window.MYTHO_QB, chateaux: window.CHATEAUX_QB, litt: window.LITT_QB,
        extended: window.EXTENDED_QB, mixed: window.MIXED_QB,
      };
      const acc = {};  // atlasId -> { cat, wiki, facts[], count }
      Object.entries(banks).forEach(([cat, qs]) => {
        (qs || []).forEach(q => {
          const aid = q.atlasId;
          // Écarte les ids cassés (numériques, absents) venus des vieilles bases
          if (!aid || typeof aid !== 'string' || /^\d+$/.test(aid.trim())) return;
          const qcat = q.cat || cat;   // q.cat prime (litt est injectée dans MIXED_QB)
          if (!acc[aid]) acc[aid] = { cat: qcat, wiki: '', facts: [], count: 0 };
          acc[aid].count++;
          if (!acc[aid].wiki && q.wikipedia && /^http/.test(q.wikipedia)) acc[aid].wiki = q.wikipedia;
          if (acc[aid].facts.length < 2 && q.explanation && q.explanation.length >= 40) {
            acc[aid].facts.push(q.explanation.length > 130 ? q.explanation.slice(0, 127) + '…' : q.explanation);
          }
        });
      });
      const bySection = {};
      Object.entries(acc).forEach(([id, info]) => {
        const meta = ATLAS_META[id] || {};
        const card = {
          id, cat: info.cat,
          ico: meta.ico || atlasIcoFor(id, info.cat),
          name: meta.name || humanizeAtlasName(id),
          desc: meta.desc || `Fiche ${info.cat} — débloquée en répondant juste sur ce thème.`,
          facts: meta.facts || info.facts,
          wiki: meta.wiki || info.wiki,
          lat: meta.lat, lng: meta.lng,
        };
        (bySection[info.cat] = bySection[info.cat] || []).push(card);
      });
      window.ATLAS_CARDS = bySection;
      // Le compteur du bouton profil inclut désormais les fiches réellement existantes
      const total = Object.values(bySection).flat().length;
      const hdr = document.getElementById('atlasHeaderCount');
      if (hdr) hdr.textContent = `${P.atlas.length} / ${total}`;
    }
    // Style « rainbow » : récompense visuelle quand une catégorie est quasi
    // parfaitement réussie (≥ 80 % de réussite sur ≥ 50 questions).
    function isCatPerfected(cat) {
      const s = P.catStats && P.catStats[cat];
      return !!(s && s.total >= 50 && (s.correct / s.total) >= 0.8);
    }

    function openAtlas() {
      ensureAtlasCatalog();
      renderAtlas('');
      document.getElementById('atlasSearch').value = '';
      document.getElementById('scrAtlas').classList.add('active');
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
    }

    function filterAtlas(query) { renderAtlas(query.toLowerCase()); }

    function renderAtlas(query) {
      ensureAtlasCatalog();
      const body = document.getElementById('atlasBody');
      body.innerHTML = '';
      const allCards = [...Object.values(window.ATLAS_CARDS).flat()];
      const totalCards = allCards.length;
      const hdrCount = document.getElementById('atlasHeaderCount');
      hdrCount.textContent = `${P.atlas.length} / ${totalCards}`;
      // Précision globale quasi parfaite → le compteur passe en arc-en-ciel
      if (P.totalQ >= 100 && (P.totalCorrect / P.totalQ) >= 0.85) hdrCount.classList.add('rainbow-text');
      else hdrCount.classList.remove('rainbow-text');
      const sections = { geo: '🗺️ Géographie', hist: '🏛️ Histoire', sci: '🧪 Sciences', art: '🎨 Arts', cinema: '🎬 Cinéma', sport: '⚽ Sport', gastro: '🍽️ Gastronomie', mytho: '⚡ Mythologie', chateaux: '🏰 Châteaux', litt: '📖 Littérature', extended: '🌟 Extra', mixed: '🧠 Culture Générale', divers: '🎲 Autres trésors' };
      Object.entries(window.ATLAS_CARDS).forEach(([cat, cards]) => {
        const filtered = cards.filter(card => {
          if (!query) return true;
          return card.name.toLowerCase().includes(query) || card.desc.toLowerCase().includes(query);
        });
        if (filtered.length === 0) return;
        const perfect = isCatPerfected(cat);
        const title = document.createElement('div');
        title.className = 'atlas-section-title' + (perfect ? ' rainbow-text' : '');
        title.textContent = (sections[cat] || cat) + (perfect ? ' ✨' : '');
        body.appendChild(title);
        const grid = document.createElement('div'); grid.className = 'atlas-grid';
        filtered.forEach(card => {
          const unlocked = P.atlas.includes(card.id);
          const el = document.createElement('div'); el.className = `atlas-card ${unlocked ? 'unlocked' : 'locked'}`;
          if (unlocked) {
            if (perfect) el.classList.add('rainbow');
            const isNew = P.atlas.indexOf(card.id) >= P.atlas.length - 5; // last 5 added
            el.innerHTML = `<span class="atlas-ico">${escapeHtml(card.ico)}</span><div class="atlas-name">${escapeHtml(card.name)}</div><div class="atlas-star">⭐</div>`;
            if (isNew) {
              const badge = document.createElement('div'); badge.className = 'atlas-new-badge'; badge.textContent = 'NEW';
              el.appendChild(badge);
            }
            el.onclick = () => openAtlasDetail(card);
          } else {
            el.innerHTML = `<span class="atlas-ico mystery">❓</span><div class="atlas-name mystery">???</div>`;
          }
          grid.appendChild(el);
        });
        body.appendChild(grid);
      });
    }

    function openAtlasDetail(card) {
      const factsHTML = card.facts ? card.facts.map(f => `<div class="atlas-fact"><span class="atlas-fact-ico">📌</span><span>${escapeHtml(f)}</span></div>`).join('') : '';
      document.getElementById('atlasDetailContent').innerHTML = `
    <span class="atlas-detail-ico">${escapeHtml(card.ico)}</span>
    <div class="atlas-detail-title">${escapeHtml(card.name)}</div>
    <p style="font-size:14px;color:var(--muted);font-weight:700;margin:8px 0 16px;text-align:center">${escapeHtml(card.desc)}</p>
    <div class="atlas-detail" style="margin-bottom:16px">${factsHTML}</div>
    ${card.wiki ? `<a href="${escapeHtml(card.wiki)}" target="_blank" rel="noopener" style="display:block;text-align:center;color:var(--blue);font-size:13px;font-weight:800;padding:8px;background:var(--blue-bg);border-radius:10px;text-decoration:none">🌐 En savoir plus sur Wikipédia</a>` : ''}
  `;
      document.getElementById('atlasDetailModal').classList.add('open');
    }

    function closeAtlas() {
      document.getElementById('scrAtlas').classList.remove('active');
      document.getElementById('topbar').style.display = 'flex';
      document.getElementById('bnav').style.display = 'flex';
    }

    // ===== DISCOVERY =====
    function triggerDiscovery(cardId) {
      ensureAtlasCatalog();
      const allCards = Object.values(window.ATLAS_CARDS).flat();
      const card = allCards.find(c => c.id === cardId);
      if (!card) return;
      document.getElementById('discIco').textContent = card.ico;
      document.getElementById('discName').textContent = card.name;
      document.getElementById('discDesc').textContent = card.desc;
      document.getElementById('discoveryOverlay').classList.add('show');
      audio.playTreasure();
      spawnConfetti();
      Companion.react('discovery', { rarity: ficheRarity(cardId) });
      triggerAtlasUnlockAnimation(cardId);
      // 🌍 Mode Atlas animé : zoom + ring sur le globe si la carte a des coords
      if (card.lat !== undefined && card.lng !== undefined && GLOBE) {
        setTimeout(() => {
          GLOBE.pointOfView({ lat: card.lat, lng: card.lng, altitude: 1.4 }, 1200);
          GLOBE.ringsData([{ lat: card.lat, lng: card.lng, color: 'rgba(255,215,0,0.8)' }]);
          setTimeout(() => GLOBE.ringsData([]), 3000);
        }, 400);
      }
    }

    function closeDiscovery() {
      document.getElementById('discoveryOverlay').classList.remove('show');
      document.getElementById('confettiWrap').innerHTML = '';
    }

    function spawnConfetti(count = 40) {
      const wrap = document.getElementById('confettiWrap');
      wrap.innerHTML = '';
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#7c5cfc'];
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div'); p.className = 'confetti-piece';
        p.style.cssText = `left:${Math.random() * 100}%;background:${colors[Math.floor(Math.random() * colors.length)]};width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};animation-duration:${1.5 + Math.random() * 1.5}s;animation-delay:${Math.random() * 0.5}s;`;
        wrap.appendChild(p);
      }
    }

    // ===== TIMER =====
    function startTimer(seconds, onExpire) {
      stopTimer();
      _timerSec = seconds;
      const fill = document.getElementById('timerFill');
      const txt = document.getElementById('timerText');

      const targetWrap = document.getElementById('timerWrap');
      if (targetWrap) targetWrap.style.display = 'block';

      if (fill) {
        fill.style.width = '100%';
        fill.className = 'timer-fill';
      }
      if (txt) txt.textContent = seconds + 's';

      _timerInterval = setInterval(() => {
        _timerSec--;
        const pct = (_timerSec / seconds) * 100;

        const activeFill = document.getElementById('timerFill');
        const activeTxt = document.getElementById('timerText');

        if (activeFill) {
          activeFill.style.width = pct + '%';
          if (_timerSec <= 5) activeFill.className = 'timer-fill danger';
          else if (_timerSec <= Math.floor(seconds / 3)) activeFill.className = 'timer-fill warn';
        }
        if (activeTxt) activeTxt.textContent = _timerSec + 's';

        if (_timerSec <= 3) audio.playTimer();
        if (_timerSec <= 0) { stopTimer(); onExpire(); }
      }, 1000);
    }

    // ===== ENGINE JS =====
    function stopTimer() {
      if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
      const wrap = document.getElementById('timerWrap');
      if (wrap) wrap.style.display = 'none';
    }

    // ===== QUIZ ENGINE =====
    async function startMode(mode) {
      Tutorial.notify('mode_started');
      if (mode === 'tf') {
        if (!window.TF_QB || window.TF_QB.length === 0) {
          // Banque chargée en arrière-plan : on attend au lieu d'échouer
          showToast('⏳ Chargement des questions Vrai/Faux…');
          await ensureBankLoaded('tf');
        }
        if (!window.TF_QB || window.TF_QB.length === 0) {
          showToast('❌ Vrai/Faux indisponible (tf_questions.json manquant dans data/)'); return;
        }
        startQuizFlow(Math.min(8, window.TF_QB.length), mode, 'tf');
      }
      else if (mode === 'scramble') {
        if (!window.SCRAMBLE_QB || window.SCRAMBLE_QB.length === 0) {
          showToast('⏳ Chargement du Méli-Mélo…');
          await ensureBankLoaded('scramble');
        }
        if (!window.SCRAMBLE_QB || window.SCRAMBLE_QB.length === 0) {
          showToast('❌ Méli-Mélo indisponible (scramble_questions.json manquant dans data/)'); return;
        }
        startQuizFlow(Math.min(3, window.SCRAMBLE_QB.length), mode, 'scramble');
      }
      else if (mode === 'infinite') startQuizFlow(999, mode, 'qcm', 'mixed');
      else if (mode === 'chrono') startChronoMode();
      else if (mode === 'survie') startSurvieMode();
      else if (mode === 'duel') startDuelMode();
      else if (mode === 'flash') startFlashMode();
      else if (mode === 'chaine') startChaineMode();
      else if (mode.startsWith('cat_')) {
        const cat = mode.replace('cat_', '');
        const bank = cat === 'seasonal' ? 'seasonal' : cat;
        let pool = bank === 'seasonal' ? getSeasonalQB() : getPool(bank);
        if (!pool || pool.length === 0) { showToast('⏳ Aucune question disponible pour cette catégorie.'); return; }
        startQuizFlow(Math.min(10, pool.length), 'cat_' + cat, 'qcm', bank);
      }
    }

    function startRevision() {
      if (P.mistakes.length === 0) { showToast('Aucune erreur à réviser !'); return; }
      startQuizFlow(Math.min(10, P.mistakes.length), 'Revision', 'mistakes');
    }

    // Chrono mode
    function startChronoMode() {
      const pool = shuffle(filterSeenQuestions(getPool('mixed'))).slice(0, 10);
      Q = { mode: 'chrono', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, duelAiDiff: 0.7, chain: null, chainIdx: 0, chainBroken: false };
      launchQuizScreen();
    }

    // Survie mode
    function startSurvieMode() {
      const pool = shuffle(getPool('mixed'));
      Q = { mode: 'survie', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, chain: null, chainIdx: 0, chainBroken: false };
      Q.survieForgiven = false;
      launchQuizScreen();
    }

    // Duel mode
    function startDuelMode() {
      const pool = shuffle(filterSeenQuestions(getPool('mixed'))).slice(0, 10);;
      Q = { mode: 'duel', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, duelAiDiff: 0.7, chain: null, chainIdx: 0, chainBroken: false };
      launchQuizScreen();
    }

    // Flash mode
    function startFlashMode() {
      // FLASH_QB n'est pas encore alimentée par le pipeline : sans fallback
      // sur la banque mixte, le mode démarre avec un pool vide et est injouable.
      const src = (window.FLASH_QB && window.FLASH_QB.length > 0) ? window.FLASH_QB : getPool('mixed');
      const pool = shuffle(src).slice(0, 8);
      Q = { mode: 'flash', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, chain: null, chainIdx: 0, chainBroken: false };
      launchQuizScreen();
    }

    // Chaine mode
    function startChaineMode() {
      const allPool = [...window.GEO_QB, ...window.HIST_QB, ...window.SCI_QB, ...window.ART_QB, ...window.CINEMA_QB, ...window.SPORT_QB, ...window.GASTRO_QB, ...window.MYTHO_QB, ...window.MIXED_QB, ...window.EXTENDED_QB, ...window.CHATEAUX_QB, ...window.LITT_QB];
      let chain = window.CHAINS && window.CHAINS.length ? shuffle(window.CHAINS)[0] : null;
      let qs;
      if (chain) {
        qs = chain.ids.map(id => allPool.find(q => q.id === id)).filter(Boolean);
      }
      if (!chain || qs.length < 5) {
        // Pas de chaîne thématique définie : on génère une chaîne aléatoire
        chain = { title: 'Chaîne du savoir', ids: [] };
        qs = shuffle(allPool).slice(0, 10);
      }
      Q = { mode: 'chaine', type: 'qcm', qs: shuffle(filterSeenQuestions(qs)), idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, duelAiDiff: 0.7, chain: chain, chainIdx: 0, chainBroken: false };
      launchQuizScreen();
    }

    function startQuizFlow(count, modeId, type, bankKey) {
      if (P.hearts <= 0 && !['infinite', 'Revision', 'Mastery', 'chrono', 'survie', 'duel', 'flash', 'chaine', 'daily', 'scramble'].includes(modeId) && !modeId.startsWith('cat_')) {
        document.getElementById('scrNoHearts').style.display = 'flex'; updateUI(); return;
      }
      startSession(bankKey === 'seasonal' ? 'seasonal' : 'normal'); // ← Patch Collecte v2
      let pool = [];
      if (type === 'mistakes') pool = shuffle([...P.mistakes]).map(shuffleAnswerOrder);
      else if (type === 'tf') pool = shuffle(window.TF_QB);
      else if (type === 'scramble') pool = shuffle(window.SCRAMBLE_QB);
      else if (bankKey === 'seasonal') pool = shuffle(getSeasonalQB());
      else pool = shuffle(getDifficultyPool(bankKey));
      Q = { mode: modeId, type: type, qs: pool.slice(0, count), idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, duelAiDiff: 0.7, chain: null, chainIdx: 0, chainBroken: false };
      launchQuizScreen();
    }

    function launchQuizScreen() {
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
      document.getElementById('scrQuiz').classList.add('active');
      applyOwlHat();
      // Le compagnon flottant laisse place au hibou du quiz pendant la partie
      const cf = document.getElementById('companionFloat');
      if (cf) cf.classList.remove('show');
      document.getElementById('survieHeader').style.display = Q.mode === 'survie' ? 'flex' : 'none';
      if (Q.mode === 'duel' || Q.mode === 'boss') {
        document.getElementById('duelBar').style.display = 'flex';
      } else {
        document.getElementById('duelBar').style.display = 'none';
      }
      renderMascot('mascotQuiz', 'idle');
      updateCompanionVisibility();
      renderQ();
    }

    function renderQ() {
      if (Q.qs.length === 0) { showResult(); return; }
      renderQuizHearts();
      if (Q.mode === 'infinite' && Q.idx >= Q.qs.length) {
        const more = shuffle(getPool('mixed')).slice(0, 20);
        Q.qs.push(...more);
      }
      if (Q.mode !== 'survie' && Q.mode !== 'infinite' && Q.idx >= Q.qs.length) { showResult(); return; }
      if (Q.mode === 'survie' && Q.idx >= Q.qs.length) {
        const more = shuffle(getPool('mixed'));
        Q.qs.push(...more);
      }

      Q.state = 'selecting'; Q.selectedIdx = null; Q.userSel = [];
      const q = Q.qs[Q.idx];
      if (!q) { showResult(); return; }

      document.getElementById('quizFill').style.width = Q.mode === 'survie' ? '100%' : `${(Q.idx / Q.qs.length) * 100}%`;
      document.getElementById('qCurr').textContent = Q.mode === 'survie' ? Q.survieScore + 1 : Q.idx + 1;
      document.getElementById('qTot').textContent = Q.mode === 'survie' ? '∞' : Q.qs.length;
      document.getElementById('qCat').textContent = ((q.cat || 'quiz').toUpperCase());
      document.getElementById('qText').textContent = q.question;

      const imgEl = document.getElementById('qImage');
      if (q.imageEmoji) {
        imgEl.style.display = 'none';
        const card = document.getElementById('qCard');
        let emojiDiv = card.querySelector('.q-emoji-display');
        if (!emojiDiv) { emojiDiv = document.createElement('div'); emojiDiv.className = 'q-emoji-display'; emojiDiv.style.cssText = 'font-size:80px;text-align:center;padding:10px 0;'; card.insertBefore(emojiDiv, card.firstChild); }
        emojiDiv.textContent = q.imageEmoji;
      } else {
        imgEl.style.display = 'none';
        const old = document.getElementById('qCard').querySelector('.q-emoji-display');
        if (old) old.remove();
      }

      const db = document.getElementById('difficultyBadge');
      if (q.difficulty) {
        db.style.display = 'inline-block';
        db.className = `diff-badge ${q.difficulty}`;
        db.textContent = q.difficulty === 'easy' ? 'Facile' : q.difficulty === 'medium' ? 'Moyen' : 'Difficile';
      } else db.style.display = 'none';

      const combo = document.getElementById('qCombo');
      if (Q.combo >= 2) {
        combo.style.display = 'inline-block'; combo.textContent = `🔥 x${Q.combo}`;
        combo.classList.remove('combo-pop'); void combo.offsetWidth; combo.classList.add('combo-pop');
        // La flamme grossit avec la série
        combo.classList.toggle('fire', Q.combo >= 4 && Q.combo < 7);
        combo.classList.toggle('blaze', Q.combo >= 7);
      } else { combo.style.display = 'none'; }

      const wl = document.getElementById('wikiLink');
      if (q.wikipedia) { wl.href = q.wikipedia; wl.style.display = 'block'; } else { wl.style.display = 'none'; }

      if (Q.mode === 'survie') {
        const sh = document.getElementById('survieHeader');
        sh.innerHTML = '';
        for (let i = 0; i < 3; i++) sh.innerHTML += i < (3 - Q.survieErrors) ? '❤️' : '🖤';
      }

      if (Q.mode === 'duel') {
        document.getElementById('duelPlayerName').textContent = P.name;
        document.getElementById('duelAiName').textContent = '🤖 Bot';
        document.getElementById('duelPlayerHP').style.width = (Q.duelPlayerHP / 5 * 100) + '%';
        document.getElementById('duelAiHP').style.width = (Q.duelAiHP / 5 * 100) + '%';
        document.getElementById('duelPlayerHPVal').textContent = Q.duelPlayerHP + ' ❤️';
        document.getElementById('duelAiHPVal').textContent = Q.duelAiHP + ' 🤖';
      }
      if (Q.mode === 'boss') {
        document.getElementById('duelPlayerName').textContent = P.name;
        document.getElementById('duelAiName').textContent = `${Q.bossIco || '👾'} ${Q.bossName || 'Boss'}`.slice(0, 24);
        updateBossHUD();
        if (Q.legend) {
          // Phases du boss légendaire : annonce au changement de difficulté
          if (Q.idx === 5) showToast('🔥 PHASE 2 — le boss enrage : questions moyennes !');
          if (Q.idx === 10) showToast('💀 PHASE 3 — forme finale : questions difficiles !');
        }
      }

      const interact = document.getElementById('qAnswers'); interact.innerHTML = '';
      const bc = document.getElementById('btnCheck'); bc.className = 'btn-action'; bc.textContent = 'Vérifier'; bc.disabled = true; bc.style.display = '';
      document.getElementById('vBanner').classList.remove('show');
      setBannerOpen(false);

      stopTimer();
      let timerSecs = 0;
      if (Q.mode === 'chrono') timerSecs = q.difficulty === 'hard' ? 10 : q.difficulty === 'medium' ? 12 : 15;
      if (Q.mode === 'flash') timerSecs = 5;
      if (Q.mode === 'daily') timerSecs = q.difficulty === 'hard' ? 10 : q.difficulty === 'medium' ? 12 : 15;
      if (Q.mode === 'boss' && Q.bossTimerSec) timerSecs = Q.bossTimerSec;
      if (timerSecs > 0) startTimer(timerSecs, () => timeExpired());

      document.getElementById('puFiftyFifty').disabled = P.powerups.fiftyfifty <= 0;
      document.getElementById('puShield').disabled = P.powerups.shield <= 0;
      document.getElementById('puDoubleXP').disabled = P.powerups.doubleXP <= 0;

      if (q.choices) {
        q.choices.forEach((c, i) => {
          const btn = document.createElement('div'); btn.className = 'ans-btn';
          btn.innerHTML = `<div class="ans-letter">${String.fromCharCode(65 + i)}</div><div>${c}</div>`;
          btn.onclick = () => selectAnswer(i, btn);
          interact.appendChild(btn);
        });
      } else if (q.r !== undefined) {
        const wrap = document.createElement('div'); wrap.className = 'tf-row';
        [false, true].forEach(val => { const btn = document.createElement('div'); btn.className = 'tf-btn'; btn.textContent = val ? '✅ VRAI' : '❌ FAUX'; btn.onclick = () => selectAnswer(val, btn); wrap.appendChild(btn); });
        interact.appendChild(wrap);
      } else if (q.pool) {
        const zone = document.createElement('div'); zone.className = 'scram-zone'; zone.id = 'scZone';
        const pool = document.createElement('div'); pool.className = 'scram-pool';
        shuffle(q.pool).forEach(w => {
          const t = document.createElement('div'); t.className = 'scram-token'; t.textContent = w;
          t.onclick = () => { if (Q.state !== 'selecting' || t.classList.contains('used')) return; t.classList.add('used'); const c2 = document.createElement('div'); c2.className = 'scram-token placed'; c2.textContent = w; c2.onclick = () => { if (Q.state === 'selecting') { c2.remove(); t.classList.remove('used'); checkScram(); } }; zone.appendChild(c2); checkScram(); };
          pool.appendChild(t);
        });
        interact.appendChild(zone); interact.appendChild(pool);
      }
    }

    function timeExpired() {
      if (Q.state !== 'selecting') return;
      Q.state = 'checked';
      audio.playWrong();
      Q.combo = 0;
      // Un temps écoulé est une erreur : même traitement émotionnel et pédagogique
      setMascotState('mascotQuiz', 'sad', 1100, 'idle');
      Companion.react('wrong');
      srsOnResult(Q.qs[Q.idx], false);
      if (Q.mode !== 'flash' && Q.mode !== 'boss') {
        deductHeart();
      }
      if (Q.mode === 'survie') {
        if (hasTalent('t_survie_coeur') && !Q.survieForgiven) { Q.survieForgiven = true; showToast('💀 Cœur de survivant : erreur pardonnée !'); }
        else { Q.survieErrors++; if (Q.survieErrors >= 3) { showResult(); return; } }
      }
      if (Q.mode === 'duel') { Q.duelAiHP = Math.max(0, Q.duelAiHP - 0); Q.duelPlayerHP = Math.max(0, Q.duelPlayerHP - 1); if (Q.duelPlayerHP <= 0) { showResult(); return; } }
      if (Q.mode === 'boss') {
        // Temps écoulé = une erreur de combat (l'Archimage punit les lents)
        Q.duelPlayerHP = Math.max(0, Q.duelPlayerHP - 1);
        if (Q.bossPower === 'feed') Q.duelAiHP = Math.min(Q.bossMaxHP, Q.duelAiHP + 1);
        updateBossHUD();
        if (Q.duelPlayerHP <= 0) { setTimeout(() => showResult(), 400); return; }
      }

      const q = Q.qs[Q.idx];
      if (q.choices) { const btns = document.querySelectorAll('.ans-btn'); if (btns[q.correctAnswer]) btns[q.correctAnswer].classList.add('correct'); }

      document.getElementById('btnCheck').style.display = 'none';
      const vb = document.getElementById('vBanner'); vb.className = 'vbanner show w';
      setBannerOpen(true);
      document.getElementById('vStatus').textContent = '⏰ Temps écoulé !'; document.getElementById('vStatus').className = 'v-status w';
      document.getElementById('vFact').textContent = q.explanation || '';
      document.getElementById('xpBonus').textContent = '';
      save();
    }

    function selectAnswer(val, btn) {
      if (Q.state !== 'selecting') return;
      if (btn.classList.contains('eliminated')) return;
      Q.selectedIdx = val;
      document.querySelectorAll('.ans-btn,.tf-btn').forEach(b => b.classList.remove('selected', 'sel'));
      btn.classList.add(btn.classList.contains('tf-btn') ? 'sel' : 'selected');
      const bc = document.getElementById('btnCheck'); bc.classList.add('active-check'); bc.disabled = false;
    }

    // Spécification de validation des Méli-Mélo
    function checkScram() {
      Q.userSel = [];
      document.querySelectorAll('#scZone .scram-token.placed').forEach(t => Q.userSel.push(t.textContent));
      const b = document.getElementById('btnCheck');
      if (Q.userSel.length > 0) { b.classList.add('active-check'); b.disabled = false; } else { b.classList.remove('active-check'); b.disabled = true; }
    }

    function handleAction() { if (Q.state === 'selecting') checkAnswer(); }

    function checkAnswer() {
      stopTimer();
      Q.state = 'checked';
      const q = Q.qs[Q.idx]; let isCorrect = false;

      if (q.choices) {
        isCorrect = (Q.selectedIdx === q.correctAnswer);
        const btns = document.querySelectorAll('.ans-btn');
        if (btns[Q.selectedIdx]) btns[Q.selectedIdx].classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect && btns[q.correctAnswer]) btns[q.correctAnswer].classList.add('correct');
      } else if (q.r !== undefined) {
        isCorrect = (Q.selectedIdx === q.r);
        document.querySelectorAll('.tf-btn').forEach(b => { const bv = b.textContent.includes('VRAI'); if (bv === Q.selectedIdx) b.classList.add(isCorrect ? 'correct' : 'wrong'); if (bv === q.r && !isCorrect) b.classList.add('correct'); });
      } else if (q.correct) {
        isCorrect = JSON.stringify(Q.userSel) === JSON.stringify(q.correct);
        const z = document.getElementById('scZone'); if (z) z.style.borderColor = isCorrect ? 'var(--green)' : 'var(--red)';
      }
      if (q && q.id) {
        if (!P.recentlySeen) P.recentlySeen = [];
        if (!P.recentlySeen.includes(q.id)) {
          P.recentlySeen.push(q.id);
          if (P.recentlySeen.length > 80) P.recentlySeen.shift();
        }
      }
      if (isCorrect) {
        audio.playCorrect();
        setMascotState('mascotQuiz', 'happy', 1100, 'idle');
        if (window.navigator.vibrate) window.navigator.vibrate(22);
        Companion.react('correct', { combo: Q.combo + 1, difficulty: q.difficulty });
        srsOnResult(q, true);
        Q.combo++; Q.correct++;
        if (Q.combo === 5) updateMissionProgress('combo5', 1);
        const comboMult = getComboMultiplier(Q.combo);
        const comboBonus = Q.combo >= 5 ? 10 : (Q.combo >= 3 ? 5 : 0);
        let chronoBonus = 0;
        let speedBonus = 0;
        const origSec = q.difficulty === 'hard' ? 10 : q.difficulty === 'medium' ? 12 : 15;
        if ((Q.mode === 'chrono' || Q.mode === 'daily') && _timerSec !== undefined) {
          chronoBonus = Math.floor((_timerSec / origSec) * 10);
          if (chronoBonus > 0 && Q.mode === 'chrono') P.chronoBest = Math.max(P.chronoBest, Q.correct);
        }
        // Speed bonus: answered quickly (timer still >25% remaining)
        if (_timerSec !== undefined && (_timerSec / origSec) > 0.25) {
          speedBonus = calcSpeedBonus(_timerSec, origSec);
        }
        let baseXP = (q.xp || 10) + comboBonus + chronoBonus + speedBonus;
        // Apply combo multiplier
        let xpGain = Math.round(baseXP * comboMult);
        // Daily challenge: double XP
        if (Q.mode === 'daily') xpGain = Math.round(xpGain * 2);
        if (P.doubleXPActive) xpGain *= 2;
        const day = new Date().getDay();
        if ((day === 0 || day === 6) && q.cat === 'hist') xpGain *= 2;
        if (q.isEvent) xpGain *= 2;   // les questions d'événement saisonnier rapportent double
        // Talents Érudit : +15% XP par spécialité
        if (hasTalent('t_savant_geo') && q.cat === 'geo') xpGain = Math.round(xpGain * 1.15);
        if (hasTalent('t_savant_hist') && q.cat === 'hist') xpGain = Math.round(xpGain * 1.15);
        if (hasTalent('t_savant_sci') && q.cat === 'sci') xpGain = Math.round(xpGain * 1.15);
        if (hasTalent('t_savant_mixed') && q.cat === 'mixed') xpGain = Math.round(xpGain * 1.15);
        Q.totalXP += xpGain;
        if (!Q.gemsEarned) Q.gemsEarned = 0;
        Q.survieScore++;
        recordCatStat(q.cat, true);

        const atlasId = q.atlasId;
        if (atlasId && !P.atlas.includes(atlasId)) {
          P.atlas.push(atlasId); Q.newAtlasCards++;
          setTimeout(() => triggerDiscovery(atlasId), 600);
        }
        P.totalCorrect++;
        const today = new Date().toISOString().split('T')[0];
        if (P.lastQuestDate !== today && P.totalCorrect % 15 === 0) { P.gems += 10; P.lastQuestDate = today; showToast('🎯 Quête quotidienne ! +10 💎'); }
        // Mission tracking
        updateMissionProgress('correct', 1);
        if (q.cat) updateMissionProgress('cat_' + q.cat, 1);

        if (Q.mode === 'duel') {
          Q.duelAiHP = Math.max(0, Q.duelAiHP - 1);
          document.getElementById('duelThinking').style.display = 'block';
          setTimeout(() => {
            document.getElementById('duelThinking').style.display = 'none';
            if (Math.random() < Q.duelAiDiff) {
              Q.duelPlayerHP = Math.max(0, Q.duelPlayerHP - 0.5);
              showToast('🤖 Le bot contre-attaque !');
            }
            if (Q.duelAiHP <= 0) { setTimeout(() => { document.getElementById('vBanner').querySelectorAll('button')[0].click(); }, 300); }
          }, 1200);
        }
        if (Q.mode === 'boss') {
          // Chaque bonne réponse inflige 1 dégât au boss
          Q.duelAiHP = Math.max(0, Q.duelAiHP - 1);
          if (Q.bossPower === 'regen' && (Q.idx + 1) % 3 === 0 && Q.duelAiHP > 0) {
            Q.duelAiHP = Math.min(Q.bossMaxHP, Q.duelAiHP + 1);
            showToast(`👾 ${Q.bossName || 'Le boss'} régénère 1 HP !`);
          }
          updateBossHUD();
          if (Q.duelAiHP <= 0) { setTimeout(() => showResult(), 700); }
        }
        let bonusTxt = '';
        if (speedBonus > 0) bonusTxt += `⚡+${speedBonus} vitesse `;
        if (comboMult > 1.0) bonusTxt += `🔥×${comboMult} `;
        else if (comboBonus > 0) bonusTxt += `+${comboBonus} combo `;
        if (chronoBonus > 0) bonusTxt += `⏱+${chronoBonus} `;
        if (P.doubleXPActive) bonusTxt += '⚡2× ';
        if (Q.mode === 'daily') bonusTxt += '🌍×2 ';
        document.getElementById('xpBonus').textContent = bonusTxt ? bonusTxt : '';
        // Float XP
        const checkBtn = document.getElementById('btnCheck');
        showXPFloat(xpGain, checkBtn);
      } else {
        audio.playWrong();
        setMascotState('mascotQuiz', 'sad', 1100, 'idle');
        if (window.navigator.vibrate) window.navigator.vibrate(200);
        Companion.react('wrong');
        srsOnResult(q, false);
        const prevCombo = Q.combo;
        Q.combo = 0; Q.chainBroken = Q.mode === 'chaine';
        // Talent Combo protégé : la première erreur de la session ne casse pas le combo
        if (hasTalent('t_combo_shield') && !Q._comboShieldUsed && prevCombo > 0) {
          Q._comboShieldUsed = true;
          Q.combo = prevCombo;
          showToast('🛡️ Combo protégé !');
        }
        recordCatStat(q.cat, false);

        // On appelle UNIQUEMENT deductHeart() qui gère les vies, le bouclier et les animations
        // (boss : les erreurs coûtent des HP de combat, pas des cœurs réels)
        if (!['infinite', 'Revision', 'scramble', 'boss'].includes(Q.mode)) {

          deductHeart();
        }

        if (Q.mode === 'survie') {
          if (hasTalent('t_survie_coeur') && !Q.survieForgiven) { Q.survieForgiven = true; showToast('💀 Cœur de survivant : erreur pardonnée !'); }
          else { Q.survieErrors++; if (Q.survieErrors >= 3) { audio.playGameOver(); setTimeout(() => showResult(), 400); return; } }
        }
        if (Q.mode === 'duel') { Q.duelPlayerHP = Math.max(0, Q.duelPlayerHP - 1); if (Q.duelPlayerHP <= 0) { audio.playGameOver(); setTimeout(() => showResult(), 400); return; } }
        if (Q.mode === 'boss') {
          // Une erreur coûte 1 vie de combat ; le Seigneur des Erreurs en profite
          Q.duelPlayerHP = Math.max(0, Q.duelPlayerHP - 1);
          if (Q.bossPower === 'feed') Q.duelAiHP = Math.min(Q.bossMaxHP, Q.duelAiHP + 1);
          updateBossHUD();
          if (Q.duelPlayerHP <= 0) { audio.playGameOver(); setTimeout(() => showResult(), 400); return; }
        }
        if (!P.mistakes.find(m => m.question === q.question)) P.mistakes.push(q);
        Q.retryQueue.push(q);
        const card = document.getElementById('qCard'); card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 400);
      }
      const donneesAEnvoyer = {
        idJoueur: P.idUnique || P.name,
        idQuestion: q.id || "gen_" + Q.idx,
        texteQuestion: q.question,          // Doit s'appeler "texteQuestion"
        categorie: q.cat || "général",       // Doit s'appeler "categorie"
        reponseDonnee: q.choices ? q.choices[Q.selectedIdx] : String(Q.selectedIdx),
        reponseCorrecte: q.choices ? q.choices[q.correctAnswer] : String(q.r),
        estCorrect: isCorrect,               // Doit s'appeler "estCorrect"
        tempsMisMs: (15 - _timerSec) * 1000  // Doit s'appeler "tempsMisMs"
      };

      enregistrerReponse(donneesAEnvoyer);

      if (P.doubleXPActive) { P.doubleXPActive = false; document.getElementById('doubleXPBadge').style.display = 'none'; }

      if (Q.mode === 'chaine' && Q.chainBroken) {
        setTimeout(() => { showToast('⛓️ Chaîne brisée ! Recommence depuis le début.'); showResult(); }, 800);
        return;
      }

      if (Q.mode === 'duel' && Q.duelAiHP <= 0) {
        setTimeout(() => showResult(), 400);
        return;
      }


      document.getElementById('btnCheck').style.display = 'none';
      const vb = document.getElementById('vBanner'); vb.className = 'vbanner show ' + (isCorrect ? 'c' : 'w');
      setBannerOpen(true);
      const vs = document.getElementById('vStatus'); vs.textContent = isCorrect ? '✔️ Correct !' : '❌ Incorrect'; vs.className = 'v-status ' + (isCorrect ? 'c' : 'w');
      document.getElementById('vFact').textContent = q.explanation || '';
      save();
    }

    function nextQuestion() {
      document.getElementById('btnCheck').style.display = '';
      Q.idx++;
      renderQ();
    }

    function exitQuiz() {
      stopTimer();
      document.getElementById('scrQuiz').classList.remove('active');
      document.getElementById('topbar').style.display = 'flex';
      document.getElementById('bnav').style.display = 'flex';
      startApp();
    }

    function revealResultStars(stars, isNewBest) {
      const row = document.getElementById('resStarsRow');
      if (!row) return;
      row.classList.add('show');
      [1, 2, 3].forEach((s, idx) => {
        const el = document.getElementById('resStar' + s);
        if (!el) return;
        const filled = s <= stars;
        el.className = 'res-star' + (filled ? ' filled' : '');
        if (filled) {
          el.classList.add('anim');
          el.style.animationDelay = (idx * 0.15) + 's';
          setTimeout(() => audio.playStarPop(), idx * 150);
        }
      });
      if (stars === 3) {
        setTimeout(() => {
          [1, 2, 3].forEach(s => { const el = document.getElementById('resStar' + s); if (el) el.classList.add('glow'); });
          spawnConfetti();
          if (isNewBest && navigator.vibrate) navigator.vibrate([30, 40, 30]);
        }, 500);
      }
    }

    function showResult() {
      stopTimer();
      document.getElementById('scrQuiz').classList.remove('active');
      document.getElementById('scrResult').style.display = 'flex';
      const resStarsRowEl = document.getElementById('resStarsRow');
      if (resStarsRowEl) {
        resStarsRowEl.classList.remove('show');
        [1, 2, 3].forEach(s => { const el = document.getElementById('resStar' + s); if (el) el.className = 'res-star'; });
      }
      document.getElementById('resXP').textContent = Q.totalXP;
      const totalAnswered = Math.min(Q.idx + 1, Q.qs.length);
      const acc = Q.qs.length > 0 ? Math.round((Q.correct / totalAnswered) * 100) : 0;
      document.getElementById('resAcc').textContent = acc + '%';
      document.getElementById('resAtlas').textContent = Q.newAtlasCards;
      claimWeeklyBonusIfApplicable(acc);
      renderMascot('mascotResult', acc >= 80 ? 'celebrate' : 'happy');
      Companion.react('session_end', { acc });

      // === BONUS CALCULATIONS ===
      let bonusGems = 0;
      const bonusChips = [];
      // Mission: session
      updateMissionProgress('sessions', 1);
      // Mission: streak
      if (P.streakDays >= 3) updateMissionProgress('streak', 1);
      // Mission: combo8
      if (Q.combo >= 8) updateMissionProgress('combo8', 1);

      // 1. Accuracy Bonus (>90% → gems)
      const accBonus = calcAccuracyBonus(Q.correct, totalAnswered);
      if (accBonus > 0) {
        bonusGems += accBonus;
        bonusChips.push({ label: `🎯 Précision +${accBonus}💎`, color: 'var(--blue)', bg: 'var(--blue-bg)' });
      }

      // 2. Perfect Run (0 errors)
      const isPerfect = Q.correct === totalAnswered && totalAnswered >= 5;
      if (isPerfect) {
        bonusGems += 20;
        updateMissionProgress('perfect', 1);
        // Trophées Perfect Run : paliers bronze → argent → or → arc-en-ciel
        P.perfectCount = (P.perfectCount || 0) + 1;
        const pc = P.perfectCount;
        if (pc === 1) addHonor('perfect_1', { ico: '✨', name: 'Premier Perfect', cls: 'perfect-bronze' });
        if (pc === 5) addHonor('perfect_5', { ico: '🌟', name: '5 Perfect Runs', cls: 'perfect-silver' });
        if (pc === 15) addHonor('perfect_15', { ico: '🏅', name: '15 Perfect Runs', cls: 'perfect-gold' });
        if (pc === 30) addHonor('perfect_30', { ico: '🌈', name: '30 Perfect Runs', cls: 'perfect-rainbow' });
        // Chance to get a rare atlas card
        const allCards = Object.values(window.ATLAS_CARDS || {}).flat();
        const locked = allCards.filter(c => !P.atlas.includes(c.id));
        if (locked.length > 0) {
          const rare = locked[Math.floor(Math.random() * locked.length)];
          P.atlas.push(rare.id); Q.newAtlasCards++;
          document.getElementById('resAtlas').textContent = Q.newAtlasCards;
          bonusChips.push({ label: `✨ Perfect! +20💎 + Fiche Rare!`, color: 'var(--gold-d)', bg: 'var(--orange-bg)' });
        } else {
          bonusChips.push({ label: `✨ Perfect Run! +20💎`, color: 'var(--gold-d)', bg: 'var(--orange-bg)' });
        }
      }

      // 3. Streak Bonus (daily gems multiplier)
      const today = new Date().toISOString().split('T')[0];
      if (P.streakDays >= 2) {
        const streakMult = getStreakGemMultiplier();
        const baseGems = 5; // base gems per session
        const streakGems = Math.round(baseGems * (streakMult - 1));
        if (streakGems > 0) {
          bonusGems += streakGems;
          bonusChips.push({ label: `🔥 Série ×${streakMult.toFixed(1)} +${streakGems}💎`, color: 'var(--orange-d)', bg: 'var(--orange-bg)' });
        }
      }

      // 4. Daily Challenge completion bonus
      if (Q.mode === 'daily') {
        P.dailyChallengeDate = today;
        P.dailyChallengeDone = true;
        P.dailyChallengeScore = Math.max(P.dailyChallengeScore || 0, acc);
        bonusGems += 50;
        bonusChips.push({ label: `🌍 Défi du Jour +50💎`, color: 'var(--purple-d)', bg: 'var(--purple-bg)' });
        updateMissionProgress('daily', 1);
        // Update streak days
        if (P.lastPlayDate !== today) {
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().split('T')[0];
          if (P.lastPlayDate === yStr) { P.streakDays = (P.streakDays || 0) + 1; }
          else if (consumeStreakFreezeIfApplicable(today)) { P.streakDays = (P.streakDays || 0) + 1; }
          else { P.streakDays = 1; }
          recordStreakHistory(today);
          checkStreakMilestones();
        }
      }

      // Apply gems
      if (bonusGems > 0 && hasTalent('t_gems_session')) bonusGems = Math.round(bonusGems * 1.25);
      if (bonusGems > 0) P.gems += bonusGems;
      Q.gemsEarned = (Q.gemsEarned || 0) + bonusGems;
      document.getElementById('resGems').textContent = Q.gemsEarned || 0;

      // Render bonus chips
      const bonusRow = document.getElementById('resBonusRow');
      if (bonusChips.length > 0) {
        bonusRow.innerHTML = bonusChips.map(c =>
          `<div class="res-bonus-chip" style="color:${c.color};border-color:${c.color};background:${c.bg}">${c.label}</div>`
        ).join('');
        bonusRow.style.display = 'flex';
        // Show popup for big bonuses (perfect run or daily)
        if (isPerfect) {
          setTimeout(() => showBonusPopup('✨', 'Perfect Run !', 'Aucune erreur — Tu es imbattable !',
            bonusChips.map(c => c.label)), 600);
        } else if (Q.mode === 'daily') {
          setTimeout(() => showBonusPopup('🌍', 'Défi Quotidien !', `Précision : ${acc}% — Classement mondial !`,
            bonusChips.map(c => c.label)), 600);
        }
      } else {
        bonusRow.innerHTML = ''; bonusRow.style.display = 'none';
      }

      const survWrap = document.getElementById('resSurvieWrap');
      if (Q.mode === 'survie') {
        survWrap.style.display = 'flex';
        document.getElementById('resSurvieScore').textContent = Q.survieScore;
        if (Q.survieScore > P.survieRecord) { P.survieRecord = Q.survieScore; showToast(`🏆 Nouveau record Survie : ${Q.survieScore}`); }
      } else survWrap.style.display = 'none';

      const btnRes = document.getElementById('btnResContinue');
      const resTitle = document.getElementById('resTitle');

      if (Q.mode === 'duel') {
        const won = Q.duelAiHP <= 0;
        resTitle.textContent = won ? 'Victoire ! 🤖' : 'Défaite...';
        resTitle.style.color = won ? 'var(--green)' : 'var(--red)';
        btnRes.textContent = 'Retour'; btnRes.onclick = () => finishQuiz();
      } else if (Q.mode === 'boss') {
        // Victoire = barre de HP du boss vidée (ou assez de dégâts à la fin des 10 questions)
        const won = Q.duelAiHP <= 0;
        resTitle.textContent = won ? '⚔️ Boss Vaincu !' : '💀 Défaite face au Boss...';
        resTitle.style.color = won ? 'var(--purple)' : 'var(--red)';
        btnRes.textContent = 'Continuer'; btnRes.onclick = () => { handleBossResult(won); finishQuiz(); };
        if (won) { updateMissionProgress('boss', 1); updateMissionProgress('perfect', isPerfect ? 1 : 0); }
      } else if (Q.mode === 'daily') {
        resTitle.textContent = `Défi du Jour — ${acc}% ! 🌍`;
        resTitle.style.color = 'var(--purple)';
        btnRes.textContent = 'Continuer'; btnRes.onclick = () => finishQuiz();
      } else if (Q.mode === 'survie') {
        resTitle.textContent = `Score Survie : ${Q.survieScore}`;
        resTitle.style.color = 'var(--purple)';
        btnRes.textContent = 'Rejouer'; btnRes.onclick = () => { document.getElementById('scrResult').style.display = 'none'; startMode('survie'); };
      } else if (Q.mode === 'chaine') {
        resTitle.textContent = Q.chainBroken ? '⛓️ Chaîne brisée !' : `⛓️ Chaîne complète ! +${Q.totalXP} XP`;
        resTitle.style.color = Q.chainBroken ? 'var(--red)' : 'var(--gold)';
        btnRes.textContent = 'Continuer'; btnRes.onclick = () => finishQuiz();
      } else if (Q.retryQueue.length > 0 && !['infinite', 'Revision', 'Mastery', 'duel', 'survie', 'chaine', 'flash'].includes(Q.mode)) {
        resTitle.textContent = 'Des erreurs à revoir !'; resTitle.style.color = 'var(--red)';
        btnRes.textContent = 'Réviser les erreurs';
        btnRes.onclick = () => { document.getElementById('scrResult').style.display = 'none'; const retry = [...Q.retryQueue]; Q.retryQueue = []; startQuizFlow(retry.length, 'Mastery', 'mistakes'); };
      } else {
        resTitle.textContent = 'Leçon terminée !'; resTitle.style.color = 'var(--orange)'; btnRes.textContent = 'Continuer'; btnRes.onclick = () => finishQuiz();
      }

      const h = { mode: Q.mode, correct: Q.correct, total: totalAnswered, xp: Q.totalXP, acc: acc, date: new Date().toLocaleDateString('fr-FR') };
      if (!P.history) P.history = [];
      P.history.push(h);
      if (P.history.length > 20) P.history.shift();

      // totalQ est désormais compté question par question dans recordCatStat
      addXP(Q.totalXP); checkAchievements();
      if (acc >= 60 && !['infinite', 'tf', 'scramble', 'Revision', 'Mastery', 'duel', 'survie', 'chaine', 'flash', 'daily', 'weeklyBonus'].includes(Q.mode) && !Q.mode.startsWith('cat_')) {
        P.nodeProgress[Q.mode] = true;
        // Star rating: purely a visual/motivational layer on top of existing completion logic.
        const starsEarned = acc >= 100 ? 3 : acc >= 80 ? 2 : 1;
        if (!P.nodeStars) P.nodeStars = {};
        const prevStars = P.nodeStars[Q.mode] || 0;
        P.nodeStars[Q.mode] = Math.max(prevStars, starsEarned);
        revealResultStars(starsEarned, starsEarned > prevStars);
        // Trophée doré : toutes les leçons du chapitre à 3 étoiles + boss vaincu
        const roadH = window.ROAD || window.KQ_ROADMAP || [];
        const chIdxH = roadH.findIndex(ch => ch.nodes.some(n => n.id === Q.mode));
        if (chIdxH >= 0) {
          const chH = roadH[chIdxH];
          const allThree = chH.nodes.every(n => (P.nodeStars[n.id] || 0) >= 3);
          if (allThree && P.bossDefeated && P.bossDefeated['boss_ch' + chIdxH]) {
            addHonor('gold_ch' + chIdxH, { ico: '👑', name: `3★ ${chH.name}`.slice(0, 22), cls: 'chapter-gold' });
          }
        }
      }
      // Streak quotidien : toute session compte désormais, y compris les
      // parties lancées par catégorie (avant : les cat_ n'actualisaient rien).
      if (P.lastPlayDate !== today) {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        if (P.lastPlayDate === yStr) { P.streakDays = (P.streakDays || 0) + 1; }
        else if (consumeStreakFreezeIfApplicable(today)) { P.streakDays = (P.streakDays || 0) + 1; }
        else if (P.lastPlayDate !== today) { P.streakDays = 1; }
        P.streak++; P.lastPlayDate = today;
        recordStreakHistory(today);
        checkStreakMilestones();
      }
      renderObjectivesUI();   // rafraîchit les objectifs après la session
      updateMissionsSummary();
      save();
    }

    function finishQuiz() { document.getElementById('scrResult').style.display = 'none'; startApp(); }
    function goHomeFromHearts() { document.getElementById('scrNoHearts').style.display = 'none'; startApp(); }
    function resetData() { if (confirm('Tout effacer ?')) { localStorage.clear(); location.reload(); } }

    // ===== SAUVEGARDE : EXPORT / IMPORT =====
    // Toute la progression vit dans localStorage : un export JSON permet de la
    // sauvegarder ou de la transférer sur un autre appareil.
    function exportSave() {
      try {
        const blob = new Blob([JSON.stringify(P, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        const d = new Date().toISOString().split('T')[0];
        a.href = URL.createObjectURL(blob);
        a.download = `knowquest_sauvegarde_${d}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        showToast('💾 Sauvegarde exportée !');
      } catch (e) { showToast('❌ Export impossible : ' + e.message); }
    }
    function importSave(input) {
      const file = input.files && input.files[0];
      input.value = '';
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || typeof data !== 'object' || !('xp' in data) || !('name' in data)) {
            showToast('❌ Fichier de sauvegarde invalide'); return;
          }
          if (!confirm(`Importer la sauvegarde de « ${data.name} » (niveau ${data.level || '?'}) ?\nLa progression actuelle sera remplacée.`)) return;
          P = Object.assign(P, data);
          save(); updateUI(); buildRoad();
          showToast('📂 Sauvegarde importée !');
        } catch (e) { showToast('❌ Fichier illisible'); }
      };
      reader.readAsText(file);
    }

    function speakCurrentQuestion() {
      const btn = document.getElementById('btnTts'); btn.classList.add('playing'); window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(document.getElementById('qText').textContent); u.lang = 'fr-FR';
      u.onend = () => btn.classList.remove('playing'); window.speechSynthesis.speak(u);
    }

    // ===== DAILY CHALLENGE =====
    function getDailyChallengeSeed() {
      // Same seed for everyone on the same calendar day
      const d = new Date();
      return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    }

    function seededRandom(seed) {
      let s = seed;
      return function () {
        s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
        return (s >>> 0) / 4294967296;
      };
    }

    function getDailyChallengePool() {
      const seed = getDailyChallengeSeed();
      const rng = seededRandom(seed);
      const allQ = [
        ...(window.GEO_QB || []), ...(window.HIST_QB || []), ...(window.SCI_QB || []),
        ...(window.ART_QB || []), ...(window.CINEMA_QB || []), ...(window.SPORT_QB || []),
        ...(window.GASTRO_QB || []), ...(window.MYTHO_QB || []), ...(window.MIXED_QB || []),
        ...(window.EXTENDED_QB || [])
      ];
      if (allQ.length === 0) return [];
      // Seeded shuffle
      const pool = [...allQ];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, 10);
    }

    function updateDailyChallengeUI() {
      const today = new Date().toISOString().split('T')[0];
      const done = P.dailyChallengeDate === today && P.dailyChallengeDone;
      const card = document.getElementById('dailyChallengeCard');
      const doneBadge = document.getElementById('dcDoneBadge');
      const streakBonus = document.getElementById('dcStreakBonus');
      if (!card) return;
      if (done) {
        card.classList.add('done');
        if (doneBadge) { doneBadge.style.display = 'block'; }
      } else {
        card.classList.remove('done');
        if (doneBadge) { doneBadge.style.display = 'none'; }
      }
      // Show streak bonus if playing multiple days
      if (P.streakDays >= 2 && streakBonus) {
        streakBonus.style.display = 'inline';
        streakBonus.textContent = `🔥 Série ×${(1 + (P.streakDays - 1) * 0.1).toFixed(1)}`;
      }
    }

    function startDailyChallenge() {
      const today = new Date().toISOString().split('T')[0];
      if (P.dailyChallengeDate === today && P.dailyChallengeDone) {
        showToast('✅ Défi déjà complété aujourd\'hui !'); return;
      }
      startSession('daily_challenge'); // ← Patch Collecte v2
      const pool = getDailyChallengePool();
      if (pool.length === 0) { showToast('⏳ Questions non chargées !'); return; }
      Q = {
        mode: 'daily', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0,
        state: 'selecting', selectedIdx: null, combo: 0, userSel: [],
        retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0,
        duelPlayerHP: 5, duelAiHP: 5, duelAiDiff: 0.7, chain: null, chainIdx: 0, chainBroken: false,
        bonusXP: 0, gemsEarned: 0
      };
      launchQuizScreen();
    }

    // ===== BONUS SYSTEMS =====

    // Speed Bonus: extra XP if answered before 25% of timer remains
    function calcSpeedBonus(timerSec, totalSec) {
      if (timerSec === undefined || timerSec === null) return 0;
      const pct = timerSec / totalSec;
      if (pct > 0.75) return 15;       // answered in first 25%
      if (pct > 0.50) return 10;       // answered in first 50%
      if (pct > 0.25) return 5;        // answered in first 75%
      return 0;
    }

    // Combo Multiplier: x1.2 at 3, x1.5 at 5, x2.0 at 8
    function getComboMultiplier(combo) {
      if (combo >= 8) return 2.0;
      if (combo >= 5) return 1.5;
      if (combo >= 3) return 1.2;
      return 1.0;
    }

    // Show floating XP text
    function showXPFloat(xp, el) {
      const div = document.createElement('div');
      div.className = 'xp-float';
      div.textContent = '+' + xp + ' XP';
      const rect = el ? el.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
      div.style.left = (rect.left + rect.width / 2 - 30) + 'px';
      div.style.top = (rect.top - 10) + 'px';
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 1200);
    }

    // Accuracy Bonus: >90% correct → gems bonus at end
    function calcAccuracyBonus(correct, total) {
      if (total === 0) return 0;
      const acc = correct / total;
      if (acc >= 1.0) return 30;    // perfect
      if (acc >= 0.9) return 20;
      return 0;
    }

    // Streak Bonus: consecutive days multiplier for gems
    function getStreakGemMultiplier() {
      if (P.streakDays <= 1) return 1.0;
      return 1 + (P.streakDays - 1) * 0.10;
    }

    // ===== STREAK CALENDAR / FREEZE / MILESTONES =====
    // Consumes one "gel de série" (streak freeze) if the player missed exactly one day,
    // preserving the streak instead of resetting it. Purely additive — never fires unless
    // the player actually owns a freeze and the gap is exactly one missed day.
    function consumeStreakFreezeIfApplicable(today) {
      if (!P.lastPlayDate || P.lastPlayDate === today) return false;
      const d = new Date(today); d.setDate(d.getDate() - 2);
      const twoDaysAgoStr = d.toISOString().split('T')[0];
      if (P.lastPlayDate === twoDaysAgoStr && P.powerups && P.powerups.streakFreeze > 0) {
        P.powerups.streakFreeze--;
        showToast('🧊 Gel de série utilisé — ta série est protégée !');
        return true;
      }
      return false;
    }

    function recordStreakHistory(today) {
      if (!P.streakHistory) P.streakHistory = [];
      if (!P.streakHistory.includes(today)) P.streakHistory.push(today);
      if (P.streakHistory.length > 60) P.streakHistory = P.streakHistory.slice(-60);
    }

    const STREAK_MILESTONES = [
      { days: 7, xp: 100, gems: 50, titleId: 'streak7', titleLabel: '🔥 Série de Feu' },
      { days: 30, xp: 300, gems: 150, titleId: 'streak30', titleLabel: '⚡ Série Légendaire' },
      { days: 100, xp: 1000, gems: 500, titleId: 'streak100', titleLabel: '👑 Centurion Assidu' },
    ];
    function checkStreakMilestones() {
      if (!P.streakMilestones) P.streakMilestones = {};
      if (!P.titles) P.titles = {};
      STREAK_MILESTONES.forEach(m => {
        if (P.streakDays >= m.days && !P.streakMilestones[m.days]) {
          P.streakMilestones[m.days] = true;
          P.titles[m.titleId] = true;
          addXP(m.xp); P.gems += m.gems;
          save();
          setTimeout(() => {
            spawnConfetti(60);
            if (navigator.vibrate) navigator.vibrate([30, 50, 30, 50, 60]);
            showBonusPopup('🔥', `Série de ${m.days} jours !`, `Tu as maintenu ta série ${m.days} jours d'affilée !`,
              [`⭐ +${m.xp} XP`, `💎 +${m.gems} Gemmes`, `🏅 Titre débloqué : ${m.titleLabel}`]);
            Companion.react('streak', { days: m.days });
          }, 600);
        }
      });
    }

    // ===== TROPHÉES (boss vaincus, Perfect Runs, chapitres 3 étoiles) =====
    function addHonor(id, badge) {
      if (!P.honors) P.honors = {};
      if (P.honors[id]) return;   // déjà obtenu
      P.honors[id] = badge;
      save();
      setTimeout(() => showToast(`🏆 Trophée débloqué : ${badge.name}`), 700);
      renderHonors();
    }
    function renderHonors() {
      const grid = document.getElementById('honorsGrid'); if (!grid) return;
      const honors = Object.values(P.honors || {});
      if (honors.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--muted);font-size:13px;padding:10px">Vaincs un boss ⚔️, réussis un Perfect Run ✨ ou termine un chapitre 3★ pour débloquer des trophées !</div>';
        return;
      }
      grid.innerHTML = honors.map(h =>
        `<div class="honor-badge ${h.cls || ''}"><span class="honor-ico">${h.ico}</span><span class="honor-name">${h.name}</span></div>`
      ).join('');
    }

    // ===== VITRINE DU PROFIL =====
    // Met en avant le meilleur du joueur : podium des 3 meilleures catégories,
    // trophées les plus rares et records personnels.
    const PODIUM_MEDALS = ['🥇', '🥈', '🥉'];
    const PODIUM_CLS = ['showcase-1', 'showcase-2', 'showcase-3'];
    const HONOR_PRESTIGE = {
      'perfect-rainbow': 6, 'chapter-gold': 5, 'perfect-gold': 4,
      'perfect-silver': 3, 'boss': 2, 'perfect-bronze': 1, '': 0,
    };

    function renderShowcase() {
      const podium = document.getElementById('showcasePodium');
      const elite = document.getElementById('showcaseElite');
      if (!podium || !elite) return;

      // ── Podium : top 3 des catégories (≥ 10 questions) par précision ──
      const ranked = Object.entries(P.catStats || {})
        .filter(([, s]) => s.total >= 10)
        .map(([cat, s]) => ({ cat, acc: s.correct / s.total, total: s.total }))
        .sort((a, b) => (b.acc - a.acc) || (b.total - a.total))
        .slice(0, 3);
      if (ranked.length === 0) {
        podium.innerHTML = '<div class="showcase-empty">🏅 Joue au moins 10 questions dans une catégorie pour décrocher ton premier podium !</div>';
      } else {
        podium.innerHTML = ranked.map((r, i) => {
          const label = CAT_LABELS[r.cat] || r.cat;
          const mp = getCatMasteryProgress(r.cat);
          const badge = MASTERY_BADGES[Math.min(mp.level - 1, MASTERY_BADGES.length - 1)];
          const rb = isCatPerfected(r.cat) ? ' rainbow-text' : '';
          return `<div class="podium-card ${PODIUM_CLS[i]}">
            <div class="podium-medal">${PODIUM_MEDALS[i]}</div>
            <div class="podium-cat${rb}">${label}</div>
            <div class="podium-acc">${Math.round(r.acc * 100)}%</div>
            <div class="podium-meta">${badge} maîtrise ${mp.level} · ${r.total} q.</div>
          </div>`;
        }).join('');
      }

      // ── Badges d'élite : les 4 trophées les plus prestigieux ──
      const honors = Object.entries(P.honors || {})
        .sort(([, a], [, b]) => (HONOR_PRESTIGE[b.cls] || 0) - (HONOR_PRESTIGE[a.cls] || 0));
      const top = honors.slice(0, 4).map(([, h]) => h);

      // ── Records en chips colorées ──
      const bosses = Object.keys(P.bossDefeated || {}).length;
      const golds = Object.keys(P.honors || {}).filter(k => k.startsWith('gold_ch')).length;
      const perfectCats = Object.keys(P.catStats || {}).filter(isCatPerfected).length;
      const certs = Object.keys(P.certificates || {}).length;
      const chips = [];
      if (certs > 0) chips.push({ ico: '📜', txt: `${certs} certificat${certs > 1 ? 's' : ''} de maîtrise`, cls: 'chapter-gold' });
      if (perfectCats > 0) chips.push({ ico: '🌈', txt: `${perfectCats} catégorie${perfectCats > 1 ? 's' : ''} parfaite${perfectCats > 1 ? 's' : ''}`, cls: 'perfect-rainbow' });
      if (golds > 0) chips.push({ ico: '👑', txt: `${golds} chapitre${golds > 1 ? 's' : ''} 3★`, cls: 'chapter-gold' });
      if ((P.perfectCount || 0) > 0) chips.push({ ico: '✨', txt: `${P.perfectCount} perfect run${P.perfectCount > 1 ? 's' : ''}`, cls: 'perfect-bronze' });
      if (bosses > 0) chips.push({ ico: '⚔️', txt: `${bosses} boss vaincu${bosses > 1 ? 's' : ''}`, cls: 'boss' });
      if ((P.bestStreakEver || P.streakDays || 0) >= 2) chips.push({ ico: '🔥', txt: `série ${P.bestStreakEver || P.streakDays} jours`, cls: '' });
      if ((P.chronoBest || 0) > 0) chips.push({ ico: '⏱️', txt: `record chrono : ${P.chronoBest}`, cls: '' });

      let html = '';
      if (top.length > 0) {
        html += `<div class="elite-badges">${top.map(h =>
          `<div class="honor-badge ${h.cls || ''}"><span class="honor-ico">${h.ico}</span><span class="honor-name">${h.name}</span></div>`
        ).join('')}</div>`;
      }
      if (chips.length > 0) {
        html += `<div class="elite-chips">${chips.map(c =>
          `<span class="elite-chip ${c.cls}">${c.ico} ${c.txt}</span>`
        ).join('')}</div>`;
      }
      if (!html) {
        html = '<div class="showcase-empty">Vaincs un boss ⚔️ ou réussis un Perfect Run ✨ pour briller ici !</div>';
      }
      elite.innerHTML = html;
    }

    // ===== PARTAGE DE LA VITRINE =====
    // Génère une image résumant la vitrine (podium, records) : partagée via
    // l'API native sur mobile, sinon téléchargée en PNG.
    function shareShowcase() {
      const c = document.createElement('canvas');
      c.width = 900; c.height = 1100;
      const x = c.getContext('2d');
      const grad = x.createLinearGradient(0, 0, 0, 1100);
      grad.addColorStop(0, '#1a0a2e'); grad.addColorStop(1, '#2d1050');
      x.fillStyle = grad; x.fillRect(0, 0, 900, 1100);
      x.strokeStyle = '#ffd23d'; x.lineWidth = 6; x.strokeRect(24, 24, 852, 1052);

      x.textAlign = 'center';
      x.fillStyle = '#ffd23d'; x.font = '900 54px system-ui, sans-serif';
      x.fillText('🏆 Ta Vitrine', 450, 130);
      x.fillStyle = '#ffffff'; x.font = '800 40px system-ui, sans-serif';
      x.fillText(P.name || 'Joueur', 450, 205);
      const acc = P.totalQ > 0 ? Math.round(P.totalCorrect / P.totalQ * 100) : 0;
      x.fillStyle = 'rgba(255,255,255,.7)'; x.font = '700 26px system-ui, sans-serif';
      x.fillText(`Niveau ${P.level || 1} · ${P.totalQ || 0} questions · ${acc}% de précision`, 450, 255);

      const ranked = Object.entries(P.catStats || {})
        .filter(([, s]) => s.total >= 10)
        .map(([cat, s]) => ({ cat, acc: Math.round(s.correct / s.total * 100), total: s.total }))
        .sort((a, b) => (b.acc - a.acc) || (b.total - a.total)).slice(0, 3);
      const medals = ['🥇', '🥈', '🥉'];
      const cols = ['#ffd23d', '#a8b0b8', '#cd7f32'];
      ranked.forEach((r, i) => {
        const y = 330 + i * 130;
        x.fillStyle = 'rgba(255,255,255,.08)';
        x.beginPath();
        if (x.roundRect) x.roundRect(90, y - 55, 720, 105, 20); else x.rect(90, y - 55, 720, 105);
        x.fill();
        x.strokeStyle = cols[i]; x.lineWidth = 3; x.stroke();
        x.fillStyle = '#ffffff'; x.textAlign = 'left'; x.font = '900 32px system-ui, sans-serif';
        x.fillText(medals[i] + '  ' + (CAT_LABELS[r.cat] || r.cat), 125, y + 5);
        x.fillStyle = cols[i]; x.font = '900 42px system-ui, sans-serif'; x.textAlign = 'right';
        x.fillText(r.acc + '%', 775, y + 8);
      });

      const bosses = Object.keys(P.bossDefeated || {}).length;
      const chips = [
        bosses > 0 ? `⚔️ ${bosses} boss vaincu${bosses > 1 ? 's' : ''}` : null,
        (P.perfectCount || 0) > 0 ? `✨ ${P.perfectCount} perfect run${P.perfectCount > 1 ? 's' : ''}` : null,
        (P.streakDays || 0) >= 2 ? `🔥 série de ${P.streakDays} jours` : null,
        `🌍 ${P.atlas.length} fiches atlas`,
      ].filter(Boolean);
      x.textAlign = 'center'; x.fillStyle = '#ffffff'; x.font = '800 30px system-ui, sans-serif';
      chips.forEach((t, i) => x.fillText(t, 450, 790 + i * 60));

      x.fillStyle = 'rgba(255,255,255,.5)'; x.font = '700 24px system-ui, sans-serif';
      x.fillText('KnowQuest — quiz culture générale', 450, 1040);

      c.toBlob(async (blob) => {
        if (!blob) { showToast('❌ Génération impossible'); return; }
        const file = new File([blob], 'knowquest_vitrine.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], title: 'Ma vitrine KnowQuest' }); return; } catch (e) { /* partage annulé */ }
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'knowquest_vitrine.png';
        a.click();
        URL.revokeObjectURL(a.href);
        showToast('📤 Image de ta vitrine téléchargée !');
      });
    }

    // ===== TALENTS (progression long terme) =====
    // 1 Point de Talent gagné par niveau à partir du niveau 5.
    // Les talents se débloquent en ordre dans leur branche.
    const TALENT_TREE = [
      { id: 'savant', name: 'Savant 🧠', color: 'var(--blue)', talents: [
        { id: 't_savant_geo',   ico: '🗺️', name: 'Érudit géographie', desc: '+15 % XP en géographie', cost: 1 },
        { id: 't_savant_hist',  ico: '🏛️', name: 'Érudit histoire',    desc: '+15 % XP en histoire', cost: 1 },
        { id: 't_savant_sci',   ico: '🔬', name: 'Érudit sciences',    desc: '+15 % XP en sciences', cost: 1 },
        { id: 't_savant_mixed', ico: '🧩', name: 'Esprit large',       desc: '+15 % XP en culture G', cost: 2 },
        { id: 't_polyglotte',   ico: '🌐', name: 'Polymathe',          desc: '+5 % XP sur tout', cost: 3 },
      ]},
      { id: 'stratege', name: 'Stratège ⚔️', color: 'var(--red)', talents: [
        { id: 't_survie_coeur', ico: '💀', name: 'Cœur de survivant', desc: '1 erreur pardonnée par partie de Survie', cost: 1 },
        { id: 't_boss_hp',      ico: '⚔️', name: 'Chasseur de boss',  desc: 'Les boss ont -1 HP', cost: 1 },
        { id: 't_pitstop',      ico: '🔧', name: 'Mécano éclair',     desc: 'Pitstops à 2 boulons seulement', cost: 2 },
        { id: 't_drs_plus',     ico: '⚡', name: 'Double DRS',        desc: 'DRS utilisable 2 fois par course', cost: 2 },
        { id: 't_heart_fast',   ico: '❤️', name: 'Cœur endurant',     desc: 'Régénération des cœurs 2× plus rapide', cost: 3 },
      ]},
      { id: 'chance', name: 'Chanceux 🍀', color: 'var(--green)', talents: [
        { id: 't_fifty3',       ico: '✂️', name: '50/50 amélioré',   desc: 'Élimine 3 mauvaises réponses', cost: 1 },
        { id: 't_combo_shield', ico: '🛡️', name: 'Combo protégé',    desc: '1 erreur sans casser le combo, par session', cost: 2 },
        { id: 't_coffre',       ico: '🎁', name: 'Coffres enrichis', desc: '+50 % gemmes dans les coffres', cost: 2 },
        { id: 't_gems_session', ico: '💎', name: 'Négociateur',      desc: '+25 % gemmes de fin de session', cost: 2 },
        { id: 't_rallye_bonus', ico: '🌍', name: 'Explorateur né',   desc: 'Bonus expédition du Rallye doublé', cost: 3 },
      ]},
    ];
    const TALENT_UNLOCK_LEVEL = 5;

    function hasTalent(id) { return !!(P.talents && P.talents[id]); }
    function talentSpent() {
      let s = 0;
      TALENT_TREE.forEach(b => b.talents.forEach(t => { if (hasTalent(t.id)) s += t.cost; }));
      return s;
    }
    function talentPointsAvailable() {
      const earned = Math.max(0, (P.level || 1) - TALENT_UNLOCK_LEVEL + 1);
      return Math.max(0, earned - talentSpent());
    }
    function talentOwnedInBranch(branchId) {
      const b = TALENT_TREE.find(x => x.id === branchId);
      return b ? b.talents.filter(t => hasTalent(t.id)).length : 0;
    }

    function openTalentsModal() {
      renderTalents();
      document.getElementById('talentsModal').style.display = 'flex';
    }

    function renderTalents() {
      const grid = document.getElementById('talentsBody');
      if (!grid) return;
      const locked = (P.level || 1) < TALENT_UNLOCK_LEVEL;
      const pts = talentPointsAvailable();
      document.getElementById('talentsPts').innerHTML = locked
        ? `🔒 Débloqué au niveau ${TALENT_UNLOCK_LEVEL} (tu es niveau ${P.level || 1})`
        : `Points de talent : <b style="color:var(--gold)">${pts}</b>`;
      grid.innerHTML = TALENT_TREE.map(branch => {
        const ownedCount = talentOwnedInBranch(branch.id);
        return `<div style="flex:1;min-width:230px;background:var(--bg);border:2px solid ${branch.color};border-radius:16px;padding:12px">
        <div style="font-weight:900;font-size:14px;color:${branch.color};margin-bottom:10px;text-align:center">${branch.name} <span style="color:var(--muted);font-size:11px">${ownedCount}/5</span></div>
        ${branch.talents.map((t, ti) => {
          const owned = hasTalent(t.id);
          const prevOk = ti === 0 || hasTalent(branch.talents[ti - 1].id);
          const canBuy = !owned && prevOk && pts >= t.cost;
          const state = owned
            ? `<button class="talent-buy" data-owned="1" disabled>✅ Acquis</button>`
            : !prevOk
              ? `<button class="talent-buy" disabled>🔒 Tier ${ti + 1}</button>`
              : !locked && canBuy
                ? `<button class="talent-buy" data-buy="1" onclick="buyTalent('${t.id}')">Acheter · ${t.cost} PT</button>`
                : `<button class="talent-buy" disabled>${t.cost} PT</button>`;
          return `<div class="talent-card ${owned ? 'owned' : ''}">
          <span class="talent-ico">${t.ico}</span>
          <div style="flex:1;min-width:0">
            <div style="font-weight:900;font-size:12px">${t.name}</div>
            <div style="font-size:10px;color:var(--muted);font-weight:700">${t.desc}</div>
          </div>
          ${state}
        </div>`;
        }).join('')}
      </div>`;
      }).join('');
    }

    function buyTalent(id) {
      let meta = null, branch = null, tier = -1;
      TALENT_TREE.forEach(b => b.talents.forEach((t, ti) => { if (t.id === id) { meta = t; branch = b; tier = ti; } }));
      if (!meta || hasTalent(id)) return;
      if ((P.level || 1) < TALENT_UNLOCK_LEVEL) { showToast(`🔒 Talents débloqués au niveau ${TALENT_UNLOCK_LEVEL}`); return; }
      if (tier > 0 && !hasTalent(branch.talents[tier - 1].id)) { showToast('🔒 Débloque d\'abord le talent précédent !'); return; }
      if (talentPointsAvailable() < meta.cost) { showToast('Pas assez de points de talent !'); return; }
      if (!P.talents) P.talents = {};
      P.talents[id] = true;
      save();
      spawnConfetti(25);
      showToast(`${meta.ico} Talent acquis : ${meta.name} !`);
      renderTalents();
      updateUI();
    }

    // ===== PROFILE TITLES =====
    // Purely cosmetic — unlocking or equipping a title never touches XP/gems/progression logic.
    const TITLE_CATALOG = [
      { id: 'streak7', label: '🔥 Série de Feu' },
      { id: 'streak30', label: '⚡ Série Légendaire' },
      { id: 'streak100', label: '👑 Centurion Assidu' },
      { id: 'expert_geo', label: '🗺️ Expert Géographie', check: () => (P.catStats.geo?.total || 0) >= 30 && (P.catStats.geo.correct / P.catStats.geo.total) >= 0.75 },
      { id: 'expert_hist', label: '🏛️ Expert Histoire', check: () => (P.catStats.hist?.total || 0) >= 30 && (P.catStats.hist.correct / P.catStats.hist.total) >= 0.75 },
      { id: 'expert_sci', label: '🔬 Expert Sciences', check: () => (P.catStats.sci?.total || 0) >= 30 && (P.catStats.sci.correct / P.catStats.sci.total) >= 0.75 },
      { id: 'maitre_quiz', label: '🧠 Maître du Quiz', check: () => (P.totalCorrect || 0) >= 500 },
      { id: 'champion_circuit', label: '🏎️ Champion du Circuit', check: () => (P.gpWins || 0) >= 5 },
      { id: 'champion_monde', label: '👑 Champion du Monde', check: () => ((P.championship || {}).titles || 0) >= 1 },
      { id: 'survivant', label: '💀 Survivant', check: () => (P.survieRecord || 0) >= 20 },
      { id: 'chasseur_boss', label: '⚔️ Chasseur de Boss', check: () => Object.keys(P.bossDefeated || {}).length >= 3 },
    ];
    function checkTitleUnlocks() {
      if (!P.titles) P.titles = {};
      let changed = false;
      TITLE_CATALOG.forEach(t => {
        if (!t.check) return; // streak titles are unlocked directly by checkStreakMilestones()
        if (!P.titles[t.id] && t.check()) {
          P.titles[t.id] = true; changed = true;
          showToast(`🏅 Titre débloqué : ${t.label}`);
        }
      });
      if (changed) save();
    }
    function renderTitles() {
      const grid = document.getElementById('titlesGrid');
      if (!grid) return;
      grid.innerHTML = TITLE_CATALOG.map(t => {
        const unlocked = !!(P.titles && P.titles[t.id]);
        const equipped = P.equippedTitle === t.id;
        return `<div class="title-chip ${unlocked ? 'unlocked' : ''} ${equipped ? 'equipped' : ''}" ${unlocked ? `onclick="equipTitle('${t.id}')"` : ''}>${t.label}</div>`;
      }).join('');
      const badge = document.getElementById('profTitleBadge');
      if (badge) {
        const t = TITLE_CATALOG.find(t => t.id === P.equippedTitle);
        badge.textContent = t ? t.label : '';
        badge.style.display = t ? 'inline-block' : 'none';
      }
    }
    function equipTitle(id) {
      P.equippedTitle = (P.equippedTitle === id) ? null : id;
      save(); renderTitles();
    }

    // ===== STREAK CALENDAR RENDER =====
    function renderStreakCalendar() {
      const grid = document.getElementById('streakCalGrid');
      const daysEl = document.getElementById('streakCalDays');
      const freezeEl = document.getElementById('streakCalFreezeCount');
      if (!grid) return;
      if (daysEl) daysEl.textContent = P.streakDays || 0;
      if (freezeEl) {
        const n = (P.powerups && P.powerups.streakFreeze) || 0;
        freezeEl.style.display = n > 0 ? 'inline-block' : 'none';
        freezeEl.textContent = `🧊 x${n}`;
      }
      const labels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
      const today = new Date();
      const history = P.streakHistory || [];
      let html = '';
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today); d.setDate(d.getDate() - i);
        const str = d.toISOString().split('T')[0];
        const played = history.includes(str);
        const isToday = i === 0;
        html += `<div class="streak-day ${played ? 'played' : ''} ${isToday ? 'today' : ''}">
          <div class="streak-day-dot">${played ? '🔥' : ''}</div>
          <div class="streak-day-label">${labels[d.getDay()]}</div>
        </div>`;
      }
      grid.innerHTML = html;
    }

    // ===== DARK MODE =====
    function applyDarkMode(on) {
      document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
      const t = document.getElementById('darkModeToggle');
      if (t) t.checked = !!on;
    }
    function toggleDarkMode() {
      P.darkMode = !P.darkMode;
      applyDarkMode(P.darkMode);
      save();
    }

    // ===== DAILY REMINDER (best-effort, local only — works while the app/tab stays open;
    // true background push would require a server + service worker, out of scope here) =====
    function toggleReminders() {
      const t = document.getElementById('remindersToggle');
      if (!P.remindersEnabled) {
        if (!('Notification' in window)) { showToast('🔔 Notifications non supportées sur cet appareil'); if (t) t.checked = false; return; }
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            P.remindersEnabled = true; save(); updateRemindersHint();
            showToast('🔔 Rappels activés !');
          } else { if (t) t.checked = false; showToast('🔔 Permission refusée'); }
        });
      } else {
        P.remindersEnabled = false; save(); updateRemindersHint();
      }
    }
    function updateRemindersHint() {
      const hint = document.getElementById('remindersHint');
      const t = document.getElementById('remindersToggle');
      if (t) t.checked = !!P.remindersEnabled;
      if (!hint) return;
      hint.textContent = P.remindersEnabled
        ? "Un rappel s'affiche si tu n'as pas encore joué aujourd'hui et que l'app reste ouverte en arrière-plan."
        : "Active pour recevoir un rappel si tu n'as pas encore joué aujourd'hui (fonctionne pendant que l'app est ouverte).";
    }
    function recordPlayHour() {
      if (!P.playHours) P.playHours = [];
      P.playHours.push(new Date().getHours());
      if (P.playHours.length > 20) P.playHours = P.playHours.slice(-20);
    }
    function getUsualPlayHour() {
      if (!P.playHours || P.playHours.length === 0) return 19; // sensible default: evening
      const sum = P.playHours.reduce((a, b) => a + b, 0);
      return Math.round(sum / P.playHours.length);
    }
    let _reminderChecked = false;
    function maybeShowLocalReminder() {
      if (!P.remindersEnabled || _reminderChecked) return;
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const today = new Date().toISOString().split('T')[0];
      if (P.lastPlayDate === today) return; // already played today
      const hour = new Date().getHours();
      const usual = getUsualPlayHour();
      if (Math.abs(hour - usual) <= 1) {
        _reminderChecked = true;
        try { new Notification('🔥 Ta série t\'attend !', { body: "Tu n'as pas encore joué aujourd'hui — reviens maintenir ta série !" }); } catch (e) { }
      }
    }

    function renderWeeklyBonusCard() {
      const el = document.getElementById('weeklyBonusContainer');
      if (!el) return;
      const wk = getISOWeek(new Date());
      const done = P.weeklyBonusWeek === wk;
      el.innerHTML = `<div class="weekly-bonus-card ${done ? 'done' : ''}" onclick="${done ? '' : 'startWeeklyBonus()'}">
        <div class="wb-ico">${done ? '✅' : '🌟'}</div>
        <div class="wb-info">
          <div class="wb-title">Question Bonus de la Semaine</div>
          <div class="wb-status">${done ? 'Complétée — reviens la semaine prochaine !' : 'Une question corsée, une grosse récompense'}</div>
        </div>
      </div>`;
    }
    function startWeeklyBonus() {
      const wk = getISOWeek(new Date());
      if (P.weeklyBonusWeek === wk) { showToast('🌟 Déjà complétée cette semaine !'); return; }
      if (P.hearts <= 0) { document.getElementById('scrNoHearts').style.display = 'flex'; updateUI(); return; }
      const hardPool = shuffle([
        ...(window.GEO_QB || []), ...(window.HIST_QB || []), ...(window.SCI_QB || []),
        ...(window.ART_QB || []), ...(window.CINEMA_QB || []), ...(window.SPORT_QB || []),
        ...(window.GASTRO_QB || []), ...(window.MYTHO_QB || [])
      ]).filter(q => q.difficulty === 'hard');
      const pool = hardPool.length > 0 ? hardPool.slice(0, 1) : shuffle(getPool('mixed')).slice(0, 1);
      startSession('normal');
      Q = { mode: 'weeklyBonus', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0, state: 'selecting', selectedIdx: null, combo: 0, userSel: [], retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0, duelPlayerHP: 5, duelAiHP: 5, duelAiDiff: 0.7, chain: null, chainIdx: 0, chainBroken: false };
      launchQuizScreen();
    }
    function claimWeeklyBonusIfApplicable(acc) {
      if (Q.mode !== 'weeklyBonus') return;
      const wk = getISOWeek(new Date());
      if (P.weeklyBonusWeek === wk) return;
      P.weeklyBonusWeek = wk;
      if (acc >= 100) {
        P.gems += 150; addXP(150);
        setTimeout(() => { spawnConfetti(50); showBonusPopup('🌟', 'Question Bonus Réussie !', 'Une question redoutable, vaincue !', ['⭐ +150 XP', '💎 +150 Gemmes']); }, 400);
      } else {
        showToast('🌟 Raté cette fois — reviens la semaine prochaine !');
      }
      save();
    }

    // Show bonus popup
    function showBonusPopup(ico, title, sub, rewards) {
      document.getElementById('bonusPopupIco').textContent = ico;
      document.getElementById('bonusPopupTitle').textContent = title;
      document.getElementById('bonusPopupSub').textContent = sub;
      const rDiv = document.getElementById('bonusPopupRewards');
      rDiv.innerHTML = rewards.map(r => `<div class="bonus-reward-chip">${r}</div>`).join('');
      document.getElementById('bonusPopupOverlay').classList.add('open');
    }

    // ===== BOSS FIGHT =====
    let _bossCtx = null; // {bossId, chIdx, ch}

    // Chaque chapitre affronte un boss différent avec ses propres règles :
    // HP, difficultés du pool, chrono éventuel et pouvoir spécial.
    const BOSSES = [
      { ico: '🐉', name: 'Le Dragon de la Connaissance', hp: 5, pool: ['medium', 'hard'], timerSec: 0, power: null,
        rules: 'Règles classiques : chaque bonne réponse lui inflige 1 dégât. 3 erreurs et tu es K.O.',
        reward: '+200 XP · +100 💎 · Fiche Légendaire' },
      { ico: '👾', name: 'Le Gardien des Étoiles', hp: 7, pool: ['easy', 'medium'], timerSec: 0, power: 'regen',
        rules: '7 HP mais des questions plus faciles. Attention : il régénère 1 HP tous les 3 tours !',
        reward: '+180 XP · +80 💎 · Coffre Mystère' },
      { ico: '🧙', name: 'L\'Archimage du Savoir', hp: 5, pool: ['medium', 'hard'], timerSec: 10, power: 'timer',
        rules: 'Sous sorts d\'accélération : seulement 10 secondes par question !',
        reward: '+220 XP · +120 💎 · Fiche Rare' },
      { ico: '💀', name: 'Le Seigneur des Erreurs', hp: 5, pool: ['medium', 'hard'], timerSec: 0, power: 'feed',
        rules: 'Vampirisme : chaque erreur lui rend 1 HP (sans dépasser son maximum).',
        reward: '+250 XP · +150 💎 · Super Coffre' },
      { ico: '🦁', name: 'Le Roi des Défis', hp: 6, pool: ['hard'], timerSec: 0, power: null,
        rules: 'Uniquement des questions difficiles, 6 HP. Réservé aux braves.',
        reward: '+200 XP · +100 💎 · Fiche Atlas Rare' },
    ];
    const bossForChapter = (chIdx) => BOSSES[((chIdx % BOSSES.length) + BOSSES.length) % BOSSES.length];
    // Talent Chasseur de boss : -1 HP (jamais moins de 3)
    const bossHpFor = (chIdx) => Math.max(3, bossForChapter(chIdx).hp - (hasTalent('t_boss_hp') ? 1 : 0));

    function updateBossHUD() {
      const width = Math.max(0, (Q.duelAiHP / (Q.bossMaxHP || 5)) * 100);
      document.getElementById('duelAiHP').style.width = width + '%';
      document.getElementById('duelAiHPVal').textContent = `${Q.duelAiHP} ${Q.bossIco || '👾'}`;
      const playerMax = Q.bossMaxHP ? 3 : 5;
      document.getElementById('duelPlayerHP').style.width = Math.max(0, (Q.duelPlayerHP / playerMax) * 100) + '%';
      document.getElementById('duelPlayerHPVal').textContent = Q.duelPlayerHP + ' ❤️';
    }

    function openBossModal(bossId, chIdx, ch) {
      _bossCtx = { bossId, chIdx, ch };
      const boss = bossForChapter(chIdx);
      const defeated = P.bossDefeated && P.bossDefeated[bossId];
      document.getElementById('bossIco').textContent = defeated ? '💀' : boss.ico;
      document.getElementById('bossTitle').textContent = defeated ? 'Boss déjà vaincu !' : `Boss : ${boss.name}`;
      document.getElementById('bossSub').textContent = defeated ? 'Tu as déjà triomphé de ce gardien.' : 'Bats le boss pour débloquer la suite !';
      document.getElementById('bossRewardDesc').textContent = boss.reward;
      // Règles dynamiques propres au boss (remplace le texte fixe)
      const rulesEl = document.querySelector('#bossModal .boss-warning + div');
      if (rulesEl) rulesEl.innerHTML = `<div style="font-size:12px;color:#ce93d8;font-weight:900;margin-bottom:6px">⚔️ ${boss.name}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);font-weight:700;line-height:1.6">• ${boss.rules}<br>• ${boss.hp} HP à lui infliger en 10 questions</div>`;
      document.getElementById('bossHPFill').style.width = '100%';
      document.getElementById('bossHPVal').textContent = String(bossHpFor(chIdx));
      const hpMax = document.getElementById('bossHPMax');
      if (hpMax) hpMax.textContent = String(bossHpFor(chIdx));
      document.getElementById('bossFightBtn').style.display = defeated ? 'none' : 'block';
      document.getElementById('bossModal').classList.add('open');
    }

    function startBossFight() {
      document.getElementById('bossModal').classList.remove('open');
      const boss = bossForChapter(_bossCtx.chIdx);
      const allQ = [
        ...(window.GEO_QB || []), ...(window.HIST_QB || []), ...(window.SCI_QB || []),
        ...(window.ART_QB || []), ...(window.CINEMA_QB || []), ...(window.SPORT_QB || []),
        ...(window.GASTRO_QB || []), ...(window.MYTHO_QB || []),
        ...(window.CHATEAUX_QB || []), ...(window.LITT_QB || []), ...(window.EXTENDED_QB || []),
      ];
      let pool = shuffle(allQ.filter(q => boss.pool.includes(q.difficulty))).slice(0, 10);
      if (pool.length < 5) {
        const fallback = shuffle(getPool('mixed')).slice(0, 10);
        pool.push(...fallback.slice(0, 10 - pool.length));
      }
      Q = {
        mode: 'boss', type: 'qcm', qs: pool.slice(0, 10), idx: 0, correct: 0, totalXP: 0,
        state: 'selecting', selectedIdx: null, combo: 0, userSel: [],
        retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0,
        duelPlayerHP: 3, duelAiHP: bossHpFor(_bossCtx.chIdx), duelAiDiff: 0, chain: null, chainIdx: 0, chainBroken: false,
        bossId: _bossCtx.bossId, bossChIdx: _bossCtx.chIdx, gemsEarned: 0,
        bossMaxHP: boss.hp, bossPower: boss.power, bossTimerSec: boss.timerSec,
        bossIco: boss.ico, bossName: boss.name,
      };
      launchQuizScreen();
    }

    function handleBossResult(won) {
      if (!P.bossDefeated) P.bossDefeated = {};
      if (won && Q.legend) {
        // Boss Légendaire mensuel : récompense exclusive + titre
        initLegendBoss();
        P.legendBoss.defeated = true;
        P.gems += 150; P.xp += 300; logDay('xp', 300);
        if (!P.titles) P.titles = {};
        P.titles.legend_slayer = true;
        addHonor('legend_' + currentMonthKey(), { ico: '👑', name: `Boss Légendaire : ${Q.bossName}`, cls: 'chapter-gold' });
        save(); updateUI();
        if (navigator.vibrate) navigator.vibrate([40, 60, 40, 60, 80]);
        setTimeout(() => {
          spawnConfetti(90);
          showBonusPopup('👑', 'BOSS LÉGENDAIRE VAINCU !', `${Q.bossName} est tombé — tu entres dans la légende !`,
            ['⭐ +300 XP', '💎 +150 Gemmes', '🏅 Titre : Tueur de Légende']);
          Companion.say('Le boss du MOIS est vaincu !! Respect éternel 🐉👑', { mood: 'celebrate', force: true, dur: 4500 });
        }, 400);
        return;
      }
      if (won) {
        P.bossDefeated[Q.bossId] = true;
        // Trophée « boss vaincu » (un par boss, badge violet)
        addHonor(Q.bossId, { ico: '⚔️', name: `Boss ${(Q.bossChIdx || 0) + 1} vaincu`, cls: 'boss' });
        P.gems += 100;
        P.xp += 200;
        // Unlock a rare atlas card
        const allCards = Object.values(window.ATLAS_CARDS || {}).flat();
        const locked = allCards.filter(c => !P.atlas.includes(c.id));
        if (locked.length > 0) {
          const rare = locked[Math.floor(Math.random() * locked.length)];
          P.atlas.push(rare.id);
          setTimeout(() => triggerDiscovery(rare.id), 800);
        }
        save(); updateUI(); buildRoad();
        if (navigator.vibrate) navigator.vibrate([40, 60, 40, 60, 80]);
        setTimeout(() => { spawnConfetti(70); showBonusPopup('🏆', 'Boss Vaincu !', `Tu as triomphé du gardien !`, ['🏆 +200 XP', '💎 +100 Gemmes', '📜 Fiche Légendaire !']); }, 400);
      }
    }

    // ===== WEEKLY MISSIONS =====
    const MISSION_POOL = [
      { id: 'w_play5', ico: '🎮', desc: 'Jouer 5 sessions', target: 5, stat: 'sessions', reward: { xp: 100, gems: 30 } },
      { id: 'w_correct50', ico: '✅', desc: '50 bonnes réponses', target: 50, stat: 'correct', reward: { xp: 150, gems: 50 } },
      { id: 'w_streak3', ico: '🔥', desc: 'Jouer 3 jours de suite', target: 3, stat: 'streak', reward: { xp: 80, gems: 40 } },
      { id: 'w_perfect2', ico: '✨', desc: '2 Perfect Runs', target: 2, stat: 'perfect', reward: { xp: 200, gems: 80 } },
      { id: 'w_daily3', ico: '🌍', desc: '3 Défis Quotidiens', target: 3, stat: 'daily', reward: { xp: 120, gems: 60 } },
      { id: 'w_geo20', ico: '🗺️', desc: '20 questions Géographie', target: 20, stat: 'cat_geo', reward: { xp: 100, gems: 35 } },
      { id: 'w_hist20', ico: '🏛️', desc: '20 questions Histoire', target: 20, stat: 'cat_hist', reward: { xp: 100, gems: 35 } },
      { id: 'w_map5', ico: '📍', desc: '5 parties Carte Interactive', target: 5, stat: 'mapquiz', reward: { xp: 150, gems: 50 } },
      { id: 'w_boss1', ico: '⚔️', desc: 'Vaincre 1 Boss', target: 1, stat: 'boss', reward: { xp: 300, gems: 100 } },
      { id: 'w_combo8', ico: '💥', desc: 'Atteindre un combo x8', target: 1, stat: 'combo8', reward: { xp: 120, gems: 45 } },
    ];

    function getISOWeek(d) {
      d = d ? new Date(d) : new Date();
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const day = date.getUTCDay() || 7;
      date.setUTCDate(date.getUTCDate() + 4 - day);
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
      return `${date.getUTCFullYear()}-W${week}`;
    }
    function initWeeklyMissions() {
      const week = getISOWeek();
      if (P.weeklyMissionReset !== week) {
        // New week — pick 4 random missions
        const shuffled = shuffle([...MISSION_POOL]);
        P.weeklyMissions = shuffled.slice(0, 4).map(m => ({ ...m, progress: 0, done: false }));
        P.weeklyMissionReset = week;
        save();
      }
    }

    function updateMissionProgress(stat, amount = 1) {
      let changed = false;
      const apply = (m, kind) => {
        if (m.done || m.stat !== stat) return;
        m.progress = Math.min(m.target, (m.progress || 0) + amount);
        if (m.progress >= m.target && !m.done) {
          m.done = true; changed = true;
          P.xp += m.reward.xp; P.gems += m.reward.gems;
          logDay('xp', m.reward.xp);
          showToast(`${kind === 'daily' ? '🎯' : '📋'} ${m.desc} — mission accomplie ! +${m.reward.xp} XP +${m.reward.gems}💎`);
        }
      };
      (P.weeklyMissions || []).forEach(m => apply(m, 'weekly'));
      // Les missions du jour ne progressent que le jour où elles ont été générées
      if (P.dailyMissionDate === todayStr()) (P.dailyMissions || []).forEach(m => apply(m, 'daily'));
      if (changed) {
        save();
        updateMissionsSummary();
        renderDailyMissionsCard();
        addXP(0); // déclenche level up éventuel + rafraîchit l'UI
      }
    }

    // ===== STREAK PAR CATÉGORIE =====
    const CAT_LABELS = { geo: '🗺️ Géographie', hist: '🏛️ Histoire', sci: '🔬 Sciences', art: '🎨 Art', cinema: '🎬 Cinéma', sport: '⚽ Sport', gastro: '🍽️ Gastronomie', mytho: '⚡ Mythologie', mixed: '🎲 Mixte', extended: '🌐 Culture', chateaux: '🏰 Châteaux' };

    function updateCatStreak(cat, isCorrect) {
      if (!cat) return;
      if (!P.catStreak) P.catStreak = {};
      if (!P.catStreak[cat]) P.catStreak[cat] = { current: 0, best: 0 };
      const s = P.catStreak[cat];
      if (isCorrect) {
        s.current++;
        if (s.current > s.best) s.best = s.current;
        // Paliers de récompense : 5, 10, 20 bonnes réponses d'affilée
        if ([5, 10, 20].includes(s.current)) {
          const label = CAT_LABELS[cat] || cat;
          const gems = s.current === 5 ? 10 : s.current === 10 ? 25 : 50;
          P.gems += gems;
          showToast(`🔥 Streak ${label} ×${s.current} ! +${gems}💎`);
          if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
        }
      } else {
        s.current = 0;
      }
    }

    function renderCatStreaks() {
      if (!P.catStreak) return '';
      return Object.entries(P.catStreak)
        .filter(([, s]) => s.best >= 3)
        .sort(([, a], [, b]) => b.best - a.best)
        .map(([cat, s]) => {
          const label = CAT_LABELS[cat] || cat;
          const pct = Math.min(100, Math.round((s.current / 10) * 100));
          return `<div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;margin-bottom:4px">
              <span>${label}</span>
              <span style="color:var(--orange)">🔥 ${s.current} <span style="color:var(--muted);font-size:11px">· record ${s.best}</span></span>
            </div>
            <div style="background:var(--border);border-radius:6px;height:8px">
              <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--orange),var(--gold));border-radius:6px;transition:width .4s"></div>
            </div>
          </div>`;
        }).join('');
    }

    // ===== OBJECTIFS PERSONNALISÉS (10 jours) =====
    const OBJECTIVE_TEMPLATES = [
      { cat: 'geo', label: 'Maîtriser la Géographie', dailyGoal: 10, icon: '🗺️', color: 'var(--blue)' },
      { cat: 'hist', label: 'Maîtriser l\'Histoire', dailyGoal: 10, icon: '🏛️', color: 'var(--purple)' },
      { cat: 'sci', label: 'Maîtriser les Sciences', dailyGoal: 10, icon: '🔬', color: 'var(--green)' },
      { cat: 'art', label: 'Maîtriser l\'Art', dailyGoal: 10, icon: '🎨', color: 'var(--orange)' },
      { cat: 'cinema', label: 'Maîtriser le Cinéma', dailyGoal: 10, icon: '🎬', color: 'var(--cinema)' },
      { cat: 'sport', label: 'Maîtriser le Sport', dailyGoal: 10, icon: '⚽', color: 'var(--red)' },
      { cat: 'gastro', label: 'Maîtriser la Gastronomie', dailyGoal: 10, icon: '🍽️', color: 'var(--gold)' },
      { cat: 'mytho', label: 'Maîtriser la Mythologie', dailyGoal: 10, icon: '⚡', color: 'var(--mytho)' },
    ];

    function startObjective(cat) {
      if (!P.objectives) P.objectives = [];
      const already = P.objectives.find(o => o.cat === cat && !o.done);
      if (already) { showToast('⚠️ Objectif déjà en cours pour cette catégorie !'); return; }
      const tpl = OBJECTIVE_TEMPLATES.find(t => t.cat === cat);
      if (!tpl) return;
      const startDate = new Date().toISOString().split('T')[0];
      const end = new Date(); end.setDate(end.getDate() + 9);
      const obj = { ...tpl, startDate, endDate: end.toISOString().split('T')[0], progress: {}, done: false };
      P.objectives.push(obj);
      save();
      showToast(`🎯 Objectif lancé : ${tpl.label} — 10 questions/jour pendant 10 jours !`);
      renderObjectivesUI();
    }

    function updateObjectiveProgress(cat) {
      if (!P.objectives) return;
      const today = new Date().toISOString().split('T')[0];
      P.objectives.forEach(obj => {
        if (obj.done || obj.cat !== cat) return;
        if (today > obj.endDate) { obj.done = true; return; }
        if (!obj.progress || typeof obj.progress !== 'object') obj.progress = {}; // guard vieux save
        obj.progress[today] = (obj.progress[today] || 0) + 1;
        const todayCount = obj.progress[today];
        if (todayCount === obj.dailyGoal) {
          showToast(`✅ Objectif du jour atteint : ${obj.label} ! (${Object.keys(obj.progress).length}/10 jours)`);
        }
        const donedays = Object.values(obj.progress).filter(v => v >= obj.dailyGoal).length;
        if (donedays >= 10) {
          obj.done = true;
          P.gems += 200; P.xp += 500;
          showBonusPopup('🏆', 'Objectif accompli !', `${obj.label} maîtrisée !`, ['🏆 +500 XP', '💎 +200 Gemmes', `${obj.icon} Spécialiste débloqué !`]);
          save();
        }
      });
    }

    function renderObjectivesUI() {
      const el = document.getElementById('objectivesList');
      if (!el) return;
      if (!P.objectives || P.objectives.length === 0) {
        el.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:13px;padding:12px">Aucun objectif en cours.<br>Lance-en un ci-dessous !</div>';
        return;
      }
      el.innerHTML = P.objectives.map(obj => {
        const today = new Date().toISOString().split('T')[0];
        const progress = (obj.progress && typeof obj.progress === 'object') ? obj.progress : {};
        const donedays = Object.values(progress).filter(v => v >= obj.dailyGoal).length;
        const todayCount = progress[today] || 0;
        const pct = Math.round((donedays / 10) * 100);
        const todayPct = Math.min(100, Math.round((todayCount / obj.dailyGoal) * 100));
        return `<div style="background:var(--bg);border:2px solid ${obj.color};border-radius:14px;padding:12px;margin-bottom:10px;${obj.done ? 'opacity:.6' : ''}">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:24px">${obj.icon}</span>
            <div style="flex:1">
              <div style="font-size:14px;font-weight:900;color:${obj.color}">${obj.label}</div>
              <div style="font-size:11px;color:var(--muted);font-weight:700">${obj.done ? '✅ Terminé !' : `Jusqu\'au ${obj.endDate}`}</div>
            </div>
            <div style="text-align:right;font-size:20px;font-weight:900;color:${obj.color}">${donedays}/10</div>
          </div>
          <div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:4px">Progression globale (jours complets)</div>
          <div style="background:var(--border);border-radius:6px;height:8px;margin-bottom:8px">
            <div style="width:${pct}%;height:100%;background:${obj.color};border-radius:6px;transition:width .4s"></div>
          </div>
          <div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:4px">Aujourd'hui : ${todayCount}/${obj.dailyGoal} questions</div>
          <div style="background:var(--border);border-radius:6px;height:6px">
            <div style="width:${todayPct}%;height:100%;background:linear-gradient(90deg,${obj.color},var(--gold));border-radius:6px;transition:width .4s"></div>
          </div>
        </div>`;
      }).join('');
    }

    function openObjectivesModal() {
      renderObjectivesUI();
      const el = document.getElementById('catStreaksList');
      if (el) el.innerHTML = renderCatStreaks() || '<div style="color:var(--muted);font-size:13px;text-align:center;padding:10px">Aucun streak pour l\'instant — réponds à des questions !</div>';
      document.getElementById('objectivesModal').classList.add('open');
    }

    function updateMissionsSummary() {
      const el = document.getElementById('missionsSummary'); if (!el) return;
      if (!P.weeklyMissions || P.weeklyMissions.length === 0) { el.textContent = 'Chargement…'; return; }
      const done = P.weeklyMissions.filter(m => m.done).length;
      const total = P.weeklyMissions.length;
      el.textContent = `${done}/${total} missions complétées`;
    }

    function openMissions() {
      initWeeklyMissions();
      const list = document.getElementById('missionsList');
      const daysLeft = 7 - new Date().getDay() || 7;
      document.getElementById('missionResetLabel').textContent = `Se renouvellent dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`;
      list.innerHTML = P.weeklyMissions.map(m => {
        const pct = Math.min(100, Math.round(((m.progress || 0) / m.target) * 100));
        return `<div class="mission-card ${m.done ? 'done' : ''}">
      <div class="mission-header">
        <div class="mission-ico">${m.ico}</div>
        <div class="mission-info">
          <div class="mission-title">${m.desc}</div>
          <div class="mission-reward">Récompense : +${m.reward.xp} XP · +${m.reward.gems} 💎</div>
        </div>
        ${m.done ? '<div class="mission-done-badge">✅ Fait !</div>' : ''}
      </div>
      ${!m.done ? `
        <div class="mission-prog-bar"><div class="mission-prog-fill" style="width:${pct}%"></div></div>
        <div class="mission-prog-text">${m.progress || 0} / ${m.target}</div>
      ` : ''}
    </div>`;
      }).join('');
      document.getElementById('missionsModal').classList.add('open');
    }

    // Table de correspondance : noms français → nom(s) dans le GeoJSON Natural Earth
    const FR_TO_GEOJSON = {
      'albanie': ['albania'],
      'allemagne': ['germany'],
      'autriche': ['austria'],
      'belgique': ['belgium'],
      'bielorussie': ['belarus'],
      'bosnie-herzegovine': ['bosnia and herz', 'bosnia and herzegovina'],
      'bulgarie': ['bulgaria'],
      'croatie': ['croatia'],
      'danemark': ['denmark'],
      'espagne': ['spain'],
      'estonie': ['estonia'],
      'finlande': ['finland'],
      'france': ['france'],
      'grece': ['greece'],
      'hongrie': ['hungary'],
      'irlande': ['ireland'],
      'islande': ['iceland'],
      'italie': ['italy'],
      'lettonie': ['latvia'],
      'lituanie': ['lithuania'],
      'luxembourg': ['luxembourg'],
      'macedoine': ['macedonia', 'north macedonia'],
      'malte': ['malta'],
      'moldavie': ['moldova'],
      'montenegro': ['montenegro'],
      'norvege': ['norway'],
      'pays-bas': ['netherlands'],
      'pologne': ['poland'],
      'portugal': ['portugal'],
      'republique tcheque': ['czech rep', 'czechia', 'czech republic'],
      'roumanie': ['romania'],
      'royaume-uni': ['united kingdom'],
      'russie': ['russia'],
      'serbie': ['serbia'],
      'slovaquie': ['slovakia'],
      'slovenie': ['slovenia'],
      'suede': ['sweden'],
      'suisse': ['switzerland'],
      'ukraine': ['ukraine'],
      'vatican': ['vatican'],
      // Asie
      'afghanistan': ['afghanistan'],
      'arabie saoudite': ['saudi arabia'],
      'armenie': ['armenia'],
      'azerbaidjan': ['azerbaijan'],
      'bahrein': ['bahrain'],
      'bangladesh': ['bangladesh'],
      'bhoutan': ['bhutan'],
      'brunei': ['brunei'],
      'cambodge': ['cambodia'],
      'chine': ['china'],
      'coree du nord': ['north korea', "dem. rep. korea"],
      'coree du sud': ['south korea', 'korea'],
      'emirats arabes unis': ['united arab emirates'],
      'georgie': ['georgia'],
      'inde': ['india'],
      'indonesie': ['indonesia'],
      'irak': ['iraq'],
      'iran': ['iran'],
      'israel': ['israel'],
      'japon': ['japan'],
      'jordanie': ['jordan'],
      'kazakhstan': ['kazakhstan'],
      'kirghizistan': ['kyrgyzstan'],
      'koweit': ['kuwait'],
      'laos': ['laos'],
      'liban': ['lebanon'],
      'malaisie': ['malaysia'],
      'mongolie': ['mongolia'],
      'nepal': ['nepal'],
      'oman': ['oman'],
      'ouzbekistan': ['uzbekistan'],
      'pakistan': ['pakistan'],
      'palestine': ['palestine', 'west bank', 'gaza'],
      'philippines': ['philippines'],
      'qatar': ['qatar'],
      'singapour': ['singapore'],
      'sri lanka': ['sri lanka'],
      'syrie': ['syria'],
      'taiwan': ['taiwan'],
      'tadjikistan': ['tajikistan'],
      'thailande': ['thailand'],
      'timor oriental': ['timor-leste', 'east timor'],
      'turkmenistan': ['turkmenistan'],
      'turquie': ['turkey'],
      'vietnam': ['vietnam', 'viet nam'],
      'yemen': ['yemen'],
      // Afrique
      'afrique du sud': ['south africa'],
      'algerie': ['algeria'],
      'angola': ['angola'],
      'benin': ['benin'],
      'botswana': ['botswana'],
      'burkina faso': ['burkina faso'],
      'burundi': ['burundi'],
      'cameroun': ['cameroon'],
      'cap-vert': ['cape verde'],
      'comores': ['comoros'],
      "cote d'ivoire": ['ivory coast', "cote d'ivoire"],
      'djibouti': ['djibouti'],
      'egypte': ['egypt'],
      'erythree': ['eritrea'],
      'eswatini': ['swaziland', 'eswatini'],
      'ethiopie': ['ethiopia'],
      'gabon': ['gabon'],
      'gambie': ['gambia'],
      'ghana': ['ghana'],
      'guinee': ['guinea'],
      'guinee equatoriale': ['eq. guinea', 'equatorial guinea'],
      'guinee-bissau': ['guinea-bissau'],
      'kenya': ['kenya'],
      'liberia': ['liberia'],
      'libye': ['libya'],
      'madagascar': ['madagascar'],
      'malawi': ['malawi'],
      'mali': ['mali'],
      'maroc': ['morocco'],
      'mauritanie': ['mauritania'],
      'mozambique': ['mozambique'],
      'namibie': ['namibia'],
      'niger': ['niger'],
      'nigeria': ['nigeria'],
      'ouganda': ['uganda'],
      'republique centrafricaine': ['central african rep.', 'central african republic'],
      'republique democratique du congo': ['dem. rep. congo', 'democratic republic of the congo', 'drc'],
      'republique du congo': ['congo', 'republic of the congo'],
      'rwanda': ['rwanda'],
      'sao tome-et-principe': ['sao tome and principe'],
      'senegal': ['senegal'],
      'sierra leone': ['sierra leone'],
      'somalie': ['somalia'],
      'soudan': ['sudan'],
      'soudan du sud': ['s. sudan', 'south sudan'],
      'tanzanie': ['tanzania'],
      'tchad': ['chad'],
      'togo': ['togo'],
      'tunisie': ['tunisia'],
      'zambie': ['zambia'],
      'zimbabwe': ['zimbabwe'],
      // Amériques
      'argentine': ['argentina'],
      'bolivie': ['bolivia'],
      'bresil': ['brazil'],
      'canada': ['canada'],
      'chili': ['chile'],
      'colombie': ['colombia'],
      'costa rica': ['costa rica'],
      'cuba': ['cuba'],
      'equateur': ['ecuador'],
      'etats-unis': ['united states', 'united states of america'],
      'guatemala': ['guatemala'],
      'haiti': ['haiti'],
      'honduras': ['honduras'],
      'jamaique': ['jamaica'],
      'mexique': ['mexico'],
      'nicaragua': ['nicaragua'],
      'panama': ['panama'],
      'paraguay': ['paraguay'],
      'perou': ['peru'],
      'salvador': ['el salvador'],
      'uruguay': ['uruguay'],
      'venezuela': ['venezuela'],
      // Océanie
      'australie': ['australia'],
      'fidji': ['fiji'],
      'nouvelle-zelande': ['new zealand'],
      'papouasie-nouvelle-guinee': ['papua new guinea'],
    };

    // Normalise une chaîne pour comparaison insensible aux accents et à la casse
    function normalizeStr(s) {
      return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }

    // Vérifie si un nom GeoJSON correspond au nom français de la question
    function countryMatches(frName, geoName) {
      const normFr = normalizeStr(frName);
      const normGeo = normalizeStr(geoName);
      // Cherche dans la table de correspondance
      const aliases = FR_TO_GEOJSON[normFr] || [];
      if (aliases.some(a => normalizeStr(a) === normGeo || normGeo.includes(normalizeStr(a)) || normalizeStr(a).includes(normGeo))) return true;
      // Fallback : comparaison directe normalisée
      return normFr === normGeo || normGeo.includes(normFr) || normFr.includes(normGeo);
    }

    function haversineKm(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    const MAP_QUESTIONS = [
      // Europe
      { name: 'France', lat: 46.2, lng: 2.2, hint: 'Europe de l\'Ouest' },
      { name: 'Albanie', lat: 41.1, lng: 20.2, hint: 'Balkans, Europe du Sud-Est' },
      { name: 'Allemagne', lat: 51.2, lng: 10.4, hint: 'Europe Centrale' },
      { name: 'Autriche', lat: 47.5, lng: 14.3, hint: 'Europe Centrale' },
      { name: 'Belgique', lat: 50.5, lng: 4.5, hint: 'Europe de l\'Ouest' },
      { name: 'Biélorussie', lat: 53.7, lng: 27.9, hint: 'Europe de l\'Est' },
      { name: 'Bosnie-Herzégovine', lat: 43.9, lng: 17.7, hint: 'Balkans, Europe du Sud-Est' },
      { name: 'Bulgarie', lat: 42.7, lng: 25.5, hint: 'Balkans, Europe du Sud-Est' },
      { name: 'Croatie', lat: 45.1, lng: 15.2, hint: 'Balkans, Europe du Sud' },
      { name: 'Danemark', lat: 56.3, lng: 9.5, hint: 'Europe du Nord' },
      { name: 'Espagne', lat: 40.4, lng: -3.7, hint: 'Europe du Sud-Ouest' },
      { name: 'Estonie', lat: 58.6, lng: 25.0, hint: 'Europe du Nord' },
      { name: 'Finlande', lat: 64.0, lng: 26.0, hint: 'Europe du Nord' },
      { name: 'Grèce', lat: 39.0, lng: 21.8, hint: 'Europe du Sud-Est' },
      { name: 'Hongrie', lat: 47.2, lng: 19.5, hint: 'Europe Centrale' },
      { name: 'Irlande', lat: 53.4, lng: -8.0, hint: 'Europe de l\'Ouest' },
      { name: 'Islande', lat: 64.9, lng: -19.0, hint: 'Europe du Nord (île)' },
      { name: 'Italie', lat: 41.9, lng: 12.5, hint: 'Europe du Sud' },
      { name: 'Lettonie', lat: 56.9, lng: 24.6, hint: 'Europe du Nord' },
      { name: 'Lituanie', lat: 55.2, lng: 23.9, hint: 'Europe du Nord' },
      { name: 'Luxembourg', lat: 49.8, lng: 6.1, hint: 'Europe de l\'Ouest' },
      { name: 'Macédoine', lat: 41.6, lng: 21.7, hint: 'Balkans, Europe du Sud-Est' },
      { name: 'Malte', lat: 35.9, lng: 14.4, hint: 'Méditerranée, Europe du Sud' },
      { name: 'Moldavie', lat: 47.4, lng: 28.4, hint: 'Europe de l\'Est' },
      { name: 'Monténégro', lat: 42.7, lng: 19.3, hint: 'Balkans, Europe du Sud-Est' },
      { name: 'Norvège', lat: 60.5, lng: 8.4, hint: 'Europe du Nord' },
      { name: 'Pays-Bas', lat: 52.1, lng: 5.3, hint: 'Europe de l\'Ouest' },
      { name: 'Pologne', lat: 52.2, lng: 19.1, hint: 'Europe Centrale' },
      { name: 'Portugal', lat: 39.4, lng: -8.2, hint: 'Europe du Sud-Ouest' },
      { name: 'République tchèque', lat: 49.8, lng: 15.5, hint: 'Europe Centrale' },
      { name: 'Roumanie', lat: 45.9, lng: 24.9, hint: 'Balkans, Europe du Sud-Est' },
      { name: 'Royaume-Uni', lat: 55.4, lng: -3.4, hint: 'Europe de l\'Ouest' },
      { name: 'Russie', lat: 61.5, lng: 105.3, hint: 'Europe / Asie' },
      { name: 'Serbie', lat: 44.0, lng: 21.0, hint: 'Balkans, Europe du Sud-Est' },
      { name: 'Slovaquie', lat: 48.7, lng: 19.5, hint: 'Europe Centrale' },
      { name: 'Slovénie', lat: 46.1, lng: 14.5, hint: 'Balkans, Europe du Sud' },
      { name: 'Suède', lat: 60.1, lng: 18.6, hint: 'Europe du Nord' },
      { name: 'Suisse', lat: 46.8, lng: 8.2, hint: 'Europe Centrale' },
      { name: 'Ukraine', lat: 48.4, lng: 31.2, hint: 'Europe de l\'Est' },
      { name: 'Vatican', lat: 41.9, lng: 12.4, hint: 'Europe du Sud (micro-État)' },

      // Asie
      { name: 'Afghanistan', lat: 33.9, lng: 67.7, hint: 'Asie du Sud-Ouest' },
      { name: 'Arabie saoudite', lat: 23.9, lng: 45.4, hint: 'Moyen-Orient' },
      { name: 'Arménie', lat: 40.2, lng: 44.5, hint: 'Caucase, Asie de l\'Ouest' },
      { name: 'Azerbaïdjan', lat: 40.4, lng: 49.9, hint: 'Caucase, Asie de l\'Ouest' },
      { name: 'Bahreïn', lat: 26.0, lng: 50.6, hint: 'Moyen-Orient (île)' },
      { name: 'Bangladesh', lat: 23.7, lng: 90.4, hint: 'Asie du Sud' },
      { name: 'Bhoutan', lat: 27.5, lng: 90.5, hint: 'Asie du Sud (Himalaya)' },
      { name: 'Brunei', lat: 4.5, lng: 114.8, hint: 'Asie du Sud-Est' },
      { name: 'Cambodge', lat: 12.6, lng: 104.9, hint: 'Asie du Sud-Est' },
      { name: 'Chine', lat: 35.8, lng: 104.1, hint: 'Asie de l\'Est' },
      { name: 'Corée du Nord', lat: 40.3, lng: 127.5, hint: 'Asie de l\'Est' },
      { name: 'Corée du Sud', lat: 35.9, lng: 127.8, hint: 'Asie de l\'Est' },
      { name: 'Émirats arabes unis', lat: 23.4, lng: 53.8, hint: 'Moyen-Orient' },
      { name: 'Géorgie', lat: 42.0, lng: 43.5, hint: 'Caucase, Asie de l\'Ouest' },
      { name: 'Inde', lat: 20.6, lng: 78.9, hint: 'Asie du Sud' },
      { name: 'Indonésie', lat: -0.8, lng: 113.9, hint: 'Asie du Sud-Est (archipel)' },
      { name: 'Irak', lat: 33.2, lng: 43.7, hint: 'Moyen-Orient' },
      { name: 'Iran', lat: 32.4, lng: 53.7, hint: 'Moyen-Orient' },
      { name: 'Israël', lat: 31.0, lng: 34.8, hint: 'Moyen-Orient' },
      { name: 'Japon', lat: 36.2, lng: 138.2, hint: 'Asie de l\'Est (archipel)' },
      { name: 'Jordanie', lat: 31.2, lng: 36.8, hint: 'Moyen-Orient' },
      { name: 'Kazakhstan', lat: 48.0, lng: 66.9, hint: 'Asie Centrale' },
      { name: 'Kirghizistan', lat: 41.2, lng: 74.7, hint: 'Asie Centrale' },
      { name: 'Koweït', lat: 29.4, lng: 47.7, hint: 'Moyen-Orient' },
      { name: 'Laos', lat: 18.0, lng: 104.8, hint: 'Asie du Sud-Est' },
      { name: 'Liban', lat: 33.9, lng: 35.5, hint: 'Moyen-Orient' },
      { name: 'Malaisie', lat: 4.2, lng: 101.9, hint: 'Asie du Sud-Est' },
      { name: 'Mongolie', lat: 46.9, lng: 103.9, hint: 'Asie de l\'Est' },
      { name: 'Népal', lat: 28.4, lng: 84.1, hint: 'Asie du Sud (Himalaya)' },
      { name: 'Oman', lat: 21.5, lng: 55.9, hint: 'Moyen-Orient' },
      { name: 'Ouzbékistan', lat: 41.4, lng: 64.6, hint: 'Asie Centrale' },
      { name: 'Pakistan', lat: 30.4, lng: 69.3, hint: 'Asie du Sud' },
      { name: 'Palestine', lat: 31.9, lng: 35.2, hint: 'Moyen-Orient' },
      { name: 'Philippines', lat: 12.9, lng: 121.8, hint: 'Asie du Sud-Est (archipel)' },
      { name: 'Qatar', lat: 25.3, lng: 51.5, hint: 'Moyen-Orient' },
      { name: 'Singapour', lat: 1.4, lng: 103.8, hint: 'Asie du Sud-Est (ville-État)' },
      { name: 'Sri Lanka', lat: 7.9, lng: 80.8, hint: 'Asie du Sud (île)' },
      { name: 'Syrie', lat: 34.8, lng: 38.5, hint: 'Moyen-Orient' },
      { name: 'Taïwan', lat: 23.7, lng: 121.0, hint: 'Asie de l\'Est (île)' },
      { name: 'Tadjikistan', lat: 38.9, lng: 71.3, hint: 'Asie Centrale' },
      { name: 'Thaïlande', lat: 15.9, lng: 100.9, hint: 'Asie du Sud-Est' },
      { name: 'Timor oriental', lat: -8.8, lng: 125.9, hint: 'Asie du Sud-Est (île)' },
      { name: 'Turkménistan', lat: 38.9, lng: 59.6, hint: 'Asie Centrale' },
      { name: 'Turquie', lat: 38.9, lng: 35.2, hint: 'Moyen-Orient / Europe' },
      { name: 'Vietnam', lat: 14.1, lng: 108.3, hint: 'Asie du Sud-Est' },
      { name: 'Yémen', lat: 15.4, lng: 48.5, hint: 'Moyen-Orient' },

      // Afrique
      { name: 'Afrique du Sud', lat: -30.5, lng: 22.9, hint: 'Extrême sud de l\'Afrique' },
      { name: 'Algérie', lat: 28.2, lng: 2.6, hint: 'Afrique du Nord' },
      { name: 'Angola', lat: -11.2, lng: 17.9, hint: 'Afrique Centrale' },
      { name: 'Bénin', lat: 9.3, lng: 2.3, hint: 'Afrique de l\'Ouest' },
      { name: 'Botswana', lat: -22.3, lng: 24.7, hint: 'Afrique australe' },
      { name: 'Burkina Faso', lat: 12.2, lng: -1.6, hint: 'Afrique de l\'Ouest' },
      { name: 'Burundi', lat: -3.4, lng: 29.9, hint: 'Afrique de l\'Est' },
      { name: 'Cameroun', lat: 5.6, lng: 12.3, hint: 'Afrique Centrale' },
      { name: 'Cap-Vert', lat: 15.1, lng: -23.6, hint: 'Afrique de l\'Ouest (archipel)' },
      { name: 'Comores', lat: -11.7, lng: 43.3, hint: 'Afrique de l\'Est (archipel)' },
      { name: 'Côte d\'Ivoire', lat: 7.5, lng: -5.5, hint: 'Afrique de l\'Ouest' },
      { name: 'Djibouti', lat: 11.8, lng: 42.6, hint: 'Afrique de l\'Est' },
      { name: 'Égypte', lat: 26.8, lng: 30.8, hint: 'Afrique du Nord' },
      { name: 'Érythrée', lat: 15.2, lng: 39.0, hint: 'Afrique de l\'Est' },
      { name: 'Eswatini', lat: -26.5, lng: 31.5, hint: 'Afrique australe' },
      { name: 'Éthiopie', lat: 9.0, lng: 38.7, hint: 'Afrique de l\'Est' },
      { name: 'Gabon', lat: -0.8, lng: 11.6, hint: 'Afrique Centrale' },
      { name: 'Gambie', lat: 13.4, lng: -16.6, hint: 'Afrique de l\'Ouest' },
      { name: 'Ghana', lat: 7.9, lng: -1.1, hint: 'Afrique de l\'Ouest' },
      { name: 'Guinée', lat: 11.0, lng: -10.0, hint: 'Afrique de l\'Ouest' },
      { name: 'Guinée équatoriale', lat: 1.6, lng: 10.3, hint: 'Afrique Centrale' },
      { name: 'Guinée-Bissau', lat: 11.9, lng: -15.6, hint: 'Afrique de l\'Ouest' },
      { name: 'Kenya', lat: -0.0, lng: 37.9, hint: 'Afrique de l\'Est' },
      { name: 'Libéria', lat: 6.4, lng: -9.4, hint: 'Afrique de l\'Ouest' },
      { name: 'Libye', lat: 26.3, lng: 17.2, hint: 'Afrique du Nord' },
      { name: 'Madagascar', lat: -18.9, lng: 46.4, hint: 'Afrique de l\'Est (île)' },
      { name: 'Malawi', lat: -13.3, lng: 34.3, hint: 'Afrique de l\'Est' },
      { name: 'Mali', lat: 17.6, lng: -4.0, hint: 'Afrique de l\'Ouest' },
      { name: 'Maroc', lat: 31.8, lng: -7.1, hint: 'Afrique du Nord-Ouest' },
      { name: 'Mauritanie', lat: 21.0, lng: -10.9, hint: 'Afrique de l\'Ouest' },
      { name: 'Maurice', lat: -20.3, lng: 57.5, hint: 'Afrique de l\'Est (île)' },
      { name: 'Namibie', lat: -22.0, lng: 17.1, hint: 'Afrique australe' },
      { name: 'Niger', lat: 17.6, lng: 8.1, hint: 'Afrique de l\'Ouest' },
      { name: 'Nigeria', lat: 9.1, lng: 8.6, hint: 'Afrique de l\'Ouest' },
      { name: 'Ouganda', lat: 1.3, lng: 32.3, hint: 'Afrique de l\'Est' },
      { name: 'République centrafricaine', lat: 6.6, lng: 20.9, hint: 'Afrique Centrale' },
      { name: 'République démocratique du Congo', lat: -4.0, lng: 21.8, hint: 'Afrique Centrale' },
      { name: 'République du Congo', lat: -0.2, lng: 15.2, hint: 'Afrique Centrale' },
      { name: 'Rwanda', lat: -1.9, lng: 29.9, hint: 'Afrique de l\'Est' },
      { name: 'Sahara occidental', lat: 24.2, lng: -13.0, hint: 'Afrique du Nord-Ouest' },
      { name: 'Sénégal', lat: 14.5, lng: -14.5, hint: 'Afrique de l\'Ouest' },
      { name: 'Seychelles', lat: -4.6, lng: 55.5, hint: 'Afrique de l\'Est (archipel)' },
      { name: 'Sierra Leone', lat: 8.5, lng: -11.5, hint: 'Afrique de l\'Ouest' },
      { name: 'Soudan', lat: 15.9, lng: 30.3, hint: 'Afrique du Nord-Est' },
      { name: 'Soudan du Sud', lat: 4.9, lng: 31.6, hint: 'Afrique de l\'Est' },
      { name: 'Tanzanie', lat: -6.2, lng: 34.9, hint: 'Afrique de l\'Est' },
      { name: 'Tchad', lat: 15.5, lng: 18.5, hint: 'Afrique Centrale' },
      { name: 'Togo', lat: 8.6, lng: 0.8, hint: 'Afrique de l\'Ouest' },
      { name: 'Tunisie', lat: 33.9, lng: 9.5, hint: 'Afrique du Nord' },
      { name: 'Zambie', lat: -13.1, lng: 27.8, hint: 'Afrique australe' },
      { name: 'Zimbabwe', lat: -19.0, lng: 29.2, hint: 'Afrique australe' },

      // Amérique
      { name: 'Antigua-et-Barbuda', lat: 17.1, lng: -61.8, hint: 'Caraïbes' },
      { name: 'Argentine', lat: -38.4, lng: -63.6, hint: 'Amérique du Sud' },
      { name: 'Bahamas', lat: 24.3, lng: -76.0, hint: 'Caraïbes' },
      { name: 'Barbade', lat: 13.2, lng: -59.5, hint: 'Caraïbes' },
      { name: 'Belize', lat: 17.3, lng: -88.2, hint: 'Amérique Centrale' },
      { name: 'Bolivie', lat: -16.3, lng: -63.8, hint: 'Amérique du Sud' },
      { name: 'Brésil', lat: -14.2, lng: -51.9, hint: 'Amérique du Sud' },
      { name: 'Canada', lat: 56.1, lng: -106.3, hint: 'Amérique du Nord' },
      { name: 'Chili', lat: -35.7, lng: -71.5, hint: 'Amérique du Sud' },
      { name: 'Colombie', lat: 4.6, lng: -74.1, hint: 'Amérique du Sud' },
      { name: 'Costa Rica', lat: 9.8, lng: -84.0, hint: 'Amérique Centrale' },
      { name: 'Cuba', lat: 21.5, lng: -77.8, hint: 'Caraïbes' },
      { name: 'Dominique', lat: 15.4, lng: -61.4, hint: 'Caraïbes' },
      { name: 'Équateur', lat: -1.8, lng: -78.2, hint: 'Amérique du Sud' },
      { name: 'États-Unis', lat: 37.1, lng: -95.9, hint: 'Amérique du Nord' },
      { name: 'Grenade', lat: 12.1, lng: -61.7, hint: 'Caraïbes' },
      { name: 'Guatemala', lat: 15.8, lng: -90.2, hint: 'Amérique Centrale' },
      { name: 'Guyana', lat: 5.0, lng: -58.9, hint: 'Amérique du Sud' },
      { name: 'Haïti', lat: 18.9, lng: -72.3, hint: 'Caraïbes' },
      { name: 'Honduras', lat: 15.2, lng: -86.2, hint: 'Amérique Centrale' },
      { name: 'Jamaïque', lat: 18.1, lng: -77.3, hint: 'Caraïbes' },
      { name: 'Mexique', lat: 23.6, lng: -102.5, hint: 'Amérique Centrale' },
      { name: 'Nicaragua', lat: 12.9, lng: -85.1, hint: 'Amérique Centrale' },
      { name: 'Panama', lat: 8.5, lng: -80.0, hint: 'Amérique Centrale' },
      { name: 'Paraguay', lat: -23.3, lng: -55.5, hint: 'Amérique du Sud' },
      { name: 'Pérou', lat: -9.1, lng: -75.0, hint: 'Amérique du Sud' },
      { name: 'République dominicaine', lat: 18.9, lng: -70.7, hint: 'Caraïbes' },
      { name: 'Salvador', lat: 13.8, lng: -88.9, hint: 'Amérique Centrale' },
      { name: 'Saint-Vincent-et-les-Grenadines', lat: 13.2, lng: -61.2, hint: 'Caraïbes' },
      { name: 'Sainte-Lucie', lat: 13.9, lng: -61.0, hint: 'Caraïbes' },
      { name: 'Suriname', lat: 3.9, lng: -56.0, hint: 'Amérique du Sud' },
      { name: 'Trinité-et-Tobago', lat: 10.7, lng: -61.2, hint: 'Caraïbes' },
      { name: 'Uruguay', lat: -32.5, lng: -55.7, hint: 'Amérique du Sud' },
      { name: 'Venezuela', lat: 6.4, lng: -66.6, hint: 'Amérique du Sud' },
      { name: 'Guyane française', lat: 4.0, lng: -53.0, hint: 'Amérique du Sud (territoire français)' },

      // Océanie
      { name: 'Australie', lat: -25.3, lng: 133.7, hint: 'Océanie' },
      { name: 'Fidji', lat: -16.6, lng: 179.4, hint: 'Océanie (archipel)' },
      { name: 'Îles Salomon', lat: -8.0, lng: 159.0, hint: 'Océanie (archipel)' },
      { name: 'Nouvelle-Calédonie', lat: -20.9, lng: 165.6, hint: 'Océanie (territoire français)' },
      { name: 'Nouvelle-Zélande', lat: -40.9, lng: 174.9, hint: 'Océanie' },
      { name: 'Papouasie-Nouvelle-Guinée', lat: -6.0, lng: 147.0, hint: 'Océanie' },
      { name: 'Polynésie française', lat: -17.6, lng: -149.4, hint: 'Océanie (territoire français)' },
      { name: 'Samoa', lat: -13.6, lng: -172.2, hint: 'Océanie (archipel)' },
      { name: 'Samoa américaines', lat: -14.3, lng: -170.7, hint: 'Océanie (territoire américain)' },
      { name: 'Tonga', lat: -21.1, lng: -175.2, hint: 'Océanie (archipel)' },
      { name: 'Vanuatu', lat: -15.4, lng: 166.9, hint: 'Océanie (archipel)' },

      // Territoires et petits États
      { name: 'Aruba', lat: 12.5, lng: -70.0, hint: 'Caraïbes (territoire néerlandais)' },
      { name: 'Îles Caïmans', lat: 19.3, lng: -81.2, hint: 'Caraïbes (territoire britannique)' },
      { name: 'Îles Féroé', lat: 62.0, lng: -6.8, hint: 'Europe du Nord (territoire danois)' },
      { name: 'Îles Malouines', lat: -51.8, lng: -59.5, hint: 'Amérique du Sud (territoire britannique)' },
      { name: 'Îles Mariannes du Nord', lat: 15.2, lng: 145.8, hint: 'Océanie (territoire américain)' },
      { name: 'Îles Turques-et-Caïques', lat: 21.8, lng: -72.2, hint: 'Caraïbes (territoire britannique)' },
      { name: 'Îles Vierges américaines', lat: 18.3, lng: -64.7, hint: 'Caraïbes (territoire américain)' },
      { name: 'Kosovo', lat: 42.7, lng: 20.9, hint: 'Balkans, Europe du Sud-Est' },
      { name: 'Palaos', lat: 7.5, lng: 134.6, hint: 'Océanie (archipel)' },
      { name: 'Porto Rico', lat: 18.4, lng: -66.1, hint: 'Caraïbes (territoire américain)' },
      { name: 'Saint-Christophe-et-Niévès', lat: 17.3, lng: -62.7, hint: 'Caraïbes' },
      { name: 'Saint-Marin', lat: 43.9, lng: 12.5, hint: 'Europe du Sud (micro-État)' },
      { name: 'São Tomé-et-Príncipe', lat: 0.2, lng: 6.6, hint: 'Afrique Centrale (archipel)' },
      { name: 'Taïwan', lat: 23.7, lng: 121.0, hint: 'Asie de l\'Est (île)' },
    ];

    // 🏙️ Base de données des villes du monde (capitales + grandes villes)
    const MAP_CITIES = [
      { name: 'Paris', lat: 48.85, lng: 2.35, hint: 'France', cont: 'Europe' },
      { name: 'Marseille', lat: 43.30, lng: 5.37, hint: 'France (Sud)', cont: 'Europe' },
      { name: 'Lyon', lat: 45.76, lng: 4.84, hint: 'France', cont: 'Europe' },
      { name: 'Londres', lat: 51.5, lng: -0.12, hint: 'Royaume-Uni', cont: 'Europe' },
      { name: 'Manchester', lat: 53.48, lng: -2.24, hint: 'Royaume-Uni', cont: 'Europe' },
      { name: 'Berlin', lat: 52.52, lng: 13.40, hint: 'Allemagne', cont: 'Europe' },
      { name: 'Munich', lat: 48.13, lng: 11.58, hint: 'Allemagne (Sud)', cont: 'Europe' },
      { name: 'Madrid', lat: 40.42, lng: -3.70, hint: 'Espagne', cont: 'Europe' },
      { name: 'Barcelone', lat: 41.39, lng: 2.17, hint: 'Espagne (Catalogne)', cont: 'Europe' },
      { name: 'Rome', lat: 41.90, lng: 12.50, hint: 'Italie', cont: 'Europe' },
      { name: 'Milan', lat: 45.46, lng: 9.19, hint: 'Italie (Nord)', cont: 'Europe' },
      { name: 'Amsterdam', lat: 52.37, lng: 4.90, hint: 'Pays-Bas', cont: 'Europe' },
      { name: 'Lisbonne', lat: 38.72, lng: -9.14, hint: 'Portugal', cont: 'Europe' },
      { name: 'Athènes', lat: 37.98, lng: 23.73, hint: 'Grèce', cont: 'Europe' },
      { name: 'Moscou', lat: 55.75, lng: 37.62, hint: 'Russie', cont: 'Europe' },
      { name: 'Saint-Pétersbourg', lat: 59.93, lng: 30.34, hint: 'Russie', cont: 'Europe' },
      { name: 'Istanbul', lat: 41.01, lng: 28.97, hint: 'Turquie', cont: 'Europe' },
      { name: 'New York', lat: 40.71, lng: -74.01, hint: 'États-Unis (Est)', cont: 'Amérique' },
      { name: 'Los Angeles', lat: 34.05, lng: -118.24, hint: 'États-Unis (Côte Ouest)', cont: 'Amérique' },
      { name: 'Chicago', lat: 41.88, lng: -87.63, hint: 'États-Unis (Centre)', cont: 'Amérique' },
      { name: 'Miami', lat: 25.76, lng: -80.19, hint: 'États-Unis (Floride)', cont: 'Amérique' },
      { name: 'Washington', lat: 38.90, lng: -77.04, hint: 'États-Unis (capitale)', cont: 'Amérique' },
      { name: 'Toronto', lat: 43.65, lng: -79.38, hint: 'Canada', cont: 'Amérique' },
      { name: 'Vancouver', lat: 49.28, lng: -123.12, hint: 'Canada (Côte Ouest)', cont: 'Amérique' },
      { name: 'Mexico', lat: 19.43, lng: -99.13, hint: 'Mexique (capitale)', cont: 'Amérique' },
      { name: 'Rio de Janeiro', lat: -22.91, lng: -43.17, hint: 'Brésil', cont: 'Amérique' },
      { name: 'São Paulo', lat: -23.55, lng: -46.63, hint: 'Brésil', cont: 'Amérique' },
      { name: 'Buenos Aires', lat: -34.60, lng: -58.38, hint: 'Argentine (capitale)', cont: 'Amérique' },
      { name: 'Lima', lat: -12.05, lng: -77.04, hint: 'Pérou (capitale)', cont: 'Amérique' },
      { name: 'Bogota', lat: 4.71, lng: -74.07, hint: 'Colombie (capitale)', cont: 'Amérique' },
      { name: 'Le Caire', lat: 30.04, lng: 31.24, hint: 'Égypte (capitale)', cont: 'Afrique' },
      { name: 'Lagos', lat: 6.52, lng: 3.38, hint: 'Nigeria (plus grande ville)', cont: 'Afrique' },
      { name: 'Casablanca', lat: 33.57, lng: -7.59, hint: 'Maroc', cont: 'Afrique' },
      { name: 'Marrakech', lat: 31.63, lng: -7.99, hint: 'Maroc', cont: 'Afrique' },
      { name: 'Nairobi', lat: -1.29, lng: 36.82, hint: 'Kenya (capitale)', cont: 'Afrique' },
      { name: 'Le Cap', lat: -33.92, lng: 18.42, hint: 'Afrique du Sud', cont: 'Afrique' },
      { name: 'Johannesburg', lat: -26.20, lng: 28.04, hint: 'Afrique du Sud (plus grande ville)', cont: 'Afrique' },
      { name: 'Dakar', lat: 14.69, lng: -17.45, hint: 'Sénégal (capitale)', cont: 'Afrique' },
      { name: 'Abidjan', lat: 5.32, lng: -4.03, hint: 'Côte d\'Ivoire (plus grande ville)', cont: 'Afrique' },
      { name: 'Addis-Abeba', lat: 9.03, lng: 38.74, hint: 'Éthiopie (capitale)', cont: 'Afrique' },
      { name: 'Tunis', lat: 36.81, lng: 10.18, hint: 'Tunisie (capitale)', cont: 'Afrique' },
      { name: 'Tokyo', lat: 35.68, lng: 139.69, hint: 'Japon (capitale)', cont: 'Asie' },
      { name: 'Osaka', lat: 34.69, lng: 135.50, hint: 'Japon', cont: 'Asie' },
      { name: 'Pékin', lat: 39.90, lng: 116.40, hint: 'Chine (capitale)', cont: 'Asie' },
      { name: 'Shanghai', lat: 31.23, lng: 121.47, hint: 'Chine (plus grande ville)', cont: 'Asie' },
      { name: 'Hong Kong', lat: 22.32, lng: 114.17, hint: 'Chine (région)', cont: 'Asie' },
      { name: 'Séoul', lat: 37.57, lng: 126.98, hint: 'Corée du Sud (capitale)', cont: 'Asie' },
      { name: 'Bangkok', lat: 13.76, lng: 100.50, hint: 'Thaïlande (capitale)', cont: 'Asie' },
      { name: 'Singapour', lat: 1.35, lng: 103.82, hint: 'Asie du Sud-Est (ville-État)', cont: 'Asie' },
      { name: 'Jakarta', lat: -6.21, lng: 106.85, hint: 'Indonésie (capitale)', cont: 'Asie' },
      { name: 'Mumbai', lat: 19.08, lng: 72.88, hint: 'Inde (plus grande ville)', cont: 'Asie' },
      { name: 'New Delhi', lat: 28.61, lng: 77.21, hint: 'Inde (capitale)', cont: 'Asie' },
      { name: 'Dubaï', lat: 25.20, lng: 55.27, hint: 'Émirats Arabes Unis', cont: 'Asie' },
      { name: 'Sydney', lat: -33.87, lng: 151.21, hint: 'Australie (plus grande ville)', cont: 'Océanie' },
      { name: 'Melbourne', lat: -37.81, lng: 144.96, hint: 'Australie', cont: 'Océanie' },
      { name: 'Auckland', lat: -36.85, lng: 174.76, hint: 'Nouvelle-Zélande', cont: 'Océanie' },
    ];

    let MAP_Q = { questions: [], idx: 0, score: 0, answered: false, mode: 'all' };
    let GLOBE = null;          // instance Globe.gl
    let GLOBE_COUNTRIES = [];  // features GeoJSON des pays
    let MAP_VILLES = [];       // 🏙️ "base de données" des villes placées par le joueur

    function openMapModeModal() {
      document.getElementById('mapModeModal').style.display = 'flex';
    }

    // Détermine le continent d'un pays à partir de son indice (texte de hint)
    function continentFromHint(hint) {
      if (/Afrique/i.test(hint)) return 'Afrique';
      if (/Europe|Balkans/i.test(hint)) return 'Europe';
      if (/Asie|Moyen-Orient/i.test(hint)) return 'Asie';
      if (/Amérique|Caraïbes/i.test(hint)) return 'Amérique';
      if (/Océanie|Pacifique/i.test(hint)) return 'Océanie';
      return 'Monde';
    }

    // ===== TOUR DU MONDE =====
    const TOUR_ETAPES = [
      { name: 'France', lat: 46.2, lng: 2.2, narration: '🗼 Paris, la Ville Lumière, vous accueille. La France est réputée pour sa gastronomie, son art de vivre et ses châteaux.', emoji: '🥐' },
      { name: 'Espagne', lat: 40.4, lng: -3.7, narration: '💃 Olé ! L\'Espagne, pays du flamenco, de la paella et du soleil méditerranéen. Seconde destination touristique mondiale.', emoji: '🥘' },
      { name: 'Italie', lat: 41.9, lng: 12.5, narration: '🍕 Benvenuti en Italie ! Berceau de la Renaissance, de la pizza et du Colisée. L\'un des plus grands musées à ciel ouvert au monde.', emoji: '🍕' },
      { name: 'Grèce', lat: 39.0, lng: 21.8, narration: '🏛️ Athènes, berceau de la démocratie et de la philosophie. Le Parthénon domine la ville depuis 2 500 ans.', emoji: '🫒' },
      { name: 'Égypte', lat: 26.8, lng: 30.8, narration: '🔺 Les Pyramides de Gizeh, seule des Sept Merveilles du monde encore debout. La civilisation égyptienne a 5 000 ans d\'histoire.', emoji: '🐫' },
      { name: 'Kenya', lat: -0.0, lng: 37.9, narration: '🦁 La savane kényane abrite les plus grandes migrations d\'animaux du monde — lions, éléphants, girafes à perte de vue.', emoji: '🦁' },
      { name: 'Afrique du Sud', lat: -30.5, lng: 22.9, narration: '🌈 Nation Arc-en-ciel, l\'Afrique du Sud est l\'un des pays les plus biodiversifiés de la planète, avec le Cap de Bonne-Espérance.', emoji: '🐧' },
      { name: 'Inde', lat: 20.6, lng: 78.9, narration: '🕌 Le Taj Mahal, chef-d\'œuvre de l\'architecture moghole, fut construit par un empereur pour honorer son amour disparu.', emoji: '🪷' },
      { name: 'Chine', lat: 35.8, lng: 104.1, narration: '🐉 La Grande Muraille de Chine s\'étend sur plus de 21 000 km. L\'Empire du Milieu est la civilisation continue la plus ancienne du monde.', emoji: '🏮' },
      { name: 'Japon', lat: 36.2, lng: 138.2, narration: '⛩️ Le mont Fuji, symbole du Japon, culmine à 3 776 m. Le pays du Soleil Levant allie tradition millénaire et modernité extrême.', emoji: '🌸' },
      { name: 'Australie', lat: -25.3, lng: 133.7, narration: '🦘 L\'Australie, continent-île, abrite 80 % d\'espèces animales uniques au monde, dont le kangourou et le koala.', emoji: '🦘' },
      { name: 'Nouvelle-Zélande', lat: -40.9, lng: 174.9, narration: '🏔️ Les fjords de Milford Sound et les volcans actifs font de la Nouvelle-Zélande un paradis pour les amateurs de nature.', emoji: '🐑' },
      { name: 'Brésil', lat: -14.2, lng: -51.9, narration: '🌴 L\'Amazonie, poumon de la Terre, couvre 60 % du Brésil. Rio de Janeiro est réputée pour son carnaval et le Christ Rédempteur.', emoji: '🦜' },
      { name: 'Argentine', lat: -38.4, lng: -63.6, narration: '💃 Terre du tango et de Maradona, l\'Argentine est aussi connue pour la Patagonie, les glaciers Perito Moreno et les pampas infinies.', emoji: '🥩' },
      { name: 'Pérou', lat: -9.1, lng: -75.0, narration: '🏔️ Le Machu Picchu, cité inca perchée à 2 430 m dans les Andes, reste l\'un des sites archéologiques les plus mystérieux du monde.', emoji: '🦙' },
      { name: 'Mexique', lat: 23.6, lng: -102.5, narration: '🌵 Le Mexique, berceau des civilisations maya et aztèque, fascine par ses pyramides, ses plages de Cancún et ses cuisines épicées.', emoji: '🌮' },
      { name: 'États-Unis', lat: 37.1, lng: -95.9, narration: '🗽 New York, Los Angeles, le Grand Canyon… Les États-Unis, 4e plus grand pays du monde, sont une mosaïque de paysages et cultures.', emoji: '🦅' },
      { name: 'Canada', lat: 56.1, lng: -106.3, narration: '🍁 Le Canada, 2e plus grand pays du monde, possède 20 % des eaux douces mondiales et les chutes du Niagara, frontière naturelle avec les USA.', emoji: '🦫' },
      { name: 'Maroc', lat: 31.8, lng: -7.1, narration: '🕌 Marrakech et ses souks labyrinthiques, Fès et sa médina médiévale… Le Maroc est une porte entre l\'Europe et l\'Afrique.', emoji: '🏺' },
      { name: 'Turquie', lat: 38.9, lng: 35.2, narration: '🕌 Istanbul, seule métropole au monde à cheval sur deux continents, mêle l\'architecture ottomane et byzantine depuis des millénaires.', emoji: '🍡' },
      { name: 'Russie', lat: 61.5, lng: 105.3, narration: '🔴 La Russie, plus grand pays du monde avec 17 millions de km², s\'étend sur 11 fuseaux horaires, de Kaliningrad au Kamtchatka.', emoji: '🪆' },
      { name: 'Norvège', lat: 60.5, lng: 8.4, narration: '🌌 Les fjords norvégiens et les aurores boréales font de ce pays l\'une des destinations naturelles les plus spectaculaires du monde.', emoji: '🐳' },
      { name: 'Islande', lat: 64.9, lng: -19.0, narration: '🌋 Terre de glace et de feu, l\'Islande possède geysers, volcans actifs, glaciers millénaires et bains géothermaux comme le Blue Lagoon.', emoji: '🌋' },
      { name: 'Thaïlande', lat: 15.9, lng: 100.9, narration: '🛕 Bangkok, ses temples scintillants, ses marchés flottants et sa street food légendaire. La Thaïlande est le « Pays du Sourire ».', emoji: '🙏' },
      { name: 'Indonésie', lat: -0.8, lng: 113.9, narration: '🌴 L\'Indonésie, archipel de 17 000 îles, est le 4e pays le plus peuplé du monde et abrite Bali, Java et le majestueux Krakatoa.', emoji: '🦧' },
      { name: 'Éthiopie', lat: 9.0, lng: 38.7, narration: '☕ L\'Éthiopie est le berceau du café ! La Vallée du Rift, les os de Lucy et les monastères du lac Tana font de ce pays un musée vivant.', emoji: '☕' },
      { name: 'Iran', lat: 32.4, lng: 53.7, narration: '🏛️ Persépolis, ancienne capitale de l\'Empire perse, et Ispahan la magnifique attestent d\'une civilisation parmi les plus anciennes du monde.', emoji: '🌹' },
      { name: 'Inde', lat: 20.6, lng: 78.9, narration: '🌊 De retour en Asie : Varanasi, la plus ancienne cité du monde encore habitée, où le Gange est vénéré comme une déesse.', emoji: '🎆' },
      { name: 'Chili', lat: -35.7, lng: -71.5, narration: '🗿 L\'île de Pâques et ses 887 moaïs mystérieux. Le Chili est aussi le plus long pays du monde, s\'étendant sur 4 300 km du nord au sud.', emoji: '🌋' },
      { name: 'France', lat: 46.2, lng: 2.2, narration: '🏠 Retour à Paris ! Vous avez effectué le Tour du Monde en 30 étapes. Combien de ces pays avez-vous déjà visités ? 🌍', emoji: '🏆' },
    ];

    let TOUR = { active: false, idx: 0 };

    function startTourDuMonde() {
      TOUR = { active: true, idx: 0 };
      GLOBE_MODE = 'tour';
      document.getElementById('mapModeModal').style.display = 'none';
      document.getElementById('scrMapQuiz').classList.add('active');
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
      MAP_Q = { questions: [], idx: 0, score: 0, answered: true, mode: 'tour' };
      buildWorldMap();
      // Attend que les données GeoJSON soient disponibles avant d'afficher la première étape
      const waitForGlobe = () => {
        if (GLOBE_COUNTRIES.length > 0) {
          renderTourEtape();
        } else {
          setTimeout(waitForGlobe, 200);
        }
      };
      setTimeout(waitForGlobe, 400);
    }

    function renderTourEtape() {
      if (TOUR.idx >= TOUR_ETAPES.length) { endTourDuMonde(); return; }
      const etape = TOUR_ETAPES[TOUR.idx];
      document.getElementById('mapQCurr').textContent = TOUR.idx + 1;
      document.getElementById('mapQTot').textContent = TOUR_ETAPES.length;
      document.getElementById('mapQuestion').textContent = `${etape.emoji} Étape ${TOUR.idx + 1} : ${etape.name}`;
      document.getElementById('mapFeedback').textContent = etape.narration;
      document.getElementById('mapFeedback').className = 'map-feedback correct';
      document.getElementById('mapNextBtn').style.display = 'block';
      document.getElementById('mapNextBtn').textContent = TOUR.idx < TOUR_ETAPES.length - 1 ? 'Étape suivante →' : '🏠 Fin du Tour !';
      if (GLOBE) {
        GLOBE.pointOfView({ lat: etape.lat, lng: etape.lng, altitude: 1.5 }, 1400);
        GLOBE.ringsData([{ lat: etape.lat, lng: etape.lng, color: 'rgba(250,204,21,0.8)' }]);
        // Ajoute le marqueur du tour sans écraser les villes existantes
        const tourMarker = [{ lat: etape.lat, lng: etape.lng, emoji: etape.emoji, size: 30, _isTour: true }];
        const existing = (GLOBE.htmlElementsData() || []).filter(d => !d._isTour);
        GLOBE.htmlElementsData([...existing, ...tourMarker]);
      }
    }

    function tourNextEtape() {
      TOUR.idx++;
      renderTourEtape();
    }

    function endTourDuMonde() {
      P.gems += 100; P.xp += 300; save();
      // Nettoie les marqueurs de tour avant de quitter
      if (GLOBE) {
        GLOBE.ringsData([]);
        const existing = (GLOBE.htmlElementsData() || []).filter(d => !d._isTour);
        GLOBE.htmlElementsData(existing);
      }
      exitMapQuiz();
      GLOBE_MODE = 'quiz';
      setTimeout(() => showBonusPopup('🌍', 'Tour du Monde complété !', '30 pays explorés !', ['🏆 +300 XP', '💎 +100 Gemmes', '🌍 Explorateur mondial !']), 300);
    }

    // ===== 🏆 RALLYE DU MONDE : 10 pays à conquérir en QCM géographie =====
    let RALLYE = { active: false, rounds: [], idx: 0, conquered: 0, bestStreak: 0, streak: 0 };

    // Mini Tour du Monde d'un nœud de route : 5 questions géo, l'étape est
    // validée avec des étoiles selon les pays conquis.
    function startRoadTour(node) {
      const count = Math.min(node.qCount, 5);
      const geoPool = shuffle([...(window.GEO_QB || [])]);
      const stages = shuffle(TOUR_ETAPES.map(e => e.name));
      const rounds = [];
      const used = new Set();
      for (const q of geoPool) {
        if (rounds.length >= count) break;
        if (used.has(q.id)) continue;
        used.add(q.id);
        const ql = (q.question || '').toLowerCase();
        const match = stages.find(s => ql.includes(s.toLowerCase()));
        rounds.push({ q, country: match || stages[rounds.length % stages.length] });
      }
      GLOBE_MODE = 'rallye';
      document.getElementById('mapModeModal').style.display = 'none';
      document.getElementById('scrMapQuiz').classList.add('active');
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
      GLOBE_COUNTRIES.forEach(f => { f.__rallyeWon = false; f.__rallyeLost = false; f.__hint = false; f.__guessed = false; f.__correct = false; });
      MAP_Q = { questions: [], idx: 0, score: 0, answered: false, mode: 'rallye' };
      buildWorldMap();
      RALLYE = { active: true, rounds, idx: 0, conquered: 0, bestStreak: 0, streak: 0, roadNode: node };
      document.getElementById('mapQuestion').textContent = '🌍 MINI TOUR DU MONDE';
      document.getElementById('mapFeedback').textContent = `Conquis ${count} pays pour valider l'étape « ${node.label} » !`;
      document.getElementById('mapFeedback').className = 'map-feedback';
      document.getElementById('mapNextBtn').style.display = 'none';
      document.getElementById('mapHintBtns').style.display = 'none';
      document.getElementById('mapQCurr').textContent = '1';
      document.getElementById('mapQTot').textContent = String(count);
      const waitGlobe = () => GLOBE ? renderRallyeRound() : setTimeout(waitGlobe, 200);
      setTimeout(waitGlobe, 400);
    }

    function startRallye() {
      const pool = shuffle([...(window.GEO_QB || [])]);
      const countryNames = (GLOBE_COUNTRIES.length
        ? GLOBE_COUNTRIES.map(f => f.properties?.NAME || f.properties?.name || '').filter(n => n.length > 3)
        : TOUR_ETAPES.map(e => e.name));

      // 1. Questions thématiques : le nom du pays apparaît dans l'intitulé
      const rounds = [];
      const usedQ = new Set();
      for (const q of pool) {
        if (rounds.length >= 10) break;
        if (usedQ.has(q.id)) continue;
        const ql = (q.question || '').toLowerCase();
        const country = countryNames.find(n => ql.includes(n.toLowerCase()));
        if (country) {
          rounds.push({ q, country });
          usedQ.add(q.id);
        }
      }
      // 2. Complète avec des questions géo aléatoires, chaque pays du globe servant d'étape
      const stages = shuffle(countryNames.length ? countryNames : TOUR_ETAPES.map(e => e.name));
      for (const q of pool) {
        if (rounds.length >= 10) break;
        if (usedQ.has(q.id)) continue;
        rounds.push({ q, country: stages[rounds.length % stages.length] });
        usedQ.add(q.id);
      }

      GLOBE_MODE = 'rallye';
      document.getElementById('mapModeModal').style.display = 'none';
      document.getElementById('scrMapQuiz').classList.add('active');
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
      GLOBE_COUNTRIES.forEach(f => { f.__rallyeWon = false; f.__rallyeLost = false; f.__hint = false; f.__guessed = false; f.__correct = false; });
      MAP_Q = { questions: [], idx: 0, score: 0, answered: false, mode: 'rallye' };
      buildWorldMap();
      RALLYE = { active: true, rounds, idx: 0, conquered: 0, bestStreak: 0, streak: 0 };
      document.getElementById('mapQuestion').textContent = '🏆 RALLYE DU MONDE';
      document.getElementById('mapFeedback').textContent = '10 pays à conquérir : chaque bonne réponse colore le pays en vert !';
      document.getElementById('mapFeedback').className = 'map-feedback';
      document.getElementById('mapNextBtn').style.display = 'none';
      document.getElementById('mapHintBtns').style.display = 'none';
      document.getElementById('mapQCurr').textContent = '1';
      document.getElementById('mapQTot').textContent = '10';
      const waitGlobe = () => GLOBE ? renderRallyeRound() : setTimeout(waitGlobe, 200);
      setTimeout(waitGlobe, 400);
    }

    function renderRallyeRound() {
      if (!RALLYE.active) return;
      if (RALLYE.idx >= RALLYE.rounds.length) { endRallye(); return; }
      const round = RALLYE.rounds[RALLYE.idx];
      const q = round.q;
      MAP_Q.idx = RALLYE.idx;
      MAP_Q.answered = false;
      document.getElementById('mapQCurr').textContent = RALLYE.idx + 1;
      document.getElementById('mapNextBtn').style.display = 'none';
      document.getElementById('mapHintBtns').style.display = 'none';
      document.getElementById('mapQuestion').textContent =
        `🏆 Rallye ${RALLYE.idx + 1}/10 — ${round.country}${RALLYE.streak >= 3 ? '  🔥×' + RALLYE.streak : ''}`;

      // Le globe vole vers l'étape
      const feat = GLOBE_COUNTRIES.find(f => countryMatches(round.country, f.properties?.NAME || f.properties?.name || ''));
      if (GLOBE) {
        const pt = feat ? polygonCentroid(feat.geometry) : null;
        GLOBE.pointOfView({ lat: pt?.lat ?? 20, lng: pt?.lng ?? 0, altitude: 1.7 }, 1200);
        if (pt) GLOBE.ringsData([{ lat: pt.lat, lng: pt.lng, color: 'rgba(88,204,2,0.7)' }]);
      }

      // Question QCM dans la zone de feedback
      const fb = document.getElementById('mapFeedback');
      fb.className = 'map-feedback';
      fb.innerHTML = `<div style="font-weight:900;font-size:14px;margin-bottom:10px">${q.question}</div>
      <div style="display:grid;gap:6px;">
        ${q.choices.map((c, i) => `
          <button class="rallye-ans" id="rallyeAns_${i}" onclick="answerRallye(${i})">
            <b>${String.fromCharCode(65 + i)}</b> · ${c}
          </button>`).join('')}
      </div>`;
    }

    function answerRallye(i) {
      if (!RALLYE.active || MAP_Q.answered) return;
      MAP_Q.answered = true;
      const round = RALLYE.rounds[RALLYE.idx];
      const q = round.q;
      const correct = i === q.correctAnswer;

      // Stats cohérentes avec le reste du jeu
      recordCatStat(q.cat, correct);
      if (correct) P.totalCorrect++;
      if (q.atlasId && !P.atlas.includes(q.atlasId)) {
        P.atlas.push(q.atlasId);
        setTimeout(() => triggerDiscovery(q.atlasId), 500);
      }

      // Conquête / perte du pays sur le globe
      const feat = GLOBE_COUNTRIES.find(f => countryMatches(round.country, f.properties?.NAME || f.properties?.name || ''));
      if (correct) {
        RALLYE.conquered++; RALLYE.streak++;
        RALLYE.bestStreak = Math.max(RALLYE.bestStreak, RALLYE.streak);
        if (feat) feat.__rallyeWon = true;
        if (GLOBE) {
          const pt = feat ? polygonCentroid(feat.geometry) : null;
          if (pt) GLOBE.ringsData([{ lat: pt.lat, lng: pt.lng, color: 'rgba(88,204,2,0.85)' }]);
        }
        audio.playCorrect();
        Q.totalXP = (Q.totalXP || 0) + (q.xp || 10);
        addXP(q.xp || 10);
        // Bonus expédition (doublé avec le talent Explorateur né)
        if (RALLYE.streak >= 3) {
          const bonus = hasTalent('t_rallye_bonus') ? 6 : 3;
          P.gems += bonus;
          showToast(`🔥 Expédition ×${RALLYE.streak} ! +${bonus} 💎`);
        }
      } else {
        RALLYE.streak = 0;
        if (feat) feat.__rallyeLost = true;
        if (!P.mistakes.find(m => m.question === q.question)) P.mistakes.push(q);
        audio.playWrong();
      }
      if (GLOBE) GLOBE.polygonsData([...GLOBE_COUNTRIES]);

      const fb = document.getElementById('mapFeedback');
      fb.className = 'map-feedback ' + (correct ? 'correct' : 'wrong');
      fb.innerHTML = `<div style="font-weight:900;margin-bottom:4px">${correct ? '✅ Pays conquis !' : '❌ Raté — pays perdu !'}</div>
      <div style="font-size:12px">${q.explanation || ''}</div>
      <div style="margin-top:10px"><button class="btn-action active-next" style="width:100%;max-width:240px" onclick="rallyeNext()">Poursuivre le rallye →</button></div>`;
      save();
    }

    function rallyeNext() {
      RALLYE.idx++;
      renderRallyeRound();
    }

    function endRallye() {
      RALLYE.active = false;

      // ── Variante nœud de route : validation de l'étape avec étoiles ──
      if (RALLYE.roadNode) {
        const node = RALLYE.roadNode;
        const total = RALLYE.rounds.length;
        const stars = RALLYE.conquered >= total ? 3 : RALLYE.conquered >= total - 1 ? 2 : RALLYE.conquered >= total - 2 ? 1 : 0;
        if (stars > 0) {
          P.nodeProgress[node.id] = true;
          if (!P.nodeStars) P.nodeStars = {};
          P.nodeStars[node.id] = Math.max(P.nodeStars[node.id] || 0, stars);
          if (stars === 3) spawnConfetti();
        }
        checkAchievements(); checkTitleUnlocks(); save();
        const fb = document.getElementById('mapFeedback');
        fb.className = 'map-feedback ' + (stars > 0 ? 'correct' : 'wrong');
        fb.innerHTML = `<div style="font-weight:900;font-size:16px;margin-bottom:6px">${stars > 0 ? '✅ Étape validée !' : '❌ Pas assez de pays conquis'}</div>
      <div style="font-size:13px;margin-bottom:4px">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} — ${RALLYE.conquered}/${total} pays</div>
      <div style="font-size:12px;margin-bottom:4px">Meilleure série : ${RALLYE.bestStreak} · 💎 +${RALLYE.conquered * 3}</div>
      <div style="margin-top:10px;display:flex;gap:8px;justify-content:center">
        <button class="btn-action active-next" style="max-width:150px" onclick="startRoadTour(RALLYE.roadNode)">Rejouer</button>
        <button class="btn-action" style="max-width:150px;background:var(--bg);color:var(--text);box-shadow:0 5px 0 var(--border)" onclick="exitMapQuiz()">Retour route</button>
      </div>`;
        P.gems += RALLYE.conquered * 3;
        return;
      }

      if (!P.rallyeBest) P.rallyeBest = 0;
      const isRecord = RALLYE.conquered > P.rallyeBest;
      P.rallyeBest = Math.max(P.rallyeBest, RALLYE.conquered);
      const gems = RALLYE.conquered * 3 + (RALLYE.conquered === 10 ? 30 : 0);
      P.gems += gems;
      if (RALLYE.conquered === 10) addHonor('rallye_parfait', { ico: '🌍', name: 'Rallye Parfait 10/10', cls: 'chapter-gold' });
      else if (RALLYE.conquered >= 7) addHonor('rallye_7', { ico: '🗺️', name: 'Rallye : 7+ pays', cls: 'boss' });
      checkAchievements(); checkTitleUnlocks(); save();
      const fb = document.getElementById('mapFeedback');
      fb.className = 'map-feedback ' + (RALLYE.conquered >= 7 ? 'correct' : 'wrong');
      fb.innerHTML = `<div style="font-weight:900;font-size:16px;margin-bottom:6px">🏆 Rallye terminé : ${RALLYE.conquered}/10 pays !</div>
      <div style="font-size:12px;margin-bottom:4px">Meilleure série : ${RALLYE.bestStreak} · 💎 +${gems}${isRecord ? ' · ⭐ Nouveau record !' : ''}</div>
      <div style="margin-top:10px;display:flex;gap:8px;justify-content:center">
        <button class="btn-action active-next" style="max-width:140px" onclick="startRallye()">Rejouer</button>
        <button class="btn-action" style="max-width:140px;background:var(--bg);color:var(--text);box-shadow:0 5px 0 var(--border)" onclick="exitMapQuiz()">Terminer</button>
      </div>`;
      if (RALLYE.conquered >= 7) spawnConfetti();
    }

    function startMapQuiz(mode) {
      document.getElementById('mapModeModal').style.display = 'none';
      // Mode Heatmap : affiche le globe coloré selon les stats du joueur
      if (mode === 'heatmap') {
        GLOBE_MODE = 'heatmap';
        document.getElementById('scrMapQuiz').classList.add('active');
        document.getElementById('topbar').style.display = 'none';
        document.getElementById('bnav').style.display = 'none';
        MAP_Q = { questions: [], idx: 0, score: 0, answered: true, mode: 'heatmap' };
        buildWorldMap();
        setTimeout(() => {
          document.getElementById('mapQuestion').textContent = '🌡️ Heatmap — tes pays maîtrisés';
          document.getElementById('mapFeedback').textContent = '🟢 Maîtrisé  🟡 En progression  🟠 À travailler  ⚫ Non exploré';
          document.getElementById('mapFeedback').className = 'map-feedback';
          document.getElementById('mapNextBtn').style.display = 'none';
          document.getElementById('mapQCurr').textContent = '—';
          document.getElementById('mapQTot').textContent = '—';
          if (GLOBE) GLOBE.polygonsData([...GLOBE_COUNTRIES]);
        }, 500);
        return;
      }
      GLOBE_MODE = 'quiz';
      let pool;
      if (mode === 'villes') {
        pool = MAP_CITIES.map(c => ({ ...c, isCity: true }));
      } else if (mode && mode !== 'all' && mode !== 'atlas') {
        pool = MAP_QUESTIONS.filter(q => continentFromHint(q.hint) === mode);
      } else {
        pool = [...MAP_QUESTIONS];
      }
      const n = mode === 'atlas' ? 0 : Math.min(10, pool.length);
      MAP_Q = { questions: shuffle(pool).slice(0, n), idx: 0, score: 0, answered: mode === 'atlas', mode: mode || 'all' };
      document.getElementById('scrMapQuiz').classList.add('active');
      document.getElementById('topbar').style.display = 'none';
      document.getElementById('bnav').style.display = 'none';
      buildWorldMap();
      if (mode === 'atlas') {
        document.getElementById('mapQuestion').textContent = `📖 Mode Atlas — explore le globe librement !`;
        document.getElementById('mapFeedback').textContent = `Survole et clique sur les pays pour les découvrir.`;
        document.getElementById('mapFeedback').className = 'map-feedback';
        document.getElementById('mapNextBtn').style.display = 'none';
        document.getElementById('mapQCurr').textContent = '∞';
        document.getElementById('mapQTot').textContent = '∞';
      } else {
        // Attend que le globe soit initialisé avant de lancer la première question
        const waitGlobe = () => GLOBE ? renderMapQuestion() : setTimeout(waitGlobe, 100);
        setTimeout(waitGlobe, 100);
      }
    }

    // ============================================================
    // 🌍 1. LE MOTEUR 3D — Globe.gl (Three.js sous le capot)
    // ============================================================

    // Calcule le centroïde d'un polygone GeoJSON (top-level, réutilisable)
    function polygonCentroid(geometry) {
      if (!geometry) return null;
      let coords = [];
      if (geometry.type === 'Polygon') {
        coords = geometry.coordinates[0];
      } else if (geometry.type === 'MultiPolygon') {
        let biggest = [];
        geometry.coordinates.forEach(poly => { if (poly[0].length > biggest.length) biggest = poly[0]; });
        coords = biggest;
      }
      if (!coords || !coords.length) return null;
      let latSum = 0, lngSum = 0;
      coords.forEach(([lng, lat]) => { latSum += lat; lngSum += lng; });
      return { lat: latSum / coords.length, lng: lngSum / coords.length };
    }

    // ===== CHARGEMENT PARESSEUX DE GLOBE.GL =====
    // La librairie (~1,9 Mo) ne sert qu'au mode Carte : elle est injectée au
    // premier affichage du globe au lieu de bloquer le démarrage de l'app.
    let _globeLibPromise = null;
    function loadGlobeLib() {
      if (window.Globe) return Promise.resolve();
      if (!_globeLibPromise) {
        _globeLibPromise = new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'js/vendor/globe.gl.min.js';
          s.onload = resolve;
          s.onerror = () => { _globeLibPromise = null; reject(new Error('globe.gl indisponible')); };
          document.head.appendChild(s);
        });
      }
      return _globeLibPromise;
    }

    function buildWorldMap() {
      const el = document.getElementById('globeViz');
      // Détruit l'ancienne instance pour éviter fuites mémoire + double handlers
      if (GLOBE) {
        try { GLOBE._destructor && GLOBE._destructor(); } catch (_) { }
        GLOBE = null;
      }
      el.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:rgba(255,255,255,.7);font-weight:800;font-size:14px">🌍 Chargement du globe…</div>';
      GLOBE_COUNTRIES = [];
      loadGlobeLib()
        .then(() => { el.innerHTML = ''; setTimeout(() => initGlobe(el), 50); })
        .catch(() => {
          el.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:rgba(255,255,255,.7);font-weight:800;font-size:13px;text-align:center;padding:24px">⚠️ Globe indisponible (hors-ligne au premier chargement).<br>Reconnecte-toi une fois pour l\'activer.</div>';
        });
    }

    let GLOBE_MODE = 'quiz'; // 'quiz' | 'heatmap' | 'tour'

    // Calcule la couleur heatmap d'un pays selon les bonnes réponses du joueur
    function getHeatmapColor(countryName) {
      if (!countryName) return 'rgba(45,90,61,0.35)';
      const name = countryName.toLowerCase();
      // Cherche dans les catStats si le joueur a des stats pour ce pays
      // On scanne les clés de catStats et on regarde si une question geo correspond
      const geoStat = P.catStats['geo'];
      if (!geoStat || geoStat.total === 0) return 'rgba(45,90,61,0.35)';
      const allQ = window.GEO_QB || [];
      const matching = allQ.filter(q => q.question && q.question.toLowerCase().includes(name));
      if (matching.length === 0) return 'rgba(45,90,61,0.35)';
      // Estime le ratio de réussite sur ce pays à partir du ratio global geo
      const ratio = geoStat.correct / geoStat.total;
      if (ratio >= 0.75) return 'rgba(34,197,94,0.7)';   // 🟢 Maîtrisé
      if (ratio >= 0.5) return 'rgba(250,204,21,0.6)';  // 🟡 En progression
      return 'rgba(251,146,60,0.5)';                      // 🟠 À travailler
    }

    function initGlobe(el) {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight - 220;

      GLOBE = Globe()
        (el)
        // 🎨 Graphismes : texture de la Terre + fond étoilé
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
        .width(w)
        .height(h)

        // 🗺️ Les pays (GeoJSON) — affichés en polygones colorés sur la sphère
        .polygonAltitude(0.01)
        .polygonSideColor(() => 'rgba(0,0,0,0)')
        .polygonStrokeColor(() => '#7dd3fc')
        .polygonCapColor(d => {
          if (GLOBE_MODE === 'heatmap') {
            const name = d.properties?.NAME || d.properties?.name || '';
            return getHeatmapColor(name);
          }
          // Rallye du Monde : pays conquis / perdus
          if (GLOBE_MODE === 'rallye' && d.__rallyeWon) return 'rgba(88,204,2,0.75)';
          if (GLOBE_MODE === 'rallye' && d.__rallyeLost) return 'rgba(239,68,68,0.45)';
          // Pays cliqué correct → vert
          if (d.__guessed && d.__correct) return 'rgba(34,197,94,0.75)';
          // Pays cliqué incorrect → rouge
          if (d.__guessed && !d.__correct) return 'rgba(239,68,68,0.8)';
          // Bon pays révélé après mauvaise réponse → jaune vif
          if (d.__hint && !d.__guessed) return 'rgba(250,204,21,0.85)';
          // Continent surligné (indice) → jaune doux
          if (d.__hint) return 'rgba(250,204,21,0.5)';
          return 'rgba(45,90,61,0.55)';
        })

        // 📌 Les villes/repères placés par le joueur (htmlElementsData)
        .htmlElementsData([])
        .htmlLat('lat')
        .htmlLng('lng')
        .htmlAltitude(0.02)
        .htmlElement(d => {
          const div = document.createElement('div');
          div.style.fontSize = d.size ? d.size + 'px' : '26px';
          div.style.transform = 'translate(-50%, -100%)';
          div.style.pointerEvents = 'none';
          div.textContent = d.emoji || '📍';
          return div;
        })

        // 🎯 Cercle de révélation autour de la bonne réponse
        .ringsData([])
        .ringLat('lat').ringLng('lng')
        .ringColor(d => () => d.color || 'rgba(34,197,94,0.6)')
        .ringMaxRadius(4)
        .ringPropagationSpeed(2)
        .ringRepeatPeriod(800);

      // 📦 2. Chargement des données : GeoJSON des frontières des pays
      fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
        .then(r => r.json())
        .then(geo => {
          GLOBE_COUNTRIES = geo.features;
          GLOBE.polygonsData(GLOBE_COUNTRIES);
        })
        .catch(() => { /* hors-ligne : on continue sans frontières détaillées */ });

      // ⚙️ Gestionnaire de clic sur un PAYS : vérifie la réponse à la question (modes pays)
      GLOBE.onPolygonClick(feat => {
        if (MAP_Q.mode === 'atlas') {
          feat.__guessed = true; feat.__correct = true;
          GLOBE.polygonsData([...GLOBE_COUNTRIES]);
          setTimeout(() => { feat.__guessed = false; GLOBE.polygonsData([...GLOBE_COUNTRIES]); }, 600);
          return;
        }
        // 🔒 Verrou IMMÉDIAT — première ligne, bloque tout double-clic
        if (MAP_Q.answered || !MAP_Q.questions || MAP_Q.idx >= MAP_Q.questions.length) return;
        if (MAP_Q.mode === 'villes' || MAP_Q.mode === 'heatmap' || MAP_Q.mode === 'tour' || MAP_Q.mode === 'rallye') return;
        MAP_Q.answered = true;

        const q = MAP_Q.questions[MAP_Q.idx];
        const clickedName = feat.properties?.NAME || feat.properties?.name || '';
        const correct = countryMatches(q.name, clickedName);

        // Réinitialise tous les flags visuels
        GLOBE_COUNTRIES.forEach(f => { f.__hint = false; f.__guessed = false; f.__correct = false; });

        // Pays cliqué : vert si correct, rouge si mauvais
        feat.__guessed = true;
        feat.__correct = correct;

        // Bon pays affiché en jaune si mauvaise réponse
        if (!correct) {
          GLOBE_COUNTRIES.forEach(f => {
            const n = f.properties?.NAME || f.properties?.name || '';
            if (countryMatches(q.name, n)) f.__hint = true;
          });
        }

        GLOBE.polygonsData([...GLOBE_COUNTRIES]);

        const centroid = polygonCentroid(feat.geometry);
        const km = correct ? 0 : centroid
          ? Math.round(haversineKm(centroid.lat, centroid.lng, q.lat, q.lng))
          : 9999;
        handleMapGuess(centroid?.lat ?? q.lat, centroid?.lng ?? q.lng, km, correct);
      });

      // ⚙️ Gestionnaire de clic sur le GLOBE (océan ou repère libre)
      GLOBE.onGlobeClick(({ lat, lng }) => {
        if (MAP_Q.mode === 'atlas') { placeCity(lat, lng); return; }
        // 🔒 Verrou identique
        if (MAP_Q.answered || !MAP_Q.questions || MAP_Q.idx >= MAP_Q.questions.length) return;
        if (MAP_Q.mode === 'villes' || MAP_Q.mode === 'heatmap' || MAP_Q.mode === 'tour' || MAP_Q.mode === 'rallye') return;
        MAP_Q.answered = true;

        const q = MAP_Q.questions[MAP_Q.idx];
        const km = Math.round(haversineKm(lat, lng, q.lat, q.lng));
        const correct = km < 80;

        GLOBE_COUNTRIES.forEach(f => { f.__hint = false; f.__guessed = false; });
        GLOBE_COUNTRIES.forEach(f => {
          const n = f.properties?.NAME || f.properties?.name || '';
          if (countryMatches(q.name, n)) f.__hint = true;
        });
        GLOBE.polygonsData([...GLOBE_COUNTRIES]);

        handleMapGuess(lat, lng, km, correct);
      });

      window.addEventListener('resize', () => {
        if (!GLOBE) return;
        GLOBE.width(el.clientWidth || window.innerWidth).height(el.clientHeight || window.innerHeight - 220);
      });
    }

    // 🏙️ Ajoute une ville dans la base de données du joueur + rafraîchit l'affichage
    function placeCity(lat, lng) {
      const ville = { name: `Ville #${MAP_VILLES.length + 1}`, lat, lng, owner: 'Joueur 1', emoji: '🏙️', size: 22 };
      MAP_VILLES.push(ville);
      refreshMapMarkers();
    }

    // 🔁 La mise à jour : redessine tous les marqueurs (pin du joueur + cible + villes)
    function refreshMapMarkers(extra = []) {
      GLOBE.htmlElementsData([...MAP_VILLES, ...extra]);
    }

    // ===== CHRONO CARTE =====
    let _mapChrono = null;
    let _mapChronoSec = 20;

    function startMapChrono() {
      clearInterval(_mapChrono);
      _mapChronoSec = 20;
      _updateChronoUI();
      _mapChrono = setInterval(() => {
        _mapChronoSec--;
        _updateChronoUI();
        if (_mapChronoSec <= 0) {
          clearInterval(_mapChrono);
          if (!MAP_Q.answered) {
            MAP_Q.answered = true;
            // Affiche le bon pays en jaune avant le feedback
            if (GLOBE_COUNTRIES.length && MAP_Q.questions?.[MAP_Q.idx]) {
              const qName = MAP_Q.questions[MAP_Q.idx].name;
              GLOBE_COUNTRIES.forEach(f => {
                const n = f.properties?.NAME || f.properties?.name || '';
                f.__hint = countryMatches(qName, n);
              });
              GLOBE.polygonsData([...GLOBE_COUNTRIES]);
            }
            handleMapGuess(null, null, 99999, false, true);
          }
        }
      }, 1000);
    }

    function stopMapChrono() {
      clearInterval(_mapChrono);
      _mapChrono = null;
    }

    function _updateChronoUI() {
      const el = document.getElementById('mapChronoVal');
      const mult = document.getElementById('mapChronoMult');
      if (!el) return;
      el.textContent = _mapChronoSec;
      const m = _getChronoMultiplier();
      if (mult) {
        mult.textContent = `×${m.toFixed(1)}`;
        mult.style.color = m >= 1.5 ? 'var(--green)' : m >= 1.0 ? 'var(--gold)' : 'var(--red)';
      }
      el.style.color = _mapChronoSec <= 5 ? 'var(--red)' : _mapChronoSec <= 10 ? 'var(--orange)' : 'var(--gold)';
      const wrap = document.getElementById('mapChronoWrap');
      if (wrap) wrap.classList.toggle('chrono-urgent', _mapChronoSec <= 5);
    }

    function _getChronoMultiplier() {
      // 20s → ×2.0 | 10s → ×1.0 | 0s → ×0.5 (linéaire)
      return Math.max(0.5, 0.5 + (_mapChronoSec / 20) * 1.5);
    }

    // ✅ Traite une réponse — appelée APRÈS que MAP_Q.answered = true a été posé par le caller
    function handleMapGuess(guessLat, guessLng, km, isGood, timeout = false) {
      stopMapChrono();
      const q = MAP_Q.questions[MAP_Q.idx];
      if (!q) return;

      // Calcul du score avec multiplicateur chrono
      let pts = 0;
      if (!timeout) {
        const base = isGood ? 1000 : Math.max(0, Math.round(1000 * Math.max(0, 1 - km / 3000)));
        pts = Math.round(base * _getChronoMultiplier());
      }
      MAP_Q.score += pts;

      // Marqueurs visuels
      if (guessLat != null) {
        refreshMapMarkers([
          { lat: guessLat, lng: guessLng, emoji: isGood ? '✅' : '❌', size: 26 },
          { lat: q.lat, lng: q.lng, emoji: '🎯', size: 26 }
        ]);
      } else {
        refreshMapMarkers([{ lat: q.lat, lng: q.lng, emoji: '🎯', size: 26 }]);
      }
      GLOBE.ringsData([{ lat: q.lat, lng: q.lng, color: 'rgba(250,204,21,0.8)' }]);
      // Feedback texte
      const fb = document.getElementById('mapFeedback');
      if (timeout) {
        fb.className = 'map-feedback wrong';
        fb.textContent = `⏰ Temps écoulé ! C'était ${q.name} — 0 pt`;
      } else if (isGood) {
        fb.className = 'map-feedback correct';
        fb.textContent = `🎯 Bravo ! +${pts} pts`;
      } else {
        fb.className = 'map-feedback wrong';
        fb.textContent = km < 500
          ? `🟡 Presque (${km} km) ! C'était ${q.name} · +${pts} pts`
          : `❌ C'était ${q.name} · +${pts} pts (${km} km)`;
      }

      document.getElementById('mapTotalScore').textContent = MAP_Q.score.toLocaleString();
      document.getElementById('mapNextBtn').style.display = '';
      ['hintCont', 'hintLetter', 'hintRadar'].forEach(id => {
        const b = document.getElementById(id);
        if (b) { b.disabled = true; b.style.opacity = '0.4'; }
      });
      updateMissionProgress('mapquiz', 1);
    }

    function renderMapQuestion() {
      if (MAP_Q.idx >= MAP_Q.questions.length) { endMapQuiz(); return; }
      const q = MAP_Q.questions[MAP_Q.idx];
      document.getElementById('mapQuestion').textContent = q.isCity
        ? `📍 Où se trouve la ville de : ${q.name} ?`
        : `📍 Où se trouve : ${q.name} ?`;
      document.getElementById('mapQCurr').textContent = MAP_Q.idx + 1;
      document.getElementById('mapQTot').textContent = MAP_Q.questions.length;
      document.getElementById('mapFeedback').textContent = `💡 ${q.hint}`;
      document.getElementById('mapFeedback').className = 'map-feedback';
      document.getElementById('mapNextBtn').style.display = 'none';
      // Réactive les boutons d'indice
      ['hintCont', 'hintLetter', 'hintRadar'].forEach(id => {
        const b = document.getElementById(id);
        if (b) { b.disabled = false; b.style.opacity = '1'; }
      });
      if (GLOBE) {
        GLOBE.ringsData([]);
        if (GLOBE_COUNTRIES.length) {
          GLOBE_COUNTRIES.forEach(f => { f.__hint = false; f.__guessed = false; f.__correct = false; });
          GLOBE.polygonsData([...GLOBE_COUNTRIES]);
        }
        refreshMapMarkers();
      }
      MAP_Q.answered = false;
      startMapChrono();
    }

    // ============================================================
    // 💎 Boutique d'indices — 5 gems chacun
    // ============================================================
    function mapHint(type) {
      if (MAP_Q.mode === 'atlas' || MAP_Q.answered) return;
      const q = MAP_Q.questions[MAP_Q.idx];
      const cost = 5;
      if (P.gems < cost) { showToast('💎 Pas assez de gemmes ! (5 💎 requis)'); return; }
      P.gems -= cost;
      save();
      document.getElementById('valGems').textContent = P.gems;
      const fb = document.getElementById('mapFeedback');

      if (type === 'letter') {
        fb.textContent = `🔤 Ça commence par : "${q.name.charAt(0).toUpperCase()}" · (Lettre utilisée, −5💎)`;
        return;
      }

      if (type === 'continent') {
        const cont = q.cont || continentFromHint(q.hint);
        if (!GLOBE_COUNTRIES.length) { showToast('🌍 Carte en cours de chargement…'); P.gems += cost; save(); return; }
        GLOBE_COUNTRIES.forEach(f => {
          const c = f.properties?.CONTINENT === 'Seven seas (open ocean)' ? null : f.properties?.CONTINENT;
          const fc = (c === 'North America' || c === 'South America') ? 'Amérique'
            : c === 'Europe' ? 'Europe' : c === 'Africa' ? 'Afrique'
              : c === 'Asia' ? 'Asie' : (c === 'Oceania' ? 'Océanie' : null);
          f.__hint = (fc === cont);
        });
        GLOBE.polygonsData([...GLOBE_COUNTRIES]);
        fb.textContent = `🌍 Zone surlignée en jaune : ${cont} (−5💎)`;
        // Zoom sur le continent
        const contCoords = { Europe: [50, 15, 2.5], Afrique: [5, 20, 2.5], Asie: [35, 90, 2.5], Amérique: [10, -70, 2.5], Océanie: [-25, 140, 2.5], Monde: [0, 0, 2.5] };
        const cc = contCoords[cont] || contCoords.Monde;
        GLOBE.pointOfView({ lat: cc[0], lng: cc[1], altitude: cc[2] }, 1200);
        return;
      }

      if (type === 'radar') {
        GLOBE.ringsData([{ lat: q.lat, lng: q.lng, color: 'rgba(250,204,21,0.8)' }]);
        GLOBE.pointOfView({ lat: q.lat, lng: q.lng, altitude: 2.4 }, 1200);
        fb.textContent = `📡 Zone révélée sur le globe (−5💎) — cherche dans ce secteur !`;
      }
    }

    function mapNextQuestion() {
      if (MAP_Q.mode === 'tour') { tourNextEtape(); return; }
      MAP_Q.idx++;
      renderMapQuestion();
    }

    function endMapQuiz() {
      const score = MAP_Q.score;
      const total = MAP_Q.questions?.length || 0;
      const maxScore = total * 2000; // max théorique avec ×2 chrono
      const pct = total > 0 ? Math.round((score / (total * 1000)) * 100) : 0;
      const gemsEarned = Math.max(0, Math.round(score / 200));
      P.gems += gemsEarned;
      P.xp += Math.round(score / 100);
      save();
      exitMapQuiz();
      setTimeout(() => {
        showBonusPopup('🗺️', 'Carte Interactive !',
          `Score : ${score.toLocaleString()} pts`,
          [`🏆 ${pct}% de précision`, `💎 +${gemsEarned} Gemmes`, `⭐ +${Math.round(score / 100)} XP`]);
      }, 300);
    }

    function exitMapQuiz() {
      stopMapChrono();
      document.getElementById('scrMapQuiz').classList.remove('active');
      document.getElementById('topbar').style.display = 'flex';
      document.getElementById('bnav').style.display = 'flex';
      GLOBE_MODE = 'quiz';
    }

    // ===== ENHANCED ATLAS ANIMATION =====
    function triggerAtlasUnlockAnimation(cardId) {
      // Animate any visible atlas card that just got unlocked
      setTimeout(() => {
        const allEls = document.querySelectorAll('.atlas-card');
        allEls.forEach(el => {
          if (el.classList.contains('unlocked') && !el.classList.contains('just-unlocked')) {
            // Check if this card was just added
            const name = el.querySelector('.atlas-name');
            if (name) {
              const allCards = Object.values(window.ATLAS_CARDS || {}).flat();
              const card = allCards.find(c => c.id === cardId);
              if (card && name.textContent === card.name) {
                el.classList.add('just-unlocked');
                const shine = document.createElement('div'); shine.className = 'atlas-shine';
                el.appendChild(shine);
                const badge = document.createElement('div'); badge.className = 'atlas-new-badge'; badge.textContent = 'NEW';
                el.appendChild(badge);
                setTimeout(() => { shine.remove(); }, 900);
              }
            }
          }
        });
      }, 100);
    }

    // ===== INIT ONBOARD =====
    function initOnboard() {
      const g = document.getElementById('obAvGrid');
      AVATARS.forEach((av, i) => { const d = document.createElement('div'); d.className = 'av-opt' + (i === 0 ? ' sel' : ''); d.textContent = av; d.onclick = () => { document.querySelectorAll('.av-opt').forEach(x => x.classList.remove('sel')); d.classList.add('sel'); P.avatar = av; }; g.appendChild(d); });
    }

    function finishOnboard() {
      const n = document.getElementById('obName').value.trim();
      if (!n) { showToast('Saisis un pseudo !'); return; }

      P.name = n;
      P.lastPlayDate = new Date().toISOString().split('T')[0];

      // Génération d'un identifiant vraiment unique pour le joueur
      P.idUnique = (crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2)));

      save();
      synchroniserJoueur(P.idUnique, P.name, P.avatar);
      _appStarted = true; // évite le double démarrage quand kq:data-loaded arrive
      startApp();
    }

    function startApp() {
      const now = Date.now();
      if (P.hearts < 5) { const h = Math.floor((now - P.lastHeartTime) / 3600000); if (h > 0) { P.hearts = Math.min(5, P.hearts + h); P.lastHeartTime = now; } }
      document.getElementById('scrOnboard').classList.remove('active');
      document.getElementById('topbar').style.display = 'flex'; document.getElementById('bnav').style.display = 'flex';
      _shopBuilt = false;
      applyDarkMode(P.darkMode);
      updateRemindersHint();
      recordPlayHour();
      updateUI(); buildRoad(); switchTab('Home');
      updateDailyChallengeUI();
      initWeeklyMissions();
      updateMissionsSummary();
      startHeartRegen();
      maybeShowLocalReminder();
      // Compagnon vivant + tutoriel : initialisés à chaque retour au menu
      // (idempotents), visibilité recalculée selon l'écran actif.
      renderCompanionModeBtns();
      updateCompanionVisibility();
      Companion.onAppStart();
      renderSrsCard();
      Tutorial.maybeStart();
      // startApp est rappelée à chaque retour au menu : on ne crée l'intervalle
      // de rappel qu'une seule fois, sinon ils s'accumulent.
      if (!startApp._reminderTimer) startApp._reminderTimer = setInterval(maybeShowLocalReminder, 15 * 60000);
      const splash = document.getElementById('bootSplash'); if (splash) splash.remove();
    }
    // ===== CACHE INDEXEDDB — FILE D'ATTENTE HORS-LIGNE =====
    const API_BASE = 'https://knowquest-api.onrender.com/api';
    let _idb = null;

    function openIDB() {
      if (_idb) return Promise.resolve(_idb);
      return new Promise((resolve, reject) => {
        const req = indexedDB.open('knowquest_offline', 1);
        req.onupgradeneeded = e => {
          e.target.result.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
        };
        req.onsuccess = e => { _idb = e.target.result; resolve(_idb); };
        req.onerror = () => reject(req.error);
      });
    }

    async function enqueueRequest(endpoint, body) {
      try {
        const db = await openIDB();
        const tx = db.transaction('queue', 'readwrite');
        tx.objectStore('queue').add({ endpoint, body, ts: Date.now() });
      } catch (e) { console.warn('IDB enqueue error:', e); }
    }

    async function flushOfflineQueue() {
      if (!navigator.onLine) return;
      try {
        const db = await openIDB();
        const tx = db.transaction('queue', 'readwrite');
        const store = tx.objectStore('queue');
        const all = await new Promise(r => { const req = store.getAll(); req.onsuccess = () => r(req.result); });
        if (!all.length) return;
        console.log(`[offline queue] ${all.length} requête(s) en attente — envoi…`);
        for (const item of all) {
          try {
            const res = await fetch(`${API_BASE}${item.endpoint}`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.body)
            });
            if (res.ok) store.delete(item.id);
          } catch (_) { /* on réessaiera au prochain online */ }
        }
        console.log('[offline queue] Flush terminé.');
      } catch (e) { console.warn('IDB flush error:', e); }
    }

    // Rejoue la queue dès que le réseau revient
    window.addEventListener('online', () => {
      showToast('📶 Connexion rétablie — synchronisation en cours…');
      flushOfflineQueue();
    });

    async function apiFetch(endpoint, body) {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn(`[offline] ${endpoint} mis en file d'attente.`, err);
        await enqueueRequest(endpoint, body);
        return null;
      }
    }

    function synchroniserJoueur(idUnique, pseudo, avatarChoisi) {
      apiFetch('/player', { id: idUnique, name: pseudo, avatar: avatarChoisi })
        .then(data => { if (data) console.log('Joueur connecté à la base :', data); });
    }

    function enregistrerReponse(donneesPartie) {
      apiFetch('/answer', {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        player_id: donneesPartie.idJoueur,
        question_id: donneesPartie.idQuestion,
        question_text: donneesPartie.texteQuestion,
        category: donneesPartie.categorie,
        answer_given: donneesPartie.reponseDonnee,
        correct_answer: donneesPartie.reponseCorrecte,
        is_correct: donneesPartie.estCorrect ? 1 : 0,
        time_taken_ms: donneesPartie.tempsMisMs
      }).then(data => { if (data) console.log('Donnée enregistrée !'); });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // KnowQuest — Patch Collecte de Données v2 (intégré automatiquement)
    // ═══════════════════════════════════════════════════════════════════════════

    // ── 1. Variables de tracking ──────────────────────────────────────────────────
    let _currentPowerupUsed = null;
    let _sessionId = null;
    let _sessionStartTime = null;
    let _questionStartTime = null;
    let _positionInSession = 0;
    let _currentSource = 'normal';

    // ── 2. Génère un ID de session au lancement de chaque partie ─────────────────
    function startSession(source) {
      _sessionId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      _sessionStartTime = Date.now();
      _positionInSession = 0;
      _currentPowerupUsed = null;
      _currentSource = source || 'normal';
      console.log('[Collecte] Session démarrée :', _sessionId, '| source:', _currentSource);
    }

    function startQuestionTimer() {
      _questionStartTime = Date.now();
      _currentPowerupUsed = null;
      _positionInSession++;
    }

    // ── 3. Patch usePowerup ───────────────────────────────────────────────────────
    const _originalUsePowerup = typeof usePowerup === 'function' ? usePowerup : null;
    usePowerup = function (type) {
      _currentPowerupUsed = type;
      console.log('[Collecte] Powerup utilisé :', type, '| question pos:', _positionInSession);
      if (_originalUsePowerup) _originalUsePowerup(type);
    };

    // ── 4. Patch enregistrerReponse ───────────────────────────────────────────────
    const _originalEnregistrerReponse = enregistrerReponse;
    enregistrerReponse = function (donneesPartie) {
      const timeMsCalculé = donneesPartie.tempsMisMs
        || (_questionStartTime ? Date.now() - _questionStartTime : null);
      const donneesEnrichies = Object.assign({}, donneesPartie, {
        tempsMisMs: timeMsCalculé,
        source: _currentSource || 'normal',
        hint_used: _currentPowerupUsed || null,
        position_in_session: _positionInSession,
        session_id: _sessionId,
      });
      _currentPowerupUsed = null;
      console.log('[Collecte] Réponse enrichie :', {
        question_id: donneesEnrichies.idQuestion,
        source: donneesEnrichies.source,
        hint_used: donneesEnrichies.hint_used,
        position_in_session: donneesEnrichies.position_in_session,
        time_ms: donneesEnrichies.tempsMisMs,
      });
      _originalEnregistrerReponse(donneesEnrichies); // ← pointe sur l'originale, pas sur elle-même
    };

    // ── 5. Patch apiFetch ─────────────────────────────────────────────────────────
    const _originalApiFetch = apiFetch;
    apiFetch = function (endpoint, body, opts) {
      if (endpoint === '/answer' && body) {
        body = Object.assign({}, body, {
          source: body.source || _currentSource || 'normal',
          hint_used: body.hint_used !== undefined ? body.hint_used : (_currentPowerupUsed || null),
          position_in_session: body.position_in_session || _positionInSession || null,
          session_id: body.session_id || _sessionId || null,
        });
      }
      return _originalApiFetch(endpoint, body, opts);
    };

    // ── 6. Patch renderGPActiveQuestion (mode GP) ─────────────────────────────────
    if (typeof renderGPActiveQuestion === 'function') {
      const _origRenderGP = renderGPActiveQuestion;
      window.renderGPActiveQuestion = function (...args) {
        startQuestionTimer();
        return _origRenderGP.apply(this, args);
      };
    }

    // ── 7. Debug console ──────────────────────────────────────────────────────────
    window._collecteDebug = () => ({
      sessionId: _sessionId,
      sessionDurationMs: _sessionStartTime ? Date.now() - _sessionStartTime : null,
      positionActuelle: _positionInSession,
      powerupActuel: _currentPowerupUsed,
      source: _currentSource,
    });

    // Flush au démarrage si on était hors-ligne avant
    flushOfflineQueue();

    initOnboard();
    // ===== AMORÇAGE =====
    // Un seul point de démarrage : data-ready.js lance startApp() quand les
    // données principales sont prêtes (kq:data-loaded), avec un délai de
    // secours de 3 s. Ici on ne fait que préparer l'écran d'attente.
    let _appStarted = false;
    if (loadData() && P.name) {
      document.getElementById('scrOnboard').classList.remove('active');
      const s = document.createElement('div');
      s.id = 'bootSplash';
      s.style.cssText = 'position:fixed;inset:0;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;z-index:1500';
      s.innerHTML = '<div style="font-size:52px">🦉</div><div style="font-size:22px;font-weight:900;color:var(--purple)">KnowQuest</div><div style="font-size:12px;font-weight:800;color:var(--muted)">Chargement des questions…</div>';
      document.body.appendChild(s);
    } else {
      document.getElementById('scrOnboard').classList.add('active');
      renderMascot('mascotOnboard', 'wave');
    }
    renderMascot('mascotNoHearts', 'sleepy');

    // ================================================================
    // P4 — LE MONDE VIVANT : événements saisonniers, boss légendaire
    // mensuel, thèmes de route et tenues de Chouette.
    // ================================================================

    // ── Calendrier des événements saisonniers ('MM-DD' → 'MM-DD', gère le passage d'année) ──
    const SEASONAL_EVENTS = [
      { id: 'saintval', ico: '💘', title: 'Saint-Valentin', sub: 'Le savoir fait battre le cœur — XP doublé sur Art & Cinéma !', from: '02-10', to: '02-16', cats: ['art', 'cinema'],
        qs: [
          { id: 'ev_sv1', cat: 'art', question: 'Qui a peint « Le Baiser » (1908), icône de la peinture romantique ?', choices: ['Gustav Klimt', 'Monet', 'Van Gogh', 'Renoir'], correctAnswer: 0, difficulty: 'easy', xp: 20, explanation: 'Gustav Klimt a peint Le Baiser pendant sa période dorée.', isEvent: true },
          { id: 'ev_sv2', cat: 'cinema', question: 'Quel film romantique se déroule à bord du Titanic ?', choices: ['Titanic', 'Pearl Harbor', 'The Notebook', 'Romeo + Juliet'], correctAnswer: 0, difficulty: 'easy', xp: 15, explanation: 'Titanic de James Cameron (1997).', isEvent: true },
        ] },
      { id: 'printemps', ico: '🌱', title: 'Printemps des Savoirs', sub: 'La nature s\'éveille — XP doublé sur les Sciences !', from: '03-20', to: '04-05', cats: ['sci'],
        qs: [
          { id: 'ev_pr1', cat: 'sci', question: 'Que dit la loi de Hook sur les ressorts ?', choices: ['F = k·x', 'E = mc²', 'PV = nRT', 'F = ma'], correctAnswer: 0, difficulty: 'medium', xp: 25, explanation: 'La force d\'un ressort est proportionnelle à son extension.', isEvent: true },
          { id: 'ev_pr2', cat: 'sci', question: 'Quel phénomène provoque les saisons sur Terre ?', choices: ['L\'inclinaison de l\'axe', 'La distance au Soleil', 'Les marées', 'Le champ magnétique'], correctAnswer: 0, difficulty: 'easy', xp: 15, explanation: 'L\'axe incliné de 23,5° répartit différemment l\'énergie solaire.', isEvent: true },
        ] },
      { id: 'ete', ico: '🏖️', title: 'Grand Jeu d\'Été', sub: 'Questions sport & géo — XP doublé pendant tout l\'été !', from: '07-01', to: '08-31', cats: ['sport', 'geo'],
        qs: [
          { id: 'ev_jo1', cat: 'geo', question: "Dans quelle ville se sont déroulés les JO d'été 2024 ?", choices: ["Los Angeles", "Tokyo", "Paris", "London"], correctAnswer: 2, difficulty: 'easy', xp: 20, explanation: "Les JO d'été 2024 se sont déroulés à Paris.", isEvent: true },
          { id: 'ev_jo2', cat: 'sport', question: "Quelle discipline n'est PAS aux JO d'été ?", choices: ['Skateboard', 'Surf', 'Ski alpin', 'Breaking'], correctAnswer: 2, difficulty: 'medium', xp: 25, explanation: "Le ski alpin est une discipline des JO d'hiver.", isEvent: true },
        ] },
      { id: 'rentree', ico: '🎒', title: 'Rentrée des Classes', sub: 'La culture reprend du service — XP doublé sur Sciences & Histoire !', from: '09-01', to: '09-30', cats: ['sci', 'hist'],
        qs: [
          { id: 'ev_rt1', cat: 'hist', question: 'Quelle célèbre institution française a été créée en 1795 pour regrouper les savants ?', choices: ['L\'Académie française', 'Le Muséum national d\'Histoire naturelle', 'L\'École polytechnique', 'La Sorbonne'], correctAnswer: 1, difficulty: 'medium', xp: 25, explanation: 'Le Muséum national d\'Histoire naturelle a été fondé en 1793-1795 pendant la Révolution.', isEvent: true },
          { id: 'ev_rt2', cat: 'sci', question: 'Quel scientifique a donné son nom au système métrique décimal adopté en France à la Révolution ?', choices: ['Lavoisier', 'Newton', 'Galilée', 'Descartes'], correctAnswer: 0, difficulty: 'medium', xp: 25, explanation: 'Lavoisier et ses successeurs ont imposé le système métrique.', isEvent: true },
        ] },
      { id: 'halloween', ico: '🎃', title: 'Halloween', sub: 'Questions frissons sur la Mythologie & le Cinéma — si tu oses…', from: '10-15', to: '11-03', cats: ['mytho', 'cinema'],
        qs: [
          { id: 'ev_hw1', cat: 'mytho', question: 'Qui est le dieu grec du monde souterrain ?', choices: ['Hadès', 'Poséidon', 'Hermès', 'Arès'], correctAnswer: 0, difficulty: 'easy', xp: 20, explanation: 'Hadès règne sur les Enfers avec Cerbère.', isEvent: true },
          { id: 'ev_hw2', cat: 'cinema', question: 'Quel réalisateur est surnommé le « maître du suspense » ?', choices: ['Alfred Hitchcock', 'Tim Burton', 'John Carpenter', 'Steven Spielberg'], correctAnswer: 0, difficulty: 'easy', xp: 20, explanation: 'Hitchcock, de Psychose aux Oiseaux.', isEvent: true },
        ] },
      { id: 'noel', ico: '🎄', title: 'Noël Culturel', sub: 'Traditions & merveilles — XP doublé sur Histoire & Gastronomie !', from: '12-10', to: '12-25', cats: ['hist', 'gastro'],
        qs: [
          { id: 'ev_no1', cat: 'gastro', question: 'Quelle bûche de Noël est la plus traditionnelle en France ?', choices: ['La bûche au chocolat', 'La bûche roulée à la confiture', 'La bûche glacée', 'La bûche au café'], correctAnswer: 1, difficulty: 'medium', xp: 25, explanation: 'La bûche roulée, héritière de la bûche de bois brûlée au feu.', isEvent: true },
          { id: 'ev_no2', cat: 'hist', question: 'Quel roi de France a fêté un « Noël de l\'an mil » légendaire ?', choices: ['Hugues Capet', 'Robert le Pieux', 'Charlemagne', 'Louis IX'], correctAnswer: 1, difficulty: 'hard', xp: 30, explanation: 'Robert le Pieux est associé aux récits de l\'an mil.', isEvent: true },
        ] },
      { id: 'nouvelan', ico: '🎆', title: 'Nouvelle Année', sub: '100 questions ce mois-ci pour un boost de gemmes !', from: '12-26', to: '01-08', cats: ['geo', 'mixed'],
        qs: [
          { id: 'ev_na1', cat: 'geo', question: 'Dans quel pays les premières aurores du nouvel an apparaissent-elles ?', choices: ['Kiribati', 'Australie', 'Japon', 'France'], correctAnswer: 0, difficulty: 'medium', xp: 25, explanation: 'L\'île de Kiritimati (Kiribati) voit le premier lever de soleil de l\'année.', isEvent: true },
        ] },
    ];

    function getActiveEvent() {
      const md = todayStr().slice(5); // 'MM-DD'
      return SEASONAL_EVENTS.find(e => e.from <= e.to ? (md >= e.from && md <= e.to) : (md >= e.from || md <= e.to)) || null;
    }

    function buildEventBanner() {
      const div = document.getElementById('eventBannerContainer');
      if (!div) return;
      const ev = getActiveEvent();
      div.innerHTML = ev ? `<div class="event-banner" style="cursor:pointer" onclick="startMode('cat_seasonal')" title="Lancer l'événement !"><div class="event-banner-ico">${ev.ico}</div><div class="event-banner-text"><div class="event-banner-title">${ev.title} — Questions spéciales !</div><div class="event-banner-sub">${ev.sub} — <b>touche pour jouer</b> ✨</div></div></div>` : '';
    }

    // ── Boss Légendaire mensuel : 3 phases, power-ups interdits, récompense exclusive ──
    const LEGEND_BOSS_ROTATION = [
      { ico: '🐉', name: 'Dracosage l\'Immortel' },
      { ico: '👑', name: 'Roi Déchu des Savoirs' },
      { ico: '🐙', name: 'Kraken des Connaissances' },
    ];
    let _legendBoss = null;

    function currentMonthKey() { return todayStr().slice(0, 7); }
    function legendBossForMonth() { return LEGEND_BOSS_ROTATION[new Date().getMonth() % LEGEND_BOSS_ROTATION.length]; }
    function initLegendBoss() {
      const k = currentMonthKey();
      if (!P.legendBoss || P.legendBoss.month !== k) P.legendBoss = { month: k, defeated: false };
    }

    function renderLegendBossCard() {
      const el = document.getElementById('legendBossCard');
      if (!el) return;
      initLegendBoss();
      const b = legendBossForMonth();
      const d = new Date();
      const daysLeft = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate();
      el.innerHTML = P.legendBoss.defeated
        ? `<div class="lb-card defeated"><div class="lb-ico">👑</div><div class="lb-info"><div class="lb-title">${b.name} est tombé !</div><div class="lb-sub">Prochain boss légendaire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''} — prépare-toi.</div></div></div>`
        : `<div class="lb-card" onclick="openLegendBoss()"><div class="lb-ico">${b.ico}</div><div class="lb-info"><div class="lb-title">Boss Légendaire du Mois</div><div class="lb-sub">${b.name} — 3 phases, sans power-ups. Récompense exclusive 👑</div></div><div style="font-size:22px;color:var(--gold)">⚔️</div></div>`;
    }

    function openLegendBoss() {
      initLegendBoss();
      if (P.legendBoss.defeated) { showToast('Ce boss est vaincu ! Le prochain arrive le mois prochain 📅'); return; }
      _legendBoss = legendBossForMonth();
      document.getElementById('bossIco').textContent = _legendBoss.ico;
      document.getElementById('bossTitle').textContent = `Boss Légendaire : ${_legendBoss.name}`;
      document.getElementById('bossSub').textContent = 'Le combat le plus dur du jeu — réservé aux braves.';
      const rulesEl = document.querySelector('#bossModal .boss-warning + div');
      if (rulesEl) rulesEl.innerHTML = `<div style="font-size:12px;color:#ffd700;font-weight:900;margin-bottom:6px">⚔️ ${_legendBoss.name}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);font-weight:700;line-height:1.6">• 15 HP à infliger en 15 questions — chaque bonne réponse touche<br>• Phase 1 facile → Phase 2 moyenne → Phase 3 difficile<br>• ⛔ Power-ups interdits · ⏱️ 15 s par question · 3 vies</div>`;
      document.getElementById('bossHPFill').style.width = '100%';
      document.getElementById('bossHPVal').textContent = '15';
      const hpMax = document.getElementById('bossHPMax');
      if (hpMax) hpMax.textContent = '15';
      const rewardEl = document.getElementById('bossRewardDesc');
      if (rewardEl) rewardEl.textContent = '+300 XP · +150 💎 · 🏅 Titre exclusif';
      const btn = document.getElementById('bossFightBtn');
      btn.style.display = 'block';
      btn.onclick = startLegendBoss;
      document.getElementById('bossModal').classList.add('open');
    }

    function startLegendBoss() {
      document.getElementById('bossModal').classList.remove('open');
      const b = _legendBoss || legendBossForMonth();
      const allQ = [
        ...(window.GEO_QB || []), ...(window.HIST_QB || []), ...(window.SCI_QB || []),
        ...(window.ART_QB || []), ...(window.CINEMA_QB || []), ...(window.SPORT_QB || []),
        ...(window.GASTRO_QB || []), ...(window.MYTHO_QB || []),
        ...(window.CHATEAUX_QB || []), ...(window.LITT_QB || []), ...(window.EXTENDED_QB || []),
      ];
      const pick = (diff, n) => shuffle(allQ.filter(q => q.difficulty === diff)).slice(0, n);
      // Les phases émergent de l'ordre des questions : 5 faciles → 5 moyennes → 5 difficiles
      const pool = [...pick('easy', 5), ...pick('medium', 5), ...pick('hard', 5)];
      while (pool.length < 15) pool.push(...shuffle(getPool('mixed')).slice(0, 15 - pool.length));
      Q = {
        mode: 'boss', type: 'qcm', qs: pool, idx: 0, correct: 0, totalXP: 0,
        state: 'selecting', selectedIdx: null, combo: 0, userSel: [],
        retryQueue: [], newAtlasCards: 0, survieErrors: 0, survieScore: 0,
        duelPlayerHP: 3, duelAiHP: 15, duelAiDiff: 0, chain: null, chainIdx: 0, chainBroken: false,
        bossId: 'legend_' + currentMonthKey(), bossChIdx: 99, gemsEarned: 0,
        bossMaxHP: 15, bossPower: 'none', bossTimerSec: 15,
        bossIco: b.ico, bossName: b.name, legend: true,
      };
      launchQuizScreen();
    }

    // ── Thèmes de route & tenues de Chouette : la boutique de personnalisation ──
    const ROAD_THEMES = [
      { id: 'classic', ico: '🛤️', name: 'Classique', desc: 'Le parcours d\'origine', cost: 0 },
      { id: 'sakura', ico: '🌸', name: 'Sakura', desc: 'Pétales roses sur la route', cost: 120, bg: 'linear-gradient(160deg,#2b0a1c,#4a1030 55%,#2b0a1c)', c1: '#ff8fb3', c2: '#b25ce0', base: '#3a1029' },
      { id: 'ocean', ico: '🌊', name: 'Océan', desc: 'La route des profondeurs', cost: 120, bg: 'linear-gradient(160deg,#04182e,#062c4a 55%,#04182e)', c1: '#22d3ee', c2: '#1cb0f6', base: '#0a2740' },
      { id: 'neon', ico: '🌌', name: 'Néon', desc: 'La nuit électrique', cost: 180, bg: 'linear-gradient(160deg,#0d0d1a,#1a0a2e 55%,#0d0d1a)', c1: '#22ff88', c2: '#b429ff', base: '#1e1e2f' },
      { id: 'royal', ico: '👑', name: 'Or royal', desc: 'Pour les fins stratèges', cost: 250, bg: 'linear-gradient(160deg,#231a02,#3d2c05 55%,#231a02)', c1: '#ffd700', c2: '#ff9d00', base: '#403005' },
    ];
    const OWL_OUTFITS = [
      { id: 'none', ico: '', name: 'Nature', desc: 'Chouette, tout simplement', cost: 0 },
      { id: 'grad', ico: '🎓', name: 'Diplômée', desc: 'La sagesse incarnée', cost: 60 },
      { id: 'pirate', ico: '🏴‍☠️', name: 'Pirate', desc: 'Cap sur le trésor du savoir', cost: 80 },
      { id: 'santa', ico: '🎅', name: 'Père Noël', desc: 'Ho ho ho !', cost: 80, event: 'noel' },
      { id: 'wizard', ico: '🧙', name: 'Archimage', desc: 'Magie des connaissances', cost: 120 },
    ];

    function applyRoadTheme() {
      const home = document.getElementById('scrHome');
      if (!home) return;
      const t = ROAD_THEMES.find(x => x.id === (P.roadTheme || 'classic')) || ROAD_THEMES[0];
      const scr = home.querySelector('.scr');
      if (scr) scr.style.background = t.bg || 'var(--bg)';
      const root = document.documentElement.style;
      root.setProperty('--road-c1', t.c1 || 'var(--green)');
      root.setProperty('--road-c2', t.c2 || 'var(--purple)');
      root.setProperty('--road-base', t.base || '#e5e7eb');
    }

    function renderCosmeticsShop() {
      const activeEv = (getActiveEvent() || {}).id;
      const tDiv = document.getElementById('shopThemes');
      if (tDiv) {
        tDiv.innerHTML = ROAD_THEMES.map(t => {
          const owned = t.cost === 0 || (P.ownedRoadThemes || []).includes(t.id);
          const equipped = (P.roadTheme || 'classic') === t.id;
          return `<div class="shop-item"><div class="shop-info"><div class="shop-ico">${t.ico}</div><div class="shop-details"><div class="shop-name">${t.name}</div><div class="shop-desc">${t.desc}</div></div></div><button class="btn-buy" onclick="buyOrEquipRoadTheme('${t.id}')">${equipped ? '✓ Porté' : owned ? 'Équiper' : `💎 ${t.cost}`}</button></div>`;
        }).join('');
      }
      const oDiv = document.getElementById('shopOwl');
      if (oDiv) {
        oDiv.innerHTML = OWL_OUTFITS.filter(o => !o.event || o.event === activeEv).map(o => {
          const owned = o.cost === 0 || (P.ownedOwlHats || []).includes(o.id);
          const equipped = (P.owlHat || 'none') === o.id;
          return `<div class="shop-item"><div class="shop-info"><div class="shop-ico">${o.ico || '🦉'}</div><div class="shop-details"><div class="shop-name">${o.name}</div><div class="shop-desc">${o.desc}</div></div></div><button class="btn-buy" onclick="buyOrEquipOwlHat('${o.id}')">${equipped ? '✓ Portée' : owned ? 'Équiper' : `💎 ${o.cost}`}</button></div>`;
        }).join('');
      }
    }

    function buyOrEquipRoadTheme(id) {
      const t = ROAD_THEMES.find(x => x.id === id);
      if (!t) return;
      const owned = t.cost === 0 || (P.ownedRoadThemes || []).includes(id);
      if (!owned) {
        if (P.gems < t.cost) { showToast('Pas assez de gemmes ! 💎'); return; }
        P.gems -= t.cost;
        P.ownedRoadThemes.push(id);
        audio.playTreasure();
        showToast(`${t.ico} Thème « ${t.name} » acheté !`);
        Companion.say('Waouh, un nouveau décor ! J\'adore 🤩', { mood: 'happy', force: true, dur: 2600 });
      }
      P.roadTheme = id;
      save(); updateUI(); applyRoadTheme(); renderCosmeticsShop();
    }

    function applyOwlHat() {
      const ico = (OWL_OUTFITS.find(o => o.id === (P.owlHat || 'none')) || {}).ico || '';
      ['companionMascot', 'mascotQuiz'].forEach(id => {
        const w = document.getElementById(id);
        if (!w) return;
        let tag = w.querySelector('.owl-hat');
        if (!tag) { tag = document.createElement('div'); tag.className = 'owl-hat'; w.appendChild(tag); }
        tag.textContent = ico;
        tag.style.display = ico ? 'block' : 'none';
      });
    }

    function buyOrEquipOwlHat(id) {
      const o = OWL_OUTFITS.find(x => x.id === id);
      if (!o) return;
      const owned = o.cost === 0 || (P.ownedOwlHats || []).includes(id);
      if (!owned) {
        if (P.gems < o.cost) { showToast('Pas assez de gemmes ! 💎'); return; }
        P.gems -= o.cost;
        P.ownedOwlHats.push(id);
        audio.playTreasure();
        showToast(`${o.ico || '🦉'} Tenue « ${o.name} » achetée pour Chouette !`);
        Companion.say(`Regarde-moi avec ça ! ${o.ico}Merci !`, { mood: 'celebrate', force: true, dur: 3000 });
      }
      P.owlHat = id;
      save(); updateUI(); applyOwlHat(); renderCosmeticsShop();
    }

    let _ttsVoices = [];
    function loadTTSVoices() { _ttsVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
    if ('speechSynthesis' in window) { loadTTSVoices(); window.speechSynthesis.onvoiceschanged = loadTTSVoices; }
    function pickFrenchVoice() {
      if (!_ttsVoices.length) loadTTSVoices();
      return _ttsVoices.find(v => v.lang === 'fr-FR') || _ttsVoices.find(v => v.lang && v.lang.startsWith('fr')) || null;
    }
    const _origSpeakCurrentQuestion = speakCurrentQuestion;
    speakCurrentQuestion = function () {
      const btn = document.getElementById('btnTts');
      if (!('speechSynthesis' in window)) { showToast('🔊 Lecture vocale non supportée sur cet appareil'); return; }
      btn.classList.add('playing'); window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(document.getElementById('qText').textContent);
      u.lang = 'fr-FR';
      const voice = pickFrenchVoice(); if (voice) u.voice = voice;
      u.rate = 0.95;
      u.onend = () => btn.classList.remove('playing');
      window.speechSynthesis.speak(u);
    };
    function toggleAutoTTS() { P.autoTTS = !P.autoTTS; save(); }
    const _origRenderQDash = renderQ;
    renderQ = function (...args) {
      const r = _origRenderQDash.apply(this, args);
      if (P.autoTTS && document.getElementById('scrQuiz').classList.contains('active')) {
        setTimeout(() => { try { speakCurrentQuestion(); } catch (e) { } }, 300);
      }
      return r;
    };
    let _dashSessionStart = null;
    const _origLaunchQuizScreenDash = launchQuizScreen;
    launchQuizScreen = function (...args) { _dashSessionStart = Date.now(); return _origLaunchQuizScreenDash.apply(this, args); };
    function _accumulatePlaytime() {
      if (_dashSessionStart) { P.totalPlayMs = (P.totalPlayMs || 0) + (Date.now() - _dashSessionStart); _dashSessionStart = null; save(); }
    }
    const _origShowResultDash = showResult;
    showResult = function (...args) { _accumulatePlaytime(); return _origShowResultDash.apply(this, args); };
    const _origShowGPResultDash = showGPResult;
    showGPResult = function (...args) { _accumulatePlaytime(); return _origShowGPResultDash.apply(this, args); };

    // ===== MODE INFINI — ELO CACHÉ =====
    const INFINITE_ELO_START = 1000;
    const INFINITE_ELO_BY_DIFF = { easy: 900, medium: 1100, hard: 1400 };
    // Asymétrie volontaire : gagner rapporte moins que perdre ne coûte,
    // surtout quand la question était "facile" pour le niveau actuel du joueur.
    const INFINITE_K_GAIN = 12;
    const INFINITE_K_LOSS = 26;

    function getInfiniteElo() { return P.infiniteElo || INFINITE_ELO_START; }

    function applyInfiniteElo(q, isCorrect) {
      const qElo = INFINITE_ELO_BY_DIFF[q.difficulty] || INFINITE_ELO_BY_DIFF.medium;
      const playerElo = getInfiniteElo();
      const expected = 1 / (1 + Math.pow(10, (qElo - playerElo) / 400));
      let delta;
      if (isCorrect) {
        delta = Math.max(1, Math.round(INFINITE_K_GAIN * (1 - expected)));
      } else {
        delta = -Math.max(3, Math.round(INFINITE_K_LOSS * expected));
      }
      P.infiniteElo = Math.max(400, playerElo + delta);
      P.bestInfiniteElo = Math.max(P.bestInfiniteElo || INFINITE_ELO_START, P.infiniteElo);
      return delta;
    }

    // Modes où la barre de cœurs générique n'a pas sa place :
    // - infinite / scramble : n'utilisent aucun système de vie
    // - survie / duel : ont déjà leur propre affichage dédié (#survieHeader, #duelBar)
    const HEART_BAR_HIDDEN_MODES = ['infinite', 'scramble', 'survie', 'duel'];

    const _origRenderQElo = renderQ;
    renderQ = function (...args) {
      const r = _origRenderQElo.apply(this, args);
      const powerupBar = document.getElementById('powerupBar');
      const diffBadge = document.getElementById('difficultyBadge');
      const badgeWrap = document.querySelector('.q-xp-badge');
      const qHeartsEl = document.getElementById('qHearts');
      const qCounterEl = document.getElementById('qCounterWrap');
      if (Q.mode === 'infinite') {
        if (powerupBar) powerupBar.style.display = 'none';
        if (diffBadge) diffBadge.style.display = 'none';
        if (badgeWrap) badgeWrap.innerHTML = `⚡ ${getInfiniteElo()} ELO`;
      } else if (Q.mode === 'boss' && Q.legend) {
        // Boss légendaire : power-ups interdits, badge de phase à la place
        if (powerupBar) powerupBar.style.display = 'none';
        if (diffBadge) diffBadge.style.display = 'none';
        const phase = Q.idx < 5 ? 1 : Q.idx < 10 ? 2 : 3;
        if (badgeWrap) badgeWrap.innerHTML = `👑 Phase ${phase} / 3`;
      } else {
        if (powerupBar) powerupBar.style.display = '';
      }
      if (qHeartsEl) qHeartsEl.style.display = HEART_BAR_HIDDEN_MODES.includes(Q.mode) ? 'none' : '';
      if (qCounterEl) qCounterEl.style.display = (Q.mode === 'infinite') ? 'none' : '';
      return r;
    };
    // Remplace l'affichage XP/combo par le delta Elo en mode Infini, sans toucher au calcul XP interne
    const _origCheckAnswerElo = checkAnswer;
    checkAnswer = function () {
      let infiniteDelta = null;
      if (Q.mode === 'infinite') {
        const q = Q.qs[Q.idx];
        const isCorrect = (Q.selectedIdx === q.correctAnswer);
        infiniteDelta = applyInfiniteElo(q, isCorrect);
      }
      _origCheckAnswerElo();
      if (infiniteDelta !== null) {
        const xpBonusEl = document.getElementById('xpBonus');
        if (xpBonusEl) xpBonusEl.textContent = infiniteDelta >= 0 ? `📈 +${infiniteDelta} ELO` : `📉 ${infiniteDelta} ELO`;
        const badgeWrap = document.querySelector('.q-xp-badge');
        if (badgeWrap) badgeWrap.innerHTML = `⚡ ${getInfiniteElo()} ELO`;
        save();
      }
    };
