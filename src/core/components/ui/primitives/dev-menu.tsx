
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/primitives/dropdown-menu";
import { 
  Code, 
  Database, 
  RefreshCw, 
  Layers, 
  PanelTop, 
  Layout, 
  Bell
} from 'lucide-react';

export function DevMenu() {
  const devPages = [
    { name: 'Dev Tools Home', path: '/dev', icon: <Code className="h-4 w-4 mr-2" /> },
    { name: 'Connection Info', path: '/dev/connection-info', icon: <Database className="h-4 w-4 mr-2" /> },
    { name: 'Toast Tester', path: '/dev/toast-test', icon: <Bell className="h-4 w-4 mr-2" /> },
    { name: 'Responsive Test', path: '/dev/responsive-test', icon: <Layout className="h-4 w-4 mr-2" /> },
    { name: 'Card Components', path: '/dev/card-components', icon: <Layers className="h-4 w-4 mr-2" /> },
    { name: 'Button Components', path: '/dev/button-components', icon: <PanelTop className="h-4 w-4 mr-2" /> },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Code className="h-4 w-4 mr-2" />
          Dev Tools
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Developer Pages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {devPages.map((page) => (
          <DropdownMenuItem key={page.path} asChild>
            <Link to={page.path} className="flex items-center">
              {page.icon}
              {page.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 
