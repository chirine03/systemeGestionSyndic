import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import {FaEdit, FaTrash } from 'react-icons/fa';

import ModifierCotisation from "./ModifierCotisation";
import { fetchListeCotisation, supprimerCotisation } from "../../services/cotisation/cotisationService";

const ListeCotisation = () => {
  const [cotisations, setCotisations] = useState([]);
  const [filteredCotisations, setFilteredCotisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCotisation, setCurrentCotisation] = useState(null);

  const [numeroAppartementFilter, setNumeroAppartementFilter] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("");

  const fetchCotisations = async () => {
    try {
      const result = await fetchListeCotisation();
      if (result.success) {
        setCotisations(result.cotisations);
      } else {
        setError(result.message || "❌ Erreur lors du chargement des cotisations.");
      }
    } catch (error) {
      setError("❌ Une erreur est survenue lors de la récupération des cotisations.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cotisations];
    if (numeroAppartementFilter) {
      filtered = filtered.filter((cotisation) =>
        cotisation.num_appartement.includes(numeroAppartementFilter)
      );
    }
    if (periodeFilter) {
      filtered = filtered.filter((cotisation) => cotisation.periode === periodeFilter);
    }
    setFilteredCotisations(filtered);
  };

  const handleEdit = (cotisation) => {
    setCurrentCotisation(cotisation);
    setShowModal(true);
  };

  const handleDelete = async (idCotisation, periode, num_appartement, annee) => {
    if (!window.confirm("⚠️ Voulez-vous vraiment supprimer cette cotisation ?")) return;
    try {
      const result = await supprimerCotisation(idCotisation, periode, num_appartement, annee);
      if (result.status === "success") {
        alert("✅ Cotisation supprimée avec succès !");
        setCotisations((prev) =>
          prev.filter((cotisation) => cotisation.id_cotisation !== idCotisation)
        );
      } else {
        alert(result.message || "❌ Erreur lors de la suppression.");
      }
    } catch (error) {
      alert("❌ Une erreur est survenue lors de la suppression.");
    }
  };

  const chargerCotisations = () => {
    fetchCotisations();
  };

  useEffect(() => {
    fetchCotisations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [numeroAppartementFilter, periodeFilter, cotisations]);

  return (
    <div className="container mt-5" style={{ marginLeft: "280px" }}>
      <h2 className="text-center mb-5 fw-bold">Liste des Cotisations</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <Row className="mb-4 justify-content-center">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="🔎 Filtrer par numéro appartement ex : A11"
            value={numeroAppartementFilter}
            onChange={(e) => setNumeroAppartementFilter(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="number"
            placeholder="📅 Filtrer par période (1 à 4)"
            value={periodeFilter}
            onChange={(e) => setPeriodeFilter(e.target.value)}
          />
        </Col>
        <Col md="auto">
          <Button
            variant="outline-primary"
            className="rounded-pill"
            onClick={() => {
              setNumeroAppartementFilter("");
              setPeriodeFilter("");
            }}
          >
            ♻️ Réinitialiser
          </Button>
        </Col>
      </Row>

      {loading ? (
        <p className="text-center">⏳ Chargement des cotisations...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-secondary">
              <tr className="text-center">
                <th>#</th>
                <th>Numéro Appartement</th>
                <th>Montant</th>
                <th>Période</th>
                <th>Type de Paiement</th>
                <th>Date de Paiement</th>
                <th>Année</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCotisations.map((cotisation, index) => (
                <tr key={cotisation.id_cotisation} className="align-middle text-center">
                  <td>{index + 1}</td>
                  <td>{cotisation.num_appartement}</td>
                  <td>{cotisation.montant} DTN</td>
                  <td>{cotisation.periode}</td>
                  <td>{cotisation.type_payement}</td>
                  <td>
                    {cotisation.date_payement
                      ? new Date(cotisation.date_payement).toLocaleDateString("fr-FR")
                      : "jj/mm/aaaa"}
                  </td>
                  <td>{cotisation.annee}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(cotisation)}
                    ><FaEdit className="me-1" /> Modifier</Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(cotisation.id_cotisation, cotisation.periode,cotisation.num_appartement, cotisation.annee)}
                    ><FaTrash className="me-1" /> Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ModifierCotisation
          show={showModal}
          handleClose={() => setShowModal(false)}
          cotisation={currentCotisation}
          onCotisationUpdated={chargerCotisations}
        />
      )}
    </div>
  );
};

export default ListeCotisation;
