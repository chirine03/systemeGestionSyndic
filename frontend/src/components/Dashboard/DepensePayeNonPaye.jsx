import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { fetchDepensePayeNonPaye } from "../../services/statistiques/statistiquesService.js";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DepensePayeNonPaye = () => {
  const [data, setData] = useState([]);
  const [prestataire, setPrestataire] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchDepensePayeNonPaye();
      if (response.success && response.data.length > 0) {
        setData(response.data);
        setPrestataire(response.data[0].prestataire);
        setSelected(response.data[0]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const selectedItem = data.find((item) => item.prestataire === prestataire);
    setSelected(selectedItem || null);
  }, [prestataire, data]);

  const total = selected
    ? Number(selected.services_payes) + Number(selected.services_non_payes)
    : 0;

  const chartData = {
    labels: [
      `Services Payés`,
      `Services Non Payés`
    ],
    datasets: [
      {
        data: selected
          ? [Number(selected.services_payes), Number(selected.services_non_payes)]
          : [0, 0],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverOffset: 8,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
            return `${context.label}: ${value} services (${percentage}%)`;
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              const percentage = total
                ? ((value / total) * 100).toFixed(2)
                : 0;
              return {
                text: `${label} - ${percentage}%`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: "#fff",
                lineWidth: 1,
                index: i,
              };
            });
          },
        },
      },
      title: {
        display: true,
        text: `Prestataire : ${prestataire}`,
        font: { size: 16 },
      },
    },
    cutout: "60%",
  };

  return (
    <div
      className="card shadow-sm p-4 bg-white rounded mt-4"
      style={{
        maxWidth: "720px",
        margin: "auto",
      }}
    >
      <h5 className="text-center mb-4">Répartition des Dépenses Payées et Non Payées pour "{prestataire}"</h5>

      {data.length === 0 ? (
        <p className="text-center text-muted">Aucune donnée disponible.</p>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="selectPrestataire" className="form-label">
              Filtrer par prestataire :
            </label>
            <select
              id="selectPrestataire"
              className="form-select"
              value={prestataire}
              onChange={(e) => setPrestataire(e.target.value)}
            >
              {data.map((item) => (
                <option key={item.prestataire} value={item.prestataire}>
                  {item.prestataire}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between align-items-start">
            {/* GRAPH GAUCHE */}
            <div style={{ width: "50%", position: "relative" }}>
              <Doughnut data={chartData} options={options} />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {selected ? `${selected.total_services} DT` : "0 DT"}
              </div>
            </div>

            {/* INFOS DROITE */}
            <div style={{ width: "45%", paddingLeft: "20px" }}>
              {selected && total === 0 && (
                <p className="text-warning mt-3">
                  Aucun service enregistré pour ce prestataire.
                </p>
              )}

              {selected && total > 0 && (
                <>
                  <p>
                    <strong>Services payés :</strong> {selected.services_payes}
                  </p>
                  <p>
                    <strong>Services non payés :</strong> {selected.services_non_payes}
                  </p>
                  <p>
                    <strong>Total :</strong> {selected.total_services} DT
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

};

export default DepensePayeNonPaye;
