import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Trash2, Plus, FileX, Edit3,
  TrendingUp, TrendingDown, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';
import useAppStore from '../store/useAppStore';
import AddTransactionModal from './AddTransactionModal';

const CATEGORY_COLORS = {
  Bills: '#4F46E5',
  Food: '#10B981',
  Shopping: '#8B5CF6',
  Entertainment: '#F59E0B',
  Healthcare: '#EF4444',
  Other: '#ab19a4ff',
  Transport: '#06B6D4',
  Freelance: '#F472B6',
};

const CategoryBadge = ({ category }) => {
  const color = CATEGORY_COLORS[category] || '#94a3b8';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {category}
    </span>
  );
};

const EmptyState = ({ isFiltered }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <td colSpan={6}>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <FileX size={36} className="text-zinc-400 dark:text-zinc-600" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {isFiltered ? 'No Results Found' : 'No Transactions Yet'}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
            {isFiltered
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'Add your first transaction to get started tracking your finances.'}
          </p>
        </div>
      </div>
    </td>
  </motion.tr>
);

const TransactionRow = ({ tx, onDelete, canEdit }) => {
  const formattedDate = new Date(tx.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
    >
      {/* Date */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg">
          {formattedDate}
        </span>
      </td>

      {/* Description */}
      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[180px]">{tx.name}</p>
          {tx.description && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate max-w-[180px]">{tx.description}</p>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="px-5 py-4">
        <CategoryBadge category={tx.category} />
      </td>

      {/* Amount */}
      <td className="px-5 py-4 text-right whitespace-nowrap">
        <span className={`text-sm font-bold tabular-nums ${tx.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {tx.isPositive ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </td>

      {/* Type */}
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
          tx.isPositive
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
            : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
        }`}>
          {tx.isPositive
            ? <TrendingUp size={11} strokeWidth={2.5} />
            : <TrendingDown size={11} strokeWidth={2.5} />
          }
          {tx.type}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        {canEdit ? (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {}}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              title="Edit transaction"
            >
              <Edit3 size={14} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(tx.id)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              title="Delete transaction"
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
        ) : (
          <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">—</span>
        )}
      </td>
    </motion.tr>
  );
};

const Transactions = () => {
  const { transactions, deleteTransaction, addTransaction, role } = useAppStore();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const isViewer = role === 'Viewer';

  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map(t => t.category))].sort();
    return ['All', ...cats];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = !searchQuery ||
        tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;
      const matchesType = selectedType === 'All' ||
        (selectedType === 'Income' && tx.isPositive) ||
        (selectedType === 'Expense' && !tx.isPositive);
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType]);

  const stats = useMemo(() => ({
    total: filteredTransactions.length,
    income: filteredTransactions.filter(t => t.isPositive).reduce((a, t) => a + t.amount, 0),
    expense: filteredTransactions.filter(t => !t.isPositive).reduce((a, t) => a + t.amount, 0),
  }), [filteredTransactions]);

  const isFiltered = searchQuery || selectedCategory !== 'All' || selectedType !== 'All';

  const handleAdd = (tx) => {
    addTransaction(tx);
    setIsModalOpen(false);
    showToast({
      type: 'success',
      title: 'Transaction Added',
      message: `${tx.name} — ₹${tx.amount.toLocaleString()} recorded successfully.`,
    });
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    showToast({ type: 'info', title: 'Transaction Removed', message: 'The entry has been deleted.' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('All');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-10"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            All <span className="text-indigo-600 dark:text-indigo-400">Transactions</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
            {stats.total} record{stats.total !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isViewer && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Transaction
            </motion.button>
          )}
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Showing', value: stats.total, suffix: 'entries', color: 'text-zinc-900 dark:text-zinc-100', bg: 'bg-zinc-100 dark:bg-zinc-800' },
          { label: 'Income', value: `₹${stats.income.toLocaleString('en-IN')}`, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Expenses', value: `₹${stats.expense.toLocaleString('en-IN')}`, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl px-5 py-4`}>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}{s.suffix ? <span className="text-sm font-semibold ml-1.5">{s.suffix}</span> : ''}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            id="tx-search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by description..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all dark:text-zinc-200 outline-none"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            id="category-filter"
            onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsTypeOpen(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-700 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all min-w-[150px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-zinc-400" />
              {selectedCategory}
            </div>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isCategoryOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 py-1.5 overflow-hidden"
                >
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left ${
                        selectedCategory === cat
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {cat !== 'All' && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat] || '#94a3b8' }} />
                      )}
                      {cat}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <button
            id="type-filter"
            onClick={() => { setIsTypeOpen(!isTypeOpen); setIsCategoryOpen(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-700 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all min-w-[130px] justify-between"
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-zinc-400" />
              {selectedType}
            </div>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isTypeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsTypeOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 py-1.5 overflow-hidden"
                >
                  {['All', 'Income', 'Expense'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setSelectedType(t); setIsTypeOpen(false); }}
                      className={`w-full px-4 py-2 text-sm transition-colors text-left ${
                        selectedType === t
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Clear filters */}
        <AnimatePresence>
          {isFiltered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-500 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors whitespace-nowrap"
            >
              Clear All
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40">
                {['Date', 'Description', 'Category', 'Amount', 'Type', isViewer ? '' : 'Actions'].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredTransactions.length === 0 ? (
                  <EmptyState key="empty" isFiltered={!!isFiltered} />
                ) : (
                  filteredTransactions.map(tx => (
                    <TransactionRow
                      key={tx.id}
                      tx={tx}
                      onDelete={handleDelete}
                      canEdit={!isViewer}
                    />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredTransactions.length > 0 && (
          <div className="px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Showing <span className="font-bold text-zinc-700 dark:text-zinc-300">{filteredTransactions.length}</span> of <span className="font-bold text-zinc-700 dark:text-zinc-300">{transactions.length}</span> transactions
            </p>
            {isViewer && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-lg uppercase tracking-wide">
                View Only Mode
              </span>
            )}
          </div>
        )}
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />
    </motion.div>
  );
};

export default Transactions;
