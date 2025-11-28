
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { ChatInterface } from './components/ChatInterface';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Notifications } from './components/Notifications';
import { Splash } from './components/Splash';
import { Onboarding } from './components/Onboarding';
import { Goals } from './components/Goals';
import { Transaction, Category, Notification, Goal, Subscription } from './types';
import { PieChart, MessageSquare, Plus, Bell, Settings as SettingsIcon, Home, Target, Zap, LayoutDashboard, Wallet } from 'lucide-react';

const App: React.FC = () => {
  // App Flow State
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Main App State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'chat' | 'notifications' | 'settings' | 'goals'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // New State for Goals & Subscriptions
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Splash Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      const hasOnboarded = localStorage.getItem('trakit_onboarded');
      if (!hasOnboarded) setShowOnboarding(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('trakit_onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('trakit_onboarded');
    setShowOnboarding(true);
    setActiveTab('dashboard');
  };

  // Data Loading
  useEffect(() => {
    const saved = localStorage.getItem('trakit_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      const initialData: Transaction[] = [
         { id: '1', amount: 50000, description: 'Salary Credit', category: Category.INCOME, date: '2023-10-01', type: 'income' },
         { id: '2', amount: 350, description: 'Starbucks Coffee', category: Category.FOOD, date: '2023-10-02', type: 'expense' },
         { id: '3', amount: 800, description: 'Uber Trip', category: Category.TRAVEL, date: '2023-10-03', type: 'expense' },
         { id: '4', amount: 1200, description: 'Grocery Run', category: Category.ESSENTIALS, date: '2023-10-04', type: 'expense' },
         { id: '5', amount: 499, description: 'Netflix Subscription', category: Category.ENTERTAINMENT, date: '2023-10-05', type: 'expense' },
      ];
      setTransactions(initialData);
    }

    // Mock Notifications
    setNotifications([
       { id: '1', title: 'Welcome to TrakIt!', message: 'Start by adding your first expense.', type: 'tip', date: 'Just now', read: false },
       { id: '2', title: 'Budget Alert', message: 'You have used 80% of your food budget.', type: 'alert', date: '2 hours ago', read: false }
    ]);

    // Mock Goals
    setGoals([
       { id: '1', name: 'New iPhone 15', targetAmount: 80000, currentAmount: 24000, deadline: '2024-06-10', icon: '📱', color: 'text-indigo-600' },
       { id: '2', name: 'Goa Trip', targetAmount: 25000, currentAmount: 5000, deadline: '2024-03-15', icon: '🌴', color: 'text-pink-600' },
       { id: '3', name: 'Emergency Fund', targetAmount: 100000, currentAmount: 65000, deadline: '2024-12-31', icon: '🛡️', color: 'text-emerald-600' }
    ]);

    // Mock Subscriptions
    setSubscriptions([
       { id: '1', name: 'Netflix', amount: 199, dueDate: 15, logo: 'N' },
       { id: '2', name: 'Spotify', amount: 119, dueDate: 22, logo: 'S' },
       { id: '3', name: 'Jio Fiber', amount: 999, dueDate: 5, logo: 'J' }
    ]);

  }, []);

  useEffect(() => {
    localStorage.setItem('trakit_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...newTx, id: Date.now().toString() }, ...prev]);
  };

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Renders
  if (showSplash) return <Splash />;
  if (showOnboarding) return <Onboarding onComplete={completeOnboarding} />;

  return (
    <div className="h-screen w-full flex bg-gradient-mesh font-sans text-slate-900 overflow-hidden">
      
      {/* Desktop Floating Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-[95vh] m-4 glass-panel rounded-[32px] z-30 p-6 shadow-2xl shadow-indigo-100/50">
        <div className="flex items-center gap-3 mb-12 px-2">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-300">
             {/* New Growth Logo */}
             <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                <rect x="20" y="50" width="15" height="30" rx="2" fill="currentColor" fillOpacity="0.8" />
                <rect x="42" y="35" width="15" height="45" rx="2" fill="currentColor" fillOpacity="0.8" />
                <rect x="64" y="20" width="15" height="60" rx="2" fill="currentColor" fillOpacity="0.8" />
                <path d="M15 65 C 30 60, 50 40, 85 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M65 15 H 85 V 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
           </div>
           <span className="text-2xl font-bold tracking-tight text-slate-900 font-heading">TrackIt</span>
        </div>
        
        <nav className="space-y-3 flex-1">
           <SidebarItem icon={<Home size={22} />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
           <SidebarItem icon={<Target size={22} />} label="Goals" isActive={activeTab === 'goals'} onClick={() => setActiveTab('goals')} badge="New" />
           <SidebarItem icon={<PieChart size={22} />} label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
           <SidebarItem icon={<MessageSquare size={22} />} label="AI Assistant" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
           <SidebarItem icon={<Bell size={22} />} label="Notifications" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} badge={notifications.length > 0 ? notifications.length.toString() : undefined} />
           <SidebarItem icon={<SettingsIcon size={22} />} label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        {/* Profile / Bottom Action */}
        <div className="mt-auto">
            <button onClick={() => setShowAddModal(true)} className="group relative w-full overflow-hidden bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-300 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="flex items-center justify-center gap-2 relative z-10">
                <Plus size={20} /> New Expense
              </div>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
         
         {/* Mobile Header */}
         <header className="md:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                 {/* Mobile Logo */}
                 <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white">
                    <rect x="20" y="50" width="15" height="30" rx="2" fill="currentColor" fillOpacity="0.8" />
                    <rect x="42" y="35" width="15" height="45" rx="2" fill="currentColor" fillOpacity="0.8" />
                    <rect x="64" y="20" width="15" height="60" rx="2" fill="currentColor" fillOpacity="0.8" />
                    <path d="M15 65 C 30 60, 50 40, 85 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M65 15 H 85 V 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </div>
               <span className="font-bold text-xl font-heading tracking-tight">TrackIt</span>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setActiveTab('notifications')} className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                  <Bell size={22} />
                  {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>}
               </button>
               <button onClick={() => setShowAddModal(true)} className="p-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors">
                  <Plus size={22} />
               </button>
            </div>
         </header>

         {/* Scrollable View */}
         <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-32 md:pb-8">
            <div className="max-w-6xl mx-auto">
               {activeTab === 'dashboard' && <Dashboard transactions={transactions} subscriptions={subscriptions} onAddClick={() => setShowAddModal(true)} onChatClick={() => setActiveTab('chat')} />}
               {activeTab === 'goals' && <Goals goals={goals} onAddGoal={() => alert("Goal creation modal coming soon!")} />}
               {activeTab === 'analytics' && <Analytics transactions={transactions} />}
               {activeTab === 'chat' && <ChatInterface transactions={transactions} />}
               {activeTab === 'notifications' && <Notifications notifications={notifications} onClear={handleClearNotification} />}
               {activeTab === 'settings' && <Settings onLogout={handleLogout} />}
            </div>
         </div>

         {/* Mobile Bottom Nav (Floating Glass) */}
         <nav className="md:hidden fixed bottom-6 left-4 right-4 glass-panel rounded-2xl p-2 flex justify-between z-40 shadow-2xl shadow-indigo-900/10">
            <MobileNavItem icon={<Home size={24} />} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <MobileNavItem icon={<Target size={24} />} isActive={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
            
            {/* Floating Chat Button Middle */}
            <div className="-mt-12">
               <button onClick={() => setActiveTab('chat')} className={`w-16 h-16 rounded-[20px] flex items-center justify-center shadow-2xl shadow-indigo-500/40 transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-900 text-white'}`}>
                  <MessageSquare size={26} fill={activeTab === 'chat' ? "currentColor" : "none"} />
               </button>
            </div>

            <MobileNavItem icon={<PieChart size={24} />} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <MobileNavItem icon={<SettingsIcon size={24} />} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
         </nav>
      </main>

      {showAddModal && <TransactionForm onSave={addTransaction} onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

// UI Components
const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, badge?: string }> = ({ icon, label, isActive, onClick, badge }) => (
   <button onClick={onClick} className={`group w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900'}`}>
      <div className="flex items-center gap-4">
         <div className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>
             {React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: isActive ? 2.5 : 2 })}
         </div>
         <span className={`font-semibold tracking-wide ${isActive ? 'font-bold' : ''}`}>{label}</span>
      </div>
      {badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{badge}</span>}
   </button>
);

const MobileNavItem: React.FC<{ icon: React.ReactNode, isActive: boolean, onClick: () => void, hasBadge?: boolean }> = ({ icon, isActive, onClick, hasBadge }) => (
   <button onClick={onClick} className={`p-4 rounded-xl relative transition-all duration-300 ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}
      {hasBadge && <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>}
   </button>
);

export default App;
