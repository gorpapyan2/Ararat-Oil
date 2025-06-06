import { Button } from "@/core/components/ui/button";
import { SalesFormStandardized } from './SalesFormStandardized';
import { SalesFormStandardized, SalesFormData } from "./SalesFormStandardized";
import { useState, useRef } from "react";
import { salesApi } from "@/core/api";
import { useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { CreateButton } from "@/core/components/ui/create-button";
import { Sale } from "@/core/api/types";

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
        filling_system_id: data.filling_system_id,
        fuel_type_id: "1", // This should come from the filling system
        quantity: data.quantity,
        price_per_liter: data.unit_price,
        total_price: data.total_sales || 0,
        payment_method: "cash", // This should come from the form
        employee_id: "1", // This should come from the current user
        shift_id: data.shift_id,
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