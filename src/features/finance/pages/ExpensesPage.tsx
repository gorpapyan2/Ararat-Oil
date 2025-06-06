import React, { useState, useEffect } from 'react';
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
  Bookmark,
  X,
  Save,
  Table
} from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { StatsCard } from '@/shared/components/cards';
import { fetchExpenses, createExpense, fetchExpenseCategories } from '@/features/finance/services/expenses';
import type { Expense } from '@/core/api';
import type { ExpenseCategory } from '@/core/types';

// Types
interface ExpenseCategoryData {
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

interface CreateExpenseForm {
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  payment_status: 'pending' | 'paid' | 'cancelled';
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'mobile_payment';
  invoice_number?: string;
  notes?: string;
}

// Mock Data for categories (with icons)
const expenseCategoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  utilities: Lightbulb,
  supplies: ShoppingCart,
  maintenance: Wrench,
  salary: Users,
  other: Archive
};

const expenseCategories: ExpenseCategoryData[] = [
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
    id: 'salary',
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
    id: 'other',
    name: 'Other Expenses',
    icon: Archive,
    color: 'pink',
    budget: 5000,
    spent: 2340,
    transactions: 12,
    trend: 28.5,
    description: 'Miscellaneous expenses'
  }
];

export default function ExpensesPage() {
  const [viewMode, setViewMode] = useState<'categories' | 'transactions' | 'table'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<ExpenseCategory[]>([]);
  
  const [createForm, setCreateForm] = useState<CreateExpenseForm>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: 'utilities' as ExpenseCategory,
    description: '',
    payment_status: 'pending',
    payment_method: 'cash',
    invoice_number: '',
    notes: ''
  });

  // Load expenses and categories on component mount
  useEffect(() => {
    loadExpenses();
    loadCategories();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const expensesData = await fetchExpenses();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchExpenseCategories();
      setAvailableCategories(categoriesData as ExpenseCategory[]);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to default categories
      const fallbackCategories: ExpenseCategory[] = ['utilities', 'supplies', 'maintenance', 'salary', 'other'];
      setAvailableCategories(fallbackCategories);
    }
  };

  const handleCreateExpense = async () => {
    try {
      if (!createForm.description || createForm.amount <= 0) {
        alert('Please fill in all required fields');
        return;
      }

      setLoading(true);
      const newExpense = await createExpense({
        date: createForm.date,
        amount: createForm.amount,
        category: createForm.category,
        description: createForm.description,
        payment_status: createForm.payment_status,
        payment_method: createForm.payment_method,
        invoice_number: createForm.invoice_number,
        notes: createForm.notes
      });
      
      // Add to expenses list
      setExpenses(prev => [newExpense, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: 'utilities' as ExpenseCategory,
        description: '',
        payment_status: 'pending',
        payment_method: 'cash',
        invoice_number: '',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to create expense:', error);
      alert('Failed to create expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate quick stats
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.payment_status === 'pending').length;
  const completedExpenses = expenses.filter(e => e.payment_status === 'paid').length;
  const monthlyExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.payment_date || e.created_at);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const quickStats = [
    {
      title: 'Total Expenses',
      value: `₺${totalExpenses.toLocaleString()}`,
      icon: DollarSign,
      color: 'blue' as const,
      description: 'All time total'
    },
    {
      title: 'This Month',
      value: `₺${monthlyExpenses.toLocaleString()}`,
      icon: Calendar,
      color: 'green' as const,
      description: 'Current month expenses'
    },
    {
      title: 'Pending',
      value: pendingExpenses.toString(),
      icon: Clock,
      color: 'orange' as const,
      description: 'Awaiting payment'
    },
    {
      title: 'Completed',
      value: completedExpenses.toString(),
      icon: CheckCircle,
      color: 'purple' as const,
      description: 'Successfully paid'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
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
      case 'bank_transfer':
        return <Building2 className="w-4 h-4" />;
      case 'mobile_payment':
        return <Phone className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
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
            <button 
              onClick={loadExpenses}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-200"
            >
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
              List View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Table className="h-4 w-4 mr-2 inline" />
              Table View
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search expenses...`}
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
        ) : viewMode === 'transactions' ? (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-card-foreground mb-4">
              Recent Expenses ({filteredExpenses.length})
            </h4>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading expenses...
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No expenses found. Create your first expense!
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-card-foreground">{expense.description}</h5>
                        <p className="text-sm text-muted-foreground">
                          {expense.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-lg text-card-foreground">
                        ₺{expense.amount.toLocaleString()}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(expense.payment_status)}`}>
                        {getStatusIcon(expense.payment_status)}
                        <span className="ml-1 capitalize">{expense.payment_status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <div className="font-medium capitalize">{expense.category}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <div className="font-medium">{new Date(expense.payment_date || expense.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="font-medium capitalize">{expense.payment_status}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Invoice:</span>
                      <div className="font-medium">{expense.receipt_number || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(expense.created_at).toLocaleString()}
                    </div>
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
              ))
            )}
          </div>
        ) : (
          // Table View
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-card-foreground mb-4">
              Expenses Table ({filteredExpenses.length})
            </h4>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading expenses...
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invoice</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredExpenses.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                            No expenses found. Create your first expense!
                          </td>
                        </tr>
                      ) : (
                        filteredExpenses.map((expense) => (
                          <tr key={expense.id} className="hover:bg-muted/50">
                            <td className="px-4 py-3 text-sm text-card-foreground">
                              {new Date(expense.payment_date || expense.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-card-foreground">
                              <div className="max-w-xs truncate" title={expense.description}>
                                {expense.description}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-card-foreground capitalize">
                              {expense.category}
                            </td>
                            <td className="px-4 py-3 text-sm text-card-foreground text-right font-medium">
                              ₺{expense.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs border inline-flex items-center gap-1 ${getStatusColor(expense.payment_status)}`}>
                                {getStatusIcon(expense.payment_status)}
                                <span className="capitalize">{expense.payment_status}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-card-foreground">
                              {expense.receipt_number || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center justify-center gap-1">
                                <button className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-muted-foreground hover:text-red-600 rounded transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Expense Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">Create New Expense</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={createForm.date}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Amount (₺) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.amount}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Payment Method
                  </label>
                  <select
                    value={createForm.payment_method}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, payment_method: e.target.value as any }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_payment">Mobile Payment</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={createForm.description}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter expense description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Payment Status
                  </label>
                  <select
                    value={createForm.payment_status}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, payment_status: e.target.value as any }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={createForm.invoice_number}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, invoice_number: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Optional invoice number..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Notes
                  </label>
                  <textarea
                    value={createForm.notes}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-2.5 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExpense}
                  disabled={loading || !createForm.description || createForm.amount <= 0}
                  className="flex-1 px-6 py-2.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Creating...' : 'Create Expense'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WindowContainer>
  );
}
