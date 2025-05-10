import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUserByEmail } from '../models/loginModel.js';

dotenv.config();

// ✅ Caesar cipher decryption function
const cesarDecrypt = (text, shift = 11) => {
  const shiftVal = 26 - shift;
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      return String.fromCharCode(
        ((char.charCodeAt(0) - base + shiftVal) % 26) + base
      );
    }
    return char;
  }).join('');
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // ✅ Validate required fields
  if (!email || !password) {
    return res.json({ success: false, message: 'Tous les champs sont requis.' });
  }

  try {
    const user = await findUserByEmail(email);
    
    console.log("✅ User found:", user);


    if (!user) {
      return res.json({ success: false, message: 'Email non trouvé.' });
    }

    // ✅ Decrypt the stored password and compare
    const decryptedPassword = cesarDecrypt(user.mot_de_passe);

    if (password === decryptedPassword) {
      // ✅ Generate JWT token with id and role
      const token = jwt.sign(
        { id_personne: user.id_personne, role: user.role },
        process.env.JWT_SECRET,
      );

      // ✅ Send token and user info back
      return res.json({
        success: true,
        message: 'Connexion réussie !',
        token,
        user: {
            id_personne: user.id_personne,
            role: user.role
            }
      });
    } else {
      return res.json({ success: false, message: 'Mot de passe incorrect.' });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
