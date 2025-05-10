import connection from '../../config/connexion.js';

export const getPersonneById = async (id_personne) => {
  try {
    const [rows] = await connection.execute(
      `SELECT id_personne, nom, prenom, adresse, telephone, cin, role 
       FROM personne 
       WHERE id_personne = ?`,
      [id_personne]
    );

    // Si aucune personne trouvée
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("❌ Erreur dans getPersonneById :", error);
    throw error;
  }
};
