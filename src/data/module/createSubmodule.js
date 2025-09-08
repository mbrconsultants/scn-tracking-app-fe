import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import { Card, Row, Col, Modal, Button, FormGroup, Form } from "react-bootstrap"
import DataTable from "react-data-table-component";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import moment from 'moment';
import { ErrorAlert, SuccessAlert } from "../Toast/toast";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "react-select";
import Loader from "../Loader/loader";

export const CreateSubmodule = () => {
  const [modules, setModules] = useState([])
  const [submodule, setSubmodule] = useState({ module_id: '', submodule_name: '', route: '', icon: '', rank: '' })
  const [submodules, setSubmodules] = useState([])
  const [submoduleToEdit, setSubmoduleToEdit] = useState({ module_id: '', submodule_name: '', route: '', icon: '', rank: '' })
  const [submoduleToDelete, setSubmoduleToDelete] = useState({sub_id:'', submodule_name: '',})
  // const { user } = useContext(Context);
  // const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [id, setId] = useState("");
  // const submodulenameRef = useRef();
  // const routeRef = useRef();
  // //   const emodulenameRef = useRef();
  // const submodulerankRef = useRef();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // const [selectedOption, setSelectedOption] = useState("");
  // const [moduleOption, setModuleOption] = useState("");
  // //   const [modulename, setModulename] = useState("");
  // const [submodulerank, setSubmodulerank] = useState("");
  const [submodulename, setSubmodulename] = useState("");
  const [eroute, setEroute] = useState("");
  // const [mod, setMod] = useState("");
  // const [page, setPage] = useState(1);
  // const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    getModules();
    getSubmodules();
  }, []);

  const getModules = async () => {
    await endpoint.get('/modules/getAllModules')
      .then((res) => {
        console.log("modules", res.data.data)
        setModules(res.data.data)
      }).catch((err) => {
        console.log(err)
      })
  }

  const getSubmodules = async (id) => {
    setLoading(true)
    if (id) {
      console.log("a", id)
      setLoading(true)
      await endpoint.get(`/submodule/list/${id}`)
        .then((res) => {
          console.log("sub-modules and modules", res.data.data)
          setSubmodules(res.data.data)
          setLoading(false)
        }).catch((err) => {
          console.log(err.response.data.message)
          setLoading(false)
        })

    } else {
      await endpoint.get('/submodule/list')
        .then((res) => {
          console.log("sub-modules", res.data.data)
          setSubmodules(res.data.data)
          setLoading(false)
        }).catch((err) => {
          console.log(err.response.data.message)
          setLoading(false)
        })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submodule details", submodule)
    setLoading(true)
    endpoint.post("/submodule/create", submodule)
      .then((response) => {
        SuccessAlert(response.data.message);
        getSubmodules()
        setLoading(false)
        setSubmodule({ module_id: '', submodule_name: '', route: '', icon: '', rank: '' })
      }).catch((error) => {
        console.error(`Error: ${error}`);
        ErrorAlert(error.response.data.message)
        //   setError(error)
        setLoading(false)
      });

  }

  const handleEdit = async(e) => {
    // e.preventDefault();
    setLoading(true)
    console.log("to edit submodule", submoduleToEdit)
    endpoint.put(`/submodule/edit/${submoduleToEdit.sub_id}`, submoduleToEdit)
      .then((response) => {
        // console.log( response.data.message); 
        getSubmodules()
        setLoading(false)
        SuccessAlert(response.data.message)
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
        ErrorAlert(error.response.data.message)
        //   setError(error)
        setLoading(false)
      });
  }

  const handleDelete = (e) => {
    // e.preventDefault();
    setLoading(true)
    console.log("submodule id to delete", submoduleToDelete.sub_id)
    endpoint.delete(`/submodule/delete/${submoduleToDelete.sub_id}`)
      .then((response) => {
        getSubmodules()
        setDeleteOpen(false)
        setLoading(false)
        SuccessAlert(response.data.message)
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
        ErrorAlert(error.response.data.message)
        //   setError(error)
        setLoading(false)
      });
  }

  const reset = () => {
    setSubmodulename("");
    setEroute("");
    setId("");
  }

  const onClose = () => {
    reset();
    setOpen(false);
    setDeleteOpen(false);
  }


  const columns = [
    {
      name: "S/N",

      cell: (row, index) => (index + 1),
      width: "10%"
    },

    {
      name: "Module Name",
      selector: (row) => [row.Module.module_name],
      sortable: true,
      width: "23%",
      cell: (row) => (
        <h6 className="fs-12 fw-semibold">{row.Module? row.Module.module_name:""}</h6>
      ),
    },
    {
      name: <th> Submodule Name  </th>,
      selector: (row) => [row.submodule_name],
      sortable: true,
      width: "22%",
      cell: (row) => (
        <h6 className="fs-12 fw-semibold">{row.submodule_name}</h6>
      ),
    },
    {
      name: <th> Submodule Rank </th>,
      selector: (row) => [row.rank],
      sortable: true,
      width: "15%",
      cell: (row) => (
        <h6 className="fs-12 fw-semibold">{row.rank}</h6>
      ),
    },
    {
      name: <th> Icon </th>,
      selector: (row) => [row.icon],
      sortable: true,
      width: "15%",
      cell: (row) => (
        <h6 className="fs-12 fw-semibold">{row.icon}</h6>
      ),
    },
    {
      cell: (row) => (<Row > <Col xs={4} style={{ paddingRight: "0px", paddingLeft: "0px" }}>
        <button className="btn btn-sm btn-secondary"
          onClick={(e) => { setOpen(true); 
            setSubmoduleToEdit({ sub_id:row.id, module_id:row.module_id, submodule_name: row.submodule_name, route: row.route, icon: row.icon, rank: row.rank }) }} 
            variant="secondary" title="Action" size="sm"
        >
          Edit
        </button>

      </Col>
        <Col xs={4}><button className="btn btn-sm btn-danger"
        onClick={(e) => { setDeleteOpen(true); setSubmoduleToDelete({sub_id:row.id, submodule_name:row.submodule_name,}); }} variant="danger" title="Action" size="sm"
        >Delete
        </button>
        </Col></Row>)
    },

  ];

  return (
    <>
      <div>
        <div id="page-wrapper" className="box box-default">
          <div className="container-fluid">
            <br />
            <hr />
            <Card>
              <Card.Body>
                <form className="form-horizontal" onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} md={12}>
                      <div className="form-group">
                        <label htmlFor="">Select Module</label>
                        <select className="form-control" style={{ width: '100%', marginTop: '0px' }} required
                          onChange={(e) => { getSubmodules(e.target.value); setSubmodule({ ...submodule, module_id: e.target.value }); }}
                          value={submodule.module_id}
                        >
                          <option value=""> Select... </option>
                          {modules.map(module => (<option key={module.id} value={module.id}>{module.module_name}</option>))}
                        </select>
                      </div>
                    </Col>
                    <Col lg={6} md={12}>
                      <FormGroup>
                        <label htmlFor="exampleInputname1">Submodule Name</label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          required
                          value={submodule.submodule_name}
                          onChange={(e) => setSubmodule({ ...submodule, submodule_name: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} md={12}>
                      <FormGroup>
                        <label htmlFor="exampleInputname1">Route</label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          required
                          value={submodule.route}
                          onChange={(e) => setSubmodule({ ...submodule, route: e.target.value })}

                        />

                      </FormGroup>
                    </Col>
                    <Col lg={6} md={12}>
                      <FormGroup>
                        <label htmlFor="exampleInputname1">Rank</label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          value={submodule.rank}
                          onChange={(e) => setSubmodule({ ...submodule, rank: e.target.value })}

                        />

                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} md={12}>
                      <FormGroup>
                        <label htmlFor="exampleInputname1">Icon</label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          value={submodule.icon}
                          onChange={(e) => setSubmodule({ ...submodule, icon: e.target.value })}

                        />

                      </FormGroup>
                    </Col>

                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <button className="btn btn-success pull-right"
                      // onClick={handleSubmit}
                      >Add Submodule</button>
                    </Col>
                  </Row>
                </form>
              </Card.Body>
            </Card>

          </div>
        </div>

        <Card >
          <Card.Body >
            <h3 className="text-center">ALL SUBMODULES</h3>
            <Row className="row">
              <Col md={12} className="col-md-12">
                {!isLoading && <DataTable
                  fixedHeader
                  columns={columns}
                  // selectableRows
                  data={submodules}
                  // customStyles={customStyles}
                  // persistTableHead
                  defaultSortField="id"
                  defaultSortAsc={false}
                  striped={true}
                  center={true}
                  pagination
                  // onChangePage={handlePageChange}
                  // onChangeRowsPerPage={handlePerRowsChange}
                  // paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
                  // paginationPerPage={perPage}
                  highlightOnHover
                />
                }

                {isLoading && <Loader />}

                <Modal show={open} >

                  <Modal.Body className="text-center p-4">
                    <DialogTitle>Edit Sub Module
                      <Button
                        onClick={() => setOpen(false)}
                        className="btn-close"
                        variant=""
                        disabled={isLoading}
                      >
                        x
                      </Button>
                    </DialogTitle>
                    <DialogContent>

                      <Row className="row">
                        <Col> <br />
                          <Card>
                            <Card.Body>

                              <form className="form-horizontal" onSubmit={handleEdit}>
                                <Row>
                                  <Col lg={6} md={12}>
                                    <div className="form-group">
                                      <label htmlFor="">Select Module</label>
                                      <select className="form-control" style={{ width: '100%', marginTop: '0px' }} required
                                        onChange={(e) => setSubmoduleToEdit({ ...submoduleToEdit, module_id: e.target.value })}
                                        defaultValue={submoduleToEdit.module_id}
                                      >
                                        <option> Select... </option>
                                        {modules.map(module => (<option key={module.id} value={module.id}>{module.module_name}</option>))}
                                      </select>
                                    </div>
                                  </Col>
                                  <Col lg={6} md={12}>
                                    <FormGroup>
                                      <label htmlFor="exampleInputname1">Submodule Name</label>
                                      <Form.Control
                                        type="text"
                                        className="form-control"
                                        required
                                        defaultValue={submoduleToEdit.submodule_name}
                                        onChange={(e) => setSubmoduleToEdit({ ...submoduleToEdit, submodule_name: e.target.value })}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="mt-2">
                                  <Col lg={6} md={12}>
                                    <FormGroup>
                                      <label htmlFor="exampleInputname1">Route</label>
                                      <Form.Control
                                        type="text"
                                        className="form-control"
                                        required
                                        defaultValue={submoduleToEdit.route}
                                        onChange={(e) => setSubmoduleToEdit({ ...submoduleToEdit, route: e.target.value })}

                                      />

                                    </FormGroup>
                                  </Col>
                                  <Col lg={6} md={12}>
                                    <FormGroup>
                                      <label htmlFor="exampleInputname1">Rank</label>
                                      <Form.Control
                                        type="text"
                                        className="form-control"
                                        defaultValue={submoduleToEdit.rank}
                                        onChange={(e) => setSubmoduleToEdit({ ...submoduleToEdit, rank: e.target.value })}

                                      />

                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="mt-2">
                                  <Col lg={6} md={12}>
                                    <FormGroup>
                                      <label htmlFor="exampleInputname1">Icon</label>
                                      <Form.Control
                                        type="text"
                                        className="form-control"
                                        defaultValue={submoduleToEdit.icon}
                                        onChange={(e) => setSubmoduleToEdit({ ...submoduleToEdit, icon: e.target.value })}

                                      />

                                    </FormGroup>
                                  </Col>

                                </Row>
          
                              </form>

                            </Card.Body>
                          </Card>
                        </Col>

                        <Row>
                          <Col style={{ display: 'flex', justifyContent: 'center', marginLeft: "60px" }}>
                            <Button onClick={onClose} disabled={isLoading} variant="danger" className="me-1">Cancel</Button>
                          </Col>
                          <Col style={{ display: 'flex', justifyContent: 'center', marginLeft: "60px" }}>
                            <Button
                              onClick={() => {setOpen(false); handleEdit();}}
                              disabled={isLoading} variant="success" className={isLoading ? "me-1  btn-loading" : "me-1"}> {isLoading ? "Updating..." : "Update"}</Button>
                          </Col>
                        </Row>

                      </Row>

                    </DialogContent>
                    <DialogActions>

                    </DialogActions>
                    {/* </Dialog> */}
                  </Modal.Body>

                </Modal>

                <Modal show={deleteOpen}>
                  <Modal.Body className="text-center p-4">
                    <DialogTitle>Delete Module
                      <Button
                        onClick={onClose}
                        className="btn-close"
                        variant=""
                        disabled={isLoading}
                      >
                        x
                      </Button>
                    </DialogTitle>
                    <DialogContent>
                      <div>
                        <div className="modal-body">
                          <p>Do you really want to delete Sub module <span className="fw-bold">
                            {submoduleToDelete.submodule_name}
                          </span> <br /> This process cannot be undone.</p>
                        </div>
                        <Row>
                          <Col md={5} align="right">
                            <button type="button" className="btn btn-sm btn-secondary" onClick={onClose}>Cancel</button>
                          </Col>
                          <Col md={2} align="centre"></Col>
                          <Col md={5} align="left">
                            <button
                              onClick={handleDelete}
                              className="btn btn-sm btn-danger">Yes, Delete </button>
                          </Col>
                        </Row>
                      </div>
                    </DialogContent>
                  </Modal.Body>
                </Modal>

              </Col>
            </Row>
            {/* <!-- /.col -->  */}

          </Card.Body>
        </Card>

      </div>
    </>

  )
}