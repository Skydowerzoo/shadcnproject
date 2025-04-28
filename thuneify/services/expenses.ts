import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type Expense = {
  id: string;
  date: string;
  perso: number;
  commun: number;
};

export async function fetchExpenses(page = 1, pageSize = 20): Promise<Expense[]> {
  const response = await axios.get(`${API_URL}/expenses?limit=${pageSize}&offset=${(page-1)*pageSize}`);
  return response.data;
}

export async function addExpense(newExpense: Expense): Promise<Expense> {
  const response = await axios.post(`${API_URL}/expenses`, newExpense);
  return response.data;
}

export async function deleteExpense(id: string): Promise<string> {
  const response = await axios.delete(`${API_URL}/expenses/${id}`);
  return response.data?.message || "Suppression effectuée.";
}
