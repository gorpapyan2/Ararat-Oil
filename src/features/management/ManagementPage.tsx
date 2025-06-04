import React from 'react';
import { Link } from 'react-router-dom';
import './ManagementPage.css'; // Optional: for custom styles

const subSections = [
  { name: 'Tanks', route: '/management/tanks', color: '#4F8CFF' },
  { name: 'Fuel Supplies', route: '/management/fuel-supplies', color: '#6C63FF' },
  { name: 'Employees', route: '/management/employees', color: '#FF6584' },
  { name: 'Fuel Systems', route: '/management/fuel-systems', color: '#43E6A0' },
  { name: 'Fuel Prices', route: '/management/fuel-prices', color: '#FFA500' },
];

const ManagementPage = () => {
  return (
    <div className="management-container">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span> &gt; </span> <span>Management</span>
      </nav>
      <h1 className="management-title">Management</h1>
      <p className="management-desc">Manage tanks, fuel supplies, employees, fuel systems, and fuel prices.</p>
      <div className="management-cards">
        {subSections.map((section) => (
          <Link to={section.route} className="management-card" key={section.name} style={{ backgroundColor: section.color }}>
            <span className="management-card-initial">{section.name[0]}</span>
            <span className="management-card-title">{section.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ManagementPage; 