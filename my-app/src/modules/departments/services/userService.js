// services/userService.js
import axios from "axios";

const API_URL = "http://localhost:4000/api/users"; // adjust to your backend

export const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

export const getDepartments = async () => {
  const res = await axios.get(`${API_URL}/departments`);
  return res.data;
};
