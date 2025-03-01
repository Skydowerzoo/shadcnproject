"use client";

import {
  BadgeDollarSign,
  BookOpen,
  Home,
  Moon,
  ShoppingBasket,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";

import { CardWithForm } from "@/components/login/card-login"; // Assurez-vous que le chemin est correct
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: BadgeDollarSign,
  },
  {
    title: "Grocery",
    url: "/grocery",
    icon: ShoppingBasket,
  },
  {
    title: "Manga",
    url: "/manga",
    icon: BookOpen,
  },
  {
    title: "Account",
    url: "/account",
    icon: User,
  },
  {
    title: "login",
    url: "#",
    icon: User,
  },
];

export function AppSidebar() {
  const { setTheme } = useTheme();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleLoginClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Login button clicked");
    setIsLoginDialogOpen(true);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4 h-16">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          THUNEIFY
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "login" ? (
                    <Dialog
                      open={isLoginDialogOpen}
                      onOpenChange={setIsLoginDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <SidebarMenuButton asChild>
                          <a href={item.url} onClick={handleLoginClick}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle></DialogTitle>
                        {CardWithForm()} {/* Appel de la fonction ici */}
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between items-center">
          <span>© 2025 Thuneify</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
