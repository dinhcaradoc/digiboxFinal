import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Head from '../components/layout/Head';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PhoneVerification = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user should be on this page
  useEffect(() => {
    if (sessionStorage.getItem('pendingPhoneVerification') !== 'true') {
      navigate('/register', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation for phone number (simple, can be improved)
    if (!/^\+?\d{10,15}$/.test(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    sessionStorage.removeItem('pendingPhoneVerification'); // Clear the flag after verification
    onSubmit(phone);
  };

  return (
    <>
      <Head 
        title="Phone Verification - DigiBox Chapisha"
        description="Verify your phone number to complete your account setup."
      />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 text-center">
          Almost Done!
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
          Enter your phone number to verify your account
        </p>
        {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="sr-only">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError(''); // Clear error on input change
              }}
                className="w-full p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold hover:bg-gold-500 hover:text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default PhoneVerification;