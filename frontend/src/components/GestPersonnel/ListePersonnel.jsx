import  { useEffect, useState } from "react";
import { fetchListePersonnel } from "../../services/personnel/personnelService";
import { Table, Spinner, Alert, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import SuppPersonnel from "./SuppPersonnel";
import ModifierPersonnel from "./ModifierPersonnel";

const ListePersonnel = () => {
  const [personnel, setpersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [personnelToDelete, setpersonnelToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [personnelToModifier, setpersonnelToModifier] = useState(null);

  const chargerPersonnel = async () => {
  setLoading(true);
  const result = await fetchListePersonnel();
  if (result.success) {
    setpersonnel(result.data);
  } else {
    setErreur(result.message);
  }
  setLoading(false);
};

useEffect(() => {
  chargerPersonnel();
}, []);

  const handleModifier = (personnel) => {
    setpersonnelToModifier(personnel);
  };

  const handleSupprimer = (personnel) => {
    setpersonnelToDelete(personnel);
    setShowConfirm(true);
  };

  const personnelFiltres = personnel.filter((p) => {
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
      <h2 className="text-center mb-4 fw-bold">Liste des Personnel</h2>

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

      {!loading && personnelFiltres.length > 0 && (
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
              <th>Salaire</th>
              <th>Poste</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnelFiltres.map((p, index) => (
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
                <td>{p.salaire}</td>
                <td>{p.post}</td>
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

      {!loading && personnelFiltres.length === 0 && (
        <Alert className="table-secondary">Aucun propriétaire trouvé.</Alert>
      )}

      <SuppPersonnel
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        personnelId={personnelToDelete?.id_personne} // ✅ ici on passe l'id
        onDeleteSuccess={() => {
          setpersonnel((prev) =>
            prev.filter((p) => p.id_personne !== personnelToDelete?.id_personne)
          );
          setShowConfirm(false);
          setpersonnelToDelete(null);
        }}
      />

      <ModifierPersonnel
        show={!!personnelToModifier}
        onHide={() => setpersonnelToModifier(null)}
        personnel={personnelToModifier}
        onUpdate ={chargerPersonnel}
      />
    </div>
  );
};

export default ListePersonnel;
