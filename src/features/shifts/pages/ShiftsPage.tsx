import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { type Row } from '@tanstack/react-table';
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

// Modern Services
import { useShifts } from '../services/shifts';
import { 
  getShifts,
  startShift as startShiftAPI,
  closeShift as closeShiftAPI
} from '@/core/api/endpoints/shifts';
import { cn } from '@/shared/utils';
import type { Shift } from '@/core/api/types';

// Types
interface ShiftMetrics {
  total_shifts: number;
  active_shifts: number;
  completed_shifts: number;
  total_hours: number;
  total_overtime: number;
  total_payroll: number;
}

// Modern API Services using centralized approach
const shiftsService = {
  async getShifts(): Promise<Shift[]> {
    const response = await getShifts();
    if (response.error) throw new Error(response.error.message);
    return response.data || [];
  },

  async getShiftMetrics(): Promise<ShiftMetrics> {
    // TODO: Implement in Edge Functions or use calculated metrics
    console.warn('Shift metrics functionality needs to be implemented in API');
    return {
      total_shifts: 0,
      active_shifts: 0,
      completed_shifts: 0,
      total_hours: 0,
      total_overtime: 0,
      total_payroll: 0,
    };
  },

  async startShift(openingCash: number, employeeIds?: string[]): Promise<Shift> {
    const response = await startShiftAPI(openingCash, employeeIds);
    if (response.error) throw new Error(response.error.message);
    return response.data!;
  },

  async closeShift(id: string, closingCash: number, paymentMethods?: any[]): Promise<Shift> {
    const response = await closeShiftAPI(id, closingCash, paymentMethods);
    if (response.error) throw new Error(response.error.message);
    return response.data!;
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
  const startShiftMutation = useMutation({
    mutationFn: ({ openingCash, employeeIds }: { openingCash: number; employeeIds?: string[] }) =>
      shiftsService.startShift(openingCash, employeeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
      setIsCreateDialogOpen(false);
    }
  });

  const closeShiftMutation = useMutation({
    mutationFn: ({ id, closingCash, paymentMethods }: { id: string; closingCash: number; paymentMethods?: any[] }) =>
      shiftsService.closeShift(id, closingCash, paymentMethods),
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
      cell: ({ row }: { row: Row<Shift> }) => (
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
      cell: ({ row }: { row: Row<Shift> }) => (
        <span>{new Date(row.getValue('date')).toLocaleDateString()}</span>
      )
    },
    {
      accessorKey: 'shift_type',
      header: 'Shift Type',
      cell: ({ row }: { row: Row<Shift> }) => {
        const type = row.getValue('shift_type') as string;
        const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
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
      cell: ({ row }: { row: Row<Shift> }) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{row.getValue('start_time')}</span>
        </div>
      )
    },
    {
      accessorKey: 'end_time',
      header: 'End Time',
      cell: ({ row }: { row: Row<Shift> }) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{row.getValue('end_time')}</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: Row<Shift> }) => {
        const status = row.getValue('status') as string;
        const variants: Record<string, 'outline' | 'default' | 'success' | 'destructive'> = {
          scheduled: 'outline',
          active: 'default',
          completed: 'success',
          cancelled: 'destructive'
        };
        const icons: Record<string, React.ComponentType<{ className?: string }>> = {
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
      cell: ({ row }: { row: Row<Shift> }) => (
        <span className="font-mono">{row.getValue('total_hours') || 0}h</span>
      )
    },
    {
      accessorKey: 'total_pay',
      header: 'Pay',
      cell: ({ row }: { row: Row<Shift> }) => (
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

export default ShiftsPage; 