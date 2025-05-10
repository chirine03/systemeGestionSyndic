import { getRaisonsSociales, getListeImmeubles, insertService, getServicesByPrestataire, getFacture, suppService } from '../../models/prestataires/servicesModel.js';


// Contrôleur : lister les raisons sociales des prestataires
export const getListeRaisonsSociales = async (req, res) => {
    try {
      const prestataires = await getRaisonsSociales();
      return res.json({ success: true, data: prestataires });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  };

export const listeImmeubles = async (req, res) => {
    try {
      const immeubles = await getListeImmeubles();
      return res.json({ success: true, data: immeubles });
    } catch (error) {
      console.error('Erreur dans getListeImmeublesController:', error); // 👈 ajoute ceci
      return res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  };


// Contrôleur : ajouter un service  
  export const addService = async (req, res) => {
    console.log('Données reçues :', req.body);
    const { nom, type, dateIntervention, referenceFacture, description, montant, id_prestataire, id_immeuble} = req.body;
  
    try {
      // 🔍 Vérifier si la référence de facture existe déjà
      const facture = await getFacture(referenceFacture);
      if (facture) {
        return res.json({
          success: false,
          message: 'Cette référence de facture existe déjà.'
        });
      }
  
      const serviceData = { nom, type, dateIntervention, referenceFacture, description, montant, id_prestataire, id_immeuble };
      const serviceId = await insertService(serviceData);
  
      return res.json({ success: true, message: 'Service ajouté avec succès.', serviceId });
    } catch (error) {
      console.error("Erreur lors de l'ajout du service :", error);
      return res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  };
  

  export const listeServices = async (req, res) => {
    const { id_prestataire } = req.params;
  
    if (!id_prestataire) {
      return res.status(400).json({ success: false, message: 'ID de prestataire manquant.' });
    }
  
    try {
      const services = await getServicesByPrestataire(id_prestataire);
  
      // Formater la date directement avec toLocaleDateString
      const formattedServices = services.map(service => ({
        ...service,
        date_intervention: new Date(service.date_intervention).toLocaleDateString('fr-FR')
      }));
  
      return res.json({ success: true, data: formattedServices });
    } catch (error) {
      console.error("Erreur lors de la récupération des services :", error);
      return res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  };
  

export const deleteService = async (req, res) => {
    const { id_service } = req.body;
  
    try {
      const result = await suppService(id_service);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Service non trouvé.' });
      }
      
      return res.json({ success: true, message: 'Service supprimé avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la suppression du service :", error);
      return res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
};  