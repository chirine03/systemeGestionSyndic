const API_URL = "http://localhost:3001/api/comptes";

export const fetchListeComptes = async () => {
  try {

    const response = await fetch(`${API_URL}/listeComptes`, {
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
        comptes: result.comptes,
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Liste comptes fetch error:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};
