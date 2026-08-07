import { Home, FileText, Plus, CreditCard, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation(); // Pega a URL atual (ex: "/faturas")

  // Função simples para saber se a cor do botão deve ser preta (ativo) ou cinza (inativo)
  const getIconClass = (path: string) => {
    return location.pathname === path 
      ? "flex flex-col items-center p-2 text-slate-900 w-16 transition-colors" 
      : "flex flex-col items-center p-2 text-slate-400 hover:text-slate-600 w-16 transition-colors";
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center z-40">
      
      <Link to="/" className={getIconClass("/")}>
        <Home className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Início</span>
      </Link>

      <Link to="/faturas" className={getIconClass("/faturas")}>
        <FileText className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Faturas</span>
      </Link>

      {/* Ação Central FAB (+) */}
      <div className="relative -top-6">
        <button className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:scale-105 transition-transform active:scale-95 cursor-pointer">
          <Plus className="w-7 h-7" />
        </button>
      </div>

      <Link to="/cartoes" className={getIconClass("/cartoes")}>
        <CreditCard className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Cartões</span>
      </Link>

      <Link to="/pessoas" className={getIconClass("/pessoas")}>
        <Users className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Pessoas</span>
      </Link>
      
    </nav>
  );
}