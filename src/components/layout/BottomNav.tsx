import { Home, FileText, Plus, CreditCard, Users } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center z-40">
      
      {/* Botão Início (Ativo) */}
      <button className="flex flex-col items-center p-2 text-slate-900 w-16 transition-colors">
        <Home className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Início</span>
      </button>

      {/* Botão Faturas */}
      <button className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-600 w-16 transition-colors">
        <FileText className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Faturas</span>
      </button>

      {/* Ação Central FAB (+) */}
      <div className="relative -top-6">
        <button className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:scale-105 transition-transform active:scale-95 cursor-pointer">
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Botão Cartões */}
      <button className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-600 w-16 transition-colors">
        <CreditCard className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Cartões</span>
      </button>

      {/* Botão Pessoas */}
      <button className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-600 w-16 transition-colors">
        <Users className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Pessoas</span>
      </button>
      
    </nav>
  );
}