import React, { useState, useEffect } from 'react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { StatsCard } from '@/shared/components/cards';
import { getEmployees, createEmployee } from '@/features/employees/services';
import type { Employee, EmployeeFormData } from '@/features/employees/types/employees.types';

// Optimized icon imports - using centralized icon system
import {
  UserIcons,
  ActionIcons,
  StatusIcons,
  NavigationIcons,
  FinanceIcons,
  TimeIcons
} from '@/shared/components/ui/icons';

// Additional specific icons needed
import {
  AlertCircle,
  Mail,
  Phone,
  Building,
  Calendar,
  X,
  Save
} from 'lucide-react';

const departments = ['Operations', 'Sales', 'Administration', 'Maintenance', 'Security', 'Management'];
const positions = ['Station Manager', 'Cashier', 'Pump Attendant', 'Maintenance Technician', 'Security Guard', 'Administrative Assistant', 'Supervisor', 'Accountant'];

export default function EmployeesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hire_date: new Date().toISOString().split('T')[0],
    salary: 0,
    status: 'active' as const,
    notes: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const employeesData = await getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      if (!createForm.first_name || !createForm.last_name || !createForm.email) {
        alert('Please fill in all required fields');
        return;
      }

      setLoading(true);
      const employeeFormData: EmployeeFormData = {
        first_name: createForm.first_name,
        last_name: createForm.last_name,
        email: createForm.email,
        phone: createForm.phone,
        position: createForm.position,
        department: createForm.department,
        hire_date: createForm.hire_date,
        salary: createForm.salary,
        status: createForm.status,
        notes: createForm.notes
      };

      const newEmployee = await createEmployee(employeeFormData);
      if (newEmployee) {
        setEmployees(prev => [newEmployee, ...prev]);
        setShowCreateModal(false);
        setCreateForm({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          hire_date: new Date().toISOString().split('T')[0],
          salary: 0,
          status: 'active',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Failed to create employee:', error);
      alert('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'on_leave').length;
  const newHiresThisMonth = employees.filter(e => {
    const hireDate = new Date(e.hire_date);
    const now = new Date();
    return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear();
  }).length;

  const quickStats = [
    {
      title: 'Total Employees',
      value: totalEmployees.toString(),
      icon: UserIcons.Users,
      color: 'blue' as const,
      description: 'All registered staff'
    },
    {
      title: 'Active Staff',
      value: activeEmployees.toString(),
      icon: UserIcons.UserCheck,
      color: 'green' as const,
      description: 'Currently working'
    },
    {
      title: 'On Leave',
      value: onLeaveEmployees.toString(),
      icon: TimeIcons.Clock,
      color: 'orange' as const,
      description: 'Temporarily away'
    },
    {
      title: 'New Hires',
      value: newHiresThisMonth.toString(),
      icon: UserIcons.UserPlus,
      color: 'purple' as const,
      description: 'Hired this month'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'on_leave':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <StatusIcons.Success className="w-4 h-4" />;
      case 'inactive':
        return <UserIcons.UserX className="w-4 h-4" />;
      case 'on_leave':
        return <TimeIcons.Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <WindowContainer
      title="Employee Management Dashboard"
      subtitle="Comprehensive human resources management, staff scheduling, and employee administration systems"
    >
      {/* Quick Stats Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
            Staff Overview
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={loadEmployees}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              <ActionIcons.Refresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-200"
            >
              <UserIcons.UserPlus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              description={stat.description}
            />
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <NavigationIcons.Grid className="h-4 w-4 mr-2 inline" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <NavigationIcons.Table className="h-4 w-4 mr-2 inline" />
              Table View
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
            <div className="relative">
              <ActionIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Display */}
      <div className="space-y-6">
        <h4 className="text-md font-semibold text-card-foreground mb-4">
          Employee Directory ({filteredEmployees.length})
        </h4>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading employees...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No employees found. Add your first employee!
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <UserIcons.Users className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-card-foreground">
                        {employee.first_name} {employee.last_name}
                      </h5>
                      <p className="text-xs text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border inline-flex items-center gap-1 ${getStatusColor(employee.status)}`}>
                    {getStatusIcon(employee.status)}
                    <span className="capitalize">{employee.status}</span>
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Hired: {new Date(employee.hire_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    ID: {employee.id.slice(0, 8)}...
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors">
                      <ActionIcons.Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors">
                      <ActionIcons.Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-muted transition-colors">
                      <ActionIcons.Delete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Table View
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Position</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm text-card-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                            <UserIcons.Users className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{employee.first_name} {employee.last_name}</div>
                            <div className="text-xs text-muted-foreground">{employee.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-card-foreground">{employee.position}</td>
                      <td className="px-4 py-3 text-sm text-card-foreground">{employee.department}</td>
                      <td className="px-4 py-3 text-sm text-card-foreground">
                        <div className="max-w-xs truncate" title={employee.email}>
                          {employee.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs border inline-flex items-center gap-1 ${getStatusColor(employee.status)}`}>
                          {getStatusIcon(employee.status)}
                          <span className="capitalize">{employee.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors">
                            <ActionIcons.Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors">
                            <ActionIcons.Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-muted-foreground hover:text-red-600 rounded transition-colors">
                            <ActionIcons.Delete className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">Add New Employee</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.first_name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter first name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.last_name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter last name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter email address..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter phone number..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Position
                  </label>
                  <select
                    value={createForm.position}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select position...</option>
                    {positions.map((position) => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Department
                  </label>
                  <select
                    value={createForm.department}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select department...</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    value={createForm.hire_date}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, hire_date: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Salary (₺)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.salary}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter salary..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Notes
                  </label>
                  <textarea
                    value={createForm.notes}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    placeholder="Additional notes about the employee..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-2.5 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEmployee}
                  disabled={loading || !createForm.first_name || !createForm.last_name || !createForm.email}
                  className="flex-1 px-6 py-2.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Creating...' : 'Add Employee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WindowContainer>
  );
} 