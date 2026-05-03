import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuthStore } from '../../store/authStore';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    // Demo mode - no socket connection needed
    console.log('Dashboard layout loaded in demo mode');
    
    return () => {
      console.log('Dashboard layout unmounted');
    };
  }, [user]);

  return (
    <div className="flex h-screen bg-navy-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Ethics Banner */}
          <div className="mb-6 bg-amber-900/20 border border-amber-700 rounded-lg p-4">
            <p className="text-amber-200 text-sm text-center">
              ⚠️ <strong>Important:</strong> This platform monitors digital conversation trends and does not predict election results or represent official voter behavior. Social media sentiment does not represent actual voting outcomes.
            </p>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
