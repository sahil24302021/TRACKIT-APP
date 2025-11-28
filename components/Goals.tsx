
import React from 'react';
import { Goal } from '../types';
import { Target, Calendar, TrendingUp, Plus, Sparkles } from 'lucide-react';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: () => void;
}

export const Goals: React.FC<GoalsProps> = ({ goals, onAddGoal }) => {
  const calculateDailySave = (goal: Goal) => {
    const today = new Date();
    const target = new Date(goal.deadline);
    const diffTime = Math.abs(target.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const remaining = goal.targetAmount - goal.currentAmount;
    
    if (diffDays <= 0 || remaining <= 0) return 0;
    return Math.ceil(remaining / diffDays);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-24">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Savings Goals</h1>
           <p className="text-sm text-slate-500">Dream big, save smart.</p>
        </div>
        <button onClick={onAddGoal} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform">
           <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const dailySave = calculateDailySave(goal);
          
          return (
            <div key={goal.id} className="glass-card p-6 rounded-3xl relative overflow-hidden group">
               {/* Background Accent */}
               <div className={`absolute top-0 right-0 w-32 h-32 ${goal.color.replace('text-', 'bg-').replace('600', '100')} rounded-bl-full opacity-50 transition-transform group-hover:scale-110`}></div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <div className={`w-12 h-12 rounded-2xl ${goal.color.replace('text-', 'bg-').replace('600', '100')} flex items-center justify-center text-2xl shadow-sm`}>
                        {goal.icon}
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target</p>
                        <p className="text-lg font-bold text-slate-900">₹{goal.targetAmount.toLocaleString()}</p>
                     </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-1">{goal.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-6">
                     <Calendar size={12} /> Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>

                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-semibold">
                        <span className={goal.color}>{Math.round(progress)}% Saved</span>
                        <span className="text-slate-600">₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                           className={`h-full rounded-full transition-all duration-1000 ${goal.color.replace('text-', 'bg-')}`} 
                           style={{ width: `${progress}%` }}
                        ></div>
                     </div>
                  </div>

                  {progress < 100 && (
                     <div className="mt-6 p-3 bg-white/60 backdrop-blur-md rounded-xl border border-white/50 flex items-start gap-3">
                        <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                           <Sparkles size={14} />
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                           <span className="font-bold text-indigo-600">AI Tip:</span> Save <span className="font-bold text-slate-900">₹{dailySave}/day</span> to reach this goal by {new Date(goal.deadline).toLocaleDateString(undefined, {month:'short', day:'numeric'})}.
                        </p>
                     </div>
                  )}
               </div>
            </div>
          );
        })}

        {/* Create New Placeholder */}
        <button onClick={onAddGoal} className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all min-h-[250px]">
           <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Plus size={24} />
           </div>
           <span className="font-bold">Create New Goal</span>
        </button>
      </div>
    </div>
  );
};
