import * as React from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  MessageSquare, 
  PlusCircle,
  Settings,
  Grid,
  Sparkles,
  CreditCard,
  Layout,
  Bell,
  Square,
  MousePointerClick
} from "lucide-react";

interface DevToolItem {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const devTools: DevToolItem[] = [
  {
    title: "Responsive Hooks",
    description: "Test responsive breakpoints and hooks",
    path: "/dev/responsive-test",
    icon: <Layout className="h-6 w-6" />,
  },
  {
    title: "Toast Notifications",
    description: "Test toast notification styles and behaviors",
    path: "/dev/toast-test",
    icon: <Bell className="h-6 w-6" />,
  },
  {
    title: "Card Components",
    description: "View all card component variants",
    path: "/dev/card-components",
    icon: <Square className="h-6 w-6" />,
  },
  {
    title: "Button Components",
    description: "View all button component variants",
    path: "/dev/button-components",
    icon: <MousePointerClick className="h-6 w-6" />,
  },
];

export function DevToolsMenu() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Development Tools</h1>
        <p className="text-muted-foreground">
          Testing and documentation tools for the codebase cleanup project
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devTools.map((tool) => (
          <Card key={tool.path} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  {tool.icon}
                </div>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button asChild className="w-full mt-2">
                <Link to={tool.path}>Open Tool</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-[200px]">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              More development tools will be added as the cleanup project progresses
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 