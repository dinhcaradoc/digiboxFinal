import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Head from '../components/layout/Head';
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Register = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email/password submit
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
      // TODO: API call to register user
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      sessionStorage.setItem('pendingPhoneVerification', 'true');
      onSuccess({ provider: 'email', email, password });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
<>
      <Head
        title="Create Account - DigiBox Chapisha"
        description="Create an account to start managing your documents securely."
      />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 text-center">
          Create Account
        </h2>
        
        <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
          Sign up to Get Started
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
              <div className="relative">
            <input
              id="password"
              type="password"
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
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-blue-600 text-white font-bold hover:bg-gold-500 hover:text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-700 font-semibold">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <div>
          <GoogleLogin
            onSuccess={credentialResponse => {
              sessionStorage.setItem('pendingPhoneVerification', 'true');
              onSuccess({ provider: 'google', token: credentialResponse.code });
            }}
            onError={() => setError('Google registration failed. Please try again.')}
            flow="auth-code"
            scope="openid email profile https://www.googleapis.com/auth/drive.file"
            useOneTap
            theme="filled_black"
            text="continue_with"
            shape="pill"
            width="100%"
          />
        </div>
        
        <p className="mt-6 text-center text-gray-700 text-xs sm:text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-gold-600 font-semibold">
            Log in
          </a>
        </p>
      </div>
      
      {/* Terms and privacy links */}
      <p className="mt-6 text-center text-gray-500 text-xs sm:text-sm px-4">
        By creating an account, you agree to our{' '}
        <a href="/terms" className="underline hover:text-gray-700">Terms of Service</a> and{' '}
        <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>
      </p>
    </div>
  );
};

export default Register;