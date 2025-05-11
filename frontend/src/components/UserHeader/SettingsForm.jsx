import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { fetchUserData, updateUser } from "../../services/user/userService";
import "./SettingsForm.css";

const SettingsForm = ({ show, handleClose, idPersonne }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    date_nais: "",
    adresse: "",
    telephone: "",
    mail: "",
    mot_de_passe: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (idPersonne) {
      getData(idPersonne);
    }
  }, [idPersonne]);

  const getData = async (idPersonne) => {
    setLoading(true);
    try {
      const result = await fetchUserData(idPersonne);
      if (result.success) {
        setUserData(result.userData);
        setFormData({
          nom: result.userData.nom,
          prenom: result.userData.prenom,
          cin: result.userData.cin,
          date_nais: result.userData.date_nais.split("T")[0],
          adresse: result.userData.adresse,
          telephone: result.userData.telephone,
          mail: result.userData.mail,
          mot_de_passe: "",
        });
      } else {
        showMessage("Impossible de charger les données.", "error");
      }
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      showMessage("Erreur lors du chargement des données.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const formatNomPrenom = /^[A-Za-zÀ-ÿ\s\-]+$/;
    const formatMail = /^\S+@\S+\.\S+$/;
    const formatTel = /^\d{8}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!formatNomPrenom.test(formData.nom) || !formatNomPrenom.test(formData.prenom)) {
      showMessage("Le nom et le prénom doivent contenir uniquement des lettres.", "error");
      return false;
    }

    if (!formatMail.test(formData.mail)) {
      showMessage("L'adresse e-mail est invalide.", "error");
      return false;
    }

    if (!formatTel.test(formData.telephone)) {
      showMessage("Le numéro de téléphone doit contenir exactement 8 chiffres.", "error");
      return false;
    }

    const dateNais = new Date(formData.date_nais);
    const today = new Date();
    const age = today.getFullYear() - dateNais.getFullYear();
    const mois = today.getMonth() - dateNais.getMonth();
    if (age < 18 || (age === 18 && mois < 0)) {
      showMessage("Vous devez avoir au moins 18 ans.", "error");
      return false;
    }

    if (formData.mot_de_passe && !passwordPattern.test(formData.mot_de_passe)) {
      showMessage(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedData = {};
    for (const key in formData) {
      if (key === "mot_de_passe" && formData[key] === "") continue;
      if (formData[key] !== userData[key]) {
        updatedData[key] = formData[key];
      }
    }

    if (Object.keys(updatedData).length === 0) {
      showMessage("Aucune modification détectée.", "error");
      return;
    }

    const confirmation = window.confirm("Voulez-vous vraiment enregistrer les modifications ?");
    if (!confirmation) return;

    updatedData.id_personne = idPersonne;

    try {
      const result = await updateUser(updatedData);
      if (result.success) {
        showMessage("Informations mises à jour avec succès !", "success");
        setTimeout(() => handleClose(), 2000);
      } else {
        showMessage(result.message || "Erreur lors de la mise à jour.", "error");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      showMessage("Erreur réseau. Veuillez réessayer.", "error");
    }
  };

  if (loading || !userData) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">Modifier vos informations</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <div className="spinner-center">
            <Spinner animation="border" variant="primary" />
            <p className="spinner-text">Chargement...</p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Modifier vos informations</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        {message && (
          <div className={`message-box ${messageType}`}>
            {message}
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          {[
            { label: "Nom", name: "nom", type: "text" },
            { label: "Prénom", name: "prenom", type: "text" },
            { label: "CIN", name: "cin", type: "text"},
            { label: "Date de Naissance", name: "date_nais", type: "date", min: "1900-01-01" },
            { label: "Adresse", name: "adresse", type: "text" },
            { label: "Téléphone", name: "telephone", type: "text" },
            { label: "Email", name: "mail", type: "email" },
          ].map(({ label, name, type, disabled, min }) => (
            <Form.Group className="mb-3" key={name}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={userData[name] || `Modifier votre ${label.toLowerCase()}`}
                className="form-control-custom"
                disabled={disabled}
                min={min}
                required
              />
            </Form.Group>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Mot de Passe</Form.Label>
            <InputGroup className="input-group-custom">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                placeholder="Modifier votre mot de passe"
                className="form-control-custom"
              />
              <Button variant="outline-secondary" className="input-group-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">Laissez vide si vous ne souhaitez pas le modifier.</Form.Text>
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} className="btn-a">Annuler</Button>
            <Button variant="primary" type="submit" className="btn-m">Modifier</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsForm;
