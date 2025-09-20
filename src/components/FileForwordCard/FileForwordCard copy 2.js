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
import { QRCodeSVG } from "qrcode.react"; // Correct import

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
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header
              className="py-3"
              style={{ backgroundColor: "#0A7E51", color: "white" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="mb-0" style={{ color: "#fff" }}>
                  File Forwarding
                </Card.Title>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {selectedFile ? (
                <>
                  <div className="text-center mb-4">
                    <h4 className="text-primary">
                      File Number: {selectedFile.file_Number}
                    </h4>
                    <p className="text-muted">{selectedFile.file_Name}</p>
                  </div>

                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="mb-3">
                        <strong>Description:</strong>
                        <p className="text-muted">
                          {selectedFile.description || "No description available"}
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong>Parties:</strong>
                        <p className="text-muted">
                          {selectedFile.parties || "Not specified"}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {/* Only show QR Code and Copy Link buttons if file belongs to logged-in user */}
                  {selectedFile?.lastTracking?.to_user_id === user?.user?.id && (
                    <div className="text-center mb-4">
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowQRModal(true)}
                        className="me-2"
                      >
                        <i className="fas fa-qrcode me-2"></i>Show QR Code
                      </Button>

                      <Button variant="outline-secondary" onClick={handleCopy}>
                        <i className="fas fa-copy me-2"></i>Copy Link
                      </Button>
                    </div>
                  )}

                  <hr />
                  
                  <div className="text-center mt-4">
                    {/* Only show buttons if the file belongs to the logged-in user */}
                    {selectedFile?.lastTracking?.to_user_id === user?.user?.id ? (
                      <>
                        {/* Show Accept/Reject buttons if tracking exists AND status_id is 1 */}
                        {selectedFile?.lastTracking?.id && selectedFile?.lastTracking?.status_id === 1 ? (
                          <>
                            <Button
                              onClick={() => setShowAcceptModal(true)}
                              className="me-3"
                              style={{ minWidth: "100px" }}
                              disabled={isLoading || isAccepted}
                            >
                              {isLoading ? "Processing..." : "Accept"}
                            </Button>

                            <Button
                              onClick={() => setShowRejectModal(true)}
                              variant="danger"
                              style={{ minWidth: "100px" }}
                              disabled={isRejected || isLoading}
                            >
                              Reject 
                            </Button>
                          </>
                        ) : (
                          /* Show Forward button if status_id is not 1 */
                          <Button
                            onClick={() => setOpenDrawer(true)}
                            style={{ 
                              backgroundColor: "#0A7E51", 
                              borderColor: "#0A7E51",
                              minWidth: "100px"
                            }}
                            disabled={isForwarded || isLoading}
                          >
                            {isForwarded ? "Forwarded" : "Forward"}
                          </Button>
                        )}
                      </>
                    ) : (
                      /* Show message if file doesn't belong to logged-in user */
                      <p className="text-muted">This file is not assigned to you.</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading file information...</p>
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
