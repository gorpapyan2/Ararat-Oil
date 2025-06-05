import { Suspense, lazy } from 'react';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';
const RealEmployeesPage = lazy(() => import('@/features/employees/pages/EmployeesPage').then(m => ({ default: m.EmployeesPage })));

const EmployeesPage = () => (
  <div className="management-container">
    <Breadcrumb 
      items={[
        { label: 'Management', href: '/management' },
        { label: 'Employees' }
      ]}
    />
    <h1 className="management-title">Employees</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <RealEmployeesPage />
    </Suspense>
  </div>
);

export default EmployeesPage; 