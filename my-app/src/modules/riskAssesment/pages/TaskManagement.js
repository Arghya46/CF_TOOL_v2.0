import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import InputField from "../components/inputs/InputField";
import SelectField from "../components/inputs/SelectField";
import TextAreaField from "../components/inputs/TextAreaField";
import taskService from "../services/taskService";
import riskService from "../services/riskService";
import {
  getAllUsers,
  getDepartments,
} from "../../departments/services/userService";

const TaskManagement = ({ riskFormData = {}, employees = [] }) => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [riskOptions, setRiskOptions] = useState([]);
  const [risks, setRisks] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    riskId: riskFormData.riskId || "",
    department: "",
    employee: "",
    description: "",
    startDate: today,
    endDate: "",
  });

  // Map users to departments
  const userDepartments = users
    .map((u) => {
      const dept = departments.find((d) => d.id === u.departmentId);
      return dept ? dept.name : null;
    })
    .filter((v, i, a) => v && a.indexOf(v) === i); // unique names

  const departmentOption = userDepartments.map((name) => ({
    value: name,
    label: name,
  }));

  const filteredRiskOptions = departmentOption
    ? riskOptions.filter((r) => {
        const relatedRisk = risks.find((risk) => risk.riskId === r.value);
        return relatedRisk?.department === formData.department;
      })
    : [];

  const STATUS = {
    PENDING: "Pending",
    COMPLETED_PENDING: "Completed (Pending Approval)",
    APPROVED: "Approved",
  };

  // Fetch all risks for dropdown
  useEffect(() => {
    const loadRisks = async () => {
      try {
        const risksData = await riskService.getAllRisks();
        setRisks(Array.isArray(risksData) ? risksData : []);
      } catch (err) {
        console.error("Failed to load risks:", err);
        setRisks([]);
      }
    };
    loadRisks();
  }, []);

  // Fetch risk options based on user role
  useEffect(() => {
    const loadRiskOptions = async () => {
      try {
        if (!user) return;

        const allRisks = await riskService.getAllRisks();
        if (!Array.isArray(allRisks)) {
          setRiskOptions([]);
          return;
        }

        if (user.role === "risk_manager") {
          setRiskOptions(
            allRisks.map((r) => ({
              value: r.riskId,
              label: r.riskId,
            }))
          );
          return;
        }

        const depts = await getDepartments();
        const deptName = depts.find((d) => d.id === user.departmentId)?.name;
        const deptRisks = allRisks.filter((r) => r.department === deptName);

        setRiskOptions(
          deptRisks.map((r) => ({
            value: r.riskId,
            label: `${r.riskId} - ${r.riskDescription.slice(0, 30)}...`,
          }))
        );
      } catch (error) {
        console.error("Error loading risks:", error);
        setRiskOptions([]);
      }
    };

    loadRiskOptions();
  }, []);

  // Fetch departments and users
  useEffect(() => {
    const loadDepartmentsAndUsers = async () => {
      try {
        const [deptRes, userRes] = await Promise.all([
          getDepartments(),
          getAllUsers(),
        ]);
        setDepartments(Array.isArray(deptRes) ? deptRes : []);
        setUsers(Array.isArray(userRes) ? userRes : []);
      } catch (err) {
        console.error("Failed to load departments or users:", err);
        setDepartments([]);
        setUsers([]);
      }
    };

    loadDepartmentsAndUsers();
  }, []);

  // Fetch tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await taskService.getAllTasks();
        const filteredTasks = riskFormData.riskId
          ? fetchedTasks.filter((t) => t.riskId === riskFormData.riskId)
          : fetchedTasks;
        setTasks(Array.isArray(filteredTasks) ? filteredTasks : []);
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setTasks([]);
      }
    };

    loadTasks();
  }, [riskFormData.riskId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeptChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      setFormData({ ...formData, department: value, employee: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTask = async () => {
    if (
      !formData.riskId ||
      !formData.department ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Please fill all required fields!");
      return;
    }

    const relatedRisk = risks.find((r) => r.riskId === formData.riskId);
    if (
      relatedRisk &&
      (formData.startDate < relatedRisk.startDate ||
        formData.endDate > relatedRisk.endDate)
    ) {
      alert(
        `Task dates must be within the risk period (${relatedRisk.startDate} → ${relatedRisk.endDate})`
      );
      return;
    }

    const existingTasksForRisk = tasks.filter(
      (t) => t.riskId === formData.riskId
    );
    const newTaskId = `T-${existingTasksForRisk.length + 1}`;

    const newTask = {
      ...formData,
      riskId: riskFormData.riskId || formData.riskId,
      taskId: newTaskId,
      status: "Pending",
    };

    try {
      await taskService.saveTask(newTask);
      const updatedTasks = await taskService.getAllTasks();
      const filteredTasks = riskFormData.riskId
        ? updatedTasks.filter((t) => t.riskId === riskFormData.riskId)
        : updatedTasks;
      setTasks(filteredTasks);
    } catch (err) {
      console.error("Failed to add task", err);
    }

    setFormData({
      riskId: riskFormData.riskId || "",
      employee: "",
      description: "",
      startDate: today,
      endDate: "",
      department: "",
    });
  };

  const markTaskComplete = async (taskId) => {
    try {
      const taskToUpdate = tasks.find((t) => t.taskId === taskId);
      if (!taskToUpdate) return;

      let updatedTask = { ...taskToUpdate };

      if (user.role === "risk_manager") {
        // Manager approves the task
        updatedTask.status = STATUS.APPROVED;
      } else {
        // Employee marks task as completed, pending approval
        updatedTask.status = STATUS.COMPLETED_PENDING;
      }

      await taskService.updateTask(taskId, updatedTask);

      // Update tasks locally
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.taskId === taskId ? updatedTask : t))
      );
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      const reloadedTasks = await taskService.getAllTasks();
      const filteredTasks = riskFormData.riskId
        ? reloadedTasks.filter((t) => t.riskId === riskFormData.riskId)
        : reloadedTasks;
      setTasks(filteredTasks);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const buttonStyle = {
    minWidth: "50px",
    padding: "4px 8px",
    borderRadius: "5px",
    border: "none",
    fontSize: "13px",
    color: "#fff",
    cursor: "pointer",
  };

  const departmentOptions = departments.map((d) => ({
    value: d.name,
    label: d.name,
  }));
  const empOptions = formData.department
    ? users
        .filter((u) => {
          const dept = departments.find((d) => d.id === u.departmentId);
          return dept?.name === formData.department;
        })
        .map((u) => ({ value: u.name, label: u.name }))
    : [];

  const employeeOptions = employees.map((emp) => ({ value: emp, label: emp }));

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      <h2 style={{ marginBottom: "2px", textAlign: "center" }}>Action Plan</h2>
      <p
        style={{
          textAlign: "center",
          color: "#7f8c8d",
          fontSize: "16px",
          marginBottom: "15px",
        }}
      >
        Tasks to treat identified Risks.
      </p>
      {user && ["risk_owner", "risk_manager"].includes(user.role) && (
        <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {location.pathname === "/risk-assessment/tasks" && (
              <SelectField
                label="Related Risk"
                name="riskId"
                value={formData.riskId}
                onChange={handleInputChange}
                options={filteredRiskOptions}
                placeholder={
                  formData.department
                    ? "Select related risk"
                    : "Select department first"
                }
                disabled={!formData.department}
              />
            )}

            <SelectField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleDeptChange}
              options={departmentOptions}
              placeholder="Select department"
            />

            <SelectField
              label="Assign To (Optional)"
              name="employee"
              value={formData.employee}
              onChange={handleDeptChange}
              options={empOptions}
              placeholder="Select employee (optional)"
              disabled={false} // always enabled
            />

            <TextAreaField
              label="Task Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the mitigation task..."
              rows={1}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <InputField
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={formData.startDate}
            />
            <InputField
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate}
              max={riskFormData.deadlineDate}
            />
          </div>

          <button
            onClick={addTask}
            style={{
              background: "#3498db",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ➕ Add Task
          </button>
        </div>
      )}

      <div>
        <h3>📋 Assigned Tasks</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr style={{ background: "#f4f6f8" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Description
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Assignee
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Start Date
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                End Date
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Status
              </th>
              {user?.role === "risk_manager" && (
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {[...tasks]
              .filter((task) => {
                if (!user) return false;
                if (user.role === "risk_manager") return true;
                return task.employee === user.name;
              })
              .sort((a, b) => {
                const startDiff = new Date(a.startDate) - new Date(b.startDate);
                if (startDiff !== 0) return startDiff;
                return new Date(a.endDate) - new Date(b.endDate);
              })
              .map((task) => (
                <tr key={task.taskId}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {task.description}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {task.employee}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {formatDate(task.startDate)}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {formatDate(task.endDate)}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {task.status}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {task.status === STATUS.PENDING && (
                      <button
                        onClick={() => markTaskComplete(task.taskId)}
                        style={{
                          ...buttonStyle,
                          background: "#2ecc71",
                        }}
                      >
                        ✅
                      </button>
                    )}
                    {task.status === STATUS.COMPLETED_PENDING && (
                      <span>
                        {user.role === "risk_manager" ? (
                          <button
                            onClick={() => markTaskComplete(task.taskId)}
                            style={{
                              ...buttonStyle,
                              background: "#f39c12",
                            }}
                          >
                            ✅ Approve
                          </button>
                        ) : (
                          <span>✅ Waiting for approval</span>
                        )}
                      </span>
                    )}
                    {task.status === STATUS.APPROVED && (
                      <span>✅ Approved</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManagement;
