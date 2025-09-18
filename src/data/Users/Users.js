import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import SignatureCanvas from "react-signature-canvas";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
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

export const Users = ({ refreshKey }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const [data, setUsersList] = useState([]);
  const [roles, setUsersRoles] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const sigPadRef = useRef(null);
  const fileInputRef = useRef(null);
  const [value, setValue] = useState({
    // fullname: "",
    surname: "",
    first_name: "",
    middle_name: "",
    email: "",
    password: "",
    role_id: "",
    department_id: "",
    unit_id: "",
    signature_url: "",
  });

  useEffect(() => {
    getUsersList();
    getUsersroles();
    getUnits();
    getDepartments();
  }, [refreshKey]);

  // const clearSignature = () => {
  //   sigPadRef.current.clear();
  //   setFormData({ ...formData, signature_drawn: null });
  // };

  const clearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
    }
    setValue((prev) => ({ ...prev, signature_url: "" }));
  };

  const getUsersList = async () => {
    setLoading(true);
    try {
      const res = await endpoint.get("/user/list");
      console.log("Users API response:", res.data);
      console.log("Users list:", res.data.data);

      const fixedData = res.data.data.map((user) => {
        let url = user.signature_url;
        if (url && !url.includes("/document/signatures/")) {
          url = url.replace("/signatures/", "/document/signatures/");
        }
        return { ...user, signature_url: url };
      });

      setUsersList(fixedData);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
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

  const getUnits = async () => {
    try {
      const res = await endpoint.get("/unit/get-all-units");
      setUnits(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getDepartments = async () => {
    try {
      const res = await endpoint.get("/department/get-all-departments");
      setDepartments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // const modifyUser = async () => {
  //   try {
  //     const data = new FormData();

  //     for (const key in value) {
  //       if (value[key]) {
  //         if (
  //           key === "signature_url" &&
  //           typeof value[key] === "string" &&
  //           value[key].startsWith("data:image")
  //         ) {
  //           // convert base64 string (drawn signature) to Blob
  //           const byteString = atob(value[key].split(",")[1]);
  //           const mimeString = value[key]
  //             .split(",")[0]
  //             .split(":")[1]
  //             .split(";")[0];
  //           const ab = new ArrayBuffer(byteString.length);
  //           const ia = new Uint8Array(ab);
  //           for (let i = 0; i < byteString.length; i++) {
  //             ia[i] = byteString.charCodeAt(i);
  //           }
  //           const blob = new Blob([ab], { type: mimeString });
  //           data.append("signature_url", blob, "signature.png");
  //         } else {
  //           data.append(key, value[key]);
  //         }
  //       }
  //     }

  //     const res = await endpoint.put(`/user/update/${value.id}`, data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     SuccessAlert(res.data.message);
  //     getUsersList();
  //     setShowEditModal(false);
  //   } catch (error) {
  //     if (error.response) {
  //       ErrorAlert(error.response.data.description);
  //     }
  //   }
  // };

  const modifyUser = async () => {
    try {
      const data = new FormData();

      for (const key in value) {
        if (value[key]) {
          if (
            key === "signature_url" &&
            typeof value[key] === "string" &&
            value[key].startsWith("data:image")
          ) {
            // convert base64 string to Blob (drawn signature)
            const byteString = atob(value[key].split(",")[1]);
            const mimeString = value[key]
              .split(",")[0]
              .split(":")[1]
              .split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            data.append("signature_url", blob, "signature.png");
          } else {
            // handles normal file upload or text fields
            data.append(key, value[key]);
          }
        }
      }

      const res = await endpoint.put(`/user/update/${value.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      SuccessAlert(res.data.message);
      getUsersList();
      setShowEditModal(false);
    } catch (error) {
      if (error.response) {
        ErrorAlert(error.response.data.description);
      }
    }
  };

  // 🔹 For text fields
  const handleChange = (e) => {
    const { name, value: val } = e.target;
    setValue((prev) => ({ ...prev, [name]: val }));
  };

  // 🔹 For file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue((prev) => ({ ...prev, signature_url: file }));
    }
  };

  // 🔹 For drawn signature
  const handleDrawSignature = (dataUrl) => {
    setValue((prev) => ({ ...prev, signature_url: dataUrl }));
  };

  const handleShowEditModal = (row) => {
    setValue({
      id: row.id,
      surname: row.surname || "",
      first_name: row.first_name || "",
      middle_name: row.middle_name || "",
      email: row.email || "",
      role_id: row.role_id || "",
      department_id: row.department_id || "",
      unit_id: row.unit_id || "",
      signature_url: row.signature_url || "",
    });
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
      selector: (row) =>
        `${row.surname ?? ""} ${row.first_name ?? ""}${
          row.middle_name ? " " + row.middle_name : ""
        }`,
      sortable: true,
      width: "250px",
      cell: (row) => (
        <div className="fs-12 fw-bold ">
          {row.surname ?? ""} {row.first_name ?? ""}{" "}
          {row.middle_name ? row.middle_name : ""}
        </div>
      ),
    },

    {
      name: "Email",
      selector: (row) => [row.email],

      style: { textAlign: "right" },
      sortable: true,

      width: "250px",
      cell: (row) => (
        <div className="fs-12 fw-bold ">
          {row.email !== null ? row.email : ""}
        </div>
      ),
    },

    {
      name: "Department",
      selector: (row) => row.department?.name ?? row.department, // 👈 adjust based on API structure
      sortable: true,
      width: "140px",
      cell: (row) => (
        <div className="fs-12">
          {row.department?.name ?? row.department ?? ""}
        </div>
      ),
    },

    {
      name: "Unit",
      selector: (row) => row.unit?.name ?? row.unit, // 👈 adjust based on API structure
      sortable: true,
      width: "100px",
      cell: (row) => (
        <div className="fs-12">{row.unit?.name ?? row.unit ?? ""}</div>
      ),
    },

    {
      name: "Signature",
      selector: (row) => row.signature_url,
      width: "150px",
      cell: (row) =>
        row.signature_url ? (
          <img
            src={row.signature_url}
            alt="signature"
            style={{
              width: "100px", // fixed width
              height: "50px", // fixed height
              objectFit: "contain", // keep aspect ratio inside box
              // border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/fallback-signature.png"; // optional fallback
            }}
          />
        ) : (
          <span className="text-muted">No Signature</span>
        ),
    },

    {
      name: "Action",
      style: { textAlign: "right" },
      // width: "120px",
      cell: (row) => (
        <div className="fs-12 fw-bold ">
          <button
            className="btn btn-warning btn-sm my-1"
            variant="warning"
            onClick={() => handleShowEditModal(row)}
          >
            <span className="fe fe-edit"> </span>
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
      {/* <Modal show={showEditModal}>
        <Modal.Header style={{ backgroundColor: "#0a7148", color: "#fff" }}>
          <Card.Title as="h3" style={{ color: "#fff" }}>
            Update User{" "}
          </Card.Title>
          <Button
            onClick={() => setShowEditModal(false)}
            className="btn-close"
            variant=""
            style={{ color: "#fff" }}
          >
            x
          </Button>
        </Modal.Header>
        <CForm
          onSubmit={handleSubmit(modifyUser)}
          className="row g-3 needs-validation"
        >
          <Modal.Body>
            <div>
              <Card>
                <Card.Body>
                  <Col lg={12} md={12}>
                    <FormGroup>
                      <label>Surname</label>
                      <Form.Control
                        type="text"
                        value={value.surname}
                        onChange={(e) =>
                          setValue({ ...value, surname: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={12} md={12}>
                    <FormGroup>
                      <label>First Name</label>
                      <Form.Control
                        type="text"
                        value={value.first_name}
                        onChange={(e) =>
                          setValue({ ...value, first_name: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={12} md={12}>
                    <FormGroup>
                      <label>Middle Name</label>
                      <Form.Control
                        type="text"
                        value={value.middle_name}
                        onChange={(e) =>
                          setValue({ ...value, middle_name: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={12} md={12}>
                    <FormGroup>
                      <label htmlFor="exampleInputname">Email</label>
                      <Form.Control
                        defaultValue={value.email}
                        type="text"
                        name="email"
                        onChange={(e) => {
                          setValue({ ...value, email: e.target.value });
                        }}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>

                  <Col lg={12} md={12}>
                    <FormGroup>
                      <label htmlFor="exampleInputname">Role</label>
                      <select
                        defaultValue={value.role_id}
                        className="form-control"
                        name="role_id"
                        id=""
                        onChange={(e) => {
                          setValue({ ...value, role_id: e.target.value });
                        }}
                      >
                        <option value="">--select--</option>
                        {roles &&
                          roles.map((role) => (
                            <option value={role.id}>{role.role_name}</option>
                          ))}
                      </select>
                    </FormGroup>
                  </Col>
                  <Col lg={12} md={12}>
                    <FormGroup>
                      <label>Department</label>
                      <Form.Control
                        type="text"
                        value={value.department_id}
                        onChange={(e) =>
                          setValue({ ...value, department_id: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={12} md={12}>
                    <FormGroup>
                      <label>Unit</label>
                      <Form.Control
                        type="text"
                        value={value.unit_id}
                        onChange={(e) =>
                          setValue({ ...value, unit_id: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={12} md={12}>
                    <FormGroup>
                      <label>Signature URL</label>
                      <Form.Control
                        type="text"
                        value={value.signature_url}
                        onChange={(e) =>
                          setValue({ ...value, signature_url: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Card.Body>
              </Card>
            </div>
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
              <span className="fe fe-arrow-right"></span> Save
            </Button>
          </Modal.Footer>
        </CForm>
      </Modal> */}
      <Drawer
        anchor="left"
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        <div style={{ width: 400, padding: "20px" }}>
          <h4 className="mb-3" style={{ color: "#0a7e51" }}>
            Update User
          </h4>
          <Form onSubmit={handleSubmit(modifyUser)}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={value.email}
              onChange={(e) => setValue({ ...value, email: e.target.value })}
              fullWidth
              required
              className="mb-3"
            />

            <TextField
              label="Surname"
              name="surname"
              value={value.surname}
              onChange={(e) => setValue({ ...value, surname: e.target.value })}
              fullWidth
              required
              className="mb-3"
            />

            <TextField
              label="First Name"
              name="first_name"
              value={value.first_name}
              onChange={(e) =>
                setValue({ ...value, first_name: e.target.value })
              }
              fullWidth
              required
              className="mb-3"
            />

            <TextField
              label="Middle Name"
              name="middle_name"
              value={value.middle_name}
              onChange={(e) =>
                setValue({ ...value, middle_name: e.target.value })
              }
              fullWidth
              className="mb-3"
            />

            {/* Department */}
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department_id"
                value={value.department_id}
                onChange={(e) =>
                  setValue({
                    ...value,
                    department_id: e.target.value,
                    unit_id: "",
                  })
                }
              >
                <option value="">-- select department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Unit */}
            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Select
                name="unit_id"
                value={value.unit_id}
                onChange={(e) =>
                  setValue({ ...value, unit_id: e.target.value })
                }
                disabled={!value.department_id}
              >
                <option value="">-- select unit --</option>
                {units
                  .filter(
                    (u) => u.department_id === parseInt(value.department_id)
                  )
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            {/* Role */}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role_id"
                value={value.role_id}
                onChange={(e) =>
                  setValue({ ...value, role_id: e.target.value })
                }
                required
              >
                <option value="">-- select role --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.role_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Signature */}
            {/* <Form.Group className="mb-3">
              <Form.Label>Upload Signature (optional)</Form.Label>
              <Form.Control
                type="file"
                name="signature_url"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setValue({ ...value, signature_url: file });
                  }
                }}
              />
            </Form.Group> */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Signature (optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange} // 👈 store as File
              />
            </Form.Group>

            {/* <Form.Group className="mb-3">
              <Form.Label>Draw Signature</Form.Label>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  height: "100px",
                }}
              >
                <SignatureCanvas
                  ref={sigPadRef}
                  penColor="black"
                  canvasProps={{
                    width: 360,
                    height: 100,
                    className: "sigCanvas",
                  }}
                  onEnd={() => {
                    if (!sigPadRef.current.isEmpty()) {
                      const dataUrl = sigPadRef.current.toDataURL("image/png");
                      handleDrawSignature(dataUrl); // 👈 store as base64
                    }
                  }}
                />
              </div>
              <div className="d-flex justify-content-between mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearSignature}
                  type="button"
                >
                  Clear
                </Button>
              </div>
            </Form.Group> */}

            <Form.Group className="mb-3">
              <Form.Label>Draw Signature</Form.Label>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  height: "100px",
                }}
              >
                <SignatureCanvas
                  ref={sigPadRef}
                  penColor="black"
                  canvasProps={{
                    width: 360,
                    height: 100,
                    className: "sigCanvas",
                  }}
                  onEnd={() => {
                    if (!sigPadRef.current.isEmpty()) {
                      const dataUrl = sigPadRef.current.toDataURL("image/png");
                      setValue((prev) => ({ ...prev, signature_url: dataUrl }));
                    }
                  }}
                />
              </div>
              <div className="d-flex justify-content-between mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearSignature}
                  type="button"
                >
                  Clear
                </Button>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button
                onClick={() => setShowEditModal(false)}
                variant="danger"
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </Form>
        </div>
      </Drawer>
    </>
  );
};
