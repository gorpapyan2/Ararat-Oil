import React, { Suspense, lazy } from 'react';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';
const RealSettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const SettingsPage = () => (
  <div className="management-container">
    <Breadcrumb 
      items={[
        { label: 'Management', href: '/management' },
        { label: 'Settings' }
      ]}
    />
    <h1 className="management-title">Settings</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <RealSettingsPage />
    </Suspense>
  </div>
);

export default SettingsPage; 