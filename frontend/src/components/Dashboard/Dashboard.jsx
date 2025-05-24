import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cards from "./Card";
import TauxDepensePrestataire from "./TauxDepensePrestataire";
import TotalDepensesParImmeuble from "./TotalDepensesParImmeuble";
import EvolDepense from "./EvolDepense"
import DepensePayeNonPaye from "./DepensePayeNonPaye"

function Dashboard() {
    return (
        <Container fluid className="py-4" style={{ marginLeft: "150px" }}>
            <h1 className="dashboard-title text-center">Table de Bord Syndic</h1>

            <Cards />

            <Row>
                <Col md={5}>
                    <TauxDepensePrestataire />
                </Col>
                <Col md={5}>
                    <TotalDepensesParImmeuble />
                </Col>
            </Row>

            <Row>
                <Col md={5}>
                    <EvolDepense />
                </Col>
                <Col md={5}>
                    <DepensePayeNonPaye />
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;
