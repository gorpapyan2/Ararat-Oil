import React, { Suspense, lazy } from 'react';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';
const RealFinancePage = lazy(() => import('@/features/finance/pages/FinancePage').then(m => ({ default: m.default })));

const FinancePage = () => (
  <div className="management-container">
    <Breadcrumb 
      items={[
        { label: 'Management', href: '/management' },
        { label: 'Finance' }
      ]}
    />
    <h1 className="management-title">Financial Management</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <RealFinancePage />
    </Suspense>
  </div>
);

export default FinancePage; 