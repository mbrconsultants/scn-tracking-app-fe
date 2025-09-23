import React, { useState, useContext } from "react";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Badge, Button, Card } from "react-bootstrap";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import moment from "moment";
import Loader from "../Loader/loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export const TrackingFileRecord = ({ refreshKey }) => {
  const { user } = useContext(Context);

  const [trackingList, setTrackingList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // 🔍 search files by file_number
  const handleSearchChange = async (event, value) => {
    if (!value || value.length < 2) {
      setSearchOptions([]);
      return;
    }
    try {
      const res = await endpoint.get(`/files/search?query=${value}`);
      setSearchOptions(res.data || []);
    } catch (err) {
      console.error("Error searching files:", err);
    }
  };

  // 👆 when user selects a file_number → fetch tracking records
  const handleFileSelect = async (event, value) => {
    if (!value) return;
    setSelectedFile(value);
    setLoading(true);
    try {
      const res = await endpoint.post("/file-track/get-tracking-details", {
        file_id: value.id,
      });
      setTrackingList(res.data.data.tracking_history || []);
    } catch (err) {
      console.error("Error fetching tracking records:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "S/N",
      cell: (row, index) => index + 1,
      width: "57px",
    },
    {
      name: "Appeal Number",
      selector: (row) => row.file?.file_number,
      cell: (row) => <span>{row.file?.file_number || "N/A"}</span>,
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
      selector: (row) => row.previous_location_of_the_file?.name,
      cell: (row) => (
        <span>{row.previous_location_of_the_file?.name || "N/A"}</span>
      ),
      width: "140px",
    },
    {
      name: "Present Location",
      selector: (row) => row.file?.current_location?.name,
      cell: (row) => <span>{row.file?.current_location?.name || "N/A"}</span>,
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
      name: "Status",
      selector: (row) => row.status?.name,
      cell: (row) => {
        let badgeColor = "secondary";
        let label = row.status?.name || "Unknown";

        if (row.status?.id === 3) {
          badgeColor = "danger";
        } else if (row.status?.id === 2) {
          badgeColor = row.is_forwarded ? "success" : "primary";
          label = row.is_forwarded ? "Forwarded" : "Accepted";
        } else if (row.status?.id === 1) {
          badgeColor = "warning";
          label = "Pending";
        }

        return <Badge bg={badgeColor}>{label}</Badge>;
      },
      width: "85px",
    },
  ];

  const tableDatas = {
    columns,
    data: trackingList,
  };

  return (
    <>
      {/* 🔎 Search box */}
      <div className="mb-3">
        <Autocomplete
          options={searchOptions}
          getOptionLabel={(option) => option.file_number}
          onInputChange={handleSearchChange}
          onChange={handleFileSelect}
          renderInput={(params) => (
            <TextField {...params} label="Search by File Number" fullWidth />
          )}
        />
      </div>

      <DataTableExtensions {...tableDatas}>
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
      </DataTableExtensions>
    </>
  );
};
