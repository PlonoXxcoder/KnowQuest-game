/* Configuration des points d'accès selon l'environnement.
 *
 * - Version publiée (GitHub Pages) : aucun changement, les URL de production
 *   par défaut des modules sont utilisées.
 * - Candidate locale lancée par LANCER_REFONTE.bat (port 8770 uniquement) :
 *   les appels ORDS passent par le relais local strict (tools/relais_oracle.py),
 *   car le serveur Oracle réel refuse les origines locales (ORDS-13002).
 *
 * Ce fichier ne contient aucun secret et ne modifie rien d'autre que l'hôte
 * des appels réseau déjà prévus par les modules du jeu.
 */
((root) => {
  'use strict';
  const loc = root.location || {};
  const host = loc.hostname || '';
  const localDev = (host === '127.0.0.1' || host === 'localhost') && loc.port === '8770';
  if (!localDev) return;
  const origin = loc.origin;
  root.KQ_ORACLE_URL = origin + '/kq-relais/ords/admin/kq_auth';
  root.KQ_LB_BASE = origin + '/kq-relais/ords/kq_lb';
  root.KQ_EVENTS_URL = origin + '/kq-relais/ords/admin/kq_v4/events';
})(typeof window !== 'undefined' ? window : this);
