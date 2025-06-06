import React from 'react';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

export default function EmployeesPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Management', href: '/management' },
    { label: 'Employee Management', href: '/management/employees' }
  ];

  return (
    <div className="subnav-container">
      <div className="subnav-card-window">
        {/* Header with Breadcrumb */}
        <div className="subnav-header">
          <div className="subnav-header-content">
            <div className="subnav-breadcrumb">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="subnav-body">
          <div className="subnav-content">
            {/* Page Title Section */}
            <div className="page-title-section">
              <h1 className="page-title">
                Employee Management
              </h1>
              <p className="page-description">
                Comprehensive human resources management, staff scheduling, and employee administration systems.
              </p>
            </div>

            {/* Content Area */}
            <div className="management-cards">
              <p>Employee management content will go here...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 