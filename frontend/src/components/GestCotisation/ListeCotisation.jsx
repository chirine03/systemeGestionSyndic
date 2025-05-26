import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import {FaEdit, FaTrash } from 'react-icons/fa';
import SuppCotisation from "./SuppCotisation";

import ModifierCotisation from "./ModifierCotisation";
import { fetchListeCotisation, supprimerCotisation } from "../../services/cotisation/cotisationService";

const ListeCotisation = () => {
  const [cotisations, setCotisations] = useState([]);
  const [filteredCotisations, setFilteredCotisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCotisation, setCurrentCotisation] = useState(null);
  const [listeAppartements, setListeAppartements] = useState([]);
  const [numeroAppartementFilter, setNumeroAppartementFilter] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cotisationToDelete, setCotisationToDelete] = useState(null);

  const fetchCotisations = async () => {
    try {
      const result = await fetchListeCotisation();
      if (result.success) {
        setCotisations(result.cotisations);
        const uniqueAppartements = [...new Set(result.cotisations.map(c => c.num_appartement))];
        setListeAppartements(uniqueAppartements);
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

  const handleDelete = (cotisation) => {
    setCotisationToDelete(cotisation);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    const { id_cotisation, periode, num_appartement, annee } = cotisationToDelete;
    try {
      const result = await supprimerCotisation(id_cotisation, periode, num_appartement, annee);
      if (result.status === "success") {
        setSuccessMessage("✅ Cotisation supprimée avec succès !");
        setErrorMessage("");
        setCotisations((prev) =>
          prev.filter((cotisation) => cotisation.id_cotisation !== id_cotisation)
        );
        setTimeout(() => {
          setShowConfirmModal(false);
          setCotisationToDelete(null);
        }, 1500);
      } else {
        setErrorMessage(result.message || "❌ Erreur lors de la suppression.");
        setSuccessMessage("");
        setTimeout(() => {
          setShowConfirmModal(false);
          setCotisationToDelete(null);
        }, 300);
      }
    } catch (error) {
      setErrorMessage("❌ Une erreur est survenue lors de la suppression.");
      setSuccessMessage("");
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
    <div className="container mt-5" style={{ marginLeft: "200px" }}>
      <h2 className="text-center mb-5 fw-bold">Liste des Cotisations</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <Row className="mb-4 justify-content-center">
        <Col md={4}>
          <Form.Select
            value={numeroAppartementFilter}
            onChange={(e) => setNumeroAppartementFilter(e.target.value)}
          >
            <option value="">🔎 Sélectionnez un appartement</option>
            {listeAppartements.map((num, index) => (
              <option key={index} value={num}>{num}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            value={periodeFilter}
            onChange={(e) => setPeriodeFilter(e.target.value)}
          >
            <option value="">📅 Sélectionnez une période</option>
            <option value="1">1er Trimestre</option>
            <option value="2">2ème Trimestre</option>
            <option value="3">3ème Trimestre</option>
            <option value="4">4ème Trimestre</option>
          </Form.Select>
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
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger text-center" role="alert">
          {errorMessage}
        </div>
      )}

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
                      onClick={() => handleDelete(cotisation)}
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

      <SuppCotisation
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />

    </div>
  );
};

export default ListeCotisation;
