import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchEvolDepense } from "../../services/statistiques/statistiquesService.js";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const EvolDepense = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadDepenses = async () => {
      const response = await fetchEvolDepense();
      if (response.success) {
        setData(response.data);
      }
    };
    loadDepenses();
  }, []);

  // Regrouper les dépenses par date (somme des montants par date)
  const grouped = data.reduce((acc, item) => {
    const date = item.date_depense;
    acc[date] = (acc[date] || 0) + item.montant;
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort(); // trier les dates
  const montants = dates.map((date) => grouped[date]);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Montant des dépenses (DT)",
        data: montants,
        fill: false,
        borderColor: "#007bff",
        backgroundColor: "#007bff",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Montant (DT)" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };

  return (
    <div className="card shadow-sm p-3 bg-white rounded mt-4" style={{ maxWidth: 600, marginLeft: "160px"}}>
      <h5 className="text-center mb-4">Évolution des Dépenses</h5>
      <Line data={chartData} options={options} height={300} width={400}/>
    </div>
  );
};

export default EvolDepense;
