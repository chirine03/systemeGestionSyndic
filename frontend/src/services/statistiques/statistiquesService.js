const API_URL = "http://localhost:3001/api/statistiques";

export const fetchTauxPaiements = async () => {
  try {
    const response = await fetch(`${API_URL}/taux-paiements`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("taux des paiement :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message || "Erreur inconnue" };
    }
  } catch (error) {
    console.error("Erreur lors du fetch du taux de paiements :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const fetchRecetteActuelle = async () => {
  try {
    const response = await fetch(`${API_URL}/recette-actuelle`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("recette actuelle :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message || "Erreur inconnue" };
    }
  } catch (error) {
    console.error("Erreur lors du fetch du recette actuelle:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const fetchTotalDepense = async () => {
  try {
    const response = await fetch(`${API_URL}/total-depense`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("total depense :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message || "Erreur inconnue" };
    }
  } catch (error) {
    console.error("Erreur lors du fetch du total depense :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};


export const fetchTauxDepensePrestataire = async () => {
  try {
    const response = await fetch(`${API_URL}/taux-depense-prestataire`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("total depense :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message || "Erreur inconnue" };
    }
  } catch (error) {
    console.error("Erreur lors du fetch du Taux depense par Prestataire:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const fetchTotalDepensesParImmeuble = async () => {
  try {
    const response = await fetch(`${API_URL}/total-depenses-immeuble`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("total depense :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message || "Erreur inconnue" };
    }
  } catch (error) {
    console.error("Erreur lors du fetch du Taux depense par Prestataire:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};



export const fetchEvolDepense = async () => {
  try {
    const response = await fetch(`${API_URL}/evol-depense`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("total depense :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message || "Erreur inconnue" };
    }
  } catch (error) {
    console.error("Erreur lors du fetch Evolution depense dans le temps:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};


export const fetchDepensePayeNonPaye = async () => {
  try {
    const response = await fetch(`${API_URL}/depense-paye-non-paye`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("total depense :", result);

    if (result.status === "success") {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message || "Erreur inconnue" };
    }
  } catch (error) {
    console.error("Erreur lors du fetch DepensePayeNonPaye:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};