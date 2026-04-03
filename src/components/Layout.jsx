import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, activeView, setActiveView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-500/30 dark:selection:text-indigo-100 transition-colors">
      {/* Fixed Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header */}
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-6 px-10 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-600 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          &copy; {new Date().getFullYear()} BasePoint Fintech. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
