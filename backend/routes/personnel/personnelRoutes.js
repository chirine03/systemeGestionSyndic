import express from 'express';
import {getListePersonnel, ajouterPersonnel, modifierPersonnel, supprimerPersonnel} from '../../controllers/personnel/personnelController.js';

const router = express.Router();

router.use(express.json()); 

// Route GET pour récupérer la liste des propriétaires
router.get('/liste-personnel', getListePersonnel); 

// Route POST pour ajouter un propriétaire
router.post('/ajouter-personnel', ajouterPersonnel);

// Route pour modifier un propriétaire
router.post('/modifier-personnel', modifierPersonnel);

// Route pour supprimer un propriétaire
router.post('/supprimer-personnel', supprimerPersonnel);

export default router;