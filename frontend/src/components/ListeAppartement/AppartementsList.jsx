import React, { useEffect, useState } from 'react';
import { fetchListePaiements } from '../../services/listePaiement/propPaiementService';
import CotAppartement from './CotAppartement';
import './AppartementsList.css'; 
import { FiHome, FiMaximize2, FiLayers } from "react-icons/fi";
import { LuParkingMeter } from "react-icons/lu";

const AppartementsList = ({ id_personne }) => {
  const [appartements, setAppartements] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppartement, setSelectedAppartement] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // <-- nouvel état pour l'erreur

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchListePaiements(id_personne);
      console.log("Résultat de fetchListePaiements :", res);
      if (res.success) {
        const grouped = res.paiements.reduce((acc, curr) => {
          const num = curr.num_appartement;
          if (!acc[num]) acc[num] = { ...curr, cotisations: [] };
          if (curr.id_cotisation) {
            acc[num].cotisations.push({
              montant: curr.montant,
              periode: curr.periode,
              type_payement: curr.type_payement,
              date_payement: curr.date_payement,
              annee: curr.annee,
            });
          }
          return acc;
        }, {});
        setAppartements(Object.values(grouped));
        setErrorMessage("");  // reset erreur si succès
      } else {
        setErrorMessage(res.message); // afficher l'erreur dans l'interface
      }
    };

    fetchData();
  }, [id_personne]);

  const openModal = (appartement) => {
    setSelectedAppartement(appartement);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="appart-container">
      <h2 className="appart-title">Mes Appartements</h2>

      {/* Affichage du message d'erreur */}
      {errorMessage && (
        <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>
          {errorMessage}
        </div>
      )}

      <div className="appart-grid">
        {appartements.map((app, index) => (
          <div key={index} className="appart-card" onClick={() => openModal(app)}>
            <h3 className="appart-num">Appartement N° {app.num_appartement}</h3>
            <hr />
            <div className="appart-info">
              <p><FiHome /> Nombres des chambres : <strong>{app.nbr_chambre}</strong></p>
              <p><FiMaximize2 /> Superficie : <strong>{app.superficie} m²</strong></p>
              <p><FiLayers /> Étage : <strong>{app.etage}</strong></p>
              <p><LuParkingMeter /> Parking : <strong>{app.espace_parking ? 'Oui' : 'Non'}</strong></p>
            </div>
          </div>
        ))}
      </div>

      <CotAppartement
        isOpen={modalIsOpen}
        onClose={closeModal}
        appartement={selectedAppartement}
      />
    </div>
  );
};

export default AppartementsList;
