import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fuel,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Filter,
  Search,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ThermometerSun,
  Gauge,
  Settings,
  Info,
  Bell
} from 'lucide-react';
import { Badge } from '../../../core/components/ui/primitives/badge';
import { Card } from '../../../core/components/ui/card';
import { Button } from '../../../core/components/ui/button';
import { Input } from '../../../core/components/ui/input';
import { useToast } from '../../../core/hooks/useToast';
import { supabase } from '../../../core/api/supabase';

// Types
interface FuelTank {
  id: string;
  name: string;
  fuel_type: string;
  capacity: number;
  current_level: number;
  percentage: number;
  status: 'normal' | 'low' | 'critical' | 'maintenance';
  temperature: number;
  pressure: number;
  last_refill: string;
  sensor_status: 'online' | 'offline';
  daily_consumption: number;
  efficiency_rating: number;
}

interface FuelMetrics {
  total_capacity: number;
  current_stock: number;
  stock_percentage: number;
  daily_sales: number;
  weekly_revenue: number;
  monthly_revenue: number;
  consumption_rate: number;
  efficiency_score: number;
  low_level_alerts: number;
  maintenance_due: number;
}

interface FuelPrice {
  id: string;
  fuel_type: string;
  current_price: number;
  market_price: number;
  cost_price: number;
  profit_margin: number;
  change_percentage: number;
  last_updated: string;
}

// Fuel service for Supabase integration
const fuelService = {
  getMetrics: async (): Promise<FuelMetrics> => {
    const { data, error } = await supabase.functions.invoke('fuel-analytics', {
      body: { action: 'get_metrics' }
    });
    if (error) throw error;
    return data;
  },

  getTanks: async (): Promise<FuelTank[]> => {
    const { data, error } = await supabase.functions.invoke('fuel-analytics', {
      body: { action: 'get_tank_details' }
    });
    if (error) throw error;
    return data;
  },

  getPrices: async (): Promise<FuelPrice[]> => {
    const { data, error } = await supabase.functions.invoke('fuel-analytics', {
      body: { action: 'get_prices' }
    });
    if (error) throw error;
    return data;
  },

  updateTankLevel: async (tankId: string, newLevel: number) => {
    const { data, error } = await supabase.functions.invoke('fuel-analytics', {
      body: { action: 'update_tank_level', tank_id: tankId, level: newLevel }
    });
    if (error) throw error;
    return data;
  }
};

export const FuelManagementDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'critical' | 'maintenance'>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['fuel-metrics'],
    queryFn: fuelService.getMetrics,
    refetchInterval: 30000,
  });

  const { data: tanks = [], isLoading: tanksLoading } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fuelService.getTanks,
    refetchInterval: 60000,
  });

  const { data: prices = [], isLoading: pricesLoading } = useQuery({
    queryKey: ['fuel-prices'],
    queryFn: fuelService.getPrices,
    refetchInterval: 300000,
  });

  // Mutations
  const updateTankMutation = useMutation({
    mutationFn: ({ tankId, level }: { tankId: string; level: number }) => 
      fuelService.updateTankLevel(tankId, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-tanks'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-metrics'] });
      toast({
        title: 'Tank Updated',
        description: 'Tank level has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update tank level. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Filter data
  const filteredTanks = tanks.filter(tank => {
    const matchesSearch = tank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tank.fuel_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || tank.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Capacity',
      value: metrics?.total_capacity ? `${metrics.total_capacity.toLocaleString()}L` : '--',
      icon: Fuel,
      color: 'blue',
      description: 'Total tank capacity',
      trend: null
    },
    {
      title: 'Current Stock',
      value: metrics?.current_stock ? `${metrics.current_stock.toLocaleString()}L` : '--',
      icon: Gauge,
      color: 'green',
      description: `${metrics?.stock_percentage?.toFixed(1) || '--'}% filled`,
      trend: null
    },
    {
      title: 'Daily Sales',
      value: metrics?.daily_sales ? `${metrics.daily_sales.toLocaleString()}L` : '--',
      icon: TrendingUp,
      color: 'purple',
      description: 'Sold today',
      trend: null
    },
    {
      title: 'Weekly Revenue',
      value: metrics?.weekly_revenue ? `$${metrics.weekly_revenue.toLocaleString()}` : '--',
      icon: RefreshCw,
      color: 'orange',
      description: 'This week',
      trend: null
    }
  ];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['fuel-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['fuel-tanks'] });
    queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
    toast({
      title: 'Data Refreshed',
      description: 'All fuel management data has been updated.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'default';
      case 'low': return 'default';
      case 'critical': return 'destructive';
      case 'maintenance': return 'default';
      default: return 'default';
    }
  };

  const getTankPercentageColor = (percentage: number) => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (metricsError) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Fuel Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't load the fuel management data. Please try again.
          </p>
          <Button onClick={handleRefresh} className="mx-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Fuel Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor fuel tanks, consumption, and pricing analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={metricsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tank
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                    <metric.icon className={`h-5 w-5 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {metricsLoading ? '...' : metric.value}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {metric.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alerts Section */}
      {metrics && (metrics.low_level_alerts > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Low Fuel Level Alert
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {metrics.low_level_alerts} tank{metrics.low_level_alerts > 1 ? 's' : ''} require immediate attention
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tanks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">All Tanks</option>
            <option value="low">Low Level</option>
            <option value="critical">Critical</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Tanks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTanks.map((tank, index) => (
            <motion.div
              key={tank.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {tank.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {tank.fuel_type}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(tank.status) as any} className="capitalize">
                      {tank.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tank Level Visualization */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Current Level
                    </span>
                    <span className={`text-sm font-semibold ${getTankPercentageColor(tank.percentage)}`}>
                      {tank.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tank.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-3 rounded-full ${
                        tank.percentage > 50 
                          ? 'bg-green-500' 
                          : tank.percentage > 25 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{tank.current_level.toLocaleString()}L</span>
                    <span>{tank.capacity.toLocaleString()}L</span>
                  </div>
                </div>

                {/* Tank Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Daily Usage</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {tank.daily_consumption}L
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Efficiency</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {tank.efficiency_rating}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Temperature</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {tank.temperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Sensor</p>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        tank.sensor_status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {tank.sensor_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Maintain
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Current Prices Section */}
      {prices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Current Fuel Prices
              </h3>
              <Badge variant="secondary">
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prices.map((price) => (
                <div key={price.fuel_type} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {price.fuel_type}
                    </h4>
                    <div className={`flex items-center space-x-1 ${
                      price.change_percentage > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {price.change_percentage > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">
                        {Math.abs(price.change_percentage)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${price.current_price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Market: ${price.market_price.toFixed(2)} | Margin: {price.profit_margin}%
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {(tanksLoading || metricsLoading) && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading fuel management data...</p>
        </div>
      )}

      {/* Empty State */}
      {!tanksLoading && filteredTanks.length === 0 && (
        <Card className="p-8 text-center">
          <Fuel className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Tanks Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Start by adding your first fuel tank.'
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tank
          </Button>
        </Card>
      )}
    </div>
  );
}; 