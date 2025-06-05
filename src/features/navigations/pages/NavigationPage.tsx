/**
 * Navigation Dashboard Page - Ararat Oil Management System
 * 
 * Features:
 * - Simple card-based module navigation interface
 * - Clean design matching fuel page pattern
 * - Quick access to all business modules
 * 
 * @version 3.0.0
 * @author Ararat Oil Development Team
 * @last-updated 2024
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, DollarSign, Fuel, BarChart3, Settings } from 'lucide-react';
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface NavigationModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const navigationModules: NavigationModule[] = [
  {
    id: 'management',
    title: 'Human Resources',
    description: 'Employee management, scheduling, and workforce operations.',
    path: '/management',
    color: '#4F8CFF',
    icon: Users
  },
  {
    id: 'finance',
    title: 'Financial Management',
    description: 'Comprehensive financial tracking, budgeting, and analytics.',
    path: '/finance',
    color: '#6C63FF',
    icon: DollarSign
  },
  {
    id: 'fuel',
    title: 'Fuel Operations',
    description: 'Complete petroleum inventory and distribution management.',
    path: '/fuel',
    color: '#FF6584',
    icon: Fuel
  },
  {
    id: 'reports',
    title: 'Business Intelligence',
    description: 'Data analytics, reporting, and performance insights.',
    path: '/reports',
    color: '#43E6A0',
    icon: BarChart3
  },
  {
    id: 'settings',
    title: 'System',
    description: 'Application settings, user permissions, and system config.',
    path: '/settings',
    color: '#FFA500',
    icon: Settings
  }
];

export function NavigationPage() {
  return (
    <div className="management-container">
      <Breadcrumb 
        items={[{ label: 'Dashboard' }]}
      />
      <h1 className="management-title">Ararat Oil Management Platform</h1>
      <p className="management-desc">
        Access comprehensive business management tools for operational efficiency, financial oversight, and strategic decision-making.
      </p>
      <div className="management-cards">
        {navigationModules.map((module) => (
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