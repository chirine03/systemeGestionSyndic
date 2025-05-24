// controllers/paiementController.js
import { getPaiementData} from '../../models/listePaiement/propPaiementModel.js';

// ✅ Contrôleur pour récupérer les paiements d’un propriétaire
export const getListePaiement = async (req, res) => {
  const { id_personne } = req.query;

  if (!id_personne) {
    return res.json({ success: false, message: 'ID utilisateur non fourni.' });
  }

  try {
    const paiements = await getPaiementData(id_personne);

    if (!paiements || paiements.length === 0) {
      return res.json({ success: false, message: 'Aucun appartement trouvé pour le moment.' });
    }

    return res.json({ success: true, paiements });
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
