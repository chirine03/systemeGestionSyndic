import connection from '../../config/connexion.js';

export const getAllComptes = async () => {
  const [rows] = await connection.execute(
    `SELECT c.id_compte, c.mail, c.mot_de_passe, c.date_creation, c.id_personne, p.role
     FROM compte c
     JOIN personne p ON c.id_personne = p.id_personne`
  );

  return rows;
};
