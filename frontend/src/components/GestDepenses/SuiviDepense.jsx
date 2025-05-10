import { Container } from "react-bootstrap";
import SuiviDepenseGlobale from "./SuiviDepenseGlobale";
import SuiviServiceGlobale from "./SuiviServiceGlobale"; // ✅ Import du composant service

const SuiviDepense = () => {
  return (
    <Container className="container-custom">
      <h2 className="mt-4 mb-4">Suivi Dépense Globale</h2>
      <SuiviDepenseGlobale />

      <h4 className="mt-5 mb-4">Résumé Global des Dépenses par Service</h4>
      <SuiviServiceGlobale /> {/* ✅ Appel du composant service */}
    </Container>
  );
};

export default SuiviDepense;
