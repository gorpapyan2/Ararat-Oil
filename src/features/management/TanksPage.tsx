import React from 'react';
import { lazy } from 'react';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';
const RealTanksPage = lazy(() => import('@/features/fuel-management/pages/TanksPage').then(m => ({ default: m.default })));

const TanksPage = () => (
  <div className="management-container">
    <Breadcrumb 
      items={[
        { label: 'Management', href: '/management' },
        { label: 'Tanks' }
      ]}
    />
    <h1 className="management-title">Tanks</h1>
    <p className="management-desc">Manage fuel storage tanks here.</p>
    <React.Suspense fallback={<div>Loading...</div>}>
      <RealTanksPage />
    </React.Suspense>
  </div>
);

export default TanksPage; 