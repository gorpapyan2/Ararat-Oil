import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Settings, 
  Shield,
  FileText,
  Calculator,
  Clock,
  Target,
  Award,
  Briefcase,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';
import { cn } from '@/shared/utils';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { ModuleCard, StatsCard } from '@/shared/components/cards';

interface ManagementModule {
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

const managementModules: ManagementModule[] = [
  // Executive Dashboard
  {
    id: 'dashboard',
    title: 'Management Dashboard',
    description: 'Comprehensive overview of operations, key performance indicators, and management analytics.',
    path: '/management/dashboard',
    icon: BarChart3,
    category: 'Executive Dashboard',
    badge: 'Important',
    stats: { count: '98.5%', label: 'Operational Efficiency' },
    color: 'border-black/30',
    bgGradient: 'bg-gradient-to-br from-black/5 to-black/10',
    iconGradient: 'from-black/80 to-black',
    textColor: 'text-black'
  },
  {
    id: 'performance',
    title: 'Performance Analytics',
    description: 'Track team performance, productivity metrics, and operational efficiency indicators.',
    path: '/management/performance',
    icon: TrendingUp,
    category: 'Executive Dashboard',
    badge: 'New',
    stats: { count: '24.6%', label: 'Performance Increase' },
    color: 'border-[#E3E263]/30',
    bgGradient: 'bg-gradient-to-br from-[#E3E263]/5 to-[#E3E263]/10',
    iconGradient: 'from-[#E3E263]/80 to-[#E3E263]',
    textColor: 'text-[#E3E263]'
  },
  {
    id: 'objectives',
    title: 'Strategic Objectives',
    description: 'Set and track strategic goals, KPIs, and organizational performance targets.',
    path: '/management/objectives',
    icon: Target,
    category: 'Executive Dashboard',
    badge: 'New',
    stats: { count: '12 Goals', label: 'Active Targets' },
    color: 'border-[#A6A698]/30',
    bgGradient: 'bg-gradient-to-br from-[#A6A698]/5 to-[#A6A698]/10',
    iconGradient: 'from-[#A6A698]/80 to-[#A6A698]',
    textColor: 'text-[#A6A698]'
  },

  // Operations Management
  {
    id: 'operations',
    title: 'Operations Center',
    description: 'Central hub for daily operations, workflow management, and process optimization.',
    path: '/management/operations',
    icon: Briefcase,
    category: 'Operations Management',
    badge: 'Important',
    stats: { count: '15 Tasks', label: 'Pending Actions' },
    color: 'border-black/30',
    bgGradient: 'bg-gradient-to-br from-black/5 to-black/10',
    iconGradient: 'from-black/80 to-black',
    textColor: 'text-black'
  },
  {
    id: 'shifts',
    title: 'Shifts Management',
    description: 'Manage work shifts, opening/closing procedures, and shift-based operations.',
    path: '/management/shifts',
    icon: Clock,
    category: 'Operations Management',
    badge: 'Live',
    stats: { count: 'Active 5', label: 'Current Shifts' },
    color: 'border-[#E3E263]/30',
    bgGradient: 'bg-gradient-to-br from-[#E3E263]/5 to-[#E3E263]/10',
    iconGradient: 'from-[#E3E263]/80 to-[#E3E263]',
    textColor: 'text-[#E3E263]'
  },
  {
    id: 'quality',
    title: 'Quality Management',
    description: 'Quality assurance processes, standards compliance, and continuous improvement.',
    path: '/management/quality',
    icon: Award,
    category: 'Operations Management',
    stats: { count: '96%', label: 'Quality Score' },
    color: 'border-[#717181]/30',
    bgGradient: 'bg-gradient-to-br from-[#717181]/5 to-[#717181]/10',
    iconGradient: 'from-[#717181]/80 to-[#717181]',
    textColor: 'text-[#717181]'
  },

  // Human Resources
  {
    id: 'employees',
    title: 'Employee Management',
    description: 'Human resources management, staff scheduling, and employee performance tracking.',
    path: '/management/employees',
    icon: Users,
    category: 'Human Resources',
    badge: 'Core',
    stats: { count: '24 Staff', label: 'Active Employees' },
    color: 'border-black/30',
    bgGradient: 'bg-gradient-to-br from-black/5 to-black/10',
    iconGradient: 'from-black/80 to-black',
    textColor: 'text-black'
  },
  {
    id: 'security',
    title: 'Security & Access',
    description: 'Manage access controls, security protocols, and user permissions across systems.',
    path: '/management/security',
    icon: Shield,
    category: 'Human Resources',
    badge: 'Important',
    stats: { count: 'All Secure', label: 'System Status' },
    color: 'border-[#57575E]/30',
    bgGradient: 'bg-gradient-to-br from-[#57575E]/5 to-[#57575E]/10',
    iconGradient: 'from-[#57575E]/80 to-[#57575E]',
    textColor: 'text-[#57575E]'
  },
  {
    id: 'compliance',
    title: 'Compliance Monitoring',
    description: 'Ensure regulatory compliance, audit management, and policy adherence tracking.',
    path: '/management/compliance',
    icon: UserCheck,
    category: 'Human Resources',
    stats: { count: '100%', label: 'Compliance Rate' },
    color: 'border-[#A6A698]/30',
    bgGradient: 'bg-gradient-to-br from-[#A6A698]/5 to-[#A6A698]/10',
    iconGradient: 'from-[#A6A698]/80 to-[#A6A698]',
    textColor: 'text-[#A6A698]'
  },

  // Finance & Reporting
  {
    id: 'budgeting',
    title: 'Budget Management',
    description: 'Plan and track departmental budgets, expense allocations, and financial planning.',
    path: '/management/budgeting',
    icon: Calculator,
    category: 'Finance & Reporting',
    badge: 'New',
    stats: { count: '$2.4M', label: 'Budget Managed' },
    color: 'border-black/30',
    bgGradient: 'bg-gradient-to-br from-black/5 to-black/10',
    iconGradient: 'from-black/80 to-black',
    textColor: 'text-black'
  },
  {
    id: 'reports',
    title: 'Management Reports',
    description: 'Generate comprehensive reports on operations, finance, and strategic performance.',
    path: '/management/reports',
    icon: FileText,
    category: 'Finance & Reporting',
    badge: 'Analytics',
    stats: { count: '12 New', label: 'Reports Ready' },
    color: 'border-[#717181]/30',
    bgGradient: 'bg-gradient-to-br from-[#717181]/5 to-[#717181]/10',
    iconGradient: 'from-[#717181]/80 to-[#717181]',
    textColor: 'text-[#717181]'
  },
  {
    id: 'settings',
    title: 'Management Settings',
    description: 'Configure management system parameters, preferences, and organizational settings.',
    path: '/management/settings',
    icon: Settings,
    category: 'Finance & Reporting',
    badge: 'Admin',
    stats: { count: '2 Updates', label: 'Available' },
    color: 'border-[#57575E]/30',
    bgGradient: 'bg-gradient-to-br from-[#57575E]/5 to-[#57575E]/10',
    iconGradient: 'from-[#57575E]/80 to-[#57575E]',
    textColor: 'text-[#57575E]'
  }
];

const ManagementPage = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Management', href: '/management' }
  ];

  // Group modules by category
  const groupedModules = managementModules.reduce((acc, module) => {
    const category = module.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, ManagementModule[]>);

  const quickStats = [
    {
      title: 'Efficiency',
      value: '98.5%',
      icon: BarChart3,
      color: 'from-black/80 to-black',
      description: '↗ +2.3%'
    },
    {
      title: 'Employees',
      value: '156',
      icon: Users,
      color: 'from-[#E3E263]/80 to-[#E3E263]',
      description: '↗ +8'
    },
    {
      title: 'Budget',
      value: '$2.4M',
      icon: Calculator,
      color: 'from-[#A6A698]/80 to-[#A6A698]',
      description: '↗ Well'
    },
    {
      title: 'Growth',
      value: '24.6%',
      icon: TrendingUp,
      color: 'from-[#717181]/80 to-[#717181]',
      description: '↗ Up'
    }
  ];

  return (
    <WindowContainer
      title="Management Center"
      subtitle="Centralized management platform for operational excellence"
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

      {/* Management Modules */}
      <div className="space-y-8">
        {Object.entries(groupedModules).map(([category, modules]) => (
          <div key={category}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-[#EEEFE7] mb-2">
                {category}
              </h2>
              <div className="h-px bg-gradient-to-r from-black via-[#717181] to-transparent dark:from-[#717181] dark:via-[#A6A698] dark:to-transparent"></div>
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

export default ManagementPage; 