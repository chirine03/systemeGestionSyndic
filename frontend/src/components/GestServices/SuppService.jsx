import React, { useState } from 'react';
import { deleteService } from '../../services/prestataires/servicesService'; // Importer la fonction de suppression

const SuppService = ({ show, onClose, serviceId, onServiceDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!show) return null;

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteService(serviceId);

    if (result.success) {
      onServiceDeleted(serviceId); // Notifier le parent de la suppression réussie
      setError(null);
    } else {
      setError(result.message); // Afficher une erreur en cas d'échec
    }
    setLoading(false);
    onClose(); // Fermer le modal après la suppression
  };

  return (
    <div 
      className="modal show d-block" 
      tabIndex="-1" 
      style={{ zIndex: 1051 }} // Définir un z-index plus élevé pour ce modal
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmer la suppression</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading && <p>Suppression en cours...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
              <p>Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.</p>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppService;
