import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Palette,
  Shield,
  Database,
  Monitor,
  Key,
  FileText
} from 'lucide-react';
import { NavigationCard } from '../../../shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface SettingsModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}

const settingsModules: SettingsModule[] = [
  {
    id: 'profile',
    title: 'Profile Settings',
    description: 'Manage your personal information and account details',
    path: '/settings/profile',
    color: '#43E6A0',
    icon: User
  },
  {
    id: 'security',
    title: 'Security Settings',
    description: 'Password, two-factor authentication, and security options',
    path: '/settings/security',
    color: '#4F8CFF',
    icon: Lock
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure email, SMS, and push notification preferences',
    path: '/settings/notifications',
    color: '#6C63FF',
    icon: Bell
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Theme preferences, dark mode, and display settings',
    path: '/settings/appearance',
    color: '#FFA500',
    icon: Palette
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Data privacy, cookie preferences, and sharing options',
    path: '/settings/privacy',
    color: '#FF6584',
    icon: Shield
  },
  {
    id: 'account',
    title: 'Account Settings',
    description: 'Account management, billing, and subscription details',
    path: '/settings/account',
    color: '#9D4EDD',
    icon: Settings
  },
  {
    id: 'system',
    title: 'System Settings',
    description: 'Application preferences and system configuration',
    path: '/settings/system',
    color: '#20B2AA',
    icon: Monitor
  },
  {
    id: 'data',
    title: 'Data Management',
    description: 'Export data, backup settings, and data retention',
    path: '/settings/data',
    color: '#32CD32',
    icon: Database
  },
  {
    id: 'api',
    title: 'API & Integrations',
    description: 'API keys, webhooks, and third-party integrations',
    path: '/settings/api',
    color: '#FFD700',
    icon: Key
  },
  {
    id: 'logs',
    title: 'Activity Logs',
    description: 'View system logs, audit trails, and activity history',
    path: '/settings/logs',
    color: '#FF69B4',
    icon: FileText
  }
];

export function SettingsPage() {
  return (
    <div className="management-container">
      <Breadcrumb 
        items={[{ label: 'System Settings' }]}
      />
      <h1 className="management-title">System Settings Dashboard</h1>
      <p className="management-desc">
        Application settings, user permissions, and system configuration for comprehensive platform management.
      </p>
      <div className="management-cards">
        {settingsModules.map((module) => (
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
