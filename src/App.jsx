import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'transactions': return <Transactions />;
      case 'dashboard':
      default:           return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <Layout activeView={activeView} setActiveView={setActiveView}>
          {renderView()}
        </Layout>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
