import React, { useState, useEffect } from 'react';
import { Category, Transaction } from '../types';
import { categorizeTransaction } from '../services/geminiService';
import { X, Loader2, CheckCircle2, Save } from 'lucide-react';

interface TransactionFormProps {
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdate?: (transaction: Transaction) => void;
  onClose: () => void;
  initialData?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onUpdate, onClose, initialData }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<Category | 'Auto'>('Auto');
  const [isCategorizing, setIsCategorizing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setDescription(initialData.description);
      setType(initialData.type);
      setCategory(initialData.category);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    let finalCategory = category;

    if (type === 'expense' && category === 'Auto') {
      setIsCategorizing(true);
      finalCategory = await categorizeTransaction(description);
      setIsCategorizing(false);
    } else if (type === 'income') {
      finalCategory = Category.INCOME;
    } else if (category === 'Auto') {
      finalCategory = Category.OTHER;
    }

    const transactionData = {
      amount: parseFloat(amount),
      description,
      type,
      category: finalCategory as Category,
      date: initialData ? initialData.date : new Date().toISOString().split('T')[0],
    };

    if (initialData && onUpdate) {
      onUpdate({ ...transactionData, id: initialData.id });
    } else {
      onSave(transactionData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="glass-card w-full max-w-md rounded-3xl overflow-hidden animate-scale-in relative z-10 shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-100/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">{initialData ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button type="button" onClick={() => setType('expense')} className={`py-3 text-sm font-semibold rounded-xl transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Expense</button>
            <button type="button" onClick={() => setType('income')} className={`py-3 text-sm font-semibold rounded-xl transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Income</button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">₹</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-3xl font-bold text-slate-900 focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none" placeholder="0" autoFocus />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-2 px-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-base font-medium text-slate-900 focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none" placeholder="e.g. Uber to work" />
          </div>

          {type === 'expense' && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category | 'Auto')} className="w-full mt-2 px-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-base font-medium text-slate-900 focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none">
                 <option value="Auto">✨ Auto-Detect (AI)</option>
                 {Object.values(Category).filter(c => c !== Category.INCOME).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
          )}

          <button type="submit" disabled={isCategorizing || !amount} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center gap-2">
            {isCategorizing ? <Loader2 className="animate-spin" /> : initialData ? <Save /> : <CheckCircle2 />}
            {initialData ? 'Update' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};