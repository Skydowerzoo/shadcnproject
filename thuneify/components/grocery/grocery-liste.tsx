"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Apple,
  Beef,
  CakeSlice,
  Carrot,
  Cat,
  CheckCircle2,
  Coffee,
  FilterX,
  PlusCircle,
  ShoppingBag,
  ShoppingCart,
  Smile,
  Droplets,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";

interface GroceryItem {
  name: string;
  category: string;
  checked: boolean;
}

const categories = [
  "Toutes",
  "Fruits",
  "Légumes",
  "plat préparé",
  "Produits laitiers",
  "Viandes",
  "Desserts",
  "Boissons",
  "Produits d'entretien",
  "Hygiène",
  "Produits pour animaux",
];

// Mapping d'icônes pour chaque catégorie
const categoryIcons: Record<string, React.ReactNode> = {
  Fruits: <Apple className="h-4 w-4" />,
  Légumes: <Carrot className="h-4 w-4" />,
  "Produits laitiers": <ShoppingBag className="h-4 w-4" />,
  Viandes: <Beef className="h-4 w-4" />,
  Desserts: <CakeSlice className="h-4 w-4" />,
  Boissons: <Coffee className="h-4 w-4" />,
  "Produits d'entretien": <Droplets className="h-4 w-4" />,
  Hygiène: <Smile className="h-4 w-4" />,
  "Produits pour animaux": <Cat className="h-4 w-4" />,
  Toutes: <FilterX className="h-4 w-4" />,
};

export function GroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(categories[1]);
  const [filterCategory, setFilterCategory] = useState(categories[0]);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Charger les données stockées lors du chargement initial
  useEffect(() => {
    const savedItems = localStorage.getItem("groceryItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Sauvegarder les données lorsqu'elles changent
  useEffect(() => {
    localStorage.setItem("groceryItems", JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    if (newItemName && newItemCategory) {
      setItems([
        ...items,
        { name: newItemName, category: newItemCategory, checked: false },
      ]);
      setNewItemName("");
      setNewItemCategory(categories[1]);
    }
  };

  const handleCheckItem = (index: number) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newItemName) {
      handleAddItem();
    }
  };

  const getFilteredItems = () => {
    // Filtrer par catégorie si nécessaire
    let filtered =
      filterCategory === "Toutes"
        ? items
        : items.filter((item) => item.category === filterCategory);

    // Ensuite filtrer par onglet actif
    if (activeTab === "active") {
      filtered = filtered.filter((item) => !item.checked);
    } else if (activeTab === "completed") {
      filtered = filtered.filter((item) => item.checked);
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();
  const totalItems = items.length;
  const completedItems = items.filter((item) => item.checked).length;
  const activeItems = totalItems - completedItems;

  // Fonction pour effacer les éléments complétés
  const clearCompletedItems = () => {
    setItems(items.filter((item) => !item.checked));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panneau de gauche: Formulaire d'ajout */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Ajouter un produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: Tomates"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  onValueChange={setNewItemCategory}
                  value={newItemCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          {categoryIcons[category]}
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAddItem}
                className="w-full"
                disabled={!newItemName || !newItemCategory}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter
              </Button>

              <div className="pt-6 space-y-2">
                <Label htmlFor="filter">Filtrer par catégorie</Label>
                <Select
                  onValueChange={setFilterCategory}
                  value={filterCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          {categoryIcons[category]}
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Produits</span>
                  <Badge variant="outline">{totalItems}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">À acheter</span>
                  <Badge variant="outline" className="bg-primary/10">
                    {activeItems}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Achetés</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900/30"
                  >
                    {completedItems}
                  </Badge>
                </div>
                {completedItems > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={clearCompletedItems}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer les produits achetés
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panneau de droite: Liste des produits */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6" />
                Liste de courses
              </span>
              <Badge variant="outline">
                {filterCategory === "Toutes"
                  ? "Toutes catégories"
                  : filterCategory}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all" className="flex gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">Tous</span>
                  <Badge variant="outline" className="ml-1">
                    {totalItems}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="active" className="flex gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">À acheter</span>
                  <Badge variant="outline" className="ml-1">
                    {activeItems}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Achetés</span>
                  <Badge variant="outline" className="ml-1">
                    {completedItems}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {renderItemsList(filteredItems)}
              </TabsContent>
              <TabsContent value="active" className="mt-0">
                {renderItemsList(filteredItems)}
              </TabsContent>
              <TabsContent value="completed" className="mt-0">
                {renderItemsList(filteredItems)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function renderItemsList(items: GroceryItem[]) {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">
            Aucun produit dans la liste
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeTab === "completed"
              ? "Vous n'avez pas encore acheté de produits."
              : activeTab === "active"
              ? "Tous vos produits sont achetés !"
              : "Ajoutez votre premier produit en utilisant le formulaire."}
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">État</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="hidden md:table-cell">Catégorie</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={index}
                className={item.checked ? "bg-muted/30" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => handleCheckItem(index)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:text-primary-foreground"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {categoryIcons[item.category]}
                    <span
                      className={`ml-2 ${
                        item.checked
                          ? "line-through text-muted-foreground"
                          : "font-medium"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="font-normal">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
}
