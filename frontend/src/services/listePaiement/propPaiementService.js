// services/paiementService.js
const API_URL = "http://localhost:3001/api/listePaiement";

export const fetchListePaiements = async (id_personne) => {
  try {
    const response = await fetch(`${API_URL}?id_personne=${id_personne}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Response from server:", result);

    if (result.success) {
      return {
        success: true,
        paiements: result.paiements,
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Paiements fetch error:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};
