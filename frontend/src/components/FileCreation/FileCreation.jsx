import WebViewer from "@pdftron/webviewer";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import home_logo from "../../assets/logo2.svg"; // ito lang dinagdag ko
import axios from "axios";

function FileEditor() {
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const viewerRef = useRef(null);
  const instanceRef = useRef(null);

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        if (res.data.valid) {
          setUserEmail(res.data.email);
          setUserRole(res.data.role);
        } else {
          navigate("/registerlogin");
        }
      })
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, []);
  //Reuse in other pages that requires logging in

  useEffect(() => {
    const viewerElement = viewerRef.current;

    // Clear container to prevent duplicate elements
    if (viewerElement && viewerElement.children.length > 0) {
      viewerElement.innerHTML = ""; // Remove existing children
    }

    // Initialize WebViewer
    WebViewer(
      {
        path: "/webviewer", // Path to WebViewer assets
        licenseKey: "YOUR_LICENSE_KEY",
        enableOfficeEditing: true,
      },
      viewerElement
    )
      .then((instance) => {
        // Store instance for later use or cleanup
        instanceRef.current = instance;
        console.log("WebViewer initialized:", instance);
      })
      .catch((error) => {
        console.error("Error initializing WebViewer:", error);
      });

    // Cleanup
    return () => {
      if (instanceRef.current) {
        console.log("Destroying WebViewer instance");
        instanceRef.current?.dispose(); // Properly dispose of the instance
        instanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50px",
        }}
      >
        <img
          src={home_logo}
          style={{
            height: "50px",
            width: "auto",
            padding: "5px",
            cursor: "default",
          }}
          alt="This is the logo"
        />
      </div>

      <div
        ref={viewerRef}
        style={{ flexGrow: 1, border: "1px solid #ccc" }}
      ></div>
    </div>
  );
}

export default FileEditor;
