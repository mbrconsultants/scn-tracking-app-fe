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
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
           <Card.Header className="py-3" style={{ 
              backgroundColor: '#f8f9fa', 
              borderBottom: '2px solid #0A7E51',
              borderTopLeftRadius: '15px',
              borderTopRightRadius: '15px'
            }}>
              <Row className="align-items-center">
                <Col>
                  <Card.Title
                    as="h3"
                    style={{ color: "#0A7E51", fontWeight: 'bold', margin: 0 }}
                  >
                    <i className="fas fa-map-marker-alt me-2"></i>
                    LOCATION SETUP
                  </Card.Title>
                </Col>
                <Col className="text-end">
                  <Button
                    className="btn"
                    type="button"
                    variant=""
                    onClick={handleAppellantModal}
                    style={{
                      backgroundColor: "#0A7E51",
                      borderColor: "#0A7E51",
                      color: "white",
                      fontWeight: '600',
                      borderRadius: '8px',
                      padding: '8px 16px'
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add Location
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body style={{ backgroundColor: '#fafafa' }}>
              <div className="location-table-container">
                <div className="table-responsive">
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

      <Modal show={locationModal} onHide={handleModalClose} centered>
        <Modal.Header
          closeButton
          style={{ 
            backgroundColor: "#0A7E51", 
            color: "#fff",
            borderBottom: '3px solid #066a44'
          }}
        >
          <Modal.Title style={{ color: "#fff", fontWeight: '600' }}>
            <i className="fas fa-plus-circle me-2"></i>
            {locationModalHeading}
          </Modal.Title>
        </Modal.Header>
        <CForm
          onSubmit={handleSubmit(handleCreateLocation)}
          className="row g-3 needs-validation"
        >
          <Modal.Body style={{ padding: '20px' }}>
            <Card className="border-0 shadow-sm">
              <Card.Body style={{ padding: '20px' }}>
                <Row>
                  <Col lg={12} md={12}>
                    <FormGroup className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">
                        <i className="fas fa-tag me-2 text-primary"></i>
                        Name <span className="text-danger">*</span>
                      </label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setLocationName(e.target.value)}
                        className="form-control form-control-lg"
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '12px'
                        }}
                        required
                        placeholder="Enter location name"
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col lg={12} md={12}>
                    <FormGroup className="mb-3">
                      <label htmlFor="description" className="form-label fw-semibold">
                        <i className="fas fa-align-left me-2 text-primary"></i>
                        Description <span className="text-danger">*</span>
                      </label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={description}
                        onChange={(e) => setLocationDescription(e.target.value)}
                        className="form-control"
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '12px',
                          resize: 'vertical'
                        }}
                        required
                        placeholder="Enter location description"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Modal.Footer style={{ 
              borderTop: '1px solid #e9ecef',
              padding: '20px',
              marginTop: '20px'
            }}>
              <Button 
                variant="outline-secondary" 
                onClick={handleModalClose}
                style={{
                  borderRadius: '8px',
                  padding: '8px 20px',
                  border: '2px solid #6c757d'
                }}
              >
                <i className="fas fa-times me-2"></i>
                Close
              </Button>
              <Button
                style={{ 
                  backgroundColor: "#0A7E51", 
                  borderColor: "#0A7E51",
                  borderRadius: '8px',
                  padding: '8px 25px',
                  fontWeight: '600'
                }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Save Location
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </CForm>
      </Modal>

      <style jsx>{`
        .location-table-container {
          background: white;
          border-radius: 10px;
          padding: 0;
        }
        .form-control:focus {
          border-color: #0A7E51;
          box-shadow: 0 0 0 0.2rem rgba(10, 126, 81, 0.25);
        }
        .btn:hover {
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}