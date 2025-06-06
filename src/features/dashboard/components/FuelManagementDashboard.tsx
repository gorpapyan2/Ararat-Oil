import { cn } from "@/shared/utils";
import { Card } from '@/core/components/ui/card';
import { Progress } from "@/core/components/ui/progress";
import { Badge } from "@/core/components/ui/primitives/badge";
import { Fuel, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FuelManagementDashboardData {
  totalInventory?: number;
  lowStockItems?: number;
  fuelDeliveries?: number;
  avgConsumption?: number;
  tanks?: Array<{
    name: string;
    level: number;
    capacity: number;
    status: string;
  }>;
  alerts?: Array<{
    type: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

interface FuelManagementDashboardProps {
  className?: string;
  isLoading?: boolean;
  data?: FuelManagementDashboardData;
  expanded?: boolean;
  startDate?: string;
  endDate?: string;
}

// Progress Bar Component with Natural Colors
const ProgressBar = ({ value, max, color = "natural", label }: { value: number; max: number; color?: "natural" | "warning" | "success" | "critical"; label?: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    natural: "bg-gradient-natural",
    warning: "bg-status-warning", 
    success: "bg-status-operational",
    critical: "bg-status-critical"
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-foreground font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2.5 shadow-inner">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${colorClasses[color]} shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Dashboard Card Component with Natural Styling
const DashboardCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon, 
  children, 
  className = "" 
}: {
  title: string;
  value?: string | number;
  unit?: string;
  trend?: { value: string; isPositive: boolean };
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={`group relative bg-card border border-border rounded-xl p-6 
    hover:bg-gradient-natural-light hover:border-accent/20 
    transition-all duration-300 hover:scale-[1.01] hover:shadow-lg 
    backdrop-blur-sm ${className}`}>
    {/* Gradient accent overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wide">{title}</h3>
        {icon && <div className="text-accent group-hover:text-accent/80 transition-colors">{icon}</div>}
      </div>
      
      {value && (
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-foreground group-hover:text-accent transition-colors">{value}</span>
          {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
        </div>
      )}
      
      {trend && (
        <div className={`flex items-center gap-2 text-sm ${trend.isPositive ? 'text-status-operational' : 'text-status-critical'}`}>
          {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {trend.value}
        </div>
      )}
      
      {children}
    </div>
  </div>
);

/**
 * FuelManagementDashboard component
 * Displays fuel-related metrics including tank levels, consumption, and alerts
 */
export function FuelManagementDashboard({
  className,
  isLoading,
  data,
  expanded,
  ...props
}: FuelManagementDashboardProps) {
  const { t } = useTranslation();

  // Mock data for demonstration
  const fuelMetrics = {
    totalCapacity: 132000,
    currentLevel: 84320,
    dailyConsumption: 10822,
    activeTanks: 4,
    totalTanks: 4,
    alerts: 2,
    weeklyTrend: -8.3,
    tanks: [
      { id: "A-1", level: 85, capacity: 33000, type: "Premium", status: "Normal" },
      { id: "A-2", level: 23, capacity: 33000, type: "Regular", status: "Low" },
      { id: "B-1", level: 67, capacity: 33000, type: "Diesel", status: "Normal" },
      { id: "B-2", level: 12, capacity: 33000, type: "Premium", status: "Critical" }
    ]
  };

  if (isLoading) {
    return (
      <div className={cn("animate-pulse space-y-4", className)} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/30 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("fuel-management-dashboard space-y-6 relative", className)} {...props}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 rounded-2xl -z-10" />
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tank Capacity */}
        <DashboardCard
          title="Tank Capacity"
          value="132,000"
          unit="L"
          icon={<Fuel className="h-5 w-5" />}
        >
          <div className="mt-4">
            <div className="text-sm text-status-operational mb-3 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Tanks active
            </div>
            <ProgressBar value={11} max={100} color="natural" />
            <div className="text-center text-foreground font-bold text-lg mt-2">11%</div>
          </div>
        </DashboardCard>

        {/* Current Fuel Level */}
        <DashboardCard
          title="Current Fuel Level"
          value="84,320"
          unit="L"
          icon={<Droplets className="h-5 w-5" />}
          className="md:col-span-2"
        >
          <div className="mt-4 space-y-3">
            <div className="text-sm text-status-operational mb-4 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              8.3% from last week
            </div>
            <ProgressBar value={85} max={100} color="success" label="A-1" />
            <ProgressBar value={23} max={100} color="warning" label="A-2" />
            <ProgressBar value={67} max={100} color="success" label="B-1" />
            <ProgressBar value={12} max={100} color="critical" label="B-2" />
          </div>
        </DashboardCard>

        {/* Daily Consumption */}
        <DashboardCard
          title="Daily Consumption"
          value="10,822"
          unit="L"
          trend={{ value: "8.3% from last week", isPositive: false }}
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      {expanded && (
        <>
          {/* Tank Details */}
          <div className="group relative bg-card border border-border rounded-xl p-6 
            hover:bg-gradient-natural-light hover:border-accent/20 
            transition-all duration-300 backdrop-blur-sm">
            {/* Gradient accent overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-foreground text-lg font-semibold">Tank Status Details</h3>
                <div className="flex items-center gap-2 text-status-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">2 alerts requiring attention</span>
                </div>
              </div>

              {/* Tank Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {fuelMetrics.tanks.map((tank, index) => {
                  const getStatusColor = (status: string) => {
                    switch (status.toLowerCase()) {
                      case 'normal': return 'text-status-operational';
                      case 'low': return 'text-status-warning';
                      case 'critical': return 'text-status-critical';
                      default: return 'text-muted-foreground';
                    }
                  };

                  const getProgressColor = (level: number) => {
                    if (level > 50) return 'success';
                    if (level > 20) return 'warning';
                    return 'critical';
                  };

                  return (
                    <div key={tank.id} className="bg-muted/50 rounded-lg p-4 border border-border hover:bg-muted/70 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{tank.id}</h4>
                          <p className="text-sm text-muted-foreground">{tank.type}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(tank.status)}>
                          {tank.status}
                        </Badge>
                      </div>
                      <ProgressBar 
                        value={tank.level} 
                        max={100} 
                        color={getProgressColor(tank.level)}
                        label={`${tank.level}% (${Math.round(tank.capacity * tank.level / 100).toLocaleString()}L)`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="group relative bg-card border border-border rounded-xl p-6 
            hover:bg-gradient-natural-light hover:border-accent/20 
            transition-all duration-300 backdrop-blur-sm">
            {/* Gradient accent overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <h3 className="text-foreground text-lg font-semibold mb-4">Active Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-status-critical/10 border border-status-critical/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-status-critical" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Tank B-2 Critical Level</p>
                    <p className="text-xs text-muted-foreground">Premium fuel at 12% capacity - immediate refill required</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-status-warning/10 border border-status-warning/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-status-warning" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Tank A-2 Low Level</p>
                    <p className="text-xs text-muted-foreground">Regular fuel at 23% capacity - refill recommended</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
