import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 text-white py-2 px-4 sm:px-8">
      <div className="container mx-auto text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <p className="text-sm sm:text-base font-medium">
            &copy; {currentYear} DigiBox Chapisha. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <Link
              to="/terms"
              className="hover:text-gold-500 hover:underline px-2 rounded transition-colors duration-300 text-sm sm:text-base font-medium"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="hover:text-gold-500 hover:underline px-2 rounded transition-colors duration-300 text-sm sm:text-base font-medium"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;