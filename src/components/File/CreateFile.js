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
import * as file from "../../data/file/createFile";
import { CForm } from "@coreui/react";
import { useForm } from "react-hook-form";
import endpoint from "../../context/endpoint";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import "./filestyle.css";

export default function CreateFile() {
  const { register, handleSubmit, reset: resetFormHook } = useForm();

  const [isLoading, setLoading] = useState(false);
  const [fileModal, setShowFileModal] = useState(false);
  const [fileModalHeading, setFileModalHeading] = useState("");
  const [file_Name, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [file_Number, setFileNumber] = useState("");
  const [process_Number, setProcessNumber] = useState("");
  const [page_Number, setPageNumber] = useState("");
  const [parties, setParties] = useState("");
  const [location_id, setLocationId] = useState(""); // Add state for location
  const [datas, setDatas] = useState([]);
  const [locations, setLocation] = useState([]);

  const handleFileModal = () => {
    setShowFileModal(true);
    setFileModalHeading("Add New File");
  };

  const handleCreateFile = async () => {
    setLoading(true);

    const data = new FormData();
    data.append("file_Name", file_Name);
    data.append("description", description);
    data.append("file_Number", file_Number);
    data.append("process_Number", process_Number);
    data.append("page_Number", page_Number);
    data.append("parties", parties);
    data.append("location_id", location_id);

    try {
      const res = await endpoint.post(`/file/createfile/`, data);

      if (res.data.message) {
        SuccessAlert(res.data.message);
      } else {
        SuccessAlert("File created successfully!");
      }

      setShowFileModal(false);
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
        "Failed to create file";
      ErrorAlert(errorMessage);
    }
  };

  const getAllData = async () => {
    try {
      const res = await endpoint.get(`/file/all-files`);
      console.log("all files", res.data.data);
      setDatas(res.data.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const getLocations = async () => {
    try {
      const res = await endpoint.get(`/location/getAllLocations`);
      console.log("all locations", res.data.data);
      setLocation(res.data.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    getAllData();
    getLocations();
  }, []);

  const resetForm = () => {
    setFileName("");
    setDescription("");
    setFileNumber("");
    setProcessNumber("");
    setPageNumber("");
    setParties("");
    setLocationId(""); // Reset location ID
    resetFormHook();
  };

  const handleModalClose = () => {
    setShowFileModal(false);
    resetForm();
  };

  return (
    <div>
      <Row>
        <Col sm={12} className="col-12">
          <Card className="elegant-card">
            <Card.Header className="card-header-custom">
              <Col className="text-beginning">
                <Card.Title as="h3" className="card-title-custom">
                  FILES
                </Card.Title>
              </Col>
              <Col className="text-end">
                <Button
                  className="btn btn-add-file"
                  type="button"
                  variant=""
                  onClick={(e) => {
                    handleFileModal();
                  }}
                >
                  <span className="fa fa-plus"></span>
                  Add File
                </Button>
              </Col>
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                  <file.CreateFile datas={datas} getAllData={getAllData} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={fileModal}
        onHide={handleModalClose}
        className="custom-modal"
        centered
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            {fileModalHeading}
          </Modal.Title>
        </Modal.Header>
        <CForm
          onSubmit={handleSubmit(handleCreateFile)}
          className="custom-form"
        >
          <Modal.Body className="modal-body-custom">
            <Card className="form-card">
              <Card.Body className="form-card-body">
                <Row className="justify-content-center">
                  <Col xl={10} lg={10} md={10} sm={12}>
                    <Row>
                      <Col lg={6} md={6}>
                        <FormGroup className="form-group-custom mb-3">
                          <label htmlFor="name" className="form-label-custom">
                            File Name{" "}
                            <span className="required-asterisk">*</span>
                          </label>
                          <Form.Control
                            type="text"
                            name="file_Name"
                            value={file_Name}
                            onChange={(e) => setFileName(e.target.value)}
                            className="form-control-custom"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6} md={6}>
                        <FormGroup className="form-group-custom mb-3">
                          <label htmlFor="name" className="form-label-custom">
                            Appeal Number{" "}
                            <span className="required-asterisk">*</span>
                          </label>
                          <Form.Control
                            type="text"
                            name="file_Number"
                            value={file_Number}
                            onChange={(e) => setFileNumber(e.target.value)}
                            className="form-control-custom"
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={6} md={6}>
                        <FormGroup className="form-group-custom mb-3">
                          <label htmlFor="name" className="form-label-custom">
                            Number of Processes {" "}
                            <span className="required-asterisk">*</span>
                          </label>
                          <Form.Control
                            type="text"
                            name="process_Number"
                            value={process_Number}
                            onChange={(e) => setProcessNumber(e.target.value)}
                            className="form-control-custom"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6} md={6}>
                        <FormGroup className="form-group-custom mb-3">
                          <label htmlFor="name" className="form-label-custom">
                            Number of Pages {" "}
                            <span className="required-asterisk">*</span>
                          </label>
                          <Form.Control
                            type="text"
                            name="page_Number"
                            value={page_Number}
                            onChange={(e) => setPageNumber(e.target.value)}
                            className="form-control-custom"
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={12} md={12}>
                        <FormGroup className="form-group-custom mb-3">
                          <label htmlFor="name" className="form-label-custom">
                            Current Location
                            <span className="required-asterisk">*</span>
                          </label>
                          <Form.Select
                            name="location_id"
                            value={location_id}
                            onChange={(e) => setLocationId(e.target.value)}
                            className="form-control-custom"
                            required
                            style={{ height: "45px" }}
                          >
                            <option value="" disabled>
                              -- Select Location --
                            </option>
                            {locations.map((location) => (
                              <option key={location.id} value={location.id}>
                                {location.name}
                              </option>
                            ))}
                          </Form.Select>
                            {location_id && (
                              <div className="mt-2 p-2 bg-light rounded">
                                <small className="text-muted">
                                  <strong>Description:</strong> {
                                    locations.find(loc => loc.id === parseInt(location_id))?.description
                                  }
                                </small>
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12}>
                        <FormGroup className="form-group-custom mb-3">
                          <label htmlFor="name" className="form-label-custom">
                            Parties <span className="required-asterisk">*</span>
                          </label>
                          <Form.Control
                            type="text"
                            name="parties"
                            value={parties}
                            onChange={(e) => setParties(e.target.value)}
                            className="form-control-custom"
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12}>
                        <FormGroup className="form-group-custom mb-3">
                          <label htmlFor="name" className="form-label-custom">
                            Description{" "}
                            <span className="required-asterisk">*</span>
                          </label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control-custom"
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Modal.Footer className="modal-footer-custom">
              <Button
                variant="secondary"
                onClick={handleModalClose}
                className="btn-cancel"
              >
                Close
              </Button>
              <Button
                variant="success"
                className="btn-save"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Creating...
                  </>
                ) : (
                  "Save File"
                )}
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </CForm>
      </Modal>
    </div>
  );
}
