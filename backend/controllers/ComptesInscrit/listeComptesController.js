import { getAllComptes } from '../../models/ComptesInscrit/listeComptesModel.js';

// ✅ Fonction de déchiffrement
const cesarDecrypt = (text, shift = 11) => {
  const shiftVal = 26 - shift;
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - base + shiftVal) % 26) + base);
    }
    return char;
  }).join('');
};

// ✅ Fonction pour formater la date au format JJ/MM/AAAA
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// ✅ Contrôleur
export const getListeComptes = async (req, res) => {
  try {
    const comptes = await getAllComptes();

    const comptesDecryptes = comptes.map(compte => ({
      ...compte,
      mot_de_passe: compte.mot_de_passe ? cesarDecrypt(compte.mot_de_passe) : '',
      date_creation: compte.date_creation ? formatDate(compte.date_creation) : null,
    }));

    return res.json({ success: true, comptes: comptesDecryptes });
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
