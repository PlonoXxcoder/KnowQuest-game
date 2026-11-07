/* Règles partagées sans DOM : calendrier local et banques QCM. */
((root)=>{
  'use strict';
  const banks={geo:'GEO_QB',hist:'HIST_QB',sci:'SCI_QB',art:'ART_QB',cinema:'CINEMA_QB',sport:'SPORT_QB',gastro:'GASTRO_QB',mytho:'MYTHO_QB',chateaux:'CHATEAUX_QB',litt:'LITT_QB',musique:'MUSIQUE_QB',jv:'JV_QB',series:'SERIES_QB',extended:'EXTENDED_QB',mixed:'MIXED_QB'};
  function day(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
  function valid(q){return q&&typeof q.id==='string'&&typeof q.question==='string'&&Array.isArray(q.choices)&&q.choices.length===4&&Number.isInteger(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<4;}
  function combine(source,categories=Object.keys(banks)){
    const result=new Map();for(const cat of categories)for(const q of source[banks[cat]]||[])if(valid(q)&&!result.has(q.id))result.set(q.id,q);return [...result.values()];
  }
  const api={day,banks,valid,combine};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GameRules=api;
})(typeof window!=='undefined'?window:globalThis);
