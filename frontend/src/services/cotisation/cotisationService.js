const API_URL = "http://localhost:3001/api/cotisation";

export const fetchCotisationInfos = async () => {
  try {
    const response = await fetch(`${API_URL}/infos-cotisation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        appartements: result.appartements,
        annees: result.annees
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Cotisation fetch error:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Ajouter une cotisation
export const ajouterCotisation = async (cotisationData) => {
  try {
    const response = await fetch(`${API_URL}/ajouter-cotisation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cotisationData),
    });

    const result = await response.json();
    console.log(result); // Pour vérifier la structure du résultat
    return result;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la cotisation :", error);
    return { success: false, message: "Erreur lors de la requête." };
  }
};

//affiche table des cotisations
export const fetchSuiviCotisations = async () => {
  try {
    const response = await fetch(`${API_URL}/suivi-cotisation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Réponse du suivi cotisation :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Erreur lors du fetch du suivi :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Liste des cotisations (détails de chaque paiement)
export const fetchListeCotisation = async () => {
  try {
    const response = await fetch(`${API_URL}/liste-cotisations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Réponse du backend :", result);

    // Modifie la condition ici
    if (result.success) {
      return { success: true, cotisations: result.cotisations };
    } else {
      return { success: false, message: result.message || "Erreur inconnue." };
    }
  } catch (error) {
    console.error("Erreur lors du fetch des cotisations :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};


// ✅ Modifier une cotisation
export const modifierCotisation = async (cotisationData) => {
  try {
    const response = await fetch(`${API_URL}/modifier-cotisation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cotisationData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur lors de la modification de la cotisation :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};


// ✅ Supprimer une cotisation
export const supprimerCotisation = async (id_cotisation, periode, num_appartement, annee) => {
  try {
    const response = await fetch(`${API_URL}/supprimerCotisation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_cotisation, periode, num_appartement, annee }),
    });

    const result = await response.json();
    console.log("Réponse du backend pour la suppression :", result);

    return result;
  } catch (error) {
    console.error("Erreur lors de la suppression de la cotisation :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Récupérer le suivi globale par immeuble et par année
export const fetchSuiviGlobal = async () => {
  try {
    const response = await fetch(`${API_URL}/suivi-global`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("suivi global :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };  // format attendu par le frontend
    } else {
      return { success: false, message: result.message || "Erreur inconnue" };
    }
  } catch (error) {
    console.error("Erreur lors du fetch du suivi global :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};
