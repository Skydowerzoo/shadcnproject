"use client";

import {
  BadgeDollarSign,
  BookOpen,
  Home,
  Moon,
  ShoppingBasket,
  Sun,
  User,
  LogIn,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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
import { useAuth } from "@/context/auth-context";

// Menu items.
const baseItems = [
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
            url: "#",
            icon: LogOut,
            onClick: logout,
          },
        ]
      : [
          {
            title: "Login",
            url: "/login",
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
                      <a href={item.url}>
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