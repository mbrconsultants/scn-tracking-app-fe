import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Button,
  Modal,
  Form,
  FormGroup,
} from "react-bootstrap";
import * as location from "../../data/setup/createlocation";
import { CForm } from "@coreui/react";
import { useForm } from "react-hook-form";
import endpoint from "../../context/endpoint";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";

export default function CreateLocation() {
  const { register, handleSubmit, reset: resetFormHook } = useForm();

  const [isLoading, setLoading] = useState(false);
  const [locationModal, setShowLocationModal] = useState(false);
  const [locationModalHeading, setLocationModalHeading] = useState("");
  const [name, setLocationName] = useState("");
  const [description, setLocationDescription] = useState("");
  const [datas, setDatas] = useState([]);

  // Show location modal
  const handleAppellantModal = () => {
    setShowLocationModal(true);
    setLocationModalHeading("Add New Location");
  };

  // Create location
  const handleCreateLocation = async () => {
    setLoading(true);

    // Create form data
    const data = new FormData();
    data.append("name", name);
    data.append("description", description);

    try {
      const res = await endpoint.post(`/location/createLocation/`, data);

      // Check if response has message
      if (res.data.message) {
        SuccessAlert(res.data.message);
      } else {
        SuccessAlert("Location created successfully!");
      }

      setShowLocationModal(false);
      setLoading(false);
      getAllData();
      resetForm();
    } catch (error) {
      setLoading(false);
      console.error("Create error:", error.response);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.description ||
        error.response?.data?.error ||
        "Failed to create location";
      ErrorAlert(errorMessage);
    }
  };

  const getAllData = async () => {
    try {
      const res = await endpoint.get(`/location/getAllLocations`);
      console.log("all locations", res.data.data);
      setDatas(res.data.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const resetForm = () => {
    setLocationName("");
    setLocationDescription("");
    resetFormHook(); // Reset react-hook-form
  };

  const handleModalClose = () => {
    setShowLocationModal(false);
    resetForm();
  };

  return (
    <div>
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <Col className="text-beginning">
                <Card.Title
                  as="h3"
                  style={{ color: "#0A7E51", fontWeight: 900 }}
                >
                  LOCATION SETUP
                </Card.Title>
              </Col>
              <Col className="text-end">
                <Button
                  className="btn btn-sm"
                  type="button"
                  variant=""
                  onClick={(e) => {
                    handleAppellantModal();
                  }}
                  style={{
                    backgroundColor: "#0A7E51",
                    borderColor: "#0A7E51",
                    color: "white",
                    fontWeight: 900,
                  }}
                >
                  <span className="fa fa-plus"></span>
                  Add Location
                </Button>
              </Col>
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                  <location.CreateLocation
                    datas={datas}
                    getAllData={getAllData}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={locationModal} onHide={handleModalClose}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#0a7148", color: "#fff" }}
        >
          <Modal.Title style={{ color: "#fff" }}>
            {locationModalHeading}
          </Modal.Title>
        </Modal.Header>
        <CForm
          onSubmit={handleSubmit(handleCreateLocation)}
          className="row g-3 needs-validation"
        >
          <Modal.Body>
            <Card>
              <Card.Body>
                <Col lg={12} md={12}>
                  <FormGroup>
                    <label htmlFor="name">
                      Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </FormGroup>
                </Col>
                <br />
                <Col lg={12} md={12}>
                  <FormGroup>
                    <label htmlFor="description">
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={description}
                      onChange={(e) => setLocationDescription(e.target.value)}
                      className="form-control"
                      required
                    />
                  </FormGroup>
                </Col>
              </Card.Body>
            </Card>

            <Modal.Footer>
              <Button variant="danger" onClick={handleModalClose}>
                Close
              </Button>
              <Button
                style={{ backgroundColor: "#0A7E51", borderColor: "#0A7E51" }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Save"}
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </CForm>
      </Modal>
    </div>
  );
}
