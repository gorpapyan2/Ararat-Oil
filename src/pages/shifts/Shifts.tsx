import { ShiftControl } from "@/features/sales";
import { PageLayout } from "@/layouts/PageLayout";
import { CalendarClock, ChartBar, Search, Filter, RefreshCw, Eye, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Shift } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchEmployeeByUserId, fetchShiftHistory } from "@/utils/api-helpers";
import { shiftsApi, ShiftPaymentMethod } from "@/core/api";
import { Input } from "@/components/ui/input";
import { Button, ButtonLink } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useShift } from "@/hooks/useShift";
import { useNavigate } from "react-router-dom";
import { formatDateTime, calculateDuration } from "@/lib/utils";
import { ArrowRight, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// Local InputWithIcon implementation
const InputWithIcon = ({ 
  icon, 
  className, 
  ...props 
}: { 
  icon?: React.ReactNode; 
  className?: string; 
  [key: string]: any 
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <Input
        className={cn(icon && "pl-10", className)}
        {...props}
      />
    </div>
  );
};

interface ShiftHistoryItem extends Omit<Shift, "sales_total" | "status"> {
  sales_total: number | null;
  employee_name: string;
  status: "OPEN" | "CLOSED";
  payment_methods?: ShiftPaymentMethod[];
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

const Shifts = () => {
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
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange({
      from: range.from,
      to: range.to || range.from || undefined
    });
  };

  useEffect(() => {
    if (user) {
      loadShiftHistory();
    }
  }, [user]);
  
  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateRange, shiftHistory]);

  const loadShiftHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      // First, get the employee name
      const employee = await fetchEmployeeByUserId(user.id);
      const employeeName =
        employee && typeof employee === "object"
          ? (employee as any).name || "Current User"
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
    } catch (error: any) {
      console.error("Error loading shift history:", error);
      setError(error.message || "Failed to load shift history");
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadPaymentMethodsForShifts = async (shifts: ShiftHistoryItem[]) => {
    try {
      const closedShifts = shifts.filter(shift => shift.status === "CLOSED");
      
      for (const shift of closedShifts) {
        const response = await shiftsApi.getPaymentMethods(shift.id);
        if (response.error) {
          console.error(`Error fetching payment methods for shift ${shift.id}:`, response.error);
        } else {
          shift.payment_methods = response.data || [];
        }
      }
      
      // Update state with payment methods information
      setShiftHistory([...shifts]);
    } catch (error) {
      console.error("Error loading payment methods for shifts:", error);
    }
  };
  
  const applyFilters = () => {
    let result = [...shiftHistory];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(shift => shift.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      result = result.filter(shift => {
        const shiftDate = new Date(shift.created_at || shift.start_time);
        return shiftDate >= dateRange.from! && shiftDate <= dateRange.to!;
      });
    }
    
    // Apply search term - search in dates or employee name
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(shift => 
        formatDate(shift.created_at || shift.start_time).toLowerCase().includes(lowercaseSearch) ||
        shift.employee_name.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    setFilteredShifts(result);
  };
  
  // Calculate shift metrics
  const calculateMetrics = () => {
    const activeShifts = shiftHistory.filter(shift => shift.status === "OPEN").length;
    const totalShifts = shiftHistory.length;
    const closedShifts = shiftHistory.filter(shift => shift.status === "CLOSED").length;
    
    // Calculate total sales from shift history
    const historyTotalSales = shiftHistory.reduce((sum, shift) => sum + (shift.sales_total || 0), 0);
    
    // Add the current active shift's sales if it exists (and isn't already in history)
    const currentShiftSales = activeShift?.sales_total || 0;
    
    // Check if the active shift is already in the history (to avoid double counting)
    const activeShiftInHistory = activeShift ? 
      shiftHistory.some(s => s.id === activeShift.id) : 
      false;
    
    // Total sales combines history and current shift (if not in history)
    const totalSales = historyTotalSales + (activeShiftInHistory ? 0 : currentShiftSales);
    
    return { activeShifts, totalShifts, closedShifts, totalSales };
  };
  
  const metrics = calculateMetrics();
  
  // Navigate to shift details
  const viewShiftDetails = (shift: ShiftHistoryItem) => {
    navigate(`/finance/shifts/${shift.id}`);
  };
  
  return (
    <PageLayout 
      titleKey="shifts.title"
      descriptionKey="shifts.description"
      action={
        activeShift || metrics.activeShifts > 0 ? (
          <ButtonLink 
            href="/finance/shifts/close"
            variant="default"
            className="bg-amber-600 hover:bg-amber-700"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {t("shifts.closeShift")}
          </ButtonLink>
        ) : (
          <ButtonLink 
            href="/finance/shifts/open"
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("shifts.startShift")}
          </ButtonLink>
        )
      }
    >
      <div className="space-y-6">
        {/* Active Shift Card - only show if there's an active shift */}
        {activeShift && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-blue-800 dark:text-blue-400">
                <CalendarClock className="h-5 w-5 mr-2" />
                {t("shifts.activeShift")}
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-500">
                {t("shifts.activeShiftDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="space-y-1">
                  <div className="text-sm text-blue-700 dark:text-blue-500 font-medium">{t("shifts.startedAt")}</div>
                  <div className="text-blue-900 dark:text-blue-300">
                    {activeShift && activeShift.start_time ? safeFormatDateTime(activeShift.start_time) : "-"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-blue-700 dark:text-blue-500 font-medium">{t("shifts.duration")}</div>
                  <div className="text-blue-900 dark:text-blue-300">
                    {activeShift && activeShift.start_time ? calculateDuration(activeShift.start_time) : "-"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-blue-700 dark:text-blue-500 font-medium">{t("shifts.openingCash")}</div>
                  <div className="text-blue-900 dark:text-blue-300">
                    {formatCurrency(activeShift.opening_cash)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-blue-700 dark:text-blue-500 font-medium">{t("shifts.salesTotal")}</div>
                  <div className="text-blue-900 dark:text-blue-300 font-bold">
                    {formatCurrency(activeShift.sales_total || 0)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  className="text-blue-700 border-blue-300 hover:bg-blue-100 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/30"
                  onClick={() => viewShiftDetails(activeShift as ShiftHistoryItem)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t("shifts.viewDetails")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">{t("shifts.totalShifts")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-2xl font-bold">{metrics.totalShifts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">{t("shifts.activeShifts")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-2xl font-bold">{metrics.activeShifts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">{t("shifts.closedShifts")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-2xl font-bold">{metrics.closedShifts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">{t("shifts.totalSales")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalSales)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Shift History Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("shifts.shiftHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex-1 min-w-[180px]">
                <InputWithIcon
                  placeholder={t("common.search")}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full"
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="w-full sm:w-auto">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full min-w-[120px]">
                    <SelectValue placeholder={t("shifts.filterByStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="OPEN">{t("shifts.open")}</SelectItem>
                    <SelectItem value="CLOSED">{t("shifts.closed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-auto flex-1 sm:flex-none min-w-[250px]">
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={loadShiftHistory}
                title={t("common.refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("common.error")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-44" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results State */}
            {!isLoading && filteredShifts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || statusFilter !== "all" || dateRange.from || dateRange.to
                  ? t("common.noFilterResults")
                  : t("shifts.noShiftHistory")}
              </div>
            )}

            {/* Results */}
            {!isLoading && filteredShifts.length > 0 && (
              <div className="space-y-2">
                {filteredShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="flex flex-wrap md:flex-nowrap items-center p-3 border rounded-md"
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium truncate mr-2">
                          {safeFormatDateTime(shift.created_at || shift.start_time)}
                        </h4>
                        <Badge
                          variant={shift.status === "OPEN" ? "success" : "default"}
                          className="ml-auto md:ml-2"
                        >
                          {shift.status === "OPEN" ? t("shifts.open") : t("shifts.closed")}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {shift.status === "OPEN"
                          ? t("shifts.durationSoFar", {
                              duration: shift.start_time ? calculateDuration(shift.start_time) : "-",
                            })
                          : t("shifts.totalSales", {
                              amount: formatCurrency(shift.sales_total || 0),
                            })}
                      </div>
                    </div>
                    <div className="w-full md:w-auto flex justify-end items-center space-x-2 mt-2 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full md:w-auto"
                        onClick={() => viewShiftDetails(shift)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {t("common.details")}
                      </Button>
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
};

export default Shifts;
