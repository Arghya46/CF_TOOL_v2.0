import React, { useEffect } from "react";
import TextAreaField from "../inputs/TextAreaField";
import { CONTROL_MAPPING } from "../../constants";
import SelectField from "../inputs/SelectField";
import Select from "react-select";

const controlOptions = Object.keys(CONTROL_MAPPING).map((key) => ({
  value: key,
  label: `${key} - ${CONTROL_MAPPING[key].split("\n")[0]}`, // show first line only
}));

const TreatmentPlanForm = ({ formData, handleInputChange, actionPlan }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getActionPlan = (riskLevel) => {
    switch (riskLevel) {
      case "Low":
        return "Accept";
      case "Medium":
        return "Mitigate";
      case "High":
        return "Mitigate";
        return "Not defined yet";
    }
  };

  const summaryCardStyle = {
    background: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
    color: "white",
    padding: "20px 30px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 8px 25px rgba(230, 126, 34, 0.3)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
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

  const calculatedItemStyle = {
    textAlign: "center",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    marginBottom: "25px",
  };

  const calculatedLabelStyle = {
    display: "block",
    fontWeight: "600",
    color: "#34495e",
    marginBottom: "10px",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const calculatedValueStyle = {
    fontSize: "24px",
    fontWeight: "700",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2c3e50",
    border: "2px solid #ecf0f1",
  };

  // Determine action
  const action = getActionPlan(formData.riskLevel);

  // Auto-set status if action = Accept
  const statusValue =
    action === "Accept" ? "Closed" : formData.status || "Active";

  useEffect(() => {
    const action = getActionPlan(formData.riskLevel);
    if (action === "Accept" && formData.status !== "Closed") {
      handleInputChange({
        target: { name: "status", value: "Closed" },
      });
    }
  }, [formData.riskLevel]);

  return (
    <div style={formStyle}>
      {/* Summary Header Card */}
      <div style={summaryCardStyle}>
        <div style={summaryItemStyle}>
          <span style={summaryLabelStyle}>Risk ID</span>
          <span style={summaryValueStyle}>{formData.riskId || "Not Set"}</span>
        </div>
        <div style={summaryItemStyle}>
          <span style={summaryLabelStyle}>Department</span>
          <span style={summaryValueStyle}>
            {formData.department || "Not Set"}
          </span>
        </div>
        <div style={summaryItemStyle}>
          <span style={summaryLabelStyle}>Risk Type</span>
          <span style={summaryValueStyle}>
            {formData.riskType || "Not Set"}
          </span>
        </div>
      </div>

      {/* Page Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "35px",
          paddingBottom: "20px",
          borderBottom: "3px solid #e67e22",
        }}
      >
        <h2
          style={{
            color: "#2c3e50",
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          🛡️ Treatment Plan
        </h2>
        <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
          Define controls and mitigation plan for the identified risk
        </p>
      </div>

      {/* Action Plan Announcement Card */}
      {/* Action Plan Card */}
      <div style={calculatedItemStyle}>
        <label style={calculatedLabelStyle}>Action</label>
        <span style={calculatedValueStyle}>
          {getActionPlan(formData.riskLevel)}
        </span>
      </div>

      {/* Status Selection */}
      <div style={calculatedItemStyle}>
        <label style={calculatedLabelStyle}>Status</label>
        <Select
          name="status"
          options={[
            { value: "Active", label: "Active" },
            { value: "Closed", label: "Closed" },
          ]}
          value={{ value: statusValue, label: statusValue }}
          onChange={(selected) =>
            handleInputChange({
              target: { name: "status", value: selected.value },
            })
          }
          isDisabled={action === "Accept"} // lock if auto-closed
        />
      </div>

      {/* Control Implementation Section */}
      <div
        style={{
          background: "rgba(230, 126, 34, 0.05)",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid rgba(230, 126, 34, 0.1)",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            color: "#2c3e50",
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          🔧 Control Implementation
        </h3>
        <p style={{ color: "#7f8c8d", marginBottom: "25px", fontSize: "14px" }}>
          Specify the control measures and additional safeguards to mitigate the
          identified risk
        </p>

        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid #e9ecef",
          }}
        >
          <h3>Risk Description</h3>
          <p>{formData.riskDescription || "No description available"}</p>
        </div>
        <TextAreaField
          label="New/Proposed Controls"
          name="additionalControls"
          value={formData.additionalControls || ""}
          onChange={handleInputChange}
          placeholder="Describe any additional control measures, compensating controls, or specific implementation details needed to address this risk effectively..."
          rows={2}
          required
        />
        {/* Show Risk Description */}
        <p>Applicable Control(s)</p>
        <Select
          placeholder="Choose applicable control numbers to mitigate the identified risks."
          isMulti
          name="controlReference"
          options={Object.keys(CONTROL_MAPPING).map((control) => ({
            value: control,
            label: control,
          }))}
          value={(formData.controlReference || []).map((c) => ({
            value: c,
            label: c,
          }))}
          onChange={(selected) =>
            handleInputChange({
              target: {
                name: "controlReference",
                value: selected ? selected.map((s) => s.value) : [],
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default TreatmentPlanForm;
