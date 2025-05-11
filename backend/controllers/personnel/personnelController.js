import {getAllPersonnel, addPersonnel, getInfosPersonnel, checkExisteInfos, updatePersonnel, deletePersonnel } from '../../models/personnel/personnelModel.js';


export const ajouterPersonnel= async (req, res) => {
    const { nom, prenom, adresse, telephone, cin, date_nais, post, salaire } = req.body;
  
    try {
      const existe = await checkExisteInfos(cin, telephone);
  
      if (existe) {
        return res.json({ success: false, message: "CIN ou téléphone déjà utilisé." });
      }
  
      await addPersonnel({ nom, prenom, adresse, telephone, cin, date_nais, post, salaire });
  
      return res.json({ success: true, message: "Personnel ajouté."});
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };


  export const getListePersonnel = async (req, res) => {
      try {
          const personnel = await getAllPersonnel();
          return res.json({ success: true, data: personnel });
        } catch (error) {
          console.error("Erreur lors de la récupération des personnel :", error);
          return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        };
  };


  export const modifierPersonnel = async (req, res) => {
      try {
        const { id_personne, nom, prenom, adresse, telephone, cin, date_nais, post, salaire } = req.body;
    
        const infosActuelles = await getInfosPersonnel(id_personne);
    
        if (infosActuelles.cin === cin && infosActuelles.telephone === telephone) {
          const success = await updateProprietaire(id_personne, { nom, prenom, adresse, telephone, cin, date_nais });
          return success
            ? res.json({ success, message: "Personnel mis à jour." })
            : res.json({ success: false, message: "Échec de la mise à jour." });
        }
    
        const existe = await checkExisteInfos(cin, telephone);
    
        if (existe) {
          return res.json({ success: false, message: "CIN ou téléphone déjà utilisé." });
        }
    
        const success = await updatePersonnel(id_personne, { nom, prenom, adresse, telephone, cin, date_nais, post, salaire });
    
        return success
          ? res.json({ success, message: "Personnel mis à jour." })
          : res.json({ success: false, message: "Échec de la mise à jour." });
    
      } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ message: "Erreur serveur." });
      }
    };

export const supprimerPersonnel = async (req, res) => {
    const { id_personne } = req.body;
      
    try {
      const success = await deletePersonnel(id_personne);
  
      return success
        ? res.json({ success, message: "Personnel supprimé." })
        : res.json({ success: false, message: "Échec de la suppression." });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
};     