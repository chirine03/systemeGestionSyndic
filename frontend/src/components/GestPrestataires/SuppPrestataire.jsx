import React, { useState, useEffect  } from 'react';
import { deletePrestataire } from '../../services/prestataires/prestatairesService';
import { FaTrash } from 'react-icons/fa';

const SuppPrestataire = ({show, onClose, prestataireId, onDeleteSuccess }) => {

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [id_prestataire, setid_prestataire] = useState(null);

  useEffect(() => {
    setid_prestataire(prestataireId);
  }, [prestataireId]);
 
  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deletePrestataire(id_prestataire);

      if (result.success) {
        setErrorMessage(null);
        setTimeout(() => {
          onDeleteSuccess(result.message);
          onClose();
        }, 1500);
      } else {
        setErrorMessage(result.message);
        setTimeout(() => {
          setErrorMessage(null);
          onClose(); 
        }, 1500);
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

 

  return (
    <div 
      className={`modal fade ${show ? 'show' : ''}`} 
      style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">Confirmation de suppression</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isDeleting}
            ></button>
          </div>

          <div className="modal-body">
            {errorMessage ? (
              <div className={`alert ${errorMessage.includes('succès') ? 'alert-success' : 'alert-danger'}`}>
                {errorMessage}
              </div>
            ) : (
              <p>Êtes-vous sûr de vouloir supprimer ce prestataire ?</p>
            )}
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isDeleting}
            >
              Annuler
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Suppression...
                </>
              ) : (
                <>
                  <FaTrash className="me-1" /> Confirmer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppPrestataire;