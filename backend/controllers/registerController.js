import { checkCinExists, createAccount, checkMailExists } from '../models/registerModel.js';

// Caesar cipher encryption (as you had it)
function cesarEncrypt(text, shift = 11) {
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 'A' : 'a';
      return String.fromCharCode((char.charCodeAt(0) - base.charCodeAt(0) + shift) % 26 + base.charCodeAt(0));
    }
    return char;
  }).join('');
}

export const registerUser = async (req, res) => {
  const { cin, email, password } = req.body;

  console.log("Received register request:", { cin, email, password });

  if (!cin || !email || !password) {
    return res.json({ success: false, message: "Tous les champs sont requis." });
  }

  try {
    console.log("Received data:", { cin, email, password });

    const id_personne = await checkCinExists(cin);
    console.log("CIN found with id_personne:", id_personne);

    if (!id_personne) {
      return res.json({ success: false, message: "Le CIN n'existe pas." });
    }

    const mailExists = await checkMailExists(email);
    if (mailExists) {
      return res.json({ success: false, message: "Cet email est déjà utilisé." });
    }

    const encryptedPassword = cesarEncrypt(password);
    console.log("Encrypted password:", encryptedPassword);

    await createAccount(id_personne, email, encryptedPassword);
    console.log("Account created successfully.");

    res.json({ success: true, message: "Inscription réussie !" });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.json({ success: false, message: "Erreur lors de l'inscription." });
  }
};
