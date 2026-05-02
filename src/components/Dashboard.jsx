import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  PieChart as PieIcon,
  Search,
  MoreVertical,
  IndianRupee,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector
} from 'recharts';
import AddTransactionModal from './AddTransactionModal';
import { useToast } from './Toast';
import useAppStore from '../store/useAppStore';

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

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300"
      />
    </g>
  );
};

const StatCard = ({ title, amount, icon, iconBg, iconColor, trend, trendLabel }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    }}
    whileHover={{ y: -4 }}
    className="card flex flex-col justify-between group"
  >
    <div className="flex items-center justify-between pointer-events-none">
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
        <h3 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{amount}</h3>
      </div>
      <div className={`p-3 lg:p-4 rounded-2xl ${iconBg} ${iconColor} shadow-inner`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-2 pointer-events-none">
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'}`}>
          {trend}
        </span>
        <span className="text-xs font-medium text-zinc-500">{trendLabel}</span>
      </div>
    )}
  </motion.div>
);

const TransactionItem = ({ name, category, amount, date, isPositive }) => {
  const displayDate = (() => {
    try {
      return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return date;
    }
  })();

  return (
    <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-semibold border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-all shadow-sm">
          {name[0]}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{name}</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{category} • {displayDate}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
          {isPositive ? '+' : '-'}₹{amount.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <p className="text-xs font-semibold text-zinc-500 mb-1">{payload[0].payload.name}</p>
        <p className="text-sm font-bold text-indigo-600">Balance: ₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { transactions, addTransaction, role, categoryBudgets } = useAppStore();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePieIndex, setActivePieIndex] = useState(null);

  const isViewer = role === 'Viewer';

  const stats = useMemo(() => {
    const income = transactions.reduce((acc, curr) => curr.isPositive ? acc + curr.amount : acc, 0);
    const expenses = transactions.reduce((acc, curr) => !curr.isPositive ? acc + curr.amount : acc, 0);
    const startingBalance = 10000;
    return { balance: startingBalance + income - expenses, income, expenses };
  }, [transactions]);

  const pieData = useMemo(() => {
    const categories = {};
    transactions.forEach(t => {
      if (!t.isPositive) {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(categories).map(([name, value]) => ({
      name, value, color: CATEGORY_COLORS[name] || '#94a3b8'
    }));
  }, [transactions]);

  // Per-category total spend from expense transactions
  const categorySpend = useMemo(() => {
    const acc = {};
    transactions.forEach(t => {
      if (!t.isPositive) {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
    });
    return acc;
  }, [transactions]);

  const lineData = useMemo(() => {
    const historical = [
      { name: 'Oct', value: 8500 },
      { name: 'Nov', value: 38000 },
      { name: 'Dec', value: 23500 },
      { name: 'Jan', value: 16000 },
      { name: 'Feb', value: 33000 },
    ];
    return [...historical, { name: 'Mar', value: Math.max(stats.balance, 0) }];
  }, [stats.balance]);

  const handleAdd = (newTx) => {
    addTransaction(newTx);
    showToast({
      type: 'success',
      title: 'Transaction Added!',
      message: `${newTx.name} — ₹${newTx.amount.toLocaleString('en-IN')} recorded successfully.`,
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Finance <span className="text-indigo-600 dark:text-indigo-400">Dashboard</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">Manage your money and stay organized.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm">
            <MoreVertical size={20} />
          </button>
          {!isViewer && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Transaction
            </motion.button>
          )}
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />

      {/* 3 Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Balance"
          amount={`₹${stats.balance.toLocaleString('en-IN')}`}
          icon={<IndianRupee size={22} />}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
          trend="+4.2%"
          trendLabel="from last month"
        />
        <StatCard
          title="Total Income"
          amount={`₹${stats.income.toLocaleString('en-IN')}`}
          icon={<TrendingUp size={22} />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend="+12.5%"
          trendLabel="from last month"
        />
        <StatCard
          title="Total Expenses"
          amount={`₹${stats.expenses.toLocaleString('en-IN')}`}
          icon={<TrendingDown size={22} />}
          iconBg="bg-rose-50 dark:bg-rose-900/20"
          iconColor="text-rose-600 dark:text-rose-400"
          trend="-1.2%"
          trendLabel="from last month"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Trend */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="card lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Balance Trend</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Equity over the last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-600 rounded-sm" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Balance</span>
            </div>
          </div>
          <div className="flex-1 w-full h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" dot={{ r: 5, fill: '#4F46E5', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 7, fill: '#4F46E5', strokeWidth: 3, stroke: '#ffffff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Spending Category Donut Chart */}
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="card flex flex-col">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-8">Spending by Category</h3>

          {pieData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[250px]">
              <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <PieIcon size={36} className="text-zinc-300 dark:text-zinc-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No Expense Data</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Add expense transactions to see spending categories.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 w-full flex items-center justify-center relative min-h-[250px] sm:min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData} cx="50%" cy="50%"
                      innerRadius="65%" outerRadius="90%"
                      paddingAngle={5} dataKey="value"
                      activeIndex={activePieIndex} activeShape={renderActiveShape}
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(null)}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none', cursor: 'pointer' }} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                  <div className="text-center transition-all">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest opacity-80">
                      {activePieIndex !== null ? pieData[activePieIndex]?.name : 'Overall'}
                    </p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                      ₹{activePieIndex !== null ? pieData[activePieIndex]?.value.toLocaleString('en-IN') : stats.expenses.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-4 mt-6">
                {pieData.map((item, idx) => (
                  <div
                    key={item.name}
                    className={`flex items-center gap-2 cursor-pointer transition-opacity duration-200 ${activePieIndex !== null && activePieIndex !== idx ? 'opacity-30' : 'opacity-100 hover:opacity-80'}`}
                    onMouseEnter={() => setActivePieIndex(idx)}
                    onMouseLeave={() => setActivePieIndex(null)}
                  >
                    <div className="w-3 h-3 rounded-md shadow-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 capitalize truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ── Budget Guardrails ───────────────────────────────── */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldAlert size={20} className="text-indigo-500" />
              Budget Guardrails
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Monthly spend vs. your set limit</p>
          </div>
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">This Month</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Object.entries(categoryBudgets)
            .filter(([, budget]) => budget > 0)
            .map(([category, budget]) => {
              const spent = categorySpend[category] || 0;
              const pct = budget > 0 ? (spent / budget) * 100 : 0;
              const clampedPct = Math.min(pct, 100);
              const pctRounded = Math.round(pct);

              // Conditional colour logic — spec: 100%+ Danger, 80%+ Warning, else Safe
              let barColor, bgColor, pctColor;
              if (pct >= 100) {
                barColor = 'bg-red-600 animate-pulse';
                bgColor = 'bg-red-50 dark:bg-red-900/20';
                pctColor = 'text-red-500 dark:text-red-400';
              } else if (pct >= 80) {
                barColor = 'bg-orange-500';
                bgColor = 'bg-orange-50 dark:bg-orange-900/20';
                pctColor = 'text-orange-500 dark:text-orange-400';
              } else {
                barColor = 'bg-emerald-500';
                bgColor = 'bg-emerald-50 dark:bg-emerald-900/20';
                pctColor = 'text-emerald-600 dark:text-emerald-400';
              }

              return (
                <div
                  key={category}
                  className={`p-4 rounded-2xl border border-transparent ${bgColor} transition-all hover:shadow-md group`}
                >
                  {/* Header row — category name + percentage badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{category}</span>
                    <span className={`text-xs font-bold tabular-nums ${pctColor}`}>
                      {pctRounded}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${clampedPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      className={`h-full ${barColor} transition-all duration-500`}
                    />
                  </div>

                  {/* Spent / Limit labels */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                      Spent: ₹{spent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                      Limit: ₹{budget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Over-budget warning */}
                  {pct >= 100 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider"
                    >
                      ⚠ Over by ₹{(spent - budget).toLocaleString('en-IN')}
                    </motion.p>
                  )}
                </div>
              );
            })}
        </div>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Recent Transactions</h3>
            <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline underline-offset-4">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <ArrowRight size={28} className="text-zinc-300 dark:text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">No transactions yet. Add one to get started.</p>
              </div>
            ) : (
              transactions.slice(0, 5).map(tx => (
                <TransactionItem key={tx.id} {...tx} />
              ))
            )}
          </div>
        </motion.div>

        {/* Insights Section */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="card space-y-8">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Insights</h3>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <PieIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Top Spending Category</p>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {pieData.length > 0
                    ? `${[...pieData].sort((a, b) => b.value - a.value)[0].name} — ₹${[...pieData].sort((a, b) => b.value - a.value)[0].value.toLocaleString('en-IN')}`
                    : 'None'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Monthly Spending</p>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">₹{stats.expenses.toLocaleString('en-IN')} this month</h4>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Search size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Balance Status</p>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {stats.balance > 10000 ? 'Positive Growth' : 'Spending exceeds income'}
                </h4>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-600 rounded-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-white font-bold">Pro Savings Goal</h4>
              <p className="text-indigo-100 text-xs mt-1">Goal: ₹20,000</p>
              <p className="text-white text-lg font-bold mt-2">₹{stats.balance.toLocaleString('en-IN')}</p>
              <div className="w-full h-1.5 bg-indigo-400/50 rounded-full mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stats.balance / 20000) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={64} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
