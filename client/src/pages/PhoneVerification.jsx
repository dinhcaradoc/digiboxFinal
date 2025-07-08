// client/src/pages/PhoneVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import Head from '../components/layout/Head';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const PhoneVerification = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [googleCredential, setGoogleCredential] = useState(null);
  const navigate = useNavigate();

  // Check if user should be on this page and load stored data
  useEffect(() => {
    const storedData = sessionStorage.getItem('registrationData');
    const storedGoogle = sessionStorage.getItem('googleCredential');
    console.log('Loaded registration data:', storedData);

    if (!storedData && !storedGoogle) {
      // No registration data found, redirect to register
      navigate('/register', { replace: true });
      return;
    }

    if (storedData) {
      try {
        setRegistrationData(JSON.parse(storedData));
      } catch (err) {
        console.error("Failed to parse registrationData", err);
        sessionStorage.removeItem('registrationData');
      }
    }

    if (storedGoogle) {
      setGoogleCredential(JSON.parse(storedGoogle));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for phone number
    if (!/^\+?\d{10,15}$/.test(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (!registrationData && !googleCredential) {
      setError('Registration session expired. Please start over.');
      navigate('/register');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      let registrationPayload;

      if (registrationData) {
        registrationPayload = {
          ...registrationData,
          phone: phone,
          provider: 'email'
        };
      } else if (googleCredential) {
        registrationPayload = {
          phone: phone,
          provider: 'google',
          googleToken: googleCredential.code || googleCredential.credential
        };
      }

      console.log('Completing registration with:', registrationPayload);
      const response = await register(registrationPayload);

      if (response.data.success) {
        // Show success message first
        setShowSuccess(true);

        // Clear session storage
        sessionStorage.removeItem('registrationData');
        sessionStorage.removeItem('googleCredential');

        console.log('Registration completed:', response.data);

        if (onSubmit) {
          onSubmit({
            phone,
            provider: registrationData ? 'email' : 'google',
            user: response.data.user
          });
        }

        // Redirect after showing success message
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Registration successful! Please log in to continue.',
              email: registrationData?.email || response.data.user?.email
            }
          });
        }, 2000);

      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Enhanced error handling
      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle specific error types
        if (errorData.message) {
          setError(errorData.message);
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          // Handle validation errors array
          setError(errorData.errors.join(', '));
        } else {
          setError('Registration failed. Please try again.');
        }

        // Handle specific status codes
        if (error.response.status === 400) {
          // Bad request - likely validation error
          console.log('Validation error:', errorData);
        } else if (error.response.status === 409) {
          // Conflict - likely duplicate user
          setError('An account with this email or phone number already exists.');
        } else if (error.response.status >= 500) {
          // Server error
          setError('Server error. Please try again later.');
        }
      } else if (error.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    // Clear stored data and go back to registration
    sessionStorage.removeItem('registrationData');
    sessionStorage.removeItem('googleCredential');
    navigate('/register');
  };

  // Success message component
  if (showSuccess) {
    return (
      <>
        <Head
          title="Registration Successful - DigiBox Chapisha"
          description="Your account has been created successfully."
        />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-gray-200">
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been created successfully. You will be redirected to the login page shortly.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            Enter your phone number to complete your registration
          </p>

          {/* Enhanced error display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Registration Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
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
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-blue-600 text-white font-bold hover:bg-gold-500 hover:text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <button
            onClick={handleGoBack}
            disabled={isLoading}
            className="w-full rounded-l mt-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </>
  );
};

export default PhoneVerification;