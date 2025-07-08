import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import Head from '../components/layout/Head';
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Register = ({ onSuccess }) => {
  const [name, setName ] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Email/password submit - just collect data and move to phone step
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error state
    setError('');
    setIsLoading(true);

    // Basic validation (can be expanded)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setIsLoading(false);
      return;
    }

    try {
      // Store registration data temporarily for the phone verification step
      sessionStorage.setItem('registrationData', JSON.stringify({
        name,
        email,
        password
      }));
      
      console.log('Moving to phone verification with:', {name, email});
      
      // Navigate to phone verification
      navigate('/phone');
      
      if (onSuccess) {
        onSuccess({ provider: 'email', email, step: 'phone-verification' });
      }
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    // Store Google credential for phone verification step
    sessionStorage.setItem('googleCredential', JSON.stringify(credentialResponse));
    navigate('/phone');
    
    if (onSuccess) {
      onSuccess({ provider: 'google', token: credentialResponse.code, step: 'phone-verification' });
    }
  };

  return (
    <>
      <Head
        title="Create Account - DigiBox Chapisha"
        description="Create an account to start managing your documents securely."
      />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-3 text-center">
            Create Account
          </h2>

          <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
            Sign up to get started
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jina Lako Hapa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-1 text-xs text-gray-500">
                  Password strength:
                  <span className={`font-medium ${password.length >= 8 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {password.length >= 8 ? ' Strong' : ' Weak'}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-3 py-3 bg-blue-600 text-white font-bold hover:bg-gold-500 hover:text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-gray-700 font-semibold">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google registration failed. Please try again.')}
              flow="auth-code"
              scope="openid email profile https://www.googleapis.com/auth/drive.file"
              useOneTap
              theme="filled_black"
              text="continue_with"
              shape="pill"
              width="100%"
              disabled={isLoading}
            />
          </div>

          <p className="mt-6 text-center text-gray-700 text-xs sm:text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-gold-600 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-gray-500 text-xs sm:text-sm px-4">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-gray-700 transition-colors">Terms of Service</Link> and{' '}
          <Link to="/privacy" className="underline hover:text-gray-700 transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </>
  );
};

export default Register;