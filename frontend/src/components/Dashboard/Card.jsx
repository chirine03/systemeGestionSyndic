import React from "react";
import { Row, Col } from "react-bootstrap";
import RecetteActuelles from "./RecetteActuelles";
import TotalDepense from "./TotalDepense";

function Cards() {
  return (
    <Row className="gx-4 gy-3 justify-content-center">
      <Col xs={12} sm={6} md={4} lg={3}>
        <RecetteActuelles />
      </Col>
      <Col xs={12} sm={6} md={4} lg={3}>
        <TotalDepense />
      </Col>
    </Row>
  );
}

export default Cards;
