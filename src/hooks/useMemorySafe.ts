import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Hook that tracks whether the component is mounted
 * Useful for preventing state updates on unmounted components
 */
export function useIsMounted() {
  const isMounted = useRef(false);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return useCallback(() => isMounted.current, []);
}

/**
 * A safer version of useState that prevents state updates on unmounted components
 */
export function useSafeState<T>(initialState: T | (() => T)) {
  const [state, setState] = useState<T>(initialState);
  const isMounted = useIsMounted();
  
  const setSafeState = useCallback((value: React.SetStateAction<T>) => {
    if (isMounted()) {
      setState(value);
    }
  }, [isMounted]);
  
  return [state, setSafeState] as const;
}

/**
 * Run an async effect safely with proper cleanup
 */
export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    let cleanup: void | (() => void);
    let isActive = true;
    
    const execute = async () => {
      try {
        cleanup = await effect();
      } catch (error) {
        console.error('Error in useAsyncEffect:', error);
      }
    };
    
    execute();
    
    return () => {
      isActive = false;
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Creates a callback that won't change unless one of its dependencies changes
 * This is similar to useCallback but ensures the callback won't be called if component unmounts
 */
export function useSafeCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList = []
) {
  const isMounted = useIsMounted();
  
  return useCallback(
    ((...args: Parameters<T>) => {
      if (isMounted()) {
        return callback(...args);
      }
    }) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted, ...deps]
  );
}

/**
 * Creates a safe timeout that gets cleared on component unmount
 */
export function useSafeTimeout() {
  const timeoutIds = useRef<number[]>([]);
  
  const setSafeTimeout = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      callback();
      timeoutIds.current = timeoutIds.current.filter(timeoutId => timeoutId !== id);
    }, delay);
    
    timeoutIds.current.push(id);
    return id;
  }, []);
  
  const clearSafeTimeout = useCallback((id: number) => {
    window.clearTimeout(id);
    timeoutIds.current = timeoutIds.current.filter(timeoutId => timeoutId !== id);
  }, []);
  
  const clearAllTimeouts = useCallback(() => {
    timeoutIds.current.forEach(id => window.clearTimeout(id));
    timeoutIds.current = [];
  }, []);
  
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);
  
  return { setSafeTimeout, clearSafeTimeout, clearAllTimeouts };
}

/**
 * Creates a safe interval that gets cleared on component unmount
 */
export function useSafeInterval() {
  const intervalIds = useRef<number[]>([]);
  
  const setSafeInterval = useCallback((callback: () => void, delay: number) => {
    const id = window.setInterval(callback, delay);
    intervalIds.current.push(id);
    return id;
  }, []);
  
  const clearSafeInterval = useCallback((id: number) => {
    window.clearInterval(id);
    intervalIds.current = intervalIds.current.filter(intervalId => intervalId !== id);
  }, []);
  
  const clearAllIntervals = useCallback(() => {
    intervalIds.current.forEach(id => window.clearInterval(id));
    intervalIds.current = [];
  }, []);
  
  useEffect(() => {
    return () => {
      clearAllIntervals();
    };
  }, [clearAllIntervals]);
  
  return { setSafeInterval, clearSafeInterval, clearAllIntervals };
} 