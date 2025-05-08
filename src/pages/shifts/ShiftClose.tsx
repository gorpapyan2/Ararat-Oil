import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useShift } from "@/hooks/useShift";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Create a memoized navigation handler
  const navigateToShifts = useCallback(() => {
    // Use replace to prevent back-button issues
    navigate('/finance/shifts', { replace: true });
  }, [navigate]);

  // Initial check for active shift - runs only once
  useEffect(() => {
    let isMounted = true;
    let retryAttempt = 0;
    const maxRetries = 3;
    
    const initialCheck = async () => {
      setIsInitialLoading(true);
      try {
        // Check if we're online first
        if (!navigator.onLine) {
          console.log("No internet connection. Using offline mode for shift closing.");
          // Try to get cached data
          const cachedShiftData = localStorage.getItem(`activeShift_${user?.id}`);
          if (cachedShiftData && isMounted) {
            console.log("Using cached shift data in offline mode");
            // If we have cached data, use it
            setInitialCheckDone(true);
          } else if (isMounted) {
            // If no cached data, show error
            setError("No internet connection. Unable to close shift offline.");
            setInitialCheckDone(true);
          }
          setIsInitialLoading(false);
          return;
        }
        
        console.log("Performing initial check for active shift...");
        await checkActiveShift();
        
        if (isMounted) {
          console.log("Initial check complete, activeShift state:", activeShift ? "Active shift exists" : "No active shift");
          setInitialCheckDone(true);
          
          // Only redirect if both these conditions are true:
          // 1. We've confirmed there's no active shift after the check
          // 2. We're not in a loading state anymore
          // This avoids premature redirect before the shift data is loaded
          if (!activeShift && !isShiftLoading && !isInitialLoading) {
            console.log("No active shift found after initial check, will redirect");
            setTimeout(() => {
              navigate('/finance/shifts', { replace: true });
            }, 500); // Short delay to ensure state has settled
          }
        }
      } catch (error: any) {
        console.error("Error during initial shift check:", error);
        
        // Retry logic
        if (retryAttempt < maxRetries && isMounted) {
          retryAttempt++;
          console.log(`Retrying initial check (${retryAttempt}/${maxRetries})...`);
          setTimeout(initialCheck, 1000 * retryAttempt);
          return;
        }
        
        if (isMounted) {
          setInitialCheckDone(true);
          setError("Network error checking for active shift. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };
    
    initialCheck();
    
    return () => {
      isMounted = false;
    };
  }, [activeShift, isShiftLoading, navigate, checkActiveShift, user?.id]);

  // Periodic check for active shift - runs after initial check is done
  useEffect(() => {
    if (!initialCheckDone) return;
    
    let intervalId: number;
    let redirected = false;

    const checkShift = async () => {
      // Skip if we're in a loading or success state
      if (isShiftLoading || success || isSubmitting) return;
      
      await checkActiveShift();
      
      // Only redirect if we've confirmed there's no active shift and haven't already redirected
      if (!activeShift && !redirected) {
        redirected = true;
        console.log("No active shift found, redirecting to shifts page");
        navigate('/finance/shifts', { replace: true });
      }
    };

    // Set up periodic check
    intervalId = window.setInterval(checkShift, 5000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [initialCheckDone, activeShift, isShiftLoading, checkActiveShift, navigate, success, isSubmitting]);

  // Set up redirection after success
  useEffect(() => {
    let redirectTimer: number;
    
    if (success) {
      console.log("Success state detected, will redirect in 2 seconds");
      redirectTimer = window.setTimeout(() => {
        // Use replace to prevent back-button issues
        navigate('/finance/shifts', { replace: true });
      }, 2000);
    }
    
    return () => {
      if (redirectTimer) {
        window.clearTimeout(redirectTimer);
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
      
      // Add a safety timeout to ensure loading state doesn't get stuck
      const loadingTimeout = setTimeout(() => {
        if (isSubmitting) {
          console.warn("Closing shift operation timed out");
          setIsSubmitting(false);
          setError(t("shifts.operationTimedOut", "The operation timed out. Please check your connection and try again."));
        }
      }, 30000); // 30 seconds timeout
      
      // Calculate total cash amount
      const cashTotal = data.paymentMethods
        .filter(method => method.payment_method === "cash")
        .reduce((sum, method) => sum + (method.amount || 0), 0) || 0;
      
      console.log("Ending shift with payment methods:", data.paymentMethods);
      console.log("Cash total calculated:", cashTotal);
      
      // Wait for the endShift operation to complete
      try {
        const result = await endShift(cashTotal, data.paymentMethods);
        console.log("Shift closed successfully:", result);
        
        // Set success state after successful closure
        setSuccess(true);
        clearTimeout(loadingTimeout);
        
        // Force a redirect after 5 seconds as a fallback if the success effect doesn't trigger
        setTimeout(() => {
          if (document.visibilityState !== 'hidden') {
            console.log("Fallback redirect triggered");
            navigate('/finance/shifts', { replace: true });
          }
        }, 5000);
      } catch (endShiftError: any) {
        console.error("Error from endShift:", endShiftError);
        clearTimeout(loadingTimeout);
        
        if (!navigator.onLine) {
          setError(t("common.noInternetConnection", "No internet connection. Please check your network and try again."));
        } else if (endShiftError.message?.includes("Failed to fetch")) {
          setError(t("common.networkError", "Network error. Please check your connection and try again."));
        } else {
          setError(endShiftError.message || t("shifts.closeShiftError"));
        }
      }
    } catch (error: any) {
      console.error("Error in handleEndShift:", error);
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

  // Show loading state for both initial loading and shift loading
  if (isInitialLoading || isShiftLoading) {
    return (
      <PageLayout titleKey="shifts.closeShift">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t("shifts.closeShift")}</CardTitle>
              <CardDescription>
                {isInitialLoading ? t("shifts.checkingForActiveShift", "Checking for active shift...") : t("common.loading")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isInitialLoading 
                    ? t("shifts.pleaseWaitWhileChecking", "Please wait while we check for your active shift...") 
                    : t("shifts.loadingShiftData", "Loading shift data...")}
                </p>
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

              {/* Safe check for activeShift.sales_total being a valid value */}
              <MultiPaymentMethodFormStandardized
                onSubmit={handleEndShift}
                isSubmitting={isSubmitting}
                totalAmount={activeShift.sales_total || 0}
                key={`payment-form-${activeShift.id}-${activeShift.sales_total || 0}`} // Add key to force re-render when data changes
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 