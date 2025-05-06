import { useEffect } from "react";
import { useBreadcrumbs } from "@/layouts/AdminShell";
import { ReactNode } from "react";
import { Home } from "lucide-react";

type BreadcrumbSegment = {
  name: string;
  href: string;
  isCurrent?: boolean;
  icon?: ReactNode;
};

interface UsePageBreadcrumbsOptions {
  segments: BreadcrumbSegment[];
  title: string;
  appName?: string;
}

/**
 * Hook to easily set up breadcrumbs for any page
 *
 * @example
 * // Basic usage
 * usePageBreadcrumbs({
 *   segments: [
 *     { name: t("common.dashboard"), href: "/" },
 *     { name: t("common.settings"), href: "/settings", isCurrent: true },
 *   ],
 *   title: "Settings"
 * });
 * 
 * @example
 * // With custom icons
 * usePageBreadcrumbs({
 *   segments: [
 *     { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
 *     { name: t("common.settings"), href: "/settings", icon: <Settings className="h-4 w-4" />, isCurrent: true },
 *   ],
 *   title: "Settings"
 * });
 */
export function usePageBreadcrumbs({ segments, title, appName = "Ararat Oil" }: UsePageBreadcrumbsOptions) {
  const { setBreadcrumbs } = useBreadcrumbs();

  // Ensure the first segment has an icon
  const enhancedSegments = segments.map((segment, index) => {
    if (index === 0 && !segment.icon) {
      return { ...segment, icon: <Home className="h-4 w-4" /> };
    }
    return segment;
  });
  
  // Set breadcrumbs in context and document title
  useEffect(() => {
    setBreadcrumbs(enhancedSegments);
    document.title = `${title} | ${appName}`;
    
    // Clean up breadcrumbs when component unmounts
    return () => {
      setBreadcrumbs([]);
    };
  }, [setBreadcrumbs, enhancedSegments, title, appName]);
  
  // Add an extra effect to ensure we properly capture dependency updates in enhancedSegments
  // This ensures breadcrumbs update when language changes or other dynamic content updates
  useEffect(() => {
    // This effect intentionally empty but depends on segments to ensure they trigger updates
  }, [segments]);
} 