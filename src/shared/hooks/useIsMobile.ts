import { useMediaQuery } from "./useMediaQuery";

/**
 * Hook to detect if the current viewport is mobile-sized
 * @returns boolean - true if viewport is mobile (≤ 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

export default useIsMobile; 