"use client";

import { Button } from "@/components/ui/button";
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
import { BarChart2, Eye, EyeOff, Plus, Table } from "lucide-react"; // Ajout de l'icône Plus
import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { DataTable } from "./data-table";
import { ExpensesForm } from "./expenses-form"; // Importer le formulaire

// Importer les composants Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const chartConfig = {
  perso: {
    label: "Perso",
    color: "hsl(var(--chart-1))",
  },
  commun: {
    label: "Commun",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Expense = {
  date: string; // La date au format "YYYY-MM-DD"
  perso: number; // Le montant pour le compte personnel
  commun: number; // Le montant pour le compte commun
};

export function Dashboard() {
  const [timeRange, setTimeRange] = React.useState("360d");
  const [data, setData] = React.useState(chartData);
  const [chartType, setChartType] = React.useState<"area" | "bar">("area");
  const [showChart, setShowChart] = React.useState(true);
  const [showTable, setShowTable] = React.useState(false);

  const handleAddExpense = (newExpense: Expense) => {
    setData((prevData) => {
      const updatedData = [...prevData, newExpense];

      // Trier les données par date
      return updatedData.sort((a, b) => {
        const dateA = new Date(a.date).getTime(); // Convertir en timestamp
        const dateB = new Date(b.date).getTime(); // Convertir en timestamp
        return dateA - dateB; // Comparer les timestamps
      });
    });
  };

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(); // Utiliser la date d'aujourd'hui

    let daysToSubtract = 360;
    if (timeRange === "180d") {
      daysToSubtract = 180;
    } else if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Carte pour la table et les graphiques */}
      <Card className="mx-auto max-w-6xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
          <div className="space-y-1">
            <CardTitle>Account Expenses</CardTitle>
            <CardDescription>
              {showTable
                ? "View and manage your expenses."
                : "Showing monthly expenses"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {/* Bouton Add New Expenses */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expenses
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new expense.
                  </DialogDescription>
                </DialogHeader>
                {/* Intégrer le formulaire ici */}
                <ExpensesForm onAddExpense={handleAddExpense} />
              </DialogContent>
            </Dialog>

            {/* Bouton Show Table */}
            <Button variant="outline" onClick={() => setShowTable(!showTable)}>
              {showTable ? (
                <BarChart2 className="h-4 w-4" />
              ) : (
                <Table className="h-4 w-4" />
              )}
              <span className="ml-2">
                {showTable ? "Show Charts" : "Show Table"}
              </span>
            </Button>

            {!showTable && (
              <>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Last 1 year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="360d">Last 1 year</SelectItem>
                    <SelectItem value="180d">Last 6 months</SelectItem>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() =>
                    setChartType(chartType === "area" ? "bar" : "area")
                  }
                >
                  Switch to {chartType === "area" ? "Bar Chart" : "Area Chart"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowChart(!showChart)}
                >
                  {showChart ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="ml-2">
                    {showChart ? "Hide Chart" : "Show Chart"}
                  </span>
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        {showTable ? (
          <CardContent className="p-4">
            <DataTable data={data} />
          </CardContent>
        ) : (
          showChart && (
            <CardContent className="p-4">
              <ChartContainer config={chartConfig}>
                {chartType === "area" ? (
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient
                        id="fillPerso"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                      <linearGradient
                        id="fillcommun"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                        return date.toLocaleDateString("fr", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        });
                      }}
                    />
                    <YAxis tickFormatter={(value) => `${value} €`} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("fr", {
                              year: "numeric",
                              month: "numeric",
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
                ) : (
                  <BarChart data={filteredData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("fr", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        });
                      }}
                    />
                    <YAxis tickFormatter={(value) => `${value} €`} />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="commun"
                      stackId="a"
                      fill="var(--color-commun)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="perso"
                      stackId="a"
                      fill="var(--color-perso)"
                      radius={[0, 0, 4, 4]}
                    />
                  </BarChart>
                )}
              </ChartContainer>
            </CardContent>
          )
        )}
        
      </Card>
    </div>
  );
}