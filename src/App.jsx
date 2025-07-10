import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Placements from './pages/Placements';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AddCandidate from './pages/AddCandidate';
import CandidateDetail from './pages/CandidateDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { CandidateProvider } from './context/CandidateContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Payroll from './pages/Payroll'; // ✅ Add this with your other imports



const PrivateLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <CandidateProvider>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <Sidebar />
        <main
          style={{
            flex: 1,
            backgroundColor: '#F1F5F9',
            padding: '1rem',
            overflow: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </CandidateProvider>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        }
      />
      <Route
        path="/placements"
        element={
          <PrivateLayout>
            <Placements />
          </PrivateLayout>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateLayout>
            <Placements />
          </PrivateLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateLayout>
            <Settings />
          </PrivateLayout>
        }
      />
      <Route
        path="/add-candidate"
        element={
          <PrivateLayout>
            <AddCandidate />
          </PrivateLayout>
        }
      />
      <Route
        path="/candidate/:id"
        element={
          <PrivateLayout>
            <CandidateDetail />
          </PrivateLayout>
        }
      />
      <Route
        path="/payroll"
        element={
          <PrivateLayout>
            <Payroll />
          </PrivateLayout>
        }
      />

    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
