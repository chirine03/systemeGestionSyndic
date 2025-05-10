import express from 'express';
import { addPrestataire, getListePrestataire, deletePrestataire, updatePrestataire } from '../../controllers/prestataires/prestatairesController.js';

const router = express.Router();

router.use(express.json()); // Middleware pour parser le corps des requêtes JSON

// ✅ Route pour ajouter un nouveau prestataire
router.post('/addPrestataire', addPrestataire);

// ✅ Route pour récupérer la liste des prestataires
router.get('/ListePrestataire', getListePrestataire);

// ✅ Route pour supprimer un prestataire par ID
router.post('/deletePrestataire', deletePrestataire);

// ✅ Route pour mettre à jour un prestataire par ID
router.post('/updatePrestataire', updatePrestataire);

export default router;
