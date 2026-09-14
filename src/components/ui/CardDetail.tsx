import { Settings, Calendar, CreditCard as CardIcon, Nfc } from "lucide-react";
import type { MockCard } from "../../data/spendifyMocks";
import { usePrivacyContext } from "../../hooks/PrivacyContext";
import { formatCurrency } from "../../lib/utils";

interface CardDetailProps {
  card: MockCard;
  onConfigure: (card: MockCard) => void;
}

export function CardDetail({ card, onConfigure }: CardDetailProps) {
  const { formatPrivate } = usePrivacyContext();

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden mb-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      {/* Header do Cartão com Gradiente Temático */}
      <div
        className={`p-6 text-white flex justify-between items-center bg-gradient-to-r ${card.color_theme}`}
      >
        <div>
          <h3 className="text-xl font-black tracking-wide leading-none uppercase">
            {card.brand || card.name}
          </h3>
          <p className="text-xs opacity-80 font-mono mt-1.5 tracking-wider">
            •••• {card.last4}
          </p>
        </div>
        <Nfc className="w-8 h-8 opacity-75 shrink-0" />
      </div>

      {/* Corpo com Limites e Datas */}
      <div className="p-6">
        {/* Limite do Cartão vs Disponível */}
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Limite do Cartão
            </p>
            <p className="text-xl font-black text-slate-900 tracking-tight">
              {formatPrivate(card.total_limit, formatCurrency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Disponível
            </p>
            <p className="text-xl font-black text-emerald-600 tracking-tight">
              {formatPrivate(card.available_limit, formatCurrency)}
            </p>
          </div>
        </div>

        {/* Caixas de Data (Fecha Dia / Vence Dia com design do protótipo) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
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

        {/* Botão de Ação Configurar Cartão */}
        <button
          onClick={() => onConfigure(card)}
          className="w-full bg-slate-50 hover:bg-slate-100 active:scale-[0.99] text-slate-700 border border-slate-200/80 py-3.5 rounded-2xl text-xs font-black flex justify-center items-center gap-2 transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          Configurar Cartão
        </button>
      </div>
    </div>
  );
}
