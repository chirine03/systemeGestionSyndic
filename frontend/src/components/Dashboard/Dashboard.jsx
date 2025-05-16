import React from "react";
import GlobalCotisation from "./GlobalCotisation";
import TauxPaiementCot from "./TauxPaiementCot";
import { Container, Row, Col } from "react-bootstrap";

function Dashboard() {
    return (
        <Container fluid className="py-4">
            <h2 className="mb-4 text-center">Tableau de Bord des Cotisations</h2>
            
            <Row className="g-4">
                {/* Première colonne - GlobalCotisation */}
                <Col xl={7} lg={12} md={12}>
                    <div className="p-3 bg-white rounded shadow-sm h-100">
                        <GlobalCotisation />
                    </div>
                </Col>

                {/* Deuxième colonne - TauxPaiementCot */}
                <Col xl={5} lg={12} md={12}>
                    <div className="p-3 bg-white rounded shadow-sm h-100">
                        <TauxPaiementCot />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;