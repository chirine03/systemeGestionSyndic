import React from "react";
import { FaBuilding } from "react-icons/fa";
import "./ImprCotisation.css";

const ImprCotisation = ({ data, onClose }) => {
  const handlePrint = () => {
    const content = document.getElementById("print-cotisation");
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Impression Cotisation</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
              color: #444;
              background-color: #f4f4f4;
            }
            h3 {
              text-align: center;
              color: #0056b3;
            }
            .syndic-header {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              margin-top: 15px;
              color: #333;
            }
            .syndic-header i {
              font-style: italic;
              margin-left: 8px;
              color: #6c757d;
            }
            .recap-section {
              margin-top: 20px;
              font-size: 15px;
              line-height: 1.6;
              color: #555;
            }
            .footer-info {
              margin-top: 30px;
              font-size: 13px;
              text-align: center;
              color: #777;
            }
            hr {
              margin: 20px 0;
              border: 0;
              border-top: 1px solid #e0e0e0;
            }
            .no-print {
              display: flex;
              justify-content: center;
              gap: 10px;
              margin-top: 20px;
            }
            .btn-imprimer {
              background-color: #007bff;
              color: white;
              border: none;
              padding: 10px 20px;
              cursor: pointer;
              font-size: 16px;
              border-radius: 5px;
              transition: background-color 0.3s;
            }
            .btn-imprimer:hover {
              background-color: #0056b3;
            }
            .btn-fermer {
              background-color: #6c757d;
              color: white;
              border: none;
              padding: 10px 20px;
              cursor: pointer;
              font-size: 16px;
              border-radius: 5px;
              transition: background-color 0.3s;
            }
            .btn-fermer:hover {
              background-color: #5a6268;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const currentDate = new Date().toLocaleString();

  if (!data) return null;

  return (
    <div className="message-box recap-box">
      <div id="print-cotisation">
        <h3>Reçu de Paiement</h3>

        <div className="syndic-header">
          <FaBuilding size={24} />
          <i>Syndic El Hamd</i>
        </div>
        <p><em>Rue des Émeraudes, Sousse</em></p>

        <hr />

        <div className="recap-section">
          <p><strong>Nom du Propriétaire :</strong> {data.nom} {data.prenom}</p>
          <p><strong>Appartement N° :</strong> {data.num_appartement}</p>
          <p><strong>Montant :</strong> {data.montant} DT</p>
          <p><strong>Période :</strong> {data.periode}</p>
          <p><strong>Année :</strong> {data.annee}</p>
          <p><strong>Type de Paiement :</strong> {data.type_payement}</p>
          <p><strong>Date de Paiement :</strong> {data.date_payement}</p>
        </div>

        <hr />

        <p className="footer-info">
          Responsable du syndic : Soulef Khalfallah — Tel : 97594414<br />
          Imprimé le : {currentDate}
        </p>
      </div>

      <div className="no-print">
        <button className="btn-imprimer" onClick={handlePrint}>OK</button>
        <button className="btn-fermer" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default ImprCotisation;
