import React from "react";
import { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import { ErrorAlert, SuccessAlert } from "../Toast/toast";
import Loader from "../Loader/loader";
import "./assign.css";

export const CreateLocation = ({ datas, getAllData }) => {
    const { user } = useContext(Context);
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [idToDelete, setIdToDelete] = useState("");
    const [nameToDelete, setnameToDelete] = useState("");

    const [newLocation, setNewLocation] = useState({
        location_id: "",
        name: "",
        description: "",
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

    const onEdit = (row) => {
        console.log("location to edit", row);
        setNewLocation({
            location_id: row.id,
            name: row.name,
            description: row.description,
        });
        setOpen(true);
    };

    const handleEdit = async () => {
        setLoading(true);
        console.log("Updating location with ID:", newLocation.location_id);
        console.log("Data being sent:", newLocation);
        
        try {
            const res = await endpoint.put(`/location/updateLocation/${newLocation.location_id}`, newLocation);
            console.log("Update successful:", res.data);
            SuccessAlert(res.data.message || "Location updated successfully!");
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

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await endpoint.delete(`/location/deleteLocation/${idToDelete}`);
            console.log(res.data);
            SuccessAlert(res.data.message || "Location deleted successfully!");
            setLoading(false);
            setDeleteOpen(false);
            getAllData();
        } catch (err) {
            setLoading(false);
            ErrorAlert(err.response?.data?.message || err.response?.data?.description || "Failed to delete location");
        }
    };

    const reset = () => {
        setNewLocation({
            location_id: "",
            name: "",
            description: "",
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
            cell: (row, index) => index + 1 + (page - 1) * perPage,
            width: "10%",
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
            width: "30%",
            cell: (row) => <h6 className="fs-12 fw-semibold">{row.name}</h6>,
        },
        {
            name: "Description",
            selector: (row) => row.description,
            sortable: true,
            width: "40%",
            cell: (row) => <h6 className="fs-12 fw-semibold">{row.description}</h6>,
        },
        {
            name: "Actions",
            cell: (row) => (
                <Row>
                    <Col sm={6}>
                        <button
                            className="btn btn-sm"
                            onClick={() => onEdit(row)}
                            style={{backgroundColor: "#0A7E51", color: "#fff", borderColor: "#0A7E51"}}
                            title="Edit">
                            Edit
                        </button>
                    </Col>
                    <Col sm={6}>
                        <Button
                             className="btn btn-sm btn-danger"
                            onClick={(e) => {
                                onDelete(row);
                            }}
                            variant="danger"
                            title="Action"
                            size="sm">
                            Delete
                        </Button>
                    </Col>
                </Row>
            ),
        },
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
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handlePerRowsChange}
                            paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
                            paginationPerPage={perPage}
                            highlightOnHover
                        />

                        {/* Edit Modal */}
                        <Modal show={open} onHide={onClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Location</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="form-group mb-3">
                                        <label>
                                            Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newLocation.name}
                                            onChange={(e) =>
                                                setNewLocation({
                                                    ...newLocation,
                                                    name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>
                                            Description <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newLocation.description}
                                            onChange={(e) =>
                                                setNewLocation({
                                                    ...newLocation,
                                                    description: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={onClose}>
                                    Close
                                </Button>
                                <Button 
                                    variant="success" 
                                    onClick={handleEdit}
                                    style={{backgroundColor: "#0A7E51", borderColor: "#0A7E51"}}>
                                    Update
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        {/* Delete Modal */}
                        <Modal show={deleteOpen} onHide={onClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>
                                    Do you really want to delete{" "}
                                    <strong className="text-danger">'{nameToDelete}'</strong> location?
                                </p>
                                <p>This process cannot be undone.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
            </div>
        </>
    );
};