import connection from '../../config/connexion.js';

export const getPaiementData = async (id_personne) => {
  try {
    const [rows] = await connection.execute(`
      SELECT 
        a.num_appartement,
        a.nbr_chambre,
        a.superficie,
        a.etage,
        a.espace_parking,
        a.description,
        c.id_cotisation,
        c.montant,
        c.periode,
        c.type_payement,
        c.date_payement,
        c.annee
      FROM 
        appartement a
      LEFT JOIN 
        cotisation c ON a.num_appartement = c.num_appartement
      WHERE 
        a.id_personne = ?
    `, [id_personne]);

    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error);
    throw error;
  }
};