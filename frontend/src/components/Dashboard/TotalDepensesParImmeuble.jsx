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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TotalDepensesParImmeuble = () => {
  const [data, setData] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState(null);
  const [selectedType, setSelectedType] = useState("total"); // total, payee, non_payee
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

  // filtrer les données par année sélectionnée
  const filteredData = selectedAnnee
    ? data.filter((item) => item.annee === selectedAnnee)
    : data;

  const immeubles = filteredData.map((item) => item.immeuble);

  const totalData = filteredData.map((item) => Number(item.total_depense));
  const payeeData = filteredData.map((item) => Number(item.depense_payee));
  const nonPayeeData = filteredData.map((item) => Number(item.depense_non_payee));

  const chartData = {
    labels: immeubles,
    datasets: [
      selectedType === "total" && {
        label: "Dépense Totale",
        data: totalData,
        backgroundColor: "#6495ED",
      },
      selectedType === "payee" && {
        label: "Dépense Payée",
        data: payeeData,
        backgroundColor: "#28a745",
      },
      selectedType === "non_payee" && {
        label: "Dépense Non Payée",
        data: nonPayeeData,
        backgroundColor: "#dc3545",
      },
    ].filter(Boolean),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Dépenses par Immeuble - ${selectedAnnee}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} DT`,
        },
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
    <div className="card shadow-sm p-4 bg-white rounded" style={{ maxWidth: 600, margin: "auto" }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="annee" style={{ marginRight: 8 }}>
          Filtrer par année :
        </label>
        <select
          id="annee"
          value={selectedAnnee || ""}
          onChange={(e) => setSelectedAnnee(Number(e.target.value))}
          style={{ padding: "4px 8px", marginRight: 16 }}
        >
          {annees.map((annee) => (
            <option key={annee} value={annee}>
              {annee}
            </option>
          ))}
        </select>

        <label htmlFor="type">Type de dépense :</label>
        <select
          id="type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ padding: "4px 8px", marginLeft: 8 }}
        >
          <option value="total">Totale</option>
          <option value="payee">Payée</option>
          <option value="non_payee">Non payée</option>
        </select>
      </div>

      <Bar data={chartData} options={options} height={250} width={380}/>
    </div>
  );
};

export default TotalDepensesParImmeuble;
