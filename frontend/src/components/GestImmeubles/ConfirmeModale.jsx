import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmeModale = ({ 
  show, 
  onHide, 
  onConfirm, 
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir effectuer cette action ?" 
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirmer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmeModale;