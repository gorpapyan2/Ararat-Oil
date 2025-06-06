import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FlaskConical, 
  Plus, 
  BarChart3, 
  Settings,
  DollarSign,
  CheckCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { NavigationCard } from '@/shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface FuelTypeModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const fuelTypeModules: FuelTypeModule[] = [
  {
    id: 'fuel-catalog',
    title: 'Fuel Catalog',
    description: 'Browse and manage available fuel types',
    path: '/fuel/types/catalog',
    color: '#43E6A0',
    icon: FlaskConical
  },
  {
    id: 'add-fuel-type',
    title: 'Add Fuel Type',
    description: 'Create new fuel type specifications',
    path: '/fuel/types/add',
    color: '#4F8CFF',
    icon: Plus
  },
  {
    id: 'pricing-management',
    title: 'Pricing Management',
    description: 'Set and update fuel type pricing',
    path: '/fuel/types/pricing',
    color: '#6C63FF',
    icon: DollarSign
  },
  {
    id: 'specifications',
    title: 'Specifications',
    description: 'Manage fuel specifications and properties',
    path: '/fuel/types/specifications',
    color: '#FFA500',
    icon: Settings
  },
  {
    id: 'quality-standards',
    title: 'Quality Standards',
    description: 'Define quality control standards',
    path: '/fuel/types/quality',
    color: '#FF6584',
    icon: CheckCircle
  },
  {
    id: 'analytics',
    title: 'Type Analytics',
    description: 'Fuel type performance and usage analytics',
    path: '/fuel/types/analytics',
    color: '#9D4EDD',
    icon: BarChart3
  },
  {
    id: 'market-trends',
    title: 'Market Trends',
    description: 'Track fuel type market trends and demand',
    path: '/fuel/types/trends',
    color: '#20B2AA',
    icon: TrendingUp
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Technical documentation and compliance',
    path: '/fuel/types/documentation',
    color: '#32CD32',
    icon: FileText
  }
];

export default function FuelTypesPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fuel Operations', href: '/fuel' },
    { label: 'Fuel Types', href: '/fuel/types' }
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
                Fuel Types Management
              </h1>
              <p className="page-description">
                Manage fuel specifications, quality standards, and product categories for optimal inventory control.
              </p>
            </div>

            {/* Module Cards */}
            <div className="management-cards">
              {fuelTypeModules.map((module) => (
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