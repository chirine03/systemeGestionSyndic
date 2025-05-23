import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { updatePrestataire } from '../../services/prestataires/prestatairesService';
import './ModifierPrestataire.css';

const ModifierPrestataire = ({ show, onClose, prestataire, onSave }) => {
  const [formData, setFormData] = useState({
    id_prestataire: '',
    raison_sociale: '',
    num_matricule: '',
    adresse: '',
    telephone: '',
    fax: '',
    email: '',
    site_web: ''
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    if (prestataire) {
      setFormData({ ...prestataire });
      setErrors({});
      setAlert({ type: '', message: '' });
    }
  }, [prestataire]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^(https?:\/\/)?[\w.-]+\.\w{2,}$/;
    const matRegex = /^[a-zA-Z0-9]{8,20}$/;

    if (!formData.raison_sociale.trim()) newErrors.raison_sociale = 'Champ requis';
    if (formData.num_matricule && !matRegex.test(formData.num_matricule)) newErrors.num_matricule = 'matricule invalide';
    if (formData.telephone && !phoneRegex.test(formData.telephone)) newErrors.telephone = '8 chiffres requis';
    if (formData.fax && !phoneRegex.test(formData.fax)) newErrors.fax = '8 chiffres requis';
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Email invalide';
    if (formData.site_web && !urlRegex.test(formData.site_web)) newErrors.site_web = 'URL invalide';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await updatePrestataire(formData);
      if (result.success) {
        setAlert({ type: 'success', message: 'Prestataire modifié avec succès !' });
        onSave(result);
        setTimeout(() => onClose(), 500);
      } else {
        setAlert({ type: 'danger', message: result.message || 'Échec de la modification.' });
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'Une erreur est survenue.' });
    }
  };

  

  return (
    <>
      <Modal show={show} onHide={onClose} backdrop="static" centered dialogClassName="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>Modifier le prestataire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert.message && (
            <Alert variant={alert.type} onClose={() => setAlert({ type: '', message: '' })} dismissible>
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Raison sociale</Form.Label>
                  <Form.Control
                    type="text"
                    name="raison_sociale"
                    value={formData.raison_sociale}
                    onChange={handleChange}
                    isInvalid={!!errors.raison_sociale}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.raison_sociale}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Matricule</Form.Label>
                  <Form.Control
                    type="text"
                    name="num_matricule"
                    value={formData.num_matricule}
                    onChange={handleChange}
                    isInvalid={!!errors.num_matricule}
                  />
                  <Form.Control.Feedback type="invalid">{errors.num_matricule}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fax</Form.Label>
                  <Form.Control
                    type="text"
                    name="fax"
                    value={formData.fax}
                    onChange={handleChange}
                    isInvalid={!!errors.fax}
                  />
                  <Form.Control.Feedback type="invalid">{errors.fax}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Web</Form.Label>
                  <Form.Control
                    type="text"
                    name="site_web"
                    value={formData.site_web}
                    onChange={handleChange}
                    isInvalid={!!errors.site_web}
                  />
                  <Form.Control.Feedback type="invalid">{errors.site_web}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={onClose} className="me-2">
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Enregistrer
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModifierPrestataire;
