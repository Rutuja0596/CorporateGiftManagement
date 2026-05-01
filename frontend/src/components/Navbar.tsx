import { useLocation, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Button } from './Button';
import { LogOut, Gift, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/campaigns', label: 'Campaigns', icon: List },
  { path: '/orders', label: 'My Orders', icon: Gift },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.removeToken();
    navigate('/login');
  };

  return (
    <nav className="glass-effect backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-white/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            GiftHub
          </h1>
          <div className="hidden md:flex space-x-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-white/20 backdrop-blur-sm text-darkblue shadow-lg'
                    : 'text-darkblue/80 hover:text-darkblue hover:bg-darkblue/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};
