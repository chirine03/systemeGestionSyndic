import React from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../../components/UserHeader/MainLayout";
import AppartementsList from "../../components/ListeAppartement/AppartementsList";
import "./proprietaireHome.css";
import Copyright from "../../components/copyright/Copyright";

const PropietaireHome = () => {
  const location = useLocation();
  const idPersonne = location.state?.idPersonne || localStorage.getItem("id_personne");

  return (
    <div className="d-flex">
      <MainLayout idPersonne={idPersonne} />
      <div className="full-page-center" style={{ marginTop: "80px", paddingBottom: '50px' }}>
        <div className="welcome-box">
          <h1>Bienvenue cher Propriétaire 👋</h1>
          <h2>dans votre espace <span>Syndic El Hamd</span></h2>
          <p>Consultez vos paiements en toute simplicité.</p>
          
          
          <div className="mt-4">
            <AppartementsList id_personne={idPersonne} />
          </div>
        </div>
      </div>
      <Copyright variant="style-a" />
    </div>
  );
};

export default PropietaireHome;
