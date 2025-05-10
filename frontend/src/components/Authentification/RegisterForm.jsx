import React, { useState } from "react";
import { registerUser } from "../../services/user/registerService";

const RegisterForm = ({ onClose, switchToLogin }) => {
  const [cin, setCin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!cin || !email || !password) {
      setError("Tous les champs sont requis.");
      return;
    }

    const cinPattern = /^\d{8}$/;
    if (!cinPattern.test(cin)) {
      setError("Le CIN doit contenir exactement 8 chiffres.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return;
    }
    console.log("Sending register request:", { cin, email, password });

    const result = await registerUser(cin, email, password);

    if (result.success) {
      setSuccess("Inscription réussie ! Tu peux te connecter.");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Créez votre compte</h2>
      <input type="text" placeholder="CIN" className="form-control mb-2" value={cin} onChange={(e) => setCin(e.target.value)} />
      <input type="email" placeholder="Email" className="form-control mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de Passe" className="form-control mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
      <button className="btn btn-primary w-100" onClick={handleSubmit}>S'inscrire</button>
      <p className="mt-3">
        Vous avez déjà un compte ?{" "}
        <span className="text-link" onClick={switchToLogin}>Se Connecter</span>
      </p>
    </div>
  );
};

export default RegisterForm;
