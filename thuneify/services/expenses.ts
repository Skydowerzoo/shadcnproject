import axios from "axios";

export type Expense = {
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
