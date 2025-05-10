import React, { useState, useEffect } from "react";
import "./AjouterCotisation.css";
import ImprRecu from "./ImprRecu";
import { fetchCotisationInfos, ajouterCotisation } from "../../services/cotisation/cotisationService";

const AjouterCotisation = () => {
  const [formData, setFormData] = useState({
    numeroAppartement: "",
    annee: "",
    periode: "",
    montant: "",
    typePayement: "",
    datePayement: "",
  });

  const [errors, setErrors] = useState({});
  const [appartements, setAppartements] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showRecap, setShowRecap] = useState(false);
  const [recapData, setRecapData] = useState({});
  const [showModal, setShowModal] = useState(false); // ← pour modale

  useEffect(() => {
    const loadInfos = async () => {
      const result = await fetchCotisationInfos();
      if (result.success) {
        setAppartements(result.appartements);
        setAnnees(result.annees);
      } else {
        console.error("Erreur :", result.message);
      }
    };
    loadInfos();
  }, []);

  useEffect(() => {
    if (recapData.nomProprietaire && recapData.prenomProprietaire) {
      setShowRecap(true);
    }
  }, [recapData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.numeroAppartement) newErrors.numeroAppartement = "Le numéro d’appartement est requis.";
    if (!formData.annee) newErrors.annee = "Veuillez sélectionner une année.";
    if (!formData.periode) newErrors.periode = "Veuillez sélectionner une période valide.";
    if (!formData.montant.trim()) newErrors.montant = "Le montant est requis.";
    if (!formData.typePayement) newErrors.typePayement = "Veuillez choisir un type de paiement valide.";
    if (!formData.datePayement) newErrors.datePayement = "Veuillez entrer une date de paiement.";

    if (formData.montant && (isNaN(formData.montant) || parseFloat(formData.montant) <= 0)) {
      newErrors.montant = "Le montant doit être un nombre strictement positif.";
    }

    const minDate = new Date("2020-01-01");
    const selectedDate = new Date(formData.datePayement);
    if (formData.datePayement && selectedDate < minDate) {
      newErrors.datePayement = "La date doit être postérieure au 01/01/2020.";
    }

    if (selectedDate > new Date()) {
      newErrors.datePayement = "La date ne peut pas être dans le futur.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowModal(true); // Afficher modale
  };

  const confirmSubmit = async () => {
    setShowModal(false);
    try {
      const result = await ajouterCotisation(formData);
      if (result.status === "success") {
        setMessageType("success");
        setMessage(result.message);
        const { nom, prenom } = result.proprietaire;
        setRecapData({ ...formData, nomProprietaire: nom, prenomProprietaire: prenom });
        setShowRecap(true);
        setFormData({
          numeroAppartement: "",
          annee: "",
          periode: "",
          montant: "",
          typePayement: "",
          datePayement: "",
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
    }, 4000);
  };

  const handleCancel = () => {
    setFormData({
      numeroAppartement: "",
      annee: "",
      periode: "",
      montant: "",
      typePayement: "",
      datePayement: "",
    });
    setErrors({});
  };

  return (
    <div className="ajouter-cotisation">
      <h2 className="ajout-title">Ajouter une nouvelle cotisation</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Numéro Appartement :</label>
          <select name="numeroAppartement" value={formData.numeroAppartement} onChange={handleChange}>
            <option value="">Choisir un appartement</option>
            {appartements.map((num, index) => (
              <option key={index} value={num}>{num}</option>
            ))}
          </select>
          {errors.numeroAppartement && <p className="error-message">{errors.numeroAppartement}</p>}
        </div>

        <div className="form-group">
          <label>Année :</label>
          <select name="annee" value={formData.annee} onChange={handleChange}>
            <option value="">Choisir l'année</option>
            {annees.map((an, index) => (
              <option key={index} value={an}>{an}</option>
            ))}
          </select>
          {errors.annee && <p className="error-message">{errors.annee}</p>}
        </div>

        <div className="form-group">
          <label>Période :</label>
          <select name="periode" value={formData.periode} onChange={handleChange}>
            <option value="">Choisir la période</option>
            <option value="1">1 Trimestre</option>
            <option value="2">2 Trimestre</option>
            <option value="3">3 Trimestre</option>
            <option value="4">4 Trimestre</option>
          </select>
          {errors.periode && <p className="error-message">{errors.periode}</p>}
        </div>

        <div className="form-group">
          <label>Montant :</label>
          <input type="number" name="montant" value={formData.montant} onChange={handleChange} />
          {errors.montant && <p className="error-message">{errors.montant}</p>}
        </div>

        <div className="form-group">
          <label>Type de Payement :</label>
          <select name="typePayement" value={formData.typePayement} onChange={handleChange}>
            <option value="">Choisir le type de paiement</option>
            <option value="espèce">Espèce</option>
            <option value="virement">Virement</option>
            <option value="versement">Versement</option>
            <option value="chèque">Chèque</option>
          </select>
          {errors.typePayement && <p className="error-message">{errors.typePayement}</p>}
        </div>

        <div className="form-group">
          <label>Date de Payement :</label>
          <input type="date" name="datePayement" min="2020-01-01" value={formData.datePayement} onChange={handleChange} />
          {errors.datePayement && <p className="error-message">{errors.datePayement}</p>}
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

      {showRecap && (
        <ImprRecu
          recapData={recapData}
          onClose={() => setShowRecap(false)}
        />
      )}

      {/* Modal de confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmation</h3>
            <p>Voulez-vous vraiment ajouter cette cotisation ?</p>
            <div className="modal-buttons">
              <button onClick={confirmSubmit} className="btn btn-confirm">Confirmer</button>
              <button onClick={() => setShowModal(false)} className="btn btn-cancel">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AjouterCotisation;
