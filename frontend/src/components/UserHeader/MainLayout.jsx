import React, { useState } from "react";
import UserProfile from "./Userprofile";
import SettingsForm from "./SettingsForm";
import NavBar from "./Navbar";
import LogoutModal from "./logoutModal";
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
        onConfirm={logout} // ← Appelle logout depuis le contexte
      />
    </div>
  );
};

export default MainLayout;
