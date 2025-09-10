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
import * as file from "../../data/file/createFile"
import { CForm } from "@coreui/react";
import { useForm } from "react-hook-form";
import endpoint from "../../context/endpoint"
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast"

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
    const [datas, setDatas] = useState([]);

    // Show location modal
    const handleFileModal = () => {
        setShowFileModal(true);
        setFileModalHeading("Add New File");
    };

    // Create location
    const handleCreateFile = async () => {
        setLoading(true);
        
        // Create form data
        const data = new FormData();
        data.append("file_Name", file_Name);
        data.append("description", description);
        data.append("file_Number", file_Number);
        data.append("process_Number", process_Number);
        data.append("page_Number", page_Number);
        data.append("parties", parties);

        try {
            const res = await endpoint.post(`/file/createfile/`, data);
            
            // Check if response has message
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
            
            const errorMessage = error.response?.data?.message || 
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

    useEffect(() => {
        getAllData();
    }, []);

    const resetForm = () => {
        setFileName("");
        setDescription("");
        setFileNumber("");
        setProcessNumber("");
        setPageNumber("");
        setParties("");
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
                    <Card>
                        <Card.Header>
                            <Col className="text-beginning">
                                <Card.Title as="h3" style={{ color: "#0A7E51", fontWeight: 900 }}>
                                    FILES
                                </Card.Title>
                            </Col>
                            <Col className="text-end">
                                <Button
                                    className="btn btn-sm" 
                                    type="button" 
                                    variant=""
                                    onClick={(e) => {
                                        handleFileModal();
                                    }}
                                    style={{ 
                                        backgroundColor: "#0A7E51", 
                                        borderColor: "#0A7E51",
                                        color: "white", 
                                        fontWeight: 900 
                                    }}>
                                    <span className="fa fa-plus"></span>
                                    Add File
                                </Button>
                            </Col>
                        </Card.Header>
                        <Card.Body>
                            <div className="">
                                <div className="">
                                    <file.CreateFile
                                        datas={datas}
                                        getAllData={getAllData}
                                    />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={fileModal} onHide={handleModalClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{fileModalHeading}</Modal.Title>
                </Modal.Header>
                <CForm onSubmit={handleSubmit(handleCreateFile)} className="row g-3 needs-validation">
                    <Modal.Body>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col lg={6} md={6}>
                                        <FormGroup className="mb-3">
                                            <label htmlFor="name">
                                                File Name <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Form.Control
                                                type="text"
                                                name="file_Name"
                                                value={file_Name}
                                                onChange={(e) => setFileName(e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={6} md={6}>
                                        <FormGroup className="mb-3">
                                            <label htmlFor="name">
                                                File Number <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Form.Control
                                                type="text"
                                                name="file_Number"
                                                value={file_Number}
                                                onChange={(e) => setFileNumber(e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col lg={6} md={6}>
                                        <FormGroup className="mb-3">
                                            <label htmlFor="name">
                                                Process Number <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Form.Control
                                                type="text"
                                                name="process_Number"
                                                value={process_Number}
                                                onChange={(e) => setProcessNumber(e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={6} md={6}>
                                        <FormGroup className="mb-3">
                                            <label htmlFor="name">
                                                Page Number <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Form.Control
                                                type="text"
                                                name="page_Number"
                                                value={page_Number}
                                                onChange={(e) => setPageNumber(e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col lg={12} md={12}>
                                        <FormGroup className="mb-3">
                                            <label htmlFor="name">
                                                Description <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Form.Control
                                                type="text"
                                                name="description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col lg={12} md={12}>
                                        <FormGroup className="mb-3">
                                            <label htmlFor="description">
                                                Parties <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Form.Control
                                                type="text"
                                                name="parties"
                                                value={parties}
                                                onChange={(e) => setParties(e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleModalClose}>
                                Close
                            </Button>
                            <Button
                                variant="success"
                                style={{backgroundColor: "#0A7E51", borderColor: "#0A7E51"}}
                                type="submit"
                                disabled={isLoading}>
                                {isLoading ? "Creating..." : "Save"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>
                </CForm>
            </Modal>
        </div>
    );
}