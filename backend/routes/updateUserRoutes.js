import express from 'express';
import { updateUser } from '../controllers/updateUserController.js';

const router = express.Router();

// Route : /api/update-user
router.post('/update-user', updateUser);

export default router;
