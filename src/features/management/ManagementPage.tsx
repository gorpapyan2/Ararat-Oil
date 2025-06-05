import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, TrendingUp, Settings } from 'lucide-react';
import { NavigationCard } from '@/shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface ManagementModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const managementModules: ManagementModule[] = [
  {
    id: 'shifts',
    title: 'Shifts',
    description: 'Manage work shifts, opening/closing cash, and shift operations',
    path: '/management/shifts',
    color: '#4F8CFF',
    icon: Clock
  },
  {
    id: 'employees',
    title: 'Employees',
    description: 'Human resources and staff management',
    path: '/management/employees',
    color: '#43E6A0',
    icon: Users
  }
];

const ManagementPage = () => {
  return (
    <div className="management-container">
      <Breadcrumb 
        items={[{ label: 'Management' }]}
      />
      <h1 className="management-title">Management Dashboard</h1>
      <div className="management-desc">
        Comprehensive management system for coordinating work shifts, employee operations, and operational oversight across all departments.
      </div>
      <div className="management-cards">
        {managementModules.map((module) => (
          <NavigationCard
            key={module.id}
            title={module.title}
            href={module.path}
            color={module.color}
            icon={module.icon}
            variant="management"
          />
        ))}
        {/* Placeholder for future modules */}
        <div className="management-card" style={{ backgroundColor: '#6B7280' }}>
          <Settings className="management-card-icon" />
          <span className="management-card-title">More Modules</span>
        </div>
      </div>
    </div>
  );
};

export default ManagementPage; 