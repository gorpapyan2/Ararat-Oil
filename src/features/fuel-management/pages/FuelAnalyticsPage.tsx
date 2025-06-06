import React from 'react';
import { 
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Target,
  DollarSign,
  Clock,
  Database
} from 'lucide-react';
import { Breadcrumb } from "@/shared/components/layout/Breadcrumb";
import { NavigationCard } from "@/shared/components/navigation/NavigationCard";

interface AnalyticsModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const analyticsModules: AnalyticsModule[] = [
  {
    id: 'consumption-analytics',
    title: 'Consumption Analytics',
    description: 'Fuel consumption patterns and efficiency analysis',
    path: '/fuel/analytics/consumption',
    color: '#43E6A0',
    icon: BarChart3
  },
  {
    id: 'performance-metrics',
    title: 'Performance Metrics',
    description: 'Real-time performance indicators and KPIs',
    path: '/fuel/analytics/performance',
    color: '#4F8CFF',
    icon: TrendingUp
  },
  {
    id: 'cost-analysis',
    title: 'Cost Analysis',
    description: 'Fuel cost optimization and budget analysis',
    path: '/fuel/analytics/costs',
    color: '#6C63FF',
    icon: DollarSign
  },
  {
    id: 'efficiency-tracking',
    title: 'Efficiency Tracking',
    description: 'System efficiency and optimization insights',
    path: '/fuel/analytics/efficiency',
    color: '#FFA500',
    icon: Target
  },
  {
    id: 'usage-patterns',
    title: 'Usage Patterns',
    description: 'Fuel usage trends and seasonal analysis',
    path: '/fuel/analytics/patterns',
    color: '#FF6584',
    icon: PieChart
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics',
    description: 'Forecasting and demand prediction models',
    path: '/fuel/analytics/predictive',
    color: '#9D4EDD',
    icon: Activity
  },
  {
    id: 'historical-data',
    title: 'Historical Data',
    description: 'Long-term data analysis and reporting',
    path: '/fuel/analytics/historical',
    color: '#20B2AA',
    icon: Database
  },
  {
    id: 'real-time-monitoring',
    title: 'Real-time Monitoring',
    description: 'Live analytics and instant insights',
    path: '/fuel/analytics/realtime',
    color: '#32CD32',
    icon: Clock
  }
];

export default function FuelAnalyticsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fuel Operations', href: '/fuel' },
    { label: 'Analytics', href: '/fuel/analytics' }
  ];

  return (
    <div className="subnav-container">
      <div className="subnav-card-window">
        {/* Header with Breadcrumb */}
        <div className="subnav-header">
          <div className="subnav-header-content">
            <div className="subnav-breadcrumb">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="subnav-body">
          <div className="subnav-content">
            {/* Page Title Section */}
            <div className="page-title-section">
              <h1 className="page-title">
                Fuel Analytics & Insights
              </h1>
              <p className="page-description">
                Advanced analytics and insights for fuel consumption, efficiency, and cost optimization.
              </p>
            </div>

            {/* Module Cards */}
            <div className="management-cards">
              {analyticsModules.map((module) => (
                <NavigationCard
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  href={module.path}
                  color={module.color}
                  icon={module.icon}
                  variant="management"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 