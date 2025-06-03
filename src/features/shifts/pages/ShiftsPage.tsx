import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  UserCheck,
  DollarSign,
  BarChart3,
  RefreshCw
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/primitives/badge';
import { StandardizedDataTable } from '@/shared/components/unified/StandardizedDataTable';
import { Loading } from '@/core/components/ui/loading';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/core/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';

// Services
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/shared/utils';

// Types
interface Shift {
  id: string;
  employee_name: string;
  employee_id: string;
  start_time: string;
  end_time: string;
  shift_type: 'morning' | 'afternoon' | 'night';
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  date: string;
  total_hours?: number;
  break_time?: number;
  overtime_hours?: number;
  hourly_rate?: number;
  total_pay?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ShiftMetrics {
  total_shifts: number;
  active_shifts: number;
  completed_shifts: number;
  total_hours: number;
  total_overtime: number;
  total_payroll: number;
}

// Supabase Edge Function Services
const shiftsService = {
  async getShifts(): Promise<Shift[]> {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('date', { ascending: false })
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getShiftMetrics(): Promise<ShiftMetrics> {
    const { data, error } = await supabase.functions.invoke('shifts-analytics', {
      body: { action: 'get_metrics' }
    });
    
    if (error) throw error;
    return data;
  },

  async createShift(shift: Omit<Shift, 'id' | 'created_at' | 'updated_at'>): Promise<Shift> {
    const { data, error } = await supabase
      .from('shifts')
      .insert([shift])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateShift(id: string, updates: Partial<Shift>): Promise<Shift> {
    const { data, error } = await supabase
      .from('shifts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteShift(id: string): Promise<void> {
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const ShiftsPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Queries
  const { data: shifts = [], isLoading: shiftsLoading, error: shiftsError } = useQuery({
    queryKey: ['shifts'],
    queryFn: shiftsService.getShifts
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['shift-metrics'],
    queryFn: shiftsService.getShiftMetrics
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: shiftsService.createShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
      setIsCreateDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Shift> }) =>
      shiftsService.updateShift(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: shiftsService.deleteShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
    }
  });

  // Column definitions for DataTable
  const columns = [
    {
      accessorKey: 'employee_name',
      header: 'Employee',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{row.getValue('employee_name')}</span>
        </div>
      )
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }: any) => (
        <span>{new Date(row.getValue('date')).toLocaleDateString()}</span>
      )
    },
    {
      accessorKey: 'shift_type',
      header: 'Shift Type',
      cell: ({ row }: any) => {
        const type = row.getValue('shift_type') as string;
        const variants: Record<string, any> = {
          morning: 'default',
          afternoon: 'secondary',
          night: 'outline'
        };
        return (
          <Badge variant={variants[type] || 'default'}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'start_time',
      header: 'Start Time',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{row.getValue('start_time')}</span>
        </div>
      )
    },
    {
      accessorKey: 'end_time',
      header: 'End Time',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{row.getValue('end_time')}</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('status') as string;
        const variants: Record<string, any> = {
          scheduled: 'outline',
          active: 'default',
          completed: 'success',
          cancelled: 'destructive'
        };
        const icons: Record<string, any> = {
          scheduled: Calendar,
          active: UserCheck,
          completed: CheckCircle,
          cancelled: AlertCircle
        };
        const Icon = icons[status];
        
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <Badge variant={variants[status] || 'default'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        );
      }
    },
    {
      accessorKey: 'total_hours',
      header: 'Hours',
      cell: ({ row }: any) => (
        <span className="font-mono">{row.getValue('total_hours') || 0}h</span>
      )
    },
    {
      accessorKey: 'total_pay',
      header: 'Pay',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-mono">${row.getValue('total_pay') || 0}</span>
        </div>
      )
    }
  ];

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Shifts',
      value: metrics?.total_shifts || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Active Shifts',
      value: metrics?.active_shifts || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+5%'
    },
    {
      title: 'Total Hours',
      value: `${metrics?.total_hours || 0}h`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8%'
    },
    {
      title: 'Total Payroll',
      value: `$${metrics?.total_payroll || 0}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+15%'
    }
  ];

  if (shiftsError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load shifts data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shifts Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage employee shifts, schedules, and payroll
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['shifts'] });
              queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Shift</DialogTitle>
              </DialogHeader>
              {/* Add create shift form here */}
            </DialogContent>
          </Dialog>
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {metricsLoading ? (
                        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                      ) : (
                        metric.value
                      )}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {metric.change} from last month
                    </p>
                  </div>
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    metric.bgColor
                  )}>
                    <metric.icon className={cn("w-6 h-6", metric.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Shifts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Shifts Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shiftsLoading ? (
            <Loading />
          ) : (
            <StandardizedDataTable
              columns={columns}
              data={shifts}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 