const API_URL = "http://localhost:3001/api";

export const fetchPersonneById = async (id_personne) => {
  try {
    const response = await fetch(`${API_URL}/personne/${id_personne}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("📦 Données de la personne :", result);

    if (result.success) {
      return { success: true, personne: result.personne };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("❌ Erreur de récupération de la personne :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};
