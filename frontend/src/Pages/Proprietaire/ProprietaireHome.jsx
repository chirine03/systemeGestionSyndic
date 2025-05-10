import React from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../../components/UserHeader/MainLayout";
import AppartementsList from "../../components/ListeAppartement/AppartementsList";
import "./proprietaireHome.css";

const PropietaireHome = () => {
  const location = useLocation();
  const idPersonne = location.state?.idPersonne || localStorage.getItem("id_personne");

  return (
    <div className="d-flex">
      <MainLayout idPersonne={idPersonne} />
      <div className="full-page-center" style={{ marginTop: "80px" }}>
        <div className="welcome-box">
          <h1>Bienvenue cher Propriétaire 👋</h1>
          <h2>dans votre espace <span>Syndic El Hamd</span></h2>
          <p>Gérez vos biens et consultez vos paiements en toute simplicité.</p>

          {/* Suppression du bouton */}
          
          <div className="mt-4">
            <AppartementsList id_personne={idPersonne} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropietaireHome;
