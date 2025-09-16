import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form"; // <-- add this
import * as Tracking from "../../data/Tracking/Tracking";
import { Link, useNavigate } from "react-router-dom";
import endpoint from "../../context/endpoint";
import { useForm } from "react-hook-form";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";

export default function AllTracking() {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [tracking, setTracking] = useState([]);
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

    const geTrackings = async () => {
      try {
        const res = await endpoint.get("/unit/get-all-units");
        setTracking(res.data.data);
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
    geTrackings();
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
      setTracking(refreshed.data.data);
    } catch (err) {
      console.error("❌ Upload failed:", err.response?.data || err.message);

      // ❌ show error toast
      ErrorAlert(err.response?.data?.message || "Failed to create unit");
    }
  };

  return (
    <div>
      {/* <Search.SearchStaff handleSearch={handleSearch} data={data}/> */}

      <Row>
        <Col sm={12} className="col-12">
          <Card>
            {/* <Card.Header>
              <Col className="card-title text-center mb-0"> Tracking Files</Col>
            </Card.Header> */}
            <Card.Header>
              <Col className="text-beginning text-center">
                <Card.Title
                  as="h3"
                  style={{ color: "#0A7E51", fontWeight: 120, fontSize: 20 }}
                >
                  Tracking Files
                </Card.Title>
              </Col>
              {/* <Col className="text-end">
                <Button
                  className="btn btn-sm"
                  type="button"
                  variant=""
                  // onClick={(e) => {
                  //   handleAppellantModal();
                  // }}
                  onClick={handleOpen}
                  style={{
                    backgroundColor: "#0A7E51",
                    borderColor: "#0A7E51",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  <span className="fa fa-plus"></span>
                  Add Unit
                </Button>
              </Col> */}
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                  <Tracking.Tracking refreshKey={refreshKey} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
