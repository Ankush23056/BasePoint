import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

const ICONS = {
  success: <CheckCircle size={18} className="text-emerald-500 shrink-0" />,
  error: <XCircle size={18} className="text-rose-500 shrink-0" />,
  info: <Info size={18} className="text-blue-500 shrink-0" />,
};

const BORDER_COLORS = {
  success: 'border-emerald-500/30',
  error: 'border-rose-500/30',
  info: 'border-blue-500/30',
};

const ToastItem = ({ id, type = 'success', title, message, onDismiss }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20, scale: 0.92 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, x: 60, scale: 0.92 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    className={`flex items-start gap-3 w-80 max-w-[92vw] bg-white dark:bg-zinc-900 border ${BORDER_COLORS[type]} rounded-2xl shadow-2xl shadow-black/10 p-4 pointer-events-auto`}
  >
    {ICONS[type]}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{title}</p>
      {message && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{message}</p>}
    </div>
    <button
      onClick={() => onDismiss(id)}
      className="p-0.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
    >
      <X size={14} />
    </button>
  </motion.div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'success', title, message, duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Viewport */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <ToastItem key={toast.id} {...toast} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
