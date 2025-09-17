// import React, { useState, useContext, useEffect } from "react";
// import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
// import endpoint from "../../context/endpoint";
// import { Context } from "../../context/Context";
// import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
// import { useParams } from "react-router-dom";

// export default function FileForwordCard() {
//   const { file_Number } = useParams();
//   const [userLoaded, setUserLoaded] = useState(false);
//   // const loginUserId = JSON.parse(localStorage.getItem("user"))?.id || null;
//   const loginUserId = userLoaded
//     ? JSON.parse(localStorage.getItem("user"))?.id || null
//     : null;

//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [usersList, setUsersList] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const [isAccepted, setIsAccepted] = useState(false);
//   const [isForwarded, setIsForwarded] = useState(false);
//   const [isRejected, setIsRejected] = useState(false);
//   const [isLoading, setLoading] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectRemark, setRejectRemark] = useState("");

//   const [forwardData, setForwardData] = useState({
//     loginUser: loginUserId,
//     to_user_id: "",
//     remark: "",
//   });
//   useEffect(() => {
//     // Set userLoaded to true after component mounts
//     setUserLoaded(true);
//   }, []);

//   // fetch file
//   useEffect(() => {
//     const fetchFile = async () => {
//       try {
//         const res = await endpoint.get(`/file/file-number/${file_Number}`);
//         setSelectedFile(res.data.data);
//       } catch {
//         ErrorAlert("Failed to load file");
//       }
//     };
//     if (file_Number) fetchFile();
//   }, [file_Number]);

//   // fetch users
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const usersRes = await endpoint.get("/user/list");
//         setUsersList(usersRes.data.data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   // Show loading while user data is being retrieved
//   if (!userLoaded) {
//     return (
//       <div className="d-flex justify-content-center mt-5">
//         <Card style={{ width: "20rem" }} className="shadow-sm">
//           <Card.Body className="text-center">
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//           </Card.Body>
//         </Card>
//       </div>
//     );
//   }

//   // Show message if user is not logged in
//   if (!loginUserId) {
//     return (
//       <div className="d-flex justify-content-center mt-5">
//         <Card style={{ width: "20rem" }} className="shadow-sm">
//           <Card.Header style={{ backgroundColor: "#0A7E51", color: "#fff" }}>
//             <Card.Title className="py-3">File Access</Card.Title>
//           </Card.Header>
//           <Card.Body className="text-center">
//             <p>Please log in to access file operations.</p>
//           </Card.Body>
//         </Card>
//       </div>
//     );
//   }

//   // 🔹 Accept
//   const handleAccept = async () => {
//     if (!selectedFile?.id) return ErrorAlert("File ID is missing");

//     setLoading(true);
//     try {
//       const res = await endpoint.post(`/file-track/accept-file-tracking`, {
//         tracking_id: selectedFile.id, // ✅ send file_id instead of tracking_id
//         user_id: loginUserId, // who accepted
//         remark: "Accepted", // optional
//       });

//       SuccessAlert(res.data.message || "File accepted successfully!");
//       setIsAccepted(true);
//       setIsRejected(false); // hide reject after accept
//     } catch (err) {
//       ErrorAlert(err.response?.data?.message || "Accept failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Reject

//   const handleReject = async () => {
//     if (!selectedFile?.id) return ErrorAlert("File ID is missing");

//     setLoading(true);
//     try {
//       const res = await endpoint.post(`/file-track/reject-file-tracking`, {
//         tracking_id: selectedFile.id,
//         user_id: loginUserId,
//         remark: rejectRemark, // ✅ include remark
//       });

//       SuccessAlert(res.data.message || "File rejected successfully!");
//       setIsRejected(true);
//       setIsAccepted(false);
//       setRejectRemark(""); // reset field
//     } catch (err) {
//       ErrorAlert(err.response?.data?.message || "Reject failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Forward
//   const handleForwardSubmit = async () => {
//     if (!forwardData.user_id) return ErrorAlert("Please select a user");
//     if (!selectedFile?.id) return ErrorAlert("File ID is missing");

//     setLoading(true);
//     try {
//       const payload = {
//         file_id: selectedFile.id,
//         from_user_id: loginUserId,
//         to_user_id: forwardData.user_id,
//         remark: forwardData.remark || "",
//       };

//       const res = await endpoint.post(
//         `/file-track/create-file-tracking`,
//         payload
//       );

//       SuccessAlert(res.data.message || "File forwarded successfully!");
//       setIsForwarded(true);
//       setOpenDrawer(false);
//     } catch (err) {
//       ErrorAlert(err.response?.data?.message || "Forward failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center mt-5">
//       <Card style={{ width: "20rem" }} className="shadow-sm ">
//         <Card.Header
//           style={{ backgroundColor: "#0A7E51", color: "#fff" }}
//           className="pb-3"
//         >
//           <Card.Title
//             style={{ backgroundColor: "#0A7E51", color: "#fff" }}
//             className="py-3"
//           >
//             File Number :{" "}
//             {selectedFile ? ` ${selectedFile.file_Number}` : "Loading file..."}
//           </Card.Title>
//         </Card.Header>
//         <Card.Body className="text-center">
//           {/* <Card.Title style={{ color: "#0A7E51" }} className="py-3">
//             Forward File
//           </Card.Title> */}
//           {/* <Card.Title
//             style={{ backgroundColor: "#0A7E51", color: "#fff" }}
//             className="py-3"
//           >
//             Forward File
//           </Card.Title> */}
//           <Card.Text className="pb-3">
//             {selectedFile
//               ? `File: ${selectedFile.file_Number}`
//               : "Loading file..."}
//           </Card.Text>

//           {/* Accept button - only visible if not accepted/rejected */}
//           {!isAccepted && !isRejected && (
//             <button
//               onClick={handleAccept}
//               className="btn btn-sm"
//               style={{
//                 backgroundColor: "#007bff",
//                 color: "#fff",
//                 borderColor: "#007bff",
//                 marginRight: "10px",
//               }}
//             >
//               Accept
//             </button>
//           )}

//           {/* Reject button - hidden after accept */}
//           {!isAccepted && (
//             // <button
//             //   onClick={handleReject}
//             //   disabled={isRejected}
//             //   className="btn btn-sm"
//             //   style={{
//             //     backgroundColor: "#C82333",
//             //     color: "#fff",
//             //     borderColor: "#C82333",
//             //     marginRight: "10px",
//             //     opacity: isRejected ? 0.6 : 1,
//             //     cursor: isRejected ? "not-allowed" : "pointer",
//             //   }}
//             // >
//             //   Reject
//             // </button>

//             <button
//               onClick={() => setShowRejectModal(true)}
//               disabled={isRejected}
//               className="btn btn-sm"
//               style={{
//                 backgroundColor: "#C82333",
//                 color: "#fff",
//                 borderColor: "#C82333",
//                 marginRight: "10px",
//                 opacity: isRejected ? 0.6 : 1,
//                 cursor: isRejected ? "not-allowed" : "pointer",
//               }}
//             >
//               Reject
//             </button>
//           )}

//           {/* Forward button - only visible after accept */}
//           {isAccepted && (
//             <button
//               onClick={() => setOpenDrawer(true)}
//               disabled={isForwarded}
//               className="btn btn-sm"
//               style={{
//                 backgroundColor: "#0A7E51",
//                 color: "#fff",
//                 borderColor: "#0A7E51",
//                 opacity: isForwarded ? 0.6 : 1,
//                 cursor: isForwarded ? "not-allowed" : "pointer",
//               }}
//             >
//               Forward
//             </button>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Forward Modal */}
//       <Modal show={openDrawer} onHide={() => setOpenDrawer(false)} centered>
//         <Modal.Header
//           closeButton
//           style={{
//             backgroundColor: "#0A7E51",
//             color: "#fff",
//             borderColor: "#0A7E51",
//             textAlign: "center",
//           }}
//         >
//           <Modal.Title style={{ color: "#fff" }}>Forward File</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>User</Form.Label>
//             <Form.Select
//               value={forwardData.user_id || ""}
//               onChange={(e) =>
//                 setForwardData({ ...forwardData, user_id: e.target.value })
//               }
//             >
//               <option value="" disabled hidden>
//                 -- Select User --
//               </option>
//               {usersList.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {`${u.surname} ${u.first_name} ${u.middle_name || ""}`}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Remark</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={forwardData.remark}
//               onChange={(e) =>
//                 setForwardData({ ...forwardData, remark: e.target.value })
//               }
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="danger" onClick={() => setOpenDrawer(false)}>
//             Close
//           </Button>
//           <Button onClick={handleForwardSubmit} disabled={isForwarded}>
//             Forward
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <Modal
//         show={showRejectModal}
//         onHide={() => setShowRejectModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Reject File</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>Remark</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={rejectRemark}
//               onChange={(e) => setRejectRemark(e.target.value)}
//             />
//           </Form.Group>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={async () => {
//               if (!rejectRemark.trim()) {
//                 return ErrorAlert("Remark is required to reject");
//               }
//               await handleReject();
//               setShowRejectModal(false);
//             }}
//             disabled={isRejected || isLoading}
//           >
//             {isLoading ? "Rejecting..." : "Reject"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
import endpoint from "../../context/endpoint";
import { ErrorAlert, SuccessAlert } from "../../data/Toast/toast";
import { useParams } from "react-router-dom";

export default function FileForwordCard() {
  const { file_Number } = useParams();
  const [userLoaded, setUserLoaded] = useState(false);
  const [loginUserId, setLoginUserId] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [isAccepted, setIsAccepted] = useState(false);
  const [isForwarded, setIsForwarded] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");

  const [forwardData, setForwardData] = useState({
    loginUser: null,
    to_user_id: "",
    remark: "",
  });

  // Get user from localStorage in useEffect
  // useEffect(() => {
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     try {
  //       const user = JSON.parse(userData);
  //       setLoginUserId(user.id);
  //       setForwardData((prev) => ({ ...prev, loginUser: user.id }));
  //     } catch (error) {
  //       console.error("Error parsing user data:", error);
  //     }
  //   }
  //   setUserLoaded(true);
  // }, []);

  // fetch file - only fetch if user is loaded and logged in
  useEffect(() => {
    if (!userLoaded || !loginUserId) return;

    const fetchFile = async () => {
      try {
        const res = await endpoint.get(`/file/file-number/${file_Number}`);
        setSelectedFile(res.data.data);
      } catch {
        ErrorAlert("Failed to load file");
      }
    };
    if (file_Number) fetchFile();
  }, [file_Number, userLoaded, loginUserId]);

  // fetch users - only fetch if user is loaded and logged in
  useEffect(() => {
    if (!userLoaded || !loginUserId) return;

    const fetchData = async () => {
      try {
        const usersRes = await endpoint.get("/user/list");
        setUsersList(usersRes.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchData();
  }, [userLoaded, loginUserId]);

  // Show loading while user data is being retrieved
  if (!userLoaded) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Card style={{ width: "20rem" }} className="shadow-sm">
          <Card.Body className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Show message if user is not logged in
  if (!loginUserId) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Card style={{ width: "20rem" }} className="shadow-sm">
          <Card.Header style={{ backgroundColor: "#0A7E51", color: "#fff" }}>
            <Card.Title className="py-3">File Access</Card.Title>
          </Card.Header>
          <Card.Body className="text-center">
            <p>Please log in to access file operations.</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // 🔹 Accept
  const handleAccept = async () => {
    if (!selectedFile?.id) return ErrorAlert("File ID is missing");

    setLoading(true);
    try {
      const res = await endpoint.post(`/file-track/accept-file-tracking`, {
        tracking_id: selectedFile.id,
        user_id: loginUserId,
        remark: "Accepted",
      });

      SuccessAlert(res.data.message || "File accepted successfully!");
      setIsAccepted(true);
      setIsRejected(false);
    } catch (err) {
      ErrorAlert(err.response?.data?.message || "Accept failed!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reject
  const handleReject = async () => {
    if (!selectedFile?.id) return ErrorAlert("File ID is missing");

    setLoading(true);
    try {
      const res = await endpoint.post(`/file-track/reject-file-tracking`, {
        tracking_id: selectedFile.id,
        user_id: loginUserId,
        remark: rejectRemark,
      });

      SuccessAlert(res.data.message || "File rejected successfully!");
      setIsRejected(true);
      setIsAccepted(false);
      setRejectRemark("");
    } catch (err) {
      ErrorAlert(err.response?.data?.message || "Reject failed!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Forward
  const handleForwardSubmit = async () => {
    if (!forwardData.user_id) return ErrorAlert("Please select a user");
    if (!selectedFile?.id) return ErrorAlert("File ID is missing");

    setLoading(true);
    try {
      const payload = {
        file_id: selectedFile.id,
        from_user_id: loginUserId,
        to_user_id: forwardData.user_id,
        remark: forwardData.remark || "",
      };

      const res = await endpoint.post(
        `/file-track/create-file-tracking`,
        payload
      );

      SuccessAlert(res.data.message || "File forwarded successfully!");
      setIsForwarded(true);
      setOpenDrawer(false);
    } catch (err) {
      ErrorAlert(err.response?.data?.message || "Forward failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: "20rem" }} className="shadow-sm ">
        <Card.Header
          style={{ backgroundColor: "#0A7E51", color: "#fff" }}
          className="pb-3"
        >
          <Card.Title
            style={{ backgroundColor: "#0A7E51", color: "#fff" }}
            className="py-3"
          >
            File Number :{" "}
            {selectedFile ? ` ${selectedFile.file_Number}` : "Loading file..."}
          </Card.Title>
        </Card.Header>
        <Card.Body className="text-center">
          <Card.Text className="pb-3">
            {selectedFile
              ? `File: ${selectedFile.file_Number}`
              : "Loading file..."}
          </Card.Text>

          {/* Accept button - only visible if not accepted/rejected */}
          {!isAccepted && !isRejected && (
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="btn btn-sm"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                borderColor: "#007bff",
                marginRight: "10px",
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Accepting..." : "Accept"}
            </button>
          )}

          {/* Reject button - hidden after accept */}
          {!isAccepted && (
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={isRejected || isLoading}
              className="btn btn-sm"
              style={{
                backgroundColor: "#C82333",
                color: "#fff",
                borderColor: "#C82333",
                marginRight: "10px",
                opacity: isRejected || isLoading ? 0.6 : 1,
                cursor: isRejected || isLoading ? "not-allowed" : "pointer",
              }}
            >
              Reject
            </button>
          )}

          {/* Forward button - only visible after accept */}
          {isAccepted && (
            <button
              onClick={() => setOpenDrawer(true)}
              disabled={isForwarded || isLoading}
              className="btn btn-sm"
              style={{
                backgroundColor: "#0A7E51",
                color: "#fff",
                borderColor: "#0A7E51",
                opacity: isForwarded || isLoading ? 0.6 : 1,
                cursor: isForwarded || isLoading ? "not-allowed" : "pointer",
              }}
            >
              Forward
            </button>
          )}
        </Card.Body>
      </Card>

      {/* Forward Modal */}
      <Modal show={openDrawer} onHide={() => setOpenDrawer(false)} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#0A7E51",
            color: "#fff",
            borderColor: "#0A7E51",
            textAlign: "center",
          }}
        >
          <Modal.Title style={{ color: "#fff" }}>Forward File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User</Form.Label>
            <Form.Select
              value={forwardData.user_id || ""}
              onChange={(e) =>
                setForwardData({ ...forwardData, user_id: e.target.value })
              }
            >
              <option value="" disabled hidden>
                -- Select User --
              </option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {`${u.surname} ${u.first_name} ${u.middle_name || ""}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

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
        <Modal.Footer>
          <Button variant="danger" onClick={() => setOpenDrawer(false)}>
            Close
          </Button>
          <Button
            onClick={handleForwardSubmit}
            disabled={isForwarded || isLoading}
          >
            {isLoading ? "Forwarding..." : "Forward"}
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
          <Form.Group className="mb-3">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectRemark}
              onChange={(e) => setRejectRemark(e.target.value)}
              placeholder="Please provide a reason for rejection"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              if (!rejectRemark.trim()) {
                return ErrorAlert("Remark is required to reject");
              }
              await handleReject();
              setShowRejectModal(false);
            }}
            disabled={isRejected || isLoading}
          >
            {isLoading ? "Rejecting..." : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
