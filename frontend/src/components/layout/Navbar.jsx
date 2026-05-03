import { useState } from 'react';
import { Menu, Search, Download, Moon, Sun, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const [theme, setTheme] = useState('dark');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-navy-900 border-b border-navy-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-navy-800 rounded-lg px-4 py-2 w-96">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search parties, candidates, topics..."
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Export Button */}
          <button className="hidden md:flex items-center space-x-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-400" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 bg-navy-800 hover:bg-red-600 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
