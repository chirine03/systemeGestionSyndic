const API_URL = "http://localhost:3001/api/immeuble";

// ✅ Fonction pour récupérer la liste des immeubles
export const fetchListeImmeubles = async () => {
  try {
    const response = await fetch(`${API_URL}/liste-immeubles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Liste des immeubles :", result);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: "Impossible de récupérer la liste des immeubles." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des immeubles :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const SupprimerImmeuble = async (id_immeuble) => {
  try {
    const response = await fetch(`${API_URL}/supprimer-immeuble`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_immeuble }),
    });

    const result = await response.json();
    console.log("Résultat de la suppression :", result);

    if (result.success) {
      return { success: true, message: "Immeuble supprimé avec succès." };
    } else {
      return { success: false, message: result.message || "Erreur lors de la suppression." };
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'immeuble :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const ajouterImmeuble = async (immeuble) => {
  try {
    const response = await fetch(`${API_URL}/ajouter-immeuble`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(immeuble),
    });

    const result = await response.json();
    console.log("Résultat de l'ajout :", result);

    if (result.success) {
      return { success: true, message: "Immeuble ajouté avec succès.", id_immeuble: result.id_immeuble };
    } else {
      return { success: false, message: result.message || "Erreur lors de l'ajout." };
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'immeuble :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const modifierImmeuble = async (immeuble) => {
  try {
    console.log("Données à modifier :", immeuble); // Debugging line
    const response = await fetch(`${API_URL}/modifier-immeuble`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(immeuble),
    });

    const result = await response.json();
    console.log("Résultat de la modification :", result);

    if (result.success) {
      return { success: true, message: "Immeuble modifié avec succès." };
    } else {
      return { success: false, message: result.message || "Erreur lors de la modification." };
    }
  } catch (error) {
    console.error("Erreur lors de la modification de l'immeuble :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};