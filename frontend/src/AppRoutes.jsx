import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import ResponsableHome from "./Pages/Responsable/ResponsableHome";
import PropietaireHome from "./Pages/Proprietaire/ProprietaireHome";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/responsable" element={<ResponsableHome />} /> 
      <Route path="/proprietaire" element={<PropietaireHome />} />
    </Routes>
  );
};

export default AppRoutes;
