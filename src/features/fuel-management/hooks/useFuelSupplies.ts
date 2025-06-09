import { useState, useEffect, useCallback, useRef } from 'react';
import { fuelSuppliesApi } from '@/core/api';
import { FuelSupply } from '@/core/api/types';
import { SupplyListItem } from '../components/FuelSuppliesTable';

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

// Create a stable cache object that persists between renders and component instances
const globalCache = {
  data: null as SupplyListItem[] | null,
  timestamp: 0,
  isLoading: false,
  error: null as Error | null,
  requestId: 0,
  pendingRequest: null as Promise<void> | null,
};

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
    
    // More detailed logging if debug flag is set
    if (import.meta.env.VITE_DEBUG_HOOKS === 'true') {
      console.log('Component stack:', stackTrace.split('\n').slice(2, 6).join('\n'));
      console.log('Components using hook:', Array.from(diagnostics.componentsUsingHook).join(', '));
    }
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

  // Fetch data function with improved cache handling and request deduplication
  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check if cache is valid and we're not forcing a refresh
    const now = Date.now();
    const cacheIsValid = 
      globalCache.data !== null && 
      (now - globalCache.timestamp < CACHE_DURATION) && 
      !forceRefresh;

    // Use cached data if valid
    if (cacheIsValid) {
      if (import.meta.env.DEV) {
        console.log(`[useFuelSupplies] Instance #${instanceId.current} using cached data`);
      }
      
      if (isMounted.current) {
        setSupplies(globalCache.data || []);
        setIsLoading(false);
        setError(globalCache.error);
      }
      return;
    }

    // Set loading state if we need to fetch
    if (isMounted.current) {
      setIsLoading(true);
    }

    // If there's already a request in progress, reuse that promise
    if (globalCache.pendingRequest) {
      if (import.meta.env.DEV) {
        console.log(`[useFuelSupplies] Instance #${instanceId.current} reusing pending request`);
      }
      
      await globalCache.pendingRequest;
      
      // After the pending request completes, update component state with latest cache
      if (isMounted.current) {
        setSupplies(globalCache.data || []);
        setIsLoading(false);
        setError(globalCache.error);
      }
      return;
    }

    // Create a new request
    const requestId = ++globalCache.requestId;
    
    if (import.meta.env.DEV) {
      diagnostics.apiCalls++;
      console.log(`[useFuelSupplies] Instance #${instanceId.current} initiating API call #${diagnostics.apiCalls} (request ID: ${requestId})`);
    }
    
    // Create the fetch promise
    const fetchPromise = (async () => {
      try {
        // Mark as loading in the global cache
        globalCache.isLoading = true;
        
        // Fetch data from API
        const response = await fuelSuppliesApi.getFuelSupplies();
        
        // Check if this request is still relevant (not superseded by a newer one)
        if (requestId !== globalCache.requestId) {
          if (import.meta.env.DEV) {
            console.log(`[useFuelSupplies] Request #${requestId} superseded, discarding results`);
          }
          return;
        }
        
        if (response.error) {
          throw new Error(response.error.message || 'Failed to fetch fuel supplies');
        }
        
        // Process data if available
        if (response.data && Array.isArray(response.data)) {
          const transformedData = response.data.map(transformSupplyToListItem);
          
          if (import.meta.env.DEV) {
            console.log(`[useFuelSupplies] Request #${requestId} successful, received ${transformedData.length} items`);
          }
          
          // Update cache
          globalCache.data = transformedData;
          globalCache.timestamp = now;
          globalCache.error = null;
          
          // Update component state if still mounted
          if (isMounted.current) {
            setSupplies(transformedData);
            setError(null);
          }
        } else {
          // Handle empty data
          if (import.meta.env.DEV) {
            console.log(`[useFuelSupplies] Request #${requestId} returned empty data`);
          }
          
          globalCache.data = [];
          globalCache.timestamp = now;
          
          // Update component state if still mounted
          if (isMounted.current) {
            setSupplies([]);
          }
        }
      } catch (err) {
        // Update error state
        const errorObj = err instanceof Error ? err : new Error('Unknown error occurred');
        
        if (import.meta.env.DEV) {
          console.error(`[useFuelSupplies] Request #${requestId} failed:`, errorObj);
        }
        
        globalCache.error = errorObj;
        
        if (isMounted.current) {
          setError(errorObj);
        }
      } finally {
        // Clean up loading state
        globalCache.isLoading = false;
        globalCache.pendingRequest = null;
        
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    })();
    
    // Store the promise in the cache so other components can await it
    globalCache.pendingRequest = fetchPromise;
    
    // Await the promise
    await fetchPromise;
  }, [transformSupplyToListItem]);

  // Refresh function exposed to components
  const refreshData = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log(`[useFuelSupplies] Instance #${instanceId.current} manual refresh requested`);
    }
    return fetchData(true);
  }, [fetchData]);

  // Fetch data on mount and clean up on unmount
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    // Check if we already have data in the cache
    if (globalCache.data) {
      setSupplies(globalCache.data);
      setIsLoading(globalCache.isLoading);
      setError(globalCache.error);
      
      // Only fetch if cache is older than CACHE_DURATION
      const now = Date.now();
      if (now - globalCache.timestamp > CACHE_DURATION) {
        // Use the non-force refresh version to leverage cache if available
        fetchData(false);
      }
    } else {
      // No cached data, must fetch
      fetchData(false);
    }
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      
      if (import.meta.env.DEV) {
        console.log(`[useFuelSupplies] Instance #${instanceId.current} unmounted`);
      }
    };
  }, [fetchData]); // Only depend on fetchData

  return {
    supplies,
    isLoading,
    error,
    refreshData
  };
}
