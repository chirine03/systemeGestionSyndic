import connection from '../../config/connexion.js';

// Récupérer liste des immeubles
export const getListeImmeuble = async () => {
    const [rows] = await connection.execute('SELECT * FROM immeuble');
    return rows;
};

// vérifier si une immeuble possède des appartements
export const immeubleExiste = async (id_immeuble) => {
    const [rows] = await connection.execute('SELECT * FROM appartement WHERE id_immeuble = ?', [id_immeuble]);
    return rows.length > 0 ;
};

// supp immeuble
export const deleteImmeuble = async (id_immeuble) => {
    const [result] = await connection.execute('DELETE FROM immeuble WHERE id_immeuble = ?', [id_immeuble]);
    return result.affectedRows > 0;
};

// ajouter immeuble
export const addImmeuble = async (immeuble) => {
    const { raison_sociale ,matricule ,adresse ,nbr_etage ,bloc ,description } = immeuble;
    const [result] = await connection.execute(
        'INSERT INTO immeuble ( raison_sociale ,matricule ,adresse ,nbr_etage ,bloc ,description ) VALUES (?, ?, ?, ?, ?, ?)',
        [ raison_sociale ,matricule ,adresse ,nbr_etage ,bloc ,description ]
    );
    return result.insertId;
};

// verifier si le matricule existe déjà
export const matriculeExiste1 = async (matricule) => {
    const [rows] = await connection.execute('SELECT * FROM immeuble WHERE matricule = ?', [matricule]);
    return rows.length > 0;
};

// select matricule by id_immeuble
export const matriculeExiste2 = async (id_immeuble) => {
    const [res] = await connection.execute('SELECT matricule FROM immeuble WHERE id_immeuble = ?', [id_immeuble]);
    return res[0].matricule;
};

// modifier immeuble
export const updateImmeuble = async (id_immeuble, immeuble) => {
    const { raison_sociale, matricule, adresse, nbr_etage, bloc, description } = immeuble;
    const [result] = await connection.execute(
        'UPDATE immeuble SET raison_sociale = ?, matricule = ?, adresse = ?, nbr_etage = ?, bloc = ?, description = ? WHERE id_immeuble = ?',
        [raison_sociale, matricule, adresse, nbr_etage, bloc, description, id_immeuble]
    );
    return result.affectedRows > 0;
};
