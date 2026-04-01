import React, { useState, useEffect } from 'react';
import { 
  X, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownCircle, 
  Plus,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { name: 'Bills', color: '#4F46E5' },
  { name: 'Food', color: '#10B981' },
  { name: 'Shopping', color: '#8B5CF6' },
  { name: 'Entertainment', color: '#F59E0B' },
  { name: 'Healthcare', color: '#EF4444' },
  { name: 'Other', color: '#ab19a4ff' },
];

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [type, setType] = useState('Expense');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay for premium feel
    setTimeout(() => {
      onAdd({
        id: Date.now(),
        name: `${category} Transaction`,
        category,
        amount: parseFloat(amount),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type,
        isPositive: type === 'Income'
      });
      setAmount('');
      setCategory('Bills');
      setType('Expense');
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
               <div>
                 <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Add Transaction</h3>
                 <p className="text-xs text-zinc-500 mt-1 font-medium italic">Record your newest activity.</p>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                 <X size={20} className="text-zinc-500" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Type Switcher */}
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                 <button 
                   type="button"
                   onClick={() => setType('Expense')}
                   className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'Expense' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-md' : 'text-zinc-500'}`}
                 >
                   Expense
                 </button>
                 <button 
                   type="button"
                   onClick={() => setType('Income')}
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
                    type="number" 
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Category Grid */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Category</label>
                 <div className="grid grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                          ${category === cat.name 
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                            : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                          }
                        `}
                      >
                         <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                         <span className={`text-[10px] font-bold uppercase tracking-tight ${category === cat.name ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-500'}`}>
                           {cat.name}
                         </span>
                         {category === cat.name && (
                           <div className="absolute top-2 right-2 text-indigo-600">
                             <Check size={12} strokeWidth={3} />
                           </div>
                         )}
                      </button>
                    ))}
                 </div>
              </div>

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
    </AnimatePresence>
  );
};

export default AddTransactionModal;
