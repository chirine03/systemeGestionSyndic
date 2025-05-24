import React from "react";
import "./copyright.css";

const Copyright = ({ variant }) => {
  return (
    <footer
      className={`footer-copyright ${variant}`}
      aria-label="Pied de page copyright"
    >
      &copy; {new Date().getFullYear()} Système Syndic El Hamd. Tous droits réservés.
    </footer>
  );
};

export default Copyright;
