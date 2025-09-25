import React, { useState, useEffect } from "react";
import documentationService from "../services/documentationService";
import { DOCUMENT_MAPPING } from "../constants";
const ControlsPage = () => {
  const [controls, setControls] = useState([]);
  const [newControl, setNewControl] = useState({
    category: "",
    description: "",
  });

  useEffect(() => {
    loadControls();
  }, []);

  const loadControls = async () => {
    try {
      const data = await documentationService.getControls();
      setControls(data);
    } catch (error) {
      console.error("Error loading controls:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newControl.category || !newControl.description) return;

    try {
      const addedControl = await documentationService.addControl({
        category: newControl.category,
        description: newControl.description,
      });

      // Automatically create SoA entry
      const docRefs = DOCUMENT_MAPPING[newControl.category] || ["N/A"];

      await documentationService.addSoAEntry({
        controlId: addedControl.id, // use sequential ID
        category: addedControl.category,
        description: addedControl.description,
        status: "Planned",
        documentRef: docRefs,
        createdAt: new Date().toISOString(),
      });

      setControls([...controls, addedControl]);
      setNewControl({ category: "", description: "" });
    } catch (error) {
      console.error("Error adding control:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this control?"))
      return;

    try {
      await documentationService.deleteControl(id);
      setControls(controls.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting control:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "60px auto 0" }}>
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
          border: "1px solid #e9ecef",
        }}
      >
        <h1 style={{ color: "#2c3e50" }}>🛡️ Control Library</h1>
        <p style={{ color: "#7f8c8d" }}>
          Browse and manage your security controls.
        </p>

        {/* Table */}
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
                Actions
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
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => handleDelete(control.id)}
                    style={{
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#e74c3c",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Form */}
        <form onSubmit={handleAdd} style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Please Enter Control Number"
            value={newControl.category}
            onChange={(e) =>
              setNewControl({ ...newControl, category: e.target.value })
            }
            style={{
              padding: "10px",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
          <input
            type="text"
            placeholder="Please Enter Control Description"
            value={newControl.description}
            onChange={(e) =>
              setNewControl({ ...newControl, description: e.target.value })
            }
            style={{
              padding: "10px",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "300px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              border: "none",
              borderRadius: "6px",
              background: "#27ae60",
              color: "white",
              cursor: "pointer",
            }}
          >
            ➕ Add Control
          </button>
        </form>
      </div>
    </div>
  );
};

export default ControlsPage;
