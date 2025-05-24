import React, { useEffect, useState } from "react";
import { fetchTotalDepense } from "../../services/statistiques/statistiquesService";
import "./dashStyles.css";

const TotalDepense = () => {
  const [totaux, setTotaux] = useState({
    total_depense: 0,
    total_paye: 0,
    total_non_paye: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchTotalDepense();
      if (res.success) {
        setTotaux(res.data);
      }
    };
    loadData();
  }, []);

  return (
    <div className="card-stats">
      <h5>Résumé Dépenses</h5>
      <div className="d-flex align-items-start">
        <p className="stat-main">{totaux.total_depense} DT</p>
        <div>
          <p className="stat-success">Payés : <span style={{ color: "black" }}>{totaux.total_paye} DT</span></p>
          <p className="stat-primary">Non Payés : <span style={{ color: "black" }}>{totaux.total_non_paye} DT</span></p>
        </div>
      </div>
    </div>
  );
};

export default TotalDepense;
