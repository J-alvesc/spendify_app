import { Settings, Calendar, CreditCard as CardIcon, Nfc, FileText, Sparkles } from "lucide-react";
import type { MockCard } from "../../data/spendifyMocks";
import { usePrivacyContext } from "../../hooks/PrivacyContext";
import { formatCurrency } from "../../lib/utils";

interface CardDetailProps {
  card: MockCard;
  onConfigure: (card: MockCard) => void;
  onViewInvoice?: (card: MockCard) => void;
  isBestDayToBuy?: boolean;
}

export function CardDetail({
  card,
  onConfigure,
  onViewInvoice,
  isBestDayToBuy,
}: CardDetailProps) {
  const { formatPrivate } = usePrivacyContext();

  const total = card.total_limit || 1;
  const available = card.available_limit || 0;
  const used = Math.max(0, total - available);
  const usagePercentage = Math.min(100, Math.max(0, Math.round((used / total) * 100)));

  // Cores dinâmicas de uso do limite
  const usageColor =
    usagePercentage >= 85
      ? "bg-rose-500"
      : usagePercentage >= 65
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden mb-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      {/* Header do Cartão com Gradiente Temático e Efeito Holográfico/Luminoso */}
      <div
        className={`p-6 text-white flex justify-between items-center bg-gradient-to-r ${card.color_theme} relative overflow-hidden`}
      >
        {/* Reflexo luminoso sutil */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-black tracking-wide leading-none uppercase">
              {card.brand || card.name}
            </h3>
            {isBestDayToBuy && (
              <span className="bg-emerald-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" /> Melhor Compra
              </span>
            )}
          </div>
          <p className="text-xs opacity-80 font-mono tracking-wider">
            •••• {card.last4}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black tracking-widest uppercase opacity-75">
            {card.bank_name?.split(" ")[0] || "CRÉDITO"}
          </span>
          <Nfc className="w-8 h-8 opacity-80 shrink-0" />
        </div>
      </div>

      {/* Corpo com Limites, Barra de Progresso e Datas */}
      <div className="p-6">
        {/* Limite do Cartão vs Disponível */}
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
              Limite do Cartão
            </p>
            <p className="text-xl font-black text-slate-900 tracking-tight">
              {formatPrivate(card.total_limit, formatCurrency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
              Disponível
            </p>
            <p className="text-xl font-black text-emerald-600 tracking-tight">
              {formatPrivate(card.available_limit, formatCurrency)}
            </p>
          </div>
        </div>

        {/* Mini barra de uso individual do limite */}
        <div className="mb-5">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
            <div
              className={`h-full ${usageColor} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.max(3, usagePercentage)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>{usagePercentage}% utilizado</span>
            <span>{formatPrivate(used, formatCurrency)} em compras</span>
          </div>
        </div>

        {/* Informações de Ciclo da Fatura */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50/80 rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-slate-200/70 text-slate-600 flex items-center justify-center shrink-0">
              <CardIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">
                Fecha Dia
              </p>
              <p className="text-base font-black text-slate-900 leading-tight">
                {card.closing_day.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
          <div className="bg-slate-50/80 rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-slate-200/70 text-slate-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">
                Vence Dia
              </p>
              <p className="text-base font-black text-slate-900 leading-tight">
                {card.due_day.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação: Ver Fatura + Configurar Cartão */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onViewInvoice && onViewInvoice(card)}
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white py-3.5 rounded-2xl text-xs font-black flex justify-center items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            Ver Fatura
          </button>
          <button
            type="button"
            onClick={() => onConfigure(card)}
            className="w-full bg-slate-50 hover:bg-slate-100 active:scale-[0.99] text-slate-700 border border-slate-200/80 py-3.5 rounded-2xl text-xs font-black flex justify-center items-center gap-2 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            Configurar Cartão
          </button>
        </div>
      </div>
    </div>
  );
}
