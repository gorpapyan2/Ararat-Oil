// Moved from src/components/common/BreadcrumbPageWrapper.tsx
import React, { ReactNode } from 'react';
import { useBreadcrumbs } from './BreadcrumbProvider';
import { BreadcrumbSegment } from '@/hooks/usePageBreadcrumbs';

interface BreadcrumbPageWrapperProps {
  children: ReactNode;
  breadcrumbs: string[];
}

export const BreadcrumbPageWrapper: React.FC<BreadcrumbPageWrapperProps> = ({ children, breadcrumbs }) => {
  const { setBreadcrumbs } = useBreadcrumbs();

  React.useEffect(() => {
    setBreadcrumbs(breadcrumbs as unknown as BreadcrumbSegment[]);
  }, [breadcrumbs, setBreadcrumbs]);

  return <>{children}</>;
}; 