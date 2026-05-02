import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  User, Mail, Palette, Sun, Moon, Trash2, RotateCcw,
  Shield, Info, ChevronRight, Check, AlertTriangle,
  Bell, BellOff, CreditCard, Globe, Lock,
  Target, X, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import useAppStore from '../store/useAppStore';
import { useToast } from './Toast';

const INITIAL_TRANSACTIONS = [
  { id: 1, name: 'Water Bill', description: 'Monthly water supply bill', category: 'Bills', amount: 42.00, date: '2026-03-30', type: 'Expense', isPositive: false },
  { id: 2, name: 'Bus Pass', description: 'Monthly transit pass renewal', category: 'Transport', amount: 45.00, date: '2026-03-28', type: 'Expense', isPositive: false },
  { id: 3, name: 'Pharmacy', description: 'Prescription medicine purchase', category: 'Healthcare', amount: 32.50, date: '2026-03-27', type: 'Expense', isPositive: false },
  { id: 4, name: 'Freelance Bonus', description: 'UI design project payment', category: 'Freelance', amount: 500.00, date: '2026-03-25', type: 'Income', isPositive: true },
  { id: 5, name: 'Clothing Store', description: 'Spring wardrobe haul', category: 'Shopping', amount: 210.00, date: '2026-03-24', type: 'Expense', isPositive: false },
  { id: 6, name: 'Grocery Run', description: 'Weekly groceries from DMart', category: 'Food', amount: 1850.00, date: '2026-03-22', type: 'Expense', isPositive: false },
  { id: 7, name: 'Salary Credit', description: 'March monthly salary', category: 'Freelance', amount: 45000.00, date: '2026-03-01', type: 'Income', isPositive: true },
  { id: 8, name: 'Netflix', description: 'Monthly streaming subscription', category: 'Entertainment', amount: 649.00, date: '2026-03-15', type: 'Expense', isPositive: false },
];

/* ── Section wrapper ───────────────────────────────────────────── */
const Section = ({ title, description, icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="card space-y-6"
  >
    <div className="flex items-start gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{title}</h3>
        {description && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>}
      </div>
    </div>
    {children}
  </motion.div>
);

/* ── Row item ──────────────────────────────────────────────────── */
const SettingRow = ({ label, sublabel, children }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{label}</p>
      {sublabel && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sublabel}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

/* ── Toggle switch ─────────────────────────────────────────────── */
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
    }`}
  >
    <motion.div
      animate={{ x: enabled ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
    />
  </button>
);

/* ── Danger confirm dialog ─────────────────────────────────────── */
const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmLabel = 'Confirm', variant = 'danger' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
  >
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <motion.div
      initial={{ scale: 0.92, y: 16 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.92, y: 16 }}
      className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-sm"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
        variant === 'danger' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
      }`}>
        <AlertTriangle className={variant === 'danger' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'} size={22} />
      </div>
      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">{message}</p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${
            variant === 'danger'
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-amber-500 hover:bg-amber-600'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ── Main Settings page ────────────────────────────────────────── */
const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole, transactions, addTransaction, deleteTransaction, categoryBudgets, setCategoryBudget, resetBudgets } = useAppStore();
  const { showToast } = useToast();

  // Budget modal state
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [tempBudgets, setTempBudgets] = useState({});

  // Profile state
  const [profileName, setProfileName] = useState('Ankush Kumar');
  const [profileEmail, setProfileEmail] = useState('Ankush@basepoint.io');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [tempEmail, setTempEmail] = useState(profileEmail);

  // Notification prefs
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [spendingAlerts, setSpendingAlerts] = useState(true);

  // Dialogs
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const saveProfile = () => {
    if (!tempName.trim()) return;
    setProfileName(tempName.trim());
    setProfileEmail(tempEmail.trim());
    setIsEditingProfile(false);
    showToast({ type: 'success', title: 'Profile Updated', message: 'Your profile changes have been saved.' });
  };

  const handleClearAll = () => {
    transactions.forEach(tx => deleteTransaction(tx.id));
    setShowClearDialog(false);
    showToast({ type: 'info', title: 'Data Cleared', message: 'All transactions have been removed.' });
  };

  const handleResetData = () => {
    transactions.forEach(tx => deleteTransaction(tx.id));
    INITIAL_TRANSACTIONS.forEach(tx => addTransaction(tx));
    setShowResetDialog(false);
    showToast({ type: 'success', title: 'Data Reset', message: 'Transactions restored to default sample data.' });
  };

  const openBudgetModal = () => {
    setTempBudgets({ ...categoryBudgets });
    setShowBudgetModal(true);
  };

  const saveBudgets = () => {
    Object.entries(tempBudgets).forEach(([cat, val]) => {
      const num = parseFloat(val);
      if (!isNaN(num) && num >= 0) setCategoryBudget(cat, num);
    });
    setShowBudgetModal(false);
    showToast({ type: 'success', title: 'Budgets Saved', message: 'Your monthly category budgets have been updated.' });
  };

  const handleResetBudgets = () => {
    resetBudgets();
    setTempBudgets({});
    setShowBudgetModal(false);
    showToast({ type: 'info', title: 'Budgets Reset', message: 'Category budgets restored to default values.' });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 pb-12 max-w-3xl"
      >
        {/* Page header */}
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Account <span className="text-indigo-600 dark:text-indigo-400">Settings</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
            Manage your profile, preferences, and data.
          </p>
        </div>

        {/* ── Budget Guardrails ── */}
        <Section delay={0.03} icon={<ShieldAlert size={18} />} title="Budget Guardrails" description="Set monthly spending limits for each category.">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {Object.entries(categoryBudgets)
              .filter(([, b]) => b > 0)
              .map(([cat, budget]) => (
                <div key={cat} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">{cat}</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">₹{Number(budget).toLocaleString('en-IN')}/mo</p>
                </div>
              ))
            }
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={openBudgetModal}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Target size={16} /> Edit Budgets
          </motion.button>
        </Section>

        {/* ── Profile ── */}
        <Section delay={0.05} icon={<User size={18} />} title="Profile" description="Your personal information displayed in the app.">
          <AnimatePresence mode="wait">
            {isEditingProfile ? (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl py-2.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={e => setTempEmail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl py-2.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={saveProfile} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
                    <Check size={15} /> Save Changes
                  </button>
                  <button onClick={() => { setIsEditingProfile(false); setTempName(profileName); setTempEmail(profileEmail); }}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xl border-2 border-white dark:border-zinc-800 shadow-md shrink-0">
                    {profileName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-base">{profileName}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} />{profileEmail}
                    </p>
                  </div>
                </div>
                <SettingRow label="Current Role" sublabel="Switch roles from the header dropdown">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                    role === 'Admin'
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                    <Shield size={11} /> {role}
                  </span>
                </SettingRow>
                <button
                  onClick={() => { setIsEditingProfile(true); setTempName(profileName); setTempEmail(profileEmail); }}
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 transition-all"
                >
                  Edit Profile <ChevronRight size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ── Appearance ── */}
        <Section delay={0.1} icon={<Palette size={18} />} title="Appearance" description="Customize how BasePoint looks on your device.">
          <SettingRow
            label="Dark Mode"
            sublabel={`Currently using ${theme === 'dark' ? 'dark' : 'light'} theme`}
          >
            <div className="flex items-center gap-3">
              <Sun size={16} className="text-amber-500 shrink-0" />
              <Toggle enabled={theme === 'dark'} onChange={() => toggleTheme()} />
              <Moon size={16} className="text-indigo-400 shrink-0" />
            </div>
          </SettingRow>
          <SettingRow
            label="Currency Display"
            sublabel="Symbol shown across the dashboard"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm font-bold text-zinc-700 dark:text-zinc-300">
              <Globe size={13} /> ₹ INR
            </span>
          </SettingRow>
        </Section>

        {/* ── Notifications ── */}
        <Section delay={0.15} icon={<Bell size={18} />} title="Notifications" description="Control what alerts and updates you receive.">
          <div className="space-y-5">
            <SettingRow label="Push Notifications" sublabel="In-app toast alerts for new transactions">
              <Toggle enabled={notifEnabled} onChange={setNotifEnabled} />
            </SettingRow>
            <SettingRow label="Spending Alerts" sublabel="Alert when expenses exceed income">
              <Toggle enabled={spendingAlerts} onChange={setSpendingAlerts} />
            </SettingRow>
            <SettingRow label="Weekly Email Digest" sublabel="Receive a weekly spending summary">
              <Toggle enabled={emailDigest} onChange={setEmailDigest} />
            </SettingRow>
          </div>
          {!notifEnabled && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5 rounded-xl">
              <BellOff size={13} /> All notifications are currently disabled
            </motion.div>
          )}
        </Section>

        {/* ── Security ── */}
        <Section delay={0.2} icon={<Lock size={18} />} title="Security & Access" description="Manage access roles and session preferences.">
          <SettingRow label="Admin Role" sublabel="Full access: add, edit, delete transactions">
            <button
              onClick={() => { setRole('Admin'); showToast({ type: 'success', title: 'Role Changed', message: 'You are now in Admin mode.' }); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                role === 'Admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-indigo-400 dark:hover:border-indigo-700'
              }`}
            >
              {role === 'Admin' && <Check size={12} className="inline mr-1" />} Admin
            </button>
          </SettingRow>
          <SettingRow label="Viewer Role" sublabel="Read-only: view transactions without editing">
            <button
              onClick={() => { setRole('Viewer'); showToast({ type: 'info', title: 'Role Changed', message: 'Switched to View Only mode.' }); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                role === 'Viewer'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                  : 'border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-amber-400 dark:hover:border-amber-700'
              }`}
            >
              {role === 'Viewer' && <Check size={12} className="inline mr-1" />} Viewer
            </button>
          </SettingRow>
        </Section>

        {/* ── Data Management ── */}
        <Section delay={0.25} icon={<CreditCard size={18} />} title="Data Management" description="Manage your transaction history and app data.">
          <div className="space-y-5">
            <SettingRow
              label="Total Transactions"
              sublabel="Records currently stored in the app"
            >
              <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                {transactions.length}
              </span>
            </SettingRow>

            <SettingRow
              label="Reset to Sample Data"
              sublabel="Restore the original 8 demo transactions"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowResetDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
              >
                <RotateCcw size={14} /> Reset
              </motion.button>
            </SettingRow>

            <SettingRow
              label="Clear All Transactions"
              sublabel="Permanently delete all transaction records"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowClearDialog(true)}
                disabled={transactions.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} /> Clear All
              </motion.button>
            </SettingRow>
          </div>
        </Section>

        {/* ── About ── */}
        <Section delay={0.3} icon={<Info size={18} />} title="About BasePoint" description="Application information and credits.">
          <div className="space-y-4">
            {[
              { label: 'App Name', value: 'BasePoint' },
              { label: 'Version', value: '1.0.0' },
              { label: 'Built with', value: 'React 19 + Vite + Tailwind CSS v4' },
              { label: 'Charts', value: 'Recharts v3' },
              { label: 'Animations', value: 'Framer Motion v12' },
              { label: 'State', value: 'Zustand v5 + Persist' },
            ].map(({ label, value }) => (
              <SettingRow key={label} label={label}>
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 text-right max-w-[200px] truncate">{value}</span>
              </SettingRow>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* ── Dialogs ── */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {showClearDialog && (
          <ConfirmDialog
            title="Clear All Transactions?"
            message="This will permanently delete all your transaction records. This action cannot be undone."
            confirmLabel="Yes, Clear All"
            variant="danger"
            onConfirm={handleClearAll}
            onCancel={() => setShowClearDialog(false)}
          />
        )}
        {showResetDialog && (
          <ConfirmDialog
            title="Reset to Sample Data?"
            message="This will remove all current transactions and restore the 8 original demo records."
            confirmLabel="Yes, Reset"
            variant="warning"
            onConfirm={handleResetData}
            onCancel={() => setShowResetDialog(false)}
          />
        )}

        {/* ── Edit Budget Modal ── */}
        {showBudgetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBudgetModal(false)} />
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Target size={20} className="text-indigo-500" /> Edit Monthly Budgets
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Set ₹0 to hide a category from the dashboard.</p>
                </div>
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Budget input grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {Object.keys(tempBudgets).map(cat => (
                  <div key={cat}>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">{cat}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">₹</span>
                      <input
                        id={`budget-${cat}`}
                        type="number"
                        min="0"
                        step="100"
                        value={tempBudgets[cat]}
                        onChange={e => setTempBudgets(prev => ({ ...prev, [cat]: e.target.value }))}
                        className="w-full pl-7 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={saveBudgets}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
                >
                  <Check size={16} /> Save Budgets
                </motion.button>
                <button
                  onClick={handleResetBudgets}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-amber-400 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                >
                  <RotateCcw size={14} /> Defaults
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Settings;
