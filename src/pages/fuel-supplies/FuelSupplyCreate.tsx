import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconArrowLeft } from "@tabler/icons-react";

// Import components
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createFuelSupply } from "@/services/fuel-supplies";
import { useToast } from "@/hooks";
import { format } from "date-fns";

// Import our standalone fuel supplies form
import { FuelSuppliesForm } from "./FuelSuppliesForm";

export default function FuelSupplyCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  // Add create fuel supply mutation
  const createFuelSupplyMutation = useMutation({
    mutationFn: createFuelSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      
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
    },
  });

  const handleSubmit = (data: any) => {
    setPendingData(data);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingData) {
      createFuelSupplyMutation.mutate(pendingData);
      setIsConfirmOpen(false);
    }
  };

  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    navigate("/fuel-management?tab=fuel-supplies");
  };

  // Default values with today's date
  const defaultValues = {
    delivery_date: format(new Date(), "yyyy-MM-dd"),
  };

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

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <FuelSuppliesForm 
            onSubmit={handleSubmit}
            isSubmitting={createFuelSupplyMutation.isPending}
            defaultValues={defaultValues}
            onConfirm={handleConfirm}
            onConfirmCancel={handleConfirmCancel}
            isConfirmOpen={isConfirmOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
} 