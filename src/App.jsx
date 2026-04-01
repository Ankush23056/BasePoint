import React from 'react';
import { ThemeProvider } from './components/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
