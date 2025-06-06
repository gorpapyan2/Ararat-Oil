import React from 'react';
import { 
  Shield, 
  Users, 
  Bell, 
  Palette, 
  Monitor, 
  Database, 
  Key, 
  FileText,
  Settings,
  Globe,
  Lock,
  Mail,
  Activity,
  Smartphone,
  Cloud,
  HardDrive,
  Wifi,
  Clock,
  Zap,
  Package
} from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { ModuleCard, StatsCard } from '@/shared/components/cards';

interface SettingsModule {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  category?: string;
  badge?: string;
  stats?: {
    count: string;
    label: string;
  };
  color: string;
  bgGradient: string;
  iconGradient: string;
  textColor: string;
}

const settingsModules: SettingsModule[] = [
  // Core Settings
  {
    id: 'general',
    title: 'General Settings',
    description: 'Basic application settings, preferences, and default configurations.',
    path: '/settings/general',
    icon: Settings,
    category: 'Core Settings',
    badge: 'Core',
    stats: { count: '23 Options', label: 'Configured' },
    color: 'border-blue-500/30',
    bgGradient: 'bg-gradient-to-br from-blue-500/5 to-blue-500/10',
    iconGradient: 'from-blue-500/80 to-blue-500',
    textColor: 'text-blue-600'
  },
  {
    id: 'security',
    title: 'Security & Authentication',
    description: 'Configure security policies, authentication methods, and access controls.',
    path: '/settings/security',
    icon: Shield,
    category: 'Core Settings',
    badge: 'Important',
    stats: { count: '98%', label: 'Security Score' },
    color: 'border-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-500/5 to-emerald-500/10',
    iconGradient: 'from-emerald-500/80 to-emerald-500',
    textColor: 'text-emerald-600'
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'Manage user accounts, roles, permissions, and access levels.',
    path: '/settings/users',
    icon: Users,
    category: 'Core Settings',
    badge: 'Core',
    stats: { count: '45 Users', label: '+3 This Month' },
    color: 'border-purple-500/30',
    bgGradient: 'bg-gradient-to-br from-purple-500/5 to-purple-500/10',
    iconGradient: 'from-purple-500/80 to-purple-500',
    textColor: 'text-purple-600'
  },
  {
    id: 'permissions',
    title: 'Permissions & Roles',
    description: 'Define user roles, permission levels, and access hierarchies.',
    path: '/settings/permissions',
    icon: Lock,
    category: 'Core Settings',
    stats: { count: '8 Roles', label: 'Active' },
    color: 'border-orange-500/30',
    bgGradient: 'bg-gradient-to-br from-orange-500/5 to-orange-500/10',
    iconGradient: 'from-orange-500/80 to-orange-500',
    textColor: 'text-orange-600'
  },

  // System & Interface
  {
    id: 'appearance',
    title: 'Appearance & Theme',
    description: 'Customize UI theme, colors, and visual preferences.',
    path: '/settings/appearance',
    icon: Palette,
    category: 'System & Interface',
    badge: 'New',
    stats: { count: '5 Themes', label: 'Available' },
    color: 'border-pink-500/30',
    bgGradient: 'bg-gradient-to-br from-pink-500/5 to-pink-500/10',
    iconGradient: 'from-pink-500/80 to-pink-500',
    textColor: 'text-pink-600'
  },
  {
    id: 'system',
    title: 'System Configuration',
    description: 'Advanced system settings, performance tuning, and optimization.',
    path: '/settings/system',
    icon: Monitor,
    category: 'System & Interface',
    badge: 'Advanced',
    stats: { count: '99.2%', label: 'Uptime' },
    color: 'border-cyan-500/30',
    bgGradient: 'bg-gradient-to-br from-cyan-500/5 to-cyan-500/10',
    iconGradient: 'from-cyan-500/80 to-cyan-500',
    textColor: 'text-cyan-600'
  },
  {
    id: 'localization',
    title: 'Language & Region',
    description: 'Configure language, timezone, currency, and regional settings.',
    path: '/settings/localization',
    icon: Globe,
    category: 'System & Interface',
    stats: { count: '12 Languages', label: 'Supported' },
    color: 'border-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-teal-500/5 to-teal-500/10',
    iconGradient: 'from-teal-500/80 to-teal-500',
    textColor: 'text-teal-600'
  },
  {
    id: 'mobile',
    title: 'Mobile Settings',
    description: 'Configure mobile app preferences, push notifications, and offline settings.',
    path: '/settings/mobile',
    icon: Smartphone,
    category: 'System & Interface',
    badge: 'Mobile',
    stats: { count: '3 Devices', label: 'Connected' },
    color: 'border-indigo-500/30',
    bgGradient: 'bg-gradient-to-br from-indigo-500/5 to-indigo-500/10',
    iconGradient: 'from-indigo-500/80 to-indigo-500',
    textColor: 'text-indigo-600'
  },

  // Communications & Data
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure email, SMS, and push notification preferences.',
    path: '/settings/notifications',
    icon: Bell,
    category: 'Communications & Data',
    badge: 'Smart',
    stats: { count: '12 Alerts', label: 'Active' },
    color: 'border-amber-500/30',
    bgGradient: 'bg-gradient-to-br from-amber-500/5 to-amber-500/10',
    iconGradient: 'from-amber-500/80 to-amber-500',
    textColor: 'text-amber-600'
  },
  {
    id: 'email',
    title: 'Email Settings',
    description: 'SMTP configuration, email templates, and delivery settings.',
    path: '/settings/email',
    icon: Mail,
    category: 'Communications & Data',
    stats: { count: '2.4K', label: 'Emails Sent' },
    color: 'border-red-500/30',
    bgGradient: 'bg-gradient-to-br from-red-500/5 to-red-500/10',
    iconGradient: 'from-red-500/80 to-red-500',
    textColor: 'text-red-600'
  },
  {
    id: 'data',
    title: 'Data Management',
    description: 'Export data, backup settings, and data retention policies.',
    path: '/settings/data',
    icon: Database,
    category: 'Communications & Data',
    badge: 'Important',
    stats: { count: '2.4GB', label: 'Data Stored' },
    color: 'border-green-500/30',
    bgGradient: 'bg-gradient-to-br from-green-500/5 to-green-500/10',
    iconGradient: 'from-green-500/80 to-green-500',
    textColor: 'text-green-600'
  },
  {
    id: 'backup',
    title: 'Backup & Recovery',
    description: 'Automated backups, data recovery options, and disaster recovery planning.',
    path: '/settings/backup',
    icon: HardDrive,
    category: 'Communications & Data',
    badge: 'Auto',
    stats: { count: 'Daily', label: 'Backup Schedule' },
    color: 'border-slate-500/30',
    bgGradient: 'bg-gradient-to-br from-slate-500/5 to-slate-500/10',
    iconGradient: 'from-slate-500/80 to-slate-500',
    textColor: 'text-slate-600'
  },

  // Advanced & Integration
  {
    id: 'api',
    title: 'API & Integrations',
    description: 'API keys, webhooks, and third-party system integrations.',
    path: '/settings/api',
    icon: Key,
    category: 'Advanced & Integration',
    badge: 'Developer',
    stats: { count: '8 APIs', label: 'Connected' },
    color: 'border-violet-500/30',
    bgGradient: 'bg-gradient-to-br from-violet-500/5 to-violet-500/10',
    iconGradient: 'from-violet-500/80 to-violet-500',
    textColor: 'text-violet-600'
  },
  {
    id: 'cloud',
    title: 'Cloud Services',
    description: 'Cloud storage, sync settings, and remote service configurations.',
    path: '/settings/cloud',
    icon: Cloud,
    category: 'Advanced & Integration',
    badge: 'Cloud',
    stats: { count: '99.9%', label: 'Availability' },
    color: 'border-sky-500/30',
    bgGradient: 'bg-gradient-to-br from-sky-500/5 to-sky-500/10',
    iconGradient: 'from-sky-500/80 to-sky-500',
    textColor: 'text-sky-600'
  },
  {
    id: 'network',
    title: 'Network Settings',
    description: 'Network configuration, proxy settings, and connectivity options.',
    path: '/settings/network',
    icon: Wifi,
    category: 'Advanced & Integration',
    stats: { count: 'Stable', label: 'Connection' },
    color: 'border-lime-500/30',
    bgGradient: 'bg-gradient-to-br from-lime-500/5 to-lime-500/10',
    iconGradient: 'from-lime-500/80 to-lime-500',
    textColor: 'text-lime-600'
  },
  {
    id: 'performance',
    title: 'Performance Tuning',
    description: 'System optimization, caching settings, and performance monitoring.',
    path: '/settings/performance',
    icon: Zap,
    category: 'Advanced & Integration',
    badge: 'Optimization',
    stats: { count: '15ms', label: 'Avg Response' },
    color: 'border-yellow-500/30',
    bgGradient: 'bg-gradient-to-br from-yellow-500/5 to-yellow-500/10',
    iconGradient: 'from-yellow-500/80 to-yellow-500',
    textColor: 'text-yellow-600'
  },

  // Monitoring & Maintenance
  {
    id: 'logs',
    title: 'Activity Logs',
    description: 'View system logs, audit trails, and user activity history.',
    path: '/settings/logs',
    icon: FileText,
    category: 'Monitoring & Maintenance',
    badge: 'Analytics',
    stats: { count: '15.2K', label: 'Log Entries' },
    color: 'border-gray-500/30',
    bgGradient: 'bg-gradient-to-br from-gray-500/5 to-gray-500/10',
    iconGradient: 'from-gray-500/80 to-gray-500',
    textColor: 'text-gray-600'
  },
  {
    id: 'monitoring',
    title: 'System Monitoring',
    description: 'Performance metrics, system health, and resource usage.',
    path: '/settings/monitoring',
    icon: Activity,
    category: 'Monitoring & Maintenance',
    badge: 'Live',
    stats: { count: '99.2%', label: 'Uptime' },
    color: 'border-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-500/5 to-emerald-500/10',
    iconGradient: 'from-emerald-500/80 to-emerald-500',
    textColor: 'text-emerald-600'
  },
  {
    id: 'maintenance',
    title: 'System Maintenance',
    description: 'Scheduled maintenance, system updates, and automated tasks.',
    path: '/settings/maintenance',
    icon: Clock,
    category: 'Monitoring & Maintenance',
    badge: 'Scheduled',
    stats: { count: '3 Tasks', label: 'Pending' },
    color: 'border-stone-500/30',
    bgGradient: 'bg-gradient-to-br from-stone-500/5 to-stone-500/10',
    iconGradient: 'from-stone-500/80 to-stone-500',
    textColor: 'text-stone-600'
  },
  {
    id: 'updates',
    title: 'System Updates',
    description: 'Manage software updates, patches, and version control.',
    path: '/settings/updates',
    icon: Package,
    category: 'Monitoring & Maintenance',
    badge: 'Updates',
    stats: { count: '2 Available', label: 'Updates' },
    color: 'border-zinc-500/30',
    bgGradient: 'bg-gradient-to-br from-zinc-500/5 to-zinc-500/10',
    iconGradient: 'from-zinc-500/80 to-zinc-500',
    textColor: 'text-zinc-600'
  }
];

export function SettingsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'System Settings', href: '/settings' }
  ];

  // Group modules by category
  const groupedModules = settingsModules.reduce((acc, module) => {
    const category = module.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, SettingsModule[]>);

  const quickStats = [
    {
      title: 'Users',
      value: '45',
      icon: Users,
      color: 'from-blue-500/80 to-blue-500',
      description: '↗ +3 this month'
    },
    {
      title: 'Security',
      value: '98%',
      icon: Shield,
      color: 'from-green-500/80 to-green-500',
      description: '✓ High security'
    },
    {
      title: 'Storage',
      value: '2.4GB',
      icon: Database,
      color: 'from-purple-500/80 to-purple-500',
      description: '↗ +12% growth'
    },
    {
      title: 'Uptime',
      value: '99.2%',
      icon: Activity,
      color: 'from-amber-500/80 to-amber-500',
      description: '↗ Excellent'
    }
  ];

  return (
    <WindowContainer
      title="System Settings"
      subtitle="Configure and manage your system preferences, security settings, and operational parameters"
      breadcrumbItems={breadcrumbItems}
    >
      {/* Quick Stats Overview */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              description={stat.description}
            />
          ))}
        </div>
      </div>

      {/* Settings Modules */}
      <div className="space-y-8">
        {Object.entries(groupedModules).map(([category, modules]) => (
          <div key={category}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-[#EEEFE7] mb-2">
                {category}
              </h2>
              <div className="h-px bg-gradient-to-r from-blue-500 via-purple-500 to-transparent dark:from-blue-400 dark:via-purple-400 dark:to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  path={module.path}
                  icon={module.icon}
                  badge={module.badge}
                  stats={module.stats}
                  color={module.color}
                  bgGradient={module.bgGradient}
                  iconGradient={module.iconGradient}
                  textColor={module.textColor}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </WindowContainer>
  );
}
