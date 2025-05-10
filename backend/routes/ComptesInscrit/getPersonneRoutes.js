import express from 'express';
import { getPersonne } from '../../controllers/ComptesInscrit/getPersonneController.js';

const router = express.Router();

router.get('/personne/:id', getPersonne);

export default router;
