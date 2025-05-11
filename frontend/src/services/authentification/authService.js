const API_URL = "http://localhost:3001/api/auth";

export const loginUser = async (email, password) => {
  try {

    const response = await fetch(`${API_URL}/login`, {
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

export const registerUser = async (cin, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cin, email, password }),
  });

  return await response.json();
};