
import { Button } from "@/components/ui/button";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { DialogContent } from "@/components/ui/styled/dialog";
import { SalesFormStandardized } from "./SalesFormStandardized";
import { useState, useRef } from "react";
import { createSale } from "@/services/sales";
import { useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";
import { CreateButton } from "@/components/ui/create-button";

interface NewSaleButtonProps {
  className?: string;
}

export function NewSaleButton({ className }: NewSaleButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (data: any): Promise<boolean> => {
    try {
      await createSale(data);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      queryClient.invalidateQueries({ queryKey: ["latest-sale"] });

      toast({
        title: "Success",
        description: "Sale created successfully and tank level updated",
      });

      setIsOpen(false);
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create sale",
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
        triggerRef={triggerRef}
        maxWidth="sm:max-w-lg"
      >
        <DialogContent>
          <SalesFormStandardized onSubmit={handleSubmit} />
        </DialogContent>
      </StandardDialog>
    </>
  );
}
