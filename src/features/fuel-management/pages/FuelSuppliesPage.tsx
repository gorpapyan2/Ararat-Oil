import React from 'react';
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
import { Breadcrumb } from '../../../shared/components/layout/Breadcrumb';

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
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fuel Operations', href: '/fuel' },
    { label: 'Fuel Supplies', href: '/fuel/supplies' }
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
                Fuel Supplies Dashboard
              </h1>
              <p className="page-description">
                Comprehensive fuel supply management for inventory tracking, delivery coordination, and operational efficiency.
              </p>
            </div>

            {/* Module Cards */}
            <div className="management-cards">
              {suppliesModules.map((module) => (
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
