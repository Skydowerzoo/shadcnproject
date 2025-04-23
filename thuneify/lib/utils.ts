import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterExpensesByTimeRange(data: Expense[], timeRange: string): Expense[] {
  const referenceDate = new Date();
  let daysToSubtract = 360;
  if (timeRange === "180d") daysToSubtract = 180;
  else if (timeRange === "90d") daysToSubtract = 90;
  else if (timeRange === "30d") daysToSubtract = 30;
  else if (timeRange === "7d") daysToSubtract = 7;
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);
  return data.filter((item) => new Date(item.date) >= startDate);
}
