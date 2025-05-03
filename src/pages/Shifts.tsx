import { ShiftControl } from "@/components/sales/ShiftControl";
import { PageLayout } from "@/layouts/PageLayout";
import { CalendarClock, ChartBar, Search, Filter, RefreshCw, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Shift, ShiftPaymentMethod } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchEmployeeByUserId, fetchShiftHistory } from "@/utils/api-helpers";
import { getShiftPaymentMethods } from "@/services/shiftPaymentMethods";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useShift } from "@/hooks/useShift";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateTime, calculateDuration } from "@/lib/utils";
import { MultiPaymentMethodFormStandardized, MultiPaymentFormData } from "@/components/shared/MultiPaymentMethodFormStandardized";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

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

const Shifts = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { activeShift, endShift, isLoading: isLoadingEndShift } = useShift();
  const [shiftHistory, setShiftHistory] = useState<ShiftHistoryItem[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<ShiftHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftHistoryItem | null>(null);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [closeShiftSuccess, setCloseShiftSuccess] = useState(false);
  
  // Get query params for tab handling
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const defaultTab = tabParam === 'close' && activeShift ? 'close' : 'current';
  
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
        const paymentMethods = await getShiftPaymentMethods(shift.id);
        shift.payment_methods = paymentMethods;
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
  
  // Calculate shift duration
  const calculateDuration = (shift: ShiftHistoryItem) => {
    if (!shift.end_time || !shift.start_time) {
      return "-";
    }
    
    try {
      const start = new Date(shift.start_time);
      const end = new Date(shift.end_time);
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "-";
      }
      
      const diffMs = end.getTime() - start.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error("Error calculating shift duration:", error);
      return "-";
    }
  };
  
  // Calculate difference between closing and expected cash
  const calculateCashDifference = (shift: ShiftHistoryItem) => {
    if (shift.status !== "CLOSED" || shift.closing_cash === undefined) {
      return null;
    }
    
    const expectedCash = (shift.opening_cash || 0) + (shift.sales_total || 0);
    const difference = (shift.closing_cash || 0) - expectedCash;
    
    return difference;
  };
  
  // Format payment methods summary
  const formatPaymentMethods = (shift: ShiftHistoryItem) => {
    if (!shift.payment_methods || shift.payment_methods.length === 0) {
      return "-";
    }
    
    // Group by payment method and sum amounts
    const methodTotals = shift.payment_methods.reduce((acc, method) => {
      if (!acc[method.payment_method]) {
        acc[method.payment_method] = 0;
      }
      acc[method.payment_method] += method.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // If there's just cash, display as "Cash Only"
    if (Object.keys(methodTotals).length === 1 && methodTotals["cash"]) {
      return t("shifts.cashOnly");
    }
    
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="p-0 h-auto font-normal text-xs text-blue-600 hover:text-blue-800 hover:bg-transparent"
        onClick={() => {
          setSelectedShift(shift);
          setIsPaymentDetailsOpen(true);
        }}
      >
        {t("shifts.viewPaymentMethods")}
      </Button>
    );
  };

  const handleEndShift = async (data: MultiPaymentFormData) => {
    try {
      setError(null);
      
      // Calculate total cash amount by summing all cash payment methods
      const cashTotal = data.paymentMethods
        .filter(method => method.payment_method === "cash")
        .reduce((sum, method) => sum + method.amount, 0);
        
      await endShift(cashTotal, data.paymentMethods);
      setCloseShiftSuccess(true);
      
      // After 3 seconds, redirect to the shifts tab
      setTimeout(() => {
        // Change the URL but stay on the same page
        navigate("/shifts", { replace: true });
        // Reload shift history
        loadShiftHistory();
      }, 2000);
    } catch (error) {
      console.error("Error ending shift with multiple payments:", error);
      setError("Failed to close shift. Please try again.");
    }
  };

  return (
    <PageLayout
      titleKey="common.shifts"
      descriptionKey="shifts.description"
      icon={CalendarClock}
    >
      <div className="space-y-6">
        {/* Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("shifts.activeShifts")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeShifts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("shifts.closedShifts")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.closedShifts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("shifts.totalShifts")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalShifts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("shifts.totalSales")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalSales)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="current">{t("shifts.currentShift")}</TabsTrigger>
            <TabsTrigger value="history">{t("shifts.shiftHistory")}</TabsTrigger>
            {activeShift && (
              <TabsTrigger value="close">{t("shifts.closeShift")}</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("shifts.shiftControl")}</CardTitle>
                <CardDescription>
                  {activeShift 
                    ? t("shifts.activeShiftDescription") 
                    : t("shifts.noActiveShiftDescription")}
                </CardDescription>
          </CardHeader>
          <CardContent>
            <ShiftControl />
          </CardContent>
        </Card>

            {activeShift && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{t("shifts.currentShiftDetails")}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        // Force a refresh of the active shift data
                        if (activeShift) {
                          useShift().checkActiveShift();
                        }
                      }}
                      title={t("common.refresh")}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t("shifts.startTime")}
                      </dt>
                      <dd className="text-lg">
                        {new Date(activeShift.start_time).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t("shifts.openingCash")}
                      </dt>
                      <dd className="text-lg">{formatCurrency(activeShift.opening_cash)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t("shifts.currentSales")}
                      </dt>
                      <dd className="text-lg">{formatCurrency(activeShift.sales_total || 0)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t("shifts.expectedCash")}
                      </dt>
                      <dd className="text-lg">
                        {formatCurrency((activeShift.opening_cash || 0) + (activeShift.sales_total || 0))}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("common.filters")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("common.search")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => loadShiftHistory()}
                      title={t("common.refresh")}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:flex gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder={t("common.status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("common.all")}</SelectItem>
                        <SelectItem value="OPEN">{t("shifts.open")}</SelectItem>
                        <SelectItem value="CLOSED">{t("shifts.closed")}</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <DatePickerWithRange
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("common.error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            ) : filteredShifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("common.noData")}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">
                        {t("common.date")}
                      </th>
                      <th className="px-4 py-3 text-left">
                        {t("shifts.startTime")}
                      </th>
                      <th className="px-4 py-3 text-left">
                        {t("shifts.endTime")}
                      </th>
                        <th className="px-4 py-3 text-left">
                          {t("shifts.duration")}
                        </th>
                      <th className="px-4 py-3 text-left">
                        {t("shifts.openingCash")}
                      </th>
                      <th className="px-4 py-3 text-left">
                        {t("shifts.closingCash")}
                      </th>
                      <th className="px-4 py-3 text-left">
                        {t("shifts.totalSales")}
                      </th>
                        <th className="px-4 py-3 text-left">
                          {t("shifts.cashDifference")}
                        </th>
                        <th className="px-4 py-3 text-left">
                          {t("common.paymentMethods")}
                        </th>
                      <th className="px-4 py-3 text-left">
                        {t("common.status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                      {filteredShifts.map((shift) => {
                        const cashDifference = calculateCashDifference(shift);
                        return (
                      <tr key={shift.id} className="border-b">
                        <td className="px-4 py-3">
                              {shift.created_at || shift.start_time ? formatDate(shift.created_at || shift.start_time) : "-"}
                        </td>
                        <td className="px-4 py-3">
                              {shift.created_at || shift.start_time 
                                ? new Date(shift.created_at || shift.start_time).toLocaleTimeString() 
                                : "-"}
                        </td>
                        <td className="px-4 py-3">
                          {shift.end_time
                            ? new Date(shift.end_time).toLocaleTimeString()
                            : "-"}
                        </td>
                            <td className="px-4 py-3">
                              {calculateDuration(shift)}
                            </td>
                        <td className="px-4 py-3">
                          {formatCurrency(shift.opening_cash)}
                        </td>
                        <td className="px-4 py-3">
                              {shift.closing_cash !== null && shift.closing_cash !== undefined
                            ? formatCurrency(shift.closing_cash)
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(shift.sales_total || 0)}
                        </td>
                        <td className="px-4 py-3">
                              {cashDifference !== null ? (
                                <span className={cashDifference < 0 ? "text-red-500" : (cashDifference > 0 ? "text-green-500" : "")}>
                                  {formatCurrency(cashDifference)}
                                </span>
                              ) : "-"}
                            </td>
                            <td className="px-4 py-3">
                              {shift.status === "CLOSED" ? formatPaymentMethods(shift) : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={shift.status === "OPEN" ? "default" : "secondary"}
                          >
                            {shift.status === "OPEN"
                              ? t("shifts.open")
                              : t("shifts.closed")}
                              </Badge>
                        </td>
                      </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </TabsContent>
          
          {/* New tab for closing a shift */}
          <TabsContent value="close" className="space-y-4">
            {!activeShift ? (
              <Card>
                <CardContent className="pt-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("shifts.noActiveShift")}</AlertTitle>
                    <AlertDescription>
                      {t("shifts.noActiveShiftToClose")}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ) : closeShiftSuccess ? (
              <Card>
                <CardContent className="pt-6">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800">
                      {t("shifts.shiftClosedSuccessfully")}
                    </AlertTitle>
                    <AlertDescription>
                      {t("shifts.redirectingToShifts")}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-2xl mx-auto">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("common.error")}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t("shifts.closeShift")}</CardTitle>
                    <CardDescription>
                      {t("shifts.endShiftDescription")}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-md">
                        <div>
                          <div className="text-sm text-muted-foreground">{t("shifts.startedAt")}</div>
                          <div className="font-medium">
                            {activeShift.started_at ? formatDateTime(activeShift.started_at) : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{t("shifts.duration")}</div>
                          <div className="font-medium">
                            {activeShift.started_at ? calculateDuration(activeShift.started_at) : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{t("shifts.openingCash")}</div>
                          <div className="font-medium">
                            {formatCurrency(activeShift.opening_cash || 0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{t("shifts.salesTotal")}</div>
                          <div className="font-medium">
                            {formatCurrency(activeShift.sales_total || 0)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{t("shifts.salesTotal")}</div>
                          <div className="text-lg font-bold">
                            {formatCurrency(activeShift.sales_total || 0)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("shifts.multiPaymentDescription")}
                        </div>
                      </div>
                      
                      <MultiPaymentMethodFormStandardized 
                        onSubmit={handleEndShift}
                        isSubmitting={isLoadingEndShift}
                        totalAmount={activeShift.sales_total || 0}
                      />
                    </div>
                  </CardContent>
                </Card>
        </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Payment methods details dialog */}
      <Dialog open={isPaymentDetailsOpen} onOpenChange={setIsPaymentDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("shifts.paymentMethodsDetails")}</DialogTitle>
            <DialogDescription>
              {t("shifts.paymentMethodsDetailsDescription")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedShift && selectedShift.payment_methods && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 font-medium text-sm py-2 border-b">
                <div>{t("common.paymentMethod")}</div>
                <div>{t("common.amount")}</div>
                <div>{t("common.reference")}</div>
              </div>
              
              {selectedShift.payment_methods.map((method, index) => (
                <div key={index} className="grid grid-cols-3 text-sm py-2 border-b border-muted">
                  <div className="capitalize">
                    {t(`paymentMethods.${method.payment_method}`)}
                  </div>
                  <div>{formatCurrency(method.amount)}</div>
                  <div className="truncate">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          {method.reference || "-"}
                        </TooltipTrigger>
                        {method.reference && (
                          <TooltipContent>
                            <p>{method.reference}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between pt-4 font-medium">
                <span>{t("common.total")}</span>
                <span>{formatCurrency(selectedShift.sales_total || 0)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Shifts;
