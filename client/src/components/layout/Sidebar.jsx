// client/src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Sidebar navigation links for PROTECTED PAGES
const navLinks = [
  { to: '/uploads', label: 'My Uploads' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/quickbox', label: 'QuickBox' },
];

const Sidebar = ({ name, onLogout, onClose }) => {
  const location = useLocation();

  return (
    <nav
      className="bg-blue-600 text-white w-56 h-full flex flex-col shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile close button */}
      {onClose && (
        <div className="md:hidden flex justify-end p-2">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar Brand/Greeting */}
      <div className="p-3 border-b border-blue-700">
        <Link 
          to="/dashboard" 
          className="block hover:opacity-80 transition-opacity duration-200"
          aria-label={`Go to dashboard, ${name ? name : 'user'}`}
        >
          <h2 className="text-2xl font-semibold text-left">Hi, {name ? name : 'User'}</h2>
        </Link>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4" role="list">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
                  location.pathname === to
                    ? 'bg-gold-500/90 text-black font-semibold shadow-sm'
                    : 'hover:bg-gold-500/50 hover:text-black hover:translate-x-1'
                }`}
                aria-current={location.pathname === to ? 'page' : undefined}
                onClick={onClose}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Fixed Action Buttons */}
      <div className="p-4 border-t border-blue-700 bg-blue-600">
        <div className="flex flex-col space-y-3 items-end">
          {/* Uncomment if settings later */}
          {/* <Link
            to="/settings"
            className="w-36 py-2 text-center bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Settings
          </Link> */}

          <button
            onClick={onLogout}
            className="w-36 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;