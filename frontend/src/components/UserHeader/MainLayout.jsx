import React, { useState } from "react";
import UserProfile from "../GestProfile/Userprofile.jsx";
import SettingsForm from "../GestProfile/SettingsForm.jsx";
import NavBar from "../Navbar/Navbar.jsx";
import LogoutModal from "../GestProfile/logoutModal.jsx";
import { useAuth } from "../../context/AuthContex.jsx"; // Assurez-vous que le chemin est correct

const MainLayout = ({ idPersonne }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { logout } = useAuth(); // ← Accès à la fonction logout()

  return (
    <div>
      <NavBar
        toggleProfile={() => setShowProfile(true)}
        toggleSettings={() => setShowSettings(true)}
        openLogoutModal={() => setShowLogoutModal(true)}
      />

      <UserProfile
        show={showProfile}
        handleClose={() => setShowProfile(false)}
        idPersonne={idPersonne}
      />

      <SettingsForm
        show={showSettings}
        handleClose={() => setShowSettings(false)}
        idPersonne={idPersonne}
      />

      <LogoutModal
        show={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </div>
  );
};

export default MainLayout;
