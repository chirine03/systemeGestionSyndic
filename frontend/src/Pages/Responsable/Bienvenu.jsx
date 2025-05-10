import { Container, Card } from "react-bootstrap";
import { MdWavingHand  } from "react-icons/md";

const Bienvenu = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <Card className="text-center p-5" style={{ maxWidth: "600px", marginLeft: "150px", border: "none" }}>
        <div className="mb-3 text-warning" style={{ fontSize: "5rem" }}>
          <MdWavingHand  />
        </div>
        <h1 className="text-dark mb-3 fw-bold" >Bienvenue</h1>
        <p className="lead text-secondary fw-semibold">
          Vous êtes connecté au <span>système de gestion</span><br />
          <strong className="text-primary fw-semibold">Syndic El Hamd</strong>
        </p>
        <hr />
        <p className="text-muted small">
          Utilisez le menu latéral pour accéder aux fonctionnalités de gestion des cotisations, dépenses, immeubles, etc.
        </p>
      </Card>
    </Container>
  );
};

export default Bienvenu;
