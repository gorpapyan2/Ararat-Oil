import React from 'react';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Calendar, 
  LineChart, 
  PieChart,
  DollarSign,
  Users,
  Activity,
  Target,
  Download,
  Share,
  Zap,
  Settings,
  Eye,
  Database,
  Clock,
  Shield,
  Bell,
  Cpu
} from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { ModuleCard, StatsCard } from '@/shared/components/cards';

interface ReportsModule {
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

const reportsModules: ReportsModule[] = [
  // Core Reports
  {
    id: 'financial-overview',
    title: 'Financial Overview',
    description: 'Comprehensive financial reports including revenue, expenses, and profit analysis.',
    path: '/reports/financial',
    icon: DollarSign,
    category: 'Core Reports',
    badge: 'Core',
    stats: { count: '24 Reports', label: 'This Month' },
    color: 'border-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-500/5 to-emerald-500/10',
    iconGradient: 'from-emerald-500/80 to-emerald-500',
    textColor: 'text-emerald-600'
  },
  {
    id: 'operational-dashboard',
    title: 'Operations Dashboard',
    description: 'Real-time operational metrics, KPIs, and performance indicators.',
    path: '/reports/operations',
    icon: Activity,
    category: 'Core Reports',
    badge: 'Live',
    stats: { count: '98.5%', label: 'Efficiency' },
    color: 'border-blue-500/30',
    bgGradient: 'bg-gradient-to-br from-blue-500/5 to-blue-500/10',
    iconGradient: 'from-blue-500/80 to-blue-500',
    textColor: 'text-blue-600'
  },
  {
    id: 'business-intelligence',
    title: 'Business Intelligence',
    description: 'Strategic insights, executive dashboards, and business analytics.',
    path: '/reports/bi',
    icon: PieChart,
    category: 'Core Reports',
    badge: 'Important',
    stats: { count: '8 Dashboards', label: 'Active' },
    color: 'border-purple-500/30',
    bgGradient: 'bg-gradient-to-br from-purple-500/5 to-purple-500/10',
    iconGradient: 'from-purple-500/80 to-purple-500',
    textColor: 'text-purple-600'
  },
  {
    id: 'charts',
    title: 'Interactive Charts',
    description: 'Dynamic charts, graphs, and visual data representations.',
    path: '/reports/charts',
    icon: BarChart3,
    category: 'Core Reports',
    stats: { count: '156 Charts', label: 'Available' },
    color: 'border-cyan-500/30',
    bgGradient: 'bg-gradient-to-br from-cyan-500/5 to-cyan-500/10',
    iconGradient: 'from-cyan-500/80 to-cyan-500',
    textColor: 'text-cyan-600'
  },

  // Analytics & Intelligence
  {
    id: 'revenue-analytics',
    title: 'Revenue Analytics',
    description: 'Detailed revenue tracking, trends, and forecasting reports.',
    path: '/reports/revenue',
    icon: TrendingUp,
    category: 'Analytics & Intelligence',
    badge: 'Analytics',
    stats: { count: '+12.5%', label: 'Growth Rate' },
    color: 'border-green-500/30',
    bgGradient: 'bg-gradient-to-br from-green-500/5 to-green-500/10',
    iconGradient: 'from-green-500/80 to-green-500',
    textColor: 'text-green-600'
  },
  {
    id: 'trend-analysis',
    title: 'Trend Analysis',
    description: 'Historical trends, pattern recognition, and predictive analytics.',
    path: '/reports/trends',
    icon: LineChart,
    category: 'Analytics & Intelligence',
    badge: 'AI',
    stats: { count: '94.3%', label: 'Accuracy' },
    color: 'border-indigo-500/30',
    bgGradient: 'bg-gradient-to-br from-indigo-500/5 to-indigo-500/10',
    iconGradient: 'from-indigo-500/80 to-indigo-500',
    textColor: 'text-indigo-600'
  },
  {
    id: 'fuel-consumption',
    title: 'Fuel Analytics',
    description: 'Fuel consumption patterns, efficiency metrics, and cost analysis.',
    path: '/reports/fuel',
    icon: Target,
    category: 'Analytics & Intelligence',
    badge: 'New',
    stats: { count: '1,245L', label: 'Daily Avg' },
    color: 'border-orange-500/30',
    bgGradient: 'bg-gradient-to-br from-orange-500/5 to-orange-500/10',
    iconGradient: 'from-orange-500/80 to-orange-500',
    textColor: 'text-orange-600'
  },
  {
    id: 'productivity',
    title: 'Productivity Reports',
    description: 'Employee productivity metrics, shift analysis, and performance trends.',
    path: '/reports/productivity',
    icon: Users,
    category: 'Analytics & Intelligence',
    stats: { count: '89 Users', label: 'Active' },
    color: 'border-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-teal-500/5 to-teal-500/10',
    iconGradient: 'from-teal-500/80 to-teal-500',
    textColor: 'text-teal-600'
  },
  {
    id: 'performance-metrics',
    title: 'Performance Metrics',
    description: 'Advanced performance indicators, benchmarking, and efficiency analysis.',
    path: '/reports/performance',
    icon: Zap,
    category: 'Analytics & Intelligence',
    badge: 'Analytics',
    stats: { count: '97.8%', label: 'System Uptime' },
    color: 'border-yellow-500/30',
    bgGradient: 'bg-gradient-to-br from-yellow-500/5 to-yellow-500/10',
    iconGradient: 'from-yellow-500/80 to-yellow-500',
    textColor: 'text-yellow-600'
  },

  // Automation & Tools
  {
    id: 'scheduled-reports',
    title: 'Scheduled Reports',
    description: 'Automated report generation, delivery, and scheduling system.',
    path: '/reports/scheduled',
    icon: Calendar,
    category: 'Automation & Tools',
    badge: 'Auto',
    stats: { count: '18 Active', label: 'Schedules' },
    color: 'border-rose-500/30',
    bgGradient: 'bg-gradient-to-br from-rose-500/5 to-rose-500/10',
    iconGradient: 'from-rose-500/80 to-rose-500',
    textColor: 'text-rose-600'
  },
  {
    id: 'export-tools',
    title: 'Export & Sharing',
    description: 'Export reports in various formats and share with stakeholders.',
    path: '/reports/export',
    icon: Download,
    category: 'Automation & Tools',
    stats: { count: '2.4K', label: 'Downloads' },
    color: 'border-violet-500/30',
    bgGradient: 'bg-gradient-to-br from-violet-500/5 to-violet-500/10',
    iconGradient: 'from-violet-500/80 to-violet-500',
    textColor: 'text-violet-600'
  },
  {
    id: 'real-time-monitoring',
    title: 'Real-time Monitoring',
    description: 'Live data streams, real-time alerts, and continuous monitoring dashboards.',
    path: '/reports/monitoring',
    icon: Eye,
    category: 'Automation & Tools',
    badge: 'Live',
    stats: { count: '24/7', label: 'Monitoring' },
    color: 'border-pink-500/30',
    bgGradient: 'bg-gradient-to-br from-pink-500/5 to-pink-500/10',
    iconGradient: 'from-pink-500/80 to-pink-500',
    textColor: 'text-pink-600'
  },
  {
    id: 'data-integration',
    title: 'Data Integration',
    description: 'Connect external data sources, APIs, and third-party systems.',
    path: '/reports/integration',
    icon: Database,
    category: 'Automation & Tools',
    badge: 'Integration',
    stats: { count: '12 Sources', label: 'Connected' },
    color: 'border-slate-500/30',
    bgGradient: 'bg-gradient-to-br from-slate-500/5 to-slate-500/10',
    iconGradient: 'from-slate-500/80 to-slate-500',
    textColor: 'text-slate-600'
  },

  // Compliance & Security
  {
    id: 'compliance-reports',
    title: 'Compliance Reports',
    description: 'Regulatory compliance, safety metrics, and audit trail reports.',
    path: '/reports/compliance',
    icon: Shield,
    category: 'Compliance & Security',
    badge: 'Important',
    stats: { count: '100%', label: 'Compliant' },
    color: 'border-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-500/5 to-emerald-500/10',
    iconGradient: 'from-emerald-500/80 to-emerald-500',
    textColor: 'text-emerald-600'
  },
  {
    id: 'audit-trails',
    title: 'Audit Trails',
    description: 'Comprehensive audit logs, change tracking, and security compliance.',
    path: '/reports/audit',
    icon: FileText,
    category: 'Compliance & Security',
    stats: { count: '15.2K', label: 'Log Entries' },
    color: 'border-gray-500/30',
    bgGradient: 'bg-gradient-to-br from-gray-500/5 to-gray-500/10',
    iconGradient: 'from-gray-500/80 to-gray-500',
    textColor: 'text-gray-600'
  },
  {
    id: 'alerts-notifications',
    title: 'Alerts & Notifications',
    description: 'Smart alerts, threshold monitoring, and notification management.',
    path: '/reports/alerts',
    icon: Bell,
    category: 'Compliance & Security',
    badge: 'Smart',
    stats: { count: '5 Active', label: 'Alerts' },
    color: 'border-amber-500/30',
    bgGradient: 'bg-gradient-to-br from-amber-500/5 to-amber-500/10',
    iconGradient: 'from-amber-500/80 to-amber-500',
    textColor: 'text-amber-600'
  },
  {
    id: 'report-settings',
    title: 'Report Settings',
    description: 'Configure report parameters, user permissions, and system preferences.',
    path: '/reports/settings',
    icon: Settings,
    category: 'Compliance & Security',
    stats: { count: '23 Configs', label: 'Active' },
    color: 'border-zinc-500/30',
    bgGradient: 'bg-gradient-to-br from-zinc-500/5 to-zinc-500/10',
    iconGradient: 'from-zinc-500/80 to-zinc-500',
    textColor: 'text-zinc-600'
  }
];

export const ReportsPage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Reports', href: '/reports' }
  ];

  // Group modules by category
  const groupedModules = reportsModules.reduce((acc, module) => {
    const category = module.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, ReportsModule[]>);

  const quickStats = [
    {
      title: 'Reports',
      value: '1,245',
      icon: FileText,
      color: 'from-blue-500/80 to-blue-500',
      description: '↗ +18% this month'
    },
    {
      title: 'Dashboards',
      value: '24',
      icon: BarChart3,
      color: 'from-green-500/80 to-green-500',
      description: '✓ Real-time updates'
    },
    {
      title: 'Accuracy',
      value: '98.7%',
      icon: TrendingUp,
      color: 'from-purple-500/80 to-purple-500',
      description: '↗ High precision'
    },
    {
      title: 'Users',
      value: '89',
      icon: Users,
      color: 'from-amber-500/80 to-amber-500',
      description: '↗ +12 this week'
    }
  ];

  return (
    <WindowContainer
      title="Reports & Analytics"
      subtitle="Comprehensive reporting suite for data analysis, business intelligence, and performance monitoring"
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

      {/* Reports Modules */}
      <div className="space-y-8">
        {Object.entries(groupedModules).map(([category, modules]) => (
          <div key={category}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-[#EEEFE7] mb-2">
                {category}
              </h2>
              <div className="h-px bg-gradient-to-r from-blue-500 via-purple-500 to-transparent dark:from-blue-400 dark:via-purple-400 dark:to-transparent"></div>
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
}; 