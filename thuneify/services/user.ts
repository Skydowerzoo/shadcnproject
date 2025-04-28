import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchUsers(page = 1, pageSize = 20) {
  const response = await axios.get(`${API_URL}/users?limit=${pageSize}&offset=${(page-1)*pageSize}`);
  return response.data;
}

export async function addUser(newUser) {
  const response = await axios.post(`${API_URL}/register`, newUser);
  return response.data;
}

export async function updateUser(id: string, userData) {
  const response = await axios.put(`${API_URL}/users/${id}`, userData);
  return response.data;
}