
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
  LogOut
} from "lucide-react";
import { NavItem } from "@/components/ui/nav-item"
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  
  if (pathname === '/auth') {
    return null;
  }
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background/95 to-background/90 border-r border-border/10 backdrop-blur-sm">
      <div className="px-6 py-8">
        <h1 className="font-bold text-2xl tracking-tight">
          <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/80">Fuel</span>
          <span className="text-foreground">Station</span>
        </h1>
      </div>
      
      <div className="space-y-1.5 px-3">
        <NavItem 
          to="/" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={pathname === '/'} 
        />
        <NavItem 
          to="/sales" 
          icon={<Receipt size={20} />} 
          label="Sales" 
          active={pathname === '/sales'} 
        />
        <NavItem 
          to="/inventory" 
          icon={<BarChart3 size={20} />} 
          label="Inventory" 
          active={pathname === '/inventory'} 
        />
        <NavItem 
          to="/filling-systems" 
          icon={<Fuel size={20} />} 
          label="Filling Systems" 
          active={pathname === '/filling-systems'} 
        />
        <NavItem 
          to="/fuel-supplies" 
          icon={<Truck size={20} />} 
          label="Fuel Supplies" 
          active={pathname === '/fuel-supplies'} 
        />
        <NavItem 
          to="/providers" 
          icon={<Building2 size={20} />} 
          label="Petrol Providers" 
          active={pathname === '/providers'} 
        />
        <NavItem 
          to="/employees" 
          icon={<Users size={20} />} 
          label="Employees" 
          active={pathname === '/employees'} 
        />
        <NavItem 
          to="/expenses" 
          icon={<FileText size={20} />} 
          label="Expenses" 
          active={pathname === '/expenses'} 
        />
        <NavItem 
          to="/transactions" 
          icon={<CircleDollarSign size={20} />} 
          label="Transactions" 
          active={pathname === '/transactions'} 
        />
      </div>

      <div className="mt-auto border-t border-border/10 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()} © FuelStation
        </p>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={signOut}
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
