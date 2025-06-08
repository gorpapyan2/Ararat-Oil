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
  disabled?: boolean;
}

const managementModules: ManagementModule[] = [
  // Operations Management
  {
    id: 'shifts',
    title: 'Sifts Management',
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
    id: 'operations',
    title: 'Operations Center',
    description: 'Central hub for daily operations, workflow management, and process optimization.',
    path: '/management/operations',
    icon: Briefcase,
    category: 'Operations Management',
    badge: 'TBD',
    stats: { count: 'Coming', label: 'Soon' },
    color: 'border-gray-400/30',
    bgGradient: 'bg-gradient-to-br from-gray-400/5 to-gray-400/10',
    iconGradient: 'from-gray-400/80 to-gray-400',
    textColor: 'text-gray-400',
    disabled: true
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

  // Finance & Reporting
  {
    id: 'budgeting',
    title: 'Budget Management',
    description: 'Plan and track departmental budgets, expense allocations, and financial planning.',
    path: '/management/budgeting',
    icon: Calculator,
    category: 'Finance & Reporting',
    badge: 'TBD',
    stats: { count: 'Coming', label: 'Soon' },
    color: 'border-gray-400/30',
    bgGradient: 'bg-gradient-to-br from-gray-400/5 to-gray-400/10',
    iconGradient: 'from-gray-400/80 to-gray-400',
    textColor: 'text-gray-400',
    disabled: true
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
                  disabled={module.disabled}
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
