import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Filter,
  Search,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  BarChart3,
  Settings
} from 'lucide-react';
import { Badge } from '../../../core/components/ui/primitives/badge';
import { Card } from '../../../core/components/ui/card';
import { Button } from '../../../core/components/ui/button';
import { Input } from '../../../core/components/ui/input';
import { useToast } from '../../../core/hooks/useToast';
import { supabase } from '../../../core/api/supabase';

// Types
interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  hourly_rate: number;
  phone: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'on_shift';
  hire_date: string;
  performance_rating: number;
}

interface Shift {
  id: string;
  employee_id: string;
  employee_name: string;
  start_time: string;
  end_time: string;
  scheduled_hours: number;
  actual_hours: number;
  break_duration: number;
  status: 'scheduled' | 'active' | 'completed' | 'missed' | 'cancelled';
  position: string;
  notes?: string;
  clock_in_time?: string;
  clock_out_time?: string;
  overtime_hours: number;
  total_pay: number;
  shift_rating?: number;
}

interface ShiftMetrics {
  total_employees: number;
  employees_on_shift: number;
  scheduled_shifts_today: number;
  completed_shifts_today: number;
  attendance_rate: number;
  average_hours_per_employee: number;
  overtime_hours_this_week: number;
  total_labor_cost_today: number;
  shift_coverage: number;
  no_show_rate: number;
  average_shift_rating: number;
  labor_efficiency: number;
}

// Shifts service for Supabase integration
const shiftsService = {
  getMetrics: async (): Promise<ShiftMetrics> => {
    const { data, error } = await supabase.functions.invoke('shifts-analytics', {
      body: { action: 'get_metrics' }
    });
    if (error) throw error;
    return data;
  },

  getEmployees: async (): Promise<Employee[]> => {
    const { data, error } = await supabase.functions.invoke('shifts-analytics', {
      body: { action: 'get_employees' }
    });
    if (error) throw error;
    return data;
  },

  getShifts: async (): Promise<Shift[]> => {
    const { data, error } = await supabase.functions.invoke('shifts-analytics', {
      body: { action: 'get_shifts' }
    });
    if (error) throw error;
    return data;
  },

  clockIn: async (employeeId: string) => {
    const { data, error } = await supabase.functions.invoke('shifts-analytics', {
      body: { action: 'clock_in', employee_id: employeeId }
    });
    if (error) throw error;
    return data;
  },

  clockOut: async (employeeId: string) => {
    const { data, error } = await supabase.functions.invoke('shifts-analytics', {
      body: { action: 'clock_out', employee_id: employeeId }
    });
    if (error) throw error;
    return data;
  },

  updateShift: async (shiftId: string, updates: Partial<Shift>) => {
    const { data, error } = await supabase.functions.invoke('shifts-analytics', {
      body: { action: 'update_shift', shift_id: shiftId, ...updates }
    });
    if (error) throw error;
    return data;
  }
};

export const ShiftsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'scheduled' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'employees' | 'shifts'>('employees');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['shift-metrics'],
    queryFn: shiftsService.getMetrics,
    refetchInterval: 30000,
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: shiftsService.getEmployees,
    refetchInterval: 60000,
  });

  const { data: shifts = [], isLoading: shiftsLoading } = useQuery({
    queryKey: ['shifts'],
    queryFn: shiftsService.getShifts,
    refetchInterval: 30000,
  });

  // Mutations
  const clockInMutation = useMutation({
    mutationFn: ({ employeeId }: { employeeId: string }) => shiftsService.clockIn(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
      toast({
        title: 'Clock In Successful',
        description: 'Employee has been clocked in successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to clock in. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: ({ employeeId }: { employeeId: string }) => shiftsService.clockOut(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
      toast({
        title: 'Clock Out Successful',
        description: 'Employee has been clocked out successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to clock out. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Filter data
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || employee.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || shift.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Employees',
      value: metrics?.total_employees?.toString() || '--',
      icon: Users,
      color: 'blue',
      description: 'Active staff members',
      trend: null
    },
    {
      title: 'On Shift Now',
      value: metrics?.employees_on_shift?.toString() || '--',
      icon: UserCheck,
      color: 'green',
      description: 'Currently working',
      trend: null
    },
    {
      title: 'Attendance Rate',
      value: metrics?.attendance_rate ? `${metrics.attendance_rate.toFixed(1)}%` : '--',
      icon: Calendar,
      color: 'purple',
      description: 'This week',
      trend: metrics?.attendance_rate ? (metrics.attendance_rate > 90 ? 2.3 : -1.5) : null
    },
    {
      title: 'Labor Cost Today',
      value: metrics?.total_labor_cost_today ? `$${metrics.total_labor_cost_today.toFixed(2)}` : '--',
      icon: DollarSign,
      color: 'orange',
      description: 'Daily payroll',
      trend: metrics?.labor_efficiency ? (metrics.labor_efficiency > 90 ? 4.2 : -2.1) : null
    }
  ];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['employees'] });
    queryClient.invalidateQueries({ queryKey: ['shifts'] });
    toast({
      title: 'Data Refreshed',
      description: 'All shift management data has been updated.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'on_shift':
      case 'completed': return 'default';
      case 'scheduled': return 'default';
      case 'missed':
      case 'cancelled': return 'destructive';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'on_shift': return CheckCircle;
      case 'scheduled': return Clock;
      case 'completed': return CheckCircle;
      case 'missed':
      case 'cancelled': return XCircle;
      case 'inactive': return Pause;
      default: return Clock;
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (metricsError) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Shift Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't load the shift management data. Please try again.
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
            Shift Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor employee schedules, attendance, and workforce analytics
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
            Add Shift
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
                {metric.trend && (
                  <div className={`flex items-center space-x-1 ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(metric.trend)}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {metric.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('employees')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'employees'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Employees
            </button>
            <button
              onClick={() => setViewMode('shifts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'shifts'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Clock className="h-4 w-4 mr-2 inline" />
              Shifts
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${viewMode}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All {viewMode === 'employees' ? 'Employees' : 'Shifts'}</option>
              {viewMode === 'employees' ? (
                <>
                  <option value="active">Active</option>
                  <option value="on_shift">On Shift</option>
                  <option value="inactive">Inactive</option>
                </>
              ) : (
                <>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'employees' ? (
        // Employees View
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEmployees.map((employee, index) => {
              const StatusIcon = getStatusIcon(employee.status);
              return (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {employee.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(employee.status) as any} className="capitalize">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {employee.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Employee Details */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-4 w-4" />
                          <span>${employee.hourly_rate.toFixed(2)}/hr</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {employee.performance_rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-4">
                      {employee.status === 'on_shift' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => clockOutMutation.mutate({ employeeId: employee.id })}
                          disabled={clockOutMutation.isPending}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Clock Out
                        </Button>
                      ) : employee.status === 'active' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => clockInMutation.mutate({ employeeId: employee.id })}
                          disabled={clockInMutation.isPending}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Clock In
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1" disabled>
                          <UserX className="h-4 w-4 mr-2" />
                          Inactive
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        // Shifts View
        <div className="space-y-4">
          <AnimatePresence>
            {filteredShifts.map((shift, index) => {
              const StatusIcon = getStatusIcon(shift.status);
              return (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            {shift.employee_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {shift.employee_name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {shift.position}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Start</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {formatTime(shift.start_time)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(shift.start_time)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">End</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {formatTime(shift.end_time)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(shift.end_time)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Hours</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {shift.actual_hours || shift.scheduled_hours}h
                          </p>
                          {shift.overtime_hours > 0 && (
                            <p className="text-xs text-orange-600">
                              +{shift.overtime_hours}h OT
                            </p>
                          )}
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pay</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            ${shift.total_pay.toFixed(2)}
                          </p>
                        </div>
                        
                        <Badge variant={getStatusColor(shift.status) as any} className="capitalize">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {shift.status}
                        </Badge>
                        
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {shift.notes && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Notes:</strong> {shift.notes}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Loading State */}
      {(employeesLoading || shiftsLoading || metricsLoading) && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading shift management data...</p>
        </div>
      )}

      {/* Empty State */}
      {!employeesLoading && !shiftsLoading && 
       ((viewMode === 'employees' && filteredEmployees.length === 0) || 
        (viewMode === 'shifts' && filteredShifts.length === 0)) && (
        <Card className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No {viewMode} Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedFilter !== 'all' 
              ? `Try adjusting your search or filter criteria.` 
              : `Start by adding your first ${viewMode === 'employees' ? 'employee' : 'shift'}.`
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add {viewMode === 'employees' ? 'Employee' : 'Shift'}
          </Button>
        </Card>
      )}
    </div>
  );
}; 