// components/SuppConfirmeCotAnnuelle.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const SuppConfirmeCotAnnuelle = ({ show, handleClose, handleConfirm, annee }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Voulez-vous vraiment supprimer la cotisation de l'année {annee} ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Annuler</Button>
        <Button variant="danger" onClick={() => handleConfirm(annee)}>Supprimer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuppConfirmeCotAnnuelle;
