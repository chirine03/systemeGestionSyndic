import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { modifierAppartement, fetchInfos  } from '../../services/appartement/appartementService.js';

const ModifierAppartement = ({ show, onHide, appartementData, onSubmit }) => {
  const [form, setForm] = useState({
    num_appartement: '',
    nbr_chambre: '',
    superficie: '',
    etage: '',
    espace_parking: '',
    description: '',
    id_immeuble: '',
    id_personne: ''
  });

  const [erreurs, setErreurs] = useState({});
  const [immeubles, setImmeubles] = useState([]);
  const [proprietaires, setProprietaires] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (appartementData) setForm({ ...appartementData });
  }, [appartementData]);

  useEffect(() => {
    const chargerInfos = async () => {
      const response = await fetchInfos();
      if (response.success) {
        setImmeubles(response.data.immeubles);
        setProprietaires(response.data.proprietaires);
      }
    };
    chargerInfos();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validerAppartement = (data) => {
    const erreurs = {};
    if (!data.num_appartement.trim()) erreurs.num_appartement = "Numéro requis.";
    if (!data.nbr_chambre || isNaN(data.nbr_chambre) || data.nbr_chambre < 1)
      erreurs.nbr_chambre = "Nombre de chambres invalide.";
    if (!data.superficie || isNaN(data.superficie) || data.superficie < 1)
      erreurs.superficie = "Superficie invalide.";
    if (!data.etage || isNaN(data.etage) || data.etage < 0)
      erreurs.etage = "Étage invalide.";
    if (!data.espace_parking) erreurs.espace_parking = "Choix requis.";
    if (!data.id_immeuble) erreurs.id_immeuble = "Immeuble requis.";
    if (!data.id_personne) erreurs.id_personne = "Propriétaire requis.";
    return erreurs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erreursValidation = validerAppartement(form);
    setErreurs(erreursValidation);
    if (Object.keys(erreursValidation).length === 0) {
        const appartementData = {
            num_appartement: form.num_appartement,
            nbr_chambre: form.nbr_chambre,
            superficie: form.superficie,
            espace_parking: form.espace_parking,
            description: form.description,
            id_personne: form.id_personne
            };
      try {
        const response = await modifierAppartement(appartementData); // Appel de votre fonction de service
        if (response.success) {
          setMessage({ type: 'success', text: response.message });
          onHide(); // Fermer la modal
        } else {
          setMessage({ type: 'danger', text: response.message });
        }
      } catch (error) {
        // Gestion des erreurs réseau
        setMessage({ type: 'danger', text: "Erreur réseau. Veuillez réessayer plus tard." });
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifier l'Appartement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
            {message.text}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Num appartement *</Form.Label>
              <Form.Control
                type="text"
                name="num_appartement"
                value={form.num_appartement}
                onChange={handleChange}
                isInvalid={!!erreurs.num_appartement}
                disabled
              />
              <Form.Control.Feedback type="invalid">
                {erreurs.num_appartement}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Nombre de chambres *</Form.Label>
              <Form.Control
                type="number"
                name="nbr_chambre"
                value={form.nbr_chambre}
                onChange={handleChange}
                isInvalid={!!erreurs.nbr_chambre}
              />
              <Form.Control.Feedback type="invalid">
                {erreurs.nbr_chambre}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Superficie *</Form.Label>
              <Form.Control
                type="number"
                name="superficie"
                value={form.superficie}
                onChange={handleChange}
                isInvalid={!!erreurs.superficie}
              />
              <Form.Control.Feedback type="invalid">
                {erreurs.superficie}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Étage *</Form.Label>
              <Form.Control
                type="number"
                name="etage"
                value={form.etage}
                onChange={handleChange}
                isInvalid={!!erreurs.etage}
                disabled
              />
              <Form.Control.Feedback type="invalid">
                {erreurs.etage}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Espace parking *</Form.Label>
              <Form.Select
                name="espace_parking"
                value={form.espace_parking}
                onChange={handleChange}
                isInvalid={!!erreurs.espace_parking}
              >
                <option value="">-- Sélectionner --</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {erreurs.espace_parking}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                isInvalid={!!erreurs.description}
              />
              <Form.Control.Feedback type="invalid">
                {erreurs.description}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Immeuble *</Form.Label>
              <Form.Select
                name="id_immeuble"
                value={form.id_immeuble}
                onChange={handleChange}
                isInvalid={!!erreurs.id_immeuble}
                disabled
              >
                <option value="">-- Sélectionner --</option>
                {immeubles.map((i) => (
                  <option key={i.id_immeuble} value={i.id_immeuble}>
                    {i.raison_sociale} - Bloc {i.bloc}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {erreurs.id_immeuble}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Propriétaire *</Form.Label>
              <Form.Select
                name="id_personne"
                value={form.id_personne}
                onChange={handleChange}
                isInvalid={!!erreurs.id_personne}
              >
                <option value="">-- Sélectionner --</option>
                {proprietaires.map((p) => (
                  <option key={p.id_personne} value={p.id_personne}>
                    {p.nom} {p.prenom} - CIN {p.cin}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {erreurs.id_personne}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <div className="text-center">
            <Button type="submit" variant="primary">
              Modifier
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModifierAppartement;
