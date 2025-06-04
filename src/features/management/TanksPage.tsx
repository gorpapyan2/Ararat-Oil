import React from 'react';
import { Link } from 'react-router-dom';
import { lazy } from 'react';
const RealTanksPage = lazy(() => import('@/features/fuel-management/pages/TanksPage').then(m => ({ default: m.default })));

const TanksPage = () => (
  <div className="management-container">
    <nav className="breadcrumbs">
      <Link to="/">Home</Link> <span> &gt; </span>
      <Link to="/management">Management</Link> <span> &gt; </span>
      <span>Tanks</span>
    </nav>
    <h1 className="management-title">Tanks</h1>
    <p className="management-desc">Manage fuel storage tanks here.</p>
    <React.Suspense fallback={<div>Loading...</div>}>
      <RealTanksPage />
    </React.Suspense>
  </div>
);

export default TanksPage; 