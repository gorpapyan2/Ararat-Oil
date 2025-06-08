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
  disabled?: boolean;
}

const financeModules: FinanceModule[] = [
  // Active Finance Modules
  {
    id: 'expense-management',
    title: 'Expense Management',
    description: 'Monitor and categorize business expenses, operational costs, and overhead.',
    path: '/finance/expenses',
    icon: TrendingDown,
    category: 'Financial Management',
    badge: 'Core',
    stats: { count: '$1.8M', label: 'Total Expenses' },
    color: 'border-red-500/30',
    bgGradient: 'bg-gradient-to-br from-red-500/5 to-red-500/10',
    iconGradient: 'from-red-500/80 to-red-500',
    textColor: 'text-red-600'
  },
  {
    id: 'sales-management',
    title: 'Sales Management',
    description: 'Track and manage all your sales transactions, customer relationships, and sales performance.',
    path: '/finance/sales',
    icon: Receipt,
    category: 'Financial Management',
    badge: 'Core',
    stats: { count: '$2.4M', label: 'Total Sales' },
    color: 'border-green-500/30',
    bgGradient: 'bg-gradient-to-br from-green-500/5 to-green-500/10',
    iconGradient: 'from-green-500/80 to-green-500',
    textColor: 'text-green-600'
  },
  {
    id: 'revenue-tracking',
    title: 'Revenue Tracking',
    description: 'Monitor income streams, sales performance, and revenue analytics in real-time.',
    path: '/finance/revenue',
    icon: TrendingUp,
    category: 'Financial Management',
    badge: 'Core',
    stats: { count: '$2.4M', label: 'Total Revenue' },
    color: 'border-blue-500/30',
    bgGradient: 'bg-gradient-to-br from-blue-500/5 to-blue-500/10',
    iconGradient: 'from-blue-500/80 to-blue-500',
    textColor: 'text-blue-600'
  },
  {
    id: 'payment-methods',
    title: 'Payment Methods',
    description: 'Manage payment processing options, gateway integration, and transaction methods.',
    path: '/finance/payment-methods',
    icon: CreditCard,
    category: 'Financial Management',
    badge: 'Core',
    stats: { count: '1,247', label: 'Transactions' },
    color: 'border-purple-500/30',
    bgGradient: 'bg-gradient-to-br from-purple-500/5 to-purple-500/10',
    iconGradient: 'from-purple-500/80 to-purple-500',
    textColor: 'text-purple-600'
  },

  // Future Features - Disabled TBD
  {
    id: 'profit-loss-analysis',
    title: 'Profit & Loss Analysis',
    description: 'P&L statements, profit margin analysis, and profitability tracking.',
    path: '/finance/pl-analysis',
    icon: ChartPie,
    category: 'Future Features',
    badge: 'TBD',
    stats: { count: 'Coming Soon', label: 'Feature' },
    color: 'border-gray-400/30',
    bgGradient: 'bg-gradient-to-br from-gray-400/5 to-gray-400/10',
    iconGradient: 'from-gray-400/60 to-gray-400',
    textColor: 'text-gray-500',
    disabled: true
  },
  {
    id: 'debts-management',
    title: 'Debts Management',
    description: 'Track debts, payment schedules, and liability management.',
    path: '/finance/debts',
    icon: Banknote,
    category: 'Future Features',
    badge: 'TBD',
    stats: { count: 'Coming Soon', label: 'Feature' },
    color: 'border-gray-400/30',
    bgGradient: 'bg-gradient-to-br from-gray-400/5 to-gray-400/10',
    iconGradient: 'from-gray-400/60 to-gray-400',
    textColor: 'text-gray-500',
    disabled: true
  },
  {
    id: 'tax-management',
    title: 'Tax Management',
    description: 'Tax calculations, compliance tracking, and automated tax reporting.',
    path: '/finance/taxes',
    icon: Percent,
    category: 'Future Features',
    badge: 'TBD',
    stats: { count: 'Coming Soon', label: 'Feature' },
    color: 'border-gray-400/30',
    bgGradient: 'bg-gradient-to-br from-gray-400/5 to-gray-400/10',
    iconGradient: 'from-gray-400/60 to-gray-400',
    textColor: 'text-gray-500',
    disabled: true
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
                  disabled={module.disabled}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </WindowContainer>
  );
}
