import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { checkUserExiste,findUserByEmail, checkCinExists, createAccount, checkMailExists } from '../../models/authentification/authModel.js';

dotenv.config();

// ✅ Caesar cipher decryption function
const cesarDecrypt = (text, shift = 11) => {
  const shiftVal = 26 - shift;
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      return String.fromCharCode(
        ((char.charCodeAt(0) - base + shiftVal) % 26) + base
      );
    }
    return char;
  }).join('');
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;


  try {
    const user = await findUserByEmail(email);
    
    console.log("✅ User found:", user);


    if (!user) {
      return res.json({ success: false, message: 'Email non trouvé.' });
    }

    // ✅ Decrypt the stored password and compare
    const decryptedPassword = cesarDecrypt(user.mot_de_passe);

    if (password === decryptedPassword) {
      // ✅ Generate JWT token with id and role
      const token = jwt.sign(
        { id_personne: user.id_personne, role: user.role },
        process.env.JWT_SECRET,
      );

      // ✅ Send token and user info back
      return res.json({
        success: true,
        message: 'Connexion réussie !',
        token,
        user: {
            id_personne: user.id_personne,
            role: user.role
            }
      });
    } else {
      return res.json({ success: false, message: 'Mot de passe incorrect.' });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};


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

  try {

    const existe = await checkUserExiste (cin);
    if (existe) {
      return res.json({ success: false, message: "Ce utilisateur avoire déjà un compte !" });
    }

    const id_personne = await checkCinExists(cin);
    if (!id_personne) {
      return res.json({ success: false, message: "Identifiants invalide !." });
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
