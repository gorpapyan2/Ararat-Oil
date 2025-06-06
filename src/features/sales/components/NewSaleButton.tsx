import { Button } from "@/core/components/ui/button";
import { StandardDialog } from "@/shared/components/common/dialog/StandardDialog";
import { SalesFormData } from "../types";
import { useState, useRef } from "react";
import { salesApi } from "@/core/api";
import { useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { CreateButton } from "@/core/components/ui/create-button";
import { Sale } from "@/core/api/types";
import { SalesFormStandardized } from "@/features/sales/components/SalesFormStandardized";

interface NewSaleButtonProps {
  className?: string;
}

export function NewSaleButton({ className }: NewSaleButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (data: SalesFormData): Promise<boolean> => {
    try {
      // Map form data to API format
      const saleData: Omit<Sale, "id" | "created_at" | "updated_at"> = {
        filling_system_id: data.fillingSystemId || "",
        fuel_type: data.fuelType || "regular",
        liters: data.quantityLiters,
        price_per_unit: data.unitPrice,
        total_sales: data.amount || 0,
        date: data.saleDate instanceof Date 
          ? data.saleDate.toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
      };

      await salesApi.createSale(saleData);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      queryClient.invalidateQueries({ queryKey: ["latest-sale"] });

      toast({
        title: "Success",
        description: "Sale created successfully and tank level updated",
      });

      setIsOpen(false);
      return true;
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sale",
        variant: "destructive",
      });
      console.error("Error creating sale:", error);
      return false;
    }
  };

  return (
    <>
      <CreateButton
        ref={triggerRef}
        label="Add Sale"
        className={className}
        onClick={() => setIsOpen(true)}
      />
      <StandardDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Add New Sale"
      >
        <SalesFormStandardized onSubmit={handleSubmit} />
      </StandardDialog>
    </>
  );
}
