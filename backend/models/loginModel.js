import connection from '../config/connexion.js';  

// Function to find user by email
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
