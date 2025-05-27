import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Header = ({ onSidebarToggle, isSidebarOpen, name = "User" }) => {
  return (
    <header className="bg-blue-600 text-white py-3 px-4 sm:px-6 shadow-md sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Left: Toggle + Logo */}
        <div className="flex items-center space-x-3">
          <button
            className="md:hidden p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={onSidebarToggle}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/inbox" className="flex items-center space-x-2">
            {logo ? (
              <img
                src={logo}
                alt="Digibox Logo"
                className="h-8 w-8 rounded bg-white p-1"
              />
            ) : (
              <div className="h-8 w-8 bg-white rounded" />
            )}
            <span className="text-2xl font-bold tracking-tight drop-shadow hidden sm:inline">
              Digibox Chapisha
            </span>
          </Link>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center space-x-3">
          {/* <span className="text-sm font-medium hidden md:inline">
            {name}
          </span> */}
          <div className="h-8 w-8 rounded-full bg-gold-500 text-blue-800 flex items-center justify-center font-medium shadow-sm">
            {name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
