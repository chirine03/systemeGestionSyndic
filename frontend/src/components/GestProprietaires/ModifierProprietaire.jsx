import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { modifierProprietaire as modifierProprietaireService } from "../../services/proprietaire/proprietaireService";

const ModifierProprietaire = ({ show, onHide, proprietaire, onUpdate }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    date_nais: "",
    cin: ""
  });

  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (proprietaire) {
      setFormData({
        nom: proprietaire.nom || "",
        prenom: proprietaire.prenom || "",
        telephone: proprietaire.telephone || "",
        adresse: proprietaire.adresse || "",
        date_nais: proprietaire.date_nais ? proprietaire.date_nais.split("T")[0] : "",
        cin: proprietaire.cin || ""
      });
    }
  }, [proprietaire]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    const response = await modifierProprietaireService(proprietaire.id_personne, formData);

    setVariant(response.success ? "success" : "danger");
    setMessage(response.message);

    if (response.success) {
      onUpdate(formData);
        onHide();
    }

    setIsSubmitting(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Propriétaire</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={variant}>{message}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              isInvalid={!!errors.nom}
            />
            <Form.Control.Feedback type="invalid">{errors.nom}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              isInvalid={!!errors.prenom}
            />
            <Form.Control.Feedback type="invalid">{errors.prenom}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              isInvalid={!!errors.telephone}
            />
            <Form.Control.Feedback type="invalid">{errors.telephone}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              isInvalid={!!errors.adresse}
            />
            <Form.Control.Feedback type="invalid">{errors.adresse}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date de Naissance</Form.Label>
            <Form.Control
              type="date"
              name="date_nais"
              value={formData.date_nais}
              onChange={handleChange}
              isInvalid={!!errors.date_nais}
            />
            <Form.Control.Feedback type="invalid">{errors.date_nais}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CIN</Form.Label>
            <Form.Control
              type="text"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              isInvalid={!!errors.cin}
            />
            <Form.Control.Feedback type="invalid">{errors.cin}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifierProprietaire;
