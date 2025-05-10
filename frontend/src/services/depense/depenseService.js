const API_URL = "http://localhost:3001/api/depense";

// ✅ Fonction pour récupérer la liste des services sans dépense
export const getListeServicesSansDepense = async () => {
  try {
    const response = await fetch(`${API_URL}/services-sans-depense`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Liste des services sans dépense :", result);

    if (result.success) {
      return { success: true, data: result.services };
    } else {
      return { success: false, message: "Impossible de récupérer la liste des services." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des services :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Fonction pour ajouter une dépense
export const ajouterDepense = async (data) => {
  try {
    const response = await fetch(`${API_URL}/ajouter-depense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // On envoie les données sous forme JSON
    });

    const result = await response.json();
    console.log("Réponse de l'ajout de la dépense :", result);

    if (result.success) {
      return { success: true, message: "Dépense ajoutée avec succès !" };
    } else {
      // Si le backend renvoie un message d'erreur spécifique, utilisez-le
      return { success: false, message: result.message || "Impossible d'ajouter la dépense." };
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la dépense :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};


// ✅ Fonction pour récupérer la liste des dépenses
export const fetchListeDepenses = async () => {
  try {
    const response = await fetch(`${API_URL}/liste-depenses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Liste des dépenses :", result);

    if (result.success) {
      return { success: true, data: result.depenses };
    } else {
      return { success: false, message: "Impossible de récupérer la liste des dépenses." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};


// ✅ Fonction pour supprimer une dépense
export const supprimerDepense = async (id_depense, id_service) => {
  try {
    const response = await fetch(`${API_URL}/supprimer-depense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_depense, id_service }), 
    });

    const result = await response.json();
    console.log("Réponse de la suppression de la dépense :", result);

    if (result.success) {
      return { success: true, message: "Dépense supprimée avec succès !" };
    } else {
      return { success: false, message: "Impossible de supprimer la dépense." };
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la dépense :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Fonction pour récupérer le suivi des dépenses globales
export const fetchSuiviDepenseGlobal = async () => {
  try {
    const response = await fetch(`${API_URL}/suivi-depense-global`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Suivi des dépenses globales :", result);

    if (result.success) {
      return { success: true, data: result.depenses };
    } else {
      return { success: false, message: "Impossible de récupérer le suivi des dépenses." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du suivi des dépenses :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Fonction pour récupérer le suivi des services globales
export const fetchSuiviServiceGlobale = async () => {
  try {
    const response = await fetch(`${API_URL}/suivi-service-global`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Suivi des services globales :", result);

    if (result.success) {
      return { success: true, data: result.services };
    } else {
      return { success: false, message: "Impossible de récupérer le suivi des services." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du suivi des services :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};