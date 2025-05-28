import { ShiftControl } from "@/features/sales";
import { PageLayout } from "@/layouts/PageLayout";
import {
  CalendarClock,
  ChartBar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/core/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { formatCurrency } from "@/shared/utils";
import { Skeleton } from "@/core/components/ui/skeleton";
import { Shift } from "@/types";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import { fetchEmployeeByUserId, fetchShiftHistory } from "@/utils/api-helpers";
import { shiftsApi, ShiftPaymentMethod } from "@/core/api";
import { Input } from "@/core/components/ui/primitives/input";
import { Button, ButtonLink } from "@/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { addDays } from "date-fns";
import { Badge } from "@/core/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { useShift } from "../hooks/useShift";
import { useNavigate } from "react-router-dom";
import { formatDateTime, calculateDuration } from "@/shared/utils";
import { ArrowRight, DollarSign } from "lucide-react";
import { cn } from "@/shared/utils";
import { StandardDatePicker } from "@/shared/components/common/datepicker/StandardDatePicker";

// Local InputWithIcon implementation
const InputWithIcon = ({
  icon,
  className,
  ...props
}: {
  icon?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <Input className={cn(icon && "pl-10", className)} {...props} />
    </div>
  );
};

interface ShiftHistoryItem extends Omit<Shift, "sales_total" | "status"> {
  sales_total: number | null;
  employee_name: string;
  status: "OPEN" | "CLOSED";
  payment_methods?: ShiftPaymentMethod[];
  closed_at?: string;
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};

// Add a safe formatting function
const safeFormatDateTime = (dateString?: string | null): string => {
  if (!dateString) return "-";
  try {
    // Validate the date is parseable
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "-";
    }
    return formatDateTime(dateString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};

export function ShiftsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { activeShift, isLoading: isLoadingShift } = useShift();
  const [shiftHistory, setShiftHistory] = useState<ShiftHistoryItem[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<ShiftHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Add console log to debug activeShift state
  useEffect(() => {
    console.log("Shifts page - activeShift state:", activeShift);
  }, [activeShift]);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Add a wrapper function to handle the DateRange type conversion
  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange({
      from: range.from,
      to: range.to || range.from || undefined,
    });
  };

  const loadShiftHistory = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      // First, get the employee name
      const employee = await fetchEmployeeByUserId(user.id);
      const employeeName =
        employee && typeof employee === "object"
          ? (employee as Record<string, unknown>).name || "Current User"
          : "Current User";

      // Then get shift history (increased limit for more history)
      const shifts = await fetchShiftHistory(user.id, 50);

      // Format the data for display
      const formattedData = shifts.map((shift) => ({
        ...shift,
        employee_name: employeeName,
        status: shift.status as "OPEN" | "CLOSED",
      }));

      setShiftHistory(formattedData as ShiftHistoryItem[]);
      setFilteredShifts(formattedData as ShiftHistoryItem[]);

      // Load payment methods for closed shifts
      await loadPaymentMethodsForShifts(formattedData as ShiftHistoryItem[]);
    } catch (error) {
      console.error("Error loading shift history:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load shift history"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading, setError, setShiftHistory, setFilteredShifts]);

  useEffect(() => {
    if (user) {
      loadShiftHistory();
    }
  }, [user, loadShiftHistory]);

  // Apply filters whenever filter state changes
  const applyFilters = useCallback(() => {
    let filtered = [...shiftHistory];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (shift) =>
          shift.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shift.id.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((shift) => shift.status === statusFilter);
    }

    // Date filter
    if (dateRange.from) {
      filtered = filtered.filter((shift) => {
        const shiftDate = new Date(shift.created_at || "");
        const fromDate = dateRange.from!;
        const toDate = dateRange.to || new Date();
        return shiftDate >= fromDate && shiftDate <= toDate;
      });
    }

    setFilteredShifts(filtered);
  }, [shiftHistory, searchTerm, statusFilter, dateRange, setFilteredShifts]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadPaymentMethodsForShifts = async (shifts: ShiftHistoryItem[]) => {
    const closedShifts = shifts.filter((shift) => shift.status === "CLOSED");

    for (const shift of closedShifts) {
      try {
        const response = await shiftsApi.getShiftPaymentMethods(shift.id);
        shift.payment_methods = response.data || [];
      } catch (error) {
        console.error(`Error loading payment methods for shift ${shift.id}:`, error);
      }
    }

    // Update state with payment methods
    setShiftHistory([...shifts]);
    setFilteredShifts([...shifts]);
  };

  const calculateMetrics = () => {
    const totalShifts = filteredShifts.length;
    const openShifts = filteredShifts.filter((s) => s.status === "OPEN").length;
    const closedShifts = filteredShifts.filter((s) => s.status === "CLOSED").length;
    const totalSales = filteredShifts.reduce(
      (sum, shift) => sum + (shift.sales_total || 0),
      0
    );

    return {
      totalShifts,
      openShifts,
      closedShifts,
      totalSales,
    };
  };

  const viewShiftDetails = (shift: ShiftHistoryItem) => {
    navigate(`/shifts/${shift.id}`);
  };

  const handleShiftStart = () => {
    // Navigate to shift open page
    navigate("/finance/shifts/open");
  };

  const handleShiftEnd = () => {
    // Navigate to shift close page
    navigate("/finance/shifts/close");
  };

  const metrics = calculateMetrics();

  return (
    <PageLayout titleKey="shifts.title" descriptionKey="shifts.description">
      <div className="space-y-6">
        {/* Active Shift Control */}
        <ShiftControl 
          onShiftStart={handleShiftStart}
          onShiftEnd={handleShiftEnd}
          isShiftOpen={!!activeShift}
        />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("shifts.metrics.total")}
              </CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalShifts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("shifts.metrics.open")}
              </CardTitle>
              <Plus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics.openShifts}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("shifts.metrics.closed")}
              </CardTitle>
              <ChartBar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.closedShifts}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("shifts.metrics.totalSales")}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(metrics.totalSales)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t("shifts.filters.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputWithIcon
                icon={<Search className="h-4 w-4" />}
                placeholder={t("shifts.filters.search")}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("shifts.filters.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("shifts.status.all")}</SelectItem>
                  <SelectItem value="OPEN">{t("shifts.status.open")}</SelectItem>
                  <SelectItem value="CLOSED">{t("shifts.status.closed")}</SelectItem>
                </SelectContent>
              </Select>

              <StandardDatePicker
                mode="range"
                value={dateRange}
                onChange={handleDateRangeChange}
                placeholder={t("shifts.filters.dateRange")}
              />

              <Button
                variant="outline"
                onClick={loadShiftHistory}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                {t("common.refresh")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Shift History */}
        <Card>
          <CardHeader>
            <CardTitle>{t("shifts.history.title")}</CardTitle>
            <CardDescription>
              {t("shifts.history.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredShifts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t("shifts.history.empty")}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={shift.status === "OPEN" ? "default" : "secondary"}
                        >
                          {shift.status}
                        </Badge>
                        <span className="font-medium">
                          {t("shifts.history.shift")} #{shift.id}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {shift.employee_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {t("shifts.history.started")}: {safeFormatDateTime(shift.created_at)}
                        </span>
                        {shift.closed_at && (
                          <span>
                            {t("shifts.history.closed")}: {safeFormatDateTime(shift.closed_at)}
                          </span>
                        )}
                        {shift.sales_total !== null && (
                          <span>
                            {t("shifts.history.sales")}: {formatCurrency(shift.sales_total)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewShiftDetails(shift)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("shifts.history.viewDetails")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 