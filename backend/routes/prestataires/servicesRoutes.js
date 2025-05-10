import express from 'express';
import {getListeRaisonsSociales, listeImmeubles, addService, listeServices, deleteService} from '../../controllers/prestataires/servicesController.js';

const router = express.Router();

router.use(express.json());

// ✅ Route pour récupérer la liste des raisons sociales des prestataires
router.get('/ListeRaisonsSociales', getListeRaisonsSociales);

// ✅ Route pour récupérer la liste des immeubles
router.get('/ListeImmeubles', listeImmeubles);

// ✅ Route pour ajouter un service
router.post('/addService', addService);

// ✅ Route pour récupérer les services d’un prestataire via son ID
router.get('/listeServices/:id_prestataire', listeServices);

// ✅ Route pour supprimer un service via son ID
router.post('/deleteService/', deleteService);
export default router;