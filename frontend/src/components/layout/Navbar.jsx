import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoIcon from '../common/LogoIcon';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Alertes', path: '/alerts' },
    { name: 'Historique', path: '/history' },
  ];

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="bg-app-bg px-8 py-4 flex items-center justify-between border-b border-gray-100 relative z-[1000]">

      {/* Logo */}

      <Link to="/" className="flex-shrink-0">
        <LogoIcon color="#C05D2E" textClassName="text-2xl" size={32} />
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-12">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `relative py-1 text-lg font-gara transition-colors duration-300 group ${isActive ? 'text-primary-orange' : 'text-text-dark hover:text-primary-orange'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-primary-orange transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                ></span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Auth Actions */}
      <div className="flex items-center gap-6">
        {!isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-primary-orange font-rope font-medium hover:opacity-80 transition-opacity">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary-orange text-white px-6 py-2 rounded-xl font-rope font-medium hover:bg-primary-hover transition-colors"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="text-text-dark hover:text-primary-orange transition-colors relative">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
            </button>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-primary-orange text-white flex items-center justify-center font-rope font-bold text-lg hover:ring-2 hover:ring-primary-orange/30 transition-all"
              >
                {getInitial(user?.nom || user?.name || "Hafid")}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-text-dark hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <i className="fa-solid fa-gear text-gray-400"></i>
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors text-left"
                  >

                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
