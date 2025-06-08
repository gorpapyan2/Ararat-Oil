import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  Users,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  RefreshCw,
  Play,
  Pause,
  Square,
  Edit3,
  MessageSquare,
  Star,
  UserCheck,
  UserX,
  Clock3,
  Timer,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  Minus,
  Archive,
  BarChart3,
  PieChart,
  Zap,
  Bell,
  DollarSign,
  Eye,
  CalendarPlus,
  UserPlus,
  Settings,
  User
} from 'lucide-react';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Card } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { useToast } from '@/core/hooks/useToast';
import { supabase } from '@/core/api/supabase';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { StatsCard } from '@/shared/components/cards';


// Types
interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  hourly_rate: number;
  phone: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'on_shift' | 'break' | 'overtime';
  hire_date: string;
  performance_rating: number;
  current_shift_start?: string;
  total_hours_week: number;
  overtime_hours: number;
}

interface Shift {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_role: string;
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
  location: string;
}

interface ShiftAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  employee?: string;
  time: string;
  shift_id?: string;
}

interface ShiftMetrics {
  total_employees_on_shift: number;
  total_employees: number;
  employees_on_shift: number;
  total_labor_cost_today: number;
  labor_efficiency: number;
  shifts_completed_today: number;
  average_shift_rating: number;
  overtime_hours_today: number;
  attendance_rate: number;
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

// Mock data
const mockAlerts: ShiftAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Overtime Alert',
    description: 'John Doe has exceeded 8 hours',
    employee: 'John Doe',
    time: '2 hours ago',
    shift_id: 'shift-123'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Break Overdue',
    description: 'Jane Smith hasn\'t taken a break in 6 hours',
    employee: 'Jane Smith',
    time: '30 minutes ago',
    shift_id: 'shift-124'
  }
];

const performanceStats = [
  {
    title: 'Average Shift Rating',
    value: '4.2/5',
    icon: BarChart3,
    color: 'blue',
    description: 'Employee performance'
  },
  {
    title: 'On-Time Rate',
    value: '92%',
    icon: Clock,
    color: 'green',
    description: 'Punctuality score'
  },
  {
    title: 'Labor Efficiency',
    value: '87%',
    icon: TrendingUp,
    color: 'orange',
    description: 'Productivity measure'
  },
  {
    title: 'Total Hours Today',
    value: '156h',
    icon: Users,
    color: 'purple',
    description: 'Combined work time'
  }
];

// Helper functions
const getAlertColor = (type: string) => {
  switch (type) {
    case 'critical':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'critical':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <Bell className="w-4 h-4 text-blue-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

export default function ShiftsDashboard() {
  const [viewMode, setViewMode] = useState<'employees' | 'shifts'>('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'scheduled' | 'completed'>('all');
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
      case 'on_shift':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'break':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overtime':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'active':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'scheduled':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'missed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_shift':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'break':
        return <Pause className="w-4 h-4" />;
      case 'overtime':
        return <AlertTriangle className="w-4 h-4" />;
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'inactive':
        return <Pause className="w-4 h-4" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'missed':
        return <XCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
    <WindowContainer
      title="Shift Management Dashboard"
      subtitle="Comprehensive workforce management, scheduling, and performance tracking for optimal operations"
    >
      {/* Main Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
            Workforce Overview
          </h3>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-200">
              <Plus className="w-4 h-4" />
              New Shift
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {metricCards.map((metric, index) => (
            <StatsCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              description={metric.description}
            />
          ))}
        </div>
      </div>

      {/* View Mode Toggle & Search */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('employees')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'employees'
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Employees
            </button>
            <button
              onClick={() => setViewMode('shifts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'shifts'
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="h-4 w-4 mr-2 inline" />
              Active Shifts
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${viewMode}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {viewMode === 'employees' ? (
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-card-foreground mb-3">
                  Employee Status ({filteredEmployees.length})
                </h4>
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:border-accent/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-semibold text-card-foreground text-sm truncate">{employee.name}</h5>
                          <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${getStatusColor(employee.status)}`}>
                          {getStatusIcon(employee.status)}
                          <span className="capitalize hidden sm:inline">{employee.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      <div className="min-w-0">
                        <span className="text-muted-foreground block truncate">Rate:</span>
                        <div className="font-medium truncate">₺{employee.hourly_rate}/hr</div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block truncate">This Week:</span>
                        <div className="font-medium truncate">{employee.total_hours_week}h</div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block truncate">Overtime:</span>
                        <div className="font-medium truncate">{employee.overtime_hours}h</div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block truncate">Rating:</span>
                        <div className="font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          <span className="truncate">{employee.performance_rating}/5</span>
                        </div>
                      </div>
                    </div>

                    {employee.current_shift_start && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Started: {employee.current_shift_start}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-card-foreground mb-3">
                  Active Shifts ({filteredShifts.length})
                </h4>
                {filteredShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:border-accent/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h5 className="font-semibold text-card-foreground text-sm truncate">{shift.employee_name}</h5>
                        <p className="text-xs text-muted-foreground truncate">{shift.employee_role} • {shift.position}</p>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 flex-shrink-0 ${getStatusColor(shift.status)}`}>
                        {getStatusIcon(shift.status)}
                        <span className="capitalize hidden sm:inline">{shift.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs mb-2">
                      <div className="min-w-0">
                        <span className="text-muted-foreground block truncate">Time:</span>
                        <div className="font-medium truncate">{shift.start_time} - {shift.end_time}</div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block truncate">Hours:</span>
                        <div className="font-medium truncate">{shift.actual_hours}h / {shift.scheduled_hours}h</div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block truncate">Overtime:</span>
                        <div className="font-medium truncate">{shift.overtime_hours}h</div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block truncate">Pay:</span>
                        <div className="font-medium truncate">₺{shift.total_pay}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground min-w-0 flex-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{shift.location}</span>
                        </div>
                        {shift.clock_in_time && (
                          <div className="flex items-center gap-1 min-w-0 hidden sm:flex">
                            <Timer className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">In: {shift.clock_in_time}</span>
                          </div>
                        )}
                      </div>
                      
                      {shift.shift_rating && (
                        <div className="flex items-center gap-1 text-xs flex-shrink-0">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{shift.shift_rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alerts Sidebar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold text-card-foreground">
                Shift Alerts
              </h4>
              <span className="text-sm text-muted-foreground">
                {mockAlerts.length} alerts
              </span>
            </div>
            
            <div className="space-y-2">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-2 ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-sm font-medium text-card-foreground truncate">
                          {alert.title}
                        </h5>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {alert.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 truncate">
                        {alert.description}
                      </p>
                      {alert.employee && (
                        <div className="text-xs font-medium text-card-foreground truncate">
                          {alert.employee}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-3">
          Performance Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {performanceStats.map((stat, index) => (
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

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7] mb-3">
          Shift Management Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
              <CalendarPlus className="w-4 h-4 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-card-foreground text-sm truncate">Schedule Shift</div>
              <div className="text-xs text-muted-foreground truncate">Add new shifts</div>
            </div>
          </button>
          
          <button className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-green-500/10 rounded-lg flex-shrink-0">
              <UserPlus className="w-4 h-4 text-green-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-card-foreground text-sm truncate">Add Employee</div>
              <div className="text-xs text-muted-foreground truncate">New team member</div>
            </div>
          </button>
          
          <button className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-card-foreground text-sm truncate">Analytics</div>
              <div className="text-xs text-muted-foreground truncate">Performance reports</div>
            </div>
          </button>
          
          <button className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/30 transition-all duration-200 text-left">
            <div className="p-2 bg-amber-500/10 rounded-lg flex-shrink-0">
              <Settings className="w-4 h-4 text-amber-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-card-foreground text-sm truncate">Settings</div>
              <div className="text-xs text-muted-foreground truncate">Shift policies</div>
            </div>
          </button>
        </div>
      </div>
    </WindowContainer>
  );
} 