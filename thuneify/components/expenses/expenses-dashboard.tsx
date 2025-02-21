"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpensesForm } from "./expenses-form";
const chartData = [
  { date: "2024-06-22", perso: 15, commun: 0 },
  { date: "2024-06-23", perso: 0, commun: 30 },
  { date: "2024-06-24", perso: 25, commun: 10 },
  { date: "2024-06-25", perso: 13, commun: 35 },
  { date: "2024-06-26", perso: 40, commun: 15 },
  { date: "2024-06-27", perso: 30, commun: 20 },
  { date: "2024-12-28", perso: 36, commun: 52 },
  { date: "2024-11-10", perso: 36, commun: 52 },
  { date: "2025-02-10", perso: 36, commun: 52 },
];

const sortedChartData = chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

const chartConfig = {
  euros: {
    label: "Euros",
  },
  perso: {
    label: "Perso",
    color: "hsl(var(--chart-1))",
  },
  commun: {
    label: "Commun",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Dashboard() {
  const [timeRange, setTimeRange] = React.useState("360d");
  const [data, setData] = React.useState(chartData);

  const handleAddExpense = (newExpense) => {
    setData((prevData) => {
      const updatedData = [...prevData, newExpense];
      return updatedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    });;
  };

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-02-21");

    let daysToSubtract = 360;
    if (timeRange === "180d") {
      daysToSubtract = 180;
    }
    else if (timeRange === "90d") {
      daysToSubtract = 90;
    }
    else if (timeRange === "30d") {
      daysToSubtract = 30;
    }
    else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <>
      <Card className=" mb-5 w-1/3 place-self-center">
        <div className=" m-2  ">
          <ExpensesForm onAddExpense={handleAddExpense} />
        </div>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Account Expenses</CardTitle>
            <CardDescription>Showing monthly expenses</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 1 year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
            <SelectItem value="360d" className="rounded-lg">
                Last 1 year
              </SelectItem>
              <SelectItem value="180d" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPerso" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-perso)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-perso)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillcommun" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-commun)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-commun)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="commun"
                type="natural"
                fill="url(#fillcommun)"
                stroke="var(--color-commun)"
                stackId="a"
              />
              <Area
                dataKey="perso"
                type="natural"
                fill="url(#fillPerso)"
                stroke="var(--color-perso)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
