
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SalesForm } from "./SalesForm";
import { useState } from "react";
import { createSale } from "@/services/sales";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";

interface NewSaleButtonProps {
  className?: string;
}

export function NewSaleButton({ className }: NewSaleButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      await createSale(data);
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-tanks'] });
      queryClient.invalidateQueries({ queryKey: ['latest-sale'] });

      toast({
        title: "Success",
        description: "Sale created successfully and tank level updated",
      });

      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create sale",
        variant: "destructive",
      });
      console.error("Error creating sale:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`h-9 px-4 rounded-md shadow-sm flex items-center gap-1.5 transition-all hover:shadow ${className || ""}`}>
          <Plus className="h-4 w-4" />
          <span>Add Sale</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <SalesForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
