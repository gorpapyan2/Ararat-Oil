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

  // Flag to prevent concurrent requests
  let isCheckingShift = false;

  const checkActiveShift = async () => {
    if (!user) return;
    if (isCheckingShift) {
      console.log("Shift check already in progress, skipping duplicate request");
      return;
    }
    // Skip checking if we're in the process of closing a shift or already succeeded
    if (success) {
      console.log("Shift already closed successfully, skipping check");
      return;
    }
    
    isCheckingShift = true;
    setIsLoading(true);
    
    // Track retry attempts
    let retryCount = 0;
    const maxRetries = 3;
    
    const attemptFetch = async (): Promise<Shift | null> => {
      try {
        // Check if online before making the request
        if (!navigator.onLine) {
          console.warn("No internet connection detected while checking for active shift");
          toast({
            title: "Offline Mode",
            description: "Working in offline mode. Some features may be limited.",
            variant: "warning",
            duration: 5000,
          });
          // Try to use cached data in localStorage
          const cachedShift = localStorage.getItem(`activeShift_${user.id}`);
          if (cachedShift) {
            return JSON.parse(cachedShift);
          }
          return null;
        }
        
        console.log("Fetching active shift for user:", user.id);
        const shift = await fetchActiveShift(user.id);
        if (shift) {
          console.log("Active shift found:", shift.id);
        } else {
          console.log("No active shift found for user:", user.id);
        }
        return shift as Shift;
      } catch (error: any) {
        if (retryCount < maxRetries) {
          // Wait a moment before retrying (increasing delay)
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          retryCount++;
          console.log(`Retrying fetch attempt ${retryCount}/${maxRetries}`);
          return attemptFetch();
        }
        
        // Show a network error toast if we've exhausted our retries
        toast({
          title: "Connection Issue",
          description: "Could not connect to the server. Please check your connection.",
          variant: "destructive",
          duration: 5000,
        });
        throw error;
      }
    };
    
    try {
      const shift = await attemptFetch();
      
      if (shift) {
        setActiveShift(shift);
        // Cache the active shift for offline mode
        try {
          localStorage.setItem(`activeShift_${user.id}`, JSON.stringify(shift));
        } catch (e) {
          console.warn("Failed to cache active shift data", e);
        }
        // If we have an active shift, fetch the current sales total
        await updateShiftSalesTotal(shift.id);
      } else {
        // Only clear the state if we're not in the process of closing a shift
        if (!success) {
          setActiveShift(null);
          setShiftPaymentMethods([]);
          // Clear any cached shift data
          try {
            localStorage.removeItem(`activeShift_${user.id}`);
          } catch (e) {
            console.warn("Failed to clear cached shift data", e);
          }
        }
      }
    } catch (error) {
      console.error("Error checking active shift:", error);
      // Only clear the state if we're not in the process of closing a shift
      if (!success) {
        setActiveShift(null);
        setShiftPaymentMethods([]);
      }
    } finally {
      setIsLoading(false);
      isCheckingShift = false;
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
      
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error("Cannot close shift while offline. Please check your internet connection.");
      }
      
      // First update the sales total one last time
      try {
        await updateShiftSalesTotal(activeShift.id);
      } catch (salesError) {
        console.error("Error updating sales total before closing shift:", salesError);
        // Continue anyway - we'll use the last known total
      }

      // Close the shift
      const closedShift = await closeShift(activeShift.id, closingCash, paymentMethods);
      
      // Clear active shift state
      setActiveShift(null);
      setShiftPaymentMethods([]);
      setSuccess(true);
      
      // Clear the local storage cache for this shift
      try {
        localStorage.removeItem(`activeShift_${user?.id}`);
      } catch (cacheError) {
        console.error("Error clearing shift cache:", cacheError);
        // Non-critical error, continue
      }
      
      // Show success message
      toast({
        title: "Shift Closed",
        description: "Your shift has been closed successfully.",
      });
      
      return closedShift;
    } catch (error: any) {
      console.error("Error ending shift:", error);
      
      // Check if it's a network error
      if (error.message?.includes("Failed to fetch") || !navigator.onLine) {
        toast({
          title: "Network Error",
          description: "Cannot close shift due to network issues. Please check your connection and try again.",
          variant: "destructive",
          duration: 8000,
        });
      } else {
        // Show other error message
        toast({
          title: "Error",
          description: error.message || "Failed to close shift",
          variant: "destructive",
          duration: 5000,
        });
      }
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
