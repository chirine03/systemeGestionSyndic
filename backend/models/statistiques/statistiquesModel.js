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