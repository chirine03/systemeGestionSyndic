import express from 'express';
import { getListePaiement } from '../../controllers/listePaiement/propPaiementController.js';
const router = express.Router();

router.get('/listePaiement', getListePaiement);

export default router;
