import React, { useState } from "react";
import { ajouterPersonnel } from "../../services/personnel/personnelService";
import ConfirmeAjoutPers from "./ConfirmeAjoutPers";

const AjouterPersonnel= ({ onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    date_nais: "",
    cin: "",
    post: "",
    salaire: "",
  });

  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Nom est requis.";
    } else if (!/^[a-zA-ZÀ-ÿ\s\-]+$/.test(formData.nom)) {
      newErrors.nom = "Nom invalide (lettres et espaces uniquement).";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Prénom est requis.";
    } else if (!/^[a-zA-ZÀ-ÿ\s\-]+$/.test(formData.prenom)) {
      newErrors.prenom = "Prénom invalide (lettres et espaces uniquement).";
    }

    if (!/^\d{8}$/.test(formData.telephone)) {
      newErrors.telephone = "Téléphone invalide (8 chiffres).";
    }

    if (formData.adresse && formData.adresse.length > 150) {
      newErrors.adresse = "Adresse trop longue (max 150 caractères).";
    }

    if (!formData.date_nais) {
      newErrors.date_nais = "Date de naissance est requise.";
    } else {
      const age = new Date().getFullYear() - new Date(formData.date_nais).getFullYear();
      if (age < 18) newErrors.date_nais = "Le propriétaire doit avoir au moins 18 ans.";
    }

    if (!/^\d{8}$/.test(formData.cin)) {
      newErrors.cin = "CIN invalide (8 chiffres).";
    }

    if (!formData.salaire) {
    newErrors.salaire = "Salaire est requis.";
    } else if (isNaN(formData.salaire) || parseFloat(formData.salaire) <= 0) {
    newErrors.salaire = "Salaire doit être un nombre positif.";
    }

    if (!formData.post) {
    newErrors.post = "Poste est requis.";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiMessage("");
    
    if (validate()) {
      setShowConfirmation(true); // Affiche la modale de confirmation avant l'appel API
    }
  };

  const handleConfirmAdd = async () => {
    setIsSubmitting(true);
    try {
      const result = await ajouterPersonnel(formData);
      if (result.success) {
        setApiMessage({ text: "Personnel ajouté avec succès !", type: "success" });
        if (onSave) onSave();
        setFormData({
          nom: "",
          prenom: "",
          telephone: "",
          adresse: "",
          date_nais: "",
          cin: "",
          post: "",
          salaire: "",
        });
        setErrors({});
      } else {
        setApiMessage({ text: result.message, type: "danger" });
      }
    } catch (error) {
      setApiMessage({ text: "Une erreur est survenue lors de l'ajout.", type: "danger" });
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="ajouter-prestataire">
      <h2 className="ajout-title">Ajouter un Personnel</h2>
      
      {apiMessage && (
        <div className={`alert alert-${apiMessage.type} text-center mt-3`}>
          {apiMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Nom *</label>
          <input 
            type="text" 
            name="nom" 
            className={`form-control ${errors.nom ? "is-invalid" : ""}`}
            value={formData.nom} 
            onChange={handleChange} 
          />
          {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Prénom *</label>
          <input 
            type="text" 
            name="prenom" 
            className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
            value={formData.prenom} 
            onChange={handleChange} 
          />
          {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Téléphone *</label>
          <input 
            type="text" 
            name="telephone" 
            className={`form-control ${errors.telephone ? "is-invalid" : ""}`}
            value={formData.telephone} 
            onChange={handleChange} 
          />
          {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Adresse *</label>
          <input 
            type="text" 
            name="adresse" 
            className={`form-control ${errors.adresse ? "is-invalid" : ""}`}
            value={formData.adresse} 
            onChange={handleChange} 
          />
          {errors.adresse && <div className="invalid-feedback">{errors.adresse}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Date de naissance *</label>
          <input 
            type="date" 
            name="date_nais" 
            className={`form-control ${errors.date_nais ? "is-invalid" : ""}`}
            value={formData.date_nais} 
            onChange={handleChange} 
          />
          {errors.date_nais && <div className="invalid-feedback">{errors.date_nais}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">CIN *</label>
          <input 
            type="text" 
            name="cin" 
            className={`form-control ${errors.cin ? "is-invalid" : ""}`}
            value={formData.cin} 
            onChange={handleChange} 
          />
          {errors.cin && <div className="invalid-feedback">{errors.cin}</div>}
        </div>

        <div className="col-md-6">
            <label className="form-label fw-bold">Salaire *</label>
            <input 
                type="number" 
                name="salaire" 
                className={`form-control ${errors.salaire ? "is-invalid" : ""}`}
                value={formData.salaire} 
                onChange={handleChange} 
                min="0"
            />
            {errors.salaire && <div className="invalid-feedback">{errors.salaire}</div>}
            </div>

            <div className="col-md-6">
            <label className="form-label fw-bold">Poste *</label>
            <select 
                name="post" 
                className={`form-select ${errors.post ? "is-invalid" : ""}`}
                value={formData.post}
                onChange={handleChange}
            >
                <option value="">-- Sélectionner un poste --</option>
                <option value="gardien">Gardien</option>
                <option value="femme de ménage">Femme de ménage</option>
            </select>
            {errors.post && <div className="invalid-feedback">{errors.post}</div>}
        </div>


        <div className="col-12 text-center">
          <button 
            type="submit" 
            className="btn btn-ajouter"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                En cours...
              </>
            ) : (
              "Ajouter"
            )}
          </button>
        </div>
      </form>

      <ConfirmeAjoutPers 
        show={showConfirmation}
        onConfirm={handleConfirmAdd}
        onCancel={() => setShowConfirmation(false)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AjouterPersonnel;