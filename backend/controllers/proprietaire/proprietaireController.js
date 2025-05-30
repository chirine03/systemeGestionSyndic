import {getAllProprietaire, addProprietaire, getInfosProprietaire, checkExisteInfos, updateProprietaire, getPropAppartement, deleteProprietaire } from '../../models/proprietaire/proprietaireModel.js';

export const ajouterProprietaire = async (req, res) => {
    const { nom, prenom, adresse, telephone, cin, date_nais } = req.body;
  
    try {
      const existe = await checkExisteInfos(cin, telephone);
  
      if (existe) {
        return res.json({ success: false, message: "CIN ou téléphone déjà utilisé." });
      }
  
      await addProprietaire({ nom, prenom, adresse, telephone, cin, date_nais });
  
      return res.json({ success: true, message: "Propriétaire ajouté."});
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };



export const getListeProprietaire = async (req, res) => {
    try {
        const proprietaires = await getAllProprietaire();
        return res.json({ success: true, data: proprietaires });
      } catch (error) {
        console.error("Erreur lors de la récupération des proprietaires :", error);
        return res.status(500).json({ success: false, message: 'Erreur serveur.' });
      };
};


export const modifierProprietaire = async (req, res) => {
    try {
      const { id_personne, nom, prenom, adresse, telephone, cin, date_nais } = req.body;
  
      const infosActuelles = await getInfosProprietaire(id_personne);
  
      if (infosActuelles.cin === cin && infosActuelles.telephone === telephone) {
        const success = await updateProprietaire(id_personne, { nom, prenom, adresse, telephone, cin, date_nais });
        return success
          ? res.json({ success, message: "Propriétaire mis à jour." })
          : res.json({ success: false, message: "Échec de la mise à jour." });
      }
  
      const existe = await checkExisteInfos(cin, telephone, id_personne);
  
      if (existe) {
        return res.json({ success: false, message: "CIN ou téléphone déjà utilisé." });
      }
  
      const success = await updateProprietaire(id_personne, { nom, prenom, adresse, telephone, cin, date_nais });
  
      return success
        ? res.json({ success, message: "Propriétaire mis à jour." })
        : res.json({ success: false, message: "Échec de la mise à jour." }); // 🔧 correction ici
  
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  

export const supprimerProprietaire = async (req, res) => {
    const { id_personne } = req.body;
    if (!id_personne) {
        return res.status(400).json({ success: false, message: "id_personne est requis." });
      }
      
  
    try {
      const existe = await getPropAppartement(id_personne);
  
      if (existe) {
        return res.json({ success: false, message: "Impossible de supprimer : le propriétaire est lié à des appartements." });
      }
  
      const success = await deleteProprietaire(id_personne);
  
      return success
        ? res.json({ success, message: "Propriétaire supprimé." })
        : res.json({ success: false, message: "Échec de la suppression." });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
};  