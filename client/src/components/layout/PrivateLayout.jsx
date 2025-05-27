import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const PrivateLayout = ({ name, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <Header
        onSidebarToggle={() => setSidebarOpen((open) => !open)}
        isSidebarOpen={sidebarOpen}
        name={name}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-30 w-56 transition-transform duration-200 bg-blue-600
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0 md:inset-auto overflow-y-auto
          `}
        >
          <Sidebar 
            name={name} 
            onLogout={onLogout} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/10 md:hidden"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto bg-white">
            <Outlet />
          </main>
          
          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 py-2 px-4 text-xs text-gray-500 bg-white">
            © {new Date().getFullYear()} Digibox Chapisha
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;