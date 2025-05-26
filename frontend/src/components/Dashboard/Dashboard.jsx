import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cards from "./Card";
import TauxDepensePrestataire from "./TauxDepensePrestataire";
import TotalDepensesParImmeuble from "./TotalDepensesParImmeuble";
import EvolDepense from "./EvolDepense";
import DepensePayeNonPaye from "./DepensePayeNonPaye";
import TauxRecouvrement from "./TauxRecouvrement";

function Dashboard() {
  return (
    <Container fluid className="py-4">
      <h2 className="text-center mb-4">Tableau de Bord - Syndic</h2>

      {/* Cartes indicateurs */}
      <Cards />

      {/* Taux de recouvrement */}
      <Row className="mt-2 justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <TauxRecouvrement />
        </Col>
      </Row>

      {/* Dépenses - Vue Globale */}
      <Row className="mt-2 justify-content-center">
        <Col xs={12} md={10} lg={6} className="mb-4">
          <TotalDepensesParImmeuble />
        </Col>
        <Col xs={12} md={10} lg={6} className="mb-4">
          <EvolDepense />
        </Col>
      </Row>

      {/* Dépenses - Évolution & par prestataire */}
      <Row className="mt-2 justify-content-center">
        <Col xs={12} md={10} lg={6} className="mb-4">
          <DepensePayeNonPaye />
        </Col>
        <Col xs={12} md={10} lg={6} className="mb-4">
          <TauxDepensePrestataire />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
