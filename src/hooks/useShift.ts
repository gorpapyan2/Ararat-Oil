import { useState, useEffect } from "react";
import { Shift } from "@/types";
import { startShift, closeShift } from "@/services/shifts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { fetchActiveShift } from "@/utils/api-helpers";
import { supabase } from "@/integrations/supabase/client";

export function useShift() {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check for active shift on mount
  useEffect(() => {
    if (user) {
      checkActiveShift();
    }
  }, [user]);

  const checkActiveShift = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const shift = await fetchActiveShift(user.id);
      if (shift) {
        setActiveShift(shift as Shift);

        // If we have an active shift, fetch the current sales total
        updateShiftSalesTotal((shift as Shift).id);
      } else {
        setActiveShift(null);
      }
    } catch (error) {
      console.error("Error checking active shift", error);
    } finally {
      setIsLoading(false);
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
        setActiveShift({
          ...activeShift,
          sales_total: salesTotal,
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

  const endShift = async (closingCash: number) => {
    if (!activeShift) {
      throw new Error("No active shift to close");
    }

    try {
      setIsLoading(true);
      // First update the sales total one last time
      await updateShiftSalesTotal(activeShift.id);

      const closedShift = await closeShift(activeShift.id, closingCash);
      setActiveShift(null);
      toast({
        title: "Shift Closed",
        description: "Your shift has been closed successfully.",
      });
      return closedShift;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close shift",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeShift,
    beginShift,
    endShift,
    checkActiveShift,
    isLoading,
  };
}
