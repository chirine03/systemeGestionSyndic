import React, { useState, useEffect } from 'react';
import {fetchInfos, ajouterAppartement} from '../../services/appartement/appartementService.js';
import './AjouterAppartement.css';

const AjouterAppartement = () => {
  const [form, setForm] = useState({
    num_appartement: '',
    nbr_chambre: '',
    superficie: '',
    etage: '',
    espace_parking: '',
    description: '',
    id_immeuble: '',
    id_personne: ''
  });

  const [erreurs, setErreurs] = useState({});
  const [immeubles, setImmeubles] = useState([]);
  const [proprietaires, setProprietaires] = useState([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const chargerInfos = async () => {
      const response = await fetchInfos();
      if (response.success) {
        setImmeubles(response.data.immeubles);
        setProprietaires(response.data.proprietaires);
      }
    };
    chargerInfos();
  }, []);
  
  const valider = () => {
    const newErrors = {};

    if (!form.num_appartement.trim()) {
        newErrors.num_appartement = "Numéro requis.";
      } else if (!/^[A-Z][0-9]{1,3}$/.test(form.num_appartement)) {
        newErrors.num_appartement = "Ex: A123 (1 majuscule + 1 à 3 chiffres)";
      } else {
        const selectedImmeuble = immeubles.find(i => String(i.id_immeuble) === String(form.id_immeuble));
        if (selectedImmeuble) {
          const bloc = selectedImmeuble.bloc.toUpperCase(); // ex: B
          const lettre = form.num_appartement.charAt(0);     // ex: A
          const chiffres = form.num_appartement.slice(1);    // ex: 12
      
          // bloc doit correspondre à la lettre
          if (lettre !== bloc) {
            newErrors.num_appartement = `Lettre doit être ${bloc} (bloc sélectionné).`;
          } 
          // chiffres doivent être numériques
          else if (!/^\d{1,3}$/.test(chiffres)) {
            newErrors.num_appartement = "Format incorrect après la lettre.";
          } 
          // premier chiffre des numéros = étage
          else if (parseInt(chiffres[0]) !== parseInt(form.etage)) {
            newErrors.num_appartement = `Le 1er chiffre (${chiffres[0]}) doit correspondre à l'étage (${form.etage}).`;
          }
        }
      }      
      
    const nbr = Number(form.nbr_chambre);
    if (!nbr || isNaN(nbr) || nbr < 1 || nbr > 10) {
      newErrors.nbr_chambre = "Entre 1 et 10.";
    }

    const sup = Number(form.superficie);
    if (!sup || isNaN(sup) || sup < 20 || sup > 5000) {
      newErrors.superficie = "Entre 20 et 5000.";
    }

    const etg = Number(form.etage);
    if (form.etage === '' || isNaN(etg) || etg < 0 || etg > 20) {
      newErrors.etage = "Entre 0 et 20.";
    }

    if (!form.espace_parking) {
      newErrors.espace_parking = "Sélection requise.";
    }

    if (form.description && form.description.length > 200) {
      newErrors.description = "200 caractères max.";
    }

    if (!form.id_immeuble) newErrors.id_immeuble = "Sélectionner un immeuble.";
    if (!form.id_personne) newErrors.id_personne = "Sélectionner une personne.";

    setErreurs(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (valider()) {
      console.log("✅ Données valides :", form);
      // Envoi des données au backend
      const response = await ajouterAppartement(form);
      if (response.success) {
        setMessage({ text: response.message, type: 'success' });
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    }
  };
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="ajouter-appartement">
      <h2 className="ajout-title fw-bold">Ajouter un Appartement</h2>

        {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                {message.text}
            </div>
        )}
      <form onSubmit={handleSubmit} className="row g-3">

        <div className="col-md-6">
          <label className="form-label fw-bold">Num appartement *</label>
          <input
            type="text"
            name="num_appartement"
            className={`form-control ${erreurs.num_appartement ? 'is-invalid' : ''}`}
            value={form.num_appartement}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{erreurs.num_appartement}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Nombre de chambres *</label>
          <input
            type="number"
            name="nbr_chambre"
            className={`form-control ${erreurs.nbr_chambre ? 'is-invalid' : ''}`}
            value={form.nbr_chambre}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{erreurs.nbr_chambre}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Superficie (m²) *</label>
          <input
            type="number"
            name="superficie"
            className={`form-control ${erreurs.superficie ? 'is-invalid' : ''}`}
            value={form.superficie}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{erreurs.superficie}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Étage *</label>
          <input
            type="number"
            name="etage"
            className={`form-control ${erreurs.etage ? 'is-invalid' : ''}`}
            value={form.etage}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{erreurs.etage}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Espace parking *</label>
          <select
            name="espace_parking"
            className={`form-select ${erreurs.espace_parking ? 'is-invalid' : ''}`}
            value={form.espace_parking}
            onChange={handleChange}
          >
            <option value="">-- Sélectionner --</option>
            <option value="oui">Oui</option>
            <option value="non">Non</option>
          </select>
          <div className="invalid-feedback">{erreurs.espace_parking}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Description (optionnel)</label>
          <input
            type="text"
            name="description"
            className={`form-control ${erreurs.description ? 'is-invalid' : ''}`}
            value={form.description}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{erreurs.description}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Immeuble *</label>
            <select name="id_immeuble" className={`form-select ${erreurs.id_immeuble ? 'is-invalid' : ''}`} value={form.id_immeuble} onChange={handleChange}>
                <option value="">-- Sélectionner --</option>
                {immeubles.map((imm) => (
                    <option key={imm.id_immeuble} value={imm.id_immeuble}>
                    {imm.raison_sociale} - Bloc {imm.bloc}
                    </option>
                ))}
            </select>

          <div className="invalid-feedback">{erreurs.id_immeuble}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Proprietaire *</label>
            <select name="id_personne" className={`form-select ${erreurs.id_personne ? 'is-invalid' : ''}`} value={form.id_personne} onChange={handleChange}>
                <option value="">-- Sélectionner --</option>
                {proprietaires.map((p) => (
                    <option key={p.id_personne} value={p.id_personne}>
                    {p.nom} {p.prenom} - CIN {p.cin}
                    </option>
                ))}
            </select>

          <div className="invalid-feedback">{erreurs.id_personne}</div>
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-ajouter">Ajouter</button>
        </div>
      </form>
    </div>
  );
};

export default AjouterAppartement;
