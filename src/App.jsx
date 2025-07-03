import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Placements from './pages/Placements';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AddCandidate from './pages/AddCandidate';

const App = () => {
  return (
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
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-candidate" element={<AddCandidate />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
