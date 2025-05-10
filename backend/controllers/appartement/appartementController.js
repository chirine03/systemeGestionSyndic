import {getListeAppartement, getImmeubleInfos, getProprietaireInfos, checkNumApprtExsiste, addAppartement, checkApprtExsiste, deleteAppartement} from "../../models/appartement/appartementModel.js";   

export const listeAppartement = async (req, res) => {
    try {
        const appartements = await getListeAppartement();
        return res.json({ success: true, data: appartements });
      } catch (error) {
        console.error("Erreur lors de la récupération des appartements :", error);
        return res.status(500).json({ success: false, message: 'Erreur serveur.' });
      };
};

export const getInfos = async (req, res) => {
    try {
      const [immeubles, proprietaires] = await Promise.all([
        getImmeubleInfos(),
        getProprietaireInfos()
      ]);
  
      res.json({
        immeubles,
        proprietaires
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des infos :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

  export const ajouterAppartement = async (req, res) => {
    const appartement = req.body.appartement;
  
    try {
      const existe = await checkNumApprtExsiste(appartement.num_appartement);
  
      if (existe) {
        return res.json({ success: false, message: "Numéro d'appartement déjà utilisé." });
      }
  
      const id_appartement = await addAppartement(appartement);
  
      return res.json({ success: true, message: "Appartement ajouté." });
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
export const supprimerAppartement = async (req, res) => {
  const { num_appartement } = req.body; // On extrait correctement la valeur

  try {
    // On passe uniquement la valeur string
    const existe = await checkApprtExsiste(num_appartement); 

    if (existe) {
      return res.json({ success: false, message: "Attention! Cet appartement est lié à plusieurs cotisations." });
    }

    const result = await deleteAppartement(num_appartement); 

    console.log("Résultat suppression :", result);
    console.log("Appartement à supprimer :", num_appartement); 

    if (result) {
      return res.json({ success: true, message: "Appartement supprimé avec succès." });
    } else {
      return res.json({ success: false, message: "Échec de la suppression." });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

  
  