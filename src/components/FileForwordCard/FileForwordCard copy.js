import React, { useState, useContext, useEffect } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import endpoint from "../../context/endpoint";
import { Context } from "../../context/Context";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import { useParams } from "react-router-dom";

export default function FileForwordCard() {
  const { file_Number } = useParams();
  // const { user } = useContext(Context);
  // ⬇️ Add this line here
  const loginUserId = JSON.parse(localStorage.getItem("user"))?.id || null;
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [isForwarded, setIsForwarded] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [forwardData, setForwardData] = useState({
    loginUser: loginUserId,
    to_user_id: "",

    remark: "",
  });

  // 🔹 fetch file by file_number
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await endpoint.get(`/file/file-number/${file_Number}`);
        console.log("File fetched:", res.data.data);

        setSelectedFile(res.data.data);
      } catch (err) {
        console.error(err);
        ErrorAlert("Failed to load file");
      }
    };

    if (file_Number) fetchFile();
  }, [file_Number]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await endpoint.get("/user/list");
        setUsersList(usersRes.data.data);
        console.log("Users fetched:", usersRes.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchData();
  }, []);

  const handleDrawerOpen = () => {
    // setSelectedFile(file);
    setForwardData({ ...forwardData, loginUser: loginUserId });
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setForwardData({
      // loginUser: user?.id,
      loginUser: loginUserId,
      to_user_id: "",

      remark: "",
    });
  };

  const handleForwardSubmit = async () => {
    if (!forwardData.user_id) {
      return ErrorAlert("Please select a user");
    }

    if (!selectedFile.id) {
      return ErrorAlert("File ID is missing");
    }

    setLoading(true);
    try {
      const payload = {
        file_id: selectedFile.id, // required
        // from_user_id: forwardData.loginUser,
        from_user_id: loginUserId,
        to_user_id: forwardData.user_id, // 👈 recipient
        remark: forwardData.remark || "",
      };

      console.log("Submitting payload:", payload); // debug

      const res = await endpoint.post(
        `/file-track/create-file-tracking`,
        payload
      );

      SuccessAlert(res.data.message || "File forwarded successfully!");
      setIsForwarded(true);

      handleDrawerClose();
    } catch (err) {
      console.error("Forward error:", err.response?.data || err);
      ErrorAlert(err.response?.data?.message || "Forward failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    console.log("Reject response:", selectedFile?.id);
    if (!selectedFile?.id) {
      return ErrorAlert("File ID is missing");
    }

    setLoading(true);
    try {
      const res = await endpoint.post(`/file-track/reject-file-tracking`, {
        tracking_id: selectedFile?.id,
        // user_id: user?.id,
        user_id: loginUserId,
      });

      SuccessAlert(res.data.message || "File rejected successfully!");

      setIsRejected(true); // ✅ disable Reject button
      setIsForwarded(true);
    } catch (err) {
      console.error("Reject error:", err.response?.data || err);
      ErrorAlert(err.response?.data?.message || "Reject failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: "24rem" }} className="shadow-sm py-5">
        <Card.Body className="text-center">
          <Card.Title style={{ color: "#0A7E51" }} className="py-3">
            Forward File
          </Card.Title>
          <Card.Text className="py-3">
            {selectedFile
              ? `File: ${selectedFile.file_Number}`
              : "Loading file..."}
          </Card.Text>

          <button
            onClick={handleReject}
            disabled={isRejected} // ✅ disable after reject
            className="btn btn-sm"
            style={{
              backgroundColor: "#C82333",
              color: "#fff",
              borderColor: "#C82333",

              opacity: isRejected ? 0.6 : 1,
              cursor: isRejected ? "not-allowed" : "pointer",
            }}
            title="Reject"
          >
            Reject
          </button>

          <button
            onClick={() => handleDrawerOpen()}
            disabled={isForwarded}
            className="btn btn-sm"
            style={{
              backgroundColor: "#0A7E51",
              color: "#fff",
              borderColor: "#0A7E51",
              marginLeft: "10px",
              opacity: isForwarded ? 0.6 : 1,
              cursor: isForwarded ? "not-allowed" : "pointer",
            }}
            title="Forward"
          >
            Forward
          </button>
        </Card.Body>
      </Card>

      {/* Forward Modal */}

      <Modal
        show={openDrawer}
        onHide={handleDrawerClose}
        className="file-modal-wrapper"
        centered
      >
        <Modal.Header closeButton className="file-modal-header">
          <Modal.Title className="file-modal-title">Forward File</Modal.Title>
        </Modal.Header>

        <Modal.Body className="file-modal-body">
          {/* Hidden loginUser */}
          <input type="hidden" value={forwardData.loginUser} />

          {/* User Select */}

          <Form.Group className="mb-3">
            <Form.Label>User</Form.Label>
            <Form.Select
              value={forwardData.user_id || ""}
              onChange={(e) =>
                setForwardData({
                  ...forwardData,
                  user_id: e.target.value,
                })
              }
            >
              <option value="" disabled hidden>
                -- Select User --
              </option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {`${u.surname} ${u.first_name}${
                    u.middle_name ? ` ${u.middle_name}` : ""
                  }`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Remark */}
          <Form.Group className="mb-3">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={forwardData.remark}
              onChange={(e) =>
                setForwardData({ ...forwardData, remark: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="file-modal-footer">
          <Button
            variant="danger"
            className="file-btn-cancel"
            onClick={handleDrawerClose}
          >
            Close
          </Button>
          <Button
            variant="success"
            className="file-btn-update"
            onClick={handleForwardSubmit}
          >
            Forward
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
