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
    <form onSubmit={handleSubmit}>
        <div className="mt-4">
            <h1>Add new Expenses</h1>
        </div>
      {/* Champ date */}
      <div className=" mt-4 w-full">
        <Label htmlFor="date">Date</Label>
        <Input
        className="w-2/3"
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Champ Montent pour compte perso */}
      <div className="mt-4">
        <Label htmlFor="perso">Personal account</Label>
        <div className="relative">
          <Input
            type="number"
            id="perso"
            value={perso}
            onChange={(e) => setPerso(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Champ Montent pour compte perso */}
      <div className="mt-4">
        <Label htmlFor="global" >Global account</Label>
        <div className="relative">
          <Input
            type="number"
            id="perso"
            value={commun}
            onChange={(e) => setCommun(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <Button className="w-full h-auto place-self-center mt-4 mb-4" >
            Add new informations
        </Button>
      </div>
    </form>
  );
}
