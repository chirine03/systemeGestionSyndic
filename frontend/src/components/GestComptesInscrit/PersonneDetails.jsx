// src/components/ComptesInscrit/PersonneDetails.jsx
import React from 'react';

const PersonneDetails = ({ personne, onClose }) => {
  if (!personne) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Informations personnelles</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Nom :</strong> {personne.nom}</p>
            <p><strong>Prénom :</strong> {personne.prenom}</p>
            <p><strong>Adresse :</strong> {personne.adresse || 'Non renseignée'}</p>
            <p><strong>Téléphone :</strong> {personne.telephone}</p>
            <p><strong>CIN :</strong> {personne.cin || 'Non renseigné'}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonneDetails;
