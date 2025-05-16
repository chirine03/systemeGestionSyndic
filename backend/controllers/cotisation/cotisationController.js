import {
  getAppartements,
  getAnnees,
  getAppartementDetails,
  getNomPrenomById,
  getTrimestresPayes,
  isTrimestrePaye,
  getMontantAttendu,
  ajouterCotisation,
  getCotisationInfos,
  modifierCotisation,
  SuiviCotisations,
  getCotisations,
  getMaxPeriode,
  deleteCotisation,
  getSuiviGlobalCotisations
} from '../../models/cotisation/cotisationModel.js';

// Récupération des infos pour formulaire
export const getInfosCotisation = async (req, res) => {
  try {
    const appartements = await getAppartements();
    const annees = await getAnnees();

    return res.json({
      success: true,
      appartements,
      annees
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des cotisations :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

// Ajout d'une cotisation
export const ajouterNouvelleCotisation = async (req, res) => {
  const { numeroAppartement, periode, montant, typePayement, datePayement, annee } = req.body;

  try {
    const appartement = await getAppartementDetails(numeroAppartement);

    const { id_personne, espace_parking } = appartement;
    const proprietaire = await getNomPrenomById(id_personne);

    let trimestres = await getTrimestresPayes(numeroAppartement, annee);

    if (trimestres == 4) {
      return res.json({
        status: 'error',
        message: `Les 4 trimestres sont déjà payés pour ${annee}.`,
      });
    }

    const dejaPaye = await isTrimestrePaye(numeroAppartement, annee, periode);
    if (dejaPaye) {
      return res.json({
        status: 'error',
        message: `Le trimestre ${periode} est déjà payé pour ${annee}.`,
      });
    }

    const dernierTrimestre = parseInt(trimestres) || 0;
    if (periode !== String(dernierTrimestre + 1)) {
      return res.json({
        status: 'error',
        message: `Impossible d'ajouter le trimestre ${periode}, il ne suit pas l’ordre logique de paiement.`,
      });
    }

    const montantAttendu = await getMontantAttendu(annee, espace_parking);
    if (!montantAttendu) return res.json({ status: 'error', message: `Montant annuel non défini.` });

    if (parseFloat(montant) !== parseFloat(montantAttendu)) {
      return res.json({ status: 'error', message: `Montant incorrect. Attendu : ${montantAttendu}` });
    }

    const success = await ajouterCotisation({ montant, periode, typePayement, datePayement, numeroAppartement, annee });
    if (!success) {
      return res.json({ status: 'error', message: 'Erreur lors de l\'insertion.' });
    }

    res.json({
      status: 'success',
      message: 'Cotisation ajoutée avec succès.',
      proprietaire: { nom: proprietaire.nom, prenom: proprietaire.prenom }
    });

  } catch (error) {
    console.error('Erreur ajout cotisation :', error);
    res.status(500).json({ status: 'error', message: 'Erreur serveur.' });
  }
};

// 🔁 MODIFICATION d'une cotisation
export const modifierCotisationExistante = async (req, res) => {
  const {
    id_cotisation,
    montant,
    periode,
    type_payement,
    date_payement,
    num_appartement,
    annee,
  } = req.body;

  try {
    // Vérifier le montant attendu
    const appartement = await getAppartementDetails(num_appartement);
    const { espace_parking } = appartement;
    const montantAttendu = await getMontantAttendu(annee, espace_parking);

    if (parseFloat(montant) !== parseFloat(montantAttendu)) {
      return res.json({
        status: 'error',
        message: `Montant incorrect. Attendu : ${montantAttendu}`,
      });
    }

    // Récupérer les infos de cotisation actuelle
    const infos = await getCotisationInfos(id_cotisation);
    const {
      num_appartement: numApp,
      annee: anneeCotisation,
      periode: periodeCotisation,
    } = infos;

    // Si période/appartement/année changent, faire les vérifications nécessaires
    if (
      numApp != num_appartement ||
      anneeCotisation != annee ||
      periodeCotisation != periode
    ) {

      const maxPeriode = await getTrimestresPayes(num_appartement, annee);
      if (periode > maxPeriode || periode < maxPeriode) {
        return res.json({
          status: 'error',
          message: `Impossible de modifier vers le trimestre ${periode}, elle ne suit pas l’ordre logique de paiement.`,
        });
      }


      const dejaPaye = await isTrimestrePaye(num_appartement, annee, periode);
      if (dejaPaye) {
        return res.json({
          status: 'error',
          message: `Le trimestre ${periode} est déjà payé pour ${annee}.`,
        });
      }
    }

    // Mise à jour de la cotisation
    const cotisationData = {
      idCotisation: id_cotisation,
      numeroAppartement: num_appartement,
      periode,
      montant,
      typePayement: type_payement,
      datePayement: date_payement,
      annee,
    };

    const success = await modifierCotisation(cotisationData);

    if (!success) {
      return res.json({
        status: 'error',
        message: 'Erreur lors de la mise à jour.',
      });
    }

    res.json({
      status: 'success',
      message: 'Cotisation mise à jour avec succès.',
    });
  } catch (error) {
    console.error('Erreur modification cotisation :', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur.',
    });
  }
};


// 📊 Suivi global
export const getSuiviCotisation = async (req, res) => {
  try {
    const cotisations = await SuiviCotisations();
    res.json({
      status: "success",
      data: cotisations,
    });
  } catch (error) {
    console.error("Erreur dans getsuiviCotisation :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};

// 📋 Liste
export const getListeCotisations = async (req, res) => {
  try {
    const cotisations = await getCotisations();
    res.json({
      success: true,
      cotisations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur : " + error.message
    });
  }
};

// ❌ Suppression
export const supprimerCotisation = async (req, res) => {
  const { id_cotisation, periode, num_appartement, annee } = req.body;
  console.log('Requête reçue:', req.body);


  try {
    // Vérifier la période maximale
    const maxPeriode = await getMaxPeriode(num_appartement, annee);

    if (periode !== maxPeriode) {
      return res.status(400).json({
        status: "error",
        message: `Seule la dernière période (${maxPeriode}) peut être supprimée pour le moment.`,
      });
    }

    // Suppression autorisée
    const result = await deleteCotisation(id_cotisation);
    res.status(result.status === "success" ? 200 : 400).json(result);

  } catch (error) {
    console.error("Erreur lors de la suppression de la cotisation :", error);
    res.status(500).json({ status: "error", message: "Erreur interne du serveur." });
  }
};

// 📊 Suivi global des cotisations
export const getSuiviGlobal = async (req, res) => {
  try {
    const suiviGlobal = await getSuiviGlobalCotisations();
    res.json({
      status: "success",
      data: suiviGlobal,
    });
  } catch (error) {
    console.error("Erreur dans getSuiviGlobalCotisations :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur : " + error.message,
    });
  }
};