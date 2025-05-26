import React from "react";
import { Modal, Button } from "react-bootstrap";
import {FaSignOutAlt } from "react-icons/fa";


const LogoutModal = ({ show, onConfirm, onCancel }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Déconnexion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir vous déconnecter ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Se déconnecter <FaSignOutAlt size={24} className="navbar-icon navbar-icon-default"/>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModal;
