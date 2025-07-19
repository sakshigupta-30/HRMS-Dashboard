import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      login({
        email: response.user.email,
        token: response.token,
        name: response.user.name,
        id: response.user.id,
        role: response.user.role
      });
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Reusable classes for form elements
  const inputClasses = "w-full p-3 rounded-lg border bg-white text-slate-800 border-gray-300 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonClasses = "w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";


  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 p-5 dark:bg-slate-900">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center text-slate-800 shadow-lg dark:bg-slate-800 dark:text-slate-50">
        <img src={logo} alt="Logo" className="mx-auto mb-5 w-24" />
        <h2 className="text-2xl font-bold mb-5">Login</h2>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={inputClasses}
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className={inputClasses}
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <span 
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          {error && <div className="text-sm text-red-500 text-left">{error}</div>}
          
          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm">
          Don’t have an account? <a href="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default Login;