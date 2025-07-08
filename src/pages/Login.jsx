import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.png'; // adjust path as needed
import { authAPI } from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Attempting login with:', credentials);

    try {
      const response = await authAPI.login(credentials);
      console.log('Login successful:', response);
      localStorage.setItem('token', response.token);
      sessionStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    } catch (error) {
      console.error('Login error details:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Don’t have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
