// src/components/modals/ConfirmAjoutApp.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmAjoutApp = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Confirmez-vous l’ajout de cet appartement ?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Annuler</Button>
        <Button variant="primary" onClick={onConfirm}>Confirmer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmAjoutApp;
