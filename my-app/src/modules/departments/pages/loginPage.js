import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/api/users/login", {
        email,
        password,
      });

      // Save token + user
      // Save token + user per tab
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      // Access later in components:
      const user = JSON.parse(sessionStorage.getItem("user"));

      console.log("✅ Login successful:", res.data.user); // 👈 Added log

      if (onLogin) onLogin(res.data.user);
      // Redirect to dashboard
      history.push("/risk-assessment");
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data?.error); // 👈 Error log
      setError(err.response?.data?.error || "Login failed");
    }
  };

  // 🎨 Reusing your dashboard styles
  const pageStyle = {
    marginTop: "60px",
    padding: "15px",
    maxWidth: "400px",
    margin: "100px auto",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e9ecef",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: "#2c3e50", marginBottom: "8px", fontSize: "22px" }}>
          🔐 Login
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "14px", marginBottom: "20px" }}>
          Access your risk dashboard
        </p>

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
