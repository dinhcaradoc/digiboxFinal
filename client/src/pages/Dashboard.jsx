// src/pages/Dashboard.jsx
import React from 'react';
import Head from '../components/layout/Head';

const Dashboard = () => {
  return (
    <>
      {/* Dynamic Head Metadata */}
      <Head title="Dashboard" description="Your personalized dashboard." />

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to Your Dashboard</h1>
        <p className="text-lg text-gray-700 mb-6">
          Manage your documents and access your inbox with ease.
        </p>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Upload Document
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            View Inbox
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;