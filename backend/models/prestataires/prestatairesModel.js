import connection from '../../config/connexion.js';

// Requête : sélectionner tous les prestataires
export const getAllPrestataires = async () => {
    const [rows] = await connection.execute(
      `SELECT * FROM PrestataireService`
    );
    return rows;
  };


// Vérifier si un prestataire avec les mêmes informations existe déjà
export const checkPrestataireExists1 = async (email, telephone, num_matricule, fax, id_prestataire) => {
    const [rows] = await connection.execute(
      `SELECT email, telephone, num_matricule, fax FROM PrestataireService 
       WHERE email = ? OR telephone = ? OR num_matricule = ? OR fax = ?`,
      [email, telephone, num_matricule, fax]
    );
  
    return rows.length > 0 ? rows[0] : null;
  };  


  // Vérifier si un prestataire avec les mêmes informations existe déjà
  export const checkPrestataireExists2 = async (email, telephone, num_matricule, fax, id_prestataire) => {
    const [rows] = await connection.execute(
      `SELECT email, telephone, num_matricule, fax FROM PrestataireService 
       WHERE (email = ? OR telephone = ? OR num_matricule = ? OR fax = ?)
       AND id_prestataire != ?`,
      [email, telephone, num_matricule, fax, id_prestataire]
    );
  
    return rows.length > 0 ? rows[0] : null;
  };
  
// Requête : insertion d’un nouveau prestataire
export const insertPrestataire = async (prestataireData) => {
  const {
    raison_sociale,
    num_matricule,
    adresse,
    telephone,
    fax,
    email,
    site_web,
  } = prestataireData;

  const [result] = await connection.execute(
    `INSERT INTO PrestataireService 
     (raison_sociale, num_matricule, adresse, telephone, fax, email, site_web)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [raison_sociale, num_matricule, adresse, telephone, fax, email, site_web]
  );

  return result.insertId;
};

// Requête : suppression d’un prestataire par ID
export const deletePrestataireById = async (id_prestataire) => {
    const [result] = await connection.execute(
      `DELETE FROM PrestataireService WHERE id_prestataire = ?`,
      [id_prestataire]
    );
    return result.affectedRows > 0;
  };
  
// Vérifie si un prestataire est lié à au moins un service
export const checkPrestataireSupp = async (id_prestataire) => {
  const [rows] = await connection.execute(
    `SELECT id_service FROM Service WHERE id_prestataire = ? LIMIT 1`,
    [id_prestataire]
  );

  return rows.length > 0;
};

// Requête : mise à jour d’un prestataire par ID
export const updatePrestataireById = async (id_prestataire, prestataireData) => {
    const {
      raison_sociale,
      num_matricule,
      adresse,
      telephone,
      fax,
      email,
      site_web,
    } = prestataireData;
  
    const [result] = await connection.execute(
      `UPDATE PrestataireService 
       SET raison_sociale = ?, num_matricule = ?, adresse = ?, telephone = ?, fax = ?, email = ?, site_web = ?
       WHERE id_prestataire = ?`,
      [raison_sociale, num_matricule, adresse, telephone, fax, email, site_web, id_prestataire]
    );
  
    return result.affectedRows > 0;
  };
  
