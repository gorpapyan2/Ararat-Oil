import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShift } from "@/hooks/useShift";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/layouts/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, CheckCircle2, CalendarClock, DollarSign, Clock, Receipt } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

// Define form schema with Zod
const openShiftSchema = z.object({
  openingCash: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number()
      .nonnegative("Opening cash amount cannot be negative")
      .default(0)
  ),
});

type OpenShiftFormValues = z.infer<typeof openShiftSchema>;

export default function ShiftOpen() {
  const { t } = useTranslation();
  const { activeShift, beginShift, isLoading } = useShift();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<OpenShiftFormValues>({
    resolver: zodResolver(openShiftSchema),
    defaultValues: {
      openingCash: 0,
    },
  });

  // Redirect to shifts page if already has an active shift (moved to useEffect)
  useEffect(() => {
    console.log("ShiftOpen: Checking for active shift, state:", { 
      activeShift: activeShift ? "exists" : "not found", 
      success, 
      isLoading 
    });
    
    // Only redirect if we have an active shift, are not in success state, and not in loading state
    if (activeShift && !success && !isLoading) {
      console.log("ShiftOpen: Active shift found, redirecting to shifts page");
      navigate("/finance/shifts", { replace: true });
    }
  }, [activeShift, success, navigate, isLoading]);

  // Handle form submission
  const onSubmit = async (data: OpenShiftFormValues) => {
    try {
      setError(null);
      await beginShift(data.openingCash);
      setSuccess(true);
      
      // Redirect after successful shift start
      setTimeout(() => {
        navigate("/finance/shifts");
      }, 2000);
    } catch (error: any) {
      console.error("Error starting shift:", error);
      
      // Set a more specific error message based on the error
      if (error.message?.includes("active shift")) {
        // This is our custom error from the useShift hook
        setError(error.message);
      } else if (!navigator.onLine) {
        setError("Cannot start shift while offline. Please check your internet connection.");
      } else {
        setError(error.message || "Failed to start shift. Please try again.");
      }
    }
  };

  // If the operation was successful, show success message
  if (success) {
    return (
      <PageLayout titleKey="shifts.openShift">
        <div className="max-w-2xl mx-auto">
          <Alert className="bg-blue-50 border-blue-200">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">
              {t("shifts.shiftOpenedSuccessfully")}
            </AlertTitle>
            <AlertDescription>
              {t("shifts.redirectingToShifts")}
            </AlertDescription>
          </Alert>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      titleKey="shifts.openShift"
      descriptionKey="shifts.startShiftDescription"
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
      <div className="max-w-2xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-muted h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-primary" />
                {t("shifts.shiftOverview")}
              </CardTitle>
              <CardDescription>
                {t("shifts.shiftOverviewDescription", "What opening a shift means for your business")}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{t("shifts.trackingTime")}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("shifts.trackingTimeDescription", "Records when your business operations begin")}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{t("shifts.trackingCash")}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("shifts.trackingCashDescription", "Records your opening cash amount for reconciliation")}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{t("shifts.salesTracking")}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("shifts.salesTrackingDescription", "All sales during this period will be linked to this shift")}
                  </div>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="text-sm text-muted-foreground">
                {t("shifts.onlyOneShiftNote", "Note: Only one shift can be active at a time in the system.")}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-muted">
            <CardHeader>
              <CardTitle>{t("shifts.openShift")}</CardTitle>
              <CardDescription>
                {t("shifts.startShiftDescription") || "Start a new shift with an opening cash amount."}
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="openingCash"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("shifts.openingCash")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">֏</span>
                                <Input
                                  type="number"
                                  placeholder="Enter opening cash amount"
                                  className="pl-8"
                                  {...field}
                                  min={0}
                                  onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <div className="text-xs text-muted-foreground mt-1">
                              {t("shifts.openingCashHint", "Enter the amount of cash you have at the start of this shift")}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t p-4">
                  <ButtonLink
                    href="/finance/shifts"
                    variant="outline"
                  >
                    {t("common.cancel")}
                  </ButtonLink>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? t("common.processing") : t("shifts.startShift")}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
} 