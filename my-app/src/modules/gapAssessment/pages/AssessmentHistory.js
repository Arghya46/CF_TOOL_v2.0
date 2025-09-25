import React, { useEffect, useState } from "react";
import gapService from "../services/gapService";

const AssessmentHistory = () => {
  const [gaps, setGaps] = useState([]);
  const [selectedGap, setSelectedGap] = useState(null);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const data = await gapService.getGaps();
        setGaps(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGaps();
  }, []);

  return (
    <div style={{ marginTop: 60, padding: 15, maxWidth: 900, margin: "60px auto 0" }}>
      <div style={{ background: "white", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 3px 12px rgba(0,0,0,0.06)", border: "1px solid #e9ecef", textAlign: "center" }}>
        <h1 style={{ color: "#2c3e50", fontSize: 22 }}>📜 Assessment History</h1>
        <p style={{ color: "#7f8c8d", fontSize: 14 }}>View previously reviewed documents and their final statuses.</p>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 10, overflow: "hidden", boxShadow: "0 3px 12px rgba(0,0,0,0.06)" }}>
        <thead>
          <tr>
            <th style={thStyle}>Sl.No</th>
            <th style={thStyle}>Document Name</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Score</th>
            <th style={thStyle}>Missing Sections</th>
          </tr>
        </thead>
        <tbody>
          {gaps.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 12 }}>No assessment history found</td>
            </tr>
          ) : (
            gaps.map((gap, index) => (
              <tr key={gap.docId}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{gap.docName || "Unnamed Document"}</td>
                <td style={tdStyle}>{gap.status}</td>
                <td style={tdStyle}>{gap.score ?? "-"}</td>
                <td style={tdStyle}>{(gap.missing_sections || []).join(", ") || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: 12, borderBottom: "1px solid #e9ecef", background: "#f8f9fa" };
const tdStyle = { padding: 12, borderBottom: "1px solid #e9ecef" };

export default AssessmentHistory;
