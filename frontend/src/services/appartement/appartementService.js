const API_URL = "http://localhost:3001/api/appartement";

// ✅ Fonction pour récupérer la liste des appartements

export const fetchListeAppartements = async () => {
  try {
    const response = await fetch(`${API_URL}/liste-appartements`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Liste des appartements :", result);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: "Impossible de récupérer la liste des appartements." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des appartements :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
}

// fonction pour récupérer les infos des immeubles et des propriétaires
export const fetchInfos = async () => {
  try {
    const response = await fetch(`${API_URL}/infos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Infos des immeubles et propriétaires :", result);

    if (result) {
      return { success: true, data: result };
    } else {
      return { success: false, message: "Impossible de récupérer les infos." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des infos :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const ajouterAppartement = async (appartementData) => {
    try {
        const response = await fetch(`${API_URL}/ajouter-appartement`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appartement: appartementData }),
        });
    
        const result = await response.json();
        console.log("Résultat de l'ajout :", result);
    
        if (result.success) {
        return { success: true, message: "Appartement ajouté avec succès." };
        } else {
        return { success: false, message: result.message || "Échec de l'ajout." };
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'appartement :", error);
        return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
    }
};


export const modifierAppartement = async (appartement) => {
  try {
    console.log("Données à modifier :", appartement); // Debugging line
    const response = await fetch(`${API_URL}/modifier-appartement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appartement),
    });

    const result = await response.json();
    console.log("Résultat de la modification :", result);

    if (result.success) {
      return { success: true, message: "appartement modifié avec succès." };
    } else {
      return { success: false, message: result.message || "Erreur lors de la modification." };
    }
  } catch (error) {
    console.error("Erreur lors de la modification de l'appartement :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};


export const supprimerAppartement = async (num_appartement) => {
    try {
      const response = await fetch(`${API_URL}/supprimer-appartement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ num_appartement }),
      });
  
      const result = await response.json();
      console.log("Résultat de la suppression :", result);
  
      if (result.success) {
        return { success: true, message: "Appartement supprimé avec succès." };
      } else {
        return { success: false, message: result.message || "Échec de la suppression." };
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'appartement :", error);
      return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
    }
  };
