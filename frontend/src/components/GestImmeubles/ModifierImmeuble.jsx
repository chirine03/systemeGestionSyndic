import React, { useState } from "react";
import { modifierImmeuble } from "../../services/immeuble/immeubleService"; // ajustez le chemin si besoin

const ModifierImmeuble = ({ immeuble, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({ ...immeuble });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.raison_sociale.trim()) {
      newErrors.raison_sociale = "Raison sociale est obligatoire.";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.raison_sociale)) {
      newErrors.raison_sociale = "Utilisez uniquement lettres, chiffres et espaces.";
    }

    if (!formData.matricule.trim()) {
      newErrors.matricule = "Matricule est obligatoire.";
    } else if (!/^[a-zA-Z0-9]{10,20}$/.test(formData.matricule)) {
      newErrors.matricule = "Matricule invalide (10-20 caractères alphanumériques).";
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = "Adresse est obligatoire.";
    } else if (formData.adresse.length < 5 || formData.adresse.length > 150) {
      newErrors.adresse = "Adresse entre 5 et 150 caractères.";
    }

    if (!formData.nbr_etage || isNaN(formData.nbr_etage)) {
      newErrors.nbr_etage = "Nombre d'étages est obligatoire et doit être un nombre valide.";
    } else if (parseInt(formData.nbr_etage) < 1 || parseInt(formData.nbr_etage) > 100) {
      newErrors.nbr_etage = "Nombre d'étages doit être entre 1 et 100.";
    }

    if (!formData.bloc.trim()) {
      newErrors.bloc = "Le bloc est obligatoire.";
    } else if (!/^[A-Z]$/.test(formData.bloc)) {
      newErrors.bloc = "Le bloc doit être une seule lettre majuscule (A-Z).";
    }

    if (formData.description && formData.description.length > 250) {
      newErrors.description = "Description : max 250 caractères.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    const result = await modifierImmeuble(formData);
    setMessage(result.message);

    if (result.true) {
      onUpdated();
      onClose();
    }
  };

  if (!immeuble) return null;

  return (
    <div className="modal fade" id="editModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier Immeuble</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={onClose}
            ></button>
          </div>
          {message && (
              <div className="alert alert-info mt-3 text-center">{message}</div>
            )}
          <div className="modal-body">
            <div className="row g-3">
              {[
                { label: "Raison sociale", name: "raison_sociale", type: "text" },
                { label: "Matricule", name: "matricule", type: "text" },
                { label: "Adresse", name: "adresse", type: "text" },
                { label: "Nombre d'étages", name: "nbr_etage", type: "number", min: "0" },
                { label: "Bloc", name: "bloc", type: "text" },
              ].map(({ label, name, type, min }) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    min={min}
                    className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                  {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
                </div>
              ))}

              <div className="col-md-6">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
            </div>

            
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleConfirm}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierImmeuble;
