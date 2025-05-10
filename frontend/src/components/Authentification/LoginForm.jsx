import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/user/loginService";
import { useAuth } from "../../context/AuthContex"; // Import du contexte d'authentification

const LoginForm = ({ onClose, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();  // Utilisation du contexte pour le login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError("Tous les champs sont requis.");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Email invalide.");
      setLoading(false);
      return;
    }

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        const { id_personne, role } = result.user;

        // Utilisation du contexte pour stocker les informations de l'utilisateur
        login(id_personne, role); // Utilisation de la fonction de login du contexte

        setSuccessMessage("Connexion réussie !");
        setTimeout(() => {
          const routesMap = {
            proprietaire: "/proprietaire",
            locataire: "/locataire",
            responsable: "/responsable",
            admin: "/admin",
            employe: "/employe",
          };

          const route = routesMap[role];
          if (route) {
            navigate(route, { state: { idPersonne: id_personne } });
          } else {
            setError("Rôle non reconnu.");
          }
        }, 500);
      } else {
        setError(result.message || "Échec de la connexion.");
      }
    } catch (error) {
      setError("Erreur réseau. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Connectez-vous</h2>
      <input
        type="email"
        placeholder="Email"
        className="form-control mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Mot de Passe"
        className="form-control mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}
      <button
        className="btn btn-primary w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Connexion..." : "Se Connecter"}
      </button>
      <p className="mt-3">
        Pas encore inscrit ?{" "}
        <span className="text-link" onClick={switchToRegister}>
          Créer un compte
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
