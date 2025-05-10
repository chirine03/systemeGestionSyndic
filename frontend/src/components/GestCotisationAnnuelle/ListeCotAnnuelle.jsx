import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import {FaEdit, FaTrash } from 'react-icons/fa';
import ModifierCotAnnuelle from "./ModifierCotAnnuelle";

const ListeCotAnnuelle = () => {
  const [cotisations, setCotisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [cotisationToEdit, setCotisationToEdit] = useState(null);

  const fetchCotisations = async () => {
    try {
      const response = await fetch("http://localhost/my_api/ListeCotAnnuelle.php");
      const result = await response.json();

      if (result.status === "success") {
        setCotisations(result.cotisations);
      } else {
        setError("Erreur lors du chargement des cotisations annuelles.");
      }
    } catch (error) {
      setError("Erreur de connexion avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (annee) => {
    const isConfirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette cotisation annuelle ?"
    );
    if (!isConfirmed) return;

    try {
      const response = await fetch("http://localhost/my_api/SuppCotAnnuelle.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          annee: annee,
        }),
      });
      const result = await response.json();

      if (result.status === "success") {
        setMessageType("success");
        setMessage("Cotisation annuelle supprimée avec succès !");
        setCotisations(cotisations.filter((cotisation) => cotisation.annee !== annee));
      } else {
        setMessageType("danger");
        setMessage(result.message);
      }
    } catch (error) {
      setMessageType("danger");
      setMessage("Erreur lors de la suppression.");
    }
  };

  const handleEdit = (annee) => {
    const selected = cotisations.find((c) => c.annee === annee);
    setCotisationToEdit(selected);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCotisationToEdit(null);
    fetchCotisations(); // Rafraîchir les données après modification
  };

  useEffect(() => {
    fetchCotisations();
  }, []);

  return (
    <div className="container mt-5" style={{ marginLeft: "280px" }}>
      <h2 className="text-center mb-4">Liste des Cotisations Annuelles</h2>

      {message && (
        <div className={`alert alert-${messageType}`} role="alert">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center">Chargement des cotisations annuelles...</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <Table bordered hover className="table table-hover table-bordered align-middle text-center">
            <thead className="table-secondary">
              <tr>
                <th className="fw-bold">Année</th>
                <th className="fw-bold">Montant avec Parking (DTN)</th>
                <th className="fw-bold">Montant sans Parking (DTN)</th>
                <th className="fw-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cotisations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    Aucune cotisation annuelle disponible
                  </td>
                </tr>
              ) : (
                cotisations.map((cotisation) => (
                  <tr key={cotisation.annee}>
                    <td>{cotisation.annee}</td>
                    <td>{cotisation.montant_avec_parking} DTN</td>
                    <td>{cotisation.montant_sans_parking} DTN</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(cotisation.annee)}
                      ><FaEdit className="me-1" />Modifier</Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(cotisation.annee)}
                      ><FaTrash className="me-1" /> Supprimer </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

      )}

      {/* Modal de modification */}
      {cotisationToEdit && (
        <ModifierCotAnnuelle
          show={showModal}
          handleClose={handleCloseModal}
          cotisation={cotisationToEdit}
        />
      )}
    </div>
  );
};

export default ListeCotAnnuelle;
