import React from "react";
import { useState, useEffect, useCallback, createElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebarNavConfig } from "@/core/config";
import { useTranslation } from "react-i18next";

type BreadcrumbSegment = {
  name: string;
  href: string;
  isCurrent?: boolean;
  icon?: React.ReactNode;
};

// Define a proper type for nav items to include optional children
type NavItem = {
  to: string;
  icon: React.ComponentType<Record<string, unknown>> | React.ReactNode;
  label: string;
  children?: NavItem[];
};

export interface UseBreadcrumbsOptions {
  includeDashboard?: boolean;
}

/**
 * Hook to manage breadcrumbs based on the current location
 * @param options Configuration options for breadcrumbs
 * @returns Functions to manage breadcrumbs and current breadcrumb state
 */
export function useBreadcrumbs(options: UseBreadcrumbsOptions = {}) {
  const { includeDashboard = true } = options;
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const navConfig = useSidebarNavConfig();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([]);

  /**
   * Creates a proper React element from an icon component
   */
  const createIconElement = useCallback((IconComponent: React.ComponentType<Record<string, unknown>> | React.ReactNode) => {
    if (!IconComponent) return null;
    if (React.isValidElement(IconComponent)) return IconComponent;
    if (typeof IconComponent === 'function') {
      return createElement(IconComponent, { size: 16 });
    }
    return null;
  }, []);

  /**
   * Finds the nav item corresponding to the given path
   */
  const findNavItem = useCallback(
    (path: string) => {
      // Check for exact path matches in all sections
      for (const [section, items] of Object.entries(navConfig)) {
        // Check first level items
        for (const item of items as NavItem[]) {
          if (item.to === path) {
            return { item, section };
          }

          // Check second level (children)
          if ("children" in item && item.children) {
            for (const child of item.children) {
              if (child.to === path) {
                return {
                  item: child,
                  parent: item,
                  section,
                };
              }
            }
          }
        }
      }

      // If no exact match, check if this is a sub-path
      for (const [section, items] of Object.entries(navConfig)) {
        for (const item of items as NavItem[]) {
          // If item has children, check if our path starts with the parent path
          if (
            "children" in item &&
            item.children &&
            path.startsWith(item.to) &&
            item.to !== "/"
          ) {
            // Return the parent item
            return {
              item,
              section,
              isParent: true,
            };
          }
        }
      }

      return null;
    },
    [navConfig]
  );

  /**
   * Generate breadcrumb segments based on the current route
   */
  const generateBreadcrumbs = useCallback(() => {
    const path = location.pathname;
    const segments: BreadcrumbSegment[] = [];

    // Start with home/dashboard if configured
    if (
      includeDashboard &&
      navConfig.overview &&
      navConfig.overview.length > 0
    ) {
      segments.push({
        name: t("common.dashboard"),
        href: "/",
        icon: createIconElement(navConfig.overview[0].icon),
      });
    }

    if (path === "/") {
      // If we're on the homepage, just mark it as current
      if (segments.length > 0) {
        segments[0].isCurrent = true;
      }
      return segments;
    }

    // Split path into segments
    const pathSegments = path.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      return segments;
    }

    // If we have a direct match for the full path, add it
    const fullPathMatch = findNavItem(path);
    if (fullPathMatch) {
      const { item, parent, section } = fullPathMatch;

      // If there's a parent, add it first
      if (parent) {
        segments.push({
          name: t(parent.label),
          href: parent.to,
          icon: createIconElement(parent.icon),
        });
      }

      // Add the matched item as current
      segments.push({
        name: t(item.label),
        href: item.to,
        isCurrent: true,
        icon: createIconElement(item.icon),
      });

      return segments;
    }

    // Otherwise, we need to build up path segments progressively
    let currentPath = "";

    for (const segment of pathSegments) {
      currentPath += `/${segment}`;

      // Try to find a matching nav item
      const match = findNavItem(currentPath);

      if (match) {
        const { item } = match;
        segments.push({
          name: t(item.label),
          href: item.to,
          isCurrent: currentPath === path,
          icon: createIconElement(item.icon),
        });
      } else {
        // For unknown segments, use formatted segment name
        const formattedName = segment
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");

        segments.push({
          name: formattedName,
          href: currentPath,
          isCurrent: currentPath === path,
        });
      }
    }

    return segments;
  }, [
    findNavItem,
    location.pathname,
    includeDashboard,
    t,
    navConfig,
    createIconElement,
  ]);

  /**
   * Set breadcrumbs manually
   */
  const setBreadcrumbsManually = useCallback(
    (newBreadcrumbs: BreadcrumbSegment[]) => {
      setBreadcrumbs(newBreadcrumbs);
    },
    []
  );

  /**
   * Generate and set breadcrumbs based on current location
   */
  const updateBreadcrumbs = useCallback(() => {
    const generated = generateBreadcrumbs();
    setBreadcrumbs(generated);
  }, [generateBreadcrumbs]);

  /**
   * Navigate to a specific breadcrumb
   */
  const navigateToBreadcrumb = useCallback(
    (index: number) => {
      if (breadcrumbs[index]) {
        navigate(breadcrumbs[index].href);
      }
    },
    [breadcrumbs, navigate]
  );

  // Update breadcrumbs whenever the location changes
  useEffect(() => {
    updateBreadcrumbs();
  }, [location.pathname, updateBreadcrumbs]);

  return {
    breadcrumbs,
    setBreadcrumbs: setBreadcrumbsManually,
    updateBreadcrumbs,
    navigateToBreadcrumb,
  };
}
