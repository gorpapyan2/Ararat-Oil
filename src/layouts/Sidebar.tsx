
import { Link } from "react-router-dom";
import { BarChart, Fuel, DollarSign, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: BarChart, label: "Dashboard", path: "/" },
  { icon: Fuel, label: "Inventory", path: "/inventory" },
  { icon: DollarSign, label: "Sales", path: "/sales" },
  { icon: FileText, label: "Expenses", path: "/expenses" },
  { icon: Users, label: "Employees", path: "/employees" },
];

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-sidebar p-4 border-r">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Ararat Oil</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link to={item.path}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}
