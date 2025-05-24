import React, { useEffect, useState } from "react";
import { fetchRecetteActuelle } from "../../services/statistiques/statistiquesService";
import "./dashStyles.css";

const RecetteActuelles = () => {
  const [recette, setRecette] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchRecetteActuelle();
      if (res.success) {
        setRecette(res.data.recette_actuelle);
      }
    };
    loadData();
  }, []);

  return (
    <div className="card-stats">
      <h5>Recette Actuelle</h5>
      <p className="stat-recette">{recette} DT</p>
    </div>
  );
};

export default RecetteActuelles;
