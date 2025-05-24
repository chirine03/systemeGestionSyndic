import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";
import { motion } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
import AuthModal from "../../components/Authentification/AuthModal";
import Copyright from "../../components/copyright/Copyright";
const HomePage = () => {

console.log("home chargé !");

  const [modalOpen, setModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const openModal = (register = false) => {
    setIsRegister(register);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const switchToRegister = () => {
    setIsRegister(true); // Switch to the register form
  };

  const switchToLogin = () => {
    setIsRegister(false); // Switch to the login form
  };

  return (
    <div className="home-container">
      <div className="overlay" style={{ paddingBottom: '50px' }}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container d-flex justify-content-between align-items-center">
            <a className="navbar-brand d-flex align-items-center" href="#">
              <FaBuilding size={30} className="me-2" /> <i>Syndic El Hamd</i>
            </a>
            <button className="btn btn-outline-light mt-3 connect-button" onClick={() => openModal(false)}>
              <strong>Se Connecter</strong>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="content">
          {/* Left Section */}
          <div className="left-content">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="title"
            >
              <i><strong>Gérez votre <br />Copropriété en toute simplicité !</strong></i>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="description"
            >
              Syndic El-Hamd est une plateforme de gestion moderne qui facilite <br />
              l'administration de votre immeuble.
            </motion.p>
          </div>

          {/* Center Section */}
          <div className="center-content">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="subtext"
            >
              Vous êtes un nouveau Membre ? Inscrivez-vous maintenant 😊
            </motion.p>
            <motion.button
              className="btn btn-outline-light mt-3 join-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => openModal(true)}
            >
              <strong>Rejoignez-nous</strong>
            </motion.button>
          </div>
        </div>
      </div>

      <Copyright variant="style-b" />

      {/* Authentication Modal */}
      <AuthModal 
        show={modalOpen} 
        onClose={closeModal} 
        isRegister={isRegister} 
        switchToRegister={switchToRegister} 
        switchToLogin={switchToLogin} 
      />
    </div>
  );
};

export default HomePage;
