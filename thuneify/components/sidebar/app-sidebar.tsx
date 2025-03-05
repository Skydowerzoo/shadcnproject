"use client";

import {
  BadgeDollarSign,
  BookOpen,
  Home,
  LogIn,
  LogOut,
  Moon,
  ShoppingBasket,
  Sun,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "next-themes";
import Link from "next/link";

// Menu items.
const baseItems = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: BadgeDollarSign,
  },
  {
    title: "Grocery",
    path: "/grocery",
    icon: ShoppingBasket,
  },
  {
    title: "Manga",
    path: "/manga",
    icon: BookOpen,
  },
  {
    title: "Account",
    path: "/account",
    icon: User,
  },
];

export function AppSidebar() {
  const { setTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  const items = [
    ...baseItems,
    ...(isAuthenticated
      ? [
          {
            title: "Logout",
            path: "#",
            icon: LogOut,
            onClick: logout,
          },
        ]
      : [
          {
            title: "Login",
            path: "/login",
            icon: LogIn,
          },
        ]),
  ];

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
                  <SidebarMenuButton asChild>
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        className="flex items-center w-full"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <a href={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t py-4">
        <div className="flex flex-col items-center space-y-6 px-3">
          {/* Utilisateur ou login */}
          {isAuthenticated && user ? (
            <div className="flex flex-col w-full items-center space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-2 h-auto px-3 py-1.5"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar || ""}
                        alt={user.firstname}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.firstname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{user.firstname}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {user.email}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Connexion</span>
              </Link>
            </Button>
          )}

          <Separator />

          {/* Thème et copyright */}
          <div className="flex flex-col items-center gap-4 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Changer le thème</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem
                        onClick={() => setTheme("light")}
                        className="flex gap-2"
                      >
                        <Sun className="h-4 w-4" />
                        <span>Clair</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTheme("dark")}
                        className="flex gap-2"
                      >
                        <Moon className="h-4 w-4" />
                        <span>Sombre</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTheme("pink")}
                        className="flex gap-2"
                      >
                        <div className="h-4 w-4 rounded-full bg-pink-400" />
                        <span>Rose</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTheme("system")}
                        className="flex gap-2"
                      >
                        <div className="h-4 w-4 flex">
                          <Sun className="h-4 w-4 rotate-0 scale-100" />
                          <Moon className="h-4 w-4 ml-[-16px] rotate-90 scale-75 opacity-50" />
                        </div>
                        <span>Système</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Changer de thème</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-xs text-muted-foreground">
              © 2025 Thuneify
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
