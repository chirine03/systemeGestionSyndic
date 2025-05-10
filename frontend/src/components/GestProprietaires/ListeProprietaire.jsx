import React, { useEffect, useState } from "react";
import { fetchListeProprietaires, supprimerProprietaire } from "../../services/proprietaire/proprietaireService";
import { Table, Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import SuppProprietaire from "./SuppProprietaire";
import ModifierProprietaire from "./ModifierProprietaire";

const ListeProprietaire = () => {
  const [proprietaires, setProprietaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [proprioToDelete, setProprioToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [proprioToModifier, setProprioToModifier] = useState(null);

  useEffect(() => {
    const chargerProprietaires = async () => {
      const result = await fetchListeProprietaires();
      if (result.success) {
        setProprietaires(result.data);
      } else {
        setErreur(result.message);
      }
      setLoading(false);
    };

    chargerProprietaires();
  }, []);

  const handleModifier = (proprietaire) => {
    setProprioToModifier(proprietaire);
  };

  const handleSupprimer = (proprietaire) => {
    setProprioToDelete(proprietaire);
    setShowConfirm(true);
  };

  const confirmerSuppression = async () => {
    if (!proprioToDelete || !proprioToDelete.id_personne) {
      toast.error("ID du propriétaire introuvable.");
      return;
    }

    const result = await supprimerProprietaire(proprioToDelete.id_personne);

    if (result.success) {
      setProprietaires((prev) =>
        prev.filter((p) => p.id_personne !== proprioToDelete.id_personne)
      );
      toast.success("Propriétaire supprimé avec succès.");
    } else {
      toast.error("Erreur : " + result.message);
    }

    setShowConfirm(false);
    setProprioToDelete(null);
  };

  const proprietairesFiltres = proprietaires.filter((p) => {
    const filtre = searchTerm.toLowerCase();
    return (
      p.nom?.toLowerCase().includes(filtre) ||
      p.prenom?.toLowerCase().includes(filtre) ||
      p.telephone?.toLowerCase().includes(filtre) ||
      p.cin?.toLowerCase().includes(filtre)
    );
  });

  return (
    <div className="container mt-5" style={{ marginLeft: "270px" }}>
      <h2 className="text-center mb-4 fw-bold">Liste des Propriétaires</h2>

      {/* Zone de recherche */}
      <div className="d-flex justify-content-center mb-4">
        <Form.Control
          type="text"
          placeholder="Rechercher par nom, prénom, téléphone ou CIN"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "500px" }}
        />
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {erreur && <Alert variant="danger">{erreur}</Alert>}

      {!loading && proprietairesFiltres.length > 0 && (
        <Table bordered hover>
          <thead className="table-secondary text-center">
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Date de Naissance</th>
              <th>CIN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proprietairesFiltres.map((p, index) => (
              <tr key={index} className="text-center">
                <td>{index + 1}</td>
                <td>{p.nom}</td>
                <td>{p.prenom}</td>
                <td>{p.telephone}</td>
                <td>{p.adresse}</td>
                <td>
                  {p.date_nais
                    ? new Date(p.date_nais).toLocaleDateString("fr-FR")
                    : "jj/mm/aaaa"}
                </td>
                <td>{p.cin}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleModifier(p)}
                  >
                    <FaEdit className="me-1" /> Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleSupprimer(p)}
                  >
                    <FaTrash className="me-1" /> Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!loading && proprietairesFiltres.length === 0 && (
        <Alert className="table-secondary">Aucun propriétaire trouvé.</Alert>
      )}

      <SuppProprietaire
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        proprietaireId={proprioToDelete?.id_personne} // ✅ ici on passe l'id
        onDeleteSuccess={() => {
          setProprietaires((prev) =>
            prev.filter((p) => p.id_personne !== proprioToDelete?.id_personne)
          );
          setShowConfirm(false);
          setProprioToDelete(null);
        }}
      />

      <ModifierProprietaire
        show={!!proprioToModifier}
        onHide={() => setProprioToModifier(null)}
        proprietaire={proprioToModifier}
      />
    </div>
  );
};

export default ListeProprietaire;
