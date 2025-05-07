import { useState, useEffect } from "react";
import { Shift, ShiftPaymentMethod } from "@/types";
import { startShift, closeShift } from "@/services/shifts";
import { getShiftPaymentMethods } from "@/services/shiftPaymentMethods";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks";
import { fetchActiveShift } from "@/utils/api-helpers";
import { supabase } from "@/services/supabase";
import { PaymentMethodItem } from "@/components/shared/MultiPaymentMethodFormStandardized";

export function useShift() {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [shiftPaymentMethods, setShiftPaymentMethods] = useState<ShiftPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check for active shift on mount
  useEffect(() => {
    if (user) {
      checkActiveShift();
    }
  }, [user]);

  // Fetch payment methods when shift changes
  useEffect(() => {
    if (activeShift) {
      fetchShiftPaymentMethods(activeShift.id);
      
      // Set up periodic refresh of sales total if there's an active shift
      const intervalId = setInterval(() => {
        updateShiftSalesTotal(activeShift.id);
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(intervalId); // Clean up interval on unmount or shift change
    } else {
      setShiftPaymentMethods([]);
    }
  }, [activeShift]);

  const checkActiveShift = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const shift = await fetchActiveShift(user.id);
      if (shift) {
        setActiveShift(shift as Shift);
        // If we have an active shift, fetch the current sales total
        await updateShiftSalesTotal((shift as Shift).id);
      } else {
        // Only clear the state if we're not in the process of closing a shift
        if (!success) {
          setActiveShift(null);
          setShiftPaymentMethods([]);
        }
      }
    } catch (error) {
      console.error("Error checking active shift", error);
      // Only clear the state if we're not in the process of closing a shift
      if (!success) {
        setActiveShift(null);
        setShiftPaymentMethods([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShiftPaymentMethods = async (shiftId: string) => {
    try {
      const methods = await getShiftPaymentMethods(shiftId);
      setShiftPaymentMethods(methods);
    } catch (error) {
      console.error("Error fetching shift payment methods", error);
    }
  };

  const updateShiftSalesTotal = async (shiftId: string) => {
    try {
      // Get sum of total_sales for this shift
      const { data, error } = await supabase
        .from("sales")
        .select("total_sales")
        .eq("shift_id", shiftId);

      if (error) {
        console.error("Error fetching sales total:", error);
        return;
      }

      const salesTotal =
        data?.reduce((sum, sale) => sum + (sale.total_sales || 0), 0) || 0;

      // Update the shift object with current sales total
      if (activeShift) {
        setActiveShift(prev => {
          if (!prev) return null;
          return {
            ...prev,
            sales_total: salesTotal,
          };
        });
      }
    } catch (error) {
      console.error("Error updating shift sales total", error);
    }
  };

  const beginShift = async (openingCash: number) => {
    try {
      setIsLoading(true);
      const newShift = await startShift(openingCash);
      setActiveShift(newShift);
      toast({
        title: "Shift Started",
        description: "Your shift has begun successfully.",
      });
      return newShift;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start shift",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const endShift = async (closingCash: number, paymentMethods?: PaymentMethodItem[]) => {
    if (!activeShift) {
      throw new Error("No active shift to close");
    }

    try {
      setIsLoading(true);
      // First update the sales total one last time
      await updateShiftSalesTotal(activeShift.id);

      // Close the shift
      const closedShift = await closeShift(activeShift.id, closingCash, paymentMethods);
      
      // Clear active shift state
      setActiveShift(null);
      setShiftPaymentMethods([]);
      setSuccess(true);
      
      // Show success message
      toast({
        title: "Shift Closed",
        description: "Your shift has been closed successfully.",
      });
      
      return closedShift;
    } catch (error: any) {
      // Show error message
      toast({
        title: "Error",
        description: error.message || "Failed to close shift",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeShift,
    shiftPaymentMethods,
    beginShift,
    endShift,
    checkActiveShift,
    isLoading,
    success,
  };
}
