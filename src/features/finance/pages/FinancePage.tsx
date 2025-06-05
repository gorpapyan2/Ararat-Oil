import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Receipt, 
  TrendingDown, 
  BarChart3, 
  CreditCard, 
  FileText,
  Calculator,
  PieChart
} from 'lucide-react';
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface FinanceModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const financeModules: FinanceModule[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Financial overview and key performance indicators',
    path: '/finance/dashboard',
    color: '#43E6A0',
    icon: BarChart3
  },
  {
    id: 'sales',
    title: 'Sales',
    description: 'Revenue tracking and sales transaction management',
    path: '/finance/sales',
    color: '#4F8CFF',
    icon: DollarSign
  },
  {
    id: 'expenses',
    title: 'Expenses',
    description: 'Business expense tracking and cost management',
    path: '/finance/expenses',
    color: '#6C63FF',
    icon: TrendingDown
  },
  {
    id: 'revenue',
    title: 'Revenue',
    description: 'Income analysis and revenue stream monitoring',
    path: '/finance/revenue',
    color: '#FFA500',
    icon: Receipt
  },
  {
    id: 'payment-methods',
    title: 'Payment Methods',
    description: 'Payment processing and transaction methods',
    path: '/finance/payment-methods',
    color: '#FF6584',
    icon: CreditCard
  },
  {
    id: 'shifts',
    title: 'Shifts',
    description: 'Work shift management and cash handling',
    path: '/finance/shifts',
    color: '#9D4EDD',
    icon: FileText
  },
  {
    id: 'profit-loss',
    title: 'Profit & Loss',
    description: 'Financial performance analysis and reporting',
    path: '/finance/profit-loss',
    color: '#20B2AA',
    icon: PieChart
  },
  {
    id: 'reports',
    title: 'Financial Reports',
    description: 'Comprehensive financial reports and analytics',
    path: '/finance/reports',
    color: '#32CD32',
    icon: Calculator
  }
];

export function FinancePage() {
  return (
    <div className="management-container">
      <Breadcrumb 
        items={[{ label: 'Financial Management' }]}
      />
      <h1 className="management-title">Financial Management Dashboard</h1>
      <p className="management-desc">
        Comprehensive financial tracking, budgeting, and analytics for complete business financial oversight and strategic planning.
      </p>
      <div className="management-cards">
        {financeModules.map((module) => (
          <NavigationCard
            key={module.id}
            title={module.title}
            href={module.path}
            color={module.color}
            icon={module.icon}
            variant="management"
          />
        ))}
      </div>
    </div>
  );
}
