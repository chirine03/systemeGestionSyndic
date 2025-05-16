import connection from "../../config/connexion.js";

export const getListeAppartement = async () => {
  const [rows] = await connection.execute(`
    SELECT 
      a.num_appartement, a.nbr_chambre, a.superficie, a.etage, a.espace_parking, 
      a.description, a.id_immeuble, a.id_personne, p.nom AS nom_personne, p.prenom AS prenom_personne
    FROM appartement a, personne p
    WHERE a.id_personne = p.id_personne
  `);

  return rows;
};


export const getImmeubleInfos = async ()=> {
    const [rows] = await connection.execute
    ('SELECT id_immeuble, raison_sociale, bloc FROM immeuble');
    return rows;
};

export const getProprietaireInfos = async ()=> {
    const [rows] = await connection.execute
    ('SELECT id_personne, nom, prenom, cin FROM personne WHERE role = "proprietaire"');
    return rows;
};

export const checkNumApprtExsiste = async (num_appartement) => {
    const [rows] = await connection.execute(
        `SELECT num_appartement FROM appartement WHERE num_appartement = ?`, [num_appartement]
    );
    return rows.length > 0;
};

export const addAppartement = async (appartement) => {
    const { num_appartement, nbr_chambre, superficie, etage, espace_parking, description, id_immeuble, id_personne } = appartement;
    const [result] = await connection.execute(
        `INSERT INTO appartement (num_appartement, nbr_chambre, superficie, etage, espace_parking, description, id_immeuble, id_personne) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [num_appartement, nbr_chambre, superficie, etage, espace_parking, description, id_immeuble, id_personne]
    );
    return result.insertId;
};

export const checkApprtExsiste = async (num_appartement) => {
  const [rows] = await connection.execute("SELECT * FROM cotisation WHERE num_appartement = ?", [num_appartement]);
  return rows.length > 0;
};


export const UpdateAppartement = async (num_appartement, appartement) =>{
  const {nbr_chambre, superficie, espace_parking, description, id_personne}= appartement;
  const [result] = await connection.execute (
    'UPDATE appartement SET nbr_chambre = ?, superficie = ?, espace_parking = ?, description = ?, id_personne = ? WHERE num_appartement = ?',
    [nbr_chambre, superficie, espace_parking, description, id_personne, num_appartement]
  );
  return result.affectedRows > 0;
};


export const deleteAppartement = async (num_appartement) => {
  console.log("num_appartement", num_appartement); // Debugging line
  const [result] = await connection.execute(
    'DELETE FROM appartement WHERE num_appartement = ?', [num_appartement]
  );
  console.log("Résultat de la suppression SQL:", result);
  return result.affectedRows > 0;
};
