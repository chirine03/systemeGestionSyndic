import connection from '../../config/connexion.js';

 export const getTauxPaiementParImmeubleEtAnnee = async () => {
      const [rows] = await connection.execute(`
        SELECT
        pa.id_immeuble,
        pa.annee,
        ROUND(
            COALESCE(pc.total_paye, 0) * 100.0 / pa.total_attendu,
            2
        ) AS taux_paiement_pourcentage
        FROM
        (
            SELECT
            a.id_immeuble,
            ca.annee,
            (ca.montant_avec_parking * 12 * SUM(CASE WHEN a.espace_parking = 'oui' THEN 1 ELSE 0 END) +
            ca.montant_sans_parking * 12 * SUM(CASE WHEN a.espace_parking = 'non' THEN 1 ELSE 0 END)
            ) AS total_attendu
            FROM
            appartement a
            CROSS JOIN cotisation_annuelle ca
            GROUP BY a.id_immeuble, ca.annee
        ) pa
        LEFT JOIN (
            SELECT
            a.id_immeuble,
            c.annee,
            SUM(c.montant) AS total_paye
            FROM
            cotisation c
            JOIN appartement a ON c.num_appartement = a.num_appartement
            GROUP BY a.id_immeuble, c.annee
        ) pc ON pa.id_immeuble = pc.id_immeuble AND pa.annee = pc.annee;`
        
);return rows;
 };

 // Total de recette pour l'année en cours
export const getRecetteActuelle = async () => {
  const [rows] = await connection.execute(`
    SELECT SUM(montant) AS recette_actuelle
    FROM cotisation
    WHERE annee = YEAR(CURDATE());
  `);
  return rows[0];
};

export const getTotalDepense = async () => {
  const [rows] = await connection.execute(`
    SELECT
        (SELECT SUM(montant)
        FROM depense
        WHERE YEAR(date_depense) = YEAR(CURRENT_DATE))
        +
        (SELECT SUM(montant)
        FROM service
        WHERE paye = 'non' AND YEAR(date_intervention) = YEAR(CURRENT_DATE))
        AS total_depense,

        (SELECT SUM(montant)
        FROM service
        WHERE paye = 'oui' AND YEAR(date_intervention) = YEAR(CURRENT_DATE))
        AS total_paye,

        (SELECT SUM(montant)
        FROM service
        WHERE paye = 'non' AND YEAR(date_intervention) = YEAR(CURRENT_DATE))
        AS total_non_paye;
    `);
  return rows[0];
};
export const getTauxDepensePrestataire = async () => {
  const [rows] = await connection.execute(`
    SELECT 
        p.raison_sociale AS prestataire,
        YEAR(s.date_intervention) AS annee,
        SUM(s.montant) AS total_depenses_services,
        ROUND(
        (SUM(s.montant) / 
            (SELECT SUM(montant) FROM service WHERE YEAR(date_intervention) = YEAR(s.date_intervention))
        ) * 100, 2) AS pourcentage
    FROM service s
    JOIN prestataireservice p ON s.id_prestataire = p.id_prestataire
    GROUP BY p.id_prestataire, YEAR(s.date_intervention)
    ORDER BY annee, prestataire;
  `);
  return rows;
};

export const getTotalDepensesParImmeuble = async () => {
  const [rows] = await connection.execute(`
    SELECT 
        i.raison_sociale AS immeuble,
        YEAR(s.date_intervention) AS annee,
        SUM(s.montant) AS total_depense,
        SUM(CASE WHEN s.paye = 'oui' THEN s.montant ELSE 0 END) AS depense_payee,
        SUM(CASE WHEN s.paye = 'non' THEN s.montant ELSE 0 END) AS depense_non_payee
    FROM service s
    JOIN immeuble i ON s.id_immeuble = i.id_immeuble
    GROUP BY i.id_immeuble, YEAR(s.date_intervention)
    ORDER BY annee, immeuble;
  `);
  return rows;
};


export const getEvolDepense = async () => {
  const [rows] = await connection.execute(`
    SELECT 
        DATE(s.date_intervention) AS date_depense,
        s.montant,
        'service' AS source,
        p.raison_sociale AS prestataire
    FROM service s
    JOIN prestataireservice p ON s.id_prestataire = p.id_prestataire

    UNION ALL

    SELECT 
        DATE(d.date_depense),
        d.montant,
        'autre_depense' AS source,
        NULL AS prestataire
    FROM depense d
    WHERE d.id_service IS NULL

    ORDER BY date_depense;
  `);
  return rows;
};


export const getDepensePayeNonPaye = async () => {
  const [rows] = await connection.execute(`
    SELECT 
        p.raison_sociale AS prestataire,
        SUM(s.montant) AS total_services,
        SUM(CASE WHEN s.paye = 'oui' THEN s.montant ELSE 0 END) AS services_payes,
        SUM(CASE WHEN s.paye = 'non' THEN s.montant ELSE 0 END) AS services_non_payes
    FROM service s
    JOIN prestataireservice p ON s.id_prestataire = p.id_prestataire
    GROUP BY p.id_prestataire
    ORDER BY total_services DESC;
  `);
  return rows;
};