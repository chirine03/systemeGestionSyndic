import connection from '../../config/connexion.js';

// ✅ 1. Récupérer les raisons sociales avec ID
export const getRaisonsSociales = async () => {
  const [rows] = await connection.execute(
    'SELECT id_prestataire, raison_sociale FROM prestataireservice'
  );
  return rows;
};

export const getListeImmeubles = async () => {
    const [rows] = await connection.execute(
      'SELECT id_immeuble, raison_sociale, bloc FROM immeuble'
    );
    return rows;
};

// Vérifier si une référence de facture existe déjà
export const getFacture = async (reference_facture) => {
  const [rows] = await connection.execute(
    `SELECT id_service FROM service WHERE reference_facture = ?`,
    [reference_facture]
  );
  return rows[0] || null;
};


// Requête : insertion d'un nouveau service
export const insertService = async (serviceData) => {
  const {
    nom,
    type,
    dateIntervention,
    referenceFacture,
    description,
    montant,
    id_prestataire,
    id_immeuble
  } = serviceData;

  // Exécution de la requête d'insertion dans la table 'service'
  const [result] = await connection.execute(
    `INSERT INTO service 
     (nom, type, date_intervention, reference_facture, montant, description, id_prestataire, id_immeuble)
     VALUES (?, ?, ?, ?, ?, ?,?,?)`,
    [nom, type, dateIntervention, referenceFacture, montant, description, id_prestataire, id_immeuble]
  );

  // Retourner l'ID du service nouvellement inséré
  return result.insertId;
};

// ✅ Récupérer les services par ID du prestataire
export const getServicesByPrestataire = async (id_prestataire) => {
  try {
    const [rows] = await connection.execute(
      `SELECT s.id_service, s.nom, s.type, s.date_intervention, s.reference_facture, s.description, s.paye, s.montant, i.id_immeuble, i.raison_sociale, i.bloc 
       FROM service s, immeuble i
       WHERE i.id_immeuble = s.id_immeuble
       AND id_prestataire = ?`,
      [id_prestataire]
    );
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des services :", error);
    throw error;
  }
};


export const suppService = async (idService) => {
  await connection.execute('DELETE FROM depense WHERE id_service = ?', [idService]);
  const [result] = await connection.execute('DELETE FROM service WHERE id_service = ?', [idService]);
  return result;
};
