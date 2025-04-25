import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Fuel,
  Truck,
  Building2,
  Users,
  FileText,
  CircleDollarSign,
  LogOut,
} from "lucide-react";
import { NavItem } from "@/components/ui/nav-item";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sales", label: "Sales", icon: Receipt },
  { to: "/inventory", label: "Inventory", icon: BarChart3 },
  { to: "/filling-systems", label: "Filling Systems", icon: Fuel },
  { to: "/fuel-supplies", label: "Fuel Supplies", icon: Truck },
  { to: "/providers", label: "Petrol Providers", icon: Building2 },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/expenses", label: "Expenses", icon: FileText },
  { to: "/transactions", label: "Transactions", icon: CircleDollarSign },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  if (pathname.startsWith("/auth")) return null;

  return (
    <aside className="flex flex-col h-full bg-gradient-to-b from-background via-background/95 to-background/90 border-r border-border/10 backdrop-blur-sm">
      {/* Brand */}
      <div className="px-6 py-8">
        <h1 className="font-bold text-2xl tracking-tight">
          <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/80">
            Fuel
          </span>
          <span className="text-foreground">Station</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-1.5 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavItem
            key={to}
            to={to}
            label={label}
            icon={<Icon size={20} />}
            active={pathname === to}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-border/10 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()} © FuelStation
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
