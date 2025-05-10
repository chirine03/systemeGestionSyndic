import React from "react";
import "./ImprRecu.css";
import { FaBuilding } from "react-icons/fa";

const ImprRecu = ({ recapData, onClose }) => {
  const handlePrint = () => {
    const printContent = document.getElementById("recap-content").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Impression Cotisation</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            h3 {
              text-align: center;
              color: #007bff;
            }
            .syndic-header {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              margin-top: 15px;
            }
            .syndic-header i {
              font-style: italic;
              margin-left: 8px;
            }
            .recap-section {
              margin-top: 20px;
              font-size: 15px;
              line-height: 1.6;
            }
            .footer-info {
              margin-top: 30px;
              font-size: 13px;
              text-align: center;
              color: #555;
            }
            hr {
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const currentDate = new Date().toLocaleString();

  return (
    <div className="message-box recap-box">
      <div id="recap-content">
        <h3>Réçu de Paiement</h3>

        <div className="syndic-header">
          <FaBuilding size={24} />
          <i>Syndic El Hamd</i>
        </div>
        <p><em>Rue des emeraudes, Sousse</em></p>

        <hr />

        <div className="recap-section">
          <h4>Nom : {recapData.nomProprietaire} {recapData.prenomProprietaire}</h4>
          <p><strong>Numéro d'Appartement :</strong> {recapData.numeroAppartement}</p>
          <p><strong>Montant :</strong> {recapData.montant} DTN</p>
          <p><strong>Période :</strong> Trimestre {recapData.periode} <strong>// Année :</strong> {recapData.annee}</p>
          <p><strong>Type de Paiement :</strong> {recapData.typePayement}</p>
          <p><strong>Date de Paiement :</strong> {recapData.datePayement}</p>
        </div>

        <hr />

        <p className="footer-info">
          Responsable du syndic : Soulef Khalfallah — Tel : 97594414<br />
          Imprimé le : {currentDate}
        </p>
      </div>

      {/* Boutons visibles seulement à l'écran */}
      <div className="no-print">
        <button className="btn btn-imprimer" onClick={handlePrint}>Imprimer</button>
        <button className="btn btn-fermer" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default ImprRecu;
