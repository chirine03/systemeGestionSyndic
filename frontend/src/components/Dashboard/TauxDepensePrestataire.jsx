import React, { useEffect, useState } from "react";
import { fetchTauxDepensePrestataire } from "../../services/statistiques/statistiquesService";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const getBarColor = (value) => {
  if (value >= 75) return "#28a745"; // vert
  if (value >= 50) return "#ffc107"; // orange
  return "#f07c7c"; // rouge
};

const TauxDepensePrestataire = () => {
  const [data, setData] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchTauxDepensePrestataire();
      if (res.success) {
        setData(res.data);
        const uniqueYears = [...new Set(res.data.map((item) => item.annee))];
        setAnnees(uniqueYears);
        setSelectedAnnee(uniqueYears[0] || null);
        setError(null);
      } else {
        setError(res.message);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const filteredData = selectedAnnee
    ? data.filter((item) => item.annee === selectedAnnee)
    : data;

  const labels = filteredData.map((item) => item.prestataire);
  const pourcentageData = filteredData.map((item) => Number(item.pourcentage));
  const depensesData = filteredData.map((item) => Number(item.total_depenses_services));
  const backgroundColors = pourcentageData.map(getBarColor);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Taux de Dépense (%)",
        data: pourcentageData,
        backgroundColor: backgroundColors,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Taux de Dépense par Prestataire (${selectedAnnee})`,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const i = context.dataIndex;
            return ` ${context.raw}% | ${depensesData[i]} DT`;
          },
        },
      },
      datalabels: {
        anchor: "end",
        align: "right",
        formatter: (val) => `${val}%`,
        color: "#000",
        font: {
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (val) => val + "%",
        },
        title: { display: true, text: "Pourcentage" },
      },
      y: {
        title: { display: true, text: "Prestataire" },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuint",
    },
    elements: {
      bar: {
        barThickness: 14,
      },
    },
  };

  return (
    <div className="card shadow-sm p-4 bg-white rounded mt-4 mx-auto" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Taux de Dépense par Prestataire en {selectedAnnee}</h5>
        <select
          className="form-select w-auto"
          value={selectedAnnee || ""}
          onChange={(e) => setSelectedAnnee(Number(e.target.value))}
        >
          {annees.map((annee) => (
            <option key={annee} value={annee}>
              {annee}
            </option>
          ))}
        </select>
      </div>

      {filteredData.length === 0 ? (
        <p className="text-center text-muted">Aucune donnée enregistrée pour cette année.</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default TauxDepensePrestataire;
