import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Activity, 
  Wrench, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Monitor
} from 'lucide-react';
import { NavigationCard } from '@/shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface FillingSystemModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const fillingSystemModules: FillingSystemModule[] = [
  {
    id: 'pump-control',
    title: 'Pump Control',
    description: 'Monitor and control fuel dispensing pumps',
    path: '/fuel/filling-systems/pumps',
    color: '#43E6A0',
    icon: Settings
  },
  {
    id: 'system-monitoring',
    title: 'System Monitoring',
    description: 'Real-time filling system status and performance',
    path: '/fuel/filling-systems/monitoring',
    color: '#4F8CFF',
    icon: Monitor
  },
  {
    id: 'dispensing-analytics',
    title: 'Dispensing Analytics',
    description: 'Fuel dispensing patterns and usage analytics',
    path: '/fuel/filling-systems/analytics',
    color: '#6C63FF',
    icon: BarChart3
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'Pump maintenance schedules and service records',
    path: '/fuel/filling-systems/maintenance',
    color: '#FFA500',
    icon: Wrench
  },
  {
    id: 'system-alerts',
    title: 'System Alerts',
    description: 'Equipment alerts and malfunction notifications',
    path: '/fuel/filling-systems/alerts',
    color: '#FF6584',
    icon: AlertTriangle
  },
  {
    id: 'calibration',
    title: 'Calibration',
    description: 'Pump calibration and accuracy verification',
    path: '/fuel/filling-systems/calibration',
    color: '#9D4EDD',
    icon: CheckCircle
  },
  {
    id: 'performance',
    title: 'Performance Metrics',
    description: 'System efficiency and performance tracking',
    path: '/fuel/filling-systems/performance',
    color: '#20B2AA',
    icon: TrendingUp
  },
  {
    id: 'activity-logs',
    title: 'Activity Logs',
    description: 'Transaction logs and system activity history',
    path: '/fuel/filling-systems/logs',
    color: '#32CD32',
    icon: Activity
  }
];

export default function FillingSystemsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fuel Operations', href: '/fuel' },
    { label: 'Filling Systems', href: '/fuel/filling-systems' }
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
                Filling Systems Management
              </h1>
              <p className="page-description">
                Monitor and manage fuel dispensing systems, pump maintenance, and operational efficiency.
              </p>
            </div>

            {/* Module Cards */}
            <div className="management-cards">
              {fillingSystemModules.map((module) => (
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
