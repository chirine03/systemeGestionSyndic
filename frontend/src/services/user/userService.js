const API_URL = "http://localhost:3001/api/user";

export const fetchUserData = async (id_personne) => {
  try {
    console.log("Fetching user data from:", API_URL);

    const response = await fetch(`${API_URL}/get-user-Data?id_personne=${id_personne}`, {
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

export const updateUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/update-user`, {
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