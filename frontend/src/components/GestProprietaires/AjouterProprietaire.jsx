import React, { useState } from "react";
import { ajouterProprietaire } from "../../services/proprietaire/proprietaireService"; // Assurez-vous que le service est importé

const AjouterProprietaire = ({ onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    date_nais: "",
    cin: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = () => {
    const newErrors = {};

    // Validation du nom et prénom
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

    // Validation du téléphone
    if (!/^\d{8}$/.test(formData.telephone)) {
      newErrors.telephone = "Téléphone invalide (8 chiffres).";
    }

    // Validation de l'adresse
    if (formData.adresse && formData.adresse.length > 150) {
      newErrors.adresse = "Adresse trop longue (max 150 caractères).";
    }

    // Validation de la date de naissance
    if (!formData.date_nais) {
      newErrors.date_nais = "Date de naissance est requise.";
    } else {
      const age = new Date().getFullYear() - new Date(formData.date_nais).getFullYear();
      if (age < 18) newErrors.date_nais = "Le propriétaire doit avoir au moins 18 ans.";
    }

    // Validation du CIN
    if (!/^\d{8}$/.test(formData.cin)) {
      newErrors.cin = "CIN invalide (8 chiffres).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const result = await ajouterProprietaire(formData); // Appel au service d'ajout
        if (result.success) {
          setMessage("Propriétaire ajouté avec succès !");
          if (onSave) onSave(formData); // Appel de la fonction onSave passée en prop si nécessaire
          setFormData({
            nom: "",
            prenom: "",
            telephone: "",
            adresse: "",
            date_nais: "",
            cin: "",
          });
          setErrors({});
        } else {
          setMessage(result.message);
        }
      } catch (error) {
        setMessage("Une erreur est survenue lors de l'ajout.");
      }
    } else {
      setMessage("");
    }
  };

  return (
    <div className="ajouter-prestataire">
      <h2 className="ajout-title">Ajouter un Propriétaire</h2>
      <form onSubmit={handleSubmit} className="row g-3">

        <div className="col-md-6">
          <label className="form-label fw-bold">Nom *</label>
          <input type="text" name="nom" className={`form-control ${errors.nom ? "is-invalid" : ""}`}
            value={formData.nom} onChange={handleChange} />
          {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Prénom *</label>
          <input type="text" name="prenom" className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
            value={formData.prenom} onChange={handleChange} />
          {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Téléphone *</label>
          <input type="text" name="telephone" className={`form-control ${errors.telephone ? "is-invalid" : ""}`}
            value={formData.telephone} onChange={handleChange} />
          {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Adresse *</label>
          <input type="text" name="adresse" className={`form-control ${errors.adresse ? "is-invalid" : ""}`}
            value={formData.adresse} onChange={handleChange} />
          {errors.adresse && <div className="invalid-feedback">{errors.adresse}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Date de naissance *</label>
          <input type="date" name="date_nais" className={`form-control ${errors.date_nais ? "is-invalid" : ""}`}
            value={formData.date_nais} onChange={handleChange} />
          {errors.date_nais && <div className="invalid-feedback">{errors.date_nais}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">CIN *</label>
          <input type="text" name="cin" className={`form-control ${errors.cin ? "is-invalid" : ""}`}
            value={formData.cin} onChange={handleChange} />
          {errors.cin && <div className="invalid-feedback">{errors.cin}</div>}
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-ajouter">Ajouter</button>
        </div>

        {message && (
          <div className="alert alert-success text-center mt-3">{message}</div>
        )}
      </form>
    </div>
  );
};

export default AjouterProprietaire;
