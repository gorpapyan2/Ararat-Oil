import { useState, useEffect, useCallback } from "react";
import { Shift, ShiftPaymentMethod, PaymentMethod } from "@/types";
import { shiftsApi } from "@/core/api";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethodItem } from "@/shared/components/shared/MultiPaymentMethodFormStandardized";

export function useShift() {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isCheckingShift, setIsCheckingShift] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [shiftPaymentMethods, setShiftPaymentMethods] = useState<
    PaymentMethodItem[]
  >([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Add a function to clear stuck loading states
  const clearStuckStates = useCallback(() => {
    // If the check has been running for more than 10 seconds, force reset
    if (isCheckingShift && Date.now() - lastCheckTime > 10000) {
      console.warn("Detected stuck loading state in useShift, resetting");
      setIsCheckingShift(false);
    }
  }, [isCheckingShift, lastCheckTime]);

  // Run the clear function periodically
  useEffect(() => {
    const interval = setInterval(clearStuckStates, 5000);
    return () => clearInterval(interval);
  }, [clearStuckStates, isCheckingShift, lastCheckTime]);

  // Check for active shift
  const checkActiveShift = useCallback(
    async (userId?: string, skipCache = false): Promise<Shift | null> => {
      if (!user && !userId) {
        console.log("No user found, cannot check for active shift");
        return null;
      }

      // If already checking and not forced to skip cache, prevent duplicate calls
      if (isCheckingShift && !skipCache) {
        console.log(
          "Already checking for active shift, skipping duplicate call"
        );
        return activeShift;
      }

      try {
        setIsCheckingShift(true);
        setLastCheckTime(Date.now());

        // Check for offline mode first
        if (!navigator.onLine) {
          console.log("Offline mode: using cached shift data");
          // Try to get cached data from localStorage
          try {
            const cachedShift = localStorage.getItem(
              `activeShift_${userId || user?.id}`
            );
            if (cachedShift) {
              const parsedShift = JSON.parse(cachedShift) as Shift;
              console.log("Using cached shift data:", parsedShift);
              setActiveShift(parsedShift);
              return parsedShift;
            }
          } catch (e) {
            console.error("Error parsing cached shift:", e);
          }
          return activeShift;
        }

        // Check for ANY active shift in the system
        try {
          const response = await shiftsApi.getSystemActiveShift();
          if (response.error) {
            throw new Error(response.error.message);
          }

          const systemActiveShift = response.data || null;
          if (systemActiveShift) {
            console.log(
              "Found an active shift in the system:",
              systemActiveShift
            );

            // Always update the activeShift state with any active shift
            // This ensures we know a shift is active even if it's not for the current user
            setActiveShift(systemActiveShift as unknown as Shift);

            // Cache this for the user too, for reference
            localStorage.setItem(
              `activeShift_system`,
              JSON.stringify(systemActiveShift)
            );

            // If it belongs to the current user, cache it specifically for them
            if (systemActiveShift.employee_id === (userId || user?.id)) {
              localStorage.setItem(
                `activeShift_${userId || user?.id}`,
                JSON.stringify(systemActiveShift)
              );
            }

            return systemActiveShift as unknown as Shift;
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
            const response = await shiftsApi.getActiveShiftForUser(
              userId || user?.id || ""
            );
            if (response.error) {
              throw new Error(response.error.message);
            }

            const fetchedShift = response.data || null;

            // Only update state if the component is still mounted and checking hasn't been canceled
            if (isCheckingShift) {
              console.log(
                "Active shift check complete:",
                fetchedShift ? "Shift found" : "No active shift"
              );

              // Cache the shift data for offline access
              if (fetchedShift) {
                try {
                  localStorage.setItem(
                    `activeShift_${userId || user?.id}`,
                    JSON.stringify(fetchedShift)
                  );
                } catch (e) {
                  console.warn("Failed to cache shift data:", e);
                }
              } else if (!success) {
                // Only clear if we're not in the process of closing a shift
                localStorage.removeItem(`activeShift_${userId || user?.id}`);
              }

              setActiveShift(fetchedShift as unknown as Shift);
              foundShift = fetchedShift as unknown as Shift;
            }

            // Exit retry loop if successful
            break;
          } catch (error: unknown) {
            retryCount++;
            if (retryCount < maxRetries) {
              console.log(
                `Retry attempt ${retryCount}/${maxRetries} for active shift check`
              );
              // Exponential backoff
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * retryCount)
              );
            } else {
              throw error; // Re-throw the error after max retries
            }
          }
        }

        return foundShift;
      } catch (error: unknown) {
        console.error("Error checking for active shift:", error);
        return null;
      } finally {
        setIsCheckingShift(false);
      }
    },
    [user, isCheckingShift, activeShift, success]
  );

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

  // Update shift sales total
  const updateShiftSalesTotal = async (shiftId: string) => {
    try {
      const response = await shiftsApi.getShiftSalesTotal(shiftId);
      if (response.error) {
        throw new Error(response.error.message);
      }

      const salesTotal = response.data?.total || 0;

      // Update the active shift with the new sales total
      setActiveShift((prevShift) => {
        if (prevShift && prevShift.id === shiftId) {
          return {
            ...prevShift,
            sales_total: salesTotal,
          };
        }
        return prevShift;
      });
    } catch (error) {
      console.error("Error updating shift sales total:", error);
    }
  };

  // Begin a new shift
  const beginShift = async (
    openingCash: number,
    employeeIds: string[] = []
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuccess(false);

    try {
      const response = await shiftsApi.startShift(
        openingCash,
        employeeIds.length > 0 ? employeeIds : [user.id]
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      const newShift = response.data;
      if (newShift) {
        setActiveShift(newShift as unknown as Shift);
        setSuccess(true);

        // Cache the new shift
        try {
          localStorage.setItem(
            `activeShift_${user.id}`,
            JSON.stringify(newShift)
          );
        } catch (e) {
          console.warn("Failed to cache new shift:", e);
        }

        toast({
          title: "Success",
          description: "Shift started successfully",
        });

        // Clear success state after a delay
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error: unknown) {
      console.error("Error starting shift:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start shift";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // End the current shift
  const endShift = async (
    closingCash: number,
    paymentMethods?: PaymentMethodItem[]
  ) => {
    if (!activeShift) {
      toast({
        title: "Error",
        description: "No active shift to close",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuccess(false);

    try {
      const response = await shiftsApi.closeShift(
        activeShift.id,
        closingCash,
        paymentMethods?.map((pm) => ({
          id: "",
          shift_id: activeShift.id,
          payment_method: pm.payment_method as "cash" | "card" | "bank_transfer" | "mobile_payment",
          amount: pm.amount,
          notes: pm.reference || "",
          created_at: "",
          updated_at: "",
        }))
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      setActiveShift(null);
      setShiftPaymentMethods([]);
      setSuccess(true);

      // Clear cached shift data
      try {
        localStorage.removeItem(`activeShift_${user?.id}`);
        localStorage.removeItem(`activeShift_system`);
      } catch (e) {
        console.warn("Failed to clear cached shift data:", e);
      }

      toast({
        title: "Success",
        description: "Shift closed successfully",
      });

      // Clear success state after a delay
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: unknown) {
      console.error("Error closing shift:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to close shift";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch shift payment methods
  const fetchShiftPaymentMethods = async (shiftId: string) => {
    try {
      const response = await shiftsApi.getShiftPaymentMethods(shiftId);
      if (response.error) {
        throw new Error(response.error.message);
      }

      const methods = response.data || [];
      const formattedMethods: PaymentMethodItem[] = methods.map((method) => ({
        payment_method: method.payment_method as "cash" | "card" | "bank_transfer" | "mobile_payment",
        amount: method.amount,
        reference: method.notes,
      }));

      setShiftPaymentMethods(formattedMethods);
    } catch (error) {
      console.error("Error fetching shift payment methods:", error);
    }
  };

  // Add payment methods to shift
  const addPaymentMethods = async (paymentMethods: PaymentMethodItem[]) => {
    if (!activeShift) {
      toast({
        title: "Error",
        description: "No active shift",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await shiftsApi.addShiftPaymentMethods(
        activeShift.id,
        paymentMethods.map((pm) => ({
          id: "",
          shift_id: activeShift.id,
          payment_method: pm.payment_method as "cash" | "card" | "bank_transfer" | "mobile_payment",
          amount: pm.amount,
          notes: pm.reference || "",
          created_at: "",
          updated_at: "",
        }))
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Refresh payment methods
      await fetchShiftPaymentMethods(activeShift.id);

      toast({
        title: "Success",
        description: "Payment methods added successfully",
      });
    } catch (error: unknown) {
      console.error("Error adding payment methods:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add payment methods";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Delete payment method from shift
  const deletePaymentMethod = async (paymentMethodId: string) => {
    if (!activeShift) {
      toast({
        title: "Error",
        description: "No active shift",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await shiftsApi.deleteShiftPaymentMethods(activeShift.id);

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Refresh payment methods
      await fetchShiftPaymentMethods(activeShift.id);

      toast({
        title: "Success",
        description: "Payment method removed successfully",
      });
    } catch (error: unknown) {
      console.error("Error deleting payment method:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete payment method";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Initialize shift check on mount and user change
  useEffect(() => {
    if (user) {
      checkActiveShift();
    }
  }, [user, checkActiveShift]);

  return {
    activeShift,
    isLoading,
    success,
    isCheckingShift,
    shiftPaymentMethods,
    checkActiveShift,
    beginShift,
    endShift,
    addPaymentMethods,
    deletePaymentMethod,
    updateShiftSalesTotal,
  };
} 