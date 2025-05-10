// src/components/ComptesInscrit/ListeComptes.jsx
import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { fetchListeComptes } from '../../services/ComptesInscrit/listeComptesService';
import { fetchPersonneById } from '../../services/ComptesInscrit/getPersonneService';
import PersonneDetails from './PersonneDetails';
import './ListeComptes.css';

const ListeComptes = () => {
  const [comptes, setComptes] = useState([]);
  const [filteredComptes, setFilteredComptes] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPersonne, setSelectedPersonne] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const loadComptes = async () => {
      const result = await fetchListeComptes();
      if (result.success) {
        setComptes(result.comptes);
        setFilteredComptes(result.comptes);
      } else {
        console.error(result.message);
      }
      setLoading(false);
    };

    loadComptes();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      setFilteredComptes(comptes.filter(c => c.role === selectedRole));
    } else {
      setFilteredComptes(comptes);
    }
  }, [selectedRole, comptes]);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVoirPlus = async (id_personne) => {
    const result = await fetchPersonneById(id_personne);
    if (result.success) {
      setSelectedPersonne(result.personne);
      document.body.classList.add('modal-open');
    }
  };

  const closeModal = () => {
    setSelectedPersonne(null);
    document.body.classList.remove('modal-open');
  };

  if (loading) {
    return <div className="loading-container">Chargement...</div>;
  }

  return (
    <div className="comptes-container" style={{ marginLeft: "400px" }}>
      <div className="comptes-header">
        <h2 className="comptes-title">Liste des Comptes</h2>
        <div className="filter-section">
          <label htmlFor="roleFilter" className="filter-label">Filtrer par rôle</label>
          <select
            id="roleFilter"
            className="form-select filter-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="responsable">Responsable</option>
            <option value="proprietaire">Propriétaire</option>
            
          </select>
        </div>
      </div>

      {filteredComptes.length === 0 ? (
        <div className="no-results">Aucun compte trouvé pour ce rôle.</div>
      ) : (
        <div className="comptes-grid">
          {filteredComptes.map((compte) => (
            <div key={compte.id_compte} className="compte-card">
              <div className="card-header">
                <h5>Compte #{compte.id_compte}</h5>
                <span className={`badge role-badge ${compte.role}`}>{compte.role}</span>
              </div>
              <div className="card-body">
                <div className="card-field">
                  <span className="field-label">Email</span>
                  <span className="field-value">{compte.mail}</span>
                </div>
                <div className="card-field password-field">
                  <span className="field-label">Mot de passe</span>
                  <code>{visiblePasswords[compte.id_compte] ? compte.mot_de_passe : '******'}</code>
                  <button
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility(compte.id_compte)}
                  >
                    {visiblePasswords[compte.id_compte] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="card-field">
                  <span className="field-label">Créé le</span>
                  <span className="field-value">{compte.date_creation}</span>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn-details" onClick={() => handleVoirPlus(compte.id_personne)}>
                  Voir plus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPersonne && (
        <PersonneDetails personne={selectedPersonne} onClose={closeModal} />
      )}
    </div>
  );
};

export default ListeComptes;
