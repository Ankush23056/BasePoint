import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Lightbulb,
  Wallet,
  AlertCircle,
  BarChart2,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAppStore from '../store/useAppStore';

const CATEGORY_COLORS = {
  Bills: '#4F46E5',
  Food: '#10B981',
  Shopping: '#8B5CF6',
  Entertainment: '#F59E0B',
  Healthcare: '#EF4444',
  Other: '#ab19a4',
  Transport: '#06B6D4',
  Savings: '#3B82F6',
  Investment: '#6366F1',
  Salary: '#22C55E',
  Stipend: '#14B8A6',
  Loan: '#F59E0B',
  Returned: '#3B82F6',
  Others: '#A855F7',
};

/* ── Animated savings ring ─────────────────────────────────────── */
const SavingsRing = ({ rate }) => {
  const clamped = Math.min(Math.max(rate, 0), 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;
  const isGood = clamped >= 20;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor"
          strokeWidth="10" className="text-zinc-100 dark:text-zinc-800" />
        <motion.circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={isGood ? '#10B981' : '#F59E0B'}
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-black tabular-nums ${isGood ? 'text-emerald-600' : 'text-amber-500'}`}>
          {rate > 0 ? `${clamped.toFixed(0)}%` : '—'}
        </span>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
          Saved
        </span>
      </div>
    </div>
  );
};

/* ── Category progress bar ─────────────────────────────────────── */
const CategoryBar = ({ name, value, total, color, index }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-md shrink-0" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{name}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            ₹{value.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-zinc-400 ml-1.5">({pct.toFixed(0)}%)</span>
        </div>
      </div>
      <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
};

/* ── Insight card ──────────────────────────────────────────────── */
const InsightCard = ({ icon, label, value, sub, iconBg, iconColor, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -3 }}
    className="card flex items-start gap-4 group"
  >
    <div className={`p-3 rounded-xl shrink-0 ${iconBg} ${iconColor} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
      <h4 className="text-base font-black text-zinc-900 dark:text-zinc-100 mt-0.5 leading-tight">{value}</h4>
      {sub && <p className="text-xs text-zinc-400 mt-1 leading-snug">{sub}</p>}
    </div>
  </motion.div>
);

/* ── Empty state ───────────────────────────────────────────────── */
const InsightsEmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-24 gap-5"
  >
    <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
      <BarChart2 size={42} className="text-indigo-400" />
    </div>
    <div className="text-center max-w-xs">
      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Data to Analyse</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
        Add some transactions to your account and insights will automatically appear here.
      </p>
    </div>
  </motion.div>
);

/* ── Main Insights page ────────────────────────────────────────── */
const Insights = () => {
  const { transactions } = useAppStore();

  const { income, expenses, savingsRate, topCategory, topCategoryValue, monthlyObs, categoryBreakdown } =
    useMemo(() => {
      const inc = transactions.reduce((a, t) => (t.isPositive ? a + t.amount : a), 0);
      const exp = transactions.reduce((a, t) => (!t.isPositive ? a + t.amount : a), 0);
      const rate = inc > 0 ? ((inc - exp) / inc) * 100 : 0;

      // Category breakdown (expenses only)
      const cats = {};
      transactions.forEach((t) => {
        if (!t.isPositive) {
          cats[t.category] = (cats[t.category] || 0) + t.amount;
        }
      });

      const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
      const top = sorted[0];

      // Monthly observation
      let obs = null;
      if (top && exp > 0) {
        const pct = ((top[1] / exp) * 100).toFixed(0);
        obs = `"${top[0]}" accounts for ${pct}% of your total spending this period.`;
      } else if (inc > 0 && exp === 0) {
        obs = 'Great job! You have recorded income but no expenses yet.';
      }

      return {
        income: inc,
        expenses: exp,
        savingsRate: rate,
        topCategory: top ? top[0] : null,
        topCategoryValue: top ? top[1] : 0,
        monthlyObs: obs,
        categoryBreakdown: sorted,
      };
    }, [transactions]);

  const hasData = transactions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-10"
    >
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Financial <span className="text-indigo-600 dark:text-indigo-400">Insights</span>
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
          Auto-generated analysis of your spending patterns.
        </p>
      </div>

      {!hasData ? (
        <InsightsEmptyState />
      ) : (
        <>
          {/* Top insight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InsightCard
              delay={0}
              icon={<PieChart size={20} />}
              label="Highest Spending Category"
              value={topCategory ? `${topCategory}` : 'N/A'}
              sub={topCategory ? `₹${topCategoryValue.toLocaleString('en-IN')} spent in this category` : 'No expense data yet'}
              iconBg="bg-purple-50 dark:bg-purple-900/20"
              iconColor="text-purple-600 dark:text-purple-400"
            />
            <InsightCard
              delay={0.07}
              icon={<TrendingUp size={20} />}
              label="Total Income"
              value={`₹${income.toLocaleString('en-IN')}`}
              sub="Combined income transactions"
              iconBg="bg-emerald-50 dark:bg-emerald-900/20"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <InsightCard
              delay={0.14}
              icon={<TrendingDown size={20} />}
              label="Total Expenses"
              value={`₹${expenses.toLocaleString('en-IN')}`}
              sub="Combined expense transactions"
              iconBg="bg-rose-50 dark:bg-rose-900/20"
              iconColor="text-rose-600 dark:text-rose-400"
            />
          </div>

          {/* Monthly Observation Banner */}
          {monthlyObs && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl"
            >
              <div className="p-2.5 bg-indigo-600 rounded-xl text-white shrink-0 mt-0.5">
                <Lightbulb size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                  Monthly Observation
                </p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {monthlyObs}
                </p>
              </div>
            </motion.div>
          )}

          {/* Two-column layout: Savings Ring + Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Savings Rate Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="card lg:col-span-2 flex flex-col items-center justify-center gap-6"
            >
              <div className="text-center">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Savings Rate</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  How much of your income you kept
                </p>
              </div>
              <SavingsRing rate={savingsRate} />
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Income</p>
                  <p className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                    ₹{income.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Expenses</p>
                  <p className="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">
                    ₹{expenses.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              {savingsRate < 0 && (
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl w-full justify-center">
                  <AlertCircle size={13} />
                  Expenses exceed income this period
                </div>
              )}
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card lg:col-span-3"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Spending Breakdown
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    By category, highest first
                  </p>
                </div>
              </div>

              {categoryBreakdown.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Wallet size={36} className="text-zinc-300 dark:text-zinc-700" />
                  <p className="text-sm text-zinc-500 text-center">No expense categories to show yet.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {categoryBreakdown.map(([name, value], idx) => (
                    <CategoryBar
                      key={name}
                      name={name}
                      value={value}
                      total={expenses}
                      color={CATEGORY_COLORS[name] || '#94a3b8'}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Insights;
