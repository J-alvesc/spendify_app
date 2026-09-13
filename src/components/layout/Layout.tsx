import { Outlet, NavLink } from "react-router-dom";
import { Home, FileText, CreditCard, Users, Plus, Zap, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { spendifyApi } from "../../lib/api";
import { NewTransactionModal } from "../ui/NewTransactionModal";
import { usePrivacyContext } from "../../hooks/PrivacyContext";

export function Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hideValues, toggleHideValues } = usePrivacyContext();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return null;
      return await spendifyApi.getProfile(session.user.id);
    },
  });

  const score = 850; // Futuramente: profile?.score || 850

  const getScoreTheme = (s: number) => {
    if (s >= 800) {
      return {
        wrapper: "from-emerald-100 to-teal-50 border-emerald-200",
        text: "text-emerald-800",
        icon: "text-emerald-600 fill-emerald-600",
        pingBg: "bg-emerald-400",
        dotBg: "bg-emerald-500",
      };
    }
    if (s >= 500) {
      return {
        wrapper: "from-amber-100 to-yellow-50 border-amber-200",
        text: "text-amber-800",
        icon: "text-amber-600 fill-amber-600",
        pingBg: "bg-amber-400",
        dotBg: "bg-amber-500",
      };
    }
    if (s >= 250) {
      return {
        wrapper: "from-orange-100 to-amber-50 border-orange-200",
        text: "text-orange-800",
        icon: "text-orange-600 fill-orange-600",
        pingBg: "bg-orange-400",
        dotBg: "bg-orange-500",
      };
    }
    return {
      wrapper: "from-red-100 to-rose-50 border-red-200",
      text: "text-red-800",
      icon: "text-red-600 fill-red-600",
      pingBg: "bg-red-400",
      dotBg: "bg-red-500",
    };
  };

  const theme = getScoreTheme(score);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 relative selection:bg-purple-200">
      {/* Header Global */}
      <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-30">
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            Bom dia 👋
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
            {profile?.name?.split(" ")[0] || "Jordan"}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Botão de Ocultar/Exibir Valores */}
          <button
            onClick={toggleHideValues}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-95"
            title={hideValues ? "Mostrar valores" : "Ocultar valores"}
            aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
          >
            {hideValues ? (
              <EyeOff className="w-4 h-4 text-purple-600" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          {/* Badge de Score Financeiro */}
          <div
            className={`bg-gradient-to-r ${theme.wrapper} border px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm relative group cursor-pointer transition-transform duration-200 active:scale-95`}
            title="Seu Spendify Score de crédito e saúde financeira"
          >
            <div className="absolute -top-1 -right-1 flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.pingBg} opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${theme.dotBg}`}
              ></span>
            </div>
            <Zap className={`w-4 h-4 ${theme.icon}`} />
            <span className={`text-sm font-bold ${theme.text}`}>{score}</span>
          </div>

          {/* Avatar com Borda */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-[2px] shadow-sm">
            <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-black text-slate-700">
                  {profile?.name?.charAt(0) || "J"}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo das Páginas (Dashboard, Faturas, etc) */}
      <main>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-40 pb-safe">
        <div className="flex items-center justify-around px-2 h-20">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`
            }
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">Início</span>
          </NavLink>

          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`
            }
          >
            <FileText className="w-6 h-6" />
            <span className="text-[10px] font-bold">Faturas</span>
          </NavLink>

          {/* Central FAB */}
          <div className="relative -top-6">
            <button
              data-testid="fab-button"
              onClick={() => setIsModalOpen(true)}
              className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <NavLink
            to="/cards"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`
            }
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-[10px] font-bold">Cartões</span>
          </NavLink>

          <NavLink
            to="/people"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`
            }
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-bold">Pessoas</span>
          </NavLink>
        </div>
      </nav>

      {/* Modal */}
      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
