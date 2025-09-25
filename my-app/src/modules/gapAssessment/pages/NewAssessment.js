import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import documentationService from "../../documentation/services/documentationService";
import gapService from "../services/gapService"; // ✅ Import gap service

const NewAssessment = () => {
  const [documents, setDocuments] = useState([]);
  const [gaps, setGaps] = useState({});
  const [selectedDoc, setSelectedDoc] = useState(null);

  const history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await documentationService.getDocuments();
        const gapData = await gapService.getGaps();

        // Convert gap array to object for fast lookup: { docId: status }
        const gapMap = (gapData || []).reduce((acc, gap) => {
          acc[gap.docId] = gap.status;
          return acc;
        }, {});

        setDocuments(docs || []);
        setGaps(gapMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (doc, newStatus) => {
    try {
      setGaps((prev) => ({ ...prev, [doc.id]: newStatus })); // set immediately (UI shows Checking...)

      if (newStatus === "Checking...") {
        // Call backend compliance check
        const result = await gapService.checkCompliance(doc.id); // returns { score: 85 }

        // Save final status as Score
        setGaps((prev) => ({ ...prev, [doc.id]: `Score: ${result.score}` }));
      } else {
        // For normal statuses
        await gapService.updateGap(doc.id, { status: newStatus });
        setGaps((prev) => ({ ...prev, [doc.id]: newStatus }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setGaps((prev) => ({ ...prev, [doc.id]: "Error" }));
    }
  };

  const handleMarkVerification = (doc) => {
    updateStatus(doc, "Checking...");
  };

  const handleApprove = (doc) => {
    updateStatus(doc, "Closed");
  };

  const handleReject = (doc) => {
    updateStatus(doc, "Rejected");
  };

  return (
    <div
      style={{
        marginTop: "60px",
        padding: "15px",
        maxWidth: "900px",
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
          📝 New Assessment
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "14px" }}>
          Review uploaded documents, mark for verification, approve or reject.
        </p>
      </div>

      {/* Document Table */}
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
            <th style={thStyle}>Sl.No</th>
            <th style={thStyle}>Document Name</th>
            <th style={thStyle}>Uploaded Date</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "12px" }}>
                No documents found
              </td>
            </tr>
          ) : (
            documents.map((doc, index) => (
              <tr key={doc.id}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{doc.name || "Unnamed Document"}</td>
                <td style={tdStyle}>
                  {doc.createdAt
                    ? new Date(doc.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: gaps[doc.id]?.startsWith("Score")
                        ? "#2980b9" // blue for score
                        : gaps[doc.id] === "Closed"
                        ? "#2ecc71"
                        : gaps[doc.id] === "Pending" ||
                          gaps[doc.id] === "Checking..."
                        ? "#f39c12"
                        : gaps[doc.id] === "Rejected"
                        ? "#e74c3c"
                        : "#bdc3c7",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {gaps[doc.id] || "Open"}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleMarkVerification(doc)}
                    style={btnStyle("#f39c12")}
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    style={btnStyle("#3498db")}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleApprove(doc)}
                    style={btnStyle("#2ecc71")}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(doc)}
                    style={btnStyle("#e74c3c")}
                  >
                    Reject
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
          onClick={() => history.push("/documentation/mld")}
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
          title="Go to MLD"
        >
          MLD
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
          onClick={() => history.push("/gap-assessment/history")}
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
          title="Go to History"
        >
          🚀 Go to History
        </button>
      </div>
      {/* Modal for Viewing Document */}
      {selectedDoc && (
        <div style={modalOverlay} onClick={() => setSelectedDoc(null)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: "15px" }}>{selectedDoc.name}</h2>
            <iframe
              src={`http://localhost:4000${selectedDoc.url}`}
              style={{
                width: "100%",
                height: "500px",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
              }}
              title="Document Preview"
            />
            <button
              onClick={() => setSelectedDoc(null)}
              style={btnStyle("#e74c3c")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 🔧 Small styles extracted for reusability
const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #e9ecef",
  background: "#f8f9fa",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e9ecef",
};

const btnStyle = (bgColor) => ({
  padding: "6px 12px",
  marginRight: "8px",
  borderRadius: "6px",
  background: bgColor,
  color: "white",
  border: "none",
  cursor: "pointer",
});

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalBox = {
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  width: "80%",
  maxWidth: "700px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
  position: "relative",
};

export default NewAssessment;
