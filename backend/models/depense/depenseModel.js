import connection from '../../config/connexion.js';

export const getServicesSansDepense = async () => {
  const query = `
      SELECT 
        p.raison_sociale,
        s.nom AS nom_service,
        s.reference_facture,
        s.montant,
        s.id_service
      FROM 
        service s
      JOIN 
        prestataireservice p ON s.id_prestataire = p.id_prestataire
      WHERE 
        s.paye = 'non'
    `;
  const [rows] = await connection.execute(query);
  return rows;
};


export const insertDepense = async (data) => {
    const { motif, categorie, montant, date, type_paiement, id_service } = data;
  
    const query = `
      INSERT INTO depense (motif, categorie, montant, date_depense, type_paiement, id_service)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    const [result] = await connection.execute(query, [
      motif,
      categorie,
      montant,
      date,
      type_paiement,
      id_service
    ]);
  
    return result.insertId; // Retourne l'ID de la dépense insérée
  };

  export const updatePayeService = async (id_service) => {
    const [result] = await connection.execute(
        "UPDATE service SET paye = 'oui' WHERE id_service = ?",
        [id_service]);

        return result.affectedRows > 0;
  };

  export const getListeDepense = async () => {
    const [rows] = await connection.execute(`
      SELECT 
        d.*, 
        s.nom AS nom_service, 
        s.reference_facture
      FROM 
        depense d
      LEFT JOIN 
        service s ON d.id_service = s.id_service
    `);
    return rows;
  };
  
  // supprimer une dépense par ID
  export const deleteDepense = async (id_depense) => { 
    const [result] = await connection.execute(
      'DELETE FROM depense WHERE id_depense = ?',
      [id_depense]
    );  
    return result.affectedRows > 0;
  };
  
 export const UpdateEtatService = async (id_service) => {
    const [result] = await connection.execute(
        "UPDATE service SET paye = 'non' WHERE id_service = ?",
        [id_service]
    );
    return result.affectedRows > 0;
  } ;


  export const checkMontantService = async (id_service) => {
    const [rows] = await connection.execute(
      'SELECT montant FROM service WHERE id_service = ?',
      [id_service]
    );
    
    // ✅ Vérification ajoutée ici
    if (rows.length === 0) {
      throw new Error(`Aucun service trouvé avec id_service = ${id_service}`);
    }
  
    return rows[0].montant;
  };
  
export const getSuiviDepenseGlobal = async () => {
  const query = `
    SELECT 
      result.id_immeuble,
      i.raison_sociale,
      result.annee,
      COALESCE(result.depenses_totales, 0) + COALESCE(result.services_non_payes, 0) AS depense_totale,
      COALESCE(result.services_payes, 0) AS totale_services_payes,
      COALESCE(result.services_non_payes, 0) AS totale_services_non_payes,
      COALESCE(result.autres_depenses, 0) AS totale_autres_depenses
    FROM (
      SELECT 
        s.id_immeuble,
        y.annee,

        -- Dépenses liées aux services
        (
          SELECT SUM(d.montant)
          FROM depense d
          JOIN service s2 ON d.id_service = s2.id_service
          WHERE s2.id_immeuble = s.id_immeuble AND YEAR(d.date_depense) = y.annee
        ) AS depenses_totales,

        -- Services non payés
        (
          SELECT SUM(s3.montant)
          FROM service s3
          WHERE s3.id_immeuble = s.id_immeuble AND s3.paye = 'non' AND YEAR(s3.date_intervention) = y.annee
        ) AS services_non_payes,

        -- Services payés (liés à des dépenses)
        (
          SELECT SUM(d2.montant)
          FROM depense d2
          JOIN service s4 ON d2.id_service = s4.id_service
          WHERE s4.id_immeuble = s.id_immeuble AND s4.paye = 'oui' AND YEAR(d2.date_depense) = y.annee
        ) AS services_payes,

        -- Autres dépenses (non liées à un service)
        (
          SELECT SUM(d3.montant)
          FROM depense d3
          WHERE d3.id_service IS NULL AND YEAR(d3.date_depense) = y.annee
        ) AS autres_depenses

      FROM service s
      JOIN (
        SELECT DISTINCT YEAR(date_depense) AS annee FROM depense
        UNION
        SELECT DISTINCT YEAR(date_intervention) AS annee FROM service
      ) y ON 1=1
      GROUP BY s.id_immeuble, y.annee
    ) AS result
    JOIN immeuble i ON result.id_immeuble = i.id_immeuble
    ORDER BY result.id_immeuble, result.annee;`;

  const [rows] = await connection.execute(query);
  return rows;
};

export const getSuiviServiceGlobale = async () => {
  const query = `SELECT 
  p.raison_sociale,
  p.num_matricule,
  YEAR(s.date_intervention) AS annee,

  -- Total montant tous services
  (SELECT SUM(s1.montant)
   FROM service s1
   WHERE s1.id_prestataire = p.id_prestataire AND YEAR(s1.date_intervention) = YEAR(s.date_intervention)
  ) AS total_montant,

  -- Total services payés
  (SELECT SUM(s2.montant)
   FROM service s2
   WHERE s2.id_prestataire = p.id_prestataire AND s2.paye = 'oui' AND YEAR(s2.date_intervention) = YEAR(s.date_intervention)
  ) AS total_paye_oui,

  -- Total services non payés
  (SELECT SUM(s3.montant)
   FROM service s3
   WHERE s3.id_prestataire = p.id_prestataire AND s3.paye = 'non' AND YEAR(s3.date_intervention) = YEAR(s.date_intervention)
  ) AS total_paye_non,

  -- Liste des services payés avec montant
  (SELECT GROUP_CONCAT(CONCAT(s4.nom, ' (', s4.type, ', ', s4.reference_facture, ', ', s4.montant, ' DT)') SEPARATOR ' | ')
   FROM service s4
   WHERE s4.id_prestataire = p.id_prestataire AND s4.paye = 'oui' AND YEAR(s4.date_intervention) = YEAR(s.date_intervention)
  ) AS services_payes,

  -- Liste des services non payés avec montant
  (SELECT GROUP_CONCAT(CONCAT(s5.nom, ' (', s5.type, ', ', s5.reference_facture, ', ', s5.montant, ' DT)') SEPARATOR ' | ')
   FROM service s5
   WHERE s5.id_prestataire = p.id_prestataire AND s5.paye = 'non' AND YEAR(s5.date_intervention) = YEAR(s.date_intervention)
  ) AS services_non_payes

FROM prestataireservice p
JOIN service s ON s.id_prestataire = p.id_prestataire
GROUP BY p.id_prestataire, annee;

`;

  const [rows] = await connection.execute(query);
  return rows;
};