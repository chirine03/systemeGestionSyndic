import React from "react";
import { SupprimerImmeuble } from "../../services/immeuble/immeubleService";

const SuppImmeuble = ({ id_immeuble, onSuppression }) => {

  const handleDelete = async () => {
    const result = await SupprimerImmeuble(id_immeuble);

    if (result.success) {
      alert(result.message); // ou toast
      onSuppression(); // callback pour rafraîchir la liste ou fermer modale
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="modal fade" id="deleteModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmer la suppression</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            Voulez-vous vraiment supprimer cet immeuble ?
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Annuler
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              data-bs-dismiss="modal"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppImmeuble;
