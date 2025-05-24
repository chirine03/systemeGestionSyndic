import React, { useState } from 'react';
import { supprimerDepense } from '../../services/depense/depenseService';

const SuppDepense = ({ depense, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [typeMessage, setTypeMessage] = useState('');

  const handleSupprimer = async () => {
    
    const { id_depense, id_service } = depense;
    const result = await supprimerDepense(id_depense, id_service);

    if (result.success) {
      setMessage(result.message);
      setTypeMessage("success");
      onSuccess();
      setTimeout(() => {
        setMessage('');
        setTypeMessage('');
        onClose();
      }, 1500);
    } else {
      setMessage(result.message);
      setTypeMessage("error");
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation de suppression</h5>
            <button type="button" className="btn-close" onClick={onClose} ></button>
          </div>

          <div className="modal-body">
            {message ? (
              <div className={`alert ${typeMessage === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                {message}
              </div>
            ) : (
              <p>Êtes-vous sûr de vouloir supprimer cette dépense ?</p>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn btn-danger" onClick={handleSupprimer}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppDepense;
