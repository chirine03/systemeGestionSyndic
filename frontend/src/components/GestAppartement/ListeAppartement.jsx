import React, { useEffect, useState } from 'react';
import { fetchListeAppartements } from '../../services/appartement/appartementService';
import SuppAppartement from './SuppAppartement';
import ModifierAppartement from './ModifierAppartement'; // ✅ import modale de modification

const ListeAppartement = () => {
  const [appartements, setAppartements] = useState([]);
  const [showModalSupp, setShowModalSupp] = useState(false); // ✅ Modale suppression
  const [showModalModif, setShowModalModif] = useState(false); // ✅ Modale modification
  const [appartementASupprimer, setAppartementASupprimer] = useState(null); // ✅
  const [appartementAModifier, setAppartementAModifier] = useState(null); // ✅

  const chargerAppartements = async () => {
    const response = await fetchListeAppartements();
    if (response.success) {
      setAppartements(response.data);
    }
  };

  useEffect(() => {
    chargerAppartements();
  }, []);

  // ✅ Ouvre la modale de suppression
  const handleSupprimerClick = (appartement) => {
    setAppartementASupprimer(appartement);
    setShowModalSupp(true);
  };

  // ✅ Ouvre la modale de modification
  const handleModifierClick = (appartement) => {
    setAppartementAModifier(appartement);
    setShowModalModif(true);
  };

  // ✅ Appelé après suppression réussie
  const handleSuppressionReussie = (id_supprime) => {
    setAppartements(prev => prev.filter(app => app.num_appartement !== id_supprime));
  };

  // ✅ Appelé après modification réussie
    const handleModificationReussie = (num_appartement, newData) => {
    setAppartements(prev =>
      prev.map(app =>
        app.num_appartement === num_appartement ? { ...app, ...newData } : app
      )
    );
  };


  return (
    <div className="container mt-4" style={{ marginLeft: "280px" }}>
      <h2 className="text-center mb-5 fw-bold">Liste des Appartements</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-secondary">
          <tr className="text-center">
            <th>N°</th>
            <th>Num</th>
            <th>Chambres</th>
            <th>Superficie</th>
            <th>Étage</th>
            <th>Parking</th>
            <th>Description</th>
            <th>Propriétaire</th> {/* Nouvelle colonne pour le propriétaire */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appartements.length > 0 ? (
            appartements.map((app, index) => (
              <tr key={index} className="text-center">
                <td>{index + 1}</td>
                <td>{app.num_appartement}</td>
                <td>{app.nbr_chambre}</td>
                <td>{app.superficie} m²</td>
                <td>{app.etage}</td>
                <td>{app.espace_parking}</td>
                <td>{app.description || 'N/A'}</td>
                <td>{app.nom_personne} {app.prenom_personne}</td> {/* Affichage du nom et prénom du propriétaire */}
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleModifierClick(app)} // ✅
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleSupprimerClick(app)} // ✅
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">Aucun appartement trouvé.</td> {/* Note : il y a maintenant 9 colonnes */}
            </tr>
          )}
        </tbody>
      </table>

      {/* Modale de suppression */}
      <SuppAppartement
        show={showModalSupp}
        onClose={() => setShowModalSupp(false)}
        appartement={appartementASupprimer}
        onSuppressionReussie={handleSuppressionReussie}
      />


      <ModifierAppartement
        show={showModalModif}
        onHide={() => setShowModalModif(false)}
        appartementData={appartementAModifier}
        onSubmit={(updatedAppartement) => {
          handleModificationReussie(updatedAppartement.num_appartement, updatedAppartement);
          setShowModalModif(false);
        }}
      />

    </div>
  );
};

export default ListeAppartement;
