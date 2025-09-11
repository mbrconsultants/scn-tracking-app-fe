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
import { FormGroup, Form } from "react-bootstrap";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import { useForm } from "react-hook-form";
// import {
//   CForm,
//   CCol,
//   CFormLabel,
//   CFormFeedback,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CButton,
//   CFormCheck,
// } from "@coreui/react";

// import {
//   DropdownButton,
//   ButtonGroup,
//   Card,
//   Button,
//   Row,
//   Col,
//   InputGroup,
//   Dropdown,
// } from "react-bootstrap";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Card, Row, Col, Modal, Button } from "react-bootstrap";

export const Tracking = ({ refreshKey }) => {
  const { user } = useContext(Context); // 👈 get auth user from Context
  console.log(user);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const [data, setTrackingList] = useState([]);
  const [roles, setUsersRoles] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [forwardData, setForwardData] = useState({
    loginUser: user?.user?.id, // 👈 fix here
    to_user_id: "",
    remark: "",
  });

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
    getTrackingList();
    getUsersroles();
  }, [refreshKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await endpoint.get("/user/list");
        setUsersList(usersRes.data.data);
        console.log("Users fetched:", usersRes.data.data);

        // Fetch departments
        // const deptRes = await endpoint.get("/department/get-all-departments");
        // setDepartmentsList(deptRes.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchData();
  }, []);

  //get users
  const getTrackingList = async () => {
    setLoading(true);
    await endpoint
      .get("/file-track/get-all-files")
      .then((res) => {
        setTrackingList(res.data.data);
        setLoading(false);
        console.log(res.data.data);
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

  const handleAccept = async (row) => {
    try {
      // 👇 Debug log
      console.log("Payload:", { tracking_id: row.id, remark: "Accepted" });

      await endpoint.post(
        "/file-track/accept-file-tracking",
        {
          tracking_id: row.id,
          remark: "Accepted",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      SuccessAlert("File accepted successfully");
      getTrackingList();
    } catch (err) {
      console.log("Accept Error:", err.response?.data || err.message);
      ErrorAlert("Failed to accept file");
    }
  };

  const handleReject = async (row) => {
    try {
      await endpoint.post(`/file-track/reject/${row.id}`);
      SuccessAlert("File rejected successfully");
      getTrackingList();
    } catch (err) {
      ErrorAlert("Failed to reject file");
    }
  };

  // const handleForwardSubmit = async (row) => {
  //   if (!user?.user?.id) {
  //     return ErrorAlert("Logged-in user is missing");
  //   }

  //   if (!row.file?.id) {
  //     return ErrorAlert("File ID is missing");
  //   }

  //   try {
  //     const payload = {
  //       file_id: row.file.id,
  //       from_user_id: user.user.id,
  //       to_user_id: row.to_user_id,
  //       remark: "Forwarded",
  //     };

  //     console.log("Forward payload:", payload);

  //     const res = await endpoint.post(
  //       "/file-track/create-file-tracking",
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     SuccessAlert(res.data.message || "File forwarded successfully!");
  //     getTrackingList();
  //   } catch (err) {
  //     console.error("Forward error:", err.response?.data || err);
  //     ErrorAlert(err.response?.data?.message || "Forward failed!");
  //   }
  // };

  // const handleForwardSubmit = async () => {
  //   if (!user?.id) {
  //     return ErrorAlert("Logged-in user is missing");
  //   }

  //   if (!selectedFile?.file?.id) {
  //     return ErrorAlert("File ID is missing");
  //   }

  //   try {
  //     const payload = {
  //       file_id: selectedFile.file.id, // 👈 use selectedFile
  //       from_user_id: user?.user?.id, // 👈 your auth user
  //       to_user_id: forwardData.user_id, // 👈 selected from modal
  //       remark: forwardData.remark || "Forwarded",
  //     };

  //     console.log("Forward payload:", payload);

  //     const res = await endpoint.post(
  //       "/file-track/create-file-tracking",
  //       payload,
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );

  //     SuccessAlert(res.data.message || "File forwarded successfully!");
  //     getTrackingList();
  //     handleDrawerClose(); // 👈 close modal after success
  //   } catch (err) {
  //     console.error("Forward error:", err.response?.data || err);
  //     ErrorAlert(err.response?.data?.message || "Forward failed!");
  //   }
  // };

  const handleForwardSubmit = async () => {
    if (!user?.user?.id) {
      return ErrorAlert("Logged-in user is missing");
    }

    if (!selectedFile?.file?.id) {
      return ErrorAlert("File ID is missing");
    }

    try {
      const payload = {
        file_id: selectedFile.file.id,
        from_user_id: user.user.id, // 👈 fix here
        to_user_id: forwardData.user_id,
        remark: forwardData.remark || "Forwarded",
      };

      console.log("Forward payload:", payload);

      const res = await endpoint.post(
        "/file-track/create-file-tracking",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      SuccessAlert(res.data.message || "File forwarded successfully!");
      getTrackingList();
      handleDrawerClose();
    } catch (err) {
      console.error("Forward error:", err.response?.data || err);
      ErrorAlert(err.response?.data?.message || "Forward failed!");
    }
  };

  const columns = [
    {
      name: "S/N",
      cell: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "File Number",
      selector: (row) => row.file?.file_Number,
      sortable: true,
      cell: (row) => <span>{row.file?.file_Number || "N/A"}</span>,
      width: "135px",
    },
    {
      name: "Sender",
      selector: (row) => row.sender?.first_name,
      cell: (row) => <span>{row.sender?.first_name || "N/A"}</span>,
      width: "115px",
    },

    {
      name: "Recipient",
      selector: () => user?.user?.surname, // 👈 always authenticated user
      cell: () => (
        <span>
          {`${user?.user?.surname} ${user?.user?.first_name}` || "N/A"}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Unit",
      selector: (row) => row?.unit_name,
      cell: (row) => <span>{row.unit_name || "N/A"}</span>,
      width: "80px",
    },
    {
      name: "Department",
      selector: (row) => row.department_name,
      cell: (row) => <span>{row.department_name || "N/A"}</span>,
      width: "120px",
    },
    {
      name: "Date Sent",
      selector: (row) => row.date_sent,
      cell: (row) => (
        <span>
          {row.date_sent ? moment(row.date_sent).format("DD-MM-YYYY") : ""}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Date Received",
      selector: (row) => row.date_received,
      cell: (row) => (
        <span>
          {row.date_received
            ? moment(row.date_received).format("DD-MM-YYYY")
            : ""}
        </span>
      ),
      width: "130px",
    },
    {
      name: "Date Rejected",
      selector: (row) => row.date_rejected,
      cell: (row) => (
        <span>
          {row.date_rejected
            ? moment(row.date_rejected).format("DD-MM-YYYY")
            : ""}
        </span>
      ),
      width: "125px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          {/* Accept */}
          {!row.date_received && !row.date_rejected && (
            <Button
              size="sm"
              variant="success"
              onClick={() => handleAccept(row)}
            >
              Accept
            </Button>
          )}

          {/* Reject */}
          {!row.date_received && !row.date_rejected && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleReject(row)}
            >
              Reject
            </Button>
          )}

          {/* Forward - only shows if accepted */}
          {row.date_received && !row.date_rejected && (
            <button
              onClick={() => handleDrawerOpen(row)}
              className="btn btn-sm"
              style={{
                backgroundColor: "#0A7E51",
                color: "#fff",
                borderColor: "#0A7E51",
              }}
              title="Forward"
            >
              Forward
            </button>
          )}
        </div>
      ),
      width: "170px",
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
        <Modal.Header>
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
              <Card.Header>
                <Card.Title as="h3">Edit Unit</Card.Title>
              </Card.Header>
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
              variant="warning"
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
      {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
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
      </Modal> */}
      {/* Forward Modal */}
      <Modal
        show={openDrawer}
        onHide={handleDrawerClose}
        className="file-modal-wrapper"
        centered
      >
        <Modal.Header
          closeButton
          className="file-modal-header"
          style={{ backgroundColor: "#0a7148", color: "#fff" }}
        >
          <Modal.Title className="file-modal-title" style={{ color: "#fff" }}>
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
              as="textarea" // 👈 change from type="text"
              rows={3} // 👈 control height
              value={forwardData.remark}
              onChange={(e) =>
                setForwardData({ ...forwardData, remark: e.target.value })
              }
              placeholder="Enter remark here..."
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
            style={{ backgroundColor: "#0a7148", color: "#fff" }}
            className="file-btn-update"
            onClick={handleForwardSubmit}
          >
            Forward
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
