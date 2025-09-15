import React from "react";
import { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Modal, Button, Form } from "react-bootstrap";
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
    const [rejectOpen, setRejectOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [idToReject, setIdToReject] = useState("");
    const [nameToReject, setnameToReject] = useState("");
    const [rejectRemark, setRejectRemark] = useState(""); // New state for reject remark
    const [usersList, setUsersList] = useState([]);
    const [departmentsList, setDepartmentsList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [filteredUnits, setFilteredUnits] = useState([]);

    const [newFile, setNewFile] = useState({
        file_id: "",
        file_Name: "",
        description: "",
        file_Number: "",
        process_Number: "",
        page_Number: "",
        parties: "",
    });
    const [forwardData, setForwardData] = useState({
        loginUser: user?.id,
        to_user_id: "",

        remark: "",
    });

    const handlePageChange = (page) => {
        setPage(page);
    };

  useEffect(() => {
    setData(datas);
  }, [datas]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await endpoint.get("/user/list");
        setUsersList(usersRes.data.data);
        console.log("Users fetched:", usersRes.data.data);

        // Fetch departments
        const deptRes = await endpoint.get("/department/get-all-departments");
        setDepartmentsList(deptRes.data.data);
      } catch (err) {
        console.error("Error fetching users or departments:", err);
      }
    };

    fetchData();
  }, []);

  const handleDrawerOpen = (file) => {
    setSelectedFile(file);
    setForwardData({ ...forwardData, loginUser: user?.id });
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setForwardData({
      loginUser: user?.id,
      to_user_id: "",

      remark: "",
    });
    setFilteredUnits([]);
  };

  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setForwardData({ ...forwardData, department_id: deptId, unit_id: "" });

    const units =
      departmentsList.find((d) => d.id === parseInt(deptId))?.units || [];
    setFilteredUnits(units);
  };

   const handleForwardSubmit = async () => {
    if (!forwardData.user_id) {
      return ErrorAlert("Please select a user");
    }

    if (!selectedFile?.id) {
      return ErrorAlert("File ID is missing");
    }

    setLoading(true);
    try {
      const payload = {
        file_id: selectedFile.id, // required
        from_user_id: forwardData.loginUser, // 👈 logged-in user
        to_user_id: forwardData.user_id, // 👈 recipient
        remark: forwardData.remark || "",
      };

      console.log("Submitting payload:", payload); // debug

      const res = await endpoint.post(
        `/file-track/create-file-tracking`,
        payload
      );

      SuccessAlert(res.data.message || "File forwarded successfully!");
      getAllData(); // refresh after forwarding
      handleDrawerClose();
    } catch (err) {
      console.error("Forward error:", err.response?.data || err);
      ErrorAlert(err.response?.data?.message || "Forward failed!");
    } finally {
      setLoading(false);
    }
  };

  

    // Function to open QR code in new tab
    const openQRCodeInNewTab = (qrCodeUrl) => {
        window.open(qrCodeUrl, '_blank', 'noopener,noreferrer');
    };

    // Function to download QR code
    // const downloadQRCode = (qrCodeUrl, fileName) => {
    //     // Create a temporary anchor element
    //     const link = document.createElement('a');
    //     link.href = qrCodeUrl;
        
    //     // Set the download attribute with a proper filename
    //     link.setAttribute('download', fileName ? `${fileName}_qrcode.png` : 'qrcode.png');
        
    //     // Append to the document
    //     document.body.appendChild(link);
        
    //     // Trigger the download
    //     link.click();
        
    //     // Clean up
    //     document.body.removeChild(link);
    // };

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

    // const onReject = (row) => {
    //     setOpen(false);
    //     setIdToReject(row.id);
    //     setnameToReject(row.file_Name);
    //     setRejectOpen(true);
    // };

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
        setRejectRemark(""); // Reset reject remark when closing modal
    };

    const onClose = () => {
        reset();
        setOpen(false);
        setRejectOpen(false);
    };

    // Handle reject action
    const handleReject = async () => {
        setLoading(true);
        try {
            // Add your reject API call here
            await endpoint.post(`/file/reject-file-tracking/${idToReject}`, { remark: rejectRemark });
            
            SuccessAlert(`File "${nameToReject}" has been rejected successfully!`);
            setLoading(false);
            setRejectOpen(false);
            getAllData();
            setRejectRemark(""); // Reset remark after successful rejection
        } catch (err) {
            console.error("Reject error:", err.response);
            ErrorAlert(err.response?.data?.message || "Failed to reject file");
            setLoading(false);
        }
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
        width: "200px",
        cell: (row) => <h6 className="fs-12 fw-semibold">{row.file_Name}</h6>,
    },
    {
        name: "File Number",
        selector: (row) => row.file_Number,
        sortable: true,
        width: "130px",
        cell: (row) => <h6 className="fs-12 fw-semibold">{row.file_Number}</h6>,
    },
    {
        name: "Description",
        selector: (row) => row.description,
        sortable: true,
        width: "220px",
        cell: (row) => <h6 className="fs-12 fw-semibold">{row.description}</h6>,
    },
    {
        name: "QRCode",
        selector: (row) => row.qr_Code_Url,
        sortable: true,
        width: "105px",
        cell: (row) => (
            <div className="d-flex flex-column align-items-center">
                {row.qr_Code_Url ? (
                    <>
                        <img 
                            src={row.qr_Code_Url} 
                            alt="QR Code" 
                            className="qr-code-image mb-1"
                            style={{ 
                                width: "70px", 
                                height: "70px",
                                objectFit: "contain",
                                cursor: "pointer"
                            }}
                            onClick={() => openQRCodeInNewTab(row.qr_Code_Url)}
                            title="Click to view QR code in new tab"
                        />
                       
                    </>
                ) : (
                    <span className="text-muted">No QR</span>
                )}
            </div>
        ),
    },
    
    {
        name: "Actions",
        width: "180px",
        cell: (row) => (
            <div className="d-flex flex-nowrap gap-1">
                <button
                    className="btn btn-sm"
                    onClick={() => onEdit(row)}
                    style={{backgroundColor: "#0A7E51", color: "#fff", borderColor: "#0A7E51"}}
                    title="Edit">
                    <i className="fa fa-edit me-1"></i>
                    Edit
                </button>
                {/* {row.status === 1 && ( */}
                    <button
                        onClick={() => handleDrawerOpen(row)}
                        className="btn btn-sm"
                        style={{backgroundColor: "#0d0c22", color: "#fff", borderColor: "#0d0c22"}}
                        title="Forward">
                        <i className="fa fa-forward me-1"></i>
                        Forward
                    </button>
                 {/* )} */}
                {/* <Button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                        onReject(row);
                    }}
                    variant="danger"
                    title="Reject"
                    size="sm">
                    <i className="fa fa-times me-1"></i>
                    Reject
                </Button> */}
            </div>
        ),
    }
]
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

                        {/* Reject Modal */}
                        <Modal show={rejectOpen} onHide={onClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Reject File</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>
                                    Do you really want to reject{" "}
                                    <strong className="text-danger">'{nameToReject}'</strong> file?
                                </p>
                                <p>This process cannot be undone.</p>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Reason for rejection (optional)
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Optionally provide a reason for rejecting this file..."
                                        value={rejectRemark}
                                        onChange={(e) => setRejectRemark(e.target.value)}
                                    />
                                    
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button 
                                    variant="danger" 
                                    onClick={handleReject}
                                >
                                    Reject File
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        {/* Forword Modal */}
                        <Modal
                            show={openDrawer}
                            onHide={handleDrawerClose}
                            className="file-modal-wrapper"
                            centered
                        >
                        <Modal.Header closeButton className="file-modal-header">
                            <Modal.Title className="file-modal-title">
                            Forward File
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="file-modal-body">
                            {/* Hidden loginUser */}
                            <input type="hidden" value={forwardData.loginUser} />

                            {/* User Select */}

                            <Form.Group className="mb-3">
                            <Form.Label>User</Form.Label>
                            <Form.Select
                                value={forwardData.user_id || ""}
                                onChange={(e) =>
                                setForwardData({
                                    ...forwardData,
                                    user_id: e.target.value,
                                })
                                }
                            >
                                <option value="" disabled hidden>
                                -- Select User --
                                </option>
                                {usersList.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {`${u.surname} ${u.first_name}${
                                    u.middle_name ? ` ${u.middle_name}` : ""
                                    }`}
                                </option>
                                ))}
                            </Form.Select>
                            </Form.Group>

                            {/* Remark */}
                            <Form.Group className="mb-3">
                            <Form.Label>Remark</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={forwardData.remark}
                                onChange={(e) =>
                                setForwardData({ ...forwardData, remark: e.target.value })
                                }
                            />
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer className="file-modal-footer">
                            <Button
                            variant="danger"
                            className="file-btn-cancel"
                            onClick={handleDrawerClose}
                            >
                            Close
                            </Button>
                            <Button
                            variant="success"
                            className="file-btn-update"
                            onClick={handleForwardSubmit}
                            >
                            Forward
                            </Button>
                        </Modal.Footer>
                        </Modal>

                    </Col>
                </Row>
            </div>
        </>
    );
};
