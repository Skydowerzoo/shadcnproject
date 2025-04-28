"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import axios from "axios";
import {
  BarChart2,
  ChevronDown,
  LogIn,
  TrendingUp,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminPage() {
  useAuthRedirect();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("stats");
  const [period, setPeriod] = useState<"30d" | "7d">("30d");

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    let url = "http://localhost:5000/api/admin/stats-advanced";
    if (period === "7d") url += "?days=7";
    axios
      .get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setStats(res.data))
      .catch(() =>
        setError("Erreur lors du chargement des stats (accès admin requis)")
      )
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BarChart2 className="h-6 w-6 text-primary" /> Dashboard Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <div className="flex flex-wrap gap-4 mb-6 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Période : {period === "7d" ? "7 jours" : "30 jours"}{" "}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setPeriod("7d")}>
                      7 derniers jours
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPeriod("30d")}>
                      30 derniers jours
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
              ) : (
                stats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <User className="inline mr-2" /> Utilisateurs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-3xl font-bold">
                          {stats.users}
                        </span>
                        <Progress
                          value={Math.min((stats.users / 100) * 100, 100)}
                          className="mt-2"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <LogIn className="inline mr-2" /> Connexions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-3xl font-bold">
                          {stats.logins30d}
                        </span>
                        <Progress
                          value={Math.min((stats.logins30d / 100) * 100, 100)}
                          className="mt-2 bg-emerald-500"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <UserPlus className="inline mr-2" /> Inscriptions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-3xl font-bold">
                          {stats.signups30d}
                        </span>
                        <Progress
                          value={Math.min((stats.signups30d / 100) * 100, 100)}
                          className="mt-2 bg-indigo-500"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <TrendingUp className="inline mr-2" /> Dernière
                          inscription
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-md font-semibold">
                          {stats.lastSignup
                            ? new Date(stats.lastSignup).toLocaleString("fr-FR")
                            : "—"}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                )
              )}
            </TabsContent>
            <TabsContent value="users">
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
              ) : (
                stats && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Top utilisateurs actifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Connexions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.topUsers.map((u: any) => (
                            <TableRow key={u.id}>
                              <TableCell>
                                {u.firstname} {u.lastname}
                              </TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell>{u.login_count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )
              )}
              {loading
                ? null
                : stats && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Derniers inscrits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Date d'inscription</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stats.lastUsers.map((u: any) => (
                              <TableRow key={u.id}>
                                <TableCell>
                                  {u.firstname} {u.lastname}
                                </TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                  {new Date(u.created_at).toLocaleString(
                                    "fr-FR"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
            </TabsContent>
            <TabsContent value="activity">
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
              ) : (
                stats && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Activité (30 derniers jours)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Inscriptions</TableHead>
                            <TableHead>Connexions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.activityGraph.map((row: any) => (
                            <TableRow key={row.date}>
                              <TableCell>{row.date}</TableCell>
                              <TableCell>{row.signups}</TableCell>
                              <TableCell>{row.logins}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
