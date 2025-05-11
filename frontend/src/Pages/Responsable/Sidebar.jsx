import React, { useState } from "react";
import { FaMoneyBill, FaList, FaPlus, FaCalendarCheck, FaCoins, FaUsers, FaHandshake, FaWallet , FaHome, FaUserCog } from "react-icons/fa";
import { RiCommunityFill } from "react-icons/ri";
import { IoPeople } from "react-icons/io5";
import {MdManageAccounts} from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";

import { MdOutlineDashboard } from "react-icons/md";
import "./Sidebar.css";

const Sidebar = ({ setContent }) => {
  const [showCotisation, setShowCotisation] = useState(false);
  const [showCotisationAnnuelle, setShowCotisationAnnuelle] = useState(false);
  const [showPrestataire, setShowPrestataire] = useState(false);
  const [showDepense, setShowDepense] = useState(false);
  const [showImmeuble, setShowImmeuble] = useState(false);
  const [showProprietaire, setShowProprietaire] = useState(false);
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [showAppartement, setShowAppartement,] = useState(false);


  return (
    <div className="sidebar d-flex flex-column p-3">
      <h4 className="text-center mb-4">Tableau de Bord</h4>
      <ul className="nav flex-column">

        <li className="nav-link" onClick={() => setShowImmeuble(!showImmeuble)}>
          <RiCommunityFill  className="me-2" /> Gérer Immeubles
        </li>
        {showImmeuble && (
          <ul className="sub-menu">
            <li className="nav-link" onClick={() => setContent("AjouterImmeuble")}>
              <FaPlus className="me-2" /> Ajouter Immeuble
            </li>
            <li className="nav-link" onClick={() => setContent("ListeImmeubles")}>
              <FaList className="me-2" /> Liste des Immeubles
            </li>
          </ul>
        )}

        <li className="nav-link" onClick={() => setShowAppartement(!showAppartement)}>
          <FaHome className="me-2" /> Gérer Appartements
        </li>
        {showAppartement && (
          <ul className="sub-menu">
            <li className="nav-link" onClick={() => setContent("ListeAppartement")}>
              <FaList className="me-2" /> Liste des Appartements
              </li>
            <li className="nav-link" onClick={() => setContent("AjouterAppartement")}>
              <FaPlus className="me-2" /> Ajouter Appartement
              </li>
          </ul>
        )}
        

        <li className="nav-link" onClick={() => setShowProprietaire(!showProprietaire)}>
          <IoPeople className="me-2" /> Gérer Propriétaires
        </li>
        {showProprietaire && (
          <ul className="sub-menu">
            <li className="nav-link" onClick={() => setContent("AjouterProprietaire")}>
              <FaPlus className="me-2" /> Ajouter Propriétaire
            </li>
            <li className="nav-link" onClick={() => setContent("ListeProprietaire")}>
              <FaList className="me-2" /> Liste des Propriétaires
            </li>
          </ul>
        )}


        <li className="nav-link" onClick={() => setShowPersonnel(!showPersonnel)}>
          <FaUserCog  className="me-2" /> Gérer Personnel
        </li>
        {showPersonnel && (
          <ul className="sub-menu">
            <li className="nav-link" onClick={() => setContent("AjouterPersonnel")}>
              <FaPlus className="me-2" /> Ajouter Personnel
            </li>
            <li className="nav-link" onClick={() => setContent("ListePersonnel")}>
              <FaList className="me-2" /> Liste des Propriétaires
            </li>
          </ul>
        )}
        
        <li className="nav-link" onClick={() => setShowCotisation(!showCotisation)}>
          <FaMoneyBill className="me-2" /> Gérer Cotisation
        </li>
        {showCotisation && (
          <ul className="sub-menu">
            <li className="nav-link" onClick={() => setContent("SuiviCotisation")}>
              <FaCalendarCheck className="me-2" /> Suivi Cotisation
            </li>
            <li className="nav-link" onClick={() => setContent("AjouterCotisation")}>
              <FaPlus className="me-2" /> Ajouter Cotisation
            </li>
            <li className="nav-link" onClick={() => setContent("ListeCotisation")}>
              <FaList className="me-2" /> Liste des Cotisations
            </li>
            
          </ul>
        )}

        <li className="nav-link" onClick={() => setShowCotisationAnnuelle(!showCotisationAnnuelle)}>
          <FaCoins className="me-2" />Cotisation Annuelle
        </li>
        {showCotisationAnnuelle && (
          <ul className="sub-menu">
            <li className="nav-link" onClick={() => setContent("CotisationAnnuelle")}>
              <FaPlus className="me-2" />Ajouter Valeur Annuelle 
            </li>
            <li className="nav-link" onClick={() => setContent("ListeCotAnnuelle")}>
              <FaList className="me-2" /> Les Valeurs Annuelles
            </li>
          </ul>
        )}

        

        <li className="nav-link" onClick={() => setShowPrestataire(!showPrestataire)}>
          <FaHandshake className="me-2" /> Prestataires de service
        </li>
        {showPrestataire && (
          <ul className="sub-menu">
            <li className="nav-link" onClick={() => setContent("AjouterPrestataire")}>
              <FaPlus className="me-2" /> Ajouter Prestataire
            </li>
            <li className="nav-link" onClick={() => setContent("ListePrestataires")}>
              <FaList className="me-2" /> Liste des Prestataires
            </li>
          </ul>
        )}

        <li className="nav-link" onClick={() => setShowDepense(!showDepense)}>
          <FaWallet className="me-2" /> Dépenses Collectives
        </li>
        {showDepense && (
          <ul className="sub-menu">
            <li className="nav-link" onClick={() => setContent("SuiviDepense")}>
              <FaCalendarCheck className="me-2" /> Suivi Dépenses
            </li>
            <li className="nav-link" onClick={() => setContent("AjouterDepense")}>
              <FaPlus className="me-2" /> Ajouter Dépenses
            </li>
            <li className="nav-link" onClick={() => setContent("ListeDepense")}>
              <FaList className="me-2" /> Mes Dépenses
            </li>
          </ul>
        )}

        <li className="nav-link" onClick={() => setContent("ListeComptes")}>
          <BsPersonWorkspace className="me-2" />Suivi Comptes Inscrit
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
