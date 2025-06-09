import React from 'react';
import { 
  Fuel, 
  TrendingUp, 
  Zap, 
  Truck, 
  Package,
  DollarSign,
  Shield,
  Database,
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
  // Core Fuel Management Modules
  {
    id: 'tanks-management',
    title: 'Tanks Management',
    description: 'Manage tank specifications, capacity settings, monitoring, and maintenance schedules.',
    path: '/fuel/tanks',
    icon: Database,
    category: 'Fuel Management',
    badge: 'Core',
    stats: { count: '6 Tanks', label: 'Configured' },
    color: 'border-blue-500/30',
    bgGradient: 'bg-gradient-to-br from-blue-500/5 to-blue-500/10',
    iconGradient: 'from-blue-500/80 to-blue-500',
    textColor: 'text-blue-600'
  },
  {
    id: 'fuel-supplies',
    title: 'Fuel Supplies',
    description: 'Track fuel inventory, supply deliveries, stock levels, and automated reorder management.',
    path: '/fuel/supplies',
    icon: Package,
    category: 'Fuel Management',
    badge: 'Core',
    stats: { count: '24.8K L', label: 'Total Inventory' },
    color: 'border-green-500/30',
    bgGradient: 'bg-gradient-to-br from-green-500/5 to-green-500/10',
    iconGradient: 'from-green-500/80 to-green-500',
    textColor: 'text-green-600'
  },
  {
    id: 'fuel-prices',
    title: 'Fuel Prices',
    description: 'Set fuel prices, manage pricing strategies, monitor price changes, and cost optimization.',
    path: '/fuel/prices',
    icon: DollarSign,
    category: 'Fuel Management',
    badge: 'Core',
    stats: { count: '₺8.45', label: 'Avg Price/L' },
    color: 'border-purple-500/30',
    bgGradient: 'bg-gradient-to-br from-purple-500/5 to-purple-500/10',
    iconGradient: 'from-purple-500/80 to-purple-500',
    textColor: 'text-purple-600'
  },
  {
    id: 'fuel-types',
    title: 'Fuel Types',
    description: 'Configure fuel types, octane ratings, product specifications, and grade management.',
    path: '/fuel/types',
    icon: Fuel,
    category: 'Fuel Management',
    badge: 'Core',
    stats: { count: '4 Types', label: 'Active Fuels' },
    color: 'border-orange-500/30',
    bgGradient: 'bg-gradient-to-br from-orange-500/5 to-orange-500/10',
    iconGradient: 'from-orange-500/80 to-orange-500',
    textColor: 'text-orange-600'
  },
  {
    id: 'filling-systems',
    title: 'Filling Systems',
    description: 'Configure and monitor fuel dispensers, pumps, nozzle assignments, and equipment status.',
    path: '/fuel/filling-systems',
    icon: Zap,
    category: 'Fuel Management',
    badge: 'Core',
    stats: { count: '8 Pumps', label: 'Active' },
    color: 'border-amber-500/30',
    bgGradient: 'bg-gradient-to-br from-amber-500/5 to-amber-500/10',
    iconGradient: 'from-amber-500/80 to-amber-500',
    textColor: 'text-amber-600'
  },
  {
    id: 'petrol-providers',
    title: 'Petrol Providers',
    description: 'Manage fuel suppliers, contracts, delivery schedules, and vendor relationships.',
    path: '/fuel/providers',
    icon: Truck,
    category: 'Fuel Management',
    badge: 'Core',
    stats: { count: '5 Suppliers', label: 'Active' },
    color: 'border-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-teal-500/5 to-teal-500/10',
    iconGradient: 'from-teal-500/80 to-teal-500',
    textColor: 'text-teal-600'
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


  return (
    <WindowContainer
      title="Fuel Management System"
      subtitle="Comprehensive fuel operations, inventory management, and performance analytics platform"
      breadcrumbItems={breadcrumbItems}
    >
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