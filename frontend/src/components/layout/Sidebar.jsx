import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  TrendingUp, 
  Map, 
  Bell, 
  FileText,
  Settings,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/parties', icon: Users, label: 'Parties' },
    { to: '/dashboard/candidates', icon: UserCircle, label: 'Candidates' },
    { to: '/dashboard/trends', icon: TrendingUp, label: 'Trends' },
    { to: '/dashboard/map', icon: Map, label: 'Map Analytics' },
    { to: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
    { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/dashboard/admin', icon: Settings, label: 'Admin' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-navy-900 border-r border-navy-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-navy-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ZedPulse</h1>
                <p className="text-xs text-gray-400">Elections Dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-navy-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-navy-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
