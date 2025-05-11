import React, { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { ImpTableCotisation } from "./ImpTableCotisation";
import SuiviGlobal from "./SuiviCotGlobal"; 
import { fetchSuiviCotisations } from "../../services/cotisation/cotisationService";

const SuiviCotisation = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortDateAsc, setSortDateAsc] = useState(true);
  const [anneeFilter, setAnneeFilter] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCotisations = async () => {
      const result = await fetchSuiviCotisations();
      if (result.success) {
        const formattedData = result.data.map((item) => ({
          ...item,
          proprietaire: `${item.nomProprietaire} ${item.prenomProprietaire}`,
        }));
  
        const sortedData = formattedData.sort((a, b) => {
          const [prefixA, numA] = a.numeroAppartement.match(/^([A-Z]+)(\d+)$/i).slice(1);
          const [prefixB, numB] = b.numeroAppartement.match(/^([A-Z]+)(\d+)$/i).slice(1);
          return prefixA.toUpperCase() === prefixB.toUpperCase()
            ? parseInt(numA) - parseInt(numB)
            : prefixA.localeCompare(prefixB);
        });
  
        setData(sortedData);
        setFilteredData(sortedData);
      } else {
        setError(result.message || "Erreur lors du chargement des données.");
      }
      setLoading(false);
    };
    getCotisations();
  }, []);
  

  useEffect(() => {
    let updated = [...data];

    if (anneeFilter) {
      updated = updated.filter(
        (item) => String(item.annee) === String(anneeFilter)
      );
    }

    if (periodeFilter) {
      updated = updated.filter(
        (item) => item.trimestresPayes === parseInt(periodeFilter)
      );
    }

    updated.sort((a, b) => {
      const dateA = new Date(a.derniereDate);
      const dateB = new Date(b.derniereDate);
      return sortDateAsc ? dateA - dateB : dateB - dateA;
    });    

    setFilteredData(updated);
  }, [anneeFilter, periodeFilter, sortDateAsc, data]);

  const resetFilters = () => {
    setAnneeFilter("");
    setPeriodeFilter("");
    setSortDateAsc(true);
  };

  return (
    <div className="container my-5" style={{ marginLeft: "270px" }}>
      <h1 className=" mb-5 fw-bold text-center">Suivi des Cotisations</h1>
      <SuiviGlobal />
      <Row className="align-items-center g-3 mb-4 justify-content-center">
        <Col md={3}>
          <Form.Select
            value={anneeFilter}
            onChange={(e) => setAnneeFilter(e.target.value)}
            className="rounded-pill shadow-sm"
          >
            <option value="">📅 Filtrer par année</option>
            {[...new Set(data.map(item => item.annee))].sort().map((annee, index) => (
              <option key={index} value={annee}>{annee}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select
            value={periodeFilter}
            onChange={(e) => setPeriodeFilter(e.target.value)}
            className="rounded-pill shadow-sm"
          >
            <option value="">🗓️ Filtrer par trimestre</option>
            {[1, 2, 3, 4].map((trimestre) => (
              <option key={trimestre} value={trimestre}>
                 {trimestre} Trimestre
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md="auto">
          <Button
            variant={sortDateAsc ? "success" : "danger"}
            onClick={() => setSortDateAsc(!sortDateAsc)}
            className="rounded-pill"
          >
            Trier Date {sortDateAsc ? "↑" : "↓"}
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={resetFilters} className="rounded-pill">
          ♻️ Réinitialiser
          </Button>
        </Col>
      </Row>

      {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Chargement des données...</p>
          </div>) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>) : 
          (
            <div className="table-responsive shadow-sm ">
              <Table id="tableCotisations" bordered hover responsive="md" className="align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>Num Appartement</th>
                    <th>Propriétaire</th>
                    <th>Montant Payé</th>
                    <th>Nombres Trimestres</th>
                    <th>Total Annuel</th>
                    <th>Reste à Payé</th>
                    <th>Dernier Date Paiement</th>
                    <th>Année</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        Aucune donnée disponible
                      </td>
                    </tr> ) : (
                    filteredData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.numeroAppartement}</td>
                        <td>{item.proprietaire}</td>
                        <td>{item.sommePayee} DTN</td>
                        <td>{item.trimestresPayes} Trimestres</td>
                        <td>{item.montantTotalAnnuel} DTN</td>
                        <td>{item.resteAPayer} DTN</td>
                        <td>
                          {item.derniereDate
                            ? new Date(item.derniereDate).toLocaleDateString("fr-FR")
                            : "jj/mm/aaaa"}
                        </td>
                        <td>{item.annee}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
      )}

      <div className="text-end mt-4">
        <Button variant="primary" size="lg" className="rounded-pill" onClick={ImpTableCotisation}>
           Imprimer
        </Button>
      </div>
    </div>
  );
};

export default SuiviCotisation;
