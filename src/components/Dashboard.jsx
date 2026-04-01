import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  PieChart as PieIcon,
  Search,
  MoreVertical,
  IndianRupee
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const lineData = [
  { name: 'Oct', value: 12500 },
  { name: 'Nov', value: 13200 },
  { name: 'Dec', value: 12800 },
  { name: 'Jan', value: 14200 },
  { name: 'Feb', value: 15300 },
  { name: 'Mar', value: 16800 },
];

const pieData = [
  { name: 'Bills', value: 45, color: '#4F46E5' },
  { name: 'Food', value: 25, color: '#10B981' },
  { name: 'Shopping', value: 15, color: '#8B5CF6' },
  { name: 'Entertainment', value: 10, color: '#F59E0B' },
  { name: 'Healthcare', value: 5, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#ab19a4ff' },
];

const StatCard = ({ title, amount, icon, iconBg, iconColor, trendIcon, trendColor }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="card flex items-center justify-between group"
  >
    <div className="space-y-1">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{amount}</h3>
    </div>
    <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} shadow-inner`}>
      {icon}
    </div>
  </motion.div>
);

const TransactionItem = ({ name, category, amount, date, isPositive }) => (
  <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-semibold border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-all shadow-sm">
        {name[0]}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{name}</h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{category} • {date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {isPositive ? '+' : '-'}₹{amount}
      </p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <p className="text-xs font-semibold text-zinc-500 mb-1">{payload[0].payload.name}</p>
        <p className="text-sm font-bold text-indigo-600">Balance: ₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
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
          <button 
            onClick={() => alert('Add Transaction Modal coming soon!')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* 3 Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Balance"
          amount="₹10,353.54"
          icon={<IndianRupee size={20} />}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Total Income"
          amount="₹13,520.00"
          icon={<TrendingUp size={20} />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Total Expenses"
          amount="₹3,166.46"
          icon={<TrendingDown size={20} />}
          iconBg="bg-rose-50 dark:bg-rose-900/20"
          iconColor="text-rose-600 dark:text-rose-400"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Trend Line Chart */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Balance Trend</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-600 rounded-full" />
              <span className="text-xs font-semibold text-zinc-500">Income Stream</span>
            </div>
          </div>
          <div className="flex-1 w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Category Donut Chart */}
        <div className="card flex flex-col">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-8">Spending by Category</h3>
          <div className="flex-1 w-full flex items-center justify-center relative min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
              <div className="text-center">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest opacity-80">Overall</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">₹3,166</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 capitalize">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Recent Transactions</h3>
            <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline underline-offset-4">
              View All
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-1">
            <TransactionItem name="Water Bill" category="Bills" amount="42.00" date="Mar 30" isPositive={false} />
            <TransactionItem name="Bus Pass" category="Transport" amount="45.00" date="Mar 28" isPositive={false} />
            <TransactionItem name="Pharmacy" category="Healthcare" amount="32.50" date="Mar 27" isPositive={false} />
            <TransactionItem name="Freelance Bonus" category="Freelance" amount="500.00" date="Mar 25" isPositive={true} />
            <TransactionItem name="Clothing Store" category="Shopping" amount="210.00" date="Mar 24" isPositive={false} />
          </div>
        </div>

        {/* Insights Section */}
        <div className="card space-y-8">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Insights</h3>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <PieIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Top Spending Category</p>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Bills — ₹1,741.99</h4>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Monthly Spending Change</p>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">-26.5% vs Last Month</h4>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Search size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Financial Observation</p>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Spending decreased by 26%</h4>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-600 rounded-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-white font-bold">Pro Savings Goal</h4>
              <p className="text-indigo-100 text-xs mt-1">You're 65% of the way there!</p>
              <p className="text-white text-lg font-bold mt-2">₹5,000.00</p>
              <div className="w-full h-1.5 bg-indigo-400/50 rounded-full mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={64} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
