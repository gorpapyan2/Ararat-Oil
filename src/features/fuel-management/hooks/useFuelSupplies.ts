import { useState, useEffect, useCallback, useRef } from 'react';
import { fuelSuppliesApi } from '@/core/api';
import { FuelSupply } from '@/core/api/types';
import { SupplyListItem } from '../components/FuelSuppliesTable';

// Diagnostic counters for development
const diagnostics = {
  hookInstances: 0,
  renders: 0,
  apiCalls: 0,
  componentsUsingHook: new Set<string>(),
};

export function useFuelSupplies() {
  // Component state
  const [supplies, setSupplies] = useState<SupplyListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Track component mount state to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Instance ID for debugging - uniquely identifies each hook instance
  const instanceId = useRef(++diagnostics.hookInstances);
  
  // Track render count for this specific instance
  const renderCount = useRef(0);
  
  // Log render information in development mode
  if (import.meta.env.DEV) {
    renderCount.current++;
    diagnostics.renders++;
    
    // Extract component name from stack trace
    const stackTrace = new Error().stack || '';
    const callerComponent = stackTrace
      .split('\n')
      .slice(2, 5)
      .map(line => {
        // Extract component name from the stack trace line
        const match = line.match(/at ([A-Za-z0-9$_]+) /);
        return match ? match[1] : '';
      })
      .filter(Boolean)[0] || 'UnknownComponent';
      
    diagnostics.componentsUsingHook.add(callerComponent);
    
    console.log(
      `[useFuelSupplies] Instance #${instanceId.current} render #${renderCount.current}`,
      `(total: ${diagnostics.renders}, instances: ${diagnostics.hookInstances}, API calls: ${diagnostics.apiCalls})`,
      `in ${callerComponent}`
    );
  }
  
  // Transform function for API data
  const transformSupplyToListItem = useCallback((supply: FuelSupply): SupplyListItem => {
    return {
      id: supply.id,
      supplier: supply.petrol_providers?.name || 'Unknown Provider',
      fuelType: supply.fuel_tanks?.fuel_types?.name || supply.fuel_tanks?.name || 'Unknown',
      quantity: Number(supply.quantity_liters || 0),
      pricePerLiter: Number(supply.price_per_liter || 0),
      totalCost: Number(supply.total_cost || 0),
      deliveryDate: supply.delivery_date || new Date().toISOString(),
      status: mapPaymentStatusToSupplyStatus(supply.payment_status || 'pending'),
    };
  }, []);

  // Helper function to map payment_status to the SupplyListItem status enum
  const mapPaymentStatusToSupplyStatus = useCallback((paymentStatus: string): 'pending' | 'received' | 'verified' => {
    switch (paymentStatus.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'verified';
      case 'pending':
        return 'pending';
      default:
        return 'received';
    }
  }, []);

  // Simple fetch data function without caching
  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;
    
    setIsLoading(true);
    
    if (import.meta.env.DEV) {
      diagnostics.apiCalls++;
      console.log(`[useFuelSupplies] Instance #${instanceId.current} fetching fresh data (API call #${diagnostics.apiCalls})`);
    }
    
    try {
      const response = await fuelSuppliesApi.getFuelSupplies();
      
      if (!isMounted.current) return;
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch fuel supplies');
      }
      
      if (response.data && Array.isArray(response.data)) {
        const transformedData = response.data.map(transformSupplyToListItem);
        
        if (import.meta.env.DEV) {
          console.log(`[useFuelSupplies] Received ${transformedData.length} items`);
        }
        
        setSupplies(transformedData);
        setError(null);
      } else {
        // Handle empty data
        setSupplies([]);
      }
    } catch (err) {
      if (!isMounted.current) return;
      
      const errorObj = err instanceof Error ? err : new Error('Unknown error occurred');
      
      if (import.meta.env.DEV) {
        console.error(`[useFuelSupplies] Error fetching data:`, errorObj);
      }
      
      setError(errorObj);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [transformSupplyToListItem]);

  // Refresh function exposed to components - same as fetchData
  const refreshData = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log(`[useFuelSupplies] Instance #${instanceId.current} refresh requested`);
    }
    return fetchData();
  }, [fetchData]);

  // Fetch data on mount and clean up on unmount
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    // Initial data fetch
    fetchData();
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      
      if (import.meta.env.DEV) {
        console.log(`[useFuelSupplies] Instance #${instanceId.current} unmounted`);
      }
    };
  }, [fetchData]);

  return {
    supplies,
    isLoading,
    error,
    refreshData,
    setSupplies
  };
}
