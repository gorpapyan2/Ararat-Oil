import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/layouts/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button, ButtonLink } from "@/core/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import {
  ArrowLeft,
  AlertCircle,
  CalendarClock,
  DollarSign,
  FileCheck,
  Clock,
  Receipt,
  Users,
  CreditCard,
} from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  calculateDuration,
  calculateShiftDuration,
} from "@/shared/utils";
import { supabase } from "@/core/api/supabase";
import { shiftsApi, ShiftPaymentMethod } from "@/core/api";
import { Skeleton } from "@/core/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { Separator } from "@/core/components/ui/separator";

// Define the shift structure based on what's used in this component
interface DetailShift {
  id: string;
  status: "OPEN" | "CLOSED";
  opening_cash: number;
  closing_cash?: number;
  sales_total?: number;
  start_time: string;
  end_time?: string;
  employee_name?: string;
  payment_methods?: ExtendedShiftPaymentMethod[];
  user_id?: string;
}

// Interface for raw data response from supabase
interface RawShiftData {
  id: string;
  status: string;
  opening_cash: number;
  closing_cash?: number;
  sales_total?: number;
  start_time: string;
  end_time?: string;
  user_id: string;
  employee_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Add this just after the other interfaces
// Extended interface to handle legacy references
interface ExtendedShiftPaymentMethod extends ShiftPaymentMethod {
  reference?: string; // For backwards compatibility
}

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

export default function ShiftDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [shift, setShift] = useState<DetailShift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch shift details
  useEffect(() => {
    if (!id) {
      setError("No shift ID provided");
      setIsLoading(false);
      return;
    }

    async function loadShiftDetails() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the shift data with explicit type casting to avoid deep type instantiation
        const shiftResponse = await supabase
          .from("shifts")
          .select("*")
          .eq("id", id || "")
          .single();

        if (shiftResponse.error) {
          throw shiftResponse.error;
        }

        if (!shiftResponse.data) {
          throw new Error("Shift not found");
        }

        // Safely cast to our expected type
        const typedShiftData = shiftResponse.data as RawShiftData;

        // Log data for debugging
        console.log("Fetched shift data:", typedShiftData);
        console.log("User ID from shift:", typedShiftData.user_id);

        // Fetch the employee name - use fetch API instead of supabase client to avoid type issues
        let employeeName = "Unknown";
        try {
          // Only make the API call if user_id exists
          if (typedShiftData.user_id) {
            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/employees?user_id=eq.${typedShiftData.user_id}&select=name`,
              {
                headers: {
                  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data && data.length > 0) {
                employeeName = data[0].name;
              }
            }
          } else {
            console.log("No user_id available for employee lookup");
          }
        } catch (err) {
          console.error("Error fetching employee name:", err);
        }

        // Fetch payment methods if the shift is closed
        let paymentMethods: ExtendedShiftPaymentMethod[] = [];
        if (typedShiftData.status === "CLOSED" && id) {
          // Correctly handle the API response
          const paymentMethodsResponse =
            await shiftsApi.getShiftPaymentMethods(id);
          if (paymentMethodsResponse.data) {
            // Cast the response data to our extended type to handle reference field
            paymentMethods =
              paymentMethodsResponse.data as unknown as ExtendedShiftPaymentMethod[];
          }
        }

        // Calculate sales total
        const salesResponse = await supabase
          .from("sales")
          .select("total_sales")
          .eq("shift_id", id || "");

        if (salesResponse.error) {
          console.error("Error fetching sales data:", salesResponse.error);
        }

        const salesTotal = (salesResponse.data || []).reduce(
          (sum, sale) => sum + (sale.total_sales || 0),
          0
        );

        // Set the complete shift data with proper structure
        setShift({
          id: typedShiftData.id,
          status: typedShiftData.status as "OPEN" | "CLOSED",
          opening_cash: typedShiftData.opening_cash,
          closing_cash: typedShiftData.closing_cash,
          sales_total: salesTotal || typedShiftData.sales_total || 0,
          start_time: typedShiftData.start_time,
          end_time: typedShiftData.end_time,
          employee_name: employeeName || "Unknown Employee",
          payment_methods: paymentMethods,
          user_id: typedShiftData.user_id || undefined,
        });
      } catch (error: unknown) {
        console.error("Error loading shift details:", error);
        setError(error instanceof Error ? error.message : "Failed to load shift details");
      } finally {
        setIsLoading(false);
      }
    }

    loadShiftDetails();
  }, [id]);

  // Show loading state
  if (isLoading) {
    return (
      <PageLayout
        titleKey="shifts.shiftDetails"
        action={
          <ButtonLink
            href="/finance/shifts"
            variant="outline"
            startIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {t("common.backToShifts")}
          </ButtonLink>
        }
      >
        <div className="max-w-3xl mx-auto">
          <Card className="border border-muted">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-4 w-full max-w-[250px] mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-muted my-4" />
              <Skeleton className="h-28 w-full" />
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageLayout
        titleKey="shifts.shiftDetails"
        action={
          <ButtonLink
            href="/finance/shifts"
            variant="outline"
            startIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {t("common.backToShifts")}
          </ButtonLink>
        }
      >
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </PageLayout>
    );
  }

  // Show no data state
  if (!shift) {
    return (
      <PageLayout
        titleKey="shifts.shiftDetails"
        action={
          <ButtonLink
            href="/finance/shifts"
            variant="outline"
            startIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {t("common.backToShifts")}
          </ButtonLink>
        }
      >
        <div className="max-w-3xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.noData")}</AlertTitle>
            <AlertDescription>{t("shifts.shiftNotFound")}</AlertDescription>
          </Alert>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      titleKey="shifts.shiftDetails"
      action={
        <ButtonLink
          href="/finance/shifts"
          variant="outline"
          startIcon={<ArrowLeft className="h-4 w-4" />}
        >
          {t("common.backToShifts")}
        </ButtonLink>
      }
    >
      <div className="max-w-3xl mx-auto">
        <Card className="border border-muted mb-6">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div
                className={`h-3 w-3 rounded-full ${shift.status === "OPEN" ? "bg-blue-500" : "bg-slate-500"}`}
              ></div>
              <CardTitle className="flex items-center space-x-2">
                <span>
                  {shift.status === "OPEN"
                    ? t("shifts.activeShift")
                    : t("shifts.completedShift")}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-base font-medium">
                  {shift.employee_name}
                </span>
              </CardTitle>
            </div>
            <CardDescription className="flex items-center mt-1.5">
              <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
              {shift.status === "OPEN"
                ? t("shifts.activeShiftDescription")
                : t("shifts.completedShiftDescription")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details">
                  <FileCheck className="h-4 w-4 mr-2" />
                  {t("shifts.details")}
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  disabled={
                    shift.status !== "CLOSED" || !shift.payment_methods?.length
                  }
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t("shifts.payment")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-muted/20 rounded-lg border border-muted">
                    <div className="flex items-center mb-2 text-blue-600">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      <h3 className="font-medium text-sm">
                        {t("shifts.timeDetails")}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {t("shifts.startedAt")}
                        </div>
                        <div className="font-medium text-sm">
                          {safeFormatDateTime(shift.start_time)}
                        </div>
                      </div>

                      {shift.status === "CLOSED" && shift.end_time && (
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {t("shifts.endedAt")}
                          </div>
                          <div className="font-medium text-sm">
                            {safeFormatDateTime(shift.end_time)}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-xs text-muted-foreground">
                          {t("shifts.duration")}
                        </div>
                        <div className="font-medium text-sm">
                          {shift.status === "OPEN"
                            ? calculateDuration(shift.start_time)
                            : shift.end_time
                              ? calculateShiftDuration(
                                  shift.start_time,
                                  shift.end_time
                                )
                              : calculateDuration(shift.start_time)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-lg border border-muted">
                    <div className="flex items-center mb-2 text-blue-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <h3 className="font-medium text-sm">
                        {t("shifts.cashDetails")}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {t("shifts.openingCash")}
                        </div>
                        <div className="font-medium text-sm">
                          {formatCurrency(shift.opening_cash)}
                        </div>
                      </div>

                      {shift.status === "CLOSED" &&
                        shift.closing_cash !== undefined && (
                          <div>
                            <div className="text-xs text-muted-foreground">
                              {t("shifts.closingCash")}
                            </div>
                            <div className="font-medium text-sm">
                              {formatCurrency(shift.closing_cash)}
                            </div>
                          </div>
                        )}

                      {shift.status === "CLOSED" &&
                        shift.closing_cash !== undefined && (
                          <div>
                            <div className="text-xs text-muted-foreground">
                              {t("shifts.cashDifference")}
                            </div>
                            <div
                              className={`font-medium text-sm ${
                                shift.closing_cash - shift.opening_cash >= 0
                                  ? "text-blue-600"
                                  : "text-red-600"
                              }`}
                            >
                              {formatCurrency(
                                shift.closing_cash - shift.opening_cash
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-lg border border-muted">
                    <div className="flex items-center mb-2 text-blue-600">
                      <Receipt className="h-4 w-4 mr-2" />
                      <h3 className="font-medium text-sm">
                        {t("shifts.salesDetails")}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {t("shifts.salesTotal")}
                        </div>
                        <div className="font-medium text-sm">
                          {formatCurrency(shift.sales_total || 0)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">
                          {t("shifts.employee")}
                        </div>
                        <div className="font-medium text-sm flex items-center">
                          <Users className="h-3 w-3 mr-1.5 text-muted-foreground" />
                          {shift.employee_name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash Difference Explanation */}
                {shift.status === "CLOSED" &&
                  shift.opening_cash !== undefined &&
                  shift.closing_cash !== undefined && (
                    <div className="bg-accent/20 p-4 rounded-lg border border-accent">
                      <h3 className="font-medium text-sm mb-2">
                        {t("shifts.cashReconciliation")}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("shifts.cashDifferenceDescription")}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {t("shifts.expectedCash")}
                          </div>
                          <div className="font-medium">
                            {formatCurrency(shift.opening_cash)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {t("shifts.actualCash")}
                          </div>
                          <div className="font-medium">
                            {formatCurrency(shift.closing_cash)}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">
                          {t("shifts.cashDifference")}
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            shift.closing_cash - shift.opening_cash >= 0
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(
                            shift.closing_cash - shift.opening_cash
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                {shift.status === "CLOSED" &&
                  shift.payment_methods &&
                  shift.payment_methods.length > 0 && (
                    <div>
                      <div className="flex items-center mb-3">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium">
                          {t("shifts.paymentMethodsDetails")}
                        </h3>
                      </div>

                      <div className="rounded-lg border overflow-hidden">
                        <div className="bg-muted/30 px-4 py-2.5 border-b">
                          <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-3 text-sm font-medium">
                              {t("common.paymentMethod")}
                            </div>
                            <div className="col-span-2 text-sm font-medium text-right">
                              {t("common.amount")}
                            </div>
                          </div>
                        </div>

                        {shift.payment_methods.map((method, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 border-b last:border-b-0"
                          >
                            <div className="grid grid-cols-5 gap-4">
                              <div className="col-span-3 font-medium capitalize flex items-center">
                                {method.payment_method === "cash" && (
                                  <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                                )}
                                {method.payment_method === "card" && (
                                  <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                                )}
                                {method.payment_method === "bank_transfer" && (
                                  <Receipt className="h-4 w-4 mr-2 text-blue-500" />
                                )}
                                {method.payment_method}
                                {(method.reference || method.notes) && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({method.reference || method.notes})
                                  </span>
                                )}
                              </div>
                              <div className="col-span-2 text-right font-semibold">
                                {formatCurrency(method.amount)}
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="px-4 py-3 bg-muted/20 border-t">
                          <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-3 font-medium">
                              {t("common.total")}
                            </div>
                            <div className="col-span-2 text-right font-bold text-blue-600">
                              {formatCurrency(
                                shift.payment_methods.reduce(
                                  (sum, method) => sum + method.amount,
                                  0
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
