import { Plus, UserPlus } from "lucide-react";

export function People() {
  return (
    <div className="fade-in block px-4 sm:px-6 pb-6 pt-2" data-testid="people-view">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pessoas
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Divisão de despesas, compras compartilhadas e cobranças
          </p>
        </div>
        <button
          onClick={() => alert("Adicionar nova pessoa")}
          className="bg-slate-950 hover:bg-slate-800 active:scale-95 text-white px-3.5 sm:px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md shadow-slate-950/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nova
        </button>
      </div>

      {/* Placeholder amigável e ergonômico */}
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
          <UserPlus className="w-7 h-7" />
        </div>
        <h3 className="font-extrabold text-base text-slate-900 mb-1">
          Nenhuma pessoa vinculada
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mb-5">
          Cadastre contatos para rachar faturas, rastrear quem já pagou e acompanhar valores a receber.
        </p>
        <button
          onClick={() => alert("Em breve: Gerenciamento completo de Pessoas")}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
        >
          Cadastrar Pessoa
        </button>
      </div>
    </div>
  );
}

export default People;
