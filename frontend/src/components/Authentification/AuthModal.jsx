import React from "react";
import "./AuthModal.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModal = ({ show, onClose, isRegister, switchToRegister, switchToLogin }) => {
  if (!show) return null; // Prevent rendering if `show` is false

  return (
    <div className="auth-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        {isRegister ? (
          <RegisterForm onClose={onClose} switchToLogin={switchToLogin} />
        ) : (
          <LoginForm onClose={onClose} switchToRegister={switchToRegister} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
