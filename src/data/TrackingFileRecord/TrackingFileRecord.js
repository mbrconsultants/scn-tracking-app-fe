import React, { useState, useContext } from "react";
import DataTable from "react-data-table-component"; // ✅ Needed for table
import { Badge } from "react-bootstrap";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import moment from "moment";
import Loader from "../Loader/loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "bootstrap-icons/font/bootstrap-icons.css";

export const TrackingFileRecord = ({ refreshKey }) => {
  const { user } = useContext(Context);

  const [trackingList, setTrackingList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [activeRemarks, setActiveRemarks] = useState([]);
  const [activeFileNumber, setActiveFileNumber] = useState(null);

  // 🔍 search files by file_number
  const handleSearchChange = async (event, value) => {
    if (!value || value.length < 2) {
      setSearchOptions([]);
      return;
    }
    try {
      const res = await endpoint.get(`/file-track/search?query=${value}`);
      console.log("file rec", res.data);

      setSearchOptions(res.data || []);
    } catch (err) {
      console.error("Error searching files:", err);
    }
  };

  // 👆 when user selects a file_number → fetch tracking records
  // const handleFileSelect = async (event, value) => {
  //   if (!value) return;
  //   setSelectedFile(value);
  //   setLoading(true);
  //   try {
  //     const res = await endpoint.get(
  //       "/file-track/get-tracking-details-by-file-id",
  //       {
  //         file_id: value.id,
  //       }
  //     );
  //     setTrackingList(res.data.data || []);
  //     console.log("trcking res", res.data.data);

  //     // setTrackingList(res.data.data.tracking_history || []);
  //   } catch (err) {
  //     console.error("Error fetching tracking records:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // 👆 when user selects a file_number → fetch tracking records
  const handleFileSelect = async (event, value) => {
    if (!value) return;
    setSelectedFile(value);
    setLoading(true);
    try {
      const res = await endpoint.get(
        `/file-track/get-tracking-details-by-file-id/${value.id}`
      );

      // Use your controller’s response shape
      setTrackingList(res.data.data.tracking_history || []);
      console.log("tracking res", res.data.data.tracking_history);
    } catch (err) {
      console.error("Error fetching tracking records:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Table columns
  const columns = [
    {
      name: "S/N",
      cell: (row, index) => index + 1,
      width: "57px",
    },
    // {
    //   name: "Appeal Number",
    //   selector: (row) => row.file?.file_number,
    //   cell: (row) => <span>{row.file?.file_number || "N/A"}</span>,
    //   width: "127px",
    // },
    // {
    //   name: "From",
    //   selector: (row) => row.sender?.surname,
    //   cell: (row) => <span>{row.sender?.surname || "N/A"}</span>,
    //   width: "85px",
    // },
    {
      name: "From",
      selector: (row) => row.sender?.surname,
      cell: (row) => (
        <div style={{ fontSize: "0.85rem" }}>
          <div>
            {" "}
            <b>User:</b> {row.sender?.surname || "N/A"}
          </div>
          <small style={{ color: "#555" }}>
            <b style={{ fontWeight: "bolder" }}>Location:</b>{" "}
            {row.previous_location_of_the_file?.name || "N/A"}
          </small>
        </div>
      ),
      width: "160px",
    },
    {
      name: "To",
      selector: (row) => row.sender?.surname,
      cell: (row) => (
        <div style={{ fontSize: "0.85rem" }}>
          <div>
            {" "}
            <b>User:</b> {row.receiver?.surname || "N/A"}
          </div>
          <small style={{ color: "#555" }}>
            <b style={{ fontWeight: "bolder" }}>Location:</b>{" "}
            {row.current_location_of_the_tracking?.name || "N/A"}
          </small>
        </div>
      ),
      width: "160px",
    },

    // {
    //   name: "Remarks",
    //   selector: (row) => row.remarks,
    //   cell: (row) => (
    //     <div>
    //       {row.remarks && row.remarks.length > 0 ? (
    //         row.remarks.map((r, idx) => (
    //           <div key={idx} style={{ fontSize: "0.85rem" }}>
    //             • {r.remark}
    //           </div>
    //         ))
    //       ) : (
    //         <span>No remarks</span>
    //       )}
    //     </div>
    //   ),
    //   width: "200px",
    // },

    {
      name: "Remarks",
      selector: (row) => row.remarks,
      cell: (row) => {
        if (!row.remarks || row.remarks.length === 0) {
          return <span>No remarks</span>;
        }

        const firstRemark = row.remarks[0]?.remark || "";
        const truncated = firstRemark.length > 5;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.85rem" }}>
              • {truncated ? firstRemark.slice(0, 30) + "..." : firstRemark}
            </span>

            {/* 👁 Show eye if more than 1 remark OR text truncated */}
            {(row.remarks.length > 1 || truncated) && (
              <i
                className="bi bi-eye"
                style={{
                  cursor: "pointer",
                  color: "#000",
                  fontSize: "20px",
                }}
                title="View all remarks"
                onClick={() => {
                  setActiveRemarks(row.remarks);
                  const fileNum =
                    row.file?.file_number ||
                    row.file_number ||
                    selectedFile?.file_number ||
                    null;
                  setActiveFileNumber(fileNum);
                  setShowRemarksModal(true);
                }}
              ></i>
            )}
          </div>
        );
      },
      width: "160px",
    },

    {
      name: "Date Sent",
      selector: (row) => row.date_sent,
      cell: (row) =>
        row.date_sent ? moment(row.date_sent).format("Do MMM YYYY") : "N/A",
      width: "140px",
    },
    {
      name: "Date Received",
      selector: (row) => row.date_received,
      cell: (row) =>
        row.date_received
          ? moment(row.date_received).format("Do MMM YYYY")
          : "N/A",
      width: "140px",
    },
    {
      name: "Date Rejected",
      selector: (row) => row.date_rejected,
      cell: (row) =>
        row.date_rejected
          ? moment(row.date_rejected).format("Do MMM YYYY")
          : "N/A",
      width: "140px",
    },

    // {
    //   name: "Status",
    //   selector: (row) => row.status?.name,
    //   cell: (row) => {
    //     let badgeColor = "secondary";
    //     let label = row.status?.name || "Unknown";

    //     if (row.status_id === 3) {
    //       badgeColor = "danger";
    //       label = "Rejected"; // 👈 Explicitly set label
    //     } else if (row.status_id === 2) {
    //       badgeColor = row.is_forwarded ? "success" : "primary";
    //       label = row.is_forwarded ? "Forwarded" : "Accepted";
    //     } else if (row.status_id === 1) {
    //       badgeColor = "warning";
    //       label = "Pending";
    //     }

    //     return <Badge bg={badgeColor}>{label}</Badge>;
    //   },
    //   width: "100px", // made it a bit wider to fit "Rejected"
    // },

    {
      name: "Status",
      selector: (row) => row.status_id, // 👈 use the direct status_id
      cell: (row) => {
        let badgeColor = "secondary";
        let label = "Unknown";

        if (row.status_id === 3) {
          badgeColor = "danger";
          label = "Rejected";
        } else if (row.status_id === 2) {
          badgeColor = row.is_forwarded ? "success" : "primary";
          label = row.is_forwarded ? "Forwarded" : "Accepted";
        } else if (row.status_id === 1) {
          badgeColor = "warning";
          label = "Pending";
        }

        return <Badge bg={badgeColor}>{label}</Badge>;
      },
      width: "100px",
    },
  ];

  return (
    <>
      {/* 🔎 Header Row: rows-per-page (left) | appeal number (center) | search (right) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Left: Pagination selector placeholder (DataTable renders it, so just keep space) */}
        <div style={{ width: "200px" }}></div>

        {/* Center: Appeal Number */}
        <div className="text-center flex-grow-1">
          {selectedFile ? (
            <h5 className="mb-0" style={{ fontWeight: "600" }}>
              <span style={{ fontWeight: "bolder" }}>
                Tracking File Records For:
              </span>{" "}
              <span> {selectedFile.file_number}</span>
              <br></br>
              <span style={{ fontWeight: "bolder" }}>
                Current Location:
              </span>{" "}
              <span>{selectedFile.currentLocation?.name}</span>
            </h5>
          ) : (
            <h5 className="mb-0 text-muted">No Appeal Selected</h5>
          )}
        </div>

        {/* <div className="text-center flex-grow-1">
          {selectedFile ? (
            <h5 className="mb-0" style={{ fontWeight: "600" }}>
              <span style={{ fontWeight: "bolder" }}>
                Tracking File Records For:
              </span>{" "}
              <span>{{selectedFile.file_number}}</span>
              <br />
              <span style={{ fontWeight: "bolder" }}>
                Current Location:
              </span>{" "}
              <span>{selectedFile.current_location_of_the_file?.name}</span>
            </h5>
          ) : (
            <h5 className="mb-0 text-muted">No Appeal Selected</h5>
          )}
        </div> */}

        {/* Right: Search */}
        <div>
          <Autocomplete
            options={searchOptions}
            getOptionLabel={(option) => option.file_number}
            onInputChange={handleSearchChange}
            onChange={handleFileSelect}
            sx={{ width: 220 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    height: 50,
                    fontSize: "0.8rem",
                    paddingRight: 0,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.75rem",
                  },
                }}
              />
            )}
          />
        </div>
      </div>

      {/* 📋 Tracking Table */}
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable
          fixedHeader
          columns={columns}
          data={trackingList}
          persistTableHead
          defaultSortField="id"
          defaultSortAsc={false}
          striped
          center
          pagination
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
          highlightOnHover
        />
      )}

      {/* 📌 Remarks Modal */}
      {showRemarksModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{ color: "#235c45ff", fontWeight: "bold" }}
                >
                  All Remarks
                  {/* <b>
                    {(activeFileNumber || selectedFile?.file_number) && (
                      <> {activeFileNumber || selectedFile?.file_number}</>
                    )}
                  </b> */}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRemarksModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {activeRemarks.length > 0 ? (
                  <ul
                    style={{
                      fontStyle: "normal",
                      color: "#000000ff",
                      listStyleType: "disc",
                      paddingLeft: "20px",
                    }}
                  >
                    {activeRemarks.map((r, idx) => (
                      <li key={idx}> {r.remark}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No remarks available</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn "
                  style={{ backgroundColor: "#235c45ff", color: "#fff" }}
                  onClick={() => setShowRemarksModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
