import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './components/ThemeContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import Settings from './components/Settings';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } },
};

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'transactions': return <Transactions />;
      case 'insights':     return <Insights />;
      case 'settings':     return <Settings />;
      case 'dashboard':
      default:             return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <Layout activeView={activeView} setActiveView={setActiveView}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeView}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ willChange: 'transform, opacity' }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </Layout>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
