const API_URL = "http://localhost:3001/api/register";

export const registerUser = async (cin, email, password) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cin, email, password }),
  });

  return await response.json();
};
