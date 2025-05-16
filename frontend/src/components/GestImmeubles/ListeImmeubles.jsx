import React, { useEffect, useState } from "react";
import {
  fetchListeImmeubles,
} from "../../services/immeuble/immeubleService";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaIdCard,
  FaLayerGroup,
  FaThLarge,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import ModifierImmeuble from "./ModifierImmeuble";
import SuppImmeuble from "./SuppImmeuble";

const ListeImmeubles = () => {
  const [immeubles, setImmeubles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedImmeuble, setSelectedImmeuble] = useState(null);
  const [immeubleToDelete, setImmeubleToDelete] = useState(null);

  const getImmeubles = async () => {
    setLoading(true);
    const result = await fetchListeImmeubles();
    if (result.success) {
      setImmeubles(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getImmeubles();
  }, []);

  useEffect(() => {
    if (selectedImmeuble) {
      const modal = new window.bootstrap.Modal(
        document.getElementById("editModal")
      );
      modal.show();
    }
  }, [selectedImmeuble]);

  useEffect(() => {
    if (immeubleToDelete) {
      const modal = new window.bootstrap.Modal(
        document.getElementById("deleteModal")
      );
      modal.show();
    }
  }, [immeubleToDelete]);

  const handleEdit = (immeuble) => {
    setSelectedImmeuble({ ...immeuble });
  };

  const confirmEdit = () => {
    getImmeubles (); // rafraîchir la liste
    setSuccessMessage("Immeuble modifié avec succès.");
    setSelectedImmeuble(null);
  };

  const handleDelete = (id) => {
    setImmeubleToDelete(id);
  };

  const confirmDelete = async () => {
    getImmeubles();
    setSuccessMessage("Immeuble supprimé avec succès.");
    setImmeubleToDelete(null);
  };

  return (
    <div style={{ marginLeft: "280px" }} className="container">
      <h1 className="my-4 text-center">Liste des Immeubles</h1>
      {successMessage && (
        <div className="alert alert-success text-center">{successMessage}</div>
      )}

      {loading ? (
        <p className="text-center text-muted">Chargement...</p>
      ) : immeubles.length === 0 ? (
        <p className="text-center text-muted">Aucun immeuble trouvé.</p>
      ) : (
        <div className="row">
          {immeubles.map((immeuble) => (
            <div className="col-md-6 col-lg-4 mb-4" key={immeuble.id_immeuble}>
              <div className="card shadow-sm h-100 border-0 rounded-4 bg-white">
                <div className="card-body">
                  <h5 className="card-title text-primary d-flex align-items-center">
                    <FaBuilding className="me-2" />
                    {immeuble.raison_sociale}
                  </h5>
                  <p className="card-text">
                    <FaMapMarkerAlt className="me-2" />
                    <strong>Adresse :</strong> {immeuble.adresse}
                  </p>
                  <p className="card-text">
                    <FaIdCard className="me-2" />
                    <strong>Téléphone :</strong> {immeuble.telephone}
                  </p>
                  <p className="card-text">
                    <FaLayerGroup className="me-2" />
                    <strong>Étages :</strong> {immeuble.nbr_etage}
                  </p>
                  <p className="card-text">
                    <FaThLarge className="me-2" />
                    <strong>Bloc :</strong> {immeuble.bloc}
                  </p>
                  {immeuble.description && (
                    <p className="card-text text-muted">
                      {immeuble.description}
                    </p>
                  )}

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill"
                      onClick={() => handleEdit(immeuble)}
                    >
                      <FaEdit className="me-1" /> Modifier
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill"
                      onClick={() => handleDelete(immeuble.id_immeuble)}
                    >
                      <FaTrash className="me-1" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImmeuble && (
        <ModifierImmeuble
          immeuble={selectedImmeuble}
          onClose={() => setSelectedImmeuble(null)}
          onUpdated={confirmEdit}
        />
      )}
      {immeubleToDelete && (
        <SuppImmeuble
          id_immeuble={immeubleToDelete}
          onSuppression={confirmDelete}
        />
      )}
    </div>
  );
};

export default ListeImmeubles;