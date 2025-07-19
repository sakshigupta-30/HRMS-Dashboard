import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Auth] 1. Checking authentication status...');
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('[Auth] 2. Found in localStorage:', { token, savedUser });

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(userData);
        console.log('[Auth] 3. User is authenticated. Setting user data:', userData);
      } catch (error) {
        console.error('[Auth] 3. Error parsing user data from localStorage. Logging out.', error);
        logout(); // Use logout function to clear everything
      }
    } else {
      console.log('[Auth] 3. No token/user found. User is not authenticated.');
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('[Auth] Login function called. Saving user data:', userData);
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    // sessionStorage is optional, localStorage is more common for persistence
    sessionStorage.setItem('isLoggedIn', 'true'); 
  };

  const logout = () => {
    console.log('[Auth] Logout function called. Clearing auth data.');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};