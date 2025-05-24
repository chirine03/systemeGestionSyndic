import React, { useState, useEffect } from 'react';
import { getListeRaisonsSociales, getListeImmeubles, insertService } from '../../services/prestataires/servicesService';

const AjouterService = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    dateIntervention: '',
    referenceFacture: '',
    description: '',
    montant: '',
    id_prestataire: '',
    id_immeuble: '',
  });

  const [errors, setErrors] = useState({});
  const [prestataires, setPrestataires] = useState([]);
  const [immeuble, setImmeuble] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPrestataires = async () => {
      const result = await getListeRaisonsSociales();
      if (result.success) setPrestataires(result.data);
    };
    fetchPrestataires();
  }, []);

  useEffect(() => {
    const fetchImmeuble = async () => {
      const result = await getListeImmeubles();
      if (result.success) setImmeuble(result.data);
    };
    fetchImmeuble();
  }, []);

  const validate = () => {
    const newErrors = {};
    const alphaRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    const today = new Date().toISOString().split('T')[0];

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis.';
    else if (formData.nom.length < 3) newErrors.nom = 'Min 3 caractères.';

    if (!formData.type.trim()) newErrors.type = 'Le type est requis.';
    else if (!alphaRegex.test(formData.type)) newErrors.type = 'Lettres uniquement.';
    else if (formData.type.length < 3) newErrors.type = 'Min 3 caractères.';

    if (!formData.dateIntervention) newErrors.dateIntervention = 'La date est requise.';
    else if (formData.dateIntervention < '2010-01-01' || formData.dateIntervention > today)
      newErrors.dateIntervention = 'Date invalide.';

    if (!formData.referenceFacture.trim()) newErrors.referenceFacture = 'Référence requise.';
    else if (formData.referenceFacture.length < 4) newErrors.referenceFacture = 'Min 4 caractères.';

    if (!formData.montant) newErrors.montant = 'Montant requis.';
    else if (isNaN(formData.montant) || parseFloat(formData.montant) <= 0)
      newErrors.montant = 'Doit être un nombre positif.';

    if (!formData.id_prestataire) newErrors.id_prestataire = 'Prestataire requis.';
    if (!formData.id_immeuble) newErrors.id_immeuble = 'Immeuble requis.';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      type: '',
      dateIntervention: '',
      referenceFacture: '',
      description: '',
      montant: '',
      id_prestataire: '',
      id_immeuble: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const confirmed = window.confirm('Confirmez-vous l’ajout du service ?');
      if (confirmed) {
        const result = await insertService(formData);
        if (result.success) {
          setSuccessMessage(result.message);
          resetForm();
          setTimeout(() => {
            setSuccessMessage('');
            onClose();
          }, 1500);
        } else {
          setErrorMessage(result.message);
        }
      }
    }
  };

  return (
    <div className="modal show" style={{ display: 'block',  backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ajouter un nouveau service</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              {/* Champs du formulaire */}
              {[
                { label: 'Nom du service', name: 'nom', type: 'text' },
                { label: 'Type', name: 'type', type: 'text' },
                { label: 'Date d\'intervention', name: 'dateIntervention', type: 'date', min: '2010-01-01', max: new Date().toISOString().split('T')[0] },
                { label: 'Référence Facture', name: 'referenceFacture', type: 'text' },
                { label: 'Montant DTN', name: 'montant', type: 'number' }
              ].map(field => (
                <div className="mb-3" key={field.name}>
                  <label className="form-label">{field.label} *</label>
                  <input
                    className="form-control"
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    {...(field.min ? { min: field.min } : {})}
                    {...(field.max ? { max: field.max } : {})}
                  />
                  {errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label">Prestataire *</label>
                <select name="id_prestataire" className="form-control" value={formData.id_prestataire} onChange={handleChange}>
                  <option value="">-- Sélectionner un prestataire --</option>
                  {prestataires.map(p => (
                    <option key={p.id_prestataire} value={p.id_prestataire}>{p.raison_sociale}</option>
                  ))}
                </select>
                {errors.id_prestataire && <div className="text-danger">{errors.id_prestataire}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Immeuble *</label>
                <select name="id_immeuble" className="form-control" value={formData.id_immeuble} onChange={handleChange}>
                  <option value="">-- Sélectionner un immeuble --</option>
                  {immeuble.map(i => (
                    <option key={i.id_immeuble} value={i.id_immeuble}>
                      {i.raison_sociale} - {i.bloc}
                    </option>
                  ))}
                </select>
                {errors.id_immeuble && <div className="text-danger">{errors.id_immeuble}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
              <button type="submit" className="btn btn-primary">Ajouter</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjouterService;
