import express from 'express';
import {
    TauxPaiementParImmeubleEtAnnee} from '../../controllers/statistiques/statistiqueController.js';

const router = express.Router();

router.use(express.json()); 

router.get('/taux-paiements', TauxPaiementParImmeubleEtAnnee);

export default router;
