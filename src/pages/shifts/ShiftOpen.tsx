import { useState } from "react";
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
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

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

  // Redirect to shifts page if already has an active shift
  if (activeShift && !success) {
    navigate("/finance/shifts");
    return null;
  }

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
    } catch (error) {
      setError("Failed to start shift. Please try again.");
    }
  };

  // If the operation was successful, show success message
  if (success) {
    return (
      <PageLayout titleKey="shifts.openShift">
        <div className="max-w-2xl mx-auto">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">
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
        
        <Card>
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
                  <div className="space-y-1">
                    <FormField
                      control={form.control}
                      name="openingCash"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("shifts.openingCash")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter opening cash amount"
                              {...field}
                              min={0}
                              onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                          </FormControl>
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
    </PageLayout>
  );
} 