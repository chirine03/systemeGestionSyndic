import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { supprimerProprietaire } from "../../services/proprietaire/proprietaireService";

const SuppProprietaire = ({ show, onHide, proprietaireId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (show) {
      setMessage(null);    // Réinitialiser à l'ouverture
      setIsError(false);
    }
  }, [show]);

  const handleConfirm = async () => {
    setLoading(true);
    const result = await supprimerProprietaire(proprietaireId);
    setLoading(false);
    setMessage(result.message);
    setIsError(!result.success);

    if (result.success) {
      onDeleteSuccess();
      onHide();          
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message ? (
          <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
        ) : (
          "Êtes-vous sûr de vouloir supprimer ce propriétaire ?"
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={loading}>
          {loading ? "Suppression..." : "Supprimer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuppProprietaire;
