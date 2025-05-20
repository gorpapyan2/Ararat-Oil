import { useEffect } from "react";
import { ReactNode } from "react";

export type BreadcrumbSegment = {
  name: string;
  href: string;
  isCurrent?: boolean;
  icon?: ReactNode;
};

interface UsePageBreadcrumbsOptions {
  segments?: BreadcrumbSegment[];
  title?: string;
  appName?: string;
}

/**
 * Simple implementation of usePageBreadcrumbs that only handles document title
 * and doesn't depend on BreadcrumbProvider
 */
export function usePageBreadcrumbs({ segments, title, appName = "Ararat Oil" }: UsePageBreadcrumbsOptions) {
  // Set page title based on the current breadcrumb (if provided)
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${appName}`;
    } else if (segments?.length > 0) {
      // Use the last (current) breadcrumb for the title
      const currentSegment = segments.find(segment => segment.isCurrent) || segments[segments.length - 1];
      document.title = `${currentSegment.name} | ${appName}`;
    }
    
    // Reset title on unmount
    return () => {
      document.title = appName;
    };
  }, [title, segments, appName]);

  // Return empty data - no functional breadcrumb implementation
  return {
    breadcrumbs: segments || [],
    setBreadcrumbs: () => {},
  };
} 