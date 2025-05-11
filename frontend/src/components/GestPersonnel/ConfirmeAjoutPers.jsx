import React from "react";

const ConfirmeAjoutPers = ({ show, onConfirm, onCancel, isSubmitting }) => {
  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Confirmer l'ajout</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onCancel}
              disabled={isSubmitting}
            ></button>
          </div>
          <div className="modal-body text-center">
            <h5>Voulez-vous vraiment ajouter ce personnel ?</h5>
          </div>
          <div className="modal-footer justify-content-center">
            <button 
              className="btn btn-secondary me-2" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  En cours...
                </>
              ) : (
                "Confirmer"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmeAjoutPers;