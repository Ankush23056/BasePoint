import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import useAppStore from '../store/useAppStore';
import { 
  X, 
  IndianRupee, 
  Plus,
  Check,
  AlignLeft,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPENSE_CATEGORIES = [
  { name: 'Bills',         color: '#4F46E5' },
  { name: 'Food',          color: '#10B981' },
  { name: 'Shopping',      color: '#8B5CF6' },
  { name: 'Entertainment', color: '#F59E0B' },
  { name: 'Healthcare',    color: '#EF4444' },
  { name: 'Transport',     color: '#06B6D4' },
  { name: 'Savings',       color: '#3B82F6' },
  { name: 'Investment',    color: '#6366F1' },
  { name: 'Other',         color: '#ab19a4' },
];

const INCOME_CATEGORIES = [
  { name: 'Salary',        color: '#22C55E' },
  { name: 'Stipend',       color: '#14B8A6' },
  { name: 'Loan',          color: '#F59E0B' },
  { name: 'Returned',      color: '#3B82F6' },
  { name: 'Others',        color: '#A855F7' },
];

const GOAL_CATEGORIES = ['Savings', 'Investment'];

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const { goals, contributeToGoal } = useAppStore();

  const [amount,        setAmount]        = useState('');
  const [description,   setDescription]   = useState('');
  const [category,      setCategory]      = useState('Bills');
  const [type,          setType]          = useState('Expense');
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState('');

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setCategory('Bills');
    setType('Expense');
    setSelectedGoalId('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);

    // Simulate brief API delay for premium feel
    setTimeout(() => {
      const name = description.trim() || `${category} Transaction`;
      const parsedAmount = parseFloat(amount);
      onAdd({
        id: Date.now(),
        name,
        description: description.trim(),
        category,
        amount: parsedAmount,
        date: new Date().toISOString().split('T')[0],
        type,
        isPositive: type === 'Income',
        goalId: selectedGoalId || null,
      });
      // Auto-contribute to linked goal
      if (selectedGoalId && GOAL_CATEGORIES.includes(category)) {
        contributeToGoal(selectedGoalId, parsedAmount);
      }
      setAmount('');
      setDescription('');
      setCategory('Bills');
      setType('Expense');
      setSelectedGoalId('');
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Add Transaction</h3>
                <p className="text-xs text-zinc-500 mt-1 font-medium italic">Record your newest activity.</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Type Switcher */}
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => {
                    setType('Expense');
                    setCategory('Bills');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'Expense' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-md' : 'text-zinc-500'}`}
                >
                  Expense
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setType('Income');
                    setCategory('Salary');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'Income' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500'}`}
                >
                  Income
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Amount (Rupees)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                    <IndianRupee size={20} />
                  </div>
                  <input 
                    type="number" step="0.01" min="0.01" required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Description</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                    <AlignLeft size={18} />
                  </div>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Monthly rent, Grocery run…"
                    maxLength={80}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Category Grid */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {(type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`relative p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 group
                        ${category === cat.name 
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                          : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                        }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                      <span className={`text-[9px] font-bold uppercase tracking-tight leading-none text-center ${category === cat.name ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-500'}`}>
                        {cat.name}
                      </span>
                      {category === cat.name && (
                        <div className="absolute top-1.5 right-1.5 text-indigo-600">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Selector — shown only for Savings / Investment */}
              <AnimatePresence>
                {GOAL_CATEGORIES.includes(category) && goals.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                      🎯 Link to Goal <span className="font-normal normal-case">(optional)</span>
                    </label>
                    <select
                      value={selectedGoalId}
                      onChange={e => setSelectedGoalId(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                    >
                      <option value="">— No goal —</option>
                      {goals.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.emoji} {g.name} (₹{g.currentAmount.toLocaleString('en-IN')} / ₹{g.targetAmount.toLocaleString('en-IN')})
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg font-bold shadow-xl shadow-indigo-600/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Plus size={22} strokeWidth={3} />
                    Confirm Transaction
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddTransactionModal;
