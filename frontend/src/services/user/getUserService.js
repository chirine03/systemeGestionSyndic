const API_URL = "http://localhost:3001/api/getUserData";

export const fetchUserData = async (id_personne) => {
  try {
    console.log("Fetching user data from:", API_URL);

    const response = await fetch(`${API_URL}?id_personne=${id_personne}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        userData: result.userData
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("User fetch error:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};
