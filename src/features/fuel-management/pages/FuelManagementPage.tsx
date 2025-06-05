import React from 'react';
import { Link } from 'react-router-dom';
import { Package, BarChart3, Database, Droplets, DollarSign, FlaskConical, Settings, Truck } from 'lucide-react';
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface FuelManagementModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const fuelManagementModules: FuelManagementModule[] = [
  {
    id: 'fuel',
    title: 'Fuel',
    description: 'General fuel management and overview operations',
    path: '/fuel/management',
    color: '#43E6A0',
    icon: Package
  },
  {
    id: 'fuel-dashboard',
    title: 'Fuel Dashboard',
    description: 'Real-time fuel operations dashboard and analytics',
    path: '/fuel/dashboard',
    color: '#4F8CFF',
    icon: BarChart3
  },
  {
    id: 'tanks',
    title: 'Tanks',
    description: 'Storage tank management and capacity monitoring',
    path: '/fuel/tanks',
    color: '#6C63FF',
    icon: Database
  },
  {
    id: 'fuel-supplies',
    title: 'Fuel Supplies',
    description: 'Inventory management and fuel supply tracking',
    path: '/fuel/supplies',
    color: '#FFA500',
    icon: Droplets
  },
  {
    id: 'fuel-prices',
    title: 'Fuel Prices',
    description: 'Pricing management and fuel rate configuration',
    path: '/fuel/prices',
    color: '#FF6584',
    icon: DollarSign
  },
  {
    id: 'fuel-types',
    title: 'Fuel Types',
    description: 'Product catalog and fuel type management',
    path: '/fuel/types',
    color: '#9D4EDD',
    icon: FlaskConical
  },
  {
    id: 'filling-systems',
    title: 'Filling Systems',
    description: 'Pump and dispenser management systems',
    path: '/fuel/filling-systems',
    color: '#20B2AA',
    icon: Settings
  },
  {
    id: 'petrol-providers',
    title: 'Petrol Providers',
    description: 'Supplier management and provider relationships',
    path: '/fuel/providers',
    color: '#32CD32',
    icon: Truck
  }
];

export const FuelManagementPage: React.FC = () => {
  return (
    <div className="management-container">
      <Breadcrumb 
        items={[{ label: 'Fuel Operations' }]}
      />
      <h1 className="management-title">Fuel Management Dashboard</h1>
      <p className="management-desc">
        Comprehensive fuel operations management and monitoring system for inventory control, distribution, and supplier relations.
      </p>
      <div className="management-cards">
        {fuelManagementModules.map((module) => (
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
}; 