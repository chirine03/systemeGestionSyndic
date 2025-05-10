import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModifierCotAnnuelle = ({ show, handleClose, cotisation }) => {
  const [formData, setFormData] = useState({ ...cotisation });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    const annee = parseInt(formData.annee);
    const montantAvec = parseFloat(formData.montant_avec_parking);
    const montantSans = parseFloat(formData.montant_sans_parking);
  
    if (!formData.annee.trim()) {
      newErrors.annee = "L'année est requise.";
    } else if (isNaN(annee) || annee < 2000 || annee > 2100) {
      newErrors.annee = "L'année est invalide !";
    }
  
    if (!formData.montant_avec_parking.trim()) {
      newErrors.montant_avec_parking = "Le montant avec parking est requis.";
    } else if (isNaN(montantAvec) || montantAvec < 10 || montantAvec > 999) {
      newErrors.montant_avec_parking = "Le montant est invalide !";
    }
  
    if (!formData.montant_sans_parking.trim()) {
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

    try {
      const response = await fetch("http://localhost/my_api/modifierCotAnnuelle.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Cotisation annuelle modifiée avec succès !");
        handleClose();
        window.location.reload(); // Rafraîchir la liste
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
        <Modal.Title>Modifier la Cotisation Annuelle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Année</Form.Label>
            <Form.Control
              type="text"
              name="annee"
              value={formData.annee}
              onChange={handleChange}
              isInvalid={!!errors.annee}
              disabled
            />
            <Form.Control.Feedback type="invalid">{errors.annee}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Montant avec Parking (DTN)</Form.Label>
            <Form.Control
              type="text"
              name="montant_avec_parking"
              value={formData.montant_avec_parking}
              onChange={handleChange}
              isInvalid={!!errors.montant_avec_parking}
            />
            <Form.Control.Feedback type="invalid">{errors.montant_avec_parking}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Montant sans Parking (DTN)</Form.Label>
            <Form.Control
              type="text"
              name="montant_sans_parking"
              value={formData.montant_sans_parking}
              onChange={handleChange}
              isInvalid={!!errors.montant_sans_parking}
            />
            <Form.Control.Feedback type="invalid">{errors.montant_sans_parking}</Form.Control.Feedback>
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

export default ModifierCotAnnuelle;
