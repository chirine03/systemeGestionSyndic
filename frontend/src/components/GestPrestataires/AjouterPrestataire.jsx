import React, { useState } from 'react';
import { addPrestataire } from '../../services/prestataires/prestatairesService';
import './AjouterPrestataire.css';

const AjouterPrestataire = () => {
  const [formData, setFormData] = useState({
    raison_sociale: '',
    num_matricule: '',
    adresse: '',
    telephone: '',
    fax: '',
    email: '',
    site_web: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.raison_sociale.trim()) {
      newErrors.raison_sociale = "Raison sociale est obligatoire.";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.raison_sociale)) {
      newErrors.raison_sociale = "Utilisez uniquement lettres, chiffres et espaces.";
    }
    if (!formData.num_matricule.trim()) {
      newErrors.num_matricule = "Matricule est obligatoire.";
    } else if (!/^[a-zA-Z0-9]{10,20}$/.test(formData.num_matricule)) {
      newErrors.num_matricule = "Matricule invalide (10-20 caractères).";
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est obligatoire.";
    } else if (!/^\d{8}$/.test(formData.telephone)) {
      newErrors.telephone = "Téléphone doit avoir exactement 8 chiffres.";
    }
    if (formData.fax && !/^\d{8}$/.test(formData.fax)) {
      newErrors.fax = "Fax doit avoir exactement 8 chiffres.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email est obligatoire.";
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide.";
    }
    if (formData.site_web && !/^[a-zA-Z0-9.-]+\.([a-zA-Z]{2,})$/.test(formData.site_web)) {
      newErrors.site_web = "URL invalide (ex: exemple.com)";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setPendingSubmit(true);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    const result = await addPrestataire(formData);
    if (result.success) {
      setSuccessMessage(result.message); // Message de succès
      setErrorMessage(''); // Clear any error message
      setFormData({
        raison_sociale: '',
        num_matricule: '',
        adresse: '',
        telephone: '',
        fax: '',
        email: '',
        site_web: '',
      });
    } else {
      setErrorMessage(result.message); // Show error message
      setSuccessMessage(''); // Clear success message
    }
    setPendingSubmit(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingSubmit(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Reset the specific field error
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="ajouter-prestataire">
      <h2 className="ajout-title">Ajouter un Prestataire de Service</h2>
      
      {/* Success and Error Messages */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label>Raison Sociale *</label>
            <input
              type="text"
              name="raison_sociale"
              value={formData.raison_sociale}
              onChange={handleChange}
              className={`form-control ${errors.raison_sociale ? 'is-invalid' : ''}`}
            />
            {errors.raison_sociale && <p className="error-message">{errors.raison_sociale}</p>}
          </div>
          <div className="form-group">
            <label>Matricule Fiscale *</label>
            <input
              type="text"
              name="num_matricule"
              value={formData.num_matricule}
              onChange={handleChange}
              className={`form-control ${errors.num_matricule ? 'is-invalid' : ''}`}
            />
            {errors.num_matricule && <p className="error-message">{errors.num_matricule}</p>}
          </div>
        </div>
        
        {/* Remaining form fields */}
        <div className="form-row">
          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className={`form-control ${errors.adresse ? 'is-invalid' : ''}`}
            />
            {errors.adresse && <p className="error-message">{errors.adresse}</p>}
          </div>
          <div className="form-group">
            <label>Téléphone *</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
            />
            {errors.telephone && <p className="error-message">{errors.telephone}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fax</label>
            <input
              type="text"
              name="fax"
              value={formData.fax}
              onChange={handleChange}
              className={`form-control ${errors.fax ? 'is-invalid' : ''}`}
            />
            {errors.fax && <p className="error-message">{errors.fax}</p>}
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Site Web</label>
            <input
              type="text"
              name="site_web"
              value={formData.site_web}
              onChange={handleChange}
              className={`form-control ${errors.site_web ? 'is-invalid' : ''}`}
            />
            {errors.site_web && <p className="error-message">{errors.site_web}</p>}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-ajouter" disabled={pendingSubmit}>
            {pendingSubmit ? 'Ajout en cours...' : 'Ajouter'}
          </button>
          <button type="button" className="btn btn-annuler" onClick={handleCancel}>
            Annuler
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content rounded-4">
              <div className="modal-header bg-light">
                <h5 className="modal-title text-success">Confirmation</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir ajouter ces informations ?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={handleCancel}>Annuler</button>
                <button className="btn btn-success" onClick={handleConfirm}>Confirmer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AjouterPrestataire;
