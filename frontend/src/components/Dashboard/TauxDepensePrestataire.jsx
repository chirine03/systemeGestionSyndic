import React, { useEffect, useState } from "react";
import { fetchTauxDepensePrestataire } from "../../services/statistiques/statistiquesService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const chartData = {
    labels,
    datasets: [
      {
        label: "Pourcentage (%)",
        data: pourcentageData,
        backgroundColor: "rgb(130, 202, 184)",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Taux de Dépense par Prestataire" },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const montant = depensesData[index];
            const pourcent = context.parsed.x;
            return `Pourcentage: ${pourcent}% - Montant: ${montant} DT`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100, // Pourcentage max 100%
        ticks: {
          callback: (val) => val + "%",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    elements: {
    bar: {
      barThickness: 10, 
    },
  },
  };

  return (
    <div className="card shadow-sm p-3 bg-white rounded" style={{ maxWidth: 600, marginLeft: "160px"}}>
    <div style={{ marginBottom: 16 }}>
        <label
        htmlFor="annee-select"
        style={{ marginRight: 8, fontWeight: "bold" }}
        >
        Filtrer par année :
        </label>
        <select
        id="annee-select"
        value={selectedAnnee || ""}
        onChange={(e) => setSelectedAnnee(Number(e.target.value))}
        style={{ padding: "4px 8px", borderRadius: 4 }}
        >
        {annees.map((annee) => (
            <option key={annee} value={annee}>
            {annee}
            </option>
        ))}
        </select>
    </div>

    <Bar data={chartData} options={options} height={300} width={400} />
    </div>

  );
};

export default TauxDepensePrestataire;
