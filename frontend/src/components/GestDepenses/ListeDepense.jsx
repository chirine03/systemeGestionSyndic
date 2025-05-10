import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { fetchListeDepenses, supprimerDepense } from '../../services/depense/depenseService';

const ListeDepense = () => {
  const [depenses, setDepenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
    } else {
      setErreur(result.message);
    }
    setLoading(false);
  };

  const handleSupprimer = async () => {
    const { id_depense, id_service } = selectedDepense;
    const result = await supprimerDepense(id_depense, id_service);
    if (result.success) {
      // Recharger la liste
      chargerDepenses();
      setShowModal(false); // Fermer la modale après suppression
    } else {
      alert("Erreur lors de la suppression : " + result.message);
    }
  };

  const handleOpenModal = (depense) => {
    setSelectedDepense(depense);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepense(null);
  };

  const depensesFiltrees = depenses.filter(dep => {
    const search = searchTerm.toLowerCase();
    return (
      dep.categorie?.toLowerCase().includes(search) ||
      dep.nom_service?.toLowerCase().includes(search) ||
      dep.reference_facture?.toLowerCase().includes(search) ||
      new Date(dep.date_depense).toLocaleDateString().includes(search)
    );
  });

  return (
    <div className="container mt-4" style={{ marginLeft: "280px" }}>
      <h1 className="mb-5 fw-bold text-center text-primary">Mes des Dépenses</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par catégorie, service, réf facture ou date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            </tbody>
          </table>
        </div>
      )}

      {/* Modale de confirmation */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmationModalLabel">Confirmation de suppression</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                Êtes-vous sûr de vouloir supprimer cette dépense ?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Annuler</button>
                <button type="button" className="btn btn-danger" onClick={handleSupprimer}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeDepense;
