import { Link, useLocation } from "react-router-dom";
import { BarChart, DollarSign, Users, FileText, Gauge, Power, Archive, Truck, Package, ReceiptIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: BarChart, label: "Dashboard", path: "/" },
  { icon: Archive, label: "Inventory", path: "/inventory" },
  { icon: Power, label: "Filling Systems", path: "/filling-systems" },
  { icon: Package, label: "Fuel Supplies", path: "/fuel-supplies" },
  { icon: Truck, label: "Providers", path: "/providers" },
  { icon: DollarSign, label: "Sales", path: "/sales" },
  { icon: FileText, label: "Expenses", path: "/expenses" },
  { icon: Users, label: "Employees", path: "/employees" },
  { icon: ReceiptIcon, label: "Transactions", path: "/transactions" },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="w-64 min-h-screen bg-sidebar p-4 border-r">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Ararat Oil</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
            
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "font-medium"
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
    </div>
  );
}
