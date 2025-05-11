import React, { useEffect, useState } from 'react';
import { getListePrestataire, deletePrestataire } from '../../services/prestataires/prestatairesService';
import { FaPhone, FaFax, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaIdBadge, FaBuilding, FaEdit, FaTrash, FaPlus, FaTools  } from 'react-icons/fa';
import ModifierPrestataire from './ModifierPrestataire';
import AjouterService from '../GestServices/AjouterService'; // Importation du formulaire de service
import PrestServicesListe from '../GestServices/PrestServicesListe'; // Importation du composant de services
import SuppPrestataire from './SuppPrestataire';


const ListePrestataire = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prestataireToDelete, setPrestataireToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPrestataire, setSelectedPrestataire] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [prestataireIdForServices, setPrestataireIdForServices] = useState(null);

   useEffect(() => {
    const fetchPrestataires = async () => {
      try {
        const result = await getListePrestataire();
        if (result.success) {
          setPrestataires(result.data || []);
        } else {
          setError(result.message || 'Erreur inconnue');
        }
      } catch (err) {
        setError('Une erreur est survenue lors de la récupération des prestataires.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrestataires();
  }, []);

  const handleDeleteClick = (id_prestataire) => {
    setPrestataireToDelete(id_prestataire);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = (message) => {
    setPrestataires(prev => prev.filter(p => p.id_prestataire !== prestataireToDelete));
    setTimeout(() => {
      setSuccessMessage(message);
      setShowDeleteModal(false);
      setSelectedPrestataire(null)
    }, 1500); // Masquer le message après 3 secondes
    
  };

  const handleEdit = (prestataire) => {
    setSelectedPrestataire(prestataire);
    setShowEditModal(true);
  };
  
  const handleCloseEditModal = () => {
    setTimeout(() => {
    setShowEditModal(false);
    setSelectedPrestataire(null);
    }, 1500);
  };
  
  const handleSaveEdit = (updatedPrestataire) => {
    if (!updatedPrestataire || !updatedPrestataire.id_prestataire) {
      console.error("Prestataire mis à jour invalide :", updatedPrestataire);
      return;
    }
  
    setPrestataires((prev) =>
      prev.map((p) =>
        p.id_prestataire === updatedPrestataire.id_prestataire ? updatedPrestataire : p
      )
    );
    setShowEditModal(false);
  };

  // Gestion de la modale de service
  const openServiceModal = () => setShowServiceModal(true);
  const closeServiceModal = () => setShowServiceModal(false);

  // Ouvrir la modale des services d'un prestataire
  const openServicesModal = (prestataireId) => {
    setPrestataireIdForServices(prestataireId);
    setShowServicesModal(true); // Ouvrir la modale des services
  };

  // Fermer la modale des services
  const closeServicesModal = () => setShowServicesModal(false);

  if (loading) {
    return <div className="text-center mt-5" style={{ marginLeft: "280px" }}>Chargement des prestataires...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3 text-center">Erreur : {error}</div>;
  }

  return (
    <div style={{ marginLeft: "280px" }} className="container">
      <h2 className="my-4 text-center">Liste des Prestataires</h2>
      <div className="d-flex justify-content-end mb-3">
        <button onClick={openServiceModal} className="btn btn-success rounded-pill ">
          <FaPlus /> Nouveau Intervention
        </button>
      </div>
      {successMessage && (
        <div className="alert alert-success mt-3 text-center">{successMessage}</div>
      )}
      {prestataires.length === 0 ? (
        <p className="text-muted text-center">Aucun prestataire trouvé.</p>
      ) : (
        <div className="row">
          {prestataires.map((prestataire) => (
            <div className="col-md-6 col-lg-4 mb-4" key={prestataire.id_prestataire}>
              <div className="card h-100 shadow-sm border-0 rounded-4 bg-white">
                <div className="card-body">
                  <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-outline-primary btn-sm rounded-pill"
                        onClick={() => handleEdit(prestataire)}>
                        <FaEdit className="me-1" /> Modifier
                    </button>
                  </div>
                  <h5 className="card-title text-primary d-flex align-items-center">
                    <FaBuilding className="me-2" />
                    {prestataire.raison_sociale}
                  </h5>
                  <p className="card-text">
                    <FaIdBadge className="me-2 text-secondary" />
                    <strong>Matricule :</strong> {prestataire.num_matricule}
                  </p>
                  <p className="card-text">
                    <FaMapMarkerAlt className="me-2 text-secondary" />
                    <strong>Adresse :</strong> {prestataire.adresse}
                  </p>
                  <p className="card-text">
                    <FaPhone className="me-2 text-secondary" />
                    <strong>Téléphone :</strong> {prestataire.telephone}
                  </p>
                  <p className="card-text">
                    <FaFax className="me-2 text-secondary" />
                    <strong>Fax :</strong> {prestataire.fax}
                  </p>
                  <p className="card-text">
                    <FaEnvelope className="me-2 text-secondary" />
                    <strong>Email :</strong> {prestataire.email}
                  </p>
                  <p className="card-text">
                    <FaGlobe className="me-2 text-secondary" />
                    <strong>Site Web :</strong>{' '}
                    <a
                      href={`http://www.${prestataire.site_web}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {prestataire.site_web}
                    </a>
                  </p>

                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-outline-primary btn-sm rounded-pill"
                      onClick={() => openServicesModal(prestataire.id_prestataire)}>
                      <FaTools  className="me-1" /> Services
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm rounded-pill"
                      onClick={() => handleDeleteClick(prestataire.id_prestataire)}>
                      <FaTrash className="me-1" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      

       <SuppPrestataire
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        prestataireId={prestataireToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Modale des services du prestataire */}
      {showServicesModal && (
        <PrestServicesListe 
          prestataireId={prestataireIdForServices} 
          onClose={closeServicesModal} 
        />
      )}

      

      {/* Modale AjouterService */}
      {showServiceModal && <AjouterService onClose={closeServiceModal} />}

      {/* Modale ModifierPrestataire */}
      {showEditModal && selectedPrestataire && (
        <ModifierPrestataire
          show={showEditModal}
          prestataire={selectedPrestataire}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default ListePrestataire;
