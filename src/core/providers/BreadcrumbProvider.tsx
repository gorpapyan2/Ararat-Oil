// Moved from src/components/BreadcrumbProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbSegment {
  name: string;
  href: string;
  isCurrent?: boolean;
  icon?: React.ReactNode;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbSegment[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbSegment[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({
  children,
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
