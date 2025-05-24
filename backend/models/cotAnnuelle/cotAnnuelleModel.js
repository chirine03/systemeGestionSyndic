import connection from '../../config/connexion.js';

export const getCotisationAnnuelle = async () => {
  const [rows] = await connection.execute(`
    SELECT 
    c.annee,
    c.montant_avec_parking,
    c.montant_sans_parking
    FROM cotisation_annuelle c
    ORDER BY c.annee DESC
  `);

  return rows;
};

export const addCotisationAnnuelle = async (annee, montantAvec, montantSans) => {
  const [result] = await connection.execute(`
    INSERT INTO cotisation_annuelle (annee, montant_avec_parking, montant_sans_parking) 
    VALUES (?, ?, ?)`, 
    [annee, montantAvec, montantSans]);
  return result.affectedRows > 0;
};

export const checkAnneeExiste = async (annee) => {
  const [rows] = await connection.execute(`
    SELECT annee 
    FROM cotisation_annuelle 
    WHERE annee = ?`, 
    [annee]);
  return rows.length > 0;
}

export const checkExiste = async (annee) => {
    const [rows] = await connection.execute(`
        SELECT id_cotisation 
        FROM cotisation 
        WHERE annee = ?`, 
        [annee]);
    return rows.length > 0;
};

export const deleteCotAnnuelle = async (annee) => {
    const [result] = await connection.execute(`
        DELETE FROM cotisation_annuelle 
        WHERE annee = ?`, 
        [annee]);
    return result.affectedRows > 0;
}

export const updateCotAnnuelle = async (annee, montantAvec, montantSans) => {
    const [result] = await connection.execute(`
        UPDATE cotisation_annuelle 
        SET montant_avec_parking = ?, montant_sans_parking = ? 
        WHERE annee = ?`, 
        [montantAvec, montantSans, annee]);
    return result.affectedRows > 0;
}