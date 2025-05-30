import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchTotalDepensesParImmeuble } from "../../services/statistiques/statistiquesService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const TotalDepensesParImmeuble = () => {
  const [data, setData] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchTotalDepensesParImmeuble();
      if (res.success) {
        setData(res.data);
        const years = [...new Set(res.data.map((item) => item.annee))];
        setAnnees(years);
        setSelectedAnnee(years[0] || null);
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

  // Filtrer et trier les données par année sélectionnée et montant total décroissant
  const filteredData = selectedAnnee
    ? data.filter((item) => item.annee === selectedAnnee)
    : data;

  const sortedData = [...filteredData].sort((a, b) => b.total_depense - a.total_depense);

  const immeubles = sortedData.map((item) => item.immeuble);
  const totalData = sortedData.map((item) => Number(item.total_depense));
  const payeeData = sortedData.map((item) => Number(item.depense_payee));
  const nonPayeeData = sortedData.map((item) => Number(item.depense_non_payee));

  const chartData = {
    labels: immeubles,
    datasets: [
      {
        label: "Dépense Totale",
        data: totalData,
        backgroundColor: "#7ea9e1", // bleu pastel
      },
      {
        label: "Dépense Payée",
        data: payeeData,
        backgroundColor: "#87d37c", // vert pastel
      },
      {
        label: "Dépense Non Payée",
        data: nonPayeeData,
        backgroundColor: "#f07c7c", // rouge pastel
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} DT`,
        },
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (val) => `${val} DT`,
        font: { weight: "bold" },
        color: "#000",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Montant (DT)" },
      },
      x: {
        title: { display: true, text: "Immeubles" },
      },
    },
  };

  return (
    <div className="card shadow-sm p-4 bg-white rounded justify-content-center" style={{ maxWidth: 650, height: "480px", margin: "auto" }}>
      <h5 className="text-center mb-3 fs-6">Répartition des Dépenses par Immeuble - {selectedAnnee}</h5>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="annee" style={{ marginRight: 8, fontWeight: "bold" }}>
          Filtrer par année :
        </label>
        <select
          id="annee"
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

      <Bar data={chartData} options={options} height={350} width={600} />
    </div>
  );
};

export default TotalDepensesParImmeuble;
