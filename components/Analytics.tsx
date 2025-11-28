
import React from 'react';
import { Transaction, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingDown, TrendingUp, Calendar, Clock } from 'lucide-react';

interface AnalyticsProps {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#64748b'];

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  // Aggregate data logic
  const categoryData = Object.values(Category).filter(c => c !== Category.INCOME).map(cat => {
    const total = transactions
      .filter(t => t.category === cat && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: total };
  }).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const weeklyData = [
    { name: 'Mon', income: 4000, expense: 2400 },
    { name: 'Tue', income: 3000, expense: 1398 },
    { name: 'Wed', income: 2000, expense: 9800 },
    { name: 'Thu', income: 2780, expense: 3908 },
    { name: 'Fri', income: 1890, expense: 4800 },
    { name: 'Sat', income: 2390, expense: 3800 },
    { name: 'Sun', income: 3490, expense: 4300 },
  ]; 

  // Weekend vs Weekday Analysis
  const weekdayTotal = transactions
    .filter(t => {
      const day = new Date(t.date).getDay();
      return day !== 0 && day !== 6 && t.type === 'expense';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const weekendTotal = transactions
    .filter(t => {
      const day = new Date(t.date).getDay();
      return (day === 0 || day === 6) && t.type === 'expense';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="animate-fade-in space-y-8 pb-24">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold bg-white rounded-lg shadow-sm border border-slate-100 text-slate-600">Week</button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 text-white">Month</button>
         </div>
      </div>

      {/* Spend Flow Chart */}
      <div className="glass-card p-6 rounded-3xl">
         <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-500" /> Cash Flow</h3>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <Tooltip contentStyle={{borderRadius: '12px', border:'none', boxShadow:'0 10px 40px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="#6366f1" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Spending Patterns */}
      <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Clock size={16} className="text-indigo-500" /> Spending Patterns</h3>
          <div className="flex items-center gap-6">
             <div className="flex-1 space-y-2">
                 <div className="flex justify-between text-xs text-slate-500">
                    <span>Weekday (Mon-Fri)</span>
                    <span className="font-bold text-slate-800">₹{weekdayTotal.toLocaleString()}</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(weekdayTotal / (weekdayTotal + weekendTotal)) * 100}%` }}></div>
                 </div>
             </div>
             <div className="flex-1 space-y-2">
                 <div className="flex justify-between text-xs text-slate-500">
                    <span>Weekend (Sat-Sun)</span>
                    <span className="font-bold text-slate-800">₹{weekendTotal.toLocaleString()}</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(weekendTotal / (weekdayTotal + weekendTotal)) * 100}%` }}></div>
                 </div>
             </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
             {weekendTotal > weekdayTotal ? "You tend to spend more on weekends. 🎉" : "Your spending is concentrated on weekdays. 💼"}
          </p>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Top Categories</h3>
            <div className="flex items-center gap-4">
               <div className="w-1/2 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={categoryData}
                           innerRadius={40}
                           outerRadius={60}
                           paddingAngle={5}
                           dataKey="value"
                           stroke="none"
                        >
                           {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="w-1/2 space-y-2">
                  {categoryData.slice(0, 4).map((cat, i) => (
                     <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full" style={{background: COLORS[i % COLORS.length]}}></span>
                           <span className="text-slate-600">{cat.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900">₹{cat.value}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
         
         <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Smart Insights</h3>
            <div className="space-y-4">
               <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                     You spent <strong>15% less</strong> on Food compared to last week. Great job! 🍔
                  </p>
               </div>
               <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-xs text-rose-700 font-medium leading-relaxed">
                     Shopping expenses are rising. Consider setting a limit of ₹2,000 for next week. 🛍️
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
