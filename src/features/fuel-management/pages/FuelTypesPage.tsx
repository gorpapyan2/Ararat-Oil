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
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';

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
  return (
    <div className="management-container">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span> &gt; </span> 
        <Link to="/fuel">Fuel Operations</Link> <span> &gt; </span> 
        <span>Fuel Types</span>
      </nav>
      <h1 className="management-title">Fuel Types Management</h1>
      <p className="management-desc">
        Product catalog management, specifications, and quality standards for comprehensive fuel type administration.
      </p>
      <div className="management-cards">
        {fuelTypeModules.map((module) => (
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
} 