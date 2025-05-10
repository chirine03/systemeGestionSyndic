import React from "react";
import { Navbar } from "react-bootstrap";
import { FaBuilding, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const NavBar = ({ toggleProfile, toggleSettings, openLogoutModal }) => {
  return (
    <Navbar expand="lg" className="navbar-custom px-3 shadow-sm">
      <Navbar.Brand className="navbar-brand-custom ms-3 fst-italic">
        <FaBuilding size={30} className="me-2" /> Syndic el Hamd
      </Navbar.Brand>
      <div className="ms-auto">
        <FaUser
          size={24}
          className="navbar-icon navbar-icon-default mx-3"
          onClick={toggleProfile}
          title="Profil"
        />
        <FaCog
          size={24}
          className="navbar-icon navbar-icon-default mx-3"
          onClick={toggleSettings}
          title="Paramètres"
        />
        <FaSignOutAlt
          size={24}
          className="navbar-icon navbar-icon-default"
          onClick={openLogoutModal}
          title="Se déconnecter"
        />
      </div>
    </Navbar>
  );
};

export default NavBar;
