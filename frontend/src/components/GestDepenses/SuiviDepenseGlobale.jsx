import { useEffect, useState } from "react";
import { fetchSuiviDepenseGlobal } from "../../services/depense/depenseService";
import { Form, Row, Col } from "react-bootstrap";
import './stylesDepense.css';

const SuiviDepenseGlobale = () => {
  const [data, setData] = useState([]);
  const [immeubles, setImmeubles] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [selectedImmeuble, setSelectedImmeuble] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [resultatsFiltres, setResultatsFiltres] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchSuiviDepenseGlobal();
      if (response.success) {
        setData(response.data);
        setImmeubles([...new Set(response.data.map(item => item.id_immeuble))]);
        setAnnees([...new Set(response.data.map(item => item.annee))]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedImmeuble || selectedAnnee) {
      let filtered = data;
      if (selectedImmeuble) {
        filtered = filtered.filter(item => item.id_immeuble.toString() === selectedImmeuble);
      }
      if (selectedAnnee) {
        filtered = filtered.filter(item => item.annee.toString() === selectedAnnee);
      }
      setResultatsFiltres(filtered);
    } else {
      setResultatsFiltres([]); // Aucun filtre sélectionné
    }
  }, [selectedImmeuble, selectedAnnee, data]);

  return (
    <div className="form-container">
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Label>Immeuble</Form.Label>
            <Form.Select
              value={selectedImmeuble}
              onChange={(e) => setSelectedImmeuble(e.target.value)}
            >
              <option value="">-- Choisir un immeuble --</option>
              {immeubles.map(id => (
                <option key={id} value={id}>Immeuble {id}</option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Année</Form.Label>
            <Form.Select
              value={selectedAnnee}
              onChange={(e) => setSelectedAnnee(e.target.value)}
            >
              <option value="">-- Choisir une année --</option>
              {annees.map(annee => (
                <option key={annee} value={annee}>{annee}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {resultatsFiltres.length > 0 && resultatsFiltres.map((res, i) => (
        <div key={i} className="summary-container">
          <h5 className="summary-title">Résumé - Immeuble {res.id_immeuble}, Année {res.annee}</h5>
          <div className="d-flex justify-content-between align-items-center summary-text">
            <p><strong className="text-primary">Dépense Totale :</strong> {res.depense_totale} DT</p>
            <p><strong className="text-success">Services Payés :</strong> {res.totale_services_payes} DT</p>
            <p><strong className="text-danger">Services Non Payés :</strong> {res.totale_services_non_payes} DT</p>
            <p><strong className="text-warning">Autres Dépenses :</strong> {res.totale_autres_depenses} DT</p>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default SuiviDepenseGlobale;
