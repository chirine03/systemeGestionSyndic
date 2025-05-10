import React, { useState } from 'react';
import { supprimerAppartement } from '../../services/appartement/appartementService';

const SuppAppartement = ({ show, onClose, appartement, onSuppressionReussie }) => {
  const [loading, setLoading] = useState(false);
  const [messageErreur, setMessageErreur] = useState("");
  const [messageSucces, setMessageSucces] = useState("");

  if (!show) return null;

  const handleConfirmDelete = async () => {
    setLoading(true);
    setMessageErreur("");
    setMessageSucces("");

    const result = await supprimerAppartement({ num_appartement: appartement.num_appartement });

    if (result.success) {
      setMessageSucces(result.message);
      setTimeout(() => {
        onSuppressionReussie(appartement.num_appartement);
        onClose();
      }, 1500); // Affiche le message 1.5s avant de fermer
    } else {
      setMessageErreur(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Confirmation de suppression</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer l'appartement <strong>{appartement?.num_appartement}</strong> ?</p>
            {messageErreur && <div className="alert alert-danger mt-3">{messageErreur}</div>}
            {messageSucces && <div className="alert alert-success mt-3">{messageSucces}</div>}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Annuler</button>
            <button className="btn btn-danger" onClick={handleConfirmDelete} disabled={loading}>
              {loading ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppAppartement;
