import express from 'express';
import { getListeComptes } from '../../controllers/ComptesInscrit/listeComptesController.js';

const router = express.Router();

// ✅ Route GET pour récupérer la liste des comptes
router.get('/listeComptes', getListeComptes);

export default router;
