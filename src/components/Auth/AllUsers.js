import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form"; // <-- add this
import * as Users from "../../data/Users/Users";
import { Link, useNavigate } from "react-router-dom";
import endpoint from "../../context/endpoint";
import { useForm } from "react-hook-form";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";

export default function AllUsers() {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    surname: "",
    first_name: "",
    middle_name: "",
    file_number: "",
    unit_id: "",
    department_id: "",
    role_id: "",
  });

  // drawer controls
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      email: "",
      password: "",
      surname: "",
      first_name: "",
      middle_name: "",
      file_number: "",
      unit_id: "",
      department_id: "",
      role_id: "",
    });
  };

  // fetch dropdown data
  useEffect(() => {
    const getRoles = async () => {
      try {
        const res = await endpoint.get("/role/getRoles");
        setRoles(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    const getUnits = async () => {
      try {
        const res = await endpoint.get("/unit/list");
        setUnits(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    const getDepartments = async () => {
      try {
        const res = await endpoint.get("/department/list");
        setDepartments(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    getRoles();
    getUnits();
    getDepartments();
  }, []);

  // handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await endpoint.post("/user/create", formData);
      SuccessAlert(res.data.message);
      handleClose();
      // optionally refresh user list here
    } catch (error) {
      if (error.response) {
        ErrorAlert(error.response.data.description);
      }
    }
  };

  return (
    <div>
      <div className="page-header ">
        <div>
          {/* <h1 className="page-title">Documentation </h1> */}
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              {/* Staff documentation */}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Button
            onClick={handleOpen}
            className="btn btn-primary btn-icon text-white me-3"
          >
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            Add User
          </Button>
        </div>
      </div>

      {/* <Search.SearchStaff handleSearch={handleSearch} data={data}/> */}

      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <Col className="card-title text-center mb-0"> USERS LIST </Col>
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                  <Users.Users />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <Drawer anchor="left" open={open} onClose={handleClose}>
        <div style={{ width: 350, padding: "20px" }}>
          <h4>Add User</h4>
          <TextField
            autoFocus
            margin="dense"
            id="fullname"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
          />

          <div className="d-flex justify-content-end mt-3">
            <Button onClick={handleClose} variant="secondary" className="me-2">
              Cancel
            </Button>
            <Button onClick={handleClose} variant="success">
              Save
            </Button>
          </div>
        </div>
      </Drawer> */}

      {/* Drawer on the left */}
      <Drawer anchor="left" open={open} onClose={handleClose}>
        <div style={{ width: 400, padding: "20px" }}>
          <h4 className="mb-3">Add User</h4>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              className="mb-3"
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              className="mb-3"
            />

            <TextField
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              fullWidth
              required
              className="mb-3"
            />

            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              required
              className="mb-3"
            />

            <TextField
              label="Middle Name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              fullWidth
              className="mb-3"
            />

            <TextField
              label="File Number"
              name="file_number"
              value={formData.file_number}
              onChange={handleChange}
              fullWidth
              required
              className="mb-3"
            />

            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Select
                name="unit_id"
                value={formData.unit_id}
                onChange={handleChange}
              >
                <option value="">-- select unit --</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unit_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
              >
                <option value="">-- select department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.department_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
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

            <div className="d-flex justify-content-end mt-3">
              <Button
                onClick={handleClose}
                variant="secondary"
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </Drawer>
    </div>
  );
}
