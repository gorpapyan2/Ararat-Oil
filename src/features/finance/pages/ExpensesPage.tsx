import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Building,
  Fuel,
  Wrench,
  Users,
  ShoppingCart,
  Truck,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Plus,
  Download,
  Upload,
  BarChart3,
  PieChart,
  FileText,
  Calculator,
  Target,
  Activity,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Tag,
  Receipt,
  Banknote,
  Wallet,
  Building2,
  Car,
  Phone,
  MapPin,
  Archive,
  Bookmark
} from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { StatsCard } from '@/shared/components/cards';

// Types
interface ExpenseCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  budget: number;
  spent: number;
  transactions: number;
  trend: number;
  description: string;
}

interface ExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  vendor: string;
  date: string;
  method: 'cash' | 'card' | 'transfer' | 'check';
  status: 'pending' | 'approved' | 'paid' | 'overdue';
  receipt?: string;
  tags: string[];
  notes?: string;
  approver?: string;
  department: string;
}

// Mock Data
const expenseCategories: ExpenseCategory[] = [
  {
    id: 'fuel',
    name: 'Fuel Purchases',
    icon: Fuel,
    color: 'blue',
    budget: 45000,
    spent: 38750,
    transactions: 127,
    trend: 5.2,
    description: 'Wholesale fuel procurement'
  },
  {
    id: 'maintenance',
    name: 'Equipment Maintenance',
    icon: Wrench,
    color: 'orange',
    budget: 12000,
    spent: 8340,
    transactions: 23,
    trend: -12.3,
    description: 'Pump and equipment repairs'
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: Lightbulb,
    color: 'yellow',
    budget: 8000,
    spent: 6890,
    transactions: 18,
    trend: 3.1,
    description: 'Electricity, water, gas'
  },
  {
    id: 'salaries',
    name: 'Staff Salaries',
    icon: Users,
    color: 'green',
    budget: 25000,
    spent: 24500,
    transactions: 15,
    trend: 2.1,
    description: 'Employee compensation'
  },
  {
    id: 'supplies',
    name: 'Office Supplies',
    icon: ShoppingCart,
    color: 'purple',
    budget: 3000,
    spent: 1890,
    transactions: 31,
    trend: -8.7,
    description: 'Stationery, cleaning supplies'
  },
  {
    id: 'transport',
    name: 'Transportation',
    icon: Truck,
    color: 'red',
    budget: 7500,
    spent: 5420,
    transactions: 19,
    trend: 15.4,
    description: 'Delivery and transport costs'
  },
  {
    id: 'rent',
    name: 'Rent & Insurance',
    icon: Building,
    color: 'indigo',
    budget: 15000,
    spent: 15000,
    transactions: 4,
    trend: 0,
    description: 'Property rent and insurance'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Target,
    color: 'pink',
    budget: 5000,
    spent: 2340,
    transactions: 12,
    trend: 28.5,
    description: 'Advertising and promotions'
  }
];

const recentTransactions: ExpenseTransaction[] = [
  {
    id: '1',
    description: 'Wholesale Fuel Purchase - Premium 95',
    amount: 8750,
    category: 'Fuel Purchases',
    vendor: 'TÜPRAŞ',
    date: '2024-01-15',
    method: 'transfer',
    status: 'paid',
    receipt: 'RCP001234',
    tags: ['wholesale', 'premium', 'urgent'],
    department: 'Operations',
    approver: 'Gor Petrosyan'
  },
  {
    id: '2',
    description: 'Pump Maintenance - Station 3',
    amount: 1250,
    category: 'Equipment Maintenance',
    vendor: 'TechnoCare Solutions',
    date: '2024-01-14',
    method: 'card',
    status: 'approved',
    tags: ['maintenance', 'pump', 'station3'],
    department: 'Maintenance',
    notes: 'Routine quarterly maintenance'
  },
  {
    id: '3',
    description: 'Electricity Bill - January',
    amount: 2890,
    category: 'Utilities',
    vendor: 'BEDAŞ',
    date: '2024-01-13',
    method: 'transfer',
    status: 'paid',
    receipt: 'ELC2024001',
    tags: ['utilities', 'electricity', 'monthly'],
    department: 'Operations'
  },
  {
    id: '4',
    description: 'Staff Salaries - January',
    amount: 24500,
    category: 'Staff Salaries',
    vendor: 'Payroll Department',
    date: '2024-01-12',
    method: 'transfer',
    status: 'paid',
    tags: ['payroll', 'monthly', 'staff'],
    department: 'HR'
  },
  {
    id: '5',
    description: 'Office Cleaning Supplies',
    amount: 340,
    category: 'Office Supplies',
    vendor: 'CleanCorp Ltd',
    date: '2024-01-11',
    method: 'cash',
    status: 'pending',
    tags: ['supplies', 'cleaning', 'office'],
    department: 'Administration'
  },
  {
    id: '6',
    description: 'Fuel Delivery Transport',
    amount: 890,
    category: 'Transportation',
    vendor: 'FastTrans Logistics',
    date: '2024-01-10',
    method: 'card',
    status: 'paid',
    receipt: 'TRP567890',
    tags: ['transport', 'delivery', 'fuel'],
    department: 'Logistics'
  }
];

// Calculate totals and metrics
const totalBudget = expenseCategories.reduce((sum, cat) => sum + cat.budget, 0);
const totalSpent = expenseCategories.reduce((sum, cat) => sum + cat.spent, 0);
const totalTransactions = expenseCategories.reduce((sum, cat) => sum + cat.transactions, 0);
const budgetUtilization = (totalSpent / totalBudget) * 100;
const avgTransactionValue = totalSpent / totalTransactions;
const monthlyGrowth = 8.4;

// Quick Stats
const quickStats = [
  {
    title: 'Total Expenses',
    value: `₺${totalSpent.toLocaleString()}`,
    icon: DollarSign,
    color: 'blue',
    description: 'This month'
  },
  {
    title: 'Budget Remaining',
    value: `₺${(totalBudget - totalSpent).toLocaleString()}`,
    icon: Wallet,
    color: 'green',
    description: `${(100 - budgetUtilization).toFixed(1)}% left`
  },
  {
    title: 'Transactions',
    value: totalTransactions.toString(),
    icon: Receipt,
    color: 'purple',
    description: 'This month'
  },
  {
    title: 'Avg. Transaction',
    value: `₺${avgTransactionValue.toFixed(0)}`,
    icon: Calculator,
    color: 'orange',
    description: 'Per transaction'
  }
];

// Overall Stats
const overallStats = [
  {
    title: 'Budget Utilization',
    value: `${budgetUtilization.toFixed(1)}%`,
    icon: PieChart,
    color: 'blue',
    description: 'Of total budget used'
  },
  {
    title: 'Monthly Growth',
    value: `${monthlyGrowth > 0 ? '+' : ''}${monthlyGrowth}%`,
    icon: monthlyGrowth > 0 ? TrendingUp : TrendingDown,
    color: monthlyGrowth > 0 ? 'red' : 'green',
    description: 'vs last month'
  },
  {
    title: 'Categories Active',
    value: expenseCategories.length.toString(),
    icon: Tag,
    color: 'purple',
    description: 'Expense categories'
  },
  {
    title: 'Cost Efficiency',
    value: '94.2%',
    icon: Target,
    color: 'green',
    description: 'Efficiency score'
  }
];

// Performance Stats
const performanceStats = [
  {
    title: 'Pending Approvals',
    value: recentTransactions.filter(t => t.status === 'pending').length.toString(),
    icon: Clock,
    color: 'yellow',
    description: 'Awaiting approval'
  },
  {
    title: 'Overdue Payments',
    value: recentTransactions.filter(t => t.status === 'overdue').length.toString(),
    icon: AlertCircle,
    color: 'red',
    description: 'Need attention'
  },
  {
    title: 'Top Category',
    value: 'Fuel Purchases',
    icon: Fuel,
    color: 'blue',
    description: `₺${expenseCategories[0].spent.toLocaleString()}`
  },
  {
    title: 'Cost Savings',
    value: '₺3,420',
    icon: TrendingDown,
    color: 'green',
    description: 'vs budget'
  }
];

export default function ExpensesPage() {
  const [viewMode, setViewMode] = useState<'categories' | 'transactions'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'approved':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'transfer':
        return <Building2 className="w-4 h-4" />;
      case 'check':
        return <FileText className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <WindowContainer
      title="Finance Expenses Dashboard"
      subtitle="Comprehensive expense management, budget tracking, and financial analytics for optimal cost control"
    >
      {/* Quick Stats Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
            Expense Overview
          </h3>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-200">
              <Plus className="w-4 h-4" />
              New Expense
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
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

      {/* View Mode Toggle & Search */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('categories')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'categories'
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Tag className="h-4 w-4 mr-2 inline" />
              Categories
            </button>
            <button
              onClick={() => setViewMode('transactions')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'transactions'
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Receipt className="h-4 w-4 mr-2 inline" />
              Transactions
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${viewMode}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'categories' ? (
          <div className="space-y-6">
            <h4 className="text-md font-semibold text-card-foreground mb-4">
              Expense Categories & Budget Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {expenseCategories.map((category) => {
                const IconComponent = category.icon;
                const utilizationPercent = (category.spent / category.budget) * 100;
                const isOverBudget = utilizationPercent > 100;
                
                return (
                  <div
                    key={category.id}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-${category.color}-500/10`}>
                        <IconComponent className={`w-5 h-5 text-${category.color}-500`} />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category.trend > 0 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-green-600 bg-green-50'
                      }`}>
                        {category.trend > 0 ? '+' : ''}{category.trend}%
                      </span>
                    </div>

                    <h5 className="font-semibold text-card-foreground mb-1">
                      {category.name}
                    </h5>
                    <p className="text-xs text-muted-foreground mb-3">
                      {category.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Spent:</span>
                        <span className="font-medium">₺{category.spent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">₺{category.budget.toLocaleString()}</span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            isOverBudget 
                              ? 'bg-red-500' 
                              : utilizationPercent > 80 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{utilizationPercent.toFixed(1)}% used</span>
                        <span>{category.transactions} transactions</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-card-foreground mb-4">
              Recent Transactions ({filteredTransactions.length})
            </h4>
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {getMethodIcon(transaction.method)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-card-foreground">{transaction.description}</h5>
                      <p className="text-sm text-muted-foreground">
                        {transaction.vendor} • {transaction.department}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-lg text-card-foreground">
                      ₺{transaction.amount.toLocaleString()}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 capitalize">{transaction.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium">{transaction.category}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <div className="font-medium">{new Date(transaction.date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Method:</span>
                    <div className="font-medium capitalize">{transaction.method}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Receipt:</span>
                    <div className="font-medium">{transaction.receipt || 'N/A'}</div>
                  </div>
                </div>

                {transaction.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {transaction.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {transaction.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      {transaction.notes}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overall Performance Analytics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-4">
          Performance Analytics
        </h3>
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

      {/* Management Tools */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-4">
          Expense Management Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Plus className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">Add Expense</div>
              <div className="text-xs text-muted-foreground">Record new expense</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Upload className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">Import Data</div>
              <div className="text-xs text-muted-foreground">Bulk import expenses</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">Analytics</div>
              <div className="text-xs text-muted-foreground">Detailed reports</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Download className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">Export</div>
              <div className="text-xs text-muted-foreground">Download reports</div>
            </div>
          </button>
        </div>
      </div>

      {/* Additional Performance Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-4">
          Financial Performance
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
    </WindowContainer>
  );
}
