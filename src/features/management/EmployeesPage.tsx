import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
const RealEmployeesPage = lazy(() => import('@/features/employees/pages/EmployeesPage').then(m => ({ default: m.EmployeesPage })));

const EmployeesPage = () => (
  <div className="management-container">
    <nav className="breadcrumbs">
      <Link to="/">Home</Link> <span> &gt; </span>
      <Link to="/management">Management</Link> <span> &gt; </span>
      <span>Employees</span>
    </nav>
    <h1 className="management-title">Employees</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <RealEmployeesPage />
    </Suspense>
  </div>
);



export default EmployeesPage; 