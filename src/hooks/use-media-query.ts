import { useState, useEffect } from 'react';

/**
 * Custom hook to check if a media query matches
 * @param query The media query to check (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the match state, or false on the server
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;

    // Create the media query list
    const mediaQueryList = window.matchMedia(query);

    // Update the state initially
    setMatches(mediaQueryList.matches);

    // Define a callback function to handle changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener to the media query list
    if (mediaQueryList.addEventListener) {
      // Modern browsers
      mediaQueryList.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(listener);
    }

    // Clean up function
    return () => {
      if (mediaQueryList.removeEventListener) {
        // Modern browsers
        mediaQueryList.removeEventListener('change', listener);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query]); // Only re-run if the query changes

  return matches;
}

export default useMediaQuery; 