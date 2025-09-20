import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form"; // <-- add this
import * as Users from "../../data/Users/Users";
import { Link, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
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
  const [refreshKey, setRefreshKey] = useState(0);
  const sigPadRef = useRef(null);

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
    signature_url: null,
    // signature_drawn: null,
  });

  const clearSignature = () => {
    sigPadRef.current.clear();
    setFormData({ ...formData, signature_drawn: null });
  };

  const saveSignature = () => {
    if (!sigPadRef.current.isEmpty()) {
      const dataUrl = sigPadRef.current.toDataURL("image/png");
      setFormData({ ...formData, signature_drawn: dataUrl });
    }
  };

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
      signature_url: null,
      // signature_drawn: null,
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

    getRoles();
    getUnits();
    getDepartments();
  }, []);

  // handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     if (formData[key]) {
  //       data.append(key, formData[key]);
  //     }
  //   });

  //   try {
  //     const res = await endpoint.post("/user/create", data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     SuccessAlert("✅ User added successfully!");
  //     setRefreshKey((prev) => prev + 1); // 👈 trigger reload in Users
  //     handleClose();
  //   } catch (err) {
  //     ErrorAlert(err.response?.data?.description || "Upload failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    for (const key in formData) {
      if (formData[key]) {
        if (
          key === "signature_url" &&
          typeof formData[key] === "string" &&
          formData[key].startsWith("data:image")
        ) {
          // convert base64 string to Blob
          const byteString = atob(formData[key].split(",")[1]);
          const mimeString = formData[key]
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
          data.append(key, formData[key]);
        }
      }
    }

    try {
      const res = await endpoint.post("/user/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      SuccessAlert("✅ User added successfully!");
      setRefreshKey((prev) => prev + 1);
      handleClose();
    } catch (err) {
      ErrorAlert(err.response?.data?.description || "Upload failed");
    }
  };

  return (
    <div>
      {/* <Search.SearchStaff handleSearch={handleSearch} data={data}/> */}

      <Row>
        <Col sm={12} className="col-12">
          <Card>
            {/* <Card.Header>
              <Col className="card-title text-center mb-0"> USERS LIST </Col>
            </Card.Header> */}
            <Card.Header>
              <Col className="text-beginning">
                <Card.Title
                  as="h3"
                  style={{ color: "#0A7E51", fontWeight: 700 }}
                >
                  USERS LIST
                </Card.Title>
              </Col>
              <Col className="text-end">
                <Button
                  className="btn btn-sm"
                  type="button"
                  variant=""
                  // onClick={(e) => {
                  //   handleAppellantModal();
                  // }}
                  onClick={handleOpen}
                  style={{
                    backgroundColor: "#0A7E51",
                    borderColor: "#0A7E51",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  <span className="fa fa-plus"></span>
                  Add User
                </Button>
              </Col>
            </Card.Header>
            <Card.Body>
              <div className="">
                <div className="">
                  <Users.Users refreshKey={refreshKey} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Drawer on the left */}
      <Drawer anchor="left" open={open} onClose={handleClose}>
        <div style={{ width: 400, padding: "20px" }}>
          <h4 className="mb-3" style={{ color: "#0a7e51" }}>
            Add User
          </h4>
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
              autoComplete="off"
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
              autoComplete="new-password"
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
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department_id"
                value={formData.department_id}
                onChange={(e) => {
                  handleChange(e);
                  // reset unit when department changes
                  setFormData((prev) => ({ ...prev, unit_id: "" }));
                }}
              >
                <option value="">-- select department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Select
                name="unit_id"
                value={formData.unit_id}
                onChange={handleChange}
                disabled={!formData.department_id} // disable until dept is selected
              >
                <option value="">-- select unit --</option>
                {units
                  .filter(
                    (u) => u.department_id === parseInt(formData.department_id)
                  ) // filter units by dept
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
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

            {/* --- Signature Upload --- */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Signature</Form.Label>
              <Form.Control
                type="file"
                name="signature_url"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, signature_url: file });
                  }
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label> Draw Signature</Form.Label>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  width: "100%",
                  backgroundColor: "#f8f9fa3a",
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
                    style: {
                      backgroundColor: "#e9ecefd0",
                      // borderRadius: "5px",
                    },
                  }}
                  onEnd={() => {
                    if (!sigPadRef.current.isEmpty()) {
                      const dataUrl = sigPadRef.current.toDataURL("image/png");
                      setFormData({ ...formData, signature_url: dataUrl });
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
              <Button onClick={handleClose} variant="danger" className="me-2">
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </Form>
        </div>
      </Drawer>
    </div>
  );
}
