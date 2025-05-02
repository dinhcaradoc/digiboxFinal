import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

import logo from '../../assets/logo.png'; // Adjust the path to your logo image

const navLinks = [
  { to: '/login', label: 'Login' },
  { to: '/signup', label: 'Sign Up' },
  { to: '/enterprise', label: 'Enterprise' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className='bg-blue-600 text-white shadow-md'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          {/* Logo and brand name */}
          <Link to='/' className='flex items-center space-x-2'>
            {logo ? (
              <img
                src={logo}
                alt="Digibox Logo"
                className="h-8 w-8 rounded bg-white p-1"
              />
            ) : (
              <div className="h-8 w-8 bg-white rounded" />
            )}
            <span className='text-2xl font-extrabold tracking-tight'>Digibox</span>
          </Link>
          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navLinks.map(({ to, label }) => (
              <Link key={to}
                to={to} className={`hover:text-blue-200 transition-colors font-medium ${location.pathname === to ? 'underline undeline-offset-4' : ''
                  }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden focus:outline-none'
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16m-7 6h7'
                />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden mt-3 pb-3 space-y-2 animate-fade-in'>
            {navLinks.map(({ to, label }) => (
              <Link key={to}
                to={to} className="block py-2 px-3 hover:bg-blue-700 rounded transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
                >{label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;