import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchGroceries(page = 1, pageSize = 20) {
  const response = await axios.get(`${API_URL}/grocery?limit=${pageSize}&offset=${(page-1)*pageSize}`);
  return response.data;
}

export async function addGrocery(newGrocery) {
  const response = await axios.post(`${API_URL}/grocery`, newGrocery);
  return response.data;
}

export async function deleteGrocery(id: string) {
  const response = await axios.delete(`${API_URL}/grocery/${id}`);
  return response.data?.message || "Suppression effectuée.";
}