const API_URL = "http://localhost:3001/api/prestataires";

// ✅ Fonction pour ajouter un prestataire
export const addPrestataire = async (prestataireData) => {
  return await envoyerRequete(`${API_URL}/addPrestataire`, prestataireData);
};

// ✅ Fonction pour modifier un prestataire
export const updatePrestataire = async (prestataireData) => {
    console.log("Reçu dans le service :", prestataireData);
  return await envoyerRequete(`${API_URL}/updatePrestataire`, prestataireData);
  
};

// ✅ Fonction pour récupérer la liste des prestataires
export const getListePrestataire = async () => {
  try {
    const response = await fetch(`${API_URL}/ListePrestataire`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Liste des prestataires :", result);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: "Impossible de récupérer la liste des prestataires." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des prestataires :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Fonction pour supprimer un prestataire
export const deletePrestataire = async (id_prestataire) => {
  try {
    const response = await fetch(`${API_URL}/deletePrestataire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_prestataire }),
    });

    const result = await response.json();
    console.log('Réponse du serveur:', result);

    if (result.success) {
      return { success: true, message: 'Prestataire supprimé avec succès.' };
    } else {
      return { success: false, message: result.message || 'Erreur lors de la suppression du prestataire.' };
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du prestataire:', error);
    return { success: false, message: 'Erreur réseau. Veuillez réessayer plus tard.' };
  }
};

// 🔁 Fonction réutilisable pour POST (ajout ou mise à jour)
const envoyerRequete = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Réponse du serveur:", result);

    if (result.success) {
      return { success: true, message: result.message };
    } else {
      // Gestion centralisée des messages d’erreur
      switch (result.message) {
        case 'Un prestataire avec cet email existe déjà.':
        case 'Un prestataire avec ce numéro de téléphone existe déjà.':
        case 'Un prestataire avec ce matricule existe déjà.':
        case 'Un prestataire avec ce fax existe déjà.':
        case 'Certains champs sont manquants. Raison sociale, matricule et email sont obligatoires.':
          return { success: false, message: result.message };
        case 'Erreur serveur.':
          return { success: false, message: "Erreur serveur. Veuillez réessayer plus tard." };
        default:
          return { success: false, message: "Une erreur inconnue est survenue. Veuillez réessayer." };
      }
    }
  } catch (error) {
    console.error("Erreur lors de la requête prestataire:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};
