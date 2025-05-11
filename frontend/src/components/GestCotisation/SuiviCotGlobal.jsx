// SuiviGlobal.jsx
import React, { useEffect, useState } from 'react';
import { fetchSuiviGlobal } from '../../services/cotisation/cotisationService';

const SuiviGlobal = () => {
  const [donnees, setDonnees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [annee, setAnnee] = useState('');
  const [immeuble, setImmeuble] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const getData = async () => {
      const result = await fetchSuiviGlobal();
      console.log("Suivi Global Frontend :", result);
  
      if (result.success) {
        setDonnees(result.data);
      } else {
        setErreur(result.message || "Erreur lors du chargement des données.");
      }
    };
    getData();
  }, []);  

  useEffect(() => {
    if (!annee && !immeuble) {
      setFilteredData([]);
      return;
    }

    const filtered = donnees.filter(item => {
      const matchAnnee = annee ? item.annee === parseInt(annee) : true;
      const matchImmeuble = immeuble ? item.id_immeuble === parseInt(immeuble) : true;
      return matchAnnee && matchImmeuble;
    });
    setFilteredData(filtered);
  }, [donnees, annee, immeuble]);

  if (erreur) {
    return <p className="text-danger">Erreur : {erreur}</p>;
  }

  const immeubles = [...new Set(donnees.map(item => item.id_immeuble))];
  const annees = [...new Set(donnees.map(item => item.annee))];

  return (
    <div className="container mt-4">
      <h4>Global des Cotisations</h4>

      {/* Filtres */}
      <div className="d-flex gap-3 mb-3">
        <div className="flex-grow-1">
          <label htmlFor="annee" className="form-label">Année :</label>
          <select
            id="annee"
            className="form-select"
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
          >
            <option value="">-- Choisir une année --</option>
            {annees.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex-grow-1">
          <label htmlFor="immeuble" className="form-label">Immeuble :</label>
          <select
            id="immeuble"
            className="form-select"
            value={immeuble}
            onChange={(e) => setImmeuble(e.target.value)}
          >
            <option value="">-- Choisir un immeuble --</option>
            {immeubles.map((id, index) => {
              const immeubleData = donnees.find(item => item.id_immeuble === id);
              return (
                <option key={index} value={id}>
                  {immeubleData ? immeubleData.raison_sociale : `Immeuble ${id}`}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <div key={index} className="summary-container">
            <h5 className="summary-title">Résumé - Année {item.annee}</h5>
            <div className="d-flex justify-content-between align-items-center summary-text">
              <p><strong>{item.raison_sociale}</strong></p>
              <p><strong className="text-warning">Globale des Cotisations  :</strong> {item.montant_total_annuel_a_payer} DT</p>
              <p><strong className="text-success">Payé :</strong> {item.montant_total_paye} DT</p>
              <p><strong className="text-danger">Reste :</strong> {item.reste_a_payer} DT</p>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <p className="text-muted text-center">Veuillez sélectionner une année ou un immeuble pour afficher les résultats.</p>
      )}

    </div>
  );
};

export default SuiviGlobal;
