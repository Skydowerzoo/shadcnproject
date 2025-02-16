import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { ThemeToggle } from "../components/theme-toggle";
import { ThemeProvider } from "../components/theme-provider";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acme Inc.",
  description: "Welcome to Acme Inc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex h-screen">
              <Sidebar className="border-r border-border">
                <SidebarHeader className="border-b px-4 py-4 h-16">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    THUNEIFY
                  </h1>
                </SidebarHeader>
                <SidebarContent>
                  <nav className="space-y-2 px-2 py-4">
                    <Link
                      href="#"
                      className="block px-2 py-1 hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Épargne
                    </Link>
                    <Link
                      href="#"
                      className="block px-2 py-1 hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Dépenses
                    </Link>
                    <Link
                      href="#"
                      className="block px-2 py-1 hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Liste Manga
                    </Link>
                    <Link
                      href="#"
                      className="block px-2 py-1 hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Liste de courses
                    </Link>
                    <Link
                      href="#"
                      className="block px-2 py-1 hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Compte
                    </Link>
                  </nav>
                </SidebarContent>
                <SidebarFooter className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      © 2025 Thuneify
                    </p>
                    <ThemeToggle />
                  </div>
                </SidebarFooter>
              </Sidebar>
              <SidebarInset className="flex flex-col h-16 ">
                <header className="flex items-center p-4 ">
                  <SidebarTrigger />
                </header>
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
