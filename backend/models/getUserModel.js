import connection from '../config/connexion.js';

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
