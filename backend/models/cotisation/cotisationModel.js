// backend/models/cotisation/cotisationModel.js
import connection from '../../config/connexion.js';

export const getAppartements = async () => {
  const [rows] = await connection.execute('SELECT num_appartement FROM appartement');
  return rows.map(row => row.num_appartement);
};

export const getAnnees = async () => {
  const [rows] = await connection.execute('SELECT DISTINCT annee FROM cotisation_annuelle ORDER BY annee DESC');
  return rows.map(row => row.annee);
};

export const getAppartementDetails = async (num) => {
  const [rows] = await connection.execute(
    'SELECT id_personne, espace_parking FROM appartement WHERE num_appartement = ?',
    [num]
  );
  return rows[0] || null;
};

export const getNomPrenomById = async (id) => {
  const [rows] = await connection.execute(
    'SELECT nom, prenom FROM personne WHERE id_personne = ?',
    [id]
  );
  return rows[0] || null;
};

export const getTrimestresPayes = async (num, annee) => {
  const [rows] = await connection.execute(
    'SELECT MAX(periode) AS max_periode FROM cotisation WHERE num_appartement = ? AND annee = ?',
    [num, annee]
  );
  return rows[0].max_periode;
};

export const isTrimestrePaye = async (num, annee, periode) => {
  const [rows] = await connection.execute(
    'SELECT COUNT(*) AS count FROM cotisation WHERE num_appartement = ? AND annee = ? AND periode = ?',
    [num, annee, periode]
  );
  return rows[0].count > 0;
};

export const getMontantAttendu = async (annee, avecParking) => {
  const field = avecParking === 'oui' ? 'montant_avec_parking' : 'montant_sans_parking';
  const [rows] = await connection.execute(
    `SELECT ${field} AS montant FROM cotisation_annuelle WHERE annee = ?`,
    [annee]
  );
  return rows[0] ? rows[0].montant * 3 : null; // montant pour 3 mois
};

export const ajouterCotisation = async ({ montant, periode, typePayement, datePayement, numeroAppartement, annee }) => {
  const [result] = await connection.execute(
    'INSERT INTO cotisation (montant, periode, type_payement, date_payement, num_appartement, annee) VALUES (?, ?, ?, ?, ?, ?)',
    [montant, periode, typePayement, datePayement, numeroAppartement, annee]
  );
  return result.affectedRows > 0;
};

export const SuiviCotisations = async () => {
  const [rows] = await connection.execute(`
        SELECT 
            a.num_appartement AS numeroAppartement,
            p.nom AS nomProprietaire,
            p.prenom AS prenomProprietaire,
            ca.annee AS annee,
            SUM(c.montant) AS sommePayee,
            COUNT(c.periode) AS trimestresPayes,
            CASE 
                WHEN a.espace_parking = 'oui' THEN ca.montant_avec_parking * 12
                ELSE ca.montant_sans_parking * 12
            END AS montantTotalAnnuel,
            CASE 
                WHEN a.espace_parking = 'oui' THEN (ca.montant_avec_parking * 12) - SUM(c.montant)
                ELSE (ca.montant_sans_parking * 12) - SUM(c.montant)
            END AS resteAPayer,
            MAX(c.date_payement) AS derniereDate
        FROM appartement a
        JOIN personne p ON a.id_personne = p.id_personne
        LEFT JOIN cotisation c ON a.num_appartement = c.num_appartement
        LEFT JOIN cotisation_annuelle ca ON c.annee = ca.annee
        GROUP BY a.num_appartement, ca.annee
        ORDER BY a.num_appartement, ca.annee DESC;
    `);

  return rows;
};

export const getCotisations = async () => {
  const [rows] = await connection.execute(`
    SELECT 
      c.id_cotisation, 
      c.montant, 
      c.periode, 
      c.type_payement, 
      c.date_payement, 
      c.num_appartement, 
      c.annee 
    FROM cotisation c 
    ORDER BY c.id_cotisation DESC
  `);

  return rows;
};

// Obtenez la periode maximale pour un appartement donné et l'annéer
export const getMaxPeriode = async (num_appartement, annee) => {
  const [rows] = await connection.execute(
    `SELECT MAX(periode) AS maxPeriode 
     FROM cotisation 
     WHERE num_appartement = ? AND annee = ?`,
    [num_appartement, annee]
  );

  return rows[0].maxPeriode;
};


// Delete a cotisation by ID
export const deleteCotisation = async (idCotisation) => {
  const [result] = await connection.execute(
    'DELETE FROM cotisation WHERE id_cotisation = ?',
    [idCotisation]
  );

  if (result.affectedRows > 0) {
    return { status: "success", message: "Cotisation supprimée avec succès." };
  } else {
    return { status: "error", message: "Erreur lors de la suppression de la cotisation." };
  }
};

export const getCotisationInfos = async (id_cotisation) => {
  const [rows] = await connection.execute(
    `SELECT num_appartement, annee, periode FROM cotisation WHERE id_cotisation = ?`,
    [id_cotisation] 
  );
  return rows[0] || null;
};

export const modifierCotisation = async ({
  idCotisation,
  numeroAppartement,
  periode,
  montant,
  typePayement,
  datePayement,
  annee
}) => {
  const [result] = await connection.execute(
    `UPDATE cotisation 
     SET montant = ?, periode = ?, type_payement = ?, date_payement = ?, num_appartement = ?, annee = ?
     WHERE id_cotisation = ?`,
    [montant, periode, typePayement, datePayement, numeroAppartement, annee, idCotisation]
  );
  return result.affectedRows > 0;
};

export const getSuiviGlobalCotisations = async () => {
  const [rows] = await connection.execute(`
    SELECT 
      i.id_immeuble,
      i.raison_sociale,
      ca.annee,

      COUNT(DISTINCT CASE WHEN a.espace_parking = 'oui' THEN a.num_appartement END) AS nbr_appart_avec_parking,
      COUNT(DISTINCT CASE WHEN a.espace_parking = 'non' THEN a.num_appartement END) AS nbr_appart_sans_parking,

      (
        COUNT(DISTINCT CASE WHEN a.espace_parking = 'oui' THEN a.num_appartement END) * ca.montant_avec_parking * 12 +
        COUNT(DISTINCT CASE WHEN a.espace_parking = 'non' THEN a.num_appartement END) * ca.montant_sans_parking * 12
      ) AS montant_total_annuel_a_payer,

      SUM(COALESCE(cot.montant, 0)) AS montant_total_paye,

      (
        COUNT(DISTINCT CASE WHEN a.espace_parking = 'oui' THEN a.num_appartement END) * ca.montant_avec_parking * 12 +
        COUNT(DISTINCT CASE WHEN a.espace_parking = 'non' THEN a.num_appartement END) * ca.montant_sans_parking * 12
      ) - SUM(COALESCE(cot.montant, 0)) AS reste_a_payer

    FROM immeuble i
    JOIN appartement a ON a.id_immeuble = i.id_immeuble
    JOIN cotisation_annuelle ca ON 1=1
    LEFT JOIN cotisation cot ON cot.num_appartement = a.num_appartement AND cot.annee = ca.annee

    GROUP BY i.id_immeuble, ca.annee;
  `);

  return rows;
};
