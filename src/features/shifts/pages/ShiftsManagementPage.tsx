/**
 * Shifts Management Page
 * Optimized responsive design with minimalistic approach
 */

import React, { useState, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  RefreshCw,
  Filter,
  Search,
  MoreHorizontal,
  Activity,
  Timer,
  Banknote,
  Clock,
  Users,
  Settings,
  ChevronDown,
  RotateCcw,
  Play,
  Square,
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/primitives/badge';
import { StandardizedDataTable, StandardizedDataTableColumn } from '@/shared/components/unified/StandardizedDataTable';
import { Loading } from '@/core/components/ui/loading';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { Input } from '@/core/components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { MetricCard } from '@/shared/components/unified/MetricCard';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';

// Services and Types
import { shiftsApi, employeesApi, salesApi, fuelSuppliesApi } from '@/core/api';
import { Shift, Employee, Sale, FuelSupply } from '@/core/api/types';
import { cn } from '@/shared/utils';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { fetchFromFunction } from "@/core/api/client";

// Types
interface ShiftMetrics {
  total_shifts: number;
  active_shifts: number;
  total_hours: number;
  total_payroll: number;
}

interface ShiftListItem {
  id: string;
  employee_name: string;
  start_time: string;
  end_time?: string;
  status: 'OPEN' | 'CLOSED';
  opening_cash: number;
  closing_cash?: number;
  sales_total?: number;
}

interface ShiftFilters {
  status: string;
  employee: string;
  date_range: string;
  search: string;
}

interface ActiveShiftData {
  id: string;
  employee_name: string;
  start_time: string;
  opening_cash: number;
  current_sales: number;
  supplies_used: number;
  duration: string;
  transactions_count: number;
}

interface OpenShiftData {
  opening_cash: number;
  employee_id: string;
}

// Helper function to transform Shift to ShiftListItem
const transformShiftToListItem = (shift: Shift): ShiftListItem => {
  const employeeName = shift.employees && shift.employees.length > 0 
    ? shift.employees.map(emp => emp.employee_name).join(', ')
    : shift.employee_id 
      ? `Employee ${shift.employee_id.slice(-4)}` 
      : 'No employees';

  return {
    id: shift.id,
    employee_name: employeeName,
    start_time: shift.start_time,
    end_time: shift.end_time,
    status: shift.is_active ? 'OPEN' : 'CLOSED',
    opening_cash: shift.opening_cash,
    closing_cash: shift.closing_cash,
    sales_total: 0, // Will be fetched separately
  };
};

// Helper function to calculate shift duration
const calculateShiftDuration = (startTime: string): string => {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const ShiftsManagementContent: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const responsive = useResponsive();
  
  // State
  const [filters, setFilters] = useState<ShiftFilters>({
    status: 'all-statuses',
    employee: 'all-employees',
    date_range: '',
    search: ''
  });
  const [showPastShifts, setShowPastShifts] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [openShiftData, setOpenShiftData] = useState<OpenShiftData>({
    opening_cash: 0,
    employee_id: ''
  });
  const [closingCash, setClosingCash] = useState<number>(0);

  // Queries
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['shift-metrics'],
    queryFn: async (): Promise<ShiftMetrics> => {
      const shiftsResponse = await shiftsApi.getShifts();
      if (shiftsResponse.error) throw new Error(shiftsResponse.error.message);
      
      const shifts = shiftsResponse.data || [];
      const activeShifts = shifts.filter(shift => shift.is_active);
      
      // Calculate total hours from closed shifts
      const totalHours = shifts.reduce((acc, shift) => {
        if (shift.end_time) {
          const start = new Date(shift.start_time);
          const end = new Date(shift.end_time);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return acc + hours;
        }
        return acc;
      }, 0);

      // Calculate total payroll (basic calculation)
      const totalPayroll = shifts.length * 50000; // Basic hourly rate calculation

      return {
        total_shifts: shifts.length,
        active_shifts: activeShifts.length,
        total_hours: Math.round(totalHours),
        total_payroll: totalPayroll,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: shiftsData = [], isLoading: shiftsLoading, error: shiftsError } = useQuery({
    queryKey: ['shifts', filters],
    queryFn: async (): Promise<ShiftListItem[]> => {
      const response = await shiftsApi.getShifts();
      if (response.error) throw new Error(response.error.message);
      
      const shifts = response.data || [];
      return shifts.map(transformShiftToListItem);
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<Employee[]> => {
      const response = await employeesApi.getEmployees();
      if (response.error) throw new Error(response.error.message);
      return response.data || [];
    },
  });

  // Get active shift and its real-time data
  const { data: activeShift, isLoading: activeShiftLoading } = useQuery({
    queryKey: ['active-shift'],
    queryFn: async (): Promise<ActiveShiftData | null> => {
      // Since there's no direct /active endpoint, we'll get all shifts and find the active one
      const shiftsResponse = await shiftsApi.getShifts();
      if (shiftsResponse.error || !shiftsResponse.data) return null;
      
      const activeShiftData = shiftsResponse.data.find(shift => shift.is_active);
      if (!activeShiftData) return null;
      
      // Get sales data for this shift with proper error handling
      const [salesResponse, suppliesResponse] = await Promise.all([
        fetchFromFunction('sales', {
          method: 'GET',
          queryParams: { shift_id: activeShiftData.id }
        }),
        fuelSuppliesApi.getFuelSupplies()
      ]);

      // Handle sales data with proper error checking
      let sales: Sale[] = [];
      if (salesResponse && !salesResponse.error && salesResponse.data) {
        // Check if data is an array
        if (Array.isArray(salesResponse.data)) {
          sales = salesResponse.data as Sale[];
        } else {
          console.warn('Sales API returned non-array data:', salesResponse.data);
        }
      } else {
        console.warn('Sales API error or empty response:', salesResponse);
      }

      // Handle supplies data
      const supplies = suppliesResponse.data || [];
      
      const currentSales = sales.reduce((total, sale) => total + (sale.total_sales || 0), 0);
      const transactionsCount = sales.length;
      
      // Filter supplies delivered during this shift
      const shiftStart = new Date(activeShiftData.start_time);
      const shiftSupplies = supplies.filter(supply => {
        const deliveryDate = new Date(supply.delivery_date);
        return deliveryDate >= shiftStart;
      });
      const suppliesUsed = shiftSupplies.reduce((total, supply) => total + supply.total_price, 0);
      
      const employeeName = activeShiftData.employees && activeShiftData.employees.length > 0 
        ? activeShiftData.employees.map(emp => emp.employee_name).join(', ')
        : activeShiftData.employee_id 
          ? `Employee ${activeShiftData.employee_id.slice(-4)}` 
          : 'No employees';

      console.log('Active shift sales calculation:', {
        shiftId: activeShiftData.id,
        salesCount: sales.length,
        currentSales,
        transactionsCount
      });

      return {
        id: activeShiftData.id,
        employee_name: employeeName,
        start_time: activeShiftData.start_time,
        opening_cash: activeShiftData.opening_cash,
        current_sales: currentSales,
        supplies_used: suppliesUsed,
        duration: calculateShiftDuration(activeShiftData.start_time),
        transactions_count: transactionsCount
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: true
  });

  // Filter shifts based on current filters
  const filteredShifts = useMemo(() => {
    let filtered = shiftsData;

    if (filters.status && filters.status !== 'all-statuses') {
      filtered = filtered.filter(shift => shift.status === filters.status);
    }

    if (filters.employee && filters.employee !== 'all-employees') {
      // Filter by employee if needed
      filtered = filtered.filter(shift => 
        shift.employee_name.toLowerCase().includes(filters.employee.toLowerCase())
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(shift => 
        shift.employee_name.toLowerCase().includes(searchLower) ||
        shift.id.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [shiftsData, filters]);

  // Mutations
  const openShiftMutation = useMutation({
    mutationFn: async (data: OpenShiftData) => {
      const startShiftResponse = await shiftsApi.startShift(data.opening_cash, [data.employee_id]);
      if (startShiftResponse.error) throw new Error(startShiftResponse.error.message);
      return startShiftResponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['active-shift'] });
      setIsCreateDialogOpen(false);
      setOpenShiftData({ opening_cash: 0, employee_id: '' });
    },
  });

  const closeShiftMutation = useMutation({
    mutationFn: async ({ shiftId, closingCash }: { shiftId: string; closingCash: number }) => {
      const closeShiftResponse = await shiftsApi.closeShift(shiftId, closingCash);
      if (closeShiftResponse.error) throw new Error(closeShiftResponse.error.message);
      return closeShiftResponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['active-shift'] });
      setIsCloseDialogOpen(false);
      setClosingCash(0);
    },
  });

  // Handlers
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['shifts'] });
    queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['active-shift'] });
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all-statuses',
      employee: 'all-employees',
      date_range: '',
      search: ''
    });
    setShowPastShifts(false);
  };

  const handleOpenShift = async () => {
    if (openShiftData.opening_cash <= 0 || !openShiftData.employee_id) return;
    await openShiftMutation.mutateAsync(openShiftData);
  };

  const handleCloseShift = async () => {
    if (!activeShift || closingCash <= 0) return;
    await closeShiftMutation.mutateAsync({ 
      shiftId: activeShift.id, 
      closingCash 
    });
  };

  const handleViewShift = (shift: ShiftListItem) => {
    navigate(`/finance/shifts/${shift.id}`);
  };

  const handleEditShift = (shift: ShiftListItem) => {
    navigate(`/finance/shifts/${shift.id}/edit`);
  };

  // Table columns
  const columns: StandardizedDataTableColumn<ShiftListItem>[] = useMemo(() => [
    {
      accessorKey: 'employee_name',
      header: 'EMPLOYEE',
      cell: (value: unknown, row: ShiftListItem) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {row.employee_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-medium text-foreground">{row.employee_name}</div>
            <div className="text-sm text-muted-foreground">
              {row.status === 'OPEN' ? 'Active Shift' : 'Completed'}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: (value: unknown, row: ShiftListItem) => (
        <Badge 
          className={cn(
            "font-medium",
            row.status === 'OPEN' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          )}
        >
          {row.status === 'OPEN' ? 'Active' : 'Closed'}
        </Badge>
      ),
    },
    {
      accessorKey: 'start_time',
      header: 'START DATE',
      cell: (value: unknown, row: ShiftListItem) => {
        const startTime = new Date(row.start_time);
        return (
          <div className="text-sm">
            <div className="font-medium text-foreground">
              {startTime.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="text-muted-foreground">
              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'end_time',
      header: 'END DATE',
      cell: (value: unknown, row: ShiftListItem) => {
        if (!row.end_time) {
          return (
            <div className="text-sm">
              <div className="font-medium text-muted-foreground">--</div>
              <div className="text-muted-foreground">In Progress</div>
            </div>
          );
        }
        const endTime = new Date(row.end_time);
        return (
          <div className="text-sm">
            <div className="font-medium text-foreground">
              {endTime.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="text-muted-foreground">
              {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'opening_cash',
      header: 'OPENING CASH',
      cell: (value: unknown, row: ShiftListItem) => (
        <span className="font-mono font-medium text-foreground">
          ₽{row.opening_cash.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'closing_cash',
      header: 'CLOSING CASH',
      cell: (value: unknown, row: ShiftListItem) => (
        <span className="font-mono font-medium text-foreground">
          {row.closing_cash 
            ? `₽${row.closing_cash.toLocaleString()}`
            : '--'
          }
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: (value: unknown, row: ShiftListItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewShift(row)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditShift(row)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  // Loading state
  if (metricsLoading && shiftsLoading) {
    return (
      <WindowContainer
        title="Shifts Management"
        subtitle="Manage employee shifts, track working hours, and monitor cash flow"
        breadcrumbItems={[
          { label: 'Management', href: '/management' },
          { label: 'Shifts', href: '#' }
        ]}
      >
        <div className="space-y-6">
          <div className="metric-cards-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Loading />
        </div>
      </WindowContainer>
    );
  }

  // Error state
  if (metricsError || shiftsError) {
    return (
      <WindowContainer
        title="Shifts Management"
        subtitle="Manage employee shifts, track working hours, and monitor cash flow"
        breadcrumbItems={[
          { label: 'Management', href: '/management' },
          { label: 'Shifts', href: '#' }
        ]}
      >
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load shifts data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </WindowContainer>
    );
  }

  return (
    <WindowContainer
      title="Shifts Management"
      subtitle="Manage employee shifts, track working hours, and monitor cash flow"
      breadcrumbItems={[
        { label: 'Management', href: '/management' },
        { label: 'Shifts', href: '#' }
      ]}
    >
      {/* Current Shift Status Section */}
      <div className="mb-8">
        {activeShift ? (
          /* Active Shift Display */
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
                    Active Shift
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Currently running • {activeShift.duration}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setIsCloseDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Square className="w-4 h-4 mr-2" />
                Close Shift
              </Button>
            </div>

            {/* Active Shift Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/50 dark:bg-black/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Employee</p>
                      <p className="font-semibold">{activeShift.employee_name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-black/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Started</p>
                      <p className="font-semibold">
                        {new Date(activeShift.start_time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-black/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Opening Cash</p>
                      <p className="font-semibold font-mono">₽{activeShift.opening_cash.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-black/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="font-semibold">{activeShift.transactions_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sales & Supplies During Shift */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/50 dark:bg-black/20 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                    Sales During Shift
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Sales</span>
                      <span className="font-semibold font-mono">₽{activeShift.current_sales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average per Hour</span>
                      <span className="font-medium">
                        ₽{activeShift.current_sales > 0 && parseInt(activeShift.duration) > 0 
                          ? Math.round(activeShift.current_sales / parseInt(activeShift.duration)).toLocaleString()
                          : '0'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">Live data from API</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-black/20 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-green-600" />
                    Supplies Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Cost</span>
                      <span className="font-semibold font-mono">₽{activeShift.supplies_used.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">During Shift</span>
                      <span className="font-medium">Real-time tracking</span>
                    </div>
                    <div className="pt-2 border-t border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-600 font-medium">From fuel supplies API</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* No Active Shift - Open Shift Option */
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                    No Active Shift
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Ready to start a new shift
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Open New Shift
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      {metricsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Shifts"
            value={metricsData.total_shifts}
            subtitle="All time"
            icon={Activity}
            color="blue"
            delay={0}
            size="sm"
          />
          <MetricCard
            title="Active Shifts"
            value={metricsData.active_shifts}
            subtitle="Currently running"
            icon={Timer}
            color="green"
            delay={1}
            size="sm"
          />
          <MetricCard
            title="Total Hours"
            value={`${metricsData.total_hours}h`}
            subtitle="This month"
            icon={Clock}
            color="purple"
            delay={2}
            trend={{ value: 12.5, isPositive: true }}
            size="sm"
          />
          <MetricCard
            title="Total Payroll"
            value={`₽${metricsData.total_payroll.toLocaleString()}`}
            subtitle="This month"
            icon={Banknote}
            color="orange"
            delay={3}
            trend={{ value: 8.2, isPositive: true }}
            size="sm"
          />
        </div>
      )}

      {/* Enhanced Filter Section */}
      <div className="bg-card border border-border rounded-lg mb-6">
        {/* Filter Header Row */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
          {/* Left Side Filters */}
          <div className="flex items-center gap-3 flex-1">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter Set
              <span className="text-muted-foreground ml-1">None</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status</span>
                  <span className="text-muted-foreground">
                    {filters.status === 'all-statuses' ? 'All' : filters.status}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All</SelectItem>
                <SelectItem value="OPEN">Active</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.employee}
              onValueChange={(value) => setFilters(prev => ({ ...prev, employee: value }))}
            >
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Employee</span>
                  <span className="text-muted-foreground">
                    {filters.employee === 'all-employees' ? 'All' : 'Selected'}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-employees">All</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            <Button
              onClick={handleRefresh}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Controls Row */}
        <div className="flex items-center justify-between gap-4 p-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Keyword"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>

          {/* Show Past Events Toggle */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showPastShifts}
                onChange={(e) => setShowPastShifts(e.target.checked)}
                className="rounded border-border"
              />
              Show Past Shifts
            </label>

            <Button variant="outline" size="sm" className="flex items-center gap-2">
              Edit Columns
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Shifts ({filteredShifts.length})
            </h3>
            <div className="text-sm text-muted-foreground">
              Showing {filteredShifts.length} of {shiftsData.length}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <StandardizedDataTable<ShiftListItem>
            data={filteredShifts}
            columns={columns}
            loading={shiftsLoading}
          />
        </div>
      </div>

      {/* Open Shift Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open New Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Employee *</label>
              <Select
                value={openShiftData.employee_id}
                onValueChange={(value) => setOpenShiftData(prev => ({ ...prev, employee_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Opening Cash (₽) *</label>
              <Input
                type="number"
                value={openShiftData.opening_cash}
                onChange={(e) => setOpenShiftData(prev => ({ ...prev, opening_cash: Number(e.target.value) }))}
                placeholder="Enter opening cash amount"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleOpenShift}
                disabled={openShiftData.opening_cash <= 0 || !openShiftData.employee_id || openShiftMutation.isPending}
                className="flex-1"
              >
                {openShiftMutation.isPending ? 'Opening...' : 'Open Shift'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Shift Dialog */}
      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Active Shift</DialogTitle>
          </DialogHeader>
          {activeShift && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Shift Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Employee:</span>
                    <span className="font-medium">{activeShift.employee_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{activeShift.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Opening Cash:</span>
                    <span className="font-mono">₽{activeShift.opening_cash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Sales:</span>
                    <span className="font-mono">₽{activeShift.current_sales.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Closing Cash (₽)</label>
                <Input
                  type="number"
                  value={closingCash}
                  onChange={(e) => setClosingCash(Number(e.target.value))}
                  placeholder="Enter closing cash amount"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCloseShift}
                  disabled={closingCash <= 0 || closeShiftMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {closeShiftMutation.isPending ? 'Closing...' : 'Close Shift'}
                </Button>
                <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </WindowContainer>
  );
};

export const ShiftsManagementPage: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ShiftsManagementContent />
    </Suspense>
  );
};

// Add default export to fix the import error
export default ShiftsManagementPage; 