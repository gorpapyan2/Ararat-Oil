import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
const RealFuelSystemsPage = lazy(() => import('@/features/fuel-management/pages/FillingSystemsPage').then(m => ({ default: m.default })));

const FuelSystemsPage = () => (
  <div className="management-container">
    <nav className="breadcrumbs">
      <Link to="/">Home</Link> <span> &gt; </span>
      <Link to="/management">Management</Link> <span> &gt; </span>
      <span>Fuel Systems</span>
    </nav>
    <h1 className="management-title">Fuel Systems</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <RealFuelSystemsPage />
    </Suspense>
  </div>
);

export default FuelSystemsPage; 