import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { fetchTauxPaiements } from "../../services/statistiques/statistiquesService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrer les composants nécessaires de Chart.js pour le Donut chart
ChartJS.register(ArcElement, Tooltip, Legend);

const TauxPaiementCot = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [annees, setAnnees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les données au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchTauxPaiements();
        if (result.success) {
          setData(result.data);
          setFilteredData(result.data);

          // Extraire les années pour les options de filtrage
          const uniqueAnnees = [...new Set(result.data.map((item) => item.annee.toString()))];
          setAnnees(uniqueAnnees);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction de filtrage des données selon l'année sélectionnée
  const filterData = () => {
    let newData = [...data]; // Créer une copie des données originales

    // Appliquer le filtre si une année est sélectionnée
    if (selectedAnnee) {
      newData = newData.filter((item) => item.annee.toString() === selectedAnnee);
    }

    setFilteredData(newData); // Mettre à jour les données filtrées
  };

  // Re-appliquer le filtrage chaque fois que l'année change
  useEffect(() => {
    filterData();
  }, [selectedAnnee, data]); // Écouter le changement de l'année et des données

  // Préparer les données du graphique
  const chartData = {
    labels: filteredData.map(
      (item) => `Immeuble ${item.id_immeuble} - ${item.annee}`
    ),
    datasets: [
      {
        label: "Taux de Paiement (%)",
        data: filteredData.map((item) => item.taux_paiement_pourcentage),
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div style={{ marginLeft: "280px" }}>Chargement en cours...</div>;
  }

  return (
    <div style={{ marginLeft: "280px" }}>
      <h2>Taux de Paiement par Année</h2>

      {/* Option de filtrage par année */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="annee-select" style={{ marginRight: "10px" }}>Filtrer par année: </label>
        <select
          id="annee-select"
          onChange={(e) => setSelectedAnnee(e.target.value)}
          value={selectedAnnee}
          style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Toutes les années</option>
          {annees.map((annee) => (
            <option key={annee} value={annee}>
              {annee}
            </option>
          ))}
        </select>
      </div>

      {/* Afficher le graphique uniquement si des données sont disponibles */}
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {filteredData.length > 0 ? (
          <Doughnut 
            data={chartData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.label}: ${context.raw}%`;
                    }
                  }
                }
              }
            }} 
          />
        ) : (
          <p>Aucune donnée à afficher pour cette sélection.</p>
        )}
      </div>

    </div>
  );
};

export default TauxPaiementCot;