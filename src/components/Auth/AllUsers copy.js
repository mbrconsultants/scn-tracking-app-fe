
import React, {useEffect, useState} from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Button } from "react-bootstrap";
import * as Users from "../../data/Users/Users"
import { Link,useNavigate } from "react-router-dom";
import endpoint from "../../context/endpoint"
import { useForm } from 'react-hook-form';
// import { ErrorAlert, SuccessAlert } from "../../../data/Toast/toast";


export default function AllUsers() {
 
  return (
    <div>
      <div className="page-header ">
        <div>
          {/* <h1 className="page-title">Documentation </h1> */}
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
               {/* Staff documentation */}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
       
      </div>
     
      {/* <Search.SearchStaff handleSearch={handleSearch} data={data}/> */}
      
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
                <Col className="card-title text-center mb-0"> USERS LIST </Col>
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                    <Users.Users/>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}