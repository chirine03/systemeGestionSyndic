import React from 'react';

const ConfAjoutDepense = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content rounded-4">
          <div className="modal-header bg-light">
            <h5 className="modal-title text-success">Confirmation</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>Êtes-vous sûr de vouloir ajouter cette dépense ?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onCancel}>Annuler</button>
            <button className="btn btn-success" onClick={onConfirm}>Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfAjoutDepense;
