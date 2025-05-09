import { useState, useEffect, useCallback } from "react";
import { Shift, ShiftPaymentMethod, PaymentMethod } from "@/types";
import { startShift, closeShift } from "@/services/shifts";
import { getShiftPaymentMethods } from "@/services/shiftPaymentMethods";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { fetchActiveShift } from "@/utils/api-helpers";
import { supabase } from "@/services/supabase";
import { PaymentMethodItem } from "@/components/shared/MultiPaymentMethodFormStandardized";

export function useShift() {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isCheckingShift, setIsCheckingShift] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [shiftPaymentMethods, setShiftPaymentMethods] = useState<PaymentMethodItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Add a function to clear stuck loading states
  const clearStuckStates = () => {
    // If the check has been running for more than 10 seconds, force reset
    if (isCheckingShift && Date.now() - lastCheckTime > 10000) {
      console.warn("Detected stuck loading state in useShift, resetting");
      setIsCheckingShift(false);
    }
  };

  // Run the clear function periodically
  useEffect(() => {
    const interval = setInterval(clearStuckStates, 5000);
    return () => clearInterval(interval);
  }, [isCheckingShift, lastCheckTime]);

  // Check for active shift
  const checkActiveShift = useCallback(async (userId?: string, skipCache = false): Promise<Shift | null> => {
    if (!user && !userId) {
      console.log('No user found, cannot check for active shift');
      return null;
    }
    
    // If already checking and not forced to skip cache, prevent duplicate calls
    if (isCheckingShift && !skipCache) {
      console.log('Already checking for active shift, skipping duplicate call');
      return activeShift;
    }
    
    try {
      setIsCheckingShift(true);
      setLastCheckTime(Date.now());
      
      // Check for offline mode first
      if (!navigator.onLine) {
        console.log('Offline mode: using cached shift data');
        // Try to get cached data from localStorage
        try {
          const cachedShift = localStorage.getItem(`activeShift_${userId || user?.id}`);
          if (cachedShift) {
            const parsedShift = JSON.parse(cachedShift) as Shift;
            console.log('Using cached shift data:', parsedShift);
            setActiveShift(parsedShift);
            return parsedShift;
          }
        } catch (e) {
          console.error('Error parsing cached shift:', e);
        }
        return activeShift;
      }
      
      // Check for ANY active shift in the system
      const { data: anyActiveShift, error: anyActiveError } = await supabase
        .from("shifts")
        .select()
        .eq("status", "OPEN")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!anyActiveError && anyActiveShift) {
        console.log("Found an active shift in the system:", anyActiveShift);
        
        // Always update the activeShift state with any active shift
        // This ensures we know a shift is active even if it's not for the current user
        setActiveShift(anyActiveShift as Shift);
        
        // Cache this for the user too, for reference
        localStorage.setItem(`activeShift_system`, JSON.stringify(anyActiveShift));
        
        // If it belongs to the current user, cache it specifically for them
        if (anyActiveShift.employee_id === (userId || user?.id)) {
          localStorage.setItem(`activeShift_${userId || user?.id}`, JSON.stringify(anyActiveShift));
        }
        
        return anyActiveShift as Shift;
      }
      
      // Implement retry logic with backoff
      let retryCount = 0;
      const maxRetries = 3;
      let foundShift: Shift | null = null;
      
      while (retryCount < maxRetries) {
        try {
          const fetchedShift = await fetchActiveShift(userId || user?.id || '');
          
          // Only update state if the component is still mounted and checking hasn't been canceled
          if (isCheckingShift) {
            console.log('Active shift check complete:', fetchedShift ? 'Shift found' : 'No active shift');
            
            // Cache the shift data for offline access
            if (fetchedShift) {
              try {
                localStorage.setItem(`activeShift_${userId || user?.id}`, JSON.stringify(fetchedShift));
              } catch (e) {
                console.warn('Failed to cache shift data:', e);
              }
            } else if (!success) {
              // Only clear if we're not in the process of closing a shift
              localStorage.removeItem(`activeShift_${userId || user?.id}`);
            }
            
            setActiveShift(fetchedShift);
            foundShift = fetchedShift;
          }
          
          // Exit retry loop if successful
          break;
        } catch (error: any) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Retry attempt ${retryCount}/${maxRetries} for active shift check`);
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          } else {
            throw error; // Re-throw the error after max retries
          }
        }
      }
      
      return foundShift;
    } catch (error: any) {
      console.error('Error checking for active shift:', error);
      return null;
    } finally {
      setIsCheckingShift(false);
    }
  }, [user, isCheckingShift, activeShift, success]);

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

  const beginShift = async (openingCash: number, employeeIds: string[] = []) => {
    try {
      setIsLoading(true);
      
      // Check if there's already an active shift first - for ANY employee
      if (!navigator.onLine) {
        // For offline mode, check local cache
        const cachedShift = localStorage.getItem(`activeShift_${user?.id}`);
        if (cachedShift) {
          throw new Error("You already have an active shift open. Please close it before starting a new one.");
        }
        
        // Also check for system-wide active shift
        const systemShift = localStorage.getItem(`activeShift_system`);
        if (systemShift) {
          const parsedShift = JSON.parse(systemShift);
          if (parsedShift && parsedShift.employee_id !== user?.id) {
            throw new Error("Another employee has an active shift open. Only one shift can be active at a time.");
          }
        }
      } else {
        // For online mode, check with the server - this requires a modification to fetch ANY active shift
        try {
          // Query for ANY active shift in the system
          const { data, error } = await supabase
            .from("shifts")
            .select("id, employee_id")
            .eq("status", "OPEN")
            .limit(1)
            .single();
          
          if (!error && data) {
            // There's an active shift already
            const isCurrentUserShift = data.employee_id === user?.id;
            
            if (isCurrentUserShift) {
              throw new Error("You already have an active shift open. Please close it before starting a new one.");
            } else {
              throw new Error("Another employee has an active shift open. Only one shift can be active at a time.");
            }
          }
        } catch (checkError: any) {
          // If the error is "No rows found" then we're good to proceed
          if (!checkError.message?.includes("No rows found")) {
            console.error("Error checking for existing active shifts:", checkError);
            if (checkError.message?.includes("active shift")) {
              // This is our custom error, re-throw it
              throw checkError;
            }
            // For other errors, proceed with caution - might be a network issue
            console.warn("Warning: Could not verify if an active shift exists");
            
            // Do a double-check with our utility function
            const anyActiveShift = await checkActiveShift(user?.id, true);
            if (anyActiveShift) {
              const isCurrentUserShift = anyActiveShift.employee_id === user?.id;
              
              if (isCurrentUserShift) {
                throw new Error("You already have an active shift open. Please close it before starting a new one.");
              } else {
                throw new Error("Another employee has an active shift open. Only one shift can be active at a time.");
              }
            }
          }
        }
      }
      
      // If we get here, no active shift was found, so we can proceed
      const newShift = await startShift(openingCash, employeeIds);
      setActiveShift(newShift);
      toast({
        title: "Shift Started",
        description: "Your shift has begun successfully.",
      });
      return newShift;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start shift",
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
