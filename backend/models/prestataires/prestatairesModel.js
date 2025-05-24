import connection from '../../config/connexion.js';

// Requête : sélectionner tous les prestataires
export const getAllPrestataires = async () => {
    const [rows] = await connection.execute(
      `SELECT * FROM PrestataireService`
    );
    return rows;
  };


// Vérifier si un prestataire avec les mêmes informations existe déjà
export const checkPrestataireExists1 = async ({ email, telephone, num_matricule, fax, id_prestataire }) => {
  let query = `SELECT email, telephone, num_matricule, fax FROM PrestataireService WHERE `;
  const conditions = [];
  const params = [];

  if (email) {
    conditions.push("email = ?");
    params.push(email);
  }
  if (telephone) {
    conditions.push("telephone = ?");
    params.push(telephone);
  }
  if (num_matricule) {
    conditions.push("num_matricule = ?");
    params.push(num_matricule);
  }
  if (fax) {
    conditions.push("fax = ?");
    params.push(fax);
  }

  if (conditions.length === 0) return null;

  // exclusion du prestataire à modifier
  query += `(${conditions.join(" OR ")}) AND id_prestataire != ?`;
  params.push(id_prestataire);

  const [rows] = await connection.execute(query, params);

  if (rows.length > 0) {
    const existing = rows[0];
    if (email && existing.email === email) return 'Un prestataire avec cet email existe déjà.';
    if (telephone && existing.telephone === telephone) return 'Un prestataire avec ce numéro de téléphone existe déjà.';
    if (num_matricule && existing.num_matricule === num_matricule) return 'Un prestataire avec ce matricule existe déjà.';
    if (fax && existing.fax === fax) return 'Un prestataire avec ce fax existe déjà.';
  }
  return null;
};


// Vérifier si un prestataire avec les mêmes informations existe déjà
export const checkPrestataireExists2 = async ({ email, telephone, num_matricule, fax }) => {
  let query = `SELECT email, telephone, num_matricule, fax FROM PrestataireService WHERE `;
  const conditions = [];
  const params = [];

  if (email) {
    conditions.push("email = ?");
    params.push(email);
  }
  if (telephone) {
    conditions.push("telephone = ?");
    params.push(telephone);
  }
  if (num_matricule) {
    conditions.push("num_matricule = ?");
    params.push(num_matricule);
  }
  if (fax) {
    conditions.push("fax = ?");
    params.push(fax);
  }

  if (conditions.length === 0) return null;

  query += conditions.join(" OR ");

  const [rows] = await connection.execute(query, params);

  if (rows.length > 0) {
    const existing = rows[0];
    if (email && existing.email === email) return 'Un prestataire avec cet email existe déjà.';
    if (telephone && existing.telephone === telephone) return 'Un prestataire avec ce numéro de téléphone existe déjà.';
    if (num_matricule && existing.num_matricule === num_matricule) return 'Un prestataire avec ce matricule existe déjà.';
    if (fax && existing.fax === fax) return 'Un prestataire avec ce fax existe déjà.';
  } return null;
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
  
