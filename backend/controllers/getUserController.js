// getUserController.js
import { findUserById } from '../models/getUserModel.js';

// ✅ Fonction de déchiffrement
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

// ✅ Contrôleur
export const getUserData = async (req, res) => {
  const { id_personne } = req.query;

  if (!id_personne) {
    return res.json({ success: false, message: 'ID utilisateur non fourni.' });
  }

  try {
    const userData = await findUserById(id_personne);

    if (!userData) {
      return res.json({ success: false, message: 'Utilisateur introuvable.' });
    }

    // ✅ Déchiffrer le mot de passe ici
    userData.mot_de_passe = cesarDecrypt(userData.mot_de_passe);

    return res.json({ success: true, userData });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
