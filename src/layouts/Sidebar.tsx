import { Link, useLocation } from "react-router-dom";
import { BarChart, DollarSign, Users, FileText, Gauge, Power, Archive, Truck, Package, ReceiptIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: BarChart, label: "Dashboard", path: "/dashboard" },
  { icon: Archive, label: "Inventory", path: "/inventory" },
  { icon: Power, label: "Filling Systems", path: "/filling-systems" },
  { icon: Package, label: "Fuel Supplies", path: "/fuel-supplies" },
  { icon: Truck, label: "Providers", path: "/petrol-providers" },
  { icon: DollarSign, label: "Sales", path: "/sales" },
  { icon: FileText, label: "Expenses", path: "/expenses" },
  { icon: Users, label: "Employees", path: "/employees" },
  { icon: ReceiptIcon, label: "Transactions", path: "/transactions" },
];

import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/ui/UserMenu";

export function Sidebar() {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="w-64 min-h-screen bg-brand-gradient-light dark:bg-brand-gradient-dark text-foreground p-4 border-r border-brand-dark/10 dark:border-brand-dark/30 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-white">Ararat Oil</h1>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
            
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start hover:bg-accent/10 dark:hover:bg-white/10 text-foreground dark:text-white/90",
                isActive && "font-medium bg-accent-gradient-light dark:bg-accent-gradient-dark text-accent dark:text-white backdrop-blur-sm"
              )}
              asChild
            >
              <Link to={item.path}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="mt-8">
        <UserMenu />
      </div>
    </div>
  );
}
