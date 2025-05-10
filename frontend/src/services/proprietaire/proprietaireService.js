const API_URL = "http://localhost:3001/api/proprietaire";

// ✅ Fonction pour récupérer la liste des propriétaires
export const fetchListeProprietaires = async () => {
  try {
    const response = await fetch(`${API_URL}/liste-proprietaires`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Liste des propriétaires :", result);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: "Impossible de récupérer la liste des propriétaires." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des propriétaires :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Fonction pour ajouter un propriétaire
export const ajouterProprietaire = async (proprietaireData) => {
  try {
    const response = await fetch(`${API_URL}/ajouter-proprietaire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proprietaireData),
    });

    const result = await response.json();
    console.log("Résultat de l'ajout :", result);

    if (result.success) {
      return { success: true, message: "Propriétaire ajouté avec succès." };
    } else {
      return { success: false, message: result.message || "Échec de l'ajout." };
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du propriétaire :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Fonction pour modifier un propriétaire
export const modifierProprietaire = async (id_personne, proprietaireData) => {
  try {
    const response = await fetch(`${API_URL}/modifier-proprietaire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_personne, ...proprietaireData }),
    });

    const result = await response.json();
    console.log("Résultat de la modification :", result);

    if (result.success) {
      return { success: true, message: "Propriétaire modifié avec succès." };
    } else {
      return { success: false, message: result.message || "Échec de la modification." };
    }
  } catch (error) {
    console.error("Erreur lors de la modification du propriétaire :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// ✅ Fonction pour supprimer un propriétaire
export const supprimerProprietaire = async (id_personne) => {
  try {
    const response = await fetch(`${API_URL}/supprimer-proprietaire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_personne }),
    });

    const result = await response.json();
    console.log("Résultat de la suppression :", result);

    if (result.success) {
      return { success: true, message: "Propriétaire supprimé avec succès." };
    } else {
      return { success: false, message: result.message || "Échec de la suppression." };
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du propriétaire :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};