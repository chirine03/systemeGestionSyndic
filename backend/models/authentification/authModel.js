import connection from '../../config/connexion.js';

export const checkUserExiste = async (cin) => {
    const [rows] = await connection.execute(
        `SELECT c.id_compte, p.role FROM compte c, personne p 
        WHERE c.id_personne = p.id_personne 
        AND role = 'proprietaire'
        AND p.cin = ?`,[cin]
    ); 
    
    return rows.length > 0;
};

export const findUserByEmail = async (email) => {
  const [rows] = await connection.execute(
    `SELECT c.id_personne, c.mot_de_passe, p.role 
     FROM compte c, personne p
     WHERE c.id_personne = p.id_personne
     AND c.mail = ?`, 
    [email]
  );
  return rows[0];
};

export const checkCinExists = async (cin) => {
  const [rows] = await connection.execute(
    `SELECT id_personne 
    FROM personne 
    WHERE role = 'proprietaire' 
    AND cin = ?`,
    [cin]
  );
  
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
