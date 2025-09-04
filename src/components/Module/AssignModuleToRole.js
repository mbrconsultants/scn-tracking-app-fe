import React from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card } from "react-bootstrap";
import * as module from "../../data/module/assignModuleToRole"

export default function AssignModuleToRole() {

  return (
    <div>
      


      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h3 className="card-title mb-0">  Assign Module To Role</h3>
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                  <module.AssignModuleToRole />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}