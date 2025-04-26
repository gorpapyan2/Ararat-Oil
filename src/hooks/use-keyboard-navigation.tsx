import * as React from "react";

type KeyboardNavProps = {
  /**
   * The keys that will trigger navigation
   */
  navigationKeys?: string[];
  /**
   * The keys that will trigger selection/activation
   */
  activationKeys?: string[];
  /**
   * Function to call when a navigation key is pressed
   */
  onNavigate?: (event: React.KeyboardEvent, direction: number) => void;
  /**
   * Function to call when an activation key is pressed
   */
  onActivate?: (event: React.KeyboardEvent) => void;
  /**
   * Whether navigation should wrap around at the ends
   */
  wrapAround?: boolean;
};

/**
 * Hook to handle keyboard navigation in interactive components
 * like menus, listboxes, etc.
 */
export function useKeyboardNavigation({
  navigationKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
  activationKeys = ["Enter", " "],
  onNavigate,
  onActivate,
  wrapAround = true,
}: KeyboardNavProps = {}) {
  
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      // Handle navigation keys
      if (navigationKeys.includes(event.key) && onNavigate) {
        event.preventDefault();
        
        let direction = 0;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          direction = 1;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          direction = -1;
        }
        
        onNavigate(event, direction);
      }
      
      // Handle activation keys
      if (activationKeys.includes(event.key) && onActivate) {
        event.preventDefault();
        onActivate(event);
      }
    },
    [navigationKeys, activationKeys, onNavigate, onActivate]
  );

  return { handleKeyDown };
}

/**
 * Hook to trap focus within a container (for modals, dialogs, etc.)
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean = true
) {
  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // If shift + tab and on first element, move to last element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // If tab and on last element, move to first element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    // Focus the first focusable element when the trap activates
    firstElement?.focus();
    
    // Add event listener for tab key
    document.addEventListener('keydown', handleTabKey);
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [containerRef, isActive]);
}

/**
 * Improved React hook to handle "Skip to content" functionality
 */
export function useSkipToContent(contentId: string = "main-content") {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const skipLinkRef = React.useRef<HTMLAnchorElement>(null);
  
  const showSkipLink = () => setIsVisible(true);
  const hideSkipLink = () => setIsVisible(false);
  
  React.useEffect(() => {
    const skipLink = skipLinkRef.current;
    if (!skipLink) return;
    
    skipLink.addEventListener('focus', showSkipLink);
    skipLink.addEventListener('blur', hideSkipLink);
    
    return () => {
      skipLink.removeEventListener('focus', showSkipLink);
      skipLink.removeEventListener('blur', hideSkipLink);
    };
  }, []);
  
  return {
    skipLinkRef,
    isVisible,
    contentId,
  };
} 