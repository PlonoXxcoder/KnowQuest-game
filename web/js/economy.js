/* Transactions locales : prix du catalogue, débit unique et refus sans mutation. */
((root)=>{
  'use strict';
  const powerups = [
      { id: 'fiftyfifty', name: '50/50', ico: '✂️', desc: 'Élimine 2 mauvaises réponses', cost: 30 },
      { id: 'shield', name: 'Bouclier', ico: '🛡️', desc: 'Protège ton prochain cœur', cost: 50 },
      { id: 'doubleXP', name: 'Double XP', ico: '⚡', desc: '×2 XP pour la prochaine question', cost: 40 },
      { id: 'streakFreeze', name: 'Gel de série', ico: '🧊', desc: 'Protège ta série si tu rates un jour', cost: 45 },
    ];
  const cosmetics = [
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
  const themes = [
      { id: 'classic', ico: '🛤️', name: 'Classique', desc: 'Le parcours d\'origine', cost: 0 },
      { id: 'sakura', ico: '🌸', name: 'Sakura', desc: 'Pétales roses sur la route', cost: 120, bg: 'linear-gradient(160deg,#2b0a1c,#4a1030 55%,#2b0a1c)', c1: '#ff8fb3', c2: '#b25ce0', base: '#3a1029' },
      { id: 'ocean', ico: '🌊', name: 'Océan', desc: 'La route des profondeurs', cost: 120, bg: 'linear-gradient(160deg,#04182e,#062c4a 55%,#04182e)', c1: '#22d3ee', c2: '#1cb0f6', base: '#0a2740' },
      { id: 'neon', ico: '🌌', name: 'Néon', desc: 'La nuit électrique', cost: 180, bg: 'linear-gradient(160deg,#0d0d1a,#1a0a2e 55%,#0d0d1a)', c1: '#22ff88', c2: '#b429ff', base: '#1e1e2f' },
      { id: 'royal', ico: '👑', name: 'Or royal', desc: 'Pour les fins stratèges', cost: 250, bg: 'linear-gradient(160deg,#231a02,#3d2c05 55%,#231a02)', c1: '#ffd700', c2: '#ff9d00', base: '#403005' },
    ];
  const owlOutfits = [
      { id: 'none', ico: '', name: 'Nature', desc: 'Chouette, tout simplement', cost: 0 },
      { id: 'grad', ico: '🎓', name: 'Diplômée', desc: 'La sagesse incarnée', cost: 60 },
      { id: 'pirate', ico: '🏴‍☠️', name: 'Pirate', desc: 'Cap sur le trésor du savoir', cost: 80 },
      { id: 'santa', ico: '🎅', name: 'Père Noël', desc: 'Ho ho ho !', cost: 80, event: 'noel' },
      { id: 'wizard', ico: '🧙', name: 'Archimage', desc: 'Magie des connaissances', cost: 120 },
    ];
  const talents = [
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
  const lives={1:10,3:25,5:40,99:30};
  function spend(player,cost,apply){
    if(!Number.isSafeInteger(cost)||cost<0||!Number.isFinite(player.gems)||player.gems<cost)return {ok:false,reason:'funds'};
    player.gems-=cost;apply();return {ok:true,cost};
  }
  function refill(player){
    if(player.hearts>=5)return {ok:false,reason:'full'};
    return spend(player,lives[99],()=>{player.hearts=5;});
  }
  function freeHeart(player){player.hearts=Math.max(player.hearts,Math.min(5,player.hearts+1));}
  const api={lives,powerups,cosmetics,themes,owlOutfits,talents,freeHeart,spend,refill};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Economy=api;
})(typeof window!=='undefined'?window:globalThis);
