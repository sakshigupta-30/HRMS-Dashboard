import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // 👈 install react-icons if not done
import { Link } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'admin@gmail.com' && password === 'admin123') {
      sessionStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    } else {
      setError('Username or password is incorrect');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="https://raymoon.in/storage/company/img/logo/RAYMOON%20SERVICES%20PRIVATE%20LIMITED_Logo_03_Aug_2023_05_08_38.png" alt="Logo" className="login-logo" />
        <h2>Welcome to HRMS</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>

          <p>Don’t have an account? <Link to="/signup">Sign Up</Link></p>

        </form>
      </div>
    </div>
  );
};

export default Login;
