import React from "react";
import { Button } from "react-bootstrap";

const SuppCotisation = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation de suppression</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p> Voulez-vous vraiment supprimer cette cotisation ?</p>
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>Annuler</Button>
            <Button variant="danger" onClick={onConfirm}>Supprimer</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppCotisation;
