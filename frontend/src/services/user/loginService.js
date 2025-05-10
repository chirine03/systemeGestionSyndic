const API_URL = "http://localhost:3001/api/login";

export const loginUser = async (email, password) => {
  try {
    console.log("Sending login request to:", API_URL);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      // ✅ Only store the JWT token here
      localStorage.setItem("token", result.token);

      // ✅ Return success, message and user info (from result.user)
      return {
        success: true,
        message: result.message,
        user: result.user
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
};
