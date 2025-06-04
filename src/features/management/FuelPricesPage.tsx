import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
const RealFuelPricesPage = lazy(() => import('@/features/fuel-management/pages/FuelPricesPage').then(m => ({ default: m.default })));

const FuelPricesPage = () => (
  <div className="management-container">
    <nav className="breadcrumbs">
      <Link to="/">Home</Link> <span> &gt; </span>
      <Link to="/management">Management</Link> <span> &gt; </span>
      <span>Fuel Prices</span>
    </nav>
    <h1 className="management-title">Fuel Prices</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <RealFuelPricesPage />
    </Suspense>
  </div>
);

export default FuelPricesPage; 