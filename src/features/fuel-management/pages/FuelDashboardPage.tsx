import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gauge, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  BarChart3,
  Target,
  Database,
  DollarSign,
  Fuel,
  Settings
} from 'lucide-react';
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface DashboardModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const dashboardModules: DashboardModule[] = [
  {
    id: 'performance',
    title: 'Performance Metrics',
    description: 'Real-time operational performance indicators and key metrics',
    path: '/fuel/dashboard/performance',
    color: '#43E6A0',
    icon: TrendingUp
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Detailed analytics and business intelligence reports',
    path: '/fuel/dashboard/analytics',
    color: '#4F8CFF',
    icon: BarChart3
  },
  {
    id: 'monitoring',
    title: 'Live Monitoring',
    description: 'Real-time system status and operational monitoring',
    path: '/fuel/dashboard/monitoring',
    color: '#6C63FF',
    icon: Activity
  },
  {
    id: 'alerts',
    title: 'System Alerts',
    description: 'Critical notifications and maintenance reminders',
    path: '/fuel/dashboard/alerts',
    color: '#FFA500',
    icon: AlertTriangle
  },
  {
    id: 'inventory',
    title: 'Inventory Overview',
    description: 'Stock levels, tank status, and inventory management',
    path: '/fuel/dashboard/inventory',
    color: '#FF6584',
    icon: Database
  },
  {
    id: 'sales',
    title: 'Sales Overview',
    description: 'Daily sales performance and revenue tracking',
    path: '/fuel/dashboard/sales',
    color: '#9D4EDD',
    icon: DollarSign
  },
  {
    id: 'fuel-status',
    title: 'Fuel Status',
    description: 'Current fuel levels and distribution status',
    path: '/fuel/dashboard/fuel-status',
    color: '#20B2AA',
    icon: Fuel
  },
  {
    id: 'targets',
    title: 'Goals & Targets',
    description: 'Track progress towards operational and financial goals',
    path: '/fuel/dashboard/targets',
    color: '#FFD700',
    icon: Target
  },
  {
    id: 'system-status',
    title: 'System Status',
    description: 'Overall system health and configuration status',
    path: '/fuel/dashboard/system',
    color: '#32CD32',
    icon: Settings
  }
];

export default function FuelDashboardPage() {
  return (
    <div className="management-container">
      <Breadcrumb 
        items={[
          { label: 'Fuel Operations', href: '/fuel' },
          { label: 'Operations Dashboard' }
        ]}
      />
      <h1 className="management-title">Operations Dashboard</h1>
      <p className="management-desc">
        Real-time overview of fuel operations, analytics, and key performance indicators for comprehensive business monitoring.
      </p>
      <div className="management-cards">
        {dashboardModules.map((module) => (
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