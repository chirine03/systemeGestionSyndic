import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchCotisationInfos, modifierCotisation } from "../../services/cotisation/cotisationService";

// Fonction utilitaire pour formater la date au format "yyyy-MM-dd"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const ModifierCotisation = ({ show, handleClose, cotisation, onCotisationUpdated }) => {
  const [formData, setFormData] = useState({ ...cotisation });
  const [errors, setErrors] = useState({});
  const [appartements, setAppartements] = useState([]);
  const [annees, setAnnees] = useState([]);

  // Charger les infos des appartements et années
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

  // Met à jour formData quand cotisation change
  useEffect(() => {
    setFormData({
      ...cotisation,
      date_payement: formatDate(cotisation.date_payement),
    });
  }, [cotisation]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.num_appartement) newErrors.num_appartement = "Le numéro d’appartement est requis.";
    if (!formData.annee) newErrors.annee = "Veuillez sélectionner une année.";
    if (!formData.periode) newErrors.periode = "Veuillez sélectionner une période.";
    if (!formData.montant || parseFloat(formData.montant) <= 0) newErrors.montant = "Montant invalide.";
    if (!formData.type_payement) newErrors.type_payement = "Veuillez choisir un type de paiement.";
    if (!formData.date_payement) {
      newErrors.date_payement = "Date de paiement requise.";
    } else {
      const selectedDate = new Date(formData.date_payement);
      if (selectedDate < new Date("2020-01-01")) newErrors.date_payement = "Date trop ancienne.";
      if (selectedDate > new Date()) newErrors.date_payement = "Date dans le futur non autorisée.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updatedData = {
        ...formData,
        date_payement: formatDate(formData.date_payement),
      };

      const result = await modifierCotisation(updatedData);
      if (result.status === "success") {
        alert("Cotisation modifiée avec succès !");
        onCotisationUpdated(); // Appeler la fonction pour recharger la liste
        handleClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Une erreur est survenue lors de la modification.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier la Cotisation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Numéro Appartement</Form.Label>
            <Form.Select
              name="num_appartement"
              value={formData.num_appartement}
              onChange={handleChange}
              isInvalid={!!errors.num_appartement}
            >
              <option value="">Choisir un appartement</option>
              {appartements.map((num, index) => (
                <option key={index} value={num}>{num}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.num_appartement}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Année</Form.Label>
            <Form.Select
              name="annee"
              value={formData.annee}
              onChange={handleChange}
              isInvalid={!!errors.annee}
            >
              <option value="">Choisir l'année</option>
              {annees.map((an, index) => (
                <option key={index} value={an}>{an}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.annee}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Période</Form.Label>
            <Form.Select
              name="periode"
              value={formData.periode}
              onChange={handleChange}
              isInvalid={!!errors.periode}
              disabled
            >
              <option value="">Choisir la période</option>
              <option value="1">1 Trimestre</option>
              <option value="2">2 Trimestre</option>
              <option value="3">3 Trimestre</option>
              <option value="4">4 Trimestre</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.periode}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Montant (DTN)</Form.Label>
            <Form.Control
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              isInvalid={!!errors.montant}
            />
            <Form.Control.Feedback type="invalid">{errors.montant}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type de Paiement</Form.Label>
            <Form.Select
              name="type_payement"
              value={formData.type_payement}
              onChange={handleChange}
              isInvalid={!!errors.type_payement}
            >
              <option value="">Choisir...</option>
              <option value="espèce">Espèce</option>
              <option value="virement">Virement</option>
              <option value="versement">Versement</option>
              <option value="chèque">Chèque</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.type_payement}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date de Paiement</Form.Label>
            <Form.Control
              type="date"
              name="date_payement"
              value={formData.date_payement}
              onChange={handleChange}
              isInvalid={!!errors.date_payement}
            />
            <Form.Control.Feedback type="invalid">{errors.date_payement}</Form.Control.Feedback>
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModifierCotisation;
