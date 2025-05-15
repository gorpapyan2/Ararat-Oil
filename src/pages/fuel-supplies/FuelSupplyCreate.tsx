import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconArrowLeft } from "@tabler/icons-react";
import { Home, Fuel, Truck, Plus, AlertCircle } from "lucide-react";

// Import components
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createFuelSupply, API_ERROR_TYPE, type FuelSupplyCreate } from "@/core/api";
import { useToast } from "@/hooks";
import { format } from "date-fns";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { useShift } from "@/hooks/useShift";

// Import our standalone fuel supplies form
import { FuelSuppliesForm } from "./FuelSuppliesForm";

// Types
import { FuelSupply } from "@/features/supplies/types";

export default function FuelSupplyCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<FuelSupply> | null>(null);
  const { activeShift } = useShift();

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
    { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
    { name: t("common.fuelSupplies"), href: "/fuel-management/fuel-supplies", icon: <Truck className="h-4 w-4" /> },
    { 
      name: t("fuelSupplies.newSupply", "Add Fuel Supply"), 
      href: "/fuel-management/fuel-supplies/create", 
      isCurrent: true,
      icon: <Plus className="h-4 w-4" /> 
    }
  ], [t]);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("fuelSupplies.newSupply", "Add Fuel Supply")
  });

  // Add create fuel supply mutation with proper error handling
  const createFuelSupplyMutation = useMutation({
    mutationFn: async (data: FuelSupply) => {
      // Extract the fields required by the API
      const fuelSupplyData: FuelSupplyCreate = {
        supplier_id: data.supplier_id,
        fuel_type_id: data.fuel_type_id,
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_price: data.total_price,
        delivery_date: data.delivery_date,
        invoice_number: data.invoice_number,
        notes: data.notes
      };
      
      const response = await createFuelSupply(fuelSupplyData);
      
      if (response.error) {
        // Enhanced error handling with typed errors
        switch(response.error.type) {
          case API_ERROR_TYPE.VALIDATION:
            throw new Error(response.error.message || t("fuelSupplies.validationError", "Invalid input data"));
          case API_ERROR_TYPE.AUTH:
            throw new Error(t("common.authError", "Authentication error. Please log in again."));
          case API_ERROR_TYPE.NETWORK:
            throw new Error(t("common.networkError", "Network error. Please check your connection."));
          default:
            throw new Error(response.error.message || t("fuelSupplies.createError", "Failed to create fuel supply record"));
        }
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      
      // Show success message
      toast({
        title: t("common.success"),
        description: t("fuelSupplies.createSuccess", "Fuel supply record created successfully and tank level updated"),
      });
      
      // Navigate back to the fuel management page
      navigate("/fuel-management?tab=fuel-supplies");
    },
    onError: (error: any) => {
      console.error("Create error:", error);
      toast({
        title: t("common.error"),
        description: error.message || t("fuelSupplies.createError", "Failed to create fuel supply record"),
        variant: "destructive",
      });
      setIsConfirmOpen(false);
    },
  });

  const handleSubmit = (data: Omit<FuelSupply, "id" | "created_at">) => {
    if (!activeShift?.id) {
      toast({
        title: t("common.error"),
        description: t("fuelSupplies.noActiveShift", "No active shift found. Please open a shift first."),
        variant: "destructive",
      });
      return;
    }
    // Ensure all required fields are present
    setPendingData({ ...data, shift_id: activeShift.id } as Omit<FuelSupply, "id" | "created_at">);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingData && activeShift?.id) {
      createFuelSupplyMutation.mutate(pendingData as unknown as FuelSupply);
    }
  };

  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
    setPendingData(null);
  };

  const handleCancel = () => {
    navigate("/fuel-management?tab=fuel-supplies");
  };

  // Default values with today's date
  const defaultValues = useMemo(() => ({
    delivery_date: format(new Date(), "yyyy-MM-dd"),
  }), []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={t("fuelSupplies.newSupply", "Add Fuel Supply")}
        description={t("fuelSupplies.createNewSupply", "Fill in the details to add a new fuel supply record.")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <IconArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Button>
          </div>
        }
      />

      {createFuelSupplyMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {createFuelSupplyMutation.error instanceof Error 
              ? createFuelSupplyMutation.error.message 
              : t("fuelSupplies.createError", "Failed to create fuel supply record")}
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <FuelSuppliesForm 
            onSubmit={handleSubmit as any}
            isSubmitting={createFuelSupplyMutation.isPending}
            defaultValues={{ ...defaultValues, shift_id: activeShift?.id || "" }}
            onConfirm={handleConfirm}
            onConfirmCancel={handleConfirmCancel}
            isConfirmOpen={isConfirmOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
} 