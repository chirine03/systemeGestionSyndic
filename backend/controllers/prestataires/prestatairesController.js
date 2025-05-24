import { insertPrestataire, checkPrestataireExists1, getAllPrestataires, deletePrestataireById, updatePrestataireById, checkPrestataireExists2, checkPrestataireSupp } from '../../models/prestataires/prestatairesModel.js';

// Contrôleur : ajouter un nouveau prestataire
export const addPrestataire = async (req, res) => {
  const { raison_sociale, num_matricule, adresse, telephone, fax, email, site_web } = req.body;

  try {
    // Appelle uniquement les champs non nuls
    const existe = await checkPrestataireExists2({ email, telephone, num_matricule, fax });

    if (existe) {
      return res.json({ success: false, message: existe });
    }

    const prestataireData = { raison_sociale, num_matricule, adresse, telephone, fax, email, site_web };
    const prestataireId = await insertPrestataire(prestataireData);

    return res.json({ success: true, message: 'Prestataire ajouté avec succès.', prestataireId });
  } catch (error) {
    console.error("Erreur lors de l'ajout du prestataire :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};


// Contrôleur : lister tous les prestataires
export const getListePrestataire = async (req, res) => {
  try {
    const prestataires = await getAllPrestataires();
    return res.json({ success: true, data: prestataires });
  } catch (error) {
    console.error("Erreur lors de la récupération des prestataires :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// Contrôleur : supprimer un prestataire par ID
export const deletePrestataire = async (req, res) => {
  const { id_prestataire } = req.body;
  try {

    const existe = await checkPrestataireSupp(id_prestataire);

    if (existe) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer : ce prestataire est lié à un ou plusieurs services.',
      });
    }

    const deleted = await deletePrestataireById(id_prestataire);

    if (deleted) {
      res.status(200).json({ success: true, message: 'Prestataire supprimé avec succès.' });
    } else {
      res.status(404).json({ success: false, message: 'Prestataire non trouvé.' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du prestataire :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
  
  // Contrôleur : mise à jour d’un prestataire
export const updatePrestataire = async (req, res) => {
  const { id_prestataire, raison_sociale, num_matricule, adresse, telephone, fax, email, site_web } = req.body;

  try {
    // Appel du modèle avec un objet, adapté à la nouvelle syntaxe
    const existe = await checkPrestataireExists1({ email, telephone, num_matricule, fax, id_prestataire });

    if (existe) {
      return res.json({ success: false, message: existe });
    }

    const prestataireData = { raison_sociale, num_matricule, adresse, telephone, fax, email, site_web };
    const updated = await updatePrestataireById(id_prestataire, prestataireData);

    if (updated) {
      return res.json({ success: true, message: 'Prestataire mis à jour avec succès.' });
    } else {
      return res.json({ success: false, message: 'Mise à jour échouée ou ID introuvable.' });
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour du prestataire :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
