import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"; // v5
import documentationService from "../services/documentationService";
import gapService from "../../gapAssessment/services/gapService";

const MLD = () => {
  const history = useHistory();

  const [documents, setDocuments] = useState([]);
  const [soas, setSoas] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // store per-SoA file

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await documentationService.getDocuments();
        setDocuments(docs || []);

        const soaList = await documentationService.getSoAEntries();
        setSoas(Array.isArray(soaList) ? soaList : []);
      } catch (error) {
        console.error("Error loading data:", error);
        setDocuments([]);
        setSoas([]);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (soaId, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [soaId]: file,
    }));
  };

  const handleUpload = async (refId) => {
    const file = selectedFiles[refId];
    if (!file) {
      alert("Please select a file for this Document Reference");
      return;
    }

    try {
      // ✅ Store the uploaded document info in a variable
      const uploadedDoc = await documentationService.uploadDocument({
        file, // the selected file
        soaId: refId, // the reference id
        controlId: "", // optional
      });

      // ✅ Now uploadedDoc is defined
      try {
        const docId = uploadedDoc?.id ?? uploadedDoc?._id ?? null;
        if (docId) {
          await gapService.createGap(docId, { status: "Open" });
          console.log("Gap entry created for docId:", docId);
        } else {
          console.warn("No document ID returned from upload, gap not created.");
        }
      } catch (gapErr) {
        console.error("Failed to create gap entry:", gapErr);
      }

      alert("Document uploaded successfully");

      setSelectedFiles((prev) => ({
        ...prev,
        [refId]: null,
      }));

      const docs = await documentationService.getDocuments();
      setDocuments(docs || []);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading document");
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      await documentationService.deleteDocument(docId); // <-- add this function to your service
      const updatedDocs = documents.filter((doc) => doc.id !== docId);
      setDocuments(updatedDocs);
      alert("Document deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting document");
    }
  };

  return (
    <div
      style={{
        marginTop: "60px",
        padding: "15px",
        maxWidth: "1000px",
        margin: "60px auto 0",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e9ecef",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#2c3e50", marginBottom: "8px", fontSize: "22px" }}>
          📚 Master List of Documents
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "14px" }}>
          Upload and manage your documents per SoA
        </p>
      </div>

      {/* SoA List with Upload */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
          marginBottom: "30px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "12px",
                borderBottom: "1px solid #e9ecef",
                background: "#f8f9fa",
              }}
            >
              Sl.No
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "1px solid #e9ecef",
                background: "#f8f9fa",
              }}
            >
              Document Name
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "1px solid #e9ecef",
                background: "#f8f9fa",
              }}
            >
              Upload
            </th>
          </tr>
        </thead>
        <tbody>
          {soas?.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "12px" }}>
                No SoA entries found
              </td>
            </tr>
          ) : (
            soas.map((soa, index) => (
              <tr key={soa.id}>
                <td
                  style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}
                >
                  {index + 1}
                </td>
                <td
                  style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}
                >
                  {soa.documentRef}
                </td>
                <td
                  style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}
                >
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(soa.id, e.target.files[0])
                    }
                    style={{ marginRight: "10px" }}
                  />
                  <button
                    onClick={() => handleUpload(soa.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Upload
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Document List */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "12px",
                borderBottom: "1px solid #e9ecef",
                background: "#f8f9fa",
              }}
            >
              Sl.No
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "1px solid #e9ecef",
                background: "#f8f9fa",
              }}
            >
              Document Uploaded
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "1px solid #e9ecef",
                background: "#f8f9fa",
              }}
            >
              Uploaded Date
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "1px solid #e9ecef",
                background: "#f8f9fa",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {documents?.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "12px" }}>
                No documents found
              </td>
            </tr>
          ) : (
            documents.map((doc, index) => (
              <tr
                key={doc.id}
                style={{ cursor: "pointer" }}
                onClick={() => history.push(`/documentation/mld/${doc.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f1f3f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                <td
                  style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}
                >
                  {index + 1}
                </td>
                <td
                  style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}
                >
                  {doc.name}
                </td>
                <td
                  style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}
                >
                  {doc.createdAt
                    ? new Date(doc.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td
                  style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      handleDelete(doc.id);
                    }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "#e74c3c",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          left: "30px",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => history.push("/documentation/soa")}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #3498db, #2980b9)",
            color: "white",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
          }}
          title="Go to SoA"
        >
          SOA
        </button>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => history.push("/gap-assessment/new")}
          style={{
            padding: "12px 25px",
            borderRadius: "50px",
            background: "linear-gradient(45deg, #27ae60, #2ecc71)",
            color: "white",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 6px 20px rgba(39, 174, 96, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 15px rgba(39, 174, 96, 0.3)";
          }}
          title="Go to MLD"
        >
          🚀 Go to Gap Assessment
        </button>
      </div>
    </div>
  );
};

export default MLD;
