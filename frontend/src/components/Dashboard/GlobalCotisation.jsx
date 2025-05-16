// SuiviGlobal.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchSuiviGlobal } from '../../services/cotisation/cotisationService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GlobalCotisation = () => {
  const [donnees, setDonnees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [annee, setAnnee] = useState('');
  const [immeuble, setImmeuble] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const result = await fetchSuiviGlobal();
        if (result.success) {
          setDonnees(result.data);
        } else {
          setErreur(result.message || "Erreur lors du chargement des données.");
        }
      } catch (error) {
        setErreur("Une erreur est survenue lors de la connexion au serveur.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);  

  useEffect(() => {
    let filtered = donnees;
    
    if (annee) {
      filtered = filtered.filter(item => item.annee === parseInt(annee));
    }
    
    if (immeuble) {
      filtered = filtered.filter(item => item.id_immeuble === parseInt(immeuble));
    }
    
    setFilteredData(filtered);
  }, [donnees, annee, immeuble]);

  // Préparation des données pour le graphique empilé
  const chartData = {
    labels: filteredData.map(item => 
      immeuble ? `Année ${item.annee}` : `${item.raison_sociale || `Immeuble ${item.id_immeuble}`}`
    ),
    datasets: [
      {
        label: 'Payé (DT)',
        data: filteredData.map(item => item.montant_total_paye),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Reste à Payer (DT)',
        data: filteredData.map(item => item.reste_a_payer),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des Paiements',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} DT`;
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
            return `Total: ${total} DT`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Montant (DT)'
        }
      }
    },
    interaction: {
      mode: 'index'
    }
  };

  const immeubles = [...new Set(donnees.map(item => item.id_immeuble))];
  const annees = [...new Set(donnees.map(item => item.annee))];

  if (loading) {
    return <div className="text-center mt-4">Chargement en cours...</div>;
  }

  if (erreur) {
    return <p className="text-danger text-center mt-4">{erreur}</p>;
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Répartition des Cotisations</h4>

      {/* Filtres */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="annee" className="form-label">Année :</label>
          <select
            id="annee"
            className="form-select"
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
          >
            <option value="">Toutes les années</option>
            {annees.sort().map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="immeuble" className="form-label">Immeuble :</label>
          <select
            id="immeuble"
            className="form-select"
            value={immeuble}
            onChange={(e) => setImmeuble(e.target.value)}
          >
            <option value="">Tous les immeubles</option>
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
        <div className="chart-container" style={{ height: '500px' }}>
          <Bar 
            data={chartData} 
            options={options} 
          />
          <div className="mt-3 text-center text-muted">
            <small>La hauteur totale de chaque barre représente le montant total à payer</small>
          </div>
        </div>
      ) : (
        <div className="alert alert-info text-center">
          {donnees.length > 0 
            ? "Veuillez sélectionner des critères de filtrage"
            : "Aucune donnée disponible"}
        </div>
      )}
    </div>
  );
};

export default GlobalCotisation;