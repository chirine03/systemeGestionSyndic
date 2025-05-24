import { useState } from 'react';
import { deleteService } from '../../services/prestataires/servicesService';

const SuppService = ({ serviceId, onCancel, onSuccess }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteService(serviceId);
    if (result.success) {
      setMessage({ type: 'success', text: "Service supprimé avec succès." });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setMessage({ type: 'error', text: "Erreur lors de la suppression du service." });
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmer la suppression</h5>
          </div>
          <div className="modal-body">
            {message && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                {message.text}
              </div>
            )}
            {!message && <p>Êtes-vous sûr de vouloir supprimer ce service ?</p>}
          </div>
          <div className="modal-footer">
            {!message && (
              <>
                <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Annuler</button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                  {loading ? 'Suppression...' : 'Supprimer'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppService;
