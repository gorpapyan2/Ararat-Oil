import React, { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { ModuleCard, StatsCard } from '@/shared/components/cards';
import { useFuelModuleStats } from '../hooks/useFuelModuleStats';
import { format } from 'date-fns';
import { hy } from 'date-fns/locale';

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

export function FuelManagementPage() {
  const { t } = useTranslation();
  
  // Use our custom hook to fetch all module stats
  const { stats: moduleStats, isLoading, error } = useFuelModuleStats();
  
  const breadcrumbItems = [
    { label: t('common.home'), href: '/' },
    { label: t('modules.fuel.title'), href: '/fuel' }
  ];

  const fuelManagementModules: FuelModule[] = [
    // Core Fuel Management Modules
    {
      id: 'tanks-management',
      title: t('modules.fuel.tanksManagement'),
      description: t('modules.fuel.tanksManagementDesc'),
      path: '/fuel/tanks',
      icon: Database,
      category: t('modules.fuel.title'),
      badge: t('common.core'),
      stats: { 
        count: isLoading ? t('common.loading') : moduleStats.tanks, 
        label: t('tanks.title') 
      },
      color: 'border-blue-500/30',
      bgGradient: 'bg-gradient-to-br from-blue-500/5 to-blue-500/10',
      iconGradient: 'from-blue-500/80 to-blue-500',
      textColor: 'text-blue-600'
    },
    {
      id: 'fuel-supplies',
      title: t('modules.fuel.fuelSupplies'),
      description: t('modules.fuel.fuelSuppliesDesc'),
      path: '/fuel/supplies',
      icon: Package,
      category: t('modules.fuel.title'),
      badge: t('common.core'),
      stats: { 
        count: isLoading ? t('common.loading') : moduleStats.supplies,
        label: t('inventory.stock')
      },
      color: 'border-green-500/30',
      bgGradient: 'bg-gradient-to-br from-green-500/5 to-green-500/10',
      iconGradient: 'from-green-500/80 to-green-500',
      textColor: 'text-green-600'
    },
    {
      id: 'fuel-prices',
      title: t('modules.fuel.fuelPrices'),
      description: t('modules.fuel.fuelPricesDesc'),
      path: '/fuel/prices',
      icon: DollarSign,
      category: t('modules.fuel.title'),
      badge: t('common.core'),
      stats: { 
        count: isLoading ? t('common.loading') : moduleStats.prices,
        label: t('fuelPrices.pricePerLiter')
      },
      color: 'border-purple-500/30',
      bgGradient: 'bg-gradient-to-br from-purple-500/5 to-purple-500/10',
      iconGradient: 'from-purple-500/80 to-purple-500',
      textColor: 'text-purple-600'
    },
    {
      id: 'fuel-types',
      title: t('modules.fuel.fuelTypes'),
      description: t('modules.fuel.fuelTypesDesc'),
      path: '/fuel/types',
      icon: Fuel,
      category: t('modules.fuel.title'),
      badge: t('common.core'),
      stats: { 
        count: isLoading ? t('common.loading') : moduleStats.types,
        label: t('fuelTypes.title')
      },
      color: 'border-orange-500/30',
      bgGradient: 'bg-gradient-to-br from-orange-500/5 to-orange-500/10',
      iconGradient: 'from-orange-500/80 to-orange-500',
      textColor: 'text-orange-600'
    },
    {
      id: 'filling-systems',
      title: t('modules.fuel.fillingSystems'),
      description: t('modules.fuel.fillingSystemsDesc'),
      path: '/fuel/filling-systems',
      icon: Zap,
      category: t('modules.fuel.title'),
      badge: t('common.core'),
      stats: { 
        count: isLoading ? t('common.loading') : moduleStats.fillingSystems,
        label: t('fillingSystems.title')
      },
      color: 'border-amber-500/30',
      bgGradient: 'bg-gradient-to-br from-amber-500/5 to-amber-500/10',
      iconGradient: 'from-amber-500/80 to-amber-500',
      textColor: 'text-amber-600'
    },
    {
      id: 'petrol-providers',
      title: t('modules.fuel.petrolProviders'),
      description: t('modules.fuel.petrolProvidersDesc'),
      path: '/fuel/providers',
      icon: Truck,
      category: t('modules.fuel.title'),
      badge: t('common.core'),
      stats: { 
        count: isLoading ? t('common.loading') : moduleStats.providers,
        label: t('fuelSupplies.supplier')
      },
      color: 'border-teal-500/30',
      bgGradient: 'bg-gradient-to-br from-teal-500/5 to-teal-500/10',
      iconGradient: 'from-teal-500/80 to-teal-500',
      textColor: 'text-teal-600'
    }
  ];

  // Group modules by category
  const groupedModules = fuelManagementModules.reduce((acc, module) => {
    const category = module.category || t('common.other');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, FuelModule[]>);


  return (
    <WindowContainer
      title={t('modules.fuel.title')}
      subtitle={t('modules.fuel.description')}
      breadcrumbItems={breadcrumbItems}
    >
      {/* Error display if data fetching failed */}
      {error && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 rounded-lg text-red-800 dark:text-red-300">
          <p className="text-sm">{t('common.error')}: {error.message}</p>
        </div>
      )}
      
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