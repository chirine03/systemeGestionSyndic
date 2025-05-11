import connection from '../../config/connexion.js';


export const findUserById = async (id_personne) => {
  const [rows] = await connection.execute(
    `SELECT p.nom, p.prenom, p.adresse, p.telephone, p.cin, p.date_nais, c.mail, c.mot_de_passe 
     FROM personne p
     JOIN compte c ON p.id_personne = c.id_personne
     WHERE p.id_personne = ?`,
    [id_personne]
  );

  return rows.length === 0 ? null : rows[0];
};

// César chiffrement
export const cesarEncrypt = (text, shift = 11) => {
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      return String.fromCharCode(
        ((char.charCodeAt(0) - base + shift) % 26) + base
      );
    }
    return char;
  }).join('');
};

const sanitizeValue = (value) => (value !== undefined ? value : null);

// 🔹 Vérifie si un email est déjà utilisé par un autre utilisateur
export const checkMailExists = async (email, id_personne) => {
  const [rows] = await connection.execute(
    'SELECT id_personne FROM compte WHERE mail = ? AND id_personne != ?',
    [email, id_personne]
  );
  return rows.length > 0;
};

// 🔹 Vérifie si un téléphone est déjà utilisé par un autre utilisateur
export const checkPhoneExists = async (telephone, id_personne) => {
  const [rows] = await connection.execute(
    'SELECT id_personne FROM personne WHERE telephone = ? AND id_personne != ?',
    [telephone, id_personne]
  );
  return rows.length > 0;
};

// 🔹 Mise à jour table personne
export const updatePersonne = async (userData) => {
  const { id_personne, nom, prenom, adresse, telephone, cin, date_nais } = userData;

  const [result] = await connection.execute(
    `UPDATE personne SET 
      nom = COALESCE(?, nom),
      prenom = COALESCE(?, prenom),
      adresse = COALESCE(?, adresse),
      telephone = COALESCE(?, telephone),
      cin = COALESCE(?, cin),
      date_nais = COALESCE(?, date_nais)
     WHERE id_personne = ?`,
    [
      sanitizeValue(nom),
      sanitizeValue(prenom),
      sanitizeValue(adresse),
      sanitizeValue(telephone),
      sanitizeValue(cin),
      sanitizeValue(date_nais),
      id_personne
    ]
  );

  return result.affectedRows > 0;
};

// 🔹 Mise à jour table compte
export const updateCompte = async (userData) => {
  const { id_personne, mail, mot_de_passe } = userData;

  const encryptedPassword = mot_de_passe
    ? cesarEncrypt(mot_de_passe)
    : null;

  const [result] = await connection.execute(
    `UPDATE compte SET 
      mail = COALESCE(?, mail),
      mot_de_passe = COALESCE(?, mot_de_passe)
     WHERE id_personne = ?`,
    [
      sanitizeValue(mail),
      sanitizeValue(encryptedPassword),
      id_personne
    ]
  );

  return result.affectedRows > 0;
};