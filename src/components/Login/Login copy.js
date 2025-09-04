import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import endpoint from "../../context/endpoint"
import { toast } from 'react-toastify';
import { Context } from "../../context/Context";
// import Img1 from './scnhomepage2.jpg';
import Swal from "sweetalert2";

const Login = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { dispatch, isFetching } = useContext(Context)
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()

    const errorAlert = (message) => {
        Swal.fire({
            icon: "error",
            title: "Login Error",
            text: message || "Incorrect email or password.",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        setLoading(true)
        
        const email = emailRef.current.value;
        
        try {
            const res = await endpoint.post("/auth/login", {
                email: email,
                password: passwordRef.current.value,
            })

            console.log("Login response:", res.data);

            // Check if OTP verification is required
            if (res.data.data?.otpSent) {
                // Store email in localStorage or state for OTP verification
                localStorage.setItem("otpEmail", email);
                
                // Show success message
                Swal.fire({
                    icon: "success",
                    title: "OTP Sent",
                    text: res.data.message || "OTP has been sent to your email address.",
                    confirmButtonText: "Continue to Verify",
                }).then(() => {
                    // Redirect to OTP verification page with email
                    navigate(`${process.env.PUBLIC_URL}/otp-verification`, { 
                        state: { email: email } 
                    });
                });
                return;
            }

            // If no OTP required, proceed with normal login
            // (This part might need adjustment based on your normal login response)
            const userId = res.data.data.user.id;
            const modules = await endpoint.get(`/assignsubmodule/list/permission/user/${userId}`)
            console.log("User modules:", modules.data.data)

            localStorage.setItem("modules", JSON.stringify(modules.data.data))

            delete res.data.data.user.password
            console.log("Login successful:", res.data.data)
            setLoading(false);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
            window.location.replace('/')

        } catch (error) {
            dispatch({ type: "LOGIN_FAILURE" });
            console.error("Login error:", error);

            // Extract the error message
            let errorMessage = "Authentication failed. Wrong credential.";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Display the error in SweetAlert
            errorAlert(errorMessage);
            
            setLoading(false)
        }
    }

    return (
        <>
            <div
                className="login-background py-5 d-flex align-items-center"
                style={{
                    // backgroundImage: `url(${Img1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    position: "relative"
                }}
            >
                <div 
                    className="overlay"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        zIndex: 1
                    }}
                ></div>
                <div 
                    className="container position-relative"
                    style={{ zIndex: 2 }}
                >
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="text-center mx-auto text-white" style={{ maxWidth: "500px" }}>
                                <h1 className="display-5 mb-2 text-light">Login</h1>
                                <p className="fs-5 fw-bold text-light">
                                    <i className="fa fa-lock"></i> Enter your credentials to login
                                </p>
                            </div>
                            <form className="bg-light shadow rounded p-5" onSubmit={handleSubmit}>
                                <div className="text-center">
                                    <img
                                        src={require("../../assets/images/brand/scnlogo.png")}
                                        className="header-brand-img"
                                        alt=""
                                    />
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label><i className="fa fa-inbox"></i> Email</label>
                                        <input
                                            type="email"
                                            className="form-control rounded-pill"
                                            placeholder="Enter your email"
                                            ref={emailRef}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col">
                                        <label><i className="fa fa-key"></i> Password</label>
                                        <input
                                            type="password"
                                            className="form-control rounded-pill"
                                            placeholder="Enter your password"
                                            ref={passwordRef}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button
                                        className="btn btn-primary btn-lg rounded-pill px-4"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : (
                                            <i className="fa fa-arrow-right me-2"></i>
                                        )}
                                        Login
                                    </button>
                                </div>
                                <div className="text-center p-2">
                                    <p className="mb-0">
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/forgotPassword/`}
                                            className="text-primary ms-1"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </p>
                                </div>

                                {/* New Section for Navigation Links */}
                                <div className="d-flex justify-content-between mt-4">
                                    <Link
                                        to={`${process.env.PUBLIC_URL}/home`}
                                        className="text-primary fs-8"
                                    >
                                        <span className="fa fa-arrow-left"></span> Back to Home
                                    </Link>
                                    <Link
                                        to={`${process.env.PUBLIC_URL}/application`}
                                        className="text-primary fs-8"
                                    >
                                        Create Profile <span className="fa fa-arrow-right"></span>
                                    </Link>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;