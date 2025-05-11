const API_URL = "http://localhost:3001/api/personnel";

// ✅ Fonction pour récupérer la liste des propriétaires
export const fetchListePersonnel = async () => {
  try {
    const response = await fetch(`${API_URL}/liste-personnel`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Liste des personnel :", result);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: "Impossible de récupérer la liste des personnels." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des personnels :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};


export const ajouterPersonnel = async (personnelData) => {
  try {
    const response = await fetch(`${API_URL}/ajouter-personnel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personnelData),
    });

    const result = await response.json();
    console.log("Résultat de l'ajout :", result);

    if (result.success) {
      return { success: true, message: "personnel ajouté avec succès." };
    } else {
      return { success: false, message: result.message || "Échec de l'ajout." };
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du personnel :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const supprimerPersonnel = async (id_personne) => {
  try {
    const response = await fetch(`${API_URL}/supprimer-personnel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_personne }),
    });

    const result = await response.json();
    console.log("Résultat de la suppression :", result);

    if (result.success) {
      return { success: true, message: "Personnel supprimé avec succès." };
    } else {
      return { success: false, message: result.message || "Échec de la suppression." };
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du Personnel :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const modifierPersonnel = async (id_personne, personnelData) => {
  try {
    const response = await fetch(`${API_URL}/modifier-personnel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_personne, ...personnelData }),
    });

    const result = await response.json();
    console.log("Résultat de la modification :", result);

    if (result.success) {
      return { success: true, message: "Personnel modifié avec succès." };
    } else {
      return { success: false, message: result.message || "Échec de la modification." };
    }
  } catch (error) {
    console.error("Erreur lors de la modification du personnel :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};