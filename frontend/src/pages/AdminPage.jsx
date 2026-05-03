import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Settings, Users as UsersIcon, RefreshCw } from 'lucide-react';
import { mockUsers } from '../lib/mockData';

const AdminPage = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setUsersList(mockUsers);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="text-green-400" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-1">Manage users and system settings</p>
        </div>
      </div>

      {/* User Management */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <UsersIcon className="text-blue-400" size={24} />
          <h3 className="text-xl font-semibold text-white">User Management</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user._id} className="border-b border-navy-800">
                  <td className="py-3 px-4 text-white">{user.name}</td>
                  <td className="py-3 px-4 text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-navy-800 text-white px-3 py-1 rounded border border-navy-700"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="analyst">Analyst</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.isActive ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(user._id, user.isActive)}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
