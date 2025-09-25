import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import riskService from "../services/riskService";
import { getDepartments } from "../../departments/services/userService";

const RiskAssessment = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("Logged in user:", user);
  const history = useHistory();
  const [riskStats, setRiskStats] = useState({
    total: 0,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
    open: 0,
    closed: 0,
  });

  useEffect(() => {
    if (user) {
      console.log(
        `User ${user.name} belongs to department ${user.departmentId}`
      );
    }
  }, []);
  const calculateRiskLevel = (risk) => {
    const impact = Math.max(
      parseInt(risk.confidentiality) || 0,
      parseInt(risk.integrity) || 0,
      parseInt(risk.availability) || 0
    );
    const probability = parseInt(risk.probability) || 0;
    const riskScore = impact * probability;

    if (riskScore <= 3) return "Low";
    if (riskScore <= 8) return "Medium";
    if (riskScore <= 12) return "High";
    return "Critical";
  };

  const [departmentName, setDepartmentName] = useState("");

  useEffect(() => {
    const fetchDepartmentName = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) return;

        const data = await getDepartments(); // get all departments
        const dept = data.find((d) => d.id === user.departmentId); // find user's dept
        if (dept) setDepartmentName(dept.name); // set dept name
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };

    fetchDepartmentName();
  }, []);

  // ✅ Memoize the function so it stays stable across renders
  const loadRiskStats = useCallback(async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user) return;

      // Fetch all risks
      const risks = await riskService.getAllRisks();
      if (!Array.isArray(risks)) return;

      // Get user's department name
      const departments = await getDepartments();
      const deptName = departments.find(
        (d) => d.id === user.departmentId
      )?.name;

      if (!deptName) return;

      // Filter risks by department name
      const departmentRisks = risks.filter(
        (risk) => risk.department === deptName
      );

      // Calculate stats
      const stats = departmentRisks.reduce(
        (acc, risk) => {
          acc.total++;
          const level = calculateRiskLevel(risk);
          acc[level.toLowerCase()]++;
          if (risk.status === "Active") acc.open++;
          else acc.closed++;

          return acc;
        },
        {
          total: 0,
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
          open: 0,
          closed: 0,
        }
      );

      setRiskStats(stats);
      setDepartmentName(deptName);
    } catch (error) {
      console.error("Error loading risk stats:", error);
    }
  }, []);

  // ✅ no dependencies since calculateRiskLevel is stable

  useEffect(() => {
    loadRiskStats();
  }, [loadRiskStats]);

  // 🔹 Smaller UI styles
  const pageStyle = {
    marginTop: "60px",
    padding: "15px",
    maxWidth: "1000px",
    margin: "60px auto 0",
  };

  const headerStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e9ecef",
    textAlign: "center",
  };

  const statsStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  };

  const statCardStyle = {
    background: "white",
    padding: "18px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
    textAlign: "center",
    border: "1px solid #e9ecef",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const actionsStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "15px",
  };

  const actionCardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
    textAlign: "center",
    border: "1px solid #e9ecef",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ color: "#2c3e50", marginBottom: "8px", fontSize: "22px" }}>
          📊 Risk Management Dashboard
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "14px" }}>
          Identify Manage and Treat Risk.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={statsStyle}>
        <div
          style={{ ...statCardStyle, borderLeft: "3px solid #3498db" }}
          onClick={() => history.push("/risk-assessment/saved")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h2
            style={{ color: "#3498db", margin: "0 0 6px 0", fontSize: "28px" }}
          >
            {riskStats.total}
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              margin: 0,
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Total Risks
          </p>
        </div>
        <div
          style={{ ...statCardStyle, borderLeft: "3px solid #27ae60" }}
          onClick={() => history.push("/risk-assessment/saved")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h2
            style={{ color: "#27ae60", margin: "0 0 6px 0", fontSize: "28px" }}
          >
            {riskStats.low}
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              margin: 0,
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Low Risk
          </p>
        </div>
        <div
          style={{ ...statCardStyle, borderLeft: "3px solid #f39c12" }}
          onClick={() => history.push("/risk-assessment/saved")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h2
            style={{ color: "#f39c12", margin: "0 0 6px 0", fontSize: "28px" }}
          >
            {riskStats.medium}
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              margin: 0,
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Medium Risk
          </p>
        </div>
        <div
          style={{ ...statCardStyle, borderLeft: "3px solid #e74c3c" }}
          onClick={() => history.push("/risk-assessment/saved")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h2
            style={{ color: "#e74c3c", margin: "0 0 6px 0", fontSize: "28px" }}
          >
            {riskStats.high + riskStats.critical}
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              margin: 0,
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            High Risk
          </p>
        </div>
        {/* Open Risks */}
        <div style={{ ...statCardStyle, borderLeft: "3px solid #2980b9" }}>
          <h2 style={{ color: "#2980b9", fontSize: "28px" }}>
            {riskStats.open}
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              fontSize: "13px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Open Risks
          </p>
        </div>

        {/* Closed Risks */}
        <div style={{ ...statCardStyle, borderLeft: "3px solid #27ae60" }}>
          <h2 style={{ color: "#27ae60", fontSize: "28px" }}>
            {riskStats.closed}
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              fontSize: "13px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Closed Risks
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={actionsStyle}>
        <div
          style={actionCardStyle}
          onClick={() => history.push("/risk-assessment/templates")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-3px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>📄</div>
          <h3
            style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#2c3e50" }}
          >
            Sample Risks
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#7f8c8d" }}>
            Choose your Risk from This Repository
          </p>
        </div>
        <div
          style={{
            ...actionCardStyle,
            background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
            color: "white",
          }}
          onClick={() => history.push("/risk-assessment/add")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-3px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔍</div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "16px" }}>Add New Risk</h3>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
            Identify a New Risk
          </p>
        </div>

        <div
          style={actionCardStyle}
          onClick={() => history.push("/risk-assessment/tasks")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-3px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>⚡</div>
          <h3
            style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#2c3e50" }}
          >
            Task Management
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#7f8c8d" }}>
            Track and Manage Assigned Tasks to Treat Risks
          </p>
        </div>
        {(user.role === "risk_owner" || user.role === "risk_manager") && (
          <div
            style={actionCardStyle}
            onClick={() => history.push("/risk-assessment/saved")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-3px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📁</div>
            <h3
              style={{
                margin: "0 0 6px 0",
                fontSize: "16px",
                color: "#2c3e50",
              }}
            >
              View Saved Risks
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#7f8c8d" }}>
              View Identified Risk for your Department
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessment;
