import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown, 
  Check, 
  LogOut, 
  Menu,
  ShieldOff
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import useAppStore from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ setIsMobileMenuOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useAppStore();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roles = ['Admin', 'Viewer'];
  const isViewer = role === 'Viewer';

  return (
    <header className="h-20 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-30 px-6">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Only Badge */}
          <AnimatePresence>
            {isViewer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800/50"
              >
                <ShieldOff size={12} strokeWidth={2.5} />
                View Only
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>


          {/* Role Switcher */}
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border transition-all text-sm font-medium text-zinc-900 dark:text-zinc-100 shadow-sm
                ${isViewer
                  ? 'border-amber-300 dark:border-amber-700/60 hover:border-amber-400'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                ${isViewer
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                  : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                }`}
              >
                {role[0]}
              </div>
              <span className="hidden md:inline">{role}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isRoleDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsRoleDropdownOpen(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden py-1.5"
                  >
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Switch Role
                    </div>
                    {roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                          ${role === r 
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium' 
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${r === 'Admin' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                          {r}
                          {r === 'Viewer' && (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                              Read
                            </span>
                          )}
                        </div>
                        {role === r && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
