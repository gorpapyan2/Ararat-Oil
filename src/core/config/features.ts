import { 
  BarChart3, 
  Users, 
  Settings, 
  CreditCard, 
  CalendarClock, 
  Database, 
  Bug,
  DollarSign,
  TrendingUp,
  FileText,
  Wrench,
  Shield,
  Bell,
  Globe,
  Fuel,
  Truck,
  Package,
  Receipt,
  PieChart,
  Activity,
  Clock,
  Target
} from "lucide-react";
import {
  IconGasStation,
  IconUser,
  IconReport,
  IconReceipt,
  IconCash,
  IconChartLine,
  IconCoin,
  IconTank,
} from "@/core/components/ui/icons";
import { NavigationFeature, NavigationConfig, FeatureCategory } from "@/core/types/navigation";

export const featuresConfig: NavigationConfig = {
  categories: [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Dashboard and main navigation features',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      features: []
    },
    {
      id: 'operations', 
      title: 'Operations',
      description: 'Operational management and fuel systems',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      features: []
    },
    {
      id: 'finance',
      title: 'Finance',
      description: 'Financial management and reporting',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      features: []
    },
    {
      id: 'management',
      title: 'Management',
      description: 'Staff and resource management',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      features: []
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Analytics and business reports',
      icon: FileText,
      color: 'from-slate-500 to-slate-600',
      features: []
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'System configuration and preferences',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      features: []
    }
  ],
  features: [
    // Overview
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Real-time business overview with key metrics and insights',
      icon: BarChart3,
      path: '/',
      color: 'from-blue-500 to-blue-600',
      category: 'overview',
      status: 'active',
      metrics: [
        {
          label: 'Active Systems',
          value: '8/10',
          trend: 'up'
        }
      ],
      tags: ['analytics', 'real-time', 'overview']
    },

    // Operations
    {
      id: 'fuel-management',
      title: 'Fuel Management',
      description: 'Complete fuel operations including tanks, supplies, and systems',
      icon: BarChart3,
      path: '/fuel-management',
      color: 'from-amber-500 to-orange-600',
      category: 'operations',
      status: 'active',
      children: [
        {
          id: 'fuel-dashboard',
          title: 'Fuel Dashboard',
          description: 'Overview of all fuel operations',
          icon: BarChart3,
          path: '/fuel-management',
          color: 'from-amber-500 to-orange-600',
          category: 'operations',
          status: 'active'
        },
        {
          id: 'tanks',
          title: 'Tank Management',
          description: 'Monitor and manage fuel storage tanks',
          icon: Database,
          path: '/fuel-management/tanks',
          color: 'from-amber-500 to-orange-600',
          category: 'operations',
          status: 'active'
        },
        {
          id: 'filling-systems',
          title: 'Filling Systems',
          description: 'Manage fuel dispensing systems',
          icon: Fuel,
          path: '/fuel-management/filling-systems',
          color: 'from-amber-500 to-orange-600',
          category: 'operations',
          status: 'active'
        },
        {
          id: 'fuel-supplies',
          title: 'Fuel Supplies',
          description: 'Track fuel inventory and supplies',
          icon: Package,
          path: '/fuel-management/fuel-supplies',
          color: 'from-amber-500 to-orange-600',
          category: 'operations',
          status: 'active'
        },
        {
          id: 'fuel-prices',
          title: 'Fuel Prices',
          description: 'Manage fuel pricing and updates',
          icon: DollarSign,
          path: '/fuel-management/prices',
          color: 'from-amber-500 to-orange-600',
          category: 'operations',
          status: 'active'
        },
        {
          id: 'providers',
          title: 'Fuel Providers',
          description: 'Manage fuel supplier relationships',
          icon: Truck,
          path: '/fuel-management/providers',
          color: 'from-amber-500 to-orange-600',
          category: 'operations',
          status: 'active'
        },
        {
          id: 'fuel-sales',
          title: 'Fuel Sales',
          description: 'Track and manage fuel sales transactions',
          icon: Receipt,
          path: '/fuel-management/sales',
          color: 'from-amber-500 to-orange-600',
          category: 'operations',
          status: 'active'
        }
      ],
      metrics: [
        {
          label: 'Active Tanks',
          value: '8/10',
          trend: 'up'
        }
      ],
      tags: ['operations', 'inventory', 'critical']
    },

    // Finance
    {
      id: 'finance',
      title: 'Finance',
      description: 'Financial management, reporting, and analysis',
      icon: DollarSign,
      path: '/finance',
      color: 'from-green-500 to-emerald-600',
      category: 'finance',
      status: 'active',
      children: [
        {
          id: 'finance-overview',
          title: 'Finance Overview',
          description: 'Financial dashboard and key metrics',
          icon: PieChart,
          path: '/finance',
          color: 'from-green-500 to-emerald-600',
          category: 'finance',
          status: 'active'
        },
        {
          id: 'sales',
          title: 'Sales Management',
          description: 'Track sales transactions and performance',
          icon: TrendingUp,
          path: '/sales',
          color: 'from-green-500 to-emerald-600',
          category: 'finance',
          status: 'active'
        },
        {
          id: 'expenses',
          title: 'Expense Management',
          description: 'Monitor and control business expenses',
          icon: Receipt,
          path: '/expenses',
          color: 'from-green-500 to-emerald-600',
          category: 'finance',
          status: 'active'
        }
      ],
      metrics: [
        {
          label: 'Monthly Revenue',
          value: '$125K',
          trend: 'up'
        }
      ],
      tags: ['finance', 'revenue', 'expenses']
    },

    {
      id: 'shifts',
      title: 'Shift Management',
      description: 'Employee shift scheduling and time tracking',
      icon: CalendarClock,
      path: '/shifts',
      color: 'from-purple-500 to-purple-600',
      category: 'operations',
      status: 'active',
      metrics: [
        {
          label: 'Active Shifts',
          value: '12',
          trend: 'stable'
        }
      ],
      tags: ['scheduling', 'workforce', 'time-tracking']
    },

    // Management
    {
      id: 'employees',
      title: 'Employee Management',
      description: 'Manage staff, roles, and HR operations',
      icon: Users,
      path: '/employees',
      color: 'from-indigo-500 to-indigo-600',
      category: 'management',
      status: 'active',
      metrics: [
        {
          label: 'Total Staff',
          value: '45',
          trend: 'up'
        }
      ],
      tags: ['hr', 'staff', 'management']
    },

    // Reports
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'Comprehensive business reports and analytics',
      icon: FileText,
      path: '/reports',
      color: 'from-slate-500 to-slate-600',
      category: 'reports',
      status: 'active',
      children: [
        {
          id: 'sales-reports',
          title: 'Sales Reports',
          description: 'Detailed sales analytics and trends',
          icon: TrendingUp,
          path: '/reports/sales',
          color: 'from-slate-500 to-slate-600',
          category: 'reports',
          status: 'active'
        },
        {
          id: 'financial-reports',
          title: 'Financial Reports',
          description: 'Financial statements and analysis',
          icon: FileText,
          path: '/reports/financial',
          color: 'from-slate-500 to-slate-600',
          category: 'reports',
          status: 'active'
        },
        {
          id: 'operational-reports',
          title: 'Operational Reports',
          description: 'Operations and performance metrics',
          icon: Activity,
          path: '/reports/operational',
          color: 'from-slate-500 to-slate-600',
          category: 'reports',
          status: 'active'
        }
      ],
      tags: ['analytics', 'insights', 'business-intelligence']
    },

    // Settings
    {
      id: 'settings',
      title: 'Settings',
      description: 'System configuration and preferences',
      icon: Settings,
      path: '/settings',
      color: 'from-gray-500 to-gray-600',
      category: 'settings',
      status: 'active',
      children: [
        {
          id: 'general-settings',
          title: 'General Settings',
          description: 'Basic system configuration',
          icon: Settings,
          path: '/settings/general',
          color: 'from-gray-500 to-gray-600',
          category: 'settings',
          status: 'active'
        },
        {
          id: 'security-settings',
          title: 'Security Settings',
          description: 'Security and access control',
          icon: Shield,
          path: '/settings/security',
          color: 'from-gray-500 to-gray-600',
          category: 'settings',
          status: 'active'
        },
        {
          id: 'notification-settings',
          title: 'Notifications',
          description: 'Alert and notification preferences',
          icon: Bell,
          path: '/settings/notifications',
          color: 'from-gray-500 to-gray-600',
          category: 'settings',
          status: 'active'
        },
        {
          id: 'integrations',
          title: 'Integrations',
          description: 'Third-party integrations and APIs',
          icon: Globe,
          path: '/settings/integrations',
          color: 'from-gray-500 to-gray-600',
          category: 'settings',
          status: 'active'
        }
      ],
      tags: ['configuration', 'preferences', 'system']
    },

    // System
    {
      id: 'sync',
      title: 'Data Synchronization',
      description: 'Database sync and data management',
      icon: Database,
      path: '/syncup',
      color: 'from-teal-500 to-teal-600',
      category: 'management',
      status: 'active',
      metrics: [
        {
          label: 'Sync Status',
          value: 'Live',
          trend: 'up'
        }
      ],
      tags: ['database', 'sync', 'system']
    }
  ]
};

export const getFeaturesByCategory = (category: string) => 
  featuresConfig.features.filter(feature => feature.category === category);

export const getFeatureById = (id: string) => 
  featuresConfig.features.find(feature => feature.id === id);

export const getAllCategories = () => featuresConfig.categories; 