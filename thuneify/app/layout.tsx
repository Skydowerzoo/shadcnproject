import { Inter } from "next/font/google";
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import "./globals.css";
import { AuthProvider } from "../context/auth-context";

const inter = Inter({ subsets: ["latin"] });

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
          <AuthProvider>

              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 border-none px-4">
                    <SidebarTrigger className="-ml-1" />
                  </header>
                  <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
                </SidebarInset>
              </SidebarProvider>

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

