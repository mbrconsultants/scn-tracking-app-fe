import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import { Card, Row, Col, Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import moment from "moment";
import { ErrorAlert, SuccessAlert } from "../Toast/toast";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "react-select";
import Loader from "../Loader/loader";
import "./assign.css";


export const AssignModuleToRole = () => {
    const [roles, setRoles] = useState([])
    const [role_id, setRole] = useState('')
    const [moduleSubmodules, setModuleSubmodules] = useState([])
    const [selectedSubmodules, setSelectedSubmodules] = useState([])
    const [alreadyAssigned, setAlreadyAssigned] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getRoles()
        modulesAndSubmodules()
    }, [])

    //get list of roles
    const getRoles = async () => {
        await endpoint.get(`/role/getRoles`)
            .then((res) => {
                console.log("roles", res.data.data)
                setRoles(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    //get list of modules and their respective submodules
    const modulesAndSubmodules = async () => {
        await endpoint.get(`/submodule/list/module`)
            .then((res) => {
                console.log("sub and module ist", res.data.data)
                setModuleSubmodules(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    //get list of assigned submodules
    const getAlreadyAssigned = async (role_id) => {
        if (role_id) {
            await endpoint.get(`/assignsubmodule/list/${role_id}`)
                .then((res) => {
                    console.log("already assigned", res.data.data)
                    setAlreadyAssigned(res.data.data.map(({ submodule_id }) => submodule_id))
                    if(res.data.data == ''){
                        setSelectedSubmodules([])
                    }
                    else{
                        setSelectedSubmodules(res.data.data.map(({ submodule_id }) => submodule_id))
                    }
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            setAlreadyAssigned([]);
            setSelectedSubmodules([]);
        }
    }

    const handleRoleChange = (role_id) => {
        if(role_id == ''){
            setRole()
            setAlreadyAssigned([]);
            setSelectedSubmodules([]);
        }else{
            setRole(role_id);
            setAlreadyAssigned([]);
            setSelectedSubmodules([]);
            getAlreadyAssigned(role_id)
        }
        
    }

    const toggleAlreadyChecked = (id, e) => {
        console.log(e)
        if (e === true) {
            console.log("b1")
            setSelectedSubmodules([...selectedSubmodules, id])
        }
        if (e === false) {
            console.log("b2")
            setSelectedSubmodules(selectedSubmodules.filter((item) => id !== item))

            //this helps uncheck the already assigned check box
            setAlreadyAssigned(alreadyAssigned.filter((item) => id !== item))
        }
    }

    const toggleCheckbox = (id, e) => {
        console.log(e)
        if (e === true) {
            console.log("c1")
            setSelectedSubmodules([...selectedSubmodules, id])
        }
        if (e === false) {
            console.log("c2")
            setSelectedSubmodules(selectedSubmodules.filter((item) => id !== item))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        console.log("sel sub", selectedSubmodules)
        let submodule_id = selectedSubmodules;
        console.log("submodules to back end", { submodule_id, role_id })
        await endpoint.post(`/assignsubmodule/create/multiple`, { submodule_id, role_id })
            .then((res) => {
                setIsLoading(false)
                SuccessAlert(res.data.message)
                setAlreadyAssigned([])
                setSelectedSubmodules([])
                getAlreadyAssigned(role_id)

            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            <div className="row">
                <div className="col-lg-8 offset-2">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Choose a role and assign submodule</h4>
                        </div>

                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="">Select Role</label>
                                <select className="form-control" style={{ width: '100%', marginTop: '0px' }} required
                                    value={role_id && role_id}
                                    onChange={(e) => {
                                        handleRoleChange(e.target.value)
                                    }}
                                >
                                    <option value=""> Select... </option>
                                    {roles.map((role) => (<option key={role.id} value={role.id}>{role.role_name}</option>))}
                                </select>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="table-responsive" style={{ paddingTop: `20px` }}>

                                    <table className="table table-striped">

                                        <thead>
                                            <tr>
                                                <th>Modules</th>
                                                <th>Submodules</th>
                                            </tr>
                                        </thead>

                                        {isLoading &&
                                            <Loader />
                                        }
                                        {!isLoading &&
                                            <tbody>
                                                {moduleSubmodules && moduleSubmodules.map((ms) => (
                                                    <tr>
                                                        <div className="row">
                                                            <div className="col-md-12" style={{padding:`5px`}}>
                                                                <td>{ms.module_name.toUpperCase()}</td>
                                                            </div>
                                                        </div>
                                                        
                                                        <td>
                                                            <div className="row" style={{ width: `100%`, background: ``, float: `left` }}>
                                                                {ms.SubModules && ms.SubModules.map((s) => (
                                                                    <>
                                                                        <div className="col-md-6" style={{ width: `50%`}}>
                                                                            <td>{s.submodule_name} </td>
                                                                        </div>

                                                                        <div className="col-md-6" style={{ width: `50%`, alignContent: `end`}}>
                                                                            <td>
                                                                                {/* {s.id} */}
                                                                                <label className="switch">
                                                                                    {alreadyAssigned && alreadyAssigned.includes(s.id) ?
                                                                                        <input type="checkbox" checked value={s.id} onChange={(e) => {
                                                                                            toggleAlreadyChecked(s.id, e.target.checked)
                                                                                            console.log("a1", e.target.checked)
                                                                                        }} />
                                                                                        : <input type="checkbox" value={s.id} onChange={(e) => {
                                                                                            toggleCheckbox(s.id, e.target.checked)
                                                                                            console.log("a2", e.target.checked)
                                                                                        }} />
                                                                                    }
                                                                                    <span className="slider round"></span>
                                                                                </label>
                                                                            </td>
                                                                        </div>
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))}


                                            </tbody>
                                        }

                                    </table>

                                    <div className="pull-right">
                                        <button className="btn btn-success" type="submit"
                                        >Update</button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

