import axios from "axios";

export type Expense = {
  id: string;
  date: string;
  perso: number;
  commun: number;
};

export async function fetchExpenses(): Promise<Expense[]> {
  const response = await axios.get("http://localhost:5000/api/expenses");
  return response.data;
}

export async function addExpense(newExpense: Expense): Promise<Expense> {
  const response = await axios.post("http://localhost:5000/api/expenses", newExpense);
  return response.data;
}

export async function deleteExpense(id: string): Promise<string> {
  const response = await axios.delete(`http://localhost:5000/api/expenses/${id}`);
  return response.data?.message || "Suppression effectuée.";
}
