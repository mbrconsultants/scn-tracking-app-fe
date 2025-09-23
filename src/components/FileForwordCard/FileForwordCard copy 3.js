import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
  Badge,
} from "react-bootstrap";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react"; 
import "./style.css"

export default function FileForwardCard() {
  const { file_Number } = useParams();
  const loginUserId = JSON.parse(localStorage.getItem("user"))?.id || null;
  const { user, triggerRefresh } = useContext(Context);
  console.log("login user", loginUserId);
  console.log("login user2", user);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isForwarded, setIsForwarded] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [fileStatus, setFileStatus] = useState("pending");
  const [locations, setLocation] = useState([]);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptRemark, setAcceptRemark] = useState("");

  const [forwardData, setForwardData] = useState({
    loginUser: user?.user?.id,
    location_id: "",
    to_user_id: "",
    remark: "",
  });

  // Fetch file details
  useEffect(() => {
    console.log("file number", file_Number)
    const fetchFile = async () => {
      try {
        const res = await endpoint.get(`/file/file-number/${file_Number}`);
        console.log("single file detail", res.data.data);
        setSelectedFile(res.data.data);

        // Check if file is already accepted/rejected
        if (res.data.data.status === "accepted") {
          setIsAccepted(true);
          setFileStatus("accepted");
        } else if (res.data.data.status === "rejected") {
          setIsRejected(true);
          setFileStatus("rejected");
        }
      } catch {
        ErrorAlert("Failed to load file");
      }
    };
    if (file_Number) fetchFile();
  }, [file_Number]);

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await endpoint.get("/user/list");
        setUsersList(usersRes.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchData();
  }, []);

  // fetch locations
  useEffect(() => {
    const getAllLocations = async () => {
      try {
        const res = await endpoint.get(`/location/getAllLocations`);
        console.log("all locations", res.data.data);
        setLocation(res.data.data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    getAllLocations();
  }, []);

  const handleAccept = async () => {
    if (!selectedFile?.id) return ErrorAlert("File ID is missing");

    setLoading(true);
    try {
      const res = await endpoint.post(`/file-track/accept-file-tracking`, {
        tracking_id: selectedFile.id,
        user_id: user?.user?.id,
        remark: acceptRemark || "Accepted",
      });

      SuccessAlert(res.data.message || "File accepted successfully!");
      setIsAccepted(true);
      setIsRejected(false);
      setFileStatus("accepted");
      setAcceptRemark("");
      setShowAcceptModal(false);

      window.location.reload();
    } catch (err) {
      ErrorAlert(err.response?.data?.message || "Accept failed!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    if (!selectedFile?.id) return ErrorAlert("File ID is missing");

    setLoading(true);
    try {
      const res = await endpoint.post(`/file-track/reject-file-tracking`, {
        tracking_id: selectedFile.id,
        user_id: user?.user?.id,
        remark: rejectRemark,
      });

      SuccessAlert(res.data.message || "File rejected successfully!");
      setIsRejected(true);
      setIsAccepted(false);
      setFileStatus("rejected");
      setRejectRemark("");
      setShowRejectModal(false);

      window.location.reload();
    } catch (err) {
      ErrorAlert(err.response?.data?.message || "Reject failed!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forward
  const handleForwardSubmit = async () => {
    if (!forwardData.user_id) return ErrorAlert("Please select a user");
    if (!selectedFile?.id) return ErrorAlert("File ID is missing");

    setLoading(true);
    try {
      const payload = {
        file_id: selectedFile.id,
        from_user_id: user?.user?.id,
        to_user_id: forwardData.user_id,
        location_id: forwardData.location_id,
        remark: forwardData.remark || "",
      };

      const res = await endpoint.post(
        `/file-track/create-file-tracking`,
        payload
      );

      SuccessAlert(res.data.message || "File forwarded successfully!");
      setIsForwarded(true);
      setOpenDrawer(false);

      // Reset form
      setForwardData({
        loginUser: user?.user?.id,
        to_user_id: "",
        location_id: "",
        remark: "",
      });

      window.location.reload();
    } catch (err) {
      ErrorAlert(err.response?.data?.message || "Forward failed!");
    } finally {
      setLoading(false);
    }
  };

  // Generate QR Code URL
  const generateQRCodeUrl = () => {
    return `${window.location.origin}/file-forward-card/${file_Number}`;

  };

  // Handle Share
  const handleShare = async () => {
    const shareUrl = generateQRCodeUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "File Forwarding",
          text: `Forward file ${file_Number}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => SuccessAlert("Link copied to clipboard!"))
        .catch(() => ErrorAlert("Failed to copy link"));
    }
  };

  // Handle Copy
  const handleCopy = () => {
    navigator.clipboard
      .writeText(generateQRCodeUrl())
      .then(() => SuccessAlert("Link copied to clipboard!"))
      .catch(() => ErrorAlert("Failed to copy link"));
  };

  return (
    
    <div className="container mt-4">
      <Row className="justify-content-center">
  <Col md={10} lg={8} xl={9}>
    <Card className="file-forward-card shadow-lg border-0" style={{ 
      borderRadius: '12px', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
    }}>
      {/* Card Header with slightly more height */}
      <Card.Header className="py-3 text-center file-card-header" style={{ 
        background: 'linear-gradient(135deg, #0A7E51 0%, #066a44 100%)', 
        border: 'none',
        position: 'relative'
      }}>
        <div className="header-icon" style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1.3rem',
          opacity: '0.8'
        }}>
          <i className="fas fa-file-export text-white"></i>
        </div>
        <Card.Title className="mb-0 fw-bold text-white" style={{ 
          fontSize: '1.2rem',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          File Forwarding 
        </Card.Title>
      </Card.Header>

      <Card.Body className="p-4">
        {selectedFile ? (
          <>
            {/* File Header with more spacing */}
            <div className="text-center mb-4">
              <div className="file-header-card p-3 rounded-3 mx-auto" style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                border: '2px dashed #2196f3',
                maxWidth: '500px'
              }}>
                <h4 className="text-primary fw-bold mb-2">
                  #{selectedFile.file_Number}
                </h4>
                <p className="text-dark mb-0 fw-semibold">
                  <i className="fas fa-file-alt me-2"></i>{selectedFile.file_Name}
                </p>
              </div>
            </div>

            {/* File Details with better spacing */}
            <Row className="g-3 mb-4">
              <Col md={6}>
                <div className="detail-card p-3 rounded-3" style={{
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  border: '1px solid #ce93d8',
                  minHeight: '90px'
                }}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-align-left text-purple me-2"></i>
                    <strong className="text-dark">Description</strong>
                  </div>
                  <p className="text-dark mb-0" style={{ lineHeight: '1.4' }}>
                    {selectedFile.description || "No description provided"}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-card p-3 rounded-3" style={{
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  border: '1px solid #81c784',
                  minHeight: '90px'
                }}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-users text-success me-2"></i>
                    <strong className="text-dark">Parties Involved</strong>
                  </div>
                  <p className="text-dark mb-0" style={{ lineHeight: '1.4' }}>
                    {selectedFile.parties || "Not specified"}
                  </p>
                </div>
              </Col>
            </Row>

            {/* Share Section with more height */}
            {selectedFile?.lastTracking?.to_user_id === user?.user?.id && (
              <div className="share-section text-center mb-3">
                <div className="p-3 rounded-3" style={{
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
                  border: '1px solid #e0e0e0'
                }}>
                  <h5 className="mb-3 text-dark fw-semibold">Share Options</h5>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowQRModal(true)}
                      className="px-3 py-2 rounded-2"
                      size="sm"
                    >
                      <i className="fas fa-qrcode me-2"></i>Show QR Code
                    </Button>

                    <Button 
                      variant="outline-info"
                      onClick={handleCopy}
                      className="px-3 py-2 rounded-2"
                      size="sm"
                    >
                      <i className="fas fa-link me-2"></i>Copy Link
                    </Button>

                    <Button 
                      variant="outline-success"
                      onClick={handleShare}
                      className="px-3 py-2 rounded-2"
                      size="sm"
                    >
                      <i className="fas fa-share me-2"></i>Share File
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons with better spacing */}
            <div className="action-section text-center">
              <hr className="my-3" style={{ borderTop: '2px dashed #dee2e6' }} />
              
              {selectedFile?.lastTracking?.to_user_id === user?.user?.id ? (
                <>
                  {selectedFile?.lastTracking?.id && selectedFile?.lastTracking?.status_id === 1 ? (
                    <div className="action-buttons">
                      <h5 className="text-muted mb-3">Action Required</h5>
                      <div className="d-flex justify-content-center gap-3">
                        <Button
                          onClick={() => setShowAcceptModal(true)}
                          className="px-4 py-2 rounded-2 fw-semibold"
                          style={{ 
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            border: 'none',
                            minWidth: '120px'
                          }}
                          disabled={isLoading || isAccepted}
                        >
                          {isLoading ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>
                              Processing
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check me-2"></i>
                              Accept
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => setShowRejectModal(true)}
                          className="px-4 py-2 rounded-2 fw-semibold"
                          style={{ 
                            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                            border: 'none',
                            minWidth: '120px'
                          }}
                          disabled={isRejected || isLoading}
                        >
                          <i className="fas fa-times me-2"></i>Reject
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <h5 className="text-muted mb-3">File Actions</h5>
                      <Button
                        onClick={() => setOpenDrawer(true)}
                        className="px-5 py-2 rounded-2 fw-semibold"
                        style={{ 
                          background: 'linear-gradient(135deg, #0A7E51 0%, #066a44 100%)',
                          border: 'none',
                          minWidth: '180px',
                          fontSize: '1.1rem'
                        }}
                        disabled={isForwarded || isLoading}
                      >
                        {isForwarded ? (
                          <>
                            <i className="fas fa-check-circle me-2"></i>
                            Forwarded
                          </>
                        ) : (
                          <>
                            <i className="fas fa-share me-2"></i>
                            Forward File
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="not-assigned-message p-3 rounded-3" style={{
                  background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                  border: '1px solid #ffd54f'
                }}>
                  <i className="fas fa-info-circle text-warning me-2"></i>
                  <span className="text-dark fw-semibold">This file is not assigned to you</span>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Loading State with better height */
          <div className="text-center py-4">
            <div className="spinner-border text-primary mb-3" style={{ 
              width: '2rem', 
              height: '2rem'
            }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Loading File Information</h5>
            <p className="text-muted small mb-0">Please wait while we retrieve the file details...</p>
          </div>
        )}
      </Card.Body>
    </Card>
  </Col>
</Row>

      {/* Forward Modal */}
      <Modal show={openDrawer} onHide={() => setOpenDrawer(false)} centered>
        <Modal.Header
          closeButton
          className="py-3"
          style={{ backgroundColor: "#0A7E51", color: "white" }}
        >
          <Modal.Title>Forward File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select User to Forward To</Form.Label>
            <Form.Select
              value={forwardData.user_id || ""}
              onChange={(e) =>
                setForwardData({ ...forwardData, user_id: e.target.value })
              }
            >
              <option value="" disabled></option>
              {/* {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {`${u.surname} ${u.first_name} ${u.middle_name || ""}`}
                </option>
              ))} */}
              {usersList
                .filter((u) => u.id !== user?.user?.id) // 👈 logged-in user won't appear
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {`${u.surname} ${u.first_name}${
                      u.middle_name ? ` ${u.middle_name}` : ""
                    }`}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          {/* Location Select */}
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Select
              value={forwardData.location_id || ""}
              onChange={(e) =>
                setForwardData({
                  ...forwardData,
                  location_id: e.target.value,
                })
              }
            >
              <option value="" disabled hidden>
                -- Select Location --
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add a remark for the recipient"
              value={forwardData.remark}
              onChange={(e) =>
                setForwardData({ ...forwardData, remark: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpenDrawer(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleForwardSubmit}
            disabled={isForwarded || isLoading}
            style={{ backgroundColor: "#0A7E51", borderColor: "#0A7E51" }}
          >
            {isLoading ? "Forwarding..." : "Forward File"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reject File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            Please provide a reason for rejecting this file.
          </Alert>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Explain why you are rejecting this file"
              value={rejectRemark}
              onChange={(e) => setRejectRemark(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={isRejected || isLoading || !rejectRemark.trim()}
          >
            {isLoading ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: "#0a7148" }}>
          <Modal.Title style={{ color: "#fff" }}>Accept File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFile && (
            <>
              <p>
                <strong>File Number:</strong> {selectedFile.file_Number}
              </p>
              <p>
                <strong>File Name:</strong> {selectedFile.file_Name}
              </p>
              <p>
                <strong>File Page Number:</strong>{" "}
                {selectedFile.page_Number || "N/A"}
              </p>

              <Form.Group className="mb-3">
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add your remark"
                  value={acceptRemark}
                  onChange={(e) => setAcceptRemark(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isLoading || !acceptRemark.trim()}
            style={{ backgroundColor: "#0A7E51", borderColor: "#0A7E51" }}
          >
            {isLoading ? "Accepting..." : "Confirm Accept"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code for File {file_Number}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-3 d-flex justify-content-center">
            <QRCodeSVG
              value={generateQRCodeUrl()}
              size={200}
              level="H"
              includeMargin
            />
          </div>
          <div className="d-flex justify-content-center gap-2 mb-3">
            <Button
              variant="primary"
              onClick={() => window.open(generateQRCodeUrl(), "_blank")}
            >
              Open
            </Button>
            <Button variant="info" onClick={handleShare}>
              Share
            </Button>
            <Button variant="secondary" onClick={handleCopy}>
              Copy
            </Button>
          </div>
          <Alert variant="light" className="small">
            <strong>URL:</strong> {generateQRCodeUrl()}
          </Alert>
        </Modal.Body>
      </Modal>
    </div>
  );
}
