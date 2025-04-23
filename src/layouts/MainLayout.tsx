
import React from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth";

  // Use a different layout for the auth page
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <main className="flex min-h-screen flex-col items-center justify-center">
          {children}
        </main>
        <Toaster />
      </div>
    );
  }

  // Regular layout with sidebar for other pages
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block md:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-x-hidden">
        <main className="container mx-auto py-6 px-4 md:px-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
