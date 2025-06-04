import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
const RealFuelSuppliesPage = lazy(() => import('@/features/fuel-management/pages/FuelSuppliesPage').then(m => ({ default: m.default })));

const FuelSuppliesPage = () => (
  <div className="management-container">
    <nav className="breadcrumbs">
      <Link to="/">Home</Link> <span> &gt; </span>
      <Link to="/management">Management</Link> <span> &gt; </span>
      <span>Fuel Supplies</span>
    </nav>
    <h1 className="management-title">Fuel Supplies</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <RealFuelSuppliesPage />
    </Suspense>
  </div>
);

export default FuelSuppliesPage; 