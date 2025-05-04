import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/layouts/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, CalendarClock, DollarSign, FileCheck } from "lucide-react";
import { formatCurrency, formatDateTime, calculateDuration } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getShiftPaymentMethods } from "@/services/shiftPaymentMethods";
import { ShiftPaymentMethod } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

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
  payment_methods?: ShiftPaymentMethod[];
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
          .eq("id", id)
          .single();
          
        if (shiftResponse.error) {
          throw shiftResponse.error;
        }
        
        if (!shiftResponse.data) {
          throw new Error("Shift not found");
        }

        // Safely cast to our expected type
        const typedShiftData = shiftResponse.data as RawShiftData;
        
        // Fetch the employee name - use fetch API instead of supabase client to avoid type issues
        let employeeName = "Unknown";
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/employees?user_id=eq.${typedShiftData.user_id}&select=name`, {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              employeeName = data[0].name;
            }
          }
        } catch (err) {
          console.error("Error fetching employee name:", err);
        }
        
        // Fetch payment methods if the shift is closed
        let paymentMethods: ShiftPaymentMethod[] = [];
        if (typedShiftData.status === "CLOSED") {
          paymentMethods = await getShiftPaymentMethods(id);
        }
        
        // Calculate sales total
        const salesResponse = await supabase
          .from("sales")
          .select("total_sales")
          .eq("shift_id", id);
          
        if (salesResponse.error) {
          console.error("Error fetching sales data:", salesResponse.error);
        }
        
        const salesTotal = (salesResponse.data || []).reduce((sum, sale) => sum + (sale.total_sales || 0), 0);
        
        // Set the complete shift data with proper structure
        setShift({
          id: typedShiftData.id,
          status: typedShiftData.status as "OPEN" | "CLOSED",
          opening_cash: typedShiftData.opening_cash,
          closing_cash: typedShiftData.closing_cash,
          sales_total: salesTotal || typedShiftData.sales_total,
          start_time: typedShiftData.start_time,
          end_time: typedShiftData.end_time,
          employee_name: employeeName,
          payment_methods: paymentMethods,
          user_id: typedShiftData.user_id
        });
      } catch (error: any) {
        console.error("Error loading shift details:", error);
        setError(error.message || "Failed to load shift details");
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
            href="/shifts"
            variant="outline"
            startIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {t("common.backToShifts")}
          </ButtonLink>
        }
      >
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-full max-w-[250px]" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-md">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
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
            href="/shifts"
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
            href="/shifts"
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
          href="/shifts"
          variant="outline"
          startIcon={<ArrowLeft className="h-4 w-4" />}
        >
          {t("common.backToShifts")}
        </ButtonLink>
      }
    >
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${shift.status === 'OPEN' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
              <CardTitle>
                {shift.status === 'OPEN' ? t("shifts.activeShift") : t("shifts.completedShift")} - {shift.employee_name}
              </CardTitle>
            </div>
            <CardDescription>
              {shift.status === 'OPEN' 
                ? t("shifts.activeShiftDescription") 
                : t("shifts.completedShiftDescription")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-md">
              <div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {t("shifts.startedAt")}
                </div>
                <div className="font-medium">
                  {safeFormatDateTime(shift.start_time)}
                </div>
              </div>
              
              {shift.status === 'CLOSED' && shift.end_time && (
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {t("shifts.endedAt")}
                  </div>
                  <div className="font-medium">
                    {safeFormatDateTime(shift.end_time)}
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {t("shifts.openingCash")}
                </div>
                <div className="font-medium">
                  {formatCurrency(shift.opening_cash)}
                </div>
              </div>
              
              {shift.status === 'CLOSED' && shift.closing_cash !== undefined && (
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {t("shifts.closingCash")}
                  </div>
                  <div className="font-medium">
                    {formatCurrency(shift.closing_cash)}
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <FileCheck className="h-3.5 w-3.5" />
                  {t("shifts.salesTotal")}
                </div>
                <div className="font-medium">
                  {formatCurrency(shift.sales_total || 0)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">{t("shifts.duration")}</div>
                <div className="font-medium">
                  {shift.status === 'OPEN' 
                    ? calculateDuration(shift.start_time) 
                    : shift.end_time 
                      ? `${safeFormatDateTime(shift.end_time)} (${calculateDuration(shift.start_time)})`
                      : calculateDuration(shift.start_time)}
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            {shift.status === 'CLOSED' && shift.payment_methods && shift.payment_methods.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">{t("shifts.paymentMethods")}</h3>
                <div className="border rounded-md divide-y">
                  {shift.payment_methods.map((method, index) => (
                    <div key={index} className="p-3 flex justify-between items-center">
                      <div className="font-medium capitalize">
                        {method.payment_method}
                      </div>
                      <div>
                        {formatCurrency(method.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Cash Difference */}
            {shift.status === 'CLOSED' && shift.opening_cash !== undefined && shift.closing_cash !== undefined && (
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{t("shifts.cashDifference")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("shifts.cashDifferenceDescription")}
                    </p>
                  </div>
                  <div className={`text-xl font-bold ${
                    shift.closing_cash - shift.opening_cash >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {formatCurrency(shift.closing_cash - shift.opening_cash)}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 