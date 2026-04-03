import React, { useState } from 'react';
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen, activeView, setActiveView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard',     title: 'Dashboard',     icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions',  title: 'Transactions',  icon: <ArrowRightLeft className="w-5 h-5" /> },
    { id: 'insights',      title: 'Insights',      icon: <PieChart className="w-5 h-5" /> },
    { id: 'settings',      title: 'Settings',      icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (item) => {
    if (item.id === 'dashboard' || item.id === 'transactions') {
      setActiveView(item.id);
      setIsMobileMenuOpen(false);
    } else {
      alert(`${item.title} section coming soon!`);
    }
  };

  const sidebarVariants = {
    open:      { width: 260 },
    collapsed: { width: 80 },
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        initial={false}
        animate={isMobileMenuOpen ? { x: 0 } : (isCollapsed ? 'collapsed' : 'open')}
        variants={sidebarVariants}
        className={`fixed lg:sticky top-0 inset-y-0 left-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-50 transform transition-transform duration-300 lg:translate-x-0 h-screen overflow-hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full w-[260px]">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              {(!isCollapsed || isMobileMenuOpen) && (
                <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
                  BasePoint
                </span>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative text-left
                    ${isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                >
                  <div className={`shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'}`}>
                    {item.icon}
                  </div>
                  {(!isCollapsed || isMobileMenuOpen) && (
                    <span className="truncate whitespace-nowrap">{item.title}</span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className={`flex items-center gap-3 p-2 rounded-xl h-14 ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border-2 border-white dark:border-zinc-800 shadow-sm shrink-0">
                AK
              </div>
              {(!isCollapsed || isMobileMenuOpen) && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">Ankush Kumar</span>
                  <span className="text-xs text-zinc-500 truncate">Ankush@basepoint.io</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
