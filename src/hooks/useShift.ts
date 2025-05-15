import { useState, useEffect, useCallback } from "react";
import { Shift, ShiftPaymentMethod, PaymentMethod } from "@/types";
import { shiftsApi } from "@/core/api";
import { useAuth } from '@/features/auth';
import { useToast } from "@/hooks/useToast";
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
      try {
        const response = await shiftsApi.getSystemActive();
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        const systemActiveShift = response.data?.[0] || null;
        if (systemActiveShift) {
          console.log("Found an active shift in the system:", systemActiveShift);
          
          // Always update the activeShift state with any active shift
          // This ensures we know a shift is active even if it's not for the current user
          setActiveShift(systemActiveShift);
          
          // Cache this for the user too, for reference
          localStorage.setItem(`activeShift_system`, JSON.stringify(systemActiveShift));
          
          // If it belongs to the current user, cache it specifically for them
          if (systemActiveShift.employee_id === (userId || user?.id)) {
            localStorage.setItem(`activeShift_${userId || user?.id}`, JSON.stringify(systemActiveShift));
          }
          
          return systemActiveShift;
        }
      } catch (error) {
        console.error("Error checking for system active shift:", error);
      }
      
      // Implement retry logic with backoff
      let retryCount = 0;
      const maxRetries = 3;
      let foundShift: Shift | null = null;
      
      while (retryCount < maxRetries) {
        try {
          // Use the API to get user's active shift
          const response = await shiftsApi.getActiveForUser(userId || user?.id || '');
          if (response.error) {
            throw new Error(response.error.message);
          }
          
          const fetchedShift = response.data || null;
          
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
      const response = await shiftsApi.getPaymentMethods(shiftId);
      if (response.error) {
        throw new Error(response.error.message);
      }
      setShiftPaymentMethods(response.data || []);
    } catch (error) {
      console.error("Error fetching shift payment methods", error);
    }
  };

  const updateShiftSalesTotal = async (shiftId: string) => {
    try {
      // Get sum of total_sales for this shift using API
      const response = await shiftsApi.getSalesTotal(shiftId);
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const salesTotal = response.data?.total || 0;

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
        // For online mode, check with the server 
        try {
          // Query for ANY active shift in the system using the API
          const response = await shiftsApi.getSystemActive();
          if (response.error) {
            throw new Error(response.error.message);
          }
          
          const systemActiveShift = response.data?.[0] || null;
          
          if (systemActiveShift) {
            // There's an active shift already
            const isCurrentUserShift = systemActiveShift.employee_id === user?.id;
            
            if (isCurrentUserShift) {
              throw new Error("You already have an active shift open. Please close it before starting a new one.");
            } else {
              throw new Error("Another employee has an active shift open. Only one shift can be active at a time.");
            }
          }
        } catch (checkError: any) {
          // If the error indicates no active shifts were found, we can proceed
          if (!checkError.message?.includes("No active shifts found")) {
            console.error("Error checking for existing active shifts:", checkError);
            throw checkError;
          }
        }
      }
      
      // Start new shift
      const response = await shiftsApi.start(openingCash, employeeIds);
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const newShift = response.data!;
      
      // Update state with new shift
      setActiveShift(newShift);
      
      // Cache the new shift for offline mode
      localStorage.setItem(`activeShift_${user?.id}`, JSON.stringify(newShift));
      localStorage.setItem(`activeShift_system`, JSON.stringify(newShift));
      
      toast({
        title: "Shift Started",
        description: `Shift started with ${openingCash} cash`,
        variant: "success",
      });
      
      return newShift;
    } catch (error: any) {
      console.error("Error starting shift:", error);
      toast({
        title: "Error Starting Shift",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const endShift = async (closingCash: number, paymentMethods?: PaymentMethodItem[]) => {
    try {
      setIsLoading(true);
      setSuccess(true); // Indicate we're in the closing process
  
      if (!activeShift) {
        throw new Error("No active shift found to close");
      }
  
      // Close the shift
      const response = await shiftsApi.close(activeShift.id, closingCash, paymentMethods);
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const closedShift = response.data!;
  
      // Remove cached shift data since it's now closed
      localStorage.removeItem(`activeShift_${user?.id}`);
      localStorage.removeItem(`activeShift_system`);
  
      // Reset state
      setActiveShift(null);
      setShiftPaymentMethods([]);
  
      toast({
        title: "Shift Closed",
        description: `Shift closed with ${closingCash} cash`,
        variant: "success",
      });
  
      return closedShift;
    } catch (error: any) {
      console.error("Error closing shift:", error);
      toast({
        title: "Error Closing Shift",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
      setSuccess(false);
    }
  };

  return {
    activeShift,
    isLoading,
    shiftPaymentMethods,
    checkActiveShift,
    beginShift,
    endShift,
    isCheckingShift
  };
}
