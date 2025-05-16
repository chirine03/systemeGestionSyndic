import {getTauxPaiementParImmeubleEtAnnee} from '../../models/statistiques/statistiquesModel.js'

export const TauxPaiementParImmeubleEtAnnee = async (req, res) => {
  try {
    const tauxPaiements = await getTauxPaiementParImmeubleEtAnnee();
    res.json({
      status: "success",
      data: tauxPaiements,
    });
  } catch (error) {
    console.error("Erreur dans getTauxPaiementParImmeubleEtAnnee :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};