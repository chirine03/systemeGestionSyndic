import { getServicesSansDepense, 
  insertDepense, 
  updatePayeService,
  getListeDepense,
  deleteDepense,
  UpdateEtatService,
  checkMontantService,
  getSuiviDepenseGlobal,
  getSuiviServiceGlobale  } from '../../models/depense/depenseModel.js';

// Récupérer les services sans dépense
export const getListeServicesSansDepense = async (req, res) => {
  try {
    const services = await getServicesSansDepense();
    console.log("Services sans dépense récupérés :", services);

    //if (!services || services.length === 0) {
      //return res.json({ success: false, message: 'Aucun service disponible sans dépense.' });
    //}

    return res.json({ success: true, services });
  } catch (error) {
    console.error("Erreur lors de la récupération des services sans dépense :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// Ajouter une nouvelle dépense
export const addDepense = async (req, res) => {
  try {
    const { motif, categorie, montant, date, type_paiement, id_service } = req.body;
    if (id_service){
      const montantService = await checkMontantService(id_service);
      if (montant != montantService) {
        return res.json({ 
          success: false, 
          message: `Le montant de la dépense est incorrect. Montant attendu : ${montantService}` 
        });
      }
  }const depenseId = await insertDepense({ motif, categorie, montant, date, type_paiement, id_service });

    // Mise à jour du service comme payé
    await updatePayeService(id_service);

    return res.json({
      success: true,
      message: 'Dépense ajoutée et service marqué comme payé.',
      depenseId
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la dépense :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};


// Récupérer la liste des dépenses

export const listeDepenses = async (req, res) => {
  try {
    const depenses = await getListeDepense();
    console.log("controller dépenses récupérées :", depenses);

    return res.json({ success: true, depenses });
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// Supprimer une dépense par id
export const supprimerDepense = async (req, res) => {
  const { id_depense, id_service } = req.body;
  
  try {
    // Vérifiez si id_service est fourni
    if (id_service) {
      // Si id_service est non null, mettre à jour l'état du service avant de supprimer la dépense
      const updateResult = await UpdateEtatService(id_service);
      if (!updateResult) {
        return res.status(400).json({ success: false, message: 'Échec de la mise à jour de l\'état du service.' });
      }
    }

    // Effectuer la suppression de la dépense
    const result = await deleteDepense(id_depense);
    if (result) {
      return res.json({ success: true, message: 'Dépense supprimée avec succès.' });
    } else {
      return res.status(404).json({ success: false, message: 'Dépense non trouvée.' });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la dépense :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// Récupérer le suivi des dépenses globales
export const suiviDepenseGlobal = async (req, res) => {
  try {
    const depenses = await getSuiviDepenseGlobal();
    console.log("Dépenses globales récupérées :", depenses);

    return res.json({ success: true, depenses });
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses globales :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

export const suiviServiceGlobale = async (req, res) => {
  try {
    const services = await getSuiviServiceGlobale();
    console.log("Services globaux récupérés :", services);

    return res.json({ success: true, services });
  } catch (error) {
    console.error("Erreur lors de la récupération des services globaux :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};