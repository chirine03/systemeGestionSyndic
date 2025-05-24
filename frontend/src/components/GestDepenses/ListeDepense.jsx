import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { fetchListeDepenses } from '../../services/depense/depenseService';
import SuppDepense from './SuppDepense';

const ListeDepense = () => {
  const [depenses, setDepenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [annees, setAnnees] = useState([]);
  const [anneeSelectionnee, setAnneeSelectionnee] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDepense, setSelectedDepense] = useState(null);

  useEffect(() => {
    chargerDepenses();
  }, []);

  const chargerDepenses = async () => {
    setLoading(true);
    const result = await fetchListeDepenses();
    if (result.success) {
      setDepenses(result.data);

      // Extraire les années uniques des dépenses
      const uniqueAnnees = Array.from(
        new Set(result.data.map(dep => new Date(dep.date_depense).getFullYear()))
      ).sort((a, b) => b - a); // trie décroissant
      setAnnees(uniqueAnnees);
      setAnneeSelectionnee(''); // reset filtre
    } else {
      setErreur(result.message);
    }
    setLoading(false);
  };

  const handleOpenModal = (depense) => {
    setSelectedDepense(depense);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepense(null);
  };

  // Filtrer selon l'année sélectionnée
  const depensesFiltrees = anneeSelectionnee
    ? depenses.filter(dep => new Date(dep.date_depense).getFullYear().toString() === anneeSelectionnee)
    : depenses;

  return (
    <div className="container mt-4" style={{ marginLeft: "280px" }}>
      <h1 className="mb-5 fw-bold text-center text-primary">Mes des Dépenses</h1>

      <div className="mb-3" style={{ maxWidth: '300px' }}>
        <select
          className="form-select"
          value={anneeSelectionnee}
          onChange={(e) => setAnneeSelectionnee(e.target.value)}
        >
          <option value="">Tous les années</option>
          {annees.map(annee => (
            <option key={annee} value={annee}>{annee}</option>
          ))}
        </select>
      </div>

      {loading && <div className="text-center">Chargement...</div>}
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {!loading && !erreur && (
        <div className="table-responsive shadow-sm">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>Motif</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Date Paiement</th>
                <th>Type Paiement</th>
                <th>Service</th>
                <th>Réf Facture</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {depensesFiltrees.map((dep, index) => (
                <tr key={dep.id_depense || index}>
                  <td>{index + 1}</td>
                  <td>{dep.motif}</td>
                  <td>{dep.categorie}</td>
                  <td>{dep.montant} DT</td>
                  <td>{new Date(dep.date_depense).toLocaleDateString()}</td>
                  <td>{dep.type_paiement}</td>
                  <td>{dep.nom_service}</td>
                  <td>{dep.reference_facture}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleOpenModal(dep)}
                    >
                      <FaTrash className="me-1" />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {depensesFiltrees.length === 0 && (
                <tr><td colSpan="9">Aucune dépense pour cette année.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedDepense && (
        <SuppDepense
          depense={selectedDepense}
          onClose={handleCloseModal}
          onSuccess={chargerDepenses}
        />
      )}
    </div>
  );
};

export default ListeDepense;
