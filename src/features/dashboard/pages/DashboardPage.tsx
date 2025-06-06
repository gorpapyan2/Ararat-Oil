/**
 * Dashboard Landing Page - Ararat Oil Management System
 * 
 * Features:
 * - Modern card-based interface with new design system
 * - Full Armenian translation support
 * - Gradient backgrounds and smooth animations
 * - Responsive layout with breadcrumbs
 * - Status indicators and quick actions
 * 
 * @version 3.0.0
 * @author Ararat Oil Development Team
 * @last-updated 2024
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { 
  Users, 
  DollarSign, 
  Fuel,
  BarChart3,
  Settings,
  Building2,
  TrendingUp,
  Activity,
  Gauge,
  Zap,
  Plus,
  Eye
} from 'lucide-react';

import { PageLayout } from '@/layouts/PageLayout';
import { DashboardCard } from '@/shared/components/cards/DashboardCard';
import { MainDashboardGrid, QuickStatsGrid, CardContainer } from '@/shared/components/layout/DashboardGrid';
import { Button } from '@/core/components/ui/button';

interface ModuleCard {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  path: string;
  variant: 'fuel' | 'finance' | 'management' | 'reports' | 'default';
  status?: 'active' | 'warning' | 'inactive' | 'error';
  statusTextKey?: string;
  value?: string | number;
  valueLabelKey?: string;
  quickActions?: Array<{
    labelKey: string;
    icon?: LucideIcon;
    path: string;
  }>;
}

interface QuickStat {
  id: string;
  titleKey: string;
  value: string | number;
  valueLabelKey: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    labelKey: string;
    direction: 'up' | 'down' | 'neutral';
  };
  variant: 'fuel' | 'finance' | 'management' | 'reports';
}

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Quick stats data
  const quickStats: QuickStat[] = [
    {
      id: 'daily-sales',
      titleKey: 'dashboard.stats.dailySales',
      value: '₴125,430',
      valueLabelKey: 'dashboard.stats.today',
      icon: DollarSign,
      trend: {
        value: 12.5,
        labelKey: 'dashboard.stats.fromYesterday',
        direction: 'up'
      },
      variant: 'finance'
    },
    {
      id: 'fuel-level',
      titleKey: 'dashboard.stats.fuelLevel',
      value: '87%',
      valueLabelKey: 'dashboard.stats.totalCapacity',
      icon: Gauge,
      trend: {
        value: -3.2,
        labelKey: 'dashboard.stats.fromLastWeek',
        direction: 'down'
      },
      variant: 'fuel'
    },
    {
      id: 'active-employees',
      titleKey: 'dashboard.stats.activeEmployees',
      value: '24',
      valueLabelKey: 'dashboard.stats.onShift',
      icon: Users,
      variant: 'management'
    },
    {
      id: 'system-status',
      titleKey: 'dashboard.stats.systemStatus',
      value: '99.9%',
      valueLabelKey: 'dashboard.stats.uptime',
      icon: Activity,
      trend: {
        value: 0.1,
        labelKey: 'dashboard.stats.thisMonth',
        direction: 'up'
      },
      variant: 'reports'
    }
  ];

  // Main module cards
  const modules: ModuleCard[] = [
    {
      id: 'human-resources',
      titleKey: 'modules.humanResources.title',
      descriptionKey: 'modules.humanResources.description',
      icon: Users,
      path: '/management',
      variant: 'management',
      status: 'active',
      statusTextKey: 'status.online',
      value: '24',
      valueLabelKey: 'modules.humanResources.activeEmployees',
      quickActions: [
        {
          labelKey: 'quickActions.addEmployee',
          icon: Plus,
          path: '/management/employees/new'
        },
        {
          labelKey: 'quickActions.viewShifts',
          icon: Eye,
          path: '/management/shifts'
        }
      ]
    },
    {
      id: 'finance',
      titleKey: 'modules.finance.title',
      descriptionKey: 'modules.finance.description',
      icon: DollarSign,
      path: '/finance',
      variant: 'finance',
      status: 'active',
      statusTextKey: 'status.syncing',
      value: '₴125,430',
      valueLabelKey: 'modules.finance.todayRevenue',
      quickActions: [
        {
          labelKey: 'quickActions.recordSale',
          icon: Plus,
          path: '/finance/sales/new'
        },
        {
          labelKey: 'quickActions.viewReports',
          icon: BarChart3,
          path: '/finance/reports'
        }
      ]
    },
    {
      id: 'fuel-operations',
      titleKey: 'modules.fuel.title',
      descriptionKey: 'modules.fuel.description',
      icon: Fuel,
      path: '/fuel',
      variant: 'fuel',
      status: 'warning',
      statusTextKey: 'status.maintenance',
      value: '87%',
      valueLabelKey: 'modules.fuel.tankCapacity',
      quickActions: [
        {
          labelKey: 'quickActions.checkTankStatus',
          icon: Gauge,
          path: '/fuel/tanks'
        },
        {
          labelKey: 'quickActions.updatePrices',
          icon: Settings,
          path: '/fuel/prices'
        }
      ]
    },
    {
      id: 'reports-analytics',
      titleKey: 'modules.reports.title',
      descriptionKey: 'modules.reports.description',
      icon: BarChart3,
      path: '/reports',
      variant: 'reports',
      status: 'active',
      statusTextKey: 'status.online',
      quickActions: [
        {
          labelKey: 'quickActions.generateReport',
          icon: Plus,
          path: '/reports/generate'
        },
        {
          labelKey: 'quickActions.viewAnalytics',
          icon: TrendingUp,
          path: '/reports/analytics'
        }
      ]
    },
    {
      id: 'system-management',
      titleKey: 'modules.system.title',
      descriptionKey: 'modules.system.description',
      icon: Settings,
      path: '/settings',
      variant: 'default',
      status: 'active',
      statusTextKey: 'status.online',
      quickActions: [
        {
          labelKey: 'quickActions.userSettings',
          icon: Users,
          path: '/settings/users'
        },
        {
          labelKey: 'quickActions.systemConfig',
          icon: Settings,
          path: '/settings/system'
        }
      ]
    },
    {
      id: 'facility-management',
      titleKey: 'modules.facility.title',
      descriptionKey: 'modules.facility.description',
      icon: Building2,
      path: '/facility',
      variant: 'management',
      status: 'active',
      statusTextKey: 'status.online',
      quickActions: [
        {
          labelKey: 'quickActions.facilityStatus',
          icon: Activity,
          path: '/facility/status'
        },
        {
          labelKey: 'quickActions.maintenance',
          icon: Settings,
          path: '/facility/maintenance'
        }
      ]
    }
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  return (
    <PageLayout
      titleKey="navigation.dashboard"
      descriptionKey="dashboard.welcome"
      icon={BarChart3}
      showBreadcrumbs={false}
      action={
        <Button
          variant="outline"
          onClick={() => navigate('/settings')}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          {t('navigation.settings')}
        </Button>
      }
    >
      {/* Quick Stats Section */}
      <CardContainer
        title={t('dashboard.quickStats')}
        description={t('dashboard.quickStatsDescription')}
      >
        <QuickStatsGrid>
          {quickStats.map((stat) => (
            <DashboardCard
              key={stat.id}
              title={t(stat.titleKey)}
              icon={stat.icon}
              variant={stat.variant}
              value={stat.value}
              valueLabel={t(stat.valueLabelKey)}
              trend={stat.trend ? {
                ...stat.trend,
                label: t(stat.trend.labelKey)
              } : undefined}
              className="hover:scale-105"
            />
          ))}
        </QuickStatsGrid>
      </CardContainer>

      {/* Main Modules Section */}
      <CardContainer
        title={t('dashboard.modules')}
        description={t('dashboard.modulesDescription')}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports/overview')}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            {t('dashboard.viewOverview')}
          </Button>
        }
      >
        <MainDashboardGrid>
          {modules.map((module) => (
            <DashboardCard
              key={module.id}
              title={t(module.titleKey)}
              description={t(module.descriptionKey)}
              icon={module.icon}
              href={module.path}
              variant={module.variant}
              status={module.status}
              statusText={module.statusTextKey ? t(module.statusTextKey) : undefined}
              value={module.value}
              valueLabel={module.valueLabelKey ? t(module.valueLabelKey) : undefined}
              quickActions={module.quickActions?.map(action => ({
                label: t(action.labelKey),
                icon: action.icon,
                onClick: () => handleQuickAction(action.path)
              }))}
            />
          ))}
        </MainDashboardGrid>
      </CardContainer>

      {/* System Status Footer */}
      <div className="mt-12 pt-8 border-t border-border/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-success" />
            <span>{t('dashboard.systemStatus.allSystemsOperational')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{t('dashboard.version')} 3.0.0</span>
            <span>•</span>
            <span>{t('dashboard.lastUpdate')}: {new Date().toLocaleDateString('hy-AM')}</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
