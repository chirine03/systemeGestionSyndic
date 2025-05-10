import React from "react";
import { Modal, Button } from "react-bootstrap";

const LogoutModal = ({ show, onConfirm, onCancel }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir vous déconnecter ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Se déconnecter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModal;
