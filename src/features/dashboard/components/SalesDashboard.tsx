import { cn } from "@/shared/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Progress } from "@/core/components/ui/progress";
import { Badge } from "@/core/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Users, ShoppingCart, CreditCard, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SalesDashboardProps {
  className?: string;
  isLoading?: boolean;
  data?: any;
  expanded?: boolean;
  startDate?: string;
  endDate?: string;
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
 * SalesDashboard component
 * Displays sales metrics including revenue, transactions, and performance indicators
 */
export function SalesDashboard({
  className,
  isLoading,
  data,
  expanded,
  startDate,
  endDate,
  ...props
}: SalesDashboardProps) {
  const { t } = useTranslation();

  // Mock data for demonstration
  const salesMetrics = {
    totalRevenue: 125000,
    dailyTarget: 5000,
    transactions: 342,
    avgTransactionValue: 365.50,
    weeklyGrowth: 12.5,
    customerCount: 156,
    topProducts: [
      { name: "Premium Benzin", sales: 45000, percentage: 36 },
      { name: "Regular Benzin", sales: 35000, percentage: 28 },
      { name: "Dizel", sales: 28000, percentage: 22 },
      { name: "Lubricants", sales: 17000, percentage: 14 }
    ]
  };

  const recentSales = [
    { id: 1, time: "14:30", product: "Premium Benzin", amount: 50, price: 850, customer: "Regular" },
    { id: 2, time: "14:25", product: "Dizel", amount: 75, price: 1125, customer: "Corporate" },
    { id: 3, time: "14:20", product: "Regular Benzin", amount: 40, price: 600, customer: "Regular" },
    { id: 4, time: "14:15", product: "Premium Benzin", amount: 60, price: 1020, customer: "VIP" },
  ];

  const paymentMethods = [
    { method: "Cash", count: 145, percentage: 42 },
    { method: "Card", count: 132, percentage: 39 },
    { method: "Corporate", count: 45, percentage: 13 },
    { method: "Digital", count: 20, percentage: 6 }
  ];

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
    <div className={cn("sales-dashboard space-y-6", className)} {...props}>
      {/* Key Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <DashboardCard
          title="Revenue"
          value="$95,000"
          icon={<DollarSign className="h-5 w-5" />}
        >
          <div className="mt-4 text-sm text-emerald-400">
            ↑ Target: $95,000
          </div>
        </DashboardCard>

        {/* Transactions */}
        <DashboardCard
          title="Transactions"
          value="342"
          trend={{ value: "12.5% from last week", isPositive: false }}
          icon={<ShoppingCart className="h-5 w-5" />}
        />

        {/* Average Transaction */}
        <DashboardCard
          title="Avg Transaction"
          value="$365.5"
          icon={<TrendingUp className="h-5 w-5" />}
        >
          <div className="mt-4 text-sm text-gray-400">
            → Per transaction value
          </div>
        </DashboardCard>

        {/* Customer Count */}
        <DashboardCard
          title="Customers"
          value="156"
          trend={{ value: "8% this month", isPositive: true }}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {expanded && (
        <>
          {/* Product Performance */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-6">Top Products</h3>
            <div className="space-y-4">
              {salesMetrics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{product.name}</span>
                      <span className="text-sm text-gray-400">
                        ֏{product.sales.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ProgressBar value={product.percentage} max={100} color="blue" />
                    <span className="text-sm font-medium text-white w-12">{product.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-6">Payment Methods</h3>
              <div className="space-y-4">
                {paymentMethods.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{payment.method}</span>
                        <span className="text-sm text-gray-400">
                          {payment.count} transactions
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ProgressBar value={payment.percentage} max={100} color="green" />
                      <span className="text-sm font-medium text-white w-12">{payment.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-6">Recent Sales</h3>
              <div className="space-y-3">
                {recentSales.map((sale, index) => (
                  <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        sale.customer === "VIP" ? "bg-yellow-400" :
                        sale.customer === "Corporate" ? "bg-blue-400" :
                        "bg-green-400"
                      }`} />
                      <div>
                        <p className="text-white text-sm">{sale.product}</p>
                        <p className="text-gray-400 text-xs">{sale.time} • {sale.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">֏{sale.price}</p>
                      <p className="text-gray-400 text-xs">{sale.amount}L</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Performance Chart */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-6">Sales Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">↗ 15.2%</div>
                <div className="text-gray-400 text-sm">Revenue Growth</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">2.8x</div>
                <div className="text-gray-400 text-sm">Target Achievement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">84%</div>
                <div className="text-gray-400 text-sm">Customer Retention</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
