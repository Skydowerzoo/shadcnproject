"use client";

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash } from "lucide-react";
import { useState } from "react";

interface GroceryItem {
  name: string;
  category: string;
  checked: boolean;
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
  "Produits pour animaux"
];

export function GroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(categories[1]);
  const [filterCategory, setFilterCategory] = useState(categories[0]);

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

  const filteredItems = filterCategory === "Toutes"
    ? items
    : items.filter(item => item.category === filterCategory);

  return (
    <Card className="max-w-2xl m-auto p-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Grocery List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter product name"
            />
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setNewItemCategory} value={newItemCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddItem} className="mt-2">
              Add Item
            </Button>
            <Label htmlFor="filter">Filter by Category</Label>
            <Select onValueChange={setFilterCategory} value={filterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-500">No items in the list.</p>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="py-2 px-4 border-b">Check</TableHead>
                  <TableHead className="py-2 px-4 border-b">Product Name</TableHead>
                  <TableHead className="py-2 px-4 border-b">Category</TableHead>
                  <TableHead className="py-2 px-4 border-b">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-2 px-4 border-b">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => handleCheckItem(index)}
                      />
                    </TableCell>
                    <TableCell className="py-2 px-4 border-b">
                      <span className={item.checked ? "line-through" : ""}>
                        {item.name}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-4 border-b">{item.category}</TableCell>
                    <TableCell className="py-2 px-4 border-b text-center">
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}