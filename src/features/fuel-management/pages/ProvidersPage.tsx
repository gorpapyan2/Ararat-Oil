import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Users, 
  FileText, 
  BarChart3,
  DollarSign,
  Calendar,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';

interface ProviderModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const providerModules: ProviderModule[] = [
  {
    id: 'supplier-directory',
    title: 'Supplier Directory',
    description: 'Manage supplier contacts and information',
    path: '/fuel/providers/directory',
    color: '#43E6A0',
    icon: Users
  },
  {
    id: 'contracts',
    title: 'Contracts',
    description: 'Supplier contracts and agreement management',
    path: '/fuel/providers/contracts',
    color: '#4F8CFF',
    icon: FileText
  },
  {
    id: 'delivery-tracking',
    title: 'Delivery Tracking',
    description: 'Track deliveries and logistics operations',
    path: '/fuel/providers/deliveries',
    color: '#6C63FF',
    icon: Truck
  },
  {
    id: 'performance-analytics',
    title: 'Performance Analytics',
    description: 'Supplier performance metrics and analytics',
    path: '/fuel/providers/analytics',
    color: '#FFA500',
    icon: BarChart3
  },
  {
    id: 'pricing-agreements',
    title: 'Pricing Agreements',
    description: 'Negotiate and manage supplier pricing',
    path: '/fuel/providers/pricing',
    color: '#FF6584',
    icon: DollarSign
  },
  {
    id: 'delivery-schedule',
    title: 'Delivery Schedule',
    description: 'Plan and schedule fuel deliveries',
    path: '/fuel/providers/schedule',
    color: '#9D4EDD',
    icon: Calendar
  },
  {
    id: 'quality-assurance',
    title: 'Quality Assurance',
    description: 'Supplier quality control and compliance',
    path: '/fuel/providers/quality',
    color: '#20B2AA',
    icon: CheckCircle
  },
  {
    id: 'relationship-management',
    title: 'Relationship Management',
    description: 'Supplier relationship and communication tracking',
    path: '/fuel/providers/relationships',
    color: '#32CD32',
    icon: TrendingUp
  }
];

export default function ProvidersPage() {
  return (
    <div className="management-container">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span> &gt; </span> 
        <Link to="/fuel">Fuel Operations</Link> <span> &gt; </span> 
        <span>Petrol Providers</span>
      </nav>
      <h1 className="management-title">Petrol Providers Dashboard</h1>
      <p className="management-desc">
        Supplier management and provider relationships for comprehensive fuel procurement and logistics coordination.
      </p>
      <div className="management-cards">
        {providerModules.map((module) => (
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
