import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as custompagesswitcherdata from "../../../data/Switcher/Custompagesswitcherdata"

export default function Register() {
  const [formData, setFormData] = useState({
    surname: "",
    first_name: "",
    middle_name: "",
    email: "",
    password: "",
    status: "active",
    signature_url: "",
    unit_id: "",
    department_id: "",
    role_id: "",
    file_number: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="register-container" style={{ 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/img/courtBackground.jpg)`, 
      backgroundRepeat: `no-repeat`, 
      backgroundSize: `cover`,
      backgroundPosition: `center`,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Home Button */}
      <Link
        to={`${process.env.PUBLIC_URL}/home/`}
        className="btn btn-outline-light home-btn"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          borderRadius: '50px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem'
        }}
      >
        <span className="fa fa-home"></span> Home
      </Link>

      {/* Settings Button */}
      <div className="dropdown float-end custom-layout" style={{
        position: 'absolute',
        top: '20px',
        right: '20px'
      }}>
        <div className="demo-icon nav-link icon bg-primary" onClick={() => custompagesswitcherdata.Swichermainright()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <i className="fe fe-settings fa-spin text-light"></i>
        </div>
      </div>

      <div className="container" onClick={() => custompagesswitcherdata.Swichermainrightremove()}>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-8 col-md-10 col-sm-12">
            <Card className="register-card" style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              width: '100%',
              margin: '0 auto',
              maxWidth: '800px'
            }}>
              <Card.Body className="p-3">
                <div className="text-center mb-3">
                  <img
                    src={require("../../../assets/images/brand/scnlogo.png")}
                    className="register-logo"
                    alt="Company Logo"
                    style={{
                      height: '50px',
                      marginBottom: '12px'
                    }}
                  />
                  <h4 className="fw-bold mb-1" style={{ color: '#2c3e50', fontSize: '1.25rem' }}>Create Account</h4>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Complete all fields to register</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Column 1 */}
                    <div className="col-md-6">
                      {/* Surname */}
                      <div className="mb-2">
                        <label htmlFor="surname" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Surname *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="mdi mdi-account text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="surname"
                            name="surname"
                            className="form-control"
                            type="text"
                            placeholder="Enter your surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            required
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* First Name */}
                      <div className="mb-2">
                        <label htmlFor="first_name" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          First Name *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="mdi mdi-account text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="first_name"
                            name="first_name"
                            className="form-control"
                            type="text"
                            placeholder="Enter your first name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Middle Name */}
                      <div className="mb-2">
                        <label htmlFor="middle_name" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Middle Name
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="mdi mdi-account text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="middle_name"
                            name="middle_name"
                            className="form-control"
                            type="text"
                            placeholder="Enter your middle name"
                            value={formData.middle_name}
                            onChange={handleInputChange}
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="mb-2">
                        <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Email Address *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="zmdi zmdi-email text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="email"
                            name="email"
                            className="form-control"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="mb-2">
                        <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Password *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="zmdi zmdi-lock text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="password"
                            name="password"
                            className="form-control"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="col-md-6">
                      {/* Status */}
                      {/* <div className="mb-2">
                        <label htmlFor="status" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Status *
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="form-select"
                          value={formData.status}
                          onChange={handleInputChange}
                          required
                          style={{
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div> */}

                      {/* Signature URL */}
                      <div className="mb-2">
                        <label htmlFor="signature_url" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Signature URL
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="mdi mdi-link text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="signature_url"
                            name="signature_url"
                            className="form-control"
                            type="url"
                            placeholder="Enter signature URL"
                            value={formData.signature_url}
                            onChange={handleInputChange}
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Unit ID */}
                      <div className="mb-2">
                        <label htmlFor="unit_id" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Unit ID
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="mdi mdi-office-building text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="unit_id"
                            name="unit_id"
                            className="form-control"
                            type="text"
                            placeholder="Enter unit ID"
                            value={formData.unit_id}
                            onChange={handleInputChange}
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Department ID */}
                      <div className="mb-2">
                        <label htmlFor="department_id" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Department ID
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="mdi mdi-domain text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="department_id"
                            name="department_id"
                            className="form-control"
                            type="text"
                            placeholder="Enter department ID"
                            value={formData.department_id}
                            onChange={handleInputChange}
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Role ID */}
                      <div className="mb-2">
                        <label htmlFor="role_id" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          Role ID *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="mdi mdi-account-key text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="role_id"
                            name="role_id"
                            className="form-control"
                            type="text"
                            placeholder="Enter role ID"
                            value={formData.role_id}
                            onChange={handleInputChange}
                            required
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* File Number */}
                      <div className="mb-3">
                        <label htmlFor="file_number" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.85rem' }}>
                          File Number
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent" style={{ borderRight: 'none', padding: '0.4rem 0.6rem' }}>
                            <i className="mdi mdi-file-document text-primary" aria-hidden="true"></i>
                          </span>
                          <input
                            id="file_number"
                            name="file_number"
                            className="form-control"
                            type="text"
                            placeholder="Enter file number"
                            value={formData.file_number}
                            onChange={handleInputChange}
                            style={{
                              borderLeft: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="termsCheck" 
                        style={{ cursor: 'pointer', width: '0.85rem', height: '0.85rem', marginTop: '0.15rem' }}
                        required
                      />
                      <label className="form-check-label" htmlFor="termsCheck" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                        I agree to the{' '}
                        <Link 
                          to={`${process.env.PUBLIC_URL}/pages/terms/`}
                          className="text-primary text-decoration-none fw-semibold"
                        >
                          terms and policy
                        </Link>
                      </label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 fw-semibold"
                      style={{
                        borderRadius: '6px',
                        border: '0',
                        background: 'linear-gradient(45deg, #4b6cb7, #182848)',
                        fontSize: '0.9rem'
                      }}
                    >
                      Create Account
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                      Already have an account?{' '}
                      <Link
                        to={`${process.env.PUBLIC_URL}/custompages/login`}
                        className="text-primary text-decoration-none fw-semibold"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        .register-card {
          transition: transform 0.3s ease;
        }
        
        .register-card:hover {
          transform: translateY(-3px);
        }
        
        .form-control:focus, .form-select:focus {
          box-shadow: none;
          border-color: #4b6cb7;
        }
        
        .input-group-text {
          border-radius: 6px 0 0 6px !important;
        }
        
        .form-check-input:checked {
          background-color: #4b6cb7;
          border-color: #4b6cb7;
        }
        
        @media (max-width: 768px) {
          .register-card {
            margin-top: 30px;
          }
          
          .row > div {
            width: 100%;
            flex: none;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}