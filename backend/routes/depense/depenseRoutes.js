import express from 'express';
import { 
    getListeServicesSansDepense, 
    addDepense,
    listeDepenses,
    supprimerDepense,
    suiviDepenseGlobal,
    suiviServiceGlobale  } from '../../controllers/depense/depenseController.js';

const router = express.Router();

router.use(express.json()); // Middleware pour parser le corps des requêtes JSON

// ✅ Route pour récupérer la liste des services sans dépense
router.get('/services-sans-depense', getListeServicesSansDepense);

// ✅ Route pour ajouter une nouvelle dépense
router.post('/ajouter-depense', addDepense);

// ✅ Route pour récupérer la liste des dépenses
router.get('/liste-depenses', listeDepenses);

// ✅ Route pour supprimer une dépense par id
router.post('/supprimer-depense', supprimerDepense);

// ✅ Route pour récupérer le suivi des dépenses globales
router.get('/suivi-depense-global', suiviDepenseGlobal);

// ✅ Route pour récupérer le suivi des services globales
router.get('/suivi-service-global', suiviServiceGlobale);

export default router;