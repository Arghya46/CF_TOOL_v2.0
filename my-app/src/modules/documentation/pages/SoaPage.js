import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import documentationService from "../services/documentationService";
import { DOCUMENT_MAPPING } from "../constants";

const STATUS_OPTIONS = ["Implemented", "Planned", "Not Applicable"];
const JUSTIFICATION_OPTIONS = [
  "Risk Identified",
  "Regulatory Requirement",
  "Management Decision",
  "Other",
];

const SoaPage = () => {
  const history = useHistory();
  const [controls, setControls] = useState([]);

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const storedControls = await documentationService.getControls();
        const soaEntries = await documentationService.getSoAEntries();

        const controlsWithRefs = storedControls.map((control) => {
          const soaEntry = soaEntries.find((e) => e.controlId === control.id);
          const docRefs = DOCUMENT_MAPPING[String(control.category)] || ["N/A"];

          return {
            ...control,
            status: soaEntry?.status || "Planned",
            documentRef: soaEntry?.documentRef || docRefs,
            justification: soaEntry?.justification || "Risk Identified",
          };
        });

        setControls(controlsWithRefs);
      } catch (error) {
        console.error("Error fetching controls:", error);
      }
    };

    fetchControls();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedControls = controls.map((c) =>
        c.id === id ? { ...c, status: newStatus } : c
      );
      setControls(updatedControls);

      const control = updatedControls.find((c) => c.id === id);
      if (!control) return;

      const existingEntries = await documentationService.getSoAEntries();
      const existingEntry = existingEntries.find((e) => e.controlId === id);

      if (existingEntry) {
        await documentationService.updateSoAEntry(existingEntry.id, {
          status: newStatus,
          documentRef: control.documentRef,
          justification: control.justification,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating SoA entry:", error);
    }
  };

  const handleJustificationChange = async (id, newJustification) => {
    try {
      const updatedControls = controls.map((c) =>
        c.id === id ? { ...c, justification: newJustification } : c
      );
      setControls(updatedControls);

      const control = updatedControls.find((c) => c.id === id);
      if (!control) return;

      const existingEntries = await documentationService.getSoAEntries();
      const existingEntry = existingEntries.find((e) => e.controlId === id);

      if (existingEntry) {
        await documentationService.updateSoAEntry(existingEntry.id, {
          status: control.status,
          documentRef: control.documentRef,
          justification: newJustification,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating justification:", error);
    }
  };

  return (
    <div
      style={{
        marginTop: "60px",
        padding: "20px",
        maxWidth: "1000px",
        margin: "60px auto 0",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
          border: "1px solid #e9ecef",
        }}
      >
        <h1 style={{ color: "#2c3e50" }}>
          📑 Statement of Applicability (SoA)
        </h1>
        <p style={{ color: "#7f8c8d" }}>
          Manage the status of your security controls.
        </p>

        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                ID
              </th>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                Control
              </th>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                Description
              </th>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                Document Reference
              </th>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                Justification
              </th>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {controls.map((control) => (
              <tr key={control.id}>
                <td style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                  {control.id}
                </td>
                <td style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                  {control.category}
                </td>
                <td style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                  {control.description}
                </td>
                <td
                  style={{
                    border: "1px solid #dee2e6",
                    padding: "10px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {control.documentRef.join("\n")}
                </td>
                <td style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                  <select
                    value={control.justification}
                    onChange={(e) =>
                      handleJustificationChange(control.id, e.target.value)
                    }
                    style={{
                      padding: "5px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {JUSTIFICATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                  <select
                    value={control.status}
                    onChange={(e) =>
                      handleStatusChange(control.id, e.target.value)
                    }
                    style={{
                      padding: "5px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
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
            onClick={() => history.push("/risk-assessment/saved")}
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
            title="Go to Saved Risks"
          >
            📁
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
            onClick={() => history.push("/documentation/mld")}
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
            🚀 Go to MLD
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoaPage;
