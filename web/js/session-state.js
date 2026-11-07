/* État neuf pour chaque partie : aucun compteur ni drapeau de résultat hérité. */
((root)=>{
 'use strict';
 function create(options={}){
  return {mode:'',type:'',qs:[],idx:0,correct:0,totalXP:0,state:'selecting',selectedIdx:null,combo:0,userSel:[],retryQueue:[],newAtlasCards:0,survieErrors:0,survieScore:0,duelPlayerHP:5,duelAiHP:5,duelAiDiff:.7,chain:null,chainIdx:0,chainBroken:false,resultShown:false,...options};
 }
 const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SessionState=api;
})(typeof window!=='undefined'?window:globalThis);
