"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { 
  Trash, 
  ShoppingCart, 
  Filter, 
  PieChart, 
  Plus, 
  ChevronRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GroceryItem {
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
  "Desserts",
  "Boissons",
  "Produits d'entretien",
  "Hygiène",
  "Produits pour animaux",
];

export function GroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(categories[1]);
  const [filterCategory, setFilterCategory] = useState(categories[0]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // Calculer les statistiques par catégorie
    const stats = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category]++;
      return acc;
    }, {} as Record<string, number>);
    
    setCategoryStats(stats);
  }, [items]);

  // Ajout item
  const handleAddItem = () => {
    if (newItemName.trim() && newItemCategory) {
      setItems((prev) => [
        ...prev,
        { 
          name: newItemName, 
          category: newItemCategory, 
          checked: false,
          addedAt: new Date()
        },
      ]);
      setNewItemName("");
      setNewItemCategory(categories[1]);
    }
  };

  // Coche/décoche item
  const handleCheckItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Supprime item
  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Supprimer tous les éléments cochés
  const handleDeleteChecked = () => {
    setItems((prev) => prev.filter(item => !item.checked));
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
                />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select onValueChange={setNewItemCategory} value={newItemCategory}>
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
              <Button onClick={handleAddItem} className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter à la liste
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
                <PieChart className="mr-2 h-5 w-5" /> Statistiques de votre liste
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-sm">Total d'articles</p>
                  <p className="text-3xl font-bold">{totalItems}</p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-sm">Complétés</p>
                  <p className="text-3xl font-bold text-green-500">{completedItems}</p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-sm">Restants</p>
                  <p className="text-3xl font-bold text-orange-500">{remainingItems}</p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-sm">Progression</p>
                  <p className="text-3xl font-bold">{progressValue}%</p>
                </div>
              </div>

              <Label>Progression globale</Label>
              <Progress value={progressValue} className="w-full h-2 mt-1" />
              
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Répartition par catégorie:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <Badge key={category} variant="outline" className="py-1">
                      {category}: <span className="font-bold ml-1">{count}</span>
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
                <Select onValueChange={setFilterCategory} value={filterCategory}>
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
                
                <Button variant="destructive" size="sm" onClick={handleDeleteChecked} disabled={completedItems === 0}>
                  <Trash className="h-4 w-4 mr-1" /> Supprimer cochés
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Tous ({totalItems})</TabsTrigger>
                  <TabsTrigger value="pending">À acheter ({remainingItems})</TabsTrigger>
                  <TabsTrigger value="completed">Achetés ({completedItems})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ListContent 
                    items={filteredItems} 
                    handleCheckItem={handleCheckItem} 
                    handleDeleteItem={handleDeleteItem} 
                  />
                </TabsContent>
                
                <TabsContent value="pending">
                  <ListContent 
                    items={filteredItems.filter(item => !item.checked)}
                    handleCheckItem={handleCheckItem} 
                    handleDeleteItem={handleDeleteItem} 
                  />
                </TabsContent>
                
                <TabsContent value="completed">
                  <ListContent 
                    items={filteredItems.filter(item => item.checked)}
                    handleCheckItem={handleCheckItem} 
                    handleDeleteItem={handleDeleteItem} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Composant pour le contenu de la liste
function ListContent({ 
  items, 
  handleCheckItem, 
  handleDeleteItem 
}: { 
  items: GroceryItem[], 
  handleCheckItem: (index: number) => void, 
  handleDeleteItem: (index: number) => void 
}) {
  if (items.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">Aucun article à afficher dans cette liste.</p>
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
          {items.map((item, index) => (
            <TableRow key={index} className={item.checked ? "bg-muted/30" : ""}>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => handleCheckItem(index)}
                  />
                </div>
              </TableCell>
              <TableCell>
                <span className={item.checked ? "line-through text-muted-foreground" : "font-medium"}>
                  {item.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.category}</Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {item.addedAt?.toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(index)}
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