import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Track Expenses Easily",
      desc: "Log your daily spending in seconds. Our AI categorizes everything for you automatically.",
      color: "bg-indigo-600",
      image: "📊"
    },
    {
      title: "Smart Insights",
      desc: "Get real-time feedback on your budget. Know exactly how much you can spend today.",
      color: "bg-violet-600",
      image: "💡"
    },
    {
      title: "Hit Your Goals",
      desc: "Save for that new phone or trip. TrakIt helps you stay disciplined and grow your savings.",
      color: "bg-teal-500",
      image: "🚀"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      {/* Image Area */}
      <div className={`flex-1 ${steps[step].color} relative overflow-hidden transition-colors duration-500 flex items-center justify-center text-9xl`}>
         <div className="absolute inset-0 bg-black/10"></div>
         <div className="animate-scale-in relative z-10 drop-shadow-2xl filter">
            {steps[step].image}
         </div>
         {/* Decorative Circles */}
         <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-8 relative z-20 p-8 flex flex-col justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="mt-8 text-center animate-slide-up">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{steps[step].title}</h2>
          <p className="text-slate-500 leading-relaxed px-4">{steps[step].desc}</p>
        </div>

        <div className="flex flex-col items-center gap-8 mb-4">
           {/* Dots */}
           <div className="flex gap-2">
              {steps.map((_, i) => (
                 <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === step ? 'bg-slate-900 w-8' : 'bg-slate-200'}`} />
              ))}
           </div>

           {/* Button */}
           <button 
             onClick={handleNext}
             className="w-full bg-slate-900 text-white font-semibold py-4 rounded-2xl shadow-xl shadow-slate-300 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
           >
             {step === steps.length - 1 ? (
                <>Get Started <Check size={20} /></>
             ) : (
                <>Next <ArrowRight size={20} /></>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};