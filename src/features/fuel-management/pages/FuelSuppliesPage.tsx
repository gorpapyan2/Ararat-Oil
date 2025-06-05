import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Truck,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';

interface SuppliesModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const suppliesModules: SuppliesModule[] = [
  {
    id: 'inventory-overview',
    title: 'Inventory Overview',
    description: 'View current stock levels and inventory status',
    path: '/fuel/supplies/overview',
    color: '#43E6A0',
    icon: Package
  },
  {
    id: 'stock-monitoring',
    title: 'Stock Monitoring',
    description: 'Real-time stock level monitoring and alerts',
    path: '/fuel/supplies/monitoring',
    color: '#4F8CFF',
    icon: BarChart3
  },
  {
    id: 'deliveries',
    title: 'Deliveries',
    description: 'Track incoming deliveries and shipments',
    path: '/fuel/supplies/deliveries',
    color: '#6C63FF',
    icon: Truck
  },
  {
    id: 'reorder-management',
    title: 'Reorder Management',
    description: 'Automatic reordering and purchase orders',
    path: '/fuel/supplies/reorder',
    color: '#FFA500',
    icon: Clock
  },
  {
    id: 'quality-control',
    title: 'Quality Control',
    description: 'Quality assurance and testing procedures',
    path: '/fuel/supplies/quality',
    color: '#FF6584',
    icon: CheckCircle
  },
  {
    id: 'cost-analysis',
    title: 'Cost Analysis',
    description: 'Supply costs and procurement analytics',
    path: '/fuel/supplies/costs',
    color: '#9D4EDD',
    icon: DollarSign
  },
  {
    id: 'alerts',
    title: 'Supply Alerts',
    description: 'Low stock alerts and critical notifications',
    path: '/fuel/supplies/alerts',
    color: '#20B2AA',
    icon: AlertTriangle
  },
  {
    id: 'reports',
    title: 'Supply Reports',
    description: 'Detailed supply chain performance reports',
    path: '/fuel/supplies/reports',
    color: '#32CD32',
    icon: TrendingUp
  }
];

export default function FuelSuppliesPage() {
  return (
    <div className="management-container">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span> &gt; </span> 
        <Link to="/fuel">Fuel Operations</Link> <span> &gt; </span> 
        <span>Fuel Supplies</span>
      </nav>
      <h1 className="management-title">Fuel Supplies Dashboard</h1>
      <p className="management-desc">
        Comprehensive fuel inventory management, supply chain monitoring, and procurement analytics for optimal stock control.
      </p>
      <div className="management-cards">
        {suppliesModules.map((module) => (
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
