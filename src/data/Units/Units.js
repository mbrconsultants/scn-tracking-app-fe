import React, { useState, useContext, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import moment from "moment";
import Loader from "../Loader/loader";
import { Modal, FormGroup, Form } from "react-bootstrap";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import { useForm } from "react-hook-form";
import {
  CForm,
  CCol,
  CFormLabel,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CFormCheck,
} from "@coreui/react";

import {
  DropdownButton,
  ButtonGroup,
  Card,
  Button,
  Row,
  Col,
  InputGroup,
  Dropdown,
} from "react-bootstrap";

export const Units = ({ refreshKey }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const [data, setUnitsList] = useState([]);
  const [roles, setUsersRoles] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // const [value, setValue] = useState({
  //   fullname: "",
  //   email: "",
  //   password: "",
  //   role_id: "",
  // });
  const [value, setValue] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    getUnitsList();
    getUsersroles();
  }, [refreshKey]);

  //get users
  const getUnitsList = async () => {
    setLoading(true);
    await endpoint
      .get("/unit/get-all-units")
      .then((res) => {
        setUnitsList(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        // console.log(err)
      });
  };

  const getUsersroles = async () => {
    setLoading(true);
    await endpoint
      .get("/role/getroles")
      .then((res) => {
        setUsersRoles(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        // console.log(err)
      });
  };

  // const deleteUnit = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this unit?")) return;

  //   try {
  //     await endpoint.delete(`/unit/delete-unit-by-id/${id}`);
  //     SuccessAlert("Unit deleted successfully!");
  //     getUnitsList(); // refresh list
  //   } catch (err) {
  //     console.error(err);
  //     ErrorAlert(err.response?.data?.message || "Failed to delete unit");
  //   }
  // };

  const handleDeleteUnit = async (id) => {
    try {
      await endpoint.delete(`/unit/delete-unit-by-id/${id}`);
      SuccessAlert("Unit deleted successfully!");
      getUnitsList(); // refresh list
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      ErrorAlert(err.response?.data?.message || "Failed to delete unit");
    }
  };

  const modifyUser = async (data) => {
    await endpoint
      .put(`/unit/update-unit-by-id/${value.id}`, value)
      .then((res) => {
        setLoading(false);
        SuccessAlert(res.data.message);
        getUnitsList();
        setShowEditModal(false);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          ErrorAlert(error.response.data.description);
        }
      });
  };
  // const handleShowEditModal = (row) => {
  //   setValue(row);
  //   setShowEditModal(true);
  //   // console.log("user:",row);
  //   reset();
  // };

  const handleShowEditModal = (row) => {
    setValue({ id: row.id, name: row.name });
    setShowEditModal(true);
    reset();
  };

  const columns = [
    {
      name: "S/N.",
      cell: (row, index) => index + 1,
      width: "80px",
    },

    {
      name: "NAME",
      selector: (row) => [row.name],

      style: { textAlign: "right" },
      sortable: true,

      width: "400px",
      cell: (row) => (
        <div className="fs-12 fw-bold ">
          {row.name !== null ? row.name : ""}{" "}
        </div>
      ),
    },
    // {
    //   name: "Email",
    //   selector: (row) => [row.email],

    //   style: { textAlign: "right" },
    //   sortable: true,

    //   width: "400px",
    //   cell: (row) => (
    //     <div className="fs-12 fw-bold ">
    //       {row.email !== null ? row.email : ""}
    //     </div>
    //   ),
    // },
    // {
    //   name: "PHONE",
    //   selector: (row) => [row.phone],

    //   style: { textAlign: "right" },
    //   sortable: true,

    //   width: "200px",
    //   cell: (row) => (
    //     <div className="fs-12 fw-bold ">
    //       {row.phone !== null ? row.phone : ""}
    //     </div>
    //   ),
    // },

    {
      name: "Action",
      style: { textAlign: "right" },
      // width: "120px",
      cell: (row) => (
        <div className="fs-12 fw-bold ">
          <button
            className="btn btn-warning btn-sm my-1 me-2"
            variant="warning"
            onClick={() => handleShowEditModal(row)}
          >
            <span className="fe fe-edit"> </span>
          </button>

          {/* <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteUnit(row.id)}
          >
            <span className="fe fe-trash"></span>
          </button> */}
          <button
            className="btn btn-danger btn-sm my-1 ms-2"
            variant="danger"
            onClick={() => {
              setDeleteId(row.id);
              setShowDeleteModal(true);
            }}
          >
            <span className="fe fe-trash"></span>
          </button>
        </div>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };

  return (
    <>
      {
        <DataTableExtensions {...tableDatas}>
          {isLoading ? (
            <Loader />
          ) : (
            <DataTable
              fixedHeader
              columns={columns}
              // selectableRows
              data={data}
              // customStyles={customStyles}
              persistTableHead
              defaultSortField="id"
              defaultSortAsc={false}
              striped={true}
              center={true}
              pagination
              // paginationServer
              // paginationTotalRows={totalRows}
              // onChangePage={handlePageChange}
              // onChangeRowsPerPage={handlePerRowsChange}
              paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
              // onChangeRowsPerPage(currentRowsPerPage, currentPage)
              // paginationPerPage={perPage}
              highlightOnHover
            />
          )}
        </DataTableExtensions>
      }

      <Modal show={showEditModal}>
        <Modal.Header style={{ backgroundColor: "#0a7148", color: "#fff" }}>
          <Card.Title as="h3" style={{ color: "#fff" }}>
            Edit Unit
          </Card.Title>
          <Button
            onClick={() => setShowEditModal(false)}
            className="btn-close"
            variant=""
          >
            x
          </Button>
        </Modal.Header>
        <CForm
          onSubmit={handleSubmit(modifyUser)}
          className="row g-3 needs-validation"
        >
          <Modal.Body>
            <Card>
              {/* <Card.Header>
                <Card.Title as="h3" style={{ color: "#fff" }}>
                  Edit Unit
                </Card.Title>
              </Card.Header> */}
              <Card.Body>
                <Col lg={12} md={12}>
                  <FormGroup>
                    <label htmlFor="unitName">Unit Name</label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={value.name}
                      onChange={(e) => {
                        setValue({ ...value, name: e.target.value });
                      }}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              className="me-1"
              onClick={() => setShowEditModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" type="submit" className="me-1">
              Save
            </Button>
          </Modal.Footer>
        </CForm>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: "#d62640" }}>
          <Modal.Title style={{ color: "#fff" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center text-bold">
          Are you sure you want to delete this unit?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteUnit(deleteId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
