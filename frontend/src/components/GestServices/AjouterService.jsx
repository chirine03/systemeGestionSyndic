import React, { useState, useEffect } from 'react';
import { getListeRaisonsSociales, getListeImmeubles,insertService } from '../../services/prestataires/servicesService';

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
  const [immeuble, setImmeuble] = useState([]); // État pour stocker la liste des immeubles
  const [errorMessage, setErrorMessage] = useState('');  // État pour le message d'erreur

  useEffect(() => {
    const fetchPrestataires = async () => {
      const result = await getListeRaisonsSociales();
      if (result.success) {
        setPrestataires(result.data);
      } else {
        console.error(result.message);
      }
    };
    fetchPrestataires();
  }, []);


  useEffect (() => {
    const fetchImmeuble = async () =>
    {
      const result = await getListeImmeubles();
      if (result.success) {
        setImmeuble(result.data);
      } else {
        console.error(result.message);
      }
    }
    fetchImmeuble();
  }, []);


  const validate = () => {
    const newErrors = {};
    const alphaRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    const today = new Date().toISOString().split('T')[0];

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis.';
    else if (!alphaRegex.test(formData.nom)) newErrors.nom = 'Le nom doit contenir uniquement des lettres.';
    else if (formData.nom.length < 3) newErrors.nom = 'Le nom doit contenir au moins 3 caractères.';

    if (!formData.type.trim()) newErrors.type = 'Le type est requis.';
    else if (!alphaRegex.test(formData.type)) newErrors.type = 'Le type doit contenir uniquement des lettres.';
    else if (formData.type.length < 3) newErrors.type = 'Le type doit contenir au moins 3 caractères.';

    if (!formData.dateIntervention) newErrors.dateIntervention = 'La date est requise.';
    else if (formData.dateIntervention < '2010-01-01' || formData.dateIntervention > today) {
      newErrors.dateIntervention = 'La date doit être entre 2010-01-01 et aujourd’hui.';
    }

    if (!formData.referenceFacture.trim()) newErrors.referenceFacture = 'La référence est requise.';
    else if (formData.referenceFacture.length < 4) newErrors.referenceFacture = 'Minimum 4 caractères.';

    if (!formData.montant) newErrors.montant = 'Le montant est requis.';
    else if (isNaN(formData.montant) || parseFloat(formData.montant) <= 0) {
      newErrors.montant = 'Le montant doit être un nombre positif.';
    }

    if (!formData.id_prestataire) newErrors.id_prestataire = 'Veuillez sélectionner un prestataire.';

    if (!formData.id_immeuble) newErrors.id_immeuble = 'Veuillez sélectionner un immeuble.';


    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("service ajouter : ", formData);
      const result = await insertService(formData);
      console.log("Résultat de l'insertion servive:", result);
      if (result.success) {
        onClose(); // Fermer la modal en cas de succès
      } else {
        setErrorMessage(result.message);  // Stocker le message d'erreur dans l'état
      }
    }
  };

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ajouter un nouveau service</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Affichage des erreurs sous forme de message dans un alert */}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

              <div className="mb-3">
                <label className="form-label">Nom du service *</label>
                <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} />
                {errors.nom && <div className="text-danger">{errors.nom}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Type *</label>
                <input type="text" name="type" className="form-control" value={formData.type} onChange={handleChange} />
                {errors.type && <div className="text-danger">{errors.type}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Date d'intervention *</label>
                <input
                  type="date"
                  name="dateIntervention"
                  className="form-control"
                  value={formData.dateIntervention}
                  onChange={handleChange}
                  min="2010-01-01"
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dateIntervention && <div className="text-danger">{errors.dateIntervention}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Référence Facture *</label>
                <input type="text" name="referenceFacture" className="form-control" value={formData.referenceFacture} onChange={handleChange} />
                {errors.referenceFacture && <div className="text-danger">{errors.referenceFacture}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Montant *</label>
                <input type="number" name="montant" className="form-control" value={formData.montant} onChange={handleChange} />
                {errors.montant && <div className="text-danger">{errors.montant}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Prestataire *</label>
                <select
                  name="id_prestataire"
                  className="form-control"
                  value={formData.id_prestataire}
                  onChange={handleChange}
                >
                  <option value="">-- Sélectionner un prestataire --</option>
                  {prestataires.map((p) => (
                    <option key={p.id_prestataire} value={p.id_prestataire}>
                      {p.raison_sociale}
                    </option>
                  ))}
                </select>
                {errors.id_prestataire && <div className="text-danger">{errors.id_prestataire}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Immeuble *</label>
                <select
                  name="id_immeuble"
                  className="form-control"
                  value={formData.id_immeuble}
                  onChange={handleChange}
                >
                  <option value="">-- Sélectionner un immeuble --</option>
                  {immeuble.map((i) => (
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
