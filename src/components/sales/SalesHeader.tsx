
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SalesForm } from "./SalesForm";
import { useState } from "react";
import { createSale } from "@/services/sales";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SalesHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function SalesHeader({ selectedDate, onDateChange }: SalesHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      await createSale(data);
      toast({
        title: "Success",
        description: "Sale created successfully",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sale",
        variant: "destructive",
      });
      console.error("Error creating sale:", error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
        <p className="text-muted-foreground">
          View and manage fuel sales
        </p>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>New Sale</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <SalesForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
