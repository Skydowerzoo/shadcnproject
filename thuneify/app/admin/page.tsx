"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import axios from "axios";
import { LogIn, TrendingUp, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  useAuthRedirect();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:5000/api/admin/stats-advanced")
      .then((res) => setStats(res.data))
      .catch(() => setError("Erreur lors du chargement des stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <User className="inline mr-2" /> Utilisateurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{stats.users}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <LogIn className="inline mr-2" /> Connexions (30j)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{stats.logins30d}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <UserPlus className="inline mr-2" /> Inscriptions (30j)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{stats.signups30d}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <TrendingUp className="inline mr-2" /> Dernière inscription
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

            {/* Graphique d'évolution */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  Évolution des inscriptions et connexions (30 derniers jours)
                </CardTitle>
              </CardHeader>
              <CardContent style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.activityGraph}
                    margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="signups" fill="#6366f1" name="Inscriptions" />
                    <Bar dataKey="logins" fill="#10b981" name="Connexions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top utilisateurs actifs */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Top utilisateurs actifs (par connexions)</CardTitle>
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

            {/* Derniers inscrits */}
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
                          {new Date(u.created_at).toLocaleString("fr-FR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )
      )}
    </div>
  );
}
