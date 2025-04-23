"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import {
  BarChart,
  BookOpen,
  DollarSign,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from "recharts";

type Expense = {
  date: string;
  perso: number;
  commun: number;
};

const chartConfig = {
  perso: {
    label: "Personnel",
    color: "hsl(var(--chart-1))",
  },
  commun: {
    label: "Commun",
    color: "hsl(var(--chart-2))",
  },
} as const;

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [expensesData, setExpensesData] = useState<
    { name: string; total: number; perso: number; commun: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, mounted]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      const fetchExpenses = async () => {
        try {
          const response = await axios.get<Expense[]>(
            "http://localhost:5000/api/expenses"
          );
          setExpensesData(transformExpensesData(response.data));
        } catch (error) {
          console.error("Erreur lors de la récupération des dépenses:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchExpenses();
    }
  }, [mounted, isAuthenticated]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  function transformExpensesData(data: Expense[]) {
    const monthlyData = data.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const month = date.toLocaleString("fr-FR", { month: "long" });

      if (!acc[month]) {
        acc[month] = { name: month, total: 0, perso: 0, commun: 0 };
      }
      acc[month].perso += Number(expense.perso || 0);
      acc[month].commun += Number(expense.commun || 0);
      acc[month].total = acc[month].perso + acc[month].commun;

      return acc;
    }, {} as Record<string, { name: string; total: number; perso: number; commun: number }>);

    return Object.values(monthlyData);
  }

  function calculateStats() {
    if (expensesData.length === 0) return { total: 0, moyenne: 0, max: 0 };
    const currentMonth = new Date().toLocaleString("fr-FR", { month: "short" });
    const totalMois =
      expensesData.find((d) => d.name === currentMonth)?.total || 0;
    const moyenne =
      expensesData.reduce((acc, curr) => acc + curr.total, 0) /
      expensesData.length;
    const max = Math.max(...expensesData.map((d) => d.total));

    return {
      total: Math.round(totalMois),
      moyenne: Math.round(moyenne),
      max: Math.round(max),
    };
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-4">
        {/* Message de bienvenue */}
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Bienvenue,{" "}
          <span className="text-primary">
            {user ? user.firstname : "Invité"}
          </span>{" "}
          !
        </h1>
        <p className="mb-8 text-muted-foreground text-lg">
          Gérez vos tâches et vos finances en toute simplicité.
        </p>

        {/* Stats clés */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="flex flex-col items-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-0 shadow-md">
            <DollarSign className="h-7 w-7 text-primary mb-1" />
            <span className="font-bold text-primary">Total du mois</span>
            <span className="text-xl font-semibold">{stats.total} €</span>
          </Card>
          <Card className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-200/40 to-blue-100/10 border-0 shadow-md">
            <BarChart className="h-7 w-7 text-blue-600 mb-1" />
            <span className="font-bold text-blue-700">Moyenne mensuelle</span>
            <span className="text-xl font-semibold">{stats.moyenne} €</span>
          </Card>
          <Card className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-200/40 to-orange-100/10 border-0 shadow-md">
            <ShoppingCart className="h-7 w-7 text-orange-500 mb-1" />
            <span className="font-bold text-orange-600">Max dépense</span>
            <span className="text-xl font-semibold">{stats.max} €</span>
          </Card>
          <Card className="flex flex-col items-center p-4 bg-gradient-to-br from-green-200/40 to-green-100/10 border-0 shadow-md">
            <User className="h-7 w-7 text-green-600 mb-1" />
            <span className="font-bold text-green-700">État du compte</span>
            <span className="text-xl font-semibold">
              {user ? "Actif" : "Invité"}
            </span>
          </Card>
        </div>

        {/* Actions rapides */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Link href="/grocery">
              <Button className="w-full flex flex-col items-center p-4 h-28">
                <ShoppingCart className="h-7 w-7 mb-1" />
                <span>Liste de courses</span>
              </Button>
            </Link>
            <Link href="/expenses">
              <Button className="w-full flex flex-col items-center p-4 h-28">
                <DollarSign className="h-7 w-7 mb-1" />
                <span>Dépenses</span>
              </Button>
            </Link>
            <Link href="/account">
              <Button className="w-full flex flex-col items-center p-4 h-28">
                <User className="h-7 w-7 mb-1" />
                <span>Compte</span>
              </Button>
            </Link>
            <Link href="/manga">
              <Button className="w-full flex flex-col items-center p-4 h-28">
                <BookOpen className="h-7 w-7 mb-1" />
                <span>Manga</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* Aperçu dépenses + résumé existants */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Aperçu des Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[350px]">
                  Chargement...
                </div>
              ) : (
                <ChartContainer config={chartConfig}>
                  <RechartsBarChart
                    width={564}
                    height={317}
                    data={expensesData}
                  >
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
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillCommun"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value} €`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Personnel
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0]?.value}€
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Commun
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[1]?.value}€
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="commun"
                      stackId="a"
                      fill="url(#fillCommun)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="perso"
                      stackId="a"
                      fill="url(#fillPerso)"
                      radius={[0, 0, 4, 4]}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </RechartsBarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total du mois</span>
                  <span className="font-bold">{stats.total} €</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Moyenne mensuelle</span>
                  <span className="font-bold">{stats.moyenne} €</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Plus grosse dépense
                  </span>
                  <span className="font-bold">{stats.max} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objectifs financiers modernisés */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Vos objectifs financiers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Suivez votre progression vers vos objectifs d'épargne.
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Vacances d'été</span>
                    <span>1200€ / 2000€</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-700"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    60% atteint
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Nouvel ordinateur</span>
                    <span>750€ / 1500€</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-700"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    50% atteint
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Fond d'urgence</span>
                    <span>3500€ / 5000€</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-700"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    70% atteint
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="default" size="sm" className="shadow">
                  <span className="mr-2">+</span> Ajouter un objectif
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
