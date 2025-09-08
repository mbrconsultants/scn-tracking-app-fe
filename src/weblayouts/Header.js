import React from 'react'
import ScnLogo from './assets/img/scnlogo.png'
import { useState, useContext } from "react";
import { Context } from "../context/Context";



const Header = () => {
    const [open, setOpen] = useState(false)
    const toggleNav = () => {
        setOpen(!open)
    }
    const { user } = useContext(Context);
    console.log("user", user)
    return (
        <>
            {/* <div>
                <div className="container-fluid bg-dark text-light px-0 py-2"
                    style={{ backgroundColor: '#008751' }}>
                    <div className="row gx-0 d-none d-lg-flex">
                        <div className="col-lg-7 px-5 text-start">

                            <div className="h-100 d-inline-flex align-items-center">
                                <span className="fa fa-envelope me-2" />
                                <span>notary@supremecourt.gov.ng</span>
                            </div>
                        </div>

                    </div>
                </div>
                <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0">
                    <a href={process.env.PUBLIC_URL} className="navbar-brand d-flex align-items-center px-4 px-lg-5">
                        <img className="m-0" src={ScnLogo} style={{ width: `80px`, height: `80px` }} alt='logo' />
                    </a>
                    {open && <>
                        <button type="button" className={`navbar-toggler me-4`} data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                            onClick={toggleNav}
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className={`collapse navbar-collapse show`} id="navbarCollapse">
                            <div className="navbar-nav ms-auto p-4 p-lg-0">
                                <ul>
                                    <li><a href="/home" className="nav-item nav-link">HOME</a></li>
                                    <li><a href="/how-to" className="nav-item nav-link">HOW TO</a></li>
                                    {!user && user == null && (
                                        <li><a href="/application" className="nav-item nav-link">APPLY NOW</a></li>
                                    )}
                                    <li><a href="/contact" className="nav-item nav-link">CONTACT</a></li>
                                    <li><a href="/login" className="btn btn-primary py-4 px-lg-4">Login<i className="fa fa-arrow-right ms-3" /></a></li>
                                </ul>
                            </div>
                        </div>
                    </>}
                    {!open && <>
                        <button type="button" className={`navbar-toggler me-4 collapsed`} data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                            onClick={toggleNav}
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className={`collapse navbar-collapse`} id="navbarCollapse">
                            <div className="navbar-nav ms-auto p-4 p-lg-0">
                                <a href="/home" className="nav-item nav-link active">HOME</a>
                                <a href="/how-to" className="nav-item nav-link">HOW TO</a>
                                {!user && user == null && (
                                    <a href="/application" className="nav-item nav-link">APPLY NOW</a>
                                )}
                                <a href="/contact" className="nav-item nav-link">CONTACT</a>
                            </div>
                            <a href="/login" className="btn btn-primary py-4 px-lg-4 rounded-0 d-none d-lg-block">Login<i className="fa fa-arrow-right ms-3" /></a>
                        </div>
                    </>}
                </nav>
            </div> */}

        </>
    )
}

export default Header