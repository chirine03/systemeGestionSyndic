import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchModifierCotAnnuelle } from "../../services/cotAnnuelle/cotAnnuelleService";

const ModifierCotAnnuelle = ({ show, handleClose, cotisation }) => {
  const [formData, setFormData] = useState({ ...cotisation });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    const montantAvec = formData.montant_avec_parking;
    const montantSans = formData.montant_sans_parking;

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

    try {
      const response = await fetchModifierCotAnnuelle(formData);
      console.log(response);

      if (response.success) {
        setMessage(response.message || "Cotisation annuelle modifiée avec succès !");
        setMessageType("success");

        setTimeout(() => {
          setMessage("");
          handleClose();
        }, 1500);
      } else {
        setMessage(response.message || "Erreur lors de la modification.");
        setMessageType("danger");
      }
    } catch (error) {
      setMessage("Une erreur est survenue lors de la modification.");
      setMessageType("danger");
    }
};


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier la Cotisation Annuelle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <div className={`alert alert-${messageType}`} role="alert">
            {message}
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Année</Form.Label>
            <Form.Control
              type="text"
              name="annee"
              value={formData.annee}
              disabled
            />
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
            <Form.Control.Feedback type="invalid">
              {errors.montant_avec_parking}
            </Form.Control.Feedback>
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
            <Form.Control.Feedback type="invalid">
              {errors.montant_sans_parking}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={messageType === "success"}>
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModifierCotAnnuelle;
