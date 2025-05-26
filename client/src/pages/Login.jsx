import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import Head from '../components/layout/Head';
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email/password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      setIsLoading(false);
      return;
    }
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      onSuccess({ provider: 'email', email, password });
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head 
        title="Login - DigiBox Chapisha" 
        description="Sign in to your DigiBox Chapisha account to manage your documents."
      />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-3 text-center">
            Welcome Back!
          </h2>
          
          <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
            Sign in to continue to your account
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
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
            </div>
            
            <div className="flex items-center justify-end">
              <Link className="text-sm text-blue-600 hover:text-blue-800" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-blue-600 text-white font-bold hover:bg-gold-500 hover:text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          {/* ---or--- separator */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-gray-700 font-semibold">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div>
            <GoogleLogin
              onSuccess={credentialResponse => {
                onSuccess({ provider: 'google', token: credentialResponse.code });
              }}
              onError={() => setError('Google login failed. Please try again.')}
              useOneTap
              flow="auth-code"
              scope="openid email profile https://www.googleapis.com/auth/drive.file"
              width="100%"
              theme="filled_black"
              text="continue_with"
              shape="pill"
              disabled={isLoading}
            />
          </div>
          
          <p className="mt-6 text-center text-gray-700 text-xs sm:text-sm">
            New to Digibox?{' '}
            <Link to="/register" className="text-blue-600 hover:text-gold-600 font-semibold transition-colors">
              Create an Account
            </Link>
          </p>
        </div>
        
        <p className="mt-4 text-center text-gray-500 text-xs sm:text-sm px-4">
          By logging in, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-gray-700 transition-colors">Terms of Service</Link> and{' '}
          <Link to="/privacy" className="underline hover:text-gray-700 transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </>
  );
};

export default Login;