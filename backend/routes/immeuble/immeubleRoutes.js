import express from 'express';
import { listeImmeubles, suppImmeuble, ajouterImmeuble, modifierImmeuble } from '../../controllers/immeuble/immeubleController.js';

const router = express.Router();

router.use(express.json()); // Middleware pour parser le corps des requêtes JSON

// ✅ Route pour récupérer la liste des immeubles
router.get('/liste-immeubles', listeImmeubles);

// ✅ Route pour supprimer un immeuble
router.post('/supprimer-immeuble', suppImmeuble);

// ✅ Route pour ajouter un immeuble
router.post('/ajouter-immeuble', ajouterImmeuble);

// ✅ Route pour modifier un immeuble
router.post('/modifier-immeuble', modifierImmeuble);

export default router;