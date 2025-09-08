import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import { Card, Row, Col, Modal, Button } from "react-bootstrap"
import DataTable from "react-data-table-component";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import moment from 'moment';
import { ErrorAlert, SuccessAlert } from "../Toast/toast";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Loader from "../Loader/loader";

export const CreateModule = () => {
  const { user } = useContext(Context);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handlePageChange = page => {
    setPage(page);
  }

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [idToDelete, setIdToDelete] = useState('')

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  }

  const [module, setModule] = useState({
    module_name: '',
    rank: '',
    icon: ''
  });

  const [newModule, setNewModule] = useState({
    module_id:'', module_name:'', rank:'', icon: ''
  })

  useEffect(() => {
    getAllData();
  }, []);


  const getAllData = async () => {
    await endpoint.get(`/modules/getAllModules`)
      .then((res) => {
        console.log("all modules", res.data.data)
        setData(res.data.data)
      })
      .catch((err) => console.log(err))
  } 

  const onEdit = (row) => {
    console.log("module to edit", row.id)
    setNewModule({...newModule, module_id:row.id, module_name:row.module_name, rank:row.rank, icon:row.icon})
    setOpen(true);
    console.log("module to update", newModule)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("module", module)
   await endpoint.post(`/modules/createModule`, module).then(res => {
        console.log(res)
        setModule({...module, module_name:'', rank: '', icon:''})
        getAllData()
        SuccessAlert(res.data.message);
        setLoading(false);
    }).catch((err) => {
        setLoading(false);
        ErrorAlert(err.response.data.message)
        console.log(err)
    });
}

  const handleEdit = async () => {
    // console.log("module id to update", newModule.module_id)
    setLoading(true)
    // console.log("my updating data", newModule)
    await endpoint.put(`modules/updateModule/${newModule.module_id}`, newModule).then((res) => {
      console.log(res.data);
      getAllData()
      setLoading(false)
      setOpen(false);
      SuccessAlert(res.data.message)

    }).catch((err) => {
      setLoading(false)
      ErrorAlert(err.response.data.message)
      console.log(err)
    })
  }

  const onDelete = (row) => {
    console.log("role to delete", row.id)
    setOpen(false);
    setIdToDelete(row.id);
    setDeleteOpen(true);
  }
  

  const handleDelete = async (e) => {
    console.log("module to delete", idToDelete)
    e.preventDefault()
    await endpoint.delete(`/modules/deleteModule/${idToDelete}`).then((res) => {
      console.log(res.data)
      SuccessAlert(res.data.message)
      getAllData()
      setLoading(false)
      setDeleteOpen(false);
    }).catch((err) => {
      setLoading(false)
      ErrorAlert(err.response.data.message)
      console.log(err)
    })
  }

  const reset = () => {
    setId("")
    setModule("")
  }

  const onClose = () => {
    reset();
    setOpen(false);
    setDeleteOpen(false);
  }
  const columns = [
    {
      name: "#",

      cell: (row, index) => (index + 1) + ((page - 1) * perPage),
      width: "10%"
    },

    {
      name: "Module Name",
      selector: (row) => [row.module_name],
      sortable: true,
      width: "40%",
      cell: (row) => (
        <h6 className="fs-12 fw-semibold">{row.module_name}</h6>
      ),
    },
    {
      name: "Rank",
      selector: (row) => [row.rank],
      sortable: true,
      width: "15%",
      cell: (row) => (
        <h6 className="fs-12 fw-semibold">{row.rank}</h6>
      ),
    },
    {
      name: "Icon",
      selector: (row) => [row.icon],
      sortable: true,
      width: "20%",
      cell: (row) => (
        <h6 className="fs-12 fw-semibold">{row.icon}</h6>
      ),
    },

    {
      name: "Action",
      cell: (row) => (<Row > <Col xs={4} style={{ paddingRight: "0px", paddingLeft: "0px" }}><button className="btn btn-sm btn-secondary" 
      onClick={(e) => { onEdit(row) }} 
      variant="secondary" title="Action" size="sm">Edit</button>

      </Col><Col xs={4}>
        <button className="btn btn-sm btn-danger" 
            onClick={(e) => { onDelete(row) }} 
            variant="danger" title="Action" size="sm"
          >Delete
        </button>
      </Col>
      </Row>)
    },

  ];

  return (
    <>
      {isLoading ?

        <Loader /> :

        <div>
          <div id="page-wrapper" className="box box-default">
            <div className="container-fluid">
              <div className="col-md-12 text-success">
              </div>
              <br />
              <hr />
              <Row className="row">
                <Col xs={2} md={2}></Col>
                <Col xs={8} md={8} > <br />

                  <Card >

                    <Card.Body>
                      <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="form-group">
                          <label className="col-md-6 cecontrol-label">Module Name</label>
                          <div className="col-md-12">
                            <input type="text" className="form-control" name="module_name"
                              value={module.module_name}
                              onChange={(e) => {
                                setModule({...module, module_name: e.target.value})
                              }}  
                            required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-md-6 cecontrol-label">Module Rank</label>
                          <div className="col-md-12">
                            <input type="text" className="form-control " name="rank"  
                              value={module.rank}
                              onChange={(e) => {
                                setModule({...module, rank: e.target.value})
                              }} 
                            required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-md-6 cecontrol-label">Icon</label>
                          <div className="col-md-12">
                            <input type="text" className="form-control" name="icon"  
                             value={module.icon}
                              onChange={(e) => {
                                setModule({...module, icon: e.target.value})
                              }} 
                            required />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-sm-offset-2 text-center col-sm-9">
                            <button type="submit" className="btn btn-success pull-right"                              
                            >Add Module</button>
                          </div>
                        </div>
                      </form>
                    </Card.Body>

                  </Card>
                </Col>
                <Col xs={3} md={4}></Col>
              </Row>
            </div>
          </div>
          <Card >
            <Card.Body >
              <h3 className="text-center">ALL MODULES</h3>
              <Row className="row">
                <Col md={12} className="col-md-12">
                  <DataTable
                    //  fixedHeader
                    columns={columns}
                    // selectableRows
                    data={data}
                    // customStyles={customStyles}
                    // persistTableHead
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

                  <Modal show={open} >

                    <Modal.Body className="text-center p-4">
                      <DialogTitle>Edit Module
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

                        <Row className="row">

                          <Col  > <br />

                            <Card >

                              <Card.Body>
                              <form className="form-horizontal">
                                  <div className="form-group">
                                    <label className="col-md-6  cecontrol-label">Module Name</label>
                                    <div className="col-md-12">
                                      <input id="module_name" type="text" className="form-control" 
                                      defaultValue={newModule.module_name} 
                                      onChange={(e) => setNewModule({...newModule, module_name: e.target.value })} 
                                      required />
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label className="col-md-6  cecontrol-label">Rank</label>
                                    <div className="col-md-12">
                                      <input id="rank" type="text" className="form-control"  
                                      defaultValue={newModule.rank} 
                                      onChange={(e) => setNewModule({...newModule, rank: e.target.value })} 
                                      required />
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="col-md-6  cecontrol-label">Icon</label>
                                    <div className="col-md-12">
                                      <input id="icon" type="text" className="form-control" name="icon" 
                                      defaultValue={newModule.icon} 
                                      onChange={(e) => setNewModule({...newModule, icon: e.target.value })} 
                                      required />
                                    </div>
                                  </div>

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
                              onClick={handleEdit} 
                              disabled={isLoading} variant="success" className={isLoading ? "me-1  btn-loading" : "me-1"}> {isLoading ? "Save" : "Save"}</Button>
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
                            <p>Do you really want to delete <span className="fw-bold">
                              </span> module? <br /> This process cannot be undone.</p>
                          </div>
                          <Row>
                            <Col xs={5} md={5} align="right">
                              <button type="button" className="btn btn-sm btn-secondary" disabled={isLoading} onClick={onClose}>Cancel</button>
                            </Col>
                            <Col xs={1} md={1}  ></Col>
                            <Col xs={5} md={5} align="left">
                              <button 
                                onClick={handleDelete} 
                                disabled={isLoading} className="btn btn-sm btn-danger">Yes, Delete </button>
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
      }
    </>
  )
  
}