const API_URL = "http://localhost:3001/api/update-user";

export const updateUser = async (userData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};
