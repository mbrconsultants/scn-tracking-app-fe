import React from "react";
import ScnLogo from "./assets/img/scnlogo.png";

const Footer = () => {
  const year = new Date();
  const curYear = year.getFullYear();
  return (
    <>
      <div>
        <div
          className="container-fluid bg-dark text-light footer mt-5 py-0 wow fadeIn"
          data-wow-delay="0.1s"
        >
          <div className="container py-5">
            <div className="row g-5">
              <div className="col-lg-4 col-md-6">
                {/* <div className="d-flex pt-2" style={{ textAlign: 'center' }}>
                                    <img className="m-0" src={ScnLogo} style={{ width: `80px`, height: `80px` }} />
                                </div> */}

                <br />
                <p className="mb-2">
                  <i className="fa fa-map me-3" />
                  Three Arms Zone, PMB 308, Abuja, Nigeria
                </p>
                <p className="mb-2">
                  <i className="fa fa-phone me-3" />
                  +234...
                </p>
                <p className="mb-2">
                  <i className="fa fa-envelope me-3" />

                  <a
                    href="mailto:notary@supremecourt.gov.ng"
                    style={{ color: "white" }}
                  >
                    notary@supremecourt.gov.ng
                  </a>
                </p>

                {/* <div className="d-flex pt-2">
                  <a
                    className="btn btn-square btn-outline-light rounded-circle me-2"
                    href="javascript:void(0)"
                  >
                    <i className="fa fa-twitter" />
                  </a>
                  <a
                    className="btn btn-square btn-outline-light rounded-circle me-2"
                    href="javascript:void(0)"
                  >
                    <i className="fa fa-facebook-f" />
                  </a>
                  <a
                    className="btn btn-square btn-outline-light rounded-circle me-2"
                    href="javascript:void(0)"
                  >
                    <i className="fa fa-youtube" />
                  </a>
                  <a
                    className="btn btn-square btn-outline-light rounded-circle me-2"
                    href="javascript:void(0)"
                  >
                    <i className="fa fa-linkedin" />
                  </a>
                </div> */}
              </div>
              <div className="col-lg-4 col-md-6">
                <h4 className="text-white mb-4">Services</h4>
                {/* <a className="btn btn-link" href="javascript:void(0)">
                  Application
                </a> */}
                <a
                  className="btn btn-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/how-to"
                >
                  How to Apply
                </a>
                <a
                  className="btn btn-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/application"
                >
                  Apply Now
                </a>
                <a
                  className="btn btn-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/login"
                >
                  Login
                </a>
              </div>

              <div className="col-lg-4 col-md-6">
                <h4 className="text-white mb-4">Quick Links</h4>
                <a
                  className="btn btn-link"
                  href="https://supremecourt.gov.ng/notary-public"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About Us
                </a>
                <a
                  className="btn btn-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/contact"
                >
                  Contact Us
                </a>
                {/* <a className="btn btn-link" href="javascript:void(0)">Our Services</a> */}
                <a
                  className="btn btn-link"
                  href="mailto:notary@supremecourt.gov.ng"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid copyright py-4">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                © {curYear} Supreme Court of Nigeria | Notary Public Application
                | All Right Reserved.
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
