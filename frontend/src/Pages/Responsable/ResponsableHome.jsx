import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Bienvenu from "./Bienvenu";
import MainLayout from "../../components/UserHeader/MainLayout";
import Sidebar from "./Sidebar"; 
import ListeCotisation from "../../components/GestCotisation/ListeCotisation"; 
import AjouterCotisation from "../../components/GestCotisation/AjouterCotisation";
import SuiviCotisation from "../../components/GestCotisation/SuiviCotisation"; 
import CotisationAnnuelle from "../../components/GestCotisationAnnuelle/CotisationAnnuelle";
import ListeCotAnnuelle from "../../components/GestCotisationAnnuelle/ListeCotAnnuelle";
import ListeComptes from "../../components/GestComptesInscrit/ListeComptes";
import AjouterPrestataire from "../../components/GestPrestataires/AjouterPrestataire";
import ListePrestataires from "../../components/GestPrestataires/ListePrestataires"; 
import AjouterDepense from "../../components/GestDepenses/AjouterDepense";
import ListeDepense from "../../components/GestDepenses/ListeDepense";
import AjouterImmeuble from "../../components/GestImmeubles/AjouterImmeuble"; 
import ListeImmeubles from "../../components/GestImmeubles/ListeImmeubles"; 
import AjouterProprietaire from "../../components/GestProprietaires/AjouterProprietaire";
import ListeProprietaire from "../../components/GestProprietaires/ListeProprietaire";7
import ListeAppartement from "../../components/GestAppartement/ListeAppartement";
import AjouterAppartement from "../../components/GestAppartement/AjouterAppartement";
import SuiviDepense from "../../components/GestDepenses/SuiviDepense";
import AjouterPersonnel from "../../components/GestPersonnel/AjouterPersonnel";
import ListePersonnel from "../../components/GestPersonnel/ListePersonnel";

import Dashboard from "../../components/Dashboard/Dashboard";

const ResponsableHome = () => {
  const location = useLocation();
  const idPersonne = location.state?.idPersonne || localStorage.getItem("id_personne");
  const [content, setContent] = useState(""); // State for content display

  return (
    <div className="d-flex">
      <MainLayout idPersonne={idPersonne} />
      
      <Sidebar setContent={setContent} />
      
      {/* Dynamic Content Display */}
      <div className="content p-4">
        {/* Default content if none selected */}
        {!content && <Bienvenu />}

        {content === "SuiviCotisation" && <SuiviCotisation />}
        {content === "ListeCotisation" && <ListeCotisation />}
        {content === "AjouterCotisation" && <AjouterCotisation />}
        {content === "CotisationAnnuelle" && <CotisationAnnuelle />}
        {content === "ListeCotAnnuelle" && <ListeCotAnnuelle />}
        {content === "ListeComptes" && <ListeComptes />}
        {content === "AjouterPrestataire" && <AjouterPrestataire />}
        {content === "ListePrestataires" && <ListePrestataires />}
        {content === "AjouterDepense" && <AjouterDepense />}
        {content === "ListeDepense" && <ListeDepense />}
        {content === "SuiviDepense" && <SuiviDepense />}
        {content === "AjouterImmeuble" && <AjouterImmeuble />}
        {content === "ListeImmeubles" && <ListeImmeubles />}
        {content === "AjouterProprietaire" && <AjouterProprietaire />}
        {content === "ListeProprietaire" && <ListeProprietaire />}
        {content === "ListeAppartement" && <ListeAppartement />}
        {content === "AjouterAppartement" && <AjouterAppartement />}
        {content === "AjouterPersonnel" && <AjouterPersonnel />}
        {content === "ListePersonnel" && <ListePersonnel />}
        
        {content === "Dashboard" && <Dashboard />}

      </div>
    </div>
  );
};

export default ResponsableHome;
