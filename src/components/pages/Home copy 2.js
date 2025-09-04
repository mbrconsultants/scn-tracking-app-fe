import React from "react";
import { useState, useContext, useEffect, useRef } from "react";

import { Carousel, Breadcrumb, Row, Card, Col } from "react-bootstrap";
// import Img1 from "./img/banner.jpeg";
// import Img2 from "./img/scnhomepage.jpeg";
// import About1 from "./img/courtBackground.jpeg";
import { Context } from "../../context/Context";

const Home = () => {
  const { user } = useContext(Context);
  // console.log("user", user) #008751
  return (
    <>
      <div className="container-fluid p-0 wow fadeIn" data-wow-delay="0.1s">
        <div id="" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                className="w-100"
                // src={Img1}
                alt="Image"
                style={{ width: `100%`, height: "700px" }}
              />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-8">
                      <h4 className="display-1 text-white mb-5 animated slideInDown">
                        Notary Public Application Portal
                      </h4>
                      <a
                        href={`${process.env.PUBLIC_URL}/application`}
                        className="btn btn-primary py-sm-3 px-sm-4"
                      >
                        Apply Now <span className="fa fa-forward"></span>{" "}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img 
                className="w-100" 
                // src={Img2} 
                alt="Image" 
              />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-7">
                      <h1 className="display-1 text-white mb-5 animated slideInDown">
                        Create Your Own Small Garden At Home
                      </h1>
                      <a href="#" className="btn btn-primary py-sm-3 px-sm-4">
                        Explore More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="container-fluid top-feature py-5 pt-lg-0">
        <div className="container py-5 pt-lg-0">
          <div className="row gx-0">
            <div className="col-lg-3 wow fadeIn" data-wow-delay="0.1s">
              <div
                className="bg-white shadow d-flex align-items-center h-100 px-3 py-3"
                style={{ minHeight: 160 }}
              >
                <div className="d-flex">
                  <div className="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                    <i className="fa fa-tachometer text-primary" />
                  </div>
                  <div className="ps-3">
                    <h4>Simple, Fast, and Reliable</h4>
                    <span> seamless experience tailored to your needs.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 wow fadeIn" data-wow-delay="0.1s">
              <div
                className="bg-white shadow d-flex align-items-center h-100 px-3 py-3"
                style={{ minHeight: 160 }}
              >
                <div className="d-flex">
                  <div className="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                    <i className="fa fa-bell text-primary" />
                  </div>
                  <div className="ps-3">
                    <h4>Real-time Notifications</h4>
                    <span>Stay updated every step of the way.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 wow fadeIn" data-wow-delay="0.3s">
              <div
                className="bg-white shadow d-flex align-items-center h-100 px-3 py-3"
                style={{ minHeight: 160 }}
              >
                <div className="d-flex">
                  <div className="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                    <i className="fa fa-rocket text-primary" />
                  </div>
                  <div className="ps-3">
                    <h4>Quick Processing </h4>
                    <span>Fast-track your certification with ease.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 wow fadeIn" data-wow-delay="0.5s">
              <div
                className="bg-white shadow d-flex align-items-center h-100 px-3 py-3"
                style={{ minHeight: 160 }}
              >
                <div className="d-flex">
                  <div className="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                    <i className="fa fa-lock text-primary" />
                  </div>
                  <div className="ps-3">
                    <h4>Secure Online Payments</h4>
                    <span>Process transactions with confidence.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div
              className="col-lg-6 col-md-12 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="row g-5">
                <div className="col-12 col-sm-6 col-lg-12">
                  <div className="border-start ps-4">
                    <i className="fa fa-user-plus fa-3x text-primary mb-3" />
                    <h4 className="mb-3">Step 1: Create Your Profile</h4>
                    <span>
                      Click <a
                        className=""
                        href="/application"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontWeight: 700 }}
                      ><strong style={{ color: "red" }}>here</strong></a> to create a profile. For this, you will need your legal mail, click
                      &nbsp;
                      <a
                        className=""
                        href="https://nigerianbar.ng"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontWeight: 700 }}
                      >
                        <strong style={{ color: "red" }}>here</strong>
                      </a>{" "}
                      &nbsp; to create a legal mail if you do not have any.
                      {/* to create your profile. Complete the online form with your details
                                            to initiate your Notary Public application. */}
                    </span>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-12">
                  <div className="border-start ps-4">
                    <i className="fa fa-credit-card fa-3x text-primary mb-3" />
                    <h4 className="mb-3">Step 2: Make Payment</h4>
                    <span>
                      Pay securely online through the unique link sent to your
                      email. Our payment process is quick, safe, and easy.
                    </span>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-12">
                  <div className="border-start ps-4">
                    <i className="fa fa-lock fa-3x text-primary mb-3" />
                    <h4 className="mb-3">Step 3: Set Up Login Credentials</h4>
                    <span>
                      Create a secure password to access your account.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-md-12 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="row g-5">
                <div className="col-12 col-sm-6 col-lg-12">
                  <div className="border-start ps-4">
                    <i className="fa fa-sign-in fa-3x text-primary mb-3" />
                    <h4 className="mb-3">Step 4: Login to Your Account </h4>
                    <span>
                      Log in to your profile to submit your Notary Public
                      application.
                    </span>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-12">
                  <div className="border-start ps-4">
                    <i className="fa fa-upload fa-3x text-primary mb-3" />
                    <h4 className="mb-3">Step 5: Upload Required Documents</h4>
                    <span>
                      Complete the application form and attach necessary
                      documents, click{" "}
                      <a href="/how-to">
                        <i style={{ color: "red" }}>here</i>
                      </a>{" "}
                      to see application requirements
                    </span>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-12">
                  <div className="border-start ps-4">
                    <i className="fa fa-thumbs-up fa-3x text-primary mb-3" />
                    <h4 className="mb-3">
                      Step 6: Review, Recommendation, Approval & Certificate
                    </h4>
                    <span>
                      Your application will be reviewed and processed. Check
                      your application dashboard for progress updates.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
