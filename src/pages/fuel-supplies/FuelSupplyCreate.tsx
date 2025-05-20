import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconArrowLeft } from "@tabler/icons-react";
import { Home, Fuel, Truck, Plus, AlertCircle } from "lucide-react";

// Import components
import { PageHeader } from '@/core/components/ui/page-header';
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { useToast } from "@/hooks";
import { format } from "date-fns";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { useShift } from "@/hooks/useShift";

// Import features
import { 
  useFuelSupplies, 
  FuelSuppliesFormStandardized 
} from "@/features/fuel-supplies";
import type { FuelSupply, CreateFuelSupplyRequest } from "@/features/fuel-supplies";

export default function FuelSupplyCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<CreateFuelSupplyRequest | null>(null);
  const { activeShift } = useShift();
  
  // Use the feature hook
  const { createSupply } = useFuelSupplies();

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

  const handleSubmit = (data: Omit<FuelSupply, "id" | "created_at">) => {
    if (!activeShift?.id) {
      toast({
        title: t("common.error"),
        description: t("fuelSupplies.noActiveShift", "No active shift found. Please open a shift first."),
        variant: "destructive",
      });
      return;
    }
    
    // Prepare data with shift ID
    setPendingData({ 
      ...data, 
      shift_id: activeShift.id 
    } as CreateFuelSupplyRequest);
    
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingData && activeShift?.id) {
      createSupply.mutate(pendingData, {
        onSuccess: () => {
          toast({
            title: t("common.success"),
            description: t("fuelSupplies.createSuccess", "Fuel supply record created successfully and tank level updated"),
          });
          
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
        }
      });
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

      {createSupply.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {createSupply.error instanceof Error 
              ? createSupply.error.message 
              : t("fuelSupplies.createError", "Failed to create fuel supply record")}
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <FuelSuppliesFormStandardized 
            onSubmit={handleSubmit}
            isSubmitting={createSupply.isPending}
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