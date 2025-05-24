import {
  getTauxPaiementParImmeubleEtAnnee, 
  getRecetteActuelle, 
  getTotalDepense,
  getTauxDepensePrestataire, 
  getTotalDepensesParImmeuble,
  getEvolDepense,
  getDepensePayeNonPaye} from '../../models/statistiques/statistiquesModel.js'

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


export const TotalDepense = async (req, res) => {
  try {
    const montant = await getTotalDepense();
    res.json({
      status: "success",
      data: montant,
    });
  } catch (error) {
    console.error("Erreur dans Total Depense :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};


export const RecetteActuelle = async (req, res) => {
  try {
    const montant = await getRecetteActuelle();
    res.json({
      status: "success",
      data: montant,
    });
  } catch (error) {
    console.error("Erreur dans Recette Actuelle :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};


export const TotalDepensesParImmeuble = async (req, res) => {
  try {
    const rep = await getTotalDepensesParImmeuble();
    res.json({
      status: "success",
      data: rep,
    });
  } catch (error) {
    console.error("Erreur dans Total Depenses Par Immeuble :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};


export const TauxDepensePrestataire = async (req, res) => {
  try {
    const rep = await getTauxDepensePrestataire();
    res.json({
      status: "success",
      data: rep,
    });
  } catch (error) {
    console.error("Erreur dans Taux Depense Prestataire :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};


export const EvolDepense = async (req, res) => {
  try {
    const rep = await getEvolDepense();

    // Formater les dates
    const formattedData = rep.map((row) => ({
      ...row,
      date_depense: row.date_depense ? row.date_depense.toISOString().split('T')[0] : null,
    }));

    res.json({
      status: "success",
      data: formattedData,
    });
  } catch (error) {
    console.error("Erreur dans Evolution des Depense dans le temps :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};

export const DepensePayeNonPaye = async (req, res) => {
  try {
    const rep = await getDepensePayeNonPaye();
    res.json({
      status: "success",
      data: rep,
    });
  } catch (error) {
    console.error("Erreur dans DepensePayeNonPaye :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};

