import { cn } from "@/shared/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Progress } from "@/core/components/ui/progress";
import { Badge } from "@/core/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, PieChart, Target, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FinanceDashboardProps {
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
 * FinanceDashboard component
 * Displays financial metrics including revenue, expenses, profit, and cash flow
 */
export function FinanceDashboard({
  className,
  isLoading,
  data,
  expanded,
  startDate,
  endDate,
  ...props
}: FinanceDashboardProps) {
  const { t } = useTranslation();

  // Mock data for demonstration
  const financialMetrics = {
    totalRevenue: 125000,
    totalExpenses: 78000,
    netProfit: 47000,
    profitMargin: 37.6,
    cashFlow: 15000,
    monthlyTarget: 150000,
    expenses: [
      { category: "Fuel Purchases", amount: 45000, percentage: 57.7 },
      { category: "Employee Salaries", amount: 18000, percentage: 23.1 },
      { category: "Utilities", amount: 8000, percentage: 10.3 },
      { category: "Maintenance", amount: 4500, percentage: 5.8 },
      { category: "Other", amount: 2500, percentage: 3.2 }
    ]
  };

  const recentTransactions = [
    { id: 1, type: "Income", description: "Fuel Sales", amount: 15000, time: "Today 14:30" },
    { id: 2, type: "Expense", description: "Fuel Purchase", amount: -25000, time: "Today 10:00" },
    { id: 3, type: "Income", description: "Service Revenue", amount: 3500, time: "Yesterday 16:45" },
    { id: 4, type: "Expense", description: "Utility Bill", amount: -2800, time: "Yesterday 09:15" },
  ];

  const monthlyComparison = [
    { month: "January", revenue: 120000, expenses: 75000, profit: 45000 },
    { month: "February", revenue: 135000, expenses: 82000, profit: 53000 },
    { month: "March", revenue: 125000, expenses: 78000, profit: 47000 },
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
    <div className={cn("finance-dashboard space-y-6", className)} {...props}>
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <DashboardCard
          title="Total Revenue"
          value="$125,000"
          icon={<DollarSign className="h-5 w-5" />}
        >
          <div className="mt-4">
            <ProgressBar value={83} max={100} color="green" />
            <div className="text-center text-emerald-400 font-medium text-sm mt-2">83% of target</div>
          </div>
        </DashboardCard>

        {/* Total Expenses */}
        <DashboardCard
          title="Total Expenses"
          value="$78,000"
          trend={{ value: "5% decrease from last month", isPositive: true }}
          icon={<CreditCard className="h-5 w-5" />}
        />

        {/* Net Profit */}
        <DashboardCard
          title="Net Profit"
          value="$47,000"
          icon={<TrendingUp className="h-5 w-5" />}
        >
          <div className="mt-4 text-sm text-emerald-400">
            37.6% profit margin
          </div>
        </DashboardCard>

        {/* Cash Flow */}
        <DashboardCard
          title="Cash Flow"
          value="$15,000"
          trend={{ value: "Positive this month", isPositive: true }}
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      {expanded && (
        <>
          {/* Expense Breakdown */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-6">Expense Breakdown</h3>
            <div className="space-y-4">
              {financialMetrics.expenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{expense.category}</span>
                      <span className="text-sm text-gray-400">
                        ֏{expense.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ProgressBar value={expense.percentage} max={100} color="red" />
                    <span className="text-sm font-medium text-white w-12">{expense.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions & Monthly Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-6">Recent Transactions</h3>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === "Income" ? "bg-green-400" : "bg-red-400"
                      }`} />
                      <div>
                        <p className="text-white text-sm">{transaction.description}</p>
                        <p className="text-gray-400 text-xs">{transaction.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.amount > 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}֏{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-6">Monthly Comparison</h3>
              <div className="space-y-4">
                {monthlyComparison.map((month, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{month.month}</h4>
                      <Badge className={`${
                        month.profit > 50000 ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        month.profit > 40000 ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                        "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      }`}>
                        ֏{month.profit.toLocaleString()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue</span>
                        <span className="text-green-400">֏{month.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expenses</span>
                        <span className="text-red-400">֏{month.expenses.toLocaleString()}</span>
                      </div>
                      <ProgressBar 
                        value={(month.profit / month.revenue) * 100} 
                        max={100} 
                        color="blue"
                        label="Profit Margin"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Performance Metrics */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-6">Financial Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">37.6%</div>
                <div className="text-gray-400 text-sm">Profit Margin</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">2.1</div>
                <div className="text-gray-400 text-sm">ROI Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">↗ 15%</div>
                <div className="text-gray-400 text-sm">Growth Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">A+</div>
                <div className="text-gray-400 text-sm">Financial Health</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
