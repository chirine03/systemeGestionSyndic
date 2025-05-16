import { useEffect, useState } from 'react';
import { getServicesByPrestataire, deleteService } from '../../services/prestataires/servicesService';
import './AjouterService.css';
import SuppService from './SuppService';

const PrestServicesListe = ({ prestataireId, onClose }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const result = await getServicesByPrestataire(prestataireId);

      if (result.success) {
        const sortedData = result.data.sort((a, b) => a.paye === "non" ? -1 : 1);
        setServices(sortedData);
      } else {
        setError(result.message);
      }

      setLoading(false);
    };

    fetchServices();
  }, [prestataireId]);

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      const result = await deleteService(serviceToDelete);
      if (result.success) {
        alert("Service supprimé avec succès.");
        // Optionnel : tu peux aussi rafraîchir la liste ici si besoin
      } else {
        alert("Erreur lors de la suppression du service.");
      }
      setServiceToDelete(null);
    }
  };

  return (
    <>
      {!serviceToDelete && (
        <div className="modal show d-block" tabIndex="1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content liste-width">
              <div className="modal-header">
                <h5 className="modal-title">Services du Prestataire</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                {loading && <p>Chargement...</p>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && services.length === 0 && (
                  <p className="text-muted">Aucun service trouvé pour ce prestataire.</p>
                )}
                {!loading && !error && services.length > 0 && (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Date intervention</th>
                        <th>Réf. facture</th>
                        <th>Montant</th>
                        <th>Immeuble</th>
                        <th>Description</th>
                        <th>À Payé</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(service => (
                        <tr key={service.id_service}>
                          <td>{service.nom}</td>
                          <td>{service.type}</td>
                          <td>{service.date_intervention}</td>
                          <td>{service.reference_facture}</td>
                          <td>{service.montant}DTN</td>
                          <td>{service.raison_sociale} - {service.bloc}</td>
                          <td>{service.description}</td>
                          <td style={{ color: service.paye === "oui" ? "green" : "red", fontWeight: "bold" }}>
                            {service.paye === "oui" ? "Oui" : "Non"}
                          </td>
                          <td>
                            <button 
                              className="btn btn-danger"
                              onClick={() => {
                                setServiceToDelete(service.id_service);
                                onClose(); // 👈 ferme la modale des services dès qu’on clique "Supprimer"
                              }}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {serviceToDelete && (
        <SuppService
          onConfirm={handleConfirmDelete}
          onCancel={() => setServiceToDelete(null)}
        />
      )}
    </>
  );
};

export default PrestServicesListe;
