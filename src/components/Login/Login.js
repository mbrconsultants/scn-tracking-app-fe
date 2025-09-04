import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata";
import { Context } from "../../context/Context";
import endpoint from "../../context/endpoint";
import { toast } from 'react-toastify';

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { dispatch, isFetching } = useContext(Context)
  const [loading, setLoading] = useState(false)

  const errorAlert = () => {
    toast.error("Incorrect email or password", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    setLoading(true)
    try {
      const res = await endpoint.post("/auth/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })

      const modules = await endpoint.get(`/assignsubmodule/list/permission/user/${res.data.data.user.id}`)
      localStorage.setItem("modules", JSON.stringify(modules.data.data))

      delete res.data.data.user.password
      res.data.data && setLoading(false);
      res.data.data && dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
      res.data.data && window.location.replace('/')

    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE" });
        errorAlert(error.response.data.message)
        setLoading(false)
    }
  }

  return (
    <div className="login-container" style={{ 
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
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span className="fa fa-home"></span> Home
      </Link>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <Card className="login-card" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              width: '100%',
              margin: '0 auto'
            }}>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img
                    src={require("../../assets/images/brand/scnlogo.png")}
                    className="login-logo"
                    alt="Company Logo"
                    style={{
                      height: '60px',
                      marginBottom: '15px'
                    }}
                  />
                  <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Welcome Back</h3>
                  <p className="text-muted mb-0">Sign in to continue to your account</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent" style={{ borderRight: 'none' }}>
                        <i className="zmdi zmdi-email text-primary" aria-hidden="true"></i>
                      </span>
                      <input
                        id="email"
                        className="form-control"
                        type="email"
                        placeholder="Enter your email"
                        ref={emailRef}
                        required
                        style={{
                          borderLeft: 'none',
                          padding: '10px 12px',
                          borderRadius: '0 8px 8px 0'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                        Password
                      </label>
                      <Link
                        to={`${process.env.PUBLIC_URL}/forgotPassword/`}
                        className="text-primary small text-decoration-none"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent" style={{ borderRight: 'none' }}>
                        <i className="zmdi zmdi-lock text-primary" aria-hidden="true"></i>
                      </span>
                      <input
                        id="password"
                        className="form-control"
                        type="password"
                        placeholder="Enter your password"
                        ref={passwordRef}
                        required
                        style={{
                          borderLeft: 'none',
                          padding: '10px 12px',
                          borderRadius: '0 8px 8px 0'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <button 
                      className={`btn w-100 py-2 fw-semibold ${loading ? "btn-primary btn-loading" : "btn-primary"}`}
                      disabled={isFetching}
                      style={{
                        borderRadius: '8px',
                        border: '0',
                        background: 'linear-gradient(45deg, #4b6cb7, #182848)',
                        fontSize: '1rem',
                        position: 'relative'
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <p className="mb-0 text-muted">
                      Don't have an account?{' '}
                      <Link
                        to={`${process.env.PUBLIC_URL}/register/`}
                        className="text-primary text-decoration-none fw-semibold"
                      >
                        Create Account
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
        .login-card {
          transition: transform 0.3s ease;
        }
        
        .login-card:hover {
          transform: translateY(-5px);
        }
        
        .form-control:focus {
          box-shadow: none;
          border-color: #4b6cb7;
        }
        
        .input-group-text {
          border-radius: 8px 0 0 8px !important;
        }
        
        .btn-loading {
          opacity: 0.8;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .login-card {
            margin-top: 40px;
          }
        }
      `}</style>
    </div>
  );
}