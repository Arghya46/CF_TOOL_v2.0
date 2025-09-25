import React, { useEffect, useCallback } from "react";
import InputField from "../inputs/InputField";
import SelectField from "../inputs/SelectField";

const ResidualRiskForm = ({ formData = {}, handleInputChange }) => {
  useEffect(() => {
    // always reset to top when component loads
    window.scrollTo(0, 0);
  }, []);

  // Calculate deadline date dynamically with null checks
  const calculateDeadlineDate = useCallback(() => {
    if (formData.date && formData.numberOfDays) {
      const startDate = new Date(formData.date);
      const days = parseInt(formData.numberOfDays) || 0;
      if (days > 0) {
        const deadlineDate = new Date(startDate);
        deadlineDate.setDate(startDate.getDate() + days);
        return deadlineDate.toISOString().split("T")[0];
      }
    }
    return "";
  }, [formData.date, formData.numberOfDays]);

  // Update deadline whenever numberOfDays changes
  useEffect(() => {
    const deadline = calculateDeadlineDate();
    if (deadline && deadline !== formData.deadlineDate) {
      handleInputChange({
        target: { name: "deadlineDate", value: deadline },
      });
    }
  }, [calculateDeadlineDate, formData.deadlineDate, handleInputChange]);

  // Dropdown options for Likelihood & Impact After Treatment
  const likelihoodOptions = [
    { value: 1, label: "1 - Unlikely" },
    { value: 2, label: "2 - Possible" },
    { value: 3, label: "3 - Likely" },
    { value: 4, label: "4 - Almost Certain" },
  ];

  const riskActionMapping = {
    Low: ["Accept", "Monitor"],
    Medium: ["Mitigate", "Monitor"],
    High: ["Mitigate"],
  };

  const impactOptions = [
    { value: 1, label: "1 - Low Impact" },
    { value: 2, label: "2 - Medium Impact" },
    { value: 3, label: "3 - High Impact" },
  ];

  const calculateResidualRiskScore = () => {
    const impact = parseInt(formData.impactAfterTreatment) || 0;
    const likelihood = parseInt(formData.likelihoodAfterTreatment) || 0;
    return impact * likelihood;
  };

  const calculateRiskLevel = (score) => {
    if (score <= 3) return "Low";
    if (score <= 8) return "Medium";
    if (score <= 12) return "High";
    return "Critical";
  };

  const residualRiskScore = calculateResidualRiskScore();
  const residualRiskLevel = calculateRiskLevel(residualRiskScore);

  const summaryCardStyle = {
    background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
    color: "white",
    padding: "20px 30px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 8px 25px rgba(155, 89, 182, 0.3)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  };

  const calculatedFieldsStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    background: "linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
  };

  const calculatedItemStyle = {
    textAlign: "center",
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  };

  const calculatedLabelStyle = {
    display: "block",
    fontWeight: "600",
    color: "#34495e",
    marginBottom: "8px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const calculatedValueStyle = {
    fontSize: "20px",
    fontWeight: "700",
    padding: "6px 10px",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2c3e50",
    border: "2px solid #ecf0f1",
  };

  const summaryItemStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };

  const summaryLabelStyle = {
    fontSize: "12px",
    opacity: "0.9",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const summaryValueStyle = {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  };

  const formStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    maxWidth: "900px",
    margin: "0 auto",
    border: "1px solid #e9ecef",
  };

  // Format date for display with null checks
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not Set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div style={formStyle}>
      {/* Summary Header Card */}

      {/* Title */}
      {/* <div style={{textAlign: 'center', marginBottom: '35px', paddingBottom: '20px', borderBottom: '3px solid #9b59b6'}}>
        <h2 style={{color: '#2c3e50', fontSize: '28px', fontWeight: '700', marginBottom: '8px'}}>
          📊 Residual Risk & Task Assignment
        </h2>
        <p style={{color: '#7f8c8d', fontSize: '16px'}}>Finalize task scheduling and assignment details</p>
      </div> */}

      {/* Task Scheduling */}
      <div
        style={{
          background: "rgba(155, 89, 182, 0.05)",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid rgba(155, 89, 182, 0.1)",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            color: "#2c3e50",
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          📅 Task Scheduling
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
            marginBottom: "25px",
          }}
        >
          <InputField
            label="Start Date (From Risk Assessment)"
            name="startDateDisplay"
            value={formData.date || ""}
            onChange={() => {}}
            readOnly={true}
            type="date"
          />

          <InputField
            label="Target Date of Closure (Days)"
            name="numberOfDays"
            value={formData.numberOfDays || ""}
            onChange={handleInputChange}
            placeholder="Enter number of days (e.g., 3, 5, 7)"
            type="number"
            min="1"
            max="365"
            required
          />
        </div>

        {/* Calculated Deadline */}
        {formData.numberOfDays && formData.date && (
          <div
            style={{
              background: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
              color: "white",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(26, 188, 156, 0.3)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                opacity: "0.9",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              📅 Calculated Task Deadline
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>
              {formatDateForDisplay(calculateDeadlineDate())}
            </div>
          </div>
        )}
      </div>

      {/* Likelihood & Impact After Treatment */}
      <div
        style={{
          background: "rgba(155, 89, 182, 0.05)",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid rgba(155, 89, 182, 0.1)",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            color: "#2c3e50",
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          🎯 Residual Risk Assessment
        </h3>
        <div style={summaryCardStyle}>
          <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>Likelihood</span>
            <span style={summaryValueStyle}>
              {formData.probability || "Not Set"}
            </span>
          </div>
          <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>Impact</span>
            <span style={summaryValueStyle}>
              {formData.impact || "Not Set"}
            </span>
          </div>
          <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>Risk Score</span>
            <span style={summaryValueStyle}>
              {parseInt(formData.impact)*parseInt(formData.probability) || "Not Set"}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          <SelectField
            label="Likelihood After Treatment"
            name="likelihoodAfterTreatment"
            value={formData.likelihoodAfterTreatment || ""}
            onChange={handleInputChange}
            options={likelihoodOptions}
            placeholder="Select Likelihood"
            required
          />

          <SelectField
            label="Impact After Treatment"
            name="impactAfterTreatment"
            value={formData.impactAfterTreatment || ""}
            onChange={handleInputChange}
            options={impactOptions}
            placeholder="Select Impact"
            required
          />
        </div>

        {/* Calculated Residual Risk Display */}
        {formData.likelihoodAfterTreatment && formData.impactAfterTreatment && (
          <div style={calculatedFieldsStyle}>
            <div style={calculatedItemStyle}>
              <label style={calculatedLabelStyle}>Likelihood</label>
              <span style={calculatedValueStyle}>
                {formData.likelihoodAfterTreatment}
              </span>
            </div>

            <div style={calculatedItemStyle}>
              <label style={calculatedLabelStyle}>Impact</label>
              <span style={calculatedValueStyle}>
                {formData.impactAfterTreatment}
              </span>
            </div>

            <div style={calculatedItemStyle}>
              <label style={calculatedLabelStyle}>Risk Score</label>
              <span style={calculatedValueStyle}>{residualRiskScore}</span>
            </div>

            <div style={calculatedItemStyle}>
              <label style={calculatedLabelStyle}>Risk Level</label>
              <span
                style={{
                  ...calculatedValueStyle,
                  backgroundColor:
                    residualRiskLevel === "Low"
                      ? "#d5f4e6"
                      : residualRiskLevel === "Medium"
                      ? "#fef9e7"
                      : residualRiskLevel === "High"
                      ? "#fdf2e9"
                      : "#fadbd8",
                  color:
                    residualRiskLevel === "Low"
                      ? "#27ae60"
                      : residualRiskLevel === "Medium"
                      ? "#f39c12"
                      : residualRiskLevel === "High"
                      ? "#e67e22"
                      : "#e74c3c",
                  border: `2px solid ${
                    residualRiskLevel === "Low"
                      ? "#27ae60"
                      : residualRiskLevel === "Medium"
                      ? "#f39c12"
                      : residualRiskLevel === "High"
                      ? "#e67e22"
                      : "#e74c3c"
                  }`,
                }}
              >
                {residualRiskLevel}
              </span>
            </div>
            {residualRiskLevel && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // centers content horizontally
                  textAlign: "center",
                }}
              >
                <h4 style={{ marginBottom: "10px", color: "#f39c12" }}>
                  ⚡ Recommended Actions
                </h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {riskActionMapping[residualRiskLevel].map((action, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        backgroundColor: "#f1c40f",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        backgroundColor: "#f1c40f",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "12px",
                      }}
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidualRiskForm;
