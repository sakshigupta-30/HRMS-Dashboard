import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh', // lock full screen height
        width: '100vw',  // lock full screen width
        overflow: 'hidden',
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          backgroundColor: '#F1F5F9',
          padding: '1rem',
          overflow: 'hidden',
        }}
      >
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
