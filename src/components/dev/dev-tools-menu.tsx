import { 
  Beaker, 
  Box, 
  Clipboard, 
  Code, 
  FileDown, 
  Grid3X3, 
  HandCoins, 
  LayoutDashboard, 
  Settings, 
  Split, 
  User, 
  Users 
} from "lucide-react";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DevToolsMenu() {
  const router = useRouter();

  const menuItems = [
    {
      label: "Component Library",
      description: "Browse and test UI components",
      href: "/dev/components",
      icon: <Grid3X3 className="h-4 w-4" />,
    },
    {
      label: "Form Components",
      description: "Standardized form components showcase",
      href: "/form-showcase",
      icon: <Clipboard className="h-4 w-4" />,
    },
    {
      label: "Table Examples",
      description: "Standardized table implementations",
      href: "/dev/tables",
      icon: <Split className="h-4 w-4" />,
    },
    {
      label: "Dashboard Patterns",
      description: "Common dashboard layouts and cards",
      href: "/dev/dashboards",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "User Flows",
      description: "Authentication and user account examples",
      href: "/dev/user-flows",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Expense Patterns",
      description: "Expense management examples",
      href: "/dev/expenses",
      icon: <HandCoins className="h-4 w-4" />,
    },
    {
      label: "API Integration",
      description: "Examples of API usage patterns",
      href: "/dev/api-examples",
      icon: <Code className="h-4 w-4" />,
    },
    {
      label: "Export Tools",
      description: "Data export functionality examples",
      href: "/dev/export-tools",
      icon: <FileDown className="h-4 w-4" />,
    },
    {
      label: "Settings Patterns",
      description: "User settings page patterns",
      href: "/dev/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      label: "Experimental Features",
      description: "Try new experimental features",
      href: "/dev/experimental",
      icon: <Beaker className="h-4 w-4" />,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Developer Tools</h1>
        <p className="text-muted-foreground">
          Use these tools to explore and test components and patterns in the application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menuItems.map((item, index) => (
          <Card key={index} className="hover:bg-accent/5 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                {item.icon}
                {item.label}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(item.href)}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 