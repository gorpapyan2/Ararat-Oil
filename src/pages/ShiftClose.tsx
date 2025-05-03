import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShift } from "@/hooks/useShift";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/layouts/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { MultiPaymentMethodFormStandardized, MultiPaymentFormData } from "@/components/shared/MultiPaymentMethodFormStandardized";
import { formatCurrency, formatDateTime, calculateDuration } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ShiftClose() {
  const { t } = useTranslation();
  const { activeShift, endShift, isLoading } = useShift();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Debug logs
  useEffect(() => {
    console.log("ShiftClose component mounted");
    console.log("Active shift:", activeShift);
  }, []);

  // Only redirect if not loading and no active shift
  useEffect(() => {
    // Disable redirect for now to prevent loops
    /*
    if (!activeShift && !success && !isLoading) {
      console.log("No active shift, redirecting to shifts page");
      navigate("/shifts");
    }
    */
  }, [activeShift, navigate, success, isLoading]);

  const handleEndShift = async (data: MultiPaymentFormData) => {
    try {
      setError(null);
      
      // Calculate total cash amount by summing all cash payment methods
      const cashTotal = data.paymentMethods
        .filter(method => method.payment_method === "cash")
        .reduce((sum, method) => sum + method.amount, 0);
        
      await endShift(cashTotal, data.paymentMethods);
      setSuccess(true);
      
      // Use window.location for redirection instead of navigate
      setTimeout(() => {
        window.location.href = "/shifts";
      }, 3000);
    } catch (error) {
      console.error("Error ending shift with multiple payments:", error);
      setError("Failed to close shift. Please try again.");
    }
  };

  // If the operation was successful, show success message
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
        </div>
      </PageLayout>
    );
  }

  // Show a simplified loading state if no active shift yet
  if (!activeShift) {
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
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonLink 
                href="/shifts" 
                variant="outline"
                startIcon={<ArrowLeft className="h-4 w-4" />}
              >
                {t("common.backToShifts")}
              </ButtonLink>
            </CardFooter>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      titleKey="shifts.closeShift"
      descriptionKey="shifts.endShiftDescription"
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
            {activeShift && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-md">
                  <div>
                    <div className="text-sm text-muted-foreground">{t("shifts.startedAt")}</div>
                    <div className="font-medium">
                      {formatDateTime(activeShift.started_at)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t("shifts.duration")}</div>
                    <div className="font-medium">
                      {calculateDuration(activeShift.started_at)}
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
                  isSubmitting={isLoading}
                  totalAmount={activeShift.sales_total || 0}
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-4">
            <ButtonLink
              href="/shifts"
              variant="outline"
              startIcon={<ArrowLeft className="h-4 w-4" />}
            >
              {t("common.cancel")}
            </ButtonLink>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
} 