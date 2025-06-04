import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/core/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";

// Types for fuel tank data
export interface FuelTank {
  id: string;
  name: string;
  capacity: number; // in liters
  currentLevel: number; // in liters
  fuelType: FuelType;
  location: string;
  lastChecked: string;
  status: TankStatus;
}

// Enum for fuel types
export enum FuelType {
  DIESEL = "diesel",
  PETROL_92 = "petrol_92",
  PETROL_95 = "petrol_95",
  PETROL_98 = "petrol_98",
  CNG = "cng",
  LPG = "lpg",
}

// Enum for tank status
export enum TankStatus {
  NORMAL = "normal",
  LOW = "low",
  CRITICAL = "critical",
  REFILLING = "refilling",
  MAINTENANCE = "maintenance",
}

// Mock functions for tank operations
const fetchTankData = async (tankId: string): Promise<FuelTank> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock data
  return {
    id: tankId,
    name: `Tank ${tankId.substring(0, 2).toUpperCase()}`,
    capacity: 10000,
    currentLevel: Math.floor(Math.random() * 10000),
    fuelType: FuelType.DIESEL,
    location: "Main Station",
    lastChecked: new Date().toISOString(),
    status: TankStatus.NORMAL,
  };
};

const updateTankLevel = async (
  tankId: string,
  newLevel: number
): Promise<FuelTank> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return updated data
  return {
    id: tankId,
    name: `Tank ${tankId.substring(0, 2).toUpperCase()}`,
    capacity: 10000,
    currentLevel: newLevel,
    fuelType: FuelType.DIESEL,
    location: "Main Station",
    lastChecked: new Date().toISOString(),
    status: newLevel < 2000 ? TankStatus.LOW : TankStatus.NORMAL,
  };
};

const startRefilling = async (tankId: string): Promise<FuelTank> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return updated data
  return {
    id: tankId,
    name: `Tank ${tankId.substring(0, 2).toUpperCase()}`,
    capacity: 10000,
    currentLevel: 2500, // Started refilling from low level
    fuelType: FuelType.DIESEL,
    location: "Main Station",
    lastChecked: new Date().toISOString(),
    status: TankStatus.REFILLING,
  };
};

// Threshold configuration for alerts
export interface TankThresholds {
  lowLevel: number; // Percentage for low level warning
  criticalLevel: number; // Percentage for critical level warning
  autoRefillLevel?: number; // Optional auto-refill threshold
}

// Hook options
export interface UseFuelTankMonitorOptions {
  /**
   * ID of the tank to monitor
   */
  tankId: string;

  /**
   * Polling interval in milliseconds (how often to check the tank level)
   */
  pollingInterval?: number;

  /**
   * Thresholds for different alert levels
   */
  thresholds?: TankThresholds;

  /**
   * Whether to automatically start refilling when low
   */
  enableAutoRefill?: boolean;

  /**
   * Callback when tank level becomes low
   */
  onLowLevel?: (tank: FuelTank) => void;

  /**
   * Callback when tank level becomes critical
   */
  onCriticalLevel?: (tank: FuelTank) => void;

  /**
   * Callback when refilling starts
   */
  onRefillStart?: (tank: FuelTank) => void;

  /**
   * Callback when refilling completes
   */
  onRefillComplete?: (tank: FuelTank) => void;
}

/**
 * Hook for monitoring and managing fuel tank levels
 *
 * This hook demonstrates how to create a specialized hook for monitoring
 * and real-time operations while leveraging our base architecture.
 */
export function useFuelTankMonitor({
  tankId,
  pollingInterval = 30000, // Default to 30 seconds
  thresholds = {
    lowLevel: 25, // 25% for low level
    criticalLevel: 10, // 10% for critical level
    autoRefillLevel: 15, // Auto-refill at 15%
  },
  enableAutoRefill = false,
  onLowLevel,
  onCriticalLevel,
  onRefillStart,
  onRefillComplete,
}: UseFuelTankMonitorOptions) {
  // State
  const [tank, setTank] = useState<FuelTank | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Hooks
  const { success, warning, error: showError } = useToast();
  const queryClient = useQueryClient();

  // Calculate level percentage
  const getLevelPercentage = useCallback((tank: FuelTank): number => {
    return (tank.currentLevel / tank.capacity) * 100;
  }, []);

  // Start refilling the tank
  const startRefill = useCallback(async () => {
    if (!tank || isRefilling) return;

    try {
      setIsRefilling(true);

      const updatedTank = await startRefilling(tankId);
      setTank(updatedTank);

      success({
        title: "Refilling Started",
        description: `Tank ${updatedTank.name} is now being refilled.`,
      });

      onRefillStart?.(updatedTank);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["fuelTanks", tankId] });
    } catch (err) {
      console.error("Error starting refill:", err);
      showError({
        title: "Refill Error",
        description: `Failed to start refilling tank ${tank.name}.`,
      });
      setIsRefilling(false);
    }
  }, [
    tank,
    isRefilling,
    tankId,
    success,
    showError,
    onRefillStart,
    queryClient,
  ]);

  // Fetch tank data
  const fetchTank = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTankData(tankId);
      setTank(data);

      // Check tank level and trigger appropriate callbacks/actions
      const levelPercentage = getLevelPercentage(data);

      if (data.status === TankStatus.REFILLING) {
        setIsRefilling(true);
      } else {
        setIsRefilling(false);

        // Check if level is critical
        if (levelPercentage <= thresholds.criticalLevel) {
          showError({
            title: "Critical Fuel Level",
            description: `Tank ${data.name} is at critical level (${levelPercentage.toFixed(1)}%)!`,
          });
          onCriticalLevel?.(data);

          // Auto-refill if enabled
          if (enableAutoRefill && !isRefilling) {
            startRefill();
          }
        }
        // Check if level is low
        else if (levelPercentage <= thresholds.lowLevel) {
          warning({
            title: "Low Fuel Level",
            description: `Tank ${data.name} is at low level (${levelPercentage.toFixed(1)}%).`,
          });
          onLowLevel?.(data);

          // Auto-refill at specified level if enabled
          if (
            enableAutoRefill &&
            thresholds.autoRefillLevel &&
            levelPercentage <= thresholds.autoRefillLevel &&
            !isRefilling
          ) {
            startRefill();
          }
        }
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["fuelTanks", tankId] });
    } catch (err) {
      console.error("Error fetching tank data:", err);
      setError(err as Error);
      showError({
        title: "Monitoring Error",
        description: `Failed to get tank data for ${tankId}.`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    tankId,
    thresholds,
    enableAutoRefill,
    isRefilling,
    getLevelPercentage,
    onLowLevel,
    onCriticalLevel,
    warning,
    showError,
    queryClient,
    startRefill,
  ]);

  // Update tank level manually
  const updateLevel = useCallback(
    async (newLevel: number) => {
      if (!tank) return;

      try {
        setIsLoading(true);

        // Validate input
        if (newLevel < 0 || newLevel > tank.capacity) {
          throw new Error(`Level must be between 0 and ${tank.capacity}`);
        }

        const updatedTank = await updateTankLevel(tankId, newLevel);
        setTank(updatedTank);

        success({
          title: "Tank Updated",
          description: `Tank ${updatedTank.name} level updated to ${newLevel} liters.`,
        });

        // Check if refilling has completed
        if (isRefilling && updatedTank.status !== TankStatus.REFILLING) {
          setIsRefilling(false);
          onRefillComplete?.(updatedTank);
        }

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["fuelTanks", tankId] });
      } catch (err) {
        console.error("Error updating tank level:", err);
        showError({
          title: "Update Error",
          description:
            (err as Error).message ||
            `Failed to update tank ${tank.name} level.`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      tank,
      tankId,
      isRefilling,
      success,
      showError,
      onRefillComplete,
      queryClient,
    ]
  );

  // Set up polling
  useEffect(() => {
    // Initial fetch
    fetchTank();

    // Set up polling interval
    const intervalId = setInterval(fetchTank, pollingInterval);

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchTank, pollingInterval]);

  return {
    // Tank data
    tank,
    isLoading,
    error,
    isRefilling,

    // Tank level helpers
    getLevelPercentage: tank ? () => getLevelPercentage(tank) : () => 0,

    // Actions
    refresh: fetchTank,
    startRefill,
    updateLevel,

    // Status checks
    isLow: tank ? getLevelPercentage(tank) <= thresholds.lowLevel : false,
    isCritical: tank
      ? getLevelPercentage(tank) <= thresholds.criticalLevel
      : false,
  };
}
