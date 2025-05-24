import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RecetteActuelles from "./RecetteActuelles";
import TotalDepense from "./TotalDepense";

function Cards() {
  return (
    <Container className="py-3">
      <Row className="gx-2 justify-content-between">
        <Col xs={12} sm={6} md={4} lg={3}>
          <RecetteActuelles />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <TotalDepense />
        </Col>
      </Row>
    </Container>
  );
}

export default Cards;
