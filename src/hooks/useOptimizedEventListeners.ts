import { useRef, useEffect, useCallback } from 'react';

type EventListenerOptions = boolean | AddEventListenerOptions;
type EventMap = WindowEventMap & DocumentEventMap & HTMLElementEventMap;

/**
 * Custom hook that adds event listeners with proper cleanup and performance optimizations
 * 
 * Features:
 * - Type-safe event names and handlers
 * - Automatic cleanup on component unmount
 * - Proper handler reference management
 * - Support for multiple event listeners
 * - Support for target elements, document, and window
 * 
 * @example
 * // Basic usage with window
 * useEventListener('resize', handleResize);
 * 
 * // With a specific element
 * useEventListener('click', handleClick, buttonRef.current);
 * 
 * // With options
 * useEventListener('scroll', handleScroll, undefined, { passive: true });
 */
export function useEventListener<K extends keyof EventMap>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  element?: HTMLElement | null,
  options?: EventListenerOptions
): void {
  // Create a ref that stores the handler
  const savedHandler = useRef(handler);
  
  // Update ref.current if handler changes
  // This allows our effect below to always get latest handler
  // without us needing to pass it in effect deps array
  // and potentially cause effect to re-run every render
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  
  useEffect(() => {
    // Define the listening target
    const targetElement = element ?? window;
    if (!targetElement?.addEventListener) return;
    
    // Create event listener that calls handler function stored in ref
    const eventListener: typeof handler = (event) => savedHandler.current(event);
    
    targetElement.addEventListener(eventName, eventListener, options);
    
    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

/**
 * Hook for efficiently managing multiple event listeners
 * 
 * @example
 * const { addListener, removeListener } = useMultipleEventListeners();
 * 
 * useEffect(() => {
 *   addListener(window, 'resize', handleResize);
 *   addListener(document, 'keydown', handleKeyDown);
 *   
 *   // Cleanup handled automatically
 * }, [addListener]);
 */
export function useMultipleEventListeners() {
  // Keep track of all registered event listeners
  const listenersRef = useRef<{
    element: Window | Document | HTMLElement;
    type: string;
    listener: EventListenerOrEventListenerObject;
    options?: EventListenerOptions;
  }[]>([]);
  
  // Add a new event listener
  const addListener = useCallback(
    <E extends Window | Document | HTMLElement, K extends keyof EventMap>(
      element: E,
      type: K,
      listener: (event: EventMap[K]) => void,
      options?: EventListenerOptions
    ) => {
      element.addEventListener(type, listener as EventListener, options);
      
      listenersRef.current.push({
        element,
        type: type as string,
        listener: listener as EventListener,
        options
      });
      
      // Return a function to remove this specific listener
      return () => {
        element.removeEventListener(type, listener as EventListener, options);
        listenersRef.current = listenersRef.current.filter(
          l => l.element !== element || l.type !== type || l.listener !== listener
        );
      };
    },
    []
  );
  
  // Remove a specific event listener
  const removeListener = useCallback(
    <E extends Window | Document | HTMLElement>(
      element: E,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: EventListenerOptions
    ) => {
      element.removeEventListener(type, listener, options);
      listenersRef.current = listenersRef.current.filter(
        l => l.element !== element || l.type !== type || l.listener !== listener
      );
    },
    []
  );
  
  // Clean up all event listeners when the component unmounts
  useEffect(() => {
    const currentListeners = listenersRef.current;
    
    return () => {
      currentListeners.forEach(({ element, type, listener, options }) => {
        element.removeEventListener(type, listener, options);
      });
      listenersRef.current = [];
    };
  }, []);
  
  return { addListener, removeListener };
}

/**
 * Hook for optimized handling of window resize events with debouncing
 * 
 * @param handler Callback function to be called on window resize
 * @param delay Debounce delay in milliseconds (default: 200ms)
 * 
 * @example
 * useWindowResize(({ width, height }) => {
 *   console.log(`Window resized to ${width}x${height}`);
 * });
 */
export function useWindowResize(
  handler: (dimensions: { width: number; height: number }) => void,
  delay = 200
) {
  const timeoutRef = useRef<number | null>(null);
  
  const handleResize = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      handler({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, delay);
  }, [handler, delay]);
  
  useEventListener('resize', handleResize);
  
  // Call handler initially
  useEffect(() => {
    handler({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Hook for optimized handling of scroll events with throttling
 * 
 * @param handler Callback function to be called on scroll
 * @param element Target element to attach scroll event (default: window)
 * @param throttleMs Throttle time in milliseconds (default: 100ms)
 * 
 * @example
 * useScrollThrottled(({ scrollX, scrollY }) => {
 *   console.log(`Scrolled to ${scrollX}, ${scrollY}`);
 * });
 */
export function useScrollThrottled(
  handler: (scrollPosition: { scrollX: number; scrollY: number }) => void,
  element?: HTMLElement | null,
  throttleMs = 100
) {
  const lastTimeRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  
  const handleScroll = useCallback(() => {
    const now = Date.now();
    
    if (now - lastTimeRef.current >= throttleMs) {
      lastTimeRef.current = now;
      
      const target = element || document.documentElement;
      const scrollX = target === document.documentElement ? window.scrollX : target.scrollLeft;
      const scrollY = target === document.documentElement ? window.scrollY : target.scrollTop;
      
      handler({ scrollX, scrollY });
    } else if (!requestRef.current) {
      requestRef.current = window.requestAnimationFrame(() => {
        requestRef.current = null;
        
        const target = element || document.documentElement;
        const scrollX = target === document.documentElement ? window.scrollX : target.scrollLeft;
        const scrollY = target === document.documentElement ? window.scrollY : target.scrollTop;
        
        handler({ scrollX, scrollY });
      });
    }
  }, [element, handler, throttleMs]);
  
  useEventListener('scroll', handleScroll, element || undefined, { passive: true });
  
  // Clean up any pending animation frame
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
} 