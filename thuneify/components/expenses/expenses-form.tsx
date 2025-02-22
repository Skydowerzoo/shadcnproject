import * as React from "react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function ExpensesForm({ onAddExpense }) {
  const [date, setDate] = useState("");
  const [perso, setPerso] = useState("");
  const [commun, setCommun] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      date,
      perso: parseFloat(perso),
      commun: parseFloat(commun),
    };
    onAddExpense(newExpense);
    setDate("");
    setPerso("");
    setCommun("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Add New Expenses</h1>
      </div>

      {/* Champ date */}
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-auto"
        />
      </div>

      {/* Champ Montent pour compte perso */}
      <div>
        <Label htmlFor="perso">Personal Account</Label>
        <Input
          type="number"
          id="perso"
          value={perso}
          onChange={(e) => setPerso(e.target.value)}
          required
          className="w-full"
        />
      </div>

      {/* Champ Montent pour compte commun */}
      <div>
        <Label htmlFor="commun">Global Account</Label>
        <Input
          type="number"
          id="commun"
          value={commun}
          onChange={(e) => setCommun(e.target.value)}
          required
          className="w-full"
        />
      </div>

      {/* Bouton de soumission */}
      <div>
        <Button type="submit" className="w-full">
          Add New Information
        </Button>
      </div>
    </form>
  );
}