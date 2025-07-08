// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Head from '../components/layout/Head';
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Phone/password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!/^\+?\d{10,15}$/.test(phone)) {
      setError('Please enter a valid phone number.');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { phone, password });
      const res = await loginAPI({ phone, password, provider: 'phone' });
      
      if (res.data.success) {
        // Use context login method
        login(res.data.user, res.data.token);
        console.log('Login successful:', res.data.user);
        navigate('/inbox');
      } else {
        setError(res.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Use backend error message directly
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Google login success handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);
    
    try {
      const res = await loginAPI({
        provider: 'google',
        googleToken: credentialResponse.credential
      });
      
      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate('/inbox');
      } else {
        setError(res.data.message || 'Google login failed.');
      }
    } catch (err) {
      console.error('Google login error:', err);
      const errorMessage = err.response?.data?.message || 'Google login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                className="w-full p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
                disabled={isLoading}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
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

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-gray-700 font-semibold">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
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