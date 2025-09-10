import React from "react";
import { useState, useContext, useEffect } from "react";
// import {
//   Drawer,
//   TextField,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Button,
// } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Card, Row, Col, Modal } from "react-bootstrap";
// import Drawer from "@mui/material/Drawer";

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
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);

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
    user_id: "",
    department_id: "",
    unit_id: "",
    remark: "",
  });

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
      user_id: "",
      department_id: "",
      unit_id: "",
      remark: "",
    });
    setFilteredUnits([]);
  };

  //   const handleDepartmentChange = (e) => {
  //     const deptId = e.target.value;
  //     setForwardData({ ...forwardData, department_id: deptId, unit_id: "" });

  //     const units =
  //       departmentsList.find((d) => d.id === parseInt(deptId))?.units || [];
  //     setFilteredUnits(units);
  //   };

  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setForwardData({ ...forwardData, department_id: deptId, unit_id: "" });

    const units =
      departmentsList.find((d) => d.id === parseInt(deptId))?.units || [];
    setFilteredUnits(units);
  };

  const handleForwardSubmit = async () => {
    if (
      !forwardData.user_id ||
      !forwardData.department_id ||
      !forwardData.unit_id
    ) {
      return ErrorAlert("Please fill all required fields");
    }
    setLoading(true);
    try {
      const res = await endpoint.post(
        `/file/forward/${selectedFile.id}`,
        forwardData
      );
      SuccessAlert(res.data.message || "File forwarded successfully!");
      getAllData();
      handleDrawerClose();
      setLoading(false);
    } catch (err) {
      ErrorAlert(err.response?.data?.message || "Forward failed!");
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
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
      const res = await endpoint.put(
        `/file/updateLocation/${newFile.file_id}`,
        newFile
      );
      console.log("Update successful:", res.data);
      SuccessAlert(res.data.message || "Location updated successfully!");
      setLoading(false);
      setOpen(false);
      getAllData();
    } catch (err) {
      console.error("Update error:", err.response);
      ErrorAlert(
        err.response?.data?.message ||
          err.response?.data?.description ||
          "Failed to update location"
      );
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
      const res = await endpoint.delete(`/file/deleteLocation/${idToDelete}`);
      console.log(res.data);
      SuccessAlert(res.data.message || "File deleted successfully!");
      setLoading(false);
      setDeleteOpen(false);
      getAllData();
    } catch (err) {
      setLoading(false);
      ErrorAlert(
        err.response?.data?.message ||
          err.response?.data?.description ||
          "Failed to delete location"
      );
    }
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
      cell: (row, index) => index + 1 + (page - 1) * perPage,
      width: "10%",
    },
    {
      name: "File Name",
      selector: (row) => row.file_Name,
      sortable: true,
      width: "20%",
      cell: (row) => <h6 className="fs-12 fw-semibold">{row.file_Name}</h6>,
    },
    {
      name: "File Number",
      selector: (row) => row.file_Number,
      sortable: true,
      width: "15%",
      cell: (row) => <h6 className="fs-12 fw-semibold">{row.file_Number}</h6>,
    },
    {
      name: "Process Number",
      selector: (row) => row.process_Number,
      sortable: true,
      width: "15%",
      cell: (row) => (
        <h6 className="fs-12 fw-semibold">{row.process_Number}</h6>
      ),
    },
    {
      name: "Page Number",
      selector: (row) => row.page_Number,
      sortable: true,
      width: "15%",
      cell: (row) => <h6 className="fs-12 fw-semibold">{row.page_Number}</h6>,
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
              style={{
                backgroundColor: "#0A7E51",
                color: "#fff",
                borderColor: "#0A7E51",
              }}
              title="Edit"
            >
              Edit
            </button>
          </Col>
          <Col sm={6}>
            {/* <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#0A7E51",
                color: "#fff",
                borderColor: "#0A7E51",
              }}
              title="Edit"
            >
              Forward
            </button> */}

            <Button
              style={{ backgroundColor: "#0A7E51" }}
              size="sm"
              onClick={() => handleDrawerOpen(row)}
            >
              Forward
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              className="btn btn-sm btn-danger"
              variant="danger"
              title="Action"
              size="sm"
            >
              Reject
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
                <Modal.Title>Edit File</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="form-group mb-3">
                    <label>
                      File Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
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
                  <div className="form-group mb-3">
                    <label>
                      Process Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
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
                  <div className="form-group mb-3">
                    <label>
                      Page Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
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
                  <div className="form-group mb-3">
                    <label>
                      Description <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
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
                  <div className="form-group mb-3">
                    <label>
                      Parties <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
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
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="success"
                  onClick={handleEdit}
                  style={{ backgroundColor: "#0A7E51", borderColor: "#0A7E51" }}
                >
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
                  <strong className="text-danger">'{nameToDelete}'</strong>{" "}
                  location?
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
            {/* Drawer */}
            <Dialog
              open={openDrawer}
              onClose={handleDrawerClose}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle sx={{ color: "#0A7E51" }}>Forward File</DialogTitle>

              <DialogContent>
                {/* Hidden loginUser */}
                <input type="hidden" value={forwardData.loginUser} />

                {/* User Select */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>User</InputLabel>
                  <Select
                    value={forwardData.user_id}
                    onChange={(e) => {
                      const selectedUser = usersList.find(
                        (u) => u.id === e.target.value
                      );
                      setForwardData({
                        ...forwardData,
                        user_id: e.target.value,
                        department_id: selectedUser?.department_id || "",
                        unit_id: selectedUser?.unit_id || "",
                      });

                      // Filter units for the selected department
                      const units =
                        departmentsList.find(
                          (d) => d.id === selectedUser?.department_id
                        )?.units || [];
                      setFilteredUnits(units);
                    }}
                    label="User"
                  >
                    {usersList.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {`${u.surname} ${u.first_name}${
                          u.middle_name ? ` ${u.middle_name}` : ""
                        }`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Department Select (disabled) */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Department</InputLabel>
                  <Select value={forwardData.department_id} disabled>
                    {departmentsList.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Unit Select (disabled) */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Unit</InputLabel>
                  <Select value={forwardData.unit_id} disabled>
                    {filteredUnits.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Remark */}
                <TextField
                  label="Remark"
                  fullWidth
                  margin="normal"
                  value={forwardData.remark}
                  onChange={(e) =>
                    setForwardData({ ...forwardData, remark: e.target.value })
                  }
                />
              </DialogContent>

              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDrawerClose}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#0A7E51" }}
                  onClick={handleForwardSubmit}
                >
                  Forward
                </Button>
              </DialogActions>
            </Dialog>
          </Col>
        </Row>
      </div>
    </>
  );
};
