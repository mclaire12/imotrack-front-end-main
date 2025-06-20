'use client'
import React, { useState } from 'react';
import { Plus, Filter, Edit, Trash2, Eye, Search, ChevronDown, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define the structure of a staff member
type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
};

// Define user roles and permissions
type Role = 'Admin' | 'Manager' | 'HR' | 'Staff';
type PermissionAction = 'view' | 'edit' | 'delete' | 'add';

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterRole, setFilterRole] = useState<string>('All');

  // Simulate current user role (in real apps, this comes from context or auth)
  const [currentUserRole] = useState<Role>('Admin');

  const staffData: Staff[] = [
    {
      id: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@ur.ac.rw',
      phone: '+250 788 123 456',
      department: 'Administration',
      role: 'Staff',
      status: 'Active'
    },
    {
      id: 'EMP002',
      name: 'Jane Smith',
      email: 'jane.smith@ur.ac.rw',
      phone: '+250 788 234 567',
      department: 'Transport',
      role: 'Driver',
      status: 'Active'
    },
    {
      id: 'EMP003',
      name: 'Robert Johnson',
      email: 'robert.j@ur.ac.rw',
      phone: '+250 788 345 678',
      department: 'Finance',
      role: 'Manager',
      status: 'Active'
    },
    {
      id: 'EMP004',
      name: 'Sarah Williams',
      email: 'sarah.w@ur.ac.rw',
      phone: '+250 788 456 789',
      department: 'IT',
      role: 'Staff',
      status: 'On Leave'
    },
    {
      id: 'EMP005',
      name: 'Michael Brown',
      email: 'michael.b@ur.ac.rw',
      phone: '+250 788 567 890',
      department: 'Transport',
      role: 'Driver',
      status: 'Active'
    }
  ];

  const router = useRouter();

  const departments: string[] = ['All', 'Administration', 'Transport', 'Finance', 'IT'];
  const statuses: string[] = ['All', 'Active', 'On Leave', 'Inactive'];
  const roles: string[] = ['All', 'Staff', 'Driver', 'Manager', 'Admin'];

  const [showAddModal, setShowAddModal] = useState(false);
  const [staffList, setStaffList] = useState(staffData);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nid: '',
    gender: '',
    email: '',
    phone: '',
    organization: 'Universit Of Rwanda',
    role: '',
    startDate: '',
    password: '',
    address: '',
    dob: '',
  });
  const [formError, setFormError] = useState('');

  // Permission check
  const hasPermission = (action: PermissionAction, targetRole: string | null = null): boolean => {
    const permissions: Record<Role, PermissionAction[]> = {
      'Admin': ['view', 'edit', 'delete', 'add'],
      'Manager': ['view', 'edit', 'add'],
      'HR': ['view', 'edit', 'add'],
      'Staff': ['view']
    };

    const userPermissions = permissions[currentUserRole] || ['view'];

    if ((action === 'edit' || action === 'delete') && targetRole) {
      const roleHierarchy = ['Staff', 'Driver', 'Manager', 'Admin'];
      const currentUserLevel = roleHierarchy.indexOf(currentUserRole);
      const targetRoleLevel = roleHierarchy.indexOf(targetRole);

      if (targetRoleLevel >= currentUserLevel && currentUserRole !== 'Admin') {
        return false;
      }
    }

    return userPermissions.includes(action);
  };

  const filteredStaff = staffData.filter((staff: Staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === 'All' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || staff.status === filterStatus;
    const matchesRole = filterRole === 'All' || staff.role === filterRole;

    return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string): string => {
    const statusStyles: Record<string, string> = {
      'Active': 'bg-green-100 text-green-800',
      'On Leave': 'bg-yellow-100 text-yellow-800',
      'Inactive': 'bg-red-100 text-red-800'
    };

    return `px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRowClick = (staffId: string, staffRole: string) => {
    if (hasPermission('view')) {
      router.push(`/dashboard/staff-management/${staffId}`);

    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple validation
    if (!form.firstName || !form.lastName || !form.nid || !form.gender || !form.email || !form.phone || !form.organization || !form.role || !form.startDate || !form.password) {
      setFormError('Please fill all required fields.');
      return;
    }
    setFormError('');
    setStaffList([
      ...staffList,
      {
        id: 'EMP' + (staffList.length + 1).toString().padStart(3, '0'),
        name: form.firstName + ' ' + form.lastName,
        email: form.email,
        phone: form.phone,
        department: form.organization,
        role: form.role,
        status: 'Active',
      },
    ]);
    setShowAddModal(false);
    setForm({
      firstName: '', lastName: '', nid: '', gender: '', email: '', phone: '', organization: 'Universit Of Rwanda', role: '', startDate: '', password: '', address: '', dob: '',
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all staff members</p>
          </div>
          
          {hasPermission('add') && (
            <button onClick={() => setShowAddModal(true)} className="bg-[#0872B3] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Staff</span>
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0872B3] focus:ring-1 focus:ring-[#0872B3]"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm cursor-pointer hover:border-[#0872B3] focus:outline-none focus:border-[#0872B3] focus:ring-1 focus:ring-[#0872B3]"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm cursor-pointer hover:border-[#0872B3] focus:outline-none focus:border-[#0872B3] focus:ring-1 focus:ring-[#0872B3]"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm cursor-pointer hover:border-[#0872B3] focus:outline-none focus:border-[#0872B3] focus:ring-1 focus:ring-[#0872B3]"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('All');
                setFilterStatus('All');
                setFilterRole('All');
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Staff ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffList.map((staff) => (
                  <tr 
                    key={staff.id}
                    onClick={() => handleRowClick(staff.id, staff.role)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#0872B3]">{staff.id}</td>
                    <td className="px-6 py-4 text-sm text-black font-medium">{staff.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{staff.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{staff.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{staff.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{staff.role}</td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(staff.status)}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {hasPermission('view') && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/staff-management/${staff.id}`);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        
                        {hasPermission('edit', staff.role) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push( `/dashboard/staff-management/${staff.id}/edit`);
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Edit Staff"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        
                        {hasPermission('delete', staff.role) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete ${staff.name}?`)) {
                                // Handle delete
                                console.log('Delete staff:', staff.id);
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Staff"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {staffList.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No staff members found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {staffList.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {staffList.length} of {staffData.length} staff members
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl border border-gray-100 my-8 overflow-y-auto max-h-[90vh] relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            <h2 className="text-2xl font-bold mb-6">Add New Staff Member</h2>
            <form onSubmit={handleAddStaff} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                  <input name="firstName" value={form.firstName} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                  <input name="lastName" value={form.lastName} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">NID <span className="text-red-500">*</span></label>
                  <input name="nid" value={form.nid} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Gender <span className="text-red-500">*</span></label>
                  <input name="gender" value={form.gender} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Email <span className="text-red-500">*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input name="phone" value={form.phone} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Select Organization<span className="text-red-500">*</span></label>
                  <input name="organization" value={form.organization} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Select Role <span className="text-red-500">*</span></label>
                  <select name="role" value={form.role} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">select Role of User</option>
                    <option value="Staff">Staff</option>
                    <option value="Driver">Driver</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input name="startDate" type="date" value={form.startDate} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">User Password <span className="text-red-500">*</span></label>
                  <input name="password" type="password" value={form.password} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Street Address</label>
                  <input name="address" value={form.address} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">DOB</label>
                  <input name="dob" type="date" value={form.dob} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}