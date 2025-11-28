
import React, { useState } from 'react';
import { User, Shield, Bell, Moon, LogOut, ChevronRight, CreditCard, HelpCircle, Globe, Users, WifiOff, X, Mail, Phone, Calendar } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
  // Local state for toggles to show interactivity
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const handleNavigation = (feature: string) => {
    if (feature === 'Account Information') {
        setShowAccountModal(true);
    } else {
        // In a real app, this would navigate to a new route
        alert(`${feature} settings coming soon! 🚧`);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-24">
       <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

       {/* Profile Card */}
       <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
             <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600">JD</span>
             </div>
          </div>
          <div className="flex-1">
             <h3 className="font-bold text-slate-900">John Doe</h3>
             <p className="text-xs text-slate-500">Free Plan • Indian Student</p>
          </div>
          <button onClick={() => setShowAccountModal(true)} className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors">Edit</button>
       </div>

       {/* Menu Groups */}
       <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">General</h4>
          <div className="glass-card rounded-2xl overflow-hidden">
             <MenuItem icon={<User size={18} />} label="Account Information" onClick={() => handleNavigation('Account Information')} />
             <div className="h-[1px] bg-slate-100 mx-4" />
             <MenuItem icon={<CreditCard size={18} />} label="Budget Limits" onClick={() => handleNavigation('Budget Limits')} />
             <div className="h-[1px] bg-slate-100 mx-4" />
             <MenuItem icon={<Globe size={18} />} label="Currency" badge="INR (₹)" onClick={() => handleNavigation('Currency')} />
             <div className="h-[1px] bg-slate-100 mx-4" />
             <MenuItem 
                icon={<Bell size={18} />} 
                label="Notifications" 
                badge={notifications ? "On" : "Off"} 
                onClick={() => setNotifications(!notifications)} 
             />
          </div>

          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 mt-6">Pro Features</h4>
           <div className="glass-card rounded-2xl overflow-hidden">
             <MenuItem icon={<Users size={18} />} label="Family Sharing" badge="Pro" onClick={() => handleNavigation('Family Sharing')} />
             <div className="h-[1px] bg-slate-100 mx-4" />
             <MenuItem 
                icon={<WifiOff size={18} />} 
                label="Offline Mode" 
                toggle 
                isActive={offlineMode} 
                onClick={() => setOfflineMode(!offlineMode)} 
             />
           </div>

          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 mt-6">Preferences</h4>
          <div className="glass-card rounded-2xl overflow-hidden">
             <MenuItem icon={<Shield size={18} />} label="Security" onClick={() => handleNavigation('Security')} />
             <div className="h-[1px] bg-slate-100 mx-4" />
             <MenuItem 
                icon={<Moon size={18} />} 
                label="Dark Mode" 
                toggle 
                isActive={darkMode} 
                onClick={() => setDarkMode(!darkMode)} 
             />
             <div className="h-[1px] bg-slate-100 mx-4" />
             <MenuItem icon={<HelpCircle size={18} />} label="Help & Support" onClick={() => handleNavigation('Help & Support')} />
          </div>
       </div>
       
       <button 
         onClick={onLogout}
         className="w-full py-4 text-rose-500 font-semibold text-sm bg-rose-50 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors mt-4 active:scale-95"
       >
          <LogOut size={18} /> Sign Out
       </button>

       <p className="text-center text-xs text-slate-400 mt-6">TrakIt v1.5.0 • Build 2024</p>

       {/* Account Modal */}
       {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAccountModal(false)}></div>
            <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 animate-scale-in shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Account Info</h3>
                  <button onClick={() => setShowAccountModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
               </div>
               
               <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 mb-3">
                     <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-3xl font-bold text-indigo-600">JD</span>
                     </div>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">John Doe</h2>
                  <p className="text-sm text-slate-500">Student • Free Plan</p>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm"><Mail size={18} /></div>
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Email</p>
                        <p className="font-semibold text-slate-700">john.doe@example.com</p>
                     </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm"><Phone size={18} /></div>
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Phone</p>
                        <p className="font-semibold text-slate-700">+91 98765 43210</p>
                     </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm"><Calendar size={18} /></div>
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Member Since</p>
                        <p className="font-semibold text-slate-700">October 2023</p>
                     </div>
                  </div>
               </div>

               <button className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-transform">
                  Update Profile
               </button>
            </div>
         </div>
       )}
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  toggle?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, badge, toggle, isActive, onClick }) => (
   <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100 outline-none text-left">
      <div className="flex items-center gap-3 text-slate-600">
         {icon}
         <span className="text-sm font-medium text-slate-800">{label}</span>
      </div>
      <div className="flex items-center gap-2">
         {badge && <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge === 'Pro' ? 'bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900' : 'bg-indigo-100 text-indigo-600'}`}>{badge}</span>}
         {toggle ? (
            <div className={`w-10 h-6 rounded-full relative transition-colors ${isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'left-5' : 'left-1'}`}></div>
            </div>
         ) : (
            <ChevronRight size={16} className="text-slate-400" />
         )}
      </div>
   </button>
);
