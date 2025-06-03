import { cn } from "@/shared/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Progress } from "@/core/components/ui/progress";
import { Badge } from "@/core/components/ui/badge";
import { Fuel, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FuelManagementDashboardProps {
  className?: string;
  isLoading?: boolean;
  data?: any;
  expanded?: boolean;
}

// Progress Bar Component
const ProgressBar = ({ value, max, color = "blue", label }: { value: number; max: number; color?: "blue" | "orange" | "green" | "red"; label?: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    blue: "bg-blue-500",
    orange: "bg-orange-500", 
    green: "bg-emerald-500",
    red: "bg-red-500"
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          <span className="text-gray-100 font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Dashboard Card Component
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
  <div className={`bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
    
    {value && (
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-white">{value}</span>
        {unit && <span className="text-lg text-gray-400">{unit}</span>}
      </div>
    )}
    
    {trend && (
      <div className={`flex items-center gap-2 text-sm ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {trend.value}
      </div>
    )}
    
    {children}
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
            <div key={i} className="h-32 bg-gray-800/30 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("fuel-management-dashboard space-y-6", className)} {...props}>
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
            <div className="text-sm text-emerald-400 mb-3">↑ Tanks active</div>
            <ProgressBar value={11} max={100} color="blue" />
            <div className="text-center text-white font-bold text-lg mt-2">11%</div>
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
            <div className="text-sm text-emerald-400 mb-4">↑ 8.3% from last week</div>
            <ProgressBar value={85} max={100} color="blue" label="A-1" />
            <ProgressBar value={23} max={100} color="orange" label="A-2" />
            <ProgressBar value={67} max={100} color="green" label="B-1" />
            <ProgressBar value={12} max={100} color="red" label="B-2" />
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
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-semibold">Tank Status Details</h3>
              <div className="flex items-center gap-2 text-orange-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">2 alerts requiring attention</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fuelMetrics.tanks.map((tank, index) => (
                <div key={tank.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">Tank {tank.id}</h4>
                      <p className="text-gray-400 text-sm">{tank.type}</p>
                    </div>
                    <Badge 
                      className={`${
                        tank.status === "Critical" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                        tank.status === "Low" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                        "bg-green-500/20 text-green-400 border-green-500/30"
                      }`}
                    >
                      {tank.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Level</span>
                      <span className="text-white font-medium">{tank.level}%</span>
                    </div>
                    <ProgressBar 
                      value={tank.level} 
                      max={100} 
                      color={
                        tank.status === "Critical" ? "red" :
                        tank.status === "Low" ? "orange" :
                        tank.level > 70 ? "green" : "blue"
                      }
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{Math.round(tank.capacity * tank.level / 100).toLocaleString()}L</span>
                      <span>{tank.capacity.toLocaleString()}L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Recent Fuel Activity</h3>
            <div className="space-y-3">
              {[
                { time: "14:30", activity: "Tank A-1 refilled", amount: "+15,000L", type: "refill" },
                { time: "12:15", activity: "Tank B-2 low level alert", amount: "12%", type: "alert" },
                { time: "10:45", activity: "Fuel dispensed", amount: "-2,450L", type: "dispense" },
                { time: "09:20", activity: "Tank B-1 maintenance", amount: "Completed", type: "maintenance" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "refill" ? "bg-green-400" :
                      activity.type === "alert" ? "bg-red-400" :
                      activity.type === "dispense" ? "bg-blue-400" :
                      "bg-yellow-400"
                    }`} />
                    <div>
                      <p className="text-white text-sm">{activity.activity}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    activity.type === "refill" ? "text-green-400" :
                    activity.type === "alert" ? "text-red-400" :
                    activity.type === "dispense" ? "text-blue-400" :
                    "text-yellow-400"
                  }`}>
                    {activity.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
