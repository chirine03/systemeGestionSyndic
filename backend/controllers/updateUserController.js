import {
  updatePersonne,
  updateCompte,
  checkMailExists,
  checkPhoneExists
} from '../models/updateUserModel.js';

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
