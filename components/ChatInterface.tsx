
import React, { useState, useRef, useEffect } from 'react';
import { Transaction, ChatMessage } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Send, User, ChevronDown, Check } from 'lucide-react';
import { Chat } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  transactions: Transaction[];
}

// Cute "Bottts" style robots (Non-human, friendly AI look)
const AVATAR_OPTIONS = [
  { id: 'sparky', name: 'Sparky', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=b6e3f4' },
  { id: 'gizmo', name: 'Gizmo', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo&backgroundColor=c0aede' },
  { id: 'pixel', name: 'Pixel', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pixel&backgroundColor=ffdfbf' },
  { id: 'nova', name: 'Nova', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nova&backgroundColor=ffd5dc' },
  { id: 'orbit', name: 'Orbit', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=Orbit&backgroundColor=d1d4f9' },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ transactions }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "👋 Beep Boop! Hi! I'm **TrakIt**. Ask me about your spending or for a quick budget tip!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  // Avatar State
  const [currentAvatar, setCurrentAvatar] = useState(AVATAR_OPTIONS[0]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load avatar from local storage
  useEffect(() => {
    const savedAvatarId = localStorage.getItem('trakit_ai_avatar');
    if (savedAvatarId) {
      const found = AVATAR_OPTIONS.find(a => a.id === savedAvatarId);
      if (found) setCurrentAvatar(found);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { text, newChat } = await getFinancialAdvice(chatSession, userMsg.text, transactions);
      if (newChat && !chatSession) setChatSession(newChat);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: text, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "Connection error. Try again.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const changeAvatar = (avatar: typeof AVATAR_OPTIONS[0]) => {
    setCurrentAvatar(avatar);
    localStorage.setItem('trakit_ai_avatar', avatar.id);
    setShowAvatarSelector(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-3xl overflow-hidden glass-card relative shadow-2xl shadow-indigo-100">
      
      {/* Header with Avatar Customization */}
      <div className="p-4 border-b border-slate-100/50 bg-white/60 backdrop-blur-md flex justify-between items-center z-20">
         <div className="flex items-center gap-3 relative">
            
            {/* Clickable Avatar */}
            <button 
              onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              className="relative group outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-md overflow-hidden transition-transform group-hover:scale-105">
                 <img src={currentAvatar.src} alt="AI Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <ChevronDown size={10} className="text-slate-500" />
              </div>
            </button>

            {/* Avatar Selector Dropdown */}
            {showAvatarSelector && (
              <div className="absolute top-12 left-0 w-64 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-3 animate-scale-in z-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Choose Your Bot</p>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => changeAvatar(avatar)}
                      className={`relative rounded-xl overflow-hidden transition-all hover:scale-110 border-2 ${currentAvatar.id === avatar.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent'}`}
                      title={avatar.name}
                    >
                      <img src={avatar.src} alt={avatar.name} className="w-full h-full bg-slate-50" />
                      {currentAvatar.id === avatar.id && (
                        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                           <Check size={12} className="text-indigo-800 drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
               <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                 {currentAvatar.name} <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">BOT</span>
               </h3>
               <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
               </p>
            </div>
         </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-slide-up`}>
             
             {/* Message Avatar */}
             <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border border-white shadow-sm ${msg.role === 'user' ? 'bg-slate-200' : 'bg-white'}`}>
                {msg.role === 'user' ? (
                  <User size={18} className="text-slate-500" />
                ) : (
                  <img src={currentAvatar.src} alt="AI" className="w-full h-full object-cover" />
                )}
             </div>

             {/* Message Bubble */}
             <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-tr-sm' 
                  : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'
             }`}>
                <ReactMarkdown components={{
                  strong: ({node, ...props}) => <span className={`font-bold ${msg.role === 'user' ? 'text-indigo-200' : 'text-indigo-600'}`} {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 my-1 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="" {...props} />
                }}>
                  {msg.text}
                </ReactMarkdown>
                
                {/* Timestamp */}
                <span className={`text-[9px] block mt-1 text-right ${msg.role === 'user' ? 'text-slate-400' : 'text-slate-300'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
             </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-3 ml-1">
             <div className="w-9 h-9 rounded-full bg-white border border-white p-1 overflow-hidden shadow-sm">
                <img src={currentAvatar.src} alt="Thinking" className="w-full h-full object-cover opacity-80" />
             </div>
             <div className="flex gap-1">
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-white/50">
        <div className="relative flex items-center gap-2">
           <input 
             type="text" 
             value={input} 
             onChange={(e) => setInput(e.target.value)} 
             onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
             placeholder={`Ask ${currentAvatar.name} for advice...`} 
             className="flex-1 bg-white border border-slate-200 py-3.5 px-5 rounded-2xl text-sm shadow-inner focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 outline-none placeholder:text-slate-400 transition-all" 
           />
           <button 
             onClick={handleSend} 
             disabled={!input.trim()} 
             className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
           >
              <Send size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};
