/**
 * Navigation Dashboard Page
 * 
 * This is the main dashboard page that provides navigation to all core modules
 * of the Ararat Oil management system. It features:
 * - Modern glass morphism design
 * - Responsive grid layout
 * - Quick action buttons for common tasks
 * - Main module cards for navigation
 * - Armenian language support
 * - Beautiful gradient backgrounds with professional colors
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { 
  Gauge, 
  UserCheck, 
  ShoppingCart, 
  DollarSign, 
  Fuel, 
  FileText, 
  Clock, 
  Users, 
  TrendingUp,
  Settings,
  Building,
  CreditCard,
  Zap,
  Package,
  BarChart3,
  ArrowRight,
  Activity,
  Cog
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import shimmer components
import { 
  ShimmerNavCard, 
  ShimmerStats, 
  ShimmerDashboardCard 
} from '@/shared/components/ui';

interface NavigationModule {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  iconGradient: string;
  textColor: string;
  hoverBg: string;
  stats?: { count: string; label: string };
  badge?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  iconGradient: string;
  textColor: string;
  hoverBg: string;
  priority?: string;
}

// Enhanced module configuration with natural color palette
const moduleConfigurations: { [key: string]: NavigationModule } = {
  management: {
    id: "management",
    title: "Human Resources",
    description: "Employee management, shifts, and operations oversight",
    icon: Users,
    path: "/management",
    stats: { count: "23", label: "Active Staff" },
    color: 'border-fuel-premium/30 hover:border-fuel-premium/50',
    bgGradient: 'bg-gradient-to-br from-fuel-premium/5 to-fuel-premium/10',
    iconGradient: 'bg-gradient-accent',
    textColor: 'text-foreground',
    hoverBg: 'hover:from-fuel-premium/10 hover:to-fuel-premium/15',
    badge: "operational"
  },
  finance: {
    id: "finance",
    title: "Financial Management", 
    description: "Revenue tracking, expenses, and payment processing",
    icon: DollarSign,
    path: "/finance",
    stats: { count: "$24.7k", label: "Today's Revenue" },
    color: 'border-fuel-diesel/30 hover:border-fuel-diesel/50',
    bgGradient: 'bg-gradient-to-br from-fuel-diesel/5 to-fuel-diesel/10',
    iconGradient: 'bg-gradient-to-br from-fuel-diesel to-accent',
    textColor: 'text-foreground',
    hoverBg: 'hover:from-fuel-diesel/10 hover:to-fuel-diesel/15',
    badge: "profitable"
  },
  fuel: {
    id: "fuel",
    title: "Fuel Operations",
    description: "Tank management, fuel types, suppliers, and inventory",
    icon: Fuel,
    path: "/fuel",
    stats: { count: "87%", label: "Avg. Capacity" },
    color: 'border-status-operational/30 hover:border-status-operational/50',
    bgGradient: 'bg-gradient-to-br from-status-operational/5 to-status-operational/10',
    iconGradient: 'bg-gradient-to-br from-status-operational to-status-operational',
    textColor: 'text-foreground',
    hoverBg: 'hover:from-status-operational/10 hover:to-status-operational/15',
    badge: "optimal"
  },
  reports: {
    id: "reports",
    title: "Business Intelligence",
    description: "Analytics, insights, and comprehensive reporting",
    icon: BarChart3,
    path: "/reports",
    stats: { count: "94%", label: "Data Accuracy" },
    color: 'border-accent/30 hover:border-accent/50',
    bgGradient: 'bg-gradient-to-br from-accent/5 to-accent/10',
    iconGradient: 'bg-gradient-to-br from-accent to-primary',
    textColor: 'text-foreground',
    hoverBg: 'hover:from-accent/10 hover:to-accent/15',
    badge: "insights"
  },
  settings: {
    id: "settings",
    title: "System Configuration",
    description: "Application settings, preferences, and system administration",
    icon: Settings,
    path: "/settings",
    stats: { count: "All", label: "Systems Online" },
    color: 'border-secondary/30 hover:border-secondary/50',
    bgGradient: 'bg-gradient-to-br from-secondary/5 to-secondary/10',
    iconGradient: 'bg-gradient-to-br from-secondary to-primary',
    textColor: 'text-foreground',
    hoverBg: 'hover:from-secondary/10 hover:to-secondary/15',
    badge: "secure"
  }
};

// Quick action items with natural colors
const quickActions: QuickAction[] = [
  {
    id: 'new-shift',
    title: 'Start New Shift',
    description: 'Begin a new work shift with automated logging',
    icon: Clock,
    path: '/shifts/new',
    color: 'border-status-operational/30',
    bgGradient: 'bg-gradient-to-br from-status-operational/5 to-status-operational/10',
    iconGradient: 'from-status-operational/80 to-status-operational',
    textColor: 'text-status-operational',
    hoverBg: 'hover:bg-status-operational/5',
    priority: 'high'
  },
  {
    id: 'daily-report',
    title: 'Daily Report',
    description: 'Generate comprehensive daily operations report',
    icon: BarChart3,
    path: '/reports/daily',
    color: 'border-status-warning/30',
    bgGradient: 'bg-gradient-to-br from-status-warning/5 to-status-warning/10',
    iconGradient: 'from-status-warning/80 to-status-warning',
    textColor: 'text-status-warning',
    hoverBg: 'hover:bg-status-warning/5',
    priority: 'medium'
  },
  {
    id: 'system-status',
    title: 'System Status',
    description: 'Check overall system health and performance',
    icon: Activity,
    path: '/system/status',
    color: 'border-status-success/30',
    bgGradient: 'bg-gradient-to-br from-status-success/5 to-status-success/10',
    iconGradient: 'from-status-success/80 to-status-success',
    textColor: 'text-status-success',
    hoverBg: 'hover:bg-status-success/5',
    priority: 'low'
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function NavigationPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second loading simulation

    return () => clearTimeout(timer);
  }, []);

  const navigationModules: NavigationModule[] = [
    {
      id: 'shifts',
      title: 'Shift Management',
      description: 'Track shift schedules, assignments, and employee working hours.',
      path: '/shifts',
      icon: Clock,
      color: 'border-status-operational/30',
      bgGradient: 'bg-gradient-to-br from-status-operational/5 to-status-operational/10',
      iconGradient: 'from-status-operational/80 to-status-operational',
      textColor: 'text-status-operational',
      hoverBg: 'hover:bg-status-operational/5',
      stats: { count: 'Active 5', label: 'Current Shifts' },
      badge: 'Live'
    },
    {
      id: 'employees',
      title: 'Employee Management',
      description: 'Manage staff records, roles, and performance tracking.',
      path: '/employees',
      icon: Users,
      color: 'border-primary/30',
      bgGradient: 'bg-gradient-to-br from-primary/5 to-primary/10',
      iconGradient: 'from-primary/80 to-primary',
      textColor: 'text-primary',
      hoverBg: 'hover:bg-primary/5',
      stats: { count: '24 Staff', label: 'Active Employees' },
      badge: 'Core'
    },
    {
      id: 'sales',
      title: 'Sales Analytics',
      description: 'Monitor sales performance, trends, and revenue metrics.',
      path: '/sales',
      icon: TrendingUp,
      color: 'border-fuel-premium/30',
      bgGradient: 'bg-gradient-to-br from-fuel-premium/5 to-fuel-premium/10',
      iconGradient: 'from-fuel-premium/80 to-fuel-premium',
      textColor: 'text-fuel-premium',
      hoverBg: 'hover:bg-fuel-premium/5',
      stats: { count: '$24,580', label: 'Today\'s Sales' },
      badge: 'Revenue'
    },
    {
      id: 'finance',
      title: 'Financial Management',
      description: 'Comprehensive financial reporting and accounting tools.',
      path: '/finance',
      icon: DollarSign,
      color: 'border-status-success/30',
      bgGradient: 'bg-gradient-to-br from-status-success/5 to-status-success/10',
      iconGradient: 'from-status-success/80 to-status-success',
      textColor: 'text-status-success',
      hoverBg: 'hover:bg-status-success/5',
      stats: { count: '+12.5%', label: 'Monthly Growth' },
      badge: 'Finance'
    },
    {
      id: 'fuel',
      title: 'Fuel Management',
      description: 'Track inventory levels, deliveries, and fuel quality metrics.',
      path: '/fuel',
      icon: Fuel,
      color: 'border-accent/30',
      bgGradient: 'bg-gradient-to-br from-accent/5 to-accent/10',
      iconGradient: 'from-accent/80 to-accent',
      textColor: 'text-accent',
      hoverBg: 'hover:bg-accent/5',
      stats: { count: '98.3%', label: 'Tank Levels' },
      badge: 'Critical'
    },
    {
      id: 'management',
      title: 'Operations Management',
      description: 'Centralized control for all operational aspects and workflows.',
      path: '/management',
      icon: Settings,
      color: 'border-core-primary/30',
      bgGradient: 'bg-gradient-to-br from-core-primary/5 to-core-primary/10',
      iconGradient: 'from-core-primary/80 to-core-primary',
      textColor: 'text-core-primary',
      hoverBg: 'hover:bg-core-primary/5',
      stats: { count: '15 Tasks', label: 'Pending Actions' },
      badge: 'Ops'
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'Generate comprehensive reports and business intelligence.',
      path: '/reports',
      icon: BarChart3,
      color: 'border-status-warning/30',
      bgGradient: 'bg-gradient-to-br from-status-warning/5 to-status-warning/10',
      iconGradient: 'from-status-warning/80 to-status-warning',
      textColor: 'text-status-warning',
      hoverBg: 'hover:bg-status-warning/5',
      stats: { count: '12 New', label: 'Reports Ready' },
      badge: 'Analytics'
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure system preferences, security, and integrations.',
      path: '/settings',
      icon: Cog,
      color: 'border-muted-foreground/30',
      bgGradient: 'bg-gradient-to-br from-muted-foreground/5 to-muted-foreground/10',
      iconGradient: 'from-muted-foreground/80 to-muted-foreground',
      textColor: 'text-muted-foreground',
      hoverBg: 'hover:bg-muted-foreground/5',
      stats: { count: '2 Updates', label: 'Available' },
      badge: 'Admin'
    }
  ];

  // Show shimmer loading state
  if (isLoading) {
    return (
      <div className="navigation-page">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header Shimmer */}
          <div className="mb-12 text-center space-y-4">
            <ShimmerDashboardCard className="mx-auto max-w-md" />
          </div>

          {/* Stats Shimmer */}
          <div className="mb-12">
            <ShimmerStats count={4} variant="wave" />
          </div>

          {/* Navigation Cards Shimmer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <ShimmerNavCard count={6} variant="wave" />
          </div>

          {/* Quick Actions Shimmer */}
          <div className="mt-16">
            <div className="mb-8">
              <ShimmerDashboardCard className="max-w-xs" />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {Array.from({ length: 4 }, (_, index) => (
                <ShimmerDashboardCard 
                  key={index} 
                  className="w-48 h-16" 
                  variant="pulse" 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="navigation-page">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text-primary">
            {t('navigation.title', 'Ararat Oil - Operations Center')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('navigation.subtitle', 'Comprehensive Fuel Management & Operations Dashboard')}
          </p>
        </div>

        {/* Navigation Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {navigationModules.map((module) => (
            <Link
              key={module.id}
              to={module.path}
              className="group"
            >
              <div
                className={cn(
                  'relative overflow-hidden rounded-xl p-6 min-h-[12rem] transition-all duration-300',
                  'bg-card border border-border',
                  'backdrop-blur-sm hover:backdrop-blur-md',
                  'hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/5',
                  'hover:border-accent/30',
                  'flex flex-col',
                  module.bgGradient
                )}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 dark:opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/10 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header with Icon and Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={cn(
                        'p-3 rounded-lg transition-all duration-300',
                        'bg-gradient-to-br shadow-sm group-hover:shadow-md',
                        'group-hover:scale-110 group-hover:rotate-3',
                        module.iconGradient
                      )}
                    >
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    {module.badge && (
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        'bg-accent/20 text-accent border border-accent/30',
                        'uppercase tracking-wider',
                        'flex-shrink-0'
                      )}>
                        {module.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Title and Description */}
                  <div className="flex-1 mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-accent transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Stats Footer */}
                  {module.stats && (
                    <div className="mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            'text-xl font-bold transition-colors duration-300',
                            module.textColor
                          )}>
                            {module.stats.count}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            {module.stats.label}
                          </div>
                        </div>
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
                          'bg-accent/10 group-hover:bg-accent/20',
                          'flex-shrink-0 ml-3'
                        )}>
                          <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-0.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Quick Actions
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fast access to your most frequently used features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.path}
                className="group"
              >
                <div
                  className={cn(
                    'relative overflow-hidden rounded-lg p-6 min-h-[8rem] transition-all duration-300',
                    'bg-card border border-border',
                    'hover:scale-[1.02] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5',
                    'hover:border-accent/30',
                    'flex flex-col',
                    action.bgGradient
                  )}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 dark:opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'p-3 rounded-lg transition-all duration-300',
                        'bg-gradient-to-br shadow-sm group-hover:shadow-md',
                        'group-hover:scale-110',
                        'flex-shrink-0',
                        action.iconGradient
                      )}
                    >
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-lg font-semibold text-card-foreground group-hover:text-accent transition-colors duration-300 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
                      'bg-accent/10 group-hover:bg-accent/20',
                      'flex-shrink-0 self-center'
                    )}>
                      <ArrowRight className="w-3 h-3 text-accent group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}