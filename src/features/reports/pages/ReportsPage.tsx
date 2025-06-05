import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart,
  FileText,
  LineChart,
  DollarSign,
  Fuel,
  Users,
  Target,
  Calendar
} from 'lucide-react';
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface ReportsModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const reportsModules: ReportsModule[] = [
  {
    id: 'sales-reports',
    title: 'Sales Reports',
    description: 'Comprehensive sales analysis and performance metrics',
    path: '/reports/sales',
    color: '#43E6A0',
    icon: BarChart3
  },
  {
    id: 'financial-reports',
    title: 'Financial Reports',
    description: 'Revenue, expenses, profit margins, and financial health',
    path: '/reports/financial',
    color: '#4F8CFF',
    icon: DollarSign
  },
  {
    id: 'fuel-reports',
    title: 'Fuel Reports',
    description: 'Tank levels, consumption patterns, and supply forecasts',
    path: '/reports/fuel',
    color: '#6C63FF',
    icon: Fuel
  },
  {
    id: 'customer-analytics',
    title: 'Customer Analytics',
    description: 'Customer behavior, loyalty metrics, and segmentation',
    path: '/reports/customers',
    color: '#FFA500',
    icon: Users
  },
  {
    id: 'operational-reports',
    title: 'Operational Reports',
    description: 'System performance, uptime, and productivity metrics',
    path: '/reports/operations',
    color: '#FF6584',
    icon: Target
  },
  {
    id: 'trend-analysis',
    title: 'Trend Analysis',
    description: 'Market trends, forecasting, and predictive analytics',
    path: '/reports/trends',
    color: '#9D4EDD',
    icon: TrendingUp
  },
  {
    id: 'performance-charts',
    title: 'Performance Charts',
    description: 'Interactive charts and data visualizations',
    path: '/reports/charts',
    color: '#20B2AA',
    icon: LineChart
  },
  {
    id: 'business-intelligence',
    title: 'Business Intelligence',
    description: 'Strategic insights and executive dashboards',
    path: '/reports/bi',
    color: '#32CD32',
    icon: PieChart
  },
  {
    id: 'scheduled-reports',
    title: 'Scheduled Reports',
    description: 'Automated report generation and delivery',
    path: '/reports/scheduled',
    color: '#FFD700',
    icon: Calendar
  },
  {
    id: 'compliance-reports',
    title: 'Compliance Reports',
    description: 'Regulatory compliance, safety metrics, and audit trails',
    path: '/reports/compliance',
    color: '#FF69B4',
    icon: FileText
  }
];

export function ReportsPage() {
  return (
    <div className="management-container">
      <Breadcrumb 
        items={[{ label: 'Business Intelligence' }]}
      />
      <h1 className="management-title">Business Reports & Analytics</h1>
      <p className="management-desc">
        Data analytics, reporting, and performance insights for comprehensive business intelligence and strategic decision-making.
      </p>
      <div className="management-cards">
        {reportsModules.map((module) => (
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