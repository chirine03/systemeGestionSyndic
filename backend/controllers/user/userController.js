// getUserController.js
import { findUserById, updatePersonne, updateCompte, checkMailExists, checkPhoneExists } from '../../models/user/userModel.js';

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

export const updateUser = async (req, res) => {
  const userData = req.body;

  if (!userData || !userData.id_personne) {
    return res.json({ success: false, message: "Données invalides" });
  }

  try {
    // 🔍 Vérifier si l'email est déjà utilisé
    if (userData.mail) {
      const emailExists = await checkMailExists(userData.mail, userData.id_personne);
      if (emailExists) {
        return res.json({ success: false, message: "Email déjà utilisé par un autre utilisateur" });
      }
    }

    // 🔍 Vérifier si le téléphone est déjà utilisé
    if (userData.telephone) {
      const phoneExists = await checkPhoneExists(userData.telephone, userData.id_personne);
      if (phoneExists) {
        return res.json({ success: false, message: "Téléphone déjà utilisé par un autre utilisateur" });
      }
    }

    const personUpdated = await updatePersonne(userData);
    const accountUpdated = await updateCompte(userData);

    if (personUpdated || accountUpdated) {
      return res.json({ success: true, message: "Informations mises à jour avec succès" });
    } else {
      return res.json({ success: false, message: "Aucune modification effectuée" });
    }

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};