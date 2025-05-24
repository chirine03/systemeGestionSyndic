import React from 'react';

const ConfirmeAjoutService = ({ onConfirm, onCancel }) => (
  <div className="modal show" style={{ display: 'block' }} tabIndex="-2">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirmation</h5>
        </div>
        <div className="modal-body">
          <p>Voulez-vous vraiment ajouter ce service ?</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmeAjoutService;
