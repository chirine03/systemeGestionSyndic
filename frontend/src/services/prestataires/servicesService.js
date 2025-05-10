const API_URL = "http://localhost:3001/api/services";


export const getListeRaisonsSociales = async () => {
  try {
    const response = await fetch(`${API_URL}/ListeRaisonsSociales`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Liste des raisons sociales :", result);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: "Impossible de récupérer la liste des raisons sociales." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des raisons sociales :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const getListeImmeubles = async () => {
  try {
    const response = await fetch(`${API_URL}/ListeImmeubles`, {
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


export const insertService = async (serviceData) => {
  try {
    console.log("Données du service à insérer :", serviceData);
    const response = await fetch(`${API_URL}/addService`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    const result = await response.json();
    console.log("Résultat de l'insertion du service :", result);

    if (result.success) {
      return { success: true, message: result.message, serviceId: result.serviceId };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Erreur lors de l'insertion du service :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

// Récupérer les services d'un prestataire via son ID
export const getServicesByPrestataire = async (id_prestataire) => {
  try {
    const response = await fetch(`${API_URL}/listeServices/${id_prestataire}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Services récupérés :", result);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: "Impossible de récupérer les services du prestataire." };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des services :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};

export const deleteService = async (id_service) => { 
  try {
    const response = await fetch(`${API_URL}/deleteService`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_service }),
    });

    const result = await response.json();
    console.log("Résultat de la suppression du service :", result);

    if (result.success) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du service :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};