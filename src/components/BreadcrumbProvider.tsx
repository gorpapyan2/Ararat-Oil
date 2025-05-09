import React, { createContext, useContext, ReactNode } from 'react';

export type BreadcrumbSegment = {
  name: string;
  href: string;
  isCurrent?: boolean;
  icon?: React.ReactNode;
};

// Default empty functions for breadcrumb operations
const noop = () => {};

// Create a simple breadcrumb context that doesn't throw errors
export function useBreadcrumbs() {
  // Always return a simple object without throwing errors
  return {
    breadcrumbs: [],
    setBreadcrumbs: noop
  };
}

// Simple provider that doesn't actually do anything - just renders children
export function BreadcrumbProvider({ 
  children 
}: { children: ReactNode }) {
  return <>{children}</>;
} 