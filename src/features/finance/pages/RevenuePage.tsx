import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  BarChart3,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Fuel,
  ShoppingCart,
  Wrench,
  Package,
  Users,
  Clock,
  TrendingDown,
  Activity,
  Percent,
  Calculator,
  FileText,
  Filter,
  Download,
  Banknote,
  Zap,
  Award
} from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { StatsCard } from '@/shared/components/cards';

interface RevenueStream {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  color: string;
  icon: any;
  transactions: number;
}

interface RevenueTransaction {
  id: string;
  type: string;
  amount: number;
  customer: string;
  time: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

const revenueStreams: RevenueStream[] = [
  {
    id: 'fuel-sales',
    name: 'Fuel Sales',
    amount: 84750.50,
    percentage: 68.2,
    trend: 'up',
    trendValue: 12.5,
    color: 'from-blue-500 to-blue-600',
    icon: Fuel,
    transactions: 1234
  },
  {
    id: 'premium-fuel',
    name: 'Premium Fuel',
    amount: 23890.75,
    percentage: 19.2,
    trend: 'up',
    trendValue: 8.3,
    color: 'from-purple-500 to-purple-600',
    icon: Award,
    transactions: 456
  },
  {
    id: 'services',
    name: 'Services & Maintenance',
    amount: 12340.25,
    percentage: 9.9,
    trend: 'up',
    trendValue: 5.7,
    color: 'from-green-500 to-green-600',
    icon: Wrench,
    transactions: 89
  },
  {
    id: 'retail',
    name: 'Retail Products',
    amount: 3420.80,
    percentage: 2.7,
    trend: 'stable',
    trendValue: 0.5,
    color: 'from-amber-500 to-amber-600',
    icon: Package,
    transactions: 234
  }
];

const recentTransactions: RevenueTransaction[] = [
  {
    id: 'txn-001',
    type: 'Premium 98 Fuel',
    amount: 234.50,
    customer: 'Armen Petrosyan',
    time: '2 min ago',
    method: 'Credit Card',
    status: 'completed'
  },
  {
    id: 'txn-002',
    type: 'Diesel Fuel',
    amount: 189.25,
    customer: 'Tigran Hovhannisyan',
    time: '5 min ago',
    method: 'Cash',
    status: 'completed'
  },
  {
    id: 'txn-003',
    type: 'Oil Change Service',
    amount: 89.00,
    customer: 'Sona Harutyunyan',
    time: '12 min ago',
    method: 'Credit Card',
    status: 'completed'
  },
  {
    id: 'txn-004',
    type: 'Regular 87 Fuel',
    amount: 156.75,
    customer: 'Davit Grigoryan',
    time: '18 min ago',
    method: 'Debit Card',
    status: 'pending'
  },
  {
    id: 'txn-005',
    type: 'Car Wash',
    amount: 25.00,
    customer: 'Lusine Abrahamyan',
    time: '25 min ago',
    method: 'Cash',
    status: 'completed'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getTrendIcon = (trend: string, trendValue: number) => {
  if (trend === 'up') {
    return <ArrowUpRight className="w-4 h-4 text-green-500" />;
  } else if (trend === 'down') {
    return <ArrowDownRight className="w-4 h-4 text-red-500" />;
  }
  return <TrendingUp className="w-4 h-4 text-gray-500" />;
};

export default function RevenuePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Finance', href: '/finance' },
    { label: 'Revenue Analytics', href: '/finance/revenue' }
  ];

  const totalRevenue = revenueStreams.reduce((sum, stream) => sum + stream.amount, 0);
  const totalTransactions = revenueStreams.reduce((sum, stream) => sum + stream.transactions, 0);
  const avgTransactionValue = totalRevenue / totalTransactions;
  const monthlyGrowth = 15.8;

  const overallStats = [
    {
      title: 'Total Revenue',
      value: `₺${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500/80 to-green-500',
      description: `↗ +${monthlyGrowth}% vs last month`
    },
    {
      title: 'Monthly Growth',
      value: `+${monthlyGrowth}%`,
      icon: TrendingUp,
      color: 'from-blue-500/80 to-blue-500',
      description: 'Year-over-year increase'
    },
    {
      title: 'Total Transactions',
      value: totalTransactions.toLocaleString(),
      icon: Activity,
      color: 'from-purple-500/80 to-purple-500',
      description: 'This month'
    },
    {
      title: 'Avg. Transaction',
      value: `₺${avgTransactionValue.toFixed(2)}`,
      icon: Calculator,
      color: 'from-amber-500/80 to-amber-500',
      description: 'Per transaction value'
    }
  ];

  const performanceStats = [
    {
      title: 'Daily Average',
      value: `₺${(totalRevenue / 30).toLocaleString()}`,
      icon: Calendar,
      color: 'from-cyan-500/80 to-cyan-500',
      description: 'Last 30 days'
    },
    {
      title: 'Peak Hour Revenue',
      value: '₺3,240',
      icon: Clock,
      color: 'from-pink-500/80 to-pink-500',
      description: '2PM - 4PM'
    },
    {
      title: 'Revenue Target',
      value: '87.3%',
      icon: Target,
      color: 'from-indigo-500/80 to-indigo-500',
      description: 'Monthly target progress'
    },
    {
      title: 'Profit Margin',
      value: '23.8%',
      icon: Percent,
      color: 'from-emerald-500/80 to-emerald-500',
      description: 'Average margin'
    }
  ];

  return (
    <WindowContainer
      title="Revenue Analytics"
      subtitle="Comprehensive revenue tracking, analysis, and performance insights for business growth"
      breadcrumbItems={breadcrumbItems}
    >
      {/* Main Revenue Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
            Revenue Overview
          </h3>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overallStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              description={stat.description}
            />
          ))}
        </div>
      </div>

      {/* Revenue Streams & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Streams */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
              Revenue Streams
            </h3>
            <span className="text-sm text-muted-foreground">
              Last 30 days
            </span>
          </div>
          
          <div className="space-y-4">
            {revenueStreams.map((stream) => (
              <div
                key={stream.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stream.color} bg-opacity-10`}>
                      <stream.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">{stream.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{stream.transactions} transactions</span>
                        <span>•</span>
                        <span>{stream.percentage}% of total</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-card-foreground">
                      ₺{stream.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {getTrendIcon(stream.trend, stream.trendValue)}
                      <span className={`${
                        stream.trend === 'up' ? 'text-green-600' : 
                        stream.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stream.trendValue > 0 ? '+' : ''}{stream.trendValue}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${stream.color} transition-all duration-500`}
                      style={{ width: `${stream.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
              Recent Transactions
            </h3>
            <span className="text-sm text-muted-foreground">
              Live updates
            </span>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-card-foreground truncate">
                      {transaction.type}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {transaction.customer}
                    </p>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-sm font-semibold text-green-600">
                      +₺{transaction.amount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.time}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CreditCard className="w-3 h-3" />
                    <span>{transaction.method}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
            
            <button className="w-full text-sm text-accent hover:text-accent/80 py-2 transition-colors">
              View all transactions →
            </button>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-4">
          Performance Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              description={stat.description}
            />
          ))}
        </div>
      </div>

      {/* Revenue Analysis Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-4">
          Revenue Analysis Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">Revenue Trends</div>
              <div className="text-xs text-muted-foreground">Analyze patterns</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <PieChart className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">Revenue Breakdown</div>
              <div className="text-xs text-muted-foreground">By category</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">Generate Report</div>
              <div className="text-xs text-muted-foreground">Detailed analysis</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">Set Targets</div>
              <div className="text-xs text-muted-foreground">Revenue goals</div>
            </div>
          </button>
        </div>
      </div>
    </WindowContainer>
  );
} 