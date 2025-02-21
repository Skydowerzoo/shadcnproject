"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CardWithForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Connect to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full gap-4">
            {/* Champ Email */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mail">Email</Label>
              <Input id="mail" type="email" placeholder="m@example.com" />
            </div>

            {/* Champ Mot de Passe avec Toggle Visibility */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button className="w-full sm:w-auto">Login</Button>
      </CardFooter>
    </Card>
  );
}