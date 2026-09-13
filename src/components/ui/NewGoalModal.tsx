import { useState } from 'react';
import { X, Target, Save } from 'lucide-react';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewGoalModal({ isOpen, onClose }: NewGoalModalProps) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui no futuro adicionaremos a mutação do Supabase
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white rounded-[2rem] w-full max-w-md p-6 relative z-10 shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Nova Meta</h2>
              <p className="text-xs text-slate-500">Defina um limite de gastos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Categoria / Nome
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
            >
              <option value="" disabled>Selecione uma categoria...</option>
              <option value="alimentacao">Alimentação</option>
              <option value="lazer">Lazer e Viagens</option>
              <option value="transporte">Transporte</option>
              <option value="compras">Compras Variadas</option>
              <option value="mercado">Mercado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Limite Mensal (R$)
            </label>
            <input 
              type="number" 
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-2 bg-slate-900 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Save className="w-5 h-5" />
            Salvar Meta
          </button>
        </form>
      </div>
    </div>
  );
}

