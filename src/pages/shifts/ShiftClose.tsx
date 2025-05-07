import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useShift } from "@/hooks/useShift";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/layouts/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MultiPaymentMethodFormStandardized, MultiPaymentFormData } from "@/components/shared/MultiPaymentMethodFormStandardized";
import { formatCurrency, formatDateTime, calculateDuration } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

// Add a safe formatting function
const safeFormatDateTime = (dateString?: string | null): string => {
  if (!dateString) return "-";
  try {
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

export default function ShiftClose() {
  const { t } = useTranslation();
  const { activeShift, endShift, isLoading: isShiftLoading, checkActiveShift } = useShift();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Create a memoized navigation handler
  const navigateToShifts = useCallback(() => {
    // Use replace to prevent back-button issues
    navigate('/shifts', { replace: true });
  }, [navigate]);

  // Check for active shift on mount and periodically
  useEffect(() => {
    let intervalId: number;

    const checkShift = async () => {
      await checkActiveShift();
      if (!activeShift && !isShiftLoading) {
        // Use replace to prevent back-button issues
        navigate('/shifts', { replace: true });
      }
    };

    // Initial check
    checkShift();

    // Set up periodic check every 5 seconds
    intervalId = window.setInterval(checkShift, 5000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeShift, isShiftLoading, checkActiveShift, navigate]);

  // Set up redirection after success
  useEffect(() => {
    let redirectTimer: number;
    
    if (success) {
      redirectTimer = window.setTimeout(() => {
        // Use replace to prevent back-button issues
        navigate('/shifts', { replace: true });
      }, 2000);
    }
    
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [success, navigate]);

  const handleEndShift = async (data: MultiPaymentFormData) => {
    if (!activeShift) {
      setError(t("shifts.noActiveShift"));
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      
      // Calculate total cash amount
      const cashTotal = data.paymentMethods
        .filter(method => method.payment_method === "cash")
        .reduce((sum, method) => sum + method.amount, 0);
      
      await endShift(cashTotal, data.paymentMethods);
      setSuccess(true);
    } catch (error: any) {
      console.error("Error ending shift:", error);
      setError(error.message || t("shifts.closeShiftError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success state
  if (success) {
    return (
      <PageLayout titleKey="shifts.closeShift">
        <div className="max-w-2xl mx-auto">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">
              {t("shifts.shiftClosedSuccessfully")}
            </AlertTitle>
            <AlertDescription>
              {t("shifts.redirectingToShifts")}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={navigateToShifts}
            >
              {t("common.backToShifts")}
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show loading state
  if (isShiftLoading) {
    return (
      <PageLayout titleKey="shifts.closeShift">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t("shifts.closeShift")}</CardTitle>
              <CardDescription>{t("common.loading")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Show error state if no active shift
  if (!activeShift) {
    return (
      <PageLayout titleKey="shifts.closeShift">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>
              {error || t("shifts.noActiveShift")}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={navigateToShifts}
            >
              {t("common.backToShifts")}
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      titleKey="shifts.closeShift"
      descriptionKey="shifts.endShiftDescription"
      action={
        <Button 
          variant="outline"
          onClick={navigateToShifts}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.backToShifts")}
        </Button>
      }
    >
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
                    {safeFormatDateTime(activeShift.start_time)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("shifts.duration")}</div>
                  <div className="font-medium">
                    {calculateDuration(activeShift.start_time)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("shifts.openingCash")}</div>
                  <div className="font-medium">
                    {formatCurrency(activeShift.opening_cash)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("shifts.salesTotal")}</div>
                  <div className="font-medium">
                    {formatCurrency(activeShift.sales_total || 0)}
                  </div>
                </div>
              </div>

              <MultiPaymentMethodFormStandardized
                onSubmit={handleEndShift}
                isSubmitting={isSubmitting}
                totalAmount={activeShift.sales_total || 0}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 