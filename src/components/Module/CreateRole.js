import React from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card } from "react-bootstrap";

import * as role from "../../data/module/createRole"
import { Link, useNavigate } from "react-router-dom";


export default function CreateRole() {

  return (
    <div>
     

      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h3 className="card-title mb-0">Roles</h3>
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                  <role.CreateRole />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}