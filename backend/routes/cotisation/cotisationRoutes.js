// backend/routes/cotisationRoutes.js
import express from 'express';
import {
  getInfosCotisation,
  ajouterNouvelleCotisation,
  getSuiviCotisation,
  getListeCotisations,
  supprimerCotisation,
  modifierCotisationExistante,
  getSuiviGlobal} from '../../controllers/cotisation/cotisationController.js';

const router = express.Router();

router.use(express.json()); 

// Route GET pour récupérer les infos
router.get('/infos-cotisation', getInfosCotisation);

// Route POST pour ajouter une cotisation
router.post('/ajouter-cotisation', ajouterNouvelleCotisation);

// Route GET pour le suivi
router.get('/suivi-cotisation', getSuiviCotisation);

// Route GET pour la liste
router.get('/liste-cotisations', getListeCotisations);

// Route POST pour supprimer une cotisation
router.post('/supprimerCotisation', supprimerCotisation);

// ✅ Nouvelle route POST pour modifier une cotisation
router.post('/modifier-cotisation', modifierCotisationExistante);

// Route pour le suivi global des cotisations
router.get('/suivi-global',getSuiviGlobal);

export default router;
