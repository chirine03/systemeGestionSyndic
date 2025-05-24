import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Button, Spinner, Table } from "react-bootstrap";
import { fetchCotisationInfos } from "../../services/cotisation/cotisationService";
import ImprCotisation from "./ImprCotisation";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

Modal.setAppElement('#root');

const CotAppartement = ({ isOpen, onClose, appartement }) => {
  const [cotisations, setCotisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCotisation, setSelectedCotisation] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    const loadInfos = async () => {
      setLoading(true);
      const result = await fetchCotisationInfos();
      console.log("Résultat de fetchCotisationInfos :", result);
      if (!result.success) {
        console.error("Erreur :", result.message);
      }
      setLoading(false);
    };
    loadInfos();
  }, []);

  useEffect(() => {
    if (appartement?.cotisations) {
      setCotisations(appartement.cotisations);
    }
  }, [appartement]);

  return (
    <>
      {/* Modal principale */}
      {isOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header text-white">
                <h5 className="modal-title">
                  Cotisations - Appartement N° {appartement?.num_appartement}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                {loading ? (
                  <div className="text-center my-3">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : cotisations.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Montant</th>
                        <th>Période</th>
                        <th>Type</th>
                        <th>Payé le</th>
                        <th>Année</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotisations.map((cot, idx) => (
                        <tr key={idx}>
                          <td>{cot.montant} DT</td>
                          <td>{cot.periode}</td>
                          <td>{cot.type_payement}</td>
                          <td>{formatDate(cot.date_payement)}</td>
                          <td>{cot.annee}</td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() => {
                                setSelectedCotisation(cot);
                                setShowPrintModal(true);
                                onClose(); // Ferme le modal principal ici
                              }}
                            >
                              Imprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted text-center">Aucune cotisation trouvée.</p>
                )}
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={onClose}>
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'impression */}
      {showPrintModal && selectedCotisation && (
        <ImprCotisation
          data={selectedCotisation}
          onClose={() => setShowPrintModal(false)}
        />
      )}

    </>
  );
};

export default CotAppartement;
