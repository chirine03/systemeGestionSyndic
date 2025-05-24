const API_URL = "http://localhost:3001/api/cotAnnuelle";


export const fetchListeCotAnnuelle = async () => {
  try {
    const response = await fetch(`${API_URL}/liste-cotisations-annuelle`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // Modifie la condition ici
    if (result.success) {
      return { success: true, cotannuelle: result.cotannuelle };
    } else {
      return { success: false, message: result.message || "Erreur inconnue." };
    }
  } catch (error) {
    console.error("Erreur lors du fetch des cotisations :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const fetchAjouterCotAnnuelle = async (cotisationData) => {
  try {
    const response = await fetch(`${API_URL}/ajouter-cotisation-annuelle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cotisationData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la cotisation annuelle :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const fetchSupprimerCotAnnuelle = async (annee) => {
  try {
    const response = await fetch(`${API_URL}/supprimer-cotisation-annuelle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ annee }),
    });

    const result = await response.json();
    console.log("Réponse du backend pour la suppression :", result);
    return result;
  } catch (error) {
    console.error("Erreur lors de la suppression de la cotisation annuelle :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
}

export const fetchModifierCotAnnuelle = async (cotisationData) => {
  try {
    const response = await fetch(`${API_URL}/modifier-cotisation-annuelle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cotisationData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur lors de la modification de la cotisation annuelle :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};