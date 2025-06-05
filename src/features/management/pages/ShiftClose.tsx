import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useShift } from "../hooks/useShift";
import { useAuth } from "@/features/auth";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/layouts/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import {
  MultiPaymentMethodFormStandardized,
  MultiPaymentFormData,
} from "@/shared/components/shared/MultiPaymentMethodFormStandardized";
import {
  formatCurrency,
  formatDateTime,
  calculateDuration,
} from "@/shared/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ClockIcon,
  DollarSign,
  Receipt,
  Calendar,
} from "lucide-react";
import { Separator } from "@/core/components/ui/separator";

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
  const {
    activeShift,
    endShift,
    isLoading: isShiftLoading,
    checkActiveShift,
    updateShiftSalesTotal,
  } = useShift();
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
    navigate("/finance/shifts", { replace: true });
  }, [navigate]);

  // Run the initial check once when the component mounts
  useEffect(() => {
    if (user) {
      console.log(
        "Running initial active shift check from ShiftClose component"
      );
      checkActiveShift(user.id);
    }
  }, [user, checkActiveShift]);

  // Initial check for active shift - runs only once
  useEffect(() => {
    let isMounted = true;
    let retryAttempt = 0;
    const maxRetries = 3;

    // Set a maximum loading time to prevent endless loading
    const loadingTimeout = setTimeout(() => {
      if (isMounted && isInitialLoading) {
        console.warn("Shift loading timed out after 15 seconds");
        setIsInitialLoading(false);
        setInitialCheckDone(true);
        setError(
          "Loading timed out. Please try again or check your connection."
        );
      }
    }, 15000); // 15 second maximum loading time

    const initialCheck = async () => {
      setIsInitialLoading(true);
      try {
        // Check if we're online first
        if (!navigator.onLine) {
          console.log(
            "No internet connection. Using offline mode for shift closing."
          );
          // Try to get cached data
          const cachedShiftData = localStorage.getItem(
            `activeShift_${user?.id}`
          );
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
        const currentShift = await checkActiveShift(user?.id, true);

        if (isMounted) {
          console.log(
            "Initial check complete, activeShift state:",
            currentShift ? "Active shift exists" : "No active shift"
          );
          setInitialCheckDone(true);
          setIsInitialLoading(false);

          // Wait longer (3 seconds) before deciding to redirect
          // This gives more time for the activeShift state to be populated
          setTimeout(() => {
            if (!isMounted) return;

            console.log("Delayed check for active shift:", {
              activeShift: activeShift ? "exists" : "null",
              currentShift: currentShift ? "exists" : "null",
              isLoading: isShiftLoading,
            });

            // Only redirect if there's no active shift found in direct check AND in state
            if (!currentShift && !activeShift && !isShiftLoading) {
              console.log(
                "No active shift found after initial check, will redirect"
              );
              navigate("/finance/shifts", { replace: true });
            }
          }, 3000);
        }
      } catch (error: unknown) {
        console.error("Error during initial shift check:", error);

        // Retry logic
        if (retryAttempt < maxRetries && isMounted) {
          retryAttempt++;
          console.log(
            `Retrying initial check (${retryAttempt}/${maxRetries})...`
          );
          setTimeout(initialCheck, 1000 * retryAttempt);
          return;
        }

        if (isMounted) {
          setInitialCheckDone(true);
          setIsInitialLoading(false);
          setError(
            "Network error checking for active shift. Please try again."
          );
        }
      }
    };

    initialCheck();

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
    };
  }, []); // This only runs once on mount // eslint-disable-line react-hooks/exhaustive-deps

  // Periodic check for active shift - runs after initial check is done
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!initialCheckDone) return;

    let redirected = false;

    const checkShift = async () => {
      // Skip if we're in a loading or success state
      if (isShiftLoading || success || isSubmitting) return;

      const currentShift = await checkActiveShift(user?.id, false);

      // Only redirect if we've confirmed there's no active shift and haven't already redirected
      // AND we're not currently submitting a form
      if (!currentShift && !activeShift && !redirected && !isSubmitting) {
        redirected = true;
        console.log("No active shift found, redirecting to shifts page");
        navigate("/finance/shifts", { replace: true });
      }
    };

    // Set up periodic check - make it less frequent (20 seconds)
    const intervalId = window.setInterval(checkShift, 20000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    initialCheckDone,
    activeShift,
    isShiftLoading,
    checkActiveShift,
    navigate,
    success,
    isSubmitting,
    user?.id,
  ]);

  // Set up redirection after success
  useEffect(() => {
    let redirectTimer: number;

    if (success) {
      console.log("Success state detected, will redirect in 2 seconds");
      redirectTimer = window.setTimeout(() => {
        // Use replace to prevent back-button issues
        navigate("/finance/shifts", { replace: true });
      }, 2000);
    }

    return () => {
      if (redirectTimer) {
        window.clearTimeout(redirectTimer);
      }
    };
  }, [success, navigate]);

  // Periodic refresh of sales totals - only runs once on mount  
  useEffect(() => {
    if (activeShift) {
      // Set up periodic refresh of sales total
      const intervalId = setInterval(() => {
        updateShiftSalesTotal(activeShift.id);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(intervalId); // Clean up interval on unmount or shift change
    }
  }, [activeShift, updateShiftSalesTotal]);

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
          setError(
            t(
              "shifts.operationTimedOut",
              "The operation timed out. Please check your connection and try again."
            )
          );
        }
      }, 30000); // 30 seconds timeout

      // Calculate total cash amount
      const cashTotal =
        data.paymentMethods
          .filter((method) => method.payment_method === "cash")
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
          if (document.visibilityState !== "hidden") {
            console.log("Fallback redirect triggered");
            navigate("/finance/shifts", { replace: true });
          }
        }, 5000);
      } catch (endShiftError: unknown) {
        console.error("Error from endShift:", endShiftError);
        clearTimeout(loadingTimeout);

        if (!navigator.onLine) {
          setError(
            t(
              "common.noInternetConnection",
              "No internet connection. Please check your network and try again."
            )
          );
        } else if (endShiftError instanceof Error && endShiftError.message?.includes("Failed to fetch")) {
          setError(
            t(
              "common.networkError",
              "Network error. Please check your connection and try again."
            )
          );
        } else {
          setError(endShiftError instanceof Error ? endShiftError.message : t("shifts.closeShiftError"));
        }
      }
    } catch (error: unknown) {
      console.error("Error in handleEndShift:", error);
      setError(error instanceof Error ? error.message : t("shifts.closeShiftError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success state
  if (success) {
    return (
      <PageLayout titleKey="shifts.closeShift">
        <div className="max-w-2xl mx-auto">
          <Alert className="bg-blue-50 border-blue-200">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">
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
          <Card className="border border-muted">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
                {t("shifts.closeShift")}
              </CardTitle>
              <CardDescription>
                {isInitialLoading
                  ? t(
                      "shifts.checkingForActiveShift",
                      "Checking for active shift..."
                    )
                  : t("common.loading")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {isInitialLoading
                    ? t(
                        "shifts.pleaseWaitWhileChecking",
                        "Please wait while we check for your active shift..."
                      )
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

  // Special check to see if the active shift belongs to another user
  // In this case, we still allow closing the shift, but show a warning
  const isCurrentUserShift = activeShift.employee_id === user?.id;
  const showOtherUserWarning = !isCurrentUserShift && user?.id;

  return (
    <PageLayout
      titleKey="shifts.closeShift"
      descriptionKey="shifts.endShiftDescription"
      action={
        <Button variant="outline" onClick={navigateToShifts}>
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

        {showOtherUserWarning && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">
              {t(
                "shifts.otherEmployeeShift",
                "This shift belongs to another employee"
              )}
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              {t(
                "shifts.canStillClose",
                "You can still close this shift as an administrator."
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 border border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
              {t("shifts.shiftSummary")}
            </CardTitle>
            <CardDescription>
              {t("shifts.activeShiftDescription")}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {t("shifts.startedAt")}
                  </div>
                  <div className="text-base">
                    {safeFormatDateTime(activeShift.start_time)}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {t("shifts.duration")}
                  </div>
                  <div className="text-base">
                    {calculateDuration(activeShift.start_time)}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {t("shifts.openingCash")}
                  </div>
                  <div className="text-base">
                    {formatCurrency(activeShift.opening_cash)}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {t("shifts.salesTotal")}
                  </div>
                  <div className="text-base font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(activeShift.sales_total || 0)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-muted">
          <CardHeader>
            <CardTitle>{t("shifts.closeShift")}</CardTitle>
            <CardDescription>{t("shifts.endShiftDescription")}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div className="bg-accent/30 border border-accent rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">
                  {t("shifts.confirmClosure")}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t(
                    "shifts.closureWarning",
                    "Please record how the money was received during this shift. The system will calculate the expected values based on sales."
                  )}
                </p>

                <Separator className="my-4" />

                {/* Safe check for activeShift.sales_total being a valid value */}
                <MultiPaymentMethodFormStandardized
                  onSubmit={handleEndShift}
                  isSubmitting={isSubmitting}
                  totalAmount={activeShift.sales_total || 0}
                  key={`payment-form-${activeShift.id}-${activeShift.sales_total || 0}`} // Add key to force re-render when data changes
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
