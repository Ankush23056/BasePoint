import React, { useState, useEffect, useMemo } from 'react';
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
  IndianRupee
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

const INITIAL_TRANSACTIONS = [
  { id: 1, name: 'Water Bill', category: 'Bills', amount: 42.00, date: 'Mar 30', type: 'Expense', isPositive: false },
  { id: 2, name: 'Bus Pass', category: 'Transport', amount: 45.00, date: 'Mar 28', type: 'Expense', isPositive: false },
  { id: 3, name: 'Pharmacy', category: 'Healthcare', amount: 32.50, date: 'Mar 27', type: 'Expense', isPositive: false },
  { id: 4, name: 'Freelance Bonus', category: 'Freelance', amount: 500.00, date: 'Mar 25', type: 'Income', isPositive: true },
  { id: 5, name: 'Clothing Store', category: 'Shopping', amount: 210.00, date: 'Mar 24', type: 'Expense', isPositive: false },
];

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
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
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
        {isPositive ? '+' : '-'}₹{amount.toLocaleString()}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePieIndex, setActivePieIndex] = useState(null);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('basepoint_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('basepoint_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const stats = useMemo(() => {
    const income = transactions.reduce((acc, curr) => curr.isPositive ? acc + curr.amount : acc, 0);
    const expenses = transactions.reduce((acc, curr) => !curr.isPositive ? acc + curr.amount : acc, 0);
    const startingBalance = 10000; // Baseline
    return {
      balance: startingBalance + income - expenses,
      income,
      expenses
    };
  }, [transactions]);

  const pieData = useMemo(() => {
    const categories = {};
    transactions.forEach(t => {
      if (!t.isPositive) {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#94a3b8'
    }));
  }, [transactions]);

  // Generate data points for the trend chart
  const lineData = useMemo(() => {
    // We'll simulate a 6-month historical trend and add the current month's dynamic activity
    const historical = [
      { name: 'Oct', value: 8500 },
      { name: 'Nov', value: 9200 },
      { name: 'Dec', value: 8800 },
      { name: 'Jan', value: 9600 },
      { name: 'Feb', value: 10000 },
    ];
    return [...historical, { name: 'Mar', value: stats.balance }];
  }, [stats.balance]);

  const addTransaction = (newTx) => {
    setTransactions([newTx, ...transactions]);
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addTransaction}
      />

      {/* 3 Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Balance" 
          amount={`₹${stats.balance.toLocaleString()}`} 
          icon={<IndianRupee size={22} />} 
          iconBg="bg-blue-50 dark:bg-blue-900/20" 
          iconColor="text-blue-600 dark:text-blue-400"
          trend="+4.2%"
          trendLabel="from last month"
        />
        <StatCard 
          title="Total Income" 
          amount={`₹${stats.income.toLocaleString()}`} 
          icon={<TrendingUp size={22} />} 
          iconBg="bg-emerald-50 dark:bg-emerald-900/20" 
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend="+12.5%"
          trendLabel="from last month"
        />
        <StatCard 
          title="Total Expenses" 
          amount={`₹${stats.expenses.toLocaleString()}`} 
          icon={<TrendingDown size={22} />} 
          iconBg="bg-rose-50 dark:bg-rose-900/20" 
          iconColor="text-rose-600 dark:text-rose-400"
          trend="-1.2%"
          trendLabel="from last month"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Trend Line Chart */}
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
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.4} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} 
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                  activeDot={{ r: 6, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Spending Category Donut Chart */}
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="card flex flex-col">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-8">Spending by Category</h3>
          <div className="flex-1 w-full flex items-center justify-center relative min-h-[250px] sm:min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={5}
                    dataKey="value"
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        style={{ outline: "none", cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center transition-all">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {activePieIndex !== null ? pieData[activePieIndex].name : 'Overall'}
                  </p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    ₹{activePieIndex !== null ? pieData[activePieIndex].value.toLocaleString() : stats.expenses.toLocaleString()}
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
        </motion.div>
      </div>

        {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="card lg:col-span-2">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Recent Transactions</h3>
              <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline underline-offset-4">
                View All
                <ArrowRight size={14} />
              </button>
           </div>
           <div className="space-y-1">
              {transactions.slice(0, 5).map(tx => (
                <TransactionItem key={tx.id} {...tx} />
              ))}
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
                    {pieData.length > 0 ? `${pieData.sort((a,b) => b.value - a.value)[0].name} — ₹${pieData[0].value.toLocaleString()}` : 'None'}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <TrendingDown size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Monthly Spending</p>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">₹{stats.expenses.toLocaleString()} this month</h4>
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
                <p className="text-white text-lg font-bold mt-2">₹{stats.balance.toLocaleString()}</p>
                <div className="w-full h-1.5 bg-indigo-400/50 rounded-full mt-4">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min((stats.balance / 20000) * 100, 100)}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
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
