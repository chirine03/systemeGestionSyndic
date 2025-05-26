import React, { useEffect, useState } from "react";
import { fetchTauxRecouvrement } from "../../services/statistiques/statistiquesService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Form } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

function TauxRecouvrement() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedImmeuble, setSelectedImmeuble] = useState("");
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchTauxRecouvrement();
      if (response.success) {
        setData(response.data);
        if (response.data.length > 0) {
          setSelectedYear(response.data[0].annee);
          setSelectedImmeuble(response.data[0].raison_sociale);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const match = data.find(
      (item) =>
        item.annee === parseInt(selectedYear) &&
        item.raison_sociale === selectedImmeuble
    );
    setFilteredData(match || null);
  }, [selectedYear, selectedImmeuble, data]);

  const years = [...new Set(data.map((item) => item.annee))];
  const immeubles = [...new Set(data.map((item) => item.raison_sociale))];

  const taux = filteredData ? filteredData.taux_paiement : 0;

  const getColor = (value) => {
    if (value >= 75) return "#4CAF50";
    if (value >= 40) return "#FF9800";
    return "#F44336";
  };

  const doughnutData = {
    labels: ["Payé", "Restant"],
    datasets: [
      {
        data: [taux, 100 - taux],
        backgroundColor: [getColor(taux), "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    rotation: -90,
    circumference: 180,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.parsed.toFixed(2)}%`,
        },
      },
    },
  };

  return (
<div className="card p-3 m-2 shadow-sm" style={{ maxHeight: "450px", width: "650px" }}>
  <h5 className="text-center mb-3 fs-6">Taux de Recouvrement pour {selectedImmeuble} en {selectedYear}</h5>

  <Form className="d-flex justify-content-center gap-4 mb-3">
    <Form.Group>
      <Form.Label className="mb-1 small">Année</Form.Label>
      <Form.Select
        className="form-select"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        style={{ minWidth: "130px" }}
      > 
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group>
      <Form.Label className="mb-1 small">Immeuble</Form.Label>
      <Form.Select
        className="form-select"
        value={selectedImmeuble}
        onChange={(e) => setSelectedImmeuble(e.target.value)}
        style={{ minWidth: "190px" }}
      >
        {immeubles.map((imm) => (
          <option key={imm} value={imm}>
            {imm}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Form>

  {filteredData && (
    <div className="row align-items-center">
      {/* Graphique */}
      <div className="col-md-6 position-relative d-flex flex-column align-items-center">
        <p className="text-center mb-1 small">
          <strong>Montant total annuel à payer :</strong>{" "}
          {filteredData.montant_total_annuel_a_payer} TND
        </p>

        <div style={{ width: "280px", height: "180px" }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div
            style={{
              position: "absolute",
              top: "75%",
              left: "35%",
              transform: "translate(-50%, -50%)",
              fontSize: "18px",
              fontWeight: "bold",
              color: getColor(taux),
              pointerEvents: "none",
            }}
          >
            {taux.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Détails */}
      <div className="col-md-6 text-start small">
        <p className="mb-3">
          <strong>Total payé:</strong> {filteredData.montant_total_paye} TND
        </p>
        <p className="mb-1">
          <strong>Total à payer:</strong>{" "}
          {filteredData.montant_total_annuel_a_payer} TND
        </p>
      </div>
    </div>
  )}
</div>


  );
}

export default TauxRecouvrement;
