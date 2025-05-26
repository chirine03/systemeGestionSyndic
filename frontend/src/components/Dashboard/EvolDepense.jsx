import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { fetchEvolDepense } from "../../services/statistiques/statistiquesService.js";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  ChartDataLabels
);

const EvolDepense = () => {
  const [data, setData] = useState([]);
  const [filtre, setFiltre] = useState("tous");
  const chartRef = useRef();

  useEffect(() => {
    const loadDepenses = async () => {
      const response = await fetchEvolDepense();
      if (response.success) {
        setData(response.data);
      }
    };
    loadDepenses();
  }, []);

  // Fonction de filtrage temporel
  const filterByDate = (data, type) => {
    const now = new Date();
    return data.filter(({ date_depense }) => {
      const d = new Date(date_depense);
      switch (type) {
        case "mois":
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        case "trimestre":
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const itemQuarter = Math.floor(d.getMonth() / 3);
          return itemQuarter === currentQuarter && d.getFullYear() === now.getFullYear();
        case "annee":
          return d.getFullYear() === now.getFullYear();
        default:
          return true; // "tous"
      }
    });
  };

  const filteredData = filterByDate(data, filtre);

  const grouped = filteredData.reduce((acc, item) => {
    const date = item.date_depense;
    acc[date] = (acc[date] || 0) + item.montant;
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();
  const montants = dates.map((date) => grouped[date]);

  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "rgba(0, 123, 255, 0.1)");
    gradient.addColorStop(1, "rgba(0, 123, 255, 0.4)");
    return gradient;
  };

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Montant des dépenses (DT)",
        data: montants,
        fill: true,
        borderColor: "#007bff",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return getGradient(ctx, chartArea);
        },
        tension: 0.4,
        pointBackgroundColor: "#007bff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => ` ${context.raw} DT`,
        },
      },
      datalabels: {
        display: true,
        align: "top",
        color: "#333",
        font: { weight: "bold" },
        formatter: (value) => `${value} DT`,
      },
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
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
  };

  return (
      <div
        className="card shadow-sm p-3 bg-white rounded mt-4 mx-auto"
        style={{
          maxWidth: "1000px",
          height: "370px",  
          margin: "auto",
        }}
      >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Évolution des Dépenses</h5>
        <select
          className="form-select w-auto"
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
        >
          <option value="tous">Tous</option>
          <option value="mois">Mois en cours</option>
          <option value="trimestre">Trimestre en cours</option>
          <option value="annee">Année en cours</option>
        </select>
      </div>

      {dates.length === 0 ? (
        <p className="text-center text-muted">Aucune dépense enregistrée pour cette période.</p>
      ) : (
        <Line data={chartData} options={options} ref={chartRef} height={150} />
      )}
    </div>
  );
};

export default EvolDepense;
