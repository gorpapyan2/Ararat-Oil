import React, { useEffect, useState } from 'react';
import { 
  Gauge, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  BarChart3,
  Target,
  Database,
  DollarSign,
  Fuel,
  Settings,
  Droplets,
  Zap,
  Thermometer,
  Users,
  Clock,
  Shield,
  Truck,
  MapPin,
  Bell,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { StatsCard } from '@/shared/components/cards';
import { useTranslation } from 'react-i18next';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { hy } from 'date-fns/locale';

interface TankStatus {
  id: string;
  name: string;
  fuelType: string;
  currentLevel: number;
  capacity: number;
  temperature: number;
  pressure: number;
  status: 'optimal' | 'warning' | 'critical';
  lastUpdated: string;
}

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  location?: string;
}

// Updated mock data with ISO date strings
const tankData: TankStatus[] = [
  {
    id: 'tank-1',
    name: 'Tank A1',
    fuelType: 'Premium 95',
    currentLevel: 87.5,
    capacity: 50000,
    temperature: 18.5,
    pressure: 1.2,
    status: 'optimal',
    lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 minutes ago
  },
  {
    id: 'tank-2',
    name: 'Tank A2',
    fuelType: 'Diesel',
    currentLevel: 45.2,
    capacity: 40000,
    temperature: 19.1,
    pressure: 1.1,
    status: 'warning',
    lastUpdated: new Date(Date.now() - 1 * 60 * 1000).toISOString() // 1 minute ago
  },
  {
    id: 'tank-3',
    name: 'Tank B1',
    fuelType: 'Premium 98',
    currentLevel: 92.8,
    capacity: 35000,
    temperature: 18.8,
    pressure: 1.3,
    status: 'optimal',
    lastUpdated: new Date(Date.now() - 3 * 60 * 1000).toISOString() // 3 minutes ago
  },
  {
    id: 'tank-4',
    name: 'Tank B2',
    fuelType: 'Regular 87',
    currentLevel: 23.1,
    capacity: 45000,
    temperature: 20.2,
    pressure: 1.0,
    status: 'critical',
    lastUpdated: new Date(Date.now() - 1 * 60 * 1000).toISOString() // 1 minute ago
  },
  {
    id: 'tank-5',
    name: 'Tank C1',
    fuelType: 'Diesel Premium',
    currentLevel: 78.6,
    capacity: 30000,
    temperature: 18.9,
    pressure: 1.2,
    status: 'optimal',
    lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 minutes ago
  },
  {
    id: 'tank-6',
    name: 'Tank C2',
    fuelType: 'Regular 91',
    currentLevel: 65.4,
    capacity: 40000,
    temperature: 19.5,
    pressure: 1.1,
    status: 'optimal',
    lastUpdated: new Date(Date.now() - 4 * 60 * 1000).toISOString() // 4 minutes ago
  }
];

const alerts: AlertItem[] = [
  {
    id: 'alert-1',
    type: 'critical',
    title: 'Low Fuel Level',
    description: 'Tank B2 (Regular 87) is below 25% capacity',
    time: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    location: 'Tank B2'
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Maintenance Due',
    description: 'Pump #3 scheduled for routine maintenance',
    time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    location: 'Pump Station #3'
  },
  {
    id: 'alert-3',
    type: 'info',
    title: 'Delivery Completed',
    description: 'Premium 95 delivery completed successfully',
    time: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    location: 'Tank A1'
  }
];

const getTankStatusColor = (status: string) => {
  switch (status) {
    case 'optimal':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'critical':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getAlertColor = (type: string) => {
  switch (type) {
    case 'critical':
      return 'border-red-500/30 bg-red-500/5';
    case 'warning':
      return 'border-yellow-500/30 bg-yellow-500/5';
    case 'info':
      return 'border-blue-500/30 bg-blue-500/5';
    default:
      return 'border-gray-500/30 bg-gray-500/5';
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'critical':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

export default function FuelDashboardPage() {
  const { t } = useTranslation();
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  
  // Format date as relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: hy });
    } catch (error) {
      return "Unknown";
    }
  };
  
  // Update last updated time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toISOString());
    }, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const breadcrumbItems = [
    { label: t('common.home'), href: '/' },
    { label: t('modules.fuel.title'), href: '/fuel' },
    { label: t('modules.fuel.dashboard'), href: '/fuel/dashboard' }
  ];

  const overallStats = [
    {
      title: t('modules.fuel.totalVolume'),
      value: '187.2K L',
      icon: Droplets,
      color: 'from-blue-500/80 to-blue-500',
      description: t('modules.fuel.volumeChange', { change: '+2.3%' })
    },
    {
      title: t('modules.fuel.dailySales'),
      value: '₺18.7K',
      icon: TrendingUp,
      color: 'from-green-500/80 to-green-500',
      description: t('modules.fuel.salesChange', { change: '+12.3%' })
    },
    {
      title: t('modules.fuel.activePumps'),
      value: '8/8',
      icon: Zap,
      color: 'from-purple-500/80 to-purple-500',
      description: t('modules.fuel.pumpsStatus')
    },
    {
      title: t('modules.fuel.avgTemperature'),
      value: '18.9°C',
      icon: Thermometer,
      color: 'from-amber-500/80 to-amber-500',
      description: t('modules.fuel.tempStatus')
    }
  ];

  const operationalStats = [
    {
      title: t('modules.fuel.transactions'),
      value: '1,234',
      icon: BarChart3,
      color: 'from-cyan-500/80 to-cyan-500',
      description: t('common.today')
    },
    {
      title: t('modules.fuel.customers'),
      value: '456',
      icon: Users,
      color: 'from-pink-500/80 to-pink-500',
      description: t('modules.fuel.activeToday')
    },
    {
      title: t('modules.fuel.efficiency'),
      value: '94.2%',
      icon: Target,
      color: 'from-indigo-500/80 to-indigo-500',
      description: t('modules.fuel.systemEfficiency')
    },
    {
      title: t('modules.fuel.uptime'),
      value: '99.8%',
      icon: Shield,
      color: 'from-emerald-500/80 to-emerald-500',
      description: t('modules.fuel.last30Days')
    }
  ];

  return (
    <WindowContainer
      title={t('modules.fuel.dashboard')}
      subtitle={t('modules.fuel.dashboardDesc')}
      breadcrumbItems={breadcrumbItems}
    >
      {/* Main KPI Stats */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-4">
          {t('modules.fuel.keyPerformance')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overallStats.map((stat, index) => (
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

      {/* Tank Status Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
            {t('modules.fuel.tankStatusOverview')}
          </h3>
          <div className="text-sm text-muted-foreground">
            {t('modules.fuel.lastUpdated')}: {formatRelativeTime(lastUpdated)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tankData.map((tank) => (
            <div
              key={tank.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getTankStatusColor(tank.status)}`}></div>
                  <h4 className="font-semibold text-card-foreground">{tank.name}</h4>
                </div>
                <span className="text-xs text-muted-foreground">{formatRelativeTime(tank.lastUpdated)}</span>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('modules.fuel.fuelType')}:</span>
                  <span className="font-medium text-card-foreground">{tank.fuelType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('modules.fuel.level')}:</span>
                  <span className="font-medium text-card-foreground">{tank.currentLevel}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('modules.fuel.volume')}:</span>
                  <span className="font-medium text-card-foreground">
                    {((tank.currentLevel / 100) * tank.capacity).toLocaleString()} L
                  </span>
                </div>
              </div>

              {/* Level Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      tank.currentLevel > 75 ? 'bg-green-500' :
                      tank.currentLevel > 50 ? 'bg-yellow-500' :
                      tank.currentLevel > 25 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${tank.currentLevel}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3" />
                  <span>{tank.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  <span>{tank.pressure} bar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Stats & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Operational Metrics */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-4">
            {t('modules.fuel.operationalMetrics')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {operationalStats.map((stat, index) => (
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

        {/* Recent Alerts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
              {t('modules.fuel.systemAlerts')}
            </h3>
            <span className="text-sm text-muted-foreground">
              {alerts.length} {t('modules.fuel.alerts')}
            </span>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-3 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-card-foreground truncate">
                        {t(`modules.fuel.alerts.${alert.title.toLowerCase().replace(/\s+/g, '')}`)}
                      </h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatRelativeTime(alert.time)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {alert.description}
                    </p>
                    {alert.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full text-sm text-accent hover:text-accent/80 py-2 transition-colors">
              {t('modules.fuel.viewAllAlerts')} →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-4">
          {t('common.quickActions')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Fuel className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">{t('modules.fuel.addFuel')}</div>
              <div className="text-xs text-muted-foreground">{t('modules.fuel.recordDelivery')}</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">{t('modules.fuel.generateReport')}</div>
              <div className="text-xs text-muted-foreground">{t('modules.fuel.dailySummary')}</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Settings className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">{t('modules.fuel.systemCheck')}</div>
              <div className="text-xs text-muted-foreground">{t('modules.fuel.runDiagnostics')}</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="font-medium text-card-foreground">{t('modules.fuel.scheduleMaintenance')}</div>
              <div className="text-xs text-muted-foreground">{t('modules.fuel.planService')}</div>
            </div>
          </button>
        </div>
      </div>
    </WindowContainer>
  );
}