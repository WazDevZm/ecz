import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bell, Plus, Trash2, RefreshCw } from 'lucide-react';
import { mockAlerts } from '../lib/mockData';

const AlertsPage = () => {
  const [alertsList, setAlertsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setAlertsList(mockAlerts);
    } catch (error) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAlertsList(prev => prev.filter(a => a._id !== id));
      toast.success('Alert deleted');
    } catch (error) {
      toast.error('Failed to delete alert');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Alerts</h1>
          <p className="text-gray-400 mt-1">Manage your custom alerts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Create Alert</span>
        </button>
      </div>

      {alertsList.length === 0 ? (
        <div className="card text-center py-12">
          <Bell size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No alerts configured yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary mt-4"
          >
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alertsList.map((alert) => (
            <div key={alert._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    alert.isActive ? 'bg-green-600/20' : 'bg-gray-600/20'
                  }`}>
                    <Bell size={20} className={alert.isActive ? 'text-green-400' : 'text-gray-400'} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{alert.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{alert.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(alert._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Threshold:</span>
                  <span className="text-white">{alert.conditions.threshold}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Window:</span>
                  <span className="text-white">{alert.conditions.timeWindow}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Triggered:</span>
                  <span className="text-white">{alert.triggerCount} times</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
