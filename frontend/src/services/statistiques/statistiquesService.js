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
