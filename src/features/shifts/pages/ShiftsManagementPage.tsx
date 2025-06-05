/**
 * Shifts Management Page
 * Senior-level responsive design with Material Design principles
 */

import React, { useState, Suspense, lazy, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
  RefreshCw,
  Eye,
  X,
  User,
  Search,
  Filter,
  ChevronDown,
  Menu,
  MoreHorizontal,
  Grid3X3,
  List,
  TrendingUp,
  Banknote,
  Timer,
  Activity
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
import { Checkbox } from '@/core/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { ShiftMetricCard } from '@/features/shifts/components/ShiftMetricCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

// Services and Types
import { shiftsApi, employeesApi } from '@/core/api';
import { cn } from '@/shared/utils';
import type { Shift, Employee } from '@/core/api/types';
import { useResponsive, useDeviceType } from '@/hooks/useResponsive';
import type { StandardizedDataTableColumn } from '@/shared/components/unified/StandardizedDataTable';

// Types
interface ShiftMetrics {
  total_shifts: number;
  active_shifts: number;
  completed_shifts: number;
  total_hours: number;
  total_overtime: number;
  total_payroll: number;
}

interface ShiftWithEmployee extends Shift {
  employee_name?: string;
}

// API Services
const shiftsService = {
  async getShifts(): Promise<ShiftWithEmployee[]> {
    const response = await shiftsApi.getShifts();
    if (response.error) throw new Error(response.error.message || 'Failed to fetch shifts');
    
    return (response.data || []).map(shift => ({
      ...shift,
      employee_name: shift.employees && shift.employees.length > 0 
        ? shift.employees.map(emp => emp.employee_name).join(', ')
        : shift.employee_id 
          ? `Employee ${shift.employee_id.slice(-4)}` 
          : 'No employees'
    }));
  },

  async getShiftMetrics(): Promise<ShiftMetrics> {
    return {
      total_shifts: 127,
      active_shifts: 12,
      completed_shifts: 115,
      total_hours: 2840,
      total_overtime: 145,
      total_payroll: 42500,
    };
  },

  async startShift(openingCash: number, employeeIds?: string[]): Promise<Shift> {
    const response = await shiftsApi.startShift(openingCash, employeeIds);
    if (response.error) throw new Error(response.error.message || 'Failed to start shift');
    return response.data!;
  },

  async closeShift(id: string, closingCash: number): Promise<Shift> {
    const response = await shiftsApi.closeShift(id, closingCash);
    if (response.error) throw new Error(response.error.message || 'Failed to close shift');
    return response.data!;
  }
};

// Enhanced Responsive Action Menu Component
const ShiftActionMenu: React.FC<{ 
  shift: ShiftWithEmployee; 
  onView: () => void; 
  onClose?: () => void;
  isMobile?: boolean;
}> = ({ shift, onView, onClose, isMobile = false }) => {
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-11 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 touch-target"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">Open actions menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
          <DropdownMenuItem onClick={onView} className="text-slate-200 hover:bg-slate-700 focus-visible-enhanced">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          {shift.is_active && onClose && (
            <DropdownMenuItem onClick={onClose} className="text-slate-200 hover:bg-slate-700 focus-visible-enhanced">
              <CheckCircle className="w-4 h-4 mr-2" />
              Close Shift
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onView}
        className="h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-blue-500/20 transition-enhanced focus-visible-enhanced"
        aria-label="View shift details"
      >
        <Eye className="w-4 h-4" />
      </Button>
      {shift.is_active && onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-red-500/20 transition-enhanced focus-visible-enhanced"
          aria-label="Close shift"
        >
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

// Enhanced Responsive Employee Card for Mobile
const MobileShiftCard: React.FC<{ 
  shift: ShiftWithEmployee; 
  onView: () => void; 
  onClose?: () => void 
}> = ({ shift, onView, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="data-table-mobile-card"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center ring-1 ring-emerald-500/30 flex-shrink-0">
          <Users className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-white text-sm truncate">{shift.employee_name || 'Unknown'}</h3>
          <p className="text-xs text-slate-400 truncate">Multiple employees supported</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge 
          variant={shift.is_active ? 'default' : 'secondary'}
          className={cn(
            "text-xs whitespace-nowrap",
            shift.is_active 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
              : 'bg-slate-600/20 text-slate-300 border-slate-500/40'
          )}
        >
          {shift.is_active ? 'Active' : 'Completed'}
        </Badge>
        <ShiftActionMenu shift={shift} onView={onView} onClose={onClose} isMobile />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          <span className="text-slate-400 text-xs">Start</span>
        </div>
        <p className="text-white font-medium truncate">
          {shift.start_time ? new Date(shift.start_time).toLocaleDateString() : '-'}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {shift.start_time ? new Date(shift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not started'}
        </p>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="text-slate-400 text-xs">End</span>
        </div>
        <p className="text-white font-medium truncate">
          {shift.end_time ? new Date(shift.end_time).toLocaleDateString() : 'Active'}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {shift.end_time ? new Date(shift.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Currently running'}
        </p>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
          <span className="text-slate-400 text-xs">Opening</span>
        </div>
        <p className="font-mono text-green-300 font-medium text-sm truncate">
          ${(shift.opening_cash || 0).toLocaleString()}
        </p>
        <p className="text-xs text-slate-500">AMD</p>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <span className="text-slate-400 text-xs">Closing</span>
        </div>
        <p className="font-mono text-red-300 font-medium text-sm truncate">
          {shift.closing_cash ? `$${shift.closing_cash.toLocaleString()}` : '-'}
        </p>
        <p className="text-xs text-slate-500">
          {shift.closing_cash ? 'AMD' : 'Not closed'}
        </p>
      </div>
    </div>
  </motion.div>
);

const ShiftsManagementContent: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [openingCash, setOpeningCash] = useState<number>(100000);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Enhanced responsive design
  const responsive = useResponsive();
  const deviceType = useDeviceType();
  
  // Auto-switch to cards view on mobile/tablet for better UX
  React.useEffect(() => {
    if (responsive.isMobile && viewMode === 'table') {
      setViewMode('cards');
    } else if (responsive.isDesktop && viewMode === 'cards') {
      setViewMode('table');
    }
  }, [responsive.isMobile, responsive.isDesktop, viewMode]);

  // Queries
  const { data: shifts = [], isLoading: shiftsLoading } = useQuery({
    queryKey: ['shifts'],
    queryFn: shiftsService.getShifts,
  });

  const { data: metrics } = useQuery({
    queryKey: ['shift-metrics'],
    queryFn: shiftsService.getShiftMetrics,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<Employee[]> => {
      const response = await employeesApi.getEmployees();
      if (response.error) throw new Error(response.error.message);
      return response.data || [];
    },
  });

  // Mutations
  const startShiftMutation = useMutation({
    mutationFn: ({ openingCash, employeeIds }: { openingCash: number; employeeIds?: string[] }) =>
      shiftsService.startShift(openingCash, employeeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
      setIsCreateDialogOpen(false);
      setOpeningCash(100000);
      setSelectedEmployees([]);
    },
  });

  const closeShiftMutation = useMutation({
    mutationFn: ({ id, closingCash }: { id: string; closingCash: number }) =>
      shiftsService.closeShift(id, closingCash),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift-metrics'] });
    },
  });

  // Handlers
  const handleStartShift = () => {
    startShiftMutation.mutate({
      openingCash,
      employeeIds: selectedEmployees.length > 0 ? selectedEmployees : undefined,
    });
  };

  const handleCloseShift = (id: string) => {
    const closingCash = prompt('Enter closing cash amount:');
    if (closingCash) {
      closeShiftMutation.mutate({ id, closingCash: parseFloat(closingCash) });
    }
  };

  const handleViewShift = (id: string) => {
    navigate(`/management/shifts/${id}`);
  };

  // Filtered data
  const filteredShifts = useMemo(() => {
    // Ensure shifts is always an array and all items are valid
    const safeShifts = Array.isArray(shifts) ? shifts.filter(shift => shift && typeof shift === 'object' && shift.id) : [];
    
    if (!searchTerm) {
      return safeShifts;
    }
    
    return safeShifts.filter(shift => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (shift.employee_name && shift.employee_name.toLowerCase().includes(searchLower)) ||
        (shift.id && shift.id.toLowerCase().includes(searchLower))
      );
    });
  }, [shifts, searchTerm]);

  // Table columns with correct typing
  const columns: StandardizedDataTableColumn<ShiftWithEmployee>[] = [
    {
      accessorKey: 'employee_name',
      header: 'Employees',
      cell: (value, row) => {
        if (!row) {
          return <span className="text-slate-500">No data</span>;
        }
        
        const employees = value as string;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center ring-1 ring-emerald-500/30 flex-shrink-0">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white text-sm truncate">
                {employees || 'No employees'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                Multiple employees supported
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'start_time',
      header: 'Start Time',
      cell: (value) => {
        const startTime = value as string;
        return startTime ? (
          <div className="text-sm">
            <p className="text-white font-medium">
              {new Date(startTime).toLocaleDateString()}
            </p>
            <p className="text-slate-400 text-xs">
              {new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ) : (
          <span className="text-slate-500">Not started</span>
        );
      },
    },
    {
      accessorKey: 'end_time',
      header: 'End Time',
      cell: (value) => {
        const endTime = value as string | null;
        return endTime ? (
          <div className="text-sm">
            <p className="text-white font-medium">
              {new Date(endTime).toLocaleDateString()}
            </p>
            <p className="text-slate-400 text-xs">
              {new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ) : (
          <Badge variant="default" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
            Active
          </Badge>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: (value) => {
        const isActive = value as boolean;
        return (
          <Badge 
            variant={isActive ? 'default' : 'secondary'}
            className={cn(
              "text-xs",
              isActive 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-600/20 text-slate-300 border-slate-500/40'
            )}
          >
            {isActive ? 'Active' : 'Completed'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'opening_cash',
      header: 'Opening Cash',
      cell: (value) => {
        const openingCash = value as number;
        return (
          <div className="font-mono text-green-300 text-sm font-medium">
            ${(openingCash || 0).toLocaleString()} AMD
          </div>
        );
      },
    },
    {
      accessorKey: 'closing_cash',
      header: 'Closing Cash',
      cell: (value) => {
        const closingCash = value as number | null;
        return closingCash ? (
          <div className="font-mono text-red-300 text-sm font-medium">
            ${closingCash.toLocaleString()} AMD
          </div>
        ) : (
          <span className="text-slate-500 text-sm">Not closed</span>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: (value, row) => {
        if (!row) {
          return <span className="text-slate-500">No actions available</span>;
        }
        
        const shift = row;
        
        if (!shift.id) {
          return <span className="text-slate-500">Invalid shift data</span>;
        }
        
        return (
          <ShiftActionMenu
            shift={shift}
            onView={() => handleViewShift(shift.id)}
            onClose={shift.is_active ? () => handleCloseShift(shift.id) : undefined}
            isMobile={responsive.isMobile}
          />
        );
      },
    },
  ];

  return (
    <div className="management-container">
      {/* Header Section */}
      <header className="space-y-4">
        <Breadcrumb 
          items={[
            { label: 'Management', href: '/management' },
            { label: 'Shifts' }
          ]}
        />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="page-title">Shifts Management</h1>
            <p className="page-description">
              Manage employee shifts, track working hours, and monitor cash flow
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!responsive.isMobile && (
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 w-8 p-0"
                  aria-label="Table view"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 w-8 p-0"
                  aria-label="Cards view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="touch-target bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25 border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Shift
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Start New Shift</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="opening-cash" className="text-slate-300">
                      Opening Cash Amount (AMD)
                    </Label>
                    <Input
                      id="opening-cash"
                      type="number"
                      value={openingCash}
                      onChange={(e) => setOpeningCash(Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white focus-visible-enhanced"
                      placeholder="Enter opening cash amount"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Select Employees (Optional)</Label>
                    <div className="max-h-32 overflow-y-auto space-y-2 p-2 bg-slate-700/50 rounded-lg border border-slate-600">
                      {employees.map((employee) => (
                        <label key={employee.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmployees([...selectedEmployees, employee.id]);
                              } else {
                                setSelectedEmployees(selectedEmployees.filter(id => id !== employee.id));
                              }
                            }}
                            className="rounded border-slate-500"
                          />
                          <span className="text-slate-300 text-sm">
                            {employee.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleStartShift}
                    disabled={startShiftMutation.isPending}
                    className="w-full touch-target bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    {startShiftMutation.isPending ? 'Starting...' : 'Start Shift'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Enhanced Metrics Grid */}
      {metrics && (
        <div className="metric-cards-grid">
          <ShiftMetricCard
            title="Total Shifts"
            value={metrics.total_shifts}
            subtitle="All time"
            icon={Activity}
            color="blue"
            delay={0}
          />
          <ShiftMetricCard
            title="Active Shifts"
            value={metrics.active_shifts}
            subtitle="Currently running"
            icon={Timer}
            color="green"
            delay={1}
          />
          <ShiftMetricCard
            title="Total Hours"
            value={`${metrics.total_hours}h`}
            subtitle="This month"
            icon={Clock}
            color="purple"
            delay={2}
            trend={{ value: 12.5, isPositive: true }}
          />
          <ShiftMetricCard
            title="Total Payroll"
            value={`$${metrics.total_payroll.toLocaleString()}`}
            subtitle="This month"
            icon={Banknote}
            color="orange"
            delay={3}
            trend={{ value: 8.2, isPositive: true }}
          />
        </div>
      )}

      {/* Enhanced Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search shifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus-visible-enhanced"
          />
        </div>
        
        <Button
          variant="outline"
          className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white focus-visible-enhanced"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Enhanced Data Display */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StandardizedDataTable<ShiftWithEmployee>
                columns={columns}
                data={filteredShifts}
                loading={shiftsLoading}
                className="bg-slate-800/30 backdrop-blur-sm border-slate-700/50"
                aria-label="Shifts management table"
              />
            </motion.div>
          ) : (
            <motion.div
              key="cards-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="card-grid"
            >
              {filteredShifts.map((shift, index) => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MobileShiftCard
                    shift={shift}
                    onView={() => handleViewShift(shift.id)}
                    onClose={shift.is_active ? () => handleCloseShift(shift.id) : undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredShifts.length === 0 && !shiftsLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No shifts found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start by creating your first shift'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start First Shift
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default function ShiftsManagementPage() {
  return <ShiftsManagementContent />;
} 