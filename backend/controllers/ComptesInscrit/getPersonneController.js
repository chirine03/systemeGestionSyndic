import { getPersonneById } from '../../models/ComptesInscrit/getPersonneModel.js';

export const getPersonne = async (req, res) => {
  const { id } = req.params;

  try {
    const personne = await getPersonneById(id);

    if (!personne) {
      return res.status(404).json({ success: false, message: "Personne non trouvée." });
    }

    return res.json({ success: true, personne });
  } catch (error) {
    console.error("❌ Erreur dans getPersonne :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};
