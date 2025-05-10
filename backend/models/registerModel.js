import connection from '../config/connexion.js';

export const checkCinExists = async (cin) => {
  const [rows] = await connection.execute('SELECT id_personne FROM personne WHERE cin = ?', [cin]);
  if (rows.length === 0) return null;
  return rows[0].id_personne;
};

export const checkMailExists = async (email) => {
    const [rows] = await connection.execute('SELECT id_compte FROM compte WHERE mail = ?', [email]);
    if (rows.length === 0) return false;
    return true;
  };

export const createAccount = async (id_personne, email, encryptedPassword) => {
    console.log("Creating account with:", id_personne, email, encryptedPassword);
    await connection.execute(
      'INSERT INTO compte (mail,mot_de_passe,id_personne,date_creation) VALUES (?,?,?,NOW())',
      [email,encryptedPassword,id_personne]
    );
  };
  
