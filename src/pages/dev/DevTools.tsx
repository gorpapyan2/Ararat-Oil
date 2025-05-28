import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Code, Database, Bell, Layout, Layers, PanelTop } from "lucide-react";

export default function DevTools() {
  const devPages = [
    {
      name: "Connection Info",
      path: "/dev/connection-info",
      icon: <Database className="h-5 w-5" />,
      description:
        "Check Supabase connection status and manage data synchronization",
    },
    {
      name: "Toast Tester",
      path: "/dev/toast-test",
      icon: <Bell className="h-5 w-5" />,
      description: "Test different toast notification styles and behaviors",
    },
    {
      name: "Responsive Test",
      path: "/dev/responsive-test",
      icon: <Layout className="h-5 w-5" />,
      description: "Test responsive layouts and breakpoints",
    },
    {
      name: "Card Components",
      path: "/dev/card-components",
      icon: <Layers className="h-5 w-5" />,
      description: "Explore different card component variations",
    },
    {
      name: "Button Components",
      path: "/dev/button-components",
      icon: <PanelTop className="h-5 w-5" />,
      description: "Explore button component variations and styles",
    },
    {
      name: "Hooks Showcase",
      path: "/dev/hooks-showcase",
      icon: <Code className="h-5 w-5" />,
      description:
        "Demonstration of our refactored hooks architecture with examples",
    },
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Developer Tools</h1>
        <p className="text-muted-foreground">
          Tools and utilities for development and testing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devPages.map((page) => (
          <Card key={page.path} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {page.icon}
                <CardTitle>{page.name}</CardTitle>
              </div>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={page.path}>
                <Button variant="default" className="w-full">
                  Open {page.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
