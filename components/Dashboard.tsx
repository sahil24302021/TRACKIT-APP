
import React from 'react';
import { Transaction, Subscription } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Sparkles, TrendingUp, Calendar, Zap, Activity, MoreHorizontal, CreditCard, Plus } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  subscriptions: Subscription[];
  onAddClick: () => void;
  onChatClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, subscriptions, onAddClick, onChatClick }) => {
  // --- CALCULATIONS ---
  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
      } else {
        acc.expense += t.amount;
        acc.categoryBreakdown[t.category] = (acc.categoryBreakdown[t.category] || 0) + t.amount;
      }
      return acc;
    },
    { income: 0, expense: 0, categoryBreakdown: {} as Record<string, number> }
  );

  const balance = summary.income - summary.expense;
  const estimatedBudget = summary.income > 0 ? summary.income : 20000;
  const budgetProgress = Math.min((summary.expense / estimatedBudget) * 100, 100);

  // Daily Safe Spend Calculation
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - today.getDate();
  const remainingBudget = Math.max(0, estimatedBudget - summary.expense);
  const safeDailySpend = daysRemaining > 0 ? Math.floor(remainingBudget / daysRemaining) : 0;
  
  const todayStr = today.toISOString().split('T')[0];
  const spentToday = transactions
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Financial Health Score
  let healthScore = 80; 
  if (budgetProgress > 90) healthScore -= 30;
  else if (budgetProgress > 75) healthScore -= 10;
  if (remainingBudget > (estimatedBudget * 0.2)) healthScore += 10;
  healthScore = Math.min(100, Math.max(0, healthScore));

  const pieData = Object.entries(summary.categoryBreakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const highestCategory = pieData[0];

  const getLast7DaysData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      
      const dailyTotal = transactions
        .filter(t => t.date === dayStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({ name: dayName, amount: dailyTotal, fullDate: dayStr });
    }
    return data;
  };
  const trendData = getLast7DaysData();

  return (
    <div className="animate-fade-in pb-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 font-medium">Financial Overview</p>
         </div>
         <button onClick={onChatClick} className="group flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all">
             <Sparkles size={18} className="text-indigo-500 group-hover:animate-pulse" />
             <span className="font-semibold text-sm">Ask AI</span>
         </button>
      </div>

      {/* Main Feature: Total Balance Card */}
      <div className="relative overflow-hidden rounded-[32px] p-8 lg:p-10 shadow-2xl shadow-indigo-500/20 group transition-all duration-500 hover:shadow-indigo-500/30">
         {/* Premium Gradient Background */}
         <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca]"></div>
         
         {/* Abstract Shapes/Texture */}
         <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-[100px] opacity-20 animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-teal-400 rounded-full blur-[80px] opacity-10"></div>
         
         {/* Glass Overlay Pattern */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

         <div className="relative z-10 text-white flex flex-col md:flex-row justify-between md:items-end gap-8">
            <div className="space-y-6 flex-1">
               <div className="flex items-center gap-2 mb-2">
                  <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold tracking-wider text-indigo-100 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> LIVE
                  </div>
               </div>
               
               <div>
                  <p className="text-indigo-200 text-sm font-medium tracking-wider mb-1">TOTAL BALANCE</p>
                  <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
                    ₹{balance.toLocaleString()}
                  </h2>
               </div>

               <div className="flex gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-300">
                       <ArrowUpRight size={20} />
                     </div>
                     <div>
                        <p className="text-xs text-indigo-200 font-medium">Income</p>
                        <p className="text-lg font-bold">₹{summary.income.toLocaleString()}</p>
                     </div>
                  </div>
                  <div className="h-10 w-[1px] bg-white/10"></div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30 text-rose-300">
                       <ArrowDownRight size={20} />
                     </div>
                     <div>
                        <p className="text-xs text-indigo-200 font-medium">Expenses</p>
                        <p className="text-lg font-bold">₹{summary.expense.toLocaleString()}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Financial Health Score Circle */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col items-center min-w-[140px]">
                <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                   <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                      <path className="text-indigo-900/40" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                      <path className={`${healthScore > 75 ? 'text-emerald-400' : 'text-amber-400'} drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]`} strokeDasharray={`${healthScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                   </svg>
                   <span className="absolute text-lg font-bold">{healthScore}</span>
                </div>
                <span className="text-xs font-bold text-indigo-200 tracking-wide uppercase">FinScore</span>
            </div>
         </div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-6">
          <button onClick={onAddClick} className="group relative overflow-hidden bg-slate-900 text-white p-5 rounded-[24px] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
             <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900"></div>
             <div className="relative z-10 flex items-center justify-center gap-3">
                <div className="bg-white/20 p-2 rounded-full group-hover:rotate-90 transition-transform duration-500"><Plus size={20} /></div>
                <span className="text-lg font-bold">Add Expense</span>
             </div>
          </button>
          
          <button className="group relative overflow-hidden bg-white text-slate-800 p-5 rounded-[24px] border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="relative z-10 flex items-center justify-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-full group-hover:scale-110 transition-transform"><Calendar size={20} /></div>
                <span className="text-lg font-bold">Set Budget</span>
             </div>
          </button>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* Daily Safe Limit (Lightning Style) */}
           <div className="glass-panel p-6 rounded-[32px] relative overflow-hidden group glass-card-hover">
               <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl group-hover:bg-amber-400/30 transition-colors"></div>
               
               <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 border border-amber-100 shadow-sm">
                       <Zap size={24} fill="currentColor" />
                   </div>
                   <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">Today</span>
               </div>
               
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Safe to Spend</h3>
               <div className="flex items-baseline gap-1 mb-4">
                   <span className="text-4xl font-extrabold text-slate-900">₹{safeDailySpend}</span>
                   <span className="text-sm font-semibold text-slate-400">/ left</span>
               </div>

               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                       <span>Spent Today</span>
                       <span>₹{spentToday}</span>
                   </div>
                   <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${spentToday > safeDailySpend ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`} 
                         style={{width: `${Math.min((spentToday/safeDailySpend)*100, 100)}%`}}
                       ></div>
                   </div>
               </div>
           </div>

           {/* Monthly Budget (Progress Style) */}
           <div className="glass-panel p-6 rounded-[32px] relative overflow-hidden group glass-card-hover">
               <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-colors"></div>

               <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500 border border-indigo-100 shadow-sm">
                       <CreditCard size={24} />
                   </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${budgetProgress > 100 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {budgetProgress > 100 ? 'Over Limit' : 'On Track'}
                   </span>
               </div>

               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Monthly Budget</h3>
               <div className="flex items-baseline gap-1 mb-4">
                   <span className="text-4xl font-extrabold text-slate-900">₹{remainingBudget.toLocaleString()}</span>
                   <span className="text-sm font-semibold text-slate-400">remaining</span>
               </div>

               <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>0%</span>
                      <span>{Math.round(budgetProgress)}% Used</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-4 p-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
                            budgetProgress > 90 ? 'bg-gradient-to-r from-rose-400 to-rose-600' : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                        }`} 
                        style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                      />
                   </div>
               </div>
           </div>
      </div>

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-[32px]">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      <TrendingUp size={20} className="text-indigo-500" /> Spending Trend
                  </h3>
                  <button className="text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors text-slate-600">Last 7 Days</button>
              </div>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                       <Tooltip 
                          cursor={{ fill: '#f1f5f9', radius: 8 }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                          formatter={(value: number) => [<span className="text-indigo-600 font-bold">₹{value}</span>, <span className="text-slate-500 text-xs">Spent</span>]}
                          labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}
                       />
                       <Bar dataKey="amount" fill="url(#colorBar)" radius={[6, 6, 6, 6]} barSize={32}>
                          {trendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 6 ? '#4f46e5' : '#cbd5e1'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
          </div>

          {/* Recent Transactions List */}
          <div className="glass-panel p-8 rounded-[32px] flex flex-col">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">Recent</h3>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><MoreHorizontal size={20} /></button>
               </div>
               
               <div className="flex-1 space-y-4 overflow-hidden">
                  {transactions.slice(0, 5).map((t) => (
                     <div key={t.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-slate-50">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-105 ${
                              t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                           }`}>
                              {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                           </div>
                           <div>
                              <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{t.description}</p>
                              <p className="text-xs text-slate-400 font-medium mt-0.5">{t.category}</p>
                           </div>
                        </div>
                        <p className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                           {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                        </p>
                     </div>
                  ))}
               </div>
          </div>
      </div>
    </div>
  );
};
