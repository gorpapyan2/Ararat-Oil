
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Progress } from "@/core/components/ui/progress";
import { Badge } from "@/core/components/ui/primitives/badge";
import { 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  BarChart3, 
  Droplets,
  Activity,
  DollarSign,
  Users,
  CreditCard,
  ShoppingCart,
  Calendar,
  Clock,
  Settings,
  Bell,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/providers/theme-provider";
import { useState, useEffect } from "react";

interface FuelManagementDashboardProData {
  totalTanks?: number;
  activeFillingSystems?: number;
  dailyConsumption?: number;
  inventoryValue?: number;
  tankLevels?: Array<{
    id: string;
    name: string;
    fuelType: string;
    currentLevel: number;
    capacity: number;
    status: string;
    lastUpdated: string;
  }>;
  alerts?: Array<{
    id: string;
    type: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }>;
  performance?: {
    efficiency: number;
    uptime: number;
    throughput: number;
  };
}

interface FuelManagementDashboardProProps {
  className?: string;
  data?: FuelManagementDashboardProData;
  onRefresh?: () => void;
  isLoading?: boolean;
  expanded?: boolean;
}

// Modern Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon, 
  children, 
  className = "",
  variant = "default"
}: {
  title: string;
  value?: string | number;
  unit?: string;
  trend?: { value: string; direction: "up" | "down" | "neutral"; isPositive?: boolean };
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}) => {
  const variantStyles = {
    default: "bg-card hover:bg-surface-elevated",
    primary: "bg-primary/5 hover:bg-primary/10 border-primary/20",
    success: "bg-success-50 hover:bg-success-100 border-success/20",
    warning: "bg-warning-50 hover:bg-warning-100 border-warning/20",
    danger: "bg-destructive-50 hover:bg-destructive-100 border-destructive/20"
  };

  const iconStyles = {
    default: "bg-surface-elevated text-foreground-secondary",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-destructive/10 text-destructive"
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
      "hover:shadow-lg hover:-translate-y-0.5",
      variantStyles[variant],
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
              {title}
            </p>
            {value && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{value}</span>
                {unit && <span className="text-lg text-foreground-secondary">{unit}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              iconStyles[variant]
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-2 text-sm font-medium",
            trend.isPositive !== undefined 
              ? (trend.isPositive ? "text-success" : "text-destructive")
              : "text-foreground-secondary"
          )}>
            {trend.direction === "up" ? (
              <ArrowUp className="h-4 w-4" />
            ) : trend.direction === "down" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

// Modern Progress Bar Component
const ModernProgress = ({ 
  value, 
  max, 
  color = "primary", 
  label,
  showPercentage = true,
  size = "default"
}: { 
  value: number; 
  max: number; 
  color?: "primary" | "success" | "warning" | "danger"; 
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "default" | "lg";
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive"
  };

  const sizeClasses = {
    sm: "h-1.5",
    default: "h-2.5",
    lg: "h-4"
  };

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn(
        "relative overflow-hidden rounded-full bg-surface-elevated",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

// Tank Visualization Component
const TankVisualization = ({ 
  tankId, 
  level, 
  capacity, 
  type, 
  status 
}: {
  tankId: string;
  level: number;
  capacity: number;
  type: string;
  status: "Normal" | "Low" | "Critical";
}) => {
  const statusConfig = {
    Normal: { color: "success", badge: "bg-success/10 text-success border-success/20" },
    Low: { color: "warning", badge: "bg-warning/10 text-warning border-warning/20" },
    Critical: { color: "danger", badge: "bg-destructive/10 text-destructive border-destructive/20" }
  };

  const config = statusConfig[status];
  const fillHeight = Math.min(level, 100);

  return (
    <div className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Tank {tankId}</h4>
          <p className="text-sm text-foreground-secondary">{type}</p>
        </div>
        <Badge className={cn("border", config.badge)}>{status}</Badge>
      </div>
      
      <div className="relative h-32 rounded-lg bg-surface-elevated overflow-hidden">
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-1000",
            "bg-gradient-to-t",
            status === "Normal" ? "from-primary to-primary/80" :
            status === "Low" ? "from-warning to-warning/80" :
            "from-destructive to-destructive/80"
          )}
          style={{ height: `${fillHeight}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              {level}%
            </span>
          </div>
        </div>
        
        {/* Tank level markers */}
        <div className="absolute right-2 top-2 bottom-2 flex flex-col justify-between text-xs text-foreground-tertiary">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between text-sm text-foreground-secondary">
        <span>{Math.round(capacity * level / 100).toLocaleString()}L</span>
        <span>{capacity.toLocaleString()}L</span>
      </div>
    </div>
  );
};

/**
 * Professional FuelManagementDashboard component
 * Modern, clean design with enhanced animations and interactions
 */
export function FuelManagementDashboardPro({
  className,
  data,
  onRefresh,
  isLoading,
  expanded = true,
  ...props
}: FuelManagementDashboardProProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced mock data with real-time updates
  const [fuelMetrics, setFuelMetrics] = useState({
    totalCapacity: 132000,
    currentLevel: 84320,
    dailyConsumption: 11200,
    activeTanks: 4,
    totalTanks: 4,
    alerts: 2,
    weeklyTrend: -8.3,
    revenue: 95000,
    transactions: 342,
    avgTransaction: 365.5,
    customers: 156,
    tanks: [
      { id: "A-1", level: 85, capacity: 33000, type: "Premium", status: "Normal" as const },
      { id: "A-2", level: 23, capacity: 33000, type: "Regular", status: "Low" as const },
      { id: "B-1", level: 67, capacity: 33000, type: "Diesel", status: "Normal" as const },
      { id: "B-2", level: 12, capacity: 33000, type: "Premium", status: "Critical" as const }
    ],
    products: [
      { name: "Premium Benzin", revenue: 34200, percentage: 36 },
      { name: "Regular Benzin", revenue: 26600, percentage: 28 },
      { name: "Diesel", revenue: 20900, percentage: 22 },
      { name: "Lubricants", revenue: 13300, percentage: 14 }
    ],
    paymentMethods: [
      { name: "Cash", percentage: 42, transactions: 145 },
      { name: "Card", percentage: 39, transactions: 132 },
      { name: "Corporate", percentage: 13, transactions: 45 },
      { name: "Digital", percentage: 6, transactions: 20 }
    ],
    recentActivity: [
      { time: "14:30", activity: "Tank A-1 refilled", amount: "+15,000L", type: "refill" },
      { time: "12:15", activity: "Tank B-2 low level alert", amount: "12%", type: "alert" },
      { time: "10:45", activity: "Fuel dispensed", amount: "-2,450L", type: "dispense" },
      { time: "09:20", activity: "Tank B-1 maintenance", amount: "Completed", type: "maintenance" }
    ]
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setFuelMetrics(prev => ({
          ...prev,
          currentLevel: prev.currentLevel + Math.floor(Math.random() * 200 - 100),
          dailyConsumption: prev.dailyConsumption + Math.floor(Math.random() * 100 - 50),
          transactions: prev.transactions + Math.floor(Math.random() * 3),
          customers: prev.customers + Math.floor(Math.random() * 2)
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className={cn("space-y-6 animate-pulse", className)} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-surface-elevated rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("fuel-management-dashboard space-y-6", className)} {...props}>
      {/* Header with time and alerts */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fuel Management System</h2>
          <p className="text-foreground-secondary">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {fuelMetrics.alerts} Alerts
          </Badge>
          <button className="btn btn-icon">
            <Bell className="h-5 w-5" />
          </button>
          <button className="btn btn-icon">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tank Capacity */}
        <MetricCard
          title="Tank Capacity"
          value={fuelMetrics.totalCapacity.toLocaleString()}
          unit="L"
          icon={<Fuel className="h-5 w-5" />}
          variant="primary"
        >
          <div className="mt-4">
            <ModernProgress 
              value={fuelMetrics.currentLevel} 
              max={fuelMetrics.totalCapacity} 
              color="primary"
              label="Total Filled"
              size="lg"
            />
          </div>
        </MetricCard>

        {/* Current Fuel Level */}
        <MetricCard
          title="Current Fuel Level"
          value={fuelMetrics.currentLevel.toLocaleString()}
          unit="L"
          trend={{ 
            value: "8.3% from last week", 
            direction: "up",
            isPositive: true 
          }}
          icon={<Droplets className="h-5 w-5" />}
          variant="success"
        />

        {/* Daily Consumption */}
        <MetricCard
          title="Daily Consumption"
          value={fuelMetrics.dailyConsumption.toLocaleString()}
          unit="L"
          trend={{ 
            value: "8.3% from last week", 
            direction: "down",
            isPositive: false 
          }}
          icon={<Activity className="h-5 w-5" />}
          variant="warning"
        />

        {/* Active Alerts */}
        <MetricCard
          title="Active Alerts"
          value={fuelMetrics.alerts}
          trend={{ 
            value: "Require attention", 
            direction: "neutral"
          }}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="danger"
        />
      </div>

      {/* Tank Status Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tank Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fuelMetrics.tanks.map((tank) => (
            <TankVisualization key={tank.id} {...tank} />
          ))}
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue"
          value={`$${fuelMetrics.revenue.toLocaleString()}`}
          trend={{ 
            value: "Target: $95,000", 
            direction: "up",
            isPositive: true 
          }}
          icon={<DollarSign className="h-5 w-5" />}
        />

        <MetricCard
          title="Transactions"
          value={fuelMetrics.transactions}
          trend={{ 
            value: "12.5% from last week", 
            direction: "down",
            isPositive: false 
          }}
          icon={<CreditCard className="h-5 w-5" />}
        />

        <MetricCard
          title="Avg Transaction"
          value={`$${fuelMetrics.avgTransaction}`}
          trend={{ 
            value: "Per transaction", 
            direction: "neutral"
          }}
          icon={<BarChart3 className="h-5 w-5" />}
        />

        <MetricCard
          title="Customers"
          value={fuelMetrics.customers}
          trend={{ 
            value: "Unique today", 
            direction: "neutral"
          }}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {expanded && (
        <>
          {/* Products and Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
                <CardDescription>Performance breakdown by product type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fuelMetrics.products.map((product) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-foreground-secondary">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </div>
                    <ModernProgress 
                      value={product.percentage} 
                      max={100} 
                      color={product.percentage > 30 ? "success" : "primary"}
                      showPercentage={true}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Transaction distribution by payment type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fuelMetrics.paymentMethods.map((method) => (
                  <div key={method.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{method.name}</span>
                      <span className="text-foreground-secondary">
                        {method.transactions} transactions
                      </span>
                    </div>
                    <ModernProgress 
                      value={method.percentage} 
                      max={100} 
                      color={
                        method.name === "Cash" ? "success" :
                        method.name === "Card" ? "primary" :
                        method.name === "Corporate" ? "warning" :
                        "primary"
                      }
                      showPercentage={true}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest fuel management operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fuelMetrics.recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        activity.type === "refill" ? "bg-success" :
                        activity.type === "alert" ? "bg-destructive" :
                        activity.type === "dispense" ? "bg-primary" :
                        "bg-warning"
                      )} />
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-foreground-tertiary" />
                        <span className="text-sm text-foreground-secondary">
                          {activity.time}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{activity.activity}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-semibold",
                      activity.type === "refill" ? "text-success" :
                      activity.type === "alert" ? "text-destructive" :
                      activity.type === "dispense" ? "text-primary" :
                      "text-warning"
                    )}>
                      {activity.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
