import React, { Suspense, lazy } from 'react';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';
const RealFuelSystemsPage = lazy(() => import('@/features/fuel-management/pages/FillingSystemsPage').then(m => ({ default: m.default })));

const FuelSystemsPage = () => (
  <div className="management-container">
    <Breadcrumb 
      items={[
        { label: 'Management', href: '/management' },
        { label: 'Fuel Systems' }
      ]}
    />
    <h1 className="management-title">Fuel Systems</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <RealFuelSystemsPage />
    </Suspense>
  </div>
);

export default FuelSystemsPage; 