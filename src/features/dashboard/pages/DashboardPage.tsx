import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  BarChart3, 
  Activity, 
  Zap, 
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Grid3X3,
  Plus,
  RefreshCw,
  ExternalLink,
  Fuel,
  Calendar,
  Bell,
  ChevronRight
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Progress } from '@/core/components/ui/progress';
import { FeatureCard } from '@/core/components/ui/FeatureCard';
import { featuresConfig, getFeaturesByCategory } from '@/core/config/features';
import { cn } from '@/shared/utils';

interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  target?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  color: string;
  priority: 'high' | 'medium' | 'low';
  enabled: boolean;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'supply' | 'employee' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
  impact?: 'high' | 'medium' | 'low';
}

interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'error';
  description: string;
}

export function DashboardPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced metrics with targets and better context
  const metrics: DashboardMetric[] = [
    {
      id: 'revenue',
      title: 'Daily Revenue',
      value: '₽1,234,567',
      change: 12.5,
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      description: 'vs. yesterday',
      target: '₽1.5M target'
    },
    {
      id: 'fuel_sold',
      title: 'Fuel Volume',
      value: '45,678 L',
      change: -3.2,
      trend: 'down',
      icon: Fuel,
      color: 'blue',
      description: 'vs. yesterday',
      target: '50K L target'
    },
    {
      id: 'customers',
      title: 'Active Customers',
      value: '1,847',
      change: 8.1,
      trend: 'up',
      icon: Users,
      color: 'purple',
      description: 'served today',
      target: '2K target'
    },
    {
      id: 'efficiency',
      title: 'System Efficiency',
      value: '94.2%',
      change: 2.1,
      trend: 'up',
      icon: Target,
      color: 'orange',
      description: 'operational uptime',
      target: '95% target'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'add_employee',
      title: 'Add Employee',
      description: 'Register new team member',
      path: '/employees',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      priority: 'high',
      enabled: true
    },
    {
      id: 'fuel_supply',
      title: 'Log Fuel Delivery',
      description: 'Record incoming fuel supply',
      path: '/fuel-management/supplies',
      icon: Plus,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      priority: 'high',
      enabled: true
    },
    {
      id: 'view_reports',
      title: 'Generate Report',
      description: 'Create business analytics',
      path: '/reports',
      icon: BarChart3,
      color: 'bg-purple-500 hover:bg-purple-600',
      priority: 'medium',
      enabled: true
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure application',
      path: '/settings',
      icon: Activity,
      color: 'bg-slate-500 hover:bg-slate-600',
      priority: 'low',
      enabled: true
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'sale',
      title: 'Large Fuel Transaction',
      description: 'Customer purchased 150L of Premium fuel - ₽12,450',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'success',
      impact: 'high'
    },
    {
      id: '2',
      type: 'supply',
      title: 'Fuel Delivery Completed',
      description: 'Tank #3 refilled with 5,000L of Regular fuel',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'success',
      impact: 'medium'
    },
    {
      id: '3',
      type: 'employee',
      title: 'Shift Transition',
      description: 'Evening shift started - 3 employees checked in',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'info',
      impact: 'low'
    },
    {
      id: '4',
      type: 'system',
      title: 'Low Fuel Alert',
      description: 'Tank #1 fuel level below 10% - immediate attention required',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      status: 'warning',
      impact: 'high'
    }
  ];

  const systemMetrics: SystemMetric[] = [
    { name: 'API Performance', value: 98, status: 'healthy', description: '< 200ms avg response' },
    { name: 'System Uptime', value: 99.9, status: 'healthy', description: '30 days running' },
    { name: 'Database Health', value: 95, status: 'warning', description: 'Minor optimization needed' }
  ];

  // Get featured modules
  const featuredFeatures = useMemo(() => {
    return featuresConfig.features
      .filter(feature => feature.status === 'active')
      .slice(0, 6);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-600 dark:text-emerald-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getMetricColorClass = (color: string) => {
    const colors = {
      emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Operations Dashboard
              </h1>
              <Badge variant="outline" className="text-xs font-medium">
                Live
              </Badge>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl">
              Real-time monitoring of your fuel station operations, performance metrics, and business insights.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              size="sm"
              disabled={isRefreshing}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link to="/navigation">
                <Grid3X3 className="w-4 h-4 mr-2" />
                Navigation Center
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* KPI Metrics Grid - 12 Column System */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      getMetricColorClass(metric.color)
                    )}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <Activity className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        metric.trend === 'up' ? "text-emerald-600 dark:text-emerald-400" :
                        metric.trend === 'down' ? "text-red-600 dark:text-red-400" :
                        "text-gray-500"
                      )}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{metric.description}</span>
                      {metric.target && (
                        <span className="text-gray-400">{metric.target}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Quick Actions - Improved Usability */}
        <section>
          <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-500/10">
                    <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Common operations and shortcuts
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className={cn(
                        "h-auto p-4 w-full justify-start text-left",
                        "hover:shadow-md transition-all duration-200",
                        "border-gray-200 dark:border-gray-800",
                        !action.enabled && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={!action.enabled}
                    >
                      <Link to={action.path}>
                        <div className="flex items-center gap-3 w-full">
                          <div className={cn("p-2.5 rounded-lg text-white transition-colors", action.color)}>
                            <action.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {action.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {action.description}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Featured Business Modules */}
          <div className="xl:col-span-2">
            <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                      <Grid3X3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Business Modules</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Core operational systems
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/navigation" className="flex items-center gap-1">
                      View all
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <FeatureCard
                        feature={feature}
                        size="small"
                        showDescription={false}
                        className="h-full hover:shadow-md transition-shadow duration-200"
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Activity Timeline */}
          <div>
            <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                      <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Activity Feed</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Recent operations
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <AnimatePresence>
                    {recentActivities.map((activity, index) => {
                      const StatusIcon = getStatusIcon(activity.status);
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                            "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                            "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                          )}
                        >
                          <div className={cn(
                            "p-1.5 rounded-full flex-shrink-0 mt-0.5",
                            activity.status === 'success' && "bg-emerald-100 dark:bg-emerald-500/20",
                            activity.status === 'warning' && "bg-amber-100 dark:bg-amber-500/20",
                            activity.status === 'error' && "bg-red-100 dark:bg-red-500/20",
                            activity.status === 'info' && "bg-blue-100 dark:bg-blue-500/20"
                          )}>
                            <StatusIcon className={cn("w-3 h-3", getStatusColor(activity.status))} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm text-gray-900 dark:text-white leading-5">
                                {activity.title}
                              </p>
                              {activity.impact && (
                                <Badge 
                                  variant={activity.impact === 'high' ? 'destructive' : 'secondary'}
                                  className="text-xs px-1.5 py-0.5"
                                >
                                  {activity.impact}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-4">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {formatTimeAgo(activity.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    View all activity
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced System Health */}
        <section>
          <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10">
                  <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">System Health</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Infrastructure monitoring and performance
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {systemMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {metric.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {metric.value}%
                        </span>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          metric.status === 'healthy' && "bg-emerald-500",
                          metric.status === 'warning' && "bg-amber-500",
                          metric.status === 'error' && "bg-red-500"
                        )} />
                      </div>
                    </div>
                    <Progress 
                      value={metric.value} 
                      className={cn(
                        "h-2",
                        metric.status === 'healthy' && "[&>div]:bg-emerald-500",
                        metric.status === 'warning' && "[&>div]:bg-amber-500",
                        metric.status === 'error' && "[&>div]:bg-red-500"
                      )} 
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {metric.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
