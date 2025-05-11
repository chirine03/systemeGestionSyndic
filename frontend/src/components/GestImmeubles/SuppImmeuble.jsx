import React, { useState } from "react";
import { SupprimerImmeuble } from "../../services/immeuble/immeubleService";

const SuppImmeuble = ({ id_immeuble, onSuppression }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    
    try {
      const result = await SupprimerImmeuble(id_immeuble);
      
      if (result.success) {
        // Fermer la modale proprement
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        // Appeler la callback parente après la fermeture de la modale
        modal._element.addEventListener('hidden.bs.modal', onSuppression, { once: true });
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
  };

  return (
    <div className="modal fade" id="deleteModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {errorMessage ? "Erreur" : "Confirmer la suppression"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={handleClose}
              disabled={isDeleting}
            ></button>
          </div>
          <div className="modal-body">
            {errorMessage ? (
              <div className="alert alert-danger">
                {errorMessage}
              </div>
            ) : (
              "Voulez-vous vraiment supprimer cet immeuble ?"
            )}
          </div>
          <div className="modal-footer">
            {errorMessage ? (
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Fermer
              </button>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleClose}
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Suppression...
                    </>
                  ) : (
                    "Supprimer"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppImmeuble;