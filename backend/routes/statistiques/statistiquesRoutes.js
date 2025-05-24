import express from 'express';
import {
    TauxPaiementParImmeubleEtAnnee,
    RecetteActuelle,
    TotalDepense,
    TauxDepensePrestataire,
    TotalDepensesParImmeuble,
    EvolDepense,
    DepensePayeNonPaye
} from '../../controllers/statistiques/statistiqueController.js';

const router = express.Router();

router.use(express.json()); 

router.get('/taux-paiements', TauxPaiementParImmeubleEtAnnee);

router.get('/recette-actuelle',RecetteActuelle);

router.get('/total-depense',TotalDepense);

router.get('/taux-depense-prestataire',TauxDepensePrestataire)

router.get('/total-depenses-immeuble',TotalDepensesParImmeuble)

router.get('/evol-depense',EvolDepense)

router.get('/depense-paye-non-paye',DepensePayeNonPaye)

export default router;
