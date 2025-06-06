import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  CreditCard, 
  Receipt, 
  Wallet,
  Building,
  TrendingDown,
  Calculator,
  FileText,
  Target,
  Users,
  Percent,
  Activity,
  Shield,
  Banknote,
  HandCoins,
  ChartPie
} from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { ModuleCard, StatsCard } from '@/shared/components/cards';

interface FinanceModule {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  category?: string;
  badge?: string;
  stats?: {
    count: string;
    label: string;
  };
  color: string;
  bgGradient: string;
  iconGradient: string;
  textColor: string;
}

const financeModules: FinanceModule[] = [
  // Revenue & Income
  {
    id: 'revenue-tracking',
    title: 'Revenue Tracking',
    description: 'Monitor income streams, sales performance, and revenue analytics in real-time.',
    path: '/finance/revenue',
    icon: TrendingUp,
    category: 'Revenue & Income',
    badge: 'Core',
    stats: { count: '$2.4M', label: 'Total Revenue' },
    color: 'border-green-500/30',
    bgGradient: 'bg-gradient-to-br from-green-500/5 to-green-500/10',
    iconGradient: 'from-green-500/80 to-green-500',
    textColor: 'text-green-600'
  },
  {
    id: 'cash-flow',
    title: 'Cash Flow Management',
    description: 'Monitor cash inflows and outflows, liquidity analysis, and working capital.',
    path: '/finance/cash-flow',
    icon: DollarSign,
    category: 'Revenue & Income',
    badge: 'Important',
    stats: { count: '+$590K', label: 'Net Flow' },
    color: 'border-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-500/5 to-emerald-500/10',
    iconGradient: 'from-emerald-500/80 to-emerald-500',
    textColor: 'text-emerald-600'
  },
  {
    id: 'profit-analysis',
    title: 'Profit & Loss Analysis',
    description: 'P&L statements, profit margin analysis, and profitability tracking.',
    path: '/finance/pl-analysis',
    icon: ChartPie,
    category: 'Revenue & Income',
    badge: 'Analytics',
    stats: { count: '24.6%', label: 'Profit Margin' },
    color: 'border-blue-500/30',
    bgGradient: 'bg-gradient-to-br from-blue-500/5 to-blue-500/10',
    iconGradient: 'from-blue-500/80 to-blue-500',
    textColor: 'text-blue-600'
  },

  // Expenses & Payments
  {
    id: 'expense-tracking',
    title: 'Expense Management',
    description: 'Monitor and categorize business expenses, operational costs, and overhead.',
    path: '/finance/expenses',
    icon: TrendingDown,
    category: 'Expenses & Payments',
    badge: 'Core',
    stats: { count: '$1.8M', label: 'Total Expenses' },
    color: 'border-red-500/30',
    bgGradient: 'bg-gradient-to-br from-red-500/5 to-red-500/10',
    iconGradient: 'from-red-500/80 to-red-500',
    textColor: 'text-red-600'
  },
  {
    id: 'payment-processing',
    title: 'Payment Processing',
    description: 'Secure payment gateway integration and transaction management.',
    path: '/finance/payments',
    icon: CreditCard,
    category: 'Expenses & Payments',
    badge: 'New',
    stats: { count: '1,247', label: 'Transactions' },
    color: 'border-purple-500/30',
    bgGradient: 'bg-gradient-to-br from-purple-500/5 to-purple-500/10',
    iconGradient: 'from-purple-500/80 to-purple-500',
    textColor: 'text-purple-600'
  },
  {
    id: 'accounts-receivable',
    title: 'Accounts Receivable',
    description: 'Customer payment tracking, aging reports, and collection management.',
    path: '/finance/receivables',
    icon: Banknote,
    category: 'Expenses & Payments',
    stats: { count: '$420K', label: 'Outstanding' },
    color: 'border-orange-500/30',
    bgGradient: 'bg-gradient-to-br from-orange-500/5 to-orange-500/10',
    iconGradient: 'from-orange-500/80 to-orange-500',
    textColor: 'text-orange-600'
  },

  // Budgeting & Planning
  {
    id: 'budget-management',
    title: 'Budget Management',
    description: 'Create budgets, set limits, and monitor spending against targets.',
    path: '/finance/budgets',
    icon: Target,
    category: 'Budgeting & Planning',
    badge: 'Important',
    stats: { count: '18 Budgets', label: 'Active' },
    color: 'border-indigo-500/30',
    bgGradient: 'bg-gradient-to-br from-indigo-500/5 to-indigo-500/10',
    iconGradient: 'from-indigo-500/80 to-indigo-500',
    textColor: 'text-indigo-600'
  },
  {
    id: 'forecasting',
    title: 'Financial Forecasting',
    description: 'Predictive financial modeling, cash flow forecasting, and scenario planning.',
    path: '/finance/forecasting',
    icon: Activity,
    category: 'Budgeting & Planning',
    badge: 'New',
    stats: { count: '12 Models', label: 'Scenarios' },
    color: 'border-cyan-500/30',
    bgGradient: 'bg-gradient-to-br from-cyan-500/5 to-cyan-500/10',
    iconGradient: 'from-cyan-500/80 to-cyan-500',
    textColor: 'text-cyan-600'
  },
  {
    id: 'cost-analysis',
    title: 'Cost Analysis',
    description: 'Detailed cost breakdown, variance analysis, and optimization insights.',
    path: '/finance/cost-analysis',
    icon: Calculator,
    category: 'Budgeting & Planning',
    stats: { count: '8.3%', label: 'Cost Reduction' },
    color: 'border-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-teal-500/5 to-teal-500/10',
    iconGradient: 'from-teal-500/80 to-teal-500',
    textColor: 'text-teal-600'
  },

  // Operations & Billing
  {
    id: 'invoicing',
    title: 'Invoicing & Billing',
    description: 'Create, send, and manage invoices with automated billing and payment tracking.',
    path: '/finance/invoicing',
    icon: Receipt,
    category: 'Operations & Billing',
    badge: 'Core',
    stats: { count: '247', label: 'This Month' },
    color: 'border-amber-500/30',
    bgGradient: 'bg-gradient-to-br from-amber-500/5 to-amber-500/10',
    iconGradient: 'from-amber-500/80 to-amber-500',
    textColor: 'text-amber-600'
  },
  {
    id: 'asset-management',
    title: 'Asset Management',
    description: 'Track fixed assets, depreciation schedules, and asset lifecycle management.',
    path: '/finance/assets',
    icon: Building,
    category: 'Operations & Billing',
    stats: { count: '$3.2M', label: 'Asset Value' },
    color: 'border-slate-500/30',
    bgGradient: 'bg-gradient-to-br from-slate-500/5 to-slate-500/10',
    iconGradient: 'from-slate-500/80 to-slate-500',
    textColor: 'text-slate-600'
  },
  {
    id: 'bank-reconciliation',
    title: 'Bank Reconciliation',
    description: 'Automated bank statement reconciliation and transaction matching.',
    path: '/finance/bank-reconciliation',
    icon: Wallet,
    category: 'Operations & Billing',
    badge: 'Auto',
    stats: { count: '99.8%', label: 'Match Rate' },
    color: 'border-violet-500/30',
    bgGradient: 'bg-gradient-to-br from-violet-500/5 to-violet-500/10',
    iconGradient: 'from-violet-500/80 to-violet-500',
    textColor: 'text-violet-600'
  },

  // Reports & Compliance
  {
    id: 'financial-reports',
    title: 'Financial Reports',
    description: 'Balance sheets, income statements, and comprehensive financial reporting.',
    path: '/finance/reports',
    icon: FileText,
    category: 'Reports & Compliance',
    badge: 'Analytics',
    stats: { count: '45 Reports', label: 'Generated' },
    color: 'border-gray-500/30',
    bgGradient: 'bg-gradient-to-br from-gray-500/5 to-gray-500/10',
    iconGradient: 'from-gray-500/80 to-gray-500',
    textColor: 'text-gray-600'
  },
  {
    id: 'tax-management',
    title: 'Tax Management',
    description: 'Tax calculations, compliance tracking, and automated tax reporting.',
    path: '/finance/taxes',
    icon: Percent,
    category: 'Reports & Compliance',
    badge: 'Important',
    stats: { count: '100%', label: 'Compliant' },
    color: 'border-rose-500/30',
    bgGradient: 'bg-gradient-to-br from-rose-500/5 to-rose-500/10',
    iconGradient: 'from-rose-500/80 to-rose-500',
    textColor: 'text-rose-600'
  },
  {
    id: 'audit-trail',
    title: 'Audit & Compliance',
    description: 'Complete financial audit logs, compliance tracking, and regulatory reporting.',
    path: '/finance/audit',
    icon: Shield,
    category: 'Reports & Compliance',
    badge: 'Security',
    stats: { count: 'All Clear', label: 'Audit Status' },
    color: 'border-stone-500/30',
    bgGradient: 'bg-gradient-to-br from-stone-500/5 to-stone-500/10',
    iconGradient: 'from-stone-500/80 to-stone-500',
    textColor: 'text-stone-600'
  }
];

export function FinancePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Finance & Accounting', href: '/finance' }
  ];

  // Group modules by category
  const groupedModules = financeModules.reduce((acc, module) => {
    const category = module.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, FinanceModule[]>);

  const quickStats = [
    {
      title: 'Revenue',
      value: '$2.4M',
      icon: TrendingUp,
      color: 'from-green-500/80 to-green-500',
      description: '↗ +12.5%'
    },
    {
      title: 'Profit',
      value: '$590K',
      icon: DollarSign,
      color: 'from-blue-500/80 to-blue-500',
      description: '↗ +18.2%'
    },
    {
      title: 'Expenses',
      value: '$1.8M',
      icon: TrendingDown,
      color: 'from-red-500/80 to-red-500',
      description: '↘ -8.3%'
    },
    {
      title: 'Margin',
      value: '24.6%',
      icon: Percent,
      color: 'from-purple-500/80 to-purple-500',
      description: '↗ Excellent'
    }
  ];

  return (
    <WindowContainer
      title="Finance & Accounting"
      subtitle="Comprehensive financial management platform for strategic financial planning"
      breadcrumbItems={breadcrumbItems}
    >
      {/* Quick Stats Overview */}
      <div className="mb-8">
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

      {/* Finance Modules */}
      <div className="space-y-8">
        {Object.entries(groupedModules).map(([category, modules]) => (
          <div key={category}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-[#EEEFE7] mb-2">
                {category}
              </h2>
              <div className="h-px bg-gradient-to-r from-green-500 via-blue-500 to-transparent dark:from-green-400 dark:via-blue-400 dark:to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  path={module.path}
                  icon={module.icon}
                  badge={module.badge}
                  stats={module.stats}
                  color={module.color}
                  bgGradient={module.bgGradient}
                  iconGradient={module.iconGradient}
                  textColor={module.textColor}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </WindowContainer>
  );
}
