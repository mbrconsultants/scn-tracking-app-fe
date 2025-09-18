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

export const Tracking = () => {
  const { user, refreshKey } = useContext(Context); // 👈 get auth user from Context

  console.log(user);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  // const [data, setTrackingList] = useState([]);
  const [roles, setUsersRoles] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [idToReject, setIdToReject] = useState("");
  const [nameToReject, setnameToReject] = useState("");
  const [rejectRemark, setRejectRemark] = useState(""); // New state for reject remark
  // const [isForwarded, setIsForwarded] = useState(false);
  // const [acceptOpen, setAcceptOpen] = useState(false);
  // const [idToAccept, setIdToAccept] = useState("");
  // const [acceptRemark, setAcceptRemark] = useState("");
  const [acceptFile, setAcceptFile] = useState(null);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [acceptRemark, setAcceptRemark] = useState("");
  const [rejectFile, setRejectFile] = useState(null);
  const [trackingList, setTrackingList] = useState([]);
  const [locations, setLocation] = useState([]);

  // const [rejectRemark, setRejectRemark] = useState("");

  const [forwardData, setForwardData] = useState({
    loginUser: user?.user?.id, // 👈 fix here
    location_id: "",
    to_user_id: "",
    remark: "",
  });

  const [value, setValue] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    getTrackingList();
    getUsersroles();
    getAllLocations();
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

  const getAllLocations = async () => {
    try {
      const res = await endpoint.get(`/location/getAllLocations`);
      console.log("all locations", res.data.data);
      setLocation(res.data.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  //get all tracking list
  const getTrackingList = async () => {
    setLoading(true);
    await endpoint
      .get("/file-track/get-all-files")
      .then((res) => {
        setTrackingList(res.data.data);
        setLoading(false);
        console.log("Tracking List:", res.data.data);
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
      location_id: "",
      to_user_id: "",

      remark: "",
    });
    setFilteredUnits([]);
  };

  const handleAccept = async () => {
    if (!acceptFile) return;

    try {
      await endpoint.post(
        "/file-track/accept-file-tracking",
        {
          tracking_id: acceptFile.id,
          remark: acceptRemark || "Accepted",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      SuccessAlert("File accepted successfully!");
      getTrackingList();
      setAcceptOpen(false);
      setAcceptRemark("");
      setAcceptFile(null);
    } catch (err) {
      console.error("Accept Error:", err.response?.data || err.message);
      ErrorAlert(err.response?.data?.message || "Failed to accept file");
    }
  };

  const onReject = (row) => {
    // setOpen(false);
    setIdToReject(row.file?.id);
    setnameToReject(row.file_Name);
    setRejectOpen(true);
  };

  const onClose = () => {
    reset();
    // setOpen(false);
    setRejectOpen(false);
  };

  // const handleReject = async () => {
  //   if (!rejectFile) return;

  //   setLoading(true);
  //   try {
  //     await endpoint.post(`/file-track/reject-file-tracking`, {
  //       tracking_id: rejectFile.id,
  //       remark: rejectRemark,
  //     });

  //     SuccessAlert("File has been rejected successfully!");
  //     setRejectOpen(false);
  //     setRejectRemark("");
  //     setRejectFile(null);

  //     // 👇 update UI instantly
  //     setTrackingList((prev) =>
  //       prev.map((item) =>
  //         item.id === rejectFile.id
  //           ? { ...item, status_id: 3, isRejected: true }
  //           : item
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Reject error:", err.response);
  //     ErrorAlert(err.response?.data?.message || "Failed to reject file");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleReject = async () => {
    if (!rejectFile) return;

    setLoading(true);
    try {
      await endpoint.post(`/file-track/reject-file-tracking`, {
        tracking_id: rejectFile.id, // ✅ this is the tracking id now
        remark: rejectRemark,
      });

      SuccessAlert("File has been rejected successfully!");
      setRejectOpen(false);
      setRejectRemark("");
      setRejectFile(null);

      // 👇 update the correct row (tracking id, not file id)
      setTrackingList((prev) =>
        prev.map((item) =>
          item.id === rejectFile.id ? { ...item, status_id: 3 } : item
        )
      );
    } catch (err) {
      console.error("Reject error:", err.response);
      ErrorAlert(err.response?.data?.message || "Failed to reject file");
    } finally {
      setLoading(false);
    }
  };

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
        from_user_id: user.user.id,
        to_user_id: forwardData.user_id,
        location_id: forwardData.location_id, // 👈 added
        remark: forwardData.remark || "Forwarded",
      };

      console.log("Forward payload:", payload);

      const res = await endpoint.post(
        "/file-track/create-file-tracking",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      SuccessAlert(res.data.message || "File forwarded successfully!");

      // ✅ mark forwarded instead of removing

      setTrackingList((prev) =>
        prev.map((item) =>
          item.file.id === selectedFile.file.id
            ? { ...item, isForwarded: true }
            : item
        )
      );

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
      name: "Previous Location",
      selector: (row) => row.previous_location_of_the_file?.name, // backend should return location object
      cell: (row) => (
        <span>{row.previous_location_of_the_file?.name || "N/A"}</span>
      ),
      sortable: true,
      width: "160px",
    },
    {
      name: "Current Location",
      selector: (row) => row.current_location_of_the_file?.name, // backend should return location object
      cell: (row) => (
        <span>{row.current_location_of_the_file?.name || "N/A"}</span>
      ),
      sortable: true,
      width: "160px",
    },

    // {
    //   name: "Recipient",
    //   selector: () => user?.user?.surname, // 👈 always authenticated user
    //   cell: () => (
    //     <span>
    //       {`${user?.user?.surname} ${user?.user?.first_name}` || "N/A"}
    //     </span>
    //   ),
    //   width: "120px",
    // },
    // {
    //   name: "Unit",
    //   selector: (row) => row?.unit_name,
    //   cell: (row) => <span>{row.unit_name || "N/A"}</span>,
    //   width: "80px",
    // },
    // {
    //   name: "Department",
    //   selector: (row) => row.department_name,
    //   cell: (row) => <span>{row.department_name || "N/A"}</span>,
    //   width: "120px",
    // },
    {
      name: "Date Sent",
      selector: (row) => row.date_sent,
      cell: (row) => (
        <span>
          {row.date_sent ? moment(row.date_sent).format("Do MMMM YYYY") : ""}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Date Received",
      selector: (row) => row.date_received,
      cell: (row) => (
        <span>
          {row.date_received
            ? moment(row.date_received).format("Do MMMM YYYY")
            : ""}
        </span>
      ),
      width: "125px",
    },
    {
      name: "Date Rejected",
      selector: (row) => row.date_rejected,
      cell: (row) => (
        <span>
          {row.date_rejected
            ? moment(row.date_rejected).format("Do MMMM YYYY")
            : ""}
        </span>
      ),
      width: "125px",
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          {/* Accept button: only show when status_id = 1 (forwarded) */}
          {row.status_id === 1 && (
            <Button
              size="sm"
              onClick={() => {
                setAcceptFile(row.file); // store file object
                setAcceptOpen(true);
              }}
            >
              Accept
            </Button>
          )}

          {/* Reject button: only show when status_id = 1 (forwarded) */}
          {row.status_id === 1 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setRejectFile(row); // store full row (tracking object)
                setRejectOpen(true);
              }}
            >
              Reject
            </Button>
          )}

          {/* Show rejected status badge */}
          {row.status_id === 3 && <Badge bg="danger">Rejected</Badge>}

          {/* Forward button: only show when status_id = 2 (accepted) and NOT forwarded yet */}
          {row.status_id === 2 && !row.isForwarded && (
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

          {/* Show forwarded badge after forwarding */}
          {row.status_id === 2 && row.isForwarded && (
            <Badge bg="success">Forwarded</Badge>
          )}

          {/* Status_id = 3 (backend already marked as rejected) */}
          {/* {row.status_id === 3 && <Badge bg="danger">Rejected</Badge>} */}
        </div>
      ),
      width: "160px",
    },
  ];

  const tableDatas = {
    columns,
    data: trackingList,
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
              // data={data}
              data={trackingList}
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
              <option value="" disabled hidden></option>

              {usersList
                .filter((u) => u.id !== user?.user?.id) // 👈 logged-in user won't appear
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {`${u.surname} ${u.first_name}${
                      u.middle_name ? ` ${u.middle_name}` : ""
                    }`}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          {/* Location Select */}
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Select
              value={forwardData.location_id || ""}
              onChange={(e) =>
                setForwardData({
                  ...forwardData,
                  location_id: e.target.value,
                })
              }
            >
              <option value="" disabled hidden>
                -- Select Location --
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
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
            // className="file-btn-cancel"
            onClick={handleDrawerClose}
          >
            Close
          </Button>
          <Button
            style={{ backgroundColor: "#0a7148", color: "#fff" }}
            className="file-btn-update"
            onClick={handleForwardSubmit}
          >
            Forward
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={rejectOpen} onHide={onClose}>
        <Modal.Header closeButton style={{ backgroundColor: "#e25762ff" }}>
          <Modal.Title style={{ color: "#fff" }}>Reject File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {rejectFile && (
            <div className="mb-3">
              <p>
                <strong>File Number:</strong> {rejectFile?.file?.file_Number}
              </p>

              <p>
                <strong>Parties:</strong> {rejectFile?.file?.file_Name}
              </p>
              <p>
                <strong>Number of Pages:</strong>{" "}
                {rejectFile?.file?.page_Number}
              </p>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Reason for rejection</Form.Label>
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
          <Button variant="danger" onClick={handleReject}>
            Reject File
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Accept Modal */}
      <Modal show={acceptOpen} onHide={() => setAcceptOpen(false)}>
        <Modal.Header closeButton style={{ backgroundColor: "#0a7148" }}>
          <Modal.Title style={{ color: "#fff" }}>Accept File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {acceptFile && (
            <div className="mb-3">
              <p>
                <strong>File Number:</strong> {acceptFile.file_Number}
              </p>
              <p>
                <strong>Parties:</strong> {acceptFile.file_Name}
              </p>
              <p>
                <strong>Pages:</strong> {acceptFile.page_Number}
              </p>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Remark (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add a remark for accepting this file..."
              value={acceptRemark}
              onChange={(e) => setAcceptRemark(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAcceptOpen(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#0a7148", color: "#fff" }}
            onClick={handleAccept}
          >
            Accept File
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
