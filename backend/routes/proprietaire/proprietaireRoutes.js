import express from 'express';
import {getListeProprietaire, ajouterProprietaire, modifierProprietaire, supprimerProprietaire} from '../../controllers/proprietaire/proprietaireController.js';

const router = express.Router();

router.use(express.json()); 

// Route GET pour récupérer la liste des propriétaires
router.get('/liste-proprietaires', getListeProprietaire); 

// Route POST pour ajouter un propriétaire
router.post('/ajouter-proprietaire', ajouterProprietaire);

// Route pour modifier un propriétaire
router.post('/modifier-proprietaire', modifierProprietaire);

// Route pour supprimer un propriétaire
router.post('/supprimer-proprietaire', supprimerProprietaire);

export default router;