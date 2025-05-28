import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShift } from "@/hooks/useShift";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/layouts/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button, ButtonLink } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Label } from "@/core/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  CalendarClock,
  DollarSign,
  Clock,
  Receipt,
  Users,
} from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/core/components/ui/form";
import { Separator } from "@/core/components/ui/separator";
import { employeesApi, Employee } from "@/core/api";
import { FuelType } from "@/types";
import { MultiSelect } from "@/core/components/ui/multi-select";
import { fuelPricesApi } from "@/core/api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/core/components/ui/accordion";
import { Checkbox } from "@/core/components/ui/checkbox";

// Define form schema with Zod
const openShiftSchema = z.object({
  openingCash: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z
      .number()
      .nonnegative("Opening cash amount cannot be negative")
      .default(100000)
  ),
  employeeIds: z.array(z.string()).default([]),
  updateFuelPrices: z.boolean().default(false),
  fuelPrices: z.object({
    petrol: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().nonnegative("Price cannot be negative")
    ),
    diesel: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().nonnegative("Price cannot be negative")
    ),
    gas: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().nonnegative("Price cannot be negative")
    ),
    kerosene: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().nonnegative("Price cannot be negative")
    ),
    cng: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().nonnegative("Price cannot be negative")
    ),
  }),
});

type OpenShiftFormValues = z.infer<typeof openShiftSchema>;

export default function ShiftOpen() {
  const { t } = useTranslation();
  const { activeShift, beginShift, isLoading } = useShift();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeEmployees, setActiveEmployees] = useState<Employee[]>([]);
  const [currentFuelPrices, setCurrentFuelPrices] = useState<
    Record<FuelType, number>
  >({
    diesel: 0,
    gas: 0,
    petrol_regular: 0,
    petrol_premium: 0,
  });
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<OpenShiftFormValues>({
    resolver: zodResolver(openShiftSchema),
    defaultValues: {
      openingCash: 100000,
      employeeIds: [],
      updateFuelPrices: false,
      fuelPrices: {
        petrol: 0,
        diesel: 0,
        gas: 0,
        kerosene: 0,
        cng: 0,
      },
    },
  });

  // Load active employees
  useEffect(() => {
    const loadActiveEmployees = async () => {
      try {
        const response = await employeesApi.getAll({ status: "active" });
        if (response.error) {
          throw new Error(response.error.message);
        }
        setActiveEmployees(response.data || []);
      } catch (error) {
        console.error("Failed to load active employees:", error);
      }
    };

    loadActiveEmployees();
  }, []);

  // Load current fuel prices
  useEffect(() => {
    const loadFuelPrices = async () => {
      try {
        const response = await fuelPricesApi.getAll();
        if (response.error) {
          throw new Error(response.error.message);
        }
        const prices = response.data || [];

        setCurrentFuelPrices(
          prices.reduce(
            (acc, price) => {
              acc[price.fuel_type as FuelType] = price.price_per_liter;
              return acc;
            },
            {} as Record<FuelType, number>
          )
        );

        // Update form values with current fuel prices
        form.setValue(
          "fuelPrices",
          prices.reduce(
            (acc, price) => {
              acc[price.fuel_type as FuelType] = price.price_per_liter;
              return acc;
            },
            {} as Record<FuelType, number>
          )
        );
      } catch (error) {
        console.error("Failed to load fuel prices:", error);
      }
    };

    loadFuelPrices();
  }, [form]);

  // Redirect to shifts page if already has an active shift (moved to useEffect)
  useEffect(() => {
    console.log("ShiftOpen: Checking for active shift, state:", {
      activeShift: activeShift ? "exists" : "not found",
      success,
      isLoading,
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

      // If updating fuel prices is checked, update them before starting shift
      if (data.updateFuelPrices) {
        try {
          const updates: Record<string, number> = data.fuelPrices as Record<string, number>;

          for (const [type, price] of Object.entries(updates)) {
            await fuelPricesApi.update(type, {
              price_per_liter: price,
              effective_date: new Date().toISOString(),
            });
          }
        } catch (priceError: unknown) {
          console.error("Error updating fuel prices:", priceError);
          // Continue with shift creation even if fuel price update fails
        }
      }

      // Start the shift with selected employees
      await beginShift(data.openingCash, data.employeeIds);
      setSuccess(true);

      // Redirect after successful shift start
      setTimeout(() => {
        navigate("/finance/shifts");
      }, 2000);
    } catch (error: unknown) {
      console.error("Error starting shift:", error);

      // Set a more specific error message based on the error
      if (error instanceof Error && error.message?.includes("active shift")) {
        // This is our custom error from the useShift hook
        setError(error.message);
      } else if (!navigator.onLine) {
        setError(
          "Cannot start shift while offline. Please check your internet connection."
        );
      } else {
        setError(error instanceof Error ? error.message : "Failed to start shift. Please try again.");
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
      <div className="max-w-3xl mx-auto">
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
                {t(
                  "shifts.shiftOverviewDescription",
                  "What opening a shift means for your business"
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {t("shifts.trackingTime")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(
                      "shifts.trackingTimeDescription",
                      "Records when your business operations begin"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {t("shifts.trackingCash")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(
                      "shifts.trackingCashDescription",
                      "Records your opening cash amount for reconciliation"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {t("shifts.salesTracking")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(
                      "shifts.salesTrackingDescription",
                      "All sales during this period will be linked to this shift"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {t("employees.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(
                      "Select active employees that will work during this shift"
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="text-sm text-muted-foreground">
                {t(
                  "shifts.onlyOneShiftNote",
                  "Note: Only one shift can be active at a time in the system."
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted">
            <CardHeader>
              <CardTitle>{t("shifts.openShift")}</CardTitle>
              <CardDescription>
                {t("shifts.startShiftDescription") ||
                  "Start a new shift with an opening cash amount."}
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <Tabs defaultValue="basics" className="w-full">
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="basics" className="flex-1">
                        {t("shifts.basicInfo")}
                      </TabsTrigger>
                      <TabsTrigger value="fuel" className="flex-1">
                        {t("shifts.fuelPrices")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basics" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="openingCash"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("shifts.openingCash")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  ֏
                                </span>
                                <Input
                                  type="number"
                                  placeholder="Enter opening cash amount"
                                  className="pl-8"
                                  {...field}
                                  min={0}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? 0
                                        : Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </FormControl>
                            <div className="text-xs text-muted-foreground mt-1">
                              {t(
                                "shifts.openingCashHint",
                                "Enter the amount of cash you have at the start of this shift"
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employeeIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("shifts.employeesForShift")}
                            </FormLabel>
                            <FormControl>
                              <MultiSelect
                                placeholder="Select employees..."
                                options={activeEmployees.map((emp) => ({
                                  value: emp.id,
                                  label: emp.name,
                                }))}
                                value={field.value.map((id) => ({
                                  value: id,
                                  label:
                                    activeEmployees.find((emp) => emp.id === id)
                                      ?.name || id,
                                }))}
                                onChange={(selected) =>
                                  field.onChange(
                                    selected.map((item) => item.value)
                                  )
                                }
                              />
                            </FormControl>
                            <div className="text-xs text-muted-foreground mt-1">
                              {t("shifts.selectEmployeesHint")}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="fuel">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="updateFuelPrices"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium leading-none">
                                  {t("shifts.updateTodayFuelPrices")}
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  {t("shifts.setDefaultPrices")}
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />

                        {form.watch("updateFuelPrices") && (
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue="fuel-prices"
                            className="w-full"
                          >
                            <AccordionItem
                              value="fuel-prices"
                              className="border rounded-md"
                            >
                              <AccordionTrigger className="px-4">
                                {t("shifts.setTodayFuelPrices")}
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="fuelPrices.petrol"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          {t("common.petrol")}
                                        </FormLabel>
                                        <FormControl>
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                              ֏
                                            </span>
                                            <Input
                                              type="number"
                                              className="pl-8"
                                              {...field}
                                              min={0}
                                              step={1}
                                              onChange={(e) =>
                                                field.onChange(
                                                  e.target.value === ""
                                                    ? 0
                                                    : Number(e.target.value)
                                                )
                                              }
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="fuelPrices.diesel"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          {t("common.diesel")}
                                        </FormLabel>
                                        <FormControl>
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                              ֏
                                            </span>
                                            <Input
                                              type="number"
                                              className="pl-8"
                                              {...field}
                                              min={0}
                                              step={1}
                                              onChange={(e) =>
                                                field.onChange(
                                                  e.target.value === ""
                                                    ? 0
                                                    : Number(e.target.value)
                                                )
                                              }
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="fuelPrices.gas"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t("common.gas")}</FormLabel>
                                        <FormControl>
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                              ֏
                                            </span>
                                            <Input
                                              type="number"
                                              className="pl-8"
                                              {...field}
                                              min={0}
                                              step={1}
                                              onChange={(e) =>
                                                field.onChange(
                                                  e.target.value === ""
                                                    ? 0
                                                    : Number(e.target.value)
                                                )
                                              }
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="fuelPrices.cng"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t("common.cng")}</FormLabel>
                                        <FormControl>
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                              ֏
                                            </span>
                                            <Input
                                              type="number"
                                              className="pl-8"
                                              {...field}
                                              min={0}
                                              step={1}
                                              onChange={(e) =>
                                                field.onChange(
                                                  e.target.value === ""
                                                    ? 0
                                                    : Number(e.target.value)
                                                )
                                              }
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="fuelPrices.kerosene"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          {t("common.kerosene")}
                                        </FormLabel>
                                        <FormControl>
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                              ֏
                                            </span>
                                            <Input
                                              type="number"
                                              className="pl-8"
                                              {...field}
                                              min={0}
                                              step={1}
                                              onChange={(e) =>
                                                field.onChange(
                                                  e.target.value === ""
                                                    ? 0
                                                    : Number(e.target.value)
                                                )
                                              }
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>

                <CardFooter className="flex justify-between border-t p-4">
                  <ButtonLink href="/finance/shifts" variant="outline">
                    {t("common.cancel")}
                  </ButtonLink>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? t("common.processing")
                      : t("shifts.startShift")}
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
