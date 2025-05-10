import React, { useState, useEffect } from 'react';
import { getListeServicesSansDepense, ajouterDepense } from '../../services/depense/depenseService';

const AjouterDepense = () => {
  const [formData, setFormData] = useState({
    motif: '',
    categorie: '',
    montant: '',
    date: '',
    type_paiement: '',
    fournisseur: '',
    id_service: '',
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [services, setServices] = useState([]);

  const categories = ['Loyer', 'Électricité', 'Eau', 'Internet', 'Maintenance'];
  const typesPaiement = ['Espèce', 'Virement', 'Versement', 'Chèque'];

  useEffect(() => {
    const fetchServices = async () => {
      const res = await getListeServicesSansDepense();
      if (res.success) {
        setServices(res.data);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const montant = parseFloat(formData.montant);
    const today = new Date().toISOString().split('T')[0];

    if (!formData.motif) newErrors.motif = 'Champ requis';
    if (!formData.categorie) newErrors.categorie = 'Champ requis';
    if (!formData.montant) newErrors.montant = 'Champ requis';
    else if (montant < 0 || montant > 1000000) newErrors.montant = 'Montant invalide';
    if (!formData.date) newErrors.date = 'Champ requis';
    else if (formData.date > today) newErrors.date = 'Date future interdite';
    if (!formData.type_paiement) newErrors.type_paiement = 'Champ requis';
    if (formData.id_service === '' || formData.id_service === undefined) {
      newErrors.id_service = 'Champ requis';
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    setPendingSubmit(true);

    const data = {
      motif: formData.motif,
      categorie: formData.categorie,
      montant: parseFloat(formData.montant),
      date: formData.date,
      type_paiement: formData.type_paiement,
      id_service: formData.id_service, // Assurez-vous que c'est le bon champ
    };

    console.log("FormData envoyé :", formData);

    // Appeler la fonction pour ajouter la dépense
    const response = await ajouterDepense(data);

    if (response.success) {
      alert(response.message); // Afficher le message de succès
      setPendingSubmit(false);
      setShowModal(false);
      setFormData({
        motif: '',
        categorie: '',
        montant: '',
        date: '',
        type_paiement: '',
        fournisseur: '',
        id_service: '',
      });
    } else {
      alert(response.message); // Afficher l'erreur en cas de problème
      setPendingSubmit(false);
      setShowModal(false);
    }
  };

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="ajouter-prestataire" style={{ width: '600px', margin: '100px auto', padding: '20px', borderRadius: '10px' }}>
      <h2 className="ajout-title">Ajouter une Dépense</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label>Motif Dépenses *</label>
            <input
              type="text"
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              className={`form-control ${errors.motif ? 'is-invalid' : ''}`}
            />
            {errors.motif && <p className="error-message">{errors.motif}</p>}
          </div>
          <div className="form-group">
            <label>Catégorie Dépenses *</label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className={`form-control ${errors.categorie ? 'is-invalid' : ''}`}
            >
              <option value="">-- Sélectionner --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categorie && <p className="error-message">{errors.categorie}</p>}
          </div>
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Fournisseur *</label>
            <select
                name="id_service"
                value={formData.id_service !== null ? String(formData.id_service) : 'autre'}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  const value = selectedValue === '' || selectedValue === 'autre' ? null : Number(selectedValue);

                  // Trouver le service sélectionné
                  const selectedService = services.find((s) => s.id_service === value);

                  // Si un service est trouvé, remplir aussi le montant
                  if (selectedService) {
                    setFormData({
                      ...formData,
                      id_service: value,
                      montant: selectedService.montant || '', // ajuster selon nom réel du champ
                    });
                  } else {
                    setFormData({ ...formData, id_service: value, montant: '' });
                  }
                }}
                className={`form-control ${errors.id_service ? 'is-invalid' : ''}`}
              >

              <option value="">-- Sélectionner --</option>
              {services.map((s) => (
                <option key={s.id_service} value={s.id_service}>
                  {s.raison_sociale} : {s.nom_service} / {s.reference_facture}
                </option>
              ))}
              <option value="autre">Autre ...</option>
            </select>

            {errors.id_service && <p className="error-message">{errors.id_service}</p>}
          </div>

          <div className="form-group">
            <label>Montant Facture *</label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              min="0"
              max="1000000"
              className={`form-control ${errors.montant ? 'is-invalid' : ''}`}
            />
            {errors.montant && <p className="error-message">{errors.montant}</p>}
          </div>
          
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date de Paiement *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={todayDate}
              className={`form-control ${errors.date ? 'is-invalid' : ''}`}
            />
            {errors.date && <p className="error-message">{errors.date}</p>}
          </div>
          <div className="form-group">
            <label>Type de Paiement *</label>
            <select
              name="type_paiement"
              value={formData.type_paiement}
              onChange={handleChange}
              className={`form-control ${errors.type_paiement ? 'is-invalid' : ''}`}
            >
              <option value="">-- Sélectionner --</option>
              {typesPaiement.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type_paiement && <p className="error-message">{errors.type_paiement}</p>}
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

      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content rounded-4">
              <div className="modal-header bg-light">
                <h5 className="modal-title text-success">Confirmation</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir ajouter cette dépense ?</p>
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

export default AjouterDepense;
