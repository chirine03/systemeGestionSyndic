import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { fetchUserData } from "../../services/user/userService";  // ✅ Import du service
import './Userprofile.css';

const UserProfile = ({ show, handleClose, idPersonne }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (show && idPersonne) {
        setLoading(true);
        try {
          const result = await fetchUserData(idPersonne);
          if (result.success) {
            setUserData(result.userData);
          } else {
            console.error("Utilisateur non trouvé :", result.message);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données :", error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [show, idPersonne]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Informations Personnelles</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {loading ? (
          <p className="loading-text">Chargement...</p>
        ) : userData ? (
          <>
            <p><strong>Nom :</strong> {userData.nom || "N/A"}</p>
            <p><strong>Prénom :</strong> {userData.prenom || "N/A"}</p>
            <p><strong>CIN :</strong> {userData.cin || "N/A"}</p>
            <p><strong>Date de Naissance :</strong> 
              {userData.date_nais ? new Date(userData.date_nais).toLocaleDateString() : "N/A"}
            </p>
            <p><strong>Adresse :</strong> {userData.adresse || "N/A"}</p>
            <p><strong>Téléphone :</strong> {userData.telephone || "N/A"}</p>
            <p><strong>Email :</strong> {userData.mail || "N/A"}</p>

            {/* Mot de passe */}
            <div className="password-container">
              <strong>Mot de Passe :</strong>{" "}
              <span className="password-text">
                {passwordVisible ? userData.mot_de_passe : "********"}
              </span>
              <Button
                variant="link"
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </>
        ) : (
          <p className="error-text">Utilisateur introuvable.</p>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button variant="secondary" onClick={handleClose}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserProfile;
