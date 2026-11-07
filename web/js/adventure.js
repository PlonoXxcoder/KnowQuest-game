/* Les Pages de l’Atlas — récit, décors et progression narrative.
 * Les fragments sont déduits des étapes existantes : aucun gain dupliqué. */
((root) => {
  'use strict';
  // ── Les huit destinations : cinq repères et une conclusion chacune ──
  const chapters = [
    { title:'Le Phare éteint',icon:'🗼',icons:['⛵','🧭','🔍','🌫️','🔦'],color:'#167da1',banks:['geo','geo','sci','sci','geo'],intro:'La Brume de l’Oubli a englouti les routes maritimes. Chouette aperçoit un phare éteint : sa lumière pourrait révéler la première page du Grand Atlas.',mission:'Rallumer le phare pour retrouver la route.',steps:['Le quai perdu','Les repères du navigateur','L’atelier des lentilles','La tour dans la brume','Le dernier faisceau'],lines:['Retrouvons un premier repère sur cette côte.','Une carte se dessine : suivons les bons indices.','Comprenons comment la lumière peut nous guider.','La tour se réveille, mais son mécanisme reste bloqué.','Les fragments sont réunis. Préparons la lumière avant le gardien.'],end:'Le phare s’allume. Sur l’eau apparaît le chemin de la Cité des chroniques. La première page a retrouvé ses couleurs.' },
    { title:'La Cité des chroniques',icon:'🏰',icons:['🚪','🧱','🏛️','🏰','📜'],color:'#a05b24',banks:['hist','chateaux','hist','chateaux','hist'],intro:'Les habitants ont oublié les noms de leurs rues et l’histoire de leur cité. Une page de l’Atlas se cache parmi les chroniques effacées.',mission:'Rendre sa mémoire à la cité.',steps:['La porte des souvenirs','Les remparts muets','La place des chroniques','Les salles du château','Le sceau des archives'],lines:['Commençons par replacer quelques repères historiques.','Ces pierres portent encore les traces du passé.','Chaque fait retrouvé rend une voix aux chroniques.','Le château protège les derniers fragments.','Le gardien des archives attend notre réponse.'],end:'Les noms réapparaissent sur les pierres. La page des chroniques ouvre une piste vers un jardin devenu silencieux.' },
    { title:'Le Jardin silencieux',icon:'🌿',icons:['🌱','💧','🏞️','🔬','🌳'],color:'#24814a',banks:['sci','sci','geo','sci','sci'],intro:'Le jardin a perdu ses sons et ses couleurs. Chouette propose d’observer le vivant et le monde qui l’entoure pour comprendre ce qui manque.',mission:'Réveiller le jardin et retrouver sa page.',steps:['Les graines endormies','Le chemin de l’eau','Les paysages oubliés','L’observatoire du vivant','Le cœur du jardin'],lines:['Observons les premiers indices du monde vivant.','L’eau dessine une nouvelle piste.','Relions le jardin aux paysages qui l’entourent.','La science nous aide à comprendre ces changements.','Le jardin reprend vie : il reste à convaincre son gardien.'],end:'Les couleurs reviennent dans les feuilles. Une nouvelle page révèle un atelier dont les œuvres ont disparu.' },
    { title:'L’Atelier des merveilles',icon:'🎨',icons:['🖼️','✒️','🗿','📚','🎨'],color:'#9556bc',banks:['art','litt','art','litt','art'],intro:'Des cadres vides et des livres sans mots remplissent l’atelier. Les créations humaines pourraient rendre une forme aux souvenirs dispersés.',mission:'Restaurer les œuvres et les récits de l’atelier.',steps:['Les cadres vides','Les mots envolés','La galerie des formes','La bibliothèque des voix','Le chef-d’œuvre retrouvé'],lines:['Retrouvons les repères de l’histoire de l’art.','Les histoires commencent avec des mots retrouvés.','Chaque œuvre reconnue rend une couleur à la galerie.','Des récits relient enfin les fragments.','L’atelier est prêt pour l’épreuve de son gardien.'],end:'La galerie et les livres retrouvent leurs couleurs. Une page parfumée nous entraîne vers le Marché des saveurs.' },
    { title:'Le Marché des saveurs',icon:'🍽️',icons:['🧺','🗺️','📒','🚚','🍽️'],color:'#b45a30',banks:['gastro','geo','gastro','geo','gastro'],intro:'Les voyageurs ne reconnaissent plus les saveurs de leurs régions. Au marché, une page de l’Atlas attend ceux qui relient cultures et territoires.',mission:'Retrouver les traditions des voyageurs.',steps:['Les étals fermés','La carte des voyageurs','Les recettes perdues','La route des produits','Le banquet du partage'],lines:['Ouvrons les premiers étals grâce à nos connaissances.','Chaque région nous apporte un nouvel indice.','Replaçons les traditions à leur juste place.','Suivons les produits et les paysages.','Le banquet attend notre dernier défi.'],end:'Les étals s’animent et les voyageurs partagent leurs récits. La page retrouvée annonce une grande rencontre dans l’Arène des défis.' },
    { title:'L’Arène des défis',icon:'🏅',icons:['🏟️','🎮','👟','🕹️','🏅'],color:'#207c8d',banks:['sport','jv','sport','jv','sport'],intro:'L’arène est vide et ses champions ont perdu leurs repères. Chouette nous invite à retrouver l’esprit du jeu, de l’effort et de la coopération.',mission:'Préparer la rencontre et réveiller l’arène.',steps:['Les portes de l’arène','La salle des joueurs','Les traces des champions','Le défi des mondes virtuels','La rencontre finale'],lines:['Retrouvons les règles et les repères du sport.','Les jeux vidéo ont aussi leurs histoires.','Les parcours des champions nous donnent des indices.','Explorons d’autres façons de relever un défi.','L’arène est prête pour son gardien.'],end:'Les tribunes retrouvent leurs couleurs. Dans le silence qui suit, une mélodie nous guide vers le Studio des échos.' },
    { title:'Le Studio des échos',icon:'🎬',icons:['🎵','🎞️','📺','🎧','📽️'],color:'#b34283',banks:['musique','cinema','series','musique','cinema'],intro:'Plus aucune chanson ni aucune histoire ne sort du studio. Les derniers échos semblent enfermés dans une page froissée de l’Atlas.',mission:'Rendre leurs voix aux chansons et aux histoires.',steps:['La première note','Les images effacées','Les épisodes perdus','La cabine des mélodies','La grande projection'],lines:['Écoutons les indices laissés par les musiciens.','Retrouvons quelques repères du cinéma.','Les séries nous transmettent d’autres souvenirs.','Les mélodies commencent à se répondre.','La projection peut commencer après l’épreuve du gardien.'],end:'Le studio résonne à nouveau. Ses histoires dévoilent l’emplacement de la Bibliothèque oubliée, dernier refuge de la Brume.' },
    { title:'La Bibliothèque oubliée',icon:'📖',icons:['🐉','🧩','📖','💎','🌐'],color:'#6951a8',banks:['mytho','mixed','litt','extended','mixed'],intro:'Toutes les pistes convergent vers la bibliothèque. Les pages retrouvées doivent maintenant former un seul Atlas pour dissiper la Brume de l’Oubli.',mission:'Assembler le Grand Atlas et retrouver les liens entre les savoirs.',steps:['Les portes des légendes','Les savoirs reliés','La salle des récits','Les derniers fragments','Le Grand Atlas'],lines:['Les mythes donnent une première clé.','Relions les connaissances rencontrées pendant le voyage.','Les récits rendent un sens aux fragments.','Une dernière exploration complète nos repères.','Le dernier gardien protège l’assemblage de l’Atlas.'],end:'Les huit pages se rejoignent. La Brume se dissipe et les destinations retrouvent leurs couleurs. Chouette sourit : l’Atlas est restauré, et chaque découverte peut désormais ouvrir un nouveau voyage.' },
  ];

  const themes = [["mer port ocean cote navire ile", "carte continent capitale frontiere latitude longitude", "lumiere lentille optique photon miroir laser", "electricite energie courant tension mecanique", "etoile soleil phare astronomie constellation"], ["antiquite medieval empire dynastie siecle", "rempart fortification tour siege muraille", "roi reine revolution traite couronnement", "chateau palais demeure residence", "archive ecriture manuscrit charte imprimerie"], ["graine plante vegetal fleur photosynthese", "eau riviere evaporation pluie molecule", "paysage foret montagne desert climat", "animal cellule espece organisme biodiversite", "arbre racine ecosysteme botanique"], ["tableau peinture peintre musee", "ecrivain poesie poeme mot langue", "sculpture statue architecture art", "roman livre auteur recit litterature", "oeuvre peintre toile mouvement"], ["marche ingredient fruit legume epice", "pays region capitale ville", "recette plat sauce cuisine cuisson", "produit origine culture region", "gastronomie fromage pain specialite"], ["stade regle sport discipline", "jeu console nintendo sega sony", "champion athlete record olympique", "jeu studio developpeur personnage", "finale coupe tournoi olympique"], ["musique note chanson chanteur", "film realisateur cinema acteur", "serie episode saison television", "instrument orchestre album compositeur", "film festival oscar palme"], ["mythe dieu deesse legende", "science histoire geographie culture", "roman livre auteur ecrivain", "philosophie invention langage civilisation", "monde savoir decouverte culture"]];
  const normalize=text=>String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function questionsForNode(node,road,pool) {
    const chapter=locate(node,road),step=road[chapter]?.nodes.findIndex(item=>item.id===node.id);
    const words=themes[chapter]?.[step]?.split(' ');if(!words)return pool;
    const related=pool.filter(question=>{const tokens=normalize(question.question).split(/[^a-z0-9]+/);return words.some(word=>tokens.some(token=>token.startsWith(word)));});
    return related.length>=Math.min(node.qCount||5,5)?related:pool;
  }

  // ── Adaptation du parcours : mêmes identifiants, mêmes récompenses ──
  function decorate(road) {
    road.forEach((chapter,index)=>{
      const story=chapters[index];if(!story)return;
      chapter.name=`Chapitre ${index+1} : ${story.title}`;
      chapter.nodes.forEach((node,i)=>{node.label=story.steps[i]||node.label;node.bank=story.banks[i%5];node.ico=story.icons[i]||story.icon;});
    });return road;
  }
  function progress(profile,road,index) {
    const nodes=road[index]?.nodes||[];
    return {fragments:nodes.filter(n=>profile.nodeProgress?.[n.id]).length,total:nodes.length,restored:!!profile.bossDefeated?.['boss_ch'+index]};
  }
  function locate(node,road){return road.findIndex(c=>c.nodes.some(n=>n.id===node.id));}

  // ── Dialogues : texte court, relisible, et bouton pour passer le récit ──
  function dialogue(title,text,action,label='Continuer') {
    document.getElementById('adventureDialog')?.remove();
    const dialog=document.createElement('dialog');dialog.id='adventureDialog';dialog.className='adventure-dialog';
    const h=document.createElement('h2');h.textContent=title;h.id='adventureDialogTitle';dialog.setAttribute('aria-labelledby',h.id);
    const p=document.createElement('p');p.textContent=text;
    const owl=document.createElement('div');owl.className='adventure-owl';owl.textContent='🦉 Chouette';
    const buttons=document.createElement('div');buttons.className='adventure-actions';
    const next=document.createElement('button');next.textContent=label;
    const proceed=()=>{dialog.close();dialog.remove();if(action)action();};next.onclick=proceed;
    buttons.append(next);
    if(action){const skip=document.createElement('button');skip.className='adventure-secondary';skip.textContent='Passer le récit';skip.onclick=proceed;buttons.append(skip);}
    dialog.addEventListener('cancel',()=>{dialog.remove();});
    dialog.append(owl,h,p,buttons);document.body.append(dialog);dialog.showModal();
  }
  // Le récit se consulte à part ; une étape démarre directement.
  function start(node,road,profile,save,launch) { launch(); }

  // Une carte courte, une seule action principale.
  function render(profile,road) {
    const host=document.getElementById('adventurePanel');if(!host||!road.length)return;
    let index=road.findIndex((c,i)=>!progress(profile,road,i).restored);
    const finished=index<0;if(finished)index=Math.min(road.length,chapters.length)-1;
    const story=chapters[index];if(!story)return;
    const status=progress(profile,road,index);
    const node=road[index].nodes.find(n=>!profile.nodeProgress?.[n.id]);
    host.replaceChildren();
    const main=document.createElement('div');main.className='adventure-main';
    const copy=document.createElement('div');copy.className='adventure-copy';
    const label=document.createElement('p');label.className='adventure-label';label.textContent=finished?'Aventure terminée':'Prochaine étape';
    const title=document.createElement('h2');title.textContent=finished?'Le Grand Atlas est restauré':node?.label||'Le gardien du chapitre';
    const count=document.createElement('p');count.className='adventure-count';count.textContent=finished?'Les huit pages ont retrouvé leurs couleurs.':`Chapitre ${index+1} · ${status.fragments}/${status.total} étapes terminées`;
    copy.append(label,title,count);main.append(copy);
    if(!finished){const play=document.createElement('button');play.className='adventure-play';play.textContent='Jouer';play.onclick=()=>{
      if(node&&typeof root.playAdventureStep==='function')root.playAdventureStep(node,road[index]);
      else if(!node&&typeof root.openBossModal==='function')root.openBossModal('boss_ch'+index,index,road[index]);
    };main.append(play);}
    const details=document.createElement('details');details.className='adventure-details';
    const summary=document.createElement('summary');summary.textContent='L’histoire';
    const actions=document.createElement('div');actions.className='adventure-actions';
    const reread=document.createElement('button');reread.className='adventure-secondary';reread.textContent='Relire le récit';reread.onclick=()=>dialogue(story.title,story.intro);
    const atlas=document.createElement('button');atlas.className='adventure-secondary';atlas.textContent='Les pages retrouvées';atlas.onclick=()=>showPages(profile,road);
    actions.append(reread,atlas);details.append(summary,actions);host.append(main,details);
  }
  function showPages(profile,road){
    const restored=chapters.filter((c,i)=>progress(profile,road,i).restored).length;
    dialogue(`Le Grand Atlas · ${restored}/8 pages restaurées`,'Chaque page est assemblée après la victoire sur le gardien du chapitre.');
    const dialog=document.getElementById('adventureDialog');
    chapters.forEach((story,i)=>{const row=document.createElement('button');row.className='adventure-page';const p=progress(profile,road,i);row.textContent=`${p.restored?'📖':'🔒'} ${i+1}. ${story.title} — ${p.restored?'restaurée':p.fragments+'/'+p.total+' fragments'}`;row.disabled=!p.restored;row.onclick=()=>dialogue(story.title,story.end,()=>showPages(profile,road),'Retour à l’Atlas');dialog.insertBefore(row,dialog.lastElementChild);});
  }
  const api={chapters,themes,questionsForNode,decorate,progress,locate,start,render,showPages};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Adventure=api;
})(typeof window!=='undefined'?window:globalThis);
