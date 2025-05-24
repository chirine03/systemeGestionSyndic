import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { fetchDepensePayeNonPaye } from "../../services/statistiques/statistiquesService.js"; 
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DepensePayeNonPaye = () => {
  const [data, setData] = useState([]);
  const [prestataire, setPrestataire] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchDepensePayeNonPaye();
      if (response.success) {
        setData(response.data);
        setPrestataire(response.data[0]?.prestataire || "");
      }
    };
    loadData();
  }, []);

  const selected = data.find((item) => item.prestataire === prestataire);

  const chartData = {
    labels: ["Services Payés", "Services Non Payés"],
    datasets: [
      {
        data: selected
          ? [Number(selected.services_payes), Number(selected.services_non_payes)]
          : [0, 0],
        backgroundColor: ["rgba(75, 192, 192, 1)","rgba(255, 99, 132, 1)"],
        hoverOffset: 8,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: { enabled: true },
      legend: { position: "bottom" },
      title: {
        display: true,
        text: `Prestataire : ${prestataire}`,
        font: { size: 16 },
      },
      // Plugin personnalisé pour afficher le total au centre
      datalabels: {
        display: true,
        formatter: () =>
          selected ? `${selected.total_services} DT` : "0 DT",
      },
    },
    cutout: "70%", // crée un trou au centre du donut
  };

  return (
    <div className="card shadow-sm p-3 bg-white rounded mt-4">
      <h5 className="text-center">Dépenses Payées vs Non Payées</h5>

      <div className="mb-3">
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

      <div style={{ width: "60%", margin: "auto" }}>
        <Doughnut data={chartData} options={options} />
        <div className="text-center fw-bold mt-2">
          Total : {selected?.total_services || 0} DT
        </div>
      </div>
    </div>
  );
};

export default DepensePayeNonPaye;
