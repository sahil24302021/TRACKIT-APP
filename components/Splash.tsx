
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Splash: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-indigo-600 flex flex-col items-center justify-center z-50 text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="animate-scale-in flex flex-col items-center relative z-10">
        <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-indigo-900/40 flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-500 border border-white/20">
           {/* Custom Growth Logo matching the requested image concept */}
           <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white drop-shadow-md">
              {/* Bars */}
              <rect x="20" y="50" width="15" height="30" rx="2" fill="currentColor" fillOpacity="0.8" />
              <rect x="42" y="35" width="15" height="45" rx="2" fill="currentColor" fillOpacity="0.8" />
              <rect x="64" y="20" width="15" height="60" rx="2" fill="currentColor" fillOpacity="0.8" />
              {/* Rising Arrow */}
              <path d="M15 65 C 30 60, 50 40, 85 15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M65 15 H 85 V 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 font-heading text-white drop-shadow-sm">TrackIt</h1>
        <p className="text-indigo-200 text-sm font-medium tracking-wide opacity-90 font-sans uppercase">Your Growth Partner</p>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-indigo-300" size={24} />
      </div>
    </div>
  );
};
