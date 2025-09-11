import React from "react";
import { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import { ErrorAlert, SuccessAlert } from "../Toast/toast";
import Loader from "../Loader/loader";
import "./assign.css";

export const CreateFile = ({ datas, getAllData }) => {
    const { user } = useContext(Context);
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [idToDelete, setIdToDelete] = useState("");
    const [nameToDelete, setnameToDelete] = useState("");

    const [newFile, setNewFile] = useState({
        file_id: "",
        file_Name: "",
        description: "",
        file_Number: "",
        process_Number: "",
        page_Number: "",
        parties: "",
    });

    useEffect(() => {
        setData(datas);
    }, [datas]);

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    };

    // Function to download QR code
    const downloadQRCode = (qrCodeUrl, fileName) => {
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        
        // Extract the filename from the URL or use a default name
        const urlParts = qrCodeUrl.split('/');
        const qrFileName = urlParts[urlParts.length - 1];
        
        // Set the download attribute with a proper filename
        link.setAttribute('download', fileName ? `${fileName}_qrcode.png` : qrFileName);
        
        // Append to the document
        document.body.appendChild(link);
        
        // Trigger the download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
    };

    const onEdit = (row) => {
        console.log("file to edit", row);
        setNewFile({
            file_id: row.id,
            file_Name: row.file_Name,
            description: row.description,
            file_Number: row.file_Number,
            process_Number: row.process_Number,
            page_Number: row.page_Number,
            parties: row.parties,
        });
        setOpen(true);
    };

    const handleEdit = async () => {
        setLoading(true);
        console.log("Updating file with ID:", newFile.file_id);
        console.log("Data being sent:", newFile);
        
        try {
            const res = await endpoint.put(`/file/update/${newFile.file_id}`, newFile);
            console.log("Update successful:", res.data);
            SuccessAlert(res.data.message || "File updated successfully!");
            setLoading(false);
            setOpen(false);
            getAllData();
        } catch (err) {
            console.error("Update error:", err.response);
            ErrorAlert(err.response?.data?.message || err.response?.data?.description || "Failed to update location");
            setLoading(false);
        }
    };

    const onDelete = (row) => {
        setOpen(false);
        setIdToDelete(row.id);
        setnameToDelete(row.name);
        setDeleteOpen(true);
    };

    const reset = () => {
        setNewFile({
             file_id: "",
            file_Name: "",
            description: "",
            file_Number: "",
            process_Number: "",
            page_Number: "",
            parties: "",
        });
    };

    const onClose = () => {
        reset();
        setOpen(false);
        setDeleteOpen(false);
    };

    const columns = [
    {
        name: "S/N",
        sortable: false,
        width: "60px",
        center: true,
        cell: (row, index) => index + 1,
    },
    {
        name: "File Name",
        selector: (row) => row.file_Name,
        sortable: true,
        width: "215px",
        cell: (row) => <h6 className="fs-12 fw-semibold">{row.file_Name}</h6>,
    },
    {
        name: "File Number",
        selector: (row) => row.file_Number,
        sortable: true,
        width: "130px",
        cell: (row) => <h6 className="fs-12 fw-semibold">{row.file_Number}</h6>,
    },
    // {
    //     name: "Page Number",
    //     selector: (row) => row.page_Number,
    //     sortable: true,
    //     width: "150px",
    //     cell: (row) => <h6 className="fs-12 fw-semibold">{row.page_Number}</h6>,
    // },
    {
        name: "Description",
        selector: (row) => row.description,
        sortable: true,
        width: "170px",
        cell: (row) => <h6 className="fs-12 fw-semibold">{row.description}</h6>,
    },
    {
        name: "QRCode",
        selector: (row) => row.qr_Code_Url,
        sortable: true,
        width: "110px",
        cell: (row) => (
            <h6 className="fs-12 fw-semibold"> 
                {row.qr_Code_Url ? (
                    <button 
                        className="btn btn-sm mt-2" 
                        style={{backgroundColor: "#525368", color: "#fff", borderColor: "#525368"}}
                         onClick={() => window.open(row.qr_Code_Url, '_blank')}
                        title="Download QR Code"
                        target="_blank"
                    >
                        <i className="fa fa-download me-1"></i>
                        QRCode
                    </button>
                ) : (
                    <span className="text-muted">No QR</span>
                )}
            </h6>
        ),
    },
    
    {
        name: "Actions",
        cell: (row) => (
            <div className="d-flex flex-nowrap gap-1">
                <button
                    className="btn btn-sm"
                    onClick={() => onEdit(row)}
                    style={{backgroundColor: "#0A7E51", color: "#fff", borderColor: "#0A7E51"}}
                    title="Edit">
                    Edit
                </button>
                <button
                    className="btn btn-sm"
                    style={{backgroundColor: "#0d0c22", color: "#fff", borderColor: "#0d0c22"}}
                    title="Forward">
                    Forward
                </button>
                <Button
                    className="btn btn-sm btn-danger"
                    variant="danger"
                    title="Action"
                    size="sm">
                    Reject
                </Button>
            </div>
        ),
    }
    ];

    return (
        <>
            {isLoading && <Loader />}
            <div>
                <Row>
                    <Col md={12}>
                        <DataTable
                            columns={columns}
                            data={data}
                            defaultSortField="id"
                            defaultSortAsc={false}
                            striped={true}
                            center={true}
                            pagination
                            paginationComponentOptions={{
                                noRowsPerPage: true 
                            }}
                            onChangePage={handlePageChange}
                            highlightOnHover
                        />

                       {/* Edit Modal */}
                        <Modal show={open} onHide={onClose} className="file-modal-wrapper" centered>
                            <Modal.Header closeButton className="file-modal-header">
                                <Modal.Title className="file-modal-title">Edit File</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="file-modal-body">
                                <form className="file-form-wrapper">
                                    <Row>
                                        <Col md={6}>
                                            <div className="file-form-group mb-3">
                                                <label className="file-form-label">
                                                    File Name <span className="file-required-asterisk">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control file-form-control"
                                                    value={newFile.file_Name}
                                                    onChange={(e) =>
                                                        setNewFile({
                                                            ...newFile,
                                                            file_Name: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="file-form-group mb-3">
                                                <label className="file-form-label">
                                                    Process Number <span className="file-required-asterisk">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control file-form-control"
                                                    value={newFile.process_Number}
                                                    onChange={(e) =>
                                                        setNewFile({
                                                            ...newFile,
                                                            process_Number: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <div className="file-form-group mb-3">
                                                <label className="file-form-label">
                                                    File Number <span className="file-required-asterisk">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control file-form-control"
                                                    value={newFile.file_Number}
                                                    onChange={(e) =>
                                                        setNewFile({
                                                            ...newFile,
                                                            file_Number: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="file-form-group mb-3">
                                                <label className="file-form-label">
                                                    Page Number <span className="file-required-asterisk">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control file-form-control"
                                                    value={newFile.page_Number}
                                                    onChange={(e) =>
                                                        setNewFile({
                                                            ...newFile,
                                                            page_Number: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                    <Row>
                                        <Col md={12}>
                                            <div className="file-form-group mb-3">
                                                <label className="file-form-label">
                                                    Description <span className="file-required-asterisk">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control file-form-control"
                                                    value={newFile.description}
                                                    onChange={(e) =>
                                                        setNewFile({
                                                            ...newFile,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                    <Row>
                                        <Col md={12}>
                                            <div className="file-form-group mb-3">
                                                <label className="file-form-label">
                                                    Parties <span className="file-required-asterisk">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control file-form-control"
                                                    value={newFile.parties}
                                                    onChange={(e) =>
                                                        setNewFile({
                                                            ...newFile,
                                                            parties: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            </Modal.Body>
                            <Modal.Footer className="file-modal-footer">
                                <Button variant="secondary" onClick={onClose} className="file-btn-cancel">
                                    Close
                                </Button>
                                <Button 
                                    className="file-btn-update"
                                    onClick={handleEdit}
                                    disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update File"
                                    )}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
            </div>
            
        </>
    );
};