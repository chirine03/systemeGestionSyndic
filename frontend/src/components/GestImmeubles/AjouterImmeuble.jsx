import React, { useState } from 'react';
import { ajouterImmeuble } from '../../services/immeuble/immeubleService'; 
import { Modal, Button } from 'react-bootstrap'; // Import des composants Modal et Button de react-bootstrap
import ConfirmeModale from './ConfirmeModale';

const AjouterImmeuble = () => {
  const [formData, setFormData] = useState({
    id_immeuble: '',
    raison_sociale: '',
    matricule: '',
    adresse: '',
    nbr_etage: '',
    bloc: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // État pour gérer l'affichage du modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Validation de la raison sociale
    if (!formData.raison_sociale.trim()) {
      newErrors.raison_sociale = "Raison sociale est obligatoire.";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.raison_sociale)) {
      newErrors.raison_sociale = "Utilisez uniquement lettres, chiffres et espaces.";
    }

    // Validation du matricule
    if (!formData.matricule.trim()) {
      newErrors.matricule = "Matricule est obligatoire.";
    } else if (!/^[a-zA-Z0-9]{10,20}$/.test(formData.matricule)) {
      newErrors.matricule = "Matricule invalide (10-20 caractères alphanumériques).";
    }

    // Validation de l'adresse
    if (!formData.adresse.trim()) {
      newErrors.adresse = "Adresse est obligatoire.";
    } else if (formData.adresse.length < 5 || formData.adresse.length > 150) {
      newErrors.adresse = "Adresse entre 5 et 150 caractères.";
    }

    // Validation du nombre d'étages
    if (!formData.nbr_etage || isNaN(formData.nbr_etage)) {
      newErrors.nbr_etage = "Nombre d'étages est obligatoire et doit être un nombre valide.";
    } else if (parseInt(formData.nbr_etage) < 1 || parseInt(formData.nbr_etage) > 100) {
      newErrors.nbr_etage = "Nombre d'étages doit être entre 1 et 100.";
    }

    // Validation du bloc
    if (!formData.bloc.trim()) {
      newErrors.bloc = "Le bloc est obligatoire.";
    } else if (!/^[A-Z]$/.test(formData.bloc)) {
      newErrors.bloc = "Le bloc doit être une seule lettre majuscule (A-Z).";
    }

    // Validation de la description
    if (formData.description && formData.description.length > 250) {
      newErrors.description = "Description : max 250 caractères.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setPendingSubmit(true);

    if (!validate()) {
      setPendingSubmit(false);
      return;
    }

    setShowConfirmationModal(true);
    setPendingSubmit(false);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmationModal(false);
    setPendingSubmit(true);

    try {
      const result = await ajouterImmeuble(formData);
      setPendingSubmit(false);

      if (result.success) {
        setSuccessMessage(result.message);
        setFormData({
          id_immeuble: '',
          raison_sociale: '',
          matricule: '',
          adresse: '',
          nbr_etage: '',
          bloc: '',
          description: ''
        });
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setPendingSubmit(false);
      setErrorMessage("Erreur inattendue lors de l'ajout de l'immeuble.");
    }
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="ajouter-prestataire">
      <h2 className="ajout-title">Ajouter un Immeuble</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="p-4 rounded">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Raison Sociale *</label>
            <input
              type="text"
              name="raison_sociale"
              value={formData.raison_sociale}
              onChange={handleChange}
              className={`form-control ${errors.raison_sociale ? 'is-invalid' : ''}`}
            />
            {errors.raison_sociale && <div className="invalid-feedback">{errors.raison_sociale}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Matricule *</label>
            <input
              type="text"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
              className={`form-control ${errors.matricule ? 'is-invalid' : ''}`}
            />
            {errors.matricule && <div className="invalid-feedback">{errors.matricule}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Adresse *</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className={`form-control ${errors.adresse ? 'is-invalid' : ''}`}
            />
            {errors.adresse && <div className="invalid-feedback">{errors.adresse}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Nombre d'Étages *</label>
            <input
              type="number"
              name="nbr_etage"
              value={formData.nbr_etage}
              onChange={handleChange}
              className={`form-control ${errors.nbr_etage ? 'is-invalid' : ''}`}
              min="1"
              max="100"
            />
            {errors.nbr_etage && <div className="invalid-feedback">{errors.nbr_etage}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Bloc *</label>
            <input
              type="text"
              name="bloc"
              value={formData.bloc}
              onChange={handleChange}
              className={`form-control ${errors.bloc ? 'is-invalid' : ''}`}
            />
            {errors.bloc && <div className="invalid-feedback">{errors.bloc}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label fw-bold">Description (optionnel)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              rows="3"
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-ajouter rounded-pill px-4" disabled={pendingSubmit}>
            {pendingSubmit ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </div>
      </form>

       <ConfirmeModale
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirmer l'ajout"
        message="Êtes-vous sûr de vouloir ajouter cet immeuble ?"
      />
    </div>
  );
};

export default AjouterImmeuble;