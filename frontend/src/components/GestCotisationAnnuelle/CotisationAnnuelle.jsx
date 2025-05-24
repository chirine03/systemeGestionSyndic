import React, { useState } from "react";
import "./CotisationAnnuelle.css";
import {fetchAjouterCotAnnuelle} from "../../services/cotAnnuelle/cotAnnuelleService";

const CotisationAnnuelle = () => {
  const [formData, setFormData] = useState({
    annee: "",
    montant_avec_parking: "",
    montant_sans_parking: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    const annee = formData.annee.trim();
    const montantAvec = formData.montant_avec_parking.trim();
    const montantSans = formData.montant_sans_parking.trim();

    if (!formData.annee) {
      newErrors.annee = "L'année est requise.";
    } else if (isNaN(annee) || annee < 2000 || annee > 2100) {
      newErrors.annee = "L'année est invalide !";
    }
  
    if (!formData.montant_avec_parking) {
      newErrors.montant_avec_parking = "Le montant avec parking est requis.";
    } else if (isNaN(montantAvec) || montantAvec < 10 || montantAvec > 999) {
      newErrors.montant_avec_parking = "Le montant est invalide !";
    } else if (montantAvec <= montantSans) {
      newErrors.montant_avec_parking = "Le montant avec parking doit être supérieur au montant sans parking.";
    }

    if (!formData.montant_sans_parking) {
      newErrors.montant_sans_parking = "Le montant sans parking est requis.";
    } else if (isNaN(montantSans) || montantSans < 10 || montantSans > 999) {
      newErrors.montant_sans_parking = "Le montant est invalide !";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const isConfirmed = window.confirm("Voulez-vous vraiment ajouter cette cotisation annuelle ?");
    if (!isConfirmed) return;

    try {
      const result = await fetchAjouterCotAnnuelle(formData);
      console.log("Réponse du serveur :", result);

      if (result.success) {
        setMessageType("success");
        setMessage(result.message);
        setFormData({
          annee: "",
          montant_avec_parking: "",
          montant_sans_parking: "",
        });
      } else {
        setMessageType("error");
        setMessage(result.message);
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Une erreur est survenue lors de l'ajout.");
    }

    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  const handleCancel = () => {
    setFormData({
      annee: "",
      montant_avec_parking: "",
      montant_sans_parking: "",
    });
    setErrors({});
  };

  return (
    <div className="ajouter-cotisation">
      <h2 className="ajout-title">Ajouter une Cotisation Annuelle</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Année :</label>
          <input
            type="number"
            name="annee"
            value={formData.annee}
            onChange={handleChange}
            required
          />
          {errors.annee && <p className="error-message">{errors.annee}</p>}
        </div>

        <div className="form-group">
          <label>Montant avec Parking (DTN) :</label>
          <input
            type="number"
            step="0.01"
            name="montant_avec_parking"
            value={formData.montant_avec_parking}
            onChange={handleChange}
            required
          />
          {errors.montant_avec_parking && <p className="error-message">{errors.montant_avec_parking}</p>}
        </div>

        <div className="form-group">
          <label>Montant sans Parking (DTN) :</label>
          <input
            type="number"
            step="0.01"
            name="montant_sans_parking"
            value={formData.montant_sans_parking}
            onChange={handleChange}
            required
          />
          {errors.montant_sans_parking && <p className="error-message">{errors.montant_sans_parking}</p>}
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-ajouter">Ajouter</button>
          <button type="button" className="btn btn-annuler" onClick={handleCancel}>Annuler</button>
        </div>
      </form>

      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CotisationAnnuelle;
