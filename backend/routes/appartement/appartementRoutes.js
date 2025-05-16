import express from 'express';
import {listeAppartement, getInfos, ajouterAppartement, modifierAppartement, supprimerAppartement} from '../../controllers/appartement/appartementController.js';

const router = express.Router();

router.use(express.json());

// Route GET pour récupérer la liste des appartements
router.get('/liste-appartements', listeAppartement);

// Route GET pour récupérer les infos des immeubles et propriétaires
router.get('/infos', getInfos);

// Route POST pour ajouter un appartement
router.post('/ajouter-appartement', ajouterAppartement);

// Route POST pour modifier un appartement
router.post('/modifier-appartement', modifierAppartement);

// Route POST pour supprimer un appartement
router.post('/supprimer-appartement', supprimerAppartement);

export default router;