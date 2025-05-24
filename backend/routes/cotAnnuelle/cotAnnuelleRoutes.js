import express from 'express';

import {getListeCotisationAnnuelle,
        supprimerCotAnnuelle,
        modifierCotAnnuelle,
        ajouterCotAnnuelle
} from '../../controllers/cotAnnuelle/cotAnnuelleController.js';

const router = express.Router();

router.use(express.json()); 

router.get('/liste-cotisations-annuelle', getListeCotisationAnnuelle);

router.post('/ajouter-cotisation-annuelle', ajouterCotAnnuelle);

router.post('/supprimer-cotisation-annuelle', supprimerCotAnnuelle);

router.post('/modifier-cotisation-annuelle', modifierCotAnnuelle);

export default router;