"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Filter,
  Loader2,
  PieChart,
  Plus,
  ShoppingCart,
  Trash,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface GroceryItem {
  id: number;
  name: string;
  category: string;
  checked: boolean;
  addedAt: Date;
}

const categories = [
  "Toutes",
  "Fruits",
  "Légumes",
  "Produits laitiers",
  "Viandes",
  "Surgelés",
  "appéritifs",
  "Conserves",
  "Boulangerie",
  "Petit-déjeuner",
  "Desserts",
  "Boissons",
  "Produits d'entretien",
  "Hygiène",
  "Produits pour animaux",
];

const API_URL = "http://localhost:5000/api";

export function GroceryList() {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(categories[1]);
  const [filterCategory, setFilterCategory] = useState(categories[0]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // Charger les articles au montage du composant si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchGroceryItems();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Calculer les statistiques par catégorie quand les items changent
  useEffect(() => {
    const stats = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category]++;
      return acc;
    }, {} as Record<string, number>);

    setCategoryStats(stats);
  }, [items]);

  // Récupérer les articles depuis l'API
  const fetchGroceryItems = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/grocery?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Convertir les dates et préparer les items
      const formattedItems = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        checked: item.checked,
        addedAt: new Date(item.added_at),
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
      toast.error("Impossible de charger votre liste de courses");
    } finally {
      setIsLoading(false);
    }
  };

  // Ajout item
  const handleAddItem = async () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter des articles");
      return;
    }

    if (newItemName.trim() && newItemCategory) {
      try {
        setIsSubmitting(true);
        const response = await axios.post(
          `${API_URL}/grocery`,
          {
            name: newItemName,
            category: newItemCategory,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const newItem = response.data;

        // Ajouter à la liste locale
        setItems((prev) => [
          {
            id: newItem.id,
            name: newItem.name,
            category: newItem.category,
            checked: newItem.checked,
            addedAt: new Date(newItem.added_at),
          },
          ...prev,
        ]);

        // Réinitialiser le formulaire
        setNewItemName("");
        setNewItemCategory(categories[1]);
        toast.success("Article ajouté avec succès");
      } catch (error) {
        console.error("Erreur lors de l'ajout d'un article:", error);
        toast.error("Impossible d'ajouter l'article");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Coche/décoche item
  const handleCheckItem = async (id: number) => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour modifier des articles");
      return;
    }

    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );

      // API call
      await axios.patch(
        `${API_URL}/grocery/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error);
      toast.error("Impossible de mettre à jour l'article");

      // Revert on error
      fetchGroceryItems();
    }
  };

  // Supprime item (modifié pour confirmation)
  const handleDeleteItem = useCallback(
    async (id: number) => {
      if (!isAuthenticated) {
        toast.error("Vous devez être connecté pour supprimer des articles");
        return;
      }
      try {
        setItems((prev) => prev.filter((item) => item.id !== id));
        await axios.delete(`${API_URL}/grocery/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Article supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article:", error);
        toast.error("Impossible de supprimer l'article");
        fetchGroceryItems();
      }
      setItemToDelete(null);
    },
    [isAuthenticated]
  );

  // Supprimer tous les éléments cochés
  const handleDeleteChecked = async () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour supprimer des articles");
      return;
    }

    try {
      const checkedIds = items
        .filter((item) => item.checked)
        .map((item) => item.id);

      if (checkedIds.length === 0) return;

      // Optimistic update
      setItems((prev) => prev.filter((item) => !item.checked));

      // Delete each checked item
      let deletedCount = 0;
      for (const id of checkedIds) {
        await axios.delete(`${API_URL}/grocery/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        deletedCount++;
      }

      toast.success(`${deletedCount} articles supprimés`);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression des articles cochés:",
        error
      );
      toast.error("Impossible de supprimer les articles cochés");

      // Revert on error
      fetchGroceryItems();
    }
  };

  // Filtrage
  const filteredItems =
    filterCategory === "Toutes"
      ? items
      : items.filter((item) => item.category === filterCategory);

  // Stats
  const totalItems = items.length;
  const completedItems = items.filter((item) => item.checked).length;
  const progressValue =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const remainingItems = totalItems - completedItems;

  // Si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Liste de courses</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre liste de courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Vous devez être connecté pour utiliser cette fonctionnalité.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Chargement de votre liste de courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne de gauche - Formulaire d'ajout */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="bg-secondary/10">
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un produit
              </CardTitle>
              <CardDescription>
                Complétez les informations pour ajouter à votre liste
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Pizza, Lait, etc."
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select
                  onValueChange={setNewItemCategory}
                  value={newItemCategory}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleAddItem}
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ajout en
                    cours...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter à la liste
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Colonne centrale et droite - Statistiques et liste */}
        <div className="md:col-span-2 space-y-6">
          {/* Carte de stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" /> Statistiques de votre
                liste
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-sm">
                    Total d'articles
                  </p>
                  <p className="text-3xl font-bold">{totalItems}</p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-sm">Complétés</p>
                  <p className="text-3xl font-bold text-green-500">
                    {completedItems}
                  </p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-sm">Restants</p>
                  <p className="text-3xl font-bold text-orange-500">
                    {remainingItems}
                  </p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-sm">Progression</p>
                  <p className="text-3xl font-bold">{progressValue}%</p>
                </div>
              </div>

              <Label>Progression globale</Label>
              <Progress value={progressValue} className="w-full h-2 mt-1" />

              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">
                  Répartition par catégorie:
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <Badge key={category} variant="outline" className="py-1">
                      {category}:{" "}
                      <span className="font-bold ml-1">{count}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtres et Liste d'articles */}
          <Card>
            <CardHeader className="bg-secondary/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Ma liste de courses
                </CardTitle>
                <CardDescription>
                  {remainingItems} articles restants à acheter
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  onValueChange={setFilterCategory}
                  value={filterCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteChecked}
                  disabled={completedItems === 0}
                >
                  <Trash className="h-4 w-4 mr-1" /> Supprimer cochés
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Tous ({totalItems})</TabsTrigger>
                  <TabsTrigger value="pending">
                    À acheter ({remainingItems})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Achetés ({completedItems})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <ListContent
                    items={filteredItems}
                    handleCheckItem={handleCheckItem}
                    handleDeleteItem={handleDeleteItem}
                    setItemToDelete={setItemToDelete}
                  />
                </TabsContent>

                <TabsContent value="pending">
                  <ListContent
                    items={filteredItems.filter((item) => !item.checked)}
                    handleCheckItem={handleCheckItem}
                    handleDeleteItem={handleDeleteItem}
                    setItemToDelete={setItemToDelete}
                  />
                </TabsContent>

                <TabsContent value="completed">
                  <ListContent
                    items={filteredItems.filter((item) => item.checked)}
                    handleCheckItem={handleCheckItem}
                    handleDeleteItem={handleDeleteItem}
                    setItemToDelete={setItemToDelete}
                  />
                </TabsContent>
              </Tabs>
              <div className="flex justify-between mt-4">
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Précédent
                </Button>
                <Button onClick={() => setPage(page + 1)}>Suivant</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cet article ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleDeleteItem(itemToDelete!)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Composant pour le contenu de la liste
function ListContent({
  items,
  handleCheckItem,
  handleDeleteItem,
  setItemToDelete,
}: {
  items: GroceryItem[];
  handleCheckItem: (id: number) => void;
  handleDeleteItem: (id: number) => void;
  setItemToDelete: (id: number) => void;
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">
          Aucun article à afficher dans cette liste.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">État</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="w-32">Date d'ajout</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className={`${item.checked ? "bg-muted/30" : ""} ${
                hoveredRow === item.id ? "bg-secondary/30" : ""
              }`}
              onMouseEnter={() => setHoveredRow(item.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => handleCheckItem(item.id)}
                  />
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={
                    item.checked
                      ? "line-through text-muted-foreground"
                      : "font-medium"
                  }
                >
                  {item.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.category}</Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {item.addedAt instanceof Date && !isNaN(item.addedAt)
                  ? format(item.addedAt, "d MMMM yyyy", { locale: fr })
                  : ""}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setItemToDelete(item.id)}
                  aria-label="Supprimer"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
