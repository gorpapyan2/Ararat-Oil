
import { useState, useCallback } from "react";
import { useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { createFuelTank } from "@/services/supabase";
import { z } from "zod";

// Define the schema for the tank form
export const tankFormSchema = z.object({
  name: z
    .string({ required_error: "Tank name is required" })
    .min(2, "Tank name must be at least 2 characters"),
  fuel_type: z.enum(["petrol", "diesel", "cng"] as const, {
    required_error: "Fuel type is required",
  }),
  capacity: z.coerce
    .number({ required_error: "Capacity is required" })
    .positive("Capacity must be greater than zero"),
  current_level: z.coerce
    .number({ required_error: "Current level is required" })
    .nonnegative("Current level must be a positive number or zero")
    .optional()
    .default(0),
});

export type TankFormData = z.infer<typeof tankFormSchema>;

interface UseTankDialogOptions {
  onSuccess?: () => void;
}

export function useTankDialog({ onSuccess }: UseTankDialogOptions = {}) {
  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingTankData, setPendingTankData] = useState<TankFormData | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Open/close handlers
  const openDialog = useCallback(() => {
    setIsFormOpen(true);
  }, []);
  
  const closeDialog = useCallback(() => {
    setIsFormOpen(false);
  }, []);
  
  // Handle form data submission
  const handleFormSubmit = useCallback((data: TankFormData) => {
    // Validate that current level doesn't exceed capacity
    if (data.current_level && data.current_level > data.capacity) {
      return {
        error: "current_level",
        message: "Current level cannot exceed capacity"
      };
    }
    
    // Set pending data and open confirmation dialog
    setPendingTankData({
      name: data.name,
      fuel_type: data.fuel_type,
      capacity: Number(data.capacity),
      current_level: Number(data.current_level || 0),
    });
    
    setIsConfirmOpen(true);
    return null;
  }, []);
  
  // Handle confirmation dialog confirmation
  const handleConfirm = useCallback(async () => {
    if (!pendingTankData) return;
    
    setIsSubmitting(true);
    
    try {
      // Ensure all required properties are present
      const tankData = {
        name: pendingTankData.name,
        fuel_type: pendingTankData.fuel_type,
        capacity: pendingTankData.capacity,
        current_level: pendingTankData.current_level,
      };
      
      await createFuelTank(tankData);
      
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      
      toast({
        title: "Tank added successfully",
        description: "The new fuel tank has been added.",
      });
      
      setIsFormOpen(false);
      setIsConfirmOpen(false);
      setPendingTankData(null);
      onSuccess?.();
      
    } catch (error: any) {
      toast({
        title: "Error adding tank",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [pendingTankData, queryClient, toast, onSuccess]);
  
  // Handle confirmation dialog cancellation
  const handleCancel = useCallback(() => {
    setIsConfirmOpen(false);
    // Keep form open for editing
  }, []);
  
  return {
    // Dialog state
    isFormOpen,
    setIsFormOpen,
    isConfirmOpen, 
    setIsConfirmOpen,
    isSubmitting,
    pendingTankData,
    
    // Dialog actions
    openDialog,
    closeDialog,
    handleFormSubmit,
    handleConfirm,
    handleCancel,
    
    // Form options
    fuelTypeOptions: [
      { value: "petrol", label: "Petrol" },
      { value: "diesel", label: "Diesel" },
      { value: "cng", label: "CNG" },
    ],
  };
}
