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

export const TrackingFileRecord = () => {
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

  // const [forwardData, setForwardData] = useState({
  //   loginUser: user?.user?.id, // 👈 fix here
  //   location_id: "",
  //   to_user_id: "",
  //   remark: "",
  // });

  // const [value, setValue] = useState({
  //   id: "",
  //   name: "",
  // });

  // const customStyles = {
  //   headCells: {
  //     style: {
  //       fontWeight: "bold",
  //       fontSize: "13px",
  //       textTransform: "uppercase",
  //     },
  //   },
  // };

  useEffect(() => {
    getTrackingList();
    getUsersroles();
    getAllLocations();
  }, [refreshKey]);
  // 👇 define helper at the top (before your component, or inside it)
  // const getStatus = (status_id) => {
  //   switch (status_id) {
  //     case 1:
  //       return { label: "Pending", color: "#ffc107" }; // yellow
  //     case 2:
  //       return { label: "Accepted", color: "#0a7e51" }; // green
  //     case 3:
  //       return { label: "Rejected", color: "#dc3545" }; // red
  //     default:
  //       return { label: "Unknown", color: "#6c757d" }; // gray
  //   }
  // };

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

  const columns = [
    {
      name: "S/N",
      cell: (row, index) => index + 1,
      width: "57px",
    },
    {
      name: "Appeal Number",
      selector: (row) => row.file?.file_Number,
      sortable: true,
      cell: (row) => <span>{row.file?.file_Number || "N/A"}</span>,
      width: "127px",
    },
    {
      name: "Sender",
      selector: (row) => row.sender?.first_name,
      cell: (row) => <span>{row.sender?.first_name || "N/A"}</span>,
      width: "85px",
    },
    {
      name: "Sender Location",
      selector: (row) => row.previous_location_of_the_file?.name, // backend should return location object
      cell: (row) => (
        <span>{row.previous_location_of_the_file?.name || "N/A"}</span>
      ),
      sortable: true,
      width: "140px",
    },
    {
      name: "Present Location",
      selector: (row) => row.file?.currentLocation?.name, // backend should return location object
      cell: (row) => <span>{row.file?.currentLocation?.name || "N/A"}</span>,
      sortable: true,
      width: "157px",
    },

    {
      name: "Date Sent",
      selector: (row) => row.date_sent,
      cell: (row) => (
        <span>
          {row.date_sent ? moment(row.date_sent).format("Do MMMM YYYY") : ""}
        </span>
      ),
      width: "110px",
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
      width: "120px",
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
      width: "120px",
    },

    {
      name: "Status",
      selector: (row) => {
        if (row.status_id === 3) return "Rejected"; // rejected
        if (row.status_id === 2) {
          return row.is_forwarded ? "Forwarded" : "Accepted"; // 🔑 check forwarded
        }
        if (row.status_id === 1) return "Pending";
        return "Unknown";
      },
      cell: (row) => {
        let badgeColor = "secondary";
        let label = "Unknown";

        if (row.status_id === 3) {
          badgeColor = "danger";
          label = "Rejected";
        } else if (row.status_id === 2) {
          if (row.is_forwarded) {
            badgeColor = "success";
            label = "Forwarded"; // 🔑 now shows Forwarded
          } else {
            badgeColor = "primary";
            label = "Accepted";
          }
        } else if (row.status_id === 1) {
          badgeColor = "warning";
          label = "Pending";
        }

        return <Badge bg={badgeColor}>{label}</Badge>;
      },
      width: "85px",
    },

    // {
    //   name: "Action",
    //   cell: (row) => {
    //     // if rejected OR forwarded → no action
    //     if (row.status_id === 3 || (row.status_id === 2 && row.is_forwarded)) {
    //       return null; // 👈 empty cell
    //     }

    //     return (
    //       <div className="d-flex gap-2">
    //         {/* Accept button: only when status_id = 1 (Pending) */}
    //         {row.status_id === 1 && (
    //           <Button
    //             size="sm"
    //             onClick={() => {
    //               setAcceptFile(row.file);
    //               setAcceptOpen(true);
    //             }}
    //           >
    //             Accept
    //           </Button>
    //         )}

    //         {/* Reject button: only when status_id = 1 (Pending) */}
    //         {row.status_id === 1 && (
    //           <Button
    //             variant="danger"
    //             size="sm"
    //             onClick={() => {
    //               setRejectFile(row.file);
    //               setRejectOpen(true);
    //             }}
    //           >
    //             Reject
    //           </Button>
    //         )}

    //         {/* Forward button: only when status_id = 2 (Accepted) and NOT forwarded */}
    //         {row.status_id === 2 && row.is_forwarded === false && (
    //           <button
    //             onClick={() => handleDrawerOpen(row)}
    //             className="btn btn-sm"
    //             style={{
    //               backgroundColor: "#0A7E51",
    //               color: "#fff",
    //               borderColor: "#0A7E51",
    //             }}
    //           >
    //             Forward
    //           </button>
    //         )}
    //       </div>
    //     );
    //   },
    //   width: "150px",
    // },
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
              // customStyles={customStyles}
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
    </>
  );
};
