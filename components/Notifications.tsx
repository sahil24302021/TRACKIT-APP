import React from 'react';
import { Notification } from '../types';
import { Bell, Info, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface NotificationsProps {
  notifications: Notification[];
  onClear: (id: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onClear }) => {
  return (
    <div className="animate-fade-in space-y-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
           <p className="text-sm text-slate-500">Updates & Insights</p>
        </div>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl relative">
           <Bell size={20} />
           {notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <Bell size={24} className="opacity-40" />
            </div>
            <p>You're all caught up!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="glass-card p-4 rounded-2xl flex gap-4 relative group hover:scale-[1.01] transition-transform">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.type === 'alert' ? 'bg-rose-100 text-rose-600' :
                  n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-indigo-100 text-indigo-600'
               }`}>
                  {n.type === 'alert' ? <AlertTriangle size={18} /> : 
                   n.type === 'success' ? <CheckCircle size={18} /> : 
                   <Info size={18} />}
               </div>
               <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{n.date}</span>
               </div>
               <button 
                  onClick={() => onClear(n.id)}
                  className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
               >
                  <X size={14} />
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};