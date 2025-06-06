import React from 'react';
import { 
  Fuel, 
  TrendingUp, 
  Zap, 
  Activity, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Gauge,
  Package,
  AlertTriangle,
  Settings,
  FileText,
  DollarSign,
  Target,
  MapPin,
  Filter,
  Users,
  Clock,
  Shield,
  Database,
  Thermometer,
  Droplets
} from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { ModuleCard, StatsCard } from '@/shared/components/cards';

interface FuelModule {
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

const fuelManagementModules: FuelModule[] = [
  // Operations Dashboard
  {
    id: 'dashboard',
    title: 'Fuel Operations Dashboard',
    description: 'Real-time overview of all fuel operations, tank levels, and system status.',
    path: '/fuel/dashboard',
    icon: Gauge,
    category: 'Operations Dashboard',
    badge: 'Live',
    stats: { count: '6 Tanks', label: 'Monitored' },
    color: 'border-blue-500/30',
    bgGradient: 'bg-gradient-to-br from-blue-500/5 to-blue-500/10',
    iconGradient: 'from-blue-500/80 to-blue-500',
    textColor: 'text-blue-600'
  },
  {
    id: 'tank-monitoring',
    title: 'Tank Level Monitoring',
    description: 'Monitor fuel levels, capacity utilization, and automated alerts.',
    path: '/fuel/tank-monitoring',
    icon: Droplets,
    category: 'Operations Dashboard',
    badge: 'Real-time',
    stats: { count: '87.5%', label: 'Avg. Fill Level' },
    color: 'border-cyan-500/30',
    bgGradient: 'bg-gradient-to-br from-cyan-500/5 to-cyan-500/10',
    iconGradient: 'from-cyan-500/80 to-cyan-500',
    textColor: 'text-cyan-600'
  },
  {
    id: 'quality-monitoring',
    title: 'Fuel Quality Control',
    description: 'Monitor fuel quality parameters, temperature, and contamination levels.',
    path: '/fuel/quality',
    icon: Thermometer,
    category: 'Operations Dashboard',
    badge: 'Quality',
    stats: { count: '98.9%', label: 'Quality Score' },
    color: 'border-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-500/5 to-emerald-500/10',
    iconGradient: 'from-emerald-500/80 to-emerald-500',
    textColor: 'text-emerald-600'
  },
  {
    id: 'alerts',
    title: 'System Alerts & Alarms',
    description: 'Critical alerts, safety warnings, and system notifications.',
    path: '/fuel/alerts',
    icon: AlertTriangle,
    category: 'Operations Dashboard',
    badge: 'Critical',
    stats: { count: '2 Active', label: 'Alerts' },
    color: 'border-red-500/30',
    bgGradient: 'bg-gradient-to-br from-red-500/5 to-red-500/10',
    iconGradient: 'from-red-500/80 to-red-500',
    textColor: 'text-red-600'
  },

  // Infrastructure & Inventory
  {
    id: 'tank-management',
    title: 'Tank Configuration',
    description: 'Manage tank specifications, capacity settings, and maintenance schedules.',
    path: '/fuel/tanks',
    icon: Package,
    category: 'Infrastructure & Inventory',
    badge: 'Config',
    stats: { count: '6 Tanks', label: 'Configured' },
    color: 'border-purple-500/30',
    bgGradient: 'bg-gradient-to-br from-purple-500/5 to-purple-500/10',
    iconGradient: 'from-purple-500/80 to-purple-500',
    textColor: 'text-purple-600'
  },
  {
    id: 'fuel-types',
    title: 'Fuel Types & Grades',
    description: 'Configure fuel types, octane ratings, and product specifications.',
    path: '/fuel/types',
    icon: Fuel,
    category: 'Infrastructure & Inventory',
    badge: 'Products',
    stats: { count: '4 Types', label: 'Active Fuels' },
    color: 'border-orange-500/30',
    bgGradient: 'bg-gradient-to-br from-orange-500/5 to-orange-500/10',
    iconGradient: 'from-orange-500/80 to-orange-500',
    textColor: 'text-orange-600'
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    description: 'Track fuel inventory, stock levels, and automated reorder points.',
    path: '/fuel/inventory',
    icon: Database,
    category: 'Infrastructure & Inventory',
    badge: 'Stock',
    stats: { count: '24.8K L', label: 'Total Inventory' },
    color: 'border-indigo-500/30',
    bgGradient: 'bg-gradient-to-br from-indigo-500/5 to-indigo-500/10',
    iconGradient: 'from-indigo-500/80 to-indigo-500',
    textColor: 'text-indigo-600'
  },
  {
    id: 'dispensers',
    title: 'Dispenser Management',
    description: 'Configure and monitor fuel dispensers, pumps, and nozzle assignments.',
    path: '/fuel/dispensers',
    icon: Zap,
    category: 'Infrastructure & Inventory',
    badge: 'Equipment',
    stats: { count: '8 Pumps', label: 'Active' },
    color: 'border-yellow-500/30',
    bgGradient: 'bg-gradient-to-br from-yellow-500/5 to-yellow-500/10',
    iconGradient: 'from-yellow-500/80 to-yellow-500',
    textColor: 'text-yellow-600'
  },

  // Supply Chain & Pricing
  {
    id: 'suppliers',
    title: 'Supplier Management',
    description: 'Manage fuel suppliers, contracts, and delivery schedules.',
    path: '/fuel/suppliers',
    icon: Users,
    category: 'Supply Chain & Pricing',
    badge: 'Vendors',
    stats: { count: '5 Suppliers', label: 'Active' },
    color: 'border-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-teal-500/5 to-teal-500/10',
    iconGradient: 'from-teal-500/80 to-teal-500',
    textColor: 'text-teal-600'
  },
  {
    id: 'deliveries',
    title: 'Delivery Tracking',
    description: 'Track fuel deliveries, schedules, and receipt confirmations.',
    path: '/fuel/deliveries',
    icon: Truck,
    category: 'Supply Chain & Pricing',
    badge: 'Logistics',
    stats: { count: '3 Pending', label: 'Deliveries' },
    color: 'border-green-500/30',
    bgGradient: 'bg-gradient-to-br from-green-500/5 to-green-500/10',
    iconGradient: 'from-green-500/80 to-green-500',
    textColor: 'text-green-600'
  },
  {
    id: 'pricing',
    title: 'Price Management',
    description: 'Set fuel prices, manage pricing strategies, and monitor price changes.',
    path: '/fuel/pricing',
    icon: DollarSign,
    category: 'Supply Chain & Pricing',
    badge: 'Pricing',
    stats: { count: '₺8.45', label: 'Avg Price/L' },
    color: 'border-amber-500/30',
    bgGradient: 'bg-gradient-to-br from-amber-500/5 to-amber-500/10',
    iconGradient: 'from-amber-500/80 to-amber-500',
    textColor: 'text-amber-600'
  },
  {
    id: 'procurement',
    title: 'Fuel Procurement',
    description: 'Manage purchase orders, procurement cycles, and cost optimization.',
    path: '/fuel/procurement',
    icon: ShoppingCart,
    category: 'Supply Chain & Pricing',
    badge: 'Purchasing',
    stats: { count: '₺45.2K', label: 'Monthly Spend' },
    color: 'border-pink-500/30',
    bgGradient: 'bg-gradient-to-br from-pink-500/5 to-pink-500/10',
    iconGradient: 'from-pink-500/80 to-pink-500',
    textColor: 'text-pink-600'
  },

  // Sales & Transactions
  {
    id: 'sales',
    title: 'Fuel Sales Tracking',
    description: 'Monitor fuel sales, transaction volumes, and revenue analytics.',
    path: '/fuel/sales',
    icon: TrendingUp,
    category: 'Sales & Transactions',
    badge: 'Revenue',
    stats: { count: '₺18.7K', label: 'Daily Sales' },
    color: 'border-violet-500/30',
    bgGradient: 'bg-gradient-to-br from-violet-500/5 to-violet-500/10',
    iconGradient: 'from-violet-500/80 to-violet-500',
    textColor: 'text-violet-600'
  },
  {
    id: 'transactions',
    title: 'Transaction History',
    description: 'View detailed transaction logs, payment methods, and customer data.',
    path: '/fuel/transactions',
    icon: FileText,
    category: 'Sales & Transactions',
    badge: 'Records',
    stats: { count: '1.2K', label: 'Today\'s Txns' },
    color: 'border-slate-500/30',
    bgGradient: 'bg-gradient-to-br from-slate-500/5 to-slate-500/10',
    iconGradient: 'from-slate-500/80 to-slate-500',
    textColor: 'text-slate-600'
  },
  {
    id: 'performance',
    title: 'Performance Analytics',
    description: 'Analyze fuel performance metrics, efficiency, and optimization opportunities.',
    path: '/fuel/performance',
    icon: Target,
    category: 'Sales & Transactions',
    badge: 'Analytics',
    stats: { count: '94.2%', label: 'Efficiency' },
    color: 'border-lime-500/30',
    bgGradient: 'bg-gradient-to-br from-lime-500/5 to-lime-500/10',
    iconGradient: 'from-lime-500/80 to-lime-500',
    textColor: 'text-lime-600'
  },
  {
    id: 'customer-analytics',
    title: 'Customer Analytics',
    description: 'Track customer behavior, loyalty programs, and consumption patterns.',
    path: '/fuel/customers',
    icon: Activity,
    category: 'Sales & Transactions',
    badge: 'CRM',
    stats: { count: '456', label: 'Active Customers' },
    color: 'border-rose-500/30',
    bgGradient: 'bg-gradient-to-br from-rose-500/5 to-rose-500/10',
    iconGradient: 'from-rose-500/80 to-rose-500',
    textColor: 'text-rose-600'
  },

  // Reports & Maintenance
  {
    id: 'reports',
    title: 'Fuel Reports',
    description: 'Generate comprehensive fuel reports, compliance documents, and analytics.',
    path: '/fuel/reports',
    icon: BarChart3,
    category: 'Reports & Maintenance',
    badge: 'Reports',
    stats: { count: '15 Reports', label: 'Available' },
    color: 'border-gray-500/30',
    bgGradient: 'bg-gradient-to-br from-gray-500/5 to-gray-500/10',
    iconGradient: 'from-gray-500/80 to-gray-500',
    textColor: 'text-gray-600'
  },
  {
    id: 'maintenance',
    title: 'Equipment Maintenance',
    description: 'Schedule and track maintenance for tanks, pumps, and fuel equipment.',
    path: '/fuel/maintenance',
    icon: Settings,
    category: 'Reports & Maintenance',
    badge: 'Service',
    stats: { count: '3 Due', label: 'Maintenance' },
    color: 'border-stone-500/30',
    bgGradient: 'bg-gradient-to-br from-stone-500/5 to-stone-500/10',
    iconGradient: 'from-stone-500/80 to-stone-500',
    textColor: 'text-stone-600'
  },
  {
    id: 'safety',
    title: 'Safety & Compliance',
    description: 'Monitor safety protocols, environmental compliance, and regulatory requirements.',
    path: '/fuel/safety',
    icon: Shield,
    category: 'Reports & Maintenance',
    badge: 'Safety',
    stats: { count: '100%', label: 'Compliance' },
    color: 'border-emerald-600/30',
    bgGradient: 'bg-gradient-to-br from-emerald-600/5 to-emerald-600/10',
    iconGradient: 'from-emerald-600/80 to-emerald-600',
    textColor: 'text-emerald-700'
  },
  {
    id: 'scheduling',
    title: 'Operational Scheduling',
    description: 'Plan delivery schedules, maintenance windows, and operational activities.',
    path: '/fuel/scheduling',
    icon: Clock,
    category: 'Reports & Maintenance',
    badge: 'Planning',
    stats: { count: '8 Events', label: 'This Week' },
    color: 'border-zinc-500/30',
    bgGradient: 'bg-gradient-to-br from-zinc-500/5 to-zinc-500/10',
    iconGradient: 'from-zinc-500/80 to-zinc-500',
    textColor: 'text-zinc-600'
  }
];

export function FuelManagementPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fuel Management', href: '/fuel' }
  ];

  // Group modules by category
  const groupedModules = fuelManagementModules.reduce((acc, module) => {
    const category = module.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, FuelModule[]>);

  const quickStats = [
    {
      title: 'Tank Levels',
      value: '87.5%',
      icon: Droplets,
      color: 'from-blue-500/80 to-blue-500',
      description: '↗ Optimal levels'
    },
    {
      title: 'Daily Sales',
      value: '₺18.7K',
      icon: TrendingUp,
      color: 'from-green-500/80 to-green-500',
      description: '↗ +12.3% vs yesterday'
    },
    {
      title: 'Active Pumps',
      value: '8/8',
      icon: Zap,
      color: 'from-purple-500/80 to-purple-500',
      description: '✓ All operational'
    },
    {
      title: 'Quality Score',
      value: '98.9%',
      icon: Shield,
      color: 'from-amber-500/80 to-amber-500',
      description: '↗ Excellent quality'
    }
  ];

  return (
    <WindowContainer
      title="Fuel Management System"
      subtitle="Comprehensive fuel operations, inventory management, and performance analytics platform"
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

      {/* Fuel Management Modules */}
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
} 