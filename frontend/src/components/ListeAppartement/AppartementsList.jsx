import React, { useEffect, useState } from 'react';
import { fetchListePaiements } from '../../services/listePaiement/propPaiementService';
import CotAppartement from './CotAppartement';
import './AppartementsList.css'; // Fichier de style amélioré

const AppartementsList = ({ id_personne }) => {
  const [appartements, setAppartements] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppartement, setSelectedAppartement] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchListePaiements(id_personne);
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
      } else {
        alert(res.message);
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
      <div className="appart-grid">
        {appartements.map((app, index) => (
          <div key={index} className="appart-card" onClick={() => openModal(app)}>
            <h3 className="appart-num">Appartement N° {app.num_appartement}</h3>
            <div className="appart-info">
              <p>Chambres : <strong>{app.nbr_chambre}</strong></p>
              <p>Superficie : <strong>{app.superficie} m²</strong></p>
              <p>Étage : <strong>{app.etage}</strong></p>
              <p>Parking : <strong>{app.espace_parking ? 'Oui' : 'Non'}</strong></p>
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
