import express from 'express';
import { getUserData, updateUser } from '../../controllers/user/userController.js';

const router = express.Router();

router.use(express.json()); 

// Route GET pour récupérer un utilisateur
router.get('/get-user-Data', getUserData);

router.post('/update-user', updateUser);

export default router;
