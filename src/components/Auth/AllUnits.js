import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form"; // <-- add this
import * as Units from "../../data/Units/Units";
import { Link, useNavigate } from "react-router-dom";
import endpoint from "../../context/endpoint";
import { useForm } from "react-hook-form";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";

export default function AllUnits() {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
  });

  // drawer controls
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
    });
  };

  // fetch dropdown data
  useEffect(() => {
    // const getRoles = async () => {
    //   try {
    //     const res = await endpoint.get("/role/getRoles");
    //     setRoles(res.data.data);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

    const getUnits = async () => {
      try {
        const res = await endpoint.get("/unit/get-all-units");
        setUnits(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    // const getDepartments = async () => {
    //   try {
    //     const res = await endpoint.get("/department/list");
    //     setDepartments(res.data.data);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

    // getRoles();
    getUnits();
    // getDepartments();
  }, []);

  // handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await endpoint.post("/unit/create-unit", {
  //       name: formData.name,
  //     });

  //     console.log("✅ Unit added:", res.data);
  //     handleClose();
  //   } catch (err) {
  //     console.error("❌ Upload failed:", err.response?.data || err.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await endpoint.post("/unit/create-unit", {
        name: formData.name,
      });

      console.log("✅ Unit added:", res.data);

      // ✅ show success toast
      SuccessAlert("Unit created successfully!");
      setRefreshKey((prev) => prev + 1);

      // close drawer and reset form
      handleClose();

      // optionally refresh the unit list
      const refreshed = await endpoint.get("/unit/get-all-units");
      setUnits(refreshed.data.data);
    } catch (err) {
      console.error("❌ Upload failed:", err.response?.data || err.message);

      // ❌ show error toast
      ErrorAlert(err.response?.data?.message || "Failed to create unit");
    }
  };

  return (
    <div>
      <div className="page-header ">
        <div>
          {/* <h1 className="page-title">Documentation </h1> */}

          <Breadcrumb className="breadcrumb">
            {/* <Breadcrumb.Item href="#">Home</Breadcrumb.Item> */}
            <Breadcrumb.Item active>Units List</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          {/* <Button
            onClick={handleOpen}
            className="btn btn-primary btn-icon text-white me-3"
          >
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            Add Unit
          </Button> */}

          <Button onClick={handleOpen} className="btn btn-green btn-icon me-3">
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            Add Unit
          </Button>
        </div>
      </div>

      {/* <Search.SearchStaff handleSearch={handleSearch} data={data}/> */}

      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <Col className="card-title text-center mb-0"> UNITS LIST </Col>
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                  <Units.Units refreshKey={refreshKey} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Drawer on the left */}

      {/* <Drawer anchor="left" open={open} onClose={handleClose}>
        <div style={{ width: 400, padding: "20px" }}>
          <h4 className="mb-3" style={{ color: "#0a7e51" }}>
            Add Unit
          </h4>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Unit Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              required
              className="mb-3"
            />

            <div className="d-flex justify-content-end mt-3">
              <Button
                onClick={handleClose}
                variant="secondary"
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </Drawer> */}

      <Modal show={open} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#0a7e51" }}>Add Unit</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <TextField
              label="Unit Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              required
              className="mb-3"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
