import { getCotisationAnnuelle, checkExiste, deleteCotAnnuelle, updateCotAnnuelle, addCotisationAnnuelle, checkAnneeExiste } from '../../models/cotAnnuelle/cotAnnuelleModel.js';

export const getListeCotisationAnnuelle = async (req, res) => {
  try {
    const cotannuelle = await getCotisationAnnuelle();
    res.json({
      success: true,
      cotannuelle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur : " + error.message
    });
  }
};

export const ajouterCotAnnuelle = async (req, res) => {
  const { annee, montant_avec_parking, montant_sans_parking } = req.body;
  try {
    const existe = await checkAnneeExiste(annee);
    if (existe) {
      return res.json({
        success: false,
        message: "La cotisation annuelle pour cette année existe déjà."
      });
    }
    const result = await addCotisationAnnuelle(annee, montant_avec_parking, montant_sans_parking);
    if (result) {
      return res.json({
        success: true,
        message: "Cotisation annuelle ajoutée avec succès."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur : " + error.message
    });
  }
}

export const supprimerCotAnnuelle = async (req, res) => {
  const { annee } = req.body;
  try {
    const existe = await checkExiste(annee);
    if (existe) {
      return res.json({
        success: false,
        message: "Impossible de supprimer la cotisation annuelle, elle est liée à des paiements."
      });
    }
    const deleted = await deleteCotAnnuelle(annee);
    if (deleted) {
      return res.json({
        success: true,
        message: "Cotisation annuelle supprimée avec succès."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur : " + error.message
    });
  }
};


export const modifierCotAnnuelle = async (req, res) => {
  const { annee, montant_avec_parking, montant_sans_parking } = req.body;
  try {
    const updated = await updateCotAnnuelle(annee, montant_avec_parking, montant_sans_parking);
    if (updated) {
      return res.json({
        success: true,
        message: "Cotisation annuelle mise à jour avec succès."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur : " + error.message
    });
  }
};