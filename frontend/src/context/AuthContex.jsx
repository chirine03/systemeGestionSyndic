import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [idPersonne, setIdPersonne] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // 👈 ajout
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("id_personne");
    const storedRole = localStorage.getItem("role");
    if (storedId && storedRole) {
      setIdPersonne(storedId);
      setRole(storedRole);
    }
  }, []);

  const login = (id, role) => {
    localStorage.setItem("id_personne", id);
    localStorage.setItem("role", role);
    setIdPersonne(id);
    setRole(role);
  };

  const logout = () => {
    setIsLoggingOut(true); // 👈 active l'état

    localStorage.removeItem("id_personne");
    localStorage.removeItem("role");
    setIdPersonne(null);
    setRole(null);

    setTimeout(() => {
      setIsLoggingOut(false); // 👈 désactive
      navigate("/");
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ idPersonne, role, login, logout, isLoggingOut }}>
      {isLoggingOut ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Déconnexion en cours...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
