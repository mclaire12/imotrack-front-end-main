'use client'
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  ChevronDown, 
  Calendar,
  Car,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define the type for a car request
interface CarRequest {
  id: string;
  staffName: string;
  purpose: string;
  pickupDate: string;
  returnDate: string;
  vehicleType: string;
  status: string;
  requestDate: string;
  destination: string;
  staffId: string;
  passengers?: string;
}

export default function CarRequestManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterVehicleType, setFilterVehicleType] = useState('All');
  const [currentUserRole] = useState('Admin'); // This would come from your auth context
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false);
  const [requests, setRequests] = useState<CarRequest[]>([
    {
      id: 'CR001',
      staffName: 'John Smith',
      purpose: 'Field Research',
      pickupDate: '2024-04-01',
      returnDate: '2024-04-03',
      vehicleType: 'SUV',
      status: 'Pending',
      requestDate: '2024-03-25',
      destination: 'Musanze District',
      staffId: 'EMP001'
    },
    {
      id: 'CR002',
      staffName: 'Jane Doe',
      purpose: 'Conference Attendance',
      pickupDate: '2024-04-05',
      returnDate: '2024-04-06',
      vehicleType: 'Sedan',
      status: 'Approved',
      requestDate: '2024-03-20',
      destination: 'Kigali Convention Centre',
      staffId: 'EMP002'
    },
    {
      id: 'CR003',
      staffName: 'Michael Brown',
      purpose: 'Student Field Trip',
      pickupDate: '2024-05-01',
      returnDate: '2024-05-02',
      vehicleType: 'Minibus',
      status: 'Rejected',
      requestDate: '2024-03-18',
      destination: 'Nyungwe National Park',
      staffId: 'EMP005'
    },
    {
      id: 'CR004',
      staffName: 'Sarah Williams',
      purpose: 'Administrative Meeting',
      pickupDate: '2024-04-10',
      returnDate: '2024-04-10',
      vehicleType: 'Sedan',
      status: 'Pending',
      requestDate: '2024-03-28',
      destination: 'Ministry of Education',
      staffId: 'EMP004'
    }
  ]);
  const [form, setForm] = useState({
    fullName: '',
    reason: '',
    destination: '',
    passengers: '',
    startDate: '',
    endDate: '',
  });
  const [formError, setFormError] = useState('');

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];
  const vehicleTypes = ['All', 'SUV', 'Sedan', 'Minibus', 'Pickup'];

  // Permission check function
  const hasPermission = (action: string) => {
    const permissions: Record<string, string[]> = {
      'Admin': ['approve', 'reject', 'view', 'create'],
      'Manager': ['approve', 'reject', 'view', 'create'],
      'Transport': ['approve', 'reject', 'view'],
      'Staff': ['view', 'create']
    };
    return permissions[currentUserRole]?.includes(action) || false;
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
    const matchesVehicleType = filterVehicleType === 'All' || request.vehicleType === filterVehicleType;
    
    return matchesSearch && matchesStatus && matchesVehicleType;
  });

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    return `px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const handleApprove = (requestId: string) => {
    if (confirm('Are you sure you want to approve this request?')) {
      console.log('Approve request:', requestId);
      // Handle approve logic here
    }
  };

  const handleReject = (requestId: string) => {
    if (confirm('Are you sure you want to reject this request?')) {
      console.log('Reject request:', requestId);
      // Handle reject logic here
    }
  };

  const getStatusCount = (status: string) => {
    return requests.filter(request => request.status === status).length;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.fullName || !form.reason || !form.destination || !form.passengers || !form.startDate || !form.endDate) {
      setFormError('Please fill all required fields.');
      return;
    }
    setFormError('');
    setRequests([
      ...requests,
      {
        id: 'CR' + (requests.length + 1).toString().padStart(3, '0'),
        staffName: form.fullName,
        purpose: form.reason,
        pickupDate: form.startDate,
        returnDate: form.endDate,
        vehicleType: '',
        status: 'Pending',
        requestDate: new Date().toISOString().split('T')[0],
        destination: form.destination,
        staffId: '',
        passengers: form.passengers,
      },
    ]);
    setShowAddModal(false);
    setForm({ fullName: '', reason: '', destination: '', passengers: '', startDate: '', endDate: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-[#0872B3]">Car Request Management</h1>
          </div>
          
          {hasPermission('create') && (
            <button onClick={() => setShowAddModal(true)} className="bg-[#0872B3] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-5 h-5" />
              <span>New Car Request</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0872B3] focus:ring-1 focus:ring-[#0872B3]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm cursor-pointer hover:border-[#0872B3] focus:outline-none focus:border-[#0872B3] focus:ring-1 focus:ring-[#0872B3]"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Vehicle Type Filter */}
            <div className="relative">
              <select
                value={filterVehicleType}
                onChange={(e) => setFilterVehicleType(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm cursor-pointer hover:border-[#0872B3] focus:outline-none focus:border-[#0872B3] focus:ring-1 focus:ring-[#0872B3]"
              >
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Vehicle Types' : type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('All');
                setFilterVehicleType('All');
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Staff Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Purpose</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Pickup Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Return Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Vehicle Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr 
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#0872B3]">{request.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">{request.staffName}</p>
                          <p className="text-xs text-gray-500">{request.staffId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.purpose}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(request.pickupDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(request.returnDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {request.vehicleType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(request.status)}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {hasPermission('view') && (
                          <button 
                            onClick={() => router.push( `/dashboard/vehicle-requests/${request.id}`)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        
                        {hasPermission('approve') && request.status === 'Pending' && (
                          <button 
                            onClick={() => handleApprove(request.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Approve Request"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        {hasPermission('reject') && request.status === 'Pending' && (
                          <button 
                            onClick={() => handleReject(request.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reject Request"
                          >
                            <X className="w-4 h-4" />
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
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No car requests found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {filteredRequests.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        )}

        {/* Add Car Request Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100 my-8 overflow-y-auto max-h-[90vh] relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              <h2 className="text-2xl font-bold mb-6 text-center text-[#0872B3]">Car Request</h2>
              <form onSubmit={handleAddRequest} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input name="fullName" value={form.fullName} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required placeholder="Enter your fullname" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Reason <span className="text-red-500">*</span></label>
                    <input name="reason" value={form.reason} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required placeholder="Enter your reason" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Destination <span className="text-red-500">*</span></label>
                    <input name="destination" value={form.destination} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required placeholder="Enter your destination" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Passengers <span className="text-red-500">*</span></label>
                    <input name="passengers" type="number" min={1} value={form.passengers} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required placeholder="Enter number of passengers" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Start Date <span className="text-red-500">*</span></label>
                    <input name="startDate" type="date" value={form.startDate} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required placeholder="Enter start date" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">End Date <span className="text-red-500">*</span></label>
                    <input name="endDate" type="date" value={form.endDate} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required placeholder="Enter end date" />
                  </div>
                </div>
                {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}