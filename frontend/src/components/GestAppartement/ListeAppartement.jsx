import React, { useEffect, useState } from 'react';
import { fetchListeAppartements } from '../../services/appartement/appartementService';
import SuppAppartement from './SuppAppartement';
import ModifierAppartement from './ModifierAppartement';

const ListeAppartement = () => {
  const [appartements, setAppartements] = useState([]);
  const [filteredAppartements, setFilteredAppartements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModalSupp, setShowModalSupp] = useState(false);
  const [showModalModif, setShowModalModif] = useState(false);
  const [appartementASupprimer, setAppartementASupprimer] = useState(null);
  const [appartementAModifier, setAppartementAModifier] = useState(null);

  const chargerAppartements = async () => {
    const response = await fetchListeAppartements();
    if (response.success) {
      setAppartements(response.data);
      setFilteredAppartements(response.data);
    }
  };

  useEffect(() => {
    chargerAppartements();
  }, []);

  // ✅ Recherche dynamique
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = appartements.filter(app =>
    (app.num_appartement?.toLowerCase() || '').includes(term) ||
    (app.superficie?.toString() || '').includes(term) ||
    (app.nbr_chambre?.toString() || '').includes(term) ||
    (app.nom_personne?.toLowerCase() || '').includes(term) ||
    (app.prenom_personne?.toLowerCase() || '').includes(term)
  );

    setFilteredAppartements(filtered);
  }, [searchTerm, appartements]);

  const handleSupprimerClick = (appartement) => {
    setAppartementASupprimer(appartement);
    setShowModalSupp(true);
  };

  const handleModifierClick = (appartement) => {
    setAppartementAModifier(appartement);
    setShowModalModif(true);
  };

  const handleSuppressionReussie = (id_supprime) => {
    const updated = appartements.filter(app => app.num_appartement !== id_supprime);
    setAppartements(updated);
    setFilteredAppartements(updated);
  };

  return (
    <div className="container mt-4" style={{ marginLeft: "280px" }}>
      <h2 className="text-center mb-4 fw-bold">Liste des Appartements</h2>

      {/* ✅ Zone de recherche */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par numéro, superficie, chambres ou nom du propriétaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
            <th>Propriétaire</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppartements.length > 0 ? (
            filteredAppartements.map((app, index) => (
              <tr key={index} className="text-center">
                <td>{index + 1}</td>
                <td>{app.num_appartement}</td>
                <td>{app.nbr_chambre}</td>
                <td>{app.superficie} m²</td>
                <td>{app.etage}</td>
                <td>{app.espace_parking}</td>
                <td>{app.description || 'N/A'}</td>
                <td>{app.nom_personne} {app.prenom_personne}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleModifierClick(app)}
                  >Modifier</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">Aucun appartement trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>

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
        onSubmit={async () => {
          setShowModalModif(false);
          await chargerAppartements();
        }}
      />
    </div>
  );
};

export default ListeAppartement;
