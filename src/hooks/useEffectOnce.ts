import { useEffect, useState } from "react";

/**
 * A hook that runs an effect only once when the component mounts
 * with proper cleanup when the component unmounts.
 *
 * Addresses the limitation of useEffect(() => {}, []) pattern
 * by ensuring proper cleanup and preventing memory leaks.
 *
 * @param effect Function that contains imperative, possibly effectful code.
 *
 * @example
 * useEffectOnce(() => {
 *   const subscription = subscribeToEventSource();
 *   return () => subscription.unsubscribe(); // Cleanup function
 * });
 */
export function useEffectOnce(effect: () => void | (() => void)) {
  // Using state to ensure the effect only runs once
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!hasRun) {
      setHasRun(true);
      const cleanup = effect();
      return typeof cleanup === "function" ? cleanup : undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRun]);
}

/**
 * A hook that runs an async effect only once when the component mounts
 * with proper cleanup when the component unmounts.
 *
 * This is particularly useful for async initialization that needs cleanup.
 *
 * @param effect Async function that contains imperative, possibly effectful code.
 *
 * @example
 * useAsyncEffectOnce(async () => {
 *   const data = await fetchData();
 *   processData(data);
 *
 *   // Return a cleanup function if needed
 *   return () => {
 *     cleanupData();
 *   }
 * });
 */
export function useAsyncEffectOnce(effect: () => Promise<void | (() => void)>) {
  // Using state to ensure the effect only runs once
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    // Flag to track if component is still mounted
    let isMounted = true;
    let cleanupFunction: (() => void) | void = undefined;

    if (!hasRun) {
      setHasRun(true);

      const executeEffect = async () => {
        try {
          // Execute the async effect
          const maybeCleanup = await effect();

          // If component is still mounted and cleanup was returned, store it
          if (isMounted && typeof maybeCleanup === "function") {
            cleanupFunction = maybeCleanup;
          }
        } catch (err) {
          // Only log error if component is still mounted
          if (isMounted) {
            console.error("Error in useAsyncEffectOnce:", err);
          }
        }
      };

      executeEffect();
    }

    // Cleanup function that runs when the component unmounts
    return () => {
      isMounted = false;
      if (typeof cleanupFunction === "function") {
        cleanupFunction();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRun]);
}

/**
 * Custom hook that ensures an async effect is properly cleaned up
 * when the component unmounts, preventing memory leaks and warnings
 *
 * @param asyncEffect The async effect to execute
 * @param dependencies Dependencies array to control when the effect runs
 */
export function useAsyncEffect(
  asyncEffect: () => Promise<void | (() => void)>,
  dependencies: React.DependencyList = []
) {
  useEffect(() => {
    let isMounted = true;
    let cleanup: void | (() => void);

    const execute = async () => {
      try {
        cleanup = await asyncEffect();
      } catch (error) {
        console.error("Error in async effect:", error);
      }
    };

    execute();

    return () => {
      isMounted = false;
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
