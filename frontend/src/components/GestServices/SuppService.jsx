const SuppService = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmer la suppression</h5>
          </div>
          <div className="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer ce service ?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
            <button className="btn btn-danger" onClick={onConfirm}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppService;
