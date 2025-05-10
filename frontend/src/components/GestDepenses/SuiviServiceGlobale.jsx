import { useEffect, useState } from "react";
import { fetchSuiviServiceGlobale } from "../../services/depense/depenseService";
import { Container, Row, Col, Card, Spinner, Form } from "react-bootstrap";

const SuiviServiceGlobale = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anneeFiltre, setAnneeFiltre] = useState("Tous");

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchSuiviServiceGlobale();
      if (response.success) {
        setServices(response.data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const getAnneesDisponibles = () => {
    const annees = services.map((s) => s.annee);
    return ["Tous", ...new Set(annees)];
  };

  const filtrerServices = () => {
    if (anneeFiltre === "Tous") return services;
    return services.filter((s) => s.annee === parseInt(anneeFiltre));
  };

  const formaterListeServices = (liste, colorClass) => {
    if (!liste) return <p className={colorClass}>Aucun</p>;
    return (
      <ul className={`mb-0 ${colorClass}`}>
        {liste.split(" | ").map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <Form.Group className="mb-4">
        <Form.Label><strong>Filtrer par année :</strong></Form.Label>
        <Form.Select value={anneeFiltre} onChange={(e) => setAnneeFiltre(e.target.value)}>
          {getAnneesDisponibles().map((annee, idx) => (
            <option key={idx} value={annee}>{annee}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row>
        {filtrerServices().map((item, index) => (
          <Col key={index} md={6} lg={4} className="mb-4">
            <Card className="card h-100 shadow-sm border-0 rounded-4 bg-white">
              <Card.Body>
                <Card.Title className="text-primary">{item.raison_sociale}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Matricule : {item.num_matricule} | Année : {item.annee}
                </Card.Subtitle>
                <hr />
                <p><strong>Total :</strong> {item.total_montant} DT</p>
                <p><strong>Payé :</strong> {item.total_paye_oui ?? 0} DT</p>
                <p><strong>Non Payé :</strong> {item.total_paye_non ?? 0} DT</p>
                <hr />
                <p><strong>Services Payés :</strong></p>
                {formaterListeServices(item.services_payes, "text-success")}

                <p className="mt-3"><strong>Services Non Payés :</strong></p>
                {formaterListeServices(item.services_non_payes, "text-danger")}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SuiviServiceGlobale;
