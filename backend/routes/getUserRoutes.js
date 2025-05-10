import express from 'express';
import { getUserData } from '../controllers/getUserController.js';

const router = express.Router();

// Route GET pour récupérer un utilisateur
router.get('/getUserData', getUserData);

export default router;
