import express from 'express';
import { loginUser, registerUser } from '../../controllers/authentification/authController.js';

const router = express.Router();

router.use(express.json()); 

// Route to handle user login
router.post('/login', loginUser);

// Route to handle user registration
router.post('/register', registerUser);

export default router;