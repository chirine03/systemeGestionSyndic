import connection from '../../config/connexion.js';


export const getAllPersonnel = async () => {
  const [rows] = await connection.execute(
    `SELECT p.id_personne, p.nom, p.prenom, p.adresse, p.telephone, p.cin, p.date_nais,
            pr.post, pr.salaire
     FROM personne p
     JOIN personnel pr ON p.id_personne = pr.id_personne
     WHERE p.role = 'employe'`
  );
  return rows;
};


export const addPersonnel = async (personnel) => {
  const { nom, prenom, adresse, telephone, cin, date_nais, post, salaire } = personnel;

  // Insertion dans la table personne
  const [result] = await connection.execute(
    `INSERT INTO personne (nom, prenom, adresse, telephone, cin, date_nais, role) 
     VALUES (?, ?, ?, ?, ?, ?, 'employe')`,
    [nom, prenom, adresse, telephone, cin, date_nais]
  );

  const id_personne = result.insertId;

  // Insertion dans la table personnel avec l'ID généré
  await connection.execute(
    `INSERT INTO personnel (id_personne, post, salaire) VALUES (?, ?, ?)`,
    [id_personne, post, salaire]
  );

  return id_personne;
};

export const getInfosPersonnel = async (id_personne) => {
    const [rows] = await connection.execute(
        `SELECT p.telephone, p.cin
         FROM personne p
         WHERE p.id_personne = ?`, [id_personne]
    );
    return rows[0];
};

export const checkExisteInfos = async (cin, telephone) => {
    const [rows] = await connection.execute(
        `SELECT p.id_personne
         FROM personne p
         WHERE p.cin = ? OR p.telephone = ?`, [cin, telephone]
    );
    return rows.length > 0;
};

export const updatePersonnel = async (id_personne, personnel) => {
  const { nom, prenom, adresse, telephone, cin, date_nais, post, salaire } = personnel;

  // Mise à jour de la table personne
  const [result1] = await connection.execute(
    `UPDATE personne 
     SET nom = ?, prenom = ?, adresse = ?, telephone = ?, cin = ?, date_nais = ? 
     WHERE id_personne = ?`,
    [nom, prenom, adresse, telephone, cin, date_nais, id_personne]
  );

  // Mise à jour de la table personnel
  const [result2] = await connection.execute(
    `UPDATE personnel 
     SET post = ?, salaire = ? 
     WHERE id_personne = ?`,
    [post, salaire, id_personne]
  );

  return result1.affectedRows > 0 || result2.affectedRows > 0;
};

export const deletePersonnel = async (id_personne) => {
  // Supprimer d'abord de la table `personnel` (car dépendante)
  await connection.execute(
    `DELETE FROM personnel WHERE id_personne = ?`, [id_personne]
  );

  // Ensuite supprimer de la table `personne`
  const [result] = await connection.execute(
    `DELETE FROM personne WHERE id_personne = ?`, [id_personne]
  );

  return result.affectedRows > 0;
};

