
import { useCallback } from "react";
import type { StoreApi, UseBoundStore } from "zustand";

/**
 * Generic hook for using Zustand stores with TypeScript safety
 */
export function useStore<T, K>(
  store: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => K
): K {
  return store(selector);
}

/**
 * Hook for creating a shallow selector for store state
 */
export function useShallowStore<T, K>(
  store: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => K
): K {
  const memoizedSelector = useCallback(selector, []);
  return store(memoizedSelector);
}
