import connection from '../../config/connexion.js';

export const addProprietaire = async (proprietaire) => {
    const { nom, prenom, adresse, telephone, cin, date_nais } = proprietaire;
    const [result] = await connection.execute(
        `INSERT INTO personne (nom, prenom, adresse, telephone, cin, date_nais, role) 
         VALUES (?, ?, ?, ?, ?, ?, 'proprietaire')`, [nom, prenom, adresse, telephone, cin, date_nais]
    );
    return result.insertId;
};



export const getAllProprietaire = async () => {
    const [rows] = await connection.execute(
        `SELECT p.id_personne, p.nom, p.prenom, p.adresse, p.telephone, p.cin, p.date_nais 
         FROM personne p
         WHERE p.role = 'proprietaire'`
    );
    return rows;
};

export const getInfosProprietaire = async (id_personne) => {
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

export const updateProprietaire = async (id_personne, proprietaire) => {
    const { nom, prenom, adresse, telephone, cin, date_nais } = proprietaire;
    const [result] = await connection.execute(
        `UPDATE personne SET nom = ?, prenom = ?, adresse = ?, telephone = ?, cin = ?, date_nais = ?
         WHERE id_personne = ?`, [nom, prenom, adresse, telephone, cin, date_nais, id_personne]
    );
    return result.affectedRows > 0;
};

export const deleteProprietaire = async (id_personne) => {
    const [result] = await connection.execute(
        `DELETE FROM personne WHERE id_personne = ?`, [id_personne]
    );
    return result.affectedRows > 0;
};

export const getPropAppartement = async (id_personne) => {
    const [rows] = await connection.execute(
        `SELECT a.num_appartement
         FROM appartement a
         WHERE a.id_personne = ?`, [id_personne]
    );
    return rows.length > 0;
};