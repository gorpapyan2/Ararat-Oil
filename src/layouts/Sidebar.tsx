
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
  DollarSign
} from "lucide-react";
import { NavItem } from "@/components/ui/nav-item"
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function Sidebar() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  
  // Only render the sidebar content if we're not on the auth page
  if (pathname === '/auth') {
    return null; // Don't render sidebar on auth page
  }
  
  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="px-4 py-6">
        <h1 className="font-bold text-2xl">
          <span className="text-primary">Fuel</span>Station
        </h1>
      </div>
      <div className="space-y-1">
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
          to="/cash-register" 
          icon={<DollarSign size={20} />} 
          label="Cash Register" 
          active={pathname === '/cash-register'} 
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
      <div className="mt-auto px-4 py-3 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {new Date().getFullYear()} © FuelStation
        </p>
        {isMobile && (
          <button className="text-muted-foreground hover:text-primary">
            {/* Add mobile-specific actions here if needed */}
          </button>
        )}
      </div>
    </div>
  );
}
